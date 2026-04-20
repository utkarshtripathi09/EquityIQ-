import React, { useState, useEffect } from 'react';
import { Calendar, Tag, ChevronRight, Loader2 } from 'lucide-react';

const IPOList = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking IPO fetch since backend might not be up
    setTimeout(() => {
      setIpos([
        { id: 1, companyName: 'Stripe', symbol: 'STRIP', expectedDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), priceRange: '$40.00 - $45.00', sharesOffered: '50M' },
        { id: 2, companyName: 'Databricks', symbol: 'DBRX', expectedDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), priceRange: '$60.00 - $68.00', sharesOffered: '80M' },
        { id: 3, companyName: 'Discord', symbol: 'DSCD', expectedDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(), priceRange: '$35.00 - $38.00', sharesOffered: '45M' },
        { id: 4, companyName: 'Plaid', symbol: 'PLAD', expectedDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(), priceRange: '$25.00 - $30.00', sharesOffered: '20M' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700/50">
                <th className="p-4 font-semibold text-slate-400">Company</th>
                <th className="p-4 font-semibold text-slate-400">Symbol</th>
                <th className="p-4 font-semibold text-slate-400">Expected Date</th>
                <th className="p-4 font-semibold text-slate-400">Est. Price Range</th>
                <th className="p-4 font-semibold text-slate-400">Shares</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {ipos.map((ipo, index) => (
                <tr 
                  key={ipo.id} 
                  className={`border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors cursor-pointer group ${index === ipos.length - 1 ? 'border-none' : ''}`}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-lg border border-slate-600 group-hover:border-primary/50 transition-colors">
                        {ipo.companyName.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-200">{ipo.companyName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-800 px-2 py-1 rounded text-sm font-medium border border-slate-700 text-slate-300">
                      {ipo.symbol}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-slate-400">
                      <Calendar size={16} className="mr-2" />
                      {new Date(ipo.expectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-slate-300">
                      <Tag size={16} className="mr-2 text-accent" />
                      {ipo.priceRange}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">
                    {ipo.sharesOffered}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-500 group-hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-700">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IPOList;
