import json
from db import SessionLocal
from seed_class10_structure import get_class10_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 10 · Real Numbers (NCERT Class 10 Ch. 1, rationalised syllabus 2023-24 onward):
# 1.2 The Fundamental Theorem of Arithmetic (prime factorisation, uniqueness, HCF and LCM by prime
# factorisation, HCF × LCM = product of two numbers), 1.3 Revisiting irrational numbers (Theorem 1.2:
# p | a² ⇒ p | a; proofs that √2, √3 are irrational; 5 − √3, 3√2, 1/√2 irrational).
# Euclid's division lemma / algorithm is deleted from the current syllabus and is left out.
# Story: the Jaipur family during Class 10 board preparation: Mummy's sweet shop, Papa's trains, cricket.
#
# Verified facts used:
# - Gauss gave the first complete proof of the Fundamental Theorem of Arithmetic in his
#   "Disquisitiones Arithmeticae" (1801); the result goes back to Euclid's Elements (Book VII and IX).
#   (Wikipedia "Disquisitiones Arithmeticae"; ProofWiki "Fundamental Theorem of Arithmetic/Historical Note";
#   also stated in the NCERT textbook.)
# Story numbers (train intervals, shop orders) are made-up story data, not real statistics.


# ─────────────────────────── Story 1: Factor trees · FTA ───────────────────────────
SCENES_1 = [
    scene([
        L("Narrator", "It is the first Sunday of the new session. Harsh and Disha are now in Class 10, and the board exam is a year away.",
          "Naye session ka pehla Itvaar hai. Harsh aur Disha ab Class 10 mein hain, aur board exam ek saal door hai."),
        L("Neha", "Before you study, help me in the shop. A customer ordered 140 laddoos, and I want to pack them in equal boxes.",
          "Padhaai se pehle shop mein meri madad karo. Ek customer ne 140 laddoo order kiye hain, aur main unhe barabar dabbon mein pack karna chahti hoon."),
    ], {"mode": "tree", "n": 140, "steps": 0}),
    scene([
        L("Dadi", "Then let us break 140 into its building blocks. 140 is 2 times 70. 2 is prime, so it stops there.",
          "Toh chalo 140 ko uske building blocks mein todte hain. 140 barabar 2 guna 70. 2 prime hai, toh woh wahin ruk jaata hai."),
        L("Disha", "And 70 is 2 times 35, and 35 is 5 times 7. All primes now!",
          "Aur 70 barabar 2 guna 35, aur 35 barabar 5 guna 7. Ab sab prime hain!"),
    ], {"mode": "tree", "n": 140, "steps": 99}),
    scene([
        L("Dadi", "So 140 is 2 squared times 5 times 7. Every composite number can be written as a product of primes this way.",
          "Toh 140 barabar 2 ka square guna 5 guna 7. Har composite number ko is tarah primes ke product ki tarah likh sakte hain."),
        L("Harsh", "Even a big one, like 32,760?", "Bade number ka bhi, jaise 32,760?"),
    ], {"mode": "tree", "n": 140, "steps": 99}),
    scene([
        L("Dadi", "Try it. 32,760 is 2 cubed times 3 squared times 5 times 7 times 13. The primes are like atoms, and every number is a molecule built from them.",
          "Try karo. 32,760 barabar 2 ka cube guna 3 ka square guna 5 guna 7 guna 13. Primes atoms jaise hain, aur har number unse bana molecule hai."),
    ], {"mode": "tree", "n": 32760, "steps": 99}),
    scene([
        L("Disha", "But Dadi, if I start the tree differently, say 60 as 6 times 10 instead of 2 times 30, do I get different primes?",
          "Lekin Dadi, agar main tree alag tarah se shuru karoon, jaise 60 ko 2 guna 30 ki jagah 6 guna 10, toh kya alag primes milenge?"),
        L("Dadi", "Never. Both trees end in two 2s, one 3 and one 5. Only the order can change.",
          "Kabhi nahi. Dono trees do 2, ek 3 aur ek 5 par khatam hote hain. Sirf order badal sakta hai."),
    ], {"mode": "two"}),
    scene([
        L("Dadi", "This is the Fundamental Theorem of Arithmetic. Every composite number can be factorised as a product of primes, and this factorisation is unique, apart from the order of the factors.",
          "Yeh Fundamental Theorem of Arithmetic hai. Har composite number ko primes ke product mein factorise kar sakte hain, aur yeh factorisation unique hai, factors ke order ko chhodkar."),
        L("Deepak", "The idea is very old. It goes back to Euclid, and the great German mathematician Gauss gave the first complete proof in 1801.",
          "Yeh idea bahut purana hai. Yeh Euclid tak jaata hai, aur mahaan German mathematician Gauss ne iska pehla poora proof 1801 mein diya."),
    ], {"mode": "two"}),
    scene([
        L("Harsh", "So is 7 times 11 times 13, plus 13, a prime? It looks huge and odd.",
          "Toh kya 7 guna 11 guna 13, plus 13, prime hai? Bada aur odd lagta hai."),
        L("Disha", "Take 13 common. It is 13 times 78. It has the factor 13, so it is composite!",
          "13 common nikaalo. Yeh 13 guna 78 hai. Iska factor 13 hai, toh yeh composite hai!"),
    ], {"mode": "tree", "n": 156, "steps": 99}),
    scene([
        L("Neha", "Your turn! Break 3,825 into primes. Tap a prime that divides the box each time.",
          "Ab aapki baari! 3,825 ko primes mein todo. Har baar woh prime dabaao jo box ko divide karta hai."),
    ], {"mode": "tree", "n": 3825, "picks": [], "task": {"n": 3825}}, wait=True),
]

# ─────────────────────────── Story 2: Ending in zero ───────────────────────────
SCENES_2 = [
    scene([
        L("Narrator", "On Monday evening, Harsh is doing powers on his calculator during a cricket break.",
          "Somvaar shaam, cricket ke break mein Harsh calculator par powers kar raha hai."),
        L("Harsh", "4, 16, 64, 256. If I keep going, surely some power of 4 will end in zero?",
          "4, 16, 64, 256. Agar main chalta rahoon, toh kabhi na kabhi 4 ki koi power zero par khatam hogi?"),
    ], {"base": 4, "n": 3}),
    scene([
        L("Dadi", "Look at the primes. 4 is 2 times 2, so 4 to the power n is only 2s multiplied together.",
          "Primes dekho. 4 barabar 2 guna 2, toh 4 ki power n sirf 2 ka guna hai."),
        L("Disha", "And a number ends in zero only if 10 divides it. 10 is 2 times 5, so we need a 5 too.",
          "Aur koi number zero par tabhi khatam hota hai jab 10 use divide kare. 10 barabar 2 guna 5, toh ek 5 bhi chahiye."),
    ], {"base": 4, "n": 6}),
    scene([
        L("Dadi", "By the uniqueness of prime factorisation, no other prime can ever sneak in. There is no 5 in 4 to the power n, so it never ends in zero.",
          "Prime factorisation unique hai, isliye koi doosra prime kabhi andar nahi aa sakta. 4 ki power n mein koi 5 nahi, toh woh kabhi zero par khatam nahi hota."),
    ], {"base": 4, "n": 6}),
    scene([
        L("Harsh", "Then 6 to the power n? 6 is 2 times 3. Still no 5, so no zero either.",
          "Toh 6 ki power n? 6 barabar 2 guna 3. Phir bhi koi 5 nahi, toh zero bhi nahi."),
    ], {"base": 6, "n": 4}),
    scene([
        L("Disha", "But 10 is 2 times 5. So 10 to the power 3 has three 2s and three 5s, which make three zeros.",
          "Lekin 10 barabar 2 guna 5. Toh 10 ki power 3 mein teen 2 aur teen 5 hain, jo teen zero banaate hain."),
        L("Dadi", "Exactly. Each pair of a 2 and a 5 gives one zero at the end.",
          "Bilkul. Har 2 aur 5 ki jodi end mein ek zero deti hai."),
    ], {"base": 10, "n": 3}),
    scene([
        L("Neha", "In my shop, a bill ends in zero only when it is a multiple of 10. Same rule!",
          "Meri shop mein bill zero par tabhi khatam hota hai jab woh 10 ka multiple ho. Wahi rule!"),
    ], {"base": 15, "n": 2}),
    scene([
        L("Dadi", "Your turn! Choose a base and a power so that the answer ends in zero.",
          "Ab aapki baari! Aisa base aur power chuno jisse answer zero par khatam ho."),
    ], {"base": 6, "n": 2, "task": {"zero": True}}, wait=True),
]

# ─────────────────────────── Story 3: HCF and LCM ───────────────────────────
SCENES_3 = [
    scene([
        L("Narrator", "On Wednesday, Disha opens the NCERT book at the dining table. Dadi sits beside her with a cup of chai.",
          "Budhvaar ko Disha dining table par NCERT ki kitaab kholti hai. Dadi chai ka cup lekar uske paas baithti hain."),
        L("Dadi", "Prime factors make H C F and L C M easy. Take 6 and 20. 6 is 2 times 3, and 20 is 2 squared times 5.",
          "Prime factors se H C F aur L C M aasaan ho jaate hain. 6 aur 20 lo. 6 barabar 2 guna 3, aur 20 barabar 2 ka square guna 5."),
    ], {"a": 6, "b": 20}),
    scene([
        L("Dadi", "The primes both numbers share sit in the middle. Here only one 2 is common, so the H C F is 2.",
          "Jo primes dono numbers mein common hain, woh beech mein baithte hain. Yahan sirf ek 2 common hai, toh H C F 2 hai."),
        L("Disha", "And the L C M takes everything in the picture: 2, 2, 3 and 5, which is 60.",
          "Aur L C M picture ki har cheez leta hai: 2, 2, 3 aur 5, yaani 60."),
    ], {"a": 6, "b": 20}),
    scene([
        L("Dadi", "In words: the H C F is the product of the smallest power of each common prime. The L C M is the product of the greatest power of each prime involved.",
          "Shabdon mein: H C F har common prime ki sabse chhoti power ka product hai. L C M har prime ki sabse badi power ka product hai."),
    ], {"a": 96, "b": 404}),
    scene([
        L("Harsh", "96 is 2 to the power 5 times 3, and 404 is 2 squared times 101. So the H C F is 4 and the L C M is 9,696.",
          "96 barabar 2 ki power 5 guna 3, aur 404 barabar 2 ka square guna 101. Toh H C F 4 hai aur L C M 9,696."),
        L("Dadi", "Now multiply. 4 times 9,696 is 38,784, and 96 times 404 is also 38,784!",
          "Ab guna karo. 4 guna 9,696 barabar 38,784, aur 96 guna 404 bhi 38,784!"),
    ], {"a": 96, "b": 404, "showProduct": True}),
    scene([
        L("Disha", "Why does that always work?", "Yeh hamesha kyun chalta hai?"),
        L("Dadi", "Because the H C F takes the middle once, and the L C M takes everything once. Together they use every prime of both numbers exactly once each. So for two numbers, H C F times L C M equals their product.",
          "Kyunki H C F beech wale ko ek baar leta hai, aur L C M sab kuch ek baar. Dono milkar dono numbers ka har prime theek ek ek baar use karte hain. Toh do numbers ke liye, H C F guna L C M unke product ke barabar hai."),
    ], {"a": 6, "b": 20, "showProduct": True}),
    scene([
        L("Deepak", "Careful, this rule is only for two numbers. For 6, 72 and 120, the H C F is 6 and the L C M is 360, but 6 times 360 is not the product of all three.",
          "Dhyaan rakho, yeh rule sirf do numbers ke liye hai. 6, 72 aur 120 ka H C F 6 hai aur L C M 360, lekin 6 guna 360 teeno ke product ke barabar nahi."),
    ], {"a": 6, "b": 20, "showProduct": True}),
    scene([
        L("Dadi", "Your turn! Choose two different numbers, neither of them 12, whose H C F is 12.",
          "Ab aapki baari! Do alag numbers chuno, jinme koi bhi 12 na ho, aur jinka H C F 12 ho."),
    ], {"a": 18, "b": 30, "task": {"hcf": 12}}, wait=True),
]

# ─────────────────────────── Story 4: Trains and boxes ───────────────────────────
SCENES_4 = [
    scene([
        L("Narrator", "On Saturday, Papa takes the twins to his office near the railway yard.",
          "Shanivaar ko Papa dono bachchon ko railway yard ke paas apne office le jaate hain."),
        L("Deepak", "Suppose one shuttle leaves this yard every 18 minutes and another every 24 minutes. Both leave together at 8 in the morning. When do they leave together again?",
          "Maan lo ek shuttle is yard se har 18 minute mein nikalti hai aur doosri har 24 minute mein. Dono subah 8 baje saath nikalti hain. Phir saath kab niklengi?"),
    ], {"mode": "lcm", "a": 18, "b": 24, "names": ["Shuttle A", "Shuttle B", "Shuttle C"]}),
    scene([
        L("Disha", "We need a time that is a multiple of both 18 and 24. The first such time is their L C M.",
          "Hamein aisa time chahiye jo 18 aur 24 dono ka multiple ho. Pehla aisa time unka L C M hai."),
        L("Harsh", "18 is 2 times 3 squared, and 24 is 2 cubed times 3. So the L C M is 2 cubed times 3 squared, which is 72. They leave together at 12 minutes past 9!",
          "18 barabar 2 guna 3 ka square, aur 24 barabar 2 ka cube guna 3. Toh L C M 2 ka cube guna 3 ka square, yaani 72. Woh 9 baj kar 12 minute par milengi!"),
    ], {"mode": "lcm", "a": 18, "b": 24, "names": ["Shuttle A", "Shuttle B", "Shuttle C"]}),
    scene([
        L("Deepak", "A third shuttle runs every 30 minutes. Now the L C M of 18, 24 and 30 is 360 minutes, which is 6 hours.",
          "Teesri shuttle har 30 minute mein chalti hai. Ab 18, 24 aur 30 ka L C M 360 minute hai, yaani 6 ghante."),
    ], {"mode": "lcm", "a": 18, "b": 24, "c": 30, "names": ["Shuttle A", "Shuttle B", "Shuttle C"]}),
    scene([
        L("Neha", "Back at the shop, I have 144 laddoos and 180 barfis. Every box must hold the same number of sweets, and only one kind per box.",
          "Shop par wapas, mere paas 144 laddoo aur 180 barfi hain. Har dabbe mein ek jitni mithaai honi chahiye, aur ek dabbe mein ek hi kism."),
        L("Harsh", "Boxes of 12 work. 12 boxes of laddoos and 15 of barfis.",
          "12 ke dabbe chalte hain. Laddoo ke 12 dabbe aur barfi ke 15."),
    ], {"mode": "hcf", "x": 144, "y": 180, "d": 12}),
    scene([
        L("Neha", "But I want the fewest boxes, so each box should be as big as possible.",
          "Lekin mujhe sabse kam dabbe chahiye, toh har dabba jitna ho sake utna bada ho."),
        L("Disha", "Then we need the biggest number that divides both, the H C F. 144 is 2 to the power 4 times 3 squared, 180 is 2 squared times 3 squared times 5. The H C F is 2 squared times 3 squared, which is 36.",
          "Toh hamein woh sabse bada number chahiye jo dono ko divide kare, yaani H C F. 144 barabar 2 ki power 4 guna 3 ka square, 180 barabar 2 ka square guna 3 ka square guna 5. H C F hai 2 ka square guna 3 ka square, yaani 36."),
    ], {"mode": "hcf", "x": 144, "y": 180, "d": 36}),
    scene([
        L("Dadi", "So 4 boxes of laddoos and 5 boxes of barfis, just 9 boxes in all. Remember: meeting again means L C M, the biggest equal share means H C F.",
          "Toh laddoo ke 4 dabbe aur barfi ke 5 dabbe, kul sirf 9 dabbe. Yaad rakho: phir se milna matlab L C M, sabse bada barabar hissa matlab H C F."),
    ], {"mode": "hcf", "x": 144, "y": 180, "d": 36}),
    scene([
        L("Harsh", "On the cricket ground, I take 12 minutes for a round and Disha takes 18. Starting together, we meet at the start again after 36 minutes, the L C M.",
          "Cricket ground par, mujhe ek chakkar mein 12 minute lagte hain aur Disha ko 18. Saath shuru karein, toh 36 minute baad, yaani L C M par, start par phir milenge."),
    ], {"mode": "lcm", "a": 12, "b": 18, "names": ["Harsh", "Disha", "Third"]}),
    scene([
        L("Deepak", "Your turn! Set two different intervals that first meet at exactly 60 minutes.",
          "Ab aapki baari! Do alag intervals set karo jo pehli baar theek 60 minute par milein."),
    ], {"mode": "lcm", "a": 8, "b": 10, "task": {"lcm": 60}}, wait=True),
]

# ─────────────────────────── Story 5: Root 2 is irrational ───────────────────────────
SCENES_5 = [
    scene([
        L("Narrator", "A week later, Neha is cutting a square cake of side 1 foot along its diagonal.",
          "Ek hafte baad, Neha 1 foot side wala chaukor cake uske diagonal par kaat rahi hai."),
        L("Disha", "By Pythagoras, the diagonal squared is 1 plus 1, which is 2. So the diagonal is root 2 feet long.",
          "Pythagoras se, diagonal ka square 1 plus 1, yaani 2. Toh diagonal root 2 foot lamba hai."),
    ], {"mode": "diagonal", "swing": False}),
    scene([
        L("Dadi", "Swing the diagonal down onto the number line. Root 2 is a real point, between 1.4 and 1.5.",
          "Diagonal ko ghuma kar number line par le aao. Root 2 ek asli point hai, 1.4 aur 1.5 ke beech."),
        L("Harsh", "Then it must be some fraction. I just have to find the right one!",
          "Toh yeh koi fraction hoga. Mujhe bas sahi wala dhoondhna hai!"),
    ], {"mode": "diagonal", "swing": True}),
    scene([
        L("Dadi", "Try. If root 2 is p over q, then p squared must equal 2 times q squared.",
          "Try karo. Agar root 2 barabar p bata q hai, toh p ka square, 2 guna q ke square ke barabar hona chahiye."),
        L("Harsh", "q is 5, p is 7. 49 and 50. So close! q is 12, p is 17. 289 and 288. Off by one again!",
          "q 5, p 7. 49 aur 50. Kitna paas! q 12, p 17. 289 aur 288. Phir ek se chook gaye!"),
    ], {"mode": "hunt", "q": 12}),
    scene([
        L("Dadi", "You will never hit it exactly. Count the 2s. A perfect square has every prime in pairs, so p squared has an even number of 2s.",
          "Aap kabhi theek nahi pahunchoge. 2 gino. Perfect square mein har prime jodi mein hota hai, toh p ke square mein 2 ki ginti even hoti hai."),
        L("Disha", "And 2 times q squared has one extra 2, so it always has an odd number of 2s. By uniqueness, the two sides can never be equal!",
          "Aur 2 guna q ke square mein ek extra 2 hai, toh usme hamesha odd 2 hote hain. Uniqueness se, dono taraf kabhi barabar nahi ho sakte!"),
    ], {"mode": "parity", "p": 12, "q": 6}),
    scene([
        L("Dadi", "Now the board-exam proof. First a theorem: if a prime p divides a squared, then p divides a. The primes of a squared are just the primes of a, each taken twice.",
          "Ab board exam wala proof. Pehle ek theorem: agar ek prime p, a ke square ko divide kare, toh p, a ko bhi divide karta hai. a ke square ke primes, bas a ke hi primes hain, har ek do baar."),
    ], {"mode": "proof", "k": 2, "step": 0}),
    scene([
        L("Dadi", "Suppose root 2 is rational, equal to a over b, where a and b are co-prime. Squaring, 2 b squared equals a squared.",
          "Maan lo root 2 rational hai, a bata b ke barabar, jahan a aur b co-prime hain. Square karne par, 2 guna b ka square barabar a ka square."),
        L("Disha", "So 2 divides a squared, and by the theorem, 2 divides a.",
          "Toh 2, a ke square ko divide karta hai, aur theorem se 2, a ko divide karta hai."),
    ], {"mode": "proof", "k": 2, "step": 3}),
    scene([
        L("Dadi", "Write a as 2 c. Then 2 b squared equals 4 c squared, so b squared equals 2 c squared. Now 2 divides b too.",
          "a ko 2 c likho. Toh 2 guna b ka square barabar 4 guna c ka square, yaani b ka square barabar 2 guna c ka square. Ab 2, b ko bhi divide karta hai."),
        L("Harsh", "But a and b were co-prime! 2 cannot divide both. That is a contradiction!",
          "Lekin a aur b co-prime the! 2 dono ko divide nahi kar sakta. Yeh contradiction hai!"),
    ], {"mode": "proof", "k": 2, "step": 6}),
    scene([
        L("Dadi", "So our assumption was wrong, and root 2 is irrational. The same proof, with 3 in place of 2, shows that root 3 is irrational.",
          "Toh hamari assumption galat thi, aur root 2 irrational hai. Yahi proof, 2 ki jagah 3 lekar, dikhaata hai ki root 3 irrational hai."),
    ], {"mode": "proof", "k": 3, "step": 7}),
    scene([
        L("Dadi", "Your turn! Hunt for another near miss. Find a bottom number bigger than 2 where p squared and 2 times q squared differ by just 1.",
          "Ab aapki baari! Ek aur near miss dhoondho. 2 se bada aisa bottom number dhoondho jahan p ka square aur 2 guna q ka square sirf 1 se alag hon."),
    ], {"mode": "hunt", "q": 3, "task": {"near": True}}, wait=True),
]

# ─────────────────────────── Story 6: Related results ───────────────────────────
SCENES_6 = [
    scene([
        L("Narrator", "On Diwali night, between the diyas and the sweets, the twins test each other.",
          "Diwali ki raat, diyon aur mithaaiyon ke beech, dono ek doosre ka test le rahe hain."),
        L("Harsh", "Easy one, Disha. Is 5 minus root 3 rational? 5 is rational, so maybe the answer is rational?",
          "Aasaan sawaal, Disha. Kya 5 minus root 3 rational hai? 5 rational hai, toh shayad answer rational ho?"),
    ], {"mode": "proof", "expr": "5-r3", "step": 0}),
    scene([
        L("Disha", "Suppose 5 minus root 3 equals a over b. Then root 3 equals 5 minus a over b, which is a rational number.",
          "Maan lo 5 minus root 3 barabar a bata b. Toh root 3 barabar 5 minus a bata b, jo ek rational number hai."),
        L("Dadi", "But root 3 is irrational. Contradiction! So 5 minus root 3 is irrational.",
          "Lekin root 3 irrational hai. Contradiction! Toh 5 minus root 3 irrational hai."),
    ], {"mode": "proof", "expr": "5-r3", "step": 6}),
    scene([
        L("Deepak", "Same trick for 3 root 2. If it were a over b, then root 2 would be a over 3 b, a rational number. Impossible.",
          "3 root 2 ke liye bhi yahi trick. Agar woh a bata b hota, toh root 2 barabar a bata 3 b hota, ek rational number. Namumkin."),
    ], {"mode": "proof", "expr": "3r2", "step": 6}),
    scene([
        L("Disha", "And 1 over root 2? If it were a over b, flip it, and root 2 would be b over a. Also impossible.",
          "Aur 1 bata root 2? Agar woh a bata b hota, toh ulta karo, aur root 2 barabar b bata a hota. Yeh bhi namumkin."),
    ], {"mode": "proof", "expr": "inv-r2", "step": 6}),
    scene([
        L("Dadi", "The rules: a rational plus an irrational is irrational. A non-zero rational times an irrational is irrational.",
          "Rules: rational plus irrational, irrational hota hai. Non-zero rational guna irrational, irrational hota hai."),
        L("Harsh", "And two irrationals together give an irrational?", "Aur do irrationals milkar irrational dete hain?"),
    ], {"mode": "sort", "reveal": False}),
    scene([
        L("Dadi", "Not always! Root 2 times root 2 is 2. Root 3 plus 1, minus root 3, is 1. And root 12 divided by root 3 is root 4, which is 2.",
          "Hamesha nahi! Root 2 guna root 2 barabar 2. Root 3 plus 1, minus root 3, barabar 1. Aur root 12 bhaag root 3 barabar root 4, yaani 2."),
        L("Disha", "And root 9 is just 3. Not every number with a root sign is irrational!",
          "Aur root 9 toh bas 3 hai. Root sign wala har number irrational nahi hota!"),
    ], {"mode": "sort", "reveal": True}),
    scene([
        L("Dadi", "Rational and irrational numbers together make the real numbers. Every point on the number line is a real number.",
          "Rational aur irrational numbers milkar real numbers banaate hain. Number line ka har point ek real number hai."),
    ], {"mode": "sort", "reveal": True}),
    scene([
        L("Dadi", "Your turn! Sort all 10 cards into rational and irrational.",
          "Ab aapki baari! Saare 10 cards ko rational aur irrational mein baanto."),
    ], {"mode": "sort", "answers": {}, "task": {"all": True}}, wait=True),
]

# ─────────────────────────── Part 7 scenes ───────────────────────────
SCENES_7 = [
    scene([
        L("Narrator", "A month before the pre-boards, Dadi sets a practice paper on Real Numbers.",
          "Pre-boards se ek mahina pehle, Dadi Real Numbers par ek practice paper deti hain."),
        L("Dadi", "Question 1. Find the H C F and L C M of 6, 72 and 120 by prime factorisation.",
          "Sawaal 1. Prime factorisation se 6, 72 aur 120 ka H C F aur L C M nikaalo."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "6 is 2 times 3, 72 is 2 cubed times 3 squared, 120 is 2 cubed times 3 times 5. Smallest powers of the common primes give 6. Greatest powers of all primes give 2 cubed times 3 squared times 5, which is 360.",
          "6 barabar 2 guna 3, 72 barabar 2 ka cube guna 3 ka square, 120 barabar 2 ka cube guna 3 guna 5. Common primes ki sabse chhoti powers se 6 milta hai. Sab primes ki sabse badi powers se 2 ka cube guna 3 ka square guna 5, yaani 360."),
    ], {"example": 0, "step": 4}),
    scene([
        L("Dadi", "Question 2. Given that the H C F of 306 and 657 is 9, find their L C M.",
          "Sawaal 2. 306 aur 657 ka H C F 9 diya hai, unka L C M nikaalo."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "H C F times L C M equals the product. So the L C M is 306 times 657, divided by 9. That is 34 times 657, which is 22,338!",
          "H C F guna L C M barabar product. Toh L C M hai 306 guna 657, bhaag 9. Yaani 34 guna 657, jo 22,338 hai!"),
        L("Dadi", "Shabash. Dividing first keeps the numbers small.", "Shabash. Pehle divide karne se numbers chhote rehte hain."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]

PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Mummy's Laddoo Order · The Fundamental Theorem of Arithmetic",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Mummy needs to pack 140 laddoos. Dadi breaks 140 into primes with a factor tree, Disha discovers that two different trees for 60 end in the same primes, and Harsh learns that a big odd number can still be composite.</div>

<h2>Primes are the building blocks</h2>
<p>A <strong>prime</strong> has exactly two factors, 1 and itself (2, 3, 5, 7, 11, 13, …). A <strong>composite</strong> number has more than two factors. Keep dividing by primes (a factor tree) until every branch ends in a prime.</p>
<div {CARD}>
  <div>140 = 2 × 70 = 2 × 2 × 35 = 2 × 2 × 5 × 7 = <strong>2² × 5 × 7</strong></div>
  <div>156 = 2² × 3 × 13</div>
  <div>3825 = 3² × 5² × 17</div>
  <div>32760 = 2³ × 3² × 5 × 7 × 13</div>
</div>

<h2>The Fundamental Theorem of Arithmetic</h2>
<div {FORMULA}>Every composite number can be expressed as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur.</div>
<p>Two different factor trees for 60 (2 × 30 and 6 × 10) both end in 2, 2, 3, 5. We usually write the primes in ascending order: n = p₁ × p₂ × … × pₙ with p₁ ≤ p₂ ≤ … ≤ pₙ.</p>
<p><strong>History:</strong> the result goes back to Euclid's <em>Elements</em>; Carl Friedrich Gauss gave the first complete proof in his <em>Disquisitiones Arithmeticae</em> (1801).</p>

<h2>Spotting composite numbers</h2>
<div {CARD}>
  <div>7 × 11 × 13 + 13 = 13 × (7 × 11 + 1) = 13 × 78 → composite (it has the factor 13).</div>
  <div>7 × 6 × 5 × 4 × 3 × 2 × 1 + 5 = 5 × (7 × 6 × 4 × 3 × 2 × 1 + 1) = 5 × 1009 → composite.</div>
</div>
""",
        "keyInsight": "Every composite number is a product of primes in exactly one way (apart from order): primes are the atoms of arithmetic.",
        "widgetType": "Class10RealNumFactorTreeWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "The prime factorisation of 3825 is:",
            "options": ["3 × 5² × 51", "3² × 5² × 17", "3² × 5 × 85", "5² × 153"],
            "correctIndex": 1,
            "explanation": "3825 = 3 × 1275 = 3 × 3 × 425 = 3² × 5 × 85 = 3² × 5 × 5 × 17 = 3² × 5² × 17. The other options contain composite factors (51, 85, 153).",
        },
        "teacherNotes": teacher(
            [
                "Start with a factor tree on the board, then ask a student to start the same number differently: the leaves always match.",
                "Use the 'atoms and molecules' picture: primes are atoms, every number is a unique molecule.",
                "Insist on writing the final answer with powers in ascending order of primes.",
            ],
            [
                "Stopping at a composite factor (writing 3825 = 3² × 5 × 85).",
                "Calling 1 a prime. It is neither prime nor composite.",
                "Assuming every large odd number is prime (13 × 78 is odd-looking but composite).",
            ],
            "Factor race: each group gets a 4-digit number; they factorise it two different ways and check the leaves match.",
            "NCERT Class 10 Ch. 1, Section 1.2 (Theorem 1.1, Example 1-3, Exercise 1.1 Q1, Q6).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Harsh's Calculator · Which Numbers End in Zero?",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Harsh keeps multiplying by 4, hoping a power of 4 will end in zero. Dadi uses the uniqueness of prime factorisation to show he is wasting his battery.</div>

<h2>Using uniqueness</h2>
<p>A number ends in the digit 0 exactly when it is divisible by 10 = 2 × 5, so its prime factorisation must contain <strong>both a 2 and a 5</strong>.</p>
<div {CARD}>
  <div><strong>Can 4ⁿ end in 0?</strong> 4ⁿ = (2²)ⁿ = 2²ⁿ. The only prime is 2. By the uniqueness in the Fundamental Theorem of Arithmetic there is no other prime in its factorisation, so 5 does not divide 4ⁿ. Hence 4ⁿ never ends in 0.</div>
  <div><strong>Can 6ⁿ end in 0?</strong> 6ⁿ = 2ⁿ × 3ⁿ. No 5, so never.</div>
  <div><strong>10³ = 1000</strong> = 2³ × 5³: three (2, 5) pairs give three zeros.</div>
</div>
<div {FORMULA}>n ends in 0 ⇔ 2 and 5 both appear in the prime factorisation of n</div>
<p>The primes of bⁿ are exactly the primes of b (each repeated n times). Raising to a power never adds a new prime.</p>
""",
        "keyInsight": "A number ends in zero only if its primes include both 2 and 5, and powers never add new primes.",
        "widgetType": "Class10RealNumPowerZeroWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "For which natural number n does 6ⁿ end with the digit 0?",
            "options": ["n = 5", "n = 10", "Every even n", "No natural number n"],
            "correctIndex": 3,
            "explanation": "6ⁿ = 2ⁿ × 3ⁿ has no prime factor 5, so it is never divisible by 10 and never ends in 0.",
        },
        "teacherNotes": teacher(
            [
                "List 4, 16, 64, 256, 1024 and let students guess before the proof.",
                "Stress that the argument rests on the UNIQUENESS part of the theorem.",
            ],
            [
                "Arguing from a few examples ('it did not happen for n = 1 to 5') instead of from primes.",
                "Thinking that an even number always ends in 0.",
            ],
            "Ask pairs to find all bases from 2 to 20 whose powers can end in 0 (multiples of 10 only) and explain why.",
            "NCERT Class 10 Ch. 1, Section 1.2 (Example 1; Exercise 1.1 Q5).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Dining-Table Study · HCF and LCM by Prime Factorisation",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Dadi draws two overlapping circles: one for each number's primes. The shared primes in the middle make the HCF; everything in the picture makes the LCM.</div>

<h2>The method</h2>
<div {FORMULA}>HCF = product of the smallest power of each common prime factor</div>
<div {FORMULA}>LCM = product of the greatest power of each prime factor involved</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Numbers</th><th class="text-left">Factorisations</th><th>HCF</th><th>LCM</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>6, 20</td><td>2 × 3; 2² × 5</td><td class="text-center">2</td><td class="text-center">60</td></tr>
    <tr><td>96, 404</td><td>2⁵ × 3; 2² × 101</td><td class="text-center">4</td><td class="text-center">9696</td></tr>
    <tr><td>6, 72, 120</td><td>2 × 3; 2³ × 3²; 2³ × 3 × 5</td><td class="text-center">6</td><td class="text-center">360</td></tr>
  </tbody>
</table>

<h2>HCF × LCM for two numbers</h2>
<div {FORMULA}>HCF(a, b) × LCM(a, b) = a × b</div>
<div {CARD}>
  <div>Check: 4 × 9696 = 38784 = 96 × 404. ✔</div>
  <div>Why: the HCF uses the shared primes once and the LCM uses all the primes once, so together they use every prime factor of a and of b exactly once.</div>
  <div><strong>Only for two numbers.</strong> For 6, 72, 120: HCF × LCM = 6 × 360 = 2160, but 6 × 72 × 120 = 51840.</div>
</div>
""",
        "keyInsight": "HCF takes the common primes at their lowest powers, LCM takes all primes at their highest powers, and for two numbers HCF × LCM = product.",
        "widgetType": "Class10RealNumHcfLcmWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "The HCF of two numbers is 9 and their product is 1620. Their LCM is:",
            "options": ["90", "180", "162", "14580"],
            "correctIndex": 1,
            "explanation": "LCM = product ÷ HCF = 1620 ÷ 9 = 180.",
        },
        "teacherNotes": teacher(
            [
                "Draw the Venn diagram of primes; it explains both rules and the product formula in one picture.",
                "Write each factorisation in index form before choosing powers.",
            ],
            [
                "Taking the greatest power for HCF or the smallest for LCM.",
                "Using HCF × LCM = product for three numbers.",
                "Leaving out a prime that appears in only one number when finding the LCM.",
            ],
            "Give pairs of cards with numbers; students build the Venn diagram with coloured counters and read off HCF and LCM.",
            "NCERT Class 10 Ch. 1, Section 1.2 (Examples 2-4; Exercise 1.1 Q2, Q3, Q4).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: The Railway Yard and the Sweet Shop · Using HCF and LCM",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Papa's shuttles leave at different intervals: when do they leave together again? Mummy wants the fewest equal boxes of sweets. Harsh and Disha jog round the cricket ground.</div>

<h2>When to use LCM</h2>
<p>Things that repeat at different intervals and must <strong>happen together again</strong> → LCM.</p>
<div {CARD}>
  <div>Shuttles every 18 and 24 minutes, together at 8:00 a.m. 18 = 2 × 3², 24 = 2³ × 3, LCM = 2³ × 3² = 72 minutes → together again at 9:12 a.m.</div>
  <div>Add a third every 30 minutes: LCM(18, 24, 30) = 2³ × 3² × 5 = 360 minutes = 6 hours.</div>
  <div>Harsh 12 min per round, Disha 18 min: they meet at the start after LCM(12, 18) = 36 minutes.</div>
</div>

<h2>When to use HCF</h2>
<p><strong>Largest equal share / biggest size that divides exactly</strong> → HCF.</p>
<div {CARD}>
  <div>144 laddoos and 180 barfis, one kind per box, equal number in each box, fewest boxes.</div>
  <div>144 = 2⁴ × 3², 180 = 2² × 3² × 5, HCF = 2² × 3² = 36.</div>
  <div>Boxes: 144 ÷ 36 = 4 and 180 ÷ 36 = 5, so 9 boxes of 36 sweets.</div>
</div>
<div {FORMULA}>"Meet again / together again" → LCM &nbsp;&nbsp; "Largest / maximum equal" → HCF</div>
""",
        "keyInsight": "Repeating events meet again at the LCM; the largest equal share is the HCF.",
        "widgetType": "Class10RealNumMeetWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Two bells ring every 15 minutes and 20 minutes. They ring together at 10:00 a.m. When do they next ring together?",
            "options": ["10:35 a.m.", "11:00 a.m.", "10:05 a.m.", "1:00 p.m."],
            "correctIndex": 1,
            "explanation": "LCM(15, 20) = 2² × 3 × 5 = 60 minutes, so at 11:00 a.m.",
        },
        "teacherNotes": teacher(
            [
                "Have students underline the key phrase in each word problem before deciding HCF or LCM.",
                "Use a timeline on the board with ticks for each interval.",
            ],
            [
                "Using HCF for 'meet again' problems.",
                "Forgetting to convert the LCM in minutes back into a clock time.",
                "Answering the HCF when the question asks for the number of boxes.",
            ],
            "Clap game: three groups clap every 2, 3 and 4 beats; the class predicts the beat on which all clap together (12).",
            "NCERT Class 10 Ch. 1, Exercise 1.1 Q7 (Sonia and Ravi jogging) and textbook-style applications.",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: The Square Cake · Root 2 Is Irrational",
        "readingTime": "~8 min story",
        "narrative": f"""
<div {STORY}>Mummy cuts a square cake of side 1 foot along its diagonal. Harsh hunts for a fraction equal to the diagonal and keeps missing by 1. Dadi shows why he always will.</div>

<h2>Irrational numbers</h2>
<p>A number s is <strong>irrational</strong> if it cannot be written as p/q with p, q integers and q ≠ 0. The diagonal of a unit square is √2 (1² + 1² = 2), and √2 = 1.41421356… never ends and never repeats.</p>
<div {CARD}>
  <div>Near misses: 3/2 (9 vs 8), 7/5 (49 vs 50), 17/12 (289 vs 288), 41/29 (1681 vs 1682). p² − 2q² is ±1, never 0.</div>
  <div>Why never 0: in p² every prime appears an even number of times, so p² has an even number of 2s; 2q² has an odd number of 2s. By uniqueness of prime factorisation, p² ≠ 2q².</div>
</div>

<h2>Theorem 1.2</h2>
<div {FORMULA}>If a prime p divides a², then p divides a (a a positive integer).</div>
<p>Proof idea: if a = p₁p₂…pₙ, then a² = (p₁p₂…pₙ)(p₁p₂…pₙ). The only primes of a² are p₁, …, pₙ, so p is one of them and divides a.</p>

<h2>Theorem: √2 is irrational (proof by contradiction)</h2>
<ol>
  <li>Suppose √2 = a/b with a, b co-prime integers, b ≠ 0.</li>
  <li>Then √2 b = a, so 2b² = a².</li>
  <li>2 divides a², so 2 divides a (Theorem 1.2). Write a = 2c.</li>
  <li>2b² = 4c² ⇒ b² = 2c², so 2 divides b², hence 2 divides b.</li>
  <li>2 divides both a and b, contradicting that they are co-prime.</li>
  <li>So √2 is irrational.</li>
</ol>
<p>The same proof with 3 (or 5, or any prime) shows √3, √5 are irrational.</p>
""",
        "keyInsight": "Assume √2 = a/b in lowest terms, and the prime 2 ends up dividing both a and b: a contradiction, so √2 is irrational.",
        "widgetType": "Class10RealNumRootTwoWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "In the proof that √3 is irrational, we assume √3 = a/b where a and b are co-prime. The contradiction is that:",
            "options": ["a is negative", "3 divides both a and b", "b = 0", "a² = b²"],
            "correctIndex": 1,
            "explanation": "From 3b² = a² we get 3 | a; writing a = 3c gives b² = 3c², so 3 | b. Then 3 divides both, contradicting co-primeness.",
        },
        "teacherNotes": teacher(
            [
                "Let students hunt for a fraction first (calculators allowed). The failed hunt motivates the proof.",
                "Spell out the structure of proof by contradiction: assume, deduce, reach something impossible, conclude.",
                "Emphasise WHY we may assume a and b co-prime (cancel common factors first).",
            ],
            [
                "Not stating that a and b are co-prime at the start, so there is no contradiction at the end.",
                "Using 'a² is even so a is even' without citing Theorem 1.2.",
                "Claiming √4 or √9 is irrational by applying the same proof (4 and 9 are not primes and are perfect squares).",
            ],
            "Proof jigsaw: give the six lines of the √3 proof on strips, jumbled; groups put them in order and justify each step.",
            "NCERT Class 10 Ch. 1, Section 1.3 (Theorem 1.2, Theorem 1.3, Example 5; Exercise 1.2 Q1).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Diwali Night · Related Irrational Results",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Between the diyas, Harsh and Disha test each other on numbers like 5 − √3, 3√2 and 1/√2, then sort a deck of cards into rational and irrational.</div>

<h2>Proving related numbers irrational</h2>
<div {CARD}>
  <div><strong>5 − √3:</strong> Suppose 5 − √3 = a/b. Then √3 = 5 − a/b = (5b − a)/b, which is rational. Contradiction, since √3 is irrational.</div>
  <div><strong>3√2:</strong> Suppose 3√2 = a/b. Then √2 = a/(3b), rational. Contradiction.</div>
  <div><strong>1/√2:</strong> Suppose 1/√2 = a/b. Then √2 = b/a, rational. Contradiction.</div>
</div>
<div {FORMULA}>rational + irrational = irrational &nbsp;·&nbsp; (non-zero rational) × irrational = irrational</div>
<p>But two irrationals can give a rational: √2 × √2 = 2, (√3 + 1) − √3 = 1, √12 ÷ √3 = √4 = 2. And not every root is irrational: √9 = 3.</p>

<h2>Real numbers</h2>
<p>Rational numbers (terminating or repeating decimals, such as 0.375 = 3/8) together with irrational numbers (non-terminating, non-repeating decimals, such as √2, √3, π) form the <strong>real numbers</strong>. Every point on the number line is a real number.</p>
""",
        "keyInsight": "To show a number built from √3 is irrational, assume it is rational and rearrange until √3 itself would be rational.",
        "widgetType": "Class10RealNumClassifyWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Which of these is rational?",
            "options": ["2 + √5", "3√2", "√12 ÷ √3", "1/√2"],
            "correctIndex": 2,
            "explanation": "√12 ÷ √3 = √(12 ÷ 3) = √4 = 2, which is rational. The others are irrational.",
        },
        "teacherNotes": teacher(
            [
                "Show the general pattern: isolate the root, everything else is rational.",
                "Give counter-examples for 'irrational + irrational is irrational'.",
            ],
            [
                "Writing 'irrational because it has a root' without proof.",
                "Forgetting b ≠ 0 (and a ≠ 0 in the 1/√2 case).",
            ],
            "Card sort: groups sort 15 numbers into rational/irrational and must justify each placement in one line.",
            "NCERT Class 10 Ch. 1, Section 1.3 (Examples 6-7; Exercise 1.2 Q2, Q3).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 board-style problems, step by step",
        "readingTime": "~12 min",
        "narrative": f"""
<div {STORY}>A month before the pre-boards, Dadi sets a practice paper. Harsh answers fast; Disha writes every step the way an examiner wants.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Prime factorisation in index form, primes in ascending order.</li>
  <li>HCF: smallest powers of common primes. LCM: greatest powers of all primes.</li>
  <li>For two numbers: HCF × LCM = product.</li>
  <li>Ends in 0 ⇔ factors 2 and 5 both present.</li>
  <li>Irrationality: assume a/b with a, b co-prime and reach a contradiction.</li>
</ol>
<p>Use the question buttons. Try each in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Write factorisations in index form first; every HCF, LCM and divisibility question then becomes reading powers.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "HCF and LCM of three numbers (Short answer)",
                    "question": "Find the HCF and LCM of 6, 72 and 120 using prime factorisation.",
                    "steps": [
                        "6 = 2 × 3",
                        "72 = 2³ × 3², 120 = 2³ × 3 × 5",
                        "HCF = 2¹ × 3¹ = <strong>6</strong> (smallest powers of common primes)",
                        "LCM = 2³ × 3² × 5 = <strong>360</strong> (greatest powers of all primes)",
                    ],
                    "answer": "HCF = 6, LCM = 360",
                },
                {
                    "title": "Using HCF × LCM (MCQ-style)",
                    "question": "Given that HCF(306, 657) = 9, find LCM(306, 657).",
                    "steps": [
                        "For two numbers, HCF × LCM = product",
                        "LCM = (306 × 657) ÷ 9 = 34 × 657",
                        "= <strong>22338</strong>",
                    ],
                    "answer": "22338",
                },
                {
                    "title": "Ending in zero (Short answer)",
                    "question": "Check whether 6ⁿ can end with the digit 0 for any natural number n.",
                    "steps": [
                        "If 6ⁿ ended in 0, it would be divisible by 10 = 2 × 5, so 5 would be a prime factor of 6ⁿ.",
                        "But 6ⁿ = (2 × 3)ⁿ = 2ⁿ × 3ⁿ: its only primes are 2 and 3.",
                        "By the uniqueness of prime factorisation (FTA), 5 is not a factor.",
                        "So <strong>no</strong> natural number n makes 6ⁿ end in 0.",
                    ],
                    "answer": "No",
                },
                {
                    "title": "Composite or not? (Short answer)",
                    "question": "Explain why 7 × 11 × 13 + 13 is a composite number.",
                    "steps": [
                        "7 × 11 × 13 + 13 = 13 × (7 × 11 + 1)",
                        "= 13 × 78 = 13 × 2 × 3 × 13",
                        "It has factors other than 1 and itself (for example 13), so it is <strong>composite</strong>.",
                    ],
                    "answer": "Composite (= 13 × 78 = 1014)",
                },
                {
                    "title": "Prime factorisation (Very short answer)",
                    "question": "Express 3825 as a product of its prime factors.",
                    "steps": [
                        "3825 ÷ 3 = 1275, 1275 ÷ 3 = 425",
                        "425 ÷ 5 = 85, 85 ÷ 5 = 17 (prime)",
                        "3825 = <strong>3² × 5² × 17</strong>",
                    ],
                    "answer": "3² × 5² × 17",
                },
                {
                    "title": "Meeting again (Case-based)",
                    "question": "Case study: At a railway yard, shuttle A leaves every 18 minutes and shuttle B every 24 minutes. Both leave together at 8:00 a.m. (i) After how many minutes do they next leave together? (ii) At what time? (iii) How many times does shuttle A leave in that interval, counting the 8:00 departure but not the next joint one?",
                    "steps": [
                        "18 = 2 × 3², 24 = 2³ × 3",
                        "(i) LCM = 2³ × 3² = <strong>72 minutes</strong>",
                        "(ii) 8:00 a.m. + 72 min = <strong>9:12 a.m.</strong>",
                        "(iii) 72 ÷ 18 = <strong>4</strong> departures (8:00, 8:18, 8:36, 8:54)",
                    ],
                    "answer": "72 minutes; 9:12 a.m.; 4",
                },
                {
                    "title": "Largest equal boxes (Short answer)",
                    "question": "A shop has 144 laddoos and 180 barfis. They are packed in boxes holding the same number of sweets, one kind per box. Find the maximum number of sweets per box and the number of boxes.",
                    "steps": [
                        "144 = 2⁴ × 3², 180 = 2² × 3² × 5",
                        "HCF = 2² × 3² = <strong>36</strong> sweets per box",
                        "Boxes = 144 ÷ 36 + 180 ÷ 36 = 4 + 5 = <strong>9</strong>",
                    ],
                    "answer": "36 per box, 9 boxes",
                },
                {
                    "title": "√5 is irrational (Long answer)",
                    "question": "Prove that √5 is irrational.",
                    "steps": [
                        "Assume √5 is rational: √5 = a/b, where a, b are co-prime integers, b ≠ 0.",
                        "Then 5b² = a², so 5 divides a². Since 5 is prime, 5 divides a (Theorem 1.2).",
                        "Write a = 5c: 5b² = 25c², so b² = 5c². So 5 divides b², hence 5 divides b.",
                        "So 5 is a common factor of a and b, contradicting that a and b are co-prime.",
                        "Hence the assumption is wrong and <strong>√5 is irrational</strong>.",
                    ],
                    "answer": "√5 is irrational",
                },
                {
                    "title": "3 + 2√5 is irrational (Long answer)",
                    "question": "Given that √5 is irrational, prove that 3 + 2√5 is irrational.",
                    "steps": [
                        "Assume 3 + 2√5 = a/b, a and b integers, b ≠ 0.",
                        "Then 2√5 = a/b − 3, so √5 = (a − 3b)/(2b).",
                        "a − 3b and 2b are integers with 2b ≠ 0, so (a − 3b)/(2b) is rational.",
                        "So √5 would be rational: a contradiction.",
                        "Hence <strong>3 + 2√5 is irrational</strong>.",
                    ],
                    "answer": "3 + 2√5 is irrational",
                },
                {
                    "title": "Assertion–Reason",
                    "question": "Assertion (A): HCF(26, 91) × LCM(26, 91) = 2366.<br>Reason (R): For any two positive integers a and b, HCF(a, b) × LCM(a, b) = a × b.<br>(a) Both true, R explains A (b) Both true, R does not explain A (c) A true, R false (d) A false, R true",
                    "steps": [
                        "26 = 2 × 13, 91 = 7 × 13, so HCF = 13 and LCM = 2 × 7 × 13 = 182",
                        "13 × 182 = 2366 and 26 × 91 = 2366, so A is true.",
                        "R is a true general result, and A is exactly R applied to 26 and 91.",
                        "Answer: <strong>(a)</strong>",
                    ],
                    "answer": "(a)",
                },
            ],
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Model the board layout for proofs: 'Let us assume, to the contrary, that…' and end with 'Hence…'.",
                "For case-based questions, answer every sub-part separately with units.",
            ],
            [
                "Writing the LCM of three numbers as product ÷ HCF.",
                "In irrationality proofs, forgetting b ≠ 0 or the word 'co-prime'.",
            ],
            "Pair-share: one student writes the first two lines of a proof, the partner finishes it; swap for the next question.",
            "Covers NCERT Class 10 Ch. 1 Exercises 1.1 and 1.2 and CBSE sample-paper question types.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Real Numbers (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From Mummy's laddoo order to the Diwali card game, you have factorised, matched primes and proved numbers irrational. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 board-style questions</strong>: prime factorisation, HCF and LCM, HCF × LCM, ending digits, irrational numbers, assertion–reason.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Primes in index form, then read off powers; for irrationals, assume a/b and find the contradiction.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Real Numbers · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "The prime factorisation of 156 is:", "options": ["2 × 78", "2² × 39", "2² × 3 × 13", "2 × 3 × 26"], "answer": 2, "explanation": "156 = 2 × 78 = 2 × 2 × 39 = 2² × 3 × 13. The other options contain composite factors.", "topic": "Fundamental Theorem of Arithmetic"},
                {"q": "If a = 2³ × 3 and b = 2 × 3 × 5, then HCF(a, b) is:", "options": ["2", "6", "30", "120"], "answer": 1, "explanation": "Common primes at smallest powers: 2¹ × 3¹ = 6.", "topic": "HCF by prime factorisation"},
                {"q": "LCM of 12, 15 and 21 is:", "options": ["180", "420", "1260", "3780"], "answer": 1, "explanation": "12 = 2² × 3, 15 = 3 × 5, 21 = 3 × 7. LCM = 2² × 3 × 5 × 7 = 420.", "topic": "LCM by prime factorisation"},
                {"q": "The HCF of two numbers is 12 and their LCM is 180. If one number is 36, the other is:", "options": ["48", "60", "72", "540"], "answer": 1, "explanation": "Other = (12 × 180) ÷ 36 = 2160 ÷ 36 = 60. Check: HCF(36, 60) = 12, LCM = 180.", "topic": "HCF × LCM = product"},
                {"q": "For which natural number n can 4ⁿ end with the digit 0?", "options": ["n = 5", "n = 10", "Any multiple of 5", "No natural number"], "answer": 3, "explanation": "4ⁿ = 2²ⁿ has no prime factor 5, so it can never be divisible by 10.", "topic": "Uniqueness of factorisation"},
                {"q": "If a prime p divides a², then:", "options": ["p divides a", "p² divides a", "a divides p", "p does not divide a"], "answer": 0, "explanation": "Theorem 1.2: the primes of a² are exactly the primes of a, so p divides a.", "topic": "Theorem 1.2"},
                {"q": "Which of the following is irrational?", "options": ["√16", "(√2)²", "5 − √3", "0.25"], "answer": 2, "explanation": "√16 = 4, (√2)² = 2 and 0.25 = 1/4 are rational. If 5 − √3 were rational, √3 would be rational.", "topic": "Irrational numbers"},
                {"q": "In the proof that √2 is irrational, we first assume √2 = a/b where:", "options": ["a and b are both even", "a and b are co-prime and b ≠ 0", "a = b", "a and b are irrational"], "answer": 1, "explanation": "We take a/b in lowest terms (co-prime) with b ≠ 0; the contradiction is that 2 then divides both.", "topic": "Proof by contradiction"},
                {"q": "Assertion (A): 3√2 is irrational. Reason (R): The product of a non-zero rational number and an irrational number is irrational.", "options": ["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"], "answer": 0, "explanation": "3 is a non-zero rational and √2 is irrational, so 3√2 is irrational: R explains A.", "topic": "Assertion-Reason"},
                {"q": "Assertion (A): HCF(8, 9, 25) × LCM(8, 9, 25) = 8 × 9 × 25. Reason (R): HCF × LCM = product holds for any three positive integers.", "options": ["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"], "answer": 2, "explanation": "8, 9, 25 share no prime, so HCF = 1 and LCM = 1800 = 8 × 9 × 25: A is true. R is false in general (6, 72, 120: 6 × 360 = 2160 but the product is 51840).", "topic": "Assertion-Reason"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q4 catches dividing by the wrong number; Q9 and Q10 test assertion–reason logic; Q10 catches the three-number trap."],
            "Exit ticket: prove that 2 + √3 is irrational in five lines.",
            "Matches NCERT Class 10 Ch. 1 Real Numbers (rationalised) learning outcomes.",
        ),
    },
]


def seed_class10_story_real_numbers():
    db = SessionLocal()
    try:
        topic = get_class10_topic(db, "Real Numbers")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 10 Real Numbers: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Real Numbers: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class10_story_real_numbers()
