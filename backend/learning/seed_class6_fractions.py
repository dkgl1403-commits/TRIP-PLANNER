import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Fractions (old NCERT Ch. 7 "Fractions"; Ganita Prakash Ch. 7 "Fractions": fractional units, equal
# shares, the fraction wall, number line, mixed fractions, equivalence, comparison, addition and subtraction,
# and "A pinch of history"). Story: the Jaipur family from a pizza night through Makar Sankranti kite flying,
# Mummy's bakery orders and a Diwali party.
#
# Verified facts used:
# - The Sanskrit word for a fraction is "bhinna", meaning "broken". (MacTutor History of Mathematics,
#   "Earliest Uses of Symbols for Fractions"; MAA Convergence.)
# - Brahmagupta (628 CE) and Bhaskara (about 1150 CE) wrote fractions with the numerator above the denominator
#   but without a bar; the horizontal bar was added later by mathematicians of the Arab world (credited to
#   al-Hassar, 12th century, Maghreb) and spread to Europe through Fibonacci. (MacTutor, St Andrews; Muslim
#   Heritage, "Abu Bakr al-Hassar".) Narration only says "later, mathematicians in the Arab world added the line".


SCENES_1 = [
    scene([
        L("Narrator", "It is Saturday night in Jaipur, and Mummy has baked a big round pizza for the family.",
          "Jaipur mein Shanivaar ki raat hai, aur Mummy ne poore parivaar ke liye ek bada gol pizza banaaya hai."),
        L("Neha", "Four of us are hungry, so I am cutting it into 4 equal slices.", "Hum chaar log bhookhe hain, isliye main ise 4 barabar slices mein kaat rahi hoon."),
    ], {"mode": "pizza", "den": 4, "num": 0}),
    scene([
        L("Harsh", "I take one slice! That is one out of four.", "Main ek slice leta hoon! Yeh chaar mein se ek hai."),
        L("Dadi", "Yes, beta. We write it as 1 over 4 and call it one fourth, or one quarter. A fraction is a part of a whole.",
          "Haan beta. Ise hum 1 ke upar 4 likhte hain aur one fourth, ya ek chauthaai kehte hain. Fraction ek poore ka hissa hota hai."),
    ], {"mode": "pizza", "den": 4, "num": 1}),
    scene([
        L("Dadi", "The number below, 4, is the denominator. It tells how many equal parts the whole is cut into. The number on top is the numerator. It tells how many parts we take.",
          "Neeche wala number, 4, denominator hai. Yeh batata hai ki poora kitne barabar hisson mein kata hai. Upar wala number numerator hai. Yeh batata hai ki hum kitne hisse lete hain."),
        L("Disha", "So if Harsh and I both take a slice, we have 2 over 4 of the pizza together!", "Toh agar Harsh aur main dono ek ek slice lein, toh hamare paas milkar pizza ka 2 ke upar 4 hai!"),
    ], {"mode": "pizza", "den": 4, "num": 2}),
    scene([
        L("Harsh", "Let me cut the next pizza. Four pieces, done!", "Agla pizza main kaatta hoon. Chaar tukde, ho gaya!"),
        L("Disha", "Harsh, your pieces are all different sizes! The red one is tiny.", "Harsh, tumhaare tukde sab alag size ke hain! Laal wala toh bahut chhota hai."),
        L("Dadi", "Then that red piece is not one fourth. A fraction only makes sense when every part is equal.",
          "Toh woh laal tukda one fourth nahi hai. Fraction ka matlab tabhi banta hai jab har hissa barabar ho."),
    ], {"mode": "unequal"}),
    scene([
        L("Deepak", "Fractions are everywhere at the railway too. This chocolate bar from the station has 6 equal pieces. If I eat 5, I have eaten 5 sixths.",
          "Railway par bhi fractions har jagah hain. Station se laayi is chocolate bar mein 6 barabar tukde hain. Agar main 5 kha loon, toh maine 5 bata 6 kha liya."),
        L("Harsh", "And only 1 sixth is left for me. Not fair, Papa!", "Aur mere liye sirf 1 bata 6 bacha. Yeh theek nahi hai, Papa!"),
    ], {"mode": "bar", "den": 6, "num": 5}),
    scene([
        L("Neha", "A fraction can also be part of a group. Here is a box of 12 laddoos. Disha, give one third of them to Dadi.",
          "Fraction ek group ka hissa bhi ho sakta hai. Yeh 12 laddoo ka dabba hai. Disha, inka ek tihaai Dadi ko do."),
        L("Disha", "I make 3 equal groups. Each group has 4 laddoos, so one third of 12 is 4!", "Main 3 barabar group banaati hoon. Har group mein 4 laddoo hain, toh 12 ka ek tihaai 4 hai!"),
    ], {"mode": "collection", "den": 3, "num": 1, "total": 12}),
    scene([
        L("Dadi", "And two thirds of 12? Two of those groups, so 2 times 4, which is 8 laddoos.",
          "Aur 12 ka do tihaai? Un mein se do group, yaani 2 guna 4, barabar 8 laddoo."),
    ], {"mode": "collection", "den": 3, "num": 2, "total": 12}),
    scene([
        L("Neha", "Your turn! Cut the pizza into 8 equal slices and show 3 eighths.", "Ab aapki baari! Pizza ko 8 barabar slices mein kaato aur 3 bata 8 dikhaao."),
    ], {"mode": "pizza", "den": 4, "num": 0, "task": {"num": 3, "den": 8}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "On Sunday, Papa lays out his toy railway track again. Today each kilometre is marked into smaller parts.",
          "Itvaar ko Papa phir se apna toy railway track bichhaate hain. Aaj har kilometre chhote hisson mein bata hua hai."),
        L("Deepak", "Between stone 0 and stone 1, I put 3 small marks, so the kilometre is cut into 4 equal parts.",
          "Pathar 0 aur pathar 1 ke beech maine 3 chhote nishaan lagaaye, toh kilometre 4 barabar hisson mein kat gaya."),
    ], {"den": 4, "num": 0, "max": 3}),
    scene([
        L("Deepak", "The train moves 3 of those parts. It stops at 3 fourths of a kilometre.",
          "Train un mein se 3 hisse chalti hai. Woh ek kilometre ke 3 bata 4 par rukti hai."),
        L("Dadi", "So fractions live on the number line too, between the whole numbers. 3 fourths is between 0 and 1.",
          "Toh fractions number line par bhi rehte hain, whole numbers ke beech mein. 3 bata 4, 0 aur 1 ke beech hai."),
    ], {"den": 4, "num": 3, "max": 3}),
    scene([
        L("Disha", "When the numerator is smaller than the denominator, the train has not reached stone 1 yet.",
          "Jab numerator denominator se chhota hota hai, toh train abhi pathar 1 tak nahi pahunchi."),
        L("Dadi", "Exactly. Such a fraction is less than 1, and we call it a proper fraction.",
          "Bilkul. Aisa fraction 1 se chhota hota hai, aur use proper fraction kehte hain."),
    ], {"den": 4, "num": 3, "max": 3}),
    scene([
        L("Harsh", "Full speed! The train goes 4 parts. That is 4 fourths, and it is exactly at stone 1!",
          "Full speed! Train 4 hisse jaati hai. Yeh 4 bata 4 hai, aur woh theek pathar 1 par hai!"),
        L("Dadi", "Yes. 4 fourths makes one whole. Any number over itself equals 1.", "Haan. 4 bata 4 ek poora banata hai. Koi bhi number apne upar khud se, 1 ke barabar hota hai."),
    ], {"den": 4, "num": 4, "max": 3}),
    scene([
        L("Harsh", "And now 7 parts. The train is past stone 1!", "Aur ab 7 hisse. Train pathar 1 se aage nikal gayi!"),
        L("Dadi", "7 fourths is more than 1. When the numerator is bigger than the denominator, it is an improper fraction.",
          "7 bata 4, 1 se zyaada hai. Jab numerator denominator se bada ho, toh woh improper fraction hai."),
    ], {"den": 4, "num": 7, "max": 3}),
    scene([
        L("Deepak", "Look at the stones. The train passed 1 whole kilometre and then 3 more fourths.", "Patharon ko dekho. Train 1 poora kilometre aur phir 3 bata 4 aur aage gayi."),
        L("Dadi", "So 7 fourths equals 1 and 3 fourths. A whole number with a proper fraction is called a mixed number.",
          "Toh 7 bata 4 barabar 1 aur 3 bata 4. Whole number ke saath proper fraction ko mixed number kehte hain."),
    ], {"den": 4, "num": 7, "max": 3, "showMixed": True}),
    scene([
        L("Disha", "What if Papa cuts each kilometre into 2 parts instead? Then 3 halves is the same as 1 and a half!",
          "Agar Papa har kilometre ko 2 hisson mein kaatein? Toh 3 bata 2, 1 aur aadhe ke barabar hai!"),
    ], {"den": 2, "num": 3, "max": 3, "showMixed": True}),
    scene([
        L("Deepak", "Your turn, junior engineer! Park the train at 9 fourths of a kilometre.", "Ab aapki baari, junior engineer! Train ko 9 bata 4 kilometre par park karo."),
    ], {"den": 4, "num": 2, "max": 3, "task": {"num": 9, "den": 4}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "On Monday, Dadi makes a rangoli on the floor with long coloured strips, one above the other.",
          "Somvaar ko Dadi zameen par lambi rangeen pattiyon se ek rangoli banaati hain, ek ke upar ek."),
        L("Dadi", "Every strip is the same length, one whole. But I have cut each strip into a different number of equal parts. This is a fraction wall.",
          "Har patti ki lambaai ek jaisi hai, ek poora. Lekin har patti ko maine alag alag barabar hisson mein kaata hai. Yeh fraction wall hai."),
    ], {"mode": "wall", "num": 1, "den": 1}),
    scene([
        L("Dadi", "Now I colour one half of the top strips. Look at the dotted line.", "Ab main upar ki pattiyon ka aadha rangti hoon. Dotted line ko dekho."),
        L("Disha", "1 half, 2 fourths, 3 sixths and 4 eighths all end at the same line!", "1 bata 2, 2 bata 4, 3 bata 6 aur 4 bata 8, sab ek hi line par khatam hote hain!"),
        L("Dadi", "They cover the same length, so they are equal. Fractions that are equal are called equivalent fractions.",
          "Yeh sab ek jitni lambaai dhakte hain, isliye barabar hain. Jo fractions barabar hote hain, unhe equivalent fractions kehte hain."),
    ], {"mode": "wall", "num": 1, "den": 2}),
    scene([
        L("Harsh", "One third matches 2 sixths. But no row of fourths matches it!", "Ek tihaai, 2 bata 6 se milta hai. Lekin chauthaai wali koi row usse nahi milti!"),
    ], {"mode": "wall", "num": 1, "den": 3}),
    scene([
        L("Neha", "In my bakery, I do this with cakes. Here is a cake bar, and 2 of its 3 pieces are sold.", "Meri bakery mein main cake ke saath yeh karti hoon. Yeh cake bar hai, aur iske 3 mein se 2 tukde bik gaye."),
    ], {"mode": "equiv", "num": 2, "den": 3, "k": 1}),
    scene([
        L("Neha", "Now I cut every piece into 2. There are 6 pieces in all, and 4 of them are sold. The cake did not change!",
          "Ab main har tukde ko 2 mein kaatti hoon. Kul 6 tukde hain, aur un mein se 4 bik gaye. Cake toh badla hi nahi!"),
        L("Dadi", "So 2 thirds equals 4 sixths. Multiply the numerator and the denominator by the same number, and you get an equivalent fraction.",
          "Toh 2 bata 3 barabar 4 bata 6. Numerator aur denominator dono ko ek hi number se guna karo, toh equivalent fraction milta hai."),
    ], {"mode": "equiv", "num": 2, "den": 3, "k": 2}),
    scene([
        L("Neha", "Cut each piece into 4 instead. Now it is 8 twelfths, still the same cake.", "Har tukde ko 4 mein kaato. Ab yeh 8 bata 12 hai, cake wahi ka wahi."),
    ], {"mode": "equiv", "num": 2, "den": 3, "k": 4}),
    scene([
        L("Disha", "Can we go backwards too? Like 6 eighths?", "Kya hum ulta bhi ja sakte hain? Jaise 6 bata 8?"),
        L("Dadi", "Yes! Divide both by the same number. 6 and 8 can both be divided by 2, so 6 eighths is 3 fourths. 3 and 4 have no common factor except 1, so 3 fourths is in its simplest form.",
          "Haan! Dono ko ek hi number se divide karo. 6 aur 8 dono 2 se divide hote hain, toh 6 bata 8 barabar 3 bata 4. 3 aur 4 ka 1 ke alaawa koi common factor nahi, isliye 3 bata 4 apne simplest form mein hai."),
        L("Dadi", "The quick way is to divide both by their H C F, the highest common factor.", "Jaldi ka tareeka hai dono ko unke H C F, yaani highest common factor, se divide karna."),
    ], {"mode": "equiv", "num": 3, "den": 4, "k": 2}),
    scene([
        L("Neha", "Your turn! Write 2 thirds as an equivalent fraction with denominator 12. Cut each piece just right.",
          "Ab aapki baari! 2 bata 3 ko aise equivalent fraction mein likho jiska denominator 12 ho. Har tukde ko sahi tarah kaato."),
    ], {"mode": "equiv", "num": 2, "den": 3, "k": 1, "task": {"base": [2, 3], "den": 12}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "It is Makar Sankranti, and the rooftops of Jaipur are full of kites. Harsh and Disha are flying theirs.",
          "Makar Sankranti hai, aur Jaipur ki chhatein patangon se bhari hain. Harsh aur Disha apni patang uda rahe hain."),
        L("Disha", "Each of us has a spool of string. I have let out 3 fifths of mine, and Harsh has let out 2 fifths of his.",
          "Hum dono ke paas dor ki ek charkhi hai. Maine apni dor ka 3 bata 5 chhoda hai, aur Harsh ne apni ka 2 bata 5."),
    ], {"mode": "bars", "a": [3, 5], "b": [2, 5]}),
    scene([
        L("Dadi", "Both are fifths, so the pieces are the same size. 3 pieces is more than 2 pieces, so 3 fifths is greater than 2 fifths.",
          "Dono fifths hain, isliye tukde ek hi size ke hain. 3 tukde, 2 tukdon se zyaada hain, toh 3 bata 5, 2 bata 5 se bada hai."),
        L("Dadi", "These are like fractions, with the same denominator. Just compare the numerators.", "Yeh like fractions hain, jinka denominator same hai. Bas numerators compare karo."),
    ], {"mode": "bars", "a": [3, 5], "b": [2, 5]}),
    scene([
        L("Harsh", "Now I have let out 1 third, and Disha only 1 sixth. Mine is longer!", "Ab maine 1 bata 3 chhoda hai, aur Disha ne sirf 1 bata 6. Meri wali lambi hai!"),
        L("Dadi", "Right. The same one piece, but a third is bigger than a sixth. With the same numerator, the smaller denominator gives the bigger fraction.",
          "Sahi. Ek hi tukda, lekin tihaai, chhathe hisse se bada hai. Numerator same ho, toh chhote denominator wala fraction bada hota hai."),
    ], {"mode": "bars", "a": [1, 6], "b": [1, 3]}),
    scene([
        L("Disha", "But now I have 3 fourths and Harsh has 2 thirds. Different pieces and different numbers! Who is ahead?",
          "Lekin ab mere paas 3 bata 4 hai aur Harsh ke paas 2 bata 3. Tukde bhi alag, number bhi alag! Kaun aage hai?"),
        L("Deepak", "At the railway, we never compare two lengths in different units. First convert both to the same unit!",
          "Railway mein hum do lambaaiyan alag alag units mein compare nahi karte. Pehle dono ko ek hi unit mein badlo!"),
    ], {"mode": "bars", "a": [3, 4], "b": [2, 3]}),
    scene([
        L("Dadi", "The L C M of 4 and 3 is 12, so cut both strings into twelfths. 3 fourths becomes 9 twelfths, and 2 thirds becomes 8 twelfths.",
          "4 aur 3 ka L C M 12 hai, toh dono doron ko twelfths mein kaato. 3 bata 4 ban jaata hai 9 bata 12, aur 2 bata 3 ban jaata hai 8 bata 12."),
        L("Disha", "9 is more than 8, so 3 fourths is greater. I win!", "9, 8 se zyaada hai, toh 3 bata 4 bada hai. Main jeet gayi!"),
    ], {"mode": "common", "a": [3, 4], "b": [2, 3]}),
    scene([
        L("Harsh", "Wait, my teacher showed a trick: cross multiply. 3 times 3 is 9, and 2 times 4 is 8. Same answer!",
          "Ruko, mere teacher ne ek trick sikhaayi thi: cross multiply. 3 guna 3 barabar 9, aur 2 guna 4 barabar 8. Wahi jawaab!"),
        L("Dadi", "Shabash. That trick works because it secretly makes the same common denominator, 4 times 3.",
          "Shabash. Yeh trick isliye chalti hai kyonki chupke se wahi common denominator banati hai, 4 guna 3."),
    ], {"mode": "common", "a": [3, 4], "b": [2, 3]}),
    scene([
        L("Disha", "Harsh, your turn! My string is at 3 fourths. Give your kite a fraction with a different denominator that is exactly equal to mine.",
          "Harsh, ab tumhaari baari! Meri dor 3 bata 4 par hai. Apni patang ko alag denominator wala aisa fraction do jo mere fraction ke bilkul barabar ho."),
    ], {"mode": "bars", "a": [3, 4], "b": [1, 2], "task": "equal"}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "On Tuesday, Mummy's bakery gets orders for cake by the piece.", "Mangalvaar ko Mummy ki bakery ko tukdon mein cake ke orders milte hain."),
        L("Neha", "This cake is cut into 8 equal pieces. One customer took 3 eighths, another took 2 eighths. How much is gone?",
          "Yeh cake 8 barabar tukdon mein kata hai. Ek customer ne 3 bata 8 liya, doosre ne 2 bata 8. Kitna gaya?"),
    ], {"op": "add", "a": [3, 8], "b": [2, 8]}),
    scene([
        L("Disha", "Same size pieces, so just count them! 3 plus 2 is 5. Five eighths are gone.", "Ek hi size ke tukde, toh bas gino! 3 plus 2 barabar 5. Paanch bata 8 gaya."),
        L("Dadi", "Right. To add like fractions, add the numerators and keep the denominator.", "Sahi. Like fractions jodne ke liye numerators jodo aur denominator wahi rakho."),
    ], {"op": "add", "a": [3, 8], "b": [2, 8]}),
    scene([
        L("Harsh", "Easy! Then 1 half plus 1 third is 2 fifths. Add the tops and add the bottoms!",
          "Aasaan! Toh 1 bata 2 plus 1 bata 3 barabar 2 bata 5. Upar wale jodo aur neeche wale jodo!"),
        L("Dadi", "Think, Harsh. A half alone is more than 2 fifths. How can adding more cake give less? Never add the denominators.",
          "Socho, Harsh. Akela aadha hi 2 bata 5 se zyaada hai. Aur cake jodne se kam kaise ho sakta hai? Denominators kabhi mat jodo."),
    ], {"op": "add", "a": [1, 2], "b": [1, 3]}),
    scene([
        L("Neha", "First cut both into same size pieces. The L C M of 2 and 3 is 6. A half is 3 sixths, and a third is 2 sixths.",
          "Pehle dono ko ek size ke tukdon mein kaato. 2 aur 3 ka L C M 6 hai. Aadha barabar 3 bata 6, aur tihaai barabar 2 bata 6."),
        L("Disha", "3 sixths plus 2 sixths is 5 sixths!", "3 bata 6 plus 2 bata 6 barabar 5 bata 6!"),
    ], {"op": "add", "a": [1, 2], "b": [1, 3]}),
    scene([
        L("Neha", "A customer orders 3 fourths of a cake, and another orders 1 half. That is 3 fourths plus 2 fourths, which is 5 fourths, more than one cake!",
          "Ek customer 3 bata 4 cake mangaata hai, aur doosra aadha. Yeh hai 3 bata 4 plus 2 bata 4, barabar 5 bata 4, ek cake se zyaada!"),
        L("Dadi", "5 fourths is 1 and 1 fourth. Mummy must open a second cake.", "5 bata 4 barabar 1 aur 1 bata 4. Mummy ko doosra cake kholna padega."),
    ], {"op": "add", "a": [3, 4], "b": [1, 2]}),
    scene([
        L("Neha", "Subtraction works the same way. I had 5 sixths of a cake left and sold 1 third. 1 third is 2 sixths.",
          "Subtraction bhi aise hi hota hai. Mere paas 5 bata 6 cake bacha tha aur maine 1 bata 3 becha. 1 bata 3 barabar 2 bata 6."),
        L("Disha", "5 sixths minus 2 sixths is 3 sixths, and that simplifies to 1 half!", "5 bata 6 minus 2 bata 6 barabar 3 bata 6, aur woh simplify hokar 1 bata 2 hai!"),
    ], {"op": "sub", "a": [5, 6], "b": [1, 3]}),
    scene([
        L("Neha", "Your turn! A customer wants exactly one whole cake made of two fractions with different denominators. Choose them.",
          "Ab aapki baari! Ek customer ko do alag denominator wale fractions se bilkul ek poora cake chahiye. Unhe chuno."),
    ], {"op": "add", "a": [1, 2], "b": [1, 3], "task": {"num": 1, "den": 1}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "It is Diwali night. The house glows with diyas, and Mummy has made pizzas for all the cousins.",
          "Diwali ki raat hai. Ghar diyon se jagmaga raha hai, aur Mummy ne saare cousins ke liye pizzas banaaye hain."),
        L("Neha", "Every pizza is cut into 4 slices. After the party, 7 slices are left on the plate.", "Har pizza 4 slices mein kata hai. Party ke baad plate par 7 slices bachi hain."),
    ], {"mode": "convert", "num": 7, "den": 4}),
    scene([
        L("Disha", "7 fourths. I can fill one whole pizza with 4 slices, and 3 slices are left over.", "7 bata 4. 4 slices se ek poora pizza bhar sakti hoon, aur 3 slices bachti hain."),
        L("Dadi", "So 7 fourths is 1 and 3 fourths. To change an improper fraction to a mixed number, divide: 7 divided by 4 is 1, remainder 3.",
          "Toh 7 bata 4 barabar 1 aur 3 bata 4. Improper fraction ko mixed number banaane ke liye divide karo: 7 bhaag 4 barabar 1, remainder 3."),
    ], {"mode": "convert", "num": 7, "den": 4}),
    scene([
        L("Harsh", "The cousins left 11 slices at their table!", "Cousins ne apni table par 11 slices chhodi hain!"),
        L("Disha", "11 divided by 4 is 2, remainder 3. So that is 2 whole pizzas and 3 fourths.", "11 bhaag 4 barabar 2, remainder 3. Toh yeh 2 poore pizza aur 3 bata 4 hai."),
    ], {"mode": "convert", "num": 11, "den": 4}),
    scene([
        L("Dadi", "And going back: 2 and 3 fourths. 2 wholes are 2 times 4, which is 8 slices, plus 3 more, so 11 fourths.",
          "Aur waapas jaana: 2 aur 3 bata 4. 2 poore matlab 2 guna 4, yaani 8 slices, plus 3 aur, toh 11 bata 4."),
        L("Dadi", "Whole times denominator, plus numerator, over the same denominator.", "Whole guna denominator, plus numerator, aur denominator wahi."),
    ], {"mode": "convert", "num": 11, "den": 4}),
    scene([
        L("Dadi", "Now a story from our own history. In Sanskrit, a fraction was called bhinna, which means broken. A whole broken into equal parts!",
          "Ab hamare apne itihaas ki ek kahaani. Sanskrit mein fraction ko bhinna kehte the, jiska matlab hai toota hua. Ek poora, barabar hisson mein toota hua!"),
        L("Dadi", "Brahmagupta, in the year 628, wrote a fraction with one number above the other, just like we do. But he drew no line between them.",
          "Brahmagupta ne saal 628 mein fraction ko ek number ke upar doosra likhkar dikhaaya, bilkul hamari tarah. Lekin unhone beech mein koi line nahi khinchi."),
    ], {"mode": "history"}),
    scene([
        L("Dadi", "Later, mathematicians in the Arab world added the line in between, and that is how we write fractions today.",
          "Baad mein, Arab duniya ke ganitagyon ne beech mein line jodi, aur aaj hum fractions aise hi likhte hain."),
        L("Disha", "So the fraction I write in my notebook has travelled across the world!", "Toh jo fraction main apni copy mein likhti hoon, woh poori duniya ghoomkar aaya hai!"),
    ], {"mode": "history"}),
    scene([
        L("Neha", "Your turn! Put 2 and 3 fourths of a pizza on the plate. How many fourths is that?",
          "Ab aapki baari! Plate par 2 aur 3 bata 4 pizza rakho. Yeh kitne fourths hain?"),
    ], {"mode": "convert", "num": 5, "den": 4, "task": {"whole": 2, "num": 3, "den": 4}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "After Diwali, Dadi sets a fraction quiz at the dining table.", "Diwali ke baad, Dadi dining table par fractions ka quiz rakhti hain."),
        L("Dadi", "Question 1. Find 3 fifths of 40 rupees.", "Sawaal 1. 40 rupaye ka 3 bata 5 nikaalo."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "One fifth of 40 is 40 divided by 5, which is 8. Three fifths is 3 times 8, so 24 rupees.",
          "40 ka ek bata 5 hai 40 bhaag 5, yaani 8. Teen bata 5 hai 3 guna 8, toh 24 rupaye."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. Which is greater, 5 sixths or 7 ninths?", "Sawaal 2. Kaun bada hai, 5 bata 6 ya 7 bata 9?"),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "The L C M of 6 and 9 is 18. 5 sixths is 15 eighteenths, and 7 ninths is 14 eighteenths. So 5 sixths is greater!",
          "6 aur 9 ka L C M 18 hai. 5 bata 6 barabar 15 bata 18, aur 7 bata 9 barabar 14 bata 18. Toh 5 bata 6 bada hai!"),
        L("Dadi", "Shabash, Harsh. No tricks needed when you know the method.", "Shabash, Harsh. Tareeka aata ho toh kisi trick ki zaroorat nahi."),
    ], {"example": 1, "step": 4}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _wall_svg():
    """1/2 shown equal to 2/4 and 4/8 as three stacked strips."""
    parts = ['<svg viewBox="0 0 320 120" width="320" height="120" xmlns="http://www.w3.org/2000/svg">']
    for row, (den, colour) in enumerate([(2, "#fbbf24"), (4, "#f472b6"), (8, "#38bdf8")]):
        y = 10 + row * 36
        w = 240 / den
        for i in range(den):
            fill = colour if i < den // 2 else "#0f172a"
            parts.append(f'<rect x="{10 + i * w}" y="{y}" width="{w}" height="28" fill="{fill}" stroke="#e2e8f0" stroke-width="1.5"/>')
        parts.append(f'<text x="262" y="{y + 20}" fill="{colour}" font-size="14" font-weight="bold" font-family="monospace">{den // 2}/{den}</text>')
    parts.append('<line x1="130" y1="4" x2="130" y2="116" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="5 4"/>')
    parts.append('</svg>')
    return "".join(parts)


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Pizza Night · What Is a Fraction?",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On a Saturday night, Mummy cuts a pizza into 4 equal slices. Harsh grabs one, cuts the next pizza very unequally, and Dadi explains why a fraction needs equal parts. Then Disha shares a box of laddoos.</div>

<h2>A fraction is a part of a whole</h2>
<div {FORMULA}>fraction = numerator / denominator</div>
<div {CARD}>
  <div><strong class="text-sky-300">Denominator</strong> (bottom): how many <em>equal</em> parts the whole is divided into.</div>
  <div><strong class="text-amber-300">Numerator</strong> (top): how many of those parts are taken.</div>
  <div>1/4 is read "one fourth" or "one quarter"; 1/2 "one half"; 3/8 "three eighths".</div>
</div>
<p><strong>The parts must be equal.</strong> A pizza cut into 4 pieces of different sizes does not show fourths. Each piece of a whole cut into n equal parts is a <strong>unit fraction</strong> 1/n.</p>

<h2>Fraction of a collection</h2>
<p>To find a fraction of a group, split the group into as many equal groups as the denominator, then take as many groups as the numerator.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Question</th><th class="text-left">Working</th><th>Answer</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>1/3 of 12 laddoos</td><td>12 ÷ 3 = 4 in each group</td><td class="text-center">4</td></tr>
    <tr><td>2/3 of 12 laddoos</td><td>2 groups of 4 = 2 × 4</td><td class="text-center">8</td></tr>
    <tr><td>3/4 of 20 rupees</td><td>20 ÷ 4 = 5, then 3 × 5</td><td class="text-center">₹15</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "A fraction counts equal parts: the denominator says how many equal parts make the whole, the numerator says how many we take.",
        "widgetType": "Class6FractionPizzaWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "A chocolate bar has 6 equal pieces. Harsh eats 5 of them. What fraction did he eat?",
            "options": ["1/6", "5/6", "6/5", "5/1"],
            "correctIndex": 1,
            "explanation": "The bar has 6 equal parts (denominator 6) and 5 were eaten (numerator 5), so 5/6.",
        },
        "teacherNotes": teacher(
            [
                "Start with real sharing: fold a paper strip in half, then in quarters. Ask what each piece is called.",
                "Show one unfair cut on purpose and ask 'is this one quarter?' to fix the idea of equal parts.",
                "For a collection, physically make the equal groups before writing any multiplication.",
            ],
            [
                "Counting parts without checking they are equal.",
                "Writing the denominator as the number of parts NOT taken (writing 1/3 for one slice of a pizza cut into 4).",
                "Thinking 1/3 of 12 means 12 − 3 or 12 × 3.",
            ],
            "Paper folding race: each pair folds a strip into halves, fourths and eighths, shades a fraction you call out, and holds it up.",
            "Old NCERT Ch. 7 Fractions (7.1–7.3 fraction, fraction of a collection); Ganita Prakash Ch. 7 (fractional units, equal shares).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Papa's Track · Fractions on the Number Line",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Papa marks every kilometre of the toy track into equal parts. The train stops between the stones, goes past stone 1, and the family finds out how improper fractions and mixed numbers are the same distance written two ways.</div>

<h2>Placing a fraction on the number line</h2>
<p>To mark n/d: divide each gap between whole numbers into <strong>d equal parts</strong>, then count <strong>n parts</strong> from 0.</p>

<h2>Proper, improper and mixed</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Type</th><th class="text-left">Rule</th><th class="text-left">Examples</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Proper fraction</td><td>numerator &lt; denominator (less than 1)</td><td>3/4, 2/5, 7/9</td></tr>
    <tr><td>Improper fraction</td><td>numerator ≥ denominator (1 or more)</td><td>4/4, 7/4, 9/2</td></tr>
    <tr><td>Mixed number</td><td>a whole number and a proper fraction</td><td>1 3/4, 4 1/2</td></tr>
  </tbody>
</table>
<div {FORMULA}>4/4 = 1   ·   7/4 = 1 3/4   ·   3/2 = 1 1/2</div>
<div {CARD}>
  <div>Any number over itself is 1: 5/5 = 9/9 = 1.</div>
  <div>Every proper fraction lies between 0 and 1 on the number line; every improper fraction lies at 1 or beyond.</div>
</div>
""",
        "keyInsight": "Fractions fill the gaps between whole numbers: cut each gap into d equal parts and count n of them to reach n/d.",
        "widgetType": "Class6FractionLineWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "Which of these is an improper fraction?",
            "options": ["3/7", "1/2", "9/4", "5/6"],
            "correctIndex": 2,
            "explanation": "In 9/4 the numerator is bigger than the denominator, so it is more than 1: 9/4 = 2 1/4.",
        },
        "teacherNotes": teacher(
            [
                "Use a long tape on the floor with whole-number stones; let students split one gap into fourths with chalk.",
                "Always ask 'is it before or after 1?' to decide proper or improper.",
                "Connect improper to mixed with the picture: 7 fourths = one full stone gap + 3 fourths.",
            ],
            [
                "Dividing the whole line (0 to 3) into d parts instead of each unit gap.",
                "Thinking 7/4 is 'not a real fraction' because it is more than 1.",
                "Counting tick marks instead of gaps (marking 3/4 at the 4th tick).",
            ],
            "Number line relay: teams get cards (1/2, 3/4, 5/4, 3/2, 2 1/4) and must peg them in the right places on a tape number line from 0 to 3.",
            "Old NCERT Ch. 7 (7.4 fraction on the number line, 7.5–7.6 proper, improper and mixed fractions); Ganita Prakash Ch. 7 (fractions on the number line, mixed fractions).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Dadi's Rangoli · Equivalent Fractions",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Dadi lays coloured strips one above the other: the fraction wall. Mummy cuts her cake pieces smaller and smaller and the cake stays the same. Everyone discovers that one amount can have many names.</div>

<h2>The fraction wall</h2>
<p>Strips of the same length (one whole) are cut into halves, thirds, fourths and so on. Fractions that end at the same place on the wall are <strong>equivalent</strong>: 1/2 = 2/4 = 3/6 = 4/8.</p>

<h2>Making equivalent fractions</h2>
<div {FORMULA}>a/b = (a × k)/(b × k) = (a ÷ k)/(b ÷ k)</div>
<div {CARD}>
  <div>Multiply (or divide) the numerator <strong>and</strong> the denominator by the same non-zero number.</div>
  <div>2/3 = 4/6 = 6/9 = 8/12 (cutting each piece into 2, 3 or 4).</div>
  <div>Check: two fractions a/b and c/d are equivalent when a × d = b × c. For 2/3 and 8/12: 2 × 12 = 24 = 3 × 8.</div>
</div>

<h2>Simplest form</h2>
<p>A fraction is in its <strong>simplest (lowest) form</strong> when the numerator and denominator have no common factor except 1. Divide both by their <strong>HCF</strong>:</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Fraction</th><th>HCF</th><th>Simplest form</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>6/8</td><td class="text-center">2</td><td class="text-center">3/4</td></tr>
    <tr><td>12/18</td><td class="text-center">6</td><td class="text-center">2/3</td></tr>
    <tr><td>36/48</td><td class="text-center">12</td><td class="text-center">3/4</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "Cutting every piece into k smaller pieces multiplies both numerator and denominator by k, but the amount stays the same.",
        "widgetType": "Class6FractionWallWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "Which fraction is NOT equivalent to 2/3?",
            "options": ["4/6", "6/9", "8/12", "3/4"],
            "correctIndex": 3,
            "explanation": "4/6, 6/9 and 8/12 all come from multiplying 2 and 3 by the same number. 3/4 does not: 2 × 4 = 8 but 3 × 3 = 9.",
        },
        "teacherNotes": teacher(
            [
                "Build a paper fraction wall (halves to eighths) as a class; keep it on the wall for the whole chapter.",
                "Emphasise WHY it works: each piece is cut into k, so there are k times as many pieces and k times as many are taken.",
                "Practise simplest form with the HCF from the Playing with Numbers chapter.",
            ],
            [
                "Multiplying only the denominator (2/3 = 2/6).",
                "Adding the same number to top and bottom (2/3 = 3/4).",
                "Stopping before the simplest form (12/18 = 6/9).",
            ],
            "Equivalent fraction snap: cards with fractions face down; students turn two over and keep them if they are equivalent (check with cross products).",
            "Old NCERT Ch. 7 (7.7 equivalent fractions, 7.8 simplest form); Ganita Prakash Ch. 7 (fraction wall, equivalent fractions, lowest terms).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Kite Day · Comparing Fractions",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>On Makar Sankranti, Harsh and Disha fly kites from the rooftop and keep arguing whose string is further out. Papa reminds them that you can only compare lengths in the same unit.</div>

<h2>Three ways to compare</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Case</th><th class="text-left">Rule</th><th class="text-left">Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Same denominator (like fractions)</td><td>Bigger numerator is bigger</td><td>3/5 &gt; 2/5</td></tr>
    <tr><td>Same numerator</td><td>Smaller denominator is bigger (bigger pieces)</td><td>1/3 &gt; 1/6</td></tr>
    <tr><td>Both different (unlike)</td><td>Rewrite with a common denominator (use the LCM), then compare numerators</td><td>3/4 = 9/12 &gt; 8/12 = 2/3</td></tr>
  </tbody>
</table>
<div {FORMULA}>a/b &gt; c/d  exactly when  a × d &gt; c × b</div>
<div {CARD}>
  <div><strong>Cross multiplication</strong> is a shortcut for using the common denominator b × d.</div>
  <div>To arrange several fractions in order, convert them all to the LCM of their denominators.</div>
  <div>Example: 1/2, 2/3, 3/4 → 6/12, 8/12, 9/12, so 1/2 &lt; 2/3 &lt; 3/4.</div>
</div>
""",
        "keyInsight": "You can only compare pieces of the same size: give both fractions a common denominator, then compare numerators.",
        "widgetType": "Class6FractionCompareWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Which is the greatest: 1/2, 3/5 or 4/7?",
            "options": ["1/2", "3/5", "4/7", "They are all equal"],
            "correctIndex": 1,
            "explanation": "LCM of 2, 5, 7 is 70: 1/2 = 35/70, 3/5 = 42/70, 4/7 = 40/70. The greatest is 3/5.",
        },
        "teacherNotes": teacher(
            [
                "Start with like fractions, then same numerators (use the fraction wall: a third is longer than a sixth).",
                "For unlike fractions, insist on the 'same unit' idea before showing cross multiplication.",
                "Ask students to estimate first: is each fraction more or less than one half?",
            ],
            [
                "Thinking 1/6 > 1/3 because 6 > 3.",
                "Comparing only numerators of unlike fractions (2/3 vs 3/5: 'since 3 > 2').",
                "Cross multiplying and then putting the sign the wrong way round.",
            ],
            "Human number line: students hold fraction cards (1/3, 2/5, 1/2, 3/5, 2/3, 3/4) and arrange themselves in order, then check with common denominators.",
            "Old NCERT Ch. 7 (7.9 like and unlike fractions, 7.10 comparing fractions); Ganita Prakash Ch. 7 (comparing fractions).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Bakery Orders · Adding and Subtracting Fractions",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Mummy's customers buy cake by the piece. Harsh tries to add fractions by adding tops and bottoms, and Dadi shows him why that cannot be right.</div>

<h2>Like fractions</h2>
<div {FORMULA}>a/d + b/d = (a + b)/d   ·   a/d − b/d = (a − b)/d</div>
<p>Same-size pieces: just add or subtract how many pieces. 3/8 + 2/8 = 5/8; 7/9 − 4/9 = 3/9 = 1/3.</p>

<h2>Unlike fractions</h2>
<ol>
  <li>Find the LCM of the denominators.</li>
  <li>Change each fraction to an equivalent fraction with that denominator.</li>
  <li>Add or subtract the numerators; simplify the answer.</li>
</ol>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Sum</th><th class="text-left">Working</th><th>Answer</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>1/2 + 1/3</td><td>3/6 + 2/6</td><td class="text-center">5/6</td></tr>
    <tr><td>3/4 + 1/2</td><td>3/4 + 2/4 = 5/4</td><td class="text-center">1 1/4</td></tr>
    <tr><td>5/6 − 1/3</td><td>5/6 − 2/6 = 3/6</td><td class="text-center">1/2</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div><strong class="text-red-300">Never add the denominators.</strong> 1/2 + 1/3 is not 2/5: 1/2 alone is already bigger than 2/5.</div>
</div>
""",
        "keyInsight": "Only same-size pieces can be added or taken away: make the denominators equal first, then work with the numerators.",
        "widgetType": "Class6FractionAddWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "2/3 + 1/4 = ?",
            "options": ["3/7", "11/12", "3/12", "9/12"],
            "correctIndex": 1,
            "explanation": "LCM of 3 and 4 is 12: 2/3 = 8/12 and 1/4 = 3/12, so the sum is 11/12.",
        },
        "teacherNotes": teacher(
            [
                "Use fraction strips: lay a 1/2 strip and a 1/3 strip end to end, then find which sixths strip matches.",
                "Ask 'is the answer bigger than each part?' to catch the add-the-denominators error.",
                "Always finish by simplifying and, if improper, writing as a mixed number.",
            ],
            [
                "Adding numerators and denominators (1/2 + 1/3 = 2/5).",
                "Changing the denominator but not the numerator (1/2 + 1/3 = 1/6 + 1/6).",
                "Forgetting to simplify (3/6 instead of 1/2).",
            ],
            "Bakery shop role-play: one student orders two pieces (for example 1/4 and 1/3 of a cake); the 'baker' must say what fraction of a cake that is, and how much is left.",
            "Old NCERT Ch. 7 (7.11 addition and subtraction of fractions); Ganita Prakash Ch. 7 (addition and subtraction of fractions).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Diwali Party · Mixed Numbers and a Pinch of History",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>After the Diwali party, slices of pizza are left on every table. Disha turns them back into whole pizzas, and Dadi tells how Indian mathematicians wrote fractions over 1,300 years ago.</div>

<h2>Improper fraction → mixed number</h2>
<p>Divide the numerator by the denominator: the quotient is the whole number, the remainder is the new numerator.</p>
<div {FORMULA}>11/4: 11 ÷ 4 = 2 remainder 3  →  2 3/4</div>

<h2>Mixed number → improper fraction</h2>
<div {FORMULA}>w n/d = (w × d + n)/d   ·   2 3/4 = (2 × 4 + 3)/4 = 11/4</div>

<h2>Adding mixed numbers</h2>
<p>Either add wholes and fractions separately, or change both to improper fractions first:</p>
<div {CARD}>
  <div>1 1/2 + 2 1/4 = (1 + 2) + (2/4 + 1/4) = 3 3/4</div>
  <div>2 1/3 − 1 1/2 = 7/3 − 3/2 = 14/6 − 9/6 = 5/6</div>
</div>

<h2>A pinch of history</h2>
<div {CARD}>
  <div>In Sanskrit a fraction was called <strong>bhinna</strong>, meaning "broken": a whole broken into equal parts.</div>
  <div><strong>Brahmagupta</strong> (628 CE) and later <strong>Bhaskara</strong> wrote fractions with one number above the other, as we do, but <em>without</em> a line. The line between numerator and denominator was added later by mathematicians of the Arab world, and from there it reached Europe.</div>
</div>
""",
        "keyInsight": "An improper fraction and a mixed number are the same amount: divide to go one way, multiply and add to come back.",
        "widgetType": "Class6MixedNumbersWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Write 3 2/5 as an improper fraction.",
            "options": ["17/5", "32/5", "6/5", "15/5"],
            "correctIndex": 0,
            "explanation": "3 × 5 + 2 = 17, so 3 2/5 = 17/5.",
        },
        "teacherNotes": teacher(
            [
                "Use paper pizzas: hand out 11 quarter-slices and ask students to rebuild whole pizzas.",
                "Link to division with remainder: quotient = wholes, remainder = parts left.",
                "Tell the history story; ask students to write 3/4 the way Brahmagupta did.",
            ],
            [
                "Writing 11/4 as 3 2/4 (wrong division).",
                "Converting 2 3/4 as (2 + 3)/4 or 2 × 3/4.",
                "Adding mixed numbers by adding all numbers together (1 1/2 + 2 1/4 = 3 2/6).",
            ],
            "Pizza party: groups get paper slices of one size (all sixths, say). They count slices, write the improper fraction, rebuild wholes and write the mixed number.",
            "Old NCERT Ch. 7 (7.6 mixed fractions, 7.11 adding mixed fractions); Ganita Prakash Ch. 7 (mixed fractions, A Pinch of History).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>After Diwali, Dadi sets a fraction quiz at the dining table. Harsh answers fast; Disha answers carefully.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Fraction of a quantity: divide by the denominator, multiply by the numerator.</li>
  <li>Equivalent fractions: multiply or divide top and bottom by the same number.</li>
  <li>Simplest form: divide top and bottom by the HCF.</li>
  <li>Compare, add or subtract: first make a common denominator (the LCM).</li>
  <li>Mixed ⇄ improper: w n/d = (w × d + n)/d.</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Almost every fraction question starts with one move: make the pieces the same size.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Fraction of a quantity",
                    "question": "Find 3/5 of ₹40.",
                    "steps": [
                        "1/5 of 40 = 40 ÷ 5 = 8",
                        "3/5 of 40 = 3 × 8",
                        "= <strong>₹24</strong>",
                    ],
                    "answer": "₹24",
                },
                {
                    "title": "Comparing unlike fractions",
                    "question": "Which is greater, 5/6 or 7/9?",
                    "steps": [
                        "LCM of 6 and 9 = 18",
                        "5/6 = (5 × 3)/(6 × 3) = 15/18",
                        "7/9 = (7 × 2)/(9 × 2) = 14/18",
                        "15/18 &gt; 14/18, so <strong>5/6 is greater</strong>",
                    ],
                    "answer": "5/6",
                },
                {
                    "title": "Simplest form",
                    "question": "Reduce 36/48 to its simplest form.",
                    "steps": [
                        "Factors: 36 = 12 × 3, 48 = 12 × 4, so HCF(36, 48) = 12",
                        "36 ÷ 12 = 3 and 48 ÷ 12 = 4",
                        "36/48 = <strong>3/4</strong>",
                    ],
                    "answer": "3/4",
                },
                {
                    "title": "Equivalent fraction with a given denominator",
                    "question": "Fill in the box: 3/7 = □/35.",
                    "steps": [
                        "7 × 5 = 35, so the denominator was multiplied by 5.",
                        "Multiply the numerator by 5 too: 3 × 5 = 15",
                        "3/7 = <strong>15/35</strong>",
                    ],
                    "answer": "15",
                },
                {
                    "title": "Reading the fraction wall",
                    "question": "Using the strips, name two fractions equivalent to 1/2.",
                    "figureSvg": _wall_svg(),
                    "steps": [
                        "All three shaded parts end at the dotted line, so they are the same length.",
                        "The fourths strip shows 2/4; the eighths strip shows 4/8.",
                        "1/2 = <strong>2/4 = 4/8</strong>",
                    ],
                    "answer": "2/4 and 4/8",
                },
                {
                    "title": "Arranging in order",
                    "question": "Arrange 2/3, 5/6, 7/12 and 3/4 in ascending order.",
                    "steps": [
                        "LCM of 3, 6, 12, 4 = 12",
                        "2/3 = 8/12, 5/6 = 10/12, 7/12 = 7/12, 3/4 = 9/12",
                        "7 &lt; 8 &lt; 9 &lt; 10",
                        "<strong>7/12 &lt; 2/3 &lt; 3/4 &lt; 5/6</strong>",
                    ],
                    "answer": "7/12, 2/3, 3/4, 5/6",
                },
                {
                    "title": "Adding unlike fractions",
                    "question": "Mummy used 2/3 kg of flour for cakes and 1/4 kg for samosas. How much flour did she use?",
                    "steps": [
                        "LCM of 3 and 4 = 12",
                        "2/3 = 8/12 and 1/4 = 3/12",
                        "8/12 + 3/12 = <strong>11/12 kg</strong>",
                    ],
                    "answer": "11/12 kg",
                },
                {
                    "title": "Subtracting: how much is left?",
                    "question": "Disha has a 1 m ribbon for her kite. She cuts off 3/8 m. How much ribbon is left?",
                    "steps": [
                        "1 whole = 8/8",
                        "8/8 − 3/8 = <strong>5/8 m</strong>",
                    ],
                    "answer": "5/8 m",
                },
                {
                    "title": "Mixed numbers",
                    "question": "Papa's train travels 2 1/2 km, then 1 3/4 km more. How far does it travel in all?",
                    "steps": [
                        "Change to improper fractions: 2 1/2 = 5/2, 1 3/4 = 7/4",
                        "5/2 = 10/4, so 10/4 + 7/4 = 17/4",
                        "17 ÷ 4 = 4 remainder 1",
                        "= <strong>4 1/4 km</strong>",
                    ],
                    "answer": "4 1/4 km",
                },
                {
                    "title": "Two steps",
                    "question": "Harsh read 1/3 of a book on Monday and 2/5 of it on Tuesday. What fraction of the book is still unread?",
                    "steps": [
                        "Read so far: 1/3 + 2/5 = 5/15 + 6/15 = 11/15",
                        "Whole book = 15/15",
                        "Unread: 15/15 − 11/15 = <strong>4/15</strong>",
                    ],
                    "answer": "4/15 of the book",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Before solving, ask 'are the pieces the same size?' That single question unlocks most problems.",
                "Q6: insist on writing every fraction over 12 before ordering.",
                "Q9 and Q10 are two-step problems: underline what is asked before calculating.",
            ],
            [
                "Q1: calculating 40 × 5 ÷ 3 instead of 40 ÷ 5 × 3.",
                "Q7: answering 3/7 by adding numerators and denominators.",
                "Q10: stopping at 11/15, which is the part read, not the part unread.",
            ],
            "Pair-share: one student says the first step (for example 'find the LCM'), the other finishes; swap for the next question.",
            "Covers old NCERT Ch. 7 Exercises 7.1–7.6 and Ganita Prakash Ch. 7 exercise patterns.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Fractions (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From the pizza night to the Diwali party, you have cut, compared, added and rebuilt fractions. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering parts of a whole, the number line, equivalent fractions, simplest form, comparing, adding, subtracting and mixed numbers.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Make the pieces the same size, then count them.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Fractions · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "In the fraction 5/8, the denominator 8 tells us:", "options": ["How many parts are taken", "How many equal parts the whole is divided into", "How many parts are left", "The size of the whole"], "answer": 1, "explanation": "The denominator is the number of equal parts in the whole; the numerator 5 is how many are taken.", "topic": "What is a fraction"},
                {"q": "What is 2/3 of 18 laddoos?", "options": ["6", "9", "12", "27"], "answer": 2, "explanation": "18 ÷ 3 = 6 in each group, and 2 groups make 2 × 6 = 12.", "topic": "Fraction of a collection"},
                {"q": "Which fraction lies between 1 and 2 on the number line?", "options": ["3/4", "5/4", "9/4", "2/4"], "answer": 1, "explanation": "5/4 = 1 1/4, which is between 1 and 2. 3/4 and 2/4 are less than 1; 9/4 = 2 1/4 is more than 2.", "topic": "Number line"},
                {"q": "Which of these is equivalent to 3/5?", "options": ["6/15", "9/15", "5/3", "4/6"], "answer": 1, "explanation": "3/5 = (3 × 3)/(5 × 3) = 9/15.", "topic": "Equivalent fractions"},
                {"q": "The simplest form of 24/36 is:", "options": ["12/18", "6/9", "2/3", "4/6"], "answer": 2, "explanation": "HCF(24, 36) = 12, and 24 ÷ 12 = 2, 36 ÷ 12 = 3, so 2/3.", "topic": "Simplest form"},
                {"q": "Which is true?", "options": ["1/5 > 1/4", "2/7 > 2/5", "3/8 < 3/7", "4/9 > 4/5"], "answer": 2, "explanation": "Same numerator: the smaller denominator gives bigger pieces, so 3/7 > 3/8.", "topic": "Comparing fractions"},
                {"q": "Which is greater, 4/5 or 5/7?", "options": ["4/5", "5/7", "They are equal", "Cannot be compared"], "answer": 0, "explanation": "LCM 35: 4/5 = 28/35 and 5/7 = 25/35, so 4/5 is greater.", "topic": "Comparing fractions"},
                {"q": "1/2 + 1/5 = ?", "options": ["2/7", "2/10", "7/10", "3/10"], "answer": 2, "explanation": "LCM 10: 5/10 + 2/10 = 7/10. Never add the denominators.", "topic": "Adding fractions"},
                {"q": "Mummy had 7/8 of a cake and sold 1/4 of a cake. How much is left?", "options": ["6/4", "5/8", "6/8", "3/8"], "answer": 1, "explanation": "1/4 = 2/8, so 7/8 − 2/8 = 5/8.", "topic": "Subtracting fractions"},
                {"q": "19/4 as a mixed number is:", "options": ["4 3/4", "3 4/4", "4 1/4", "19 1/4"], "answer": 0, "explanation": "19 ÷ 4 = 4 remainder 3, so 19/4 = 4 3/4.", "topic": "Mixed numbers"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q6 catches 'bigger denominator means bigger'; Q8 catches adding denominators; Q9 needs a common denominator before subtracting."],
            "Exit ticket: draw a picture showing 2/3 = 4/6, and solve 3/4 − 1/3 with a common denominator.",
            "Matches old NCERT Ch. 7 Fractions learning outcomes and Ganita Prakash Ch. 7 goals.",
        ),
    },
]


def seed_class6_fractions():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Fractions")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Fractions: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Fractions: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_fractions()
