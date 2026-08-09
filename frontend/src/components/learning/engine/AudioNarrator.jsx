import React, { useState, useEffect } from 'react';

export function AudioNarrator({ text, language = 'en' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [showIosTip, setShowIosTip] = useState(false);

  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);

      // Force-load iOS voices
      if (synth.getVoices().length === 0 && synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = () => {
          synth.getVoices();
        };
      }
    }
  }, []);

  // Stop playback when unmounting or changing text
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
      if (window._activeUtterance) {
        window._activeUtterance = null;
      }
    };
  }, [speechSynthesis, text]);

  const togglePlay = () => {
    if (!speechSynthesis || !text) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      window._activeUtterance = null;
      setIsPlaying(false);
      return;
    }

    // Stop any existing audio immediately
    speechSynthesis.cancel();

    // Fetch fresh voices at click time (crucial for iOS Safari)
    const currentVoices = speechSynthesis.getVoices() || [];

    // Clean HTML/markdown tags
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[\*\_]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // CRITICAL iOS FIX: Prevent WebKit Garbage Collection from killing audio mid-sentence
    window._activeUtterance = utterance;

    const isHindiMode = language === 'hi';

    if (isHindiMode) {
      // 1. Try Native Hindi voice (Devanagari/Hindi)
      const nativeHindi = currentVoices.find(v => v.lang === 'hi-IN' || v.lang === 'hi' || v.name.toLowerCase().includes('hindi'));
      // 2. Try Indian English voice (en-IN)
      const indianEnglish = currentVoices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN') || v.name.toLowerCase().includes('india'));
      
      if (nativeHindi) {
        utterance.voice = nativeHindi;
        utterance.lang = 'hi-IN';
      } else if (indianEnglish) {
        utterance.voice = indianEnglish;
        utterance.lang = 'en-IN';
      } else {
        utterance.lang = 'hi-IN'; // Fallback to iOS system default for hi-IN
      }
    } else {
      const englishVoice = currentVoices.find(v => (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US')) && 
                                                   (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('siri')))
                        || currentVoices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.lang = englishVoice ? englishVoice.lang : 'en-US';
    }

    // Rate & Pitch Tuning
    utterance.rate = isIos ? 0.9 : 0.85; // iOS Safari plays slightly slower naturally
    utterance.pitch = 1.0;

    utterance.onend = () => {
      window._activeUtterance = null;
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error on device:", e);
      window._activeUtterance = null;
      setIsPlaying(false);
    };

    // Show iOS Silent Switch reminder on iPhone if playing for first time
    if (isIos) {
      setShowIosTip(true);
      setTimeout(() => setShowIosTip(false), 5000);
    }

    // Direct user-gesture invocation required for iOS WebKit
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (!speechSynthesis) return null;

  return (
    <div className="relative inline-flex flex-col items-center">
      <button 
        onClick={togglePlay}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
          isPlaying 
            ? 'bg-neon-coral/20 border-neon-coral text-neon-coral shadow-[0_0_10px_rgba(255,107,107,0.3)] animate-pulse' 
            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
        }`}
        title={isPlaying ? "Stop Narration" : "Listen to Narration"}
      >
        <span className="material-symbols-outlined text-xl">
          {isPlaying ? 'volume_up' : 'volume_off'}
        </span>
        <span className="font-medium text-xs md:text-sm">
          {isPlaying ? 'Playing...' : 'Audio'}
        </span>
      </button>

      {/* iPhone Silent Mode Hint */}
      {showIosTip && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 p-2 bg-slate-900 border border-amber-500/80 rounded-xl text-[10px] text-amber-300 font-sans text-center shadow-2xl z-50 animate-bounce">
          🔔 <strong>iPhone Tip:</strong> If no sound, turn OFF the physical Silent switch on the side of your iPhone!
        </div>
      )}
    </div>
  );
}


