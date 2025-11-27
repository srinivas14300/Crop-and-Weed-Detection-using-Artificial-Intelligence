import React, { useState, useEffect } from 'react';
import { Detector } from './components/Detector';
import { Documentation } from './components/Documentation';
import { History } from './components/History';
import { Reports } from './components/Reports';
import { AppView, Theme, HistoryItem, ReportItem } from './types';
import { Sprout, Camera, Share2, History as HistoryIcon, LayoutGrid, Sun, Moon, FileText, Trash2, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DOCUMENTATION);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // State for data
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  
  // Toast State for actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as Theme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark'; // Default to dark if unknown
  });

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Data Cleanup and Sync Effect: Deletes data older than 2 minutes and syncs state
  useEffect(() => {
    const cleanupAndSync = () => {
      const TWO_MINUTES = 2 * 60 * 1000;
      const now = Date.now();

      // Clean Reports
      const savedReports = localStorage.getItem('agriai_reports');
      let currentReports: ReportItem[] = [];
      if (savedReports) {
        try {
          const parsedReports = JSON.parse(savedReports);
          const validReports = parsedReports.filter((r: any) => (now - r.timestamp) < TWO_MINUTES);
          if (validReports.length !== parsedReports.length) {
            localStorage.setItem('agriai_reports', JSON.stringify(validReports));
          }
          currentReports = validReports;
        } catch (e) {
          console.error("Failed to clean reports", e);
        }
      }
      setReports(currentReports);

      // Clean History
      const savedHistory = localStorage.getItem('agriai_history');
      let currentHistory: HistoryItem[] = [];
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          const validHistory = parsedHistory.filter((h: any) => (now - h.timestamp) < TWO_MINUTES);
          if (validHistory.length !== parsedHistory.length) {
            localStorage.setItem('agriai_history', JSON.stringify(validHistory));
          }
          currentHistory = validHistory;
        } catch (e) {
          console.error("Failed to clean history", e);
        }
      }
      setHistory(currentHistory);
    };

    // Run cleanup on mount
    cleanupAndSync();

    // Run cleanup interval every 2 minutes
    const interval = setInterval(cleanupAndSync, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleHistoryUpdate = (newItem: HistoryItem) => {
    setHistory(prev => {
      const updated = [newItem, ...prev];
      localStorage.setItem('agriai_history', JSON.stringify(updated));
      return updated;
    });
  };
  
  const handleClearHistory = () => {
    localStorage.removeItem('agriai_history');
    setHistory([]);
    setToastMessage("History cleared successfully.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReportUpdate = (newItem: ReportItem) => {
    setReports(prev => {
      const updated = [newItem, ...prev];
      localStorage.setItem('agriai_reports', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const renderContent = () => {
    switch(view) {
      case AppView.DETECTOR: 
        return <Detector onHistoryUpdate={handleHistoryUpdate} onReportUpdate={handleReportUpdate} />;
      case AppView.HISTORY: 
        return <History history={history} onClearHistory={handleClearHistory} />;
      case AppView.REPORTS: 
        return <Reports reports={reports} />;
      default: 
        return <Documentation />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans transition-colors duration-300">
      
      {/* Global Site Frame */}
      <div className="site-frame"></div>
      
      {/* --- Dynamic Background System --- */}
      <div className="fixed inset-0 -z-10 bg-transparent transition-colors duration-500">
        
        {/* Dark Mode Aurora (Deep Neon) */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
           <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-700/15 rounded-full blur-[130px] animate-aurora-1 mix-blend-screen"></div>
           <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-700/15 rounded-full blur-[130px] animate-aurora-2 mix-blend-screen"></div>
           <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse mix-blend-screen animation-delay-4000"></div>
        </div>

        {/* Light Mode Aurora (Soft Pastel) */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
           <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-300/30 rounded-full blur-[130px] animate-aurora-1 mix-blend-multiply"></div>
           <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-300/30 rounded-full blur-[130px] animate-aurora-2 mix-blend-multiply"></div>
           <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-cyan-200/40 rounded-full blur-[100px] animate-pulse mix-blend-multiply animation-delay-4000"></div>
        </div>

      </div>

      {/* --- Desktop Floating Header --- */}
      <header className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto rounded-full px-6 py-3 flex items-center justify-between gap-6 md:gap-12 glass-premium shadow-[0_12px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-500 max-w-5xl w-full border border-white/40 dark:border-white/10 backdrop-blur-3xl">
          
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => setView(AppView.DOCUMENTATION)}
          >
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2.5 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.3)] group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20">
              <Sprout className="text-white w-5 h-5 drop-shadow-md" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 dark:text-white tracking-tight leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors drop-shadow-sm font-heading">CWDAI</h1>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center bg-slate-100/50 dark:bg-black/20 p-1.5 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-md">
            {[
              { id: AppView.DOCUMENTATION, icon: LayoutGrid, label: 'Overview' },
              { id: AppView.DETECTOR, icon: Camera, label: 'Detector' },
              { id: AppView.REPORTS, icon: FileText, label: 'Reports' },
              { id: AppView.HISTORY, icon: HistoryIcon, label: 'History' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-5 lg:px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 relative overflow-hidden group ${
                  view === item.id
                    ? 'text-emerald-700 dark:text-emerald-200 bg-white dark:bg-emerald-500/15 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/20 dark:border-emerald-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <item.icon size={16} className={`transition-all duration-300 ${view === item.id ? "text-emerald-600 dark:text-emerald-300 dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "group-hover:text-emerald-600 dark:group-hover:text-emerald-200"}`} />
                <span className="tracking-wide">{item.label}</span>
                {view === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent opacity-100 animate-shimmer"></div>
                )}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center justify-end gap-3">
             
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
               aria-label="Toggle Theme"
             >
               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             <div className="hidden md:flex">
               {isInstallable ? (
                <button 
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full hover:bg-emerald-500/20 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md group"
                >
                  <Share2 size={14} className="group-hover:rotate-12 transition-transform" />
                  Install
                </button>
              ) : (
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-500 px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                   v2.4
                 </div>
              )}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-1 pt-36 md:pt-48 pb-36 md:pb-16 z-0 w-full min-h-[calc(100vh-144px)]">
        <div className="w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          {renderContent()}
        </div>
      </main>
      
      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-32 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[3000] animate-in slide-in-from-bottom-8 fade-in duration-500 flex justify-center md:block pointer-events-none">
           <div className="pointer-events-auto glass-premium p-4 rounded-2xl border border-emerald-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 max-w-sm backdrop-blur-xl bg-white/90 dark:bg-slate-900/95">
             <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/30">
               <CheckCircle size={16} className="text-emerald-500" />
             </div>
             <p className="text-sm text-slate-800 dark:text-white font-medium">{toastMessage}</p>
           </div>
        </div>
      )}

      {/* Mobile Floating Dock (Glass) */}
      <nav className="md:hidden fixed bottom-8 left-6 right-6 z-50">
        <div className="rounded-[2.5rem] border border-white/20 dark:border-white/10 px-6 py-4 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-3xl bg-white/70 dark:bg-[#0f172a]/70 ring-1 ring-black/5 dark:ring-white/5">
          
          <button
            onClick={() => setView(AppView.DOCUMENTATION)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 p-2 rounded-2xl ${
              view === AppView.DOCUMENTATION 
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 -translate-y-1' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <LayoutGrid size={24} />
          </button>

          <button
            onClick={() => setView(AppView.REPORTS)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 p-2 rounded-2xl ${
              view === AppView.REPORTS 
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 -translate-y-1' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <FileText size={24} />
          </button>
          
          {/* Main Action Button */}
          <div className="relative -top-10">
             <button
              onClick={() => setView(AppView.DETECTOR)}
              className={`flex items-center justify-center w-16 h-16 rounded-[1.8rem] border transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${
                view === AppView.DETECTOR 
                  ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 border-emerald-400 text-white scale-110 shadow-[0_0_30px_rgba(16,185,129,0.4)]' 
                  : 'bg-white dark:bg-slate-800/90 backdrop-blur-2xl border-white/40 dark:border-white/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <Camera size={28} className={view === AppView.DETECTOR ? "drop-shadow-lg" : ""} />
            </button>
          </div>

          <button
             onClick={() => setView(AppView.HISTORY)}
             className={`flex flex-col items-center gap-1.5 transition-all duration-300 p-2 rounded-2xl ${
               view === AppView.HISTORY 
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 -translate-y-1' 
                : 'text-slate-400 dark:text-slate-500'
             }`}
          >
            <HistoryIcon size={24} />
          </button>
          
          <button
             onClick={toggleTheme}
             className="flex flex-col items-center gap-1.5 transition-all duration-300 p-2 rounded-2xl text-slate-400 dark:text-slate-500"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;