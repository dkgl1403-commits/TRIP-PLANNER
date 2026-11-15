import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

# Class 6 · Data Handling and Presentation (old NCERT Ch. 9 "Data Handling": collecting and organising data,
# tally marks, pictographs, bar graphs, reading and drawing them with a scale; Ganita Prakash Ch. 4 "Data
# Handling and Presentation": the same plus choosing a scale, infographics and misleading graphs).
# Story: the Jaipur family from a Holi colour survey through a gully cricket match, Mummy's laddoo sales,
# Disha's class survey, Papa's ticket counter and the Sunday newspaper.
#
# Verified facts used:
# - Sachin Tendulkar scored 100 international centuries: 51 in Test matches and 49 in ODIs, and is the only
#   player to reach 100. (Wikipedia, "List of international cricket centuries by Sachin Tendulkar";
#   ICC Hall of Fame page; Tribune India, "Sachin Tendulkar's 100 international centuries: A breakdown in numbers".)
# All other data (colours, runs, laddoos, students, tickets, votes) is made-up story data and is presented as such.


SCENES_1 = [
    scene([
        L("Narrator", "It is the day before Holi in Jaipur. Disha wants to buy gulal for her friends, but which colour should she buy the most?",
          "Jaipur mein Holi se ek din pehle ka din hai. Disha apne doston ke liye gulal khareedna chahti hai, lekin kaunsa rang sabse zyaada khareede?"),
        L("Disha", "I asked 20 friends their favourite Holi colour and wrote every answer on a slip.",
          "Maine 20 doston se unka favourite Holi colour poocha aur har jawaab ek parchi par likh liya."),
    ], {"mode": "raw"}),
    scene([
        L("Dadi", "Beta, these answers are called data. Data is a collection of facts or numbers that we gather to answer a question.",
          "Beta, in jawaabon ko data kehte hain. Data facts ya numbers ka collection hai jo hum kisi sawaal ka jawaab dhoondhne ke liye ikattha karte hain."),
        L("Harsh", "But it is a mess! I cannot tell which colour wins just by looking.",
          "Lekin yeh toh gadbad hai! Sirf dekh kar main nahi bata sakta kaunsa colour jeeta."),
    ], {"mode": "raw"}),
    scene([
        L("Dadi", "So we organise it. Put all the same colours together, in one column each.",
          "Isliye hum ise organise karte hain. Ek jaise saare colours ko ek saath rakho, har ek ki alag column mein."),
        L("Disha", "Now I can see it! Red has the tallest pile.", "Ab mujhe dikh raha hai! Red ka dher sabse ooncha hai."),
    ], {"mode": "sorted"}),
    scene([
        L("Dadi", "Now write the count for each colour in a table. Red 6, Green 4, Yellow 5, Blue 3 and Pink 2.",
          "Ab har colour ki ginti ek table mein likho. Red 6, Green 4, Yellow 5, Blue 3 aur Pink 2."),
        L("Dadi", "The number of times an answer appears is called its frequency. Such a table is a frequency table.",
          "Koi jawaab jitni baar aata hai, use uski frequency kehte hain. Aisi table ko frequency table kehte hain."),
    ], {"mode": "table"}),
    scene([
        L("Harsh", "Let me check. 6 plus 4 plus 5 plus 3 plus 2 is 20. Same as the number of friends!",
          "Main check karta hoon. 6 plus 4 plus 5 plus 3 plus 2 barabar 20. Utne hi jitne dost the!"),
        L("Dadi", "Shabash. The frequencies must always add up to the total. That is a good check that nothing was missed.",
          "Shabash. Frequencies ka total hamesha poore ginti ke barabar hona chahiye. Isse pata chalta hai ki kuch chhoota nahi."),
    ], {"mode": "table", "picked": 0}),
    scene([
        L("Neha", "In my bakery, I also collect data. Every evening I write how many of each sweet I sold, so I know what to make tomorrow.",
          "Meri bakery mein bhi main data ikattha karti hoon. Har shaam likhti hoon ki kaunsi mithaai kitni biki, taaki pata ho kal kya banaana hai."),
    ], {"mode": "sorted"}),
    scene([
        L("Disha", "Your turn! Click the colour that most of my friends like, so I know which gulal to buy the most.",
          "Ab aapki baari! Us colour par click karo jo mere sabse zyaada doston ko pasand hai, taaki mujhe pata chale kaunsa gulal sabse zyaada khareedna hai."),
    ], {"mode": "sorted", "picked": None, "task": {"text": "Click the most popular colour."}}, wait=True),
]

SCENES_2 = [
    scene([
        L("Narrator", "On Sunday morning, Harsh plays gully cricket. Disha keeps the score: how many runs came off each ball.",
          "Itvaar ki subah Harsh gully cricket khelta hai. Disha score rakhti hai: har ball par kitne runs bane."),
        L("Disha", "30 balls! Writing 0, 1, 4, 1, 2 again and again is so confusing.",
          "30 balls! Baar baar 0, 1, 4, 1, 2 likhna bahut confusing hai."),
    ], {"upto": 0}),
    scene([
        L("Dadi", "Use tally marks, beta. For every ball, draw one small line in the row for those runs.",
          "Tally marks use karo, beta. Har ball ke liye, us run wali row mein ek chhoti line kheencho."),
    ], {"upto": 8}),
    scene([
        L("Dadi", "When a row has four lines, the fifth line goes across them. Now every bundle is exactly 5.",
          "Jab kisi row mein chaar lines ho jaayein, toh paanchvi line unke aar paar kheencho. Ab har bundle theek 5 ka hai."),
        L("Harsh", "Like a gate with a bar! I can count them in fives: 5, 10, 15.", "Bilkul gate jaisa! Main inhe paanch paanch karke gin sakta hoon: 5, 10, 15."),
    ], {"upto": 18}),
    scene([
        L("Disha", "All 30 balls are done. Now I just count the marks in each row.", "Saari 30 balls ho gayi. Ab bas har row ke marks gino."),
        L("Dadi", "The count of tally marks is the frequency. 8 dot balls, 9 singles, 5 twos, 5 fours and 3 sixes.",
          "Tally marks ki ginti hi frequency hai. 8 dot balls, 9 singles, 5 twos, 5 fours aur 3 sixes."),
    ], {"upto": 30, "showFreq": True}),
    scene([
        L("Harsh", "How many runs did I score in all?", "Maine kul kitne runs banaaye?"),
        L("Deepak", "Multiply each run value by its frequency. 9 singles make 9, 5 twos make 10, 5 fours make 20 and 3 sixes make 18. That is 57 runs!",
          "Har run value ko uski frequency se guna karo. 9 singles se 9, 5 twos se 10, 5 fours se 20 aur 3 sixes se 18. Kul 57 runs!"),
    ], {"upto": 30, "showFreq": True}),
    scene([
        L("Deepak", "At the railway, we count trains passing a signal with tally marks too. It is quick and you never lose your place.",
          "Railway mein bhi hum signal se guzarne waali trains tally marks se ginte hain. Yeh tez hai aur ginti kabhi nahi bhoolti."),
    ], {"upto": 30, "showFreq": True}),
    scene([
        L("Disha", "Your turn! The next over went 0, 4, 1, 1, 6, 4. Use the plus buttons to tally all six balls.",
          "Ab aapki baari! Agla over aisa gaya: 0, 4, 1, 1, 6, 4. Plus buttons se saari chhe balls ka tally banaao."),
    ], {"stream": [0, 4, 1, 1, 6, 4], "counts": [0, 0, 0, 0, 0], "showFreq": True,
        "task": {"text": "Tally the over: 0, 4, 1, 1, 6, 4.", "target": [1, 2, 0, 2, 1]}}, wait=True),
]

SCENES_3 = [
    scene([
        L("Narrator", "On Friday evening, Mummy looks at her laddoo sales for the week.", "Shukravaar ki shaam Mummy hafte ki laddoo sales dekhti hain."),
        L("Neha", "I want a chart I can stick on the fridge, with pictures instead of numbers.", "Mujhe ek chart chahiye jo fridge par chipka sakoon, numbers ki jagah pictures ke saath."),
    ], {"key": 10}),
    scene([
        L("Dadi", "That is a pictograph. Each picture stands for some number of laddoos. Here, one laddoo picture means 10 laddoos. This is the key.",
          "Ise pictograph kehte hain. Har picture kuch laddoos ke barabar hoti hai. Yahaan ek laddoo ki picture ka matlab 10 laddoo. Yeh key hai."),
        L("Disha", "Monday has 4 pictures, so 4 times 10 is 40 laddoos!", "Monday mein 4 pictures hain, toh 4 guna 10 barabar 40 laddoo!"),
    ], {"key": 10, "highlight": 0}),
    scene([
        L("Harsh", "Tuesday has 2 and a half pictures. Half a laddoo?", "Tuesday mein dhaai pictures hain. Aadha laddoo?"),
        L("Dadi", "Half a picture means half of 10, which is 5. So Tuesday is 20 plus 5, which is 25 laddoos.",
          "Aadhi picture ka matlab 10 ka aadha, yaani 5. Toh Tuesday 20 plus 5, yaani 25 laddoo."),
    ], {"key": 10, "highlight": 1}),
    scene([
        L("Neha", "Wednesday was my best day, 6 pictures. That is 60 laddoos for a wedding order!",
          "Wednesday mera sabse achha din tha, 6 pictures. Yeh 60 laddoo, ek shaadi ke order ke liye!"),
    ], {"key": 10, "highlight": 2}),
    scene([
        L("Harsh", "What if one picture means just 5 laddoos?", "Agar ek picture sirf 5 laddoo ki ho toh?"),
        L("Dadi", "Then Wednesday needs 12 pictures. The rows get very long and take ages to draw.",
          "Toh Wednesday ko 12 pictures chahiye. Rows bahut lambi ho jaati hain aur banaane mein bahut time lagta hai."),
    ], {"key": 5, "highlight": 2}),
    scene([
        L("Disha", "And if one picture means 20, Tuesday becomes one picture and a little quarter. That is hard to draw and hard to read!",
          "Aur agar ek picture 20 ki ho, toh Tuesday ek picture aur ek chhota sa chauthaai ban jaata hai. Woh banaana bhi mushkil aur padhna bhi!"),
        L("Dadi", "So choose a key that keeps the pictures few and easy, like 10 here. And always write the key on the chart.",
          "Isliye aisi key chuno jisse pictures kam aur aasaan rahein, jaise yahaan 10. Aur key hamesha chart par likho."),
    ], {"key": 20, "highlight": 1}),
    scene([
        L("Neha", "Your turn! On Saturday I sold 45 laddoos. With the key of 10, draw Saturday's row.",
          "Ab aapki baari! Saturday ko maine 45 laddoo beche. Key 10 rakh kar Saturday ki row banaao."),
    ], {"labels": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "values": [40, 25, 60, 35, 50, 0], "key": 10,
        "highlight": 5, "task": {"text": "Make Saturday show 45 laddoos (key 10).", "row": 5, "value": 45, "key": 10}}, wait=True),
]

SCENES_4 = [
    scene([
        L("Narrator", "On Monday, Disha's teacher asks the class how each student comes to school.",
          "Somvaar ko Disha ki teacher class se poochti hain ki har bachcha school kaise aata hai."),
        L("Disha", "I drew a bar graph. Each bar stands for one way of coming, and its height shows how many students.",
          "Maine ek bar graph banaaya. Har bar aane ka ek tareeka hai, aur uski height batati hai kitne students."),
    ], {}),
    scene([
        L("Dadi", "Look at the side. Each line on this axis is 2 more students. That is the scale: 1 unit means 2 students.",
          "Side mein dekho. Is axis par har line 2 aur students hai. Yahi scale hai: 1 unit matlab 2 students."),
        L("Dadi", "All bars have the same width and equal gaps. Only the height carries the information.",
          "Saari bars ki chaudaai same hai aur gaps barabar hain. Sirf height mein jaankaari hai."),
    ], {}),
    scene([
        L("Harsh", "The bus bar is the tallest, 15 students. The car bar is the shortest, only 4.",
          "Bus wali bar sabse oonchi hai, 15 students. Car wali bar sabse chhoti, sirf 4."),
    ], {"highlight": [2, 3]}),
    scene([
        L("Disha", "How many more come by bus than walk?", "Bus se kitne zyaada aate hain paidal waalon se?"),
        L("Dadi", "15 minus 12 is 3. Three more students come by bus.", "15 minus 12 barabar 3. Teen students zyaada bus se aate hain."),
    ], {"highlight": [0, 2]}),
    scene([
        L("Deepak", "And how many students in all? Add the bars. 12 plus 8 plus 15 plus 4 plus 6 is 45.",
          "Aur kul kitne students? Saari bars jodo. 12 plus 8 plus 15 plus 4 plus 6 barabar 45."),
    ], {}),
    scene([
        L("Dadi", "To draw a bar graph: draw two axes, label them, choose a scale, then draw each bar to the right height. And give it a title!",
          "Bar graph banaane ke liye: do axes kheencho, unpar label lagaao, scale chuno, phir har bar sahi height tak banaao. Aur ek title do!"),
    ], {"values": [0, 0, 0, 0, 0]}),
    scene([
        L("Disha", "Your turn! In section B, 10 walk, 6 cycle, 14 come by bus, 2 by car and 8 by auto. Drag the bars to draw it.",
          "Ab aapki baari! Section B mein 10 paidal, 6 cycle, 14 bus, 2 car aur 8 auto se aate hain. Bars ko drag karke graph banaao."),
    ], {"title": "Section B: how we come to school", "values": [0, 0, 0, 0, 0],
        "task": {"text": "Drag: Walk 10, Cycle 6, Bus 14, Car 2, Auto 8.", "values": [10, 6, 14, 2, 8]}}, wait=True),
]

TICKETS = {"title": "Tickets sold at the counter", "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"], "values": [120, 150, 90, 180, 210],
           "xLabel": "Day", "yLabel": "Tickets", "scales": [1, 5, 10, 25, 50, 100]}

SCENES_5 = [
    scene([
        L("Narrator", "Papa brings home the ticket sales of his station counter for one week.", "Papa apne station counter ki ek hafte ki ticket sales ghar laate hain."),
        L("Deepak", "Monday 120, Tuesday 150, Wednesday 90, Thursday 180 and Friday 210 tickets. Let us make a bar graph.",
          "Monday 120, Tuesday 150, Wednesday 90, Thursday 180 aur Friday 210 tickets. Chalo bar graph banaate hain."),
    ], {**TICKETS, "scale": 10}),
    scene([
        L("Harsh", "Easy! One unit for one ticket, just like before.", "Aasaan! Ek unit ek ticket ke liye, pehle jaisa."),
        L("Disha", "Harsh, the graph only goes up to 10! Every bar shoots off the top.", "Harsh, graph toh sirf 10 tak jaata hai! Har bar upar se bahar nikal gayi."),
    ], {**TICKETS, "scale": 1}),
    scene([
        L("Dadi", "When the numbers are big, one unit must stand for many. With 1 unit for 10 tickets the top is 100. Still too small!",
          "Jab numbers bade hon, toh ek unit ko kai cheezon ke barabar rakho. 1 unit 10 tickets ke liye ho toh top 100 hai. Abhi bhi chhota!"),
    ], {**TICKETS, "scale": 10}),
    scene([
        L("Harsh", "Then 1 unit for 100 tickets! Everything fits now.", "Toh 1 unit 100 tickets ke liye! Ab sab fit ho gaya."),
        L("Disha", "But the bars are so short, I cannot see the difference between Monday and Tuesday.", "Lekin bars itni chhoti hain, Monday aur Tuesday ka farak dikhta hi nahi."),
    ], {**TICKETS, "scale": 100}),
    scene([
        L("Dadi", "A good scale makes the tallest bar fit, but still fill most of the graph. Look at the largest value, 210, and pick a scale that is easy to count in.",
          "Achha scale woh hai jisme sabse oonchi bar fit ho, lekin graph ka zyaada hissa bhare. Sabse bada number dekho, 210, aur aisa scale chuno jisme ginna aasaan ho."),
    ], {**TICKETS, "scale": 50}),
    scene([
        L("Deepak", "We engineers use scales all the time. A track map of 1 centimetre for 1 kilometre fits a long line on one sheet.",
          "Hum engineers hamesha scales use karte hain. 1 centimetre barabar 1 kilometre wala track map ek lambi line ko ek hi kaagaz par fit kar deta hai."),
    ], {**TICKETS, "scale": 50}),
    scene([
        L("Deepak", "Your turn! Choose a scale so that every bar fits and the tallest bar reaches more than halfway up.",
          "Ab aapki baari! Aisa scale chuno ki har bar fit ho aur sabse oonchi bar aadhe se zyaada upar tak pahunche."),
    ], {**TICKETS, "scale": 1, "task": {"text": "Pick a scale: all bars fit, tallest bar more than halfway up.", "fitScale": True}}, wait=True),
]

SCENES_6 = [
    scene([
        L("Narrator", "On Sunday, the family reads the newspaper together. A colourful picture about cricket catches Harsh's eye.",
          "Itvaar ko poora parivaar saath mein akhbaar padhta hai. Cricket ki ek rangeen picture Harsh ki nazar mein aati hai."),
        L("Harsh", "Sachin Tendulkar scored 100 international centuries! 51 in Test matches and 49 in one day matches.",
          "Sachin Tendulkar ne 100 international centuries banaayi! 51 Test matches mein aur 49 one day matches mein."),
    ], {"mode": "infographic"}),
    scene([
        L("Dadi", "This is an infographic. It mixes pictures, colours and numbers so you understand the data in one look.",
          "Yeh infographic hai. Isme pictures, colours aur numbers mile hote hain taaki data ek nazar mein samajh aa jaaye."),
        L("Disha", "And 51 plus 49 is exactly 100, so the grid of 100 balls is full!", "Aur 51 plus 49 theek 100 hai, isliye 100 balls wala grid poora bhara hai!"),
    ], {"mode": "infographic"}),
    scene([
        L("Harsh", "Look at my class monitor poster. I got 52 votes and Rohan got 48. My bar is three times taller!",
          "Mere class monitor ka poster dekho. Mujhe 52 votes mile aur Rohan ko 48. Meri bar teen guna oonchi hai!"),
        L("Dadi", "Look at the axis, Harsh. It starts at 46, not at 0. That trick makes a small difference look huge.",
          "Axis dekho, Harsh. Yeh 46 se shuru hota hai, 0 se nahi. Is chaalaaki se chhota farak bahut bada dikhta hai."),
    ], {"mode": "baseline", "from0": False}),
    scene([
        L("Dadi", "Start the axis at 0, and the truth appears. 52 and 48 are only 4 votes apart.",
          "Axis ko 0 se shuru karo, aur sach saamne aa jaata hai. 52 aur 48 mein sirf 4 votes ka farak hai."),
    ], {"mode": "baseline", "from0": True}),
    scene([
        L("Neha", "Advertisements play this trick with pictures too. My sales went from 100 to 200 laddoos, so someone drew a laddoo twice as wide and twice as tall.",
          "Advertisements pictures ke saath bhi yeh chaal chalte hain. Meri sales 100 se 200 laddoo hui, toh kisi ne laddoo do guna chauda aur do guna ooncha bana diya."),
        L("Disha", "But then it covers 4 times the space. It looks like 4 times the sales, not 2 times!",
          "Lekin phir woh 4 guna jagah gherta hai. Yeh 4 guna sales jaisa dikhta hai, 2 guna nahi!"),
    ], {"mode": "icons", "honest": False}),
    scene([
        L("Dadi", "The honest way is two laddoos of the same size. Always check the axis, the scale and the key before you believe a graph.",
          "Imaandaar tareeka hai ek hi size ke do laddoo. Kisi graph par bharosa karne se pehle hamesha axis, scale aur key check karo."),
    ], {"mode": "icons", "honest": True}),
    scene([
        L("Dadi", "Your turn! Make the class monitor graph honest again.", "Ab aapki baari! Class monitor wale graph ko phir se imaandaar banaao."),
    ], {"mode": "baseline", "from0": False, "task": {"text": "Fix the graph so it tells the truth."}}, wait=True),
]

SCENES_7 = [
    scene([
        L("Narrator", "After dinner, Dadi sets a data handling quiz at the dining table.", "Dinner ke baad Dadi dining table par data handling ka quiz rakhti hain."),
        L("Dadi", "Question 1. Make a tally table for these marks out of 10 and find the most common mark.",
          "Sawaal 1. Das mein se in marks ki tally table banaao aur sabse zyaada aane wala mark dhoondho."),
    ], {"example": 0, "step": 0}),
    scene([
        L("Disha", "I tally each mark. 7 comes 4 times, more than any other, so 7 is the most common mark.",
          "Main har mark ka tally banaati hoon. 7 chaar baar aata hai, kisi aur se zyaada, toh 7 sabse common mark hai."),
    ], {"example": 0, "step": 3}),
    scene([
        L("Dadi", "Question 2. In a pictograph, one tree picture means 50 trees. A village has 3 and a half pictures. How many trees?",
          "Sawaal 2. Ek pictograph mein ek ped ki picture matlab 50 ped. Ek gaon ki saadhe teen pictures hain. Kitne ped?"),
    ], {"example": 1, "step": 0}),
    scene([
        L("Harsh", "3 pictures make 150 trees. Half a picture is 25 more. So 175 trees!",
          "3 pictures se 150 ped. Aadhi picture 25 aur. Toh 175 ped!"),
        L("Dadi", "Shabash, Harsh.", "Shabash, Harsh."),
    ], {"example": 1, "step": 3}),
    scene([
        L("Dadi", "Now practise on your own. Pick any question from 3 to 10, try it in your notebook first, then press show step to check.",
          "Ab khud practice karo. 3 se 10 tak koi bhi sawaal chuno, pehle notebook mein try karo, phir show step dabaakar check karo."),
    ], {"example": 2, "step": 0}),
]


def _bar_svg(labels, values, top, step, unit=""):
    """Small static bar graph for worked examples (viewBox 320 x 200)."""
    x0, x1, base, ph = 40, 310, 170, 140
    slot = (x1 - x0) / len(labels)
    parts = [f'<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;width:100%">',
             f'<rect width="320" height="200" fill="#020617"/>']
    v = 0
    while v <= top:
        y = base - v / top * ph
        parts.append(f'<line x1="{x0}" y1="{y:.1f}" x2="{x1}" y2="{y:.1f}" stroke="#1e293b"/>')
        parts.append(f'<text x="{x0 - 5}" y="{y + 4:.1f}" text-anchor="end" fill="#94a3b8" font-size="10" font-family="monospace">{v}</text>')
        v += step
    parts.append(f'<line x1="{x0}" y1="{base}" x2="{x1}" y2="{base}" stroke="#e2e8f0" stroke-width="2"/>')
    parts.append(f'<line x1="{x0}" y1="{base}" x2="{x0}" y2="{base - ph - 5}" stroke="#e2e8f0" stroke-width="2"/>')
    for i, (lab, val) in enumerate(zip(labels, values)):
        cx = x0 + slot * (i + 0.5)
        h = val / top * ph
        parts.append(f'<rect x="{cx - slot * 0.3:.1f}" y="{base - h:.1f}" width="{slot * 0.6:.1f}" height="{h:.1f}" fill="#38bdf8"/>')
        parts.append(f'<text x="{cx:.1f}" y="{base + 15}" text-anchor="middle" fill="#e2e8f0" font-size="11" font-family="sans-serif">{lab}</text>')
    parts.append('</svg>')
    return "".join(parts)


PARTS = [
    # ─────────────────────────────── Part 1 ───────────────────────────────
    {
        "title": "Story 1: Holi Colours · Collecting and Organising Data",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Before Holi, Disha asks 20 friends their favourite colour. The slips are a jumble until Dadi shows her how to sort them and make a frequency table.</div>

<h2>What is data?</h2>
<p><strong>Data</strong> is a collection of numbers or facts gathered to answer a question. Examples: the marks of a class, runs scored off each ball, the favourite colours of friends, the daily temperature.</p>

<h2>Organising data</h2>
<p>Raw data (in the order it was collected) is hard to read. We <strong>organise</strong> it by grouping the same values together and counting each group.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Colour</th><th>Number of friends (frequency)</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Red</td><td class="text-center">6</td></tr>
    <tr><td>Green</td><td class="text-center">4</td></tr>
    <tr><td>Yellow</td><td class="text-center">5</td></tr>
    <tr><td>Blue</td><td class="text-center">3</td></tr>
    <tr><td>Pink</td><td class="text-center">2</td></tr>
    <tr class="text-emerald-300"><td>Total</td><td class="text-center">20</td></tr>
  </tbody>
</table>
<div {FORMULA}>Frequency = number of times a value occurs · Sum of frequencies = total number of observations</div>
<div {CARD}>
  <div>Before collecting, decide the <strong>question</strong> and what exactly to record.</div>
  <div>Each value or fact recorded is called an <strong>observation</strong>.</div>
  <div>Always check: the frequencies must add up to the total number of observations.</div>
</div>
""",
        "keyInsight": "Data only starts to talk when you group the same values together and count them.",
        "widgetType": "Class6DataSortWidget",
        "widgetData": {},
        "scenes": SCENES_1,
        "miniChallenge": {
            "question": "In a frequency table of 30 students' favourite fruits, the frequencies are Mango 12, Apple 7, Banana 5 and Grapes. How many chose Grapes?",
            "options": ["5", "6", "7", "24"],
            "correctIndex": 1,
            "explanation": "The frequencies add up to 30. 12 + 7 + 5 = 24, so Grapes = 30 − 24 = 6.",
        },
        "teacherNotes": teacher(
            [
                "Start with a live class question (favourite sweet, month of birthday) and write raw answers on the board in the order given.",
                "Ask 'which is most popular?' while the data is still raw, so students feel the need to organise.",
                "Introduce the word frequency only after students have counted the groups themselves.",
            ],
            [
                "Missing or double counting answers; always check the total.",
                "Confusing the value (Red) with its frequency (6).",
                "Collecting data without first fixing the question.",
            ],
            "Class survey: each row asks the class one question, records raw answers, then makes a frequency table and checks the total.",
            "Old NCERT Ch. 9 (9.1 introduction, 9.2 recording data, 9.3 organisation of data); Ganita Prakash Ch. 4 (collecting and organising data).",
        ),
    },
    # ─────────────────────────────── Part 2 ───────────────────────────────
    {
        "title": "Story 2: Gully Cricket · Tally Marks",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Disha keeps the score in Harsh's gully cricket match. With 30 balls to record, Dadi teaches her tally marks: one stroke per ball, bundled in fives.</div>

<h2>Tally marks</h2>
<p>For each observation, draw one stroke | in its row. The <strong>fifth</strong> stroke is drawn across the first four, making a bundle of 5. Bundles make counting fast: 5, 10, 15, …</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Runs off a ball</th><th class="text-left">Tally marks</th><th>Frequency</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>0</td><td><span style="text-decoration:line-through">||||</span> |||</td><td class="text-center">8</td></tr>
    <tr><td>1</td><td><span style="text-decoration:line-through">||||</span> ||||</td><td class="text-center">9</td></tr>
    <tr><td>2</td><td><span style="text-decoration:line-through">||||</span></td><td class="text-center">5</td></tr>
    <tr><td>4</td><td><span style="text-decoration:line-through">||||</span></td><td class="text-center">5</td></tr>
    <tr><td>6</td><td>|||</td><td class="text-center">3</td></tr>
    <tr class="text-emerald-300"><td>Total</td><td></td><td class="text-center">30</td></tr>
  </tbody>
</table>
<div {FORMULA}>Total runs = 0 × 8 + 1 × 9 + 2 × 5 + 4 × 5 + 6 × 3 = 57</div>
<div {CARD}>
  <div>Go through the data <strong>once</strong>, in order, making a stroke for each item; tick off items as you go.</div>
  <div>The number of strokes in a row is the frequency of that value.</div>
</div>
""",
        "keyInsight": "Tally marks let you count while you read the data once, and the bundles of five make the final count quick.",
        "widgetType": "Class6TallyMarksWidget",
        "widgetData": {},
        "scenes": SCENES_2,
        "miniChallenge": {
            "question": "A row shows three bundles of five and 2 more strokes. What is the frequency?",
            "options": ["5", "15", "17", "32"],
            "correctIndex": 2,
            "explanation": "Each bundle is 5, so 3 × 5 = 15, and 15 + 2 = 17.",
        },
        "teacherNotes": teacher(
            [
                "Model tallying live: read a list aloud slowly while students tally.",
                "Stress that the fifth stroke crosses the four, it is not a sixth separate line.",
                "Connect to totals: frequency × value when the values are numbers (runs).",
            ],
            [
                "Drawing five vertical strokes and then crossing them (making bundles of 6).",
                "Losing place in the raw list; cross out each item once tallied.",
                "Adding the values (0, 1, 2, 4, 6) instead of the frequencies to get the number of balls.",
            ],
            "Dice tally: pairs throw a die 30 times, tally each face, then compare their tables with another pair.",
            "Old NCERT Ch. 9 (9.3 tally marks); Ganita Prakash Ch. 4 (tally marks and frequency tables).",
        ),
    },
    # ─────────────────────────────── Part 3 ───────────────────────────────
    {
        "title": "Story 3: Mummy's Bakery · Pictographs",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Mummy wants a chart of her laddoo sales for the fridge. Dadi shows her a pictograph, where one laddoo picture stands for 10 laddoos, and the family discovers why choosing the key matters.</div>

<h2>Pictograph</h2>
<p>A <strong>pictograph</strong> shows data with pictures or symbols. The <strong>key</strong> tells how much one picture stands for.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Day</th><th>Pictures (key: 1 = 10 laddoos)</th><th>Laddoos</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Monday</td><td class="text-center">4</td><td class="text-center">40</td></tr>
    <tr><td>Tuesday</td><td class="text-center">2 and a half</td><td class="text-center">25</td></tr>
    <tr><td>Wednesday</td><td class="text-center">6</td><td class="text-center">60</td></tr>
    <tr><td>Thursday</td><td class="text-center">3 and a half</td><td class="text-center">35</td></tr>
    <tr><td>Friday</td><td class="text-center">5</td><td class="text-center">50</td></tr>
    <tr class="text-emerald-300"><td>Total</td><td class="text-center">21</td><td class="text-center">210</td></tr>
  </tbody>
</table>
<div {FORMULA}>Value = number of pictures × key · Pictures = value ÷ key</div>
<div {CARD}>
  <div>Half a picture stands for half the key (here 5 laddoos).</div>
  <div>A small key (1 = 5) needs too many pictures; a large key (1 = 20) gives awkward parts of pictures. Choose a key that divides the data neatly.</div>
  <div>Always show the key. Without it, a pictograph cannot be read.</div>
</div>
""",
        "keyInsight": "In a pictograph every picture is worth the key, so value equals pictures times key.",
        "widgetType": "Class6PictographWidget",
        "widgetData": {},
        "scenes": SCENES_3,
        "miniChallenge": {
            "question": "Key: one picture = 10 laddoos. How many pictures show 35 laddoos?",
            "options": ["3", "3 and a half", "4", "35"],
            "correctIndex": 1,
            "explanation": "35 ÷ 10 = 3.5, so 3 full pictures and half a picture.",
        },
        "teacherNotes": teacher(
            [
                "Let students read a pictograph first, then make one from a frequency table.",
                "Discuss what half a symbol means before drawing any.",
                "Try the same data with three keys and let the class vote on the clearest.",
            ],
            [
                "Counting pictures and forgetting to multiply by the key.",
                "Reading half a picture as 1 or as 0.5 of a laddoo instead of half the key.",
                "Drawing symbols of different sizes, which makes rows look unequal.",
            ],
            "Pictograph poster: groups make a pictograph of books read by each row, choosing their own key and explaining why.",
            "Old NCERT Ch. 9 (9.4 pictograph, 9.5 interpretation, 9.6 drawing a pictograph); Ganita Prakash Ch. 4 (pictographs).",
        ),
    },
    # ─────────────────────────────── Part 4 ───────────────────────────────
    {
        "title": "Story 4: Disha's Class · Reading and Drawing Bar Graphs",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>Disha's class finds out how everyone comes to school and shows it as a bar graph. Reading the heights, the family compares, finds differences and totals, and then draws a new one.</div>

<h2>Bar graph</h2>
<p>A <strong>bar graph</strong> shows data with bars of <strong>equal width</strong> and <strong>equal gaps</strong>. The <strong>height</strong> (or length) of each bar shows the value, using a <strong>scale</strong> on the axis.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Way of coming</th><th>Walk</th><th>Cycle</th><th>Bus</th><th>Car</th><th>Auto</th></tr></thead>
  <tbody class="text-slate-300"><tr><td>Students</td><td class="text-center">12</td><td class="text-center">8</td><td class="text-center">15</td><td class="text-center">4</td><td class="text-center">6</td></tr></tbody>
</table>
<div {CARD}>
  <div>Most: Bus (15). Least: Car (4). Bus − Walk = 15 − 12 = 3. Total = 45 students.</div>
</div>
<h2>Steps to draw a bar graph</h2>
<div {FORMULA}>Axes → Labels → Scale → Bars (same width, equal gaps) → Title</div>
<div {CARD}>
  <div>1. Draw a horizontal and a vertical axis.</div>
  <div>2. Write the categories along one axis and the values along the other, with labels.</div>
  <div>3. Choose a scale (here 1 unit = 2 students) and mark it evenly from 0.</div>
  <div>4. Draw each bar to its height. 5. Give the graph a title.</div>
  <div>Bars can also be drawn horizontally; the rules are the same.</div>
</div>
""",
        "keyInsight": "In a bar graph only the heights matter, so equal widths and a scale starting from 0 make comparing fair.",
        "widgetType": "Class6BarGraphWidget",
        "widgetData": {},
        "scenes": SCENES_4,
        "miniChallenge": {
            "question": "On a bar graph with scale 1 unit = 5 students, a bar is 7 units tall. How many students does it show?",
            "options": ["7", "12", "35", "75"],
            "correctIndex": 2,
            "explanation": "Each unit stands for 5 students, so 7 × 5 = 35.",
        },
        "teacherNotes": teacher(
            [
                "Begin by reading a ready bar graph: most, least, difference, total.",
                "Point out the scale on the axis before reading any value.",
                "Draw a graph on squared paper together, step by step.",
            ],
            [
                "Reading the number of grid lines instead of the value (forgetting the scale).",
                "Bars of different widths or uneven gaps.",
                "Axis numbers not evenly spaced or not starting at 0.",
            ],
            "Human bar graph: students stand in lines for their way of coming to school; the class sketches the bar graph from the lines.",
            "Old NCERT Ch. 9 (9.7 bar graph, interpretation and drawing); Ganita Prakash Ch. 4 (bar graphs).",
        ),
    },
    # ─────────────────────────────── Part 5 ───────────────────────────────
    {
        "title": "Story 5: Papa's Ticket Counter · Choosing a Scale",
        "readingTime": "~5 min story",
        "narrative": f"""
<div {STORY}>Papa's station sells hundreds of tickets a day. Harsh tries 1 unit for 1 ticket and the bars fly off the page; 1 unit for 100 tickets makes them tiny. The family looks for the scale that is just right.</div>

<h2>Why a scale?</h2>
<p>When the values are large, one unit on the axis must stand for many items. This is the <strong>scale</strong>, for example 1 unit = 25 tickets.</p>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Day</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Tickets</td><td class="text-center">120</td><td class="text-center">150</td><td class="text-center">90</td><td class="text-center">180</td><td class="text-center">210</td></tr>
    <tr><td>Units (1 = 25)</td><td class="text-center">4.8</td><td class="text-center">6</td><td class="text-center">3.6</td><td class="text-center">7.2</td><td class="text-center">8.4</td></tr>
  </tbody>
</table>
<div {FORMULA}>Bar height in units = value ÷ scale</div>
<div {CARD}>
  <div>Look at the <strong>largest</strong> value and the space available (here 10 units).</div>
  <div>Scale 1 or 10: the top is 10 or 100, and 210 does not fit. Scale 100: everything fits but the bars are tiny.</div>
  <div>Scale 25: the top is 250, the tallest bar reaches 8.4 units. Choose easy numbers like 2, 5, 10, 25, 50, 100.</div>
</div>
""",
        "keyInsight": "Choose the scale from the largest value: every bar must fit, and the bars should still be tall enough to compare.",
        "widgetType": "Class6BarGraphWidget",
        "widgetData": {},
        "scenes": SCENES_5,
        "miniChallenge": {
            "question": "The largest value is 480 and the graph has 10 units of height. Which scale is best?",
            "options": ["1 unit = 10", "1 unit = 25", "1 unit = 50", "1 unit = 500"],
            "correctIndex": 2,
            "explanation": "With 1 unit = 50 the top is 500, so 480 fits (9.6 units). 10 and 25 give tops of 100 and 250, too small; 500 gives a top of 5000, so every bar is tiny.",
        },
        "teacherNotes": teacher(
            [
                "Give the same data to three groups with three scales and compare the graphs side by side.",
                "Ask: what is the biggest number, and how many units of height do we have?",
                "Show that the scale must be written on the graph.",
            ],
            [
                "Uneven scales (0, 10, 25, 50 on equally spaced lines).",
                "Choosing a scale so big that differences disappear.",
                "Forgetting to divide by the scale when drawing a bar.",
            ],
            "Scale hunt: give five data sets (largest values 18, 45, 120, 480, 950); pairs choose a scale for a 10-unit graph and justify it.",
            "Old NCERT Ch. 9 (9.7 choosing a scale); Ganita Prakash Ch. 4 (drawing bar graphs with a scale).",
        ),
    },
    # ─────────────────────────────── Part 6 ───────────────────────────────
    {
        "title": "Story 6: Sunday Newspaper · Infographics and Misleading Graphs",
        "readingTime": "~6 min story",
        "narrative": f"""
<div {STORY}>A newspaper infographic about Sachin Tendulkar's 100 centuries delights Harsh. Then Dadi spots two tricks: a bar graph whose axis starts at 46, and a picture that grows in two directions at once.</div>

<h2>Infographics</h2>
<p>An <strong>infographic</strong> presents data with pictures, colours, icons and short text so it can be understood quickly. Example: Sachin Tendulkar scored <strong>100 international centuries: 51 in Test matches and 49 in ODIs</strong> (51 + 49 = 100). A grid of 100 balls coloured in two colours shows this at a glance.</p>

<h2>Misleading graphs</h2>
<table class="w-full text-xs md:text-sm my-3">
  <thead><tr class="text-amber-300"><th class="text-left">Trick</th><th class="text-left">What it does</th><th class="text-left">Fix</th></tr></thead>
  <tbody class="text-slate-300">
    <tr><td>Axis not starting at 0</td><td>52 and 48 votes, axis from 46: bars of 6 and 2 parts, so one looks 3 times taller</td><td>Start the axis at 0 (52 ÷ 48 is only about 1.08)</td></tr>
    <tr><td>Picture grows in width and height</td><td>Doubling both sides makes the area 4 times</td><td>Use more pictures of the same size</td></tr>
    <tr><td>Uneven scale or missing key</td><td>Bars cannot be compared</td><td>Equal steps, key and scale shown</td></tr>
  </tbody>
</table>
<div {CARD}>
  <div>Before believing a graph, check: the title, the axis starting point, the scale, the key and the source of the data.</div>
</div>
""",
        "keyInsight": "A graph can be true and still fool you, so always check where the axis starts, the scale and the key.",
        "widgetType": "Class6MisleadingGraphWidget",
        "widgetData": {},
        "scenes": SCENES_6,
        "miniChallenge": {
            "question": "Two shops sold 98 and 102 kites. A bar graph's axis starts at 96. Which statement is right?",
            "options": ["The second shop sold 3 times as many", "The graph exaggerates a difference of only 4 kites", "The graph is honest", "The first shop sold more"],
            "correctIndex": 1,
            "explanation": "From 96 the bars are 2 and 6 parts tall, so one looks 3 times taller, but the real difference is only 102 − 98 = 4 kites.",
        },
        "teacherNotes": teacher(
            [
                "Bring real newspaper infographics and ask what each picture stands for.",
                "Redraw a cut-off-axis graph from 0 in front of the class.",
                "Use two squares (side 1 and side 2) to show why doubling both sides makes 4 times the area.",
            ],
            [
                "Believing the visual size instead of reading the numbers.",
                "Thinking a graph is wrong just because it is colourful; infographics can be honest.",
                "Not checking the source of the data.",
            ],
            "Graph detectives: groups get four graphs (two misleading) and must find and fix the tricks.",
            "Ganita Prakash Ch. 4 (infographics; drawing and interpreting graphs carefully). Extends old NCERT Ch. 9 bar graph interpretation.",
        ),
    },
    # ─────────────────────────────── Part 7 ───────────────────────────────
    {
        "title": "Solved Questions · Data Handling and Presentation",
        "readingTime": "~12 min practice",
        "narrative": f"""
<p>Ten exam-style questions, from tally tables to choosing a scale. Try each one first, then reveal the steps.</p>
<div {CARD}><div>Remember: frequencies add to the total; value = pictures × key; bar height = value ÷ scale; axes start at 0.</div></div>
""",
        "keyInsight": "Read the key or scale first; every answer depends on it.",
        "widgetType": "WorkedExamplesWidget",
        "widgetData": {
            "examples": [
                {
                    "title": "Tally table and most common value",
                    "question": "Marks (out of 10) of 15 students: 7, 8, 5, 7, 9, 6, 7, 8, 5, 10, 7, 6, 8, 9, 6. Make a tally table. Which mark is the most common?",
                    "steps": [
                        "Marks 5 to 10. Tally each mark in order.",
                        "5: || (2) · 6: ||| (3) · 7: |||| (4) · 8: ||| (3) · 9: || (2) · 10: | (1)",
                        "Check: 2 + 3 + 4 + 3 + 2 + 1 = 15. Most common mark = <strong>7</strong> (frequency 4)",
                    ],
                    "answer": "7",
                },
                {
                    "title": "Reading a pictograph with half symbols",
                    "question": "Key: one tree picture = 50 trees. A village shows 3 and a half pictures. How many trees are there?",
                    "steps": [
                        "3 full pictures = 3 × 50 = 150",
                        "Half a picture = 50 ÷ 2 = 25",
                        "150 + 25 = <strong>175 trees</strong>",
                    ],
                    "answer": "175 trees",
                },
                {
                    "title": "Drawing a pictograph",
                    "question": "Books read: Class A 30, Class B 45, Class C 20. Using 1 picture = 10 books, how many pictures for each?",
                    "steps": [
                        "A: 30 ÷ 10 = 3 pictures",
                        "B: 45 ÷ 10 = 4.5, so 4 and a half pictures",
                        "C: 20 ÷ 10 = <strong>2 pictures</strong> (A 3, B 4 and a half)",
                    ],
                    "answer": "3, 4 and a half, 2",
                },
                {
                    "title": "Reading a bar graph",
                    "question": "The graph shows students' favourite fruits. How many more chose Mango than Apple, and how many students in all?",
                    "figureSvg": _bar_svg(["Mango", "Apple", "Banana", "Guava"], [16, 10, 6, 8], 20, 4),
                    "steps": [
                        "Read the scale: each line is 4 students. Mango 16, Apple 10, Banana 6, Guava 8.",
                        "Mango − Apple = 16 − 10 = 6",
                        "Total = 16 + 10 + 6 + 8 = 40. Answer: <strong>6 more; 40 students</strong>",
                    ],
                    "answer": "6 more; 40 students",
                },
                {
                    "title": "Missing frequency",
                    "question": "40 students chose a game: Cricket 18, Football 9, Kho-kho 5, Kabaddi ?. Find Kabaddi.",
                    "steps": [
                        "Sum of the known frequencies = 18 + 9 + 5 = 32",
                        "Kabaddi = 40 − 32 = <strong>8</strong>",
                    ],
                    "answer": "8",
                },
                {
                    "title": "Choosing a scale",
                    "question": "Cars passing a crossing: 340, 460, 260, 410. The graph has 10 units of height. Choose a scale and find the height of the 460 bar.",
                    "steps": [
                        "Largest value 460, so the top (10 units) must be at least 460.",
                        "1 unit = 10 gives a top of 100: too small. 1 unit = 100 gives 1000: bars only half the graph or less.",
                        "1 unit = 50 gives a top of 500. 460 ÷ 50 = <strong>9.2 units</strong>",
                    ],
                    "answer": "1 unit = 50; 9.2 units",
                },
                {
                    "title": "Bar heights from a scale",
                    "question": "Scale: 1 unit = 25 tickets. Draw bars for 150, 75 and 200 tickets. How many units tall is each?",
                    "steps": [
                        "150 ÷ 25 = 6 units",
                        "75 ÷ 25 = 3 units",
                        "200 ÷ 25 = <strong>8 units</strong>",
                    ],
                    "answer": "6, 3 and 8 units",
                },
                {
                    "title": "Total from tally and values",
                    "question": "Runs off 20 balls: 0 runs 6 times, 1 run 7 times, 2 runs 3 times, 4 runs 3 times, 6 runs once. Find the total runs.",
                    "steps": [
                        "Check balls: 6 + 7 + 3 + 3 + 1 = 20",
                        "Runs = 0 × 6 + 1 × 7 + 2 × 3 + 4 × 3 + 6 × 1",
                        "= 0 + 7 + 6 + 12 + 6 = <strong>31 runs</strong>",
                    ],
                    "answer": "31 runs",
                },
                {
                    "title": "Spot the misleading graph",
                    "question": "A bar graph shows sales of 60 and 66 with the axis starting at 58. How many times taller does the second bar look, and what is the real comparison?",
                    "steps": [
                        "From 58, the bars are 60 − 58 = 2 and 66 − 58 = 8 parts tall.",
                        "8 ÷ 2 = 4, so it looks 4 times taller.",
                        "Really the difference is only 66 − 60 = 6, so the real difference is <strong>only 6, not 4 times</strong>",
                    ],
                    "answer": "Looks 4 times; really only 6 more",
                },
                {
                    "title": "Reading an infographic",
                    "question": "An infographic shows 100 balls, 51 gold for Test centuries and the rest blue for ODI centuries (Sachin Tendulkar). How many ODI centuries, and how many more Test than ODI centuries?",
                    "steps": [
                        "ODI = 100 − 51 = 49",
                        "Test − ODI = 51 − 49 = 2",
                        "<strong>49 ODI centuries; 2 more in Tests</strong>",
                    ],
                    "answer": "49; 2 more",
                },
            ]
        },
        "scenes": SCENES_7,
        "teacherNotes": teacher(
            [
                "Before solving, ask: what is the key or scale? That one question unlocks most problems.",
                "Q1 and Q8: insist on checking that the frequencies add to the total.",
                "Q6: discuss several reasonable scales; there can be more than one good answer.",
            ],
            [
                "Q2: counting half a picture as 1 or as 0.5.",
                "Q4: reading the number of grid lines instead of the value.",
                "Q9: believing the picture instead of the numbers.",
            ],
            "Pair-share: one student reads the key or scale aloud, the other solves; swap for the next question.",
            "Covers old NCERT Ch. 9 Exercises 9.1–9.4 and Ganita Prakash Ch. 4 exercise patterns.",
        ),
    },
    # ─────────────────────────────── Part 8 ───────────────────────────────
    {
        "title": "Chapter Exam · Data Handling and Presentation (80% to pass)",
        "readingTime": "~10 min exam",
        "narrative": f"""
<p>From Holi colours to the Sunday newspaper, you have collected, tallied, drawn and questioned data. Now show what you know.</p>
<div {CARD}>
  <div><strong>10 questions</strong> covering data, frequency tables, tally marks, pictographs, bar graphs, scales, infographics and misleading graphs.</div>
  <div><strong>Pass mark: 80%</strong> (8 out of 10). You get the explanation after every answer.</div>
</div>
""",
        "keyInsight": "Organise, count, choose a fair scale, and always read the key.",
        "widgetType": "StoryExamWidget",
        "widgetData": {
            "title": "Data Handling and Presentation · Chapter Exam",
            "passMark": 80,
            "questions": [
                {"q": "The number of times a value occurs in data is called its:", "options": ["Scale", "Frequency", "Key", "Tally"], "answer": 1, "explanation": "Frequency is how many times a value occurs. Tally marks are a way to count it.", "topic": "Organising data"},
                {"q": "Which tally marks show 13?", "options": ["Two bundles of five and 3 strokes", "One bundle of five and 3 strokes", "Thirteen bundles", "Three bundles of five"], "answer": 0, "explanation": "Two bundles = 10, plus 3 strokes = 13.", "topic": "Tally marks"},
                {"q": "In a survey of 50 children, the frequencies are 14, 11, 9 and one missing value. What is the missing frequency?", "options": ["34", "16", "14", "6"], "answer": 1, "explanation": "14 + 11 + 9 = 34, and 50 − 34 = 16.", "topic": "Frequency table"},
                {"q": "Key: one picture = 8 apples. How many apples do 5 and a half pictures show?", "options": ["40", "44", "48", "13"], "answer": 1, "explanation": "5 × 8 = 40 and half of 8 = 4, so 40 + 4 = 44.", "topic": "Pictographs"},
                {"q": "With key 1 picture = 20 books, how many pictures show 90 books?", "options": ["4 and a half", "9", "4", "18"], "answer": 0, "explanation": "90 ÷ 20 = 4.5, so 4 and a half pictures.", "topic": "Pictographs"},
                {"q": "In a bar graph, which must be the same for every bar?", "options": ["Height", "Colour", "Width", "Value"], "answer": 2, "explanation": "Bars have equal width and equal gaps; only the height shows the value.", "topic": "Bar graphs"},
                {"q": "Scale: 1 unit = 10 students. A bar is 6.5 units tall. How many students?", "options": ["65", "16.5", "60", "650"], "answer": 0, "explanation": "6.5 × 10 = 65.", "topic": "Reading bar graphs"},
                {"q": "The largest value to show is 870 and the graph has 10 units. Which scale is best?", "options": ["1 unit = 10", "1 unit = 50", "1 unit = 100", "1 unit = 1000"], "answer": 2, "explanation": "1 unit = 100 gives a top of 1000, so 870 fits at 8.7 units. 10 and 50 give tops of 100 and 500, too small; 1000 makes bars tiny.", "topic": "Choosing a scale"},
                {"q": "A picture of a cake is drawn twice as wide and twice as tall to show sales doubling. The bigger picture covers:", "options": ["2 times the area", "3 times the area", "4 times the area", "The same area"], "answer": 2, "explanation": "2 times wider and 2 times taller makes 2 × 2 = 4 times the area, which exaggerates the change.", "topic": "Misleading graphs"},
                {"q": "Sachin Tendulkar scored 51 Test centuries and 49 ODI centuries. An infographic shows a 10 by 10 grid. How many squares are coloured for ODIs?", "options": ["51", "100", "2", "49"], "answer": 3, "explanation": "Each square is one century; 49 ODI centuries means 49 squares (and 51 for Tests, 100 in all).", "topic": "Infographics"},
            ],
        },
        "teacherNotes": teacher(
            ["Use the 'Review these' list after a failed attempt to send students back to the exact story they need."],
            ["Q4 catches half pictures; Q8 catches scales that are too small; Q9 catches area versus length."],
            "Exit ticket: draw a bar graph of 4 values (largest 72) with a sensible scale and write one question it answers.",
            "Matches old NCERT Ch. 9 Data Handling learning outcomes and Ganita Prakash Ch. 4 goals.",
        ),
    },
]


def seed_class6_data_handling():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "Data Handling and Presentation")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        scenes = sum(len(p.get("scenes", [])) for p in PARTS)
        lines = sum(len(sc["lines"]) for p in PARTS for sc in p.get("scenes", []))
        print(f"Seeded Class 6 Data Handling and Presentation: {len(PARTS)} parts, {scenes} scenes, {lines} dialogue lines")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Class 6 Data Handling and Presentation: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_class6_data_handling()
