import json
from db import SessionLocal
from seed_class10_structure import get_class10_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 10 · Triangles (NCERT Class 10 Mathematics, Chapter 6, rationalised syllabus 2023-24 onward):
# 6.1 introduction, 6.2 similar figures, 6.3 similarity of triangles (Basic Proportionality Theorem with proof,
# its converse), 6.4 criteria for similarity (AAA / AA, SSS, SAS; statements and use, proofs not required).
# "Areas of similar triangles" and "Pythagoras theorem" were deleted in the rationalised syllabus and are left out.
# Story: Harsh and Disha prepare for the boards; Papa's railway signal posts, Mummy's shop banner, Dadi's proofs,
# shadows on the cricket ground.
#
# Facts used:
# - Thales, the Greek mathematician, is credited with the Basic Proportionality Theorem, which is also known as
#   Thales' theorem (NCERT Class 10 Mathematics, Section 6.3, which gives his dates as 640 to 546 B.C.).
# - The story that Thales found the height of an Egyptian pyramid from its shadow is a legend reported by
#   ancient writers (Diogenes Laertius, Plutarch); narration calls it "an old story".
# All other numbers are textbook-style values, not real-world statistics.


# ─────────────────────────────── Story 1: similar figures ───────────────────────────────
SCENES_1 = [
    scene([
        L("Narrator", "Board exams are three months away. Harsh and Disha sit with Dadi on the terrace in Jaipur, chapter 6 open: Triangles.",
          "Board exams teen mahine door hain. Harsh aur Disha Jaipur mein chhat par Dadi ke saath baithe hain, chapter 6 khula hai: Triangles."),
        L("Dadi", "Before triangles, a simple question. Are two circles of different sizes the same shape?",
          "Triangles se pehle ek seedha sawaal. Kya alag size ke do circles ek hi shape ke hain?"),
    ], {"mode": "circles", "k": 1}),
    scene([
        L("Disha", "Yes! A small circle just grows into a big circle. Nothing bends.", "Haan! Chhota circle bas bada ho jaata hai. Kuch tedha nahi hota."),
        L("Dadi", "Figures with the same shape but not necessarily the same size are called similar figures. All circles are similar.",
          "Jin figures ka shape same ho, lekin size same hona zaroori nahi, unhe similar figures kehte hain. Saare circles similar hote hain."),
    ], {"mode": "circles", "k": 2}),
    scene([
        L("Harsh", "Same with squares then. Every square has four right angles and four equal sides, big or small.",
          "Toh squares ke saath bhi yahi. Har square mein chaar right angles aur chaar barabar sides hote hain, chhota ho ya bada."),
        L("Dadi", "Right. All squares are similar, and so are all equilateral triangles.", "Sahi. Saare squares similar hote hain, aur saare equilateral triangles bhi."),
    ], {"mode": "squares", "k": 1.8}),
    scene([
        L("Neha", "My shop banner is the same. The printer made a small proof copy and then the big banner. The logo is exactly the same shape.",
          "Meri dukaan ka banner bhi aisa hi hai. Printer ne pehle chhoti proof copy banaayi, phir bada banner. Logo bilkul same shape ka hai."),
        L("Dadi", "Every length was multiplied by the same number. That number is the scale factor.", "Har lambaai ko ek hi number se guna kiya gaya. Woh number scale factor hai."),
    ], {"mode": "photo", "k": 2}),
    scene([
        L("Disha", "And if the scale factor is exactly 1, the copy is the same size too?", "Aur agar scale factor theek 1 ho, toh copy size mein bhi same hogi?"),
        L("Dadi", "Then the figures are congruent: same shape and same size. So every congruent pair is similar, but a similar pair need not be congruent.",
          "Tab figures congruent hain: same shape aur same size. Toh har congruent jodi similar hai, lekin har similar jodi congruent ho, zaroori nahi."),
    ], {"mode": "congruent", "k": 1}),
    scene([
        L("Harsh", "What if I stretch the logo only sideways?", "Agar main logo ko sirf side mein kheench doon toh?"),
        L("Dadi", "Then it is squashed and no longer the same shape. Similar means every length is scaled by the same factor.",
          "Tab woh dab jaata hai aur shape same nahi rehta. Similar ka matlab hai har lambaai ek hi factor se scale ho."),
    ], {"mode": "stretch", "k": 2}),
    scene([
        L("Dadi", "Your turn! Set the scale factor to 3 and make a similar copy three times as large.", "Ab aapki baari! Scale factor 3 karo aur teen guna badi similar copy banao."),
    ], {"mode": "photo", "k": 1.5, "task": {"k": 3}}, wait=True),
]

# ─────────────────────────────── Story 2: similar polygons ───────────────────────────────
SCENES_2 = [
    scene([
        L("Narrator", "Papa brings home two drawings of a station platform, one at a small scale and one at a large scale.",
          "Papa ghar par station platform ke do drawing laate hain, ek chhote scale par aur ek bade scale par."),
        L("Deepak", "In both drawings the platform is a quadrilateral A B C D and P Q R S. Engineers call them similar. Let us check what that means.",
          "Dono drawings mein platform ek quadrilateral hai, A B C D aur P Q R S. Engineers inhe similar kehte hain. Dekhte hain iska matlab kya hai."),
    ], {"mode": "both"}),
    scene([
        L("Dadi", "Two polygons with the same number of sides are similar if two things are true. First, their corresponding angles are equal.",
          "Same number of sides wale do polygons similar hain agar do baatein sach hon. Pehli, unke corresponding angles barabar hon."),
        L("Dadi", "Second, their corresponding sides are in the same ratio, that is, proportional.", "Doosri, unke corresponding sides ek hi ratio mein hon, yaani proportional."),
    ], {"mode": "both", "show": "sides"}),
    scene([
        L("Harsh", "Easy. Then I only need to check the angles.", "Aasaan hai. Toh main sirf angles check karunga."),
        L("Deepak", "Careful, Harsh. A square and a long rectangle both have four right angles. Equal angles, but the sides are not in one ratio. Not similar!",
          "Dhyaan se, Harsh. Square aur lamba rectangle, dono mein chaar right angles hain. Angles barabar, lekin sides ek ratio mein nahi. Similar nahi!"),
    ], {"mode": "rect"}),
    scene([
        L("Disha", "And the other way? A square and a rhombus have all sides equal, so the sides are in one ratio.",
          "Aur ulta? Square aur rhombus ke saare sides barabar hain, toh sides ek ratio mein hain."),
        L("Dadi", "But the rhombus angles are not right angles. So again, not similar. For polygons we need both conditions.",
          "Lekin rhombus ke angles right angles nahi hain. Toh phir se, similar nahi. Polygons ke liye dono conditions chahiye."),
    ], {"mode": "rhombus"}),
    scene([
        L("Dadi", "For triangles we write triangle A B C is similar to triangle P Q R, and the order of letters matters. A matches P, B matches Q and C matches R.",
          "Triangles ke liye hum likhte hain triangle A B C similar hai triangle P Q R ke, aur letters ka order zaroori hai. A ka match P, B ka Q aur C ka R."),
        L("Disha", "So A B by P Q equals B C by Q R equals C A by R P.", "Toh A B bata P Q barabar B C bata Q R barabar C A bata R P."),
    ], {"mode": "triangle"}),
    scene([
        L("Deepak", "Your turn! Pick the pair of shapes that is truly similar.", "Ab aapki baari! Woh jodi chuno jo sach mein similar hai."),
    ], {"mode": "rect", "task": {"pick": "both"}}, wait=True),
]

# ─────────────────────────────── Story 3: BPT ───────────────────────────────
SCENES_3 = [
    scene([
        L("Narrator", "On Sunday, Papa takes the twins to see a new signal gantry. Its side frame is a big triangle with a cross beam.",
          "Itvaar ko Papa dono ko naya signal gantry dikhaane le jaate hain. Uska side frame ek bada triangle hai, beech mein ek cross beam."),
        L("Deepak", "The cross beam D E is parallel to the base B C. Watch where it cuts the two slanting sides.",
          "Cross beam D E base B C ke parallel hai. Dekho woh dono tirchhi sides ko kahaan kaatta hai."),
    ], {"mode": "basic", "t": 0.5}),
    scene([
        L("Disha", "At the middle, A D equals D B and A E equals E C. Both ratios are 1.", "Beech mein, A D barabar D B aur A E barabar E C. Dono ratio 1 hain."),
        L("Deepak", "Now I slide the beam up. A D by D B is 1 by 2, and A E by E C is also 1 by 2!", "Ab main beam upar khiskaata hoon. A D bata D B hai 1 bata 2, aur A E bata E C bhi 1 bata 2!"),
    ], {"mode": "basic", "t": 0.3333}),
    scene([
        L("Dadi", "This is the Basic Proportionality Theorem. If a line is drawn parallel to one side of a triangle to cut the other two sides at distinct points, the other two sides are divided in the same ratio.",
          "Yeh Basic Proportionality Theorem hai. Agar triangle ki ek side ke parallel line kheenchein jo baaki do sides ko alag points par kaate, toh woh do sides ek hi ratio mein bant jaati hain."),
        L("Dadi", "It is also called Thales theorem, after the Greek mathematician Thales.", "Ise Thales theorem bhi kehte hain, Greek mathematician Thales ke naam par."),
    ], {"mode": "basic", "t": 0.6}),
    scene([
        L("Harsh", "Fine, but the board wants a proof, not a gantry. How do we prove it?", "Theek hai, lekin board ko proof chahiye, gantry nahi. Prove kaise karein?"),
        L("Dadi", "With areas. Join B E and C D. Area of a triangle is half times base times height.", "Areas se. B E aur C D jodo. Triangle ka area hai aadha guna base guna height."),
    ], {"mode": "proof", "step": 1, "t": 0.45}),
    scene([
        L("Dadi", "Triangles A D E and B D E have the same height from E, so their area ratio is A D by D B.",
          "Triangle A D E aur B D E ki E se height same hai, toh unke area ka ratio A D bata D B hai."),
    ], {"mode": "proof", "step": 2, "t": 0.45}),
    scene([
        L("Dadi", "In the same way, triangles A D E and D E C have the same height from D, so their area ratio is A E by E C.",
          "Isi tarah, triangle A D E aur D E C ki D se height same hai, toh unke area ka ratio A E bata E C hai."),
    ], {"mode": "proof", "step": 3, "t": 0.45}),
    scene([
        L("Disha", "And B D E and D E C stand on the same base D E, between the same parallels D E and B C. So their areas are equal!",
          "Aur B D E aur D E C ek hi base D E par hain, same parallels D E aur B C ke beech. Toh unke area barabar hain!"),
        L("Dadi", "Shabash! Equal denominators with the same numerator, so A D by D B equals A E by E C. Proved.",
          "Shabash! Numerator same, denominators barabar, toh A D bata D B barabar A E bata E C. Prove ho gaya."),
    ], {"mode": "proof", "step": 4, "t": 0.45}),
    scene([
        L("Deepak", "Your turn! Slide the beam so that A D is twice D B.", "Ab aapki baari! Beam ko aise khiskaao ki A D, D B ka do guna ho."),
    ], {"mode": "basic", "t": 0.3, "task": {"ratio": 2}}, wait=True),
]

# ─────────────────────────────── Story 4: converse of BPT ───────────────────────────────
SCENES_4 = [
    scene([
        L("Narrator", "Back home, Harsh asks the question every good student asks: does the theorem work backwards?",
          "Ghar laut kar Harsh woh sawaal poochhta hai jo har achha student poochhta hai: kya theorem ulta bhi chalta hai?"),
        L("Dadi", "Let us test it. I mark D on A B and E on A C anywhere I like.", "Test karte hain. Main A B par D aur A C par E kahin bhi lagaati hoon."),
    ], {"mode": "converse", "d": 0.35, "e": 0.6}),
    scene([
        L("Disha", "A D by D B and A E by E C are different, and D E is tilted. It is not parallel to B C.",
          "A D bata D B aur A E bata E C alag hain, aur D E tircha hai. Yeh B C ke parallel nahi hai."),
    ], {"mode": "converse", "d": 0.35, "e": 0.6}),
    scene([
        L("Dadi", "Now I move E until both ratios are equal. Look at the line!", "Ab main E ko tab tak khiskaati hoon jab tak dono ratio barabar na ho jaayein. Line dekho!"),
        L("Harsh", "It turned parallel to B C exactly when the ratios matched!", "Jaise hi ratio mile, woh B C ke parallel ho gayi!"),
    ], {"mode": "converse", "d": 0.35, "e": 0.35}),
    scene([
        L("Dadi", "That is the converse. If a line divides any two sides of a triangle in the same ratio, then the line is parallel to the third side.",
          "Yahi converse hai. Agar koi line triangle ki kinhi do sides ko ek hi ratio mein baante, toh woh line teesri side ke parallel hoti hai."),
        L("Disha", "So to prove two lines parallel in a question, I can just check two ratios.", "Toh question mein do lines parallel prove karne ke liye, main bas do ratio check kar sakti hoon."),
    ], {"mode": "converse", "d": 0.6, "e": 0.6}),
    scene([
        L("Deepak", "A special case is useful. The line joining the midpoints of two sides divides both in the ratio 1 to 1, so it is parallel to the third side.",
          "Ek khaas case kaam ka hai. Do sides ke midpoints ko jodne wali line dono ko 1 aur 1 ke ratio mein baant-ti hai, toh woh teesri side ke parallel hai."),
    ], {"mode": "converse", "d": 0.5, "e": 0.5}),
    scene([
        L("Dadi", "Your turn! D is fixed. Move E until D E is parallel to B C.", "Ab aapki baari! D fixed hai. E ko tab tak khiskaao jab tak D E, B C ke parallel na ho."),
    ], {"mode": "converse", "d": 0.4, "e": 0.75, "task": {"parallel": True}}, wait=True),
]

# ─────────────────────────────── Story 5: criteria ───────────────────────────────
SCENES_5 = [
    scene([
        L("Narrator", "A week later, Disha has a doubt. Checking all three angles and all three side ratios takes too long in an exam.",
          "Ek hafte baad Disha ko doubt hai. Exam mein teeno angles aur teeno side ratios check karna bahut lamba hai."),
        L("Dadi", "For triangles there are shortcuts, called criteria for similarity. The first is A A A.",
          "Triangles ke liye shortcuts hain, jinhe similarity ke criteria kehte hain. Pehla hai A A A."),
    ], {"mode": "aaa", "k": 1.5}),
    scene([
        L("Dadi", "If the corresponding angles of two triangles are equal, their corresponding sides are in the same ratio, and the triangles are similar.",
          "Agar do triangles ke corresponding angles barabar hon, toh unke corresponding sides ek hi ratio mein hote hain, aur triangles similar hote hain."),
        L("Harsh", "And two equal angles are enough, because the angle sum is 180 degrees. The third angle matches automatically. That is A A!",
          "Aur do barabar angles kaafi hain, kyunki angles ka jod 180 degrees hai. Teesra angle apne aap mil jaata hai. Yahi A A hai!"),
    ], {"mode": "aaa", "k": 1.5, "hl": "aa"}),
    scene([
        L("Dadi", "Second, S S S. If the corresponding sides of two triangles are in the same ratio, their corresponding angles are equal, and they are similar.",
          "Doosra, S S S. Agar do triangles ke corresponding sides ek hi ratio mein hon, toh unke corresponding angles barabar hote hain, aur woh similar hain."),
        L("Disha", "So sides 3, 4, 5 and 6, 8, 10 give the ratio 1 by 2 every time. Similar!", "Toh sides 3, 4, 5 aur 6, 8, 10 mein har baar ratio 1 bata 2 hai. Similar!"),
    ], {"mode": "sss", "k": 2}),
    scene([
        L("Dadi", "Third, S A S. If one angle of a triangle equals one angle of the other, and the sides including these angles are proportional, the triangles are similar.",
          "Teesra, S A S. Agar ek triangle ka ek angle doosre ke ek angle ke barabar ho, aur un angles ko banaane wali sides proportional hon, toh triangles similar hain."),
        L("Deepak", "The angle must be between the two sides. That is what including means.", "Angle do sides ke beech mein hona chahiye. Including ka yahi matlab hai."),
    ], {"mode": "sas", "k": 1.5}),
    scene([
        L("Harsh", "So for polygons we needed both conditions, but for triangles one condition is enough?",
          "Toh polygons ke liye dono conditions chahiye thi, lekin triangles ke liye ek kaafi hai?"),
        L("Dadi", "Yes, that is the beauty of triangles. For them, equal angles force proportional sides, and proportional sides force equal angles. The board does not ask you to prove these criteria, only to use them.",
          "Haan, yahi triangles ki khoobsurti hai. Inmein barabar angles se sides proportional ho jaati hain, aur proportional sides se angles barabar. Board in criteria ka proof nahi maangta, sirf use karna."),
    ], {"mode": "sss", "k": 1.5}),
    scene([
        L("Dadi", "Your turn! Set the scale factor to 2 in the S A S picture, so that both sides double and the angle stays.",
          "Ab aapki baari! S A S picture mein scale factor 2 karo, taaki dono sides double hon aur angle wahi rahe."),
    ], {"mode": "sas", "k": 1.2, "task": {"k": 2}}, wait=True),
]

# ─────────────────────────────── Story 6: applications ───────────────────────────────
SCENES_6 = [
    scene([
        L("Narrator", "On a sunny afternoon, the family is at the cricket ground. The floodlight tower throws a long shadow.",
          "Ek dhoop wali dopahar, parivaar cricket ground par hai. Floodlight tower ki lambi parchhaai pad rahi hai."),
        L("Harsh", "How tall is that tower? I cannot climb it to measure!", "Woh tower kitna ooncha hai? Main naapne ke liye chadh toh nahi sakta!"),
    ], {"mode": "shadow", "sun": 56.31}),
    scene([
        L("Deepak", "We do not need to climb. My 6 metre signal pole casts a 4 metre shadow, and the tower casts a 28 metre shadow at the same time.",
          "Chadhne ki zaroorat nahi. Mera 6 metre ka signal pole 4 metre ki parchhaai banata hai, aur usi waqt tower 28 metre ki."),
        L("Disha", "The sun rays make the same angle with the ground for both, and both stand at right angles. So the two triangles are similar by A A!",
          "Dono ke liye sooraj ki kirnen zameen se same angle banaati hain, aur dono seedhe khade hain. Toh dono triangles A A se similar hain!"),
    ], {"mode": "shadow", "sun": 56.31, "show": "triangles"}),
    scene([
        L("Dadi", "So height by shadow is the same for both. Height is 6 by 4 times 28, which is 42 metres.", "Toh height bata parchhaai dono ke liye same hai. Height hai 6 bata 4 guna 28, yaani 42 metre."),
        L("Dadi", "There is an old story that Thales measured a pyramid in Egypt in just this way.", "Ek purani kahaani hai ki Thales ne Egypt mein ek pyramid ko bilkul isi tarah naapa tha."),
    ], {"mode": "shadow", "sun": 56.31, "show": "answer"}),
    scene([
        L("Narrator", "That evening, little Pinky from next door walks away from a street lamp. Her shadow grows longer with every step.",
          "Us shaam padosi ki chhoti Pinky ek street lamp se door chalti hai. Har kadam ke saath uski parchhaai lambi hoti jaati hai."),
        L("Deepak", "The lamp is 3.6 metres high and Pinky is 90 centimetres tall. She is now 4.8 metres from the lamp. How long is her shadow?",
          "Lamp 3.6 metre ooncha hai aur Pinky 90 centimetre lambi hai. Woh ab lamp se 4.8 metre door hai. Uski parchhaai kitni lambi hai?"),
    ], {"mode": "lamp", "dist": 4.8}),
    scene([
        L("Dadi", "Call the shadow x. The small triangle and the big triangle share the angle at the shadow tip, and both have a right angle. Similar by A A.",
          "Parchhaai ko x kaho. Chhote aur bade triangle ka shadow ke sire par angle common hai, aur dono mein right angle hai. A A se similar."),
        L("Disha", "So x by x plus 4.8 equals 0.9 by 3.6, which is 1 by 4. Then 4 x equals x plus 4.8, and x is 1.6 metres!",
          "Toh x bata x plus 4.8 barabar 0.9 bata 3.6, yaani 1 bata 4. Phir 4 x barabar x plus 4.8, aur x hai 1.6 metre!"),
    ], {"mode": "lamp", "dist": 4.8, "show": "answer"}),
    scene([
        L("Neha", "Maps and models use the same idea. On my shop plan, 1 centimetre stands for 50 centimetres, so every length is scaled by the same factor.",
          "Maps aur models mein bhi yahi idea hai. Meri dukaan ke plan par 1 centimetre, 50 centimetre ke barabar hai, toh har lambaai ek hi factor se scale hoti hai."),
    ], {"mode": "shadow", "sun": 40}),
    scene([
        L("Dadi", "Your turn! Move the sun until the pole's shadow is exactly 6 metres long. Then read the tower's height and shadow.",
          "Ab aapki baari! Sooraj ko tab tak khiskaao jab tak pole ki parchhaai theek 6 metre na ho. Phir tower ki height aur parchhaai padho."),
    ], {"mode": "shadow", "sun": 60, "task": {"shadow": 6}}, wait=True),
]

# ─────────────────────────────── Part 7 scenes ───────────────────────────────
SCENES_7 = [
    scene([
        L("Narrator", "Two weeks before the pre-boards, Dadi sets a full practice paper on triangles.", "Pre-boards se do hafte pehle, Dadi triangles par poora practice paper deti hain."),
        L("Dadi", "Question 1. In triangle A B C, D E is parallel to B C. A D is 1.5 centimetres, D B is 3 centimetres and A E is 1 centimetre. Find E C.",
          "Sawaal 1. Triangle A B C mein D E, B C ke parallel hai. A D 1.5 centimetre, D B 3 centimetre aur A E 1 centimetre hai. E C nikaalo."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "By the Basic Proportionality Theorem, A D by D B equals A E by E C. So 1.5 by 3 equals 1 by E C, and E C is 2 centimetres.",
          "Basic Proportionality Theorem se, A D bata D B barabar A E bata E C. Toh 1.5 bata 3 barabar 1 bata E C, aur E C 2 centimetre hai."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2 needs algebra. A D is x, D B is x minus 2, A E is x plus 2 and E C is x minus 1. Find x.",
          "Sawaal 2 mein algebra hai. A D hai x, D B hai x minus 2, A E hai x plus 2 aur E C hai x minus 1. x nikaalo."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "Cross multiply. x times x minus 1 equals x minus 2 times x plus 2. So x squared minus x equals x squared minus 4, and x is 4!",
          "Cross multiply karo. x guna x minus 1 barabar x minus 2 guna x plus 2. Toh x square minus x barabar x square minus 4, aur x hai 4!"),
        L("Dadi", "Correct, and check it: 4 by 2 is 2, and 6 by 3 is 2. Always check.", "Sahi, aur check karo: 4 bata 2 hai 2, aur 6 bata 3 hai 2. Hamesha check karo."),
    ], {"example": 1, "step": 4}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook, then reveal the steps to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, notebook mein try karo, phir steps khol kar check karo."),
    ], {"example": 4, "step": 0}),
]


def _tri_svg(labels, extra=""):
    """A simple triangle A B C with a parallel segment D E (labels: dict of extra text)."""
    return (
        '<svg viewBox="0 0 300 190" width="300" height="190" xmlns="http://www.w3.org/2000/svg">'
        '<polygon points="150,15 30,170 270,170" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>'
        '<line x1="102" y1="77" x2="198" y2="77" stroke="#fbbf24" stroke-width="2.5"/>'
        '<g font-family="sans-serif" font-size="15" font-weight="700" fill="#e2e8f0">'
        '<text x="144" y="12">A</text><text x="14" y="182">B</text><text x="276" y="182">C</text>'
        '<text x="84" y="80">D</text><text x="204" y="80">E</text></g>'
        f'<g font-family="sans-serif" font-size="13" fill="#38bdf8">{labels}</g>{extra}</svg>'
    )


def _shadow_svg():
    return (
        '<svg viewBox="0 0 320 170" width="320" height="170" xmlns="http://www.w3.org/2000/svg">'
        '<line x1="10" y1="150" x2="310" y2="150" stroke="#64748b" stroke-width="2"/>'
        '<line x1="40" y1="150" x2="40" y2="100" stroke="#fbbf24" stroke-width="4"/>'
        '<line x1="40" y1="100" x2="73" y2="150" stroke="#fbbf24" stroke-dasharray="4 3"/>'
        '<line x1="150" y1="150" x2="150" y2="20" stroke="#38bdf8" stroke-width="5"/>'
        '<line x1="150" y1="20" x2="237" y2="150" stroke="#38bdf8" stroke-dasharray="4 3"/>'
        '<g font-family="sans-serif" font-size="12" fill="#e2e8f0">'
        '<text x="12" y="128">6 m</text><text x="45" y="165">4 m</text>'
        '<text x="110" y="90">h</text><text x="180" y="165">28 m</text></g></svg>'
    )


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: The Shop Banner · Similar and Congruent Figures",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Three months before the boards, Dadi starts chapter 6 with circles and squares, and Mummy's shop banner shows what a scale factor is.</div>
<h2>Similar figures</h2>
<p>Two figures having the <strong>same shape</strong> but not necessarily the same size are called <strong>similar figures</strong>.</p>
<div {CARD}>
  <div>All circles are similar. All squares are similar. All equilateral triangles are similar.</div>
  <div>A photograph and its enlargement are similar: every length is multiplied by the same number, the <strong>scale factor</strong> k.</div>
  <div>Stretching in only one direction changes the shape, so the result is <em>not</em> similar.</div>
</div>
<h2>Congruent versus similar</h2>
<p>Congruent figures have the same shape <em>and</em> the same size (scale factor 1).</p>
<div {FORMULA}>All congruent figures are similar, but similar figures need not be congruent.</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Pair</th><th>Similar?</th><th>Congruent?</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Two circles of radius 2 cm and 5 cm</td><td class="text-center">Yes</td><td class="text-center">No</td></tr>
    <tr><td>Two squares of side 4 cm</td><td class="text-center">Yes</td><td class="text-center">Yes</td></tr>
    <tr><td>A square and a rectangle 4 cm by 8 cm</td><td class="text-center">No</td><td class="text-center">No</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "Similar means same shape: every length is scaled by one common factor; congruent is the special case where that factor is 1.",
        "widgetType": "Class10TriSimilarFiguresWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Which pair is always similar?",
            "options": ["Two rectangles", "Two isosceles triangles", "Two equilateral triangles", "Two rhombuses"],
            "correctIndex": 2,
            "explanation": "Every equilateral triangle has angles 60, 60, 60 and all sides equal, so any two are similar. Rectangles, isosceles triangles and rhombuses can have different shapes.",
        },
        "teacherNotes": teacher(
            ["Show a photo and its enlargement; measure two lengths on each and compare the ratios.",
             "Ask the class to name figures that are always similar (circles, squares, equilateral triangles) and ones that are not."],
            ["Thinking 'similar' means 'looks alike' in everyday language.", "Saying all rectangles or all rhombuses are similar."],
            "Students draw a small triangle on grid paper and an enlargement with every length doubled; they measure angles to see they are unchanged.",
            "NCERT Class 10 Ch. 6, Sections 6.1 and 6.2 (Exercise 6.1).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Platform Drawings · Similarity of Polygons",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Papa brings home two scale drawings of a platform. Harsh wants to check only angles; a square and a rectangle prove him wrong.</div>
<h2>When are two polygons similar?</h2>
<p>Two polygons with the same number of sides are similar if</p>
<div {CARD}>
  <div>(i) their corresponding angles are <strong>equal</strong>, and</div>
  <div>(ii) their corresponding sides are in the <strong>same ratio</strong> (proportional).</div>
</div>
<p><strong>Both</strong> conditions are needed:</p>
<ul>
  <li>A square and a rectangle: all angles are 90°, but the sides are not proportional. Not similar.</li>
  <li>A square and a rhombus: sides are proportional (all equal), but the angles differ. Not similar.</li>
</ul>
<h2>Writing similarity</h2>
<p>Triangles are polygons too. △ABC ~ △PQR means A ↔ P, B ↔ Q, C ↔ R, so</p>
<div {FORMULA}>∠A = ∠P, ∠B = ∠Q, ∠C = ∠R and AB/PQ = BC/QR = CA/RP</div>
<p>The order of letters tells you which parts correspond. Always write it carefully.</p>
""",
        "keyInsight": "Polygons are similar only when corresponding angles are equal AND corresponding sides are proportional.",
        "widgetType": "Class10TriPolygonWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "A square and a rhombus of side 5 cm with an angle of 70°. Are they similar?",
            "options": ["Yes, the sides are proportional", "Yes, both are quadrilaterals", "No, the angles are not equal", "No, the sides are not proportional"],
            "correctIndex": 2,
            "explanation": "The sides are proportional (ratio 1), but the angles 90° and 70° are not equal, so the polygons are not similar.",
        },
        "teacherNotes": teacher(
            ["Use the square–rectangle and square–rhombus counterexamples; they show why both conditions are needed.",
             "Insist on correct correspondence when writing △ABC ~ △PQR."],
            ["Checking only angles (or only sides) for polygons.", "Writing ratios with the wrong correspondence, such as AB/QR."],
            "Give pairs of cut-out quadrilaterals; groups test both conditions with a protractor and ruler and sort them into similar / not similar.",
            "NCERT Class 10 Ch. 6, Section 6.2 (Exercise 6.1).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: The Signal Gantry · Basic Proportionality Theorem",
        "readingTime": "~8 min story",
        "narrative": f"""
<div {STORY}>A cross beam parallel to the base of a signal gantry divides both slanting sides in the same ratio. Dadi proves why, using areas.</div>
<h2>Theorem 6.1: Basic Proportionality Theorem (Thales theorem)</h2>
<p>If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.</p>
<div {FORMULA}>In △ABC, if DE ∥ BC, then AD/DB = AE/EC</div>
<h2>Proof (board answer)</h2>
<div {CARD}>
  <div><strong>Given:</strong> In △ABC, DE ∥ BC, D on AB, E on AC.</div>
  <div><strong>To prove:</strong> AD/DB = AE/EC.</div>
  <div><strong>Construction:</strong> Join BE and CD. Draw EN ⊥ AB and DM ⊥ AC.</div>
  <div><strong>Proof:</strong> ar(ADE) = ½ × AD × EN and ar(BDE) = ½ × DB × EN, so ar(ADE)/ar(BDE) = AD/DB … (1)</div>
  <div>ar(ADE) = ½ × AE × DM and ar(DEC) = ½ × EC × DM, so ar(ADE)/ar(DEC) = AE/EC … (2)</div>
  <div>△BDE and △DEC are on the same base DE and between the same parallels BC and DE, so ar(BDE) = ar(DEC) … (3)</div>
  <div>From (1), (2) and (3): AD/DB = AE/EC. Hence proved.</div>
</div>
<p>Useful forms that follow: AD/AB = AE/AC and DB/AB = EC/AC.</p>
""",
        "keyInsight": "A line parallel to one side of a triangle cuts the other two sides in the same ratio; the proof compares areas of triangles with equal heights.",
        "widgetType": "Class10TriBPTWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "In △ABC, DE ∥ BC, AD = 4 cm, DB = 6 cm and AE = 6 cm. Find EC.",
            "options": ["4 cm", "8 cm", "9 cm", "10 cm"],
            "correctIndex": 2,
            "explanation": "AD/DB = AE/EC gives 4/6 = 6/EC, so EC = 36/4 = 9 cm.",
        },
        "teacherNotes": teacher(
            ["Let students measure first on a drawn triangle; then give the area proof step by step with numbered statements.",
             "Emphasise the key fact: triangles on the same base and between the same parallels have equal areas."],
            ["Writing AD/AB = AE/EC (mixing part and whole).", "Forgetting the construction (joining BE, CD and the perpendiculars) in the proof."],
            "Pairs draw a triangle, a line parallel to the base with a set square, and measure AD, DB, AE, EC to compare ratios.",
            "NCERT Class 10 Ch. 6, Section 6.3, Theorem 6.1 (Exercise 6.2).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Does It Work Backwards? · Converse of BPT",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Harsh asks if the theorem runs in reverse. Dadi moves two points on the sides until the line turns parallel.</div>
<h2>Theorem 6.2: Converse of the Basic Proportionality Theorem</h2>
<p>If a line divides any two sides of a triangle in the same ratio, then the line is parallel to the third side.</p>
<div {FORMULA}>In △ABC, if AD/DB = AE/EC, then DE ∥ BC</div>
<div {CARD}>
  <div><strong>Use:</strong> to prove two lines are parallel, compare two ratios.</div>
  <div><strong>Example:</strong> PE = 4 cm, QE = 4.5 cm, PF = 8 cm, RF = 9 cm on sides PQ and PR of △PQR. PE/EQ = 4/4.5 = 8/9 and PF/FR = 8/9, so EF ∥ QR.</div>
  <div><strong>Mid-point case:</strong> the line joining the mid-points of two sides divides each in ratio 1 : 1, so it is parallel to the third side.</div>
</div>
""",
        "keyInsight": "Equal ratios on two sides force the joining line to be parallel to the third side.",
        "widgetType": "Class10TriBPTWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "E and F are on sides PQ and PR of △PQR with PE = 3.9, EQ = 3, PF = 3.6, FR = 2.4 (cm). Is EF ∥ QR?",
            "options": ["Yes, the ratios are equal", "No, PE/EQ = 1.3 but PF/FR = 1.5", "Yes, because E and F are mid-points", "Cannot be decided"],
            "correctIndex": 1,
            "explanation": "PE/EQ = 3.9/3 = 1.3 and PF/FR = 3.6/2.4 = 1.5. The ratios differ, so EF is not parallel to QR.",
        },
        "teacherNotes": teacher(
            ["Contrast the theorem and the converse: what is given and what is proved swap places.",
             "Show that both ratios must be computed in the same order (part from vertex : remaining part)."],
            ["Comparing PE/EQ with FR/PF (ratios in opposite orders).", "Using BPT when parallelism is what has to be proved."],
            "Students mark points dividing two sides in ratio 2 : 3 and check with a set square that the joining line is parallel to the base.",
            "NCERT Class 10 Ch. 6, Section 6.3, Theorem 6.2 (Exercise 6.2).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Exam Shortcuts · AAA, SSS and SAS Criteria",
        "readingTime": "~8 min story",
        "narrative": f"""
<div {STORY}>Disha finds checking six conditions too slow. Dadi shows that for triangles one condition is enough.</div>
<h2>Criteria for similarity of triangles</h2>
<div {CARD}>
  <div><strong>AAA (Theorem 6.3):</strong> if in two triangles the corresponding angles are equal, their corresponding sides are in the same ratio and the triangles are similar.</div>
  <div><strong>AA:</strong> if two angles of one triangle equal two angles of another, the triangles are similar (the third angles are equal by the angle sum property, 180°).</div>
  <div><strong>SSS (Theorem 6.4):</strong> if the corresponding sides of two triangles are in the same ratio, their corresponding angles are equal and the triangles are similar.</div>
  <div><strong>SAS (Theorem 6.5):</strong> if one angle of a triangle equals one angle of the other and the sides including these angles are proportional, the triangles are similar.</div>
</div>
<div {FORMULA}>AA, SSS, SAS ⇒ △ABC ~ △DEF ⇒ all angles equal and all sides proportional</div>
<p>Proofs of these criteria are <em>not</em> required in the current syllabus; you must state and apply them.</p>
<h2>Quick checks</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Data</th><th>Criterion</th><th>Similar?</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Angles 50°, 60° and 60°, 70°</td><td class="text-center">AA</td><td class="text-center">Yes (third angles 70°, 50°)</td></tr>
    <tr><td>Sides 3, 4, 5 and 6, 8, 10</td><td class="text-center">SSS</td><td class="text-center">Yes, ratio 1 : 2</td></tr>
    <tr><td>Sides 2, 3, 4 and 3, 4, 6</td><td class="text-center">SSS</td><td class="text-center">No (2/3 ≠ 3/4)</td></tr>
    <tr><td>AB = 3, AC = 4, ∠A = 60° and DE = 6, DF = 8, ∠D = 60°</td><td class="text-center">SAS</td><td class="text-center">Yes</td></tr>
  </tbody>
</table>
<p><strong>Note:</strong> unlike congruence, there is no "RHS" needed here, and SSA is not a criterion: the equal angle must be <em>included</em> between the proportional sides.</p>
""",
        "keyInsight": "For triangles, AA, SSS or SAS alone is enough to prove similarity; then every angle is equal and every side is proportional.",
        "widgetType": "Class10TriCriteriaWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "In △ABC, ∠A = 45° and ∠B = 75°. In △PQR, ∠P = 45° and ∠R = 60°. Which is true?",
            "options": ["△ABC ~ △PQR", "△ABC ~ △PRQ", "△ABC ~ △QPR", "They are not similar"],
            "correctIndex": 0,
            "explanation": "∠C = 180° − 45° − 75° = 60° and ∠Q = 180° − 45° − 60° = 75°. So A ↔ P, B ↔ Q, C ↔ R and △ABC ~ △PQR by AA.",
        },
        "teacherNotes": teacher(
            ["State each criterion and immediately apply it to one numerical pair.",
             "Make students write the correspondence after identifying equal angles."],
            ["Using SSA as a criterion.", "Writing △ABC ~ △PQR without matching the equal angles in order."],
            "Card sort: each card has data for two triangles; groups decide AA, SSS, SAS or 'not similar' and justify.",
            "NCERT Class 10 Ch. 6, Section 6.4, Theorems 6.3–6.5 (Exercise 6.3); proofs of the criteria are not in the rationalised syllabus.",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Shadows on the Ground · Using Similar Triangles",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>At the cricket ground, Papa finds the height of a floodlight tower from shadows; in the evening Disha works out the length of a little girl's shadow under a street lamp.</div>
<h2>Heights from shadows</h2>
<p>At the same moment, the sun's rays make the same angle with the ground everywhere nearby, and poles and towers stand vertical. So the triangle (object, shadow, ray) for each is similar by AA.</p>
<div {FORMULA}>height of object / its shadow = height of pole / its shadow</div>
<div {CARD}>
  <div>A 6 m pole casts a 4 m shadow; a tower casts 28 m at the same time.</div>
  <div>h/28 = 6/4 ⇒ h = 6 × 28 / 4 = <strong>42 m</strong>.</div>
</div>
<h2>Shadow under a lamp</h2>
<div {CARD}>
  <div>Lamp 3.6 m high; a girl 90 cm tall is 4.8 m from its foot. Let her shadow be x m.</div>
  <div>The small triangle (girl, shadow) and the big triangle (lamp, x + 4.8) share the angle at the shadow's tip and both have a right angle, so they are similar (AA).</div>
  <div>x/(x + 4.8) = 0.9/3.6 = 1/4 ⇒ 4x = x + 4.8 ⇒ x = <strong>1.6 m</strong>.</div>
</div>
<h2>Scale drawings and maps</h2>
<p>A plan drawn at scale 1 : 50 is similar to the real room: every real length is 50 times the drawn length, and all angles are the same.</p>
<p>History: Thales of Miletus (NCERT gives 640–546 B.C.) is credited with the Basic Proportionality Theorem; an old story says he found the height of a pyramid in Egypt from its shadow.</p>
""",
        "keyInsight": "Same sun angle plus vertical objects gives similar triangles, so an unreachable height equals a ratio times a measurable shadow.",
        "widgetType": "Class10TriShadowWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "A 1.5 m tall student casts a 2 m shadow. At the same time a tree casts a 12 m shadow. How tall is the tree?",
            "options": ["8 m", "9 m", "16 m", "18 m"],
            "correctIndex": 1,
            "explanation": "h/12 = 1.5/2, so h = 1.5 × 12 / 2 = 9 m.",
        },
        "teacherNotes": teacher(
            ["Take the class outside; measure a student's height and shadow and a flagpole's shadow, and compute the flagpole height.",
             "In the lamp problem, draw both triangles separately before writing the ratio."],
            ["In the lamp problem, using x/4.8 instead of x/(x + 4.8).", "Mixing units (cm and m) in one ratio."],
            "Shadow lab: groups measure a metre stick's shadow and the shadow of a pole on the school ground, then find the pole's height.",
            "NCERT Class 10 Ch. 6, Section 6.4 (Exercise 6.3, Q15 and Q16 and Example 7).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 board-style problems, step by step",
        "readingTime": "~12 min",
        "narrative": f"""
<div {STORY}>Two weeks before the pre-boards, Dadi sets a full practice paper on triangles.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>DE ∥ BC ⇒ AD/DB = AE/EC (BPT).</li>
  <li>AD/DB = AE/EC ⇒ DE ∥ BC (converse).</li>
  <li>AA, SSS, SAS ⇒ similar ⇒ all corresponding sides in the same ratio.</li>
  <li>Write the correspondence (which vertex matches which) before writing ratios.</li>
</ol>
<p>Try each question in your notebook before revealing the steps.</p>
""",
        "keyInsight": "Spot the parallel line or the pair of equal angles first; the ratio equation then writes itself.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "BPT, find a length (short answer)",
                    "question": "In △ABC, DE ∥ BC. If AD = 1.5 cm, DB = 3 cm and AE = 1 cm, find EC.",
                    "figureSvg": _tri_svg('<text x="70" y="50">1.5</text><text x="40" y="128">3</text><text x="214" y="50">1</text><text x="244" y="128">?</text>'),
                    "steps": [
                        "DE ∥ BC, so by BPT: AD/DB = AE/EC",
                        "1.5/3 = 1/EC",
                        "EC = 3 × 1 / 1.5 = <strong>2 cm</strong>",
                    ],
                    "answer": "EC = 2 cm",
                },
                {
                    "title": "BPT with algebra (short answer)",
                    "question": "In △ABC, DE ∥ BC. AD = x, DB = x − 2, AE = x + 2 and EC = x − 1. Find x.",
                    "steps": [
                        "By BPT: x/(x − 2) = (x + 2)/(x − 1)",
                        "x(x − 1) = (x − 2)(x + 2) ⇒ x² − x = x² − 4",
                        "−x = −4 ⇒ <strong>x = 4</strong>",
                        "Check: AD/DB = 4/2 = 2 and AE/EC = 6/3 = 2 ✓",
                    ],
                    "answer": "x = 4",
                },
                {
                    "title": "Which shapes are always similar? (MCQ)",
                    "question": "Which of these are always similar? (a) two rectangles (b) two isosceles triangles (c) two squares (d) two rhombuses",
                    "steps": [
                        "Rectangles can have different length-to-breadth ratios; rhombuses can have different angles.",
                        "Isosceles triangles can have different vertex angles.",
                        "All squares have all angles 90° and all sides in one ratio: <strong>(c) two squares</strong>",
                    ],
                    "answer": "(c)",
                },
                {
                    "title": "Converse of BPT (short answer)",
                    "question": "E and F are points on sides PQ and PR of △PQR. PE = 4 cm, QE = 4.5 cm, PF = 8 cm, RF = 9 cm. Is EF ∥ QR?",
                    "steps": [
                        "PE/EQ = 4/4.5 = 8/9",
                        "PF/FR = 8/9",
                        "PE/EQ = PF/FR, so by the converse of BPT, <strong>EF ∥ QR</strong>",
                    ],
                    "answer": "Yes, EF ∥ QR",
                },
                {
                    "title": "Prove the Basic Proportionality Theorem (long answer, 5 marks)",
                    "question": "Prove that if a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.",
                    "figureSvg": _tri_svg('', '<line x1="102" y1="77" x2="270" y2="170" stroke="#f472b6" stroke-dasharray="4 3"/><line x1="198" y1="77" x2="30" y2="170" stroke="#34d399" stroke-dasharray="4 3"/>'),
                    "steps": [
                        "Given: △ABC with DE ∥ BC, D on AB, E on AC. To prove: AD/DB = AE/EC.",
                        "Construction: join BE and CD; draw EN ⊥ AB and DM ⊥ AC.",
                        "ar(ADE)/ar(BDE) = (½ × AD × EN)/(½ × DB × EN) = AD/DB … (1)",
                        "ar(ADE)/ar(DEC) = (½ × AE × DM)/(½ × EC × DM) = AE/EC … (2)",
                        "△BDE and △DEC are on the same base DE and between the same parallels DE and BC, so ar(BDE) = ar(DEC) … (3)",
                        "From (1), (2), (3): <strong>AD/DB = AE/EC</strong>. Hence proved.",
                    ],
                    "answer": "AD/DB = AE/EC",
                },
                {
                    "title": "SSS criterion (short answer)",
                    "question": "Are triangles with sides 2 cm, 3 cm, 4 cm and 4 cm, 6 cm, 8 cm similar? If yes, write the scale factor.",
                    "steps": [
                        "Ratios of corresponding sides: 2/4, 3/6, 4/8",
                        "Each ratio equals 1/2",
                        "Sides are proportional, so the triangles are <strong>similar by SSS</strong>, scale factor 1 : 2",
                    ],
                    "answer": "Yes, SSS, 1 : 2",
                },
                {
                    "title": "SAS criterion, find a side",
                    "question": "In △ABC, AB = 3 cm, AC = 4 cm, ∠A = 60°, BC = 4.5 cm (given). In △DEF, DE = 6 cm, DF = 8 cm, ∠D = 60°. Find EF.",
                    "steps": [
                        "AB/DE = 3/6 = 1/2 and AC/DF = 4/8 = 1/2, and the included angles ∠A = ∠D = 60°",
                        "So △ABC ~ △DEF (SAS)",
                        "BC/EF = 1/2 ⇒ EF = 2 × 4.5 = <strong>9 cm</strong>",
                    ],
                    "answer": "EF = 9 cm",
                },
                {
                    "title": "Assertion–Reason",
                    "question": "Assertion (A): If D and E are points on AB and AC of △ABC with AD/DB = AE/EC, then DE ∥ BC.<br>Reason (R): A line drawn parallel to one side of a triangle divides the other two sides in the same ratio.<br>(a) Both true, R explains A (b) Both true, R does not explain A (c) A true, R false (d) A false, R true",
                    "steps": [
                        "A is the converse of BPT (Theorem 6.2): true.",
                        "R is BPT itself (Theorem 6.1): true.",
                        "But R goes in the opposite direction; it does not explain A. Answer: <strong>(b)</strong>",
                    ],
                    "answer": "(b)",
                },
                {
                    "title": "Case study: the floodlight tower",
                    "question": "A vertical pole 6 m high casts a shadow 4 m long, and at the same time a tower casts a shadow 28 m long. (i) Which criterion makes the triangles similar? (ii) Find the height of the tower.",
                    "figureSvg": _shadow_svg(),
                    "steps": [
                        "(i) Both are vertical (90° with the ground) and the sun's rays make equal angles with the ground: <strong>AA</strong>",
                        "(ii) h/28 = 6/4",
                        "h = 6 × 28 / 4 = 168/4 = <strong>42 m</strong>",
                    ],
                    "answer": "AA; 42 m",
                },
                {
                    "title": "Lamp post and shadow (long answer)",
                    "question": "A girl 90 cm tall is walking away from the base of a lamp post at 1.2 m/s. The lamp is 3.6 m above the ground. Find the length of her shadow after 4 seconds.",
                    "steps": [
                        "Distance walked = 1.2 × 4 = 4.8 m. Let the shadow be x m.",
                        "The girl's triangle and the lamp's triangle share the angle at the shadow tip and both have a right angle, so they are similar (AA).",
                        "x/(x + 4.8) = 0.9/3.6 = 1/4",
                        "4x = x + 4.8 ⇒ 3x = 4.8 ⇒ <strong>x = 1.6 m</strong>",
                    ],
                    "answer": "1.6 m",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            ["Q5 is the standard 5-mark proof: drill the Given / To prove / Construction / Proof layout.",
             "Q8: discuss why R being true does not make it the explanation of A."],
            ["Q2: dropping the x² terms incorrectly or not checking the answer.", "Q7: using SAS when the angle is not between the two sides.", "Q10: using x/4.8 instead of x/(x + 4.8)."],
            "Pair-share: one student names the theorem or criterion to use, the other writes the ratio equation; swap each question.",
            "NCERT Class 10 Ch. 6, Exercises 6.1–6.3 and Examples (rationalised).",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Triangles (80% to pass)",
        "readingTime": "~12 min exam",
        "narrative": f"""
<p>From the shop banner to the floodlight tower, you have scaled, proved and measured with similar triangles. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 board-style questions</strong> on similar figures, BPT and its converse, AA, SSS, SAS and applications.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Find the parallel line or the equal angles, write the correspondence, then write the ratio.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Triangles · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "Which statement is true?", "options": ["All similar figures are congruent", "All congruent figures are similar", "All rectangles are similar", "All isosceles triangles are similar"], "answer": 1, "explanation": "Congruent figures have the same shape and size, so they are similar with scale factor 1. The converse fails.", "topic": "Similar figures"},
                {"q": "Two polygons are similar if:", "options": ["Their corresponding angles are equal", "Their corresponding sides are proportional", "Both: angles equal and sides proportional", "They have the same number of sides"], "answer": 2, "explanation": "For polygons both conditions are needed (square vs rectangle, square vs rhombus).", "topic": "Similar polygons"},
                {"q": "In △ABC, DE ∥ BC, AD = 2 cm, DB = 3 cm and AC = 10 cm. Find AE.", "options": ["4 cm", "5 cm", "6 cm", "6.67 cm"], "answer": 0, "explanation": "AD/AB = AE/AC, AB = 5, so 2/5 = AE/10 and AE = 4 cm.", "topic": "BPT"},
                {"q": "In △ABC, DE ∥ BC. If AD/DB = 3/5 and AE = 4.8 cm, then EC is:", "options": ["2.88 cm", "6 cm", "8 cm", "7.2 cm"], "answer": 2, "explanation": "AE/EC = 3/5, so EC = 4.8 × 5/3 = 8 cm.", "topic": "BPT"},
                {"q": "D and E lie on AB and AC of △ABC with AD = 3, DB = 4, AE = 4.5, EC = 6 (cm). Then:", "options": ["DE ∥ BC", "DE is not parallel to BC", "DE = BC", "D is the mid-point of AB"], "answer": 0, "explanation": "AD/DB = 3/4 and AE/EC = 4.5/6 = 3/4. Equal ratios, so DE ∥ BC by the converse of BPT.", "topic": "Converse of BPT"},
                {"q": "In △ABC and △DEF, ∠A = ∠D = 50° and ∠B = ∠E = 70°. Which criterion proves them similar?", "options": ["SSS", "SAS", "AA", "RHS"], "answer": 2, "explanation": "Two pairs of equal angles: AA.", "topic": "Criteria"},
                {"q": "Sides of two triangles are 4, 6, 8 and 6, 9, 12. The triangles are:", "options": ["Similar by SSS, ratio 2 : 3", "Similar by SAS", "Not similar", "Congruent"], "answer": 0, "explanation": "4/6 = 6/9 = 8/12 = 2/3, so similar by SSS.", "topic": "Criteria"},
                {"q": "If △ABC ~ △PQR with AB = 4 cm, PQ = 6 cm and BC = 5 cm, then QR is:", "options": ["3.33 cm", "6.5 cm", "7.5 cm", "8 cm"], "answer": 2, "explanation": "AB/PQ = BC/QR, so 4/6 = 5/QR and QR = 30/4 = 7.5 cm.", "topic": "Using similarity"},
                {"q": "Assertion (A): A 2 m pole casts a 3 m shadow; at the same time a building casting a 24 m shadow is 16 m tall. Reason (R): The triangles formed are similar by AA.", "options": ["Both true, R explains A", "Both true, R does not explain A", "A true, R false", "A false, R true"], "answer": 0, "explanation": "h/24 = 2/3 gives h = 16 m (A true), and the similarity by AA (R) is exactly why the ratio works.", "topic": "Applications"},
                {"q": "Assertion (A): A square and a rhombus of the same side are similar. Reason (R): Their corresponding sides are proportional.", "options": ["Both true, R explains A", "Both true, R does not explain A", "A false, R true", "Both false"], "answer": 2, "explanation": "The sides are proportional (R true), but the angles differ, so they are not similar (A false).", "topic": "Similar polygons"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q3 catches AD/DB vs AD/AB; Q8 catches wrong correspondence; Q10 catches 'proportional sides alone is enough' for polygons."],
            "Exit ticket: write the statement of BPT and its converse, and solve one shadow problem.",
            "NCERT Class 10 Ch. 6 Triangles learning outcomes (rationalised syllabus).",
        ),
    },
]


def seed_class10_story_triangles():
    db = SessionLocal()
    try:
        topic = get_class10_topic(db, "Triangles")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 10 Triangles: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Triangles: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class10_story_triangles()
