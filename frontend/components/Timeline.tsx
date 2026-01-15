
import React from 'react';
import { UnifiedEvent } from '../types';

const Timeline: React.FC<{ events: UnifiedEvent[], onSelectEvent: (id: string) => void }> = ({ events, onSelectEvent }) => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-fade-in pb-32">
      <header className="flex items-end justify-between border-b border-slate-100 pb-12">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 rounded-[32px] bg-slate-900 flex items-center justify-center text-white shadow-2xl">
              <span className="material-icons-round text-5xl">swap_horiz</span>
           </div>
           <div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter">财务交易流水 <span className="text-slate-400 text-xs font-black border border-slate-200 px-3 py-1 rounded-lg tracking-widest uppercase ml-4">Audit Flow</span></h1>
             <p className="text-xl font-serif font-black italic text-emerald-900 mt-3 flex items-center gap-3">
               “感知财富的脉搏” <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span className="text-slate-400 font-sans text-xs uppercase tracking-[0.4em] font-black italic">The Pulse of Wealth</span>
             </p>
           </div>
        </div>
      </header>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden relative">
        <div className="absolute left-[44px] top-0 bottom-0 w-[2px] bg-slate-50"></div>
        <div className="divide-y divide-slate-50">
          {events.map((event) => (
            <div key={event.event_id} onClick={() => onSelectEvent(event.event_id)} className="relative pl-24 pr-12 py-10 hover:bg-slate-50 transition-all group cursor-pointer">
              <div className={`absolute left-[34px] top-[40px] w-6 h-6 rounded-full border-4 border-white shadow-xl z-10 flex items-center justify-center ${event.net_amount > 0 ? 'bg-emerald-500' : 'bg-slate-900'}`}></div>
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-slate-900">{event.event_type}</span>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">ID: {event.event_id}</span>
                  </div>
                  <p className="text-slate-500 text-base font-medium max-w-2xl italic">“精准捕捉每一笔价值的微震。”</p>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                  <div className={`text-3xl font-mono font-black ${event.net_amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {event.net_amount > 0 ? '+' : ''} {event.net_amount.toLocaleString()} <span className="text-sm font-bold opacity-30">{event.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
