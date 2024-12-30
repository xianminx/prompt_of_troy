'use client'
import '../app/globals.css';
import '../app/App.css';
import React, { useState, useEffect } from 'react';
import PlayerList from './PlayerList';
import BattleList from './BattleList';
import PromptList from './PromptList';

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState('players');
  
  // Move window-dependent logic to useEffect
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (['players', 'battles', 'prompts'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (['players', 'battles', 'prompts'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const playerList = <PlayerList />;
  const battleList = <BattleList />;
  const promptList = <PromptList />;

  const renderContent = () => {
    return (
      <div className="w-full relative">
        <div className="w-full absolute" style={{ display: activeTab === 'players' ? 'block' : 'none' }}>
          {playerList}
        </div>
        <div className="w-full absolute" style={{ display: activeTab === 'battles' ? 'block' : 'none' }}>
          {battleList}
        </div>
        <div className="w-full absolute" style={{ display: activeTab === 'prompts' ? 'block' : 'none' }}>
          {promptList}
        </div>
        {/* This invisible div maintains the height */}
        <div className="invisible">
          {activeTab === 'players' && playerList}
          {activeTab === 'battles' && battleList}
          {activeTab === 'prompts' && promptList}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">Leaderboard</h2>
      <div className="flex justify-center mb-6 border-b border-gray-200">
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors duration-200
            ${activeTab === 'players' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('players')}
        >
          Players & Ratings
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors duration-200
            ${activeTab === 'battles' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('battles')}
        >
          Battles
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors duration-200
            ${activeTab === 'prompts' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('prompts')}
        >
          Prompts
        </button>
      </div>
      <div className="min-w-[300px] w-full">
        {renderContent()}
      </div>
    </div>
  );
} 