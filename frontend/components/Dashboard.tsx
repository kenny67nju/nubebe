
import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar 
} from 'recharts';
import { UnifiedEvent, AssetClass, LegalStructure, JurisdictionType, CashFlowNature } from '../types';

const COLORS = {
  TRUST: '#10B981',    // Emerald
  CORPORATE: '#6366F1', // Indigo
  INDIVIDUAL: '#94A3B8', // Slate
  GOLD: '#D4AF37',     // Gold
  RISK: '#F43F5E',     // Rose
  DARK: '#0F172A',
};

const Dashboard: React.FC<{ events: UnifiedEvent[], riskMetrics: any }> = ({ events, riskMetrics }) => {
  const [activeModule, setActiveModule] = useState<string>('ALL');
  
  const stats = useMemo(() => {
    // 通用计算：只统计净值为正的资产余额
    const activeAssets = events.filter(e => e.net_amount > 0);
    const totalAssets = activeAssets.reduce((acc, e) => acc + e.functional_amount, 0);

    // 1. 实体架构图谱 (Entity Structure)
    const entityData = [
      { name: '家族信托 (Trust)', value: 0, color: COLORS.TRUST, code: 'RISK_ISOLATED' },
      { name: '控股公司 (Corp)', value: 0, color: COLORS.CORPORATE, code: 'LIMITED_LIABILITY' },
      { name: '自然人 (Individual)', value: 0, color: COLORS.INDIVIDUAL, code: 'FULL_EXPOSURE' },
    ];
    activeAssets.forEach(e => {
      if (e.legal_structure === LegalStructure.TRUST) entityData[0].value += e.functional_amount;
      else if (e.legal_structure === LegalStructure.CORPORATE) entityData[1].value += e.functional_amount;
      else entityData[2].value += e.functional_amount;
    });

    // 2. 金融资产归集 (Financial)
    const financialTypes = [AssetClass.CASH, AssetClass.SECURITY, AssetClass.INSURANCE];
    const financialAssets = activeAssets.filter(e => financialTypes.includes(e.asset_class));
    const financialTotal = financialAssets.reduce((acc, e) => acc + e.functional_amount, 0);
    const financialDist = financialTypes.map(type => ({
        name: type,
        value: financialAssets.filter(e => e.asset_class === type).reduce((acc, e) => acc + e.functional_amount, 0)
    })).filter(i => i.value > 0);

    // 3. 实物另类资产 (Physical & Alternative)
    const physicalTypes = [AssetClass.REAL_ESTATE, AssetClass.GOLD, AssetClass.ART, AssetClass.ALTERNATIVE];
    const physicalAssetsList = activeAssets.filter(e => physicalTypes.includes(e.asset_class));
    const physicalTotal = physicalAssetsList.reduce((acc, e) => acc + e.functional_amount, 0);

    // 4. 全球税务分布 (Global Tax)
    const taxData = [
        { name: '境内 (Onshore)', value: 0, color: '#3B82F6', risk: 'LOW' },
        { name: '离岸 (Offshore)', value: 0, color: '#D4AF37', risk: 'MED' },
        { name: '长臂管辖 (US/Long-arm)', value: 0, color: '#F43F5E', risk: 'HIGH' },
    ];
    activeAssets.forEach(e => {
        if (e.jurisdiction_type === JurisdictionType.ONSHORE) taxData[0].value += e.functional_amount;
        else if (e.jurisdiction_type === JurisdictionType.OFFSHORE) taxData[1].value += e.functional_amount;
        else if (e.jurisdiction_type === JurisdictionType.LONG_ARM) taxData[2].value += e.functional_amount;
    });

    // 5. 负债流动监控 (Liquidity)
    // 模拟：流动资产 / (月均刚性支出 * 12)
    const liquidAssets = activeAssets.filter(e => [AssetClass.CASH, AssetClass.SECURITY, AssetClass.CRYPTO, AssetClass.GOLD].includes(e.asset_class))
        .reduce((acc, e) => acc + e.functional_amount, 0);
    const monthlyBurn = events.filter(e => e.cash_flow_nature === CashFlowNature.MAINTENANCE_OUT)
        .reduce((acc, e) => acc + Math.abs(e.functional_amount), 0) / 12 || 50000; // Mock fallback
    const coverageMonths = liquidAssets / monthlyBurn;
    const liquidityRatio = (liquidAssets / totalAssets) * 100;

    // 6. 数字资产金库 (Crypto)
    const cryptoAssets = activeAssets.filter(e => e.asset_class === AssetClass.CRYPTO);
    const cryptoTotal = cryptoAssets.reduce((acc, e) => acc + e.functional_amount, 0);

    return { 
        totalAssets, entityData, financialTotal, financialDist, physicalTotal, physicalAssetsList, 
        taxData, liquidityRatio, coverageMonths, cryptoTotal, cryptoAssets 
    };
  }, [events]);

  const modules = [
    { id: 'ENTITY', label: '实体架构', icon: 'account_balance' },
    { id: 'FINANCIAL', label: '金融资产', icon: 'payments' },
    { id: 'PHYSICAL', label: '实物另类', icon: 'diamond' },
    { id: 'TAX', label: '全球税务', icon: 'public' },
    { id: 'LIQUIDITY', label: '负债流动', icon: 'water_drop' },
    { id: 'DIGITAL', label: '数字金库', icon: 'token' },
  ];

  return (
    <div className="max-w-full xl:max-w-[1800px] 2xl:max-w-[2000px] mx-auto space-y-4 md:space-y-6 lg:space-y-8 animate-fade-in pb-16 md:pb-24 lg:pb-32">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-100 pb-4 md:pb-8 lg:pb-10 gap-4 md:gap-0">
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
           <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl md:rounded-3xl lg:rounded-[32px] bg-slate-900 flex items-center justify-center text-[var(--nubebe-gold)] shadow-2xl flex-shrink-0">
              <span className="material-icons-round text-3xl md:text-4xl lg:text-5xl">dashboard</span>
           </div>
           <div className="min-w-0">
             <h1 className="text-responsive-4xl md:text-responsive-5xl lg:text-responsive-6xl font-black text-slate-900 tracking-tighter flex flex-wrap items-center gap-2 md:gap-4">
               <span>资产全景架构</span>
               <span className="text-slate-400 text-responsive-xs font-black border border-slate-200 px-2 md:px-3 py-0.5 md:py-1 rounded-lg tracking-widest uppercase">Panorama</span>
             </h1>
             <p className="text-responsive-lg md:text-responsive-xl font-serif font-black italic text-emerald-900 mt-2 md:mt-3 flex flex-wrap items-center gap-2 md:gap-3">
               <span>"基业长青的版图"</span>
               <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full hidden sm:block"></span>
               <span className="text-slate-400 font-sans text-responsive-xs uppercase tracking-wider md:tracking-[0.4em] font-black italic">The Everlasting Portfolio</span>
             </p>
           </div>
        </div>
        <div className="text-left md:text-right w-full md:w-auto">
           <p className="text-responsive-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Net Asset Value</p>
           <p className="text-responsive-3xl md:text-responsive-4xl font-mono font-black text-slate-900">¥ {(stats.totalAssets / 10000).toLocaleString(undefined, { maximumFractionDigits: 0 })}w</p>
        </div>
      </header>

      {/* 模块切换 Tabs - 响应式 */}
      <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pb-2 scrollbar-hide custom-scrollbar">
        <button
          onClick={() => setActiveModule('ALL')}
          className={`flex-shrink-0 px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 rounded-xl md:rounded-2xl text-responsive-xs font-black uppercase tracking-wider md:tracking-widest transition-all ${
            activeModule === 'ALL'
              ? 'bg-slate-900 text-white shadow-lg'
              : 'bg-white text-slate-400 hover:bg-slate-50'
          }`}
        >
          <span className="hidden sm:inline">全景视图 (ALL)</span>
          <span className="sm:hidden">全景</span>
        </button>
        <div className="w-px h-4 md:h-6 bg-slate-200 mx-1 md:mx-2"></div>
        {modules.map(mod => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod.id)}
            className={`flex-shrink-0 px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 rounded-xl md:rounded-2xl text-responsive-xs font-black uppercase tracking-wider md:tracking-widest transition-all flex items-center gap-1 md:gap-2 ${
              activeModule === mod.id
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm'
                : 'bg-white text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="material-icons-round text-sm md:text-base">{mod.icon}</span>
            <span className="hidden sm:inline">{mod.label}</span>
          </button>
        ))}
      </div>

      {/* 六大模块 Grid 布局 - 响应式 */}
      <div className={`grid gap-4 md:gap-6 lg:gap-8 transition-all ${activeModule === 'ALL' ? 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1'}`}>
         
         {/* Module 1: 实体架构图谱 - 响应式 */}
         {(activeModule === 'ALL' || activeModule === 'ENTITY') && (
         <div className={`card-jewelry p-4 md:p-6 lg:p-8 bg-white flex flex-col group hover:border-emerald-200 transition-all ${activeModule === 'ENTITY' ? 'min-h-[400px] md:h-[500px] lg:h-[600px] max-w-4xl mx-auto w-full' : 'min-h-[300px] md:h-[350px] lg:h-[400px]'}`}>
            <h3 className="text-responsive-xs font-black text-slate-400 uppercase tracking-wider md:tracking-[0.3em] mb-4 md:mb-6 flex items-center gap-2">
               <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-emerald-500 rounded-full"></span> <span className="hidden sm:inline">01. 实体架构图谱 (Legal Structure)</span><span className="sm:hidden">实体架构</span>
            </h3>
            <div className="flex-1 flex flex-col justify-center space-y-4 md:space-y-6">
               {stats.entityData.map((item, index) => (
                  <div key={index} className="relative">
                     <div className="flex justify-between items-end mb-1 md:mb-2">
                        <span className="text-responsive-xs font-black text-slate-700 uppercase truncate pr-2">{item.name}</span>
                        <span className="text-responsive-xs font-mono font-bold text-slate-500 flex-shrink-0">{(item.value / stats.totalAssets * 100).toFixed(1)}%</span>
                     </div>
                     <div className="h-2 md:h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                           className="h-full rounded-full transition-all duration-1000"
                           style={{ width: `${(item.value / stats.totalAssets * 100)}%`, backgroundColor: item.color }}
                        ></div>
                     </div>
                     <span className="text-responsive-xs font-black text-slate-300 uppercase tracking-wider md:tracking-widest mt-1 block">{item.code}</span>
                  </div>
               ))}
            </div>
            <p className="text-responsive-xs text-slate-400 text-center mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-50">
               <span className="text-emerald-500 font-bold">{(stats.entityData[0].value / stats.totalAssets * 100).toFixed(0)}%</span> 资产处于信托保护伞下
            </p>
         </div>
         )}

         {/* Module 2: 金融资产归集 - 响应式 */}
         {(activeModule === 'ALL' || activeModule === 'FINANCIAL') && (
         <div className={`card-jewelry p-4 md:p-6 lg:p-8 bg-white flex flex-col group hover:border-blue-200 transition-all ${activeModule === 'FINANCIAL' ? 'min-h-[400px] md:h-[500px] lg:h-[600px] max-w-4xl mx-auto w-full' : 'min-h-[300px] md:h-[350px] lg:h-[400px]'}`}>
            <h3 className="text-responsive-xs font-black text-slate-400 uppercase tracking-wider md:tracking-[0.3em] mb-2 flex items-center gap-2">
               <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-blue-500 rounded-full"></span> <span className="hidden sm:inline">02. 金融资产归集 (Financial)</span><span className="sm:hidden">金融资产</span>
            </h3>
            <div className="flex-1 flex items-center justify-center relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={stats.financialDist}
                        innerRadius={activeModule === 'FINANCIAL' ? 120 : 60}
                        outerRadius={activeModule === 'FINANCIAL' ? 160 : 80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {stats.financialDist.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#93C5FD'} />
                        ))}
                     </Pie>
                     <Tooltip contentStyle={{borderRadius: '12px'}} />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={`font-mono font-black text-slate-900 ${activeModule === 'FINANCIAL' ? 'text-responsive-4xl' : 'text-responsive-xl'}`}>¥{(stats.financialTotal / 10000).toFixed(0)}w</span>
                  <span className="text-responsive-xs font-black text-slate-400 uppercase tracking-wider md:tracking-widest">Liquid</span>
               </div>
            </div>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2 mt-2">
               {stats.financialDist.map((i, idx) => (
                  <span key={idx} className="px-1.5 md:px-2 py-0.5 md:py-1 bg-slate-50 rounded text-responsive-xs font-bold text-slate-500 uppercase">{i.name}</span>
               ))}
            </div>
         </div>
         )}

         {/* Module 3: 实物另类资产 - 响应式 */}
         {(activeModule === 'ALL' || activeModule === 'PHYSICAL') && (
         <div className={`card-jewelry p-4 md:p-6 lg:p-8 bg-slate-50 flex flex-col group hover:border-[var(--nubebe-gold)]/30 transition-all ${activeModule === 'PHYSICAL' ? 'min-h-[400px] md:h-[500px] lg:h-[600px] max-w-4xl mx-auto w-full' : 'min-h-[300px] md:h-[350px] lg:h-[400px]'}`}>
            <h3 className="text-responsive-xs font-black text-slate-400 uppercase tracking-wider md:tracking-[0.3em] mb-4 md:mb-6 flex items-center gap-2">
               <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-[var(--nubebe-gold)] rounded-full"></span> <span className="hidden sm:inline">03. 实物另类资产 (Physical)</span><span className="sm:hidden">实物资产</span>
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2 space-y-2 md:space-y-3">
               {stats.physicalAssetsList.length > 0 ? stats.physicalAssetsList.map(item => (
                  <div key={item.event_id} className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-slate-100 flex items-center gap-2 md:gap-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center flex-shrink-0">
                        <span className="material-icons-round text-lg md:text-xl">
                           {item.asset_class === 'REAL_ESTATE' ? 'apartment' : item.asset_class === 'GOLD' ? 'grid_goldenratio' : 'palette'}
                        </span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <span className="text-responsive-xs font-black text-slate-900 block truncate">{item.asset_name}</span>
                        <span className="text-responsive-xs font-bold text-slate-400 uppercase">{item.jurisdiction_type}</span>
                     </div>
                     <span className="text-responsive-xs font-mono font-black text-slate-900 flex-shrink-0">¥{(item.functional_amount/10000).toFixed(0)}w</span>
                  </div>
               )) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-responsive-xs font-bold uppercase">暂无实物资产录入</div>
               )}
            </div>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-200 flex justify-between items-center">
               <span className="text-responsive-xs font-black text-slate-400 uppercase">Total Valuation</span>
               <span className="text-responsive-lg md:text-responsive-xl font-mono font-black text-[var(--nubebe-gold)]">¥ {(stats.physicalTotal / 10000).toLocaleString()}w</span>
            </div>
         </div>
         )}

         {/* Module 4: 全球税务分布 - 响应式 */}
         {(activeModule === 'ALL' || activeModule === 'TAX') && (
         <div className={`card-jewelry p-4 md:p-6 lg:p-8 bg-white flex flex-col group hover:border-indigo-200 transition-all ${activeModule === 'TAX' ? 'min-h-[400px] md:h-[500px] lg:h-[600px] max-w-4xl mx-auto w-full' : 'min-h-[300px] md:h-[350px] lg:h-[400px]'}`}>
            <h3 className="text-responsive-xs font-black text-slate-400 uppercase tracking-wider md:tracking-[0.3em] mb-4 md:mb-6 flex items-center gap-2">
               <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-indigo-500 rounded-full"></span> <span className="hidden sm:inline">04. 全球税务分布 (Tax Map)</span><span className="sm:hidden">税务分布</span>
            </h3>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.taxData} layout="vertical" barSize={32}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px'}} />
                     <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {stats.taxData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="flex gap-2 mt-2 p-2 md:p-3 bg-red-50 rounded-lg md:rounded-xl border border-red-100">
               <span className="material-icons-round text-red-500 text-sm md:text-base flex-shrink-0">warning</span>
               <p className="text-responsive-xs font-bold text-red-600 leading-tight">
                  长臂管辖资产占比 {(stats.taxData[2].value / stats.totalAssets * 100).toFixed(1)}%。<br className="hidden md:block"/>需关注 FATCA 申报合规性。
               </p>
            </div>
         </div>
         )}

         {/* Module 5: 负债流动监控 - 响应式 */}
         {(activeModule === 'ALL' || activeModule === 'LIQUIDITY') && (
         <div className={`card-jewelry p-4 md:p-6 lg:p-8 bg-slate-900 text-white flex flex-col relative overflow-hidden group ${activeModule === 'LIQUIDITY' ? 'min-h-[400px] md:h-[500px] lg:h-[600px] max-w-4xl mx-auto w-full' : 'min-h-[300px] md:h-[350px] lg:h-[400px]'}`}>
            <div className="absolute inset-0 canvas-dot-bg opacity-10"></div>
            <h3 className="text-responsive-xs font-black text-emerald-400 uppercase tracking-wider md:tracking-[0.3em] mb-4 md:mb-8 relative z-10 flex items-center gap-2">
               <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-emerald-400 rounded-full"></span> <span className="hidden sm:inline">05. 负债流动监控 (Liquidity)</span><span className="sm:hidden">负债流动</span>
            </h3>
            
            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
               <div className={`rounded-full border-4 md:border-6 lg:border-8 border-slate-700 flex items-center justify-center relative ${activeModule === 'LIQUIDITY' ? 'w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64' : 'w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40'}`}>
                  <div className="absolute inset-0 rounded-full border-4 md:border-6 lg:border-8 border-emerald-500 border-t-transparent -rotate-45 transition-all duration-1000" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${stats.liquidityRatio}%, 0 ${stats.liquidityRatio}%)` }}></div>
                  <div className="text-center">
                     <span className={`font-mono font-black text-white block ${activeModule === 'LIQUIDITY' ? 'text-responsive-5xl md:text-responsive-6xl' : 'text-responsive-3xl md:text-responsive-4xl'}`}>{stats.liquidityRatio.toFixed(0)}%</span>
                     <span className="text-responsive-xs font-black text-slate-400 uppercase tracking-wider md:tracking-widest">Ratio</span>
                  </div>
               </div>
            </div>

            <div className="mt-4 md:mt-6 relative z-10 bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 flex justify-between items-center gap-2">
               <div className="min-w-0">
                  <span className="text-responsive-xs font-black text-slate-400 uppercase block">Burn Rate Coverage</span>
                  <span className="text-responsive-xs font-bold text-slate-300 truncate block">覆盖刚性支出</span>
               </div>
               <span className="text-responsive-lg md:text-responsive-xl font-mono font-black text-emerald-400 flex-shrink-0">{stats.coverageMonths.toFixed(1)} Mths</span>
            </div>
         </div>
         )}

         {/* Module 6: 数字资产金库 - 响应式 */}
         {(activeModule === 'ALL' || activeModule === 'DIGITAL') && (
         <div className={`card-jewelry p-4 md:p-6 lg:p-8 bg-[#0B1120] text-white flex flex-col relative overflow-hidden border-slate-800 group hover:border-emerald-500/50 transition-all ${activeModule === 'DIGITAL' ? 'min-h-[400px] md:h-[500px] lg:h-[600px] max-w-4xl mx-auto w-full' : 'min-h-[300px] md:h-[350px] lg:h-[400px]'}`}>
            <div className="absolute -right-10 -top-10 w-32 h-32 md:w-40 md:h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-responsive-xs font-black text-emerald-500 uppercase tracking-wider md:tracking-[0.3em] mb-4 md:mb-6 flex items-center gap-2 relative z-10">
               <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> <span className="hidden sm:inline">06. 数字资产金库 (Vault)</span><span className="sm:hidden">数字金库</span>
            </h3>
            
            <div className="flex-1 relative z-10">
               <div className="text-center mb-4 md:mb-8">
                  <span className={`font-mono font-black text-white block ${activeModule === 'DIGITAL' ? 'text-responsive-4xl md:text-responsive-5xl' : 'text-responsive-2xl md:text-responsive-3xl'}`}>¥ {(stats.cryptoTotal).toLocaleString()}</span>
                  <span className="text-responsive-xs font-black text-slate-500 uppercase tracking-wider md:tracking-widest">Total Crypto Balance</span>
               </div>
               <div className="space-y-2 md:space-y-3">
                  {stats.cryptoAssets.map((e, i) => (
                     <div key={i} className="flex justify-between items-center p-2 md:p-3 bg-white/5 rounded-lg md:rounded-xl border border-white/5 hover:bg-white/10 transition-all gap-2">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                           <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#F7931A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">₿</div>
                           <div className="min-w-0">
                              <span className="text-responsive-xs font-black text-white block truncate">{e.asset_name.split(' ')[0]}</span>
                              <span className="text-responsive-xs font-bold text-slate-500 uppercase truncate block">{e.institution_name.split(' ')[0]}</span>
                           </div>
                        </div>
                        <span className="text-responsive-xs font-mono font-bold text-emerald-400 flex-shrink-0">{e.quantity}</span>
                     </div>
                  ))}
               </div>
            </div>
            <div className="mt-auto relative z-10 pt-3 md:pt-4 border-t border-white/5 flex justify-between items-center">
               <span className="text-responsive-xs font-black text-slate-500 uppercase">Private Keys</span>
               <span className="text-responsive-xs font-black text-emerald-500 uppercase flex items-center gap-1">
                  <span className="material-icons-round text-xs md:text-sm">lock</span> Secured
               </span>
            </div>
         </div>
         )}

      </div>
    </div>
  );
};

export default Dashboard;
