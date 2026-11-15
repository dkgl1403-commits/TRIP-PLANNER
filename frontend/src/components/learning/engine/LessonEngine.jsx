import React, { useState, useEffect, useRef } from 'react';
import { WidgetRegistry } from '../widgets/AcademicWidgets';
import { AudioNarrator } from './AudioNarrator';
import { MiniChallenge } from './MiniChallenge';
import { StoryPlayer } from './StoryPlayer';
import { StageFullscreenContext, Stage3DContext } from './storyKit';
import confetti from 'canvas-confetti';

const readStore = (key, fallback) => {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
};
const writeStore = (key, value) => {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
};

function useMediaQuery(query) {
  const [match, setMatch] = useState(() => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

// "Story 1: Pizza Night · What Is a Fraction?" → "Pizza Night · What Is a Fraction?"
const shortTitle = (title = '') => title.replace(/^(Story|Part)\s*\d+\s*:\s*/i, '');

const pill = 'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all';
const pillOff = 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10';

// Drop-down list of every part of the lesson, with ticks for the parts already reached
function PartsMenu({ parts, current, reached, onPick, compact }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [open]);

  return (
    <div ref={boxRef} className="relative min-w-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 max-w-full px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
        title="All parts of this lesson"
      >
        <span className="material-symbols-outlined text-base text-amber-300">format_list_numbered</span>
        <span className="font-bold text-gray-200 shrink-0">Part {current + 1}/{parts.length}</span>
        {!compact && <span className="hidden md:inline text-gray-400 truncate max-w-[22rem]">{shortTitle(parts[current].title)}</span>}
        <span className="material-symbols-outlined text-base text-gray-400">{open ? 'expand_less' : 'expand_more'}</span>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-[min(26rem,92vw)] max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950/95 backdrop-blur-xl shadow-2xl p-2 z-[300]">
          {parts.map((p, i) => {
            const isCurrent = i === current;
            const done = i <= reached && !isCurrent;
            return (
              <button
                key={i}
                onClick={() => { onPick(i); setOpen(false); }}
                className={`w-full flex items-start gap-3 text-left px-3 py-2.5 rounded-xl transition ${isCurrent ? 'bg-amber-500/15 border border-amber-400/50' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${isCurrent ? 'bg-amber-400 text-black' : done ? 'bg-emerald-500/25 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {done ? '✓' : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm font-semibold leading-snug ${isCurrent ? 'text-amber-200' : 'text-slate-200'}`}>{shortTitle(p.title)}</span>
                  {p.readingTime && <span className="block text-[11px] text-slate-500 font-mono mt-0.5">{p.readingTime}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Bottom navigation: previous part, a dot for every part, next part (names shown on wider screens)
function PartNav({ parts, current, reached, onPick, onPrev, onNext }) {
  const isLast = current === parts.length - 1;
  const prev = parts[current - 1];
  const next = parts[current + 1];
  return (
    <div className="w-full shrink-0 border-t border-white/10 bg-black/90 backdrop-blur-md px-3 py-2 flex items-center gap-2 z-[70]">
      <button
        onClick={onPrev}
        disabled={current === 0}
        title="Previous Step"
        className="flex items-center gap-1 min-w-0 max-w-[38%] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-200 disabled:opacity-30 disabled:pointer-events-none transition"
      >
        <span className="material-symbols-outlined text-lg">chevron_left</span>
        <span className="hidden sm:inline font-semibold shrink-0">Back</span>
        {prev && <span className="hidden lg:inline text-gray-400 truncate">· {shortTitle(prev.title)}</span>}
      </button>

      <div className="flex-grow flex items-center justify-center gap-1.5 min-w-0" aria-label="Parts">
        {parts.map((p, i) => (
          <button
            key={i}
            onClick={() => onPick(i)}
            title={`Part ${i + 1}: ${shortTitle(p.title)}`}
            className={`h-2.5 rounded-full transition-all ${i === current ? 'w-7 bg-amber-400' : i <= reached ? 'w-2.5 bg-emerald-500/70 hover:bg-emerald-400' : 'w-2.5 bg-slate-700 hover:bg-slate-500'}`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        title={isLast ? 'Finish Lesson' : 'Next Step'}
        className={`flex items-center gap-1 min-w-0 max-w-[45%] px-3 py-2 rounded-xl text-sm font-bold border transition ${isLast ? 'bg-emerald-500/30 border-emerald-400/60 text-emerald-100 hover:bg-emerald-500/50' : 'bg-blue-600/40 border-blue-400/60 text-white hover:bg-blue-500/60'}`}
      >
        {isLast
          ? <><span className="material-symbols-outlined text-lg">check_circle</span><span>Finish</span></>
          : <>
            <span className="shrink-0">Next</span>
            {next && <span className="hidden lg:inline font-normal text-blue-100/80 truncate">· {shortTitle(next.title)}</span>}
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </>}
      </button>
    </div>
  );
}

// Header settings: shown inline on wider screens, behind a ⋮ button on phones
function SettingsMenu({ children }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [open]);
  return (
    <div ref={boxRef} className="relative">
      <div className="hidden sm:flex items-center gap-2">{children}</div>
      <button onClick={() => setOpen((o) => !o)} className={`sm:hidden ${pill} ${open ? 'bg-white/15 border-white/30 text-white' : pillOff}`} title="Settings: language, voice, 3D, teacher notes">
        <span className="material-symbols-outlined text-base">more_vert</span>
      </button>
      {open && (
        <div className="sm:hidden absolute right-0 mt-2 p-3 rounded-2xl border border-slate-700 bg-slate-950/95 backdrop-blur-xl shadow-2xl z-[300] flex flex-col items-start gap-3 min-w-[13rem]">
          {children}
        </div>
      )}
    </div>
  );
}

function LanguageToggle({ value, onChange }) {
  return (
    <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
      {[['en', 'EN', 'bg-neon-coral'], ['hi', 'HI', 'bg-neon-purple']].map(([v, label, on]) => (
        <button key={v} onClick={() => onChange(v)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${value === v ? `${on} text-white` : 'text-gray-400 hover:text-white'}`}>{label}</button>
      ))}
    </div>
  );
}

// Fullscreen side panel: key idea, the current "your turn" task, notes and teacher notes
function InfoPanel({ part, scene, interactionDone, teacherMode }) {
  const tabs = [['idea', 'Key idea', 'lightbulb']];
  if (part.miniChallenge) tabs.push(['check', 'Quick check', 'quiz']);
  tabs.push(['notes', 'Notes', 'menu_book']);
  if (teacherMode && part.teacherNotes) tabs.push(['teacher', 'Teacher', 'school']);
  const [tab, setTab] = useState('idea');
  const active = tabs.some(([k]) => k === tab) ? tab : 'idea';
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden">
      <div className="flex border-b border-slate-800">
        {tabs.map(([k, label, icon]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-bold transition ${active === k ? 'text-amber-300 bg-amber-500/10 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}`}>
            <span className="material-symbols-outlined text-base">{icon}</span>{label}
          </button>
        ))}
      </div>
      <div className="p-4 text-sm text-slate-300 leading-relaxed">
        {active === 'idea' && (
          <div className="space-y-4">
            {scene?.wait && (
              <div className={`p-3 rounded-xl border ${interactionDone ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200' : 'border-amber-400/60 bg-amber-500/10 text-amber-100'}`}>
                <div className="text-[11px] font-bold uppercase tracking-wider mb-1">{interactionDone ? '✔ Task done' : '👉 Your turn'}</div>
                {interactionDone ? 'Well done! The story moves on.' : 'Try the task shown under the picture. The story continues when you get it right.'}
              </div>
            )}
            {part.keyInsight && (
              <div>
                <div className="flex items-center gap-1 text-neon-purple text-[11px] font-bold uppercase tracking-widest mb-1"><span className="material-symbols-outlined text-sm">lightbulb</span>Key insight</div>
                <p className="text-slate-200">{part.keyInsight}</p>
              </div>
            )}
            <div className="hidden lg:block text-[11px] text-slate-500 border-t border-slate-800 pt-3 space-y-0.5">
              <div><b className="text-slate-400">Space</b> play / pause · <b className="text-slate-400">← →</b> scene</div>
              <div><b className="text-slate-400">Shift + ← →</b> part · <b className="text-slate-400">F</b> fullscreen · <b className="text-slate-400">Esc</b> exit</div>
            </div>
          </div>
        )}
        {active === 'check' && <MiniChallenge challenge={part.miniChallenge} />}
        {active === 'notes' && (
          part.narrative
            ? <div className="prose prose-invert prose-sm max-w-none font-sans" dangerouslySetInnerHTML={{ __html: part.narrative }} />
            : <p className="text-slate-500">No notes for this part.</p>
        )}
        {active === 'teacher' && <div className="teacher-notes prose prose-invert prose-sm max-w-none font-sans" dangerouslySetInnerHTML={{ __html: part.teacherNotes }} />}
      </div>
    </div>
  );
}

function LessonEngine({ topicId, user, startAtQuiz, onBack }) {
  const [config, setConfig] = useState(null);
  const [topicName, setTopicName] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPartIdx, setCurrentPartIdx] = useState(0);
  const [reached, setReached] = useState(0);
  const [audioLanguage, setAudioLanguage] = useState('en');
  const [narrator, setNarrator] = useState(() => readStore('learning_narrator', 'female'));
  const [teacherMode, setTeacherMode] = useState(() => readStore('learning_teacher_mode', '0') === '1');
  const [tilt3d, setTilt3d] = useState(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return readStore('learning_3d', reduce ? '0' : '1') === '1';
  });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [interactionDone, setInteractionDone] = useState(false);
  const [stageFullscreen, setStageFullscreen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const rootRef = useRef(null);
  const playerRef = useRef(null);
  const isWide = useMediaQuery('(min-width: 1024px)');

  const chooseNarrator = (value) => { setNarrator(value); writeStore('learning_narrator', value); };
  const toggleTeacherMode = () => setTeacherMode((on) => { writeStore('learning_teacher_mode', on ? '0' : '1'); return !on; });
  const toggle3d = () => setTilt3d((on) => { writeStore('learning_3d', on ? '0' : '1'); return !on; });

  // Each part starts from its first scene
  useEffect(() => { setSceneIdx(0); setSheetOpen(false); }, [currentPartIdx]);
  useEffect(() => { setInteractionDone(false); }, [currentPartIdx, sceneIdx]);

  // ── Fullscreen: real browser fullscreen where supported (falls back to covering the window, e.g. iPhone) ──
  const enterFullscreen = () => {
    setStageFullscreen(true);
    const el = document.documentElement;
    if (el.requestFullscreen && !document.fullscreenElement) el.requestFullscreen().catch(() => {});
  };
  const exitFullscreen = () => {
    setStageFullscreen(false);
    setSheetOpen(false);
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  };
  const toggleFullscreen = () => (stageFullscreen ? exitFullscreen() : enterFullscreen());
  useEffect(() => {
    const onChange = () => { if (!document.fullscreenElement) setStageFullscreen(false); };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    fetch(`/api/learning/topic/${topicId}/config`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          let parsedConfig = data.config;
          if (typeof parsedConfig === 'string') {
            try { parsedConfig = JSON.parse(parsedConfig); } catch (e) { console.error("Parse error", e); }
          }
          setConfig(parsedConfig);
          setTopicName(data.name || '');
          const saved = Number(readStore(`learning_reached_${topicId}`, '0')) || 0;
          setReached(parsedConfig?.parts ? Math.min(saved, parsedConfig.parts.length - 1) : 0);

          if (startAtQuiz && parsedConfig && parsedConfig.parts) {
            const quizIdx = parsedConfig.parts.findIndex(p => p.widgetType === 'MCQEngine');
            if (quizIdx !== -1) {
              setCurrentPartIdx(quizIdx);
            }
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching config:", err);
        setLoading(false);
      });
  }, [topicId, startAtQuiz]);

  const updateProgress = (percentage, completed) => {
    if (user && user.login_id) {
      fetch(`/api/learning/progress/${user.login_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: topicId,
          percentage: percentage,
          completed: completed
        })
      });
    }
  };

  const scrollTop = () => {
    window.scrollTo(0, 0);
    rootRef.current?.querySelectorAll('[data-scroll-reset]').forEach((el) => { el.scrollTop = 0; });
  };

  const goToPart = (idx) => {
    if (!config) return;
    const i = Math.max(0, Math.min(config.parts.length - 1, idx));
    if (i === currentPartIdx) return;
    setCurrentPartIdx(i);
    if (i > reached) {
      setReached(i);
      writeStore(`learning_reached_${topicId}`, String(i));
      updateProgress(Math.round((i / (config.parts.length - 1)) * 100), false);
    }
    scrollTop();
  };

  const handleNext = () => {
    if (!config) return;
    if (currentPartIdx < config.parts.length - 1) {
      goToPart(currentPartIdx + 1);
    } else {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      updateProgress(100, true);
    }
  };

  const handlePrev = () => goToPart(currentPartIdx - 1);

  // ── Keyboard: Space play/pause, ←/→ scene, Shift+←/→ or PageUp/PageDown part, F fullscreen, Esc exit ──
  const keyRef = useRef(null);
  keyRef.current = { handleNext, handlePrev, toggleFullscreen, exitFullscreen, stageFullscreen };
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const tag = t?.tagName;
      if (tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return;
      if (tag === 'INPUT' && t.type !== 'button') return; // sliders and text boxes keep their own keys
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = keyRef.current;
      const player = playerRef.current;
      if (e.key === 'Escape' && k.stageFullscreen) { k.exitFullscreen(); return; }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); k.toggleFullscreen(); return; }
      if (e.key === 'PageDown' || (e.shiftKey && e.key === 'ArrowRight')) { e.preventDefault(); k.handleNext(); return; }
      if (e.key === 'PageUp' || (e.shiftKey && e.key === 'ArrowLeft')) { e.preventDefault(); k.handlePrev(); return; }
      if (!player) return;
      if (e.key === ' ' && tag !== 'BUTTON') { e.preventDefault(); player.togglePlay(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); player.goTo(player.sceneIdx + 1); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); player.goTo(player.sceneIdx - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-coral"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-error">
        <p>Failed to load lesson configuration.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-white text-black rounded-lg">Go Back</button>
      </div>
    );
  }

  const parts = config.parts;
  const currentPart = parts[currentPartIdx];
  const progressPercent = Math.round(((currentPartIdx + 1) / parts.length) * 100);

  // True interactive storytelling uses a 50/50 split if there's a visual. MCQs and cheat sheets use full width.
  const isInteractiveStory = currentPart.widgetType && currentPart.widgetType !== 'MCQEngine' && currentPart.widgetType !== 'CheatSheet';
  const hasVisual = !!(currentPart.widgetType && WidgetRegistry[currentPart.widgetType]) || !!currentPart.imageUrl;
  const scenes = Array.isArray(currentPart.scenes) && currentPart.scenes.length ? currentPart.scenes : null;
  const currentScene = scenes ? scenes[Math.min(sceneIdx, scenes.length - 1)] : null;

  const storyPlayer = scenes && (
    <StoryPlayer
      scenes={scenes}
      sceneIdx={Math.min(sceneIdx, scenes.length - 1)}
      onSceneChange={setSceneIdx}
      language={audioLanguage}
      narrator={narrator}
      interactionDone={interactionDone}
      controlRef={playerRef}
      autoStart={!!playerRef.current?.playing}
    />
  );

  const widget = currentPart.widgetType && WidgetRegistry[currentPart.widgetType]
    ? React.createElement(WidgetRegistry[currentPart.widgetType], {
      key: `${currentPartIdx}-${currentPart.widgetType}`,
      data: currentPart.widgetData,
      part: currentPart,
      visual: currentScene ? currentScene.visual : undefined,
      sceneIdx,
      onInteract: () => setInteractionDone(true),
    })
    : currentPart.imageUrl
      ? <img src={currentPart.imageUrl} className="max-w-full max-h-full object-contain p-4 lg:p-8" alt={currentPart.title} />
      : null;

  const nav = <PartNav parts={parts} current={currentPartIdx} reached={reached} onPick={goToPart} onPrev={handlePrev} onNext={handleNext} />;
  const withContexts = (children) => (
    <Stage3DContext.Provider value={{ enabled: tilt3d }}>
      <StageFullscreenContext.Provider value={{ fullscreen: stageFullscreen, toggle: toggleFullscreen }}>
        {children}
      </StageFullscreenContext.Provider>
    </Stage3DContext.Provider>
  );
  const button3d = (
    <button onClick={toggle3d} className={`${pill} ${tilt3d ? 'bg-sky-500/20 border-sky-400 text-sky-300' : pillOff}`} title="3D tilt and depth effect on the pictures">
      <span className="material-symbols-outlined text-base">view_in_ar</span><span>3D</span>
    </button>
  );

  // ───────────────────────────── Immersive fullscreen ─────────────────────────────
  if (stageFullscreen && hasVisual) {
    const showSide = isWide && panelOpen;
    return withContexts(
      <div ref={rootRef} className="fixed inset-0 z-[100] bg-black text-white font-sans flex flex-col overflow-hidden">
        <div className="w-full h-1 bg-gray-900 shrink-0">
          <div className="h-full bg-neon-coral transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="w-full shrink-0 px-3 py-2 flex items-center gap-2 relative z-[90] border-b border-white/10 bg-black/90">
          <button onClick={exitFullscreen} className={`${pill} ${pillOff}`} title="Exit fullscreen (Esc)">
            <span className="material-symbols-outlined text-base">close_fullscreen</span><span className="hidden sm:inline">Exit</span>
          </button>
          <div className="min-w-0 flex-1 flex items-center gap-2">
            {topicName && <span className="hidden md:inline text-sm font-black text-white truncate max-w-[16rem]">{topicName}</span>}
            <PartsMenu parts={parts} current={currentPartIdx} reached={reached} onPick={goToPart} compact={!isWide} />
          </div>
          <div className="hidden sm:block"><LanguageToggle value={audioLanguage} onChange={setAudioLanguage} /></div>
          {button3d}
          <button
            onClick={() => (isWide ? setPanelOpen((o) => !o) : setSheetOpen(true))}
            className={`${pill} ${(isWide ? panelOpen : sheetOpen) ? 'bg-amber-500/20 border-amber-400 text-amber-300' : pillOff}`}
            title="Key idea, notes and tasks"
          >
            <span className="material-symbols-outlined text-base">info</span><span className="hidden sm:inline">Info</span>
          </button>
        </div>

        <div className="flex-1 min-h-0 flex">
          <main data-scroll-reset className="flex-1 min-w-0 overflow-y-auto px-3 md:px-6 py-3 md:py-4 flex flex-col items-center gap-3">
            {!showSide && storyPlayer && <div className="w-full max-w-3xl">{storyPlayer}</div>}
            <div className="w-full" style={{ maxWidth: isWide ? `max(32rem, calc((100vh - ${showSide ? 330 : 520}px) * 1.6))` : undefined }}>
              {widget}
            </div>
          </main>
          {showSide && (
            <aside data-scroll-reset className="w-[380px] xl:w-[420px] shrink-0 border-l border-white/10 overflow-y-auto p-3 space-y-3 bg-[#05070c]">
              <div className="px-1">
                <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Part {currentPartIdx + 1} of {parts.length}</div>
                <h2 className="text-base font-black text-white leading-snug">{currentPart.title}</h2>
              </div>
              {storyPlayer}
              <InfoPanel key={currentPartIdx} part={currentPart} scene={currentScene} interactionDone={interactionDone} teacherMode={teacherMode} />
            </aside>
          )}
        </div>

        {nav}

        {/* Phones and narrow windows: info as a bottom sheet */}
        {sheetOpen && !isWide && (
          <div className="fixed inset-0 z-[150] flex flex-col justify-end bg-black/60" onClick={() => setSheetOpen(false)}>
            <div className="max-h-[75vh] overflow-y-auto rounded-t-3xl bg-[#05070c] border-t border-slate-700 p-3 pb-6" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-600" />
              <div className="flex items-start justify-between gap-2 px-1 mb-2">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Part {currentPartIdx + 1} of {parts.length}</div>
                  <h2 className="text-base font-black text-white leading-snug">{currentPart.title}</h2>
                </div>
                <LanguageToggle value={audioLanguage} onChange={setAudioLanguage} />
              </div>
              <InfoPanel key={currentPartIdx} part={currentPart} scene={currentScene} interactionDone={interactionDone} teacherMode={teacherMode} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────── Normal layout ─────────────────────────────
  return withContexts(
    <div ref={rootRef} className="fixed inset-0 z-[100] bg-black text-white font-sans flex flex-col overflow-hidden">

      {/* Top progress bar */}
      <div className="w-full h-1 bg-gray-900 shrink-0">
        <div
          className="h-full bg-neon-coral transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,107,107,0.8)]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Header */}
      <div className="w-full shrink-0 px-3 py-2 flex gap-2 justify-between items-center relative z-[90] bg-black border-b border-white/5">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 text-sm shrink-0"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="hidden sm:inline">Exit</span>
          </button>
          {topicName && <span className="hidden xl:inline text-sm font-black text-white truncate max-w-[14rem]">{topicName}</span>}
          <PartsMenu parts={parts} current={currentPartIdx} reached={reached} onPick={goToPart} />
        </div>

        <div className="flex items-center gap-2">
          {/* Phones: settings tucked into a menu so the header stays one row */}
          <SettingsMenu>
          <LanguageToggle value={audioLanguage} onChange={setAudioLanguage} />
          {scenes && (
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10" title="Narrator voice">
              {[['female', 'Female narrator', 'face_3'], ['male', 'Male narrator', 'face']].map(([value, label, icon]) => (
                <button
                  key={value}
                  onClick={() => chooseNarrator(value)}
                  title={label}
                  className={`px-2 py-1 rounded-full text-xs font-bold transition-all flex items-center ${narrator === value ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  <span className="material-symbols-outlined text-base">{icon}</span>
                </button>
              ))}
            </div>
          )}
          {hasVisual && button3d}
          <button
            onClick={toggleTeacherMode}
            className={`${pill} ${teacherMode ? 'bg-sky-500/20 border-sky-400 text-sky-300' : pillOff}`}
            title="Show notes for teachers: how to explain, common mistakes, classroom activity"
          >
            <span className="material-symbols-outlined text-base">school</span>
            <span>Teacher notes</span>
          </button>
          </SettingsMenu>
          {hasVisual && (
            <button onClick={enterFullscreen} className={`${pill} bg-amber-500/15 border-amber-400/60 text-amber-200 hover:bg-amber-500/25`} title="Immersive fullscreen (F)">
              <span className="material-symbols-outlined text-base">fullscreen</span>
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
          )}
          {!scenes && currentPart.audioText && (
            <AudioNarrator
              text={audioLanguage === 'hi' && currentPart.audioTextHinglish ? currentPart.audioTextHinglish : currentPart.audioText}
              language={audioLanguage}
            />
          )}
        </div>
      </div>

      {/* Main content */}
      <div data-scroll-reset className="flex-grow min-h-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative z-[60]">

        {/* Left column: reading notes */}
        {(!hasVisual || isInteractiveStory) && (
          <div data-scroll-reset className={`w-full shrink-0 ${hasVisual ? 'lg:w-1/2 lg:border-r border-white/5' : 'lg:w-full'} px-4 pt-6 pb-6 lg:px-8 lg:pt-8 xl:px-12 flex flex-col justify-start lg:overflow-y-auto bg-gradient-to-b from-[#15171a] to-[#0c0e11] bg-canvas-texture shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]`}>
            <div className={`mx-auto w-full ${hasVisual ? 'max-w-2xl' : 'max-w-4xl'} relative z-10`}>

              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400/90">Part {currentPartIdx + 1} of {parts.length}</div>
              <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-1 leading-normal pb-1">
                {currentPart.title}
              </h1>

              {currentPart.readingTime && (
                <div className="text-gray-500 font-mono text-sm mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  {currentPart.readingTime}
                </div>
              )}

              {currentPart.narrative && (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
                  <div
                    className="prose prose-invert max-w-none font-sans"
                    dangerouslySetInnerHTML={{ __html: currentPart.narrative }}
                  />
                </div>
              )}

              {currentPart.miniChallenge && (
                <MiniChallenge challenge={currentPart.miniChallenge} />
              )}

              {currentPart.keyInsight && (
                <div className="mt-12 relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple to-neon-coral rounded-xl blur opacity-25"></div>
                  <div className="relative p-5 rounded-xl border border-white/10 bg-[#1a1c23]/90 shadow-2xl backdrop-blur-sm text-sm font-body-md text-gray-300 leading-relaxed transform hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-neon-purple material-symbols-outlined text-sm">lightbulb</span>
                      <span className="text-neon-purple font-bold tracking-widest uppercase text-xs">Key Insight</span>
                    </div>
                    {currentPart.keyInsight}
                  </div>
                </div>
              )}

              {teacherMode && currentPart.teacherNotes && (
                <div className="mt-8 p-5 md:p-6 rounded-2xl border border-sky-500/40 bg-sky-950/30">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-sky-300">school</span>
                    <span className="text-sky-300 font-bold tracking-widest uppercase text-xs">For Teachers</span>
                  </div>
                  <div className="teacher-notes prose prose-invert prose-sm max-w-none font-sans" dangerouslySetInnerHTML={{ __html: currentPart.teacherNotes }} />
                </div>
              )}
              <div className="h-8" />
            </div>
          </div>
        )}

        {/* Right column: story player and picture */}
        {hasVisual && (
          <div data-scroll-reset className={`w-full shrink-0 relative ${isInteractiveStory ? 'lg:w-1/2 lg:h-auto' : 'w-full lg:min-h-[80vh]'} ${scenes ? 'order-first lg:order-none flex-col justify-start items-stretch gap-4 px-3 md:px-6 pb-6 lg:pb-8' : 'py-8 lg:py-16 justify-center items-start'} flex bg-black lg:overflow-y-auto`}>
            {scenes && (
              <div className="w-full max-w-3xl mx-auto sticky top-0 z-30 pt-3 lg:pt-4 bg-black">
                {storyPlayer}
              </div>
            )}
            <div className="w-full mx-auto">{widget}</div>
          </div>
        )}
      </div>

      {nav}
    </div>
  );
}

export default LessonEngine;
