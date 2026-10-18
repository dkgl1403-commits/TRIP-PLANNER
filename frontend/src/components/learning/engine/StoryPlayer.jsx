import React, { useState, useEffect, useRef } from 'react';

// Plays a lesson part as a sequence of narrated scenes. Each scene has its own line of
// narration (English `say`, Hinglish `sayHi`) and a `visual` state the widget animates to.
// Scenes with `wait: true` pause after narration until the learner completes the task.

const ttsUrl = (text, language, voice) =>
  `/api/learning/tts?text=${encodeURIComponent(text)}&lang=${language}&voice=${voice}`;

export const sceneText = (scene, language) =>
  (language === 'hi' && scene.sayHi) ? scene.sayHi : scene.say;

export function StoryPlayer({ scenes, sceneIdx, onSceneChange, language = 'en', voice = 'female', interactionDone }) {
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | speaking | waiting | done
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const scene = scenes[sceneIdx];
  const isLast = sceneIdx === scenes.length - 1;

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

  // Speak the current scene whenever we are playing and the scene or language changes
  useEffect(() => {
    if (!playing || !scene) return undefined;
    stopAudio();
    const text = sceneText(scene, language);
    setStatus('loading');

    const audio = new Audio(ttsUrl(text, language, voice));
    audioRef.current = audio;
    let fellBack = false;
    const fallBack = () => {
      // TTS unavailable: keep the story moving at reading pace so the animation still plays
      if (fellBack || audioRef.current !== audio) return;
      fellBack = true;
      setStatus('speaking');
      const words = text.split(/\s+/).length;
      timerRef.current = setTimeout(finishScene, Math.max(2500, words * 380));
    };
    audio.onended = finishScene;
    audio.onerror = fallBack;
    audio.play().then(() => setStatus('speaking')).catch(fallBack);

    // Warm the server cache for the next scene so there is no gap between scenes
    const next = scenes[sceneIdx + 1];
    if (next) fetch(ttsUrl(sceneText(next, language), language, voice)).catch(() => {});

    return stopAudio;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, sceneIdx, language]);

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

      <div className="mt-3 min-h-[3.5rem] flex items-start gap-2">
        {status === 'waiting'
          ? <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-bold uppercase tracking-wider animate-pulse">Your turn</span>
          : <span className={`shrink-0 material-symbols-outlined text-base ${status === 'speaking' ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`}>record_voice_over</span>}
        <p className="text-sm md:text-base text-slate-200 leading-relaxed">{sceneText(scene, language)}</p>
      </div>
      {!playing && status === 'idle' && sceneIdx === 0 && (
        <p className="mt-1 text-xs text-amber-300/90 font-semibold">▶ Press the green play button: the story is narrated and moves to the next scene by itself. You can also drag things in the picture any time.</p>
      )}
    </div>
  );
}
