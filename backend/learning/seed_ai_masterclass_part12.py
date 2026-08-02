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
                    "title": "The Fast Talker (System 1)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Why do AI models confidently make up fake information? This is called a <strong>Hallucination</strong>.</p><p>Standard LLMs operate using what psychologists call <em>System 1 thinking</em>—they act on instinct. They read your prompt and immediately start predicting the very next word, as fast as possible.</p><p>Because they don't pause to think or plan ahead, they often stumble when faced with math or complex logic puzzles. They just blurt out whatever <em>sounds</em> right intuitively.</p>",
                    "audioText": "Why do AI models confidently make up fake information? This is called a Hallucination. Standard LLMs act on instinct. They read your prompt and immediately start predicting the very next word. Because they don't pause to think, they often stumble on math or logic puzzles.",
                    "audioTextHinglish": "AI models confidently galat information kyun banate hain? Ise Hallucination kehte hain. Standard LLMs instinct par kaam karte hain. Wo bina soche turant agla word predict karna shuru kar dete hain, isliye math ya logic puzzles mein galti kar dete hain.",
                    "keyInsight": "Hallucinations happen because standard models predict words instantly without planning ahead.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Thinking Before Speaking (System 2)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>To fix this, researchers introduced <strong>Deep Reasoning</strong> (or Chain-of-Thought). This is <em>System 2 thinking</em>.</p><p>Instead of answering instantly, the AI is given a hidden \"scratchpad\". It uses this space to talk to itself, break the problem down into steps, test different theories, and catch its own mistakes.</p><p>Only after it is confident in its internal logic does it output the final answer to you. This drastically reduces hallucinations and allows AI to solve PhD-level math problems!</p>",
                    "audioText": "To fix this, researchers introduced Deep Reasoning, or Chain-of-Thought. Instead of answering instantly, the AI uses a hidden scratchpad to talk to itself, break the problem down, and catch its own mistakes before giving you the final answer.",
                    "audioTextHinglish": "Ise theek karne ke liye, researchers ne Deep Reasoning, ya Chain-of-Thought introduce kiya. AI turant answer dene ke bajaye, ek hidden scratchpad par khud se baat karta hai, problem ko samajhta hai aur galtiyan theek karne ke baad hi final answer deta hai.",
                    "keyInsight": "Reasoning models think step-by-step in a hidden scratchpad before answering.",
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
