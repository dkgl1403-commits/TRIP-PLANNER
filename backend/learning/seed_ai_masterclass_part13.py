import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part13():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
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
                    "title": "From Thinker to Actor",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In the last two chapters, we solved major AI flaws: we gave AI the ability to <em>read facts</em> (RAG) and the ability to <em>think deeply</em> (Reasoning) to stop hallucinations. But despite being incredibly smart, the AI was still trapped in a chat box. It couldn't <em>do</em> anything.</p><p>If you asked an AI to \"email my boss the weather,\" it would reply: <em>\"I'm sorry, I am just an AI. I cannot send emails or check live weather.\"</em></p><p>That is, until researchers figured out how to give AI \"hands.\" We call these <strong>Agents</strong>.</p>",
                    "audioText": "In previous chapters, we gave AI the ability to read and think. But it was still trapped in a chat box, unable to do anything. That is until researchers gave AI hands, creating what we call Agents.",
                    "audioTextHinglish": "Pichle chapters mein humne dekha ki AI read aur soch toh sakta hai. Par chat box mein qaid tha, kuch practically nahi kar sakta tha. Fir researchers ne AI ko 'hands' diye, jinhe hum Agents kehte hain.",
                    "keyInsight": "Agents are AIs that have escaped the chat box by being given access to real-world Tools.",
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
                    "narrative": "<p>To build an Agent, developers provide the AI with a list of <strong>Tools</strong>, like a calculator, a web browser API, or an email API. But just giving it tools isn't enough; it has to know <em>when</em> and <em>how</em> to use them.</p><p>This is where our Chapter 12 \"Deep Reasoning\" comes back into play! The AI is programmed to use the <strong>ReAct Loop</strong> (Reasoning + Acting).</p><p>1. <strong>Thought:</strong> The AI uses its scratchpad to decide what tool it needs.<br/>2. <strong>Action:</strong> It triggers the API (e.g., `get_weather(Tokyo)`).<br/>3. <strong>Observation:</strong> It reads the result returned by the tool.<br/>4. <strong>Thought:</strong> It decides if it has enough info to answer, or if it needs to trigger another tool.</p>",
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
                    "title": "Mastery Quiz",
                    "readingTime": "2 Questions",
                    "narrative": "<p>Test your knowledge on AI Agents and the ReAct framework.</p>",
                    "audioText": "Test your knowledge on AI Agents and the ReAct framework.",
                    "audioTextHinglish": "AI Agents aur ReAct framework par apna knowledge test karein.",
                    "keyInsight": "Agents represent the leap from Generative AI to Autonomous AI.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What makes an AI an 'Agent'?",
                                "options": ["It can generate longer essays", "It has access to Tools to take actions outside the chat box", "It doesn't hallucinate", "It is connected to the internet permanently"],
                                "correct": 1
                            },
                            {
                                "q": "What does the 'Observation' step in the ReAct loop do?",
                                "options": ["The AI observes the user typing", "The AI looks at pictures", "The AI reads the result returned by the Tool it just triggered", "The AI guesses the answer"],
                                "correct": 2
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
