import json
from db import SessionLocal
from seed_class10_structure import get_class10_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 10 · Introduction to Trigonometry (NCERT Class 10 Mathematics, Ch. 8, rationalised syllabus 2023-24):
# 8.1 Introduction, 8.2 Trigonometric ratios, 8.3 Trigonometric ratios of some specific angles
# (0, 30, 45, 60, 90 degrees), 8.4 Trigonometric identities. "Trigonometric ratios of complementary angles"
# is deleted from the current syllabus and is left out on purpose.
# Story: the Jaipur family during board-exam preparation: Papa's railway ramp, Mummy's shop, cricket, kites.
#
# Verified facts used:
# - Aryabhata (about 500 CE) used "ardha-jya" (half-chord), shortened to "jya" or "jiva"; Arabic translators kept the
#   sound as "jiba"; later it was read as "jaib" (fold, bay); Latin translators wrote "sinus"; English "sine".
#   (MacTutor, St Andrews, "The trigonometric functions"; Britannica, "Trigonometry: India and the Islamic world";
#   Eli Maor, "Trigonometric Delights".) "jya" also means bowstring.

AR_OPTIONS = [
    "Both A and R are true, and R is the correct explanation of A",
    "Both A and R are true, but R is not the correct explanation of A",
    "A is true, but R is false",
    "A is false, but R is true",
]

# ─────────────────────────────── Part 1 ───────────────────────────────
SCENES_1 = [
    scene([
        L("Narrator", "It is January, two months before the board exams. Harsh and Disha are studying at the dining table when Papa comes home from the railway station.",
          "January hai, board exams mein do mahine baaki hain. Harsh aur Disha dining table par padh rahe hain, tabhi Papa railway station se ghar aate hain."),
        L("Deepak", "Today we checked the new wheelchair ramp at platform 1. The ramp, the platform wall and the ground make a right triangle!",
          "Aaj humne platform 1 ka naya wheelchair ramp check kiya. Ramp, platform ki deewar aur zameen milkar ek right triangle banaate hain!"),
    ], {"angle": 20, "show": "none"}),
    scene([
        L("Dadi", "Call it triangle A B C, with the right angle at B. We stand at the acute angle A and look at the three sides.",
          "Ise triangle A B C kaho, right angle B par hai. Hum acute angle A par khade hokar teeno sides ko dekhte hain."),
        L("Dadi", "The longest side, opposite the right angle, is the hypotenuse A C. The side facing angle A is the opposite side B C. The side touching A is the adjacent side A B.",
          "Sabse lambi side, right angle ke saamne, hypotenuse A C hai. Angle A ke saamne wali side opposite side B C hai. A ko chhoone wali side adjacent side A B hai."),
    ], {"angle": 35, "show": "sides"}),
    scene([
        L("Dadi", "Now divide two sides. Opposite divided by hypotenuse is called sine of A, written sin A.",
          "Ab do sides ko divide karo. Opposite bhaag hypotenuse ko sine A kehte hain, likhte hain sin A."),
        L("Disha", "So for this ramp, sin A is B C divided by A C?", "Toh is ramp ke liye, sin A barabar B C bhaag A C?"),
    ], {"angle": 35, "ratio": "sin"}),
    scene([
        L("Dadi", "Yes! Adjacent divided by hypotenuse is cosine of A, cos A. Opposite divided by adjacent is tangent of A, tan A.",
          "Haan! Adjacent bhaag hypotenuse hai cosine A, yaani cos A. Opposite bhaag adjacent hai tangent A, yaani tan A."),
        L("Deepak", "On the railways we call tan A the gradient of the ramp: how much it rises for each metre along the ground.",
          "Railway mein hum tan A ko ramp ka gradient kehte hain: zameen par har metre ke saath woh kitna upar uthta hai."),
    ], {"angle": 35, "ratio": "tan"}),
    scene([
        L("Dadi", "Flip these three upside down and you get three more. cosec A is 1 by sin A, sec A is 1 by cos A, and cot A is 1 by tan A.",
          "In teeno ko ulta karo toh teen aur milte hain. cosec A hai 1 bata sin A, sec A hai 1 bata cos A, aur cot A hai 1 bata tan A."),
        L("Disha", "And since opposite by adjacent is the same as opposite by hypotenuse divided by adjacent by hypotenuse, tan A is sin A divided by cos A!",
          "Aur opposite bata adjacent wahi hai jo opposite bata hypotenuse ko adjacent bata hypotenuse se divide karne par milta hai, toh tan A barabar sin A bhaag cos A!"),
    ], {"angle": 35, "ratio": "cosec"}),
    scene([
        L("Harsh", "So sin A means sin times A, right?", "Toh sin A ka matlab sin guna A, hai na?"),
        L("Dadi", "No, beta! sin A is one single symbol, a number that belongs to angle A. sin alone, without an angle, means nothing.",
          "Nahi beta! sin A ek hi symbol hai, ek number jo angle A ka hai. Bina angle ke akela sin kuch nahi hota."),
    ], {"angle": 35, "ratio": "sin"}),
    scene([
        L("Dadi", "Now stand at angle C instead. The opposite and adjacent sides swap! For angle C, the opposite side is A B.",
          "Ab angle C par khade ho jao. Opposite aur adjacent sides badal jaati hain! Angle C ke liye opposite side A B hai."),
    ], {"angle": 35, "ratio": "sin", "view": "C"}),
    scene([
        L("Dadi", "Your turn! Drag point C until the rise equals the run, so that tan A becomes exactly 1.",
          "Ab aapki baari! Point C ko tab tak khiskao jab tak upar uthna aur aage badhna barabar ho jaaye, yaani tan A theek 1 ho jaaye."),
    ], {"angle": 25, "ratio": "tan", "task": {"ratio": "tan", "value": 1, "label": "1"}}, wait=True),
]

# ─────────────────────────────── Part 2 ───────────────────────────────
SCENES_2 = [
    scene([
        L("Narrator", "Next evening, Disha is not satisfied. She draws three ramps of different sizes, all at the same slope.",
          "Agle din shaam ko Disha santusht nahi hai. Woh alag alag size ke teen ramp banaati hai, sab ek hi dhalaan par."),
        L("Disha", "A bigger ramp has longer sides. So why should sin A stay the same? Why does it depend only on the angle?",
          "Bade ramp ki sides lambi hoti hain. Toh sin A same kyun rahe? Yeh sirf angle par hi kyun depend karta hai?"),
    ], {"angle": 30, "count": 1, "mode": "nest"}),
    scene([
        L("Dadi", "Good question! Watch. All these triangles share angle A and each has a right angle, so they are similar by the A A criterion.",
          "Achha sawaal! Dekho. In sab triangles mein angle A same hai aur har ek mein right angle hai, toh A A criterion se yeh similar hain."),
    ], {"angle": 30, "count": 3, "mode": "nest"}),
    scene([
        L("Dadi", "In similar triangles corresponding sides are in the same ratio. So opposite by hypotenuse comes out equal in every one of them.",
          "Similar triangles mein corresponding sides ek hi ratio mein hoti hain. Isliye opposite bata hypotenuse har ek mein barabar aata hai."),
        L("Disha", "Every row in the table shows 0.5 for 30 degrees! So the ratio belongs to the angle, not to the size.",
          "Table ki har line mein 30 degrees ke liye 0.5 aa raha hai! Toh ratio angle ka hai, size ka nahi."),
    ], {"angle": 30, "count": 4, "mode": "nest"}),
    scene([
        L("Deepak", "That is why one gradient number describes a ramp of any length. Change the angle and every ratio changes together.",
          "Isiliye ek gradient number kisi bhi lambai ke ramp ko describe karta hai. Angle badlo toh har ratio saath mein badal jaata hai."),
    ], {"angle": 50, "count": 4, "mode": "nest"}),
    scene([
        L("Dadi", "One more fact. The hypotenuse is the longest side, so for an acute angle sin A and cos A are always less than 1.",
          "Ek aur baat. Hypotenuse sabse lambi side hai, isliye acute angle ke liye sin A aur cos A hamesha 1 se kam hote hain."),
        L("Harsh", "So if a question says sin A is 4 by 3, I know it is a trap!", "Toh agar sawaal mein sin A barabar 4 bata 3 likha ho, mujhe pata hai yeh trap hai!"),
        L("Dadi", "Shabash! And sec A and cosec A, being their upside down values, are always more than 1. Only tan A and cot A can be any positive number.",
          "Shabash! Aur sec A aur cosec A, unke ulte hone ki wajah se, hamesha 1 se zyada hote hain. Sirf tan A aur cot A koi bhi positive number ho sakte hain."),
    ], {"angle": 50, "count": 2, "mode": "nest"}),
    scene([
        L("Dadi", "Your turn! Switch to stretch one triangle and make it 3 times bigger. Does sin A change?",
          "Ab aapki baari! Stretch one triangle par jaao aur use 3 guna bada karo. Kya sin A badalta hai?"),
    ], {"angle": 40, "mode": "nest", "count": 2, "k": 1, "task": {"k": 3}}, wait=True),
]

# ─────────────────────────────── Part 3 ───────────────────────────────
SCENES_3 = [
    scene([
        L("Narrator", "On Sunday, Mummy is fixing a ladder to paint the new signboard of her shop.",
          "Ravivaar ko Mummy apni dukaan ka naya signboard paint karne ke liye seedhi laga rahi hain."),
        L("Neha", "The ladder rises 4 steps for every 3 steps along the ground. So tan A is 4 by 3. Can you find the other ratios?",
          "Seedhi zameen par har 3 kadam ke saath 4 kadam upar uthti hai. Toh tan A barabar 4 bata 3. Kya baaki ratios nikaal sakte ho?"),
    ], {"given": "tan", "p": 4, "q": 3, "step": 0}),
    scene([
        L("Dadi", "tan A is 4 by 3 only tells us the ratio. So take B C as 4k and A B as 3k, where k is any positive number.",
          "tan A barabar 4 bata 3 sirf ratio batata hai. Toh B C ko 4k aur A B ko 3k lo, jahan k koi bhi positive number hai."),
    ], {"given": "tan", "p": 4, "q": 3, "step": 1}),
    scene([
        L("Disha", "Pythagoras gives the hypotenuse. A C squared is 9 k squared plus 16 k squared, which is 25 k squared, so A C is 5k.",
          "Pythagoras se hypotenuse milta hai. A C ka square hai 9 k square plus 16 k square, yaani 25 k square, toh A C barabar 5k."),
    ], {"given": "tan", "p": 4, "q": 3, "step": 2}),
    scene([
        L("Dadi", "Now read off everything. sin A is 4 by 5, cos A is 3 by 5, cosec A is 5 by 4, sec A is 5 by 3 and cot A is 3 by 4.",
          "Ab sab padh lo. sin A hai 4 bata 5, cos A hai 3 bata 5, cosec A hai 5 bata 4, sec A hai 5 bata 3 aur cot A hai 3 bata 4."),
        L("Harsh", "The k cancels every time. That is why the answer does not depend on the size!", "Har baar k cancel ho jaata hai. Isiliye answer size par depend nahi karta!"),
    ], {"given": "tan", "p": 4, "q": 3, "step": 3}),
    scene([
        L("Dadi", "The sides need not be whole numbers. If sin A is 3 by 4, then A B squared is 16 minus 9, which is 7. So cos A is root 7 by 4 and tan A is 3 by root 7.",
          "Sides poore number hon zaroori nahi. Agar sin A barabar 3 bata 4, toh A B ka square hai 16 minus 9, yaani 7. Toh cos A hai root 7 bata 4 aur tan A hai 3 bata root 7."),
    ], {"given": "sin", "p": 3, "q": 4, "step": 3}),
    scene([
        L("Dadi", "Your turn! sin A is 5 by 13. Which side is missing, and how long is it?",
          "Ab aapki baari! sin A barabar 5 bata 13 hai. Kaun si side missing hai, aur woh kitni lambi hai?"),
    ], {"given": "sin", "p": 5, "q": 13, "step": 1, "task": {"options": ["8k", "12k", "13k", "18k"], "answer": 1}}, wait=True),
]

# ─────────────────────────────── Part 4 ───────────────────────────────
SCENES_4 = [
    scene([
        L("Narrator", "Makar Sankranti. The family is on the roof with kites, and Disha's kite string makes a perfect slant.",
          "Makar Sankranti hai. Parivaar chhat par patangon ke saath hai, aur Disha ki patang ki dor ek perfect dhalaan banaati hai."),
        L("Dadi", "Some angles are so useful that every board paper asks about them: 30, 45 and 60 degrees. We can find their ratios exactly, with no calculator.",
          "Kuch angles itne kaam ke hain ki har board paper mein aate hain: 30, 45 aur 60 degrees. Inke ratios hum bina calculator ke ekdum sahi nikaal sakte hain."),
    ], {"mode": "iso", "step": 0}),
    scene([
        L("Dadi", "Take a square of side a and cut it along a diagonal. The two angles at the cut are equal, so each is 45 degrees.",
          "Side a ka ek square lo aur use diagonal se kaato. Kate hue do angles barabar hain, isliye har ek 45 degrees ka hai."),
        L("Disha", "Pythagoras gives the diagonal: a squared plus a squared is 2 a squared, so the hypotenuse is root 2 times a.",
          "Pythagoras se diagonal milta hai: a square plus a square barabar 2 a square, toh hypotenuse hai root 2 guna a."),
    ], {"mode": "iso", "step": 1}),
    scene([
        L("Dadi", "So sin 45 degrees and cos 45 degrees are both 1 by root 2, and tan 45 degrees is exactly 1.",
          "Toh sin 45 degrees aur cos 45 degrees dono 1 bata root 2 hain, aur tan 45 degrees theek 1 hai."),
    ], {"mode": "iso", "step": 2}),
    scene([
        L("Deepak", "Now an equilateral triangle, like a railway warning sign, with each side 2a. Drop a perpendicular from the top A to D on the base.",
          "Ab ek equilateral triangle lo, railway ke warning sign jaisa, har side 2a. Upar ke point A se base par D tak perpendicular giraao."),
        L("Dadi", "It cuts the base in half, so B D is a, and it cuts the top angle into two angles of 30 degrees. Angle B stays 60 degrees.",
          "Yeh base ko aadha kar deta hai, toh B D barabar a, aur upar ke angle ko 30 30 degrees mein baant deta hai. Angle B 60 degrees hi rehta hai."),
    ], {"mode": "equi", "step": 1, "focus": 30}),
    scene([
        L("Disha", "A D squared is 4 a squared minus a squared, which is 3 a squared, so A D is root 3 times a.",
          "A D ka square hai 4 a square minus a square, yaani 3 a square, toh A D hai root 3 guna a."),
        L("Dadi", "Standing at the 30 degree angle, sin 30 degrees is a by 2a, which is half. cos 30 degrees is root 3 by 2.",
          "30 degree wale angle par khade hokar, sin 30 degrees hai a bata 2a, yaani aadha. cos 30 degrees hai root 3 bata 2."),
    ], {"mode": "equi", "step": 2, "focus": 30}),
    scene([
        L("Dadi", "Now stand at angle B, which is 60 degrees. sin 60 degrees is root 3 by 2, cos 60 degrees is half, and tan 60 degrees is root 3.",
          "Ab angle B par khade ho, jo 60 degrees hai. sin 60 degrees hai root 3 bata 2, cos 60 degrees aadha, aur tan 60 degrees root 3."),
        L("Harsh", "The same two numbers again, just swapped between sine and cosine!", "Wahi do numbers phir se, bas sine aur cosine mein jagah badal li!"),
    ], {"mode": "equi", "step": 2, "focus": 60}),
    scene([
        L("Dadi", "Your turn! Using the half triangle, what is tan 30 degrees?",
          "Ab aapki baari! Aadhe triangle se batao, tan 30 degrees kitna hai?"),
    ], {"mode": "equi", "step": 1, "focus": 30, "task": {"q": "tan 30° = opposite / adjacent = ?", "options": ["√3", "1/√3", "1/2", "√3/2"], "answer": 1}}, wait=True),
]

# ─────────────────────────────── Part 5 ───────────────────────────────
SCENES_5 = [
    scene([
        L("Narrator", "At the cricket nets, Harsh's coach is setting up the bowling machine and changing its launch angle.",
          "Cricket nets par, Harsh ke coach bowling machine set kar rahe hain aur uska launch angle badal rahe hain."),
        L("Dadi", "Keep the hypotenuse 1. Then the opposite side is sin A and the adjacent side is cos A. Watch them as the angle changes.",
          "Hypotenuse ko 1 rakho. Tab opposite side sin A hai aur adjacent side cos A. Angle badalne par inhe dekho."),
    ], {"angle": 60, "table": False}),
    scene([
        L("Dadi", "Make angle A smaller and smaller. The opposite side shrinks towards 0 and the adjacent side grows towards the hypotenuse.",
          "Angle A ko chhota aur chhota karo. Opposite side 0 ki taraf ghatti hai aur adjacent side hypotenuse ke barabar hone lagti hai."),
    ], {"angle": 10, "table": False}),
    scene([
        L("Disha", "At 0 degrees the triangle is flat. So sin 0 degrees is 0 and cos 0 degrees is 1!",
          "0 degrees par triangle chapta ho jaata hai. Toh sin 0 degrees barabar 0 aur cos 0 degrees barabar 1!"),
        L("Dadi", "Right. And tan 0 degrees is 0, but cot 0 degrees and cosec 0 degrees are not defined, because we cannot divide by 0.",
          "Sahi. Aur tan 0 degrees bhi 0 hai, par cot 0 degrees aur cosec 0 degrees defined nahi hain, kyunki 0 se divide nahi kar sakte."),
    ], {"angle": 0, "table": True, "rows": 2}),
    scene([
        L("Dadi", "Now push A up to 90 degrees. The triangle stands straight up, so sin 90 degrees is 1 and cos 90 degrees is 0.",
          "Ab A ko 90 degrees tak le jaao. Triangle seedha khada ho jaata hai, toh sin 90 degrees barabar 1 aur cos 90 degrees barabar 0."),
        L("Harsh", "Then tan 90 degrees is 1 divided by 0. Not defined!", "Toh tan 90 degrees hai 1 bhaag 0. Defined nahi!"),
    ], {"angle": 90, "table": True, "rows": 3}),
    scene([
        L("Dadi", "Here is the full table. Learn the sin row as root 0, root 1, root 2, root 3, root 4, each divided by 2. The cos row is the same, read backwards.",
          "Yeh rahi poori table. sin wali line yaad karo: root 0, root 1, root 2, root 3, root 4, har ek bhaag 2. cos wali line wahi hai, ulti padho."),
        L("Disha", "And as A goes from 0 to 90 degrees, sin A increases from 0 to 1 while cos A decreases from 1 to 0.",
          "Aur jab A 0 se 90 degrees jaata hai, sin A 0 se 1 tak badhta hai jabki cos A 1 se 0 tak ghatta hai."),
    ], {"angle": 45, "table": True, "rows": 6}),
    scene([
        L("Dadi", "Your turn! Slide angle A to the one angle where sin A and cos A are equal.",
          "Ab aapki baari! Angle A ko us angle par le jaao jahan sin A aur cos A barabar hon."),
    ], {"angle": 20, "table": True, "rows": 3, "task": {"angle": 45, "text": "slide A until sin A = cos A."}}, wait=True),
]

# ─────────────────────────────── Part 6 ───────────────────────────────
SCENES_6 = [
    scene([
        L("Narrator", "Holi holidays. Dadi writes one line on the whiteboard and says it is the most famous line in trigonometry.",
          "Holi ki chhuttiyan. Dadi whiteboard par ek line likhti hain aur kehti hain ki yeh trigonometry ki sabse mashhoor line hai."),
        L("Dadi", "In triangle A B C, Pythagoras says A B squared plus B C squared equals A C squared. Divide every term by A C squared.",
          "Triangle A B C mein Pythagoras kehta hai A B square plus B C square barabar A C square. Har term ko A C square se divide karo."),
    ], {"mode": "pyth", "angle": 37}),
    scene([
        L("Disha", "That gives cos squared A plus sin squared A equals 1! And the slider shows the sum stays 1 for every angle.",
          "Isse milta hai cos square A plus sin square A barabar 1! Aur slider dikhata hai ki har angle par sum 1 hi rehta hai."),
        L("Dadi", "An equation true for every angle where both sides are defined is called a trigonometric identity.",
          "Jo equation har us angle ke liye sach ho jahan dono sides defined hain, use trigonometric identity kehte hain."),
    ], {"mode": "divide", "divide": "hyp", "angle": 60}),
    scene([
        L("Dadi", "Divide by A B squared instead, and you get 1 plus tan squared A equals sec squared A. It holds for angles from 0 up to, but not including, 90 degrees.",
          "A B square se divide karo toh milta hai 1 plus tan square A barabar sec square A. Yeh 0 se lekar 90 degrees se pehle tak ke angles par sach hai."),
    ], {"mode": "divide", "divide": "adj", "angle": 30}),
    scene([
        L("Dadi", "Divide by B C squared, and you get cot squared A plus 1 equals cosec squared A, for angles above 0, up to 90 degrees.",
          "B C square se divide karo toh milta hai cot square A plus 1 barabar cosec square A, 0 se bade aur 90 degrees tak ke angles ke liye."),
    ], {"mode": "divide", "divide": "opp", "angle": 50}),
    scene([
        L("Dadi", "To prove an identity, start from the harder side. Write everything in sin and cos, simplify, and reach the other side.",
          "Identity prove karne ke liye mushkil side se shuru karo. Sab kuch sin aur cos mein likho, simplify karo, aur doosri side tak pahuncho."),
        L("Harsh", "Like sec A plus tan A, times 1 minus sin A. That is 1 plus sin A, over cos A, times 1 minus sin A. The top becomes cos squared A, so the answer is cos A!",
          "Jaise sec A plus tan A, guna 1 minus sin A. Yeh hai 1 plus sin A, bata cos A, guna 1 minus sin A. Upar cos square A ban jaata hai, toh answer cos A!"),
    ], {"mode": "divide", "divide": "hyp", "angle": 40}),
    scene([
        L("Disha", "Dadi, where does the strange word sine come from?", "Dadi, yeh ajeeb sa shabd sine aaya kahan se?"),
        L("Dadi", "From India, beta. Around 500 C E, Aryabhata used ardha jya, the half chord. Jya means a bowstring, and he shortened it to jya or jiva.",
          "Bharat se, beta. Lagbhag 500 C E mein Aryabhata ne ardha jya, yaani aadhi chord, ka use kiya. Jya ka matlab hai dhanush ki dor, aur unhone ise chhota karke jya ya jiva kar diya."),
    ], {"mode": "history", "journey": 1}),
    scene([
        L("Dadi", "Arabic translators kept the sound as jiba. Later readers took it as jaib, meaning a fold or bay, and Latin translators wrote sinus, which also means a fold. From sinus came sine.",
          "Arabic translators ne awaaz jiba rakhi. Baad mein padhne waalon ne ise jaib samjha, jiska matlab hai fold ya khaadi, aur Latin translators ne sinus likha, jiska matlab bhi fold hai. Sinus se bana sine."),
        L("Harsh", "So every time I write sin, I am writing a bowstring from Aryabhata!", "Toh jab bhi main sin likhta hoon, main Aryabhata ki dhanush ki dor likh raha hoon!"),
    ], {"mode": "history", "journey": 5}),
    scene([
        L("Dadi", "Your turn! Which square should we divide by to get 1 plus tan squared A equals sec squared A?",
          "Ab aapki baari! 1 plus tan square A barabar sec square A paane ke liye kis square se divide karein?"),
    ], {"mode": "divide", "angle": 35, "task": {"want": "adj"}}, wait=True),
]

# ─────────────────────────────── Part 7 ───────────────────────────────
SCENES_7 = [
    scene([
        L("Narrator", "A week before the exam, Dadi runs a mock paper at the dining table.", "Exam se ek hafta pehle, Dadi dining table par mock paper karwaati hain."),
        L("Dadi", "Question 1. If sin A is 3 by 5, find cos A.", "Sawaal 1. Agar sin A barabar 3 bata 5 hai, toh cos A nikaalo."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "Take B C as 3k and A C as 5k. Then A B squared is 25 k squared minus 9 k squared, which is 16 k squared, so A B is 4k and cos A is 4 by 5.",
          "B C ko 3k aur A C ko 5k lo. Toh A B ka square hai 25 k square minus 9 k square, yaani 16 k square, toh A B barabar 4k aur cos A barabar 4 bata 5."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. tan A is 4 by 3. Find all the other ratios.", "Sawaal 2. tan A barabar 4 bata 3. Baaki saare ratios nikaalo."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "B C is 4k, A B is 3k, so A C is 5k. sin A is 4 by 5, cos A is 3 by 5, and the rest are their upside down values!",
          "B C barabar 4k, A B barabar 3k, toh A C barabar 5k. sin A hai 4 bata 5, cos A hai 3 bata 5, aur baaki inke ulte values hain!"),
        L("Dadi", "Shabash. Write each one separately in the exam; the examiner gives marks for every ratio.",
          "Shabash. Exam mein har ek alag se likho; examiner har ratio ke marks deta hai."),
    ], {"example": 1, "step": 4}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then reveal the steps.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir steps dekho."),
    ], {"example": 2, "step": 0}),
]


def _tri_svg(a, b, c, la, lb, lc):
    """Right triangle ABC (right angle at B) with side labels: AB = la, BC = lb, AC = lc."""
    return (
        '<svg viewBox="0 0 300 170" width="300" height="170" xmlns="http://www.w3.org/2000/svg">'
        '<polygon points="30,145 250,145 250,25" fill="#0f172a" stroke="#e2e8f0" stroke-width="2.5"/>'
        '<polyline points="236,145 236,131 250,131" fill="none" stroke="#38bdf8" stroke-width="2"/>'
        f'<text x="18" y="160" fill="#e2e8f0" font-size="14" font-weight="bold">{a}</text>'
        f'<text x="256" y="160" fill="#e2e8f0" font-size="14" font-weight="bold">{b}</text>'
        f'<text x="256" y="24" fill="#e2e8f0" font-size="14" font-weight="bold">{c}</text>'
        f'<text x="140" y="164" fill="#38bdf8" font-size="13" text-anchor="middle">{la}</text>'
        f'<text x="262" y="90" fill="#f472b6" font-size="13">{lb}</text>'
        f'<text x="120" y="78" fill="#fbbf24" font-size="13" text-anchor="middle">{lc}</text>'
        '</svg>'
    )


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Papa's Railway Ramp · Sides and the Six Ratios",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Papa checks a new wheelchair ramp at the station. The ramp, the platform wall and the ground make a right triangle, and Dadi shows how dividing its sides gives six numbers that describe its slope.</div>

<h2>Naming the sides from angle A</h2>
<p>In triangle ABC, right-angled at B, look from the acute angle A:</p>
<div {CARD}>
  <div><strong>Hypotenuse</strong> AC: opposite the right angle, the longest side.</div>
  <div><strong>Side opposite to angle A</strong>: BC.</div>
  <div><strong>Side adjacent to angle A</strong>: AB.</div>
  <div>From angle C the roles swap: opposite to C is AB, adjacent to C is BC. The hypotenuse never changes.</div>
</div>

<h2>The six trigonometric ratios</h2>
<div {FORMULA}>sin A = BC/AC   ·   cos A = AB/AC   ·   tan A = BC/AB</div>
<div {FORMULA}>cosec A = 1/sin A = AC/BC   ·   sec A = 1/cos A = AC/AB   ·   cot A = 1/tan A = AB/BC</div>
<div {FORMULA}>tan A = sin A / cos A   ·   cot A = cos A / sin A</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Ratio</th><th class="text-left">Sides</th><th class="text-left">Reciprocal</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>sine (sin)</td><td>opposite / hypotenuse</td><td>cosecant (cosec)</td></tr>
    <tr><td>cosine (cos)</td><td>adjacent / hypotenuse</td><td>secant (sec)</td></tr>
    <tr><td>tangent (tan)</td><td>opposite / adjacent</td><td>cotangent (cot)</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>"sin A" is one symbol: the sine of angle A. It is <strong>not</strong> sin × A, and "sin" alone has no meaning.</div>
  <div>We write (sin A)² as sin²A, but sin A² would mean the sine of A².</div>
</div>
""",
        "keyInsight": "Fix an acute angle of a right triangle and divide any two sides: the six results are the trigonometric ratios of that angle.",
        "widgetType": "Class10IntroTrigRatioWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "In triangle PQR, right-angled at Q, which ratio equals PQ/PR?",
            "options": ["sin P", "cos P", "tan P", "cot P"],
            "correctIndex": 1,
            "explanation": "PR is the hypotenuse and PQ touches angle P, so PQ/PR = adjacent/hypotenuse = cos P.",
        },
        "teacherNotes": teacher(
            [
                "Draw one right triangle and have students physically point to 'opposite' and 'adjacent' while standing at angle A, then at angle C.",
                "Introduce sin, cos, tan first; get the other three as reciprocals, not as three new things to memorise.",
                "Derive tan A = sin A / cos A by dividing numerator and denominator of BC/AB by AC.",
            ],
            [
                "Calling the hypotenuse 'adjacent' because it also touches angle A.",
                "Reading sin A as sin × A, or cancelling 'sin' in sin A / sin B.",
                "Keeping 'opposite' fixed as BC even when the angle changes to C.",
            ],
            "Ramp survey: groups measure the rise and run of a staircase or ramp in school, then compute tan, sin and cos of its slope.",
            "NCERT Class 10 Ch. 8, sections 8.1 and 8.2 (Trigonometric ratios).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Three Ramps · Why the Ratios Depend Only on the Angle",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Disha draws ramps of three sizes at the same slope and asks why sin A should stay the same. Similar triangles answer her.</div>

<h2>Same angle, same ratios</h2>
<p>Take triangle ABC right-angled at B. Pick any point P on AC (or AC extended) and drop a perpendicular PM to AB. Triangles AMP and ABC have angle A common and a right angle each, so they are <strong>similar</strong> (AA criterion).</p>
<div {FORMULA}>AM/AB = AP/AC = MP/BC   ⇒   MP/AP = BC/AC = sin A</div>
<div {CARD}>
  <div>The same holds for every ratio. So the values of the trigonometric ratios of an angle <strong>do not depend on the lengths of the sides</strong>; they depend only on the angle.</div>
  <div>Changing the angle changes the shape, and then every ratio changes.</div>
</div>

<h2>Limits on the values (acute A)</h2>
<div {CARD}>
  <div>The hypotenuse is the longest side, so 0 &lt; sin A &lt; 1 and 0 &lt; cos A &lt; 1.</div>
  <div>Hence sec A &gt; 1 and cosec A &gt; 1.</div>
  <div>tan A and cot A can be any positive number (tan A &lt; 1 below 45°, tan A &gt; 1 above 45°).</div>
</div>
""",
        "keyInsight": "All right triangles with the same acute angle are similar, so each trigonometric ratio is a property of the angle alone.",
        "widgetType": "Class10IntroTrigSimilarWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "Which of these can NOT be the value of cos A for an acute angle A?",
            "options": ["0.6", "3/7", "5/4", "1/√2"],
            "correctIndex": 2,
            "explanation": "cos A = adjacent/hypotenuse, and the hypotenuse is the longest side, so cos A < 1. 5/4 is more than 1.",
        },
        "teacherNotes": teacher(
            [
                "Draw three nested right triangles with a shared angle; let students measure and compute opp/hyp for each.",
                "Link to the Triangles chapter: AA similarity gives equal ratios of corresponding sides.",
                "Use the 'hypotenuse is longest' argument for the ranges of sin and cos before showing any table.",
            ],
            [
                "Believing a bigger triangle has a bigger sin A.",
                "Accepting sin A = 4/3 or sec A = 0.8 without noticing it is impossible.",
                "Thinking tan A must also be less than 1.",
            ],
            "Measure-and-divide: each student draws a 35° right triangle of any size, measures the sides and computes sin 35°. Compare answers on the board (about 0.57).",
            "NCERT Class 10 Ch. 8, section 8.2 (ratios depend only on the angle; uses similarity from Ch. 6).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Mummy's Ladder · One Ratio Gives All Six",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Mummy leans a ladder against her shop to paint the signboard. Knowing only its slope, tan A = 4/3, the twins find every other ratio.</div>

<h2>The method</h2>
<div {CARD}>
  <div>1. Write the given ratio as sides with a common factor k (any positive number).</div>
  <div>2. Find the third side by Pythagoras: AC² = AB² + BC².</div>
  <div>3. Read off the other ratios; k always cancels.</div>
</div>
<h2>Example: tan A = 4/3</h2>
<p>BC = 4k, AB = 3k, so AC² = 9k² + 16k² = 25k² and AC = 5k.</p>
<div {FORMULA}>sin A = 4/5 · cos A = 3/5 · tan A = 4/3 · cosec A = 5/4 · sec A = 5/3 · cot A = 3/4</div>
<h2>Example: sin A = 3/4</h2>
<p>BC = 3k, AC = 4k, so AB² = 16k² − 9k² = 7k² and AB = √7 k.</p>
<div {FORMULA}>cos A = √7/4 · tan A = 3/√7 · sec A = 4/√7</div>
<div {CARD}>
  <div>Useful Pythagorean triples: 3, 4, 5 · 5, 12, 13 · 8, 15, 17 · 7, 24, 25.</div>
  <div>If ∠B = ∠Q are acute and sin B = sin Q, then the angles are equal (NCERT Example 2); a ratio fixes the acute angle.</div>
</div>
""",
        "keyInsight": "Given one ratio, draw the triangle with sides in that ratio, use Pythagoras for the third side, and every other ratio follows.",
        "widgetType": "Class10IntroTrigFromOneWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "If cos A = 12/13, then tan A = ?",
            "options": ["5/12", "12/5", "5/13", "13/5"],
            "correctIndex": 0,
            "explanation": "AB = 12k, AC = 13k, so BC = √(169 − 144)k = 5k. tan A = BC/AB = 5/12.",
        },
        "teacherNotes": teacher(
            [
                "Insist on the k: 'tan A = 4/3' does not mean BC = 4 cm, only that BC : AB = 4 : 3.",
                "Always draw and label the triangle first, marking which side is known.",
                "Show a non-triple case (sin A = 3/4) so students meet surds early.",
            ],
            [
                "Taking BC = 4 and AB = 3 and then forgetting the ratio could come from any size.",
                "Adding squares when the hypotenuse is known (should subtract).",
                "Mixing which side goes on top for cot and sec.",
            ],
            "Ratio relay: one student calls out a ratio such as 'sec A = 17/8'; the next finds the third side; the next gives all six ratios.",
            "NCERT Class 10 Ch. 8, section 8.2 (Examples 1–4, Exercise 8.1).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Kite Day · Ratios of 30°, 45° and 60°",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>On Makar Sankranti, Dadi cuts a square along its diagonal and Papa halves an equilateral warning sign. Out come the exact ratios of 45°, 30° and 60°.</div>

<h2>45°: half a square</h2>
<p>In triangle ABC right-angled at B with ∠A = 45°, ∠C = 45° too, so AB = BC = a. Then AC² = a² + a² = 2a², AC = √2 a.</p>
<div {FORMULA}>sin 45° = 1/√2 · cos 45° = 1/√2 · tan 45° = 1 · cosec 45° = √2 · sec 45° = √2 · cot 45° = 1</div>

<h2>30° and 60°: half an equilateral triangle</h2>
<p>Equilateral triangle ABC with side 2a. The perpendicular AD to BC bisects BC and ∠A, so BD = a, ∠BAD = 30°, ∠ABD = 60°. AD² = (2a)² − a² = 3a², AD = √3 a.</p>
<div {FORMULA}>sin 30° = 1/2 · cos 30° = √3/2 · tan 30° = 1/√3</div>
<div {FORMULA}>sin 60° = √3/2 · cos 60° = 1/2 · tan 60° = √3</div>
<div {CARD}>
  <div>cosec 30° = 2, sec 30° = 2/√3, cot 30° = √3; cosec 60° = 2/√3, sec 60° = 2, cot 60° = 1/√3.</div>
  <div>Check: sin 60° cos 30° + sin 30° cos 60° = (√3/2)(√3/2) + (1/2)(1/2) = 3/4 + 1/4 = 1.</div>
</div>
""",
        "keyInsight": "Half a square gives 45°, half an equilateral triangle gives 30° and 60°; Pythagoras then gives their exact ratios.",
        "widgetType": "Class10IntroTrigSpecialWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Evaluate sin 60° cos 30° + sin 30° cos 60°.",
            "options": ["0", "1/2", "1", "√3/2"],
            "correctIndex": 2,
            "explanation": "(√3/2)(√3/2) + (1/2)(1/2) = 3/4 + 1/4 = 1.",
        },
        "teacherNotes": teacher(
            [
                "Have students fold a square sheet along its diagonal and an equilateral triangle along its altitude.",
                "Derive, do not dictate: the derivation is a common 3-mark board question.",
                "Point out that 30° and 60° use the same triangle seen from two different corners.",
            ],
            [
                "Swapping sin 30° and sin 60°.",
                "Writing tan 30° as √3 (it is 1/√3).",
                "Forgetting that in the equilateral triangle the side is 2a, not a.",
            ],
            "Paper folding: each group folds and labels both triangles, then fills in a blank table of six ratios for 30°, 45°, 60°.",
            "NCERT Class 10 Ch. 8, section 8.3 (ratios of 45°, 30°, 60°).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Bowling Machine · 0°, 90° and the Table of Values",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>At the cricket nets the coach tilts the bowling machine from flat to straight up. With a hypotenuse of 1, the opposite side is sin A and the adjacent side is cos A, and the twins watch them change.</div>

<h2>Ratios of 0° and 90°</h2>
<p>As A shrinks to 0°, BC shrinks to 0 and AB becomes equal to AC. As A grows to 90°, AB shrinks to 0 and BC becomes equal to AC.</p>
<div {FORMULA}>sin 0° = 0 · cos 0° = 1 · tan 0° = 0 · sin 90° = 1 · cos 90° = 0</div>
<div {CARD}>
  <div>cosec 0° and cot 0° are <strong>not defined</strong> (division by sin 0° = 0).</div>
  <div>tan 90° and sec 90° are <strong>not defined</strong> (division by cos 90° = 0); cot 90° = 0, cosec 90° = 1.</div>
</div>

<h2>The table</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">∠A</th><th>0°</th><th>30°</th><th>45°</th><th>60°</th><th>90°</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td class="text-left">sin A</td><td>0</td><td>1/2</td><td>1/√2</td><td>√3/2</td><td>1</td></tr>
    <tr><td class="text-left">cos A</td><td>1</td><td>√3/2</td><td>1/√2</td><td>1/2</td><td>0</td></tr>
    <tr><td class="text-left">tan A</td><td>0</td><td>1/√3</td><td>1</td><td>√3</td><td>Not defined</td></tr>
    <tr><td class="text-left">cosec A</td><td>Not defined</td><td>2</td><td>√2</td><td>2/√3</td><td>1</td></tr>
    <tr><td class="text-left">sec A</td><td>1</td><td>2/√3</td><td>√2</td><td>2</td><td>Not defined</td></tr>
    <tr><td class="text-left">cot A</td><td>Not defined</td><td>√3</td><td>1</td><td>1/√3</td><td>0</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>Memory trick: sin row = √0/2, √1/2, √2/2, √3/2, √4/2. The cos row is the sin row reversed.</div>
  <div>As A increases from 0° to 90°, sin A increases from 0 to 1 and cos A decreases from 1 to 0.</div>
  <div>Example: if sin(A − B) = 1/2 and cos(A + B) = 1/2 (with A &gt; B, A + B ≤ 90°), then A − B = 30° and A + B = 60°, so A = 45°, B = 15°.</div>
</div>
""",
        "keyInsight": "With hypotenuse 1, sin A is the height and cos A the base; sliding A from 0° to 90° explains every entry of the table.",
        "widgetType": "Class10IntroTrigSweepWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "Which of these is NOT defined?",
            "options": ["sin 0°", "cos 90°", "sec 90°", "cot 90°"],
            "correctIndex": 2,
            "explanation": "sec 90° = 1/cos 90° = 1/0, which is not defined. The others are 0.",
        },
        "teacherNotes": teacher(
            [
                "Use a unit-length stick hinged at a point: lift it slowly and measure its height (sin) and shadow (cos).",
                "Teach the √0 to √4 pattern for the sin row, then reverse it for cos.",
                "Discuss 'not defined' as division by zero, not as 'infinity is the answer'.",
            ],
            [
                "Writing tan 90° = 0 or = 1.",
                "Thinking sin increases and cos increases together.",
                "Solving sin(A − B) = 1/2 by writing sin A − sin B = 1/2.",
            ],
            "Table race: blank 6 × 5 table; pairs fill it from the two folded triangles and the 0°/90° limits, fastest correct pair wins.",
            "NCERT Class 10 Ch. 8, section 8.3 (ratios of 0° and 90°, Table 8.1, Examples 6–8).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Holi Holidays · Identities, Proofs and the Story of Sine",
        "readingTime": "~8 min story",
        "narrative": f"""
<div {STORY}>Dadi divides Pythagoras by each side squared and gets three identities that hold for every angle. Then she tells how Aryabhata's word for a bowstring became our word "sine".</div>

<h2>The three identities</h2>
<p>In triangle ABC right-angled at B: AB² + BC² = AC². Divide by AC², by AB², by BC²:</p>
<div {FORMULA}>sin²A + cos²A = 1   (0° ≤ A ≤ 90°)</div>
<div {FORMULA}>1 + tan²A = sec²A   (0° ≤ A &lt; 90°)</div>
<div {FORMULA}>cot²A + 1 = cosec²A   (0° &lt; A ≤ 90°)</div>
<div {CARD}>
  <div>An equation involving trigonometric ratios that is true for <strong>all</strong> values of the angle for which the ratios are defined is a <strong>trigonometric identity</strong>.</div>
  <div>Rearranged forms: sin²A = 1 − cos²A, sec²A − tan²A = 1, cosec²A − cot²A = 1.</div>
  <div>Using them, any ratio can be written in terms of any other, e.g. sin A = 1/√(1 + cot²A).</div>
</div>

<h2>Proving an identity</h2>
<div {CARD}>
  <div>Start from the more complicated side; convert to sin and cos; simplify; reach the other side. Never "move terms across" as in an equation.</div>
  <div><strong>Prove</strong> (sec A + tan A)(1 − sin A) = cos A.</div>
  <div>LHS = (1/cos A + sin A/cos A)(1 − sin A) = (1 + sin A)(1 − sin A)/cos A = (1 − sin²A)/cos A = cos²A/cos A = cos A = RHS.</div>
</div>

<h2>A pinch of history</h2>
<div {CARD}>
  <div>Around 500 CE, <strong>Aryabhata</strong> used <em>ardha-jya</em> ("half-chord"), shortened to <em>jya</em> or <em>jiva</em>; jya also means a bowstring.</div>
  <div>Arabic translators kept the sound as <em>jiba</em>; later it was read as <em>jaib</em> ("fold" or "bay"), which Latin translators rendered as <em>sinus</em>. From sinus comes our <strong>sine</strong>.</div>
</div>
""",
        "keyInsight": "Dividing Pythagoras by each side squared gives three identities that are true for every angle where the ratios are defined.",
        "widgetType": "Class10IntroTrigIdentityWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "9 sec²A − 9 tan²A = ?",
            "options": ["1", "9", "0", "8"],
            "correctIndex": 1,
            "explanation": "9(sec²A − tan²A) = 9 × 1 = 9.",
        },
        "teacherNotes": teacher(
            [
                "Derive all three identities from one Pythagoras line on the board; students should never need to memorise them blindly.",
                "Check numerically: sin²37° + cos²37° on a calculator is 1.",
                "For proofs, model the 'one side only' discipline: LHS = ... = RHS.",
            ],
            [
                "Writing sin²A + cos²A = 1 as sin A + cos A = 1.",
                "Cross-multiplying or cancelling across the = sign while proving.",
                "Forgetting the angle ranges where tan, sec, cot, cosec are undefined.",
            ],
            "Proof pairs: one student writes the first two steps of a proof, the partner finishes; then they swap with a new identity.",
            "NCERT Class 10 Ch. 8, section 8.4 (Trigonometric identities, Examples 12–15, Exercise 8.3).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 board-style problems, step by step",
        "readingTime": "~12 min",
        "narrative": f"""
<div {STORY}>A week before the board exam, Dadi runs a mock paper at the dining table. Harsh answers fast; Disha writes every step.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Six ratios: sin = opp/hyp, cos = adj/hyp, tan = opp/adj and their reciprocals.</li>
  <li>One ratio given: sides with k, Pythagoras, read off the rest.</li>
  <li>Table of 0°, 30°, 45°, 60°, 90°.</li>
  <li>Identities: sin²A + cos²A = 1, 1 + tan²A = sec²A, 1 + cot²A = cosec²A.</li>
</ol>
<p>Use the question buttons. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Every question here is solved by the ratio definitions, Pythagoras, the table, or one identity.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "MCQ · From sin to cos",
                    "question": "If sin A = 3/5, then cos A is: (a) 3/4 (b) 4/5 (c) 5/4 (d) 4/3",
                    "steps": [
                        "Let BC = 3k, AC = 5k.",
                        "AB² = AC² − BC² = 25k² − 9k² = 16k², so AB = 4k.",
                        "cos A = AB/AC = 4k/5k = <strong>4/5</strong>, option (b).",
                    ],
                    "answer": "(b) 4/5",
                    "figureSvg": _tri_svg("A", "B", "C", "AB = 4k", "3k", "5k"),
                },
                {
                    "title": "Short answer · All six from tan A",
                    "question": "Given tan A = 4/3, find the other trigonometric ratios of angle A.",
                    "steps": [
                        "tan A = BC/AB = 4/3, so let BC = 4k, AB = 3k.",
                        "AC² = (3k)² + (4k)² = 25k², so AC = 5k.",
                        "sin A = 4/5, cos A = 3/5.",
                        "cosec A = 5/4, sec A = 5/3, cot A = 3/4.",
                    ],
                    "answer": "sin A = 4/5, cos A = 3/5, cosec A = 5/4, sec A = 5/3, cot A = 3/4",
                },
                {
                    "title": "Short answer · Using the table",
                    "question": "Evaluate 2 tan²45° + cos²30° − sin²60°.",
                    "steps": [
                        "tan 45° = 1, cos 30° = √3/2, sin 60° = √3/2.",
                        "= 2(1)² + (√3/2)² − (√3/2)²",
                        "= 2 + 3/4 − 3/4 = <strong>2</strong>",
                    ],
                    "answer": "2",
                },
                {
                    "title": "Short answer · Sides given",
                    "question": "In △ABC, right-angled at B, AB = 24 cm and BC = 7 cm. Find sin A and cos A.",
                    "steps": [
                        "AC² = AB² + BC² = 576 + 49 = 625, so AC = 25 cm.",
                        "sin A = BC/AC = <strong>7/25</strong>.",
                        "cos A = AB/AC = <strong>24/25</strong>.",
                    ],
                    "answer": "sin A = 7/25, cos A = 24/25",
                    "figureSvg": _tri_svg("A", "B", "C", "24 cm", "7 cm", "?"),
                },
                {
                    "title": "Short answer · Finding angles",
                    "question": "If sin(A − B) = 1/2 and cos(A + B) = 1/2, 0° &lt; A + B ≤ 90°, A &gt; B, find A and B.",
                    "steps": [
                        "sin(A − B) = 1/2 = sin 30°, so A − B = 30°.",
                        "cos(A + B) = 1/2 = cos 60°, so A + B = 60°.",
                        "Adding: 2A = 90°, A = 45°. Then B = 15°.",
                    ],
                    "answer": "A = 45°, B = 15°",
                },
                {
                    "title": "Long answer · Prove an identity",
                    "question": "Prove that (cosec θ − cot θ)² = (1 − cos θ)/(1 + cos θ).",
                    "steps": [
                        "LHS = (1/sin θ − cos θ/sin θ)² = (1 − cos θ)²/sin²θ",
                        "= (1 − cos θ)²/(1 − cos²θ)",
                        "= (1 − cos θ)²/[(1 − cos θ)(1 + cos θ)]",
                        "= (1 − cos θ)/(1 + cos θ) = RHS. Hence proved.",
                    ],
                    "answer": "Proved",
                },
                {
                    "title": "Assertion–Reason",
                    "question": "Assertion (A): sin A = 4/3 for some acute angle A.<br>Reason (R): In a right triangle the hypotenuse is the longest side.<br>(a) Both true, R explains A (b) Both true, R does not explain A (c) A true, R false (d) A false, R true",
                    "steps": [
                        "sin A = opposite/hypotenuse, and the hypotenuse is the longest side, so sin A &lt; 1 for acute A.",
                        "4/3 &gt; 1, so A is false. R is a true fact.",
                        "Answer: <strong>(d)</strong>",
                    ],
                    "answer": "(d) A is false, R is true",
                },
                {
                    "title": "Case-based · The station ramp",
                    "question": "Papa's platform ramp is 13 m long and rises 5 m. Let θ be the angle it makes with the ground. (i) sin θ? (ii) horizontal length? (iii) tan θ? (iv) Verify sin²θ + cos²θ = 1.",
                    "steps": [
                        "(i) sin θ = 5/13.",
                        "(ii) Base² = 13² − 5² = 169 − 25 = 144, so base = 12 m.",
                        "(iii) tan θ = 5/12.",
                        "(iv) cos θ = 12/13; (5/13)² + (12/13)² = 25/169 + 144/169 = 169/169 = 1. ✓",
                    ],
                    "answer": "5/13, 12 m, 5/12, verified",
                    "figureSvg": _tri_svg("θ", "", "", "12 m", "5 m", "13 m"),
                },
                {
                    "title": "Long answer · Prove an identity",
                    "question": "Prove that (sec A + tan A)(1 − sin A) = cos A.",
                    "steps": [
                        "LHS = (1/cos A + sin A/cos A)(1 − sin A)",
                        "= (1 + sin A)(1 − sin A)/cos A",
                        "= (1 − sin²A)/cos A = cos²A/cos A",
                        "= cos A = RHS. Hence proved.",
                    ],
                    "answer": "Proved",
                },
                {
                    "title": "Short answer · Check a statement",
                    "question": "If 3 cot A = 4, check whether (1 − tan²A)/(1 + tan²A) = cos²A − sin²A.",
                    "steps": [
                        "cot A = 4/3, so AB = 4k, BC = 3k, AC = 5k; tan A = 3/4, sin A = 3/5, cos A = 4/5.",
                        "LHS = (1 − 9/16)/(1 + 9/16) = (7/16)/(25/16) = 7/25.",
                        "RHS = 16/25 − 9/25 = 7/25.",
                        "LHS = RHS, so the statement is <strong>true</strong>.",
                    ],
                    "answer": "True (both sides equal 7/25)",
                },
            ],
        },
        "scenes": SCENES_7,
        "miniChallenge": {
            "question": "If sec A = 13/12, then sin A = ?",
            "options": ["5/13", "12/13", "5/12", "13/5"],
            "correctIndex": 0,
            "explanation": "AC = 13k, AB = 12k, so BC = 5k and sin A = BC/AC = 5/13.",
        },
        "teacherNotes": teacher(
            [
                "Q1–Q4 practise definitions and the table; Q5 links equations to standard angles; Q6 and Q9 are proof models; Q7 and Q8 are the newer board formats.",
                "In proofs, insist on writing 'LHS =' and ending with '= RHS'.",
            ],
            [
                "Q3: squaring √3/2 as √3/4 instead of 3/4.",
                "Q5: writing A − B = 60° by mixing up which ratio gives 1/2.",
                "Q6: cancelling (1 − cos θ) before factorising the denominator.",
            ],
            "Pair-share: one student says the first step (for example 'convert to sin and cos'), the other finishes; swap for the next question.",
            "Covers NCERT Class 10 Ch. 8 Exercises 8.1–8.3 and CBSE board patterns (MCQ, assertion–reason, case-based).",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Introduction to Trigonometry (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From Papa's ramp to Aryabhata's bowstring, you have named sides, built ratios, derived special values and proved identities. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 board-style questions</strong>, including assertion–reason.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Name the sides from the angle, then divide: everything else follows from Pythagoras.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Introduction to Trigonometry · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "In △ABC right-angled at B, tan A equals:", "options": ["BC/AC", "AB/BC", "BC/AB", "AC/AB"], "answer": 2, "explanation": "tan A = opposite/adjacent = BC/AB.", "topic": "Trigonometric ratios"},
                {"q": "If cos A = 4/5, then tan A is:", "options": ["3/5", "3/4", "4/3", "5/3"], "answer": 1, "explanation": "AB = 4k, AC = 5k, so BC = 3k and tan A = 3/4.", "topic": "One ratio gives all"},
                {"q": "2 tan 30° / (1 + tan²30°) equals:", "options": ["sin 60°", "cos 60°", "tan 60°", "sin 30°"], "answer": 0, "explanation": "(2/√3)/(1 + 1/3) = (2/√3)(3/4) = √3/2 = sin 60°.", "topic": "Special angles"},
                {"q": "9 sec²A − 9 tan²A equals:", "options": ["1", "9", "8", "0"], "answer": 1, "explanation": "9(sec²A − tan²A) = 9 × 1 = 9.", "topic": "Identities"},
                {"q": "sin 30° + cos 60° equals:", "options": ["0", "1/2", "1", "√3"], "answer": 2, "explanation": "1/2 + 1/2 = 1.", "topic": "Special angles"},
                {"q": "Which of these is not defined?", "options": ["sin 90°", "cos 90°", "tan 90°", "cot 90°"], "answer": 2, "explanation": "tan 90° = sin 90°/cos 90° = 1/0, not defined. The others are 1, 0, 0.", "topic": "0° and 90°"},
                {"q": "Assertion (A): sin A · cosec A = 1 for every acute angle A. Reason (R): cosec A = 1/sin A.", "options": AR_OPTIONS, "answer": 0, "explanation": "Both are true, and A follows directly from R.", "topic": "Reciprocal ratios"},
                {"q": "Assertion (A): sec A = 1/2 for some acute angle A. Reason (R): sec A ≥ 1 for 0° ≤ A < 90°.", "options": AR_OPTIONS, "answer": 3, "explanation": "sec A = hypotenuse/adjacent is at least 1, so sec A = 1/2 is impossible: A is false, R is true.", "topic": "Range of values"},
                {"q": "(1 + tan²A)/(1 + cot²A) equals:", "options": ["sec²A", "−1", "cot²A", "tan²A"], "answer": 3, "explanation": "= sec²A/cosec²A = (1/cos²A)·sin²A = tan²A.", "topic": "Identities"},
                {"q": "If sin A = 1/2 for an acute angle A, then cot A equals:", "options": ["1/√3", "√3", "√3/2", "1"], "answer": 1, "explanation": "sin A = 1/2 gives A = 30°, and cot 30° = √3.", "topic": "Special angles"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q2 catches swapping tan and cot; Q6 catches 'tan 90° = 1'; Q8 catches ignoring the range of sec."],
            "Exit ticket: derive sin 60° from an equilateral triangle, and prove sec²A − tan²A = 1 from Pythagoras.",
            "Matches NCERT Class 10 Ch. 8 learning outcomes (rationalised syllabus).",
        ),
    },
]


def seed_class10_story_intro_trigonometry():
    db = SessionLocal()
    try:
        topic = get_class10_topic(db, "Introduction to Trigonometry")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 10 Introduction to Trigonometry: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Introduction to Trigonometry: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class10_story_intro_trigonometry()
