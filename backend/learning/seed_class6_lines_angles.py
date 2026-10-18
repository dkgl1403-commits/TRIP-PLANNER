import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic

# Class 6 · Lines and Angles (Ganita Prakash ch.2 + old NCERT "Basic Geometrical Ideas" / angle parts of
# "Understanding Elementary Shapes"). Story: Meera (11) and her Dadaji, a retired carpenter in Jaipur.
# Every part is a list of narrated scenes; each scene's `visual` drives the widget animation.


def scene(say, say_hi, visual=None, wait=False):
    s = {"say": say, "sayHi": say_hi, "visual": visual or {}}
    if wait:
        s["wait"] = True
    return s


def teacher(explain, mistakes, activity, syllabus):
    li = lambda items: "".join(f"<li>{i}</li>" for i in items)
    return f"""
<h4>How to explain it</h4><ul>{li(explain)}</ul>
<h4>Common mistakes to watch for</h4><ul>{li(mistakes)}</ul>
<h4>Classroom activity (10 min)</h4><p>{activity}</p>
<h4>Syllabus link</h4><p>{syllabus}</p>
"""


CARD = 'class="my-3 p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 space-y-1"'
STORY = 'class="my-3 p-4 bg-amber-950/30 border-l-4 border-amber-500 rounded-r-xl text-amber-100 italic"'
FORMULA = 'class="my-4 p-4 bg-slate-900 border border-emerald-500/40 rounded-xl font-mono text-center text-emerald-300 text-base font-bold"'


def svg_points_on_line():
    dots = "".join(
        f'<circle cx="{x}" cy="50" r="6" fill="#fbbf24"/><text x="{x - 5}" y="80" fill="#fbbf24" font-size="16" font-weight="700">{c}</text>'
        for x, c in [(70, "A"), (150, "B"), (230, "C"), (310, "D")]
    )
    return f'<svg viewBox="0 0 380 100" width="320"><line x1="20" y1="50" x2="360" y2="50" stroke="#e2e8f0" stroke-width="3"/>{dots}</svg>'


def svg_linear_pair(label_a, label_b):
    return (
        '<svg viewBox="0 0 360 170" width="300">'
        '<line x1="20" y1="140" x2="340" y2="140" stroke="#e2e8f0" stroke-width="3"/>'
        '<line x1="180" y1="140" x2="270" y2="30" stroke="#38bdf8" stroke-width="3"/>'
        '<path d="M 225 140 A 45 45 0 0 0 208 105" fill="none" stroke="#34d399" stroke-width="3"/>'
        '<path d="M 208 105 A 45 45 0 0 0 135 140" fill="none" stroke="#fbbf24" stroke-width="3"/>'
        f'<text x="232" y="124" fill="#34d399" font-size="16" font-weight="800">{label_a}</text>'
        f'<text x="120" y="112" fill="#fbbf24" font-size="16" font-weight="800">{label_b}</text>'
        '<circle cx="180" cy="140" r="4" fill="#fbbf24"/></svg>'
    )


def svg_crossing(label):
    return (
        '<svg viewBox="0 0 360 200" width="300">'
        '<line x1="20" y1="100" x2="340" y2="100" stroke="#e2e8f0" stroke-width="3"/>'
        '<line x1="70" y1="190" x2="290" y2="10" stroke="#38bdf8" stroke-width="3"/>'
        '<path d="M 225 100 A 45 45 0 0 0 214 72" fill="none" stroke="#34d399" stroke-width="3"/>'
        f'<text x="232" y="88" fill="#34d399" font-size="16" font-weight="800">{label}</text>'
        '<text x="160" y="75" fill="#fbbf24" font-size="16" font-weight="800">b</text>'
        '<text x="120" y="125" fill="#fbbf24" font-size="16" font-weight="800">c</text>'
        '<text x="200" y="135" fill="#fbbf24" font-size="16" font-weight="800">d</text>'
        '<circle cx="180" cy="100" r="4" fill="#fbbf24"/></svg>'
    )


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: The Kite Festival · Point, Segment, Ray and Line",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>It is Makar Sankranti in Jaipur. The sky is full of kites. Eleven-year-old Meera is on the rooftop with her Dadaji, a retired carpenter. He makes one tiny pencil dot on a plank and smiles: "Every straight cut I ever made began with a dot like this."</div>

<h2>The four building blocks of geometry</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Point</strong>: an exact position. No length, width or thickness. Named with a capital letter: <strong>P</strong>.</div>
  <div><strong class="text-amber-300">Line segment AB̅</strong>: the straight path between two points. It has <strong>2 end points</strong> and a fixed length you can measure.</div>
  <div><strong class="text-amber-300">Ray AB→</strong>: starts at A and goes on forever through B. <strong>1 end point</strong>. Cannot be measured.</div>
  <div><strong class="text-amber-300">Line AB↔</strong>: goes on forever in both directions. <strong>No end points</strong>. Cannot be measured.</div>
</div>

<table class="w-full text-xs md:text-sm my-4">
  <thead><tr class="text-amber-300"><th class="text-left">Name</th><th>End points</th><th>Measurable?</th><th class="text-left">In real life</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Line segment</td><td class="text-center">2</td><td class="text-center">Yes</td><td>Kite string, edge of a ruler</td></tr>
    <tr><td>Ray</td><td class="text-center">1</td><td class="text-center">No</td><td>Torch beam, sun's rays</td></tr>
    <tr><td>Line</td><td class="text-center">0</td><td class="text-center">No</td><td>An endless railway track (imagined)</td></tr>
  </tbody>
</table>

<h2>Two facts a carpenter relies on</h2>
<ul>
  <li>Through <strong>one point</strong>, <strong>infinitely many</strong> lines can be drawn.</li>
  <li>Through <strong>two points</strong>, <strong>exactly one</strong> line can be drawn.</li>
</ul>
""",
        "keyInsight": "Count the end points: segment = 2, ray = 1, line = 0. Only a segment can be measured.",
        "widgetType": "Class6PointLineRayWidget",
        "widgetData": {},
        "scenes": [
            scene(
                "It is Makar Sankranti in Jaipur, and the sky is full of kites. Meera is on the rooftop with her Dadaji, an old carpenter. Dadaji takes a sharp pencil and makes one tiny dot on a wooden plank. Every straight cut I ever made, he says, began with a dot like this.",
                "Makar Sankranti ka din hai, aur Jaipur ka aasmaan patangon se bhara hua hai. Meera apne Dadaji ke saath chhat par hai. Dadaji purane carpenter hain. Woh ek nukeeli pencil se lakdi par ek chhota sa dot banaate hain. Kehte hain, maine jitne bhi seedhe cut lagaaye, sab aise hi ek dot se shuru hue.",
                {"stage": "point"},
            ),
            scene(
                "In maths, this dot is called a point. A point shows an exact position, nothing more. It has no length, no width and no thickness. We name a point with a capital letter, like P. The tip of a compass, or a far away star at night, gives us the idea of a point.",
                "Maths mein is dot ko point kehte hain. Point sirf ek exact jagah batata hai. Iski na lambai hoti hai, na chaudai, na motaai. Point ka naam hum capital letter se rakhte hain, jaise P. Compass ki nok, ya raat mein door chamakta taara, point jaisa hi dikhta hai.",
                {"stage": "point"},
            ),
            scene(
                "Now look at Meera's kite. Her charkhi, the string spool, is at point A. The kite is at point B. The tight string between them is a straight path with two end points. This is called a line segment. We write it as A B with a small bar on top.",
                "Ab Meera ki patang dekho. Uski charkhi point A par hai, aur patang point B par. Dono ke beech tani hui dor ek seedha raasta hai jiske do end points hain. Ise line segment kehte hain. Hum ise A B likh kar upar ek chhoti si line lagaate hain.",
                {"stage": "segment", "kite": True},
            ),
            scene(
                "Because a line segment starts at A and stops at B, we can measure it with a ruler. See the ruler marks. A line segment is the shortest path between two points. Every edge of your notebook is a line segment.",
                "Line segment A se shuru hokar B par ruk jaata hai, isliye hum ise ruler se naap sakte hain. Ruler ke nishaan dekho. Do points ke beech sabse chhota raasta line segment hi hota hai. Aapki notebook ka har kinara ek line segment hai.",
                {"stage": "segment"},
            ),
            scene(
                "When the sun sets, Dadaji switches on his torch. The light starts at the torch, at point A, and goes on and on, past B, with no end. A path that starts at one point and goes on forever in one direction is called a ray. We write it as A B with an arrow on top.",
                "Shaam hote hi Dadaji torch jalaate hain. Roshni torch se, yaani point A se shuru hoti hai, aur B ke aage bas chalti hi jaati hai, kabhi khatam nahi hoti. Jo raasta ek point se shuru hokar ek hi disha mein hamesha chalta rahe, use ray kehte hain. Hum ise A B likh kar upar ek arrow lagaate hain.",
                {"stage": "ray", "torch": True},
            ),
            scene(
                "Now imagine a railway track that never ends, in either direction. Stretch the segment A B both ways, forever. That is a line. A line has no end points at all, so it can never be measured. We draw arrows at both ends to show that it keeps going.",
                "Ab socho ek aisi railway line jo dono taraf kabhi khatam hi na ho. Segment A B ko dono taraf hamesha ke liye badha do. Yahi line hai. Line ka koi end point nahi hota, isliye ise kabhi naapa nahi ja sakta. Dono sirron par arrow lagaate hain, yeh dikhaane ke liye ki yeh aage chalti rehti hai.",
                {"stage": "line", "rail": True},
            ),
            scene(
                "Meera has a question. Dadaji, how many lines can pass through just one point? Watch the screen. Lines keep spinning through point P, in every direction. We can draw as many as we like. Through one point, infinitely many lines can pass.",
                "Meera ka sawaal hai. Dadaji, ek point se kitni lines guzar sakti hain? Screen dekho. Point P se har disha mein lines ghoom rahi hain. Hum jitni chahein utni bana sakte hain. Ek point se anginat, yaani infinite lines guzar sakti hain.",
                {"stage": "onePoint"},
            ),
            scene(
                "But now fix two points, A and B. The grey line swings around point A, searching. Only when it passes through B does it turn green. Through two points, exactly one line can pass. That is why a carpenter marks two dots before cutting a straight line.",
                "Lekin ab do points fix karo, A aur B. Grey line point A ke chaaron taraf ghoom kar dhoondh rahi hai. Jaise hi woh B se guzarti hai, hari ho jaati hai. Do points se sirf ek hi line guzar sakti hai. Isiliye carpenter seedha cut lagaane se pehle do dot lagaata hai.",
                {"stage": "twoPoints"},
            ),
            scene(
                "Your turn. Drag point A or point B and fly the kite around. Watch the length change. Notice that the segment always keeps exactly two end points.",
                "Ab aapki baari. Point A ya point B ko drag karo aur patang ko idhar udhar udaao. Dekho lambai kaise badalti hai. Dhyaan do, segment ke hamesha do hi end points rehte hain.",
                {"stage": "segment", "kite": True},
                wait=True,
            ),
        ],
        "miniChallenge": {
            "question": "The beam of a lighthouse is best described as a…",
            "options": ["Line segment", "Ray", "Line", "Point"],
            "correctIndex": 1,
            "explanation": "It starts at the lighthouse (one end point) and goes on in one direction: a ray.",
        },
        "teacherNotes": teacher(
            [
                "Start with a physical dot on the board and ask: how big is a point? Let students argue, then settle on 'position, not size'.",
                "Use the end-point count (2, 1, 0) as the one idea that separates segment, ray and line.",
                "Draw arrows deliberately: the arrowhead is a promise that the figure continues.",
            ],
            [
                "Writing ray AB and ray BA as the same thing. The first letter is always the starting point.",
                "Thinking a longer drawing of a line is 'bigger' than a shorter one. Both are infinite.",
                "Measuring a ray or a line with a ruler.",
            ],
            "Give pairs a thread. One holds both ends tight (segment), one holds one end and 'throws' the other far away (ray). Then ask the class how to show a line with the same thread. Finish with: mark 2 dots on paper and try to draw two different straight lines through both.",
            "Ganita Prakash Ch. 2 (2.1–2.3); old NCERT Ch. 4 Basic Geometrical Ideas (4.2–4.4).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Railway Tracks and Window Grills · Pairs of Lines",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Next morning Meera and Dadaji take the train to Ajmer. Through the window she sees roads crossing, the grill of the window, and the two shining rails running beside the train for hours without ever meeting.</div>

<h2>Three ways two lines can behave</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Intersecting lines</strong> cross at exactly <strong>one</strong> point, called the <em>point of intersection</em>.</div>
  <div><strong class="text-sky-300">Perpendicular lines ( ⟂ )</strong> are intersecting lines that meet at a <strong>right angle (90°)</strong>. Example: the plus sign, a window grill, a notebook margin.</div>
  <div><strong class="text-emerald-300">Parallel lines ( ∥ )</strong> lie on the same flat surface and <strong>never meet</strong>. The gap between them is the same everywhere.</div>
</div>

<h2>Real data: Indian Railways</h2>
<p>A broad gauge track keeps its two rails exactly <strong>1676 mm</strong> apart along its whole length. If the gap changed, the rails would be <em>not parallel</em> and a train could derail.</p>

<div {FORMULA}>Parallel ⟺ same gap everywhere ⟺ never meet</div>
""",
        "keyInsight": "Two different straight lines either meet once (intersecting) or never (parallel). Meeting at 90° makes them perpendicular.",
        "widgetType": "Class6LinePairsWidget",
        "widgetData": {},
        "scenes": [
            scene(
                "Next morning, Meera and Dadaji take the train to Ajmer. Through the window, Meera sees roads crossing each other. When two lines cross, they are called intersecting lines. They meet at exactly one point, called the point of intersection. Here it is point O.",
                "Agli subah Meera aur Dadaji train se Ajmer jaate hain. Khidki se Meera dekhti hai ki sadkein ek doosre ko kaat rahi hain. Jab do lines ek doosre ko kaatti hain, unhe intersecting lines kehte hain. Woh sirf ek point par milti hain, jise point of intersection kehte hain. Yahan woh point O hai.",
                {"mode": "intersecting", "angle": 50},
            ),
            scene(
                "Watch the second line turn. The angle between the lines changes, but they still meet at only one point. Two different straight lines can never cross twice.",
                "Doosri line ko ghoomte dekho. Lines ke beech ka angle badal raha hai, lekin woh ab bhi sirf ek hi point par milti hain. Do alag seedhi lines do baar kabhi nahi kaat saktin.",
                {"mode": "intersecting", "angle": 130},
            ),
            scene(
                "Now the line stops at a special position. The two lines meet at a right angle, like the corner of a book. Such lines are called perpendicular lines. See the small square at O. That square is the sign of a right angle. The plus sign, a window grill and the margin of your notebook all show perpendicular lines.",
                "Ab line ek khaas jagah ruk gayi hai. Dono lines right angle par mil rahi hain, bilkul kitaab ke kone jaisi. Aisi lines ko perpendicular lines kehte hain. O par chhota sa square dekho. Yeh square right angle ka nishaan hai. Plus ka sign, khidki ki grill, aur notebook ki margin, sab perpendicular lines dikhaate hain.",
                {"mode": "intersecting", "angle": 90},
            ),
            scene(
                "Now Meera looks down at the railway track. The two rails run side by side for hundreds of kilometres and never meet. Lines on the same flat surface that never meet are called parallel lines. Indian Railways keeps the two rails of a broad gauge track exactly 1676 millimetres apart, everywhere.",
                "Ab Meera neeche railway track dekhti hai. Dono patriyaan saikdon kilometre tak saath saath chalti hain aur kabhi nahi miltin. Ek hi samtal par jo lines kabhi nahi miltin, unhe parallel lines kehte hain. Indian Railways broad gauge track ki dono patriyon ke beech ki doori har jagah bilkul 1676 millimetre rakhti hai.",
                {"mode": "parallel", "tilt": 0, "gap": 100, "rail": True},
            ),
            scene(
                "See the three green measurements. The gap is the same at every place. That is the secret of parallel lines. The same gap everywhere means they will never meet.",
                "Teen hare naap dekho. Har jagah gap bilkul barabar hai. Yahi parallel lines ka raaz hai. Har jagah barabar gap, matlab woh kabhi nahi milengi.",
                {"mode": "parallel", "tilt": 0, "gap": 100},
            ),
            scene(
                "What if one rail tilts by just three degrees? Watch. The gaps become unequal, and far away the two lines will crash into each other. A train would derail. That is why railway engineers check the gap so carefully.",
                "Agar ek patri sirf teen degree tirchhi ho jaaye toh? Dekho. Gap barabar nahi rehta, aur aage chal kar dono lines takra jaayengi. Train patri se utar jaayegi. Isiliye railway engineers gap ko itni dhyaan se check karte hain.",
                {"mode": "parallel", "tilt": 3, "gap": 100},
            ),
            scene(
                "Your turn. Use the slider to turn the line until the two lines are perpendicular. Look for the little square to appear.",
                "Ab aapki baari. Slider se line ko tab tak ghumaao jab tak dono lines perpendicular na ho jaayein. Chhota square dikhne ka intezaar karo.",
                {"mode": "intersecting", "angle": 40, "task": "perpendicular"},
                wait=True,
            ),
        ],
        "miniChallenge": {
            "question": "The opposite edges of your ruler are an example of…",
            "options": ["Intersecting lines", "Perpendicular lines", "Parallel lines"],
            "correctIndex": 2,
            "explanation": "They run side by side with the same gap everywhere and never meet: parallel lines.",
        },
        "teacherNotes": teacher(
            [
                "Ask the class: can two straight lines meet twice? Let them try to draw it. Discovering it is impossible is more powerful than being told.",
                "Define parallel by the gap, not by 'never meet': students can check a gap with a ruler, but cannot walk to infinity.",
                "Perpendicular is a special case of intersecting, not a separate family.",
            ],
            [
                "Calling any two lines that look far apart 'parallel'. Only equal gaps everywhere count.",
                "Thinking two short segments that don't touch are parallel. Extend them first.",
                "Saying lines on different walls of a room (skew lines) are parallel. Parallel lines must lie on the same flat surface.",
            ],
            "Classroom hunt: in 3 minutes, list objects in the room showing parallel, intersecting and perpendicular lines. Pairs that find the most correct examples win. Then fold a paper twice to create a perpendicular crease.",
            "Ganita Prakash Ch. 2 & Ch. 8 (perpendicular/parallel); old NCERT Ch. 4 (4.4–4.5) and Ch. 5 (5.6 Perpendicular lines).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Dadaji's Door · What is an Angle?",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Back home, Dadaji is fixing a wooden door. "Open it a little, Meera." The door swings around its hinge. "How much it turned," says Dadaji, "is what mathematicians call an angle."</div>

<h2>An angle is an amount of turn</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Vertex</strong>: the point where the turn happens (the hinge, O).</div>
  <div><strong class="text-amber-300">Arms</strong>: the two rays OA and OB.</div>
  <div><strong class="text-amber-300">Name</strong>: ∠AOB or ∠BOA. The vertex letter is always in the <strong>middle</strong>.</div>
  <div><strong class="text-amber-300">Unit</strong>: degrees (°). One full turn = <strong>360°</strong>.</div>
</div>

<h2>Turns and degrees</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Turn</th><th>Degrees</th><th class="text-left">Name</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>¼ turn</td><td class="text-center">90°</td><td>Right angle</td></tr>
    <tr><td>½ turn</td><td class="text-center">180°</td><td>Straight angle</td></tr>
    <tr><td>¾ turn</td><td class="text-center">270°</td><td>Reflex angle</td></tr>
    <tr><td>1 full turn</td><td class="text-center">360°</td><td>Complete angle</td></tr>
  </tbody>
</table>

<h2>The clock is an angle machine</h2>
<div {FORMULA}>Each hour gap = 360° ÷ 12 = 30°</div>
<p>At 3 o'clock: 3 × 30° = 90°. At 6 o'clock: 6 × 30° = 180°.</p>

<h2>Why 360?</h2>
<p>Historians believe the idea comes from ancient Babylon, where people counted in 60s and a year was close to 360 days. 360 is also very friendly: it divides exactly by 2, 3, 4, 5, 6, 8, 9, 10, 12 and more, so halves, thirds and quarters of a turn are all whole degrees.</p>
""",
        "keyInsight": "An angle measures how much something turns, not how long its arms are. One full turn = 360°.",
        "widgetType": "Class6AngleTurnWidget",
        "widgetData": {},
        "scenes": [
            scene(
                "Back home, Dadaji is fixing a wooden door. Meera, he says, open the door a little. The door turns around its hinge. The amount by which it turns is what mathematicians call an angle.",
                "Ghar wapas aakar Dadaji ek lakdi ka darwaaza theek kar rahe hain. Kehte hain, Meera, darwaaza thoda kholo. Darwaaza apne kabze ke chaaron taraf ghoomta hai. Woh jitna ghoomta hai, use mathematician angle kehte hain.",
                {"context": "door", "angle": 0},
            ),
            scene(
                "A small push gives a small turn, and a small angle. We measure angles in degrees. This door has turned 30 degrees.",
                "Halka sa dhakka, thoda sa ghoomna, chhota sa angle. Angle ko hum degree mein naapte hain. Yeh darwaaza 30 degree ghooma hai.",
                {"context": "door", "angle": 30},
            ),
            scene(
                "Now open it wider, until the door stands straight out from the wall. This is a quarter of a full turn, and it measures 90 degrees. It is called a right angle.",
                "Ab ise aur kholo, jab tak darwaaza deewar se bilkul seedha bahar na nikal aaye. Yeh ek poore chakkar ka chauthai hissa hai, aur yeh 90 degree ka hai. Ise right angle kehte hain.",
                {"context": "door", "angle": 90},
            ),
            scene(
                "Now let us draw it like mathematicians. The hinge becomes a point O, called the vertex. The wall and the door become two rays, O A and O B, called the arms. We name this angle as angle A O B, always keeping the vertex letter in the middle.",
                "Ab ise mathematician ki tarah banaate hain. Kabza ban jaata hai point O, jise vertex kehte hain. Deewar aur darwaaza ban jaate hain do rays, O A aur O B, jinhe arms kehte hain. Is angle ka naam hai angle A O B. Vertex ka letter hamesha beech mein rakhte hain.",
                {"context": "plain", "angle": 55, "showParts": True},
            ),
            scene(
                "Turn the arm until it points the opposite way. That is half a turn. The two arms now make a straight line. This is 180 degrees, a straight angle.",
                "Arm ko tab tak ghumaao jab tak woh ulti disha mein na aa jaaye. Yeh aadha chakkar hai. Ab dono arms milkar ek seedhi line bana rahe hain. Yeh 180 degree hai, straight angle.",
                {"context": "plain", "angle": 180},
            ),
            scene(
                "Keep turning, all the way round, until the arm comes back home. One full turn is 360 degrees. This is a complete angle.",
                "Ghumaate raho, poora chakkar, jab tak arm wapas apni jagah na aa jaaye. Ek poora chakkar 360 degree hota hai. Ise complete angle kehte hain.",
                {"context": "plain", "angle": 360},
            ),
            scene(
                "Dadaji points at the wall clock. A clock is an angle machine. There are 12 hours around the circle, so each hour gap is 360 divided by 12, which is 30 degrees. At 3 o'clock the hands are 3 gaps apart. 3 times 30 is 90 degrees, a right angle.",
                "Dadaji deewar ki ghadi ki taraf ishaara karte hain. Ghadi ek angle machine hai. Gol ghere mein 12 ghante hain, toh har ghante ka gap hai 360 bhaag 12, yaani 30 degree. 3 baje dono suiyaan 3 gap door hoti hain. 3 guna 30, yaani 90 degree, ek right angle.",
                {"context": "clock", "angle": 90},
            ),
            scene(
                "At 6 o'clock the hands point in opposite directions. 6 times 30 is 180 degrees.",
                "6 baje suiyaan ek doosre ki ulti disha mein hoti hain. 6 guna 30, yaani 180 degree.",
                {"context": "clock", "angle": 180},
            ),
            scene(
                "Why 360 degrees, and not 100? Historians believe the idea comes from ancient Babylon, where people counted in sixties, and a year has about 360 days. 360 is also a wonderful number. It divides exactly by 2, 3, 4, 5, 6, 8, 9, 10 and 12. So halves, thirds and quarters of a turn are always whole numbers of degrees.",
                "360 degree hi kyon, 100 kyon nahi? Itihaaskaar maante hain ki yeh idea purane Babylon se aaya, jahan log saath saath mein ginte the, aur saal mein lagbhag 360 din hote hain. 360 ek kamaal ka number bhi hai. Yeh 2, 3, 4, 5, 6, 8, 9, 10 aur 12 se poora bant jaata hai. Isliye chakkar ka aadha, tihaai, chauthai, sab poore degree mein aate hain.",
                {"context": "plain", "angle": 120},
            ),
        ],
        "miniChallenge": {
            "question": "What is the angle between the hands of a clock at 2 o'clock?",
            "options": ["30°", "60°", "90°", "120°"],
            "correctIndex": 1,
            "explanation": "Each hour gap is 30°. At 2 o'clock the hands are 2 gaps apart: 2 × 30° = 60°.",
        },
        "teacherNotes": teacher(
            [
                "Lead with turning (door, clock, head turning) before showing any drawing. The 'static' picture of an angle comes last.",
                "Insist that the vertex letter goes in the middle. Have students name the same angle two ways (∠AOB, ∠BOA).",
                "Connect fractions of a turn to degrees: ½ turn = 180°, ¼ turn = 90°.",
            ],
            [
                "Believing longer arms make a bigger angle. Draw the same angle with short and long arms side by side.",
                "Naming an angle with the vertex first (∠OAB instead of ∠AOB).",
                "Forgetting that a clock's hands move clockwise, so the angle is counted between the hands, not 'from 12'.",
            ],
            "Human clock: one student stands as the vertex with both arms out. The class calls times (3 o'clock, 6 o'clock, 1 o'clock) and the student turns one arm. Others call out the angle in degrees using 'times 30'.",
            "Ganita Prakash Ch. 2 (2.4–2.6, angles as turns); old NCERT Ch. 5 (5.3 Angles: Right and Straight).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: The Angle Family · Acute to Reflex",
        "readingTime": "~4 min story",
        "narrative": f"""
<div {STORY}>Meera wants to sort every angle in the house into families: the sharp ones, the square ones, the lazy ones and the very big ones.</div>

<h2>The angle family</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Type</th><th>Size</th><th class="text-left">Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td class="text-emerald-300 font-bold">Acute</td><td class="text-center">0° &lt; x &lt; 90°</td><td>Pencil tip; Leaning Tower of Pisa leans about 4°</td></tr>
    <tr><td class="text-sky-300 font-bold">Right</td><td class="text-center">x = 90°</td><td>Corner of a book or a door frame</td></tr>
    <tr><td class="text-amber-300 font-bold">Obtuse</td><td class="text-center">90° &lt; x &lt; 180°</td><td>A reclining chair</td></tr>
    <tr><td class="text-purple-300 font-bold">Straight</td><td class="text-center">x = 180°</td><td>An open book lying flat</td></tr>
    <tr><td class="text-pink-300 font-bold">Reflex</td><td class="text-center">180° &lt; x &lt; 360°</td><td>A pizza with one slice taken out</td></tr>
    <tr><td class="text-red-300 font-bold">Complete</td><td class="text-center">x = 360°</td><td>A skater's full spin</td></tr>
  </tbody>
</table>
<p>Memory trick: <strong>acute</strong> = "a cute little angle"; <strong>obtuse</strong> = "big and lazy".</p>
""",
        "keyInsight": "Compare with 90° and 180° first. Less than 90° is acute, between 90° and 180° is obtuse, past 180° is reflex.",
        "widgetType": "Class6AngleTurnWidget",
        "widgetData": {},
        "scenes": [
            scene(
                "Meera decides to sort angles into families, by size. An angle smaller than a right angle is called acute. Acute means sharp, like the tip of a pencil. The famous Leaning Tower of Pisa in Italy leans by only about 4 degrees, a tiny acute angle.",
                "Meera angles ko size ke hisaab se parivaaron mein baantna chaahti hai. Jo angle right angle se chhota ho, use acute kehte hain. Acute ka matlab hai nukeela, pencil ki nok jaisa. Italy ka mashhoor Leaning Tower of Pisa sirf lagbhag 4 degree jhuka hai. Yeh ek chhota sa acute angle hai.",
                {"context": "plain", "angle": 35, "showType": True, "showParts": False},
            ),
            scene(
                "Exactly 90 degrees is a right angle. You find them at the corners of a door, a book and a carrom board.",
                "Bilkul 90 degree ko right angle kehte hain. Yeh darwaaze, kitaab aur carrom board ke konon par milte hain.",
                {"context": "plain", "angle": 90, "showParts": False},
            ),
            scene(
                "Between 90 and 180 degrees, the angle is called obtuse. Obtuse means blunt. Lean back in a reclining chair and your body makes an obtuse angle.",
                "90 aur 180 degree ke beech ke angle ko obtuse kehte hain. Obtuse ka matlab hai bhotha, jo nukeela na ho. Aaraam kursi par peeche jhuko, toh aapka shareer ek obtuse angle banaata hai.",
                {"context": "plain", "angle": 130, "showParts": False},
            ),
            scene(
                "Exactly 180 degrees is a straight angle. The two arms make one straight line, like a book opened flat on the table.",
                "Bilkul 180 degree ko straight angle kehte hain. Dono arms milkar ek seedhi line banaate hain, jaise mez par poori khuli kitaab.",
                {"context": "plain", "angle": 180, "showParts": False},
            ),
            scene(
                "More than 180 but less than 360 degrees is a reflex angle. Here the turn has gone past the straight line. A reflex angle looks like a round pizza after one slice has been taken out.",
                "180 se zyaada lekin 360 se kam degree ke angle ko reflex angle kehte hain. Yahan ghoomna seedhi line se aage nikal gaya hai. Reflex angle aisa dikhta hai jaise gol pizza se ek slice nikaal liya ho.",
                {"context": "plain", "angle": 250, "showParts": False},
            ),
            scene(
                "And 360 degrees, one full turn, is a complete angle. Think of a skater spinning round once, or the minute hand finishing one hour.",
                "Aur 360 degree, yaani ek poora chakkar, complete angle hai. Socho ek skater ek baar poora ghoom gaya, ya minute ki sui ne ek ghanta poora kar liya.",
                {"context": "plain", "angle": 360, "showParts": False},
            ),
            scene(
                "Your turn. Drag the glowing handle and make an obtuse angle, more than 90 but less than 180 degrees.",
                "Ab aapki baari. Chamakte handle ko drag karo aur ek obtuse angle banao, 90 se zyaada lekin 180 degree se kam.",
                {"context": "plain", "angle": 20, "showParts": False, "task": {"text": "Your turn: make an obtuse angle (between 91° and 179°).", "min": 91, "max": 179}},
                wait=True,
            ),
        ],
        "miniChallenge": {
            "question": "An angle of 200° is…",
            "options": ["Obtuse", "Straight", "Reflex", "Complete"],
            "correctIndex": 2,
            "explanation": "It is more than 180° but less than 360°, so it is a reflex angle.",
        },
        "teacherNotes": teacher(
            [
                "Use the two 'fences' 90° and 180° as decision points: first ask 'less than or more than 90°?', then 'less than or more than 180°?'.",
                "Show that every angle smaller than 360° has a reflex partner on its outside: 100° inside, 260° outside.",
            ],
            [
                "Calling 90° 'acute' or 180° 'obtuse'. The boundaries belong to right and straight.",
                "Thinking a reflex angle is just a 'big obtuse angle'.",
                "Judging an angle by how it is tilted on the page instead of the opening between its arms.",
            ],
            "Angle sort: hand out 12 cards with drawn angles (including tilted and long-armed ones). Teams sort them into acute, right, obtuse, straight and reflex using only the corner of a sheet of paper as their 90° tester.",
            "Ganita Prakash Ch. 2 (2.7 Special types of angles); old NCERT Ch. 5 (5.4 Angles: Acute, Obtuse and Reflex).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: The Carpenter's Joint · Measuring with a Protractor",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Dadaji needs to cut a wooden joint at an exact angle. "Guessing is not good enough," he says. Meera opens her geometry box and takes out the half-moon tool.</div>

<h2>3 steps to measure any angle</h2>
<ol>
  <li><strong>Centre on the vertex.</strong> Put the protractor's centre point exactly on O.</li>
  <li><strong>Base on an arm.</strong> Line up the base line with one arm (OA).</li>
  <li><strong>Read from zero.</strong> Use the scale that starts at <strong>0 on that arm</strong>, and read where the other arm crosses it.</li>
</ol>

<div {CARD}>
  <div class="text-red-300 font-bold">The classic exam mistake</div>
  <div>A protractor has two scales. Reading the wrong one gives <strong>180° − the real angle</strong>. A 65° angle gets read as 115°.</div>
  <div class="text-emerald-300">Check: first decide with your eyes whether the angle is acute or obtuse. Your reading must agree.</div>
</div>
""",
        "keyInsight": "Centre on the vertex, base on an arm, and read the scale that starts at 0 on that arm. Always sanity-check: acute or obtuse?",
        "widgetType": "Class6ProtractorWidget",
        "widgetData": {},
        "scenes": [
            scene(
                "Dadaji needs to cut a wooden joint at an exact angle. Guessing is not good enough. Meera brings her geometry box and takes out a half moon shaped tool. This is a protractor. It measures angles in degrees.",
                "Dadaji ko lakdi ka ek jod bilkul sahi angle par kaatna hai. Andaaza lagaana kaafi nahi hai. Meera apna geometry box laati hai aur usmein se aadhe chaand jaisa ek tool nikaalti hai. Yeh protractor hai. Yeh angle ko degree mein naapta hai.",
                {"angle": 65, "place": False, "scale": "none", "reading": False, "guess": False},
            ),
            scene(
                "Step one. Slide the protractor so that its centre point sits exactly on the vertex O.",
                "Pehla step. Protractor ko aise khiskaao ki uska centre point bilkul vertex O par aa jaaye.",
                {"angle": 65, "place": True, "scale": "none", "reading": False},
            ),
            scene(
                "Step two. Line up the base line of the protractor with one arm of the angle, here the white arm. Now the protractor sits perfectly.",
                "Doosra step. Protractor ki base line ko angle ke ek arm ke saath milaao, yahan safed arm ke saath. Ab protractor bilkul sahi baitha hai.",
                {"angle": 65, "place": True, "scale": "none", "reading": False},
            ),
            scene(
                "Step three. A protractor has two rows of numbers. Choose the row that starts at zero on your first arm. Here that is the inner, green row. Follow it up to the second arm and read the number. The angle is 65 degrees.",
                "Teesra step. Protractor par numbers ki do lines hoti hain. Woh line chuno jo aapke pehle arm par zero se shuru hoti hai. Yahan woh andar wali hari line hai. Use doosre arm tak follow karo aur number padho. Angle 65 degree hai.",
                {"angle": 65, "place": True, "scale": "inner", "reading": True},
            ),
            scene(
                "Now, the most common mistake in exams. If you read the outer row by mistake, you get 115 degrees. But our angle is clearly smaller than a right angle, so 115 must be wrong. Always ask yourself first, is my angle acute or obtuse?",
                "Ab exam ki sabse common galti. Agar galti se bahar wali line padh li, toh aayega 115 degree. Lekin hamara angle saaf taur par right angle se chhota hai, toh 115 galat hi hoga. Hamesha pehle khud se poocho, mera angle acute hai ya obtuse?",
                {"angle": 65, "place": True, "scale": "outer", "reading": True},
            ),
            scene(
                "Let us try a bigger angle. The inner row again starts at zero on our arm. Reading it gives 140 degrees, an obtuse angle, which matches what our eyes see.",
                "Ab ek bada angle try karte hain. Andar wali line phir se hamare arm par zero se shuru hoti hai. Padhne par aata hai 140 degree, ek obtuse angle, jo aankhon se dekhne mein bhi sahi lagta hai.",
                {"angle": 140, "place": True, "scale": "inner", "reading": True},
            ),
            scene(
                "Time for the estimation game. Look at the angle, slide to your best guess, then check with the protractor. Get within 10 degrees to win. Tip, first compare with a right angle, then think about half of it.",
                "Ab andaaza lagaane ka khel. Angle ko dekho, slider se apna best guess lagao, phir protractor se check karo. 10 degree ke andar aaye toh aap jeete. Tip, pehle right angle se tulna karo, phir uske aadhe ke baare mein socho.",
                {"angle": 50, "place": False, "scale": "none", "reading": False, "guess": True},
                wait=True,
            ),
        ],
        "miniChallenge": {
            "question": "Riya measures a clearly acute angle and writes 150°. What is the most likely real measure?",
            "options": ["150°", "30°", "60°", "90°"],
            "correctIndex": 1,
            "explanation": "She read the wrong scale. The real angle is 180° − 150° = 30°, which is acute.",
        },
        "teacherNotes": teacher(
            [
                "Demonstrate on the board with a large protractor, saying the three steps aloud every time: centre, base, read from zero.",
                "Make estimation a habit before measuring. It is the best defence against the two-scale mistake.",
            ],
            [
                "Reading the wrong scale (gives 180° − x).",
                "Placing the protractor's bottom edge instead of the base line on the arm (many protractors have a margin).",
                "Arms too short to reach the scale. Teach students to extend arms with a ruler first.",
            ],
            "Estimation league: draw 5 angles on the board. Students write estimates, then measure. Score = total difference from the real values; lowest score wins. Repeat weekly and watch scores fall.",
            "Ganita Prakash Ch. 2 (2.8–2.9 Measuring angles, protractor); old NCERT Ch. 5 (5.5 Measuring Angles).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Proof Lab · Three Angle Rules, Seen and Proved",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>"A carpenter never trusts a rule until he has tested it," says Dadaji. Mathematicians feel the same way. Meera tests three rules: first with her eyes, then with numbers.</div>

<h2>Rule 1 · Linear pair</h2>
<p>Two angles that sit side by side on a straight line form a <strong>linear pair</strong>.</p>
<div {FORMULA}>∠1 + ∠2 = 180°</div>
<p><strong>Why:</strong> together they fill a straight angle, which is half a turn, 180°.</p>

<h2>Rule 2 · Vertically opposite angles are equal</h2>
<p>When two lines cross, the angles facing each other across the point are <strong>vertically opposite</strong>.</p>
<div {CARD}>
  <div>∠1 + ∠2 = 180° (linear pair)</div>
  <div>∠2 + ∠3 = 180° (linear pair)</div>
  <div>So ∠1 + ∠2 = ∠2 + ∠3</div>
  <div class="text-emerald-300 font-bold">Taking away ∠2 from both sides: ∠1 = ∠3 ✔ (similarly ∠2 = ∠4)</div>
</div>
<p><strong>See it:</strong> spin ∠1 half a turn about the crossing point and it lands exactly on ∠3.</p>

<h2>Rule 3 · Angles around a point</h2>
<div {FORMULA}>Sum of all angles around a point = 360°</div>
<p><strong>Why:</strong> together they make one full turn.</p>
<p class="text-xs text-slate-400">Note: Rules 1 and 2 are formally taught in Class 7 (Lines and Angles). Seeing them now makes Class 7 much easier.</p>
""",
        "keyInsight": "On a line: 180°. Around a point: 360°. Crossing lines: opposite angles are equal, because both make a linear pair with the same neighbour.",
        "widgetType": "Class6AngleProofsWidget",
        "widgetData": {},
        "scenes": [
            scene(
                "Dadaji loves to say, a carpenter never trusts a rule until he has tested it. Mathematicians are the same. Let us test three angle rules. Rule one starts with a straight line A B. The angle on a straight line is half a turn, 180 degrees.",
                "Dadaji hamesha kehte hain, carpenter kisi niyam par tab tak bharosa nahi karta jab tak use test na kar le. Mathematician bhi aise hi hote hain. Chalo teen angle ke niyam test karte hain. Pehla niyam ek seedhi line A B se shuru hota hai. Seedhi line par angle aadha chakkar hota hai, 180 degree.",
                {"mode": "linear", "angle": 60, "step": 0},
            ),
            scene(
                "Now a ray O C starts from point O on the line. It splits the straight angle into two angles, side by side. Two angles that sit together on a straight line like this are called a linear pair.",
                "Ab line par point O se ek ray O C nikalti hai. Yeh straight angle ko do angles mein baant deti hai, jo agal bagal hain. Seedhi line par aise saath baithe do angles ko linear pair kehte hain.",
                {"mode": "linear", "angle": 60, "step": 1},
            ),
            scene(
                "The green angle is 60 degrees and the orange one is 120 degrees. Together, they still fill the same half turn.",
                "Hara angle 60 degree hai aur naarangi angle 120 degree. Dono milkar ab bhi wahi aadha chakkar bharte hain.",
                {"mode": "linear", "angle": 60, "step": 2},
            ),
            scene(
                "Move the ray anywhere. 35 and 145. 100 and 80. The two numbers change, but their sum is always 180 degrees. Rule one. The angles of a linear pair add up to 180 degrees.",
                "Ray ko kahin bhi le jaao. 35 aur 145. 100 aur 80. Dono numbers badalte hain, lekin unka jod hamesha 180 degree rehta hai. Pehla niyam. Linear pair ke angles ka jod 180 degree hota hai.",
                {"mode": "linear", "angle": 35, "step": 3},
            ),
            scene(
                "Rule two. Two straight lines cross at O, like the blades of a pair of scissors. They make four angles. We call them angle 1, 2, 3 and 4. Angle 1 and angle 3 face each other across the point. They are called vertically opposite angles.",
                "Doosra niyam. Do seedhi lines O par ek doosre ko kaatti hain, bilkul kainchi ke do phalon ki tarah. Yeh chaar angle banaati hain. Hum inhe angle 1, 2, 3 aur 4 kehte hain. Angle 1 aur angle 3 point ke aar paar aamne saamne hain. Inhe vertically opposite angles kehte hain.",
                {"mode": "vertical", "angle": 50, "step": 0},
            ),
            scene(
                "Look at their sizes. Angle 1 is 50 degrees, and angle 3 is also 50 degrees. Angle 2 and angle 4 are both 130 degrees. Is this just luck?",
                "Inke size dekho. Angle 1 hai 50 degree, aur angle 3 bhi 50 degree. Angle 2 aur angle 4 dono 130 degree hain. Kya yeh sirf kismat hai?",
                {"mode": "vertical", "angle": 50, "step": 1},
            ),
            scene(
                "First, let us see it. Make a copy of angle 1 and spin it half a turn about O. It lands exactly on angle 3. A perfect fit. So they must be equal.",
                "Pehle ise dekhte hain. Angle 1 ki ek copy banao aur use O ke chaaron taraf aadha chakkar ghumaao. Woh bilkul angle 3 ke upar aa kar baith jaati hai. Ekdum perfect fit. Toh dono barabar hi honge.",
                {"mode": "vertical", "angle": 50, "step": 2},
            ),
            scene(
                "Now let us prove it with numbers. Angle 1 and angle 2 make a linear pair, so angle 1 plus angle 2 is 180 degrees. Angle 2 and angle 3 also make a linear pair, so angle 2 plus angle 3 is also 180 degrees.",
                "Ab ise numbers se prove karte hain. Angle 1 aur angle 2 linear pair banaate hain, toh angle 1 plus angle 2 barabar 180 degree. Angle 2 aur angle 3 bhi linear pair banaate hain, toh angle 2 plus angle 3 bhi 180 degree.",
                {"mode": "vertical", "angle": 50, "step": 4},
            ),
            scene(
                "Both sums are 180, so angle 1 plus angle 2 equals angle 2 plus angle 3. Take away angle 2 from both sides, and we get angle 1 equals angle 3. Proved. In the same way, angle 2 equals angle 4.",
                "Dono jod 180 hain, toh angle 1 plus angle 2 barabar angle 2 plus angle 3. Dono taraf se angle 2 hata do, toh milta hai angle 1 barabar angle 3. Prove ho gaya. Isi tarah, angle 2 barabar angle 4.",
                {"mode": "vertical", "angle": 50, "step": 6},
            ),
            scene(
                "Rule three. Draw some rays from one point O, as many as you like. The angles all the way around the point together make one full turn. So they always add up to 360 degrees. Think of the slices of a round roti meeting at its centre.",
                "Teesra niyam. Ek point O se kuch rays banao, jitni chaaho. Point ke chaaron taraf ke saare angles milkar ek poora chakkar banaate hain. Isliye unka jod hamesha 360 degree hota hai. Socho gol roti ke tukde jo beech mein milte hain.",
                {"mode": "point", "rays": [35, 120, 215, 300]},
            ),
            scene(
                "Your turn. Drag the coloured dots to move the rays. Watch the angles change, and check that the total stays 360 degrees every single time.",
                "Ab aapki baari. Rangeen dots ko drag karke rays ko hilaao. Angles ko badalte dekho, aur check karo ki total har baar 360 degree hi rehta hai.",
                {"mode": "point", "rays": [35, 120, 215, 300]},
                wait=True,
            ),
        ],
        "miniChallenge": {
            "question": "Two lines cross. One of the four angles is 70°. What is the angle vertically opposite to it?",
            "options": ["110°", "70°", "20°", "290°"],
            "correctIndex": 1,
            "explanation": "Vertically opposite angles are equal, so it is also 70°. (Its neighbours are 180° − 70° = 110°.)",
        },
        "teacherNotes": teacher(
            [
                "Always show 'see it' (the visual) before 'prove it' (the equations). Students should believe the result before they justify it.",
                "Highlight the logical move in Rule 2: two things equal to the same thing (180°) are equal to each other, then remove the common part.",
                "Ask 'will it work for every angle?' and let students drag the figure. A theorem is a rule that never breaks.",
            ],
            [
                "Adding vertically opposite angles to 180° (they are equal, not supplementary).",
                "Treating any two adjacent angles as a linear pair. They must sit on a straight line.",
                "Forgetting the reflex 'outside' angle when adding angles around a point.",
            ],
            "Paper proof: each student draws a straight line and a ray, cuts out the two angles and places them together along a ruler edge (180°). Then cut the 4 angles of crossing lines and lay opposite ones on top of each other.",
            "Bridge content: linear pair and vertically opposite angles are formally in Class 7 Ch. 5 (Lines and Angles). Angles around a point reinforces Class 6 'complete angle'.",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>Meera's exam is next week. Dadaji sits with her and they solve one question at a time: read, picture it, then solve.</div>
<h2>How to attack any angle question</h2>
<ol>
  <li><strong>Draw it</strong> (even a rough sketch).</li>
  <li><strong>Spot the rule</strong>: straight line (180°), full turn (360°), crossing lines (opposite angles equal), clock (30° per hour).</li>
  <li><strong>Write the equation</strong>, then solve.</li>
  <li><strong>Sanity check</strong>: does the answer look acute or obtuse in the drawing?</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Most angle questions use just three facts: 180° on a line, 360° around a point, and 30° per hour on a clock.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Counting line segments",
                    "question": "Four points A, B, C and D lie on a line, in that order. How many different line segments can you name using these points?",
                    "figureSvg": svg_points_on_line(),
                    "steps": [
                        "From A: AB, AC, AD → <strong>3</strong> segments",
                        "From B (AB already counted): BC, BD → <strong>2</strong> segments",
                        "From C: CD → <strong>1</strong> segment",
                        "Total = 3 + 2 + 1 = <strong>6</strong>",
                    ],
                    "answer": "6 line segments (AB, AC, AD, BC, BD, CD)",
                },
                {
                    "title": "Clock angle",
                    "question": "What is the angle between the hour hand and the minute hand of a clock at 4 o'clock? Name the type of angle.",
                    "steps": [
                        "A full turn is 360° and there are 12 hour gaps.",
                        "Each gap = 360° ÷ 12 = <strong>30°</strong>",
                        "At 4 o'clock the hands are 4 gaps apart: 4 × 30° = <strong>120°</strong> (between 90° and 180°)",
                    ],
                    "answer": "120°, an obtuse angle",
                },
                {
                    "title": "Turning directions",
                    "question": "Meera faces North and turns clockwise to face East. What fraction of a turn is this, and how many degrees? If she then turns clockwise from East to West, how many degrees does she turn?",
                    "steps": [
                        "North → East clockwise is one of the four quarters of a full turn: <strong>¼ turn</strong>",
                        "¼ × 360° = <strong>90°</strong>",
                        "East → South → West clockwise is two quarters: ½ turn = <strong>180°</strong>",
                    ],
                    "answer": "¼ turn = 90°; then ½ turn = 180°",
                },
                {
                    "title": "Classifying angles",
                    "question": "Classify: 45°, 90°, 135°, 180°, 210°, 360°.",
                    "steps": [
                        "45° &lt; 90° → <strong>acute</strong>",
                        "90° → <strong>right</strong>; 180° → <strong>straight</strong>; 360° → <strong>complete</strong>",
                        "135° is between 90° and 180° → <strong>obtuse</strong>",
                        "210° is between 180° and 360° → <strong>reflex</strong>",
                    ],
                    "answer": "acute, right, obtuse, straight, reflex, complete",
                },
                {
                    "title": "Linear pair",
                    "question": "Two angles form a linear pair. One of them is 65°. Find the other.",
                    "figureSvg": svg_linear_pair("65°", "x"),
                    "steps": [
                        "Angles of a linear pair add up to 180°: 65° + x = 180°",
                        "x = 180° − 65° = <strong>115°</strong>",
                        "Check: 65° looks acute, 115° looks obtuse ✔",
                    ],
                    "answer": "115°",
                },
                {
                    "title": "Vertically opposite angles",
                    "question": "Two lines intersect. One angle, a, is 40°. Find the other three angles b, c and d.",
                    "figureSvg": svg_crossing("a=40°"),
                    "steps": [
                        "a and b form a linear pair: b = 180° − 40° = <strong>140°</strong>",
                        "c is vertically opposite a: c = <strong>40°</strong>",
                        "d is vertically opposite b: d = <strong>140°</strong>",
                        "Check: 40 + 140 + 40 + 140 = 360° ✔",
                    ],
                    "answer": "b = 140°, c = 40°, d = 140°",
                },
                {
                    "title": "Linear pair in a ratio",
                    "question": "Two angles of a linear pair are x and 2x. Find both angles.",
                    "figureSvg": svg_linear_pair("2x", "x"),
                    "steps": [
                        "Linear pair: x + 2x = 180°",
                        "3x = 180°, so x = 180° ÷ 3 = <strong>60°</strong>",
                        "2x = <strong>120°</strong>",
                    ],
                    "answer": "60° and 120°",
                },
                {
                    "title": "Angles around a point",
                    "question": "Three angles around a point are 100°, 130° and y. Find y.",
                    "steps": [
                        "Angles around a point add up to 360°: 100° + 130° + y = 360°",
                        "230° + y = 360°",
                        "y = 360° − 230° = <strong>130°</strong>",
                    ],
                    "answer": "y = 130°",
                },
                {
                    "title": "Protractor mistake",
                    "question": "Riya measures an angle that is clearly smaller than a right angle, but writes 130°. What went wrong and what is the real measure?",
                    "steps": [
                        "An angle smaller than 90° cannot be 130°, so the reading is wrong.",
                        "She read the outer scale. Wrong-scale reading = 180° − real angle.",
                        "Real angle = 180° − 130° = <strong>50°</strong>",
                    ],
                    "answer": "She read the wrong scale; the angle is 50°",
                },
                {
                    "title": "Lines through points",
                    "question": "How many lines can be drawn through (a) one point, (b) two points, (c) three points A, B, C that are not on one line, taking two points at a time?",
                    "steps": [
                        "(a) Through one point: <strong>infinitely many</strong> lines",
                        "(b) Through two points: <strong>exactly one</strong> line",
                        "(c) Pairs: AB, BC, CA → <strong>3</strong> lines",
                    ],
                    "answer": "(a) infinitely many, (b) one, (c) three",
                },
            ]
        },
        "scenes": [
            scene(
                "Let us solve exam questions together, step by step. Question 1. Four points A, B, C and D lie on a line. How many line segments can you name?",
                "Chalo exam ke sawaal saath mein, step by step solve karte hain. Sawaal 1. Chaar points A, B, C aur D ek line par hain. Aap kitne line segments ke naam bata sakte ho?",
                {"example": 0, "step": 0},
            ),
            scene(
                "Start from A. A can join B, C and D. That gives 3 segments.",
                "A se shuru karo. A, B, C aur D se jud sakta hai. Yeh hue 3 segments.",
                {"example": 0, "step": 1},
            ),
            scene(
                "Now B. We already have A B, so B joins only C and D. That is 2 more.",
                "Ab B. A B toh pehle hi gin liya, isliye B sirf C aur D se judega. Yeh 2 aur.",
                {"example": 0, "step": 2},
            ),
            scene(
                "From C, just C D. One more. Total, 3 plus 2 plus 1 equals 6 line segments. Notice the pattern, it will help you with bigger questions.",
                "C se sirf C D. Ek aur. Total, 3 plus 2 plus 1 barabar 6 line segments. Is pattern par dhyaan do, bade sawaalon mein kaam aayega.",
                {"example": 0, "step": 4},
            ),
            scene(
                "Question 2. What is the angle between the hands of a clock at 4 o'clock?",
                "Sawaal 2. 4 baje ghadi ki dono suiyon ke beech kitna angle hota hai?",
                {"example": 1, "step": 0},
            ),
            scene(
                "There are 12 equal gaps in 360 degrees, so each gap is 30 degrees. At 4 o'clock the hands are 4 gaps apart. 4 times 30 is 120 degrees, which is an obtuse angle.",
                "360 degree mein 12 barabar gap hain, toh har gap 30 degree ka hai. 4 baje suiyaan 4 gap door hoti hain. 4 guna 30 barabar 120 degree, jo ek obtuse angle hai.",
                {"example": 1, "step": 3},
            ),
            scene(
                "Now it is your turn to practise. Pick any question from 3 to 10. Try it in your notebook first, then press show step to check each step.",
                "Ab aapki practice ki baari. 3 se 10 tak koi bhi sawaal chuno. Pehle apni notebook mein try karo, phir show step dabaakar har step check karo.",
                {"example": 2, "step": 0},
            ),
        ],
        "teacherNotes": teacher(
            [
                "Model the 4-step routine (draw, spot the rule, equation, sanity check) aloud for Q1–Q2, then let students lead Q3 onwards.",
                "Q1 introduces the 3 + 2 + 1 pattern. Ask: what about 5 points? (4 + 3 + 2 + 1 = 10).",
            ],
            [
                "Counting AB and BA as two different segments.",
                "In clock questions, counting the number on the dial instead of the number of gaps.",
                "Forgetting to write the degree sign and the reason (e.g., 'linear pair') in board answers.",
            ],
            "Pair-share: student A solves an odd-numbered question aloud while B checks against the steps; swap roles for even-numbered questions.",
            "Covers Ganita Prakash Ch. 2 exercises and old NCERT Ch. 4–5 exercise patterns; Q5–Q7 preview Class 7.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Lines and Angles (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>You have travelled with Meera from a kite string to a full proof. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering segments, rays, lines, pairs of lines, angle types, protractor reading, clock angles and the three angle rules.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Before choosing an option, sketch it and ask: acute or obtuse? on a line or around a point?",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Lines and Angles · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "How many end points does a ray have?", "options": ["0", "1", "2", "Infinitely many"], "answer": 1, "explanation": "A ray starts at one end point and goes on forever in one direction.", "topic": "Rays"},
                {"q": "Which of these can be measured with a ruler?", "options": ["A line", "A ray", "A line segment", "None of these"], "answer": 2, "explanation": "Only a line segment has two end points and therefore a fixed length.", "topic": "Line segments"},
                {"q": "The angle between the hands of a clock at 2 o'clock is:", "options": ["30°", "60°", "90°", "120°"], "answer": 1, "explanation": "2 gaps × 30° = 60°.", "topic": "Clock angles"},
                {"q": "An angle of 160° is:", "options": ["Acute", "Right", "Obtuse", "Reflex"], "answer": 2, "explanation": "It is more than 90° and less than 180°.", "topic": "Types of angles"},
                {"q": "An angle of 250° is:", "options": ["Obtuse", "Straight", "Reflex", "Complete"], "answer": 2, "explanation": "It is more than 180° and less than 360°.", "topic": "Types of angles"},
                {"q": "Two angles form a linear pair. One is 72°. The other is:", "options": ["18°", "108°", "288°", "72°"], "answer": 1, "explanation": "Linear pair adds to 180°: 180° − 72° = 108°.", "topic": "Linear pair"},
                {"q": "Two lines intersect and one angle is 110°. The angle vertically opposite to it is:", "options": ["70°", "110°", "250°", "90°"], "answer": 1, "explanation": "Vertically opposite angles are equal.", "topic": "Vertically opposite angles"},
                {"q": "Three-quarters of a full turn measures:", "options": ["90°", "180°", "270°", "300°"], "answer": 2, "explanation": "¾ × 360° = 270°.", "topic": "Turns and degrees"},
                {"q": "Three angles around a point are 90°, 120° and x. What is x?", "options": ["150°", "60°", "90°", "210°"], "answer": 0, "explanation": "90° + 120° + x = 360°, so x = 150°.", "topic": "Angles around a point"},
                {"q": "Arjun measures an angle that is clearly acute but reads 120° on his protractor. The real angle is:", "options": ["120°", "30°", "60°", "240°"], "answer": 2, "explanation": "He read the wrong scale: 180° − 120° = 60°.", "topic": "Using a protractor"},
            ],
        },
        "teacherNotes": teacher(
            [
                "Use the exam as a diagnostic: the 'Review these' list on a failed attempt shows exactly which story to revisit.",
            ],
            [
                "Rushing Q9: students often subtract only one angle from 360°.",
                "Q10 is designed to catch the two-scale protractor mistake.",
            ],
            "Exit ticket: before the exam, ask every student to write the three angle rules from memory on a slip of paper.",
            "Matches Ganita Prakash Ch. 2 learning outcomes and old NCERT Ch. 4–5 exam patterns.",
        ),
    },
]


def seed_class6_lines_angles():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Lines and Angles")
        topic.lesson_config_json = json.dumps({"type": "narrative", "voice": "female", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        print(f"Seeded Class 6 Lines and Angles: {len(PARTS)} parts, {scenes} narrated scenes")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Lines and Angles: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_lines_angles()
