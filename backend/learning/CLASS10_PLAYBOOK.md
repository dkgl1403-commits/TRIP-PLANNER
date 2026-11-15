# Class 10 Maths: Story Chapter Playbook (addendum)

Class 10 story chapters follow `CHAPTER_PLAYBOOK.md` in full (structure, 8 parts, widgets, narration rules,
testing). This file lists only what is different for Class 10.

## Files and names

- Seed: `backend/learning/seed_class10_story_<snake_name>.py` with function `seed_class10_story_<snake_name>()`.
  Import `from seed_class10_structure import get_class10_topic` and use the exact name from
  `CLASS10_MATH_CHAPTERS`. `seed_class10_chapters()` discovers the file; do not edit `seed.py`.
- Widgets: `frontend/src/components/learning/widgets/Class10<Name>StoryWidgets.jsx`; every export named
  `Class10<Something>Widget` and unique across the widgets folder (older Class 10 widget files exist: grep first).
- Older Class 10 seeds (`seed_class10_circles.py` etc.) are the previous format; do not edit them.
- Local setup: run `.venv/bin/python learning/seed_class10_structure.py` (from `backend/`) before your seed.

## Audience and story

- Students in Class 10 (15–16) preparing for the CBSE board exam; teachers use the same lesson in class.
  Tone is a little more grown-up than Class 6, still warm and story-led, still English + Hinglish.
- Same Jaipur family and voices, a few years later: **Harsh** (16) and **Disha** (15) are both in Class 10 and
  study together for the boards. Harsh still loves cricket and rushes; Disha still asks "why?". **Dadi**,
  **Deepak** (Papa, Indian Railways engineer) and **Neha** (Mummy, home bakery, now a small shop) as before.
- Settings: board-exam preparation, the bakery business, railway work, cricket, festivals, travel in India.

## Syllabus and exam focus

- NCERT Class 10 Mathematics, rationalised syllabus (2023-24 onward). Cover every section of the chapter,
  including the theorems and proofs the board expects; prove visually first, then formally.
- Mark clearly what is deleted from the current syllabus if you mention it at all (prefer leaving it out).
- Part 7 (10 solved questions): board pattern: a mix of MCQ, short answer, long answer, at least one
  assertion–reason and one case-based question, with full working as a board examiner expects.
- Part 8 (exam, 10 questions, pass mark 80): board-style MCQs including assertion–reason.
- Formulas and results that are stated in the narrative also go in a `FORMULA` box.
