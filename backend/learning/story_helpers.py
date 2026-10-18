"""Shared building blocks for story-style chapter seeds (family dialogue scenes, teacher notes, styled cards)."""


# ─── The family (same cast and voices in every Class 6 chapter) ───
# Dadi: retired maths teacher, the storyteller · Harsh (12): cricket-mad, cheeky · Disha (11): curious, loves kites
# Deepak (Papa): Indian Railways engineer · Neha (Mummy): runs a home bakery · Narrator: scene-setting (male/female)


def L(who, en, hi):
    return {"who": who, "say": en, "sayHi": hi}


def scene(lines, visual=None, wait=False):
    s = {"lines": lines, "visual": visual or {}}
    if wait:
        s["wait"] = True
    return s


def teacher(explain, mistakes, activity, syllabus):
    li = lambda items: "".join(f"<li>{i}</li>" for i in items)
    return f"""
<h4>How to explain it</h4><ul>{li(explain)}</ul>
<h4>Common mistakes to watch for</h4><ul>{li(mistakes)}</ul>
<h4>Classroom activity (10 min)</h4><p>{activity}</p>
<h4>Syllabus link</h4><p>{syllabus}</p>
"""


CARD = 'class="my-3 p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 space-y-1"'
STORY = 'class="my-3 p-4 bg-amber-950/30 border-l-4 border-amber-500 rounded-r-xl text-amber-100 italic"'
FORMULA = 'class="my-4 p-4 bg-slate-900 border border-emerald-500/40 rounded-xl font-mono text-center text-emerald-300 text-base font-bold"'
