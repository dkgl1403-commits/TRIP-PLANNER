# Class 6 Maths: Story Chapter Playbook

How to build one interactive story chapter for the Learning module. Every Class 6 chapter follows this
so the subject feels like one book. Reference chapters to copy from (read at least one fully before starting):

| Chapter | Seed (content) | Widgets (animations) |
|---|---|---|
| Lines and Angles | `backend/learning/seed_class6_lines_angles.py` | `frontend/src/components/learning/widgets/Class6LinesAnglesWidgets.jsx` |
| Understanding Elementary Shapes | `seed_class6_elementary_shapes.py` | `Class6ElementaryShapesWidgets.jsx` |
| Patterns in Mathematics | `seed_class6_patterns.py` | `Class6PatternsWidgets.jsx` |
| Knowing Our Numbers | `seed_class6_knowing_numbers.py` | `Class6KnowingNumbersWidgets.jsx` |

## 1. What a chapter is

Two new files, nothing else:

1. `frontend/src/components/learning/widgets/Class6<Name>Widgets.jsx`: 4–6 animated widgets.
   Every exported widget **must** be named `Class6<Something>Widget`; files matching `Class*Widgets.jsx` are
   auto-registered by `AcademicWidgets.jsx` (do not edit that file).
2. `backend/learning/seed_class6_<snake_name>.py`: the content. It must define a function with the **same
   name as the file** (e.g. `seed_class6_whole_numbers()`); `seed_class6_chapters()` discovers it automatically
   (do not edit `seed.py`). Use the exact topic name from `CLASS6_MATH_CHAPTERS` in `seed_class6_structure.py`
   via `get_class6_topic(db, "<name>")`.

Do not modify shared engine files (`LessonEngine.jsx`, `StoryPlayer.jsx`, `storyKit.jsx`, `StoryWidgets.jsx`,
`story_helpers.py`, `api.py`). If you truly need a shared change, describe it in your report instead.

## 2. Audience and tone

- Students: Class 6 (age 11), who may know nothing about the topic. Explain in plain language, like a story.
- Teachers: use the same lesson to teach; every part has teacher notes.
- Prove things visually first ("see it"), then with numbers/formulas ("prove it").
- Language: English + Hinglish (Roman-script Hindi mixed with English, natural and conversational).

## 3. The family (same cast and voices in every chapter)

Jaipur family. Each speaker has a fixed voice (mapped in `api.py` STORY_CAST; only these names work):

| `who` | Character |
|---|---|
| `Dadi` | Grandmother, retired maths teacher, the main storyteller and explainer. Warm, uses "beta", "Shabash!" |
| `Harsh` | Boy, 12, cricket-mad, cheeky, jokes, makes mistakes that teach |
| `Disha` | Girl, 11, curious, loves kites and dance, asks "why?" |
| `Deepak` | Papa, Indian Railways engineer (trains, tracks, signals, measurements) |
| `Neha` | Mummy, runs a home bakery (laddoos, cakes, samosas, pizza, trays) |
| `Narrator` | Scene-setting only (follows the learner's male/female narrator choice) |

Indian settings and festivals (Diwali, Makar Sankranti, Holi, Independence Day, cricket matches, trains,
markets). Mix who explains; Dadi leads, but Papa/Mummy explain things from their work.

## 4. Seed file structure

```python
import json
from db import SessionLocal
from seed_class6_structure import get_class6_topic
from story_helpers import L, scene, teacher, CARD, STORY, FORMULA

SCENES_1 = [
    scene([
        L("Narrator", "English line.", "Hinglish line."),
        L("Dadi", "English line.", "Hinglish line."),
    ], {"mode": "x", "value": 3}),                 # visual = widget state for this scene
    scene([L("Dadi", "Your turn! ...", "Ab aapki baari! ...")], {"task": ...}, wait=True),
]
PARTS = [ { ...part... }, ... ]

def seed_class6_<snake_name>():
    db = SessionLocal()
    try:
        topic = get_class6_topic(db, "<Exact Chapter Name>")
        topic.lesson_config_json = json.dumps({"type": "narrative", "parts": PARTS})
        db.commit()
        ...print a summary...
    except Exception as e:
        db.rollback(); print(f"Error seeding ...: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_class6_<snake_name>()
```

### Parts (8 per chapter)

- Parts 1–6: story parts, one concept cluster each. Part 7: solved questions. Part 8: chapter exam.
- Each story part has:
  - `title`: `"Story N: <Setting> · <Concept>"`
  - `readingTime`
  - `narrative`: HTML. Start with `<div {STORY}>…</div>`, then `<h2>` sections, `<div {CARD}>` boxes and
    `<div {FORMULA}>` for key rules/formulas, plus tables. These are the reading notes and must be complete
    on their own (a teacher should be able to teach from them).
  - `keyInsight`: one sentence.
  - `widgetType`: the widget name. `widgetData: {}`.
  - `scenes`: 4–10 scenes. Each scene has 1–3 lines, and each line is 1–3 sentences.
  - `miniChallenge`: `{question, options, correctIndex, explanation}`.
  - `teacherNotes`: `teacher([how to explain…], [common mistakes…], "10-minute classroom activity", "syllabus link")`.
- At least 4 parts should end with a "Your turn" scene (`wait=True`) whose visual sets a task the widget checks
  and then calls `onInteract()`.
- Part 7 uses `"widgetType": "WorkedExamplesWidget"` with
  `"widgetData": {"examples": [{"title", "question", "steps": [html…], "answer", "figureSvg"?}]}` (10 examples,
  exam-style, varied difficulty). Its scenes walk through Q1 and Q2 with visuals `{"example": i, "step": k}`
  (`step` = number of steps revealed), then invite practice.
- Part 8 uses `"widgetType": "StoryExamWidget"` with `{"title", "passMark": 80, "questions": [{"q", "options",
  "answer" (index), "explanation", "topic"}]}`. 10 questions, no scenes.

### Narration rules (it is read aloud by text-to-speech)

- Write numbers the way they should be spoken: "90 degrees", not "90°". Avoid symbols in spoken lines
  (°, ×, ÷, ∠, ≈, →, ½). Say "times", "divided by", "angle A O B", "half". Commas in big numbers are fine.
- No HTML, emoji or `&` in `say` / `sayHi`.
- Questions end with "?" and excited lines with "!", because the voice changes pitch on them.
- Hinglish: natural spoken Hindi in Roman script with English maths words kept in English (angle, triangle, factor).

### Facts and real-world data

- Use real Indian data where it helps: census figures, distances, heights, temperatures, railway facts,
  cricket, historical Indian mathematicians. Verify every fact with a web search; if unsure, leave it out or
  say "about". Never invent statistics.
- Double-check every calculation in narration, solved questions, exam answers and explanations.
- Syllabus = union of old NCERT (14 chapters) and Ganita Prakash (2024, 10 chapters). Cover both books' content
  for the chapter. Formal results from a later class may appear as a clearly labelled "bridge to Class 7".

## 5. Widget rules

Read `frontend/src/components/learning/engine/storyKit.jsx`. Every widget:

```jsx
export function Class6FooWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ /* defaults */ }, visual);   // scene drives state; learner can override
  return (
    <StoryStage eyebrow="Visualizer · …" title="…" footer={<div className="space-y-3">…controls…</div>}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">…</svg>
    </StoryStage>
  );
}
```

- Animate between scene states smoothly: `useTween` for numbers, CSS transitions, staggered fade-ins.
  Things should move, grow, slide and morph, not just appear. This is the "world-class" part.
- Interactive: drag (`useSvgDrag`), sliders, pills (`ModePills`), inputs; show live readouts (`Readout`).
- "Your turn" tasks: show `TaskBanner`, check the condition in a `useEffect`, call `onInteract?.()` when met.
- Shared drawing pieces: `Dot`, `Arrowhead`, `RightAngleMark`, `polar`, `arcPath`, `sectorPath`; palette
  `INK, AMBER, SKY, GREEN, PINK, PURPLE, RED`. Dark theme (`#020617` stage background), Tailwind classes.
- Use Indian number formatting (`1,21,08,54,977`) where numbers are large.

### Bugs we already hit (avoid them)

- `Array.from({length}, (_, i, arr) => …)`: the map callback gets no third argument. Compute lengths separately.
- If you use a CSS `@keyframes` animation, render `<style>{'@keyframes …'}</style>` inside **that** widget
  (e.g. in its footer). Otherwise elements with `opacity: 0` stay invisible forever.
- An SVG `onPointerUp` on the same element as `{...dragProps}` overrides the drag handler; call
  `dragProps.onPointerUp(e)` inside yours.
- Keep text inside the 600×360 viewBox; long labels need `textAnchor="middle"` and short wording.
- Never crash on missing visual fields: always merge with defaults via `useSceneState`.

## 6. Local testing (required before you report)

Pick your own ports so parallel builders don't clash (your task tells you which). From the repo root:

```bash
# one-time setup in a fresh git worktree: reuse the main checkout's node_modules
cmd //c mklink /J frontend\\node_modules C:\\Personal\\Projects\\TRIP_Planner\\frontend\\node_modules

# database (run from backend/, creates backend/learning_local.db if missing)
cd backend
python -c "import sys; sys.path.insert(0,'learning'); import db; db.init_db()"
python learning/seed_class6_structure.py
python learning/seed_class6_<snake_name>.py

# servers (backend must run from backend/, or it creates a stray empty DB elsewhere)
cd backend && python -m uvicorn main:app --port <API_PORT>              # background
cd frontend && VITE_API_PORT=<API_PORT> node node_modules/vite/bin/vite.js --port <VITE_PORT> --strictPort   # background

# build + lint
cd frontend && npx vite build && npx oxlint src/components/learning/widgets/Class6<Name>Widgets.jsx

# screenshots of every part (first/middle/last scene) + contact sheets sheet_*.png
cd backend && python learning/tools/lesson_screenshots.py --topic "<Exact Chapter Name>" --vite <VITE_PORT> --out <scratch dir>
```

Look at every contact sheet yourself (read the PNGs). Check: nothing overlaps or is cut off, every scene's
visual matches its narration, animations ended in the right state, "Page errors: none". Fix and re-shoot until clean.
Stop your servers when done.

## 7. Deploy (done by the integrator, not chapter builders)

Push to `uat` (GitHub Actions auto-deploys code). The deploy does not seed, so on the server:
`cd ~/TRIP_Planner_UAT/backend && python3 learning/seed_class6_<x>.py && python3 -u learning/pregen_story_audio.py "<Chapter>"`.
Run audio generation for one chapter at a time (the free TTS service blocks bursts).
