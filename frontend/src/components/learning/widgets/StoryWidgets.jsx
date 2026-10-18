import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { StoryStage, useSceneState } from '../engine/storyKit';

// ─── Generic, data-driven widgets shared by every story chapter ───

// Step-by-step solved questions. widgetData: { examples: [{ title, question, figureSvg?, steps: [], answer }] }
// Scene visual: { example, step } — narration walks through one step at a time.
export function WorkedExamplesWidget({ data, visual }) {
  const examples = data?.examples || [];
  const [state, update] = useSceneState({ example: 0, step: 0 }, visual);
  const ex = examples[Math.min(state.example, examples.length - 1)];
  if (!ex) return null;
  const shown = Math.min(state.step, ex.steps.length);
  const solved = shown >= ex.steps.length;

  return (
    <StoryStage eyebrow="Solved Questions" title={`Q${state.example + 1}. ${ex.title}`}>
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {examples.map((e, i) => (
            <button
              key={i}
              onClick={() => update({ example: i, step: 0 })}
              className={`w-8 h-8 rounded-lg text-xs font-bold border transition ${i === state.example ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400 hover:text-white'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm md:text-base leading-relaxed">
          <span className="text-amber-400 font-bold mr-1">Question:</span>{ex.question}
        </div>

        {ex.figureSvg && (
          <div className="flex justify-center rounded-xl bg-slate-900/60 border border-slate-800 p-2" dangerouslySetInnerHTML={{ __html: ex.figureSvg }} />
        )}

        <ol className="space-y-2">
          {ex.steps.map((s, i) => (
            <li
              key={i}
              className={`flex gap-3 p-3 rounded-xl border transition-all duration-500 ${i < shown ? 'opacity-100 translate-y-0 bg-slate-900 border-slate-800' : 'opacity-0 -translate-y-1 h-0 p-0 border-transparent overflow-hidden'}`}
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-sm text-slate-200 font-mono leading-relaxed" dangerouslySetInnerHTML={{ __html: s }} />
            </li>
          ))}
        </ol>

        {solved ? (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold text-sm" dangerouslySetInnerHTML={{ __html: `✔ Answer: ${ex.answer}` }} />
        ) : (
          <button
            onClick={() => update({ step: shown + 1 })}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold transition"
          >
            Show step {shown + 1} of {ex.steps.length}
          </button>
        )}
      </div>
    </StoryStage>
  );
}

// Chapter exam. widgetData: { title, passMark: 80, questions: [{ q, options: [], answer: idx, explanation }] }
export function StoryExamWidget({ data }) {
  const questions = data?.questions || [];
  const passMark = data?.passMark ?? 80;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mistakes, setMistakes] = useState([]);

  if (!questions.length) return null;
  const q = questions[idx];
  const percent = Math.round((score / questions.length) * 100);
  const passed = percent >= passMark;
  const needed = Math.ceil((questions.length * passMark) / 100);

  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
    else setMistakes((m) => [...m, idx]);
  };

  const next = () => {
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setPicked(null);
      return;
    }
    setFinished(true);
    if (Math.round((score / questions.length) * 100) >= passMark) {
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
    }
  };

  const restart = () => {
    setIdx(0); setPicked(null); setScore(0); setFinished(false); setMistakes([]);
  };

  return (
    <StoryStage eyebrow={`Chapter Exam · Pass mark ${passMark}%`} title={data.title || 'Chapter Exam'}>
      <div className="p-4 md:p-6">
        {!finished ? (
          <div className="space-y-5">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Question {idx + 1} of {questions.length}</span>
              <span>Score {score} · need {needed}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-sky-500 transition-all duration-500" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
            </div>
            <h4 className="text-base md:text-lg font-bold text-white leading-relaxed" dangerouslySetInnerHTML={{ __html: q.q }} />
            {q.figureSvg && <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: q.figureSvg }} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((o, i) => {
                let cls = 'border-slate-700 text-slate-200 hover:bg-slate-800';
                if (picked !== null) {
                  if (i === q.answer) cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-300';
                  else if (i === picked) cls = 'bg-red-500/15 border-red-500 text-red-300';
                  else cls = 'border-slate-800 text-slate-500';
                }
                return (
                  <button key={i} onClick={() => pick(i)} disabled={picked !== null} className={`text-left p-3 rounded-xl border text-sm transition ${cls}`}>
                    <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className={`p-3 rounded-xl text-sm border ${picked === q.answer ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' : 'bg-amber-500/10 border-amber-500/40 text-amber-100'}`}>
                <strong>{picked === q.answer ? 'Correct! ' : 'Not quite. '}</strong>{q.explanation}
              </div>
            )}
            {picked !== null && (
              <button onClick={next} className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm">
                {idx < questions.length - 1 ? 'Next question' : 'See my result'}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className={`text-6xl font-black ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>{percent}%</div>
            <p className="text-slate-300">{score} of {questions.length} correct · pass mark {passMark}%</p>
            <p className={`text-lg font-bold ${passed ? 'text-emerald-300' : 'text-amber-300'}`}>
              {passed ? '🏅 Chapter complete! You have earned the badge.' : 'Almost there. Re-watch the scenes for the questions you missed, then try again.'}
            </p>
            {!passed && mistakes.length > 0 && (
              <div className="text-left max-w-md mx-auto p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-slate-400 uppercase tracking-wider">Review these</div>
                {mistakes.map((m) => <div key={m}>• Q{m + 1}: {questions[m].topic || questions[m].explanation}</div>)}
              </div>
            )}
            <button onClick={restart} className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm">Try again</button>
          </div>
        )}
      </div>
    </StoryStage>
  );
}
