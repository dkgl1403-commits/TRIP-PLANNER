import os
import sys
import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic, init_db
from seed_real_numbers import seed_real_numbers
from seed_number_system_class9 import seed_number_system_class9
from seed_number_system_class8_part1 import seed_number_system_class8_part1

from seed_ai_masterclass_part1 import seed_ai_masterclass_part1
from seed_ai_masterclass_part2 import seed_ai_masterclass_part2
from seed_ai_masterclass_part3 import seed_ai_masterclass_part3
from seed_ai_masterclass_part4 import seed_ai_masterclass_part4
from seed_ai_masterclass_part5 import seed_ai_masterclass_part5
from seed_ai_masterclass_part6 import seed_ai_masterclass_part6
from seed_ai_masterclass_part7 import seed_ai_masterclass_part7
from seed_ai_masterclass_part8 import seed_ai_masterclass_part8
from seed_ai_masterclass_part9 import seed_ai_masterclass_part9
from seed_ai_masterclass_part10 import seed_ai_masterclass_part10
from seed_ai_masterclass_part11 import seed_ai_masterclass_part11

def seed_trigonometry():
    init_db()
    
    db = SessionLocal()
    try:
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

        topic_name = "Introduction to Trigonometry"
        topic = db.query(LearningTopic).filter_by(subject_id=math_subject.id, name=topic_name).first()
        if not topic:
            topic = LearningTopic(subject_id=math_subject.id, name=topic_name, order_idx=1)
            db.add(topic)
            db.flush()

        config = {
            "parts": [
                {
                    "title": "The Problem: How Do You Measure the Sky?",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Over 2,000 years ago, a Greek astronomer named <strong>Hipparchus</strong> was obsessed with the stars. He wanted to create the most accurate star map ever made.</p><p>But there was a fundamental problem: <strong>space is just empty blackness</strong>. You can't stretch a measuring tape between two stars.</p><p>However, Hipparchus noticed something. If you stand on the ground and look at two different stars, your eyes naturally sweep through an <strong>angle</strong> to move from one star to the other. He could measure <em>that</em>.</p><p>His genius question was: <strong>\"If I know the angle, can I figure out the distance?\"</strong></p>",
                    "audioText": "Over 2,000 years ago, a Greek astronomer named Hipparchus was obsessed with the stars. He wanted to create the most accurate star map ever made. But there was a fundamental problem: space is just empty blackness. You can't stretch a measuring tape between two stars. However, Hipparchus noticed something. If you stand on the ground and look at two different stars, your eyes naturally sweep through an angle to move from one star to the other. He could measure that. His genius question was: If I know the angle, can I figure out the distance?",
                    "audioTextHinglish": "Doh hazar saal pehle, ek Greek astronomer the Hipparchus, jo stars ko lekar bahut obsessed the. Woh sabse accurate star map banana chahte the. Par ek problem thi: space bilkul empty aur dark hai. Aap do stars ke beech measuring tape nahi kheench sakte. Lekin Hipparchus ne ek cheez notice ki. Agar aap zameen par khade ho kar do alag stars ko dekhein, toh aapki aankhein ek angle banati hain. Woh us angle ko measure kar sakte the. Unka genius sawal tha: Agar mujhe angle pata chal jaye, toh kya main distance figure out kar sakta hoon?",
                    "keyInsight": "You can't measure distance in space directly, but you CAN measure angles — and angles are all you need.",
                    "widgetType": "StarObserverDiagram",
                    "widgetData": {}
                },
                {
                    "title": "The Imaginary Circle",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Hipparchus's breakthrough was an elegant trick. He imagined the entire night sky as a <strong>giant circle</strong> with himself sitting right at the center.</p><p>Now, the straight line connecting any two stars on this circle is called a <strong>\"Chord.\"</strong></p><p>Here's the magic: if you fix the radius of the circle, then <strong>every angle produces a unique chord length</strong>.</p><ul><li>A <strong>small angle</strong> &rarr; a short chord</li><li>A <strong>large angle</strong> &rarr; a long chord</li></ul><p>You just measure the angle from the ground, and then look up the corresponding chord length in a table. <strong>The problem of measuring the sky becomes the problem of looking things up in a book.</strong></p>",
                    "audioText": "Hipparchus's breakthrough was an elegant trick. He imagined the entire night sky as a giant circle with himself sitting right at the center. The straight line connecting any two stars on this circle is called a Chord. Here's the magic: if you fix the radius of the circle, then every angle produces a unique chord length. A small angle gives a short chord. A large angle gives a long chord. The problem of measuring the sky becomes the problem of looking things up in a book.",
                    "audioTextHinglish": "Hipparchus ka breakthrough ek elegant trick tha. Unhone pure night sky ko ek giant circle ki tarah imagine kiya, jiske center mein woh khud the. Ab iss circle par do stars ko connect karne wali straight line ko Chord kehte hain. Yahan magic yeh hai: agar aap circle ka radius fix kar dein, toh har angle ek unique chord length produce karta hai. Chhota angle matlab chhoti chord. Bada angle matlab badi chord. Asmaan napne ka problem ab bas ek book mein values look up karne ka problem ban gaya.",
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
                {
                    "title": "The Hexagon Method",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Hipparchus needed a master \"cheat sheet.\" But without a calculator, how did he figure out the lengths of these invisible lines?</p><p>He started with a shape he already knew well: the <strong>regular hexagon</strong>.</p><p>If you inscribe a perfect hexagon inside a circle, it divides the circle into exactly 6 equal slices of 60&deg; each. A hexagon is made up of <strong>6 perfect equilateral triangles</strong>.</p><p>Since each triangle has one side that's a <strong>radius</strong> and another side that's a <strong>chord</strong>, he discovered his first master rule: <strong>At exactly 60&deg;, the Chord is perfectly equal to the Radius.</strong></p>",
                    "audioText": "Hipparchus needed a master cheat sheet. But without a calculator, how did he figure out the lengths of these invisible lines? He started with a shape he already knew well: the regular hexagon. If you inscribe a perfect hexagon inside a circle, it divides the circle into exactly 6 equal slices of 60 degrees each. A hexagon is made up of 6 perfect equilateral triangles. Since each triangle has one side that's a radius and another side that's a chord, he discovered his first master rule: At exactly 60 degrees, the Chord is perfectly equal to the Radius.",
                    "audioTextHinglish": "Hipparchus ko ek master cheat sheet chahiye thi. Par bina calculator ke unhone in invisible lines ki length kaise find ki? Unhone ek aisi shape se start kiya jo unhe pehle se pata thi: regular hexagon. Agar aap ek circle ke andar perfect hexagon draw karein, toh woh circle ko 60 degrees ke 6 equal slices mein divide karta hai. Ek hexagon 6 perfect equilateral triangles se banta hai. Kyunki har triangle ki ek side radius hai aur doosri side chord hai, unhe apna pehla master rule mila: Exactly 60 degrees par, Chord radius ke perfectly equal hoti hai.",
                    "keyInsight": "A hexagon gave Hipparchus his first free answer: Chord(60°) = R. From there, he halved his way to a complete table.",
                    "widgetType": "HexagonChordDiagram",
                    "widgetData": {}
                },
                {
                    "title": "The First Trigonometry Table",
                    "readingTime": "~1 min read",
                    "narrative": "<p>Starting from his hexagon rule, Hipparchus used half-angle formulas to calculate chords for smaller and smaller angles. He compiled these into a table &mdash; <strong>the world's first trigonometry table</strong>.</p><p>His circle had a fixed radius of <strong>R = 60</strong>, using the Babylonian base-60 number system (the same system we still use for minutes and seconds today).</p><p>The table shows some of his calculated values. Notice how the chord at 60&deg; is exactly 60 &mdash; confirming his hexagon proof.</p>",
                    "audioText": "Starting from his hexagon rule, Hipparchus used half-angle formulas to calculate chords for smaller and smaller angles. He compiled these into a table, the world's first trigonometry table. His circle had a fixed radius of 60, using the Babylonian base-60 number system. The table shows some of his calculated values.",
                    "audioTextHinglish": "Apne hexagon rule se shuru karke, Hipparchus ne half-angle formulas use kiye chote angles ke liye chord nikalne ke liye. Unhone isse ek table mein compile kiya jo duniya ki pehli trigonometry table thi. Unke circle ka fixed radius 60 tha, Babylonian base-60 number system ka use karte hue. Table mein unki calculate ki gayi values dikhayi gayi hain.",
                    "keyInsight": "This table, carved in stone over 2,000 years ago, is the direct ancestor of the 'sin' button on your calculator.",
                    "widgetType": "ChordTableWidget",
                    "widgetData": {}
                },
                {
                    "title": "Why Did He Do All This?",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Because Hipparchus had an audacious goal: he wanted to calculate the <strong>distance from the Earth to the Moon</strong>.</p><p>He knew that if two astronomers stood in two different cities on Earth &mdash; a known distance apart &mdash; and looked at the exact same point on the Moon, their lines of sight would form a <strong>giant triangle in space</strong>.</p><p>If he could measure the <strong>angles</strong> at the base of this triangle, he could look up the \"Chord\" in his table and solve for the missing height. His chord table could measure the Moon.</p>",
                    "audioText": "Why did he do all this? Because Hipparchus had an audacious goal: he wanted to calculate the distance from the Earth to the Moon. He knew that if two astronomers stood in two different cities on Earth, a known distance apart, and looked at the exact same point on the Moon, their lines of sight would form a giant triangle in space. If he could measure the angles at the base of this triangle, he could look up the Chord in his table and solve for the missing height.",
                    "audioTextHinglish": "Unhone yeh sab kyun kiya? Kyunki Hipparchus ka ek bada goal tha: woh Earth se Moon tak ka distance calculate karna chahte the. Woh jaante the ki agar do astronomers Earth par do alag cities mein khade hon, aur Moon ke same point ko dekhein, toh unki lines of sight space mein ek giant triangle banayengi. Agar woh is triangle ke base angles ko measure kar sakein, toh woh apni table mein Chord dekh kar height solve kar sakte hain.",
                    "keyInsight": "Trigonometry wasn't invented for exams. It was invented to measure the solar system.",
                    "widgetType": "TriangulationDiagram",
                    "widgetData": { "mode": "triangle" }
                },
                {
                    "title": "The Thumb Trick (Parallax)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Before we look at space, we need to understand a glitch in human vision called <strong>Parallax</strong>.</p><p>Try this: Hold your thumb out. Close your left eye and line your thumb up with a wall. Now, don't move your hand, but switch eyes. Your thumb appears to <strong>jump sideways</strong>!</p><p>Your thumb didn't move. What changed was the <strong>angle</strong> from which you're looking, because your two eyes are a few inches apart.</p><p>Hipparchus realized that two different cities could act as the two \"eyes\" to look at the Moon. The Moon would appear to \"jump\" against the background stars.</p>",
                    "audioText": "Before we look at space, we need to understand a glitch in human vision called Parallax. Try this: Hold your thumb out. Close your left eye and line your thumb up with a wall. Now, don't move your hand, but switch eyes. Your thumb appears to jump sideways! Your thumb didn't move. What changed was the angle from which you're looking, because your two eyes are a few inches apart. Hipparchus realized that two different cities could act as the two eyes to look at the Moon.",
                    "audioTextHinglish": "Space ko dekhne se pehle, hume human vision ke ek glitch ko samajhna hoga jise Parallax kehte hain. Yeh try karein: Apna thumb aage karein. Left eye close karke thumb ko wall se line up karein. Ab hand ko bina move kiye, eyes switch karein. Aapka thumb sideways jump karta hua dikhega! Thumb move nahi hua, sirf aapka angle change hua kyunki aapki do aankhein kuch inches door hain. Hipparchus ne samjha ki do alag cities do eyes ki tarah act kar sakti hain Moon ko dekhne ke liye.",
                    "keyInsight": "Parallax is not a bug in your vision — it's a feature. It lets you calculate distance without moving.",
                    "widgetType": "ParallaxThumbDiagram",
                    "widgetData": {}
                },
                {
                    "title": "The Lucky Eclipse (189 BCE)",
                    "readingTime": "~2 min read",
                    "narrative": "<p>To use Parallax, Hipparchus needed a background reference to measure the Moon's \"jump\" against. A <strong>Solar Eclipse</strong> provided the perfect background: the Sun itself.</p><p>On March 14, 189 BCE:</p><ul><li>In <strong>Hellespont (Turkey)</strong>, they saw a <strong>Total Eclipse</strong>. The Moon perfectly covered the Sun.</li><li>In <strong>Alexandria (Egypt)</strong>, they saw a <strong>Partial Eclipse</strong>. Exactly 1/5th of the Sun was still visible.</li></ul><p>This meant from Alexandria's viewpoint, the Moon had \"jumped\" by exactly 1/5th of the Sun's disk. He had his measurement.</p>",
                    "audioText": "To use Parallax, Hipparchus needed a background reference to measure the Moon's jump against. A Solar Eclipse provided the perfect background: the Sun itself. On March 14, 189 BCE, in Hellespont, Turkey, they saw a Total Eclipse. The Moon perfectly covered the Sun. But in Alexandria, Egypt, they saw a Partial Eclipse. Exactly one fifth of the Sun was still visible. This meant from Alexandria's viewpoint, the Moon had jumped by exactly one fifth of the Sun's disk.",
                    "audioTextHinglish": "Parallax use karne ke liye, Hipparchus ko ek background reference chahiye tha Moon ka jump measure karne ke liye. Solar Eclipse ne perfect background provide kiya: khud Sun. 189 BCE mein, Turkey mein unhone Total Eclipse dekha jahan Moon ne Sun ko puri tarah cover kar liya. Lekin Egypt mein, unhone Partial Eclipse dekha jahan Sun ka one-fifth part abhi bhi visible tha. Iska matlab Egypt ke viewpoint se, Moon ne Sun ke disk ka exactly one-fifth jump kiya tha.",
                    "keyInsight": "The fact that one city saw a total eclipse and the other didn't meant the Moon was in a slightly different position for each — measurable parallax.",
                    "widgetType": "EclipseDiagram",
                    "widgetData": {}
                },
                {
                    "title": "30 Earth Diameters",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Hipparchus built his giant triangle.</p><p><strong>1. The Base:</strong> The distance between the cities was ~1,000 miles.</p><p><strong>2. The Parallax Angle:</strong> Since the Sun takes up 0.5&deg; of the sky, and the Moon shifted by 1/5th of that, the top angle was <strong>0.1&deg;</strong>.</p><p>He opened his Chord Table. For an angle of 0.1&deg;, the table showed the triangle had to be incredibly long to close that gap. The math revealed the distance was roughly <strong>238,000 miles</strong>.</p><p>Since Earth is ~8,000 miles in diameter, he concluded the Moon is <strong>30 Earth-diameters away</strong>. An astonishingly accurate calculation.</p>",
                    "audioText": "Hipparchus built his giant triangle. The base: The distance between the cities was 1,000 miles. The top angle: Since the Sun takes up half a degree of the sky, and the Moon shifted by one fifth of that, the top angle was zero point one degrees. He opened his Chord Table. The math revealed the distance was roughly 238,000 miles. Since Earth is 8,000 miles in diameter, he concluded the Moon is 30 Earth-diameters away. An astonishingly accurate calculation.",
                    "audioTextHinglish": "Hipparchus ne apna giant triangle banaya. Base tha cities ke beech ka 1000 miles ka distance. Top angle zero point one degrees tha. Unhone apni Chord Table open ki aur math ne bataya ki distance lagbhag 238,000 miles hai. Kyunki Earth ka diameter 8,000 miles hai, unhone conclude kiya ki Moon Earth se 30 Earth-diameters door hai. Yeh ek amazingly accurate calculation thi.",
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
                {
                    "title": "The Problem with Full Chords",
                    "readingTime": "~2 min read",
                    "narrative": "<p>For 600 years, astronomers used his Chord Table. But it was <strong>awkward</strong>.</p><p>The full chord stretches from one point on the circle to another. It doesn't naturally create a <strong>right angle</strong> anywhere. And without a right angle, you can't easily use the Pythagorean Theorem.</p><p>Every calculation required extra steps: convert the chord into two halves, construct a perpendicular, and then work with the resulting right triangle. Mathematicians were spending more time on bookkeeping than on the actual problem.</p>",
                    "audioText": "For 600 years, astronomers used his Chord Table. But it was awkward. The full chord stretches from one point on the circle to another. It doesn't naturally create a right angle anywhere. And without a right angle, you can't easily use the Pythagorean Theorem. Every calculation required extra steps: construct a perpendicular, and then work with the resulting right triangle.",
                    "audioTextHinglish": "600 saal tak astronomers ne unki Chord Table use ki. Par yeh thodi awkward thi. Full chord circle par ek point se doosre point tak jaati hai. Yeh naturally kahin bhi right angle nahi banati. Aur bina right angle ke, aap easily Pythagorean Theorem use nahi kar sakte. Har calculation mein extra steps lagte the jisse mathematicians ka zyada time waste hota tha.",
                    "keyInsight": "The full chord requires extra construction to get a right triangle.",
                    "widgetType": "ChordVsHalfChordDiagram",
                    "widgetData": {}
                },
                {
                    "title": "Aryabhata's Half-Chord Breakthrough",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Around 499 CE, an Indian mathematician named <strong>Aryabhata</strong> found a shortcut. His key insight: <strong>instead of measuring the full chord, measure half of it.</strong></p><p>Drop a perpendicular line from the center to the midpoint of the chord. This forms a perfect <strong>right-angled triangle</strong>.</p><p>Aryabhata called this half-chord <em>ardha-jya</em> (half-bowstring), which was shortened to just <strong>jya</strong>.</p><p>This <em>jya</em> is mathematically identical to what we today call the <strong>Sine function</strong>. Aryabhata eliminated all the extra construction steps.</p>",
                    "audioText": "Around 499 CE, an Indian mathematician named Aryabhata found a shortcut. His key insight: instead of measuring the full chord, measure half of it. Drop a perpendicular line from the center to the midpoint of the chord. This forms a perfect right-angled triangle. Aryabhata called this half-chord ardha-jya, which was shortened to just jya. This jya is mathematically identical to what we today call the Sine function.",
                    "audioTextHinglish": "499 CE ke aas paas, ek Indian mathematician Aryabhata ne ek shortcut dhunda. Unka main idea tha: full chord measure karne ke bajay, uski half measure karo. Center se chord ke midpoint par ek perpendicular line drop karo. Yeh ek perfect right-angled triangle banata hai. Aryabhata ne is half-chord ko ardha-jya kaha, jo baad mein sirf jya ban gaya. Yeh jya wahi hai jise aaj hum Sine function kehte hain.",
                    "keyInsight": "The half-chord creates a natural right triangle inside the circle. This half-chord IS the Sine function.",
                    "widgetType": "InteractiveHalfChordCircle",
                    "widgetData": {}
                },
                {
                    "title": "Why Did Aryabhata Choose R = 3438?",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Hipparchus used a radius of 60. Aryabhata chose <strong>R = 3438</strong>. Why such a strange number?</p><p>A full circle has 360 degrees, and each degree has 60 arc-minutes. So a full circle has <strong>21,600 arc-minutes</strong>.</p><p>If you want the circumference (2&pi;R) to equal exactly 21,600, you need:<br/>2&pi;R = 21,600<br/>R &approx; 3,438</p><p>By choosing this radius, Aryabhata made it so that <strong>1 arc-minute = 1 unit of length</strong> on the circumference. Angles and lengths were measured in the exact same units!</p>",
                    "audioText": "Hipparchus used a radius of 60. Aryabhata chose R equals 3438. Why such a strange number? A full circle has 21,600 arc-minutes. If you want the circumference to equal exactly 21,600, you need the radius to be 3438. By choosing this radius, Aryabhata made it so that 1 arc-minute equals 1 unit of length on the circumference. Angles and lengths were measured in the exact same units!",
                    "audioTextHinglish": "Hipparchus ne radius 60 use kiya tha. Aryabhata ne radius 3438 choose kiya. Itna ajeeb number kyun? Ek full circle mein 21,600 arc-minutes hote hain. Agar aap chahte hain ki circumference exactly 21,600 ho, toh aapko radius 3438 chahiye. Yeh radius choose karke, Aryabhata ne yeh ensure kiya ki circumference par 1 arc-minute ka length exactly 1 unit ho. Matlab angles aur lengths same units mein measure hote the!",
                    "keyInsight": "R = 3,438 wasn't random — it made 1 arc-minute = 1 unit of length. Choosing the right units is half the battle in mathematics.",
                    "widgetType": "ArcMinuteCircleDiagram",
                    "widgetData": {}
                },
                {
                    "title": "The Difference Method",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Aryabhata didn't calculate each sine value from scratch. He discovered a <strong>recursive pattern</strong>.</p><p>He divided the first 90&deg; into 24 intervals of 3.75&deg; each. He then computed how much the sine value <em>changed</em> from one step to the next (the differences).</p><p>He noticed the differences were <strong>decreasing</strong>. The first difference was 225, the next 224, then 222.</p><p>He found the mathematical rule governing this decrease. This meant he could start with just the first value (225) and compute all 24 values using only addition and subtraction!</p>",
                    "audioText": "Aryabhata didn't calculate each sine value from scratch. He discovered a recursive pattern. He divided the first 90 degrees into 24 intervals. He then computed how much the sine value changed from one step to the next. He noticed the differences were decreasing predictably. He found the mathematical rule governing this decrease. This meant he could start with just the first value and compute all 24 values using only addition and subtraction!",
                    "audioTextHinglish": "Aryabhata ne har sine value zero se calculate nahi ki. Unhe ek recursive pattern mil gaya. Unhone pehle 90 degrees ko 24 intervals mein divide kiya. Phir unhone calculate kiya ki ek step se agle step tak sine value kitni change hoti hai. Unhone notice kiya ki yeh differences decrease ho rahe the. Unhone is decrease ka mathematical rule dhund liya. Jiska matlab tha ki woh bas pehli value se start karke sabhi 24 values sirf addition aur subtraction se calculate kar sakte the!",
                    "keyInsight": "Aryabhata didn't need a calculator. From one seed value (225), he grew the entire table using a recursive pattern.",
                    "widgetType": "DifferenceBarChart",
                    "widgetData": {}
                },
                {
                    "title": "The Complete Sine Table",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Below are values Aryabhata computed in 499 CE. They were encoded as Sanskrit verses.</p><p>His table uses R = 3,438. To convert to modern sine values, simply divide by R:<br/><strong>sin(&theta;) = jya(&theta;) / 3,438</strong></p><p>For example: jya(30&deg;) = 1,719. So sin(30&deg;) = 1,719 / 3,438 = <strong>0.5000</strong> &mdash; exactly correct!</p><p>His values match modern sine functions to 4 decimal places.</p>",
                    "audioText": "Below are values Aryabhata computed in 499 CE. His table uses R = 3,438. To convert to modern sine values, simply divide his value by 3438. For example, his value for 30 degrees is 1719. Divide that by 3438, and you get exactly 0.5. His values match modern sine functions to 4 decimal places.",
                    "audioTextHinglish": "Neeche woh values hain jo Aryabhata ne 499 CE mein compute ki thi. Unki table mein radius 3438 hai. Modern sine values mein convert karne ke liye, unki value ko bas 3438 se divide karein. Example ke liye, 30 degrees ki value 1719 hai. Isko 3438 se divide karne par aapko exactly 0.5 milta hai. Unki values modern sine functions se poori tarah match karti hain.",
                    "keyInsight": "1,500 years ago, Aryabhata calculated sin(30°) = 0.5000 exactly.",
                    "widgetType": "AryabhataSineTable",
                    "widgetData": {}
                },
                {
                    "title": "The Linguistic Journey: Jya to Sine",
                    "readingTime": "~2 min read",
                    "narrative": "<p>The word \"Sine\" has one of the strangest origin stories.</p><ol><li>The Sanskrit word <strong>jya</strong> (bowstring) was translated phonetically into Arabic as <strong>jiba</strong>.</li><li>Arabic often omits vowels, leaving just <strong>jb</strong>. Centuries later, scholars misread \"jb\" as the common Arabic word <strong>jaib</strong>, which means \"pocket\" or \"fold\".</li><li>When European scholars translated Arabic texts into Latin, they translated \"pocket\" literally into the Latin word <strong>sinus</strong>.</li><li>\"Sinus\" became the English word <strong>Sine</strong>.</li></ol>",
                    "audioText": "The word Sine has one of the strangest origin stories. The Sanskrit word jya, meaning bowstring, was translated phonetically into Arabic as jiba. Arabic often omits vowels, leaving just jb. Centuries later, scholars misread jb as the common Arabic word jaib, which means pocket or fold. When European scholars translated Arabic texts into Latin, they translated pocket literally into the Latin word sinus. Sinus became the English word Sine.",
                    "audioTextHinglish": "Word Sine ki origin story bahut ajeeb hai. Sanskrit word jya ka arabic mein translation jiba hua. Arabic mein aksar vowels hata diye jaate hain, toh bacha sirf jb. Sadiyon baad, scholars ne jb ko galti se jaib padh liya, jiska matlab pocket ya fold hota hai. Jab European scholars ne Arabic texts ko Latin mein translate kiya, toh unhone pocket ko Latin word sinus likh diya. Aur wahi sinus baad mein English word Sine ban gaya.",
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
                {
                    "title": "Prerequisites & Continuity",
                    "readingTime": "~1 min read",
                    "narrative": "<h3>What You Must Know</h3><ul><li><strong>Right-Angled Triangles:</strong> Identifying the Hypotenuse, Perpendicular/Opposite, and Base/Adjacent.</li><li><strong>Pythagorean Theorem:</strong> H&sup2; = P&sup2; + B&sup2;</li></ul><h3>What You Will Learn Next</h3><ul><li><strong>Heights and Distances:</strong> Using ratios to find heights without measuring them (Class 10).</li><li><strong>Sine/Cosine Rules:</strong> For non-right triangles (Class 11).</li><li><strong>Wave Mechanics:</strong> Fourier analysis and signals (University).</li></ul>",
                    "audioText": "What you must know: Right-angled triangles, and the Pythagorean theorem. What you will learn next: Heights and distances in Class 10, sine and cosine rules for non-right triangles in Class 11, and wave mechanics in university.",
                    "audioTextHinglish": "Aapko kya pata hona chahiye: Right-angled triangles, aur Pythagorean theorem. Aap aage kya seekhenge: Class 10 mein heights and distances, Class 11 mein non-right triangles ke liye sine aur cosine rules, aur university mein wave mechanics.",
                    "keyInsight": "Trigonometry is a bridge. Everything you learned leads here, and everything in higher math depends on this.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Real Life Applications",
                    "readingTime": "~2 min read",
                    "narrative": "<p><strong>Why Are We Learning This?</strong></p><p><strong>1. Architecture:</strong> Calculate the height of a building without climbing it by measuring the angle to the top.</p><p><strong>2. Navigation:</strong> Your phone's GPS measures angles and travel times from satellites to calculate your position via triangulation.</p><p><strong>3. Sound & Light:</strong> Sound waves are mathematically modeled as sine waves. Every speaker relies on trig.</p><p><strong>4. 3D Graphics:</strong> Every time a video game rotates an object, it uses sine and cosine to calculate the new pixels.</p>",
                    "audioText": "Why are we learning this? In architecture, you calculate heights of buildings using angles. In navigation, your phone's GPS uses triangulation. In physics, sound and light are modeled as sine waves. And in 3D graphics, every object rotation uses sine and cosine.",
                    "audioTextHinglish": "Hum yeh kyun seekh rahe hain? Architecture mein, aap angles ka use karke buildings ki height nikalte hain. Navigation mein, aapke phone ka GPS triangulation use karta hai. Physics mein, sound aur light ko sine waves ki tarah model kiya jata hai. Aur 3D graphics mein, object ki har rotation mein sine aur cosine ka use hota hai.",
                    "keyInsight": "Trigonometry is the invisible math running inside your phone, your games, your music, and the buildings you live in.",
                    "widgetType": "RealLifePanels",
                    "widgetData": {}
                },
                {
                    "title": "SOH-CAH-TOA",
                    "readingTime": "~3 min read",
                    "narrative": "<p>For any right-angled triangle with an angle <strong>&theta;</strong>, we name the sides: <strong>Opposite</strong>, <strong>Adjacent</strong>, and <strong>Hypotenuse</strong>.</p><p>The primary ratios are:</p><ul><li><strong>sin &theta;</strong> = Opposite / Hypotenuse</li><li><strong>cos &theta;</strong> = Adjacent / Hypotenuse</li><li><strong>tan &theta;</strong> = Opposite / Adjacent</li></ul><p>Remember the trick: <strong>SOH-CAH-TOA</strong>.</p><p>Play with the triangle diagram. Notice that as the angle changes, the ratios change. But if you were to scale the triangle to be 10x larger while keeping the angle the same, the ratios would remain identical!</p>",
                    "audioText": "For any right-angled triangle, we name the sides Opposite, Adjacent, and Hypotenuse. The primary ratios are Sine, Cosine, and Tangent. Remember the trick SOH CAH TOA. Notice in the diagram that the ratio depends only on the angle, not the size of the triangle.",
                    "audioTextHinglish": "Kisi bhi right-angled triangle ke liye, hum sides ko Opposite, Adjacent, aur Hypotenuse kehte hain. Primary ratios Sine, Cosine, aur Tangent hain. Bas yeh trick yaad rakhein: SOH CAH TOA. Diagram mein notice karein ki ratio sirf angle par depend karta hai, triangle ke size par nahi.",
                    "keyInsight": "The ratio depends ONLY on the angle, not the size of the triangle.",
                    "widgetType": "InteractiveRightTriangle",
                    "widgetData": {}
                },
                {
                    "title": "Deriving Standard Values (30° & 60°)",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Where do the standard table values come from? Let's prove them.</p><p>Start with an <strong>equilateral triangle</strong> of side length 2a (all angles 60&deg;).</p><p>Drop a perpendicular from the top. It splits the triangle into two right triangles with angles 30&deg;, 60&deg;, 90&deg;.</p><p>Using Pythagoras, the height is <strong>a&radic;3</strong>.</p><p>Now just read off the ratios:<br/>sin(30&deg;) = a / 2a = <strong>1/2</strong><br/>sin(60&deg;) = a&radic;3 / 2a = <strong>&radic;3/2</strong></p>",
                    "audioText": "Where do the standard table values come from? Start with an equilateral triangle. Drop a perpendicular from the top. It splits the triangle into two right triangles with angles 30, 60, and 90. Using Pythagoras, we find the height. Then we simply read the ratios straight off the sides of the triangle.",
                    "audioTextHinglish": "Standard table ki values kahan se aati hain? Ek equilateral triangle se start karte hain. Upar se ek perpendicular drop karein. Yeh triangle ko do right triangles mein split kar dega jinke angles 30, 60 aur 90 hain. Pythagoras use karke hum height nikalte hain. Phir hum directly triangle ki sides se ratios read kar lete hain.",
                    "keyInsight": "The standard values aren't magic numbers. They come from splitting a simple equilateral triangle in half.",
                    "widgetType": "EquilateralSplitDiagram",
                    "widgetData": {}
                },
                {
                    "title": "The Standard Values Table",
                    "readingTime": "~1 min read",
                    "narrative": "<p>Here is the table you must memorize.</p><p>Notice the beautiful pattern in the <strong>sin</strong> row: &radic;0/2, &radic;1/2, &radic;2/2, &radic;3/2, &radic;4/2.</p><p>The <strong>cos</strong> row is simply the sin row in reverse!</p>",
                    "audioText": "Here is the table you must memorize. Notice the beautiful pattern in the sine row: root 0 over 2, root 1 over 2, root 2 over 2, root 3 over 2, and root 4 over 2. The cosine row is simply the sine row in reverse!",
                    "audioTextHinglish": "Yeh rahi woh table jo aapko yaad karni hai. Sine row ke andar ka sundar pattern notice karein: root 0 over 2, root 1 over 2, root 2 over 2, root 3 over 2, aur root 4 over 2. Cosine row, sine row ka bilkul reverse hai!",
                    "keyInsight": "Don't memorize 30 numbers. Memorize one pattern. That's the sin row. Reverse it for cos.",
                    "widgetType": "StandardValuesTable",
                    "widgetData": {}
                },
                {
                    "title": "The Pythagorean Identity",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Start with the Pythagorean Theorem: <strong>P&sup2; + B&sup2; = H&sup2;</strong></p><p>Divide every term by H&sup2;, and you get (P/H)&sup2; + (B/H)&sup2; = 1.</p><p>Since P/H is sin and B/H is cos, we get the master identity:</p><h3>sin&sup2;&theta; + cos&sup2;&theta; = 1</h3><p>Divide this by cos&sup2;&theta; to get: tan&sup2;&theta; + 1 = sec&sup2;&theta;<br/>Divide by sin&sup2;&theta; to get: 1 + cot&sup2;&theta; = csc&sup2;&theta;</p>",
                    "audioText": "Start with the Pythagorean Theorem: P squared plus B squared equals H squared. Divide every term by H squared. Since P over H is sine and B over H is cosine, we get the master identity: sine squared plus cosine squared equals one. The other two identities are derived directly from this one.",
                    "audioTextHinglish": "Pythagorean Theorem se start karein: P squared plus B squared equals H squared. Har term ko H squared se divide karein. Kyunki P over H sine hai aur B over H cosine hai, humein milti hai master identity: sine squared plus cosine squared equals one. Baaki dono identities directly isi se derive hoti hain.",
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
                {
                    "title": "Previous Years' Board Questions",
                    "readingTime": "~10 min review",
                    "narrative": "<p>Before we jump into the final quiz, let's review how these concepts are tested in actual board exams (CBSE/ICSE). Review these 10 classic problems and their step-by-step solutions.</p>",
                    "audioText": "Before we jump into the final quiz, let's review how these concepts are tested in actual board exams. Review these 10 classic problems and their step-by-step solutions.",
                    "audioTextHinglish": "Final quiz shuru karne se pehle, chaliye dekhte hain ki board exams mein yeh concepts kaise puche jate hain. In 10 classic problems aur unke step-by-step solutions ko dhyan se review karein.",
                    "keyInsight": "Board exams love testing your ability to combine identities. Master these patterns.",
                    "widgetType": "BoardSolvedExamples",
                    "widgetData": {
                        "examples": [
                            {
                                "year": "CBSE 2019",
                                "q": "Prove that: (sin A + cosec A)² + (cos A + sec A)² = 7 + tan² A + cot² A",
                                "steps": ["Expand squares: (sin² A + cosec² A + 2sin A cosec A) + (cos² A + sec² A + 2cos A sec A)", "Since sin A * cosec A = 1 and cos A * sec A = 1, the middle terms become 2 + 2 = 4.", "Group sin² A + cos² A = 1.", "Substitute cosec² A = 1 + cot² A and sec² A = 1 + tan² A.", "Sum = 1 + 4 + (1 + cot² A) + (1 + tan² A) = 7 + tan² A + cot² A. Proved."]
                            },
                            {
                                "year": "ICSE 2017",
                                "q": "If tan θ + sin θ = m and tan θ - sin θ = n, show that m² - n² = 4√(mn)",
                                "steps": ["LHS = m² - n² = (m+n)(m-n) = (2 tan θ)(2 sin θ) = 4 tan θ sin θ.", "RHS = 4√(mn) = 4√((tan θ + sin θ)(tan θ - sin θ)) = 4√(tan² θ - sin² θ).", "Write tan² θ as sin² θ / cos² θ.", "4√(sin² θ/cos² θ - sin² θ) = 4√(sin² θ(1/cos² θ - 1)) = 4√(sin² θ * (sec² θ - 1)).", "Since sec² θ - 1 = tan² θ, RHS = 4√(sin² θ tan² θ) = 4 sin θ tan θ. LHS = RHS."]
                            },
                            {
                                "year": "CBSE 2015",
                                "q": "Prove that: (1 + cot A - cosec A)(1 + tan A + sec A) = 2",
                                "steps": ["Convert to sin/cos: (1 + cos A/sin A - 1/sin A)(1 + sin A/cos A + 1/cos A).", "Take LCM: [(sin A + cos A - 1)/sin A] * [(cos A + sin A + 1)/cos A].", "Numerator is of form (x-1)(x+1) where x = sin A + cos A.", "Numerator = (sin A + cos A)² - 1² = sin² A + cos² A + 2sin A cos A - 1.", "Since sin² A + cos² A = 1, Numerator = 1 + 2sin A cos A - 1 = 2sin A cos A.", "Divide by denominator (sin A cos A) = 2. Proved."]
                            },
                            {
                                "year": "CBSE 2020",
                                "q": "Evaluate: (sin² 63° + sin² 27°) / (cos² 17° + cos² 73°)",
                                "steps": ["Notice that 63° + 27° = 90° (complementary angles).", "Write sin 27° as sin(90° - 63°) = cos 63°.", "Numerator becomes sin² 63° + cos² 63° = 1.", "Similarly, 17° + 73° = 90°.", "Write cos 73° as cos(90° - 17°) = sin 17°.", "Denominator becomes cos² 17° + sin² 17° = 1.", "Value = 1 / 1 = 1."]
                            },
                            {
                                "year": "ICSE 2018",
                                "q": "Prove that: √(1 + sin A) / (1 - sin A) = sec A + tan A",
                                "steps": ["Rationalize the denominator inside the square root by multiplying numerator and denominator by (1 + sin A).", "Inside root: (1 + sin A)² / (1 - sin² A).", "Since 1 - sin² A = cos² A, the expression becomes (1 + sin A)² / cos² A.", "Take the square root: (1 + sin A) / cos A.", "Split the fraction: 1/cos A + sin A/cos A = sec A + tan A. Proved."]
                            },
                            {
                                "year": "CBSE 2016",
                                "q": "If sec θ + tan θ = p, prove that sin θ = (p² - 1)/(p² + 1)",
                                "steps": ["We know sec² θ - tan² θ = 1, so (sec θ - tan θ)(sec θ + tan θ) = 1.", "Therefore, sec θ - tan θ = 1/p.", "Add the two equations: 2 sec θ = p + 1/p = (p² + 1)/p.", "Subtract them: 2 tan θ = p - 1/p = (p² - 1)/p.", "Divide the second by the first: (2 tan θ) / (2 sec θ) = [(p² - 1)/p] / [(p² + 1)/p].", "(sin θ / cos θ) / (1 / cos θ) = sin θ. Thus sin θ = (p² - 1)/(p² + 1). Proved."]
                            },
                            {
                                "year": "ICSE 2019",
                                "q": "Prove that: (sin θ - 2sin³ θ) / (2cos³ θ - cos θ) = tan θ",
                                "steps": ["Factor out sin θ from numerator: sin θ(1 - 2sin² θ).", "Factor out cos θ from denominator: cos θ(2cos² θ - 1).", "Substitute sin² θ = 1 - cos² θ in the numerator.", "Numerator becomes sin θ(1 - 2(1 - cos² θ)) = sin θ(1 - 2 + 2cos² θ) = sin θ(2cos² θ - 1).", "The term (2cos² θ - 1) cancels out from numerator and denominator.", "Remaining term is sin θ / cos θ = tan θ. Proved."]
                            },
                            {
                                "year": "CBSE 2018 (H&D)",
                                "q": "A tree breaks due to storm and the broken part bends so that the top of the tree touches the ground making an angle 30° with it. The distance from the foot to the point where the top touches the ground is 8 m. Find the height of the tree.",
                                "steps": ["Let the unbroken part be height 'x' and the broken part be hypotenuse 'y'. Total height = x + y.", "In the right triangle formed, base = 8 m, angle = 30°.", "tan 30° = Perpendicular / Base = x / 8.", "1/√3 = x / 8 => x = 8/√3.", "cos 30° = Base / Hypotenuse = 8 / y.", "√3/2 = 8 / y => y = 16/√3.", "Total height = x + y = 8/√3 + 16/√3 = 24/√3 = 8√3 m."]
                            },
                            {
                                "year": "CBSE 2014 (H&D)",
                                "q": "From a point on the ground, the angles of elevation of the bottom and the top of a transmission tower fixed at the top of a 20 m high building are 45° and 60° respectively. Find the height of the tower.",
                                "steps": ["Let the height of the tower be 'h'. Total height from ground = 20 + h.", "Let the distance from the point to the building be 'x'.", "For the 45° angle to the bottom of the tower (top of building): tan 45° = 20 / x.", "1 = 20 / x => x = 20 m.", "For the 60° angle to the top of the tower: tan 60° = (20 + h) / x.", "√3 = (20 + h) / 20 => 20√3 = 20 + h.", "h = 20√3 - 20 = 20(√3 - 1) m."]
                            },
                            {
                                "year": "ICSE 2015 (H&D)",
                                "q": "The shadow of a tower standing on a level ground is found to be 40 m longer when the Sun's altitude is 30° than when it is 60°. Find the height of the tower.",
                                "steps": ["Let the height of the tower be 'h' and the original shadow length at 60° be 'x'.", "In the smaller triangle: tan 60° = h / x => √3 = h / x => x = h / √3.", "In the larger triangle (altitude 30°), the shadow is x + 40.", "tan 30° = h / (x + 40) => 1/√3 = h / (x + 40).", "x + 40 = h√3. Substitute x = h/√3.", "h/√3 + 40 = h√3 => 40 = h√3 - h/√3 = h(3 - 1)/√3 = 2h/√3.", "20 = h/√3 => h = 20√3 m."]
                            }
                        ]
                    }
                },
                {
                    "title": "Practice Problems",
                    "readingTime": "~10 min practice",
                    "narrative": "<p>Let's test what you've learned. Try these 10 interactive multiple-choice questions.</p>",
                    "audioText": "Let's test what you've learned. Try these ten interactive multiple-choice questions.",
                    "audioTextHinglish": "Chaliye test karte hain ki aapne kya seekha. In dus interactive multiple-choice questions ko try karein.",
                    "keyInsight": "Practice makes perfect.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "The value of (sin 30° + cos 30°) - (sin 60° + cos 60°) is:",
                                "options": ["0", "1", "-1", "2"],
                                "correct": 0
                            },
                            {
                                "q": "The value of tan 30° / cot 60° is:",
                                "options": ["1/√3", "√3", "1", "1/3"],
                                "correct": 2
                            },
                            {
                                "q": "If sin A = 1/2, then the value of cot A is:",
                                "options": ["√3", "1/√3", "√3/2", "1"],
                                "correct": 0
                            },
                            {
                                "q": "9 sec² A - 9 tan² A is equal to:",
                                "options": ["1", "9", "8", "0"],
                                "correct": 1
                            },
                            {
                                "q": "(sec A + tan A)(1 - sin A) is equal to:",
                                "options": ["sec A", "sin A", "cosec A", "cos A"],
                                "correct": 3
                            },
                            {
                                "q": "If tan A = 4/3, then sin A is:",
                                "options": ["3/5", "4/5", "3/4", "5/4"],
                                "correct": 1
                            },
                            {
                                "q": "The maximum value of sin θ is:",
                                "options": ["1/2", "√3/2", "1", "Infinity"],
                                "correct": 2
                            },
                            {
                                "q": "sin(90° - A) is equal to:",
                                "options": ["sin A", "tan A", "cos A", "cosec A"],
                                "correct": 2
                            },
                            {
                                "q": "If a pole 6 m high casts a shadow 2√3 m long on the ground, then the Sun's elevation is:",
                                "options": ["60°", "45°", "30°", "90°"],
                                "correct": 0
                            },
                            {
                                "q": "If cos A = 4/5, then tan A is:",
                                "options": ["3/5", "3/4", "4/3", "5/3"],
                                "correct": 1
                            }
                        ]
                    }
                },
                {
                    "title": "Master Cheat Sheet",
                    "readingTime": "~1 min review",
                    "narrative": "<p>Review this reference card before your exams.</p>",
                    "audioText": "You have completed the interactive lesson. Review this reference card before your exams.",
                    "audioTextHinglish": "Aapne yeh interactive lesson complete kar liya hai. Exams se pehle is reference card ko review zaroor karein.",
                    "keyInsight": "You are now ready to master Trigonometry.",
                    "widgetType": "CheatSheet",
                    "widgetData": {}
                }
            ]
        }

        topic.lesson_config_json = config
        db.commit()
        print("Successfully seeded massive 22-step interactive Trigonometry lesson with English and Hinglish audio.")
    finally:
        db.close()

def seed_curriculum():
    db = SessionLocal()
    
    curriculum = [
        {
            "class_level": 11,
            "class_name": "Masterclass",
            "subjects": [
                {
                    "name": "Artificial Intelligence",
                    "topics": [
                        {"name": "The Dream of the Thinking Machine", "board": "BOTH"},
                        {"name": "The AI Winters", "board": "BOTH"},
                        {"name": "The Big Bang", "board": "BOTH"},
                        {"name": "Linear Algebra & Vectors", "board": "BOTH"},
                        {"name": "Calculus & Gradient Descent", "board": "BOTH"},
                        {"name": "Probability & Statistics", "board": "BOTH"},
                        {"name": "The Neural Network", "board": "BOTH"},
                        {"name": "The Transformer Engine", "board": "BOTH"},
                        {"name": "The Three Stages of Training", "board": "BOTH"},
                        {"name": "Prompts & In-Context Learning", "board": "BOTH"},
                        {"name": "Retrieval-Augmented Generation (RAG)", "board": "BOTH"}
                    ]
                }
            ]
        },
        {
            "class_level": 7,
            "class_name": "Class 7",
            "subjects": [
                {
                    "name": "Mathematics",
                    "topics": [
                        {"name": "Integers", "board": "BOTH"},
                        {"name": "Fractions and Decimals", "board": "BOTH"},
                        {"name": "Data Handling", "board": "BOTH"},
                        {"name": "Simple Equations", "board": "BOTH"},
                        {"name": "Lines and Angles", "board": "BOTH"},
                        {"name": "The Triangle and its Properties", "board": "BOTH"},
                        {"name": "Comparing Quantities", "board": "BOTH"},
                        {"name": "Rational Numbers", "board": "BOTH"},
                        {"name": "Perimeter and Area", "board": "BOTH"},
                        {"name": "Algebraic Expressions", "board": "BOTH"},
                        {"name": "Exponents and Powers", "board": "BOTH"},
                        {"name": "Symmetry", "board": "BOTH"},
                        {"name": "Visualising Solid Shapes", "board": "BOTH"}
                    ]
                },
                {
                    "name": "Science",
                    "topics": [
                        {"name": "Nutrition in Plants", "board": "BOTH"},
                        {"name": "Nutrition in Animals", "board": "BOTH"},
                        {"name": "Heat", "board": "BOTH"},
                        {"name": "Acids, Bases and Salts", "board": "BOTH"},
                        {"name": "Physical and Chemical Changes", "board": "BOTH"},
                        {"name": "Respiration in Organisms", "board": "BOTH"},
                        {"name": "Transportation in Animals and Plants", "board": "BOTH"},
                        {"name": "Reproduction in Plants", "board": "BOTH"},
                        {"name": "Motion and Time", "board": "BOTH"},
                        {"name": "Electric Current and its Effects", "board": "BOTH"},
                        {"name": "Light", "board": "BOTH"},
                        {"name": "Forests: Our Lifeline", "board": "BOTH"},
                        {"name": "Wastewater Story", "board": "BOTH"}
                    ]
                }
            ]
        },
        {
            "class_level": 6,
            "class_name": "Class 6",
            "subjects": [
                {
                    "name": "Mathematics",
                    "topics": [
                        {"name": "Knowing Our Numbers", "board": "BOTH"},
                        {"name": "Whole Numbers", "board": "BOTH"},
                        {"name": "Playing With Numbers", "board": "BOTH"},
                        {"name": "Basic Geometrical Ideas", "board": "BOTH"},
                        {"name": "Understanding Elementary Shapes", "board": "BOTH"},
                        {"name": "Integers", "board": "BOTH"},
                        {"name": "Fractions", "board": "BOTH"},
                        {"name": "Decimals", "board": "BOTH"},
                        {"name": "Data Handling", "board": "BOTH"},
                        {"name": "Mensuration", "board": "BOTH"},
                        {"name": "Algebra", "board": "BOTH"},
                        {"name": "Ratio and Proportion", "board": "BOTH"},
                        {"name": "Symmetry", "board": "BOTH"},
                        {"name": "Practical Geometry", "board": "BOTH"}
                    ]
                },
                {
                    "name": "Science",
                    "topics": [
                        {"name": "Components of Food", "board": "BOTH"},
                        {"name": "Sorting Materials into Groups", "board": "BOTH"},
                        {"name": "Separation of Substances", "board": "BOTH"},
                        {"name": "Getting to Know Plants", "board": "BOTH"},
                        {"name": "Body Movements", "board": "BOTH"},
                        {"name": "The Living Organisms and Their Surroundings", "board": "BOTH"},
                        {"name": "Motion and Measurement of Distances", "board": "BOTH"},
                        {"name": "Light, Shadows and Reflections", "board": "BOTH"},
                        {"name": "Electricity and Circuits", "board": "BOTH"},
                        {"name": "Fun with Magnets", "board": "BOTH"},
                        {"name": "Air Around Us", "board": "BOTH"}
                    ]
                }
            ]
        },
        {
            "class_level": 8,
            "class_name": "Class 8",
            "subjects": [
                {
                    "name": "Mathematics",
                    "topics": [
                        {"name": "A Story of Numbers", "board": "BOTH"},
                        {"name": "Number Play", "board": "BOTH"},
                        {"name": "A Square and A Cube", "board": "BOTH"},
                        {"name": "Power Play", "board": "BOTH"},
                        {"name": "Linear Equations in One Variable", "board": "BOTH"},
                        {"name": "Understanding Quadrilaterals", "board": "BOTH"},
                        {"name": "Practical Geometry", "board": "BOTH"},
                        {"name": "Data Handling", "board": "BOTH"},
                        {"name": "Comparing Quantities", "board": "BOTH"},
                        {"name": "Algebraic Expressions and Identities", "board": "BOTH"},
                        {"name": "Visualising Solid Shapes", "board": "BOTH"},
                        {"name": "Mensuration", "board": "BOTH"},
                        {"name": "Direct and Inverse Proportions", "board": "BOTH"},
                        {"name": "Factorisation", "board": "BOTH"},
                        {"name": "Introduction to Graphs", "board": "BOTH"},
                        {"name": "Sets", "board": "ICSE"}
                    ]
                },
                {
                    "name": "Science",
                    "topics": [
                        {"name": "Crop Production and Management", "board": "BOTH"},
                        {"name": "Microorganisms: Friend and Foe", "board": "BOTH"},
                        {"name": "Synthetic Fibres and Plastics", "board": "BOTH"},
                        {"name": "Materials: Metals and Non-Metals", "board": "BOTH"},
                        {"name": "Coal and Petroleum", "board": "BOTH"},
                        {"name": "Combustion and Flame", "board": "BOTH"},
                        {"name": "Conservation of Plants and Animals", "board": "BOTH"},
                        {"name": "Cell - Structure and Functions", "board": "BOTH"},
                        {"name": "Reproduction in Animals", "board": "BOTH"},
                        {"name": "Reaching the Age of Adolescence", "board": "BOTH"},
                        {"name": "Force and Pressure", "board": "BOTH"},
                        {"name": "Friction", "board": "BOTH"},
                        {"name": "Sound", "board": "BOTH"},
                        {"name": "Chemical Effects of Electric Current", "board": "BOTH"},
                        {"name": "Some Natural Phenomena", "board": "BOTH"},
                        {"name": "Light", "board": "BOTH"},
                        {"name": "Stars and the Solar System", "board": "BOTH"},
                        {"name": "Pollution of Air and Water", "board": "BOTH"}
                    ]
                }
            ]
        },
        {
            "class_level": 9,
            "class_name": "Class 9",
            "subjects": [
                {
                    "name": "Mathematics",
                    "topics": [
                        {"name": "Number Systems", "board": "BOTH"},
                        {"name": "Polynomials", "board": "BOTH"},
                        {"name": "Coordinate Geometry", "board": "BOTH"},
                        {"name": "Linear Equations in Two Variables", "board": "BOTH"},
                        {"name": "Introduction to Euclid's Geometry", "board": "CBSE"},
                        {"name": "Lines and Angles", "board": "BOTH"},
                        {"name": "Triangles", "board": "BOTH"},
                        {"name": "Quadrilaterals", "board": "BOTH"},
                        {"name": "Areas of Parallelograms and Triangles", "board": "CBSE"},
                        {"name": "Circles", "board": "BOTH"},
                        {"name": "Constructions", "board": "BOTH"},
                        {"name": "Heron's Formula", "board": "BOTH"},
                        {"name": "Surface Areas and Volumes", "board": "BOTH"},
                        {"name": "Statistics", "board": "BOTH"},
                        {"name": "Probability", "board": "BOTH"},
                        {"name": "Logarithms", "board": "ICSE"},
                        {"name": "Indices", "board": "ICSE"}
                    ]
                },
                {
                    "name": "Science",
                    "topics": [
                        {"name": "Matter in Our Surroundings", "board": "BOTH"},
                        {"name": "Is Matter Around Us Pure", "board": "BOTH"},
                        {"name": "Atoms and Molecules", "board": "BOTH"},
                        {"name": "Structure of the Atom", "board": "BOTH"},
                        {"name": "The Fundamental Unit of Life", "board": "BOTH"},
                        {"name": "Tissues", "board": "BOTH"},
                        {"name": "Diversity in Living Organisms", "board": "BOTH"},
                        {"name": "Motion", "board": "BOTH"},
                        {"name": "Force and Laws of Motion", "board": "BOTH"},
                        {"name": "Gravitation", "board": "BOTH"},
                        {"name": "Work and Energy", "board": "BOTH"},
                        {"name": "Sound", "board": "BOTH"},
                        {"name": "Why Do We Fall Ill", "board": "BOTH"},
                        {"name": "Natural Resources", "board": "BOTH"},
                        {"name": "Improvement in Food Resources", "board": "BOTH"}
                    ]
                }
            ]
        },
        {
            "class_level": 10,
            "class_name": "Class 10",
            "subjects": [
                {
                    "name": "Mathematics",
                    "topics": [
                        {"name": "Real Numbers", "board": "BOTH"},
                        {"name": "Polynomials", "board": "BOTH"},
                        {"name": "Pair of Linear Equations in Two Variables", "board": "BOTH"},
                        {"name": "Quadratic Equations", "board": "BOTH"},
                        {"name": "Arithmetic Progressions", "board": "BOTH"},
                        {"name": "Triangles", "board": "BOTH"},
                        {"name": "Coordinate Geometry", "board": "BOTH"},
                        {"name": "Introduction to Trigonometry", "board": "BOTH"},
                        {"name": "Some Applications of Trigonometry", "board": "BOTH"},
                        {"name": "Circles", "board": "BOTH"},
                        {"name": "Constructions", "board": "BOTH"},
                        {"name": "Areas Related to Circles", "board": "BOTH"},
                        {"name": "Surface Areas and Volumes", "board": "BOTH"},
                        {"name": "Statistics", "board": "BOTH"},
                        {"name": "Probability", "board": "BOTH"},
                        {"name": "Matrices", "board": "ICSE"},
                        {"name": "GST", "board": "ICSE"},
                        {"name": "Shares and Dividends", "board": "ICSE"}
                    ]
                },
                {
                    "name": "Science",
                    "topics": [
                        {"name": "Chemical Reactions and Equations", "board": "BOTH"},
                        {"name": "Acids, Bases and Salts", "board": "BOTH"},
                        {"name": "Metals and Non-metals", "board": "BOTH"},
                        {"name": "Carbon and its Compounds", "board": "BOTH"},
                        {"name": "Periodic Classification of Elements", "board": "BOTH"},
                        {"name": "Life Processes", "board": "BOTH"},
                        {"name": "Control and Coordination", "board": "BOTH"},
                        {"name": "How do Organisms Reproduce?", "board": "BOTH"},
                        {"name": "Heredity and Evolution", "board": "BOTH"},
                        {"name": "Light - Reflection and Refraction", "board": "BOTH"},
                        {"name": "Human Eye and Colourful World", "board": "BOTH"},
                        {"name": "Electricity", "board": "BOTH"},
                        {"name": "Magnetic Effects of Electric Current", "board": "BOTH"},
                        {"name": "Sources of Energy", "board": "BOTH"},
                        {"name": "Our Environment", "board": "BOTH"},
                        {"name": "Management of Natural Resources", "board": "BOTH"},
                        {"name": "Electromagnetism", "board": "ICSE"},
                        {"name": "Radioactivity", "board": "ICSE"}
                    ]
                }
            ]
        }
    ]

    try:
        for c in curriculum:
            c_obj = db.query(LearningClass).filter_by(level=c["class_level"], name=c["class_name"]).first()
            if not c_obj:
                c_obj = LearningClass(level=c["class_level"], name=c["class_name"])
                db.add(c_obj)
                db.flush()
                
            for s in c["subjects"]:
                s_obj = db.query(LearningSubject).filter_by(name=s["name"], class_id=c_obj.id).first()
                if not s_obj:
                    s_obj = LearningSubject(name=s["name"], class_id=c_obj.id)
                    db.add(s_obj)
                    db.flush()
                
                order = 1
                for t in s["topics"]:
                    t_obj = db.query(LearningTopic).filter_by(name=t["name"], subject_id=s_obj.id).first()
                    if not t_obj:
                        t_obj = LearningTopic(name=t["name"], subject_id=s_obj.id, order_idx=order, board_type=t["board"])
                        db.add(t_obj)
                    else:
                        t_obj.order_idx = order
                        t_obj.board_type = t["board"]
                    
                    db.flush()
                    order += 1

        db.commit()
        print("Successfully seeded extensive curriculum for Classes 8, 9, 10.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database curriculum: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_curriculum()
    seed_trigonometry()
    seed_real_numbers()
    seed_number_system_class9()
    seed_number_system_class8_part1()
    seed_ai_masterclass_part1()
    seed_ai_masterclass_part2()
    seed_ai_masterclass_part3()
    seed_ai_masterclass_part4()
    seed_ai_masterclass_part5()
    seed_ai_masterclass_part6()
    seed_ai_masterclass_part7()
    seed_ai_masterclass_part8()
    seed_ai_masterclass_part9()
    seed_ai_masterclass_part10()
    seed_ai_masterclass_part11()
