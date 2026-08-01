import json
from learning.db import SessionLocal, LearningClass, LearningSubject, LearningTopic, init_db

def seed_number_system_class9():
    init_db()
    
    db = SessionLocal()
    try:
        class_9 = db.query(LearningClass).filter_by(name="Class 9").first()
        if not class_9:
            print("Class 9 not found. Run main seed first.")
            return

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_9.id).first()
        if not math_subject:
            print("Mathematics subject not found.")
            return

        topic_name = "Number Systems"
        topic = db.query(LearningTopic).filter_by(subject_id=math_subject.id, name=topic_name).first()
        if not topic:
            topic = LearningTopic(subject_id=math_subject.id, name=topic_name, order_idx=0, board_type="BOTH")
            db.add(topic)
            db.flush()

        topic.is_wip = False

        config = {
            "parts": [
                {
                    "title": "The Origin of Numbers",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Before we learn about complex number systems, let's travel back in time. Early humans didn't have numbers; they used scratches on bones to count days and animals.</p><p>As civilizations grew, they needed better ways to count. The Egyptians invented symbols for tens and hundreds. But the greatest mathematical revolution in human history came from Ancient India: the invention of <strong>Zero (Shunya)</strong> and the <strong>Base-10 Decimal System</strong>.</p><p>Without Zero as a placeholder, modern math, science, and computers simply could not exist. The number system you learn today is the result of thousands of years of human genius.</p>",
                    "audioText": "Before we learn about complex number systems, let's travel back in time. Early humans didn't have numbers; they used scratches on bones to count days and animals. As civilizations grew, they needed better ways to count. The Egyptians invented symbols for tens and hundreds. But the greatest mathematical revolution in human history came from Ancient India: the invention of Zero and the Base-10 Decimal System. Without Zero, modern math and computers could not exist.",
                    "audioTextHinglish": "Complex numbers seekhne se pehle thoda history me chalte hain. Early humans ke paas numbers nahi the, wo haddiyon par nishaan banakar counting karte the. Jaise jaise civilizations badhi, counting ke naye tareeqe aaye. Par sabse badi mathematical revolution Ancient India se aayi: Zero aur Base-10 Decimal System ka aavishkar. Zero ke bina aaj ki math aur computers exist hi nahi kar sakte.",
                    "keyInsight": "The concept of 'Zero' wasn't just a number; it was a philosophical breakthrough that gave mathematics wings.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Rational World",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Armed with zero, integers, and negative numbers, humans soon needed to measure parts of a whole (like half an apple). A <strong>Rational Number</strong> is any number that can be written in the form <strong>p/q</strong>, where p and q are integers and q is not zero.</p><p>Think of it as a clean fraction. Integers like 5 are rational too, because 5 = 5/1. Even negative numbers like -3/4 are perfectly rational.</p>",
                    "audioText": "Armed with zero, integers, and negative numbers, humans soon needed to measure parts of a whole. A Rational Number is any number that can be written in the form p over q, where p and q are integers and q is not zero. Think of it as a clean fraction.",
                    "audioTextHinglish": "Zero aur integers ke baad, insaano ko cheezon ke hisse napne ki zaroorat padi, jaise aadha seb. Rational Number wo hota hai jise hum p by q ke form me likh sakte hain, jahan q zero nahi hota. Ye ek clean fraction ki tarah hai.",
                    "keyInsight": "If you can write a number as a simple fraction of two integers, it is Rational.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Infinite Density",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>How many numbers exist between 1 and 2? Infinite. But how many rational numbers exist between two fractions, say 1/3 and 1/2? The answer is still <strong>Infinite</strong>!</p><p>By finding a common denominator, we can keep zooming in forever, discovering more and more fractions hidden in between.</p>",
                    "audioText": "How many numbers exist between 1 and 2? Infinite. But how many rational numbers exist between two fractions, say 1 over 3 and 1 over 2? The answer is still Infinite! By finding a common denominator, we can keep zooming in forever, discovering more and more fractions hidden in between.",
                    "audioTextHinglish": "1 aur 2 ke beech kitne numbers hote hain? Infinite. Par do fractions, jaise 1 by 3 aur 1 by 2 ke beech kitne rational numbers hote hain? Jawab abhi bhi Infinite hai! Common denominator nikal kar, hum hamesha zoom in karte reh sakte hain aur beech mein chhupi fractions dhoondh sakte hain.",
                    "keyInsight": "Between any two distinct rational numbers, there are infinitely many rational numbers.",
                    "widgetType": "RationalDensityWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Quest for Precision: Measuring the Incommensurable",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Long ago in ancient Greece, mathematicians believed that the universe was built entirely on whole numbers and their ratios (fractions). To them, numbers were perfect.</p><p>If you wanted to measure a distance, you could always express it as a simple fraction like 3/4 or 17/5. Everything was <strong>rational</strong>.</p><p>But then, they tried to measure the diagonal of a simple 1x1 square. According to Pythagoras' theorem, the diagonal's length is <strong>&radic;2</strong>.</p><p>They tried for years to find a fraction that exactly equaled &radic;2. They failed. Why? Because &radic;2 cannot be written as a fraction. It is <strong>incommensurable</strong>. It was a mathematical scandal that shattered their worldview.</p>",
                    "audioText": "Long ago in ancient Greece, mathematicians believed that the universe was built entirely on whole numbers and their ratios. To them, numbers were perfect. If you wanted to measure a distance, you could always express it as a simple fraction like 3 over 4. Everything was rational. But then, they tried to measure the diagonal of a simple 1 by 1 square. According to Pythagoras' theorem, the diagonal's length is the square root of 2. They tried for years to find a fraction that exactly equaled the square root of 2. They failed. Why? Because it cannot be written as a fraction. It was a mathematical scandal.",
                    "audioTextHinglish": "Bahut pehle ancient Greece mein, mathematicians mante the ki universe sirf whole numbers aur unke ratios se bana hai. Unke liye numbers perfect the. Agar aapko distance measure karni hai, toh aap usse simple fraction me likh sakte ho. Sab kuch rational tha. Par jab unhone 1 by 1 square ka diagonal measure karna chaha, toh Pythagoras theorem ke hisab se length thi root 2. Unhone salon try kiya root 2 ka exact fraction nikalne ka, par fail ho gaye. Kyun? Kyunki root 2 ko fraction me nahi likha ja sakta. Ye ek math scandal tha.",
                    "keyInsight": "Not all numbers can be expressed as a simple fraction p/q. These are called Irrational Numbers.",
                    "widgetType": "HistoryOfIrrationality",
                    "widgetData": {}
                },
                {
                    "title": "The Spiral of Theodorus",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>We know &radic;2 exists in the real world as the diagonal of a 1x1 square. But how do we accurately plot &radic;3 or &radic;5 on a number line?</p><p>The ancient Greeks used a beautiful geometric construction called the <strong>Spiral of Theodorus</strong>. Starting with a right-angled triangle of base 1 and height 1, they formed &radic;2. Using &radic;2 as the new base and a height of 1, they formed &radic;3, and so on!</p>",
                    "audioText": "We know the square root of 2 exists in the real world as the diagonal of a 1 by 1 square. But how do we accurately plot root 3 or root 5 on a number line? The ancient Greeks used a beautiful geometric construction called the Spiral of Theodorus. Starting with a right-angled triangle of base 1 and height 1, they formed root 2. Using root 2 as the new base and a height of 1, they formed root 3, and so on!",
                    "audioTextHinglish": "Hume pata hai ki root 2 real world me exist karta hai 1 by 1 square ke diagonal ke roop me. Par hum number line par root 3 ya root 5 kaise plot karein? Ancient Greeks ne ek khubsoorat geometric construction use ki jise Spiral of Theodorus kehte hain. Ek right-angled triangle, jiska base 1 aur height 1 hai, us se unhone root 2 banaya. Phir root 2 ko naya base aur 1 ko height mankar root 3 banaya, aur yahi silsila chalta raha!",
                    "keyInsight": "Using Pythagoras theorem repeatedly, we can construct the exact length of any square root geometrically.",
                    "widgetType": "SpiralOfTheodorusWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Decimal Identity",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Fractions and roots are just one way to look at numbers. What happens when we convert them into decimals?</p><ul><li><strong>Rational Numbers</strong> either terminate (like 1/2 = 0.5) or repeat a pattern forever (like 1/3 = 0.333...).</li><li><strong>Irrational Numbers</strong> go on forever WITHOUT ever repeating a pattern (like &pi; = 3.14159...).</li></ul>",
                    "audioText": "Fractions and roots are just one way to look at numbers. What happens when we convert them into decimals? Rational Numbers either terminate like 0.5 or repeat a pattern forever like 0.333. Irrational Numbers go on forever without ever repeating a pattern like pi.",
                    "audioTextHinglish": "Fractions aur roots numbers ko dekhne ka ek nazariya hain. Jab hum unhe decimals mein convert karte hain toh kya hota hai? Rational Numbers ya toh terminate ho jate hain jaise 0.5, ya phir ek pattern ko forever repeat karte hain jaise 0.333. Irrational Numbers bina kisi pattern ko repeat kiye hamesha chalte rehte hain, jaise pi.",
                    "keyInsight": "A number's decimal expansion is its ultimate fingerprint. Terminating or repeating = Rational. Non-terminating non-repeating = Irrational.",
                    "widgetType": "DecimalExpansionChecker",
                    "widgetData": {}
                },
                {
                    "title": "Successive Magnification",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Real numbers are dense. To represent a decimal number like 2.665 on a number line, we need to use a magnifying glass.</p><p>First, we look between 2 and 3. Then we zoom in between 2.6 and 2.7. Then between 2.66 and 2.67.</p>",
                    "audioText": "Real numbers are dense. To represent a decimal number like 2.665 on a number line, we need to use a magnifying glass. First, we look between 2 and 3. Then we zoom in between 2.6 and 2.7. Then between 2.66 and 2.67.",
                    "audioTextHinglish": "Real numbers dense hote hain. Number line par 2.665 jaise decimal ko dikhane ke liye, humein ek magnifying glass ki zaroorat hoti hai. Pehle 2 aur 3 ke beech dekhein. Phir 2.6 aur 2.7 ke beech zoom in karein. Aur phir 2.66 aur 2.67 ke beech.",
                    "keyInsight": "No matter how many decimal places a real number has, we can plot it precisely by repeatedly magnifying the number line by a factor of 10.",
                    "widgetType": "SuccessiveMagnificationWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Laws of Surds",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Operating with square roots (surds) follows specific algebraic rules.</p><p><strong>Rule 1:</strong> &radic;a &times; &radic;b = &radic;(ab)<br><strong>Rule 2:</strong> &radic;a / &radic;b = &radic;(a/b)</p><p>However, be careful! &radic;a + &radic;b is NOT &radic;(a+b). You can only add \"like surds\" (e.g., 2&radic;3 + 5&radic;3 = 7&radic;3).</p>",
                    "audioText": "Operating with square roots follows specific algebraic rules. Rule 1: Root a times Root b equals Root of a times b. Rule 2: Root a divided by Root b equals Root of a over b. However, be careful! Root a plus Root b is NOT Root of a plus b. You can only add like surds, for example, 2 root 3 plus 5 root 3 equals 7 root 3.",
                    "audioTextHinglish": "Square roots, yaani surds, ke sath operate karne ke apne rules hote hain. Pehla niyam: Root a into Root b equals Root ab. Doosra: Root a divided by Root b equals Root a by b. Par dhyan rahe! Root a plus Root b, root a plus b ke barabar nahi hota. Aap sirf ek jaisi surds ko add kar sakte hain, jaise 2 root 3 plus 5 root 3 ban jayega 7 root 3.",
                    "keyInsight": "Roots behave exactly like algebraic variables. Treat √2 just like 'x' when adding or subtracting.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Rationalizing the Denominator",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>In mathematics, we hate leaving square roots in the denominator of a fraction. It makes calculations messy.</p><p>To fix this, we <strong>rationalize</strong> the denominator. If the denominator is &radic;a - &radic;b, we multiply both the top and bottom by its conjugate: &radic;a + &radic;b.</p><p>This uses the algebraic identity: (a - b)(a + b) = a&sup2; - b&sup2;, which squares the roots and removes them completely!</p>",
                    "audioText": "In mathematics, we hate leaving square roots in the denominator of a fraction. It makes calculations messy. To fix this, we rationalize the denominator. If the denominator is root a minus root b, we multiply both the top and bottom by its conjugate: root a plus root b. This uses the algebraic identity: a minus b times a plus b equals a squared minus b squared, which squares the roots and removes them completely!",
                    "audioTextHinglish": "Maths mein humein kisi bhi fraction ke denominator me square root chhodna pasand nahi hai. Isse calculations messy ho jati hain. Iska ilaj hai denominator ko rationalize karna. Agar denominator root a minus root b hai, toh upar neeche uske conjugate yani root a plus root b se multiply karein. Ye a minus b into a plus b wali identity use karta hai jisse roots square hokar completely hat jate hain!",
                    "keyInsight": "Rationalizing doesn't change the value of the fraction, it just rewrites it in a cleaner, standard form.",
                    "widgetType": "RationalizerWidget",
                    "widgetData": {}
                },
                {
                    "title": "Fractional Powers",
                    "readingTime": "~2 min read",
                    "narrative": "<p>We know that a&sup2; &times; a&sup3; = a&#x2075;. But what happens when the exponent is a fraction?</p><p>A fractional exponent is just a root in disguise! For example, <strong>a<sup>(1/2)</sup> = &radic;a</strong>, and <strong>a<sup>(1/3)</sup> = &sup3;&radic;a</strong>.</p><p>All the laws of integer exponents you learned in Class 8 apply exactly the same way to fractional exponents.</p>",
                    "audioText": "We know that a squared times a cubed equals a to the power 5. But what happens when the exponent is a fraction? A fractional exponent is just a root in disguise! For example, a to the power 1 over 2 is the square root of a, and a to the power 1 over 3 is the cube root of a. All the laws of integer exponents you learned in Class 8 apply exactly the same way to fractional exponents.",
                    "audioTextHinglish": "Humein pata hai ki a squared into a cubed, a to the power 5 hota hai. Par kya hoga agar exponent ek fraction ho? Ek fractional exponent asal me ek chhipa hua root hota hai! Jaise a to the power half ka matlab square root of a, aur a to the power one by three ka matlab cube root of a. Class 8 me padhe hue exponent ke saare rules fractional exponents par bilkul waise hi apply hote hain.",
                    "keyInsight": "The denominator of a fractional exponent tells you the 'root', and the numerator tells you the 'power'.",
                    "widgetType": None,
                    "widgetData": {}
                }
            ]
        }

        topic.config = json.dumps(config)
        db.commit()
        print("Seeded Class 9 Number Systems successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 9 Number Systems: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_number_system_class9()
