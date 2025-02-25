import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Info, ArrowDown } from 'lucide-react';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to Vaulet! I'm your personal financial assistant. How can I help with your budgeting, vaults, or challenges today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect when user scrolls up to show scroll-to-bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };
  

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    localStorage.setItem('userId', e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Replace with your actual agent API endpoint
      const response = await fetch('/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userId: userId || undefined
        }),
      });
      
      const data = await response.json();
      
      // Add bot response
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: data.response || "I'm having trouble processing that right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Sorry, I couldn't connect to the server. Please check your connection and try again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="chat-header">
        <div className="chat-header-icon" style={{backgroundColor:"#ffffff"}}>
          <Bot size={24} />
        </div>
        <div>
          <h1 className="hero-title--gradient" style={{ fontSize: "2rem" }}>Vaulter, Your Vaulet Assistant</h1>
        </div>
        
      </div>
      
      <div 
        className="chat-messages" 
        ref={chatContainerRef}
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message-container ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}
          >
            <div className="message-avatar">
              {message.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-container bot-message">
            <div className="message-avatar" >
              <Bot size={20} />
            </div>
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {showScrollButton && (
        <button className="scroll-bottom-button" onClick={scrollToBottom}>
          <ArrowDown size={16} />
        </button>
      )}
      
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about budgeting, vaults, or challenges..."
          className="chat-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="chat-send-button"
          disabled={loading || input.trim() === ''}
        >
          <Send size={20} />
        </button>
      </form>
    </>
  );
};

export default Chat;