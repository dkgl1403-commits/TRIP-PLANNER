import React, { useState, useEffect } from 'react';

export default function EmployeeDashboard({ user, onBack }) {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center shadow-lg backdrop-blur-sm">
          <span className="material-symbols-outlined text-6xl text-neon-coral opacity-50 mb-4 animate-pulse">engineering</span>
          <h3 className="text-xl font-bold mb-2">Module Under Construction</h3>
          <p className="opacity-70 max-w-md mx-auto">
            The advanced HR Analytics and Predictive ML engine is currently being built. Check back soon for deep employee profiles, flight risk models, and generative AI coaching summaries.
          </p>
        </div>
      </div>
    </div>
  );
}
