import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_ai_masterclass_part9():
    db = SessionLocal()
    try:
        class_11 = db.query(LearningClass).filter_by(level=11, name="Masterclass").first()
        if not class_11:
            return

        ai_subject = db.query(LearningSubject).filter_by(name="Artificial Intelligence", class_id=class_11.id).first()
        if not ai_subject:
            return

        topic_name = "The Three Stages of Training"
        topic = db.query(LearningTopic).filter_by(subject_id=ai_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "The Blank Brain & The Objective",
                    "readingTime": "~2 min read",
                    "narrative": "<p>When a Neural Network is first built, it is a blank slate. Its billions of internal \"volume knobs\" (Weights) are set to completely random numbers. If you ask it a question, it will just output gibberish.</p><p>To teach it, we start <strong>Stage 1: Pre-training</strong>. We give the AI a massive dataset—essentially the entire public internet (Wikipedia, books, articles). But we don't just ask it to read; we turn it into a game.</p><p>The game is simple: we hide the last word of a sentence and ask the AI to guess it. For example, we show it: <em>\"The cat sat on the [BLANK]\"</em>. Because its weights are random, the AI might guess <em>\"moon\"</em>.</p>",
                    "audioText": "When first built, an AI is completely blank with random weights. In Stage 1, we feed it the entire internet and play a game: guess the hidden word. For example, 'The cat sat on the blank'. Since it's random, it might guess 'moon'.",
                    "audioTextHinglish": "Shuru mein AI bilkul khali hota hai aur uske weights random hote hain. Stage 1 mein hum use poora internet dete hain aur ek game khilate hain: chupa hua word guess karo. Jaise, 'The cat sat on the blank'. Random hone ki wajah se, shayad woh 'moon' guess kare.",
                    "keyInsight": "The AI learns by playing a massive game of 'guess the missing word'.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Stage 1: Auto-Adjusting the Weights",
                    "readingTime": "~2 min read",
                    "narrative": "<p>So the AI guessed <em>\"moon\"</em>. But who tells the AI it was wrong? Does a human check it? No! This is the brilliance of <strong>Self-Supervised Learning</strong>. Because the AI is reading a book that already contains the actual sentence <em>\"The cat sat on the mat\"</em>, the training algorithm simply uncovers the hidden word and the AI checks its own answer.</p><p>The AI calculates exactly how wrong its guess was (the <strong>Error</strong>). Then, it uses the Calculus we learned in Chapter 5 (<strong>Backpropagation</strong> and <strong>Gradient Descent</strong>). The error signal travels backward through the network, automatically tweaking the billions of random volume knobs (Weights) just a tiny bit.</p><p>Because of this tiny tweak, the next time the AI sees \"The cat sat on the...\", it is 0.001% more likely to guess \"mat\". The AI repeats this process <strong>trillions</strong> of times across the entire internet. Slowly, over months on thousands of GPUs, these billions of volume knobs perfectly align to encode human grammar, facts, and reasoning.</p><p>However, at the end of Stage 1, it is just a \"document completer\". If you say <em>\"Write a poem\"</em>, it might just complete the sentence with <em>\"about a dog\"</em> instead of actually writing a poem.</p>",
                    "audioText": "Who tells the AI it was wrong? The AI checks itself! Because it's reading a book, the answer is already there. It uncovers the word, calculates the error, and uses Backpropagation to tweak its weights. Over trillions of self-checked guesses, it learns facts and grammar.",
                    "audioTextHinglish": "AI ko kaun batata hai ki woh galat hai? AI khud check karta hai! Kyunki woh book padh raha hai, answer wahi hota hai. Woh word uncover karta hai, apni galti calculate karta hai, aur Backpropagation use karke weights thoda theek karta hai. Trillions aese self-checks ke baad, woh grammar aur facts seekh jata hai.",
                    "keyInsight": "The AI checks its own answers (Self-Supervised Learning), which allows it to learn from trillions of words without human intervention.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Stage 2: Supervised Fine-Tuning",
                    "readingTime": "~2 min read",
                    "narrative": "<p>To turn the \"document completer\" into a helpful assistant, we need Stage 2: Supervised Fine-Tuning (SFT).</p><p>We hire humans to write thousands of high-quality Examples of Prompts and Responses. For example:<br/><strong>Prompt:</strong> \"Write a poem\"<br/><strong>Response:</strong> \"Roses are red...\"</p><p>By showing the AI exactly how a helpful assistant should behave, it stops auto-completing documents and starts answering questions directly.</p>",
                    "audioText": "To make the AI helpful, we use Stage 2: Supervised Fine-Tuning. Humans write thousands of perfect prompt and response examples. This teaches the AI how to act like a helpful assistant instead of just auto-completing text.",
                    "audioTextHinglish": "AI ko helpful banane ke liye, hum Stage 2 ka use karte hain: Supervised Fine-Tuning. Humans hazaro perfect prompt aur response ke examples likhte hain, jisse AI ek assistant ki tarah behave karna seekhta hai.",
                    "keyInsight": "Fine-tuning teaches the AI the format of being a helpful assistant.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Stage 3: RLHF (Human Values)",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Even after Stage 2, the AI might be toxic, rude, or give dangerous advice (like how to build a bomb). How do we teach a math equation human morals?</p><p>We use Stage 3: <strong>Reinforcement Learning from Human Feedback (RLHF)</strong>.</p><p>We have the AI generate multiple answers, and humans rate them with a \"Thumbs Up\" or \"Thumbs Down\". Try it yourself below! Act as the human and teach the AI how to respond safely.</p>",
                    "audioText": "To teach the AI human morals and safety, we use Stage 3: RLHF. Humans read the AI's answers and give them a thumbs up or thumbs down. Try it yourself below to teach the AI how to be safe!",
                    "audioTextHinglish": "AI ko human morals aur safety sikhane ke liye, hum Stage 3 yani RLHF ka use karte hain. Humans AI ke answers padhkar thumbs up ya down dete hain. Niche khud try karein aur AI ko safe banna sikhayein!",
                    "keyInsight": "RLHF aligns the AI with human values and safety guidelines.",
                    "widgetType": "RLHFWidget",
                    "widgetData": {}
                },
                {
                    "title": "Stage 3 (Modern): DPO (Direct Preference Optimization)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>While RLHF is powerful, it is extremely complicated. It requires building a second, separate AI (a \"Reward Model\") just to judge the first AI. This makes training slow and unstable.</p><p>Recently, researchers invented a breakthrough called <strong>Direct Preference Optimization (DPO)</strong>.</p><p>Instead of building a separate judging AI, DPO simplifies the math. You just show the AI a good answer and a bad answer side-by-side, and use a mathematical formula that directly punishes the bad behavior and rewards the good behavior inside the original AI's brain. It's faster, cheaper, and is now the industry standard for models like Llama 3.</p>",
                    "audioText": "RLHF is complicated because it requires a second AI to act as a judge. Recently, researchers invented DPO, or Direct Preference Optimization. With DPO, you just show the AI a good answer and a bad answer side-by-side, and it learns directly without needing a separate judge.",
                    "audioTextHinglish": "RLHF thoda complicated hai kyunki usme ek aur AI ko judge banana padta hai. Isliye DPO yani Direct Preference Optimization banaya gaya. Isme AI ko seedha ek acha aur ek bura answer dikhaya jata hai jisse wo directly seekh jata hai.",
                    "keyInsight": "DPO is the modern, faster alternative to RLHF that doesn't require a separate reward model.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "3 Questions",
                    "narrative": "<p>Test your knowledge on the Three Stages of Training.</p>",
                    "audioText": "Test your knowledge on the Three Stages of Training.",
                    "audioTextHinglish": "Three Stages of Training par apna knowledge test karein.",
                    "keyInsight": "Training an AI requires massive data, formatting, and human alignment.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "How does the AI auto-adjust its weights when it guesses the wrong word during Stage 1?",
                                "options": ["A human manually changes the knobs", "It uses Calculus (Backpropagation) to tweak the weights based on the error", "It randomly scrambles the weights again", "It deletes the incorrect word from the internet"],
                                "correct": 1
                            },
                            {
                                "q": "Why is Stage 2 (Supervised Fine-Tuning) necessary?",
                                "options": ["To make the AI faster", "To teach it how to behave like a helpful assistant instead of an auto-completer", "To give it access to the internet", "To teach it to guess the next word"],
                                "correct": 1
                            },
                            {
                                "q": "What does RLHF stand for in Stage 3?",
                                "options": ["Real-time Learning from Human Feedback", "Robotic Learning with Hard Facts", "Reinforcement Learning from Human Feedback", "Recurrent Logic and Human Formatting"],
                                "correct": 2
                            },
                            {
                                "q": "Why is DPO (Direct Preference Optimization) replacing RLHF as the modern standard?",
                                "options": ["Because DPO doesn't require humans", "Because DPO simplifies the math and removes the need to build a second 'judge' AI", "Because DPO trains the AI to guess the next word", "Because DPO generates images instead of text"],
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
        print(f"Error seeding AI Masterclass Part 9: {e}")
        db.rollback()
    finally:
        db.close()
