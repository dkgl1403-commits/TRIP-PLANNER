import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part14():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11: return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject: return

        topics = [
            {
                "name": "The Infrastructure Layer",
                "config": {
                    "parts": [
                        {
                            "title": "The Physical Reality of the Cloud",
                            "readingTime": "~3 min read",
                            "narrative": "<p>When we talk about the \"Cloud,\" we imagine something ethereal and weightless. But the Cloud is actually just thousands of massive, heavily fortified concrete buildings scattered across the globe.</p><p>By 2026, AI has placed an unprecedented strain on the world's infrastructure. Training a frontier model like OpenAI's o3 requires clusters of 100,000+ NVIDIA GPUs running at full throttle for months. These chips run so hot that traditional air cooling is no longer enough; data centers now rely on liquid cooling, pumping chilled water directly across the silicon.</p>",
                            "audioText": "The Cloud is actually made of massive concrete buildings. By 2026, AI has strained global infrastructure, requiring 100,000 GPU clusters and intense liquid cooling.",
                            "audioTextHinglish": "Cloud asal mein bade concrete buildings hote hain. 2026 tak AI ne itna load badha diya hai ki ab 100,000 GPUs ko thanda rakhne ke liye liquid cooling chahiye.",
                            "keyInsight": "The ethereal 'Cloud' is actually bound by harsh physical constraints: land, steel, copper, and water.",
                            "widgetType": "DataCenterAnatomyWidget",
                            "widgetData": {}
                        },
                        {
                            "title": "The Power Wall",
                            "readingTime": "~4 min read",
                            "narrative": "<p>The biggest bottleneck to AI scaling isn't data or chips anymore—it's electricity. A single AI data center can consume as much power as a small city (hundreds of Megawatts). Tech giants are now directly funding nuclear power plants (like Microsoft reviving Three Mile Island) and investing in geothermal and solar to secure enough energy.</p><p>We have hit the <strong>Power Wall</strong>: we can build more chips, but we can't find enough electricity on the grid to turn them on.</p>",
                            "audioText": "The biggest bottleneck to AI scaling is electricity. A single data center uses as much power as a city, forcing tech giants to fund nuclear power plants.",
                            "audioTextHinglish": "AI ke liye sabse badi problem ab electricity hai. Ek data center ek shehar jitni power leta hai, isiliye companies ab nuclear plants fund kar rahi hain.",
                            "keyInsight": "Electricity, not compute, has become the hard limit on how fast Artificial Intelligence can scale.",
                            "widgetType": None,
                            "widgetData": {}
                        }
                    ]
                }
            },
            {
                "name": "Embodied Robotics",
                "config": {
                    "parts": [
                        {
                            "title": "A Brain Needs a Body",
                            "readingTime": "~3 min read",
                            "narrative": "<p>For decades, robots were \"blind.\" They were hardcoded to execute specific, rigid motions (like car assembly line arms). If a bolt was 1 inch out of place, the robot would break.</p><p>By 2026, everything changed. Companies took the \"brains\" of Large Vision-Language Models (like GPT-4o or Gemini) and stuffed them into humanoid bodies. Instead of hardcoding movements, robots now \"watch\" human videos and learn how to move via neural networks, adapting to mistakes in real-time.</p>",
                            "audioText": "For decades, robots were blind and rigidly hardcoded. By 2026, companies put vision-language models into humanoid bodies, allowing them to learn fluid movement from watching humans.",
                            "audioTextHinglish": "Pehle robots andhe aur hardcoded hote the. 2026 mein vision-language models ko robots mein daala gaya jisse wo insaano ko dekh kar movement sikhne lage.",
                            "keyInsight": "Neural networks allow robots to navigate chaotic real-world environments without requiring hardcoded instructions.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "The 2026 Roster: Optimus, Figure, and Atlas",
                            "readingTime": "~3 min read",
                            "narrative": "<p>Three titans dominate the embodied AI space:</p><ul><li><strong>Tesla Optimus:</strong> Leveraging Tesla's massive self-driving compute clusters, Optimus is designed to be the mass-market, affordable humanoid worker.</li><li><strong>Figure 01 & 02:</strong> Powered by OpenAI's reasoning models, these robots can hold real-time conversations while performing complex manufacturing tasks for BMW.</li><li><strong>Boston Dynamics' Atlas (Electric):</strong> The most physically capable and agile robot, capable of performing backflips and recovering from any fall, now entirely driven by AI instead of hydraulics.</li></ul>",
                            "audioText": "The embodied AI space is led by Tesla Optimus for mass manufacturing, Figure 02 powered by OpenAI, and the hyper-agile electric Atlas by Boston Dynamics.",
                            "audioTextHinglish": "Robotics mein Tesla Optimus, OpenAI powered Figure 02, aur Boston Dynamics ka electric Atlas lead kar rahe hain.",
                            "keyInsight": "The race for the ultimate AI humanoid is being fought between Tesla, Figure, and Boston Dynamics.",
                            "widgetType": None,
                            "widgetData": {}
                        }
                    ]
                }
            },
            {
                "name": "Real-World Industries",
                "config": {
                    "parts": [
                        {
                            "title": "Medicine & Biology",
                            "readingTime": "~4 min read",
                            "narrative": "<p>AI is solving biology's hardest puzzles. Google DeepMind's <strong>AlphaFold 3</strong> successfully predicted the 3D structures of nearly all proteins known to science, effectively compressing 1,000 years of PhD research into a few months.</p><p>By 2026, generative AI is actively designing new synthetic antibodies and drugs, drastically reducing the time it takes to bring life-saving cures to clinical trials.</p>",
                            "audioText": "Google's AlphaFold predicted the 3D structure of all known proteins. Generative AI is now designing new drugs, drastically speeding up clinical trials.",
                            "audioTextHinglish": "Google ke AlphaFold ne proteins ka 3D structure predict kiya. Ab AI naye drugs design kar raha hai jisse clinical trials fast ho gaye hain.",
                            "keyInsight": "AI is no longer just for software; it is fundamentally accelerating biological discovery and medicine.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "Law & Finance",
                            "readingTime": "~3 min read",
                            "narrative": "<p>In the legal world, AI agents are conducting \"Discovery\"—reading through 10,000 pages of corporate emails in seconds to find the \"smoking gun\" in a lawsuit.</p><p>In finance, algorithmic trading has evolved. AI agents now ingest real-time satellite imagery of crop yields, global news feeds, and SEC filings simultaneously to execute trades before human analysts can even read the headlines.</p>",
                            "audioText": "AI agents in law can read 10,000 pages in seconds to find evidence. In finance, AI ingests satellite imagery and global news to execute hyper-fast trades.",
                            "audioTextHinglish": "Law mein AI agents seconds mein 10,000 pages padh lete hain. Finance mein, AI satellite images aur news padh kar humans se fast trading karta hai.",
                            "keyInsight": "White-collar industries are being automated by AI's ability to instantly synthesize massive datasets.",
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
        print(f"Error seeding AI Masterclass Part 14: {e}")
        db.rollback()
    finally:
        db.close()
