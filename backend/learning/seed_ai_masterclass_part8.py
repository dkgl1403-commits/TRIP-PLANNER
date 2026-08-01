import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part8():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "The Transformer Engine"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "The Problem with Old AI",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Neural Networks were great at looking at images, because an image is just a static grid of pixels. But what about text?</p><p>Language is a <strong>sequence</strong>. The order of the words matters. Early AI tried to read sentences one word at a time, using an architecture called Recurrent Neural Networks (RNNs). The problem? They had terrible memory. By the time an RNN reached the end of a long paragraph, it had completely forgotten what the first sentence was about.</p><p>Reading word-by-word was also painfully slow. AI needed a new architecture to understand language.</p>",
                    "audioText": "Early AI was terrible at reading text. It read sentences one word at a time from left to right. Because of this, by the time it reached the end of a paragraph, it forgot how the paragraph started. It needed a totally new architecture.",
                    "audioTextHinglish": "Pehle ka AI text padhne mein bahut kharab tha. Woh sentence ko ek-ek word karke left se right padhta tha. Is wajah se, paragraph ke end tak pahunchte-pahunchte woh bhool jata tha ki shuruat mein kya tha. Ise ek naye architecture ki zaroorat thi.",
                    "keyInsight": "Reading word-by-word sequentially is too slow and causes the AI to forget context.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Attention Is All You Need (2017)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In 2017, a team of researchers at Google published a paper titled <em>\"Attention Is All You Need\"</em>. It is arguably the most important AI paper of the 21st century.</p><p>They invented a new architecture called the <strong>Transformer</strong>. Instead of reading a sentence one word at a time, the Transformer reads <em>every single word in the entire document at the exact same time</em>.</p><p>Because it reads everything at once, it is incredibly fast (perfect for GPUs). But how does it know which words are connected? It uses something called the <strong>Self-Attention Mechanism</strong>.</p>",
                    "audioText": "In 2017, Google researchers invented the Transformer architecture. Instead of reading word by word, it reads the entire document at the exact same time. This made it incredibly fast. To understand grammar, it uses the Self-Attention mechanism.",
                    "audioTextHinglish": "2017 mein, Google ke researchers ne Transformer architecture banaya. Word by word padhne ke bajaye, yeh poore document ko ek hi time par padhta hai. Yeh bahut fast tha. Grammar samajhne ke liye, yeh Self-Attention mechanism ka use karta hai.",
                    "keyInsight": "Transformers process all words simultaneously instead of sequentially.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Self-Attention Mechanism",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Self-Attention allows every word to look at every other word in the sentence to figure out context.</p><p>For example, take the sentence: <em>\"The animal didn't cross the street because it was too tired.\"</em></p><p>What does <strong>\"it\"</strong> refer to? The street, or the animal? As humans, we know animals get tired, streets don't. Below, click on the word <strong>\"it\"</strong> to see how the Transformer uses Attention to mathematically link \"it\" to \"animal\".</p>",
                    "audioText": "Self Attention lets every word look at every other word to find context. Try it yourself! Click on the word 'it' below to see how the AI figures out what 'it' refers to.",
                    "audioTextHinglish": "Self Attention har word ko doosre words ko dekhne deta hai taaki context samajh aaye. Ise try karein! Niche diye gaye word 'it' par click karein aur dekhein ki AI kaise pata lagata hai ki 'it' kiske liye use hua hai.",
                    "keyInsight": "Attention mathematically links related words across long distances.",
                    "widgetType": "AttentionWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "3 Questions",
                    "narrative": "<p>Test your knowledge on Transformers and Attention.</p>",
                    "audioText": "Test your knowledge on Transformers and Attention.",
                    "audioTextHinglish": "Transformers aur Attention par apna knowledge test karein.",
                    "keyInsight": "Transformers are the engine behind modern AI.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What was the main problem with older language AI (like RNNs)?",
                                "options": ["They were too fast", "They read word-by-word and forgot the beginning of the sentence", "They couldn't process images", "They hallucinated too much"],
                                "correct": 1
                            },
                            {
                                "q": "What breakthrough did the 2017 'Attention Is All You Need' paper introduce?",
                                "options": ["The Perceptron", "The Softmax Function", "The Transformer Architecture", "Gradient Descent"],
                                "correct": 2
                            },
                            {
                                "q": "How does the Transformer's Self-Attention mechanism work?",
                                "options": ["It deletes useless words to save memory", "It reads words one at a time from left to right", "It allows every word to look at every other word simultaneously to build context", "It guesses the next word randomly"],
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
        print(f"Error seeding AI Masterclass Part 8: {e}")
        db.rollback()
    finally:
        db.close()
