import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part7():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=99, name="Masterclass").first()
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
                    "readingTime": "~4 min read",
                    "narrative": "<p>Before we can build a brain, we need a single brain cell. The story of the artificial neuron is a rollercoaster of triumphs and failures.</p><p>It started in 1943 when Warren McCulloch and Walter Pitts proposed the first mathematical model of a neuron. Then, in 1958, Frank Rosenblatt actually built it in hardware, calling it the <strong>Perceptron</strong>.</p><p><strong>What is an artificial neuron made of?</strong> It is astonishingly simple — just a tiny mathematical function. But to really understand it, let's use a real-world decision:</p><h3>The Beach Decision Analogy</h3><p>Imagine you are deciding whether to go to the beach today. You have three inputs:</p><ol><li><strong>Is it sunny?</strong> (Yes = 1, No = 0)</li><li><strong>Is it the weekend?</strong> (Yes = 1, No = 0)</li><li><strong>Is your car working?</strong> (Yes = 1, No = 0)</li></ol><p>A <strong>Weight</strong> is simply a number that tells the neuron <em>how important</em> each input is:</p><ul><li>Weight for Sunshine: <strong>5.0</strong> (Very important!)</li><li>Weight for Weekend: <strong>2.0</strong> (Somewhat important)</li><li>Weight for Car: <strong>0.5</strong> (Not critical — you can walk)</li></ul><p>If it is sunny, it is the weekend, but your car is broken: <code>(1 × 5.0) + (1 × 2.0) + (0 × 0.5) = 7.0</code>. Score above 5.0? Go to the beach.</p><p>But what if you <em>hate</em> the beach? That's the <strong>Bias</strong> — a default baseline added to the equation. If your bias is <strong>−10.0</strong>: <code>7.0 − 10.0 = −3.0</code>. Negative score: stay home, regardless of the weather.</p><p>That's it. A Weight tells the neuron what matters. A Bias tells the neuron its default inclination. <strong>When an AI 'learns', all it is doing is tweaking those weights and biases slightly up and down until it gets the right answer.</strong> For decades, a single neuron like this couldn't do much. We only succeeded when we stacked millions of them into Layers and trained them with Backpropagation.</p>",
                    "audioText": "Before building a brain, we need a single brain cell. The Perceptron was built in 1958. A Weight is a number that tells the neuron how important each input is. A Bias is the neuron's default inclination. In the beach example: is it sunny, is it the weekend, is your car working? Weight for sunshine is 5.0, for weekend is 2.0, for car is 0.5. Multiply each input by its weight and add the bias. If the score is above the threshold, the neuron fires. When an AI learns, all it does is tweak these weights and biases until it gets the right answer.",
                    "audioTextHinglish": "Dimaag banane se pehle ek single cell chahiye. Perceptron 1958 mein bana. Weight ek number hai jo batata hai ki har input kitna important hai. Bias neuron ka default inclination hai. Beach example mein: sunny hai, weekend hai, car kaam kar rahi hai? Sunshine ka weight 5.0, weekend ka 2.0, car ka 0.5. Har input ko uske weight se multiply karo aur bias add karo. Agar score threshold se upar hai toh neuron fire karta hai. Jab AI seekhta hai, bas yahi weights aur biases thoda thoda adjust karta hai jab tak sahi jawab na mile.",
                    "keyInsight": "A Weight measures importance. A Bias sets the baseline. Together, they are the two numbers every artificial neuron uses to make every decision in every AI model ever built.",
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
                    "narrative": "<p>Let's watch a Neural Network \"think\" in slow motion.</p><p>When you click \"Feed Input\" below, watch how the data travels from the Input Layer, through the Hidden Layers, and finally into the Output Layer to produce a prediction. This forward movement is called a <strong>Forward Pass</strong>.</p>",
                    "audioText": "Let's watch a Neural Network think in slow motion. Click 'Feed Input' below to watch how data travels from the Input Layer, through the Hidden Layers, and into the Output Layer to make a prediction. This forward movement is called a Forward Pass.",
                    "audioTextHinglish": "Chaliye ek Neural Network ko slow motion mein sochte hue dekhte hain. Niche 'Feed Input' par click karein aur dekhein kaise data Input Layer se Hidden Layers hote hue Output Layer tak pahunch kar prediction karta hai. Ise Forward Pass kehte hain.",
                    "keyInsight": "Information flows sequentially from input to output, layer by layer.",
                    "widgetType": "NeuralNetworkWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Loss Function (Realizing a Mistake)",
                    "readingTime": "~4 min read",
                    "narrative": "<p>When a Neural Network is first built, all its weights are set to random numbers. So on its first Forward Pass, it will confidently make a terrible prediction. How does it know it's wrong? We use a <strong>Loss Function</strong> (also called an Objective Function or Cost Function) — a mathematical scorecard of wrongness.</p><h3>Worked Example: House Price Prediction</h3><p>Say we're training an AI to predict house prices. We give it a <strong>2,000 sq ft house</strong>. The actual price is <strong>$400,000</strong>.</p><p><strong>Step 1 — First Guess:</strong> The AI (knowing nothing) guesses <strong>$100,000</strong>.<br/>Loss = |$100,000 − $400,000| = <strong>300,000</strong>. Wrongness score: 300,000.</p><p><strong>Step 2 — Adjust via Gradient Descent:</strong> The AI knows it guessed too low and shifts its internal weights upward.<br/>New guess: <strong>$500,000</strong>.<br/>Loss = |$500,000 − $400,000| = <strong>100,000</strong>. Score dropped from 300,000 to 100,000 — the AI is learning.</p><p><strong>Step 3 — Convergence:</strong> The AI adjusts again — it was a bit too high. After thousands of iterations, it converges to <strong>$400,000</strong>. Loss = <strong>0</strong>.</p><h3>Why Different Loss Functions?</h3><p><strong>MAE (Mean Absolute Error):</strong> Simply takes the absolute difference. Being off by $10 costs 10. Being off by $100 costs 100. Treats all errors equally.</p><p><strong>MSE (Mean Squared Error):</strong> <em>Squares</em> the error before averaging. Being off by $10 costs 100. Being off by $100 costs 10,000. Massive errors are punished exponentially harder. Use MSE when big mistakes are catastrophically expensive — like a 5% error on a $10M mansion costs $500K, which is far worse than a 5% error on a $100K studio.</p><p>The choice of Loss Function shapes what the AI optimizes for. Get it wrong, and you train a model that is technically correct but practically useless.</p>",
                    "audioText": "The Loss Function is the mathematical scorecard of wrongness. House price example: the AI guesses $100,000 for a $400,000 house. Loss equals 300,000. It adjusts and guesses $500,000. Loss drops to 100,000. After thousands of iterations it converges to $400,000 and Loss equals zero. MAE takes the absolute difference and treats all errors equally. MSE squares the error, punishing large mistakes exponentially harder. The choice of Loss Function shapes what the AI is optimizing for.",
                    "audioTextHinglish": "Loss Function galati ka mathematical scorecard hai. House price example: AI ek $400,000 ghar ke liye $100,000 guess karta hai. Loss 300,000 hai. Adjust karke $500,000 guess karta hai. Loss 100,000 pe aa jaata hai. Hazaro iterations ke baad $400,000 par converge karta hai aur Loss zero ho jaata hai. MAE absolute difference leta hai aur sab errors ko equally treat karta hai. MSE error ko square karta hai, badi galatiyon ko exponentially zyada punish karta hai. Loss Function ka chunav decide karta hai ki AI kya optimize kar raha hai.",
                    "keyInsight": "The Loss Function is the AI's compass. Every training decision — every weight update, every gradient step — exists to minimize this single number. Choosing the wrong Loss Function means training an AI that is technically correct but practically wrong.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Backpropagation (Learning from Mistakes)",
                    "readingTime": "~4 min read",
                    "narrative": "<p>Once the AI calculates its Loss, it needs to fix its mistake. This is where the magic happens: <strong>Backpropagation</strong>.</p><p>Discovered in the 1980s, Backpropagation takes the error from the Output Layer and sends it <em>backwards</em> through every Hidden Layer all the way to the Input Layer. Using calculus (the Chain Rule), it calculates exactly how much each individual weight and bias contributed to the mistake. It then adjusts every parameter so that next time, the prediction is better.</p><h3>How Bias is Initialized and Updated</h3><p><strong>Initialization:</strong> Unlike weights (which must start as small <em>random</em> numbers to prevent the symmetry problem — where all neurons learn the same thing), biases are safely initialized to <strong>zero</strong>. The weights introduce enough randomness for the first pass. Exception: in networks using the ReLU activation function, biases are sometimes set to a small positive constant (e.g., 0.01) to prevent the <em>dying ReLU problem</em>, where neurons permanently stop firing.</p><p><strong>The Bias Update Rule (via Backpropagation):</strong></p><ol><li>The network calculates an <strong>error signal (δ)</strong> for each neuron — how much did this neuron's output contribute to the final wrong answer?</li><li>For a weight, the gradient is: <code>δ × the input that came through that connection</code>.</li><li>For a bias, it is simpler — because a bias has no input (it's conceptually connected to a fixed input of 1), the gradient is simply: <code>the error signal δ itself</code>.</li><li>The update formula: <code>b_new = b_old − (learning_rate × δ)</code></li></ol><p>This loop — Forward Pass → Loss → Backprop → Update → repeat — is what training actually means. GPT-4 ran this loop trillions of times across its training data.</p>",
                    "audioText": "Backpropagation sends the error backwards through the network. Using the Chain Rule from calculus, it calculates how much each weight and bias contributed to the mistake. Biases are initialized to zero because weights already provide randomness. In ReLU networks, biases may start at a small positive value to prevent dying neurons. The bias update rule: the new bias equals the old bias minus the learning rate times the error signal. This update loop — Forward Pass, Loss, Backprop, Update — is what training actually means.",
                    "audioTextHinglish": "Backpropagation error ko peeche ki taraf bhejtaa hai. Chain Rule se yeh calculate karta hai ki har weight aur bias ne galati mein kitna contribute kiya. Biases zero se start hote hain kyunki weights pehle se randomness provide karte hain. ReLU networks mein biases thodi positive value se start ho sakte hain taaki dying neurons ki problem se bacha ja sake. Bias update rule: naya bias purana bias minus learning rate times error signal. Yahi update loop — Forward Pass, Loss, Backprop, Update — training ka asli matlab hai.",
                    "keyInsight": "The bias gradient is simply the error signal itself — simpler than a weight's gradient because a bias has no input connection to multiply through. This mathematical elegance is why biases and weights can be updated together in the same backward pass.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Epochs (Practice Makes Perfect)",
                    "readingTime": "~1 min read",
                    "narrative": "<p>Learning doesn't happen instantly. The process of Forward Pass (predicting), Loss Function (scoring the error), and Backpropagation (adjusting weights) is just a single step.</p><p>To truly learn, the AI must repeat this process millions of times across its entire dataset. One full pass through the entire training dataset is called an <strong>Epoch</strong>.</p><p>Training ChatGPT required thousands of Epochs over trillions of words, running on thousands of GPUs for months. Practice makes perfect!</p>",
                    "audioText": "Learning takes time. The AI must repeat the cycle of predicting, scoring, and adjusting millions of times. One full pass through the entire dataset is called an Epoch.",
                    "audioTextHinglish": "Seekhne mein time lagta hai. AI ko predict karne, score karne, aur adjust karne ka cycle lakho baar repeat karna padta hai. Poore dataset se ek baar guzarne ko Epoch kehte hain.",
                    "keyInsight": "An Epoch is one complete cycle through the entire training dataset.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Scale of Intelligence: From 60K to 1.8 Trillion Parameters",
                    "readingTime": "~3 min read",
                    "narrative": "<p>When you read that 'GPT-4 has 1 trillion parameters', it sounds abstract. But those are real numbers — actual weights and biases physically stored in memory. A <strong>parameter</strong> is simply the total count of all weights and biases in the model combined.</p><p>In the beach example, we had 3 weights + 1 bias = <strong>4 parameters</strong>. That was enough to decide whether to go to the beach. Here's how that scales up:</p><table style='width:100%;border-collapse:collapse;font-size:0.85em'><thead><tr style='background:rgba(255,255,255,0.08)'><th style='padding:8px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1)'>Model</th><th style='padding:8px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1)'>Year</th><th style='padding:8px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1)'>Parameters</th><th style='padding:8px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1)'>Used For</th></tr></thead><tbody><tr><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>LeNet-5</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>1998</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>~60,000</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>Reading handwritten zip codes on postal envelopes</td></tr><tr><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>BERT</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>2018</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>340 Million</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>Google Search understanding query context vs keywords</td></tr><tr><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>GPT-3</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>2020</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>175 Billion</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>Writing poetry, code, essays. File size: ~700 GB</td></tr><tr><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>GPT-4</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>2023</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>~1.8 Trillion (est.)</td><td style='padding:8px;border-bottom:1px solid rgba(255,255,255,0.05)'>Passing the Bar Exam, advanced mathematical reasoning</td></tr><tr><td style='padding:8px'>Apple Intelligence</td><td style='padding:8px'>2024</td><td style='padding:8px'>~3 Billion</td><td style='padding:8px'>On-device AI inside iPhone RAM without draining battery</td></tr></tbody></table><p style='margin-top:12px'>When you send ChatGPT a message, it runs your words through a math equation with over a trillion weights and biases to calculate the single most likely next word. Then it does it again for the word after that. And again. Until the response is complete.</p>",
                    "audioText": "A parameter is the total count of all weights and biases in a model. In the beach example we had 4 parameters. LeNet-5 in 1998 had 60,000 parameters and read postal zip codes. BERT had 340 million and helped Google Search understand context. GPT-3 had 175 billion — a file size of 700 gigabytes. GPT-4 has an estimated 1.8 trillion. Apple Intelligence deliberately uses only 3 billion so the model fits inside an iPhone's RAM. When you message ChatGPT, it runs your words through all of those weights to calculate the next word, then the next, until the response is complete.",
                    "audioTextHinglish": "Parameter ek model mein saare weights aur biases ka total count hai. Beach example mein 4 parameters the. 1998 mein LeNet-5 ke 60,000 parameters the aur postal zip codes padhta tha. BERT ke 340 million the aur Google Search ko context samajhne mein help karta tha. GPT-3 ke 175 billion the — 700 gigabyte file size. GPT-4 ke estimated 1.8 trillion hain. Apple Intelligence sirf 3 billion use karta hai taaki model iPhone RAM mein fit ho sake. Jab aap ChatGPT ko message karte ho, woh in sab weights se guzar kar agla word calculate karta hai, phir agla, jab tak response complete na ho.",
                    "keyInsight": "Scale is the secret weapon of modern AI. From 60,000 parameters reading envelopes in 1998 to 1.8 trillion parameters passing the Bar Exam in 2023 — the math is the same. There is just unfathomably more of it.",
                    "widgetType": None,
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
                            },
                            {
                                "q": "What is the purpose of the Loss Function?",
                                "options": ["To compress the dataset", "To calculate how wrong the AI's prediction is compared to the truth", "To delete old data", "To increase the speed of the GPU"],
                                "correct": 1
                            },
                            {
                                "q": "Which algorithm sends the error backwards through the network to adjust the weights and allow the AI to learn?",
                                "options": ["Softmax", "Tokenization", "Backpropagation", "Epoch"],
                                "correct": 2
                            },
                            {
                                "q": "What do we call one full pass through the entire training dataset?",
                                "options": ["A Forward Pass", "An Epoch", "A Loss Function", "A Logit"],
                                "correct": 1
                            },
                            {
                                "q": "In the beach decision analogy, what does a 'Weight' represent?",
                                "options": ["The physical mass of the server", "A number that measures how important each input is to the decision", "The bias of the neuron", "The output of the activation function"],
                                "correct": 1
                            },
                            {
                                "q": "Why are biases initialized to zero while weights must be initialized randomly?",
                                "options": ["Biases are not important, so zero is fine", "Weights must be random to break symmetry so all neurons don't learn the same thing; biases are safe at zero because the random weights already provide diversity", "Zero is the highest possible value for a bias", "Random weights would cause the network to explode"],
                                "correct": 1
                            },
                            {
                                "q": "MSE (Mean Squared Error) punishes large errors more heavily than MAE. Why would you use MSE for house price prediction?",
                                "options": ["Because MSE is always more accurate than MAE", "Because being off by a small amount is totally acceptable, but being off by a massive amount (like $500K on a mansion) is catastrophically expensive and should be penalized hard", "Because MSE is simpler to calculate", "Because houses don't have absolute errors"],
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
