import json
from db import SessionLocal
from seed_class10_structure import get_class10_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 10 · Arithmetic Progressions (NCERT Class 10 Mathematics, rationalised syllabus, Ch. 5: 5.1 Introduction,
# 5.2 Arithmetic Progressions, 5.3 nth term of an AP, 5.4 Sum of first n terms of an AP).
# Story: the Jaipur family during board-exam preparation: Diwali diyas, Papa's railway signals, a revision drill,
# the Gauss story, Mummy's shop display and saving / stacking word problems.
#
# Verified facts used:
# - The Gauss schoolboy story: the earliest account is in Sartorius von Waltershausen's memorial volume (1856),
#   which says Gauss was about seven and quickly summed an arithmetic series; it does not name 1 to 100 or the
#   pairing method, which were added in later retellings. (Brian Hayes, "Gauss's Day of Reckoning",
#   American Scientist, May-June 2006.) Narration says "a famous story" and that the 1 to 100 detail came later.
# - All other numbers are textbook-style or invented household figures (no real-world statistics).


SCENES_1 = [
    scene([
        L("Narrator", "It is Diwali week in Jaipur. Harsh and Disha are in Class 10 now, and the board exams are a few months away.",
          "Jaipur mein Diwali ka hafta hai. Harsh aur Disha ab Class 10 mein hain, aur board exams kuch hi mahine door hain."),
        L("Dadi", "Before you study, help me with the diyas. First row 3 diyas, next row 5, then 7, then 9.",
          "Padhaai se pehle diyon mein madad karo. Pehli row mein 3 diye, agli mein 5, phir 7, phir 9."),
    ], {"a": 3, "d": 2, "n": 4, "caption": "Diyas in each row"}),
    scene([
        L("Disha", "Every row has 2 more than the one before. The jump is always the same!",
          "Har row mein pichhli se 2 zyaada hain. Jump hamesha same hai!"),
        L("Dadi", "A list of numbers where each term is got by adding a fixed number to the previous term is an arithmetic progression, an A P. The fixed number is the common difference, d.",
          "Aisi list jismein har term pichhle term mein ek fixed number jodkar milta hai, arithmetic progression kehlaati hai, yaani A P. Woh fixed number common difference hai, d."),
    ], {"a": 3, "d": 2, "n": 6, "caption": "Diyas in each row"}),
    scene([
        L("Neha", "My shop has an AP too. I started Diwali week with 50 kilograms of flour and use 5 kilograms a day. 50, 45, 40, 35.",
          "Meri shop mein bhi AP hai. Diwali hafte ki shuruaat 50 kilo aate se ki, aur roz 5 kilo lagta hai. 50, 45, 40, 35."),
        L("Dadi", "Here d is minus 5. The common difference can be negative. Always find it as a term minus the term before it.",
          "Yahan d minus 5 hai. Common difference negative bhi ho sakta hai. Use hamesha term minus usse pehle wala term karke nikaalo."),
    ], {"a": 50, "d": -5, "n": 6, "caption": "Flour left each day, in kg"}),
    scene([
        L("Harsh", "And my pocket money is 200 rupees every month, no raise at all. 200, 200, 200. Is that an AP too?",
          "Aur meri pocket money har mahine 200 rupaye hai, koi badhotri nahi. 200, 200, 200. Kya yeh bhi AP hai?"),
        L("Dadi", "Yes! The common difference is 0. Sad for you, but still an AP.", "Haan! Common difference 0 hai. Tumhaare liye dukh ki baat, par AP toh hai!"),
    ], {"a": 200, "d": 0, "n": 5, "caption": "Harsh's pocket money each month"}),
    scene([
        L("Disha", "What about 1, 4, 9, 16? The jumps are 3, 5, 7.", "Aur 1, 4, 9, 16? Jumps hain 3, 5, 7."),
        L("Dadi", "The jumps change, so it is not an AP. Same for 1, 2, 4, 8, where the jumps keep doubling.",
          "Jumps badal rahe hain, isliye yeh AP nahi hai. Waise hi 1, 2, 4, 8, jahan jumps double hote jaate hain."),
    ], {"seq": [1, 4, 9, 16, 25]}),
    scene([
        L("Dadi", "So the test is simple. Find a2 minus a1, a3 minus a2, and so on. If all are equal, it is an AP. The first term a and the difference d tell you the whole list.",
          "Toh test aasaan hai. a2 minus a1, a3 minus a2, aise sab nikaalo. Agar sab barabar hain, toh AP hai. Pehla term a aur difference d poori list bata dete hain."),
    ], {"seq": [1, 2, 4, 8, 16]}),
    scene([
        L("Dadi", "Your turn! Build the AP 10, 7, 4, 1. Choose the first term and the common difference.",
          "Ab aapki baari! AP 10, 7, 4, 1 banaao. Pehla term aur common difference chuno."),
    ], {"a": 2, "d": 1, "n": 6, "task": {"a": 10, "d": -3}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "On Sunday, Papa is checking a new stretch of railway track. The signals are placed at fixed gaps.",
          "Itvaar ko Papa railway track ka ek naya hissa check kar rahe hain. Signals fixed gap par lage hain."),
        L("Deepak", "The first signal is at kilometre 4, and after that there is one every 3 kilometres. 4, 7, 10, 13.",
          "Pehla signal kilometre 4 par hai, aur uske baad har 3 kilometre par ek. 4, 7, 10, 13."),
    ], {"a": 4, "d": 3, "n": 4, "count": 8}),
    scene([
        L("Harsh", "Where is the 10th signal? I will just keep adding 3. That is slow!",
          "10th signal kahaan hai? Main bas 3 jodta rahunga. Yeh toh slow hai!"),
        L("Deepak", "Look at the jumps instead. To reach signal 2 we jump once. To reach signal 3 we jump twice.",
          "Iski jagah jumps dekho. Signal 2 tak pahunchne ke liye ek jump. Signal 3 tak do jump."),
    ], {"a": 4, "d": 3, "n": 3, "count": 10}),
    scene([
        L("Dadi", "So a2 is a plus d, a3 is a plus 2 d, and the nth term is a plus n minus 1 times d. You always make one jump less than the term number.",
          "Toh a2 hai a plus d, a3 hai a plus 2 d, aur nth term hai a plus n minus 1 guna d. Jumps hamesha term number se ek kam hote hain."),
    ], {"a": 4, "d": 3, "n": 6, "count": 10}),
    scene([
        L("Harsh", "Then the 10th signal is 4 plus 10 times 3, which is 34!", "Toh 10th signal hai 4 plus 10 guna 3, yaani 34!"),
        L("Disha", "No Harsh, only 9 jumps. 4 plus 9 times 3 is 31. The 10th signal is at kilometre 31.",
          "Nahi Harsh, sirf 9 jumps. 4 plus 9 guna 3 barabar 31. 10th signal kilometre 31 par hai."),
    ], {"a": 4, "d": 3, "n": 10, "count": 10}),
    scene([
        L("Deepak", "The same formula works backwards. If d is negative, every jump goes to the left on the number line.",
          "Yahi formula ulta bhi chalta hai. Agar d negative ho, toh har jump number line par left jaata hai."),
        L("Dadi", "For 10, 7, 4, the 30th term is 10 plus 29 times minus 3. That is 10 minus 87, which is minus 77.",
          "10, 7, 4 ka 30th term hai 10 plus 29 guna minus 3. Yaani 10 minus 87, jo minus 77 hai."),
    ], {"a": 10, "d": -3, "n": 30, "count": 30}),
    scene([
        L("Deepak", "Your turn, junior engineer! A new signal is at kilometre 40. Which signal number is it?",
          "Ab aapki baari, junior engineer! Ek naya signal kilometre 40 par hai. Yeh kaunsa signal number hai?"),
    ], {"a": 4, "d": 3, "n": 2, "count": 15, "task": {"value": 40}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "Monday evening is revision time. Dadi sets board questions on the nth term.",
          "Somvaar ki shaam revision ka time hai. Dadi nth term par board ke sawaal deti hain."),
        L("Dadi", "Which term of 21, 18, 15 is minus 81? Put a n equal to minus 81 and solve for n.",
          "21, 18, 15 ka kaunsa term minus 81 hai? a n ko minus 81 ke barabar rakho aur n nikaalo."),
    ], {"a": 21, "d": -3, "n": 10, "count": 35, "value": -81}),
    scene([
        L("Disha", "21 plus n minus 1 times minus 3 equals minus 81. So n minus 1 times 3 is 102, n minus 1 is 34, and n is 35.",
          "21 plus n minus 1 guna minus 3 barabar minus 81. Toh n minus 1 guna 3 barabar 102, n minus 1 barabar 34, aur n barabar 35."),
    ], {"a": 21, "d": -3, "n": 35, "count": 35, "value": -81}),
    scene([
        L("Dadi", "Now, is 301 a term of 5, 11, 17, 23? Here d is 6, so a n is 6 n minus 1.",
          "Ab, kya 301, 5, 11, 17, 23 ka term hai? Yahan d 6 hai, toh a n hai 6 n minus 1."),
        L("Harsh", "6 n minus 1 equals 301 gives 6 n equals 302. But 302 divided by 6 is not a whole number!",
          "6 n minus 1 barabar 301 se 6 n barabar 302 aata hai. Lekin 302 bhaag 6 whole number nahi hai!"),
        L("Dadi", "Exactly. n must be a natural number, so 301 is not a term. It falls between the 50th term, 299, and the 51st, 305.",
          "Bilkul. n natural number hona chahiye, isliye 301 term nahi hai. Yeh 50th term 299 aur 51st term 305 ke beech mein aata hai."),
    ], {"a": 5, "d": 6, "n": 50, "count": 52, "value": 301}),
    scene([
        L("Dadi", "Next. Find the 20th term from the end of 3, 8, 13, and so on up to 253.", "Agla. 3, 8, 13, aur aise hi 253 tak, iska end se 20th term nikaalo."),
        L("Deepak", "Walk back from the last station! Start at 253 and jump back 5 each time. 19 jumps back gives 253 minus 95, which is 158.",
          "Aakhri station se peeche chalo! 253 se shuru karo aur har baar 5 peeche jump karo. 19 jump peeche, yaani 253 minus 95, barabar 158."),
    ], {"a": 3, "d": 5, "n": 20, "count": 51, "fromEnd": True}),
    scene([
        L("Dadi", "So the nth term from the end is l minus n minus 1 times d, where l is the last term.",
          "Toh end se nth term hai l minus n minus 1 guna d, jahan l aakhri term hai."),
        L("Disha", "And how many two digit numbers are divisible by 3? 12, 15, up to 99. 99 equals 12 plus n minus 1 times 3, so n minus 1 is 29 and n is 30.",
          "Aur kitne do anko wale numbers 3 se divide hote hain? 12, 15, 99 tak. 99 barabar 12 plus n minus 1 guna 3, toh n minus 1 barabar 29 aur n barabar 30."),
    ], {"a": 12, "d": 3, "n": 30, "count": 30}),
    scene([
        L("Dadi", "Your turn! Which term of 3, 8, 13, 18 is 78?", "Ab aapki baari! 3, 8, 13, 18 ka kaunsa term 78 hai?"),
    ], {"a": 3, "d": 5, "n": 3, "count": 20, "task": {"value": 78}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "On Tuesday, Harsh comes home with a puzzle from his coaching class.", "Mangalvaar ko Harsh coaching class se ek paheli lekar aata hai."),
        L("Harsh", "Add all the numbers from 1 to 100. Our sir says a boy did it in seconds. Impossible!",
          "1 se 100 tak saare numbers jodo. Hamaare sir kehte hain ek ladke ne yeh seconds mein kar diya. Namumkin!"),
    ], {"a": 1, "d": 1, "n": 100, "show": "rows"}),
    scene([
        L("Dadi", "That is a famous story about Carl Friedrich Gauss as a young schoolboy in Germany. The earliest account, from 1856, says he was about seven and summed a long arithmetic series in moments.",
          "Yeh Carl Friedrich Gauss ki ek mashhoor kahaani hai, jab woh Germany mein chhote school student the. Sabse puraana vivaran, 1856 ka, kehta hai ki woh lagbhag saat saal ke the aur ek lambi arithmetic series pal bhar mein jod di."),
        L("Dadi", "The numbers 1 to 100 were added by later storytellers. But the idea is real and beautiful.",
          "1 se 100 wale numbers baad ke kahaanikaaron ne jode. Lekin idea sachcha aur bahut sundar hai."),
    ], {"a": 1, "d": 1, "n": 100, "show": "rows"}),
    scene([
        L("Dadi", "Write the sum once forwards and once backwards. Then add the two rows, column by column.",
          "Sum ko ek baar seedha aur ek baar ulta likho. Phir dono rows ko column by column jodo."),
        L("Disha", "1 plus 100 is 101. 2 plus 99 is 101. Every column is 101!", "1 plus 100 barabar 101. 2 plus 99 barabar 101. Har column 101 hai!"),
    ], {"a": 1, "d": 1, "n": 100, "show": "pairs"}),
    scene([
        L("Dadi", "There are 100 columns, so two S is 100 times 101, which is 10,100. One S is half of that, 5,050.",
          "100 columns hain, toh do S barabar 100 guna 101, yaani 10,100. Ek S uska aadha, 5,050."),
    ], {"a": 1, "d": 1, "n": 100, "show": "total"}),
    scene([
        L("Harsh", "Does it work when the number of terms is odd? Like 1 to 9?", "Kya yeh tab bhi chalega jab terms odd hon? Jaise 1 se 9?"),
        L("Dadi", "Yes, because we never split into pairs. We wrote the whole sum twice. 9 columns of 10 make 90, and half is 45.",
          "Haan, kyonki humne pairs mein toda hi nahi. Poora sum do baar likha. 10 ke 9 columns, 90, aur aadha 45."),
    ], {"a": 1, "d": 1, "n": 9, "show": "total"}),
    scene([
        L("Dadi", "It works for any AP. Each column is first term plus last term, so S n equals n by 2, times a plus l.",
          "Yeh har AP ke liye chalta hai. Har column pehla term plus aakhri term hai, toh S n barabar n bata 2, guna a plus l."),
        L("Disha", "For 3, 7, 11, up to 39, there are 10 terms. So S is 10 by 2 times 42, which is 210.",
          "3, 7, 11 se 39 tak, 10 terms hain. Toh S barabar 10 bata 2 guna 42, yaani 210."),
    ], {"a": 3, "d": 4, "n": 10, "show": "total"}),
    scene([
        L("Harsh", "Your turn! Starting from 1 and counting by 1, how many numbers add up to 78?",
          "Ab aapki baari! 1 se shuru karke 1 ke step mein, kitne numbers jodne par 78 aata hai?"),
    ], {"a": 1, "d": 1, "n": 5, "show": "pairs", "task": {"sum": 78}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "On Wednesday, Mummy is arranging gift boxes in her shop window as a staircase.", "Budhvaar ko Mummy apni shop ki window mein gift boxes seedhi ki tarah saja rahi hain."),
        L("Neha", "3 boxes in the first column, then 5, 7, 9 and 11. How many boxes in all?",
          "Pehle column mein 3 boxes, phir 5, 7, 9 aur 11. Kul kitne boxes?"),
    ], {"a": 3, "d": 2, "n": 5, "flip": False}),
    scene([
        L("Dadi", "We do not always know the last term, so let us find the sum using only a, d and n.",
          "Humein aakhri term hamesha pata nahi hota, toh sirf a, d aur n se sum nikaalte hain."),
        L("Disha", "Make a second staircase, turn it upside down and put it on top. The two fit into a rectangle!",
          "Ek doosri seedhi banaao, use ulta karke upar rakho. Dono milkar rectangle ban jaate hain!"),
    ], {"a": 3, "d": 2, "n": 5, "flip": True}),
    scene([
        L("Dadi", "Each column is now a plus a plus n minus 1 times d, that is 2 a plus n minus 1 times d. There are n columns.",
          "Ab har column hai a plus a plus n minus 1 guna d, yaani 2 a plus n minus 1 guna d. Aur n columns hain."),
        L("Dadi", "So two S equals n times that, and S n equals n by 2, times 2 a plus n minus 1 times d.",
          "Toh do S barabar n guna woh, aur S n barabar n bata 2, guna 2 a plus n minus 1 guna d."),
    ], {"a": 3, "d": 2, "n": 5, "flip": True}),
    scene([
        L("Neha", "For my boxes, 5 by 2 times 6 plus 8 is 5 by 2 times 14, which is 35 boxes.",
          "Mere boxes ke liye, 5 bata 2 guna 6 plus 8, yaani 5 bata 2 guna 14, barabar 35 boxes."),
        L("Harsh", "And 3 plus 5 plus 7 plus 9 plus 11 is also 35. It matches!", "Aur 3 plus 5 plus 7 plus 9 plus 11 bhi 35 hai. Match ho gaya!"),
    ], {"a": 3, "d": 2, "n": 5, "flip": False}),
    scene([
        L("Dadi", "Notice that 2 a plus n minus 1 times d is just a plus l. So both sum formulas are the same idea.",
          "Dhyaan do ki 2 a plus n minus 1 guna d bas a plus l hai. Toh dono sum formulas ek hi idea hain."),
        L("Deepak", "And the sum can be negative. For 8, 3, minus 2, the sum of 22 terms is 11 times 16 minus 105, which is minus 979.",
          "Aur sum negative bhi ho sakta hai. 8, 3, minus 2 ke 22 terms ka sum hai 11 guna 16 minus 105, yaani minus 979."),
    ], {"a": 2, "d": 3, "n": 7, "flip": True}),
    scene([
        L("Dadi", "One more trick. If you know every sum S n, the nth term is S n minus S of n minus 1. The last term is what the last step added.",
          "Ek aur trick. Agar har sum S n pata ho, toh nth term hai S n minus S n minus 1. Aakhri term wahi hai jo aakhri step ne joda."),
    ], {"a": 1, "d": 2, "n": 6, "flip": False}),
    scene([
        L("Neha", "Your turn! Make a staircase display with exactly 40 boxes.", "Ab aapki baari! Bilkul 40 boxes wala staircase display banaao."),
    ], {"a": 2, "d": 1, "n": 3, "flip": False, "task": {"sum": 40}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "On Thursday, Harsh wants a new cricket bat that costs 2,200 rupees.", "Guruvaar ko Harsh ko ek naya cricket bat chahiye jo 2,200 rupaye ka hai."),
        L("Harsh", "I will save 100 rupees in week 1, and 20 rupees more each week. 100, 120, 140.",
          "Main pehle hafte 100 rupaye bachaaunga, aur har hafte 20 rupaye zyaada. 100, 120, 140."),
    ], {"a": 100, "d": 20, "n": 3, "goal": 2200, "unit": "₹", "item": "Week"}),
    scene([
        L("Disha", "Then S n is n by 2 times 200 plus 20 times n minus 1. That simplifies to 10 n squared plus 90 n.",
          "Toh S n hai n bata 2 guna 200 plus 20 guna n minus 1. Yeh simplify hokar 10 n square plus 90 n banta hai."),
        L("Dadi", "Set it equal to 2,200 and divide by 10. n squared plus 9 n minus 220 is 0, so n minus 11 times n plus 20 is 0.",
          "Ise 2,200 ke barabar rakho aur 10 se divide karo. n square plus 9 n minus 220 barabar 0, toh n minus 11 guna n plus 20 barabar 0."),
    ], {"a": 100, "d": 20, "n": 8, "goal": 2200, "unit": "₹", "item": "Week"}),
    scene([
        L("Dadi", "n cannot be minus 20, so n is 11. In week 11 he saves 100 plus 10 times 20, which is 300 rupees, and the total reaches 2,200.",
          "n minus 20 nahi ho sakta, toh n barabar 11. 11th hafte mein woh 100 plus 10 guna 20, yaani 300 rupaye bachaata hai, aur total 2,200 ho jaata hai."),
    ], {"a": 100, "d": 20, "n": 11, "goal": 2200, "unit": "₹", "item": "Week"}),
    scene([
        L("Deepak", "At the yard, 200 wooden sleepers are stacked with 20 in the bottom row, 19 in the next, 18 in the next, and so on. How many rows?",
          "Yard mein 200 lakdi ke sleepers rakhe hain, sabse neeche ki row mein 20, agli mein 19, uske upar 18, aur aise hi. Kitni rows?"),
        L("Disha", "Here a is 20 and d is minus 1. n by 2 times 40 minus n minus 1 equals 200 gives n squared minus 41 n plus 400 equals 0.",
          "Yahan a 20 hai aur d minus 1. n bata 2 guna 40 minus n minus 1 barabar 200 se n square minus 41 n plus 400 barabar 0 aata hai."),
    ], {"a": 20, "d": -1, "n": 16, "goal": 200, "unit": "sleepers", "item": "Row"}),
    scene([
        L("Harsh", "That factors as n minus 16 times n minus 25. So 16 rows or 25 rows!", "Iske factors hain n minus 16 guna n minus 25. Toh 16 rows ya 25 rows!"),
        L("Deepak", "With 25 rows the top row would have 20 minus 24, minus 4 sleepers. Impossible! So there are 16 rows, with 5 sleepers on top.",
          "25 rows mein sabse upar 20 minus 24, yaani minus 4 sleepers honge. Namumkin! Toh 16 rows hain, aur upar 5 sleepers."),
    ], {"a": 20, "d": -1, "n": 25, "goal": 200, "unit": "sleepers", "item": "Row"}),
    scene([
        L("Dadi", "Always check your answer against the story. A quadratic can give two answers, but the real world may accept only one.",
          "Hamesha apna answer kahaani se milaao. Quadratic do answer de sakta hai, par asli duniya shaayad ek hi maane."),
    ], {"a": 20, "d": -1, "n": 16, "goal": 200, "unit": "sleepers", "item": "Row"}),
    scene([
        L("Harsh", "Your turn! Using my savings plan, find the week when my total becomes exactly 2,200 rupees.",
          "Ab aapki baari! Meri saving plan se, woh hafta dhoondo jab total bilkul 2,200 rupaye ho jaaye."),
    ], {"a": 100, "d": 20, "n": 4, "goal": 2200, "unit": "₹", "item": "Week", "task": {"goal": 2200}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "On Saturday, Dadi gives a full board practice paper on APs.", "Shanivaar ko Dadi APs par poora board practice paper deti hain."),
        L("Dadi", "Question 1. Find the common difference of 3 by 2, 1 by 2, minus 1 by 2.",
          "Sawaal 1. 3 bata 2, 1 bata 2, minus 1 bata 2 ka common difference nikaalo."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "1 by 2 minus 3 by 2 is minus 1, and minus 1 by 2 minus 1 by 2 is also minus 1. So d is minus 1.",
          "1 bata 2 minus 3 bata 2 barabar minus 1, aur minus 1 bata 2 minus 1 bata 2 bhi minus 1. Toh d minus 1 hai."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. Find the 10th term of 2, 7, 12.", "Sawaal 2. 2, 7, 12 ka 10th term nikaalo."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "a is 2 and d is 5. The 10th term is 2 plus 9 times 5, which is 47. Only 9 jumps this time!",
          "a 2 hai aur d 5. 10th term hai 2 plus 9 guna 5, yaani 47. Is baar sirf 9 jumps!"),
        L("Dadi", "Shabash, Harsh. You learnt from the signals.", "Shabash, Harsh. Signals se seekh liya."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now try questions 3 to 10 yourself. Write full working, as the examiner wants, then press show step to check.",
          "Ab sawaal 3 se 10 khud karo. Poori working likho, jaisa examiner chahta hai, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]

AR = "Both A and R are true, and R is the correct explanation of A"

PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Diwali diyas · What is an arithmetic progression?",
        "readingTime": "~8 min",
        "narrative": f"""
<div {STORY}>Diwali week, a few months before the board exams. Dadi's rows of diyas go 3, 5, 7, 9, and every row has 2 more than the last.</div>
<h2>Arithmetic progression</h2>
<p>An <strong>arithmetic progression (AP)</strong> is a list of numbers in which each term is obtained by adding a fixed number to the preceding term (except the first term). The fixed number is the <strong>common difference</strong> d.</p>
<div {FORMULA}>a, a + d, a + 2d, a + 3d, …&nbsp;&nbsp;&nbsp;&nbsp;d = a<sub>k+1</sub> − a<sub>k</sub></div>
<p>This is the <strong>general form</strong> of an AP; a is the first term.</p>
<h2>d can be positive, negative or zero</h2>
<table>
<tr><th>List</th><th>d</th><th>AP?</th></tr>
<tr><td>3, 5, 7, 9, …</td><td>2</td><td>Yes</td></tr>
<tr><td>50, 45, 40, 35, …</td><td>−5</td><td>Yes</td></tr>
<tr><td>200, 200, 200, …</td><td>0</td><td>Yes</td></tr>
<tr><td>−1.0, −1.5, −2.0, …</td><td>−0.5</td><td>Yes</td></tr>
<tr><td>1, 4, 9, 16, …</td><td>3, 5, 7 (not constant)</td><td>No</td></tr>
<tr><td>1, 2, 4, 8, …</td><td>1, 2, 4 (not constant)</td><td>No</td></tr>
</table>
<div {CARD}>
  <div><strong>Test for an AP:</strong> compute a<sub>2</sub> − a<sub>1</sub>, a<sub>3</sub> − a<sub>2</sub>, a<sub>4</sub> − a<sub>3</sub>, … If they are all equal, the list is an AP.</div>
  <div>An AP may be <strong>finite</strong> (it has a last term) or <strong>infinite</strong> (it goes on for ever).</div>
  <div>Always subtract a term from the term <em>after</em> it: d of 10, 7, 4 is 7 − 10 = −3, not 3.</div>
</div>
""",
        "keyInsight": "An AP is a list with the same jump every time; that jump is the common difference d.",
        "widgetType": "Class10APPatternWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Which of these is an AP?",
            "options": ["2, 4, 8, 16", "1, 3, 6, 10", "−4, −1, 2, 5", "1, 4, 9, 16"],
            "correctIndex": 2,
            "explanation": "−1 − (−4) = 3, 2 − (−1) = 3, 5 − 2 = 3: the difference is always 3. The others have changing differences.",
        },
        "teacherNotes": teacher(
            ["Start with real lists (diyas, flour stock, pocket money) before the definition.", "Make students compute every difference, not just the first one.", "Show d = 0 and negative d early so they are not surprises."],
            ["Finding d as a1 − a2 (wrong sign).", "Checking only the first two terms.", "Thinking a constant list is not an AP."],
            "Each student writes a list on a slip; the class sorts the slips into 'AP' and 'not AP' and states d for each AP.",
            "NCERT Class 10 Ch. 5, Sections 5.1 and 5.2; Exercise 5.1.",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Papa's railway signals · The nth term",
        "readingTime": "~8 min",
        "narrative": f"""
<div {STORY}>Papa's new stretch of track has its first signal at kilometre 4 and then one every 3 km: 4, 7, 10, 13, … Where is the 10th signal?</div>
<h2>Counting the jumps</h2>
<p>a<sub>1</sub> = a, a<sub>2</sub> = a + d, a<sub>3</sub> = a + 2d, a<sub>4</sub> = a + 3d. To reach the nth term we make <strong>n − 1 jumps</strong> of d.</p>
<div {FORMULA}>a<sub>n</sub> = a + (n − 1)d</div>
<p>a<sub>n</sub> is called the <strong>general term</strong> of the AP. If an AP has m terms, a<sub>m</sub> is its last term, often written l.</p>
<h2>Examples</h2>
<div {CARD}>
  <div>10th signal: a<sub>10</sub> = 4 + 9 × 3 = <strong>31 km</strong> (not 4 + 10 × 3 = 34).</div>
  <div>30th term of 10, 7, 4, …: a<sub>30</sub> = 10 + 29 × (−3) = 10 − 87 = <strong>−77</strong>.</div>
  <div>Signal at km 40: 4 + (n − 1)3 = 40 ⇒ n − 1 = 12 ⇒ <strong>n = 13</strong>.</div>
</div>
""",
        "keyInsight": "The nth term is the first term plus n − 1 jumps: a + (n − 1)d.",
        "widgetType": "Class10APJumpWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "The 15th term of the AP 7, 11, 15, … is:",
            "options": ["60", "63", "67", "56"],
            "correctIndex": 1,
            "explanation": "a = 7, d = 4, so a15 = 7 + 14 × 4 = 7 + 56 = 63.",
        },
        "teacherNotes": teacher(
            ["Draw the number line and count jumps before writing the formula.", "Derive a2, a3, a4 on the board, then ask the class to guess a10."],
            ["Using a + nd instead of a + (n − 1)d.", "Losing the sign of a negative d.", "Forgetting that n must be a natural number."],
            "Human number line: students stand at equal steps; ask 'how many steps to reach the 7th student?'",
            "NCERT Class 10 Ch. 5, Section 5.3; Exercise 5.2.",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Revision evening · Which term? Term from the end",
        "readingTime": "~9 min",
        "narrative": f"""
<div {STORY}>Dadi's revision drill: four question types that the board loves.</div>
<h2>1. Which term is a given number?</h2>
<p>Put a<sub>n</sub> equal to the number and solve for n. 21, 18, 15, … and −81: 21 + (n − 1)(−3) = −81 ⇒ (n − 1)3 = 102 ⇒ n − 1 = 34 ⇒ <strong>n = 35</strong>.</p>
<h2>2. Is a number a term at all?</h2>
<p>5, 11, 17, 23, …: a<sub>n</sub> = 5 + (n − 1)6 = 6n − 1. 6n − 1 = 301 ⇒ n = 302/6 = 50 1/3, not a natural number, so <strong>301 is not a term</strong> (it lies between a<sub>50</sub> = 299 and a<sub>51</sub> = 305).</p>
<h2>3. Term from the end</h2>
<p>Walk backwards from the last term l with jumps of −d.</p>
<div {FORMULA}>nth term from the end = l − (n − 1)d</div>
<p>3, 8, 13, …, 253: 20th term from the end = 253 − 19 × 5 = <strong>158</strong>. (Check: there are (253 − 3)/5 + 1 = 51 terms, and the 20th from the end is the 32nd from the start: 3 + 31 × 5 = 158.)</p>
<h2>4. Counting terms</h2>
<p>Two-digit numbers divisible by 3: 12, 15, …, 99. 99 = 12 + (n − 1)3 ⇒ n − 1 = 29 ⇒ <strong>n = 30</strong>.</p>
<div {CARD}><div>Number of terms of a finite AP: n = (l − a)/d + 1.</div></div>
""",
        "keyInsight": "Set a + (n − 1)d equal to the number: a natural-number n means it is a term; anything else means it is not.",
        "widgetType": "Class10APJumpWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "How many terms are there in the AP 7, 13, 19, …, 205?",
            "options": ["33", "34", "35", "36"],
            "correctIndex": 1,
            "explanation": "205 = 7 + (n − 1)6 ⇒ (n − 1)6 = 198 ⇒ n − 1 = 33 ⇒ n = 34.",
        },
        "teacherNotes": teacher(
            ["Insist on writing a, d and the equation before solving.", "For 'is it a term?', stress that n must be a natural number.", "Show the term-from-the-end answer both ways (backwards and as a term from the start)."],
            ["Accepting a fractional n.", "Using l − nd for the term from the end.", "Forgetting the + 1 when counting terms."],
            "Speed round: teacher calls a number, groups decide in 30 seconds whether it is a term of 4, 7, 10, … and which one.",
            "NCERT Class 10 Ch. 5, Section 5.3, Examples 3 to 8; Exercise 5.2.",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: The Gauss puzzle · Sum by pairing",
        "readingTime": "~8 min",
        "narrative": f"""
<div {STORY}>Harsh brings a puzzle from coaching: add 1 + 2 + 3 + … + 100 in seconds.</div>
<h2>A famous story</h2>
<p>A well-known story says the German mathematician Carl Friedrich Gauss (1777–1855), as a schoolboy, summed a long arithmetic series almost at once. The earliest account (1856, by his friend Sartorius von Waltershausen) says he was about seven; the familiar details "1 to 100" and "pairing" were added by later retellers. The idea is what matters.</p>
<h2>Write it twice</h2>
<p>S = 1 + 2 + 3 + … + 99 + 100<br/>S = 100 + 99 + 98 + … + 2 + 1<br/>Adding column by column: 2S = 101 + 101 + … + 101 (100 times) = 10,100, so <strong>S = 5,050</strong>.</p>
<p>Because we write the whole sum twice, this works for an odd number of terms too: 1 + 2 + … + 9 gives 2S = 9 × 10, S = 45.</p>
<h2>For any AP</h2>
<p>Each column adds to first term + last term = a + l, and there are n columns.</p>
<div {FORMULA}>S<sub>n</sub> = n/2 (a + l)</div>
<div {CARD}>
  <div>3 + 7 + 11 + … + 39: n = (39 − 3)/4 + 1 = 10, S = 10/2 × (3 + 39) = 5 × 42 = <strong>210</strong>.</div>
  <div>Sum of the first n natural numbers: S = n(n + 1)/2.</div>
</div>
""",
        "keyInsight": "Write the sum forwards and backwards: every column is a + l, so 2S = n(a + l).",
        "widgetType": "Class10APGaussWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "The sum 1 + 2 + 3 + … + 50 is:",
            "options": ["1,250", "1,275", "2,550", "1,225"],
            "correctIndex": 1,
            "explanation": "S = 50/2 × (1 + 50) = 25 × 51 = 1,275.",
        },
        "teacherNotes": teacher(
            ["Let the class try 1 to 100 the slow way for one minute, then reveal the two-row trick.", "Present the Gauss story honestly as a legend whose details grew over time."],
            ["Pairing only works for even n (a misconception: writing the sum twice works always).", "Using n instead of n/2.", "Wrong count of terms."],
            "Each pair of students writes 5 + 8 + 11 + … + 32 forwards and backwards on strips and adds the columns.",
            "NCERT Class 10 Ch. 5, Section 5.4 (introduction and S = n/2 (a + l)).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Mummy's shop window · Sum of the first n terms",
        "readingTime": "~9 min",
        "narrative": f"""
<div {STORY}>Mummy stacks gift boxes as a staircase: 3, 5, 7, 9, 11. How many boxes, without counting one by one?</div>
<h2>Two staircases make a rectangle</h2>
<p>Put a second, upside-down copy on top. Every column then has a + (a + (n − 1)d) = 2a + (n − 1)d boxes, and there are n columns. The rectangle holds twice the sum.</p>
<div {FORMULA}>S<sub>n</sub> = n/2 [2a + (n − 1)d]</div>
<p>Since a + (n − 1)d = l, this is the same as S<sub>n</sub> = n/2 (a + l).</p>
<div {CARD}>
  <div>Boxes: S<sub>5</sub> = 5/2 [6 + 4 × 2] = 5/2 × 14 = <strong>35</strong> (= 3 + 5 + 7 + 9 + 11).</div>
  <div>8, 3, −2, …, 22 terms: S<sub>22</sub> = 11 [16 + 21 × (−5)] = 11 × (−89) = <strong>−979</strong>.</div>
  <div>Sum of the first 40 multiples of 6: a = 6, l = 240, S = 20 × 246 = <strong>4,920</strong>.</div>
</div>
<h2>From sums back to terms</h2>
<div {FORMULA}>a<sub>n</sub> = S<sub>n</sub> − S<sub>n−1</sub></div>
<p>If S<sub>n</sub> = 4n − n², then a<sub>1</sub> = S<sub>1</sub> = 3, S<sub>2</sub> = 4, so a<sub>2</sub> = 1 and d = −2; in general a<sub>n</sub> = 5 − 2n.</p>
""",
        "keyInsight": "Two copies of an AP staircase form an n by [2a + (n − 1)d] rectangle, so the sum is half of it.",
        "widgetType": "Class10APStaircaseWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "The sum of the first 15 terms of the AP 2, 5, 8, … is:",
            "options": ["345", "690", "330", "360"],
            "correctIndex": 0,
            "explanation": "S15 = 15/2 [2 × 2 + 14 × 3] = 15/2 × 46 = 15 × 23 = 345.",
        },
        "teacherNotes": teacher(
            ["Build the two staircases with unit cubes or squared paper.", "Link both sum formulas through l = a + (n − 1)d.", "Show a negative sum so students do not expect sums to be positive."],
            ["Writing n/2 [a + (n − 1)d] (missing the 2a).", "Arithmetic slips with negative d.", "Using Sn − Sn+1 for an."],
            "Squared-paper activity: draw a staircase with a = 2, d = 3, n = 4, cut out a copy, flip it and measure the rectangle.",
            "NCERT Class 10 Ch. 5, Section 5.4, Examples 11 to 16; Exercise 5.3.",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Savings and sleepers · Word problems",
        "readingTime": "~9 min",
        "narrative": f"""
<div {STORY}>Harsh saves for a ₹2,200 cricket bat; Papa counts sleepers stacked in rows at the railway yard.</div>
<h2>Method</h2>
<ol><li>Identify a, d and what is asked (a term, n, or a sum).</li><li>Write the formula and solve.</li><li>Check the answer makes sense in the story.</li></ol>
<h2>Savings plan</h2>
<p>₹100 in week 1, ₹20 more each week: a = 100, d = 20. S<sub>n</sub> = n/2 [200 + 20(n − 1)] = 10n² + 90n. Setting 10n² + 90n = 2,200 gives n² + 9n − 220 = 0, (n − 11)(n + 20) = 0, so <strong>n = 11 weeks</strong> (n = −20 is rejected). In week 11 he saves 100 + 10 × 20 = ₹300.</p>
<h2>Stack of sleepers</h2>
<p>200 sleepers: 20 in the bottom row, 19 in the next, 18 … (a = 20, d = −1). n/2 [40 − (n − 1)] = 200 ⇒ n² − 41n + 400 = 0 ⇒ (n − 16)(n − 25) = 0.</p>
<p>n = 25 gives a top row of 20 − 24 = −4, impossible. So <strong>16 rows</strong>, with 20 − 15 = <strong>5</strong> sleepers in the top row.</p>
<div {CARD}>
  <div><strong>Prizes:</strong> ₹700 for 7 prizes, each ₹20 less than the one before: 7/2 [2a − 120] = 700 ⇒ 2a = 320 ⇒ a = <strong>₹160</strong> (160, 140, …, 40).</div>
</div>
<div {FORMULA}>a<sub>n</sub> = a + (n − 1)d &nbsp;&nbsp; S<sub>n</sub> = n/2 [2a + (n − 1)d] = n/2 (a + l)</div>
""",
        "keyInsight": "Translate the story into a, d and n, solve, and reject answers the story cannot allow.",
        "widgetType": "Class10APPlannerWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "A sum of ₹700 is given as 7 prizes, each ₹20 less than the previous one. The first prize is:",
            "options": ["₹100", "₹140", "₹160", "₹180"],
            "correctIndex": 2,
            "explanation": "7/2 [2a + 6(−20)] = 700 ⇒ 2a − 120 = 200 ⇒ a = 160.",
        },
        "teacherNotes": teacher(
            ["Underline which quantity is asked: a term, a count n, or a total.", "Always test both roots of a quadratic against the story."],
            ["Using an when Sn is needed (or the reverse).", "Keeping a negative or impossible value of n.", "Forgetting the sign of d in decreasing situations."],
            "Groups invent a savings or stacking problem for another group, then swap and solve.",
            "NCERT Class 10 Ch. 5, Section 5.4, Examples 17 to 20; Exercise 5.3 word problems.",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 board-style problems, step by step",
        "readingTime": "~12 min",
        "narrative": f"""
<div {STORY}>Saturday: Dadi's board practice paper on arithmetic progressions.</div>
<h2>Formulas you need</h2>
<div {FORMULA}>d = a<sub>k+1</sub> − a<sub>k</sub> &nbsp;&nbsp; a<sub>n</sub> = a + (n − 1)d &nbsp;&nbsp; S<sub>n</sub> = n/2 [2a + (n − 1)d] = n/2 (a + l) &nbsp;&nbsp; a<sub>n</sub> = S<sub>n</sub> − S<sub>n−1</sub></div>
<p>Use the question buttons. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Write a, d and what is asked first; the right formula then picks itself.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "MCQ · Common difference",
                    "question": "The common difference of the AP 3/2, 1/2, −1/2, −3/2, … is: (a) 1 (b) −1 (c) 2 (d) −1/2",
                    "steps": ["d = 1/2 − 3/2 = −1", "Check: −1/2 − 1/2 = −1 and −3/2 − (−1/2) = −1", "Answer: <strong>(b) −1</strong>"],
                    "answer": "(b) −1",
                },
                {
                    "title": "Short answer · nth term",
                    "question": "Find the 10th term of the AP 2, 7, 12, …",
                    "steps": ["a = 2, d = 7 − 2 = 5, n = 10", "a<sub>10</sub> = 2 + (10 − 1) × 5 = 2 + 45", "= <strong>47</strong>"],
                    "answer": "47",
                },
                {
                    "title": "Short answer · Which term?",
                    "question": "Which term of the AP 21, 18, 15, … is −81?",
                    "steps": ["a = 21, d = −3", "21 + (n − 1)(−3) = −81", "(n − 1)(−3) = −102 ⇒ n − 1 = 34", "n = <strong>35</strong>: the 35th term is −81"],
                    "answer": "35th term",
                },
                {
                    "title": "Short answer · Is it a term?",
                    "question": "Is 301 a term of the AP 5, 11, 17, 23, …? Justify.",
                    "steps": ["a = 5, d = 6, so a<sub>n</sub> = 5 + (n − 1)6 = 6n − 1", "6n − 1 = 301 ⇒ 6n = 302 ⇒ n = 151/3", "n is not a natural number, so <strong>301 is not a term</strong>"],
                    "answer": "No",
                },
                {
                    "title": "Short answer · Term from the end",
                    "question": "Find the 20th term from the last term of the AP 3, 8, 13, …, 253.",
                    "steps": ["l = 253, d = 5", "20th term from the end = l − (20 − 1)d = 253 − 19 × 5", "= 253 − 95 = <strong>158</strong>"],
                    "answer": "158",
                },
                {
                    "title": "Short answer · Counting terms",
                    "question": "How many two-digit numbers are divisible by 3?",
                    "steps": ["The numbers are 12, 15, 18, …, 99: an AP with a = 12, d = 3, l = 99", "99 = 12 + (n − 1)3 ⇒ (n − 1)3 = 87 ⇒ n − 1 = 29", "n = <strong>30</strong>"],
                    "answer": "30",
                },
                {
                    "title": "Long answer · Sum with negative d",
                    "question": "Find the sum of the first 22 terms of the AP 8, 3, −2, …",
                    "steps": ["a = 8, d = −5, n = 22", "S<sub>22</sub> = 22/2 [2 × 8 + (22 − 1)(−5)]", "= 11 [16 − 105] = 11 × (−89)", "= <strong>−979</strong>"],
                    "answer": "−979",
                },
                {
                    "title": "Short answer · Sum of multiples",
                    "question": "Find the sum of the first 40 positive integers divisible by 6.",
                    "steps": ["The numbers are 6, 12, 18, …: a = 6, d = 6, n = 40", "l = a<sub>40</sub> = 6 + 39 × 6 = 240", "S<sub>40</sub> = 40/2 (6 + 240) = 20 × 246", "= <strong>4,920</strong>"],
                    "answer": "4,920",
                },
                {
                    "title": "Assertion–Reason",
                    "question": "Assertion (A): If the sum of the first n terms of an AP is 4n − n², then its nth term is 5 − 2n.<br/>Reason (R): a<sub>n</sub> = S<sub>n</sub> − S<sub>n−1</sub>.",
                    "steps": [
                        "R is the standard result: the nth term is what the nth step adds to the sum. R is true.",
                        "S<sub>n</sub> − S<sub>n−1</sub> = 4n − n² − [4(n − 1) − (n − 1)²] = 4n − n² − 4n + 4 + n² − 2n + 1 = 5 − 2n. A is true.",
                        "A follows from R, so: <strong>both A and R are true, and R is the correct explanation of A</strong>",
                    ],
                    "answer": "Both true; R explains A",
                },
                {
                    "title": "Case-based · Stack of sleepers",
                    "question": "200 sleepers are stacked with 20 in the bottom row, 19 in the next row, 18 in the next, and so on. (i) How many sleepers are in the 10th row from the bottom? (ii) In how many rows are the 200 sleepers placed? (iii) How many sleepers are in the top row?",
                    "steps": [
                        "AP with a = 20, d = −1. (i) a<sub>10</sub> = 20 + 9(−1) = <strong>11</strong>",
                        "(ii) n/2 [40 + (n − 1)(−1)] = 200 ⇒ n(41 − n) = 400 ⇒ n² − 41n + 400 = 0 ⇒ (n − 16)(n − 25) = 0",
                        "n = 25 would give a<sub>25</sub> = 20 − 24 = −4 sleepers, impossible. So <strong>16 rows</strong>",
                        "(iii) a<sub>16</sub> = 20 − 15 = <strong>5</strong> sleepers",
                    ],
                    "answer": "(i) 11 (ii) 16 rows (iii) 5",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            ["Make students write 'a = …, d = …, n = …' as the first line of every answer, as examiners give a mark for it.", "In case-based questions, check each sub-answer against the situation."],
            ["Q2: using 10 jumps instead of 9.", "Q4: answering 'yes, n ≈ 50'.", "Q7: sign errors with d = −5.", "Q10: keeping n = 25."],
            "Exam simulation: 20 minutes for Q3, Q7 and Q10, then peer marking with the steps on screen.",
            "Covers NCERT Class 10 Ch. 5 Exercises 5.1 to 5.3 and CBSE board question types (MCQ, A–R, case-based).",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Arithmetic Progressions (80% to pass)",
        "readingTime": "~12 min exam",
        "narrative": f"""
<p>From Diwali diyas to railway sleepers, you have found terms, counted them and added them. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 board-style questions</strong>, including assertion–reason.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "a + (n − 1)d for a term, n/2 [2a + (n − 1)d] for a sum.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Arithmetic Progressions · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "Which of these lists is an AP?", "options": ["1, 4, 9, 16, …", "2, 4, 8, 16, …", "10, 7, 4, 1, …", "1, 3, 6, 10, …"], "answer": 2, "explanation": "10, 7, 4, 1 has constant difference −3. The others have changing differences.", "topic": "What is an AP"},
                {"q": "The 11th term of the AP −3, −1/2, 2, … is:", "options": ["28", "22", "−38", "−48 1/2"], "answer": 1, "explanation": "d = −1/2 − (−3) = 5/2, so a11 = −3 + 10 × 5/2 = −3 + 25 = 22.", "topic": "nth term"},
                {"q": "The 30th term of the AP 10, 7, 4, … is:", "options": ["97", "77", "−77", "−87"], "answer": 2, "explanation": "a30 = 10 + 29 × (−3) = 10 − 87 = −77.", "topic": "nth term"},
                {"q": "The number of terms in the AP 7, 13, 19, …, 205 is:", "options": ["33", "34", "35", "36"], "answer": 1, "explanation": "205 = 7 + (n − 1)6 ⇒ n − 1 = 33 ⇒ n = 34.", "topic": "Number of terms"},
                {"q": "1 + 2 + 3 + … + 100 equals:", "options": ["5,000", "5,050", "5,100", "10,100"], "answer": 1, "explanation": "S = 100/2 × (1 + 100) = 50 × 101 = 5,050. (10,100 is 2S.)", "topic": "Sum by pairing"},
                {"q": "The sum of the first 15 terms of an AP with a = 2 and d = 3 is:", "options": ["345", "690", "330", "360"], "answer": 0, "explanation": "S15 = 15/2 [4 + 14 × 3] = 15/2 × 46 = 345.", "topic": "Sum of n terms"},
                {"q": "An AP has first term 5, last term 45 and 9 terms. Its sum is:", "options": ["225", "450", "250", "200"], "answer": 0, "explanation": "S = n/2 (a + l) = 9/2 × 50 = 225.", "topic": "Sum with last term"},
                {"q": "₹700 is given as 7 prizes, each ₹20 less than the one before. The first prize is:", "options": ["₹100", "₹140", "₹160", "₹180"], "answer": 2, "explanation": "7/2 [2a − 120] = 700 ⇒ 2a − 120 = 200 ⇒ a = 160.", "topic": "Word problems"},
                {"q": "Assertion (A): The common difference of the AP 5, 5, 5, … is 0.<br/>Reason (R): In an AP, d = a(k+1) − a(k) for every k.", "options": [AR, "Both A and R are true, but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"], "answer": 0, "explanation": "R is the definition of d, and applying it gives 5 − 5 = 0, so R explains A.", "topic": "Common difference"},
                {"q": "Assertion (A): 184 is a term of the AP 3, 7, 11, …<br/>Reason (R): Every term of this AP leaves remainder 3 when divided by 4.", "options": [AR, "Both A and R are true, but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"], "answer": 3, "explanation": "Terms are 4n − 1, which leave remainder 3 on division by 4 (R true). 184 = 4 × 46 leaves remainder 0, so it is not a term (A false). Check: 4n − 1 = 184 gives n = 185/4.", "topic": "Is it a term"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q2 and Q3 catch sign and n − 1 errors; Q5 catches forgetting to halve; Q10 needs a natural-number check."],
            "Exit ticket: write your own AP, then find its 20th term and the sum of its first 20 terms.",
            "Matches NCERT Class 10 Ch. 5 learning outcomes and CBSE board MCQ / assertion–reason formats.",
        ),
    },
]


def seed_class10_story_arithmetic_progressions():
    db = SessionLocal()
    try:
        topic = get_class10_topic(db, "Arithmetic Progressions")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 10 Arithmetic Progressions: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Arithmetic Progressions: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class10_story_arithmetic_progressions()
