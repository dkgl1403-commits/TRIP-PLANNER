import React, { useState, useEffect } from 'react';

export function AudioNarrator({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    if (!speechSynthesis || !text) return;

    // Stop any ongoing speech when text changes
    speechSynthesis.cancel();
    setIsPlaying(false);

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.rate = 0.95; // Slightly slower for better comprehension
    
    newUtterance.onend = () => setIsPlaying(false);
    newUtterance.onerror = () => setIsPlaying(false);

    setUtterance(newUtterance);

    return () => {
      speechSynthesis.cancel();
    };
  }, [text, speechSynthesis]);

  const togglePlay = () => {
    if (!speechSynthesis || !utterance) return;

    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  if (!speechSynthesis) return null; // Browser doesn't support TTS

  return (
    <button 
      onClick={togglePlay}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
        isPlaying ? 'bg-neon-coral/20 border-neon-coral text-neon-coral shadow-[0_0_10px_rgba(255,107,107,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
      title={isPlaying ? "Pause Narration" : "Listen to Narration"}
    >
      <span className="material-symbols-outlined text-xl">
        {isPlaying ? 'volume_up' : 'volume_off'}
      </span>
      <span className="font-medium">{isPlaying ? 'Playing...' : 'Audio'}</span>
    </button>
  );
}
