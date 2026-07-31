import React, { useState, useEffect } from 'react';
import { WidgetRegistry } from '../widgets/AcademicWidgets';
import { AudioNarrator } from './AudioNarrator';
import { MiniChallenge } from './MiniChallenge';
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
      window.scrollTo(0, 0);
    } else {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      updateProgress(100, true);
    }
  };

  const handlePrev = () => {
    if (currentPartIdx > 0) {
      setCurrentPartIdx(currentPartIdx - 1);
      window.scrollTo(0, 0);
    }
  };

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

  const currentPart = config.parts[currentPartIdx];
  const isFinalScene = currentPartIdx === config.parts.length - 1;
  const progressPercent = Math.round(((currentPartIdx + 1) / config.parts.length) * 100);

  // Determine layout style based on content type
  // True interactive storytelling uses 50/50 split. 
  // MCQs and Cheatsheets might use full width.
  const isInteractiveStory = currentPart.widgetType && currentPart.widgetType !== 'MCQEngine' && currentPart.widgetType !== 'CheatSheet';

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      
      {/* Top Progress Bar Line */}
      <div className="w-full h-1 bg-gray-900">
        <div 
          className="h-full bg-neon-coral transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,107,107,0.8)]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Top Navigation Header */}
      <div className="w-full p-4 lg:p-6 flex justify-between items-center border-b border-white/10 bg-black/50 sticky top-0 z-50 backdrop-blur-md">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="hidden sm:inline">Exit Lesson</span>
        </button>
        
        <div className="text-gray-400 font-medium tracking-wide">
          Step {currentPartIdx + 1} of {config.parts.length} <span className="mx-2 opacity-50">•</span> <span className="text-neon-coral">{progressPercent}%</span>
        </div>

        <div>
          {currentPart.audioText && <AudioNarrator text={currentPart.audioText} />}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col lg:flex-row">
        
        {/* Left Column: Narrative Text (if applicable) */}
        {(!currentPart.widgetType || isInteractiveStory) && (
          <div className="w-full lg:w-1/2 p-6 lg:p-12 xl:p-16 flex flex-col justify-center overflow-y-auto border-r border-white/5 bg-gray-900/20">
            <div className="max-w-2xl mx-auto w-full">
              
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2 leading-tight">
                {currentPart.title}
              </h1>
              
              {currentPart.readingTime && (
                <div className="text-gray-500 font-mono text-sm mb-8 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  {currentPart.readingTime}
                </div>
              )}

              {currentPart.narrative && (
                <div 
                  className="prose prose-invert prose-lg md:prose-xl max-w-none prose-p:leading-relaxed prose-headings:text-neon-coral prose-strong:text-white prose-strong:font-bold"
                  dangerouslySetInnerHTML={{ __html: currentPart.narrative }}
                />
              )}

              {currentPart.miniChallenge && (
                <MiniChallenge challenge={currentPart.miniChallenge} />
              )}
              
              {currentPart.keyInsight && (
                <div className="mt-12 p-6 rounded-r-xl border-l-4 border-neon-purple bg-neon-purple/5 text-xl font-medium text-gray-200">
                  <span className="text-neon-purple mr-2">💡 Key Insight:</span>
                  {currentPart.keyInsight}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Column: Visual Diagram / Widget */}
        <div className={`w-full relative ${isInteractiveStory ? 'lg:w-1/2 h-[50vh] lg:h-auto' : 'w-full min-h-[80vh]'} flex justify-center items-center overflow-hidden bg-black`}>
          {currentPart.widgetType && WidgetRegistry[currentPart.widgetType] ? (
            React.createElement(WidgetRegistry[currentPart.widgetType], { data: currentPart.widgetData, part: currentPart })
          ) : (
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black opacity-30"></div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full p-6 flex justify-between items-center border-t border-white/10 bg-black/80 z-40">
        <button 
          onClick={handlePrev} 
          disabled={currentPartIdx === 0}
          className="flex items-center gap-3 px-6 py-3 rounded-full text-lg font-medium text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-0 transition-all"
        >
          <span className="material-symbols-outlined">arrow_left_alt</span>
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          className="flex items-center gap-3 px-8 py-4 bg-neon-coral text-white text-xl font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,107,107,0.6)] hover:scale-105 transition-all group"
        >
          {isFinalScene ? 'Finish Lesson' : 'Next Step'}
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
        </button>
      </div>
      
    </div>
  );
}

export default LessonEngine;
