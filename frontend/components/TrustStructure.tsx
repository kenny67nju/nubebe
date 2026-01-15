
import React from 'react';

const TrustStructure: React.FC = () => {
  const entities = [
    { id: 'TRST-001', name: 'Lumina Legacy Trust', jurisdiction: 'Cayman Islands', type: 'Discretionary Trust', role: 'Top Holding', status: 'Compliant' },
    { id: 'HLD-001', name: 'Lumina Holding (BVI) Ltd', jurisdiction: 'BVI', type: 'Investment Holding', role: 'Intermediate', status: 'Compliant' },
    { id: 'SPV-001', name: 'Nubebe Tech HK Ltd', jurisdiction: 'Hong Kong', type: 'Operating Entity', role: 'Asset Holder', status: 'Compliant' },
    { id: 'SPV-002', name: 'Alpha Real Estate SG Pte', jurisdiction: 'Singapore', type: 'Property Holding', role: 'Asset Holder', status: 'Verified' },
  ];

  return (
    <div className="h-full flex flex-col space-y-12 animate-fade-in pb-20">
      <header className="flex items-end justify-between border-b border-slate-100 pb-12">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 rounded-[32px] bg-slate-900 flex items-center justify-center text-[var(--nubebe-gold)] shadow-2xl">
              <span className="material-icons-round text-5xl">account_balance</span>
           </div>
           <div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter">法律实体矩阵 <span className="text-slate-400 text-xs font-black border border-slate-200 px-3 py-1 rounded-lg tracking-widest uppercase ml-4">Legal Matrix</span></h1>
             <p className="text-xl font-serif font-black italic text-emerald-900 mt-3 flex items-center gap-3">
               “隐形的守护盾牌” <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span className="text-slate-400 font-sans text-xs uppercase tracking-[0.4em] font-black italic">The Invisible Guarding Shield</span>
             </p>
           </div>
        </div>
        <div className="flex gap-4">
           <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
             模拟架构演变分析
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
         {/* 树状穿透示意图 */}
         <div className="card-jewelry p-12 bg-white flex flex-col gap-10">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">穿透式控股架构视图 (UBO Transparency)</h3>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                     <span className="text-[10px] font-black uppercase text-slate-400">KYC/UBO 已确证</span>
                  </div>
               </div>
            </div>

            <div className="relative flex flex-col items-center py-10">
               {entities.map((entity, index) => (
                 <React.Fragment key={entity.id}>
                    <div className="w-full max-w-2xl group">
                       <div className="card-jewelry p-8 bg-slate-50 border-slate-100 hover:border-slate-900 transition-all cursor-pointer relative z-10">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                   <span className="material-icons-round text-slate-900 text-2xl">
                                      {index === 0 ? 'gavel' : index === 1 ? 'business' : 'account_balance_wallet'}
                                   </span>
                                </div>
                                <div>
                                   <h4 className="text-lg font-black text-slate-900 tracking-tight">{entity.name}</h4>
                                   <div className="flex items-center gap-3 mt-1">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{entity.jurisdiction}</span>
                                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                      <span className="text-[10px] font-black text-[var(--nubebe-gold)] uppercase tracking-widest">{entity.type}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{entity.status}</p>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">ID: {entity.id}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                    {index < entities.length - 1 && (
                      <div className="h-12 w-px bg-slate-200 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <span className="material-icons-round text-slate-200 text-sm">keyboard_arrow_down</span>
                         </div>
                      </div>
                    )}
                 </React.Fragment>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-jewelry p-10 bg-white">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">合规穿透深度</h4>
               <div className="flex items-center gap-4">
                  <span className="text-5xl font-mono font-black text-slate-900">100%</span>
                  <p className="text-xs text-slate-500 font-medium italic">所有的控股节点均已关联至 Nubebe 原子事实流，无任何隐形代理持股。</p>
               </div>
            </div>
            <div className="card-jewelry p-10 bg-slate-900 text-white">
               <h4 className="text-xs font-black text-[var(--nubebe-gold)] uppercase tracking-widest mb-6">家族办公室特别声明</h4>
               <p className="text-sm font-medium leading-relaxed opacity-70">
                 本矩阵架构已通过 2024 年度 CRS 反避税合规审查。所有的 SPV 均具备实质性经营事实或合理的资产持有逻辑。
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TrustStructure;
