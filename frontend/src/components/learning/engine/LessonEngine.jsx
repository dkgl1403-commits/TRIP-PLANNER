import React, { useState, useEffect } from 'react';
import { WidgetRegistry } from '../widgets/AcademicWidgets';
import confetti from 'canvas-confetti';

function LessonEngine({ topicId, user, onBack }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPartIdx, setCurrentPartIdx] = useState(0);

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
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching config:", err);
        setLoading(false);
      });
  }, [topicId]);

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

  const handleNext = () => {
    if (!config) return;
    if (currentPartIdx < config.parts.length - 1) {
      const newIdx = currentPartIdx + 1;
      setCurrentPartIdx(newIdx);
      const prog = Math.round((newIdx / (config.parts.length - 1)) * 100);
      updateProgress(prog, false);
    } else {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      updateProgress(100, true);
    }
  };

  const handlePrev = () => {
    if (currentPartIdx > 0) {
      setCurrentPartIdx(currentPartIdx - 1);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-coral"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center text-error">
        <p>Failed to load lesson configuration.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-white text-black rounded-lg">Go Back</button>
      </div>
    );
  }

  const currentPart = config.parts[currentPartIdx];
  const isFinalScene = currentPartIdx === config.parts.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white overflow-hidden font-sans">
      
      {/* Background Graphic Engine (True Full Screen) */}
      <div className="absolute inset-0 z-0">
        {currentPart.widgetType && WidgetRegistry[currentPart.widgetType] ? (
          React.createElement(WidgetRegistry[currentPart.widgetType], { data: currentPart.widgetData, part: currentPart })
        ) : (
          /* Default Ambient Background if no specific cinematic widget is assigned */
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black animate-pulse opacity-50"></div>
        )}
        
        {/* Render Multiple Widgets if array (Absolute overlaid) */}
        {currentPart.widgets && currentPart.widgets.length > 0 && (
          <div className="absolute inset-0">
            {currentPart.widgets.map((w, i) => {
              const WidgetComponent = WidgetRegistry[w.widgetType];
              if (!WidgetComponent) return null;
              return <WidgetComponent key={i} data={w.widgetData} part={w} />;
            })}
          </div>
        )}
      </div>

      {/* Floating UI Layer - Overlaid gracefully over the cinematic background */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
        
        {/* Floating Top Header */}
        <div className="w-full p-8 flex justify-between items-start">
          <button 
            onClick={onBack} 
            className="pointer-events-auto group flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/20"
          >
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          
          {/* Subtle Progress Nodes */}
          <div className="flex gap-3 pointer-events-auto">
            {config.parts.map((p, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentPartIdx(idx)}
                className={`w-12 h-2 rounded-full transition-all duration-700 ${
                  idx === currentPartIdx ? 'bg-neon-coral shadow-[0_0_15px_rgba(255,107,107,0.8)] scale-y-150' :
                  idx < currentPartIdx ? 'bg-white/80' : 'bg-white/20 hover:bg-white/40'
                }`}
                title={p.title}
              />
            ))}
          </div>
        </div>

        {/* Floating Context/Narrative Text (Left-aligned, large typography, no boxes) */}
        {(!currentPart.widgetType || (currentPart.widgetType !== 'MCQEngine' && currentPart.widgetType !== 'CheatSheet')) && (
          <div className="w-full h-full flex flex-col justify-center px-[10vw] max-w-[50vw]">
             <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 drop-shadow-2xl mb-8 leading-tight animate-fade-in-up">
               {currentPart.title}
             </h1>
             {currentPart.description && (
               <p className="text-3xl text-neon-coral/90 drop-shadow-lg font-light mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                 {currentPart.description}
               </p>
             )}
             {currentPart.content && (
               <div className="text-xl leading-relaxed text-gray-300 drop-shadow-md whitespace-pre-wrap animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                 {currentPart.content}
               </div>
             )}
          </div>
        )}
        
        {isFinalScene && (
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-20">
             <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-coral to-neon-purple drop-shadow-[0_0_30px_rgba(255,107,107,0.5)] animate-bounce">
               Module Mastered
             </h1>
          </div>
        )}

        {/* Floating Bottom Navigation Controls */}
        <div className="w-full p-8 flex justify-between items-end pb-[5vh]">
          <button 
            onClick={handlePrev} 
            disabled={currentPartIdx === 0}
            className="pointer-events-auto flex items-center gap-4 text-2xl font-light text-white/50 hover:text-white disabled:opacity-0 transition-all"
          >
            <span className="material-symbols-outlined text-4xl">arrow_left_alt</span>
            <span className="hidden md:inline">Previous Scene</span>
          </button>
          
          <button 
            onClick={handleNext}
            className="pointer-events-auto flex items-center gap-4 text-3xl font-bold text-neon-coral hover:text-white hover:drop-shadow-[0_0_20px_rgba(255,107,107,1)] transition-all group"
          >
            <span className="hidden md:inline">{isFinalScene ? 'Complete Journey' : 'Next Scene'}</span>
            <span className="material-symbols-outlined text-6xl group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default LessonEngine;
