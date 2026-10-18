import React, { useState, useEffect, useRef } from 'react';

// Plays a lesson part as a sequence of narrated scenes. Each scene is a short conversation:
// `lines: [{ who, say, sayHi }]` spoken one after another, each character in their own voice
// (the server maps `who` to a voice). Older scenes with a single `say`/`sayHi` are read by the narrator.
// The scene's `visual` drives the widget; scenes with `wait: true` pause until the learner finishes the task.

const CHARACTER_STYLES = {
  Dadi: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
  Harsh: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
  Disha: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
  Deepak: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  Neha: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
};

export const sceneLines = (scene) =>
  Array.isArray(scene.lines) && scene.lines.length ? scene.lines : [{ who: 'Narrator', say: scene.say, sayHi: scene.sayHi }];

const lineText = (line, language) => ((language === 'hi' && line.sayHi) ? line.sayHi : line.say);

const ttsUrl = (line, language, narrator) => {
  const speaker = line.who && line.who !== 'Narrator' ? `&speaker=${encodeURIComponent(line.who)}` : '';
  return `/api/learning/tts?text=${encodeURIComponent(lineText(line, language))}&lang=${language}&voice=${narrator}${speaker}`;
};

export function StoryPlayer({ scenes, sceneIdx, onSceneChange, language = 'en', narrator = 'female', interactionDone }) {
  const [playing, setPlaying] = useState(false);
  // The line position belongs to a scene, so switching scenes always starts from its first line
  const [linePos, setLinePos] = useState({ scene: sceneIdx, line: 0 });
  const [status, setStatus] = useState('idle'); // idle | loading | speaking | waiting | done
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const scene = scenes[sceneIdx];
  const lines = scene ? sceneLines(scene) : [];
  const isLast = sceneIdx === scenes.length - 1;
  const lineIdx = linePos.scene === sceneIdx ? linePos.line : 0;

  const stopAudio = () => {
    clearTimeout(timerRef.current);
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const finishScene = () => {
    if (scene.wait && !interactionDone) {
      setStatus('waiting');
      return;
    }
    if (isLast) {
      setPlaying(false);
      setStatus('done');
      return;
    }
    timerRef.current = setTimeout(() => onSceneChange(sceneIdx + 1), scene.pauseAfter ?? 700);
  };

  const finishLine = () => {
    if (lineIdx < lines.length - 1) {
      timerRef.current = setTimeout(() => setLinePos({ scene: sceneIdx, line: lineIdx + 1 }), 250);
    } else {
      finishScene();
    }
  };

  // Speak the current line whenever we are playing and the scene, line, language or narrator changes
  useEffect(() => {
    if (!playing || !scene) return undefined;
    stopAudio();
    const line = lines[Math.min(lineIdx, lines.length - 1)];
    setStatus('loading');

    const audio = new Audio(ttsUrl(line, language, narrator));
    audioRef.current = audio;
    let fellBack = false;
    const fallBack = () => {
      // TTS unavailable: keep the story moving at reading pace so the animation still plays
      if (fellBack || audioRef.current !== audio) return;
      fellBack = true;
      setStatus('speaking');
      const words = lineText(line, language).split(/\s+/).length;
      timerRef.current = setTimeout(finishLine, Math.max(1800, words * 380));
    };
    audio.onended = finishLine;
    audio.onerror = fallBack;
    audio.play().then(() => setStatus('speaking')).catch(fallBack);

    // Warm the server cache for what comes next so there is no gap
    const upcoming = lineIdx < lines.length - 1 ? [lines[lineIdx + 1]] : (scenes[sceneIdx + 1] ? sceneLines(scenes[sceneIdx + 1]) : []);
    upcoming.forEach((l) => fetch(ttsUrl(l, language, narrator)).catch(() => {}));

    return stopAudio;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, sceneIdx, lineIdx, language, narrator]);

  // Learner finished the "your turn" task while we were waiting: move on
  useEffect(() => {
    if (playing && status === 'waiting' && interactionDone) {
      timerRef.current = setTimeout(() => (isLast ? (setPlaying(false), setStatus('done')) : onSceneChange(sceneIdx + 1)), 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactionDone, status]);

  useEffect(() => () => stopAudio(), []);

  const togglePlay = () => {
    if (playing) {
      stopAudio();
      setPlaying(false);
      setStatus('idle');
    } else {
      if (status === 'done') onSceneChange(0);
      setPlaying(true);
    }
  };

  const goTo = (idx) => {
    stopAudio();
    setStatus(playing ? 'loading' : 'idle');
    onSceneChange(Math.max(0, Math.min(scenes.length - 1, idx)));
  };

  if (!scene) return null;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 backdrop-blur-md p-3 md:p-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => goTo(sceneIdx - 1)}
          disabled={sceneIdx === 0}
          className="w-9 h-9 shrink-0 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 flex items-center justify-center"
          title="Previous scene"
        >
          <span className="material-symbols-outlined text-lg">skip_previous</span>
        </button>
        <button
          onClick={togglePlay}
          className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-white transition-all ${playing ? 'bg-neon-coral shadow-[0_0_18px_rgba(255,107,74,0.6)]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.45)]'}`}
          title={playing ? 'Pause story' : 'Play story'}
        >
          {status === 'loading' && playing
            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <span className="material-symbols-outlined text-2xl">{playing ? 'pause' : (status === 'done' ? 'replay' : 'play_arrow')}</span>}
        </button>
        <button
          onClick={() => goTo(sceneIdx + 1)}
          disabled={isLast}
          className="w-9 h-9 shrink-0 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 flex items-center justify-center"
          title="Next scene"
        >
          <span className="material-symbols-outlined text-lg">skip_next</span>
        </button>

        <div className="flex-grow flex items-center gap-1 min-w-0" aria-label="Scenes">
          {scenes.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              title={`Scene ${i + 1}`}
              className={`h-2 flex-1 rounded-full transition-all ${i < sceneIdx ? 'bg-emerald-500/70' : i === sceneIdx ? 'bg-amber-400' : 'bg-slate-700 hover:bg-slate-500'}`}
            />
          ))}
        </div>
        <span className="hidden sm:inline text-[11px] font-mono text-slate-500 shrink-0">{sceneIdx + 1}/{scenes.length}</span>
      </div>

      <div className="mt-3 space-y-1.5">
        {lines.map((line, i) => {
          const active = i === lineIdx && (playing || status !== 'idle');
          const isNarrator = !line.who || line.who === 'Narrator';
          return (
            <div key={i} className={`flex items-start gap-2 rounded-lg px-1.5 py-1 transition-all duration-300 ${active ? 'bg-white/5' : ''} ${playing && i > lineIdx ? 'opacity-40' : ''}`}>
              {isNarrator
                ? <span className={`shrink-0 material-symbols-outlined text-base mt-0.5 ${active && status === 'speaking' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`}>record_voice_over</span>
                : <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full border text-[11px] font-bold ${CHARACTER_STYLES[line.who] || 'bg-slate-700 text-slate-200 border-slate-600'} ${active && status === 'speaking' ? 'animate-pulse' : ''}`}>{line.who}</span>}
              <p className={`text-sm md:text-base leading-relaxed ${isNarrator ? 'text-slate-300 italic' : 'text-slate-100'}`}>{lineText(line, language)}</p>
            </div>
          );
        })}
        {status === 'waiting' && (
          <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-bold uppercase tracking-wider animate-pulse">Your turn</span>
        )}
      </div>
      {!playing && status === 'idle' && sceneIdx === 0 && (
        <p className="mt-2 text-xs text-amber-300/90 font-semibold">▶ Press the green play button: the family talks through the story and it moves to the next scene by itself. You can also drag things in the picture any time.</p>
      )}
    </div>
  );
}
