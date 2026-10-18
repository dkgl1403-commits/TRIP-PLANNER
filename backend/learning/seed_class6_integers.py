import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Integers: The Other Side of Zero (Ganita Prakash 2024 ch. 10 "The Other Side of Zero" + old NCERT
# ch. 6 "Integers"). Story: the Jaipur family: Dadi, Harsh, Disha, Papa Deepak and Mummy Neha.
# Every part is a list of scenes; each scene is a short dialogue and its `visual` drives the widget animation.
#
# Facts used (checked with a web search, Oct 2026):
#  - Leh recorded a minimum of about -14.4 °C and Drass about -24.6 °C in January 2026 (All India Radio News,
#    newsonair.gov.in, 9 Jan 2026). Drass is usually the coldest place in Ladakh.
#  - Kuttanad (Kerala): farming is done about 1.2 to 3 m below sea level; Kerala Tourism gives its lowest point
#    as 2.2 m below sea level. We say "about 2 metres below sea level".
#  - Jaipur's May afternoons are typically about 40 °C (May is its hottest month).
#  - Brahmagupta wrote the Brahmasphutasiddhanta in 628 CE at Bhillamala (today's Bhinmal, Rajasthan), giving rules
#    for "fortunes" (positive numbers) and "debts" (negative numbers).
#  - Ganita Prakash uses a lift in "Bela's Building of Fun" and a token model with red (+1) and green (-1) tokens.


SCENES_1 = [
    scene([
        L("Narrator", "It is the winter holidays. Papa has work in Leh, high up in the mountains of Ladakh, and the whole family has come along. Disha's breath makes little clouds in the cold air.",
          "Sardiyon ki chhuttiyan hain. Papa ko Ladakh ke pahadon mein Leh mein kaam hai, aur poora parivaar saath aaya hai. Thandi hawa mein Disha ki saans chhote chhote baadal bana rahi hai."),
        L("Dadi", "Look at my thermometer, beta. Back home in Jaipur, on a hot May afternoon, this red line climbs to about 40 degrees!",
          "Mera thermometer dekho, beta. Ghar par Jaipur mein, May ki garam dopahar mein, yeh laal line lagbhag 40 degree tak chadh jaati hai!"),
    ], {"mode": "thermo", "temp": 40, "label": "Jaipur, a hot May afternoon"}),
    scene([
        L("Harsh", "And what does it say here in Leh?", "Aur yahan Leh mein kya bata raha hai?"),
        L("Deepak", "Watch it fall. 30, 20, 10, and now it has stopped at zero. At zero degrees, water begins to freeze into ice.",
          "Ise girte dekho. 30, 20, 10, aur ab yeh zero par ruk gaya. Zero degree par paani jamkar barf banne lagta hai."),
    ], {"mode": "thermo", "temp": 0, "label": "Leh, early evening"}),
    scene([
        L("Disha", "But it is still going down! What number comes after zero when it gets even colder?",
          "Lekin yeh toh abhi bhi neeche ja raha hai! Aur thand badhe toh zero ke baad kaunsa number aata hai?"),
        L("Dadi", "The numbers on the other side of zero! One degree colder than zero is minus 1, and on cold January nights Leh drops to about minus 14 degrees. We write it with a small minus sign in front.",
          "Zero ke doosri taraf ke numbers! Zero se ek degree zyada thanda hai minus 1, aur January ki thandi raaton mein Leh lagbhag minus 14 degree tak gir jaata hai. Ise hum aage chhota sa minus sign lagaakar likhte hain."),
    ], {"mode": "thermo", "temp": -14, "label": "Leh, a January night", "pins": [{"label": "Leh", "t": -14}]}),
    scene([
        L("Deepak", "And Drass, on the road to Kargil, is even colder. In January 2026, it went down to about minus 25 degrees!",
          "Aur Kargil ke raaste par Drass toh aur bhi thanda hai. January 2026 mein wahan temperature lagbhag minus 25 degree tak gir gaya tha!"),
        L("Harsh", "Brrr! Even my cricket bat would freeze there!", "Brrr! Wahan toh mera cricket bat bhi jam jaayega!"),
    ], {"mode": "thermo", "temp": -25, "label": "Drass, January 2026", "pins": [{"label": "Leh", "t": -14}, {"label": "Drass", "t": -25}]}),
    scene([
        L("Disha", "So minus 25 is colder than minus 14?", "Matlab minus 25, minus 14 se zyada thanda hai?"),
        L("Dadi", "Yes, 25 degrees below zero is further down than 14 degrees below zero. Numbers below zero are called negative numbers, and numbers above zero are positive numbers. Zero itself is neither positive nor negative.",
          "Haan, zero se 25 degree neeche, zero se 14 degree neeche se zyada neeche hai. Zero se neeche ke numbers ko negative numbers kehte hain, aur zero se upar wale positive numbers hain. Zero khud na positive hai, na negative."),
    ], {"mode": "thermo", "temp": -25, "label": "Drass, January 2026", "pins": [{"label": "Leh", "t": -14}, {"label": "Drass", "t": -25}]}),
    scene([
        L("Neha", "Negative numbers are not only for the cold. My cousin lives in Kuttanad in Kerala. Farmers there grow rice in fields that lie below sea level!",
          "Negative numbers sirf thand ke liye nahi hain. Meri cousin Kerala ke Kuttanad mein rehti hai. Wahan kisaan aise kheton mein chawal ugaate hain jo samudra tal se neeche hain!"),
        L("Dadi", "We measure heights from sea level, and sea level is our zero. Kuttanad's fields are about 2 metres below sea level, so their height is minus 2 metres. Mud walls called bunds keep the water out.",
          "Hum oonchaai samudra tal se naapte hain, aur samudra tal hamara zero hai. Kuttanad ke khet samudra tal se lagbhag 2 metre neeche hain, isliye unki oonchaai minus 2 metre hai. Mitti ki deewarein, jinhe bund kehte hain, paani ko bahar rokti hain."),
    ], {"mode": "sea", "spot": "field"}),
    scene([
        L("Disha", "So the bird flying 8 metres above the water is at plus 8 metres, and the fish swimming 6 metres under the water is at minus 6 metres!",
          "Toh paani se 8 metre upar udti chidiya plus 8 metre par hai, aur paani ke 6 metre neeche tairti machhli minus 6 metre par!"),
        L("Dadi", "Shabash! Above zero is positive, below zero is negative, and the boat floating at sea level is at zero.",
          "Shabash! Zero se upar positive, zero se neeche negative, aur samudra tal par tairti naav zero par hai."),
    ], {"mode": "sea", "spot": "fish"}),
    scene([
        L("Dadi", "Your turn! Drag the thermometer, or use the slider, until it shows 3 degrees below zero.",
          "Ab aapki baari! Thermometer ko drag karo, ya slider chalaao, jab tak woh zero se 3 degree neeche na dikhaaye."),
    ], {"mode": "thermo", "temp": 12, "label": "Your turn", "task": {"target": -3, "text": "Your turn: set the thermometer to 3 degrees below zero (−3 °C)."}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "That evening in the guest house, Papa draws a long railway track in Disha's notebook and marks a junction in the middle.",
          "Us shaam guest house mein, Papa Disha ki notebook mein ek lambi railway line banaate hain aur beech mein ek junction ka nishaan lagaate hain."),
        L("Deepak", "Call this junction zero. Stations to the east are 1, 2, 3 kilometres away. To the west, we can write minus 1, minus 2, minus 3.",
          "Is junction ko zero kaho. Poorab ki taraf stations 1, 2, 3 kilometre door hain. Paschim ki taraf hum likh sakte hain minus 1, minus 2, minus 3."),
    ], {"mode": "line", "station": True}),
    scene([
        L("Dadi", "This is a number line with two sides. The numbers minus 3, minus 2, minus 1, 0, 1, 2, 3 and so on are called integers. Positive integers sit on the right, negative integers on the left, and zero in the middle.",
          "Yeh do taraf wali number line hai. Minus 3, minus 2, minus 1, 0, 1, 2, 3 aur aage ke numbers ko integers kehte hain. Positive integers daayein, negative integers baayein, aur zero beech mein."),
        L("Disha", "And both sides go on forever, so the arrows are on both ends!", "Aur dono taraf yeh hamesha chalti hai, isliye dono kinaaron par arrow hain!"),
    ], {"mode": "line", "station": False}),
    scene([
        L("Harsh", "Easy! 7 is bigger than 3, so minus 7 must be bigger than minus 3!", "Aasaan hai! 7, 3 se bada hai, toh minus 7 bhi minus 3 se bada hoga!"),
        L("Dadi", "Careful, Harsh! On the number line, the number further to the right is always greater. Minus 3 is to the right of minus 7, so minus 3 is greater than minus 7.",
          "Dhyaan se, Harsh! Number line par jo number zyada daayein hai, woh hamesha bada hota hai. Minus 3, minus 7 ke daayein hai, isliye minus 3, minus 7 se bada hai."),
    ], {"mode": "compare", "a": -3, "b": -7}),
    scene([
        L("Disha", "Just like the thermometer! Minus 3 degrees is warmer than minus 7 degrees.", "Bilkul thermometer ki tarah! Minus 3 degree, minus 7 degree se garam hai."),
        L("Deepak", "And every positive number is greater than every negative number. 2 is greater than minus 9, even though 9 looks bigger.",
          "Aur har positive number har negative number se bada hota hai. 2, minus 9 se bada hai, bhale hi 9 bada dikhta ho."),
    ], {"mode": "compare", "a": 2, "b": -9}),
    scene([
        L("Dadi", "Now imagine a mirror at zero. Plus 4 is 4 steps to the right; fold the line at zero and it lands on minus 4, 4 steps to the left. Plus 4 and minus 4 are called opposites.",
          "Ab socho zero par ek aaina hai. Plus 4, daayein 4 kadam par hai; line ko zero par modo, toh yeh minus 4 par aata hai, baayein 4 kadam. Plus 4 aur minus 4 ko opposites kehte hain."),
        L("Disha", "And plus 4 added to minus 4 gives zero!", "Aur plus 4 mein minus 4 jodo toh zero aata hai!"),
    ], {"mode": "opposite", "a": 4}),
    scene([
        L("Harsh", "Then what is the opposite of minus 6?", "Toh minus 6 ka opposite kya hai?"),
        L("Dadi", "Fold it back across zero: plus 6. The opposite of the opposite is the number itself. And zero is its own opposite.",
          "Ise zero ke paar wapas modo: plus 6. Opposite ka opposite wahi number hota hai. Aur zero ka opposite khud zero hai."),
    ], {"mode": "opposite", "a": -6}),
    scene([
        L("Deepak", "Here are five station boards: 3, minus 5, 0, minus 2 and 6. Let us drop each one onto the track.",
          "Yeh rahe paanch station boards: 3, minus 5, 0, minus 2 aur 6. Chalo har ek ko patri par rakhte hain."),
        L("Disha", "Now read from left to right. Smallest first: minus 5, minus 2, 0, 3, 6!", "Ab baayein se daayein padho. Sabse chhota pehle: minus 5, minus 2, 0, 3, 6!"),
    ], {"mode": "order", "nums": [3, -5, 0, -2, 6]}),
    scene([
        L("Dadi", "Your turn! Drag the amber marker to the opposite of 6.", "Ab aapki baari! Amber marker ko 6 ke opposite par drag karo."),
    ], {"mode": "opposite", "a": 2, "task": {"target": -6, "text": "Your turn: drag the amber marker to the opposite of +6."}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "Back in Jaipur, the family visits a new Building of Fun at the mall. It has 5 floors above the ground and 3 floors underground.",
          "Jaipur wapas aakar, parivaar mall ki nayi Building of Fun dekhne jaata hai. Ismein zameen ke upar 5 floor hain aur zameen ke neeche 3 floor."),
        L("Dadi", "Look at the lift buttons: plus 1 to plus 5 above, 0 for the entrance, and minus 1, minus 2, minus 3 below. The building is a number line standing up!",
          "Lift ke buttons dekho: upar plus 1 se plus 5, entrance ke liye 0, aur neeche minus 1, minus 2, minus 3. Yeh building toh khadi hui number line hai!"),
    ], {"start": 0, "moves": []}),
    scene([
        L("Harsh", "Games Zone on plus 3! Let's go!", "Plus 3 par Games Zone! Chalo!"),
        L("Dadi", "From the entrance at zero, the lift goes up 3 floors. Going up means adding a positive number. Zero plus positive 3 equals positive 3.",
          "Zero wale entrance se lift 3 floor upar jaati hai. Upar jaane ka matlab hai positive number jodna. Zero plus positive 3 barabar positive 3."),
    ], {"start": 0, "moves": [3]}),
    scene([
        L("Disha", "Now I want the Ice Rink, on minus 3!", "Ab mujhe Ice Rink jaana hai, minus 3 par!"),
        L("Dadi", "From plus 3, the lift goes down 6 floors. Going down means adding a negative number. Positive 3 plus negative 6 equals negative 3.",
          "Plus 3 se lift 6 floor neeche jaati hai. Neeche jaane ka matlab hai negative number jodna. Positive 3 plus negative 6 barabar negative 3."),
    ], {"start": 3, "moves": [-6]}),
    scene([
        L("Neha", "Oh no, I left my bag in the car, on minus 1!", "Arre, mera bag car mein reh gaya, minus 1 par!"),
        L("Dadi", "From minus 3, go up 2 floors. Negative 3 plus positive 2 equals negative 1.", "Minus 3 se 2 floor upar jao. Negative 3 plus positive 2 barabar negative 1."),
    ], {"start": -3, "moves": [2]}),
    scene([
        L("Deepak", "Watch two moves in a row. Start at plus 2, go up 2 floors, then down 5 floors.", "Ek ke baad ek do moves dekho. Plus 2 se shuru karo, 2 floor upar, phir 5 floor neeche."),
        L("Disha", "Up to plus 4, the Toy Shop, then down to minus 1. So positive 2 plus positive 2 plus negative 5 equals negative 1!",
          "Upar plus 4 par Toy Shop, phir neeche minus 1. Toh positive 2 plus positive 2 plus negative 5 barabar negative 1!"),
    ], {"start": 2, "moves": [2, -5]}),
    scene([
        L("Dadi", "What if we go up 3 floors and then down 3 floors?", "Agar hum 3 floor upar jaayein aur phir 3 floor neeche?"),
        L("Harsh", "We are back at the entrance! So positive 3 plus negative 3 is zero. Opposites cancel out!",
          "Hum wapas entrance par aa gaye! Toh positive 3 plus negative 3 zero hai. Opposites ek doosre ko kaat dete hain!"),
    ], {"start": 0, "moves": [3, -3]}),
    scene([
        L("Disha", "Does it matter which button we press first?", "Kya farak padta hai ki pehle kaunsa button dabaayein?"),
        L("Dadi", "Try it: down 4 and then up 3 ends at minus 1, and up 3 then down 4 also ends at minus 1. The order of adding does not change the answer.",
          "Karke dekho: 4 neeche phir 3 upar, minus 1 par khatam, aur 3 upar phir 4 neeche, wahi minus 1. Jodne ka kram badalne se jawaab nahi badalta."),
    ], {"start": 0, "moves": [-4, 3]}),
    scene([
        L("Dadi", "Your turn! The lift is at plus 2. Press the buttons to take it to the Bowling floor, minus 2.",
          "Ab aapki baari! Lift plus 2 par hai. Buttons dabaakar ise Bowling wale floor, minus 2 par le jao."),
    ], {"start": 2, "moves": [], "task": {"target": -2, "text": "Your turn: start at floor +2 and use the lift buttons to reach Bowling on floor −2."}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "It is raining in Jaipur. Mummy brings out a box of red and green tokens from an old board game.",
          "Jaipur mein baarish ho rahi hai. Mummy ek purane board game se laal aur hare tokens ka dibba nikaalti hain."),
        L("Neha", "Each red token is plus 1, like money I earn. Each green token is minus 1, like money I spend. Here are 3 red tokens and 2 green tokens.",
          "Har laal token plus 1 hai, jaise main jo paisa kamaati hoon. Har hara token minus 1 hai, jaise jo paisa main kharch karti hoon. Yeh rahe 3 laal aur 2 hare tokens."),
    ], {"op": "add", "a": 3, "b": -2, "upTo": 0}),
    scene([
        L("Dadi", "One red and one green together are plus 1 and minus 1, which make zero. We call them a zero pair. Watch the zero pairs vanish!",
          "Ek laal aur ek hara milkar plus 1 aur minus 1 hain, jo zero banaate hain. Inhe zero pair kehte hain. Zero pairs ko gaayab hote dekho!"),
        L("Harsh", "One red token is left. So positive 3 plus negative 2 equals positive 1!", "Ek laal token bacha. Toh positive 3 plus negative 2 barabar positive 1!"),
    ], {"op": "add", "a": 3, "b": -2, "upTo": 4}),
    scene([
        L("Disha", "What about positive 3 plus negative 5?", "Aur positive 3 plus negative 5?"),
        L("Dadi", "Three zero pairs vanish, and 2 green tokens are left. So positive 3 plus negative 5 equals negative 2. It is just like the lift going up 3 and down 5.",
          "Teen zero pairs gaayab, aur 2 hare tokens bache. Toh positive 3 plus negative 5 barabar negative 2. Bilkul lift ki tarah, 3 upar aur 5 neeche."),
    ], {"op": "add", "a": 3, "b": -5, "upTo": 4}),
    scene([
        L("Harsh", "Negative 2 plus negative 4?", "Negative 2 plus negative 4?"),
        L("Dadi", "No pairs at all, only greens. 6 greens make negative 6. Adding two negative numbers gives a bigger negative number.",
          "Koi pair hi nahi, sirf hare. 6 hare matlab negative 6. Do negative numbers jodne par aur bada negative number milta hai."),
    ], {"op": "add", "a": -2, "b": -4, "upTo": 4}),
    scene([
        L("Deepak", "Here is the rule. Same signs: add the sizes and keep the sign. Different signs: take the smaller size away from the bigger one and keep the sign of the bigger.",
          "Yeh raha niyam. Same signs: sizes jodo aur sign wahi rakho. Alag signs: bade size mein se chhota size ghatao aur bade wale ka sign rakho."),
        L("Disha", "So negative 6 plus positive 4: 6 minus 4 is 2, and the greens win. Negative 2!", "Toh negative 6 plus positive 4: 6 minus 4 hai 2, aur hare jeet gaye. Negative 2!"),
    ], {"op": "add", "a": -6, "b": 4, "upTo": 4}),
    scene([
        L("Harsh", "And positive 4 plus negative 4? Every token finds a partner!", "Aur positive 4 plus negative 4? Har token ko partner mil gaya!"),
        L("Dadi", "So nothing is left. A number plus its opposite is always zero. Tokens, the lift and the number line are three ways of seeing the same addition.",
          "Toh kuch nahi bacha. Kisi number mein uska opposite jodo toh hamesha zero. Tokens, lift aur number line, ek hi jod ko dekhne ke teen tareeke hain."),
    ], {"op": "add", "a": 4, "b": -4, "upTo": 4}),
    scene([
        L("Neha", "Your turn! Choose one positive number and one negative number that add up to negative 2. Then press Play and watch the tokens.",
          "Ab aapki baari! Ek positive aur ek negative number chuno jinka jod negative 2 ho. Phir Play dabaao aur tokens dekho."),
    ], {"op": "add", "a": 1, "b": 1, "upTo": 0, "task": {"kind": "sumTo", "target": -2, "text": "Your turn: pick one positive and one negative number that add up to −2, then press Play."}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "The next morning, Dadi spreads the tokens on the dining table again.", "Agli subah Dadi phir se dining table par tokens failaati hain."),
        L("Dadi", "Subtraction means taking away. Positive 5 minus positive 2: start with 5 red tokens and take away 2 red tokens. 3 reds are left, positive 3.",
          "Subtraction ka matlab hai nikaalna. Positive 5 minus positive 2: 5 laal tokens se shuru karo aur 2 laal nikaal do. 3 laal bache, positive 3."),
    ], {"op": "sub", "a": 5, "b": 2, "upTo": 3}),
    scene([
        L("Harsh", "Now negative 3 minus positive 2. Wait, there are only green tokens! How can I take away 2 red ones?",
          "Ab negative 3 minus positive 2. Ruko, yahan toh sirf hare tokens hain! 2 laal kaise nikaaloon?"),
    ], {"op": "sub", "a": -3, "b": 2, "upTo": 0}),
    scene([
        L("Dadi", "Here is the trick: add zero pairs! A red and a green together are worth zero, so adding them does not change the value. Add 2 zero pairs, then take away 2 reds.",
          "Yahi toh trick hai: zero pairs jodo! Ek laal aur ek hara milkar zero ke barabar hain, isliye unhe jodne se value nahi badalti. 2 zero pairs jodo, phir 2 laal nikaalo."),
        L("Disha", "5 greens are left. So negative 3 minus positive 2 equals negative 5!", "5 hare bache. Toh negative 3 minus positive 2 barabar negative 5!"),
    ], {"op": "sub", "a": -3, "b": 2, "upTo": 3}),
    scene([
        L("Disha", "Let me try positive 2 minus negative 3.", "Main positive 2 minus negative 3 try karti hoon."),
        L("Dadi", "There are no greens to take away, so add 3 zero pairs and take away the 3 greens. 5 reds are left, positive 5. Taking away a negative number makes the answer bigger!",
          "Nikaalne ke liye hare hain hi nahi, toh 3 zero pairs jodo aur 3 hare nikaal do. 5 laal bache, positive 5. Negative number nikaalne se jawaab bada ho jaata hai!"),
    ], {"op": "sub", "a": 2, "b": -3, "upTo": 3}),
    scene([
        L("Dadi", "Look closely. Taking away positive 2 gave the same answer as adding negative 2. Taking away negative 3 gave the same answer as adding positive 3.",
          "Dhyaan se dekho. Positive 2 nikaalne ka wahi jawaab aaya jo negative 2 jodne ka. Negative 3 nikaalne ka wahi jawaab aaya jo positive 3 jodne ka."),
        L("Deepak", "So subtracting a number is the same as adding its opposite! That is the rule engineers use every day.",
          "Matlab kisi number ko ghataana, uske opposite ko jodne ke barabar hai! Engineers yeh niyam roz use karte hain."),
    ], {"op": "sub", "a": 2, "b": -3, "upTo": 3, "rule": True}),
    scene([
        L("Harsh", "Negative 4 minus negative 1?", "Negative 4 minus negative 1?"),
        L("Dadi", "The opposite of negative 1 is positive 1, so it is negative 4 plus positive 1, which is negative 3. And the tokens agree: take 1 green away from 4 greens, and 3 greens are left.",
          "Negative 1 ka opposite positive 1 hai, toh yeh negative 4 plus positive 1 hua, yaani negative 3. Aur tokens bhi yahi kehte hain: 4 hare mein se 1 hara nikaalo, 3 hare bache."),
    ], {"op": "sub", "a": -4, "b": -1, "upTo": 3, "rule": True}),
    scene([
        L("Neha", "And zero minus positive 4? The table is empty!", "Aur zero minus positive 4? Table toh khaali hai!"),
        L("Dadi", "Add 4 zero pairs and take the 4 reds away, and 4 greens are left. Zero minus 4 is negative 4. That is why 3 minus 5 does have an answer: negative 2.",
          "4 zero pairs jodo aur 4 laal nikaal do, toh 4 hare bachte hain. Zero minus 4 barabar negative 4. Isiliye 3 minus 5 ka bhi jawaab hai: negative 2."),
    ], {"op": "sub", "a": 0, "b": 4, "upTo": 3}),
    scene([
        L("Dadi", "Your turn! Set up negative 2 minus positive 3 with the buttons, then press Play. Do you think the answer will be positive or negative?",
          "Ab aapki baari! Buttons se negative 2 minus positive 3 banao, phir Play dabaao. Kya lagta hai, jawaab positive hoga ya negative?"),
    ], {"op": "sub", "a": 0, "b": 0, "upTo": 0, "rule": True, "task": {"op": "sub", "a": -2, "b": 3, "text": "Your turn: set up (−2) − (+3) with the buttons and press Play."}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "Mummy puts a tray of water at 25 degrees into her freezer, which is set at minus 18 degrees.",
          "Mummy 25 degree wale paani ki tray apne freezer mein rakhti hain, jo minus 18 degree par set hai."),
        L("Neha", "By morning the water will be ice for my lemonade. But how much colder did it get?",
          "Subah tak yeh paani meri nimbu paani ke liye barf ban jaayega. Lekin yeh kitna thanda hua?"),
        L("Dadi", "Change is end minus start. Negative 18 minus positive 25 equals negative 43. The minus sign tells us it got 43 degrees colder.",
          "Badlaav barabar end minus start. Negative 18 minus positive 25 barabar negative 43. Minus sign batata hai ki yeh 43 degree thanda hua."),
    ], {"mode": "freezer", "start": 25, "end": -18}),
    scene([
        L("Deepak", "Now my puzzle track. Imagine a bridge 20 metres above ground level, and a tunnel under a river, 15 metres below ground level.",
          "Ab meri puzzle wali patri. Socho ek pul hai jo zameen se 20 metre upar hai, aur nadi ke neeche ek surang jo zameen se 15 metre neeche hai."),
        L("Harsh", "So the train on the bridge is at plus 20 metres!", "Toh pul par train plus 20 metre par hai!"),
    ], {"mode": "rail", "pos": 0.38}),
    scene([
        L("Deepak", "And now it is deep inside the tunnel, at minus 15 metres.", "Aur ab yeh surang ke andar gehraai mein hai, minus 15 metre par."),
    ], {"mode": "rail", "pos": 0.8}),
    scene([
        L("Disha", "How far is the bridge above the tunnel?", "Pul surang se kitna upar hai?"),
        L("Dadi", "Top minus bottom. 20 minus negative 15 is the same as 20 plus 15, which is 35 metres. Count it on the line: 15 steps up to zero, then 20 more.",
          "Upar minus neeche. 20 minus negative 15 barabar 20 plus 15, yaani 35 metre. Line par gino: zero tak 15 kadam, phir 20 aur."),
    ], {"mode": "rail", "pos": 0.8, "showDiff": True}),
    scene([
        L("Harsh", "My team's run difference! We won match 1 by 18 runs, lost match 2 by 25, and won match 3 by 4.",
          "Meri team ka run difference! Match 1 hum 18 runs se jeete, match 2 mein 25 se haare, aur match 3 mein 4 se jeete."),
        L("Dadi", "A win is positive, a loss is negative. Positive 18 plus negative 25 plus positive 4 equals negative 3. Overall your team is 3 runs behind.",
          "Jeet positive, haar negative. Positive 18 plus negative 25 plus positive 4 barabar negative 3. Kul milaakar aapki team 3 runs peeche hai."),
    ], {"mode": "cricket"}),
    scene([
        L("Neha", "My bakery account works the same way. A laddoo order brings in 500 rupees as a credit, and flour and ghee cost 800 rupees as a debit. Then a cake order brings in 200 rupees.",
          "Meri bakery ka hisaab bhi aise hi chalta hai. Laddoo order se 500 rupaye aaye, yeh credit hai, aur aata aur ghee 800 rupaye ke, yeh debit hai. Phir cake order se 200 rupaye aaye."),
        L("Disha", "500 minus 800 plus 200 is minus 100. Mummy, you are 100 rupees short!", "500 minus 800 plus 200 barabar minus 100. Mummy, aapke 100 rupaye kam pad gaye!"),
    ], {"mode": "money"}),
    scene([
        L("Dadi", "Here is a secret from history. In 628 CE, the mathematician Brahmagupta, working at Bhillamala, today's Bhinmal in Rajasthan, wrote rules for positive numbers as fortunes and negative numbers as debts.",
          "Itihaas ka ek raaz suno. San 628 mein, ganitagya Brahmagupta ne Bhillamala mein, jo aaj Rajasthan ka Bhinmal hai, positive numbers ko dhan aur negative numbers ko karz maankar unke niyam likhe."),
        L("Harsh", "A Rajasthani mathematician! Our state is famous for maths too!", "Rajasthan ke ganitagya! Hamara state maths ke liye bhi mashhoor hai!"),
    ], {"mode": "money"}),
    scene([
        L("Neha", "Your turn! My freezer is at minus 2 degrees. Make it 5 degrees colder by dragging the end temperature slider.",
          "Ab aapki baari! Mera freezer minus 2 degree par hai. End temperature ka slider khiskaakar ise 5 degree aur thanda karo."),
    ], {"mode": "freezer", "start": -2, "end": -2, "task": {"start": -2, "end": -7, "text": "Your turn: the freezer is at −2 °C. Drag the END temperature to make it 5 degrees colder."}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "Exam week! Disha and Harsh sit with Dadi and solve one question at a time.", "Exam ka hafta! Disha aur Harsh Dadi ke saath baithkar ek ek sawaal hal karte hain."),
        L("Dadi", "Question 1. Early one morning in Leh it was minus 12 degrees, and by noon it rose by 15 degrees. What was the noon temperature?",
          "Sawaal 1. Leh mein ek subah temperature minus 12 degree tha, aur dopahar tak yeh 15 degree badh gaya. Dopahar ka temperature kya tha?"),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "Rising means adding a positive number. So it is negative 12 plus positive 15.", "Badhna matlab positive number jodna. Toh yeh negative 12 plus positive 15 hai."),
    ], {"example": 0, "step": 1}),
    scene([
        L("Harsh", "Different signs, so 15 minus 12 is 3, and the positive part is bigger. The answer is positive 3 degrees!",
          "Alag signs, toh 15 minus 12 barabar 3, aur positive wala bada hai. Jawaab positive 3 degree!"),
        L("Dadi", "Shabash! Check on the thermometer: 12 steps up reach zero, and 3 more reach 3.", "Shabash! Thermometer par check karo: 12 kadam upar zero tak, aur 3 aur, 3 tak."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. The lift starts at floor plus 3, goes down 5 floors, then up 1 floor. Where does it stop?",
          "Sawaal 2. Lift floor plus 3 se chalti hai, 5 floor neeche jaati hai, phir 1 floor upar. Yeh kahan rukegi?"),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "Positive 3 plus negative 5 is negative 2. Then negative 2 plus positive 1 is negative 1. The car parking!",
          "Positive 3 plus negative 5 barabar negative 2. Phir negative 2 plus positive 1 barabar negative 1. Car parking!"),
        L("Dadi", "Exactly right.", "Bilkul sahi."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def svg_between():
    """Number line from -5 to 4 with the integers strictly between -4 and 3 highlighted."""
    parts = ['<svg viewBox="0 0 400 90" width="340"><line x1="10" y1="45" x2="390" y2="45" stroke="#e2e8f0" stroke-width="2.5"/>']
    for n in range(-5, 5):
        x = 200 + n * 38
        inside = -4 < n < 3
        end = n in (-4, 3)
        color = "#34d399" if inside else ("#fbbf24" if end else "#94a3b8")
        label = f"−{-n}" if n < 0 else str(n)
        parts.append(f'<line x1="{x}" y1="38" x2="{x}" y2="52" stroke="{color}" stroke-width="2"/>')
        if inside:
            parts.append(f'<circle cx="{x}" cy="45" r="6" fill="#34d399"/>')
        if end:
            parts.append(f'<circle cx="{x}" cy="45" r="6" fill="none" stroke="#fbbf24" stroke-width="2.5"/>')
        parts.append(f'<text x="{x}" y="74" text-anchor="middle" fill="{color}" font-size="14" font-weight="700">{label}</text>')
    parts.append('<text x="200" y="20" text-anchor="middle" fill="#34d399" font-size="13" font-weight="700">6 integers between −4 and 3</text></svg>')
    return "".join(parts)


def svg_tokens(reds, greens):
    """Reds on top, greens below; matching columns are boxed as zero pairs."""
    cols = max(reds, greens)
    w = 40 + cols * 36
    parts = [f'<svg viewBox="0 0 {w} 110" width="{min(340, w)}">']
    for i in range(min(reds, greens)):
        parts.append(f'<rect x="{20 + i * 36 - 2}" y="8" width="36" height="84" rx="10" fill="none" stroke="#fbbf24" stroke-dasharray="4 3" stroke-width="2"/>')
    for i in range(reds):
        parts.append(f'<circle cx="{38 + i * 36}" cy="30" r="14" fill="#ef4444"/><text x="{38 + i * 36}" y="37" text-anchor="middle" fill="#fff" font-size="20" font-weight="900">+</text>')
    for i in range(greens):
        parts.append(f'<circle cx="{38 + i * 36}" cy="70" r="14" fill="#22c55e"/><text x="{38 + i * 36}" y="77" text-anchor="middle" fill="#fff" font-size="20" font-weight="900">−</text>')
    parts.append("</svg>")
    return "".join(parts)


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Winter in Ladakh · Why We Need Negative Numbers",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Winter holidays in Ladakh! Dadi's thermometer keeps falling past zero, and Disha wants to know what comes after zero when it gets even colder. Mummy adds a surprise from Kerala: rice fields that lie below the sea.</div>

<h2>Numbers on the other side of zero</h2>
<p>Counting numbers (1, 2, 3, …) and zero are not enough to describe the world. We need numbers for <strong>below zero</strong> too.</p>
<div {CARD}>
  <div><strong class="text-red-300">Positive numbers</strong>: more than zero, written +5 or just 5.</div>
  <div><strong class="text-sky-300">Negative numbers</strong>: less than zero, written with a minus sign: −5 (read "minus 5" or "negative 5").</div>
  <div><strong class="text-amber-300">Zero</strong> is neither positive nor negative. It is the reference point.</div>
</div>

<h2>Real temperatures (°C)</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Place</th><th>Temperature</th><th class="text-left">In words</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Jaipur, a hot May afternoon</td><td class="text-center">about +40 °C</td><td>40 degrees above zero</td></tr>
    <tr><td>Water freezing</td><td class="text-center">0 °C</td><td>zero</td></tr>
    <tr><td>Leh, a January night (2026)</td><td class="text-center">about −14 °C</td><td>14 degrees below zero</td></tr>
    <tr><td>Drass, Ladakh (January 2026)</td><td class="text-center">about −25 °C (−24.6 °C)</td><td>25 degrees below zero</td></tr>
  </tbody>
</table>
<p class="text-xs text-slate-400">Source: All India Radio News report on the Ladakh cold wave, 9 January 2026.</p>

<h2>Heights from sea level</h2>
<p>Heights of places are measured from <strong>sea level = 0 m</strong>. Mountains are positive heights. In <strong>Kuttanad</strong> (Kerala), farmers grow rice on fields that are about <strong>2 m below sea level</strong> (−2 m). Mud walls called bunds keep the backwater out. It is one of the lowest places in India.</p>

<h2>Where else do we meet negative numbers?</h2>
<ul>
  <li>Money: money you have or earn is positive (credit); money you owe or spend is negative (debit).</li>
  <li>Games: points won are positive, points lost are negative.</li>
  <li>Lifts: floors above ground are positive, basement floors are negative.</li>
</ul>
<div {FORMULA}>below zero → negative (−) · zero → neither · above zero → positive (+)</div>
""",
        "keyInsight": "Negative numbers describe things on the other side of zero: below freezing, below sea level, money owed.",
        "widgetType": "Class6BelowZeroWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "A fish swims 9 m below sea level. How do we write its height?",
            "options": ["+9 m", "−9 m", "0 m", "9 m above"],
            "correctIndex": 1,
            "explanation": "Sea level is 0. Below sea level is negative, so the height is −9 m.",
        },
        "teacherNotes": teacher(
            [
                "Start from a real need: ask what number to write for '3 degrees colder than zero'. Let students invent a notation before showing the minus sign.",
                "Stress the reference point: zero on a thermometer (water freezes), sea level for heights, ground floor for lifts. Negative only means 'on the other side of the reference'.",
                "Read −5 aloud as 'minus 5' or 'negative 5'; both are fine. Avoid 'minus' only meaning 'take away' at this stage.",
            ],
            [
                "Thinking −25 °C is warmer than −14 °C because 25 is bigger than 14.",
                "Calling zero a positive number.",
                "Forgetting the minus sign when writing heights below sea level.",
            ],
            "Above or below? Read out 10 situations (a bird 12 m up, a submarine 30 m down, ₹50 owed, 4 °C below freezing, the ground floor …). Students hold up a red card for positive, a green card for negative and an empty hand for zero.",
            "Ganita Prakash Ch. 10 (10.1 Bela's Building of Fun, 10.3 Integers in other places: temperature and sea level); old NCERT Ch. 6 (6.1 Introduction).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Papa's Railway Line · The Number Line and Comparing Integers",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Papa draws a railway track with a junction at zero: stations to the east are positive, stations to the west are negative. Harsh thinks −7 beats −3. Dadi shows him why the right side always wins.</div>

<h2>Integers</h2>
<p>The collection … −3, −2, −1, 0, 1, 2, 3 … is called the <strong>integers</strong>. Positive integers: 1, 2, 3, … Negative integers: −1, −2, −3, … Zero is an integer that is neither.</p>

<h2>The number line with two sides</h2>
<div {CARD}>
  <div>Mark 0 in the middle. Equal steps to the <strong>right</strong> give 1, 2, 3, …</div>
  <div>Equal steps to the <strong>left</strong> give −1, −2, −3, …</div>
  <div>Arrows on both ends: the line goes on forever both ways.</div>
</div>

<h2>Comparing integers</h2>
<div {FORMULA}>Further right = greater · Further left = smaller</div>
<ul>
  <li>−3 &gt; −7 (−3 is to the right of −7, like −3 °C being warmer than −7 °C).</li>
  <li>Every positive integer is greater than every negative integer: 2 &gt; −9.</li>
  <li>0 is greater than every negative integer and smaller than every positive integer.</li>
  <li>Among negative integers, the one that looks "smaller" (closer to 0) is actually greater: −1 is the greatest negative integer.</li>
</ul>

<h2>Opposites</h2>
<p>Two integers at the <strong>same distance from 0</strong> on opposite sides are opposites (old NCERT calls them additive inverses): +4 and −4, −6 and +6. A number plus its opposite is 0. The opposite of 0 is 0.</p>

<h2>Ordering</h2>
<p>Ascending order (smallest first) means reading the number line from left to right: −5 &lt; −2 &lt; 0 &lt; 3 &lt; 6.</p>
""",
        "keyInsight": "On the number line, further right is always greater, so −3 > −7 even though 7 > 3.",
        "widgetType": "Class6IntegerLineWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "Which of these is the greatest?",
            "options": ["−10", "−4", "−1", "−7"],
            "correctIndex": 2,
            "explanation": "−1 is furthest to the right on the number line (closest to 0 from the left), so it is the greatest.",
        },
        "teacherNotes": teacher(
            [
                "Draw a big number line on the floor with tape. Students stand on integers and compare by looking at who is further right.",
                "Link to temperatures: '−3 °C or −7 °C, which is warmer?' Almost every student answers correctly, then transfer the idea.",
                "Teach opposites as reflections in a mirror at 0: same distance, other side.",
            ],
            [
                "Saying −7 > −3 because 7 > 3.",
                "Leaving out zero when listing integers between two numbers (e.g. between −2 and 2).",
                "Unequal spacing on a hand-drawn number line, which makes comparisons look wrong.",
            ],
            "Human number line: give 9 students cards from −4 to 4 in random order. The class directs them into order without speaking, only pointing. Then call out pairs ('−3 and 1') and ask who is greater and why.",
            "Old NCERT Ch. 6 (6.2 Integers, representation on a number line, ordering of integers); Ganita Prakash Ch. 10 (number line, comparison, opposites).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: The Building of Fun · Adding with a Lift",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>A Building of Fun has 5 floors above the ground and 3 floors underground. Every lift ride is an addition sum: up is plus, down is minus.</div>

<h2>The building is a number line standing up</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>Floor</th><th class="text-left">What is there</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td class="text-center">+5 … +1</td><td>Sky Deck, Toy Shop, Games Zone, Food Court, Book Shop</td></tr>
    <tr><td class="text-center">0</td><td>Entrance (ground level)</td></tr>
    <tr><td class="text-center">−1, −2, −3</td><td>Car Parking, Bowling, Ice Rink (underground)</td></tr>
  </tbody>
</table>

<h2>Adding = moving</h2>
<div {CARD}>
  <div><strong class="text-emerald-300">Going up</strong> n floors = adding a positive number (+n).</div>
  <div><strong class="text-rose-300">Going down</strong> n floors = adding a negative number (−n).</div>
  <div>Start floor + movement = final floor.</div>
</div>
<ul>
  <li>0 + (+3) = +3 (entrance up to the Games Zone)</li>
  <li>(+3) + (−6) = −3 (Games Zone down to the Ice Rink)</li>
  <li>(−3) + (+2) = −1 (Ice Rink up to the Car Parking)</li>
  <li>(+2) + (+2) + (−5) = −1</li>
  <li>(+3) + (−3) = 0: a number plus its opposite brings you back to where you began.</li>
</ul>
<div {FORMULA}>(−4) + (+3) = (+3) + (−4) = −1 · order does not matter</div>
<p>On a horizontal number line, the same sums are jumps: adding a positive number jumps right, adding a negative number jumps left.</p>
""",
        "keyInsight": "Adding a positive number moves up (or right); adding a negative number moves down (or left).",
        "widgetType": "Class6LiftWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "The lift is on floor −1. It goes up 4 floors. Which floor is it on now?",
            "options": ["−5", "+3", "+4", "−3"],
            "correctIndex": 1,
            "explanation": "(−1) + (+4) = +3. One floor up reaches 0, three more reach +3.",
        },
        "teacherNotes": teacher(
            [
                "Act it out: a staircase or a vertical number line on the board. A student moves a paper lift while the class writes the addition sentence.",
                "Always write the sentence in the form start + movement = end, with brackets around signed numbers: (+3) + (−6) = −3.",
                "Show that the order of moves does not change the final floor (commutativity) before stating it.",
            ],
            [
                "Counting the starting floor as one of the steps (going from +3 down 6 and landing on −2).",
                "Forgetting that floor 0 is a floor and skipping it while counting.",
                "Writing 3 + −6 without brackets, which makes the two signs confusing.",
            ],
            "Lift operator game: one student is the 'lift attendant' and secretly starts on a floor. Others call out moves (up 3, down 5 …). After 4 moves the class predicts the final floor with an addition sentence before the attendant reveals it.",
            "Ganita Prakash Ch. 10 (10.1 Bela's Building of Fun: lift movements, adding integers); old NCERT Ch. 6 (6.3 Addition of integers on a number line).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Mummy's Red and Green Tokens · Adding Integers",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On a rainy evening Mummy brings out red and green tokens. Red is +1, green is −1, and a red and a green together make nothing at all.</div>

<h2>The token model</h2>
<div {CARD}>
  <div><span class="text-red-400 font-bold">Red token</span> = +1 &nbsp;·&nbsp; <span class="text-green-400 font-bold">Green token</span> = −1</div>
  <div>A red and a green together = (+1) + (−1) = 0. This is called a <strong>zero pair</strong>.</div>
  <div>Removing (or adding) zero pairs never changes the value.</div>
</div>

<h2>Adding with tokens</h2>
<ol>
  <li>Put out tokens for both numbers.</li>
  <li>Mix them and match each red with a green.</li>
  <li>Remove the zero pairs. The tokens left over give the answer.</li>
</ol>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Sum</th><th>Zero pairs</th><th>Left</th><th>Answer</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>(+3) + (−2)</td><td class="text-center">2</td><td class="text-center">1 red</td><td class="text-center">+1</td></tr>
    <tr><td>(+3) + (−5)</td><td class="text-center">3</td><td class="text-center">2 green</td><td class="text-center">−2</td></tr>
    <tr><td>(−2) + (−4)</td><td class="text-center">0</td><td class="text-center">6 green</td><td class="text-center">−6</td></tr>
    <tr><td>(−6) + (+4)</td><td class="text-center">4</td><td class="text-center">2 green</td><td class="text-center">−2</td></tr>
    <tr><td>(+4) + (−4)</td><td class="text-center">4</td><td class="text-center">none</td><td class="text-center">0</td></tr>
  </tbody>
</table>

<h2>The rules (from the pictures)</h2>
<div {FORMULA}>Same signs: add the sizes, keep the sign · Different signs: subtract the sizes, keep the sign of the bigger</div>
<p>Examples: (−7) + (−5) = −12; (+9) + (−4) = +5; (−9) + (+4) = −5.</p>
""",
        "keyInsight": "A red (+1) and a green (−1) make a zero pair. Cancel the pairs and whatever is left is the sum.",
        "widgetType": "Class6TokensWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "With tokens, (+2) + (−6) leaves how many tokens, and of which colour?",
            "options": ["4 red: +4", "4 green: −4", "8 green: −8", "No tokens: 0"],
            "correctIndex": 1,
            "explanation": "2 zero pairs cancel. 6 − 2 = 4 green tokens remain, so the sum is −4.",
        },
        "teacherNotes": teacher(
            [
                "Use real counters (two colours of buttons, bindis or bottle caps). Students must physically remove zero pairs before any rule is written.",
                "Connect each token sum to the lift: red = one floor up, green = one floor down.",
                "Only after many examples, ask students to put the pattern into words. That is the rule.",
            ],
            [
                "Adding the sizes even when the signs are different ((+3) + (−5) = 8 or −8).",
                "Keeping the sign of the first number instead of the sign of the larger size.",
                "Thinking a zero pair is 'two tokens', so it must count as 2.",
            ],
            "Token race: pairs of students get 10 red and 10 green counters. The teacher calls a sum; the first pair to show the leftover tokens and say the answer scores. Then swap: the teacher shows leftover tokens and teams invent a sum that gives them.",
            "Ganita Prakash Ch. 10 (10.2 The Token Model: adding with tokens, zero pairs); old NCERT Ch. 6 (6.3 Addition of integers).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Taking Away Tokens · Subtracting Integers",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Harsh wants to take 2 red tokens away from a pile that has only green ones. Dadi's trick: add zero pairs first. They are worth nothing, but they give you something to take away.</div>

<h2>Subtracting = taking away tokens</h2>
<ol>
  <li>Put out tokens for the first number.</li>
  <li>If there are not enough tokens of the colour you must take away, <strong>add zero pairs</strong> (value does not change).</li>
  <li>Take away the tokens. What is left is the answer.</li>
</ol>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Subtraction</th><th>Zero pairs added</th><th>Left</th><th>Answer</th><th class="text-left">Same as</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>(+5) − (+2)</td><td class="text-center">0</td><td class="text-center">3 red</td><td class="text-center">+3</td><td>(+5) + (−2)</td></tr>
    <tr><td>(−3) − (+2)</td><td class="text-center">2</td><td class="text-center">5 green</td><td class="text-center">−5</td><td>(−3) + (−2)</td></tr>
    <tr><td>(+2) − (−3)</td><td class="text-center">3</td><td class="text-center">5 red</td><td class="text-center">+5</td><td>(+2) + (+3)</td></tr>
    <tr><td>(−4) − (−1)</td><td class="text-center">0</td><td class="text-center">3 green</td><td class="text-center">−3</td><td>(−4) + (+1)</td></tr>
    <tr><td>0 − (+4)</td><td class="text-center">4</td><td class="text-center">4 green</td><td class="text-center">−4</td><td>0 + (−4)</td></tr>
  </tbody>
</table>

<h2>The big rule</h2>
<div {FORMULA}>a − b = a + (opposite of b)</div>
<ul>
  <li>Subtracting a positive number moves you left (down) on the number line.</li>
  <li>Subtracting a negative number moves you right (up): (+6) − (−4) = 6 + 4 = 10.</li>
  <li>Now every subtraction has an answer: 3 − 5 = −2.</li>
</ul>
<p class="text-xs text-slate-400">Old NCERT says the same thing as "to subtract an integer, add its additive inverse".</p>
""",
        "keyInsight": "Subtracting a number gives the same answer as adding its opposite: a − (−b) = a + b.",
        "widgetType": "Class6TokensWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "(−5) − (−7) = ?",
            "options": ["−12", "−2", "+2", "+12"],
            "correctIndex": 2,
            "explanation": "Subtracting −7 is the same as adding +7: (−5) + (+7) = +2.",
        },
        "teacherNotes": teacher(
            [
                "Let students get stuck on (−3) − (+2) with real counters before revealing the zero-pair trick. The 'aha' is the lesson.",
                "Write each subtraction next to its 'add the opposite' version on the board and ask students to spot the pattern themselves.",
                "Check on a number line: (−3) − (+2) and (−3) + (−2) both land on −5.",
            ],
            [
                "Changing the sign of the first number instead of the second ((−3) − (+2) → 3 + 2).",
                "Thinking subtraction always makes a number smaller: (+2) − (−3) = 5 is bigger than 2.",
                "Adding the wrong number of zero pairs. Add exactly enough to take away what you need.",
            ],
            "Subtraction chains: give each group token sets and 6 cards like (−2) − (−5). Groups solve with tokens, then rewrite each as an addition and check the answers match. Finish by asking: 'Can a subtraction ever give a bigger answer?'",
            "Ganita Prakash Ch. 10 (10.2 The Token Model: subtraction with tokens, adding zero pairs); old NCERT Ch. 6 (6.4 Subtraction of integers with the help of a number line).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Freezer, Railway and Cricket · Integers in Real Life",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Mummy's freezer, Papa's bridge-and-tunnel puzzle, Harsh's cricket season and the bakery account all turn into integer sums. Dadi ends with a secret from Rajasthan's history.</div>

<h2>Change = end − start</h2>
<div {CARD}>
  <div>Water at +25 °C goes into a freezer at −18 °C (a typical home freezer setting).</div>
  <div>Change = (−18) − (+25) = (−18) + (−25) = <strong>−43</strong>. The minus sign means it got 43 degrees colder.</div>
</div>

<h2>Difference in height = top − bottom</h2>
<div {CARD}>
  <div>Papa's puzzle track: a bridge at +20 m and a tunnel at −15 m (from ground level).</div>
  <div>Difference = 20 − (−15) = 20 + 15 = <strong>35 m</strong>.</div>
</div>

<h2>Running totals</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Story</th><th class="text-left">Integers</th><th>Total</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Cricket: won by 18, lost by 25, won by 4</td><td>(+18) + (−25) + (+4)</td><td class="text-center">−3 runs</td></tr>
    <tr><td>Bakery: credit ₹500, debit ₹800, credit ₹200</td><td>(+500) + (−800) + (+200)</td><td class="text-center">−₹100 (short)</td></tr>
  </tbody>
</table>

<h2>A pinch of history</h2>
<p>In <strong>628 CE</strong>, <strong>Brahmagupta</strong> wrote the <em>Brāhmasphuṭasiddhānta</em> at Bhillamala (today's <strong>Bhinmal, Rajasthan</strong>). He treated positive numbers as <em>fortunes</em> and negative numbers as <em>debts</em>, and gave rules such as "a debt taken from zero becomes a fortune". This was one of the earliest full sets of rules for working with negative numbers and zero.</p>
<div {FORMULA}>Change = end − start · Difference = higher − lower</div>
""",
        "keyInsight": "For any real change, compute end − start; a negative answer means a fall, a loss or a debt.",
        "widgetType": "Class6IntegerStoriesWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "A submarine is at −40 m. It rises 15 m. What is its new height?",
            "options": ["−55 m", "−25 m", "+25 m", "+55 m"],
            "correctIndex": 1,
            "explanation": "Rising means adding a positive number: (−40) + (+15) = −25 m. It is still under water.",
        },
        "teacherNotes": teacher(
            [
                "Insist on the template 'change = end − start' and let the sign of the answer tell the story (rise or fall, profit or loss).",
                "For differences in height or temperature, draw a vertical number line and count steps across zero: 15 down to 0 and 20 up gives 35.",
                "Use the history note to show that negative numbers were developed in India to handle debts.",
            ],
            [
                "Computing start − end and getting the wrong sign.",
                "Answering 20 − 15 = 5 for the bridge-and-tunnel difference (forgetting the tunnel is below zero).",
                "Writing a debt or loss as a positive number in a running total.",
            ],
            "Class bank: each student starts with ₹0 on a slip. Read out 6 events (pocket money +₹50, buy a pencil −₹10, borrow ₹30 …). Students keep a running total with integers; compare final balances and discuss who is 'in debt'.",
            "Ganita Prakash Ch. 10 (10.3 Integers in other places: credits and debits, geographical and temperature uses; 10.5 A pinch of history: Brahmagupta); old NCERT Ch. 6 exercises on real-life integers.",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>Exam week! Disha and Harsh sit with Dadi and solve one question at a time: read, picture it, then solve.</div>
<h2>How to attack any integer question</h2>
<ol>
  <li><strong>Picture it</strong>: a thermometer, a lift, a number line or tokens.</li>
  <li><strong>Write the sentence</strong> with brackets: (−12) + (+15).</li>
  <li><strong>Subtracting?</strong> Change it to adding the opposite.</li>
  <li><strong>Apply the sign rule</strong> and sanity-check on the number line.</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Put brackets around every signed number, turn subtraction into adding the opposite, then check on a number line.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Temperature rise",
                    "question": "Early one morning in Leh the temperature was −12 °C. By noon it had risen by 15 °C. What was the noon temperature?",
                    "steps": [
                        "A rise means adding a positive number: (−12) + (+15)",
                        "Different signs: 15 − 12 = 3, and the positive part (15) is bigger, so the sign is +",
                        "(−12) + (+15) = <strong>+3</strong>. Check: 12 steps up reach 0, 3 more reach +3 ✔",
                    ],
                    "answer": "3 °C (3 degrees above zero)",
                },
                {
                    "title": "Lift ride",
                    "question": "In the Building of Fun, the lift starts at floor +3. It goes down 5 floors and then up 1 floor. On which floor does it stop?",
                    "steps": [
                        "Down 5 floors = adding −5: (+3) + (−5) = −2",
                        "Up 1 floor = adding +1: (−2) + (+1) = −1",
                        "Together: (+3) + (−5) + (+1) = <strong>−1</strong>",
                    ],
                    "answer": "Floor −1 (Car Parking)",
                },
                {
                    "title": "Putting integers in order",
                    "question": "Arrange in ascending order: −7, 4, 0, −2, 9, −11.",
                    "steps": [
                        "Ascending = smallest first = read the number line from left to right.",
                        "Negatives: −11 is furthest left, then −7, then −2.",
                        "Then 0, then the positives 4 and 9.",
                    ],
                    "answer": "−11 &lt; −7 &lt; −2 &lt; 0 &lt; 4 &lt; 9",
                },
                {
                    "title": "Integers between two numbers",
                    "question": "List all the integers between −4 and 3. How many are there?",
                    "figureSvg": svg_between(),
                    "steps": [
                        "'Between' means −4 and 3 themselves are not included.",
                        "Walk right from −4: −3, −2, −1, 0, 1, 2 (then 3, where we stop).",
                        "Count them: <strong>6</strong> integers (do not forget 0!).",
                    ],
                    "answer": "−3, −2, −1, 0, 1, 2: six integers",
                },
                {
                    "title": "Adding with tokens",
                    "question": "Use the token model to find (+4) + (−7).",
                    "figureSvg": svg_tokens(4, 7),
                    "steps": [
                        "(+4) = 4 red tokens; (−7) = 7 green tokens.",
                        "Match each red with a green: <strong>4 zero pairs</strong>. Remove them.",
                        "7 − 4 = 3 green tokens are left.",
                        "(+4) + (−7) = <strong>−3</strong>",
                    ],
                    "answer": "−3",
                },
                {
                    "title": "Above and below sea level",
                    "question": "A kingfisher hovers 6 m above the water of a Kerala backwater (at sea level). A fish swims 4 m below the surface. How far apart are they vertically?",
                    "steps": [
                        "Kingfisher: +6 m. Fish: −4 m.",
                        "Distance = higher − lower = 6 − (−4)",
                        "Subtracting −4 = adding +4: 6 + 4 = <strong>10</strong>",
                    ],
                    "answer": "10 m",
                },
                {
                    "title": "Subtracting with zero pairs",
                    "question": "Use tokens to find (−5) − (−8).",
                    "steps": [
                        "Start with 5 green tokens. We must take away 8 greens, but we have only 5.",
                        "Add <strong>3 zero pairs</strong> (3 red + 3 green). Value is still −5; now there are 8 greens and 3 reds.",
                        "Take away 8 greens. 3 reds are left.",
                        "(−5) − (−8) = <strong>+3</strong>. Check: (−5) + (+8) = +3 ✔",
                    ],
                    "answer": "+3",
                },
                {
                    "title": "Subtract = add the opposite",
                    "question": "Find (a) (+6) − (−4) and (b) (−3) − (+7).",
                    "steps": [
                        "(a) Opposite of −4 is +4: (+6) + (+4) = <strong>+10</strong>",
                        "(b) Opposite of +7 is −7: (−3) + (−7)",
                        "Same signs: add the sizes and keep the sign: 3 + 7 = 10, so <strong>−10</strong>",
                    ],
                    "answer": "(a) +10, (b) −10",
                },
                {
                    "title": "Bakery account",
                    "question": "Mummy earns ₹750 from a cake order (credit) and then pays ₹900 for flour and sugar (debit). What is her balance if she started at ₹0?",
                    "steps": [
                        "Credit is positive, debit is negative: (+750) + (−900)",
                        "Different signs: 900 − 750 = 150; the debit is bigger, so the sign is −",
                        "Balance = <strong>−150</strong>",
                    ],
                    "answer": "−₹150: she is ₹150 short",
                },
                {
                    "title": "Freezer temperature change",
                    "question": "A bottle of water at 30 °C is put in a freezer and cools to −18 °C. Find the change in temperature.",
                    "steps": [
                        "Change = end − start = (−18) − (+30)",
                        "Add the opposite: (−18) + (−30)",
                        "Same signs: 18 + 30 = 48, keep −: <strong>−48</strong>",
                    ],
                    "answer": "−48 °C: it became 48 degrees colder",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Model the 4-step routine (picture, sentence with brackets, add the opposite, sign rule) aloud for Q1–Q2, then let students lead Q3 onwards.",
                "For Q4, ask: how many integers between −10 and 10? (19). Students who forget 0 get 18.",
            ],
            [
                "Writing 6 − 4 = 2 for Q6 (ignoring that the fish is below zero).",
                "In Q7, adding the wrong number of zero pairs.",
                "Forgetting the unit or the meaning of the sign in word problems (−150 means 'short by ₹150').",
            ],
            "Pair-share: student A solves an odd-numbered question aloud while B checks against the steps; swap roles for even-numbered questions.",
            "Covers Ganita Prakash Ch. 10 'Figure it out' patterns and old NCERT Ch. 6 exercises 6.1–6.3.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Integers (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>You have travelled with Harsh and Disha from a freezing night in Ladakh to Brahmagupta's rules. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering negative numbers in real life, the number line, comparing, opposites, adding (lift and tokens), subtracting (zero pairs and adding the opposite) and word problems.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Picture a number line before choosing: further right is greater, adding a negative moves left, subtracting a negative moves right.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Integers: The Other Side of Zero · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "Which is greater: −8 or −3?", "options": ["−8", "−3", "They are equal", "We cannot compare them"], "answer": 1, "explanation": "−3 is to the right of −8 on the number line, so −3 > −8 (−3 °C is warmer than −8 °C).", "topic": "Comparing integers"},
                {"q": "What is the opposite of −12?", "options": ["−12", "0", "12", "1/12"], "answer": 2, "explanation": "Opposites are the same distance from 0 on opposite sides: −12 and +12. Check: (−12) + (+12) = 0.", "topic": "Opposites"},
                {"q": "(−7) + (+4) = ?", "options": ["−11", "−3", "3", "11"], "answer": 1, "explanation": "4 zero pairs cancel and 3 green tokens are left: −3.", "topic": "Adding integers"},
                {"q": "(−6) − (+5) = ?", "options": ["−1", "1", "−11", "11"], "answer": 2, "explanation": "Add the opposite: (−6) + (−5) = −11.", "topic": "Subtracting integers"},
                {"q": "(+2) − (−9) = ?", "options": ["−7", "7", "11", "−11"], "answer": 2, "explanation": "Subtracting −9 is adding +9: 2 + 9 = 11.", "topic": "Subtracting integers"},
                {"q": "A lift is on floor −2. It goes up 5 floors. Which floor is it on now?", "options": ["−7", "+3", "+7", "−3"], "answer": 1, "explanation": "(−2) + (+5) = +3.", "topic": "Lift / number line"},
                {"q": "At night in Leh it is −11 °C. By noon the temperature rises by 9 °C. What is the noon temperature?", "options": ["−20 °C", "−2 °C", "2 °C", "20 °C"], "answer": 1, "explanation": "(−11) + (+9) = −2 °C. It is still below zero.", "topic": "Temperature"},
                {"q": "How many integers are there between −3 and 3 (not counting −3 and 3)?", "options": ["4", "5", "6", "7"], "answer": 1, "explanation": "−2, −1, 0, 1, 2: five integers. Remember to count 0.", "topic": "Number line"},
                {"q": "A team's results: won by 15 runs, lost by 22 runs, won by 3 runs. What is its run difference?", "options": ["−4", "+4", "−10", "+40"], "answer": 0, "explanation": "(+15) + (−22) + (+3) = −7 + 3 = −4.", "topic": "Real-life integers"},
                {"q": "A paddy field in Kuttanad is at −2 m and the top of a coconut tree nearby is at +12 m. What is the difference in their heights?", "options": ["10 m", "12 m", "14 m", "−14 m"], "answer": 2, "explanation": "Higher − lower = 12 − (−2) = 12 + 2 = 14 m.", "topic": "Sea level"},
            ],
        },
        "teacherNotes": teacher(
            [
                "Use the exam as a diagnostic: the 'Review these' list on a failed attempt shows exactly which story to revisit.",
            ],
            [
                "Q1 catches students who compare negative numbers by size alone.",
                "Q5 and Q10 catch students who forget that subtracting a negative means adding.",
                "Q8 catches students who forget to count 0.",
            ],
            "Exit ticket: before the exam, every student writes one example each of a positive, a negative and a zero situation from their own life.",
            "Matches Ganita Prakash Ch. 10 learning outcomes and old NCERT Ch. 6 exam patterns.",
        ),
    },
]


def seed_class6_integers():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Integers: The Other Side of Zero")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Integers: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Integers: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_integers()
