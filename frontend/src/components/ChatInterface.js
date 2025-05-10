import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';
function ChatInterface({ selectedCV }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  // Reset chat when selected CV changes
  useEffect(() => {
    if (selectedCV) {
      setMessages([
        {
          type: 'system',
          text: `Chat initialized with CV: ${selectedCV.name}`,
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedCV]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || !selectedCV) return;
    
    const userMessage = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cv_id: selectedCV.id,
          question: input,
        }),
      });
      
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: data.response },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'system', text: 'Error: Could not get a response.' },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!selectedCV) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        Please select a CV to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="bg-gray-100 p-4">
        <h2 className="font-medium">Chatting with: {selectedCV.name}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`
              max-w-3/4 rounded-lg p-3 
              ${message.type === 'user' ? 'ml-auto bg-indigo-100' : ''}
              ${message.type === 'bot' ? 'bg-white border border-gray-200' : ''}
              ${message.type === 'system' ? 'mx-auto bg-gray-100 text-sm text-gray-500' : ''}
            `}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this CV..."
          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;