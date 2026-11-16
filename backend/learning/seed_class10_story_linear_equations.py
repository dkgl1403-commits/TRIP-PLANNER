import json
from db import SessionLocal
from seed_class10_structure import get_class10_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 10 · Pair of Linear Equations in Two Variables (NCERT Class 10 Mathematics, Chapter 3, rationalised
# syllabus 2023-24 onward): linear equations in two variables, the graphical method (intersecting, coincident
# and parallel lines; consistent, dependent and inconsistent pairs), the ratio test a1/a2, b1/b2, c1/c2, the
# substitution method, the elimination method and word problems. Cross-multiplication and "equations reducible
# to a pair of linear equations" are deleted from the current syllabus and are left out.
#
# Story: Harsh (16) and Disha (15) prepare for the boards with the family in Jaipur: Mummy's shop, a railway
# yard with Papa, a cricket kit shop, Diwali sweet orders and Dadi's word-problem evenings.
# No outside real-world statistics are used: all prices, ages and scores are made-up story numbers.


def _triangle_svg():
    """Figure for solved question 10: x - y + 1 = 0, 3x + 2y - 12 = 0 and the x-axis."""
    def sx(x):
        return 40 + (x + 2) * 34

    def sy(y):
        return 190 - y * 34
    return f"""<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" style="max-width:300px">
<rect width="300" height="220" fill="#0b1222"/>
<line x1="{sx(-2)}" y1="{sy(0)}" x2="{sx(6)}" y2="{sy(0)}" stroke="#64748b" stroke-width="1.5"/>
<line x1="{sx(0)}" y1="{sy(-0.5)}" x2="{sx(0)}" y2="{sy(5)}" stroke="#64748b" stroke-width="1.5"/>
<polygon points="{sx(-1)},{sy(0)} {sx(2)},{sy(3)} {sx(4)},{sy(0)}" fill="#34d399" fill-opacity="0.25"/>
<line x1="{sx(-1.5)}" y1="{sy(-0.5)}" x2="{sx(3.5)}" y2="{sy(4.5)}" stroke="#fbbf24" stroke-width="2.5"/>
<line x1="{sx(1)}" y1="{sy(4.5)}" x2="{sx(4.333)}" y2="{sy(-0.5)}" stroke="#38bdf8" stroke-width="2.5"/>
<circle cx="{sx(2)}" cy="{sy(3)}" r="4" fill="#34d399"/><text x="{sx(2) + 8}" y="{sy(3) - 4}" fill="#34d399" font-size="12" font-family="monospace">(2, 3)</text>
<circle cx="{sx(-1)}" cy="{sy(0)}" r="4" fill="#f472b6"/><text x="{sx(-1) - 10}" y="{sy(0) + 16}" fill="#f472b6" font-size="12" font-family="monospace">(-1, 0)</text>
<circle cx="{sx(4)}" cy="{sy(0)}" r="4" fill="#f472b6"/><text x="{sx(4) - 6}" y="{sy(0) + 16}" fill="#f472b6" font-size="12" font-family="monospace">(4, 0)</text>
<text x="{sx(3.5) - 70}" y="{sy(4.5) + 4}" fill="#fbbf24" font-size="11" font-family="monospace">x - y + 1 = 0</text>
<text x="{sx(1) + 14}" y="{sy(4.5) + 6}" fill="#38bdf8" font-size="11" font-family="monospace">3x + 2y - 12 = 0</text>
</svg>"""


# ─────────────────────────────── Scenes ───────────────────────────────

G1 = {"range": [0, 50, 0, 45], "grid": 5, "tick": 10}

SCENES_1 = [
    scene([
        L("Narrator", "The board exams are three months away. After school, Harsh and Disha study at the counter of Mummy's small snack shop in Jaipur.",
          "Board exams teen mahine door hain. School ke baad Harsh aur Disha Jaipur mein Mummy ki chhoti si snack shop ke counter par padhte hain."),
        L("Neha", "Harsh, you bought 2 samosas and 1 kachori and paid 40 rupees. Can you tell me the price of each from that alone?",
          "Harsh, tumne 2 samose aur 1 kachori li aur 40 rupaye diye. Kya sirf isse tum har cheez ka daam bata sakte ho?"),
        L("Dadi", "Let x be the price of a samosa and y the price of a kachori. Then 2 x plus y equals 40. That is a linear equation in two variables.",
          "Maan lo samose ka daam x hai aur kachori ka y. Toh 2 x plus y barabar 40. Yeh do variables wali linear equation hai."),
    ], {**G1, "eqs": [[2, 1, 40]], "caption": ["x = samosa price (₹)", "y = kachori price (₹)"]}),
    scene([
        L("Disha", "Samosa 10 and kachori 20 works, because 2 times 10 plus 20 is 40. But samosa 15 and kachori 10 also works!",
          "Samosa 10 aur kachori 20 chalta hai, kyunki 2 guna 10 plus 20 barabar 40. Lekin samosa 15 aur kachori 10 bhi chalta hai!"),
        L("Dadi", "Exactly. A solution is a pair of values, x and y together, that makes the equation true. One such equation has many solutions.",
          "Bilkul. Solution ek pair hota hai, x aur y saath mein, jo equation ko sach banaaye. Aisi ek equation ke bahut saare solutions hote hain."),
    ], {**G1, "eqs": [[2, 1, 40]], "points": [[10, 20], [15, 10]]}),
    scene([
        L("Dadi", "Let us plot more pairs: 0 and 40, 5 and 30, 10 and 20, 15 and 10, 20 and 0. Look, every point sits on one straight line!",
          "Chalo aur pairs plot karte hain: 0 aur 40, 5 aur 30, 10 aur 20, 15 aur 10, 20 aur 0. Dekho, har point ek hi seedhi line par baitha hai!"),
        L("Harsh", "So that is why it is called linear. Its graph is a line.", "Toh isiliye ise linear kehte hain. Iska graph ek line hai."),
    ], {**G1, "eqs": [[2, 1, 40]], "points": [[0, 40], [5, 30], [10, 20], [15, 10], [20, 0]]}),
    scene([
        L("Dadi", "In general we write a x plus b y plus c equals 0, where a, b and c are real numbers and a and b are not both zero.",
          "General roop mein hum likhte hain a x plus b y plus c barabar 0, jahaan a, b aur c real numbers hain aur a aur b dono zero nahi hain."),
        L("Dadi", "Every point on the line is a solution, and every solution is a point on the line. A line has infinitely many points, so one equation has infinitely many solutions.",
          "Line ka har point ek solution hai, aur har solution line ka ek point hai. Line par anginat points hote hain, isliye ek equation ke anginat solutions hote hain."),
    ], {**G1, "eqs": [[2, 1, 40]], "points": [[0, 40], [5, 30], [10, 20], [15, 10], [20, 0]], "caption": ["ax + by + c = 0", "a, b not both zero"]}),
    scene([
        L("Neha", "Now Disha's bill. She bought 1 samosa and 2 kachoris for 50 rupees.", "Ab Disha ka bill. Usne 1 samosa aur 2 kachori 50 rupaye mein li."),
        L("Disha", "So x plus 2 y equals 50. That is a second line. Two equations in the same two unknowns make a pair of linear equations.",
          "Toh x plus 2 y barabar 50. Yeh doosri line hai. Same do unknowns mein do equations milkar pair of linear equations banaati hain."),
    ], {**G1, "eqs": [[2, 1, 40], [1, 2, 50]], "verdict": False}),
    scene([
        L("Harsh", "The two lines cross at 10 and 20. So a samosa costs 10 rupees and a kachori 20 rupees!", "Dono lines 10 aur 20 par kaatti hain. Toh samosa 10 rupaye ka aur kachori 20 rupaye ki!"),
        L("Neha", "Correct! Check Disha's bill: 10 plus 2 times 20 is 50. Only this one pair fits both bills.", "Sahi! Disha ka bill check karo: 10 plus 2 guna 20 barabar 50. Sirf yahi ek pair dono bills mein fit hota hai."),
        L("Dadi", "The solution of the pair is the point common to both lines.", "Pair ka solution woh point hai jo dono lines par common hai."),
    ], {**G1, "eqs": [[2, 1, 40], [1, 2, 50]], "meet": True}),
    scene([
        L("Dadi", "Your turn! Drag the green dot onto the amber line, at the point where x is 15. Watch the check on the right.",
          "Ab aapki baari! Hare dot ko amber line par us point tak le jaao jahaan x 15 hai. Daayein taraf ka check dekho."),
    ], {**G1, "eqs": [[2, 1, 40]], "drag": True, "dot": [30, 30], "snap": 5,
        "task": {"type": "point", "x": 15, "y": 10, "text": "Put the dot on the line 2x + y = 40 where x = 15."}}, wait=True),
]

G2 = {"range": [-1, 8, -1, 8], "grid": 1, "tick": 2}

SCENES_2 = [
    scene([
        L("Narrator", "On Sunday, Papa takes Harsh and Disha to see a railway yard, where tracks cross and split.",
          "Itvaar ko Papa Harsh aur Disha ko ek railway yard dikhaane le jaate hain, jahaan tracks kaatte aur alag hote hain."),
        L("Deepak", "On my drawing, one track follows x plus y equals 5 and the other follows 2 x minus y equals 4. They cross at one junction point.",
          "Meri drawing mein ek track x plus y barabar 5 par chalta hai aur doosra 2 x minus y barabar 4 par. Woh ek junction point par kaatte hain."),
    ], {**G2, "eqs": [[1, 1, 5], [2, -1, 4]], "meet": True}),
    scene([
        L("Dadi", "To draw each line, make a small table. For x plus y equals 5, take 0 and 5, and 5 and 0. For 2 x minus y equals 4, take 2 and 0, and 4 and 4.",
          "Har line banaane ke liye chhoti table banao. x plus y barabar 5 ke liye 0 aur 5, aur 5 aur 0 lo. 2 x minus y barabar 4 ke liye 2 aur 0, aur 4 aur 4 lo."),
        L("Disha", "They meet at 3 and 2. Check: 3 plus 2 is 5, and 6 minus 2 is 4. One solution, x is 3 and y is 2!",
          "Woh 3 aur 2 par milti hain. Check: 3 plus 2 barabar 5, aur 6 minus 2 barabar 4. Ek solution, x 3 aur y 2!"),
        L("Dadi", "Intersecting lines give exactly one solution. Such a pair is called consistent.", "Kaatne wali lines se theek ek solution milta hai. Aise pair ko consistent kehte hain."),
    ], {**G2, "eqs": [[1, 1, 5], [2, -1, 4]], "meet": True, "points": [[0, 5], [5, 0], [2, 0], [4, 4]]}),
    scene([
        L("Deepak", "Now two rails of one straight track: x plus 2 y equals 4, and 2 x plus 4 y equals 12. They run side by side and never meet.",
          "Ab ek seedhe track ki do patriyaan: x plus 2 y barabar 4, aur 2 x plus 4 y barabar 12. Woh saath saath chalti hain aur kabhi nahi milti."),
        L("Harsh", "If they met, the train would fall off! So no point is on both lines.", "Agar mil jaayein toh train gir jaayegi! Toh koi bhi point dono lines par nahi hai."),
    ], {**G2, "eqs": [[1, 2, 4], [2, 4, 12]]}),
    scene([
        L("Disha", "Why are they parallel? Why?", "Yeh parallel kyun hain? Kyun?"),
        L("Dadi", "Divide the second equation by 2. It becomes x plus 2 y equals 6. Same left side, but 4 on one line and 6 on the other. Nothing can equal 4 and 6 at once.",
          "Doosri equation ko 2 se divide karo. Woh x plus 2 y barabar 6 ban jaati hai. Left side same, lekin ek line par 4 aur doosri par 6. Koi cheez ek saath 4 aur 6 nahi ho sakti."),
        L("Dadi", "Parallel lines mean no solution. Such a pair is called inconsistent.", "Parallel lines ka matlab koi solution nahi. Aise pair ko inconsistent kehte hain."),
    ], {**G2, "eqs": [[1, 2, 4], [2, 4, 12]], "caption": ["2x + 4y = 12", "is x + 2y = 6"]}),
    scene([
        L("Deepak", "Third case. On my plan, 2 x plus 3 y equals 9 and 4 x plus 6 y equals 18. Draw them and see.",
          "Teesra case. Mere plan par 2 x plus 3 y barabar 9 aur 4 x plus 6 y barabar 18. Banaao aur dekho."),
        L("Harsh", "There is only one line! The blue one lies right on top of the amber one.", "Yahaan toh ek hi line hai! Neeli line amber line ke theek upar padi hai."),
    ], {**G2, "eqs": [[2, 3, 9], [4, 6, 18]]}),
    scene([
        L("Dadi", "The second equation is just the first one times 2. The lines coincide, so every point of one is on the other. Infinitely many solutions.",
          "Doosri equation bas pehli ki 2 guna hai. Lines coincide karti hain, toh ek ka har point doosri par hai. Anginat solutions."),
        L("Dadi", "Such a pair is called dependent, and it is also consistent. Consistent simply means at least one solution.",
          "Aise pair ko dependent kehte hain, aur yeh consistent bhi hai. Consistent ka matlab hai kam se kam ek solution."),
    ], {**G2, "eqs": [[2, 3, 9], [4, 6, 18]], "caption": ["consistent: at least", "one solution"]}),
    scene([
        L("Deepak", "Your turn, junior engineer! Line 1 is x plus 2 y equals 4. Move the right hand side slider of line 2 until the two lines become one.",
          "Ab aapki baari, junior engineer! Line 1 hai x plus 2 y barabar 4. Line 2 ka right hand side slider tab tak khiskao jab tak dono lines ek na ho jaayein."),
    ], {**G2, "eqs": [[1, 2, 4], [2, 4, 12]], "sliders": True,
        "task": {"type": "coincident", "text": "Make the two lines coincident (one on top of the other)."}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "Back home, Disha has a tall pile of practice questions and no time to draw a graph for each one.",
          "Ghar par, Disha ke paas practice questions ka bada dher hai aur har ek ka graph banaane ka time nahi hai."),
        L("Disha", "Dadi, can we know the type of lines without drawing them?", "Dadi, kya bina banaaye hum lines ka type jaan sakte hain?"),
        L("Dadi", "Yes. Write both in the form a x plus b y plus c equals 0, and compare the coefficients as ratios.",
          "Haan. Dono ko a x plus b y plus c barabar 0 ke roop mein likho, aur coefficients ko ratios mein compare karo."),
    ], {"e1": [5, -4, -8], "e2": [7, 6, 9], "step": 0}),
    scene([
        L("Dadi", "Take 5 x minus 4 y plus 8 equals 0 and 7 x plus 6 y minus 9 equals 0. First a1 over a2 is 5 over 7. Then b1 over b2 is minus 4 over 6, which is minus 2 over 3.",
          "Lo 5 x minus 4 y plus 8 barabar 0 aur 7 x plus 6 y minus 9 barabar 0. Pehle a1 bata a2 hai 5 bata 7. Phir b1 bata b2 hai minus 4 bata 6, yaani minus 2 bata 3."),
    ], {"e1": [5, -4, -8], "e2": [7, 6, 9], "step": 2}),
    scene([
        L("Harsh", "5 over 7 is not equal to minus 2 over 3. So the lines have different slopes and must cross!",
          "5 bata 7, minus 2 bata 3 ke barabar nahi hai. Toh lines ki dhalaan alag hai aur woh zaroor kaatengi!"),
        L("Dadi", "Right. When a1 over a2 is not equal to b1 over b2, the lines intersect: a unique solution, a consistent pair.",
          "Sahi. Jab a1 bata a2, b1 bata b2 ke barabar nahi hota, lines kaatti hain: ek hi solution, consistent pair."),
    ], {"e1": [5, -4, -8], "e2": [7, 6, 9], "step": 4}),
    scene([
        L("Disha", "Next, 9 x plus 3 y plus 12 equals 0 and 18 x plus 6 y plus 24 equals 0. All three ratios are 1 over 2!",
          "Agla, 9 x plus 3 y plus 12 barabar 0 aur 18 x plus 6 y plus 24 barabar 0. Teeno ratios 1 bata 2 hain!"),
        L("Dadi", "When all three ratios are equal, one equation is a multiple of the other. The lines coincide: infinitely many solutions, a dependent pair.",
          "Jab teeno ratios barabar hon, toh ek equation doosri ka multiple hai. Lines coincide karti hain: anginat solutions, dependent pair."),
    ], {"e1": [9, 3, -12], "e2": [18, 6, -24], "step": 4}),
    scene([
        L("Harsh", "Last one: 6 x minus 3 y plus 10 equals 0 and 2 x minus y plus 9 equals 0. a1 over a2 is 3, b1 over b2 is also 3, but c1 over c2 is 10 over 9.",
          "Aakhri: 6 x minus 3 y plus 10 barabar 0 aur 2 x minus y plus 9 barabar 0. a1 bata a2 hai 3, b1 bata b2 bhi 3, lekin c1 bata c2 hai 10 bata 9."),
        L("Dadi", "Same tilt, different place. The lines are parallel: no solution, an inconsistent pair.", "Dhalaan same, jagah alag. Lines parallel hain: koi solution nahi, inconsistent pair."),
    ], {"e1": [6, -3, -10], "e2": [2, -1, -9], "step": 4}),
    scene([
        L("Dadi", "So remember three rules. Ratios of a and b unequal, the lines intersect. All three equal, they coincide. a and b equal but c different, they are parallel.",
          "Toh teen rules yaad rakho. a aur b ke ratios alag, toh lines kaatti hain. Teeno barabar, toh coincide. a aur b barabar lekin c alag, toh parallel."),
        L("Disha", "And the graph on the right always agrees with the ratio test.", "Aur daayein taraf ka graph hamesha ratio test se sehmat hota hai."),
    ], {"e1": [6, -3, -10], "e2": [2, -1, -9], "step": 4}),
    scene([
        L("Dadi", "Your turn! The first line is x plus 2 y minus 3 equals 0. Use the sliders to make the second line parallel to it, so the pair has no solution.",
          "Ab aapki baari! Pehli line hai x plus 2 y minus 3 barabar 0. Sliders se doosri line ko iske parallel banao, taaki pair ka koi solution na ho."),
    ], {"e1": [1, 2, 3], "e2": [3, 1, 4], "step": 4, "sliders": True,
        "task": {"type": "parallel", "text": "Make the pair inconsistent: a1/a2 = b1/b2 ≠ c1/c2."}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "Before the school cricket match, Harsh visits a sports shop with Papa.", "School ke cricket match se pehle Harsh Papa ke saath ek sports shop jaata hai."),
        L("Harsh", "The shopkeeper says a bat costs 300 rupees more than a ball, and one bat with three balls costs 700 rupees.",
          "Dukaandaar kehta hai ki bat ball se 300 rupaye mehenga hai, aur ek bat ke saath teen balls 700 rupaye ki hain."),
        L("Deepak", "Let the bat cost x and a ball cost y. Then x minus y equals 300, and x plus 3 y equals 700.",
          "Maan lo bat x ka hai aur ball y ki. Toh x minus y barabar 300, aur x plus 3 y barabar 700."),
    ], {"problem": "bat", "step": 0}),
    scene([
        L("Dadi", "Graphs are slow and can be inexact. Here is an algebra method called substitution. Step 1: from the easier equation, write one variable in terms of the other.",
          "Graph dheere bante hain aur kabhi kabhi exact nahi hote. Yeh ek algebra method hai jise substitution kehte hain. Step 1: aasaan equation se ek variable ko doosre ke roop mein likho."),
        L("Harsh", "From the first equation, x equals y plus 300.", "Pehli equation se, x barabar y plus 300."),
    ], {"problem": "bat", "step": 1}),
    scene([
        L("Dadi", "Step 2: put this value of x into the other equation. Wherever you see x, write y plus 300.",
          "Step 2: x ki yeh value doosri equation mein daalo. Jahaan bhi x dikhe, y plus 300 likho."),
        L("Disha", "Now the equation has only y in it. One equation, one unknown!", "Ab equation mein sirf y hai. Ek equation, ek unknown!"),
    ], {"problem": "bat", "step": 2}),
    scene([
        L("Disha", "4 y plus 300 equals 700, so 4 y is 400, and y is 100. A ball costs 100 rupees.",
          "4 y plus 300 barabar 700, toh 4 y barabar 400, aur y barabar 100. Ek ball 100 rupaye ki hai."),
    ], {"problem": "bat", "step": 4}),
    scene([
        L("Harsh", "Step 3: put y back. x equals 100 plus 300, which is 400. The bat costs 400 rupees!",
          "Step 3: y ko waapas daalo. x barabar 100 plus 300, yaani 400. Bat 400 rupaye ka hai!"),
        L("Deepak", "And check in the second equation: 400 plus 3 times 100 is 700. Correct.", "Aur doosri equation mein check karo: 400 plus 3 guna 100 barabar 700. Sahi."),
    ], {"problem": "bat", "step": 6}),
    scene([
        L("Dadi", "Look at the small graph. The algebra answer is exactly the point where the two lines meet. Substitution just finds it without drawing.",
          "Chhota graph dekho. Algebra ka answer theek woh point hai jahaan dono lines milti hain. Substitution use bina banaaye dhoondh leta hai."),
        L("Dadi", "If you ever get a false statement like 5 equals 7, the lines are parallel. If you get something always true like 0 equals 0, they coincide.",
          "Agar kabhi galat statement mile jaise 5 barabar 7, toh lines parallel hain. Agar hamesha sach wali baat mile jaise 0 barabar 0, toh woh coincide karti hain."),
    ], {"problem": "bat", "step": 6}),
    scene([
        L("Dadi", "A board question: solve 2 x plus 3 y equals 11 and 2 x minus 4 y equals minus 24. Here 2 x is easy to replace.",
          "Ek board sawaal: 2 x plus 3 y barabar 11 aur 2 x minus 4 y barabar minus 24 solve karo. Yahaan 2 x ko badalna aasaan hai."),
    ], {"problem": "board", "step": 2}),
    scene([
        L("Dadi", "Your turn! Finish the working in your notebook, then type the values of x and y to check them.",
          "Ab aapki baari! Notebook mein working poori karo, phir check karne ke liye x aur y ki values type karo."),
    ], {"problem": "board", "step": 2, "task": {"text": "Solve 2x + 3y = 11 and 2x − 4y = −24, and enter x and y."}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "Diwali week. Mummy's shop is full of sweet boxes, and two customers have left their bills on the counter.",
          "Diwali ka hafta. Mummy ki shop mithai ke dabbon se bhari hai, aur do grahakon ke bill counter par pade hain."),
        L("Neha", "One customer paid 1,550 rupees for 2 kaju boxes and 3 besan boxes. Another paid 1,700 rupees for 3 kaju boxes and 2 besan boxes.",
          "Ek grahak ne 2 kaju dabbe aur 3 besan dabbe ke 1,550 rupaye diye. Doosre ne 3 kaju aur 2 besan dabbe ke 1,700 rupaye diye."),
        L("Disha", "So 2 x plus 3 y equals 1,550, and 3 x plus 2 y equals 1,700. Nothing here is easy to substitute.",
          "Toh 2 x plus 3 y barabar 1,550, aur 3 x plus 2 y barabar 1,700. Yahaan substitute karna aasaan nahi hai."),
    ], {"problem": "sweets", "m1": 1, "m2": 1, "step": 0}),
    scene([
        L("Dadi", "Then use elimination. Step 1: multiply the equations so one variable gets the same coefficient. Multiply the first by 3 and the second by 2.",
          "Toh elimination use karo. Step 1: equations ko aise multiply karo ki ek variable ka coefficient barabar ho jaaye. Pehli ko 3 se aur doosri ko 2 se multiply karo."),
        L("Harsh", "Now both have 6 x!", "Ab dono mein 6 x hai!"),
    ], {"problem": "sweets", "m1": 3, "m2": 2, "step": 1}),
    scene([
        L("Dadi", "Step 2: subtract one equation from the other. The 6 x cancels, and x is eliminated.", "Step 2: ek equation ko doosri se ghatao. 6 x cancel ho jaata hai, aur x eliminate ho gaya."),
        L("Disha", "9 y minus 4 y is 5 y, and 4,650 minus 3,400 is 1,250. So 5 y equals 1,250.", "9 y minus 4 y barabar 5 y, aur 4,650 minus 3,400 barabar 1,250. Toh 5 y barabar 1,250."),
    ], {"problem": "sweets", "m1": 3, "m2": 2, "step": 2}),
    scene([
        L("Disha", "Step 3: y equals 1,250 divided by 5, which is 250. A besan box costs 250 rupees.", "Step 3: y barabar 1,250 bhaag 5, yaani 250. Besan ka dabba 250 rupaye ka."),
    ], {"problem": "sweets", "m1": 3, "m2": 2, "step": 3}),
    scene([
        L("Harsh", "Step 4: put y equals 250 into the first equation. 2 x plus 750 equals 1,550, so 2 x is 800 and x is 400.",
          "Step 4: y barabar 250 pehli equation mein daalo. 2 x plus 750 barabar 1,550, toh 2 x barabar 800 aur x barabar 400."),
        L("Neha", "Yes! Kaju boxes are 400 rupees and besan boxes 250 rupees. And 3 times 400 plus 2 times 250 is 1,700.",
          "Haan! Kaju dabba 400 rupaye aur besan dabba 250 rupaye. Aur 3 guna 400 plus 2 guna 250 barabar 1,700."),
    ], {"problem": "sweets", "m1": 3, "m2": 2, "step": 4}),
    scene([
        L("Dadi", "Now the railway pair from Sunday: 2 x plus 4 y equals 12 and x plus 2 y equals 4. Multiply the second by 2 and subtract.",
          "Ab Itvaar wala railway pair: 2 x plus 4 y barabar 12 aur x plus 2 y barabar 4. Doosri ko 2 se multiply karke ghatao."),
        L("Harsh", "Both x and y vanish and I get 0 equals 4. That is impossible!", "x aur y dono gaayab, aur mujhe 0 barabar 4 milta hai. Yeh toh namumkin hai!"),
        L("Dadi", "A false statement means no solution. The lines are parallel.", "Galat statement ka matlab koi solution nahi. Lines parallel hain."),
    ], {"problem": "parallel", "m1": 1, "m2": 2, "step": 3}),
    scene([
        L("Disha", "And x plus 2 y equals 4 with 2 x plus 4 y equals 8 gives 0 equals 0.", "Aur x plus 2 y barabar 4 ke saath 2 x plus 4 y barabar 8 se 0 barabar 0 milta hai."),
        L("Dadi", "Always true, so infinitely many solutions. The lines coincide.", "Hamesha sach, toh anginat solutions. Lines coincide karti hain."),
    ], {"problem": "same", "m1": 2, "m2": 1, "step": 3}),
    scene([
        L("Dadi", "Your turn! For 3 x plus 4 y equals 10 and 2 x minus 2 y equals 2, choose multipliers that eliminate y.",
          "Ab aapki baari! 3 x plus 4 y barabar 10 aur 2 x minus 2 y barabar 2 ke liye aise multipliers chuno jo y ko eliminate karein."),
    ], {"problem": "board", "m1": 1, "m2": 1, "step": 2, "prefer": "y",
        "task": {"eliminate": "y", "text": "Choose multipliers so that the y terms cancel."}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "On the evening before the maths pre-board, Dadi gives one word problem after another.", "Maths pre board se pehle ki shaam, Dadi ek ke baad ek word problem deti hain."),
        L("Dadi", "Harsh hit 11 boundaries in his match, only fours and sixes, and they gave him 52 runs. How many of each?",
          "Harsh ne match mein 11 boundaries maari, sirf chauke aur chhakke, aur unse 52 run mile. Har ek kitne?"),
    ], {"problem": "cricket", "step": 0}),
    scene([
        L("Dadi", "Step 1: name the unknowns clearly. Let x be the number of fours and y the number of sixes.",
          "Step 1: unknowns ko saaf saaf naam do. Maan lo x chaukon ki sankhya hai aur y chhakkon ki."),
    ], {"problem": "cricket", "step": 1}),
    scene([
        L("Disha", "Step 2: one equation per fact. Counting boundaries, x plus y equals 11. Counting runs, 4 x plus 6 y equals 52.",
          "Step 2: har fact se ek equation. Boundaries gino, x plus y barabar 11. Runs gino, 4 x plus 6 y barabar 52."),
    ], {"problem": "cricket", "step": 3}),
    scene([
        L("Harsh", "Step 3: solve. Multiply the first by 4 and subtract, so 2 y equals 8 and y is 4. Then x is 7.",
          "Step 3: solve karo. Pehli ko 4 se multiply karke ghatao, toh 2 y barabar 8 aur y barabar 4. Phir x barabar 7."),
        L("Dadi", "Step 4: check in the story. 7 fours make 28, 4 sixes make 24, and 28 plus 24 is 52. Shabash!",
          "Step 4: kahaani mein check karo. 7 chauke 28 run, 4 chhakke 24 run, aur 28 plus 24 barabar 52. Shabash!"),
    ], {"problem": "cricket", "step": 4}),
    scene([
        L("Deepak", "My turn to ask. I am 30 years older than Harsh. Ten years ago, I was 6 times as old as he was. How old are we?",
          "Ab main poochhta hoon. Main Harsh se 30 saal bada hoon. Das saal pehle main uski umar ka 6 guna tha. Hum kitne saal ke hain?"),
        L("Disha", "Let Papa be x and Harsh be y. Then x minus y equals 30. Ten years ago, x minus 10 equals 6 times y minus 10, which is x minus 6 y equals minus 50.",
          "Maan lo Papa x hain aur Harsh y. Toh x minus y barabar 30. Das saal pehle, x minus 10 barabar 6 guna y minus 10, yaani x minus 6 y barabar minus 50."),
    ], {"problem": "ages", "step": 3}),
    scene([
        L("Harsh", "Subtract the equations: 5 y equals 80, so I am 16 and Papa is 46.", "Equations ghatao: 5 y barabar 80, toh main 16 ka hoon aur Papa 46 ke."),
        L("Deepak", "Check: ten years ago I was 36 and you were 6, and 36 is 6 times 6. Correct!", "Check: das saal pehle main 36 ka tha aur tum 6 ke, aur 36, 6 ka 6 guna hai. Sahi!"),
    ], {"problem": "ages", "step": 4}),
    scene([
        L("Dadi", "In every word problem, follow the same four steps. Name the unknowns, form two equations, solve, and check the answer in the words of the question.",
          "Har word problem mein wahi chaar steps. Unknowns ko naam do, do equations banao, solve karo, aur answer ko sawaal ke shabdon mein check karo."),
    ], {"problem": "parcel", "step": 1}),
    scene([
        L("Deepak", "Your turn! A parcel office charges a fixed fee plus a rate per kilogram. A 10 kilogram parcel costs 250 rupees and a 15 kilogram parcel costs 350 rupees. Find the fee and the rate.",
          "Ab aapki baari! Ek parcel office ek fixed fee aur har kilogram ka rate leta hai. 10 kilogram ka parcel 250 rupaye aur 15 kilogram ka 350 rupaye. Fee aur rate nikaalo."),
    ], {"problem": "parcel", "step": 3, "task": {"text": "Enter the fixed fee x and the rate per kg y."}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "A week before the boards, Dadi sets a full practice paper at the dining table.", "Boards se ek hafta pehle, Dadi dining table par poora practice paper rakhti hain."),
        L("Dadi", "Question 1. How many solutions does the pair x plus 2 y plus 5 equals 0 and minus 3 x minus 6 y plus 1 equals 0 have?",
          "Sawaal 1. Pair x plus 2 y plus 5 barabar 0 aur minus 3 x minus 6 y plus 1 barabar 0 ke kitne solutions hain?"),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "a1 over a2 and b1 over b2 are both minus 1 over 3, but c1 over c2 is 5. So the lines are parallel and there is no solution.",
          "a1 bata a2 aur b1 bata b2 dono minus 1 bata 3 hain, lekin c1 bata c2 hai 5. Toh lines parallel hain aur koi solution nahi."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. For what value of k does k x plus 3 y equals k minus 3, with 12 x plus k y equals k, have no solution?",
          "Sawaal 2. k ki kis value ke liye k x plus 3 y barabar k minus 3, aur 12 x plus k y barabar k, ka koi solution nahi?"),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "k over 12 must equal 3 over k, so k squared is 36 and k is 6 or minus 6. For 6, all three ratios are equal, so the lines coincide. So k is minus 6!",
          "k bata 12 barabar 3 bata k hona chahiye, toh k square 36 aur k, 6 ya minus 6. 6 ke liye teeno ratios barabar hain, toh lines coincide. Isliye k minus 6!"),
        L("Dadi", "Shabash, Harsh. Checking both values is what earns the full marks.", "Shabash, Harsh. Dono values check karne se hi poore marks milte hain."),
    ], {"example": 1, "step": 5}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, solve it in your notebook first, then reveal the steps.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein solve karo, phir steps kholo."),
    ], {"example": 2, "step": 0}),
]

# ─────────────────────────────── Parts ───────────────────────────────

PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Mummy's Snack Shop · Linear Equations in Two Variables",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Harsh paid ₹40 for 2 samosas and 1 kachori. Disha paid ₹50 for 1 samosa and 2 kachoris. One bill alone cannot tell the prices; two bills together can.</div>

<h2>Linear equation in two variables</h2>
<div {FORMULA}>a x + b y + c = 0,  a, b, c real numbers, a and b not both zero</div>
<p>Examples: 2x + y = 40 (that is, 2x + y − 40 = 0), x − y = 4, 3x = 2y.</p>

<h2>Solutions</h2>
<div {CARD}>
  <div>A <strong>solution</strong> is a pair of values (x, y) that makes the equation true. For 2x + y = 40: (0, 40), (5, 30), (10, 20), (15, 10), (20, 0), ...</div>
  <div>One linear equation in two variables has <strong>infinitely many solutions</strong>.</div>
  <div>Plotting the solutions gives a <strong>straight line</strong>. Every point on the line is a solution, and every solution is a point on the line.</div>
</div>

<h2>A pair of linear equations</h2>
<p>Two linear equations in the same two variables, for example</p>
<div {FORMULA}>a1 x + b1 y + c1 = 0  and  a2 x + b2 y + c2 = 0</div>
<p>A solution of the pair must satisfy <strong>both</strong> equations, so it is a point on <strong>both</strong> lines.
For 2x + y = 40 and x + 2y = 50 the lines meet at (10, 20): a samosa costs ₹10 and a kachori ₹20.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">(x, y)</th><th>2x + y</th><th>x + 2y</th><th>Fits both?</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>(15, 10)</td><td class="text-center">40</td><td class="text-center">35</td><td class="text-center">No</td></tr>
    <tr><td>(10, 20)</td><td class="text-center">40</td><td class="text-center">50</td><td class="text-center">Yes</td></tr>
    <tr><td>(0, 25)</td><td class="text-center">25</td><td class="text-center">50</td><td class="text-center">No</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "One linear equation in two variables is a line with infinitely many solutions; a pair of them is solved by the point common to both lines.",
        "widgetType": "Class10LinEqGraphWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Which pair is a solution of 2x + y = 40 but NOT of x + 2y = 50?",
            "options": ["(10, 20)", "(15, 10)", "(0, 25)", "(20, 15)"],
            "correctIndex": 1,
            "explanation": "2(15) + 10 = 40, but 15 + 2(10) = 35, not 50. (10, 20) fits both; (0, 25) fits only the second; (20, 15) fits neither.",
        },
        "teacherNotes": teacher(
            [
                "Start from a real bill: one equation leaves many possibilities; ask students to list five pairs.",
                "Plot the pairs on graph paper; let students discover that they lie on one straight line.",
                "Introduce the second bill and ask which of their pairs also fits it.",
            ],
            [
                "Thinking an equation like 2x + y = 40 has only one solution.",
                "Writing a solution as two separate numbers instead of an ordered pair (x, y).",
                "Swapping x and y while plotting.",
            ],
            "Price detective: each group gets two shop bills (two items, two totals), lists pairs for each bill on a table, plots both lines and finds the prices.",
            "NCERT Class 10 Ch. 3, Sections 3.1 and 3.2 (introduction; pair of linear equations in two variables).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: The Railway Yard · Graphical Method",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>In a railway yard, tracks cross at junctions, run side by side as parallel rails, or share one line. Papa's drawings show the three things two lines can do.</div>

<h2>Steps of the graphical method</h2>
<ol>
  <li>For each equation make a table of at least two (better three) solutions.</li>
  <li>Plot the points and draw both lines on the same axes.</li>
  <li>Read the common point(s).</li>
</ol>
<p>Example: x + y = 5 gives (0, 5), (5, 0); 2x − y = 4 gives (2, 0), (4, 4). The lines meet at (3, 2), and 3 + 2 = 5, 2(3) − 2 = 4.</p>

<h2>The three possibilities</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Lines</th><th class="text-left">Solutions</th><th class="text-left">Pair is</th><th class="text-left">Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Intersect</td><td>Exactly one (unique)</td><td>Consistent</td><td>x + y = 5, 2x − y = 4</td></tr>
    <tr><td>Parallel</td><td>None</td><td>Inconsistent</td><td>x + 2y = 4, 2x + 4y = 12</td></tr>
    <tr><td>Coincident</td><td>Infinitely many</td><td>Dependent (consistent)</td><td>2x + 3y = 9, 4x + 6y = 18</td></tr>
  </tbody>
</table>
<div {FORMULA}>Consistent = at least one solution · Inconsistent = no solution · Dependent = infinitely many</div>
<div {CARD}>
  <div>2x + 4y = 12 is the same as x + 2y = 6: the same left side as x + 2y = 4 but a different number, so the two can never both be true.</div>
  <div>4x + 6y = 18 is just 2 × (2x + 3y = 9), so both equations describe the same line.</div>
</div>
""",
        "keyInsight": "Two lines can meet once (one solution), never (no solution) or everywhere (infinitely many): the graph shows which.",
        "widgetType": "Class10LinEqGraphWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "The graphs of a pair of linear equations are coincident lines. The pair is:",
            "options": ["Inconsistent", "Consistent with a unique solution", "Dependent, with infinitely many solutions", "Without any solution"],
            "correctIndex": 2,
            "explanation": "Coincident lines share every point, so there are infinitely many solutions; such a pair is dependent (and consistent).",
        },
        "teacherNotes": teacher(
            [
                "Use two rulers or straws on a grid to act out the three cases.",
                "Insist on three points per line: the third point catches arithmetic mistakes.",
                "Connect the words: consistent = at least one solution, inconsistent = none, dependent = infinitely many.",
            ],
            [
                "Calling a coincident pair inconsistent (it is consistent: it has solutions).",
                "Reading an intersection point roughly from the graph and not checking it in both equations.",
                "Using different scales on the two axes without labelling them.",
            ],
            "Line triplets: give groups three pairs (one of each kind) on cards; they graph them and sort the cards into intersect, parallel, coincident.",
            "NCERT Class 10 Ch. 3, Section 3.2 (graphical representation and the three possibilities; Exercise 3.1).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Disha's Shortcut · The Ratio Test",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Disha has forty practice questions and no time to draw forty graphs. Dadi shows her how to read the type of the lines straight from the coefficients.</div>

<h2>Write both equations in standard form</h2>
<div {FORMULA}>a1 x + b1 y + c1 = 0  ·  a2 x + b2 y + c2 = 0</div>

<h2>Compare the ratios</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Ratios</th><th class="text-left">Lines</th><th class="text-left">Solutions</th><th class="text-left">Pair is</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>a1/a2 ≠ b1/b2</td><td>Intersecting</td><td>Exactly one</td><td>Consistent</td></tr>
    <tr><td>a1/a2 = b1/b2 = c1/c2</td><td>Coincident</td><td>Infinitely many</td><td>Dependent (consistent)</td></tr>
    <tr><td>a1/a2 = b1/b2 ≠ c1/c2</td><td>Parallel</td><td>None</td><td>Inconsistent</td></tr>
  </tbody>
</table>
<div {FORMULA}>Unique: a1/a2 ≠ b1/b2 · Infinite: a1/a2 = b1/b2 = c1/c2 · None: a1/a2 = b1/b2 ≠ c1/c2</div>

<h2>Worked checks (NCERT style)</h2>
<div {CARD}>
  <div>5x − 4y + 8 = 0, 7x + 6y − 9 = 0: a1/a2 = 5/7, b1/b2 = −4/6 = −2/3. Unequal → intersecting, unique solution.</div>
  <div>9x + 3y + 12 = 0, 18x + 6y + 24 = 0: 9/18 = 3/6 = 12/24 = 1/2 → coincident, infinitely many.</div>
  <div>6x − 3y + 10 = 0, 2x − y + 9 = 0: 6/2 = 3, −3/−1 = 3, but 10/9 ≠ 3 → parallel, no solution.</div>
</div>
<p><strong>Why it works:</strong> if a1/a2 = b1/b2 the lines have the same slope (the same tilt). Then they are either the same line (c in the same ratio) or never meet.</p>
""",
        "keyInsight": "Compare a1/a2 with b1/b2: unequal means one solution; equal means parallel or coincident, and c1/c2 decides which.",
        "widgetType": "Class10LinEqRatioWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "The pair 3x + 2y = 5 and 2x − 3y = 7 is:",
            "options": ["Consistent with a unique solution", "Inconsistent", "Dependent", "Coincident"],
            "correctIndex": 0,
            "explanation": "a1/a2 = 3/2 and b1/b2 = 2/(−3) = −2/3. They are unequal, so the lines intersect: a unique solution, consistent.",
        },
        "teacherNotes": teacher(
            [
                "Derive the rule from the graphs of Story 2 before stating it.",
                "Always move every term to the left first (a x + b y + c = 0) so the signs of c are right.",
                "For 'find k' questions, set up the condition, solve, then test every value of k found.",
            ],
            [
                "Comparing a1/b1 with a2/b2 by mistake (that also works but students mix the two forms).",
                "Forgetting to move constants to the left, which flips the sign of c.",
                "Ending a 'no solution' question with both values of k without checking c1/c2.",
            ],
            "Ratio relay: teams get cards with pairs of equations; one member writes the three ratios, the next names the case, the third sketches the lines.",
            "NCERT Class 10 Ch. 3, Section 3.2 (table of ratios; Exercise 3.1 questions 2 to 5).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: The Cricket Kit · Substitution Method",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>A bat costs ₹300 more than a ball, and a bat with three balls costs ₹700. Harsh wants the exact prices, without drawing a graph.</div>

<h2>Substitution method</h2>
<ol>
  <li>From the easier equation, express one variable in terms of the other.</li>
  <li>Substitute this into the other equation: you get one equation in one variable. Solve it.</li>
  <li>Put this value back to find the other variable.</li>
  <li>Check both values in both equations.</li>
</ol>
<div {CARD}>
  <div>x − y = 300 … (1),  x + 3y = 700 … (2)</div>
  <div>From (1): x = y + 300 … (3)</div>
  <div>In (2): (y + 300) + 3y = 700 ⇒ 4y = 400 ⇒ y = 100</div>
  <div>From (3): x = 100 + 300 = 400. Bat ₹400, ball ₹100.</div>
</div>
<div {FORMULA}>Unique answer ⇔ lines intersect · false statement (like 5 = 7) ⇔ no solution · always true (0 = 0) ⇔ infinitely many</div>
<h2>Board example</h2>
<p>Solve 2x + 3y = 11 and 2x − 4y = −24, and find m for which y = mx + 3.</p>
<div {CARD}>
  <div>From the first: 2x = 11 − 3y. Put into the second: 11 − 3y − 4y = −24 ⇒ 7y = 35 ⇒ y = 5.</div>
  <div>2x = 11 − 15 = −4 ⇒ x = −2. Then 5 = −2m + 3 ⇒ m = −1.</div>
</div>
""",
        "keyInsight": "Substitution turns two equations in two unknowns into one equation in one unknown.",
        "widgetType": "Class10LinEqSubstitutionWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Solve by substitution: x + y = 14 and x − y = 4.",
            "options": ["x = 9, y = 5", "x = 5, y = 9", "x = 10, y = 4", "x = 7, y = 7"],
            "correctIndex": 0,
            "explanation": "From the first, x = 14 − y. Then 14 − y − y = 4, so 2y = 10, y = 5 and x = 9.",
        },
        "teacherNotes": teacher(
            [
                "Choose the variable whose coefficient is 1 or −1; it avoids fractions.",
                "Always put brackets around the substituted expression.",
                "Show the small graph: the algebraic answer is the intersection point.",
            ],
            [
                "Substituting back into the same equation it came from (gives 0 = 0 and no information).",
                "Dropping brackets: 2(y + 300) written as 2y + 300.",
                "Stopping after finding one variable.",
            ],
            "Swap and check: students solve a pair, then swap notebooks and check the partner's answer in both original equations.",
            "NCERT Class 10 Ch. 3, Section 3.3.1 (substitution method; Exercise 3.2).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Diwali Sweet Boxes · Elimination Method",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Two Diwali bills: 2 kaju boxes and 3 besan boxes cost ₹1,550; 3 kaju boxes and 2 besan boxes cost ₹1,700. No letter is easy to isolate, so Dadi removes one instead.</div>

<h2>Elimination method</h2>
<ol>
  <li>Multiply the equations by suitable non-zero numbers so that one variable has equal (or opposite) coefficients.</li>
  <li>Subtract (equal coefficients) or add (opposite coefficients) to eliminate that variable.</li>
  <li>Solve the one-variable equation.</li>
  <li>Substitute back to find the other variable.</li>
</ol>
<div {CARD}>
  <div>2x + 3y = 1550 … (1),  3x + 2y = 1700 … (2)</div>
  <div>(1) × 3: 6x + 9y = 4650 · (2) × 2: 6x + 4y = 3400</div>
  <div>Subtract: 5y = 1250 ⇒ y = 250. Then 2x + 750 = 1550 ⇒ x = 400.</div>
  <div>Kaju box ₹400, besan box ₹250. Check: 3(400) + 2(250) = 1700 ✔</div>
</div>
<div {FORMULA}>Both variables vanish: 0 = non-zero ⇒ no solution · 0 = 0 ⇒ infinitely many</div>
<div {CARD}>
  <div>2x + 4y = 12 and x + 2y = 4: second × 2 gives 2x + 4y = 8; subtracting gives 0 = 4, false → no solution (parallel).</div>
  <div>x + 2y = 4 and 2x + 4y = 8: first × 2 and subtract gives 0 = 0 → infinitely many (coincident).</div>
</div>
""",
        "keyInsight": "Make one variable's coefficients match, then add or subtract to wipe it out.",
        "widgetType": "Class10LinEqEliminationWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "To eliminate y from 3x + 4y = 10 and 2x − 2y = 2, you should:",
            "options": ["Multiply the second by 2 and add", "Multiply the second by 2 and subtract", "Multiply the first by 2 and add", "Add them as they are"],
            "correctIndex": 0,
            "explanation": "(2) × 2 gives 4x − 4y = 4. With +4y in the first, adding cancels y: 7x = 14, x = 2, then y = 1.",
        },
        "teacherNotes": teacher(
            [
                "Multiply by the other equation's coefficient (like finding an LCM) to match coefficients.",
                "Same signs: subtract; opposite signs: add. Say it aloud each time.",
                "Compare with substitution: elimination is quicker when no coefficient is 1.",
            ],
            [
                "Multiplying only the left side of an equation and forgetting the constant.",
                "Subtracting with sign errors, especially with negative terms.",
                "Concluding 'no solution' from 0 = 0 (it means infinitely many).",
            ],
            "Elimination race: pairs of students get the same system; one eliminates x, the other eliminates y; they must reach the same answer.",
            "NCERT Class 10 Ch. 3, Section 3.3.2 (elimination method; Exercise 3.3).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Word-Problem Evening · Forming the Equations",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Before the pre-board, Dadi and Papa fire word problems at the twins: boundaries in a match, ages, and parcel charges.</div>

<h2>Four steps for any word problem</h2>
<div {FORMULA}>Name the unknowns → form two equations → solve → check in the words of the question</div>

<h2>Cricket boundaries</h2>
<div {CARD}>
  <div>11 boundaries (fours and sixes) gave 52 runs. Let x = fours, y = sixes.</div>
  <div>x + y = 11 · 4x + 6y = 52. Multiply the first by 4 and subtract: 2y = 8, y = 4, x = 7.</div>
  <div>Check: 7 × 4 + 4 × 6 = 28 + 24 = 52 ✔</div>
</div>

<h2>Ages</h2>
<div {CARD}>
  <div>Papa is 30 years older than Harsh. Ten years ago he was 6 times as old. Let x = Papa's age, y = Harsh's age.</div>
  <div>x − y = 30 · x − 10 = 6(y − 10) ⇒ x − 6y = −50.</div>
  <div>Subtract: 5y = 80 ⇒ y = 16, x = 46. Check: 36 = 6 × 6 ✔</div>
</div>

<h2>Fixed charge plus rate</h2>
<div {CARD}>
  <div>Fixed fee x, rate y per kg. 10 kg costs ₹250, 15 kg costs ₹350.</div>
  <div>x + 10y = 250 · x + 15y = 350. Subtract: 5y = 100 ⇒ y = 20, x = 50.</div>
</div>
<p>Other common types: two numbers (sum and difference), fractions ("if 1 is added to the numerator..."), and the length and breadth of a rectangle.</p>
""",
        "keyInsight": "Every fact in the question gives one equation; two facts give the pair you need.",
        "widgetType": "Class10LinEqWordProblemWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "The sum of two numbers is 27 and their difference is 7. The larger number is:",
            "options": ["10", "17", "20", "14"],
            "correctIndex": 1,
            "explanation": "x + y = 27 and x − y = 7. Adding: 2x = 34, x = 17 (and y = 10).",
        },
        "teacherNotes": teacher(
            [
                "Make students write 'Let x = ..., y = ...' with units before any equation.",
                "Underline each numerical fact; each underlined fact becomes one equation.",
                "Finish with a sentence answer and a check in the original words.",
            ],
            [
                "Ages: forgetting to subtract (or add) the years from BOTH people.",
                "Mixing up the unknowns between the two equations.",
                "Giving x and y without saying what they mean in the story.",
            ],
            "Write-your-own: each student writes a two-fact word problem about their family or school; a partner forms and solves the equations.",
            "NCERT Class 10 Ch. 3, Sections 3.3.1 and 3.3.2 word problems (Exercises 3.2 and 3.3).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 board-pattern problems, step by step",
        "readingTime": "~12 min",
        "narrative": f"""
<div {STORY}>A week before the boards, Dadi sets a full practice paper: MCQs, short and long answers, an assertion–reason question and a case study.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Type of pair: compare a1/a2, b1/b2, c1/c2.</li>
  <li>Graphical: two points per line, read the meeting point, check it.</li>
  <li>Substitution: when a coefficient is 1 or −1.</li>
  <li>Elimination: match a coefficient, then add or subtract.</li>
  <li>Word problems: name, form, solve, check.</li>
</ol>
<p>Use the question buttons. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "First decide the type of pair, then choose the quickest method, and always check in both equations.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "MCQ · Number of solutions",
                    "question": "The pair x + 2y + 5 = 0 and −3x − 6y + 1 = 0 has: (a) a unique solution (b) exactly two solutions (c) infinitely many solutions (d) no solution.",
                    "steps": [
                        "a1/a2 = 1/(−3) = −1/3,  b1/b2 = 2/(−6) = −1/3",
                        "c1/c2 = 5/1 = 5",
                        "a1/a2 = b1/b2 ≠ c1/c2, so the lines are parallel: <strong>(d) no solution</strong>",
                    ],
                    "answer": "(d) no solution",
                },
                {
                    "title": "Short answer · Find k (no solution)",
                    "question": "For which value of k will kx + 3y = k − 3 and 12x + ky = k have no solution?",
                    "steps": [
                        "Standard form: kx + 3y − (k − 3) = 0 and 12x + ky − k = 0",
                        "No solution needs a1/a2 = b1/b2: k/12 = 3/k ⇒ k² = 36 ⇒ k = 6 or k = −6",
                        "k = 6: ratios 6/12 = 1/2, 3/6 = 1/2, c1/c2 = (−3)/(−6) = 1/2, all equal → coincident, rejected",
                        "k = −6: −6x + 3y + 9 = 0 and 12x − 6y + 6 = 0, so a1/a2 = b1/b2 = −1/2 but c1/c2 = 9/6 = 3/2 → parallel ✔",
                        "So the pair has no solution only for <strong>k = −6</strong>",
                    ],
                    "answer": "k = −6",
                },
                {
                    "title": "Graphical method",
                    "question": "Solve graphically: x + y = 5 and 2x − y = 4.",
                    "steps": [
                        "x + y = 5: points (0, 5), (5, 0), (2, 3)",
                        "2x − y = 4: points (2, 0), (0, −4), (4, 4)",
                        "Plot both lines; they intersect at (3, 2)",
                        "Check: 3 + 2 = 5 ✔ and 6 − 2 = 4 ✔. <strong>x = 3, y = 2</strong>",
                    ],
                    "answer": "x = 3, y = 2",
                },
                {
                    "title": "Substitution (NCERT style)",
                    "question": "Solve 2x + 3y = 11 and 2x − 4y = −24, and hence find m for which y = mx + 3.",
                    "steps": [
                        "From the first: 2x = 11 − 3y",
                        "Substitute in the second: (11 − 3y) − 4y = −24 ⇒ −7y = −35 ⇒ y = 5",
                        "2x = 11 − 15 = −4 ⇒ x = −2",
                        "y = mx + 3: 5 = −2m + 3 ⇒ −2m = 2 ⇒ <strong>m = −1</strong>",
                    ],
                    "answer": "x = −2, y = 5, m = −1",
                },
                {
                    "title": "Elimination",
                    "question": "Solve by elimination: 3x + 4y = 10 and 2x − 2y = 2.",
                    "steps": [
                        "Multiply the second by 2: 4x − 4y = 4",
                        "Add to the first: (3x + 4y) + (4x − 4y) = 10 + 4 ⇒ 7x = 14 ⇒ x = 2",
                        "3(2) + 4y = 10 ⇒ 4y = 4 ⇒ y = 1",
                        "Check: 2(2) − 2(1) = 2 ✔. <strong>x = 2, y = 1</strong>",
                    ],
                    "answer": "x = 2, y = 1",
                },
                {
                    "title": "Long answer · Fraction",
                    "question": "A fraction becomes 9/11 if 2 is added to both its numerator and denominator. If 3 is added to both, it becomes 5/6. Find the fraction.",
                    "steps": [
                        "Let the fraction be x/y.",
                        "(x + 2)/(y + 2) = 9/11 ⇒ 11x + 22 = 9y + 18 ⇒ 11x − 9y = −4 … (1)",
                        "(x + 3)/(y + 3) = 5/6 ⇒ 6x + 18 = 5y + 15 ⇒ 6x − 5y = −3 … (2)",
                        "(1) × 5: 55x − 45y = −20;  (2) × 9: 54x − 45y = −27",
                        "Subtract: x = 7. Then 77 − 9y = −4 ⇒ 9y = 81 ⇒ y = 9",
                        "Fraction = <strong>7/9</strong>. Check: 9/11 ✔ and 10/12 = 5/6 ✔",
                    ],
                    "answer": "7/9",
                },
                {
                    "title": "Long answer · Ages",
                    "question": "Five years hence, a father's age will be three times his son's age. Five years ago, the father's age was seven times the son's age. Find their present ages.",
                    "steps": [
                        "Let the father's age be x years and the son's y years.",
                        "x + 5 = 3(y + 5) ⇒ x − 3y = 10 … (1)",
                        "x − 5 = 7(y − 5) ⇒ x − 7y = −30 … (2)",
                        "(1) − (2): 4y = 40 ⇒ y = 10, then x = 10 + 30 = 40",
                        "Check: 45 = 3 × 15 ✔, 35 = 7 × 5 ✔. <strong>Father 40 years, son 10 years</strong>",
                    ],
                    "answer": "Father 40, son 10",
                },
                {
                    "title": "Assertion–Reason",
                    "question": "Assertion (A): The pair 2x + 3y = 7 and 4x + 6y = 14 has infinitely many solutions. Reason (R): If a1/a2 = b1/b2 = c1/c2, the lines are coincident. (a) Both true and R explains A (b) Both true, R does not explain A (c) A true, R false (d) A false, R true.",
                    "steps": [
                        "Ratios: 2/4 = 1/2, 3/6 = 1/2, 7/14 = 1/2: all equal, so A is true.",
                        "R is the standard condition for coincident lines: true.",
                        "Coincident lines have infinitely many common points, so R explains A: <strong>(a)</strong>",
                    ],
                    "answer": "(a)",
                },
                {
                    "title": "Case study · Mummy's shop",
                    "question": "At Mummy's shop, 3 cake slices and 2 cookie boxes cost ₹340, while 2 cake slices and 3 cookie boxes cost ₹310. (i) Form the equations. (ii) Find the cost of 1 slice and 1 box together. (iii) Find each price.",
                    "steps": [
                        "(i) Let a slice cost ₹x and a box ₹y: 3x + 2y = 340, 2x + 3y = 310",
                        "(ii) Add: 5x + 5y = 650 ⇒ <strong>x + y = 130</strong>",
                        "(iii) Subtract: x − y = 30. With x + y = 130: 2x = 160 ⇒ x = 80, y = 50",
                        "Check: 3(80) + 2(50) = 340 ✔, 2(80) + 3(50) = 310 ✔. <strong>Slice ₹80, box ₹50</strong>",
                    ],
                    "answer": "₹130; slice ₹80, box ₹50",
                },
                {
                    "title": "Graph and area",
                    "question": "Draw x − y + 1 = 0 and 3x + 2y − 12 = 0. Find the vertices of the triangle formed by these lines and the x-axis, and its area.",
                    "figureSvg": _triangle_svg(),
                    "steps": [
                        "x − y + 1 = 0: points (−1, 0), (0, 1), (2, 3)",
                        "3x + 2y − 12 = 0: points (4, 0), (0, 6), (2, 3)",
                        "The lines meet at (2, 3); they cut the x-axis at (−1, 0) and (4, 0)",
                        "Base = 4 − (−1) = 5, height = 3. Area = ½ × 5 × 3 = <strong>7.5 square units</strong>",
                    ],
                    "answer": "(2, 3), (−1, 0), (4, 0); area 7.5 sq units",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Q2: model the board-examiner habit of testing every value of k against the third ratio.",
                "Q6 and Q7: write the meaning of x and y in words before forming equations.",
                "Q9: point out that adding both equations gave x + y directly (a quick trick in case studies).",
            ],
            [
                "Q1: forgetting signs in the ratios.",
                "Q2: giving k = ±6 as the answer.",
                "Q10: using the y-axis intercepts instead of the x-axis ones for the base.",
            ],
            "Mock paper: give students 20 minutes for Q3 to Q10 under exam conditions, then mark with the steps shown.",
            "Covers NCERT Class 10 Ch. 3 Exercises 3.1, 3.2 and 3.3 and CBSE board question patterns.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Pair of Linear Equations (80% to pass)",
        "readingTime": "~12 min exam",
        "narrative": f"""
<p>From samosa bills to railway tracks, cricket kits and Diwali sweets, you have drawn, tested and solved pairs of linear equations. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 board-style questions</strong>: types of pairs, the ratio test, finding k, substitution, elimination, word problems and assertion–reason.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Decide the type first, pick the quickest method, and check in both equations.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Pair of Linear Equations · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "If the lines of a pair of linear equations intersect at one point, the pair is:", "options": ["Inconsistent", "Consistent with a unique solution", "Dependent", "Without solution"], "answer": 1, "explanation": "Intersecting lines have exactly one common point: a unique solution, so the pair is consistent.", "topic": "Graphical method"},
                {"q": "The pair 2x + 3y − 9 = 0 and 4x + 6y − 18 = 0 has:", "options": ["No solution", "A unique solution", "Exactly two solutions", "Infinitely many solutions"], "answer": 3, "explanation": "2/4 = 3/6 = 9/18 = 1/2: all ratios equal, so the lines coincide and there are infinitely many solutions.", "topic": "Ratio test"},
                {"q": "The lines 6x − 3y + 10 = 0 and 2x − y + 9 = 0 are:", "options": ["Intersecting", "Parallel", "Coincident", "Perpendicular"], "answer": 1, "explanation": "6/2 = 3 and −3/−1 = 3, but 10/9 ≠ 3. So a1/a2 = b1/b2 ≠ c1/c2: parallel.", "topic": "Ratio test"},
                {"q": "For what value of k does 3x + y = 1 and (2k − 1)x + (k − 1)y = 2k + 1 have no solution?", "options": ["1", "2", "3", "−2"], "answer": 1, "explanation": "3/(2k − 1) = 1/(k − 1) ⇒ 3k − 3 = 2k − 1 ⇒ k = 2. Then the second line is 3x + y = 5, parallel to 3x + y = 1.", "topic": "Finding k"},
                {"q": "The solution of x + y = 14 and x − y = 4 is:", "options": ["x = 5, y = 9", "x = 9, y = 5", "x = 10, y = 4", "x = 8, y = 6"], "answer": 1, "explanation": "Adding: 2x = 18, x = 9, and y = 14 − 9 = 5.", "topic": "Substitution / elimination"},
                {"q": "The line 2x + 3y = 12 cuts the y-axis at:", "options": ["(6, 0)", "(0, 4)", "(0, 6)", "(4, 0)"], "answer": 1, "explanation": "On the y-axis x = 0, so 3y = 12 and y = 4: the point (0, 4).", "topic": "Graphical method"},
                {"q": "To eliminate x from 3x + 2y = 11 and 2x + 3y = 4, you can:", "options": ["Add the equations", "Multiply the first by 2, the second by 3, and subtract", "Multiply the first by 3, the second by 2, and add", "Multiply both by 2 and subtract"], "answer": 1, "explanation": "6x + 4y = 22 and 6x + 9y = 12 have equal x-coefficients; subtracting removes x.", "topic": "Elimination"},
                {"q": "Harsh hit 12 boundaries, only fours and sixes, for 58 runs. How many sixes did he hit?", "options": ["4", "5", "6", "7"], "answer": 1, "explanation": "x + y = 12 and 4x + 6y = 58. Multiply the first by 4 and subtract: 2y = 10, y = 5 (and x = 7: 28 + 30 = 58).", "topic": "Word problems"},
                {"q": "Assertion (A): x + 2y = 3 and 2x + 4y = 7 have no solution. Reason (R): Parallel lines have no common point.", "options": ["Both A and R are true and R explains A", "Both true, but R does not explain A", "A is true, R is false", "A is false, R is true"], "answer": 0, "explanation": "1/2 = 2/4 but 3/7 ≠ 1/2, so the lines are parallel and A is true. R is true and is exactly why A holds.", "topic": "Assertion–reason"},
                {"q": "Assertion (A): 3x − 4y = 7 and 6x − 8y = 14 have infinitely many solutions. Reason (R): A pair has infinitely many solutions when a1/a2 = b1/b2 ≠ c1/c2.", "options": ["Both A and R are true and R explains A", "Both true, but R does not explain A", "A is true, R is false", "A is false, R is true"], "answer": 2, "explanation": "3/6 = −4/−8 = 7/14 = 1/2, so A is true. R states the condition for NO solution, so R is false.", "topic": "Assertion–reason"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q4 catches students who skip the c-ratio check; Q10 catches students who mix up the conditions for infinite and no solution."],
            "Exit ticket: write one pair of equations of each kind (intersecting, parallel, coincident) and justify each with ratios.",
            "Matches NCERT Class 10 Ch. 3 (rationalised) learning outcomes.",
        ),
    },
]


def seed_class10_story_linear_equations():
    db = SessionLocal()
    try:
        topic = get_class10_topic(db, "Pair of Linear Equations in Two Variables")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 10 Pair of Linear Equations: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Pair of Linear Equations: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class10_story_linear_equations()
