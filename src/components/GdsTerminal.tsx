import React, { useState, useRef, useEffect } from 'react';
import { TerminalLine } from '../types';
import { GDSEngine } from '../services/gdsEngine';
import { Terminal as TerminalIcon, Send } from 'lucide-react';

const engine = new GDSEngine();

export const GdsTerminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'AMADEUS SELLING PLATFORM CONNECT - VERSION 21.1', type: 'response', timestamp: Date.now() },
    { text: 'تم تسجيل الدخول بنجاح - المكتب: CAI1A0987', type: 'response', timestamp: Date.now() },
    { text: 'اكتب HELP لعرض الأوامر المتاحة', type: 'response', timestamp: Date.now() },
    { text: ' ', type: 'response', timestamp: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.toUpperCase();
    const newLines: TerminalLine[] = [
      ...lines,
      { text: `> ${cmd}`, type: 'command', timestamp: Date.now() }
    ];

    const response = engine.processCommand(cmd);
    newLines.push({ text: response, type: 'response', timestamp: Date.now() });

    setLines(newLines);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#001b3a] rounded-lg border-2 border-gray-400 shadow-2xl overflow-hidden font-mono">
      <div className="bg-[#002855] px-4 py-2 border-b border-blue-900 flex items-center justify-between text-cyan-400">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">Command Page 1/1</span>
        </div>
        <div className="text-[10px] font-bold">READY / LINE 01</div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-blue-900 bg-[#001b3a] text-white"
      >
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={`whitespace-pre-wrap leading-tight text-lg tracking-wider ${
              line.type === 'command' ? 'text-cyan-400 font-semibold' : 'text-white'
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>

      <div className="p-2 bg-[#002044] border-t border-blue-900 flex gap-2 overflow-x-auto overflow-y-hidden no-scrollbar">
        {['AN', 'SS', 'NM1', 'AP', 'TK', 'RT', 'IG', 'ER', 'FXP', 'FQD', '*', '¤'].map(symbol => (
          <button 
            key={symbol}
            onClick={() => setInput(prev => prev + (prev.endsWith(' ') ? '' : ' ') + symbol)}
            className="px-3 py-1 bg-blue-900 hover:bg-blue-800 rounded text-[10px] font-bold text-cyan-300 transition-colors shrink-0 border border-blue-800 shadow-inner"
          >
            {symbol}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 bg-[#001b3a] flex gap-2 border-t border-blue-900">
        <span className="text-cyan-400 font-bold">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER ENTRY..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-blue-900/50 text-xl uppercase tracking-widest"
          autoFocus
          id="terminal-input"
          autoComplete="off"
        />
        <button 
          type="submit"
          className="p-1 hover:bg-blue-900 rounded transition-colors text-cyan-400"
          id="terminal-submit"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
