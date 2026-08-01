import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part6():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "Probability & Statistics"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "The Confident Machine",
                    "readingTime": "~2 min read",
                    "narrative": "<p>So far, we've seen how an AI uses Calculus to learn. But when it finally makes a prediction, what does that prediction actually look like?</p><p>If you show an AI a picture and ask, \"Is this a Cat, a Dog, or a Bird?\", the AI does not simply output the word \"Cat\". Instead, it outputs raw, messy mathematical numbers called <strong>Logits</strong>. It might output <code>2.5</code> for Cat, <code>-1.0</code> for Dog, and <code>0.8</code> for Bird.</p><p>How do we translate these messy numbers into something humans understand, like percentages? We use a mathematical function called <strong>Softmax</strong>.</p>",
                    "audioText": "When an AI makes a prediction, it doesn't just give you a simple answer. It outputs raw, messy numbers called Logits. To turn these messy numbers into clean percentages, it uses a mathematical function called Softmax.",
                    "audioTextHinglish": "Jab AI koi prediction karta hai, toh woh seedha answer nahi deta. Woh kuch raw numbers output karta hai jise Logits kehte hain. In messy numbers ko percentages mein badalne ke liye Softmax naam ke math function ka use hota hai.",
                    "keyInsight": "An AI's brain doesn't deal in absolute truths; it deals purely in probabilities.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Softmax Function",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>The Softmax function does three very important things to the raw Logits:</p><ol><li><strong>Exponentiates:</strong> It raises the mathematical constant <em>e</em> to the power of the logit. This forces all numbers to be positive and exaggerates the differences (making the AI more decisive).</li><li><strong>Sums:</strong> It adds all the exponentiated values together to get a total.</li><li><strong>Divides:</strong> It divides each individual value by the total. This guarantees that all the final numbers add up perfectly to 100%.</li></ol><p>Try adjusting the raw Logits below and watch how Softmax translates them into a final Confidence percentage. Also, try adjusting the <strong>Temperature</strong>, which controls how \"creative\" or \"greedy\" the AI is!</p>",
                    "audioText": "The Softmax function takes the raw numbers, makes them all positive, exaggerates the differences, and then mathematically forces them to add up perfectly to one hundred percent. Try playing with the Softmax Sandbox below to see it in action.",
                    "audioTextHinglish": "Softmax function raw numbers ko positive banata hai, unke differences ko bada karta hai, aur unhe aapas mein divide karke ek perfect 100% mein fit kar deta hai. Niche Softmax Sandbox ke saath play karke dekhein.",
                    "keyInsight": "Softmax is how an AI decides it is 95% confident it's a Cat and 5% confident it's a Bird.",
                    "widgetType": "SoftmaxWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "3 Questions",
                    "narrative": "<p>Test your understanding of how AI handles probabilities.</p>",
                    "audioText": "Test your understanding of how AI handles probabilities.",
                    "audioTextHinglish": "AI probabilities ko kaise handle karta hai, ispar apna knowledge test karein.",
                    "keyInsight": "Probability is the language of machine learning.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What do we call the raw, messy mathematical numbers output by the AI before they are turned into percentages?",
                                "options": ["Derivatives", "Logits", "Gradients", "Tensors"],
                                "correct": 1
                            },
                            {
                                "q": "What is the primary purpose of the Softmax function?",
                                "options": ["To lower the temperature of the server", "To force raw numbers to add up perfectly to 100% probability", "To calculate the derivative of the error", "To convert images into text"],
                                "correct": 1
                            },
                            {
                                "q": "If you increase the 'Temperature' of the Softmax function, what happens to the AI's confidence?",
                                "options": ["It becomes extremely overconfident (greedy) in its top choice", "It crashes", "It becomes less certain, spreading its confidence out (making it more creative)", "It deletes its memory"],
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
        print(f"Error seeding AI Masterclass Part 6: {e}")
        db.rollback()
    finally:
        db.close()
