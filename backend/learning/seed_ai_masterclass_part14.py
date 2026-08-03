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
                            "title": "The Brain Gets a Body",
                            "readingTime": "~2 min read",
                            "narrative": "<p>For 70 years, Artificial Intelligence was a ghost trapped inside a glowing screen. It could write symphonies, diagnose cancer, and beat grandmasters at chess — but it couldn't pour a cup of coffee without burning the house down.</p><p>Why? Because the physical world is chaotic. Gravity, friction, and fragile objects don't exist in a text file. <strong>Embodied Robotics</strong> is the science of downloading that brilliant AI brain into a physical shell — giving it eyes to see space, and hands to manipulate reality.</p><p>By 2026, we are witnessing the most dramatic physical transformation of AI since its invention. The ghost has found its body.</p>",
                            "audioText": "For 70 years, AI was brilliant but trapped in a screen. Embodied Robotics is the science of giving that AI a physical body — eyes to see space and hands to manipulate reality.",
                            "audioTextHinglish": "70 saalon tak AI ek screen mein band tha. Embodied Robotics us AI ko ek physical body dene ki science hai — aankhein aur haath jo asal duniya ko samajhein.",
                            "keyInsight": "Intelligence without a body is trapped. Embodied AI is the final bridge between digital brilliance and physical action.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "Moravec's Paradox: The Greatest Irony in Computer Science",
                            "readingTime": "~3 min read",
                            "narrative": "<p>To understand why building robots took so long, we must confront the most famous irony in all of computer science: <strong>Moravec's Paradox</strong>.</p><p><em>The Rule: What is hard for humans is easy for AI. What is easy for humans is nearly impossible for AI.</em></p><p>In the 2010s, it took only a few years to train an AI to pass the Bar Exam and write flawless Python code. But it took billions of dollars and decades of research just to make a robot walk up a flight of stairs — or crack an egg without smashing it.</p><p><strong>Why?</strong> Logic and math are just rules. Humans struggle with them because our brains didn't evolve to do calculus. But we evolved over millions of years to balance on two legs, gauge the weight of a rock, and catch a falling apple. We do physical calculus subconsciously, in milliseconds, across 27 bones and 34 muscles in each hand.</p><p>To a robot, the physics of a sliding rug or a squishy tomato are mathematically terrifying. The friction coefficient of skin on eggshell, the deformation ratio of the shell under pressure, the velocity at which a sphere will slip — a robot must calculate all of this explicitly, in real-time, every single time.</p>",
                            "audioText": "Moravec's Paradox: AI can pass the Bar Exam, but struggled for decades to crack an egg. What is easy for humans is nearly impossible for AI because we evolved millions of years of physical intuition that robots must calculate explicitly.",
                            "audioTextHinglish": "Moravec's Paradox: AI Bar Exam pass kar sakta hai, lekin andon ko todne mein decades lag gaye. Jo humans ke liye aasaan hai wo robots ke liye mathematical nightmare hai kyunki humne millions of years mein physical intuition evolve ki hai.",
                            "keyInsight": "Human physical skills are the hardest things to replicate — they represent millions of years of embedded evolutionary computation.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "Interactive: The Egg Test (Moravec's Paradox Demo)",
                            "readingTime": "Interactive Widget",
                            "narrative": "<p>You are the <strong>Robot Brain</strong>. Use three sliders — Grip Strength, Arm Speed, and Approach Angle — to attempt to pick up an egg.</p><p>The success zone is tiny. Too much grip and you crush it. Too little and it slips. Too fast and you shatter it. A human child does this perfectly in 200ms without thinking. See how many attempts it takes you.</p>",
                            "audioText": "Play as the Robot Brain. Calibrate grip, speed, and angle to pick up an egg. The perfect zone is tiny — demonstrating Moravec's Paradox.",
                            "audioTextHinglish": "Robot Brain banke anday ko uthao. Grip, speed aur angle calibrate karo. Perfect zone bahut chhota hai — Moravec's Paradox ki demonstration.",
                            "keyInsight": "Your hand solved this problem automatically. A robot needs explicit numerical inputs. This is the core challenge of Embodied AI.",
                            "widgetType": "EggTestWidget",
                            "widgetData": {}
                        },
                        {
                            "title": "The Breakthrough: Vision-Language-Action (VLA) Models",
                            "readingTime": "~4 min read",
                            "narrative": "<p>Until roughly 2024, robots were programmed with strict, hard-coded rules — <em>\"Move arm 45 degrees, close pincers 2 inches.\"</em> If someone bumped the table, the robot would blindly grab at empty air.</p><p>Then came the ChatGPT moment for robotics: <strong>The VLA Foundation Model</strong>.</p><p><strong>VLA = Vision (Eyes) + Language (Brain) + Action (Muscles)</strong></p><p>Instead of hard-coding movements, we now use the exact same Transformer architecture as Large Language Models. But instead of predicting the next <em>word</em> in a sentence, a VLA model:<br/>1. Looks at a live camera feed (<strong>Vision</strong>)<br/>2. Listens to a human command (<strong>Language</strong>)<br/>3. Predicts the exact motor torques required to move its joints (<strong>Action</strong>)</p><p>The result is revolutionary: <strong>You don't program the robot anymore. You just talk to it.</strong> You say, <em>\"Clean up this spilled cereal,\"</em> and the VLA model autonomously figures out how to pick up a sponge, how hard to press, and where to wipe.</p><p><strong>Physical Intelligence (Pi) — The π0 Model (2024-2026):</strong> This company released the most significant robotics foundation model to date. π0 is an <em>Omni-Body</em> brain — the exact same AI model can be downloaded into a robotic arm, a quadruped dog, or a full humanoid robot, and instantly know how to control it. One brain. Any body.</p>",
                            "audioText": "VLA models are the ChatGPT moment for robotics. Vision plus Language plus Action means you just tell the robot what to do — it figures out the motor physics by itself. Physical Intelligence's pi-zero model works in any robot body.",
                            "audioTextHinglish": "VLA models robotics ka ChatGPT moment hain. Vision plus Language plus Action — bas robot ko bolo aur wo khud motor physics figure out karta hai. Pi-zero model kisi bhi robot body mein kaam karta hai.",
                            "keyInsight": "VLA models eliminated hard-coded robot programming. The robot now understands language and translates intent into physical movement.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "The Training Grounds: World Models & Simulation",
                            "readingTime": "~3 min read",
                            "narrative": "<p>How do you train a massive VLA model? You can't just have robots breaking millions of plates in a physical lab — that would take centuries and cost billions.</p><p>Before touching the real world, robots train inside <strong>World Models</strong> — highly advanced physics simulation engines (like NVIDIA Isaac Sim) that simulate gravity, friction, light, and material deformation with near-perfect accuracy. The robot \"imagines\" the consequences of its actions inside this learned virtual world before ever moving a physical motor.</p><p>In a single afternoon, a robot can run through 10 million simulated scenarios: folding laundry in different lighting conditions, picking up objects of varying weights, navigating floors covered in different materials. What would take a human 1,000 years of practice takes an AI 6 hours in simulation.</p><p>After simulation training, the robot is transferred to the real world — a process called <strong>Sim-to-Real Transfer</strong>. The gap between simulated and real physics is the biggest remaining technical challenge in robotics research today.</p>",
                            "audioText": "Robots train inside World Models — advanced physics simulations that let them practice millions of scenarios in hours. After simulation, the knowledge transfers to the real world in a process called Sim-to-Real Transfer.",
                            "audioTextHinglish": "Robots World Models mein train karte hain — advanced physics simulations jahan wo ghanton mein millions of scenarios practice karte hain. Phir yeh knowledge real world mein transfer hoti hai jise Sim-to-Real Transfer kehte hain.",
                            "keyInsight": "World Models let robots train for millions of years of experience in just hours — then transfer that knowledge to physical metal and motors.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "The 2026 Landscape: Factories, Healthcare & Defense",
                            "readingTime": "~4 min read",
                            "narrative": "<p>By 2026, the Embodied AI market is on track to reach <strong>$23 billion by 2030</strong>, growing at nearly 40% per year. Three sectors are leading the charge:</p><p><strong>1. Industrial Factories & Logistics:</strong> There are currently 600,000+ unfilled manufacturing jobs in the U.S. alone. Tesla's Optimus and Figure AI's humanoids are being deployed in automotive plants and warehouses to fill this gap — not replacing humans, but augmenting an already strained workforce. Using VLA models, they work safely <em>alongside</em> humans, adapting in real-time to changing conditions. Boston Dynamics' Spot, trained via thousands of simulations, was deployed to walk on slippery brewery floors via a simple software update — zero hardware changes.</p><p><strong>2. Healthcare:</strong> Embodied AI is moving from decision-support screens to physical patient interaction. Multimodal sensor fusion — combining vision, force/torque sensors, depth cameras, and physiological signals — allows medical robots to assist in surgery and patient care. Toyota's robotics division focuses specifically on elderly care and mobility solutions. However, the ethics are complex: when an AI physically touches a patient, accountability and the \"black box\" problem become life-or-death issues.</p><p><strong>3. Defense:</strong> Boston Dynamics robots navigate unstructured terrain (rubble, mud, collapsed structures) that wheeled vehicles cannot reach. The focus is shifting from remotely piloted drones to fully autonomous agents that can perceive environments, make tactical decisions, and adapt in real-time. This raises the most serious ethical concern: <em>machines that can kill without a human pulling a trigger</em>.</p>",
                            "audioText": "By 2030, Embodied AI will be a $23 billion market. Factories use humanoid robots to fill 600,000 unfilled jobs. Healthcare robots use sensor fusion for patient care. Defense robots navigate terrain no wheeled vehicle can reach.",
                            "audioTextHinglish": "2030 tak Embodied AI ek 23 billion dollar market hoga. Factories mein 600,000 unfilled jobs ke liye humanoid robots aa rahe hain. Healthcare robots sensor fusion use karte hain. Defense robots wahan jaate hain jahan wheeled vehicles nahi ja sakte.",
                            "keyInsight": "The 3 sectors deploying Embodied AI fastest are Factories, Healthcare, and Defense — each with unique technical and ethical challenges.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "Space, Agriculture & Disaster Response",
                            "readingTime": "~4 min read",
                            "narrative": "<p><strong>Space Exploration — The High-Latency Frontier:</strong> On Mars, signals take up to 22 light-minutes to arrive. If a rover is about to drive off a cliff, your \"Stop\" command arrives 44 minutes too late. Space robots <em>must</em> be fully autonomous Embodied Agents. NASA's Valkyrie humanoid robot is designed to build solar arrays and repair habitats before humans even arrive. The challenge: modern AI chips (GPUs) fry in high-radiation environments, forcing engineers to run hyper-compressed AI models on ancient, radiation-hardened silicon.</p><p><strong>Precision Agriculture — The Delicate Harvest:</strong> A factory bolt is always the same shape. A ripe strawberry is not. Traditional machines blindly harvest everything, crushing unripe fruit. Embodied AI robots use VLA models to look under leaves, determine ripeness from a fruit's exact color spectrum, and use soft-robotic grippers to pluck it without bruising. Solar-powered micro-tractors autonomously wander fields shooting weeds with precisely aimed lasers — no herbicide sprayed on crops.</p><p><strong>Disaster Response & Search/Rescue:</strong> When a building collapses, environments become too dangerous for humans. Quadruped robots (like Boston Dynamics' Spot) carry thermal cameras and LiDAR, dynamically calculating structural integrity of shifting concrete in milliseconds to find survivors without triggering secondary collapses. Drone swarms deploy across earthquake zones, communicating via mesh networks, autonomously dividing search grids without a central human commander.</p>",
                            "audioText": "Space robots must be fully autonomous because Mars is 22 light-minutes away. Agricultural AI robots identify individual ripe strawberries and zap weeds with lasers. Disaster response drones form swarms to search collapse sites faster than any human team.",
                            "audioTextHinglish": "Space robots poori tarah autonomous hone chahiye kyunki Mars 22 light-minute door hai. Agricultural AI robots alag alag pakke strawberries identify karte hain aur weeds par laser chalate hain. Disaster drones swarm mein collapse sites search karte hain.",
                            "keyInsight": "Space, agriculture, and disaster response are the three 'extreme environments' where Embodied AI is not optional — it is the only viable solution.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "Interactive: The Laser Weeder (Precision Agriculture Demo)",
                            "readingTime": "Interactive Widget",
                            "narrative": "<p>You are the <strong>Vision Model</strong> guiding a laser weeding robot across a crop field. Click on the weeds (🌿) before the timer runs out — but don't click the crops (🌱) or you destroy the harvest.</p><p>Try increasing the speed slider to simulate the 50fps processing requirement of a real VLA system. See how quickly your human precision degrades under pressure, and why this task requires dedicated AI.</p>",
                            "audioText": "Play as the Vision Model in a laser weeding robot. Click weeds, avoid crops, race the clock. Experience why 50fps VLA processing is needed for agriculture.",
                            "audioTextHinglish": "Laser weeding robot mein Vision Model banke khelo. Weeds click karo, crops bachao, clock se race karo. Samjho kyun agriculture ke liye 50fps VLA processing chahiye.",
                            "keyInsight": "Every plant is unique. This variability is why precision agriculture requires VLA models rather than simple mechanical harvesters.",
                            "widgetType": "LaserWeederWidget",
                            "widgetData": {}
                        },
                        {
                            "title": "The Domestic Holy Grail & Home Assistants",
                            "readingTime": "~3 min read",
                            "narrative": "<p>While factories are somewhat predictable, the human home is the ultimate chaotic environment. There are pets, scattered toys, stairs, constantly rearranged furniture, and 10,000 different types of objects — none of which were ever programmed into the robot.</p><p>To fold a shirt, a robot must understand the physics of fabric — a material that constantly deforms into infinite shapes. To wash dishes, it must know the difference between scrubbing a cast-iron pan and shattering a wine glass. These are tasks that require understanding material science, object affordances, and human intent simultaneously.</p><p><strong>Imitation Learning:</strong> The current state-of-the-art approach for domestic tasks. A human puts on a VR headset and physically controls a robot arm to do the dishes 1,000 times, cooking dinner 500 times, folding laundry 2,000 times. Every movement is recorded and used as training data. The AI then generalizes from these demonstrations to handle novel objects and situations it has never seen before.</p><p>The domestic robot is estimated to be the biggest consumer product market of the 21st century — potentially a $1 trillion industry. Every major tech company is racing to get there first.</p>",
                            "audioText": "The home is the ultimate chaos environment for robots. Imitation Learning has humans control robots in VR thousands of times, creating training data for the AI to generalize. A domestic robot assistant is estimated to become a $1 trillion market.",
                            "audioTextHinglish": "Ghar robots ke liye ultimate chaos environment hai. Imitation Learning mein humans VR mein hazaron baar robot control karte hain — AI phir naye objects handle karna seekh leta hai. Domestic robot assistant ek $1 trillion market ban sakta hai.",
                            "keyInsight": "The hardest robotics task is not space or surgery — it is folding laundry in a human home. Fabric physics is robotics' unsolved frontier.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "Swarm Intelligence: The Hive Mind",
                            "readingTime": "~4 min read",
                            "narrative": "<p>If you send a $10 million humanoid robot into a burning building and the roof collapses, the mission is over. But what if you send 1,000 mechanical beetles? If 500 are crushed, the hive doesn't care. It simply reorganizes, calculates the new parameters, and keeps moving.</p><p><strong>Swarm Robotics</strong> is the AI equivalent of an ant colony or a flock of starlings — a system where there is no CEO, no central server, and no single point of failure.</p><p>The secret? Each individual drone runs a tiny AI model and obeys only three mathematical rules — the <strong>Boids Algorithm</strong> (invented by Craig Reynolds in 1987):</p><ul><li><strong>Separation:</strong> Don't crash into the agent next to me.</li><li><strong>Alignment:</strong> Fly in the same general direction as the agents near me.</li><li><strong>Cohesion:</strong> Stay close to the center of my local group.</li></ul><p>By running these three micro-decisions 100 times per second, massive, fluid, intelligent behavior <em>emerges</em> from individually simple units. There is no map. There is no plan. The intelligence is a property of the system, not any single unit.</p><p><strong>Mesh Networking — Digital Pheromones:</strong> Drone swarms communicate like ants leaving pheromone trails. Instead of chemicals, they bounce Wi-Fi signals off each other. If Drone #45 finds a trapped survivor, it pings Drone #46, which pings Drone #47 — passing data backward through the swarm like a digital bucket brigade, reaching ground control in milliseconds without any single relay point.</p>",
                            "audioText": "Swarm Robotics uses hundreds of cheap drones instead of one expensive robot. No central controller. Just three rules: Separation, Alignment, Cohesion. Mesh networking passes data through the swarm like digital pheromones.",
                            "audioTextHinglish": "Swarm Robotics mein ek expensive robot ki jagah hundreds of cheap drones use karte hain. Koi central controller nahi. Bas teen rules: Separation, Alignment, Cohesion. Mesh networking se data digital pheromones ki tarah swarm mein pass hota hai.",
                            "keyInsight": "Swarm intelligence is the most resilient AI architecture ever designed — no single point of failure, and the system gets smarter the more units you add.",
                            "widgetType": None,
                            "widgetData": {}
                        },
                        {
                            "title": "Interactive: The Hive Mind Simulation",
                            "readingTime": "Interactive Widget",
                            "narrative": "<p>Watch a live drone swarm in action. Every triangle is an autonomous drone following only three local rules — <strong>Separation, Alignment, and Cohesion</strong>. No central server. No map. Pure emergent intelligence.</p><p>Adjust the sliders to change drone behavior. Then hit <strong>Introduce Hazard</strong> to simulate a bomb destroying 35% of the swarm. Watch what happens: the surviving drones don't fail. They autonomously reorganize and continue the mission — proving the absolute resilience of decentralized AI.</p>",
                            "audioText": "Watch a live Boids swarm. Adjust Separation and Cohesion to change behavior. Hit Introduce Hazard to destroy 35 percent of drones and watch the swarm self-heal with no central command.",
                            "audioTextHinglish": "Live Boids swarm dekhein. Separation aur Cohesion adjust karein. Introduce Hazard dabayein aur 35 percent drones destroy karein — dekhein swarm khud hi heal ho jaata hai bina kisi central command ke.",
                            "keyInsight": "Decentralized AI swarms are unkillable. Destroy any part of the system and the rest reorganizes. This is the future of disaster response and military operations.",
                            "widgetType": "HiveMindWidget",
                            "widgetData": {}
                        },
                        {
                            "title": "The Embodied Threat: Ethics of Physical AI",
                            "readingTime": "~3 min read",
                            "narrative": "<p>When an AI lives in your web browser, its hallucinations are annoying. When an AI is carrying a kitchen knife in your house, a hallucination is <strong>lethal</strong>.</p><p><strong>The Sandbox Problem:</strong> We cannot put an Embodied Robot inside a \"Deterministic Gateway\" (an approval system) because physical movement requires split-second reactions. If a child runs in front of a robot carrying hot soup, the robot cannot wait 2 seconds for a safety system to \"approve\" its decision to stop. It must process and react on the edge — locally, in its own metal head, in 30 milliseconds.</p><p><strong>The Defense Dilemma:</strong> Autonomous weapons raise the concept of \"digital dehumanization\" — machines that profile and process humans as data points without understanding the value of human life. A machine cannot grasp the ethical nuances required by international humanitarian law to distinguish civilians from combatants in chaotic, unpredictable situations. The question is no longer technical. It is entirely moral.</p><p><strong>The Accountability Vacuum:</strong> As robots make independent physical decisions, a critical legal question emerges: if a robot makes a choice that causes harm, who is responsible? The programmer? The manufacturer? The operator? The AI itself? Current law has no answer.</p><p><strong>The Hardware Safety Solution:</strong> The most promising approach is building physical safety limits directly into the robot's motors — ensuring that no matter what the AI model tells the robot to do, the hardware physically cannot swing fast enough or squeeze hard enough to harm a human. Intelligence is in the software. Safety must be in the steel.</p>",
                            "audioText": "When AI carries a knife, hallucinations are lethal. Embodied robots cannot wait for safety approvals — they must react in 30 milliseconds. The defense dilemma, accountability vacuum, and hardware safety limits are the defining ethical challenges of the physical AI era.",
                            "audioTextHinglish": "Jab AI chhuri pakde, to hallucinations khatarnak hain. Embodied robots safety approvals ka wait nahi kar sakte — 30 milliseconds mein react karna hota hai. Defense dilemma, accountability vacuum, aur hardware safety limits physical AI era ke sabse bade ethical challenges hain.",
                            "keyInsight": "Physical AI safety cannot be patched with software. It must be engineered directly into the motors, joints, and actuators as inviolable hardware constraints.",
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
