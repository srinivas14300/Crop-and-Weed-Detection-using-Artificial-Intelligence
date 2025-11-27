import React from 'react';
import { Trash2, Clock, ArrowRight, Database } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onClearHistory }) => {

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your detection history?')) {
      onClearHistory();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      day: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="section-glass-wrapper space-y-12">
      
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-4">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.25)] backdrop-blur-md">
            <Database size={22} className="text-indigo-600 dark:text-indigo-400 drop-shadow-md" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight font-heading drop-shadow-sm dark:drop-shadow-lg">Scan Log</h2>
            <p className="text-indigo-500/80 dark:text-indigo-300/80 text-[10px] font-bold uppercase tracking-[0.25em] mt-1 text-shadow-glow">Encrypted Local Storage</p>
          </div>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-rose-500 dark:text-rose-300 hover:text-white hover:bg-rose-500/80 px-5 py-2.5 rounded-full transition-all text-xs font-bold border border-rose-500/30 hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] backdrop-blur-md active:scale-95"
          >
            <Trash2 size={14} />
            <span>Purge Data</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-36 px-6 glass-premium rounded-[3rem] border-dashed border-slate-300 dark:border-slate-700/50 flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-200/50 dark:via-slate-800/10 to-transparent pointer-events-none"></div>
          <div className="w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full flex items-center justify-center mb-10 text-slate-400 dark:text-slate-600 border border-black/5 dark:border-white/5 shadow-inner backdrop-blur-sm">
            <Clock size={56} />
          </div>
          <h3 className="text-slate-700 dark:text-white font-bold text-2xl mb-4 font-heading tracking-wide">Empty Log</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed font-light">
            Analysis records will be securely stored here after your first neural scan.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {history.map((item, index) => {
            const dateStr = formatDate(item.timestamp);
            const isCrop = item.classification === 'Crop';
            const isWeed = item.classification === 'Weed';
            
            return (
              <div 
                key={item.id} 
                className={`glass-premium p-4 rounded-[1.8rem] flex gap-6 items-center hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-300 group cursor-pointer border-l-[6px] relative overflow-hidden animate-in slide-in-from-bottom-4 fade-in fill-mode-forwards shadow-md dark:shadow-lg hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1`}
                style={{ 
                  borderLeftColor: isCrop ? '#10b981' : isWeed ? '#f43f5e' : '#f59e0b',
                  animationDelay: `${index * 80}ms`
                }}
              >
                {/* Hover Glow Background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-500 ${isCrop ? 'bg-emerald-500' : isWeed ? 'bg-rose-500' : 'bg-amber-500'}`}></div>

                {/* Thumbnail */}
                <div className={`w-24 h-24 shrink-0 rounded-2xl overflow-hidden relative border-2 ${
                  isCrop ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 
                  isWeed ? 'border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'border-amber-500/30'
                }`}>
                  <img 
                    src={item.imageData} 
                    alt={item.classification} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 py-2 relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className={`font-bold text-lg tracking-wide ${
                         isCrop ? 'text-emerald-600 dark:text-emerald-400 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 
                         isWeed ? 'text-rose-600 dark:text-rose-400 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {item.classification}
                      </h3>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                        isCrop ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-300' : 
                        isWeed ? 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-300' : 
                        'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-300'
                      }`}>
                        {item.confidence}%
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{dateStr.day}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-600 font-mono mt-0.5">{dateStr.time}</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-300/80 line-clamp-1 leading-relaxed font-light pr-8 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {item.explanation}
                  </p>
                </div>
                
                {/* Chevron */}
                <div className="pr-6 text-slate-400 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors group-hover:translate-x-1 duration-300 relative z-10">
                  <ArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};