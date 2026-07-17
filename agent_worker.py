#!/usr/bin/env python3
import os
import json
import subprocess
import logging
import requests
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv("/opt/agent-workspace/.env")

# ── Configuration ───────────────────────────────────────────
JIRA_DOMAIN    = os.getenv("JIRA_DOMAIN")
JIRA_EMAIL     = os.getenv("JIRA_EMAIL")
JIRA_TOKEN     = os.getenv("JIRA_API_TOKEN")
JIRA_PROJECT   = os.getenv("JIRA_PROJECT_KEY", "TRIP")
AGENT_LABEL    = os.getenv("AGENT_LABEL", "Agent")
WORKSPACE      = os.getenv("WORKSPACE_DIR")
GITHUB_TOKEN   = os.getenv("GITHUB_TOKEN")
GITHUB_REPO    = os.getenv("GITHUB_REPO")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

LOG_DIR = "/var/log/antigravity"
os.makedirs(LOG_DIR, exist_ok=True)
logging.basicConfig(
    filename=f"{LOG_DIR}/agent_{datetime.now().strftime('%Y%m%d')}.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
log = logging.getLogger(__name__)

JIRA_AUTH = (JIRA_EMAIL, JIRA_TOKEN)
JIRA_HEADERS = {"Content-Type": "application/json"}

# Backoff file: written when a token-limit error occurs.
# Agent will pause for TOKEN_LIMIT_BACKOFF_MINUTES before retrying.
BACKOFF_FILE = "/var/log/antigravity/token_limit_backoff.txt"
TOKEN_LIMIT_BACKOFF_MINUTES = 60


class TokenLimitError(Exception):
    """Raised when the Gemini API returns a rate-limit / quota-exceeded error."""
    pass


# ══════════════════════════════════════════════════════════════
#  JIRA HELPERS
# ══════════════════════════════════════════════════════════════

def jira_search(jql, max_results=5):
    """Search Jira with JQL and return issues."""
    url = f"https://{JIRA_DOMAIN}/rest/api/3/search/jql"
    resp = requests.get(url, auth=JIRA_AUTH, params={"jql": jql, "maxResults": max_results})
    resp.raise_for_status()
    return resp.json().get("issues", [])


def jira_get_issue(ticket_id):
    """Get full issue details including comments."""
    url = f"https://{JIRA_DOMAIN}/rest/api/2/issue/{ticket_id}?expand=renderedFields"
    resp = requests.get(url, auth=JIRA_AUTH)
    resp.raise_for_status()
    return resp.json()


def jira_add_comment(ticket_id, comment_body):
    """Add a comment to a Jira ticket."""
    url = f"https://{JIRA_DOMAIN}/rest/api/2/issue/{ticket_id}/comment"
    resp = requests.post(url, auth=JIRA_AUTH, headers=JIRA_HEADERS,
                         json={"body": comment_body})
    resp.raise_for_status()
    log.info(f"Comment added to {ticket_id}")


def jira_transition(ticket_id, target_status):
    """Transition a Jira ticket to a target status name."""
    url = f"https://{JIRA_DOMAIN}/rest/api/2/issue/{ticket_id}/transitions"
    resp = requests.get(url, auth=JIRA_AUTH)
    transitions = resp.json().get("transitions", [])

    target = next((t for t in transitions
                   if t["name"].lower() == target_status.lower()), None)
    if not target:
        log.error(f"Cannot find transition '{target_status}' for {ticket_id}. "
                  f"Available: {[t['name'] for t in transitions]}")
        return False

    requests.post(url, auth=JIRA_AUTH, headers=JIRA_HEADERS,
                  json={"transition": {"id": target["id"]}})
    log.info(f"{ticket_id} transitioned to '{target_status}'")
    return True


def jira_get_comments(ticket_id):
    """Get all comments on a ticket."""
    url = f"https://{JIRA_DOMAIN}/rest/api/2/issue/{ticket_id}/comment"
    resp = requests.get(url, auth=JIRA_AUTH)
    resp.raise_for_status()
    return resp.json().get("comments", [])


# ══════════════════════════════════════════════════════════════
#  BACKOFF HELPERS
# ══════════════════════════════════════════════════════════════

def is_in_backoff():
    """Return True if the agent is within the token-limit cooldown window."""
    if not os.path.exists(BACKOFF_FILE):
        return False
    try:
        with open(BACKOFF_FILE) as f:
            timestamp = datetime.fromisoformat(f.read().strip())
        remaining = (timestamp + timedelta(minutes=TOKEN_LIMIT_BACKOFF_MINUTES)) - datetime.now()
        if remaining.total_seconds() > 0:
            log.info(f"[BACKOFF] Token-limit cooldown active. "
                     f"{int(remaining.total_seconds() // 60)} min remaining. Skipping run.")
            return True
        # Cooldown expired — remove the file
        os.remove(BACKOFF_FILE)
        return False
    except Exception as e:
        log.warning(f"[BACKOFF] Could not read backoff file: {e}")
        return False


def set_backoff():
    """Record the current time as the start of a token-limit cooldown."""
    with open(BACKOFF_FILE, "w") as f:
        f.write(datetime.now().isoformat())
    log.warning(f"[BACKOFF] Token-limit error recorded. "
                f"Will retry in {TOKEN_LIMIT_BACKOFF_MINUTES} minutes.")


# ══════════════════════════════════════════════════════════════
#  GEMINI AI HELPER
# ══════════════════════════════════════════════════════════════

def ask_gemini(prompt):
    """Send a prompt to Gemini and return the text response using raw HTTP request.
    Raises TokenLimitError if the API quota is exhausted.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    try:
        resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        if resp.status_code == 429:
            raise TokenLimitError("Token limit or rate limit exceeded")
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except requests.exceptions.HTTPError as e:
        err_str = str(e).lower()
        if "429" in err_str or "quota" in err_str:
            raise TokenLimitError(str(e))
        raise
    except Exception as e:
        raise


# ══════════════════════════════════════════════════════════════
#  PHASE 1: HANDLE "TO DO" TICKETS — Ask Questions
# ══════════════════════════════════════════════════════════════

def handle_todo_tickets():
    """Find 'To Do' tickets labeled 'Agent', analyze them, ask questions."""
    jql = (f'project={JIRA_PROJECT} AND status="To Do" '
           f'AND labels="{AGENT_LABEL}" ORDER BY created ASC')
    tickets = jira_search(jql, max_results=3)

    for ticket in tickets:
        ticket_id = ticket["id"]
        
        try:
            full_issue = jira_get_issue(ticket_id)
        except Exception as e:
            log.error(f"Failed to fetch issue {ticket_id}: {e}")
            continue
            
        # Re-assign ticket_id to the human-readable key if possible
        ticket_id = full_issue.get("key", ticket_id)
        summary = full_issue["fields"].get("summary", "")
        description = full_issue["fields"].get("description", "No description")

        log.info(f"[TO DO] Processing {ticket_id}: {summary}")

        # Get the project's file structure for context
        file_tree = get_project_tree()

        # Ask Gemini to review the requirements
        try:
            prompt = f"""
You are a senior software developer reviewing a Jira ticket for the TRIP Planner project.

**Project Context:**
- Tech Stack: React (Vite) frontend, FastAPI (Python) backend, PostgreSQL database
- The codebase structure:
{file_tree}

**Jira Ticket:**
- ID: {ticket_id}
- Title: {summary}
- Description:
{description}

**Your Task:**
Analyze this ticket carefully. Identify any ambiguities, missing information, or design
decisions that need the developer's input before you can implement it.

Respond in this EXACT JSON format:
{{
    "has_questions": true/false,
    "questions": [
        "Question 1 about the requirement?",
        "Question 2 about edge cases?",
        ...
    ],
    "understanding": "A brief summary of what you understand the ticket is asking for.",
    "initial_plan": "A high-level plan of how you would implement this."
}}

If the ticket is perfectly clear and you can implement it without any questions,
set "has_questions" to false and "questions" to an empty list.

Be thoughtful. Ask about:
- Edge cases and error handling expectations
- UI/UX specifics (colors, layout, animations)
- Data model implications
- Impact on existing features
- Performance considerations
"""
            ai_response = ask_gemini(prompt)
        except TokenLimitError as e:
            log.error(f"[TOKEN LIMIT] on {ticket_id}: {e}")
            jira_add_comment(ticket_id, "🤖 *AI Agent — Token Limit Reached*\n\nI am currently rate-limited by the Gemini API. I will not move the status of this ticket and will try again in an hour.")
            set_backoff()
            raise  # bubble up to abort further processing

        try:
            # Parse the JSON from the response (handle markdown code blocks)
            json_str = ai_response
            if "```json" in json_str:
                json_str = json_str.split("```json")[1].split("```")[0]
            elif "```" in json_str:
                json_str = json_str.split("```")[1].split("```")[0]
            result = json.loads(json_str.strip())
        except (json.JSONDecodeError, IndexError):
            log.error(f"Failed to parse AI response for {ticket_id}: {ai_response[:200]}")
            continue

        # Build the Jira comment
        if result.get("has_questions", False) and result.get("questions"):
            questions_text = "\n".join(
                f"  {i+1}. {q}" for i, q in enumerate(result["questions"])
            )
            comment = (
                f"🤖 *AI Agent — Requirement Review*\n\n"
                f"I've analyzed this ticket. Here is my understanding:\n\n"
                f"_{result.get('understanding', 'N/A')}_\n\n"
                f"*Proposed Approach:*\n"
                f"{result.get('initial_plan', 'N/A')}\n\n"
                f"---\n\n"
                f"*Before I begin, I have the following questions:*\n\n"
                f"{questions_text}\n\n"
                f"---\n"
                f"_Please update the ticket description with your answers "
                f"and move this ticket to *Review Done*._"
            )
        else:
            # No questions — still comment, then proceed to implementation
            comment = (
                f"🤖 *AI Agent — Requirement Review*\n\n"
                f"I've analyzed this ticket. The requirements are clear.\n\n"
                f"*My Understanding:*\n"
                f"_{result.get('understanding', 'N/A')}_\n\n"
                f"*Implementation Plan:*\n"
                f"{result.get('initial_plan', 'N/A')}\n\n"
                f"---\n"
                f"_No questions needed. Starting implementation now..._"
            )

        jira_add_comment(ticket_id, comment)

        if result.get("has_questions", False) and result.get("questions"):
            # Move to "In Review" — waiting for human
            jira_transition(ticket_id, "In Review")
            log.info(f"[TO DO → IN REVIEW] {ticket_id}: Asked {len(result['questions'])} questions")
        else:
            # No questions — go straight to development
            implement_ticket(ticket_id, summary, description)


# ══════════════════════════════════════════════════════════════
#  PHASE 2: HANDLE "REVIEW DONE" TICKETS — Check Answers
# ══════════════════════════════════════════════════════════════

def handle_review_done_tickets():
    """Find 'Review Done' tickets, check if answers are sufficient, implement or ask more."""
    jql = (f'project={JIRA_PROJECT} AND status="Review Done" '
           f'AND labels="{AGENT_LABEL}" ORDER BY updated ASC')
    tickets = jira_search(jql, max_results=3)

    for ticket in tickets:
        ticket_id = ticket["id"]
        
        try:
            full_issue = jira_get_issue(ticket_id)
        except Exception as e:
            log.error(f"Failed to fetch issue {ticket_id}: {e}")
            continue
            
        ticket_id = full_issue.get("key", ticket_id)
        summary = full_issue["fields"].get("summary", "")
        description = full_issue["fields"].get("description", "")

        log.info(f"[REVIEW DONE] Processing {ticket_id}: {summary}")

        # Get comment history for context
        comments = jira_get_comments(ticket_id)
        comment_history = "\n\n".join(
            f"[{c['author']['displayName']}] ({c['created']}):\n{c['body']}"
            for c in comments[-6:]  # Last 6 comments for context
        )

        file_tree = get_project_tree()

        prompt = f"""
You are a senior software developer who previously asked questions on a Jira ticket.
The developer has now updated the description with their answers.

**Project Context:**
- Tech Stack: React (Vite) frontend, FastAPI (Python) backend, PostgreSQL database
- Codebase structure:
{file_tree}

**Jira Ticket:**
- ID: {ticket_id}
- Title: {summary}
- Updated Description:
{description}

**Previous Comment History:**
{comment_history}

**Your Task:**
Review the updated description in context of your previous questions.
Determine if you now have enough information to implement this ticket.

Respond in this EXACT JSON format:
{{
    "ready_to_implement": true/false,
    "follow_up_questions": [
        "Any remaining question?",
        ...
    ],
    "final_understanding": "Your complete understanding of what needs to be built.",
    "implementation_plan": "Detailed step-by-step plan of files to create/modify."
}}

Set "ready_to_implement" to true ONLY if you are 100% confident you can implement
the ticket without any further clarification.
"""
        try:
            ai_response = ask_gemini(prompt)
        except TokenLimitError as e:
            log.error(f"[TOKEN LIMIT] on {ticket_id}: {e}")
            jira_add_comment(ticket_id, "🤖 *AI Agent — Token Limit Reached*\n\nI am currently rate-limited by the Gemini API. I will not move the status of this ticket and will try again in an hour.")
            set_backoff()
            raise

        try:
            json_str = ai_response
            if "```json" in json_str:
                json_str = json_str.split("```json")[1].split("```")[0]
            elif "```" in json_str:
                json_str = json_str.split("```")[1].split("```")[0]
            result = json.loads(json_str.strip())
        except (json.JSONDecodeError, IndexError):
            log.error(f"Failed to parse AI response for {ticket_id}")
            continue

        if result.get("ready_to_implement", False):
            # ✅ Ready — start implementing
            comment = (
                f"🤖 *AI Agent — Requirements Confirmed*\n\n"
                f"Thank you for the clarifications. I now have everything I need.\n\n"
                f"*Final Understanding:*\n"
                f"_{result.get('final_understanding', 'N/A')}_\n\n"
                f"*Implementation Plan:*\n"
                f"{result.get('implementation_plan', 'N/A')}\n\n"
                f"---\n"
                f"_Starting implementation now..._"
            )
            jira_add_comment(ticket_id, comment)
            implement_ticket(ticket_id, summary, description)
        else:
            # ❓ More questions — move back to In Review
            questions = result.get("follow_up_questions", [])
            questions_text = "\n".join(
                f"  {i+1}. {q}" for i, q in enumerate(questions)
            )
            comment = (
                f"🤖 *AI Agent — Follow-up Questions*\n\n"
                f"Thank you for the updates. I've reviewed the changes, "
                f"but I still have a few questions:\n\n"
                f"{questions_text}\n\n"
                f"---\n"
                f"_Please update the description and move back to *Review Done*._"
            )
            jira_add_comment(ticket_id, comment)
            jira_transition(ticket_id, "In Review")
            log.info(f"[REVIEW DONE → IN REVIEW] {ticket_id}: "
                     f"Asked {len(questions)} follow-up questions")


# ══════════════════════════════════════════════════════════════
#  PHASE 3: IMPLEMENT THE TICKET
# ══════════════════════════════════════════════════════════════

def implement_ticket(ticket_id, summary, description):
    """Use the agent to implement code changes and create a PR."""
    log.info(f"[IMPLEMENTING] {ticket_id}: {summary}")

    # Prepare git branch
    os.chdir(WORKSPACE)
    subprocess.run(["git", "checkout", "uat"], check=True, capture_output=True)
    subprocess.run(["git", "pull", "origin", "uat"], check=True, capture_output=True)
    branch = f"feature/{ticket_id.lower()}"

    # Delete branch if it already exists
    subprocess.run(["git", "branch", "-D", branch], capture_output=True)
    subprocess.run(["git", "checkout", "-b", branch], check=True, capture_output=True)

    # Get relevant source files
    file_tree = get_project_tree()

    # Read key files for context (limit to avoid token overflow)
    key_files_content = read_key_files()

    prompt = f"""
You are an expert developer working on the TRIP Planner project.
The codebase is at: {WORKSPACE}

**Tech Stack:**
- Frontend: React 18 + Vite + Ant Design, located in frontend/src/
- Backend: FastAPI + Python, located in backend/
- Database: PostgreSQL with SQLAlchemy ORM, models in backend/finance_pipeline/db.py
- Deployed on Oracle Cloud (Ubuntu), served by Nginx

**Project Structure:**
{file_tree}

**Key Files Content:**
{key_files_content}

**Jira Ticket {ticket_id}:**
Title: {summary}
Description:
{description}

**Instructions:**
1. Read any additional files you need using the file paths above.
2. Implement ALL the changes required by this ticket.
3. Follow the existing code patterns and style.
4. After making changes, stage all modified files with `git add -A`.
5. Commit with message: "{ticket_id}: {summary}"
6. List every file you changed and what you did.

Output your response as JSON:
{{
    "changes": [
        {{"file": "path/to/file", "action": "modified|created|deleted", "summary": "what changed"}}
    ],
    "commit_message": "{ticket_id}: brief description",
    "notes": "Any notes about the implementation"
}}
"""
    try:
        ai_response = ask_gemini(prompt)
    except TokenLimitError as e:
        log.error(f"[TOKEN LIMIT] on {ticket_id}: {e}")
        jira_add_comment(ticket_id, "🤖 *AI Agent — Token Limit Reached*\n\nI am currently rate-limited by the Gemini API. I will not move the status of this ticket and will try again in an hour.")
        set_backoff()
        # Ensure we switch back and clean up
        subprocess.run(["git", "checkout", "uat"], cwd=WORKSPACE, capture_output=True)
        subprocess.run(["git", "branch", "-D", branch], cwd=WORKSPACE, capture_output=True)
        raise

    try:
        log.info(f"Agent response for {ticket_id}: {ai_response[:500]}")

        # Stage, commit, push
        subprocess.run(["git", "add", "-A"], cwd=WORKSPACE, check=True)

        # Check if there are actual changes
        status = subprocess.run(["git", "status", "--porcelain"],
                                cwd=WORKSPACE, capture_output=True, text=True)
        if not status.stdout.strip():
            comment = (
                f"🤖 *AI Agent — No Changes Needed*\n\n"
                f"After analyzing the codebase, I determined that no code changes "
                f"are required for this ticket. The current implementation already "
                f"satisfies the requirements.\n\n"
                f"_Please verify and close this ticket if you agree._"
            )
            jira_add_comment(ticket_id, comment)
            jira_transition(ticket_id, "Done")
            subprocess.run(["git", "checkout", "uat"], cwd=WORKSPACE)
            return

        subprocess.run(["git", "commit", "-m", f"{ticket_id}: {summary}"],
                        cwd=WORKSPACE, check=True)
        subprocess.run(["git", "push", "origin", branch],
                        cwd=WORKSPACE, check=True)

        # Create Pull Request
        pr_url = create_pull_request(branch, ticket_id, summary, description)

        # Parse changes for the comment
        changes_summary = "See PR for details."
        try:
            json_str = ai_response
            if "```json" in json_str:
                json_str = json_str.split("```json")[1].split("```")[0]
            result = json.loads(json_str.strip())
            if result.get("changes"):
                rows = "\n".join(
                    f"| {c['file']} | {c['action']} | {c['summary']} |"
                    for c in result["changes"]
                )
                changes_summary = (
                    f"|| File || Action || Summary ||\n{rows}"
                )
        except Exception:
            pass

        comment = (
            f"🤖 *AI Agent — Implementation Complete* ✅\n\n"
            f"I've implemented the changes for this ticket.\n\n"
            f"*Changes Made:*\n"
            f"{changes_summary}\n\n"
            f"*Pull Request:* {pr_url if pr_url else 'Branch pushed — PR creation pending'}\n\n"
            f"---\n"
            f"_Please review the PR and merge when ready. "
            f"Your GitHub Actions pipeline will handle deployment._"
        )
        jira_add_comment(ticket_id, comment)
        jira_transition(ticket_id, "Done")
        log.info(f"[DONE] {ticket_id}: PR created at {pr_url}")

    except Exception as e:
        log.error(f"[FAILED] {ticket_id}: {e}")
        comment = (
            f"🤖 *AI Agent — Implementation Failed* ❌\n\n"
            f"I encountered an error while implementing this ticket:\n\n"
            f"{{code}}{str(e)}{{code}}\n\n"
            f"_This ticket needs manual attention._"
        )
        jira_add_comment(ticket_id, comment)
        subprocess.run(["git", "checkout", "uat"], cwd=WORKSPACE, capture_output=True)
        subprocess.run(["git", "branch", "-D", branch], cwd=WORKSPACE, capture_output=True)


# ══════════════════════════════════════════════════════════════
#  HELPERS
# ══════════════════════════════════════════════════════════════

def get_project_tree():
    """Get a simplified file tree of the project."""
    result = subprocess.run(
        ["find", ".", "-type", "f",
         "-not", "-path", "*/node_modules/*",
         "-not", "-path", "*/.git/*",
         "-not", "-path", "*/dist/*",
         "-not", "-path", "*/__pycache__/*",
         "-not", "-name", "*.pyc"],
        cwd=WORKSPACE, capture_output=True, text=True
    )
    return result.stdout[:3000]  # Limit to avoid token overflow


def read_key_files():
    """Read important files for context."""
    key_paths = [
        "backend/main.py",
        "frontend/src/App.jsx",
        "backend/finance_pipeline/db.py",
    ]
    content = ""
    for path in key_paths:
        full = os.path.join(WORKSPACE, path)
        if os.path.exists(full):
            try:
                with open(full, 'r') as f:
                    text = f.read()
                # Limit per file to avoid blowing up context
                content += f"\n--- {path} (first 200 lines) ---\n"
                content += "\n".join(text.split("\n")[:200])
            except Exception:
                pass
    return content[:10000]


def create_pull_request(branch, ticket_id, summary, description):
    """Create a GitHub Pull Request and return its URL."""
    pr_data = {
        "title": f"{ticket_id}: {summary}",
        "body": (
            f"## Jira Ticket: {ticket_id}\n\n"
            f"{description}\n\n"
            f"---\n"
            f"_🤖 This PR was automatically generated by the AI Agent._"
        ),
        "head": branch,
        "base": "uat"
    }
    resp = requests.post(
        f"https://api.github.com/repos/{GITHUB_REPO}/pulls",
        headers={
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json"
        },
        json=pr_data
    )
    if resp.status_code == 201:
        return resp.json()["html_url"]
    else:
        log.error(f"PR creation failed: {resp.status_code} {resp.text}")
        return None


# ══════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════

def main():
    log.info("=" * 60)
    log.info("Agent Worker Started")
    log.info("=" * 60)

    # If a token-limit cooldown is active, skip this run entirely.
    if is_in_backoff():
        return

    # Phase 1: Process new "To Do" tickets
    try:
        handle_todo_tickets()
    except TokenLimitError as e:
        log.error(f"[TOKEN LIMIT] handle_todo_tickets hit quota: {e}")
        set_backoff()
    except Exception as e:
        log.error(f"Error in handle_todo_tickets: {e}")

    # Abort Phase 2 as well if we just hit a token limit
    if is_in_backoff():
        log.info("Skipping Phase 2 — token-limit cooldown just triggered.")
        return

    # Phase 2: Process "Review Done" tickets
    try:
        handle_review_done_tickets()
    except TokenLimitError as e:
        log.error(f"[TOKEN LIMIT] handle_review_done_tickets hit quota: {e}")
        set_backoff()
    except Exception as e:
        log.error(f"Error in handle_review_done_tickets: {e}")

    log.info("Agent Worker Finished")


if __name__ == "__main__":
    main()
