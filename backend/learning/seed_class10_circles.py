import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_class10_circles():
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

        circles_topic = db.query(LearningTopic).filter_by(name="Circles", subject_id=math_subject.id).first()
        if not circles_topic:
            circles_topic = LearningTopic(
                subject_id=math_subject.id,
                name="Circles",
                order_idx=3
            )
            db.add(circles_topic)
            db.flush()

        config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: The Secant, Tangent & Theorem 1 (Right Angle Rule)",
                    "readingTime": "~5 min read",
                    "narrative": """
<p>Welcome to Class 10 Circles. In lower grades, circles were purely about measuring circumferences and areas. In Class 10, geometry shifts to understanding <strong>relationships</strong> — specifically, how straight lines interact with curved edges.</p>

<p>Whether you study under NCERT (CBSE), ICSE, or State Boards, the central character of Class 10 geometry is <strong>The Tangent</strong>.</p>

<hr class="my-6 border-slate-800"/>

<h2>1. The Secant vs. The Tangent (Bicycle Wheel Metaphor)</h2>

<p>Imagine riding a bicycle on a perfectly flat road.</p>
<ul>
  <li>If your tire sinks into soft mud, the ground cuts <em>through</em> the circle of your wheel at two distinct points. In geometry, a line intersecting a circle at 2 points is called a <strong>Secant</strong>.</li>
  <li>On a hard, paved road, the tire rests on top of the asphalt. The ground touches the wheel at <strong>exactly one single point</strong>. This line is a <strong>Tangent</strong>.</li>
</ul>

<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-amber-500 text-amber-300">
  A <strong>Tangent</strong> to a circle is a straight line that touches the circle at only one point. The word comes from Latin <em>tangere</em>, meaning "to touch".
</blockquote>

<hr class="my-6 border-slate-800"/>

<h2>2. Theorem 1: The Right Angle Rule (Radius ⊥ Tangent)</h2>

<p><strong>The Theorem:</strong> <em>"The tangent at any point of a circle is perpendicular to the radius through the point of contact."</em></p>

<p><strong>Why?</strong> If you stand at the center of the circle O and want to walk to the tangent line taking the shortest possible path, you must walk straight to point of contact A. In geometry, the shortest distance between a point and a line is <em>always</em> a perpendicular drop. Therefore, the angle is <strong>90°</strong>.</p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-emerald-400 text-lg font-bold">
  OA ⊥ Line (Tangent)  ==&gt;  ∠OAP = 90°
</div>

<p><em>Key Reflex: Any time a board exam question mentions a tangent and a center point, your very first step is to draw the radius and write "90°". That single step earns you your first mark!</em></p>
""",
                    "audioText": "Welcome to Class 10 Circles. Theorem 1 states that the tangent at any point is perpendicular to the radius through the point of contact, forming a 90 degree angle.",
                    "audioTextHinglish": "Class 10 Circles me aapka swagat hai. Theorem 1 kehta hai ki radius point of contact par tangent ke 90 degree perpendicular hoti hai.",
                    "keyInsight": "The radius drawn to the point of contact of a tangent always forms a 90° right angle (OA ⊥ Tangent).",
                    "widgetType": "Class10CirclesTangentRadiusWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: Theorem 2 (External Point Twin Tangents PA = PB)",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>Theorem 2: The External Point Rule (Twin Tangents PA = PB)</h2>

<p>From any point <em>outside</em> a circle, you can draw exactly <strong>two tangents</strong>.</p>

<p><strong>The Theorem:</strong> <em>"The lengths of the two tangents drawn from an external point to a circle are equal (PA = PB)."</em></p>

<div class="my-4 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
  <div class="text-amber-400 font-bold">Board Exam Proof Breakdown:</div>
  <div>• <strong>Given:</strong> External point P, tangents PA and PB from P to circle center O.</div>
  <div>• <strong>Construction:</strong> Draw OA, OB, and OP creating ΔOAP and ΔOBP.</div>
  <div>• <strong>Logic:</strong> OA = OB (radii), ∠OAP = ∠OBP = 90° (Theorem 1), OP = OP (common hypotenuse).</div>
  <div>• <strong>Conclusion:</strong> By RHS Congruence, ΔOAP ≅ ΔOBP. Therefore, <strong>PA = PB</strong>.</div>
  <div class="text-emerald-400 pt-1">• <strong>Bonus:</strong> Line OP bisects the angle ∠APB (∠APO = ∠BPO).</div>
</div>
""",
                    "audioText": "Theorem 2 states that tangent lengths drawn from an external point are equal, PA equals PB, proved via RHS congruence of triangles OAP and OBP.",
                    "audioTextHinglish": "Theorem 2 me external point se bane twin tangents PA aur PB equal hote hain.",
                    "keyInsight": "Tangents drawn from an external point to a circle are strictly equal in length: PA = PB.",
                    "widgetType": "Class10CirclesExternalPointWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: Theorem 3 (Tangent-Secant Power Theorem PT² = PA · PB)",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>Theorem 3: Tangent-Secant Power Theorem (PT² = PA · PB)</h2>

<p>If a tangent PT and a secant line PAB are drawn from an external point P:</p>
<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-amber-400 text-lg font-bold">
  PT² = PA · PB
</div>
<p>The square of the tangent length equals the product of the external secant segment (PA) and the total secant segment (PB).</p>

<p>This power-of-a-point theorem is a high-yield formula for calculating missing chord extensions in board exam diagrams.</p>
""",
                    "audioText": "Theorem 3 states that PT squared equals PA times PB for a tangent PT and secant PAB drawn from an external point P.",
                    "audioTextHinglish": "Theorem 3 me PT squared equals PA into PB hota hai.",
                    "keyInsight": "For any tangent PT and secant PAB from external point P: PT² = PA · PB.",
                    "widgetType": "Class10CirclesTangentSecantWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: Theorem 4 (The Alternate Segment Theorem)",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>Theorem 4: The Alternate Segment Theorem</h2>

<p><em>"The angle between a tangent and a chord drawn through the point of contact is equal to the angle subtended by the chord in the alternate segment."</em></p>

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-purple-400 text-xl font-bold">
  ∠BAT = ∠BCA
</div>

<p>This is the ultimate ICSE and State Board shortcut for finding missing angles in complex circle diagrams without having to draw lines to the center!</p>
""",
                    "audioText": "Theorem 4 states that the angle between a tangent and chord equals the angle subtended by the chord in the alternate segment.",
                    "audioTextHinglish": "Theorem 4 Alternate Segment Theorem kehta hai ki tangent-chord angle alternate segment angle ke barabar hota hai.",
                    "keyInsight": "The angle between a tangent and chord at contact point A strictly equals the angle subtended in the alternate segment: ∠BAT = ∠BCA.",
                    "widgetType": "Class10CirclesAlternateSegmentWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 5: 10 High-Yield Solved Board Exam Questions",
                    "readingTime": "~10 min read",
                    "narrative": """
<p>Here are <strong>10 Classic Board Exam Questions</strong> with complete step-by-step solutions covering all 4 theorems.</p>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 1: Tangent Length via Pythagorean Theorem</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A tangent PQ at a point Q of a circle of radius 5 cm meets a line through the center O at a point P so that OP = 12 cm. Find PQ.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• By Theorem 1, OQ ⊥ PQ ==> ∠OQP = 90°.</div>
  <div>• By Pythagoras: OP² = OQ² + PQ² ==> 12² = 5² + PQ²</div>
  <div class="text-emerald-400 font-bold">• PQ = √(144 - 25) = √119 cm.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 2: Circumscribed Quadrilateral (AB + CD = AD + BC)</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A quadrilateral ABCD is drawn to circumscribe a circle. Prove that AB + CD = AD + BC.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Tangents from external points A, B, C, D are equal (Theorem 2):</div>
  <div>  AP = AS, BP = BQ, CR = CQ, DR = DS</div>
  <div>• Adding left sides: (AP + BP) + (CR + DR) = AB + CD</div>
  <div>• Adding right sides: (AS + DS) + (BQ + CQ) = AD + BC</div>
  <div class="text-emerald-400 font-bold">• AB + CD = AD + BC (Proved).</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 3: Concentric Circles Chord Length</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Two concentric circles are of radii 5 cm and 3 cm. Find the length of the chord of the larger circle which touches the smaller circle.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Radius r = 3 cm is perpendicular to chord AB at contact P (Theorem 1).</div>
  <div>• OP ⊥ AB bisects chord AB. In ΔOPA: AP = √(5² - 3²) = √16 = 4 cm.</div>
  <div class="text-emerald-400 font-bold">• Full Chord AB = 2 × AP = 2 × 4 = 8 cm.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 4: Tangent Inclination Angle</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> If tangents PA and PB from a point P to a circle with center O are inclined to each other at angle of 80°, find ∠POA.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Line OP bisects ∠APB ==> ∠APO = 80° / 2 = 40°.</div>
  <div>• In right ΔOAP (∠OAP = 90°): ∠POA = 180° - 90° - 40° = 50°.</div>
  <div class="text-emerald-400 font-bold">• ∠POA = 50°.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 5: Parallelogram Circumscribing a Circle is a Rhombus</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Prove that the parallelogram circumscribing a circle is a rhombus.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• From Q2: AB + CD = AD + BC for any circumscribed quadrilateral.</div>
  <div>• Since ABCD is a parallelogram: AB = CD and AD = BC.</div>
  <div>• Substitute: 2 AB = 2 AD ==> AB = AD.</div>
  <div class="text-emerald-400 font-bold">• All 4 sides equal ==> ABCD is a Rhombus.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 6: Tangent-Secant Product Calculation</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A tangent PT = 6 cm and a secant line PAB has PA = 4 cm. Find external chord segment AB.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• By Theorem 3: PT² = PA · PB ==> 6² = 4 · PB ==> 36 = 4 · PB ==> PB = 9 cm.</div>
  <div>• Segment AB = PB - PA = 9 - 4 = 5 cm.</div>
  <div class="text-emerald-400 font-bold">• AB = 5 cm.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 7: Tangents at Ends of Diameter are Parallel</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Prove that tangents drawn at the ends of a diameter of a circle are parallel.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Let AB be diameter. Tangent 1 at A forms ∠1 = 90° with AB.</div>
  <div>• Tangent 2 at B forms ∠2 = 90° with AB.</div>
  <div>• Alternate interior angles ∠1 = ∠2 = 90° ==> Tangent 1 || Tangent 2.</div>
  <div class="text-emerald-400 font-bold">• Tangents are parallel (Proved).</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 8: Tangent Angle & Subtended Central Angle</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Prove that the angle between two tangents drawn from an external point is supplementary to the angle subtended by line-segments joining contact points at center.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• In quadrilateral OAPB: ∠OAP = 90° and ∠OBP = 90°.</div>
  <div>• Sum of quadrilateral angles = 360° ==> ∠AOB + ∠APB + 90° + 90° = 360°.</div>
  <div class="text-emerald-400 font-bold">• ∠AOB + ∠APB = 180° (Supplementary).</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 9: Right Triangle Incircle Radius</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A circle is inscribed in a right ΔABC with hypotenuse c and legs a, b. Prove incircle radius r = (a + b - c) / 2.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Incircle contact points divide sides into tangent pairs (a-r), (b-r), and r.</div>
  <div>• Hypotenuse c = (a - r) + (b - r) = a + b - 2r.</div>
  <div class="text-emerald-400 font-bold">• 2r = a + b - c ==> r = (a + b - c) / 2.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 10: Alternate Segment Angle Calculation</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A tangent AT makes an angle ∠BAT = 55° with chord AB. If C is a point on major arc AB, find ∠BCA.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• By Theorem 4 (Alternate Segment Theorem): ∠BCA = ∠BAT.</div>
  <div class="text-emerald-400 font-bold">• ∠BCA = 55°.</div>
</div>
""",
                    "audioText": "In Lesson 5 we work through 10 high yield solved board exam questions covering all 4 theorems.",
                    "audioTextHinglish": "Lesson 5 me hum 10 high yield solved board exam questions step by step solve karte hain.",
                    "keyInsight": "Review all 10 solved board exam questions before taking the qualification exam.",
                    "widgetType": "Class10CirclesTangentRadiusWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 6: Class 10 Circles Master Qualification Exam (80% Pass Mark)",
                    "readingTime": "~10 min exam",
                    "narrative": """
<p>Congratulations on mastering Class 10 Circles!</p>

<p>To officially earn your chapter completion badge, pass the <strong>Class 10 Circles Qualification Exam</strong> below.</p>

<div class="my-4 p-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl space-y-3">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-base">
    <span class="material-symbols-outlined">workspace_premium</span>
    <span>Chapter Completion Requirement</span>
  </div>
  <ul class="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside">
    <li><strong>10 High-Yield Board Exam MCQs</strong> covering all 4 core theorems.</li>
    <li><strong>Passing Score: 80% or higher</strong> (at least 8 out of 10 correct).</li>
    <li>Step-by-step solutions provided after every answer!</li>
  </ul>
</div>
""",
                    "audioText": "Lesson 6 is your official Class 10 Circles Qualification Test. Answer 10 board exam MCQs and score 80 percent or higher to earn your chapter badge.",
                    "audioTextHinglish": "Lesson 6 aapka Class 10 Qualification Test hai. 10 MCQs me se 80% score karein aur chapter completion badge unlock karein.",
                    "keyInsight": "Score 80%+ to complete Class 10 Circles!",
                    "widgetType": "Class10CirclesMCQExamWidget",
                    "widgetData": {}
                }
            ]
        }
        circles_topic.lesson_config_json = json.dumps(config)

        db.commit()
        print("Successfully seeded Class 10 Circles topic and 4-lesson curriculum!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Circles: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class10_circles()
