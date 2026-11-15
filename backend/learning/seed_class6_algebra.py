import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Introduction to Algebra (old NCERT Ch. 11 "Algebra": matchstick patterns, the idea of a variable,
# more matchstick patterns, more examples of variables, rules from geometry and arithmetic, expressions with
# variables, using expressions practically, what is an equation, solving by trial and error).
# Story: the Jaipur family on a rainy afternoon with matchsticks, Dadi's chalkboard, Mummy's laddoo boxes,
# Papa's measuring tape, a market balance and Harsh's cricket match.
#
# Verified facts used:
# - Brahmagupta (Brahmasphutasiddhanta, 628 CE) called the unknown "yavat-tavat" and named further unknowns by
#   colours such as kalaka (black) and nilaka (blue), using the first syllable as the symbol.
#   (Cajori, "A History of Mathematics" (1893), p. 112 of the Wikisource scan; Sambodhi Vol. 23 (2000), Kansara;
#   Wikipedia "Brahmagupta".)


SCENES_1 = [
    scene([
        L("Narrator", "It is a rainy afternoon in Jaipur, and there is no cricket today. Dadi opens a box of unused matchsticks on the floor.",
          "Jaipur mein baarish waali dopahar hai, aaj cricket nahi hoga. Dadi zameen par bina jali tiliyon ka ek dabba kholti hain."),
        L("Harsh", "I will make the letter L. One stick standing and one lying down. Just 2 matchsticks!",
          "Main letter L banaata hoon. Ek tili khadi aur ek leti hui. Bas 2 tiliyan!"),
    ], {"mode": "letter", "letter": "L", "n": 1}),
    scene([
        L("Disha", "I will make a row of them. 2 L's need 4 sticks, and 3 L's need 6 sticks.",
          "Main inki ek line banaati hoon. 2 L ke liye 4 tiliyan, aur 3 L ke liye 6 tiliyan."),
        L("Dadi", "Let us write it in a table, beta. Look at the top row and the bottom row.",
          "Chalo ise ek table mein likhte hain, beta. Upar wali aur neeche wali row dekho."),
    ], {"mode": "letter", "letter": "L", "n": 3, "showTable": True}),
    scene([
        L("Harsh", "Every new L adds 2 more sticks. 4 L's need 8, and 5 L's need 10!",
          "Har naya L 2 tiliyan aur jodta hai. 4 L ke liye 8, aur 5 L ke liye 10!"),
        L("Dadi", "So the number of sticks is always 2 times the number of L's. That is a rule.",
          "Toh tiliyon ki ginti hamesha L ki ginti ka 2 guna hoti hai. Yeh ek rule hai."),
    ], {"mode": "letter", "letter": "L", "n": 5, "showTable": True}),
    scene([
        L("Disha", "But what if we make 100 L's? We cannot write a table that long!",
          "Lekin agar hum 100 L banaayein toh? Itni lambi table toh nahi likh sakte!"),
        L("Dadi", "So we use a letter. Let n stand for the number of L's. Then the rule is: sticks equal 2 times n.",
          "Isliye hum ek letter lete hain. Maan lo n matlab L ki ginti. Tab rule hai: tiliyan barabar 2 guna n."),
        L("Harsh", "For 100 L's, 2 times 100 is 200 sticks. That box will not be enough!",
          "100 L ke liye, 2 guna 100 barabar 200 tiliyan. Yeh dabba kaafi nahi hoga!"),
    ], {"mode": "letter", "letter": "L", "n": 6, "showTable": True, "showRule": True}),
    scene([
        L("Dadi", "n is called a variable, because its value can vary. It can be 1, 2, 10 or 100, and the same rule works every time.",
          "n ko variable kehte hain, kyonki iski value badal sakti hai. Yeh 1, 2, 10 ya 100 kuch bhi ho sakta hai, aur wahi rule har baar chalta hai."),
    ], {"mode": "letter", "letter": "L", "n": 8, "showRule": True}),
    scene([
        L("Disha", "Now I make the letter C. Each C needs 3 sticks, so the rule is 3 times n!",
          "Ab main letter C banaati hoon. Har C mein 3 tiliyan, toh rule hai 3 guna n!"),
    ], {"mode": "letter", "letter": "C", "n": 4, "showTable": True, "showRule": True}),
    scene([
        L("Harsh", "F needs 4 sticks and E needs 5. So F is 4 times n and E is 5 times n!",
          "F mein 4 tiliyan aur E mein 5. Toh F ke liye 4 guna n aur E ke liye 5 guna n!"),
        L("Dadi", "Shabash! And T needs only 2, so its rule is 2 times n, the same as L.",
          "Shabash! Aur T mein sirf 2 lagti hain, toh uska rule 2 guna n hai, L jaisa hi."),
    ], {"mode": "letter", "letter": "E", "n": 3, "showRule": True}),
    scene([
        L("Dadi", "Your turn! Make a row of letter C that uses exactly 18 matchsticks.",
          "Ab aapki baari! Letter C ki aisi line banaao jismein theek 18 tiliyan lagein."),
    ], {"mode": "letter", "letter": "C", "n": 1, "task": {"mode": "letter", "letter": "C", "sticks": 18}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "The next evening, Dadi lays matchsticks on her old chalkboard to make a row of squares.",
          "Agli shaam, Dadi apne purane chalkboard par tiliyon se squares ki ek line banaati hain."),
        L("Dadi", "One square needs 4 sticks. Now tell me, how many for 2 squares?",
          "Ek square mein 4 tiliyan lagti hain. Ab batao, 2 squares mein kitni?"),
    ], {"mode": "squares", "n": 1}),
    scene([
        L("Harsh", "4 plus 4 is 8. Easy!", "4 aur 4, 8. Aasaan!"),
        L("Disha", "No, Harsh, look! The squares share a side. 2 squares need only 7 sticks, and 3 squares need 10.",
          "Nahi Harsh, dekho! Squares ek side share karte hain. 2 squares mein sirf 7 tiliyan, aur 3 squares mein 10."),
    ], {"mode": "squares", "n": 3, "showTable": True}),
    scene([
        L("Dadi", "Look at the colours. One pink stick to start, then 3 yellow sticks for every square. So the rule is 3 times n plus 1.",
          "Rangon ko dekho. Shuru mein ek gulaabi tili, phir har square ke liye 3 peeli tiliyan. Toh rule hai 3 guna n plus 1."),
    ], {"mode": "squares", "n": 4, "showTable": True, "showRule": True}),
    scene([
        L("Harsh", "Let me test it with 10 squares. 3 times 10 is 30, plus 1 is 31. And the count is 31!",
          "Main 10 squares par test karta hoon. 3 guna 10 barabar 30, plus 1 barabar 31. Aur ginti bhi 31 hai!"),
    ], {"mode": "squares", "n": 10, "showRule": True}),
    scene([
        L("Deepak", "Railway bridges often use triangles because they are strong. A row of triangles joined like this needs one stick to start and 2 more for each triangle.",
          "Railway pulon mein aksar triangles lagte hain kyonki woh mazboot hote hain. Aise jude triangles ki line mein shuru mein ek tili aur har triangle ke liye 2 aur lagti hain."),
        L("Disha", "So the rule is 2 times n plus 1. For 5 triangles that is 11 sticks!",
          "Toh rule hai 2 guna n plus 1. 5 triangles ke liye 11 tiliyan!"),
    ], {"mode": "triangles", "n": 5, "showTable": True, "showRule": True}),
    scene([
        L("Dadi", "A variable is a letter whose value is not fixed. We use n, x, y, l, m and many others. Numbers like 2 and 3 never change, so they are called constants.",
          "Variable ek aisa letter hai jiski value fixed nahi hoti. Hum n, x, y, l, m jaise letters lete hain. 2 aur 3 jaise numbers kabhi nahi badalte, isliye unhe constants kehte hain."),
        L("Dadi", "In 628 C E, Brahmagupta called the unknown yaavat taavat, and named more unknowns after colours, like kaalaka for black and neelaka for blue.",
          "628 C E mein Brahmagupta ne anjaan number ko yaavat taavat kaha, aur baaki anjaan numbers ke naam rangon par rakhe, jaise kaale ke liye kaalaka aur neele ke liye neelaka."),
    ], {"mode": "triangles", "n": 7, "showRule": True}),
    scene([
        L("Neha", "Variables are in my bakery too. One tray holds 12 cupcakes, so t trays hold 12 times t cupcakes.",
          "Meri bakery mein bhi variables hain. Ek tray mein 12 cupcakes aate hain, toh t trays mein 12 guna t cupcakes."),
        L("Deepak", "And if each coach of my model train carries 8 toy passengers, then c coaches carry 8 times c.",
          "Aur agar mere model train ke har coach mein 8 khilauna yaatri hain, toh c coaches mein 8 guna c."),
    ], {"mode": "squares", "n": 6, "showRule": True}),
    scene([
        L("Dadi", "Your turn! Make a row of squares that uses exactly 22 matchsticks.",
          "Ab aapki baari! Squares ki aisi line banaao jismein theek 22 tiliyan lagein."),
    ], {"mode": "squares", "n": 2, "task": {"mode": "squares", "sticks": 22}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "On Saturday, Mummy is packing laddoos for her bakery orders. Every box holds the same number of laddoos, but the boxes are closed.",
          "Shanivaar ko Mummy bakery ke orders ke liye laddoo pack kar rahi hain. Har dabbe mein ek jitne laddoo hain, lekin dabbe band hain."),
        L("Neha", "I will not tell you how many are in a box. Call it n.", "Main nahi bataaungi ki ek dabbe mein kitne hain. Use n keh lo."),
    ], {"k": 1, "c": 0, "caption": "Each closed box holds n laddoos"}),
    scene([
        L("Neha", "A customer buys 3 boxes and 2 loose laddoos. How many laddoos is that?",
          "Ek customer 3 dabbe aur 2 khule laddoo leta hai. Kul kitne laddoo hue?"),
        L("Disha", "3 boxes have 3 times n, and 2 more makes 3 times n plus 2!", "3 dabbon mein 3 guna n, aur 2 aur milaakar 3 guna n plus 2!"),
    ], {"k": 3, "c": 2, "caption": "3 boxes and 2 loose laddoos"}),
    scene([
        L("Dadi", "3 n plus 2 is called an expression. 2 plus 3 times 5 is also an expression, but it has only numbers, so its value is fixed. An expression with a variable changes its value when the variable changes.",
          "3 n plus 2 ko expression kehte hain. 2 plus 3 guna 5 bhi expression hai, lekin usmein sirf numbers hain, isliye uski value fixed hai. Variable wale expression ki value variable ke saath badalti hai."),
    ], {"k": 3, "c": 2, "caption": "An expression with the variable n"}),
    scene([
        L("Neha", "Now I open the boxes. Each has 6 laddoos. So 3 times 6 plus 2 is 20 laddoos.",
          "Ab main dabbe kholti hoon. Har ek mein 6 laddoo hain. Toh 3 guna 6 plus 2 barabar 20 laddoo."),
    ], {"k": 3, "c": 2, "n": 6, "open": True}),
    scene([
        L("Harsh", "And if each box had 8? Then 3 times 8 plus 2 is 26!", "Aur agar har dabbe mein 8 hote? Tab 3 guna 8 plus 2 barabar 26!"),
        L("Dadi", "Same expression, a different value. Put in the value of the variable, then calculate.",
          "Wahi expression, alag value. Variable ki value rakho, phir calculate karo."),
    ], {"k": 3, "c": 2, "n": 8, "open": True}),
    scene([
        L("Neha", "Harsh! Someone took laddoos out of this box. It had n, and now it has 2 fewer.",
          "Harsh! Kisi ne is dabbe se laddoo nikaale. Ismein n the, aur ab 2 kam hain."),
        L("Harsh", "I only took 2! So now it has n minus 2.", "Maine sirf 2 liye! Toh ab ismein n minus 2 hain."),
    ], {"k": 1, "c": 2, "op": "-", "n": 6, "caption": "One box, 2 laddoos taken out"}),
    scene([
        L("Dadi", "Turning words into expressions is a skill. 5 more than n is n plus 5. 4 times n is written 4 n. 7 less than y is y minus 7.",
          "Shabdon ko expression mein badalna ek kala hai. n se 5 zyaada matlab n plus 5. n ka 4 guna 4 n likhte hain. y se 7 kam matlab y minus 7."),
        L("Disha", "If Harsh is x years old and I am one year younger, my age is x minus 1!",
          "Agar Harsh x saal ka hai aur main ek saal chhoti hoon, toh meri umar x minus 1 hai!"),
    ], {"k": 1, "c": 5, "caption": "5 more than n"}),
    scene([
        L("Dadi", "One warning. 3 n means 3 times n. If n is 5, 3 n is 15, not 35.",
          "Ek chetavani. 3 n ka matlab 3 guna n. Agar n 5 hai, toh 3 n barabar 15, 35 nahi."),
    ], {"k": 3, "c": 0, "n": 5, "open": True}),
    scene([
        L("Neha", "Your turn! A new order has come: 4 boxes and 3 loose laddoos. Pack 4 n plus 3.",
          "Ab aapki baari! Naya order aaya hai: 4 dabbe aur 3 khule laddoo. 4 n plus 3 pack karo."),
    ], {"k": 1, "c": 0, "task": {"k": 4, "c": 3, "op": "+"}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "Diwali is coming. Papa wants to put a string of lights all around Dadi's square window.",
          "Diwali aa rahi hai. Papa Dadi ki square khidki ke chaaron taraf lights ki ladi lagaana chaahte hain."),
        L("Deepak", "The length all around a shape is its perimeter. A square has 4 equal sides. Call the side s.",
          "Kisi shape ke chaaron taraf ki lambaai uska perimeter hai. Square ki 4 barabar sides hoti hain. Side ko s keh lo."),
    ], {"mode": "square", "s": 2}),
    scene([
        L("Deepak", "So the perimeter is s plus s plus s plus s, which is 4 times s. If the side is 4 metres, I need 4 times 4, which is 16 metres of lights.",
          "Toh perimeter hai s plus s plus s plus s, yaani 4 guna s. Agar side 4 metre hai, toh mujhe 4 guna 4, yaani 16 metre lights chahiye."),
    ], {"mode": "square", "s": 4}),
    scene([
        L("Disha", "My rangoli is a triangle with 3 equal sides of length l. Its perimeter must be 3 times l. For sides of 5 metres, that is 15 metres!",
          "Meri rangoli ek triangle hai jiski 3 barabar sides hain, lambaai l. Iska perimeter 3 guna l hoga. 5 metre ki sides ke liye 15 metre!"),
    ], {"mode": "triangle", "s": 5}),
    scene([
        L("Neha", "My cake tray is a rectangle. It has two lengths l and two breadths b. A ribbon around it needs 2 times the sum of l and b.",
          "Mera cake tray ek rectangle hai. Usmein do lambaai l aur do chaudaai b hain. Uske chaaron taraf ribbon ke liye l aur b ke jod ka 2 guna chahiye."),
        L("Deepak", "With length 8 and breadth 5, that is 2 times 13, which is 26.", "Lambaai 8 aur chaudaai 5 ho, toh 2 guna 13, yaani 26."),
    ], {"mode": "rectangle", "l": 8, "b": 5}),
    scene([
        L("Harsh", "Why use letters at all? Why not just numbers?", "Letters kyon? Seedhe numbers kyon nahi?"),
        L("Dadi", "Because one rule with a letter works for every square, every triangle and every tray. Numbers alone work for only one size.",
          "Kyonki letter wala ek rule har square, har triangle aur har tray ke liye chalta hai. Sirf numbers toh ek hi size ke liye chalte hain."),
    ], {"mode": "rectangle", "l": 10, "b": 3}),
    scene([
        L("Dadi", "Rules from arithmetic can be written with letters too. Here are 3 rows of 5 chairs. Now I turn them.",
          "Arithmetic ke rules bhi letters se likh sakte hain. Yeh 5 kursiyon ki 3 rows hain. Ab main inhe ghumaati hoon."),
    ], {"mode": "swap", "a": 3, "c": 5, "turn": False}),
    scene([
        L("Disha", "Now it is 5 rows of 3 chairs, and still 15 chairs! 3 times 5 equals 5 times 3.",
          "Ab yeh 3 kursiyon ki 5 rows hain, aur phir bhi 15 kursiyan! 3 guna 5 barabar 5 guna 3."),
        L("Dadi", "This is true for any numbers, so we write a times b equals b times a. In the same way, a plus b equals b plus a.",
          "Yeh kisi bhi numbers ke liye sach hai, isliye hum likhte hain a guna b barabar b guna a. Isi tarah, a plus b barabar b plus a."),
    ], {"mode": "swap", "a": 3, "c": 5, "turn": True}),
    scene([
        L("Neha", "Your turn! Make a tray that is a rectangle, not a square, with a perimeter of exactly 20 metres.",
          "Ab aapki baari! Aisa rectangle tray banaao, jo square na ho, aur jiska perimeter theek 20 metre ho."),
    ], {"mode": "rectangle", "l": 3, "b": 3, "task": {"mode": "rectangle", "value": 20, "notSquare": True,
                                                       "text": "Make a rectangle (not a square) with perimeter 20 m."}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "On Sunday, Dadi takes the children to the sabzi market. The old shopkeeper still uses a two pan balance.",
          "Itvaar ko Dadi bachchon ko sabzi mandi le jaati hain. Purane dukaandaar ab bhi do palde wala taraazu use karte hain."),
        L("Dadi", "Mummy packed a bag with x laddoos, and I put 3 loose laddoos next to it. On its own, this pan shows the expression x plus 3.",
          "Mummy ne ek thaili mein x laddoo pack kiye, aur maine uske paas 3 khule laddoo rakhe. Akele yeh palda expression x plus 3 dikhaata hai."),
    ], {"a": 1, "b": 3, "c": 11, "x": 4, "rhs": False}),
    scene([
        L("Dadi", "Now I put 11 laddoos on the other pan. If the balance is level, then x plus 3 equals 11. That is an equation.",
          "Ab main doosre palde par 11 laddoo rakhti hoon. Agar taraazu barabar hai, toh x plus 3 barabar 11. Yeh ek equation hai."),
        L("Disha", "So an equation is a condition on the variable. It has an equals sign, and an expression does not!",
          "Toh equation variable par ek shart hai. Usmein barabar ka nishaan hota hai, aur expression mein nahi!"),
    ], {"a": 1, "b": 3, "c": 11, "x": 4}),
    scene([
        L("Harsh", "Is x 4? Then the left side is 7. It is too light!", "Kya x 4 hai? Tab left side 7 hai. Bahut halka hai!"),
        L("Harsh", "Then x is 10. Now the left is 13, too heavy!", "Toh x 10 hai. Ab left 13 hai, bahut bhaari!"),
    ], {"a": 1, "b": 3, "c": 11, "x": 10}),
    scene([
        L("Disha", "It must be between 4 and 10. Try 8. 8 plus 3 is 11. The balance is level!",
          "Yeh 4 aur 10 ke beech hoga. 8 try karo. 8 plus 3 barabar 11. Taraazu barabar hai!"),
        L("Dadi", "Shabash! x equals 8 satisfies the equation. We call 8 the solution.",
          "Shabash! x barabar 8 equation ko satisfy karta hai. 8 ko solution kehte hain."),
    ], {"a": 1, "b": 3, "c": 11, "x": 8}),
    scene([
        L("Dadi", "The side on the left of the equals sign is the L H S, the left hand side. The other is the R H S, the right hand side. An equation is true only when both sides have the same value.",
          "Barabar ke nishaan ke baayein taraf wala hissa L H S, yaani left hand side hai. Doosra R H S, yaani right hand side. Equation tabhi sach hai jab dono taraf ki value same ho."),
        L("Deepak", "Like signals on my railway. Only one setting lets the train go, and here only x equals 8 makes it true.",
          "Mere railway ke signals jaisa. Sirf ek setting train ko jaane deti hai, aur yahan sirf x barabar 8 ise sach banaata hai."),
    ], {"a": 1, "b": 3, "c": 11, "x": 8}),
    scene([
        L("Neha", "Now I put 2 bags with x laddoos each and 1 loose laddoo on the left, and 9 on the right. So 2 times x plus 1 equals 9.",
          "Ab main left par x laddoo wali 2 thailiyan aur 1 khula laddoo rakhti hoon, aur right par 9. Toh 2 guna x plus 1 barabar 9."),
        L("Dadi", "Your turn! Find the value of x that makes the balance level.", "Ab aapki baari! x ki woh value dhoondo jisse taraazu barabar ho jaaye."),
    ], {"a": 2, "b": 1, "c": 9, "x": 1, "task": True}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "It is the school cricket final. Harsh comes home grinning, with 30 runs to his name.",
          "School cricket ka final hai. Harsh muskuraata hua ghar aata hai, uske naam 30 runs hain."),
        L("Harsh", "I hit some fours and also took 6 singles. Guess how many fours!", "Maine kuch chauke maare aur 6 singles bhi liye. Guess karo kitne chauke!"),
    ], {"a": 4, "b": 6, "c": 30, "tries": []}),
    scene([
        L("Dadi", "Let x be the number of fours. Then 4 times x plus 6 equals 30. Let us solve it by trial and error.",
          "Maan lo chaukon ki ginti x hai. Tab 4 guna x plus 6 barabar 30. Chalo ise trial and error se solve karte hain."),
        L("Disha", "Try x equals 3. 4 times 3 plus 6 is 18. That is too small.", "x barabar 3 try karo. 4 guna 3 plus 6 barabar 18. Yeh bahut chhota hai."),
    ], {"a": 4, "b": 6, "c": 30, "tries": [3]}),
    scene([
        L("Disha", "Try 7. 4 times 7 plus 6 is 34. Now it is too big!", "7 try karo. 4 guna 7 plus 6 barabar 34. Ab bahut bada hai!"),
    ], {"a": 4, "b": 6, "c": 30, "tries": [3, 7]}),
    scene([
        L("Disha", "So x is between 3 and 7, and close to 7. Try 6. 4 times 6 plus 6 is 30. Equal!",
          "Toh x 3 aur 7 ke beech hai, aur 7 ke paas. 6 try karo. 4 guna 6 plus 6 barabar 30. Barabar!"),
        L("Harsh", "Yes! I hit 6 fours!", "Haan! Maine 6 chauke maare!"),
    ], {"a": 4, "b": 6, "c": 30, "tries": [3, 7, 6]}),
    scene([
        L("Dadi", "That is trial and error. Guess a value, check both sides, and let too small or too big guide your next guess.",
          "Yahi trial and error hai. Ek value guess karo, dono taraf check karo, aur bahut chhota ya bahut bada dekhkar agla guess lagaao."),
    ], {"a": 4, "b": 6, "c": 30, "tries": [3, 7, 6]}),
    scene([
        L("Deepak", "A coach on my train had x passengers. At the station, 5 got off and 27 were left. So x minus 5 equals 27.",
          "Meri train ke ek coach mein x yaatri the. Station par 5 utar gaye aur 27 bache. Toh x minus 5 barabar 27."),
        L("Harsh", "Try 30. That gives 25, too small. Try 32. That gives 27. So 32 passengers!",
          "30 try karo. Usse 25 aata hai, bahut chhota. 32 try karo. Usse 27 aata hai. Toh 32 yaatri!"),
    ], {"a": 1, "b": -5, "c": 27, "tries": [30, 32]}),
    scene([
        L("Neha", "I baked t cupcakes in each of 3 trays, plus 4 extra. That made 40. Try t equals 10: 34. Try 12: 40!",
          "Maine 3 trays mein har ek mein t cupcakes banaaye, aur 4 extra. Kul 40 hue. t barabar 10 try karo: 34. 12 try karo: 40!"),
        L("Dadi", "In Class 7 you will learn a quicker way: do the same thing to both sides. For now, trial and error is a fine start.",
          "Class 7 mein tum ek jaldi wala tareeka seekhoge: dono taraf ek jaisa kaam karo. Abhi ke liye trial and error achchi shuruaat hai."),
    ], {"a": 3, "b": 4, "c": 40, "letter": "t", "tries": [10, 12]}),
    scene([
        L("Dadi", "Your turn! Solve 5 times x plus 2 equals 37 by trial and error.", "Ab aapki baari! 5 guna x plus 2 barabar 37 ko trial and error se solve karo."),
    ], {"a": 5, "b": 2, "c": 37, "tries": [], "guess": 3, "task": True}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "After dinner, Dadi writes an algebra quiz on her chalkboard.", "Raat ke khaane ke baad, Dadi chalkboard par algebra ka quiz likhti hain."),
        L("Dadi", "Question 1. How many matchsticks are needed to make 12 letter C's?", "Sawaal 1. 12 letter C banaane ke liye kitni tiliyan chahiye?"),
    ], {"example": 0, "step": 0}),
    scene([
        L("Harsh", "Each C needs 3 sticks, so the rule is 3 times n. 3 times 12 is 36 matchsticks!",
          "Har C mein 3 tiliyan, toh rule hai 3 guna n. 3 guna 12 barabar 36 tiliyan!"),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. A row of squares needs 3 times n plus 1 matchsticks. How many for 15 squares?",
          "Sawaal 2. Squares ki line mein 3 guna n plus 1 tiliyan lagti hain. 15 squares ke liye kitni?"),
    ], {"example": 1, "step": 0}),
    scene([
        L("Disha", "Put n equal to 15. 3 times 15 is 45, and 45 plus 1 is 46 matchsticks.",
          "n barabar 15 rakho. 3 guna 15 barabar 45, aur 45 plus 1 barabar 46 tiliyan."),
        L("Dadi", "Shabash! Put the value in, then calculate.", "Shabash! Value rakho, phir calculate karo."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _squares_svg():
    """Rows of 1, 2 and 3 joined squares made of matchsticks."""
    parts = ['<svg viewBox="0 0 370 90" width="370" height="90" xmlns="http://www.w3.org/2000/svg">']
    x = 40
    for n in (1, 2, 3):
        for i in range(n + 1):
            parts.append(f'<line x1="{x + i * 30}" y1="20" x2="{x + i * 30}" y2="50" stroke="#fcd34d" stroke-width="4"/>')
        for i in range(n):
            for y in (20, 50):
                parts.append(f'<line x1="{x + i * 30}" y1="{y}" x2="{x + i * 30 + 30}" y2="{y}" stroke="#fcd34d" stroke-width="4"/>')
        parts.append(f'<text x="{x + n * 15}" y="75" text-anchor="middle" fill="#e2e8f0" font-size="13" font-family="monospace">{3 * n + 1} sticks</text>')
        x += n * 30 + 50
    parts.append('</svg>')
    return "".join(parts)


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: A Rainy Afternoon · Matchstick Patterns",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On a rainy afternoon with no cricket, Harsh and Disha make letters out of matchsticks. Counting the sticks for longer and longer rows, they find a rule, and Dadi shows them how one letter, n, can stand for any number.</div>

<h2>Patterns make rules</h2>
<p>The letter L needs 2 matchsticks. A row of L's grows by 2 sticks for every new letter:</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Number of L's</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>…</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td class="text-left">Matchsticks</td><td>2</td><td>4</td><td>6</td><td>8</td><td>10</td><td>…</td></tr>
  </tbody>
</table>
<div {FORMULA}>number of matchsticks = 2 × n,   where n = number of L's</div>

<h2>The variable n</h2>
<div {CARD}>
  <div>n can be 1, 2, 3, 100, any counting number. Because its value <strong>varies</strong>, n is called a <strong>variable</strong>.</div>
  <div>One rule with a variable replaces an endless table: for 100 L's, 2 × 100 = 200 sticks.</div>
  <div>We usually write 2 × n as <strong>2n</strong> (the number first, the letter after, no sign between).</div>
</div>

<h2>Other letters</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Letter</th><th>Sticks for one</th><th>Rule</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td class="text-left">L, T</td><td>2</td><td>2n</td></tr>
    <tr><td class="text-left">C, U</td><td>3</td><td>3n</td></tr>
    <tr><td class="text-left">F</td><td>4</td><td>4n</td></tr>
    <tr><td class="text-left">E</td><td>5</td><td>5n</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "When a pattern grows by the same amount each time, one rule with a variable, like 2n, gives the answer for any size.",
        "widgetType": "Class6AlgebraMatchstickWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Each letter F needs 4 matchsticks. How many matchsticks are needed for a row of 9 F's?",
            "options": ["13", "36", "45", "32"],
            "correctIndex": 1,
            "explanation": "The rule is 4n. With n = 9: 4 × 9 = 36 matchsticks.",
        },
        "teacherNotes": teacher(
            [
                "Give pairs real matchsticks (or ice-cream sticks) and let them build 1, 2, 3 letters before writing anything.",
                "Always fill the table first, then ask 'what would 100 need?' so the need for a rule is felt.",
                "Introduce n as 'the number of letters, whatever it is', then write 2 × n and finally 2n.",
            ],
            [
                "Adding instead of multiplying for large n (counting on by 2 a hundred times).",
                "Thinking n always means one particular number.",
                "Writing n2 instead of 2n.",
            ],
            "Stick-pattern stations: each group gets one letter (L, C, F, E), builds rows of 1 to 4, fills a table and writes its rule on a card.",
            "Old NCERT Ch. 11 Algebra (11.1 introduction, 11.2 matchstick patterns, 11.3 the idea of a variable).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Dadi's Chalkboard · More Patterns, More Variables",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Dadi lays matchstick squares on her chalkboard. Harsh says 2 squares need 8 sticks, but Disha spots the shared side. Papa builds triangles like a railway bridge, and Mummy finds variables in her bakery trays.</div>

<h2>Shapes that share sides</h2>
<p>In a row of joined squares, start with 1 stick, then each square adds 3 more:</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Squares n</th><th>1</th><th>2</th><th>3</th><th>4</th><th>10</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td class="text-left">Matchsticks</td><td>4</td><td>7</td><td>10</td><td>13</td><td>31</td></tr>
  </tbody>
</table>
<div {FORMULA}>squares: 3n + 1      triangles: 2n + 1</div>
<div {CARD}>
  <div>Check a rule with a small case you can count, for example n = 2 squares: 3 × 2 + 1 = 7. ✔</div>
  <div>4n would be wrong here, because neighbouring squares share a side.</div>
</div>

<h2>Variables and constants</h2>
<ul>
  <li>A <strong>variable</strong> is a letter (n, x, y, l, m, t…) whose value is not fixed.</li>
  <li>A <strong>constant</strong> is a number with a fixed value, like 2, 3 or 12.</li>
  <li>Everyday rules: t trays of 12 cupcakes hold 12t cupcakes; c coaches with 8 passengers each carry 8c passengers.</li>
</ul>

<h2>A pinch of history</h2>
<p>In his book Brahmasphutasiddhanta (628 CE), Brahmagupta called an unknown number <em>yavat-tavat</em> ("as much as") and named further unknowns after colours, such as <em>kalaka</em> (black) and <em>nilaka</em> (blue), writing just the first syllable as the symbol. Today we use letters like x and n.</p>
""",
        "keyInsight": "A variable is a letter that can take many values; check every rule against a small case you can count.",
        "widgetType": "Class6AlgebraMatchstickWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "A row of joined squares uses the rule 3n + 1. How many squares can be made with 25 matchsticks?",
            "options": ["6", "7", "8", "9"],
            "correctIndex": 2,
            "explanation": "Try n = 8: 3 × 8 + 1 = 25. So 8 squares.",
        },
        "teacherNotes": teacher(
            [
                "Let students predict 2 squares first; many will say 8. Then build it and count 7.",
                "Colour the starting stick differently to explain the '+ 1'.",
                "Ask for real-life variables: price of n pencils, seats in r rows, legs on c cows (4c).",
            ],
            [
                "Using 4n for joined squares (forgetting shared sides).",
                "Treating the '+ 1' as '+ n'.",
                "Calling a fixed number a variable.",
            ],
            "Pattern detectives: show the first three shapes of a new matchstick pattern (for example, joined pentagons) and let groups find and test the rule.",
            "Old NCERT Ch. 11 (11.4 more matchstick patterns, 11.5 more examples of variables).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Mummy's Bakery · Expressions with Variables",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Mummy packs laddoos in closed boxes, each holding n laddoos. Orders become expressions like 3n + 2, Harsh's snacking becomes n − 2, and opening the boxes shows how one expression takes different values.</div>

<h2>Expressions</h2>
<div {CARD}>
  <div><strong>Number expression:</strong> only numbers, fixed value. 2 + 3 × 5 = 17.</div>
  <div><strong>Expression with a variable:</strong> its value depends on the variable. 3n + 2.</div>
</div>
<p>Expressions are built from variables and numbers with +, −, × and ÷.</p>

<h2>Words to expressions</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">In words</th><th>Expression</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>5 more than n</td><td class="text-center">n + 5</td></tr>
    <tr><td>7 less than y</td><td class="text-center">y − 7</td></tr>
    <tr><td>4 times n</td><td class="text-center">4n</td></tr>
    <tr><td>one third of m</td><td class="text-center">m ÷ 3</td></tr>
    <tr><td>3 boxes of n laddoos and 2 loose</td><td class="text-center">3n + 2</td></tr>
    <tr><td>Disha is 1 year younger than Harsh (x years)</td><td class="text-center">x − 1</td></tr>
  </tbody>
</table>

<h2>Finding the value of an expression</h2>
<div {FORMULA}>3n + 2:   n = 6 → 3 × 6 + 2 = 20;   n = 8 → 3 × 8 + 2 = 26</div>
<p><strong>Careful:</strong> 3n means 3 × n. If n = 5, 3n = 15, not 35.</p>
""",
        "keyInsight": "An expression with a variable is a recipe: put in a value for the variable and it gives a number.",
        "widgetType": "Class6AlgebraBoxesWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "Each box holds n laddoos. Mummy sells 5 boxes and 4 loose laddoos. Which expression gives the total?",
            "options": ["5 + 4n", "9n", "5n + 4", "n + 9"],
            "correctIndex": 2,
            "explanation": "5 boxes hold 5 × n = 5n laddoos, and 4 more makes 5n + 4.",
        },
        "teacherNotes": teacher(
            [
                "Use real closed boxes (or envelopes) with counters inside; students write the expression before opening.",
                "Contrast number expressions (fixed value) with variable expressions (value depends on the variable).",
                "Practise both directions: words to expression and expression to words.",
            ],
            [
                "Reading 3n as 'thirty-something' (3n = 35 when n = 5).",
                "Writing '5 less than y' as 5 − y.",
                "Adding unlike things: 3n + 2 = 5n.",
            ],
            "Mystery box game: one student fills k boxes with the same number of counters and adds some loose ones; the class writes the expression, then predicts the total for a guessed n before opening.",
            "Old NCERT Ch. 11 (11.7 expressions with variables, 11.8 using expressions practically).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Diwali Lights · Rules from Geometry and Arithmetic",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Before Diwali, Papa measures lights for a square window, Disha draws a triangle rangoli and Mummy ties a ribbon round her cake tray. Each one needs a rule that works for every size. Then Dadi turns a block of chairs to show a rule from arithmetic.</div>

<h2>Rules from geometry (perimeter)</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Shape</th><th>Rule</th><th>Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Square, side s</td><td class="text-center">P = 4s</td><td class="text-center">s = 4 m → 16 m</td></tr>
    <tr><td>Equilateral triangle, side l</td><td class="text-center">P = 3l</td><td class="text-center">l = 5 m → 15 m</td></tr>
    <tr><td>Rectangle, length l, breadth b</td><td class="text-center">P = 2 × (l + b)</td><td class="text-center">l = 8, b = 5 → 26</td></tr>
  </tbody>
</table>

<h2>Rules from arithmetic</h2>
<div {FORMULA}>a + b = b + a      a × b = b × a</div>
<div {CARD}>
  <div>3 rows of 5 chairs = 5 rows of 3 chairs = 15 chairs. The order of multiplying does not change the product.</div>
  <div>Other rules that hold for all numbers: (a + b) + c = a + (b + c) and a × (b + c) = a × b + a × c.</div>
  <div>Letters let us say "for <strong>every</strong> number" in one short line.</div>
</div>
""",
        "keyInsight": "Letters turn a fact about one shape or one sum into a rule for all of them.",
        "widgetType": "Class6AlgebraRulesWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "A rectangular garden has length 12 m and breadth 7 m. What is its perimeter?",
            "options": ["19 m", "84 m", "38 m", "31 m"],
            "correctIndex": 2,
            "explanation": "P = 2 × (l + b) = 2 × (12 + 7) = 2 × 19 = 38 m.",
        },
        "teacherNotes": teacher(
            [
                "Walk around the classroom edge and ask how to find the distance for any rectangle.",
                "Build the square rule from s + s + s + s before writing 4s.",
                "Use an array of counters, rotated, to show a × b = b × a.",
            ],
            [
                "Writing the rectangle perimeter as 2 × l + b (forgetting the brackets).",
                "Confusing perimeter with area (s × s).",
                "Thinking a rule with letters is true only for the example shown.",
            ],
            "Fence the field: groups get rectangles drawn on squared paper, measure l and b, use 2 × (l + b), then check by walking a string around.",
            "Old NCERT Ch. 11 (11.6 use of variables in common rules: rules from geometry and arithmetic).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: The Sabzi Market Balance · What Is an Equation?",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>At the sabzi market, Dadi uses the shopkeeper's two-pan balance. A bag holds x laddoos. With 3 more laddoos it balances 11 laddoos on the other pan, and the children find the only value of x that keeps it level.</div>

<h2>Expression or equation?</h2>
<div {CARD}>
  <div><strong>Expression:</strong> x + 3. No equals sign. It just has a value for each x.</div>
  <div><strong>Equation:</strong> x + 3 = 11. It is a <strong>condition</strong> on x, with an equals sign.</div>
</div>
<p>The part to the left of "=" is the <strong>LHS</strong> (left hand side); the part to the right is the <strong>RHS</strong>.</p>

<h2>The solution</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>x</th><th>LHS = x + 3</th><th>RHS</th><th>Balanced?</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td>4</td><td>7</td><td>11</td><td>No, LHS too small</td></tr>
    <tr><td>10</td><td>13</td><td>11</td><td>No, LHS too big</td></tr>
    <tr><td>8</td><td>11</td><td>11</td><td class="text-emerald-300">Yes</td></tr>
  </tbody>
</table>
<div {FORMULA}>x + 3 = 11 is satisfied only by x = 8 (the solution)</div>
<p>Another one: 2x + 1 = 9 means 2 bags of x laddoos and 1 laddoo balance 9 laddoos.</p>
""",
        "keyInsight": "An equation is like a level balance: it is true only for the value of the variable that makes both sides equal.",
        "widgetType": "Class6AlgebraBalanceWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "Which of these is an equation?",
            "options": ["3y + 4", "7 − m", "2p = 10", "5 × 6"],
            "correctIndex": 2,
            "explanation": "Only 2p = 10 has an equals sign and puts a condition on the variable p. The others are expressions.",
        },
        "teacherNotes": teacher(
            [
                "Use a real two-pan balance (or a coat-hanger balance) with identical objects.",
                "Stress that an equation is a statement that may be true or false depending on the variable.",
                "Name LHS and RHS every time you write an equation.",
            ],
            [
                "Calling every expression an equation.",
                "Thinking an equation is true for all values of the variable.",
                "Mixing up LHS and RHS when checking.",
            ],
            "True or false?: write x + 5 = 12 on the board; students hold up cards with values of x and the class says whether the equation becomes true.",
            "Old NCERT Ch. 11 (11.9 what is an equation?).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: The Cricket Final · Solving by Trial and Error",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Harsh scores 30 runs in the school final with some fours and 6 singles. The family turns his innings into an equation and finds the number of fours by guessing smartly. Papa and Mummy bring equations from the railway and the bakery.</div>

<h2>Trial and error</h2>
<ol>
  <li>Write the equation, for example 4x + 6 = 30.</li>
  <li>Guess a value of x and work out the LHS.</li>
  <li>If the LHS is too small, try a bigger value; if too big, a smaller one.</li>
  <li>Stop when LHS = RHS. That value is the solution.</li>
</ol>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>x</th><th>4x + 6</th><th>Compared with 30</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td>3</td><td>18</td><td>too small</td></tr>
    <tr><td>7</td><td>34</td><td>too big</td></tr>
    <tr><td>6</td><td>30</td><td class="text-emerald-300">equal ✔</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>Railway: x − 5 = 27 → x = 32 passengers (32 − 5 = 27).</div>
  <div>Bakery: 3t + 4 = 40 → t = 12 cupcakes per tray (3 × 12 + 4 = 40).</div>
</div>
<div {FORMULA}>Bridge to Class 7: do the same to both sides. 4x + 6 = 30 → 4x = 24 → x = 6</div>
""",
        "keyInsight": "Guess, check both sides, and let 'too small' or 'too big' steer you to the solution.",
        "widgetType": "Class6AlgebraTrialWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Solve 3m − 2 = 19 by trial and error.",
            "options": ["m = 5", "m = 6", "m = 7", "m = 8"],
            "correctIndex": 2,
            "explanation": "m = 7: 3 × 7 − 2 = 21 − 2 = 19. ✔",
        },
        "teacherNotes": teacher(
            [
                "Always record trials in a table with a 'too small / too big' column.",
                "Encourage a smart second guess: if 3 gave 18 and we need 30, we need 12 more, which is 3 more fours.",
                "Mention that Class 7 shows the balance method (same operation on both sides).",
            ],
            [
                "Stopping after one wrong guess and declaring 'no answer'.",
                "Not checking the final value in the original equation.",
                "Calculating 4x + 6 as 4 × (x + 6).",
            ],
            "Guess my number: a student thinks of a number and says 'three times my number plus 4 is 31'; the class solves by trial and error with a shared table.",
            "Old NCERT Ch. 11 (11.10 solution of an equation by trial and error).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>After dinner, Dadi writes an algebra quiz on her chalkboard. Harsh answers fast; Disha answers carefully.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Find the pattern: what is added for each new shape? That number multiplies n.</li>
  <li>Words to expressions: "more than" → +, "less than" → −, "times" → ×.</li>
  <li>Value of an expression: put in the value of the variable, then calculate (× before +).</li>
  <li>Equation: has "=". Its solution makes LHS = RHS.</li>
  <li>Trial and error: guess, check, adjust.</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Find the rule, write it with a letter, then put in values or test guesses.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Matchstick rule",
                    "question": "Each letter C needs 3 matchsticks. How many matchsticks are needed for 12 C's?",
                    "steps": [
                        "One C needs 3 sticks, so the rule is 3n.",
                        "n = 12: 3 × 12",
                        "= <strong>36 matchsticks</strong>",
                    ],
                    "answer": "36",
                },
                {
                    "title": "Joined squares",
                    "question": "A row of n joined squares needs 3n + 1 matchsticks. How many are needed for 15 squares?",
                    "figureSvg": _squares_svg(),
                    "steps": [
                        "Put n = 15 in 3n + 1.",
                        "3 × 15 = 45",
                        "45 + 1 = <strong>46 matchsticks</strong>",
                    ],
                    "answer": "46",
                },
                {
                    "title": "Words to an expression",
                    "question": "Write an expression for '7 more than three times p'.",
                    "steps": [
                        "three times p = 3p",
                        "7 more than that: add 7",
                        "<strong>3p + 7</strong>",
                    ],
                    "answer": "3p + 7",
                },
                {
                    "title": "Expression to words",
                    "question": "Write 2y − 5 in words.",
                    "steps": [
                        "2y = two times y (twice y)",
                        "− 5 = 5 is taken away",
                        "<strong>5 less than twice y</strong>",
                    ],
                    "answer": "5 less than twice y",
                },
                {
                    "title": "Value of an expression",
                    "question": "Find the value of 5n − 3 when n = 4.",
                    "steps": [
                        "5n = 5 × 4 = 20",
                        "20 − 3 = <strong>17</strong>",
                    ],
                    "answer": "17",
                },
                {
                    "title": "Using an expression",
                    "question": "Each box holds n laddoos. Mummy sells 6 boxes and 4 loose laddoos. Write the total as an expression and find it when n = 10.",
                    "steps": [
                        "6 boxes: 6n laddoos; plus 4 loose: 6n + 4",
                        "n = 10: 6 × 10 + 4 = 60 + 4",
                        "= <strong>64 laddoos</strong>",
                    ],
                    "answer": "6n + 4; 64",
                },
                {
                    "title": "Perimeter rule",
                    "question": "Find the perimeter of a rectangle with length 9 cm and breadth 6 cm using P = 2 × (l + b).",
                    "steps": [
                        "l + b = 9 + 6 = 15",
                        "P = 2 × 15",
                        "= <strong>30 cm</strong>",
                    ],
                    "answer": "30 cm",
                },
                {
                    "title": "Checking a solution",
                    "question": "Is x = 3 a solution of 4x − 5 = 7?",
                    "steps": [
                        "LHS = 4 × 3 − 5 = 12 − 5 = 7",
                        "RHS = 7",
                        "LHS = RHS, so <strong>yes, x = 3 is a solution</strong>",
                    ],
                    "answer": "Yes",
                },
                {
                    "title": "Trial and error",
                    "question": "Solve 3m + 4 = 25 by trial and error.",
                    "steps": [
                        "m = 5: 3 × 5 + 4 = 19 (too small)",
                        "m = 8: 3 × 8 + 4 = 28 (too big)",
                        "m = 7: 3 × 7 + 4 = 25 ✔",
                        "<strong>m = 7</strong>",
                    ],
                    "answer": "m = 7",
                },
                {
                    "title": "Making and solving an equation",
                    "question": "Dadi is 64 years old. Her age is 4 more than 5 times Harsh's age. Write an equation and find Harsh's age.",
                    "steps": [
                        "Let Harsh's age be x years. Then 5x + 4 = 64.",
                        "x = 10: 5 × 10 + 4 = 54 (too small)",
                        "x = 12: 5 × 12 + 4 = 64 ✔",
                        "<strong>Harsh is 12 years old</strong>",
                    ],
                    "answer": "12 years",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Q1 and Q2: ask 'what is added for each new shape?' before writing the rule.",
                "Q3 and Q4: read the words aloud slowly and underline 'more than' or 'less than'.",
                "Q10 is a two-step problem: first form the equation, then solve.",
            ],
            [
                "Q2: using 4n instead of 3n + 1.",
                "Q4: writing 5 − 2y for 2y − 5.",
                "Q5: reading 5n as 54 when n = 4.",
            ],
            "Pair-share: one student writes the expression or equation, the partner finds the value or solution; swap for the next question.",
            "Covers old NCERT Ch. 11 Exercises 11.1 to 11.5.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Introduction to Algebra (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From matchstick letters to Harsh's cricket final, you have found rules, written expressions and solved equations. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering patterns, variables, expressions, rules, equations and trial and error.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "A letter can stand for any number: use it to write rules, build expressions and solve equations.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Introduction to Algebra · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "Each letter E needs 5 matchsticks. The rule for n E's is:", "options": ["n + 5", "5n", "4n", "10n"], "answer": 1, "explanation": "Each E adds 5 sticks, so n E's need 5 × n = 5n.", "topic": "Matchstick patterns"},
                {"q": "A variable is:", "options": ["a number that never changes", "the answer to a sum", "a letter whose value can change", "always equal to 1"], "answer": 2, "explanation": "A variable, like n or x, can take different values. A fixed number is a constant.", "topic": "The idea of a variable"},
                {"q": "'4 less than y' is written as:", "options": ["y − 4", "4 − y", "4y", "y + 4"], "answer": 0, "explanation": "Start with y and take away 4: y − 4.", "topic": "Expressions"},
                {"q": "The value of 3x + 5 when x = 4 is:", "options": ["12", "39", "22", "17"], "answer": 3, "explanation": "3 × 4 + 5 = 12 + 5 = 17.", "topic": "Value of an expression"},
                {"q": "A row of joined squares needs 3n + 1 matchsticks. How many for 8 squares?", "options": ["24", "27", "25", "32"], "answer": 2, "explanation": "3 × 8 + 1 = 24 + 1 = 25.", "topic": "Rules from patterns"},
                {"q": "Which of these is an equation?", "options": ["2x + 3", "5 + 2", "x + 4 = 9", "3y"], "answer": 2, "explanation": "Only x + 4 = 9 has an equals sign and a condition on the variable.", "topic": "Equations"},
                {"q": "The perimeter of a square with side s is:", "options": ["s × s", "2s", "s + 4", "4s"], "answer": 3, "explanation": "s + s + s + s = 4s. (s × s is the area.)", "topic": "Rules from geometry"},
                {"q": "The solution of x + 7 = 15 is:", "options": ["7", "22", "8", "15"], "answer": 2, "explanation": "8 + 7 = 15, so x = 8.", "topic": "Solving equations"},
                {"q": "Disha has p pencils. Harsh has 3 more than twice as many as Disha. Harsh has:", "options": ["2p + 3", "3p + 2", "2(p + 3)", "p + 5"], "answer": 0, "explanation": "Twice p is 2p; 3 more makes 2p + 3.", "topic": "Using expressions"},
                {"q": "Solve 6m − 4 = 32 by trial and error.", "options": ["m = 5", "m = 6", "m = 7", "m = 8"], "answer": 1, "explanation": "m = 6: 6 × 6 − 4 = 36 − 4 = 32. ✔", "topic": "Trial and error"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q3 catches writing 4 − y; Q5 catches using 4n for joined squares; Q7 catches confusing perimeter with area."],
            "Exit ticket: build a matchstick pattern of your own, write its rule, and make one equation from it to solve.",
            "Matches old NCERT Ch. 11 Algebra learning outcomes.",
        ),
    },
]


def seed_class6_algebra():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Introduction to Algebra")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Introduction to Algebra: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Introduction to Algebra: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_algebra()
