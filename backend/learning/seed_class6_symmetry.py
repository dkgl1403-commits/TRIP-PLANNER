import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Symmetry (old NCERT Ch. 13 "Symmetry": making symmetric figures, ink-blot and paper-cut designs,
# figures with two or more lines of symmetry, reflection and symmetry; Ganita Prakash Ch. 9 "Symmetry": line
# symmetry, rotational symmetry, centre, angle and order of rotation, rangoli and kolam designs).
# Story: the Jaipur family from Makar Sankranti kite flying through Papa's railway signs, a mirror game,
# Diwali rangoli, Independence Day and a kolam at dawn.
#
# Verified facts used:
# - The Ashoka Chakra on the national flag has 24 equally spaced spokes (Flag Code of India, 2002;
#   Wikipedia "Flag Code of India"). So its spokes look the same after a turn of 360 / 24 = 15 degrees.
# - The front of the Taj Mahal in Agra is symmetric about a vertical line (standard textbook example; the
#   Taj Mahal was built by Shah Jahan, completed in the mid 1600s, so "almost 400 years ago" is safe).
# - Ambulances write the word AMBULANCE in mirror writing so drivers read it correctly in their mirrors.
# - Kolam: drawn with rice flour at the doorstep in the morning in Tamil Nadu and other South Indian homes;
#   Ganita Prakash Ch. 9 uses kolam and rangoli designs for symmetry.


SCENES_1 = [
    scene([
        L("Narrator", "It is Makar Sankranti in Jaipur, and the sky above the rooftops is full of kites.",
          "Jaipur mein Makar Sankranti hai, aur chhaton ke upar aasmaan patangon se bhara hai."),
        L("Disha", "Dadi, my new kite looks so balanced. The left side and the right side are exactly alike!",
          "Dadi, meri nayi patang kitni balanced lagti hai. Left side aur right side bilkul ek jaise hain!"),
    ], {"shape": "kite", "line": 0, "fold": 0}),
    scene([
        L("Dadi", "Fold it along the middle stick, beta. See? One half lies exactly on top of the other half.",
          "Ise beech wali dandi par modo, beta. Dekha? Ek aadha hissa doosre aadhe ke bilkul upar aa jaata hai."),
        L("Dadi", "Such a figure has line symmetry, and the fold line is called the line of symmetry, or the axis of symmetry.",
          "Aise figure mein line symmetry hoti hai, aur modne wali line ko line of symmetry, ya axis of symmetry kehte hain."),
    ], {"shape": "kite", "line": 0, "fold": 1}),
    scene([
        L("Harsh", "Then let me fold it across, along the cross stick. Same trick!",
          "Toh main ise aadi dandi par modta hoon. Wahi trick!"),
        L("Disha", "No, Harsh! The top part is short and the tail part is long. They do not cover each other.",
          "Nahi Harsh! Upar ka hissa chhota hai aur neeche ka lamba. Woh ek doosre ko nahi dhakte."),
        L("Dadi", "So the cross stick is not a line of symmetry. Not every line through the middle works.",
          "Toh aadi dandi line of symmetry nahi hai. Beech se jaane wali har line kaam nahi karti."),
    ], {"shape": "kite", "line": 90, "fold": 1}),
    scene([
        L("Neha", "My cake shop has heart shaped cookies. Fold one down the middle and the halves match too!",
          "Meri cake shop mein dil ke aakaar wali cookies hain. Ek ko beech se modo, toh dono aadhe bhi milte hain!"),
    ], {"shape": "heart", "line": 0, "fold": 1}),
    scene([
        L("Deepak", "On my last train trip to Agra, I saw the Taj Mahal. Its front is one of the most famous symmetric buildings in the world.",
          "Pichhli baar train se Agra gaya tha, toh Taj Mahal dekha. Uska saamne ka hissa duniya ki sabse mashhoor symmetric imaaraton mein se ek hai."),
        L("Dadi", "It was built almost 400 years ago. The dome, the arch and the minarets on both sides match across one vertical line.",
          "Yeh lagbhag 400 saal pehle bana tha. Gumbad, darwaaza aur dono taraf ki minaarein ek khadi line ke aar paar milti hain."),
    ], {"shape": "taj", "line": 0, "fold": 1}),
    scene([
        L("Harsh", "This parallelogram must fold along its slanting line. It looks so neat!",
          "Yeh parallelogram toh tirchhi line par mudega. Kitna neat dikhta hai!"),
        L("Dadi", "Try it, beta. The corners land in the wrong places. A parallelogram like this has no line of symmetry at all.",
          "Karke dekho, beta. Kone galat jagah girte hain. Aise parallelogram mein koi bhi line of symmetry nahi hoti."),
    ], {"shape": "para", "line": 45, "fold": 1}),
    scene([
        L("Disha", "Letters can be symmetric too! The letter E folds onto itself along a sleeping line, from left to right.",
          "Letters bhi symmetric ho sakte hain! E ka letter ek leti hui line par apne aap par mud jaata hai."),
        L("Dadi", "Yes. A line of symmetry can stand, lie down or even slant. What matters is that the two halves match.",
          "Haan. Line of symmetry khadi, leti ya tirchhi bhi ho sakti hai. Zaroori yeh hai ki dono aadhe milein."),
    ], {"shape": "E", "line": 90, "fold": 1}),
    scene([
        L("Dadi", "Your turn! Fold the letter H along every line you can, and find all its lines of symmetry.",
          "Ab aapki baari! H ke letter ko har line par modkar dekho, aur uski saari lines of symmetry dhoondo."),
    ], {"shape": "H", "line": 0, "fold": 0, "task": {"shape": "H"}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "On Sunday, Papa shows the children the signal boards and signs from his railway office.",
          "Itvaar ko Papa bachchon ko apne railway office ke signal boards aur signs dikhaate hain."),
        L("Deepak", "Signs come in many shapes. Let us count how many ways each shape can fold onto itself.",
          "Signs kai shapes ke hote hain. Chalo ginte hain ki har shape kitne tareekon se apne aap par mud sakti hai."),
    ], {"shape": "scalene", "show": 99}),
    scene([
        L("Disha", "This triangle has all three sides different. No fold works at all!",
          "Is triangle ki teeno bhujaayein alag hain. Koi bhi fold kaam nahi karta!"),
        L("Dadi", "Right. A scalene triangle has zero lines of symmetry. But an isosceles triangle, with two equal sides, has exactly one.",
          "Sahi. Scalene triangle mein zero lines of symmetry hoti hain. Lekin isosceles triangle, jiski do bhujaayein barabar hain, mein theek ek hoti hai."),
    ], {"shape": "iso", "show": 99}),
    scene([
        L("Harsh", "A rectangle has four lines. Two through the middles, and two along the corners!",
          "Rectangle mein chaar lines hain. Do beech se, aur do konon se!"),
        L("Dadi", "Fold a paper rectangle along a diagonal and check, Harsh. The corners stick out. A rectangle has only 2 lines of symmetry.",
          "Kaagaz ka rectangle diagonal par modkar dekho, Harsh. Kone bahar nikal jaate hain. Rectangle mein sirf 2 lines of symmetry hoti hain."),
    ], {"shape": "rect", "show": 99}),
    scene([
        L("Deepak", "The warning sign on the tracks is an equilateral triangle. All sides equal, so it folds 3 ways.",
          "Track ke paas laga warning sign equilateral triangle hai. Saari bhujaayein barabar, toh yeh 3 tareekon se mudta hai."),
    ], {"shape": "eqtri", "show": 99}),
    scene([
        L("Disha", "And a square folds 4 ways. Two through the middles of the sides and two along the diagonals!",
          "Aur square 4 tareekon se mudta hai. Do bhujaaon ke beech se aur do diagonals par!"),
    ], {"shape": "square", "show": 99}),
    scene([
        L("Dadi", "Do you see the pattern? A regular pentagon has 5 lines, and a regular hexagon has 6.",
          "Pattern dikha? Regular pentagon mein 5 lines hain, aur regular hexagon mein 6."),
        L("Dadi", "In a regular polygon, all sides and all angles are equal, so it has as many lines of symmetry as it has sides.",
          "Regular polygon mein saari bhujaayein aur saare angles barabar hote hain, isliye usme utni lines of symmetry hoti hain jitni bhujaayein."),
    ], {"shape": "hex", "show": 99}),
    scene([
        L("Deepak", "And the train wheel is a circle. Any line through its centre folds it perfectly.",
          "Aur train ka pahiya circle hai. Uske centre se jaane wali koi bhi line use bilkul sahi modti hai."),
        L("Harsh", "So a circle has endless lines of symmetry. The champion of symmetry!",
          "Toh circle mein anginat lines of symmetry hain. Symmetry ka champion!"),
    ], {"shape": "circle", "show": 99}),
    scene([
        L("Deepak", "Your turn! Pick a shape that has exactly 5 lines of symmetry.",
          "Ab aapki baari! Aisi shape chuno jisme theek 5 lines of symmetry hon."),
    ], {"shape": "scalene", "show": 99, "task": {"lines": 5}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "On Tuesday evening, Mummy is getting ready in front of the big mirror, and the children start a mirror game.",
          "Mangalvaar ki shaam, Mummy bade aaine ke saamne taiyaar ho rahi hain, aur bachche aaine ka khel shuru karte hain."),
        L("Neha", "Stand 2 steps in front of the mirror. Your image looks 2 steps behind it. The same distance on both sides!",
          "Aaine ke saamne 2 kadam par khade ho. Tumhaari image uske 2 kadam peeche dikhti hai. Dono taraf barabar doori!"),
    ], {"mode": "mirror", "px": 7, "py": 4}),
    scene([
        L("Dadi", "A point and its mirror image are always the same distance from the mirror line, and the line joining them crosses the mirror at a right angle.",
          "Ek point aur uski mirror image hamesha mirror line se barabar doori par hote hain, aur unhe jodne wali line aaine ko right angle par kaatti hai."),
        L("Disha", "When I move back to 5 boxes away, my image also moves 5 boxes away!",
          "Jab main peeche hatkar 5 box door jaati hoon, meri image bhi 5 box door chali jaati hai!"),
    ], {"mode": "mirror", "px": 4, "py": 4}),
    scene([
        L("Harsh", "Look at the flag. Mine points right, but the flag in the mirror points left!",
          "Jhande ko dekho. Mera wala right ki taraf hai, lekin aaine wala left ki taraf!"),
        L("Deepak", "That is why ambulances write their name in mirror writing. A driver in front reads it the right way in his mirror.",
          "Isiliye ambulance par naam ulta likha hota hai. Aage wala driver use apne aaine mein seedha padh leta hai."),
    ], {"mode": "mirror", "px": 2, "py": 7}),
    scene([
        L("Dadi", "Now an old school game. Drop some ink on one half of a paper, fold it along the middle, and press.",
          "Ab ek purana school ka khel. Kaagaz ke ek aadhe hisse par thodi syaahi giraao, beech se modo, aur dabaao."),
        L("Disha", "When I open it, the blot is perfectly symmetric! The fold became the line of symmetry.",
          "Kholne par dhabba bilkul symmetric hai! Mod hi line of symmetry ban gaya."),
    ], {"mode": "inkblot"}),
    scene([
        L("Neha", "For Diwali decorations, I fold a paper, cut half a diya along the folded edge, and open it.",
          "Diwali ki sajaavat ke liye main kaagaz modti hoon, mude hue kinaare par aadha diya kaatti hoon, aur kholti hoon."),
        L("Dadi", "A full symmetric diya! Fold the paper twice and cut, and you get a design with two lines of symmetry.",
          "Poora symmetric diya! Kaagaz ko do baar modkar kaato, toh do lines of symmetry wala design milta hai."),
    ], {"mode": "papercut"}),
    scene([
        L("Neha", "Your turn! Move point P so that its mirror image lands exactly on the green star.",
          "Ab aapki baari! Point P ko aise khiskaao ki uski mirror image theek hare taare par aaye."),
    ], {"mode": "mirror", "px": 2, "py": 7, "task": {"x": 13, "y": 4}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "It is Diwali morning. Dadi and Disha are making a rangoli on the floor near the front door.",
          "Diwali ki subah hai. Dadi aur Disha darwaaze ke paas zameen par rangoli bana rahi hain."),
        L("Dadi", "I have made the left half of a diya design. The blue line is the mirror line. Disha must make the right half.",
          "Maine diye ke design ka left aadha banaaya hai. Neeli line mirror line hai. Disha ko right aadha banaana hai."),
    ], {"lines": 1, "pattern": "diya", "reveal": False}),
    scene([
        L("Disha", "Every coloured square must have a partner on the other side, at the same distance from the blue line.",
          "Har rangeen square ka doosri taraf ek saathi hona chahiye, neeli line se utni hi doori par."),
        L("Dadi", "Shabash! Count the squares from the line, never from the edge of the floor.",
          "Shabash! Square line se gino, zameen ke kinaare se kabhi nahi."),
    ], {"lines": 1, "pattern": "diya", "reveal": True}),
    scene([
        L("Harsh", "I want a flower rangoli with two mirror lines, one standing and one lying down!",
          "Mujhe do mirror lines wali phool rangoli chahiye, ek khadi aur ek leti hui!"),
        L("Dadi", "Then draw only one corner. Reflect it across the standing line, then reflect both parts across the lying line.",
          "Toh sirf ek kona banaao. Use khadi line ke paar reflect karo, phir dono hisson ko leti line ke paar reflect karo."),
    ], {"lines": 2, "pattern": "flower", "reveal": False}),
    scene([
        L("Harsh", "One small corner became four. Now the whole rangoli has two lines of symmetry!",
          "Ek chhota kona chaar ban gaya. Ab poori rangoli mein do lines of symmetry hain!"),
        L("Neha", "Like my cake decorations. I pipe one quarter, then copy it into the other three.",
          "Bilkul meri cake ki sajaavat jaisa. Main ek chauthaai banaati hoon, phir baaki teen mein copy karti hoon."),
    ], {"lines": 2, "pattern": "flower", "reveal": True}),
    scene([
        L("Dadi", "Your turn! Complete the diya rangoli. Tap the squares so the blue line becomes a line of symmetry.",
          "Ab aapki baari! Diya rangoli poori karo. Square dabaao taaki neeli line line of symmetry ban jaaye."),
    ], {"lines": 1, "pattern": "diya", "reveal": False, "task": True}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "It is Independence Day. The family has hoisted the national flag on the roof, and Harsh is playing with a square paper card.",
          "Swatantrata Diwas hai. Parivaar ne chhat par tiranga lehraaya hai, aur Harsh ek square kaagaz ke card se khel raha hai."),
        L("Dadi", "Pin the card at its centre and turn it slowly. Watch the red dot.",
          "Card ko uske centre par pin karo aur dheere dheere ghumaao. Laal bindu ko dekho."),
    ], {"shape": "square", "angle": 0}),
    scene([
        L("Harsh", "At 45 degrees, it looks like a diamond. That does not look the same.",
          "45 degree par yeh diamond jaisa lagta hai. Yeh waisa nahi dikhta."),
    ], {"shape": "square", "angle": 45}),
    scene([
        L("Harsh", "But at 90 degrees, it fits its old outline exactly! Only the red dot tells me it moved.",
          "Lekin 90 degree par yeh apni purani outline mein bilkul fit ho jaata hai! Sirf laal bindu bataata hai ki yeh ghooma."),
        L("Dadi", "That is rotational symmetry. The square looks the same after a turn of less than a full turn. The point it turns about is the centre of rotation.",
          "Yahi rotational symmetry hai. Poore chakkar se kam ghumaane par bhi square waisa hi dikhta hai. Jis point par yeh ghoomta hai, woh centre of rotation hai."),
    ], {"shape": "square", "angle": 90}),
    scene([
        L("Dadi", "The smallest such turn is the angle of symmetry, here 90 degrees. In one full turn, the square looks the same 4 times, at 90, 180, 270 and 360 degrees.",
          "Sabse chhota aisa ghumaav angle of symmetry hai, yahaan 90 degree. Ek poore chakkar mein square 4 baar waisa dikhta hai, 90, 180, 270 aur 360 degree par."),
        L("Disha", "So the square has rotational symmetry of order 4! And 4 times 90 is 360.",
          "Toh square ki rotational symmetry ka order 4 hai! Aur 4 guna 90 barabar 360."),
    ], {"shape": "square", "angle": 360}),
    scene([
        L("Disha", "My kite only looks the same after a full turn of 360 degrees.",
          "Meri patang sirf 360 degree ke poore chakkar ke baad waisi dikhti hai."),
        L("Dadi", "Every figure looks the same after a full turn. So we say a figure has rotational symmetry only when it matches before 360 degrees. Your kite does not.",
          "Har figure poore chakkar ke baad waisa hi dikhta hai. Isliye rotational symmetry tabhi maante hain jab figure 360 degree se pehle mile. Tumhaari patang mein nahi hai."),
    ], {"shape": "kite", "angle": 360}),
    scene([
        L("Harsh", "My paper pinwheel has no line of symmetry. But turn it by 90 degrees and it looks the same!",
          "Meri kaagaz ki firki mein koi line of symmetry nahi hai. Lekin 90 degree ghumaao toh waisi hi dikhti hai!"),
        L("Dadi", "Good catch. A figure can have rotational symmetry without any line of symmetry.",
          "Badhiya pakda. Kisi figure mein bina line of symmetry ke bhi rotational symmetry ho sakti hai."),
    ], {"shape": "pinwheel", "angle": 90}),
    scene([
        L("Deepak", "A rectangle needs half a turn, 180 degrees, so its order is 2. An equilateral triangle needs 120 degrees, so its order is 3.",
          "Rectangle ko aadha chakkar, 180 degree chahiye, toh uska order 2 hai. Equilateral triangle ko 120 degree chahiye, toh uska order 3 hai."),
        L("Dadi", "The rule is simple. The angle of symmetry times the order always makes 360 degrees.",
          "Niyam aasaan hai. Angle of symmetry guna order hamesha 360 degree banata hai."),
    ], {"shape": "rect", "angle": 180}),
    scene([
        L("Disha", "Look at the Ashoka Chakra on our flag! It has 24 equally spaced spokes.",
          "Hamare jhande par Ashoka Chakra dekho! Usme 24 barabar doori wali teeliyaan hain."),
        L("Dadi", "So the spokes look the same after 360 divided by 24, which is 15 degrees. The order is 24!",
          "Toh teeliyaan 360 bhaag 24, yaani 15 degree ke baad waisi hi dikhti hain. Order 24 hai!"),
    ], {"shape": "chakra", "angle": 15}),
    scene([
        L("Deepak", "Your turn! Turn the windmill by the smallest angle that makes it look exactly the same.",
          "Ab aapki baari! Windmill ko sabse chhote angle se ghumaao jisse woh bilkul waisi dikhe."),
    ], {"shape": "windmill", "angle": 0, "task": {"shape": "windmill"}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "During the winter holidays, the family visits Dadi's friend in Chennai. At dawn, women are drawing kolams with rice flour at their doorsteps.",
          "Sardiyon ki chhuttiyon mein parivaar Chennai mein Dadi ki saheli ke ghar jaata hai. Subah subah auratein apne darwaazon par chawal ke aate se kolam bana rahi hain."),
        L("Dadi", "A kolam starts with a grid of dots, and the design grows around a centre. Let us build one with 4 petals.",
          "Kolam bindiyon ke grid se shuru hota hai, aur design ek centre ke chaaron taraf badhta hai. Chalo 4 pankhudiyon wala banaate hain."),
    ], {"n": 4, "sym": True, "showLines": False}),
    scene([
        L("Disha", "Each petal is symmetric, so I see 4 lines of symmetry. And a quarter turn, 90 degrees, brings it back. Order 4!",
          "Har pankhudi symmetric hai, toh mujhe 4 lines of symmetry dikhti hain. Aur chauthaai chakkar, 90 degree, use waapas le aata hai. Order 4!"),
    ], {"n": 4, "sym": True, "showLines": True}),
    scene([
        L("Harsh", "Now I curl every petal into a swirl, all in the same direction.",
          "Ab main har pankhudi ko ek hi disha mein ghumaavdaar bana deta hoon."),
        L("Dadi", "Now no fold works, so there are 0 lines of symmetry. But it still turns onto itself 4 times. Order 4, just like your pinwheel.",
          "Ab koi fold kaam nahi karta, toh 0 lines of symmetry hain. Lekin yeh ab bhi 4 baar apne aap par aata hai. Order 4, tumhaari firki jaisa."),
    ], {"n": 4, "sym": False, "showLines": True}),
    scene([
        L("Neha", "My flower cake has 6 petals. 6 lines of symmetry, and it looks the same every 60 degrees.",
          "Mere phool wale cake mein 6 pankhudiyaan hain. 6 lines of symmetry, aur yeh har 60 degree par waisa dikhta hai."),
    ], {"n": 6, "sym": True, "showLines": True}),
    scene([
        L("Disha", "And one single petal? It has 1 line of symmetry, but it needs a full turn to look the same.",
          "Aur sirf ek pankhudi? Usme 1 line of symmetry hai, lekin waisa dikhne ke liye poora chakkar chahiye."),
        L("Dadi", "Like the Taj Mahal. One line of symmetry, but no rotational symmetry. When a figure has two or more lines of symmetry, it always has rotational symmetry too.",
          "Taj Mahal jaisa. Ek line of symmetry, lekin rotational symmetry nahi. Jab kisi figure mein do ya zyaada lines of symmetry hon, toh usme rotational symmetry bhi zaroor hoti hai."),
    ], {"n": 1, "sym": True, "showLines": True}),
    scene([
        L("Dadi", "Your turn! Design a kolam with 8 lines of symmetry and rotational symmetry of order 8.",
          "Ab aapki baari! Aisa kolam banaao jisme 8 lines of symmetry hon aur rotational symmetry ka order 8 ho."),
    ], {"n": 3, "sym": False, "showLines": True, "task": {"lines": 8, "order": 8}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "Back home in Jaipur, Dadi sets a symmetry quiz at the dining table.",
          "Jaipur waapas aakar, Dadi dining table par symmetry ka quiz rakhti hain."),
        L("Dadi", "Question 1. How many lines of symmetry does the letter H have?",
          "Sawaal 1. H ke letter mein kitni lines of symmetry hain?"),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "A standing line through the middle works, and a lying line through the cross bar works. Slanting folds do not. So 2 lines.",
          "Beech se khadi line kaam karti hai, aur aadi patti se leti line bhi. Tirchhe fold nahi chalte. Toh 2 lines."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. A figure looks the same after turning by 72 degrees. What is its order of rotational symmetry?",
          "Sawaal 2. Ek figure 72 degree ghumaane par waisa hi dikhta hai. Uski rotational symmetry ka order kya hai?"),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "Angle times order makes 360. So 360 divided by 72, which is 5. Order 5, like a regular pentagon!",
          "Angle guna order 360 banata hai. Toh 360 bhaag 72, yaani 5. Order 5, regular pentagon jaisa!"),
        L("Dadi", "Shabash, Harsh.", "Shabash, Harsh."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _grid_svg(cells, mirror_cols=5, cols=10, rows=6, show_right=False):
    """A small rangoli grid with a vertical mirror line; `cells` are (col, row) on the left half."""
    c = 24
    w, h = cols * c, rows * c
    parts = [f'<svg viewBox="0 0 {w + 20} {h + 20}" width="{w + 20}" height="{h + 20}" xmlns="http://www.w3.org/2000/svg">']
    parts.append(f'<rect x="10" y="10" width="{w}" height="{h}" fill="#1c1917"/>')
    for i in range(cols + 1):
        parts.append(f'<line x1="{10 + i * c}" y1="10" x2="{10 + i * c}" y2="{10 + h}" stroke="#44403c"/>')
    for j in range(rows + 1):
        parts.append(f'<line x1="10" y1="{10 + j * c}" x2="{10 + w}" y2="{10 + j * c}" stroke="#44403c"/>')
    for (x, y) in cells:
        parts.append(f'<rect x="{12 + x * c}" y="{12 + y * c}" width="{c - 4}" height="{c - 4}" fill="#f472b6"/>')
        if show_right:
            parts.append(f'<rect x="{12 + (cols - 1 - x) * c}" y="{12 + y * c}" width="{c - 4}" height="{c - 4}" fill="#fbbf24"/>')
    parts.append(f'<line x1="{10 + mirror_cols * c}" y1="4" x2="{10 + mirror_cols * c}" y2="{h + 16}" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 4"/>')
    parts.append('</svg>')
    return "".join(parts)


def _shapes_svg():
    """Three figures: a square, a rectangle and a parallelogram, for counting lines of symmetry."""
    return (
        '<svg viewBox="0 0 330 120" width="330" height="120" xmlns="http://www.w3.org/2000/svg">'
        '<rect x="15" y="20" width="80" height="80" fill="none" stroke="#a78bfa" stroke-width="3"/>'
        '<text x="55" y="116" fill="#a78bfa" font-size="13" text-anchor="middle" font-family="sans-serif">A</text>'
        '<rect x="120" y="35" width="100" height="55" fill="none" stroke="#34d399" stroke-width="3"/>'
        '<text x="170" y="116" fill="#34d399" font-size="13" text-anchor="middle" font-family="sans-serif">B</text>'
        '<polygon points="240,90 300,90 320,35 260,35" fill="none" stroke="#fb923c" stroke-width="3"/>'
        '<text x="280" y="116" fill="#fb923c" font-size="13" text-anchor="middle" font-family="sans-serif">C</text>'
        '</svg>'
    )


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Kite Day · Lines of Symmetry",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On Makar Sankranti, Disha folds her kite down the middle stick and the halves match perfectly. Harsh tries the cross stick and fails. Mummy's heart cookies, the Taj Mahal and a tricky parallelogram show which folds work.</div>

<h2>Line symmetry</h2>
<div {FORMULA}>A figure has line symmetry if a line divides it into two halves that fit exactly on each other when folded.</div>
<div {CARD}>
  <div>The fold line is called the <strong>line of symmetry</strong> or <strong>axis of symmetry</strong>.</div>
  <div>Each half is the <strong>mirror image</strong> of the other.</div>
  <div>The line can be vertical, horizontal or slanting.</div>
</div>

<h2>Testing a line: the fold test</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Figure</th><th class="text-left">Fold that works</th><th>Lines</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Kite (patang)</td><td>along the long middle stick</td><td class="text-center">1</td></tr>
    <tr><td>Heart</td><td>vertical, through the dip</td><td class="text-center">1</td></tr>
    <tr><td>Front of the Taj Mahal</td><td>vertical, through the dome</td><td class="text-center">1</td></tr>
    <tr><td>Letter E</td><td>horizontal, through the middle bar</td><td class="text-center">1</td></tr>
    <tr><td>Letter H</td><td>vertical and horizontal</td><td class="text-center">2</td></tr>
    <tr><td>Parallelogram (not a rectangle or rhombus)</td><td>none</td><td class="text-center">0</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div><strong>Letters:</strong> A, M, T, U, V, W, Y have a vertical line; B, C, D, E, K have a horizontal line; H, I, O, X have both. F, G, J, L, N, P, Q, R, S, Z have none (in plain capital letters).</div>
</div>
""",
        "keyInsight": "A line of symmetry is a fold line where the two halves fit exactly on top of each other.",
        "widgetType": "Class6SymmetryFoldWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Which of these capital letters has a horizontal line of symmetry but NOT a vertical one?",
            "options": ["A", "H", "B", "N"],
            "correctIndex": 2,
            "explanation": "B folds onto itself along a horizontal line through its middle, but its left and right sides differ. A has only a vertical line, H has both, N has none.",
        },
        "teacherNotes": teacher(
            [
                "Give every student paper cut-outs (kite, heart, parallelogram) and let them fold before naming anything.",
                "Stress that the two halves must COVER each other exactly, not just have equal area.",
                "Use capital letters on the board: students come up and draw the lines of symmetry.",
            ],
            [
                "Thinking every line through the middle is a line of symmetry (the kite's cross stick).",
                "Thinking a parallelogram's diagonal is a line of symmetry because it cuts it into two equal triangles.",
                "Forgetting slanting lines of symmetry.",
            ],
            "Fold-and-check race: pairs get 8 paper shapes and sort them into 'no line', 'one line', 'more than one line' by folding.",
            "Old NCERT Ch. 13 (13.1 introduction, 13.2 making symmetric figures); Ganita Prakash Ch. 9 (9.1 line of symmetry).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Papa's Railway Signs · Figures with Many Lines",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Papa brings out signal boards and signs from his railway office. The children count the folds of each shape, Harsh is caught out by the rectangle's diagonal, and the train wheel turns out to be the champion of symmetry.</div>

<h2>How many lines of symmetry?</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Figure</th><th>Lines of symmetry</th><th class="text-left">Where</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Scalene triangle</td><td class="text-center">0</td><td>none</td></tr>
    <tr><td>Isosceles triangle</td><td class="text-center">1</td><td>from the top corner to the middle of the base</td></tr>
    <tr><td>Rectangle</td><td class="text-center">2</td><td>through the middles of opposite sides (NOT the diagonals)</td></tr>
    <tr><td>Rhombus</td><td class="text-center">2</td><td>the two diagonals</td></tr>
    <tr><td>Equilateral triangle</td><td class="text-center">3</td><td>from each corner to the middle of the opposite side</td></tr>
    <tr><td>Square</td><td class="text-center">4</td><td>2 through the middles of sides + 2 diagonals</td></tr>
    <tr><td>Regular pentagon</td><td class="text-center">5</td><td>from each corner to the middle of the opposite side</td></tr>
    <tr><td>Regular hexagon</td><td class="text-center">6</td><td>3 through opposite corners + 3 through middles of opposite sides</td></tr>
    <tr><td>Circle</td><td class="text-center">infinitely many</td><td>every line through the centre (every diameter)</td></tr>
  </tbody>
</table>
<div {FORMULA}>A regular polygon with n sides has exactly n lines of symmetry.</div>
<div {CARD}>
  <div>A <strong>regular polygon</strong> has all sides equal and all angles equal.</div>
  <div>All the lines of symmetry of a regular polygon pass through its centre.</div>
</div>
""",
        "keyInsight": "The more 'regular' a shape is, the more lines of symmetry it has: a regular polygon has as many as it has sides, and a circle has endlessly many.",
        "widgetType": "Class6SymmetryLinesWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "How many lines of symmetry does a rectangle (which is not a square) have?",
            "options": ["0", "2", "4", "Infinitely many"],
            "correctIndex": 1,
            "explanation": "Only the two lines through the middles of opposite sides work. Folding along a diagonal leaves the corners sticking out.",
        },
        "teacherNotes": teacher(
            [
                "Fold a paper rectangle along a diagonal in front of the class: the corners do not meet. This one demo fixes the most common error.",
                "Build the table on the board as the class finds each count; let students spot the 'sides = lines' pattern.",
                "For the circle, fold a paper circle several times; every crease passes through the centre.",
            ],
            [
                "Saying a rectangle has 4 lines of symmetry.",
                "Missing the lines through the middles of sides in a square or hexagon.",
                "Applying 'sides = lines' to polygons that are not regular.",
            ],
            "Symmetry hunt: groups list 10 objects in the classroom or school and record how many lines of symmetry each has.",
            "Old NCERT Ch. 13 (13.3 figures with two or more lines of symmetry); Ganita Prakash Ch. 9 (lines of symmetry of regular polygons).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Mummy's Mirror · Reflection, Ink Blots and Paper Cuts",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>The children play a mirror game in front of Mummy's big mirror, notice that the mirror swaps left and right, make ink-blot pictures and cut paper diyas for Diwali.</div>

<h2>Reflection and symmetry</h2>
<div {FORMULA}>A point and its image are at the same distance from the mirror line, on opposite sides.</div>
<div {CARD}>
  <div>The line joining a point and its image is <strong>perpendicular</strong> (at 90°) to the mirror line.</div>
  <div>A mirror image has the same size and shape, but <strong>left and right are swapped</strong>. That is why "AMBULANCE" is written in mirror writing on the front of ambulances.</div>
  <div>Line symmetry and reflection are closely linked: in a symmetric figure, one half is the reflection of the other in the line of symmetry.</div>
</div>

<h2>Making symmetric designs</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Activity</th><th class="text-left">What you do</th><th class="text-left">Line of symmetry</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Ink blot</td><td>drop ink on one half, fold, press, open</td><td>the fold</td></tr>
    <tr><td>Paper cut (1 fold)</td><td>fold once, cut a shape on the folded edge, open</td><td>the fold (1 line)</td></tr>
    <tr><td>Paper cut (2 folds)</td><td>fold twice, cut, open</td><td>both folds (2 lines)</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "A mirror line acts like a fold: every point and its image are equally far from it, on opposite sides.",
        "widgetType": "Class6SymmetryMirrorWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "A point is 4 cm to the left of a mirror line. Where is its image?",
            "options": ["4 cm to the left of the line", "8 cm to the right of the line", "4 cm to the right of the line", "On the line"],
            "correctIndex": 2,
            "explanation": "The image is the same distance from the mirror, on the other side: 4 cm to the right.",
        },
        "teacherNotes": teacher(
            [
                "Bring a small mirror; place it on a drawn half-figure so students see the whole figure appear.",
                "On squared paper, count boxes from the mirror line, not from the page edge.",
                "Do the ink-blot activity live; it is fast and memorable.",
            ],
            [
                "Copying the half-figure (sliding it) instead of reflecting it, so left and right are not swapped.",
                "Measuring distances from the edge of the paper instead of the mirror line.",
                "Reflecting slanting lines with the wrong slant.",
            ],
            "Ink-blot gallery: each student makes an ink blot, marks its line of symmetry, and gives it a name.",
            "Old NCERT Ch. 13 (13.2 ink-blot devils, paper-cut designs; 13.4 reflection and symmetry); Ganita Prakash Ch. 9 (ink blots, paper folding and cutting).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Diwali Rangoli · Completing Symmetric Designs",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On Diwali morning, Dadi draws half of a diya rangoli and Disha completes it across a mirror line. Harsh wants a flower with two mirror lines, and finds that one corner is enough to build the whole design.</div>

<h2>Completing a figure about a line of symmetry</h2>
<ol>
  <li>For each coloured square, count how many squares it is from the mirror line.</li>
  <li>Count the same number on the other side, in the same row.</li>
  <li>Colour that square. Repeat for every square.</li>
</ol>
<div {CARD}>
  <div>With <strong>two</strong> perpendicular mirror lines, draw one quarter, reflect it across the first line, then reflect both halves across the second line: one corner becomes four.</div>
  <div>Rangolis and kolams are often drawn on a grid of dots, which makes counting easy.</div>
</div>
<div {FORMULA}>Always count from the mirror line, never from the edge.</div>
""",
        "keyInsight": "To complete a symmetric design, give every coloured square a twin at the same distance on the other side of the mirror line.",
        "widgetType": "Class6SymmetryRangoliWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "On a grid, a vertical mirror line runs between columns 5 and 6. A square is coloured in column 3. In which column is its image?",
            "options": ["Column 7", "Column 8", "Column 9", "Column 6"],
            "correctIndex": 1,
            "explanation": "Column 3 is the 3rd column to the left of the line (columns 5, 4, 3). The 3rd column to the right is 6, 7, 8, so column 8.",
        },
        "teacherNotes": teacher(
            [
                "Use squared paper or a dot grid; let students colour half a design and swap with a partner to complete.",
                "Model the counting out loud: 'one, two, three from the line, so one, two, three on the other side'.",
                "Connect to real rangolis and kolams students have seen at home.",
            ],
            [
                "Translating (copying the half as it is) instead of reflecting.",
                "Counting the mirror line itself as a square.",
                "With two lines, reflecting only across one of them.",
            ],
            "Rangoli relay: in pairs on a dot grid, one student draws a quarter rangoli, the other completes it using two mirror lines.",
            "Old NCERT Ch. 13 (13.2 completing symmetric figures, Exercise 13.2); Ganita Prakash Ch. 9 (rangoli and kolam designs).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Independence Day · Rotational Symmetry",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>On Independence Day, Harsh spins a square card on a pin and finds it fits its own outline after a quarter turn. The family tests a kite, a pinwheel, a rectangle and finally the Ashoka Chakra on the national flag.</div>

<h2>Rotational symmetry</h2>
<div {FORMULA}>A figure has rotational symmetry if it looks exactly the same after a turn of less than 360° about a fixed point.</div>
<div {CARD}>
  <div><strong>Centre of rotation:</strong> the fixed point the figure turns about.</div>
  <div><strong>Angle of symmetry (angle of rotation):</strong> the smallest turn after which the figure looks the same.</div>
  <div><strong>Order of rotational symmetry:</strong> the number of times the figure looks the same in one full turn (360° counts).</div>
</div>
<div {FORMULA}>angle of symmetry × order = 360°</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Figure</th><th>Angle of symmetry</th><th>Order</th><th>Lines of symmetry</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Kite</td><td class="text-center">360° (none smaller)</td><td class="text-center">1 (no rotational symmetry)</td><td class="text-center">1</td></tr>
    <tr><td>Rectangle, parallelogram</td><td class="text-center">180°</td><td class="text-center">2</td><td class="text-center">2, 0</td></tr>
    <tr><td>Equilateral triangle</td><td class="text-center">120°</td><td class="text-center">3</td><td class="text-center">3</td></tr>
    <tr><td>Square</td><td class="text-center">90°</td><td class="text-center">4</td><td class="text-center">4</td></tr>
    <tr><td>Paper pinwheel</td><td class="text-center">90°</td><td class="text-center">4</td><td class="text-center">0</td></tr>
    <tr><td>Regular hexagon</td><td class="text-center">60°</td><td class="text-center">6</td><td class="text-center">6</td></tr>
    <tr><td>Ashoka Chakra (24 spokes)</td><td class="text-center">15°</td><td class="text-center">24</td><td class="text-center">—</td></tr>
  </tbody>
</table>
<p>The Ashoka Chakra on India's national flag has 24 equally spaced spokes (Flag Code of India), so 360° ÷ 24 = 15°.</p>
""",
        "keyInsight": "The smallest turn that makes a figure look the same is its angle of symmetry, and the angle times the order always makes 360 degrees.",
        "widgetType": "Class6SymmetryRotateWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "What is the angle of symmetry of a regular hexagon?",
            "options": ["30°", "60°", "90°", "120°"],
            "correctIndex": 1,
            "explanation": "A regular hexagon has rotational symmetry of order 6, so the angle is 360° ÷ 6 = 60°.",
        },
        "teacherNotes": teacher(
            [
                "Trace a shape on paper, pin a cut-out copy at its centre, and turn it over the tracing. Mark one corner so students can see it has moved.",
                "Count the matches in one full turn (including 360°) to get the order.",
                "Show a pinwheel: rotational symmetry without line symmetry.",
            ],
            [
                "Saying every figure has rotational symmetry because it matches after 360°.",
                "Forgetting to count the 360° position when finding the order.",
                "Mixing up the angle of symmetry with the order.",
            ],
            "Turn-and-trace: each group gets a cut-out (square, rectangle, triangle, pinwheel) and finds its angle and order by turning it over its tracing.",
            "Ganita Prakash Ch. 9 (9.2 rotational symmetry: centre, angle and order of rotation). Bridge to Class 7: old NCERT Class 7 Ch. 14 Symmetry.",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Kolam at Dawn · Line and Rotational Symmetry Together",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>In Chennai, the family watches kolams being drawn with rice flour at dawn. They build petal designs and discover how the number of petals decides both the lines of symmetry and the order of rotation.</div>

<h2>Both kinds of symmetry</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Design</th><th>Lines of symmetry</th><th>Order of rotation</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>4 symmetric petals</td><td class="text-center">4</td><td class="text-center">4</td></tr>
    <tr><td>4 swirls (all curling the same way)</td><td class="text-center">0</td><td class="text-center">4</td></tr>
    <tr><td>6 symmetric petals</td><td class="text-center">6</td><td class="text-center">6</td></tr>
    <tr><td>1 petal, Taj Mahal front</td><td class="text-center">1</td><td class="text-center">1 (none)</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>A figure can have <strong>line symmetry only</strong> (kite, Taj Mahal), <strong>rotational symmetry only</strong> (pinwheel, parallelogram, letters S, N, Z), <strong>both</strong> (square, regular polygons, circle, many kolams) or <strong>neither</strong> (scalene triangle).</div>
  <div>If a figure has <strong>two or more</strong> lines of symmetry, it always has rotational symmetry.</div>
</div>
<div {FORMULA}>n symmetric petals → n lines of symmetry, order n, angle 360° ÷ n</div>
""",
        "keyInsight": "Line symmetry and rotational symmetry are different ideas: a design can have one, both or neither.",
        "widgetType": "Class6SymmetryDesignWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Which figure has rotational symmetry but NO line of symmetry?",
            "options": ["Square", "Letter S", "Kite", "Letter A"],
            "correctIndex": 1,
            "explanation": "The letter S looks the same after half a turn (order 2), but no fold makes its halves match. The square has both; the kite and A have line symmetry only.",
        },
        "teacherNotes": teacher(
            [
                "Draw a 4-petal kolam on a dot grid, then turn the petals into swirls and ask what changed.",
                "Sort figures into a 2 by 2 table: line symmetry yes or no, rotational symmetry yes or no.",
                "Invite students to share kolam or rangoli designs from home.",
            ],
            [
                "Thinking a design with rotational symmetry must also have line symmetry.",
                "Giving the order as the number of petals when petals are not all the same.",
                "Missing the lines that pass between petals.",
            ],
            "Kolam design challenge: on a 5 by 5 dot grid, design a kolam with exactly 4 lines of symmetry; then one with order 4 and no lines.",
            "Ganita Prakash Ch. 9 (symmetry in rangoli and kolam, figures with both kinds of symmetry); old NCERT Ch. 13 (Exercise 13.3).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>Back in Jaipur, Dadi sets a symmetry quiz at the dining table.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Line of symmetry: fold test, do the halves cover each other exactly?</li>
  <li>Regular polygon with n sides: n lines of symmetry.</li>
  <li>Mirror image: same distance from the mirror line, on the other side.</li>
  <li>Angle of symmetry × order = 360°.</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Fold to test lines, turn to test rotation, and use angle times order equals 360 degrees.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Lines of symmetry of a letter",
                    "question": "How many lines of symmetry does the capital letter H have?",
                    "steps": [
                        "Vertical line through the middle: the two upright bars match. ✔",
                        "Horizontal line through the cross bar: top and bottom match. ✔",
                        "Slanting folds do not match, so H has <strong>2 lines of symmetry</strong>.",
                    ],
                    "answer": "2",
                },
                {
                    "title": "Order from the angle",
                    "question": "A figure looks the same after a turn of 72°. What is its order of rotational symmetry?",
                    "steps": [
                        "Angle of symmetry × order = 360°",
                        "Order = 360 ÷ 72",
                        "= <strong>5</strong> (like a regular pentagon)",
                    ],
                    "answer": "5",
                },
                {
                    "title": "Angle from the order",
                    "question": "The Ashoka Chakra has 24 equally spaced spokes. What is the smallest angle it can be turned to look the same?",
                    "steps": [
                        "24 equal spokes, so the order is 24.",
                        "Angle = 360° ÷ 24",
                        "= <strong>15°</strong>",
                    ],
                    "answer": "15°",
                },
                {
                    "title": "Counting lines in figures",
                    "question": "How many lines of symmetry do the square (A), the rectangle (B) and the parallelogram (C) have?",
                    "figureSvg": _shapes_svg(),
                    "steps": [
                        "Square A: 2 through middles of sides + 2 diagonals = 4",
                        "Rectangle B: only the 2 through middles of sides (diagonals fail) = 2",
                        "Parallelogram C: no fold works = 0",
                        "<strong>A: 4, B: 2, C: 0</strong>",
                    ],
                    "answer": "4, 2, 0",
                },
                {
                    "title": "Mirror image distance",
                    "question": "Disha stands 3 m in front of a mirror. How far is she from her image?",
                    "steps": [
                        "Her image is 3 m behind the mirror.",
                        "Distance = 3 m + 3 m",
                        "= <strong>6 m</strong>",
                    ],
                    "answer": "6 m",
                },
                {
                    "title": "Completing a rangoli",
                    "question": "The pink squares are on the left of the blue mirror line. Where do their images go?",
                    "figureSvg": _grid_svg([(4, 0), (3, 1), (2, 2), (4, 2), (1, 4), (3, 5)], rows=6),
                    "steps": [
                        "Count each square's distance from the mirror line, in its own row.",
                        "Column 4 (next to the line) → column 5 (next to the line on the right); column 3 → 6; column 2 → 7; column 1 → 8.",
                        "Colour the same rows on the right side at those columns (counting columns 0 to 9).",
                        "Check: every pink square now has a twin at the same distance on the other side.",
                    ],
                    "answer": "Images at the same distance from the line, in the same rows",
                },
                {
                    "title": "Regular polygon",
                    "question": "A regular octagon (8 equal sides, 8 equal angles) is used for a stop sign. How many lines of symmetry does it have, and what is its angle of symmetry?",
                    "steps": [
                        "Regular polygon with n sides → n lines of symmetry → 8 lines",
                        "Order of rotation = 8",
                        "Angle = 360° ÷ 8 = 45°",
                        "<strong>8 lines; 45°</strong>",
                    ],
                    "answer": "8 lines, 45°",
                },
                {
                    "title": "Order including the full turn",
                    "question": "A rectangle is turned about its centre. At which angles between 0° and 360° (including 360°) does it look the same? What is its order?",
                    "steps": [
                        "Half a turn, 180°: it fits its outline. ✔",
                        "90°: the long side stands up, so it does not fit. ✘",
                        "Full turn, 360°: it fits. ✔",
                        "Matches at 180° and 360°, so <strong>order 2</strong>.",
                    ],
                    "answer": "180° and 360°; order 2",
                },
                {
                    "title": "Paper cutting",
                    "question": "A paper is folded twice (into quarters), a shape is cut, and the paper is opened. How many lines of symmetry does the design have at least?",
                    "steps": [
                        "Each fold becomes a line of symmetry when the paper is opened.",
                        "Two folds, at right angles to each other.",
                        "At least <strong>2 lines of symmetry</strong>.",
                    ],
                    "answer": "2",
                },
                {
                    "title": "Line or rotation?",
                    "question": "For the letters A, S, H and Z, say which have line symmetry and which have rotational symmetry.",
                    "steps": [
                        "A: vertical line only; no rotational symmetry.",
                        "S and Z: no line of symmetry; look the same after 180°, order 2.",
                        "H: 2 lines of symmetry and order 2.",
                        "<strong>Line: A, H. Rotational: S, Z, H.</strong>",
                    ],
                    "answer": "Line: A, H; rotational: S, Z, H",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Keep paper cut-outs handy so students can check answers by folding and turning.",
                "Q2 and Q3 practise the same rule in both directions: angle times order makes 360.",
                "Q10 is a good discussion question: sort letters into a two-way table.",
            ],
            [
                "Q4: giving the rectangle 4 lines.",
                "Q5: answering 3 m (distance to the mirror, not to the image).",
                "Q8: forgetting that 360° counts in the order.",
            ],
            "Pair-share: one student draws a figure, the other states its lines of symmetry and order of rotation; swap.",
            "Covers old NCERT Ch. 13 Exercises 13.1–13.3 and Ganita Prakash Ch. 9 exercise patterns.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Symmetry (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From kites and rangolis to the Ashoka Chakra, you have folded, reflected and turned figures. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering lines of symmetry, regular polygons, reflection, completing designs, and rotational symmetry.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Fold to find lines; turn to find the order.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Symmetry · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "A line of symmetry divides a figure into two parts that:", "options": ["Have the same colour", "Fit exactly on each other when folded", "Have the same perimeter only", "Are both triangles"], "answer": 1, "explanation": "A line of symmetry is a fold line where the two halves cover each other exactly.", "topic": "Line symmetry"},
                {"q": "How many lines of symmetry does a square have?", "options": ["1", "2", "4", "8"], "answer": 2, "explanation": "2 through the middles of opposite sides and 2 along the diagonals.", "topic": "Figures with many lines"},
                {"q": "Which triangle has exactly one line of symmetry?", "options": ["Equilateral", "Isosceles (not equilateral)", "Scalene", "None"], "answer": 1, "explanation": "An isosceles triangle folds along the line from its top corner to the middle of its base. Equilateral has 3; scalene has 0.", "topic": "Figures with many lines"},
                {"q": "How many lines of symmetry does a circle have?", "options": ["1", "2", "360", "Infinitely many"], "answer": 3, "explanation": "Every line through the centre (every diameter) is a line of symmetry.", "topic": "Figures with many lines"},
                {"q": "Which capital letter has NO line of symmetry?", "options": ["A", "D", "N", "X"], "answer": 2, "explanation": "N has no fold line (it has rotational symmetry instead). A has a vertical line, D a horizontal line, X both.", "topic": "Line symmetry"},
                {"q": "A point is 5 boxes to the left of a mirror line. Its image is:", "options": ["5 boxes to the left of the line", "5 boxes to the right of the line", "10 boxes to the right of the line", "On the mirror line"], "answer": 1, "explanation": "The image is the same distance from the mirror line, on the opposite side.", "topic": "Reflection"},
                {"q": "What is the order of rotational symmetry of an equilateral triangle?", "options": ["1", "2", "3", "6"], "answer": 2, "explanation": "It looks the same after 120°, 240° and 360°: 3 times in a full turn.", "topic": "Rotational symmetry"},
                {"q": "A design looks the same after every 60° turn. Its order of rotational symmetry is:", "options": ["3", "4", "6", "60"], "answer": 2, "explanation": "Order = 360 ÷ 60 = 6.", "topic": "Rotational symmetry"},
                {"q": "The Ashoka Chakra has 24 equally spaced spokes. Its angle of symmetry is:", "options": ["10°", "15°", "24°", "30°"], "answer": 1, "explanation": "360° ÷ 24 = 15°.", "topic": "Rotational symmetry"},
                {"q": "Which figure has rotational symmetry but no line of symmetry?", "options": ["Rectangle", "Kite", "Parallelogram (not a rectangle or rhombus)", "Isosceles triangle"], "answer": 2, "explanation": "A parallelogram looks the same after half a turn (order 2) but no fold works. A rectangle has both; kite and isosceles triangle have line symmetry only.", "topic": "Line and rotational symmetry"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q2 and Q4 catch undercounting; Q5 catches students who confuse line and rotational symmetry; Q10 catches 'rotation needs a mirror line'."],
            "Exit ticket: draw a figure with exactly 2 lines of symmetry, and state its order of rotational symmetry.",
            "Matches old NCERT Ch. 13 Symmetry learning outcomes and Ganita Prakash Ch. 9 goals.",
        ),
    },
]


def seed_class6_symmetry():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Symmetry")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Symmetry: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Symmetry: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_symmetry()
