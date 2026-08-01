import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part6():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "Probability & Statistics"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "The Language of Uncertainty",
                    "readingTime": "~3 min read",
                    "narrative": "<p>In standard math classes, we are taught absolute truths: 2 + 2 is exactly 4. A triangle has exactly 3 sides. But the real world is messy, unpredictable, and full of missing information.</p><p><strong>Probability</strong> is the mathematics of \"maybe\". It gives us a way to measure uncertainty. Instead of saying \"It will rain tomorrow\" (absolute), we say \"There is an 80% chance of rain\" (probable).</p><p><strong>Statistics</strong> is how we find patterns in the past to calculate that probability. If it rained on 80 out of the last 100 days that looked exactly like today, statistics tells us the probability of rain tomorrow is 80%.</p><p>For an AI, absolute truths are useless in the real world. A self-driving car never sees a \"perfect\" stop sign; it sees a sign partially covered by snow, at dusk, from a weird angle. AI must speak the language of Probability.</p>",
                    "audioText": "In standard math, everything is absolute. Two plus two is four. But the real world is messy. Probability is the math of 'maybe'. It lets us measure uncertainty. Statistics is how we look at past data to calculate those probabilities. Because the real world is unpredictable, AI must use probability, not absolute truths.",
                    "audioTextHinglish": "Normal math mein sab fix hota hai, jaise 2+2=4. Par real world messy hai. Probability 'shayad' ya 'maybe' ka math hai. Statistics se hum purane data ko dekh kar future ki probability nikalte hain. Real world ki uncertainty ki wajah se, AI ko absolute sach nahi, balki probability use karni padti hai.",
                    "keyInsight": "Probability is the mathematics of 'maybe', and Statistics is how we learn from the past.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Why AI Needs Probability: The Plastic Bag",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Imagine an AI driving a car at 60 mph. Suddenly, a gray shape blows across the road.</p><p>If the AI is programmed with absolute rules (If shape = obstacle, then BRAKE), it might slam on the brakes, causing a massive accident behind it. But the shape might just be a plastic bag!</p><p>Instead, the AI uses Probability. It looks at the pixels, the movement, and its statistical training, and calculates:<br/>- 99.2% probability: Plastic Bag<br/>- 0.7% probability: Bird<br/>- 0.1% probability: Rock</p><p>Because the probability of a rock is so low, the AI decides it is safer to keep driving. <strong>AI decision making is never binary (Yes/No). It is a constant, split-second balancing act of percentages.</strong></p>",
                    "audioText": "Imagine a self driving car sees a gray shape blow across the road. If it thinks in absolutes, it might slam the brakes for a plastic bag. Instead, it calculates probabilities: 99% chance it's a bag, 1% chance it's a rock. AI decision making is a constant balancing act of percentages.",
                    "audioTextHinglish": "Sochiye ek self-driving car ke samne achanak koi gray cheez udti hui aaye. Agar woh absolute sochegi, toh plastic bag ke liye bhi achanak break laga degi jisse accident ho sakta hai. Isliye AI probability calculate karti hai: 99% chance plastic bag, 1% chance patthar. AI ke decisions humesha percentages par based hote hain.",
                    "keyInsight": "AI decision making is never Yes/No. It is a continuous balancing act of percentages.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Confident Machine",
                    "readingTime": "~2 min read",
                    "narrative": "<p>So, we know AI needs to output probabilities. But when a Neural Network finally makes a prediction, what does that prediction actually look like internally?</p><p>If you show an AI a picture and ask, \"Is this a Cat, a Dog, or a Bird?\", the AI's final layer of neurons does not magically output \"99% Cat\". Instead, it outputs raw, messy mathematical numbers called <strong>Logits</strong>.</p><p>It might output <code>2.5</code> for Cat, <code>-1.0</code> for Dog, and <code>0.8</code> for Bird. These numbers don't add up to 100%. Some are negative. How do we translate these messy Logits into clean percentages? We use a mathematical function called <strong>Softmax</strong>.</p>",
                    "audioText": "When an AI makes a prediction, its internal neurons don't output clean percentages. They output raw, messy numbers called Logits. To turn these messy numbers into human readable percentages, it uses a mathematical function called Softmax.",
                    "audioTextHinglish": "Jab AI prediction karta hai, toh uske neurons direct percentages nahi dete. Woh raw aur messy numbers output karte hain jinhe Logits kehte hain. In Logits ko percentages mein badalne ke liye ek function use hota hai jise Softmax kehte hain.",
                    "keyInsight": "Logits are the raw, unfiltered output of a Neural Network.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Softmax Function",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>The Softmax function acts as a translator. It does three very important things to the raw Logits:</p><ol><li><strong>Exponentiates:</strong> It raises the mathematical constant <em>e</em> to the power of the logit. This forces all numbers to be positive and exaggerates the differences (making the AI more decisive).</li><li><strong>Sums:</strong> It adds all the exponentiated values together to get a total.</li><li><strong>Divides:</strong> It divides each individual value by the total. This mathematically guarantees that all the final numbers add up perfectly to 100%.</li></ol><p>Try adjusting the raw Logits below and watch how Softmax translates them into a final Confidence percentage. Also, try adjusting the <strong>Temperature</strong>, which controls how \"creative\" or \"greedy\" the AI is!</p>",
                    "audioText": "The Softmax function takes the raw numbers, makes them all positive, exaggerates the differences, and then mathematically forces them to add up perfectly to one hundred percent. Try playing with the Softmax Sandbox below to see it in action.",
                    "audioTextHinglish": "Softmax function raw numbers ko positive banata hai, unke differences ko bada karta hai, aur unhe aapas mein divide karke ek perfect 100% mein fit kar deta hai. Niche Softmax Sandbox ke saath play karke dekhein.",
                    "keyInsight": "Softmax mathematically guarantees that the final outputs sum to exactly 100%.",
                    "widgetType": "SoftmaxWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Temperature Trick: ChatGPT's Secret",
                    "readingTime": "~2 min read",
                    "narrative": "<p>When you ask ChatGPT a question, it doesn't \"know\" the answer as a whole sentence. It is simply calculating the probability of what the <em>next single word</em> should be.</p><p>If the sentence is \"The sky is...\", the AI calculates probabilities for the next word: <br/>- blue (90%) <br/>- dark (8%) <br/>- falling (2%)</p><p>If the AI always picked the highest probability (\"blue\"), it would be extremely boring and repetitive. This is where <strong>Temperature</strong> comes in.</p><p>By increasing the Temperature in the Softmax function, we squash the probabilities closer together (e.g., blue 50%, dark 30%, falling 20%). Now, the AI might randomly pick \"falling\". This is literally how ChatGPT becomes \"creative\"!</p>",
                    "audioText": "When ChatGPT generates text, it calculates the probability of the next word. If it always picked the most likely word, it would be boring. By turning up the Temperature, the probabilities spread out, allowing the AI to pick less obvious words. This is how AI becomes creative.",
                    "audioTextHinglish": "ChatGPT hamesha agla word predict karta hai. Agar woh hamesha sabse high probability wala word chune, toh woh boring ho jayega. Temperature badhane se probabilities spread ho jati hain, jisse AI naye aur creative words chun sakta hai.",
                    "keyInsight": "Temperature controls the balance between predictable (greedy) and creative (random).",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "4 Questions",
                    "narrative": "<p>Test your understanding of Probability, Softmax, and Temperature.</p>",
                    "audioText": "Test your understanding of Probability, Softmax, and Temperature.",
                    "audioTextHinglish": "Probability, Softmax, aur Temperature par apna knowledge test karein.",
                    "keyInsight": "Probability is the true language of machine learning.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "Why does a self-driving car use probability instead of absolute rules?",
                                "options": ["Because probability makes the car drive faster", "Because the real world is messy and unpredictable, requiring a balancing act of percentages", "Because absolute rules take up too much computer memory", "Because cameras can only capture percentages"],
                                "correct": 1
                            },
                            {
                                "q": "What do we call the raw, messy mathematical numbers output by the AI before they are turned into percentages?",
                                "options": ["Derivatives", "Logits", "Gradients", "Tensors"],
                                "correct": 1
                            },
                            {
                                "q": "What is the primary purpose of the Softmax function?",
                                "options": ["To lower the temperature of the server", "To force raw, messy numbers to add up perfectly to 100% probability", "To calculate the derivative of the error", "To convert images into text"],
                                "correct": 1
                            },
                            {
                                "q": "If you increase the 'Temperature' setting in ChatGPT, what happens to its text generation?",
                                "options": ["It becomes extremely repetitive and predictable", "It crashes the application", "It becomes more creative and less predictable by spreading out the probabilities", "It translates the text into a different language"],
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
        print(f"Error seeding AI Masterclass Part 6: {e}")
        db.rollback()
    finally:
        db.close()
