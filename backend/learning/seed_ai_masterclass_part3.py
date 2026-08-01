import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part3():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "The Big Bang"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "The Perfect Storm",
                    "readingTime": "~2 min read",
                    "narrative": "<p>For decades, neural networks lay dormant. But around 2012, three massive forces collided to trigger the AI Big Bang:</p><ol><li><strong>The Internet:</strong> Suddenly, humanity had generated billions of digital images, texts, and videos. The missing \"Big Data\" was finally here.</li><li><strong>Gamers & GPUs:</strong> The video game industry had spent billions developing GPUs (Graphics Processing Units) to render 3D graphics. It turned out, the exact same math used to calculate lighting on a digital sports car (matrix multiplication) was the exact math needed to train neural networks.</li><li><strong>Deep Learning:</strong> Researchers figured out how to stack many layers of artificial neurons on top of each other (creating \"Deep\" networks) and successfully train them without the math breaking down.</li></ol>",
                    "audioText": "Around 2012, three massive forces collided to trigger the AI Big Bang. The Internet provided Big Data. The video game industry provided powerful GPUs capable of matrix math. And researchers perfected Deep Learning algorithms.",
                    "audioTextHinglish": "2012 ke aas-paas, teen badi cheezein mili jisne AI Big Bang ko trigger kiya. Internet ne Big Data diya. Video game industry ne powerful GPUs diye jo matrix math kar sakte the. Aur researchers ne Deep Learning algorithms ko perfect kiya.",
                    "keyInsight": "AI didn't boom because of a single new invention. It boomed because the necessary ingredients (Data, Compute, Algorithms) finally existed at the same time.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "CPU vs GPU (The Hardware Revolution)",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Why are GPUs so important for AI? To understand this, we need to compare a CPU to a GPU.</p><p>A <strong>CPU (Central Processing Unit)</strong> is like a sports car. It is incredibly fast, but it only has a few seats. It executes complex tasks one by one, very quickly.</p><p>A <strong>GPU (Graphics Processing Unit)</strong> is like a fleet of 10,000 buses. Each bus is slower than the sports car, but together, they can transport massive amounts of data simultaneously.</p><p>AI relies on <em>Matrix Multiplication</em> (calculating thousands of weights and inputs at once). A CPU calculates these one by one. A GPU calculates them all at exactly the same time (Parallel Processing).</p>",
                    "audioText": "Why are GPUs so important for AI? A CPU is like a sports car: extremely fast but it only has a few seats. It does complex tasks one by one. A GPU is like a fleet of 10,000 buses. Each bus is slower, but they move massive amounts of data at the same time. AI requires Matrix Multiplication, which GPUs can do in parallel.",
                    "audioTextHinglish": "AI ke liye GPUs itne important kyun hain? CPU ek sports car jaisa hai, bahut fast par seats kam hain. Yeh ek baar mein ek complex task karta hai. GPU 10,000 buses ke fleet jaisa hai, jo ek saath bahut saara data move kar sakta hai. AI ko Matrix Multiplication chahiye, jo GPUs parallel mein kar sakte hain.",
                    "keyInsight": "AI doesn't need complex math; it needs simple math done millions of times simultaneously.",
                    "widgetType": "CpuVsGpuWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Turning Point: AlexNet",
                    "readingTime": "~2 min read",
                    "narrative": "<p>In 2012, an annual competition called <strong>ImageNet</strong> challenged researchers to build software that could recognize objects in pictures. For years, teams using traditional, hand-coded rules barely improved.</p><p>Then, a team from the University of Toronto entered a Deep Neural Network called <strong>AlexNet</strong>. Instead of coding rules, they just fed millions of images into a neural network running on two gamer GPUs.</p><p>AlexNet destroyed the competition. It didn't just win; it crushed the human-coded algorithms by a margin no one thought possible. The world woke up. Deep Learning actually worked.</p>",
                    "audioText": "In 2012, an AI called AlexNet entered the ImageNet competition. Instead of hand-coded rules, it used a Deep Neural Network trained on gamer GPUs. It crushed the competition and proved that Deep Learning actually worked.",
                    "audioTextHinglish": "2012 mein, AlexNet naam ke ek AI ne ImageNet competition mein hissa liya. Hand-coded rules ke bajaye, isne gamer GPUs par trained Deep Neural Network ka use kiya. Isne sabko hara diya aur saabit kiya ki Deep Learning sach mein kaam karta hai.",
                    "keyInsight": "AlexNet proved that letting the machine learn its own rules from data was vastly superior to humans trying to write the rules.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Transformer Revolution",
                    "readingTime": "~2 min read",
                    "narrative": "<p>While neural networks conquered image recognition, they still struggled with language. They read text one word at a time, forgetting the beginning of a sentence by the time they reached the end.</p><p>In 2017, researchers at Google published a paper titled <em>\"Attention Is All You Need.\"</em> They invented a new architecture called the <strong>Transformer</strong>. Instead of reading sequentially, a Transformer looks at every word in a sentence simultaneously and calculates how they \"attend\" to or relate to each other.</p><p>This single paper birthed the modern era of Large Language Models (LLMs) like GPT, Claude, and Gemini.</p>",
                    "audioText": "In 2017, Google published 'Attention Is All You Need', inventing the Transformer architecture. Instead of reading word by word, it looks at the whole sentence at once. This birthed the modern era of Large Language Models.",
                    "audioTextHinglish": "2017 mein, Google ne 'Attention Is All You Need' publish kiya, jisne Transformer architecture invent kiya. Word by word padhne ke bajaye, yeh poore sentence ko ek saath dekhta hai. Isne Large Language Models ke modern era ko janm diya.",
                    "keyInsight": "The Transformer architecture is the engine inside every modern AI chatbot.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "3 Questions",
                    "narrative": "<p>Test your knowledge of the AI Big Bang.</p>",
                    "audioText": "Test your knowledge of the AI Big Bang.",
                    "audioTextHinglish": "AI Big Bang ke baare mein apna knowledge test karein.",
                    "keyInsight": "The Big Bang of AI is a recent historical event that shaped the modern world.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "Which piece of hardware, originally designed for video games, turned out to be perfect for training AI?",
                                "options": ["CPU (Central Processing Unit)", "GPU (Graphics Processing Unit)", "RAM", "Hard Drive"],
                                "correct": 1
                            },
                            {
                                "q": "What was the significance of AlexNet in 2012?",
                                "options": ["It was the first AI to beat a human at chess", "It proved that Deep Learning neural networks could crush traditional hand-coded algorithms", "It was the first Transformer model", "It was the first robot to walk"],
                                "correct": 1
                            },
                            {
                                "q": "Which 2017 paper introduced the Transformer architecture, birthing the LLM era?",
                                "options": ["The Imitation Game", "Deep Blue vs Kasparov", "Attention Is All You Need", "The Perceptron Algorithm"],
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
        print(f"Error seeding AI Masterclass Part 3: {e}")
        db.rollback()
    finally:
        db.close()
