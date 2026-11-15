import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Practical Geometry and Constructions (old NCERT Ch. 14 "Practical Geometry": circle with a compass,
# line segment of given length, copying a segment, perpendiculars through a point on / not on a line,
# perpendicular bisector, angle of given measure with a protractor, copying an angle, angle bisector, angles of
# 60, 30, 120, 90 and 45 degrees with a compass; Ganita Prakash Ch. 8 "Playing with Constructions": artwork with
# a compass, points equidistant from two points, constructing squares and rectangles).
# Story: the Jaipur family's new geometry box, a Diwali rangoli, Papa's railway sleepers, a kite frame and a
# Diwali lantern.
#
# Verified facts used:
# - Indian Railways broad gauge track: rails 1,676 mm apart (5 feet 6 inches). (Indian Railways / Wikipedia
#   "5 ft 6 in gauge railway".)
# - The Sulba Sutras (Baudhayana's is the oldest, roughly 800 to 500 BCE) give rope-and-peg constructions of
#   squares, rectangles and right angles for Vedic fire altars. (MacTutor History of Mathematics, "The
#   Indian Sulbasutras".) Narration only says "more than 2,500 years ago".
# - The radius of a circle steps round its circumference exactly 6 times (regular hexagon), which is why the
#   compass flower has 6 petals and why the arc construction gives 60 degrees (equilateral triangle).


SCENES_1 = [
    scene([
        L("Narrator", "It is the week before Diwali in Jaipur. Dadi opens a shiny new geometry box on the dining table.",
          "Jaipur mein Diwali se pehle ka hafta hai. Dadi dining table par ek chamakta naya geometry box kholti hain."),
        L("Dadi", "Inside we have a ruler, a compass, a divider, two set squares and a protractor. With just a ruler and a compass, we can build almost every shape!",
          "Is mein ruler, compass, divider, do set squares aur ek protractor hai. Sirf ruler aur compass se hum lagbhag har shape bana sakte hain!"),
    ], {"mode": "circle", "r": 3, "step": 1}),
    scene([
        L("Disha", "I want a perfect circle for my rangoli. How do I start?", "Mujhe rangoli ke liye ek perfect circle chahiye. Shuru kaise karoon?"),
        L("Dadi", "Mark a point O for the centre. Then open the compass on the ruler: needle on 0, pencil on 3. Now the opening is 3 centimetres.",
          "Centre ke liye ek point O lagao. Phir ruler par compass kholo: needle 0 par, pencil 3 par. Ab opening 3 centimetre hai."),
    ], {"mode": "circle", "r": 3, "step": 2}),
    scene([
        L("Dadi", "Keep the needle firmly on O and turn the compass one full round. Do not let the opening change!",
          "Needle ko O par mazboot rakho aur compass ko ek poora chakkar ghumao. Opening badalni nahi chahiye!"),
    ], {"mode": "circle", "r": 3, "step": 3}),
    scene([
        L("Disha", "Every point on my circle is exactly 3 centimetres from O!", "Mere circle ka har point O se theek 3 centimetre door hai!"),
        L("Dadi", "Yes, beta. That distance is the radius. The compass remembers a length, and that is its superpower.",
          "Haan beta. Woh doori radius hai. Compass ek lambaai yaad rakhta hai, yahi uski superpower hai."),
    ], {"mode": "circle", "r": 3, "step": 4}),
    scene([
        L("Deepak", "At the railway, we cut steel bars to exact lengths. Let me draw a line segment of 4.7 centimetres.",
          "Railway mein hum steel ki chhadein bilkul sahi lambaai mein kaatte hain. Main 4.7 centimetre ka line segment banaata hoon."),
        L("Deepak", "First a long line l, and a point A on it. Then the compass opens to 4.7 centimetres on the ruler.",
          "Pehle ek lambi line l, aur us par ek point A. Phir compass ruler par 4.7 centimetre khulta hai."),
    ], {"mode": "segment", "len": 4.7, "step": 2}),
    scene([
        L("Deepak", "Needle on A, a small arc cuts the line at B. AB is exactly 4.7 centimetres.",
          "Needle A par, ek chhota arc line ko B par kaatta hai. AB theek 4.7 centimetre hai."),
        L("Harsh", "Why not just draw it straight along the ruler, Papa?", "Papa, seedha ruler ke saath kyon nahi bana dete?"),
        L("Deepak", "You can, but the compass is more accurate. A thick ruler mark or a tilted eye can easily give a small error.",
          "Bana sakte ho, lekin compass zyaada accurate hai. Ruler ka mota nishaan ya tircchi nazar aasaani se chhoti galti kar deti hai."),
    ], {"mode": "segment", "len": 4.7, "step": 4}),
    scene([
        L("Dadi", "Now a magic trick. Here is a segment AB. Can you copy it without reading any number?",
          "Ab ek jaadu. Yeh raha segment AB. Kya tum koi number padhe bina ise copy kar sakte ho?"),
        L("Disha", "I open the compass from A to B, then put the needle on P and cut the line at Q. PQ equals AB!",
          "Main compass A se B tak kholti hoon, phir needle P par rakhkar line ko Q par kaatti hoon. PQ barabar AB!"),
    ], {"mode": "copy", "len": 5, "step": 5}),
    scene([
        L("Dadi", "Your turn! Set the radius to 3.5 centimetres and draw the circle step by step.",
          "Ab aapki baari! Radius 3.5 centimetre rakho aur step by step circle banao."),
    ], {"mode": "circle", "r": 2, "step": 1, "task": {"r": 3.5}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "On Sunday, Papa takes the children to see a new railway track being laid near Jaipur Junction.",
          "Itvaar ko Papa bachchon ko Jaipur Junction ke paas bichh rahi nayi railway line dikhaane le jaate hain."),
        L("Deepak", "Look at the concrete sleepers under the rails. Each one must sit at exactly 90 degrees to the rail. On broad gauge, the two rails are 1,676 millimetres apart.",
          "Rails ke neeche concrete sleepers dekho. Har ek rail se theek 90 degree par hona chahiye. Broad gauge mein dono rails 1,676 millimetre door hoti hain."),
    ], {"mode": "onLine", "step": 1}),
    scene([
        L("Deepak", "Here is the rail, line l, and P is the spot for a sleeper. Needle on P, I draw an arc that cuts l at A and B.",
          "Yeh rail hai, line l, aur P ek sleeper ki jagah hai. Needle P par rakhkar main ek arc banaata hoon jo l ko A aur B par kaatta hai."),
        L("Disha", "So P is exactly in the middle of A and B!", "Toh P, A aur B ke bilkul beech mein hai!"),
    ], {"mode": "onLine", "step": 2}),
    scene([
        L("Deepak", "Now I open the compass wider. From A and from B, with the same opening, two arcs cross at Q.",
          "Ab main compass aur khol deta hoon. A se aur B se, same opening ke saath, do arcs Q par milte hain."),
    ], {"mode": "onLine", "step": 3}),
    scene([
        L("Deepak", "Join P and Q. The sleeper line is perpendicular to the rail.", "P aur Q ko jodo. Sleeper ki line rail ke perpendicular hai."),
        L("Dadi", "Perpendicular means it meets the line at a right angle, 90 degrees. Check it with the corner of a set square.",
          "Perpendicular ka matlab hai line se right angle, yaani 90 degree par milna. Set square ke kone se check karo."),
    ], {"mode": "onLine", "step": 4}),
    scene([
        L("Harsh", "What if the point is not on the rail? Like a signal post P standing away from it?",
          "Agar point rail par na ho toh? Jaise ek signal post P jo usse door khada ho?"),
        L("Deepak", "Same idea. Needle on P, draw an arc that cuts the line at A and B.", "Wahi idea. Needle P par, ek arc banao jo line ko A aur B par kaate."),
    ], {"mode": "offLine", "step": 2}),
    scene([
        L("Deepak", "From A and B, with the same opening, draw arcs on the other side. They cross at Q.",
          "A aur B se, same opening ke saath, doosri taraf arcs banao. Woh Q par milte hain."),
        L("Deepak", "Join P and Q. It meets the line at M, at 90 degrees. PM is the shortest path from the post to the rail.",
          "P aur Q ko jodo. Yeh line ko M par 90 degree par milti hai. PM post se rail tak ka sabse chhota raasta hai."),
    ], {"mode": "offLine", "step": 4}),
    scene([
        L("Dadi", "You can also do this with a ruler and a set square: put one edge of the set square on the line, slide it to P, and draw along the other edge.",
          "Yeh ruler aur set square se bhi kar sakte ho: set square ka ek kinara line par rakho, use P tak khiskao, aur doosre kinare ke saath line kheencho."),
        L("Harsh", "Two methods, same right angle. Nice!", "Do tareeke, wahi right angle. Badhiya!"),
    ], {"mode": "offLine", "step": 4}),
]

SCENES_3 = [
    scene([
        L("Narrator", "Disha is making a kite for Makar Sankranti. She needs the centre stick to cut the cross stick exactly in half.",
          "Disha Makar Sankranti ke liye patang bana rahi hai. Use beech wali dandi chahiye jo aadi dandi ko theek aadha kaate."),
        L("Dadi", "Then we need the perpendicular bisector. Bisect means cut into two equal parts. Draw AB, 7 centimetres.",
          "Toh hamein perpendicular bisector chahiye. Bisect ka matlab do barabar hisson mein kaatna. AB banao, 7 centimetre."),
    ], {"mode": "bisector", "step": 1}),
    scene([
        L("Dadi", "Open the compass to more than half of AB. With the needle on A, draw arcs above and below.",
          "Compass ko AB ke aadhe se zyaada kholo. Needle A par rakhkar upar aur neeche arcs banao."),
        L("Harsh", "Why more than half?", "Aadhe se zyaada kyon?"),
        L("Dadi", "If it is less than half, the arcs from A and B never meet! Try it and see.", "Agar aadhe se kam ho, toh A aur B ke arcs kabhi milenge hi nahi! Karke dekho."),
    ], {"mode": "bisector", "step": 2}),
    scene([
        L("Dadi", "Same opening, needle on B. The arcs cross at P and Q. Join P and Q.", "Same opening, needle B par. Arcs P aur Q par milte hain. P aur Q ko jodo."),
    ], {"mode": "bisector", "step": 4}),
    scene([
        L("Disha", "PQ cuts AB at M. AM is 3.5 centimetres and MB is 3.5 centimetres, and the angle is 90 degrees!",
          "PQ, AB ko M par kaatti hai. AM 3.5 centimetre hai aur MB bhi 3.5 centimetre, aur angle 90 degree hai!"),
        L("Dadi", "One line, two jobs. It bisects AB and it is perpendicular to AB.", "Ek line, do kaam. Yeh AB ko bisect karti hai aur AB ke perpendicular bhi hai."),
    ], {"mode": "bisector", "step": 5}),
    scene([
        L("Dadi", "Now a puzzle from your new book. A and B are 5 centimetres apart. Which points are equally far from both?",
          "Ab tumhaari nayi kitaab se ek paheli. A aur B 5 centimetre door hain. Kaun se points dono se barabar door hain?"),
        L("Disha", "Draw a 4 centimetre circle around A and another around B. Where they cross, the point is 4 centimetres from both!",
          "A ke chaaron taraf 4 centimetre ka circle banao aur B ke chaaron taraf bhi. Jahaan woh milte hain, woh point dono se 4 centimetre door hai!"),
    ], {"mode": "equal", "step": 3}),
    scene([
        L("Harsh", "With 3 centimetre circles we get two more points, R and S!", "3 centimetre ke circles se do aur points milte hain, R aur S!"),
        L("Dadi", "And look, they all stand on one straight line. Every point that is equally far from A and B lies on the perpendicular bisector of AB.",
          "Aur dekho, yeh sab ek hi seedhi line par khade hain. A aur B se barabar door har point AB ke perpendicular bisector par hota hai."),
    ], {"mode": "equal", "step": 5}),
    scene([
        L("Dadi", "Your turn! Drag X to a point that is the same distance from A and from B.", "Ab aapki baari! X ko aise point par le jao jo A aur B se barabar door ho."),
    ], {"mode": "hunt", "x": 150, "y": 80, "task": {"equal": True}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "Harsh is building a cricket scoreboard stand from wooden strips. The slanting support must be at 40 degrees.",
          "Harsh lakdi ki pattiyon se cricket scoreboard ka stand bana raha hai. Tircchi support 40 degree par honi chahiye."),
        L("Dadi", "Use the protractor. Draw a ray BA, then put the protractor centre exactly on B with the zero line along BA.",
          "Protractor use karo. Ek ray BA banao, phir protractor ka centre theek B par rakho aur zero line BA ke saath."),
    ], {"mode": "protractor", "deg": 40, "step": 2}),
    scene([
        L("Harsh", "I count from the 0 on the BA side, up to 40, and mark C. Then I join B to C.",
          "Main BA wali taraf ke 0 se 40 tak ginta hoon aur C lagaata hoon. Phir B ko C se jodta hoon."),
        L("Dadi", "Careful, beta. A protractor has two scales. Always start from the 0 that sits on your ray, or you will get 140 degrees instead!",
          "Dhyaan se, beta. Protractor par do scales hote hain. Hamesha us 0 se shuru karo jo tumhaari ray par hai, warna 140 degree ban jaayega!"),
    ], {"mode": "protractor", "deg": 40, "step": 5}),
    scene([
        L("Neha", "In my bakery I copy shapes all the time. Can we copy an angle without a protractor too?",
          "Meri bakery mein main hamesha shapes copy karti hoon. Kya bina protractor ke angle bhi copy ho sakta hai?"),
        L("Dadi", "Yes! Here is angle A. Draw a ray from a new point P. Then, needle on A, draw an arc that cuts the arms at B and C.",
          "Haan! Yeh raha angle A. Ek naye point P se ray banao. Phir needle A par, ek arc banao jo arms ko B aur C par kaate."),
    ], {"mode": "copy", "deg": 50, "step": 3}),
    scene([
        L("Dadi", "Same opening at P: the arc cuts the ray at Q. Now open the compass from B to C. That opening holds the angle.",
          "P par same opening: arc ray ko Q par kaatta hai. Ab compass B se C tak kholo. Yeh opening angle ko yaad rakhti hai."),
    ], {"mode": "copy", "deg": 50, "step": 5}),
    scene([
        L("Neha", "Needle on Q, cut the arc at R, and join P to R. Angle P is an exact copy of angle A!",
          "Needle Q par, arc ko R par kaato, aur P ko R se jodo. Angle P, angle A ki bilkul copy hai!"),
    ], {"mode": "copy", "deg": 50, "step": 7}),
    scene([
        L("Disha", "Can the compass also cut an angle into two equal halves?", "Kya compass ek angle ko do barabar hisson mein bhi kaat sakta hai?"),
        L("Dadi", "Yes. Needle on O, draw an arc that cuts the arms at A and B. From A and B, with the same opening, draw arcs that cross at C.",
          "Haan. Needle O par, ek arc banao jo arms ko A aur B par kaate. A aur B se, same opening ke saath, arcs banao jo C par milein."),
    ], {"mode": "bisect", "deg": 70, "step": 3}),
    scene([
        L("Dadi", "Join O to C. Ray OC is the angle bisector. A 70 degree angle becomes two angles of 35 degrees.",
          "O ko C se jodo. Ray OC angle bisector hai. 70 degree ka angle 35 degree ke do angles ban jaata hai."),
    ], {"mode": "bisect", "deg": 70, "step": 5}),
    scene([
        L("Dadi", "Your turn! Use the protractor to make an angle of 75 degrees.", "Ab aapki baari! Protractor se 75 degree ka angle banao."),
    ], {"mode": "protractor", "deg": 40, "step": 1, "task": {"deg": 75}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "That evening, the protractor goes missing. Harsh used it as a bat for his toy cricket match!",
          "Us shaam protractor gaayab ho jaata hai. Harsh ne use apne toy cricket match mein bat bana liya tha!"),
        L("Dadi", "No problem. Some angles can be made with only a compass. Draw a ray OA. Needle on O, draw a big arc that cuts OA at P.",
          "Koi baat nahi. Kuch angles sirf compass se ban jaate hain. Ek ray OA banao. Needle O par, ek bada arc banao jo OA ko P par kaate."),
    ], {"mode": "60", "step": 2}),
    scene([
        L("Dadi", "Same opening, needle on P, cut the arc at Q. Join O to Q. Angle Q O P is 60 degrees!",
          "Same opening, needle P par, arc ko Q par kaato. O ko Q se jodo. Angle Q O P 60 degree hai!"),
        L("Disha", "But why exactly 60?", "Lekin theek 60 hi kyon?"),
    ], {"mode": "60", "step": 4}),
    scene([
        L("Dadi", "O to P, O to Q and P to Q are all the same compass opening. So triangle O P Q has three equal sides, and each angle of such a triangle is 60 degrees.",
          "O se P, O se Q aur P se Q, sab same compass opening hain. Toh triangle O P Q ki teeno bhujaayein barabar hain, aur aise triangle ka har angle 60 degree hota hai."),
    ], {"mode": "60", "step": 5}),
    scene([
        L("Harsh", "Then I just step again! Needle on Q, cut the arc at R. Angle R O P is 60 plus 60, which is 120 degrees.",
          "Toh main phir se kadam rakhta hoon! Needle Q par, arc ko R par kaato. Angle R O P hai 60 aur 60, yaani 120 degree."),
    ], {"mode": "120", "step": 5}),
    scene([
        L("Dadi", "For 30 degrees, first make 60, then bisect it. From P and Q, arcs cross at S. Angle S O P is half of 60, which is 30 degrees.",
          "30 degree ke liye pehle 60 banao, phir use bisect karo. P aur Q se arcs S par milte hain. Angle S O P, 60 ka aadha, yaani 30 degree hai."),
    ], {"mode": "30", "step": 5}),
    scene([
        L("Deepak", "For 90 degrees, make both 60 and 120, then bisect the gap between them. From Q and R, arcs cross at S.",
          "90 degree ke liye 60 aur 120 dono banao, phir unke beech ke gap ko bisect karo. Q aur R se arcs S par milte hain."),
        L("Deepak", "Halfway between 60 and 120 is 90. That is how a signal post stands perfectly upright!",
          "60 aur 120 ke theek beech 90 hai. Isi tarah signal post bilkul seedha khada hota hai!"),
    ], {"mode": "90", "step": 6}),
    scene([
        L("Disha", "And 45 is half of 90! OS cuts the arc at T. From P and T, arcs cross at U.", "Aur 45, 90 ka aadha hai! OS arc ko T par kaatti hai. P aur T se arcs U par milte hain."),
        L("Dadi", "Join O to U, and angle U O P is 45 degrees. Bisect again and again: 60 gives 30 and then 15, and 90 gives 45.",
          "O ko U se jodo, aur angle U O P 45 degree hai. Baar baar bisect karo: 60 se 30 aur phir 15, aur 90 se 45."),
    ], {"mode": "45", "step": 8}),
    scene([
        L("Dadi", "Your turn! Construct a 90 degree angle with only the compass, step by step.", "Ab aapki baari! Sirf compass se 90 degree ka angle banao, step by step."),
    ], {"mode": "60", "step": 1, "task": {"mode": "90"}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "Two days before Diwali, Mummy wants a rectangular cake board, 6 centimetres by 4 centimetres in her design sketch.",
          "Diwali se do din pehle, Mummy ko apne design sketch mein 6 centimetre by 4 centimetre ka rectangular cake board chahiye."),
        L("Neha", "Draw AB of 6 centimetres. At A, make a 90 degree angle with the compass and draw that arm up.",
          "6 centimetre ka AB banao. A par compass se 90 degree ka angle banao aur woh arm upar kheencho."),
    ], {"mode": "rect", "w": 6, "h": 4, "step": 2}),
    scene([
        L("Neha", "Open the compass to 4 centimetres, needle on A, and cut the arm at D. Do the same at B to get C.",
          "Compass ko 4 centimetre kholo, needle A par, aur arm ko D par kaato. B par bhi aise hi karke C pao."),
    ], {"mode": "rect", "w": 6, "h": 4, "step": 4}),
    scene([
        L("Neha", "Join D to C. Measure it: DC is 6 centimetres too, and every corner is a right angle.", "D ko C se jodo. Naapo: DC bhi 6 centimetre hai, aur har kona right angle hai."),
        L("Dadi", "A rectangle has opposite sides equal and all angles 90 degrees. Your construction checked both!",
          "Rectangle ki aamne saamne ki bhujaayein barabar hoti hain aur saare angles 90 degree. Tumhaari construction ne dono check kar liye!"),
    ], {"mode": "rect", "w": 6, "h": 4, "step": 5}),
    scene([
        L("Harsh", "A square is easy then. All four sides equal, say 5 centimetres each!", "Toh square aasaan hai. Chaaron bhujaayein barabar, maan lo 5 centimetre har ek!"),
        L("Dadi", "More than 2,500 years ago, the Sulba Sutras of India explained how to make squares and rectangles for fire altars, using only ropes and pegs.",
          "2,500 saal se bhi pehle, Bharat ke Sulba Sutras ne sirf rassi aur khoonti se agni vedi ke liye square aur rectangle banaana samjhaaya tha."),
    ], {"mode": "square", "side": 5, "step": 5}),
    scene([
        L("Disha", "Now my favourite part, compass art for the rangoli! I draw a circle of radius 2 centimetres.",
          "Ab mera favourite hissa, rangoli ke liye compass art! Main 2 centimetre radius ka circle banaati hoon."),
        L("Dadi", "Keep the same opening. Put the needle on the circle and draw the arc inside it.", "Opening wahi rakho. Needle circle par rakho aur andar ka arc banao."),
    ], {"mode": "art", "step": 2}),
    scene([
        L("Disha", "Now I move the needle to where the arc meets the circle, and draw again, all the way round.",
          "Ab main needle wahaan le jaati hoon jahaan arc circle se milta hai, aur phir banaati hoon, poora chakkar."),
    ], {"mode": "art", "step": 4}),
    scene([
        L("Dadi", "Six petals! The radius fits exactly 6 times around its own circle, so the flower always has 6 petals.",
          "Chhe pankhudiyaan! Radius apne circle ke chaaron taraf theek 6 baar fit hota hai, isliye phool mein hamesha 6 pankhudiyaan hoti hain."),
        L("Harsh", "Best Diwali rangoli on the street. Shabash, Disha!", "Gali ki sabse acchhi Diwali rangoli. Shabash, Disha!"),
    ], {"mode": "art", "step": 5}),
    scene([
        L("Neha", "Your turn! Build a rectangle 7 centimetres by 3 centimetres for my new cake tray.",
          "Ab aapki baari! Meri nayi cake tray ke liye 7 centimetre by 3 centimetre ka rectangle banao."),
    ], {"mode": "rect", "w": 5, "h": 2, "step": 1, "task": {"w": 7, "h": 3}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "After Diwali, Dadi sets a construction quiz at the dining table.", "Diwali ke baad, Dadi dining table par construction ka quiz rakhti hain."),
        L("Dadi", "Question 1. Write the steps to draw a circle of radius 3.2 centimetres.", "Sawaal 1. 3.2 centimetre radius ka circle banaane ke steps likho."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "Mark the centre O. Open the compass to 3.2 centimetres on the ruler. Keep the needle on O and turn the compass one full round.",
          "Centre O lagao. Ruler par compass 3.2 centimetre kholo. Needle O par rakhkar compass ko ek poora chakkar ghumao."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. AB is 8 centimetres. Its perpendicular bisector meets it at M. How long is AM?",
          "Sawaal 2. AB 8 centimetre hai. Iska perpendicular bisector ise M par milta hai. AM kitna lamba hai?"),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "The bisector cuts AB into two equal parts, so AM is 8 divided by 2, which is 4 centimetres!",
          "Bisector AB ko do barabar hisson mein kaatta hai, toh AM hai 8 bhaag 2, yaani 4 centimetre!"),
        L("Dadi", "Shabash, Harsh.", "Shabash, Harsh."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _bisector_svg():
    """Perpendicular bisector of AB with the two pairs of arcs."""
    return (
        '<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg">'
        '<line x1="70" y1="100" x2="250" y2="100" stroke="#fbbf24" stroke-width="3"/>'
        '<path d="M 156 26 A 110 110 0 0 1 156 174" fill="none" stroke="#38bdf8" stroke-width="2"/>'
        '<path d="M 164 26 A 110 110 0 0 0 164 174" fill="none" stroke="#38bdf8" stroke-width="2"/>'
        '<line x1="160" y1="15" x2="160" y2="185" stroke="#34d399" stroke-width="2.5"/>'
        '<circle cx="70" cy="100" r="4" fill="#fbbf24"/><circle cx="250" cy="100" r="4" fill="#fbbf24"/>'
        '<circle cx="160" cy="100" r="4" fill="#34d399"/>'
        '<text x="52" y="105" fill="#fbbf24" font-size="15" font-weight="bold">A</text>'
        '<text x="258" y="105" fill="#fbbf24" font-size="15" font-weight="bold">B</text>'
        '<text x="166" y="118" fill="#34d399" font-size="15" font-weight="bold">M</text>'
        '<text x="166" y="22" fill="#e2e8f0" font-size="15" font-weight="bold">P</text>'
        '<text x="166" y="190" fill="#e2e8f0" font-size="15" font-weight="bold">Q</text>'
        '</svg>'
    )


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: The New Geometry Box · Circles and Line Segments",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>A week before Diwali, Dadi opens a new geometry box. Disha wants a perfect circle for her rangoli, Papa draws a segment of exactly 4.7 cm, and Dadi shows how to copy a segment without reading a single number.</div>

<h2>The geometry box</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Tool</th><th class="text-left">Used for</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Ruler (scale)</td><td>Drawing straight lines and measuring lengths in cm and mm</td></tr>
    <tr><td>Compass</td><td>Drawing circles and arcs; carrying (copying) a length</td></tr>
    <tr><td>Divider</td><td>Comparing and copying lengths (two needle points)</td></tr>
    <tr><td>Set squares (two)</td><td>Drawing perpendicular and parallel lines (one has 45°, 45°, 90°; the other 30°, 60°, 90°)</td></tr>
    <tr><td>Protractor</td><td>Measuring and drawing angles in degrees</td></tr>
  </tbody>
</table>

<h2>Drawing a circle of radius r</h2>
<ol>
  <li>Mark the centre O.</li>
  <li>Open the compass to r cm on the ruler (needle on 0, pencil on r).</li>
  <li>Keep the needle on O and turn the compass one full round without changing the opening.</li>
</ol>
<div {FORMULA}>Every point on the circle is the same distance (the radius) from the centre</div>

<h2>A line segment of given length (e.g. AB = 4.7 cm)</h2>
<ol>
  <li>Draw a line l and mark A on it.</li>
  <li>Open the compass to 4.7 cm on the ruler.</li>
  <li>Needle on A, draw an arc cutting l at B. AB = 4.7 cm.</li>
</ol>
<div {CARD}>
  <div><strong>Why use the compass?</strong> Reading the ruler directly on the page can go wrong: a thick mark, the ruler's thickness, or looking at the scale at a slant (parallax). The compass carries the length exactly.</div>
</div>

<h2>Copying a line segment AB</h2>
<ol>
  <li>Put the needle on A and open the compass until the pencil is on B.</li>
  <li>Draw a line l, mark P on it.</li>
  <li>With the same opening, needle on P, cut l at Q. Then PQ = AB.</li>
</ol>
""",
        "keyInsight": "A compass remembers a length: it draws every point at that distance from the centre, and it can carry a length from one place to another.",
        "widgetType": "Class6CompassRulerWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "To draw a circle of diameter 8 cm, the compass should be opened to:",
            "options": ["8 cm", "4 cm", "16 cm", "2 cm"],
            "correctIndex": 1,
            "explanation": "The compass opening is the radius, and the radius is half the diameter: 8 ÷ 2 = 4 cm.",
        },
        "teacherNotes": teacher(
            [
                "Let every student handle each tool from the box and say what it is for before drawing anything.",
                "Demonstrate holding the compass by its top knob so the opening does not slip while turning.",
                "Contrast measuring directly with the ruler and using the compass; discuss why the compass is more reliable.",
            ],
            [
                "Opening the compass to the diameter instead of the radius.",
                "Pressing on the legs while turning, which changes the opening.",
                "Starting the measurement from the edge of the ruler instead of the 0 mark.",
            ],
            "Circle pattern: draw three circles with the same centre (concentric circles) of radius 2 cm, 3 cm and 4 cm, then draw a 5.6 cm segment and copy it elsewhere on the page.",
            "Old NCERT Ch. 14 (14.2 the circle, 14.3 a line segment of given length, copying a segment); Ganita Prakash Ch. 8 (artwork and circles with a compass).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Railway Sleepers · Perpendicular Lines",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Papa takes the children to see a new railway track. Every concrete sleeper must sit at exactly 90° to the rails, so Papa shows how to construct a perpendicular, both through a point on the line and from a signal post standing away from it.</div>

<p>Two lines are <strong>perpendicular</strong> when they meet at a right angle (90°). We write PQ ⊥ l.</p>

<h2>Perpendicular through a point P ON line l</h2>
<ol>
  <li>Needle on P: draw an arc cutting l at A and B (so PA = PB).</li>
  <li>Open the compass wider. From A and from B, with the same opening, draw arcs that cross at Q.</li>
  <li>Join PQ. Then PQ ⊥ l.</li>
</ol>

<h2>Perpendicular from a point P NOT on line l</h2>
<ol>
  <li>Needle on P: draw an arc cutting l at A and B.</li>
  <li>With the same opening (or any opening more than half of AB), from A and B draw arcs on the other side of l, crossing at Q.</li>
  <li>Join PQ; it meets l at M with PM ⊥ l.</li>
</ol>
<div {FORMULA}>Perpendicular = meets at 90°.  The perpendicular PM is the shortest distance from P to l.</div>

<h2>Using a ruler and set square</h2>
<div {CARD}>
  <div>Place a ruler along l. Put one edge of the right angle of a set square along the ruler, slide it until the other edge passes through P, and draw along that edge.</div>
  <div>Real life: railway sleepers and rails, the edges of a book, the corner of a door frame, a plumb line and the floor.</div>
</div>
""",
        "keyInsight": "Equal arcs from two points on either side of P find a point Q that is balanced between them, so PQ stands straight up at 90°.",
        "widgetType": "Class6PerpendicularsWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "In the construction of a perpendicular through P on line l, why do we first draw an arc with centre P cutting l at A and B?",
            "options": ["To make PA = PB", "To make AB = 90°", "To find the length of l", "To draw a circle"],
            "correctIndex": 0,
            "explanation": "The arc makes P the midpoint of AB (PA = PB). Equal arcs from A and B then give Q, and PQ is perpendicular to l.",
        },
        "teacherNotes": teacher(
            [
                "Start from real perpendiculars in the classroom: the corners of the board, door, book.",
                "Do the compass method first, then verify with a set square or protractor.",
                "Stress that the arcs from A and B must have the SAME opening.",
            ],
            [
                "Changing the compass opening between the arcs from A and B.",
                "Using an opening less than half of AB, so the arcs do not meet.",
                "Thinking a perpendicular must be vertical on the page.",
            ],
            "Paper folding: fold a sheet so a crease lies on itself to make a perpendicular; then construct one with compass and check it against the fold.",
            "Old NCERT Ch. 14 (14.4 perpendicular through a point on a line and through a point not on it, using ruler and compass and set squares).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Disha's Kite · Perpendicular Bisector and Equal Distances",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Disha's kite needs a centre stick that cuts the cross stick exactly in half at a right angle. Dadi teaches the perpendicular bisector, then sets a puzzle from Ganita Prakash: find all the points equally far from A and B.</div>

<h2>Perpendicular bisector of AB</h2>
<ol>
  <li>Draw AB (say 7 cm).</li>
  <li>Open the compass to <strong>more than half</strong> of AB. Needle on A, draw arcs above and below AB.</li>
  <li>Same opening, needle on B, draw arcs crossing the first ones at P and Q.</li>
  <li>Join PQ. It cuts AB at M.</li>
</ol>
<div {FORMULA}>AM = MB  and  angle PMB = 90°</div>
<p><strong>Bisect</strong> means cut into two equal parts. PQ bisects AB and is perpendicular to it, so it is the <strong>perpendicular bisector</strong>.</p>

<h2>Points at equal distance from two points (Ganita Prakash)</h2>
<div {CARD}>
  <div>A and B are 5 cm apart. Circles of radius 4 cm with centres A and B meet at two points, each 4 cm from A and 4 cm from B.</div>
  <div>Circles of radius 3 cm give two more such points. Any radius more than 2.5 cm (half of AB) works.</div>
  <div><strong>All points equidistant from A and B lie on the perpendicular bisector of AB</strong>, and every point on it is equidistant from A and B.</div>
</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Radius</th><th>Do the circles meet?</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>2 cm</td><td class="text-center">No (2 + 2 = 4 is less than 5)</td></tr>
    <tr><td>2.5 cm</td><td class="text-center">Touch at one point, the midpoint M</td></tr>
    <tr><td>3 cm, 4 cm, …</td><td class="text-center">Yes, at two points</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "A point is equally far from A and B exactly when it lies on the perpendicular bisector of AB.",
        "widgetType": "Class6PerpendicularsWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "AB = 6 cm. To construct its perpendicular bisector, which compass opening will NOT work?",
            "options": ["4 cm", "3.5 cm", "5 cm", "2.5 cm"],
            "correctIndex": 3,
            "explanation": "The opening must be more than half of AB, which is 3 cm. With 2.5 cm the arcs from A and B never meet.",
        },
        "teacherNotes": teacher(
            [
                "Fold AB so A lies on B: the crease is the perpendicular bisector. Then construct it and compare.",
                "Ask students to measure PA and PB, QA and QB, and notice they are all equal.",
                "Use the Ganita Prakash 'equal distance' investigation to show WHY the construction works.",
            ],
            [
                "Choosing an opening less than half of AB.",
                "Drawing only arcs above AB and joining P to some point by eye.",
                "Thinking the perpendicular bisector must pass through A or B.",
            ],
            "Treasure hunt: mark two 'trees' A and B in the playground; students find spots equally far from both with a rope, and discover they form a straight line.",
            "Old NCERT Ch. 14 (14.4.3 perpendicular bisector); Ganita Prakash Ch. 8 (points equidistant from two given points).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: The Scoreboard Stand · Making, Copying and Bisecting Angles",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Harsh builds a cricket scoreboard stand that needs a 40° support. He uses the protractor, Mummy wants to copy an angle from a cake template, and Disha learns to cut an angle into two equal halves.</div>

<h2>An angle of given measure with a protractor (e.g. 40°)</h2>
<ol>
  <li>Draw a ray BA.</li>
  <li>Place the protractor centre on B with its base line along BA.</li>
  <li>Start from the 0 that lies on BA, count to 40 and mark C.</li>
  <li>Join BC. Angle ABC = 40°.</li>
</ol>
<div {CARD}><div><strong>Two scales!</strong> If you read the other scale you get 180° − 40° = 140°. Always start from the 0 on your ray.</div></div>

<h2>Copying an angle with compass and ruler</h2>
<ol>
  <li>Draw a ray from P.</li>
  <li>Needle on A (vertex of the given angle): an arc cuts the arms at B and C.</li>
  <li>Same opening, needle on P: an arc cuts the ray at Q.</li>
  <li>Open the compass to BC. Needle on Q, cut the arc at R.</li>
  <li>Join PR. Angle QPR = angle BAC.</li>
</ol>

<h2>Bisector of an angle</h2>
<ol>
  <li>Needle on O: an arc cuts the arms at A and B.</li>
  <li>From A and B, with the same opening (more than half of AB), draw arcs crossing at C.</li>
  <li>Join OC. Ray OC divides angle AOB into two equal angles.</li>
</ol>
<div {FORMULA}>Angle AOC = Angle COB = half of Angle AOB</div>
""",
        "keyInsight": "The compass copies an angle by copying two lengths: the arc radius and the chord between the arms.",
        "widgetType": "Class6AngleToolsWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Ray OC bisects angle AOB = 130°. What is angle AOC?",
            "options": ["130°", "65°", "50°", "260°"],
            "correctIndex": 1,
            "explanation": "A bisector cuts the angle into two equal parts: 130 ÷ 2 = 65°.",
        },
        "teacherNotes": teacher(
            [
                "Show both protractor scales on the board and practise choosing the correct 0.",
                "For copying, tell students the compass 'remembers' the gap BC; that is what fixes the angle.",
                "Check bisectors by folding the paper along OC: the arms should land on each other.",
            ],
            [
                "Reading the wrong scale (140° instead of 40°).",
                "Not placing the protractor centre exactly on the vertex.",
                "Changing the opening between the two arcs when copying an angle.",
            ],
            "Angle relay: student 1 draws an angle with a protractor, student 2 copies it with compass only, student 3 bisects the copy, and student 4 measures all parts.",
            "Old NCERT Ch. 14 (14.5 angles: given measure, copy of an angle, angle bisector).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: The Missing Protractor · 60°, 120°, 30°, 90° and 45° with a Compass",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Harsh has turned the protractor into a cricket bat, so Dadi shows how to make special angles with only a compass and a ruler.</div>

<h2>60° (the key construction)</h2>
<ol>
  <li>Draw ray OA. Needle on O: a big arc cuts OA at P.</li>
  <li>Same opening, needle on P: cut the arc at Q.</li>
  <li>Join OQ. Angle QOP = 60°.</li>
</ol>
<div {CARD}><div><strong>Why 60°?</strong> OP = OQ = PQ (all one compass opening), so triangle OPQ is equilateral, and each angle of an equilateral triangle is 60°.</div></div>

<h2>The others</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Angle</th><th class="text-left">How</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>120°</td><td>Step the same opening twice from P: P → Q → R. Angle ROP = 60° + 60°</td></tr>
    <tr><td>30°</td><td>Bisect 60°</td></tr>
    <tr><td>90°</td><td>Make 60° (Q) and 120° (R), then bisect angle ROQ: 60° + 30° = 90°</td></tr>
    <tr><td>45°</td><td>Bisect 90°</td></tr>
    <tr><td>15°, 22½°, 135° …</td><td>Bisect again (15° from 30°), or add (135° = 90° + 45°)</td></tr>
  </tbody>
</table>
<div {FORMULA}>Compass-only angles: 60°, then add (120°) and halve (30°, 15°, 90°, 45°)</div>
""",
        "keyInsight": "The compass radius makes an equilateral triangle, giving 60°; adding and bisecting 60° gives 120°, 30°, 90° and 45°.",
        "widgetType": "Class6CompassAnglesWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "Which angle can you get by bisecting the 90° angle and then bisecting one of the halves again?",
            "options": ["30°", "22.5°", "15°", "45°"],
            "correctIndex": 1,
            "explanation": "90 ÷ 2 = 45, and 45 ÷ 2 = 22.5°.",
        },
        "teacherNotes": teacher(
            [
                "Build 60° first and spend time on WHY (equilateral triangle) before moving on.",
                "Treat 120°, 30°, 90° and 45° as 'add or halve' from 60°: draw a family tree of angles on the board.",
                "Have students check every compass angle with a protractor afterwards.",
            ],
            [
                "Changing the opening after the first big arc.",
                "Bisecting the wrong angle for 90° (they must bisect between 60° and 120°).",
                "Drawing a small first arc, so later arcs fall off the page.",
            ],
            "Compass-only challenge: in pairs, construct 60°, 120°, 30°, 90°, 45° and 135° without a protractor; the partner checks each with a protractor (allowed error 1°).",
            "Old NCERT Ch. 14 (14.6 angles of special measures: 60°, 30°, 120°, 90°, 45°).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Diwali Decorations · Squares, Rectangles and Compass Art",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Mummy needs a rectangular cake board, Harsh makes a square, and Disha draws a six-petal compass flower for the Diwali rangoli.</div>

<h2>Constructing a rectangle (e.g. 6 cm by 4 cm)</h2>
<ol>
  <li>Draw AB = 6 cm.</li>
  <li>At A, construct a 90° angle and draw the arm.</li>
  <li>With the compass opened to 4 cm, needle on A, cut the arm at D.</li>
  <li>Do the same at B to get C (BC = 4 cm, angle B = 90°).</li>
  <li>Join DC. Check: DC = 6 cm and angles C and D are 90°.</li>
</ol>
<div {FORMULA}>Rectangle: opposite sides equal, all angles 90°.  Square: all sides equal, all angles 90°.</div>
<div {CARD}>
  <div>For a square of side 5 cm, use 5 cm for both AB and the compass cuts.</div>
  <div><strong>From history:</strong> more than 2,500 years ago, the Sulba Sutras of India gave rope-and-peg methods for making right angles, squares and rectangles for Vedic fire altars.</div>
</div>

<h2>Compass art (Ganita Prakash)</h2>
<ol>
  <li>Draw a circle of radius 2 cm.</li>
  <li>Same opening: needle on the circle, draw the arc inside.</li>
  <li>Move the needle to where the arc meets the circle and repeat, all the way round.</li>
</ol>
<p>You get a six-petal flower, because the radius steps around its own circle exactly 6 times (this also gives a regular hexagon). Combine circles and arcs to make rangoli, wavy borders and other designs.</p>
""",
        "keyInsight": "A rectangle is built from right angles and two pairs of equal lengths; the compass supplies both.",
        "widgetType": "Class6SquareArtWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "You construct ABCD with AB = 7 cm, angle A = angle B = 90°, AD = BC = 3 cm. What is the length of DC?",
            "options": ["3 cm", "10 cm", "7 cm", "4 cm"],
            "correctIndex": 2,
            "explanation": "ABCD is a rectangle, and opposite sides of a rectangle are equal, so DC = AB = 7 cm.",
        },
        "teacherNotes": teacher(
            [
                "Revise the 90° construction from Story 5 before building rectangles.",
                "After the construction, ask students to measure DC and the angles at C and D as a self-check.",
                "Let students explore compass art freely; ask them why the flower has exactly 6 petals.",
            ],
            [
                "Drawing the right angle at A by eye.",
                "Measuring AD and BC from the wrong end of the ruler.",
                "Changing the compass opening while drawing the petals.",
            ],
            "Rangoli design contest: each student creates a compass design using at least one circle, the six-petal flower and a square, then explains the steps to a partner.",
            "Ganita Prakash Ch. 8 (artwork with a compass, constructing squares and rectangles); links to old NCERT Ch. 14 (90° construction).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · Practical Geometry",
        "readingTime": "~12 min practice",
        "narrative": f"""
<p>Ten exam-style questions. Try each one with your geometry box first, then reveal the steps.</p>
<div {CARD}><div>Always write the steps of construction in order. Examiners look for the arcs, so do not rub them out!</div></div>
""",
        "keyInsight": "Every construction is a short list of compass and ruler moves; write the steps and leave the arcs visible.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Drawing a circle",
                    "question": "Write the steps to draw a circle of radius 3.2 cm.",
                    "steps": [
                        "Mark a point O as the centre.",
                        "Place the compass needle on 0 of the ruler and open the pencil to 3.2 cm.",
                        "Keep the needle on O and turn the compass one full round.",
                    ],
                    "answer": "A circle with centre O and radius 3.2 cm",
                },
                {
                    "title": "Perpendicular bisector",
                    "question": "AB = 8 cm. Its perpendicular bisector PQ meets AB at M. Find AM and the angle PMB.",
                    "figureSvg": _bisector_svg(),
                    "steps": [
                        "The perpendicular bisector cuts AB into two equal parts.",
                        "AM = 8 ÷ 2 = 4 cm.",
                        "It is perpendicular to AB, so <strong>AM = 4 cm and angle PMB = 90°</strong>.",
                    ],
                    "answer": "4 cm, 90°",
                },
                {
                    "title": "Segment as a difference",
                    "question": "AB = 7.3 cm and CD = 3.4 cm. Construct a segment whose length is AB − CD. What is its length?",
                    "steps": [
                        "Draw AB = 7.3 cm.",
                        "Open the compass to CD = 3.4 cm. Needle on A, cut AB at E, so AE = 3.4 cm.",
                        "Then EB = AB − AE = 7.3 − 3.4 = <strong>3.9 cm</strong>.",
                    ],
                    "answer": "3.9 cm",
                },
                {
                    "title": "Twice a segment",
                    "question": "PQ = 4.5 cm. Using a compass, construct XY = 2 × PQ. How long is XY?",
                    "steps": [
                        "Draw a line l, mark X. Open the compass to PQ.",
                        "Needle on X, cut l at Z (XZ = 4.5 cm). Needle on Z, cut l again at Y.",
                        "XY = 4.5 + 4.5 = <strong>9 cm</strong>.",
                    ],
                    "answer": "9 cm",
                },
                {
                    "title": "Opening for a bisector",
                    "question": "AB = 9 cm. Which compass openings can be used for its perpendicular bisector: 4 cm, 4.5 cm, 5 cm, 6 cm?",
                    "steps": [
                        "The opening must be more than half of AB: 9 ÷ 2 = 4.5 cm.",
                        "4 cm is too small; 4.5 cm makes the arcs only touch at the midpoint.",
                        "<strong>5 cm and 6 cm</strong> work.",
                    ],
                    "answer": "5 cm and 6 cm",
                },
                {
                    "title": "Protractor scales",
                    "question": "Harsh wanted 35° but read the outer scale and drew 145°. Explain the error.",
                    "steps": [
                        "A protractor has two scales, one starting from each end.",
                        "Reading from the wrong zero gives 180° − 35° = 145°.",
                        "<strong>Always count from the 0 that lies on the arm you start from.</strong>",
                    ],
                    "answer": "He used the wrong zero: 180 − 35 = 145",
                },
                {
                    "title": "Bisecting twice",
                    "question": "Angle AOB = 120°. OC bisects it, and OD bisects angle AOC. Find angle AOD and angle DOB.",
                    "steps": [
                        "Angle AOC = 120 ÷ 2 = 60°.",
                        "Angle AOD = 60 ÷ 2 = <strong>30°</strong>.",
                        "Angle DOB = 120 − 30 = <strong>90°</strong>.",
                    ],
                    "answer": "30° and 90°",
                },
                {
                    "title": "Which angles need only a compass?",
                    "question": "Explain how to construct 135° with a compass and ruler.",
                    "steps": [
                        "135° = 90° + 45°.",
                        "Construct 90° at O on ray OA, then extend OA backwards to make a straight angle.",
                        "Bisect the 90° angle on the far side (between the perpendicular and the extended ray): 90° + 45° = <strong>135°</strong>.",
                    ],
                    "answer": "Construct 90°, then bisect the next 90° and add: 90° + 45°",
                },
                {
                    "title": "Rectangle check",
                    "question": "Neha constructs rectangle PQRS with PQ = 6.5 cm and QR = 4 cm. Find RS, SP and the perimeter.",
                    "steps": [
                        "Opposite sides of a rectangle are equal: RS = PQ = 6.5 cm, SP = QR = 4 cm.",
                        "Perimeter = 6.5 + 4 + 6.5 + 4 = <strong>21 cm</strong>.",
                    ],
                    "answer": "RS = 6.5 cm, SP = 4 cm, perimeter 21 cm",
                },
                {
                    "title": "Equal distances",
                    "question": "A and B are 6 cm apart. Using a compass, find a point that is 5 cm from both A and B. How many such points are there?",
                    "steps": [
                        "Draw a circle of radius 5 cm with centre A and another with centre B.",
                        "5 cm is more than half of 6 cm, so the circles cross at two points, one on each side of AB.",
                        "<strong>Two points</strong>, both on the perpendicular bisector of AB.",
                    ],
                    "answer": "Two points",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Have students actually construct Q1, Q3, Q4 and Q10 in their notebooks, not just read the answers.",
                "Q5 and Q10 rely on the 'more than half' rule; connect it to the circles meeting.",
                "Q7 and Q8 practise thinking of angles as sums and halves of 60° and 90°.",
            ],
            [
                "Q3: subtracting from the wrong end or measuring with the ruler instead of the compass.",
                "Q6: not noticing the two protractor scales.",
                "Q9: adding only two sides for the perimeter.",
            ],
            "Pair-share: one student reads a construction step aloud, the other performs it; swap roles each question.",
            "Covers old NCERT Ch. 14 Exercises 14.1–14.6 and Ganita Prakash Ch. 8 activities.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Practical Geometry (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From the geometry box to the Diwali rangoli, you have drawn circles, perpendiculars, bisectors, angles, rectangles and compass art. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering circles, segments, perpendiculars, the perpendicular bisector, angles with protractor and compass, bisectors, rectangles and equal distances.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Ruler for straight lines, compass for equal lengths: together they build every construction.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Practical Geometry · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "To draw a circle of radius 4.5 cm, the compass is opened to:", "options": ["9 cm", "4.5 cm", "2.25 cm", "Any length"], "answer": 1, "explanation": "The compass opening equals the radius, 4.5 cm.", "topic": "Circles"},
                {"q": "Which tool is best for copying a line segment exactly?", "options": ["Protractor", "Set square", "Compass", "Eraser"], "answer": 2, "explanation": "The compass (or divider) carries the exact length from one place to another.", "topic": "Copying a segment"},
                {"q": "The perpendicular bisector of AB = 10 cm meets AB at M. AM = ?", "options": ["10 cm", "20 cm", "2.5 cm", "5 cm"], "answer": 3, "explanation": "It cuts AB into two equal halves: 10 ÷ 2 = 5 cm.", "topic": "Perpendicular bisector"},
                {"q": "For the perpendicular bisector of AB = 7 cm, the compass opening must be:", "options": ["More than 3.5 cm", "Exactly 7 cm", "Less than 3.5 cm", "Exactly 3.5 cm"], "answer": 0, "explanation": "It must be more than half of AB; otherwise the arcs from A and B do not meet in two points.", "topic": "Perpendicular bisector"},
                {"q": "A point P is 6 cm from A and 6 cm from B. Where does P lie?", "options": ["On AB extended", "On the perpendicular bisector of AB", "At A", "Inside a circle around A only"], "answer": 1, "explanation": "Points equally far from A and B lie on the perpendicular bisector of AB.", "topic": "Equal distances"},
                {"q": "Two lines that meet at 90° are called:", "options": ["Parallel", "Intersecting at 60°", "Perpendicular", "Bisectors"], "answer": 2, "explanation": "Perpendicular lines meet at a right angle, 90°.", "topic": "Perpendiculars"},
                {"q": "In the 60° construction, triangle OPQ formed by the arcs is:", "options": ["Equilateral", "Right-angled", "Scalene", "Not a triangle"], "answer": 0, "explanation": "OP, OQ and PQ are all one compass opening, so it is equilateral and each angle is 60°.", "topic": "60 degrees"},
                {"q": "Which angle can be made by bisecting a 60° angle?", "options": ["120°", "45°", "30°", "90°"], "answer": 2, "explanation": "60 ÷ 2 = 30°.", "topic": "Special angles"},
                {"q": "OC bisects angle AOB = 84°. Angle AOC = ?", "options": ["168°", "42°", "84°", "44°"], "answer": 1, "explanation": "84 ÷ 2 = 42°.", "topic": "Angle bisector"},
                {"q": "A rectangle is constructed with AB = 8 cm and BC = 5 cm. What is CD?", "options": ["5 cm", "13 cm", "3 cm", "8 cm"], "answer": 3, "explanation": "Opposite sides of a rectangle are equal: CD = AB = 8 cm.", "topic": "Rectangles"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q1 catches radius versus diameter; Q4 the 'more than half' rule; Q8 and Q9 halving angles."],
            "Exit ticket: construct a 90° angle with compass only, bisect it, and measure both halves with a protractor.",
            "Matches old NCERT Ch. 14 Practical Geometry learning outcomes and Ganita Prakash Ch. 8 goals.",
        ),
    },
]


def seed_class6_practical_geometry():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Practical Geometry and Constructions")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Practical Geometry and Constructions: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Practical Geometry and Constructions: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_practical_geometry()
