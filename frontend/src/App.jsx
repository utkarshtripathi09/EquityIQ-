import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MarketDashboard from './components/MarketDashboard';
import IPOList from './components/IPOList';

function App() {
  const [selectedTicker, setSelectedTicker] = useState('AAPL'); // Default
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | ipo

  return (
    <div className="flex h-screen overflow-hidden bg-darkBg text-slate-200 font-sans">
      <Sidebar 
        selectedTicker={selectedTicker} 
        setSelectedTicker={setSelectedTicker}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {activeTab === 'dashboard' ? 'Market Dashboard' : 'IPO Calendar'}
              </h1>
              <p className="text-slate-400 mt-2">
                {activeTab === 'dashboard' ? 'AI-driven quantitative predictions' : 'Upcoming market debuts'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold shadow-lg shadow-primary/30">
                 UT
               </div>
            </div>
          </header>

          {activeTab === 'dashboard' ? (
            <MarketDashboard ticker={selectedTicker} />
          ) : (
            <IPOList />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
