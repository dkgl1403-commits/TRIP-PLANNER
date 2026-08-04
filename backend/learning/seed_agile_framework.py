import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_agile_framework():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        agile_subject = db.query(LearningSubject).filter_by(name="The Agile Framework", class_id=class_11.id).first()
        if not agile_subject:
            return

        topics = [
            "The Waterfall Trap & The Agile Rebellion",
            "The Frameworks: From XP to Scrum",
            "The Big Picture (SAFe & PI Planning)",
            "The Anatomy of Work (Live Example)",
            "The Scrum Team & Estimation",
            "The Ceremonies & Real-World Chaos",
            "Agile in Real-World Industries",
            "Agile Tooling & The AI Revolution"
        ]
        
        configs = {}

        # ---------------------------------------------------------
        # CHAPTER 1: The Waterfall Trap & The Agile Rebellion
        # ---------------------------------------------------------
        configs[topics[0]] = {
            "parts": [
                {
                    "title": "The Era of CD-ROMs",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In the 1990s, software was delivered in boxes. You bought Microsoft Word on a CD-ROM at Best Buy. Because it took months to manufacture and ship those discs, software companies could only release updates once every 2 or 3 years.</p><p>Because releases were so rare, they had to be absolutely perfect. This led to a hyper-rigid management style known as the <strong>Waterfall</strong> methodology.</p>",
                    "audioText": "In the 1990s, software was delivered in boxes. You bought Microsoft Word on a CD-ROM at Best Buy. Because releases were so rare, they had to be absolutely perfect. This led to a hyper-rigid management style known as the Waterfall methodology.",
                    "audioTextHinglish": "1990s mein software boxes mein aata tha. Kyunki releases itne rare the, unhe bilkul perfect hona zaroori tha. Is wajah se ek hyper-rigid management style aaya jise Waterfall kehte hain.",
                    "keyInsight": "When distribution is slow and expensive, planning must be slow and extensive.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Waterfall Trap",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Waterfall is the traditional <strong>Software Development Life Cycle (SDLC)</strong>. It flows in one direction, like a waterfall: <strong>Requirements &rarr; Design &rarr; Code &rarr; Test &rarr; Deploy</strong>.</p><p>It sounds logical, but it caused a massive problem. A company would spend 6 months gathering requirements, 6 months designing, and 12 months coding. By the time the software shipped 2 years later, the client's business had changed, and the software was completely useless.</p><p>The developers delivered exactly what was asked for, but not what was actually needed.</p>",
                    "audioText": "Waterfall flows in one direction: Requirements, Design, Code, Test, Deploy. It sounds logical, but it caused a massive problem. By the time the software shipped two years later, the client's business had changed, and the software was completely useless.",
                    "audioTextHinglish": "Waterfall ek direction mein flow karta hai. Lekin isme ek badi problem thi. 2 saal baad jab software bankar ready hota tha, tab tak client ka business badal chuka hota tha, aur software useless ho jata tha.",
                    "keyInsight": "Waterfall assumed that clients knew exactly what they wanted up front. They rarely do.",
                    "widgetType": "WaterfallVsAgileWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Snowbird Rebellion",
                    "readingTime": "~3 min read",
                    "narrative": "<p>By the early 2000s, the internet changed everything. You didn't need to mail CD-ROMs anymore; you could push an update to a website instantly. But companies were still using slow Waterfall processes.</p><p>In February 2001, 17 frustrated software engineers met at a ski resort in Snowbird, Utah. They wanted a lighter, faster way to build software. Out of this meeting, the <strong>Agile Manifesto</strong> was born.</p><p>It shifted the entire industry's focus from heavy documentation to delivering rapid value.</p>",
                    "audioText": "In February 2001, 17 frustrated software engineers met at a ski resort in Snowbird, Utah. They wanted a lighter, faster way to build software. Out of this meeting, the Agile Manifesto was born.",
                    "audioTextHinglish": "February 2001 mein, 17 frustrated software engineers Snowbird, Utah ke ek ski resort mein mile. Woh software banane ka ek fast aur better tarika chahte the. Is meeting se Agile Manifesto ka janam hua.",
                    "keyInsight": "The internet allowed for instant updates, making heavy 3-year planning cycles obsolete.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The 4 Core Values",
                    "readingTime": "~2 min read",
                    "narrative": "<p>The Agile Manifesto doesn't give you rules; it gives you 4 core values:</p><ol><li><strong>Individuals and interactions</strong> over processes and tools.</li><li><strong>Working software</strong> over comprehensive documentation.</li><li><strong>Customer collaboration</strong> over contract negotiation.</li><li><strong>Responding to change</strong> over following a plan.</li></ol><p>Agile is a mindset. It is the belief that <em>learning</em> as you go is better than <em>guessing</em> before you start.</p>",
                    "audioText": "The Agile Manifesto gives 4 core values. The most important one is: Responding to change over following a plan. Agile is a mindset. It is the belief that learning as you go is better than guessing before you start.",
                    "audioTextHinglish": "Agile Manifesto 4 core values deta hai. Sabse important hai ki plan follow karne se zyada zaroori change ke hisaab se adapt karna hai. Agile ek mindset hai.",
                    "keyInsight": "Agile is not a process; it is a philosophy that values adaptability over rigid planning.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "2 Questions",
                    "narrative": "<p>Test your knowledge on the birth of Agile.</p>",
                    "audioText": "Test your knowledge on the birth of Agile.",
                    "audioTextHinglish": "Agile ke birth par apna knowledge test karein.",
                    "keyInsight": "Understanding why Waterfall failed helps you appreciate why Agile exists.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What is the primary flaw of the Waterfall methodology in modern software development?",
                                "options": ["It doesn't use enough documentation", "It assumes requirements won't change over a multi-year cycle", "It forces developers to talk to customers daily", "It requires too many CD-ROMs"],
                                "correct": 1
                            },
                            {
                                "q": "According to the Agile Manifesto, which of the following is valued MORE?",
                                "options": ["Following a rigid plan", "Comprehensive documentation", "Responding to change", "Contract negotiation"],
                                "correct": 2
                            }
                        ]
                    }
                }
            ]
        }

        # ---------------------------------------------------------
        # CHAPTER 2: The Frameworks: From XP to Scrum
        # ---------------------------------------------------------
        configs[topics[1]] = {
            "parts": [
                {
                    "title": "The Umbrella of Agile",
                    "readingTime": "~2 min read",
                    "narrative": "<p>If Agile is the philosophy (like \"eating healthy\"), then how do you actually execute it? You need a specific framework (like the \"Keto diet\" or \"Paleo diet\").</p><p>Many frameworks sit under the Agile umbrella, including <strong>Extreme Programming (XP)</strong>, which focuses on pair programming, and <strong>Lean</strong>, which focuses on eliminating waste. But two frameworks came to dominate the tech world: <strong>Scrum</strong> and <strong>Kanban</strong>.</p>",
                    "audioText": "If Agile is the philosophy, you need a specific framework to execute it. Many frameworks exist like Extreme Programming and Lean, but two came to dominate the tech world: Scrum and Kanban.",
                    "audioTextHinglish": "Agar Agile ek philosophy hai, toh usko execute karne ke liye aapko ek framework chahiye. XP aur Lean jaise kai frameworks hain, par tech world mein Scrum aur Kanban sabse aage nikal gaye.",
                    "keyInsight": "You don't 'do Agile.' You are Agile, and you 'do' Scrum or Kanban.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Scrum: Timeboxed Chaos Control",
                    "readingTime": "~3 min read",
                    "narrative": "<p><strong>Scrum</strong> is the most popular Agile framework. It works by breaking a massive project down into tiny 1 to 4 week timeboxes called <strong>Sprints</strong>.</p><p>The rules of Scrum are strict: At the beginning of the Sprint, the team agrees on a set amount of work. Once the Sprint starts, the scope is <strong>locked</strong>. Nobody—not even the CEO—is allowed to interrupt the developers or add new features until the Sprint is over.</p><p>This provides developers with extreme focus, shielding them from corporate chaos.</p>",
                    "audioText": "Scrum works by breaking a massive project down into 1 to 4 week timeboxes called Sprints. The scope is locked. Nobody is allowed to interrupt the developers until the Sprint is over.",
                    "audioTextHinglish": "Scrum ek bade project ko 1 se 4 hafton ke Sprints mein tod deta hai. Sprint shuru hone ke baad scope lock ho jata hai aur koi bhi developers ko disturb nahi kar sakta.",
                    "keyInsight": "Scrum trades total flexibility for deep, uninterrupted developer focus.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Kanban: Continuous Flow",
                    "readingTime": "~3 min read",
                    "narrative": "<p><strong>Kanban</strong> doesn't have Sprints. It is a continuous flow of work. It was invented in the 1940s by Toyota to manufacture cars efficiently.</p><p>In Kanban, work is visualized on a board (To Do, In Progress, Done). The secret sauce of Kanban is <strong>WIP Limits (Work In Progress Limits)</strong>. For example, you might set a rule that only 3 tasks can be 'In Progress' at once. If a 4th task comes in, nobody can start it until one of the current tasks is finished.</p><p>This stops developers from context-switching and forces the team to finish what they start before taking on new work.</p>",
                    "audioText": "Kanban doesn't have Sprints; it is a continuous flow. The secret sauce is WIP Limits. You limit how many tasks can be In Progress to force the team to finish old work before starting new work.",
                    "audioTextHinglish": "Kanban mein Sprints nahi hote, yeh ek continuous flow hai. Iska secret hai WIP Limits. Matlab ek time par kitne tasks In Progress ho sakte hain uski ek limit hoti hai, taaki purana kaam pehle khatam ho.",
                    "keyInsight": "Scrum limits TIME (Sprints). Kanban limits WORK (WIP limits).",
                    "widgetType": "KanbanFlowWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "2 Questions",
                    "narrative": "<p>Test your knowledge on Scrum vs Kanban.</p>",
                    "audioText": "Test your knowledge on Scrum vs Kanban.",
                    "audioTextHinglish": "Scrum aur Kanban par apna knowledge test karein.",
                    "keyInsight": "Choosing the right framework depends on whether you need predictable milestones (Scrum) or reactive speed (Kanban).",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What is the core mechanism Scrum uses to protect developer focus?",
                                "options": ["WIP Limits", "Timeboxed Sprints with a locked scope", "Pair programming", "Heavy up-front documentation"],
                                "correct": 1
                            },
                            {
                                "q": "What is the primary purpose of a WIP Limit in Kanban?",
                                "options": ["To ensure developers don't work over 40 hours", "To force the team to finish work before starting new work", "To limit how much the client can pay", "To restrict the number of bugs"],
                                "correct": 1
                            }
                        ]
                    }
                }
            ]
        }

        # ---------------------------------------------------------
        # CHAPTER 3: The Big Picture (SAFe & PI Planning)
        # ---------------------------------------------------------
        configs[topics[2]] = {
            "parts": [
                {
                    "title": "The Scaling Problem",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Scrum is fantastic for a single team of 7 people building a simple app. But what happens if you are a massive bank with 5,000 developers, hundreds of dependencies, and strict regulatory compliance?</p><p>If 500 different Scrum teams just start running in different directions without coordinating, you get absolute chaos. To solve this, enterprises use <strong>SAFe (Scaled Agile Framework)</strong>.</p>",
                    "audioText": "Scrum is fantastic for a single team of 7 people. But if you have 5,000 developers, you need coordination. To solve this, enterprises use SAFe: the Scaled Agile Framework.",
                    "audioTextHinglish": "Scrum 7 logon ki team ke liye acha hai. Par agar 5000 developers hon, toh coordination chahiye. Iske liye badi companies SAFe yani Scaled Agile Framework use karti hain.",
                    "keyInsight": "SAFe scales the Agile mindset from a single team up to a global enterprise.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Agile Release Trains (ARTs)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>In SAFe, you group 5 to 12 Agile teams (around 50-125 people) together into an <strong>Agile Release Train (ART)</strong>. They operate like a literal train: they plan together, commit together, and release software together on a fixed schedule.</p><p>This ensures that the database team, the UI team, and the security team are all marching to the exact same drumbeat.</p>",
                    "audioText": "In SAFe, you group 5 to 12 Agile teams together into an Agile Release Train, or ART. They plan together, commit together, and release software together on a fixed schedule.",
                    "audioTextHinglish": "SAFe mein, 5 se 12 Agile teams ko milakar ek Agile Release Train banaya jata hai. Woh ek sath plan karte hain aur ek fixed schedule par software release karte hain.",
                    "keyInsight": "An ART aligns multiple teams to deliver a massive product that a single team could never build alone.",
                    "widgetType": "SAFeAlignmentWidget",
                    "widgetData": {}
                },
                {
                    "title": "PI Planning (The Mega Sync)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Every 10 to 12 weeks, the entire Agile Release Train stops what they are doing and gathers for a massive 2-day event called <strong>PI Planning (Program Increment Planning)</strong>.</p><p>In this event, all 100+ people get in a room (or a Zoom call). Leadership presents the massive \"Big Picture\" goals for the next quarter. The teams then break out, argue about dependencies (e.g., \"We can't build the UI until you build the API\"), and commit to a shared roadmap for the next 5 sprints.</p>",
                    "audioText": "Every 10 to 12 weeks, the entire Agile Release Train stops what they are doing and gathers for PI Planning. All 100+ people plan the next quarter, map dependencies, and commit to a shared roadmap.",
                    "audioTextHinglish": "Har 10 se 12 hafte mein, poora Agile Release Train ruk kar ek 2-day event karta hai jise PI Planning kehte hain. Yahan saare teams agle quarter ka plan karte hain aur dependencies map karte hain.",
                    "keyInsight": "PI Planning prevents teams from blocking each other mid-sprint by mapping out dependencies up front.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "1 Question",
                    "narrative": "<p>Check your understanding of Scaled Agile.</p>",
                    "audioText": "Check your understanding of Scaled Agile.",
                    "audioTextHinglish": "Scaled Agile par apna understanding check karein.",
                    "keyInsight": "Scaling Agile requires a balance between team autonomy and enterprise alignment.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What is the primary purpose of an Agile Release Train (ART) and PI Planning in SAFe?",
                                "options": ["To write code faster", "To force developers to work weekends", "To align multiple Agile teams to a shared schedule and map dependencies", "To replace Scrum entirely"],
                                "correct": 2
                            }
                        ]
                    }
                }
            ]
        }

        # ---------------------------------------------------------
        # CHAPTER 4: The Anatomy of Work (Live Example)
        # ---------------------------------------------------------
        configs[topics[3]] = {
            "parts": [
                {
                    "title": "The Crypto Trading Initiative",
                    "readingTime": "~2 min read",
                    "narrative": "<p>How do we translate a CEO's 5-year vision into an afternoon coding task? We slice it into a hierarchy.</p><p>Let's use a Live Example. The CEO of our Banking App announces a massive new goal: <strong>\"We need to launch Crypto Trading to attract Gen-Z.\"</strong></p><p>This is called an <strong>Initiative</strong>. It is a massive portfolio-level goal that might take multiple Agile Release Trains an entire year to build. Developers cannot \"code\" an Initiative; it's far too vague.</p>",
                    "audioText": "How do we translate a CEO's vision into a coding task? We slice it into a hierarchy. Our live example: The CEO announces we need to launch Crypto Trading. This is a massive Initiative.",
                    "audioTextHinglish": "CEO ke vision ko ek coding task mein kaise badlein? Hum use hierarchy mein break karte hain. Example: Bank ko Crypto Trading launch karni hai. Yeh ek massive Initiative hai.",
                    "keyInsight": "Initiatives are business strategies, not engineering tickets.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Capabilities & Epics",
                    "readingTime": "~3 min read",
                    "narrative": "<p>We take the Crypto Initiative and slice it into <strong>Capabilities</strong>. One capability might be <em>\"Mobile App Crypto Wallet.\"</em> Another might be <em>\"Regulatory Tax Reporting.\"</em></p><p>We give the Mobile Wallet capability to a specific Agile Release Train. They slice it further into <strong>EPICs</strong>. An EPIC is a large body of work that spans multiple Sprints.</p><p><strong>Our EPIC:</strong> <em>Bitcoin Payment Gateway Integration</em>. It's getting clearer, but it's still too big to finish in two weeks.</p>",
                    "audioText": "We slice the Initiative into Capabilities, like a Mobile Crypto Wallet. Then we slice that into EPICs. An EPIC is a large body of work that spans multiple Sprints, like integrating a Bitcoin Payment Gateway.",
                    "audioTextHinglish": "Hum Initiative ko Capabilities mein todte hain, jaise Mobile Crypto Wallet. Phir use EPICs mein break kiya jata hai. EPIC ek bada kaam hai jo kai Sprints tak chalta hai, jaise Bitcoin Payment Gateway banana.",
                    "keyInsight": "Epics bridge the gap between high-level business needs and team-level execution.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The User Story & Sub-Task",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Now we slice the EPIC into pieces small enough to fit inside a 2-week Sprint. We call these <strong>User Stories</strong>. They describe a specific slice of value delivered to the user.</p><p><strong>The Story:</strong> <em>\"As a user, I want to see my Bitcoin balance on the home screen, so I know my net worth.\"</em></p><p>Finally, the developers break the Story into technical <strong>Tasks or Sub-Tasks</strong>. <br/>- Task 1: Build the backend API to fetch balance.<br/>- Task 2: Create the React UI component.</p>",
                    "audioText": "We slice the EPIC into User Stories, which describe specific value delivered to the user. Finally, developers break the Story into technical Tasks or Sub-Tasks, like building an API or a UI component.",
                    "audioTextHinglish": "Hum EPIC ko User Stories mein slice karte hain, jo user ko milne wali value define karti hai. Phir developers us story ko technical Tasks mein todte hain, jaise API banana.",
                    "keyInsight": "User Stories focus on WHAT the user gets. Tasks focus on HOW the developers build it.",
                    "widgetType": "WorkHierarchyWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "2 Questions",
                    "narrative": "<p>Test your knowledge on the anatomy of Agile work.</p>",
                    "audioText": "Test your knowledge on the anatomy of Agile work.",
                    "audioTextHinglish": "Agile work hierarchy par apna knowledge test karein.",
                    "keyInsight": "If work isn't broken down properly, Sprints fail because the work is too massive to finish.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What is the relationship between an EPIC and a User Story?",
                                "options": ["They are the exact same thing", "An EPIC is a large body of work that is broken down into smaller User Stories", "A User Story is broken down into EPICs", "EPICs are for bugs, Stories are for features"],
                                "correct": 1
                            },
                            {
                                "q": "In the standard Agile format, how is a User Story usually written?",
                                "options": ["As a [role], I want [feature], so that [benefit]", "Do this technical thing: [details]", "Build [feature] by [date]", "Select * from database"],
                                "correct": 0
                            }
                        ]
                    }
                }
            ]
        }

        # ---------------------------------------------------------
        # CHAPTER 5: The Scrum Team & Estimation
        # ---------------------------------------------------------
        configs[topics[4]] = {
            "parts": [
                {
                    "title": "The Holy Trinity of Roles",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In traditional projects, you have a \"Project Manager\" who bosses everyone around. Scrum destroys this role and splits it into three equal partners:</p><ul><li><strong>The Product Owner (PO):</strong> Owns the <em>WHAT</em>. They talk to customers, write the User Stories, and prioritize the backlog.</li><li><strong>The Scrum Master (SM):</strong> Owns the <em>PROCESS</em>. They don't write code; they remove blockers, enforce Scrum rules, and protect the team.</li><li><strong>The Developers:</strong> Own the <em>HOW</em>. They write the code and decide how much work they can realistically do in a Sprint.</li></ul>",
                    "audioText": "Scrum splits traditional project management into three roles: The Product Owner who owns the WHAT, the Scrum Master who owns the PROCESS, and the Developers who own the HOW.",
                    "audioTextHinglish": "Scrum purane project management ko 3 roles mein tod deta hai: Product Owner jo WHAT decide karta hai, Scrum Master jo PROCESS dekhta hai, aur Developers jo HOW handle karte hain.",
                    "keyInsight": "Nobody bosses anyone around. It's a balanced partnership.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Estimation Trap",
                    "readingTime": "~3 min read",
                    "narrative": "<p>How long will it take to build the Bitcoin balance API? If you ask a developer for hours, they will guess \"2 days.\" But then the server crashes, an API is undocumented, and it takes 6 days. Now they are \"late.\"</p><p>Software is knowledge work. It is inherently unpredictable. So Agile teams stopped estimating in hours. Instead, they estimate in <strong>Story Points</strong>.</p><p>Story Points measure <em>complexity, risk, and effort</em>, not time. A 1-point story is trivial. An 8-point story is complex.</p>",
                    "audioText": "Software is unpredictable, so Agile teams stopped estimating in hours. Instead, they estimate in Story Points, which measure complexity and effort, not time.",
                    "audioTextHinglish": "Software unpredictable hai, isliye Agile teams ghanton mein time nahi batate. Woh Story Points use karte hain jo complexity aur effort measure karte hain.",
                    "keyInsight": "Estimating in hours is a trap. Estimate the complexity, and let time sort itself out.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Planning Poker",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Teams use a modified Fibonacci sequence for Story Points: <strong>1, 2, 3, 5, 8, 13, 21</strong>. Why? Because the difference between 8 and 13 is obvious, but the difference between 8 and 9 is impossible to debate.</p><p>During estimation, the team plays <strong>Planning Poker</strong>. The PO explains the story. Then, on the count of three, every developer reveals a card with their point estimate simultaneously. If the senior dev throws a 2 and the junior dev throws an 8, they argue and reach a consensus.</p>",
                    "audioText": "Teams use the Fibonacci sequence for Story Points. During estimation, the team plays Planning Poker where everyone reveals their point estimate simultaneously to avoid bias.",
                    "audioTextHinglish": "Teams Story Points ke liye Fibonacci sequence use karte hain. Estimation ke time Planning Poker khela jata hai jahan sab ek sath points reveal karte hain taaki kisi ka bias na aaye.",
                    "keyInsight": "Simultaneous voting prevents the 'HIPPO' effect (Highest Paid Person's Opinion).",
                    "widgetType": "PlanningPokerWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "1 Question",
                    "narrative": "<p>Check your understanding of Estimation.</p>",
                    "audioText": "Check your understanding of Estimation.",
                    "audioTextHinglish": "Estimation par apna understanding check karein.",
                    "keyInsight": "Velocity (points burned per sprint) is a team's heartbeat.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "Why do Agile teams use Story Points (Fibonacci) instead of estimating in hours?",
                                "options": ["Because developers can't read a clock", "Because knowledge work is inherently unpredictable, so estimating complexity is more accurate than estimating time", "To make it harder for the client to understand", "Fibonacci numbers are faster to type"],
                                "correct": 1
                            }
                        ]
                    }
                }
            ]
        }

        # ---------------------------------------------------------
        # CHAPTER 6: The Ceremonies & Real-World Chaos
        # ---------------------------------------------------------
        configs[topics[5]] = {
            "parts": [
                {
                    "title": "The Rhythm of the Sprint",
                    "readingTime": "~3 min read",
                    "narrative": "<p>A Sprint is defined by four non-negotiable meetings, known as Ceremonies:</p><ol><li><strong>Sprint Planning:</strong> PO and Developers negotiate what fits into the next 2 weeks based on their historical velocity.</li><li><strong>Daily Standup:</strong> A 15-minute sync. What did I do yesterday? What am I doing today? Am I blocked?</li><li><strong>Sprint Review:</strong> Friday afternoon. The team demos working software to stakeholders.</li><li><strong>Sprint Retrospective:</strong> The engine of continuous improvement. What went well? What sucked? What are we changing next Sprint?</li></ol>",
                    "audioText": "A Sprint is defined by four Ceremonies: Sprint Planning, the Daily Standup, Sprint Review to demo software, and the Sprint Retrospective to improve the process.",
                    "audioTextHinglish": "Ek Sprint 4 Ceremonies se chalta hai: Sprint Planning, Daily Standup, software demo karne ke liye Sprint Review, aur process improve karne ke liye Sprint Retrospective.",
                    "keyInsight": "The Retrospective is the most important meeting. If you aren't improving, you aren't Agile.",
                    "widgetType": "SprintLifecycleWidget",
                    "widgetData": {}
                },
                {
                    "title": "Chaos Event: The Severity 1 Bug",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Scrum says you lock the scope. But what if production goes down? The app is crashing for millions of users.</p><p>You don't wait for the next Sprint. This is called a <strong>Severity 1 Bug</strong>. The Scrum Master creates a \"Fast Lane\" (a Kanban concept). The team drops whatever they are doing, swarms the bug, and fixes it immediately. Normal Sprint work is delayed, and velocity will drop for that sprint. Reality always overrides rules.</p>",
                    "audioText": "Scrum says lock the scope, but what if the app crashes? You create a Fast Lane. The team drops everything, swarms the bug, and fixes it immediately.",
                    "audioTextHinglish": "Scrum kehta hai scope lock karo, par agar app crash ho jaye toh? Team sab kuch chhod kar us bug ko turant fix karti hai. Reality rules se upar hoti hai.",
                    "keyInsight": "In an emergency, Scrum rules yield to common sense.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Chaos Event: Sprint Injection",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Mid-sprint, the CEO runs in. \"We need to add a Dogecoin logo to the homepage by Friday for a press release!\"</p><p>This is a <strong>Sprint Injection</strong>. The Scrum Master acts as a shield. They tell the Product Owner: \"If you force this 3-point Dogecoin story into the sprint, we must drop a different 3-point story out of the sprint to protect the team's capacity.\"</p><p>It's a strict negotiation: One in, One out.</p>",
                    "audioText": "Mid-sprint, the CEO demands a new feature. This is a Sprint Injection. The Scrum Master negotiates: if a 3-point story comes in, a different 3-point story must be dropped to protect the team.",
                    "audioTextHinglish": "Mid-sprint agar CEO naya feature maang le toh use Sprint Injection kehte hain. Scrum Master negotiate karta hai ki agar naya kaam aayega, toh utne hi points ka purana kaam nikalna padega.",
                    "keyInsight": "You cannot magically create more time. If scope increases, something else must drop.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Chaos Event: Spillover",
                    "readingTime": "~2 min read",
                    "narrative": "<p>It's Friday afternoon. The sprint is ending. The Bitcoin API is 90% done, but not 100%. What happens?</p><p>In Agile, there is no \"almost done.\" It is a binary state: Done, or Not Done. The 90% finished task is a <strong>Spillover</strong>. It gets moved back to the backlog and is carried into the next Sprint. The team earns 0 Story Points for it this sprint, hurting their velocity.</p><p>This hurts, but it keeps the team honest about what they actually finished.</p>",
                    "audioText": "If a task is 90% done when the sprint ends, it's a Spillover. It moves to the next sprint, and the team earns 0 points for it this time. There is no 'almost done' in Agile.",
                    "audioTextHinglish": "Agar sprint ke end par kaam 90% hi khatam ho, toh woh Spillover hota hai. Woh agle sprint mein chala jata hai aur is baar team ko 0 points milte hain.",
                    "keyInsight": "'Almost done' is a dangerous lie in software development.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "1 Question",
                    "narrative": "<p>Check your understanding of Agile chaos.</p>",
                    "audioText": "Check your understanding of Agile chaos.",
                    "audioTextHinglish": "Agile chaos par apna understanding check karein.",
                    "keyInsight": "Frameworks guide you, but reality dictates how you adapt.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "If a VIP requests an urgent new feature in the middle of a Sprint, what is the correct Agile response?",
                                "options": ["The developers work overtime to finish both", "The PO negotiates to drop an existing story of equal size to make room", "Tell the VIP they must wait 4 weeks", "Cancel the Sprint immediately"],
                                "correct": 1
                            }
                        ]
                    }
                }
            ]
        }

        # ---------------------------------------------------------
        # CHAPTER 7: Agile in Real-World Industries
        # ---------------------------------------------------------
        configs[topics[6]] = {
            "parts": [
                {
                    "title": "Software is Eating the World",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Agile was invented by software engineers, for software engineers. But today, every company is a software company.</p><p>Banks don't just hold cash; they build mobile apps. Car companies don't just bend metal; they write autonomous driving algorithms. Because of this, Agile has escaped the IT department and infected every industry on Earth.</p>",
                    "audioText": "Agile was invented for software, but today, every company is a software company. Agile has escaped the IT department and infected every industry on Earth.",
                    "audioTextHinglish": "Agile software ke liye bana tha, par aaj har company ek software company hai. Agile ab sirf IT department tak seemit nahi hai, har industry mein use hota hai.",
                    "keyInsight": "If your company builds anything complex, you need Agile.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Finance & Banking",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Historically, banks moved at a glacial pace due to heavy regulations (like SOX and PCI compliance). A simple feature could take years to clear compliance reviews.</p><p>Today, banks use <strong>Agile Risk Sprints</strong>. Instead of waiting 2 years to audit the software, the Security and Compliance teams are embedded directly into the Scrum teams. They audit the code every 2 weeks during the Sprint Review. This allows banks to release updates weekly while remaining perfectly legal.</p>",
                    "audioText": "Historically, banks moved slowly due to regulations. Today, Security and Compliance teams are embedded directly into the Scrum teams. They audit the code every 2 weeks, allowing fast, legal releases.",
                    "audioTextHinglish": "Pehle banks regulations ki wajah se bahut slow the. Aaj Security teams Scrum teams ke andar hoti hain, jo har 2 hafte mein code audit karti hain, jisse fast aur legal releases ho paati hain.",
                    "keyInsight": "Agile doesn't skip regulations; it integrates them into the daily workflow.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Hardware & Manufacturing",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Can you use Agile to build a physical object like a car or a rocket? Yes. SpaceX and Tesla are famous for using <strong>Agile Hardware Development</strong>.</p><p>Instead of designing a rocket for 10 years before launching it (Waterfall), SpaceX builds a prototype, launches it, watches it explode, learns from the data, and builds a better one next month (Agile).</p><p>Because physical materials are expensive, this requires advanced computer simulations (Digital Twins) to act as the \"code\" before the metal is actually cut.</p>",
                    "audioText": "Can you use Agile to build a rocket? Yes. SpaceX builds a prototype, launches it, watches it explode, learns, and builds a better one next month. This is Agile Hardware Development.",
                    "audioTextHinglish": "Kya aap rocket banane ke liye Agile use kar sakte hain? Haan. SpaceX ek prototype banata hai, launch karta hai, crash se seekhta hai aur agle mahine better banata hai. Yeh Agile Hardware hai.",
                    "keyInsight": "Hardware Agile trades expensive upfront design for rapid, iterative prototyping.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "1 Question",
                    "narrative": "<p>Check your understanding of Agile across industries.</p>",
                    "audioText": "Check your understanding of Agile across industries.",
                    "audioTextHinglish": "Industries mein Agile par apna understanding check karein.",
                    "keyInsight": "Agile principles are universal, but the implementation is highly specific to the industry.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "How do highly regulated industries like Banking successfully adopt Agile?",
                                "options": ["By ignoring regulations to move faster", "By embedding Security and Compliance personnel directly into the Agile teams to audit work iteratively", "By only releasing software once every 5 years", "By outsourcing everything"],
                                "correct": 1
                            }
                        ]
                    }
                }
            ]
        }

        # ---------------------------------------------------------
        # CHAPTER 8: Agile Tooling & The AI Revolution
        # ---------------------------------------------------------
        configs[topics[7]] = {
            "parts": [
                {
                    "title": "The Digital Board",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In 2001, Agile teams used physical sticky notes on a whiteboard. Today, teams are distributed globally, so they use digital tools.</p><p><strong>Jira (by Atlassian)</strong> is the undisputed king of Agile tracking. It holds every Epic, Story, and Bug. Other popular tools include <strong>Rally</strong> (often used for SAFe) and <strong>Linear</strong> (popular with fast-moving startups).</p>",
                    "audioText": "Agile teams used to use sticky notes. Today, they use digital tools. Jira is the undisputed king, while Rally is used for SAFe and Linear is popular with startups.",
                    "audioTextHinglish": "Pehle Agile teams sticky notes use karti thi. Aaj digital tools use hote hain. Jira sabse popular hai, jabki Rally badi companies mein aur Linear startups mein use hota hai.",
                    "keyInsight": "Tools don't make you Agile, but good tools make Agile possible for global teams.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "How AI is Changing Agile",
                    "readingTime": "~3 min read",
                    "narrative": "<p>For 20 years, Scrum Masters spent hours writing User Stories and calculating velocity. Today, Artificial Intelligence is automating the administrative overhead of Agile.</p><ul><li><strong>AI Story Writing:</strong> You give the AI an EPIC (e.g., \"Crypto Wallet\"), and it automatically generates 20 detailed User Stories with acceptance criteria.</li><li><strong>Predictive Analytics:</strong> AI analyzes Jira data to warn the PO: <em>\"Based on historical velocity, there is an 85% chance this sprint will spill over.\"</em></li><li><strong>Automated Standups:</strong> Bots summarize GitHub commits and Slack messages to automatically generate daily standup reports.</li></ul>",
                    "audioText": "AI is automating Agile administration. AI can write User Stories, use predictive analytics to warn of sprint spillovers, and automate daily standups by analyzing GitHub commits.",
                    "audioTextHinglish": "AI Agile administration ko automate kar raha hai. AI User Stories likh sakta hai, spillover ki warning de sakta hai, aur GitHub commits analyze karke standups automate kar sakta hai.",
                    "keyInsight": "AI frees developers and Scrum Masters from administrative paperwork, allowing them to focus on delivering value.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Future of the Developer",
                    "readingTime": "~2 min read",
                    "narrative": "<p>As AI tools like GitHub Copilot write more of the boilerplate code, the role of the Developer is shifting. In the past, a developer was a \"coder.\" In the future, a developer will be an \"editor\" and a \"system architect.\"</p><p>Agile will become even faster. Sprints might shrink from 2 weeks to 2 days as AI exponentially increases the speed of delivery.</p>",
                    "audioText": "As AI writes more code, developers will shift from being 'coders' to 'editors'. Agile will get faster, and Sprints might shrink from 2 weeks to 2 days.",
                    "audioTextHinglish": "Jaise AI code likhne lagta hai, developers 'coders' se 'editors' ban jayenge. Agile aur fast hoga, aur Sprints shayad 2 weeks se ghat kar 2 days ke ho jayein.",
                    "keyInsight": "AI accelerates Agile, making the feedback loop between idea and working software shorter than ever before.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "1 Question",
                    "narrative": "<p>Check your understanding of AI in Agile.</p>",
                    "audioText": "Check your understanding of AI in Agile.",
                    "audioTextHinglish": "Agile mein AI par apna understanding check karein.",
                    "keyInsight": "The future of Agile is AI-assisted, not AI-replaced.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "How is AI currently providing the most value to Agile teams using tools like Jira?",
                                "options": ["By firing the Product Owner", "By automatically writing code and deploying to production without human review", "By automating administrative tasks like writing user stories and predicting sprint spillovers based on data", "By increasing the length of Sprints"],
                                "correct": 2
                            }
                        ]
                    }
                }
            ]
        }

        # Write configs to database
        for idx, topic_name in enumerate(topics):
            topic = db.query(LearningTopic).filter_by(subject_id=agile_subject.id, name=topic_name).first()
            if topic and topic_name in configs:
                topic.lesson_config_json = json.dumps(configs[topic_name])
        db.commit()

    except Exception as e:
        print(f"Error seeding Agile framework Chapters: {e}")
        db.rollback()
    finally:
        db.close()
