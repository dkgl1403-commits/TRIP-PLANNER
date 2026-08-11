import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_class7_perimeter_area():
    db = SessionLocal()
    try:
        class_7 = db.query(LearningClass).filter_by(level=7).first()
        if not class_7:
            class_7 = LearningClass(level=7, name="Class 7")
            db.add(class_7)
            db.flush()

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_7.id).first()
        if not math_subject:
            math_subject = LearningSubject(name="Mathematics", class_id=class_7.id)
            db.add(math_subject)
            db.flush()

        pa_topic = db.query(LearningTopic).filter_by(name="Perimeter and Area", subject_id=math_subject.id).first()
        if not pa_topic:
            pa_topic = LearningTopic(
                subject_id=math_subject.id,
                name="Perimeter and Area",
                order_idx=2
            )
            db.add(pa_topic)
            db.flush()

        config = {
            "type": "narrative",
            "parts": [
                {
                    "title": "Lesson 1: Squares & Rectangles — Boundary vs Surface (Fencing & Tiling Metaphor)",
                    "readingTime": "~5 min read",
                    "narrative": """
<p>Welcome to Class 7 <strong>Perimeter and Area</strong>. Up until now, you measured simple lengths. In Class 7, you master the crucial real-world distinction between measuring an <strong>outer boundary line</strong> vs. measuring an <strong>inner flat surface</strong>.</p>

<hr class="my-6 border-slate-800"/>

<h2>1. The Fencing vs. Tiling Metaphor</h2>
<ul>
  <li><strong>Perimeter (Fencing the Garden):</strong> The total distance walking around the outside boundary edge. Measured in linear units (meters, cm).</li>
  <li><strong>Area (Tiling/Turfing the Lawn):</strong> The total amount of flat surface enclosed inside the boundary. Measured in square units (m², cm²).</li>
</ul>

<hr class="my-6 border-slate-800"/>

<h2>2. Formulas for Rectangles & Squares</h2>
<div class="my-4 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs space-y-2">
  <div class="text-amber-400 font-bold">Rectangle:</div>
  <div>• Perimeter = 2 × (Length + Width) = <strong>2(l + b)</strong></div>
  <div>• Area = Length × Width = <strong>l × b</strong></div>
  <div class="text-sky-400 font-bold pt-2">Square (all sides equal 'a'):</div>
  <div>• Perimeter = 4 × Side = <strong>4a</strong></div>
  <div>• Area = Side × Side = <strong>a²</strong></div>
</div>
""",
                    "audioText": "Welcome to Class 7 Perimeter and Area. Perimeter measures the outer boundary fence line, while Area measures the inner surface. For a rectangle, perimeter is 2 times length plus width, and area is length times width.",
                    "audioTextHinglish": "Class 7 Perimeter and Area me aapka swagat hai. Perimeter outer boundary fence ko measure karta hai aur Area andar ki surface lawn ko measure karta hai.",
                    "keyInsight": "Perimeter = 2(l + b) (Boundary Fence)  |  Area = l × b (Surface Tiles).",
                    "widgetType": "Class7RectSquareAreaWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 2: Parallelograms & Triangles (Slanted Bookshelf Metaphor)",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>2. The Slanted Bookshelf Metaphor</h2>

<p>Imagine pushing a rectangular bookshelf sideways. It slants into a <strong>parallelogram</strong>. Did its base or vertical height change? No!</p>

<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-purple-500 text-purple-300 font-sans">
  <strong>Parallelogram Area:</strong> Area = base × height = <strong>b × h</strong>
</blockquote>

<hr class="my-6 border-slate-800"/>

<h2>3. Triangle Area is Half a Parallelogram</h2>

<p>If you cut any parallelogram along its diagonal, you get <strong>2 perfectly identical (congruent) triangles</strong>!</p>

<div class="my-4 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs space-y-2 text-sky-400">
  <div class="font-bold">Triangle Area Formula:</div>
  <div class="text-base font-bold text-emerald-400">Area of Triangle = ½ × base × height = ½ × b × h</div>
  <div class="text-slate-300 pt-1">• In a right-angled triangle, the two legs perpendicular to each other serve as base and height!</div>
</div>
""",
                    "audioText": "Lesson 2 covers parallelograms and triangles. A parallelogram area is base times height. A triangle is exactly half of a parallelogram, so triangle area is half times base times height.",
                    "audioTextHinglish": "Parallelogram ka area base into height hota hai. Diagonal se cut karne par triangle banta hai, isliye triangle ka area half into base into height hota hai.",
                    "keyInsight": "Parallelogram Area = b × h  |  Triangle Area = ½ × b × h.",
                    "widgetType": "Class7ParallelogramTriangleWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 3: Circles — Circumference & Pi (Rolling Bike Tire Metaphor)",
                    "readingTime": "~6 min read",
                    "narrative": """
<h2>3. The Rolling Bike Tire Metaphor</h2>

<p>How do we measure the boundary of a curved circle? Imagine placing a mark on a bicycle tire and rolling it along a flat road for <strong>1 full revolution</strong>. The distance unrolled on the road is the <strong>Circumference</strong>!</p>

<blockquote class="my-3 p-3 bg-slate-900 border-l-4 border-amber-500 text-amber-300 font-sans">
  <strong>Circumference (C):</strong> C = 2 × π × r = <strong>2πr</strong> = <strong>πd</strong>
</blockquote>

<p>The constant <strong>π (Pi)</strong> is the ratio of circumference to diameter ($\pi \approx \frac{22}{7} \approx 3.14$).</p>

<hr class="my-6 border-slate-800"/>

<h2>4. Surface Area of a Circle</h2>

<p>If you slice a circle into tiny pizza wedges and line them up side-by-side, they form a rectangle of length $\pi r$ and height $r$.</p>
<div class="my-3 p-4 bg-slate-900 rounded-xl font-mono text-center text-emerald-400 text-lg font-bold">
  Area of Circle = π × r² = πr²
</div>
""",
                    "audioText": "Lesson 3 covers circles. Circumference is 2 times pi times r, which equals 1 full rotation of a rolling bike tire. Surface area of a circle is pi times r squared.",
                    "audioTextHinglish": "Circle ka Circumference 2 pi r hota hai. Pizza slice arrangement se circle ka Surface Area pi r squared banta hai.",
                    "keyInsight": "Circumference C = 2πr  |  Surface Area A = πr².",
                    "widgetType": "Class7CircleCircumferenceAreaWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 4: Pathways, Borders & Composite Shapes (Park Walkway Metaphor)",
                    "readingTime": "~5 min read",
                    "narrative": """
<h2>4. The Park Walkway Metaphor</h2>

<p>When calculating the paved running track around a rectangular park or a circular garden ring, you subtract the <strong>inner region</strong> from the <strong>outer region</strong>.</p>

<div class="my-4 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs space-y-2">
  <div class="text-amber-400 font-bold">Pathway Formula:</div>
  <div>• <strong>Path Area = Outer Area - Inner Area</strong></div>
  <div>• For rectangular park with path width 'w':</div>
  <div>  Outer Length = l + 2w, Outer Width = b + 2w.</div>
  <div class="text-emerald-400 font-bold pt-1">• Circular Ring Path Area = πR² - πr² = <strong>π(R² - r²)</strong></div>
</div>
""",
                    "audioText": "Lesson 4 covers pathways and borders. To find the walkway area around a park, subtract the inner lawn area from the total outer park area.",
                    "audioTextHinglish": "Pathway area nikalne ke liye outer total area me se inner lawn area minus kar dete hain.",
                    "keyInsight": "Path Area = Area of Outer Shape - Area of Inner Shape.",
                    "widgetType": "Class7PathwayBorderWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 5: 10 High-Yield Solved Board Exam Questions",
                    "readingTime": "~10 min read",
                    "narrative": """
<p>Here are <strong>10 Classic Class 7 Exam Questions</strong> with complete step-by-step solutions.</p>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 1: Fencing vs. Turfing Field</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A rectangular field is 50 m long and 30 m wide. Find (a) length of fence wire needed, (b) cost of turfing grass at ₹5 per m².
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• (a) Fence = Perimeter = 2 × (50 + 30) = 2 × 80 = 160 m.</div>
  <div>• (b) Area = 50 × 30 = 1500 m². Cost = 1500 × 5 = ₹7,500.</div>
  <div class="text-emerald-400 font-bold">• Fence = 160 m, Cost = ₹7,500.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 2: Wire Bent into Square vs. Rectangle</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A wire is in the shape of a square of side 10 cm. If the wire is rebent into a rectangle of length 12 cm, find its breadth and which shape encloses more area.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Perimeter = 4 × 10 = 40 cm. For rectangle: 2(12 + b) = 40 ==> b = 8 cm.</div>
  <div>• Square Area = 10² = 100 cm². Rectangle Area = 12 × 8 = 96 cm².</div>
  <div class="text-emerald-400 font-bold">• Breadth = 8 cm. Square encloses 4 cm² more area!</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 3: Parallelogram Base & Perpendicular Height</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> One side of a parallelogram is 14 cm and its area is 98 cm². Find the perpendicular height corresponding to this base.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Area = base × height ==> 98 = 14 × h ==> h = 98 / 14 = 7 cm.</div>
  <div class="text-emerald-400 font-bold">• Height h = 7 cm.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 4: Right Triangle Leg Calculation</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> ΔABC is right-angled at A with AB = 5 cm, AC = 12 cm. Find its area and height AD perpendicular to BC if BC = 13 cm.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Area = ½ × AB × AC = ½ × 5 × 12 = 30 cm².</div>
  <div>• Also Area = ½ × BC × AD ==> 30 = ½ × 13 × AD ==> AD = 60 / 13 cm.</div>
  <div class="text-emerald-400 font-bold">• Area = 30 cm², AD = 4.61 cm.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 5: Bicycle Wheel Revolutions</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A wheel of radius 28 cm makes 250 revolutions. Find total distance covered in meters. (Use π = 22/7)
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• 1 Rev = 2 × (22/7) × 28 = 176 cm.</div>
  <div>• 250 Revs = 176 × 250 = 44000 cm = 440 meters.</div>
  <div class="text-emerald-400 font-bold">• Total distance = 440 m.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 6: Circular Track Ring Area</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> A circular park of radius 14 m has a 7 m wide track around it. Find track area. (Use π = 22/7)
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Outer radius R = 14 + 7 = 21 m. Inner radius r = 14 m.</div>
  <div>• Track Area = (22/7) × (21² - 14²) = (22/7) × (441 - 196) = (22/7) × 245 = 770 m².</div>
  <div class="text-emerald-400 font-bold">• Track Area = 770 m².</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-purple-400 font-bold">Question 7: Cross Roads Area in Park</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Two 2 m wide cross roads run through center of a 40 m × 30 m rectangular garden parallel to sides. Find area of roads.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Road 1 Area = 40 × 2 = 80 m². Road 2 Area = 30 × 2 = 60 m².</div>
  <div>• Overlap center square = 2 × 2 = 4 m².</div>
  <div class="text-emerald-400 font-bold">• Road Area = 80 + 60 - 4 = 136 m².</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-pink-400 font-bold">Question 8: Missing Triangle Base</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> The area of a triangle is 90 cm² and its height is 12 cm. Find its base.
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Area = ½ × b × h ==> 90 = ½ × b × 12 ==> 90 = 6b ==> b = 15 cm.</div>
  <div class="text-emerald-400 font-bold">• Base = 15 cm.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-amber-400 font-bold">Question 9: Semicircle Perimeter</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find the perimeter of a semicircle including its diameter of 14 cm. (Use π = 22/7)
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Radius r = 7 cm. Curved arc = πr = (22/7) × 7 = 22 cm.</div>
  <div>• Total Perimeter = Curved Arc + Diameter = 22 + 14 = 36 cm.</div>
  <div class="text-emerald-400 font-bold">• Perimeter = 36 cm.</div>
</div>

<hr class="my-6 border-slate-800"/>

<h3 class="text-sky-400 font-bold">Question 10: Polishing Circular Table Top</h3>
<div class="my-2 p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
  <strong>Problem:</strong> Find the cost of polishing a circular table top of diameter 1.6 m, if rate of polishing is ₹15 per m². (Use π = 3.14)
</div>
<div class="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-xs text-slate-300 space-y-1">
  <div>• Radius r = 0.8 m. Area = 3.14 × (0.8)² = 3.14 × 0.64 = 2.0096 m².</div>
  <div>• Cost = 2.0096 × 15 = ₹30.14.</div>
  <div class="text-emerald-400 font-bold">• Cost = ₹30.14.</div>
</div>
""",
                    "audioText": "In Lesson 5 we solve 10 classic Class 7 exam questions covering rectangle wire rebending, wheel revolutions, circular track area, cross roads, and semicircle perimeters.",
                    "audioTextHinglish": "Lesson 5 me hum 10 solved Class 7 exam questions step by step solve karte hain.",
                    "keyInsight": "Review all 10 solved questions before taking the qualification exam.",
                    "widgetType": "Class7RectSquareAreaWidget",
                    "widgetData": {}
                },
                {
                    "title": "Lesson 6: Class 7 Master Qualification Exam (80% Pass Mark)",
                    "readingTime": "~10 min exam",
                    "narrative": """
<p>Congratulations on mastering Class 7 Perimeter and Area!</p>

<p>Pass the <strong>Class 7 Qualification Exam</strong> below to earn your chapter completion badge!</p>

<div class="my-4 p-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl space-y-3">
  <div class="flex items-center gap-2 text-amber-400 font-bold text-base font-sans">
    <span class="material-symbols-outlined">workspace_premium</span>
    <span>Chapter Completion Requirement</span>
  </div>
  <ul class="text-xs md:text-sm text-slate-300 space-y-1 list-disc list-inside font-sans">
    <li><strong>10 High-Yield Board Exam MCQs</strong> covering perimeter, area, circles, and pathways.</li>
    <li><strong>Passing Score: 80% or higher</strong> (at least 8 out of 10 correct).</li>
    <li>Step-by-step solutions provided after every answer!</li>
  </ul>
</div>
""",
                    "audioText": "Lesson 6 is your Class 7 Qualification Test. Score 80 percent or higher to earn your Class 7 completion badge.",
                    "audioTextHinglish": "Lesson 6 aapka Class 7 Qualification Test hai. 80% score karke apna chapter completion badge earn karein.",
                    "keyInsight": "Score 80%+ to complete Class 7 Perimeter and Area!",
                    "widgetType": "Class7PerimeterAreaMCQExamWidget",
                    "widgetData": {}
                }
            ]
        }
        pa_topic.lesson_config_json = json.dumps(config)

        db.commit()
        print("Successfully seeded Class 7 Perimeter and Area topic and 6-lesson curriculum!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 7 Perimeter and Area: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class7_perimeter_area()
