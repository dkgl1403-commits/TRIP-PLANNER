import React, { useState, useEffect } from 'react';

import EmployeeDataIngestion from './EmployeeDataIngestion';
import EmployeePredictiveML from './EmployeePredictiveML';

export default function EmployeeDashboard({ user, onBack }) {
  const [activeTab, setActiveTab] = useState('data-ingestion');

  if (user?.role !== 'ADMIN') {
    return (
      <div className="w-full min-h-screen pt-24 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
        <p className="mb-6 opacity-70">You do not have permission to view this module.</p>
        <button 
          onClick={onBack} 
          className="bg-transparent border border-neon-coral text-neon-coral cursor-pointer flex items-center gap-2 px-4 py-2 hover:bg-neon-coral/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Return to App
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 px-4 sm:px-8 max-w-container-max mx-auto text-on-surface font-body-md text-white pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack} 
          className="bg-transparent border-none text-neon-coral cursor-pointer flex items-center p-2 hover:bg-white/5 rounded-full transition-colors"
          title="Back"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="font-display-lg text-3xl font-bold m-0 flex items-center gap-3">
          <span className="material-symbols-outlined text-neon-coral text-[32px]">groups</span>
          Employee Dashboard
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-surface-variant mb-6">
        <button 
          className={`pb-4 px-2 font-bold transition-colors border-b-2 ${activeTab === 'data-ingestion' ? 'border-neon-coral text-neon-coral' : 'border-transparent text-on-surface-variant hover:text-white'}`}
          onClick={() => setActiveTab('data-ingestion')}
        >
          Data Ingestion
        </button>
        <button 
          className={`pb-4 px-2 font-bold transition-colors border-b-2 ${activeTab === 'predictive-ml' ? 'border-neon-coral text-neon-coral' : 'border-transparent text-on-surface-variant hover:text-white'}`}
          onClick={() => setActiveTab('predictive-ml')}
        >
          Predictive ML & Insights
        </button>
      </div>

      {activeTab === 'data-ingestion' && (
        <EmployeeDataIngestion user={user} />
      )}
      
      {activeTab === 'predictive-ml' && (
        <EmployeePredictiveML user={user} />
      )}
    </div>
  );
}
