
import React, { useState } from 'react';

type RuleType = 'CRS' | 'FATCA' | 'IIT';
type ClassificationStep = 'INDICIA' | 'TIE_BREAKER' | 'FINAL_STATUS';

const TaxLogicCanvas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RuleType>('CRS');
  const [generating, setGenerating] = useState(false);

  const handleGenerateXML = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-12 animate-fade-in pb-32">
      <header className="flex items-end justify-between border-b border-slate-100 pb-12">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 rounded-[32px] bg-slate-900 flex items-center justify-center text-white shadow-2xl">
              <span className="material-icons-round text-5xl">policy</span>
           </div>
           <div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
               CRS/FATCA 引擎 <span className="text-slate-400 text-xs font-black border border-slate-200 px-3 py-1 rounded-lg tracking-widest uppercase ml-4">Tax Compliance Engine</span>
             </h1>
             <p className="text-xl font-serif font-black italic text-emerald-900 mt-3 flex items-center gap-3">
               “透明世界的通行证” <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span className="text-slate-400 font-sans text-xs uppercase tracking-[0.4em] font-black italic">Passport to the Transparent World</span>
             </p>
           </div>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">OECD 规则库 v2.0 已同步</span>
           </div>
        </div>
      </header>

      {/* 核心引擎区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* 左侧：统一客户分类决策树 */}
         <div className="xl:col-span-8 space-y-10">
            <div className="card-jewelry p-12 bg-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <span className="material-icons-round text-9xl">account_tree</span>
               </div>
               
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">税收居民身份决策树 (Residency Decision Tree)</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logic Core: ACTIVE</span>
               </div>

               {/* 决策流程可视化 */}
               <div className="relative">
                  {/* 连接线 */}
                  <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-slate-100"></div>

                  {/* 步骤 1: 蛛丝马迹索引 */}
                  <div className="relative flex gap-8 mb-12 group">
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 relative z-10 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                        <span className="material-icons-round text-2xl">fingerprint</span>
                     </div>
                     <div className="flex-1 bg-slate-50/50 rounded-2xl p-6 border border-slate-100 hover:border-slate-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">Indicia Search (迹象扫描)</h4>
                           <span className="px-2 py-1 bg-red-50 text-red-500 text-[9px] font-black uppercase rounded">2 Matches Found</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <IndiciaItem label="居住天数 (Days Presence)" value="145 Days (China)" status="WARN" />
                           <IndiciaItem label="经济利益中心 (Center of Vital Interest)" value="Singapore (Family/Asset)" status="SAFE" />
                           <IndiciaItem label="电话/地址 (Contact)" value="+86 & +65 Dual" status="WARN" />
                           <IndiciaItem label="出生地 (Place of Birth)" value="Shanghai, China" status="INFO" />
                        </div>
                     </div>
                  </div>

                  {/* 步骤 2: 加权规则判定 */}
                  <div className="relative flex gap-8 mb-12 group">
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 relative z-10 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                        <span className="material-icons-round text-2xl">gavel</span>
                     </div>
                     <div className="flex-1 bg-slate-50/50 rounded-2xl p-6 border border-slate-100 hover:border-slate-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">Tie-Breaker Rules (加权判定)</h4>
                           <span className="text-[10px] font-mono text-slate-400">Ref: OECD-CRS-Sec.IV</span>
                        </div>
                        <div className="space-y-3">
                           <RuleCheckItem text="183天测试 (Domestic Law): CN Resident (Provisional)" pass={true} />
                           <RuleCheckItem text="双重居民加权 (DTA Article 4): Habitual Abode in SG" pass={true} />
                           <RuleCheckItem text="FATCA US Indicia: Green Card Test (Negative)" pass={false} type="negative" />
                        </div>
                     </div>
                  </div>

                  {/* 步骤 3: 最终状态 */}
                  <div className="relative flex gap-8 group">
                     <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 relative z-10">
                        <span className="material-icons-round text-3xl">verified</span>
                     </div>
                     <div className="flex-1 bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                        <div className="flex justify-between items-center mb-2">
                           <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wide">Final Tax Status (最终判定)</h4>
                           <span className="material-icons-round text-emerald-600">bookmark</span>
                        </div>
                        <p className="text-xl font-black text-emerald-950 tracking-tight">Tax Resident: China (Mainland)</p>
                        <p className="text-xs font-bold text-emerald-700 mt-2 opacity-70">
                           *Non-Dom Status in UK (Potential) | SG Work Pass Holder
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* 智能 XML 生成器 */}
            <div className="card-jewelry p-10 bg-slate-900 text-white flex items-center justify-between">
               <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--nubebe-gold)]">Intelligent XML Reporting</h3>
                  <p className="text-xs text-slate-400 font-medium">
                     自动抽取客户原子事实，生成符合 STA_CRS_v2.0 及 IRS_FATCA_XML_v2.0 标准的加密申报包。
                  </p>
               </div>
               <div className="flex gap-4">
                  <button 
                     onClick={handleGenerateXML}
                     className="px-6 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                  >
                     {generating ? <span className="material-icons-round animate-spin">sync</span> : <span className="material-icons-round">code</span>}
                     {generating ? 'Compiling...' : 'Generate CRS XML'}
                  </button>
                  <button className="px-6 py-4 bg-transparent border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                     FATCA 8966 Preview
                  </button>
               </div>
            </div>
         </div>

         {/* 右侧：动态监管规则库 */}
         <div className="xl:col-span-4 space-y-8">
            <div className="card-jewelry bg-white h-full flex flex-col">
               <div className="p-8 border-b border-slate-50">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">动态监管规则库 (Rulebase)</h3>
                  <div className="flex p-1 bg-slate-100 rounded-xl">
                     <RuleTab label="OECD / CRS" active={activeTab === 'CRS'} onClick={() => setActiveTab('CRS')} />
                     <RuleTab label="US / FATCA" active={activeTab === 'FATCA'} onClick={() => setActiveTab('FATCA')} />
                     <RuleTab label="CN / IIT" active={activeTab === 'IIT'} onClick={() => setActiveTab('IIT')} />
                  </div>
               </div>
               
               <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar max-h-[600px]">
                  {activeTab === 'CRS' && (
                     <>
                       <RuleItem code="CRS-001" title="Due Diligence: Pre-existing Individual" version="v2.0 (2024 Update)" status="ACTIVE" />
                       <RuleItem code="CRS-004" title="Controlling Person: Passive NFE" version="v1.8" status="ACTIVE" />
                       <RuleItem code="CRS-XML" title="UserGuide for XML Schema" version="v3.0" status="PENDING" />
                     </>
                  )}
                  {activeTab === 'FATCA' && (
                     <>
                       <RuleItem code="FATCA-IGA" title="Model 1 IGA: Reciprocal" version="2023 Signed" status="ACTIVE" />
                       <RuleItem code="FORM-8966" title="FATCA Report" version="2024 Rev." status="ACTIVE" />
                       <RuleItem code="W-8BEN" title="Certificate of Foreign Status" version="Rev. 2021" status="ACTIVE" />
                     </>
                  )}
                  {activeTab === 'IIT' && (
                     <>
                       <RuleItem code="STA-公告" title="关于境外所得有关个人所得税政策的公告" version="[2020] 3号" status="ACTIVE" />
                       <RuleItem code="IIT-183" title="无住所个人居住时间判定" version="2019 Rev." status="ACTIVE" />
                     </>
                  )}
                  
                  <div className="p-6 bg-slate-50 rounded-2xl mt-8 border border-slate-100">
                     <div className="flex items-center gap-3 mb-3">
                        <span className="material-icons-round text-emerald-500 text-lg">auto_fix_high</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">规则引擎自动更新</span>
                     </div>
                     <p className="text-[10px] text-slate-500 leading-relaxed">
                        系统已连接至 Nubebe Regulatory Cloud。当监管机构发布新指引时，判定逻辑将自动热更新，无需更改本地代码。
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const IndiciaItem = ({ label, value, status }: { label: string, value: string, status: 'WARN' | 'SAFE' | 'INFO' }) => {
  const color = status === 'WARN' ? 'text-amber-500' : status === 'SAFE' ? 'text-emerald-500' : 'text-blue-500';
  const icon = status === 'WARN' ? 'priority_high' : status === 'SAFE' ? 'check' : 'info';
  
  return (
    <div className="flex flex-col p-3 rounded-xl bg-white border border-slate-100">
       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
       <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 truncate pr-2">{value}</span>
          <span className={`material-icons-round text-sm ${color}`}>{icon}</span>
       </div>
    </div>
  );
};

const RuleCheckItem = ({ text, pass, type = 'standard' }: { text: string, pass: boolean, type?: 'standard' | 'negative' }) => (
  <div className="flex items-center gap-3">
     <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${pass ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 text-transparent'}`}>
        <span className="material-icons-round text-xs">check</span>
     </div>
     <span className={`text-xs font-bold ${type === 'negative' && !pass ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{text}</span>
  </div>
);

const RuleTab = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {label}
  </button>
);

const RuleItem = ({ code, title, version, status }: any) => (
  <div className="flex items-start justify-between group cursor-pointer">
     <div className="flex gap-4">
        <div className="mt-1 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[var(--nubebe-gold)] transition-colors"></div>
        <div>
           <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1">{code}</span>
           <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">{title}</p>
           <span className="text-[10px] font-medium text-slate-400 mt-1 block">{version}</span>
        </div>
     </div>
     <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
        {status}
     </span>
  </div>
);

export default TaxLogicCanvas;
