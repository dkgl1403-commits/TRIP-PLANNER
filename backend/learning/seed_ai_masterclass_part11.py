import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part11():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=99, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "Retrieval-Augmented Generation (RAG)"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            topic = LearningTopic(subject_id=ai_subject.id, name=topic_name)
            db.add(topic)
            db.commit()

        config = {
            "parts": [
                {
                    "title": "The Open-Book Test",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Large Language Models are incredibly smart, but they have a fatal flaw: <strong>They don't know your private data</strong>, and their knowledge stops at a certain date (the day they finished training).</p><p>If you ask a model about your company's refund policy, it might confidently make up a fake policy (a Hallucination). To fix this, we use a technique called <strong>RAG (Retrieval-Augmented Generation)</strong>.</p><p>RAG acts like an open-book test. Instead of forcing the AI to memorize facts, we let it read your private documents right before it answers.</p>",
                    "audioText": "Large Language Models are smart, but they don't know your private data. If you ask about your company policy, they might make it up. To fix this, we use RAG, which stands for Retrieval-Augmented Generation. RAG acts like an open-book test. It lets the AI read your private documents right before it answers.",
                    "audioTextHinglish": "Large Language Models bohot smart hote hain, lekin unhe aapke private data ke baare mein nahi pata. Agar aap unse apni company policy puchein, toh shayad wo kuch bhi bana ke bol de. Ise theek karne ke liye hum RAG ka use karte hain. RAG ek open-book test ki tarah kaam karta hai. Ye AI ko answer dene se pehle aapke private documents padhne deta hai.",
                    "keyInsight": "RAG prevents hallucinations by forcing the AI to read specific facts before answering.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The 3 Steps of RAG",
                    "readingTime": "~2 min read",
                    "narrative": "<p>RAG works in three distinct steps:</p><ol><li><strong>The Library (Knowledge Base):</strong> Your private documents are chopped up and stored in a special database.</li><li><strong>The Retrieval:</strong> When a user asks a question, the system searches the Library to find the 2 or 3 paragraphs that hold the answer.</li><li><strong>The Generation:</strong> The system pastes those paragraphs directly into the AI's <em>Context Window</em> along with the user's question. The AI simply reads the text and generates the perfect answer.</li></ol>",
                    "audioText": "RAG works in three steps. First, your private documents are chopped up and stored in a database. Second, when you ask a question, the system retrieves the most relevant paragraphs. Third, it pastes those paragraphs into the AI's Context Window. The AI reads it and generates the perfect answer.",
                    "audioTextHinglish": "RAG teen steps mein kaam karta hai. Pehla, aapke private documents ko chote hisso mein baat kar database mein store kiya jata hai. Dusra, jab aap sawaal puchte hain, toh system sabse relevant paragraphs dhundta hai. Teesra, wo un paragraphs ko AI ke Context Window mein daal deta hai. AI use padhkar sahi jawab deta hai.",
                    "keyInsight": "RAG retrieves facts from a database and pastes them into the Context Window.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Interactive RAG Simulator",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Let's see RAG in action! Below is a mini Knowledge Base containing private company data.</p><p>Try asking a question like <em>\"What is the refund policy?\"</em> or <em>\"Who is the CEO?\"</em>.</p><p>Watch how the system <strong>Retrieves</strong> the correct document, <strong>Augments</strong> the prompt by pasting it into the Context Window, and <strong>Generates</strong> a factual answer without hallucinating.</p>",
                    "audioText": "Let's see RAG in action! Below is a mini Knowledge Base. Try asking a question like 'What is the refund policy?'. Watch how the system retrieves the correct document, pastes it into the Context Window, and generates a factual answer.",
                    "audioTextHinglish": "Chaliye RAG ko action mein dekhte hain! Niche ek mini Knowledge Base hai. Koi sawaal puchein jaise 'Refund policy kya hai?'. Dekhiye kaise system sahi document nikalta hai, use Context Window mein daalta hai, aur ek sahi jawab deta hai bina kuch banaye.",
                    "keyInsight": "By watching the Context Window, you can see exactly where the AI gets its knowledge.",
                    "widgetType": "RAGWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "2 Questions",
                    "narrative": "<p>Test your knowledge on RAG and Fine-Tuning.</p>",
                    "audioText": "Test your knowledge on RAG and Fine-Tuning.",
                    "audioTextHinglish": "RAG aur Fine-Tuning par apna knowledge test karein.",
                    "keyInsight": "Understanding the difference between RAG and Fine-Tuning is crucial.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What does RAG stand for?",
                                "options": ["Random Artificial Generation", "Retrieval-Augmented Generation", "Robotic Automated Guessing", "Recurrent AI Generation"],
                                "correct": 1
                            },
                            {
                                "q": "If you want an AI to memorize your 100-page company rulebook, which approach is best?",
                                "options": ["Fine-Tuning the model for 3 weeks", "Using RAG to retrieve the relevant rules when a question is asked", "Asking the AI to guess", "Deleting the AI's old memories"],
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
        print(f"Error seeding AI Masterclass Part 11: {e}")
        db.rollback()
    finally:
        db.close()
