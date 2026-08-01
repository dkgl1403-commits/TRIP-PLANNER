import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part7():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "The Neural Network"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "Welcome to Arc 3: The Architecture",
                    "readingTime": "~1 min read",
                    "narrative": "<p>Welcome to <strong>Arc 3: The Architecture</strong>.</p><p>In Arc 1, we learned the history and the hardware. In Arc 2, we learned the math (Calculus, Linear Algebra, Probability). Now, in Arc 3, we put it all together to build the actual \"Brain\" of the AI.</p><p>We will explore how billions of parameters are wired together to create Neural Networks and Transformers—the exact architecture that powers ChatGPT.</p>",
                    "audioText": "Welcome to Arc 3: The Architecture. We've learned the history, the hardware, and the math. Now, we put it all together to build the actual brain of the AI. We'll explore how neural networks and transformers are wired together to power systems like ChatGPT.",
                    "audioTextHinglish": "Arc 3 mein aapka swagat hai. Ab tak humne history, hardware, aur math padha. Ab hum in sabko milakar AI ka 'Brain' banayenge. Hum samjhenge ki Neural Networks aur Transformers kaise kaam karte hain aur ChatGPT jaisi systems kaise banti hain.",
                    "keyInsight": "We are now moving from theory to construction.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Artificial Neuron",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Before we can build a brain, we need a single brain cell. The story of the artificial neuron is a rollercoaster of triumphs and failures.</p><p>It started in 1943 when Warren McCulloch and Walter Pitts proposed the first mathematical model of a neuron. Then, in 1958, Frank Rosenblatt actually built it in hardware, calling it the <strong>Perceptron</strong>.</p><p><strong>What is an artificial neuron made of?</strong> It is astonishingly simple. It is just a tiny mathematical function that does three things:<br/>1. It takes inputs.<br/>2. It multiplies those inputs by 'Weights' (volume knobs) and adds a 'Bias'.<br/>3. It passes the final sum through an 'Activation Function'—a mathematical gatekeeper that decides if the neuron should 'fire' or stay silent.</p><p>For decades, a single artificial neuron couldn't do much. It couldn't even solve basic logic problems, which led directly to the First AI Winter. We only finally succeeded in making them powerful when we figured out how to stack millions of them together into \"Layers\", train them using Backpropagation in the 1980s, and accelerate them with GPUs in 2012.</p>",
                    "audioText": "Before building a brain, we need a single brain cell. The first artificial neuron, called the Perceptron, was built in 1958. It's just a tiny math function that multiplies inputs by weights and passes the result through an activation function. A single neuron couldn't do much on its own, which caused the First AI Winter. We only succeeded when we stacked millions of them together in layers.",
                    "audioTextHinglish": "Dimaag banane se pehle ek single cell ki zaroorat hoti hai. Pehla artificial neuron, jise Perceptron kehte hain, 1958 mein bana tha. Yeh ek chota sa math function hai jo inputs ko weights se multiply karta hai. Ek akela neuron zyada kuch nahi kar sakta tha, isliye First AI Winter aaya. Hum tabhi successful hue jab humne lakho neurons ko ek sath layers mein joda.",
                    "keyInsight": "An artificial neuron is just a tiny math function that decides whether to fire or not.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Anatomy of a Brain",
                    "readingTime": "~2 min read",
                    "narrative": "<p>A Neural Network is inspired by the human brain. It consists of layers of artificial neurons. There are three main types of layers:</p><ol><li><strong>The Input Layer:</strong> These are the \"eyes and ears\". They take in the raw data, like the pixels of an image or the words of a sentence.</li><li><strong>The Hidden Layers:</strong> This is the \"brain\". It is where all the deep thinking happens. Early hidden layers find basic patterns (like edges). Later hidden layers combine those patterns into complex concepts (like faces).</li><li><strong>The Output Layer:</strong> This is the \"mouth\". It takes the final calculations and outputs the Logits, which are then passed through Softmax to give the final prediction.</li></ol>",
                    "audioText": "A Neural Network has three main types of layers. The Input Layer acts as the eyes, taking in raw data. The Hidden Layers act as the brain, doing all the deep thinking and pattern recognition. Finally, the Output Layer acts as the mouth, giving the final prediction.",
                    "audioTextHinglish": "Neural Network mein teen main layers hoti hain. Input Layer aankhon ki tarah kaam karti hai, jo data leti hai. Hidden Layers dimaag ki tarah deep thinking aur pattern dhundhne ka kaam karti hain. Aur Output Layer munh (mouth) ki tarah final prediction batati hai.",
                    "keyInsight": "A neural network is just layers of mathematical functions passing information forward.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "See It In Action",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Let's watch a Neural Network \"think\" in slow motion.</p><p>When you click \"Feed Input\" below, watch how the data travels from the Input Layer, through the Hidden Layers, and finally into the Output Layer to produce a prediction.</p>",
                    "audioText": "Let's watch a Neural Network think in slow motion. Click 'Feed Input' below to watch how data travels from the Input Layer, through the Hidden Layers, and into the Output Layer to make a prediction.",
                    "audioTextHinglish": "Chaliye ek Neural Network ko slow motion mein sochte hue dekhte hain. Niche 'Feed Input' par click karein aur dekhein kaise data Input Layer se Hidden Layers hote hue Output Layer tak pahunch kar prediction karta hai.",
                    "keyInsight": "Information flows sequentially from input to output, layer by layer.",
                    "widgetType": "NeuralNetworkWidget",
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "3 Questions",
                    "narrative": "<p>Test your understanding of the Neural Network architecture.</p>",
                    "audioText": "Test your understanding of the Neural Network architecture.",
                    "audioTextHinglish": "Neural Network ki architecture par apna knowledge test karein.",
                    "keyInsight": "Layers define the depth and capability of the network.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "When was the first artificial neuron (the Perceptron) built in hardware?",
                                "options": ["1943", "1958", "1986", "2012"],
                                "correct": 1
                            },
                            {
                                "q": "Which layer of the Neural Network acts as its 'eyes', receiving the raw data?",
                                "options": ["The Hidden Layer", "The Output Layer", "The Input Layer", "The Softmax Layer"],
                                "correct": 2
                            },
                            {
                                "q": "Where does the 'deep thinking' and complex pattern recognition occur in a Neural Network?",
                                "options": ["The Input Layer", "The Hidden Layers", "The Output Layer", "The Network Cable"],
                                "correct": 1
                            },
                            {
                                "q": "What happens in the early Hidden Layers versus the later Hidden Layers?",
                                "options": ["Early layers find complex concepts (like faces), later layers find basic patterns (like edges)", "Early layers find basic patterns (like edges), later layers combine them into complex concepts (like faces)", "They both do exactly the same thing", "Early layers output probabilities, later layers take in raw data"],
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
        print(f"Error seeding AI Masterclass Part 7: {e}")
        db.rollback()
    finally:
        db.close()
