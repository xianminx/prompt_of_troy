'use client'
import '../app/globals.css';
import '../app/App.css';
import React, { useState, useEffect } from 'react';
import PlayerList from './PlayerList';
import BattleList from './BattleList';
import PromptList from './PromptList';

export function Leaderboard() {
  // Initialize with default tab
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

  const renderContent = () => {
    switch (activeTab) {
      case 'players':
        return <PlayerList />;
      case 'battles':
        return <BattleList />;
      case 'prompts':
        return <PromptList />;
      default:
        return <PlayerList />;
    }
  };

  return (
    <div className="app">
      <h1 className="text-3xl font-bold mb-6">Prompt of Troy Leaderboard</h1>
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Players & Ratings
        </button>
        <button 
          className={`tab ${activeTab === 'battles' ? 'active' : ''}`}
          onClick={() => setActiveTab('battles')}
        >
          Battles
        </button>
        <button 
          className={`tab ${activeTab === 'prompts' ? 'active' : ''}`}
          onClick={() => setActiveTab('prompts')}
        >
          Prompts
        </button>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  )
} 