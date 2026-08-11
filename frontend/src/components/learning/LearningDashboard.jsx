import React, { useState, useEffect, useRef } from 'react';
import TopicList from './TopicList';

function LearningDashboard({ user, onBack }) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setSearchQuery(cls.name);
    setIsDropdownOpen(false);
    setSelectedSubjectId(null);
    setLoadingSubjects(true);

    fetch(`/api/learning/subjects?class_id=${cls.id}`)
      .then(res => res.json())
      .then(data => {
        setSubjects(data.subjects || []);
        setLoadingSubjects(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingSubjects(false);
      });
  };

  const handleClearSelection = () => {
    setSelectedClass(null);
    setSearchQuery('');
    setSubjects([]);
    setSelectedSubjectId(null);
    setIsDropdownOpen(true);
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

  // Helper icons for subjects
  const getSubjectIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return 'calculate';
    if (n.includes('physic')) return 'bolt';
    if (n.includes('science')) return 'science';
    if (n.includes('ai') || n.includes('intelligence')) return 'psychology';
    if (n.includes('agile')) return 'sync';
    if (n.includes('corporate')) return 'business_center';
    if (n.includes('trade')) return 'show_chart';
    return 'menu_book';
  };

  const getSubjectGradient = (index) => {
    const gradients = [
      'from-neon-coral/20 to-neon-purple/20 border-neon-coral/30 hover:border-neon-coral text-neon-coral',
      'from-sky-500/20 to-indigo-500/20 border-sky-500/30 hover:border-sky-400 text-sky-400',
      'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400 text-emerald-400',
      'from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-400 text-amber-400',
      'from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-400 text-purple-400'
    ];
    return gradients[index % gradients.length];
  };

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

      <div className="px-6 pb-12 pt-44 md:px-8 md:pb-16 md:pt-48 max-w-5xl mx-auto min-h-screen text-on-surface">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display-lg text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-coral via-neon-purple to-sky-400 mb-3">
            Learning Center
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-xl mx-auto">
            Search your class to explore tailored interactive courses, masterclasses, and visual simulations.
          </p>
        </div>

        {/* Google-style Search Bar Container */}
        <div className="max-w-2xl mx-auto mb-12 relative" ref={dropdownRef}>
          <div 
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-surface-container-high/90 backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
              isDropdownOpen ? 'border-neon-coral ring-2 ring-neon-coral/20' : 'border-glass-stroke hover:border-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-2xl text-neon-coral">search</span>
            
            <input
              type="text"
              placeholder="Search or select class (e.g. Class 11, Class 10, Masterclass)..."
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              className="w-full bg-transparent text-on-surface font-title-lg text-lg focus:outline-none placeholder:text-on-surface-variant/60"
            />

            {searchQuery && (
              <button 
                onClick={handleClearSelection}
                className="p-1 rounded-full text-on-surface-variant hover:text-neon-coral hover:bg-white/10 transition-colors"
                title="Clear"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>

          {/* Search Dropdown Popup */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high/95 backdrop-blur-2xl border border-glass-stroke rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-72 overflow-y-auto py-2">
                {loading ? (
                  <div className="p-4 text-center text-on-surface-variant flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neon-coral"></div>
                    <span>Loading classes...</span>
                  </div>
                ) : filteredClasses.length === 0 ? (
                  <div className="p-6 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-3xl mb-1 text-slate-500">search_off</span>
                    <p className="text-sm">No class found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  filteredClasses.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => handleClassSelect(cls)}
                      className={`w-full px-6 py-3.5 text-left font-title-lg text-base flex items-center justify-between transition-colors ${
                        selectedClass?.id === cls.id 
                          ? 'bg-neon-coral/20 text-neon-coral font-bold' 
                          : 'text-on-surface hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-xl text-neon-purple">school</span>
                        {cls.name}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant font-mono">
                        Level {cls.level}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Subjects Display Area - Glassmorphic Cards */}
        {selectedClass && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6 border-b border-glass-stroke pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-neon-coral block mb-1">Selected Class</span>
                <h2 className="text-3xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-neon-purple text-3xl">local_library</span>
                  {selectedClass.name}
                </h2>
              </div>
              <span className="text-sm text-on-surface-variant font-medium bg-surface-container-high px-4 py-1.5 rounded-full border border-glass-stroke">
                {subjects.length} {subjects.length === 1 ? 'Subject' : 'Subjects'} Available
              </span>
            </div>

            {loadingSubjects ? (
              <div className="flex justify-center p-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neon-coral"></div>
              </div>
            ) : subjects.length === 0 ? (
              <div className="bg-surface-container-high/50 backdrop-blur-md rounded-2xl p-12 text-center border border-glass-stroke max-w-md mx-auto">
                <span className="material-symbols-outlined text-5xl text-slate-500 mb-2">folder_off</span>
                <h3 className="text-xl font-bold mb-1">No Subjects Found</h3>
                <p className="text-on-surface-variant text-sm">There are currently no subjects configured for {selectedClass.name}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map((subject, idx) => {
                  const styleClass = getSubjectGradient(idx);
                  const icon = getSubjectIcon(subject.name);
                  return (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubjectId(subject.id)}
                      className={`group p-6 rounded-3xl bg-surface-container-high/60 backdrop-blur-xl border-2 transition-all duration-300 hover:scale-[1.02] shadow-xl text-left flex items-start justify-between ${styleClass}`}
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-2xl">{icon}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-on-surface group-hover:text-white transition-colors">
                            {subject.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Click to explore topics, visualizers, and interactive lessons &rarr;
                          </p>
                        </div>
                      </div>

                      <span className="material-symbols-outlined text-2xl opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default LearningDashboard;
