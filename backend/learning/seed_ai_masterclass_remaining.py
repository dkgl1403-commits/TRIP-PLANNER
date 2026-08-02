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
                        "title": "The Knowledge Problem",
                        "readingTime": "~2 min read",
                        "narrative": "<p>Imagine an AI model as a brilliant student who just woke up from a coma. They know everything up to the year they were trained, but they know absolutely nothing about what happened yesterday, or about your company's private, secret documents.</p><p>If you want the AI to answer questions about your private data, you have two choices: <strong>RAG</strong> or <strong>Fine-Tuning</strong>.</p>",
                        "audioText": "An AI's knowledge is frozen in time. To teach it new, private information, you must use either RAG or Fine-Tuning.",
                        "audioTextHinglish": "AI ki knowledge ek point par freeze ho jati hai. Nayi aur private information sikhane ke liye RAG ya Fine-Tuning use karna padta hai.",
                        "keyInsight": "AI models are static. You must explicitly give them new knowledge.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "RAG (Retrieval-Augmented Generation)",
                        "readingTime": "~2 min read",
                        "narrative": "<p><strong>RAG</strong> is like giving the AI an open-book test. You do NOT change the AI's brain. Instead, when you ask a question, a separate system quickly searches your company's documents, finds the relevant paragraph, and pastes it into the prompt along with your question.</p><p>The AI then reads the paragraph and answers your question. It's cheap, fast, and ensures the AI doesn't hallucinate because it's reading the exact facts.</p>",
                        "audioText": "RAG is like an open book test. You give the AI a search engine to look up documents before it answers. It's fast and cheap.",
                        "audioTextHinglish": "RAG ek open book test ki tarah hai. Aap AI ko search engine dete hain taki wo documents padhkar answer de. Ye sasta aur tez hai.",
                        "keyInsight": "RAG is best for giving the AI factual, up-to-date knowledge without changing its brain.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "Fine-Tuning & LoRA",
                        "readingTime": "~3 min read",
                        "narrative": "<p><strong>Fine-Tuning</strong> is like sending the student back to school. You actually perform more Gradient Descent (calculus) to physically alter the billions of weights in the AI's brain.</p><p>This is extremely expensive. However, engineers invented a breakthrough called <strong>LoRA (Low-Rank Adaptation)</strong>. Instead of retraining the massive brain, LoRA \"freezes\" the original brain and just adds a tiny, highly-specialized \"adapter\" module on the side. This makes training 10,000x cheaper!</p><p>Fine-Tuning isn't great for teaching facts, but it is perfect for teaching <em>style</em> (e.g., teaching the AI to talk exactly like a lawyer or a pirate).</p>",
                        "audioText": "Fine-Tuning physically alters the AI's brain. Engineers invented LoRA, which freezes the main brain and only trains a tiny adapter to save costs. Fine-Tuning is best for teaching style, not facts.",
                        "audioTextHinglish": "Fine-Tuning AI ke dimaag ko change karta hai. LoRA ek technique hai jo main brain ko freeze karke sirf ek chota adapter train karti hai jisse paise bachte hain. Fine-Tuning style sikhane ke liye best hai.",
                        "keyInsight": "Use Fine-Tuning/LoRA to change behavior and style. Use RAG to inject factual knowledge.",
                        "widgetType": "RAGvsFineTuningWidget",
                        "widgetData": {}
                    }
                ]
            },
            {
                "name": "Quantization & SLMs",
                "parts": [
                    {
                        "title": "The Memory Bottleneck",
                        "readingTime": "~2 min read",
                        "narrative": "<p>A large AI model like GPT-4 or Llama 3 (70 Billion parameters) requires over 140 Gigabytes of VRAM just to load into memory. No smartphone or laptop in the world has that much memory. So how do we run AI locally on our phones without relying on the cloud?</p><p>The answer is <strong>Quantization</strong>.</p>",
                        "audioText": "Massive AI models require hundreds of gigabytes of memory, which laptops don't have. To run AI locally, we must compress it.",
                        "audioTextHinglish": "Bade AI models ko chalane ke liye hundreds of gigabytes memory chahiye. Local phone par chalane ke liye unhe compress karna padta hai.",
                        "keyInsight": "Memory (VRAM), not processing speed, is the main bottleneck for running local AI.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "Quantization (Compressing the Brain)",
                        "readingTime": "~3 min read",
                        "narrative": "<p>Inside a neural network, every weight is a very precise decimal number, like <code>3.14159265</code>. This is called FP16 (16-bit precision). Quantization is the math of rounding off these decimals.</p><p>If we round it to just <code>3</code> (INT4 or 4-bit precision), the number takes up 75% less space in memory! The crazy part? The AI barely loses any intelligence. By rounding off the math, we can fit massive models onto a standard Macbook.</p>",
                        "audioText": "Quantization rounds off the highly precise decimal numbers inside the AI's brain. By chopping off the decimals, we save 75% of the memory space while barely losing any intelligence.",
                        "audioTextHinglish": "Quantization AI ke andar ke precise numbers ko round off karta hai. Decimals hatane se 75% space bachta hai aur AI ki intelligence bhi kam nahi hoti.",
                        "keyInsight": "Quantization is the process of reducing the precision of the weights to save memory.",
                        "widgetType": "QuantizationWidget",
                        "widgetData": {}
                    },
                    {
                        "title": "Small Language Models (SLMs)",
                        "readingTime": "~1 min read",
                        "narrative": "<p>Even with Quantization, sometimes we just want a smaller model. <strong>SLMs (Small Language Models)</strong> like Microsoft's <em>Phi-3</em> are built from the ground up to be tiny (only 3-8 billion parameters).</p><p>Instead of reading the entire internet, they are trained on highly curated, textbook-quality data. They run flawlessly on iPhones and are the future of edge computing.</p>",
                        "audioText": "Small Language Models are built from the ground up to be tiny but highly efficient. They run flawlessly on edge devices like iPhones.",
                        "audioTextHinglish": "Small Language Models shuru se hi chote banaye jate hain. Ye iPhones jaisi devices par perfectly chalte hain.",
                        "keyInsight": "Curated, high-quality data allows Small Language Models to punch far above their weight class.",
                        "widgetType": None,
                        "widgetData": {}
                    }
                ]
            },
            {
                "name": "Mixture of Experts (MoE)",
                "parts": [
                    {
                        "title": "The Problem with Dense Models",
                        "readingTime": "~2 min read",
                        "narrative": "<p>Every time you ask ChatGPT a question, electricity flows through every single parameter in its brain. If it has 1 Trillion parameters, that means a massive amount of math (and electricity) is used for every single word it generates.</p><p>This is called a <strong>Dense Model</strong>. It is incredibly expensive and slow to run at scale.</p>",
                        "audioText": "In a dense model, electricity flows through every single parameter for every word generated. This is incredibly expensive and slow.",
                        "audioTextHinglish": "Dense model mein har word generate karne ke liye poore dimaag ki electricity use hoti hai. Ye bohot mehenga aur slow hota hai.",
                        "keyInsight": "Activating the entire brain for every single word is computationally wasteful.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "The Secret Architecture of GPT-4",
                        "readingTime": "~3 min read",
                        "narrative": "<p>To solve this, researchers invented <strong>Mixture of Experts (MoE)</strong>. GPT-4 is not one giant brain—it is actually 8 (or more) smaller \"expert\" networks inside a trench coat.</p><p>There is a <strong>Router Gate</strong>. When you send a prompt, the Router looks at it and decides which experts to wake up. If you ask a coding question in French, the Router wakes up the <em>Coding Expert</em> and the <em>French Expert</em>, while the other 6 experts stay asleep!</p><p>This means the model can have 1 Trillion total parameters (massive knowledge), but only activates 250 Billion parameters at a time. It saves 75% of the compute cost while retaining all the intelligence!</p>",
                        "audioText": "GPT-4 is a Mixture of Experts. A router analyzes your prompt and only wakes up the specific expert neural networks needed to answer, while the rest stay asleep to save power.",
                        "audioTextHinglish": "GPT-4 ek Mixture of Experts hai. Ek router aapke question ko dekhta hai aur sirf zaruri experts ko jagata hai, baki sab sote rehte hain power bachane ke liye.",
                        "keyInsight": "MoE uses a Router to only activate a fraction of the neural network, drastically reducing compute costs.",
                        "widgetType": "MoEWidget",
                        "widgetData": {}
                    }
                ]
            },
            {
                "name": "The Brains of AI (CPU vs GPU)",
                "parts": [
                    {
                        "title": "The Tale of Two Brains: A History of Size",
                        "readingTime": "~4 min read",
                        "narrative": "<p>To understand modern AI, we must trace the history of the hardware. Let's start with <strong>\"Ram\" (The CPU)</strong>. In the 1940s, early computers like the ENIAC were the size of entire rooms, using thousands of hot, glowing vacuum tubes just to calculate artillery trajectories. By 1971, Intel invented the 4004—the first commercial microprocessor. Over decades, Ram evolved from a room-sized machine into a microscopic chip. Ram is a \"Genius Professor\"—designed to do one highly complex task at a time (Sequential Processing), like managing a whole operating system.</p><p>Now meet <strong>\"Shyam\" (The GPU)</strong>. Shyam was born much later, in the late 1990s (like Nvidia's GeForce 256 in 1999). Early GPUs were massive, power-hungry expansion cards plugged into motherboards for one highly specific, \"dumb\" purpose: drawing millions of pixels for 3D video games like Quake. A pixel doesn't need a genius; it just needs a fast worker. So, Shyam was built as an army of \"Middle Schoolers\"—thousands of tiny, simple cores doing basic math simultaneously (Parallel Processing). Just like the CPU, GPUs have dramatically shrunk at the transistor level while growing physically larger to pack in more cores.</p>",
                        "audioText": "CPUs evolved from room-sized machines in the 1940s to microscopic chips. They are geniuses at sequential math. GPUs were born in the 90s for video games, acting as an army doing parallel math.",
                        "audioTextHinglish": "CPU 1940s mein poore room jitne bade the, ab microscopic hain. Ye sequential math ke genius hain. GPU 90s mein games ke liye bane, jo parallel math karte hain.",
                        "keyInsight": "CPUs shrank to prioritize complex sequential logic. GPUs evolved to pack thousands of simple parallel cores.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "The Anatomy of a Core",
                        "readingTime": "~4 min read",
                        "narrative": "<p>So what actually is a \"Core\"? A CPU core is massive and incredibly complex. It has advanced logic (like branch prediction) and huge amounts of fast local memory (Cache) so it can run Windows or macOS smoothly. A \"Quad-Core\" CPU just means 4 of these genius brains on one chip.</p><p>A GPU core, however, is tiny and \"dumb.\" It has almost no cache and no advanced logic. Because they are so small at the nanometer scale, engineers can pack <em>thousands</em> of them onto a single piece of silicon. A modern Nvidia GPU might have over 10,000 cores. <em>(Manufacturing note: Both chips are made by melting pure silica sand into silicon ingots, slicing them into wafers, and using ultraviolet photolithography to print billions of microscopic transistors at the nanometer scale!)</em></p>",
                        "audioText": "A CPU core is massive, complex, and handles operating systems. A GPU core is tiny and simple, allowing engineers to pack thousands of them onto one chip.",
                        "audioTextHinglish": "CPU core bohot bada aur complex hota hai. GPU core chota aur simple hota hai, isiliye ek chip par hazaron aa jate hain.",
                        "keyInsight": "CPU cores maximize complexity. GPU cores maximize sheer quantity.",
                        "widgetType": "CpuVsGpuCoreWidget",
                        "widgetData": {}
                    },
                    {
                        "title": "The Plot Twist of 2012",
                        "readingTime": "~3 min read",
                        "narrative": "<p>For decades, CPUs ran the world. GPUs were only used by gamers to draw millions of pixels on a screen. But in 2012, AI researchers made a shocking discovery: <strong>training a Neural Network is mathematically identical to drawing pixels in a video game</strong>.</p><p>A neural network is just billions of simple additions and multiplications. The \"Genius\" CPU is terrible at this; it takes forever to do a billion simple math problems sequentially. The \"Middle School Army\" GPU crushes this task instantly in parallel. Overnight, the GPU accidentally became the most powerful engine for AI, making Nvidia the most valuable company in the world.</p>",
                        "audioText": "In 2012, researchers realized that neural network math is identical to video game math. Overnight, GPUs became the ultimate engines for AI.",
                        "audioTextHinglish": "2012 mein pata chala ki AI ka math aur video game ka math same hai. Raaton raat GPU AI ka sabse bada engine ban gaya.",
                        "keyInsight": "AI didn't invent the GPU; it hijacked hardware originally built for video games.",
                        "widgetType": None,
                        "widgetData": {}
                    }
                ]
            },
            {
                "name": "The Data Center & Power Wall",
                "parts": [
                    {
                        "title": "The Birth of the Data Center",
                        "readingTime": "~4 min read",
                        "narrative": "<p>To understand the AI power wall, we must look at how we got here.</p><p>In 1946, the US Military built <strong>ENIAC</strong>. It was the first true \"computer room.\" Data was stored on punch cards, and the room was a tangle of 18,000 vacuum tubes and cables. It was massive, slow, and generated so much heat it needed dedicated cooling.</p><p>By the 1960s, commercial computing took off. Airlines partnered with IBM to build the SABRE system, creating the first commercial data centers. Then came the 1990s dot-com boom. Suddenly, every company needed a \"server farm\" to host their websites. </p><p>The real explosion happened in 2006. Amazon realized they could rent out the excess capacity in their massive server farms to other companies. They launched <strong>AWS</strong> (Amazon Web Services). The modern \"Cloud\" was born. The Cloud wasn't a fluffy thing in the sky; it was millions of computers stacked in massive warehouses.</p>",
                        "audioText": "The modern data center evolved from 1946's room-sized ENIAC to the dot-com server farms, and finally to massive rentable infrastructure like AWS in 2006.",
                        "audioTextHinglish": "Data center ki shuruat 1946 mein ENIAC se hui thi. Fir 90s ke dot-com boom ke baad, 2006 mein Amazon ne AWS launch kiya, jisse modern Cloud ka janam hua.",
                        "keyInsight": "The \"Cloud\" is not a magical space; it is just renting millions of physical computers sitting in a massive warehouse.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "How AI Changed the Data Center",
                        "readingTime": "~3 min read",
                        "narrative": "<p>But wait... did AI suddenly create this massive need for data centers?</p><p>No. In the 2010s, Web 2.0 giants like Google, Meta (Facebook), and Amazon were already hoarding unimaginable amounts of data—photos, search queries, clicks—primarily to serve you targeted ads. The data <em>already existed</em>.</p><p>What changed was what the data center <em>did</em>. Before AI, these centers were mostly giant digital filing cabinets. They stored files and served websites (a very low-compute task). But when Generative AI emerged, these data centers had to be retrofitted. They were filled with massive GPUs, transforming from quiet storage warehouses into roaring, active \"thinking\" power plants that mathematically crunch that stored data trillion times a second.</p>",
                        "audioText": "We already had the data thanks to the internet. AI changed the data center from a quiet storage warehouse into an active mathematical power plant.",
                        "audioTextHinglish": "Internet ki wajah se data toh pehle se tha. AI ne in data centers ko sirf storage se badal kar ek massive mathematical power plant bana diya.",
                        "keyInsight": "AI didn't create the data; it hijacked the existing internet data and required massive compute power to process it.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "Inside the Fortress (Anatomy)",
                        "readingTime": "Interactive Widget",
                        "narrative": "<p>So, what exactly is inside these buildings? A modern AI data center is a marvel of engineering, built in four main layers:</p><ol><li><strong>Server Racks:</strong> The \"fridge-sized\" towers containing CPUs, GPUs, and SSDs.</li><li><strong>Cooling Infrastructure:</strong> The massive liquid pipes and CRAC (Computer Room Air Conditioning) units needed to prevent fires.</li><li><strong>Power Substation & Generators:</strong> The massive grid connections and backup diesel generators to ensure 100% uptime.</li><li><strong>Networking:</strong> The miles of fiber-optic cables binding everything together.</li></ol><p>Explore the anatomy of a data center below.</p>",
                        "audioText": "A modern data center consists of server racks, massive cooling infrastructure, power substations, and miles of networking cables.",
                        "audioTextHinglish": "Ek modern data center mein server racks, massive cooling systems, power substations, aur networking cables hote hain. Niche diye gaye widget mein ise explore karein.",
                        "keyInsight": "A data center is much more than just computers; the cooling and power infrastructure often take up more space than the servers themselves.",
                        "widgetType": "DataCenterAnatomyWidget",
                        "widgetData": {}
                    },
                    {
                        "title": "Stadiums of Silicon (Scale)",
                        "readingTime": "~2 min read",
                        "narrative": "<p>To understand the scale, remember that a single server rack is the size of a large kitchen fridge. A standard AI data center contains thousands of these racks and is the physical size of a massive <strong>football stadium</strong>.</p><p>For a real-world example, look at <strong>Meta's Altoona Data Center in Iowa</strong>. It spans over 5 million square feet—the size of roughly 100 football fields. It requires its own dedicated electrical substations and consumes more power than entire towns.</p><p>There are over 10,000 of these massive concrete and steel structures worldwide. They are the physical, beating heart of the internet and modern AI.</p>",
                        "audioText": "Data centers are massive. Meta's Altoona Data Center in Iowa spans over 5 million square feet, the size of 100 football fields.",
                        "audioTextHinglish": "Data centers football stadium jitne bade hote hain. Jaise Meta ka Altoona data center, jo 100 football fields jitna bada hai.",
                        "keyInsight": "Frontier AI infrastructure requires facilities so large they dwarf commercial stadiums.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "The Data Appetite (KB to PB)",
                        "readingTime": "~3 min read",
                        "narrative": "<p>Why are they so big? Because AI requires unfathomable amounts of data. Let's scale it up:</p><ul><li><strong>Kilobyte (KB):</strong> A short paragraph of text.</li><li><strong>Megabyte (MB):</strong> A small novel.</li><li><strong>Gigabyte (GB):</strong> A pickup truck filled with books.</li><li><strong>Terabyte (TB):</strong> An entire library.</li><li><strong>Petabyte (PB):</strong> 500 billion pages of standard text.</li></ul><p>Frontier AI models train on <em>Petabytes</em> of data. Storing this requires endless aisles of high-density hard drives. <em>(Note: While GPUs do the math, the Data Center relies heavily on CPUs to act as the managers, retrieving this massive data and feeding it to the GPUs over the network.)</em></p>",
                        "audioText": "AI models train on Petabytes of data—equivalent to hundreds of billions of pages of text. CPUs act as the managers to feed this data to the GPUs.",
                        "audioTextHinglish": "AI models Petabytes data par train hote hain. CPU is data ko manage karke GPUs tak pahunchata hai.",
                        "keyInsight": "CPUs orchestrate the massive data flow; GPUs execute the AI math.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "The Multi-Billion Dollar Price Tag",
                        "readingTime": "~4 min read",
                        "narrative": "<p>Building one of these AI stadiums is unimaginably expensive. Let's break down the cost for a standard 100-Megawatt AI Data Center.</p><h3>1. CapEx (Capital Expenditure to Build)</h3><ul><li><strong>Land & Building:</strong> ~$100 Million to buy acres of land and pour the concrete.</li><li><strong>Power & Cooling Infrastructure:</strong> ~$300 Million for massive generators, transformers, and liquid cooling pipes.</li><li><strong>The GPUs:</strong> To fill it, you need roughly 30,000 Nvidia H100 GPUs. At $30,000 each, that's <strong>$900 Million</strong> just for the chips!</li><li><strong>Total to Build:</strong> ~<strong>$1.4 Billion</strong> before you even turn it on.</li></ul><h3>2. OpEx (Operating Cost Per Year)</h3><ul><li><strong>Electricity:</strong> Running 100 Megawatts 24/7 costs about <strong>$87 Million per year</strong>.</li><li><strong>Cooling & Maintenance:</strong> ~$15 Million per year.</li><li><strong>Total Operating Cost:</strong> Over <strong>$100 Million per year</strong> just to keep the lights on and the chips cold.</li></ul><p>This is why only massive tech giants like Microsoft, Google, and Amazon can afford to play in the frontier AI race.</p>",
                        "audioText": "Building a standard AI data center costs over 1.4 Billion dollars in CapEx, mostly for the GPUs. The OpEx, or operating cost, is over 100 million dollars per year just in electricity and cooling.",
                        "audioTextHinglish": "Ek data center banane ka CapEx lagbhag 1.4 Billion dollars hai, jisme sabse bada kharcha GPUs ka hai. Aur ise chalane ka OpEx saal ka 100 million dollars se zyada aata hai sirf electricity aur cooling mein.",
                        "keyInsight": "The sheer capital required creates a massive moat. Only trillion-dollar companies can afford to build the infrastructure for frontier AI.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "The Heat & Cooling Crisis",
                        "readingTime": "~4 min read",
                        "narrative": "<p>Why do data centers need so much cooling? It comes down to basic physics. When you push massive amounts of electricity through millions of microscopic transistors inside a GPU, it encounters resistance. That electrical resistance is emitted as <strong>Heat</strong>.</p><p>For decades, data centers used massive <strong>Air Conditioning (CRAC)</strong> units. They would blow freezing air into the aisles to cool the servers. But AI chips like the H100 run so hot that blowing air is no longer enough.</p><p>Modern AI data centers have to use <strong>Liquid Cooling</strong>. They pipe cold water directly over the processors (via cold plates) to absorb the heat. This is incredibly efficient for heat transfer, but it creates a massive environmental crisis: A single AI data center can evaporate millions of gallons of fresh drinking water every day through its cooling towers.</p>",
                        "audioText": "Electrical resistance inside chips creates massive heat. Modern AI chips are so hot that traditional air conditioning fails; they require liquid cooling, evaporating millions of gallons of drinking water.",
                        "audioTextHinglish": "Chips ke andar ki electricity se bohot heat banti hai. Aaj kal AI chips itne garam hote hain ki unhe thanda karne ke liye liquid cooling ka use hota hai, jo lakho gallon paani evaporate kar deta hai.",
                        "keyInsight": "Heat is the ultimate enemy of compute. Liquid cooling solves the heat but creates a massive water consumption crisis.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "Land, Power & Community Impact",
                        "readingTime": "~3 min read",
                        "narrative": "<p>Data centers do not exist in a void—they are built in real communities, and they have a massive physical footprint. </p><p><strong>Land Occupation:</strong> Tech giants buy up hundreds of acres of rural or suburban land. While this brings some tax revenue, data centers employ very few people relative to their size (usually under 100 staff), meaning they don't create many local jobs.</p><p><strong>The Noise:</strong> The massive industrial fans and cooling towers running 24/7 emit a constant, low-frequency hum that can travel for miles, often frustrating nearby residents.</p><p><strong>Resource Hoarding:</strong> When a single facility requires 100 Megawatts of power and millions of gallons of water, it directly competes with the local community. In places like Ireland and Northern Virginia, local governments are struggling to keep the lights on for citizens because data centers are straining the electrical grids.</p>",
                        "audioText": "Data centers have a massive community impact. They occupy huge plots of land, create constant industrial noise, and compete with local towns for electricity and drinking water.",
                        "audioTextHinglish": "Data centers ka community par bada asar hota hai. Wo zameen gherte hain, lagaataar shor karte hain, aur local shehron ke saath electricity aur paani ke liye compete karte hain.",
                        "keyInsight": "The digital world has severe physical consequences for the communities hosting its infrastructure.",
                        "widgetType": None,
                        "widgetData": {}
                    },
                    {
                        "title": "The Cost of a Prompt",
                        "readingTime": "Interactive Widget",
                        "narrative": "<p>Every time you send a prompt to an AI, it triggers a physical reaction in a data center miles away. Electricity is burned, water is evaporated, and money is spent.</p><p>The AI industry is currently choking on these physical constraints. Supply chains (TSMC) can't make chips fast enough, rare earth minerals are scarce, and national grids are running out of power.</p><p>Use the widget below to calculate the real-world physical cost of your AI prompts.</p>",
                        "audioText": "Every prompt you send burns electricity and water in a physical data center. The industry is currently bottlenecked by power, water, and chip manufacturing supply chains.",
                        "audioTextHinglish": "Aapke har ek prompt par data center mein electricity aur paani kharch hota hai. Aaj AI industry software se nahi, balki in physical constraints se ruki hui hai.",
                        "keyInsight": "The future of AI is bottlenecked by power, water, and physical supply chains, not by software.",
                        "widgetType": "DataCenterWidget",
                        "widgetData": {}
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
