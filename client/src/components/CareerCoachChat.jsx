import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2 } from 'lucide-react';
import './CareerCoachChat.css';

const SUGGESTED_QUESTIONS = [
  "How do I improve my resume score to 90+?",
  "What salary should I negotiate for?",
  "Rewrite my professional summary",
  "What skills should I learn next?",
  "Am I ready to apply for senior roles?",
];

export default function CareerCoachChat({ context }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hey! I'm your AI Career Coach. I've read your full resume and analysis — ask me anything! \n\nYou can ask me to rewrite sections, give salary advice, or help you target your next role.` },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || streaming) return;
    setInput('');

    const userEntry = { role: 'user', content: userMsg };
    const history = messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0)
      .map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, userEntry, { role: 'assistant', content: '' }]);
    setStreaming(true);

    try {
      const response = await fetch('/api/resume-analyzer/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: {
            resumeText: context?.resumeText || '',
            jobTitle: context?.jobTitle || '',
            analysis: context?.analysis || {},
            history: [...history, userEntry],
          },
        }),
      });

      if (!response.ok || !response.body) throw new Error('Stream failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const { content } = JSON.parse(data);
            if (content) {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, content: last.content + content };
                }
                return updated;
              });
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: "Sorry, I had trouble connecting. Please try again in a moment." };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            className="coach-fab"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
          >
            <MessageCircle size={22} />
            <span className="coach-fab-label">AI Career Coach</span>
            <span className="coach-fab-dot" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="coach-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="coach-header">
              <div className="coach-avatar"><Bot size={16} /></div>
              <div className="coach-header-info">
                <div className="coach-name">AI Career Coach</div>
                <div className="coach-status"><span className="coach-online" />Online · Knows your resume</div>
              </div>
              <button className="coach-minimize" onClick={() => setOpen(false)}><Minimize2 size={15} /></button>
              <button className="coach-close" onClick={() => setOpen(false)}><X size={15} /></button>
            </div>

            {/* Messages */}
            <div className="coach-messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`coach-msg ${msg.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.role === 'assistant' && <div className="msg-avatar assistant-avatar"><Bot size={12} /></div>}
                  {msg.role === 'user' && <div className="msg-avatar user-avatar"><User size={12} /></div>}
                  <div className="msg-bubble">
                    {msg.content ? (
                      <div className="msg-text" dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/`(.*?)`/g, '<code>$1</code>')
                          .replace(/^• /gm, '&bull; ')
                          .replace(/\n/g, '<br/>')
                      }} />
                    ) : (
                      <div className="msg-typing"><span /><span /><span /></div>
                    )}
                  </div>
                </motion.div>
              ))}
              {/* Suggested questions — show only before first user message */}
              {messages.filter(m => m.role === 'user').length === 0 && (
                <div className="coach-suggestions">
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button key={q} className="suggestion-btn" onClick={() => sendMessage(q)}>{q}</button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="coach-input-wrap">
              <textarea
                ref={inputRef}
                className="coach-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything about your career..."
                rows={1}
                disabled={streaming}
              />
              <button
                className="coach-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || streaming}
              >
                {streaming ? <Loader2 size={16} className="coach-spinner" /> : <Send size={16} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
