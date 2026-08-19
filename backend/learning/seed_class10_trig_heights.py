import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_class10_trig_heights():
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

        trig_topic = db.query(LearningTopic).filter_by(name="Some Applications of Trigonometry", subject_id=math_subject.id).first()
        if not trig_topic:
            trig_topic = LearningTopic(
                subject_id=math_subject.id,
                name="Some Applications of Trigonometry",
                order_idx=9
            )
            db.add(trig_topic)
            db.flush()

        config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: Core Concepts & Angle of Elevation (Lighthouse Metaphor)",
                    "readingTime": "~6 min read",
                    "narrative": """
<p>Welcome to Class 10 <strong>Some Applications of Trigonometry (Heights and Distances)</strong>! In the previous chapter, you learned standard trigonometric ratios: sin θ, cos θ, and tan θ. In this chapter, we apply these ratios to calculate real-world measurements that cannot be directly measured with a ruler — such as the height of a mountain, distance of a ship from a lighthouse, or width of a river.</p>

<hr class="my-6 border-slate-800"/>

<h2>1. The Fundamental Right-Triangle Triad</h2>
<pre class="bg-slate-950 p-4 rounded-xl font-mono text-xs text-amber-400">
                  [ Object ] (Top of Tower)
                     /|
                    / |
   Line of Sight   /  |  Height (Perpendicular / Opposite)
                  /   |
                 / θ  |
     [ Observer ]------[ Base of Tower ]
        Horizontal Line (Base / Adjacent)
</pre>

<ul>
  <li><strong>Line of Sight:</strong> Straight line drawn from observer's eye to the object viewed.</li>
  <li><strong>Horizontal Level:</strong> Flat imaginary line parallel to the ground from observer's eye.</li>
  <li><strong>Angle of Elevation (θ):</strong> Formed when looking <strong>UPWARD</strong> at an object located above eye level.</li>
</ul>

<hr class="my-6 border-slate-800"/>

<h2>2. Essential Trigonometric Values Matrix</h2>
<table class="w-full text-xs font-mono border border-slate-800 my-4">
  <tr class="bg-slate-950 text-amber-400">
    <th class="p-2 border border-slate-800">Ratio / Angle</th>
    <th class="p-2 border border-slate-800">30°</th>
    <th class="p-2 border border-slate-800">45°</th>
    <th class="p-2 border border-slate-800">60°</th>
  </tr>
  <tr>
    <td class="p-2 border border-slate-800 text-slate-300 font-bold">sin θ</td>
    <td class="p-2 border border-slate-800">1/2</td>
    <td class="p-2 border border-slate-800">1/√2</td>
    <td class="p-2 border border-slate-800">√3/2</td>
  </tr>
  <tr>
    <td class="p-2 border border-slate-800 text-slate-300 font-bold">cos θ</td>
    <td class="p-2 border border-slate-800">√3/2</td>
    <td class="p-2 border border-slate-800">1/√2</td>
    <td class="p-2 border border-slate-800">1/2</td>
  </tr>
  <tr class="bg-amber-950/40 text-amber-300">
    <td class="p-2 border border-slate-800 font-bold">tan θ (Primary)</td>
    <td class="p-2 border border-slate-800 font-bold">1/√3</td>
    <td class="p-2 border border-slate-800 font-bold">1</td>
    <td class="p-2 border border-slate-800 font-bold">√3</td>
  </tr>
</table>

<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-amber-500 text-amber-300 font-sans text-xs">
  <strong>Board Golden Reflex:</strong> Over 85% of board exam problems use <strong>tan θ = Opposite / Adjacent = Height / Distance</strong>!
</blockquote>
""",
                    "audioText": "Welcome to Class 10 Some Applications of Trigonometry. Every problem reduces to constructing a right angled triangle using line of sight, horizontal line, and height.",
                    "audioTextHinglish": "Class 10 Heights and Distances me aapka swagat hai. Har problem ek right angled triangle banati hai jisme line of sight aur height ka ratio tan theta use hota hai.",
                    "keyInsight": "tan θ = Height / Distance is the primary ratio for over 85% of problems.",
                    "widgetType": "Class10TrigHeightsElevationWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: Angle of Depression & Golden Alternate Interior Angle Rule",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>1. Angle of Depression (Looking Downward)</h2>
<p>The <strong>Angle of Depression (ϕ)</strong> is formed when an observer looks <strong>DOWNWARD</strong> at an object located below eye level (e.g., looking down from a cliff at a ship in the ocean).</p>

<hr class="my-6 border-slate-800"/>

<h2>2. Golden Rule of Depression</h2>
<blockquote class="my-3 p-4 bg-purple-950/50 border-l-4 border-purple-500 text-purple-200 font-sans text-xs space-y-1">
  <div class="font-bold text-purple-300">Golden Rule:</div>
  The angle of depression (ϕ) of an object from an observer is always EQUAL to the angle of elevation (θ) of the observer from the object because they form <strong>alternate interior angles</strong> between two parallel horizontal lines!
</blockquote>

<div class="my-3 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Step 1: Draw the top horizontal eye-level line.</div>
  <div>• Step 2: Mark the angle of depression ϕ looking down at object C.</div>
  <div>• Step 3: Transfer ϕ to ground level angle θ (since θ = ϕ).</div>
  <div class="text-emerald-400 font-bold">• Step 4: Apply tan θ = Height / Distance in the ground triangle!</div>
</div>
""",
                    "audioText": "Lesson 2 covers Angle of Depression. Remember the Golden Rule: angle of depression equals angle of elevation because they are alternate interior angles between parallel lines.",
                    "audioTextHinglish": "Lesson 2 me Angle of Depression seekhte hain. Golden Rule yeh hai ki top ka angle of depression hamesha ground ke angle of elevation ke barabar hota hai.",
                    "keyInsight": "Angle of Depression = Angle of Elevation (Alternate Interior Angles).",
                    "widgetType": "Class10TrigHeightsDepressionWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: Two-Triangle Systems — Flagstaff & Moving Cars",
                    "readingTime": "~7 min read",
                    "narrative": """
<h2>Standard Board Exam Level: Two Right-Angled Triangles</h2>
<p>Most 4-mark board exam questions involve <strong>two right triangles</strong> sharing a common side (either common height or common ground distance).</p>

<hr class="my-6 border-slate-800"/>

<h2>Case A: Flagstaff / Statue on Building (Vertical Addition)</h2>
<p>From a ground point P, top of 10m building has elevation 30°, while top of flagstaff has elevation 45°.</p>
<div class="my-3 p-4 bg-slate-950 border border-amber-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Small ΔPAB: tan 30° = 10 / d ==> 1/√3 = 10 / d ==> <strong>d = 10√3 m</strong> (17.32 m)</div>
  <div>• Big ΔPAD: tan 45° = (10 + x) / d ==> 1 = (10 + x) / 10√3 ==> 10 + x = 10√3</div>
  <div class="text-emerald-400 font-bold">• Flagstaff Length x = 10(√3 - 1) = 10(1.732 - 1) = 7.32 m</div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>Case B: Moving Boat / Car Towards Tower (Horizontal Shift)</h2>
<p>As a boat moves closer to a 60m cliff, angle of elevation increases from 30° to 60°.</p>
<div class="my-3 p-4 bg-slate-950 border border-sky-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Near position: tan 60° = 60 / d₂ ==> d₂ = 60 / √3 = 20√3 m</div>
  <div>• Far position: tan 30° = 60 / d₁ ==> d₁ = 60√3 m</div>
  <div class="text-emerald-400 font-bold">• Distance Traveled Δd = d₁ - d₂ = 60√3 - 20√3 = 40√3 m ≈ 69.28 m</div>
</div>
""",
                    "audioText": "Lesson 3 covers two triangle setups like flagstaffs on buildings or moving cars towards towers. Isolate the common side in both triangles to solve.",
                    "audioTextHinglish": "Lesson 3 me two triangle setups solve karte hain. Both triangles me common base ya common height ko equate karke solution milta hai.",
                    "keyInsight": "Isolate common base or height across both right triangles.",
                    "widgetType": "Class10TrigHeightsTwoTriangleWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: Observer Eye Level Height & 4-Step Board Strategy",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>1. Observer Eye-Level Height Offset</h2>
<p>When a problem specifies an observer's height (e.g. <em>"a 1.5 m tall boy looks at a 30 m chimney"</em>), the right triangle is constructed <strong>ABOVE eye level</strong>!</p>

<div class="my-3 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Total Structure Height = h_tri + h_obs</div>
  <div>• Triangle Perpendicular Leg h_tri = Total Height - h_obs = 30.0 - 1.5 = 28.5 m</div>
  <div class="text-emerald-400 font-bold">• Solve tan θ = h_tri / d = 28.5 / d</div>
</div>

<hr class="my-6 border-slate-800"/>

<h2>2. The Master 4-Step Board Exam Strategy</h2>
<ol class="space-y-2 list-decimal list-inside font-sans text-xs text-slate-300">
  <li><strong>Draw the Diagram First:</strong> Mark right angles (90°) at base of vertical towers/cliffs.</li>
  <li><strong>Account for Observer Height:</strong> Add h_obs if given; if omitted, treat observer as point on ground (0 m).</li>
  <li><strong>Transfer Angles of Depression:</strong> Draw top horizontal line first, transfer ϕ to ground angle θ via alternate interior angles.</li>
  <li><strong>Isolate Common Variable:</strong> In 2-triangle problems, express distance d from both triangles and set equations equal!</li>
</ol>
""",
                    "audioText": "Lesson 4 covers observer eye level height and the 4-step strategy. Always draw the diagram first and subtract observer height from total structure height.",
                    "audioTextHinglish": "Lesson 4 me observer height adjustment aur 4-step strategy seekhte hain. Diagram hamesha pehle draw karein.",
                    "keyInsight": "Total Height = h_tri + h_obs. Always draw the right-triangle diagram first!",
                    "widgetType": "Class10TrigHeightsObserverHeightWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 5: 10 High-Yield Solved Board Exam Questions",
                    "readingTime": "~10 min read",
                    "narrative": """
<p>Here are <strong>10 Classic Class 10 Board Exam Questions</strong> with complete step-by-step solutions.</p>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 1: Single Triangle Basic Elevation</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Tower is 15 m away from ground point. Angle of elevation is 60°. Find height.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• tan(60°) = h / 15 ==> √3 = h / 15</div>
  <div class="text-emerald-400 font-bold">• h = 15√3 m ≈ 25.98 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 2: Flagstaff on 10m Building</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> 10 m building has 30° elevation. Flagstaff top has 45° elevation. Find flagstaff length.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• d = 10√3 m. Total height = 10√3 m.</div>
  <div class="text-emerald-400 font-bold">• Flagstaff = 10(√3 - 1) = 7.32 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 3: 1.5m Observer & 30m Chimney</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> 1.5 m boy looks at 30 m chimney at 45° elevation. Find distance.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Triangle leg = 30 - 1.5 = 28.5 m. tan(45°) = 1 = 28.5 / d.</div>
  <div class="text-emerald-400 font-bold">• Distance d = 28.5 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 4: Multi-Storey Tower & 8m Building</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Angles of depression of top and bottom of 8 m building from tower top are 30° and 45°.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• tan 45° = H / d ==> H = d. tan 30° = (H - 8) / d ==> H - 8 = H / √3.</div>
  <div class="text-emerald-400 font-bold">• Tower Height H = 4(3 + √3) m ≈ 18.93 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 5: Two Poles of Equal Height on 80m Road</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Two equal poles on 80 m road have elevations 60° and 30° from a point between them.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• h = x √3 and h = (80 - x) / √3 ==> 3x = 80 - x ==> x = 20 m.</div>
  <div class="text-emerald-400 font-bold">• Pole Height h = 20√3 m, distances 20 m and 60 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 6: Moving Boat 30° to 60°</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Boat moving towards 60 m cliff changes elevation from 30° to 60° in 6 min. Find speed.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Distance traveled = 60√3 - 20√3 = 40√3 m = 69.28 m in 6 min.</div>
  <div class="text-emerald-400 font-bold">• Speed = 40√3 / 6 = 20√3 / 3 m/min.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 7: Broken Tree Storm Problem</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Tree breaks and top touches ground at 30° at 8 m distance from foot.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Standing = 8/√3 m. Hypotenuse = 16/√3 m. Total = 24/√3 = 8√3 m.</div>
  <div class="text-emerald-400 font-bold">• Original Tree Height = 8√3 m ≈ 13.86 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 8: Shadow Shift 60° to 30°</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Shadow increases by 40 m when sun altitude changes from 60° to 30°.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• h = 40 / (cot 30° - cot 60°) = 40 / (√3 - 1/√3) = 20√3 m.</div>
  <div class="text-emerald-400 font-bold">• Tower Height = 20√3 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 9: Floating Balloon 88.2m</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Girl 1.2 m tall sees balloon at 88.2 m height. Angle changes from 60° to 30°.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Tri height = 88.2 - 1.2 = 87 m. Distance = 87√3 - 87/√3 = 58√3 m.</div>
  <div class="text-emerald-400 font-bold">• Distance traveled by balloon = 58√3 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 10: River Width & Bank Tree</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Tree on river bank has 60° elevation from opposite bank, 30° after moving 20 m back.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Width w = 20 / (cot 30° - cot 60°) = 20 / (√3 - 1/√3) = 10 m. Height = 10√3 m.</div>
  <div class="text-emerald-400 font-bold">• River Width = 10 m, Tree Height = 10√3 m.</div>
</div>
""",
                    "audioText": "In Lesson 5 we solve 10 classic board exam questions covering single triangles, flagstaffs, broken trees, shadows, floating balloons, and river widths.",
                    "audioTextHinglish": "Lesson 5 me 10 solved Class 10 board exam questions step by step solve karte hain.",
                    "keyInsight": "Review all 10 solved questions before taking the qualification exam.",
                    "widgetType": "Class10TrigHeightsElevationWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 6: Class 10 Master Qualification Exam (80% Pass Mark)",
                    "readingTime": "~10 min exam",
                    "narrative": """
<p>Congratulations on mastering Class 10 Some Applications of Trigonometry!</p>

<p>Pass the <strong>Class 10 Qualification Exam</strong> below to earn your chapter completion badge!</p>

<div class="my-4 p-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl space-y-3">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-base font-sans">
    <span class="material-symbols-outlined">workspace_premium</span>
    <span>Chapter Completion Requirement</span>
  </div>
  <ul class="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside font-sans">
    <li><strong>10 High-Yield Board Exam MCQs</strong> covering angles of elevation, depression, flagstaffs, broken trees, and shadow shifts.</li>
    <li><strong>Passing Score: 80% or higher</strong> (at least 8 out of 10 correct).</li>
    <li>Step-by-step solutions provided after every answer!</li>
  </ul>
</div>
""",
                    "audioText": "Lesson 6 is your Class 10 Qualification Test. Score 80 percent or higher to earn your Class 10 completion badge.",
                    "audioTextHinglish": "Lesson 6 aapka Class 10 Qualification Test hai. 80% score karke apna chapter completion badge earn karein.",
                    "keyInsight": "Score 80%+ to complete Class 10 Some Applications of Trigonometry!",
                    "widgetType": "Class10TrigHeightsMCQExamWidget",
                    "widgetData": {}
                }
            ]
        }
        trig_topic.lesson_config_json = json.dumps(config)

        db.commit()
        print("Successfully seeded Class 10 Some Applications of Trigonometry topic and 6-lesson curriculum!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Some Applications of Trigonometry: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class10_trig_heights()
