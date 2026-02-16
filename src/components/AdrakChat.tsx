'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Loader2, Sparkles, Bot } from 'lucide-react';
import api from '@/lib/api';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export default function AdrakChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            text: "Hi! I'm Adrak, an AI for Dhaniyaa. How can I help you with your project today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Convert history to format expected by backend
            const history = messages
                .filter(m => m.id !== 'welcome')
                .map(m => ({ role: m.role, parts: m.text }));

            const res = await api.post('/api/ai/chat', {
                message: userMessage.text,
                history
            });

            if (res.data.success) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    text: res.data.data.response
                };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error('Failed to chat with Adrak:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "I'm having trouble connecting right now. Please try again later."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-xl shadow-xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
                    {/* Header - Minimalist Brand Color */}
                    <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center justify-between shadow-sm shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-tight leading-none">Adrak AI</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                                    <p className="text-[10px] font-medium opacity-80">Online</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30 relative" ref={scrollRef}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {msg.role === 'model' && (
                                        <span className="text-[10px] font-bold text-muted-foreground mb-1 ml-1 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-primary" /> Adrak
                                        </span>
                                    )}
                                    <div
                                        className={`
                                            px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                                            ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                : 'bg-white border border-border text-foreground rounded-bl-sm shadow-sm'}
                                        `}
                                    >
                                        <div className="whitespace-pre-wrap font-medium">
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-border px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                    <span className="text-xs font-medium text-muted-foreground">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-border shrink-0">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="relative flex items-center"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-secondary text-foreground text-sm font-medium rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                            />
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="absolute right-2 p-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95
                    ${isOpen ? 'bg-secondary text-foreground rotate-90 border border-border' : 'bg-primary text-primary-foreground hover:shadow-primary/25'}
                `}
            >
                {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
            </button>
        </div>
    );
}
