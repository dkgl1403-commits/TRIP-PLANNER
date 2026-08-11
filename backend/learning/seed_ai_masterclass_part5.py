import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part5():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=99, name="Masterclass").first()
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
                    "title": "The Objective Function: The Scorecard of Wrongness",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Before an AI can learn, it needs a target. Every AI model is built around an <strong>Objective Function</strong> — also called a <em>Loss Function</em> or <em>Cost Function</em>. This is a mathematical formula with one job: measure how wrong the AI currently is.</p><p>The logic is elegant: if we can turn 'wrongness' into a number, we can use math to shrink that number over time. A high Loss means the AI is terrible. A Loss of zero means the AI is perfect. <strong>Training an AI is nothing more than a search for the parameters that produce the lowest possible Loss.</strong></p><p>We know that an AI is a massive mathematical formula filled with millions of <strong>Weights</strong> (think of them as volume knobs). When an AI is born, these knobs are completely random. When it tries to predict something, it gets it horribly wrong — the Loss is huge.</p><p>Imagine the Loss as a physical mountain landscape. The higher up the mountain you are, the worse the AI is performing. The bottom of the valley — where Loss = 0 — is where perfect predictions live. The AI is blindfolded in this landscape. It can't see the whole mountain. It only knows where it is standing right now. To find the bottom, it uses <strong>Calculus</strong>.</p>",
                    "audioText": "Every AI model has an Objective Function — also called a Loss Function. This formula measures exactly how wrong the AI currently is. Training an AI is simply a search for the parameters that minimize this loss. Imagine the Loss as a mountain. The higher you are, the more wrong you are. The AI's goal is to find the bottom of the valley where Loss equals zero. But the AI is blindfolded. It uses Calculus to navigate downward.",
                    "audioTextHinglish": "Har AI model mein ek Objective Function hota hai — ise Loss Function bhi kehte hain. Yeh formula batata hai ki AI abhi kitna galat hai. AI ko train karna bas ek mathematical search hai jo is loss ko minimize karne ki koshish karta hai. Loss ko ek pahad ki tarah sochiye — jitna upar, utni zyada galati. AI ka goal hai neeche valley mein pahunchna jahan Loss zero ho. AI blindfolded hai — woh neeche aane ke liye Calculus ka use karta hai.",
                    "keyInsight": "Every learning algorithm in AI is an optimization algorithm — it is always minimizing some form of a Loss Function. If you understand this, you understand the core engine of all of modern AI.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Gradient Descent (The Blind Skier)",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>To navigate down the mountain, the AI uses Calculus — specifically, <em>derivatives</em>. A derivative calculates the <strong>slope</strong> (steepness) of the mountain under the AI's current position. It answers the question: <em>\"Which direction is downhill right now?\"</em></p><p>The AI then takes a step in that downward direction. This process — calculate slope, take a step, repeat — is called <strong>Gradient Descent</strong>, and it is the single most important algorithm in all of machine learning.</p><p>Every major AI model from GPT-4 to Gemini to AlphaFold was trained using some variant of Gradient Descent. It is the engine that turns a random, useless set of weights into a model that can diagnose cancer, write poetry, and navigate a self-driving car.</p><p>Try training your own AI using the Blind Skier simulation below — watch how the error mountain shrinks with each step!</p>",
                    "audioText": "To navigate down the mountain, the AI calculates the derivative — the slope at its current position. It takes a step downward, then calculates the slope again, then takes another step. This process is called Gradient Descent and it is the single most important algorithm in all of machine learning. Every major AI model — GPT-4, Gemini, AlphaFold — was trained using some variant of it. Try the Blind Skier simulation below.",
                    "audioTextHinglish": "Pahad se neeche aane ke liye AI derivative calculate karta hai — apni current position par slope nikalta hai. Phir neeche ki taraf step leta hai, dobara slope calculate karta hai, phir step. Ise Gradient Descent kehte hain aur yeh machine learning ka sabse important algorithm hai. GPT-4, Gemini, AlphaFold — har bada AI model isi ka koi variant use karke train hua hai. Niche Blind Skier simulation try karein.",
                    "keyInsight": "Calculus acts as the AI's compass in the dark — it doesn't show the full mountain, but always points one step downhill.",
                    "widgetType": "BlindSkierWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Learning Rate: Too Fast, Too Slow, Just Right",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Gradient Descent tells the AI <em>which direction</em> to step. But it doesn't tell the AI <em>how far</em> to step. That is controlled by a separate setting called the <strong>Learning Rate</strong> — and it is one of the most critical decisions an AI engineer makes.</p><p>Think of it as the Goldilocks Problem:</p><ul><li><strong>Too High (Giant Leaps):</strong> If the Learning Rate is set too large, the AI takes enormous steps down the mountain. It leaps so far that it skips completely over the bottom of the valley, lands on the other side, and bounces back and forth forever, never converging. The Loss oscillates wildly. The model learns nothing.</li><li><strong>Too Low (Micro-Steps):</strong> If the Learning Rate is set too small, the AI takes tiny, cautious steps. It will eventually find the bottom — but it might take weeks or months of expensive GPU compute to get there. Worse, it might crawl into a shallow local valley (a local minimum) and get stuck, never finding the true global lowest point.</li><li><strong>Just Right:</strong> A well-tuned Learning Rate allows the AI to descend quickly at first, then slow down and make precise adjustments as it approaches the optimal solution.</li></ul><p><strong>Modern adaptive optimizers solve this automatically.</strong> Instead of a fixed Learning Rate, algorithms like <strong>Adam (Adaptive Moment Estimation)</strong> and <strong>RMSprop</strong> dynamically adjust the step size for every single weight in real time. Adam starts with larger steps and automatically shrinks them as it gets closer to the valley floor. It also tracks the momentum of recent steps to avoid getting stuck in local minima. This is why Adam has become the default optimizer for training virtually all modern large language models.</p>",
                    "audioText": "The Learning Rate controls how far the AI steps downhill with each iteration. Set too high, the AI leaps over the bottom and bounces forever. Set too low, training takes months and can get stuck in a shallow local minimum. Modern algorithms like Adam and RMSprop solve this by dynamically adjusting the step size in real time — starting with large steps and shrinking them as the model approaches the optimal solution. This is why Adam is the default optimizer for virtually all modern large language models.",
                    "audioTextHinglish": "Learning Rate control karta hai ki AI har iteration mein kitna neeche step leta hai. Zyada ho toh AI valley ke upar se kood jaata hai aur hamesha bounce karta rehta hai. Kam ho toh training mahino le sakti hai aur local minimum mein phans sakta hai. Adam aur RMSprop jaise modern algorithms real time mein step size dynamically adjust karte hain — bade steps se shuru karke optimal solution ke paas aate hi chote karte jaate hain. Isliye Adam virtually sab modern large language models ka default optimizer hai.",
                    "keyInsight": "The Learning Rate is arguably the most important hyperparameter in training an AI. Adam solves the Goldilocks problem automatically by adapting the step size per weight in real time.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Hyperparameter Tuning: Setting the Rules of the Game",
                    "readingTime": "~3 min read",
                    "narrative": "<p>When an AI is trained, it has two completely different types of numbers inside it:</p><ol><li><strong>Parameters</strong> (Weights & Biases): These are the millions or billions of numbers the AI learns <em>automatically</em> during training by adjusting them with Gradient Descent. Nobody touches these manually.</li><li><strong>Hyperparameters</strong>: These are the high-level settings that <em>control how the training process works</em>. They must be chosen by a human engineer <em>before</em> training begins. The AI cannot set these itself.</li></ol><p>Key hyperparameters include:</p><ul><li><strong>Learning Rate:</strong> How big are the steps? (e.g., 0.001)</li><li><strong>Batch Size:</strong> How many training examples does the AI see at once before updating its weights? (e.g., 32, 128, 512)</li><li><strong>Number of Layers:</strong> How deep is the neural network?</li><li><strong>Dropout Rate:</strong> What fraction of neurons are randomly switched off during training to prevent overfitting?</li><li><strong>Number of Epochs:</strong> How many times does the AI cycle through the entire training dataset?</li></ul><p>Finding the best combination of hyperparameters is called <strong>Hyperparameter Tuning</strong>, and it is part art, part science. Engineers use three main strategies:</p><ul><li><strong>Grid Search:</strong> Try every possible combination of settings in a structured grid. Exhaustive and slow, but guaranteed to find the best option within the grid.</li><li><strong>Random Search:</strong> Randomly sample combinations. Surprisingly effective and much faster than Grid Search for high-dimensional problems.</li><li><strong>Bayesian Optimization:</strong> The smartest approach. The system builds a probability model of which hyperparameter settings are likely to perform best, based on the results of past experiments. It focuses its compute budget on the most promising regions of the hyperparameter space, making it far more efficient than random or grid approaches.</li></ul><p>Training GPT-4 required not just running Gradient Descent, but days of hyperparameter search across hundreds of candidate configurations before the final training run even began.</p>",
                    "audioText": "An AI has two types of numbers: Parameters, which are learned automatically by Gradient Descent, and Hyperparameters, which are set by a human engineer before training begins. Key hyperparameters include the Learning Rate, Batch Size, number of layers, dropout rate, and number of epochs. Finding the best combination is called Hyperparameter Tuning. Engineers use Grid Search, Random Search, or Bayesian Optimization to find the optimal configuration. Even GPT-4 required extensive hyperparameter search before the main training run could start.",
                    "audioTextHinglish": "AI mein do tarah ke numbers hote hain: Parameters jo Gradient Descent automatically sikhta hai, aur Hyperparameters jo ek human engineer training shuru hone se pehle set karta hai. Main hyperparameters mein Learning Rate, Batch Size, layers ki sankhya, dropout rate, aur epochs shamil hain. Sabse acchi combination dhundhna Hyperparameter Tuning kehlata hai. Engineers Grid Search, Random Search, ya Bayesian Optimization ka use karte hain. GPT-4 ko bhi main training shuru hone se pehle extensive hyperparameter search ki zaroorat thi.",
                    "keyInsight": "The difference between a mediocre model and a state-of-the-art model is often not the architecture — it is the hyperparameter tuning. The right learning rate and batch size can be the difference between a model that works and one that doesn't.",
                    "widgetType": None,
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
                            },
                            {
                                "q": "What is the difference between a 'Parameter' and a 'Hyperparameter'?",
                                "options": ["There is no difference — they are the same thing", "Parameters are set by the engineer; hyperparameters are learned automatically", "Parameters (weights/biases) are learned by the AI; hyperparameters are set by the engineer before training", "Hyperparameters are only used in Deep Learning"],
                                "correct": 2
                            },
                            {
                                "q": "Which modern optimizer dynamically adjusts the learning rate for each weight in real time, making it the default choice for training LLMs?",
                                "options": ["Basic Gradient Descent", "Softmax", "Adam (Adaptive Moment Estimation)", "Grid Search"],
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
