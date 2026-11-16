import json
from db import SessionLocal
from seed_class10_structure import get_class10_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 10 · Coordinate Geometry (NCERT Class 10 Ch. 7, rationalised syllabus 2023-24 onward):
# 7.1 introduction (recap of the Cartesian plane), 7.2 distance formula, 7.3 section formula (internal division,
# midpoint, points of trisection, finding the ratio). Area of a triangle (old 7.4) is deleted from the current
# syllabus and is left out.
# Story: Harsh and Disha prepare for the boards; Papa's railway yard map, a cricket ground, Mummy's new shop,
# a new railway line, Diwali lights and a boundary survey.
#
# Verified fact used:
# - Rene Descartes published "La Geometrie" in 1637 as an appendix to his "Discourse on Method"; it joined algebra
#   and geometry, and Cartesian coordinates are named after him. (Britannica, "Cartesian coordinates";
#   Wikipedia, "La Geometrie".)

# ───────────────────────────── Part 1 · the plane, distance along a grid line ─────────────────────────────
SCENES_1 = [
    scene([
        L("Narrator", "It is a Sunday in Jaipur. Papa spreads a big squared map of the railway yard on the dining table, and Harsh and Disha put their board-exam books aside.",
          "Jaipur mein Itvaar hai. Papa dining table par railway yard ka bada sa graph wala naksha phailaate hain, aur Harsh aur Disha apni board exam ki kitaabein ek taraf rakh dete hain."),
        L("Deepak", "Every signal on this map has an address. The station master's cabin is the origin, and the signal S is 4 squares east and 3 squares north.",
          "Is naksha par har signal ka ek address hai. Station master ka cabin origin hai, aur signal S 4 khaane poorab aur 3 khaane uttar mein hai."),
    ], {"mode": "plot", "pts": [[4, 3]], "names": ["S"]}),
    scene([
        L("Dadi", "So S is the point 4 comma 3. The first number, 4, is the x-coordinate or abscissa. The second, 3, is the y-coordinate or ordinate.",
          "Toh S point 4 comma 3 hai. Pehla number, 4, x-coordinate ya abscissa hai. Doosra, 3, y-coordinate ya ordinate hai."),
        L("Disha", "And the dashed lines show it. S is 4 units from the y-axis and 3 units from the x-axis.",
          "Aur dashed lines yahi dikhaati hain. S, y-axis se 4 unit aur x-axis se 3 unit door hai."),
    ], {"mode": "plot", "pts": [[4, 3]], "names": ["S"]}),
    scene([
        L("Deepak", "The water tank W is 3 squares west and 2 north. West of the origin means a negative x, so W is minus 3 comma 2.",
          "Paani ki tanki W, 3 khaane paschim aur 2 uttar mein hai. Origin ke paschim matlab negative x, toh W hai minus 3 comma 2."),
        L("Dadi", "The axes cut the plane into four quadrants. W is in the second quadrant, where x is negative and y is positive.",
          "Axes plane ko chaar quadrants mein baant dete hain. W doosre quadrant mein hai, jahaan x negative aur y positive hota hai."),
    ], {"mode": "plot", "pts": [[4, 3], [-3, 2]], "names": ["S", "W"]}),
    scene([
        L("Harsh", "Remember this from Class 9, Dadi? A point is plus plus in quadrant one, minus plus in two, minus minus in three and plus minus in four!",
          "Class 9 se yaad hai, Dadi? Quadrant ek mein point plus plus, do mein minus plus, teen mein minus minus aur chaar mein plus minus hota hai!"),
        L("Dadi", "Shabash. And a French mathematician, Rene Descartes, joined algebra and geometry in a book in 1637. That is why we call these Cartesian coordinates.",
          "Shabash. Aur ek French ganitagya, Rene Descartes, ne 1637 mein ek kitaab mein algebra aur geometry ko jod diya. Isliye inhe Cartesian coordinates kehte hain."),
    ], {"mode": "plot", "pts": [[4, 3], [-3, 2], [-2, -3]], "names": ["S", "W", "G"]}),
    scene([
        L("Deepak", "Now, how far apart are two signals? A is at 1 comma 2, and B is at 7 comma 2. They sit on the same horizontal track.",
          "Ab, do signal kitni door hain? A, 1 comma 2 par hai, aur B, 7 comma 2 par. Dono ek hi seedhe horizontal track par hain."),
        L("Disha", "Same y, so I only count across. 7 minus 1 is 6 units!",
          "Y same hai, toh main sirf across ginti hoon. 7 minus 1, yaani 6 unit!"),
    ], {"mode": "line", "pts": [[1, 2], [7, 2]], "names": ["A", "B"]}),
    scene([
        L("Dadi", "For a vertical line, the x is the same, so count the y. From 3 comma minus 1 to 3 comma 5, the distance is 5 minus minus 1, which is 6.",
          "Vertical line par x same hota hai, toh y gino. 3 comma minus 1 se 3 comma 5 tak, doori hai 5 minus minus 1, yaani 6."),
        L("Harsh", "Easy! But what if the two signals are not on the same line?",
          "Aasaan! Lekin agar dono signal ek line par na hon toh?"),
    ], {"mode": "line", "pts": [[3, -1], [3, 5]], "names": ["A", "B"]}),
    scene([
        L("Deepak", "Then counting squares fails. From 1 comma 2 to 5 comma 5 the track slants. For that we need a new tool, which is our next story.",
          "Tab khaane ginna kaam nahi karta. 1 comma 2 se 5 comma 5 tak track tircha hai. Uske liye ek naya tool chahiye, jo hamari agli kahaani hai."),
    ], {"mode": "line", "pts": [[1, 2], [5, 5]], "names": ["A", "B"]}),
    scene([
        L("Deepak", "Your turn! A new gate G must go in the third quadrant, at minus 4 comma minus 3. Drag G there.",
          "Ab aapki baari! Naya gate G teesre quadrant mein lagna hai, minus 4 comma minus 3 par. G ko wahaan drag karo."),
    ], {"mode": "plot", "pts": [[4, 3], [-3, 2], [1, 1]], "names": ["S", "W", "G"], "task": {"x": -4, "y": -3}}, wait=True),
]

# ───────────────────────────── Part 2 · the distance formula ─────────────────────────────
SCENES_2 = [
    scene([
        L("Narrator", "Next evening, Harsh is at the cricket ground. Each square of the ground plan is 10 metres, and the bowler stands at A, 1 comma 1.",
          "Agli shaam, Harsh cricket ground par hai. Ground ke plan ka har khaana 10 metre hai, aur bowler A par khada hai, 1 comma 1."),
        L("Harsh", "The fielder is at B, 5 comma 4. How far must I throw the ball straight to him?",
          "Fielder B par hai, 5 comma 4. Seedha usse ball phenkne ke liye kitni door phenkni padegi?"),
    ], {"A": [1, 1], "B": [5, 4], "step": 0}),
    scene([
        L("Dadi", "Walk from A along the grid first. Across, 5 minus 1 is 4. Up, 4 minus 1 is 3. The two walks meet at a right angle.",
          "Pehle A se grid ke saath chalo. Across, 5 minus 1 yaani 4. Upar, 4 minus 1 yaani 3. Dono raaste right angle par milte hain."),
    ], {"A": [1, 1], "B": [5, 4], "step": 1}),
    scene([
        L("Harsh", "So the throw is 4 plus 3, which is 7 squares!", "Toh throw hai 4 plus 3, yaani 7 khaane!"),
        L("Disha", "No, Harsh. 7 is the walk along the two legs. The straight throw is the slanting side, and it must be shorter.",
          "Nahi Harsh. 7 toh do legs ke saath chalna hai. Seedha throw tircha side hai, aur woh chhota hi hoga."),
    ], {"A": [1, 1], "B": [5, 4], "step": 2, "wrong": True}),
    scene([
        L("Dadi", "The slanting side is the hypotenuse of a right triangle, so use Pythagoras. 4 squared is 16, 3 squared is 9, and 16 plus 9 is 25.",
          "Tircha side ek right triangle ka hypotenuse hai, toh Pythagoras lagao. 4 ka square 16, 3 ka square 9, aur 16 plus 9 barabar 25."),
        L("Disha", "The square on the throw has area 25, so the throw is the square root of 25, which is 5 squares, or 50 metres!",
          "Throw wale square ka area 25 hai, toh throw hai 25 ka square root, yaani 5 khaane, ya 50 metre!"),
    ], {"A": [1, 1], "B": [5, 4], "step": 2}),
    scene([
        L("Dadi", "For any two points, the across part is x 2 minus x 1, and the up part is y 2 minus y 1. The distance is the square root of x 2 minus x 1, the whole squared, plus y 2 minus y 1, the whole squared.",
          "Kisi bhi do points ke liye, across hissa x 2 minus x 1 hai, aur upar wala hissa y 2 minus y 1. Doori hai square root of, x 2 minus x 1 ka poora square, plus y 2 minus y 1 ka poora square."),
        L("Dadi", "This is the distance formula. It is only Pythagoras written in coordinates.",
          "Yahi distance formula hai. Yeh coordinates mein likha hua Pythagoras hi hai."),
    ], {"A": [1, 1], "B": [5, 4], "step": 3}),
    scene([
        L("Disha", "What about negative numbers? From A, minus 2 comma 3, to B, 4 comma minus 5?",
          "Negative numbers ka kya? A, minus 2 comma 3, se B, 4 comma minus 5 tak?"),
        L("Dadi", "Across is 4 minus minus 2, which is 6. Up is minus 5 minus 3, which is minus 8. Squaring removes the minus sign. 36 plus 64 is 100, so the distance is 10.",
          "Across hai 4 minus minus 2, yaani 6. Upar hai minus 5 minus 3, yaani minus 8. Square karne se minus hat jaata hai. 36 plus 64 barabar 100, toh doori 10 hai."),
    ], {"A": [-2, 3], "B": [4, -5], "step": 3}),
    scene([
        L("Deepak", "And from the origin it is even simpler. The distance of the point x comma y from O is the square root of x squared plus y squared. For minus 3 comma 4, that is the square root of 25, which is 5.",
          "Aur origin se toh aur bhi aasaan hai. Point x comma y ki O se doori hai square root of x square plus y square. Minus 3 comma 4 ke liye, yeh 25 ka square root, yaani 5 hai."),
        L("Disha", "And it does not matter which point I call A. The squares come out the same!",
          "Aur farak nahi padta ki kis point ko main A kahoon. Squares wahi aate hain!"),
    ], {"A": [0, 0], "B": [-3, 4], "names": ["O", "P"], "step": 3}),
    scene([
        L("Harsh", "Your turn! Place the bowler and the fielder exactly 5 units apart, but on a slanting line, not along the grid.",
          "Ab aapki baari! Bowler aur fielder ko theek 5 unit door rakho, lekin tirchi line par, grid ke saath nahi."),
    ], {"A": [1, 1], "B": [2, 2], "step": 3, "task": {"d2": 25, "slant": True}}, wait=True),
]

# ───────────────────────────── Part 3 · using distances ─────────────────────────────
SCENES_3 = [
    scene([
        L("Narrator", "Mummy has rented a small shop for her bakery. She marks the shop floor on squared paper to plan where the lamps and counters go.",
          "Mummy ne apni bakery ke liye ek chhoti dukaan kiraye par li hai. Lamps aur counters kahaan lagenge, yeh plan karne ke liye woh dukaan ka farsh graph paper par banaati hain."),
        L("Neha", "I want three lamps, A at 1 comma 5, B at 2 comma 3 and C at 3 comma 1, in one straight line. Are they?",
          "Mujhe teen lamp ek seedhi line mein chahiye, A 1 comma 5 par, B 2 comma 3 par aur C 3 comma 1 par. Kya yeh ek line mein hain?"),
    ], {"pts": [[1, 5], [2, 3], [3, 1]]}),
    scene([
        L("Disha", "A B is root 5, B C is root 5, and A C is root 20, which is 2 root 5. Root 5 plus root 5 makes 2 root 5!",
          "A B root 5 hai, B C root 5, aur A C root 20, yaani 2 root 5. Root 5 plus root 5 barabar 2 root 5!"),
        L("Dadi", "When the two shorter distances add up exactly to the longest, the points are collinear. They lie on one line and make no triangle.",
          "Jab do chhoti dooriyaan jud kar theek sabse badi doori ke barabar hon, toh points collinear hote hain. Woh ek line par hain aur triangle nahi banaate."),
    ], {"pts": [[1, 5], [2, 3], [3, 1]]}),
    scene([
        L("Harsh", "Now try P at 3 comma 2, Q at minus 2 comma minus 3 and R at 2 comma 3.", "Ab P 3 comma 2, Q minus 2 comma minus 3 aur R 2 comma 3 try karo."),
        L("Disha", "P Q squared is 50, P R squared is 2 and Q R squared is 52. Root 50 plus root 2 is not root 52, so it is a triangle.",
          "P Q ka square 50, P R ka square 2 aur Q R ka square 52 hai. Root 50 plus root 2, root 52 nahi hai, toh yeh triangle hai."),
        L("Dadi", "And look, 50 plus 2 is 52. By the converse of Pythagoras, it is a right triangle, with the right angle at P.",
          "Aur dekho, 50 plus 2 barabar 52. Pythagoras ke converse se, yeh right triangle hai, aur right angle P par hai."),
    ], {"pts": [[3, 2], [-2, -3], [2, 3]], "names": ["P", "Q", "R"]}),
    scene([
        L("Neha", "My cake stand has corners A at minus 2 comma 0, B at 4 comma 0 and C at 1 comma 5. A C squared and B C squared are both 34.",
          "Mere cake stand ke kone A minus 2 comma 0, B 4 comma 0 aur C 1 comma 5 par hain. A C ka square aur B C ka square dono 34 hain."),
        L("Dadi", "Two equal sides, so the triangle is isosceles. Compare the squares of the distances, and you never need to take a square root.",
          "Do barabar sides, toh triangle isosceles hai. Dooriyon ke squares compare karo, aur square root lene ki zaroorat hi nahi padti."),
    ], {"pts": [[-2, 0], [4, 0], [1, 5]]}),
    scene([
        L("Neha", "Now the counter top. Its corners are 1 comma 7, 4 comma 2, minus 1 comma minus 1 and minus 4 comma 4. Is it a square?",
          "Ab counter top. Iske kone 1 comma 7, 4 comma 2, minus 1 comma minus 1 aur minus 4 comma 4 hain. Kya yeh square hai?"),
        L("Disha", "All four sides squared are 34, and both diagonals squared are 68. Equal sides and equal diagonals, so it is a square!",
          "Chaaron sides ka square 34 hai, aur dono diagonals ka square 68. Barabar sides aur barabar diagonals, toh yeh square hai!"),
    ], {"pts": [[1, 7], [4, 2], [-1, -1], [-4, 4]]}),
    scene([
        L("Dadi", "Careful, beta. Equal sides alone are not enough. This tray has all four sides equal to root 13, but its diagonals are 6 and 4. It is a rhombus, not a square.",
          "Dhyaan se, beta. Sirf barabar sides kaafi nahi hain. Is tray ki chaaron sides root 13 hain, lekin diagonals 6 aur 4 hain. Yeh rhombus hai, square nahi."),
    ], {"pts": [[4, 2], [1, 4], [-2, 2], [1, 0]]}),
    scene([
        L("Deepak", "On my railway map, I use the same idea to find a point on a track equidistant from two stations. Set the two distances equal, square both sides, and solve.",
          "Apne railway naksha par main isi idea se track par aisa point dhoondhta hoon jo do stations se barabar door ho. Dono dooriyaan barabar rakho, dono taraf square karo, aur solve karo."),
    ], {"pts": [[2, -5], [-2, 9], [-7, 0]], "names": ["A", "B", "P"]}),
    scene([
        L("Neha", "Your turn! Lamps A and B are fixed. Drag lamp C so that all three lamps are in one straight line.",
          "Ab aapki baari! Lamp A aur B fixed hain. Lamp C ko aise drag karo ki teeno lamp ek seedhi line mein aa jaayein."),
    ], {"pts": [[-3, -1], [1, 1], [4, 4]], "fixed": True, "task": {"type": "collinear", "text": "drag C until A, B and C are collinear"}}, wait=True),
]

# ───────────────────────────── Part 4 · the section formula ─────────────────────────────
SCENES_4 = [
    scene([
        L("Narrator", "Papa is planning a new railway line. Station A is at 4 comma minus 3 and station B is at 8 comma 5 on his map.",
          "Papa ek nayi railway line plan kar rahe hain. Unke naksha par station A, 4 comma minus 3 par hai aur station B, 8 comma 5 par."),
        L("Deepak", "The signal P must divide the track A B in the ratio 3 is to 1. Three parts from A to P, one part from P to B.",
          "Signal P ko track A B ko 3 is to 1 ke ratio mein baantna hai. A se P tak teen hisse, P se B tak ek hissa."),
    ], {"A": [4, -3], "B": [8, 5], "m": 3, "n": 1, "step": 1}),
    scene([
        L("Disha", "Why can I not just take three quarters of the coordinates?",
          "Main coordinates ka teen chauthaai hi kyun nahi le sakti?"),
        L("Dadi", "Look at the two shaded triangles. Drop lines from A, P and B. The triangles are similar by A A similarity, because their sides are parallel.",
          "Do shaded triangles dekho. A, P aur B se lines giraao. Triangles A A similarity se similar hain, kyunki unki sides parallel hain."),
    ], {"A": [4, -3], "B": [8, 5], "m": 3, "n": 1, "step": 2}),
    scene([
        L("Dadi", "So x minus x 1, divided by x 2 minus x, equals m divided by n. Solving it, x equals m times x 2 plus n times x 1, all divided by m plus n. The same works for y.",
          "Toh x minus x 1, bhaag x 2 minus x, barabar m bhaag n. Ise solve karne par, x barabar m guna x 2 plus n guna x 1, poora bhaag m plus n. Y ke liye bhi yahi."),
        L("Dadi", "This is the section formula. Notice that m goes with the far end, B.",
          "Yahi section formula hai. Dhyaan do ki m door wale sire, B, ke saath jaata hai."),
    ], {"A": [4, -3], "B": [8, 5], "m": 3, "n": 1, "step": 2}),
    scene([
        L("Disha", "x is 3 times 8 plus 1 times 4, divided by 4. That is 28 divided by 4, which is 7.",
          "x hai 3 guna 8 plus 1 guna 4, bhaag 4. Yaani 28 bhaag 4, barabar 7."),
        L("Disha", "y is 3 times 5 plus 1 times minus 3, divided by 4. That is 12 divided by 4, which is 3. The signal goes at 7 comma 3!",
          "y hai 3 guna 5 plus 1 guna minus 3, bhaag 4. Yaani 12 bhaag 4, barabar 3. Signal 7 comma 3 par lagega!"),
    ], {"A": [4, -3], "B": [8, 5], "m": 3, "n": 1, "step": 3}),
    scene([
        L("Harsh", "I did it faster. 3 times 4 plus 1 times 8 over 4 is 5, so P is at 5 comma minus 1!",
          "Maine jaldi kar liya. 3 guna 4 plus 1 guna 8, bhaag 4, yaani 5, toh P 5 comma minus 1 par hai!"),
        L("Deepak", "Harsh, you swapped them. Your point is close to A, so it divides the track in the ratio 1 is to 3. The signal would be in the wrong place!",
          "Harsh, tumne ulta kar diya. Tumhaara point A ke paas hai, toh woh track ko 1 is to 3 mein baantta hai. Signal galat jagah lag jaata!"),
    ], {"A": [4, -3], "B": [8, 5], "m": 3, "n": 1, "step": 3, "wrong": True}),
    scene([
        L("Dadi", "A quick check always helps. P must be nearer the end with the smaller share. With 3 is to 1, P is nearer B.",
          "Ek jaldi wala check hamesha kaam aata hai. P us sire ke paas hona chahiye jiska hissa chhota hai. 3 is to 1 mein, P, B ke paas hai."),
    ], {"A": [4, -3], "B": [8, 5], "m": 3, "n": 1, "step": 3}),
    scene([
        L("Deepak", "Your turn! A is at minus 1 comma 7 and B is at 4 comma minus 3. Choose m and n so that the signal lands exactly on 1 comma 3.",
          "Ab aapki baari! A minus 1 comma 7 par hai aur B 4 comma minus 3 par. m aur n aise chuno ki signal theek 1 comma 3 par aaye."),
    ], {"A": [-1, 7], "B": [4, -3], "m": 1, "n": 1, "step": 3, "task": {"P": [1, 3]}}, wait=True),
]

# ───────────────────────────── Part 5 · midpoint, trisection, parallelogram ─────────────────────────────
SCENES_5 = [
    scene([
        L("Narrator", "Diwali is near. Mummy wants to hang a string of lights between two poles in front of the shop, A at 2 comma minus 2 and B at minus 7 comma 4.",
          "Diwali paas hai. Mummy dukaan ke saamne do khambhon ke beech lights ki ladi lagaana chahti hain, A 2 comma minus 2 par aur B minus 7 comma 4 par."),
        L("Neha", "First a lamp exactly in the middle.", "Pehle theek beech mein ek diya."),
    ], {"mode": "parts", "A": [2, -2], "B": [-7, 4], "k": 2}),
    scene([
        L("Dadi", "The middle point divides A B in the ratio 1 is to 1. Put m and n equal to 1 in the section formula, and you get the midpoint formula. Add the x values and halve, add the y values and halve.",
          "Beech ka point A B ko 1 is to 1 mein baantta hai. Section formula mein m aur n dono 1 rakho, toh midpoint formula milta hai. X values jodo aur aadha karo, y values jodo aur aadha karo."),
        L("Disha", "2 plus minus 7 is minus 5, halved is minus 5 by 2. Minus 2 plus 4 is 2, halved is 1. The midpoint is minus 5 by 2 comma 1.",
          "2 plus minus 7 barabar minus 5, aadha minus 5 by 2. Minus 2 plus 4 barabar 2, aadha 1. Midpoint hai minus 5 by 2 comma 1."),
    ], {"mode": "parts", "A": [2, -2], "B": [-7, 4], "k": 2}),
    scene([
        L("Neha", "Now I want two lamps that cut the string into three equal parts.", "Ab mujhe do diye chahiye jo ladi ko teen barabar hisson mein kaatein."),
        L("Dadi", "Those are the points of trisection. P divides A B in the ratio 1 is to 2, and Q divides it in the ratio 2 is to 1.",
          "Yeh points of trisection hain. P, A B ko 1 is to 2 mein baantta hai, aur Q ise 2 is to 1 mein."),
    ], {"mode": "parts", "A": [2, -2], "B": [-7, 4], "k": 3}),
    scene([
        L("Harsh", "For P, x is 1 times minus 7 plus 2 times 2, over 3, which is minus 1. y is 1 times 4 plus 2 times minus 2, over 3, which is 0. So P is minus 1 comma 0.",
          "P ke liye, x hai 1 guna minus 7 plus 2 guna 2, bhaag 3, yaani minus 1. y hai 1 guna 4 plus 2 guna minus 2, bhaag 3, yaani 0. Toh P minus 1 comma 0 hai."),
        L("Disha", "And Q, with 2 is to 1, comes out at minus 4 comma 2. Q is also the midpoint of P and B!",
          "Aur Q, 2 is to 1 ke saath, minus 4 comma 2 aata hai. Q, P aur B ka midpoint bhi hai!"),
    ], {"mode": "parts", "A": [2, -2], "B": [-7, 4], "k": 3}),
    scene([
        L("Neha", "For the shop sign, I need a strip from minus 2 comma 2 to 2 comma 8 in four equal parts.",
          "Dukaan ke board ke liye mujhe minus 2 comma 2 se 2 comma 8 tak ki patti chaar barabar hisson mein chahiye."),
        L("Dadi", "The middle cut is the midpoint, 0 comma 5. The other two are the midpoints of each half. They divide it in the ratios 1 is to 3, 2 is to 2 and 3 is to 1.",
          "Beech ka cut midpoint hai, 0 comma 5. Baaki do, dono aadhon ke midpoints hain. Yeh 1 is to 3, 2 is to 2 aur 3 is to 1 ke ratio mein baantte hain."),
    ], {"mode": "parts", "A": [-2, 2], "B": [2, 8], "k": 4}),
    scene([
        L("Deepak", "Midpoints also test a parallelogram. Its diagonals bisect each other, so both diagonals share the same midpoint.",
          "Midpoints se parallelogram bhi check hota hai. Uske diagonals ek doosre ko bisect karte hain, toh dono diagonals ka midpoint ek hi hota hai."),
        L("Disha", "For A 1 comma 2, B 4 comma 3, C 6 comma 6 and D 3 comma 5, the midpoint of A C and of B D are both 7 by 2 comma 4!",
          "A 1 comma 2, B 4 comma 3, C 6 comma 6 aur D 3 comma 5 ke liye, A C aur B D dono ka midpoint 7 by 2 comma 4 hai!"),
    ], {"mode": "pgram", "pts": [[1, 2], [4, 3], [6, 6], [3, 5]]}),
    scene([
        L("Neha", "Your turn! The display tray has corners A, B and C fixed. Drag corner D so that A B C D is a parallelogram.",
          "Ab aapki baari! Display tray ke kone A, B aur C fixed hain. Kone D ko aise drag karo ki A B C D parallelogram ban jaaye."),
    ], {"mode": "pgram", "pts": [[-2, -1], [1, 0], [4, 3], [0, 4]], "view": [[-3, -2], [5, 5]],
        "task": {"type": "pgram", "text": "drag D until the two diagonals share one midpoint"}}, wait=True),
]

# ───────────────────────────── Part 6 · finding the ratio ─────────────────────────────
SCENES_6 = [
    scene([
        L("Narrator", "The cricket club is fixing a straight boundary rope from A, minus 6 comma 10, to B, 3 comma minus 8. A flag stands at minus 4 comma 6, right on the rope.",
          "Cricket club ek seedhi boundary rassi A, minus 6 comma 10, se B, 3 comma minus 8, tak laga raha hai. Ek jhanda minus 4 comma 6 par hai, theek rassi par."),
        L("Harsh", "This time we know the point, but not the ratio. Can we go backwards?",
          "Is baar point pata hai, lekin ratio nahi. Kya hum ulta ja sakte hain?"),
    ], {"A": [-6, 10], "B": [3, -8], "t": 0.5, "target": [-4, 6], "step": 0}),
    scene([
        L("Dadi", "Yes. Call the ratio k is to 1. Then there is only one unknown, k. P has x-coordinate 3 k minus 6, divided by k plus 1.",
          "Haan. Ratio ko k is to 1 maano. Tab sirf ek unknown hai, k. P ka x-coordinate hai 3 k minus 6, bhaag k plus 1."),
        L("Disha", "Set that equal to minus 4. 3 k minus 6 equals minus 4 k minus 4, so 7 k is 2, and k is 2 by 7. The ratio is 2 is to 7!",
          "Ise minus 4 ke barabar rakho. 3 k minus 6 barabar minus 4 k minus 4, toh 7 k barabar 2, aur k barabar 2 by 7. Ratio 2 is to 7 hai!"),
    ], {"A": [-6, 10], "B": [3, -8], "t": 2 / 9, "target": [-4, 6], "step": 2}),
    scene([
        L("Dadi", "Always check with the other coordinate. With k equal to 2 by 7, the y-coordinate also comes out as 6. If it did not, the point would not be on the line at all.",
          "Hamesha doosre coordinate se check karo. k barabar 2 by 7 rakhne par, y-coordinate bhi 6 aata hai. Agar na aata, toh point line par hota hi nahi."),
    ], {"A": [-6, 10], "B": [3, -8], "t": 2 / 9, "target": [-4, 6], "step": 2}),
    scene([
        L("Deepak", "The same trick finds where a track crosses an axis. Take A at 5 comma minus 6 and B at minus 1 comma minus 4. Where does the y-axis cut A B?",
          "Yahi trick batati hai ki track axis ko kahaan kaatta hai. A ko 5 comma minus 6 aur B ko minus 1 comma minus 4 lo. Y-axis A B ko kahaan kaatti hai?"),
        L("Dadi", "On the y-axis, x is 0. So minus k plus 5 is 0, and k is 5. The ratio is 5 is to 1, and the point is 0 comma minus 13 by 3.",
          "Y-axis par x zero hota hai. Toh minus k plus 5 barabar 0, aur k barabar 5. Ratio 5 is to 1 hai, aur point 0 comma minus 13 by 3 hai."),
    ], {"A": [5, -6], "B": [-1, -4], "t": 5 / 6, "axis": "y", "step": 2}),
    scene([
        L("Disha", "And for the x-axis, I set y equal to 0. From 1 comma minus 5 to minus 4 comma 5, 5 k minus 5 is 0, so k is 1. The x-axis cuts it exactly in half!",
          "Aur x-axis ke liye, main y ko 0 rakhti hoon. 1 comma minus 5 se minus 4 comma 5 tak, 5 k minus 5 barabar 0, toh k barabar 1. X-axis ise theek aadha kaatti hai!"),
        L("Dadi", "Yes, at minus 3 by 2 comma 0, the midpoint. If k ever comes out negative, the axis cuts the line outside the segment.",
          "Haan, minus 3 by 2 comma 0 par, jo midpoint hai. Agar k kabhi negative aaye, toh axis line ko segment ke bahar kaatti hai."),
    ], {"A": [1, -5], "B": [-4, 5], "t": 0.5, "axis": "x", "step": 2}),
    scene([
        L("Harsh", "Your turn! The rope runs from minus 3 comma minus 6 to 5 comma 2. Slide P to where the rope crosses the x-axis, and read the ratio.",
          "Ab aapki baari! Rassi minus 3 comma minus 6 se 5 comma 2 tak hai. P ko wahaan slide karo jahaan rassi x-axis ko kaatti hai, aur ratio padho."),
    ], {"A": [-3, -6], "B": [5, 2], "t": 0.3, "step": 0, "task": {"axis": "x", "text": "slide P onto the x-axis"}}, wait=True),
]

# ───────────────────────────── Part 7 · solved questions ─────────────────────────────
SCENES_7 = [
    scene([
        L("Narrator", "A week before the pre-board exam, Dadi sets a full board-style paper on coordinate geometry.",
          "Pre-board exam se ek hafta pehle, Dadi coordinate geometry par poora board jaisa paper deti hain."),
        L("Dadi", "Question 1. What is the distance of the point minus 5 comma 12 from the origin?",
          "Sawaal 1. Point minus 5 comma 12 ki origin se doori kitni hai?"),
    ], {"example": 0, "step": 0}),
    scene([
        L("Harsh", "Square root of 25 plus 144, which is the square root of 169. That is 13, option C!",
          "25 plus 144 ka square root, yaani 169 ka square root. Yeh 13 hai, option C!"),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. The points 1 comma 2, 4 comma y, x comma 6 and 3 comma 5, taken in order, form a parallelogram. Find x and y.",
          "Sawaal 2. Points 1 comma 2, 4 comma y, x comma 6 aur 3 comma 5, kram se, ek parallelogram banaate hain. x aur y nikaalo."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Disha", "The diagonals bisect each other. So 1 plus x over 2 equals 7 by 2, giving x equals 6. And 8 over 2 equals y plus 5 over 2, giving y equals 3.",
          "Diagonals ek doosre ko bisect karte hain. Toh 1 plus x bhaag 2 barabar 7 by 2, isse x barabar 6. Aur 8 bhaag 2 barabar y plus 5 bhaag 2, isse y barabar 3."),
        L("Dadi", "Shabash. Write the reason first, then the working. Examiners give a mark for the reason.",
          "Shabash. Pehle kaaran likho, phir working. Examiner kaaran ke liye bhi number dete hain."),
    ], {"example": 1, "step": 4}),
    scene([
        L("Dadi", "Now try the other eight yourselves, in your notebooks, before you reveal the steps.",
          "Ab baaki aath khud se notebook mein karo, steps kholne se pehle."),
    ], {"example": 2, "step": 0}),
]


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: The Railway Yard Map · Points, Quadrants and Distance on a Line",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Papa spreads a squared map of the railway yard on the table. Every signal has an address, and Harsh and Disha revise the coordinate plane from Class 9 before the boards.</div>

<h2>Revision: the Cartesian plane</h2>
<div {CARD}>
  <div>Two perpendicular number lines, the <strong>x-axis</strong> and the <strong>y-axis</strong>, meet at the <strong>origin</strong> O (0, 0).</div>
  <div>A point P(x, y): x is the <strong class="text-sky-300">x-coordinate (abscissa)</strong>, its distance from the y-axis; y is the <strong class="text-pink-300">y-coordinate (ordinate)</strong>, its distance from the x-axis.</div>
  <div>Points on the x-axis are (x, 0); points on the y-axis are (0, y).</div>
</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Quadrant</th><th>Signs</th><th>Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>I</td><td class="text-center">(+, +)</td><td class="text-center">(4, 3)</td></tr>
    <tr><td>II</td><td class="text-center">(−, +)</td><td class="text-center">(−3, 2)</td></tr>
    <tr><td>III</td><td class="text-center">(−, −)</td><td class="text-center">(−4, −3)</td></tr>
    <tr><td>IV</td><td class="text-center">(+, −)</td><td class="text-center">(5, −1)</td></tr>
  </tbody>
</table>
<p>The system is named after René Descartes, whose <em>La Géométrie</em> (1637) joined algebra and geometry.</p>

<h2>Distance along a grid line</h2>
<div {FORMULA}>Same y (horizontal): d = |x₂ − x₁| &nbsp;&nbsp; Same x (vertical): d = |y₂ − y₁|</div>
<div {CARD}>
  <div>A(1, 2), B(7, 2): d = |7 − 1| = 6 units.</div>
  <div>(3, −1) and (3, 5): d = |5 − (−1)| = 6 units.</div>
  <div>For points not on one grid line, counting squares fails: we need the distance formula (Story 2).</div>
</div>
""",
        "keyInsight": "A point's coordinates are its distances from the two axes, with signs telling the side; on one grid line, distance is just a difference.",
        "widgetType": "Class10CoordGeoPlaneWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "In which quadrant does the point (−5, −2) lie, and how far is it from the x-axis?",
            "options": ["Quadrant II, 5 units", "Quadrant III, 2 units", "Quadrant III, 5 units", "Quadrant IV, 2 units"],
            "correctIndex": 1,
            "explanation": "Both coordinates are negative, so Quadrant III. The distance from the x-axis is |y| = 2 units.",
        },
        "teacherNotes": teacher(
            [
                "Spend only a few minutes on the recap: plot 4–5 points with the class, one in each quadrant and one on each axis.",
                "Stress that the x-coordinate is the distance from the y-axis (not the x-axis) — the dashed lines in the widget show it.",
                "Finish with the horizontal/vertical distance to motivate Story 2.",
            ],
            [
                "Swapping x and y when plotting (writing (3, 4) for 4 right, 3 up).",
                "Saying (0, 5) lies on the x-axis.",
                "Getting |5 − (−1)| = 4 instead of 6.",
            ],
            "Classroom grid: tape axes on the floor; students stand at called-out coordinates and others give the quadrant and distances from both axes.",
            "NCERT Class 10 Ch. 7, Section 7.1 (recap of Class 9 Ch. 3, Coordinate Geometry).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: The Cricket Ground · The Distance Formula",
        "readingTime": "~8 min story",
        "narrative": f"""
<div {STORY}>Harsh wants to know how far a straight throw from the bowler to a fielder is. Adding the two grid walks gives the wrong answer; Pythagoras gives the right one.</div>

<h2>From Pythagoras to the distance formula</h2>
<p>Let P(x₁, y₁) and Q(x₂, y₂). Draw a horizontal line through P and a vertical line through Q; they meet at R(x₂, y₁) with ∠PRQ = 90°.</p>
<div {CARD}>
  <div>PR = |x₂ − x₁| and RQ = |y₂ − y₁|.</div>
  <div>By the Pythagoras theorem in right ΔPRQ: PQ² = PR² + RQ² = (x₂ − x₁)² + (y₂ − y₁)².</div>
  <div>Squaring removes the signs, so the order of the points does not matter.</div>
</div>
<div {FORMULA}>PQ = √[(x₂ − x₁)² + (y₂ − y₁)²]</div>
<div {FORMULA}>Distance of P(x, y) from the origin = √(x² + y²)</div>

<h2>Worked examples</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Points</th><th class="text-left">Working</th><th>Distance</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>(1, 1), (5, 4)</td><td>√(4² + 3²) = √25</td><td class="text-center">5</td></tr>
    <tr><td>(−2, 3), (4, −5)</td><td>√(6² + (−8)²) = √100</td><td class="text-center">10</td></tr>
    <tr><td>O, (−3, 4)</td><td>√(9 + 16) = √25</td><td class="text-center">5</td></tr>
    <tr><td>(2, 3), (4, 1)</td><td>√(4 + 4) = √8</td><td class="text-center">2√2</td></tr>
  </tbody>
</table>
<p><strong>Common trap:</strong> (x₂ − x₁) + (y₂ − y₁) = 4 + 3 = 7 is the walk along the legs, not the straight distance.</p>
""",
        "keyInsight": "The distance formula is Pythagoras on the grid: square the across and up differences, add, and take the square root.",
        "widgetType": "Class10CoordGeoDistanceWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "The distance between A(−1, 3) and B(5, −5) is:",
            "options": ["8", "10", "14", "√28"],
            "correctIndex": 1,
            "explanation": "x₂ − x₁ = 6 and y₂ − y₁ = −8, so AB = √(36 + 64) = √100 = 10.",
        },
        "teacherNotes": teacher(
            [
                "Start with Harsh's wrong answer (4 + 3 = 7) and ask the class why a straight throw must be shorter.",
                "Draw the right triangle every time for the first few examples; then drop it.",
                "Show that swapping P and Q gives the same answer, because (−a)² = a².",
            ],
            [
                "Forgetting to square: √(4 + 3).",
                "Sign errors with negatives: 4 − (−2) written as 2.",
                "Writing √(a² + b²) = a + b.",
            ],
            "Playground throw: mark a grid on the ground with chalk (1 square = 1 m). Pairs stand at grid points, predict the distance by the formula, then measure with a tape.",
            "NCERT Class 10 Ch. 7, Section 7.2 (Distance Formula), Exercise 7.1.",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Mummy's New Shop · Collinear Points, Triangles and Quadrilaterals",
        "readingTime": "~9 min story",
        "narrative": f"""
<div {STORY}>Mummy plans her new bakery shop on squared paper. Are three lamps in a straight line? Is the counter top a square? The distance formula answers both.</div>

<h2>Collinear or a triangle?</h2>
<div {FORMULA}>A, B, C collinear ⇔ (sum of the two smaller distances) = (largest distance)</div>
<div {CARD}>
  <div>A(1, 5), B(2, 3), C(3, 1): AB = √5, BC = √5, AC = √20 = 2√5. Since √5 + √5 = 2√5, A, B, C are <strong>collinear</strong>.</div>
  <div>P(3, 2), Q(−2, −3), R(2, 3): PQ² = 50, PR² = 2, QR² = 52. √50 + √2 ≠ √52, so they form a triangle; and 50 + 2 = 52, so it is <strong>right-angled at P</strong>.</div>
</div>

<h2>Which kind of triangle or quadrilateral?</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Shape</th><th class="text-left">Test with distances</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Isosceles / equilateral triangle</td><td>two / three sides equal</td></tr>
    <tr><td>Right triangle</td><td>sum of squares of two sides = square of the third</td></tr>
    <tr><td>Parallelogram</td><td>opposite sides equal (or diagonals bisect each other)</td></tr>
    <tr><td>Rhombus</td><td>all four sides equal</td></tr>
    <tr><td>Rectangle</td><td>opposite sides equal and diagonals equal</td></tr>
    <tr><td>Square</td><td>all four sides equal and diagonals equal</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>(1, 7), (4, 2), (−1, −1), (−4, 4): every side² = 34, both diagonals² = 68 ⇒ <strong>square</strong>.</div>
  <div>(4, 2), (1, 4), (−2, 2), (1, 0): every side² = 13 but diagonals are 6 and 4 ⇒ <strong>rhombus</strong>, not a square.</div>
  <div>Tip: compare squares of distances; you rarely need the square roots.</div>
</div>

<h2>A point equidistant from two points</h2>
<div {CARD}>
  <div>Point on the x-axis equidistant from A(2, −5) and B(−2, 9): let P(x, 0). PA² = PB² ⇒ (x − 2)² + 25 = (x + 2)² + 81 ⇒ −8x = 56 ⇒ x = −7. P = (−7, 0).</div>
</div>
""",
        "keyInsight": "Distances alone decide whether points are collinear and what kind of triangle or quadrilateral they make.",
        "widgetType": "Class10CoordGeoShapesWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "A quadrilateral has all four sides equal but unequal diagonals. It is a:",
            "options": ["Square", "Rectangle", "Rhombus", "Trapezium"],
            "correctIndex": 2,
            "explanation": "Equal sides make it a rhombus; it would be a square only if the diagonals were also equal.",
        },
        "teacherNotes": teacher(
            [
                "Insist on computing all three (or all six) squared distances first, in a neat table, before deciding.",
                "For quadrilaterals, always check the diagonals: equal sides alone give only a rhombus.",
                "Show the equidistant-point method: write PA² = PB², the x² terms cancel, leaving a linear equation.",
            ],
            [
                "Calling a rhombus a square without checking the diagonals.",
                "Adding squared distances to test collinearity (5 + 5 = 20 is false, but √5 + √5 = √20 is true).",
                "Taking vertices out of order when naming sides and diagonals.",
            ],
            "Shape detectives: each group gets four coordinates on a card, computes the six squared distances and names the shape; groups swap and check.",
            "NCERT Class 10 Ch. 7, Section 7.2, Examples 1–4 and Exercise 7.1.",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Papa's New Railway Line · The Section Formula",
        "readingTime": "~9 min story",
        "narrative": f"""
<div {STORY}>Papa must put a signal on a new line so that it divides the track between two stations in the ratio 3 : 1. Similar triangles turn this into a formula.</div>

<h2>Proof using similar triangles</h2>
<p>Let P(x, y) divide A(x₁, y₁)B(x₂, y₂) internally so that AP : PB = m : n. Draw AR, PS, BT perpendicular to the x-axis, and AQ, PC parallel to it.</p>
<div {CARD}>
  <div>ΔPAQ ~ ΔBPC (AA similarity), so PA/BP = AQ/PC = PQ/BC.</div>
  <div>AQ = x − x₁, PC = x₂ − x, so m/n = (x − x₁)/(x₂ − x) ⇒ mx₂ − mx = nx − nx₁ ⇒ x = (mx₂ + nx₁)/(m + n).</div>
  <div>In the same way, y = (my₂ + ny₁)/(m + n).</div>
</div>
<div {FORMULA}>P(x, y) = ( (m x₂ + n x₁)/(m + n) , (m y₂ + n y₁)/(m + n) )</div>
<p><strong>m goes with the far end B</strong>, n with the near end A. Check: P lies nearer the end with the smaller share.</p>

<h2>Example</h2>
<div {CARD}>
  <div>A(4, −3), B(8, 5), m : n = 3 : 1.</div>
  <div>x = (3 × 8 + 1 × 4)/4 = 28/4 = 7; y = (3 × 5 + 1 × (−3))/4 = 12/4 = 3. <strong>P(7, 3)</strong>.</div>
  <div>Swapping m and n gives (5, −1), which divides AB in 1 : 3 — the wrong point.</div>
</div>
""",
        "keyInsight": "The section formula is a weighted average: each end is weighted by the share of the opposite part.",
        "widgetType": "Class10CoordGeoSectionWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "The point dividing the join of (−1, 7) and (4, −3) in the ratio 2 : 3 is:",
            "options": ["(2, 1)", "(1, 3)", "(3, 1)", "(1, 2)"],
            "correctIndex": 1,
            "explanation": "x = (2 × 4 + 3 × (−1))/5 = 5/5 = 1; y = (2 × (−3) + 3 × 7)/5 = 15/5 = 3. So (1, 3).",
        },
        "teacherNotes": teacher(
            [
                "Draw the proof figure in full once; the board expects the similar-triangle argument for the derivation.",
                "Use the 'cross weights' picture: m multiplies B's coordinate, n multiplies A's.",
                "Teach the sanity check: P should be nearer the end with the smaller ratio number.",
            ],
            [
                "Swapping m and n (getting (5, −1) instead of (7, 3)).",
                "Dividing by m instead of m + n.",
                "Sign errors with negative coordinates inside the brackets.",
            ],
            "Rope and beads: stretch a rope between two students standing at grid points; another student stands at the predicted section point and the class checks with a tape measure.",
            "NCERT Class 10 Ch. 7, Section 7.3 (Section Formula), Example 6, Exercise 7.2.",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Diwali Lights · Midpoint, Trisection and Equal Parts",
        "readingTime": "~8 min story",
        "narrative": f"""
<div {STORY}>For Diwali, Mummy hangs lamps along a string of lights: one in the middle, then two that cut it into three equal parts. Papa shows how midpoints test a parallelogram.</div>

<h2>Midpoint formula (m = n = 1)</h2>
<div {FORMULA}>Midpoint of (x₁, y₁) and (x₂, y₂) = ( (x₁ + x₂)/2 , (y₁ + y₂)/2 )</div>
<div {CARD}><div>A(2, −2), B(−7, 4): M = ((2 − 7)/2, (−2 + 4)/2) = (−5/2, 1).</div></div>

<h2>Points of trisection</h2>
<p>Two points P and Q divide AB into three equal parts: P divides it in 1 : 2 and Q in 2 : 1.</p>
<div {CARD}>
  <div>A(2, −2), B(−7, 4).</div>
  <div>P (1 : 2): ((1 × (−7) + 2 × 2)/3, (1 × 4 + 2 × (−2))/3) = (−1, 0).</div>
  <div>Q (2 : 1): ((2 × (−7) + 1 × 2)/3, (2 × 4 + 1 × (−2))/3) = (−4, 2).</div>
  <div>Check: Q is the midpoint of PB.</div>
</div>
<p><strong>n equal parts:</strong> the i-th division point divides AB in the ratio i : (n − i). Example: A(−2, 2), B(2, 8) in four parts gives (−1, 7/2), (0, 5), (1, 13/2).</p>

<h2>Using midpoints: the parallelogram</h2>
<div {FORMULA}>Diagonals of a parallelogram bisect each other ⇒ mid(AC) = mid(BD)</div>
<div {CARD}>
  <div>(1, 2), (4, y), (x, 6), (3, 5) in order form a parallelogram: ((1 + x)/2, 4) = (7/2, (y + 5)/2) ⇒ x = 6, y = 3.</div>
</div>
""",
        "keyInsight": "Midpoint and trisection points are just the section formula with ratios 1 : 1, 1 : 2 and 2 : 1.",
        "widgetType": "Class10CoordGeoPartsWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "The points of trisection of the join of (4, −1) and (−2, −3) are:",
            "options": ["(2, −5/3) and (0, −7/3)", "(1, −2) and (0, −2)", "(2, −2) and (0, −3)", "(3, −5/3) and (0, −7/3)"],
            "correctIndex": 0,
            "explanation": "1 : 2 gives ((−2 + 8)/3, (−3 − 2)/3) = (2, −5/3); 2 : 1 gives ((−4 + 4)/3, (−6 − 1)/3) = (0, −7/3).",
        },
        "teacherNotes": teacher(
            [
                "Derive the midpoint formula from the section formula with m = n = 1, so students see one idea, not two.",
                "For trisection, find both points with the section formula and check that one is the midpoint of the other part.",
                "Link the parallelogram test to the Class 9 theorem that diagonals bisect each other.",
            ],
            [
                "Subtracting instead of adding in the midpoint formula.",
                "Using 1 : 3 for a point of trisection.",
                "Joining the wrong vertices as diagonals (AB and CD instead of AC and BD).",
            ],
            "Paper-strip folding: fold a strip in half and in thirds; place it on a grid with ends at given points and read the fold points' coordinates.",
            "NCERT Class 10 Ch. 7, Section 7.3, Examples 7 and 9, Exercise 7.2.",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: The Boundary Rope · Finding the Ratio",
        "readingTime": "~8 min story",
        "narrative": f"""
<div {STORY}>A flag stands on the cricket boundary rope. The point is known, the ratio is not. Dadi's k : 1 trick turns the question around.</div>

<h2>The k : 1 method</h2>
<p>Let the ratio be k : 1. Then P = ((k x₂ + x₁)/(k + 1), (k y₂ + y₁)/(k + 1)) has only one unknown, k.</p>
<div {FORMULA}>AP : PB = k : 1, with P = ( (k x₂ + x₁)/(k + 1) , (k y₂ + y₁)/(k + 1) )</div>
<div {CARD}>
  <div>In what ratio does (−4, 6) divide A(−6, 10), B(3, −8)?</div>
  <div>x: (3k − 6)/(k + 1) = −4 ⇒ 3k − 6 = −4k − 4 ⇒ 7k = 2 ⇒ k = 2/7. Ratio <strong>2 : 7</strong>.</div>
  <div>Check y: (−8 × 2/7 + 10)/(2/7 + 1) = (54/7)/(9/7) = 6 ✔.</div>
</div>

<h2>Where an axis cuts a segment</h2>
<div {FORMULA}>x-axis: put y = 0 &nbsp;&nbsp;|&nbsp;&nbsp; y-axis: put x = 0</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Segment</th><th class="text-left">Working</th><th>Ratio, point</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>(5, −6), (−1, −4), y-axis</td><td>(−k + 5)/(k + 1) = 0 ⇒ k = 5</td><td class="text-center">5 : 1, (0, −13/3)</td></tr>
    <tr><td>(1, −5), (−4, 5), x-axis</td><td>(5k − 5)/(k + 1) = 0 ⇒ k = 1</td><td class="text-center">1 : 1, (−3/2, 0)</td></tr>
    <tr><td>(−3, −6), (5, 2), x-axis</td><td>(2k − 6)/(k + 1) = 0 ⇒ k = 3</td><td class="text-center">3 : 1, (3, 0)</td></tr>
  </tbody>
</table>
<p>If k comes out negative, the axis meets the line outside the segment (external division, not in the syllabus).</p>
""",
        "keyInsight": "Take the ratio as k : 1, so one equation in one coordinate gives k; use the other coordinate to check.",
        "widgetType": "Class10CoordGeoRatioWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "In what ratio does the y-axis divide the join of (5, −6) and (−1, −4)?",
            "options": ["1 : 5", "5 : 1", "6 : 1", "1 : 6"],
            "correctIndex": 1,
            "explanation": "On the y-axis x = 0: (−k + 5)/(k + 1) = 0 ⇒ k = 5, so the ratio is 5 : 1.",
        },
        "teacherNotes": teacher(
            [
                "Explain why k : 1 helps: m : n has two unknowns, but only the ratio matters.",
                "Always use the second coordinate to check; it also confirms the point is on the segment.",
                "For axis questions, the condition (x = 0 or y = 0) gives k directly.",
            ],
            [
                "Putting x = 0 for the x-axis (it is y = 0).",
                "Reporting k = 2/7 as the ratio 7 : 2.",
                "Not checking with the other coordinate.",
            ],
            "Reverse challenge: one group picks a ratio and finds the point; another group gets only the point and must recover the ratio with the k : 1 method.",
            "NCERT Class 10 Ch. 7, Section 7.3, Example 8, Exercise 7.2.",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 board-style problems, step by step",
        "readingTime": "~12 min",
        "narrative": f"""
<div {STORY}>A week before the pre-boards, Dadi sets a full board-style paper: MCQ, short answer, long answer, assertion–reason and a case study.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Distance: √[(x₂ − x₁)² + (y₂ − y₁)²]; compare squares to avoid roots.</li>
  <li>Collinear: the two smaller distances add up to the largest.</li>
  <li>Section formula: ((mx₂ + nx₁)/(m + n), (my₂ + ny₁)/(m + n)); midpoint uses m = n = 1.</li>
  <li>Unknown ratio: take k : 1. Axis crossing: put x = 0 or y = 0.</li>
  <li>Parallelogram: diagonals have the same midpoint.</li>
</ol>
<p>Use the question buttons. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Two formulas, distance and section, plus the k : 1 trick, answer every question in this chapter.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "MCQ · Distance from the origin",
                    "question": "The distance of the point (−5, 12) from the origin is: (a) 7 (b) 17 (c) 13 (d) √119",
                    "steps": [
                        "Distance from O = √(x² + y²)",
                        "= √((−5)² + 12²) = √(25 + 144)",
                        "= √169 = 13, so <strong>(c)</strong>",
                    ],
                    "answer": "(c) 13",
                },
                {
                    "title": "Long answer · Parallelogram",
                    "question": "The points (1, 2), (4, y), (x, 6) and (3, 5), taken in order, are the vertices of a parallelogram. Find x and y.",
                    "steps": [
                        "Let A(1, 2), B(4, y), C(x, 6), D(3, 5). Diagonals of a parallelogram bisect each other, so mid(AC) = mid(BD).",
                        "mid(AC) = ((1 + x)/2, 4); mid(BD) = (7/2, (y + 5)/2)",
                        "(1 + x)/2 = 7/2 ⇒ x = 6",
                        "(y + 5)/2 = 4 ⇒ y = 3. <strong>x = 6, y = 3</strong>",
                    ],
                    "answer": "x = 6, y = 3",
                },
                {
                    "title": "Short answer · Equidistant point",
                    "question": "Find the point on the x-axis which is equidistant from (2, −5) and (−2, 9).",
                    "steps": [
                        "Let P(x, 0). PA = PB ⇒ PA² = PB².",
                        "(x − 2)² + 25 = (x + 2)² + 81",
                        "x² − 4x + 29 = x² + 4x + 85 ⇒ −8x = 56 ⇒ x = −7",
                        "<strong>P(−7, 0)</strong>",
                    ],
                    "answer": "(−7, 0)",
                },
                {
                    "title": "Short answer · Collinearity",
                    "question": "Show that the points A(1, 5), B(2, 3) and C(−2, 11) are collinear.",
                    "steps": [
                        "AB = √(1² + (−2)²) = √5",
                        "BC = √((−4)² + 8²) = √80 = 4√5",
                        "AC = √((−3)² + 6²) = √45 = 3√5",
                        "AB + AC = √5 + 3√5 = 4√5 = BC, so <strong>A, B, C are collinear</strong>.",
                    ],
                    "answer": "Collinear",
                },
                {
                    "title": "Long answer · Square",
                    "question": "Show that A(1, 7), B(4, 2), C(−1, −1) and D(−4, 4) are the vertices of a square.",
                    "steps": [
                        "AB² = 9 + 25 = 34; BC² = 25 + 9 = 34; CD² = 9 + 25 = 34; DA² = 25 + 9 = 34",
                        "All four sides are equal (√34).",
                        "Diagonals: AC² = 4 + 64 = 68; BD² = 64 + 4 = 68, so AC = BD.",
                        "Equal sides and equal diagonals ⇒ <strong>ABCD is a square</strong>.",
                    ],
                    "answer": "Square",
                },
                {
                    "title": "Short answer · Section formula",
                    "question": "Find the coordinates of the point which divides the join of (−1, 7) and (4, −3) in the ratio 2 : 3.",
                    "steps": [
                        "m = 2, n = 3, (x₁, y₁) = (−1, 7), (x₂, y₂) = (4, −3)",
                        "x = (2 × 4 + 3 × (−1))/5 = 5/5 = 1",
                        "y = (2 × (−3) + 3 × 7)/5 = 15/5 = 3",
                        "<strong>(1, 3)</strong>",
                    ],
                    "answer": "(1, 3)",
                },
                {
                    "title": "Short answer · Trisection",
                    "question": "Find the coordinates of the points of trisection of the line segment joining (4, −1) and (−2, −3).",
                    "steps": [
                        "P divides it in 1 : 2: x = (1 × (−2) + 2 × 4)/3 = 2, y = (1 × (−3) + 2 × (−1))/3 = −5/3",
                        "Q divides it in 2 : 1: x = (2 × (−2) + 1 × 4)/3 = 0, y = (2 × (−3) + 1 × (−1))/3 = −7/3",
                        "<strong>(2, −5/3) and (0, −7/3)</strong>",
                    ],
                    "answer": "(2, −5/3), (0, −7/3)",
                },
                {
                    "title": "Short answer · Finding the ratio",
                    "question": "In what ratio does the point (−4, 6) divide the line segment joining A(−6, 10) and B(3, −8)?",
                    "steps": [
                        "Let the ratio be k : 1. x = (3k − 6)/(k + 1) = −4",
                        "3k − 6 = −4k − 4 ⇒ 7k = 2 ⇒ k = 2/7",
                        "Check y: (−8k + 10)/(k + 1) = (−16/7 + 70/7)/(9/7) = 54/9 = 6 ✔",
                        "Ratio <strong>2 : 7</strong>",
                    ],
                    "answer": "2 : 7",
                },
                {
                    "title": "Assertion–Reason",
                    "question": "Assertion (A): If the midpoint of the join of (3, 4) and (k, 7) is (x, y) and 2x + 2y + 1 = 0, then k = −15.<br>Reason (R): The midpoint of (x₁, y₁) and (x₂, y₂) is ((x₁ + x₂)/2, (y₁ + y₂)/2).<br>(a) Both true, R explains A (b) Both true, R does not explain A (c) A true, R false (d) A false, R true",
                    "steps": [
                        "R is the midpoint formula: true.",
                        "x = (3 + k)/2, y = 11/2",
                        "2x + 2y + 1 = (3 + k) + 11 + 1 = k + 15 = 0 ⇒ k = −15, so A is true.",
                        "A was found using R ⇒ <strong>(a)</strong>",
                    ],
                    "answer": "(a)",
                },
                {
                    "title": "Case study · Mummy's deliveries",
                    "question": "On a map with 1 unit = 1 km, Mummy's shop is at S(2, 3) and a customer's house is at H(10, 9). (i) Find the straight distance SH. (ii) A tea stall is exactly halfway: find it. (iii) A traffic signal divides SH in the ratio 1 : 3 from S: find it.",
                    "steps": [
                        "(i) SH = √(8² + 6²) = √100 = 10 km",
                        "(ii) Midpoint = ((2 + 10)/2, (3 + 9)/2) = (6, 6)",
                        "(iii) x = (1 × 10 + 3 × 2)/4 = 16/4 = 4; y = (1 × 9 + 3 × 3)/4 = 18/4 = 9/2",
                        "<strong>10 km; (6, 6); (4, 9/2)</strong>",
                    ],
                    "answer": "10 km, (6, 6), (4, 9/2)",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Insist on a first line naming the formula and the values of m, n, x₁, y₁, x₂, y₂ — it earns method marks.",
                "Q4, Q5: tabulate squared distances before concluding.",
                "Q8: always show the check with the second coordinate.",
            ],
            [
                "Q2: equating mid(AB) and mid(CD) instead of the diagonals.",
                "Q6, Q7: swapping m and n.",
                "Q9: forgetting the +1 in 2x + 2y + 1.",
            ],
            "Pair-share: one student names the tool for each question (distance, section, k : 1, midpoint), the partner solves; swap.",
            "Covers NCERT Class 10 Ch. 7 Exercises 7.1 and 7.2 and the CBSE question pattern (MCQ, SA, LA, AR, case study).",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Coordinate Geometry (80% to pass)",
        "readingTime": "~12 min exam",
        "narrative": f"""
<p>From Papa's railway map to the boundary rope, you have measured distances, tested shapes and divided segments. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 board-style questions</strong> on the distance formula, collinearity, shapes, the section formula, midpoints and finding the ratio, including assertion–reason.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Distance formula for lengths, section formula for points, k : 1 for unknown ratios.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Coordinate Geometry · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "The distance of the point (−6, 8) from the origin is:", "options": ["6", "8", "10", "14"], "answer": 2, "explanation": "√(36 + 64) = √100 = 10.", "topic": "Distance formula"},
                {"q": "The distance between (2, 3) and (4, 1) is:", "options": ["2", "2√2", "4", "√10"], "answer": 1, "explanation": "√((4 − 2)² + (1 − 3)²) = √(4 + 4) = √8 = 2√2.", "topic": "Distance formula"},
                {"q": "The point which divides the join of (−1, 7) and (4, −3) in the ratio 2 : 3 is:", "options": ["(1, 3)", "(2, 1)", "(3, 1)", "(1, 2)"], "answer": 0, "explanation": "x = (8 − 3)/5 = 1, y = (−6 + 21)/5 = 3.", "topic": "Section formula"},
                {"q": "The midpoint of the join of (−3, 5) and (7, −1) is:", "options": ["(5, 3)", "(2, 2)", "(4, 4)", "(2, 3)"], "answer": 1, "explanation": "((−3 + 7)/2, (5 − 1)/2) = (2, 2).", "topic": "Midpoint"},
                {"q": "The ratio in which the x-axis divides the join of (1, −5) and (−4, 5) is:", "options": ["1 : 1", "1 : 2", "2 : 1", "5 : 4"], "answer": 0, "explanation": "On the x-axis y = 0: (5k − 5)/(k + 1) = 0 ⇒ k = 1, so 1 : 1.", "topic": "Finding the ratio"},
                {"q": "The points (1, 5), (2, 3) and (−2, 11) are:", "options": ["vertices of a right triangle", "collinear", "vertices of an equilateral triangle", "vertices of an isosceles triangle"], "answer": 1, "explanation": "AB = √5, AC = 3√5, BC = 4√5, and √5 + 3√5 = 4√5, so they are collinear.", "topic": "Collinearity"},
                {"q": "Assertion (A): The points P(3, 2), Q(−2, −3) and R(2, 3) form a right triangle. Reason (R): If the sum of the squares of two sides equals the square of the third side, the triangle is right-angled.", "options": ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"], "answer": 0, "explanation": "PQ² = 50, PR² = 2, QR² = 52 and 50 + 2 = 52. R (converse of Pythagoras) is true and gives A.", "topic": "Types of triangles"},
                {"q": "The ratio in which the y-axis divides the join of (5, −6) and (−1, −4) is:", "options": ["1 : 5", "5 : 1", "6 : 1", "1 : 6"], "answer": 1, "explanation": "On the y-axis x = 0: (−k + 5)/(k + 1) = 0 ⇒ k = 5, so 5 : 1.", "topic": "Finding the ratio"},
                {"q": "If P(x, y) is equidistant from (3, 6) and (−3, 4), then:", "options": ["3x + y = 5", "x + 3y = 5", "3x − y = 5", "x − 3y = 5"], "answer": 0, "explanation": "(x − 3)² + (y − 6)² = (x + 3)² + (y − 4)² ⇒ −12x − 4y + 20 = 0 ⇒ 3x + y = 5.", "topic": "Distance formula"},
                {"q": "Assertion (A): The distance of the point (5, −12) from the x-axis is 12 units. Reason (R): The distance of a point (x, y) from the x-axis is |x|.", "options": ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"], "answer": 2, "explanation": "The distance from the x-axis is |y| = 12, so A is true; R is false (|x| is the distance from the y-axis).", "topic": "Coordinates"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q2 catches forgetting to simplify √8; Q5 and Q8 catch mixing up the axes; Q10 catches x versus y distance."],
            "Exit ticket: find the point dividing (2, −2) and (−7, 4) in 1 : 2, and show that it is at distance √13 from A.",
            "Matches NCERT Class 10 Ch. 7 (rationalised) learning outcomes and the CBSE board pattern.",
        ),
    },
]


def seed_class10_story_coordinate_geometry():
    db = SessionLocal()
    try:
        topic = get_class10_topic(db, "Coordinate Geometry")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 10 Coordinate Geometry: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Coordinate Geometry: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class10_story_coordinate_geometry()
