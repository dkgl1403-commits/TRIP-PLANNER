import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Number Play (Ganita Prakash 2024, Ch. 3). Story: Harsh's cricket team photo, Mummy's bakery order book,
# a train ride of digit detectives, a Diwali night of palindromes, Papa's railway puzzle (Kaprekar's 6174 and the
# Collatz mystery), and the colony cricket final with estimation and the Game of 21.
# Facts checked: D. R. Kaprekar (1905–1986) was a school teacher in Devlali, Maharashtra, and announced 6174 in 1949;
# Lothar Collatz posed the 3n + 1 problem in 1937 and it is still unsolved; 89 needs 24 reverse-and-add steps;
# 196 has no known palindrome. All other numbers below were computed and double-checked.

ROW = [46, 82, 37, 65, 91, 28, 54]
TRAY = [[34, 52, 18, 40], [61, 27, 45, 12], [19, 73, 30, 56]]
CHESS = [[16, 1, 15, 2], [3, 14, 4, 13], [12, 5, 11, 6], [7, 10, 8, 9]]

SCENES_1 = [
    scene([
        L("Narrator", "Saturday evening at the colony ground. Harsh's cricket team lines up for a team photo.",
          "Shanivaar ki shaam, colony ka ground. Harsh ki cricket team photo ke liye line mein khadi hai."),
        L("Dadi", "Before the photo, a number game! Each child calls out how many of the children standing right next to them are taller.",
          "Photo se pehle ek number game! Har bachcha bolega ki uske theek bagal mein khade bachchon mein se kitne usse lambe hain."),
    ], {"order": [2, 4, 1, 5, 3], "reveal": False}),
    scene([
        L("Harsh", "Aman says 1, because Kabir next to him is taller. Kabir says 0, because Aman and Tinku are both shorter.",
          "Aman 1 bolega, kyonki uske bagal mein Kabir lamba hai. Kabir 0 bolega, kyonki Aman aur Tinku dono chhote hain."),
        L("Disha", "And little Tinku says 2, because Kabir and Zoya on both sides are taller than him!",
          "Aur chhota Tinku 2 bolega, kyonki dono taraf Kabir aur Zoya usse lambe hain!"),
    ], {"order": [2, 4, 1, 5, 3], "reveal": True}),
    scene([
        L("Dadi", "So the line calls out 1, 0, 2, 0, 1. Numbers can tell us things about the line, even with our eyes closed!",
          "Toh line bolti hai 1, 0, 2, 0, 1. Numbers line ke baare mein baatein bata sakte hain, aankhein band karke bhi!"),
        L("Harsh", "Can the child at the end of the line ever say 2?", "Kya line ke kinaare wala bachcha kabhi 2 bol sakta hai?"),
    ], {"order": [2, 4, 1, 5, 3], "reveal": True}),
    scene([
        L("Dadi", "Never! A child at either end has only one neighbour. So the biggest number they can call out is 1.",
          "Kabhi nahi! Kinaare wale bachche ka sirf ek padosi hota hai. Isliye woh zyaada se zyaada 1 bol sakta hai."),
    ], {"order": [2, 4, 1, 5, 3], "reveal": True, "highlight": "ends"}),
    scene([
        L("Disha", "Let us stand from shortest to tallest!", "Chalo chhote se lambe ke kram mein khade hote hain!"),
        L("Harsh", "Now everyone says 1, except Zoya at the end, who says 0.", "Ab sab 1 bolte hain, sirf kinaare par Zoya 0 bolti hai."),
    ], {"order": [1, 2, 3, 4, 5], "reveal": True}),
    scene([
        L("Dadi", "Here is something always true. The tallest child always says 0, because no one is taller. And the tallest child's neighbour must say at least 1. So the whole line can never say 0 together.",
          "Ek baat hamesha sach hai. Sabse lamba bachcha hamesha 0 bolta hai, kyonki koi usse lamba nahi. Aur uska padosi kam se kam 1 bolega. Isliye poori line kabhi ek saath 0 nahi bol sakti."),
    ], {"order": [1, 2, 3, 4, 5], "reveal": True, "highlight": "tallest"}),
    scene([
        L("Deepak", "My puzzle: can two children standing side by side both say 2?",
          "Meri paheli: kya bagal bagal khade do bachche dono 2 bol sakte hain?"),
        L("Disha", "No! If both say 2, each one would have to be taller than the other. That is impossible!",
          "Nahi! Agar dono 2 bolein, toh har ek ko doosre se lamba hona padega. Yeh namumkin hai!"),
    ], {"order": [3, 2, 1, 4, 5], "reveal": True}),
    scene([
        L("Dadi", "Your turn! Tap two children to swap them. Can you make two children call out 2?",
          "Ab aapki baari! Do bachchon par tap karke unki jagah badlo. Kya aap do bachchon se 2 bulwa sakte ho?"),
    ], {"order": [1, 2, 3, 4, 5], "reveal": True, "task": "two2"}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "Sunday at Mummy's home bakery. She writes the laddoo orders for seven days in a row of boxes.",
          "Ravivaar ko Mummy ki home bakery. Woh saat dinon ke laddoo orders ek kataar ke dabbon mein likhti hain."),
        L("Neha", "46, 82, 37, 65, 91, 28, 54. Which days were extra busy?",
          "46, 82, 37, 65, 91, 28, 54. Kaun se din sabse zyaada vyast the?"),
    ], {"mode": "row", "row": ROW, "reveal": False}),
    scene([
        L("Dadi", "A box is called a supercell if its number is bigger than all its neighbours. In a row, the neighbours are the boxes just to the left and right.",
          "Agar kisi dabbe ka number apne sabhi padosiyon se bada ho, toh use supercell kehte hain. Kataar mein padosi woh dabbe hain jo theek baayein aur daayein hain."),
        L("Disha", "82 is bigger than 46 and 37, so 82 is a supercell!", "82, 46 aur 37 dono se bada hai, toh 82 supercell hai!"),
    ], {"mode": "row", "row": ROW, "reveal": True, "select": 1}),
    scene([
        L("Harsh", "91 beats 65 and 28. And 54 at the end only has to beat 28!", "91, 65 aur 28 ko harata hai. Aur kinaare wale 54 ko sirf 28 ko harana hai!"),
        L("Dadi", "Shabash! So this row has 3 supercells: 82, 91 and 54.", "Shabash! Toh is kataar mein 3 supercells hain: 82, 91 aur 54."),
    ], {"mode": "row", "row": ROW, "reveal": True, "select": 6}),
    scene([
        L("Dadi", "Two rules are always true. The largest number is always a supercell, because nothing is bigger than it. And the smallest number can never be a supercell.",
          "Do niyam hamesha sach hain. Sabse bada number hamesha supercell hota hai, kyonki usse bada kuch nahi. Aur sabse chhota number kabhi supercell nahi ho sakta."),
    ], {"mode": "row", "row": ROW, "reveal": True, "mark": "maxmin"}),
    scene([
        L("Neha", "Now my tray of 12 boxes, in 3 rows of 4. Here a box has neighbours above, below, left and right.",
          "Ab meri 12 dabbon wali tray, 4 ki 3 kataarein. Yahan har dabbe ke padosi upar, neeche, baayein aur daayein hain."),
        L("Dadi", "73 in the bottom row beats 27 above it, 19 on its left and 30 on its right. So 73 is a supercell.",
          "Neeche wali kataar ka 73, upar wale 27, baayein 19 aur daayein 30 ko harata hai. Toh 73 supercell hai."),
    ], {"mode": "grid", "grid": TRAY, "reveal": True, "select": [2, 1]}),
    scene([
        L("Disha", "I count 6 supercells in the tray: 52, 40, 61, 45, 73 and 56!", "Mujhe tray mein 6 supercells mile: 52, 40, 61, 45, 73 aur 56!"),
    ], {"mode": "grid", "grid": TRAY, "reveal": True}),
    scene([
        L("Deepak", "A 4 by 4 table holds the numbers 1 to 16. How many supercells can it have at most?",
          "Ek 4 guna 4 ki table mein 1 se 16 tak numbers hain. Isme zyaada se zyaada kitne supercells ho sakte hain?"),
        L("Dadi", "Arrange it like a chessboard. Put the big numbers, 9 to 16, on one colour and 1 to 8 on the other. Every big number then beats all its neighbours, so we get 8 supercells!",
          "Ise shatranj ki tarah sajao. Bade numbers 9 se 16 ek rang par, aur 1 se 8 doosre rang par. Har bada number apne sab padosiyon ko harata hai, toh 8 supercells milte hain!"),
    ], {"mode": "grid", "grid": CHESS, "reveal": True}),
    scene([
        L("Dadi", "Your turn! These 7 numbers go from smallest to biggest, so there is only 1 supercell. Swap numbers to make 4 supercells.",
          "Ab aapki baari! Yeh 7 numbers chhote se bade kram mein hain, isliye sirf 1 supercell hai. Numbers ki jagah badlo aur 4 supercells banao."),
    ], {"mode": "row", "row": [12, 25, 31, 47, 58, 63, 70], "reveal": True, "task": 4}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "The family is on a train from Jaipur to Delhi. Papa starts a game of digit detectives.",
          "Parivaar Jaipur se Delhi ki train mein hai. Papa digit detectives ka khel shuru karte hain."),
        L("Deepak", "Add up the digits of a number to get its digit sum. For 68, the digit sum is 6 plus 8, which is 14.",
          "Kisi number ke digits jodo, toh uska digit sum milta hai. 68 ka digit sum hai 6 plus 8, yaani 14."),
    ], {"mode": "sum", "target": 14, "show": False}),
    scene([
        L("Disha", "Which numbers up to 100 have a digit sum of 14?", "100 tak kaun se numbers ka digit sum 14 hai?"),
        L("Deepak", "Watch them light up: 59, 68, 77, 86 and 95. Only 5 numbers!", "Dekho yeh chamak rahe hain: 59, 68, 77, 86 aur 95. Sirf 5 numbers!"),
    ], {"mode": "sum", "target": 14, "show": True}),
    scene([
        L("Harsh", "They make a slanting line on the board!", "Board par yeh ek tirchhi line banaate hain!"),
        L("Dadi", "Put them on the number line and look. Each one is exactly 9 more than the one before.",
          "Inhe number line par rakho aur dekho. Har ek apne pichhle wale se theek 9 zyaada hai."),
    ], {"mode": "line", "target": 14}),
    scene([
        L("Dadi", "Why 9? From 59 to 68, the tens digit goes up by 1 and the ones digit goes down by 1. Add 10, take away 1, and you have added 9.",
          "9 hi kyon? 59 se 68 mein dahaai ka digit 1 badhta hai aur ikaai ka digit 1 ghatta hai. 10 jodo, 1 ghatao, toh 9 jud gaya."),
        L("Disha", "Digit sum 5 gives 5, 14, 23, 32, 41 and 50. Jumps of 9 again!", "Digit sum 5 se milte hain 5, 14, 23, 32, 41 aur 50. Phir se 9 ki chhalaang!"),
    ], {"mode": "line", "target": 5}),
    scene([
        L("Harsh", "And digit sum 9 gives 9, 18, 27, all the way to 90. That is the 9 times table!",
          "Aur digit sum 9 se milte hain 9, 18, 27, aur aage 90 tak. Yeh toh 9 ka pahaada hai!"),
    ], {"mode": "sum", "target": 9, "show": True}),
    scene([
        L("Deepak", "New case, detectives. If you write all the numbers from 1 to 100, how many times do you write the digit 7?",
          "Naya case, detectives. Agar 1 se 100 tak saare numbers likho, toh digit 7 kitni baar likhoge?"),
        L("Harsh", "Easy, 10 times!", "Aasaan, 10 baar!"),
    ], {"mode": "count", "digit": 7}),
    scene([
        L("Dadi", "Look closely. 7, 17, 27 and so on up to 97 give 10 sevens in the ones place. 70 to 79 give 10 more in the tens place, and 77 has two sevens. That is 20 in all!",
          "Dhyaan se dekho. 7, 17, 27 aur aage 97 tak ikaai mein 10 saat hain. 70 se 79 tak dahaai mein 10 aur, aur 77 mein do saat hain. Kul milaakar 20!"),
    ], {"mode": "count", "digit": 7}),
    scene([
        L("Dadi", "Your turn, detective! Find every number up to 100 whose digits add up to 12, and tap them all on the board.",
          "Ab aapki baari, detective! 100 tak woh saare numbers dhoondho jinke digits jodne par 12 aata hai, aur board par sab par tap karo."),
    ], {"mode": "sum", "target": 12, "show": False, "task": True}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "It is Diwali night. Disha draws a rangoli with a number in the middle.", "Diwali ki raat hai. Disha ek rangoli banaati hai jiske beech mein ek number hai."),
        L("Disha", "My rangoli says 12321. It reads the same from the left and from the right!", "Meri rangoli mein 12321 likha hai. Yeh baayein se aur daayein se ek jaisa padha jaata hai!"),
        L("Dadi", "Such a number is called a palindrome. 121, 363 and 4884 are palindromes too.", "Aise number ko palindrome kehte hain. 121, 363 aur 4884 bhi palindromes hain."),
    ], {"mode": "reverse", "start": 12321, "step": 0}),
    scene([
        L("Dadi", "Here is a Diwali game. Take 39. Reverse its digits to get 93, and add them. 39 plus 93 is 132.",
          "Ek Diwali game. 39 lo. Iske digits ulto toh 93 milta hai, aur dono ko jodo. 39 plus 93 barabar 132."),
    ], {"mode": "reverse", "start": 39, "step": 1}),
    scene([
        L("Harsh", "132 is not a palindrome. So reverse and add again. 132 plus 231 is 363. A palindrome!",
          "132 palindrome nahi hai. Toh phir se ulto aur jodo. 132 plus 231 barabar 363. Palindrome!"),
    ], {"mode": "reverse", "start": 39, "step": 2}),
    scene([
        L("Disha", "I tried 87. 87 plus 78 is 165, then 726, then 1353, and then 4884. Four steps!",
          "Maine 87 try kiya. 87 plus 78 barabar 165, phir 726, phir 1353, aur phir 4884. Chaar steps!"),
    ], {"mode": "reverse", "start": 87, "step": 4}),
    scene([
        L("Dadi", "Some numbers take very long. 89 needs 24 steps and ends at a 13-digit palindrome! And for 196, nobody in the world knows if it ever becomes a palindrome.",
          "Kuch numbers bahut der lagaate hain. 89 ko 24 steps lagte hain aur woh 13 digit ke palindrome par khatam hota hai! Aur 196 ke baare mein duniya mein kisi ko nahi pata ki woh kabhi palindrome banega ya nahi."),
    ], {"mode": "reverse", "start": 89, "step": 24}),
    scene([
        L("Deepak", "Palindromes hide in clocks too. When the clock shows ten oh one, its digits read 1, 0, 0, 1, the same both ways!",
          "Palindromes ghadi mein bhi chhupe hain. Jab ghadi das bajkar ek minute dikhaati hai, toh digits hain 1, 0, 0, 1, dono taraf se ek jaise!"),
    ], {"mode": "clock", "time": 601}),
    scene([
        L("Harsh", "How many palindromic times are there in 12 hours?", "12 ghanton mein kitne palindromic times hote hain?"),
        L("Dadi", "From 1 o'clock to 9 o'clock, every hour has 6 of them, like one oh one, one eleven, up to one fifty-one. That makes 54. Add ten oh one, eleven eleven and twelve twenty-one, and you get 57.",
          "1 baje se 9 baje tak har ghante mein 6 hote hain, jaise ek bajkar ek, ek bajkar gyaarah, aur ek bajkar ikyaavan tak. Yeh hue 54. Phir das bajkar ek, gyaarah bajkar gyaarah aur baarah bajkar ikkees jodo, toh 57."),
    ], {"mode": "clock", "time": 741}),
    scene([
        L("Neha", "Calendars have them too! 22 February 2022 is written 22, 02, 2022. Read it backwards, and it is the same!",
          "Calendar mein bhi hote hain! 22 February 2022 likha jaata hai 22, 02, 2022. Ulta padho, phir bhi wahi!"),
        L("Disha", "Twos everywhere!", "Har jagah do hi do!"),
    ], {"mode": "calendar", "date": "22022022"}),
    scene([
        L("Dadi", "Your turn! The clock shows 7 45. Change the time until the clock shows a palindrome.",
          "Ab aapki baari! Ghadi mein 7 bajkar 45 minute hain. Samay badlo jab tak ghadi ek palindrome na dikhaaye."),
    ], {"mode": "clock", "time": 465, "task": True}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "One evening, Papa comes home with a puzzle from a railway quiz.", "Ek shaam Papa railway quiz se ek paheli lekar ghar aate hain."),
        L("Deepak", "Take any 4-digit number whose digits are not all the same. I will take 6382.", "Koi bhi 4 digit ka number lo jiske saare digits ek jaise na hon. Main 6382 leta hoon."),
    ], {"mode": "kaprekar", "start": 6382, "step": 0}),
    scene([
        L("Deepak", "Arrange the digits from largest to smallest: 8632. Then from smallest to largest: 2368. Subtract. 8632 minus 2368 is 6264.",
          "Digits ko bade se chhote kram mein rakho: 8632. Phir chhote se bade kram mein: 2368. Ghatao. 8632 minus 2368 barabar 6264."),
    ], {"mode": "kaprekar", "start": 6382, "step": 1}),
    scene([
        L("Disha", "Again with 6264. 6642 minus 2466 is 4176. And again, 7641 minus 1467 is 6174!",
          "Phir se 6264 ke saath. 6642 minus 2466 barabar 4176. Aur phir, 7641 minus 1467 barabar 6174!"),
    ], {"mode": "kaprekar", "start": 6382, "step": 3}),
    scene([
        L("Harsh", "One more time. 7641 minus 1467 is 6174 again! The machine is stuck!", "Ek baar aur. 7641 minus 1467 phir se 6174! Machine atak gayi!"),
        L("Dadi", "That is the magic number 6174, called Kaprekar's constant.", "Yahi hai jaadui number 6174, jise Kaprekar's constant kehte hain."),
    ], {"mode": "kaprekar", "start": 6382, "step": 4}),
    scene([
        L("Dadi", "It is named after D. R. Kaprekar, a school teacher from Devlali in Maharashtra, who loved playing with numbers. He announced it in 1949. Any 4-digit number whose digits are not all the same reaches 6174 in at most 7 steps.",
          "Iska naam D. R. Kaprekar par hai, jo Maharashtra ke Devlali mein school teacher the aur numbers se khelna pasand karte the. Unhone 1949 mein ise duniya ko bataaya. Har 4 digit ka number, jiske saare digits ek jaise na hon, zyaada se zyaada 7 steps mein 6174 tak pahunchta hai."),
        L("Deepak", "I tried 1947, the year India became independent. It reached 6174 in 5 steps!", "Maine 1947 try kiya, jis saal Bharat azaad hua. Woh 5 steps mein 6174 tak pahuncha!"),
    ], {"mode": "kaprekar", "start": 1947, "step": 5}),
    scene([
        L("Disha", "What about 3-digit numbers?", "Aur 3 digit ke numbers?"),
        L("Dadi", "They end at 495. Try 352. It goes 297, 693, 594, and then 495!", "Woh 495 par khatam hote hain. 352 try karo. Yeh jaata hai 297, 693, 594, aur phir 495!"),
    ], {"mode": "kaprekar", "digits": 3, "start": 352, "step": 4}),
    scene([
        L("Dadi", "Now a mystery that no one has solved. Pick a number. If it is even, halve it. If it is odd, multiply it by 3 and add 1. Keep going.",
          "Ab ek rahasya jise aaj tak koi suljha nahi paaya. Ek number chuno. Even ho toh aadha karo. Odd ho toh 3 se guna karke 1 jodo. Aise hi chalte raho."),
        L("Harsh", "7 goes 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1. It reached 1 after 16 steps!",
          "7 se chalta hai 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1. 16 steps mein 1 aa gaya!"),
    ], {"mode": "collatz", "start": 7}),
    scene([
        L("Disha", "27 climbs all the way up to 9232 before it falls back to 1, after 111 steps!", "27 toh 9232 tak chadh jaata hai, aur phir 111 steps ke baad 1 par girta hai!"),
        L("Dadi", "In 1937, the German mathematician Lothar Collatz asked: does every number fall to 1? Computers have checked enormous numbers, but nobody has proved it. Maybe one of you will!",
          "1937 mein German mathematician Lothar Collatz ne poocha: kya har number aakhir mein 1 par girta hai? Computers ne bahut bade bade numbers check kiye, lekin aaj tak koi ise prove nahi kar paaya. Shaayad aap mein se koi karega!"),
    ], {"mode": "collatz", "start": 27}),
    scene([
        L("Dadi", "Your turn! Type your own 4-digit number, like your birth year, and press next step until you reach 6174.",
          "Ab aapki baari! Apna 4 digit ka number likho, jaise apna janm ka saal, aur next step dabaate raho jab tak 6174 na aa jaaye."),
    ], {"mode": "kaprekar", "start": 2012, "step": 0, "task": True}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "It is the final of the colony cricket tournament, and the small stand is packed with fans.", "Colony cricket tournament ka final hai, aur chhota stand fans se khachaakhach bhara hai."),
        L("Dadi", "Before the match, a question. How many fans are sitting in this stand? Make a guess!", "Match se pehle ek sawaal. Is stand mein kitne fans baithe hain? Andaaza lagao!"),
    ], {"mode": "estimate", "step": 0}),
    scene([
        L("Deepak", "Engineers never count one by one. Split the stand into equal boxes. 4 rows of 5 boxes make 20 boxes.",
          "Engineer kabhi ek ek karke nahi ginte. Stand ko barabar dabbon mein baanto. 5 dabbon ki 4 kataarein, yaani 20 dabbe."),
    ], {"mode": "estimate", "step": 1}),
    scene([
        L("Disha", "Now count just one box. 1, 2, 3 and so on. 22 fans!", "Ab sirf ek dabba gino. 1, 2, 3 aur aage. 22 fans!"),
    ], {"mode": "estimate", "step": 2}),
    scene([
        L("Harsh", "20 boxes times 22 fans is 440. About 440 fans!", "20 dabbe guna 22 fans barabar 440. Lagbhag 440 fans!"),
        L("Dadi", "And the real count is 437. Very close! That is estimation: a smart guess using a little counting and some multiplication.",
          "Aur asli ginti 437 hai. Bahut kareeb! Yahi estimation hai: thodi ginti aur thode guna se ek samajhdaar andaaza."),
    ], {"mode": "estimate", "step": 3}),
    scene([
        L("Neha", "I estimate in my bakery too. 48 boxes of 21 laddoos is about 50 times 20, which is 1,000 laddoos. The exact answer is 1,008.",
          "Main bakery mein bhi andaaza lagaati hoon. 21 laddoo wale 48 dabbe, lagbhag 50 guna 20, yaani 1,000 laddoo. Sahi jawaab 1,008 hai."),
    ], {"mode": "estimate", "step": 3}),
    scene([
        L("Narrator", "During the drinks break, Harsh challenges Dadi to the Game of 21.", "Drinks break mein Harsh Dadi ko 21 ke khel ki chunauti deta hai."),
        L("Harsh", "We start at 0 and take turns adding 1, 2 or 3. Whoever says 21 wins!", "Hum 0 se shuru karte hain aur baari baari 1, 2 ya 3 jodte hain. Jo 21 bolega, woh jeetega!"),
    ], {"mode": "game", "max": 3, "total": 0}),
    scene([
        L("Disha", "Dadi won again! How?", "Dadi phir jeet gayin! Kaise?"),
        L("Dadi", "If I say 17, whatever Harsh adds, 1, 2 or 3, I add 3, 2 or 1 to make 21. So 17 is a magic number.",
          "Agar main 17 bolun, toh Harsh 1, 2 ya 3 kuch bhi jode, main 3, 2 ya 1 jodkar 21 bana deti hoon. Isliye 17 ek magic number hai."),
    ], {"mode": "game", "max": 3, "total": 17, "showMagic": True}),
    scene([
        L("Dadi", "To be sure of saying 17, I say 13. Before that 9, then 5, then 1. Each magic number is 4 less, because 1 plus 3, 2 plus 2 and 3 plus 1 all make 4. So the first player says 1 and can always win!",
          "17 pakka bolne ke liye main 13 bolti hoon. Usse pehle 9, phir 5, phir 1. Har magic number 4 kam hai, kyonki 1 plus 3, 2 plus 2 aur 3 plus 1, sab 4 banaate hain. Toh pehla khiladi 1 bole, toh hamesha jeet sakta hai!"),
    ], {"mode": "game", "max": 3, "total": 1, "showMagic": True}),
    scene([
        L("Deepak", "Now change the rule. Add only 1 or 2. The magic numbers jump by 3: 21, 18, 15, all the way down to 0. Since the game starts at 0, the second player can always win!",
          "Ab niyam badlo. Sirf 1 ya 2 jodo. Magic numbers 3 ki chhalaang lagaate hain: 21, 18, 15, neeche 0 tak. Khel 0 se shuru hota hai, isliye doosra khiladi hamesha jeet sakta hai!"),
    ], {"mode": "game", "max": 2, "total": 0, "showMagic": True}),
    scene([
        L("Dadi", "Your turn! You go first. Add 1, 2 or 3, and beat the computer!", "Ab aapki baari! Pehle aap chalo. 1, 2 ya 3 jodo, aur computer ko haraao!"),
    ], {"mode": "game", "max": 3, "total": 0, "task": True}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "On Sunday night, Dadi writes number puzzles on the fridge whiteboard.", "Ravivaar ki raat Dadi fridge ke whiteboard par number paheliyaan likhti hain."),
        L("Dadi", "Question 1. Five children stand in a line. What number does each one call out?", "Sawaal 1. Paanch bachche ek line mein khade hain. Har ek kaun sa number bolega?"),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "The first child has only one neighbour, and that neighbour is shorter, so she says 0. The middle child, 133 centimetres, has taller children on both sides, so he says 2.",
          "Pehle bachche ka sirf ek padosi hai, aur woh chhota hai, toh woh 0 bolegi. Beech wala bachcha, 133 centimetre, dono taraf lambe bachchon se ghira hai, toh woh 2 bolega."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Harsh", "So the line calls out 0, 1, 2, 1, 0!", "Toh line bolti hai 0, 1, 2, 1, 0!"),
    ], {"example": 0, "step": 5}),
    scene([
        L("Dadi", "Question 2. How many supercells are in the row 46, 82, 37, 65, 91, 28, 54?", "Sawaal 2. Kataar 46, 82, 37, 65, 91, 28, 54 mein kitne supercells hain?"),
        L("Harsh", "82, 91 and 54. That is 3 supercells.", "82, 91 aur 54. Yaani 3 supercells."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _grid_table(g, supers=()):
    rows = "".join(
        "<tr>" + "".join(
            f'<td class="border border-slate-700 px-2 py-1 text-center {"text-amber-300 font-bold" if v in supers else ""}">{v}</td>' for v in r
        ) + "</tr>" for r in g
    )
    return f'<table class="my-3 text-sm font-mono">{rows}</table>'


PARTS = [
    {
        "title": "Story 1: The Team Photo · Numbers Can Tell Us Things",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Harsh's cricket team lines up for a photo. Dadi asks every child to call out how many of the children right next to them are taller.</div>

<h2>The rule of the game</h2>
<p>Each child looks only at the children <strong>standing right next to them</strong> (their neighbours) and calls out how many of them are taller.</p>
<div {CARD}>
  <div>A child in the middle has 2 neighbours, so can say <strong>0, 1 or 2</strong>.</div>
  <div>A child at either end has only 1 neighbour, so can say only <strong>0 or 1</strong>.</div>
</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Heights in the line (cm)</th><th class="text-left">Numbers called out</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>138, 148, 133, 153, 143</td><td>1, 0, 2, 0, 1</td></tr>
    <tr><td>133, 138, 143, 148, 153 (shortest to tallest)</td><td>1, 1, 1, 1, 0</td></tr>
    <tr><td>143, 138, 133, 148, 153</td><td>0, 1, 2, 1, 0</td></tr>
    <tr><td>153, 133, 148, 138, 143</td><td>0, 2, 0, 2, 0</td></tr>
  </tbody>
</table>
<h2>What the numbers tell us</h2>
<ul>
  <li>The <strong>tallest</strong> child always says 0.</li>
  <li>So the whole line can never say all 0s (the tallest child's neighbour must say at least 1), unless everyone is the same height.</li>
  <li>Two neighbours can never <strong>both</strong> say 2: each would have to be taller than the other.</li>
  <li>Five children of different heights can never all say 1, because the tallest says 0.</li>
</ul>
""",
        "keyInsight": "Simple numbers called out by a line of children reveal a lot about how the line is arranged.",
        "widgetType": "Class6TallerNeighboursWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Five children of different heights stand in a line. Which of these lists of called-out numbers is IMPOSSIBLE?",
            "options": ["0, 2, 0, 2, 0", "1, 1, 1, 1, 0", "1, 1, 1, 1, 1", "0, 1, 2, 1, 0"],
            "correctIndex": 2,
            "explanation": "The tallest child always says 0, so all five can never say 1.",
        },
        "teacherNotes": teacher(
            [
                "Act it out: call 5 students of different heights to the front and let the class predict each child's number before they say it.",
                "Stress the word 'neighbours': only the children immediately next to you count, not everyone in the line.",
                "Ask 'what is impossible?' questions; explaining why something can never happen is real mathematical reasoning.",
            ],
            [
                "Counting all taller children in the line instead of only the neighbours.",
                "Forgetting that end children have only one neighbour.",
            ],
            "Line-up challenge: groups of 5 get a target list such as 0, 2, 0, 2, 0 or 1, 1, 1, 1, 0 and must arrange themselves to match it, or explain why it is impossible.",
            "Ganita Prakash Ch. 3, 3.1 (Numbers can tell us things).",
        ),
    },
    {
        "title": "Story 2: Mummy's Order Book · Supercells",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Mummy writes her laddoo orders in boxes. Dadi shows that some boxes are "supercells": bigger than everything around them.</div>

<div {FORMULA}>Supercell = a cell whose number is bigger than all its neighbours</div>
<p>In a <strong>row</strong>, the neighbours are the cells just left and right. In a <strong>table</strong>, the neighbours are the cells that share a side: above, below, left and right.</p>

<h2>Example: a row</h2>
<p>46, <strong class="text-amber-300">82</strong>, 37, 65, <strong class="text-amber-300">91</strong>, 28, <strong class="text-amber-300">54</strong> has 3 supercells. The end cell 54 only has to beat 28.</p>

<h2>Example: a table</h2>
{_grid_table(TRAY, (52, 40, 61, 45, 73, 56))}
<p>Supercells: 52, 40, 61, 45, 73 and 56 (6 supercells).</p>

<h2>Facts that are always true</h2>
<div {CARD}>
  <div>The <strong>largest</strong> number is always a supercell.</div>
  <div>The <strong>smallest</strong> number can never be a supercell.</div>
  <div>Two supercells can never be neighbours (each would have to be bigger than the other).</div>
  <div>A row of 7 cells can have at most 4 supercells (every other cell, starting from the first).</div>
  <div>A 4 × 4 table can have at most 8 supercells, arranged like the dark squares of a chessboard.</div>
</div>
{_grid_table(CHESS, tuple(range(9, 17)))}
""",
        "keyInsight": "A supercell beats all its neighbours, so supercells can never sit next to each other.",
        "widgetType": "Class6SupercellsWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "How many supercells are in the row 15, 9, 22, 30, 18, 7, 12?",
            "options": ["2", "3", "4", "5"],
            "correctIndex": 1,
            "explanation": "15 (beats 9), 30 (beats 22 and 18) and 12 (beats 7) are supercells: 3 in all.",
        },
        "teacherNotes": teacher(
            [
                "Start with a single row on the board, then move to a table; the idea of 'neighbours' changes.",
                "Ask why the largest number must be a supercell, and why two supercells cannot touch.",
                "Use the chessboard pattern to show the maximum number of supercells in a 4 × 4 table.",
            ],
            [
                "Counting diagonal cells as neighbours (only cells that share a side count).",
                "Forgetting that end and corner cells have fewer neighbours.",
            ],
            "Supercell race: each pair fills a 3 × 3 table with 1 to 9. The pair with the most supercells wins. (The best possible is 5, using the corners and the centre.)",
            "Ganita Prakash Ch. 3, 3.2 (Supercells).",
        ),
    },
    {
        "title": "Story 3: The Train Ride · Digit Detectives and the Number Line",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>On the train from Jaipur to Delhi, Papa turns the family into digit detectives.</div>

<div {FORMULA}>Digit sum of 68 = 6 + 8 = 14</div>
<h2>Numbers up to 100 with the same digit sum</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Digit sum</th><th class="text-left">Numbers up to 100</th><th>How many</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>5</td><td>5, 14, 23, 32, 41, 50</td><td class="text-center">6</td></tr>
    <tr><td>9</td><td>9, 18, 27, 36, 45, 54, 63, 72, 81, 90</td><td class="text-center">10</td></tr>
    <tr><td>12</td><td>39, 48, 57, 66, 75, 84, 93</td><td class="text-center">7</td></tr>
    <tr><td>14</td><td>59, 68, 77, 86, 95</td><td class="text-center">5</td></tr>
  </tbody>
</table>
<h2>Pattern on the number line</h2>
<p>Numbers (up to 99) with the same digit sum are always <strong>9 apart</strong>: going from one to the next, the tens digit goes up by 1 (+10) and the ones digit goes down by 1 (−1), so the jump is +9.</p>

<h2>More detective cases</h2>
<div {CARD}>
  <div>The digit 7 is written <strong>20 times</strong> from 1 to 100: 10 times in the ones place (7, 17, …, 97) and 10 times in the tens place (70 to 79). 77 has both.</div>
  <div>The smallest number with digit sum 14 is <strong>59</strong>; the largest 5-digit one is <strong>95,000</strong>.</div>
  <div>There are 9 one-digit numbers (1 to 9), 90 two-digit numbers (10 to 99) and 900 three-digit numbers (100 to 999).</div>
</div>
""",
        "keyInsight": "Numbers with the same digit sum sit 9 apart on the number line, because +10 −1 = +9.",
        "widgetType": "Class6DigitPlayWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "How many numbers from 1 to 100 have a digit sum of 10?",
            "options": ["8", "9", "10", "11"],
            "correctIndex": 1,
            "explanation": "19, 28, 37, 46, 55, 64, 73, 82 and 91: that is 9 numbers.",
        },
        "teacherNotes": teacher(
            [
                "Give each student a 1 to 100 chart and let them colour all numbers with digit sum 10; the diagonal pattern appears by itself.",
                "Ask why the numbers are 9 apart before revealing the +10 −1 idea.",
            ],
            [
                "Counting 77 as one seven instead of two in the digit-count problem.",
                "Forgetting numbers like 50 (digit sum 5) or 90 (digit sum 9) that end in 0.",
            ],
            "Digit detectives: each group picks a digit sum from 1 to 18 and finds all numbers up to 100 with it. Which digit sum has the most numbers? (Digit sum 9 wins, with 10 numbers.)",
            "Ganita Prakash Ch. 3, 3.3 and 3.4 (Patterns of numbers on the number line; Playing with digits).",
        ),
    },
    {
        "title": "Story 4: Diwali Night · Palindromes, Clocks and Calendars",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On Diwali night, Disha's rangoli hides the number 12321, and the family hunts for numbers that read the same both ways.</div>

<div {FORMULA}>Palindrome = reads the same from left to right and from right to left</div>
<p>Examples: 7, 55, 121, 363, 4884, 12321.</p>

<h2>Reverse and add</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Start</th><th class="text-left">Steps</th><th>Palindrome</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>39</td><td>39 + 93 = 132, 132 + 231 = 363</td><td class="text-center">363 (2 steps)</td></tr>
    <tr><td>87</td><td>165, 726, 1353, 4884</td><td class="text-center">4884 (4 steps)</td></tr>
    <tr><td>89</td><td>24 steps!</td><td class="text-center">8,813,200,023,188</td></tr>
    <tr><td>196</td><td>No one knows if it ever reaches a palindrome</td><td class="text-center">?</td></tr>
  </tbody>
</table>

<h2>Palindromic times</h2>
<p>On a 12-hour clock: 1:01, 1:11, …, 1:51 (6 every hour from 1 to 9 o'clock, so 54), plus 10:01, 11:11 and 12:21. That is <strong>57</strong> palindromic times in 12 hours.</p>

<h2>Palindromic dates (DD-MM-YYYY)</h2>
<div {CARD}>
  <div>02-02-2020 → 02022020</div>
  <div>12-02-2021 → 12022021</div>
  <div>22-02-2022 → 22022022</div>
  <div>Next ones to look out for: 03-02-2030, 13-02-2031.</div>
</div>
""",
        "keyInsight": "Reversing and adding usually leads to a palindrome, but for some numbers like 196 it is still a mystery.",
        "widgetType": "Class6PalindromeWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Start with 57. Reverse and add until you get a palindrome. Which palindrome do you reach?",
            "options": ["121", "242", "363", "484"],
            "correctIndex": 2,
            "explanation": "57 + 75 = 132, then 132 + 231 = 363.",
        },
        "teacherNotes": teacher(
            [
                "Begin with words (MALAYALAM, NITIN) before numbers; students love finding palindromic names.",
                "Let each student pick a 2-digit number and run reverse-and-add; collect results on the board.",
                "Mention 196 as an open problem: mathematics still has unanswered questions.",
            ],
            [
                "Reversing only part of the number, or adding the reverse incorrectly when there is a carry.",
                "Writing times like 1:01 as 101 but forgetting that 10:01 has four digits.",
            ],
            "Palindrome hunt: in 10 minutes, find as many palindromic times on a 12-hour clock as possible. Then check against the total of 57.",
            "Ganita Prakash Ch. 3, 3.5 and 3.7 (Pretty palindromic patterns; Clock and calendar numbers).",
        ),
    },
    {
        "title": "Story 5: Papa's Railway Puzzle · Kaprekar's 6174 and the Collatz Mystery",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Papa brings home a puzzle from a railway quiz: a number machine that always ends at 6174. Dadi follows it with a mystery no one has ever solved.</div>

<h2>Kaprekar's routine</h2>
<ol>
  <li>Take a 4-digit number whose digits are not all the same.</li>
  <li>Arrange the digits from largest to smallest, and from smallest to largest.</li>
  <li>Subtract the smaller number from the larger one. Repeat with the answer.</li>
</ol>
<div {CARD}>
  <div>6382 → 8632 − 2368 = 6264</div>
  <div>6264 → 6642 − 2466 = 4176</div>
  <div>4176 → 7641 − 1467 = <strong class="text-emerald-300">6174</strong></div>
  <div>6174 → 7641 − 1467 = 6174 (stuck forever!)</div>
</div>
<div {FORMULA}>Every such 4-digit number reaches 6174 in at most 7 steps</div>
<p>Keep leading zeros: from 2111 we get 2111 − 1112 = 0999, then 9990 − 0999 = 8991. For 3-digit numbers the magic number is <strong>495</strong>.</p>
<p><strong>History:</strong> D. R. Kaprekar (1905–1986) was a school mathematics teacher in Devlali, Maharashtra. He announced this discovery in 1949; 6174 is now called Kaprekar's constant.</p>

<h2>An unsolved mystery: the Collatz conjecture</h2>
<div {FORMULA}>Even → divide by 2      Odd → multiply by 3, then add 1</div>
<p>7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (16 steps). 27 climbs as high as 9232 and takes 111 steps.</p>
<p>Lothar Collatz asked in 1937 whether every starting number reaches 1. Computers have checked enormous numbers, but nobody has proved it for all numbers.</p>
""",
        "keyInsight": "Kaprekar's routine always lands on 6174, while the simple Collatz rule hides a mystery still unsolved.",
        "widgetType": "Class6NumberMachinesWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "Apply one step of Kaprekar's routine to 3524. What do you get?",
            "options": ["2088", "3087", "6174", "8352"],
            "correctIndex": 1,
            "explanation": "Largest 5432 − smallest 2345 = 3087. (Then 8730 − 0378 = 8352, and 8532 − 2358 = 6174.)",
        },
        "teacherNotes": teacher(
            [
                "Have every student start with their birth year; it is exciting when everyone lands on 6174.",
                "Insist on keeping 4 digits (0999, not 999); otherwise the routine goes wrong.",
                "Present Collatz as a real open problem; even young students can test it and wonder.",
            ],
            [
                "Dropping the leading zero (writing 999 instead of 0999).",
                "Subtraction mistakes with borrowing; encourage checking by addition.",
                "In Collatz, adding 1 before multiplying by 3.",
            ],
            "Kaprekar race: everyone writes their birth year and runs the routine. Record on the board how many steps each person needed. Who needed the most (the maximum possible is 7)?",
            "Ganita Prakash Ch. 3, 3.6 and 3.10 (The magic number of Kaprekar; An unsolved mystery: the Collatz conjecture).",
        ),
    },
    {
        "title": "Story 6: The Cricket Final · Estimation and the Game of 21",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>At the colony cricket final, the family estimates the crowd, and Dadi keeps winning the Game of 21 during the drinks break.</div>

<h2>Estimation</h2>
<p>Split a crowd into equal boxes, count one box, and multiply.</p>
<div {FORMULA}>20 boxes × about 22 fans ≈ 440 fans   (actual: 437)</div>
<h2>Mental maths with round numbers</h2>
<div {CARD}>
  <div>48 × 21 ≈ 50 × 20 = 1,000 (exact: 1,008)</div>
  <div>489 × 92 ≈ 500 × 90 = 45,000 (exact: 44,988)</div>
  <div>Round each number to something easy, then multiply in your head.</div>
</div>

<h2>The Game of 21</h2>
<p>Start at 0. Two players take turns adding 1, 2 or 3. The player who says 21 wins.</p>
<div {FORMULA}>Magic numbers: 1, 5, 9, 13, 17, 21 (each 4 apart)</div>
<p><strong>Why it works:</strong> whatever your opponent adds (1, 2 or 3), you add (3, 2 or 1) to make the round total 4. So once you say a magic number, you can say every magic number after it. The first player says 1 and can always win.</p>
<p><strong>Change the rule:</strong> if you may add only 1 or 2, the magic numbers are 21, 18, 15, …, 3, 0 (multiples of 3). The game starts at 0, a magic number, so the <em>second</em> player can always win.</p>
""",
        "keyInsight": "Estimate with easy numbers; win games by working backwards from the target to find the magic numbers.",
        "widgetType": "Class6Game21Widget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "In the Game of 21 (add 1, 2 or 3), your friend has just said 10. What should you add?",
            "options": ["1", "2", "3", "It does not matter"],
            "correctIndex": 2,
            "explanation": "The next magic number after 10 is 13, so add 3. Then keep jumping to 17 and 21.",
        },
        "teacherNotes": teacher(
            [
                "Let pairs play the Game of 21 several times before discussing strategy; most students discover 17 on their own.",
                "Model 'working backwards' explicitly: start from 21 and ask which number guarantees it.",
                "For estimation, compare everyone's first guess with the box-counting estimate.",
            ],
            [
                "Thinking the magic numbers are multiples of 3 in the 1-2-3 version (they are 4 apart).",
                "Rounding in estimation and then forgetting to say 'about'.",
            ],
            "Game tournament: pairs play 21 with 'add 1, 2 or 3', then invent a new version (for example, reach 30 adding 1 to 4) and find its magic numbers.",
            "Ganita Prakash Ch. 3, 3.8, 3.11 and 3.12 (Mental math; Simple estimation; Games and winning strategies).",
        ),
    },
    {
        "title": "Solved Questions · 10 number play puzzles, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>On Sunday night, Dadi fills the fridge whiteboard with number puzzles. Harsh and Disha race to crack each one.</div>
<h2>Number play toolkit</h2>
<ol>
  <li>Taller neighbours: an end child can say at most 1; the tallest always says 0.</li>
  <li>Supercell: bigger than all its neighbours.</li>
  <li>Digit sums: same digit sum (up to 99) means 9 apart.</li>
  <li>Palindromes: reverse and add until it reads the same both ways.</li>
  <li>Kaprekar: largest − smallest, repeat; 6174 (4 digits), 495 (3 digits).</li>
  <li>Collatz: even → half, odd → 3 × n + 1.</li>
  <li>Games: work backwards from the target to find the magic numbers.</li>
</ol>
<p>Try each question in your notebook before revealing the steps.</p>
""",
        "keyInsight": "Most number puzzles crack open once you find the rule and test it carefully.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {"title": "Taller neighbours", "question": "Five children stand in a line with heights 143, 138, 133, 148 and 153 cm (in that order). Each calls out how many of their neighbours are taller. What does each child say?",
                 "steps": ["143 cm (end): its only neighbour, 138, is shorter → <strong>0</strong>",
                           "138 cm: neighbours 143 (taller) and 133 (shorter) → <strong>1</strong>",
                           "133 cm: neighbours 138 and 148 are both taller → <strong>2</strong>",
                           "148 cm: neighbours 133 (shorter) and 153 (taller) → <strong>1</strong>",
                           "153 cm (end, tallest) → <strong>0</strong>. The line says <strong>0, 1, 2, 1, 0</strong>"],
                 "answer": "0, 1, 2, 1, 0"},
                {"title": "Supercells in a row", "question": "How many supercells are there in the row 46, 82, 37, 65, 91, 28, 54?",
                 "steps": ["82 > 46 and 82 > 37 → supercell", "91 > 65 and 91 > 28 → supercell", "54 is at the end and 54 > 28 → supercell. Total: <strong>3</strong>"],
                 "answer": "3 supercells (82, 91, 54)"},
                {"title": "Digit sum 14", "question": "List all numbers from 1 to 100 whose digit sum is 14.",
                 "steps": ["One-digit numbers have digit sum at most 9, so we need two digits that add to 14.", "Pairs: 5 + 9, 6 + 8, 7 + 7, 8 + 6, 9 + 5", "Numbers: 59, 68, 77, 86, 95. That is <strong>5 numbers</strong>, each 9 apart."],
                 "answer": "59, 68, 77, 86, 95"},
                {"title": "Smallest and largest", "question": "What is the smallest number with digit sum 14? What is the largest 5-digit number with digit sum 14?",
                 "steps": ["Smallest: use as few digits as possible, so two digits. Put the biggest digit, 9, in the ones place: 14 − 9 = 5 → <strong>59</strong>.", "Largest 5-digit: put the biggest digits first: 9, then 14 − 9 = 5, then zeros → <strong>95,000</strong>."],
                 "answer": "59 and 95,000"},
                {"title": "Reverse and add", "question": "Start with 87. Reverse and add until you get a palindrome.",
                 "steps": ["87 + 78 = 165", "165 + 561 = 726", "726 + 627 = 1353", "1353 + 3531 = <strong>4884</strong>, a palindrome after 4 steps"],
                 "answer": "4884"},
                {"title": "Palindromic times", "question": "Which palindromic times does a 12-hour clock show between 10:00 and 12:59? How many minutes apart are they?",
                 "steps": ["With 4 digits, the minutes must be the hour digits reversed.", "10 → 10:01, 11 → 11:11, 12 → 12:21", "10:01 to 11:11 is 70 minutes; 11:11 to 12:21 is also <strong>70 minutes</strong>."],
                 "answer": "10:01, 11:11, 12:21 (70 minutes apart)"},
                {"title": "Kaprekar with a year", "question": "Run Kaprekar's routine starting from 2012.",
                 "steps": ["2210 − 0122 = 2088", "8820 − 0288 = 8532", "8532 − 2358 = <strong>6174</strong> in 3 steps"],
                 "answer": "6174 after 3 steps"},
                {"title": "Collatz from 6", "question": "Apply the Collatz rule (even → half, odd → 3 × n + 1) starting from 6. How many steps to reach 1?",
                 "steps": ["6 → 3 → 10 → 5 → 16", "16 → 8 → 4 → 2 → 1", "Count the arrows: <strong>8 steps</strong>"],
                 "answer": "8 steps"},
                {"title": "Game of 21", "question": "In the Game of 21 (each turn add 1, 2 or 3), your friend has just said 10. What should you add, and what should you say after that?",
                 "steps": ["Work backwards from 21 in jumps of 4: 21, 17, 13, 9, 5, 1 are the magic numbers.", "From 10, the next magic number is 13, so add <strong>3</strong>.", "Then whatever your friend adds, make the round total 4: say 17, then 21."],
                 "answer": "Add 3 to say 13, then 17, then 21"},
                {"title": "Quick estimation", "question": "Estimate 489 × 92 using round numbers. How close is the estimate?",
                 "steps": ["489 ≈ 500 and 92 ≈ 90", "500 × 90 = 45,000", "Exact: 489 × 92 = 44,988. The estimate is only <strong>12</strong> more."],
                 "answer": "About 45,000 (exact 44,988)"},
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            ["Ask students which 'rule' each puzzle uses before they start calculating."],
            ["Q4: writing 95 instead of 95,000 for the largest 5-digit number.", "Q7: dropping the zero in 0122 and 0288."],
            "Make a puzzle: each student invents one number-play question (supercells, palindromes, Kaprekar or a game) and swaps it with a partner.",
            "Covers Ganita Prakash Ch. 3 'Figure it out' exercises.",
        ),
    },
    {
        "title": "Chapter Exam · Number Play (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From team photos to Diwali palindromes and Kaprekar's machine, you have played with numbers in many ways. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> on taller neighbours, supercells, digit sums, palindromes, Kaprekar's constant, the Collatz rule and the Game of 21.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Look for the rule, test it, and explain why it always works.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Number Play · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "Children call out how many of their neighbours are taller. What is the largest number a child at the END of the line can call out?", "options": ["0", "1", "2", "3"], "answer": 1,
                 "explanation": "An end child has only one neighbour, so at most 1.", "topic": "Numbers can tell us things"},
                {"q": "In any table of different numbers, which number is ALWAYS a supercell?", "options": ["The smallest", "The largest", "The one in the centre", "The one in a corner"], "answer": 1,
                 "explanation": "Nothing is bigger than the largest number, so it beats all its neighbours.", "topic": "Supercells"},
                {"q": "How many numbers from 1 to 100 have a digit sum of 14?", "options": ["4", "5", "6", "7"], "answer": 1,
                 "explanation": "59, 68, 77, 86 and 95.", "topic": "Digit sums"},
                {"q": "How many times is the digit 7 written when you write all the numbers from 1 to 100?", "options": ["10", "11", "19", "20"], "answer": 3,
                 "explanation": "10 times in the ones place (7, 17, …, 97) and 10 times in the tens place (70–79).", "topic": "Playing with digits"},
                {"q": "Which of these numbers is a palindrome?", "options": ["1231", "4848", "4884", "6060"], "answer": 2,
                 "explanation": "4884 reads the same from both ends.", "topic": "Palindromes"},
                {"q": "Start with 48 and reverse-and-add until you get a palindrome. Which palindrome do you reach?", "options": ["132", "363", "484", "444"], "answer": 1,
                 "explanation": "48 + 84 = 132, then 132 + 231 = 363.", "topic": "Reverse and add"},
                {"q": "Which number is Kaprekar's constant for 4-digit numbers?", "options": ["495", "1089", "6174", "9999"], "answer": 2,
                 "explanation": "Kaprekar's routine on 4-digit numbers always ends at 6174 (495 is the 3-digit one).", "topic": "Kaprekar's constant"},
                {"q": "Apply one step of Kaprekar's routine to 6264. What do you get?", "options": ["4176", "6174", "2088", "3087"], "answer": 0,
                 "explanation": "6642 − 2466 = 4176.", "topic": "Kaprekar's routine"},
                {"q": "Collatz rule: even → half, odd → 3 × n + 1. What comes after 7?", "options": ["14", "21", "22", "8"], "answer": 2,
                 "explanation": "7 is odd, so 3 × 7 + 1 = 22.", "topic": "Collatz conjecture"},
                {"q": "In the Game of 21 where each turn adds 1, 2 or 3, which numbers should you try to say?", "options": ["3, 6, 9, 12, 15, 18, 21", "1, 5, 9, 13, 17, 21", "2, 4, 6, 8, …, 20", "Only odd numbers"], "answer": 1,
                 "explanation": "Working back from 21 in jumps of 4 gives 17, 13, 9, 5, 1.", "topic": "Winning strategies"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the right story."],
            ["Q8 checks careful subtraction; Q10 checks the 'jumps of 4' idea rather than multiples of 3."],
            "Exit ticket: write your birth year's Kaprekar chain and one palindromic time.",
            "Matches Ganita Prakash Ch. 3 learning outcomes.",
        ),
    },
]


def seed_class6_number_play():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Number Play")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Number Play: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Number Play: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_number_play()
