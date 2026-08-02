import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_taxonomy():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "The Taxonomy of Intelligence"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            topic = LearningTopic(subject_id=ai_subject.id, name=topic_name)
            db.add(topic)
            db.commit()

        config = {
            "parts": [
                {
                    "title": "The Umbrella of AI",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Before we dive into how AI works, we need to agree on what \"AI\" actually means.</p><p><strong>Artificial Intelligence (AI)</strong> is the massive umbrella term for any computer program that does something smart. A chess bot from 1990 is AI. The ghosts in Pac-Man are AI. Even your car's cruise control is technically AI.</p><p>But the ghosts in Pac-Man didn't <em>learn</em> how to chase you; a human programmer hard-coded their rules (e.g., `if PacMan goes left, go left`). This is called <strong>Symbolic AI</strong> or Good Old-Fashioned AI.</p>",
                    "audioText": "Artificial Intelligence is a massive umbrella term for any computer program that does something smart, like a chess bot or Pac-Man ghosts. But older AI didn't learn; human programmers hard-coded their rules.",
                    "audioTextHinglish": "Artificial Intelligence ek bohot bada umbrella term hai kisi bhi smart computer program ke liye. Jaise Pac-Man ke bhoot. Par purane AI seekhte nahi the, unke rules insaan code karte the.",
                    "keyInsight": "Artificial Intelligence is just the broad concept of machines acting smart. It doesn't mean they can learn.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Machine Learning (ML)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>In the 1990s, programmers realized they couldn't hard-code rules for everything. You can't write an `if/then` rule to recognize a cat in a photo.</p><p>Enter <strong>Machine Learning (ML)</strong>. ML is a sub-field of AI where we stop giving the computer rules, and instead give it <em>data</em>. We show it 10,000 photos of cats, and it mathematically figures out the pattern itself.</p><p>Every time Netflix recommends a movie, or your email filters out spam, you are interacting with Machine Learning.</p>",
                    "audioText": "Machine Learning is a sub-field of AI where we stop giving the computer hard-coded rules and instead give it data. It mathematically figures out the patterns itself, like how Netflix recommends movies.",
                    "audioTextHinglish": "Machine Learning AI ka sub-field hai jahan hum computer ko rules nahi, data dete hain. Wo khud patterns samajhta hai, jaise Netflix aapko movies recommend karta hai.",
                    "keyInsight": "Machine Learning is when computers figure out the rules themselves by looking at data.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Deep Learning (DL)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>As we fed more data into ML algorithms, they eventually hit a ceiling and stopped getting smarter. To fix this, we created a sub-field of ML called <strong>Deep Learning (DL)</strong>.</p><p>Deep Learning uses Artificial Neural Networks—code inspired by the structure of the human brain. These networks are \"deep\" because they have many layers. Deep Learning powers self-driving cars, facial recognition, and is the absolute core of the modern AI revolution.</p>",
                    "audioText": "To make ML even smarter, we created Deep Learning, which uses Artificial Neural Networks inspired by the human brain. This powers self-driving cars and the modern AI revolution.",
                    "audioTextHinglish": "ML ko aur smart banane ke liye Deep Learning banaya gaya. Isme Artificial Neural Networks hote hain jo insaani dimaag se inspired hain. Ye modern AI revolution ka core hai.",
                    "keyInsight": "Deep Learning is a subset of ML that uses neural networks to process massive amounts of data.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Natural Language Processing (NLP)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>While some Deep Learning models are built to look at images (Computer Vision), others are built specifically to understand human language. This sub-field is called <strong>Natural Language Processing (NLP)</strong>.</p><p>For years, NLP models were small and could only do basic tasks like translating French to English or deciding if a movie review was positive or negative. They didn't truly \"understand\" the world; they just mapped words to other words.</p>",
                    "audioText": "Natural Language Processing, or NLP, is a sub-field of AI focused entirely on understanding human language, like translating languages or reading movie reviews.",
                    "audioTextHinglish": "NLP yani Natural Language Processing, AI ka wo sub-field hai jo sirf insaani bhasha ko samajhne par focus karta hai. Jaise translation ya movie reviews padhna.",
                    "keyInsight": "NLP is the specific branch of AI dedicated to text and speech.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Large Language Models (LLMs)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Eventually, researchers took an NLP model and made it unimaginably huge. They trained it on the <em>entire internet</em> using thousands of GPUs. This created the <strong>Large Language Model (LLM)</strong>.</p><p>Because an LLM has read billions of pages of human text, it didn't just learn grammar—it learned reasoning, coding, history, and science. LLMs (like GPT-4 and Claude) sit at the absolute center of the AI taxonomy. They are Deep Learning models, focused on NLP, that are so massive they appear to actually \"think\".</p>",
                    "audioText": "When researchers took an NLP model and made it unimaginably huge by training it on the entire internet, they created the Large Language Model, or LLM. Models like ChatGPT.",
                    "audioTextHinglish": "Jab NLP model ko bohot bada banakar poore internet par train kiya gaya, tab bana Large Language Model yani LLM. Jaise ChatGPT.",
                    "keyInsight": "An LLM is just a massive NLP Deep Learning model that has read the entire internet.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The AI Family Tree",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Explore the interactive Venn diagram below to understand exactly how Artificial Intelligence, Machine Learning, Deep Learning, and Generative AI fit together like Russian nesting dolls.</p>",
                    "audioText": "Explore the interactive diagram below to understand exactly how Artificial Intelligence, Machine Learning, and Deep Learning fit together like Russian nesting dolls.",
                    "audioTextHinglish": "Neeche diye gaye diagram ko explore karein taaki aap samajh sakein ki AI, ML, aur Deep Learning aapas me kaise jude hain.",
                    "keyInsight": "Modern LLMs like ChatGPT sit at the very center of the nesting doll—they are Deep Learning models focused on language.",
                    "widgetType": "TaxonomyWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "2 Questions",
                    "narrative": "<p>Test your knowledge on the taxonomy of AI.</p>",
                    "audioText": "Test your knowledge on the taxonomy of AI.",
                    "audioTextHinglish": "AI ki taxonomy par apna knowledge test karein.",
                    "keyInsight": "Understanding these terms helps you separate real engineering from marketing buzzwords.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What is the key difference between classic AI and Machine Learning (ML)?",
                                "options": ["Classic AI uses the internet, ML does not", "Classic AI relies on human-coded rules, ML learns rules from data", "There is no difference", "ML is only for images"],
                                "correct": 1
                            },
                            {
                                "q": "Where does Deep Learning fit in the taxonomy?",
                                "options": ["It is a sub-field of Machine Learning that uses neural networks", "It is older than AI", "It is only used for text generation", "It is the umbrella term for all smart programs"],
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
        print(f"Error seeding AI Taxonomy: {e}")
        db.rollback()
    finally:
        db.close()
