import React, { useState, useEffect } from 'react';
import TopicList from './TopicList';

function LearningDashboard({ user, onBack }) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/learning/classes')
      .then(res => res.json())
      .then(data => {
        setClasses(data.classes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch classes", err);
        setLoading(false);
      });
  }, []);

  const handleClassSelect = (classId) => {
    setSelectedClassId(classId);
    setSelectedSubjectId(null);
    fetch(`/api/learning/subjects?class_id=${classId}`)
      .then(res => res.json())
      .then(data => setSubjects(data.subjects || []))
      .catch(err => console.error(err));
  };

  if (selectedSubjectId) {
    return (
      <TopicList 
        user={user} 
        subjectId={selectedSubjectId} 
        onBack={() => setSelectedSubjectId(null)} 
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
          <span className="font-title-md font-medium tracking-wide">Back to App</span>
        </button>
      </div>

      <div className="px-6 pb-6 pt-44 md:px-8 md:pb-8 md:pt-48 max-w-7xl mx-auto min-h-screen text-on-surface">
        <div className="flex items-center mb-8">
          <h1 className="font-display-lg text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-coral to-neon-purple">
            Learning Center
          </h1>
        </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-coral"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Class Selection */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-glass-stroke shadow-xl">
            <h2 className="text-2xl font-bold mb-4">1. Select Class</h2>
            <div className="flex flex-col gap-3">
              {classes.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleClassSelect(c.id)}
                  className={`p-4 rounded-xl text-left font-title-lg transition-all ${
                    selectedClassId === c.id 
                      ? 'bg-neon-coral text-surface shadow-lg shadow-neon-coral/30' 
                      : 'bg-surface-variant text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  {c.name}
                </button>
              ))}
              {classes.length === 0 && <p className="text-on-surface-variant">No classes available.</p>}
            </div>
          </div>

          {/* Subject Selection */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-glass-stroke shadow-xl">
            <h2 className="text-2xl font-bold mb-4">2. Select Subject</h2>
            {!selectedClassId ? (
              <p className="text-on-surface-variant italic">Please select a class first.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubjectId(s.id)}
                    className="p-4 rounded-xl text-left font-title-lg bg-surface-variant text-on-surface hover:bg-neon-purple hover:text-surface transition-all shadow-md"
                  >
                    {s.name}
                  </button>
                ))}
                {subjects.length === 0 && <p className="text-on-surface-variant">No subjects found for this class.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default LearningDashboard;
