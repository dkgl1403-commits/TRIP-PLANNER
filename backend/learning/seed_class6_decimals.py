import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Decimals (old NCERT Ch. 8 "Decimals": tenths, hundredths, place value, number line, comparing,
# money/length/weight, adding and subtracting decimals; Ganita Prakash builds the same ideas through measurement:
# units smaller than one, fractional units of 10 and 100, the number line, and is carried into "A Peek Beyond
# the Point" in Class 7). Story: the Jaipur family measures pencils, counts bakery coins, reads Papa's railway
# notebook, follows a train along a track, shops in the market and goes Diwali shopping.
#
# Verified facts used:
# - The Indian rupee was decimalised on 1 April 1957: it was divided into 100 (naye) paise instead of
#   16 annas. (RBI, "Coinage: Republic India"; RBI "Retrospect" on Indian coins.)
# - Indian Railways broad gauge is 1,676 mm = 1.676 m between the rails. (IRFCA gauge FAQ; Indian Railways.)
# - Neeraj Chopra won the Tokyo 2020 Olympic javelin gold (7 August 2021) with 87.58 m, thrown on his
#   second attempt; his first throw was 87.03 m. (olympics.com; The Week.)
# - Cricket overs: 4.3 overs means 4 overs and 3 balls (6 balls in an over), so it is not a decimal.


SCENES_1 = [
    scene([
        L("Narrator", "It is the first day of school in Jaipur. Disha opens her new geometry box and measures her pencil.",
          "Jaipur mein school ka pehla din hai. Disha apna naya geometry box kholti hai aur apni pencil naapti hai."),
        L("Disha", "The pencil starts at 0 and ends exactly at 4. So it is 4 centimetres long!", "Pencil 0 se shuru hoti hai aur theek 4 par khatam. Toh yeh 4 centimetre lambi hai!"),
    ], {"mode": "ruler", "t": 40}),
    scene([
        L("Harsh", "Mine ends after 4, but before 5. It is 4 and a bit. What do I write?", "Meri wali 4 ke baad, lekin 5 se pehle khatam hoti hai. 4 aur thoda sa. Main kya likhoon?"),
        L("Dadi", "Count the tiny marks after 4, beta. Each centimetre is cut into 10 equal millimetres.",
          "Beta, 4 ke baad ke chhote nishaan gino. Har centimetre 10 barabar millimetre mein kata hai."),
    ], {"mode": "ruler", "t": 47}),
    scene([
        L("Harsh", "7 tiny marks. So my pencil is 4 centimetres and 7 millimetres.", "7 chhote nishaan. Toh meri pencil 4 centimetre aur 7 millimetre hai."),
        L("Dadi", "One millimetre is one tenth of a centimetre. So your pencil is 4 and 7 tenths centimetres. We write it as 4 point 7.",
          "Ek millimetre, centimetre ka ek dasvaan hissa hai. Toh tumhaari pencil 4 aur 7 tenths centimetre hai. Ise hum 4 point 7 likhte hain."),
    ], {"mode": "ruler", "t": 47}),
    scene([
        L("Dadi", "Look at this strip. It is one whole, cut into 10 equal parts. One part is one tenth. As a decimal, it is 0 point 1.",
          "Is patti ko dekho. Yeh ek poora hai, 10 barabar hisson mein kata. Ek hissa ek tenth hai. Decimal mein yeh 0 point 1 hai."),
        L("Disha", "So the dot is a wall. Whole numbers live on its left, and tenths live on its right?", "Toh yeh bindu ek deewar hai. Whole numbers uske left mein, aur tenths uske right mein rehte hain?"),
        L("Dadi", "Exactly! That dot is called the decimal point.", "Bilkul! Us bindu ko decimal point kehte hain."),
    ], {"mode": "strip", "t": 1}),
    scene([
        L("Disha", "Seven parts shaded is 7 tenths, so 0 point 7.", "Saat hisse rangeen matlab 7 tenths, toh 0 point 7."),
    ], {"mode": "strip", "t": 7}),
    scene([
        L("Harsh", "And all 10 parts make 10 tenths. That is one whole strip!", "Aur saare 10 hisse matlab 10 tenths. Yeh poori ek patti hai!"),
        L("Dadi", "Yes. 10 tenths make 1, just like 10 ones make a ten.", "Haan. 10 tenths milkar 1 banaate hain, jaise 10 ones milkar ek ten banaate hain."),
    ], {"mode": "strip", "t": 10}),
    scene([
        L("Disha", "Two full strips and 3 tenths more is 23 tenths. That is 2 point 3!", "Do poori pattiyaan aur 3 tenths aur, yaani 23 tenths. Yeh 2 point 3 hai!"),
        L("Harsh", "Like the cricket score! Our team has batted 4 point 3 overs.", "Cricket score ki tarah! Hamari team ne 4 point 3 overs khele hain."),
        L("Dadi", "Careful, Harsh. An over has 6 balls, so 4 point 3 overs means 4 overs and 3 balls. That is not a decimal, because a decimal always splits into 10 equal parts.",
          "Dhyaan se, Harsh. Ek over mein 6 balls hoti hain, toh 4 point 3 overs ka matlab 4 overs aur 3 balls. Yeh decimal nahi hai, kyonki decimal hamesha 10 barabar hisson mein baant-ta hai."),
    ], {"mode": "strip", "t": 23}),
    scene([
        L("Disha", "Your turn! Make the pencil exactly 6 point 3 centimetres long.", "Ab aapki baari! Pencil ko theek 6 point 3 centimetre lamba banao."),
    ], {"mode": "ruler", "t": 20, "task": {"t": 63, "mode": "ruler"}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "On Saturday, Mummy empties the bakery cash box on the table. Dadi brings a square sheet with 100 small squares.",
          "Shanivaar ko Mummy bakery ka cash box table par khaali karti hain. Dadi 100 chhote khaanon wali ek square sheet laati hain."),
        L("Dadi", "This whole square is 1. One column has 10 small squares, so one column is one tenth.", "Yeh poora square 1 hai. Ek column mein 10 chhote khaane hain, toh ek column ek tenth hai."),
    ], {"mode": "grid", "h": 10}),
    scene([
        L("Dadi", "Now cut that tenth into 10 again. One tiny square is one hundredth. We write it as 0 point 0 1.",
          "Ab us tenth ko phir se 10 mein kaato. Ek chhota khaana ek hundredth hai. Ise hum 0 point 0 1 likhte hain."),
    ], {"mode": "grid", "h": 1}),
    scene([
        L("Disha", "I shaded 3 full columns and 5 more squares. That is 3 tenths and 5 hundredths.", "Maine 3 poore column aur 5 khaane aur rangey. Yeh 3 tenths aur 5 hundredths hai."),
        L("Dadi", "And altogether 35 hundredths. As a decimal, 0 point 3 5. The first place after the point is tenths, the second is hundredths.",
          "Aur kul milakar 35 hundredths. Decimal mein, 0 point 3 5. Point ke baad pehli jagah tenths ki, doosri hundredths ki."),
    ], {"mode": "grid", "h": 35}),
    scene([
        L("Harsh", "50 squares is 0 point 5 0. But 5 columns is 0 point 5. Which one is right?", "50 khaane matlab 0 point 5 0. Lekin 5 column matlab 0 point 5. Kaun sa sahi hai?"),
        L("Dadi", "Both! It is the same half of the square. A zero at the very end after the point changes nothing.",
          "Dono! Yeh square ka wahi aadha hai. Point ke baad bilkul aakhir mein lagi zero kuch nahi badalti."),
    ], {"mode": "grid", "h": 50}),
    scene([
        L("Neha", "My customers pay in rupees and paise. 100 paise make 1 rupee, so 1 paisa is one hundredth of a rupee.",
          "Mere customers rupaye aur paise mein dete hain. 100 paise milkar 1 rupaya banaate hain, toh 1 paisa ek rupaye ka hundredth hai."),
        L("Neha", "Here are 2 rupees and 75 paise. I write it as rupees 2 point 7 5.", "Yeh rahe 2 rupaye aur 75 paise. Main ise rupaye 2 point 7 5 likhti hoon."),
    ], {"mode": "money", "rupees": 2, "h": 75}),
    scene([
        L("Dadi", "In my grandmother's time, a rupee had 16 annas. From 1 April 1957, India divided the rupee into 100 paise instead. That made money a decimal system!",
          "Meri daadi ke zamaane mein ek rupaye mein 16 aane hote the. 1 April 1957 se, Bharat ne rupaye ko 100 paise mein baant diya. Isse paisa ek decimal system ban gaya!"),
        L("Disha", "So 50 paise is half a rupee, rupees 0 point 5 0.", "Toh 50 paise aadha rupaya hai, rupaye 0 point 5 0."),
    ], {"mode": "money", "rupees": 0, "h": 50}),
    scene([
        L("Neha", "Your turn! A customer must pay 3 rupees and 45 paise. Show the money.", "Ab aapki baari! Ek customer ko 3 rupaye aur 45 paise dene hain. Paise dikhaao."),
    ], {"mode": "money", "rupees": 1, "h": 0, "task": {"h": 45, "rupees": 3}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "On Sunday, Papa shows the children his railway notebook. It is full of measurements with decimal points.",
          "Itvaar ko Papa bachchon ko apni railway notebook dikhaate hain. Usmein decimal points wale naap bhare hain."),
        L("Deepak", "The two rails of our broad gauge track are 1 point 6 7 6 metres apart. That is 1,676 millimetres.",
          "Hamare broad gauge track ki do patriyaan 1 point 6 7 6 metre door hain. Yaani 1,676 millimetre."),
    ], {"mode": "table", "digits": [0, 1, 6, 7, 6]}),
    scene([
        L("Dadi", "Let us put it in a place value table. 1 one, 6 tenths, 7 hundredths and 6 thousandths. The third place after the point is thousandths.",
          "Ise place value table mein rakhte hain. 1 one, 6 tenths, 7 hundredths aur 6 thousandths. Point ke baad teesri jagah thousandths ki hai."),
        L("Disha", "Each place is 10 times the place on its right, even after the point!", "Har jagah apne right wali jagah se 10 guna hai, point ke baad bhi!"),
    ], {"mode": "table", "digits": [0, 1, 6, 7, 6]}),
    scene([
        L("Deepak", "This rail piece is 23 point 0 7 metres long.", "Yeh rail ka tukda 23 point 0 7 metre lamba hai."),
        L("Harsh", "Why write the zero? Just say 23 point 7!", "Zero kyon likhna? Bas 23 point 7 bolo!"),
        L("Dadi", "No, Harsh! The zero keeps the 7 in the hundredths place. Without it, 7 hundredths becomes 7 tenths, ten times bigger.",
          "Nahi, Harsh! Zero 7 ko hundredths ki jagah par rakhti hai. Uske bina, 7 hundredths ban jaata hai 7 tenths, das guna bada."),
    ], {"mode": "table", "digits": [2, 3, 0, 7, 0]}),
    scene([
        L("Dadi", "See how 23 point 7 looks. The 7 has jumped into the tenths place. A different number!", "Dekho 23 point 7 kaisa dikhta hai. 7 kood kar tenths ki jagah aa gaya. Alag number!"),
    ], {"mode": "table", "digits": [2, 3, 7, 0, 0]}),
    scene([
        L("Disha", "Can every fraction become a decimal?", "Kya har fraction decimal ban sakta hai?"),
        L("Dadi", "Try to make the denominator 10, 100 or 1000. For 3 fifths, multiply top and bottom by 2. That gives 6 tenths, which is 0 point 6.",
          "Denominator ko 10, 100 ya 1000 banaane ki koshish karo. 3 bata 5 ke liye upar aur neeche dono ko 2 se guna karo. Milta hai 6 tenths, yaani 0 point 6."),
    ], {"mode": "fraction", "num": 3, "den": 5}),
    scene([
        L("Neha", "In my bakery, a quarter kilo of butter is 1 fourth. Multiply by 25, and it is 25 hundredths, 0 point 2 5 kilograms.",
          "Meri bakery mein paav kilo makkhan matlab 1 bata 4. 25 se guna karo, toh 25 hundredths, yaani 0 point 2 5 kilogram."),
    ], {"mode": "fraction", "num": 1, "den": 4}),
    scene([
        L("Deepak", "And 3 eighths? 8 times 125 is 1000. So 3 eighths is 375 thousandths, 0 point 3 7 5.",
          "Aur 3 bata 8? 8 guna 125 barabar 1000. Toh 3 bata 8 hai 375 thousandths, yaani 0 point 3 7 5."),
    ], {"mode": "fraction", "num": 3, "den": 8}),
    scene([
        L("Deepak", "Your turn! A signal post is 40 point 0 5 metres away. Build 40 point 0 5 in the place value table.",
          "Ab aapki baari! Ek signal khamba 40 point 0 5 metre door hai. Place value table mein 40 point 0 5 banao."),
    ], {"mode": "table", "digits": [0, 0, 0, 0, 0], "task": {"digits": [4, 0, 0, 5, 0], "label": "40.05"}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "Papa takes the family to the railway yard. A small engine moves along a track marked in kilometres.",
          "Papa parivaar ko railway yard le jaate hain. Ek chhota engine kilometre mein nishaan lage track par chalta hai."),
        L("Deepak", "Between every two kilometre stones there are 10 small marks. The engine is at 1 point 3 kilometres.",
          "Har do kilometre patharon ke beech 10 chhote nishaan hain. Engine 1 point 3 kilometre par hai."),
    ], {"mode": "line", "v": 130, "zoom": False}),
    scene([
        L("Disha", "Now it stopped between 1 point 3 and 1 point 4. Where exactly?", "Ab woh 1 point 3 aur 1 point 4 ke beech ruk gaya. Theek kahaan?"),
        L("Dadi", "Use a zoom lens. Cut the gap from 1 point 3 to 1 point 4 into 10 hundredths. The engine is 5 hundredths past 1 point 3, at 1 point 3 5.",
          "Zoom lens lagao. 1 point 3 se 1 point 4 tak ke gap ko 10 hundredths mein kaato. Engine 1 point 3 se 5 hundredths aage hai, yaani 1 point 3 5 par."),
    ], {"mode": "line", "v": 135, "zoom": True}),
    scene([
        L("Harsh", "Which is bigger, 0 point 5 or 0 point 4 5? 45 is bigger than 5, so 0 point 4 5 wins!", "Kaun bada hai, 0 point 5 ya 0 point 4 5? 45, 5 se bada hai, toh 0 point 4 5 jeeta!"),
        L("Dadi", "Line up the decimal points first. Both have 0 ones. In the tenths place, 5 is more than 4. So 0 point 5 is bigger.",
          "Pehle decimal points ek line mein rakho. Dono mein 0 ones hain. Tenths ki jagah 5, 4 se zyaada hai. Toh 0 point 5 bada hai."),
    ], {"mode": "compare", "a": 50, "b": 45}),
    scene([
        L("Disha", "Think of money! 0 point 5 0 rupees is 50 paise, and 0 point 4 5 rupees is only 45 paise.", "Paison ki tarah socho! 0 point 5 0 rupaye matlab 50 paise, aur 0 point 4 5 rupaye sirf 45 paise."),
    ], {"mode": "compare", "a": 50, "b": 45}),
    scene([
        L("Deepak", "Compare 1 point 9 and 1 point 0 9. The ones are equal. Tenths: 9 against 0. So 1 point 9 is bigger, by a lot.",
          "1 point 9 aur 1 point 0 9 compare karo. Ones barabar hain. Tenths: 9 aur 0. Toh 1 point 9 bada hai, kaafi zyaada."),
    ], {"mode": "compare", "a": 190, "b": 109}),
    scene([
        L("Harsh", "In Tokyo, Neeraj Chopra's first javelin throw was 87 point 0 3 metres. His second throw was 87 point 5 8 metres, and it won India the gold!",
          "Tokyo mein Neeraj Chopra ka pehla javelin throw 87 point 0 3 metre tha. Doosra throw 87 point 5 8 metre tha, aur usne Bharat ko gold dilaaya!"),
        L("Dadi", "Tens and ones are equal. The tenths decide: 5 is more than 0. So the second throw was longer.",
          "Tens aur ones barabar hain. Tenths faisla karte hain: 5, 0 se zyaada hai. Toh doosra throw lamba tha."),
    ], {"mode": "compare", "a": 8758, "b": 8703}),
    scene([
        L("Deepak", "Your turn! Turn on the zoom lens and park the engine at 2 point 2 7 kilometres.", "Ab aapki baari! Zoom lens chalu karo aur engine ko 2 point 2 7 kilometre par park karo."),
    ], {"mode": "line", "v": 100, "zoom": False, "task": {"v": 227}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "On Sunday evening, Mummy takes Harsh and Disha to the market with a shopping list.",
          "Itvaar shaam ko Mummy Harsh aur Disha ko shopping list ke saath bazaar le jaati hain."),
        L("Neha", "The shopkeeper says 250 paise. 100 paise make a rupee, so divide by 100. That is 2 rupees 50 paise, rupees 2 point 5 0.",
          "Dukaandaar kehta hai 250 paise. 100 paise ka ek rupaya, toh 100 se divide karo. Yeh hai 2 rupaye 50 paise, rupaye 2 point 5 0."),
    ], {"mode": "money", "small": 250}),
    scene([
        L("Disha", "The tailor measured me: 145 centimetres. 100 centimetres make a metre, so I am 1 point 4 5 metres tall!",
          "Darzi ne mujhe naapa: 145 centimetre. 100 centimetre ka ek metre, toh main 1 point 4 5 metre lambi hoon!"),
    ], {"mode": "length", "small": 145}),
    scene([
        L("Harsh", "Then 5 centimetres is 0 point 5 metres.", "Toh 5 centimetre matlab 0 point 5 metre."),
        L("Dadi", "Oh no! 0 point 5 metre is half a metre, 50 centimetres. 5 centimetres is 5 hundredths of a metre, 0 point 0 5. The point moves 2 places, so we need a zero.",
          "Arre nahi! 0 point 5 metre aadha metre hai, 50 centimetre. 5 centimetre ek metre ka 5 hundredths hai, yaani 0 point 0 5. Point 2 jagah khiskta hai, isliye zero chahiye."),
    ], {"mode": "length", "small": 5}),
    scene([
        L("Neha", "For my cakes I buy 1 kilogram and 250 grams of flour. 1000 grams make a kilogram, so it is 1 point 2 5 0 kilograms.",
          "Apne cakes ke liye main 1 kilogram aur 250 gram maida leti hoon. 1000 gram ka ek kilogram, toh yeh 1 point 2 5 0 kilogram hai."),
        L("Dadi", "With grams, divide by 1000. The point hops 3 places to the left.", "Gram ke saath 1000 se divide karo. Point 3 jagah left kood jaata hai."),
    ], {"mode": "weight", "small": 1250}),
    scene([
        L("Disha", "Half a kilo of sugar is 500 grams, so 0 point 5 kilograms.", "Aadha kilo cheeni matlab 500 gram, toh 0 point 5 kilogram."),
    ], {"mode": "weight", "small": 500}),
    scene([
        L("Neha", "And this small pack of cardamom is 75 grams. That is only 0 point 0 7 5 kilograms.", "Aur yeh elaichi ka chhota packet 75 gram hai. Yeh sirf 0 point 0 7 5 kilogram hai."),
    ], {"mode": "weight", "small": 75}),
    scene([
        L("Neha", "Your turn! The bag of rice must weigh 2 point 3 5 kilograms. How many grams is that? Set it.",
          "Ab aapki baari! Chaawal ka thaila 2 point 3 5 kilogram ka hona chahiye. Yeh kitne gram hain? Set karo."),
    ], {"mode": "weight", "small": 1000, "task": {"small": 2350, "mode": "weight"}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "It is Diwali week, and the family goes shopping. Disha buys diyas for 45 rupees 50 paise and a rangoli kit for 28 rupees 75 paise.",
          "Diwali ka hafta hai, aur parivaar shopping karne jaata hai. Disha 45 rupaye 50 paise ke diye aur 28 rupaye 75 paise ki rangoli kit khareedti hai."),
        L("Dadi", "To add, write the numbers so the decimal points stand in one straight line. Then add from the right, like whole numbers.",
          "Jodne ke liye numbers aise likho ki decimal points ek seedhi line mein khade hon. Phir right se jodo, whole numbers ki tarah."),
    ], {"op": "add", "a": 4550, "b": 2875}),
    scene([
        L("Disha", "Hundredths: 0 plus 5 is 5. Tenths: 5 plus 7 is 12, write 2, carry 1. Ones: 5 plus 8 plus 1 is 14, write 4, carry 1. Tens: 4 plus 2 plus 1 is 7.",
          "Hundredths: 0 plus 5 barabar 5. Tenths: 5 plus 7 barabar 12, 2 likho, 1 carry. Ones: 5 plus 8 plus 1 barabar 14, 4 likho, 1 carry. Tens: 4 plus 2 plus 1 barabar 7."),
        L("Neha", "So the total is 74 rupees 25 paise.", "Toh kul 74 rupaye 25 paise."),
    ], {"op": "add", "a": 4550, "b": 2875}),
    scene([
        L("Harsh", "2 point 5 plus 1 point 2 5. I add 25 and 125, so 1 point 5 0!", "2 point 5 plus 1 point 2 5. Main 25 aur 125 jodta hoon, toh 1 point 5 0!"),
        L("Dadi", "Harsh, the answer cannot be smaller than 2 point 5! Write 2 point 5 as 2 point 5 0, line up the points, and the sum is 3 point 7 5.",
          "Harsh, jawaab 2 point 5 se chhota nahi ho sakta! 2 point 5 ko 2 point 5 0 likho, points ek line mein rakho, toh jod 3 point 7 5 hai."),
    ], {"op": "add", "a": 250, "b": 125}),
    scene([
        L("Deepak", "On my train route, one stretch is 3 point 6 kilometres and the next is 1 point 8 5 kilometres. Together, 5 point 4 5 kilometres.",
          "Mere train route par ek hissa 3 point 6 kilometre hai aur agla 1 point 8 5 kilometre. Milakar 5 point 4 5 kilometre."),
    ], {"op": "add", "a": 360, "b": 185}),
    scene([
        L("Disha", "I paid with a 50 rupee note for the rangoli kit of 28 rupees 75 paise. How much change?", "Maine rangoli kit ke 28 rupaye 75 paise ke liye 50 rupaye ka note diya. Kitne paise waapas?"),
        L("Dadi", "Write 50 as 50 point 0 0 and subtract, borrowing as usual. 50 minus 28 point 7 5 is 21 point 2 5. So 21 rupees 25 paise.",
          "50 ko 50 point 0 0 likho aur ghataao, hamesha ki tarah udhaar lekar. 50 minus 28 point 7 5 barabar 21 point 2 5. Toh 21 rupaye 25 paise."),
    ], {"op": "sub", "a": 5000, "b": 2875}),
    scene([
        L("Neha", "I had 5 point 2 kilograms of flour and used 3 point 4 5 kilograms for Diwali sweets. 5 point 2 0 minus 3 point 4 5 is 1 point 7 5 kilograms left.",
          "Mere paas 5 point 2 kilogram maida tha aur maine Diwali ki mithaai mein 3 point 4 5 kilogram lagaaya. 5 point 2 0 minus 3 point 4 5 barabar 1 point 7 5 kilogram bacha."),
    ], {"op": "sub", "a": 520, "b": 345}),
    scene([
        L("Dadi", "Your turn! Pick two different gifts whose prices add up to exactly 10 rupees.", "Ab aapki baari! Do alag tohfe chuno jinki keemat milkar theek 10 rupaye ho."),
    ], {"op": "add", "a": 300, "b": 450, "task": {"r": 1000, "op": "add"}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "After Diwali, Dadi sets a decimals quiz at the dining table.", "Diwali ke baad, Dadi dining table par decimals ka quiz rakhti hain."),
        L("Dadi", "Question 1. Write 3 fifths as a decimal.", "Sawaal 1. 3 bata 5 ko decimal mein likho."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "5 times 2 is 10, so 3 fifths is 6 tenths. That is 0 point 6!", "5 guna 2 barabar 10, toh 3 bata 5 barabar 6 tenths. Yeh 0 point 6 hai!"),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. Which is greater, 0 point 7 or 0 point 6 8?", "Sawaal 2. Kaun bada hai, 0 point 7 ya 0 point 6 8?"),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "Write 0 point 7 as 0 point 7 0. Tenths: 7 is more than 6. So 0 point 7 is greater, even though 68 looks bigger!",
          "0 point 7 ko 0 point 7 0 likho. Tenths: 7, 6 se zyaada hai. Toh 0 point 7 bada hai, chahe 68 bada dikhe!"),
        L("Dadi", "Shabash, Harsh. You learnt from your mistake.", "Shabash, Harsh. Tumne apni galti se seekha."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _grid_svg(h):
    """h hundredths shaded on a 10 by 10 grid (full columns are tenths)."""
    parts = ['<svg viewBox="0 0 220 220" width="220" height="220" xmlns="http://www.w3.org/2000/svg">']
    for i in range(100):
        col, row = divmod(i, 10)
        fill = "#fbbf24" if col < h // 10 else ("#f472b6" if i < h else "#0f172a")
        parts.append(f'<rect x="{10 + col * 20}" y="{10 + row * 20}" width="19" height="19" fill="{fill}" stroke="#334155"/>')
    parts.append("</svg>")
    return "".join(parts)


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Disha's Ruler · Tenths and the Decimal Point",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On the first day of school, Harsh's pencil ends between 4 cm and 5 cm. Dadi shows that every centimetre hides 10 millimetres, and that is how tenths and the decimal point are born.</div>

<h2>Tenths</h2>
<p>Cut one whole into <strong>10 equal parts</strong>. Each part is <strong>one tenth</strong>: 1/10 = 0.1 (read "zero point one").</p>
<div {FORMULA}>1/10 = 0.1   ·   7/10 = 0.7   ·   10/10 = 1   ·   23/10 = 2.3</div>
<div {CARD}>
  <div>The <strong>decimal point</strong> separates the whole part (left) from the parts smaller than one (right).</div>
  <div>1 mm = 1/10 cm = 0.1 cm, so 4 cm 7 mm = 4.7 cm.</div>
  <div>10 tenths make 1 one, just as 10 ones make 1 ten.</div>
</div>

<h2>Reading decimals</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Decimal</th><th class="text-left">Ones and tenths</th><th class="text-left">Fraction</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>0.7</td><td>0 ones, 7 tenths</td><td>7/10</td></tr>
    <tr><td>2.3</td><td>2 ones, 3 tenths</td><td>23/10 = 2 3/10</td></tr>
    <tr><td>4.7</td><td>4 ones, 7 tenths</td><td>47/10 = 4 7/10</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div><strong class="text-red-300">Not every dot is a decimal point.</strong> A cricket score of 4.3 overs means 4 overs and 3 balls (an over has 6 balls), not 4 and 3 tenths.</div>
</div>
""",
        "keyInsight": "A decimal is a fraction with denominator 10 (or 100, 1000…) written using a point: 4.7 means 4 ones and 7 tenths.",
        "widgetType": "Class6DecimalTenthsWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "A ribbon is 8 cm 3 mm long. Its length in centimetres is:",
            "options": ["83 cm", "8.3 cm", "0.83 cm", "8.03 cm"],
            "correctIndex": 1,
            "explanation": "3 mm = 3/10 cm = 0.3 cm, so 8 cm 3 mm = 8.3 cm.",
        },
        "teacherNotes": teacher(
            [
                "Start with real rulers: measure pencils that end between two centimetre marks.",
                "Use paper strips folded into 10 to show tenths; colour some and write both 7/10 and 0.7.",
                "Read decimals digit by digit after the point ('two point three'), never 'two point twenty-three' style for longer decimals.",
            ],
            [
                "Writing 4 cm 7 mm as 4.07 cm or 47 cm.",
                "Thinking the digits after the point are a separate whole number.",
                "Treating cricket overs (4.3) as decimals.",
            ],
            "Measure and record: each pair measures 5 objects in cm and mm, then writes each length as a decimal of a centimetre.",
            "Old NCERT Ch. 8 Decimals (8.1–8.2 tenths); Ganita Prakash: measurement with fractional units (bridge to Class 7 'A Peek Beyond the Point').",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Mummy's Cash Box · Hundredths, Rupees and Paise",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Mummy empties the bakery cash box. Dadi brings a square of 100 small squares, and the family sees that a paisa is a hundredth of a rupee.</div>

<h2>Hundredths</h2>
<p>Cut each tenth into 10 equal parts again: the whole now has <strong>100 equal parts</strong>. One part is <strong>one hundredth</strong>: 1/100 = 0.01.</p>
<div {FORMULA}>1/100 = 0.01   ·   35/100 = 0.35 = 3 tenths + 5 hundredths</div>
<div {CARD}>
  <div>The 1st place after the point is <strong>tenths</strong>, the 2nd place is <strong>hundredths</strong>.</div>
  <div>0.5 = 0.50 = 50/100: zeros at the <em>end</em> after the point do not change the value.</div>
</div>

<h2>Money</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Money</th><th class="text-left">In paise</th><th class="text-left">In rupees</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>50 paise</td><td>50</td><td>₹0.50</td></tr>
    <tr><td>2 rupees 75 paise</td><td>275</td><td>₹2.75</td></tr>
    <tr><td>7 rupees 5 paise</td><td>705</td><td>₹7.05</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div><strong>History:</strong> from 1 April 1957, the Indian rupee was divided into 100 paise (earlier it was 16 annas). Since then our money has been decimal.</div>
</div>
""",
        "keyInsight": "One hundredth is a tenth cut into 10 again; 100 paise make a rupee, so paise are hundredths of a rupee.",
        "widgetType": "Class6DecimalGridWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "Write 6 rupees 8 paise in rupees.",
            "options": ["₹6.8", "₹6.80", "₹6.08", "₹68"],
            "correctIndex": 2,
            "explanation": "8 paise = 8/100 rupee = ₹0.08, so the amount is ₹6.08. (₹6.80 would be 6 rupees 80 paise.)",
        },
        "teacherNotes": teacher(
            [
                "Use 10 by 10 grid paper; shade whole columns (tenths) in one colour and single squares (hundredths) in another.",
                "Connect to money students handle every day: 100 paise = ₹1.",
                "Show 0.5 and 0.50 shading the same half of the grid.",
            ],
            [
                "Writing 8 paise as ₹0.8.",
                "Believing 0.50 is bigger than 0.5 because 50 > 5.",
                "Reading 0.35 as 'zero point thirty-five' and losing the place values.",
            ],
            "Shop counter: students get price tags in paise (305, 50, 1250) and must write them in rupees, then shade one on a grid.",
            "Old NCERT Ch. 8 (8.3 hundredths, 8.6 money); Ganita Prakash: fractional units of 10 and 100.",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Papa's Railway Notebook · Place Value and Fractions as Decimals",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Papa's notebook is full of track measurements. The family puts them in a place value table, learns why a zero can matter, and turns fractions into decimals.</div>

<h2>The place value table</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>Tens</th><th>Ones</th><th>.</th><th>Tenths</th><th>Hundredths</th><th>Thousandths</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td>10</td><td>1</td><td>.</td><td>1/10</td><td>1/100</td><td>1/1000</td></tr>
    <tr><td></td><td>1</td><td>.</td><td>6</td><td>7</td><td>6</td></tr>
    <tr><td>2</td><td>3</td><td>.</td><td>0</td><td>7</td><td></td></tr>
  </tbody>
</table>
<div {FORMULA}>23.07 = 2 × 10 + 3 × 1 + 0 × 1/10 + 7 × 1/100</div>
<div {CARD}>
  <div>Each place is <strong>10 times</strong> the place to its right, on both sides of the point.</div>
  <div>Broad gauge rails in India are 1,676 mm apart = 1.676 m (1 one, 6 tenths, 7 hundredths, 6 thousandths).</div>
  <div>A zero <em>inside</em> a decimal holds a place: 23.07 ≠ 23.7.</div>
</div>

<h2>Fractions to decimals</h2>
<p>Make the denominator 10, 100 or 1000 with an equivalent fraction, then read the decimal.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Fraction</th><th class="text-left">Working</th><th>Decimal</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>3/5</td><td>(3 × 2)/(5 × 2) = 6/10</td><td class="text-center">0.6</td></tr>
    <tr><td>1/4</td><td>(1 × 25)/(4 × 25) = 25/100</td><td class="text-center">0.25</td></tr>
    <tr><td>3/8</td><td>(3 × 125)/(8 × 125) = 375/1000</td><td class="text-center">0.375</td></tr>
    <tr><td>0.4 → fraction</td><td>4/10, simplify by 2</td><td class="text-center">2/5</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "Place value continues past the point: tenths, hundredths, thousandths, each one tenth of the place on its left.",
        "widgetType": "Class6DecimalPlaceValueWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "In 52.638, which digit is in the hundredths place?",
            "options": ["6", "3", "8", "2"],
            "correctIndex": 1,
            "explanation": "After the point: 6 is tenths, 3 is hundredths, 8 is thousandths.",
        },
        "teacherNotes": teacher(
            [
                "Draw the place value table with the point as its own column so it never moves.",
                "Use expanded form both ways: from table to sum and from sum back to decimal.",
                "For fractions, only use denominators that divide 10, 100 or 1000 at this level.",
            ],
            [
                "Dropping the placeholder zero (23.07 written as 23.7).",
                "Calling the first place after the point 'oneths' or 'tens'.",
                "Writing 1/4 as 0.4 (copying the denominator).",
            ],
            "Place value cards: students hold digit cards and one holds the point; the class calls a decimal and they arrange themselves.",
            "Old NCERT Ch. 8 (8.2–8.3 place value, decimals as fractions); Ganita Prakash: decimal place value as an extension of the Indian place value system.",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: The Railway Yard · Number Line and Comparing Decimals",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>An engine creeps along a track marked in kilometres. A zoom lens shows the hundredths hidden inside each tenth, and Neeraj Chopra's Olympic throw settles an argument about which decimal is bigger.</div>

<h2>Decimals on the number line</h2>
<p>Split each unit into 10 equal parts to mark tenths. Zoom into one tenth and split it into 10 again to mark hundredths: 1.35 lies halfway between 1.3 and 1.4.</p>

<h2>Comparing decimals</h2>
<ol>
  <li>Line up the decimal points (add zeros at the end if you like: 0.5 = 0.50).</li>
  <li>Compare the whole parts first.</li>
  <li>If equal, compare tenths, then hundredths, then thousandths. The first place that differs decides.</li>
</ol>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Pair</th><th class="text-left">Deciding place</th><th>Result</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>0.5 and 0.45</td><td>tenths: 5 &gt; 4</td><td class="text-center">0.5 &gt; 0.45</td></tr>
    <tr><td>1.9 and 1.09</td><td>tenths: 9 &gt; 0</td><td class="text-center">1.9 &gt; 1.09</td></tr>
    <tr><td>87.58 and 87.03</td><td>tenths: 5 &gt; 0</td><td class="text-center">87.58 &gt; 87.03</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>Neeraj Chopra won India's Olympic javelin gold at Tokyo 2020 with a throw of <strong>87.58 m</strong> (his second throw; his first was 87.03 m).</div>
  <div><strong class="text-red-300">More digits does not mean bigger:</strong> 0.45 has more digits than 0.5 but is smaller.</div>
</div>
""",
        "keyInsight": "To compare decimals, line up the points and compare place by place from the left; the first different digit decides.",
        "widgetType": "Class6DecimalLineWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Which list is in increasing order?",
            "options": ["0.3, 0.25, 0.4", "0.25, 0.3, 0.4", "0.4, 0.3, 0.25", "0.3, 0.4, 0.25"],
            "correctIndex": 1,
            "explanation": "As hundredths: 0.25, 0.30, 0.40. So 0.25 < 0.3 < 0.4.",
        },
        "teacherNotes": teacher(
            [
                "Draw a long number line 0 to 2 on the floor; mark tenths, then zoom into one tenth on a separate strip.",
                "Always ask: 'Is it nearer the smaller tenth or the bigger one?'",
                "Use money to check comparisons: ₹0.50 vs ₹0.45.",
            ],
            [
                "Thinking 0.45 > 0.5 because 45 > 5.",
                "Thinking 1.09 > 1.9 because it is 'longer'.",
                "Placing 1.35 between 1 and 1.3.",
            ],
            "Decimal line-up: give 8 students cards (0.5, 0.45, 0.05, 1.2, 1.02, 0.9, 0.09, 1.25); they arrange themselves in order and explain one swap.",
            "Old NCERT Ch. 8 (8.4 number line, 8.5 comparing decimals); Ganita Prakash: number line with fractional units.",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: The Market · Money, Length and Weight",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>At the market, prices come in paise, the tailor measures in centimetres and the grocer weighs in grams. The family turns them all into rupees, metres and kilograms.</div>

<h2>Small unit to big unit</h2>
<div {FORMULA}>paise ÷ 100 = rupees   ·   cm ÷ 100 = m   ·   g ÷ 1000 = kg</div>
<p>Dividing by 100 moves the decimal point <strong>2 places left</strong>; dividing by 1000 moves it <strong>3 places left</strong>.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Measure</th><th class="text-left">Working</th><th>Answer</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>250 paise</td><td>250 ÷ 100</td><td class="text-center">₹2.50</td></tr>
    <tr><td>145 cm</td><td>145 ÷ 100</td><td class="text-center">1.45 m</td></tr>
    <tr><td>5 cm</td><td>5 ÷ 100</td><td class="text-center">0.05 m</td></tr>
    <tr><td>1 kg 250 g = 1250 g</td><td>1250 ÷ 1000</td><td class="text-center">1.250 kg = 1.25 kg</td></tr>
    <tr><td>75 g</td><td>75 ÷ 1000</td><td class="text-center">0.075 kg</td></tr>
    <tr><td>2 km 45 m = 2045 m</td><td>2045 ÷ 1000</td><td class="text-center">2.045 km</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>Going back: multiply. 2.35 kg × 1000 = 2350 g; 1.6 m × 100 = 160 cm.</div>
  <div>Count the places! 5 cm is 0.05 m, not 0.5 m (that is 50 cm).</div>
</div>
""",
        "keyInsight": "Measurement units go in 10s, 100s and 1000s, so changing units just moves the decimal point.",
        "widgetType": "Class6DecimalUnitsWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "Write 3 kg 40 g in kilograms.",
            "options": ["3.4 kg", "3.04 kg", "3.040 kg", "3.400 kg"],
            "correctIndex": 2,
            "explanation": "3 kg 40 g = 3040 g = 3040 ÷ 1000 = 3.040 kg (also written 3.04 kg).",
        },
        "teacherNotes": teacher(
            [
                "Bring a kitchen scale and a measuring tape; record readings in small units, then convert.",
                "Show the hop of the point with digit cards: 1250 → 1.250.",
                "Always state how many small units make one big unit before converting.",
            ],
            [
                "Writing 40 g as 0.40 kg or 0.4 kg (only 2 places instead of 3).",
                "Writing 5 cm as 0.5 m.",
                "Multiplying when converting small units to big units.",
            ],
            "Market list: students get a grocery list in g, cm and paise and rewrite it in kg, m and rupees, then check a partner's list.",
            "Old NCERT Ch. 8 (8.6 using decimals: money, length, weight); Ganita Prakash: measurement contexts with units.",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Diwali Shopping · Adding and Subtracting Decimals",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>During Diwali week the family adds bills, works out change and checks how much flour is left. Harsh learns to keep the decimal points in one line.</div>

<h2>The one rule</h2>
<div {FORMULA}>Line up the decimal points, fill empty places with 0, then add or subtract as with whole numbers.</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Sum or difference</th><th class="text-left">Lined up</th><th>Answer</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>₹45.50 + ₹28.75</td><td>45.50 + 28.75</td><td class="text-center">₹74.25</td></tr>
    <tr><td>2.5 + 1.25</td><td>2.50 + 1.25</td><td class="text-center">3.75</td></tr>
    <tr><td>3.6 km + 1.85 km</td><td>3.60 + 1.85</td><td class="text-center">5.45 km</td></tr>
    <tr><td>₹50 − ₹28.75</td><td>50.00 − 28.75</td><td class="text-center">₹21.25</td></tr>
    <tr><td>5.2 kg − 3.45 kg</td><td>5.20 − 3.45</td><td class="text-center">1.75 kg</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>Carrying and borrowing work exactly as for whole numbers: 10 hundredths = 1 tenth, 10 tenths = 1 one.</div>
  <div>Check with a rough estimate: 45.50 + 28.75 is about 46 + 29 = 75.</div>
  <div><strong class="text-red-300">Never line up the last digits</strong> of 2.5 and 1.25: that adds tenths to hundredths.</div>
</div>
""",
        "keyInsight": "Add and subtract decimals like whole numbers once the decimal points are lined up and empty places are filled with zeros.",
        "widgetType": "Class6DecimalAddWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Harsh has ₹100. He buys a bat grip for ₹37.60. How much is left?",
            "options": ["₹63.40", "₹62.40", "₹73.60", "₹62.60"],
            "correctIndex": 1,
            "explanation": "100.00 − 37.60 = 62.40. Check: 62.40 + 37.60 = 100.00.",
        },
        "teacherNotes": teacher(
            [
                "Insist on squared paper with one digit per box and the point on a line.",
                "Estimate first, then calculate, then compare with the estimate.",
                "Check subtraction by adding the answer back.",
            ],
            [
                "Right-aligning the digits instead of the points (2.5 + 1.25 = 1.50).",
                "Forgetting the point in the answer.",
                "Not writing 50 as 50.00 before subtracting a decimal.",
            ],
            "Diwali shop: price cards for 6 items; pairs pick a budget (₹100), choose items, add the bill and work out the change.",
            "Old NCERT Ch. 8 (8.7 addition, 8.8 subtraction of decimals); Ganita Prakash: operations on measurements (bridge to Class 7 'A Peek Beyond the Point').",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>After Diwali, Dadi sets a decimals quiz at the dining table. Harsh answers fast; Disha answers carefully.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Place value: tenths, hundredths, thousandths after the point.</li>
  <li>Fraction → decimal: make the denominator 10, 100 or 1000.</li>
  <li>Compare: line up the points; the first different digit from the left decides.</li>
  <li>Units: ÷ 100 for paise → ₹ and cm → m, ÷ 1000 for g → kg and m → km.</li>
  <li>Add or subtract: line up the points, fill with zeros.</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Almost every decimal question starts with one move: keep the decimal points lined up.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Fraction to decimal",
                    "question": "Write 3/5 as a decimal.",
                    "steps": [
                        "5 × 2 = 10, so multiply top and bottom by 2",
                        "3/5 = 6/10",
                        "6 tenths = <strong>0.6</strong>",
                    ],
                    "answer": "0.6",
                    "figureSvg": _grid_svg(60),
                },
                {
                    "title": "Comparing decimals",
                    "question": "Which is greater, 0.7 or 0.68?",
                    "steps": [
                        "Line up the points: 0.70 and 0.68",
                        "Ones are equal (0). Tenths: 7 &gt; 6",
                        "So <strong>0.7 &gt; 0.68</strong>",
                    ],
                    "answer": "0.7",
                },
                {
                    "title": "Place value",
                    "question": "Write as a decimal: 5 tens, 3 ones and 4 hundredths.",
                    "steps": [
                        "Tens 5, ones 3, tenths 0 (none given), hundredths 4",
                        "The empty tenths place gets a 0",
                        "= <strong>53.04</strong>",
                    ],
                    "answer": "53.04",
                },
                {
                    "title": "Grams to kilograms",
                    "question": "Write 2 kg 45 g in kilograms.",
                    "steps": [
                        "2 kg 45 g = 2000 g + 45 g = 2045 g",
                        "2045 ÷ 1000: the point moves 3 places left",
                        "= <strong>2.045 kg</strong>",
                    ],
                    "answer": "2.045 kg",
                },
                {
                    "title": "Paise to rupees",
                    "question": "Write 7 rupees 5 paise in rupees.",
                    "steps": [
                        "5 paise = 5/100 rupee = ₹0.05",
                        "7 + 0.05",
                        "= <strong>₹7.05</strong> (not ₹7.5, which is 7 rupees 50 paise)",
                    ],
                    "answer": "₹7.05",
                },
                {
                    "title": "Centimetres to metres",
                    "question": "Disha's kite string piece is 375 cm. Write it in metres.",
                    "steps": [
                        "100 cm = 1 m, so divide by 100",
                        "375 ÷ 100: the point moves 2 places left",
                        "= <strong>3.75 m</strong>",
                    ],
                    "answer": "3.75 m",
                },
                {
                    "title": "Adding three decimals",
                    "question": "Add 12.5 + 3.78 + 0.6.",
                    "steps": [
                        "Fill with zeros: 12.50 + 3.78 + 0.60",
                        "12.50 + 3.78 = 16.28",
                        "16.28 + 0.60 = <strong>16.88</strong>",
                    ],
                    "answer": "16.88",
                },
                {
                    "title": "Subtracting from a whole number",
                    "question": "Find 10 − 3.47.",
                    "steps": [
                        "Write 10 as 10.00",
                        "10.00 − 3.47: borrow across the zeros",
                        "= <strong>6.53</strong>   (check: 6.53 + 3.47 = 10.00)",
                    ],
                    "answer": "6.53",
                },
                {
                    "title": "Shopping and change",
                    "question": "Disha buys a notebook for ₹35.75 and a pen for ₹12.50. She pays ₹50. How much change does she get?",
                    "steps": [
                        "Total: 35.75 + 12.50 = ₹48.25",
                        "Change: 50.00 − 48.25",
                        "= <strong>₹1.75</strong>",
                    ],
                    "answer": "₹1.75",
                },
                {
                    "title": "Ordering decimals",
                    "question": "Arrange in increasing order: 0.5, 0.05, 0.55, 5.0, 0.505.",
                    "steps": [
                        "Write all with 3 places: 0.500, 0.050, 0.550, 5.000, 0.505",
                        "Compare as thousandths: 50 &lt; 500 &lt; 505 &lt; 550 &lt; 5000",
                        "<strong>0.05 &lt; 0.5 &lt; 0.505 &lt; 0.55 &lt; 5.0</strong>",
                    ],
                    "answer": "0.05, 0.5, 0.505, 0.55, 5.0",
                },
            ],
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            ["Let students attempt each question before revealing steps; ask them to estimate the answer first."],
            ["Q3 and Q5 test placeholder zeros; Q4 needs three places for grams; Q8 needs borrowing across zeros."],
            "Pair quiz: one student reads a question, the other solves aloud, then they swap.",
            "Covers old NCERT Ch. 8 Exercises 8.1–8.6 and Ganita Prakash measurement-based decimal tasks.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Decimals (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From Disha's ruler to Diwali shopping, you have read, compared, converted, added and subtracted decimals. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering tenths, hundredths, place value, fractions as decimals, comparing, the number line, units and addition and subtraction.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Line up the points, respect the places, and decimals behave just like whole numbers.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Decimals · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "7/10 written as a decimal is:", "options": ["7.10", "0.07", "0.7", "70"], "answer": 2, "explanation": "7 tenths = 0.7.", "topic": "Tenths"},
                {"q": "In 45.38, the digit 8 is in the:", "options": ["tenths place", "hundredths place", "ones place", "thousandths place"], "answer": 1, "explanation": "After the point: 3 is tenths, 8 is hundredths.", "topic": "Place value"},
                {"q": "0.4 as a fraction in simplest form is:", "options": ["4/100", "2/5", "1/4", "4/1"], "answer": 1, "explanation": "0.4 = 4/10 = 2/5 (divide top and bottom by 2).", "topic": "Decimals as fractions"},
                {"q": "Which is the greatest?", "options": ["0.9", "0.89", "0.099", "0.809"], "answer": 0, "explanation": "As thousandths: 900, 890, 99, 809. The greatest is 0.9.", "topic": "Comparing decimals"},
                {"q": "3 cm 4 mm written in centimetres is:", "options": ["3.04 cm", "34 cm", "3.4 cm", "0.34 cm"], "answer": 2, "explanation": "4 mm = 0.4 cm, so 3 cm 4 mm = 3.4 cm.", "topic": "Length"},
                {"q": "650 g written in kilograms is:", "options": ["6.5 kg", "0.65 kg", "0.065 kg", "65 kg"], "answer": 1, "explanation": "650 ÷ 1000 = 0.650 = 0.65 kg.", "topic": "Weight"},
                {"q": "5 rupees and 5 paise is:", "options": ["₹5.5", "₹5.05", "₹5.005", "₹55"], "answer": 1, "explanation": "5 paise = ₹0.05, so ₹5.05.", "topic": "Money"},
                {"q": "4.6 + 2.75 = ?", "options": ["6.81", "7.35", "7.21", "6.35"], "answer": 1, "explanation": "4.60 + 2.75 = 7.35. Line up the points first.", "topic": "Adding decimals"},
                {"q": "8 − 2.65 = ?", "options": ["6.35", "5.35", "6.65", "5.45"], "answer": 1, "explanation": "8.00 − 2.65 = 5.35. Check: 5.35 + 2.65 = 8.00.", "topic": "Subtracting decimals"},
                {"q": "Which number lies between 1.2 and 1.3 on the number line?", "options": ["1.25", "1.03", "1.32", "12.5"], "answer": 0, "explanation": "1.2 = 1.20 and 1.3 = 1.30, and 1.25 is between them.", "topic": "Number line"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q4 catches 'more digits means bigger'; Q7 catches ₹5.5 for 5 paise; Q8 and Q9 need lined-up points."],
            "Exit ticket: write 1 kg 75 g in kg, and find ₹20 − ₹13.45.",
            "Matches old NCERT Ch. 8 Decimals learning outcomes and Ganita Prakash measurement goals.",
        ),
    },
]


def seed_class6_decimals():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Decimals")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Decimals: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Decimals: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_decimals()
