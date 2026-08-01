import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part2():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "The AI Winters"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "The Era of Symbolic AI",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In the 1970s, the dominant approach to AI was <strong>Symbolic AI</strong> or \"Good Old-Fashioned AI\" (GOFAI). The idea was simple: if we can just write down all the rules of the world, the machine will be intelligent.</p><p>These were essentially massive <em>\"If/Then\"</em> rule engines. If a doctor inputs \"patient has fever and cough\", the rules say \"diagnose flu\". But the real world is messy. How do you write a rule for what a cat looks like? A cat can be curled up, stretching, hidden behind a couch, or orange. You can't write an IF/THEN rule for every possible configuration of pixels.</p>",
                    "audioText": "In the 1970s, AI was built using Symbolic AI. It relied on massive If-Then rule engines. But the real world is messy. You can't write a rule for every way a cat can look in a photo.",
                    "audioTextHinglish": "1970s mein AI Symbolic AI par based tha. Isme massive If-Then rules the. Lekin real world messy hai. Aap har situation ke liye rule nahi likh sakte, jaise ki ek cat photo mein kaisi dikhegi.",
                    "keyInsight": "Symbolic AI was brittle. If a rule wasn't programmed, the AI crashed.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Hardware Bottleneck",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Beyond brittle software, the physical hardware of the 70s and 80s was millions of times too slow. To mimic human thought, you need to calculate millions of probabilities instantly. The CPUs of the time simply couldn't handle the math required for complex neural networks.</p><p>Furthermore, there was no <strong>Big Data</strong>. To train a neural network to recognize a cat, you need millions of pictures of cats. Before the internet, this dataset simply did not exist.</p>",
                    "audioText": "Beyond brittle software, the hardware of the 70s and 80s was millions of times too slow. And without the internet, there was no Big Data to train neural networks.",
                    "audioTextHinglish": "Brittle software ke alawa, 70s aur 80s ka hardware millions of times slow tha. Aur internet ke bina, neural networks ko train karne ke liye koi Big Data nahi tha.",
                    "keyInsight": "The theory of Neural Networks existed, but humanity lacked both the computing power and the data to make them work.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Crash",
                    "readingTime": "~1 min read",
                    "narrative": "<p>Because AI researchers had promised too much too soon, and failed to deliver on those promises, governments and investors pulled their funding. The world entered the <strong>AI Winters</strong>.</p><p>During this period, the term \"Artificial Intelligence\" became taboo. It was considered a failed sci-fi dream. Researchers had to rename their work to \"Machine Learning\" or \"Data Analytics\" just to get grants.</p>",
                    "audioText": "Because AI researchers promised too much and failed to deliver, funding dried up. The world entered the AI Winters, where AI was considered a failed sci-fi dream.",
                    "audioTextHinglish": "Kyunki AI researchers ne bahut jaldi bade promises kiye aur unhe poora nahi kar paye, funding band ho gayi. Is period ko 'AI Winters' kaha gaya, jahan AI ko ek failed sapna maana gaya.",
                    "keyInsight": "Hype without hardware or data leads to collapse.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "3 Questions",
                    "narrative": "<p>Test your knowledge of the AI Winters.</p>",
                    "audioText": "Test your knowledge of the AI Winters.",
                    "audioTextHinglish": "AI Winters ke baare mein apna knowledge test karein.",
                    "keyInsight": "Understanding why AI failed in the past helps us appreciate why it works today.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What was the main flaw of 'Symbolic AI'?",
                                "options": ["It required too much electricity", "It was brittle and relied on manual If/Then rules", "It hallucinated too often", "It required too many GPUs"],
                                "correct": 1
                            },
                            {
                                "q": "Which two critical things were missing in the 1980s that prevented Neural Networks from working?",
                                "options": ["Funding and Python", "The Turing Test and Perceptrons", "Big Data and fast hardware/GPUs", "Robots and sensors"],
                                "correct": 2
                            },
                            {
                                "q": "What is an 'AI Winter'?",
                                "options": ["A period of reduced funding and interest in AI", "When AI models are cooled using liquid nitrogen", "A bug in early AI code causing freezing", "The season when the Dartmouth Workshop occurred"],
                                "correct": 0
                            }
                        ]
                    }
                }
            ]
        }

        topic.lesson_config_json = json.dumps(config)
        db.commit()
    except Exception as e:
        print(f"Error seeding AI Masterclass Part 2: {e}")
        db.rollback()
    finally:
        db.close()
