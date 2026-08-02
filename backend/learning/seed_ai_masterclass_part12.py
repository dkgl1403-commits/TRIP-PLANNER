import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part12():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "Hallucinations & Reasoning"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            topic = LearningTopic(subject_id=ai_subject.id, name=topic_name)
            db.add(topic)
            db.commit()

        config = {
            "parts": [
                {
                    "title": "The Hallucination Crisis",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In 2023, two lawyers submitted a legal brief to a New York federal judge citing six past court cases. There was just one problem: <strong>None of the cases were real.</strong> ChatGPT had completely invented them.</p><p>This phenomenon, where an AI confidently makes up fake information, is called a <strong>Hallucination</strong>. It became the single biggest roadblock to adopting AI in medicine, law, and finance.</p><p>If an AI can pass the Bar Exam but also invents fake laws, how can we ever trust it? To understand how we solved this, we first have to understand <em>why</em> they lie.</p>",
                    "audioText": "In 2023, lawyers submitted a brief to a judge citing fake court cases invented by ChatGPT. This is called a Hallucination, and it became the biggest roadblock to adopting AI. If an AI can pass the Bar Exam but also invents fake laws, how can we trust it?",
                    "audioTextHinglish": "2023 mein, lawyers ne ek judge ko fake court cases submit kiye jo ChatGPT ne banaye the. Ise Hallucination kehte hain, aur ye AI adoption ka sabse bada roadblock ban gaya. Agar AI fake laws bana sakta hai, toh hum uspar trust kaise karein?",
                    "keyInsight": "Hallucinations severely impacted AI adoption by destroying trust in high-stakes fields like law and medicine.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Why Do They Lie? (The Root Causes)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>AI models don't \"lie\" on purpose. They operate using <em>System 1 thinking</em>—they act on instinct. They read your prompt and instantly predict the next word.</p><p>Several factors increase hallucinations: <strong>1) High Temperature</strong> (making the AI too creative), <strong>2) Obscure Topics</strong> (the AI hasn't read enough about it, so it guesses), and <strong>3) Lack of Planning</strong> (it doesn't pause to think ahead).</p><p>Because they don't plan, they stumble on math or logic puzzles, blurting out whatever <em>sounds</em> intuitively right.</p>",
                    "audioText": "AI models don't lie on purpose. They operate on instinct, instantly predicting the next word. Hallucinations increase with high temperature, obscure topics, and a lack of planning. Because they don't plan, they stumble on logic puzzles.",
                    "audioTextHinglish": "AI jaanbuch kar jhooth nahi bolte. Wo instinct par kaam karte hain, turant agla word predict karke. Jab temperature high ho, topic obscure ho, ya planning na ho, tab hallucinations badh jate hain.",
                    "keyInsight": "Hallucinations happen because standard models predict words instantly without planning ahead.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Solution: Thinking Before Speaking",
                    "readingTime": "~3 min read",
                    "narrative": "<p>To solve the hallucination crisis, researchers combined two breakthroughs: <strong>RAG</strong> (giving the AI factual documents to read) and <strong>Deep Reasoning</strong> (System 2 thinking).</p><p>With Deep Reasoning, the AI is given a hidden \"scratchpad\". Instead of answering instantly, it talks to itself, breaks the problem down, and fact-checks its own logic. If it catches a mistake, it rewrites its thoughts.</p><p>While hallucinations are never 100% eliminated (because the AI is fundamentally still predicting words), Reasoning models have drastically reduced errors, allowing AI to solve PhD-level problems safely!</p>",
                    "audioText": "To solve this, researchers combined RAG and Deep Reasoning. The AI uses a hidden scratchpad to talk to itself, break the problem down, and fact-check its own logic. While not 100% eliminated, this drastically reduces errors.",
                    "audioTextHinglish": "Ise solve karne ke liye, researchers ne RAG aur Deep Reasoning ko combine kiya. AI ek hidden scratchpad par khud se baat karta hai aur apni logic ko fact-check karta hai. Isse errors bohot kam ho gaye hain.",
                    "keyInsight": "Deep Reasoning acts as an internal fact-checker, drastically reducing hallucinations.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Interactive Reasoning Simulator",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Let's try a famous logic puzzle: <em>A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?</em></p><p>Most humans intuitively (and incorrectly) guess 10 cents. A standard AI does exactly the same thing!</p><p>Try the <strong>Fast Generation</strong> to see the AI hallucinate. Then, try <strong>Deep Reasoning</strong> to watch it use a scratchpad to find the true answer.</p>",
                    "audioText": "Let's try a famous logic puzzle. A bat and a ball cost $1.10. The bat costs $1.00 more than the ball. How much does the ball cost? Try the Fast Generation to see the AI hallucinate, then try Deep Reasoning to watch it think step-by-step.",
                    "audioTextHinglish": "Chaliye ek famous logic puzzle try karte hain. Bat aur ball ki total cost $1.10 hai. Bat, ball se $1 mehenga hai. Ball kitne ki hui? Fast Generation try karein jisme AI galti karega, fir Deep Reasoning try karein jahan AI step-by-step sochega.",
                    "keyInsight": "Deep Reasoning allows AI to catch its own intuitive mistakes.",
                    "widgetType": "ReasoningWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "2 Questions",
                    "narrative": "<p>Test your knowledge on Hallucinations and Reasoning.</p>",
                    "audioText": "Test your knowledge on Hallucinations and Reasoning.",
                    "audioTextHinglish": "Hallucinations aur Reasoning par apna knowledge test karein.",
                    "keyInsight": "Understanding why AI hallucinates helps you know when to trust it.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "Why do standard LLMs often hallucinate on math problems?",
                                "options": ["Because they are predicting the next word as fast as possible without planning", "Because they don't know numbers", "Because they want to trick you", "Because they are searching the wrong database"],
                                "correct": 0
                            },
                            {
                                "q": "What happens during 'Deep Reasoning' (System 2 thinking)?",
                                "options": ["The AI searches Google for the answer", "The AI breaks the problem down step-by-step in a hidden scratchpad", "The AI refuses to answer", "The AI asks a human for help"],
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
        print(f"Error seeding AI Masterclass Part 12: {e}")
        db.rollback()
    finally:
        db.close()
