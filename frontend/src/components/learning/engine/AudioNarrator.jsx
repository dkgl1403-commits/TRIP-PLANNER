import React, { useState, useEffect } from 'react';

export function AudioNarrator({ text, language = 'en' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);
      
      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
      };
      
      loadVoices();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Stop playback when unmounting or changing text
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis, text]);

  // Helper to select the best voice for Indian Accent / Hinglish / English
  const getBestVoice = (isHindiMode) => {
    if (!voices || voices.length === 0) return { voice: null, lang: isHindiMode ? 'hi-IN' : 'en-US' };

    if (isHindiMode) {
      // 1. Check for native Hindi voices (Devanagari / Hindi)
      const nativeHindi = voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi' || v.name.toLowerCase().includes('hindi'));
      if (nativeHindi) {
        return { voice: nativeHindi, lang: 'hi-IN' };
      }

      // 2. Check for Indian English voices (en-IN) which pronounce Romanized Hinglish naturally
      const indianEnglish = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN') || v.name.toLowerCase().includes('india'));
      if (indianEnglish) {
        return { voice: indianEnglish, lang: 'en-IN' };
      }

      // 3. Fallback to any Indian locale voice
      const genericIndian = voices.find(v => v.lang.includes('IN'));
      if (genericIndian) {
        return { voice: genericIndian, lang: genericIndian.lang };
      }

      // 4. Default fallback to clear English voice
      const fallbackEng = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US')) || voices[0];
      return { voice: fallbackEng, lang: 'en-US' };
    } else {
      // English Mode Voice Selection
      const englishVoice = voices.find(v => (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US')) && 
                                           (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('raju') || v.name.toLowerCase().includes('prabhat')))
                        || voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'))
                        || voices[0];
      return { voice: englishVoice, lang: englishVoice ? englishVoice.lang : 'en-US' };
    }
  };

  const togglePlay = () => {
    if (!speechSynthesis || !text) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Cancel any previous audio immediately
    speechSynthesis.cancel();

    // Clean text (remove HTML tags or markdown if present)
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[\*\_]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isHindiMode = language === 'hi';
    const { voice, lang } = getBestVoice(isHindiMode);

    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = lang;

    // Rate & Pitch Tuning for maximum clarity
    utterance.rate = 0.85; // Slightly slower for crisp articulation
    utterance.pitch = 1.0; // Natural conversational pitch

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      setIsPlaying(false);
    };

    // Speak inside direct touch gesture event loop for iOS/Android compatibility
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (!speechSynthesis) return null;

  return (
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
  );
}

