"""Screenshots a story lesson in a headless browser so its animations can be checked visually.

Needs the backend and the Vite dev server running (see CHAPTER_PLAYBOOK.md), then for example:
    python learning/tools/lesson_screenshots.py --topic "Whole Numbers" --vite 5199 --out C:/tmp/shots
    python learning/tools/lesson_screenshots.py --topic "Whole Numbers" --vite 5199 --out C:/tmp/shots --shots 0:2,3:5

Without --shots it captures the first, middle and last scene of every part. It prints any page errors
(a crashed widget shows up here) and writes contact sheets (sheet_*.png) of 6 shots each.
"""
import argparse
import asyncio
import os
import sqlite3
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(os.path.dirname(os.path.dirname(HERE)), "learning_local.db")


def topic_id(name, level=6):
    con = sqlite3.connect(DB)
    row = con.execute(
        "select t.id from learning_topics t join learning_subjects s on t.subject_id = s.id "
        "join learning_classes c on s.class_id = c.id where c.level = ? and s.name = 'Mathematics' and t.name = ?",
        (level, name),
    ).fetchone()
    if not row:
        sys.exit(f"Topic '{name}' not found in {DB}. Seed it first.")
    return row[0]


async def capture(url, shots, out, width, height):
    from playwright.async_api import async_playwright

    os.makedirs(out, exist_ok=True)
    saved, errors = [], []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": width, "height": height})
        page.on("pageerror", lambda e: errors.append(str(e)[:300]))
        page.on("console", lambda m: m.type == "error" and errors.append(m.text[:300]))
        for _ in range(30):
            try:
                await page.goto(url)
                await page.wait_for_selector('button[title="Next Step"], button[title="Finish Lesson"]', timeout=4000)
                break
            except Exception:
                await page.wait_for_timeout(1000)
        part = 0
        idx = 0
        while True:
            if shots is None:
                dots = await page.locator('button[title^="Scene "]').count()
                scenes = [0, dots // 2, dots - 1] if dots else [None]
                targets = [(part, s) for s in dict.fromkeys(scenes)]
            else:
                targets = [t for t in shots if t[0] == part]
            for _, sc in targets:
                if sc is not None:
                    try:
                        await page.locator('button[title^="Scene "]').nth(sc).click(timeout=5000)
                    except Exception:
                        errors.append(f"part {part + 1}: scene {sc + 1} not found (widget crashed or fewer scenes)")
                        continue
                await page.wait_for_timeout(2800)
                path = os.path.join(out, f"shot_{idx:02d}_p{part + 1}_s{(sc or 0) + 1}.png")
                await page.screenshot(path=path, clip={"x": width / 2, "y": 50, "width": width / 2, "height": height - 50})
                saved.append(path)
                idx += 1
            last = shots is not None and part >= max(t[0] for t in shots)
            nxt = page.locator('button[title="Next Step"]')
            if last or await nxt.count() == 0:
                # also capture the final part (usually the exam) once
                if shots is None:
                    path = os.path.join(out, f"shot_{idx:02d}_p{part + 1}_final.png")
                    await page.screenshot(path=path)
                    saved.append(path)
                break
            await nxt.click()
            await page.wait_for_timeout(800)
            part += 1
        await browser.close()

    try:
        from PIL import Image
        for g in range(0, len(saved), 6):
            ims = [Image.open(f).convert("RGB").resize((400, 470)) for f in saved[g:g + 6]]
            sheet = Image.new("RGB", (1200, 940), "black")
            for i, im in enumerate(ims):
                sheet.paste(im, ((i % 3) * 400, (i // 3) * 470))
            sheet.save(os.path.join(out, f"sheet_{g // 6}.png"))
    except ImportError:
        pass
    print(f"Saved {len(saved)} screenshots to {out}")
    print("Page errors:", errors if errors else "none")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", required=True, help="Topic name, e.g. 'Whole Numbers'")
    ap.add_argument("--vite", type=int, default=5199, help="Vite dev server port")
    ap.add_argument("--out", required=True)
    ap.add_argument("--shots", help="part:scene pairs (0-based), e.g. 0:2,3:5")
    ap.add_argument("--width", type=int, default=1366)
    ap.add_argument("--height", type=int, default=860)
    a = ap.parse_args()
    shots = None
    if a.shots:
        shots = [tuple(int(x) for x in s.split(":")) for s in a.shots.split(",")]
    url = f"http://localhost:{a.vite}/lesson-preview.html?topic={topic_id(a.topic)}"
    asyncio.run(capture(url, shots, a.out, a.width, a.height))


if __name__ == "__main__":
    main()
