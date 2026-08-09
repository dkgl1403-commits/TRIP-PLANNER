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
<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-amber-400 text-lg">
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
                    "title": "Lesson 2: Practice Problem — The Faulty Machine (Malegaon Factory)",
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
                    "title": "Lesson 3: The Origins — A Gambler's Problem (1654)",
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
                    "title": "Lesson 4: Where Do We Use Empirical Probability Today?",
                    "readingTime": "~3 min read",
                    "narrative": """
<p>The gamblers started it, but today empirical probability runs the modern world!</p>

<ol><li><strong>1. Weather Forecasting:</strong> When your phone says "60% chance of rain," meteorologists didn't use a formula for the sky. They looked at past weather data: on 100 historical days with identical temperature, humidity, and wind, it rained on 60 of those days!</li><li><strong>2. Insurance Premiums:</strong> Car insurance companies analyze historical data across millions of drivers. If past data shows 19-year-olds crash more frequently than 45-year-olds, premiums are set based on empirical risk.</li><li><strong>3. Medical Clinical Trials:</strong> Before a medicine is approved in India, it is tested on thousands of patients. If 9,500 out of 10,000 patients recover, the empirical probability of success is 95% &mdash; giving health regulators the proof needed for safety approval.</li></ol>
""",
                    "keyInsight": "From weather apps to medical trials and car insurance, empirical data drives modern risk prediction.",
                    "widgetType": "CoinFlipLawOfLargeNumbers",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 5: 20 Solved Board Exam Sample Questions (Step-by-Step)",
                    "readingTime": "~10 min read",
                    "narrative": """
<p>Master these <strong>20 high-yield solved exemplar questions</strong> covering all empirical probability patterns asked in Class 9 exams!</p>

<div class="space-y-6 text-xs font-sans">

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q1: Coin Toss Experiment (1,000 Flips)</h4>
    <p class="text-slate-300">A coin is tossed 1,000 times with frequencies: Heads: 455, Tails: 545. Compute P(Heads) and P(Tails).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total trials = 1,000.</p>
      <p>• P(Heads) = 455 / 1,000 = 0.455 (45.5%).</p>
      <p>• P(Tails) = 545 / 1,000 = 0.545 (54.5%). Note P(H) + P(T) = 0.455 + 0.545 = 1.</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q2: Two Coins Tossed 500 Times</h4>
    <p class="text-slate-300">Two coins are tossed 500 times: 2 Heads: 105 times, 1 Head: 275 times, 0 Heads: 120 times. Compute probability of each event.</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• P(2 Heads) = 105 / 500 = 0.21.</p>
      <p>• P(1 Head) = 275 / 500 = 0.55.</p>
      <p>• P(0 Heads) = 120 / 500 = 0.24. Sum = 0.21 + 0.55 + 0.24 = 1.00.</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q3: Die Thrown 1,000 Times</h4>
    <p class="text-slate-300">A die is thrown 1,000 times: 1: 179, 2: 150, 3: 157, 4: 149, 5: 175, 6: 190. Find P(getting outcome 3).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total trials = 1,000. Frequency of 3 = 157.</p>
      <p>• P(3) = 157 / 1,000 = 0.157 (15.7%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q4: Three Coins Tossed 200 Times</h4>
    <p class="text-slate-300">3 coins tossed 200 times: 3 Heads: 23, 2 Heads: 72, 1 Head: 77, No Head: 28. Find P(2 Heads).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total trials = 200. Favorable = 72.</p>
      <p>• P(2 Heads) = 72 / 200 = 36 / 100 = 0.36 (36%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q5: Weather Station 250 Forecast Days</h4>
    <p class="text-slate-300">Weather forecasts were correct on 175 out of 250 days. (i) P(forecast correct), (ii) P(forecast wrong).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total days = 250.</p>
      <p>• (i) P(Correct) = 175 / 250 = 0.70 (70%).</p>
      <p>• (ii) P(Wrong) = 1 - 0.70 = 0.30 (30%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q6: Tyre Manufacturing Company Mileage Survey</h4>
    <p class="text-slate-300">1,000 tyres surveyed: Distance before replacement &lt;4,000km: 20, 4,000-9,000km: 210, 9,001-14,000km: 325, &gt;14,000km: 445. Find P(replaced after 9,000km).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Replaced after 9,000km = 325 + 445 = 770 tyres.</p>
      <p>• P(>9,000km) = 770 / 1,000 = 0.77 (77%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q7: Mathematics Marks Distribution (200 Students)</h4>
    <p class="text-slate-300">200 students marks out of 100: 0-20: 7, 20-30: 10, 30-40: 10, 40-50: 20, 50-60: 20, 60-70: 60, 70-100: 73. Find P(student gets &lt;20 marks).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total = 200. Marks &lt; 20 = 7 students.</p>
      <p>• P(&lt;20) = 7 / 200 = 0.035 (3.5%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q8: Student Opinion Survey on Statistics (200 Students)</h4>
    <p class="text-slate-300">Survey of 200 students: Like Statistics: 135, Dislike: 65. Find P(student likes Statistics).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• P(Like) = 135 / 200 = 27 / 40 = 0.675 (67.5%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q9: Wheat Flour Bags Weight Inspection (11 Bags)</h4>
    <p class="text-slate-300">11 bags labeled 5kg contain actual weights: 4.97, 5.05, 5.08, 5.03, 5.00, 5.06, 5.08, 4.98, 5.04, 5.07, 5.00. Find P(bag contains &gt;5kg).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total bags = 11. Bags with &gt;5.00kg: {5.05, 5.08, 5.03, 5.06, 5.08, 5.04, 5.07} = 7 bags.</p>
      <p>• P(&gt;5kg) = 7 / 11.</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q10: Sulphur Dioxide Concentration Study (30 Days)</h4>
    <p class="text-slate-300">SO₂ concentration data for 30 days: Frequency in interval 0.12-0.16 ppm is 2. Find P(SO₂ in 0.12-0.16 ppm).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total days = 30. Favorable = 2 days.</p>
      <p>• P = 2 / 30 = 1 / 15.</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q11: Blood Group Survey of 30 Students</h4>
    <p class="text-slate-300">30 students blood groups: A: 9, B: 6, AB: 3, O: 12. Find P(student has AB blood group).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total = 30. AB students = 3.</p>
      <p>• P(AB) = 3 / 30 = 1 / 10 = 0.10 (10%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q12: Household Vehicles Survey (2,400 Families)</h4>
    <p class="text-slate-300">2,400 families surveyed: Income ₹10k-13k with exactly 2 vehicles: 29 families. Find P(earning ₹10k-13k and owning 2 vehicles).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total families = 2,400. Favorable = 29.</p>
      <p>• P = 29 / 2,400.</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q13: Seed Germination Experiment (5 Bags)</h4>
    <p class="text-slate-300">5 bags of 50 seeds each. Seeds germinated per bag: Bag 1: 40, Bag 2: 48, Bag 3: 42, Bag 4: 39, Bag 5: 41. Find P(bag with &gt;40 germinated seeds).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Bags with &gt;40 seeds: Bags 2, 3, 5 = 3 bags.</p>
      <p>• P(&gt;40 seeds) = 3 / 5 = 0.60 (60%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q14: Single Coin Tossed 100 Times</h4>
    <p class="text-slate-300">Coin tossed 100 times: Head: 60, Tail: 40. Find P(Head) + P(Tail).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• P(Head) = 60/100 = 0.60. P(Tail) = 40/100 = 0.40.</p>
      <p>• P(Head) + P(Tail) = 0.60 + 0.40 = 1.00.</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q15: Die Thrown 500 Times — Prime Outcomes</h4>
    <p class="text-slate-300">Die thrown 500 times. Primes (2, 3, 5) occurred 240 times. Find P(getting a prime number).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total trials = 500. Favorable = 240.</p>
      <p>• P(Prime) = 240 / 500 = 24 / 50 = 0.48 (48%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q16: Light Bulb Factory Quality Control (1,000 Bulbs)</h4>
    <p class="text-slate-300">Out of 1,000 inspected bulbs, 30 were defective. Find P(non-defective bulb).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Non-defective = 1,000 - 30 = 970.</p>
      <p>• P(Non-defective) = 970 / 1,000 = 0.97 (97%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q17: Cricket Match Batswoman Boundary Hits (30 Balls)</h4>
    <p class="text-slate-300">A batswoman hits a boundary 6 times out of 30 balls. Find P(she did NOT hit a boundary).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Balls without boundary = 30 - 6 = 24.</p>
      <p>• P(No boundary) = 24 / 30 = 4 / 5 = 0.80 (80%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q18: Hospital Birth Records (1,000 Newborns)</h4>
    <p class="text-slate-300">Out of 1,000 newborns, 515 were female. Find P(newborn is female).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• P(Female) = 515 / 1,000 = 0.515 (51.5%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q19: School Attendance Survey (500 Days)</h4>
    <p class="text-slate-300">100% student attendance recorded on 40 days out of 500 school days. Find P(100% attendance).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• P(100% attendance) = 40 / 500 = 8 / 100 = 0.08 (8%).</p>
    </div>
  </div>

  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q20: Machine Component Failure Test (800 Hours)</h4>
    <p class="text-slate-300">A component failed 16 times during 800 hours of stress testing. Find P(component runs without failure for 1 hour).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Failure hours = 16. Operational hours = 800 - 16 = 784.</p>
      <p>• P(Operational) = 784 / 800 = 0.98 (98%).</p>
    </div>
  </div>

</div>
""",
                    "keyInsight": "Review all 20 solved empirical probability questions to master Class 9 exam patterns.",
                    "widgetType": "CoinFlipLawOfLargeNumbers",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 6: Interactive 10-Question MCQ Practice Exam",
                    "readingTime": "~5 min practice",
                    "narrative": """
<p>Test your empirical probability knowledge with <strong>10 high-yield board exam practice questions</strong> below!</p>
<p>Select your answer for instant step-by-step verification, score tracking, and detailed explanations.</p>
""",
                    "keyInsight": "Complete the 10-question MCQ practice exam to achieve 100% mastery in Class 9 Probability.",
                    "widgetType": "ProbabilityMCQPractice",
                    "widgetData": {}
                }
            ]
        }

        prob_topic.lesson_config_json = json.dumps(config)
        db.commit()
        print("Successfully seeded Class 9 Probability curriculum with 20 solved questions & 10 MCQs!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class9_probability()
