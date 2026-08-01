import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part9():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "The Three Stages of Training"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "Stage 1: Pre-training (Reading the Internet)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>When a Neural Network is first built, it is a blank slate. The weights are totally random. It doesn't even know English.</p><p>In Stage 1, we give the AI a massive amount of data (basically the entire public internet) and ask it to do one simple task: <strong>\"Guess the next word\"</strong>.</p><p>It does this trillions of times. Over months, it learns grammar, facts, reasoning, and programming. However, at the end of Stage 1, it is just a \"document completer\". If you say <em>\"Write a poem\"</em>, it might just complete the sentence with <em>\"about a dog\"</em> instead of actually writing a poem.</p>",
                    "audioText": "When first built, an AI is completely blank. In Stage 1, Pre-training, we feed it the entire internet and ask it to guess the next word trillions of times. It learns facts and grammar, but it's just an auto-completer, not an assistant.",
                    "audioTextHinglish": "Shuru mein AI bilkul khali hota hai. Stage 1, yani Pre-training mein, hum ise poora internet padhate hain aur agla word guess karne ko kehte hain. Yeh facts aur grammar seekh jata hai, par abhi sirf ek auto-completer hai, assistant nahi.",
                    "keyInsight": "Pre-training teaches the AI raw knowledge and reasoning, but not how to be helpful.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Stage 2: Supervised Fine-Tuning",
                    "readingTime": "~2 min read",
                    "narrative": "<p>To turn the \"document completer\" into a helpful assistant, we need Stage 2: Supervised Fine-Tuning (SFT).</p><p>We hire humans to write thousands of high-quality Examples of Prompts and Responses. For example:<br/><strong>Prompt:</strong> \"Write a poem\"<br/><strong>Response:</strong> \"Roses are red...\"</p><p>By showing the AI exactly how a helpful assistant should behave, it stops auto-completing documents and starts answering questions directly.</p>",
                    "audioText": "To make the AI helpful, we use Stage 2: Supervised Fine-Tuning. Humans write thousands of perfect prompt and response examples. This teaches the AI how to act like a helpful assistant instead of just auto-completing text.",
                    "audioTextHinglish": "AI ko helpful banane ke liye, hum Stage 2 ka use karte hain: Supervised Fine-Tuning. Humans hazaro perfect prompt aur response ke examples likhte hain, jisse AI ek assistant ki tarah behave karna seekhta hai.",
                    "keyInsight": "Fine-tuning teaches the AI the format of being a helpful assistant.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Stage 3: RLHF (Human Values)",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Even after Stage 2, the AI might be toxic, rude, or give dangerous advice (like how to build a bomb). How do we teach a math equation human morals?</p><p>We use Stage 3: <strong>Reinforcement Learning from Human Feedback (RLHF)</strong>.</p><p>We have the AI generate multiple answers, and humans rate them with a \"Thumbs Up\" or \"Thumbs Down\". Try it yourself below! Act as the human and teach the AI how to respond safely.</p>",
                    "audioText": "To teach the AI human morals and safety, we use Stage 3: RLHF. Humans read the AI's answers and give them a thumbs up or thumbs down. Try it yourself below to teach the AI how to be safe!",
                    "audioTextHinglish": "AI ko human morals aur safety sikhane ke liye, hum Stage 3 yani RLHF ka use karte hain. Humans AI ke answers padhkar thumbs up ya down dete hain. Niche khud try karein aur AI ko safe banna sikhayein!",
                    "keyInsight": "RLHF aligns the AI with human values and safety guidelines.",
                    "widgetType": "RLHFWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "3 Questions",
                    "narrative": "<p>Test your knowledge on the Three Stages of Training.</p>",
                    "audioText": "Test your knowledge on the Three Stages of Training.",
                    "audioTextHinglish": "Three Stages of Training par apna knowledge test karein.",
                    "keyInsight": "Training an AI requires massive data, formatting, and human alignment.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What is the primary task the AI does during Stage 1: Pre-training?",
                                "options": ["Guess the next word", "Write poetry", "Read user feedback", "Solve calculus problems"],
                                "correct": 0
                            },
                            {
                                "q": "Why is Stage 2 (Supervised Fine-Tuning) necessary?",
                                "options": ["To make the AI faster", "To teach it how to behave like a helpful assistant instead of an auto-completer", "To give it access to the internet", "To teach it to guess the next word"],
                                "correct": 1
                            },
                            {
                                "q": "What does RLHF stand for in Stage 3?",
                                "options": ["Real-time Learning from Human Feedback", "Robotic Learning with Hard Facts", "Reinforcement Learning from Human Feedback", "Recurrent Logic and Human Formatting"],
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
        print(f"Error seeding AI Masterclass Part 9: {e}")
        db.rollback()
    finally:
        db.close()
