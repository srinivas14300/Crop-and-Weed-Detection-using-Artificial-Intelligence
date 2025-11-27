import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Clock, CheckCircle2, Loader2, Calendar, FileBarChart, ArrowRight, Eye, X, Share2, ClipboardList, Target, Sprout, ScanFace, BrainCircuit, ShieldCheck, Plane, Hourglass, AlertCircle } from 'lucide-react';
import { ReportItem } from '../types';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ReportsProps {
  reports: ReportItem[];
}

export const Reports: React.FC<ReportsProps> = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [now, setNow] = useState(Date.now());
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getExpiryTime = (timestamp: number) => {
    const expiry = timestamp + 2 * 60 * 1000;
    const diff = Math.max(0, Math.floor((expiry - now) / 1000));
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExportPDF = async () => {
    if (!reportRef.current || !selectedReport) return;
    
    setIsExporting(true);
    setExportError(null);

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Improve quality
        backgroundColor: '#0f172a', // Ensure dark background for dark mode coherence
        logging: false,
        useCORS: true // Handle external images if any
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const timeStr = new Date().toISOString().slice(11, 16).replace(/:/g, '');
      const fileName = `AgriAI_Report_${selectedReport.id.slice(-6)}_${dateStr}_${timeStr}.pdf`;
      
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF Export failed:", error);
      setExportError("PDF export failed. Please try again.");
      setTimeout(() => setExportError(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="section-glass-wrapper space-y-10 relative">
      
      {/* Toast Error for PDF */}
      {exportError && createPortal(
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[3000] animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className="glass-premium px-6 py-3 rounded-full border border-rose-500/20 shadow-lg flex items-center gap-3 bg-slate-900/90 text-white">
             <AlertCircle size={18} className="text-rose-500" />
             <span className="text-sm font-medium">{exportError}</span>
           </div>
        </div>,
        document.body
      )}

      {/* Header */}
      <div className="flex items-center gap-5 px-2 pt-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.25)] backdrop-blur-md">
          <FileText size={22} className="text-blue-500 dark:text-blue-400 drop-shadow-md" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight font-heading drop-shadow-sm dark:drop-shadow-lg">Analysis Reports</h2>
          <p className="text-blue-500/80 dark:text-blue-300/80 text-[10px] font-bold uppercase tracking-[0.25em] mt-1 text-shadow-glow">Generated Documents</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-36 px-6 glass-premium rounded-[3rem] border-dashed border-slate-300 dark:border-slate-700/50 flex flex-col items-center relative overflow-hidden">
          <div className="w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full flex items-center justify-center mb-10 text-slate-400 dark:text-slate-600 border border-black/5 dark:border-white/5 shadow-inner backdrop-blur-sm">
            <FileBarChart size={56} />
          </div>
          <h3 className="text-slate-700 dark:text-white font-bold text-2xl mb-4 font-heading tracking-wide">No Reports Generated</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed font-light">
            Run a detection analysis to generate your first detailed report.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => {
            const { date, time } = formatDate(report.timestamp);
            const isReady = report.status === 'Ready';
            const expiryTime = getExpiryTime(report.timestamp);
            
            return (
              <div 
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="glass-premium p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-center gap-6 hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-300 border border-white/20 dark:border-white/5 shadow-sm hover:shadow-lg group relative overflow-hidden cursor-pointer"
              >
                
                {/* Thumbnail */}
                <div className="w-full sm:w-28 h-32 sm:h-28 shrink-0 rounded-xl overflow-hidden relative border border-white/10 shadow-inner bg-slate-900/50">
                  {report.image ? (
                    <img 
                      src={report.image} 
                      alt="Report Thumbnail" 
                      className={`w-full h-full object-cover transition-all duration-700 ${isReady ? 'group-hover:scale-110 opacity-100' : 'opacity-50 blur-sm'}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                      <FileText size={24} />
                    </div>
                  )}
                  {!isReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                      <Loader2 size={24} className="text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full min-w-0 flex flex-col gap-2">
                  
                  {/* Top Row: Meta Info */}
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                        #{report.id.slice(-6)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
                        isReady 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {isReady ? <CheckCircle2 size={10} /> : <Loader2 size={10} className="animate-spin" />}
                        {report.status}
                      </span>
                      
                      {/* Expiry Timer Badge */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-rose-500/10 text-rose-500 border-rose-500/20 flex items-center gap-1">
                        <Hourglass size={10} />
                        Expires: {expiryTime}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                       <span className="flex items-center gap-1"><Calendar size={10} /> {date}</span>
                    </div>
                  </div>

                  {/* Main Title & Summary */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white font-heading tracking-wide leading-tight truncate">
                      {report.typeName || `${report.classification} Identification`}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {report.summary || report.explanation || "Detailed analysis generated."}
                    </p>
                  </div>

                  {/* Bottom Row: Metrics & Actions */}
                  <div className="flex items-center gap-3 mt-1 w-full">
                     <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${
                        report.classification === 'Crop' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                        report.classification === 'Weed' ? 'bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400' :
                        'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400'
                     }`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${
                          report.classification === 'Crop' ? 'bg-emerald-500' :
                          report.classification === 'Weed' ? 'bg-rose-500' : 'bg-amber-500'
                       }`}></span>
                       {report.classification}
                     </div>

                     <div className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300">
                       {report.confidence}% Match
                     </div>
                  </div>
                </div>

                {/* Chevron */}
                <div className="hidden sm:block absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1 duration-300">
                   <ArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED REPORT MODAL - PORTALED */}
      {selectedReport && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 font-sans">
          
          {/* 1. Backdrop Layer */}
          <div 
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl transition-opacity duration-300" 
            onClick={() => setSelectedReport(null)}
          ></div>
          
          {/* 2. Modal Card */}
          <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col glass-premium rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10 animate-in zoom-in-95 duration-300 overflow-hidden bg-white/95 dark:bg-[#0f172a]/95">
            
            {/* Modal Header (Fixed) */}
            <div className="px-6 py-5 border-b border-slate-200/50 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-white/5 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 ring-1 ring-blue-500/20">
                   <FileText size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 dark:text-white text-base tracking-tight font-heading">Agronomy Report</h3>
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                     <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">ID: {selectedReport.id.slice(-8)}</p>
                   </div>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)} 
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content (Scrollable) */}
            <div ref={reportRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
              
              {/* SECTION 1: VISUAL EVIDENCE */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-5/12 aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl relative group bg-black">
                  {selectedReport.image ? (
                     <img src={selectedReport.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Subject" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <FileText size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-80"></div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/10 mb-2">
                       <ScanFace size={12} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Source Image</span>
                     </div>
                     <p className="text-xs font-mono opacity-60">timestamp: {selectedReport.timestamp}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-5">
                   {/* Classification Card */}
                   <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                      
                      <div className="relative z-10">
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] font-bold mb-4">Primary Classification</p>
                        
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`p-3 rounded-2xl ${
                            selectedReport.classification === 'Crop' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                            selectedReport.classification === 'Weed' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' :
                            'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          }`}>
                             {selectedReport.classification === 'Crop' && <Sprout size={32} />}
                             {selectedReport.classification === 'Weed' && <Target size={32} />}
                             {selectedReport.classification === 'Unknown' && <AlertCircle size={32} />}
                          </div>
                          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{selectedReport.classification}</h2>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                             <span>Confidence Score</span>
                             <span>{selectedReport.confidence}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-black/40 rounded-full h-2.5 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              selectedReport.classification === 'Crop' ? 'bg-emerald-500' :
                              selectedReport.classification === 'Weed' ? 'bg-rose-500' : 'bg-amber-500'
                            }`} style={{ width: `${selectedReport.confidence}%` }}></div>
                          </div>
                          <p className="text-[10px] text-slate-400 text-right font-mono">Based on feature extraction & pattern matching</p>
                        </div>
                      </div>
                   </div>

                   {/* Analysis Details */}
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                          <Clock size={16} />
                        </div>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold mb-1">Time</p>
                        <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">
                          {new Date(selectedReport.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                     </div>
                     <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/10">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
                          <BrainCircuit size={16} />
                        </div>
                        <p className="text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-widest font-bold mb-1">Model</p>
                        <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">Gemini 2.5 Flash</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* SECTION 2: IDENTIFICATION & REASONING */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-premium p-8 rounded-[2rem] border border-emerald-500/20 shadow-sm">
                  <h4 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 text-lg">
                    <ScanFace size={20} className="text-emerald-500" />
                    Detected Species
                  </h4>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 text-center mb-6">
                    <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300 font-heading">
                      {selectedReport.typeName || "Unidentified Species"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    {selectedReport.summary || "No summary available."}
                  </p>
                </div>

                <div className="glass-premium p-8 rounded-[2rem] border border-indigo-500/20 shadow-sm">
                  <h4 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 text-lg">
                    <BrainCircuit size={20} className="text-indigo-500" />
                    AI Reasoning
                  </h4>
                  <div className="relative pl-6 border-l-2 border-indigo-500/30">
                     <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{selectedReport.aiReasoning || selectedReport.explanation || "Pattern matching analysis complete."}"
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: BIOLOGY & GROWTH */}
              <div className="p-8 rounded-[2rem] bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                 <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3 text-lg">
                    <Sprout size={20} className="text-amber-500" />
                    Growth Behavior & Risk
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedReport.growthInfo || "Growth data not available for this classification."}
                  </p>
              </div>

              {/* SECTION 4: ACTION PLAN */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Solutions */}
                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 h-full">
                   <h4 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 text-lg">
                    <ShieldCheck size={20} className="text-blue-500" />
                    Agronomic Solutions
                  </h4>
                  {selectedReport.solutions && selectedReport.solutions.length > 0 ? (
                    <ul className="space-y-4">
                      {selectedReport.solutions.map((rec, idx) => (
                        <li key={idx} className="flex gap-4 text-sm text-slate-700 dark:text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                          <span className="leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No specific solutions generated.</p>
                  )}
                </div>

                {/* Drone Actions */}
                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 h-full">
                   <h4 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 text-lg">
                    <Plane size={20} className="text-cyan-500" />
                    Drone Intervention
                  </h4>
                  {selectedReport.droneActions && selectedReport.droneActions.length > 0 ? (
                    <ul className="space-y-4">
                      {selectedReport.droneActions.map((action, idx) => (
                        <li key={idx} className="flex gap-4 text-sm text-slate-700 dark:text-slate-300">
                           <span className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></span>
                           <span className="leading-relaxed">{action}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No drone actions required.</p>
                  )}
                </div>
              </div>

              <div className="h-4"></div> {/* Bottom Spacer */}
            </div>

            {/* Modal Footer (Fixed) */}
            <div className="p-6 border-t border-slate-200/50 dark:border-white/5 bg-slate-50/80 dark:bg-black/20 flex justify-between items-center shrink-0 backdrop-blur-md">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden md:block">
                AGRIAI OS • v2.4 • SECURE DOCUMENT
              </p>
              <div className="flex gap-4 ml-auto">
                <button 
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors" 
                  onClick={() => setSelectedReport(null)}
                >
                  Close
                </button>
                <button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className={`px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center gap-2 ${isExporting ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />} 
                  {isExporting ? 'Generating...' : 'Export PDF'}
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
