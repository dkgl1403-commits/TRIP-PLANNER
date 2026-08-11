import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_class11_12_structure():
    db = SessionLocal()
    try:
        # 1. Class 11
        class_11 = db.query(LearningClass).filter_by(level=11).first()
        if not class_11:
            class_11 = LearningClass(level=11, name="Class 11")
            db.add(class_11)
            db.flush()

        # Class 11 Mathematics
        math_11 = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_11.id).first()
        if not math_11:
            math_11 = LearningSubject(name="Mathematics", class_id=class_11.id)
            db.add(math_11)
            db.flush()

        # Class 11 Physics
        phys_11 = db.query(LearningSubject).filter_by(name="Physics", class_id=class_11.id).first()
        if not phys_11:
            phys_11 = LearningSubject(name="Physics", class_id=class_11.id)
            db.add(phys_11)
            db.flush()

        # 2. Class 12
        class_12 = db.query(LearningClass).filter_by(level=12).first()
        if not class_12:
            class_12 = LearningClass(level=12, name="Class 12")
            db.add(class_12)
            db.flush()

        # Class 12 Mathematics
        math_12 = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_12.id).first()
        if not math_12:
            math_12 = LearningSubject(name="Mathematics", class_id=class_12.id)
            db.add(math_12)
            db.flush()

        # Class 12 Physics
        phys_12 = db.query(LearningSubject).filter_by(name="Physics", class_id=class_12.id).first()
        if not phys_12:
            phys_12 = LearningSubject(name="Physics", class_id=class_12.id)
            db.add(phys_12)
            db.flush()

        # Seed Topics for Class 11 Mathematics
        topic_set_theory = db.query(LearningTopic).filter_by(name="Set Theory", subject_id=math_11.id).first()
        if not topic_set_theory:
            topic_set_theory = LearningTopic(
                subject_id=math_11.id,
                name="Set Theory",
                order_idx=1
            )
            db.add(topic_set_theory)
            db.flush()

        topic_prob_11 = db.query(LearningTopic).filter_by(name="Probability", subject_id=math_11.id).first()
        if not topic_prob_11:
            topic_prob_11 = LearningTopic(
                subject_id=math_11.id,
                name="Probability",
                order_idx=2
            )
            db.add(topic_prob_11)
            db.flush()

        # -------------------------------
        # CHAPTER 1: SET THEORY LESSON
        # -------------------------------
        set_theory_config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: What is a Set & The Master Key of Class 11",
                    "readingTime": "~4 min read",
                    "narrative": """
<p>Welcome to Class 11. Up until now in school, you have spent years working with single numbers, simple equations, and basic geometric shapes.</p>
<p>In Class 11, mathematics transforms. We stop looking at individual numbers and start working with <strong>collections of data</strong> called <strong>Sets</strong>. Set Theory is Chapter 1 of your Class 11 curriculum for a reason—it is the master key that unlocks Relations, Functions, Calculus, and Probability.</p>

<h3>What is a Set?</h3>
<p>A <strong>Set</strong> is a well-defined collection of distinct objects. "Well-defined" means there must be no ambiguity about whether an element belongs to the collection or not.</p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-emerald-400 text-sm">
  Set A = {x | x is a prime number less than 10} = {2, 3, 5, 7}
</div>

<h3>The 4 Core Operations You Must Master</h3>
<table class="w-full text-left my-4 border-collapse border border-slate-800 text-sm">
  <thead>
    <tr class="bg-slate-800 text-amber-400">
      <th class="p-2 border border-slate-700">Concept</th>
      <th class="p-2 border border-slate-700">Symbol</th>
      <th class="p-2 border border-slate-700">Plain English</th>
      <th class="p-2 border border-slate-700">Probability Meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border border-slate-800">
      <td class="p-2 border border-slate-700 font-bold text-sky-400">Union</td>
      <td class="p-2 border border-slate-700 font-mono">A ∪ B</td>
      <td class="p-2 border border-slate-700">"A, or B, or both." (Combine everything)</td>
      <td class="p-2 border border-slate-700">Event A happens OR Event B happens.</td>
    </tr>
    <tr class="border border-slate-800">
      <td class="p-2 border border-slate-700 font-bold text-indigo-400">Intersection</td>
      <td class="p-2 border border-slate-700 font-mono">A ∩ B</td>
      <td class="p-2 border border-slate-700">"Strictly where A and B overlap."</td>
      <td class="p-2 border border-slate-700">Event A AND Event B happen together.</td>
    </tr>
    <tr class="border border-slate-800">
      <td class="p-2 border border-slate-700 font-bold text-purple-400">Complement</td>
      <td class="p-2 border border-slate-700 font-mono">A' or A<sup>c</sup></td>
      <td class="p-2 border border-slate-700">"Everything outside of circle A."</td>
      <td class="p-2 border border-slate-700">Event A does NOT happen.</td>
    </tr>
    <tr class="border border-slate-800">
      <td class="p-2 border border-slate-700 font-bold text-pink-400">Difference</td>
      <td class="p-2 border border-slate-700 font-mono">A - B (or A ∩ B')</td>
      <td class="p-2 border border-slate-700">"Everything in A, minus any part touching B."</td>
      <td class="p-2 border border-slate-700">Event A happens, but Event B strictly does not.</td>
    </tr>
  </tbody>
</table>
""",
                    "audioText": "Welcome to Class 11. Up until now in school, you have spent years working with single numbers and simple equations. In Class 11, mathematics transforms. We stop looking at individual numbers and start working with collections of data called Sets. Set Theory is Chapter 1 of your Class 11 curriculum because it is the master key that unlocks Relations, Functions, Calculus, and Probability.",
                    "audioTextHinglish": "Class 11 me aapka swagat hai. Ab tak school me aap single numbers aur simple equations par kaam karte aaye hain. Class 11 me maths transform hota hai. Hum individual numbers ko dekhna chhod kar collections of data yani Sets par kaam karte hain.",
                    "keyInsight": "Set theory is not just another chapter — it is the universal language of higher mathematics.",
                    "widgetType": "SetTheoryVennDiagramExplorerWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: Types of Sets, Subsets & De Morgan's Laws",
                    "readingTime": "~5 min read",
                    "narrative": """
<p>Now that you know what a Set is, let's explore how sets are classified and the algebraic laws governing them.</p>

<hr class="my-6 border-slate-800"/>

<h3>1. Essential Types of Sets</h3>
<ul>
  <li><strong>Empty / Null Set (Ø or {}):</strong> A set containing zero elements. Example: {x | x is a natural number < 1}.</li>
  <li><strong>Singleton Set:</strong> A set containing exactly 1 element. Example: {0}.</li>
  <li><strong>Universal Set (S or U):</strong> The master set containing all possible elements under discussion.</li>
  <li><strong>Power Set P(A):</strong> The set of all possible subsets of set A. If n(A) = m, then n(P(A)) = 2ᵐ.</li>
</ul>

<hr class="my-6 border-slate-800"/>

<h3>2. De Morgan's Laws (Board Exam Core)</h3>
<p>De Morgan's Laws govern how complement operations interact with Union and Intersection:</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
  <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
    <div class="text-amber-400 font-bold font-mono text-base mb-1">Law 1: (A ∪ B)' = A' ∩ B'</div>
    <p class="text-xs text-slate-300">The complement of a union is the intersection of the individual complements.</p>
  </div>
  <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
    <div class="text-sky-400 font-bold font-mono text-base mb-1">Law 2: (A ∩ B)' = A' ∪ B'</div>
    <p class="text-xs text-slate-300">The complement of an intersection is the union of the individual complements.</p>
  </div>
</div>
""",
                    "audioText": "In Lesson 2, we cover types of sets such as empty set, singleton set, and power set. We also learn De Morgan's Laws, which state that the complement of a union equals the intersection of complements.",
                    "audioTextHinglish": "Lesson 2 me hum empty set, singleton set, aur power set ke baare me padhte hain. Saath hi De Morgan's Laws seekhte hain jo kehne me union ka complement individual complements ke intersection ke barabar hota hai.",
                    "keyInsight": "If a set has n elements, it has 2ⁿ total subsets, and 2ⁿ - 1 proper subsets.",
                    "widgetType": "SetTheoryVennDiagramExplorerWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: Solved Board Exam Questions on Set Theory",
                    "readingTime": "~6 min read",
                    "narrative": """
<p>Let's solve <strong>2 Classic Class 11 Board Exam Questions</strong> step by step.</p>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Solved Problem 1: Survey of 400 Students</h3>
<div class="my-3 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
  <p className="text-slate-200"><strong>Problem:</strong> In a survey of 400 students in a school, 100 were listed as taking Apple juice, 150 as taking Orange juice, and 75 were listed as taking both Apple and Orange juice. How many students were taking NEITHER Apple nor Orange juice?</p>
</div>

<div class="my-4 p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3 font-mono text-xs">
  <div class="text-emerald-400 font-bold text-sm">Detailed Solution:</div>
  <p>Let U = Universal set of students surveyed = 400.</p>
  <p>Let A = set of students taking Apple juice, n(A) = 100.</p>
  <p>Let B = set of students taking Orange juice, n(B) = 150.</p>
  <p>n(A ∩ B) = 75 (taking both).</p>
  
  <hr class="border-slate-800 my-2"/>

  <p><strong>Step 1: Find students taking AT LEAST ONE juice n(A ∪ B)</strong></p>
  <p>n(A ∪ B) = n(A) + n(B) - n(A ∩ B)</p>
  <p>n(A ∪ B) = 100 + 150 - 75 = 175 students.</p>

  <p><strong>Step 2: Find students taking NEITHER juice n((A ∪ B)')</strong></p>
  <p className="text-amber-300 font-bold">n(Neither) = n(U) - n(A ∪ B) = 400 - 175 = 225 students.</p>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Solved Problem 2: Finding Power Set Size</h3>
<div class="my-3 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
  <p className="text-slate-200"><strong>Problem:</strong> Two finite sets have m and n elements. The total number of subsets of the first set is 56 more than the total number of subsets of the second set. Find the values of m and n.</p>
</div>

<div class="my-4 p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3 font-mono text-xs">
  <div class="text-emerald-400 font-bold text-sm">Detailed Solution:</div>
  <p>Subsets of 1st set = 2ᵐ. Subsets of 2nd set = 2ⁿ.</p>
  <p>Given equation: 2ᵐ - 2ⁿ = 56</p>
  <p>Factor out 2ⁿ: 2ⁿ (2ᵐ⁻ⁿ - 1) = 56</p>
  <p>Write 56 as product of power of 2 and odd number: 56 = 8 × 7 = 2³ × (2³ - 1)</p>
  <p>Equating components:</p>
  <p>2ⁿ = 2³  ==&gt;  <strong>n = 3</strong></p>
  <p>2ᵐ⁻ⁿ - 1 = 7  ==&gt;  2ᵐ⁻³ = 8 = 2³  ==&gt;  m - 3 = 3  ==&gt;  <strong>m = 6</strong></p>
  <p class="text-amber-300 font-bold text-sm">Final Answer: m = 6, n = 3.</p>
</div>
""",
                    "audioText": "In Lesson 3, we solve step by step board exam problems. Problem 1 shows how to find students drinking neither apple nor orange juice, resulting in 225. Problem 2 solves an algebraic equation for power set sizes giving m equals 6 and n equals 3.",
                    "audioTextHinglish": "Lesson 3 me hum board exam problems solve karte hain. Problem 1 me neither juice lene wale 225 students nikalte hain. Problem 2 me power set sizes m=6 aur n=3 solve karte hain.",
                    "keyInsight": "Always express n(A ∪ B) = n(A) + n(B) - n(A ∩ B) before calculating set complement values.",
                    "widgetType": "SetTheoryVennDiagramExplorerWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: Set Theory Master Qualification Exam (80% Pass Mark)",
                    "readingTime": "~10 min exam",
                    "narrative": """
<p>Congratulations on completing the theory and solved examples of Chapter 1 Set Theory!</p>

<p>To officially earn your chapter completion badge, you must pass the <strong>Class 11 Set Theory Qualification Test</strong> below.</p>

<div class="my-4 p-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl space-y-3">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-base">
    <span class="material-symbols-outlined">workspace_premium</span>
    <span>Chapter Completion Requirement</span>
  </div>
  <ul class="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside">
    <li><strong>10 High-Yield MCQs</strong> covering set representations, subsets, De Morgan's laws, and Venn diagram word problems.</li>
    <li><strong>Passing Score: 80% or higher</strong> (at least 8 out of 10 correct).</li>
    <li>Step-by-step solutions are provided after every single answer!</li>
  </ul>
</div>
""",
                    "audioText": "Lesson 4 is your official Class 11 Set Theory Qualification Test. Answer 10 high yield questions and score 80% or higher to earn your Chapter 1 completion badge.",
                    "audioTextHinglish": "Lesson 4 aapka Set Theory Qualification Test hai. 10 questions me se kam se kam 80% score karein aur Chapter 1 badge unlock karein.",
                    "keyInsight": "Score 80%+ to achieve full Chapter 1 completion!",
                    "widgetType": "Class11SetTheoryMCQExamWidget",
                    "widgetData": {}
                }
            ]
        }
        topic_set_theory.lesson_config_json = json.dumps(set_theory_config)

        # -------------------------------
        # CHAPTER 2: CLASS 11 PROBABILITY LESSON
        # -------------------------------
        prob_11_config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: Moving Beyond Physical Objects to Pure Data",
                    "readingTime": "~5 min read",
                    "narrative": """
<p>Welcome to Class 11 Probability.</p>

<p>Up until now, we have solved problems by simply writing down a list of every possible outcome and counting them.</p>

<p>But what happens when the problem gets too big? What if a company wants to know the probability of a server crashing on a Tuesday, <em>or</em> during a power spike, <em>or</em> while undergoing maintenance? You can't write a list of "every possible outcome" for a global server network.</p>

<p>To solve real-world, complex problems, we must stop thinking about physical objects (like dice) and start thinking purely in terms of data. We do this by merging Probability with <strong>Set Theory</strong>.</p>

<hr class="my-6 border-slate-800"/>

<h2>The Translation</h2>

<p>In Class 11, we translate the language of probability into the language of sets.</p>

<ul>
  <li><strong>The Sample Space (S)</strong> becomes the <strong>Universal Set</strong>. It is a giant box containing every piece of data in our universe.</li>
  <li><strong>Events (E)</strong> become <strong>Subsets</strong>. These are smaller circles of specific data living inside the giant box.</li>
</ul>

<p>Once we turn events into circles, we can use Venn Diagrams to visualize how they interact.</p>

<p>Here are the three most important translations you need to master:</p>

<ol>
  <li>
    <strong>"A and B" (Intersection ∩):</strong><br/>
    When we want the probability of Event A <em>and</em> Event B happening at the same time, we look at the exact middle where the two circles overlap.
    <div class="my-3 p-3 bg-slate-900 rounded-lg text-center font-mono text-indigo-400 text-lg">P(A ∩ B)</div>
  </li>
  <li>
    <strong>"A or B" (Union ∪):</strong><br/>
    When we want the probability of Event A <em>or</em> Event B happening (or both!), we want all the data contained in both circles combined.
    <div class="my-3 p-3 bg-slate-900 rounded-lg text-center font-mono text-sky-400 text-lg">P(A ∪ B)</div>
  </li>
  <li>
    <strong>"Mutually Exclusive" (Disjoint Sets):</strong><br/>
    If Event A and Event B can never happen at the same time (like a baby being born on a Monday <em>and</em> a Tuesday), the two circles do not overlap at all.
  </li>
</ol>

<hr class="my-6 border-slate-800"/>

<h2>The Addition Theorem</h2>

<p>This is the crown jewel of Class 11 probability. It is a formula that prevents a very specific, very dangerous mathematical error: <strong>Double Counting.</strong></p>

<p>Let's look at a classic problem:</p>
<blockquote class="my-3 p-3 bg-slate-950 border-l-4 border-amber-500 italic text-slate-300">
  You draw one card from a standard deck of 52. What is the probability that the card is a Heart OR a Face Card (Jack, Queen, King)?
</blockquote>

<p>Let's try to solve it using basic logic:</p>
<ul>
  <li>Probability of a Heart P(H) = 13/52</li>
  <li>Probability of a Face Card P(F) = 12/52</li>
</ul>

<p>If we just add them together, we get 25/52. <strong>This is wrong.</strong></p>

<p>Why? Because the Jack of Hearts, Queen of Hearts, and King of Hearts are <em>both</em> Hearts and Face Cards. By simply adding the two fractions, we counted those three cards twice. We counted them once in the "Hearts" circle, and again in the "Face Cards" circle.</p>

<p>To fix this, we use the <strong>Addition Theorem</strong>:</p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-amber-400 text-xl font-bold">
  P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
</div>

<p>In plain English: <em>"To find the total probability of A or B, add circle A and circle B together, but then <strong>subtract the overlapping middle section once</strong> so you don't double-count it."</em></p>

<p>Let's apply the theorem to our card problem:</p>
<ul>
  <li>P(H) = 13/52</li>
  <li>P(F) = 12/52</li>
  <li>P(H ∩ F) (The overlap: Hearts that are also Face Cards) = 3/52</li>
</ul>

<div class="my-3 p-3 bg-slate-900 rounded-lg text-center font-mono text-emerald-400">
  P(H ∪ F) = 13/52 + 12/52 - 3/52 = 22/52 = 11/26
</div>

<h3>Moving Beyond Objects</h3>
<p>By translating probability into Set Theory, we have liberated the math. We don't need dice or cards anymore. If a medical researcher tells you:</p>
<ul>
  <li>P(Fever) = 0.6</li>
  <li>P(Cough) = 0.5</li>
  <li>P(Fever and Cough) = 0.3</li>
</ul>
<p>You can instantly calculate P(Fever ∪ Cough) = 0.6 + 0.5 - 0.3 = <strong>0.8</strong>. This is the algebraic engine of Class 11.</p>
""",
                    "audioText": "Welcome to Class 11 Probability. Up until now, we have solved problems by simply writing down a list of every possible outcome and counting them. But to solve real world, complex problems, we must stop thinking about physical objects like dice and start thinking purely in terms of data. We do this by merging Probability with Set Theory. In Class 11, the Sample Space becomes the Universal Set, and Events become Subsets inside the giant box.",
                    "audioTextHinglish": "Class 11 Probability me aapka swagat hai. Ab tak hum har possible outcome ki list banakar count karte the. Lekin real-world complex problems solve karne ke liye hume physical objects jaise dice ki bajaye purely data ke terms me sochna hoga. Hum Probability ko Set Theory ke saath merge karte hain. Sample space Universal Set ban jata hai aur Events Subsets ban jate hain.",
                    "keyInsight": "The Addition Theorem P(A ∪ B) = P(A) + P(B) - P(A ∩ B) prevents double counting the overlapping middle section.",
                    "widgetType": "Class11AdditionTheoremWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: The Three Edge Cases of Board Exams",
                    "readingTime": "~5 min read",
                    "narrative": """
<p>While the Addition Theorem is the star of Class 11, board exam questions in Section C test three specific edge cases of Set Theory that separate top scorers.</p>

<hr class="my-6 border-slate-800"/>

<h2>1. "A but not B" (The Crescent Moon)</h2>

<p>Board exams love to test the <strong>Difference of Sets</strong>: finding the probability that Event A happens, but Event B <em>strictly does not</em>.</p>

<p><strong>The Setup:</strong> In a school, 60% of students play Cricket (C), 30% play Football (F), and 10% play both. What is the probability that a student plays <strong>Cricket ONLY</strong> (Cricket, but not Football)?</p>

<p>Students often just say 60%. But that 60% circle <em>includes</em> the 10% who also play Football.</p>

<p><strong>The Formula:</strong> To find "A but not B" (written mathematically as A ∩ B' or A - B), we take the entire circle of A and "bite out" the overlapping middle section.</p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-amber-400 text-lg">
  P(A ∩ B') = P(A) - P(A ∩ B)
</div>

<p>In our problem: P(Cricket Only) = 0.60 - 0.10 = <strong>0.50</strong>.</p>
<p><em>"When they ask for 'Only A', find the crescent moon!"</em></p>

<hr class="my-6 border-slate-800"/>

<h2>2. Mutually Exclusive vs. Exhaustive Events</h2>

<p>Students frequently confuse these two foundational concepts:</p>

<ul>
  <li>
    <strong>Mutually Exclusive (No Overlap):</strong> They cannot happen together.<br/>
    <em>Example:</em> Rolling a 2 and rolling a 3 on a single die toss (P(A ∩ B) = 0).
  </li>
  <li>
    <strong>Exhaustive (Fills the Box):</strong> When combined, these events account for 100% of the Sample Space.<br/>
    <em>Example:</em> Rolling a number &lt; 4, and rolling a number &gt; 2. Together they cover {1, 2, 3, 4, 5, 6}.
  </li>
</ul>

<p><strong>The Board Exam Trap (MEE):</strong><br/>
Examiners love events that are Mutually Exclusive AND Exhaustive (MEE). If events A, B, and C are MEE, their probabilities must sum to exactly 1:</p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-emerald-400 text-lg">
  P(A) + P(B) + P(C) = 1
</div>

<hr class="my-6 border-slate-800"/>

<h2>3. The Axiomatic Approach (Kolmogorov's Rules)</h2>

<p>In Class 11, Russian mathematician Andrey Kolmogorov formalized probability into three unbreakable laws called <strong>Axioms</strong>:</p>

<ol>
  <li><strong>Axiom of Positivity:</strong> No probability can be negative. (P(E) ≥ 0)</li>
  <li><strong>Axiom of Certainty:</strong> The probability of the entire sample space happening is 100%. (P(S) = 1)</li>
  <li><strong>Axiom of Additivity:</strong> If two events are mutually exclusive, P(A ∪ B) = P(A) + P(B).</li>
</ol>

<blockquote class="my-4 p-4 bg-slate-900 border-l-4 border-purple-500 text-slate-300">
  <strong>Why Axioms?</strong> Classical probability (Class 10) assumed outcomes are "equally likely" (like a perfect coin). The Axiomatic approach works even when coins are weighted or dice are loaded in real-world engineering!
</blockquote>
""",
                    "audioText": "Board exam examiners love three specific edge cases. First, A but not B, which represents the crescent moon shape where you take circle A and subtract the overlap. Second, the difference between Mutually Exclusive events which do not overlap, and Exhaustive events which cover the entire sample space. Third, Kolmogorov's Axiomatic approach which gives us three unbreakable laws of probability.",
                    "audioTextHinglish": "Board exams me teen specific edge cases sabse zyada pooche jaate hain. Pehla, A but not B jise Crescent Moon kehte hain — jisme circle A se overlap ko minus karte hain. Doosra, Mutually Exclusive aur Exhaustive events me difference. Teesra, Kolmogorov ka Axiomatic Approach jo probability ke teen unbreakable laws deta hai.",
                    "keyInsight": "Mastering Crescent Moon (A - B), MEE events, and Kolmogorov's Axioms equips you for Section C board exam questions.",
                    "widgetType": "Class11EdgeCasesWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: High-Yield Solved Board Exam Examples",
                    "readingTime": "~6 min read",
                    "narrative": """
<p>Theory is only half the battle. Let's walk step-by-step through <strong>3 Classic Class 11 Board Exam Questions</strong> with complete detailed solutions.</p>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Solved Example 1: The Dual-Subject Student Problem</h3>
<div class="my-3 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
  <p className="text-slate-200"><strong>Problem:</strong> In a class of 60 students, 30 opted for NCC, 32 opted for NSS, and 24 opted for both NCC and NSS. If one student is selected at random, find the probability that:</p>
  <ol class="list-decimal list-inside text-slate-300 text-sm space-y-1">
    <li>The student opted for NCC or NSS.</li>
    <li>The student opted for Neither NCC nor NSS.</li>
    <li>The student opted for NSS ONLY.</li>
  </ol>
</div>

<div class="my-4 p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3 font-mono text-xs">
  <div class="text-emerald-400 font-bold text-sm">Detailed Solution:</div>
  <p>Let N = Set of students opting for NCC, and S = Set of students opting for NSS.</p>
  <p>Total sample space n(S_total) = 60.</p>
  <p>P(N) = 30/60 = 0.50, P(S) = 32/60 = 0.5333, P(N ∩ S) = 24/60 = 0.40.</p>
  
  <hr class="border-slate-800 my-2"/>

  <p><strong>Part (i): P(NCC or NSS) = P(N ∪ S)</strong></p>
  <p class="text-amber-300 font-bold">P(N ∪ S) = P(N) + P(S) - P(N ∩ S) = 30/60 + 32/60 - 24/60 = 38/60 = 19/30 ≈ 0.633</p>

  <p><strong>Part (ii): P(Neither NCC nor NSS) = P((N ∪ S)')</strong></p>
  <p class="text-amber-300 font-bold">P(Neither) = 1 - P(N ∪ S) = 1 - 38/60 = 22/60 = 11/30 ≈ 0.367</p>

  <p><strong>Part (iii): P(NSS Only) = P(S ∩ N')</strong></p>
  <p class="text-amber-300 font-bold">P(S ∩ N') = P(S) - P(N ∩ S) = 32/60 - 24/60 = 8/60 = 2/15 ≈ 0.133</p>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Solved Example 2: The Three Mutually Exclusive Events</h3>
<div class="my-3 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
  <p className="text-slate-200"><strong>Problem:</strong> Three events A, B, and C are mutually exclusive and exhaustive. Find P(A) if P(B) = 1.5 · P(A) and P(C) = 0.5 · P(B).</p>
</div>

<div class="my-4 p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3 font-mono text-xs">
  <div class="text-emerald-400 font-bold text-sm">Detailed Solution:</div>
  <p>Since A, B, and C are Mutually Exclusive and Exhaustive (MEE), their sum is 1:</p>
  <div class="p-2 bg-slate-900 text-center font-bold text-amber-400 text-sm">P(A) + P(B) + P(C) = 1</div>
  <p>Express P(B) and P(C) in terms of P(A):</p>
  <p>P(B) = 1.5 · P(A)</p>
  <p>P(C) = 0.5 · P(B) = 0.5 · (1.5 · P(A)) = 0.75 · P(A)</p>
  <p>Substitute into the MEE equation:</p>
  <p>P(A) + 1.5 P(A) + 0.75 P(A) = 1</p>
  <p>3.25 P(A) = 1  ==&gt;  (13/4) P(A) = 1</p>
  <p class="text-amber-300 font-bold text-sm">P(A) = 4/13 ≈ 0.3077</p>
</div>
""",
                    "audioText": "In Lesson 3, we work through high yield board exam examples. In Example 1, we calculate P of NCC or NSS by applying the Addition Theorem, finding 19 over 30. In Example 2, we use the rule that Mutually Exclusive and Exhaustive events sum to 1 to solve for P of A.",
                    "audioTextHinglish": "Lesson 3 me hum high-yield board exam examples solve karte hain. Example 1 me hum Addition Theorem ka use karke 19 by 30 nikalte hain. Example 2 me Mutually Exclusive and Exhaustive events ka sum 1.0 karke P of A calculate karte hain.",
                    "keyInsight": "Always set up P(A ∪ B) = P(A) + P(B) - P(A ∩ B) and identify MEE rules before starting calculations.",
                    "widgetType": "Class11AdditionTheoremWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: Master Practice Exam (80% Passing Mark)",
                    "readingTime": "~10 min exam",
                    "narrative": """
<p>Congratulations on completing the core concepts of Class 11 Probability!</p>

<p>To officially earn your chapter completion badge, you must pass the <strong>Class 11 Board Exam Qualification Test</strong> below.</p>

<div class="my-4 p-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl space-y-3">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-base">
    <span class="material-symbols-outlined">workspace_premium</span>
    <span>Chapter Completion Requirement</span>
  </div>
  <ul class="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside">
    <li><strong>10 High-Yield MCQs</strong> covering Set Theory translations, Addition Theorem, Crescent Moon, and Kolmogorov's Axioms.</li>
    <li><strong>Passing Score: 80% or higher</strong> (at least 8 out of 10 correct).</li>
    <li>Step-by-step solutions are provided after every single answer!</li>
  </ul>
</div>
""",
                    "audioText": "Lesson 4 is your official Class 11 Board Exam Qualification Test. Answer 10 high yield multiple choice questions. You must score 80% or higher, which means 8 out of 10, to pass and earn your chapter completion badge.",
                    "audioTextHinglish": "Lesson 4 aapka official Class 11 Qualification Test hai. 10 high-yield multiple choice questions ka answer dein. Chapter completion badge paane ke liye aapko kam se kam 80% yani 8 out of 10 score karna hoga.",
                    "keyInsight": "Score 80%+ to achieve full chapter completion!",
                    "widgetType": "Class11ProbabilityMCQExamWidget",
                    "widgetData": {}
                }
            ]
        }
        topic_prob_11.lesson_config_json = json.dumps(prob_11_config)

        # -------------------------------
        # CLASS 12 MATHEMATICS: PROBABILITY
        # -------------------------------
        topic_prob_12 = db.query(LearningTopic).filter_by(name="Probability", subject_id=math_12.id).first()
        if not topic_prob_12:
            topic_prob_12 = LearningTopic(
                subject_id=math_12.id,
                name="Probability",
                order_idx=1
            )
            db.add(topic_prob_12)
            db.flush()

        prob_12_config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: Conditional Probability & The Detective's Flashlight",
                    "readingTime": "~6 min read",
                    "narrative": """
<p>Welcome to the apex. You are about to learn the most powerful mathematical tool in the high school syllabus.</p>

<p>Up until now, probability has been static. In Class 10 and 11, we set up a universe, counted the outcomes, and calculated a fixed fraction. But in the real world, information changes dynamically.</p>

<p>In Class 12, we transition to <strong>Dynamic Probability</strong>. We learn how to mathematically update our beliefs when new evidence is introduced.</p>

<hr class="my-6 border-slate-800"/>

<h2>The Detective Metaphor: Standing in Mumbai</h2>

<p>Imagine you are a detective standing in the middle of Mumbai. The city has 20 million people. The Universal Set S (the Sample Space) is massive.</p>

<p>If I ask you the probability of finding a fleeing diamond thief at random, it is virtually zero. You are standing in the dark.</p>

<p>Suddenly, a constable runs up to you with a new piece of evidence (a <strong>Condition</strong>):</p>
<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-amber-500 italic text-amber-300">
  "Inspector! A witness just saw him heading toward the railway stations."
</blockquote>

<p>What just happened mathematically? <strong>Your universe shrank.</strong></p>

<p>You don't care about the 20 million people in Mumbai anymore. You don't care about the airports or highways. Your entire denominator is now <em>only</em> the railway stations.</p>

<p>This is <strong>Conditional Probability</strong>, written as <strong>P(A|B)</strong>. The vertical line <code>|</code> is the beam of your flashlight. You are looking for the probability of finding the thief (Event A), <em>given the condition</em> (Event B) that he is at a railway station.</p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-amber-400 text-xl font-bold">
  P(A|B) = P(A ∩ B) / P(B)
</div>

<p><em>Translation:</em> Take the probability of both things happening (A ∩ B), and divide it by the probability of the new condition (B).</p>

<hr class="my-6 border-slate-800"/>

<h3>The Die Example: Shrinking Universe</h3>
<p>Let's look at a die toss. What is P(rolling a 6)? Sample space S = {1, 2, 3, 4, 5, 6}. P(6) = 1/6.</p>
<p>Now, I roll the die, cover it with my hand, peek at it, and tell you: <em>"The number is even."</em></p>
<p>Has the probability of it being a 6 changed? <strong>Yes!</strong> Your sample space shrank from 6 possibilities to only {2, 4, 6}.</p>
<div class="my-3 p-3 bg-slate-900 rounded-lg text-center font-mono text-emerald-400 font-bold">
  P(6 | Even) = 1/3
</div>

<hr class="my-6 border-slate-800"/>

<h3>The Independence Trap</h3>
<p>Examiners will immediately try to trap students here with <strong>Independent Events</strong>. If Event A happening doesn't care at all about Event B happening (like rolling a die and flipping a coin at the same time), knowing B occurred changes nothing:</p>
<div class="my-3 p-3 bg-slate-900 rounded-lg text-center font-mono text-purple-400">
  P(A|B) = P(A)  ==&gt;  P(A ∩ B) = P(A) · P(B)
</div>
""",
                    "audioText": "Welcome to Class 12 Probability. Up until now probability has been static. In Class 12 we transition to Dynamic Probability where we update our beliefs as new evidence arrives. Conditional Probability P of A given B asks what is the probability of Event A given that Event B has already occurred. The vertical bar acts like a detective flashlight shrinking the sample space denominator.",
                    "audioTextHinglish": "Class 12 Probability me aapka swagat hai. Class 12 me hum Dynamic Probability seekhte hain jaha naye evidence ke saath probability update hoti hai. Conditional Probability P of A given B me vertical bar ek detective flashlight ki tarah kaam karta hai jo universe ko shrink kar deta hai.",
                    "keyInsight": "Conditional Probability P(A|B) = P(A ∩ B) / P(B) shrinks your denominator to only the given condition B.",
                    "widgetType": "DetectiveBayesSimulatorWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: Law of Total Probability & The 3 Escape Vehicles",
                    "readingTime": "~6 min read",
                    "narrative": """
<p>Before we can reach Bayes' Theorem, we must learn how to break a massive real-world problem into smaller branching paths. This is called the <strong>Law of Total Probability</strong>.</p>

<hr class="my-6 border-slate-800"/>

<h2>The Detective Metaphor: The Three Getaways</h2>

<p>We rush to the Mumbai railway sector. The diamond thief is panicking. He has three ways to escape the city, but they aren't equally likely because he is in a hurry:</p>

<ul>
  <li>He has a <strong>40% chance P(Taxi) = 0.40</strong> of jumping into a Taxi.</li>
  <li>He has a <strong>50% chance P(Train) = 0.50</strong> of sneaking onto a Local Train.</li>
  <li>He has a <strong>10% chance P(Bike) = 0.10</strong> of stealing a Bicycle.</li>
</ul>

<p>Now, as the lead detective, you know the security grid of Mumbai:</p>
<ul>
  <li>If he takes a Taxi, there is a <strong>30% chance P(Caught|Taxi) = 0.30</strong> he gets caught in traffic at a police checkpoint.</li>
  <li>If he takes the Train, there is a <strong>20% chance P(Caught|Train) = 0.20</strong> a ticket checker catches him.</li>
  <li>If he takes a Bicycle, there is an <strong>80% chance P(Caught|Bike) = 0.80</strong> a beat cop sees him pedaling frantically.</li>
</ul>

<p><strong>The Question:</strong> What is the <em>total</em> probability P(Caught) that the thief gets caught today?</p>

<p>You cannot just add the police catch rates together! You must multiply each vehicle's catch rate by how likely he was to choose that vehicle, and add the paths together:</p>

<div class="space-y-2 font-mono text-xs my-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
  <div class="text-sky-400">• Path 1 (Taxi & Caught): 0.40 × 0.30 = 0.12 (12%)</div>
  <div class="text-indigo-400">• Path 2 (Train & Caught): 0.50 × 0.20 = 0.10 (10%)</div>
  <div class="text-pink-400">• Path 3 (Bike & Caught): 0.10 × 0.80 = 0.08 (8%)</div>
  <div class="text-emerald-400 font-bold border-t border-slate-800 pt-2 text-sm">
    Total Probability P(Caught) = 0.12 + 0.10 + 0.08 = 0.30 (30%)
  </div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>The General Mathematical Formula</h2>
<p>If events B₁, B₂, ..., Bₙ partition the sample space, then for any event E:</p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-amber-400 text-lg font-bold">
  P(E) = ∑ [ P(E | Bᵢ) · P(Bᵢ) ]
</div>

<p><em>Think of it as a weighted average across all possible branches of reality.</em></p>
""",
                    "audioText": "In Lesson 2 we explore the Law of Total Probability using the three getaway vehicles metaphor. To find the total probability of catching the suspect, we trace each branch of reality by multiplying the vehicle choice probability by the catch rate and adding all three paths together to get 30 percent.",
                    "audioTextHinglish": "Lesson 2 me hum Law of Total Probability seekhte hain teen escape vehicles ke through. Har vehicle ke choice probability ko catch rate se multiply karke teeno paths add karte hain jisse total probability 30 percent milti hai.",
                    "keyInsight": "The Law of Total Probability sums up all weighted branches leading to an outcome: P(E) = ∑ P(E|Bᵢ)P(Bᵢ).",
                    "widgetType": "DetectiveBayesSimulatorWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: Bayes' Theorem & The Medical False Positive Paradox",
                    "readingTime": "~7 min read",
                    "narrative": """
<p>This is it. Named after Reverend Thomas Bayes, <strong>Bayes' Theorem</strong> is the crown jewel of probability. It allows us to <strong>reverse time and conditions</strong>.</p>

<p>If we know P(Effect | Cause), Bayes allows us to calculate <strong>P(Cause | Effect)</strong>.</p>

<hr class="my-6 border-slate-800"/>

<h2>The Detective Metaphor: The Phone Call</h2>

<p>You are sitting in the Mumbai police station drinking chai. The phone rings. It's the dispatch officer:</p>
<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-emerald-500 italic text-emerald-300 font-bold">
  "Inspector... we caught him."
</blockquote>

<p>The event has happened. P(Caught) is now 100%. But as a detective, you want to know <em>how</em> it happened.</p>

<p><strong>The Bayes Question:</strong> GIVEN that he was caught, what is the probability that he tried to escape in a <strong>Taxi</strong>?</p>
<p>We are looking for <strong>P(Taxi | Caught)</strong>.</p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-amber-400 text-lg">
  P(Specific Cause | Effect) = (The specific path we want) / (Sum of ALL paths that lead to effect)
</div>

<ol class="space-y-2 text-sm my-4">
  <li><strong>Specific path we want (Taxi & Caught):</strong> 0.40 × 0.30 = <strong>0.12</strong></li>
  <li><strong>ALL paths leading to effect P(Caught):</strong> 0.12 + 0.10 + 0.08 = <strong>0.30</strong></li>
  <li><strong>Apply Bayes:</strong> P(Taxi | Caught) = 0.12 / 0.30 = <strong>0.40 (40%)</strong></li>
</ol>

<p>There is exactly a 40% chance that the arrested suspect is sitting in the back of a taxi!</p>

<hr class="my-6 border-slate-800"/>

<h2>The Master Example: The Medical False Positive Paradox</h2>

<p>To understand the sheer real-world power of Bayes, consider this medical paradox:</p>

<ul>
  <li>A rare disease affects <strong>1%</strong> of the population.</li>
  <li>A medical test is <strong>99% accurate</strong> (catches 99% of sick people, correctly clears 99% of healthy people).</li>
</ul>

<p>You test <strong>POSITIVE</strong>. What is the chance you actually have the disease?</p>

<p>Most people guess 99%. <strong>The actual answer is only 50%!</strong></p>

<div class="my-4 p-4 bg-slate-950 border border-rose-500/30 rounded-xl font-mono text-xs space-y-2">
  <div class="text-rose-400 font-bold">Why? Let's apply Bayes:</div>
  <div>• Path 1 (Sick & Positive): 0.01 × 0.99 = 0.0099</div>
  <div>• Path 2 (Healthy & False Positive): 0.99 × 0.01 = 0.0099</div>
  <div>• Total Positive Tests = 0.0099 + 0.0099 = 0.0198</div>
  <div class="text-amber-300 font-bold text-sm pt-1">
    P(Disease | Positive) = 0.0099 / 0.0198 = 0.50 (50%)
  </div>
</div>

<p>Because the disease is so rare, the massive volume of healthy people creates false positives that drown out true sick cases!</p>
""",
                    "audioText": "Lesson 3 introduces Bayes Theorem. While the Law of Total Probability looks forward into the future, Bayes Theorem looks backward into the past. Given an effect, Bayes Theorem calculates the probability of a specific cause by taking the specific path divided by the sum of all paths.",
                    "audioTextHinglish": "Lesson 3 me hum Bayes Theorem seekhte hain. Total probability aage ka rasta dekhta hai jabki Bayes Theorem piche mood kar past ke cause ko calculate karta hai. Effect milne par specific path ko total paths se divide karte hain.",
                    "keyInsight": "Bayes' Theorem P(Bᵢ|A) = [P(A|Bᵢ)P(Bᵢ)] / [∑ P(A|Bⱼ)P(Bⱼ)] reverses conditional probability from effect back to cause.",
                    "widgetType": "MedicalFalsePositiveCalculatorWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: Class 12 Master Apex Qualification Exam (80% Pass Mark)",
                    "readingTime": "~10 min exam",
                    "narrative": """
<p>Congratulations on mastering the apex of high school mathematics — Class 12 Probability!</p>

<p>To officially earn your Class 12 completion badge, you must pass the <strong>Class 12 Qualification Exam</strong> below.</p>

<div class="my-4 p-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl space-y-3">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-base">
    <span class="material-symbols-outlined">workspace_premium</span>
    <span>Class 12 Apex Completion Requirement</span>
  </div>
  <ul class="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside">
    <li><strong>10 High-Yield Board Exam MCQs</strong> covering Conditional Probability, Independent Events, Law of Total Probability, and Bayes' Theorem.</li>
    <li><strong>Passing Score: 80% or higher</strong> (at least 8 out of 10 correct).</li>
    <li>Step-by-step solutions are provided after every single answer!</li>
  </ul>
</div>
""",
                    "audioText": "Lesson 4 is your official Class 12 Probability Apex Qualification Test. Answer 10 board exam MCQs. You must score 80% or higher to earn your Class 12 completion badge.",
                    "audioTextHinglish": "Lesson 4 aapka Class 12 Qualification Test hai. 10 MCQs me se 80% score karein aur Class 12 completion badge unlock karein.",
                    "keyInsight": "Score 80%+ to complete the Class 12 Mathematics curriculum!",
                    "widgetType": "Class12ProbabilityMCQExamWidget",
                    "widgetData": {}
                }
            ]
        }
        topic_prob_12.lesson_config_json = json.dumps(prob_12_config)

        db.commit()
        print("Successfully seeded Class 11 and 12 structure with Set Theory, Class 11 & Class 12 Probability lessons!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 11/12 structure: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class11_12_structure()

