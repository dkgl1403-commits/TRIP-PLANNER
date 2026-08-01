import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part4_5():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "The Aha Moment: Backpropagation"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            # Create if it doesn't exist (handle ordering in frontend if needed, or rely on insert order)
            # Actually, seed scripts are run in order.
            topic = LearningTopic(
                subject_id=ai_subject.id,
                name=topic_name
            )
            db.add(topic)
            db.commit()

        config = {
            "parts": [
                {
                    "title": "The Credit Assignment Problem",
                    "readingTime": "~2 min read",
                    "narrative": "<p>By the 1970s, scientists knew how to build a basic neural network. They knew that when the AI made a prediction, it would usually be wrong, producing an <strong>Error</strong>.</p><p>But they faced an impossible hurdle: <em>The Credit Assignment Problem</em>. If an AI has 3 hidden layers and 10,000 weights (volume knobs), and it outputs the wrong answer, which of those 10,000 knobs is at fault? Who gets the blame?</p><p>Because they couldn't figure out how to assign blame to the hidden layers, they couldn't update the weights. The AI couldn't learn. This limitation directly caused the Second AI Winter, where funding dried up and neural networks were abandoned as a failure.</p>",
                    "audioText": "In the 1970s, scientists faced the Credit Assignment Problem. When a neural network made a mistake, no one knew which of its thousands of internal weights was responsible. Because they couldn't assign blame, the AI couldn't learn. This failure caused the Second AI Winter.",
                    "audioTextHinglish": "1970s mein, scientists ke saamne Credit Assignment Problem thi. Jab neural network galati karta tha, toh kisi ko nahi pata hota tha ki uski hazaro internal weights mein se kaunsi weight zimmedar hai. AI seekh nahi paaya, jiski wajah se Second AI Winter shuru hua.",
                    "keyInsight": "An AI cannot learn if it doesn't know which part of its brain made the mistake.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The 1986 Breakthrough",
                    "readingTime": "~3 min read",
                    "narrative": "<p>In 1986, three researchers—Geoffrey Hinton, David Rumelhart, and Ronald Williams—published a paper that would change the world. They didn't invent new math; instead, they looked back to a 17th-century mathematical tool: <strong>Calculus</strong>.</p><p>Specifically, they realized they could use the <em>Chain Rule</em> from calculus. The Chain Rule allows you to calculate the derivative (slope) of nested functions. Since a neural network is just layers of nested math functions, the Chain Rule was the perfect key.</p><p>They created an algorithm called <strong>Backpropagation</strong> (Backward Propagation of Errors). For the first time, an AI could calculate the final Error, and then pass that error <em>backwards</em> through the network, using Calculus to tell every single weight exactly how much of the blame it deserved.</p>",
                    "audioText": "In 1986, researchers Geoffrey Hinton, David Rumelhart, and Ronald Williams solved the problem. They realized they could use the Chain Rule from Calculus to pass the error backward through the network. This algorithm, called Backpropagation, allowed the AI to assign exact blame to every single weight.",
                    "audioTextHinglish": "1986 mein, Geoffrey Hinton aur unki team ne Calculus ke Chain Rule ka use karke is problem ko solve kiya. Unhone Backpropagation naam ka algorithm banaya jisse AI apne error ko backward bhej kar har ek weight ki exact galati nikal sakti thi.",
                    "keyInsight": "Backpropagation is the bridge between a static neural network and a machine that can actually learn.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "2 Questions",
                    "narrative": "<p>Test your understanding of the history of Backpropagation.</p>",
                    "audioText": "Test your understanding of the history of Backpropagation.",
                    "audioTextHinglish": "Backpropagation ki history ke bare mein apna knowledge test karein.",
                    "keyInsight": "Calculus saved Neural Networks from being forgotten.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What was the 'Credit Assignment Problem' that caused the Second AI Winter?",
                                "options": ["Scientists couldn't secure financial credit to buy computers", "Nobody knew how to determine which internal weights were to blame for an AI's error", "The computers were too slow to process algebra", "AI models refused to take credit for their correct answers"],
                                "correct": 1
                            },
                            {
                                "q": "What mathematical concept from Calculus is the foundation of Backpropagation?",
                                "options": ["The Pythagorean Theorem", "The Chain Rule", "The Quadratic Formula", "Linear Regression"],
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
        print(f"Error seeding AI Masterclass Part 4.5: {e}")
        db.rollback()
    finally:
        db.close()
