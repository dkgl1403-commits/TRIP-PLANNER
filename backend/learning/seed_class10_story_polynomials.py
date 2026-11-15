import json
from db import SessionLocal
from seed_class10_structure import get_class10_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 10 · Polynomials (NCERT Class 10 Mathematics, Chapter 2, rationalised syllabus 2023-24 onward):
# 2.1 introduction (degree; linear, quadratic, cubic polynomials; value and zero of a polynomial),
# 2.2 geometrical meaning of the zeroes (graphs of linear, quadratic and cubic polynomials, number of zeroes
# read from a graph), 2.3 relationship between zeroes and coefficients (sum = -b/a, product = c/a for a
# quadratic; forming a quadratic from a given sum and product of zeroes).
# The division algorithm for polynomials is deleted from the current syllabus and is left out.
#
# Story: the Jaipur family during board-exam preparation. Harsh (16) and Disha (15) study polynomials with
# Dadi; Papa explains straight-line graphs with a train passing a signal, a cricket shot gives the parabola,
# Mummy's shop gives the sum and product of zeroes.
#
# No outside statistics or historical facts are used; all numbers are worked examples and were checked by hand.


SCENES_1 = [
    scene([
        L("Narrator", "It is November in Jaipur, and the board exams are a few months away. Harsh and Disha sit with Dadi at the dining table, maths books open at Chapter 2.",
          "Jaipur mein November hai, aur board exams kuch hi mahine door hain. Harsh aur Disha Dadi ke saath dining table par baithe hain, maths ki kitaab Chapter 2 par khuli hai."),
        L("Dadi", "Polynomials, beta. Here is one: p of x equals x squared minus 3 x minus 4. Each piece joined by plus or minus is called a term.",
          "Polynomials, beta. Yeh dekho ek: p of x barabar x squared minus 3 x minus 4. Plus ya minus se jude har hisse ko term kehte hain."),
    ], {"mode": "build", "coeffs": [0, 1, -3, -4]}),
    scene([
        L("Disha", "So what makes it a polynomial, Dadi? Why not any expression with x in it?",
          "Toh ise polynomial kya banaata hai, Dadi? x waala koi bhi expression kyon nahi?"),
        L("Dadi", "In a polynomial, every power of x must be a whole number: 0, 1, 2, 3 and so on. No x in the denominator, no square root of x.",
          "Polynomial mein x ki har power whole number honi chahiye: 0, 1, 2, 3 waghaira. Denominator mein x nahi, x ka square root nahi."),
    ], {"mode": "check", "show": 2, "items": [
        {"e": "x² − 3x − 4", "ok": True, "why": "powers 2, 1, 0: whole numbers"},
        {"e": "2y³ + 5", "ok": True, "why": "powers 3 and 0"},
        {"e": "x + 1/x", "ok": False, "why": "1/x is x to the power −1"},
        {"e": "√x + 3", "ok": False, "why": "√x is x to the power 1/2"},
        {"e": "7", "ok": True, "why": "a constant: 7 = 7x⁰"},
    ]}),
    scene([
        L("Harsh", "Easy! x plus 1 over x is not one, because 1 over x is x to the power minus 1. And root x is x to the power half.",
          "Aasaan! x plus 1 over x polynomial nahi hai, kyonki 1 over x matlab x ki power minus 1. Aur root x matlab x ki power half."),
        L("Dadi", "Shabash. And even a single number like 7 is a polynomial. We call it a constant polynomial.",
          "Shabash. Aur akela number jaise 7 bhi polynomial hai. Use constant polynomial kehte hain."),
    ], {"mode": "check", "show": 5, "items": [
        {"e": "x² − 3x − 4", "ok": True, "why": "powers 2, 1, 0: whole numbers"},
        {"e": "2y³ + 5", "ok": True, "why": "powers 3 and 0"},
        {"e": "x + 1/x", "ok": False, "why": "1/x is x to the power −1"},
        {"e": "√x + 3", "ok": False, "why": "√x is x to the power 1/2"},
        {"e": "7", "ok": True, "why": "a constant: 7 = 7x⁰"},
    ]}),
    scene([
        L("Dadi", "The highest power of x is the degree. In x squared minus 3 x minus 4, the highest power is 2, so the degree is 2.",
          "x ki sabse badi power ko degree kehte hain. x squared minus 3 x minus 4 mein sabse badi power 2 hai, toh degree 2 hai."),
        L("Dadi", "A polynomial of degree 2 is called a quadratic polynomial.", "Degree 2 waale polynomial ko quadratic polynomial kehte hain."),
    ], {"mode": "build", "coeffs": [0, 1, -3, -4]}),
    scene([
        L("Disha", "And 2 x plus 3 has highest power 1, so degree 1. That is a linear polynomial!",
          "Aur 2 x plus 3 mein sabse badi power 1 hai, toh degree 1. Yeh linear polynomial hai!"),
    ], {"mode": "build", "coeffs": [0, 0, 2, 3]}),
    scene([
        L("Harsh", "Then x cubed minus 4 x is degree 3. Cubic! Like a cricket score, the biggest number decides the result.",
          "Toh x cubed minus 4 x ki degree 3 hai. Cubic! Cricket score ki tarah, sabse bada number hi result tay karta hai."),
        L("Dadi", "Nicely put. Notice the missing x squared term does not matter. Only the highest power with a non-zero coefficient counts.",
          "Badhiya kaha. Dekho, x squared waala term gayab hai, phir bhi koi farak nahi. Sirf woh sabse badi power ginti hai jiska coefficient zero nahi hai."),
    ], {"mode": "build", "coeffs": [1, 0, -4, 0]}),
    scene([
        L("Disha", "What if every coefficient is zero?", "Agar har coefficient zero ho toh?"),
        L("Dadi", "Then it is the zero polynomial, and its degree is not defined. The general quadratic is written a x squared plus b x plus c, where a is not zero.",
          "Toh woh zero polynomial hai, aur uski degree defined nahi hai. General quadratic ko a x squared plus b x plus c likhte hain, jahan a zero nahi hota."),
    ], {"mode": "build", "coeffs": [0, 0, 0, 0]}),
    scene([
        L("Dadi", "Your turn! Use the sliders to build a quadratic polynomial with exactly 3 terms.",
          "Ab aapki baari! Sliders se aisa quadratic polynomial banao jismein theek 3 terms hon."),
    ], {"mode": "build", "coeffs": [0, 0, 2, 3], "task": {"degree": 2, "terms": 3}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "On Sunday, Papa takes Harsh and Disha to the railway yard where he works.",
          "Itvaar ko Papa Harsh aur Disha ko railway yard le jaate hain jahan woh kaam karte hain."),
        L("Deepak", "A train starts 4 kilometres before a signal and moves 2 kilometres every minute. Its position from the signal after x minutes is 2 x minus 4.",
          "Ek train signal se 4 kilometre pehle se chalti hai aur har minute 2 kilometre chalti hai. x minute baad signal se uski position hai 2 x minus 4."),
    ], {"kind": "linear", "a": 2, "b": -4, "win": [-1, 5, -6, 6], "table": True}),
    scene([
        L("Deepak", "At x equal to 0, the position is minus 4. At 1 minute, minus 2. At 2 minutes, 0. The train is exactly at the signal!",
          "x barabar 0 par position minus 4 hai. 1 minute par minus 2. 2 minute par 0. Train theek signal par hai!"),
        L("Dadi", "Plug in a number and you get the value of the polynomial. Papa just found p of 2 equals 0.",
          "Koi number daalo toh polynomial ki value milti hai. Papa ne abhi nikaala, p of 2 barabar 0."),
    ], {"kind": "linear", "a": 2, "b": -4, "win": [-1, 5, -6, 6], "table": True, "probe": 2}),
    scene([
        L("Dadi", "When p of k equals 0, the number k is called a zero of the polynomial. So 2 is a zero of 2 x minus 4.",
          "Jab p of k barabar 0 ho, toh number k ko polynomial ka zero kehte hain. Toh 2, polynomial 2 x minus 4 ka zero hai."),
        L("Disha", "And on the graph, that is exactly where the line cuts the x-axis!", "Aur graph par yeh theek wahi jagah hai jahan line x-axis ko kaatti hai!"),
    ], {"kind": "linear", "a": 2, "b": -4, "win": [-1, 5, -6, 6]}),
    scene([
        L("Deepak", "Now a goods train. Its polynomial is 2 x plus 3. Where does this line meet the x-axis?",
          "Ab ek maalgaadi. Iska polynomial hai 2 x plus 3. Yeh line x-axis se kahan milti hai?"),
        L("Dadi", "Set 2 x plus 3 equal to 0. Then x equals minus 3 over 2. The line crosses the x-axis at minus 3 over 2.",
          "2 x plus 3 ko 0 ke barabar rakho. Toh x barabar minus 3 over 2. Line x-axis ko minus 3 over 2 par kaatti hai."),
    ], {"kind": "linear", "a": 2, "b": 3, "win": [-4, 3, -6, 6]}),
    scene([
        L("Dadi", "In general, a x plus b has exactly one zero, minus b over a. So the graph of a linear polynomial is a straight line that crosses the x-axis exactly once.",
          "General roop mein, a x plus b ka theek ek zero hota hai, minus b over a. Isliye linear polynomial ka graph ek seedhi line hai jo x-axis ko theek ek baar kaatti hai."),
        L("Harsh", "Minus b over a. Minus the constant, divided by the x coefficient. Got it!",
          "Minus b over a. Constant ka minus, x ke coefficient se divide. Samajh gaya!"),
    ], {"kind": "linear", "a": -1, "b": 2, "win": [-4, 5, -6, 6]}),
    scene([
        L("Deepak", "Your turn, junior engineer! Change a and b so the line crosses the x-axis at 3.",
          "Ab aapki baari, junior engineer! a aur b badlo taaki line x-axis ko 3 par kaate."),
    ], {"kind": "linear", "a": 1, "b": 1, "win": [-5, 5, -6, 6], "task": {"kind": "linear", "zeroAt": 3, "text": "Make the line cross the x-axis at x = 3."}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "In the evening, Harsh hits a high shot in the colony cricket match. The ball rises, slows down at the top and comes back down.",
          "Shaam ko colony ke cricket match mein Harsh ek ooncha shot maarta hai. Ball upar jaati hai, top par dheemi hoti hai aur waapas neeche aati hai."),
        L("Disha", "Its path looks like an upside down U!", "Iska raasta ek ulte U jaisa dikhta hai!"),
    ], {"kind": "quadratic", "a": -1, "b": 4, "c": 0, "win": [-1, 5, -2, 6], "ball": True}),
    scene([
        L("Dadi", "Ignoring the air, that path is a parabola, the graph of a quadratic polynomial. Here height is minus x squared plus 4 x.",
          "Hawa ko chhod dein toh yeh raasta parabola hai, quadratic polynomial ka graph. Yahan height hai minus x squared plus 4 x."),
        L("Dadi", "The ball is on the ground at x equal to 0 and at x equal to 4. Those are the two zeroes, where the curve meets the x-axis.",
          "Ball x barabar 0 aur x barabar 4 par zameen par hai. Yeh do zeroes hain, jahan curve x-axis se milta hai."),
    ], {"kind": "quadratic", "a": -1, "b": 4, "c": 0, "win": [-1, 5, -2, 6], "ball": True}),
    scene([
        L("Dadi", "Now let us draw the graph of x squared minus 3 x minus 4, point by point, the way the book does it.",
          "Ab x squared minus 3 x minus 4 ka graph banaate hain, point by point, jaise kitaab mein hai."),
        L("Disha", "At x equal to minus 1, it is 1 plus 3 minus 4, which is 0. At x equal to 4, it is 16 minus 12 minus 4, which is also 0!",
          "x barabar minus 1 par, 1 plus 3 minus 4, yaani 0. x barabar 4 par, 16 minus 12 minus 4, yeh bhi 0!"),
    ], {"kind": "quadratic", "a": 1, "b": -3, "c": -4, "win": [-3, 6, -8, 8], "table": True}),
    scene([
        L("Dadi", "Join the points smoothly and you get a U shape that opens upwards. Its zeroes, minus 1 and 4, are where it crosses the x-axis.",
          "Points ko smoothly jodo toh ek U shape milta hai jo upar ki taraf khulta hai. Iske zeroes, minus 1 aur 4, wahi hain jahan yeh x-axis ko kaatta hai."),
        L("Harsh", "So the sign of a decides the shape. a positive, it opens up. a negative, it opens down, like my six!",
          "Toh a ka sign shape tay karta hai. a positive toh upar khulta hai. a negative toh neeche, mere chhakke ki tarah!"),
    ], {"kind": "quadratic", "a": 1, "b": -3, "c": -4, "win": [-3, 6, -8, 8]}),
    scene([
        L("Dadi", "Now watch three cases. Case one: the parabola cuts the x-axis at two points, so two zeroes.",
          "Ab teen cases dekho. Pehla case: parabola x-axis ko do points par kaatta hai, toh do zeroes."),
    ], {"kind": "quadratic", "a": 1, "b": -2, "c": -3, "win": [-4, 6, -8, 8], "note": "two zeroes"}),
    scene([
        L("Dadi", "Case two: it just touches the x-axis at one point. The two zeroes have become one, so one zero.",
          "Doosra case: yeh x-axis ko bas ek point par chhoota hai. Do zeroes milkar ek ho gaye, toh ek zero."),
    ], {"kind": "quadratic", "a": 1, "b": -2, "c": 1, "win": [-4, 6, -8, 8], "note": "one zero"}),
    scene([
        L("Dadi", "Case three: it stays completely above the x-axis. It never meets it, so there is no real zero.",
          "Teesra case: yeh poori tarah x-axis ke upar rehta hai. Kabhi nahi milta, toh koi zero nahi."),
        L("Disha", "So a quadratic can have two zeroes, one zero, or none, but never more than two!",
          "Toh quadratic ke do zeroes, ek zero, ya koi nahi ho sakta hai, lekin kabhi do se zyaada nahi!"),
    ], {"kind": "quadratic", "a": 1, "b": -2, "c": 3, "win": [-4, 6, -8, 8], "note": "no zero"}),
    scene([
        L("Dadi", "Your turn! Make a parabola that opens downwards and has exactly two zeroes, like Harsh's shot.",
          "Ab aapki baari! Aisa parabola banao jo neeche ki taraf khule aur jiske theek do zeroes hon, Harsh ke shot ki tarah."),
    ], {"kind": "quadratic", "a": 1, "b": 0, "c": 2, "win": [-5, 5, -8, 8],
        "task": {"kind": "quadratic", "opens": "down", "zeroes": 2, "text": "Make a parabola that opens down and has exactly 2 zeroes."}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "Next morning, Disha draws a new curve in her notebook. It goes up, comes down, and goes up again.",
          "Agli subah Disha apni copy mein ek naya curve banaati hai. Yeh upar jaata hai, neeche aata hai, aur phir upar jaata hai."),
        L("Dadi", "That is a cubic, half of x cubed minus 4 x. It cuts the x-axis at minus 2, 0 and 2, so it has three zeroes.",
          "Yeh cubic hai, x cubed minus 4 x ka aadha. Yeh x-axis ko minus 2, 0 aur 2 par kaatta hai, toh iske teen zeroes hain."),
    ], {"mode": "cubic", "roots": [-2, 0, 2], "a": 0.5, "k": 0}),
    scene([
        L("Dadi", "Now I lift the whole curve up by 3. The left bump stays below, but the right part never comes down to the axis. Only one zero is left.",
          "Ab main poore curve ko 3 upar uthaati hoon. Baayein taraf ka hissa neeche rehta hai, lekin daayein taraf ka hissa axis tak nahi aata. Sirf ek zero bacha."),
    ], {"mode": "cubic", "roots": [-2, 0, 2], "a": 0.5, "k": 3}),
    scene([
        L("Harsh", "And this one touches the axis at 1 and cuts it at minus 2. That makes two zeroes.",
          "Aur yeh wala x-axis ko 1 par chhoota hai aur minus 2 par kaatta hai. Toh do zeroes."),
        L("Dadi", "Right. A cubic polynomial has at most 3 zeroes. And in general, a polynomial of degree n has at most n zeroes.",
          "Sahi. Cubic polynomial ke zyaada se zyaada 3 zeroes hote hain. Aur general roop mein, degree n waale polynomial ke zyaada se zyaada n zeroes hote hain."),
    ], {"mode": "cubic", "roots": [-2, 1, 1], "a": 0.5, "k": 0}),
    scene([
        L("Disha", "Why can a cubic never have zero zeroes, like the parabola sometimes does?", "Cubic ke kabhi bhi zero zeroes kyon nahi ho sakte, jaise parabola ke kabhi kabhi hote hain?"),
        L("Dadi", "Good question! A cubic goes down forever on one side and up forever on the other, so it must cross the x-axis at least once.",
          "Achha sawaal! Cubic ek taraf hamesha neeche jaata hai aur doosri taraf hamesha upar, isliye use x-axis ko kam se kam ek baar kaatna hi padta hai."),
    ], {"mode": "cubic", "roots": [-2, 0, 2], "a": 0.5, "k": -3}),
    scene([
        L("Dadi", "Board exams love this question: here is a graph, how many zeroes does the polynomial have? Just count the points where the graph meets the x-axis.",
          "Board exams mein yeh sawaal bahut aata hai: graph diya hai, polynomial ke kitne zeroes hain? Bas woh points gino jahan graph x-axis se milta hai."),
    ], {"mode": "guess", "g": 1, "reveal": True}),
    scene([
        L("Harsh", "Graph B floats above the axis, so zero zeroes. Graph D crosses three times, so three!",
          "Graph B axis ke upar tairta hai, toh zero zeroes. Graph D teen baar kaatta hai, toh teen!"),
    ], {"mode": "guess", "g": 3, "reveal": True}),
    scene([
        L("Dadi", "Careful with Graph E. It cuts the axis once and touches it once. A touching point is still a zero, so the answer is two.",
          "Graph E mein dhyaan do. Yeh axis ko ek baar kaatta hai aur ek baar chhoota hai. Chhoone waala point bhi zero hai, toh jawaab do hai."),
    ], {"mode": "guess", "g": 4, "reveal": True}),
    scene([
        L("Dadi", "Your turn! Look at Graph G and pick how many zeroes it has.", "Ab aapki baari! Graph G dekho aur chuno ki iske kitne zeroes hain."),
    ], {"mode": "guess", "g": 6, "reveal": False, "task": {"pick": True, "text": "Count the zeroes of Graph G and tap the number."}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "On Wednesday, Mummy is doing accounts at her bakery shop. Disha brings her maths homework along.",
          "Budhvaar ko Mummy apni bakery shop par hisaab kar rahi hain. Disha apna maths homework saath le aati hai."),
        L("Neha", "Look at x squared minus 3 x minus 4 again. Its zeroes are 4 and minus 1. Add them, and multiply them.",
          "x squared minus 3 x minus 4 ko phir dekho. Iske zeroes 4 aur minus 1 hain. Inhe jodo, aur guna karo."),
    ], {"a": 1, "al": 4, "be": -1, "step": 1}),
    scene([
        L("Disha", "Sum is 4 plus minus 1, which is 3. Product is 4 times minus 1, which is minus 4.",
          "Sum hai 4 plus minus 1, yaani 3. Product hai 4 guna minus 1, yaani minus 4."),
        L("Neha", "Now look at the coefficients. b is minus 3, so minus b is 3. And c is minus 4. Same numbers!",
          "Ab coefficients dekho. b hai minus 3, toh minus b hai 3. Aur c hai minus 4. Wahi numbers!"),
    ], {"a": 1, "al": 4, "be": -1, "step": 3}),
    scene([
        L("Dadi", "This is no accident. If alpha and beta are the zeroes, the polynomial is a times x minus alpha, times x minus beta.",
          "Yeh sanyog nahi hai. Agar alpha aur beta zeroes hain, toh polynomial hai a guna x minus alpha, guna x minus beta."),
        L("Dadi", "Multiply it out: a x squared, minus a times alpha plus beta, times x, plus a alpha beta. Compare with a x squared plus b x plus c.",
          "Ise khol do: a x squared, minus a guna alpha plus beta, guna x, plus a alpha beta. Ab a x squared plus b x plus c se milaao."),
    ], {"a": 1, "al": 4, "be": -1, "step": 1}),
    scene([
        L("Dadi", "So b equals minus a times alpha plus beta, and c equals a times alpha beta. The sum of zeroes is minus b over a. The product of zeroes is c over a.",
          "Toh b barabar minus a guna alpha plus beta, aur c barabar a guna alpha beta. Zeroes ka sum hai minus b over a. Zeroes ka product hai c over a."),
    ], {"a": 1, "al": 4, "be": -1, "step": 3}),
    scene([
        L("Neha", "Let me test it on a shop example. 2 x squared minus 8 x plus 6 is 2 times x minus 1, times x minus 3. Zeroes 1 and 3.",
          "Main shop ka ek example leti hoon. 2 x squared minus 8 x plus 6 barabar 2 guna x minus 1, guna x minus 3. Zeroes 1 aur 3."),
        L("Disha", "Sum is 4, and minus b over a is 8 over 2, also 4. Product is 3, and c over a is 6 over 2, also 3!",
          "Sum 4 hai, aur minus b over a hai 8 over 2, yeh bhi 4. Product 3 hai, aur c over a hai 6 over 2, yeh bhi 3!"),
    ], {"a": 2, "al": 1, "be": 3, "step": 3}),
    scene([
        L("Harsh", "Wait, so I can skip the a? The sum of zeroes is just minus b?", "Ruko, toh main a chhod sakta hoon? Zeroes ka sum bas minus b hai?"),
        L("Dadi", "Only when a is 1, Harsh. Here a is 2. Minus b alone would give 8, which is wrong. Always divide by a.",
          "Sirf tab jab a 1 ho, Harsh. Yahan a 2 hai. Akela minus b toh 8 dega, jo galat hai. Hamesha a se divide karo."),
    ], {"a": 2, "al": 1, "be": 3, "step": 2}),
    scene([
        L("Dadi", "One more from the book: 6 x squared minus 7 x minus 3 has zeroes 3 over 2 and minus 1 over 3. Their sum is 7 over 6, which is minus b over a. Their product is minus 1 over 2, which is c over a.",
          "Kitaab se ek aur: 6 x squared minus 7 x minus 3 ke zeroes hain 3 over 2 aur minus 1 over 3. Unka sum 7 over 6 hai, jo minus b over a hai. Unka product minus 1 over 2 hai, jo c over a hai."),
    ], {"a": 6, "al": 1.5, "be": -0.333333333333, "step": 3}),
    scene([
        L("Neha", "Your turn! Drag the two zeroes so that the x term disappears. That means the sum must be 0, with two different zeroes.",
          "Ab aapki baari! Dono zeroes ko aise khiskaao ki x waala term gayab ho jaaye. Matlab sum 0 hona chahiye, aur dono zeroes alag hon."),
    ], {"a": 1, "al": 3, "be": 1, "step": 3, "task": {"sum": 0, "distinct": True, "text": "Drag the zeroes so that b = 0 (sum of zeroes 0, zeroes different)."}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "On Friday night, Harsh and Disha play a number game before bed.", "Shukravaar raat ko sone se pehle Harsh aur Disha ek number game khelte hain."),
        L("Harsh", "I am thinking of two numbers. Their sum is 5 and their product is 6. Find my polynomial!",
          "Main do numbers soch raha hoon. Unka sum 5 hai aur product 6. Mera polynomial dhoondo!"),
    ], {"S": 5, "P": 6, "k": 1, "step": 0}),
    scene([
        L("Dadi", "Turn the rule around. If the sum is S and the product is P, the quadratic is k times x squared minus S x plus P, for any non-zero k.",
          "Rule ko ulta karo. Agar sum S hai aur product P, toh quadratic hai k guna x squared minus S x plus P, kisi bhi non-zero k ke liye."),
    ], {"S": 5, "P": 6, "k": 1, "step": 1}),
    scene([
        L("Disha", "So it is x squared minus 5 x plus 6. Its zeroes are 2 and 3, and 2 plus 3 is 5, and 2 times 3 is 6. Your numbers are 2 and 3!",
          "Toh yeh hai x squared minus 5 x plus 6. Iske zeroes 2 aur 3 hain, aur 2 plus 3 barabar 5, 2 guna 3 barabar 6. Tumhaare numbers 2 aur 3 hain!"),
    ], {"S": 5, "P": 6, "k": 1, "step": 3}),
    scene([
        L("Disha", "My turn. Sum is 1 over 4, and product is minus 1.", "Meri baari. Sum hai 1 over 4, aur product minus 1."),
        L("Harsh", "x squared minus 1 over 4 x minus 1. Fractions are ugly, so I take k as 4. That gives 4 x squared minus x minus 4!",
          "x squared minus 1 over 4 x minus 1. Fractions achhe nahi lagte, toh main k ko 4 leta hoon. Isse milta hai 4 x squared minus x minus 4!"),
    ], {"S": 0.25, "P": -1, "k": 4, "step": 2}),
    scene([
        L("Dadi", "Both answers are correct, beta. Multiplying by k does not move the zeroes, it only stretches the curve.",
          "Dono jawaab sahi hain, beta. k se guna karne se zeroes nahi hilte, sirf curve khinchta hai."),
    ], {"S": 0.25, "P": -1, "k": 4, "step": 3}),
    scene([
        L("Disha", "What if the sum is 0 and the product is minus 3?", "Agar sum 0 ho aur product minus 3?"),
        L("Dadi", "Then it is x squared minus 3, with zeroes root 3 and minus root 3. Add them, you get 0. Multiply, you get minus 3.",
          "Toh yeh x squared minus 3 hai, jiske zeroes root 3 aur minus root 3 hain. Jodo toh 0, guna karo toh minus 3."),
    ], {"S": 0, "P": -3, "k": 1, "step": 3}),
    scene([
        L("Harsh", "And if the sum is 2 and the product is 5?", "Aur agar sum 2 ho aur product 5?"),
        L("Dadi", "x squared minus 2 x plus 5. The curve stays above the axis, so no real numbers have that sum and product. The polynomial still exists, it just has no real zeroes.",
          "x squared minus 2 x plus 5. Curve axis ke upar rehta hai, toh aise koi real numbers nahi jinka yeh sum aur product ho. Polynomial phir bhi hai, bas uske real zeroes nahi."),
    ], {"S": 2, "P": 5, "k": 1, "step": 3}),
    scene([
        L("Dadi", "Your turn! Build a quadratic whose zeroes are 3 and minus 2. First work out their sum and product.",
          "Ab aapki baari! Aisa quadratic banao jiske zeroes 3 aur minus 2 hon. Pehle unka sum aur product nikaalo."),
    ], {"S": 0, "P": 0, "k": 1, "step": 3, "task": {"zeroes": [3, -2], "text": "Set the sum and product so the zeroes are 3 and −2."}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "On Sunday, Dadi sets a board-style test paper on polynomials.", "Itvaar ko Dadi polynomials par board jaisa test paper deti hain."),
        L("Dadi", "Question 1. Find the zeroes of x squared plus 7 x plus 10, and verify the relationship between the zeroes and the coefficients.",
          "Sawaal 1. x squared plus 7 x plus 10 ke zeroes nikaalo, aur zeroes aur coefficients ka sambandh verify karo."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "Split the middle term: x plus 2, times x plus 5. Zeroes are minus 2 and minus 5. Sum minus 7 equals minus b over a. Product 10 equals c over a.",
          "Middle term todo: x plus 2, guna x plus 5. Zeroes minus 2 aur minus 5. Sum minus 7, jo minus b over a hai. Product 10, jo c over a hai."),
    ], {"example": 0, "step": 4}),
    scene([
        L("Dadi", "Question 2. Find a quadratic polynomial whose sum of zeroes is 1 over 4 and product is minus 1.",
          "Sawaal 2. Aisa quadratic polynomial nikaalo jiske zeroes ka sum 1 over 4 aur product minus 1 ho."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "x squared minus 1 over 4 x minus 1. Times 4 gives 4 x squared minus x minus 4. I remembered from Friday!",
          "x squared minus 1 over 4 x minus 1. 4 se guna karke 4 x squared minus x minus 4. Mujhe Friday se yaad tha!"),
        L("Dadi", "Shabash! Now try the rest, beta. Pick any question from 3 to 10, solve it in your notebook first, then reveal the steps.",
          "Shabash! Ab baaki try karo, beta. 3 se 10 tak koi bhi sawaal chuno, pehle copy mein hal karo, phir steps dekho."),
    ], {"example": 1, "step": 3}),
]


def _graph_svg(kind):
    """Small static graphs for the solved questions."""
    parts = ['<svg viewBox="0 0 300 160" width="300" height="160" xmlns="http://www.w3.org/2000/svg">',
             '<line x1="10" y1="80" x2="290" y2="80" stroke="#94a3b8" stroke-width="2"/>',
             '<line x1="150" y1="8" x2="150" y2="152" stroke="#94a3b8" stroke-width="2"/>',
             '<text x="284" y="74" fill="#94a3b8" font-size="12">x</text><text x="156" y="18" fill="#94a3b8" font-size="12">y</text>']
    if kind == "three":
        # y = 0.5x(x^2 - 4) style curve, crossing at x = -2, 0, 2 (40 px per unit)
        pts = []
        for i in range(0, 141):
            x = -3.5 + i * 0.05
            y = 0.5 * x * (x * x - 4)
            pts.append(f"{150 + x * 40:.1f},{80 - y * 18:.1f}")
        parts.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="#f472b6" stroke-width="3"/>')
        for x in (-2, 0, 2):
            parts.append(f'<circle cx="{150 + x * 40}" cy="80" r="4" fill="#34d399"/>')
    else:
        # parabola touching the x-axis once: y = (x - 1)^2
        pts = []
        for i in range(0, 121):
            x = -2 + i * 0.05
            y = (x - 1) ** 2
            pts.append(f"{150 + x * 40:.1f},{80 - y * 18:.1f}")
        parts.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="#38bdf8" stroke-width="3"/>')
        parts.append('<circle cx="190" cy="80" r="4" fill="#34d399"/>')
    parts.append('</svg>')
    return "".join(parts)


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Board Prep at the Dining Table · What Is a Polynomial?",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>A few months before the board exams, Dadi opens Chapter 2 with Harsh and Disha. They sort expressions into polynomials and non-polynomials, find the degree, and name linear, quadratic and cubic polynomials.</div>

<h2>Polynomial, term, coefficient</h2>
<p>A <strong>polynomial</strong> in x is an expression made of terms of the form (number) × x<sup>n</sup>, where every power n is a <strong>whole number</strong> (0, 1, 2, 3, …). In 2x² − 3x + 5 the terms are 2x², −3x and 5; the <strong>coefficients</strong> are 2, −3 and 5.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Expression</th><th class="text-left">Polynomial?</th><th class="text-left">Reason</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>x² − 3x − 4</td><td>Yes</td><td>powers 2, 1, 0</td></tr>
    <tr><td>2y³ + 5</td><td>Yes (in y)</td><td>powers 3, 0</td></tr>
    <tr><td>x + 1/x</td><td>No</td><td>1/x = x<sup>−1</sup></td></tr>
    <tr><td>√x + 3</td><td>No</td><td>√x = x<sup>1/2</sup></td></tr>
    <tr><td>7</td><td>Yes (constant)</td><td>7 = 7x⁰</td></tr>
  </tbody>
</table>

<h2>Degree and types</h2>
<p>The <strong>degree</strong> of a polynomial is the highest power of x whose coefficient is not zero.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Degree</th><th class="text-left">Name</th><th class="text-left">General form</th><th class="text-left">Example</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>0</td><td>constant</td><td>c</td><td>7</td></tr>
    <tr><td>1</td><td>linear</td><td>ax + b, a ≠ 0</td><td>2x + 3</td></tr>
    <tr><td>2</td><td>quadratic</td><td>ax² + bx + c, a ≠ 0</td><td>x² − 3x − 4</td></tr>
    <tr><td>3</td><td>cubic</td><td>ax³ + bx² + cx + d, a ≠ 0</td><td>x³ − 4x</td></tr>
  </tbody>
</table>
<div {FORMULA}>Quadratic: p(x) = ax² + bx + c, a ≠ 0</div>
<div {CARD}>
  <div>A missing term does not change the degree: x³ − 4x is still cubic.</div>
  <div>The <strong>zero polynomial</strong> (every coefficient 0) has no defined degree.</div>
  <div>The <strong>value</strong> of p(x) at x = k is p(k): for p(x) = x² − 3x − 4, p(2) = 4 − 6 − 4 = −6.</div>
</div>
""",
        "keyInsight": "A polynomial uses only whole-number powers of x, and its degree is the highest power with a non-zero coefficient.",
        "widgetType": "Class10PolyDegreeWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "What is the degree of 5 − 2x + 4x³?",
            "options": ["1", "2", "3", "5"],
            "correctIndex": 2,
            "explanation": "The highest power of x with a non-zero coefficient is 3 (the term 4x³), so the degree is 3. The order in which the terms are written does not matter.",
        },
        "teacherNotes": teacher(
            [
                "Start from the definition: only whole-number powers. Rewrite 1/x and √x as powers to show why they fail.",
                "Write the terms of a polynomial in a column by power (as on the widget) so the missing powers are visible.",
                "Stress that the degree is about the highest power, not the number of terms or the biggest coefficient.",
            ],
            [
                "Taking the degree from the first term written (5 − 2x + 4x³ is not degree 0).",
                "Calling x + 1/x or √x + 1 a polynomial.",
                "Thinking a constant like 7 is not a polynomial, or giving the zero polynomial degree 0.",
            ],
            "Card sort: pairs get 12 expression cards and sort them into 'not a polynomial', 'linear', 'quadratic', 'cubic', then swap and check.",
            "NCERT Class 10 Ch. 2 Polynomials, 2.1 Introduction (rationalised syllabus).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Papa's Railway Yard · Zeroes of a Linear Polynomial",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>At the railway yard, a train starts 4 km before a signal and moves 2 km every minute. Its position from the signal is 2x − 4. The moment it reaches the signal, the polynomial is 0, and that moment is a zero of the polynomial.</div>

<h2>Value and zero of a polynomial</h2>
<p>If p(k) = 0, the real number k is called a <strong>zero</strong> of p(x).</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>x (minutes)</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead>
  <tbody class="text-slate-300"><tr><td class="text-center">2x − 4 (km)</td><td class="text-center">−4</td><td class="text-center">−2</td><td class="text-center text-emerald-300">0</td><td class="text-center">2</td><td class="text-center">4</td></tr></tbody>
</table>

<h2>Geometrical meaning</h2>
<p>The graph of y = ax + b (a ≠ 0) is a straight line. It meets the x-axis at exactly one point, (−b/a, 0). So a linear polynomial has <strong>exactly one zero</strong>, the x-coordinate of the point where its graph crosses the x-axis.</p>
<div {FORMULA}>zero of ax + b is x = −b/a</div>
<div {CARD}>
  <div>2x − 4: zero = −(−4)/2 = 2. The line crosses the x-axis at (2, 0).</div>
  <div>2x + 3: zero = −3/2. The line crosses the x-axis at (−3/2, 0).</div>
</div>
""",
        "keyInsight": "A zero of a polynomial is an x where its value is 0, which is exactly where its graph meets the x-axis; ax + b has one zero, −b/a.",
        "widgetType": "Class10PolyGraphWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "The zero of the linear polynomial 3x + 6 is:",
            "options": ["2", "−2", "6", "−1/2"],
            "correctIndex": 1,
            "explanation": "3x + 6 = 0 gives x = −6/3 = −2. Check: 3(−2) + 6 = 0.",
        },
        "teacherNotes": teacher(
            [
                "Use a value table first; the zero appears as the 0 in the y row, then on the graph as the crossing point.",
                "Connect −b/a to solving ax + b = 0 so students do not memorise it blindly.",
                "Emphasise: zero of a polynomial is an x value, the graph point is (zero, 0).",
            ],
            [
                "Reading the y-intercept (0, b) as the zero.",
                "Sign errors: writing b/a instead of −b/a.",
                "Giving the zero as the point (2, 0) when the number 2 is asked.",
            ],
            "Human graph: mark an x-axis on the floor; each student stands at x and steps forward or back by the value of 2x − 4. Who stands on the axis?",
            "NCERT Class 10 Ch. 2, 2.2 Geometrical Meaning of the Zeroes of a Polynomial (linear case).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: The Colony Cricket Match · Parabolas and Their Zeroes",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>Harsh's high shot traces an upside-down U. Dadi shows that the graph of every quadratic polynomial is such a curve, a parabola, and that it can meet the x-axis twice, once, or not at all.</div>

<h2>Graph of y = x² − 3x − 4</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>x</th><th>−2</th><th>−1</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead>
  <tbody class="text-slate-300"><tr><td class="text-center">y</td><td class="text-center">6</td><td class="text-center text-emerald-300">0</td><td class="text-center">−4</td><td class="text-center">−6</td><td class="text-center">−6</td><td class="text-center">−4</td><td class="text-center text-emerald-300">0</td><td class="text-center">6</td></tr></tbody>
</table>
<p>The points lie on a U-shaped curve, a <strong>parabola</strong>. It crosses the x-axis at (−1, 0) and (4, 0), so the zeroes of x² − 3x − 4 are −1 and 4.</p>

<h2>Shape and number of zeroes</h2>
<div {CARD}>
  <div><strong>a &gt; 0</strong>: the parabola opens upwards (∪). <strong>a &lt; 0</strong>: it opens downwards (∩).</div>
  <div><strong>Case (i)</strong> cuts the x-axis at two distinct points: two zeroes (e.g. x² − 2x − 3, zeroes −1 and 3).</div>
  <div><strong>Case (ii)</strong> touches the x-axis at one point: one zero, the two zeroes coincide (e.g. x² − 2x + 1, zero 1).</div>
  <div><strong>Case (iii)</strong> lies completely above or below the x-axis: no zero (e.g. x² − 2x + 3).</div>
</div>
<div {FORMULA}>A quadratic polynomial has at most 2 zeroes</div>
<p>Ignoring air resistance, a ball's path is a parabola: for height h = −x² + 4x, the ball leaves the ground at x = 0 and lands at x = 4, the two zeroes.</p>
""",
        "keyInsight": "The graph of a quadratic is a parabola (up if a > 0, down if a < 0), and it meets the x-axis at two, one or no points, giving two, one or no zeroes.",
        "widgetType": "Class10PolyGraphWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "The graph of y = ax² + bx + c touches the x-axis at exactly one point. How many zeroes does the polynomial have?",
            "options": ["0", "1", "2", "3"],
            "correctIndex": 1,
            "explanation": "The x-coordinate of each point where the graph meets the x-axis is a zero. One meeting point (a touch) means exactly one zero (the two zeroes coincide).",
        },
        "teacherNotes": teacher(
            [
                "Have students build the value table for x² − 3x − 4 themselves and plot it before showing the widget.",
                "Use the three-case slider demo: keep a and b fixed and change only c to lift the parabola.",
                "Link shape to sign of a with the cricket ball (a negative) versus a bowl (a positive).",
            ],
            [
                "Counting the y-intercept as a zero.",
                "Joining plotted points with straight segments instead of a smooth curve.",
                "Thinking a touching point does not count as a zero.",
            ],
            "Toss a ball and photograph its path, or sketch it; fit the shape to a downward parabola and mark the two zeroes (launch and landing).",
            "NCERT Class 10 Ch. 2, 2.2 (quadratic case, Fig. 2.4 to 2.7 cases i to iii).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Disha's Notebook · Cubics and Counting Zeroes from a Graph",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Disha draws a curve that rises, falls and rises again. It is a cubic. Shifting it up and down changes how often it crosses the x-axis, and Harsh and Disha practise the board's favourite question: how many zeroes does this graph show?</div>

<h2>Graph of a cubic</h2>
<p>For x³ − 4x = x(x − 2)(x + 2), the graph crosses the x-axis at −2, 0 and 2, so it has three zeroes. Other cubics cross once (e.g. x³), or cut once and touch once (e.g. (x + 2)(x − 1)², two zeroes).</p>
<div {FORMULA}>A polynomial of degree n has at most n zeroes</div>
<div {CARD}>
  <div>Linear: exactly 1 zero. Quadratic: 0, 1 or 2 zeroes. Cubic: 1, 2 or 3 zeroes (at least one, because the graph goes from very low on one side to very high on the other).</div>
  <div><strong>Reading a graph:</strong> the number of zeroes of p(x) = the number of points where the graph of y = p(x) meets the x-axis. Touching points count.</div>
  <div>Do not count where the curve meets the y-axis, and do not count turning points.</div>
</div>
""",
        "keyInsight": "Count the points where the graph meets the x-axis (crossing or touching) to get the number of zeroes; degree n allows at most n.",
        "widgetType": "Class10PolyCubicWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "The graph of y = p(x) cuts the x-axis at 2 points and touches it at 1 more point. The number of zeroes of p(x) is:",
            "options": ["1", "2", "3", "4"],
            "correctIndex": 2,
            "explanation": "Every point where the graph meets the x-axis, crossing or touching, gives a zero: 2 + 1 = 3 zeroes.",
        },
        "teacherNotes": teacher(
            [
                "Show the cubic widget and slide it up slowly; ask students to call out the zero count at each moment.",
                "For graph questions, have students put a finger on each x-axis contact and count aloud.",
                "Explain 'at most n zeroes' as a ceiling, not a guarantee (a quadratic may have none).",
            ],
            [
                "Counting turning points (peaks and valleys) as zeroes.",
                "Ignoring a touching point.",
                "Saying a cubic can have no zeroes.",
            ],
            "Graph gallery walk: post 8 printed graphs around the room; students write the number of zeroes for each and check in pairs.",
            "NCERT Class 10 Ch. 2, 2.2 (cubic graphs, Example 1 and Exercise 2.1).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Mummy's Bakery Accounts · Sum and Product of Zeroes",
        "readingTime": "~7 min story",
        "narrative": f"""
<div {STORY}>At the bakery, Mummy and Disha notice that the zeroes of x² − 3x − 4 add up to 3 and multiply to −4, the same numbers hiding in the coefficients. Dadi proves it always happens.</div>

<h2>Why it works</h2>
<p>If α and β are the zeroes of p(x) = ax² + bx + c, then x − α and x − β are factors, so</p>
<p class="font-mono">ax² + bx + c = a(x − α)(x − β) = ax² − a(α + β)x + aαβ</p>
<p>Comparing coefficients: b = −a(α + β) and c = aαβ.</p>
<div {FORMULA}>α + β = −b/a    ·    αβ = c/a</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Polynomial</th><th>Zeroes</th><th>Sum</th><th>−b/a</th><th>Product</th><th>c/a</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>x² − 3x − 4</td><td class="text-center">4, −1</td><td class="text-center">3</td><td class="text-center">3</td><td class="text-center">−4</td><td class="text-center">−4</td></tr>
    <tr><td>2x² − 8x + 6</td><td class="text-center">1, 3</td><td class="text-center">4</td><td class="text-center">8/2 = 4</td><td class="text-center">3</td><td class="text-center">6/2 = 3</td></tr>
    <tr><td>6x² − 7x − 3</td><td class="text-center">3/2, −1/3</td><td class="text-center">7/6</td><td class="text-center">7/6</td><td class="text-center">−1/2</td><td class="text-center">−3/6 = −1/2</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>Always divide by a. Only when a = 1 is the sum simply −b and the product simply c.</div>
  <div>For interest: for a cubic ax³ + bx² + cx + d with zeroes α, β, γ, NCERT also states α + β + γ = −b/a, αβ + βγ + γα = c/a and αβγ = −d/a.</div>
</div>
""",
        "keyInsight": "For ax² + bx + c, the zeroes add to −b/a and multiply to c/a, because the polynomial equals a(x − α)(x − β).",
        "widgetType": "Class10PolySumProductWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "For 3x² − 12x + 9, the sum and product of the zeroes are:",
            "options": ["sum 12, product 9", "sum 4, product 3", "sum −4, product 3", "sum 4, product −3"],
            "correctIndex": 1,
            "explanation": "Sum = −b/a = 12/3 = 4 and product = c/a = 9/3 = 3. (Zeroes are 1 and 3: 1 + 3 = 4, 1 × 3 = 3.)",
        },
        "teacherNotes": teacher(
            [
                "Discover first: give 4 factorable quadratics, ask for zeroes, their sum and product, and let students spot the pattern.",
                "Then prove by expanding a(x − α)(x − β) and comparing coefficients.",
                "In 'find the zeroes and verify' questions, insist on both checks written out.",
            ],
            [
                "Forgetting the minus sign in −b/a.",
                "Forgetting to divide by a when a ≠ 1.",
                "Taking b without its sign (for x² − 3x − 4, b is −3, not 3).",
            ],
            "Pattern hunt: groups factorise x² + 7x + 10, x² − 5x + 6, 2x² − 8x + 6 and 6x² − 7x − 3, fill a sum/product table, and state the rule.",
            "NCERT Class 10 Ch. 2, 2.3 Relationship between Zeroes and Coefficients of a Polynomial; Exercise 2.2 Q1.",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: A Number Game at Bedtime · Forming a Quadratic",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Harsh thinks of two numbers with sum 5 and product 6 and dares Disha to find his polynomial. Turning the sum and product rule around builds any quadratic from its zeroes.</div>

<h2>Quadratic from the sum and product of zeroes</h2>
<p>If the sum of zeroes is S and the product is P, then −b/a = S and c/a = P, so b = −aS and c = aP. Taking a = k:</p>
<div {FORMULA}>p(x) = k[x² − (sum of zeroes)x + (product of zeroes)], k ≠ 0</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>Sum</th><th>Product</th><th class="text-left">Quadratic</th><th class="text-left">Zeroes</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td class="text-center">5</td><td class="text-center">6</td><td>x² − 5x + 6</td><td>2, 3</td></tr>
    <tr><td class="text-center">1/4</td><td class="text-center">−1</td><td>x² − (1/4)x − 1, or 4x² − x − 4 (k = 4)</td><td>(1 ± √65)/8</td></tr>
    <tr><td class="text-center">0</td><td class="text-center">−3</td><td>x² − 3</td><td>√3, −√3</td></tr>
    <tr><td class="text-center">1</td><td class="text-center">−6</td><td>x² − x − 6</td><td>3, −2</td></tr>
    <tr><td class="text-center">2</td><td class="text-center">5</td><td>x² − 2x + 5</td><td>no real zeroes</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>Different values of k give different polynomials with the <strong>same zeroes</strong>; choose k to clear fractions.</div>
  <div>From given zeroes α and β: k(x − α)(x − β) = k[x² − (α + β)x + αβ].</div>
</div>
""",
        "keyInsight": "Any quadratic with zeroes summing to S and multiplying to P is k(x² − Sx + P) for some non-zero k.",
        "widgetType": "Class10PolyBuildWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "A quadratic polynomial whose zeroes have sum −3 and product 2 is:",
            "options": ["x² − 3x + 2", "x² + 3x + 2", "x² + 3x − 2", "x² − 2x − 3"],
            "correctIndex": 1,
            "explanation": "x² − (sum)x + product = x² − (−3)x + 2 = x² + 3x + 2. Check: zeroes −1 and −2, sum −3, product 2.",
        },
        "teacherNotes": teacher(
            [
                "Present it as the reverse of Story 5: from coefficients to zeroes, now from zeroes to coefficients.",
                "Show that 2(x² − 5x + 6) has the same zeroes, so the answer is not unique; k is free.",
                "Use k to clear fractions in answers like sum 1/4, product −1.",
            ],
            [
                "Writing x² + Sx + P (wrong sign on the middle term).",
                "Writing x² − Px + S (swapping sum and product).",
                "Thinking there is only one correct polynomial.",
            ],
            "Guess my numbers: one student secretly picks two integers and announces only their sum and product; the class writes the polynomial and finds the numbers.",
            "NCERT Class 10 Ch. 2, 2.3 (Example 4, Exercise 2.2 Q2).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 board-style problems, step by step",
        "readingTime": "~12 min",
        "narrative": f"""
<div {STORY}>On Sunday, Dadi sets a board-style test paper: short answers, long answers, an assertion–reason and a case study.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Degree = highest power with a non-zero coefficient.</li>
  <li>Zeroes from a graph = number of points where the graph meets the x-axis.</li>
  <li>Zero of ax + b is −b/a.</li>
  <li>For ax² + bx + c: α + β = −b/a, αβ = c/a.</li>
  <li>From sum S and product P: k(x² − Sx + P).</li>
</ol>
<p>Use the question buttons. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Most polynomial questions come down to reading −b/a and c/a correctly, with signs.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Find zeroes and verify (short answer)",
                    "question": "Find the zeroes of x² + 7x + 10 and verify the relationship between the zeroes and the coefficients.",
                    "steps": [
                        "x² + 7x + 10 = x² + 2x + 5x + 10 = (x + 2)(x + 5)",
                        "Zeroes: x = −2 and x = −5",
                        "Sum = −2 + (−5) = −7 and −b/a = −7/1 = −7 ✔",
                        "Product = (−2)(−5) = 10 and c/a = 10/1 = 10 ✔",
                    ],
                    "answer": "−2 and −5",
                },
                {
                    "title": "Form a quadratic (short answer)",
                    "question": "Find a quadratic polynomial whose sum and product of zeroes are 1/4 and −1.",
                    "steps": [
                        "p(x) = k[x² − (1/4)x + (−1)] = k[x² − (1/4)x − 1]",
                        "Take k = 4 to clear the fraction",
                        "p(x) = <strong>4x² − x − 4</strong>",
                    ],
                    "answer": "4x² − x − 4",
                },
                {
                    "title": "Degree (MCQ)",
                    "question": "The degree of the polynomial (x + 1)(x² − x − x⁴ + 1) is: (a) 2 (b) 3 (c) 4 (d) 5",
                    "steps": [
                        "Highest power in the first bracket: x (power 1)",
                        "Highest power in the second bracket: −x⁴ (power 4)",
                        "Highest term of the product: x × (−x⁴) = −x⁵",
                        "Degree = <strong>5, option (d)</strong>",
                    ],
                    "answer": "(d) 5",
                },
                {
                    "title": "Zeroes from a graph (MCQ)",
                    "question": "The graph of y = p(x) is shown. The number of zeroes of p(x) is: (a) 1 (b) 2 (c) 3 (d) 0",
                    "figureSvg": _graph_svg("three"),
                    "steps": [
                        "Count the points where the graph meets the x-axis.",
                        "It crosses at three points (shown in green).",
                        "Number of zeroes = <strong>3, option (c)</strong>",
                    ],
                    "answer": "(c) 3",
                },
                {
                    "title": "Zeroes with fractions (long answer)",
                    "question": "Find the zeroes of 6x² − 7x − 3 and verify the relationship between the zeroes and the coefficients.",
                    "steps": [
                        "Split −7x using 6 × (−3) = −18 = −9 × 2: 6x² − 9x + 2x − 3",
                        "= 3x(2x − 3) + 1(2x − 3) = (2x − 3)(3x + 1)",
                        "Zeroes: x = 3/2 and x = −1/3",
                        "Sum = 3/2 − 1/3 = 9/6 − 2/6 = 7/6, and −b/a = 7/6 ✔",
                        "Product = (3/2)(−1/3) = −1/2, and c/a = −3/6 = −1/2 ✔",
                    ],
                    "answer": "3/2 and −1/3",
                },
                {
                    "title": "Zeroes of x² − 3 (short answer)",
                    "question": "Find the zeroes of x² − 3 and verify the relationship between the zeroes and the coefficients.",
                    "steps": [
                        "x² − 3 = (x − √3)(x + √3), so the zeroes are √3 and −√3",
                        "Here a = 1, b = 0, c = −3",
                        "Sum = √3 + (−√3) = 0 = −b/a = −0/1 ✔",
                        "Product = (√3)(−√3) = −3 = c/a ✔",
                    ],
                    "answer": "√3 and −√3",
                },
                {
                    "title": "Find a coefficient (short answer)",
                    "question": "If one zero of 2x² + kx − 6 is 2, find k and the other zero.",
                    "steps": [
                        "p(2) = 0: 2(4) + 2k − 6 = 0, so 2 + 2k = 0 and <strong>k = −1</strong>",
                        "Product of zeroes = c/a = −6/2 = −3",
                        "2 × β = −3, so <strong>β = −3/2</strong>",
                        "Check sum: 2 + (−3/2) = 1/2 and −b/a = −(−1)/2 = 1/2 ✔",
                    ],
                    "answer": "k = −1, other zero −3/2",
                },
                {
                    "title": "Symmetric expression (long answer)",
                    "question": "If α and β are the zeroes of x² − 5x + 6, find α² + β² without finding the zeroes.",
                    "steps": [
                        "α + β = −b/a = 5 and αβ = c/a = 6",
                        "α² + β² = (α + β)² − 2αβ",
                        "= 25 − 12 = <strong>13</strong>",
                        "Check: zeroes 2 and 3, and 4 + 9 = 13 ✔",
                    ],
                    "answer": "13",
                },
                {
                    "title": "Assertion and Reason",
                    "question": "Assertion (A): x² − 2x + 1 has exactly one zero. Reason (R): The graph of a quadratic polynomial always cuts the x-axis at two points. Choose: (a) both true, R explains A (b) both true, R does not explain A (c) A true, R false (d) A false, R true",
                    "figureSvg": _graph_svg("touch"),
                    "steps": [
                        "x² − 2x + 1 = (x − 1)², which is 0 only at x = 1: the graph touches the x-axis once. A is true.",
                        "A parabola may cut the x-axis at two points, touch it at one, or miss it. R is false.",
                        "Answer: <strong>(c)</strong>",
                    ],
                    "answer": "(c)",
                },
                {
                    "title": "Case study: the cricket shot",
                    "question": "The height (in m) of a ball hit by Harsh is h(x) = −x² + 4x, where x is the horizontal distance in units of 5 m. (i) What shape is the path? (ii) Find the zeroes of h(x). (iii) Find their sum and product and verify with the coefficients.",
                    "steps": [
                        "(i) h is quadratic with a = −1 &lt; 0, so the path is a parabola opening downwards.",
                        "(ii) −x² + 4x = −x(x − 4) = 0 gives <strong>x = 0 and x = 4</strong> (the ball leaves the ground and lands back).",
                        "(iii) Sum = 0 + 4 = 4, and −b/a = −4/(−1) = 4 ✔",
                        "Product = 0 × 4 = 0, and c/a = 0/(−1) = 0 ✔",
                    ],
                    "answer": "Downward parabola; zeroes 0 and 4; sum 4, product 0",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Model the full board layout for 'find and verify' questions: factorise, state zeroes, then two separate checks.",
                "Q7 and Q8 show how sum and product save work; encourage using them before finding zeroes.",
                "For assertion-reason, judge A and R separately before asking whether R explains A.",
            ],
            [
                "Q3: multiplying the first terms written (x × x²) instead of the highest powers.",
                "Q5: wrong split of the middle term; check that the two numbers multiply to ac.",
                "Q8: writing α² + β² = (α + β)².",
            ],
            "Examiner role-play: students mark each other's answer to Q5 using a 3-mark scheme (factorisation 1, zeroes 1, verification 1).",
            "Covers NCERT Class 10 Ch. 2 Exercises 2.1 and 2.2 and CBSE sample-paper patterns (MCQ, assertion-reason, case-based).",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Polynomials (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From the dining table to the railway yard, the cricket ground and the bakery, you have met degrees, graphs, zeroes and the sum and product rule. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> in board style, including assertion–reason.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Sum of zeroes −b/a, product c/a, and a zero is where the graph meets the x-axis.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Polynomials · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "Which of these is a polynomial?", "options": ["x + 2/x", "√x − 1", "3x² − 5x + √2", "x⁻² + 1"], "answer": 2,
                 "explanation": "3x² − 5x + √2 has whole-number powers 2, 1, 0; √2 is just a constant coefficient. The others have powers −1, 1/2 or −2.", "topic": "What is a polynomial"},
                {"q": "The degree of 7 − 3x² + 2x³ − x is:", "options": ["1", "2", "3", "7"], "answer": 2,
                 "explanation": "The highest power with a non-zero coefficient is 3 (the term 2x³).", "topic": "Degree"},
                {"q": "The zero of the polynomial 4x − 10 is:", "options": ["−5/2", "5/2", "10", "2/5"], "answer": 1,
                 "explanation": "4x − 10 = 0 gives x = 10/4 = 5/2.", "topic": "Zero of a linear polynomial"},
                {"q": "The graph of y = p(x) is a parabola lying completely above the x-axis. The number of zeroes of p(x) is:", "options": ["0", "1", "2", "Cannot be found"], "answer": 0,
                 "explanation": "The graph never meets the x-axis, so p(x) has no zeroes.", "topic": "Geometrical meaning"},
                {"q": "The graph of y = ax² + bx + c opens downwards. Then:", "options": ["a > 0", "a < 0", "c < 0", "b < 0"], "answer": 1,
                 "explanation": "A parabola opens downwards exactly when the coefficient of x², a, is negative.", "topic": "Shape of a parabola"},
                {"q": "The sum and product of the zeroes of 2x² − 8x + 6 are:", "options": ["8 and 6", "4 and 3", "−4 and 3", "4 and −3"], "answer": 1,
                 "explanation": "Sum = −b/a = 8/2 = 4; product = c/a = 6/2 = 3.", "topic": "Zeroes and coefficients"},
                {"q": "If one zero of x² − 6x + k is 2, then k is:", "options": ["4", "6", "8", "−8"], "answer": 2,
                 "explanation": "p(2) = 4 − 12 + k = 0 gives k = 8. (Other zero: sum 6, so it is 4; product 2 × 4 = 8 ✔)", "topic": "Finding a coefficient"},
                {"q": "A quadratic polynomial whose zeroes are 3 and −2 is:", "options": ["x² + x − 6", "x² − x − 6", "x² − x + 6", "x² + 5x − 6"], "answer": 1,
                 "explanation": "Sum = 1 and product = −6, so x² − (1)x + (−6) = x² − x − 6.", "topic": "Forming a quadratic"},
                {"q": "If α and β are the zeroes of x² − 4x + 3, then α² + β² is:", "options": ["10", "16", "22", "7"], "answer": 0,
                 "explanation": "α + β = 4 and αβ = 3, so α² + β² = 16 − 6 = 10. (Zeroes 1 and 3: 1 + 9 = 10 ✔)", "topic": "Symmetric expressions"},
                {"q": "Assertion (A): A cubic polynomial can have at most 3 zeroes. Reason (R): A polynomial of degree n has at most n zeroes.",
                 "options": ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], "answer": 0,
                 "explanation": "Both are true, and A is the case n = 3 of R, so R explains A.", "topic": "Assertion and reason"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q3 catches −b/a sign slips; Q6 catches forgetting to divide by a; Q8 catches the wrong sign of the middle term."],
            "Exit ticket: write a quadratic with zeroes −1 and 5, and sketch which way its graph opens.",
            "Matches NCERT Class 10 Ch. 2 Polynomials learning outcomes (rationalised syllabus).",
        ),
    },
]


def seed_class10_story_polynomials():
    db = SessionLocal()
    try:
        topic = get_class10_topic(db, "Polynomials")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 10 Polynomials (story): {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 10 Polynomials (story): {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class10_story_polynomials()
