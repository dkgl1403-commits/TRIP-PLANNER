import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part10():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "Prompts & In-Context Learning"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            # We are entering Arc 4, we might need to create the topic if it doesn't exist
            topic = LearningTopic(subject_id=ai_subject.id, name=topic_name)
            db.add(topic)
            db.commit()

        config = {
            "parts": [
                {
                    "title": "Welcome to Arc 4: The Modern Era",
                    "readingTime": "~1 min read",
                    "narrative": "<p>Congratulations! You have successfully built a trained Neural Network. It knows grammar, facts, and has been taught human values.</p><p>We are now in <strong>Arc 4: Generative AI</strong>. This is where we are today with tools like ChatGPT.</p><p>How do we actually talk to this massive mathematical \"Brain\"? The answer is <strong>Prompting</strong>.</p>",
                    "audioText": "Welcome to Arc 4. You have successfully built a trained Neural Network. Now, how do we talk to this massive mathematical brain? The answer is Prompting.",
                    "audioTextHinglish": "Arc 4 mein aapka swagat hai. Aapne ek trained Neural Network bana liya hai. Ab hum is bade mathematical brain se baat kaise karein? Iska jawab hai Prompting.",
                    "keyInsight": "A trained model is just a calculator. A prompt tells it what to calculate.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "A Prompt is Not a Search",
                    "readingTime": "~2 min read",
                    "narrative": "<p>When you use Google, you type a few keywords like <em>\"best restaurants near me\"</em>. Google searches a database and gives you links.</p><p>Generative AI does not search a database. When you type a prompt, you are setting the <strong>initial state</strong> of the mathematical equation. The AI then calculates the most mathematically probable words to follow your prompt.</p><p>Because of this, the more specific you are, the better the math works. If you give vague context, the AI will give a vague, generic calculation.</p>",
                    "audioText": "A prompt is not a Google search. You aren't searching a database. You are setting the initial state of a mathematical equation. The AI calculates the most probable words to follow. The more specific you are, the better the math works.",
                    "audioTextHinglish": "Ek prompt Google search nahi hai. Aap kisi database mein search nahi kar rahe. Aap ek mathematical equation ki shuruati state set kar rahe hain. AI uske aage aane wale sabse probable words calculate karta hai. Aap jitna specific honge, math utna acha kaam karega.",
                    "keyInsight": "Prompting is setting the initial variables for a giant equation to auto-complete.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "In-Context Learning (Few-Shot)",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>What if you want the AI to do a completely new task, like translate English to Pirate? You don't need to re-train the model! This is called <strong>In-Context Learning</strong>.</p><p>The AI has a short-term memory called a <strong>Context Window</strong>. If you provide a few examples of English-to-Pirate translation *inside* your prompt, the AI will mathematically lock onto the pattern and perfectly translate the next sentence.</p><p>Try the <strong>Few-Shot Prompting</strong> simulator below to see how giving examples changes the output!</p>",
                    "audioText": "What if you want the AI to learn a new task, like talking like a pirate? You don't need to re-train it. You can use In-Context Learning. By giving it a few examples in your prompt, it locks onto the pattern. Try the simulator below to see how this works!",
                    "audioTextHinglish": "Agar aap AI ko koi naya task sikhana chahte hain, jaise pirate ki tarah baat karna? Aapko ise dubara train nahi karna padega. Aap In-Context Learning ka use kar sakte hain. Apne prompt mein kuch examples dekar, AI pattern samajh jata hai. Ise try karne ke liye niche diya gaya simulator use karein!",
                    "keyInsight": "You can teach AI new skills instantly by providing examples in the Context Window.",
                    "widgetType": "PromptingWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "2 Questions",
                    "narrative": "<p>Test your knowledge on Prompting and Context Windows.</p>",
                    "audioText": "Test your knowledge on Prompting and Context Windows.",
                    "audioTextHinglish": "Prompting aur Context Windows par apna knowledge test karein.",
                    "keyInsight": "Prompt engineering is a critical skill for working with modern AI.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What happens when you send a prompt to Generative AI?",
                                "options": ["It searches the internet for the answer", "It sets the initial variables for a massive mathematical equation to calculate the next words", "It queries a database of pre-written answers", "It asks a human for help"],
                                "correct": 1
                            },
                            {
                                "q": "What is In-Context Learning (Few-Shot Prompting)?",
                                "options": ["Retraining the AI for 5 months on a new language", "Teaching the AI a new pattern instantly by providing examples in the prompt's context window", "Deleting old memories to make room for new ones", "When the AI takes a screenshot of the user's computer"],
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
        print(f"Error seeding AI Masterclass Part 10: {e}")
        db.rollback()
    finally:
        db.close()
