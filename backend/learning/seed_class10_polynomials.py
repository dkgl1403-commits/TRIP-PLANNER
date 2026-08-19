import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_class10_polynomials():
    db = SessionLocal()
    try:
        class_10 = db.query(LearningClass).filter_by(level=10).first()
        if not class_10:
            class_10 = LearningClass(level=10, name="Class 10")
            db.add(class_10)
            db.flush()

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_10.id).first()
        if not math_subject:
            math_subject = LearningSubject(name="Mathematics", class_id=class_10.id)
            db.add(math_subject)
            db.flush()

        poly_topic = db.query(LearningTopic).filter_by(name="Polynomials", subject_id=math_subject.id).first()
        if not poly_topic:
            poly_topic = LearningTopic(
                subject_id=math_subject.id,
                name="Polynomials",
                order_idx=2
            )
            db.add(poly_topic)
            db.flush()

        config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: Core Definitions & Geometrical Meaning of Zeroes",
                    "readingTime": "~6 min read",
                    "narrative": """
<p>Welcome to Class 10 <strong>Polynomials</strong>! A polynomial is an algebraic expression composed of variables, constants, and exponents combined using addition, subtraction, and multiplication, where exponents are strictly non-negative integers.</p>

<hr class="my-6 border-slate-800"/>

<h2>1. Polynomial Classification by Degree</h2>
<table class="w-full text-xs font-mono border border-slate-800 my-4">
  <tr class="bg-slate-950 text-amber-400">
    <th class="p-2 border border-slate-800">Type</th>
    <th class="p-2 border border-slate-800">General Form</th>
    <th class="p-2 border border-slate-800">Degree</th>
    <th class="p-2 border border-slate-800">Max Zeroes</th>
    <th class="p-2 border border-slate-800">Graph Shape</th>
  </tr>
  <tr>
    <td class="p-2 border border-slate-800 font-bold text-slate-300">Linear</td>
    <td class="p-2 border border-slate-800">p(x) = ax + b (a ≠ 0)</td>
    <td class="p-2 border border-slate-800">1</td>
    <td class="p-2 border border-slate-800">1</td>
    <td class="p-2 border border-slate-800">Straight Line</td>
  </tr>
  <tr class="bg-amber-950/30">
    <td class="p-2 border border-slate-800 font-bold text-amber-300">Quadratic</td>
    <td class="p-2 border border-slate-800 text-amber-300 font-bold">p(x) = ax² + bx + c (a ≠ 0)</td>
    <td class="p-2 border border-slate-800">2</td>
    <td class="p-2 border border-slate-800">2</td>
    <td class="p-2 border border-slate-800 font-bold">Parabola (∪ or ∩)</td>
  </tr>
  <tr>
    <td class="p-2 border border-slate-800 font-bold text-purple-300">Cubic</td>
    <td class="p-2 border border-slate-800">p(x) = ax³ + bx² + cx + d</td>
    <td class="p-2 border border-slate-800">3</td>
    <td class="p-2 border border-slate-800">3</td>
    <td class="p-2 border border-slate-800">S-curve</td>
  </tr>
</table>

<hr class="my-6 border-slate-800"/>

<h2>2. Geometrical Meaning of Zeroes</h2>
<ul>
  <li><strong>Graphical Rule:</strong> The real zeroes of y = p(x) are the exact <strong>x-coordinates of points where the graph intersects or touches the x-axis</strong>.</li>
  <li><strong>Parabola Orientation:</strong>
    <ul>
      <li>a &gt; 0: Parabola opens <strong>upward</strong> (∪).</li>
      <li>a &lt; 0: Parabola opens <strong>downward</strong> (∩).</li>
    </ul>
  </li>
  <li><strong>Discriminant (D = b² - 4ac):</strong>
    <ul>
      <li><strong>D &gt; 0:</strong> Cuts x-axis at 2 distinct points (2 real zeroes).</li>
      <li><strong>D = 0:</strong> Touches x-axis at 1 point (1 coincident real zero).</li>
      <li><strong>D &lt; 0:</strong> Does not touch x-axis (0 real zeroes).</li>
    </ul>
  </li>
</ul>
""",
                    "audioText": "Welcome to Class 10 Polynomials. The real zeroes of a polynomial are the exact x coordinates where the graph intersects or touches the x axis.",
                    "audioTextHinglish": "Class 10 Polynomials me aapka swagat hai. Real zeroes graph ke x axis intersection points ke x coordinates hote hain.",
                    "keyInsight": "Real zeroes = x-coordinates where graph y = p(x) intersects the x-axis.",
                    "widgetType": "Class10PolynomialsParabolaVisualizerWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: Proofs of Remainder & Factor Theorems",
                    "readingTime": "~8 min read",
                    "narrative": """
<h2>1. Proof of the Remainder Theorem</h2>
<p><strong>Statement:</strong> Let p(x) be any polynomial of degree n ≥ 1, and let a be any real number. If p(x) is divided by (x - a), the remainder is p(a).</p>

<div class="my-3 p-4 bg-slate-950 border border-amber-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-2">
  <div class="font-bold text-amber-400">Proof:</div>
  <div>By Division Algorithm: p(x) = (x - a)·q(x) + r(x)</div>
  <div>Since deg(x - a) = 1, deg(r(x)) &lt; 1 ==> r(x) = R (constant).</div>
  <div>p(x) = (x - a)·q(x) + R</div>
  <div>Substitute x = a:</div>
  <div>p(a) = (a - a)·q(a) + R = 0·q(a) + R = R</div>
  <div class="text-emerald-400 font-bold text-sm">Hence, Remainder R = p(a). ■</div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>2. Proof of the Factor Theorem</h2>
<p><strong>Statement:</strong> (x - a) is a factor of p(x) if and only if p(a) = 0.</p>

<div class="my-3 p-4 bg-slate-950 border border-sky-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-2">
  <div class="font-bold text-sky-400">Proof:</div>
  <div>By Remainder Theorem: p(x) = (x - a)·q(x) + p(a).</div>
  <div>• If p(a) = 0 ==> p(x) = (x - a)·q(x) ==> (x - a) is a factor.</div>
  <div>• Conversely, if (x - a) is a factor ==> p(x) = (x - a)·g(x) ==> p(a) = (a - a)·g(a) = 0. ■</div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>3. Generalized Factor Theorem (For ax - b)</h2>
<p>If p(x) is divided by (ax - b) where a ≠ 0, remainder R = p(b/a), and (ax - b) is a factor if and only if <strong>p(b/a) = 0</strong>.</p>
""",
                    "audioText": "Lesson 2 proves the Remainder and Factor Theorems. Substituting x = a into p(x) yields the exact remainder R = p(a). If p(a) equals 0, then x minus a is a factor.",
                    "audioTextHinglish": "Lesson 2 me Remainder aur Factor Theorems seekhte hain. Division algorithm me x = a substitute karke R = p(a) milta hai.",
                    "keyInsight": "Remainder R = p(a). If p(a) = 0, then (x - a) is a factor.",
                    "widgetType": "Class10PolynomialsRemainderFactorWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: Proofs of Zeroes & Coefficients Relations",
                    "readingTime": "~8 min read",
                    "narrative": """
<h2>1. Proof of Quadratic Relationship (ax² + bx + c)</h2>
<p><strong>Theorem:</strong> If α and β are zeroes of p(x) = ax² + bx + c (a ≠ 0), then <strong>α + β = -b/a</strong> and <strong>αβ = c/a</strong>.</p>

<div class="my-3 p-4 bg-slate-950 border border-amber-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-2">
  <div class="font-bold text-amber-400">Proof:</div>
  <div>By Factor Theorem, factors are (x - α) and (x - β).</div>
  <div>ax² + bx + c = k(x - α)(x - β) = k[x² - (α + β)x + αβ]</div>
  <div>ax² + bx + c = kx² - k(α + β)x + kαβ</div>
  <div>Equating coefficients:</div>
  <div>1) x² coefficient: a = k</div>
  <div>2) x coefficient: b = -k(α + β) = -a(α + β) ==> <strong>α + β = -b/a</strong></div>
  <div>3) Constant: c = kαβ = aαβ ==> <strong>αβ = c/a</strong>. ■</div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>2. Proof of Cubic Relationship (ax³ + bx² + cx + d)</h2>
<div class="my-3 p-4 bg-slate-950 border border-purple-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• α + β + γ = -b/a</div>
  <div>• αβ + βγ + γα = c/a</div>
  <div>• αβγ = -d/a</div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>3. Forming a Quadratic Polynomial</h2>
<p>Given Sum S = (α + β) and Product P = (αβ): <strong>p(x) = k[x² - Sx + P]</strong>.</p>
""",
                    "audioText": "Lesson 3 proves the zeroes and coefficient relationships for quadratic and cubic polynomials.",
                    "audioTextHinglish": "Lesson 3 me quadratic aur cubic polynomials ke zeroes aur coefficients ke beech relationship prove karte hain.",
                    "keyInsight": "Sum = -b/a, Product = c/a. Polynomial = k[x² - Sx + P].",
                    "widgetType": "Class10PolynomialsZeroesCoefficientsWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: Discriminant Proof & 4 Algebraic Identity Transformations",
                    "readingTime": "~8 min read",
                    "narrative": """
<h2>1. Proof of Discriminant (D = b² - 4ac) via Completing Square</h2>
<div class="my-3 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-2">
  <div>ax² + bx + c = 0  ==>  x² + (b/a)x = -c/a</div>
  <div>Add (b / 2a)² to both sides:</div>
  <div>(x + b/2a)² = b²/4a² - c/a = (b² - 4ac) / 4a²</div>
  <div>x + b/2a = ±√(b² - 4ac) / 2a</div>
  <div class="text-emerald-400 font-bold text-sm">x = (-b ± √(b² - 4ac)) / 2a  ■</div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>2. Proofs of 4 Algebraic Identity Transformations</h2>
<ol class="space-y-3 font-mono text-xs text-slate-300 list-decimal list-inside">
  <li class="p-3 bg-slate-950 rounded-xl border border-amber-500/30">
    <strong class="text-amber-400">α² + β² = (α + β)² - 2αβ</strong><br/>
    <em>Proof: Expand (α + β)² = α² + 2αβ + β², subtract 2αβ.</em>
  </li>
  <li class="p-3 bg-slate-950 rounded-xl border border-sky-500/30">
    <strong class="text-sky-400">α - β = ±√[(α + β)² - 4αβ]</strong><br/>
    <em>Proof: (α - β)² = α² - 2αβ + β² = (α + β)² - 4αβ, take square root.</em>
  </li>
  <li class="p-3 bg-slate-950 rounded-xl border border-purple-500/30">
    <strong class="text-purple-400">α³ + β³ = (α + β)³ - 3αβ(α + β)</strong><br/>
    <em>Proof: Expand (α + β)³ = α³ + β³ + 3αβ(α + β), rearrange.</em>
  </li>
  <li class="p-3 bg-slate-950 rounded-xl border border-emerald-500/30">
    <strong class="text-emerald-400">α/β + β/α = [(α + β)² - 2αβ] / (αβ)</strong><br/>
    <em>Proof: Common denominator (α² + β²) / αβ, substitute Identity 1.</em>
  </li>
</ol>
""",
                    "audioText": "Lesson 4 proves the discriminant formula by completing the square and establishes four critical algebraic identities for roots.",
                    "audioTextHinglish": "Lesson 4 me completing the square se quadratic formula derive karte hain aur 4 main algebraic identities seekhte hain.",
                    "keyInsight": "α² + β² = (α + β)² - 2αβ, 1/α + 1/β = (α + β)/αβ.",
                    "widgetType": "Class10PolynomialsAlgebraicIdentitiesWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 5: 10 High-Yield Solved Board Exam Questions",
                    "readingTime": "~10 min read",
                    "narrative": """
<p>Here are <strong>10 Classic Class 10 Board Exam Questions</strong> with complete step-by-step solutions.</p>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 1: Finding Zeroes & Verifying Relations</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find zeroes of p(x) = 6x² - 3 - 7x and verify relations.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• 6x² - 7x - 3 = (2x - 3)(3x + 1) ==> α = 3/2, β = -1/3.</div>
  <div>• α + β = 7/6, -b/a = 7/6. αβ = -1/2, c/a = -1/2 (Verified).</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 2: Identity Evaluation for 2x² - 5x + 7</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find α² + β² and 1/α + 1/β for p(x) = 2x² - 5x + 7.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• α+β = 5/2, αβ = 7/2. α²+β² = (5/2)² - 2(7/2) = 25/4 - 7 = -3/4.</div>
  <div>• 1/α + 1/β = (5/2)/(7/2) = 5/7.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 3: Forming Quadratic with Irrational Roots</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Form quadratic polynomial with zeroes 2 + √3 and 2 - √3.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Sum S = 4. Product P = (2+√3)(2-√3) = 4 - 3 = 1.</div>
  <div class="text-emerald-400 font-bold">• p(x) = x² - 4x + 1.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 4: Finding k if Root is -3</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find k if one zero of (k - 1)x² + kx + 1 is -3.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• 9(k - 1) - 3k + 1 = 0 ==> 6k = 8 ==> k = 4/3.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 5: Proving (α+1)(β+1) = 1 - c</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> If α, β are zeroes of x² - p(x+1) - c, show (α+1)(β+1) = 1 - c.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• x² - px - (p + c). α+β = p, αβ = -(p+c).</div>
  <div>• (α+1)(β+1) = αβ + (α+β) + 1 = -p - c + p + 1 = 1 - c (Proved).</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 6: Splitting Middle Term with Square Roots</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find zeroes of 4√3 x² + 5x - 2√3.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Product = 4√3 × (-2√3) = -24; Sum = +5 ==> (+8) and (-3).</div>
  <div>• 4√3 x² + 8x - 3x - 2√3 = 4x(√3 x + 2) - √3(√3 x + 2) = (4x - √3)(√3 x + 2).</div>
  <div class="text-emerald-400 font-bold">• Zeroes = √3 / 4, -2 / √3.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 7: Cubic Polynomial Relations Verification</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Verify cubic relations for p(x) = 2x³ - 5x² - 14x + 8 with zeroes 4, -2, 1/2.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Sum = 4 - 2 + 1/2 = 5/2 = -b/a (5/2). Product = 4(-2)(1/2) = -4 = -d/a (-8/2). Verified!</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 8: Proving 2ac = ab + b²</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> If α+β = α²+β² for ax² + bx + c, prove 2ac = ab + b².
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• -b/a = (b² - 2ac)/a² ==> -ab = b² - 2ac ==> 2ac = ab + b² (Proved).</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 9: Finding k if α² + β² = 40</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Zeroes of x² - 8x + k satisfy α² + β² = 40. Find k.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• 64 - 2k = 40 ==> 2k = 24 ==> k = 12.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 10: Finding p and q given Factors</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> (x + 1) and (x - 2) are factors of x³ + 10x² + px + q. Find p and q.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• p(-1) = 0 ==> -p + q = -9. p(2) = 0 ==> 2p + q = -48.</div>
  <div class="text-emerald-400 font-bold">• Subtracting gives 3p = -39 ==> p = -13, q = -22.</div>
</div>
""",
                    "audioText": "In Lesson 5 we solve 10 classic board exam questions covering zeroes, identity transformations, cubic relations, and factor problems.",
                    "audioTextHinglish": "Lesson 5 me 10 solved Class 10 board exam questions step by step solve karte hain.",
                    "keyInsight": "Review all 10 solved questions before taking the qualification exam.",
                    "widgetType": "Class10PolynomialsParabolaVisualizerWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 6: Class 10 Master Qualification Exam (80% Pass Mark)",
                    "readingTime": "~10 min exam",
                    "narrative": """
<p>Congratulations on mastering Class 10 Polynomials!</p>

<p>Pass the <strong>Class 10 Qualification Exam</strong> below to earn your chapter completion badge!</p>

<div class="my-4 p-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl space-y-3">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-base font-sans">
    <span class="material-symbols-outlined">workspace_premium</span>
    <span>Chapter Completion Requirement</span>
  </div>
  <ul class="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside font-sans">
    <li><strong>10 High-Yield Board Exam MCQs</strong> covering zeroes, parabola geometry, remainder theorem, discriminant, and root relations.</li>
    <li><strong>Passing Score: 80% or higher</strong> (at least 8 out of 10 correct).</li>
    <li>Step-by-step solutions provided after every answer!</li>
  </ul>
</div>
""",
                    "audioText": "Lesson 6 is your Class 10 Qualification Test. Score 80 percent or higher to earn your Class 10 completion badge.",
                    "audioTextHinglish": "Lesson 6 aapka Class 10 Qualification Test hai. 80% score karke apna chapter completion badge earn karein.",
                    "keyInsight": "Score 80%+ to complete Class 10 Polynomials!",
                    "widgetType": "Class10PolynomialsMCQExamWidget",
                    "widgetData": {}
                }
            ]
        }
        poly_topic.lesson_config_json = json.dumps(config)

        db.commit()
        print("Successfully seeded Class 10 Polynomials topic and 6-lesson curriculum!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Polynomials: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class10_polynomials()
