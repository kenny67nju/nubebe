
import React, { useState } from 'react';
import { UnifiedEvent } from '../types';

const FlowGraph: React.FC<{ events: UnifiedEvent[], selectedEventId: string | null, onSelectEvent: (id: string) => void }> = ({ events }) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const getOriginConfig = () => {
    if (activeFilter === 'GOLD') return { icon: 'grid_goldenratio', label: 'Vault Storage', sub: '实物金库' };
    if (activeFilter === 'ART') return { icon: 'palette', label: 'Freeport', sub: '自由港' };
    return { icon: 'account_balance', label: 'Origin', sub: '汇入账户' };
  };

  const originConfig = getOriginConfig();

  return (
    <div className="h-full flex flex-col space-y-12 animate-fade-in">
      <header className="flex items-end justify-between border-b border-slate-100 pb-12">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 rounded-[32px] bg-emerald-900 flex items-center justify-center text-[var(--nubebe-gold)] shadow-2xl">
              <span className="material-icons-round text-5xl">account_tree</span>
           </div>
           <div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter">资金穿透溯源 <span className="text-slate-400 text-xs font-black border border-slate-200 px-3 py-1 rounded-lg tracking-widest uppercase ml-4">Origin Trace</span></h1>
             <p className="text-xl font-serif font-black italic text-emerald-900 mt-3 flex items-center gap-3">
               “清白财富的荣耀” <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span className="text-slate-400 font-sans text-xs uppercase tracking-[0.4em] font-black italic">The Glory of Transparent Wealth</span>
             </p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           {/* Asset Filters */}
           <div className="flex bg-slate-100 p-1.5 rounded-[20px] border border-slate-200">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === 'ALL' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                全域视图
              </button>
              <button
                onClick={() => setActiveFilter('GOLD')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === 'GOLD' 
                    ? 'bg-[var(--nubebe-gold)]/10 text-[var(--nubebe-gold)] shadow-sm ring-1 ring-[var(--nubebe-gold)]/20' 
                    : 'text-slate-400 hover:text-[var(--nubebe-gold)]'
                }`}
              >
                <span className="material-icons-round text-sm">grid_goldenratio</span>
                Gold
              </button>
              <button
                onClick={() => setActiveFilter('ART')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === 'ART' 
                    ? 'bg-purple-50 text-purple-600 shadow-sm ring-1 ring-purple-100' 
                    : 'text-slate-400 hover:text-purple-600'
                }`}
              >
                <span className="material-icons-round text-sm">palette</span>
                Art
              </button>
           </div>

           <div className="flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-2xl border border-slate-200">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">资金清洗度检测</span>
              <span className="text-sm font-black text-emerald-600">99.8% CLEAR</span>
           </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-10">
         <div className="col-span-8 card-jewelry bg-white p-12 relative overflow-hidden flex items-center justify-center canvas-dot-bg">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-transparent pointer-events-none"></div>
            <div className="text-center space-y-8 relative z-10">
               <div className="flex items-center justify-center gap-12">
                  <TraceNode icon={originConfig.icon} label={originConfig.label} sub={originConfig.sub} />
                  <div className="w-48 h-[2px] bg-gradient-to-r from-emerald-500 to-slate-200 relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">Verified Path</div>
                  </div>
                  <TraceNode icon="payments" label="Transit" sub="实体分发" active />
                  <div className="w-48 h-[2px] bg-slate-200"></div>
                  <TraceNode icon="home" label="Destination" sub="资产入账" />
               </div>
               <p className="text-xs font-black text-slate-300 uppercase tracking-[1em] pt-12">穿透路径可视化逻辑引擎</p>
            </div>
         </div>
         <div className="col-span-4 card-jewelry bg-slate-900 text-white p-10 flex flex-col justify-between">
            <div>
               <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest mb-10">SSoT 原子路径审计单</h3>
               <div className="space-y-8">
                  <TraceLogItem time="09:30:15" action="FACT_CAPTURED" detail={`原子事实 ID: ${activeFilter !== 'ALL' ? activeFilter + '_001' : 'evt_001'} 入库`} />
                  <TraceLogItem time="09:30:16" action="ENTITY_RESOLVED" detail="法律主体: Mr. Alpha (Individual)" />
                  <TraceLogItem time="09:30:18" action="PATH_VERIFIED" detail="HSBC HK -> BVI Entity 链路已确证" />
                  <TraceLogItem time="09:30:20" action="COMPLIANCE_SIGNED" detail="合规引擎无感签名完成" />
               </div>
            </div>
            <div className="pt-10 border-t border-white/5">
               <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-widest">
                 该路径已通过 Nubebe Blockchain 存证，具备不可篡改的法律证据效力。
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

const TraceNode = ({ icon, label, sub, active }: any) => (
  <div className="flex flex-col items-center gap-4">
     <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${active ? 'bg-slate-900 text-[var(--nubebe-gold)] scale-110 ring-8 ring-slate-900/5' : 'bg-slate-50 text-slate-300'}`}>
        <span className="material-icons-round text-4xl">{icon}</span>
     </div>
     <div className="text-center">
        <p className={`text-xs font-black uppercase tracking-widest transition-colors ${active ? 'text-slate-900' : 'text-slate-300'}`}>{label}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{sub}</p>
     </div>
  </div>
);

const TraceLogItem = ({ time, action, detail }: any) => (
  <div className="flex gap-6 items-start animate-fade-in">
     <span className="text-[10px] font-mono text-white/20 pt-1">{time}</span>
     <div>
        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">{action}</span>
        <p className="text-xs font-medium text-slate-300">{detail}</p>
     </div>
  </div>
);

export default FlowGraph;
