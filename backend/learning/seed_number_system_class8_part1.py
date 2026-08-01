import json
from db import SessionLocal, LearningClass, LearningSubject, LearningTopic

def seed_number_system_class8_part1():
    db = SessionLocal()
    try:
        class_8 = db.query(LearningClass).filter_by(level=8, name="Class 8").first()
        if not class_8:
            return

        math_subject = db.query(LearningSubject).filter_by(name="Mathematics", class_id=class_8.id).first()
        if not math_subject:
            return

        topic_name = "A Story of Numbers"
        topic = db.query(LearningTopic).filter_by(subject_id=math_subject.id, name=topic_name).first()
        if not topic:
            return

        config = {
            "parts": [
                {
                    "title": "The Evolution of Counting",
                    "readingTime": "~2 min read",
                    "narrative": "<p>Early humans only needed to count sheep or apples. They used fingers, creating the <strong>Natural Numbers</strong> (1, 2, 3...).</p><p>But what if you have NO sheep? In ancient India, mathematicians invented a symbol for 'nothing'—Zero. Adding zero gave us the <strong>Whole Numbers</strong> (0, 1, 2, 3...).</p><p>Centuries later, merchants needed a way to record <em>debt</em>. If you owe 5 coins, you have less than zero. This necessity birthed the <strong>Integers</strong> (..., -2, -1, 0, 1, 2...).</p><p>Finally, what if you want to split a single apple between two people? You need to break the number itself. Thus, <strong>Rational Numbers</strong> were born (1/2, -3/4, 5/1). Every time humanity faced a new problem, we invented a new type of number to solve it!</p>",
                    "audioText": "Early humans only needed to count sheep or apples. They used fingers, creating the Natural Numbers. But what if you have NO sheep? In ancient India, mathematicians invented a symbol for 'nothing', Zero. Adding zero gave us the Whole Numbers. Centuries later, merchants needed a way to record debt. If you owe 5 coins, you have less than zero. This necessity birthed the Integers. Finally, what if you want to split a single apple between two people? You need to break the number itself. Thus, Rational Numbers were born. Every time humanity faced a new problem, we invented a new type of number to solve it!",
                    "audioTextHinglish": "Pehle humans sirf sheep ya apples count karte the. Unhone Natural Numbers banaye. Par kya ho agar aapke paas koi sheep na ho? Ancient India mein zero ka aavishkar hua, jisse Whole Numbers bane. Sadiyon baad, udhaar record karne ke liye Integers (jaise minus 5) banaye gaye. Aur aakhir mein, ek apple ko do logo mein baatne ke liye number ko todna pada, jisse Rational Numbers bane. Har nayi problem ke sath humans ne naye numbers invent kiye!",
                    "keyInsight": "Numbers weren't discovered all at once. They evolved as human civilization faced new problems: counting, nothingness, debt, and sharing.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "The Infinite Abyss",
                    "readingTime": "Interactive Widget",
                    "narrative": "<p>A <strong>Rational Number</strong> is any number that can be written as a fraction <em>p/q</em>, where <em>p</em> and <em>q</em> are integers, and <em>q</em> is not zero.</p><p>Because you can always divide a fraction into smaller pieces, there is an incredible secret hiding on the number line: <strong>Between any two rational numbers, there are INFINITELY many other rational numbers.</strong></p><p>Use the Infinite Zoom Line below. Try zooming into the space between 1 and 2. No matter how deep you go, you will never run out of numbers!</p>",
                    "audioText": "A Rational Number is any number that can be written as a fraction p over q, where q is not zero. Because you can always divide a fraction into smaller pieces, there is an incredible secret hiding on the number line: Between any two rational numbers, there are infinitely many other rational numbers. Use the Infinite Zoom Line below to explore this abyss.",
                    "audioTextHinglish": "Rational Number woh hai jise hum p by q ke form mein likh sakte hain. Kyunki hum fraction ko hamesha chote pieces mein divide kar sakte hain, number line par ek secret chupa hai: Kisi bhi do rational numbers ke beech, infinite rational numbers hote hain. Is abyss ko explore karne ke liye Infinite Zoom Line ka use karein.",
                    "keyInsight": "The number line isn't a string of beads. It's a continuous, infinitely dense spectrum.",
                    "widgetType": "InfiniteZoomLineWidget",
                    "widgetData": {}
                },
                {
                    "title": "The Laws of the Universe",
                    "readingTime": "~3 min read",
                    "narrative": "<h3>1. Closure Property</h3><p>If you add, subtract, or multiply two rational numbers, the answer is ALWAYS a rational number. However, division is not closed because dividing by zero is undefined.</p><h3>2. Commutative Property</h3><p>Order doesn't matter for Addition (a+b = b+a) and Multiplication (a&times;b = b&times;a). But it DOES matter for subtraction (a-b &ne; b-a).</p><h3>3. Associative Property</h3><p>Grouping doesn't matter for Addition and Multiplication: a+(b+c) = (a+b)+c.</p><h3>4. Distributive Property</h3><p>The ultimate algebraic weapon: a(b+c) = ab + ac.</p>",
                    "audioText": "Let's look at the mathematical laws. Closure means adding or multiplying two rational numbers always gives a rational number. Commutative means order doesn't matter for addition or multiplication. Associative means grouping doesn't matter. And the Distributive property is your ultimate algebraic weapon.",
                    "audioTextHinglish": "Chaliye mathematical laws dekhte hain. Closure ka matlab hai ki do rational numbers ko add ya multiply karne par hamesha rational number hi milta hai. Commutative ka matlab hai ki addition aur multiplication mein order se fark nahi padta. Associative matlab grouping se fark nahi padta. Aur Distributive property aapka sabse bada mathematical weapon hai.",
                    "keyInsight": "These properties are the 'cheat codes' that let you simplify massive equations instantly.",
                    "widgetType": None,
                    "widgetData": {}
                },
                {
                    "title": "Board Exam Vault: Solved Examples",
                    "readingTime": "Practice",
                    "narrative": "<p>Review these 10 classic board exam problems on Rational Numbers. Pay attention to how the properties are used to simplify calculations.</p>",
                    "audioText": "Review these 10 classic board exam problems on Rational Numbers. Pay attention to how the properties are used to simplify calculations.",
                    "audioTextHinglish": "In 10 classic board exam problems ko dhyan se dekhiye. Notice karein ki calculations ko simplify karne ke liye properties ka use kaise hota hai.",
                    "keyInsight": "Board exams test if you can apply the properties, not just brute-force calculate.",
                    "widgetType": "BoardSolvedExamples",
                    "widgetData": {
                        "examples": [
                            {
                                "year": "NCERT",
                                "q": "Using appropriate properties find: -2/3 \u00d7 3/5 + 5/2 - 3/5 \u00d7 1/6",
                                "steps": [
                                    "Rearrange using Commutative Property: -2/3 \u00d7 3/5 - 3/5 \u00d7 1/6 + 5/2",
                                    "Take common using Distributive Property: 3/5(-2/3 - 1/6) + 5/2",
                                    "Simplify inside bracket: 3/5((-4-1)/6) + 5/2",
                                    "3/5 \u00d7 (-5/6) + 5/2 = -1/2 + 5/2",
                                    "(-1+5)/2 = 4/2 = 2"
                                ]
                            },
                            {
                                "year": "Concept",
                                "q": "Write the additive inverse of -5/9.",
                                "steps": [
                                    "The additive inverse of a number 'a' is '-a' such that a + (-a) = 0.",
                                    "Additive inverse of -5/9 is -(-5/9).",
                                    "This equals 5/9."
                                ]
                            },
                            {
                                "year": "NCERT",
                                "q": "Verify that -(-x) = x for x = 11/15",
                                "steps": [
                                    "The additive inverse of x = 11/15 is -x = -11/15.",
                                    "Since 11/15 + (-11/15) = 0, this means the additive inverse of -11/15 is 11/15.",
                                    "Therefore, -(-11/15) = 11/15.",
                                    "-(-x) = x is verified."
                                ]
                            },
                            {
                                "year": "CBSE 2018",
                                "q": "Find the multiplicative inverse of -13/19.",
                                "steps": [
                                    "The multiplicative inverse (reciprocal) of a number 'a' is '1/a' such that a \u00d7 (1/a) = 1.",
                                    "Multiplicative inverse of -13/19 is -19/13.",
                                    "Check: (-13/19) \u00d7 (-19/13) = 1."
                                ]
                            },
                            {
                                "year": "Concept",
                                "q": "Multiply 6/13 by the reciprocal of -7/16.",
                                "steps": [
                                    "The reciprocal of -7/16 is -16/7.",
                                    "Multiply: (6/13) \u00d7 (-16/7)",
                                    "Numerator: 6 \u00d7 -16 = -96",
                                    "Denominator: 13 \u00d7 7 = 91",
                                    "Result: -96/91"
                                ]
                            },
                            {
                                "year": "NCERT",
                                "q": "Tell what property allows you to compute (1/3 \u00d7 (6 \u00d7 4/3)) as ((1/3 \u00d7 6) \u00d7 4/3).",
                                "steps": [
                                    "The equation changes the grouping of multiplication.",
                                    "a \u00d7 (b \u00d7 c) = (a \u00d7 b) \u00d7 c",
                                    "This is the Associative Property of Multiplication."
                                ]
                            },
                            {
                                "year": "Concept",
                                "q": "Is 8/9 the multiplicative inverse of -1 (1/8)?",
                                "steps": [
                                    "Convert mixed fraction -1 (1/8) to improper fraction: -(8\u00d71 + 1)/8 = -9/8.",
                                    "Check product: (8/9) \u00d7 (-9/8)",
                                    "The product is -1.",
                                    "Since the product is not 1, 8/9 is NOT the multiplicative inverse."
                                ]
                            },
                            {
                                "year": "CBSE 2019",
                                "q": "Find five rational numbers between 2/3 and 4/5.",
                                "steps": [
                                    "Make denominators equal. LCM of 3 and 5 is 15.",
                                    "2/3 = 10/15. 4/5 = 12/15.",
                                    "We only have 11/15 between them. So, multiply by a larger number, say 10.",
                                    "10/15 = 100/150. 12/15 = 120/150.",
                                    "Five rational numbers: 101/150, 102/150, 103/150, 104/150, 105/150."
                                ]
                            },
                            {
                                "year": "Concept",
                                "q": "Represent -5/6 on the number line.",
                                "steps": [
                                    "Draw a number line. Since it is negative, it lies to the left of 0.",
                                    "Since the denominator is 6, divide the distance between 0 and -1 into 6 equal parts.",
                                    "Start from 0 and move 5 parts to the left.",
                                    "Mark the point as -5/6."
                                ]
                            },
                            {
                                "year": "NCERT",
                                "q": "Write five rational numbers which are smaller than 2.",
                                "steps": [
                                    "Number 2 can be written as 2/1.",
                                    "Any integer smaller than 2 is a rational number.",
                                    "1, 0, -1, -2, -3.",
                                    "Or any fraction like 1/2, 3/4, -1/5, etc."
                                ]
                            }
                        ]
                    }
                },
                {
                    "title": "Mastery Quiz",
                    "readingTime": "10 Questions",
                    "narrative": "<p>Test your understanding of Rational Numbers.</p>",
                    "audioText": "Test your understanding of Rational Numbers with this final quiz.",
                    "audioTextHinglish": "Is final quiz se apna knowledge test karein.",
                    "keyInsight": "Self-assessment solidifies concepts.",
                    "widgetType": "MCQEngine",
                    "widgetData": {
                        "questions": [
                            {
                                "q": "Which of the following is NOT a rational number?",
                                "options": ["0", "-5", "2/0", "3.14"],
                                "correct": 2
                            },
                            {
                                "q": "The additive identity for rational numbers is:",
                                "options": ["1", "0", "-1", "Infinity"],
                                "correct": 1
                            },
                            {
                                "q": "The multiplicative identity for rational numbers is:",
                                "options": ["0", "-1", "1", "None of these"],
                                "correct": 2
                            },
                            {
                                "q": "Which property is used in: a(b+c) = ab + ac?",
                                "options": ["Commutative", "Associative", "Closure", "Distributive"],
                                "correct": 3
                            },
                            {
                                "q": "The reciprocal of -3/8 is:",
                                "options": ["3/8", "-8/3", "8/3", "0"],
                                "correct": 1
                            },
                            {
                                "q": "Rational numbers are not closed under:",
                                "options": ["Addition", "Subtraction", "Multiplication", "Division"],
                                "correct": 3
                            },
                            {
                                "q": "How many rational numbers exist between 1 and 2?",
                                "options": ["None", "One", "Ten", "Infinitely many"],
                                "correct": 3
                            },
                            {
                                "q": "Which of these is the multiplicative inverse of 5?",
                                "options": ["-5", "1/5", "0.5", "1"],
                                "correct": 1
                            },
                            {
                                "q": "If x + y = y + x, this represents which property of addition?",
                                "options": ["Closure", "Commutative", "Associative", "Distributive"],
                                "correct": 1
                            },
                            {
                                "q": "What is the product of a rational number and its reciprocal?",
                                "options": ["0", "1", "-1", "Cannot be determined"],
                                "correct": 1
                            }
                        ]
                    }
                }
            ]
        }

        topic.lesson_config_json = json.dumps(config)
        db.commit()
    except Exception as e:
        print(f"Error seeding Class 8 Math Part 1: {e}")
        db.rollback()
    finally:
        db.close()
