import React, { useState, useEffect } from 'react';
import LessonEngine from './engine/LessonEngine';

function TopicList({ user, subjectId, onBack }) {
  const [topics, setTopics] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

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

  if (selectedTopicId) {
    return (
      <LessonEngine 
        topicId={selectedTopicId} 
        user={user} 
        onBack={() => {
          setSelectedTopicId(null);
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
    <div className="p-6 md:p-8 max-w-5xl mx-auto min-h-screen pt-24 text-on-surface">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-surface-variant text-on-surface-variant rounded-full hover:bg-neon-coral hover:text-surface transition-colors shadow-lg shadow-black/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-display-lg text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-coral to-neon-purple">
          Topics
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-coral"></div></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {topics.map(topic => {
            const progress = getTopicProgress(topic.id);
            const isWip = topic.is_wip;
            const boardText = topic.board_type === 'BOTH' ? 'CBSE & ICSE' : topic.board_type;

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
                    <span className="text-neon-coral font-bold text-sm tracking-widest uppercase mb-1 block">Chapter {topic.order_idx}</span>
                    <h3 className="text-xl font-bold">{topic.name}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full bg-surface-variant text-xs font-bold text-on-surface-variant border border-white/5">
                      {boardText}
                    </span>
                    {!isWip && <span className="material-symbols-outlined text-neon-coral mt-2">play_circle</span>}
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
          {topics.length === 0 && <p className="text-on-surface-variant">No topics found for this subject.</p>}
        </div>
      )}
    </div>
  );
}

export default TopicList;
