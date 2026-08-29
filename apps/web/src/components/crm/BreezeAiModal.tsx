import { useState } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';

interface BreezeAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSummary?: string;
  selectedContactName?: string;
}

export function BreezeAiModal({
  isOpen,
  onClose,
  initialSummary,
  selectedContactName,
}: BreezeAiModalProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: initialSummary
        ? `Here is the AI summary for ${selectedContactName}:\n\n${initialSummary}`
        : 'Hello! I am Breeze AI Assistant. I can summarize contacts, draft sales outreach emails, and analyze lead engagement scores. How can I assist you?',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg },
      {
        sender: 'ai',
        text: `Breeze Assistant response for "${userMsg}":\nAnalyzed CRM database records. All contact properties and lifecycle stages have been updated according to your request.`,
      },
    ]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 10,
          width: '100%',
          maxWidth: 580,
          height: 480,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: '#00a4bd' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Breeze AI Assistant</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Log */}
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: 8,
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}
            >
              {m.sender === 'ai' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#00a4bd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={15} />
                </div>
              )}
              <div
                style={{
                  background: m.sender === 'user' ? '#00a4bd' : '#ffffff',
                  color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 8,
                  border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  fontSize: 13,
                  whiteSpace: 'pre-line',
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '0.75rem 1rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Ask Breeze AI to summarize or write email draft..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0.45rem 0.75rem', fontSize: 13 }}
          />
          <button type="button" className="oneness-btn-teal" onClick={handleSend}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
