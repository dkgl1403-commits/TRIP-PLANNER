import json
from learning.db import SessionLocal, LearningClass, LearningSubject, LearningTopic, init_db

def seed_real_numbers():
    init_db()
    
    db = SessionLocal()
    try:
        class_10 = db.query(LearningClass).filter_by(name="Class 10").first()
        if not class_10:
            print("Class 10 not found. Run main seed first.")
            return

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_10.id).first()
        if not math_subject:
            print("Mathematics subject not found.")
            return

        topic_name = "Real Numbers"
        topic = db.query(LearningTopic).filter_by(subject_id=math_subject.id, name=topic_name).first()
        if not topic:
            topic = LearningTopic(subject_id=math_subject.id, name=topic_name, order_idx=0, board_type="BOTH")
            db.add(topic)
            db.flush()

        # Update it to NOT be work-in-progress
        topic.is_wip = False

        config = {
            "parts": [
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
                    "title": "The Concept of Divisibility",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Before we dive deeper into the abyss of irrational numbers, we need to master the basics of how whole numbers interact with each other.</p><p>Imagine you have 17 chocolates and you want to distribute them equally among 5 friends. How do you do it?</p><p>You give 3 chocolates to each friend (15 total), and you are left with 2 chocolates. In mathematics, this simple act of sharing is formalized.</p><p><strong>Dividend (17) = Divisor (5) &times; Quotient (3) + Remainder (2)</strong></p>",
                    "audioText": "Before we dive deeper into the abyss of irrational numbers, we need to master the basics of how whole numbers interact with each other. Imagine you have 17 chocolates and you want to distribute them equally among 5 friends. You give 3 chocolates to each friend, and you are left with 2 chocolates. In mathematics, this simple act of sharing is formalized as: Dividend equals Divisor times Quotient plus Remainder.",
                    "audioTextHinglish": "Irrational numbers ki gehrai mein jaane se pehle, humein whole numbers ke basics master karne honge. Pucho khud se, agar aapke paas 17 chocolates hain aur 5 doston mein barabar baatni hai, toh kaise karoge? Aap har dost ko 3 chocolates doge (total 15), aur aapke paas 2 chocolates bach jayengi. Maths me iss simple cheez ko aise likhte hain: Dividend equals Divisor into Quotient plus Remainder.",
                    "keyInsight": "Every division process can be written as an equation: a = bq + r. The remainder (r) must always be less than the divisor (b).",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Euclid's Division Lemma",
                    "readingTime": "~3 min read",
                    "narrative": "<p>This formalized concept of division is known as <strong>Euclid's Division Lemma</strong>.</p><p>It states: For any two positive integers <em>a</em> and <em>b</em>, there exist unique integers <em>q</em> and <em>r</em> such that:</p><p class=\"text-center text-3xl font-bold text-neon-purple my-4\">a = bq + r</p><p>Where <strong>0 &le; r &lt; b</strong>.</p><p>While it sounds complicated, it's literally just long division written horizontally! This lemma is incredibly powerful for proving properties of numbers and finding the Highest Common Factor (HCF).</p>",
                    "audioText": "This formalized concept of division is known as Euclid's Division Lemma. It states that for any two positive integers a and b, there exist unique integers q and r such that a equals b times q plus r, where r is between 0 and b. While it sounds complicated, it's literally just long division written horizontally! This lemma is incredibly powerful for finding the Highest Common Factor.",
                    "audioTextHinglish": "Division ke iss formal concept ko Euclid's Division Lemma kehte hain. Iske mutabiq, kisi bhi do positive integers a aur b ke liye, do unique integers q aur r hote hain, jahan a equals bq plus r. Aur remainder r humesha 0 se bada ya barabar, lekin b se chhota hota hai. Sunkar mushkil lagta hai, par asal mein ye bas horizontal long division hai! Ye Highest Common Factor nikalne ke liye bahut powerful tool hai.",
                    "keyInsight": "Euclid's Lemma is the mathematical engine behind finding the Greatest Common Divisor of two numbers efficiently.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Euclid's Division Algorithm Visualizer",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Let's use Euclid's Lemma to find the HCF of two numbers. The algorithm repeats the lemma: you divide the larger number by the smaller one, then you take the divisor and divide it by the remainder, over and over until the remainder is 0!</p><p>Try it yourself below. Enter any two numbers and watch the algorithm break them down step-by-step.</p>",
                    "audioText": "Let's use Euclid's Lemma to find the HCF of two numbers. The algorithm repeats the lemma: you divide the larger number by the smaller one, then you take the divisor and divide it by the remainder, over and over until the remainder is 0! Try it yourself below.",
                    "audioTextHinglish": "Chaliye Euclid's Lemma use karke HCF nikalte hain. Is algorithm mein hum lemma ko repeat karte hain: bade number ko chhote number se divide karo, phir divisor ko remainder se divide karo, tab tak jab tak remainder 0 na aa jaye! Niche widget mein try karein.",
                    "keyInsight": "The last non-zero remainder (or the final divisor when remainder is 0) is the HCF of the two starting numbers.",
                    "widgetType": "EuclidAlgorithmVisualizer",
                    "widgetData": {}
                },
                {
                    "title": "The Fundamental Theorem of Arithmetic",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Now let's look at numbers from a different perspective: multiplication.</p><p>Just like everything in the universe is made of tiny atoms, every number in mathematics is made of <strong>Prime Numbers</strong>.</p><p>The <strong>Fundamental Theorem of Arithmetic</strong> states that every composite number can be expressed as a unique product of primes (apart from the order in which they appear).</p><p>For example, 12 is made of 2 &times; 2 &times; 3. No other combination of primes will ever multiply to 12. It's a unique mathematical fingerprint.</p>",
                    "audioText": "Now let's look at numbers from a different perspective: multiplication. Just like everything in the universe is made of tiny atoms, every number in mathematics is made of Prime Numbers. The Fundamental Theorem of Arithmetic states that every composite number can be expressed as a unique product of primes. For example, 12 is made of 2 times 2 times 3. No other combination of primes will ever multiply to 12. It's a unique mathematical fingerprint.",
                    "audioTextHinglish": "Ab numbers ko multiplication ke perspective se dekhte hain. Jaise universe atoms se bana hai, waise hi mathematics ke saare numbers Prime Numbers se bane hain. Fundamental Theorem of Arithmetic kehti hai ki har composite number ko primes ke unique product me likha ja sakta hai. Jaise 12 banta hai 2 into 2 into 3 se. Koi aur prime combination 12 nahi bana sakti. Ye ek unique mathematical fingerprint hai.",
                    "keyInsight": "Prime numbers are the indivisible building blocks of mathematics. Every number has exactly one unique prime factorization.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Prime Factorization Tree",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>To find the prime fingerprint of a number, we build a <strong>Factor Tree</strong>. We split the number into any two factors, and keep splitting until we are left with only prime \"leaves\".</p><p>Try breaking down the numbers below to discover their atomic prime structure!</p>",
                    "audioText": "To find the prime fingerprint of a number, we build a Factor Tree. We split the number into any two factors, and keep splitting until we are left with only prime leaves. Try breaking down the numbers below to discover their atomic prime structure!",
                    "audioTextHinglish": "Kisi number ka prime fingerprint nikalne ke liye, hum Factor Tree banate hain. Hum number ko do factors me todte hain, aur tab tak todte rehte hain jab tak sirf prime leaves na bach jayein. Niche numbers ko tod kar unka prime structure discover karein!",
                    "keyInsight": "No matter which factors you choose to split first, you will ALWAYS end up with the exact same prime leaves at the bottom.",
                    "widgetType": "PrimeFactorizationTree",
                    "widgetData": {}
                },
                {
                    "title": "Real Life: Cryptography & Prime Numbers",
                    "readingTime": "~2 min read",
                    "narrative": "<p>You might be wondering, \"Why do I care about prime factorization?\"</p><p>Right now, your messages, your banking passwords, and the internet itself are secured by a technology called <strong>RSA Encryption</strong>.</p><p>RSA relies entirely on the fact that multiplying two huge prime numbers together is easy (takes a computer milliseconds), but figuring out which two primes were multiplied to get that huge number (factorizing it) is incredibly hard (would take the world's fastest supercomputers millions of years).</p><p>If someone finds a fast way to factorize numbers, the entire internet's security collapses overnight!</p>",
                    "audioText": "You might be wondering, why do I care about prime factorization? Right now, your messages, banking passwords, and the internet are secured by RSA Encryption. RSA relies on the fact that multiplying two huge primes is easy, but figuring out which two primes were used is incredibly hard. If someone finds a fast way to factorize numbers, internet security collapses overnight!",
                    "audioTextHinglish": "Aap soch rahe honge ki main prime factorization ke baare me kyu padh raha hoon? Abhi is waqt, aapke messages, bank passwords aur internet RSA Encryption se secure hai. RSA iss principle par kaam karta hai ki do bade prime numbers ko multiply karna aasan hai, par unka factorization karna behad mushkil. Agar kisi ne fast factorization ka tareeka dhund liya, toh pure internet ki security khatam ho jayegi!",
                    "keyInsight": "Prime Factorization isn't just theory; it is the literal foundation of modern digital security and cryptography.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Revisiting Irrationality",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Armed with the Fundamental Theorem of Arithmetic, we can finally solve the ancient Greek mystery: proving that &radic;2 is irrational.</p><p>To prove this, we use a brilliant technique called <strong>Proof by Contradiction</strong>.</p><ol><li>First, we <em>assume the opposite</em>: Imagine &radic;2 IS rational. So, &radic;2 = p/q (where p and q are integers with NO common factors).</li><li>Then, we follow the logical math steps.</li><li>If the math leads to an impossible contradiction, our initial assumption must have been completely wrong!</li></ol>",
                    "audioText": "Armed with the Fundamental Theorem of Arithmetic, we can finally solve the ancient Greek mystery: proving that the square root of 2 is irrational. We use a technique called Proof by Contradiction. First, we assume the opposite: Imagine it IS rational. So, root 2 equals p over q, where p and q share no factors. If our math steps lead to an impossible contradiction, our initial assumption must be wrong!",
                    "audioTextHinglish": "Fundamental Theorem of Arithmetic seekhne ke baad, ab hum ancient Greek mystery solve kar sakte hain: root 2 ko irrational prove karna. Iske liye hum Proof by Contradiction use karte hain. Sabse pehle, hum ulta assume karte hain ki root 2 rational hai, matlab p by q ke form me likha ja sakta hai, jahan p aur q ke koi common factors nahi hain. Agar logic follow karte hue hum ek contradiction par pahonch jayein, iska matlab humara assumption galat tha!",
                    "keyInsight": "Proof by contradiction is like playing devil's advocate. Assume the lie, do the math, and watch it logically destroy itself.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Irrationality Proof Explorer",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Let's walk through the exact steps to prove that &radic;2 is irrational. This specific proof is incredibly important and is guaranteed to appear in your board exams.</p><p>Click through the logical steps in the widget below to see how the contradiction unfolds.</p>",
                    "audioText": "Let's walk through the exact steps to prove that the square root of 2 is irrational. This specific proof is incredibly important and is guaranteed to appear in your board exams. Click through the logical steps below to see how the contradiction unfolds.",
                    "audioTextHinglish": "Chaliye root 2 ko irrational prove karne ke exact steps dekhte hain. Ye proof board exams ke liye super important hai aur pakka aayega. Niche widget mein step-by-step logic dekhein ki contradiction kaise unfold hota hai.",
                    "keyInsight": "If p&sup2; is divisible by 2, then p must also be divisible by 2. This prime property is the linchpin of the entire proof.",
                    "widgetType": "IrrationalityProofExplorer",
                    "widgetData": {}
                },
                {
                    "title": "Story of Pi: The Ultimate Irrational",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>While &radic;2 is famously irrational, there is another superstar irrational number: <strong>&pi; (Pi)</strong>.</p><p>Ancient mathematicians, like India's Aryabhata, realized that a perfect curve can never be perfectly captured by straight lines (fractions). To estimate &pi;, Aryabhata calculated the perimeter of a polygon with <strong>384 sides</strong> inscribed in a circle.</p><p>As you increase the sides of the polygon, the approximation gets better, but the decimals go on to infinity without ever repeating. That's what makes &pi; irrational!</p>",
                    "audioText": "While root 2 is famously irrational, there is another superstar irrational number: Pi. Ancient mathematicians, like Aryabhata, realized that a perfect curve can never be perfectly captured by straight lines or fractions. To estimate Pi, he calculated the perimeter of a polygon with 384 sides inscribed in a circle. As you increase the sides, the estimate gets better, but the decimals go on to infinity without ever repeating. That is what makes Pi truly irrational!",
                    "audioTextHinglish": "Jaise root 2 irrational hai, waise hi ek aur superstar irrational number hai: Pi. Aryabhata jaise ancient mathematicians ko samajh aa gaya tha ki ek perfect curve ko straight lines ya fractions se perfectly capture nahi kiya ja sakta. Pi ko estimate karne ke liye unhone ek circle ke andar 384 sides wala polygon banaya. Jaise jaise aap sides badhate hain, estimation better hota hai, par decimals infinity tak bina repeat hue chalte rehte hain. Yahi toh Pi ko irrational banata hai!",
                    "keyInsight": "Pi is the bridge between straight lines and curves. Because curves are continuous, their exact measurement can never be locked down to a neat fraction.",
                    "widgetType": "StoryOfPiWidget",
                    "widgetData": {}
                },
                {
                    "title": "Rational vs Irrational: The Decimal View",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Another way to tell apart rational and irrational numbers is by looking at their decimal expansions.</p><p><strong>Rational Numbers (Fractions)</strong> do one of two things:<br/>1. They <strong>terminate</strong> (e.g., 1/4 = 0.25)<br/>2. They <strong>repeat</strong> endlessly in a pattern (e.g., 1/3 = 0.333... or 1/7 = 0.142857142857...)</p><p><strong>Irrational Numbers</strong> (like &radic;2 or &pi;) do neither! They go on forever, with completely random, non-repeating digits (e.g., 1.41421356...).</p>",
                    "audioText": "Another way to tell apart rational and irrational numbers is by looking at their decimal expansions. Rational Numbers do one of two things: they either terminate, like 0.25, or they repeat endlessly in a pattern, like 0.333. Irrational Numbers, like root 2 or pi, do neither! They go on forever with completely random, non-repeating digits.",
                    "audioTextHinglish": "Rational aur irrational ko pehchanne ka ek aur tareeka hai unka decimal expansion dekhna. Rational numbers ya toh terminate ho jate hain (jaise 0.25), ya fir ek pattern me endlessly repeat hote hain (jaise 0.333). Irrational numbers, jaise root 2 ya pi, dono nahi karte! Wo forever chalte rehte hain bina kisi repeating pattern ke.",
                    "keyInsight": "If a decimal terminates or repeats, it can be written as a fraction. If it's chaotic and endless, it's irrational.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The 2^n &times; 5^m Rule",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Without actually dividing, how can you tell if a rational number (a fraction) will terminate or repeat?</p><p>It all comes down to the denominator and our numbering system! We use base-10, and the prime factors of 10 are exactly <strong>2 and 5</strong>.</p><p>If the denominator of a fraction (in its simplest form) has ONLY 2s and 5s in its prime factorization, it will play nicely with our base-10 system and <strong>terminate</strong>.</p><p>If any other prime (like 3, 7, 11) sneaks into the denominator's factorization, it will cause the decimal to <strong>repeat endlessly</strong>.</p>",
                    "audioText": "Without actually dividing, how can you tell if a fraction will terminate or repeat? It all comes down to the denominator and our base-10 system. The prime factors of 10 are exactly 2 and 5. If the denominator has ONLY 2s and 5s in its prime factorization, it will terminate. If any other prime sneaks in, it will repeat endlessly.",
                    "audioTextHinglish": "Bina divide kiye aap kaise bata sakte hain ki ek fraction terminate hoga ya repeat? Ye sab denominator aur humare base-10 system par depend karta hai. 10 ke prime factors sirf 2 aur 5 hote hain. Agar denominator ke prime factors mein SIRF 2 aur 5 hain, toh fraction terminate hoga. Agar koi aur prime jaise 3 ya 7 aa gaya, toh decimal endlessly repeat karega.",
                    "keyInsight": "Factorize the denominator (q). If q = 2^n * 5^m, the decimal terminates. Otherwise, it's non-terminating repeating.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Decimal Expansion Checker",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Test the 2^n * 5^m rule yourself! Enter different fractions below to instantly see the prime factorization of their denominators and predict their decimal behavior.</p>",
                    "audioText": "Test the rule yourself! Enter different fractions below to instantly see the prime factorization of their denominators and predict their decimal behavior.",
                    "audioTextHinglish": "Iss rule ko khud test karein! Niche alag alag fractions enter karein aur dekhein ki unka denominator kaise factorize hota hai, aur kya wo terminate hoga ya repeat.",
                    "keyInsight": "Always remember to simplify the fraction to its lowest terms BEFORE checking the denominator's prime factors!",
                    "widgetType": "DecimalExpansionChecker",
                    "widgetData": {}
                },
                {
                    "title": "How to Solve Board Exam Questions",
                    "readingTime": "~3 min read",
                    "narrative": "<p>Real Numbers carries solid weightage in the board exam. The questions are highly predictable.</p><h3>Question Types to Master:</h3><ol><li><strong>Finding HCF/LCM:</strong> Use prime factorization. Remember the golden formula: <code>HCF(a,b) &times; LCM(a,b) = a &times; b</code>.</li><li><strong>Proving Irrationality:</strong> The standard 3-mark question. You must memorize the logical flow for proving &radic;2, &radic;3, or &radic;5 are irrational. Do not skip steps.</li><li><strong>Proving Composite Irrationality:</strong> e.g. \"Prove 3 + 2&radic;5 is irrational\". This is actually easier! Assume it equals p/q, isolate &radic;5 on one side, and state the contradiction.</li><li><strong>Decimal Expansion:</strong> Simply factorize the denominator. If it's just 2s and 5s, it terminates.</li></ol>",
                    "audioText": "Real Numbers carries solid weightage in the board exam. The questions are highly predictable. You need to master finding HCF and LCM using prime factorization. Remember the formula: HCF times LCM equals the product of the two numbers. You must also master proving irrationality, which is a guaranteed 3-mark question. Finally, know how to predict decimal expansions by factorizing the denominator.",
                    "audioTextHinglish": "Board exam mein Real Numbers se predictable questions aate hain. Aapko HCF aur LCM nikalna aana chahiye prime factorization se. Golden formula yaad rakhiye: HCF into LCM equals product of numbers. Irrational prove karne wale questions guaranteed aate hain, inke steps memorize kar lein. Aur decimal expansion predict karne ke liye bas denominator ko factorize karna aana chahiye.",
                    "keyInsight": "For 3+2&radic;5, you don't need to prove &radic;5 is irrational from scratch. Assume it's a known fact, isolate it, and show the contradiction.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Board Exam Solved Examples",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Review these step-by-step solutions to actual past paper questions to understand exactly how the examiner expects you to write your answers for full marks.</p>",
                    "audioText": "Review these step-by-step solutions to actual past paper questions to understand exactly how the examiner expects you to write your answers for full marks.",
                    "audioTextHinglish": "Pichle saal ke board exam questions ke step-by-step solutions dekhein, taaki aapko pata chale examiner full marks dene ke liye kaisa answer expect karta hai.",
                    "keyInsight": "Presentation matters. Stating the properties and lemmas explicitly earns you the crucial step-marks.",
                    "widgetType": "BoardSolvedExamples",
                    "widgetData": {
                        "examples": [
                            {
                                "id": 1,
                                "question": "Given that HCF(306, 657) = 9, find LCM(306, 657).",
                                "marks": 2,
                                "year": 2019,
                                "steps": [
                                    "We know the property: HCF(a,b) × LCM(a,b) = a × b",
                                    "Substituting the given values: 9 × LCM(306, 657) = 306 × 657",
                                    "LCM(306, 657) = (306 × 657) / 9",
                                    "LCM = 34 × 657 = 22338",
                                    "Therefore, LCM(306, 657) = 22338"
                                ]
                            },
                            {
                                "id": 2,
                                "question": "Prove that 3 + 2√5 is irrational, given that √5 is irrational.",
                                "marks": 3,
                                "year": 2020,
                                "steps": [
                                    "Let us assume, to the contrary, that 3 + 2√5 is rational.",
                                    "Then we can find coprime integers p and q (q ≠ 0) such that 3 + 2√5 = p/q.",
                                    "Rearranging the equation: 2√5 = (p/q) - 3",
                                    "2√5 = (p - 3q) / q",
                                    "√5 = (p - 3q) / 2q",
                                    "Since p and q are integers, (p - 3q)/2q is rational. This means √5 is rational.",
                                    "But this contradicts the given fact that √5 is irrational.",
                                    "This contradiction has arisen because of our incorrect assumption.",
                                    "Therefore, 3 + 2√5 is irrational."
                                ]
                            },
                            {
                                "id": 3,
                                "question": "Without actually performing long division, state whether 15/1600 will have a terminating decimal expansion.",
                                "marks": 1,
                                "year": 2018,
                                "steps": [
                                    "First, simplify the fraction if possible: 15 / 1600 = 3 / 320",
                                    "Now, prime factorize the denominator (320).",
                                    "320 = 32 × 10 = (2^5) × (2 × 5) = 2^6 × 5^1",
                                    "Since the prime factorization of the denominator is of the form 2^n × 5^m (n=6, m=1),",
                                    "The rational number 15/1600 has a terminating decimal expansion."
                                ]
                            }
                        ]
                    }
                },
                {
                    "title": "Mini Challenge: Real Numbers Checkpoint",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>Time to test your conceptual understanding before the final quiz. Can you spot the irrational numbers?</p>",
                    "audioText": "Time to test your conceptual understanding before the final quiz. Take the mini challenge below.",
                    "audioTextHinglish": "Final quiz se pehle apne concepts test karne ka time aa gaya hai. Niche diya gaya mini challenge complete karein.",
                    "keyInsight": "Be careful! Things like √4 or 22/7 might look irrational or transcendental, but simplify them first!",
                    "widgetType": "MiniChallenge",
                    "widgetData": {
                        "question": "Which of the following is an IRRATIONAL number?",
                        "options": ["√16", "3.14159 (terminating)", "22/7", "√12 / √3", "2 + √3"],
                        "correctAnswer": 4,
                        "explanation": "√16 = 4 (rational). 3.14159 terminates, so it's a fraction (rational). 22/7 is literally a fraction (rational). √12 / √3 = √(12/3) = √4 = 2 (rational). 2 + √3 cannot be simplified and contains a root of a non-perfect square, so it is IRRATIONAL."
                    }
                },
                {
                    "title": "Test Your Might (MCQ)",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>You've mastered Euclid, Prime Factorization, and Irrational proofs. Now face the final test! Here are 10 questions selected from past Board Exams.</p>",
                    "audioText": "You've mastered Euclid, Prime Factorization, and Irrational proofs. Now face the final test! Good luck on these past board exam questions.",
                    "audioTextHinglish": "Aapne saare concepts master kar liye hain. Ab final test ka samay hai! In board exam questions ke liye best of luck.",
                    "keyInsight": "Take your time. Use scratch paper if you need to calculate prime factors.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "id": 1,
                                "text": "The HCF of 135 and 225 is:",
                                "options": ["15", "45", "75", "135"],
                                "correctIdx": 1,
                                "explanation": "225 = 135×1 + 90, 135 = 90×1 + 45, 90 = 45×2 + 0. The last non-zero remainder is 45."
                            },
                            {
                                "id": 2,
                                "text": "If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a,b) is:",
                                "options": ["xy", "xy²", "x³y³", "x²y²"],
                                "correctIdx": 1,
                                "explanation": "HCF is the product of the smallest powers of each common prime factor. Smallest power of x is 1, of y is 2. So, xy²."
                            },
                            {
                                "id": 3,
                                "text": "For some integer m, every even integer is of the form:",
                                "options": ["m", "m + 1", "2m", "2m + 1"],
                                "correctIdx": 2,
                                "explanation": "By definition, an even integer is divisible by 2, so it can be written as 2 multiplied by some integer m."
                            },
                            {
                                "id": 4,
                                "text": "The decimal expansion of the rational number 33/(2² × 5) will terminate after how many decimal places?",
                                "options": ["One", "Two", "Three", "More than three"],
                                "correctIdx": 1,
                                "explanation": "The maximum power between 2² and 5¹ is 2. So it will terminate after 2 decimal places."
                            },
                            {
                                "id": 5,
                                "text": "The LCM of the smallest two-digit composite number and the smallest composite number is:",
                                "options": ["12", "4", "20", "44"],
                                "correctIdx": 2,
                                "explanation": "Smallest composite = 4. Smallest two-digit composite = 10. LCM(4, 10) = 20."
                            },
                            {
                                "id": 6,
                                "text": "Given that HCF(2520, 6600) = 40, LCM(2520, 6600) = 252 × k, then the value of k is:",
                                "options": ["1650", "1600", "165", "1625"],
                                "correctIdx": 0,
                                "explanation": "HCF × LCM = a × b. So, 40 × 252 × k = 2520 × 6600. k = (2520 × 6600) / (40 × 252) = 10 × 165 = 1650."
                            },
                            {
                                "id": 7,
                                "text": "The sum of a rational and an irrational number is always:",
                                "options": ["Rational", "Irrational", "Can be either", "Zero"],
                                "correctIdx": 1,
                                "explanation": "A rational number (terminating/repeating) plus an irrational number (non-terminating non-repeating) always yields a non-terminating non-repeating sum (Irrational)."
                            },
                            {
                                "id": 8,
                                "text": "π (pi) is a:",
                                "options": ["Rational number", "Integer", "Irrational number", "Whole number"],
                                "correctIdx": 2,
                                "explanation": "π cannot be expressed exactly as a fraction p/q. Its decimal expansion is non-terminating and non-repeating."
                            },
                            {
                                "id": 9,
                                "text": "Which of the following rational numbers has a non-terminating repeating decimal expansion?",
                                "options": ["7/8", "13/125", "29/343", "17/16"],
                                "correctIdx": 2,
                                "explanation": "343 = 7³. Since the denominator contains prime factors other than 2 and 5, it is non-terminating repeating."
                            },
                            {
                                "id": 10,
                                "text": "If a is a rational number and b is an irrational number, then a × b is:",
                                "options": ["Rational", "Irrational", "Irrational (if a ≠ 0)", "Rational (if a ≠ 0)"],
                                "correctIdx": 2,
                                "explanation": "If a=0, 0×b=0 (rational). If a≠0, a rational multiplied by an irrational is always irrational."
                            }
                        ]
                    }
                },
                {
                    "title": "Master Cheat Sheet",
                    "readingTime": "Reference",
                    "narrative": "<p>You've completed the chapter! Here is your Master Cheat Sheet for Real Numbers. You can refer to this anytime before your exams.</p>",
                    "audioText": "Congratulations on completing the chapter! Here is your Master Cheat Sheet for Real Numbers.",
                    "audioTextHinglish": "Chapter complete karne par badhai ho! Ye raha aapka Master Cheat Sheet.",
                    "keyInsight": "Screenshot this or copy it into your notes. This is all you need to remember for the board exams.",
                    "widgetType": "RealNumbersCheatSheet",
                    "widgetData": {}
                }
            ]
        }
        
        topic.lesson_config_json = json.dumps(config)
        db.commit()
        print("Successfully seeded Real Numbers 19-part curriculum!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding real numbers: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_real_numbers()
