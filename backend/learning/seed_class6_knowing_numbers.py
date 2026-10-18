import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Knowing Our Numbers (old NCERT Ch. 1). Story: Papa's newspaper, a video call with a cousin in the USA,
# mountain heights, Diwali shopping estimates, big measurements and Dadi's Roman-numeral wall clock.
# Real data: Census 2011 population, Earth–Moon distance, Everest/K2/Kangchenjunga heights, stadium capacity.


SCENES_1 = [
    scene([
        L("Narrator", "Sunday morning. Papa is reading the newspaper aloud at breakfast.", "Ravivaar ki subah. Papa naashte par akhbaar padh rahe hain."),
        L("Deepak", "According to the 2011 Census, India's population was 1,21,08,54,977. How do we even read such a big number?",
          "2011 ki janganana ke hisaab se Bharat ki aabaadi 1,21,08,54,977 thi. Itna bada number padhte kaise hain?"),
        L("Dadi", "With a place value chart! Every digit sits in a place, and the place tells us how much it is worth.",
          "Place value chart se! Har digit ek jagah par baitha hai, aur woh jagah batati hai ki uski keemat kitni hai."),
    ], {"value": 1210854977, "system": "indian", "highlight": None}),
    scene([
        L("Dadi", "In the Indian system, we read in groups: crore, lakh, thousand, and then the rest. So it is one hundred twenty-one crore, eight lakh, fifty-four thousand, nine hundred seventy-seven.",
          "Bharatiya paddhati mein hum samoohon mein padhte hain: crore, lakh, hazaar, aur phir baaki. Toh yeh hai ek sau ikkees crore, aath lakh, chauvan hazaar, nau sau sattattar."),
        L("Harsh", "That's more than a hundred crore people!", "Matlab sau crore se bhi zyaada log!"),
    ], {"value": 1210854977, "system": "indian"}),
    scene([
        L("Disha", "Dadi, the 2 here and the 2 in 1,32,000 are the same digit. Are they worth the same?", "Dadi, yahan ka 2 aur 1,32,000 ka 2 ek hi digit hai. Kya dono ki keemat barabar hai?"),
        L("Dadi", "The digit itself is its face value, always 2. But its place value depends on where it sits. Tap any digit to see.",
          "Digit khud uski face value hai, hamesha 2. Lekin uski place value is baat par nirbhar hai ki woh kahan baitha hai. Kisi bhi digit ko tap karke dekho."),
    ], {"value": 132000, "system": "indian", "highlight": 3}),
    scene([
        L("Harsh", "In 1,32,000 seats at the cricket stadium, the 2 sits in the thousands place. So it is worth 2,000!", "Cricket stadium ki 1,32,000 seats mein 2 hazaar ki jagah par hai. Toh uski keemat 2,000 hai!"),
    ], {"value": 132000, "system": "indian", "highlight": 3}),
    scene([
        L("Dadi", "We can also break a number into the value of each digit. This is the expanded form. 3,84,400 kilometres, the distance to the Moon, is 3,00,000 plus 80,000 plus 4,000 plus 400.",
          "Hum number ko har digit ki keemat mein tod bhi sakte hain. Ise expanded form kehte hain. Chaand tak ki doori, 3,84,400 kilometre, hai 3,00,000 plus 80,000 plus 4,000 plus 400."),
    ], {"value": 384400, "system": "indian", "expanded": True, "highlight": None}),
    scene([
        L("Dadi", "Your turn. Type the number five lakh six thousand and twenty in digits. Watch the chart fill up!",
          "Ab aapki baari. Paanch lakh chhah hazaar bees ko digits mein likho. Chart ko bharte hue dekho!"),
    ], {"value": 0, "system": "indian", "task": 506020}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "In the evening, cousin Rohan calls from the USA on a video call.", "Shaam ko cousin Rohan USA se video call karta hai."),
        L("Disha", "Rohan says India has about 1.2 billion people. What is a billion?", "Rohan keh raha hai Bharat mein lagbhag 1.2 billion log hain. Billion kya hota hai?"),
        L("Deepak", "Most of the world uses the International system. Instead of lakh and crore, they use thousand, million and billion.",
          "Duniya ke zyaadatar desh International paddhati use karte hain. Lakh aur crore ki jagah woh thousand, million aur billion use karte hain."),
    ], {"value": 1210854977, "system": "international"}),
    scene([
        L("Dadi", "Look at the commas. In the Indian system, after the first three digits, we put commas after every two digits. In the International system, commas come after every three digits.",
          "Commas dekho. Bharatiya paddhati mein pehle teen digits ke baad, har do digits par comma lagaate hain. International paddhati mein har teen digits par comma aata hai."),
    ], {"value": 1210854977, "system": "international"}),
    scene([
        L("Harsh", "So 10 lakh is the same as 1 million, and 10 crore is 100 million!", "Toh 10 lakh barabar 1 million, aur 10 crore barabar 100 million!"),
        L("Dadi", "Exactly. And 100 crore is 1 billion.", "Bilkul. Aur 100 crore barabar 1 billion."),
    ], {"value": 1000000, "system": "international"}),
    scene([
        L("Disha", "Let me switch back to Indian. 10,00,000 is ten lakh!", "Main wapas Indian par switch karti hoon. 10,00,000 matlab das lakh!"),
    ], {"value": 1000000, "system": "indian"}),
]

SCENES_3 = [
    scene([
        L("Narrator", "Harsh is reading a book about the Himalayas.", "Harsh Himalaya ke baare mein ek kitaab padh raha hai."),
        L("Harsh", "K2 is 8,611 metres high, and Kangchenjunga is 8,586 metres. Which one is taller?", "K2, 8,611 metre ooncha hai, aur Kangchenjunga 8,586 metre. Kaun zyaada ooncha hai?"),
        L("Dadi", "Both have 4 digits, so compare from the left, one digit at a time. 8 and 8 are the same. 6 and 5 are different. 6 is bigger, so K2 is taller.",
          "Dono mein 4 digits hain, toh baayein se ek ek digit compare karo. 8 aur 8 barabar. 6 aur 5 alag hain. 6 bada hai, toh K2 zyaada ooncha hai."),
    ], {"mode": "compare", "a": 8611, "b": 8586}),
    scene([
        L("Disha", "And if one number has more digits?", "Aur agar ek number mein zyaada digits hon?"),
        L("Dadi", "Then that number is bigger, straight away. 1,00,000 has 6 digits, 99,999 has only 5.", "Toh woh number seedha bada hai. 1,00,000 mein 6 digits hain, 99,999 mein sirf 5."),
    ], {"mode": "compare", "a": 100000, "b": 99999}),
    scene([
        L("Harsh", "The five tallest mountains on Earth: 8,849, 8,611, 8,586, 8,516 and 8,485 metres. Let me put them in ascending order, smallest first.",
          "Duniya ke paanch sabse oonche pahaad: 8,849, 8,611, 8,586, 8,516 aur 8,485 metre. Main inhe ascending order mein lagaata hoon, sabse chhota pehle."),
    ], {"mode": "order", "order": "asc"}),
    scene([
        L("Dadi", "And descending order means biggest first. Everest leads at 8,849 metres.", "Aur descending order matlab sabse bada pehle. Everest 8,849 metre ke saath sabse aage."),
    ], {"mode": "order", "order": "desc"}),
    scene([
        L("Neha", "Here is a puzzle from my bakery. I have digit cards 7, 0, 4 and 9 for a price tag. What is the largest number I can make?",
          "Meri bakery se ek paheli. Mere paas price tag ke liye 7, 0, 4 aur 9 ke digit cards hain. Sabse bada number kaun sa bana sakti hoon?"),
        L("Disha", "Put the biggest digit first: 9, 7, 4, 0. That's 9,740!", "Sabse bada digit pehle: 9, 7, 4, 0. Yaani 9,740!"),
    ], {"mode": "digits", "digits": [7, 0, 4, 9], "make": "largest"}),
    scene([
        L("Harsh", "For the smallest, 0, 4, 7, 9? That's 0479!", "Sabse chhote ke liye, 0, 4, 7, 9? Yaani 0479!"),
        L("Dadi", "Careful! A number cannot start with 0, or it becomes a 3-digit number. Put the smallest non-zero digit first: 4,079.",
          "Dhyaan se! Number 0 se shuru nahi ho sakta, warna woh 3 digit ka ban jaayega. Sabse chhota non-zero digit pehle rakho: 4,079."),
    ], {"mode": "digits", "digits": [7, 0, 4, 9], "make": "smallest"}),
    scene([
        L("Dadi", "Your turn. With the digit cards 3, 8, 0 and 5, make the smallest 4-digit number.", "Ab aapki baari. Digit cards 3, 8, 0 aur 5 se sabse chhota 4 digit ka number banao."),
    ], {"mode": "digits", "digits": [3, 8, 0, 5], "make": "largest", "task": "smallest"}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "At the India versus Australia match, the announcer says 98,476 fans are in the stadium.", "India aur Australia ke match mein announcer bataata hai ki stadium mein 98,476 fans hain."),
        L("Harsh", "The newspaper will just say about 98,000. Why?", "Akhbaar toh bas lagbhag 98,000 likhega. Kyon?"),
        L("Dadi", "Because exact numbers are not always needed. We round to the nearest thousand. 98,476 lies between 98,000 and 99,000, and it is nearer to 98,000.",
          "Kyonki hamesha exact number ki zaroorat nahi hoti. Hum nearest thousand tak round karte hain. 98,476, 98,000 aur 99,000 ke beech hai, aur 98,000 ke zyaada paas hai."),
    ], {"mode": "round", "value": 98476, "place": 1000}),
    scene([
        L("Disha", "What if it is exactly in the middle, like 98,500?", "Agar bilkul beech mein ho, jaise 98,500?"),
        L("Dadi", "Then we round up, to 99,000. That is the rule everyone follows.", "Toh hum upar round karte hain, 99,000. Yahi niyam sab maante hain."),
    ], {"mode": "round", "value": 98500, "place": 1000}),
    scene([
        L("Dadi", "Rounding to the nearest ten: 4,763 is between 4,760 and 4,770. The 3 in the ones place is less than 5, so it rounds down to 4,760.",
          "Nearest ten tak round karna: 4,763, 4,760 aur 4,770 ke beech hai. Ones ki jagah 3 hai jo 5 se kam hai, toh yeh neeche 4,760 ho jaata hai."),
    ], {"mode": "round", "value": 4763, "place": 10}),
    scene([
        L("Neha", "For Diwali shopping I spent 5,290 rupees on sweets and 17,986 rupees on clothes. About how much is that?",
          "Diwali shopping mein maine mithaai par 5,290 rupaye aur kapdon par 17,986 rupaye kharch kiye. Lagbhag kitna hua?"),
        L("Disha", "Round each to the nearest thousand: 5,000 plus 18,000 is about 23,000 rupees.", "Har ek ko nearest thousand tak round karo: 5,000 plus 18,000, lagbhag 23,000 rupaye."),
        L("Neha", "The exact bill is 23,276. You were very close, and you did it in your head!", "Asli bill 23,276 hai. Tum bahut paas the, aur woh bhi mann mein hisaab lagaakar!"),
    ], {"mode": "sum", "a": 5290, "b": 17986, "place": 1000}),
]

SCENES_5 = [
    scene([
        L("Narrator", "Disha is making a poster of record-breaking numbers for her school project.", "Disha school project ke liye record todne wale numbers ka poster bana rahi hai."),
        L("Disha", "Mount Everest is 8,849 metres high. How many kilometres is that?", "Mount Everest 8,849 metre ooncha hai. Yeh kitne kilometre hua?"),
        L("Deepak", "1 kilometre is 1,000 metres. Going up the ladder to a bigger unit, we divide by 1,000. So it is 8.849 kilometres, nearly 9 kilometres straight up!",
          "1 kilometre barabar 1,000 metre. Ladder mein upar badi unit ki taraf jaate hain toh 1,000 se bhaag dete hain. Toh 8.849 kilometre, lagbhag 9 kilometre seedha upar!"),
    ], {"kind": "length", "value": 8849, "unit": "m", "label": "Mount Everest"}),
    scene([
        L("Harsh", "And in centimetres?", "Aur centimetre mein?"),
        L("Deepak", "Going down to smaller units, we multiply. 1 metre is 100 centimetres, so Everest is 8,84,900 centimetres tall!",
          "Chhoti units ki taraf neeche jaate hain toh guna karte hain. 1 metre barabar 100 centimetre, toh Everest 8,84,900 centimetre ooncha hai!"),
    ], {"kind": "length", "value": 8849, "unit": "m", "label": "Mount Everest"}),
    scene([
        L("Disha", "The Moon is 3,84,400 kilometres away. In metres that is 38,44,00,000. Thirty-eight crore metres!", "Chaand 3,84,400 kilometre door hai. Metre mein yeh 38,44,00,000 hai. Adtees crore metre!"),
    ], {"kind": "length", "value": 384400, "unit": "km", "label": "Earth to Moon"}),
    scene([
        L("Neha", "In my kitchen I use grams and kilograms. This bag of rice is 25 kilograms, which is 25,000 grams.", "Mere kitchen mein main gram aur kilogram use karti hoon. Chaawal ka yeh bora 25 kilogram ka hai, yaani 25,000 gram."),
        L("Dadi", "And my medicine tablet is 500 milligrams. 1 gram is 1,000 milligrams, so that is just half a gram.", "Aur meri dawai ki goli 500 milligram ki hai. 1 gram barabar 1,000 milligram, toh yeh sirf aadha gram hai."),
    ], {"kind": "mass", "value": 25, "unit": "kg", "label": "Bag of rice"}),
    scene([
        L("Harsh", "And my water bottle holds 1 litre, which is 1,000 millilitres!", "Aur meri paani ki bottle mein 1 litre aata hai, yaani 1,000 millilitre!"),
    ], {"kind": "capacity", "value": 1, "unit": "L", "label": "Water bottle"}),
]

SCENES_6 = [
    scene([
        L("Narrator", "In Dadi's room hangs an old wall clock with strange numbers.", "Dadi ke kamre mein ek purani deewar ghadi hai jisme ajeeb se number hain."),
        L("Disha", "Dadi, your clock doesn't have 1, 2, 3. It has I, II, III!", "Dadi, aapki ghadi mein 1, 2, 3 nahi hai. Isme I, II, III hai!"),
        L("Dadi", "Those are Roman numerals, used in ancient Rome more than 2,000 years ago. You still see them on clocks, in book chapters and in the names of kings.",
          "Yeh Roman numerals hain, jo 2,000 saal se bhi pehle Rome mein use hote the. Aaj bhi yeh ghadiyon, kitaab ke adhyaayon aur raajaaon ke naamon mein dikhte hain."),
    ], {"mode": "clock"}),
    scene([
        L("Dadi", "There are only seven symbols. I is 1, V is 5, X is 10, L is 50, C is 100, D is 500 and M is 1,000.",
          "Sirf saat symbols hain. I barabar 1, V barabar 5, X barabar 10, L barabar 50, C barabar 100, D barabar 500 aur M barabar 1,000."),
        L("Harsh", "So how do you write 2, or 3?", "Toh 2 ya 3 kaise likhte hain?"),
        L("Dadi", "Repeat the symbol: II is 2 and III is 3. But a symbol can repeat at most three times.", "Symbol dohraao: II barabar 2 aur III barabar 3. Lekin koi symbol zyaada se zyaada teen baar dohra sakta hai."),
    ], {"mode": "build", "value": 3}),
    scene([
        L("Disha", "Then 4 can't be IIII?", "Toh 4, IIII nahi ho sakta?"),
        L("Dadi", "Right. A smaller symbol before a bigger one means subtract. IV is 5 minus 1, which is 4. A smaller symbol after a bigger one means add. VI is 5 plus 1, which is 6.",
          "Sahi. Bade symbol se pehle chhota symbol matlab ghataao. IV barabar 5 minus 1, yaani 4. Bade ke baad chhota symbol matlab jodo. VI barabar 5 plus 1, yaani 6."),
        L("Harsh", "But some old clocks show IIII for 4!", "Lekin kuch purani ghadiyon mein 4 ke liye IIII likha hota hai!"),
        L("Dadi", "Good eye! Clockmakers sometimes did that, but IV is the correct way.", "Badhiya nazar! Ghadi banaane wale kabhi kabhi aisa karte the, lekin sahi tareeka IV hai."),
    ], {"mode": "build", "value": 4}),
    scene([
        L("Dadi", "Big numbers are built from tiles. This year, 2026, is M M X X V I. 1,000 plus 1,000 plus 10 plus 10 plus 5 plus 1.",
          "Bade numbers tiles se bante hain. Yeh saal, 2026, hai M M X X V I. 1,000 plus 1,000 plus 10 plus 10 plus 5 plus 1."),
    ], {"mode": "build", "value": 2026}),
    scene([
        L("Disha", "And 49 is X L I X: 50 minus 10, plus 10 minus 1!", "Aur 49 hai X L I X: 50 minus 10, plus 10 minus 1!"),
    ], {"mode": "build", "value": 49}),
    scene([
        L("Dadi", "Your turn. Write 94 in Roman numerals and press check. Hint: break it into 90 and 4.", "Ab aapki baari. 94 ko Roman numerals mein likho aur check dabaao. Hint: ise 90 aur 4 mein todo."),
    ], {"mode": "build", "value": 1, "task": 94}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "Before the class test, Dadi gives Harsh and Disha a practice sheet.", "Class test se pehle, Dadi Harsh aur Disha ko ek practice sheet deti hain."),
        L("Dadi", "Question 1. Write 7,08,46,215 in words, in both the Indian and International systems.", "Sawaal 1. 7,08,46,215 ko shabdon mein likho, Bharatiya aur International dono paddhatiyon mein."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "Indian: seven crore, eight lakh, forty-six thousand, two hundred fifteen.", "Indian: saat crore, aath lakh, chhiyaalees hazaar, do sau pandrah."),
        L("Harsh", "International: seventy million, eight hundred forty-six thousand, two hundred fifteen.", "International: seventy million, eight hundred forty-six thousand, two hundred fifteen."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. Use brackets to work out 7 times 109 quickly in your head.", "Sawaal 2. Brackets ki madad se 7 guna 109 jaldi se mann mein nikaalo."),
        L("Harsh", "109 is 100 plus 9. So 7 times 100 is 700, and 7 times 9 is 63. 700 plus 63 is 763!", "109 barabar 100 plus 9. Toh 7 guna 100 barabar 700, aur 7 guna 9 barabar 63. 700 plus 63 barabar 763!"),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


PARTS = [
    {
        "title": "Story 1: Papa's Newspaper · Place Value and Big Numbers",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Papa reads out India's population from the newspaper: 1,21,08,54,977. Harsh can't even say it, so Dadi brings out the place value chart.</div>

<h2>The Indian place value chart</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Period</th><th class="text-left">Places</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Crores</td><td>Ten crores (10,00,00,000), Crores (1,00,00,000)</td></tr>
    <tr><td>Lakhs</td><td>Ten lakhs (10,00,000), Lakhs (1,00,000)</td></tr>
    <tr><td>Thousands</td><td>Ten thousands (10,000), Thousands (1,000)</td></tr>
    <tr><td>Ones</td><td>Hundreds (100), Tens (10), Ones (1)</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div><strong class="text-amber-300">Face value</strong>: the digit itself (the 2 in 1,32,000 is 2).</div>
  <div><strong class="text-amber-300">Place value</strong>: digit × value of its place (the 2 in 1,32,000 is worth 2,000).</div>
  <div><strong class="text-amber-300">Expanded form</strong>: 3,84,400 = 3,00,000 + 80,000 + 4,000 + 400</div>
</div>
<h2>Real big numbers</h2>
<ul>
  <li>India's population (Census 2011): <strong>1,21,08,54,977</strong></li>
  <li>Distance from Earth to the Moon: <strong>3,84,400 km</strong></li>
  <li>Narendra Modi Stadium, Ahmedabad: about <strong>1,32,000 seats</strong></li>
</ul>
""",
        "keyInsight": "Face value is the digit; place value is the digit multiplied by the value of its place.",
        "widgetType": "Class6PlaceValueWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "What is the place value of 5 in 3,58,201?",
            "options": ["5", "500", "50,000", "5,000"],
            "correctIndex": 2,
            "explanation": "The 5 is in the ten thousands place, so its place value is 5 × 10,000 = 50,000.",
        },
        "teacherNotes": teacher(
            [
                "Start from a real headline number (population, cricket crowd) to create the need for a system.",
                "Use the periods (crores, lakhs, thousands, ones) as 'families' of places; read one family at a time.",
                "Contrast face value and place value with the same digit in different numbers.",
            ],
            [
                "Reading 1,21,08,54,977 digit by digit instead of by periods.",
                "Mixing up face value and place value.",
                "Writing extra zeros when converting number names to digits (e.g. five lakh six thousand twenty → 5,06,020, not 5,6,020 or 50,06,020).",
            ],
            "Number dictation: the teacher reads 5 large numbers aloud in the Indian system; students write them with commas, then swap and check using a place value chart.",
            "Old NCERT Ch. 1 Knowing Our Numbers (1.3 Introducing 10,000 to 1.3.4 Use of commas).",
        ),
    },
    {
        "title": "Story 2: A Call from the USA · Indian and International Systems",
        "readingTime": "~4 min story",
        "narrative": f"""
<div {STORY}>Cousin Rohan calls from the USA and says India has "1.2 billion" people. Disha has never heard of a billion.</div>

<h2>Two ways to group digits</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Indian</strong>: first comma after 3 digits from the right, then every 2 digits → 1,21,08,54,977</div>
  <div><strong class="text-sky-300">International</strong>: a comma every 3 digits → 1,210,854,977</div>
</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Indian</th><th class="text-left">International</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>1 lakh = 1,00,000</td><td>100 thousand</td></tr>
    <tr><td>10 lakh = 10,00,000</td><td>1 million</td></tr>
    <tr><td>1 crore = 1,00,00,000</td><td>10 million</td></tr>
    <tr><td>10 crore</td><td>100 million</td></tr>
    <tr><td>100 crore</td><td>1 billion</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "10 lakh = 1 million, 1 crore = 10 million, 100 crore = 1 billion.",
        "widgetType": "Class6PlaceValueWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "5 million is the same as…",
            "options": ["5 lakh", "50 lakh", "5 crore", "50 crore"],
            "correctIndex": 1,
            "explanation": "1 million = 10 lakh, so 5 million = 50 lakh.",
        },
        "teacherNotes": teacher(
            [
                "Put both charts side by side and line up the places: the digits are the same, only the grouping and names change.",
                "Practise converting with the anchors 10 lakh = 1 million and 1 crore = 10 million.",
            ],
            [
                "Placing commas every 3 digits in the Indian system.",
                "Thinking 1 million = 1 crore.",
            ],
            "Comma relay: teams receive numbers without commas and race to write them in both systems on the board.",
            "Old NCERT Ch. 1 (1.3.5 International system of numeration).",
        ),
    },
    {
        "title": "Story 3: Mountains and Digit Cards · Comparing and Ordering",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Harsh's Himalaya book lists the tallest mountains on Earth, and Mummy needs the largest price from her digit cards.</div>

<h2>Comparing two numbers</h2>
<ol>
  <li><strong>More digits → bigger number.</strong> 1,00,000 (6 digits) &gt; 99,999 (5 digits).</li>
  <li><strong>Same number of digits → compare from the left</strong>, digit by digit, until two digits differ.</li>
</ol>
<div {CARD}>
  <div>K2 = 8,611 m, Kangchenjunga = 8,586 m</div>
  <div>8 = 8, then 6 &gt; 5 → <strong class="text-emerald-300">8,611 &gt; 8,586</strong></div>
</div>
<p><strong>Ascending</strong> order: smallest to largest. <strong>Descending</strong> order: largest to smallest.</p>
<p>The five highest peaks: Everest 8,849 m, K2 8,611 m, Kangchenjunga 8,586 m, Lhotse 8,516 m, Makalu 8,485 m.</p>

<h2>Largest and smallest from digits</h2>
<div {CARD}>
  <div>Largest: digits in descending order → 7, 0, 4, 9 gives <strong>9,740</strong></div>
  <div>Smallest: ascending order, but <strong>never start with 0</strong> → <strong>4,079</strong></div>
</div>
""",
        "keyInsight": "Count the digits first; if equal, the first different digit from the left decides.",
        "widgetType": "Class6CompareOrderWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "Which is the smallest 4-digit number using the digits 6, 0, 2, 9 once each?",
            "options": ["0269", "2069", "2096", "2609"],
            "correctIndex": 1,
            "explanation": "Smallest non-zero digit first (2), then the rest in ascending order: 2, 0, 6, 9 → 2,069.",
        },
        "teacherNotes": teacher(
            [
                "Line the two numbers up one under the other by place value before comparing.",
                "Use real data (mountains, cricket scores) for ordering; students care more about which is taller.",
            ],
            [
                "Comparing the last digits instead of the first.",
                "Starting the smallest number with 0.",
                "Thinking a number with a bigger first digit is always bigger even if it has fewer digits (9,999 vs 10,000).",
            ],
            "Human number line: give 6 students cards with large numbers; the class arranges them in ascending order and justifies each swap.",
            "Old NCERT Ch. 1 (1.2 Comparing numbers, shifting digits, forming numbers).",
        ),
    },
    {
        "title": "Story 4: Cricket Crowds and Diwali Bills · Estimation",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>98,476 fans fill the stadium, but the newspaper will say "about 98,000". Mummy wants to know roughly how much she spent on Diwali shopping.</div>

<h2>Rounding</h2>
<div {CARD}>
  <div>Find the two multiples the number lies between, and pick the <strong>nearer</strong> one.</div>
  <div>Exactly halfway? <strong>Round up.</strong></div>
  <div>98,476 → nearest 1,000 → <strong>98,000</strong>; 98,500 → <strong>99,000</strong></div>
  <div>4,763 → nearest 10 → <strong>4,760</strong></div>
</div>
<h2>Estimating sums and differences</h2>
<div {FORMULA}>5,290 + 17,986 ≈ 5,000 + 18,000 = 23,000   (exact: 23,276)</div>
<p>Estimates are quick, done in your head, and good enough for planning: crowd sizes, shopping budgets, travel distances.</p>
""",
        "keyInsight": "Round each number to a sensible place first, then calculate. Halfway rounds up.",
        "widgetType": "Class6EstimationWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Round 46,850 to the nearest thousand.",
            "options": ["46,000", "47,000", "46,900", "50,000"],
            "correctIndex": 1,
            "explanation": "46,850 is between 46,000 and 47,000; the halfway mark is 46,500, and 46,850 is past it, so it rounds to 47,000.",
        },
        "teacherNotes": teacher(
            [
                "Always draw the number line: the two multiples, the halfway mark and the number.",
                "Discuss when estimation is good enough (crowd, budget) and when it is not (bank balance, medicine dose).",
            ],
            [
                "Rounding by just replacing the last digits with zeros (truncating) instead of rounding.",
                "Getting the halfway case wrong.",
            ],
            "Estimate first: before solving 5 addition problems, students write estimates; then compare with exact answers and discuss which estimates were closest.",
            "Old NCERT Ch. 1 (1.4 Estimation, estimating to the nearest tens/hundreds/thousands, estimating outcomes of operations).",
        ),
    },
    {
        "title": "Story 5: Disha's Record Poster · Big Measurements",
        "readingTime": "~4 min story",
        "narrative": f"""
<div {STORY}>Disha makes a poster of record-breaking numbers: the tallest mountain, the distance to the Moon, and even Mummy's 25 kg rice bag.</div>

<h2>The unit ladders</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Length</strong>: 1 km = 1,000 m, 1 m = 100 cm, 1 cm = 10 mm</div>
  <div><strong class="text-amber-300">Mass</strong>: 1 kg = 1,000 g, 1 g = 1,000 mg</div>
  <div><strong class="text-amber-300">Capacity</strong>: 1 L = 1,000 mL</div>
</div>
<div {FORMULA}>Down the ladder (to a smaller unit): multiply.   Up the ladder (to a bigger unit): divide.</div>
<ul>
  <li>Mount Everest: 8,849 m = 8.849 km = 8,84,900 cm</li>
  <li>Earth to Moon: 3,84,400 km = 38,44,00,000 m</li>
  <li>Rice bag: 25 kg = 25,000 g; a 500 mg tablet is half a gram</li>
</ul>
""",
        "keyInsight": "A smaller unit needs a bigger number: multiply going down the ladder, divide going up.",
        "widgetType": "Class6UnitLadderWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "How many grams are there in 3 kg 250 g?",
            "options": ["325 g", "3,025 g", "3,250 g", "32,500 g"],
            "correctIndex": 2,
            "explanation": "3 kg = 3,000 g, so 3 kg 250 g = 3,000 + 250 = 3,250 g.",
        },
        "teacherNotes": teacher(
            [
                "Draw the ladder on the board and keep it up for the whole week.",
                "Use real objects: a 1 L bottle, a 1 kg packet, a metre stick, a 500 mg tablet strip.",
            ],
            [
                "Dividing when converting to a smaller unit (km to m).",
                "Using 100 instead of 1,000 for km–m and kg–g.",
            ],
            "Measurement scavenger hunt: find objects at home labelled in mL, L, g, kg and convert each to the other unit.",
            "Old NCERT Ch. 1 (1.3.6 Large numbers in practice).",
        ),
    },
    {
        "title": "Story 6: Dadi's Wall Clock · Roman Numerals",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Dadi's old wall clock has no 1, 2, 3. It shows I, II, III: numbers from ancient Rome that are still used today.</div>

<h2>The seven symbols</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>I</th><th>V</th><th>X</th><th>L</th><th>C</th><th>D</th><th>M</th></tr></thead>
  <tbody class="text-slate-300 text-center"><tr><td>1</td><td>5</td><td>10</td><td>50</td><td>100</td><td>500</td><td>1000</td></tr></tbody>
</table>
<h2>Rules</h2>
<ol>
  <li>Repeating a symbol adds it, at most <strong>3 times</strong>: III = 3, XXX = 30. V, L and D are never repeated.</li>
  <li>Smaller <strong>after</strong> bigger → add: VI = 6, LX = 60.</li>
  <li>Smaller <strong>before</strong> bigger → subtract: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900. Only I, X and C can be subtracted.</li>
</ol>
<div {CARD}>
  <div>2026 = MM + XX + VI = <strong>MMXXVI</strong></div>
  <div>49 = XL + IX = <strong>XLIX</strong></div>
  <div>94 = XC + IV = <strong>XCIV</strong></div>
</div>
""",
        "keyInsight": "Break the number into thousands, hundreds, tens and ones, then write each part with the rules.",
        "widgetType": "Class6RomanNumeralsWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "What is XLIV?",
            "options": ["64", "46", "44", "66"],
            "correctIndex": 2,
            "explanation": "XL = 50 − 10 = 40 and IV = 5 − 1 = 4, so XLIV = 44.",
        },
        "teacherNotes": teacher(
            [
                "Teach by place value: convert thousands, hundreds, tens and ones separately, then join.",
                "Show real uses: clock faces, chapter numbers, film sequels, names like Louis XIV.",
            ],
            [
                "Writing IIII or VV.",
                "Subtracting the wrong symbols (IC for 99 instead of XCIX).",
                "Reading left to right and always adding.",
            ],
            "Roman birthday: each student writes their birth year and age in Roman numerals; partners convert back to check.",
            "Old NCERT Ch. 1 (1.5 Roman numerals).",
        ),
    },
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>Before the class test, Dadi gives Harsh and Disha a practice sheet. They take turns explaining each step.</div>
<h2>Using brackets</h2>
<p>Brackets tell us what to do first, and they make mental maths easy:</p>
<div {FORMULA}>7 × 109 = 7 × (100 + 9) = 700 + 63 = 763</div>
<p>Try each question in your notebook before revealing the steps.</p>
""",
        "keyInsight": "Read big numbers by periods, compare from the left, round to the nearest sensible place, and break numbers apart with brackets.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {"title": "Number names in both systems", "question": "Write 7,08,46,215 in words in the Indian and International systems.",
                 "steps": ["Indian periods: 7 | 08 | 46 | 215", "Indian: seven crore eight lakh forty-six thousand two hundred fifteen", "International: 70,846,215 → seventy million eight hundred forty-six thousand two hundred fifteen"],
                 "answer": "Seven crore eight lakh forty-six thousand two hundred fifteen; seventy million eight hundred forty-six thousand two hundred fifteen"},
                {"title": "Brackets for mental maths", "question": "Find 7 × 109 using brackets.",
                 "steps": ["109 = 100 + 9", "7 × (100 + 9) = 7 × 100 + 7 × 9", "= 700 + 63 = <strong>763</strong>"], "answer": "763"},
                {"title": "Place value and face value", "question": "In 6,45,93,210, find the place value and face value of 9.",
                 "steps": ["9 is in the ten thousands place.", "Face value = <strong>9</strong>", "Place value = 9 × 10,000 = <strong>90,000</strong>"], "answer": "Face value 9, place value 90,000"},
                {"title": "Expanded form", "question": "Write 50,08,302 in expanded form.",
                 "steps": ["Digits by place: 5 ten lakhs, 0 lakhs, 0 ten thousands, 8 thousands, 3 hundreds, 0 tens, 2 ones", "= 50,00,000 + 8,000 + 300 + 2"], "answer": "50,00,000 + 8,000 + 300 + 2"},
                {"title": "Compare", "question": "Which is greater: 4,56,789 or 4,65,789?",
                 "steps": ["Both have 6 digits.", "Compare from the left: 4 = 4, then 5 < 6.", "So 4,65,789 is greater."], "answer": "4,65,789 > 4,56,789"},
                {"title": "Largest and smallest", "question": "Using 3, 0, 8, 5 once each, write the largest and the smallest 4-digit numbers. Find their difference.",
                 "steps": ["Largest: 8,530", "Smallest (cannot start with 0): 3,058", "Difference: 8,530 − 3,058 = <strong>5,472</strong>"], "answer": "8,530 and 3,058; difference 5,472"},
                {"title": "Rounding", "question": "Round 7,64,519 to the nearest thousand and to the nearest lakh.",
                 "steps": ["Nearest thousand: between 7,64,000 and 7,65,000; 519 ≥ 500 → <strong>7,65,000</strong>", "Nearest lakh: between 7,00,000 and 8,00,000; 64,519 ≥ 50,000 → <strong>8,00,000</strong>"], "answer": "7,65,000 and 8,00,000"},
                {"title": "Estimate a product", "question": "Estimate 578 × 161 by rounding each number to the nearest hundred.",
                 "steps": ["578 ≈ 600, 161 ≈ 200", "600 × 200 = <strong>1,20,000</strong>", "(Exact: 93,058. Rounding both up gives an over-estimate.)"], "answer": "About 1,20,000"},
                {"title": "Unit conversion", "question": "A train travels 1,250 km. How many metres is that?",
                 "steps": ["1 km = 1,000 m (going down the ladder: multiply)", "1,250 × 1,000 = <strong>12,50,000 m</strong>"], "answer": "12,50,000 m"},
                {"title": "Roman numerals", "question": "Write 1,984 in Roman numerals, and find the value of CDXLIV.",
                 "steps": ["1,984 = 1,000 + 900 + 80 + 4 = M + CM + LXXX + IV = <strong>MCMLXXXIV</strong>", "CDXLIV = CD (400) + XL (40) + IV (4) = <strong>444</strong>"], "answer": "MCMLXXXIV; 444"},
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            ["Insist on commas in every answer; they prevent most place value mistakes."],
            ["Q6: starting the smallest number with 0.", "Q8: students multiply exactly instead of estimating; ask for the estimate first."],
            "Pair-share: one student solves aloud, the other checks with the steps; swap for the next question.",
            "Covers old NCERT Ch. 1 exercises 1.1–1.3 patterns.",
        ),
    },
    {
        "title": "Chapter Exam · Knowing Our Numbers (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From India's population to Dadi's Roman clock, you now handle big numbers like a pro. Show what you know!</p>
<div {CARD}>
  <div><strong>10 questions</strong> on place value, number systems, comparing, estimation, units and Roman numerals.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Commas, periods and place value solve most big-number questions.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Knowing Our Numbers · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "The place value of 7 in 4,73,215 is:", "options": ["7", "7,000", "70,000", "7,00,000"], "answer": 2, "explanation": "7 is in the ten thousands place: 7 × 10,000 = 70,000.", "topic": "Place value"},
                {"q": "Which shows the Indian system of commas?", "options": ["12,345,678", "1,23,45,678", "123,45,678", "1,234,5678"], "answer": 1, "explanation": "First comma after 3 digits from the right, then every 2 digits.", "topic": "Indian commas"},
                {"q": "1 crore equals:", "options": ["1 million", "10 million", "100 million", "1 billion"], "answer": 1, "explanation": "1 crore = 1,00,00,000 = 10,000,000 = 10 million.", "topic": "Indian vs International"},
                {"q": "Which is the greatest?", "options": ["99,999", "1,00,000", "98,765", "99,989"], "answer": 1, "explanation": "1,00,000 has 6 digits; the others have 5.", "topic": "Comparing numbers"},
                {"q": "The smallest 4-digit number using 0, 3, 7, 1 once each is:", "options": ["0137", "1037", "1307", "1073"], "answer": 1, "explanation": "Smallest non-zero digit first: 1, then 0, 3, 7 → 1,037.", "topic": "Forming numbers"},
                {"q": "8,449 rounded to the nearest hundred is:", "options": ["8,400", "8,500", "8,000", "8,450"], "answer": 0, "explanation": "8,449 is between 8,400 and 8,500, and 49 < 50, so it rounds down to 8,400.", "topic": "Rounding"},
                {"q": "Estimate 4,876 + 3,219 to the nearest thousand:", "options": ["7,000", "8,000", "9,000", "8,100"], "answer": 1, "explanation": "5,000 + 3,000 = 8,000.", "topic": "Estimation"},
                {"q": "How many metres are there in 5 km?", "options": ["50", "500", "5,000", "50,000"], "answer": 2, "explanation": "1 km = 1,000 m, so 5 km = 5,000 m.", "topic": "Units"},
                {"q": "The Roman numeral for 90 is:", "options": ["LXXXX", "XC", "IC", "LC"], "answer": 1, "explanation": "90 = 100 − 10 = XC.", "topic": "Roman numerals"},
                {"q": "6 × (100 + 4) equals:", "options": ["610", "604", "624", "640"], "answer": 2, "explanation": "6 × 100 + 6 × 4 = 600 + 24 = 624.", "topic": "Brackets"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the right story."],
            ["Q2 and Q3 test the two systems; Q5 catches leading zeros; Q9 catches IC-type mistakes."],
            "Exit ticket: write your city's population (or any big number from the news) in both systems and in words.",
            "Matches old NCERT Ch. 1 learning outcomes.",
        ),
    },
]


def seed_class6_knowing_numbers():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Knowing Our Numbers")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Knowing Our Numbers: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Knowing Our Numbers: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_knowing_numbers()
