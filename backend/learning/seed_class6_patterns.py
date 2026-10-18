import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Patterns in Mathematics (Ganita Prakash Ch. 1). Story: Mummy's bakery trays, Dadi's chessboard legend,
# Disha's tabla rhythms (Virahānka numbers) and a family reunion full of handshakes.


SCENES_1 = [
    scene([
        L("Narrator", "It is Sunday morning, and Mummy's bakery smells of fresh laddoos.", "Ravivaar ki subah hai, aur Mummy ki bakery taaze laddoon ki khushboo se mehak rahi hai."),
        L("Dadi", "Do you know what mathematics really is? It is the study of patterns. Once you start looking, you will find patterns everywhere, even in a tray of laddoos!",
          "Jaante ho maths asal mein kya hai? Yeh patterns ki padhaai hai. Ek baar dhoondhna shuru karo, toh patterns har jagah milenge, laddoo ki tray mein bhi!"),
    ], {"seq": "counting"}),
    scene([
        L("Neha", "I put the laddoos in rows: 1, then 2, then 3, then 4, then 5.", "Main laddoo kataaron mein rakhti hoon: 1, phir 2, phir 3, phir 4, phir 5."),
        L("Harsh", "Easy! Those are the counting numbers. Next comes 6!", "Aasaan! Yeh counting numbers hain. Agla 6 aayega!"),
    ], {"seq": "counting"}),
    scene([
        L("Disha", "These trays have 2, 4, 6, 8 laddoos, always in two neat rows.", "In trays mein 2, 4, 6, 8 laddoo hain, hamesha do saaf kataaron mein."),
        L("Dadi", "Numbers that can be arranged in two equal rows are the even numbers.", "Jo numbers do barabar kataaron mein sajaaye ja sakein, woh even numbers hain."),
    ], {"seq": "even"}),
    scene([
        L("Neha", "And these trays are shaped like the letter L: 1, 3, 5, 7.", "Aur yeh trays L akshar jaisi hain: 1, 3, 5, 7."),
        L("Dadi", "Those are the odd numbers. Each L is two more than the one before. Remember these L shapes, they will surprise you soon!",
          "Yeh odd numbers hain. Har L pichhle wale se do zyaada hai. In L shapes ko yaad rakhna, yeh jald hi tumhe hairaan karenge!"),
    ], {"seq": "odd"}),
    scene([
        L("Dadi", "Your turn! Look at the odd number pictures and type what comes next in the box.", "Ab aapki baari! Odd numbers ki tasveerein dekho aur box mein likho ki aage kya aayega."),
    ], {"seq": "odd", "task": True}, wait=True),
]

SCENES_2 = [
    scene([
        L("Neha", "For the party, I stack laddoos in triangles: 1 on top, then 2 below, then 3, then 4.", "Party ke liye main laddoo triangle mein sajaati hoon: upar 1, uske neeche 2, phir 3, phir 4."),
        L("Disha", "The totals are 1, 3, 6, 10, 15!", "Total hain 1, 3, 6, 10, 15!"),
        L("Dadi", "Those are the triangular numbers, because they make triangles.", "Yeh triangular numbers hain, kyonki yeh triangle banaate hain."),
    ], {"seq": "triangular"}),
    scene([
        L("Harsh", "The big square trays hold 1, 4, 9, 16, 25 laddoos.", "Badi square trays mein 1, 4, 9, 16, 25 laddoo aate hain."),
        L("Dadi", "The square numbers! A square tray with 5 rows of 5 holds 5 times 5, which is 25.", "Square numbers! 5 kataaron mein 5 laddoo wali square tray mein 5 guna 5, yaani 25 laddoo."),
    ], {"seq": "square"}),
    scene([
        L("Neha", "And my gift boxes are cubes of laddoos: 1, then 8, then 27, then 64!", "Aur mere gift box laddoon ke cube hain: 1, phir 8, phir 27, phir 64!"),
        L("Dadi", "The cube numbers. A box 3 laddoos long, 3 wide and 3 high holds 3 times 3 times 3, which is 27.",
          "Cube numbers. 3 laddoo lamba, 3 chauda aur 3 ooncha box, 3 guna 3 guna 3, yaani 27 laddoo rakhta hai."),
    ], {"seq": "cube"}),
    scene([
        L("Dadi", "Your turn. In the triangular numbers, each new row adds one more laddoo. What comes after 1, 3, 6, 10, 15?",
          "Ab aapki baari. Triangular numbers mein har nayi kataar ek aur laddoo jodti hai. 1, 3, 6, 10, 15 ke baad kya aayega?"),
    ], {"seq": "triangular", "task": True}, wait=True),
]

SCENES_3 = [
    scene([
        L("Dadi", "Now the surprise I promised. Take the L-shaped trays of odd numbers: 1, then 3, then 5. Fit them together, one around the other.",
          "Ab woh surprise jiska vaada kiya tha. Odd numbers ki L wali trays lo: 1, phir 3, phir 5. Inhe ek doosre ke chaaron taraf jodo."),
    ], {"mode": "odd", "n": 5, "layers": 1}),
    scene([
        L("Disha", "1 plus 3 makes a 2 by 2 square. That is 4!", "1 plus 3 se 2 guna 2 ka square banta hai. Yaani 4!"),
    ], {"mode": "odd", "n": 5, "layers": 2}),
    scene([
        L("Harsh", "Add 5 and it becomes a 3 by 3 square. 9! Then add 7, and it is 16!", "5 jodo toh 3 guna 3 ka square ban gaya. 9! Phir 7 jodo, toh 16!"),
    ], {"mode": "odd", "n": 5, "layers": 4}),
    scene([
        L("Dadi", "So adding the first n odd numbers always gives n times n. 1 plus 3 plus 5 plus 7 plus 9 is 25, which is 5 squared. Each new L wraps around the square and makes it one bigger.",
          "Toh pehle n odd numbers jodne par hamesha n guna n milta hai. 1 plus 3 plus 5 plus 7 plus 9 barabar 25, yaani 5 ka square. Har naya L square ko gher kar use ek bada kar deta hai."),
    ], {"mode": "odd", "n": 5, "layers": 5}),
    scene([
        L("Neha", "Look what happens with two triangle trays. Here is the triangle of 10, and the next smaller one, 6.", "Dekho do triangle trays ke saath kya hota hai. Yeh 10 wala triangle hai, aur usse chhota, 6 wala."),
    ], {"mode": "triangles", "n": 4, "layers": 0}),
    scene([
        L("Disha", "They fit together into a 4 by 4 square! 10 plus 6 is 16!", "Yeh milkar 4 guna 4 ka square ban gaye! 10 plus 6 barabar 16!"),
        L("Dadi", "Two triangular numbers next to each other always make a square number.", "Do agal bagal ke triangular numbers milkar hamesha square number banaate hain."),
    ], {"mode": "triangles", "n": 4, "layers": 4}),
    scene([
        L("Dadi", "One more. Count up and back down: 1 plus 2 plus 3 plus 4 plus 3 plus 2 plus 1. Each colour is one slanted line of the square.",
          "Ek aur. Upar aur phir neeche gino: 1 plus 2 plus 3 plus 4 plus 3 plus 2 plus 1. Har rang square ki ek tirchhi line hai."),
        L("Harsh", "That is 16 again, 4 times 4!", "Phir se 16, 4 guna 4!"),
    ], {"mode": "updown", "n": 4}),
    scene([
        L("Dadi", "Your turn. Go back to the odd numbers, make the square 6 by 6 or bigger, and add the L-shaped layers one by one.",
          "Ab aapki baari. Odd numbers par wapas jaao, square ko 6 guna 6 ya bada karo, aur L wali parten ek ek karke jodo."),
    ], {"mode": "odd", "n": 4, "layers": 1}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "After lunch, Harsh brings out the chessboard and challenges Dadi.", "Dopahar ke khaane ke baad, Harsh shatranj nikaalta hai aur Dadi ko chunauti deta hai."),
        L("Dadi", "Did you know chess began in India? There is an old story. A wise man invented the game, and the king offered him any reward.",
          "Jaante ho shatranj Bharat mein shuru hua tha? Ek purani kahani hai. Ek gyaani ne yeh khel banaya, aur raja ne use koi bhi inaam maangne ko kaha."),
    ], {"mode": "chess", "square": 1}),
    scene([
        L("Dadi", "He asked for rice: 1 grain on the first square, 2 on the second, 4 on the third, doubling every time.", "Usne chaawal maange: pehle khaane par 1 daana, doosre par 2, teesre par 4, har baar dugna."),
        L("Harsh", "That sounds tiny! The king must have laughed.", "Yeh toh bahut thoda lagta hai! Raja hans pada hoga."),
    ], {"mode": "chess", "square": 8}),
    scene([
        L("Dadi", "He did, at first. But by square 20, it is already more than five lakh grains.", "Pehle toh hansa. Lekin 20ve khaane tak hi paanch lakh se zyaada daane ho jaate hain."),
    ], {"mode": "chess", "square": 20}),
    scene([
        L("Disha", "And on square 64? Whoa, that number doesn't even fit!", "Aur 64ve khaane par? Baap re, yeh number toh fit hi nahi ho raha!"),
        L("Dadi", "More rice than the whole world grows in hundreds of years. That is the power of doubling.", "Itne chaawal jitne poori duniya saikdon saalon mein bhi nahi ugaati. Yahi dugna karne ki taakat hai."),
    ], {"mode": "chess", "square": 64}),
    scene([
        L("Dadi", "These numbers, 1, 2, 4, 8, 16, are the powers of 2. Now add them up. 1 plus 2 is 3. Plus 4 is 7. Plus 8 is 15.",
          "Yeh numbers, 1, 2, 4, 8, 16, powers of 2 kehlaate hain. Ab inhe jodo. 1 plus 2 barabar 3. Plus 4 barabar 7. Plus 8 barabar 15."),
        L("Disha", "Each total is one less than the next power of 2! 15 is one less than 16.", "Har total agle power of 2 se ek kam hai! 15, 16 se ek kam hai."),
    ], {"mode": "sum", "k": 4}),
    scene([
        L("Harsh", "I can see why! Add one more block and the whole row becomes exactly the next power.", "Mujhe samajh aa gaya kyon! Ek block aur jodo, toh poori kataar bilkul agla power ban jaati hai."),
    ], {"mode": "sum", "k": 5}),
    scene([
        L("Neha", "Try this. Fold a sheet of paper in half. 2 layers. Fold again, 4 layers. Again, 8!", "Yeh try karo. Ek kaagaz ko aadha modo. 2 parten. Phir modo, 4 parten. Phir se, 8!"),
        L("Harsh", "After 7 folds that is 128 layers. No wonder I can't fold it an eighth time!", "7 baar modne ke baad 128 parten. Tabhi toh main aathvi baar nahi mod paata!"),
    ], {"mode": "fold", "folds": 7}),
]

SCENES_5 = [
    scene([
        L("Narrator", "In the evening, Disha practises tabla, and Dadi recites old Sanskrit poetry.", "Shaam ko Disha tabla ka abhyaas karti hai, aur Dadi purani Sanskrit kavita sunaati hain."),
        L("Dadi", "In poetry, some syllables are short and take 1 beat. We'll call them ta. Others are long and take 2 beats. We'll call them taa.",
          "Kavita mein kuch akshar chhote hote hain aur 1 beat lete hain. Hum unhe ta kahenge. Kuch lambe hote hain aur 2 beat lete hain. Unhe taa kahenge."),
    ], {"n": 2}),
    scene([
        L("Dadi", "Over a thousand years ago, a poet and scholar named Virahānka asked: in how many ways can we fill a line of n beats?",
          "Hazaar saal se bhi pehle, Virahānka naam ke ek kavi aur vidvaan ne poocha: n beats ki ek line ko kitne tareekon se bhar sakte hain?"),
        L("Disha", "With 3 beats: ta ta ta, ta taa, or taa ta. That's 3 ways!", "3 beats mein: ta ta ta, ta taa, ya taa ta. Yaani 3 tareeke!"),
    ], {"n": 3}),
    scene([
        L("Harsh", "4 beats gives 5 ways, and 5 beats gives 8 ways!", "4 beats mein 5 tareeke, aur 5 beats mein 8 tareeke!"),
        L("Dadi", "The counts go 1, 2, 3, 5, 8, 13. These are the Virahānka numbers.", "Ginti chalti hai 1, 2, 3, 5, 8, 13. Yeh Virahānka numbers hain."),
    ], {"n": 5}),
    scene([
        L("Dadi", "Here is the secret. Every rhythm of 5 beats ends in either a short ta or a long taa. If it ends in ta, the rest is a rhythm of 4 beats. If it ends in taa, the rest is a rhythm of 3 beats.",
          "Raaz yeh hai. 5 beats ki har rhythm ya toh chhote ta par khatam hoti hai ya lambe taa par. Agar ta par, toh baaki 4 beats ki rhythm hai. Agar taa par, toh baaki 3 beats ki rhythm hai."),
        L("Disha", "So 5 plus 3 is 8! Each number is the sum of the two before it!", "Toh 5 plus 3 barabar 8! Har number apne pichhle do numbers ka jod hai!"),
    ], {"n": 5, "build": True}),
    scene([
        L("Dadi", "Virahānka described this around 700 CE, more than 500 years before the Italian mathematician Fibonacci wrote about the same numbers. Many people call them Fibonacci numbers, but Indian poets found them first!",
          "Virahānka ne yeh lagbhag 700 isvi mein bataaya, Italy ke mathematician Fibonacci se 500 se bhi zyaada saal pehle. Bahut log inhe Fibonacci numbers kehte hain, lekin Bharatiya kaviyon ne inhe pehle khoja!"),
    ], {"n": 6, "build": False}),
    scene([
        L("Dadi", "Your turn. Tap the play button on three different rhythms and listen to the beats.", "Ab aapki baari. Teen alag rhythms ka play button dabaao aur beats suno."),
    ], {"n": 4, "task": True}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "Next weekend, the whole family gathers for a reunion. Shapes are hiding patterns too.", "Agle weekend poora parivaar milne aata hai. Shapes mein bhi patterns chhupe hain."),
        L("Dadi", "Start with regular polygons: a triangle, a square, a pentagon, a hexagon. Their sides go 3, 4, 5, 6.",
          "Regular polygons se shuru karo: triangle, square, pentagon, hexagon. Inki sides 3, 4, 5, 6 hain."),
    ], {"pattern": "polygons"}),
    scene([
        L("Deepak", "When guests arrive, everyone shakes hands with everyone else, once. With 2 people that is 1 handshake. 3 people make 3. 4 people make 6.",
          "Jab mehmaan aate hain, toh har koi har kisi se ek baar haath milaata hai. 2 logon mein 1 handshake. 3 logon mein 3. 4 logon mein 6."),
        L("Disha", "0, 1, 3, 6, 10. Those are the triangular numbers again!", "0, 1, 3, 6, 10. Yeh toh phir se triangular numbers hain!"),
    ], {"pattern": "complete"}),
    scene([
        L("Neha", "My tiled kitchen floor: 1 tile, then a 2 by 2 square of 4, then 9, then 16.", "Mere kitchen ka tile wala farsh: 1 tile, phir 2 guna 2 ka square, 4 tiles, phir 9, phir 16."),
        L("Dadi", "Stacked squares give the square numbers.", "Stacked squares se square numbers milte hain."),
    ], {"pattern": "squares"}),
    scene([
        L("Harsh", "And if I split a big triangle into little triangles, I get 1, 4, 9, 16. Squares again!", "Aur agar main ek bade triangle ko chhote triangles mein baantoon, toh 1, 4, 9, 16. Phir se squares!"),
        L("Dadi", "Look at the rows: 1, 3, 5, 7 little triangles. Adding odd numbers gives squares, just like the laddoo trays!",
          "Kataarein dekho: 1, 3, 5, 7 chhote triangles. Odd numbers jodne se square milte hain, bilkul laddoo ki trays ki tarah!"),
    ], {"pattern": "triangles"}),
    scene([
        L("Disha", "I cut paper snowflakes! Start with a triangle, and on every side add a small bump.", "Main kaagaz ke snowflakes kaatti hoon! Triangle se shuru karo, aur har side par ek chhota ubhaar jodo."),
        L("Dadi", "That is the Koch snowflake. Each side becomes 4 smaller sides, so the number of sides goes 3, 12, 48, 192. Multiply by 4 every time.",
          "Yeh Koch snowflake hai. Har side 4 chhoti sides ban jaati hai, toh sides ki ginti chalti hai 3, 12, 48, 192. Har baar 4 se guna."),
    ], {"pattern": "koch"}),
    scene([
        L("Dadi", "Your turn. Find the shape pattern that gives the triangular numbers.", "Ab aapki baari. Woh shape pattern dhoondho jisse triangular numbers milte hain."),
    ], {"pattern": "polygons", "task": "complete"}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "At night, Dadi writes a pattern puzzle on the fridge whiteboard.", "Raat ko Dadi fridge ke whiteboard par ek pattern puzzle likhti hain."),
        L("Dadi", "Question 1. Find the sum of the first 10 odd numbers, without adding them one by one.", "Sawaal 1. Pehle 10 odd numbers ka jod nikaalo, bina ek ek karke jode."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "The first n odd numbers add up to n times n. Here n is 10, so the sum is 10 times 10, which is 100!", "Pehle n odd numbers ka jod n guna n hota hai. Yahan n barabar 10, toh jod 10 guna 10, yaani 100!"),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. What is the next Virahānka number after 8 and 13?", "Sawaal 2. 8 aur 13 ke baad agla Virahānka number kya hai?"),
        L("Harsh", "Add the two before it: 8 plus 13 is 21.", "Pichhle do ko jodo: 8 plus 13 barabar 21."),
    ], {"example": 1, "step": 2}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


PARTS = [
    {
        "title": "Story 1: Mummy's Laddoo Trays · What is Mathematics?",
        "readingTime": "~4 min story",
        "narrative": f"""
<div {STORY}>Sunday morning in Mummy's bakery. Laddoos sit in rows, pairs and L-shapes, and Dadi says every tray is hiding a pattern.</div>

<h2>Mathematics is the study of patterns</h2>
<p>Mathematicians look for patterns, explain <em>why</em> they happen, and use them to predict what comes next.</p>

<h2>The first number sequences</h2>
<div {CARD}>
  <div><strong class="text-amber-300">All 1s</strong>: 1, 1, 1, 1, …</div>
  <div><strong class="text-amber-300">Counting numbers</strong>: 1, 2, 3, 4, 5, …</div>
  <div><strong class="text-amber-300">Odd numbers</strong>: 1, 3, 5, 7, 9, … (L-shapes, each 2 more than the last)</div>
  <div><strong class="text-amber-300">Even numbers</strong>: 2, 4, 6, 8, 10, … (two equal rows)</div>
</div>
<p>Drawing numbers as pictures of dots shows <em>how</em> each one grows from the one before.</p>
""",
        "keyInsight": "A sequence becomes easy to continue once you see how each picture grows from the previous one.",
        "widgetType": "Class6NumberSequencesWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "What is the 10th odd number?",
            "options": ["10", "19", "20", "21"],
            "correctIndex": 1,
            "explanation": "The n-th odd number is 2n − 1, so the 10th is 2 × 10 − 1 = 19.",
        },
        "teacherNotes": teacher(
            [
                "Open with a question, not a definition: 'What do you think mathematics is about?' Then introduce 'the study of patterns'.",
                "Have students draw dot pictures for each sequence; the picture explains the rule better than words.",
            ],
            [
                "Continuing a sequence by guessing instead of finding the rule.",
                "Starting the odd numbers at 3 or the even numbers at 0 (follow the textbook convention: 1, 3, 5… and 2, 4, 6…).",
            ],
            "Pattern hunt: each group gets beads or bottle caps and must build the first four pictures of a sequence chosen from a hat; others guess the sequence.",
            "Ganita Prakash Ch. 1, 1.1–1.2 (What is mathematics? Patterns in numbers).",
        ),
    },
    {
        "title": "Story 2: Party Trays · Triangular, Square and Cube Numbers",
        "readingTime": "~4 min story",
        "narrative": f"""
<div {STORY}>For the party, Mummy stacks laddoos in triangles, square trays and cube-shaped gift boxes.</div>

<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Sequence</th><th class="text-left">Terms</th><th class="text-left">Picture</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Triangular</td><td>1, 3, 6, 10, 15, 21</td><td>Rows of 1, 2, 3, …</td></tr>
    <tr><td>Square</td><td>1, 4, 9, 16, 25, 36</td><td>n rows of n</td></tr>
    <tr><td>Cube</td><td>1, 8, 27, 64, 125</td><td>n × n × n blocks</td></tr>
  </tbody>
</table>
<div {FORMULA}>n-th square number = n × n      n-th cube number = n × n × n</div>
<p>Each triangular number is the previous one plus the next counting number: 1, 1 + 2 = 3, 3 + 3 = 6, 6 + 4 = 10, …</p>
""",
        "keyInsight": "Triangular numbers add the next counting number; square numbers are n × n; cube numbers are n × n × n.",
        "widgetType": "Class6NumberSequencesWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "Which number is BOTH a square number and a cube number?",
            "options": ["8", "16", "27", "64"],
            "correctIndex": 3,
            "explanation": "64 = 8 × 8 (square) and 64 = 4 × 4 × 4 (cube).",
        },
        "teacherNotes": teacher(
            [
                "Build triangular and square numbers with counters on the desk before showing the animation.",
                "For cube numbers, use sugar cubes or unit blocks: a 2 × 2 × 2 cube makes 8 obvious.",
            ],
            [
                "Confusing 'squaring' with 'doubling' (5² is 25, not 10).",
                "Thinking the n-th triangular number is n × 3.",
            ],
            "Number detective: list numbers up to 100 that are triangular, square or cube. Which numbers appear in two lists? (1, 36, 64…)",
            "Ganita Prakash Ch. 1, 1.3 (Visualising number sequences).",
        ),
    },
    {
        "title": "Story 3: Proof Lab · Why Odd Numbers Make Squares",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Dadi's promised surprise: the L-shaped trays of odd numbers fit together perfectly into squares.</div>

<h2>Relation 1 · Adding odd numbers</h2>
<div {FORMULA}>1 + 3 + 5 + … (first n odd numbers) = n × n</div>
<p><strong>Why:</strong> each odd number is an L-shape that wraps around the square before it, making it one size bigger.</p>

<h2>Relation 2 · Two triangles make a square</h2>
<div {FORMULA}>Two consecutive triangular numbers add up to a square number</div>
<p>6 + 10 = 16 = 4 × 4, because a triangle and the next smaller triangle fit together into a square.</p>

<h2>Relation 3 · Up and down</h2>
<div {FORMULA}>1 + 2 + … + n + … + 2 + 1 = n × n</div>
<p>Each number is one slanted line (diagonal) of the n × n square.</p>
""",
        "keyInsight": "A picture can prove a pattern: the L-shapes of odd numbers always wrap into a bigger square.",
        "widgetType": "Class6SquarePatternsWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "What is 1 + 3 + 5 + 7 + 9 + 11 + 13?",
            "options": ["36", "49", "64", "42"],
            "correctIndex": 1,
            "explanation": "These are the first 7 odd numbers, so the sum is 7 × 7 = 49.",
        },
        "teacherNotes": teacher(
            [
                "Have students physically wrap L-shapes of counters around a square to feel why it works.",
                "Emphasise that a picture that works for every size is a proof, not just an example.",
            ],
            [
                "Counting the number of odd numbers wrongly (1 to 13 is 7 odd numbers, not 13).",
                "Thinking two triangular numbers that are not next to each other also make a square.",
            ],
            "Grid paper proof: students colour 1, 3, 5, 7 cells as L-shapes in different colours on squared paper and write the matching equation under each square.",
            "Ganita Prakash Ch. 1, 1.4 (Relations among number sequences).",
        ),
    },
    {
        "title": "Story 4: The Chessboard Legend · The Power of Doubling",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Harsh challenges Dadi to chess, and Dadi tells the old Indian legend of the inventor who asked for rice: one grain, then two, then four…</div>

<h2>Powers of 2</h2>
<p>1, 2, 4, 8, 16, 32, 64, … each term is double the one before.</p>
<div {CARD}>
  <div>Grains on square 10: 512</div>
  <div>Grains on square 20: 5,24,288 (over five lakh)</div>
  <div>Grains on square 64: 9,223,372,036,854,775,808</div>
  <div class="text-pink-300">Total on the board: 18,446,744,073,709,551,615, more rice than the world grows in hundreds of years!</div>
</div>

<h2>A beautiful relation</h2>
<div {FORMULA}>1 + 2 + 4 + … + (a power of 2) = (next power of 2) − 1</div>
<p>1 + 2 + 4 + 8 = 15 = 16 − 1. Add one more and the whole row becomes the next power.</p>
<p><strong>Paper folding:</strong> every fold doubles the layers: 2, 4, 8, 16, 32, 64, 128.</p>
""",
        "keyInsight": "Doubling grows astonishingly fast, and 1 + 2 + 4 + … is always one less than the next power of 2.",
        "widgetType": "Class6DoublingWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "What is 1 + 2 + 4 + 8 + 16 + 32?",
            "options": ["62", "63", "64", "65"],
            "correctIndex": 1,
            "explanation": "The next power of 2 after 32 is 64, so the sum is 64 − 1 = 63.",
        },
        "teacherNotes": teacher(
            [
                "Tell the chessboard legend as a story and let students predict the 64th square before revealing it.",
                "Paper folding is a quick, memorable demonstration of doubling.",
            ],
            [
                "Adding 2 each time instead of doubling.",
                "Off-by-one errors: square n has 2 to the power (n − 1) grains, because square 1 has 1 grain.",
            ],
            "Fold challenge: how many times can a newspaper be folded? Record the layers each time and compare with 2, 4, 8, 16…",
            "Ganita Prakash Ch. 1 (powers of 2 sequence and relations).",
        ),
    },
    {
        "title": "Story 5: Disha's Tabla · Virahānka Numbers",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Disha practises tabla while Dadi recites Sanskrit poetry. Long and short beats hide one of the most famous patterns in mathematics.</div>

<h2>Counting rhythms</h2>
<p>A short syllable (<strong>ta</strong>) takes 1 beat; a long syllable (<strong>taa</strong>) takes 2 beats. How many rhythms fill n beats?</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Beats</th><th class="text-left">Rhythms</th><th>Count</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>1</td><td>ta</td><td class="text-center">1</td></tr>
    <tr><td>2</td><td>ta ta, taa</td><td class="text-center">2</td></tr>
    <tr><td>3</td><td>ta ta ta, ta taa, taa ta</td><td class="text-center">3</td></tr>
    <tr><td>4</td><td>…</td><td class="text-center">5</td></tr>
    <tr><td>5</td><td>…</td><td class="text-center">8</td></tr>
  </tbody>
</table>
<div {FORMULA}>Each Virahānka number = sum of the two before it: 1, 2, 3, 5, 8, 13, 21, 34, …</div>
<p><strong>Why:</strong> a rhythm of n beats ends in either ta (the rest has n − 1 beats) or taa (the rest has n − 2 beats).</p>
<p><strong>History:</strong> Virahānka described these numbers around 700 CE, more than 500 years before Fibonacci (1202 CE). Gopāla and Hemachandra wrote about them too.</p>
""",
        "keyInsight": "Rhythms of n beats = rhythms of (n − 1) beats + rhythms of (n − 2) beats.",
        "widgetType": "Class6VirahankaWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "What is the next Virahānka number after 13 and 21?",
            "options": ["29", "33", "34", "42"],
            "correctIndex": 2,
            "explanation": "Add the two before it: 13 + 21 = 34.",
        },
        "teacherNotes": teacher(
            [
                "Clap the rhythms: short clap for ta, a held clap for taa. Students enjoy listing all rhythms for 4 beats.",
                "Explain the 'last syllable' argument slowly; it is a genuine counting proof.",
                "Celebrate the Indian origin: Virahānka, Gopāla and Hemachandra described these numbers centuries before Fibonacci.",
            ],
            [
                "Missing or repeating rhythms when listing them. Encourage a system (start with all ta's, then move one taa along).",
                "Adding the previous number to itself instead of adding the two previous numbers.",
            ],
            "Rhythm circle: groups list every rhythm for 5 beats on cards, clap each one, and check they have exactly 8.",
            "Ganita Prakash Ch. 1 (Virahānka numbers).",
        ),
    },
    {
        "title": "Story 6: The Family Reunion · Patterns in Shapes",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>The whole family gathers for a reunion. Handshakes, floor tiles and Disha's paper snowflakes all follow number patterns.</div>

<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Shape sequence</th><th class="text-left">Counts</th><th class="text-left">Number sequence</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Regular polygons</td><td>3, 4, 5, 6 sides</td><td>Counting numbers from 3</td></tr>
    <tr><td>Handshakes (complete graphs)</td><td>0, 1, 3, 6, 10 lines</td><td>Triangular numbers</td></tr>
    <tr><td>Stacked squares</td><td>1, 4, 9, 16 squares</td><td>Square numbers</td></tr>
    <tr><td>Stacked triangles</td><td>1, 4, 9, 16 triangles</td><td>Square numbers</td></tr>
    <tr><td>Koch snowflake</td><td>3, 12, 48, 192 sides</td><td>× 4 each time</td></tr>
  </tbody>
</table>
<p>Shapes and numbers are connected: counting parts of a shape pattern often gives a number pattern we already know.</p>
""",
        "keyInsight": "Count something in a shape pattern and a familiar number sequence usually appears.",
        "widgetType": "Class6ShapePatternsWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "At a party, 6 people each shake hands with everyone else once. How many handshakes?",
            "options": ["12", "15", "30", "36"],
            "correctIndex": 1,
            "explanation": "Handshakes follow the triangular numbers: 0, 1, 3, 6, 10, 15. With 6 people: 15.",
        },
        "teacherNotes": teacher(
            [
                "Act out the handshakes with 2, 3, 4 and 5 volunteers and record the counts.",
                "Draw the first two Koch steps on the board so students see one side turn into four.",
            ],
            [
                "Double counting handshakes (A with B and B with A is one handshake).",
                "In the Koch snowflake, adding 4 sides instead of multiplying by 4.",
            ],
            "Handshake experiment: groups of 2 to 6 students count their handshakes and fill a class table; then predict 10 people (45).",
            "Ganita Prakash Ch. 1, 1.5–1.6 (Patterns in shapes; relation to number sequences).",
        ),
    },
    {
        "title": "Solved Questions · 10 pattern problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>At night, Dadi writes pattern puzzles on the fridge whiteboard. Harsh and Disha race to crack each one.</div>
<h2>Pattern toolkit</h2>
<ol>
  <li>Sum of the first n odd numbers = n × n</li>
  <li>Triangular numbers: add the next counting number each time</li>
  <li>Square: n × n, cube: n × n × n</li>
  <li>1 + 2 + 4 + … = next power of 2 − 1</li>
  <li>Virahānka: add the two previous numbers</li>
</ol>
<p>Try each question in your notebook before revealing the steps.</p>
""",
        "keyInsight": "First identify which pattern the question uses, then apply its rule.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {"title": "Sum of odd numbers", "question": "Find the sum of the first 10 odd numbers without adding them one by one.",
                 "steps": ["The first n odd numbers add up to n × n.", "Here n = 10.", "Sum = 10 × 10 = <strong>100</strong>"], "answer": "100"},
                {"title": "Next Virahānka number", "question": "What comes after 8 and 13 in the Virahānka numbers?",
                 "steps": ["Each number is the sum of the two before it.", "8 + 13 = <strong>21</strong>"], "answer": "21"},
                {"title": "The 7th triangular number", "question": "Find the 7th triangular number.",
                 "steps": ["Triangular numbers: 1, 3, 6, 10, 15, 21, …", "Each time add the next counting number: 21 + 7 = <strong>28</strong>"], "answer": "28"},
                {"title": "Sum of powers of 2", "question": "Find 1 + 2 + 4 + 8 + 16 + 32 + 64.",
                 "steps": ["The next power of 2 after 64 is 128.", "Sum = 128 − 1 = <strong>127</strong>"], "answer": "127"},
                {"title": "Square or cube?", "question": "Is 64 a square number, a cube number, or both?",
                 "steps": ["8 × 8 = 64, so it is a square number.", "4 × 4 × 4 = 64, so it is also a cube number.", "<strong>Both</strong>"], "answer": "Both a square and a cube"},
                {"title": "Up and down", "question": "Find 1 + 2 + 3 + 4 + 5 + 6 + 5 + 4 + 3 + 2 + 1.",
                 "steps": ["Counting up to 6 and back down gives 6 × 6.", "= <strong>36</strong>"], "answer": "36"},
                {"title": "Handshakes", "question": "8 friends each shake hands with every other friend once. How many handshakes?",
                 "steps": ["Handshakes follow the triangular numbers: 0, 1, 3, 6, 10, 15, 21, 28.", "With 8 people the count is the 7th triangular number.", "= <strong>28</strong>"], "answer": "28 handshakes"},
                {"title": "Koch snowflake", "question": "A Koch snowflake starts with 3 sides. How many sides after 3 steps?",
                 "steps": ["Each step multiplies the sides by 4.", "3 → 12 → 48 → 192", "After 3 steps: <strong>192</strong> sides"], "answer": "192"},
                {"title": "Two triangles", "question": "Which square number do the triangular numbers 15 and 21 make together?",
                 "steps": ["15 + 21 = 36", "36 = 6 × 6, a square number ✔"], "answer": "36 (6 × 6)"},
                {"title": "Chessboard rice", "question": "How many grains are on the 11th square if the 1st square has 1 grain and each square doubles?",
                 "steps": ["Square 1: 1, square 2: 2, square 3: 4, …", "Square n has 2 multiplied by itself (n − 1) times.", "Square 11: 2 × 2 × … (10 times) = <strong>1024</strong>"], "answer": "1024 grains"},
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            ["Ask students to name the pattern before solving; most mistakes come from using the wrong rule."],
            ["Off-by-one errors in Q7 (8 people → 28, not 36) and Q10 (11th square → 2 multiplied 10 times)."],
            "Make your own pattern: each student invents a sequence with a picture rule; partners must find the next two terms.",
            "Covers Ganita Prakash Ch. 1 exercises.",
        ),
    },
    {
        "title": "Chapter Exam · Patterns in Mathematics (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From laddoo trays to tabla rhythms, you have found patterns everywhere. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> on number sequences, picture proofs, powers of 2, Virahānka numbers and shape patterns.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Spot the rule first, then predict.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Patterns in Mathematics · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "What comes next: 1, 4, 9, 16, 25, …?", "options": ["30", "36", "35", "49"], "answer": 1, "explanation": "Square numbers: 6 × 6 = 36.", "topic": "Square numbers"},
                {"q": "What comes next: 1, 3, 6, 10, 15, …?", "options": ["20", "21", "25", "18"], "answer": 1, "explanation": "Triangular numbers: 15 + 6 = 21.", "topic": "Triangular numbers"},
                {"q": "1 + 3 + 5 + 7 + 9 + 11 = ?", "options": ["30", "36", "42", "49"], "answer": 1, "explanation": "The first 6 odd numbers add up to 6 × 6 = 36.", "topic": "Odd numbers make squares"},
                {"q": "Which is a cube number?", "options": ["9", "16", "27", "36"], "answer": 2, "explanation": "27 = 3 × 3 × 3.", "topic": "Cube numbers"},
                {"q": "1 + 2 + 4 + 8 + 16 = ?", "options": ["30", "31", "32", "33"], "answer": 1, "explanation": "Next power of 2 is 32, so the sum is 32 − 1 = 31.", "topic": "Powers of 2"},
                {"q": "Next Virahānka number: 1, 2, 3, 5, 8, 13, …", "options": ["18", "20", "21", "26"], "answer": 2, "explanation": "8 + 13 = 21.", "topic": "Virahānka numbers"},
                {"q": "How many rhythms of short (1 beat) and long (2 beats) syllables fill 4 beats?", "options": ["4", "5", "6", "8"], "answer": 1, "explanation": "The Virahānka number for 4 beats is 5.", "topic": "Virahānka rhythms"},
                {"q": "5 people each shake hands with everyone else once. How many handshakes?", "options": ["10", "15", "20", "25"], "answer": 0, "explanation": "Triangular numbers: 0, 1, 3, 6, 10. Five people make 10 handshakes.", "topic": "Handshakes"},
                {"q": "Two consecutive triangular numbers, 10 and 15, add up to:", "options": ["20", "25", "30", "36"], "answer": 1, "explanation": "10 + 15 = 25 = 5 × 5, a square number.", "topic": "Two triangles make a square"},
                {"q": "A Koch snowflake has 48 sides. After one more step it has:", "options": ["52", "96", "144", "192"], "answer": 3, "explanation": "Each step multiplies the sides by 4: 48 × 4 = 192.", "topic": "Koch snowflake"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students to the right story."],
            ["Q3 and Q9 test the picture proofs; Q7 tests understanding of Virahānka rhythms, not just the sequence."],
            "Exit ticket: write one number pattern you found at home this week and its rule.",
            "Matches Ganita Prakash Ch. 1 learning outcomes.",
        ),
    },
]


def seed_class6_patterns():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Patterns in Mathematics")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Patterns in Mathematics: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Patterns in Mathematics: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_patterns()
