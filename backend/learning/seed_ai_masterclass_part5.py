import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part5():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "Calculus & Gradient Descent"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

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
                    "title": "Analogy: The Cake Factory",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Imagine a factory assembly line with three stations (our nested functions): The <strong>Mixer</strong> passes batter to the <strong>Oven</strong>, which passes the baked cake to the <strong>Decorator</strong>. If the final cake tastes terrible (High Error), who is to blame?</p><p>Before 1986, the AI couldn't figure it out. The Decorator blamed the Oven, and the Oven blamed the Mixer.</p><p>The Chain Rule solves this by working backwards. It calculates the Decorator's exact blame (the frosting was fine). Then it multiplies that backward to find the Oven's blame (it overbaked by 10%). Then it multiplies <em>that</em> backward to find the Mixer's blame (not enough milk).</p><p>Because the layers are nested, you must pass the error backwards through the chain to find the root cause. This is why the algorithm is called <strong>Backward Propagation of Errors</strong>!</p>",
                    "audioText": "Imagine a cake factory where a Mixer feeds an Oven, which feeds a Decorator. If the final cake is terrible, who do you blame? The Chain Rule works backward: it checks the Decorator, then passes the blame back to the Oven, then back to the Mixer. This is exactly how Backpropagation works in an AI.",
                    "audioTextHinglish": "Sochiye ek cake factory jahan Mixer se Oven, aur Oven se Decorator tak cake banta hai. Agar cake kharab bane, toh kiski galati hai? Chain rule backward kaam karta hai: pehle Decorator, phir Oven, aur end mein Mixer ki galati nikalta hai. Backpropagation AI mein bilkul aise hi kaam karta hai.",
                    "keyInsight": "Because functions are nested, blame must be calculated backwards through the chain.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Mountain of Error",
                    "readingTime": "~2 min read",
                    "narrative": "<p>We know that an AI is a massive mathematical formula filled with millions of \"Weights\" (like volume knobs). When an AI is born, these knobs are completely random. When it tries to predict something, it gets it horribly wrong.</p><p>This \"wrongness\" is mathematically calculated into a single number called the <strong>Loss</strong> (or Error). Imagine the Loss as a physical mountain. The higher up the mountain you are, the worse the AI is performing. The goal of training an AI is to get to the very bottom of the valley where the Loss is exactly zero.</p><p>But the AI is blindfolded. It doesn't know where the bottom of the valley is. It only knows where it is right now. How does it find the bottom? It uses <strong>Calculus</strong>.</p>",
                    "audioText": "When an AI is first created, its weights are random, so it gets everything wrong. This wrongness is called the Loss. Imagine the Loss as a mountain. The higher you are, the more wrong you are. The AI's goal is to reach the bottom of the valley where the Loss is zero. But the AI is blindfolded. It uses Calculus to find the way down.",
                    "audioTextHinglish": "Jab AI naya hota hai, uske weights random hote hain, isliye woh sab galat predict karta hai. Is galati ko Loss kehte hain. Loss ko ek pahad (mountain) ki tarah sochiye. Jitna upar, utni zyada galati. AI ka goal hai valley ke bottom tak pahunchna jahan Loss zero ho. Par AI blindfolded hai. Woh neeche aane ka raasta Calculus ki madad se dhoondhta hai.",
                    "keyInsight": "Training an AI is just a search for the lowest possible error in a mathematical landscape.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Gradient Descent (The Blind Skier)",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>To get down the mountain, the AI uses Calculus (specifically, <em>derivatives</em>). A derivative calculates the <strong>slope</strong> or steepness of the mountain under the AI's current feet. It tells the AI: \"If you step in <em>this</em> direction, the mountain goes down.\"</p><p>The AI then takes a step in that downward direction. This process is called <strong>Gradient Descent</strong>.</p><p>The size of the step the AI takes is called the <strong>Learning Rate</strong>. <br/>- If the Learning Rate is too small, the AI takes tiny steps and it will take a million years to train.<br/>- If the Learning Rate is too large, the AI leaps across the mountain, missing the valley entirely and bouncing out of control.</p><p>Try training your own AI using the Blind Skier simulation below!</p>",
                    "audioText": "To get down the mountain, the AI calculates the derivative, which is the slope under its feet. It then takes a step downward. This is called Gradient Descent. The size of the step is the Learning Rate. If it's too small, training takes forever. If it's too large, the AI bounces out of control. Try the simulation below.",
                    "audioTextHinglish": "Pahad se neeche aane ke liye, AI derivative calculate karta hai, jo ki slope hota hai. Phir woh neeche ki taraf ek step leta hai. Ise Gradient Descent kehte hain. Step ka size Learning Rate hota hai. Agar yeh bahut chota hai, toh training mein saalo lag jayenge. Agar bahut bada hai, toh AI control ke bahar uchhal jayega. Niche simulation try karein.",
                    "keyInsight": "Calculus acts as gravity, guiding the AI toward the correct answer.",
                    "widgetType": "BlindSkierWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Architect's Vault: Calculus Examples",
                    "readingTime": "Practice",
                    "narrative": "<p>Let's look at exactly how the math works when an AI takes a step down the mountain.</p>",
                    "audioText": "Let's look at exactly how the math works when an AI takes a step down the mountain.",
                    "audioTextHinglish": "Chaliye dekhte hain ki jab AI pahad se neeche step leta hai toh math actually kaise kaam karta hai.",
                    "keyInsight": "Derivatives give us the direction, and the Learning Rate gives us the distance.",
                    "widgetType": "BoardSolvedExamples",
                    "widgetData": {
                        "examples": [
                            {
                                "year": "Derivatives",
                                "q": "If the Error curve is y = x² and our current weight x = 3, how do we know which way to step?",
                                "steps": [
                                    "In Calculus, the 'derivative' tells us the slope of a curve. The derivative of y = x² is exactly y' = 2x.",
                                    "We plug in our current position: y' = 2(3) = 6.",
                                    "The slope is positive (+6), which means the mountain is going UP if we move to the right.",
                                    "Because we want to go DOWN the mountain to minimize error, we must move in the opposite direction (to the left, subtracting from x)."
                                ]
                            },
                            {
                                "year": "Learning Rate",
                                "q": "With a slope of +6 and a learning rate of 0.1, what is the AI's new weight?",
                                "steps": [
                                    "The Gradient Descent formula is: New Weight = Old Weight - (Learning Rate × Slope).",
                                    "We plug in our numbers: New Weight = 3 - (0.1 × 6).",
                                    "New Weight = 3 - 0.6 = 2.4.",
                                    "The AI has successfully updated its weight from x = 3 to x = 2.4, bringing it closer to the perfect answer at the bottom of the valley (x = 0)!"
                                ]
                            },
                            {
                                "year": "Backpropagation",
                                "q": "A neural network isn't a simple curve; it's billions of interconnected equations. How does calculus handle that?",
                                "steps": [
                                    "Calculus uses the 'Chain Rule', which allows us to find the derivative of equations nested inside other equations.",
                                    "In AI, this process is called Backpropagation.",
                                    "The AI calculates the error at the final output, and then uses the Chain Rule to pass that error backward through every layer of the network.",
                                    "This calculates the exact slope for every single one of the billions of weights simultaneously."
                                ]
                            }
                        ]
                    }
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "4 Questions",
                    "narrative": "<p>Test your knowledge of Calculus and Gradient Descent in AI.</p>",
                    "audioText": "Test your knowledge of Calculus and Gradient Descent in AI.",
                    "audioTextHinglish": "AI mein Calculus aur Gradient Descent ke baare mein apna knowledge test karein.",
                    "keyInsight": "Calculus is the engine of learning.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What does the 'Loss' (or Error) represent in AI training?",
                                "options": ["The physical weight of the server", "How 'wrong' the AI's current predictions are", "The financial cost of electricity", "The number of words the AI has forgotten"],
                                "correct": 1
                            },
                            {
                                "q": "What was the 'Credit Assignment Problem' that caused the Second AI Winter?",
                                "options": ["Scientists couldn't secure financial credit to buy computers", "Nobody knew how to determine which internal weights were to blame for an AI's error", "The computers were too slow to process algebra", "AI models refused to take credit for their correct answers"],
                                "correct": 1
                            },
                            {
                                "q": "What mathematical concept from Calculus is the foundation of Backpropagation?",
                                "options": ["The Pythagorean Theorem", "The Chain Rule", "The Quadratic Formula", "Linear Regression"],
                                "correct": 1
                            },
                            {
                                "q": "What branch of mathematics is used to calculate the 'slope' of the error mountain?",
                                "options": ["Linear Algebra", "Geometry", "Calculus (Derivatives)", "Trigonometry"],
                                "correct": 2
                            },
                            {
                                "q": "What is 'Gradient Descent'?",
                                "options": ["The algorithm used to step downward towards the lowest error", "A type of cooling system for GPUs", "A method for increasing the error rate", "The process of a server crashing"],
                                "correct": 0
                            },
                            {
                                "q": "What happens if the 'Learning Rate' is set too high?",
                                "options": ["The AI learns perfectly in one step", "The AI takes forever to learn anything", "The AI leaps too far, overshooting the minimum error and bouncing out of control", "The computer's memory overflows"],
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
        print(f"Error seeding AI Masterclass Part 5: {e}")
        db.rollback()
    finally:
        db.close()
