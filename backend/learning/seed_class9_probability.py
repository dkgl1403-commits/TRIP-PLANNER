import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_class9_probability():
    db = SessionLocal()
    try:
        class_9 = db.query(LearningClass).filter_by(level=9).first()
        if not class_9:
            print("Class 9 not found in DB.")
            return

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_9.id).first()
        if not math_subject:
            print("Subject 'Mathematics' for Class 9 not found.")
            return

        prob_topic = db.query(LearningTopic).filter_by(name="Probability", subject_id=math_subject.id).first()
        if not prob_topic:
            prob_topic = LearningTopic(
                subject_id=math_subject.id,
                name="Probability",
                order=15
            )
            db.add(prob_topic)
            db.flush()

        config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: The Mathematics of What Actually Happened",
                    "readingTime": "~4 min read",
                    "narrative": """
<p>Welcome to probability. Take a coin out of your pocket. Don't think about math right now, just think about physics.</p>
<p>When you flip that coin, it tumbles through the air. Gravity pulls it down. Air resistance pushes against it. It hits the table, bouncing and spinning based on the angle of impact and the surface tension of the wood.</p>
<p>That single flip is chaos. It is a tiny, incredibly complex physical event. But we are going to learn a secret about the universe today: <strong>when you repeat chaos enough times, it turns into perfect order.</strong></p>

<h3>The Experiment</h3>
<p>We are going to measure this order. We are going to calculate <strong>Empirical Probability</strong> (also called Experimental Probability). <em>"Empirical"</em> simply means based on observation or experience rather than theory or pure logic.</p>

<p>Here is the only formula you need for this entire lesson:</p>
<div className="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-amber-400 text-lg">
  P(E) = (Number of trials where event E happened) / (Total number of trials)
</div>

<ul>
  <li><strong>P(E):</strong> The Probability of the Event we care about.</li>
  <li><strong>Trials:</strong> The number of times we ran the experiment (flipped the coin).</li>
</ul>

<p>If you flip your coin 10 times, you might get 7 Heads and 3 Tails. The empirical probability of getting Heads, P(H), is:</p>
<p class="font-mono text-blue-400">P(H) = 7 / 10 = 0.70 or 70%</p>
<p>Does this mean your coin is rigged? No! It just means in small numbers, chaos still wins.</p>

<h3>The Law of Large Numbers</h3>
<p>Now, imagine we spend the entire weekend flipping that coin 10,000 times and recording every result.</p>
<p>Because we've run the experiment so many times, tiny physical variations start to cancel each other out. After 10,000 flips, you might get 5,021 Heads:</p>
<p class="font-mono text-emerald-400">P(H) = 5,021 / 10,000 = 0.5021 or 50.21%</p>
<p>As the number of trials increases, the empirical probability gets closer and closer to a fixed number: <strong>0.5 (or 50%)</strong>. This is called the <strong>Law of Large Numbers</strong>.</p>
""",
                    "keyInsight": "Empirical probability measures what DID happen in real experiments. As trial count grows, chaos snaps into order.",
                    "widgetType": "CoinFlipLawOfLargeNumbers",
                    "widgetData": {}
                },
                {
                    "title": "Practice Problem: The Faulty Machine (Malegaon Factory)",
                    "readingTime": "~4 min read",
                    "narrative": """
<p>Let's test this concept in a real-world scenario.</p>
<p>You run a factory in Malegaon that produces light bulbs. You know machines aren't perfect, and occasionally a bulb comes out defective. You don't know the internal mathematical theory of the machine's inner components, so you must use empirical probability.</p>
<p>You take a random sample of <strong>500 light bulbs</strong> from today's production line and test them. You find that <strong>15 of them are defective</strong>.</p>

<div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
  <p class="font-bold text-amber-400">Question 1: What is the empirical probability that a light bulb produced today is defective?</p>
  <p class="font-bold text-blue-400">Question 2: Based on this probability, if the factory produces 2,000 light bulbs tomorrow, approximately how many defective bulbs should you expect?</p>
</div>

<h3>Step-by-Step Chalkboard Solution</h3>
<p><em>Quick Note:</em> In probability, professors use the phrase <strong>"favorable outcome."</strong> In our problem, a defective bulb is a bad thing, but mathematically, it is our "favorable" outcome simply because it is the specific event we are searching for!</p>

<h4>Question 1 Solution:</h4>
<p>Total trials = 500. Defective count = 15.</p>
<p class="font-mono text-amber-300">P(Defective) = 15 / 500 = 3 / 100 = 0.03 (3%)</p>

<h4>Question 2 Solution:</h4>
<p>Tomorrow's production = 2,000 bulbs.</p>
<p class="font-mono text-emerald-300">Expected Defective Bulbs = 2,000 × (3 / 100) = 20 × 3 = 60 bulbs!</p>
<p>Will it be <em>exactly</em> 60? Probably not (maybe 58 or 63). But because 2,000 is a large number, the Law of Large Numbers dictates that actual results will gravitate right to our mathematical expectation of 60.</p>
""",
                    "keyInsight": "Observe the past, calculate the empirical ratio, and use it to predict the macro-level future.",
                    "widgetType": "FaultyMachineCalculator",
                    "widgetData": {}
                },
                {
                    "title": "The Origins: A Gambler's Problem (1654)",
                    "readingTime": "~3 min read",
                    "narrative": """
<p>You might think probability was invented by astronomers or engineers. It wasn't! It was invented by people trying to win dice bets in the taverns of 17th-century France.</p>
<p>In 1654, a French writer and heavy gambler named <strong>Chevalier de Méré</strong> had a problem. He loved playing dice games and wanted to know the exact mathematical odds of winning a complicated game so he could bet perfectly.</p>
<p>He took his problem to his friend, the brilliant mathematician <strong>Blaise Pascal</strong>. Pascal started writing letters back and forth with another mathematical genius, <strong>Pierre de Fermat</strong>.</p>
<p>Through their famous letter correspondence, they completely invented the mathematical rules of probability! They realized that randomness wasn't just "luck" or "fate" &mdash; it was something that could be measured, calculated, and predicted.</p>
""",
                    "keyInsight": "Probability was born in 1654 from letters between Pascal and Fermat solving a gambler's dice problem.",
                    "widgetType": "GamblerDiceHistory",
                    "widgetData": {}
                },
                {
                    "title": "Where Do We Use Empirical Probability Today?",
                    "readingTime": "~3 min read",
                    "narrative": """
<p>The gamblers started it, but today empirical probability runs the modern world!</p>

<ol><li><strong>1. Weather Forecasting:</strong> When your phone says "60% chance of rain," meteorologists didn't use a formula for the sky. They looked at past weather data: on 100 historical days with identical temperature, humidity, and wind, it rained on 60 of those days!</li><li><strong>2. Insurance Premiums:</strong> Car insurance companies analyze historical data across millions of drivers. If past data shows 19-year-olds crash more frequently than 45-year-olds, premiums are set based on empirical risk.</li><li><strong>3. Medical Clinical Trials:</strong> Before a medicine is approved in India, it is tested on thousands of patients. If 9,500 out of 10,000 patients recover, the empirical probability of success is 95% &mdash; giving health regulators the proof needed for safety approval.</li></ol>
""",
                    "keyInsight": "From weather apps to medical trials and car insurance, empirical data drives modern risk prediction.",
                    "widgetType": "CoinFlipLawOfLargeNumbers",
                    "widgetData": {}
                }
            ]
        }

        prob_topic.lesson_config_json = json.dumps(config)
        db.commit()
        print("Successfully seeded Class 9 Probability curriculum with interactive widgets!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class9_probability()
