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
            return (
              <div 
                key={topic.id} 
                className="bg-surface-container-high rounded-2xl p-6 border border-glass-stroke shadow-xl hover:shadow-neon-coral/20 transition-all cursor-pointer"
                onClick={() => setSelectedTopicId(topic.id)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{topic.name}</h3>
                  <span className="material-symbols-outlined text-neon-coral">play_circle</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-surface-variant rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-neon-purple to-neon-coral h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
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
