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
      <div className="fixed inset-0 z-50 bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-coral"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col justify-center items-center text-error">
        <p>Failed to load lesson configuration.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-surface-variant text-on-surface rounded-lg">Go Back</button>
      </div>
    );
  }

  const currentPart = config.parts[currentPartIdx];

  const renderPart = (part) => {
    return (
      <div className="animate-fadeIn w-full max-w-7xl mx-auto h-full flex flex-col pt-8 pb-32">
        <div className="flex-none mb-8 px-8">
          <h2 className="text-4xl md:text-5xl font-display-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-coral to-neon-purple mb-4">
            {part.title}
          </h2>
          {part.description && <p className="text-xl text-on-surface-variant mb-6">{part.description}</p>}
          {part.content && <p className="text-lg leading-relaxed whitespace-pre-wrap">{part.content}</p>}
        </div>
        
        <div className="flex-1 w-full px-8 flex flex-col gap-8 overflow-y-auto overflow-x-hidden pb-12 custom-scrollbar">
          {/* Render Single Widget */}
          {part.widgetType && WidgetRegistry[part.widgetType] && (
            <div className="w-full flex justify-center">
              {React.createElement(WidgetRegistry[part.widgetType], { data: part.widgetData })}
            </div>
          )}

          {/* Render Multiple Widgets if array */}
          {part.widgets && part.widgets.length > 0 && (
            <div className="w-full flex flex-col gap-12">
              {part.widgets.map((w, i) => {
                const WidgetComponent = WidgetRegistry[w.widgetType];
                if (!WidgetComponent) return <div key={i} className="text-error">Widget {w.widgetType} not found</div>;
                return (
                  <div key={i} className="flex flex-col gap-4">
                    {w.title && <h3 className="text-2xl font-bold">{w.title}</h3>}
                    <WidgetComponent data={w.widgetData} />
                  </div>
                );
              })}
            </div>
          )}
          
          {currentPartIdx === config.parts.length - 1 && (
            <div className="mt-12 text-center p-12 bg-surface-variant rounded-2xl border border-neon-purple shadow-[0_0_30px_rgba(157,78,221,0.2)]">
              <span className="material-symbols-outlined text-8xl text-neon-purple mb-4 drop-shadow-[0_0_15px_rgba(157,78,221,0.5)]">military_tech</span>
              <h3 className="text-4xl font-bold">Course Completed!</h3>
              <p className="text-neon-coral text-xl mt-4">You have mastered Trigonometry.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-background text-on-surface flex flex-col overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="flex-none h-16 bg-surface-container-low border-b border-glass-stroke flex items-center px-4 justify-between shadow-md z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-surface-variant text-on-surface-variant rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-bold text-xl hidden md:block">{config.topicName || "Learning Topic"}</h1>
        </div>
        
        {/* Section Indicators */}
        <div className="flex-1 max-w-3xl mx-8 flex items-center justify-between relative">
          <div className="absolute left-0 right-0 h-1 bg-surface-variant top-1/2 -translate-y-1/2 -z-10"></div>
          {config.parts.map((p, idx) => {
            const isPast = idx < currentPartIdx;
            const isCurrent = idx === currentPartIdx;
            return (
              <button 
                key={idx}
                onClick={() => setCurrentPartIdx(idx)}
                className={`relative flex flex-col items-center group ${isPast || isCurrent ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                disabled={!(isPast || isCurrent)}
                title={p.title}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCurrent ? 'bg-neon-coral text-background scale-110 shadow-[0_0_10px_rgba(255,107,107,0.5)]' :
                  isPast ? 'bg-neon-purple text-background' :
                  'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {idx + 1}
                </div>
                <span className={`absolute top-10 text-[10px] whitespace-nowrap hidden md:block transition-all duration-300 ${isCurrent ? 'text-neon-coral font-bold opacity-100' : 'text-on-surface-variant opacity-0 group-hover:opacity-100'}`}>
                  {p.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="w-10"></div> {/* Spacer for symmetry */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-container-low via-background to-background">
        {renderPart(currentPart)}
      </div>

      {/* Bottom Control Bar */}
      <div className="flex-none p-4 bg-glass-fill backdrop-blur-md border-t border-glass-stroke flex justify-center gap-6 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
        <button 
          onClick={handlePrev} 
          disabled={currentPartIdx === 0}
          className="px-8 py-3 rounded-xl font-bold bg-surface-variant text-on-surface disabled:opacity-30 transition-all hover:bg-surface-container-highest flex items-center gap-2"
        >
          <span className="material-symbols-outlined">navigate_before</span> Previous
        </button>
        <button 
          onClick={handleNext}
          className="px-10 py-3 rounded-xl font-bold bg-gradient-to-r from-neon-purple to-neon-coral text-white shadow-lg shadow-neon-coral/30 hover:shadow-neon-coral/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          {currentPartIdx === config.parts.length - 1 ? 'Finish Module' : 'Next Section'} <span className="material-symbols-outlined">navigate_next</span>
        </button>
      </div>
    </div>
  );
}

export default LessonEngine;
