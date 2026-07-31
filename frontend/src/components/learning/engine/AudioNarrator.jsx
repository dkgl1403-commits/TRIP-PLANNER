import React, { useState, useEffect } from 'react';

export function AudioNarrator({ text, language = 'en' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [utterance, setUtterance] = useState(null);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);
      
      const loadVoices = () => {
        setVoices(synth.getVoices());
      };
      
      loadVoices();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  useEffect(() => {
    if (!speechSynthesis || !text) return;

    // Stop any ongoing speech when text changes
    speechSynthesis.cancel();
    setIsPlaying(false);

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.rate = 0.9; 
    
    // Select appropriate voice based on language
    if (voices.length > 0) {
      if (language === 'hi') {
        // Specifically look for Indian male voices first (Hemant, Madhur)
        const hindiVoice = voices.find(v => v.lang.includes('hi') && (v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('madhur')))
                        || voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi')
                        || voices.find(v => v.name.toLowerCase().includes('hindi'))
                        || voices.find(v => v.lang.includes('IN')); 
        if (hindiVoice) newUtterance.voice = hindiVoice;
        
        // Trick for Hinglish written in Latin: Set the lang attribute explicitly
        newUtterance.lang = 'hi-IN';
      } else {
        newUtterance.pitch = 0.8; // Lower pitch for intensity (English voices handle this better)
        newUtterance.rate = 0.85;

        const englishVoice = voices.find(v => (v.lang.includes('en-GB') || v.lang.includes('en-US')) && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy')))
                          || voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US'));
        if (englishVoice) newUtterance.voice = englishVoice;
      }
    }
    
    newUtterance.onend = () => setIsPlaying(false);
    newUtterance.onerror = () => setIsPlaying(false);

    setUtterance(newUtterance);

    return () => {
      speechSynthesis.cancel();
    };
  }, [text, speechSynthesis, voices, language]);

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
