import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Perimeter and Area (old NCERT Ch. 10 "Mensuration": perimeter of rectangles, squares and regular
# polygons, area by counting squares, area of rectangles and squares; Ganita Prakash Ch. 6 "Perimeter and
# Area": the same plus the area of a triangle as half of a rectangle, shapes with the same perimeter but
# different areas (and the other way round), and split-and-rearrange). Story: the Jaipur family fences
# Dadi's garden, makes Makar Sankranti decorations, holds a tile contest, re-tiles a station waiting room and
# marks out a cricket practice area with a rope.
#
# Verified facts used:
# - A cricket pitch is a rectangle 22 yards (20.12 m) long and 10 ft (3.05 m) wide. (MCC Laws of Cricket,
#   Law 7 "The pitch", lords.org; BCCI copy of Law 7.) Used only in worked example 10, rounded to 20 m by 3 m
#   and clearly labelled "about".
# - The word perimeter comes from Greek "peri" (around) and "metron" (measure). (Standard etymology.)


SCENES_1 = [
    scene([
        L("Narrator", "It is a sunny Sunday in Jaipur. Dadi wants a wire fence around her vegetable garden, so the monkeys stop eating her tomatoes.",
          "Jaipur mein dhoop wala Itvaar hai. Dadi apne sabzi ke bageeche ke chaaron taraf taar ki baad lagaana chahti hain, taaki bandar unke tamatar na khaayein."),
        L("Dadi", "The garden is a rectangle, 12 metres long and 8 metres wide. How much wire do we need?",
          "Bageecha ek rectangle hai, 12 metre lamba aur 8 metre chauda. Hamein kitni taar chahiye?"),
    ], {"mode": "rect", "l": 12, "b": 8, "walk": 1}),
    scene([
        L("Harsh", "I will walk around it! 12 metres, then 8, then 12, then 8. That is 40 metres!",
          "Main iske chaaron taraf chalta hoon! 12 metre, phir 8, phir 12, phir 8. Yeh hua 40 metre!"),
        L("Dadi", "Shabash! The distance all the way around a closed shape is called its perimeter. Peri means around, and meter means measure.",
          "Shabash! Kisi band shape ke chaaron taraf ki poori doori ko uska perimeter kehte hain. Peri matlab chaaron taraf, aur meter matlab naapna."),
    ], {"mode": "rect", "l": 12, "b": 8, "walk": 2}),
    scene([
        L("Disha", "The opposite sides are equal. So I can add 12 and 8 once, which is 20, and then double it. 40 again!",
          "Aamne saamne ki sides barabar hain. Toh main 12 aur 8 ek baar jodti hoon, 20 hua, aur phir double karti hoon. Phir se 40!"),
        L("Dadi", "That is the shortcut. Perimeter of a rectangle is 2 times, length plus breadth.",
          "Yahi shortcut hai. Rectangle ka perimeter hai 2 guna, length plus breadth."),
    ], {"mode": "rect", "l": 12, "b": 8, "walk": 3}),
    scene([
        L("Deepak", "At the railway yard, the signal cabin has a square plot, 9 metres on each side. All four sides are equal.",
          "Railway yard mein signal cabin ka ek square plot hai, har side 9 metre. Chaaron sides barabar hain."),
        L("Disha", "Then the perimeter is just 4 times 9, which is 36 metres!", "Toh perimeter bas 4 guna 9 hai, yaani 36 metre!"),
    ], {"mode": "square", "l": 9, "walk": 4}),
    scene([
        L("Neha", "My flower bed is shaped like the letter L. Its sides are 8, 3, 3, 3, 5 and 6 metres.",
          "Mera phoolon ka kyaara L akshar jaisa hai. Iski sides 8, 3, 3, 3, 5 aur 6 metre hain."),
        L("Harsh", "No shortcut here, so I add every side, even the small ones in the corner. The total is 28 metres!",
          "Yahan koi shortcut nahi, toh main har side jodta hoon, kone wali chhoti sides bhi. Total 28 metre hai!"),
        L("Dadi", "Right. For any shape with straight sides, the perimeter is the sum of all its sides.",
          "Sahi. Seedhi sides wali kisi bhi shape ka perimeter, uski saari sides ka jod hota hai."),
    ], {"mode": "lshape", "walk": 5}),
    scene([
        L("Dadi", "Back to my garden. The wire costs 20 rupees for every metre. What will 40 metres cost?",
          "Wapas mere bageeche par. Taar 20 rupaye prati metre hai. 40 metre kitne ki padegi?"),
        L("Disha", "40 times 20 is 800. So the fence costs 800 rupees.", "40 guna 20 barabar 800. Toh baad 800 rupaye ki padegi."),
    ], {"mode": "rect", "l": 12, "b": 8, "walk": 6}),
    scene([
        L("Dadi", "Your turn! Make a rectangular garden whose fence is exactly 30 metres long.",
          "Ab aapki baari! Aisa rectangle bageecha banaao jiski baad bilkul 30 metre lambi ho."),
    ], {"mode": "rect", "l": 10, "b": 3, "walk": 7, "task": {"perimeter": 30}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "Makar Sankranti is coming. Disha is making a decoration from a ribbon, bent into a triangle with three equal sides.",
          "Makar Sankranti aane wali hai. Disha ek ribbon se decoration bana rahi hai, jise teen barabar sides wale triangle mein moda hai."),
        L("Disha", "Each side is 5 centimetres. How long is my ribbon?", "Har side 5 centimetre hai. Mera ribbon kitna lamba hai?"),
    ], {"mode": "regular", "n": 3, "side": 5, "unroll": False}),
    scene([
        L("Dadi", "Open the ribbon out into a straight line, beta. Three pieces of 5 centimetres. So the perimeter is 3 times 5, which is 15 centimetres.",
          "Ribbon ko khol kar seedhi line bana do, beta. 5 centimetre ke teen tukde. Toh perimeter hai 3 guna 5, yaani 15 centimetre."),
    ], {"mode": "regular", "n": 3, "side": 5, "unroll": True}),
    scene([
        L("Dadi", "A shape with all sides equal and all angles equal is called a regular polygon. For any regular polygon, perimeter is the number of sides times the length of one side.",
          "Jis shape ki saari sides barabar aur saare angles barabar hon, use regular polygon kehte hain. Kisi bhi regular polygon ka perimeter hai, sides ki sankhya guna ek side ki lambaai."),
        L("Harsh", "So a square tile with side 6 centimetres has perimeter 4 times 6, which is 24 centimetres!",
          "Toh 6 centimetre side wali square tile ka perimeter 4 guna 6, yaani 24 centimetre hai!"),
    ], {"mode": "regular", "n": 4, "side": 6, "unroll": True}),
    scene([
        L("Neha", "My new cake tin is a regular hexagon. It has 6 sides, each 7 centimetres.",
          "Mera naya cake tin ek regular hexagon hai. Iski 6 sides hain, har ek 7 centimetre."),
        L("Disha", "6 times 7 is 42. The ribbon around the cake must be 42 centimetres long!",
          "6 guna 7 barabar 42. Cake ke chaaron taraf ka ribbon 42 centimetre lamba hona chahiye!"),
    ], {"mode": "regular", "n": 6, "side": 7, "unroll": True}),
    scene([
        L("Deepak", "A regular octagon has 8 sides. With sides of 5 centimetres, its perimeter is 8 times 5, which is 40 centimetres.",
          "Regular octagon ki 8 sides hoti hain. 5 centimetre ki sides ho, toh perimeter 8 guna 5, yaani 40 centimetre."),
    ], {"mode": "regular", "n": 8, "side": 5, "unroll": True}),
    scene([
        L("Harsh", "This triangle has sides 3, 4 and 5 centimetres. Can I multiply here?",
          "Is triangle ki sides 3, 4 aur 5 centimetre hain. Kya main yahan multiply kar sakta hoon?"),
        L("Dadi", "No, beta. The sides are not equal, so it is not regular. Just add them. 3 plus 4 plus 5 is 12 centimetres.",
          "Nahi beta. Sides barabar nahi hain, isliye yeh regular nahi hai. Bas jodo. 3 plus 4 plus 5 barabar 12 centimetre."),
    ], {"mode": "triangle", "unroll": True}),
    scene([
        L("Disha", "Your turn! Build a regular hexagon whose perimeter is exactly 24 centimetres. How long must each side be?",
          "Ab aapki baari! Aisa regular hexagon banaao jiska perimeter bilkul 24 centimetre ho. Har side kitni lambi honi chahiye?"),
    ], {"mode": "regular", "n": 3, "side": 5, "unroll": False, "task": {"perimeter": 24, "n": 6}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "On Wednesday, Dadi holds a tile contest. Harsh and Disha each make a rangoli tile on squared paper.",
          "Budhvaar ko Dadi tile contest rakhti hain. Harsh aur Disha dono squared paper par ek rangoli tile banaate hain."),
        L("Dadi", "The tile that covers more of the floor wins. Whose tile is bigger?", "Jo tile zameen ka zyaada hissa dhakegi, woh jeetegi. Kiski tile badi hai?"),
    ], {"mode": "compare"}),
    scene([
        L("Harsh", "Mine, of course! It is a nice solid block.", "Meri, aur kiski! Yeh ek mazboot block hai."),
        L("Disha", "But mine spreads out more in the middle. We cannot tell just by looking!",
          "Lekin meri beech mein zyaada phaili hai. Sirf dekhkar nahi bata sakte!"),
        L("Dadi", "The amount of surface a shape covers is called its area. To measure it, we count how many unit squares fit inside.",
          "Koi shape jitni satah dhakti hai, use uska area kehte hain. Ise naapne ke liye hum ginte hain ki andar kitne unit squares aate hain."),
    ], {"mode": "compare"}),
    scene([
        L("Narrator", "They count the squares one by one.", "Woh ek ek karke squares ginte hain."),
        L("Disha", "Harsh's tile has 12 squares and mine has 13. Mine is bigger by one square!",
          "Harsh ki tile mein 12 squares hain aur meri mein 13. Meri ek square se badi hai!"),
    ], {"mode": "count"}),
    scene([
        L("Dadi", "If each small square has sides of 1 centimetre, its area is 1 square centimetre. So Disha's tile is 13 square centimetres.",
          "Agar har chhote square ki side 1 centimetre ho, toh uska area 1 square centimetre hai. Toh Disha ki tile 13 square centimetre ki hai."),
        L("Deepak", "For big floors we use square metres, a square with sides of 1 metre.", "Bade farsh ke liye hum square metre lete hain, yaani 1 metre side wala square."),
    ], {"mode": "count"}),
    scene([
        L("Neha", "Here is a neem leaf traced on squared paper. Its edges are curved, so the squares do not fit neatly.",
          "Yeh neem ka patta squared paper par banaaya hai. Iske kinaare ghumaavdaar hain, isliye squares theek se fit nahi hote."),
        L("Dadi", "Then we follow a simple rule. A full square counts as 1. More than half a square also counts as 1. Exactly half counts as half. Less than half, we leave out.",
          "Tab hum ek aasaan niyam maante hain. Poora square 1 gina jaata hai. Aadhe se zyaada bhi 1 gina jaata hai. Theek aadha, aadha gina jaata hai. Aadhe se kam ko chhod dete hain."),
    ], {"mode": "leaf"}),
    scene([
        L("Disha", "There are 14 full squares and 10 more than half. No exact halves. So the area is about 14 plus 10, which is 24 square units.",
          "14 poore squares hain aur 10 aadhe se zyaada. Theek aadhe koi nahi. Toh area lagbhag 14 plus 10, yaani 24 square units hai."),
        L("Dadi", "It is an estimate, not an exact answer. Smaller squares would give a closer estimate.",
          "Yeh andaaza hai, ekdum sahi jawaab nahi. Chhote squares lein toh andaaza aur sahi hoga."),
    ], {"mode": "leaf"}),
    scene([
        L("Dadi", "Your turn! Paint any shape you like, but its area must be exactly 10 square units.",
          "Ab aapki baari! Koi bhi shape paint karo, lekin uska area bilkul 10 square units hona chahiye."),
    ], {"mode": "paint", "painted": [], "task": {"area": 10}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "Papa's station is getting a new waiting room floor. Each tile is a square, 1 metre on each side.",
          "Papa ke station par waiting room ka naya farsh lag raha hai. Har tile ek square hai, har side 1 metre."),
        L("Deepak", "The room is 5 metres long and 4 metres wide. How many tiles must I order?",
          "Kamra 5 metre lamba aur 4 metre chauda hai. Mujhe kitni tiles mangaani hongi?"),
    ], {"l": 5, "b": 4, "rows": False}),
    scene([
        L("Harsh", "I counted them all. 20 tiles!", "Maine saari gin li. 20 tiles!"),
        L("Deepak", "Faster way: there are 4 rows, and each row has 5 tiles. 4 times 5 is 20.",
          "Jaldi wala tareeka: 4 rows hain, aur har row mein 5 tiles. 4 guna 5 barabar 20."),
    ], {"l": 5, "b": 4, "rows": True}),
    scene([
        L("Dadi", "So the area of a rectangle is length times breadth. Here, 5 times 4 is 20 square metres.",
          "Toh rectangle ka area hai length guna breadth. Yahan 5 guna 4 barabar 20 square metre."),
        L("Disha", "And a square is a rectangle with equal sides, so its area is side times side!",
          "Aur square ek aisa rectangle hai jiski sides barabar hain, toh uska area side guna side hai!"),
    ], {"l": 5, "b": 4, "rows": True}),
    scene([
        L("Deepak", "The ticket office is a square, 6 metres on each side. 6 times 6 is 36 square metres, so 36 tiles.",
          "Ticket office ek square hai, har side 6 metre. 6 guna 6 barabar 36 square metre, toh 36 tiles."),
    ], {"l": 6, "b": 6, "rows": False}),
    scene([
        L("Neha", "I need a baking tray with an area of 48 square centimetres, and the shelf allows a length of 8 centimetres. How wide should it be?",
          "Mujhe 48 square centimetre area wali baking tray chahiye, aur shelf par 8 centimetre ki length aati hai. Woh kitni chaudi ho?"),
        L("Disha", "Length times breadth is 48, so breadth is 48 divided by 8, which is 6 centimetres!",
          "Length guna breadth 48 hai, toh breadth hai 48 bhaag 8, yaani 6 centimetre!"),
    ], {"l": 8, "b": 6, "rows": True, "unit": "cm"}),
    scene([
        L("Deepak", "Back to the waiting room. The tiles cover the floor, that is the area, 20 square metres. The border strip runs around the walls, that is the perimeter, 18 metres.",
          "Wapas waiting room par. Tiles farsh dhakti hain, woh area hai, 20 square metre. Deewaron ke saath border patti chalti hai, woh perimeter hai, 18 metre."),
        L("Dadi", "Area is measured in square units, perimeter in plain units of length. Never mix them up.",
          "Area square units mein naapa jaata hai, perimeter lambaai ki saadhaaran units mein. Inhe kabhi mat milaana."),
    ], {"l": 5, "b": 4, "rows": False}),
    scene([
        L("Deepak", "Your turn! Design a rectangular floor, not a square, with an area of exactly 24 square metres.",
          "Ab aapki baari! Ek rectangle farsh banaao, square nahi, jiska area bilkul 24 square metre ho."),
    ], {"l": 4, "b": 4, "rows": False, "task": {"area": 24, "notSquare": True}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "On Makar Sankranti morning, Disha cuts a rectangle of kite paper, 8 centimetres by 6 centimetres, along its diagonal to make two triangle flags.",
          "Makar Sankranti ki subah, Disha patang ke kaagaz ka 8 centimetre guna 6 centimetre ka rectangle uske diagonal se kaatti hai, do triangle jhandiyan banaane ke liye."),
        L("Disha", "The rectangle has area 8 times 6, which is 48 square centimetres. What about each flag?",
          "Rectangle ka area 8 guna 6, yaani 48 square centimetre hai. Har jhandi ka kitna?"),
    ], {"mode": "right", "b": 8, "h": 6}),
    scene([
        L("Dadi", "Turn one triangle around and place it on the other. They match exactly! So each triangle is half the rectangle, half of 48, which is 24 square centimetres.",
          "Ek triangle ko ghumaakar doosre par rakho. Dono bilkul mil jaate hain! Toh har triangle rectangle ka aadha hai, 48 ka aadha, yaani 24 square centimetre."),
    ], {"mode": "right", "b": 8, "h": 6}),
    scene([
        L("Disha", "But what if the top corner of the triangle is somewhere in the middle?", "Lekin agar triangle ka upar wala kona beech mein kahin ho toh?"),
        L("Dadi", "Draw a straight line down from that corner. It splits the rectangle into two smaller rectangles, and the triangle takes exactly half of each one.",
          "Us kone se seedhi line neeche kheencho. Woh rectangle ko do chhote rectangles mein baant deti hai, aur triangle har ek ka theek aadha leta hai."),
    ], {"mode": "any", "b": 8, "h": 6, "a": 3}),
    scene([
        L("Harsh", "I moved the corner further, and the area is still 24 square centimetres!", "Maine kona aur aage khiska diya, aur area ab bhi 24 square centimetre hai!"),
        L("Dadi", "Yes. The dark part inside and the light part outside are always equal. The triangle is always half of its rectangle.",
          "Haan. Andar ka gehra hissa aur bahar ka halka hissa hamesha barabar hain. Triangle hamesha apne rectangle ka aadha hota hai."),
    ], {"mode": "any", "b": 8, "h": 6, "a": 6}),
    scene([
        L("Dadi", "So the area of a triangle is half of base times height. You will use this rule a lot in Class 7.",
          "Toh triangle ka area hai base guna height ka aadha. Class 7 mein yeh niyam bahut kaam aayega."),
        L("Disha", "A flag with base 10 and height 4 is half of 40, so 20 square centimetres!",
          "10 base aur 4 height wali jhandi, 40 ka aadha, yaani 20 square centimetre!"),
    ], {"mode": "any", "b": 10, "h": 4, "a": 7}),
    scene([
        L("Disha", "Your turn! Make a triangle flag with an area of exactly 12 square centimetres.",
          "Ab aapki baari! Bilkul 12 square centimetre area wali triangle jhandi banaao."),
    ], {"mode": "any", "b": 8, "h": 6, "a": 4, "task": {"area": 12}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "On Saturday, Harsh and Disha get a rope 24 metres long to mark out a rectangle for cricket practice.",
          "Shanivaar ko Harsh aur Disha ko 24 metre lambi rassi milti hai, cricket practice ke liye ek rectangle banaane ko."),
        L("Harsh", "I make it 3 metres by 9 metres. The perimeter is 24, and the area is 3 times 9, which is 27 square metres.",
          "Main ise 3 metre guna 9 metre banaata hoon. Perimeter 24 hai, aur area 3 guna 9, yaani 27 square metre."),
    ], {"mode": "rope", "P": 24, "l": 3}),
    scene([
        L("Harsh", "Now 1 metre by 11 metres. Same rope, but the area is only 11 square metres. Too thin to bowl in!",
          "Ab 1 metre guna 11 metre. Wahi rassi, lekin area sirf 11 square metre. Bowling ke liye bahut patla!"),
    ], {"mode": "rope", "P": 24, "l": 1}),
    scene([
        L("Disha", "And 4 by 8 gives 32 square metres. The same perimeter can hold very different areas!",
          "Aur 4 guna 8 se 32 square metre milta hai. Ek hi perimeter mein bahut alag alag area aa sakte hain!"),
        L("Dadi", "Exactly. Two shapes can have the same perimeter but different areas. Look at the bars: they grow as the rectangle gets less thin.",
          "Bilkul. Do shapes ka perimeter same ho sakta hai, lekin area alag. Bars dekho: rectangle jitna kam patla, area utna bada."),
    ], {"mode": "rope", "P": 24, "l": 4}),
    scene([
        L("Neha", "Now the other way round. I have 12 square tiles for a bakery counter. A single long line, 12 by 1, has a perimeter of 26.",
          "Ab ulta. Mere paas bakery counter ke liye 12 square tiles hain. Ek lambi line, 12 guna 1, ka perimeter 26 hai."),
    ], {"mode": "tiles", "A": 12, "w": 1}),
    scene([
        L("Neha", "6 by 2 has a perimeter of 16, and 4 by 3 has a perimeter of only 14. Every one has an area of 12.",
          "6 guna 2 ka perimeter 16 hai, aur 4 guna 3 ka sirf 14. Har ek ka area 12 hi hai."),
        L("Dadi", "So the same area can have different perimeters. Area and perimeter are two different measures.",
          "Toh ek hi area ke alag alag perimeter ho sakte hain. Area aur perimeter do alag naap hain."),
    ], {"mode": "tiles", "A": 12, "w": 3}),
    scene([
        L("Dadi", "One last trick. I cut a triangle off this 6 by 4 rectangle and slide it to the other side.",
          "Ek aakhri trick. Is 6 guna 4 rectangle se main ek triangle kaatkar doosri taraf khiskaati hoon."),
        L("Disha", "No paper is lost, so the area stays 24 square units. But the slanted sides are longer, so the perimeter becomes a little more than 20!",
          "Koi kaagaz nahi gaya, toh area 24 square units hi raha. Lekin tirchhi sides lambi hain, toh perimeter 20 se thoda zyaada ho gaya!"),
    ], {"mode": "rearrange", "cut": True}),
    scene([
        L("Harsh", "Your turn! Use the 24 metre rope to make the cricket area with the biggest possible area.",
          "Ab aapki baari! 24 metre rassi se sabse bada area wala cricket rectangle banaao."),
    ], {"mode": "rope", "P": 24, "l": 2, "task": {"maxArea": True}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "On Sunday evening, Dadi sets a quiz on perimeter and area.", "Itvaar shaam ko, Dadi perimeter aur area par ek quiz rakhti hain."),
        L("Dadi", "Question 1. A park is 40 metres long and 25 metres wide. Fencing costs 15 rupees per metre. Find the cost.",
          "Sawaal 1. Ek park 40 metre lamba aur 25 metre chauda hai. Baad lagaane ka kharcha 15 rupaye prati metre hai. Kul kharcha nikaalo."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "Perimeter is 2 times, 40 plus 25, which is 2 times 65, so 130 metres. Then 130 times 15 is 1,950 rupees.",
          "Perimeter hai 2 guna, 40 plus 25, yaani 2 guna 65, toh 130 metre. Phir 130 guna 15 barabar 1,950 rupaye."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. A square has a perimeter of 60 metres. Find its area.", "Sawaal 2. Ek square ka perimeter 60 metre hai. Uska area nikaalo."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "A square has 4 equal sides, so one side is 60 divided by 4, which is 15 metres. Area is 15 times 15, which is 225 square metres!",
          "Square ki 4 barabar sides hain, toh ek side 60 bhaag 4, yaani 15 metre. Area 15 guna 15, yaani 225 square metre!"),
        L("Dadi", "Shabash, Harsh. First find the side, then the area.", "Shabash, Harsh. Pehle side nikaalo, phir area."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _lshape_svg():
    """The L-shaped flower bed (sides 8, 3, 3, 3, 5, 6 m) split into two rectangles."""
    s = 22
    ox, oy = 40, 14
    pts = [(0, 0), (8, 0), (8, 3), (5, 3), (5, 6), (0, 6)]
    poly = " ".join(f"{ox + x * s},{oy + y * s}" for x, y in pts)
    labels = [(4, -0.35, "8 m"), (8.9, 1.7, "3 m"), (6.5, 3.75, "3 m"), (5.9, 4.7, "3 m"), (2.5, 6.8, "5 m"), (-1.2, 3.2, "6 m")]
    parts = ['<svg viewBox="0 0 280 170" width="280" height="170" xmlns="http://www.w3.org/2000/svg">',
             f'<rect x="{ox}" y="{oy}" width="{8 * s}" height="{3 * s}" fill="#38bdf8" opacity="0.35"/>',
             f'<rect x="{ox}" y="{oy + 3 * s}" width="{5 * s}" height="{3 * s}" fill="#f472b6" opacity="0.35"/>',
             f'<polygon points="{poly}" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>',
             f'<line x1="{ox}" y1="{oy + 3 * s}" x2="{ox + 5 * s}" y2="{oy + 3 * s}" stroke="#e2e8f0" stroke-dasharray="4 3"/>']
    for x, y, t in labels:
        parts.append(f'<text x="{ox + x * s}" y="{oy + y * s + 4}" fill="#fbbf24" font-size="13" font-weight="bold" font-family="monospace" text-anchor="middle">{t}</text>')
    parts.append("</svg>")
    return "".join(parts)


def _triangle_svg():
    """Triangle with base 10 cm and height 6 cm inside its rectangle."""
    return ('<svg viewBox="0 0 280 170" width="280" height="170" xmlns="http://www.w3.org/2000/svg">'
            '<rect x="40" y="20" width="200" height="120" fill="none" stroke="#94a3b8" stroke-dasharray="4 4"/>'
            '<polygon points="110,20 40,140 240,140" fill="#fbbf24" opacity="0.6" stroke="#e2e8f0" stroke-width="2.5"/>'
            '<line x1="110" y1="20" x2="110" y2="140" stroke="#e2e8f0" stroke-dasharray="5 4"/>'
            '<text x="140" y="160" fill="#fbbf24" font-size="13" font-weight="bold" font-family="monospace" text-anchor="middle">base 10 cm</text>'
            '<text x="246" y="84" fill="#38bdf8" font-size="13" font-weight="bold" font-family="monospace">6 cm</text>'
            '</svg>')


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Dadi's Garden · What Is Perimeter?",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Monkeys keep stealing Dadi's tomatoes, so the family fences her garden. Harsh walks around it, Disha finds a shortcut, Papa measures a square plot and Mummy's L-shaped flower bed has no shortcut at all.</div>

<h2>Perimeter: the distance around</h2>
<p>The <strong>perimeter</strong> of a closed shape is the total length of its boundary: the distance you walk to go once all the way around it. It is a length, so it is measured in cm, m or km.</p>
<div {FORMULA}>Perimeter of a rectangle = 2 × (length + breadth)</div>
<div {FORMULA}>Perimeter of a square = 4 × side</div>
<div {CARD}>
  <div>Garden 12 m by 8 m: 12 + 8 + 12 + 8 = 40 m, or 2 × (12 + 8) = 2 × 20 = 40 m.</div>
  <div>Square plot of side 9 m: 4 × 9 = 36 m.</div>
  <div>Any shape with straight sides: <strong>add all the sides</strong>. L-shaped bed: 8 + 3 + 3 + 3 + 5 + 6 = 28 m.</div>
</div>

<h2>Using perimeter</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Situation</th><th class="text-left">Working</th><th>Answer</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Wire for the 12 m × 8 m garden at ₹20 per m</td><td>40 × 20</td><td class="text-center">₹800</td></tr>
    <tr><td>Rectangle with perimeter 30 m and length 10 m</td><td>length + breadth = 15, so breadth = 5</td><td class="text-center">5 m</td></tr>
    <tr><td>Running 3 rounds of a 50 m × 30 m field</td><td>3 × 2 × (50 + 30) = 3 × 160</td><td class="text-center">480 m</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "Perimeter is the distance all the way around a shape: add every side, or use 2 × (l + b) for a rectangle and 4 × side for a square.",
        "widgetType": "Class6FenceWalkWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "A rectangular field is 50 m long and 30 m wide. What is its perimeter?",
            "options": ["80 m", "160 m", "1500 m", "110 m"],
            "correctIndex": 1,
            "explanation": "2 × (50 + 30) = 2 × 80 = 160 m. 80 m is only half the way round.",
        },
        "teacherNotes": teacher(
            [
                "Let a student walk around the edge of the classroom while others count steps: perimeter is a walk around.",
                "Write the long sum 12 + 8 + 12 + 8 first; only then show why 2 × (12 + 8) gives the same.",
                "For the L-shape, ask students to find the two missing side lengths themselves before adding.",
            ],
            [
                "Adding only length + breadth (half the perimeter).",
                "Forgetting the short inner sides of an L-shape.",
                "Writing perimeter in square units.",
            ],
            "String fence: give groups a string loop of fixed length and ask them to tape rectangles of different sizes on the desk, measuring each side.",
            "Old NCERT Ch. 10 Mensuration (10.2 perimeter, 10.2.1 rectangle, square); Ganita Prakash Ch. 6 (6.1 perimeter).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Sankranti Decorations · Perimeter of Regular Polygons",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Before Makar Sankranti, Disha bends ribbon into shapes. Unrolling the ribbon into a straight line shows that the perimeter is just all the sides laid end to end.</div>

<h2>Regular polygons</h2>
<p>A <strong>regular polygon</strong> has all sides equal and all angles equal: equilateral triangle, square, regular pentagon, regular hexagon, regular octagon.</p>
<div {FORMULA}>Perimeter of a regular polygon = number of sides × length of one side</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Shape</th><th>Sides</th><th>Side</th><th>Perimeter</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td class="text-left">Equilateral triangle</td><td>3</td><td>5 cm</td><td>15 cm</td></tr>
    <tr><td class="text-left">Square</td><td>4</td><td>6 cm</td><td>24 cm</td></tr>
    <tr><td class="text-left">Regular hexagon</td><td>6</td><td>7 cm</td><td>42 cm</td></tr>
    <tr><td class="text-left">Regular octagon</td><td>8</td><td>5 cm</td><td>40 cm</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>If the sides are <strong>not</strong> equal, add them: a triangle with sides 3 cm, 4 cm and 5 cm has perimeter 3 + 4 + 5 = 12 cm.</div>
  <div>Going backwards: a regular hexagon with perimeter 24 cm has side 24 ÷ 6 = 4 cm.</div>
</div>
""",
        "keyInsight": "Unroll any boundary into a straight line: for a regular polygon that line is just n equal pieces, so perimeter = n × side.",
        "widgetType": "Class6PolygonUnrollWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "A regular pentagon has a perimeter of 35 cm. How long is each side?",
            "options": ["5 cm", "7 cm", "6 cm", "175 cm"],
            "correctIndex": 1,
            "explanation": "A pentagon has 5 equal sides, so each side is 35 ÷ 5 = 7 cm.",
        },
        "teacherNotes": teacher(
            [
                "Bend a pipe cleaner or thread into a triangle, then straighten it next to a ruler.",
                "Ask: why can we multiply for a hexagon but not for a scalene triangle?",
                "Practise both directions: side → perimeter and perimeter → side.",
            ],
            [
                "Multiplying for shapes whose sides are not equal.",
                "Miscounting the sides of a hexagon or octagon.",
                "Calling any hexagon 'regular'.",
            ],
            "Straw polygons: groups build regular polygons from equal straws, measure one straw, and predict the perimeter before measuring the whole loop.",
            "Old NCERT Ch. 10 (10.2.2 perimeter of regular shapes); Ganita Prakash Ch. 6 (perimeter of triangles and regular polygons).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: The Tile Contest · Area by Counting Squares",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Harsh's tile looks solid, Disha's spreads out. Nobody can tell which is bigger by looking, so Dadi brings out squared paper. Then Mummy traces a neem leaf, which has no straight sides at all.</div>

<h2>Area</h2>
<p>The <strong>area</strong> of a closed shape is the amount of surface it covers. We measure it by counting <strong>unit squares</strong>.</p>
<div {CARD}>
  <div>1 square centimetre (1 sq cm) = area of a square of side 1 cm.</div>
  <div>1 square metre (1 sq m) = area of a square of side 1 m (for floors, fields).</div>
  <div>Harsh's tile: 12 squares. Disha's tile: 13 squares. Disha's tile is bigger.</div>
</div>

<h2>Curved shapes: estimate</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Part of square covered</th><th>Counts as</th><th>Neem leaf</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td class="text-left">Full</td><td>1</td><td>14</td></tr>
    <tr><td class="text-left">More than half</td><td>1</td><td>10</td></tr>
    <tr><td class="text-left">Exactly half</td><td>½</td><td>0</td></tr>
    <tr><td class="text-left">Less than half</td><td>0 (ignore)</td><td>14</td></tr>
  </tbody>
</table>
<div {FORMULA}>Area of the leaf ≈ 14 + 10 = 24 square units</div>
<p>This is an <strong>estimate</strong>. Squared paper with smaller squares gives a closer answer.</p>
""",
        "keyInsight": "Area counts the unit squares a shape covers; for curved shapes, count full and more-than-half squares, halves as half, and ignore the rest.",
        "widgetType": "Class6SquareCountWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "A shape on squared paper covers 9 full squares, 4 squares more than half, 2 exactly half and 5 less than half. Its area is about:",
            "options": ["20 sq units", "14 sq units", "13 sq units", "15 sq units"],
            "correctIndex": 1,
            "explanation": "9 + 4 + (2 halves = 1) = 14. The 5 small bits are ignored.",
        },
        "teacherNotes": teacher(
            [
                "Start with a comparison that cannot be judged by eye; let students argue first.",
                "Insist on the unit: '13 squares of side 1 cm' is 13 sq cm.",
                "Trace a real leaf or palm on 1 cm squared paper; compare estimates across the class.",
            ],
            [
                "Counting squares that are less than half covered.",
                "Counting a half square as 1.",
                "Thinking the longer shape must have more area.",
            ],
            "Palm prints: each student traces their palm on squared paper and estimates its area using the four rules; find the class's biggest palm.",
            "Old NCERT Ch. 10 (10.3 area, 10.3 counting squares); Ganita Prakash Ch. 6 (6.2 area, area on squared paper).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Papa's Waiting Room · Area of Rectangles and Squares",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>A station waiting room needs new 1 m tiles. Harsh counts them one by one; Papa counts rows. Mummy works backwards to find the width of a baking tray.</div>

<h2>Rows of squares</h2>
<p>A 5 m by 4 m floor holds 4 rows of 5 tiles each: 4 × 5 = 20 tiles of 1 sq m.</p>
<div {FORMULA}>Area of a rectangle = length × breadth</div>
<div {FORMULA}>Area of a square = side × side</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Shape</th><th class="text-left">Working</th><th>Area</th><th>Perimeter</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Waiting room 5 m × 4 m</td><td>5 × 4</td><td class="text-center">20 sq m</td><td class="text-center">18 m</td></tr>
    <tr><td>Ticket office, square of side 6 m</td><td>6 × 6</td><td class="text-center">36 sq m</td><td class="text-center">24 m</td></tr>
    <tr><td>Tray: area 48 sq cm, length 8 cm</td><td>breadth = 48 ÷ 8</td><td class="text-center">6 cm wide</td><td class="text-center">28 cm</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div><strong>Area</strong> = what covers the inside (tiles, paint, carpet) → square units.</div>
  <div><strong>Perimeter</strong> = what goes around the edge (fence, border, lace) → units of length.</div>
  <div>Missing side: breadth = area ÷ length.</div>
</div>
""",
        "keyInsight": "A rectangle is rows of unit squares, so its area is length × breadth; a square's is side × side.",
        "widgetType": "Class6TileAreaWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "A rectangular room has area 54 sq m and length 9 m. What is its breadth?",
            "options": ["45 m", "6 m", "63 m", "5 m"],
            "correctIndex": 1,
            "explanation": "Breadth = area ÷ length = 54 ÷ 9 = 6 m.",
        },
        "teacherNotes": teacher(
            [
                "Lay square sticky notes on a desk row by row, then ask for a quicker way than counting.",
                "Connect to multiplication arrays from earlier classes.",
                "Always ask 'inside or edge?' to decide area or perimeter in word problems.",
            ],
            [
                "Adding length and breadth for area.",
                "Writing area in m instead of sq m.",
                "Using different units for length and breadth (cm and m) without converting.",
            ],
            "Measure and tile: groups measure their desk top in cm, compute its area, then check by covering it with 10 cm paper squares.",
            "Old NCERT Ch. 10 (10.3.1 area of a rectangle, 10.3.2 area of a square); Ganita Prakash Ch. 6 (area of rectangles and squares).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Makar Sankranti Flags · Area of a Triangle",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Disha cuts a rectangle of kite paper along its diagonal to make two flags. Then she moves the top corner of the triangle around and finds that the area never changes.</div>

<h2>A diagonal cuts a rectangle in half</h2>
<p>The two triangles made by a diagonal fit exactly on each other, so each is <strong>half</strong> of the rectangle. 8 cm × 6 cm rectangle = 48 sq cm, so each triangle = 24 sq cm.</p>

<h2>Any triangle in its rectangle</h2>
<p>Put a triangle's base along the bottom of a rectangle and its top corner on the opposite side. A line straight down from the corner splits the rectangle into two smaller rectangles. The triangle takes exactly half of each, so it is still <strong>half the whole rectangle</strong>, wherever the corner is.</p>
<div {FORMULA}>Area of a triangle = ½ × base × height</div>
<div {CARD}>
  <div>Base 8 cm, height 6 cm: ½ × 8 × 6 = 24 sq cm.</div>
  <div>Base 10 cm, height 4 cm: ½ × 10 × 4 = 20 sq cm.</div>
  <div><em>Bridge to Class 7:</em> this formula is used for every triangle; the height is always measured at right angles to the base.</div>
</div>
""",
        "keyInsight": "Every triangle is exactly half of the rectangle around it, so its area is half of base × height.",
        "widgetType": "Class6TriangleHalfWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "A triangle has base 12 cm and height 5 cm. What is its area?",
            "options": ["60 sq cm", "30 sq cm", "17 sq cm", "34 sq cm"],
            "correctIndex": 1,
            "explanation": "The rectangle around it is 12 × 5 = 60 sq cm; the triangle is half of it, 30 sq cm.",
        },
        "teacherNotes": teacher(
            [
                "Cut a paper rectangle along a diagonal and lay one half on the other.",
                "For a general triangle, fold the corner pieces in to cover the triangle exactly.",
                "Keep it visual in Class 6; the formula is a bridge to Class 7.",
            ],
            [
                "Forgetting to halve (using base × height).",
                "Using a slanted side as the height.",
                "Thinking moving the top corner changes the area.",
            ],
            "Fold and fit: every student draws a triangle inside a rectangle on paper, cuts out the two outside pieces and shows they cover the triangle.",
            "Ganita Prakash Ch. 6 (area of a triangle as half a rectangle, tangram pieces); old NCERT links to Class 7 Ch. 11.",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Rope and Tiles · Same Perimeter, Different Area",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>With one 24 m rope, Harsh and Disha make thin and fat rectangles for cricket practice. Mummy arranges 12 tiles in different rectangles. Dadi cuts and slides a piece of paper. Perimeter and area turn out to be two quite separate things.</div>

<h2>Same perimeter, different area</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>Rectangle (24 m rope)</th><th>Perimeter</th><th>Area</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td>1 m × 11 m</td><td>24 m</td><td>11 sq m</td></tr>
    <tr><td>3 m × 9 m</td><td>24 m</td><td>27 sq m</td></tr>
    <tr><td>4 m × 8 m</td><td>24 m</td><td>32 sq m</td></tr>
    <tr><td>6 m × 6 m (square)</td><td>24 m</td><td>36 sq m (largest)</td></tr>
  </tbody>
</table>

<h2>Same area, different perimeter</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>12 tiles as</th><th>Area</th><th>Perimeter</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td>12 × 1</td><td>12</td><td>26</td></tr>
    <tr><td>6 × 2</td><td>12</td><td>16</td></tr>
    <tr><td>4 × 3</td><td>12</td><td>14</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>For a fixed perimeter, the closer a rectangle is to a square, the bigger its area.</div>
  <div>For a fixed area, the thinner the rectangle, the longer its perimeter.</div>
</div>

<h2>Split and rearrange</h2>
<p>Cut a piece off a shape and stick it on somewhere else: <strong>the area does not change</strong> (no paper is lost), but the perimeter usually does. Cutting a triangle off a 6 × 4 rectangle (perimeter 20) and sliding it across makes a slanted shape with the same area, 24, and a perimeter of about 21.</p>
""",
        "keyInsight": "Perimeter and area are different measures: shapes can share one and differ in the other, and cutting and rearranging keeps area but not perimeter.",
        "widgetType": "Class6RopeShapesWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Which two rectangles have the same perimeter but different areas?",
            "options": ["2 × 6 and 3 × 4", "1 × 7 and 3 × 5", "2 × 3 and 1 × 6", "4 × 4 and 2 × 8"],
            "correctIndex": 1,
            "explanation": "1 × 7 and 3 × 5 both have perimeter 16, but their areas are 7 and 15. (2 × 6 and 3 × 4: perimeters 16 and 14; 2 × 3 and 1 × 6: same area 6, perimeters 10 and 14; 4 × 4 and 2 × 8: perimeters 16 and 20.)",
        },
        "teacherNotes": teacher(
            [
                "Give each group a closed string loop and a pinboard; let them make many rectangles and record area.",
                "Then give 12 square tiles and record perimeters of every arrangement.",
                "Cut and slide a paper triangle in front of the class.",
            ],
            [
                "Believing bigger perimeter always means bigger area.",
                "Thinking rearranging pieces changes the area.",
                "Treating a square as 'not a rectangle' and missing the largest-area answer.",
            ],
            "Rope rectangles: four students hold a 12 m rope at the corners on the playground, making different rectangles while the class records sides and area.",
            "Ganita Prakash Ch. 6 (same perimeter different area, split and rearrange); old NCERT Ch. 10 exercises.",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>On Sunday evening, Dadi sets a quiz on perimeter and area. Harsh answers fast; Disha answers carefully.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Rectangle: P = 2 × (l + b), A = l × b.</li>
  <li>Square: P = 4 × side, A = side × side.</li>
  <li>Regular polygon: P = number of sides × side.</li>
  <li>Triangle: A = ½ × base × height.</li>
  <li>Odd shapes: split into rectangles and add; on squared paper, count squares.</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Ask first: is it the edge (perimeter, in units) or the inside (area, in square units)?",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Cost of fencing",
                    "question": "A park is 40 m long and 25 m wide. Fencing costs ₹15 per metre. Find the cost of fencing it.",
                    "steps": [
                        "Perimeter = 2 × (40 + 25) = 2 × 65",
                        "= 130 m",
                        "Cost = 130 × 15 = <strong>₹1,950</strong>",
                    ],
                    "answer": "₹1,950",
                },
                {
                    "title": "Square: from perimeter to area",
                    "question": "A square has a perimeter of 60 m. Find its area.",
                    "steps": [
                        "Side = 60 ÷ 4 = 15 m",
                        "Area = 15 × 15",
                        "= <strong>225 sq m</strong>",
                    ],
                    "answer": "225 sq m",
                },
                {
                    "title": "Regular polygon",
                    "question": "Find the perimeter of a regular hexagon with side 7 cm.",
                    "steps": [
                        "A hexagon has 6 equal sides.",
                        "Perimeter = 6 × 7 = <strong>42 cm</strong>",
                    ],
                    "answer": "42 cm",
                },
                {
                    "title": "Missing side",
                    "question": "A rectangle has area 48 sq cm and length 8 cm. Find its breadth and its perimeter.",
                    "steps": [
                        "Breadth = 48 ÷ 8 = 6 cm",
                        "Perimeter = 2 × (8 + 6) = 2 × 14",
                        "= <strong>28 cm</strong> (breadth 6 cm)",
                    ],
                    "answer": "Breadth 6 cm, perimeter 28 cm",
                },
                {
                    "title": "Counting squares",
                    "question": "A leaf on squared paper covers 14 full squares, 10 more-than-half squares, 2 half squares and 9 less-than-half squares. Estimate its area.",
                    "steps": [
                        "Full: 14, more than half: 10 (each counts 1)",
                        "2 halves = 1",
                        "Less than half: ignore",
                        "Area ≈ 14 + 10 + 1 = <strong>25 sq units</strong>",
                    ],
                    "answer": "About 25 sq units",
                },
                {
                    "title": "Area of a triangle",
                    "question": "Find the area of the triangle with base 10 cm and height 6 cm.",
                    "figureSvg": _triangle_svg(),
                    "steps": [
                        "The rectangle around it is 10 × 6 = 60 sq cm.",
                        "The triangle is half of that rectangle.",
                        "Area = ½ × 60 = <strong>30 sq cm</strong>",
                    ],
                    "answer": "30 sq cm",
                },
                {
                    "title": "L-shaped flower bed",
                    "question": "Find the perimeter and the area of Mummy's L-shaped flower bed.",
                    "figureSvg": _lshape_svg(),
                    "steps": [
                        "Perimeter = 8 + 3 + 3 + 3 + 5 + 6 = 28 m",
                        "Split into two rectangles: top 8 × 3 = 24 sq m, bottom 5 × 3 = 15 sq m",
                        "Area = 24 + 15 = <strong>39 sq m</strong>; perimeter <strong>28 m</strong>",
                    ],
                    "answer": "Perimeter 28 m, area 39 sq m",
                },
                {
                    "title": "Same perimeter, largest area",
                    "question": "Using a 20 m rope, which rectangle with whole-metre sides has the largest area?",
                    "steps": [
                        "length + breadth = 20 ÷ 2 = 10",
                        "1 × 9 = 9, 2 × 8 = 16, 3 × 7 = 21, 4 × 6 = 24, 5 × 5 = 25",
                        "Largest: <strong>the 5 m × 5 m square, 25 sq m</strong>",
                    ],
                    "answer": "5 m × 5 m (25 sq m)",
                },
                {
                    "title": "Tiling a floor",
                    "question": "A floor is 4 m long and 3 m wide. How many square tiles of side 50 cm are needed to cover it?",
                    "steps": [
                        "Change to cm: 4 m = 400 cm, 3 m = 300 cm",
                        "Tiles along the length: 400 ÷ 50 = 8; along the breadth: 300 ÷ 50 = 6",
                        "Number of tiles = 8 × 6 = <strong>48</strong>",
                    ],
                    "answer": "48 tiles",
                },
                {
                    "title": "Cricket pitch",
                    "question": "A cricket pitch is a rectangle about 20 m long and 3 m wide (the official size is 20.12 m by 3.05 m). Find its approximate perimeter and area.",
                    "steps": [
                        "Perimeter ≈ 2 × (20 + 3) = 2 × 23 = 46 m",
                        "Area ≈ 20 × 3 = 60 sq m",
                        "<strong>About 46 m and about 60 sq m</strong>",
                    ],
                    "answer": "About 46 m; about 60 sq m",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Before solving, ask 'edge or inside?' and write the unit first.",
                "Q7: insist on splitting the L-shape into rectangles that do not overlap.",
                "Q9: convert both lengths to the same unit before dividing.",
            ],
            [
                "Q2: using 60 as the side, or dividing by 2 instead of 4.",
                "Q6: forgetting to halve.",
                "Q9: dividing the area in sq m by 50.",
            ],
            "Pair-share: one student says 'perimeter' or 'area' and the formula, the other calculates; swap for the next question.",
            "Covers old NCERT Ch. 10 Exercises 10.1–10.3 and Ganita Prakash Ch. 6 exercise patterns.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Perimeter and Area (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From Dadi's garden fence to the cricket rope, you have walked around shapes and filled them with squares. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering perimeter of rectangles, squares and regular polygons, area by counting squares, area of rectangles, squares and triangles, and how perimeter and area differ.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Perimeter goes around (units); area fills inside (square units).",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Perimeter and Area · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "The perimeter of a rectangle 9 cm long and 4 cm wide is:", "options": ["13 cm", "26 cm", "36 cm", "22 cm"], "answer": 1, "explanation": "2 × (9 + 4) = 2 × 13 = 26 cm.", "topic": "Perimeter of a rectangle"},
                {"q": "The perimeter of a square of side 7 m is:", "options": ["14 m", "49 m", "28 m", "21 m"], "answer": 2, "explanation": "4 × 7 = 28 m. 49 would be the area in sq m.", "topic": "Perimeter of a square"},
                {"q": "A regular pentagon has perimeter 45 cm. Each side is:", "options": ["9 cm", "5 cm", "15 cm", "8 cm"], "answer": 0, "explanation": "A pentagon has 5 equal sides: 45 ÷ 5 = 9 cm.", "topic": "Regular polygons"},
                {"q": "The area of a rectangle 12 m long and 5 m wide is:", "options": ["34 sq m", "60 sq m", "17 sq m", "120 sq m"], "answer": 1, "explanation": "12 × 5 = 60 sq m. 34 m is the perimeter.", "topic": "Area of a rectangle"},
                {"q": "A square has perimeter 32 cm. Its area is:", "options": ["32 sq cm", "64 sq cm", "16 sq cm", "256 sq cm"], "answer": 1, "explanation": "Side = 32 ÷ 4 = 8 cm, so area = 8 × 8 = 64 sq cm.", "topic": "Area of a square"},
                {"q": "When estimating area on squared paper, a square that is MORE than half covered counts as:", "options": ["0", "half", "1", "2"], "answer": 2, "explanation": "Full and more-than-half squares count as 1; exactly half counts as half; less than half is ignored.", "topic": "Counting squares"},
                {"q": "A triangle has base 10 cm and height 6 cm. Its area is:", "options": ["60 sq cm", "30 sq cm", "16 sq cm", "15 sq cm"], "answer": 1, "explanation": "It is half of the 10 × 6 rectangle: half of 60 = 30 sq cm.", "topic": "Area of a triangle"},
                {"q": "All these rectangles have perimeter 16 cm. Which has the largest area?", "options": ["1 cm × 7 cm", "2 cm × 6 cm", "3 cm × 5 cm", "4 cm × 4 cm"], "answer": 3, "explanation": "Areas: 7, 12, 15 and 16 sq cm. The square 4 × 4 has the largest area.", "topic": "Same perimeter, different area"},
                {"q": "Which statement is true?", "options": ["Shapes with the same area always have the same perimeter", "A 3 × 4 and a 2 × 6 rectangle have the same area but different perimeters", "Perimeter is measured in square units", "Cutting a shape and rearranging the pieces changes its area"], "answer": 1, "explanation": "Both have area 12, but their perimeters are 14 and 16.", "topic": "Perimeter vs area"},
                {"q": "A floor 6 m by 4 m is covered with 1 m square tiles costing ₹50 each. The total cost is:", "options": ["₹1,000", "₹1,200", "₹500", "₹2,400"], "answer": 1, "explanation": "6 × 4 = 24 tiles, and 24 × 50 = ₹1,200.", "topic": "Area in daily life"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q2 and Q4 catch mixing up perimeter and area; Q5 needs the side first; Q7 catches forgetting to halve."],
            "Exit ticket: draw two rectangles with the same perimeter but different areas, and write both measures with units.",
            "Matches old NCERT Ch. 10 Mensuration learning outcomes and Ganita Prakash Ch. 6 goals.",
        ),
    },
]


def seed_class6_perimeter_area():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Perimeter and Area")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Perimeter and Area: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Perimeter and Area: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_perimeter_area()
