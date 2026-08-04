import React, { useState, useEffect, useMemo } from 'react';
import LessonEngine from './engine/LessonEngine';

// Highlight matching substring in text
function Highlight({ text, query }) {
  if (!query || !text) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-neon-coral/30 text-neon-coral rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

function TopicList({ user, subjectId, onBack }) {
  const [topics, setTopics] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [startAtQuiz, setStartAtQuiz] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch Topics
    fetch(`/api/learning/topics/${subjectId}`)
      .then(res => res.json())
      .then(data => {
        setTopics(data.topics || []);
      })
      .catch(err => console.error("Error fetching topics:", err));

    // Fetch Progress if user exists
    if (user && user.login_id) {
      fetch(`/api/learning/progress/${user.login_id}`)
        .then(res => res.json())
        .then(data => {
          setProgressData(data.progress || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching progress:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [subjectId, user]);

  const getTopicProgress = (topicId) => {
    const p = progressData.find(x => x.topic_id === topicId);
    return p ? p.percentage : 0;
  };

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(topic => {
      const chapterStr = `chapter ${topic.order_idx}`;
      const nameMatch = topic.name.toLowerCase().includes(q);
      const chapterMatch = chapterStr.includes(q) || String(topic.order_idx) === q;
      const contentMatch = topic.content_summary
        ? topic.content_summary.toLowerCase().includes(q)
        : false;
      return nameMatch || chapterMatch || contentMatch;
    });
  }, [topics, searchQuery]);

  // Which topic IDs matched via content (not name/chapter) â€” used for badge
  const contentMatchIds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return new Set();
    return new Set(
      filteredTopics
        .filter(t => {
          const nameMatch = t.name.toLowerCase().includes(q);
          const chapterMatch = `chapter ${t.order_idx}`.includes(q) || String(t.order_idx) === q;
          return !nameMatch && !chapterMatch && t.content_summary?.toLowerCase().includes(q);
        })
        .map(t => t.id)
    );
  }, [filteredTopics, searchQuery]);

  if (selectedTopicId) {
    return (
      <LessonEngine 
        topicId={selectedTopicId} 
        startAtQuiz={startAtQuiz}
        user={user} 
        onBack={() => {
          setSelectedTopicId(null);
          setStartAtQuiz(false);
          // Refresh progress when coming back
          if (user && user.login_id) {
            fetch(`/api/learning/progress/${user.login_id}`)
              .then(res => res.json())
              .then(data => setProgressData(data.progress || []));
          }
        }} 
      />
    );
  }

  return (
    <>
      {/* Sub-header for Back Navigation */}
      <div className="fixed top-20 left-0 right-0 h-16 bg-surface-container/90 backdrop-blur-md border-b border-glass-stroke z-30 flex items-center px-6 md:px-8 shadow-sm">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-on-surface-variant hover:text-neon-coral transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-title-md font-medium tracking-wide">Back to Subjects</span>
        </button>
      </div>

      <div className="px-6 pb-6 pt-44 md:px-8 md:pb-8 md:pt-48 max-w-5xl mx-auto min-h-screen text-on-surface">
        {/* Header + Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="font-display-lg text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-coral to-neon-purple">
            Topics
          </h1>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80 md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by chapter, name, or content..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container border border-glass-stroke text-sm text-white placeholder-on-surface-variant focus:outline-none focus:border-neon-coral/60 focus:ring-1 focus:ring-neon-coral/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Search result count */}
        {searchQuery.trim() && !loading && (
          <p className="text-sm text-on-surface-variant mb-4">
            {filteredTopics.length === 0
              ? 'No topics matched your search.'
              : `${filteredTopics.length} of ${topics.length} topics matched`}
            {filteredTopics.length > 0 && contentMatchIds.size > 0 && (
              <span className="ml-2 text-neon-coral">
                Â· {contentMatchIds.size} matched inside content
              </span>
            )}
          </p>
        )}

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-coral"></div></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTopics.map(topic => {
            const progress = getTopicProgress(topic.id);
            const isWip = topic.is_wip;
            const boardText = topic.board_type === 'BOTH' ? 'CBSE & ICSE' : topic.board_type;
            const isContentMatch = contentMatchIds.has(topic.id);
            const q = searchQuery.trim();

            return (
              <div 
                key={topic.id} 
                className={`bg-surface-container-high rounded-2xl p-6 border ${isWip ? 'border-surface-variant opacity-70' : 'border-glass-stroke shadow-xl hover:shadow-neon-coral/20 cursor-pointer'} transition-all relative overflow-hidden`}
                onClick={() => !isWip && setSelectedTopicId(topic.id)}
              >
                {isWip && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="bg-surface-container px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                      <span className="material-symbols-outlined text-neon-coral text-sm">lock</span>
                      <span className="text-sm font-bold text-white tracking-wide">WORK IN PROGRESS</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-neon-coral font-bold text-sm tracking-widest uppercase mb-1 block">
                      <Highlight text={`Chapter ${topic.order_idx}`} query={q} />
                    </span>
                    <h3 className="text-xl font-bold">
                      <Highlight text={topic.name} query={q} />
                    </h3>
                    {/* Content match badge */}
                    {isContentMatch && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-neon-coral/80 bg-neon-coral/10 border border-neon-coral/20 rounded-full px-2 py-0.5">
                        <span className="material-symbols-outlined text-[12px]">article</span>
                        Matched inside content
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full bg-surface-variant text-xs font-bold text-on-surface-variant border border-white/5">
                      {boardText}
                    </span>
                    {!isWip && (
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedTopicId(topic.id); setStartAtQuiz(true); }}
                          className="px-3 py-1 bg-surface-variant hover:bg-neon-purple text-white rounded-full text-xs font-bold transition-colors border border-white/10"
                        >
                          Jump to Quiz
                        </button>
                        <span className="material-symbols-outlined text-neon-coral">play_circle</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-surface-variant rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-neon-purple to-neon-coral h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-right text-xs text-on-surface-variant mt-1">{progress}% Completed</div>
              </div>
            );
          })}
          {filteredTopics.length === 0 && !loading && (
            <div className="flex flex-col items-center py-16 text-on-surface-variant gap-4">
              <span className="material-symbols-outlined text-5xl opacity-30">search_off</span>
              <p className="text-base">No topics matched <strong className="text-white">"{searchQuery}"</strong></p>
              <button onClick={() => setSearchQuery('')} className="text-neon-coral text-sm hover:underline">Clear search</button>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}

export default TopicList;
