import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_class10_probability():
    db = SessionLocal()
    try:
        class_10 = db.query(LearningClass).filter_by(level=10).first()
        if not class_10:
            print("Class 10 not found in DB.")
            return

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_10.id).first()
        if not math_subject:
            print("Subject 'Mathematics' for Class 10 not found.")
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
                    "title": "Lesson 1: Theoretical Probability & The Golden Assumption",
                    "readingTime": "~4 min read",
                    "narrative": """
<p>Welcome to Class 10. In Class 9, we got our hands dirty. We flipped real coins, counted real defective light bulbs, and dealt with messy real-world physics.</p>
<p>Today, we wash our hands, close the factory door, and step into the pure, perfectly clean world of the mind: <strong>Theoretical Probability</strong> (also called Classical Probability).</p>
<p>We are no longer asking, <em>"What happened when we tried it?"</em> We are asking, <strong>"What SHOULD happen in a mathematically perfect universe?"</strong></p>

<h3>The Golden Assumption: Equally Likely Outcomes</h3>
<p>To do theoretical math, we invent a perfect world. We assume our coin is perfectly balanced. We assume our die is a flawless geometric cube. We assume that pulling a card from a deck gives us the exact same chance of pulling the Queen of Hearts as the 2 of Clubs.</p>
<p>Because we assume everything is perfect, <strong>we don't need to run physical experiments anymore!</strong> We figure out probability purely by counting.</p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-amber-400 text-lg">
  P(E) = (Number of outcomes favorable to E) / (Total number of possible outcomes)
</div>

<p>In Class 9, the denominator was <em>"Total number of trials"</em>. In Class 10, the denominator is <strong>"Total number of possible outcomes"</strong>. This complete set of every possible outcome is called the <strong>Sample Space N(S)</strong>.</p>

<h3>The Absolute Boundaries of Reality</h3>
<ul>
  <li><strong>Impossible Event:</strong> Rolling a 13 with two dice is impossible &rarr; <code class="text-rose-400 font-mono">P(13) = 0 / 36 = 0</code>.</li>
  <li><strong>Sure / Guaranteed Event:</strong> Rolling a sum less than 15 is guaranteed &rarr; <code class="text-emerald-400 font-mono">P(&lt;15) = 36 / 36 = 1</code>.</li>
  <li><strong>The Golden Rule:</strong> Every probability in the universe satisfies <code class="text-amber-400 font-mono">0 &le; P(E) &le; 1</code>. If you get a negative number or 1.5 on an exam, stop immediately &mdash; you've broken the laws of the universe!</li>
</ul>
""",
                    "keyInsight": "Theoretical probability assumes flawless equally likely outcomes. Every probability exists strictly between 0 and 1.",
                    "widgetType": "TwoDiceSampleSpace",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: The Classic 2-Dice Problem (36 Sample Space Grid)",
                    "readingTime": "~4 min read",
                    "narrative": """
<p>This is the most famous probability problem in the Indian high school syllabus. If you master this, you master Class 10!</p>

<p>Imagine you roll two perfect dice. What is the probability that the sum of the numbers on the dice is exactly <strong>7</strong>?</p>

<h3>Step-by-Step Solution</h3>
<ol>
  <li><strong>Step 1: Find Total Possible Outcomes (Sample Space):</strong> Die 1 has 6 outcomes, Die 2 has 6 outcomes. Every number on Die 1 pairs with every number on Die 2 &rarr; <code class="text-amber-400 font-mono">6 × 6 = 36 outcomes</code>.</li>
  <li><strong>Step 2: Find Favorable Outcomes for Sum = 7:</strong> (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) &rarr; <code class="text-blue-400 font-mono">6 favorable pairs</code>.</li>
  <li><strong>Step 3: Calculate Probability:</strong> <code class="text-emerald-400 font-mono">P(Sum = 7) = 6 / 36 = 1 / 6 ≈ 0.1667 (16.67%)</code>.</li>
</ol>
""",
                    "keyInsight": "Rolling two 6-sided dice produces 36 total outcomes. Sum 7 has the highest probability (1/6).",
                    "widgetType": "TwoDiceSampleSpace",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: Complementary Events & The 'Bag of Marbles'",
                    "readingTime": "~4 min read",
                    "narrative": """
<p>Board examiners love testing <strong>Complementary Events</strong> because it separates students who memorize from those who understand shortcuts.</p>

<h3>1. The Power of "Not" (Complementary Events)</h3>
<p>The probability of an event happening is P(E). The probability of an event NOT happening is written as <code class="text-amber-400 font-mono">P(Ē)</code> ("P of E-bar").</p>
<p>Because the sum of all probabilities in the sample space is 1:</p>
<div class="my-3 p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-emerald-400">
  P(E) + P(Ē) = 1 &nbsp;&rarr;&nbsp; P(Ē) = 1 - P(E)
</div>

<p><em>Exam Shortcut Example:</em> "What is the probability that rolling two dice does NOT sum to 12?"</p>
<p>Instead of counting 35 non-12 outcomes, use the shortcut: P(Sum=12) = 1/36 &rarr; <code class="text-blue-400 font-mono">P(Not 12) = 1 - 1/36 = 35/36</code>!</p>

<h3>2. The "Bag of Marbles" (Urn Problems)</h3>
<p>A bag contains 3 red, 5 blue, and 2 green balls. A ball is drawn at random.</p>
<ul>
  <li>Total Outcomes = 3 + 5 + 2 = 10 balls.</li>
  <li>P(Blue) = 5 / 10 = 1/2.</li>
  <li>P(NOT Green) = 1 - P(Green) = 1 - 2/10 = 8/10 = 4/5!</li>
</ul>
""",
                    "keyInsight": "P(NOT E) = 1 - P(E). Use complementary shortcuts to solve complex exam questions in seconds.",
                    "widgetType": "ComplementaryEventBag",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: The Infamous Leap Year 53 Sundays Puzzle",
                    "readingTime": "~4 min read",
                    "narrative": """
<p>In the last 10 years of CBSE and ICSE exam papers, this puzzle appears relentlessly. It combines calendar logic with probability!</p>

<p><strong>The Question:</strong> What is the probability that a leap year selected at random will contain exactly 53 Sundays?</p>

<h3>The 6-Step Breakdown</h3>
<ol>
  <li><strong>1. Understand the Year:</strong> A leap year has <strong>366 days</strong>.</li>
  <li><strong>2. Divide into Weeks:</strong> 366 ÷ 7 = <strong>52 complete weeks + 2 extra days</strong>.</li>
  <li><strong>3. The Guaranteed Days:</strong> Those 52 complete weeks guarantee exactly 52 Sundays, 52 Mondays, etc.</li>
  <li><strong>4. The Remaining 2 Days:</strong> The entire puzzle hinges on the 2 extra days. Their consecutive paired sample space is:
    <div class="my-2 p-2 bg-slate-900 rounded border border-slate-800 font-mono text-blue-300 text-xs">
      (Sun,Mon), (Mon,Tue), (Tue,Wed), (Wed,Thu), (Thu,Fri), (Fri,Sat), (Sat,Sun)
    </div>
  </li>
  <li><strong>5. Count Outcomes:</strong> There are <strong>7 possible outcomes</strong>.</li>
  <li><strong>6. Favorable Outcomes:</strong> To get 53 Sundays, one of the extra days MUST be a Sunday. Favorable pairs: (Sun,Mon) & (Sat,Sun) &rarr; <strong>2 favorable outcomes</strong>.</li>
</ol>

<div class="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center font-mono text-emerald-300 text-lg">
  P(53 Sundays in Leap Year) = 2 / 7 &nbsp;|&nbsp; Ordinary Year = 1 / 7
</div>
""",
                    "keyInsight": "A leap year leaves 2 extra days (7 paired outcomes), giving a 2/7 probability of 53 Sundays.",
                    "widgetType": "LeapYearPuzzle",
                    "widgetData": {}
                }
            ]
        }

        prob_topic.lesson_config_json = json.dumps(config)
        db.commit()
        print("Successfully seeded Class 10 Probability curriculum with interactive widgets!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class10_probability()
