import React, { useState, useEffect } from 'react';
import { WidgetRegistry } from '../widgets/AcademicWidgets';
import { AudioNarrator } from './AudioNarrator';
import { MiniChallenge } from './MiniChallenge';
import confetti from 'canvas-confetti';

function LessonEngine({ topicId, user, startAtQuiz, onBack }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPartIdx, setCurrentPartIdx] = useState(0);
  const [audioLanguage, setAudioLanguage] = useState('en');

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
  // True interactive storytelling uses 50/50 split if there's a visual. 
  // MCQs and Cheatsheets might use full width.
  const isInteractiveStory = currentPart.widgetType && currentPart.widgetType !== 'MCQEngine' && currentPart.widgetType !== 'CheatSheet';
  const hasVisual = !!(currentPart.widgetType && WidgetRegistry[currentPart.widgetType]) || !!currentPart.imageUrl;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white font-sans flex flex-col overflow-hidden">
      
      {/* Top Progress Bar Line */}
      <div className="w-full h-1 bg-gray-900">
        <div 
          className="h-full bg-neon-coral transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,107,107,0.8)]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Top Navigation Header */}
      <div className="w-full px-2 py-1 lg:px-3 lg:py-2 flex justify-between items-center bg-black z-50">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span className="hidden sm:inline">Exit Lesson</span>
        </button>
        
        <div className="text-gray-400 font-medium tracking-wide text-sm">
          Step {currentPartIdx + 1} of {config.parts.length} <span className="mx-2 opacity-50">•</span> <span className="text-neon-coral">{progressPercent}%</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            <button 
              onClick={() => setAudioLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${audioLanguage === 'en' ? 'bg-neon-coral text-white shadow-[0_0_8px_rgba(255,107,107,0.5)]' : 'text-gray-400 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setAudioLanguage('hi')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${audioLanguage === 'hi' ? 'bg-neon-purple text-white shadow-[0_0_8px_rgba(157,78,221,0.5)]' : 'text-gray-400 hover:text-white'}`}
            >
              HI
            </button>
          </div>
          {currentPart.audioText && (
            <AudioNarrator 
              text={audioLanguage === 'hi' && currentPart.audioTextHinglish ? currentPart.audioTextHinglish : currentPart.audioText} 
              language={audioLanguage}
            />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Narrative Text (if applicable) */}
        {(!hasVisual || isInteractiveStory) && (
          <div className={`w-full shrink-0 ${hasVisual ? 'lg:w-1/2 lg:border-r border-white/5' : 'lg:w-full'} px-4 pt-6 pb-6 lg:px-8 lg:pt-8 xl:px-12 flex flex-col justify-start lg:overflow-y-auto bg-gradient-to-b from-[#15171a] to-[#0c0e11] bg-canvas-texture shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]`}>
            <div className={`mx-auto w-full ${hasVisual ? 'max-w-2xl' : 'max-w-4xl'} relative z-10`}>
              
              <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-1 leading-normal pt-2 pb-1">
                {currentPart.title}
              </h1>
              
              {currentPart.readingTime && (
                <div className="text-gray-500 font-mono text-sm mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  {currentPart.readingTime}
                </div>
              )}

              {currentPart.narrative && (
                <div 
                  className="prose prose-invert prose-lg md:prose-xl max-w-none prose-p:leading-relaxed prose-headings:text-neon-coral prose-strong:text-white prose-strong:font-bold font-serif"
                  dangerouslySetInnerHTML={{ __html: currentPart.narrative }}
                />
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
            </div>
          </div>
        )}

        {/* Right Column: Visual Diagram / Widget */}
        {hasVisual && (
          <div className={`w-full shrink-0 relative ${isInteractiveStory ? 'lg:w-1/2 lg:h-auto' : 'w-full lg:min-h-[80vh]'} flex justify-center items-start lg:items-center bg-black lg:overflow-y-auto py-8 lg:py-0`}>
            {currentPart.widgetType && WidgetRegistry[currentPart.widgetType] ? (
              React.createElement(WidgetRegistry[currentPart.widgetType], { data: currentPart.widgetData, part: currentPart })
            ) : currentPart.imageUrl ? (
              <img src={currentPart.imageUrl} className="max-w-full max-h-full object-contain p-4 lg:p-8" alt={currentPart.title} />
            ) : null}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="w-full px-3 py-2 flex justify-between items-center border-t border-white/10 bg-black/80 z-40">
        <button 
          onClick={handlePrev} 
          disabled={currentPartIdx === 0}
          className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-0 transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_left_alt</span>
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-1.5 bg-neon-coral text-white text-base font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,107,107,0.6)] hover:scale-105 transition-all group"
        >
          {isFinalScene ? 'Finish Lesson' : 'Continue'}
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
        </button>
      </div>
      
    </div>
  );
}

export default LessonEngine;
