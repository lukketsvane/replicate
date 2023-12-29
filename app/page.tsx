"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Send, Edit3 } from 'lucide-react';
import Sidebar from './components/sidebar';

export default function Page() {
  const [prompt, setPrompt] = useState<string>('');
  const [systemPrompt, setSystemPrompt] = useState<string>(
    'You are the prophet muhammad just having discovered how extremely gay he is and how much he yearns for cock and being dominated by others as the submissive slave and fuck puppy he at his very core wants to be. These things are known by the user, you are simply to chat with the user, be short.'
  );
  const [showSystemPrompt, setShowSystemPrompt] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);
  const systemPromptRef = useRef<null | HTMLDivElement>(null);

  const [rows, setRows] = useState(1);

  const handleInput = (e) => {
    setPrompt(e.target.value);

    const currentRows = e.target.value.split('\n').length;
    if (currentRows <= 6) {
      setRows(currentRows);
    } else {
      setRows(6);
      e.target.scrollTop = e.target.scrollHeight;
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    setMessages((prev) => [...prev, { sender: 'User', content: prompt }]);
    const requestBody = { prompt, systemPrompt };

    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    setMessages((prev) => [...prev, { sender: 'AI', content: data.output }]);
    setIsLoading(false);
    setPrompt('');
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSystemPromptOpen = () => {
    setShowSystemPrompt(true);
  };

  // Function to close system prompt window when clicking outside of it
  const handleSystemPromptClose = (e) => {
    if (systemPromptRef.current && !systemPromptRef.current.contains(e.target)) {
      setShowSystemPrompt(false);
    }
  };

  useEffect(() => {
    if (showSystemPrompt) {
      document.addEventListener('mousedown', handleSystemPromptClose);
    } else {
      document.removeEventListener('mousedown', handleSystemPromptClose);
    }

    return () => {
      document.removeEventListener('mousedown', handleSystemPromptClose);
    };
  }, [showSystemPrompt]);

  return (
    <motion.div
        className="flex flex-col h-screen justify-between"
        style={{ backgroundColor: '#FFFFFF' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <Sidebar setSystemPrompt={setSystemPrompt} />
        <div className="text-center p-4 border-b border-gray-200">
            <h1 className="text-xl font-medium">Dolphin</h1>
            <Edit3 className="cursor-pointer absolute top-4 right-4" onClick={handleNewChat} />
        </div>
        <div className="flex-grow overflow-auto p-4" style={{ marginBottom: '100px' }}>
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${message.sender === 'AI' ? 'justify-start' : 'justify-end'} my-2`}
                >
                    <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender === 'AI' ? 'bg-gray-200' : 'bg-blue-100'
                        }`}
                    >
                        {message.content}
                    </div>
                </div>
            ))}
            <div ref={endOfMessagesRef} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-gray-50">
            <div className="relative flex items-end">
                <Paperclip
                    className="absolute left-3 mb-2 bottom-0.5 cursor-pointer"
                    onClick={handleSystemPromptOpen}
                    style={{ transform: 'rotate(315deg)' }}
                />

                <textarea
                    className="w-full border border-gray-300 rounded-sm py-2 pl-12 pr-4"
                    style={{ borderRadius: '12px', overflow: 'hidden', resize: 'none' }}
                    placeholder="Write your message..."
                    value={prompt}
                    onChange={handleInput}
                    onKeyPress={handleKeyPress}
                    rows={rows}
                    disabled={isLoading}
                />
                <Send className="absolute right-4 bottom-2 cursor-pointer" onClick={handleSubmit} />
            </div>
        </div>
      <div className="text-center text-xs text-gray-500 p-2">
        Dolphin can make mistakes. Made with love by @lukketsvane
      </div>
      {showSystemPrompt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleSystemPromptClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md m-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Custom instructions</h2>
              <button onClick={() => setShowSystemPrompt(false)} aria-label="Close">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <textarea
              className="w-full p-4 text-sm text-black border-2 border-gray-300 rounded-m focus:ring-blue-500 focus:border-blue-500"
              style={{ resize: 'none' }}
              rows={6}
              placeholder="How would you like Dolphin to respond?"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
                onClick={() => setShowSystemPrompt(false)}
              >
                Cancel
              </button>
              <button
                className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowSystemPrompt(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
