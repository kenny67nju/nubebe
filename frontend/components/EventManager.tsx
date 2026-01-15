
import React, { useState } from 'react';
import { mockEvents, mockBioEvents, mockGovEvents } from '../mockData';
import StayTracker from './StayTracker';
import TransactionFactStream from './TransactionFactStream';
import { GovernanceEventType } from '../types';

type StreamType = 'TRANSACTION' | 'BIO_IDENTITY' | 'GOVERNANCE';

const EventManager: React.FC = () => {
  const [activeStream, setActiveStream] = useState<StreamType>('TRANSACTION');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="h-full flex flex-col space-y-12 animate-fade-in pb-20">
      <header className="flex flex-col gap-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-12">
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-[32px] bg-slate-900 flex items-center justify-center text-white shadow-2xl">
                 <span className="material-icons-round text-5xl">fact_check</span>
              </div>
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">全域事件中枢 <span className="text-slate-400 text-xs font-black border border-slate-200 px-3 py-1 rounded-lg tracking-widest uppercase ml-4">Event Hub</span></h1>
                <p className="text-xl font-serif font-black italic text-emerald-900 mt-3 flex items-center gap-3">
                  “铭刻家族的里程碑” <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span className="text-slate-400 font-sans text-xs uppercase tracking-[0.4em] font-black italic">The Chronicle of Family Milestones</span>
                </p>
              </div>
           </div>
           
           <div className="flex bg-slate-100 p-1.5 rounded-[24px] border border-slate-200 shadow-inner">
              <button 
                onClick={() => setActiveStream('TRANSACTION')} 
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeStream === 'TRANSACTION' ? 'bg-white text-emerald-950 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="material-icons-round text-lg">payments</span> 交易事实流
              </button>
              <button 
                onClick={() => setActiveStream('BIO_IDENTITY')} 
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeStream === 'BIO_IDENTITY' ? 'bg-white text-blue-950 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="material-icons-round text-lg">radar</span> 身份法律流
              </button>
              <button 
                onClick={() => setActiveStream('GOVERNANCE')} 
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeStream === 'GOVERNANCE' ? 'bg-white text-indigo-950 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="material-icons-round text-lg">account_balance</span> 实体治理流
              </button>
           </div>
        </div>

        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="relative group flex-1 max-w-xl">
              <span className="material-icons-round absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-xl group-focus-within:text-slate-900 transition-colors">search</span>
              <input 
                type="text" 
                placeholder="搜索全域原子事实..."
                className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">录入原子事实</button>
        </div>
      </header>

      <div className="flex-1">
         {activeStream === 'BIO_IDENTITY' && <StayTracker bioEvents={mockBioEvents} />}
         {activeStream === 'TRANSACTION' && <TransactionFactStream events={mockEvents} />}
         {activeStream === 'GOVERNANCE' && <GovernanceFactStream govEvents={mockGovEvents} />}
      </div>
    </div>
  );
};

const GovernanceFactStream: React.FC<{ govEvents: any[] }> = ({ govEvents }) => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div className="flex items-center gap-4 px-2">
       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">公司法实体事实映射</span>
       <div className="h-px flex-1 bg-slate-100"></div>
    </div>
    <div className="grid grid-cols-1 gap-6">
       {govEvents.map((event) => (
         <div key={event.event_id} className="card-jewelry p-10 bg-white hover:border-indigo-500/30 transition-all group">
            <div className="flex items-start justify-between">
               <div className="flex gap-8">
                  <div className="w-20 h-20 rounded-[28px] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                     <span className="material-icons-round text-4xl">history_edu</span>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center gap-4">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{translateGovType(event.event_type)}</h4>
                        <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-400 rounded-lg uppercase tracking-tighter">Verified SSoT</span>
                     </div>
                     <p className="text-sm font-bold text-slate-500 italic">实体主体: {event.entity_name} ({event.entity_id})</p>
                     <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                           <span className="material-icons-round text-slate-300 text-sm">event</span>
                           <span className="text-xs font-bold text-slate-400">{event.resolution_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="material-icons-round text-slate-300 text-sm">person</span>
                           <span className="text-xs font-bold text-slate-400">签署人: {event.signatory}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="material-icons-round text-slate-300 text-sm">gavel</span>
                           <span className="text-xs font-bold text-slate-400">管辖法: {event.governing_law}</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <button className="px-6 py-3 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                     查看分辨率存证
                  </button>
                  <p className="text-[10px] font-mono text-slate-200 mt-4">REF_ID: {event.event_id}</p>
               </div>
            </div>
         </div>
       ))}
    </div>
  </div>
);

const translateGovType = (type: GovernanceEventType) => {
  const map: Record<string, string> = {
    INCORPORATION: '实体设立核准',
    DISSOLUTION: '实体注销决议',
    BOARD_RESOLUTION: '董事会重大决议',
    SHARE_TRANSFER: '股权转让事实',
    CAPITAL_INCREASE: '资本金注入/增资',
    TRUST_SETTLEMENT: '信托设立资产注入',
    DIRECTOR_APPOINTMENT: '董事委任事实'
  };
  return map[type] || type;
};

export default EventManager;
