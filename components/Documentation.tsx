import React from 'react';
import { Leaf, Target, Database, Cpu, Layers, Camera, CheckCircle, Smartphone, Zap, ArrowRight, Activity, BarChart3, ScanLine, FileBarChart } from 'lucide-react';

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-5 mb-8">
    <div className="p-3.5 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl text-emerald-500 dark:text-emerald-400 ring-1 ring-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.1)] dark:shadow-[0_0_25px_rgba(16,185,129,0.15)] backdrop-blur-xl">
      {icon}
    </div>
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight font-heading drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{title}</h2>
      {subtitle && <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mt-1 uppercase tracking-widest">{subtitle}</p>}
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string }> = ({ icon, title, desc, color }) => (
  <div className={`glass-premium glass-card-hover p-8 rounded-[2rem] relative overflow-hidden group h-full flex flex-col`}>
    {/* Decorative Glow Blob */}
    <div className={`absolute top-0 right-0 w-48 h-48 ${color} opacity-[0.06] rounded-bl-full -mr-12 -mt-12 blur-3xl transition-transform duration-700 group-hover:scale-150 group-hover:opacity-15`}></div>
    
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/60 dark:bg-white/5 text-slate-700 dark:text-white backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 dark:text-white text-xl mb-3 tracking-wide group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">{desc}</p>
    </div>
    
    <div className="mt-auto pt-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
      <ArrowRight size={18} className="text-emerald-500 dark:text-emerald-400" />
    </div>
  </div>
);

export const Documentation: React.FC = () => {
  return (
    <div className="section-glass-wrapper space-y-24 pb-20">
      
      {/* Hero Section */}
      <div className="text-center space-y-8 pt-6 md:pt-12 pb-12 relative isolate">
        {/* Floating background particles */}
        <div className="absolute top-10 left-1/4 w-2 h-2 bg-emerald-400 rounded-full blur-[2px] animate-pulse"></div>
        <div className="absolute top-20 right-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-[2px] animate-pulse animation-delay-2000"></div>
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)] dark:shadow-[0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-xl animate-in fade-in zoom-in duration-700">
          <Activity size={12} className="fill-current animate-pulse" />
          <span>Project Report 2025</span>
        </div>
        
        <div className="relative">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-slate-700 via-slate-800 to-slate-500 dark:from-white dark:via-slate-100 dark:to-slate-400 tracking-tight leading-[1.1] drop-shadow-sm dark:drop-shadow-2xl animate-breathe">
            Pest & Weed Detection <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 dark:from-[#34f5c5] dark:via-[#4fd4ff] dark:to-[#2dfaa0] bg-[length:200%_auto] animate-shimmer filter dark:drop-shadow-[0_0_25px_rgba(52,211,153,0.4)]">
              Using Artificial Intelligence
            </span>
          </h1>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light tracking-wide opacity-90">
          An automated system utilizing <span className="text-emerald-600 dark:text-emerald-300 font-semibold">ResNet50</span> and Deep Learning to identify crop health issues with <span className="text-cyan-600 dark:text-cyan-300 font-semibold">94.2% accuracy</span>.
        </p>
      </div>

      {/* Intro Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Problem Statement */}
        <div className="glass-premium glass-card-hover p-10 rounded-[2.5rem]">
          <SectionHeader 
            icon={<Target size={24} />} 
            title="Problem Statement" 
            subtitle="Agricultural Challenges"
          />
          <div className="prose prose-sm max-w-none">
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-base">
              Traditional methods of pest and weed identification depend on manual field inspection, which is slow, labor-intensive, and prone to error. This often leads to the heavy use of pesticides, causing environmental harm.
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Manual Inspection', desc: 'Time-consuming and inefficient.', color: 'bg-rose-500' },
                { label: 'Chemical Overuse', desc: 'Harmful to soil and ecosystem.', color: 'bg-amber-500' },
                { label: 'Crop Loss', desc: 'Delayed detection reduces yield.', color: 'bg-purple-500' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/20 transition-all">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-[0_0_10px_currentColor] shrink-0`} />
                  <span><strong className="text-slate-900 dark:text-white tracking-wide">{item.label}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Objective */}
        <div className="glass-premium glass-card-hover p-10 rounded-[2.5rem] flex flex-col relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <SectionHeader 
            icon={<CheckCircle size={24} />} 
            title="Project Objective" 
            subtitle="Sustainable Solutions"
          />
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 flex-1 text-base">
            To develop an AI-based system using Convolutional Neural Networks (CNNs) that efficiently detects pests and weeds from drone or field camera imagery. This promotes eco-friendly farming by enabling precise chemical application.
          </p>
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-3xl p-8 border border-emerald-500/20 backdrop-blur-md relative">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              Core Goals
            </h4>
            <div className="flex flex-wrap gap-3">
              {['Early Detection', 'Precision Agriculture', 'Reduce Costs', 'Eco-Friendly'].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-emerald-100/50 dark:bg-emerald-950/30 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-200 shadow-sm dark:shadow-lg border border-emerald-500/10 dark:border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 hover:text-emerald-900 dark:hover:text-white transition-all cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Methodology & Tech Stack */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 glass-premium glass-card-hover p-10 rounded-[2.5rem]">
           <SectionHeader icon={<Layers size={24} />} title="Methodology" subtitle="System Architecture" />
           <div className="grid sm:grid-cols-2 gap-6">
             <div className="bg-white/50 dark:bg-slate-800/40 p-6 rounded-3xl border border-black/5 dark:border-white/5 hover:border-cyan-500/40 transition-colors group shadow-sm dark:shadow-none">
               <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-3">
                 <Cpu size={18} className="text-cyan-500 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" /> ResNet50 Model
               </h3>
               <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300">
                 Utilizes Transfer Learning with a pre-trained ResNet50 backbone. This deep CNN architecture is optimized to detect subtle patterns in crop leaves.
               </p>
             </div>
             <div className="bg-white/50 dark:bg-slate-800/40 p-6 rounded-3xl border border-black/5 dark:border-white/5 hover:border-purple-500/40 transition-colors group shadow-sm dark:shadow-none">
               <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-3">
                 <ScanLine size={18} className="text-purple-500 dark:text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" /> Preprocessing
               </h3>
               <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300">
                 Images are resized to 224x224, normalized, and augmented (rotation, flipping) to increase dataset diversity and model robustness.
               </p>
             </div>
           </div>
        </div>
        
        {/* Dataset Statistics */}
        <div className="glass-premium glass-card-hover p-8 rounded-[2.5rem] flex flex-col justify-between">
          <SectionHeader icon={<Database size={24} />} title="Dataset" subtitle="6,000 Images" />
          <div className="space-y-6 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 tracking-wider">
                <span>Pest Images</span>
                <span className="text-amber-500 dark:text-amber-400">2,200</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-[37%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 tracking-wider">
                <span>Healthy Crops</span>
                <span className="text-emerald-500 dark:text-emerald-400">2,000</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[33%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 tracking-wider">
                <span>Weed Images</span>
                <span className="text-rose-500 dark:text-rose-400">1,800</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 w-[30%] shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center border-t border-black/5 dark:border-white/5 pt-4 font-mono">
              Source: Kaggle, Plant-Village, Field Data
            </p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="glass-premium glass-card-hover p-10 rounded-[2.5rem]">
        <SectionHeader icon={<BarChart3 size={24} />} title="Results & Performance" subtitle="Model Evaluation" />
        <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
               <h4 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-2">94.2%</h4>
               <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Overall Accuracy</p>
            </div>
            <div className="p-6 bg-cyan-500/10 rounded-3xl border border-cyan-500/20">
               <h4 className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mb-2">92.8%</h4>
               <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Pest Precision</p>
            </div>
            <div className="p-6 bg-purple-500/10 rounded-3xl border border-purple-500/20">
               <h4 className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-2">93.5%</h4>
               <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Weed Precision</p>
            </div>
            <div className="p-6 bg-amber-500/10 rounded-3xl border border-amber-500/20">
               <h4 className="text-3xl font-black text-amber-600 dark:text-amber-400 mb-2">0.92s</h4>
               <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Inference Time</p>
            </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-12">
        <div className="flex items-center justify-center gap-4">
           <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-400/50 dark:to-white/20"></div>
           <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center font-heading tracking-tight drop-shadow-md">Development Workflow</h2>
           <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-400/50 dark:to-white/20"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Data Collection', desc: 'Drones, IoT Sensors, Kaggle' },
            { step: '02', title: 'Preprocessing', desc: 'Resize to 224x224, Augmentation' },
            { step: '03', title: 'Training', desc: 'ResNet50 with Transfer Learning' },
            { step: '04', title: 'Validation', desc: 'Confusion Matrix & F1-Score' },
          ].map((item, i) => (
             <div key={i} className="glass-premium p-8 rounded-[2rem] relative group hover:-translate-y-2 transition-transform duration-500 overflow-hidden border border-white/40 dark:border-white/5 hover:border-emerald-500/30">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 dark:bg-white/5 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
               <span className="text-6xl font-black text-slate-200 dark:text-white/5 absolute top-2 right-4 -z-0 group-hover:text-emerald-500/20 transition-colors font-heading">{item.step}</span>
               <div className="relative z-10 mt-4">
                 <h3 className="font-bold text-slate-800 dark:text-white text-lg tracking-wide mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">{item.title}</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
               </div>
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             </div>
          ))}
        </div>
      </div>

      {/* Future Scope */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-premium p-10 rounded-[2.5rem] relative overflow-hidden group border border-emerald-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 dark:from-emerald-900/10 to-transparent opacity-50"></div>
          <div className="absolute -right-32 -top-32 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-1000"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-4 text-slate-800 dark:text-white">
              <Smartphone className="text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]" /> 
              Future Scope
            </h3>
            <ul className="space-y-6">
              {[
                'Multispectral & Hyperspectral Imaging',
                'Real-Time Drone Integration',
                'Transformer-Based Models',
                'Multi-Species Detection'
              ].map((text, idx) => (
                <li key={idx} className="flex items-center gap-5 text-slate-700 dark:text-emerald-100/90 group/item">
                  <span className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover/item:bg-emerald-500/20 transition-colors group-hover/item:scale-110 duration-300">
                    {idx + 1}
                  </span>
                  <span className="font-light tracking-wide text-lg">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6">
           <FeatureCard 
            icon={<Cpu size={22} />} 
            title="Edge Deployment" 
            desc="Optimizing for Raspberry Pi & mobile devices."
            color="bg-blue-500"
           />
           <FeatureCard 
            icon={<Leaf size={22} />} 
            title="Sustainable Farming" 
            desc="Reducing pesticide use through spot-spraying."
            color="bg-emerald-500"
           />
           <FeatureCard 
            icon={<FileBarChart size={22} />} 
            title="Predictive Analytics" 
            desc="Forecasting pest outbreaks using historical data."
            color="bg-purple-500"
           />
        </div>
      </div>

    </div>
  );
};