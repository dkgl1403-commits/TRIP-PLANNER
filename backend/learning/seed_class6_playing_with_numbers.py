import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_class6_playing_with_numbers():
    db = SessionLocal()
    try:
        class_6 = db.query(LearningClass).filter_by(level=6).first()
        if not class_6:
            class_6 = LearningClass(level=6, name="Class 6")
            db.add(class_6)
            db.flush()

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_6.id).first()
        if not math_subject:
            math_subject = LearningSubject(name="Mathematics", class_id=class_6.id)
            db.add(math_subject)
            db.flush()

        pn_topic = db.query(LearningTopic).filter_by(name="Playing with Numbers", subject_id=math_subject.id).first()
        if not pn_topic:
            pn_topic = LearningTopic(
                subject_id=math_subject.id,
                name="Playing with Numbers",
                order_idx=3
            )
            db.add(pn_topic)
            db.flush()

        config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: Factors vs. Multiples & Prime Factorization",
                    "readingTime": "~5 min read",
                    "narrative": """
<p>Welcome to Class 6 <strong>Playing with Numbers</strong>! The entire theme of Class 6 Math revolves around building a strong foundation in the <strong>Number System</strong>.</p>

<hr class="my-6 border-slate-800"/>

<h2>1. Factors vs. Multiples (Mental Model)</h2>
<ul>
  <li><strong>Factors (Divisors):</strong> Exact divisors of a number. They are always finite and less than or equal to the number (e.g., Factors of 12 are 1, 2, 3, 4, 6, 12).</li>
  <li><strong>Multiples (Growth):</strong> Numbers obtained by multiplying a given number by counting numbers. They are infinite and greater than or equal to the number (e.g., Multiples of 4 are 4, 8, 12, 16, 20...).</li>
</ul>

<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-amber-500 text-amber-300 font-sans">
  <strong>Key Distinction:</strong> Factors <em>build</em> numbers (smaller/equal), while Multiples are what numbers <em>become</em> (larger/equal).
</blockquote>

<hr class="my-6 border-slate-800"/>

<h2>2. Prime & Composite Numbers</h2>
<ul>
  <li><strong>Prime Numbers:</strong> Numbers with <em>exactly two</em> factors: 1 and the number itself (e.g., 2, 3, 5, 7, 11...). <strong>2 is the ONLY even prime number!</strong></li>
  <li><strong>Composite Numbers:</strong> Numbers with <em>more than two</em> factors (e.g., 4, 6, 8, 9, 10...).</li>
  <li><em>Note: 1 is neither prime nor composite.</em></li>
</ul>
""",
                    "audioText": "Welcome to Class 6 Playing with Numbers. Factors are exact divisors of a number while Multiples are numbers obtained by multiplying by counting numbers. Two is the only even prime number.",
                    "audioTextHinglish": "Class 6 Playing with Numbers me aapka swagat hai. Factors number ke exact divisors hote hain aur Multiples number ko count se multiply karke milte hain.",
                    "keyInsight": "Factors build a number (divisors), Multiples are what a number grows into.",
                    "widgetType": "Class6FactorsMultiplesVisualizerWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: Highest Common Factor (HCF) — Deep Dive into 3 Methods",
                    "readingTime": "~7 min read",
                    "narrative": """
<h2>Highest Common Factor (HCF) / Greatest Common Divisor (GCD)</h2>

<p>The <strong>HCF</strong> of two or more numbers is the largest factor that divides all of them without leaving a remainder. Think of it as finding the <strong>maximum size storage crate</strong> that holds either item without wasted space!</p>

<hr class="my-6 border-slate-800"/>

<h2>Method 1: Listing Common Factors (Basic)</h2>
<p>List all finite factors of each number, identify common factors, and pick the largest.</p>
<div class="my-2 p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300">
  • Factors of 12: 1, 2, 3, <strong>6</strong>, 12<br/>
  • Factors of 18: 1, 2, 3, <strong>6</strong>, 9, 18<br/>
  • Common Factors: 1, 2, 3, 6 ==> <strong>HCF = 6</strong>
</div>

<hr class="my-6 border-slate-800"/>

<h2>Method 2: Prime Factorization Method (The Prime Brick Rule - Best for Intuition)</h2>
<p>Express each number as a product of prime factor bricks using exponents, then take the <strong>smallest power (lowest exponent)</strong> of each common prime factor!</p>
<div class="my-3 p-4 bg-slate-950 border border-amber-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• 12 = 2 × 2 × 3 = <strong>2² × 3¹</strong></div>
  <div>• 18 = 2 × 3 × 3 = <strong>2¹ × 3²</strong></div>
  <div class="pt-1 text-amber-400">• Common Prime Bases: 2 and 3</div>
  <div>• Lowest power of 2 = min(2, 1) = <strong>2¹</strong></div>
  <div>• Lowest power of 3 = min(1, 2) = <strong>3¹</strong></div>
  <div class="text-emerald-400 font-bold text-sm pt-1">• HCF = 2¹ × 3¹ = 6</div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>Method 3: Continued Division / Long Division Method (Euclidean Ladder - Best for Large Numbers)</h2>
<p>When numbers are very large (e.g. 144 and 180), listing factors or prime factoring takes too long. Divide the larger number by the smaller number, then make the remainder the NEW divisor and repeat until remainder is 0!</p>

<div class="my-3 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-2">
  <div>• <strong>Step 1:</strong> 180 ÷ 144 = 1 with Remainder <strong>36</strong>.</div>
  <div>• <strong>Step 2:</strong> Remainder 36 becomes NEW divisor, 144 becomes NEW dividend.</div>
  <div>• <strong>Step 3:</strong> 144 ÷ 36 = 4 with Remainder <strong>0</strong>.</div>
  <div class="text-emerald-400 font-bold text-sm">• Final Divisor giving remainder 0 is HCF = 36!</div>
</div>
""",
                    "audioText": "Lesson 2 covers HCF via 3 methods. Method 1 lists factors. Method 2 uses prime factorization taking the lowest power of common prime factors. Method 3 uses continued division by shifting remainders into new divisors until remainder is 0.",
                    "audioTextHinglish": "Lesson 2 me HCF ke 3 methods seekhte hain. Method 2 me common prime factors ki lowest power lete hain aur Method 3 continued long division me remainder ko naya divisor banate hain.",
                    "keyInsight": "HCF via Prime Factorization = product of lowest powers of common prime factors (2¹ × 3¹ = 6).",
                    "widgetType": "Class6FactorBrickHCFWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: Lowest Common Multiple (LCM) — 3 Methods & Aligning Trains",
                    "readingTime": "~6 min read",
                    "narrative": """
<h2>Lowest Common Multiple (LCM)</h2>

<p>The <strong>LCM</strong> of two or more numbers is the smallest non-zero common multiple. Think of it as finding the first station where two trains of different car lengths (e.g. 12-meter and 18-meter cars) perfectly align!</p>

<hr class="my-6 border-slate-800"/>

<h2>Method 1: Listing Multiples</h2>
<div class="my-2 p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300">
  • Multiples of 12: 12, 24, <strong>36</strong>, 48...<br/>
  • Multiples of 18: 18, <strong>36</strong>, 54...<br/>
  • Common Multiples: 36, 72... ==> <strong>LCM = 36</strong>
</div>

<hr class="my-6 border-slate-800"/>

<h2>Method 2: Prime Factorization Method (Highest Power Rule)</h2>
<p>Express each number as a product of prime factor bricks, then take the <strong>highest power (highest exponent)</strong> of EVERY prime factor involved!</p>
<div class="my-3 p-4 bg-slate-950 border border-sky-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• 12 = 2² × 3¹</div>
  <div>• 18 = 2¹ × 3²</div>
  <div class="pt-1 text-sky-400">• Highest power of 2 = max(2, 1) = <strong>2²</strong></div>
  <div>• Highest power of 3 = max(1, 2) = <strong>3²</strong></div>
  <div class="text-emerald-400 font-bold text-sm pt-1">• LCM = 2² × 3² = 4 × 9 = 36</div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>Method 3: Common Simultaneous Division Method</h2>
<p>Divide all numbers simultaneously by prime numbers until all quotients become 1.</p>
""",
                    "audioText": "Lesson 3 covers LCM. For prime factorization, take the highest power of every prime factor involved to build the LCM.",
                    "audioTextHinglish": "LCM ke liye har prime factor ki highest power ko multiply karte hain.",
                    "keyInsight": "LCM via Prime Factorization = product of highest powers of every prime factor involved (2² × 3² = 36).",
                    "widgetType": "Class6FactorBrickLCMWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: Product Rule (HCF × LCM = a × b) & Real-World Applications",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>1. The Fundamental Product Relationship</h2>

<div class="my-4 p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-center text-emerald-400 text-lg font-bold">
  HCF(a, b) × LCM(a, b) = a × b
</div>

<p>The product of the HCF and LCM of any two numbers equals the product of the two numbers themselves!</p>

<hr class="my-6 border-slate-800"/>

<h2>2. Co-Prime Numbers</h2>
<p>Two numbers are called <strong>co-prime</strong> if their HCF is 1 (e.g. 8 and 15). For co-prime numbers: <strong>LCM = a × b</strong>.</p>

<hr class="my-6 border-slate-800"/>

<h2>3. Real-Life Problem Solving Rules</h2>
<ul>
  <li>If asked to divide or group into maximum size, maximum capacity, or longest tape ==> <strong>Calculate HCF</strong>.</li>
  <li>If asked about recurring simultaneous events (church bells ringing together, traffic lights blinking together, runners meeting on track) ==> <strong>Calculate LCM</strong>.</li>
</ul>
""",
                    "audioText": "Lesson 4 covers the Product Rule: HCF times LCM equals a times b. If a problem asks for maximum capacity calculate HCF, if it asks for recurring simultaneous events calculate LCM.",
                    "audioTextHinglish": "HCF into LCM product a into b ke barabar hota hai. Maximum capacity ke liye HCF nikalen aur simultaneous events ke liye LCM.",
                    "keyInsight": "HCF(a,b) × LCM(a,b) = a × b. Maximum size = HCF, Recurring events = LCM.",
                    "widgetType": "Class6SynchronizedBellsWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 5: 10 High-Yield Solved Board Exam Questions",
                    "readingTime": "~10 min read",
                    "narrative": """
<p>Here are <strong>10 Classic Class 6 Board Exam Questions</strong> with complete step-by-step solutions.</p>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 1: HCF and LCM by Prime Factorization</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find HCF and LCM of 12 and 18 using prime factorization.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• 12 = 2² × 3¹, 18 = 2¹ × 3²</div>
  <div>• HCF = 2¹ × 3¹ = 6</div>
  <div class="text-emerald-400 font-bold">• LCM = 2² × 3² = 36.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 2: Product Rule Verification</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> If HCF(12, b) = 6 and LCM(12, b) = 36, find number b.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• HCF × LCM = a × b ==> 6 × 36 = 12 × b ==> 216 = 12 × b</div>
  <div class="text-emerald-400 font-bold">• b = 216 / 12 = 18.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 3: Synchronized Church Bells</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Three church bells ring at intervals of 9, 12, and 15 minutes. If they ring together now, after how long will they ring together next?
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Simultaneous event ==> Calculate LCM(9, 12, 15).</div>
  <div>• 9 = 3², 12 = 2² × 3, 15 = 3 × 5 ==> LCM = 2² × 3² × 5 = 4 × 9 × 5 = 180 min.</div>
  <div class="text-emerald-400 font-bold">• 180 minutes (3 hours).</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 4: Maximum Capacity Oil Measuring Container</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find the maximum capacity container that can measure oil from 120 L and 180 L drums exactly.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Maximum capacity ==> Calculate HCF(120, 180).</div>
  <div>• 120 = 2³ × 3 × 5, 180 = 2² × 3² × 5 ==> HCF = 2² × 3 × 5 = 60.</div>
  <div class="text-emerald-400 font-bold">• Maximum capacity = 60 liters.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 5: Co-prime Test</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Check if 8 and 15 are co-prime and find their LCM.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Factors of 8: 1, 2, 4, 8. Factors of 15: 1, 3, 5, 15. HCF = 1 ==> Co-prime.</div>
  <div>• LCM = 8 × 15 = 120.</div>
  <div class="text-emerald-400 font-bold">• Yes co-prime, LCM = 120.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 6: Continued Division HCF</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find HCF of 144 and 180 using continued long division method.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• 180 ÷ 144 = 1 rem 36.</div>
  <div>• 144 ÷ 36 = 4 rem 0.</div>
  <div class="text-emerald-400 font-bold">• Final divisor HCF = 36.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 7: Maximum Floor Paving Tile</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find maximum side length of square tile to pave room 18 m × 12 m without cutting.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Maximum side = HCF(18, 12) = 6 m.</div>
  <div class="text-emerald-400 font-bold">• Tile side = 6 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 8: Divisibility Test of 11</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Test if 901351 is divisible by 11.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Odd pos sum (1+3+0) = 4. Even pos sum (5+1+9) = 15.</div>
  <div>• Difference = 15 - 4 = 11 (multiple of 11).</div>
  <div class="text-emerald-400 font-bold">• Yes, 901351 is divisible by 11.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 9: Least Number Remainder Problem</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find the least number which when divided by 6, 8, 12 leaves remainder 0.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Least number = LCM(6, 8, 12) = 24.</div>
  <div class="text-emerald-400 font-bold">• Number = 24.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 10: Even Prime Definition</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Explain why 2 is a unique prime number.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• 2 has exactly two factors (1 and 2) and it is the ONLY even prime number in mathematics.</div>
  <div class="text-emerald-400 font-bold">• Unique even prime.</div>
</div>
""",
                    "audioText": "In Lesson 5 we solve 10 classic Class 6 exam questions covering prime factorization, product rule, church bells, oil drums, co-prime tests, and continued division.",
                    "audioTextHinglish": "Lesson 5 me hum 10 solved Class 6 exam questions step by step solve karte hain.",
                    "keyInsight": "Review all 10 solved questions before taking the qualification exam.",
                    "widgetType": "Class6FactorsMultiplesVisualizerWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 6: Class 6 Master Qualification Exam (80% Pass Mark)",
                    "readingTime": "~10 min exam",
                    "narrative": """
<p>Congratulations on mastering Class 6 Playing with Numbers!</p>

<p>Pass the <strong>Class 6 Qualification Exam</strong> below to earn your chapter completion badge!</p>

<div class="my-4 p-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl space-y-3">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-base font-sans">
    <span class="material-symbols-outlined">workspace_premium</span>
    <span>Chapter Completion Requirement</span>
  </div>
  <ul class="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside font-sans">
    <li><strong>10 High-Yield Board Exam MCQs</strong> covering factors, multiples, HCF, LCM, and word problems.</li>
    <li><strong>Passing Score: 80% or higher</strong> (at least 8 out of 10 correct).</li>
    <li>Step-by-step solutions provided after every answer!</li>
  </ul>
</div>
""",
                    "audioText": "Lesson 6 is your Class 6 Qualification Test. Score 80 percent or higher to earn your Class 6 completion badge.",
                    "audioTextHinglish": "Lesson 6 aapka Class 6 Qualification Test hai. 80% score karke apna chapter completion badge earn karein.",
                    "keyInsight": "Score 80%+ to complete Class 6 Playing with Numbers!",
                    "widgetType": "Class6PlayingWithNumbersMCQExamWidget",
                    "widgetData": {}
                }
            ]
        }
        pn_topic.lesson_config_json = json.dumps(config)

        db.commit()
        print("Successfully seeded Class 6 Playing with Numbers topic and 6-lesson curriculum!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Playing with Numbers: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class6_playing_with_numbers()
