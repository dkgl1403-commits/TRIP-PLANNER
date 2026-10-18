import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Lines and Angles (Ganita Prakash ch.2 + old NCERT "Basic Geometrical Ideas" / angle parts of
# "Understanding Elementary Shapes"). Story: the Jaipur family: Dadi, Harsh, Disha, Papa Deepak and Mummy Neha.
# Every part is a list of scenes; each scene is a short dialogue and its `visual` drives the widget animation.


SCENES_1 = [
    scene([
        L("Narrator", "It is Makar Sankranti in Jaipur, and the sky is full of kites. Harsh and Disha are on the rooftop with their Dadi, who taught maths for thirty five years.",
          "Makar Sankranti ka din hai, aur Jaipur ka aasmaan patangon se bhara hai. Harsh aur Disha apni Dadi ke saath chhat par hain. Dadi ne paintees saal tak maths padhaya hai."),
        L("Dadi", "Before we fly, look at this. I make one tiny dot with my pencil. Every shape in geometry begins with a dot like this!",
          "Patang udaane se pehle, yeh dekho. Main pencil se ek chhota sa dot banaati hoon. Geometry ki har shape aise hi ek dot se shuru hoti hai!"),
    ], {"stage": "point"}),
    scene([
        L("Disha", "It's so tiny, Dadi. How big is it?", "Yeh toh bahut chhota hai, Dadi. Yeh kitna bada hai?"),
        L("Dadi", "That is the magic! In maths, this dot is called a point. It shows an exact position, but it has no length, no width and no thickness. We name it with a capital letter, like P.",
          "Yahi toh jaadu hai! Maths mein is dot ko point kehte hain. Yeh ek exact jagah batata hai, lekin iski na lambai hai, na chaudai, na motaai. Iska naam hum capital letter se rakhte hain, jaise P."),
        L("Harsh", "Like a star far away in the night sky!", "Jaise raat mein door chamakta taara!"),
    ], {"stage": "point"}),
    scene([
        L("Disha", "Look, my kite is flying! My charkhi is here, and the kite is way up there.", "Dekho, meri patang ud rahi hai! Meri charkhi yahan hai, aur patang upar wahan."),
        L("Dadi", "Call the charkhi point A and the kite point B. The tight string between them is a straight path with two end points. That is a line segment, written A B with a small bar on top.",
          "Charkhi ko point A kaho aur patang ko point B. Dono ke beech tani hui dor ek seedha raasta hai jiske do end points hain. Yeh line segment hai, jise A B likh kar upar chhoti si line lagaate hain."),
    ], {"stage": "segment", "kite": True}),
    scene([
        L("Harsh", "So can we measure it?", "Toh kya hum ise naap sakte hain?"),
        L("Dadi", "Yes! It starts at A and stops at B, so a ruler can measure it. See the ruler marks? A line segment is the shortest path between two points.",
          "Haan! Yeh A se shuru hokar B par rukta hai, isliye ruler se naap sakte hain. Ruler ke nishaan dekho? Do points ke beech sabse chhota raasta line segment hi hai."),
    ], {"stage": "segment"}),
    scene([
        L("Narrator", "The sun sets, and Papa comes up to the roof with a torch.", "Suraj dhal jaata hai, aur Papa torch lekar chhat par aate hain."),
        L("Deepak", "Watch this, kids! The light starts at my torch and just keeps going, past B, forever!",
          "Yeh dekho bachcho! Roshni meri torch se shuru hoti hai aur B ke aage chalti hi jaati hai, hamesha!"),
        L("Dadi", "A path that starts at one point and goes on forever in one direction is called a ray. We write A B with an arrow on top.",
          "Jo raasta ek point se shuru hokar ek disha mein hamesha chalta rahe, use ray kehte hain. Hum A B likh kar upar arrow lagaate hain."),
    ], {"stage": "ray", "torch": True}),
    scene([
        L("Deepak", "At Indian Railways, we imagine a track that never ends, in either direction.",
          "Indian Railways mein hum aisi patri sochte hain jo dono taraf kabhi khatam na ho."),
        L("Dadi", "Stretch A B both ways, forever, and you get a line. A line has no end points at all, so it can never be measured. The arrows at both ends say: I keep going!",
          "A B ko dono taraf hamesha ke liye badha do, toh milti hai line. Line ka koi end point nahi hota, isliye ise kabhi naapa nahi ja sakta. Dono taraf ke arrow kehte hain: main chalti rehti hoon!"),
    ], {"stage": "line", "rail": True}),
    scene([
        L("Harsh", "Dadi, how many lines can pass through just one point?", "Dadi, ek point se kitni lines guzar sakti hain?"),
        L("Dadi", "Watch the screen! One line through P, and another, and another. They spin in every direction!",
          "Screen dekho! P se ek line, phir doosri, phir teesri. Har disha mein ghoom rahi hain!"),
        L("Disha", "They never stop! So through one point, infinitely many lines can pass!", "Yeh toh rukti hi nahi! Matlab ek point se anginat lines guzar sakti hain!"),
    ], {"stage": "onePoint"}),
    scene([
        L("Dadi", "Now fix two points, A and B. The grey line swings around A, searching.", "Ab do points fix karo, A aur B. Grey line A ke chaaron taraf ghoom kar dhoondh rahi hai."),
        L("Harsh", "It turned green when it touched B!", "B ko chhoote hi woh hari ho gayi!"),
        L("Dadi", "Exactly! Through two points, only one line can pass. That is why a carpenter marks two dots before cutting a straight line.",
          "Bilkul! Do points se sirf ek hi line guzar sakti hai. Isiliye carpenter seedha cut lagaane se pehle do dot lagaata hai."),
    ], {"stage": "twoPoints"}),
    scene([
        L("Dadi", "Your turn now! Drag point A or point B and fly the kite around. Watch the length change, but count the end points. Always two!",
          "Ab aapki baari! Point A ya point B ko drag karo aur patang udaao. Lambai badalti hai, lekin end points gino. Hamesha do!"),
    ], {"stage": "segment", "kite": True}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "Next morning, the family takes the train to Ajmer. Disha is glued to the window.", "Agli subah poora parivaar train se Ajmer jaata hai. Disha khidki se chipki hui hai."),
        L("Disha", "Look, two roads crossing each other!", "Dekho, do sadkein ek doosre ko kaat rahi hain!"),
        L("Deepak", "Lines that cross are called intersecting lines. They meet at exactly one point, the point of intersection. Here, that is point O.",
          "Jo lines ek doosre ko kaatti hain unhe intersecting lines kehte hain. Woh sirf ek point par milti hain, point of intersection. Yahan woh point O hai."),
    ], {"mode": "intersecting", "angle": 50}),
    scene([
        L("Harsh", "Papa, can two straight lines cross twice?", "Papa, kya do seedhi lines do baar kaat sakti hain?"),
        L("Deepak", "Watch the second line turn. The angle changes, but they still meet at only one point. Two different straight lines can never cross twice.",
          "Doosri line ko ghoomte dekho. Angle badalta hai, lekin woh ab bhi ek hi point par milti hain. Do alag seedhi lines do baar kabhi nahi kaat saktin."),
    ], {"mode": "intersecting", "angle": 130}),
    scene([
        L("Neha", "Now it has stopped at a special place. The lines meet like the corner of my cake tin!", "Ab yeh ek khaas jagah ruk gayi. Lines bilkul meri cake tin ke kone ki tarah mil rahi hain!"),
        L("Deepak", "Exactly, Neha. When lines meet at a right angle, they are perpendicular. See the small square at O? That square means right angle.",
          "Bilkul, Neha. Jab lines right angle par milti hain, toh woh perpendicular hoti hain. O par chhota square dekho? Woh square matlab right angle."),
        L("Disha", "The plus sign, the window grill, my notebook margin. All perpendicular!", "Plus ka sign, khidki ki grill, meri notebook ki margin. Sab perpendicular!"),
    ], {"mode": "intersecting", "angle": 90}),
    scene([
        L("Harsh", "Papa, the two rails below us never meet. Why?", "Papa, neeche ki dono patriyaan kabhi nahi miltin. Kyon?"),
        L("Deepak", "Because they are parallel lines, lines on the same flat surface that never meet. On a broad gauge track, we keep the rails exactly 1676 millimetres apart, everywhere.",
          "Kyonki woh parallel lines hain, ek hi samtal par aisi lines jo kabhi nahi miltin. Broad gauge track par hum patriyon ko har jagah bilkul 1676 millimetre door rakhte hain."),
    ], {"mode": "parallel", "tilt": 0, "gap": 100, "rail": True}),
    scene([
        L("Dadi", "Look at the three green measurements. The gap is the same at every place. Same gap everywhere means they will never meet.",
          "Teen hare naap dekho. Har jagah gap barabar hai. Har jagah barabar gap, matlab woh kabhi nahi milengi."),
    ], {"mode": "parallel", "tilt": 0, "gap": 100}),
    scene([
        L("Harsh", "What if one rail tilts, just a tiny bit?", "Agar ek patri thodi si tirchhi ho jaaye toh?"),
        L("Deepak", "Even three degrees is a disaster! The gaps become unequal, and far away the rails crash together. The train would derail. That is why we check the gap so carefully.",
          "Teen degree bhi museebat hai! Gap barabar nahi rehta, aur aage jaakar patriyaan takra jaati hain. Train patri se utar jaayegi. Isiliye hum gap itni dhyaan se check karte hain."),
    ], {"mode": "parallel", "tilt": 3, "gap": 100}),
    scene([
        L("Deepak", "Your turn, engineers! Use the slider to turn the line until the two lines are perpendicular. Watch for the little square!",
          "Ab aapki baari, engineers! Slider se line ko tab tak ghumaao jab tak dono lines perpendicular na ho jaayein. Chhote square ka dhyaan rakho!"),
    ], {"mode": "intersecting", "angle": 40, "task": "perpendicular"}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "Back home in Jaipur, Dadi is sitting near the old wooden door.", "Jaipur ghar wapas aakar, Dadi purane lakdi ke darwaaze ke paas baithi hain."),
        L("Dadi", "Disha, open the door just a little. See how it turns around its hinge? How much it turns is what mathematicians call an angle.",
          "Disha, darwaaza thoda sa kholo. Dekho, yeh kabze ke chaaron taraf kaise ghoomta hai? Yeh jitna ghoomta hai, use mathematician angle kehte hain."),
    ], {"context": "door", "angle": 0}),
    scene([
        L("Disha", "I pushed it a tiny bit!", "Maine bas thoda sa dhakka diya!"),
        L("Dadi", "A small push gives a small turn, a small angle. We measure angles in degrees. This door has turned 30 degrees.",
          "Chhota dhakka, chhota ghoomna, chhota angle. Angle ko hum degree mein naapte hain. Yeh darwaaza 30 degree ghooma hai."),
    ], {"context": "door", "angle": 30}),
    scene([
        L("Harsh", "Let me open it wide!", "Mujhe pura kholne do!"),
        L("Dadi", "Stop when the door stands straight out from the wall. That is a quarter of a full turn, 90 degrees. We call it a right angle.",
          "Jab darwaaza deewar se bilkul seedha bahar ho, tab ruko. Yeh poore chakkar ka chauthai hissa hai, 90 degree. Ise right angle kehte hain."),
    ], {"context": "door", "angle": 90}),
    scene([
        L("Dadi", "Now let us draw it like mathematicians. The hinge becomes a point O, the vertex. The wall and the door become two rays, O A and O B, the arms.",
          "Ab ise mathematician ki tarah banaate hain. Kabza ban jaata hai point O, yaani vertex. Deewar aur darwaaza ban jaate hain do rays, O A aur O B, yaani arms."),
        L("Disha", "And its name is angle A O B?", "Aur iska naam angle A O B hai?"),
        L("Dadi", "Yes! And the vertex letter always sits in the middle.", "Haan! Aur vertex ka letter hamesha beech mein baithta hai."),
    ], {"context": "plain", "angle": 55, "showParts": True}),
    scene([
        L("Harsh", "What if I keep turning until it points the other way?", "Agar main ghumaata rahoon jab tak yeh ulti taraf na aa jaaye?"),
        L("Dadi", "That is half a turn. The two arms make a straight line. 180 degrees, a straight angle.", "Yeh aadha chakkar hai. Dono arms seedhi line banaate hain. 180 degree, straight angle."),
    ], {"context": "plain", "angle": 180}),
    scene([
        L("Harsh", "And all the way round, like my bowling arm?", "Aur poora ghuma doon, meri bowling wali baanh ki tarah?"),
        L("Dadi", "One full turn is 360 degrees, a complete angle.", "Ek poora chakkar 360 degree hai, complete angle."),
    ], {"context": "plain", "angle": 360}),
    scene([
        L("Dadi", "A clock is an angle machine! There are 12 hour gaps around the circle, so each gap is 360 divided by 12, which is 30 degrees.",
          "Ghadi ek angle machine hai! Gol ghere mein 12 ghante ke gap hain, toh har gap 360 bhaag 12, yaani 30 degree."),
        L("Disha", "So at 3 o'clock the hands are 3 gaps apart. 3 times 30 is 90 degrees!", "Toh 3 baje suiyaan 3 gap door hain. 3 guna 30, yaani 90 degree!"),
    ], {"context": "clock", "angle": 90}),
    scene([
        L("Harsh", "At 6 o'clock, 6 times 30. That's 180 degrees!", "6 baje, 6 guna 30. Yaani 180 degree!"),
        L("Dadi", "Shabash! The hands point in opposite directions.", "Shabash! Suiyaan ek doosre ki ulti disha mein hain."),
    ], {"context": "clock", "angle": 180}),
    scene([
        L("Disha", "Dadi, why 360 degrees? Why not 100?", "Dadi, 360 degree hi kyon? 100 kyon nahi?"),
        L("Dadi", "Historians believe it comes from ancient Babylon, where people counted in sixties, and a year has about 360 days. And 360 is a wonderful number. It divides exactly by 2, 3, 4, 5, 6, 8, 9, 10 and 12!",
          "Itihaaskaar maante hain ki yeh purane Babylon se aaya, jahan log saath saath mein ginte the, aur saal mein lagbhag 360 din hote hain. Aur 360 kamaal ka number hai. Yeh 2, 3, 4, 5, 6, 8, 9, 10 aur 12 se poora bant jaata hai!"),
    ], {"context": "plain", "angle": 120}),
]

SCENES_4 = [
    scene([
        L("Disha", "Let's sort angles into families, just like our family!", "Chalo angles ko parivaaron mein baante, bilkul hamare parivaar ki tarah!"),
        L("Dadi", "Smaller than a right angle is acute. Acute means sharp, like a pencil tip. The Leaning Tower of Pisa leans only about 4 degrees, a tiny acute angle.",
          "Right angle se chhota angle acute kehlaata hai. Acute matlab nukeela, pencil ki nok jaisa. Pisa ki jhuki meenaar sirf lagbhag 4 degree jhuki hai, ek chhota sa acute angle."),
    ], {"context": "plain", "angle": 35, "showType": True, "showParts": False}),
    scene([
        L("Neha", "Exactly 90 degrees is a right angle, like the corners of my cake tray and the carrom board.", "Bilkul 90 degree right angle hai, jaise meri cake tray aur carrom board ke kone."),
    ], {"context": "plain", "angle": 90, "showParts": False}),
    scene([
        L("Deepak", "Between 90 and 180 degrees is obtuse, which means blunt. When I lean back in my easy chair, my body makes an obtuse angle.",
          "90 aur 180 degree ke beech obtuse hota hai, matlab bhotha. Jab main aaraam kursi par peeche jhukta hoon, mera shareer obtuse angle banaata hai."),
        L("Harsh", "The lazy Papa angle!", "Aalsi Papa wala angle!"),
    ], {"context": "plain", "angle": 130, "showParts": False}),
    scene([
        L("Disha", "Exactly 180 degrees is a straight angle, like my book lying open flat on the table.", "Bilkul 180 degree straight angle hai, jaise mez par poori khuli meri kitaab."),
    ], {"context": "plain", "angle": 180, "showParts": False}),
    scene([
        L("Neha", "Now look at this pizza with one slice taken out. The big part that is left is a reflex angle, more than 180 but less than 360 degrees.",
          "Ab is pizza ko dekho jisse ek slice nikaal liya. Jo bada hissa bacha hai woh reflex angle hai, 180 se zyaada lekin 360 degree se kam."),
        L("Harsh", "Can I eat the slice?", "Kya main woh slice kha sakta hoon?"),
    ], {"context": "plain", "angle": 250, "showParts": False}),
    scene([
        L("Dadi", "And 360 degrees, one full turn, is a complete angle. Like Disha spinning around once in her dance class.",
          "Aur 360 degree, ek poora chakkar, complete angle hai. Jaise Disha apni dance class mein ek baar poora ghoomti hai."),
    ], {"context": "plain", "angle": 360, "showParts": False}),
    scene([
        L("Dadi", "Your turn! Drag the handle and make an obtuse angle, more than 90 but less than 180 degrees.",
          "Ab aapki baari! Handle ko drag karo aur ek obtuse angle banao, 90 se zyaada lekin 180 degree se kam."),
    ], {"context": "plain", "angle": 20, "showParts": False, "task": {"text": "Your turn: make an obtuse angle (between 91° and 179°).", "min": 91, "max": 179}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "On Sunday, Papa is building a wooden bookshelf for the children.", "Ravivaar ko Papa bachchon ke liye lakdi ki bookshelf bana rahe hain."),
        L("Deepak", "This support must be cut at an exact angle. Guessing is not good enough!", "Yeh support bilkul sahi angle par kaatna hai. Andaaza kaafi nahi hai!"),
        L("Disha", "I have the perfect tool, Papa. A protractor, from my geometry box!", "Mere paas perfect tool hai, Papa. Protractor, mere geometry box se!"),
    ], {"angle": 65, "place": False, "scale": "none", "reading": False, "guess": False}),
    scene([
        L("Dadi", "Step one. Slide the protractor so its centre point sits exactly on the vertex O.", "Pehla step. Protractor ko aise khiskaao ki uska centre point bilkul vertex O par aa jaaye."),
    ], {"angle": 65, "place": True, "scale": "none", "reading": False}),
    scene([
        L("Dadi", "Step two. Line up its base line with one arm of the angle, the white arm.", "Doosra step. Uski base line ko angle ke ek arm, safed arm, ke saath milaao."),
    ], {"angle": 65, "place": True, "scale": "none", "reading": False}),
    scene([
        L("Dadi", "Step three. A protractor has two rows of numbers. Choose the row that starts at zero on your first arm, the inner green row, and follow it to the second arm.",
          "Teesra step. Protractor par numbers ki do line hoti hain. Woh line chuno jo pehle arm par zero se shuru hoti hai, andar wali hari line, aur use doosre arm tak follow karo."),
        L("Disha", "It says 65 degrees!", "Yeh 65 degree bata raha hai!"),
    ], {"angle": 65, "place": True, "scale": "inner", "reading": True}),
    scene([
        L("Harsh", "Wait, I read 115 degrees!", "Ruko, maine toh 115 degree padha!"),
        L("Dadi", "That is the most common exam mistake, Harsh. You read the outer row. But this angle is clearly smaller than a right angle, so 115 must be wrong. Always ask first: acute or obtuse?",
          "Yahi exam ki sabse common galti hai, Harsh. Tumne bahar wali line padhi. Lekin yeh angle saaf right angle se chhota hai, toh 115 galat hi hoga. Hamesha pehle poocho: acute ya obtuse?"),
    ], {"angle": 65, "place": True, "scale": "outer", "reading": True}),
    scene([
        L("Deepak", "Let's try a bigger angle for the top shelf. The inner row starts at zero on our arm again, and it reads 140 degrees. Obtuse, just like it looks.",
          "Upar wali shelf ke liye bada angle try karte hain. Andar wali line phir hamare arm par zero se shuru hoti hai, aur 140 degree padhti hai. Obtuse, jaisa dikhta hai."),
    ], {"angle": 140, "place": True, "scale": "inner", "reading": True}),
    scene([
        L("Dadi", "Game time! Look at the angle, slide to your best guess, then check with the protractor. Get within 10 degrees to win. Tip: compare with a right angle first, then think about half of it.",
          "Khel ka samay! Angle dekho, slider se apna best guess lagao, phir protractor se check karo. 10 degree ke andar aaye toh jeete. Tip: pehle right angle se tulna karo, phir uske aadhe ke baare mein socho."),
    ], {"angle": 50, "place": False, "scale": "none", "reading": False, "guess": True}, wait=True),
]

SCENES_6 = [
    scene([
        L("Dadi", "A good mathematician never trusts a rule until she has tested it. Let us test three angle rules. Rule one starts with a straight line A B. The angle on a straight line is half a turn, 180 degrees.",
          "Achchha mathematician kisi niyam par tab tak bharosa nahi karta jab tak use test na kar le. Chalo teen angle ke niyam test karte hain. Pehla niyam ek seedhi line A B se shuru hota hai. Seedhi line par angle aadha chakkar hai, 180 degree."),
    ], {"mode": "linear", "angle": 60, "step": 0}),
    scene([
        L("Dadi", "Now a ray O C starts from point O. It splits the straight angle into two angles, side by side. Together they are called a linear pair.",
          "Ab point O se ek ray O C nikalti hai. Yeh straight angle ko do agal bagal angles mein baant deti hai. Inhe saath mein linear pair kehte hain."),
    ], {"mode": "linear", "angle": 60, "step": 1}),
    scene([
        L("Disha", "The green one is 60 degrees and the orange one is 120 degrees.", "Hara 60 degree hai aur naarangi 120 degree."),
        L("Harsh", "60 plus 120 is 180. They still fill the half turn!", "60 plus 120 barabar 180. Dono milkar ab bhi aadha chakkar bharte hain!"),
    ], {"mode": "linear", "angle": 60, "step": 2}),
    scene([
        L("Dadi", "Move the ray anywhere. 35 and 145. 100 and 80. The numbers change, but the sum is always 180 degrees. Rule one: a linear pair adds up to 180 degrees.",
          "Ray ko kahin bhi le jaao. 35 aur 145. 100 aur 80. Numbers badalte hain, lekin jod hamesha 180 degree. Pehla niyam: linear pair ka jod 180 degree hota hai."),
    ], {"mode": "linear", "angle": 35, "step": 3}),
    scene([
        L("Neha", "Rule two looks like my kitchen scissors! Two straight lines crossing at O make four angles.", "Doosra niyam meri kitchen ki kainchi jaisa dikhta hai! O par kaatti do seedhi lines chaar angle banaati hain."),
        L("Dadi", "Call them angle 1, 2, 3 and 4. Angle 1 and angle 3 face each other across the point. They are vertically opposite angles.",
          "Inhe angle 1, 2, 3 aur 4 kaho. Angle 1 aur angle 3 point ke aar paar aamne saamne hain. Yeh vertically opposite angles hain."),
    ], {"mode": "vertical", "angle": 50, "step": 0}),
    scene([
        L("Harsh", "Angle 1 is 50 and angle 3 is also 50. Angle 2 and angle 4 are both 130. Is that just luck?",
          "Angle 1 hai 50 aur angle 3 bhi 50. Angle 2 aur angle 4 dono 130. Kya yeh sirf kismat hai?"),
    ], {"mode": "vertical", "angle": 50, "step": 1}),
    scene([
        L("Dadi", "Let us see it first. Copy angle 1 and spin it half a turn about O.", "Pehle dekhte hain. Angle 1 ki copy banao aur use O ke chaaron taraf aadha chakkar ghumaao."),
        L("Disha", "It lands exactly on angle 3! A perfect fit!", "Yeh bilkul angle 3 par aa gaya! Ekdum perfect fit!"),
    ], {"mode": "vertical", "angle": 50, "step": 2}),
    scene([
        L("Dadi", "Now let us prove it with numbers. Angle 1 and angle 2 make a linear pair, so they add to 180. Angle 2 and angle 3 also make a linear pair, so they also add to 180.",
          "Ab numbers se prove karte hain. Angle 1 aur angle 2 linear pair hain, toh unka jod 180. Angle 2 aur angle 3 bhi linear pair hain, toh unka jod bhi 180."),
    ], {"mode": "vertical", "angle": 50, "step": 4}),
    scene([
        L("Harsh", "So angle 1 plus angle 2 equals angle 2 plus angle 3. Take away angle 2 from both sides...",
          "Toh angle 1 plus angle 2 barabar angle 2 plus angle 3. Dono taraf se angle 2 hata do..."),
        L("Disha", "And angle 1 equals angle 3. Proved!", "Aur angle 1 barabar angle 3. Prove ho gaya!"),
    ], {"mode": "vertical", "angle": 50, "step": 6}),
    scene([
        L("Neha", "Rule three is on my cake board! Cut a round cake into slices from the centre. All the angles around the centre make one full turn.",
          "Teesra niyam meri cake board par hai! Gol cake ko beech se slices mein kaato. Beech ke chaaron taraf ke saare angles milkar ek poora chakkar banaate hain."),
        L("Dadi", "So angles around a point always add up to 360 degrees.", "Isliye ek point ke chaaron taraf ke angles ka jod hamesha 360 degree hota hai."),
    ], {"mode": "point", "rays": [35, 120, 215, 300]}),
    scene([
        L("Dadi", "Your turn! Drag the coloured dots to move the rays, and check that the total stays 360 degrees every single time.",
          "Ab aapki baari! Rangeen dots ko drag karke rays hilaao, aur check karo ki total har baar 360 degree hi rehta hai."),
    ], {"mode": "point", "rays": [35, 120, 215, 300]}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "Exam week! Disha and Harsh sit with Dadi at the dining table.", "Exam ka hafta! Disha aur Harsh Dadi ke saath dining table par baithe hain."),
        L("Dadi", "Question 1. Four points A, B, C and D lie on a line. How many line segments can you name?",
          "Sawaal 1. Chaar points A, B, C aur D ek line par hain. Kitne line segments ke naam bata sakte ho?"),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "Start from A. A joins B, C and D. That's 3 segments.", "A se shuru karo. A, B, C aur D se judta hai. Yeh 3 segments."),
    ], {"example": 0, "step": 1}),
    scene([
        L("Harsh", "Then B. We already have A B, so B joins only C and D. 2 more.", "Phir B. A B toh pehle hi hai, toh B sirf C aur D se judega. 2 aur."),
    ], {"example": 0, "step": 2}),
    scene([
        L("Dadi", "And from C, just C D. 3 plus 2 plus 1 equals 6 line segments. Remember this pattern!",
          "Aur C se sirf C D. 3 plus 2 plus 1 barabar 6 line segments. Yeh pattern yaad rakhna!"),
    ], {"example": 0, "step": 4}),
    scene([
        L("Dadi", "Question 2. What is the angle between the hands of a clock at 4 o'clock?", "Sawaal 2. 4 baje ghadi ki suiyon ke beech kitna angle hota hai?"),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "Each hour gap is 30 degrees. At 4 o'clock the hands are 4 gaps apart, so 4 times 30 is 120 degrees. Obtuse!",
          "Har ghante ka gap 30 degree. 4 baje suiyaan 4 gap door, toh 4 guna 30 barabar 120 degree. Obtuse!"),
        L("Dadi", "Shabash, Harsh!", "Shabash, Harsh!"),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]




def svg_points_on_line():
    dots = "".join(
        f'<circle cx="{x}" cy="50" r="6" fill="#fbbf24"/><text x="{x - 5}" y="80" fill="#fbbf24" font-size="16" font-weight="700">{c}</text>'
        for x, c in [(70, "A"), (150, "B"), (230, "C"), (310, "D")]
    )
    return f'<svg viewBox="0 0 380 100" width="320"><line x1="20" y1="50" x2="360" y2="50" stroke="#e2e8f0" stroke-width="3"/>{dots}</svg>'


def svg_linear_pair(label_a, label_b):
    return (
        '<svg viewBox="0 0 360 170" width="300">'
        '<line x1="20" y1="140" x2="340" y2="140" stroke="#e2e8f0" stroke-width="3"/>'
        '<line x1="180" y1="140" x2="270" y2="30" stroke="#38bdf8" stroke-width="3"/>'
        '<path d="M 225 140 A 45 45 0 0 0 208 105" fill="none" stroke="#34d399" stroke-width="3"/>'
        '<path d="M 208 105 A 45 45 0 0 0 135 140" fill="none" stroke="#fbbf24" stroke-width="3"/>'
        f'<text x="232" y="124" fill="#34d399" font-size="16" font-weight="800">{label_a}</text>'
        f'<text x="120" y="112" fill="#fbbf24" font-size="16" font-weight="800">{label_b}</text>'
        '<circle cx="180" cy="140" r="4" fill="#fbbf24"/></svg>'
    )


def svg_crossing(label):
    return (
        '<svg viewBox="0 0 360 200" width="300">'
        '<line x1="20" y1="100" x2="340" y2="100" stroke="#e2e8f0" stroke-width="3"/>'
        '<line x1="70" y1="190" x2="290" y2="10" stroke="#38bdf8" stroke-width="3"/>'
        '<path d="M 225 100 A 45 45 0 0 0 214 72" fill="none" stroke="#34d399" stroke-width="3"/>'
        f'<text x="232" y="88" fill="#34d399" font-size="16" font-weight="800">{label}</text>'
        '<text x="160" y="75" fill="#fbbf24" font-size="16" font-weight="800">b</text>'
        '<text x="120" y="125" fill="#fbbf24" font-size="16" font-weight="800">c</text>'
        '<text x="200" y="135" fill="#fbbf24" font-size="16" font-weight="800">d</text>'
        '<circle cx="180" cy="100" r="4" fill="#fbbf24"/></svg>'
    )


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: The Kite Festival · Point, Segment, Ray and Line",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>It is Makar Sankranti in Jaipur. The sky is full of kites. Harsh (12) and Disha (11) are on the rooftop with their Dadi, a retired maths teacher. She makes one tiny pencil dot and smiles: "Every shape in geometry begins with a dot like this."</div>

<h2>The four building blocks of geometry</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Point</strong>: an exact position. No length, width or thickness. Named with a capital letter: <strong>P</strong>.</div>
  <div><strong class="text-amber-300">Line segment AB̅</strong>: the straight path between two points. It has <strong>2 end points</strong> and a fixed length you can measure.</div>
  <div><strong class="text-amber-300">Ray AB→</strong>: starts at A and goes on forever through B. <strong>1 end point</strong>. Cannot be measured.</div>
  <div><strong class="text-amber-300">Line AB↔</strong>: goes on forever in both directions. <strong>No end points</strong>. Cannot be measured.</div>
</div>

<table class="w-full text-xs md:text-sm my-4">
  <thead><tr class="text-amber-300"><th class="text-left">Name</th><th>End points</th><th>Measurable?</th><th class="text-left">In real life</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Line segment</td><td class="text-center">2</td><td class="text-center">Yes</td><td>Kite string, edge of a ruler</td></tr>
    <tr><td>Ray</td><td class="text-center">1</td><td class="text-center">No</td><td>Torch beam, sun's rays</td></tr>
    <tr><td>Line</td><td class="text-center">0</td><td class="text-center">No</td><td>An endless railway track (imagined)</td></tr>
  </tbody>
</table>

<h2>Two facts a carpenter relies on</h2>
<ul>
  <li>Through <strong>one point</strong>, <strong>infinitely many</strong> lines can be drawn.</li>
  <li>Through <strong>two points</strong>, <strong>exactly one</strong> line can be drawn.</li>
</ul>
""",
        "keyInsight": "Count the end points: segment = 2, ray = 1, line = 0. Only a segment can be measured.",
        "widgetType": "Class6PointLineRayWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "The beam of a lighthouse is best described as a…",
            "options": ["Line segment", "Ray", "Line", "Point"],
            "correctIndex": 1,
            "explanation": "It starts at the lighthouse (one end point) and goes on in one direction: a ray.",
        },
        "teacherNotes": teacher(
            [
                "Start with a physical dot on the board and ask: how big is a point? Let students argue, then settle on 'position, not size'.",
                "Use the end-point count (2, 1, 0) as the one idea that separates segment, ray and line.",
                "Draw arrows deliberately: the arrowhead is a promise that the figure continues.",
            ],
            [
                "Writing ray AB and ray BA as the same thing. The first letter is always the starting point.",
                "Thinking a longer drawing of a line is 'bigger' than a shorter one. Both are infinite.",
                "Measuring a ray or a line with a ruler.",
            ],
            "Give pairs a thread. One holds both ends tight (segment), one holds one end and 'throws' the other far away (ray). Then ask the class how to show a line with the same thread. Finish with: mark 2 dots on paper and try to draw two different straight lines through both.",
            "Ganita Prakash Ch. 2 (2.1–2.3); old NCERT Ch. 4 Basic Geometrical Ideas (4.2–4.4).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Railway Tracks and Window Grills · Pairs of Lines",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Next morning the family takes the train to Ajmer. Papa (Deepak) is an Indian Railways engineer. Through the window Disha sees roads crossing, the window grill, and the two shining rails running beside the train for hours without ever meeting.</div>

<h2>Three ways two lines can behave</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Intersecting lines</strong> cross at exactly <strong>one</strong> point, called the <em>point of intersection</em>.</div>
  <div><strong class="text-sky-300">Perpendicular lines ( ⟂ )</strong> are intersecting lines that meet at a <strong>right angle (90°)</strong>. Example: the plus sign, a window grill, a notebook margin.</div>
  <div><strong class="text-emerald-300">Parallel lines ( ∥ )</strong> lie on the same flat surface and <strong>never meet</strong>. The gap between them is the same everywhere.</div>
</div>

<h2>Real data: Indian Railways</h2>
<p>A broad gauge track keeps its two rails exactly <strong>1676 mm</strong> apart along its whole length. If the gap changed, the rails would be <em>not parallel</em> and a train could derail.</p>

<div {FORMULA}>Parallel ⟺ same gap everywhere ⟺ never meet</div>
""",
        "keyInsight": "Two different straight lines either meet once (intersecting) or never (parallel). Meeting at 90° makes them perpendicular.",
        "widgetType": "Class6LinePairsWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "The opposite edges of your ruler are an example of…",
            "options": ["Intersecting lines", "Perpendicular lines", "Parallel lines"],
            "correctIndex": 2,
            "explanation": "They run side by side with the same gap everywhere and never meet: parallel lines.",
        },
        "teacherNotes": teacher(
            [
                "Ask the class: can two straight lines meet twice? Let them try to draw it. Discovering it is impossible is more powerful than being told.",
                "Define parallel by the gap, not by 'never meet': students can check a gap with a ruler, but cannot walk to infinity.",
                "Perpendicular is a special case of intersecting, not a separate family.",
            ],
            [
                "Calling any two lines that look far apart 'parallel'. Only equal gaps everywhere count.",
                "Thinking two short segments that don't touch are parallel. Extend them first.",
                "Saying lines on different walls of a room (skew lines) are parallel. Parallel lines must lie on the same flat surface.",
            ],
            "Classroom hunt: in 3 minutes, list objects in the room showing parallel, intersecting and perpendicular lines. Pairs that find the most correct examples win. Then fold a paper twice to create a perpendicular crease.",
            "Ganita Prakash Ch. 2 & Ch. 8 (perpendicular/parallel); old NCERT Ch. 4 (4.4–4.5) and Ch. 5 (5.6 Perpendicular lines).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Dadi's Door · What is an Angle?",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Back home, Dadi asks Disha to open the old wooden door a little. The door swings around its hinge. "How much it turned," says Dadi, "is what mathematicians call an angle."</div>

<h2>An angle is an amount of turn</h2>
<div {CARD}>
  <div><strong class="text-amber-300">Vertex</strong>: the point where the turn happens (the hinge, O).</div>
  <div><strong class="text-amber-300">Arms</strong>: the two rays OA and OB.</div>
  <div><strong class="text-amber-300">Name</strong>: ∠AOB or ∠BOA. The vertex letter is always in the <strong>middle</strong>.</div>
  <div><strong class="text-amber-300">Unit</strong>: degrees (°). One full turn = <strong>360°</strong>.</div>
</div>

<h2>Turns and degrees</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Turn</th><th>Degrees</th><th class="text-left">Name</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>¼ turn</td><td class="text-center">90°</td><td>Right angle</td></tr>
    <tr><td>½ turn</td><td class="text-center">180°</td><td>Straight angle</td></tr>
    <tr><td>¾ turn</td><td class="text-center">270°</td><td>Reflex angle</td></tr>
    <tr><td>1 full turn</td><td class="text-center">360°</td><td>Complete angle</td></tr>
  </tbody>
</table>

<h2>The clock is an angle machine</h2>
<div {FORMULA}>Each hour gap = 360° ÷ 12 = 30°</div>
<p>At 3 o'clock: 3 × 30° = 90°. At 6 o'clock: 6 × 30° = 180°.</p>

<h2>Why 360?</h2>
<p>Historians believe the idea comes from ancient Babylon, where people counted in 60s and a year was close to 360 days. 360 is also very friendly: it divides exactly by 2, 3, 4, 5, 6, 8, 9, 10, 12 and more, so halves, thirds and quarters of a turn are all whole degrees.</p>
""",
        "keyInsight": "An angle measures how much something turns, not how long its arms are. One full turn = 360°.",
        "widgetType": "Class6AngleTurnWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "What is the angle between the hands of a clock at 2 o'clock?",
            "options": ["30°", "60°", "90°", "120°"],
            "correctIndex": 1,
            "explanation": "Each hour gap is 30°. At 2 o'clock the hands are 2 gaps apart: 2 × 30° = 60°.",
        },
        "teacherNotes": teacher(
            [
                "Lead with turning (door, clock, head turning) before showing any drawing. The 'static' picture of an angle comes last.",
                "Insist that the vertex letter goes in the middle. Have students name the same angle two ways (∠AOB, ∠BOA).",
                "Connect fractions of a turn to degrees: ½ turn = 180°, ¼ turn = 90°.",
            ],
            [
                "Believing longer arms make a bigger angle. Draw the same angle with short and long arms side by side.",
                "Naming an angle with the vertex first (∠OAB instead of ∠AOB).",
                "Forgetting that a clock's hands move clockwise, so the angle is counted between the hands, not 'from 12'.",
            ],
            "Human clock: one student stands as the vertex with both arms out. The class calls times (3 o'clock, 6 o'clock, 1 o'clock) and the student turns one arm. Others call out the angle in degrees using 'times 30'.",
            "Ganita Prakash Ch. 2 (2.4–2.6, angles as turns); old NCERT Ch. 5 (5.3 Angles: Right and Straight).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: The Angle Family · Acute to Reflex",
        "readingTime": "~4 min story",
        "narrative": f"""
<div {STORY}>Disha wants to sort every angle in the house into families: the sharp ones, the square ones, the lazy ones and the very big ones. Mummy (Neha) brings examples from her bakery.</div>

<h2>The angle family</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Type</th><th>Size</th><th class="text-left">Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td class="text-emerald-300 font-bold">Acute</td><td class="text-center">0° &lt; x &lt; 90°</td><td>Pencil tip; Leaning Tower of Pisa leans about 4°</td></tr>
    <tr><td class="text-sky-300 font-bold">Right</td><td class="text-center">x = 90°</td><td>Corner of a book or a door frame</td></tr>
    <tr><td class="text-amber-300 font-bold">Obtuse</td><td class="text-center">90° &lt; x &lt; 180°</td><td>A reclining chair</td></tr>
    <tr><td class="text-purple-300 font-bold">Straight</td><td class="text-center">x = 180°</td><td>An open book lying flat</td></tr>
    <tr><td class="text-pink-300 font-bold">Reflex</td><td class="text-center">180° &lt; x &lt; 360°</td><td>A pizza with one slice taken out</td></tr>
    <tr><td class="text-red-300 font-bold">Complete</td><td class="text-center">x = 360°</td><td>A skater's full spin</td></tr>
  </tbody>
</table>
<p>Memory trick: <strong>acute</strong> = "a cute little angle"; <strong>obtuse</strong> = "big and lazy".</p>
""",
        "keyInsight": "Compare with 90° and 180° first. Less than 90° is acute, between 90° and 180° is obtuse, past 180° is reflex.",
        "widgetType": "Class6AngleTurnWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "An angle of 200° is…",
            "options": ["Obtuse", "Straight", "Reflex", "Complete"],
            "correctIndex": 2,
            "explanation": "It is more than 180° but less than 360°, so it is a reflex angle.",
        },
        "teacherNotes": teacher(
            [
                "Use the two 'fences' 90° and 180° as decision points: first ask 'less than or more than 90°?', then 'less than or more than 180°?'.",
                "Show that every angle smaller than 360° has a reflex partner on its outside: 100° inside, 260° outside.",
            ],
            [
                "Calling 90° 'acute' or 180° 'obtuse'. The boundaries belong to right and straight.",
                "Thinking a reflex angle is just a 'big obtuse angle'.",
                "Judging an angle by how it is tilted on the page instead of the opening between its arms.",
            ],
            "Angle sort: hand out 12 cards with drawn angles (including tilted and long-armed ones). Teams sort them into acute, right, obtuse, straight and reflex using only the corner of a sheet of paper as their 90° tester.",
            "Ganita Prakash Ch. 2 (2.7 Special types of angles); old NCERT Ch. 5 (5.4 Angles: Acute, Obtuse and Reflex).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Papa's Bookshelf · Measuring with a Protractor",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Papa is building a bookshelf and needs to cut a support at an exact angle. "Guessing is not good enough," he says. Disha opens her geometry box and takes out the half-moon tool.</div>

<h2>3 steps to measure any angle</h2>
<ol>
  <li><strong>Centre on the vertex.</strong> Put the protractor's centre point exactly on O.</li>
  <li><strong>Base on an arm.</strong> Line up the base line with one arm (OA).</li>
  <li><strong>Read from zero.</strong> Use the scale that starts at <strong>0 on that arm</strong>, and read where the other arm crosses it.</li>
</ol>

<div {CARD}>
  <div class="text-red-300 font-bold">The classic exam mistake</div>
  <div>A protractor has two scales. Reading the wrong one gives <strong>180° − the real angle</strong>. A 65° angle gets read as 115°.</div>
  <div class="text-emerald-300">Check: first decide with your eyes whether the angle is acute or obtuse. Your reading must agree.</div>
</div>
""",
        "keyInsight": "Centre on the vertex, base on an arm, and read the scale that starts at 0 on that arm. Always sanity-check: acute or obtuse?",
        "widgetType": "Class6ProtractorWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "Harsh measures a clearly acute angle and writes 150°. What is the most likely real measure?",
            "options": ["150°", "30°", "60°", "90°"],
            "correctIndex": 1,
            "explanation": "He read the wrong scale. The real angle is 180° − 150° = 30°, which is acute.",
        },
        "teacherNotes": teacher(
            [
                "Demonstrate on the board with a large protractor, saying the three steps aloud every time: centre, base, read from zero.",
                "Make estimation a habit before measuring. It is the best defence against the two-scale mistake.",
            ],
            [
                "Reading the wrong scale (gives 180° − x).",
                "Placing the protractor's bottom edge instead of the base line on the arm (many protractors have a margin).",
                "Arms too short to reach the scale. Teach students to extend arms with a ruler first.",
            ],
            "Estimation league: draw 5 angles on the board. Students write estimates, then measure. Score = total difference from the real values; lowest score wins. Repeat weekly and watch scores fall.",
            "Ganita Prakash Ch. 2 (2.8–2.9 Measuring angles, protractor); old NCERT Ch. 5 (5.5 Measuring Angles).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Proof Lab · Three Angle Rules, Seen and Proved",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>"A good mathematician never trusts a rule until she has tested it," says Dadi. Harsh and Disha test three rules: first with their eyes, then with numbers.</div>

<h2>Rule 1 · Linear pair</h2>
<p>Two angles that sit side by side on a straight line form a <strong>linear pair</strong>.</p>
<div {FORMULA}>∠1 + ∠2 = 180°</div>
<p><strong>Why:</strong> together they fill a straight angle, which is half a turn, 180°.</p>

<h2>Rule 2 · Vertically opposite angles are equal</h2>
<p>When two lines cross, the angles facing each other across the point are <strong>vertically opposite</strong>.</p>
<div {CARD}>
  <div>∠1 + ∠2 = 180° (linear pair)</div>
  <div>∠2 + ∠3 = 180° (linear pair)</div>
  <div>So ∠1 + ∠2 = ∠2 + ∠3</div>
  <div class="text-emerald-300 font-bold">Taking away ∠2 from both sides: ∠1 = ∠3 ✔ (similarly ∠2 = ∠4)</div>
</div>
<p><strong>See it:</strong> spin ∠1 half a turn about the crossing point and it lands exactly on ∠3.</p>

<h2>Rule 3 · Angles around a point</h2>
<div {FORMULA}>Sum of all angles around a point = 360°</div>
<p><strong>Why:</strong> together they make one full turn.</p>
<p class="text-xs text-slate-400">Note: Rules 1 and 2 are formally taught in Class 7 (Lines and Angles). Seeing them now makes Class 7 much easier.</p>
""",
        "keyInsight": "On a line: 180°. Around a point: 360°. Crossing lines: opposite angles are equal, because both make a linear pair with the same neighbour.",
        "widgetType": "Class6AngleProofsWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Two lines cross. One of the four angles is 70°. What is the angle vertically opposite to it?",
            "options": ["110°", "70°", "20°", "290°"],
            "correctIndex": 1,
            "explanation": "Vertically opposite angles are equal, so it is also 70°. (Its neighbours are 180° − 70° = 110°.)",
        },
        "teacherNotes": teacher(
            [
                "Always show 'see it' (the visual) before 'prove it' (the equations). Students should believe the result before they justify it.",
                "Highlight the logical move in Rule 2: two things equal to the same thing (180°) are equal to each other, then remove the common part.",
                "Ask 'will it work for every angle?' and let students drag the figure. A theorem is a rule that never breaks.",
            ],
            [
                "Adding vertically opposite angles to 180° (they are equal, not supplementary).",
                "Treating any two adjacent angles as a linear pair. They must sit on a straight line.",
                "Forgetting the reflex 'outside' angle when adding angles around a point.",
            ],
            "Paper proof: each student draws a straight line and a ray, cuts out the two angles and places them together along a ruler edge (180°). Then cut the 4 angles of crossing lines and lay opposite ones on top of each other.",
            "Bridge content: linear pair and vertically opposite angles are formally in Class 7 Ch. 5 (Lines and Angles). Angles around a point reinforces Class 6 'complete angle'.",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>Exam week! Disha and Harsh sit with Dadi and solve one question at a time: read, picture it, then solve.</div>
<h2>How to attack any angle question</h2>
<ol>
  <li><strong>Draw it</strong> (even a rough sketch).</li>
  <li><strong>Spot the rule</strong>: straight line (180°), full turn (360°), crossing lines (opposite angles equal), clock (30° per hour).</li>
  <li><strong>Write the equation</strong>, then solve.</li>
  <li><strong>Sanity check</strong>: does the answer look acute or obtuse in the drawing?</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Most angle questions use just three facts: 180° on a line, 360° around a point, and 30° per hour on a clock.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Counting line segments",
                    "question": "Four points A, B, C and D lie on a line, in that order. How many different line segments can you name using these points?",
                    "figureSvg": svg_points_on_line(),
                    "steps": [
                        "From A: AB, AC, AD → <strong>3</strong> segments",
                        "From B (AB already counted): BC, BD → <strong>2</strong> segments",
                        "From C: CD → <strong>1</strong> segment",
                        "Total = 3 + 2 + 1 = <strong>6</strong>",
                    ],
                    "answer": "6 line segments (AB, AC, AD, BC, BD, CD)",
                },
                {
                    "title": "Clock angle",
                    "question": "What is the angle between the hour hand and the minute hand of a clock at 4 o'clock? Name the type of angle.",
                    "steps": [
                        "A full turn is 360° and there are 12 hour gaps.",
                        "Each gap = 360° ÷ 12 = <strong>30°</strong>",
                        "At 4 o'clock the hands are 4 gaps apart: 4 × 30° = <strong>120°</strong> (between 90° and 180°)",
                    ],
                    "answer": "120°, an obtuse angle",
                },
                {
                    "title": "Turning directions",
                    "question": "Disha faces North and turns clockwise to face East. What fraction of a turn is this, and how many degrees? If she then turns clockwise from East to West, how many degrees does she turn?",
                    "steps": [
                        "North → East clockwise is one of the four quarters of a full turn: <strong>¼ turn</strong>",
                        "¼ × 360° = <strong>90°</strong>",
                        "East → South → West clockwise is two quarters: ½ turn = <strong>180°</strong>",
                    ],
                    "answer": "¼ turn = 90°; then ½ turn = 180°",
                },
                {
                    "title": "Classifying angles",
                    "question": "Classify: 45°, 90°, 135°, 180°, 210°, 360°.",
                    "steps": [
                        "45° &lt; 90° → <strong>acute</strong>",
                        "90° → <strong>right</strong>; 180° → <strong>straight</strong>; 360° → <strong>complete</strong>",
                        "135° is between 90° and 180° → <strong>obtuse</strong>",
                        "210° is between 180° and 360° → <strong>reflex</strong>",
                    ],
                    "answer": "acute, right, obtuse, straight, reflex, complete",
                },
                {
                    "title": "Linear pair",
                    "question": "Two angles form a linear pair. One of them is 65°. Find the other.",
                    "figureSvg": svg_linear_pair("65°", "x"),
                    "steps": [
                        "Angles of a linear pair add up to 180°: 65° + x = 180°",
                        "x = 180° − 65° = <strong>115°</strong>",
                        "Check: 65° looks acute, 115° looks obtuse ✔",
                    ],
                    "answer": "115°",
                },
                {
                    "title": "Vertically opposite angles",
                    "question": "Two lines intersect. One angle, a, is 40°. Find the other three angles b, c and d.",
                    "figureSvg": svg_crossing("a=40°"),
                    "steps": [
                        "a and b form a linear pair: b = 180° − 40° = <strong>140°</strong>",
                        "c is vertically opposite a: c = <strong>40°</strong>",
                        "d is vertically opposite b: d = <strong>140°</strong>",
                        "Check: 40 + 140 + 40 + 140 = 360° ✔",
                    ],
                    "answer": "b = 140°, c = 40°, d = 140°",
                },
                {
                    "title": "Linear pair in a ratio",
                    "question": "Two angles of a linear pair are x and 2x. Find both angles.",
                    "figureSvg": svg_linear_pair("2x", "x"),
                    "steps": [
                        "Linear pair: x + 2x = 180°",
                        "3x = 180°, so x = 180° ÷ 3 = <strong>60°</strong>",
                        "2x = <strong>120°</strong>",
                    ],
                    "answer": "60° and 120°",
                },
                {
                    "title": "Angles around a point",
                    "question": "Three angles around a point are 100°, 130° and y. Find y.",
                    "steps": [
                        "Angles around a point add up to 360°: 100° + 130° + y = 360°",
                        "230° + y = 360°",
                        "y = 360° − 230° = <strong>130°</strong>",
                    ],
                    "answer": "y = 130°",
                },
                {
                    "title": "Protractor mistake",
                    "question": "Harsh measures an angle that is clearly smaller than a right angle, but writes 130°. What went wrong and what is the real measure?",
                    "steps": [
                        "An angle smaller than 90° cannot be 130°, so the reading is wrong.",
                        "She read the outer scale. Wrong-scale reading = 180° − real angle.",
                        "Real angle = 180° − 130° = <strong>50°</strong>",
                    ],
                    "answer": "He read the wrong scale; the angle is 50°",
                },
                {
                    "title": "Lines through points",
                    "question": "How many lines can be drawn through (a) one point, (b) two points, (c) three points A, B, C that are not on one line, taking two points at a time?",
                    "steps": [
                        "(a) Through one point: <strong>infinitely many</strong> lines",
                        "(b) Through two points: <strong>exactly one</strong> line",
                        "(c) Pairs: AB, BC, CA → <strong>3</strong> lines",
                    ],
                    "answer": "(a) infinitely many, (b) one, (c) three",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Model the 4-step routine (draw, spot the rule, equation, sanity check) aloud for Q1–Q2, then let students lead Q3 onwards.",
                "Q1 introduces the 3 + 2 + 1 pattern. Ask: what about 5 points? (4 + 3 + 2 + 1 = 10).",
            ],
            [
                "Counting AB and BA as two different segments.",
                "In clock questions, counting the number on the dial instead of the number of gaps.",
                "Forgetting to write the degree sign and the reason (e.g., 'linear pair') in board answers.",
            ],
            "Pair-share: student A solves an odd-numbered question aloud while B checks against the steps; swap roles for even-numbered questions.",
            "Covers Ganita Prakash Ch. 2 exercises and old NCERT Ch. 4–5 exercise patterns; Q5–Q7 preview Class 7.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Lines and Angles (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>You have travelled with Harsh and Disha from a kite string to a full proof. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering segments, rays, lines, pairs of lines, angle types, protractor reading, clock angles and the three angle rules.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Before choosing an option, sketch it and ask: acute or obtuse? on a line or around a point?",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Lines and Angles · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "How many end points does a ray have?", "options": ["0", "1", "2", "Infinitely many"], "answer": 1, "explanation": "A ray starts at one end point and goes on forever in one direction.", "topic": "Rays"},
                {"q": "Which of these can be measured with a ruler?", "options": ["A line", "A ray", "A line segment", "None of these"], "answer": 2, "explanation": "Only a line segment has two end points and therefore a fixed length.", "topic": "Line segments"},
                {"q": "The angle between the hands of a clock at 2 o'clock is:", "options": ["30°", "60°", "90°", "120°"], "answer": 1, "explanation": "2 gaps × 30° = 60°.", "topic": "Clock angles"},
                {"q": "An angle of 160° is:", "options": ["Acute", "Right", "Obtuse", "Reflex"], "answer": 2, "explanation": "It is more than 90° and less than 180°.", "topic": "Types of angles"},
                {"q": "An angle of 250° is:", "options": ["Obtuse", "Straight", "Reflex", "Complete"], "answer": 2, "explanation": "It is more than 180° and less than 360°.", "topic": "Types of angles"},
                {"q": "Two angles form a linear pair. One is 72°. The other is:", "options": ["18°", "108°", "288°", "72°"], "answer": 1, "explanation": "Linear pair adds to 180°: 180° − 72° = 108°.", "topic": "Linear pair"},
                {"q": "Two lines intersect and one angle is 110°. The angle vertically opposite to it is:", "options": ["70°", "110°", "250°", "90°"], "answer": 1, "explanation": "Vertically opposite angles are equal.", "topic": "Vertically opposite angles"},
                {"q": "Three-quarters of a full turn measures:", "options": ["90°", "180°", "270°", "300°"], "answer": 2, "explanation": "¾ × 360° = 270°.", "topic": "Turns and degrees"},
                {"q": "Three angles around a point are 90°, 120° and x. What is x?", "options": ["150°", "60°", "90°", "210°"], "answer": 0, "explanation": "90° + 120° + x = 360°, so x = 150°.", "topic": "Angles around a point"},
                {"q": "Disha measures an angle that is clearly acute but reads 120° on her protractor. The real angle is:", "options": ["120°", "30°", "60°", "240°"], "answer": 2, "explanation": "She read the wrong scale: 180° − 120° = 60°.", "topic": "Using a protractor"},
            ],
        },
        "teacherNotes": teacher(
            [
                "Use the exam as a diagnostic: the 'Review these' list on a failed attempt shows exactly which story to revisit.",
            ],
            [
                "Rushing Q9: students often subtract only one angle from 360°.",
                "Q10 is designed to catch the two-scale protractor mistake.",
            ],
            "Exit ticket: before the exam, ask every student to write the three angle rules from memory on a slip of paper.",
            "Matches Ganita Prakash Ch. 2 learning outcomes and old NCERT Ch. 4–5 exam patterns.",
        ),
    },
]


def seed_class6_lines_angles():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Lines and Angles")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Lines and Angles: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Lines and Angles: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_lines_angles()
