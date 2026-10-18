import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Understanding Elementary Shapes (old NCERT Ch. 4 "Basic Geometrical Ideas" shapes part + Ch. 5
# "Understanding Elementary Shapes"; Ganita Prakash shapes/angle-sum ideas). Story: the Jaipur family during
# the festival season: Diwali rangoli, samosas, a tile shop, Independence Day and packing Diwali gift boxes.


SCENES_1 = [
    scene([
        L("Narrator", "Diwali is three days away. Disha is drawing a rangoli with chalk at the front door.",
          "Diwali mein teen din baaki hain. Disha darwaaze par chalk se rangoli bana rahi hai."),
        L("Disha", "Dadi, my chalk line wandered off and never came back!", "Dadi, meri chalk ki line ghoomte ghoomte kahin chali gayi aur wapas hi nahi aayi!"),
        L("Dadi", "That is an open curve. It does not end where it began. In maths, anything you draw without lifting the chalk is a curve, even a straight line!",
          "Yeh open curve hai. Yeh wahan khatam nahi hota jahan se shuru hua. Maths mein chalk uthaaye bina jo bhi banao, woh curve hai, seedhi line bhi!"),
    ], {"mode": "curves", "curve": "open"}),
    scene([
        L("Harsh", "Mine goes all the way round and comes back to where it started!", "Mera wala poora ghoom kar wahin wapas aa gaya jahan se shuru hua tha!"),
        L("Dadi", "That is a closed curve. And because it never crosses itself, we call it a simple closed curve.",
          "Yeh closed curve hai. Aur kyonki yeh khud ko kabhi nahi kaatta, ise simple closed curve kehte hain."),
    ], {"mode": "curves", "curve": "closed"}),
    scene([
        L("Disha", "I drew a figure of eight. It is closed too!", "Maine aath ka aakaar banaya. Yeh bhi toh closed hai!"),
        L("Dadi", "It is closed, but look here, it crosses itself. So it is NOT a simple closed curve.",
          "Closed toh hai, lekin yahan dekho, yeh khud ko kaat raha hai. Isliye yeh simple closed curve NAHI hai."),
    ], {"mode": "curves", "curve": "crossing"}),
    scene([
        L("Dadi", "A simple closed curve splits the floor into three parts. The inside is the interior. The curve itself is the boundary. Everything outside is the exterior.",
          "Simple closed curve zameen ko teen hisson mein baant deta hai. Andar ka hissa interior hai. Curve khud boundary hai. Aur bahar sab kuch exterior hai."),
        L("Harsh", "Like our house! The rooms inside, the walls, and the street outside.", "Bilkul hamare ghar ki tarah! Andar kamre, deewarein, aur bahar sadak."),
    ], {"mode": "curves", "curve": "closed", "regions": True}),
    scene([
        L("Dadi", "Your turn. Drag the white probe into the interior of the curve, where Disha will place the diyas.",
          "Ab aapki baari. Safed probe ko curve ke interior mein le jaao, jahan Disha diye rakhegi."),
    ], {"mode": "curves", "curve": "closed", "regions": True, "probe": [540, 60], "task": "interior"}, wait=True),
    scene([
        L("Neha", "Now look at my rangoli stencil. It is made only of straight line segments, joined end to end, and it is closed.",
          "Ab meri rangoli ka stencil dekho. Yeh sirf seedhe line segments se bana hai, ek ke baad ek jude hue, aur band hai."),
        L("Dadi", "A simple closed figure made only of line segments is called a polygon. The segments are its sides.",
          "Jo simple closed aakaar sirf line segments se bana ho, use polygon kehte hain. Ye segments uski sides hain."),
    ], {"mode": "polygon", "n": 5, "diagonals": "none", "highlight": "sides"}),
    scene([
        L("Dadi", "The corners, where two sides meet, are called vertices. This pentagon has 5 sides and 5 vertices.",
          "Kone, jahan do sides milti hain, unhe vertices kehte hain. Is pentagon mein 5 sides aur 5 vertices hain."),
        L("Disha", "And the honeycomb on my science poster is made of hexagons, with 6 sides each!", "Aur meri science poster wala madhumakkhi ka chhatta hexagon se bana hai, har ek mein 6 sides!"),
    ], {"mode": "polygon", "n": 5, "diagonals": "none", "highlight": "vertices"}),
    scene([
        L("Harsh", "Can I join corners straight across the inside?", "Kya main andar se seedha konon ko jod sakta hoon?"),
        L("Dadi", "Yes! A segment joining two vertices that are not next to each other is a diagonal. From A, you cannot go to A itself or to its two neighbours. So from each vertex there are n minus 3 diagonals.",
          "Haan! Jo segment do aise vertices ko jode jo agal bagal nahi hain, use diagonal kehte hain. A se, na toh A khud tak ja sakte ho, na uske do padosiyon tak. Isliye har vertex se n minus 3 diagonals nikalte hain."),
    ], {"mode": "polygon", "n": 5, "diagonals": "fromA", "highlight": None}),
    scene([
        L("Dadi", "Take a hexagon. Each of the 6 vertices sends out 3 diagonals, and 6 times 3 is 18. But every diagonal was counted twice, once from each end. So 18 divided by 2 gives 9 diagonals.",
          "Hexagon lo. 6 vertices mein se har ek se 3 diagonals nikalte hain, 6 guna 3 barabar 18. Lekin har diagonal do baar gina gaya, dono sirron se. Toh 18 bhaag 2, yaani 9 diagonals."),
        L("Disha", "So the rule is n times n minus 3, divided by 2!", "Toh niyam hai n guna n minus 3, bhaag 2!"),
    ], {"mode": "polygon", "n": 6, "diagonals": "all"}),
    scene([
        L("Harsh", "A quadrilateral: 4 times 1, divided by 2. That is 2 diagonals! And a triangle gets 3 times 0. No diagonals at all!",
          "Quadrilateral: 4 guna 1, bhaag 2. Yaani 2 diagonals! Aur triangle mein 3 guna 0. Ek bhi diagonal nahi!"),
        L("Dadi", "Shabash! Change the number of sides yourself and test the rule.", "Shabash! Khud sides ki ginti badlo aur niyam test karo."),
    ], {"mode": "polygon", "n": 4, "diagonals": "all"}),
]

SCENES_2 = [
    scene([
        L("Narrator", "In the kitchen, Mummy is folding samosas for the Diwali party.", "Rasoi mein Mummy Diwali party ke liye samose bana rahi hain."),
        L("Neha", "Look, a perfect samosa is a triangle. 3 sides, 3 angles and 3 vertices.", "Dekho, ek perfect samosa triangle hota hai. 3 sides, 3 angles aur 3 vertices."),
    ], {"preset": "equilateral", "P": None}),
    scene([
        L("Dadi", "When all three sides are equal, it is an equilateral triangle. See the same little tick on every side? Ticks mean equal lengths. And all its angles are 60 degrees.",
          "Jab teeno sides barabar hon, toh woh equilateral triangle hai. Har side par ek jaisa chhota nishaan dekho? Nishaan ka matlab barabar lambai. Aur iske saare angles 60 degree ke hain."),
    ], {"preset": "equilateral", "P": None}),
    scene([
        L("Disha", "This samosa has only two equal sides.", "Is samose mein sirf do sides barabar hain."),
        L("Dadi", "That is an isosceles triangle. The two angles opposite the equal sides are also equal.",
          "Yeh isosceles triangle hai. Barabar sides ke saamne wale do angles bhi barabar hote hain."),
    ], {"preset": "isosceles", "P": None}),
    scene([
        L("Harsh", "And mine has all three sides different!", "Aur mere wale ki teeno sides alag alag hain!"),
        L("Neha", "Of course, Harsh. Your samosas are always different shapes!", "Haan Harsh, tumhare samose toh hamesha alag alag shape ke hote hain!"),
        L("Dadi", "That is a scalene triangle. No two sides are equal.", "Yeh scalene triangle hai. Koi do sides barabar nahi."),
    ], {"preset": "scalene", "P": None}),
    scene([
        L("Dadi", "We can also sort triangles by their angles. When every angle is less than 90 degrees, it is an acute-angled triangle.",
          "Triangles ko unke angles se bhi baant sakte hain. Jab har angle 90 degree se kam ho, toh woh acute-angled triangle hai."),
    ], {"preset": "acute", "P": None}),
    scene([
        L("Deepak", "At the railway, the support beam of a signal post meets the pole at a right angle. A triangle with one 90 degree angle is a right-angled triangle.",
          "Railway mein signal post ka support beam khambe se right angle par milta hai. Jis triangle mein ek angle 90 degree ka ho, woh right-angled triangle hai."),
    ], {"preset": "right", "P": None}),
    scene([
        L("Dadi", "And if one angle is more than 90 degrees, it is an obtuse-angled triangle. A triangle can have only one right angle or one obtuse angle. Can you guess why?",
          "Aur agar ek angle 90 degree se zyaada ho, toh woh obtuse-angled triangle hai. Triangle mein sirf ek hi right angle ya ek hi obtuse angle ho sakta hai. Bata sakte ho kyon?"),
        L("Harsh", "Hmm. Maybe there isn't enough room for two big angles?", "Hmm. Shayad do bade angles ke liye jagah hi nahi hai?"),
        L("Dadi", "Good guess! We will prove it in the next story.", "Achchha andaaza! Agli kahani mein ise prove karenge."),
    ], {"preset": "obtuse", "P": None}),
    scene([
        L("Dadi", "Your turn. Drag the corners and make an isosceles triangle. Watch for the matching ticks!",
          "Ab aapki baari. Konon ko drag karke ek isosceles triangle banao. Milte julte nishaanon par nazar rakho!"),
    ], {"preset": "scalene", "P": None, "task": "Isosceles"}, wait=True),
]

SCENES_3 = [
    scene([
        L("Dadi", "Harsh guessed that a triangle has no room for two big angles. Let us find out why. Here is triangle A B C, with its three angles coloured.",
          "Harsh ne andaaza lagaya tha ki triangle mein do bade angles ki jagah nahi hoti. Chalo dekhte hain kyon. Yeh hai triangle A B C, iske teeno angles rangeen hain."),
    ], {"mode": "triangle", "step": 0}),
    scene([
        L("Disha", "The numbers change when I drag a corner.", "Kona drag karne par numbers badal jaate hain."),
        L("Dadi", "But watch the total. Every single time, it comes to the same number.", "Lekin total dekho. Har baar wahi number aata hai."),
    ], {"mode": "triangle", "step": 0, "T": [[110, 250], [490, 250], [340, 50]]}),
    scene([
        L("Dadi", "Now, just like tearing a paper triangle, let us tear off the three corners and place them side by side at one point.",
          "Ab, bilkul kaagaz ke triangle ki tarah, teeno kone faad kar ek point par agal bagal rakhte hain."),
    ], {"mode": "triangle", "step": 1, "T": [[130, 240], [470, 240], [250, 60]]}),
    scene([
        L("Harsh", "Whoa! They fit together into a perfect straight line!", "Arre waah! Yeh milkar ekdum seedhi line ban gaye!"),
        L("Dadi", "And a straight angle is 180 degrees. So the three angles of every triangle add up to 180 degrees.",
          "Aur straight angle 180 degree hota hai. Isliye har triangle ke teeno angles ka jod 180 degree hota hai."),
    ], {"mode": "triangle", "step": 2}),
    scene([
        L("Harsh", "Now I get it! Two right angles would already use up 180 degrees, leaving nothing for the third angle!",
          "Ab samajh aaya! Do right angles mein hi 180 degree khatam ho jaayenge, teesre angle ke liye kuch nahi bachega!"),
        L("Dadi", "Exactly. That is real mathematical thinking!", "Bilkul. Yahi asli mathematical soch hai!"),
    ], {"mode": "triangle", "step": 2}),
    scene([
        L("Neha", "My cake tray has four corners. What do its four angles add up to?", "Meri cake tray ke chaar kone hain. Iske chaar angles ka jod kitna hoga?"),
        L("Dadi", "Let us look at a quadrilateral and its four angles.", "Chalo ek quadrilateral aur uske chaar angles dekhte hain."),
    ], {"mode": "quad", "step": 0}),
    scene([
        L("Dadi", "Draw one diagonal, A C. It cuts the quadrilateral into two triangles.", "Ek diagonal A C banao. Yeh quadrilateral ko do triangles mein kaat deta hai."),
    ], {"mode": "quad", "step": 1}),
    scene([
        L("Disha", "Each triangle gives 180 degrees, so two triangles give 360 degrees!", "Har triangle 180 degree deta hai, toh do triangles 360 degree denge!"),
        L("Dadi", "So the angles of every quadrilateral add up to 360 degrees.", "Isliye har quadrilateral ke angles ka jod 360 degree hota hai."),
    ], {"mode": "quad", "step": 2}),
    scene([
        L("Dadi", "Your turn. Drag the corners of the quadrilateral and check that the total stays 360 degrees.",
          "Ab aapki baari. Quadrilateral ke konon ko drag karo aur check karo ki total 360 degree hi rehta hai."),
    ], {"mode": "quad", "step": 2}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "Papa takes the children to a tile shop to choose tiles for the new kitchen.", "Papa bachchon ko naye kitchen ke liye tiles chunne tile ki dukaan le jaate hain."),
        L("Deepak", "Every tile here has four sides, so they are all quadrilaterals. But they belong to different families.",
          "Yahan har tile ki chaar sides hain, toh sab quadrilaterals hain. Lekin yeh alag alag parivaaron ke hain."),
    ], {"shape": "quadrilateral", "showDiagonals": False}),
    scene([
        L("Disha", "This tile looks like a bucket!", "Yeh tile toh baalti jaisi dikhti hai!"),
        L("Deepak", "That is a trapezium. It has exactly one pair of parallel sides. See the arrow marks on the two parallel sides?",
          "Yeh trapezium hai. Isme sirf ek jodi parallel sides hoti hain. Do parallel sides par arrow ke nishaan dekho?"),
    ], {"shape": "trapezium", "showDiagonals": False}),
    scene([
        L("Harsh", "This one is leaning over, like it is walking!", "Yeh wala toh jhuka hua hai, jaise chal raha ho!"),
        L("Dadi", "It is a parallelogram. Both pairs of opposite sides are parallel, and opposite sides are equal.",
          "Yeh parallelogram hai. Aamne saamne ki dono jodi sides parallel hain, aur aamne saamne ki sides barabar hain."),
    ], {"shape": "parallelogram", "showDiagonals": False}),
    scene([
        L("Deepak", "Straighten the parallelogram until every corner is a right angle, and you get a rectangle. Its two diagonals are equal too.",
          "Parallelogram ko seedha karo jab tak har kona right angle na ho jaaye, toh milta hai rectangle. Iske dono diagonals bhi barabar hote hain."),
    ], {"shape": "rectangle", "showDiagonals": True}),
    scene([
        L("Neha", "This diamond tile has all four sides equal. It is a rhombus.", "Is diamond tile ki chaaron sides barabar hain. Yeh rhombus hai."),
        L("Dadi", "A rhombus is a parallelogram with equal sides, and its diagonals cut each other at right angles.",
          "Rhombus ek aisa parallelogram hai jiski sides barabar hain, aur iske diagonals ek doosre ko right angle par kaatte hain."),
    ], {"shape": "rhombus", "showDiagonals": True}),
    scene([
        L("Disha", "And the square has everything! Equal sides and right angles.", "Aur square mein toh sab kuch hai! Barabar sides aur right angles."),
        L("Dadi", "Yes! A square is a rectangle, and a rhombus, and a parallelogram, all at once. Look at the family tree light up!",
          "Haan! Square ek saath rectangle bhi hai, rhombus bhi, aur parallelogram bhi. Family tree ko jagmagaate dekho!"),
    ], {"shape": "square", "showDiagonals": False}),
    scene([
        L("Disha", "Look, Dadi, my patang! Two short equal sides on top and two long equal sides below.", "Dekho Dadi, meri patang! Upar do chhoti barabar sides aur neeche do lambi barabar sides."),
        L("Dadi", "That is a kite. Two pairs of equal sides next to each other, and its diagonals meet at 90 degrees.",
          "Yeh kite hai. Agal bagal do jodi barabar sides, aur iske diagonals 90 degree par milte hain."),
    ], {"shape": "kite", "showDiagonals": True}),
    scene([
        L("Deepak", "Your turn, engineers. On the family tree, find the shape whose four sides are all equal but whose corners need not be right angles.",
          "Ab aapki baari, engineers. Family tree mein woh shape dhoondho jiski chaaron sides barabar hain lekin kone right angle hona zaroori nahi."),
    ], {"shape": "quadrilateral", "showDiagonals": False, "task": "rhombus"}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "On Independence Day, the family watches the national flag being hoisted.", "Swatantrata Diwas par parivaar tiranga fehraate hue dekhta hai."),
        L("Harsh", "Dadi, the wheel in the middle of our flag is a circle!", "Dadi, hamare jhande ke beech wala chakra ek circle hai!"),
        L("Dadi", "That is the Ashoka Chakra. It has 24 spokes, all the same length, spread equally. So the angle between two spokes is 360 divided by 24, which is 15 degrees.",
          "Yeh Ashoka Chakra hai. Isme 24 teeliyaan hain, sab ek jaisi lambi, barabar doori par. Toh do teeliyon ke beech ka angle hai 360 bhaag 24, yaani 15 degree."),
    ], {"chakra": True, "part": "centre"}),
    scene([
        L("Dadi", "Every circle has a centre, O. Every point on the circle is exactly the same distance from it.",
          "Har circle ka ek centre hota hai, O. Circle ka har point usse bilkul ek jitni doori par hota hai."),
        L("Neha", "That is how I roll a perfectly round roti, turning it around the middle!", "Isi tarah main gol roti belti hoon, beech ke chaaron taraf ghumaate hue!"),
    ], {"chakra": False, "part": "centre"}),
    scene([
        L("Dadi", "A line from the centre to the circle is a radius. All the spokes of the chakra are radii, and they are all equal.",
          "Centre se circle tak ki line radius hai. Chakra ki saari teeliyaan radii hain, aur sab barabar hain."),
    ], {"chakra": False, "part": "radius", "p": 40}),
    scene([
        L("Disha", "What if I go from one side, through the centre, all the way to the other side?", "Agar main ek taraf se, centre se hote hue, doosri taraf tak jaaun toh?"),
        L("Dadi", "That is the diameter. It is two radii joined in a straight line, so the diameter is twice the radius.",
          "Woh diameter hai. Yeh do radii seedhi line mein jude hue hain, isliye diameter radius ka dugna hota hai."),
    ], {"chakra": False, "part": "diameter", "p": 30}),
    scene([
        L("Harsh", "And a line joining any two points on the circle, not through the centre?", "Aur circle ke kinhi do points ko jodne wali line, jo centre se na guzre?"),
        L("Dadi", "That is a chord. The diameter is also a chord, but a very special one.", "Woh chord hai. Diameter bhi ek chord hai, lekin bahut khaas."),
    ], {"chakra": False, "part": "chord", "p": 40, "q": 140}),
    scene([
        L("Dadi", "Your turn. Drag P or Q and make the longest chord you can. Watch where it passes!",
          "Ab aapki baari. P ya Q ko drag karke sabse lambi chord banao. Dekho woh kahan se guzarti hai!"),
    ], {"chakra": False, "part": "chord", "p": 20, "q": 110, "task": "diameter"}, wait=True),
    scene([
        L("Dadi", "A piece of the circle itself is an arc. The short piece is the minor arc, and the long piece is the major arc.",
          "Circle ka ek tukda arc kehlaata hai. Chhota tukda minor arc hai, aur lamba tukda major arc."),
        L("Disha", "Like my bangle that broke into two pieces!", "Jaise meri choodi jo do tukdon mein toot gayi thi!"),
    ], {"chakra": False, "part": "arc", "p": 30, "q": 120}),
    scene([
        L("Neha", "And one slice of my pizza, between two radii and the crust, is called a sector.", "Aur meri pizza ka ek slice, do radii aur kinaare ke beech, sector kehlaata hai."),
    ], {"chakra": False, "part": "sector", "p": 50, "q": 110}),
    scene([
        L("Dadi", "Cut straight across with a chord, and the piece between the chord and the arc is a segment.",
          "Chord se seedha kaato, toh chord aur arc ke beech ka tukda segment hai."),
        L("Harsh", "So a sector is a pizza slice, and a segment is the piece I cut off with one straight cut!", "Matlab sector pizza ka slice hai, aur segment woh tukda jo main ek seedhe cut se kaatta hoon!"),
    ], {"chakra": False, "part": "segment", "p": 20, "q": 140}),
    scene([
        L("Dadi", "Finally, the whole boundary of the circle is its circumference, the distance all the way around. In higher classes, you will learn to measure it with a magic number called pi!",
          "Aakhir mein, circle ki poori boundary uski circumference hai, yaani chaaron taraf ki doori. Badi classes mein tum ise pi naam ke jaadui number se naapna seekhoge!"),
    ], {"chakra": False, "part": "circumference"}),
]

SCENES_6 = [
    scene([
        L("Narrator", "It is Diwali eve, and the family is packing gift boxes for the neighbours.", "Diwali ki shaam hai, aur parivaar padosiyon ke liye gift box pack kar raha hai."),
        L("Harsh", "Dadi, the dice in my board game is a cube!", "Dadi, mere board game ka paasa ek cube hai!"),
        L("Dadi", "Yes! Unlike flat shapes on paper, a cube is a solid. It has length, breadth and height.", "Haan! Kaagaz ki chapti shapes se alag, cube ek solid hai. Isme lambai, chaudai aur oonchai hoti hai."),
    ], {"solid": "cube", "count": None, "euler": False}),
    scene([
        L("Dadi", "The flat surfaces are called faces. Count with me. A cube has 6 faces, all of them squares.",
          "Chapti satahon ko faces kehte hain. Mere saath gino. Cube ke 6 faces hain, sab square."),
    ], {"solid": "cube", "count": "faces", "euler": False}),
    scene([
        L("Disha", "Where two faces meet, there is a line.", "Jahan do faces milte hain, wahan ek line hai."),
        L("Dadi", "That line is an edge. A cube has 12 edges. Turn it around to find the hidden ones!", "Woh line edge hai. Cube ke 12 edges hain. Ise ghuma kar chhupe hue edges dhoondho!"),
    ], {"solid": "cube", "count": "edges", "euler": False}),
    scene([
        L("Harsh", "And the pointy corners?", "Aur nukeele kone?"),
        L("Dadi", "Those are vertices, where the edges meet. A cube has 8 vertices.", "Woh vertices hain, jahan edges milte hain. Cube ke 8 vertices hain."),
    ], {"solid": "cube", "count": "vertices", "euler": False}),
    scene([
        L("Neha", "My gift box is longer than it is tall. It is a cuboid, with 6 rectangular faces, 12 edges and 8 vertices, just like the cube.",
          "Mera gift box oonchai se zyaada lamba hai. Yeh cuboid hai, 6 rectangular faces, 12 edges aur 8 vertices ke saath, bilkul cube ki tarah."),
    ], {"solid": "cuboid", "count": "faces", "euler": False}),
    scene([
        L("Deepak", "The Great Pyramid of Giza in Egypt has a square base and four triangular faces meeting at the top. That is 5 faces, 5 vertices and 8 edges.",
          "Misr ke Giza ke Great Pyramid ka base square hai aur chaar triangular faces upar milte hain. Yaani 5 faces, 5 vertices aur 8 edges."),
    ], {"solid": "pyramid", "count": "edges", "euler": False}),
    scene([
        L("Disha", "And our camping tent is a triangular prism, with 5 faces, 6 vertices and 9 edges.", "Aur hamara camping wala tent triangular prism hai, 5 faces, 6 vertices aur 9 edges ke saath."),
    ], {"solid": "prism", "count": "vertices", "euler": False}),
    scene([
        L("Dadi", "Now a secret, found by the great mathematician Leonhard Euler. Add the faces and the vertices, then take away the edges. Cube: 6 plus 8 minus 12 is 2. Pyramid: 5 plus 5 minus 8 is 2. Prism: 5 plus 6 minus 9 is 2!",
          "Ab ek raaz, jo mahaan mathematician Leonhard Euler ne khoja. Faces aur vertices jodo, phir edges ghataao. Cube: 6 plus 8 minus 12 barabar 2. Pyramid: 5 plus 5 minus 8 barabar 2. Prism: 5 plus 6 minus 9 barabar 2!"),
        L("Harsh", "It is always 2! That is magic!", "Hamesha 2! Yeh toh jaadu hai!"),
        L("Dadi", "F plus V minus E equals 2. It works for every solid with flat faces and no holes.", "F plus V minus E barabar 2. Yeh har us solid ke liye kaam karta hai jiske faces chapte hain aur koi chhed nahi."),
    ], {"solid": "cube", "count": None, "euler": True}),
    scene([
        L("Neha", "Not every solid has only flat faces. A gas cylinder has two flat circles and one curved face.", "Har solid ke sirf chapte faces nahi hote. Gas cylinder ke do chapte gol faces aur ek curved face hai."),
    ], {"solid": "cylinder", "count": "faces", "euler": False}),
    scene([
        L("Disha", "And my ice-cream cone has one flat circle, one curved face, and one pointy vertex on top!", "Aur meri ice-cream cone mein ek chapta gol face, ek curved face, aur upar ek nukeela vertex hai!"),
    ], {"solid": "cone", "count": "vertices", "euler": False}),
    scene([
        L("Harsh", "And my cricket ball is a sphere. Just one curved face, no edges and no vertices!", "Aur meri cricket ball sphere hai. Bas ek curved face, na koi edge na koi vertex!"),
        L("Dadi", "Well spotted! Now pick any solid, turn it around, and count for yourself.", "Bahut badhiya! Ab koi bhi solid chuno, use ghumaao, aur khud gino."),
    ], {"solid": "sphere", "count": "faces", "euler": False}),
]

SCENES_7 = [
    scene([
        L("Narrator", "After Diwali, Dadi sets a quiz at the dining table.", "Diwali ke baad, Dadi dining table par ek quiz rakhti hain."),
        L("Dadi", "Question 1. How many diagonals does an octagon have?", "Sawaal 1. Octagon mein kitne diagonals hote hain?"),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "An octagon has 8 sides, so n is 8. From each vertex there are 8 minus 3, which is 5 diagonals.", "Octagon ki 8 sides hain, toh n barabar 8. Har vertex se 8 minus 3, yaani 5 diagonals."),
    ], {"example": 0, "step": 2}),
    scene([
        L("Harsh", "8 times 5 is 40, but each diagonal is counted twice, so 40 divided by 2 is 20 diagonals!", "8 guna 5 barabar 40, lekin har diagonal do baar gina gaya, toh 40 bhaag 2 barabar 20 diagonals!"),
    ], {"example": 0, "step": 4}),
    scene([
        L("Dadi", "Question 2. Two angles of a triangle are 50 degrees and 60 degrees. Find the third angle.", "Sawaal 2. Ek triangle ke do angles 50 degree aur 60 degree hain. Teesra angle nikaalo."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Disha", "All three angles add up to 180. 50 plus 60 is 110, and 180 minus 110 is 70 degrees.", "Teeno angles ka jod 180. 50 plus 60 barabar 110, aur 180 minus 110 barabar 70 degree."),
        L("Dadi", "Perfect. And since every angle is less than 90, it is an acute-angled triangle.", "Bilkul sahi. Aur kyonki har angle 90 se kam hai, yeh acute-angled triangle hai."),
    ], {"example": 1, "step": 4}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Disha's Rangoli · Curves and Polygons",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Diwali is three days away. Disha is drawing a rangoli with chalk at the front door, Harsh is "helping", and Dadi watches every line.</div>

<h2>Curves</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Curve</strong>: any figure drawn without lifting the pencil. (A straight line is also a curve!)</div>
  <div><strong class="text-amber-300">Open curve</strong>: its ends do not meet.</div>
  <div><strong class="text-amber-300">Closed curve</strong>: it ends where it began.</div>
  <div><strong class="text-amber-300">Simple closed curve</strong>: closed and never crosses itself.</div>
</div>
<p>A simple closed curve divides the plane into the <strong>interior</strong> (inside), the <strong>boundary</strong> (the curve) and the <strong>exterior</strong> (outside).</p>

<h2>Polygons</h2>
<p>A <strong>polygon</strong> is a simple closed figure made only of line segments. The segments are its <strong>sides</strong>, the corners are its <strong>vertices</strong>, and a segment joining two non-adjacent vertices is a <strong>diagonal</strong>.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Sides</th><th class="text-left">Name</th><th>Diagonals</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>3</td><td>Triangle</td><td class="text-center">0</td></tr>
    <tr><td>4</td><td>Quadrilateral</td><td class="text-center">2</td></tr>
    <tr><td>5</td><td>Pentagon</td><td class="text-center">5</td></tr>
    <tr><td>6</td><td>Hexagon (honeycomb cell)</td><td class="text-center">9</td></tr>
    <tr><td>8</td><td>Octagon</td><td class="text-center">20</td></tr>
  </tbody>
</table>
<div {FORMULA}>Diagonals of an n-sided polygon = n(n − 3) ÷ 2</div>
<p><strong>Why:</strong> each of the n vertices joins to every vertex except itself and its 2 neighbours, giving n − 3 diagonals. That counts n(n − 3), but every diagonal is counted twice (once from each end), so divide by 2.</p>
""",
        "keyInsight": "Polygon = simple closed figure of line segments. Diagonals = n(n − 3) ÷ 2, because each diagonal is counted from both ends.",
        "widgetType": "Class6CurvesPolygonsWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Which of these is NOT a polygon?",
            "options": ["A triangle", "A square", "A circle", "A hexagon"],
            "correctIndex": 2,
            "explanation": "A circle is a simple closed curve, but it is not made of line segments, so it is not a polygon.",
        },
        "teacherNotes": teacher(
            [
                "Let students draw freely first: 'draw without lifting your pencil' produces every kind of curve, then sort them as a class.",
                "Use the house analogy (rooms, walls, street) for interior, boundary and exterior.",
                "Derive the diagonal formula by counting a pentagon by hand before generalising; the 'counted twice' step is the key idea.",
            ],
            [
                "Thinking a curve must be bent. In maths, a straight line is also a curve.",
                "Calling a figure-of-eight a simple closed curve.",
                "Counting sides as diagonals, or forgetting that diagonals join non-adjacent vertices only.",
            ],
            "Rangoli grid: give each group a dot grid. Draw one open curve, one simple closed curve, one non-simple closed curve and one polygon, then count the polygon's diagonals and check with n(n − 3) ÷ 2.",
            "Old NCERT Ch. 4 Basic Geometrical Ideas (4.6 Curves, 4.7 Polygons); Ganita Prakash shapes vocabulary.",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Mummy's Samosas · Triangles",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Mummy is folding samosas for the Diwali party. Every one is a triangle, but no two are quite the same.</div>

<h2>Triangles by sides</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Equilateral</strong>: all 3 sides equal (and every angle is 60°).</div>
  <div><strong class="text-amber-300">Isosceles</strong>: at least 2 sides equal (the angles opposite them are equal).</div>
  <div><strong class="text-amber-300">Scalene</strong>: no two sides equal.</div>
</div>

<h2>Triangles by angles</h2>
<div {CARD}>
  <div><strong class="text-sky-300">Acute-angled</strong>: every angle less than 90°.</div>
  <div><strong class="text-sky-300">Right-angled</strong>: one angle exactly 90°.</div>
  <div><strong class="text-sky-300">Obtuse-angled</strong>: one angle more than 90°.</div>
</div>
<p>Every triangle gets <strong>two names</strong>, one from each list, for example "isosceles right-angled triangle". Tick marks on sides show equal lengths.</p>
""",
        "keyInsight": "Name a triangle twice: by sides (equilateral, isosceles, scalene) and by angles (acute, right, obtuse).",
        "widgetType": "Class6TriangleLabWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "A triangle has sides 4 cm, 4 cm and 6 cm. It is…",
            "options": ["Equilateral", "Isosceles", "Scalene"],
            "correctIndex": 1,
            "explanation": "Exactly two sides are equal (4 cm and 4 cm), so it is isosceles.",
        },
        "teacherNotes": teacher(
            [
                "Insist on the 'two names' habit: one by sides, one by angles.",
                "Use the Triangle Lab presets, then let students drag freely and predict the name before it appears.",
                "Link equal sides to equal opposite angles in an isosceles triangle by folding a paper triangle in half.",
            ],
            [
                "Thinking an equilateral triangle is not isosceles (it is a special isosceles triangle).",
                "Classifying by how the triangle is tilted on the page instead of by its angles.",
                "Believing a triangle can have two right angles (proved impossible in Story 3).",
            ],
            "Straw triangles: give each pair straws of three lengths. Which combinations make equilateral, isosceles and scalene triangles? Which can be right-angled?",
            "Old NCERT Ch. 5 (5.7 Classification of Triangles); Ganita Prakash triangles.",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Proof Lab · Why Triangles Make 180°",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Harsh guessed that a triangle has "no room" for two big angles. Dadi decides to prove it, with a pair of scissors.</div>

<h2>The angle sum of a triangle</h2>
<div {FORMULA}>∠A + ∠B + ∠C = 180°</div>
<p><strong>See it:</strong> tear off the three corners of any paper triangle and place them side by side at one point. They always fit together into a <strong>straight line</strong>, and a straight angle is 180°.</p>
<p><strong>Consequence:</strong> a triangle can have at most one right angle or one obtuse angle, because two such angles already use 180° or more.</p>

<h2>The angle sum of a quadrilateral</h2>
<div {FORMULA}>∠A + ∠B + ∠C + ∠D = 360°</div>
<div {CARD}>
  <div>Draw diagonal AC. It splits the quadrilateral into two triangles.</div>
  <div>Triangle ABC: 180°. Triangle ACD: 180°.</div>
  <div class="text-emerald-300 font-bold">Total = 2 × 180° = 360° ✔</div>
</div>
""",
        "keyInsight": "Triangle: 180° (corners make a straight line). Quadrilateral: 360° (two triangles).",
        "widgetType": "Class6AngleSumProofWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "Three angles of a quadrilateral are 80°, 100° and 90°. The fourth angle is…",
            "options": ["80°", "90°", "100°", "270°"],
            "correctIndex": 1,
            "explanation": "360° − (80° + 100° + 90°) = 360° − 270° = 90°.",
        },
        "teacherNotes": teacher(
            [
                "Do the paper-tearing activity physically before showing the animation. Students trust what their own hands showed.",
                "Ask Harsh's question to the class first: can a triangle have two right angles? Let them try to draw one.",
                "Reuse the triangle result for the quadrilateral: build new facts from proven ones.",
            ],
            [
                "Measuring with a protractor and getting 179° or 181°, then doubting the rule. Explain measurement error.",
                "Drawing a diagonal that goes outside a non-convex quadrilateral. Keep to convex shapes at this level.",
            ],
            "Every student cuts a different triangle, tears the corners and glues them on a straight line in their notebook. Display them all: different triangles, same straight line.",
            "Angle sum property: Ganita Prakash triangle activities; formally in Class 7 Ch. 6 (The Triangle and its Properties).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: The Tile Shop · The Quadrilateral Family",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Papa takes the children to a tile shop. Every tile has four sides, but Dadi says they belong to different families, and some tiles belong to several families at once.</div>

<h2>Meet the family</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Shape</th><th class="text-left">What makes it special</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Trapezium</td><td>One pair of parallel sides</td></tr>
    <tr><td>Parallelogram</td><td>Two pairs of parallel sides; opposite sides equal</td></tr>
    <tr><td>Rectangle</td><td>Parallelogram with all angles 90°; diagonals equal</td></tr>
    <tr><td>Rhombus</td><td>Parallelogram with all sides equal; diagonals meet at 90°</td></tr>
    <tr><td>Square</td><td>All sides equal AND all angles 90° (a rectangle and a rhombus)</td></tr>
    <tr><td>Kite</td><td>Two pairs of equal sides next to each other; diagonals meet at 90°</td></tr>
  </tbody>
</table>
<p>Marks on diagrams: <strong>arrows</strong> show parallel sides, <strong>ticks</strong> show equal sides, a <strong>small square</strong> shows a right angle.</p>
""",
        "keyInsight": "Every square is a rectangle and a rhombus, but not every rectangle is a square.",
        "widgetType": "Class6QuadFamilyWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Which statement is TRUE?",
            "options": ["Every rectangle is a square", "Every square is a rhombus", "Every rhombus is a rectangle", "A kite has two pairs of parallel sides"],
            "correctIndex": 1,
            "explanation": "A square has all sides equal, which is exactly what a rhombus needs, so every square is a rhombus.",
        },
        "teacherNotes": teacher(
            [
                "Teach the family as inheritance: each child keeps every property of its parent and adds one more.",
                "Use 'Is every ___ a ___?' questions in both directions to build logical thinking.",
                "Some books define a trapezium as 'at least one pair of parallel sides', which makes every parallelogram a trapezium. Follow your board's textbook and mention that definitions can differ.",
            ],
            [
                "Saying a square is not a rectangle.",
                "Confusing rhombus and kite: in a rhombus all four sides are equal; in a kite equal sides are next to each other.",
                "Ignoring the tick and arrow marks when reading diagrams.",
            ],
            "Family tree wall: groups receive cut-out quadrilaterals and must place each one at the lowest box of a family tree that still describes it, then justify one placement aloud.",
            "Old NCERT Ch. 5 (5.8 Quadrilaterals); Ganita Prakash quadrilaterals.",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Independence Day · Parts of a Circle",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On Independence Day the family watches the tricolour being hoisted. Harsh points at the blue wheel in the middle: "That's a circle!"</div>

<h2>Real data: the Ashoka Chakra</h2>
<p>The Ashoka Chakra on our national flag has <strong>24 equally spaced spokes</strong>. The spokes are radii, and the angle between two neighbouring spokes is 360° ÷ 24 = <strong>15°</strong>.</p>

<h2>Parts of a circle</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Centre (O)</strong>: the fixed point; every point on the circle is the same distance from it.</div>
  <div><strong class="text-amber-300">Radius</strong>: centre to circle. All radii are equal.</div>
  <div><strong class="text-amber-300">Diameter</strong>: a chord through the centre. <strong>Diameter = 2 × radius</strong>. It is the longest chord.</div>
  <div><strong class="text-amber-300">Chord</strong>: joins any two points on the circle.</div>
  <div><strong class="text-amber-300">Arc</strong>: a piece of the circle (minor arc and major arc).</div>
  <div><strong class="text-amber-300">Sector</strong>: region between two radii and an arc (a pizza slice).</div>
  <div><strong class="text-amber-300">Segment</strong>: region between a chord and an arc.</div>
  <div><strong class="text-amber-300">Circumference</strong>: the length of the whole boundary.</div>
</div>
<div {FORMULA}>d = 2r   and   r = d ÷ 2</div>
""",
        "keyInsight": "Diameter = 2 × radius, and the diameter is the longest chord of a circle.",
        "widgetType": "Class6CircleAnatomyWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "The region between two radii and an arc is called a…",
            "options": ["Segment", "Sector", "Chord", "Diameter"],
            "correctIndex": 1,
            "explanation": "That is a sector, like a slice of pizza. A segment is bounded by a chord and an arc.",
        },
        "teacherNotes": teacher(
            [
                "Draw a circle with a string and a nail (or a compass) to show why all radii are equal.",
                "Contrast sector (two radii) with segment (one chord) side by side; students mix these up most.",
                "Use the flag: 24 spokes leads to 15°, connecting circles back to angles.",
            ],
            [
                "Calling the diameter 'the radius times radius' or halving instead of doubling.",
                "Thinking a chord must pass through the centre.",
                "Confusing sector and segment.",
            ],
            "Roti fractions: each group gets a paper circle. Fold to find the centre, mark a diameter, a chord, then cut one sector and one segment and label them.",
            "Old NCERT Ch. 4 (4.8 Circles); Ganita Prakash circle vocabulary.",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Diwali Gift Boxes · 3D Shapes and Euler's Secret",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>It is Diwali eve. The family packs gift boxes for the neighbours, Harsh rolls his dice, and Dadi reveals a secret about solids that a famous mathematician discovered.</div>

<h2>Faces, edges and vertices</h2>
<div {CARD}>
  <div><strong class="text-purple-300">Face</strong>: a flat (or curved) surface of a solid.</div>
  <div><strong class="text-amber-300">Edge</strong>: a line where two faces meet.</div>
  <div><strong class="text-pink-300">Vertex</strong>: a corner where edges meet.</div>
</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Solid</th><th>F</th><th>V</th><th>E</th><th>F + V − E</th><th class="text-left">Real life</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Cube</td><td class="text-center">6</td><td class="text-center">8</td><td class="text-center">12</td><td class="text-center">2</td><td>Dice</td></tr>
    <tr><td>Cuboid</td><td class="text-center">6</td><td class="text-center">8</td><td class="text-center">12</td><td class="text-center">2</td><td>Gift box, brick</td></tr>
    <tr><td>Square pyramid</td><td class="text-center">5</td><td class="text-center">5</td><td class="text-center">8</td><td class="text-center">2</td><td>Pyramids of Giza</td></tr>
    <tr><td>Triangular prism</td><td class="text-center">5</td><td class="text-center">6</td><td class="text-center">9</td><td class="text-center">2</td><td>Tent</td></tr>
  </tbody>
</table>
<div {FORMULA}>Euler's formula: F + V − E = 2</div>
<p>It holds for solids with flat faces and no holes. Curved solids are different: a <strong>cylinder</strong> has 2 flat faces and 1 curved face, a <strong>cone</strong> has 1 flat face, 1 curved face and 1 vertex, and a <strong>sphere</strong> has just 1 curved surface.</p>
""",
        "keyInsight": "Count faces, vertices and edges of any flat-faced solid: F + V − E is always 2.",
        "widgetType": "Class6SolidsWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "A solid has 7 faces and 10 vertices. Using F + V − E = 2, how many edges does it have?",
            "options": ["13", "15", "17", "19"],
            "correctIndex": 1,
            "explanation": "7 + 10 − E = 2, so E = 17 − 2 = 15. (This is a pentagonal prism.)",
        },
        "teacherNotes": teacher(
            [
                "Let students hold real objects (dice, boxes, a tent model) and count with a marker, ticking each face, edge and vertex.",
                "Present Euler's formula as a discovery: fill the table first, then ask what F + V − E gives.",
                "Mention that the formula is for flat-faced solids without holes; curved solids are counted differently.",
            ],
            [
                "Missing hidden edges and vertices at the back of a drawing. Encourage turning the solid.",
                "Counting the curved surface of a cylinder as an edge.",
                "Applying Euler's formula to a sphere or a cylinder.",
            ],
            "Straw-and-clay solids: groups build a cube, a pyramid and a prism with straws (edges) and clay balls (vertices), then fill an F, V, E table and verify Euler's formula.",
            "Old NCERT Ch. 5 (5.9 Three-dimensional shapes); Euler's formula appears formally in Class 8 (Visualising Solid Shapes).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>After Diwali, Dadi sets a quiz at the dining table. Harsh and Disha race to solve each one.</div>
<h2>Five facts that solve almost everything</h2>
<ol>
  <li>Diagonals of an n-gon = n(n − 3) ÷ 2</li>
  <li>Angles of a triangle add up to 180°</li>
  <li>Angles of a quadrilateral add up to 360°</li>
  <li>Diameter = 2 × radius</li>
  <li>For flat-faced solids, F + V − E = 2</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Read the question, pick which of the five facts it uses, then write the equation.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Diagonals of an octagon",
                    "question": "How many diagonals does an octagon have?",
                    "steps": [
                        "An octagon has 8 sides, so n = 8.",
                        "From each vertex: n − 3 = 8 − 3 = <strong>5</strong> diagonals.",
                        "All vertices: 8 × 5 = 40, but each diagonal is counted twice.",
                        "Diagonals = 40 ÷ 2 = <strong>20</strong>",
                    ],
                    "answer": "20 diagonals",
                },
                {
                    "title": "Third angle of a triangle",
                    "question": "Two angles of a triangle are 50° and 60°. Find the third angle and name the triangle by its angles.",
                    "steps": [
                        "Angle sum of a triangle = 180°.",
                        "50° + 60° = 110°",
                        "Third angle = 180° − 110° = <strong>70°</strong>",
                        "All angles (50°, 60°, 70°) are less than 90° → <strong>acute-angled</strong>",
                    ],
                    "answer": "70°; acute-angled triangle",
                },
                {
                    "title": "Classify by sides",
                    "question": "A triangle has sides 5 cm, 5 cm and 7 cm. Name it by its sides.",
                    "steps": [
                        "Two sides are equal (5 cm and 5 cm); the third is different.",
                        "Exactly two equal sides → <strong>isosceles</strong>",
                    ],
                    "answer": "Isosceles triangle",
                },
                {
                    "title": "Fourth angle of a quadrilateral",
                    "question": "Three angles of a quadrilateral are 90°, 110° and 70°. Find the fourth angle.",
                    "steps": [
                        "Angle sum of a quadrilateral = 360°.",
                        "90° + 110° + 70° = 270°",
                        "Fourth angle = 360° − 270° = <strong>90°</strong>",
                    ],
                    "answer": "90°",
                },
                {
                    "title": "Is this triangle possible?",
                    "question": "Can a triangle have angles of 100° and 90°? Explain.",
                    "steps": [
                        "100° + 90° = 190°",
                        "But all three angles of a triangle must add up to exactly 180°.",
                        "190° is already more than 180° → <strong>not possible</strong>",
                    ],
                    "answer": "No, because two angles already exceed 180°",
                },
                {
                    "title": "Radius and diameter",
                    "question": "The radius of a circular rangoli is 4.5 cm. What is its diameter?",
                    "steps": [
                        "Diameter = 2 × radius",
                        "= 2 × 4.5 cm = <strong>9 cm</strong>",
                    ],
                    "answer": "9 cm",
                },
                {
                    "title": "Euler's formula for a cuboid",
                    "question": "Write the number of faces, edges and vertices of a cuboid and verify Euler's formula.",
                    "steps": [
                        "Faces F = 6, Vertices V = 8, Edges E = 12",
                        "F + V − E = 6 + 8 − 12",
                        "= <strong>2</strong> ✔",
                    ],
                    "answer": "F = 6, V = 8, E = 12; F + V − E = 2",
                },
                {
                    "title": "Which quadrilateral?",
                    "question": "A quadrilateral has all sides equal and all angles 90°. Name it. Is it also a rectangle?",
                    "steps": [
                        "All sides equal and all angles 90° → <strong>square</strong>",
                        "A rectangle needs all angles 90°. The square has that.",
                        "So yes, a square is also a rectangle (and a rhombus).",
                    ],
                    "answer": "Square; yes, it is also a rectangle",
                },
                {
                    "title": "Find the polygon",
                    "question": "A polygon has 9 diagonals. How many sides does it have?",
                    "steps": [
                        "Try values in n(n − 3) ÷ 2.",
                        "n = 5: 5 × 2 ÷ 2 = 5 (too few)",
                        "n = 6: 6 × 3 ÷ 2 = <strong>9</strong> ✔",
                    ],
                    "answer": "6 sides (a hexagon)",
                },
                {
                    "title": "Isosceles base angles",
                    "question": "In an isosceles triangle, the angle between the two equal sides is 40°. Find the other two angles.",
                    "steps": [
                        "The other two angles are equal (opposite the equal sides). Call each x.",
                        "40° + x + x = 180°, so 2x = 140°",
                        "x = 140° ÷ 2 = <strong>70°</strong>",
                    ],
                    "answer": "70° and 70°",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Before solving, ask 'which of the five facts does this use?' That single question unlocks most problems.",
                "Q9 introduces trial and improvement, a useful strategy before students learn equations.",
            ],
            [
                "Forgetting to divide by 2 in the diagonal formula.",
                "Halving instead of doubling for diameter.",
                "Q10: giving the base angles as 140° each instead of sharing 140° between two angles.",
            ],
            "Pair-share: one student names the fact to use, the other writes the equation; swap for the next question.",
            "Covers old NCERT Ch. 4–5 exercise patterns and Ganita Prakash shape problems.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Understanding Elementary Shapes (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From Disha's rangoli to Euler's secret, you have seen shapes in every corner of the house. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering curves, polygons, triangles, angle sums, quadrilaterals, circles and 3D shapes.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Sketch the shape first. Most answers come from 180°, 360°, d = 2r, n(n − 3) ÷ 2 or F + V − E = 2.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Understanding Elementary Shapes · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "A simple closed figure made only of line segments is called a:", "options": ["Curve", "Polygon", "Circle", "Ray"], "answer": 1, "explanation": "A polygon is a simple closed figure made only of line segments.", "topic": "Polygons"},
                {"q": "How many diagonals does a pentagon have?", "options": ["3", "5", "10", "2"], "answer": 1, "explanation": "5 × (5 − 3) ÷ 2 = 5.", "topic": "Diagonals"},
                {"q": "A triangle with angles 30°, 60° and 90° is:", "options": ["Acute-angled", "Right-angled", "Obtuse-angled", "Equilateral"], "answer": 1, "explanation": "One angle is exactly 90°.", "topic": "Triangles by angles"},
                {"q": "A triangle with all sides 6 cm is:", "options": ["Scalene", "Isosceles only", "Equilateral", "Right-angled"], "answer": 2, "explanation": "All three sides are equal.", "topic": "Triangles by sides"},
                {"q": "Two angles of a triangle are 70° and 50°. The third angle is:", "options": ["50°", "60°", "70°", "120°"], "answer": 1, "explanation": "180° − (70° + 50°) = 60°.", "topic": "Angle sum of a triangle"},
                {"q": "The angles of a quadrilateral add up to:", "options": ["180°", "270°", "360°", "540°"], "answer": 2, "explanation": "A diagonal makes two triangles: 2 × 180° = 360°.", "topic": "Angle sum of a quadrilateral"},
                {"q": "A quadrilateral with exactly one pair of parallel sides is a:", "options": ["Parallelogram", "Rhombus", "Trapezium", "Kite"], "answer": 2, "explanation": "That is the definition of a trapezium.", "topic": "Quadrilateral family"},
                {"q": "The diameter of a circle is 12 cm. Its radius is:", "options": ["24 cm", "6 cm", "12 cm", "3 cm"], "answer": 1, "explanation": "Radius = diameter ÷ 2 = 6 cm.", "topic": "Parts of a circle"},
                {"q": "How many edges does a cube have?", "options": ["6", "8", "12", "4"], "answer": 2, "explanation": "A cube has 12 edges (4 on top, 4 at the bottom, 4 standing).", "topic": "3D shapes"},
                {"q": "A solid with flat faces has 6 faces and 8 vertices. How many edges does it have?", "options": ["10", "12", "14", "16"], "answer": 1, "explanation": "F + V − E = 2 → 6 + 8 − E = 2 → E = 12.", "topic": "Euler's formula"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q2 and Q10 test formula use; Q7 tests the trapezium definition; Q8 catches doubling instead of halving."],
            "Exit ticket: draw one example each of a polygon, an isosceles triangle, a sector and a cuboid, and label one property of each.",
            "Matches old NCERT Ch. 4–5 and Ganita Prakash shapes learning outcomes.",
        ),
    },
]


def seed_class6_elementary_shapes():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Understanding Elementary Shapes")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Understanding Elementary Shapes: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Understanding Elementary Shapes: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_elementary_shapes()
