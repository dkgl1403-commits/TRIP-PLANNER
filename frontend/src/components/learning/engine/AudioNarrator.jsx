import React, { useState, useEffect, useRef } from 'react';

export function AudioNarrator({ text, language = 'en' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // Stop playback when unmounting or when text/language changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, [text, language]);

  const togglePlay = () => {
    if (!text) return;

    // If currently playing, stop audio
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsLoading(true);

    // Build URL for server-side neural TTS
    const encodedText = encodeURIComponent(text);
    const audioUrl = `/api/learning/tts?text=${encodedText}&lang=${language}&voice=male`;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.oncanplaythrough = () => {
      setIsLoading(false);
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
        setIsLoading(false);
        setIsPlaying(false);
      });
    };

    audio.onended = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.onerror = (e) => {
      console.error("Server audio load failed:", e);
      setIsLoading(false);
      setIsPlaying(false);
    };

    // Load audio stream
    audio.load();
  };

  return (
    <button 
      onClick={togglePlay}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
        isPlaying 
          ? 'bg-neon-coral/20 border-neon-coral text-neon-coral shadow-[0_0_12px_rgba(255,107,107,0.4)] animate-pulse' 
          : isLoading
          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
      title={isPlaying ? "Stop Server Narration" : "Listen to Studio Server Narration"}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium text-xs md:text-sm text-amber-300">Loading Audio...</span>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-xl">
            {isPlaying ? 'volume_up' : 'volume_off'}
          </span>
          <span className="font-medium text-xs md:text-sm">
            {isPlaying ? 'Stop Audio' : 'Audio (Studio Voice)'}
          </span>
        </>
      )}
    </button>
  );
}
