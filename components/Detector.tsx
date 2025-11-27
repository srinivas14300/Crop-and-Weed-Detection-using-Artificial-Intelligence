import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, Leaf, Info, CheckCircle, X, Sparkles, RefreshCw, ScanLine, Zap, Aperture, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { AnalysisResult, HistoryItem, ReportItem, AppView } from '../types';

const CONFIDENCE_THRESHOLD = 70;
const MAX_STORAGE_ITEMS = 2; // Strict limit: Only keep last 2 images

interface DetectorProps {
  onHistoryUpdate: (newItem: HistoryItem) => void;
  onReportUpdate: (newItem: ReportItem) => void;
}

export const Detector: React.FC<DetectorProps> = ({ onHistoryUpdate, onReportUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Toast State
  const [showReportToast, setShowReportToast] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
        setResult(null);
        setCapturedImage(null);
      }
    } catch (err) {
      setError("Camera access denied. Check permissions or use Upload.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const createReport = (analysis: AnalysisResult, imageData: string) => {
    try {
      const newReport: ReportItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        image: imageData,
        classification: analysis.classification,
        confidence: analysis.confidence,
        status: 'Ready', // Set to Ready immediately as analysis is done synchronously
        explanation: analysis.explanation,
        
        // Mapped from real AI response
        summary: analysis.summary,
        typeName: analysis.typeName,
        aiReasoning: analysis.aiReasoning,
        growthInfo: analysis.growthInfo,
        solutions: analysis.solutions,
        droneActions: analysis.droneActions,
        
        // Legacy support
        recommendations: analysis.solutions 
      };

      // Update parent state
      onReportUpdate(newReport);
      
      // Trigger Toast
      setShowReportToast(true);
      setTimeout(() => setShowReportToast(false), 6000); // Hide after 6s
    } catch (e) {
      console.error("Failed to create report", e);
    }
  };

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Compress image to 0.6 quality to save LocalStorage space
    const fullDataUrl = canvas.toDataURL('image/jpeg', 0.6);
    const base64Image = fullDataUrl.split(',')[1];
    
    setCapturedImage(fullDataUrl);
    stopCamera();

    setAnalyzing(true);
    
    const analysis = await analyzeImage(base64Image);
    
    setResult(analysis);
    
    // Save to parent state
    onHistoryUpdate({
      ...analysis,
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageData: fullDataUrl
    });

    createReport(analysis, fullDataUrl);
    setAnalyzing(false);
  }, [onHistoryUpdate, onReportUpdate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setCapturedImage(base64String);
      setResult(null);
      
      const rawBase64 = base64String.split(',')[1];
      setAnalyzing(true);
      
      const analysis = await analyzeImage(rawBase64);
      setResult(analysis);
      
      onHistoryUpdate({
        ...analysis,
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageData: base64String
      });

      createReport(analysis, base64String);
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    stopCamera();
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="section-glass-wrapper space-y-10 relative">
      
      {/* Toast Notification - Repositioned to Bottom Right (Desktop) / Above Dock (Mobile) */}
      {showReportToast && (
        <div className="fixed bottom-32 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[3000] animate-in slide-in-from-bottom-8 fade-in duration-500 flex justify-center md:block pointer-events-none">
           <div className="pointer-events-auto glass-premium p-4 rounded-2xl border border-emerald-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-start gap-4 max-w-sm backdrop-blur-xl bg-white/90 dark:bg-slate-900/95 cursor-pointer hover:scale-[1.02] transition-transform">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/30">
               <CheckCircle size={20} className="text-emerald-500" />
             </div>
             <div>
               <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Analysis Complete</h4>
               <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                 A detailed report has been generated in the <span className="text-emerald-600 dark:text-emerald-400 font-bold">Reports</span> section.
               </p>
             </div>
             <button onClick={(e) => { e.stopPropagation(); setShowReportToast(false); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
               <X size={16} />
             </button>
           </div>
        </div>
      )}
      
      {/* HUD Container */}
      <div className="glass-premium rounded-[2.5rem] overflow-hidden relative isolate ring-1 ring-black/5 dark:ring-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] group">
        
        {/* HUD Header */}
        <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 flex justify-between items-center z-10 relative bg-gradient-to-b from-white/60 dark:from-black/40 to-transparent">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-md">
               <Aperture size={20} className="text-emerald-500 dark:text-emerald-400 animate-spin-slow" style={{ animationDuration: '8s' }} />
             </div>
             <div>
               <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white tracking-wide font-heading">Visual Cortex</h2>
               <div className="flex items-center gap-2 mt-1">
                 <span className={`w-1.5 h-1.5 rounded-full ${analyzing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'} shadow-[0_0_8px_rgba(16,185,129,1)]`}></span>
                 <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] opacity-80 text-shadow-glow">
                    {analyzing ? 'SYSTEM BUSY' : 'SYSTEM ONLINE'}
                 </p>
               </div>
             </div>
           </div>
           {result && !analyzing && (
             <button onClick={reset} className="p-3 bg-white/40 dark:bg-white/5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all border border-black/5 dark:border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:rotate-180 duration-500 backdrop-blur-md">
               <RefreshCw size={20} />
             </button>
           )}
        </div>

        {/* Viewport / Camera Frame - Optimized Aspect Ratio */}
        <div className="relative w-full aspect-[3/4] md:aspect-video bg-slate-100 dark:bg-black/80 mt-2 mx-auto border-y border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500">
          
          {/* Sci-Fi HUD Corners */}
          <div className="hud-corner hud-tl z-20"></div>
          <div className="hud-corner hud-tr z-20"></div>
          <div className="hud-corner hud-bl z-20"></div>
          <div className="hud-corner hud-br z-20"></div>

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-10 pointer-events-none opacity-50"></div>

          {/* Scanning Laser Animation */}
          {isStreaming && (
             <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
               <div className="w-full h-[15%] bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent scanning-laser mix-blend-screen"></div>
             </div>
          )}

          {/* Default / Start State */}
          {!isStreaming && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-50/80 to-slate-100/90 dark:from-slate-900/80 dark:to-slate-900/90 backdrop-blur-sm z-30">
              <div className="relative mb-8 md:mb-10 group">
                <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20 rounded-full animate-pulse"></div>
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white/40 dark:bg-white/5 rounded-[2rem] flex items-center justify-center relative border border-white/20 dark:border-white/10 shadow-xl dark:shadow-2xl backdrop-blur-xl group-hover:scale-105 transition-transform duration-500">
                  <ScanLine className="text-emerald-500 dark:text-emerald-400 w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 tracking-tight font-heading drop-shadow-lg">Initiate Scan</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 md:mb-12 max-w-[280px] font-light leading-relaxed">
                Align subject within the holographic brackets for neural inference.
              </p>
              
              <div className="flex flex-col gap-4 w-full max-w-xs">
                <button 
                  onClick={startCamera}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-600 dark:from-emerald-600 dark:to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 dark:hover:from-emerald-500 dark:hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 border border-emerald-400/20 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-[1px]"></div>
                  <Camera size={20} className="relative z-10" /> <span className="relative z-10">Activate Sensor</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-2xl font-bold transition-all border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/30 active:scale-95 flex items-center justify-center gap-3 backdrop-blur-md hover:text-slate-900 dark:hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <Upload size={20} /> Upload Image
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
            </div>
          )}

          {/* Video Stream */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transition-opacity duration-500 ${!isStreaming ? 'opacity-0 hidden' : 'opacity-100'}`}
          />

          {/* Captured Image */}
          {capturedImage && (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover" 
            />
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Controls Overlay (Floating) */}
          {isStreaming && !analyzing && (
            <div className="absolute bottom-8 md:bottom-10 left-0 right-0 flex justify-center items-center gap-8 md:gap-12 z-40">
               <button 
                onClick={stopCamera}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/40 backdrop-blur-xl text-white flex items-center justify-center border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-rose-400 active:scale-90 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
              >
                <X size={24} />
              </button>

              <button 
                onClick={captureAndAnalyze}
                className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-90 transition-transform relative group"
              >
                <div className="absolute inset-0 rounded-full border-2 border-white/30 border-t-emerald-400 animate-spin-slow"></div>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full group-hover:scale-90 transition-transform shadow-[0_0_30px_white]"></div>
              </button>
              
              <div className="w-14 h-14 md:w-16 md:h-16"></div> {/* Spacer for balance */}
            </div>
          )}
          
          {/* Analysis Radar Overlay */}
          {analyzing && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 overflow-hidden">
              {/* Radar Animation */}
              <div className="relative w-64 h-64">
                 <div className="absolute inset-0 border border-emerald-500/30 rounded-full"></div>
                 <div className="absolute inset-4 border border-emerald-500/20 rounded-full"></div>
                 <div className="absolute inset-8 border border-emerald-500/10 rounded-full"></div>
                 <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 bg-gradient-to-b from-emerald-500/20 to-transparent animate-spin" style={{ animationDuration: '2s' }}></div>
                 
                 {/* Blips */}
                 <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                 <div className="absolute bottom-12 right-20 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping animation-delay-500"></div>
                 
                 {/* Center Icon */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine size={48} className="text-emerald-500 animate-pulse" />
                 </div>
              </div>
              
              <h3 className="text-white text-2xl font-bold tracking-widest font-heading mt-8 neon-text animate-pulse">ANALYZING</h3>
              <p className="text-emerald-400/80 text-xs mt-2 font-mono tracking-[0.3em] uppercase">Matching Crop Patterns...</p>
            </div>
          )}
        </div>

        {/* Results Section (Summary Only) */}
        {result && !analyzing && (
          <div className="p-8 md:p-10 bg-gradient-to-t from-emerald-100/30 dark:from-emerald-900/30 to-transparent animate-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
            
            {/* Classification Badge & Score */}
            <div className="flex flex-col items-center text-center mb-8 relative z-10">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4">Identification Complete</p>
              
              <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-2xl text-2xl font-bold border backdrop-blur-2xl shadow-2xl relative z-10 transition-all duration-500 mb-4 ${
                   result.classification === 'Crop' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.25)]' : 
                   result.classification === 'Weed' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.25)]' : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/50'
                }`}>
                  {result.classification === 'Crop' && <CheckCircle size={32} />}
                  {result.classification === 'Weed' && <AlertTriangle size={32} />}
                  {result.classification === 'Unknown' && <Info size={32} />}
                  <span>{result.classification}</span>
              </div>
              
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  Confidence: <span className="text-slate-800 dark:text-white text-lg">{result.confidence}%</span>
              </div>
            </div>

            {/* Link to Reports */}
            <div className="glass-premium p-6 rounded-2xl text-center border border-emerald-500/30">
               <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                 Full agronomy analysis and farming recommendations have been generated.
               </p>
               <div className="flex justify-center">
                 <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                   <FileText size={14} /> See Reports Tab
                 </div>
               </div>
            </div>

          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 z-50 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.2)] animate-pulse">
              <AlertTriangle size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 font-heading">Sensor Error</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 max-w-xs mx-auto">{error}</p>
            <button onClick={reset} className="glass-premium px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-white/40 dark:hover:bg-white/10 transition-colors border-black/10 dark:border-white/20 text-slate-700 dark:text-slate-200">
              Reinitialize
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};