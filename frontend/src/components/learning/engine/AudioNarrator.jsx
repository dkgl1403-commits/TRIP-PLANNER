import React, { useState, useEffect } from 'react';

// Lightweight Roman-Hinglish to Devanagari transliterator for iOS Siri voice compatibility
function hinglishToDevanagari(text) {
  if (!text) return '';
  // If text already contains native Devanagari script, return directly
  if (/[\u0900-\u097F]/.test(text)) return text;

  let converted = text;
  const wordMap = {
    "aap": "आप", "aapk": "आपक", "aapka": "आपका", "aapke": "आपके", "aapki": "आपकी",
    "hai": "है", "hain": "हैं", "ho": "हो", "hu": "हूं", "hun": "हूं",
    "me": "में", "mein": "में", "mai": "में",
    "se": "से", "ko": "को", "ka": "का", "ke": "के", "ki": "की", "par": "पर", "pe": "पे",
    "nahi": "नहीं", "nahin": "नहीं", "na": "न",
    "ya": "या", "aur": "और", "to": "तो", "bhi": "भी", "hi": "ही",
    "ye": "ये", "yeh": "यह", "voh": "वह", "woh": "वह", "is": "इस", "us": "उस",
    "kya": "क्या", "kyun": "क्यों", "kisi": "किसी", "kaise": "कैसे", "kaha": "कहा",
    "kar": "कर", "karo": "करो", "karna": "करना", "karne": "करने", "karni": "करनी", "karein": "करें", "karte": "करते", "karta": "करता",
    "baat": "बात", "samajh": "समझ", "dekh": "देख", "dekho": "देखो", "hoga": "होगा", "hogi": "होगी", "hoge": "होगे",
    "sirf": "सिर्फ", "bas": "बस", "ek": "एक", "do": "दो", "teen": "तीन", "chaar": "चार", "paanch": "पांच",
    "coin": "कॉइन", "dice": "डाइस", "probability": "प्रोबेबिलिटी", "formula": "फॉर्मूला", "rule": "रूल",
    "lesson": "लेसन", "chapter": "चैप्टर", "class": "क्लास", "math": "मैथ", "maths": "मैथ्स",
    "samajhne": "समझने", "sikhne": "सीखने", "dhyan": "ध्यान", "pyaar": "प्यार", "dost": "दोस्त"
  };

  for (const [eng, dev] of Object.entries(wordMap)) {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    converted = converted.replace(regex, dev);
  }

  return converted;
}

export function AudioNarrator({ text, language = 'en' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [showIosTip, setShowIosTip] = useState(false);

  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);

      if (synth.getVoices().length === 0 && synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = () => {
          synth.getVoices();
        };
      }
    }
  }, []);

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

    speechSynthesis.cancel();
    const currentVoices = speechSynthesis.getVoices() || [];

    // Clean HTML/markdown tags
    let cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[\*\_]/g, '');

    const isHindiMode = language === 'hi';

    // On iOS Siri, convert common Roman-Hinglish words to Devanagari so Apple Siri reads with perfect native Hindi accent
    if (isHindiMode) {
      cleanText = hinglishToDevanagari(cleanText);
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    window._activeUtterance = utterance;

    if (isHindiMode) {
      // Prioritize native Hindi Siri voice on iOS (Rishi / Lekha / hi-IN)
      const nativeHindi = currentVoices.find(v => v.lang === 'hi-IN' || v.lang === 'hi' || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('rishi') || v.name.toLowerCase().includes('lekha'));
      const indianEnglish = currentVoices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('sangeeta') || v.name.toLowerCase().includes('veena'));

      if (nativeHindi) {
        utterance.voice = nativeHindi;
        utterance.lang = 'hi-IN';
      } else if (indianEnglish) {
        utterance.voice = indianEnglish;
        utterance.lang = 'en-IN';
      } else {
        utterance.lang = 'hi-IN';
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

    // Tuning rate for clear articulation on mobile
    utterance.rate = isIos ? 0.88 : 0.85;
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

    if (isIos) {
      setShowIosTip(true);
      setTimeout(() => setShowIosTip(false), 4000);
    }

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



