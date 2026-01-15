
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { mockEvents } from '../mockData';
import { AssetClass, JurisdictionType, LegalStructure, UnifiedEvent, CashFlowNature } from '../types';

const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#D4AF37', '#F43F5E', '#94A3B8', '#0F172A'];

const ComplianceLedger: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STANDARD' | 'CUSTOM'>('STANDARD');

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-fade-in pb-32">
      <header className="flex items-end justify-between border-b border-slate-100 pb-10">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 rounded-[32px] bg-emerald-900 flex items-center justify-center text-[var(--nubebe-gold)] shadow-2xl">
              <span className="material-icons-round text-5xl">grid_view</span>
           </div>
           <div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
               全域合规账本 <span className="text-slate-400 text-xs font-black border border-slate-200 px-3 py-1 rounded-lg tracking-widest uppercase ml-4">Master Ledger</span>
             </h1>
             <p className="text-xl font-serif font-black italic text-emerald-900 mt-3 flex items-center gap-3">
               “心安的总账” <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span className="text-slate-400 font-sans text-xs uppercase tracking-[0.4em] font-black italic">The Ledger of Peace of Mind</span>
             </p>
           </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-[20px] border border-slate-200">
           <button 
             onClick={() => setActiveTab('STANDARD')}
             className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'STANDARD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             六维标准视图
           </button>
           <button 
             onClick={() => setActiveTab('CUSTOM')}
             className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'CUSTOM' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             自定义视图工坊
           </button>
        </div>
      </header>

      {activeTab === 'STANDARD' ? <StandardView events={mockEvents} /> : <CustomViewBuilder events={mockEvents} />}
    </div>
  );
};

const StandardView: React.FC<{ events: UnifiedEvent[] }> = ({ events }) => {
  const stats = useMemo(() => {
    const activeAssets = events.filter(e => e.net_amount > 0);
    const totalAssets = activeAssets.reduce((acc, e) => acc + e.functional_amount, 0);
    
    // 1. NAV Health
    const verifiedAssets = activeAssets.filter(e => e.verification_status === 'VERIFIED').reduce((acc, e) => acc + e.functional_amount, 0);
    const healthScore = totalAssets > 0 ? Math.round((verifiedAssets / totalAssets) * 100) : 100;

    // 2. Allocation
    const allocation = Object.values(AssetClass).map(type => ({
      name: type,
      value: activeAssets.filter(e => e.asset_class === type).reduce((acc, e) => acc + e.functional_amount, 0)
    })).filter(i => i.value > 0).sort((a,b) => b.value - a.value);

    // 3. Trend (Mock)
    const trend = [
      { month: 'Jan', value: totalAssets * 0.90 },
      { month: 'Feb', value: totalAssets * 0.92 },
      { month: 'Mar', value: totalAssets * 0.95 },
      { month: 'Apr', value: totalAssets * 0.94 },
      { month: 'May', value: totalAssets * 0.98 },
      { month: 'Jun', value: totalAssets * 1.0 },
    ];

    // 4. Jurisdiction
    const juris = [
      { name: 'Onshore', value: activeAssets.filter(e => e.jurisdiction_type === 'ONSHORE').reduce((acc, e) => acc + e.functional_amount, 0), color: '#3B82F6' },
      { name: 'Offshore', value: activeAssets.filter(e => e.jurisdiction_type === 'OFFSHORE').reduce((acc, e) => acc + e.functional_amount, 0), color: '#D4AF37' },
      { name: 'Long-arm', value: activeAssets.filter(e => e.jurisdiction_type === 'LONG_ARM').reduce((acc, e) => acc + e.functional_amount, 0), color: '#F43F5E' },
    ];

    // 5. Holdings
    const holdings = [...activeAssets].sort((a,b) => b.functional_amount - a.functional_amount).slice(0, 5);

    // 6. Liquidity
    const liquidAssets = activeAssets.filter(e => [AssetClass.CASH, AssetClass.SECURITY, AssetClass.CRYPTO, AssetClass.GOLD].includes(e.asset_class))
      .reduce((acc, e) => acc + e.functional_amount, 0);
    const liquidityRatio = (liquidAssets / totalAssets) * 100;

    return { totalAssets, healthScore, allocation, trend, juris, holdings, liquidityRatio };
  }, [events]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {/* 1. 净值 NAV */}
      <div className="card-jewelry p-8 bg-white group hover:border-emerald-200 transition-all flex flex-col justify-between h-[340px]">
         <div className="flex justify-between items-start">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 01. 净值概览 (NAV)
            </h3>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded uppercase">Health: {stats.healthScore}%</span>
         </div>
         <div>
            <span className="text-4xl font-mono font-black text-slate-900 block">¥ {(stats.totalAssets/10000).toLocaleString()}w</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 block">Total Net Asset Value</span>
         </div>
         <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-emerald-500" style={{ width: `${stats.healthScore}%` }}></div>
         </div>
         <p className="text-xs text-slate-500 font-medium italic mt-4">“合规净值占比较高，底层资产权属清晰。”</p>
      </div>

      {/* 2. 配置 Allocation */}
      <div className="card-jewelry p-8 bg-white group hover:border-blue-200 transition-all h-[340px] flex flex-col">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> 02. 资产配置 (Allocation)
         </h3>
         <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie data={stats.allocation} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                     {stats.allocation.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius:'12px'}} />
               </PieChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* 3. 趋势 Trend */}
      <div className="card-jewelry p-8 bg-white group hover:border-indigo-200 transition-all h-[340px] flex flex-col">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 03. 增长趋势 (Trend)
         </h3>
         <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={stats.trend}>
                  <defs>
                     <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#6366F1" fillOpacity={1} fill="url(#grad1)" strokeWidth={3} />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* 4. 法域 Jurisdiction */}
      <div className="card-jewelry p-8 bg-white group hover:border-[var(--nubebe-gold)]/30 transition-all h-[340px] flex flex-col">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--nubebe-gold)]"></span> 04. 法域分布 (Jurisdiction)
         </h3>
         <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats.juris} layout="vertical" barSize={20}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize:10, fontWeight:700}} axisLine={false} tickLine={false} />
                  <Bar dataKey="value" radius={[0,10,10,0]}>
                     {stats.juris.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* 5. 持仓 Holdings */}
      <div className="card-jewelry p-8 bg-white group hover:border-slate-300 transition-all h-[340px] flex flex-col">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span> 05. 核心持仓 (Holdings)
         </h3>
         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {stats.holdings.map((h, i) => (
               <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black text-slate-300 w-4">0{i+1}</span>
                     <div>
                        <span className="text-xs font-black text-slate-800 block truncate max-w-[120px]">{h.asset_name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{h.asset_class}</span>
                     </div>
                  </div>
                  <span className="text-xs font-mono font-black text-slate-900">¥{(h.functional_amount/10000).toFixed(0)}w</span>
               </div>
            ))}
         </div>
      </div>

      {/* 6. 流动性 Liquidity */}
      <div className="card-jewelry p-8 bg-slate-900 text-white h-[340px] flex flex-col relative overflow-hidden">
         <div className="absolute inset-0 canvas-dot-bg opacity-10"></div>
         <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-8 relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 06. 流动性 (Liquidity)
         </h3>
         <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <div className="w-32 h-32 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
               <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent -rotate-45" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${stats.liquidityRatio}%, 0 ${stats.liquidityRatio}%)` }}></div>
               <span className="text-2xl font-mono font-black text-white">{stats.liquidityRatio.toFixed(0)}%</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 text-center">Current Liquidity Ratio</p>
         </div>
      </div>
    </div>
  );
};

const CustomViewBuilder: React.FC<{ events: UnifiedEvent[] }> = ({ events }) => {
  const [selectedTag, setSelectedTag] = useState<string>('EDUCATION');
  
  const scenarios = [
    { id: 'EDUCATION', label: '二代教育基金', icon: 'school', desc: '跨账户聚合子女留学成本' },
    { id: 'CRYPTO', label: '加密资产投资', icon: 'currency_bitcoin', desc: '冷钱包与交易所资产汇总' },
    { id: 'PHILANTHROPY', label: '慈善与捐赠', icon: 'volunteer_activism', desc: '年度捐赠税务抵扣统计' },
    { id: 'US_ASSETS', label: '美国资产敞口', icon: 'flag', desc: 'FATCA 相关资产穿透' },
  ];

  const filteredEvents = useMemo(() => {
    if (selectedTag === 'EDUCATION') return events.filter(e => e.purpose_category === 'EDUCATION' || e.project_tag?.includes('Tuition'));
    if (selectedTag === 'CRYPTO') return events.filter(e => e.asset_class === AssetClass.CRYPTO);
    if (selectedTag === 'PHILANTHROPY') return events.filter(e => e.purpose_category === 'PHILANTHROPY' || e.event_type === 'DONATION');
    if (selectedTag === 'US_ASSETS') return events.filter(e => e.source_country === 'US' || e.jurisdiction_type === 'LONG_ARM');
    return [];
  }, [selectedTag, events]);

  const totalVal = filteredEvents.reduce((acc, e) => acc + (e.net_amount > 0 ? e.functional_amount : Math.abs(e.functional_amount)), 0);

  return (
    <div className="grid grid-cols-12 gap-10 min-h-[600px]">
       {/* 左侧控制台 */}
       <div className="col-span-4 space-y-6">
          <div className="card-jewelry p-8 bg-white border-slate-200">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">选择视图场景 (Select Scenario)</h3>
             <div className="space-y-3">
                {scenarios.map(s => (
                   <button 
                     key={s.id}
                     onClick={() => setSelectedTag(s.id)}
                     className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                       selectedTag === s.id 
                       ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.02]' 
                       : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                     }`}
                   >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedTag === s.id ? 'bg-white/10 text-[var(--nubebe-gold)]' : 'bg-slate-100 text-slate-400'}`}>
                         <span className="material-icons-round">{s.icon}</span>
                      </div>
                      <div>
                         <span className="text-sm font-black block tracking-tight">{s.label}</span>
                         <span className={`text-[10px] uppercase tracking-wider font-bold ${selectedTag === s.id ? 'text-white/40' : 'text-slate-300'}`}>{s.desc}</span>
                      </div>
                   </button>
                ))}
             </div>
             <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest hover:border-slate-400 hover:text-slate-600 transition-all flex items-center justify-center gap-2">
                <span className="material-icons-round">add</span>
                创建新视图逻辑
             </button>
          </div>
       </div>

       {/* 右侧预览区 */}
       <div className="col-span-8">
          <div className="card-jewelry p-12 bg-white h-full flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 pointer-events-none"></div>
             
             <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">Generated View</span>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">{scenarios.find(s => s.id === selectedTag)?.label}</h2>
                   <p className="text-sm text-slate-400 font-bold mt-2">Filter Logic: {selectedTag}</p>
                </div>
                <div className="text-right">
                   <span className="text-4xl font-mono font-black text-slate-900 block">¥ {totalVal.toLocaleString()}</span>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aggregated Value</span>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 relative z-10">
                {filteredEvents.length > 0 ? filteredEvents.map(e => (
                   <div key={e.event_id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center shadow-sm">
                            <span className="material-icons-round text-lg">
                               {e.asset_class === 'CASH' ? 'payments' : e.asset_class === 'CRYPTO' ? 'currency_bitcoin' : 'article'}
                            </span>
                         </div>
                         <div>
                            <span className="text-sm font-black text-slate-900 block">{e.asset_name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{e.institution_name} • {e.posting_date}</span>
                         </div>
                      </div>
                      <span className="text-base font-mono font-black text-slate-900">
                         {e.net_amount > 0 ? '+' : '-'}{Math.abs(e.functional_amount).toLocaleString()}
                      </span>
                   </div>
                )) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-300">
                      <span className="material-icons-round text-4xl mb-2">filter_none</span>
                      <span className="text-xs font-black uppercase tracking-widest">暂无相关资产数据</span>
                   </div>
                )}
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center relative z-10">
                <p className="text-[10px] font-bold text-slate-400 italic">"该视图由 View Builder 动态生成，数据来源于 SSoT 全域事件流。"</p>
                <div className="flex gap-4">
                   <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-all">
                      <span className="material-icons-round text-sm">print</span>
                   </button>
                   <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-all">
                      <span className="material-icons-round text-sm">share</span>
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ComplianceLedger;
