import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_remaining():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        # List of all remaining chapters
        remaining_topics = [
            {
                "name": "Discriminative vs Generative AI",
                "parts": [
                    {
                        "title": "The Era of Discrimination",
                        "narrative": "<p>From 2010 to 2020, the AI world was obsessed with a concept called <strong>Discriminative AI</strong>. The goal of this era was simple: look at data and categorize it.</p><p>If you gave an AI a picture, it would discriminate whether it was a dog or a cat. If you gave it an email, it would discriminate whether it was spam or safe. This was incredibly useful for businesses, but it lacked imagination. The AI could perfectly <em>label</em> reality, but it could never <em>create</em> reality.</p>",
                        "audioText": "From 2010 to 2020, AI was focused on Discriminative AI. This means the AI was trained to look at data and categorize it, like deciding if an email is spam. It could label reality, but not create it.",
                        "audioTextHinglish": "2010 se 2020 tak, AI sirf Discriminative tha. Iska matlab AI data ko dekh kar categorize karta tha, jaise spam email pehchanna. Ye reality ko label kar sakta tha, par kuch naya bana nahi sakta tha.",
                        "keyInsight": "Discriminative AI is designed to classify and categorize existing data."
                    },
                    {
                        "title": "The Generative Paradigm Shift",
                        "narrative": "<p>Then came the paradigm shift: <strong>Generative AI</strong>. Researchers realized that instead of asking a neural network \"What is this image?\", they could ask it \"What comes next?\"</p><p>By training AI to predict the next word in a sentence, or the next pixel in an image, the AI was forced to understand the underlying rules of human language and art. And when you ask an AI to predict what comes next infinitely, it starts <em>creating</em>.</p><p>Generative AI doesn't categorize. It writes original code, hallucinates beautiful paintings, and drafts emails that have never existed before in human history.</p>",
                        "audioText": "Generative AI was a massive shift. By teaching AI to predict what comes next, it learned how to create original text, code, and images that have never existed before.",
                        "audioTextHinglish": "Generative AI ek bohot bada shift tha. AI ko 'what comes next' predict karna sikhaya gaya, jisse wo bilkul nayi text aur images bananey lag gaya.",
                        "keyInsight": "Generative AI creates net-new data by predicting what should logically come next."
                    },
                    {
                        "title": "The Dreaming Machine",
                        "narrative": "<p>In Chapter 12, we learned that when an AI makes up fake facts, it's called a <strong>Hallucination</strong>. When you want factual answers, a hallucination is a terrible bug.</p><p>But Generative AI is fundamentally a \"dreaming machine.\" When you ask Midjourney for a picture of a cyberpunk astronaut on a horse, or ask ChatGPT to write a sci-fi story, it is literally hallucinating. In the realm of creativity, hallucination isn't a bug—it is the core feature that makes Generative AI magical.</p>",
                        "audioText": "Generative AI is a dreaming machine. When you want facts, a hallucination is a bug. But when you want art or stories, that hallucination is the core magic.",
                        "audioTextHinglish": "Generative AI ek dreaming machine hai. Factual answers ke liye hallucination ek bug hai, par art ya stories ke liye yahi hallucination uski magic hai.",
                        "keyInsight": "Creativity in Generative AI is essentially controlled hallucination."
                    },
                    {
                        "title": "Interactive Visualizer: Discriminative vs Generative",
                        "narrative": "<p>Let's look at the exact same input through the eyes of a Discriminative AI versus a Generative AI.</p><p>Provide a prompt to the system below, and toggle the switch to see how the two completely different eras of Artificial Intelligence handle your request.</p>",
                        "widgetType": "GenerativeWidget",
                        "widgetData": {}
                    },
                    {
                        "title": "Mastery Quiz",
                        "narrative": "<p>Test your knowledge on Discriminative vs Generative AI.</p>",
                        "widgetType": "MCQEngine",
                        "widgetData": {
                            "questions": [
                                {
                                    "q": "An AI that scans X-rays and highlights tumors is what type of AI?",
                                    "options": ["Generative", "Discriminative", "AGI", "Symbolic"],
                                    "correct": 1
                                },
                                {
                                    "q": "How does Generative AI create new things?",
                                    "options": ["It searches Google and copies the first result", "It categorizes data into buckets", "It predicts what logically comes next (e.g. the next word or pixel)", "It relies on human programmers to write the rules"],
                                    "correct": 2
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "name": "Tokenization & Embeddings",
                "parts": [
                    {
                        "title": "Part 1: The Alphabet of AI (Tokenization)",
                        "narrative": "<p>Computers do not understand English. They do not know what the word \"Hamburger\" means, nor do they know the letters H-A-M. They only understand numbers.</p><p>To feed text into a neural network, we must first break the sentences down into chunks called <strong>Tokens</strong>. A token might be a whole word, or just a piece of a word. For example, the AI might slice \"Hamburger\" into two tokens: `Ham` (ID: 452) and `burger` (ID: 8910).</p><p>This is why AI is so bad at spelling words backwards or counting the number of 'r's in strawberry—it doesn't actually see the letters, it only sees the mathematical Token IDs.</p>",
                        "audioText": "Computers only understand numbers, so we break words down into chunks called Tokens. For example, Hamburger might become two tokens: Ham and burger.",
                        "audioTextHinglish": "Computers sirf numbers samajhte hain, isliye hum words ko Tokens mein todte hain. Jaise Hamburger ko Ham aur burger mein.",
                        "keyInsight": "Tokenization is the process of translating human words into numbers so the AI can read them."
                    },
                    {
                        "title": "Part 2: The Coordinate System of Meaning (Embeddings)",
                        "narrative": "<p>Giving a word an ID number (like 452) isn't enough. The number 452 doesn't tell the AI that a Hamburger is a type of food.</p><p>To solve this, researchers created <strong>Embeddings</strong>. Instead of a single ID, every token is mapped to a massive list of numbers (usually 1,000+ numbers). You can think of this list of numbers as coordinates on a giant 1000-dimensional map called <strong>Latent Space</strong>.</p><p>On this map, words with similar meanings are placed physically close together. 'Apple' and 'Banana' are close. 'Dog' and 'Cat' are close.</p>",
                        "audioText": "To give words meaning, we assign them a massive list of coordinates called an Embedding. Words with similar meanings are placed physically close together in Latent Space.",
                        "audioTextHinglish": "Words ko meaning dene ke liye hum unhe coordinates dete hain jise Embedding kehte hain. Latent Space mein ek jaise meaning wale words paas paas hote hain.",
                        "keyInsight": "Embeddings translate the abstract 'meaning' of a word into a physical location in a mathematical space."
                    },
                    {
                        "title": "Part 3: The Math of Meaning",
                        "narrative": "<p>Because words are now just coordinates on a map, we can actually do math on them! This was one of the biggest breakthroughs in AI history (Word2Vec).</p><p>If you take the coordinate for <strong>King</strong>, subtract the coordinate for <strong>Man</strong>, and add the coordinate for <strong>Woman</strong>, the resulting coordinate lands almost exactly on the word <strong>Queen</strong>.</p><p><strong>King - Man + Woman = Queen.</strong> The AI has mathematically learned the concept of gender and royalty just by reading billions of pages of text.</p>",
                        "audioText": "Because words are coordinates, we can do math on them. If you take King, minus Man, plus Woman, you mathematically land exactly on Queen.",
                        "audioTextHinglish": "Kyunki words coordinates ban gaye hain, hum unpar math kar sakte hain. King minus Man plus Woman equals Queen.",
                        "keyInsight": "By turning words into geometry, AI can learn deep, logical relationships between concepts without human programming."
                    },
                    {
                        "title": "Interactive Latent Space Visualizer",
                        "narrative": "<p>Let's look at a 2D slice of this massive 1000-dimensional Latent Space. Notice how the AI has automatically clustered Animals together, Food together, and Vehicles together, even though nobody explicitly programmed it to do so.</p><p>Hover over the points to see the actual math (the Embedding vectors) behind the words!</p>",
                        "widgetType": "EmbeddingsWidget",
                        "widgetData": {}
                    },
                    {
                        "title": "Mastery Quiz",
                        "narrative": "<p>Test your knowledge on Tokenization and Embeddings.</p>",
                        "widgetType": "MCQEngine",
                        "widgetData": {
                            "questions": [
                                {
                                    "q": "Why does an AI often fail if you ask it 'How many letters are in the word Apple?'",
                                    "options": ["It doesn't know math", "It sees the word as a single numerical Token, not individual letters", "It is hallucinating", "It needs more internet access"],
                                    "correct": 1
                                },
                                {
                                    "q": "What happens in Latent Space?",
                                    "options": ["Words are deleted", "Words with similar meanings are placed physically close together as coordinate clusters", "The AI hallucinates", "The model shrinks in size"],
                                    "correct": 1
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "name": "Diffusion Models",
                "parts": [
                    {
                        "title": "The Forward Process (Destroying Data)",
                        "narrative": "<p>While LLMs generate text one word at a time, creating an entire image all at once is a very different challenge. To solve this, researchers invented <strong>Diffusion Models</strong>.</p><p>The training begins with a completely counter-intuitive step: <strong>Destroying data</strong>. We take a perfect, high-resolution photo of a dog. Step by step, we mathematically add random TV static (called Gaussian noise) to the image. We do this hundreds of times until the dog is completely gone, leaving only pure, random static.</p><p>The neural network's job is simply to watch this destruction process and learn exactly how the static was added.</p>",
                        "audioText": "To train a diffusion model, we start by taking a perfect image of a dog and slowly adding TV static to it until the image is completely destroyed. The AI watches and learns how the noise was added.",
                        "audioTextHinglish": "Diffusion model ko train karne ke liye, hum ek perfect image lete hain aur usme dheere dheere TV static dalte hain jab tak image puri tarah destroy na ho jaye. AI bas is process ko dekhta hai aur seekhta hai.",
                        "keyInsight": "Diffusion models learn about reality by watching it get slowly destroyed by noise."
                    },
                    {
                        "title": "The Reverse Process (Creating Art)",
                        "narrative": "<p>Once the AI perfectly understands how noise destroys an image, it can do something magical: it can run the process in <strong>reverse</strong>.</p><p>When you ask Midjourney for \"A cyberpunk dog on Mars\", the AI doesn't start by drawing an ear or a paw. It starts with a canvas of 100% pure random static. Then, using what it learned during training, it begins subtracting the noise, step by step, sculpting the static until the \"cyberpunk dog\" emerges from the chaos.</p>",
                        "audioText": "When you ask the AI to draw something, it starts with pure static. It then runs its training in reverse, slowly sculpting the static and removing noise until a beautiful image emerges.",
                        "audioTextHinglish": "Jab aap AI ko kuch draw karne bolte hain, wo pure static se shuru karta hai. Phir wo apna training reverse karta hai, aur noise ko dheere dheere hatata hai jab tak ek beautiful image bahar na aa jaye.",
                        "keyInsight": "Image generation is essentially the process of mathematically 'denoising' pure static."
                    },
                    {
                        "title": "Interactive Visualizer: The Diffusion Process",
                        "narrative": "<p>Experience the reverse diffusion process yourself. Watch how the AI starts with complete static noise and slowly \"denoises\" it into a clear, structured image based on a text prompt.</p>",
                        "widgetType": "DiffusionWidget",
                        "widgetData": {}
                    },
                    {
                        "title": "Mastery Quiz",
                        "narrative": "<p>Test your knowledge on Diffusion Models.</p>",
                        "widgetType": "MCQEngine",
                        "widgetData": {
                            "questions": [
                                {
                                    "q": "What is the very first step when training a Diffusion Model on a new image?",
                                    "options": ["It tries to draw it from memory", "It slowly adds static noise until the image is destroyed", "It asks a human to label it", "It turns the image into text"],
                                    "correct": 1
                                },
                                {
                                    "q": "When generating a new image from a prompt, what does a Diffusion Model start with?",
                                    "options": ["A blank white canvas", "A rough sketch", "100% pure random static noise", "A google image search"],
                                    "correct": 2
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "name": "Fine-Tuning vs RAG",
                "parts": [
                    {
                        "title": "Teaching an Old Dog New Tricks",
                        "narrative": "<p>If you want an AI to know about your company's private data, you have two choices.</p><p>1. <strong>Fine-Tuning:</strong> You actually change the AI's internal brain by doing more training on your data. This is expensive but changes how the AI <em>behaves</em>.</p><p>2. <strong>RAG (Retrieval-Augmented Generation):</strong> You just give the AI a search engine to look up your documents before it answers. This is cheap and perfect for <em>factual knowledge</em>.</p>",
                        "audioText": "To teach an AI private data, you can either Fine-Tune it to change its behavior, or use RAG to give it a search engine for facts.",
                        "audioTextHinglish": "AI ko private data sikhane ke liye ya toh aap Fine-Tune kar sakte hain, ya RAG use karke usko ek search engine de sakte hain.",
                        "keyInsight": "Use Fine-Tuning for style and behavior. Use RAG for facts and knowledge."
                    }
                ]
            },
            {
                "name": "Quantization & SLMs",
                "parts": [
                    {
                        "title": "Running AI on Your Phone",
                        "narrative": "<p>GPT-4 is massive and requires giant data centers to run. To run AI locally on your phone or laptop, researchers use <strong>Quantization</strong>.</p><p>Quantization compresses the model (like turning a high-res photo into a low-res JPEG). It rounds off the complex math numbers to save space. We also have <strong>SLMs (Small Language Models)</strong> which are built from the ground up to be tiny but highly efficient for specific tasks.</p>",
                        "audioText": "To run AI on your phone, we use Quantization to compress the model, or we build Small Language Models designed to be tiny and efficient.",
                        "audioTextHinglish": "Phone par AI chalane ke liye hum Quantization use karte hain model ko compress karne ke liye, ya Small Language Models banate hain.",
                        "keyInsight": "Quantization compresses big models so they can run locally without the cloud."
                    }
                ]
            },
            {
                "name": "Mixture of Experts (MoE)",
                "parts": [
                    {
                        "title": "The Secret Architecture of GPT-4",
                        "narrative": "<p>GPT-4 isn't one giant brain—it's a <strong>Mixture of Experts (MoE)</strong>.</p><p>Inside an MoE model, there are several smaller \"expert\" neural networks (e.g., one for math, one for coding, one for French). When you ask a question, a \"router\" looks at your prompt and only wakes up the two experts that are best suited to answer it. This saves massive amounts of electricity and makes the AI much faster.</p>",
                        "audioText": "GPT-4 uses a Mixture of Experts. It's actually several smaller brains, and a router only wakes up the experts needed for your specific question.",
                        "audioTextHinglish": "GPT-4 Mixture of Experts use karta hai. Isme alag alag chote brains hote hain aur sirf wahi jagte hain jinki zarurat hoti hai.",
                        "keyInsight": "MoE saves compute by only activating a fraction of the neural network for each word."
                    }
                ]
            },
            {
                "name": "The Brains of AI (CPU vs GPU)",
                "parts": [
                    {
                        "title": "Why Nvidia is Worth Trillions",
                        "narrative": "<p>Your laptop's CPU is like a genius professor—it can do very complex math, but only one problem at a time (Sequential).</p><p>A <strong>GPU (Graphics Processing Unit)</strong> is like 10,000 middle schoolers—they can only do basic addition, but they can do 10,000 problems at the exact same time (Parallel). Because neural networks are just billions of simple additions and multiplications, GPUs are required to train AI. This is why Nvidia is so incredibly valuable.</p>",
                        "audioText": "CPUs do complex math sequentially. GPUs do simple math massively in parallel, which is exactly what neural networks need.",
                        "audioTextHinglish": "CPU math sequential karta hai. GPU simple math ek saath hazaro baar kar sakta hai, jo AI ko chahiye. Isiliye Nvidia itna valuable hai.",
                        "keyInsight": "AI requires parallel processing, which is what GPUs are designed to do."
                    }
                ]
            },
            {
                "name": "The Data Center & Power Wall",
                "parts": [
                    {
                        "title": "The Physical Reality of the Cloud",
                        "narrative": "<p>AI doesn't float in the air. It lives in <strong>Data Centers</strong>—massive warehouses filled with tens of thousands of GPUs.</p><p>These GPUs generate so much heat that air conditioning isn't enough; they require liquid coolant pumped directly over the chips. The biggest roadblock to future AI isn't math—it's the <strong>Power Wall</strong>. Training the next generation of models will require so much electricity that tech companies are investing in nuclear power plants just to keep the servers running.</p>",
                        "audioText": "AI lives in massive Data Centers. The biggest roadblock to future AI is the Power Wall: we are running out of electricity to power the GPUs.",
                        "audioTextHinglish": "AI Data Centers mein rehta hai. Future AI ke liye sabse badi problem Power Wall hai, yani in servers ko chalane ke liye bijli ki kami.",
                        "keyInsight": "The scale of modern AI is limited by physical energy and cooling, not just code."
                    }
                ]
            },
            {
                "name": "The Titans of AI",
                "parts": [
                    {
                        "title": "The Key Players",
                        "narrative": "<p>The AI race is dominated by a few major players:</p><p><strong>OpenAI:</strong> Creators of ChatGPT. Closed-source, heavily backed by Microsoft.</p><p><strong>Anthropic:</strong> Creators of Claude. Focused heavily on AI safety and alignment.</p><p><strong>Meta (Facebook):</strong> Creators of LLaMA. They open-source their models so anyone can download and run them for free.</p><p><strong>Google:</strong> Creators of Gemini. Deeply integrating AI into the world's information infrastructure.</p>",
                        "audioText": "The major players in AI are OpenAI with ChatGPT, Anthropic with Claude, Meta with the open-source LLaMA, and Google with Gemini.",
                        "audioTextHinglish": "AI ke major players hain OpenAI, Anthropic, Meta jo open-source LLaMA banata hai, aur Google jiska model Gemini hai.",
                        "keyInsight": "The industry is split between Closed-Source (OpenAI/Google) and Open-Source (Meta)."
                    }
                ]
            },
            {
                "name": "The Infrastructure Layer",
                "parts": [
                    {
                        "title": "The Shovels of the AI Gold Rush",
                        "narrative": "<p>In a gold rush, the people who make the most money are the ones selling shovels. In AI, this is the Infrastructure Layer.</p><p>Companies like <strong>TSMC</strong> manufacture the silicon chips. Cloud providers like <strong>AWS and Azure</strong> rent the servers. And software frameworks like <strong>LangChain</strong> and <strong>HuggingFace</strong> provide the tools for developers to build applications.</p>",
                        "audioText": "The Infrastructure layer is the shovels of the AI gold rush, including chip makers like TSMC, cloud providers, and hubs like HuggingFace.",
                        "audioTextHinglish": "AI gold rush mein shovels bechne wale hain Infrastructure layer. Jaise chip maker TSMC, cloud providers, aur HuggingFace.",
                        "keyInsight": "The AI ecosystem relies entirely on hardware manufacturing and cloud distribution."
                    }
                ]
            },
            {
                "name": "Embodied Robotics",
                "parts": [
                    {
                        "title": "AI Enters the Physical World",
                        "narrative": "<p>Until now, AI has been a \"brain in a jar.\" But companies like Tesla (Optimus) and Figure (Figure 01) are putting these brains into humanoid robots.</p><p>By combining Vision models (to see), LLMs (to reason), and reinforcement learning (to move), we are on the verge of <strong>Embodied AI</strong>—robots that can understand verbal commands, look at a messy room, and figure out how to clean it without step-by-step programming.</p>",
                        "audioText": "Embodied AI puts the AI brain into a physical robot body. These humanoid robots can see, reason, and act in the physical world.",
                        "audioTextHinglish": "Embodied AI ek physical robot body mein AI dimaag daalta hai, jisse robots real world mein dekh, soch aur kaam kar sakte hain.",
                        "keyInsight": "Embodied AI merges language reasoning with physical robotic actuators."
                    }
                ]
            },
            {
                "name": "Real-World Industries",
                "parts": [
                    {
                        "title": "Transforming the Planet",
                        "narrative": "<p>AI isn't just for chatting. In <strong>Farming</strong>, computer vision lasers shoot weeds without harming crops. In <strong>Medicine</strong>, AI designs new proteins (AlphaFold) and detects cancer in X-rays faster than humans. In <strong>Education</strong>, personalized AI tutors adapt to a student's exact learning pace.</p>",
                        "audioText": "AI is transforming real industries. It shoots weeds in farming, discovers drugs in medicine, and acts as personalized tutors in education.",
                        "audioTextHinglish": "AI real industries badal raha hai. Farming mein weeds hatana, medicine mein drug discovery, aur education mein personal tutors ka kaam karna.",
                        "keyInsight": "The true value of AI lies in its application to physical, real-world problems."
                    }
                ]
            },
            {
                "name": "Current Roadblocks",
                "parts": [
                    {
                        "title": "The Data Wall and Alignment",
                        "narrative": "<p>AI progress might stall because of the <strong>Data Wall</strong>: we have basically used up all the high-quality text on the internet to train models. Researchers are now trying to use \"Synthetic Data\" (AI training on AI-generated data).</p><p>Another massive roadblock is <strong>Alignment</strong>: how do we ensure that an AI system vastly smarter than us actually shares human values and doesn't decide we are an obstacle?</p>",
                        "audioText": "AI faces roadblocks like the Data Wall, where we run out of internet text, and Alignment, which means ensuring the AI shares human values.",
                        "audioTextHinglish": "AI ke saamne badi mushkilein hain jaise Data Wall, jahan internet par data khatam ho raha hai, aur Alignment, yani AI humare values samjhe.",
                        "keyInsight": "Scaling up AI further requires solving fundamental data and safety problems."
                    }
                ]
            },
            {
                "name": "The Road to AGI",
                "parts": [
                    {
                        "title": "Artificial General Intelligence",
                        "narrative": "<p><strong>AGI (Artificial General Intelligence)</strong> is the holy grail: an AI that can perform <em>any</em> intellectual task that a human can, at the same or better level.</p><p>Many researchers believe AGI is achievable within the next 5 to 10 years (2030-2035). When AI can reason deeply, self-correct, write perfect code, and conduct novel scientific research autonomously, the world economy will fundamentally transform.</p>",
                        "audioText": "AGI is an AI that can do any intellectual task a human can. Many experts believe we will reach this milestone within the next 10 years.",
                        "audioTextHinglish": "AGI ka matlab hai ek aisi AI jo insaan ka koi bhi dimaagi kaam kar sake. Experts maante hain ye agle 10 saal mein possible hai.",
                        "keyInsight": "AGI marks the point where AI can do any economic labor a human can do."
                    }
                ]
            },
            {
                "name": "Superintelligence (ASI)",
                "parts": [
                    {
                        "title": "The Next 100 Years",
                        "narrative": "<p>If we achieve AGI, that AI can then be tasked with building an even smarter AI. This leads to an intelligence explosion resulting in <strong>ASI (Artificial Superintelligence)</strong>—an intellect much smarter than the best human brains in practically every field.</p><p>In a 100-year vision, ASI could solve nuclear fusion, cure all biological aging, manage a post-scarcity global economy, and lead humanity into deep space exploration. It is the final invention humanity will ever need to make.</p>",
                        "audioText": "ASI is Artificial Superintelligence, far smarter than any human. In the next 100 years, ASI could cure diseases, solve energy, and change humanity forever.",
                        "audioTextHinglish": "ASI yani Artificial Superintelligence, kisi bhi insaan se laakh guna smart. Agle 100 saalon mein ye humari duniya aur science ko hamesha ke liye badal dega.",
                        "keyInsight": "ASI is the ultimate end-game of AI research, capable of solving humanity's hardest physics and biology problems."
                    }
                ]
            }
        ]

        for topic_data in remaining_topics:
            topic_name = topic_data["name"]
            topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
            if not topic:
                topic = LearningTopic(subject_id=ai_subject.id, name=topic_name)
                db.add(topic)
                db.flush()

            # Construct config
            config = {"parts": []}
            for part in topic_data["parts"]:
                p = {
                    "title": part["title"],
                    "readingTime": "~2 min read",
                    "narrative": part["narrative"],
                    "audioText": part.get("audioText", ""),
                    "audioTextHinglish": part.get("audioTextHinglish", ""),
                    "keyInsight": part.get("keyInsight", ""),
                    "widgetType": part.get("widgetType", None),
                    "widgetData": part.get("widgetData", {})
                }
                config["parts"].append(p)
            
            topic.lesson_config_json = json.dumps(config)
        
        db.commit()
    except Exception as e:
        print(f"Error seeding remaining AI topics: {e}")
        db.rollback()
    finally:
        db.close()
