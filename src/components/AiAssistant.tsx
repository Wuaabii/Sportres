import React, { useState, useRef, useEffect } from 'react';
import { useSport } from '../context/SportContext';
import { Sparkles, Send, Bot, MessageSquare, Flame } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AiAssistantProps {
  onClose: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ onClose }) => {
  const { user, courts, matches, tournaments } = useSport();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Chào **${user.name}**! Tôi là **SportRes AI** - trợ lý đề xuất sân bãi và kết nối ghép cặp của bạn. 🚀\n\nTôi biết bạn có đam mê cực lớn với bộ môn **${user.favoriteSports.map(s => s === 'badminton' ? 'Cầu lông' : 'Bóng đá').join(' & ')}** và sở hữu trình độ **${user.skillLevels['badminton']}**.\n\nHôm nay bạn muốn chơi môn gì? Tôi có thể đề xuất sân trống đẹp nhất hoặc tìm đối cứng ghép kèo phù hợp ngay lập tức cho bạn!`
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'Gợi ý sân cầu lông tốt nhất Quận 10',
    'Tìm kèo đá bóng chuẩn trình của tôi tối nay',
    'Làm thế nào để tìm người chơi cùng trình độ?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    // Add user message
    const updatedMessages = [...messages, { role: 'user' as const, text: messageText }];
    setMessages(updatedMessages);
    setQuery('');
    setLoading(true);

    try {
      // Package full local context to pass along containing latest state
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          history: updatedMessages.slice(0, -1).map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          appContext: {
            user,
            courts,
            matches,
            tournaments,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối đến máy chủ API SportRes.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model' as const, text: data.text }]);
    } catch (error: any) {
      console.error('AI chat failed:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'model' as const,
          text: `Rất tiếc, máy chủ AI hỗ trợ đặt sân đang bận đột xuất! Tuy nhiên, tôi vẫn khuyên bạn tham khảo cơ sở **${courts[0]?.name || 'Sân bóng Kỳ Hòa'}** cực hot hôm nay hoặc đăng ký giải đấu **"${tournaments[0]?.title}"** đang diễn ra sôi nổi!`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Turn simple markdown-like syntax into beautiful HTML safely
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, blockIdx) => {
      // Star replacements for bold
      let formatted = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        formatted = formatted.replace(match[0], `<strong class="font-black text-white">${match[1]}</strong>`);
      }

      return (
        <p
          key={blockIdx}
          className="leading-relaxed mb-1"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div id="ai-assistant-drawer" className="absolute inset-0 bg-neutral-900 text-neutral-100 flex flex-col z-50 animate-fadeIn">
      {/* Drawer Header */}
      <div className="bg-neutral-950 border-b border-neutral-800 p-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 text-emerald-400">
            <Sparkles size={16} />
          </div>
          <div className="text-left">
            <h3 className="text-xs font-black text-white leading-tight">SportRes AI Guide</h3>
            <p className="text-[8.5px] text-neutral-400 font-medium">Trợ lý thể thao cá nhân thông minh</p>
          </div>
        </div>
        <button
          onClick={onClose}
          id="close-ai-assistant"
          className="text-neutral-400 hover:text-white font-extrabold pr-2 cursor-pointer text-xs"
        >
          ✕ Đóng
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3/5 text-left text-xs bg-gradient-to-b from-neutral-900 to-neutral-950 scrollbar-none">
        
        {messages.map((m, idx) => {
          const isBot = m.role === 'model';
          return (
            <div
              key={idx}
              className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end animate-fadeIn'}`}
            >
              {isBot && (
                <div className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 text-emerald-400">
                  <Bot size={13} />
                </div>
              )}

              <div
                className={`max-w-[78%] p-3 rounded-2xl leading-normal text-[11px] shadow-sm ${
                  isBot
                    ? 'bg-neutral-800 text-neutral-200 border border-neutral-710 rounded-tl-sm'
                    : 'bg-emerald-600 text-white rounded-tr-sm font-semibold'
                }`}
              >
                {formatMessageText(m.text)}
              </div>
            </div>
          );
        })}

        {/* Dynamic Typing/Thinking loader */}
        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-750 flex items-center justify-center shrink-0 text-emerald-400">
              <Bot size={13} />
            </div>
            <div className="bg-neutral-800 text-neutral-400 p-2.5 px-4 rounded-2xl rounded-tl-sm border border-neutral-750 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions chips section listed at bottom prior to typing */}
      {!loading && messages.length < 4 && (
        <div className="px-3 py-1.5 bg-neutral-950 border-t border-neutral-900 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-400 border border-neutral-800/80 rounded-full text-[9px] font-bold transition shrink-0 cursor-pointer text-left"
            >
              🚀 {chip}
            </button>
          ))}
        </div>
      )}

      {/* Drawer Input controls */}
      <div className="p-3 bg-neutral-950 border-t border-neutral-900 flex gap-2 items-center shrink-0">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend(query);
          }}
          placeholder="Hỏi trợ lý AI..."
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-emerald-500 placeholder-neutral-500"
        />
        <button
          onClick={() => handleSend(query)}
          disabled={!query.trim() || loading}
          className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center shrink-0 ${
            query.trim() && !loading
              ? 'bg-emerald-500 hover:bg-emerald-400 border-emerald-500 text-neutral-950 shadow-md'
              : 'bg-neutral-900 border-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <Send size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
