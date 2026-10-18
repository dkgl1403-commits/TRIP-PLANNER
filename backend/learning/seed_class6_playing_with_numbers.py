import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Playing with Numbers (old NCERT Ch. 3) + Prime Time (Ganita Prakash 2024, Ch. 5).
# Story: Mummy packs Diwali laddoos in trays, the family plays idli-vada, Dadi runs the Sieve of Eratosthenes,
# Papa brings railway divisibility puzzles, Disha makes string art, and trains, bells and tiles lead to HCF and LCM.
# Verified facts: idli-vada rules and Jumpy Jackpot (Ganita Prakash Ch. 5); 25 primes up to 100; Goldbach's 1742
# letter to Euler, checked by computer for every even number up to 4 x 10^18 (Oliveira e Silva et al., 2014);
# perfect numbers 6, 28, 496; LCM of 1 to 10 = 2520 (a Ganita Prakash exercise).


SCENES_1 = [
    scene([
        L("Narrator", "It is Diwali week, and Mummy's kitchen smells of ghee and besan. Twelve fresh laddoos sit on the counter.",
          "Diwali ka hafta hai, aur Mummy ki kitchen mein ghee aur besan ki khushboo hai. Counter par baarah taaze laddoo rakhe hain."),
        L("Neha", "I want to pack these 12 laddoos in a tray, in equal rows, with no laddoo left over. How many ways can I do it?",
          "Mujhe yeh 12 laddoo ek tray mein, barabar rows mein, bina koi laddoo bachaaye pack karne hain. Kitne tareekon se kar sakti hoon?"),
    ], {"mode": "rect", "n": 12, "rows": 1}),
    scene([
        L("Harsh", "Easy! One long row of 12 laddoos.", "Aasaan! Baarah laddoo ki ek lambi row."),
        L("Dadi", "That works. Now try 3 rows. Watch the laddoos roll into place: 3 rows of 4 make exactly 12.",
          "Woh chalega. Ab 3 rows try karo. Laddoo ko apni jagah ludakte dekho: 4 ki 3 rows se poore 12 bante hain."),
    ], {"mode": "rect", "n": 12, "rows": 3}),
    scene([
        L("Disha", "What about 5 rows?", "Aur 5 rows?"),
        L("Dadi", "Look, 5 rows of 2 use only 10 laddoos, and 2 are left over. So 5 does not divide 12 exactly. 5 is not a factor of 12.",
          "Dekho, 2 ki 5 rows mein sirf 10 laddoo lagte hain, aur 2 bach jaate hain. Toh 5, 12 ko poora poora divide nahi karta. 5, 12 ka factor nahi hai."),
    ], {"mode": "rect", "n": 12, "rows": 5}),
    scene([
        L("Dadi", "The numbers that make a perfect rectangle are the factors of 12: 1, 2, 3, 4, 6 and 12. And see how they come in pairs: 1 times 12, 2 times 6, 3 times 4.",
          "Jo numbers poora rectangle banaate hain, woh 12 ke factors hain: 1, 2, 3, 4, 6 aur 12. Aur dekho, yeh jodiyon mein aate hain: 1 guna 12, 2 guna 6, 3 guna 4."),
        L("Harsh", "So once I find 3, I get 4 for free!", "Matlab 3 mil gaya toh 4 free mein mil gaya!"),
    ], {"mode": "all", "n": 12}),
    scene([
        L("Neha", "Now think about my trays. One tray holds 12, two trays hold 24, three trays hold 36. These are the multiples of 12.",
          "Ab meri trays ke baare mein socho. Ek tray mein 12, do trays mein 24, teen trays mein 36. Yeh 12 ke multiples hain."),
        L("Disha", "And I can keep adding trays forever. Multiples never end, but factors stop at the number itself!",
          "Aur main hamesha trays jodti reh sakti hoon. Multiples kabhi khatam nahi hote, lekin factors number par hi ruk jaate hain!"),
    ], {"mode": "multiples", "n": 12}),
    scene([
        L("Dadi", "Shabash! Remember: 1 is a factor of every number, and every number is a factor and a multiple of itself.",
          "Shabash! Yaad rakhna: 1 har number ka factor hai, aur har number khud ka factor bhi hai aur multiple bhi."),
    ], {"mode": "all", "n": 18}),
    scene([
        L("Dadi", "Now a beautiful secret. Add the factors of 6, leaving out 6 itself: 1 plus 2 plus 3. What do you get?",
          "Ab ek sundar raaz. 6 ke factors jodo, 6 ko chhodkar: 1 plus 2 plus 3. Kya mila?"),
        L("Disha", "Six! The number itself!", "Chhah! Wahi number!"),
        L("Dadi", "Such a number is called a perfect number.", "Aise number ko perfect number kehte hain."),
    ], {"mode": "perfect", "n": 6}),
    scene([
        L("Harsh", "Is 12 perfect? 1 plus 2 plus 3 plus 4 plus 6 is 16. Too much!", "Kya 12 perfect hai? 1 plus 2 plus 3 plus 4 plus 6 barabar 16. Zyaada ho gaya!"),
        L("Dadi", "Right, 12 is not perfect. The next perfect number is 28: 1 plus 2 plus 4 plus 7 plus 14 is exactly 28. After that comes 496, so perfect numbers are very rare!",
          "Sahi, 12 perfect nahi hai. Agla perfect number 28 hai: 1 plus 2 plus 4 plus 7 plus 14, poore 28. Uske baad 496 aata hai, isliye perfect numbers bahut kam milte hain!"),
    ], {"mode": "perfect", "n": 28}),
    scene([
        L("Neha", "Your turn! I have 36 laddoos for the guests. Arrange them in a square tray, with the same number of rows and columns.",
          "Ab aapki baari! Mehmaanon ke liye mere paas 36 laddoo hain. Inhe ek square tray mein lagaao, jitni rows utne hi columns."),
    ], {"mode": "rect", "n": 36, "rows": 4, "task": "square"}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "On Diwali night, after the diyas are lit, the cousins sit in a circle to play a counting game.",
          "Diwali ki raat, diye jalne ke baad, saare cousins ek gol ghere mein baith kar ginti ka khel khelte hain."),
        L("Dadi", "This is the idli-vada game: count one by one, but for a multiple of 3 say idli, and for a multiple of 5 say vada. Say the wrong word and you are out!",
          "Yeh idli-vada game hai: ek ek karke gino, lekin 3 ke multiple par idli bolo, aur 5 ke multiple par vada bolo. Galat bole toh out!"),
    ], {"mode": "board", "a": 3, "b": 5, "upto": 15}),
    scene([
        L("Harsh", "1, 2, idli, 4, vada, idli, 7, 8, idli, vada, 11, idli, 13, 14, and 15 is both!",
          "1, 2, idli, 4, vada, idli, 7, 8, idli, vada, 11, idli, 13, 14, aur 15 toh dono hai!"),
        L("Dadi", "For a number that is a multiple of both 3 and 5, we say idli-vada.", "Jo number 3 aur 5 dono ka multiple ho, uspar hum idli-vada bolte hain."),
    ], {"mode": "board", "a": 3, "b": 5, "upto": 30}),
    scene([
        L("Disha", "Up to 60, idli-vada comes at 15, 30, 45 and 60. They are 15 apart!", "60 tak idli-vada 15, 30, 45 aur 60 par aata hai. Sab 15 ki doori par!"),
        L("Dadi", "These are the common multiples of 3 and 5. The smallest one, 15, is called the lowest common multiple, or LCM.",
          "Yeh 3 aur 5 ke common multiples hain. Sabse chhota, 15, lowest common multiple yaani LCM kehlaata hai."),
    ], {"mode": "board", "a": 3, "b": 5, "upto": 60, "common": True}),
    scene([
        L("Harsh", "Let's play with 2 and 4 instead. Idli for 2, vada for 4.", "Chalo 2 aur 4 se khelte hain. 2 ke liye idli, 4 ke liye vada."),
        L("Disha", "Strange! Nobody ever says just vada. It is always idli-vada!", "Ajeeb baat! Koi kabhi sirf vada nahi bolta. Hamesha idli-vada!"),
        L("Dadi", "Because 4 is in the table of 2. Every multiple of 4 is already a multiple of 2.", "Kyonki 4, 2 ke pahaade mein hai. 4 ka har multiple pehle se 2 ka multiple hai."),
    ], {"mode": "board", "a": 2, "b": 4, "upto": 30}),
    scene([
        L("Deepak", "Here is another way to see it. A frog jumps 3 steps at a time, and a rabbit jumps 4 steps at a time. Both start at zero.",
          "Ise dekhne ka ek aur tareeka. Ek medhak ek baar mein 3 kadam koodta hai, aur ek khargosh 4 kadam. Dono zero se shuru karte hain."),
        L("Harsh", "Where will they both land?", "Dono kahan ek saath utrenge?"),
    ], {"mode": "jumps", "a": 3, "b": 4}),
    scene([
        L("Disha", "At 12, 24 and 36! Those are the common multiples of 3 and 4, and the first one, 12, is the LCM.",
          "12, 24 aur 36 par! Yeh 3 aur 4 ke common multiples hain, aur pehla, 12, LCM hai."),
        L("Dadi", "And every common multiple is a multiple of the LCM. 24 is 2 times 12, 36 is 3 times 12.",
          "Aur har common multiple, LCM ka multiple hota hai. 24 barabar 2 guna 12, 36 barabar 3 guna 12."),
    ], {"mode": "jumps", "a": 3, "b": 4, "replay": 1}),
    scene([
        L("Dadi", "Your turn to play! Continue the game from 21 to 30 with idli for 3 and vada for 5. Do not get out!",
          "Ab aap khelo! 21 se 30 tak game aage badhaao, 3 ke liye idli aur 5 ke liye vada. Out mat hona!"),
    ], {"mode": "game", "a": 3, "b": 5, "start": 21, "end": 30, "task": True}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "The next morning, only 7 laddoos are left. Mummy tries to make a tray again.", "Agli subah sirf 7 laddoo bache hain. Mummy phir se tray banaane ki koshish karti hain."),
        L("Neha", "2 rows, 3 rows, 4 rows... nothing works! Only one long row of 7.", "2 rows, 3 rows, 4 rows... kuch kaam nahi karta! Bas 7 ki ek lambi row."),
        L("Dadi", "Because 7 has exactly two factors, 1 and 7. A number with exactly two factors is a prime number.",
          "Kyonki 7 ke theek do factors hain, 1 aur 7. Jis number ke theek do factors hon, woh prime number hai."),
    ], {"mode": "count", "focus": 7}),
    scene([
        L("Dadi", "12 has six factors. A number with more than two factors is a composite number.", "12 ke chhah factors hain. Jis number ke do se zyaada factors hon, woh composite number hai."),
        L("Disha", "And 1? It has only one factor, itself.", "Aur 1? Uska toh bas ek hi factor hai, khud."),
        L("Dadi", "So 1 is neither prime nor composite. It is special.", "Isliye 1 na prime hai na composite. Woh khaas hai."),
    ], {"mode": "count", "focus": 1}),
    scene([
        L("Harsh", "Look at the bars! 2 is prime, and it is even. Is there any other even prime?", "Bars dekho! 2 prime hai, aur even bhi. Kya koi aur even prime hai?"),
        L("Dadi", "No. Every other even number has 2 as a factor, so it has at least three factors. 2 is the only even prime.",
          "Nahi. Har doosre even number ka 2 ek factor hota hai, toh uske kam se kam teen factors hote hain. 2 hi akela even prime hai."),
    ], {"mode": "count", "focus": 2}),
    scene([
        L("Dadi", "More than 2,000 years ago, a Greek scholar named Eratosthenes found a clever way to catch all the primes. It is called a sieve, like Mummy's flour chhalni.",
          "2,000 saal se bhi pehle, Eratosthenes naam ke ek Greek vidwaan ne saare primes pakadne ka ek chatur tareeka nikaala. Ise sieve kehte hain, Mummy ki aate ki chhalni jaisa."),
        L("Dadi", "Write 1 to 100. Cross out 1, because it is not prime.", "1 se 100 tak likho. 1 ko kaat do, kyonki woh prime nahi hai."),
    ], {"mode": "sieve", "step": 0}),
    scene([
        L("Dadi", "2 is the first prime. Circle it, then cross out every multiple of 2: 4, 6, 8, and so on.", "2 pehla prime hai. Use gol karo, phir 2 ka har multiple kaato: 4, 6, 8, aur aage."),
    ], {"mode": "sieve", "step": 1}),
    scene([
        L("Dadi", "The next number still standing is 3. Circle it and cross out its multiples. Then 5, and then 7.", "Agla bacha hua number 3 hai. Use gol karo aur uske multiples kaato. Phir 5, aur phir 7."),
        L("Harsh", "The colours are falling like rain!", "Rang baarish ki tarah gir rahe hain!"),
    ], {"mode": "sieve", "step": 4}),
    scene([
        L("Disha", "Why do we stop at 7?", "Hum 7 par kyon ruk gaye?"),
        L("Dadi", "The next prime is 11, and 11 times 11 is 121, more than 100. So every composite number up to 100 has already been crossed out. The 25 numbers left are all prime!",
          "Agla prime 11 hai, aur 11 guna 11 barabar 121, jo 100 se zyaada hai. Toh 100 tak ka har composite number pehle hi kat chuka hai. Bache hue 25 numbers sab prime hain!"),
    ], {"mode": "sieve", "step": 4}),
    scene([
        L("Harsh", "Look, 3 and 5, 5 and 7, 11 and 13, 17 and 19. Primes in pairs that differ by 2!", "Dekho, 3 aur 5, 5 aur 7, 11 aur 13, 17 aur 19. Primes jodiyon mein, jinka antar 2 hai!"),
        L("Dadi", "These are twin primes, and there are 8 twin pairs up to 100. Do they go on forever? Nobody knows yet!",
          "Inhe twin primes kehte hain, aur 100 tak 8 twin jodiyan hain. Kya yeh hamesha chalti rahengi? Abhi tak koi nahi jaanta!"),
    ], {"mode": "twins"}),
    scene([
        L("Disha", "I noticed something. 30 is 7 plus 23, and 30 is also 13 plus 17. Can every even number be made by adding two primes?",
          "Maine kuch dekha. 30 barabar 7 plus 23, aur 30 barabar 13 plus 17 bhi. Kya har even number do primes jodkar ban sakta hai?"),
        L("Dadi", "Christian Goldbach asked the same question in a letter to Euler in 1742. Computers have checked every even number up to 4 followed by 18 zeros, and it always works. But nobody has proved it, so it is still a mystery!",
          "Christian Goldbach ne 1742 mein Euler ko ek chitthi mein yahi sawaal poocha tha. Computers ne 4 ke baad 18 zero tak ke har even number ko check kiya hai, aur har baar yeh sahi nikla. Lekin abhi tak kisi ne ise prove nahi kiya, isliye yeh aaj bhi ek rahasya hai!"),
    ], {"mode": "goldbach", "even": 30}),
    scene([
        L("Dadi", "Your turn! Run the sieve yourself. Tap the first prime, then keep tapping the smallest number that is still standing.",
          "Ab aapki baari! Sieve khud chalaao. Pehle prime ko tap karo, phir sabse chhote bache hue number ko tap karte jao."),
    ], {"mode": "sieve", "step": 0, "task": "sieve"}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "Papa comes home from the railway yard with a puzzle.", "Papa railway yard se ek paheli lekar ghar aate hain."),
        L("Deepak", "A goods train is carrying 7,236 boxes of mangoes. Can they be shared equally among 9 wagons? I have no calculator!",
          "Ek maalgaadi mein aam ke 7,236 dabbe hain. Kya inhe 9 wagons mein barabar baanta ja sakta hai? Mere paas calculator nahi hai!"),
        L("Dadi", "You don't need one. Use a divisibility test. But first, let us learn why each test works.",
          "Uski zaroorat nahi. Divisibility test lagaao. Lekin pehle samjhte hain ki har test kaam kyon karta hai."),
    ], {"num": 7236, "test": 9}),
    scene([
        L("Dadi", "Start with 2. Every ten, every hundred, every thousand is already a multiple of 2, because 10 is 2 times 5. So only the ones digit decides.",
          "2 se shuru karo. Har das, har sau, har hazaar pehle se 2 ka multiple hai, kyonki 10 barabar 2 guna 5. Toh sirf ones ka digit faisla karta hai."),
        L("Harsh", "7,236 ends in 6, which is even. So it is divisible by 2!", "7,236 ke aakhir mein 6 hai, jo even hai. Toh yeh 2 se divisible hai!"),
    ], {"num": 7236, "test": 2}),
    scene([
        L("Disha", "The same reason works for 5 and 10. For 5, the last digit must be 0 or 5. For 10, it must be 0.", "Yahi kaaran 5 aur 10 ke liye bhi chalta hai. 5 ke liye aakhri digit 0 ya 5 ho. 10 ke liye 0 ho."),
    ], {"num": 4385, "test": 5}),
    scene([
        L("Deepak", "For 4, look at the last two digits, because 100 is 4 times 25. 36 is divisible by 4, so 7,236 is too.",
          "4 ke liye aakhri do digits dekho, kyonki 100 barabar 4 guna 25. 36, 4 se divisible hai, toh 7,236 bhi."),
    ], {"num": 7236, "test": 4}),
    scene([
        L("Deepak", "For 8, look at the last three digits, because 1,000 is 8 times 125. 236 is not divisible by 8, so the boxes cannot go into 8 wagons equally.",
          "8 ke liye aakhri teen digits dekho, kyonki 1,000 barabar 8 guna 125. 236, 8 se divisible nahi, toh dabbe 8 wagons mein barabar nahi jaa sakte."),
    ], {"num": 7236, "test": 8}),
    scene([
        L("Dadi", "Now the magic test for 9. Every 10 is 9 plus 1, every 100 is 99 plus 1, and every 1,000 is 999 plus 1. Take away all the nines, and each digit leaves behind just its own value.",
          "Ab 9 ka jaadui test. Har 10 barabar 9 plus 1, har 100 barabar 99 plus 1, aur har 1,000 barabar 999 plus 1. Saare nau hata do, toh har digit sirf apni value peeche chhodta hai."),
        L("Disha", "The leftovers are 7 plus 2 plus 3 plus 6, which is 18. And 18 is divisible by 9, so 7,236 is too!",
          "Bache hue hain 7 plus 2 plus 3 plus 6, yaani 18. Aur 18, 9 se divisible hai, toh 7,236 bhi!"),
        L("Deepak", "So each of the 9 wagons gets 804 boxes. Wah!", "Toh har wagon ko 804 dabbe milenge. Wah!"),
    ], {"num": 7236, "test": 9}),
    scene([
        L("Harsh", "And for 3, the same trick works, because 9 is a multiple of 3. The digit sum just has to be divisible by 3.",
          "Aur 3 ke liye bhi yahi trick, kyonki 9, 3 ka multiple hai. Bas digit sum 3 se divisible hona chahiye."),
        L("Disha", "So 1,234 fails. Its digit sum is 10, and 10 is not a multiple of 3.", "Toh 1,234 fail. Uska digit sum 10 hai, aur 10, 3 ka multiple nahi hai."),
    ], {"num": 1234, "test": 3}),
    scene([
        L("Neha", "I pack samosas 6 to a box. Today I made 1,236 samosas. Will they fill the boxes exactly?",
          "Main ek box mein 6 samose pack karti hoon. Aaj maine 1,236 samose banaaye. Kya box poore bharenge?"),
        L("Dadi", "6 is 2 times 3. The number is even, and its digit sum is 12, divisible by 3. It passes both tests, so it is divisible by 6.",
          "6 barabar 2 guna 3. Number even hai, aur uska digit sum 12 hai, jo 3 se divisible hai. Dono test paas, toh yeh 6 se divisible hai."),
    ], {"num": 1236, "test": 6}),
    scene([
        L("Dadi", "Last, the test for 11. 10 is 11 minus 1, 100 is 99 plus 1, and 1,000 is 1,001 minus 1. So starting from the ones digit, we add and subtract the digits in turn.",
          "Aakhir mein, 11 ka test. 10 barabar 11 minus 1, 100 barabar 99 plus 1, aur 1,000 barabar 1,001 minus 1. Toh ones digit se shuru karke, digits ko baari baari jodte aur ghataate hain."),
        L("Disha", "For 7,183: 3 minus 8 plus 1 minus 7 is minus 11. That is a multiple of 11, so 7,183 is divisible by 11!",
          "7,183 ke liye: 3 minus 8 plus 1 minus 7 barabar minus 11. Yeh 11 ka multiple hai, toh 7,183, 11 se divisible hai!"),
    ], {"num": 7183, "test": 11}),
    scene([
        L("Deepak", "Your turn! A wagon number has a smudged digit: 5, 2, blank, 6. It is divisible by 9, so which digit is missing?",
          "Ab aapki baari! Ek wagon number ka ek digit mit gaya hai: 5, 2, khaali, 6. Yeh 9 se divisible hai, toh kaun sa digit gaayab hai?"),
    ], {"test": 9, "task": {"pattern": "52_6", "by": 9}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "Disha's homework says: write 72 as a product of primes. Dadi draws a factor tree.", "Disha ke homework mein likha hai: 72 ko primes ke guna ke roop mein likho. Dadi ek factor tree banaati hain."),
        L("Dadi", "72 is 8 times 9, 8 is 2 times 4, and 4 is 2 times 2. 9 is 3 times 3. When every leaf is a prime, we stop.",
          "72 barabar 8 guna 9, 8 barabar 2 guna 4, aur 4 barabar 2 guna 2. 9 barabar 3 guna 3. Jab har patta prime ho jaaye, hum ruk jaate hain."),
    ], {"mode": "tree", "n": 72, "split": [8, 9]}),
    scene([
        L("Disha", "So 72 is 2 times 2 times 2 times 3 times 3.", "Toh 72 barabar 2 guna 2 guna 2 guna 3 guna 3."),
        L("Harsh", "But I split 72 as 6 times 12. My tree looks totally different!", "Lekin maine 72 ko 6 guna 12 mein toda. Mera tree bilkul alag dikhta hai!"),
    ], {"mode": "compare", "n": 72, "split": [8, 9], "split2": [6, 12]}),
    scene([
        L("Dadi", "Different trees, but look at the leaves: the same three 2s and two 3s. Every number greater than 1 breaks into primes in exactly one way. This is called its prime factorisation.",
          "Tree alag hain, lekin patte dekho: wahi teen 2 aur do 3. 1 se bada har number primes mein sirf ek hi tarah se tootta hai. Ise prime factorisation kehte hain."),
    ], {"mode": "compare", "n": 72, "split": [2, 36], "split2": [6, 12]}),
    scene([
        L("Deepak", "Like a train made of standard coaches. 210 is 10 times 21, which is 2 times 5 times 3 times 7. Primes are the building blocks of every number.",
          "Jaise standard coaches se bani train. 210 barabar 10 guna 21, yaani 2 guna 5 guna 3 guna 7. Primes har number ki eenten hain."),
    ], {"mode": "tree", "n": 210, "split": [10, 21]}),
    scene([
        L("Disha", "Dadi, 8 and 15 have no common factor except 1.", "Dadi, 8 aur 15 ka 1 ke alaawa koi common factor nahi hai."),
        L("Dadi", "Then they are co-prime. 8 is 2 times 2 times 2, and 15 is 3 times 5. They share no prime at all.",
          "Toh woh co-prime hain. 8 barabar 2 guna 2 guna 2, aur 15 barabar 3 guna 5. Inme koi bhi prime common nahi hai."),
    ], {"mode": "coprime", "a": 8, "b": 15}),
    scene([
        L("Harsh", "But 8 and 15 are not prime themselves!", "Lekin 8 aur 15 khud toh prime nahi hain!"),
        L("Dadi", "Exactly. Co-prime numbers do not have to be prime. They just must not share any factor other than 1.",
          "Bilkul. Co-prime numbers ka prime hona zaroori nahi. Bas unme 1 ke alaawa koi factor common nahi hona chahiye."),
    ], {"mode": "coprime", "a": 8, "b": 15}),
    scene([
        L("Dadi", "Now 12 and 18. They share 2, 3 and 6, so they are not co-prime.", "Ab 12 aur 18. Inme 2, 3 aur 6 common hain, toh yeh co-prime nahi hain."),
    ], {"mode": "coprime", "a": 12, "b": 18}),
    scene([
        L("Narrator", "For her Diwali craft, Disha hammers 10 nails in a circle and winds a golden thread, jumping 3 nails each time.",
          "Diwali craft ke liye Disha ek gol ghere mein 10 keelein thokti hai aur sunehra dhaaga lapet'ti hai, har baar 3 keel aage koodte hue."),
        L("Disha", "The thread visits all 10 nails before it comes back!", "Dhaaga wapas aane se pehle saari 10 keelon par jaata hai!"),
        L("Dadi", "Because 10 and 3 are co-prime.", "Kyonki 10 aur 3 co-prime hain."),
    ], {"mode": "thread", "pins": 10, "step": 3}),
    scene([
        L("Harsh", "Let me jump 4 nails instead. Hey, it came back after only 5 nails!", "Main 4 keel koodta hoon. Arre, yeh sirf 5 keelon ke baad wapas aa gaya!"),
        L("Dadi", "Because 10 and 4 share the factor 2. A common factor makes the thread skip half the nails.",
          "Kyonki 10 aur 4 mein factor 2 common hai. Common factor ki wajah se dhaaga aadhi keelein chhod deta hai."),
    ], {"mode": "thread", "pins": 10, "step": 4}),
    scene([
        L("Dadi", "Your turn! Build the factor tree of 84. Tap every glowing number to split it, until only primes are left.",
          "Ab aapki baari! 84 ka factor tree banaao. Har chamakte number ko tap karke todo, jab tak sirf primes na bachein."),
    ], {"mode": "build", "n": 84, "task": True}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "On Sunday, Papa takes the children to the railway station. Two local trains start from the platform at 6 in the morning.",
          "Ravivaar ko Papa bachchon ko railway station le jaate hain. Do local trains subah 6 baje platform se chalti hain."),
        L("Deepak", "Train A leaves every 12 minutes and Train B every 18 minutes. When will they leave together again?",
          "Train A har 12 minute mein chalti hai aur Train B har 18 minute mein. Dono phir ek saath kab chalengi?"),
    ], {"mode": "timeline", "a": 12, "b": 18, "start": "6:00", "labels": ["Train A", "Train B"]}),
    scene([
        L("Dadi", "List the multiples: 12, 24, 36, and 18, 36. The first common multiple is 36, so the trains leave together at 6:36.",
          "Multiples ki list banaao: 12, 24, 36, aur 18, 36. Pehla common multiple 36 hai, toh trains 6:36 par ek saath chalengi."),
    ], {"mode": "list", "kind": "multiples", "a": 12, "b": 18}),
    scene([
        L("Dadi", "A faster way uses primes. 12 is 2 times 2 times 3, and 18 is 2 times 3 times 3. For the LCM, take every prime the most times it appears: 2 times 2 times 3 times 3 is 36.",
          "Ek tez tareeka primes se hai. 12 barabar 2 guna 2 guna 3, aur 18 barabar 2 guna 3 guna 3. LCM ke liye har prime ko utni baar lo jitni zyaada se zyaada baar woh aata hai: 2 guna 2 guna 3 guna 3 barabar 36."),
    ], {"mode": "prime", "a": 12, "b": 18, "show": "lcm"}),
    scene([
        L("Neha", "Now my bakery problem. I have 12 kaju barfis and 18 laddoos, and I want identical gift boxes with the same mix and nothing left over. What is the largest number of boxes?",
          "Ab meri bakery ki samasya. Mere paas 12 kaju barfi aur 18 laddoo hain, aur mujhe ek jaise gift box chahiye, har box mein same mix, aur kuch na bache. Zyaada se zyaada kitne box?"),
        L("Disha", "The factors of 12 and 18 that match are 1, 2, 3 and 6. The highest is 6!", "12 aur 18 ke milte julte factors 1, 2, 3 aur 6 hain. Sabse bada 6 hai!"),
        L("Dadi", "That is the highest common factor, the HCF. 6 boxes, each with 2 barfis and 3 laddoos.", "Yahi highest common factor, yaani HCF hai. 6 box, har ek mein 2 barfi aur 3 laddoo."),
    ], {"mode": "list", "kind": "factors", "a": 12, "b": 18}),
    scene([
        L("Dadi", "With primes, the HCF is the part they share, in the middle: 2 times 3, which is 6.", "Primes se, HCF woh hissa hai jo dono mein common hai, beech mein: 2 guna 3, yaani 6."),
    ], {"mode": "prime", "a": 12, "b": 18, "show": "hcf"}),
    scene([
        L("Deepak", "The station waiting room floor is 840 centimetres by 600 centimetres. What is the largest square tile that covers it exactly, without cutting any tile?",
          "Station ke waiting room ka farsh 840 centimetre guna 600 centimetre hai. Sabse badi square tile kaunsi hai jo bina kaate poora farsh dhak de?"),
        L("Dadi", "Use continued division: 840 divided by 600 leaves 240, and 600 divided by 240 leaves 120. Then 240 divided by 120 leaves nothing, so the last divisor, 120, is the HCF!",
          "Continued division lagaao: 840 ko 600 se bhaag do, 240 bachta hai, aur 600 ko 240 se bhaag do, 120 bachta hai. Phir 240 ko 120 se bhaag do, kuch nahi bachta, toh aakhri divisor, 120, HCF hai!"),
        L("Harsh", "So tiles of 120 centimetres, 7 along one side and 5 along the other. 35 tiles!", "Toh 120 centimetre ki tiles, ek taraf 7 aur doosri taraf 5. 35 tiles!"),
    ], {"mode": "division", "a": 840, "b": 600}),
    scene([
        L("Disha", "Our Diwali lights blink every 4, 6 and 10 seconds. When do all three blink together?", "Hamaari Diwali lights har 4, 6 aur 10 second mein jhapakti hain. Teeno ek saath kab jhapakengi?"),
        L("Dadi", "Use the division method: divide by primes, and carry down any number that does not divide. The primes on the left are 2, 2, 3 and 5, and their product, 60, is the LCM. So all three blink together every 60 seconds!",
          "Division method lagaao: primes se bhaag do, aur jo divide na ho use neeche utaar do. Baayein taraf 2, 2, 3 aur 5 hain, aur inka guna, 60, LCM hai. Toh har 60 second mein teeno ek saath jhapakti hain!"),
    ], {"mode": "ladder", "a": 4, "b": 6, "c": 10}),
    scene([
        L("Disha", "Wait! For 12 and 18, the HCF is 6 and the LCM is 36. 6 times 36 is 216, and 12 times 18 is also 216!",
          "Ruko! 12 aur 18 ke liye HCF 6 aur LCM 36 hai. 6 guna 36 barabar 216, aur 12 guna 18 bhi 216!"),
        L("Dadi", "It always works for two numbers. The same prime chips are just regrouped: HCF times LCM equals the product of the two numbers.",
          "Do numbers ke liye yeh hamesha sahi hai. Wahi prime chips bas naye tareeke se jamaaye gaye hain: HCF guna LCM barabar dono numbers ka guna."),
    ], {"mode": "product", "a": 12, "b": 18}),
    scene([
        L("Dadi", "Your turn! At the temple, one bell rings every 6 minutes and another every 8 minutes, and they just rang together. Slide the marker to when they ring together next.",
          "Ab aapki baari! Mandir mein ek ghanti har 6 minute mein bajti hai aur doosri har 8 minute mein, aur abhi dono ek saath baji. Marker ko us samay par le jao jab woh agli baar saath bajengi."),
    ], {"mode": "timeline", "a": 6, "b": 8, "labels": ["Bell 1", "Bell 2"], "task": "lcm"}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "Before the unit test, Dadi gives Harsh and Disha a practice sheet.", "Unit test se pehle Dadi Harsh aur Disha ko ek practice sheet deti hain."),
        L("Dadi", "Question 1. Find all the factors of 48.", "Sawaal 1. 48 ke saare factors nikaalo."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "I'll find them in pairs: 1 times 48, 2 times 24, 3 times 16, 4 times 12, 6 times 8. 7 doesn't work, and the next is 8, which I already have. So 48 has 10 factors.",
          "Main jodiyon mein dhoondhti hoon: 1 guna 48, 2 guna 24, 3 guna 16, 4 guna 12, 6 guna 8. 7 nahi chalta, aur agla 8 hai, jo pehle mil chuka. Toh 48 ke 10 factors hain."),
    ], {"example": 0, "step": 4}),
    scene([
        L("Dadi", "Question 2. Write 360 as a product of primes.", "Sawaal 2. 360 ko primes ke guna ke roop mein likho."),
        L("Harsh", "360 is 36 times 10. 36 is 2 times 2 times 3 times 3, and 10 is 2 times 5. So 360 is 2 times 2 times 2 times 3 times 3 times 5.",
          "360 barabar 36 guna 10. 36 barabar 2 guna 2 guna 3 guna 3, aur 10 barabar 2 guna 5. Toh 360 barabar 2 guna 2 guna 2 guna 3 guna 3 guna 5."),
    ], {"example": 1, "step": 4}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, solve it in your notebook first, then reveal the steps to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein hal karo, phir steps kholkar check karo."),
    ], {"example": 2, "step": 0}),
]


PARTS = [
    {
        "title": "Story 1: Mummy's Laddoo Trays · Factors and Multiples",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>It is Diwali week. Mummy wants to pack 12 laddoos in a tray in equal rows with none left over. Every tray she can make tells us a factor of 12.</div>

<h2>Factors: the rectangles you can make</h2>
<p>A <strong>factor</strong> of a number divides it exactly (no remainder). If you can arrange n tiles (or laddoos) in a rectangle with r rows, then r is a factor of n.</p>
<div {CARD}>
  <div>12 laddoos: 1 × 12, 2 × 6, 3 × 4 → factors of 12 are <strong class="text-amber-300">1, 2, 3, 4, 6, 12</strong></div>
  <div>5 rows? 5 × 2 = 10, with 2 left over → 5 is <strong class="text-red-300">not</strong> a factor of 12</div>
  <div>Factors come in <strong>pairs</strong> that multiply to the number. Stop looking when the pair starts repeating.</div>
</div>

<h2>Multiples: tray after tray</h2>
<p>A <strong>multiple</strong> of a number is that number times 1, 2, 3, … : the multiples of 12 are 12, 24, 36, 48, …</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Factors</th><th class="text-left">Multiples</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Finite (a fixed list)</td><td>Infinite (never end)</td></tr>
    <tr><td>Each is ≤ the number</td><td>Each is ≥ the number</td></tr>
    <tr><td>1 is a factor of every number</td><td>Every number is a multiple of 1</td></tr>
  </tbody>
</table>
<p>Every number is both a factor and a multiple of itself. If a is a factor of b, then b is a multiple of a.</p>

<h2>Perfect numbers</h2>
<div {FORMULA}>A perfect number = the sum of its factors (other than itself)</div>
<ul>
  <li>6: 1 + 2 + 3 = 6 ✓</li>
  <li>28: 1 + 2 + 4 + 7 + 14 = 28 ✓</li>
  <li>12: 1 + 2 + 3 + 4 + 6 = 16 ✗ (more than 12)</li>
</ul>
<p>Ganita Prakash says it another way: the sum of <em>all</em> the factors of a perfect number is twice the number (for 28: 56). The next perfect number is 496.</p>
""",
        "keyInsight": "A factor divides a number exactly and makes a perfect rectangle; multiples are what you get by skip counting and they never end.",
        "widgetType": "Class6LaddooTrayWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Which of these is NOT a factor of 36?",
            "options": ["4", "9", "8", "12"],
            "correctIndex": 2,
            "explanation": "36 ÷ 8 = 4 remainder 4. The factors of 36 are 1, 2, 3, 4, 6, 9, 12, 18, 36.",
        },
        "teacherNotes": teacher(
            [
                "Give each group 12 (then 7, then 36) counters or bottle caps and ask for every possible rectangle; record rows × columns on the board.",
                "Find factors in pairs from 1 upwards; stop when the pair repeats (for 36: 6 × 6).",
                "Link factors and multiples in one sentence: 3 is a factor of 12, so 12 is a multiple of 3.",
            ],
            [
                "Forgetting 1 and the number itself in the list of factors.",
                "Mixing up factors and multiples (saying 24 is a factor of 12).",
                "Listing only a few multiples and thinking the list ends.",
            ],
            "Rectangle hunt: each pair of students gets a number between 12 and 40 and a pile of counters; they draw every rectangle and list the factors. The class then sorts the numbers by how many rectangles they had.",
            "Old NCERT Ch. 3 (3.2 Factors and multiples, perfect numbers); Ganita Prakash Ch. 5 Prime Time (5.1 Factors and multiples).",
        ),
    },
    {
        "title": "Story 2: Diwali Night Games · Idli-Vada and Common Multiples",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>After the diyas are lit, the cousins sit in a circle to play idli-vada, the counting game from Ganita Prakash. Then Papa sets a frog and a rabbit jumping along a number line.</div>

<h2>The idli-vada game</h2>
<div {CARD}>
  <div>Count 1, 2, 3, … in turns. For a multiple of <strong class="text-amber-300">3</strong> say <strong class="text-amber-300">idli</strong>; for a multiple of <strong class="text-sky-300">5</strong> say <strong class="text-sky-300">vada</strong>.</div>
  <div>For a multiple of <strong>both</strong> say <strong class="text-emerald-300">idli-vada</strong>. A wrong word and you are out!</div>
  <div>1, 2, idli, 4, vada, idli, 7, 8, idli, vada, 11, idli, 13, 14, <strong class="text-emerald-300">idli-vada</strong>, …</div>
</div>
<p>Idli-vada is said at 15, 30, 45, 60, …: the <strong>common multiples</strong> of 3 and 5. Up to 90 that is 6 times (90 ÷ 15).</p>
<p>Play with 2 and 4 and you never say plain "vada", because every multiple of 4 is already a multiple of 2.</p>

<h2>Jumping animals</h2>
<p>A frog jumps 3 at a time and a rabbit 4 at a time, both from 0. They land on the same spots at <strong>12, 24, 36, …</strong>: the common multiples of 3 and 4.</p>
<div {FORMULA}>Lowest Common Multiple (LCM) = the smallest common multiple</div>
<ul>
  <li>LCM(3, 5) = 15, LCM(3, 4) = 12, LCM(2, 4) = 4</li>
  <li>Every common multiple is a multiple of the LCM.</li>
</ul>
""",
        "keyInsight": "Numbers that are multiples of both numbers are common multiples; the smallest is the LCM, and all the others are its multiples.",
        "widgetType": "Class6IdliVadaWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "In the idli-vada game with idli for 4 and vada for 6, which is the first number where you say idli-vada?",
            "options": ["24", "10", "12", "18"],
            "correctIndex": 2,
            "explanation": "Multiples of 4: 4, 8, 12, … Multiples of 6: 6, 12, … The first common multiple is 12.",
        },
        "teacherNotes": teacher(
            [
                "Play the game aloud with the whole class standing; students who slip sit down. Then write the idli-vada numbers on the board and ask what they have in common.",
                "Change the pair (2 and 5, 3 and 7, 4 and 6, 2 and 4) and predict the first idli-vada before playing.",
                "Use two coloured chalks on a number line for the jumping animals; circle where both land.",
            ],
            [
                "Saying idli-vada for any multiple of 3 or 5 (it must be both).",
                "Thinking the LCM of two numbers is always their product (LCM of 4 and 6 is 12, not 24).",
            ],
            "Idli-vada tournament: groups of six play with different pairs; each group then reports how many times they said idli-vada up to 60 and explains why.",
            "Ganita Prakash Ch. 5 Prime Time (5.1 Common multiples, idli-vada); old NCERT Ch. 3 (3.7 Common factors and common multiples).",
        ),
    },
    {
        "title": "Story 3: Dadi's Number Sieve · Prime and Composite Numbers",
        "readingTime": "~8 min story",
        "narrative": f"""
<div {STORY}>Seven laddoos refuse to make any tray except one long row. Dadi explains why, and then catches every prime up to 100 with a sieve invented more than 2,000 years ago.</div>

<h2>Prime, composite, and 1</h2>
<div {CARD}>
  <div><strong class="text-emerald-300">Prime</strong>: exactly two factors, 1 and itself (2, 3, 5, 7, 11, …)</div>
  <div><strong class="text-amber-300">Composite</strong>: more than two factors (4, 6, 8, 9, 10, 12, …)</div>
  <div><strong>1</strong> has only one factor, so it is <strong>neither prime nor composite</strong>.</div>
  <div><strong>2</strong> is the only even prime; every other even number has 2 as a factor.</div>
</div>

<h2>The Sieve of Eratosthenes</h2>
<ol>
  <li>Write 1 to 100. Cross out 1.</li>
  <li>Circle 2 and cross out every multiple of 2.</li>
  <li>Circle the next number not crossed (3) and cross out its multiples. Repeat with 5 and 7.</li>
  <li>Stop: 11 × 11 = 121 &gt; 100, so every composite up to 100 is already crossed out.</li>
</ol>
<p>The <strong>25 primes up to 100</strong>: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97.</p>

<h2>Twin primes and an unsolved mystery</h2>
<ul>
  <li><strong>Twin primes</strong> differ by 2: (3, 5), (5, 7), (11, 13), (17, 19), (29, 31), (41, 43), (59, 61), (71, 73). Whether they go on forever is still unknown.</li>
  <li><strong>Goldbach's conjecture</strong> (letter to Euler, 1742): every even number greater than 2 is a sum of two primes. 30 = 7 + 23 = 11 + 19 = 13 + 17. Computers have checked it for every even number up to 4 × 10<sup>18</sup>, but nobody has proved it.</li>
</ul>
""",
        "keyInsight": "Primes have exactly two factors; the sieve removes multiples of 2, 3, 5 and 7 and leaves the 25 primes up to 100.",
        "widgetType": "Class6PrimeSieveWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "Which pair is a pair of twin primes?",
            "options": ["(15, 17)", "(29, 31)", "(31, 33)", "(23, 27)"],
            "correctIndex": 1,
            "explanation": "29 and 31 are both prime and differ by 2. 15 and 33 are composite (3 × 5, 3 × 11); 23 and 27 differ by 4.",
        },
        "teacherNotes": teacher(
            [
                "Start from rectangles: a prime number of counters makes only one rectangle (a single row).",
                "Do the sieve on a printed 1–100 grid with four coloured pencils, one per prime.",
                "Ask why we may stop at 7 for 100 (any composite up to 100 has a factor ≤ 10, so one of 2, 3, 5, 7).",
            ],
            [
                "Calling 1 a prime.",
                "Thinking every odd number is prime (9, 15, 21, 51, 91 are composite).",
                "Forgetting that 2 is prime.",
            ],
            "Prime detectives: each student picks an even number from 4 to 100 and finds all the ways to write it as a sum of two primes; compare who found the most ways.",
            "Old NCERT Ch. 3 (3.3 Prime and composite numbers, Sieve of Eratosthenes, twin primes, Goldbach); Ganita Prakash Ch. 5 (5.2 Prime numbers).",
        ),
    },
    {
        "title": "Story 4: Papa's Railway Puzzles · Divisibility Tests and Why They Work",
        "readingTime": "~8 min story",
        "narrative": f"""
<div {STORY}>A goods train carries 7,236 boxes of mangoes. Can they be shared equally among 9 wagons? Papa has no calculator, but Dadi has divisibility tests, and she explains why every one of them works.</div>

<h2>Tests that look at the end of the number</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Divisor</th><th class="text-left">Test</th><th class="text-left">Why</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>2</td><td>last digit 0, 2, 4, 6, 8</td><td>10 = 2 × 5, so tens, hundreds, … are already multiples of 2</td></tr>
    <tr><td>5</td><td>last digit 0 or 5</td><td>same reason: 10 is a multiple of 5</td></tr>
    <tr><td>10</td><td>last digit 0</td><td>tens, hundreds, … are multiples of 10</td></tr>
    <tr><td>4</td><td>last two digits divisible by 4</td><td>100 = 4 × 25</td></tr>
    <tr><td>8</td><td>last three digits divisible by 8</td><td>1,000 = 8 × 125</td></tr>
  </tbody>
</table>

<h2>Tests that use the digits</h2>
<div {CARD}>
  <div><strong class="text-amber-300">9</strong>: digit sum divisible by 9. Why: 10 = 9 + 1, 100 = 99 + 1, 1,000 = 999 + 1. Remove the nines and each digit leaves its own value.</div>
  <div>7,236 → 7 + 2 + 3 + 6 = 18 ✓ so 7,236 ÷ 9 = 804</div>
  <div><strong class="text-amber-300">3</strong>: digit sum divisible by 3 (because 9, 99, 999, … are multiples of 3 too).</div>
  <div><strong class="text-amber-300">6</strong>: divisible by both 2 and 3 (6 = 2 × 3, and 2, 3 are co-prime). 1,236: even, digit sum 12 ✓</div>
  <div><strong class="text-amber-300">11</strong>: from the ones digit, add and subtract the digits alternately; the result must be 0 or a multiple of 11. Why: 10 = 11 − 1, 100 = 99 + 1, 1,000 = 1,001 − 1.</div>
  <div>7,183 → 3 − 8 + 1 − 7 = −11 ✓ (7,183 = 11 × 653)</div>
</div>
<div {FORMULA}>Divisible by 4 and 3 ⇒ divisible by 12 (works because 4 and 3 are co-prime)</div>
<p>Careful: divisible by 2 and 4 does <em>not</em> guarantee divisible by 8 (try 12), because 2 and 4 are not co-prime.</p>
""",
        "keyInsight": "Each test works because 10, 100, 1,000 are close to multiples of the divisor; only the leftover part needs checking.",
        "widgetType": "Class6DivisibilityLabWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Which number is divisible by 9?",
            "options": ["4,515", "6,354", "7,282", "8,103"],
            "correctIndex": 1,
            "explanation": "Digit sums: 4,515 → 15; 6,354 → 18 ✓; 7,282 → 19; 8,103 → 12. Only 18 is a multiple of 9 (6,354 = 9 × 706).",
        },
        "teacherNotes": teacher(
            [
                "Teach the 'why' with place value: write 7,236 = 7 × 1,000 + 2 × 100 + 3 × 10 + 6 and split each power of ten into (multiple of 9) + 1.",
                "Group the tests: last-digit tests (2, 5, 10), last-few-digits tests (4, 8), digit-sum tests (3, 9), combined test (6), alternating test (11).",
                "Always verify one example by actual division so students trust the test.",
            ],
            [
                "Using the digit-sum test for 4 or 8.",
                "For 11, starting the alternating sum from the wrong end, or treating a result of 0 as 'not divisible'.",
                "Assuming 'divisible by 2 and 4' means divisible by 8.",
            ],
            "Wagon number relay: the teacher writes a 5-digit number; teams race to fill a table of ✓ / ✗ for 2, 3, 4, 5, 6, 8, 9, 10, 11 and must justify one entry.",
            "Old NCERT Ch. 3 (3.4 Tests for divisibility of numbers); Ganita Prakash Ch. 5 (5.5 Divisibility tests).",
        ),
    },
    {
        "title": "Story 5: Disha's String Art · Prime Factorisation and Co-primes",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Disha's homework asks for 72 as a product of primes. Harsh draws a different factor tree but gets the same primes. Then a Diwali string-art craft shows what co-prime numbers do.</div>

<h2>Factor trees</h2>
<p>Split a number into two factors, then keep splitting every composite branch until every leaf is prime.</p>
<div {CARD}>
  <div>72 → 8 × 9 → (2 × 4) × (3 × 3) → 2 × 2 × 2 × 3 × 3</div>
  <div>72 → 6 × 12 → (2 × 3) × (3 × 4) → 2 × 2 × 2 × 3 × 3 (same primes!)</div>
</div>
<div {FORMULA}>Every number greater than 1 has exactly one prime factorisation (apart from order).</div>
<p>You can also divide by the smallest prime again and again: 84 ÷ 2 = 42, ÷ 2 = 21, ÷ 3 = 7, so 84 = 2 × 2 × 3 × 7.</p>

<h2>Co-prime numbers</h2>
<div {CARD}>
  <div>Two numbers are <strong class="text-emerald-300">co-prime</strong> if their only common factor is 1.</div>
  <div>8 = 2 × 2 × 2 and 15 = 3 × 5 share no prime → co-prime (though neither is prime!)</div>
  <div>12 and 18 share 2, 3 and 6 → not co-prime. Any two different primes are co-prime; so are two consecutive numbers.</div>
</div>
<h2>String art</h2>
<p>With 10 nails in a circle, a thread that jumps 3 nails each time visits all 10 nails before returning, because 10 and 3 are co-prime. Jumping 4 nails returns after only 5 nails, because 10 and 4 share the factor 2 (10 ÷ 2 = 5).</p>
""",
        "keyInsight": "However you start the factor tree, you end with the same primes; co-prime numbers share no prime at all.",
        "widgetType": "Class6FactorTreeWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "Which pair is co-prime?",
            "options": ["(14, 21)", "(9, 16)", "(12, 15)", "(10, 25)"],
            "correctIndex": 1,
            "explanation": "9 = 3 × 3 and 16 = 2 × 2 × 2 × 2 share no prime. 14 and 21 share 7, 12 and 15 share 3, 10 and 25 share 5.",
        },
        "teacherNotes": teacher(
            [
                "Let different students start the tree of the same number with different splits, then compare the leaves on the board.",
                "Show the repeated-division method alongside the tree; both give the same primes.",
                "For co-primes, compare the prime factorisations side by side and look for any shared prime.",
            ],
            [
                "Stopping the tree at a composite leaf (e.g. leaving 4 or 9).",
                "Writing 1 as a prime factor.",
                "Believing co-prime numbers must themselves be prime.",
            ],
            "String-art lab: on a paper circle with 12 marked points, students join points jumping 5 (co-prime) and jumping 4 (not co-prime) and compare the patterns.",
            "Old NCERT Ch. 3 (3.6 Prime factorisation, co-prime numbers); Ganita Prakash Ch. 5 (5.3 Co-prime numbers, 5.4 Prime factorisation).",
        ),
    },
    {
        "title": "Story 6: Trains, Tiles and Temple Bells · HCF and LCM",
        "readingTime": "~9 min story",
        "narrative": f"""
<div {STORY}>At the station two trains leave together at 6:00, Mummy packs gift boxes, the waiting room needs tiles, the Diwali lights blink, and the temple bells ring. Two ideas solve them all: HCF and LCM.</div>

<h2>HCF: Highest Common Factor</h2>
<div {CARD}>
  <div><strong>Listing</strong>: factors of 12 → 1, 2, 3, 4, 6, 12; factors of 18 → 1, 2, 3, 6, 9, 18; common → 1, 2, 3, 6; <strong class="text-emerald-300">HCF = 6</strong></div>
  <div><strong>Prime factorisation</strong>: 12 = 2 × 2 × 3, 18 = 2 × 3 × 3; take the <em>shared</em> primes: 2 × 3 = 6</div>
  <div><strong>Continued division</strong>: 840 = 1 × 600 + 240; 600 = 2 × 240 + 120; 240 = 2 × 120 + 0 → HCF(840, 600) = 120</div>
</div>
<p>Ganita Prakash's <em>Jumpy Jackpot</em>: the jump sizes that land on two treasures (say at 14 and 36) are the common factors (1 and 2).</p>

<h2>LCM: Lowest Common Multiple</h2>
<div {CARD}>
  <div><strong>Listing</strong>: multiples of 12 → 12, 24, 36; of 18 → 18, 36; <strong class="text-pink-300">LCM = 36</strong></div>
  <div><strong>Prime factorisation</strong>: take each prime the greatest number of times it appears: 2 × 2 × 3 × 3 = 36</div>
  <div><strong>Division method</strong>: divide 4, 6, 10 by primes (2, 2, 3, 5), carrying down numbers that don't divide → LCM = 2 × 2 × 3 × 5 = 60</div>
</div>
<div {FORMULA}>For two numbers: HCF × LCM = product of the numbers   (6 × 36 = 12 × 18 = 216)</div>

<h2>Which one do I need?</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Question asks for…</th><th class="text-left">Use</th><th class="text-left">Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>the largest size that divides / measures / fits exactly</td><td>HCF</td><td>largest tile, biggest container, most gift boxes</td></tr>
    <tr><td>the first time things happen together again; the smallest number divisible by all</td><td>LCM</td><td>trains, bells, blinking lights</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "HCF = the biggest piece that fits into both; LCM = the first meeting point; and for two numbers HCF × LCM = their product.",
        "widgetType": "Class6HcfLcmWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Two ropes are 36 m and 60 m long. They are cut into pieces of equal length, as long as possible, with nothing left over. How long is each piece?",
            "options": ["6 m", "12 m", "180 m", "24 m"],
            "correctIndex": 1,
            "explanation": "We need the largest length that divides both: HCF(36, 60) = 12 m (36 = 2 × 2 × 3 × 3, 60 = 2 × 2 × 3 × 5, shared 2 × 2 × 3).",
        },
        "teacherNotes": teacher(
            [
                "Teach the 'which one?' table first: 'largest that fits' means HCF, 'first time together' means LCM.",
                "Show all three HCF methods on one pair; let students choose the fastest for big numbers (continued division).",
                "Use the Venn diagram of prime factors: the middle is the HCF, the whole picture is the LCM.",
            ],
            [
                "Swapping HCF and LCM in word problems.",
                "For LCM by primes, multiplying all primes from both numbers (counting shared primes twice).",
                "Applying HCF × LCM = product to three numbers (it only works for two).",
            ],
            "Real problems: groups write one HCF and one LCM story from their own life (cricket nets, bus timings, tiffin packing) and swap with another group to solve.",
            "Old NCERT Ch. 3 (3.7 HCF, 3.8 LCM, 3.9 Problems on HCF and LCM); Ganita Prakash Ch. 5 (Jumpy Jackpot, common factors).",
        ),
    },
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~12 min",
        "narrative": f"""
<div {STORY}>Before the unit test, Dadi gives Harsh and Disha a practice sheet covering the whole chapter. They take turns explaining each step.</div>
<h2>How to attack these questions</h2>
<ul>
  <li>Factors: find them in pairs.</li>
  <li>Divisibility: use the right test, then check one by division.</li>
  <li>HCF / LCM: decide which one the question needs, then pick the fastest method.</li>
</ul>
<p>Try each question in your notebook before revealing the steps.</p>
""",
        "keyInsight": "Read the question for its keyword: 'largest that fits' is HCF, 'together again' is LCM.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {"title": "Factors in pairs", "question": "Find all the factors of 48. How many are there?",
                 "steps": ["1 × 48, 2 × 24, 3 × 16", "4 × 12, 6 × 8 (5 and 7 do not divide 48)", "The next is 8, already found, so stop.", "Factors: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48"],
                 "answer": "10 factors: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48"},
                {"title": "Prime factorisation", "question": "Write 360 as a product of prime factors.",
                 "steps": ["360 = 36 × 10", "36 = 6 × 6 = 2 × 3 × 2 × 3", "10 = 2 × 5", "360 = <strong>2 × 2 × 2 × 3 × 3 × 5</strong>"],
                 "answer": "2 × 2 × 2 × 3 × 3 × 5"},
                {"title": "Divisibility table", "question": "Test 75,636 for divisibility by 2, 3, 4, 5, 6, 8, 9, 10 and 11.",
                 "steps": ["Last digit 6: divisible by 2, not by 5 or 10.", "Digit sum 7 + 5 + 6 + 3 + 6 = 27: divisible by 3 and 9, and so by 6 (also even).", "Last two digits 36 ÷ 4 = 9 ✓; last three digits 636 ÷ 8 = 79 r 4 ✗", "11: 6 − 3 + 6 − 5 + 7 = 11 ✓ (75,636 = 11 × 6,876)"],
                 "answer": "Divisible by 2, 3, 4, 6, 9, 11; not by 5, 8, 10"},
                {"title": "Missing digit", "question": "Find the smallest digit * so that 75*36 is divisible by 9.",
                 "steps": ["Digit sum = 7 + 5 + * + 3 + 6 = 21 + *", "The next multiple of 9 after 21 is 27.", "21 + * = 27 → * = 6 (check: 75,636 ÷ 9 = 8,404)"],
                 "answer": "* = 6"},
                {"title": "HCF and LCM by primes", "question": "Find the HCF and LCM of 36 and 84 by prime factorisation.",
                 "steps": ["36 = 2 × 2 × 3 × 3", "84 = 2 × 2 × 3 × 7", "HCF = shared primes = 2 × 2 × 3 = <strong>12</strong>", "LCM = 2 × 2 × 3 × 3 × 7 = <strong>252</strong> (check: 12 × 252 = 3,024 = 36 × 84)"],
                 "answer": "HCF 12, LCM 252"},
                {"title": "Continued division", "question": "Find the HCF of 513 and 1,215 by continued division.",
                 "steps": ["1,215 = 2 × 513 + 189", "513 = 2 × 189 + 135", "189 = 1 × 135 + 54", "135 = 2 × 54 + 27", "54 = 2 × 27 + 0 → HCF = <strong>27</strong>"],
                 "answer": "27"},
                {"title": "Bells together", "question": "Three temple bells ring every 9, 12 and 15 minutes. They ring together at 8:00 a.m. When will they next ring together?",
                 "steps": ["We need the first time together: LCM.", "9 = 3 × 3, 12 = 2 × 2 × 3, 15 = 3 × 5", "LCM = 2 × 2 × 3 × 3 × 5 = 180 minutes = 3 hours", "8:00 a.m. + 3 hours = <strong>11:00 a.m.</strong>"],
                 "answer": "11:00 a.m."},
                {"title": "Measuring tanks", "question": "Two tanks hold 850 litres and 680 litres of water. Find the capacity of the largest container that can measure the water of either tank an exact number of times.",
                 "steps": ["We need the largest that fits exactly: HCF.", "850 = 2 × 5 × 5 × 17, 680 = 2 × 2 × 2 × 5 × 17", "HCF = 2 × 5 × 17 = <strong>170 litres</strong>", "Check: 850 ÷ 170 = 5, 680 ÷ 170 = 4"],
                 "answer": "170 litres"},
                {"title": "Smallest number for 1 to 10", "question": "Find the smallest number that is a multiple of every number from 1 to 10. (A Ganita Prakash puzzle.)",
                 "steps": ["We need LCM(1, 2, …, 10).", "Highest powers: 8 = 2 × 2 × 2, 9 = 3 × 3, 5, 7", "LCM = 8 × 9 × 5 × 7 = <strong>2,520</strong>", "Without 7 it would be 8 × 9 × 5 = 360."],
                 "answer": "2,520"},
                {"title": "HCF × LCM", "question": "The HCF of two numbers is 12 and their product is 2,160. Find their LCM. Give an example of such a pair.",
                 "steps": ["HCF × LCM = product of the two numbers", "12 × LCM = 2,160 → LCM = 2,160 ÷ 12 = <strong>180</strong>", "Example: 36 and 60 (HCF 12, LCM 180, 36 × 60 = 2,160)"],
                 "answer": "LCM = 180 (e.g. 36 and 60)"},
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            ["Ask students to say 'HCF' or 'LCM' for each word problem before calculating anything."],
            ["Q4: choosing 21 + * = 18 (impossible, * cannot be negative).", "Q7: answering 180 without converting to a clock time.", "Q8: giving the LCM (3,400) instead of the HCF."],
            "Pair-share: one student solves aloud, the other checks with the steps; swap for the next question.",
            "Covers old NCERT Ch. 3 exercises 3.1–3.7 and Ganita Prakash Ch. 5 'Figure it out' patterns.",
        ),
    },
    {
        "title": "Chapter Exam · Playing with Numbers (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From laddoo trays to temple bells, you can now take numbers apart and put them back together. Show what you know!</p>
<div {CARD}>
  <div><strong>10 questions</strong> on factors, multiples, primes, divisibility, prime factorisation, co-primes, HCF and LCM.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Factors in pairs, primes as building blocks, HCF for 'largest that fits', LCM for 'together again'.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Playing with Numbers · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "Which of these is a prime number?", "options": ["51", "57", "59", "91"], "answer": 2, "explanation": "51 = 3 × 17, 57 = 3 × 19, 91 = 7 × 13. Only 59 has exactly two factors.", "topic": "Prime numbers"},
                {"q": "How many factors does 36 have?", "options": ["6", "8", "9", "12"], "answer": 2, "explanation": "1, 2, 3, 4, 6, 9, 12, 18, 36: nine factors (6 × 6 is a square, so 6 is counted once).", "topic": "Factors"},
                {"q": "Which number is a perfect number?", "options": ["12", "18", "24", "28"], "answer": 3, "explanation": "1 + 2 + 4 + 7 + 14 = 28. For 12 the sum is 16, for 18 it is 21, for 24 it is 36.", "topic": "Perfect numbers"},
                {"q": "In the idli-vada game (idli for 3, vada for 5), how many times is 'idli-vada' said from 1 to 60?", "options": ["2", "4", "12", "20"], "answer": 1, "explanation": "Idli-vada is for common multiples of 3 and 5, i.e. multiples of 15: 15, 30, 45, 60.", "topic": "Common multiples"},
                {"q": "Which number is divisible by 11?", "options": ["61,284", "62,148", "61,248", "64,128"], "answer": 2, "explanation": "61,248: 8 − 4 + 2 − 1 + 6 = 11, a multiple of 11 (61,248 = 11 × 5,568).", "topic": "Divisibility"},
                {"q": "Which pair of numbers is co-prime?", "options": ["(8, 15)", "(12, 18)", "(14, 35)", "(9, 21)"], "answer": 0, "explanation": "8 = 2 × 2 × 2 and 15 = 3 × 5 share no prime. The others share 6, 7 and 3.", "topic": "Co-prime numbers"},
                {"q": "The prime factorisation of 120 is:", "options": ["2 × 3 × 4 × 5", "2 × 2 × 2 × 3 × 5", "2 × 2 × 3 × 10", "2 × 2 × 2 × 15"], "answer": 1, "explanation": "4, 10 and 15 are not prime. 120 = 2 × 2 × 2 × 3 × 5.", "topic": "Prime factorisation"},
                {"q": "Mummy has 24 kaju barfis and 36 laddoos. She packs identical boxes with no sweets left over. What is the largest number of boxes?", "options": ["6", "12", "72", "4"], "answer": 1, "explanation": "Largest that divides both: HCF(24, 36) = 12 boxes (each with 2 barfis and 3 laddoos).", "topic": "HCF"},
                {"q": "Two trains leave a station every 8 minutes and every 12 minutes. They leave together at 9:00. When do they next leave together?", "options": ["9:04", "9:20", "9:24", "10:36"], "answer": 2, "explanation": "First time together: LCM(8, 12) = 24 minutes, so 9:24.", "topic": "LCM"},
                {"q": "The HCF of two numbers is 4 and their LCM is 48. One number is 16. The other is:", "options": ["3", "12", "24", "192"], "answer": 1, "explanation": "HCF × LCM = product: 4 × 48 = 192 = 16 × other, so other = 12. Check: HCF(16, 12) = 4, LCM = 48.", "topic": "HCF × LCM"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the right story."],
            ["Q1 catches 'odd means prime'; Q2 catches double counting the square root; Q8 and Q9 test HCF vs LCM in words."],
            "Exit ticket: write one real-life HCF question and one real-life LCM question, with answers.",
            "Matches old NCERT Ch. 3 and Ganita Prakash Ch. 5 learning outcomes.",
        ),
    },
]


def seed_class6_playing_with_numbers():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Playing with Numbers")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Playing with Numbers: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Playing with Numbers: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_playing_with_numbers()
