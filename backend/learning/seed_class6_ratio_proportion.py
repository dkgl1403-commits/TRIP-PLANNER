import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Ratio and Proportion (old NCERT Ch. 12 "Ratio and Proportion": comparison by difference and by
# division, ratio in simplest form, same units, equivalent ratios, dividing in a ratio, proportion, extremes and
# means, the unitary method). Story: the Jaipur family from backyard cricket and Papa's railway work through
# Holi colours, Diwali gifts, Mummy's bakery recipes and planning a train trip.
#
# Facts: no real-world statistics are used. All prices, fares, recipes and distances are clearly hypothetical
# ("suppose", "say") and chosen so the arithmetic is clean. Unit facts used: 1 km = 1000 m, 1 m = 100 cm,
# 1 rupee = 100 paise, 1 hour = 60 minutes.


SCENES_1 = [
    scene([
        L("Narrator", "It is Sunday afternoon in Jaipur, and Harsh and Disha are playing cricket in the backyard.",
          "Jaipur mein Itvaar ki dopahar hai, aur Harsh aur Disha aangan mein cricket khel rahe hain."),
        L("Harsh", "Final score! I made 48 runs and Disha made only 16!", "Final score! Maine 48 runs banaaye aur Disha ne sirf 16!"),
    ], {"mode": "compare", "a": 48, "b": 16, "nameA": "Harsh", "nameB": "Disha", "unit": "runs", "show": "diff"}),
    scene([
        L("Harsh", "That means I scored 32 more runs than you.", "Matlab maine tumse 32 runs zyaada banaaye."),
        L("Dadi", "Yes, beta. 48 minus 16 is 32. When we subtract to compare, it is called comparison by difference.",
          "Haan beta. 48 minus 16 barabar 32. Jab hum ghata kar compare karte hain, use comparison by difference kehte hain."),
    ], {"mode": "compare", "a": 48, "b": 16, "nameA": "Harsh", "nameB": "Disha", "unit": "runs", "show": "diff"}),
    scene([
        L("Dadi", "There is another way. How many times does 16 fit into 48? Watch Disha's bar.",
          "Ek aur tareeka hai. 48 mein 16 kitni baar aata hai? Disha ki bar ko dekho."),
        L("Disha", "It fits exactly 3 times! 48 divided by 16 is 3. So Harsh scored 3 times as many runs as me.",
          "Yeh theek 3 baar aati hai! 48 bhaag 16 barabar 3. Toh Harsh ne mujhse 3 guna runs banaaye."),
    ], {"mode": "compare", "a": 48, "b": 16, "nameA": "Harsh", "nameB": "Disha", "unit": "runs", "show": "ratio"}),
    scene([
        L("Dadi", "Comparing by division is called a ratio. We write 48 and 16 with a colon between them, and we read it as 48 is to 16.",
          "Divide karke compare karne ko ratio kehte hain. Hum 48 aur 16 ke beech colon lagaakar likhte hain, aur ise 48 is to 16 padhte hain."),
        L("Dadi", "Divide both by their H C F, which is 16, and you get 3 is to 1. That is the ratio in its simplest form.",
          "Dono ko unke H C F, yaani 16, se divide karo, toh 3 is to 1 milta hai. Yahi ratio ka simplest form hai."),
    ], {"mode": "compare", "a": 48, "b": 16, "nameA": "Harsh", "nameB": "Disha", "unit": "runs", "show": "both"}),
    scene([
        L("Disha", "But why do we need division? The difference is so easy!", "Lekin division ki zaroorat kyon hai? Difference toh itna aasaan hai!"),
        L("Dadi", "Look at these two pairs. 2 and 4 differ by 2. 100 and 102 also differ by 2. Are they the same story?",
          "In do jodiyon ko dekho. 2 aur 4 mein 2 ka fark hai. 100 aur 102 mein bhi 2 ka fark hai. Kya dono ki kahaani ek jaisi hai?"),
        L("Disha", "No! 4 is double of 2, but 102 is almost the same as 100. The ratios 1 is to 2 and 50 is to 51 show that!",
          "Nahi! 4, 2 ka double hai, lekin 102 lagbhag 100 jitna hi hai. Ratios 1 is to 2 aur 50 is to 51 yeh dikhaate hain!"),
    ], {"mode": "pairs", "pairs": [[2, 4], [100, 102]]}),
    scene([
        L("Harsh", "So the ratio of Disha's runs to my runs is also 3 is to 1?", "Toh Disha ke runs ka mere runs se ratio bhi 3 is to 1 hai?"),
        L("Dadi", "No, beta. Order matters! Disha's runs to yours is 16 is to 48, which is 1 is to 3. The first number belongs to the first thing you name.",
          "Nahi beta. Order zaroori hai! Disha ke runs ka tumhaare runs se ratio 16 is to 48 hai, yaani 1 is to 3. Pehla number pehli cheez ka hota hai."),
    ], {"mode": "compare", "a": 16, "b": 48, "nameA": "Disha", "nameB": "Harsh", "unit": "runs", "show": "ratio"}),
    scene([
        L("Dadi", "Your turn! Set the two scores so that Harsh's runs to Disha's runs is 3 is to 2.",
          "Ab aapki baari! Dono scores aise set karo ki Harsh ke runs ka Disha ke runs se ratio 3 is to 2 ho."),
    ], {"mode": "compare", "a": 20, "b": 20, "nameA": "Harsh", "nameB": "Disha", "unit": "runs", "show": "both",
        "task": {"p": 3, "q": 2, "text": "Your turn: make Harsh : Disha = 3 : 2 (for example 30 runs and 20 runs)."}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "On Monday, Papa checks the new railway track being laid near Jaipur.", "Somvaar ko Papa Jaipur ke paas bichh rahe naye railway track ko check karte hain."),
        L("Deepak", "Suppose on Monday the gang laid 2 kilometres of track, and on Tuesday they laid 500 metres.",
          "Maan lo Somvaar ko team ne 2 kilometre track bichhaaya, aur Mangalvaar ko 500 metre."),
    ], {"mode": "units", "a": 2, "ua": "km", "b": 500, "ub": "m", "factor": 1000, "step": 0, "nameA": "Monday", "nameB": "Tuesday"}),
    scene([
        L("Harsh", "Easy! The ratio is 2 is to 500.", "Aasaan! Ratio 2 is to 500 hai."),
        L("Deepak", "Careful, Harsh! One is in kilometres and the other is in metres. That would make Monday look tiny, but Monday did more work!",
          "Dhyaan se, Harsh! Ek kilometre mein hai aur doosra metre mein. Isse Monday chhota dikhega, jabki Monday ko zyaada kaam hua!"),
    ], {"mode": "units", "a": 2, "ua": "km", "b": 500, "ub": "m", "factor": 1000, "step": 0, "nameA": "Monday", "nameB": "Tuesday"}),
    scene([
        L("Deepak", "First make the units the same. 2 kilometres is 2000 metres. Now the ratio is 2000 is to 500.",
          "Pehle units ek jaisi karo. 2 kilometre barabar 2000 metre. Ab ratio 2000 is to 500 hai."),
        L("Disha", "Divide both by 500, and it is 4 is to 1. Monday's work was 4 times Tuesday's!",
          "Dono ko 500 se divide karo, toh 4 is to 1. Monday ka kaam Tuesday ka 4 guna tha!"),
    ], {"mode": "units", "a": 2, "ua": "km", "b": 500, "ub": "m", "factor": 1000, "step": 1, "nameA": "Monday", "nameB": "Tuesday"}),
    scene([
        L("Dadi", "Notice that the answer 4 is to 1 has no unit. A ratio only says how many times. And we only compare quantities of the same kind, like length with length.",
          "Dekho, jawaab 4 is to 1 ki koi unit nahi hai. Ratio sirf batata hai kitne guna. Aur hum sirf ek hi tarah ki cheezein compare karte hain, jaise lambaai se lambaai."),
    ], {"mode": "units", "a": 2, "ua": "km", "b": 500, "ub": "m", "factor": 1000, "step": 1, "nameA": "Monday", "nameB": "Tuesday"}),
    scene([
        L("Neha", "Money works the same way. What is the ratio of 1 rupee to 50 paise?", "Paise bhi aise hi chalte hain. 1 rupaye ka 50 paise se ratio kya hai?"),
        L("Harsh", "1 rupee is 100 paise. So it is 100 is to 50, which is 2 is to 1!", "1 rupaya 100 paise hai. Toh 100 is to 50, yaani 2 is to 1!"),
    ], {"mode": "units", "a": 1, "ua": "rupee", "b": 50, "ub": "paise", "factor": 100, "step": 1, "nameA": "Rupee", "nameB": "Coin"}),
    scene([
        L("Disha", "And time! I flew my kite for 2 hours, and Harsh did homework for only 30 minutes.", "Aur time! Maine 2 ghante patang udaayi, aur Harsh ne sirf 30 minute homework kiya."),
        L("Dadi", "2 hours is 120 minutes. 120 is to 30 is 4 is to 1. Harsh, that ratio should be the other way round!",
          "2 ghante barabar 120 minute. 120 is to 30 yaani 4 is to 1. Harsh, yeh ratio ulta hona chahiye!"),
    ], {"mode": "units", "a": 2, "ua": "hours", "b": 30, "ub": "min", "factor": 60, "step": 1, "nameA": "Kite", "nameB": "Homework"}),
    scene([
        L("Deepak", "Your turn, junior engineer! A train runs for 1 hour. Set its halt in minutes so that the running time to the halt is 4 is to 1.",
          "Ab aapki baari, junior engineer! Ek train 1 ghanta chalti hai. Uska halt minute mein aise set karo ki chalne ke time ka halt se ratio 4 is to 1 ho."),
    ], {"mode": "units", "a": 1, "ua": "hour", "b": 30, "ub": "min", "factor": 60, "step": 1, "nameA": "Running", "nameB": "Halt",
        "task": {"p": 4, "q": 1, "text": "Your turn: set the halt so that running time : halt = 4 : 1."}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "It is Holi morning. Disha is mixing her own pink gulal from red and white powder.", "Holi ki subah hai. Disha laal aur safed powder se apna gulaabi gulal bana rahi hai."),
        L("Disha", "My recipe is 2 spoons of red for every 3 spoons of white. Red to white is 2 is to 3.",
          "Meri recipe hai har 3 chammach safed ke liye 2 chammach laal. Laal ka safed se ratio 2 is to 3."),
    ], {"p": 2, "q": 3, "k": 1}),
    scene([
        L("Harsh", "I need more colour for my friends! I will make two batches. That is 4 red and 6 white.",
          "Mujhe doston ke liye aur rang chahiye! Main do batch banaaunga. Yaani 4 laal aur 6 safed."),
        L("Disha", "And it is exactly the same pink as mine!", "Aur yeh bilkul mere jaisa hi gulaabi hai!"),
    ], {"p": 2, "q": 3, "k": 2}),
    scene([
        L("Dadi", "Three batches make 6 is to 9. The shade never changes, because 2 is to 3, 4 is to 6 and 6 is to 9 are all equal. They are equivalent ratios.",
          "Teen batch se 6 is to 9 banta hai. Rang kabhi nahi badalta, kyunki 2 is to 3, 4 is to 6 aur 6 is to 9 sab barabar hain. Yeh equivalent ratios hain."),
        L("Dadi", "To get an equivalent ratio, multiply both terms by the same number. Just like equivalent fractions!",
          "Equivalent ratio paane ke liye dono terms ko ek hi number se guna karo. Bilkul equivalent fractions ki tarah!"),
    ], {"p": 2, "q": 3, "k": 3}),
    scene([
        L("Harsh", "Shortcut! I will add 1 spoon of each to Disha's recipe. 3 red and 4 white.", "Shortcut! Main Disha ki recipe mein har ek ka 1 chammach aur daal deta hoon. 3 laal aur 4 safed."),
        L("Disha", "Harsh, your pink is darker! Adding the same number does not keep the ratio. Only multiplying or dividing does.",
          "Harsh, tumhaara gulaabi zyaada gehra hai! Ek jaisa number jodne se ratio nahi bachta. Sirf guna ya bhaag karne se bachta hai."),
    ], {"p": 2, "q": 3, "k": 1, "cmp": {"p": 3, "q": 4}}),
    scene([
        L("Neha", "Last year I mixed a big jar with 12 spoons of red and 18 spoons of white. Was it the same pink?",
          "Pichhle saal maine ek bada jar 12 chammach laal aur 18 chammach safed se banaaya tha. Kya woh wahi gulaabi tha?"),
        L("Dadi", "Divide both by their H C F, 6. 12 is to 18 becomes 2 is to 3. Same ratio, same pink! 2 and 3 have no common factor except 1, so 2 is to 3 is the simplest form.",
          "Dono ko unke H C F, 6, se divide karo. 12 is to 18 ban jaata hai 2 is to 3. Wahi ratio, wahi gulaabi! 2 aur 3 ka 1 ke alaawa koi common factor nahi, isliye 2 is to 3 simplest form hai."),
    ], {"p": 2, "q": 3, "k": 6}),
    scene([
        L("Disha", "So to check if two ratios are equivalent, I just bring both to their simplest form?", "Toh do ratios equivalent hain ya nahi, yeh check karne ke liye dono ko simplest form mein laaun?"),
        L("Dadi", "Exactly. 4 is to 6 and 10 is to 15 both become 2 is to 3. So they are equivalent.",
          "Bilkul. 4 is to 6 aur 10 is to 15 dono 2 is to 3 ban jaate hain. Isliye yeh equivalent hain."),
    ], {"p": 2, "q": 3, "k": 2, "cmp": {"p": 10, "q": 15}}),
    scene([
        L("Disha", "Your turn! Mix exactly the same pink using 8 spoons of red and 12 spoons of white.",
          "Ab aapki baari! Bilkul wahi gulaabi 8 chammach laal aur 12 chammach safed se banaao."),
    ], {"p": 1, "q": 1, "k": 1, "task": {"red": 8, "white": 12}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "On Diwali, Disha and Harsh decorate the house with diyas and lights.", "Diwali par Disha aur Harsh diyon aur lights se ghar sajaate hain."),
        L("Dadi", "Disha worked for 3 hours and Harsh for 2 hours. So I will share these 500 rupees between you in the ratio 3 is to 2.",
          "Disha ne 3 ghante kaam kiya aur Harsh ne 2 ghante. Isliye main yeh 500 rupaye tum dono mein 3 is to 2 ke ratio mein baantoongi."),
    ], {"total": 500, "p": 3, "q": 2, "step": 0, "nameA": "Disha", "nameB": "Harsh"}),
    scene([
        L("Harsh", "So Disha gets 3 rupees and I get 2 rupees?", "Toh Disha ko 3 rupaye aur mujhe 2 rupaye milenge?"),
        L("Dadi", "No, beta! 3 is to 2 means 3 parts and 2 parts. That is 5 equal parts in all. 500 divided by 5 is 100, so each part is 100 rupees.",
          "Nahi beta! 3 is to 2 ka matlab 3 hisse aur 2 hisse. Kul milakar 5 barabar hisse. 500 bhaag 5 barabar 100, toh har hissa 100 rupaye ka hai."),
    ], {"total": 500, "p": 3, "q": 2, "step": 1, "nameA": "Disha", "nameB": "Harsh"}),
    scene([
        L("Dadi", "Disha takes 3 parts, which is 300 rupees. Harsh takes 2 parts, which is 200 rupees.",
          "Disha 3 hisse leti hai, yaani 300 rupaye. Harsh 2 hisse leta hai, yaani 200 rupaye."),
    ], {"total": 500, "p": 3, "q": 2, "step": 2, "nameA": "Disha", "nameB": "Harsh"}),
    scene([
        L("Disha", "Let me check. 300 plus 200 is 500, and 300 is to 200 is 3 is to 2. Perfect!",
          "Main check karti hoon. 300 plus 200 barabar 500, aur 300 is to 200 barabar 3 is to 2. Ekdum sahi!"),
        L("Dadi", "Another way to say it. Disha gets 3 fifths of 500, and Harsh gets 2 fifths of 500.",
          "Ise aise bhi keh sakte hain. Disha ko 500 ka 3 bata 5 milta hai, aur Harsh ko 500 ka 2 bata 5."),
    ], {"total": 500, "p": 3, "q": 2, "step": 3, "nameA": "Disha", "nameB": "Harsh"}),
    scene([
        L("Neha", "I share Diwali laddoos the same way. 24 laddoos go to the Sharmas and the Guptas in the ratio 1 is to 2.",
          "Main Diwali ke laddoo bhi aise hi baantti hoon. 24 laddoo Sharma ji aur Gupta ji ke ghar 1 is to 2 ke ratio mein jaate hain."),
        L("Harsh", "1 plus 2 is 3 parts. 24 divided by 3 is 8. So the Sharmas get 8 and the Guptas get 16!",
          "1 plus 2 barabar 3 hisse. 24 bhaag 3 barabar 8. Toh Sharma ji ko 8 aur Gupta ji ko 16!"),
    ], {"total": 24, "p": 1, "q": 2, "step": 3, "nameA": "Sharmas", "nameB": "Guptas", "unit": "laddoos"}),
    scene([
        L("Dadi", "Your turn! Share 60 rupees between Disha and Harsh so that Disha gets 36 rupees. Choose the ratio.",
          "Ab aapki baari! 60 rupaye Disha aur Harsh mein aise baanto ki Disha ko 36 rupaye milein. Ratio chuno."),
    ], {"total": 60, "p": 1, "q": 1, "step": 3, "nameA": "Disha", "nameB": "Harsh", "task": {"total": 60, "a": 36}}, wait=True),
]

SCENES_5 = [
    scene([
        L("Narrator", "A week later, Mummy gets a big cake order for a wedding.", "Ek hafte baad Mummy ko ek shaadi ke liye bade cake ka order milta hai."),
        L("Neha", "My small cake uses 2 cups of sugar for 3 cups of flour. The big cake uses 4 cups of sugar for 6 cups of flour.",
          "Mere chhote cake mein 3 cup maida ke liye 2 cup cheeni lagti hai. Bade cake mein 6 cup maida ke liye 4 cup cheeni."),
    ], {"a": 2, "b": 3, "c": 4, "d": 6, "show": "simplify"}),
    scene([
        L("Dadi", "Both ratios become 2 is to 3 in simplest form, so they are equal. When two ratios are equal, the four numbers are in proportion.",
          "Dono ratios simplest form mein 2 is to 3 bante hain, toh barabar hain. Jab do ratios barabar hon, toh chaaron numbers proportion mein hote hain."),
        L("Dadi", "We say 2 is to 3 as 4 is to 6. In writing, a double colon stands for as.",
          "Hum kehte hain 2 is to 3 as 4 is to 6. Likhte samay double colon ka matlab hai as."),
    ], {"a": 2, "b": 3, "c": 4, "d": 6, "show": "simplify"}),
    scene([
        L("Deepak", "Here is an engineer's quick test. The two outside numbers, 2 and 6, are called the extremes. The two inside numbers, 3 and 4, are called the means.",
          "Yeh raha engineer ka quick test. Bahar ke do numbers, 2 aur 6, extremes kehlaate hain. Andar ke do numbers, 3 aur 4, means kehlaate hain."),
        L("Deepak", "2 times 6 is 12, and 3 times 4 is also 12. When the product of the extremes equals the product of the means, the numbers are in proportion.",
          "2 guna 6 barabar 12, aur 3 guna 4 bhi 12. Jab extremes ka product means ke product ke barabar ho, toh numbers proportion mein hote hain."),
    ], {"a": 2, "b": 3, "c": 4, "d": 6, "show": "cross"}),
    scene([
        L("Harsh", "I tried 6 cups of sugar with 8 cups of flour. Same thing, right?", "Maine 8 cup maide ke saath 6 cup cheeni daali. Wahi baat hai na?"),
        L("Deepak", "Check it. 2 times 8 is 16, but 3 times 6 is 18. Not equal, so not in proportion. Your cake will be too sweet!",
          "Check karo. 2 guna 8 barabar 16, lekin 3 guna 6 barabar 18. Barabar nahi, toh proportion mein nahi. Tumhaara cake bahut meetha hoga!"),
    ], {"a": 2, "b": 3, "c": 6, "d": 8, "show": "both"}),
    scene([
        L("Disha", "Are 30, 40, 45 and 60 in proportion?", "Kya 30, 40, 45 aur 60 proportion mein hain?"),
        L("Dadi", "30 is to 40 is 3 is to 4, and 45 is to 60 is also 3 is to 4. And 30 times 60 is 1800, the same as 40 times 45. So yes!",
          "30 is to 40 barabar 3 is to 4, aur 45 is to 60 bhi 3 is to 4. Aur 30 guna 60 barabar 1800, jitna 40 guna 45. Toh haan!"),
    ], {"a": 30, "b": 40, "c": 45, "d": 60, "show": "both"}),
    scene([
        L("Neha", "Now a puzzle. 3 is to 5 as 12 is to what number?", "Ab ek paheli. 3 is to 5 as 12 is to kaunsa number?"),
        L("Dadi", "Use the test. 3 times the missing number must equal 5 times 12, which is 60. So the missing number is 60 divided by 3.",
          "Test lagaao. 3 guna gaayab number, 5 guna 12 ke barabar hona chahiye, yaani 60. Toh gaayab number hai 60 bhaag 3."),
    ], {"a": 3, "b": 5, "c": 12, "d": 20, "show": "cross", "hideD": True}),
    scene([
        L("Disha", "It is 20! And 12 is to 20 is also 3 is to 5.", "Yeh 20 hai! Aur 12 is to 20 bhi 3 is to 5 hai."),
    ], {"a": 3, "b": 5, "c": 12, "d": 20, "show": "both"}),
    scene([
        L("Neha", "Your turn! Find the number that makes 4 is to 7 as 12 is to that number.", "Ab aapki baari! Woh number dhoondo jisse 4 is to 7 as 12 is to woh number ho."),
    ], {"a": 4, "b": 7, "c": 12, "d": 1, "show": "both", "task": {"a": 4, "b": 7, "c": 12}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "The family is planning a train trip to Udaipur, and Papa is working out the cost.", "Parivaar Udaipur ki train trip plan kar raha hai, aur Papa kharcha nikaal rahe hain."),
        L("Deepak", "Suppose 4 tickets cost 600 rupees. These are made-up fares, just for our sum. How much will 7 tickets cost?",
          "Maan lo 4 tickets 600 rupaye ki hain. Yeh sirf hamare sawaal ke liye maana hua kiraaya hai. 7 tickets kitne ki hongi?"),
    ], {"n": 4, "cost": 600, "m": 7, "step": 0, "label": "tickets"}),
    scene([
        L("Dadi", "First find the cost of one ticket. That is why it is called the unitary method. Unit means one.",
          "Pehle ek ticket ka daam nikaalo. Isiliye ise unitary method kehte hain. Unit ka matlab hai ek."),
        L("Disha", "600 divided by 4 is 150. One ticket costs 150 rupees.", "600 bhaag 4 barabar 150. Ek ticket 150 rupaye ki hai."),
    ], {"n": 4, "cost": 600, "m": 7, "step": 1, "label": "tickets"}),
    scene([
        L("Disha", "Then 7 tickets cost 7 times 150, which is 1050 rupees!", "Toh 7 tickets ka daam 7 guna 150, yaani 1050 rupaye!"),
        L("Dadi", "Shabash! Divide to find one, then multiply to find many.", "Shabash! Ek nikaalne ke liye bhaag karo, phir zyaada nikaalne ke liye guna karo."),
    ], {"n": 4, "cost": 600, "m": 7, "step": 2, "label": "tickets"}),
    scene([
        L("Dadi", "This is proportion in disguise. 4 is to 600 as 7 is to 1050, because 4 times 1050 and 600 times 7 are both 4200.",
          "Yeh chhupa hua proportion hai. 4 is to 600 as 7 is to 1050, kyunki 4 guna 1050 aur 600 guna 7 dono 4200 hain."),
    ], {"n": 4, "cost": 600, "m": 7, "step": 2, "label": "tickets"}),
    scene([
        L("Neha", "For the train journey I am packing laddoos. Suppose 6 laddoos cost 90 rupees. What do 10 cost?",
          "Train safar ke liye main laddoo pack kar rahi hoon. Maan lo 6 laddoo 90 rupaye ke hain. 10 kitne ke honge?"),
        L("Harsh", "One laddoo is 90 divided by 6, which is 15. So 10 laddoos cost 150 rupees!", "Ek laddoo 90 bhaag 6, yaani 15. Toh 10 laddoo 150 rupaye ke!"),
    ], {"n": 6, "cost": 90, "m": 10, "step": 2, "label": "laddoos", "item": "laddoo"}),
    scene([
        L("Harsh", "And backwards? If I have 900 rupees, how many tickets can I buy?", "Aur ulta? Agar mere paas 900 rupaye hon, toh kitni tickets le sakta hoon?"),
        L("Deepak", "Each ticket is 150 rupees, so 900 divided by 150 is 6 tickets.", "Har ticket 150 rupaye ki hai, toh 900 bhaag 150 barabar 6 tickets."),
    ], {"n": 4, "cost": 600, "m": 6, "step": 2, "label": "tickets"}),
    scene([
        L("Deepak", "Your turn! With the same fare, how many tickets can you buy for 1200 rupees?", "Ab aapki baari! Isi kiraaye par, 1200 rupaye mein kitni tickets aayengi?"),
    ], {"n": 4, "cost": 600, "m": 1, "step": 2, "label": "tickets", "task": {"target": 1200}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "On the train to Udaipur, Dadi sets a ratio quiz to pass the time.", "Udaipur jaati train mein, Dadi time bitaane ke liye ratio ka quiz rakhti hain."),
        L("Dadi", "Question 1. Write 36 is to 48 in its simplest form.", "Sawaal 1. 36 is to 48 ko simplest form mein likho."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Harsh", "The H C F of 36 and 48 is 12. 36 divided by 12 is 3, and 48 divided by 12 is 4. So it is 3 is to 4!",
          "36 aur 48 ka H C F 12 hai. 36 bhaag 12 barabar 3, aur 48 bhaag 12 barabar 4. Toh 3 is to 4!"),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. Find the ratio of 75 centimetres to 3 metres.", "Sawaal 2. 75 centimetre ka 3 metre se ratio nikaalo."),
    ], {"example": 1, "step": 0}),
    scene([
        L("Disha", "Same units first. 3 metres is 300 centimetres. 75 is to 300, and dividing both by 75 gives 1 is to 4.",
          "Pehle units ek jaisi. 3 metre barabar 300 centimetre. 75 is to 300, aur dono ko 75 se divide karne par 1 is to 4."),
        L("Dadi", "Shabash, Disha. You did not fall for the trap.", "Shabash, Disha. Tum trap mein nahi phansi."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _share_svg():
    """₹720 split into 9 equal parts of ₹80: 4 parts and 5 parts."""
    parts = ['<svg viewBox="0 0 340 100" width="340" height="100" xmlns="http://www.w3.org/2000/svg">']
    w = 320 / 9
    for i in range(9):
        fill = "#fbbf24" if i < 4 else "#38bdf8"
        parts.append(f'<rect x="{10 + i * w + 1}" y="20" width="{w - 2}" height="36" rx="4" fill="{fill}"/>')
        parts.append(f'<text x="{10 + i * w + w / 2}" y="43" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold" font-family="monospace">80</text>')
    parts.append(f'<text x="{10 + 2 * w}" y="80" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="bold" font-family="sans-serif">4 parts = 320</text>')
    parts.append(f'<text x="{10 + 6.5 * w}" y="80" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold" font-family="sans-serif">5 parts = 400</text>')
    parts.append('</svg>')
    return "".join(parts)


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Backyard Cricket · Comparing by Difference and by Division",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Harsh scores 48 runs and Disha scores 16. Harsh says he scored "32 more"; Dadi shows that he also scored "3 times as many", and that this second way of comparing, by division, is called a ratio.</div>

<h2>Two ways to compare</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Way</th><th class="text-left">Working</th><th class="text-left">We say</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>By difference (subtract)</td><td>48 − 16 = 32</td><td>Harsh scored 32 runs more</td></tr>
    <tr><td>By division (ratio)</td><td>48 ÷ 16 = 3</td><td>Harsh scored 3 times as many</td></tr>
  </tbody>
</table>

<h2>What is a ratio?</h2>
<div {FORMULA}>ratio of a to b = a : b = a/b &nbsp; (read "a is to b")</div>
<div {CARD}>
  <div><strong class="text-amber-300">Terms</strong>: in a : b, a is the first term (antecedent) and b is the second term (consequent).</div>
  <div><strong class="text-sky-300">Simplest form</strong>: divide both terms by their HCF. 48 : 16 → HCF 16 → <strong>3 : 1</strong>.</div>
  <div><strong class="text-emerald-300">Order matters</strong>: Harsh : Disha = 3 : 1, but Disha : Harsh = 1 : 3.</div>
</div>

<h2>Why division tells more</h2>
<p>2 and 4 differ by 2; 100 and 102 also differ by 2. But 2 : 4 = 1 : 2 (one is double the other), while 100 : 102 = 50 : 51 (almost equal). The ratio shows <em>how many times</em>, which the difference cannot.</p>
""",
        "keyInsight": "A ratio compares two quantities by division and tells how many times one is of the other; write it in simplest form and keep the order.",
        "widgetType": "Class6RatioCompareWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "Harsh has 45 marbles and Disha has 30. What is the ratio of Disha's marbles to Harsh's marbles in simplest form?",
            "options": ["3 : 2", "2 : 3", "15 : 1", "30 : 45"],
            "correctIndex": 1,
            "explanation": "Disha : Harsh = 30 : 45. The HCF is 15, so 30 ÷ 15 : 45 ÷ 15 = 2 : 3. (3 : 2 has the order reversed; 30 : 45 is not simplest.)",
        },
        "teacherNotes": teacher(
            [
                "Start with a real pair (two students' heights or scores) and let the class compare both ways before naming 'ratio'.",
                "Use the 2 & 4 vs 100 & 102 pairs: same difference, very different 'times'. This is why we need ratios.",
                "Insist on saying 'a is to b' aloud and always naming the order first: 'boys to girls', 'Harsh to Disha'.",
            ],
            [
                "Reversing the order (writing Disha : Harsh when the question asks Harsh : Disha).",
                "Leaving the ratio unsimplified, or dividing only one term.",
                "Thinking a ratio and a difference give the same information.",
            ],
            "Class survey: count boys and girls, pens and pencils on a bench, etc. Each pair writes three ratios, simplifies them, and swaps the order to see the change.",
            "Old NCERT Class 6 Ch. 12 Ratio and Proportion (12.1 Introduction, 12.2 Ratio).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Papa's Railway Track · Same Units First",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Papa compares the track laid on two days: 2 km and 500 m. Harsh writes 2 : 500, which makes the bigger job look tiny. Papa converts first, and the family does the same with rupees and paise, hours and minutes.</div>

<h2>Rule: same kind, same unit</h2>
<div {FORMULA}>Convert both quantities to the same unit, then divide. A ratio has no unit.</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Compare</th><th class="text-left">Same unit</th><th>Ratio</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>2 km to 500 m</td><td>2000 m : 500 m</td><td class="text-center">4 : 1</td></tr>
    <tr><td>₹1 to 50 paise</td><td>100 paise : 50 paise</td><td class="text-center">2 : 1</td></tr>
    <tr><td>2 hours to 30 minutes</td><td>120 min : 30 min</td><td class="text-center">4 : 1</td></tr>
    <tr><td>75 cm to 3 m</td><td>75 cm : 300 cm</td><td class="text-center">1 : 4</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>Useful conversions: 1 km = 1000 m, 1 m = 100 cm, ₹1 = 100 paise, 1 hour = 60 minutes, 1 kg = 1000 g.</div>
  <div>Only quantities of the <strong>same kind</strong> can be compared by a ratio: length with length, money with money. "5 kg to 3 m" makes no sense.</div>
</div>
""",
        "keyInsight": "Before writing a ratio, change both quantities into the same unit; the ratio itself has no unit.",
        "widgetType": "Class6RatioCompareWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "What is the ratio of 40 minutes to 2 hours?",
            "options": ["20 : 1", "40 : 2", "1 : 3", "3 : 1"],
            "correctIndex": 2,
            "explanation": "2 hours = 120 minutes, so 40 : 120. Dividing both by 40 gives 1 : 3.",
        },
        "teacherNotes": teacher(
            [
                "Show the wrong ratio first (2 : 500) and ask whether Monday really did less work. The surprise makes the rule stick.",
                "Always convert the bigger unit into the smaller one so that both terms are whole numbers.",
                "Point out that after dividing, the unit disappears: 4 : 1 is not '4 metres to 1 metre', just '4 times'.",
            ],
            [
                "Writing the ratio with mixed units (2 : 500).",
                "Wrong conversions (1 hour = 100 minutes, 1 km = 100 m).",
                "Comparing quantities of different kinds.",
            ],
            "Unit relay: write pairs like '3 m and 60 cm' on cards; teams race to convert and simplify (answer 5 : 1).",
            "Old NCERT Class 6 Ch. 12 (12.2 Ratio: same units; Exercise 12.1).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Holi Colours · Equivalent Ratios",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Disha mixes pink gulal with 2 spoons of red for every 3 of white. Harsh makes more batches and gets the same pink; then he "adds one of each" and the colour changes. Mummy's old jar of 12 red and 18 white turns out to be the same recipe.</div>

<h2>Equivalent ratios</h2>
<div {FORMULA}>a : b = (a × k) : (b × k) = (a ÷ k) : (b ÷ k) &nbsp; for any non-zero k</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th>Batches</th><th>Red</th><th>White</th><th>Ratio</th><th>Simplest</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td>1</td><td>2</td><td>3</td><td>2 : 3</td><td>2 : 3</td></tr>
    <tr><td>2</td><td>4</td><td>6</td><td>4 : 6</td><td>2 : 3</td></tr>
    <tr><td>3</td><td>6</td><td>9</td><td>6 : 9</td><td>2 : 3</td></tr>
    <tr><td>6</td><td>12</td><td>18</td><td>12 : 18</td><td>2 : 3</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div><strong class="text-emerald-300">Multiply or divide</strong> both terms by the same number: the ratio stays the same.</div>
  <div><strong class="text-rose-300">Adding</strong> the same number does <em>not</em>: 2 : 3 → 3 : 4 is a different (darker) pink.</div>
  <div><strong class="text-sky-300">To check</strong> whether two ratios are equivalent, write both in simplest form: 4 : 6 = 2 : 3 and 10 : 15 = 2 : 3, so 4 : 6 = 10 : 15.</div>
</div>
<p>A ratio a : b can be written as the fraction a/b, so equivalent ratios behave exactly like equivalent fractions.</p>
""",
        "keyInsight": "Multiplying or dividing both terms by the same number gives an equivalent ratio; adding the same number does not.",
        "widgetType": "Class6RatioMixWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "Which ratio is equivalent to 4 : 5?",
            "options": ["5 : 6", "8 : 9", "12 : 15", "15 : 12"],
            "correctIndex": 2,
            "explanation": "4 × 3 = 12 and 5 × 3 = 15, so 12 : 15 = 4 : 5. 5 : 6 adds 1 to each term, which changes the ratio.",
        },
        "teacherNotes": teacher(
            [
                "Use real or drawn spoons/cups: make one batch, then two, and ask whether the mixture tastes or looks different.",
                "Build a table of batches; students see both columns grow by the same factor.",
                "Connect to equivalent fractions: 2 : 3 is like 2/3, and 4/6 = 2/3.",
            ],
            [
                "Adding the same number to both terms (2 : 3 → 3 : 4) and calling it equivalent.",
                "Multiplying only one term.",
                "Not simplifying both ratios before comparing them.",
            ],
            "Lemonade lab (on paper): a recipe of 1 lemon to 4 glasses of water. Groups scale it for 2, 3 and 5 lemons, then judge Harsh-style 'add one of each' recipes.",
            "Old NCERT Class 6 Ch. 12 (12.2 equivalent ratios, simplest form; Exercise 12.1).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Diwali Gifts · Dividing in a Ratio",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Disha decorated for 3 hours and Harsh for 2, so Dadi shares ₹500 between them in the ratio 3 : 2. Harsh first thinks it means ₹3 and ₹2! Mummy then shares 24 laddoos between two neighbours in the ratio 1 : 2.</div>

<h2>Dividing a quantity in the ratio a : b</h2>
<ol>
  <li>Add the terms: total number of equal parts = a + b.</li>
  <li>Value of one part = total ÷ (a + b).</li>
  <li>First share = a × one part; second share = b × one part.</li>
  <li>Check: the shares add up to the total and simplify to a : b.</li>
</ol>
<div {FORMULA}>First share = a/(a + b) × total &nbsp;&nbsp; Second share = b/(a + b) × total</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Share</th><th>Parts</th><th>One part</th><th>Shares</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td class="text-left">₹500 in 3 : 2</td><td>5</td><td>₹100</td><td>₹300 and ₹200</td></tr>
    <tr><td class="text-left">24 laddoos in 1 : 2</td><td>3</td><td>8</td><td>8 and 16</td></tr>
    <tr><td class="text-left">₹60 in 3 : 2</td><td>5</td><td>₹12</td><td>₹36 and ₹24</td></tr>
  </tbody>
</table>
""",
        "keyInsight": "To divide in the ratio a : b, cut the total into a + b equal parts and give a parts to one and b parts to the other.",
        "widgetType": "Class6RatioShareWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "Divide ₹90 between Harsh and Disha in the ratio 4 : 5. How much does Harsh get?",
            "options": ["₹40", "₹45", "₹50", "₹36"],
            "correctIndex": 0,
            "explanation": "4 + 5 = 9 parts; one part = 90 ÷ 9 = ₹10; Harsh gets 4 × 10 = ₹40 (Disha gets ₹50).",
        },
        "teacherNotes": teacher(
            [
                "Act it out with counters: put them into a + b equal heaps first, then hand out heaps.",
                "Draw a bar model (as in the widget) before any formula.",
                "Always finish with the two checks: sum = total, ratio = a : b.",
            ],
            [
                "Giving 'a rupees and b rupees' (reading the ratio as the actual amounts).",
                "Dividing the total by a and by b separately instead of by a + b.",
                "Forgetting which share belongs to whom (order).",
            ],
            "Fair-share game: give each group 36 counters and a ratio card (1 : 2, 4 : 5, 5 : 7). They share, check and report both amounts.",
            "Old NCERT Class 6 Ch. 12 (12.2 Ratio, examples on division in a ratio; Exercise 12.1).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Mummy's Wedding Cake · Proportion",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Mummy's small cake uses 2 cups of sugar for 3 cups of flour; the big wedding cake uses 4 for 6. The two ratios are equal, so the numbers are in proportion. Papa shows the engineer's test with extremes and means, and Harsh's 6 : 8 cake fails it.</div>

<h2>Proportion</h2>
<div {FORMULA}>If a : b = c : d, then a, b, c, d are in proportion: a : b :: c : d &nbsp; (read "a is to b as c is to d")</div>
<div {CARD}>
  <div><strong class="text-amber-300">Extremes</strong>: the first and fourth terms (a and d).</div>
  <div><strong class="text-sky-300">Means</strong>: the second and third terms (b and c).</div>
  <div><strong class="text-emerald-300">Test</strong>: a : b :: c : d exactly when <strong>a × d = b × c</strong> (product of extremes = product of means).</div>
</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Numbers</th><th>Simplest forms</th><th>Extremes</th><th>Means</th><th>In proportion?</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td class="text-left">2, 3, 4, 6</td><td>2 : 3, 2 : 3</td><td>12</td><td>12</td><td>Yes</td></tr>
    <tr><td class="text-left">2, 3, 6, 8</td><td>2 : 3, 3 : 4</td><td>16</td><td>18</td><td>No</td></tr>
    <tr><td class="text-left">30, 40, 45, 60</td><td>3 : 4, 3 : 4</td><td>1800</td><td>1800</td><td>Yes</td></tr>
  </tbody>
</table>
<h2>Finding a missing term</h2>
<p>3 : 5 :: 12 : x → 3 × x = 5 × 12 = 60 → x = 60 ÷ 3 = <strong>20</strong>. Check: 12 : 20 = 3 : 5 ✔.</p>
<p><strong>Order matters:</strong> 2 : 3 :: 4 : 6 is true, but 2 : 3 :: 6 : 4 is false.</p>
""",
        "keyInsight": "Four numbers are in proportion when the two ratios are equal, which happens exactly when the product of the extremes equals the product of the means.",
        "widgetType": "Class6ProportionWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "Find x if 5 : 8 :: 15 : x.",
            "options": ["12", "18", "24", "40"],
            "correctIndex": 2,
            "explanation": "5 × x = 8 × 15 = 120, so x = 120 ÷ 5 = 24. Check: 15 : 24 = 5 : 8.",
        },
        "teacherNotes": teacher(
            [
                "First check proportion by simplifying both ratios; then introduce extremes and means as a faster test.",
                "Draw the two arcs (outer pair, inner pair) on the board every time.",
                "For missing terms, write the equation 'extremes product = means product' before dividing.",
            ],
            [
                "Mixing up extremes and means.",
                "Changing the order of terms (2 : 3 :: 6 : 4).",
                "Checking only one ratio, or subtracting instead of multiplying.",
            ],
            "Proportion cards: each student gets a number card; they must find three classmates whose numbers, in some order, form a proportion and prove it with the product test.",
            "Old NCERT Class 6 Ch. 12 (12.3 Proportion; Exercise 12.2).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Trip to Udaipur · The Unitary Method",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Planning a train trip, Papa says: suppose 4 tickets cost ₹600 (made-up fares). The family finds the cost of one ticket first, then of 7; Mummy does the same with laddoos, and Harsh works backwards from ₹900.</div>

<h2>The unitary method</h2>
<div {FORMULA}>Step 1: find the value of ONE (divide). &nbsp; Step 2: find the value of MANY (multiply).</div>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Known</th><th>Value of one</th><th>Asked</th><th>Answer</th></tr></thead>
  <tbody class="text-slate-300 text-center">
    <tr><td class="text-left">4 tickets cost ₹600</td><td>600 ÷ 4 = ₹150</td><td>7 tickets</td><td>7 × 150 = ₹1050</td></tr>
    <tr><td class="text-left">6 laddoos cost ₹90</td><td>90 ÷ 6 = ₹15</td><td>10 laddoos</td><td>10 × 15 = ₹150</td></tr>
    <tr><td class="text-left">1 ticket costs ₹150</td><td>-</td><td>tickets for ₹900</td><td>900 ÷ 150 = 6</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>The unitary method is proportion in disguise: 4 : 600 :: 7 : 1050, because 4 × 1050 = 600 × 7 = 4200.</div>
  <div>It works when the quantities grow together at the same rate (twice the tickets, twice the cost).</div>
</div>
""",
        "keyInsight": "Unitary method: divide to find the value of one, then multiply to find the value of as many as you need.",
        "widgetType": "Class6UnitaryWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "If 5 notebooks cost ₹175, how much do 8 notebooks cost?",
            "options": ["₹280", "₹245", "₹350", "₹1400"],
            "correctIndex": 0,
            "explanation": "One notebook = 175 ÷ 5 = ₹35, so 8 notebooks = 8 × 35 = ₹280.",
        },
        "teacherNotes": teacher(
            [
                "Always say the two steps aloud: 'one costs…', 'so many cost…'.",
                "Write the known fact as a sentence with the quantity we want to find at the END ('4 tickets cost ₹600').",
                "Link back to proportion with the product check.",
            ],
            [
                "Multiplying first and dividing later in the wrong order (600 × 7 ÷ 4 is fine; 600 ÷ 7 × 4 is not).",
                "Dividing the wrong way (4 ÷ 600).",
                "Using the method where quantities do not grow together.",
            ],
            "Shopkeeper role-play: one student is a shopkeeper with a price card (for example 3 pens for ₹45); buyers must ask for 1, 5 and 8 pens and work out the bill.",
            "Old NCERT Class 6 Ch. 12 (12.4 Unitary Method; Exercise 12.3).",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · 10 exam-style problems, step by step",
        "readingTime": "~10 min",
        "narrative": f"""
<div {STORY}>On the train to Udaipur, Dadi sets a ratio quiz. Harsh answers fast; Disha watches out for traps.</div>
<h2>Tools that solve almost everything</h2>
<ol>
  <li>Ratio: same units first, then divide both terms by the HCF.</li>
  <li>Equivalent ratios: multiply or divide both terms by the same number.</li>
  <li>Dividing in a : b: one part = total ÷ (a + b).</li>
  <li>Proportion: a : b :: c : d when a × d = b × c.</li>
  <li>Unitary method: find one, then many.</li>
</ol>
<p>Use the question buttons on the right. Try each one in your notebook <em>before</em> revealing the steps.</p>
""",
        "keyInsight": "Same units, simplest form, and the product test: these three habits solve most ratio questions.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Simplest form",
                    "question": "Write 36 : 48 in its simplest form.",
                    "steps": [
                        "HCF of 36 and 48 = 12",
                        "36 ÷ 12 = 3 and 48 ÷ 12 = 4",
                        "36 : 48 = <strong>3 : 4</strong>",
                    ],
                    "answer": "3 : 4",
                },
                {
                    "title": "Same units first",
                    "question": "Find the ratio of 75 cm to 3 m.",
                    "steps": [
                        "3 m = 3 × 100 = 300 cm",
                        "Ratio = 75 : 300",
                        "Divide both by 75: <strong>1 : 4</strong>",
                    ],
                    "answer": "1 : 4",
                },
                {
                    "title": "Finding the other part",
                    "question": "A class has 30 students, of whom 18 are girls. Find the ratio of girls to boys.",
                    "steps": [
                        "Boys = 30 − 18 = 12",
                        "Girls : boys = 18 : 12",
                        "HCF 6: 18 ÷ 6 : 12 ÷ 6 = <strong>3 : 2</strong>",
                    ],
                    "answer": "3 : 2",
                },
                {
                    "title": "Equivalent ratios",
                    "question": "Write two ratios equivalent to 4 : 7.",
                    "steps": [
                        "Multiply both terms by 2: 8 : 14",
                        "Multiply both terms by 3: 12 : 21",
                        "So <strong>8 : 14 and 12 : 21</strong> (any a × k : 7 × k works)",
                    ],
                    "answer": "8 : 14, 12 : 21",
                },
                {
                    "title": "Comparing two ratios",
                    "question": "Which ratio is greater, 2 : 3 or 3 : 4?",
                    "steps": [
                        "Write them as fractions: 2/3 and 3/4",
                        "LCM of 3 and 4 = 12: 2/3 = 8/12, 3/4 = 9/12",
                        "9/12 &gt; 8/12, so <strong>3 : 4 is greater</strong>",
                    ],
                    "answer": "3 : 4",
                },
                {
                    "title": "Dividing in a ratio",
                    "question": "Divide ₹720 between Disha and Harsh in the ratio 4 : 5.",
                    "steps": [
                        "Total parts = 4 + 5 = 9",
                        "One part = 720 ÷ 9 = ₹80",
                        "Disha = 4 × 80 = ₹320, Harsh = 5 × 80 = ₹400",
                        "Check: 320 + 400 = 720 ✔. Answer: <strong>₹320 and ₹400</strong>",
                    ],
                    "answer": "₹320 and ₹400",
                    "figureSvg": _share_svg(),
                },
                {
                    "title": "Checking a proportion",
                    "question": "Are 15, 45, 40, 120 in proportion?",
                    "steps": [
                        "15 : 45 = 1 : 3 and 40 : 120 = 1 : 3",
                        "Extremes: 15 × 120 = 1800; means: 45 × 40 = 1800",
                        "Equal, so <strong>yes, 15 : 45 :: 40 : 120</strong>",
                    ],
                    "answer": "Yes",
                },
                {
                    "title": "Missing term",
                    "question": "Find x if 5 : 8 :: 20 : x.",
                    "steps": [
                        "Product of extremes = product of means: 5 × x = 8 × 20 = 160",
                        "x = 160 ÷ 5 = 32",
                        "Check: 20 : 32 = 5 : 8 ✔. <strong>x = 32</strong>",
                    ],
                    "answer": "32",
                },
                {
                    "title": "Unitary method",
                    "question": "5 pens cost ₹65. What do 12 pens cost?",
                    "steps": [
                        "1 pen = 65 ÷ 5 = ₹13",
                        "12 pens = 12 × 13",
                        "= <strong>₹156</strong>",
                    ],
                    "answer": "₹156",
                },
                {
                    "title": "Unitary method with distance",
                    "question": "A train goes 240 km in 4 hours at a steady speed (a made-up example). How far does it go in 7 hours?",
                    "steps": [
                        "In 1 hour: 240 ÷ 4 = 60 km",
                        "In 7 hours: 7 × 60",
                        "= <strong>420 km</strong>",
                    ],
                    "answer": "420 km",
                },
            ]
        },
        "scenes": SCENES_7,
        "miniChallenge": {
            "question": "Divide 56 sweets in the ratio 3 : 5. What is the bigger share?",
            "options": ["21", "35", "30", "40"],
            "correctIndex": 1,
            "explanation": "3 + 5 = 8 parts; one part = 56 ÷ 8 = 7; bigger share = 5 × 7 = 35 (smaller = 21).",
        },
        "teacherNotes": teacher(
            [
                "Let students attempt each question for two minutes before revealing steps one at a time.",
                "Ask 'what is the first move?' for every question: convert units, find HCF, add the parts, or find one.",
                "Make every answer end with a check (sum, simplest form, or product test).",
            ],
            [
                "Q2: forgetting to convert metres to centimetres.",
                "Q3: using 18 : 30 (girls to total) instead of girls to boys.",
                "Q6: dividing 720 by 4 and by 5 separately.",
            ],
            "Pair-share: one student says the first step, the other finishes; swap for the next question.",
            "Covers old NCERT Class 6 Ch. 12 Exercises 12.1, 12.2 and 12.3.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Ratio and Proportion (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From backyard cricket to the train to Udaipur, you have compared, simplified, shared and scaled. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering ratio, simplest form, same units, equivalent ratios, dividing in a ratio, proportion, extremes and means, and the unitary method.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Same units, simplest form, then compare or scale.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Ratio and Proportion · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "Comparing two quantities by division is called:", "options": ["Difference", "Ratio", "Sum", "Product"], "answer": 1, "explanation": "Comparison by division (how many times) gives a ratio; subtraction gives a difference.", "topic": "What is a ratio"},
                {"q": "The simplest form of 40 : 60 is:", "options": ["4 : 6", "2 : 3", "3 : 2", "20 : 30"], "answer": 1, "explanation": "HCF(40, 60) = 20, so 40 : 60 = 2 : 3.", "topic": "Simplest form"},
                {"q": "The ratio of 50 paise to ₹2 is:", "options": ["50 : 2", "25 : 1", "1 : 4", "4 : 1"], "answer": 2, "explanation": "₹2 = 200 paise, so 50 : 200 = 1 : 4.", "topic": "Same units"},
                {"q": "A class has 40 students and 16 of them are boys. The ratio of girls to boys is:", "options": ["2 : 3", "3 : 2", "2 : 5", "3 : 5"], "answer": 1, "explanation": "Girls = 40 − 16 = 24, so girls : boys = 24 : 16 = 3 : 2.", "topic": "Finding a ratio"},
                {"q": "Which ratio is equivalent to 3 : 4?", "options": ["6 : 8", "4 : 3", "4 : 5", "3 : 8"], "answer": 0, "explanation": "Multiply both terms by 2: 6 : 8. Adding 1 to each (4 : 5) changes the ratio.", "topic": "Equivalent ratios"},
                {"q": "45 marbles are divided in the ratio 2 : 3. The two shares are:", "options": ["15 and 30", "18 and 27", "20 and 25", "9 and 36"], "answer": 1, "explanation": "2 + 3 = 5 parts; one part = 45 ÷ 5 = 9; shares 2 × 9 = 18 and 3 × 9 = 27.", "topic": "Dividing in a ratio"},
                {"q": "In the proportion 3 : 5 :: 9 : 15, the extremes are:", "options": ["3 and 15", "5 and 9", "3 and 5", "9 and 15"], "answer": 0, "explanation": "The extremes are the first and fourth terms, 3 and 15; the means are 5 and 9.", "topic": "Extremes and means"},
                {"q": "Are 4, 6, 10, 15 in proportion?", "options": ["Yes, because 4 × 15 = 6 × 10", "No, because 4 + 15 is not 6 + 10", "No, because 15 is odd", "Only if we write them in a different order"], "answer": 0, "explanation": "Extremes 4 × 15 = 60 and means 6 × 10 = 60 are equal, so 4 : 6 :: 10 : 15 (both are 2 : 3).", "topic": "Proportion"},
                {"q": "Find x if 2 : 7 :: x : 21.", "options": ["3", "6", "14", "42"], "answer": 1, "explanation": "2 × 21 = 7 × x, so 42 = 7x and x = 6. Check: 6 : 21 = 2 : 7.", "topic": "Missing term"},
                {"q": "If 8 bananas cost ₹48, what do 5 bananas cost?", "options": ["₹30", "₹40", "₹24", "₹35"], "answer": 0, "explanation": "One banana = 48 ÷ 8 = ₹6, so 5 bananas = 5 × 6 = ₹30.", "topic": "Unitary method"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q3 catches mixed units; Q4 catches using the total instead of the other part; Q6 catches dividing by each term separately; Q7 catches mixing up extremes and means."],
            "Exit ticket: divide ₹84 in the ratio 3 : 4, and check whether 6, 9, 8, 12 are in proportion.",
            "Matches old NCERT Class 6 Ch. 12 Ratio and Proportion learning outcomes.",
        ),
    },
]


def seed_class6_ratio_proportion():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Ratio and Proportion")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Ratio and Proportion: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Ratio and Proportion: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_ratio_proportion()
