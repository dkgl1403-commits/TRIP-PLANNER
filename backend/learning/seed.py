import os
import sys
import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic, init_db

def seed_trigonometry():
    # Initialize DB (creates tables if missing)
    init_db()
    
    db = SessionLocal()
    try:
        # 1. Get or create Class and Subject
        class_10 = db.query(LearningClass).filter_by(level=10, name="Class 10").first()
        if not class_10:
            class_10 = LearningClass(level=10, name="Class 10")
            db.add(class_10)
            db.flush()

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_10.id).first()
        if not math_subject:
            math_subject = LearningSubject(name="Mathematics", class_id=class_10.id)
            db.add(math_subject)
            db.flush()

        # 2. Get or create the Topic
        topic_name = "Introduction to Trigonometry"
        topic = db.query(LearningTopic).filter_by(subject_id=math_subject.id, name=topic_name).first()
        if not topic:
            topic = LearningTopic(subject_id=math_subject.id, name=topic_name, order_idx=1)
            db.add(topic)
            db.flush()

        # 3. Create the massive 22-step configuration
        config = {
            "parts": [
                # STEP 1.1
                {
                    "title": "The Problem: How Do You Measure the Sky?",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Over 2,000 years ago, a Greek astronomer named <strong>Hipparchus</strong> was obsessed with the stars. He wanted to create the most accurate star map ever made.</p><p>But there was a fundamental problem: <strong>space is just empty blackness</strong>. You can't stretch a measuring tape between two stars.</p><p>However, Hipparchus noticed something. If you stand on the ground and look at two different stars, your eyes naturally sweep through an <strong>angle</strong> to move from one star to the other. He could measure <em>that</em>.</p><p>His genius question was: <strong>\"If I know the angle, can I figure out the distance?\"</strong></p>",
                    "audioText": "Over 2,000 years ago, a Greek astronomer named Hipparchus was obsessed with the stars. He wanted to create the most accurate star map ever made. But there was a fundamental problem: space is just empty blackness. You can't stretch a measuring tape between two stars. However, Hipparchus noticed something. If you stand on the ground and look at two different stars, your eyes naturally sweep through an angle to move from one star to the other. He could measure that. His genius question was: If I know the angle, can I figure out the distance?",
                    "keyInsight": "You can't measure distance in space directly, but you CAN measure angles — and angles are all you need.",
                    "widgetType": "StarObserverDiagram",
                    "widgetData": {}
                },
                # STEP 1.2
                {
                    "title": "The Imaginary Circle",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Hipparchus's breakthrough was an elegant trick. He imagined the entire night sky as a <strong>giant circle</strong> with himself sitting right at the center.</p><p>Now, the straight line connecting any two stars on this circle is called a <strong>\"Chord.\"</strong></p><p>Here's the magic: if you fix the radius of the circle, then <strong>every angle produces a unique chord length</strong>.</p><ul><li>A <strong>small angle</strong> &rarr; a short chord</li><li>A <strong>large angle</strong> &rarr; a long chord</li></ul><p>You just measure the angle from the ground, and then look up the corresponding chord length in a table. <strong>The problem of measuring the sky becomes the problem of looking things up in a book.</strong></p>",
                    "audioText": "Hipparchus's breakthrough was an elegant trick. He imagined the entire night sky as a giant circle with himself sitting right at the center. The straight line connecting any two stars on this circle is called a Chord. Here's the magic: if you fix the radius of the circle, then every angle produces a unique chord length. A small angle gives a short chord. A large angle gives a long chord. The problem of measuring the sky becomes the problem of looking things up in a book.",
                    "keyInsight": "Fix the circle's radius, and every angle maps to exactly one chord length. Trigonometry is just a lookup table.",
                    "widgetType": "InteractiveChordCircle",
                    "widgetData": {},
                    "miniChallenge": {
                        "question": "If the angle exactly doubles from 30° to 60°, does the chord length also exactly double?",
                        "options": ["Yes, it doubles perfectly.", "No, it almost doubles but not exactly.", "It stays the same."],
                        "correctIndex": 1,
                        "explanation": "Correct! A 60° chord (60.0) is not exactly twice a 30° chord (31.1). Because it's a curve, it's not perfectly linear. This is why Hipparchus had to calculate every single angle!"
                    }
                },
                # STEP 1.3
                {
                    "title": "The Hexagon Method",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Hipparchus needed a master \"cheat sheet.\" But without a calculator, how did he figure out the lengths of these invisible lines?</p><p>He started with a shape he already knew well: the <strong>regular hexagon</strong>.</p><p>If you inscribe a perfect hexagon inside a circle, it divides the circle into exactly 6 equal slices of 60&deg; each. A hexagon is made up of <strong>6 perfect equilateral triangles</strong>.</p><p>Since each triangle has one side that's a <strong>radius</strong> and another side that's a <strong>chord</strong>, he discovered his first master rule: <strong>At exactly 60&deg;, the Chord is perfectly equal to the Radius.</strong></p>",
                    "audioText": "Hipparchus needed a master cheat sheet. But without a calculator, how did he figure out the lengths of these invisible lines? He started with a shape he already knew well: the regular hexagon. If you inscribe a perfect hexagon inside a circle, it divides the circle into exactly 6 equal slices of 60 degrees each. A hexagon is made up of 6 perfect equilateral triangles. Since each triangle has one side that's a radius and another side that's a chord, he discovered his first master rule: At exactly 60 degrees, the Chord is perfectly equal to the Radius.",
                    "keyInsight": "A hexagon gave Hipparchus his first free answer: Chord(60°) = R. From there, he halved his way to a complete table.",
                    "widgetType": "HexagonChordDiagram",
                    "widgetData": {}
                },
                # STEP 1.4
                {
                    "title": "The First Trigonometry Table",
                    "readingTime": "~1 min read",
                    "narrative": "<p>Starting from his hexagon rule, Hipparchus used half-angle formulas to calculate chords for smaller and smaller angles. He compiled these into a table &mdash; <strong>the world's first trigonometry table</strong>.</p><p>His circle had a fixed radius of <strong>R = 60</strong>, using the Babylonian base-60 number system (the same system we still use for minutes and seconds today).</p><p>The table shows some of his calculated values. Notice how the chord at 60&deg; is exactly 60 &mdash; confirming his hexagon proof.</p>",
                    "audioText": "Starting from his hexagon rule, Hipparchus used half-angle formulas to calculate chords for smaller and smaller angles. He compiled these into a table, the world's first trigonometry table. His circle had a fixed radius of 60, using the Babylonian base-60 number system. The table shows some of his calculated values.",
                    "keyInsight": "This table, carved in stone over 2,000 years ago, is the direct ancestor of the 'sin' button on your calculator.",
                    "widgetType": "ChordTableWidget",
                    "widgetData": {}
                },
                # STEP 1.5
                {
                    "title": "Why Did He Do All This?",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Because Hipparchus had an audacious goal: he wanted to calculate the <strong>distance from the Earth to the Moon</strong>.</p><p>He knew that if two astronomers stood in two different cities on Earth &mdash; a known distance apart &mdash; and looked at the exact same point on the Moon, their lines of sight would form a <strong>giant triangle in space</strong>.</p><p>If he could measure the <strong>angles</strong> at the base of this triangle, he could look up the \"Chord\" in his table and solve for the missing height. His chord table could measure the Moon.</p>",
                    "audioText": "Why did he do all this? Because Hipparchus had an audacious goal: he wanted to calculate the distance from the Earth to the Moon. He knew that if two astronomers stood in two different cities on Earth, a known distance apart, and looked at the exact same point on the Moon, their lines of sight would form a giant triangle in space. If he could measure the angles at the base of this triangle, he could look up the Chord in his table and solve for the missing height.",
                    "keyInsight": "Trigonometry wasn't invented for exams. It was invented to measure the solar system.",
                    "widgetType": "TriangulationDiagram",
                    "widgetData": { "mode": "triangle" }
                },
                # STEP 1.6
                {
                    "title": "The Thumb Trick (Parallax)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Before we look at space, we need to understand a glitch in human vision called <strong>Parallax</strong>.</p><p>Try this: Hold your thumb out. Close your left eye and line your thumb up with a wall. Now, don't move your hand, but switch eyes. Your thumb appears to <strong>jump sideways</strong>!</p><p>Your thumb didn't move. What changed was the <strong>angle</strong> from which you're looking, because your two eyes are a few inches apart.</p><p>Hipparchus realized that two different cities could act as the two \"eyes\" to look at the Moon. The Moon would appear to \"jump\" against the background stars.</p>",
                    "audioText": "Before we look at space, we need to understand a glitch in human vision called Parallax. Try this: Hold your thumb out. Close your left eye and line your thumb up with a wall. Now, don't move your hand, but switch eyes. Your thumb appears to jump sideways! Your thumb didn't move. What changed was the angle from which you're looking, because your two eyes are a few inches apart. Hipparchus realized that two different cities could act as the two eyes to look at the Moon.",
                    "keyInsight": "Parallax is not a bug in your vision — it's a feature. It lets you calculate distance without moving.",
                    "widgetType": "ParallaxThumbDiagram",
                    "widgetData": {}
                },
                # STEP 1.7
                {
                    "title": "The Lucky Eclipse (189 BCE)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>To use Parallax, Hipparchus needed a background reference to measure the Moon's \"jump\" against. A <strong>Solar Eclipse</strong> provided the perfect background: the Sun itself.</p><p>On March 14, 189 BCE:</p><ul><li>In <strong>Hellespont (Turkey)</strong>, they saw a <strong>Total Eclipse</strong>. The Moon perfectly covered the Sun.</li><li>In <strong>Alexandria (Egypt)</strong>, they saw a <strong>Partial Eclipse</strong>. Exactly 1/5th of the Sun was still visible.</li></ul><p>This meant from Alexandria's viewpoint, the Moon had \"jumped\" by exactly 1/5th of the Sun's disk. He had his measurement.</p>",
                    "audioText": "To use Parallax, Hipparchus needed a background reference to measure the Moon's jump against. A Solar Eclipse provided the perfect background: the Sun itself. On March 14, 189 BCE, in Hellespont, Turkey, they saw a Total Eclipse. The Moon perfectly covered the Sun. But in Alexandria, Egypt, they saw a Partial Eclipse. Exactly one fifth of the Sun was still visible. This meant from Alexandria's viewpoint, the Moon had jumped by exactly one fifth of the Sun's disk.",
                    "keyInsight": "The fact that one city saw a total eclipse and the other didn't meant the Moon was in a slightly different position for each — measurable parallax.",
                    "widgetType": "EclipseDiagram",
                    "widgetData": {}
                },
                # STEP 1.8
                {
                    "title": "30 Earth Diameters",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Hipparchus built his giant triangle.</p><p><strong>1. The Base:</strong> The distance between the cities was ~1,000 miles.</p><p><strong>2. The Parallax Angle:</strong> Since the Sun takes up 0.5&deg; of the sky, and the Moon shifted by 1/5th of that, the top angle was <strong>0.1&deg;</strong>.</p><p>He opened his Chord Table. For an angle of 0.1&deg;, the table showed the triangle had to be incredibly long to close that gap. The math revealed the distance was roughly <strong>238,000 miles</strong>.</p><p>Since Earth is ~8,000 miles in diameter, he concluded the Moon is <strong>30 Earth-diameters away</strong>. An astonishingly accurate calculation.</p>",
                    "audioText": "Hipparchus built his giant triangle. The base: The distance between the cities was 1,000 miles. The top angle: Since the Sun takes up half a degree of the sky, and the Moon shifted by one fifth of that, the top angle was zero point one degrees. He opened his Chord Table. The math revealed the distance was roughly 238,000 miles. Since Earth is 8,000 miles in diameter, he concluded the Moon is 30 Earth-diameters away. An astonishingly accurate calculation.",
                    "keyInsight": "He didn't invent Trigonometry to torture students — he invented it to hack human vision and measure the solar system.",
                    "widgetType": "MoonDistanceDiagram",
                    "widgetData": { "mode": "distance" },
                    "miniChallenge": {
                        "question": "If the parallax angle were 0.2° instead of 0.1° (the Moon appeared to shift MORE), would that mean the Moon is closer or farther away?",
                        "options": ["Closer", "Farther Away", "No difference"],
                        "correctIndex": 0,
                        "explanation": "Correct! A bigger shift means the object is nearer to you. Hold your thumb close to your face and switch eyes—it jumps a lot. Hold it far away, it jumps less."
                    }
                },
                # STEP 1.9
                {
                    "title": "The Problem with Full Chords",
                    "readingTime": "~2 min read",
                    "narrative": "<p>For 600 years, astronomers used his Chord Table. But it was <strong>awkward</strong>.</p><p>The full chord stretches from one point on the circle to another. It doesn't naturally create a <strong>right angle</strong> anywhere. And without a right angle, you can't easily use the Pythagorean Theorem.</p><p>Every calculation required extra steps: convert the chord into two halves, construct a perpendicular, and then work with the resulting right triangle. Mathematicians were spending more time on bookkeeping than on the actual problem.</p>",
                    "audioText": "For 600 years, astronomers used his Chord Table. But it was awkward. The full chord stretches from one point on the circle to another. It doesn't naturally create a right angle anywhere. And without a right angle, you can't easily use the Pythagorean Theorem. Every calculation required extra steps: construct a perpendicular, and then work with the resulting right triangle.",
                    "keyInsight": "The full chord requires extra construction to get a right triangle.",
                    "widgetType": "ChordVsHalfChordDiagram",
                    "widgetData": {}
                },
                # STEP 1.10
                {
                    "title": "Aryabhata's Half-Chord Breakthrough",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Around 499 CE, an Indian mathematician named <strong>Aryabhata</strong> found a shortcut. His key insight: <strong>instead of measuring the full chord, measure half of it.</strong></p><p>Drop a perpendicular line from the center to the midpoint of the chord. This forms a perfect <strong>right-angled triangle</strong>.</p><p>Aryabhata called this half-chord <em>ardha-jya</em> (half-bowstring), which was shortened to just <strong>jya</strong>.</p><p>This <em>jya</em> is mathematically identical to what we today call the <strong>Sine function</strong>. Aryabhata eliminated all the extra construction steps.</p>",
                    "audioText": "Around 499 CE, an Indian mathematician named Aryabhata found a shortcut. His key insight: instead of measuring the full chord, measure half of it. Drop a perpendicular line from the center to the midpoint of the chord. This forms a perfect right-angled triangle. Aryabhata called this half-chord ardha-jya, which was shortened to just jya. This jya is mathematically identical to what we today call the Sine function.",
                    "keyInsight": "The half-chord creates a natural right triangle inside the circle. This half-chord IS the Sine function.",
                    "widgetType": "InteractiveHalfChordCircle",
                    "widgetData": {}
                },
                # STEP 1.11
                {
                    "title": "Why Did Aryabhata Choose R = 3438?",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Hipparchus used a radius of 60. Aryabhata chose <strong>R = 3438</strong>. Why such a strange number?</p><p>A full circle has 360 degrees, and each degree has 60 arc-minutes. So a full circle has <strong>21,600 arc-minutes</strong>.</p><p>If you want the circumference (2&pi;R) to equal exactly 21,600, you need:<br/>2&pi;R = 21,600<br/>R &approx; 3,438</p><p>By choosing this radius, Aryabhata made it so that <strong>1 arc-minute = 1 unit of length</strong> on the circumference. Angles and lengths were measured in the exact same units!</p>",
                    "audioText": "Hipparchus used a radius of 60. Aryabhata chose R equals 3438. Why such a strange number? A full circle has 21,600 arc-minutes. If you want the circumference to equal exactly 21,600, you need the radius to be 3438. By choosing this radius, Aryabhata made it so that 1 arc-minute equals 1 unit of length on the circumference. Angles and lengths were measured in the exact same units!",
                    "keyInsight": "R = 3,438 wasn't random — it made 1 arc-minute = 1 unit of length. Choosing the right units is half the battle in mathematics.",
                    "widgetType": "ArcMinuteCircleDiagram",
                    "widgetData": {}
                },
                # STEP 1.12
                {
                    "title": "The Difference Method",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Aryabhata didn't calculate each sine value from scratch. He discovered a <strong>recursive pattern</strong>.</p><p>He divided the first 90&deg; into 24 intervals of 3.75&deg; each. He then computed how much the sine value <em>changed</em> from one step to the next (the differences).</p><p>He noticed the differences were <strong>decreasing</strong>. The first difference was 225, the next 224, then 222.</p><p>He found the mathematical rule governing this decrease. This meant he could start with just the first value (225) and compute all 24 values using only addition and subtraction!</p>",
                    "audioText": "Aryabhata didn't calculate each sine value from scratch. He discovered a recursive pattern. He divided the first 90 degrees into 24 intervals. He then computed how much the sine value changed from one step to the next. He noticed the differences were decreasing predictably. He found the mathematical rule governing this decrease. This meant he could start with just the first value and compute all 24 values using only addition and subtraction!",
                    "keyInsight": "Aryabhata didn't need a calculator. From one seed value (225), he grew the entire table using a recursive pattern.",
                    "widgetType": "DifferenceBarChart",
                    "widgetData": {}
                },
                # STEP 1.13
                {
                    "title": "The Complete Sine Table",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Below are values Aryabhata computed in 499 CE. They were encoded as Sanskrit verses.</p><p>His table uses R = 3,438. To convert to modern sine values, simply divide by R:<br/><strong>sin(&theta;) = jya(&theta;) / 3,438</strong></p><p>For example: jya(30&deg;) = 1,719. So sin(30&deg;) = 1,719 / 3,438 = <strong>0.5000</strong> &mdash; exactly correct!</p><p>His values match modern sine functions to 4 decimal places.</p>",
                    "audioText": "Below are values Aryabhata computed in 499 CE. His table uses R = 3,438. To convert to modern sine values, simply divide his value by 3438. For example, his value for 30 degrees is 1719. Divide that by 3438, and you get exactly 0.5. His values match modern sine functions to 4 decimal places.",
                    "keyInsight": "1,500 years ago, Aryabhata calculated sin(30°) = 0.5000 exactly.",
                    "widgetType": "AryabhataSineTable",
                    "widgetData": {}
                },
                # STEP 1.14
                {
                    "title": "The Linguistic Journey: Jya to Sine",
                    "readingTime": "~2 min read",
                    "narrative": "<p>The word \"Sine\" has one of the strangest origin stories.</p><ol><li>The Sanskrit word <strong>jya</strong> (bowstring) was translated phonetically into Arabic as <strong>jiba</strong>.</li><li>Arabic often omits vowels, leaving just <strong>jb</strong>. Centuries later, scholars misread \"jb\" as the common Arabic word <strong>jaib</strong>, which means \"pocket\" or \"fold\".</li><li>When European scholars translated Arabic texts into Latin, they translated \"pocket\" literally into the Latin word <strong>sinus</strong>.</li><li>\"Sinus\" became the English word <strong>Sine</strong>.</li></ol>",
                    "audioText": "The word Sine has one of the strangest origin stories. The Sanskrit word jya, meaning bowstring, was translated phonetically into Arabic as jiba. Arabic often omits vowels, leaving just jb. Centuries later, scholars misread jb as the common Arabic word jaib, which means pocket or fold. When European scholars translated Arabic texts into Latin, they translated pocket literally into the Latin word sinus. Sinus became the English word Sine.",
                    "keyInsight": "The word 'Sine' comes from a 1,000-year game of telephone: bowstring → pocket → fold → Sine.",
                    "widgetType": "LinguisticTimeline",
                    "widgetData": {},
                    "miniChallenge": {
                        "question": "The Sanskrit word 'jya' originally meant:",
                        "options": ["Pocket", "Bowstring", "Triangle", "Moon"],
                        "correctIndex": 1,
                        "explanation": "Correct! A chord looks exactly like a bowstring stretched across a wooden bow (the arc of the circle)."
                    }
                },
                # STEP 2.1
                {
                    "title": "Prerequisites & Continuity",
                    "readingTime": "~1 min read",
                    "narrative": "<h3>What You Must Know</h3><ul><li><strong>Right-Angled Triangles:</strong> Identifying the Hypotenuse, Perpendicular/Opposite, and Base/Adjacent.</li><li><strong>Pythagorean Theorem:</strong> H&sup2; = P&sup2; + B&sup2;</li></ul><h3>What You Will Learn Next</h3><ul><li><strong>Heights and Distances:</strong> Using ratios to find heights without measuring them (Class 10).</li><li><strong>Sine/Cosine Rules:</strong> For non-right triangles (Class 11).</li><li><strong>Wave Mechanics:</strong> Fourier analysis and signals (University).</li></ul>",
                    "audioText": "What you must know: Right-angled triangles, and the Pythagorean theorem. What you will learn next: Heights and distances in Class 10, sine and cosine rules for non-right triangles in Class 11, and wave mechanics in university.",
                    "keyInsight": "Trigonometry is a bridge. Everything you learned leads here, and everything in higher math depends on this.",
                    "widgetType": None,
                    "widgetData": {}
                },
                # STEP 3.1
                {
                    "title": "Real Life Applications",
                    "readingTime": "~2 min read",
                    "narrative": "<p><strong>Why Are We Learning This?</strong></p><p><strong>1. Architecture:</strong> Calculate the height of a building without climbing it by measuring the angle to the top.</p><p><strong>2. Navigation:</strong> Your phone's GPS measures angles and travel times from satellites to calculate your position via triangulation.</p><p><strong>3. Sound & Light:</strong> Sound waves are mathematically modeled as sine waves. Every speaker relies on trig.</p><p><strong>4. 3D Graphics:</strong> Every time a video game rotates an object, it uses sine and cosine to calculate the new pixels.</p>",
                    "audioText": "Why are we learning this? In architecture, you calculate heights of buildings using angles. In navigation, your phone's GPS uses triangulation. In physics, sound and light are modeled as sine waves. And in 3D graphics, every object rotation uses sine and cosine.",
                    "keyInsight": "Trigonometry is the invisible math running inside your phone, your games, your music, and the buildings you live in.",
                    "widgetType": "RealLifePanels",
                    "widgetData": {}
                },
                # STEP 4.1
                {
                    "title": "SOH-CAH-TOA",
                    "readingTime": "~3 min read",
                    "narrative": "<p>For any right-angled triangle with an angle <strong>&theta;</strong>, we name the sides: <strong>Opposite</strong>, <strong>Adjacent</strong>, and <strong>Hypotenuse</strong>.</p><p>The primary ratios are:</p><ul><li><strong>sin &theta;</strong> = Opposite / Hypotenuse</li><li><strong>cos &theta;</strong> = Adjacent / Hypotenuse</li><li><strong>tan &theta;</strong> = Opposite / Adjacent</li></ul><p>Remember the trick: <strong>SOH-CAH-TOA</strong>.</p><p>Play with the triangle diagram. Notice that as the angle changes, the ratios change. But if you were to scale the triangle to be 10x larger while keeping the angle the same, the ratios would remain identical!</p>",
                    "audioText": "For any right-angled triangle, we name the sides Opposite, Adjacent, and Hypotenuse. The primary ratios are Sine, Cosine, and Tangent. Remember the trick SOH CAH TOA. Notice in the diagram that the ratio depends only on the angle, not the size of the triangle.",
                    "keyInsight": "The ratio depends ONLY on the angle, not the size of the triangle.",
                    "widgetType": "InteractiveRightTriangle",
                    "widgetData": {}
                },
                # STEP 4.2
                {
                    "title": "Deriving Standard Values (30° & 60°)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Where do the standard table values come from? Let's prove them.</p><p>Start with an <strong>equilateral triangle</strong> of side length 2a (all angles 60&deg;).</p><p>Drop a perpendicular from the top. It splits the triangle into two right triangles with angles 30&deg;, 60&deg;, 90&deg;.</p><p>Using Pythagoras, the height is <strong>a&radic;3</strong>.</p><p>Now just read off the ratios:<br/>sin(30&deg;) = a / 2a = <strong>1/2</strong><br/>sin(60&deg;) = a&radic;3 / 2a = <strong>&radic;3/2</strong></p>",
                    "audioText": "Where do the standard table values come from? Start with an equilateral triangle. Drop a perpendicular from the top. It splits the triangle into two right triangles with angles 30, 60, and 90. Using Pythagoras, we find the height. Then we simply read the ratios straight off the sides of the triangle.",
                    "keyInsight": "The standard values aren't magic numbers. They come from splitting a simple equilateral triangle in half.",
                    "widgetType": "EquilateralSplitDiagram",
                    "widgetData": {}
                },
                # STEP 4.3
                {
                    "title": "The Standard Values Table",
                    "readingTime": "~1 min read",
                    "narrative": "<p>Here is the table you must memorize.</p><p>Notice the beautiful pattern in the <strong>sin</strong> row: &radic;0/2, &radic;1/2, &radic;2/2, &radic;3/2, &radic;4/2.</p><p>The <strong>cos</strong> row is simply the sin row in reverse!</p>",
                    "audioText": "Here is the table you must memorize. Notice the beautiful pattern in the sine row: root 0 over 2, root 1 over 2, root 2 over 2, root 3 over 2, and root 4 over 2. The cosine row is simply the sine row in reverse!",
                    "keyInsight": "Don't memorize 30 numbers. Memorize one pattern. That's the sin row. Reverse it for cos.",
                    "widgetType": "StandardValuesTable",
                    "widgetData": {}
                },
                # STEP 4.4
                {
                    "title": "The Pythagorean Identity",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Start with the Pythagorean Theorem: <strong>P&sup2; + B&sup2; = H&sup2;</strong></p><p>Divide every term by H&sup2;, and you get (P/H)&sup2; + (B/H)&sup2; = 1.</p><p>Since P/H is sin and B/H is cos, we get the master identity:</p><h3>sin&sup2;&theta; + cos&sup2;&theta; = 1</h3><p>Divide this by cos&sup2;&theta; to get: tan&sup2;&theta; + 1 = sec&sup2;&theta;<br/>Divide by sin&sup2;&theta; to get: 1 + cot&sup2;&theta; = csc&sup2;&theta;</p>",
                    "audioText": "Start with the Pythagorean Theorem: P squared plus B squared equals H squared. Divide every term by H squared. Since P over H is sine and B over H is cosine, we get the master identity: sine squared plus cosine squared equals one. The other two identities are derived directly from this one.",
                    "keyInsight": "There's only ONE identity to remember: sin²θ + cos²θ = 1. The other two are derived from it.",
                    "widgetType": "IdentityDerivation",
                    "widgetData": {},
                    "miniChallenge": {
                        "question": "If sin(θ) = 3/5, what is cos(θ)?",
                        "options": ["4/5", "2/5", "5/3"],
                        "correctIndex": 0,
                        "explanation": "Correct! cos²θ = 1 - sin²θ. So 1 - (9/25) = 16/25. The square root of 16/25 is 4/5."
                    }
                },
                # STEP 6.1 (Practice MCQs)
                {
                    "title": "Practice Problems",
                    "readingTime": "~5 min practice",
                    "narrative": "<p>Let's test what you've learned. Try these interactive multiple-choice questions.</p>",
                    "audioText": "Let's test what you've learned. Try these interactive multiple-choice questions.",
                    "keyInsight": "Practice makes perfect.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "What is the value of sin 30°?",
                                "options": ["1/2", "√3/2", "1", "0"],
                                "correct": 0
                            },
                            {
                                "q": "sin²θ + cos²θ = ?",
                                "options": ["0", "1", "tan²θ", "sec²θ"],
                                "correct": 1
                            }
                        ]
                    }
                },
                # STEP 7.1 (Cheat Sheet)
                {
                    "title": "Master Cheat Sheet",
                    "readingTime": "~1 min review",
                    "narrative": "<p>Review this reference card before your exams.</p>",
                    "audioText": "You have completed the interactive lesson. Review this reference card before your exams.",
                    "keyInsight": "You are now ready to master Trigonometry.",
                    "widgetType": "CheatSheet",
                    "widgetData": {}
                }
            ]
        }

        # Update the topic config
        topic.lesson_config_json = config
        db.commit()
        print("Successfully seeded massive 22-step interactive Trigonometry lesson using FastAPI models.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == '__main__':
    seed_trigonometry()
