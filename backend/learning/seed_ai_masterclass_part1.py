import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part1():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=99, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "The Dream of the Thinking Machine"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "Can Machines Think?",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In 1950, a British mathematician named <strong>Alan Turing</strong> asked a simple but dangerous question: <em>\"Can machines think?\"</em></p><p>Because \"thinking\" is hard to define, Turing proposed a game called <strong>The Imitation Game</strong> (now known as the Turing Test). In this game, a human judge talks to two entities via a text terminal: one is a human, and the other is a computer. If the judge cannot tell which is the machine, the machine is said to have exhibited intelligent behavior.</p><p>Six years later, in the summer of 1956, a group of scientists gathered at the <strong>Dartmouth Workshop</strong>. It was here that a young researcher named John McCarthy officially coined the term <em>\"Artificial Intelligence.\"</em> They believed that every aspect of learning could be so precisely described that a machine can be made to simulate it.</p>",
                    "audioText": "In 1950, Alan Turing asked a simple but dangerous question: Can machines think? He proposed the Imitation Game, now known as the Turing Test. If a human judge cannot tell if they are talking to a machine or a human, the machine has exhibited intelligent behavior. Six years later, at the 1956 Dartmouth Workshop, John McCarthy officially coined the term Artificial Intelligence.",
                    "audioTextHinglish": "1950 mein Alan Turing ne poocha: Kya machines soch sakti hain? Unhone Imitation Game propose kiya, jise ab Turing Test kehte hain. Agar ek human judge yeh na bata paye ki woh machine se baat kar raha hai ya insaan se, toh machine ko intelligent maana jayega. 1956 mein Dartmouth Workshop mein, John McCarthy ne 'Artificial Intelligence' term coin kiya.",
                    "keyInsight": "AI didn't start with code; it started with philosophy. What does it actually mean to 'think'?",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The First Artificial Brain",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>While Turing was philosophizing, a psychologist named <strong>Frank Rosenblatt</strong> was building. In 1958, he invented the <strong>Perceptron</strong>.</p><p>He didn't try to program rules. Instead, he tried to mimic a biological brain cell (a neuron). He wired up light sensors to motors. The machine would look at a shape, multiply the light intensity by certain \"weights\", add them up, and if the total crossed a threshold, it would fire a signal: <em>\"Yes, this is a square!\"</em></p><p>Try wiring up your own Perceptron below. Adjust the weights (importance of each sensor) to make the neuron \"fire\" only when it sees a specific pattern!</p>",
                    "audioText": "While Turing was philosophizing, Frank Rosenblatt was building. In 1958, he invented the Perceptron. He didn't program rules; he mimicked a biological brain cell. He wired sensors to weights. If the total sum crossed a threshold, the neuron fired. Try wiring up your own Perceptron below.",
                    "audioTextHinglish": "Jab Turing philosophy soch rahe the, Frank Rosenblatt ne 1958 mein pehla Perceptron banaya. Unhone rules program nahi kiye, balki biological brain cell ko mimic kiya. Agar total sum ek threshold cross karta hai, toh neuron fire karta hai. Niche apna Perceptron wire up karke dekhein.",
                    "keyInsight": "The Perceptron was the very first attempt to build a machine that learns from data rather than explicit instructions.",
                    "widgetType": "FirstNeuronWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Math of a Neuron",
                    "readingTime": "~3 min read",
                    "narrative": "<p>How does a neuron make a decision? It uses a simple mathematical equation: the <strong>Linear Weighted Sum</strong>.</p><h3>The Equation:</h3><p class='text-xl text-center bg-black/40 py-4 my-2 border border-white/10 rounded-lg text-neon-blue'>y = (w\u2081 \u00d7 x\u2081) + (w\u2082 \u00d7 x\u2082) + b</p><p><strong>x\u2081, x\u2082:</strong> The Inputs (e.g., Is it red? Is it round?)<br/><strong>w\u2081, w\u2082:</strong> The Weights (How important is that input?)<br/><strong>b:</strong> The Bias (A baseline push to help the neuron fire)<br/><strong>y:</strong> The Output Sum.</p><p>After calculating the sum <em>y</em>, the neuron passes it through an <strong>Activation Function</strong> (like a step function). If <em>y > 0</em>, it fires (outputs 1). If <em>y &le; 0</em>, it stays silent (outputs 0).</p>",
                    "audioText": "How does a neuron make a decision? It uses a simple equation: y equals weight 1 times input 1, plus weight 2 times input 2, plus a bias. The inputs are what it sees. The weights are how important those inputs are. If the final sum is greater than zero, the neuron fires. This is the foundation of all modern AI.",
                    "audioTextHinglish": "Ek neuron decision kaise leta hai? Woh ek simple equation use karta hai: Inputs ko unke weights se multiply karke bias ke sath add karna. Agar sum zero se bada hai, toh neuron fire karta hai. Yahi sab modern AI ka foundation hai.",
                    "keyInsight": "Every complex AI today is just billions of these simple linear equations stacked on top of each other.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Architect's Vault: Solved Examples",
                    "readingTime": "Practice",
                    "narrative": "<p>Let's manually calculate the output of early neural networks. By doing this by hand, you strip away the magic and see the pure mechanics of AI.</p>",
                    "audioText": "Let's manually calculate the output of early neural networks. By doing this by hand, you strip away the magic and see the pure mechanics of AI.",
                    "audioTextHinglish": "Chaliye early neural networks ke output ko manually calculate karte hain, taki aapko AI ki pure mechanics samajh aaye.",
                    "keyInsight": "AI isn't magic. It's just arithmetic.",
                    "widgetType": "BoardSolvedExamples",
                    "widgetData": {
                        "examples": [
                            {
                                "year": "Concept",
                                "q": "A perceptron has inputs x1=1, x2=0. The weights are w1=0.5, w2=-0.5. The bias is b=0. Calculate the weighted sum 'y'.",
                                "steps": [
                                    "Formula: y = (w1 \u00d7 x1) + (w2 \u00d7 x2) + b",
                                    "Substitute values: y = (0.5 \u00d7 1) + (-0.5 \u00d7 0) + 0",
                                    "y = 0.5 + 0 + 0",
                                    "y = 0.5"
                                ]
                            },
                            {
                                "year": "Concept",
                                "q": "Following the previous example (y=0.5), if the activation function is a Step Function (outputs 1 if y>0, else 0), does the neuron fire?",
                                "steps": [
                                    "The weighted sum y = 0.5.",
                                    "Check condition: Is y > 0?",
                                    "Yes, 0.5 > 0.",
                                    "Therefore, the neuron fires (outputs 1)."
                                ]
                            },
                            {
                                "year": "Application",
                                "q": "You are building a spam filter perceptron. x1 = contains 'FREE' (1 or 0). x2 = from unknown sender (1 or 0). w1 = 3, w2 = 2. Bias b = -4. If an email has 'FREE' and is from an unknown sender, is it spam?",
                                "steps": [
                                    "Since it contains 'FREE', x1 = 1.",
                                    "Since it's from an unknown sender, x2 = 1.",
                                    "Calculate y = (3 \u00d7 1) + (2 \u00d7 1) + (-4)",
                                    "y = 3 + 2 - 4 = 1",
                                    "Since y > 0 (1 > 0), the neuron fires.",
                                    "Yes, the email is classified as SPAM."
                                ]
                            },
                            {
                                "year": "Application",
                                "q": "Using the same spam filter (w1=3, w2=2, b=-4), what happens if the email is from a known sender but contains the word 'FREE'?",
                                "steps": [
                                    "Contains 'FREE', so x1 = 1.",
                                    "From known sender (not unknown), so x2 = 0.",
                                    "Calculate y = (3 \u00d7 1) + (2 \u00d7 0) - 4",
                                    "y = 3 + 0 - 4 = -1",
                                    "Since y \u2264 0 (-1 is not greater than 0), the neuron does not fire.",
                                    "The email is NOT classified as spam."
                                ]
                            },
                            {
                                "year": "Analysis",
                                "q": "Why is the Bias 'b' important in a perceptron?",
                                "steps": [
                                    "Without bias, if all inputs are 0, the sum is always 0.",
                                    "This means the neuron could never fire if inputs are 0, regardless of the weights.",
                                    "Bias shifts the activation threshold. It allows the neuron to fire (or stay silent) even when inputs are 0.",
                                    "It acts as the neuron's 'base tendency' or 'stubbornness' to fire."
                                ]
                            }
                        ]
                    }
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "5 Questions",
                    "narrative": "<p>Test your knowledge of the genesis of Artificial Intelligence.</p>",
                    "audioText": "Test your knowledge of the genesis of Artificial Intelligence.",
                    "audioTextHinglish": "AI ke genesis ke baare mein apna knowledge test karein.",
                    "keyInsight": "Knowing history prevents us from repeating past failures.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "Who proposed the 'Imitation Game' to test if a machine can think?",
                                "options": ["John McCarthy", "Alan Turing", "Frank Rosenblatt", "Albert Einstein"],
                                "correct": 1
                            },
                            {
                                "q": "At which event was the term 'Artificial Intelligence' officially coined?",
                                "options": ["The Turing Conference", "The Bletchley Park Summit", "The Dartmouth Workshop", "The MIT AI Lab Opening"],
                                "correct": 2
                            },
                            {
                                "q": "What was the 'Perceptron' invented by Frank Rosenblatt in 1958?",
                                "options": ["The first supercomputer", "The first artificial neuron", "A robot that could walk", "A chess-playing program"],
                                "correct": 1
                            },
                            {
                                "q": "In a perceptron, what does a 'weight' represent?",
                                "options": ["The physical mass of the hardware", "The baseline tendency to fire", "The importance of a specific input", "The final output signal"],
                                "correct": 2
                            },
                            {
                                "q": "If a perceptron has inputs [1, 1], weights [2, -1], and a bias of -2, what is the weighted sum (y)?",
                                "options": ["-1", "0", "1", "3"],
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
        print(f"Error seeding AI Masterclass Part 1: {e}")
        db.rollback()
    finally:
        db.close()
