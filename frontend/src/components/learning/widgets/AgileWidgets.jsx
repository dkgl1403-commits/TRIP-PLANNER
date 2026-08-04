import React, { useState, useRef } from 'react';

export function WaterfallVsAgileWidget() {
  const [mode, setMode] = useState('waterfall');
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMode('waterfall')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${mode === 'waterfall' ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
        >
          Waterfall
        </button>
        <button 
          onClick={() => setMode('agile')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${mode === 'agile' ? 'bg-neon-coral/20 text-neon-coral border border-neon-coral' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
        >
          Agile
        </button>
      </div>

      <div className="w-full max-w-2xl h-64 border border-glass-stroke bg-black/40 rounded-xl p-6 flex items-center justify-center relative overflow-hidden">
        {mode === 'waterfall' ? (
          <div className="flex flex-col items-start w-full px-8 gap-2">
            <div className="bg-red-500/80 text-white font-bold py-2 px-6 rounded-md shadow-lg shadow-red-900/50 transform translate-x-0">Requirements</div>
            <div className="bg-orange-500/80 text-white font-bold py-2 px-6 rounded-md shadow-lg shadow-orange-900/50 transform translate-x-8">Design</div>
            <div className="bg-yellow-500/80 text-white font-bold py-2 px-6 rounded-md shadow-lg shadow-yellow-900/50 transform translate-x-16">Implementation</div>
            <div className="bg-green-500/80 text-white font-bold py-2 px-6 rounded-md shadow-lg shadow-green-900/50 transform translate-x-24">Verification</div>
            <div className="bg-blue-500/80 text-white font-bold py-2 px-6 rounded-md shadow-lg shadow-blue-900/50 transform translate-x-32">Maintenance</div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 text-xs text-red-300 bg-red-900/40 p-2 rounded border border-red-500/50">
              *Rigid flow. Hard to go backwards if requirements change.
            </div>
          </div>
        ) : (
          <div className="flex space-x-12 items-center">
            <div className="relative w-40 h-40 animate-spin-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,204,0.5)]">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#00ffcc" />
                  </marker>
                </defs>
                <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="#00ffcc" strokeWidth="4" markerEnd="url(#arrow)" />
                <path d="M 90 50 A 40 40 0 0 1 50 90" fill="none" stroke="#00ffcc" strokeWidth="4" markerEnd="url(#arrow)" />
                <path d="M 50 90 A 40 40 0 0 1 10 50" fill="none" stroke="#00ffcc" strokeWidth="4" markerEnd="url(#arrow)" />
                <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#00ffcc" strokeWidth="4" markerEnd="url(#arrow)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col text-neon-coral font-bold text-sm">
                <div>Plan</div>
                <div>Code</div>
                <div>Test</div>
                <div>Deploy</div>
              </div>
            </div>
            <div className="text-sm text-neon-coral bg-neon-coral/10 p-3 rounded-lg border border-neon-coral/30 max-w-xs">
              Fast, iterative loops. Adapts easily to changing requirements.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanFlowWidget() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'API Setup', status: 'todo' },
    { id: 2, title: 'Database Schema', status: 'todo' },
    { id: 3, title: 'React UI', status: 'todo' },
    { id: 4, title: 'Auth Service', status: 'todo' },
    { id: 5, title: 'Docker Config', status: 'done' }
  ]);
  const [error, setError] = useState('');

  const wipLimit = 2;

  const moveTask = (taskId, newStatus) => {
    if (newStatus === 'in_progress') {
      const currentWip = tasks.filter(t => t.status === 'in_progress').length;
      if (currentWip >= wipLimit) {
        setError('WIP Limit Exceeded! Finish a task before starting a new one.');
        setTimeout(() => setError(''), 3000);
        return;
      }
    }
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    setError('');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full flex justify-between mb-2">
        <h3 className="text-lg font-bold text-white">Kanban Board</h3>
        <span className="text-sm font-mono text-neon-coral bg-neon-coral/10 px-3 py-1 rounded-full border border-neon-coral/30">
          WIP Limit: {wipLimit}
        </span>
      </div>
      
      {error && (
        <div className="w-full bg-red-900/50 border border-red-500 text-red-200 p-2 rounded-lg mb-4 text-sm text-center animate-pulse">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 w-full flex-grow">
        {['todo', 'in_progress', 'done'].map(col => (
          <div key={col} className="bg-black/50 border border-glass-stroke rounded-xl p-3 flex flex-col">
            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3 font-bold border-b border-white/10 pb-2">
              {col.replace('_', ' ')}
            </h4>
            <div className="flex-grow flex flex-col gap-2">
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 cursor-pointer hover:border-neon-coral transition-colors flex justify-between items-center group">
                  <span>{task.title}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {col !== 'todo' && <button onClick={() => moveTask(task.id, col === 'done' ? 'in_progress' : 'todo')} className="text-gray-400 hover:text-white">&larr;</button>}
                    {col !== 'done' && <button onClick={() => moveTask(task.id, col === 'todo' ? 'in_progress' : 'done')} className="text-gray-400 hover:text-white">&rarr;</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SAFeAlignmentWidget() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-black/40 border border-glass-stroke rounded-2xl p-8 relative overflow-hidden">
        
        {/* Teams */}
        <div className="flex justify-around mb-12">
          {['Scrum Team A', 'Scrum Team B', 'Scrum Team C'].map((team, i) => (
            <div key={team} className="bg-blue-900/40 border border-blue-500/50 rounded-xl p-4 flex flex-col items-center z-10 w-32 relative">
              <div className="text-xs text-blue-200 font-bold mb-2 text-center">{team}</div>
              <div className="flex gap-1">
                {[1,2,3].map(j => <div key={j} className="w-4 h-4 bg-blue-400/50 rounded-full" />)}
              </div>
              <div className="absolute -bottom-10 left-1/2 w-0.5 h-10 bg-gradient-to-b from-blue-500/50 to-neon-coral/80 -translate-x-1/2"></div>
            </div>
          ))}
        </div>

        {/* The Train */}
        <div className="w-full h-24 bg-gradient-to-r from-neon-coral/20 to-purple-500/20 border border-neon-coral/50 rounded-xl flex items-center justify-between px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
          
          <div className="z-10 text-white font-black text-xl tracking-widest flex items-center gap-4">
            <span className="text-3xl">🚂</span>
            AGILE RELEASE TRAIN
          </div>
          
          <div className="z-10 bg-black/50 px-4 py-2 rounded border border-white/20 text-neon-coral font-bold text-sm">
            PI Planning Sync
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkHierarchyWidget() {
  const [expanded, setExpanded] = useState({ 0: true, 1: true });
  
  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="w-full h-full flex flex-col p-4 bg-black/40 rounded-xl border border-glass-stroke overflow-y-auto">
      <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">The Anatomy of Work</h3>
      
      <div className="pl-2 border-l-2 border-purple-500/30">
        <div className="flex items-center gap-2 mb-2 cursor-pointer group" onClick={() => toggle(0)}>
          <span className="text-purple-400 font-bold bg-purple-900/30 px-2 py-0.5 rounded text-xs">INITIATIVE</span>
          <span className="text-white group-hover:text-purple-300 transition-colors">Launch Crypto Trading</span>
        </div>
        
        {expanded[0] && (
          <div className="pl-6 border-l-2 border-blue-500/30 ml-2 mt-2">
            <div className="flex items-center gap-2 mb-2 cursor-pointer group" onClick={() => toggle(1)}>
              <span className="text-blue-400 font-bold bg-blue-900/30 px-2 py-0.5 rounded text-xs">EPIC</span>
              <span className="text-white group-hover:text-blue-300 transition-colors">Bitcoin Payment Gateway Integration</span>
            </div>
            
            {expanded[1] && (
              <div className="pl-6 border-l-2 border-green-500/30 ml-2 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 font-bold bg-green-900/30 px-2 py-0.5 rounded text-xs">STORY</span>
                  <span className="text-gray-300">As a user, I want to see my Bitcoin balance...</span>
                </div>
                
                <div className="pl-6 border-l-2 border-gray-500/30 ml-2 mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold bg-gray-800 px-2 py-0.5 rounded text-xs">TASK</span>
                    <span className="text-gray-400 text-sm">Build backend balance API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold bg-gray-800 px-2 py-0.5 rounded text-xs">TASK</span>
                    <span className="text-gray-400 text-sm">Create React UI component for balance</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function PlanningPokerWidget() {
  const fib = [1, 2, 3, 5, 8, 13, 21];
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  
  const botVotes = [3, 5, 8];

  const handleVote = (val) => {
    setSelected(val);
    setRevealed(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="bg-black/50 border border-glass-stroke rounded-xl p-6 w-full max-w-2xl text-center">
        <h3 className="text-xl font-bold text-white mb-2">Story: Add Dogecoin Logo</h3>
        <p className="text-gray-400 mb-8">Select your complexity estimate (Story Points):</p>
        
        <div className="flex justify-center gap-3 mb-8">
          {fib.map(val => (
            <button 
              key={val}
              onClick={() => handleVote(val)}
              className={`w-12 h-16 rounded-md font-bold text-lg transition-all border ${selected === val ? 'bg-neon-coral text-black border-neon-coral scale-110' : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-white'}`}
            >
              {val}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div>
            {!revealed ? (
              <button onClick={() => setRevealed(true)} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-8 rounded-full shadow-lg shadow-purple-900/50 transition-colors">
                Reveal Votes
              </button>
            ) : (
              <div className="flex flex-col items-center animate-fade-in-up">
                <div className="flex gap-6 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-16 bg-neon-coral text-black font-bold text-xl flex items-center justify-center rounded-md border border-neon-coral shadow-lg shadow-neon-coral/20">{selected}</div>
                    <span className="text-xs text-gray-400 mt-2">You</span>
                  </div>
                  {botVotes.map((v, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-12 h-16 bg-gray-700 text-white font-bold text-xl flex items-center justify-center rounded-md border border-gray-500">{v}</div>
                      <span className="text-xs text-gray-400 mt-2">Dev {i+1}</span>
                    </div>
                  ))}
                </div>
                <p className="text-neon-coral text-sm mt-4">Votes differ! Time for the team to discuss why.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function SprintLifecycleWidget() {
  const steps = [
    { title: 'Sprint Planning', desc: 'Negotiate the work for the next 2 weeks.', icon: '📅' },
    { title: 'Daily Standup', desc: '15-min daily sync. Identify blockers.', icon: '☕' },
    { title: 'Sprint Review', desc: 'Demo working software to stakeholders.', icon: '🎉' },
    { title: 'Retrospective', desc: 'What went well? What needs improvement?', icon: '🔍' }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl flex justify-between items-start relative">
        <div className="absolute top-6 left-10 right-10 h-1 bg-gray-800 -z-10"></div>
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center w-1/4 group">
            <div className="w-12 h-12 bg-black border-2 border-neon-coral rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-neon-coral/10 transition-all cursor-default shadow-lg shadow-neon-coral/20">
              {step.icon}
            </div>
            <h4 className="text-white font-bold text-sm text-center mb-2">{step.title}</h4>
            <p className="text-gray-400 text-xs text-center px-2">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
