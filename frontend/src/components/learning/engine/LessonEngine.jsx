import React, { useState, useEffect } from 'react';
import { WidgetRegistry } from '../widgets/TrigonometryWidgets';
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
          setConfig(data.config);
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
      // Completed
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      updateProgress(100, true);
    }
  };

  const handlePrev = () => {
    if (currentPartIdx > 0) {
      setCurrentPartIdx(currentPartIdx - 1);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-coral"></div></div>;
  }

  if (!config) {
    return <div className="p-8 text-center text-error mt-24">Failed to load lesson configuration.</div>;
  }

  const currentPart = config.parts[currentPartIdx];

  const renderPart = (part) => {
    return (
      <div className="animate-fadeIn">
        <h2 className="text-3xl font-display-lg font-bold mb-6 text-neon-coral">{part.title}</h2>
        
        {part.description && <p className="text-lg text-on-surface-variant mb-6">{part.description}</p>}
        {part.content && <p className="text-lg mb-8 leading-relaxed">{part.content}</p>}
        
        {/* Render Single Widget */}
        {part.widgetType && WidgetRegistry[part.widgetType] && (
          <div className="mb-8">
            {React.createElement(WidgetRegistry[part.widgetType])}
          </div>
        )}

        {/* Render Multiple Widgets if array */}
        {part.widgets && part.widgets.length > 0 && (
          <div className="flex flex-col gap-12 mb-8">
            {part.widgets.map((w, i) => {
              const WidgetComponent = WidgetRegistry[w.widgetType];
              if (!WidgetComponent) return <div key={i}>Widget {w.widgetType} not found</div>;
              return (
                <div key={i} className="flex flex-col gap-2">
                  {w.title && <h3 className="text-xl font-bold">{w.title}</h3>}
                  <WidgetComponent />
                </div>
              );
            })}
          </div>
        )}
        
        {currentPartIdx === config.parts.length - 1 && (
          <div className="mt-12 text-center p-8 bg-surface-variant rounded-2xl border border-neon-purple shadow-xl shadow-neon-purple/20">
            <span className="material-symbols-outlined text-6xl text-neon-purple mb-4">military_tech</span>
            <h3 className="text-2xl font-bold">Achievement Unlocked!</h3>
            <p className="text-neon-coral mt-2">The Grand Architect</p>
          </div>
        )}
      </div>
    );
  };

  const progressPct = Math.round((currentPartIdx / (config.parts.length - 1)) * 100) || 0;

  return (
    <div className="min-h-screen pt-24 pb-32 text-on-surface flex flex-col relative">
      <div className="absolute top-24 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto p-2 bg-surface-variant text-on-surface-variant rounded-full hover:bg-error hover:text-surface transition-colors shadow-lg shadow-black/5">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex-1 mx-8 pointer-events-auto max-w-xl mx-auto">
          <div className="w-full bg-surface-variant rounded-full h-3 border border-glass-stroke">
            <div className="bg-gradient-to-r from-neon-purple to-neon-coral h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto px-6 pt-16">
        {renderPart(currentPart)}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-glass-fill backdrop-blur-md border-t border-glass-stroke flex justify-center gap-4 z-20">
        <button 
          onClick={handlePrev} 
          disabled={currentPartIdx === 0}
          className="px-6 py-3 rounded-xl font-bold bg-surface-variant text-on-surface disabled:opacity-50 transition-all hover:bg-surface-container-highest"
        >
          Previous
        </button>
        <button 
          onClick={handleNext}
          className="px-8 py-3 rounded-xl font-bold bg-neon-coral text-surface shadow-lg shadow-neon-coral/30 hover:shadow-neon-coral/50 hover:-translate-y-0.5 transition-all"
        >
          {currentPartIdx === config.parts.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default LessonEngine;
