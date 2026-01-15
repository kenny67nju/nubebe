
import React, { useState, useMemo } from 'react';
import { UnifiedEvent, EventType, AssetClass } from '../types';

interface TransactionFactStreamProps {
  events: UnifiedEvent[];
}

type SortKey = 'posting_date' | 'net_amount' | 'asset_class';
type SortDirection = 'asc' | 'desc';

const TransactionFactStream: React.FC<TransactionFactStreamProps> = ({ events }) => {
  const [filter, setFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const filteredEvents = useMemo(() => 
    events.filter(e => filter === 'ALL' || e.asset_class === filter),
  [events, filter]);

  const sortedEvents = useMemo(() => {
    if (!sortConfig) return filteredEvents;
    
    return [...filteredEvents].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEvents, sortConfig]);

  const handleSort = (key: SortKey) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderSortIcon = (key: SortKey) => {
    const isActive = sortConfig?.key === key;
    return (
      <span className={`material-icons-round text-sm ml-2 transition-all ${isActive ? 'text-emerald-600 opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`}>
        {isActive ? (sortConfig?.direction === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'sort'}
      </span>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* 事实流状态控制栏 */}
      <div className="flex items-center justify-between mb-4">
         <div className="flex items-center gap-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">原子事实公式</h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase">
               <span>时间</span>
               <span className="text-slate-300 mx-1">+</span>
               <span>主体</span>
               <span className="text-slate-300 mx-1">+</span>
               <span>行为</span>
               <span className="text-slate-300 mx-1">+</span>
               <span>对象</span>
               <span className="text-slate-300 mx-1">+</span>
               <span>金额</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border border-emerald-100">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               SSoT 全域事实监听中
            </div>
         </div>
      </div>

      <div className="card-jewelry bg-white shadow-2xl overflow-hidden border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th 
                  className="px-10 py-8 w-48 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                  onClick={() => handleSort('posting_date')}
                >
                  <div className="flex items-center">
                    原子时间 (Time)
                    {renderSortIcon('posting_date')}
                  </div>
                </th>
                <th className="px-10 py-8">审计主体 (Subject)</th>
                <th className="px-10 py-8">事实行为 (Action)</th>
                <th 
                  className="px-10 py-8 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                  onClick={() => handleSort('asset_class')}
                >
                  <div className="flex items-center">
                    价值对象 (Object)
                    {renderSortIcon('asset_class')}
                  </div>
                </th>
                <th 
                  className="px-10 py-8 text-right cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                  onClick={() => handleSort('net_amount')}
                >
                  <div className="flex items-center justify-end">
                    确证金额 (Amount)
                    {renderSortIcon('net_amount')}
                  </div>
                </th>
                <th className="px-10 py-8 text-center">存证</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedEvents.map((event) => (
                <tr key={event.event_id} className="hover:bg-slate-50/50 transition-all group">
                  {/* 时间 */}
                  <td className="px-10 py-10">
                    <div className="flex flex-col">
                      <span className="text-sm font-mono font-black text-slate-900 tracking-tighter">
                        {event.posting_date}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">
                        {event.transaction_time.split(' ')[1]}
                      </span>
                    </div>
                  </td>

                  {/* 主体 (脱敏处理) */}
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                        <span className="material-icons-round text-lg">account_circle</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">Mr. Alpha</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {event.institution_name} / {event.account_id.slice(0, 4)}***
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 行为 */}
                  <td className="px-10 py-10">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getActionStyle(event.event_type)}`}>
                      {translateAction(event.event_type)}
                    </span>
                  </td>

                  {/* 对象 */}
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-3">
                      <span className="material-icons-round text-slate-300 text-xl">{getAssetIcon(event.asset_class)}</span>
                      <span className="text-sm font-bold text-slate-700 italic">{event.asset_name}</span>
                    </div>
                  </td>

                  {/* 金额 */}
                  <td className="px-10 py-10 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-lg font-mono font-black tracking-tighter ${event.net_amount >= 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {event.net_amount >= 0 ? '+' : ''}{event.net_amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase mt-1">
                        {event.currency} / 净额
                      </span>
                    </div>
                  </td>

                  {/* 存证标记 */}
                  <td className="px-10 py-10 text-center">
                    <div className="flex items-center justify-center group/cert cursor-pointer">
                      <span className="material-icons-round text-emerald-500 text-2xl group-hover/cert:scale-110 transition-transform">verified</span>
                      <div className="hidden group-hover/cert:block absolute mb-20 p-3 bg-slate-900 text-white text-[9px] font-bold uppercase rounded-lg shadow-2xl z-20">
                        原子事实 ID: {event.event_id}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between p-10 bg-emerald-950 rounded-[32px] text-white overflow-hidden relative group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
         <div className="relative z-10 flex items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
               <span className="material-icons-round text-3xl text-[var(--nubebe-gold)]">history_edu</span>
            </div>
            <div>
               <h4 className="text-lg font-bold tracking-tight mb-1">本季全域财务事实已归集完毕</h4>
               <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">所有的资产变动均已映射至原子事实流，符合 SSoT 单一事实来源准则。</p>
            </div>
         </div>
         <button className="relative z-10 px-8 py-4 bg-[var(--nubebe-gold)] text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
            导出季度原子对账单
         </button>
      </div>
    </div>
  );
};

const translateAction = (type: EventType) => {
  const map: Record<string, string> = {
    TRADE_SELL: '资产减持',
    TRADE_BUY: '资产增持',
    BANK_WITHDRAWAL: '资金调出',
    TRANSFER_IN: '外部注入',
    TRANSFER_OUT: '跨境流转',
    TRUST_DISTRIBUTION: '权益分红',
    INCOME: '经营所得',
    ASSET_ACQUISITION: '实物入库',
    ASSET_DISPOSAL: '资产处置',
    QUICK_PAYMENT: '即时支付',
    CRYPTO_BUY: '加密增持',
    CRYPTO_SELL: '加密减持',
    DONATION: '慈善捐赠',
    DIVIDEND: '股息红利'
  };
  return map[type] || type;
};

const getActionStyle = (type: EventType) => {
  if (type.includes('SELL') || type.includes('WITHDRAWAL') || type.includes('OUT') || type.includes('DISPOSAL') || type.includes('DONATION')) {
    return 'bg-slate-50 text-slate-600 border-slate-200';
  }
  return 'bg-emerald-50 text-emerald-700 border-emerald-100';
};

const getAssetIcon = (cls: AssetClass) => {
  switch (cls) {
    case AssetClass.CASH: return 'payments';
    case AssetClass.SECURITY: return 'show_chart';
    case AssetClass.TRUST: return 'account_balance';
    case AssetClass.CRYPTO: return 'currency_bitcoin';
    case AssetClass.REAL_ESTATE: return 'apartment';
    case AssetClass.GOLD: return 'grid_goldenratio';
    case AssetClass.ART: return 'palette';
    case AssetClass.INSURANCE: return 'verified_user';
    default: return 'layers';
  }
};

export default TransactionFactStream;
