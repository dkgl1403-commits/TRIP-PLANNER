import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part13():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=99, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "AI Agents & Tool Use"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            topic = LearningTopic(subject_id=ai_subject.id, name=topic_name)
            db.add(topic)
            db.commit()

        config = {
            "parts": [
                {
                    "title": "The Brain in the Jar (The LLM Foundation)",
                    "readingTime": "~4 min read",
                    "narrative": "<p>Before you can build a robot that builds a house, you need a brain capable of understanding what a house is. A Large Language Model (LLM) started as a highly advanced autocomplete engine. But by 2026, these brains evolved from simply \"guessing\" words to internally \"reasoning\" through complex logic puzzles before speaking.</p><p>To build an agent, you must choose its brain. Here is the 2026 roster:</p><ul><li><strong>OpenAI Family:</strong> GPT-4o (fast multimodal workhorse), o1 & o1-mini (reasoning elites), and the 170B parameter o3 (the 2026 evolution for advanced planning).</li><li><strong>Google DeepMind:</strong> Gemini 1.5 Pro (massive 1M-2M context window), Gemini 2.0 (speed/reasoning balance), and Gemini 3.1 Pro (the absolute frontier for agent orchestration).</li><li><strong>Anthropic Family:</strong> Claude 3.5 Sonnet (darling of software engineers), Claude 4.6 Sonnet (the 2026 powerhouse for IDEs), and Claude 4.6 Opus (for maximum logical accuracy).</li><li><strong>Open-Weights Titans:</strong> DeepSeek-R1 (the Chinese model rivaling o1 at a fraction of the cost), Meta's Llama 3.1 & Llama 4 (open-source titans), and Mistral Large 2 (Europe's flagship).</li><li><strong>Enterprise:</strong> Command R+ (for RAG without hallucinating), Phi-4 (Small Language Models for phones), and NVIDIA Nemotron (hyper-efficient for GPU clusters).</li></ul>",
                    "audioText": "Before building an agent, you must choose a brain. The 2026 roster includes reasoning models like OpenAI o3, massive context models like Gemini 3.1 Pro, and open-weight titans like DeepSeek-R1 and Llama 4.",
                    "audioTextHinglish": "Agent banane se pehle ek dimaag chunna padta hai. 2026 ke top models mein OpenAI o3, Gemini 3.1 Pro, aur open-source kings jaise Llama 4 aur DeepSeek-R1 shamil hain.",
                    "keyInsight": "Modern LLMs have evolved from autocomplete engines into true reasoning brains capable of orchestrating complex logic.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Awakening (From Thinker to Actor)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Despite being incredibly smart, a foundation model is still trapped in a chat box. It can't <em>do</em> anything. If you asked it to \"email my boss the weather,\" it would reply: <em>\"I'm sorry, I cannot send emails.\"</em></p><p>To make it an \"Agent,\" developers surround the LLM with a software loop containing three things:</p><ol><li><strong>Memory:</strong> Vector databases allow the agent to remember past conversations.</li><li><strong>Tools (Function Calling):</strong> The LLM is given APIs. It doesn't guess the weather; it writes a script to ping a weather website, reads the result, and tells you.</li><li><strong>Autonomy:</strong> The agent is given a \"System Prompt\" telling it: <em>\"You are a software engineer. If you hit an error, do not stop. Read the error, write a new plan, and try again until the goal is met.\"</em></li></ol>",
                    "audioText": "An LLM is trapped in a chat box. To make it an Agent, developers give it a software loop containing Memory, Tools, and Autonomy to try again until a goal is met.",
                    "audioTextHinglish": "LLM ek chat box mein qaid hai. Usko Agent banane ke liye hum usme Memory, Tools, aur Autonomy daalte hain taaki wo khud se task pura kar sake.",
                    "keyInsight": "Agents are AIs that have escaped the chat box by being given Memory, Tools, and Autonomy.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "A Brief History: Meet Shakey (1966) & AutoGPT (2023)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>The idea of an Agent isn't new. In 1966, Stanford built <strong>Shakey the Robot</strong>, the very first AI agent. Shakey was given a physical body, a camera, and a goal (e.g., \"Push the block off the platform\"). Shakey had to observe its environment, form a logical plan, and physically move. It was revolutionary, but incredibly slow.</p><p>Fast forward to April 2023. Developers created an open-source project called <strong>AutoGPT</strong>. Instead of a robot body, they gave an LLM a digital body: access to a Python terminal and a web browser. They told it: <em>\"Here is your goal. Write code, browse the web, and figure it out yourself.\"</em></p><p>The world was stunned. AutoGPT could research topics, write code to fix its own bugs, and even order a pizza autonomously. The era of the digital Agent had arrived.</p>",
                    "audioText": "In 1966, Stanford built Shakey, the first robotic AI agent that could observe and act. In 2023, AutoGPT gave modern LLMs a digital body, allowing them to browse the web and write code autonomously.",
                    "audioTextHinglish": "1966 mein Stanford ne Shakey banaya, pehla robotic agent jo dekh aur chal sakta tha. 2023 mein, AutoGPT ne LLMs ko digital body di, jisse wo khud web browse aur code likh sakte the.",
                    "keyInsight": "Agents combine reasoning with observation and action, a concept born in 1966 but perfected with modern LLMs in 2023.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The ReAct Loop (Reasoning + Acting)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>To build an Agent, developers provide the AI with a list of <strong>Tools</strong>. But just giving it tools isn't enough; it has to know <em>when</em> and <em>how</em> to use them.</p><p>This is where deep reasoning comes back into play. The AI is programmed to use the <strong>ReAct Loop</strong> (Reasoning + Acting):</p><p>1. <strong>Thought:</strong> The AI uses its scratchpad to decide what tool it needs.<br/>2. <strong>Action:</strong> It triggers the API (e.g., `get_weather(Tokyo)`).<br/>3. <strong>Observation:</strong> It reads the result returned by the tool.<br/>4. <strong>Thought:</strong> It decides if it has enough info to answer, or if it needs to trigger another tool.</p>",
                    "audioText": "To build an Agent, we give the AI Tools and teach it the ReAct Loop: Reasoning plus Acting. It thinks about what tool it needs, takes action to trigger the tool, observes the result, and thinks again.",
                    "audioTextHinglish": "Agent banane ke liye hum AI ko Tools dete hain aur ReAct Loop sikhate hain. Yani soch kar action lena. Pehle ye sochta hai konsa tool chahiye, fir action leta hai, result observe karta hai, aur fir se sochta hai.",
                    "keyInsight": "The ReAct loop (Thought -> Action -> Observation) allows an AI to chain multiple tools together to solve complex problems.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Interactive Agent Workspace",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Let's watch an Agent execute the ReAct loop in real-time. We will ask it to complete a complex, multi-step task.</p><p><strong>Task:</strong> \"Find the current weather in Tokyo and email it to my boss, John.\"</p><p>Click <strong>Start Agent Workspace</strong> to watch the AI's internal thoughts as it realizes it needs to chain two different tools together to complete your request.</p>",
                    "audioText": "Let's watch an Agent execute the ReAct loop. The task is to find the weather in Tokyo and email it to John. Click Start to watch the AI's internal thoughts as it chains two tools together.",
                    "audioTextHinglish": "Chaliye ek Agent ko ReAct loop execute karte dekhte hain. Task hai: Tokyo ka weather find karke John ko email karna. Start click karein aur AI ko tools chain karte hue dekhein.",
                    "keyInsight": "By chaining multiple tool executions together, AI can now automate entire workflows autonomously.",
                    "widgetType": "AgentWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Domains of Agentic AI (2026 Landscape)",
                    "readingTime": "~5 min read",
                    "narrative": "<p>Here are the exact tools humans are using today to automate their industries:</p><p><strong>Domain 1: Software & Coding</strong><br/>- <em>Devin (by Cognition):</em> The original autonomous AI software engineer. You give it a Jira ticket, and it spins up its own hidden browser, terminal, and code editor to solve the problem end-to-end.<br/>- <em>Kiro (by AWS):</em> Amazon's spec-driven powerhouse. USP: Uses Sandboxing to securely clone repos and coordinates changes across multiple repos simultaneously.<br/>- <em>Google Antigravity:</em> Google's massive Agent-First IDE. USP: Features a 'Manager View' where developers orchestrate multiple Gemini 3.1 or Claude 4.6 agents working asynchronously in parallel.<br/>- <em>Cursor AI:</em> The undisputed king of AI code editors, featuring flawless real-time codebase indexing.</p><p><strong>Domain 2: OS-Level Operators</strong><br/>- <em>OpenAI Operator:</em> A foundational model trained specifically to navigate software GUIs and physically click buttons on a screen.<br/>- <em>Salesforce Agentforce:</em> Enterprise CRM automation that resolves customer support tickets without human input.<br/>- <em>SAP Joule:</em> The ultimate ERP agent navigating complex supply chain and finance software.</p><p><strong>Domain 3: Deep Research</strong><br/>- <em>ChatGPT & Gemini Deep Research:</em> Capable of conducting hours-long internet research, cross-referencing data, and writing comprehensive, highly cited thesis-level reports.</p>",
                    "audioText": "The 2026 landscape is dominated by coding agents like Devin and Google Antigravity, OS-level operators like OpenAI Operator that click buttons for you, and Deep Research agents that write thesis-level reports.",
                    "audioTextHinglish": "2026 mein coding ke liye Devin aur Google Antigravity jese agents hain. Aur OS-level agents jaise OpenAI Operator aapke computer par khud click karke kaam karte hain.",
                    "keyInsight": "Agentic AI has splintered into highly specialized domains: Coding, OS-navigation, and Deep Research.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Multi-Agent Builders",
                    "readingTime": "~3 min read",
                    "narrative": "<p>If a user wants to build their own custom agents, they use these orchestration frameworks:</p><ul><li><strong>CrewAI:</strong> The most popular open-source framework. Allows you to easily assign \"Roles\" (e.g., Researcher, Writer) to different LLMs and watch them collaborate.</li><li><strong>LangGraph (by LangChain):</strong> Built for stateful, complex, long-running agents. USP: Uses a \"graph\" architecture allowing developers to build infinite loops and strict logical guardrails.</li><li><strong>n8n:</strong> A node-based, visual drag-and-drop builder connecting AI agents to thousands of existing APIs (Slack, Gmail, Stripe) using self-hosted servers.</li><li><strong>Zapier Agents:</strong> The ultimate no-code solution, leveraging Zapier’s massive ecosystem to let AI trigger actions across 5,000+ internet apps.</li></ul>",
                    "audioText": "To build your own agents, you use orchestration frameworks like CrewAI for role-playing agents, LangGraph for complex logical loops, and Zapier Agents for no-code API triggers.",
                    "audioTextHinglish": "Apne khud ke agents banane ke liye developers CrewAI, LangGraph, aur Zapier Agents jese orchestration frameworks ka use karte hain.",
                    "keyInsight": "Frameworks like CrewAI and LangGraph allow multiple agents to talk to each other and collaborate on a single task.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Infrastructure (Cost of Autonomy)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>To close this chapter, we must understand the hardware reality and physics of AI.</p><p><strong>Compute Requirements:</strong> An agent running a loop of 50 steps uses 50x the API cost of a standard chatbot query. The cost of autonomy is astronomical compute.</p><p><strong>The Hardware:</strong> Training these foundation models requires massive clusters of 100,000+ NVIDIA GPUs (like the H100s or B200s). These data centers require the electricity of small cities.</p><p><strong>Sandboxing Security:</strong> As seen with AWS Kiro or Google Antigravity, running autonomous code is dangerous. If an agent hallucinates, it could accidentally run a command that deletes a production database. To prevent this, agents are quarantined inside secure <em>Docker containers</em> and isolated Virtual Machines (VMs) where they can safely break things without causing real-world damage.</p>",
                    "audioText": "The cost of autonomy is massive. Agent loops cost 50 times more than normal queries. Furthermore, agents must be safely quarantined in Docker containers so they don't accidentally destroy real databases.",
                    "audioTextHinglish": "Agent loops ka cost normal queries se 50 guna zyada hota hai. Aur agents ko Docker containers mein qaid rakhna zaroori hai taaki wo galti se real databases delete na kar dein.",
                    "keyInsight": "Autonomy is highly expensive in compute cost, and highly dangerous without proper Sandboxing and Docker security.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "3 Questions",
                    "narrative": "<p>Test your knowledge on AI Agents and the 2026 Ecosystem.</p>",
                    "audioText": "Test your knowledge on AI Agents and the 2026 Ecosystem.",
                    "audioTextHinglish": "AI Agents par apna knowledge test karein.",
                    "keyInsight": "Agents represent the leap from Generative AI to Autonomous AI.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What makes an AI an 'Agent'?",
                                "options": ["It can generate longer essays", "It has access to Tools, Memory, and Autonomy to take actions", "It doesn't hallucinate", "It is connected to the internet permanently"],
                                "correct": 1
                            },
                            {
                                "q": "What is the primary USP of Google Antigravity?",
                                "options": ["It clicks buttons on a screen", "It is a node-based workflow builder", "It is an Agent-First IDE with a Manager View for orchestrating parallel agents", "It is an open-weights model"],
                                "correct": 2
                            },
                            {
                                "q": "Why is Sandboxing (like Docker) critical for Agents?",
                                "options": ["It makes the LLM smarter", "It isolates the agent so it can't accidentally destroy real-world databases if it hallucinates", "It provides free API calls", "It speeds up the ReAct loop"],
                                "correct": 1
                            }
                        ]
                    }
                }
            ]
        }

        topic.lesson_config_json = json.dumps(config)
        db.commit()
    except Exception as e:
        print(f"Error seeding AI Masterclass Part 13: {e}")
        db.rollback()
    finally:
        db.close()
