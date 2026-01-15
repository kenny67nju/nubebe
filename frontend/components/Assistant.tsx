
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: '您好，我是 Nubebe 首席合规专家。我已经准备好为您审查全球资产事实，并提供严谨的跨司法管辖区合规分析。请注意，我仅提供事实审计与合规咨询，不提供任何资产配置或投资建议。请问有什么可以帮您？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Re-initialize client with the injected API key to ensure it's up to date
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct history in the format required by the SDK for multi-turn conversations
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Use gemini-3-pro-preview for advanced reasoning in compliance and auditing tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...history, { role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: "你是一个名为 Nubebe 的资深全域合规与财务审计助手。你的形象是一位极度专业、冷静且睿智的首席审计官。你象征着绝对的合规、严谨的逻辑以及对财富安全的极致守护。你的语气应当保持私人银行级的专业、客观和简洁。你擅长解析跨国税务、CRS报送逻辑、AML反洗钱风控以及复杂的信托持股架构。注意：你严禁提供任何资产配置建议、投资建议或财富增值方案，仅专注于事实审计与合规分析。请始终使用中文回答，并确保每一条建议都具备专业深度。",
          temperature: 0.7,
        },
      });

      // Extract text output from response property as per current SDK guidelines
      const aiText = response.text || "系统响应异常，请联系技术支持。";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error("Assistant API Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "网络链路异常，请检查您的合规访问权限。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-[100]">
      {isOpen ? (
        <div className="w-[450px] h-[700px] bg-white rounded-[40px] shadow-[0_40px_100px_rgba(15,23,42,0.3)] border border-slate-200 flex flex-col overflow-hidden animate-fade-in ring-1 ring-slate-900/5">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center relative shrink-0">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-600"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10">
                <span className="material-icons-round text-emerald-500 text-3xl">admin_panel_settings</span>
              </div>
              <div>
                <span className="font-black text-[11px] block tracking-[0.3em] uppercase text-slate-400 mb-1">Chief Auditor</span>
                <span className="text-xl font-bold text-white tracking-tight">Nubebe Logic AI</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white/10 transition-colors relative z-10">
              <span className="material-icons-round text-2xl text-slate-400 hover:text-white">close</span>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-6 rounded-3xl text-[15px] leading-relaxed font-medium ${
                  msg.role === 'user' 
                    ? 'bg-slate-100 text-slate-900 rounded-tr-none' 
                    : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 rounded-tl-none flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0">
            <div className="flex gap-3 bg-white p-2.5 rounded-3xl border border-slate-200 focus-within:ring-8 focus-within:ring-slate-900/5 transition-all shadow-sm">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="咨询合规分析或税务评估..."
                className="flex-1 bg-transparent border-none px-5 py-3 text-base font-semibold focus:outline-none placeholder:text-slate-300 text-slate-700"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-black active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-icons-round text-2xl">security</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
               <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">
                 NUBEBE ENCRYPTED AUDIT CHANNEL
               </p>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-[0_30px_70px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300 group relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <span className="material-icons-round text-4xl group-hover:scale-110 transition-transform">support_agent</span>
          <div className="absolute -top-1 -right-1 flex h-6 w-6">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-4 border-slate-900"></span>
          </div>
        </button>
      )}
    </div>
  );
};

export default Assistant;
