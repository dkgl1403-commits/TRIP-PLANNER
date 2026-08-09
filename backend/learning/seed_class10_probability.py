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
                },
                {
                    "title": "Lesson 5: 20 Solved Board Exam Sample Questions (Step-by-Step)",
                    "readingTime": "~10 min read",
                    "narrative": """
<p>Master these <strong>20 high-yield solved exemplar questions</strong> covering all question patterns asked in CBSE, ICSE, and State Board Class 10 exams!</p>

<div class="space-y-6 text-xs font-sans">

  <!-- Q1 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q1: Single Fair Coin Toss</h4>
    <p class="text-slate-300">A fair coin is tossed once. Find the probability of getting (i) a Head, (ii) a Tail.</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Sample Space S = {H, T} &rarr; N(S) = 2.</p>
      <p>• (i) P(Head) = 1/2 = 0.5 (50%).</p>
      <p>• (ii) P(Tail) = 1/2 = 0.5 (50%).</p>
    </div>
  </div>

  <!-- Q2 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q2: Single 6-Sided Die</h4>
    <p class="text-slate-300">A fair die is thrown once. Find the probability of getting (i) a prime number, (ii) a number lying between 2 and 6, (iii) an odd number.</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Sample Space S = {1, 2, 3, 4, 5, 6} &rarr; N(S) = 6.</p>
      <p>• (i) Prime numbers E₁ = {2, 3, 5} &rarr; N(E₁) = 3 &rarr; P(Prime) = 3/6 = 1/2.</p>
      <p>• (ii) Between 2 & 6 E₂ = {3, 4, 5} &rarr; N(E₂) = 3 &rarr; P = 3/6 = 1/2.</p>
      <p>• (iii) Odd numbers E₃ = {1, 3, 5} &rarr; N(E₃) = 3 &rarr; P(Odd) = 3/6 = 1/2.</p>
    </div>
  </div>

  <!-- Q3 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q3: 52-Card Deck — Suits & Face Cards</h4>
    <p class="text-slate-300">One card is drawn from a well-shuffled deck of 52 cards. Find the probability of getting (i) a King of red color, (ii) a face card, (iii) a spade.</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 52.</p>
      <p>• (i) Red Kings = {K♥, K♦} &rarr; N(E₁) = 2 &rarr; P(Red King) = 2/52 = 1/26.</p>
      <p>• (ii) Face Cards (J, Q, K in 4 suits) = 12 &rarr; P(Face Card) = 12/52 = 3/13.</p>
      <p>• (iii) Spades = 13 cards &rarr; P(Spade) = 13/52 = 1/4.</p>
    </div>
  </div>

  <!-- Q4 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q4: Two Coins Simultaneous Toss</h4>
    <p class="text-slate-300">Two fair coins are tossed simultaneously. Find the probability of getting (i) at least 1 Head, (ii) at most 1 Head, (iii) exactly 2 Tails.</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Sample Space S = {(HH), (HT), (TH), (TT)} &rarr; N(S) = 4.</p>
      <p>• (i) At least 1 Head = {(HH), (HT), (TH)} &rarr; 3/4.</p>
      <p>• (ii) At most 1 Head = {(HT), (TH), (TT)} &rarr; 3/4.</p>
      <p>• (iii) Exactly 2 Tails = {(TT)} &rarr; 1/4.</p>
    </div>
  </div>

  <!-- Q5 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q5: Two Dice — Sum 8 & Doublets</h4>
    <p class="text-slate-300">Two dice are rolled simultaneously. Find the probability that (i) the sum is 8, (ii) a doublet is obtained, (iii) sum ≤ 5.</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 6 × 6 = 36.</p>
      <p>• (i) Sum 8 = {(2,6), (3,5), (4,4), (5,3), (6,2)} &rarr; 5/36.</p>
      <p>• (ii) Doublet = {(1,1),(2,2),(3,3),(4,4),(5,5),(6,6)} &rarr; 6/36 = 1/6.</p>
      <p>• (iii) Sum ≤ 5 = 10 pairs &rarr; 10/36 = 5/18.</p>
    </div>
  </div>

  <!-- Q6 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q6: Bag of Red, White & Green Marbles</h4>
    <p class="text-slate-300">A bag contains 5 red, 8 white, and 4 green marbles. One marble is taken out at random. Find P(Red), P(White), P(Not Green).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total N(S) = 5 + 8 + 4 = 17.</p>
      <p>• P(Red) = 5/17.</p>
      <p>• P(White) = 8/17.</p>
      <p>• P(Not Green) = 1 - P(Green) = 1 - 4/17 = 13/17.</p>
    </div>
  </div>

  <!-- Q7 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q7: Leap Year 53 Mondays</h4>
    <p class="text-slate-300">Find the probability that a leap year chosen at random will contain 53 Mondays.</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• 366 days = 52 weeks (364 days) + 2 extra days.</p>
      <p>• 7 day pairs N(S) = 7. Favorable pairs with Monday = {(Sun,Mon), (Mon,Tue)} &rarr; 2.</p>
      <p>• P(53 Mondays in Leap Year) = 2/7.</p>
    </div>
  </div>

  <!-- Q8 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q8: Ordinary Year 53 Tuesdays</h4>
    <p class="text-slate-300">What is the probability that a non-leap year has 53 Tuesdays?</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• 365 days = 52 weeks + 1 extra day.</p>
      <p>• Sample space of 1 extra day N(S) = 7. Favorable = {Tuesday} &rarr; 1.</p>
      <p>• P(53 Tuesdays in Non-Leap Year) = 1/7.</p>
    </div>
  </div>

  <!-- Q9 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q9: Letters of the Word 'MATHEMATICS'</h4>
    <p class="text-slate-300">A letter is chosen at random from 'MATHEMATICS'. Find P(Vowel), P(Consonant), P(Letter 'M').</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total letters N(S) = 11.</p>
      <p>• Vowels = {A, E, A, I} &rarr; 4 &rarr; P(Vowel) = 4/11.</p>
      <p>• Consonants = 11 - 4 = 7 &rarr; P(Consonant) = 7/11.</p>
      <p>• Letter 'M' = 2 &rarr; P('M') = 2/11.</p>
    </div>
  </div>

  <!-- Q10 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q10: Numbered Discs 1 to 90</h4>
    <p class="text-slate-300">A box contains 90 discs numbered 1 to 90. One disc is drawn. Find P(Two-digit number), P(Perfect square), P(Divisible by 5).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 90.</p>
      <p>• Two-digit (10..90) = 81 &rarr; P = 81/90 = 9/10 = 0.9.</p>
      <p>• Perfect squares {1,4,9,16,25,36,49,64,81} = 9 &rarr; P = 9/90 = 1/10 = 0.1.</p>
      <p>• Divisible by 5 (5..90) = 18 &rarr; P = 18/90 = 1/5 = 0.2.</p>
    </div>
  </div>

  <!-- Q11 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q11: Numbered Cards 1 to 25</h4>
    <p class="text-slate-300">Cards marked 1 to 25 are placed in a box. One card is drawn. Find P(Prime number), P(Divisible by 3 and 5).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 25.</p>
      <p>• Primes = {2,3,5,7,11,13,17,19,23} &rarr; 9 &rarr; P(Prime) = 9/25.</p>
      <p>• Divisible by 3 and 5 (i.e. divisible by 15) = {15} &rarr; 1 &rarr; P = 1/25.</p>
    </div>
  </div>

  <!-- Q12 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q12: Two Friends Birthday Problem</h4>
    <p class="text-slate-300">Two friends Savita and Hamida were born in a non-leap year. What is the probability of (i) different birthdays? (ii) same birthday?</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Days N(S) = 365.</p>
      <p>• (i) P(Different Birthdays) = 364/365.</p>
      <p>• (ii) P(Same Birthday) = 1 - 364/365 = 1/365.</p>
    </div>
  </div>

  <!-- Q13 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q13: Defective Pens Mixture</h4>
    <p class="text-slate-300">12 defective pens are accidentally mixed with 132 good ones. One pen is drawn. Find P(Good Pen).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• Total pens N(S) = 12 + 132 = 144.</p>
      <p>• Good pens = 132 &rarr; P(Good) = 132/144 = 11/12.</p>
    </div>
  </div>

  <!-- Q14 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q14: Lot of 20 Bulbs</h4>
    <p class="text-slate-300">A lot of 20 bulbs contains 4 defective ones. One bulb is drawn. What is P(Defective bulb)?</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 20. Defective = 4.</p>
      <p>• P(Defective) = 4/20 = 1/5 = 0.2 (20%).</p>
    </div>
  </div>

  <!-- Q15 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q15: Piggy Bank Coin Mixture</h4>
    <p class="text-slate-300">A piggy bank contains 100 fifty-paise, 50 ₹1, 20 ₹2, and 10 ₹5 coins. One coin falls out. Find P(50p coin), P(NOT ₹5 coin).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 100 + 50 + 20 + 10 = 180 coins.</p>
      <p>• (i) P(50p) = 100/180 = 5/9.</p>
      <p>• (ii) P(NOT ₹5) = 1 - (10/180) = 170/180 = 17/18.</p>
    </div>
  </div>

  <!-- Q16 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q16: Game of Chance Spinner 1 to 8</h4>
    <p class="text-slate-300">A spinner arrow points to 1..8. Find P(Points at 8), P(Odd number), P(Number > 2).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 8.</p>
      <p>• (i) P(8) = 1/8.</p>
      <p>• (ii) Odd {1,3,5,7} &rarr; 4 &rarr; P = 4/8 = 1/2.</p>
      <p>• (iii) >2 {3,4,5,6,7,8} &rarr; 6 &rarr; P = 6/8 = 3/4.</p>
    </div>
  </div>

  <!-- Q17 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q17: Die Thrown Twice — Not Getting 5</h4>
    <p class="text-slate-300">A die is thrown twice. What is P(5 will not come up either time), P(5 will come up at least once)?</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 36.</p>
      <p>• Outcomes where 5 comes up at least once = 11 pairs.</p>
      <p>• (i) P(5 not either time) = (36 - 11)/36 = 25/36.</p>
      <p>• (ii) P(5 at least once) = 11/36.</p>
    </div>
  </div>

  <!-- Q18 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q18: Game of Tossing 3 Coins</h4>
    <p class="text-slate-300">Hanif tosses a coin 3 times. He wins if all tosses give the same result (3 H or 3 T), and loses otherwise. Find P(Hanif loses).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 8. Win = {(HHH),(TTT)} = 2.</p>
      <p>• Losing outcomes = 8 - 2 = 6.</p>
      <p>• P(Lose) = 6/8 = 3/4 = 0.75.</p>
    </div>
  </div>

  <!-- Q19 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q19: Cards — Neither King nor Queen</h4>
    <p class="text-slate-300">A card is drawn from 52 cards. Find P(Neither King nor Queen).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 52. Kings + Queens = 4 + 4 = 8.</p>
      <p>• Neither K nor Q = 52 - 8 = 44 cards.</p>
      <p>• P(Neither K nor Q) = 44/52 = 11/13.</p>
    </div>
  </div>

  <!-- Q20 -->
  <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
    <h4 class="font-bold text-amber-400 text-sm">Q20: Cards — Red Card or a King</h4>
    <p class="text-slate-300">A card is drawn from 52 cards. Find P(Red Card or a King).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 text-[11px] space-y-1">
      <p>• N(S) = 52. Red cards = 26. Black Kings = 2 (Red Kings already counted).</p>
      <p>• Favorable = 26 + 2 = 28 cards.</p>
      <p>• P(Red or King) = 28/52 = 7/13.</p>
    </div>
  </div>

</div>
""",
                    "keyInsight": "Review all 20 step-by-step solved exemplar solutions to master board exam pattern solving.",
                    "widgetType": "TwoDiceSampleSpace",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 6: Interactive 10-Question MCQ Practice Exam",
                    "readingTime": "~5 min practice",
                    "narrative": """
<p>Test your knowledge with <strong>10 high-yield board exam practice questions</strong> below!</p>
<p>Select your answer for instant step-by-step verification, score tracking, and detailed explanations.</p>
""",
                    "keyInsight": "Complete the 10-question MCQ practice exam to achieve 100% mastery in Class 10 Probability.",
                    "widgetType": "ProbabilityMCQPractice",
                    "widgetData": {}
                }
            ]
        }

        prob_topic.lesson_config_json = json.dumps(config)
        db.commit()
        print("Successfully seeded Class 10 Probability curriculum with 20 solved questions & 10 MCQs!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class10_probability()
