
import React, { useState } from 'react';

const Reporting: React.FC<{ events: any }> = () => {
  const [activeTab, setActiveTab] = useState<'STATUTORY' | 'JOURNAL'>('STATUTORY');

  return (
    <div className="h-full flex flex-col space-y-12 animate-fade-in pb-32">
      <header className="flex items-end justify-between border-b border-slate-100 pb-10">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 rounded-[32px] bg-emerald-900 flex items-center justify-center text-[var(--nubebe-gold)] shadow-2xl">
              <span className="material-icons-round text-5xl">description</span>
           </div>
           <div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
               法定合规报告 <span className="text-slate-400 text-xs font-black border border-slate-200 px-3 py-1 rounded-lg tracking-widest uppercase ml-4">Compliance</span>
             </h1>
             <p className="text-xl font-serif font-black italic text-emerald-900 mt-3 flex items-center gap-3">
               “通往世界的护照” <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span className="text-slate-400 font-sans text-xs uppercase tracking-[0.4em] font-black italic">The Passport to the World</span>
             </p>
           </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-[20px] border border-slate-200">
           <button 
             onClick={() => setActiveTab('STATUTORY')}
             className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'STATUTORY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             法定审计报告
           </button>
           <button 
             onClick={() => setActiveTab('JOURNAL')}
             className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'JOURNAL' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             私享账刊工坊
           </button>
        </div>
      </header>

      {activeTab === 'STATUTORY' ? <StatutoryReports /> : <JournalStudio />}
    </div>
  );
};

const StatutoryReports: React.FC = () => {
  const reports = [
    { id: 'REP-2023-CRS-01', name: '2023 Annual CRS Disclosure Report', date: '2024-05-15', jurisdiction: 'OECD/Global', status: 'Submitted', hash: '0x8f2a...3c9e' },
    { id: 'REP-2024-TAX-HK', name: 'HK Profits Tax Return - SPV 001', date: '2024-06-01', jurisdiction: 'Hong Kong', status: 'Drafting', hash: 'Pending' },
    { id: 'REP-2024-AML-02', name: 'Quarterly AML Risk Exposure Audit', date: '2024-06-10', jurisdiction: 'Internal/Compliance', status: 'Verified', hash: '0x4d1e...9a21' },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
       <div className="flex justify-end">
          <button className="bg-slate-900 text-white px-10 py-5 rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-black transition-all">
             <span className="material-icons-round">add_chart</span>
             启动新年度全域对账
          </button>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="已交付报告" value="12" sub="All Jurisdictions" icon="verified" color="text-emerald-500" />
        <StatCard title="待处理审计" value="03" sub="Doc Needed" icon="pending_actions" color="text-amber-500" />
        <StatCard title="事实一致性" value="100%" sub="Atom Fact Match" icon="analytics" color="text-blue-500" />
      </div>

      <div className="card-jewelry bg-white shadow-2xl overflow-hidden border-slate-100">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">报告存证库 (Report Registry)</h3>
            <div className="flex gap-4">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">SSoT Verified Archive</span>
            </div>
         </div>
         <div className="divide-y divide-slate-50">
            {reports.map((report) => (
              <div key={report.id} className="p-10 flex items-center justify-between hover:bg-slate-50 transition-all group">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                       <span className="material-icons-round text-3xl">article</span>
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-slate-800 tracking-tight mb-1">{report.name}</h4>
                       <div className="flex items-center gap-4">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{report.jurisdiction}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{report.date}</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-12">
                    <div className="text-right">
                       <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${report.status === 'Submitted' ? 'text-emerald-500' : 'text-amber-500'}`}>{report.status}</p>
                       <p className="text-[10px] font-mono font-bold text-slate-300 uppercase">{report.hash}</p>
                    </div>
                    <button className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                       <span className="material-icons-round">file_download</span>
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const JournalStudio: React.FC = () => {
  const [style, setStyle] = useState<'CLASSIC' | 'MODERN' | 'NOIR'>('CLASSIC');
  const [modules, setModules] = useState({
    assets: true,
    lifestyle: true,
    footprint: false,
    legacy: false,
  });

  const toggleModule = (key: keyof typeof modules) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-12 gap-10 min-h-[700px] animate-fade-in">
       {/* Settings Panel */}
       <div className="col-span-4 space-y-8">
          
          {/* Style Selector */}
          <div className="card-jewelry p-8 bg-white">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="material-icons-round text-sm">palette</span> 视觉风格 (Visual Identity)
             </h3>
             <div className="space-y-4">
                <StyleOption 
                  label="经典雅致 (Classic)" 
                  desc="Serif fonts, cream paper, gold accents." 
                  active={style === 'CLASSIC'} 
                  onClick={() => setStyle('CLASSIC')}
                  previewColor="bg-[#FDFBF7]"
                />
                <StyleOption 
                  label="现代极简 (Modern)" 
                  desc="Clean sans-serif, high whitespace." 
                  active={style === 'MODERN'} 
                  onClick={() => setStyle('MODERN')}
                  previewColor="bg-white"
                />
                <StyleOption 
                  label="暗夜鎏金 (Noir)" 
                  desc="Dark mode, premium contrast." 
                  active={style === 'NOIR'} 
                  onClick={() => setStyle('NOIR')}
                  previewColor="bg-slate-900"
                />
             </div>
          </div>

          {/* Module Selector */}
          <div className="card-jewelry p-8 bg-white">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="material-icons-round text-sm">view_quilt</span> 内容策展 (Content Curation)
             </h3>
             <div className="space-y-3">
                <ModuleToggle label="资产事实 (Asset Facts)" checked={modules.assets} onChange={() => toggleModule('assets')} />
                <ModuleToggle label="私享生活 (Lifestyle)" checked={modules.lifestyle} onChange={() => toggleModule('lifestyle')} />
                <ModuleToggle label="全球足迹 (Global Footprint)" checked={modules.footprint} onChange={() => toggleModule('footprint')} />
                <ModuleToggle label="家族传承 (Family Legacy)" checked={modules.legacy} onChange={() => toggleModule('legacy')} />
             </div>
          </div>

          <button className="w-full py-5 bg-emerald-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-950 transition-all shadow-xl flex items-center justify-center gap-3">
             <span className="material-icons-round">auto_awesome</span>
             生成预览 (Generate Preview)
          </button>
       </div>

       {/* Live Preview Panel */}
       <div className="col-span-8">
          <div className="card-jewelry p-12 bg-slate-100 h-full flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 canvas-dot-bg opacity-20"></div>
             
             {/* The Journal Preview Card */}
             <div className={`relative w-[500px] aspect-[3/4] rounded-[4px] shadow-2xl transition-all duration-700 flex flex-col p-12 ${
                style === 'NOIR' ? 'bg-slate-900 text-white' : style === 'CLASSIC' ? 'bg-[#FDFBF7] text-slate-900' : 'bg-white text-slate-900'
             }`}>
                {/* Book Binding Shadow */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none rounded-l-[4px]"></div>

                {/* Header */}
                <div className="text-center mb-16 relative z-10">
                   <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${style === 'NOIR' ? 'text-slate-500' : 'text-slate-400'}`}>Nubebe Private Journal</p>
                   <h2 className={`text-6xl font-black leading-none mb-4 ${style === 'CLASSIC' ? 'font-serif italic' : style === 'MODERN' ? 'font-sans tracking-tighter' : 'font-serif'}`}>
                      The Alpha<br/>Legacy
                   </h2>
                   <div className="flex items-center justify-center gap-4 mt-8">
                      <span className="h-px w-8 bg-current opacity-30"></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Volume 09 • Summer 2024</span>
                      <span className="h-px w-8 bg-current opacity-30"></span>
                   </div>
                </div>

                {/* Content Preview */}
                <div className="flex-1 space-y-6 relative z-10 pl-6 border-l border-current/10">
                   {modules.assets && (
                      <div className="animate-fade-in">
                         <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Chapter 01</h4>
                         <p className={`text-xl ${style === 'CLASSIC' ? 'font-serif italic' : 'font-bold'}`}>Assets & Valuation</p>
                      </div>
                   )}
                   {modules.lifestyle && (
                      <div className="animate-fade-in">
                         <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Chapter 02</h4>
                         <p className={`text-xl ${style === 'CLASSIC' ? 'font-serif italic' : 'font-bold'}`}>Curated Lifestyle</p>
                      </div>
                   )}
                   {modules.footprint && (
                      <div className="animate-fade-in">
                         <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Chapter 03</h4>
                         <p className={`text-xl ${style === 'CLASSIC' ? 'font-serif italic' : 'font-bold'}`}>Global Residency</p>
                      </div>
                   )}
                   {modules.legacy && (
                      <div className="animate-fade-in">
                         <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Chapter 04</h4>
                         <p className={`text-xl ${style === 'CLASSIC' ? 'font-serif italic' : 'font-bold'}`}>Family Governance</p>
                      </div>
                   )}
                </div>

                {/* Footer */}
                <div className="mt-auto text-center relative z-10">
                   <div className={`w-12 h-12 mx-auto border rounded-full flex items-center justify-center mb-4 ${style === 'NOIR' ? 'border-emerald-500 text-emerald-500' : 'border-slate-900 text-slate-900'}`}>
                      <span className="font-serif italic font-black text-lg">N</span>
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Prepared Exclusively for Mr. Alpha</p>
                </div>
             </div>

             <p className="mt-8 text-xs font-black text-slate-400 uppercase tracking-widest">Real-time Print Preview</p>
          </div>
       </div>
    </div>
  );
}

const StyleOption = ({ label, desc, active, onClick, previewColor }: any) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group ${
      active 
      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' 
      : 'border-slate-100 hover:border-slate-300'
    }`}
  >
     <div className={`w-12 h-16 rounded shadow-sm border border-slate-200 ${previewColor}`}></div>
     <div>
        <span className={`text-sm font-black block tracking-tight ${active ? 'text-slate-900' : 'text-slate-600'}`}>{label}</span>
        <span className="text-[10px] text-slate-400 font-medium">{desc}</span>
     </div>
     {active && <span className="material-icons-round text-slate-900 ml-auto">check_circle</span>}
  </button>
);

const ModuleToggle = ({ label, checked, onChange }: any) => (
  <div 
    onClick={onChange}
    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
      checked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:bg-slate-50'
    }`}
  >
     <span className={`text-xs font-black uppercase tracking-wide ${checked ? 'text-emerald-800' : 'text-slate-500'}`}>{label}</span>
     <div className={`w-10 h-6 rounded-full relative transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'left-5' : 'left-1'}`}></div>
     </div>
  </div>
);

const StatCard = ({ title, value, sub, icon, color }: any) => (
  <div className="card-jewelry p-10 bg-white flex items-center gap-8">
    <div className={`w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center ${color}`}>
      <span className="material-icons-round text-3xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-mono font-black text-slate-900 tracking-tighter">{value}</p>
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">{sub}</p>
    </div>
  </div>
);

export default Reporting;
