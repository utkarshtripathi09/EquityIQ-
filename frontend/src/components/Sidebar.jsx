import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Search, TrendingUp, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const Sidebar = ({ selectedTicker, setSelectedTicker, activeTab, setActiveTab }) => {
  const [watchlist, setWatchlist] = useState(['AAPL', 'MSFT', 'TSLA', 'NVDA']);
  const [search, setSearch] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (search && !watchlist.includes(search.toUpperCase())) {
      setWatchlist([...watchlist, search.toUpperCase()]);
      setSearch('');
    }
  };

  const handleRemove = (e, tickerToRemove) => {
    e.stopPropagation();
    setWatchlist(watchlist.filter(t => t !== tickerToRemove));
    if (selectedTicker === tickerToRemove && watchlist.length > 1) {
      setSelectedTicker(watchlist.find(t => t !== tickerToRemove));
    }
  };

  return (
    <div className="w-64 glass border-r border-slate-700/50 flex flex-col z-20">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-primary/20 p-2 rounded-lg text-primary">
          <TrendingUp size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight">EquityIQ</span>
      </div>

      <div className="px-4 py-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-primary/20 text-primary shadow-lg shadow-primary/10' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          <Activity size={20} />
          <span className="font-medium">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('ipo')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mt-2 transition-all duration-300 ${activeTab === 'ipo' ? 'bg-accent/20 text-accent shadow-lg shadow-accent/10' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          <Calendar size={20} />
          <span className="font-medium">IPO Calendar</span>
        </button>
      </div>

      <div className="mt-8 px-6 flex-1">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Watchlist</h3>
        
        <form onSubmit={handleAdd} className="relative mb-6">
          <input 
            type="text" 
            placeholder="Add ticker..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-200 transition-all"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
          <button type="submit" className="absolute right-2 top-2 text-primary hover:text-primary/80">
             <Plus size={18} />
          </button>
        </form>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {watchlist.map((ticker) => (
            <div 
              key={ticker}
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedTicker(ticker);
              }}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 group ${selectedTicker === ticker && activeTab === 'dashboard' ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/50 border border-transparent'}`}
            >
              <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{ticker}</span>
              <button onClick={(e) => handleRemove(e, ticker)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
