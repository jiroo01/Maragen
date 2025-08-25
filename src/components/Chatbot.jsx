import React, { useState, useEffect, useRef, useCallback } from 'react';

const N8N_CHAT_WEBHOOK = 'https://auto.apps.kediritechnopark.com/webhook/chatbot';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', message: 'Halo! Ada yang bisa saya bantu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState("sess-" + Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', message: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(N8N_CHAT_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.message,
          timestamp: new Date().toISOString(),
          sessionId: sessionId
        })
      });

      if (response.ok) {
        const result = await response.json();
        const botMessage = { 
          type: 'bot', 
          message: result.response || "Maaf, saya tidak dapat memproses permintaan Anda saat ini."
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage = { 
          type: 'bot', 
          message: "Terjadi kesalahan. Silakan coba lagi."
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        type: 'bot', 
        message: "Terjadi kesalahan koneksi. Silakan coba lagi."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, sessionId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <h2 className="text-4xl font-bold text-gray-800">Chatbot AI</h2>
      <p className="mt-2 mb-6 text-gray-600">Ajukan pertanyaan atau mulai percakapan dengan AI kami.</p>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl whitespace-pre-wrap ${
                msg.type === 'user' 
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {msg.message}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan Anda..."
              className="flex-1 p-3 border border-gray-300 rounded-lg transition duration-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;