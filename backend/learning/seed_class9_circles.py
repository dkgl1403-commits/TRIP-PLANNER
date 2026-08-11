import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_class9_circles():
    db = SessionLocal()
    try:
        class_9 = db.query(LearningClass).filter_by(level=9).first()
        if not class_9:
            class_9 = LearningClass(level=9, name="Class 9")
            db.add(class_9)
            db.flush()

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_9.id).first()
        if not math_subject:
            math_subject = LearningSubject(name="Mathematics", class_id=class_9.id)
            db.add(math_subject)
            db.flush()

        circles_topic = db.query(LearningTopic).filter_by(name="Circles", subject_id=math_subject.id).first()
        if not circles_topic:
            circles_topic = LearningTopic(
                subject_id=math_subject.id,
                name="Circles",
                order_idx=4
            )
            db.add(circles_topic)
            db.flush()

        config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: The Perpendicular from Center (The Archery Target Metaphor)",
                    "readingTime": "~5 min read",
                    "narrative": """
<p>If Class 10 is all about what happens <em>outside</em> the circle (tangents and external points), Class 9 is entirely focused on what happens <strong>inside</strong> the boundary.</p>

<p>In Class 9, you transition from just drawing circles with a compass to proving geometric theorems about chords, arcs, and central angles. This lays the absolute foundation for Class 10 logic.</p>

<hr class="my-6 border-slate-800"/>

<h2>1. The Archery Target Metaphor</h2>
<p>Imagine an archery target bullseye at the center <strong>O</strong>. Any chord <strong>AB</strong> is a bowstring drawn across the target. If you drop a straight line from the center bullseye straight down to that chord... <strong>it will cut the chord into two perfectly equal halves!</strong></p>

<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-amber-500 text-amber-300 font-sans">
  <strong>Theorem 1:</strong> The perpendicular dropped from the center of a circle to a chord bisects the chord (AM = MB).
</blockquote>

<div class="my-4 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-2">
  <div class="text-amber-400 font-bold">Why it Matters:</div>
  <div>• You draw radii OA to create right-angled triangle ΔOMA.</div>
  <div>• By Pythagorean Theorem: <strong>OA² = OM² + AM²</strong> (r² = d² + half_chord²).</div>
  <div>• This single formula solves 80% of chord length problems in board exams!</div>
</div>
""",
                    "audioText": "Welcome to Class 9 Circles. If Class 10 is about tangents outside the circle, Class 9 focuses entirely on what happens inside. Theorem 1 states that the perpendicular dropped from center to a chord bisects the chord into two equal halves.",
                    "audioTextHinglish": "Class 9 Circles me aapka swagat hai. Class 9 internal geometry par base hai. Theorem 1 kehta hai ki center se chord par draw ki gayi perpendicular line chord ko 2 equal halves me divide karti hai.",
                    "keyInsight": "OM ⊥ AB implies AM = MB, creating right triangle ΔOMA where r² = d² + (AB/2)².",
                    "widgetType": "Class9CirclesPerpendicularBisectorWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: Equal Chords & Distance from Center (Castle Shield Metaphor)",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>2. The Castle Shield Metaphor</h2>

<p>Imagine a circular castle defense shield with royal keep at center <strong>O</strong>. If two defensive ropes <strong>AB</strong> and <strong>CD</strong> have identical length, they must sit at the exact same distance from the royal keep center!</p>

<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-purple-500 text-purple-300 font-sans">
  <strong>Theorem 2:</strong> Equal chords of a circle are equidistant from the center (AB = CD ==> OM = ON).
</blockquote>

<div class="my-4 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-2">
  <div class="text-purple-400 font-bold">Converse Theorem:</div>
  <div>• Chords equidistant from the center of a circle are equal in length (OM = ON ==> AB = CD).</div>
  <div>• The longer a chord is, the closer it sits to the center (Diameter is the longest chord at distance 0).</div>
</div>
""",
                    "audioText": "Theorem 2 states that equal chords of a circle are equidistant from the center. Conversely, chords that are equidistant from center are equal in length.",
                    "audioTextHinglish": "Theorem 2 kehta hai ki equal chords center se hamesha barabar distance par hote hain.",
                    "keyInsight": "Equal chords have equal perpendicular distances from center: AB = CD ==> OM = ON.",
                    "widgetType": "Class9CirclesEqualChordsWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: Central Angle & Inscribed Angle (Star Trek Emblem Metaphor)",
                    "readingTime": "~6 min read",
                    "narrative": """
<h2>3. The "Star Trek" Central Angle Theorem</h2>

<p>This is arguably the most famous rule from Class 9 geometry.</p>

<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-sky-500 text-sky-300 font-sans">
  <strong>Theorem 3:</strong> The angle subtended by an arc at the center is double the angle subtended by it at any point on the remaining part of the circle (∠AOB = 2 · ∠ACB).
</blockquote>

<div class="my-4 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-2">
  <div class="text-amber-400 font-bold">Two Critical Consequences:</div>
  <div>1. <strong>Angles in the Same Segment are Equal:</strong> Dragging point C anywhere along the top segment keeps ∠ACB strictly equal to ∠ADB!</div>
  <div>2. <strong>Angle in a Semicircle is 90°:</strong> If AB is a diameter, central angle = 180° ==> boundary angle = 180° / 2 = <strong>90°</strong>.</div>
</div>
""",
                    "audioText": "Theorem 3 states that the angle subtended by an arc at center is double the angle subtended at any point on the boundary. Consequence: angles in the same segment are equal and angle in a semicircle is 90 degrees.",
                    "audioTextHinglish": "Theorem 3 Star Trek Emblem kehta hai ki center angle boundary angle ka double hota hai. Same segment ke sabhi angles barabar hote hain.",
                    "keyInsight": "Central angle is double boundary angle (∠AOB = 2 · ∠ACB). Angles in same segment are equal.",
                    "widgetType": "Class9CirclesStarTrekAngleWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: Cyclic Quadrilaterals (Ferris Wheel Cage Metaphor)",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>4. The Ferris Wheel Cage Metaphor</h2>

<p>If you draw a four-sided shape (quadrilateral) where all four corners touch the circle boundary, it is called a <strong>cyclic quadrilateral</strong>.</p>

<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-pink-500 text-pink-300 font-sans">
  <strong>Theorem 4:</strong> The sum of either pair of opposite angles of a cyclic quadrilateral is 180° (they are supplementary).
</blockquote>

<div class="my-4 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-2">
  <div class="text-pink-400 font-bold">Mathematical Equations:</div>
  <div>• <strong>∠A + ∠C = 180°</strong></div>
  <div>• <strong>∠B + ∠D = 180°</strong></div>
  <div>• If one side of a cyclic quad is extended, the exterior angle equals the interior opposite angle!</div>
</div>
""",
                    "audioText": "Theorem 4 states that opposite angles of a cyclic quadrilateral are supplementary, summing to 180 degrees.",
                    "audioTextHinglish": "Theorem 4 kehta hai ki cyclic quadrilateral ke opposite angles ka sum hamesha 180 degree hota hai.",
                    "keyInsight": "Opposite angles in a cyclic quadrilateral sum to 180° (∠A + ∠C = 180°).",
                    "widgetType": "Class9CirclesCyclicQuadWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 5: 10 High-Yield Solved Board Exam Questions",
                    "readingTime": "~10 min read",
                    "narrative": """
<p>Here are <strong>10 Classic Class 9 Board Exam Questions</strong> with complete step-by-step solutions covering all internal circle theorems.</p>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 1: Chord Distance Calculation</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A chord of length 30 cm is drawn in a circle of radius 17 cm. Find its distance from the center.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Perpendicular bisects chord: Half chord = 30 / 2 = 15 cm.</div>
  <div>• In ΔOMA: r² = d² + 15² ==> 17² = d² + 225 ==> 289 = d² + 225</div>
  <div class="text-emerald-400 font-bold">• d² = 64 ==> Distance d = 8 cm.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 2: Parallel Chords Distance</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Two parallel chords of lengths 6 cm and 8 cm lie on opposite sides of the center of a circle of radius 5 cm. Find distance between chords.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Distance 1 = √(5² - 3²) = √(25 - 9) = 4 cm.</div>
  <div>• Distance 2 = √(5² - 4²) = √(25 - 16) = 3 cm.</div>
  <div class="text-emerald-400 font-bold">• Total distance = 4 + 3 = 7 cm.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 3: Central Angle Doubling</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> If central angle ∠AOB = 140°, find boundary angle ∠ACB subtended in the major segment.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• By Theorem 3: ∠ACB = ∠AOB / 2 = 140° / 2 = 70°.</div>
  <div class="text-emerald-400 font-bold">• ∠ACB = 70°.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 4: Cyclic Quadrilateral Opposite Angle</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> In cyclic quadrilateral ABCD, if ∠A = 105°, find opposite angle ∠C.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• By Theorem 4: ∠A + ∠C = 180° ==> 105° + ∠C = 180°.</div>
  <div class="text-emerald-400 font-bold">• ∠C = 180° - 105° = 75°.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 5: Semicircle Angle Theorem</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> AB is a diameter of circle center O. If C is a point on boundary and ∠ABC = 35°, find ∠BAC.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Angle in a semicircle ∠ACB = 90°.</div>
  <div>• In ΔABC: ∠BAC = 180° - 90° - 35° = 55°.</div>
  <div class="text-emerald-400 font-bold">• ∠BAC = 55°.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 6: Equal Chords Intersection Segments</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Prove that if two equal chords intersect inside a circle, the corresponding segments are equal.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Drop perpendiculars OM ⊥ AB and ON ⊥ CD. By RHS congruence ΔOME ≅ ΔONE.</div>
  <div>• ME = NE. Since AM = CN (half chords), AM + ME = CN + NE ==> AE = CE.</div>
  <div class="text-emerald-400 font-bold">• Corresponding segments are equal (Proved).</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 7: Cyclic Trapezium is Isosceles</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Prove that a cyclic trapezium is isosceles (non-parallel sides equal).
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Parallel bases AB || CD ==> consecutive interior angles ∠A + ∠D = 180°.</div>
  <div>• Cyclic quad ==> ∠A + ∠C = 180°. Therefore ∠C = ∠D.</div>
  <div class="text-emerald-400 font-bold">• Base angles equal ==> Non-parallel sides AD = BC (Isosceles).</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 8: Reflex Central Angle</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> If minor arc AB subtends boundary angle ∠ACB = 130° in minor segment, find central angle.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Reflex central angle = 2 × 130° = 260°.</div>
  <div>• Major central angle = 360° - 260° = 100°.</div>
  <div class="text-emerald-400 font-bold">• Central angle = 100°.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 9: Three Non-Collinear Points Circle</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> How many unique circles can pass through three non-collinear points P, Q, R?
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• The perpendicular bisectors of PQ and QR intersect at exactly 1 unique point (circumcenter O).</div>
  <div class="text-emerald-400 font-bold">• Exactly 1 unique circle.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 10: Subtended Angle by Equal Chords at Center</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> If AB and CD are two equal chords of a circle center O, prove ∠AOB = ∠COD.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• In ΔAOB and ΔCOD: OA = OC (radii), OB = OD (radii), AB = CD (given).</div>
  <div>• By SSS Congruence: ΔAOB ≅ ΔCOD.</div>
  <div class="text-emerald-400 font-bold">• ∠AOB = ∠COD (Proved).</div>
</div>
""",
                    "audioText": "In Lesson 5 we solve 10 classic Class 9 board exam questions covering chord bisectors, parallel chords distance, central angles, and cyclic quadrilaterals.",
                    "audioTextHinglish": "Lesson 5 me hum 10 solved Class 9 board exam questions step by step solve karte hain.",
                    "keyInsight": "Master all 10 solved questions to build a strong foundation for Class 10.",
                    "widgetType": "Class9CirclesPerpendicularBisectorWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 6: Class 9 Circles Master Qualification Exam (80% Pass Mark)",
                    "readingTime": "~10 min exam",
                    "narrative": """
<p>Congratulations on mastering Class 9 Circles!</p>

<p>Pass the <strong>Class 9 Circles Qualification Exam</strong> below to earn your chapter completion badge and unlock Class 10 preparation!</p>

<div class="my-4 p-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl space-y-3">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-base font-sans">
    <span class="material-symbols-outlined">workspace_premium</span>
    <span>Chapter Completion Requirement</span>
  </div>
  <ul class="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside font-sans">
    <li><strong>10 High-Yield Board Exam MCQs</strong> covering all Class 9 internal circle theorems.</li>
    <li><strong>Passing Score: 80% or higher</strong> (at least 8 out of 10 correct).</li>
    <li>Step-by-step solutions provided after every answer!</li>
  </ul>
</div>
""",
                    "audioText": "Lesson 6 is your Class 9 Circles Qualification Test. Score 80 percent or higher to earn your Class 9 completion badge.",
                    "audioTextHinglish": "Lesson 6 aapka Class 9 Qualification Test hai. 80% score karke apna chapter completion badge earn karein.",
                    "keyInsight": "Score 80%+ to complete Class 9 Circles!",
                    "widgetType": "Class9CirclesMCQExamWidget",
                    "widgetData": {}
                }
            ]
        }
        circles_topic.lesson_config_json = json.dumps(config)

        db.commit()
        print("Successfully seeded Class 9 Circles topic and 6-lesson curriculum!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 9 Circles: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class9_circles()
