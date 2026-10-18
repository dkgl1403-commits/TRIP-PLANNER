import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Whole Numbers (old NCERT Ch. 2 "Whole Numbers"; Ganita Prakash ideas on zero, number-line operations,
# dot patterns and clever calculation). Story: the Jaipur family over one winter week: Papa's toy railway with
# kilometre stones, Mummy's bakery orders, laddoo trays for a wedding, and Dadi's dot rangoli.
#
# Verified facts used:
# - Brahmagupta wrote the Brahmasphutasiddhanta in 628 CE and gave rules for zero: adding or subtracting zero
#   leaves a number unchanged, and a number multiplied by zero becomes zero. He also claimed 0 ÷ 0 = 0, which is
#   wrong. (MacTutor History of Mathematics, University of St Andrews, "Brahmagupta" biography.)
# - Rohit Sharma scored 264 (33 fours, 9 sixes) for India against Sri Lanka at Eden Gardens, Kolkata, on
#   13 November 2014, the highest individual score in a men's ODI. (Guinness World Records; Scroll.in.)


SCENES_1 = [
    scene([
        L("Narrator", "It is a cold Sunday in Jaipur. Papa has laid a toy railway track across the courtyard, with a small stone at every kilometre.",
          "Jaipur mein thandi Sunday hai. Papa ne aangan mein ek toy railway track bichhaaya hai, aur har kilometre par ek chhota sa pathar lagaaya hai."),
        L("Deepak", "Real railway tracks have kilometre posts like these, so drivers and engineers always know where they are.",
          "Asli railway tracks par bhi aise kilometre posts hote hain, taaki driver aur engineer ko hamesha pata rahe ki woh kahan hain."),
        L("Harsh", "1, 2, 3, 4, 5. These are just counting numbers!", "1, 2, 3, 4, 5. Yeh toh bas ginti wale numbers hain!"),
    ], {"showZero": False, "train": 1}),
    scene([
        L("Dadi", "Yes, beta. The numbers we count with, 1, 2, 3 and so on, are called natural numbers. They go on forever.",
          "Haan beta. Jin numbers se hum ginte hain, 1, 2, 3 aur aage, unhe natural numbers kehte hain. Yeh kabhi khatam nahi hote."),
        L("Disha", "But where does the train start? It cannot start at stone 1, can it?", "Lekin train shuru kahan se hoti hai? Pathar 1 se toh shuru nahi ho sakti, hai na?"),
    ], {"showZero": False, "train": 1}),
    scene([
        L("Deepak", "Good question! The station itself is kilometre 0. Watch, I am putting the zero stone in its place.",
          "Bahut achchha sawaal! Station khud kilometre 0 hai. Dekho, main zero wala pathar uski jagah rakh raha hoon."),
        L("Dadi", "When 0 joins the natural numbers, the family is called the whole numbers: 0, 1, 2, 3 and so on. Every natural number is a whole number, but 0 is a whole number that is not natural.",
          "Jab 0 natural numbers ke saath jud jaata hai, toh is parivaar ko whole numbers kehte hain: 0, 1, 2, 3 aur aage. Har natural number ek whole number hai, lekin 0 aisa whole number hai jo natural nahi hai."),
        L("Dadi", "Our own Brahmagupta wrote rules for working with zero in the year 628. India gave zero to the world!",
          "Hamare apne Brahmagupta ne saal 628 mein zero ke saath kaam karne ke niyam likhe the. Bharat ne duniya ko zero diya!"),
    ], {"showZero": True, "train": 0}),
    scene([
        L("Harsh", "Let me drive! Train at stone 5, and one stone forward. Now it is at 6.", "Mujhe chalaane do! Train pathar 5 par hai, aur ek pathar aage. Ab 6 par hai."),
        L("Dadi", "The number that comes just after a number is its successor. The successor of 5 is 5 plus 1, which is 6.",
          "Kisi number ke theek baad aane wala number uska successor hota hai. 5 ka successor hai 5 plus 1, yaani 6."),
    ], {"showZero": True, "train": 5, "mark": "succ"}),
    scene([
        L("Disha", "And if I reverse the train by one stone, it goes back to 4.", "Aur agar main train ko ek pathar peeche le jaaun, toh woh 4 par aa jaati hai."),
        L("Dadi", "The number just before is the predecessor. The predecessor of 5 is 5 minus 1, which is 4.",
          "Theek pehle wala number predecessor hai. 5 ka predecessor hai 5 minus 1, yaani 4."),
    ], {"showZero": True, "train": 5, "mark": "pred"}),
    scene([
        L("Harsh", "So what is the predecessor of 0? Minus something?", "Toh 0 ka predecessor kya hai? Minus kuch?"),
        L("Dadi", "Among whole numbers, 0 has no predecessor. 0 is the smallest whole number. But there is no largest whole number, because every number has a successor.",
          "Whole numbers mein 0 ka koi predecessor nahi hai. 0 sabse chhota whole number hai. Lekin sabse bada whole number koi nahi, kyonki har number ka successor hota hai."),
    ], {"showZero": True, "train": 0, "mark": "pred"}),
    scene([
        L("Deepak", "The rule works for big numbers too. The successor of 99 is 100, and the predecessor of 1,000 is 999.",
          "Yeh niyam bade numbers par bhi chalta hai. 99 ka successor 100 hai, aur 1,000 ka predecessor 999 hai."),
    ], {"showZero": True, "train": 99, "mark": "succ"}),
    scene([
        L("Dadi", "This track is a number line. A number further to the right is always bigger. 8 is to the right of 3, so 8 is greater than 3.",
          "Yeh track ek number line hai. Jo number aur daayein hai, woh hamesha bada hota hai. 8, 3 ke daayein hai, isliye 8, 3 se bada hai."),
        L("Disha", "And 3 is to the left of 8, so 3 is less than 8!", "Aur 3, 8 ke baayein hai, toh 3, 8 se chhota hai!"),
    ], {"showZero": True, "compare": [3, 8]}),
    scene([
        L("Deepak", "Your turn, junior engineer! The train is at stone 45. Park it at the predecessor of 40.",
          "Ab aapki baari, junior engineer! Train pathar 45 par hai. Ise 40 ke predecessor par park karo."),
    ], {"showZero": True, "train": 45, "task": "pred", "of": 40}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "Papa now plans train trips on the toy track. Every trip is a jump along the number line.",
          "Ab Papa toy track par train ki yaatraayein plan karte hain. Har yaatra number line par ek chhalaang hai."),
        L("Deepak", "The train is at stone 3 and travels 4 kilometres forward. Where does it stop?",
          "Train pathar 3 par hai aur 4 kilometre aage jaati hai. Woh kahan rukegi?"),
    ], {"op": "add", "a": 3, "b": 4}),
    scene([
        L("Disha", "4 jumps to the right, 4, 5, 6, 7. It stops at 7!", "Daayein 4 chhalaang, 4, 5, 6, 7. Woh 7 par rukegi!"),
        L("Dadi", "Exactly. Addition means jumping to the right. 3 plus 4 equals 7.", "Bilkul. Addition ka matlab hai daayein chhalaang lagaana. 3 plus 4 barabar 7."),
    ], {"op": "add", "a": 3, "b": 4}),
    scene([
        L("Deepak", "Now the train is at 9 and goes back 4 kilometres to the shed.", "Ab train 9 par hai aur 4 kilometre peeche shed mein jaati hai."),
        L("Dadi", "Subtraction means jumping to the left. 9 minus 4 equals 5.", "Subtraction ka matlab hai baayein chhalaang. 9 minus 4 barabar 5."),
    ], {"op": "sub", "a": 9, "b": 4}),
    scene([
        L("Harsh", "What if the train is at 3 and must go back 5?", "Agar train 3 par ho aur use 5 peeche jaana ho toh?"),
        L("Deepak", "It hits the buffer at the station after 3 jumps! There is no stone to the left of 0.",
          "3 chhalaang ke baad woh station ke buffer se takra jaayegi! 0 ke baayein koi pathar nahi hai."),
        L("Dadi", "So 3 minus 5 has no answer among the whole numbers. Remember this, it will matter soon.",
          "Isliye 3 minus 5 ka whole numbers mein koi jawaab nahi hai. Yeh yaad rakhna, jaldi kaam aayega."),
    ], {"op": "sub", "a": 3, "b": 5}),
    scene([
        L("Deepak", "An express train stops only every 4 kilometres. Starting from the station, after 3 stops it is at 4, 8, 12.",
          "Ek express train sirf har 4 kilometre par rukti hai. Station se chalke, 3 stops ke baad woh 4, 8, 12 par hai."),
        L("Dadi", "Multiplication is equal jumps from 0. 3 jumps of 4 land on 12, so 3 times 4 equals 12.",
          "Multiplication ka matlab hai 0 se barabar chhalaangein. 4 ki 3 chhalaangein 12 par pahunchti hain, isliye 3 guna 4 barabar 12."),
    ], {"op": "mul", "a": 3, "b": 4}),
    scene([
        L("Harsh", "In my match yesterday I hit four sixes. 4 jumps of 6 is 24 runs!", "Kal ke match mein maine chaar chhakke maare. 6 ki 4 chhalaangein, yaani 24 runs!"),
        L("Disha", "Only in your dreams, Harsh!", "Sirf sapne mein, Harsh!"),
    ], {"op": "mul", "a": 4, "b": 6}),
    scene([
        L("Dadi", "Division is jumping backwards. 12 divided by 3 asks: starting at 12, how many jumps of 3 bring us back to 0?",
          "Division peeche ki chhalaang hai. 12 bhaag 3 poochhta hai: 12 se shuru karke, 3 ki kitni chhalaangein hamein 0 par waapas laayengi?"),
        L("Harsh", "12, 9, 6, 3, 0. Four jumps, so 12 divided by 3 is 4!", "12, 9, 6, 3, 0. Chaar chhalaangein, toh 12 bhaag 3 barabar 4!"),
    ], {"op": "div", "a": 12, "b": 3}),
    scene([
        L("Deepak", "Your turn. Choose multiply and land exactly on 12 with equal jumps from 0. Try a different way from 3 jumps of 4!",
          "Ab aapki baari. Multiply chuno aur 0 se barabar chhalaangon se theek 12 par pahuncho. 4 ki 3 chhalaangon se alag tareeka try karo!"),
    ], {"op": "mul", "a": 2, "b": 5, "target": 12}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "On Monday, Mummy's bakery is full of orders. Dadi sets up a little machine on the counter to test numbers.",
          "Somvaar ko Mummy ki bakery orders se bhari hai. Dadi counter par numbers test karne ke liye ek chhoti si machine lagaati hain."),
        L("Neha", "One customer wants 5 laddoos, another wants 7. Together that is 12 laddoos, a whole number of laddoos.",
          "Ek customer ko 5 laddoo chahiye, doosre ko 7. Milaakar 12 laddoo, poore laddoo, koi tukda nahi."),
    ], {"mode": "closure", "op": "add", "a": 5, "b": 7}),
    scene([
        L("Dadi", "Add any two whole numbers and you always get a whole number. We say whole numbers are closed under addition.",
          "Koi bhi do whole numbers jodo, hamesha whole number hi milega. Hum kehte hain whole numbers addition ke under closed hain."),
        L("Neha", "Same with my trays. 6 trays of 4 cupcakes is 24 cupcakes. Multiplying whole numbers always gives a whole number too.",
          "Meri trays ke saath bhi aisa hi hai. 4 cupcakes ki 6 trays, yaani 24 cupcakes. Whole numbers ko guna karne par bhi hamesha whole number milta hai."),
    ], {"mode": "closure", "op": "mul", "a": 6, "b": 4}),
    scene([
        L("Harsh", "Then subtraction must be closed too. 4 minus 9?", "Toh subtraction bhi closed hoga. 4 minus 9?"),
        L("Neha", "If I have only 4 cakes, I cannot sell 9! Remember Papa's train hitting the buffer?",
          "Agar mere paas sirf 4 cake hain, toh main 9 nahi bech sakti! Papa ki train ka buffer se takraana yaad hai?"),
        L("Dadi", "One example that fails is enough. Whole numbers are not closed under subtraction.",
          "Ek fail hone wala example kaafi hai. Whole numbers subtraction ke under closed nahi hain."),
    ], {"mode": "closure", "op": "sub", "a": 4, "b": 9}),
    scene([
        L("Disha", "And division? If I share 7 laddoos between 2 boxes, each box gets 3 and a half!",
          "Aur division? Agar main 7 laddoo 2 dabbon mein baantun, toh har dabbe ko saadhe teen milenge!"),
        L("Dadi", "3 and a half is not a whole number. So whole numbers are not closed under division either.",
          "Saadhe teen whole number nahi hai. Isliye whole numbers division ke under bhi closed nahi hain."),
    ], {"mode": "closure", "op": "div", "a": 7, "b": 2}),
    scene([
        L("Dadi", "Now the great mystery. First, an easy one. 12 divided by 3 asks: which number times 3 gives 12?",
          "Ab sabse bada rahasya. Pehle ek aasaan sawaal. 12 bhaag 3 poochhta hai: kaunsa number guna 3 karne par 12 deta hai?"),
        L("Neha", "1 box of 3, 2 boxes, 3 boxes, 4 boxes. 4 boxes of 3 make 12. So the answer is 4.",
          "3 ka 1 dabba, 2 dabbe, 3 dabbe, 4 dabbe. 3 ke 4 dabbe 12 banaate hain. Toh jawaab 4 hai."),
    ], {"mode": "divzero", "a": 12, "b": 3}),
    scene([
        L("Disha", "Then what is 5 divided by 0?", "Toh 5 bhaag 0 kya hai?"),
        L("Dadi", "It asks: which number times 0 gives 5? But 1 times 0 is 0, 100 times 0 is 0, even 1,000 times 0 is 0. We never reach 5!",
          "Yeh poochhta hai: kaunsa number guna 0 karne par 5 deta hai? Lekin 1 guna 0 barabar 0, 100 guna 0 barabar 0, 1,000 guna 0 bhi 0. Hum kabhi 5 tak nahi pahunchte!"),
        L("Dadi", "No number works, so division by zero is not defined. It is not zero, and it is not a very big number. It simply has no meaning.",
          "Koi number kaam nahi karta, isliye zero se divide karna defined nahi hai. Yeh zero nahi hai, aur koi bahut bada number bhi nahi. Iska koi matlab hi nahi hai."),
    ], {"mode": "divzero", "a": 5, "b": 0}),
    scene([
        L("Harsh", "Wait, what about 0 divided by 5?", "Ruko, aur 0 bhaag 5?"),
        L("Dadi", "That one is fine. 0 times 5 is 0, so 0 divided by 5 is 0. Zero laddoos shared in 5 boxes means every box gets nothing.",
          "Woh theek hai. 0 guna 5 barabar 0, isliye 0 bhaag 5 barabar 0. Zero laddoo 5 dabbon mein baanto, toh har dabbe ko kuch nahi milta."),
        L("Dadi", "Even Brahmagupta thought 0 divided by 0 was 0. Today we know that is also not defined, because every number times 0 gives 0.",
          "Brahmagupta ne bhi socha tha ki 0 bhaag 0 barabar 0 hai. Aaj hum jaante hain ki yeh bhi defined nahi hai, kyonki har number guna 0 barabar 0 hota hai."),
    ], {"mode": "divzero", "a": 0, "b": 5}),
    scene([
        L("Neha", "Your turn. Use the machine and find a subtraction of two whole numbers whose answer falls outside the family.",
          "Ab aapki baari. Machine se do whole numbers ka aisa subtraction dhoondho jiska jawaab parivaar se bahar gire."),
    ], {"mode": "closure", "op": "sub", "a": 8, "b": 3, "task": "sub"}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "On Wednesday, a big wedding order arrives. Mummy fills tray after tray with laddoos.",
          "Budhvaar ko shaadi ka ek bada order aata hai. Mummy ek ke baad ek tray laddoo se bharti hain."),
        L("Neha", "This tray has 3 rows of 5 laddoos. Disha, count them.", "Is tray mein 5 laddoo ki 3 rows hain. Disha, gino."),
        L("Disha", "5, 10, 15. Fifteen laddoos!", "5, 10, 15. Pandrah laddoo!"),
    ], {"mode": "commute", "r": 3, "c": 5, "turned": False}),
    scene([
        L("Harsh", "I will turn the tray around. Now it shows 5 rows of 3!", "Main tray ghuma deta hoon. Ab isme 3 ki 5 rows hain!"),
        L("Dadi", "Did any laddoo jump out? No! So 3 times 5 equals 5 times 3.",
          "Kya koi laddoo bahar kooda? Nahi! Isliye 3 guna 5 barabar 5 guna 3."),
        L("Dadi", "Changing the order does not change the product. Multiplication is commutative.",
          "Order badalne se product nahi badalta. Multiplication commutative hai."),
    ], {"mode": "commute", "r": 3, "c": 5, "turned": True}),
    scene([
        L("Harsh", "Addition is the same. I scored 4 runs and then 6 runs, or 6 and then 4. Either way, 10 runs!",
          "Addition mein bhi aisa hi hai. Maine pehle 4 aur phir 6 runs banaaye, ya pehle 6 phir 4. Dono taraf, 10 runs!"),
        L("Dadi", "Yes. 4 plus 6 equals 6 plus 4. Addition is commutative too.", "Haan. 4 plus 6 barabar 6 plus 4. Addition bhi commutative hai."),
    ], {"mode": "add", "a": 4, "b": 6, "swapped": True}),
    scene([
        L("Disha", "Does subtraction work both ways? 7 minus 3 is 4. But 3 minus 7?", "Kya subtraction dono taraf chalta hai? 7 minus 3 barabar 4. Lekin 3 minus 7?"),
        L("Dadi", "3 minus 7 has no whole number answer. So subtraction is not commutative. Division is not either: 12 divided by 3 is 4, but 3 divided by 12 is not even a whole number.",
          "3 minus 7 ka koi whole number jawaab nahi. Isliye subtraction commutative nahi hai. Division bhi nahi: 12 bhaag 3 barabar 4, lekin 3 bhaag 12 toh whole number bhi nahi hai."),
    ], {"mode": "notcommute", "op": "sub", "a": 7, "b": 3}),
    scene([
        L("Neha", "Now I pack the laddoos into gift boxes. Each box holds 2 rows of 3, that is 6 laddoos, and I fill 4 boxes. 6 times 4 is 24.",
          "Ab main laddoo gift box mein pack karti hoon. Har box mein 3 ki 2 rows, yaani 6 laddoo, aur main 4 box bharti hoon. 6 guna 4 barabar 24."),
        L("Dadi", "We wrote that as 2 times 3, in brackets, times 4.", "Ise humne likha bracket mein 2 guna 3, phir guna 4."),
    ], {"mode": "assoc", "grouping": "left"}),
    scene([
        L("Deepak", "At the railway goods shed we would pack them differently: 2 big cartons, each with 3 rows of 4. 2 times 12 is still 24!",
          "Railway goods shed mein hum inhe alag tarah pack karte: 2 bade carton, har ek mein 4 ki 3 rows. 2 guna 12 bhi 24 hi hai!"),
        L("Dadi", "So 2 times 3, then times 4, equals 2 times the product of 3 and 4. How you group does not change the answer. Multiplication is associative, and so is addition.",
          "Toh 2 guna 3, phir guna 4, barabar 2 guna, 3 aur 4 ka product. Kaise group karte ho, isse jawaab nahi badalta. Multiplication associative hai, aur addition bhi."),
    ], {"mode": "assoc", "grouping": "right"}),
    scene([
        L("Dadi", "These two properties are a superpower for mental maths. To find 4 times 37 times 25, first do 4 times 25, which is 100. Then 100 times 37 is 3,700!",
          "Yeh do properties mental maths ki superpower hain. 4 guna 37 guna 25 nikaalne ke liye, pehle 4 guna 25 karo, yaani 100. Phir 100 guna 37 barabar 3,700!"),
        L("Harsh", "And 13 plus 25 plus 75: first 25 plus 75 is 100, then plus 13 is 113. Easy!", "Aur 13 plus 25 plus 75: pehle 25 plus 75 barabar 100, phir plus 13 barabar 113. Aasaan!"),
    ], {"mode": "assoc", "grouping": "right"}),
    scene([
        L("Neha", "Your turn. This tray has 4 rows of 6 laddoos. Turn it so it shows 6 rows of 4, and check that the total stays the same.",
          "Ab aapki baari. Is tray mein 6 laddoo ki 4 rows hain. Ise ghumaao taaki 4 ki 6 rows dikhen, aur check karo ki total wahi rehta hai."),
    ], {"mode": "commute", "r": 4, "c": 6, "turned": False, "task": "turn"}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "On Thursday, the wedding family orders 6 boxes with 14 laddoos in each. Mummy needs the total, fast.",
          "Guruvaar ko shaadi wala parivaar 6 box order karta hai, har box mein 14 laddoo. Mummy ko total chahiye, jaldi."),
        L("Neha", "6 times 14. That is not in my times tables!", "6 guna 14. Yeh toh mere pahaade mein nahi hai!"),
    ], {"mode": "split", "a": 6, "b": 14, "cut": 14, "apart": False}),
    scene([
        L("Dadi", "Picture the laddoos as a rectangle with 6 rows and 14 columns. Now cut it after 10 columns. 14 is 10 plus 4.",
          "Laddoo ko ek rectangle socho, 6 rows aur 14 columns. Ab ise 10 columns ke baad kaato. 14 barabar 10 plus 4."),
        L("Disha", "The big piece is 6 times 10, which is 60. The small piece is 6 times 4, which is 24. Together, 84!",
          "Bada tukda 6 guna 10, yaani 60. Chhota tukda 6 guna 4, yaani 24. Milaakar 84!"),
    ], {"mode": "split", "a": 6, "b": 14, "cut": 10, "apart": True}),
    scene([
        L("Dadi", "This is the distributive property. 6 times the sum of 10 and 4 equals 6 times 10 plus 6 times 4. Multiplication spreads over addition.",
          "Yeh distributive property hai. 6 guna, 10 aur 4 ka jod, barabar 6 guna 10 plus 6 guna 4. Multiplication addition par fail jaata hai."),
        L("Harsh", "So I can cut anywhere, and the two pieces always add up to the whole rectangle!", "Matlab main kahin bhi kaat sakta hoon, aur dono tukde milkar hamesha poora rectangle banaate hain!"),
    ], {"mode": "split", "a": 6, "b": 14, "cut": 7, "apart": True}),
    scene([
        L("Deepak", "I use this at work every day. A ticket costs 98 rupees, and a group buys 25. 98 is 100 minus 2.",
          "Main kaam par roz yeh use karta hoon. Ek ticket 98 rupaye ka hai, aur ek group 25 ticket kharidta hai. 98 barabar 100 minus 2."),
        L("Deepak", "So 98 times 25 is 100 times 25, which is 2,500, minus 2 times 25, which is 50. The answer is 2,450 rupees.",
          "Toh 98 guna 25 barabar 100 guna 25, yaani 2,500, minus 2 guna 25, yaani 50. Jawaab hai 2,450 rupaye."),
    ], {"mode": "mental", "a": 98, "b": 25}),
    scene([
        L("Disha", "And 102 times 25 would be 2,500 plus 50, which is 2,550!", "Aur 102 guna 25 hoga 2,500 plus 50, yaani 2,550!"),
        L("Dadi", "Shabash! The distributive property works with subtraction too.", "Shabash! Distributive property subtraction ke saath bhi kaam karti hai."),
    ], {"mode": "mental", "a": 102, "b": 25}),
    scene([
        L("Dadi", "Now two very special numbers. Add 0 to any number, and nothing changes.",
          "Ab do bahut khaas numbers. Kisi bhi number mein 0 jodo, kuch nahi badalta."),
        L("Disha", "7 plus 0 is still 7. The empty basket adds nothing!", "7 plus 0 abhi bhi 7 hai. Khaali tokri kuch nahi jodti!"),
        L("Dadi", "So 0 is called the additive identity.", "Isliye 0 ko additive identity kehte hain."),
    ], {"mode": "identity", "kind": "add0", "n": 7}),
    scene([
        L("Neha", "One row of 7 laddoos is just 7 laddoos. 7 times 1 is 7.", "7 laddoo ki ek row bas 7 laddoo hai. 7 guna 1 barabar 7."),
        L("Dadi", "Multiplying by 1 changes nothing, so 1 is the multiplicative identity.", "1 se guna karne par kuch nahi badalta, isliye 1 multiplicative identity hai."),
    ], {"mode": "identity", "kind": "mul1", "n": 7}),
    scene([
        L("Harsh", "And 7 times 0? Zero rows of laddoos. The tray is empty!", "Aur 7 guna 0? Laddoo ki zero rows. Tray khaali hai!"),
        L("Dadi", "Right. Any whole number times 0 is 0. Brahmagupta wrote this rule too, more than 1,300 years ago.",
          "Sahi. Koi bhi whole number guna 0 barabar 0. Yeh niyam bhi Brahmagupta ne 1,300 se zyaada saal pehle likha tha."),
    ], {"mode": "identity", "kind": "mul0", "n": 7}),
    scene([
        L("Neha", "Your turn. Another order: 8 boxes of 13 laddoos. Drag the pink cut line to split 13 into 10 and 3.",
          "Ab aapki baari. Ek aur order: 13 laddoo ke 8 box. Gulaabi cut line ko drag karke 13 ko 10 aur 3 mein todo."),
    ], {"mode": "split", "a": 8, "b": 13, "cut": 13, "apart": False, "task": 10}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "On Saturday, Dadi draws a dot rangoli on the floor, and the children help her place the dots.",
          "Shanivaar ko Dadi zameen par bindiyon wali rangoli banaati hain, aur bachche bindiyaan lagaane mein madad karte hain."),
        L("Dadi", "Every number can be shown as dots. Here are 6 dots in a line. Every number can make a line.",
          "Har number ko bindiyon se dikhaaya ja sakta hai. Yeh rahi ek line mein 6 bindiyaan. Har number line bana sakta hai."),
    ], {"mode": "dots", "n": 6, "shape": "line"}),
    scene([
        L("Disha", "6 dots can also make a rectangle, 2 rows of 3!", "6 bindiyaan rectangle bhi bana sakti hain, 3 ki 2 rows!"),
        L("Dadi", "Yes. A number that makes a rectangle can be written as a product, like 6 equals 2 times 3.", "Haan. Jo number rectangle banaata hai, use guna ke roop mein likh sakte hain, jaise 6 barabar 2 guna 3."),
    ], {"mode": "dots", "n": 6, "shape": "rect"}),
    scene([
        L("Harsh", "9 dots make a perfect square, 3 rows of 3!", "9 bindiyaan ekdum square banaati hain, 3 ki 3 rows!"),
        L("Dadi", "Numbers like 1, 4, 9, 16 and 25 make squares. We call them square numbers.", "1, 4, 9, 16 aur 25 jaise numbers square banaate hain. Inhe square numbers kehte hain."),
    ], {"mode": "dots", "n": 9, "shape": "square"}),
    scene([
        L("Disha", "And 10 dots make a triangle, like bowling pins! 1, then 2, then 3, then 4.", "Aur 10 bindiyaan triangle banaati hain, bowling pins ki tarah! 1, phir 2, phir 3, phir 4."),
        L("Dadi", "Numbers like 1, 3, 6, 10 and 15 are triangular numbers. Each one adds the next counting number.",
          "1, 3, 6, 10 aur 15 jaise numbers triangular numbers hain. Har ek mein agla ginti ka number judta hai."),
    ], {"mode": "dots", "n": 10, "shape": "triangle"}),
    scene([
        L("Harsh", "I tried 7 dots. No rectangle, no square, no triangle. Just a boring line!", "Maine 7 bindiyaan try ki. Na rectangle, na square, na triangle. Bas ek boring line!"),
        L("Dadi", "Not boring at all! Numbers greater than 1 that can only make a line are very special.",
          "Bilkul boring nahi! 1 se bade jo numbers sirf line bana sakte hain, woh bahut khaas hain."),
        L("Dadi", "They are prime numbers: 2, 3, 5, 7, 11, 13 and more. You will meet them properly in the next chapter.",
          "Woh prime numbers hain: 2, 3, 5, 7, 11, 13 aur aage. Agle chapter mein inse theek se milenge."),
    ], {"mode": "dots", "n": 7, "shape": "rect"}),
    scene([
        L("Deepak", "Here is a pattern I love. To add 99, add 100 and take away 1. So 437 plus 99 is 537 minus 1, which is 536.",
          "Yeh pattern mujhe bahut pasand hai. 99 jodne ke liye, 100 jodo aur 1 ghataao. Toh 437 plus 99 barabar 537 minus 1, yaani 536."),
    ], {"mode": "shortcut", "kind": "add", "a": 437, "k": 99}),
    scene([
        L("Neha", "It works for multiplying too. 84 times 99 is 84 times 100, which is 8,400, minus one 84. That gives 8,316.",
          "Guna mein bhi chalta hai. 84 guna 99 barabar 84 guna 100, yaani 8,400, minus ek 84. Jawaab 8,316."),
        L("Dadi", "That is the distributive property again: 84 times 99 equals 84 times 100 minus 84 times 1.",
          "Yeh phir se distributive property hai: 84 guna 99 barabar 84 guna 100 minus 84 guna 1."),
    ], {"mode": "shortcut", "kind": "mul", "a": 84, "k": 99}),
    scene([
        L("Disha", "So 84 times 9 is 840 minus 84, which is 756!", "Toh 84 guna 9 barabar 840 minus 84, yaani 756!"),
        L("Dadi", "Shabash! Patterns turn hard sums into easy ones.", "Shabash! Patterns mushkil sawaalon ko aasaan bana dete hain."),
    ], {"mode": "shortcut", "kind": "mul", "a": 84, "k": 9}),
    scene([
        L("Dadi", "Your turn. Find a number between 10 and 30 whose dots can only make a line, with no rectangle at all.",
          "Ab aapki baari. 10 aur 30 ke beech aisa number dhoondho jiski bindiyaan sirf line bana sakein, koi rectangle nahi."),
    ], {"mode": "dots", "n": 12, "shape": "rect", "task": "prime"}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "On Sunday evening, Dadi sets a quiz at the dining table.", "Itvaar ki shaam, Dadi dining table par ek quiz rakhti hain."),
        L("Dadi", "Question 1. How many whole numbers are there between 32 and 53?", "Sawaal 1. 32 aur 53 ke beech kitne whole numbers hain?"),
    ], {"example": 0, "step": 0}),
    scene([
        L("Harsh", "53 minus 32 is 21. So 21!", "53 minus 32 barabar 21. Toh 21!"),
        L("Disha", "Careful, Harsh. Between means we do not count 32 or 53. The numbers are 33 up to 52, and that is 21 minus 1, which is 20.",
          "Dhyaan se, Harsh. Beech mein ka matlab hai 32 aur 53 ko nahi ginna. Numbers 33 se 52 tak hain, yaani 21 minus 1, barabar 20."),
    ], {"example": 0, "step": 4}),
    scene([
        L("Dadi", "Question 2. Find 4 times 166 times 25 in your head.", "Sawaal 2. 4 guna 166 guna 25 dimaag mein nikaalo."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Disha", "Rearrange it! 4 times 25 is 100, and 100 times 166 is 16,600.", "Kram badlo! 4 guna 25 barabar 100, aur 100 guna 166 barabar 16,600."),
        L("Dadi", "Perfect. Commutative and associative properties working together.", "Ekdum sahi. Commutative aur associative properties saath mein kaam kar rahi hain."),
    ], {"example": 1, "step": 4}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _number_line_svg():
    """Number line 0..12 with 4 equal jumps of 3 (for 4 × 3)."""
    x = lambda n: 20 + n * 25
    parts = ['<svg viewBox="0 0 340 110" width="340" height="110" xmlns="http://www.w3.org/2000/svg">',
             '<line x1="10" y1="80" x2="330" y2="80" stroke="#e2e8f0" stroke-width="2"/>']
    for n in range(13):
        parts.append(f'<line x1="{x(n)}" y1="74" x2="{x(n)}" y2="86" stroke="#94a3b8" stroke-width="1.5"/>')
        parts.append(f'<text x="{x(n)}" y="102" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="monospace">{n}</text>')
    for k in range(4):
        a, b = x(3 * k), x(3 * k + 3)
        parts.append(f'<path d="M {a} 76 Q {(a + b) / 2} 26 {b} 76" fill="none" stroke="#38bdf8" stroke-width="2.5"/>')
        parts.append(f'<text x="{(a + b) / 2}" y="44" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold" font-family="monospace">+3</text>')
    parts.append(f'<circle cx="{x(12)}" cy="80" r="6" fill="none" stroke="#34d399" stroke-width="2.5"/>')
    parts.append('</svg>')
    return "".join(parts)


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Papa's Railway · Whole Numbers and the Number Line",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On a cold Sunday, Papa lays a toy railway track across the courtyard with a kilometre stone at every step. Harsh drives the train, Disha asks where it starts, and Dadi brings in the most important number of all: zero.</div>

<h2>Natural numbers and whole numbers</h2>
<div {CARD}>
  <div><strong class="text-sky-300">Natural numbers</strong>: the counting numbers 1, 2, 3, 4, … (they never end).</div>
  <div><strong class="text-amber-300">Whole numbers</strong>: the natural numbers together with 0, that is 0, 1, 2, 3, 4, …</div>
  <div>Every natural number is a whole number. 0 is a whole number but <em>not</em> a natural number.</div>
</div>
<p><strong>History:</strong> the Indian mathematician <strong>Brahmagupta</strong> wrote rules for calculating with zero in his book <em>Brahmasphutasiddhanta</em> in 628 CE, for example "a number plus zero is the number" and "a number times zero is zero".</p>

<h2>Successor and predecessor</h2>
<div {FORMULA}>successor of n = n + 1   ·   predecessor of n = n − 1</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Number</th><th>Predecessor</th><th>Successor</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>5</td><td class="text-center">4</td><td class="text-center">6</td></tr>
    <tr><td>99</td><td class="text-center">98</td><td class="text-center">100</td></tr>
    <tr><td>1,000</td><td class="text-center">999</td><td class="text-center">1,001</td></tr>
    <tr><td>0</td><td class="text-center">none (among whole numbers)</td><td class="text-center">1</td></tr>
  </tbody>
</table>
<ul>
  <li><strong>0 is the smallest whole number.</strong> It has no whole-number predecessor.</li>
  <li><strong>There is no largest whole number</strong>, because every whole number has a successor.</li>
</ul>

<h2>The number line</h2>
<p>Draw a line, mark 0, then mark 1, 2, 3, … at equal distances to the right. That is the <strong>number line</strong>. Of two numbers, the one further to the <strong>right is greater</strong>: 8 &gt; 3 because 8 is to the right of 3.</p>
""",
        "keyInsight": "Whole numbers are 0, 1, 2, 3, …: the natural numbers plus zero. On the number line, the number to the right is always bigger.",
        "widgetType": "Class6WholeNumberLineWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Which of these is a whole number but NOT a natural number?",
            "options": ["1", "0", "10", "100"],
            "correctIndex": 1,
            "explanation": "Natural numbers start at 1. Whole numbers include 0 as well, so 0 is whole but not natural.",
        },
        "teacherNotes": teacher(
            [
                "Start from counting objects (natural numbers), then ask 'how many elephants are in this classroom?' to motivate 0.",
                "Use a floor number line made with tape: students physically step forward (successor) and back (predecessor).",
                "Stress the two big facts: 0 is the smallest whole number, and there is no largest.",
            ],
            [
                "Saying 0 is a natural number.",
                "Thinking the predecessor of 0 is 0, or −1 (negative numbers are not whole numbers).",
                "Adding 1 to the wrong digit, for example writing the successor of 1,099 as 1,0910 instead of 1,100.",
            ],
            "Human number line: give 11 students cards 0 to 10. Call out 'successor of 6', 'predecessor of 3', 'which is bigger, 4 or 9?' and the right card-holder steps forward.",
            "Old NCERT Ch. 2 Whole Numbers (2.1 Introduction, 2.2 Whole Numbers, 2.3 The Number Line); Ganita Prakash ideas on zero.",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Train Trips · Operations on the Number Line",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Papa plans trips for the toy train. Every trip is a jump along the number line, and the children discover that +, −, × and ÷ are all just different kinds of jumps.</div>

<h2>Four operations as jumps</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Operation</th><th class="text-left">On the number line</th><th class="text-left">Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Addition</td><td>Start at the first number, jump <strong>right</strong></td><td>3 + 4: from 3, 4 jumps right → 7</td></tr>
    <tr><td>Subtraction</td><td>Start at the first number, jump <strong>left</strong></td><td>9 − 4: from 9, 4 jumps left → 5</td></tr>
    <tr><td>Multiplication</td><td><strong>Equal jumps starting from 0</strong></td><td>3 × 4: 3 jumps of 4 → 12</td></tr>
    <tr><td>Division</td><td>Equal jumps <strong>back to 0</strong>; count them</td><td>12 ÷ 3: 12 → 9 → 6 → 3 → 0, 4 jumps</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div><strong class="text-red-300">Watch out:</strong> 3 − 5 cannot be shown. After 3 jumps left we reach 0, and there is no whole number to the left of 0.</div>
  <div>If equal jumps back do not land exactly on 0 (for example 17 ÷ 5: three jumps, 2 left over), the division leaves a remainder.</div>
</div>
""",
        "keyInsight": "Add = jump right, subtract = jump left, multiply = equal jumps from 0, divide = count equal jumps back to 0.",
        "widgetType": "Class6NumberLineJumpsWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "On the number line, 4 equal jumps of 5 starting from 0 show…",
            "options": ["4 + 5 = 9", "5 − 4 = 1", "4 × 5 = 20", "20 ÷ 4 = 5"],
            "correctIndex": 2,
            "explanation": "Equal jumps starting from 0 show multiplication: 4 jumps of 5 land on 20, so 4 × 5 = 20.",
        },
        "teacherNotes": teacher(
            [
                "Draw jumps as arcs above the line and say the direction aloud: 'add, go right; subtract, go left'.",
                "Link multiplication to repeated addition: 3 × 4 = 4 + 4 + 4, which is exactly three jumps of 4.",
                "Show division as the reverse of multiplication: jump back in equal steps and count the jumps.",
            ],
            [
                "Starting multiplication jumps from the first number instead of from 0.",
                "Counting the tick marks instead of the jumps (getting 3 + 4 = 8).",
                "Thinking 3 − 5 = 2 because 'the bigger minus the smaller'.",
            ],
            "Frog hops: draw a 0–20 line on the floor. One student is the frog; the class calls out '2 + 6', '15 − 7', '3 × 5', '18 ÷ 6' and the frog hops while others record the arcs on paper.",
            "Old NCERT Ch. 2 (2.3 Addition, subtraction and multiplication on the number line).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Mummy's Bakery · Closure and Dividing by Zero",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Mummy's bakery is full of orders. Dadi builds a "family test" machine: put two whole numbers in, and see whether the answer stays in the whole number family. Then Disha asks the question that has puzzled people for centuries: what is 5 divided by 0?</div>

<h2>Closure property</h2>
<p>A set of numbers is <strong>closed</strong> under an operation if doing that operation on any two numbers of the set always gives a number of the same set.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Operation</th><th class="text-left">Closed for whole numbers?</th><th class="text-left">Why</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Addition</td><td class="text-emerald-300">Yes</td><td>5 + 7 = 12, always a whole number</td></tr>
    <tr><td>Multiplication</td><td class="text-emerald-300">Yes</td><td>6 × 4 = 24, always a whole number</td></tr>
    <tr><td>Subtraction</td><td class="text-red-300">No</td><td>4 − 9 is not a whole number</td></tr>
    <tr><td>Division</td><td class="text-red-300">No</td><td>7 ÷ 2 = 3½ is not a whole number</td></tr>
  </tbody>
</table>
<p>To show something is <em>not</em> closed, <strong>one counterexample is enough</strong>.</p>

<h2>Division by zero is not defined</h2>
<div {CARD}>
  <div>Division undoes multiplication: 12 ÷ 3 = 4 because 4 × 3 = 12.</div>
  <div>So 5 ÷ 0 would need a number that gives 5 when multiplied by 0.</div>
  <div>But <strong>every</strong> number × 0 = 0 (1 × 0 = 0, 100 × 0 = 0, 1,000 × 0 = 0). We never get 5.</div>
  <div class="text-red-300 font-bold">No number works, so division by 0 is not defined.</div>
</div>
<div {FORMULA}>a × 0 = 0   ·   0 ÷ a = 0 (a ≠ 0)   ·   a ÷ 0 is not defined</div>
<p><strong>History:</strong> Brahmagupta (628 CE) knew that a number times zero is zero, but he believed 0 ÷ 0 = 0. That is wrong: since every number × 0 = 0, no single answer can be chosen, so 0 ÷ 0 is not defined either.</p>
""",
        "keyInsight": "Whole numbers are closed under + and ×, but not under − and ÷. Division by zero is not defined, because no number times 0 gives a non-zero number.",
        "widgetType": "Class6ClosureLabWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "Which of these is NOT defined?",
            "options": ["0 ÷ 8", "8 × 0", "8 ÷ 0", "0 + 8"],
            "correctIndex": 2,
            "explanation": "8 ÷ 0 would need a number that gives 8 when multiplied by 0, but every number times 0 is 0. So 8 ÷ 0 is not defined. (0 ÷ 8 = 0 is fine.)",
        },
        "teacherNotes": teacher(
            [
                "Let students try to 'break' addition and multiplication with many examples, then break subtraction and division with just one example each.",
                "Teach division by zero through the multiplication check: 'a ÷ b = c means c × b = a'. Students then discover why 5 ÷ 0 fails.",
                "Contrast 0 ÷ 5 (fine, equals 0) with 5 ÷ 0 (not defined) side by side.",
            ],
            [
                "Saying 5 ÷ 0 = 0 or 5 ÷ 0 = 5.",
                "Saying 5 ÷ 0 = 'infinity'. At this level the correct answer is 'not defined'.",
                "Thinking that a few examples prove closure, or that closure can be disproved without a counterexample.",
            ],
            "Closure detectives: groups get the four operation cards and must find a counterexample for each one that is not closed. The first group to justify 'division by zero is not defined' using multiplication wins.",
            "Old NCERT Ch. 2 (2.5 Properties of whole numbers: closure, division by zero); Ganita Prakash zero rules of Brahmagupta.",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Laddoo Trays · Commutative and Associative Properties",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>A big wedding order arrives. Mummy fills trays with laddoos, Harsh keeps turning the trays around, and Papa packs them the railway way. The laddoo count never changes, and that is the whole point.</div>

<h2>Commutative property (order does not matter)</h2>
<div {FORMULA}>a + b = b + a   ·   a × b = b × a</div>
<p><strong>See it:</strong> a tray of 3 rows of 5 laddoos, turned a quarter turn, becomes 5 rows of 3. No laddoo moves out, so 3 × 5 = 5 × 3 = 15.</p>
<div {CARD}>
  <div class="text-red-300"><strong>Not commutative:</strong> subtraction and division.</div>
  <div>7 − 3 = 4, but 3 − 7 is not a whole number.</div>
  <div>12 ÷ 3 = 4, but 3 ÷ 12 is not a whole number.</div>
</div>

<h2>Associative property (grouping does not matter)</h2>
<div {FORMULA}>(a + b) + c = a + (b + c)   ·   (a × b) × c = a × (b × c)</div>
<p><strong>See it:</strong> 24 laddoos packed as 4 boxes of (2 × 3) or as 2 boxes of (3 × 4): (2 × 3) × 4 = 6 × 4 = 24 and 2 × (3 × 4) = 2 × 12 = 24.</p>

<h2>Use them for mental maths</h2>
<table class="w-full text-xs md:text-sm my-3">
  <tbody class="text-slate-300">
    <tr><td>4 × 37 × 25</td><td>= 37 × (4 × 25) = 37 × 100 = <strong>3,700</strong></td></tr>
    <tr><td>13 + 25 + 75</td><td>= 13 + (25 + 75) = 13 + 100 = <strong>113</strong></td></tr>
    <tr><td>8 × 1,769 × 125</td><td>= 1,769 × (8 × 125) = 1,769 × 1,000 = <strong>17,69,000</strong></td></tr>
  </tbody>
</table>
""",
        "keyInsight": "For + and ×, you may change the order (commutative) and the grouping (associative). Look for pairs that make 10, 100 or 1,000.",
        "widgetType": "Class6ArrayPropertiesWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Which statement shows the associative property of multiplication?",
            "options": ["3 × 5 = 5 × 3", "(2 × 3) × 4 = 2 × (3 × 4)", "6 × 1 = 6", "7 × (2 + 3) = 7 × 2 + 7 × 3"],
            "correctIndex": 1,
            "explanation": "Only the grouping (the brackets) changes, so it is the associative property.",
        },
        "teacherNotes": teacher(
            [
                "Use a real tray or a grid of counters and physically rotate it. The visual proof of 3 × 5 = 5 × 3 is very convincing.",
                "Name the property by what changes: order changes → commutative; brackets change → associative.",
                "Practise 'friendly pairs' (2 × 5, 4 × 25, 8 × 125) for fast mental multiplication.",
            ],
            [
                "Assuming subtraction and division are also commutative.",
                "Mixing up commutative (order) and associative (grouping).",
                "Trying to regroup a mix of + and × (that needs the distributive property, next story).",
            ],
            "Tray turning: pairs make arrays of bindis on squared paper, cut them out, rotate them and write both multiplication facts. Then challenge: compute 25 × 7 × 4 the smart way.",
            "Old NCERT Ch. 2 (2.5 Commutativity and associativity of addition and multiplication).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: The Big Order · Distributive Property and Identities",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>The wedding family orders 6 boxes of 14 laddoos. 6 × 14 is not in Mummy's tables, so Dadi cuts the problem into easy pieces. Papa shows how railway ticket counters do the same trick.</div>

<h2>Distributive property (multiplication spreads over addition)</h2>
<div {FORMULA}>a × (b + c) = a × b + a × c   ·   a × (b − c) = a × b − a × c</div>
<p><strong>See it:</strong> a rectangle of 6 rows and 14 columns, cut after 10 columns, becomes a 6 × 10 piece and a 6 × 4 piece.</p>
<div {CARD}>
  <div>6 × 14 = 6 × (10 + 4) = 6 × 10 + 6 × 4 = 60 + 24 = <strong class="text-emerald-300">84</strong></div>
  <div>98 × 25 = (100 − 2) × 25 = 2,500 − 50 = <strong class="text-emerald-300">2,450</strong></div>
  <div>102 × 25 = (100 + 2) × 25 = 2,500 + 50 = <strong class="text-emerald-300">2,550</strong></div>
  <div>8 × 13 = 8 × 10 + 8 × 3 = 80 + 24 = <strong class="text-emerald-300">104</strong></div>
</div>

<h2>Identities and multiplying by zero</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Rule</th><th class="text-left">Name</th><th class="text-left">Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>a + 0 = a</td><td>0 is the <strong>additive identity</strong></td><td>7 + 0 = 7</td></tr>
    <tr><td>a × 1 = a</td><td>1 is the <strong>multiplicative identity</strong></td><td>7 × 1 = 7</td></tr>
    <tr><td>a × 0 = 0</td><td>multiplying by zero</td><td>7 × 0 = 0</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "Split a hard multiplication into easy pieces: a × (b + c) = a × b + a × c. Adding 0 or multiplying by 1 changes nothing; multiplying by 0 gives 0.",
        "widgetType": "Class6AreaModelWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "Using the distributive property, 47 × 101 = ?",
            "options": ["4,707", "4,747", "4,800", "4,847"],
            "correctIndex": 1,
            "explanation": "47 × 101 = 47 × 100 + 47 × 1 = 4,700 + 47 = 4,747.",
        },
        "teacherNotes": teacher(
            [
                "Draw the rectangle every time at first; the cut makes the two products visible before the symbols do.",
                "Encourage splitting at a round number (10, 100) for mental maths.",
                "Use the 'empty basket' (add 0) and 'one row' (× 1) pictures to make identities concrete.",
            ],
            [
                "Multiplying only the first part: 6 × (10 + 4) = 60 + 4.",
                "Confusing the identities: thinking 0 is the identity for multiplication.",
                "Writing 7 × 0 = 7 (mixing up with 7 + 0 = 7).",
            ],
            "Cut and count: each student draws a 7 × 16 rectangle on squared paper, cuts it into two rectangles in any way, and writes the distributive statement. Compare: every cut gives 112.",
            "Old NCERT Ch. 2 (2.5 Distributivity of multiplication over addition, identities for addition and multiplication).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Dadi's Dot Rangoli · Patterns in Whole Numbers",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Dadi draws a dot rangoli. Every number of dots can be arranged in some shapes and not in others, and the numbers that refuse to make anything but a line turn out to be very special. Then Papa and Mummy share their favourite shortcut patterns.</div>

<h2>Numbers as dot shapes</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Shape</th><th class="text-left">Numbers</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Line</td><td>Every number</td></tr>
    <tr><td>Rectangle</td><td>4, 6, 8, 9, 10, 12, … (numbers that are a product of two smaller numbers)</td></tr>
    <tr><td>Square</td><td>1, 4, 9, 16, 25, … (square numbers)</td></tr>
    <tr><td>Triangle</td><td>1, 3, 6, 10, 15, … (triangular numbers: 1, 1 + 2, 1 + 2 + 3, …)</td></tr>
    <tr><td>Only a line</td><td>2, 3, 5, 7, 11, 13, … (<strong>prime numbers</strong>, met properly in the next chapter)</td></tr>
  </tbody>
</table>

<h2>Shortcut patterns with 9, 99, 999</h2>
<div {CARD}>
  <div>Adding 9, 99, 999: add 10, 100, 1,000 and subtract 1. <strong>437 + 99 = 537 − 1 = 536</strong></div>
  <div>Multiplying by 9, 99, 999: multiply by 10, 100, 1,000 and subtract the number once.</div>
  <div>84 × 9 = 840 − 84 = 756 · 84 × 99 = 8,400 − 84 = 8,316</div>
  <div>117 × 9 = 1,053 · 117 × 99 = 11,583 · 117 × 999 = 1,16,883</div>
</div>
<div {FORMULA}>a × 99 = a × 100 − a</div>

<h2>A pattern to continue</h2>
<table class="w-full text-xs md:text-sm my-3 font-mono">
  <tbody class="text-slate-300">
    <tr><td>1 × 8 + 1 = 9</td></tr>
    <tr><td>12 × 8 + 2 = 98</td></tr>
    <tr><td>123 × 8 + 3 = 987</td></tr>
    <tr><td>1234 × 8 + 4 = 9876</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "Dots reveal number shapes: squares, triangles, rectangles, and primes that can only be a line. Near-round numbers like 99 make shortcuts: a × 99 = a × 100 − a.",
        "widgetType": "Class6DotPatternsWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Which number of dots can make a square AND a triangle?",
            "options": ["9", "10", "36", "15"],
            "correctIndex": 2,
            "explanation": "36 = 6 × 6 (a square) and 36 = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 (a triangle). 9 is only square; 10 and 15 are only triangular.",
        },
        "teacherNotes": teacher(
            [
                "Give each student a handful of beans or bindis and let them physically try every shape for numbers 1 to 20.",
                "Record a class chart: line / rectangle / square / triangle for each number, then ask what the 'only line' numbers have in common.",
                "Explain shortcuts with the distributive property so they are understood, not memorised.",
            ],
            [
                "Calling 1 a prime because it makes only a line (1 is neither prime nor composite).",
                "Forgetting that a square is also a rectangle.",
                "For 437 + 99, adding 100 but forgetting to subtract 1.",
            ],
            "Bean shapes: groups get 1 to 30 beans, find all shapes for their number and stick them on a class chart. Then race: compute 56 × 99 and 365 + 999 using the shortcut.",
            "Old NCERT Ch. 2 (2.6 Patterns in whole numbers); Ganita Prakash number patterns; preview of Ch. 3 Playing with Numbers (primes).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>On Sunday evening, Dadi sets a quiz at the dining table. Harsh answers fast; Disha answers carefully.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Successor = n + 1, predecessor = n − 1; 0 is the smallest whole number.</li>
  <li>Number line: add right, subtract left, multiply = equal jumps from 0.</li>
  <li>Commutative and associative: reorder and regroup + and × freely.</li>
  <li>Distributive: a × (b ± c) = a × b ± a × c.</li>
  <li>a + 0 = a, a × 1 = a, a × 0 = 0, and a ÷ 0 is not defined.</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Before calculating, look for a property that makes the sum easy: friendly pairs, round numbers, or a split.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Counting whole numbers between two numbers",
                    "question": "How many whole numbers are there between 32 and 53?",
                    "steps": [
                        "'Between' means we do not count 32 or 53.",
                        "The numbers are 33, 34, …, 52.",
                        "From 32 to 53 there are 53 − 32 = 21 steps.",
                        "Leave out the end number 53: 21 − 1 = <strong>20</strong>",
                    ],
                    "answer": "20 whole numbers",
                },
                {
                    "title": "Friendly pairs",
                    "question": "Find 4 × 166 × 25 using a suitable rearrangement.",
                    "steps": [
                        "Spot the friendly pair: 4 × 25 = 100.",
                        "Rearrange (commutative): 4 × 25 × 166",
                        "Regroup (associative): (4 × 25) × 166 = 100 × 166",
                        "= <strong>16,600</strong>",
                    ],
                    "answer": "16,600",
                },
                {
                    "title": "Successor and predecessor",
                    "question": "Write the successor of 24,40,701 and the predecessor of 1,00,000.",
                    "steps": [
                        "Successor = number + 1: 24,40,701 + 1 = <strong>24,40,702</strong>",
                        "Predecessor = number − 1: 1,00,000 − 1 = <strong>99,999</strong>",
                    ],
                    "answer": "24,40,702 and 99,999",
                },
                {
                    "title": "Distributive property",
                    "question": "Find 854 × 102 using the distributive property.",
                    "steps": [
                        "102 = 100 + 2",
                        "854 × 102 = 854 × 100 + 854 × 2",
                        "= 85,400 + 1,708",
                        "= <strong>87,108</strong>",
                    ],
                    "answer": "87,108",
                },
                {
                    "title": "Rearranging a sum",
                    "question": "Find 1962 + 453 + 1538 + 647 by suitable rearrangement.",
                    "steps": [
                        "Pair numbers whose last digits add to 10: 1962 + 1538 and 453 + 647.",
                        "1962 + 1538 = 3500",
                        "453 + 647 = 1100",
                        "3500 + 1100 = <strong>4600</strong>",
                    ],
                    "answer": "4,600",
                },
                {
                    "title": "Multiplication on the number line",
                    "question": "Show 4 × 3 on the number line.",
                    "figureSvg": _number_line_svg(),
                    "steps": [
                        "Multiplication = equal jumps starting from 0.",
                        "Make 4 jumps, each of 3 units: 0 → 3 → 6 → 9 → 12.",
                        "We land on 12, so 4 × 3 = <strong>12</strong>",
                    ],
                    "answer": "12",
                },
                {
                    "title": "A world-record innings",
                    "question": "On 13 November 2014, Rohit Sharma scored 264 runs against Sri Lanka at Eden Gardens, Kolkata, with 33 fours and 9 sixes. How many runs came from boundaries, and how many from running?",
                    "steps": [
                        "Runs from fours: 33 × 4 = 132",
                        "Runs from sixes: 9 × 6 = 54",
                        "Boundary runs: 132 + 54 = <strong>186</strong>",
                        "Running: 264 − 186 = <strong>78</strong>",
                    ],
                    "answer": "186 runs from boundaries, 78 runs from running",
                },
                {
                    "title": "Multiplying by 999",
                    "question": "A school buys 999 notebooks at ₹45 each. Find the total cost mentally.",
                    "steps": [
                        "999 = 1000 − 1",
                        "45 × 999 = 45 × 1000 − 45 × 1",
                        "= 45,000 − 45",
                        "= <strong>₹44,955</strong>",
                    ],
                    "answer": "₹44,955",
                },
                {
                    "title": "Dot shapes",
                    "question": "Which of 9, 11, 15, 17 and 21 can be arranged only as a line of dots? Which can make a square, and which a triangle?",
                    "steps": [
                        "9 = 3 × 3, 15 = 3 × 5, 21 = 3 × 7 can make rectangles.",
                        "11 and 17 cannot be written as a product of two smaller numbers → <strong>only a line</strong> (they are prime).",
                        "Square: 9 = 3 × 3.",
                        "Triangle: 15 = 1 + 2 + 3 + 4 + 5 and 21 = 1 + 2 + 3 + 4 + 5 + 6.",
                    ],
                    "answer": "Only a line: 11 and 17. Square: 9. Triangle: 15 and 21.",
                },
                {
                    "title": "Continue the pattern",
                    "question": "Study the pattern: 1 × 8 + 1 = 9, 12 × 8 + 2 = 98, 123 × 8 + 3 = 987. Write the next two lines.",
                    "steps": [
                        "Each line adds the next digit to the first number and to the number added.",
                        "1234 × 8 = 9872, and 9872 + 4 = <strong>9876</strong>",
                        "12345 × 8 = 98760, and 98760 + 5 = <strong>98765</strong>",
                    ],
                    "answer": "1234 × 8 + 4 = 9876 and 12345 × 8 + 5 = 98765",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Before solving, ask 'which property makes this easy?' That single question unlocks most problems.",
                "Q1 is a classic trap: insist on listing a few numbers to see why we subtract 1.",
                "Q7 uses real cricket data; students enjoy checking it, and it practises × and − together.",
            ],
            [
                "Q1: answering 21 instead of 20.",
                "Q4: 854 × 102 = 85,400 + 2 (forgetting to multiply 854 by 2).",
                "Q8: subtracting 1 instead of 45 when using 999 = 1000 − 1.",
            ],
            "Pair-share: one student names the property to use, the other writes the steps; swap for the next question.",
            "Covers old NCERT Ch. 2 Exercises 2.1–2.3 patterns and Ganita Prakash calculation strategies.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Whole Numbers (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From Papa's railway to Dadi's dot rangoli, you have met the whole number family and its rules. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering whole numbers, the number line, closure, division by zero, properties, identities and patterns.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Most answers come from one picture: the number line, a turned tray, a split rectangle, or a dot shape.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Whole Numbers · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "The smallest whole number is:", "options": ["1", "0", "−1", "There is no smallest whole number"], "answer": 1, "explanation": "Whole numbers are 0, 1, 2, 3, …, so the smallest is 0.", "topic": "Whole numbers"},
                {"q": "The predecessor of 10,000 is:", "options": ["10,001", "9,000", "9,999", "1,000"], "answer": 2, "explanation": "Predecessor = number − 1 = 10,000 − 1 = 9,999.", "topic": "Successor and predecessor"},
                {"q": "On the number line, 7 − 3 is shown by:", "options": ["Starting at 3 and jumping 7 to the right", "Starting at 7 and jumping 3 to the left", "Starting at 0 and making 3 jumps of 7", "Starting at 7 and jumping 3 to the right"], "answer": 1, "explanation": "Subtraction means jumping to the left from the first number: 7 → 6 → 5 → 4.", "topic": "Number line"},
                {"q": "Whole numbers are NOT closed under:", "options": ["Addition", "Multiplication", "Subtraction", "None of these"], "answer": 2, "explanation": "4 − 9 is not a whole number, so whole numbers are not closed under subtraction.", "topic": "Closure"},
                {"q": "Which of these is NOT defined?", "options": ["0 ÷ 7", "7 × 0", "7 ÷ 0", "0 + 7"], "answer": 2, "explanation": "7 ÷ 0 would need a number that gives 7 when multiplied by 0, but every number × 0 = 0.", "topic": "Division by zero"},
                {"q": "3 × 5 = 5 × 3 is an example of the:", "options": ["Associative property", "Commutative property", "Distributive property", "Closure property"], "answer": 1, "explanation": "The order of the numbers changes, so it is the commutative property of multiplication.", "topic": "Commutative property"},
                {"q": "The multiplicative identity for whole numbers is:", "options": ["0", "1", "10", "There is none"], "answer": 1, "explanation": "a × 1 = a for every whole number a.", "topic": "Identities"},
                {"q": "Using the distributive property, 47 × 101 equals:", "options": ["4,747", "4,707", "4,847", "4,700"], "answer": 0, "explanation": "47 × 101 = 47 × 100 + 47 × 1 = 4,700 + 47 = 4,747.", "topic": "Distributive property"},
                {"q": "Which number of dots can be arranged ONLY as a line (no rectangle)?", "options": ["12", "15", "16", "13"], "answer": 3, "explanation": "12 = 3 × 4, 15 = 3 × 5, 16 = 4 × 4 make rectangles; 13 is prime, so it can only be a line.", "topic": "Patterns"},
                {"q": "365 + 999 = ?", "options": ["1,364", "1,365", "1,354", "1,264"], "answer": 0, "explanation": "365 + 999 = 365 + 1,000 − 1 = 1,365 − 1 = 1,364.", "topic": "Shortcut patterns"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q2 tests predecessor; Q5 catches 7 ÷ 0 = 0; Q8 and Q10 test shortcuts and the distributive property."],
            "Exit ticket: write one example each of closure failing, the commutative property, the distributive property and a prime shown as dots.",
            "Matches old NCERT Ch. 2 Whole Numbers learning outcomes and Ganita Prakash number sense goals.",
        ),
    },
]


def seed_class6_whole_numbers():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Whole Numbers")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Whole Numbers: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Whole Numbers: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_whole_numbers()
