import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { useSport } from '../context/SportContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AiAssistantProps {
  onClose: () => void;
}

const MAX_MESSAGE_LENGTH = 1000;

export const AiAssistant: React.FC<AiAssistantProps> = ({ onClose }) => {
  const { user, courts, matches, tournaments } = useSport();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Chào ${user.name}! Tôi là SportRes AI. Bạn có thể hỏi tôi về đặt sân, ghép kèo, giải đấu, ví/thanh toán hoặc cách dùng SportRes.`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'Gợi ý sân phù hợp hôm nay',
    'Tìm kèo đang tuyển người',
    'Cách chủ sân quản lý lịch sân?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText: string) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || loading) return;
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setMessages(prev => [
        ...prev,
        { role: 'model', text: 'Tin nhắn quá dài. Vui lòng nhập tối đa 1000 ký tự.' },
      ]);
      return;
    }

    const updatedMessages = [...messages, { role: 'user' as const, text: trimmedMessage }];
    setMessages(updatedMessages);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedMessage,
          history: updatedMessages.slice(0, -1).slice(-8).map(message => ({
            role: message.role,
            text: message.text,
          })),
          appContext: {
            user,
            courts,
            matches,
            tournaments,
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Không thể kết nối đến máy chủ AI SportRes.');
      }
      setMessages(prev => [
        ...prev,
        { role: 'model', text: data.reply || 'Xin lỗi, tôi chưa thể trả lời lúc này.' },
      ]);
    } catch (error: any) {
      setMessages(prev => [
        ...prev,
        { role: 'model', text: error.message || 'Không thể kết nối đến máy chủ AI SportRes.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageText = (text: string) =>
    text.split('\n').map((line, index) => (
      <p key={index} className="leading-relaxed mb-1 whitespace-pre-wrap">
        {line}
      </p>
    ));

  return (
    <div id="ai-assistant-drawer" className="absolute inset-0 bg-neutral-900 text-neutral-100 flex flex-col z-50 animate-fadeIn">
      <div className="bg-neutral-950 border-b border-neutral-800 p-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 text-emerald-400">
            <Sparkles size={16} />
          </div>
          <div className="text-left">
            <h3 className="text-xs font-black text-white leading-tight">SportRes AI Guide</h3>
            <p className="text-[8.5px] text-neutral-400 font-medium">Trợ lý thể thao cá nhân</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          id="close-ai-assistant"
          className="text-neutral-400 hover:text-white font-extrabold px-3 py-2 cursor-pointer text-xs rounded-lg hover:bg-neutral-900"
        >
          Đóng
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-left text-xs bg-gradient-to-b from-neutral-900 to-neutral-950 scrollbar-none">
        {messages.map((message, index) => {
          const isBot = message.role === 'model';
          return (
            <div key={index} className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end animate-fadeIn'}`}>
              {isBot && (
                <div className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 text-emerald-400">
                  <Bot size={13} />
                </div>
              )}
              <div
                className={`max-w-[78%] p-3 rounded-2xl leading-normal text-[11px] shadow-sm ${
                  isBot
                    ? 'bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-tl-sm'
                    : 'bg-emerald-600 text-white rounded-tr-sm font-semibold'
                }`}
              >
                {renderMessageText(message.text)}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 text-emerald-400">
              <Bot size={13} />
            </div>
            <div className="bg-neutral-800 text-neutral-400 p-2.5 px-4 rounded-2xl rounded-tl-sm border border-neutral-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!loading && messages.length < 4 && (
        <div className="px-3 py-1.5 bg-neutral-950 border-t border-neutral-900 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
          {suggestionChips.map(chip => (
            <button
              key={chip}
              type="button"
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 hover:text-white text-neutral-400 border border-neutral-800/80 rounded-full text-[9px] font-bold transition shrink-0 cursor-pointer text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 bg-neutral-950 border-t border-neutral-900 flex gap-2 items-center shrink-0">
        <input
          type="text"
          value={query}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') void handleSend(query);
          }}
          placeholder="Hỏi trợ lý AI..."
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-emerald-500 placeholder-neutral-500"
        />
        <button
          type="button"
          onClick={() => handleSend(query)}
          disabled={!query.trim() || loading}
          className={`w-10 h-10 rounded-xl border transition cursor-pointer flex items-center justify-center shrink-0 ${
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
