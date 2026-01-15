
import React, { useMemo, useState, useEffect } from 'react';
import { BioIdentityEvent, BioEventType } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

interface StayTrackerProps {
  bioEvents: BioIdentityEvent[];
}

const StayTracker: React.FC<StayTrackerProps> = ({ bioEvents }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // 模拟动态同步逻辑
  const handleMagicSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsSyncing(false), 800);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  const stayStats = useMemo(() => {
    // 模拟天数：假设为 145 天，处于“警示金”区间
    const loggedDays = 145;
    const threshold = 183;
    const remainingDays = Math.max(0, threshold - loggedDays);
    
    // 获取最新位置状态
    const sortedEvents = [...bioEvents].sort((a, b) => new Date(b.occurrence_date).getTime() - new Date(a.occurrence_date).getTime());
    const latestEvent = sortedEvents[0];
    const isInside = latestEvent?.event_type === BioEventType.IMMIGRATION_ENTRY;

    // 颜色计算逻辑：<120 翡翠绿, 120-150 警示金, >150 深金/红
    let statusColor = 'var(--nubebe-emerald-500)';
    if (loggedDays >= 120 && loggedDays < 155) statusColor = 'var(--nubebe-gold)';
    else if (loggedDays >= 155) statusColor = '#F43F5E';

    return { loggedDays, threshold, remainingDays, isInside, latestEvent, statusColor };
  }, [bioEvents]);

  const chartData = [
    { name: 'Logged', value: stayStats.loggedDays },
    { name: 'Remaining', value: stayStats.remainingDays }
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 边境雷达无感同步状态栏 */}
      <div className="card-jewelry p-6 bg-slate-900 text-white flex items-center justify-between overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none"></div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
               <span className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`}></span>
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">地理围栏同步中</span>
            </div>
            <div className="flex items-center gap-3">
               <span className="material-icons-round text-slate-500 text-xl">gps_fixed</span>
               <span className="text-[11px] font-bold text-slate-300">GPS & e-Visa 事实流已接通</span>
            </div>
         </div>
         
         <button 
           onClick={handleMagicSync}
           disabled={isSyncing}
           className="relative group px-8 py-3 bg-gradient-to-tr from-[var(--nubebe-gold)] to-yellow-600 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
         >
            <span className="material-icons-round text-xl">{isSyncing ? 'sync' : 'auto_awesome'}</span>
            <span className="text-xs font-black uppercase tracking-widest">
              {isSyncing ? `捕获中 ${syncProgress}%` : 'Magic Sync'}
            </span>
            <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* 左侧：合规安全仪表盘 */}
        <div className="xl:col-span-5 space-y-10">
           <div className="card-jewelry p-12 bg-white flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <span className="material-icons-round text-9xl">radar</span>
              </div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12">2024 年度境内累计 (Days)</h3>
              
              <div className="w-full h-80 relative flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                         data={chartData} 
                         innerRadius={90} 
                         outerRadius={125} 
                         startAngle={90} 
                         endAngle={450} 
                         dataKey="value"
                         stroke="none"
                       >
                          <Cell fill={stayStats.statusColor} />
                          <Cell fill="#f1f5f9" />
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-mono font-black text-slate-900 tracking-tighter" style={{ color: stayStats.statusColor }}>
                      {stayStats.loggedDays}
                    </span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-2">/ 183 Days</span>
                 </div>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8 w-full border-t border-slate-50 pt-10">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">当前位置</p>
                    <div className="flex items-center justify-center gap-2">
                       <span className="material-icons-round text-emerald-500 text-sm">location_on</span>
                       <span className="text-sm font-black text-slate-900">中国境内</span>
                    </div>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">安全余量</p>
                    <p className="text-sm font-black text-emerald-600 uppercase tracking-tighter">{stayStats.remainingDays} Days Left</p>
                 </div>
              </div>
           </div>

           <div className="card-jewelry p-10 bg-[var(--nubebe-emerald-900)] text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                 <span className="material-icons-round text-[10rem]">verified_user</span>
              </div>
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6">Smart Guard 预警</h4>
                 <p className="text-xl font-bold leading-relaxed mb-8">
                   您的居留事实处于<span className="text-[var(--nubebe-gold)]">“预判金”</span>区间。Nubebe 建议您在未来 45 天内安排至少 12 天的离境行程，以维持非居民纳税身份。
                 </p>
                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                   模拟后续行程对税务的影响
                 </button>
              </div>
           </div>
        </div>

        {/* 右侧：原子事实审计流 */}
        <div className="xl:col-span-7 flex flex-col">
           <div className="card-jewelry p-10 bg-white flex-1 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                 <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">身份事实时间轴</h3>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Audit Facts Registry</p>
                 </div>
                 <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
                    <span className="material-icons-round text-base">filter_list</span> 筛选
                 </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[500px]">
                 {bioEvents.map((event) => (
                   <div key={event.event_id} className="group flex items-center gap-6 p-6 rounded-3xl border border-slate-50 hover:border-slate-200 transition-all hover:shadow-sm bg-[#fafafa]/50">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                        event.event_type === BioEventType.IMMIGRATION_ENTRY ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                         <span className="material-icons-round">
                           {event.event_type === BioEventType.IMMIGRATION_ENTRY ? 'flight_land' : 'flight_takeoff'}
                         </span>
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{translateBioType(event.event_type)}</span>
                            <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase tracking-tighter">Verified</span>
                         </div>
                         <p className="text-xs text-slate-400 font-medium">{event.jurisdiction} • {event.occurrence_date}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">事实存证 ID</p>
                         <p className="text-xs font-mono font-bold text-slate-900">{event.event_id}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50">
                 <button className="w-full py-5 bg-slate-900 text-white rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 group">
                    <span className="material-icons-round text-xl group-hover:rotate-12 transition-transform">article</span>
                    生成税务居留一键审计包 (Proof-on-Demand)
                 </button>
                 <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-4 tracking-widest">符合 OECD CRS 与 各主要司法管辖区税局审计标准</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const translateBioType = (type: BioEventType) => {
  const map: Record<string, string> = {
    IMMIGRATION_ENTRY: '入境事实捕获',
    IMMIGRATION_EXIT: '离境事实捕获',
    TAX_RESIDENCY_CHANGE: '税务居民身份切换',
    NATIONALITY_CHANGE: '法定国籍状态更新'
  };
  return map[type] || type;
};

export default StayTracker;
