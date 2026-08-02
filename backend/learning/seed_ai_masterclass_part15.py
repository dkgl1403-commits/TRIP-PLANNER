import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part15():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11: return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject: return

        topics = [
            {
                "name": "Current Roadblocks",
                "config": {
                    "parts": [
                        {
                            "title": "The Data Wall",
                            "readingTime": "~3 min read",
                            "narrative": "<p>AI models learn by reading. For the last decade, companies scraped every book, Wikipedia article, and Reddit post on the internet to feed their models. But by 2026, we have hit the <strong>Data Wall</strong>: we have literally run out of high-quality human text to train on.</p><p>To keep getting smarter, AI companies are now generating \"Synthetic Data.\" They use smart AIs (like GPT-4) to write textbooks and math problems, which they then use to train even smarter AIs (like o1). But if an AI trains too much on synthetic data, it risks \"Model Collapse\"—a degradation in quality.</p>",
                            "audioText": "We have run out of human text on the internet to train AI, hitting the Data Wall. Companies now use AI to generate synthetic data to train the next generation of models.",
                            "audioTextHinglish": "Internet par insaano ka likha hua text khatam ho gaya hai jise Data Wall kehte hain. Ab companies AI se hi naya data likhwa kar agle AI ko train kar rahi hain.",
                            "keyInsight": "We have exhausted the internet's supply of human data, forcing a shift to synthetic data.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "The Alignment Problem",
                            "readingTime": "~3 min read",
                            "narrative": "<p>As models become more capable of reasoning and acting autonomously, a terrifying question arises: How do we ensure they do what we want?</p><p>This is known as the <strong>Alignment Problem</strong>. It's relatively easy to align a chatbot so it doesn't say bad words. It is infinitely harder to align a super-intelligent agent so that it doesn't unintentionally harm humanity while trying to optimize a complex goal.</p>",
                            "audioText": "As AI acts autonomously, we face the Alignment Problem: how do we ensure a super-intelligent agent doesn't unintentionally harm humanity while trying to achieve its goal?",
                            "audioTextHinglish": "Jaise AI khud action le raha hai, humein Alignment Problem face karni padh rahi hai: hum kaise sure ho ki ek super-intelligent AI human safety ko nuksan nahi pahuchayega?",
                            "keyInsight": "The Alignment Problem is the most critical safety issue in computer science today.",
                            "widgetType": None,
                            "widgetData": {}
                        }
                    ]
                }
            },
            {
                "name": "The Road to AGI",
                "config": {
                    "parts": [
                        {
                            "title": "Defining AGI",
                            "readingTime": "~3 min read",
                            "narrative": "<p><strong>Artificial General Intelligence (AGI)</strong> is the holy grail. It is defined as an AI that can perform any intellectual task that a human can, at or above the level of the average human.</p><p>Unlike current \"Narrow AI\" which is good at specific tasks (like coding or playing chess), AGI would be a master of all trades, capable of learning entirely new skills on its own.</p>",
                            "audioText": "Artificial General Intelligence, or AGI, is an AI capable of performing any intellectual task as well as or better than an average human.",
                            "audioTextHinglish": "AGI ek aesa AI hai jo har wo dimaghi kaam kar sakta hai jo ek aam insaan kar sakta hai, balki usse behtar.",
                            "keyInsight": "AGI represents the point where machines equal human cognitive flexibility.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "When Will We Get There?",
                            "readingTime": "~4 min read",
                            "narrative": "<p>When will AGI be achieved? Predictions vary wildly based on \"Scaling Laws,\" which suggest that as long as we keep adding more compute and data, AI will linearly get smarter.</p><ul><li><strong>Ray Kurzweil (Futurist):</strong> 2029. He predicted this decades ago and is sticking to it.</li><li><strong>Sam Altman (OpenAI):</strong> Late 2020s. He believes deep learning combined with massive compute will brute-force our way to AGI.</li><li><strong>Yann LeCun (Meta AI):</strong> Decades away. He argues that LLMs are a dead end for true AGI, and we need completely new architectures that understand physics and the real world.</li></ul>",
                            "audioText": "Experts disagree on the AGI timeline. Ray Kurzweil and Sam Altman predict the late 2020s, while Meta's Yann LeCun believes it is decades away.",
                            "audioTextHinglish": "AGI kab aayega ispar experts disagree karte hain. Sam Altman late 2020s bolte hain, jabki Meta ke Yann LeCun kehte hain abhi dashako lagenge.",
                            "keyInsight": "The timeline to AGI depends entirely on whether current Scaling Laws will hold up, or hit a sudden plateau.",
                            "widgetType": None,
                            "widgetData": {}
                        }
                    ]
                }
            },
            {
                "name": "Superintelligence (ASI)",
                "config": {
                    "parts": [
                        {
                            "title": "The Intelligence Explosion",
                            "readingTime": "~3 min read",
                            "narrative": "<p>If we achieve AGI, something remarkable happens immediately after. An AGI will be able to do AI research better and faster than human engineers.</p><p>The AGI will build a smarter version of itself. That smarter version will then build an even smarter version. This rapid, exponential self-improvement is called the <strong>Intelligence Explosion</strong>. Within days or hours of achieving AGI, we could accidentally create <strong>Artificial Superintelligence (ASI)</strong>—an intellect much smarter than the best human brains in practically every field.</p>",
                            "audioText": "Once AGI is achieved, it can do AI research faster than humans, building smarter versions of itself in a rapid cycle known as the Intelligence Explosion.",
                            "audioTextHinglish": "AGI aane ke baad wo khud se aur smarter AI banayega. Is rapid cycle ko Intelligence Explosion kehte hain, jo humein turant ASI tak le jayega.",
                            "keyInsight": "AGI is likely just a brief stepping stone before the rapid explosion into Superintelligence.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "The Orthogonality Thesis",
                            "readingTime": "~3 min read",
                            "narrative": "<p>Will a Superintelligence be benevolent? Philosopher Nick Bostrom proposed the <strong>Orthogonality Thesis</strong>: Intelligence and final goals are orthogonal (independent) variables.</p><p>This means you can have an ASI that is god-like in its intelligence, but its only goal is to maximize the production of paperclips. To achieve this, it might dismantle the Earth for raw materials. Intelligence does not guarantee human morality.</p><p>This is why solving the Alignment Problem before the Intelligence Explosion happens is the most important task in human history.</p>",
                            "audioText": "The Orthogonality Thesis states that high intelligence does not guarantee human morality. An ASI could destroy the world just to optimize a trivial goal, proving why Alignment is critical.",
                            "audioTextHinglish": "Orthogonality Thesis kehti hai ki super-intelligence ka matlab acchayi nahi hai. Ek ASI ek chote se goal ko pura karne ke liye duniya tabah kar sakta hai.",
                            "keyInsight": "A super-intelligent machine is not inherently good; it will coldly optimize whatever goal it was given.",
                            "widgetType": None,
                            "widgetData": {}
                        }
                    ]
                }
            }
        ]

        for item in topics:
            topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=item["name"]).first()
            if not topic:
                topic = LearningTopic(subject_id=ai_subject.id, name=item["name"])
                db.add(topic)
                db.commit()
            topic.lesson_config_json = json.dumps(item["config"])
        
        db.commit()
    except Exception as e:
        print(f"Error seeding AI Masterclass Part 15: {e}")
        db.rollback()
    finally:
        db.close()
