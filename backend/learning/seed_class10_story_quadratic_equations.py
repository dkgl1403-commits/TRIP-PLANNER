import json
from db import SessionLocal
from seed_class10_structure import get_class10_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 10 · Quadratic Equations (NCERT Class 10 Ch. 4, rationalised syllabus 2023-24 onward: 4.1 Introduction,
# 4.2 Quadratic Equations, 4.3 Solution by Factorisation, 4.4 Nature of Roots; the quadratic formula is stated in
# the chapter). Completing the square as a separate method is deleted from the current syllabus, so it is only
# mentioned as the idea behind the formula, not taught as a method.
# Story: the Jaipur family during board-exam preparation: Mummy's new shop tray, Papa's train timings, the
# cricket ground, and a park the colony wants to build.
#
# Verified facts used:
# - NCERT Class 10 Ch. 4 credits Brahmagupta (C.E. 598-665) with an explicit formula for ax^2 + bx = c, and says
#   Sridharacharya (C.E. 1025) derived the formula now known as the quadratic formula (by completing the square).
#   (NCERT text as reproduced at sathee.iitk.ac.in, "Chapter-04 Quadratic Equations"; testbook.com,
#   "Sridharacharya Formula".) Narration attributes the dates to "our NCERT book" and says "about".
# All other numbers are textbook-style word problems (no real-world statistics are claimed).


# ─────────────────────────────── Part 1: what is a quadratic equation ───────────────────────────────
SCENES_1 = [
    scene([
        L("Narrator", "It is November in Jaipur. The board exams are four months away, and Mummy's bakery has finally become a small shop.",
          "Jaipur mein November hai. Board exams chaar mahine door hain, aur Mummy ki bakery ab ek chhoti dukaan ban gayi hai."),
        L("Neha", "I am ordering a rectangular display tray. Its length must be 3 centimetres more than its width, and its area must be exactly 180 square centimetres.",
          "Main ek rectangular display tray order kar rahi hoon. Iski length width se 3 centimetre zyaada honi chahiye, aur area theek 180 square centimetre."),
    ], {"mode": "form", "eq": 0, "step": 0}),
    scene([
        L("Disha", "Let the width be x. Then the length is x plus 3, and the area is x times x plus 3. So x times x plus 3 equals 180!",
          "Width ko x maan lo. Toh length x plus 3 hai, aur area x guna x plus 3. Toh x guna x plus 3 barabar 180!"),
        L("Dadi", "Good. Now open the bracket. x times x is x squared, and x times 3 is 3 x. So x squared plus 3 x equals 180.",
          "Bahut accha. Ab bracket kholo. x guna x, x squared hai, aur x guna 3, 3 x hai. Toh x squared plus 3 x barabar 180."),
    ], {"mode": "form", "eq": 0, "step": 1}),
    scene([
        L("Dadi", "Bring everything to one side and you get x squared plus 3 x minus 180 equals 0. The highest power of x is 2. This is a quadratic equation.",
          "Sab kuch ek taraf le aao toh milta hai x squared plus 3 x minus 180 barabar 0. x ki sabse badi power 2 hai. Yeh quadratic equation hai."),
        L("Harsh", "Quadratic? But quad means four, Dadi. Why not call it a square equation?",
          "Quadratic? Lekin quad ka matlab toh chaar hota hai, Dadi. Ise square equation kyon nahi kehte?"),
        L("Dadi", "Clever question! It comes from the Latin word for a square. The x squared term is the heart of it.",
          "Badhiya sawaal! Yeh square ke Latin shabd se aaya hai. x squared wala term hi iska dil hai."),
    ], {"mode": "form", "eq": 0, "step": 2}),
    scene([
        L("Dadi", "Every quadratic equation can be written as a x squared plus b x plus c equals 0. This is the standard form. a, b and c are real numbers, and a must not be 0.",
          "Har quadratic equation ko a x squared plus b x plus c barabar 0 ki tarah likh sakte hain. Yeh standard form hai. a, b aur c real numbers hain, aur a zero nahi hona chahiye."),
        L("Disha", "Why can a not be 0?", "a zero kyon nahi ho sakta?"),
        L("Dadi", "If a is 0, the x squared term vanishes, and only b x plus c is left. That is a linear equation, not a quadratic.",
          "Agar a zero ho, toh x squared wala term gayab ho jaata hai, aur sirf b x plus c bachta hai. Woh linear equation hai, quadratic nahi."),
    ], {"mode": "form", "eq": 1, "step": 2}),
    scene([
        L("Harsh", "Here is a tricky one from my sample paper. x plus 2, the whole cubed, equals x cubed minus 4. It has cubes, so it is not quadratic!",
          "Mere sample paper ka ek tricky sawaal. x plus 2 ka cube barabar x cube minus 4. Ismein cube hai, toh yeh quadratic nahi!"),
        L("Dadi", "Do not judge too fast, beta. Expand it. The x cubed terms cancel on both sides, and we get 6 x squared plus 12 x plus 12 equals 0. It is quadratic!",
          "Itni jaldi faisla mat karo, beta. Expand karo. Dono taraf ke x cube cancel ho jaate hain, aur milta hai 6 x squared plus 12 x plus 12 barabar 0. Yeh quadratic hai!"),
    ], {"mode": "form", "eq": 3, "step": 2}),
    scene([
        L("Disha", "And this one goes the other way. x times x plus 1, plus 8, equals x plus 2 times x minus 2. The x squared terms cancel, and only x plus 12 equals 0 is left.",
          "Aur yeh ulta hai. x guna x plus 1, plus 8, barabar x plus 2 guna x minus 2. x squared ke terms cancel ho jaate hain, aur sirf x plus 12 barabar 0 bachta hai."),
        L("Dadi", "So it is linear. The rule: always simplify first, then look at the highest power.",
          "Toh yeh linear hai. Niyam yeh hai: pehle simplify karo, phir sabse badi power dekho."),
    ], {"mode": "form", "eq": 4, "step": 2}),
    scene([
        L("Dadi", "Your turn! Six equations are on the cards. Tap every one that is quadratic after simplifying.",
          "Ab aapki baari! Cards par chhe equations hain. Simplify karne ke baad jo quadratic hain, un sab par tap karo."),
    ], {"mode": "sort", "picked": [], "task": True}, wait=True),
]

# ─────────────────────────────── Part 2: forming quadratics, and what a root is ───────────────────────────────
SCENES_2 = [
    scene([
        L("Narrator", "That evening, Harsh and Disha sit at the dining table with Mummy's tray problem still on the whiteboard.",
          "Us shaam Harsh aur Disha dining table par baithe hain, aur Mummy ka tray waala sawaal abhi bhi whiteboard par hai."),
        L("Harsh", "We have the equation, but what is the width? Let me just guess. Width 8 gives length 11, and the area is only 88.",
          "Equation toh mil gayi, par width kitni hai? Main guess karta hoon. Width 8 se length 11 aati hai, aur area sirf 88 hai."),
    ], {"model": "tray", "x": 8, "showEq": True}),
    scene([
        L("Dadi", "Look at the left side of the standard form, x squared plus 3 x minus 180. At x equals 8, it is 64 plus 24 minus 180, which is minus 92. Not zero yet.",
          "Standard form ka left side dekho, x squared plus 3 x minus 180. x barabar 8 par yeh 64 plus 24 minus 180, yaani minus 92 hai. Abhi zero nahi."),
        L("Harsh", "Width 12! Length 15, and 12 times 15 is 180. The left side is 144 plus 36 minus 180, which is exactly 0!",
          "Width 12! Length 15, aur 12 guna 15 barabar 180. Left side 144 plus 36 minus 180, yaani theek 0!"),
    ], {"model": "tray", "x": 12, "showEq": True}),
    scene([
        L("Dadi", "A number that makes a x squared plus b x plus c equal to zero is called a root, or a solution, of the equation. 12 is a root.",
          "Jo number a x squared plus b x plus c ko zero bana de, use equation ka root, ya solution, kehte hain. 12 ek root hai."),
        L("Disha", "On the graph, the curve crosses the x axis exactly at 12. So the roots are where the curve meets the x axis?",
          "Graph par curve theek 12 par x axis ko kaat raha hai. Toh roots wahi hain jahaan curve x axis se milta hai?"),
        L("Dadi", "Yes. They are the zeroes of the polynomial, the ones you met in the last chapter. A quadratic has at most two roots.",
          "Haan. Yeh polynomial ke zeroes hi hain, jo pichhle chapter mein mile the. Quadratic ke zyaada se zyaada do roots hote hain."),
    ], {"model": "tray", "x": 12, "showEq": True, "showGraph": True}),
    scene([
        L("Harsh", "My turn to set a puzzle. The product of two consecutive positive integers is 306. Find them!",
          "Ab meri baari puzzle dene ki. Do lagaataar positive integers ka guna 306 hai. Unhe dhoondo!"),
        L("Disha", "Let the smaller be x. The next is x plus 1. So x times x plus 1 equals 306, which becomes x squared plus x minus 306 equals 0.",
          "Chhota wala x maan lo. Agla x plus 1. Toh x guna x plus 1 barabar 306, jo ban jaata hai x squared plus x minus 306 barabar 0."),
    ], {"model": "consec", "x": 10, "showEq": True}),
    scene([
        L("Disha", "17 times 18 is 306. So the integers are 17 and 18!", "17 guna 18 barabar 306. Toh integers 17 aur 18 hain!"),
    ], {"model": "consec", "x": 17, "showEq": True, "showGraph": True}),
    scene([
        L("Deepak", "Here is one from my railway work. A train covers 360 kilometres at a uniform speed. If the speed were 5 kilometres per hour more, the trip would take 1 hour less. What is the speed?",
          "Yeh mere railway kaam se ek sawaal. Ek train 360 kilometre ek samaan speed se chalti hai. Agar speed 5 kilometre per hour zyaada hoti, toh safar 1 ghanta kam leta. Speed kya hai?"),
        L("Deepak", "Let the speed be x. Time is distance divided by speed, so 360 divided by x, minus 360 divided by x plus 5, equals 1 hour.",
          "Speed ko x maano. Time barabar distance divided by speed, toh 360 divided by x, minus 360 divided by x plus 5, barabar 1 ghanta."),
    ], {"model": "train", "x": 30, "showEq": True}),
    scene([
        L("Dadi", "Multiply both sides by x times x plus 5, and it becomes x squared plus 5 x minus 1800 equals 0. A fraction problem has turned into a quadratic.",
          "Dono taraf x guna x plus 5 se guna karo, toh yeh ban jaata hai x squared plus 5 x minus 1800 barabar 0. Fraction wala sawaal quadratic ban gaya."),
    ], {"model": "train", "x": 30, "showEq": True, "showGraph": True}),
    scene([
        L("Neha", "Your turn! Back to my tray. Slide the width until the left side becomes zero, and tell me what width to order.",
          "Ab aapki baari! Mere tray par wapas chalo. Width ko tab tak slide karo jab tak left side zero na ho jaaye, aur batao kaunsi width order karoon."),
    ], {"model": "tray", "x": 5, "showEq": True, "showGraph": True, "task": True}, wait=True),
]

# ─────────────────────────────── Part 3: factorisation ───────────────────────────────
SCENES_3 = [
    scene([
        L("Narrator", "Saturday morning. Harsh wants to go to cricket practice, but Dadi has one condition: solve three quadratics without guessing.",
          "Shanivaar ki subah. Harsh cricket practice jaana chahta hai, par Dadi ki ek shart hai: teen quadratics bina guess kiye solve karo."),
        L("Dadi", "Guessing worked for the tray, but it is slow. Today we factorise. Take 2 x squared minus 5 x plus 3 equals 0.",
          "Tray ke liye guess chal gaya, par woh dheema hai. Aaj hum factorise karenge. Lo, 2 x squared minus 5 x plus 3 barabar 0."),
    ], {"a": 2, "b": -5, "c": 3, "step": 0, "split": [-2, -3]}),
    scene([
        L("Dadi", "Multiply a and c: 2 times 3 is 6. Now find two numbers whose product is 6 and whose sum is b, which is minus 5.",
          "a aur c ko guna karo: 2 guna 3 barabar 6. Ab do aise numbers dhoondo jinka guna 6 ho aur jod b ho, yaani minus 5."),
        L("Disha", "Minus 2 and minus 3! Their product is 6 and their sum is minus 5.", "Minus 2 aur minus 3! Inka guna 6 aur jod minus 5 hai."),
    ], {"a": 2, "b": -5, "c": 3, "step": 1, "split": [-2, -3]}),
    scene([
        L("Dadi", "So we split the middle term. Minus 5 x becomes minus 2 x minus 3 x. The equation has not changed at all, only its look.",
          "Toh hum beech wale term ko todte hain. Minus 5 x ban jaata hai minus 2 x minus 3 x. Equation bilkul nahi badli, sirf uska roop badla."),
    ], {"a": 2, "b": -5, "c": 3, "step": 2, "split": [-2, -3]}),
    scene([
        L("Dadi", "Now group in pairs. From the first two terms take out 2 x, and from the last two take out minus 3. Both brackets become x minus 1.",
          "Ab joda bana kar group karo. Pehle do terms se 2 x bahar nikaalo, aur aakhri do se minus 3. Dono brackets x minus 1 ban jaate hain."),
        L("Harsh", "So it is x minus 1, times 2 x minus 3, equals 0!", "Toh yeh hai x minus 1, guna 2 x minus 3, barabar 0!"),
    ], {"a": 2, "b": -5, "c": 3, "step": 3, "split": [-2, -3]}),
    scene([
        L("Dadi", "If a product of two numbers is zero, one of them must be zero. So x minus 1 is 0, or 2 x minus 3 is 0. The roots are 1 and 3 by 2.",
          "Agar do numbers ka guna zero hai, toh un mein se ek zero hoga hi. Toh x minus 1 barabar 0, ya 2 x minus 3 barabar 0. Roots hain 1 aur 3 by 2."),
        L("Disha", "Let me check 3 by 2. 2 times 9 by 4 is 9 by 2, minus 15 by 2, plus 3. That is minus 3 plus 3, which is 0!",
          "Main 3 by 2 check karti hoon. 2 guna 9 by 4 barabar 9 by 2, minus 15 by 2, plus 3. Yeh minus 3 plus 3, yaani 0!"),
    ], {"a": 2, "b": -5, "c": 3, "step": 4, "split": [-2, -3]}),
    scene([
        L("Neha", "Use it on my tray, x squared plus 3 x minus 180. a times c is minus 180, and the sum must be 3. Minus 12 and 15 work.",
          "Ise mere tray par lagao, x squared plus 3 x minus 180. a guna c barabar minus 180, aur jod 3 hona chahiye. Minus 12 aur 15 chalte hain."),
        L("Dadi", "So x minus 12, times x plus 15, equals 0. The roots are 12 and minus 15. A width cannot be negative, so we reject minus 15. The width is 12 centimetres.",
          "Toh x minus 12, guna x plus 15, barabar 0. Roots 12 aur minus 15 hain. Width negative nahi ho sakti, isliye minus 15 ko chhod dete hain. Width 12 centimetre hai."),
    ], {"a": 1, "b": 3, "c": -180, "step": 4}),
    scene([
        L("Harsh", "What about x squared minus 6 x plus 9? Product 9, sum minus 6. Minus 3 and minus 3!",
          "Aur x squared minus 6 x plus 9? Guna 9, jod minus 6. Minus 3 aur minus 3!"),
        L("Dadi", "So it is x minus 3, the whole squared. Both roots are 3. We say the equation has two equal roots. Remember this case for later.",
          "Toh yeh x minus 3 ka square hai. Dono roots 3 hain. Hum kehte hain ki equation ke do barabar roots hain. Yeh case baad ke liye yaad rakhna."),
    ], {"a": 1, "b": -6, "c": 9, "step": 4}),
    scene([
        L("Dadi", "Your turn, Harsh, then you can go to cricket. For 6 x squared minus x minus 2, tap the pair with product minus 12 and sum minus 1.",
          "Ab aapki baari, Harsh, phir cricket jaa sakte ho. 6 x squared minus x minus 2 ke liye, woh joda tap karo jiska guna minus 12 aur jod minus 1 ho."),
    ], {"a": 6, "b": -1, "c": -2, "task": True, "chosen": None, "split": [-4, 3]}, wait=True),
]

# ─────────────────────────────── Part 4: the quadratic formula ───────────────────────────────
SCENES_4 = [
    scene([
        L("Narrator", "On Sunday, Papa brings home a timetable problem from the railway office, and it refuses to factorise.",
          "Itvaar ko Papa railway office se ek timetable ka sawaal laate hain, aur woh factorise hone se mana kar deta hai."),
        L("Deepak", "My equation is 2 x squared plus x minus 4 equals 0. a times c is minus 8, and no pair of whole numbers with product minus 8 adds up to 1.",
          "Meri equation hai 2 x squared plus x minus 4 barabar 0. a guna c barabar minus 8, aur minus 8 guna wala koi bhi whole number joda jod kar 1 nahi deta."),
    ], {"a": 2, "b": 1, "c": -4, "step": 0}),
    scene([
        L("Dadi", "Then we need a method that always works. Indian mathematicians found it long ago. Our NCERT book says Brahmagupta, about 1,400 years ago, gave a rule for such equations.",
          "Toh hamein aisa tareeka chahiye jo hamesha chale. Bharatiya ganitagyon ne yeh bahut pehle dhoondh liya tha. Hamari NCERT kitaab kehti hai ki Brahmagupta ne, lagbhag 1,400 saal pehle, aisi equations ke liye ek niyam diya tha."),
        L("Dadi", "Later, Sridharacharya, dated by our book to about 1025 CE, derived the formula we use today. In India we often call it Sridharacharya's formula.",
          "Baad mein Sridharacharya ne, jinhe hamari kitaab lagbhag 1025 CE ka maanti hai, woh formula nikaala jo hum aaj use karte hain. Bharat mein ise aksar Sridharacharya ka formula kehte hain."),
    ], {"a": 2, "b": 1, "c": -4, "step": 0}),
    scene([
        L("Dadi", "Here it is. x equals minus b, plus or minus the square root of b squared minus 4 a c, all divided by 2 a. It works whenever b squared minus 4 a c is not negative.",
          "Yeh raha. x barabar minus b, plus ya minus, b squared minus 4 a c ka square root, sab divided by 2 a. Yeh tab chalta hai jab b squared minus 4 a c negative na ho."),
        L("Disha", "Why does it work, Dadi? It looks like magic.", "Yeh kaam kyon karta hai, Dadi? Jaadu jaisa lagta hai."),
        L("Dadi", "It comes from turning the left side into a perfect square, the way Sridharacharya did. For your board exam, you only need to use the formula correctly.",
          "Yeh left side ko ek perfect square banaane se aata hai, jaise Sridharacharya ne kiya tha. Board exam ke liye, aapko bas formula sahi se lagaana aana chahiye."),
    ], {"a": 2, "b": 1, "c": -4, "step": 0}),
    scene([
        L("Deepak", "Step one, read off a, b and c. Here a is 2, b is 1 and c is minus 4. Watch the signs!",
          "Pehla step, a, b aur c padho. Yahaan a barabar 2, b barabar 1 aur c barabar minus 4. Signs dhyaan se dekho!"),
    ], {"a": 2, "b": 1, "c": -4, "step": 1}),
    scene([
        L("Deepak", "Step two, b squared minus 4 a c. That is 1 minus 4 times 2 times minus 4, so 1 plus 32, which is 33.",
          "Doosra step, b squared minus 4 a c. Yeh hai 1 minus 4 guna 2 guna minus 4, yaani 1 plus 32, barabar 33."),
        L("Harsh", "Two minuses make a plus. That is where I always lose marks!", "Do minus milkar plus banate hain. Wahin main hamesha marks kho deta hoon!"),
    ], {"a": 2, "b": 1, "c": -4, "step": 2}),
    scene([
        L("Deepak", "Step three. x equals minus 1 plus or minus root 33, divided by 4. Root 33 is about 5.74, so x is about 1.19 or about minus 1.69.",
          "Teesra step. x barabar minus 1 plus ya minus root 33, divided by 4. Root 33 lagbhag 5.74 hai, toh x lagbhag 1.19 ya lagbhag minus 1.69 hai."),
        L("Disha", "And the graph crosses the x axis at exactly those two points!", "Aur graph theek inhi do points par x axis ko kaatta hai!"),
    ], {"a": 2, "b": 1, "c": -4, "step": 3}),
    scene([
        L("Dadi", "The formula also works when factorisation does. Try 2 x squared minus 7 x plus 3. Here b squared minus 4 a c is 49 minus 24, which is 25, and its root is 5.",
          "Formula wahan bhi chalta hai jahaan factorisation chalta hai. 2 x squared minus 7 x plus 3 lo. Yahaan b squared minus 4 a c barabar 49 minus 24, yaani 25, aur iska root 5 hai."),
        L("Dadi", "So x is 7 plus 5 by 4, which is 3, or 7 minus 5 by 4, which is half.",
          "Toh x barabar 7 plus 5 by 4, yaani 3, ya 7 minus 5 by 4, yaani aadha."),
    ], {"a": 2, "b": -7, "c": 3, "step": 3}),
    scene([
        L("Deepak", "Your turn! Set up x squared minus 4 x plus 1 equals 0 on the sliders, then step through the formula until the roots appear.",
          "Ab aapki baari! Sliders par x squared minus 4 x plus 1 barabar 0 banao, phir formula ke steps chalao jab tak roots na aa jaayein."),
    ], {"a": 1, "b": 2, "c": 3, "step": 0, "task": {"a": 1, "b": -4, "c": 1}}, wait=True),
]

# ─────────────────────────────── Part 5: discriminant ───────────────────────────────
SCENES_5 = [
    scene([
        L("Narrator", "The colony committee wants a new park, and Dadi is on the committee. Harsh and Disha join the meeting with their notebooks.",
          "Colony committee ek naya park banaana chahti hai, aur Dadi committee mein hain. Harsh aur Disha apni notebooks lekar meeting mein aate hain."),
        L("Dadi", "Before solving any quadratic, look at the number under the square root, b squared minus 4 a c. It decides what kind of roots we get. It is called the discriminant, D.",
          "Koi bhi quadratic solve karne se pehle, square root ke andar wala number dekho, b squared minus 4 a c. Yahi tay karta hai ki roots kaise honge. Ise discriminant, D, kehte hain."),
    ], {"a": 1, "b": 4, "c": 3}),
    scene([
        L("Dadi", "Here x squared plus 4 x plus 3 has D equal to 16 minus 12, which is 4. D is positive, so there are two distinct real roots. The parabola cuts the x axis twice.",
          "Yahaan x squared plus 4 x plus 3 ka D barabar 16 minus 12, yaani 4. D positive hai, toh do alag real roots hain. Parabola x axis ko do baar kaatta hai."),
    ], {"a": 1, "b": 4, "c": 3}),
    scene([
        L("Disha", "If I raise c to 4, D becomes 16 minus 16, which is 0. The curve just touches the axis!",
          "Agar main c ko 4 kar doon, toh D barabar 16 minus 16, yaani 0. Curve axis ko bas chhoota hai!"),
        L("Dadi", "When D is 0, both roots are equal, each one minus b by 2 a. Here that is minus 2, twice.",
          "Jab D zero hota hai, dono roots barabar hote hain, har ek minus b by 2 a. Yahaan woh minus 2 hai, do baar."),
    ], {"a": 1, "b": 4, "c": 4}),
    scene([
        L("Harsh", "And if I push c up to 7?", "Aur agar main c ko 7 tak badha doon?"),
        L("Dadi", "Then D is 16 minus 28, which is minus 12. No real number has a negative square, so there are no real roots. The curve floats above the axis.",
          "Toh D barabar 16 minus 28, yaani minus 12. Kisi real number ka square negative nahi hota, toh koi real root nahi. Curve axis ke upar tairta rehta hai."),
    ], {"a": 1, "b": 4, "c": 7}),
    scene([
        L("Neha", "So the committee's question. Can we make a rectangular park with perimeter 80 metres and area 400 square metres?",
          "Toh committee ka sawaal. Kya hum 80 metre perimeter aur 400 square metre area wala rectangular park bana sakte hain?"),
        L("Disha", "Length plus breadth is 40. If the length is x, the breadth is 40 minus x. So x times 40 minus x equals 400, which is x squared minus 40 x plus 400 equals 0.",
          "Length plus breadth barabar 40. Agar length x hai, toh breadth 40 minus x. Toh x guna 40 minus x barabar 400, jo hai x squared minus 40 x plus 400 barabar 0."),
        L("Dadi", "D is 1600 minus 1600, which is 0. Equal roots, x equals 20. Yes, it is possible: a square park, 20 metres by 20 metres.",
          "D barabar 1600 minus 1600, yaani 0. Barabar roots, x barabar 20. Haan, yeh mumkin hai: ek square park, 20 metre by 20 metre."),
    ], {"a": 1, "b": 4, "c": 4, "card": "park"}),
    scene([
        L("Deepak", "A board favourite. For what value of k does k x times x minus 2, plus 6, equal 0 have two equal roots?",
          "Board ka pasandida sawaal. k ki kis value ke liye k x guna x minus 2, plus 6, barabar 0 ke do barabar roots honge?"),
        L("Dadi", "Expand: k x squared minus 2 k x plus 6. D is 4 k squared minus 24 k, which is 4 k times k minus 6. Set D to 0, so k is 0 or 6. But k equal to 0 kills the x squared term, so k is 6.",
          "Expand karo: k x squared minus 2 k x plus 6. D barabar 4 k squared minus 24 k, yaani 4 k guna k minus 6. D ko 0 rakho, toh k barabar 0 ya 6. Par k barabar 0 se x squared wala term khatam ho jaata hai, isliye k barabar 6."),
    ], {"a": 1, "b": 4, "c": 4, "card": "k"}),
    scene([
        L("Dadi", "Your turn! Here is x squared plus 4 x plus 1. Change c so that the equation has two equal roots.",
          "Ab aapki baari! Yeh hai x squared plus 4 x plus 1. c ko aise badlo ki equation ke do barabar roots hon."),
    ], {"a": 1, "b": 4, "c": 1, "task": "equal"}, wait=True),
]

# ─────────────────────────────── Part 6: word problems, checking and rejecting roots ───────────────────────────────
SCENES_6 = [
    scene([
        L("Narrator", "Two weeks before the pre-boards, Papa takes the family on a train trip to Ajmer, and the questions come along.",
          "Pre-boards se do hafte pehle, Papa parivaar ko train se Ajmer le jaate hain, aur sawaal bhi saath aate hain."),
        L("Deepak", "Let us finish my train problem. x squared plus 5 x minus 1800 equals 0. Who can factorise it?",
          "Chalo mera train wala sawaal poora karte hain. x squared plus 5 x minus 1800 barabar 0. Ise kaun factorise karega?"),
    ], {"model": "train", "x": 30, "showEq": True, "showGraph": True}),
    scene([
        L("Disha", "Product minus 1800, sum 5. 45 and minus 40! So x plus 45, times x minus 40, equals 0.",
          "Guna minus 1800, jod 5. 45 aur minus 40! Toh x plus 45, guna x minus 40, barabar 0."),
        L("Harsh", "The roots are 40 and minus 45. A speed of minus 45 makes no sense, so the speed is 40 kilometres per hour.",
          "Roots 40 aur minus 45 hain. Minus 45 ki speed ka koi matlab nahi, toh speed 40 kilometre per hour hai."),
    ], {"model": "train", "x": 40, "showEq": True, "showGraph": True}),
    scene([
        L("Deepak", "Always check in the story, not just in the equation. At 40, the trip takes 9 hours. At 45, it takes 8 hours. Exactly 1 hour less.",
          "Hamesha kahaani mein check karo, sirf equation mein nahi. 40 par safar 9 ghante leta hai. 45 par 8 ghante. Theek 1 ghanta kam."),
    ], {"model": "train", "x": 40, "showEq": True, "showGraph": False}),
    scene([
        L("Dadi", "This is the plan for every word problem. One, choose the unknown as x. Two, turn the words into an equation. Three, bring it to standard form and solve. Four, reject roots that do not fit the story, and check.",
          "Har word problem ka yahi plan hai. Ek, unknown ko x chuno. Do, shabdon ko equation mein badlo. Teen, standard form mein laakar solve karo. Chaar, jo roots kahaani mein fit na hon unhe chhodo, aur check karo."),
    ], {"model": "consec", "x": 17, "showEq": True, "showGraph": True}),
    scene([
        L("Harsh", "In the integers puzzle, x squared plus x minus 306 had roots 17 and minus 18. We wanted positive integers, so we kept 17.",
          "Integers waale puzzle mein, x squared plus x minus 306 ke roots 17 aur minus 18 the. Hamein positive integers chahiye the, toh 17 rakha."),
        L("Disha", "But if the question had said just integers, minus 18 and minus 17 would also be an answer!",
          "Lekin agar sawaal mein sirf integers likha hota, toh minus 18 aur minus 17 bhi ek jawaab hota!"),
        L("Dadi", "Exactly. Read the question carefully. It tells you which roots to keep.",
          "Bilkul. Sawaal dhyaan se padho. Wahi batata hai ki kaunse roots rakhne hain."),
    ], {"model": "consec", "x": 17, "showEq": True, "showGraph": True}),
    scene([
        L("Neha", "Your turn! Find Papa's train speed yourself. Slide x until the time difference is exactly 1 hour.",
          "Ab aapki baari! Papa ki train ki asli speed dhoondo. x ko tab tak slide karo jab tak time ka farak theek 1 ghanta na ho jaaye."),
    ], {"model": "train", "x": 20, "showEq": True, "showGraph": True, "task": True}, wait=True),
]

# ─────────────────────────────── Part 7: solved questions ───────────────────────────────
SCENES_7 = [
    scene([
        L("Narrator", "It is the night before the pre-board maths paper. Dadi has written ten board-style questions on the whiteboard.",
          "Pre-board maths paper se pehle ki raat hai. Dadi ne whiteboard par board jaise das sawaal likhe hain."),
        L("Dadi", "Question one. Which of these is a quadratic equation? Remember, simplify first.",
          "Pehla sawaal. In mein se kaun si quadratic equation hai? Yaad rakho, pehle simplify karo."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "Option b. Expanding x plus 2 cubed gives x cubed plus 6 x squared plus 12 x plus 8. The x cubed terms cancel, leaving 6 x squared plus 12 x plus 12 equals 0.",
          "Option b. x plus 2 ka cube expand karne par x cube plus 6 x squared plus 12 x plus 8 milta hai. x cube cancel ho jaate hain, aur bachta hai 6 x squared plus 12 x plus 12 barabar 0."),
    ], {"example": 0, "step": 4}),
    scene([
        L("Dadi", "Question two. Solve 6 x squared minus x minus 2 equals 0 by factorisation.",
          "Doosra sawaal. 6 x squared minus x minus 2 barabar 0 ko factorisation se solve karo."),
        L("Harsh", "Product minus 12, sum minus 1, so minus 4 and 3. Split, group, and we get 3 x minus 2, times 2 x plus 1. The roots are 2 by 3 and minus 1 by 2.",
          "Guna minus 12, jod minus 1, toh minus 4 aur 3. Todo, group karo, aur milta hai 3 x minus 2, guna 2 x plus 1. Roots hain 2 by 3 aur minus 1 by 2."),
    ], {"example": 1, "step": 4}),
    scene([
        L("Dadi", "Now try the other eight yourself before you reveal the steps. Write every line the way an examiner wants to see it.",
          "Ab baaki aath khud try karo, phir steps kholo. Har line waise likho jaise examiner dekhna chahta hai."),
    ], {"example": 2, "step": 0}),
]

EXAMPLES = [
    {
        "title": "MCQ · Is it quadratic?",
        "question": "Which of the following is a quadratic equation? (a) x(x + 1) + 8 = (x + 2)(x − 2) (b) (x + 2)³ = x³ − 4 (c) x² + 3x + 1 = (x − 2)² (d) (x + 1)² = x² + 4x",
        "steps": [
            "(a) x² + x + 8 = x² − 4 ⇒ x + 12 = 0: linear.",
            "(b) x³ + 6x² + 12x + 8 = x³ − 4 ⇒ 6x² + 12x + 12 = 0: degree 2.",
            "(c) x² + 3x + 1 = x² − 4x + 4 ⇒ 7x − 3 = 0: linear.",
            "(d) x² + 2x + 1 = x² + 4x ⇒ −2x + 1 = 0: linear. Answer: <strong>(b)</strong>",
        ],
        "answer": "(b)",
    },
    {
        "title": "Short answer · Factorisation",
        "question": "Find the roots of 6x² − x − 2 = 0 by factorisation.",
        "steps": [
            "a × c = 6 × (−2) = −12; we need two numbers with product −12 and sum −1: −4 and 3.",
            "6x² − 4x + 3x − 2 = 0 ⇒ 2x(3x − 2) + 1(3x − 2) = 0",
            "(3x − 2)(2x + 1) = 0",
            "3x − 2 = 0 or 2x + 1 = 0 ⇒ <strong>x = 2/3 or x = −1/2</strong>",
        ],
        "answer": "2/3, −1/2",
    },
    {
        "title": "Short answer · Quadratic formula",
        "question": "Solve 2x² − 7x + 3 = 0 using the quadratic formula.",
        "steps": [
            "a = 2, b = −7, c = 3",
            "D = b² − 4ac = 49 − 24 = 25 &gt; 0, √D = 5",
            "x = (7 ± 5)/4",
            "<strong>x = 3 or x = 1/2</strong>",
        ],
        "answer": "3, 1/2",
    },
    {
        "title": "Short answer · Irrational roots",
        "question": "Find the roots of 2x² + x − 4 = 0 using the quadratic formula.",
        "steps": [
            "a = 2, b = 1, c = −4",
            "D = 1² − 4(2)(−4) = 1 + 32 = 33 &gt; 0",
            "x = (−1 ± √33)/(2 × 2)",
            "<strong>x = (−1 + √33)/4 or x = (−1 − √33)/4</strong>",
        ],
        "answer": "(−1 ± √33)/4",
    },
    {
        "title": "Nature of roots",
        "question": "Find the nature of the roots of 3x² − 2x + 1/3 = 0. If real, find them.",
        "steps": [
            "a = 3, b = −2, c = 1/3",
            "D = (−2)² − 4(3)(1/3) = 4 − 4 = 0",
            "D = 0 ⇒ two equal real roots, each −b/2a = 2/6",
            "<strong>x = 1/3, 1/3</strong>",
        ],
        "answer": "Equal roots 1/3, 1/3",
    },
    {
        "title": "Find k for equal roots",
        "question": "Find the value of k for which kx(x − 2) + 6 = 0 has two equal roots.",
        "steps": [
            "kx² − 2kx + 6 = 0: a = k, b = −2k, c = 6",
            "D = 4k² − 24k = 4k(k − 6)",
            "Equal roots ⇒ D = 0 ⇒ k = 0 or k = 6",
            "k = 0 makes the equation not quadratic, so <strong>k = 6</strong>",
        ],
        "answer": "k = 6",
    },
    {
        "title": "Word problem · Consecutive integers",
        "question": "Find two consecutive positive integers, the sum of whose squares is 365.",
        "steps": [
            "Let the integers be x and x + 1: x² + (x + 1)² = 365",
            "2x² + 2x + 1 = 365 ⇒ x² + x − 182 = 0",
            "(x + 14)(x − 13) = 0 ⇒ x = 13 or x = −14",
            "x must be positive, so x = 13. Integers: <strong>13 and 14</strong> (169 + 196 = 365 ✔)",
        ],
        "answer": "13 and 14",
    },
    {
        "title": "Long answer · Train speed",
        "question": "A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less for the same journey. Find the speed of the train.",
        "steps": [
            "Let the speed be x km/h. Time = 360/x hours; at x + 5 it is 360/(x + 5) hours.",
            "360/x − 360/(x + 5) = 1 ⇒ 360(x + 5) − 360x = x(x + 5)",
            "1800 = x² + 5x ⇒ x² + 5x − 1800 = 0",
            "(x + 45)(x − 40) = 0 ⇒ x = 40 or x = −45",
            "Speed cannot be negative: <strong>40 km/h</strong>. Check: 360/40 = 9 h, 360/45 = 8 h, 1 hour less ✔",
        ],
        "answer": "40 km/h",
    },
    {
        "title": "Assertion–Reason",
        "question": "Assertion (A): The equation x² + x + 1 = 0 has no real roots. Reason (R): If b² − 4ac < 0, a quadratic equation has no real roots. (a) Both true, R explains A (b) Both true, R does not explain A (c) A true, R false (d) A false, R true",
        "steps": [
            "For x² + x + 1 = 0: D = 1 − 4(1)(1) = −3 &lt; 0, so A is true.",
            "R is the standard result on the discriminant, so R is true.",
            "A follows directly from R. Answer: <strong>(a)</strong>",
        ],
        "answer": "(a)",
    },
    {
        "title": "Case-based · The colony park",
        "question": "The colony wants a rectangular park with perimeter 80 m and area 400 m². (i) Form the quadratic equation. (ii) Find its discriminant. (iii) Is the park possible? Give its dimensions.",
        "steps": [
            "(i) Length + breadth = 40. Length x ⇒ breadth 40 − x. x(40 − x) = 400 ⇒ x² − 40x + 400 = 0",
            "(ii) D = (−40)² − 4(1)(400) = 1600 − 1600 = 0",
            "(iii) D = 0 ⇒ equal real roots x = 40/2 = 20",
            "Possible: length 20 m, breadth 40 − 20 = 20 m, <strong>a 20 m × 20 m square</strong>",
        ],
        "answer": "Yes, 20 m by 20 m",
    },
]

PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Mummy's New Shop · What is a quadratic equation?",
        "readingTime": "~8 min",
        "narrative": f"""
<div {STORY}>Mummy's bakery has become a small shop. She orders a display tray whose length is 3 cm more than its width and whose area is 180 cm². Disha turns the order into an equation, and Dadi names it.</div>

<h2>From a story to an equation</h2>
<p>Let the width be x cm. Then the length is (x + 3) cm, and the area is x(x + 3) cm².</p>
<div {FORMULA}>x(x + 3) = 180  ⇒  x² + 3x − 180 = 0</div>

<h2>Standard form</h2>
<p>A <strong>quadratic equation</strong> in the variable x is an equation that can be written as</p>
<div {FORMULA}>ax² + bx + c = 0,   a, b, c real numbers, a ≠ 0</div>
<p>The left side, ax² + bx + c, is a quadratic polynomial (degree 2). If a = 0 the equation becomes bx + c = 0, which is linear.</p>

<h2>Always simplify before deciding</h2>
<table class="w-full text-sm my-3">
<tr><th class="text-left">Equation</th><th class="text-left">After simplifying</th><th class="text-left">Quadratic?</th></tr>
<tr><td>(x − 2)² + 1 = 2x − 3</td><td>x² − 6x + 8 = 0</td><td>Yes</td></tr>
<tr><td>x(2x + 3) = x² + 1</td><td>x² + 3x − 1 = 0</td><td>Yes</td></tr>
<tr><td>(x + 2)³ = x³ − 4</td><td>6x² + 12x + 12 = 0</td><td>Yes (the cubes cancel)</td></tr>
<tr><td>x(x + 1) + 8 = (x + 2)(x − 2)</td><td>x + 12 = 0</td><td>No (the squares cancel)</td></tr>
</table>
<div {CARD}>
  <div><strong>Name check:</strong> "quadratic" comes from the Latin word for a square, because the x² term is what makes these equations special.</div>
</div>
""",
        "keyInsight": "A quadratic equation is one that simplifies to ax² + bx + c = 0 with a ≠ 0; always simplify before judging.",
        "widgetType": "Class10QuadStandardFormWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Write x(2x + 3) = x² + 1 in standard form.",
            "options": ["2x² + 3x − 1 = 0", "x² + 3x − 1 = 0", "x² + 3x + 1 = 0", "3x − 1 = 0"],
            "correctIndex": 1,
            "explanation": "2x² + 3x = x² + 1, so 2x² − x² + 3x − 1 = 0, which is x² + 3x − 1 = 0.",
        },
        "teacherNotes": teacher(
            [
                "Start with Mummy's tray: let students write the area expression before showing the algebra.",
                "Stress that the test is the highest power after simplifying, not before.",
                "Keep the standard form ax² + bx + c = 0 on the board for the whole chapter.",
            ],
            [
                "Calling (x + 2)³ = x³ − 4 cubic without expanding.",
                "Forgetting that a ≠ 0 is part of the definition.",
                "Moving terms across without changing their sign.",
            ],
            "Card sort: give pairs eight equations on slips; they simplify each and sort into 'quadratic' and 'not quadratic', then compare with another pair.",
            "NCERT Class 10 Ch. 4, sections 4.1–4.2, Exercise 4.1.",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Puzzles at the Dining Table · Forming quadratics and roots",
        "readingTime": "~9 min",
        "narrative": f"""
<div {STORY}>Harsh tries to guess the width of Mummy's tray. Dadi shows what it means for a number to be a root, and Papa turns a railway timing into a quadratic.</div>

<h2>What is a root?</h2>
<p>A real number α is a <strong>root</strong> (solution) of ax² + bx + c = 0 if aα² + bα + c = 0. The roots of the equation are the same as the zeroes of the polynomial ax² + bx + c, the points where its graph (a parabola) meets the x-axis.</p>
<div {FORMULA}>α is a root  ⇔  aα² + bα + c = 0</div>
<div {CARD}>
  <div>Tray: x² + 3x − 180 at x = 8 gives 64 + 24 − 180 = −92 (not a root).</div>
  <div>At x = 12: 144 + 36 − 180 = 0, so 12 is a root. Width 12 cm, length 15 cm, area 180 cm² ✔</div>
  <div>A quadratic equation has <strong>at most two</strong> roots.</div>
</div>

<h2>Forming quadratic equations from situations</h2>
<table class="w-full text-sm my-3">
<tr><th class="text-left">Situation</th><th class="text-left">Unknown</th><th class="text-left">Equation</th></tr>
<tr><td>Rectangle, length 3 more than width, area 180</td><td>width x</td><td>x² + 3x − 180 = 0</td></tr>
<tr><td>Two consecutive positive integers, product 306</td><td>smaller integer x</td><td>x² + x − 306 = 0</td></tr>
<tr><td>360 km; 5 km/h faster takes 1 hour less</td><td>speed x km/h</td><td>360/x − 360/(x + 5) = 1 ⇒ x² + 5x − 1800 = 0</td></tr>
</table>
<p>For the train: multiply both sides by x(x + 5): 360(x + 5) − 360x = x(x + 5), so 1800 = x² + 5x.</p>
""",
        "keyInsight": "A root is a value of x that makes ax² + bx + c zero: it is where the parabola meets the x-axis.",
        "widgetType": "Class10QuadModelWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "Which of these is a root of x² + x − 306 = 0?",
            "options": ["16", "17", "18", "−17"],
            "correctIndex": 1,
            "explanation": "17² + 17 − 306 = 289 + 17 − 306 = 0. (The other root is −18.)",
        },
        "teacherNotes": teacher(
            [
                "Let students test values in the tray problem by hand before revealing x = 12; the table of values builds the idea of a root.",
                "Link to Chapter 2: roots of the equation = zeroes of the polynomial = x-intercepts of the graph.",
                "For the train problem, write time = distance/speed in words first.",
            ],
            [
                "Writing the consecutive integers as x and 2x.",
                "In the train problem, subtracting the times the wrong way round (getting −1).",
                "Thinking every quadratic has exactly two different roots.",
            ],
            "Story to equation relay: each group writes a short Indian-life situation (shop, cricket, train); the next group must form the quadratic equation.",
            "NCERT Class 10 Ch. 4, section 4.2 (representing situations), Exercise 4.1 Q2.",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Before Cricket Practice · Solving by factorisation",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>Harsh may go to cricket practice only after solving three quadratics without guessing. Dadi teaches him to split the middle term.</div>

<h2>Splitting the middle term</h2>
<ol>
  <li>Write the equation as ax² + bx + c = 0 and find the product a × c.</li>
  <li>Find two numbers p and q with <strong>p × q = a × c</strong> and <strong>p + q = b</strong>.</li>
  <li>Write bx as px + qx, then group in pairs and take out common factors.</li>
  <li>Use: if a product is zero, one factor is zero. Solve each factor.</li>
</ol>
<div {FORMULA}>If (px + q)(rx + s) = 0, then x = −q/p or x = −s/r</div>

<h2>Worked example</h2>
<div {CARD}>
  <div>2x² − 5x + 3 = 0: a × c = 6, need sum −5 ⇒ −2 and −3</div>
  <div>2x² − 2x − 3x + 3 = 0 ⇒ 2x(x − 1) − 3(x − 1) = 0 ⇒ (x − 1)(2x − 3) = 0</div>
  <div><strong>x = 1 or x = 3/2</strong>. Check 3/2: 2(9/4) − 15/2 + 3 = 9/2 − 15/2 + 3 = 0 ✔</div>
</div>
<div {CARD}>
  <div>Tray: x² + 3x − 180 = 0 ⇒ (x − 12)(x + 15) = 0 ⇒ x = 12 or −15. A width cannot be negative, so the width is 12 cm.</div>
  <div>x² − 6x + 9 = 0 ⇒ (x − 3)² = 0 ⇒ x = 3, 3 (two equal roots).</div>
  <div>6x² − x − 2 = 0: a × c = −12, sum −1 ⇒ −4 and 3 ⇒ (3x − 2)(2x + 1) = 0 ⇒ x = 2/3, −1/2.</div>
</div>
""",
        "keyInsight": "Split b into two numbers whose product is ac; grouping then turns the quadratic into two linear factors.",
        "widgetType": "Class10QuadSplitWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "To factorise 2x² + x − 6 by splitting the middle term, which two numbers do you use?",
            "options": ["2 and −3", "4 and −3", "−4 and 3", "6 and −1"],
            "correctIndex": 1,
            "explanation": "a × c = −12 and b = 1: 4 × (−3) = −12 and 4 + (−3) = 1. Then 2x² + 4x − 3x − 6 = (x + 2)(2x − 3).",
        },
        "teacherNotes": teacher(
            [
                "Make a product–sum table of factor pairs of ac; students see why only one pair works.",
                "Show that splitting does not change the equation, only its form.",
                "Always end with 'check in the original equation' and 'reject roots that do not fit the context'.",
            ],
            [
                "Using the product c instead of a × c when a ≠ 1.",
                "Sign errors in the second group (−3x + 3 = −3(x − 1)).",
                "Writing the factors but not the roots, or writing x = 2/3 as x = 3/2.",
            ],
            "Factor bingo: each student draws a 3×3 grid of roots; the teacher calls out quadratics; students factorise and cross off roots.",
            "NCERT Class 10 Ch. 4, section 4.3, Exercise 4.2.",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Papa's Timetable · The quadratic formula",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>Papa's timetable equation 2x² + x − 4 = 0 will not factorise with whole numbers. Dadi brings out a formula from Indian mathematics that always works.</div>

<h2>The quadratic formula</h2>
<p>For ax² + bx + c = 0 (a ≠ 0), if b² − 4ac ≥ 0, the roots are</p>
<div {FORMULA}>x = (−b ± √(b² − 4ac)) / 2a</div>
<p>The formula comes from making the left side a perfect square. (Completing the square as a separate method is no longer in the CBSE syllabus; you only need to apply the formula.)</p>

<h2>Using it, step by step</h2>
<div {CARD}>
  <div>2x² + x − 4 = 0: a = 2, b = 1, c = −4</div>
  <div>b² − 4ac = 1 − 4(2)(−4) = 1 + 32 = 33</div>
  <div>x = (−1 ± √33)/4 ≈ 1.19 or −1.69</div>
</div>
<div {CARD}>
  <div>2x² − 7x + 3 = 0: b² − 4ac = 49 − 24 = 25, √25 = 5</div>
  <div>x = (7 ± 5)/4 ⇒ x = 3 or x = 1/2 (same answer as factorisation)</div>
</div>

<h2>A piece of history</h2>
<div {CARD}>
  <div>According to the NCERT textbook, <strong>Brahmagupta</strong> (C.E. 598–665) gave an explicit formula to solve equations of the form ax² + bx = c, and later <strong>Sridharacharya</strong> (C.E. 1025) derived the formula now known as the quadratic formula, by completing the square. In India it is often called Sridharacharya's formula.</div>
</div>
""",
        "keyInsight": "x = (−b ± √(b² − 4ac))/2a solves every quadratic with b² − 4ac ≥ 0, even when factorisation fails.",
        "widgetType": "Class10QuadFormulaWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Using the quadratic formula, the roots of x² − 4x + 1 = 0 are:",
            "options": ["2 ± √3", "4 ± √3", "−2 ± √3", "2 ± √12"],
            "correctIndex": 0,
            "explanation": "D = 16 − 4 = 12, √12 = 2√3, so x = (4 ± 2√3)/2 = 2 ± √3.",
        },
        "teacherNotes": teacher(
            [
                "Write a, b, c with their signs in a separate line before substituting; most errors come from signs.",
                "Show one equation solved both by factorisation and by the formula to build trust in the formula.",
                "Tell the Brahmagupta and Sridharacharya story briefly; it helps students remember the name.",
            ],
            [
                "Writing −b as −(−7) = −7.",
                "Dividing only √D by 2a instead of the whole numerator.",
                "Computing 4ac as 4 + a + c, or forgetting the sign of c.",
            ],
            "Formula sprint: pairs get five equations; one reads a, b, c, the other computes D; they swap roles each time and check with the widget.",
            "NCERT Class 10 Ch. 4 (quadratic formula stated in section 4.4 and Exercise 4.3 examples); completing the square method deleted in the rationalised syllabus.",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: The Colony Park · Discriminant and nature of roots",
        "readingTime": "~9 min",
        "narrative": f"""
<div {STORY}>The colony committee wants a rectangular park with perimeter 80 m and area 400 m². Before any digging, Dadi checks whether such a park can exist, using just one number.</div>

<h2>The discriminant</h2>
<div {FORMULA}>D = b² − 4ac</div>
<table class="w-full text-sm my-3">
<tr><th class="text-left">D</th><th class="text-left">Nature of roots</th><th class="text-left">Graph of y = ax² + bx + c</th></tr>
<tr><td>D &gt; 0</td><td>Two distinct real roots (−b ± √D)/2a</td><td>Cuts the x-axis at two points</td></tr>
<tr><td>D = 0</td><td>Two equal real roots, each −b/2a</td><td>Touches the x-axis at one point</td></tr>
<tr><td>D &lt; 0</td><td>No real roots</td><td>Does not meet the x-axis</td></tr>
</table>
<div {CARD}>
  <div>x² + 4x + 3: D = 16 − 12 = 4 &gt; 0, two distinct roots (−1, −3).</div>
  <div>x² + 4x + 4: D = 16 − 16 = 0, equal roots −2, −2.</div>
  <div>x² + 4x + 7: D = 16 − 28 = −12 &lt; 0, no real roots.</div>
</div>

<h2>The park</h2>
<div {CARD}>
  <div>Length + breadth = 40. Length x ⇒ breadth 40 − x ⇒ x(40 − x) = 400 ⇒ x² − 40x + 400 = 0</div>
  <div>D = 1600 − 1600 = 0 ⇒ equal roots x = 20. Possible: a 20 m × 20 m square.</div>
</div>

<h2>Finding an unknown coefficient</h2>
<div {CARD}>
  <div>kx(x − 2) + 6 = 0 ⇒ kx² − 2kx + 6 = 0, D = 4k² − 24k = 4k(k − 6)</div>
  <div>Equal roots ⇒ D = 0 ⇒ k = 0 or 6; k = 0 is not quadratic, so <strong>k = 6</strong>.</div>
</div>
""",
        "keyInsight": "The sign of D = b² − 4ac tells you, before solving, whether the roots are distinct, equal or not real.",
        "widgetType": "Class10QuadDiscriminantWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "For what values of k does x² + kx + 9 = 0 have two equal roots?",
            "options": ["k = 3 only", "k = ±3", "k = 6 only", "k = ±6"],
            "correctIndex": 3,
            "explanation": "D = k² − 36 = 0 ⇒ k² = 36 ⇒ k = 6 or k = −6.",
        },
        "teacherNotes": teacher(
            [
                "Use the graph: raise c and watch the parabola lift off the x-axis; D passes from positive to zero to negative.",
                "Practise 'nature of roots' questions without solving: compute D only.",
                "For 'find k' questions, insist on checking that the k found keeps a ≠ 0.",
            ],
            [
                "Saying 'no roots' instead of 'no real roots' when D < 0.",
                "Taking only the positive square root when solving k² = 36.",
                "Accepting k = 0 in kx² + ... problems.",
            ],
            "Design challenge: groups pick a perimeter and an area for a park or a mango orchard, form the quadratic, and use D to decide whether it is possible.",
            "NCERT Class 10 Ch. 4, section 4.4, Exercise 4.3 (nature of roots, finding k, park and orchard problems).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Train to Ajmer · Word problems and checking roots",
        "readingTime": "~8 min",
        "narrative": f"""
<div {STORY}>On a train trip to Ajmer, Papa's speed problem is finally solved, and the family writes down a plan that works for every word problem.</div>

<h2>The four-step plan</h2>
<ol>
  <li>Choose the unknown and call it x (say what it stands for, with units).</li>
  <li>Translate the words into an equation.</li>
  <li>Bring it to the standard form ax² + bx + c = 0 and solve (factorisation or formula).</li>
  <li>Reject roots that do not fit the situation (negative lengths, speeds, ages, counts) and check in the story.</li>
</ol>

<h2>The train speed</h2>
<div {CARD}>
  <div>x² + 5x − 1800 = 0: product −1800, sum 5 ⇒ 45 and −40</div>
  <div>(x + 45)(x − 40) = 0 ⇒ x = 40 or −45. Speed cannot be negative: <strong>40 km/h</strong>.</div>
  <div>Check: 360/40 = 9 hours; 360/45 = 8 hours; difference 1 hour ✔</div>
</div>

<h2>Which roots to keep?</h2>
<div {CARD}>
  <div>x² + x − 306 = 0 ⇒ (x + 18)(x − 17) = 0 ⇒ x = 17 or −18.</div>
  <div>"Positive integers" ⇒ 17 and 18. If the question said only "integers", −18 and −17 would also be correct.</div>
</div>
""",
        "keyInsight": "Solve the equation, then let the story decide: reject roots that make no sense and check the answer in words.",
        "widgetType": "Class10QuadModelWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "A rectangle's length is 5 m more than its breadth and its area is 84 m². The breadth is:",
            "options": ["12 m", "7 m", "−12 m", "14 m"],
            "correctIndex": 1,
            "explanation": "x(x + 5) = 84 ⇒ x² + 5x − 84 = 0 ⇒ (x + 12)(x − 7) = 0. Breadth cannot be negative, so 7 m (length 12 m, area 84 m²).",
        },
        "teacherNotes": teacher(
            [
                "Insist on the four-step plan written in the margin of every word problem.",
                "Ask 'what does −45 mean here?' so students explain rejection in words, as examiners expect.",
                "Mix speed–time, area, number and age problems in one set.",
            ],
            [
                "Leaving both roots as the final answer.",
                "Forgetting units in the final answer.",
                "Not checking the answer in the original story.",
            ],
            "Gallery walk: four charts around the room (speed, area, numbers, ages); groups solve one problem per chart and leave a check for the next group to verify.",
            "NCERT Class 10 Ch. 4, Exercises 4.2 and 4.3 word problems.",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 board-style problems, step by step",
        "readingTime": "~12 min",
        "narrative": f"""
<div {STORY}>The night before the pre-board paper, Dadi writes ten questions on the whiteboard: MCQ, short answer, long answer, an assertion–reason and a case study.</div>
<h2>Your toolkit</h2>
<ol>
  <li>Standard form: ax² + bx + c = 0, a ≠ 0. Simplify before deciding.</li>
  <li>Factorisation: split b into two numbers with product ac.</li>
  <li>Formula: x = (−b ± √(b² − 4ac))/2a.</li>
  <li>Discriminant D = b² − 4ac: &gt; 0 distinct, = 0 equal, &lt; 0 no real roots.</li>
  <li>Word problems: define x, form, solve, reject, check.</li>
</ol>
<div {FORMULA}>x = (−b ± √D) / 2a,   D = b² − 4ac</div>
<p>Try each question in your notebook before revealing the steps.</p>
""",
        "keyInsight": "Read a, b, c with signs, compute D first, then choose: factorise if it splits nicely, otherwise use the formula.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {"examples": EXAMPLES},
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Q1: show all four options simplified; students learn the 'simplify first' habit.",
                "Q8: model the full board-style answer including the rejection sentence and the check.",
                "Q9 and Q10: practise the assertion–reason and case-based formats explicitly.",
            ],
            [
                "Q4: writing (−1 ± √33)/2 (dividing by a, not 2a).",
                "Q6: giving k = 0 or 6 as the answer.",
                "Q7: forgetting the middle term 2x when expanding (x + 1)².",
            ],
            "Pair marking: students swap notebooks after Q8 and mark each other using a 5-mark scheme (equation 1, standard form 1, solving 2, rejection and answer 1).",
            "Covers NCERT Class 10 Ch. 4 Exercises 4.1–4.3 and CBSE sample-paper patterns.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Quadratic Equations (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From Mummy's tray to Papa's train and the colony park, you have formed, factorised and solved quadratic equations. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 board-style questions</strong> on standard form, factorisation, the quadratic formula, the discriminant and word problems, including assertion–reason.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Standard form first, D next, then the quickest method that works.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Quadratic Equations · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "Which of the following is NOT a quadratic equation?", "options": ["x² − 6x + 8 = 0", "x(x + 1) + 8 = (x + 2)(x − 2)", "(x − 2)² + 1 = 2x − 3", "2x² = 18"], "answer": 1, "explanation": "x² + x + 8 = x² − 4 simplifies to x + 12 = 0, which is linear. (x − 2)² + 1 = 2x − 3 gives x² − 6x + 8 = 0.", "topic": "Standard form"},
                {"q": "The roots of x² − 3x − 10 = 0 are:", "options": ["5 and −2", "−5 and 2", "10 and −1", "3 and −10"], "answer": 0, "explanation": "Product −10, sum −3: −5 and 2. (x − 5)(x + 2) = 0, so x = 5 or x = −2.", "topic": "Factorisation"},
                {"q": "To factorise 6x² + 7x + 2 by splitting the middle term, we split 7x as:", "options": ["2x + 5x", "x + 6x", "3x + 4x", "−3x − 4x"], "answer": 2, "explanation": "a × c = 12 and b = 7: 3 × 4 = 12 and 3 + 4 = 7. Then 6x² + 3x + 4x + 2 = (2x + 1)(3x + 2).", "topic": "Factorisation"},
                {"q": "Assertion (A): 2x² − 4x + 3 = 0 has two distinct real roots. Reason (R): For 2x² − 4x + 3 = 0, b² − 4ac = −8.", "options": ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], "answer": 3, "explanation": "D = 16 − 24 = −8, so R is true. Since D < 0, there are no real roots, so A is false.", "topic": "Discriminant"},
                {"q": "The equation 2x² − 6x + 3 = 0 has:", "options": ["No real roots", "Two equal real roots", "Two distinct real roots", "Cannot be decided"], "answer": 2, "explanation": "D = 36 − 24 = 12 > 0, so two distinct real roots.", "topic": "Nature of roots"},
                {"q": "For what values of k does x² + kx + 9 = 0 have two equal roots?", "options": ["k = 3 only", "k = ±3", "k = 6 only", "k = ±6"], "answer": 3, "explanation": "D = k² − 36 = 0 gives k² = 36, so k = 6 or k = −6.", "topic": "Discriminant"},
                {"q": "The roots of 100x² − 20x + 1 = 0 are:", "options": ["1/10, 1/10", "1/10, −1/10", "1/20, 1/20", "10, 10"], "answer": 0, "explanation": "100x² − 20x + 1 = (10x − 1)², so x = 1/10 twice. Also D = 400 − 400 = 0.", "topic": "Factorisation"},
                {"q": "Using the quadratic formula, the roots of x² − 4x + 1 = 0 are:", "options": ["4 ± √3", "2 ± √3", "−2 ± √3", "2 ± √12"], "answer": 1, "explanation": "D = 16 − 4 = 12 and √12 = 2√3, so x = (4 ± 2√3)/2 = 2 ± √3.", "topic": "Quadratic formula"},
                {"q": "Assertion (A): x² + 4 = 0 has no real roots. Reason (R): For x² + 4 = 0, b² − 4ac = −16 < 0.", "options": ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], "answer": 0, "explanation": "D = 0 − 16 = −16 < 0, so there are no real roots: both are true and R explains A.", "topic": "Discriminant"},
                {"q": "A train covers 360 km at a uniform speed. Going 5 km/h faster would save 1 hour. Its speed is:", "options": ["45 km/h", "36 km/h", "40 km/h", "60 km/h"], "answer": 2, "explanation": "360/x − 360/(x + 5) = 1 gives x² + 5x − 1800 = 0, so (x + 45)(x − 40) = 0 and x = 40 (−45 rejected). Check: 9 h vs 8 h.", "topic": "Word problems"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q1 catches 'judging before simplifying'; Q4 tests the meaning of a negative D; Q6 catches forgetting the negative square root; Q10 needs a rejected root."],
            "Exit ticket: form and solve the equation for 'the product of two consecutive even positive integers is 168' (answer: 12 and 14).",
            "Matches NCERT Class 10 Ch. 4 learning outcomes (rationalised syllabus) and CBSE board question patterns.",
        ),
    },
]


def seed_class10_story_quadratic_equations():
    db = SessionLocal()
    try:
        topic = get_class10_topic(db, "Quadratic Equations")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 10 Quadratic Equations: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Quadratic Equations: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class10_story_quadratic_equations()
