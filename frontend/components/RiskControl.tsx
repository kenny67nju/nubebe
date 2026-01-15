
import React from 'react';
import { RiskMetrics } from '../types';

const RiskControl: React.FC<{ events: any, riskMetrics: RiskMetrics }> = ({ riskMetrics }) => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-fade-in pb-32">
      <header className="flex items-end justify-between border-b border-slate-100 pb-12">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 rounded-[32px] bg-slate-900 flex items-center justify-center text-red-500 shadow-2xl border border-red-500/20">
              <span className="material-icons-round text-5xl">shield</span>
           </div>
           <div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
               风险敞口监控 <span className="text-slate-400 text-xs font-black border border-slate-200 px-3 py-1 rounded-lg tracking-widest uppercase ml-4">Exposure</span>
             </h1>
             <p className="text-xl font-serif font-black italic text-emerald-900 mt-3 flex items-center gap-3">
               “风雨未至的预判” <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span className="text-slate-400 font-sans text-xs uppercase tracking-[0.4em] font-black italic">Pre-emptive Insight Before the Storm</span>
             </p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <span className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 animate-pulse">实时风控引擎活跃</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 card-jewelry p-12 bg-white flex flex-col items-center justify-center relative overflow-hidden h-[600px]">
           <div className="absolute inset-0 canvas-dot-bg opacity-30"></div>
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-12 relative z-10">实时综合风险指数</h3>
           <div className="relative w-72 h-72 flex items-center justify-center z-10">
              <svg className="w-full h-full -rotate-90">
                <circle cx="144" cy="144" r="130" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                <circle cx="144" cy="144" r="130" fill="none" stroke="#ef4444" strokeWidth="16" strokeDasharray="816" strokeDashoffset={816 - (816 * 75 / 200)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-8xl font-mono font-black text-slate-900 tracking-tighter">75</span>
                 <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-4">HIGH RISK LEVEL</p>
              </div>
           </div>
           <div className="mt-12 text-center relative z-10">
              <p className="text-xs font-bold text-slate-500 max-w-xs leading-relaxed">
                当前风险敞口主要集中于“跨域流转”事实流，涉及大额跨境资金注入，审计存证尚不完整。
              </p>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="card-jewelry p-12 bg-slate-900 text-white space-y-10 min-h-[400px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-8">
                 <h3 className="text-xl font-bold tracking-tight">活跃风险雷达事实记录</h3>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning Fact Streams...</span>
              </div>
              <div className="space-y-6">
                 <RiskFactItem 
                    title="大额跨境调拨事实异常" 
                    desc="事件 ID: evt_xborder_001 涉及 ¥ 7,250,000.00 注入。系统检测到缺乏相对应的完税存证或合规外汇登记事实。" 
                    tag="AML_SUSPICIOUS"
                    severity="high"
                 />
                 <RiskFactItem 
                    title="离岸实体 UBO 声明过期" 
                    desc="实体 ID: ENT_BVI_01 的最终受益人声明已超过 24 个月未进行原子事实更新，涉及 BVI 合规风险。" 
                    tag="GOV_ALERT"
                    severity="mid"
                 />
                 <RiskFactItem 
                    title="地缘居住天数接近临界点" 
                    desc="中国境内累计天数已达 145 天，183 天税务居民判定逻辑已激活，建议启动避风港行程规划。" 
                    tag="TAX_RESIDENCY"
                    severity="low"
                 />
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-8">
              <div className="card-jewelry p-10 bg-white">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">合规审计覆盖率</h4>
                 <div className="flex items-end gap-3">
                    <span className="text-5xl font-mono font-black text-slate-900 tracking-tighter">82%</span>
                    <span className="text-xs font-black text-slate-300 mb-2">TARGET 100%</span>
                 </div>
              </div>
              <div className="card-jewelry p-10 bg-white">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">AML 反洗钱拦截事实</h4>
                 <div className="flex items-end gap-3">
                    <span className="text-5xl font-mono font-black text-slate-900 tracking-tighter">00</span>
                    <span className="text-xs font-black text-emerald-500 mb-2">CLEAN PASS</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const RiskFactItem = ({ title, desc, tag, severity }: any) => {
  const color = severity === 'high' ? 'text-red-500' : severity === 'mid' ? 'text-amber-500' : 'text-blue-500';
  return (
    <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] flex gap-8 items-start hover:bg-white/10 transition-all cursor-pointer group">
       <div className={`mt-1 material-icons-round text-3xl ${color}`}>report_problem</div>
       <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
             <h4 className="text-lg font-black text-white italic group-hover:not-italic transition-all tracking-tight">{title}</h4>
             <span className="px-3 py-1 bg-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-lg">{tag}</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
       </div>
       <span className="material-icons-round text-slate-700 text-xl group-hover:text-white transition-colors">chevron_right</span>
    </div>
  );
};

export default RiskControl;
