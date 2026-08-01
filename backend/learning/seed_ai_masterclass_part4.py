import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part4():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "Linear Algebra & Vectors"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "Teaching Math to Read",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Computers do not understand language. They only understand numbers. So, if we want an AI to understand the word <em>\"Apple\"</em>, we have to turn that word into numbers.</p><p>In the early days, programmers tried assigning an ID to every word (e.g., Apple=1, Banana=2, Car=3). But this failed because the numbers had no mathematical relationship. The difference between Car (3) and Banana (2) is 1, which means nothing.</p><p>Instead, modern AI uses <strong>Vectors</strong> (also called Embeddings). A vector is simply a list of numbers representing a point in space. For example, we could represent an apple with two numbers: [Sweetness: 0.9, Hardness: 0.8]. A banana might be [Sweetness: 0.9, Hardness: 0.2]. Now, the AI can mathematically calculate that an apple and a banana are similar in sweetness, but different in hardness.</p>",
                    "audioText": "Computers only understand numbers, not words. So we must turn words into vectors, or lists of numbers. By assigning values for attributes like sweetness or hardness, an AI can mathematically calculate the difference between an apple and a banana.",
                    "audioTextHinglish": "Computers words nahi, sirf numbers samajhte hain. Isliye humein words ko vectors yaani numbers ki list mein badalna padta hai. Alag-alag attributes (jaise sweetness) ke values assign karke, AI apple aur banana ke beech ka difference mathematically calculate kar sakta hai.",
                    "keyInsight": "A word embedding (vector) captures the meaning of a word as a mathematical coordinate.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "What is Linear Algebra?",
                    "readingTime": "~2 min read",
                    "narrative": "<p>You now know what a <strong>Vector</strong> is (a list of numbers representing one concept). But what is <strong>Linear Algebra</strong>?</p><p>Linear Algebra is simply the branch of mathematics that deals with Vectors and <strong>Matrices</strong> (massive grids of numbers). If a Vector represents a single word, a Matrix can represent an entire sentence, or all the weights in a neural network layer.</p><p>Why is this used in AI? Because a neural network requires billions of calculations. If the computer calculated each number one by one (using standard algebra), generating one word would take weeks. <em>Linear Algebra</em> provides the mathematical rules to add, subtract, and multiply massive grids of numbers <strong>all at once</strong>. It is the language that allows GPUs to process data in parallel.</p>",
                    "audioText": "What is Linear Algebra? It is the branch of math that deals with vectors and matrices, which are massive grids of numbers. Instead of calculating numbers one by one, Linear Algebra provides the rules to multiply massive grids of numbers all at once. This is what allows GPUs to process AI models so incredibly fast.",
                    "audioTextHinglish": "Linear Algebra kya hai? Yeh math ki aisi branch hai jo vectors aur matrices, yaani massive grids of numbers, se deal karti hai. Numbers ko ek-ek karke calculate karne ke bajaye, Linear Algebra rules deta hai jisse massive grids ko ek saath multiply kiya ja sake. Isi wajah se GPUs AI models ko itna fast process kar paate hain.",
                    "keyInsight": "Linear Algebra is the mathematical engine that allows AI to calculate billions of probabilities simultaneously.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The High-Dimensional Galaxy",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In our fruit example, we used 2 dimensions (Sweetness and Hardness). But humans understand thousands of abstract concepts. To capture true meaning, a modern AI like GPT-4 uses over <strong>10,000 dimensions</strong> to represent a single word!</p><p>Imagine a 10,000-dimensional galaxy. Every word you know is a star in this galaxy. Words with similar meanings (like 'Dog' and 'Puppy') orbit very closely to each other. Words with unrelated meanings (like 'Dog' and 'Taxation') are galaxies apart.</p><p>Because words are now just coordinates, we can do <em>math with words</em>. The most famous example in AI history is:<br/><br/><strong>[King] - [Man] + [Woman] = [Queen]</strong></p><p>If you take the coordinate for King, subtract the 'maleness' vector, and add the 'femaleness' vector, you land exactly on the coordinate for Queen!</p>",
                    "audioText": "Modern AIs use over 10,000 dimensions to represent a single word. Words with similar meanings live close together in this massive mathematical space. Because they are just coordinates, we can do math with words. If you take the vector for King, subtract Man, and add Woman, you get Queen.",
                    "audioTextHinglish": "Modern AIs ek word ko represent karne ke liye 10,000 se zyada dimensions use karte hain. Is massive mathematical space mein similar words ek doosre ke paas hote hain. Kyunki words ab sirf coordinates hain, hum words ke saath math kar sakte hain. Jaise: King minus Man plus Woman equals Queen.",
                    "keyInsight": "Meaning is just geometry. The distance between words in vector space represents their semantic similarity.",
                    "widgetType": "VectorGalaxyWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Architect's Vault: Vector Math",
                    "readingTime": "Practice",
                    "narrative": "<p>Let's manually calculate vector distances and word math using a simplified 2-dimensional space.</p>",
                    "audioText": "Let's manually calculate vector distances and word math using a simplified 2-dimensional space.",
                    "audioTextHinglish": "Chaliye simplified 2D space mein vector distances aur word math manually calculate karte hain.",
                    "keyInsight": "Adding and subtracting meaning is just adding and subtracting coordinates.",
                    "widgetType": "BoardSolvedExamples",
                    "widgetData": {
                        "examples": [
                            {
                                "year": "Concept",
                                "q": "Word A is [1.0, 0.5] and Word B is [1.0, 0.4]. Are these words likely synonyms or antonyms?",
                                "steps": [
                                    "Compare the vectors: [1.0, 0.5] and [1.0, 0.4].",
                                    "The difference between the two points is very small (0.0 in the first dimension, 0.1 in the second).",
                                    "Because they are very close together in vector space, they have highly similar meanings.",
                                    "Therefore, they are likely synonyms."
                                ]
                            },
                            {
                                "year": "Application",
                                "q": "Calculate [Paris] - [France] + [Italy]. \nAssume the vectors are: \nParis = [0.9, 0.5]\nFrance = [0.8, 0.5]\nItaly = [0.8, 0.2]",
                                "steps": [
                                    "We are trying to find the capital of Italy by extracting the 'capital city' relationship.",
                                    "Step 1: [Paris] - [France] = [0.9 - 0.8, 0.5 - 0.5] = [0.1, 0.0]",
                                    "Step 2: Add [Italy] = [0.1, 0.0] + [0.8, 0.2] = [0.1 + 0.8, 0.0 + 0.2] = [0.9, 0.2]",
                                    "The resulting vector is [0.9, 0.2]. In a real AI, this coordinate would perfectly align with the word 'Rome'."
                                ]
                            },
                            {
                                "year": "Analysis",
                                "q": "If 'Hot' is [0.9, 0.1] and 'Cold' is [-0.9, -0.1], what happens if you add them together?",
                                "steps": [
                                    "Add the vectors: [0.9 + (-0.9), 0.1 + (-0.1)]",
                                    "The result is [0, 0].",
                                    "When you combine perfect opposites in semantic space, they cancel each other out, resulting in a neutral origin point (e.g., 'Lukewarm' or 'Temperature')."
                                ]
                            }
                        ]
                    }
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "4 Questions",
                    "narrative": "<p>Test your knowledge of Linear Algebra and Embeddings in AI.</p>",
                    "audioText": "Test your knowledge of Linear Algebra and Embeddings in AI.",
                    "audioTextHinglish": "AI mein Linear Algebra aur Embeddings ke baare mein apna knowledge test karein.",
                    "keyInsight": "Everything an AI knows is mapped out in high-dimensional vector space.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "Why don't we just assign simple integer IDs to words (e.g., Apple=1, Banana=2)?",
                                "options": ["Because computers cannot process integers", "Because the numbers have no mathematical relationship representing meaning", "Because there aren't enough integers for all words", "Because it uses too much memory"],
                                "correct": 1
                            },
                            {
                                "q": "What is an 'Embedding' in AI?",
                                "options": ["A microchip embedded in the motherboard", "A list of numbers (a vector) representing the meaning of a word", "A rule written in IF/THEN format", "A type of cooling system for GPUs"],
                                "correct": 1
                            },
                            {
                                "q": "What happens to words with similar meanings in a high-dimensional vector space?",
                                "options": ["They crash the system", "They are pushed far apart to avoid confusion", "They are placed very close to each other (clustered together)", "They are deleted to save space"],
                                "correct": 2
                            },
                            {
                                "q": "Why is Linear Algebra essential for Artificial Intelligence?",
                                "options": ["It allows the AI to calculate one number at a time accurately", "It provides the rules for GPUs to multiply massive grids of numbers (matrices) all at once", "It is the only math language that can be spoken out loud", "It is used to design the hardware chassis of the server"],
                                "correct": 1
                            },
                            {
                                "q": "What is the result of the famous vector equation: [King] - [Man] + [Woman]?",
                                "options": ["[Prince]", "[Queen]", "[Royalty]", "[Castle]"],
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
        print(f"Error seeding AI Masterclass Part 4: {e}")
        db.rollback()
    finally:
        db.close()
