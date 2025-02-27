import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, ArrowDown, RefreshCw } from 'lucide-react';
import './Chat.css';
import api from '../../api';

const Chat = () => {
  // State management
  const [messages, setMessages] = useState(() => {
    // Try to load previous messages from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        id: 1,
        text: "Welcome to Vaulet! I'm your personal financial assistant. How can I help with your budgeting, vaults, or challenges today?",
        sender: 'bot',
        timestamp: new Date().toISOString() 
      }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState(() => {
    const savedHistory = localStorage.getItem('conversationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages.slice(-50))); // Only save last 50 messages
  }, [messages]);
  
  useEffect(() => {
    localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
  }, [conversationHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoize scrollToBottom to avoid recreating on each render
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  const handleUserIdChange = (e) => {
    const newUserId = e.target.value;
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId);
    // Clear conversation history when user ID changes
    setConversationHistory([]);
  };
  
  const resetConversation = () => {
    if (confirm("Are you sure you want to reset the conversation? This will clear all messages.")) {
      // Keep only the welcome message
      const welcomeMsg = messages.length > 0 && messages[0].sender === 'bot' ? [messages[0]] : [];
      setMessages(welcomeMsg);
      setConversationHistory([]);
      localStorage.removeItem('conversationHistory');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add user ID context to the first message in conversation if it exists
    // This ensures the user ID context is preserved in the conversation history
    let userContent = input.trim();
    
    // Store this message in conversation history
    const updatedHistory = [...conversationHistory, {
      role: 'user',
      content: userContent
    }];
    setConversationHistory(updatedHistory);
    
    const currentInput = input.trim(); // Save current input before clearing
    setInput('');
    setLoading(true);
    setError(null);
    
    // Cancel any in-progress requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      // Add timeout for the request
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          throw new Error("Request timed out after 30 seconds");
        }
      }, 30000);
      
      // Make API request with abort signal and include conversation history
      const response = await api.post('/api/chatbot/chat/', {
        message: currentInput,
        userId: userId.trim() || null, // Send null instead of undefined if empty
        conversationHistory: updatedHistory.slice(-10) // Send last 10 exchanges to avoid too large payloads
      }, {
        signal: abortControllerRef.current.signal
      });
      
      clearTimeout(timeoutId);
      
      // With most API clients like axios, the response data is already parsed
      const data = response.data;
      
      // Add bot response to conversation history
      setConversationHistory(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
      
      // Add bot response to UI messages
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.response || "I'm having trouble processing that right now. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        processingTime: data.processing_time // Store processing time if returned
      }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      
      // Only add error message if not aborted
      if (error.name !== 'AbortError') {
        // Extract the error message from the API response if possible
        let errorMessage = error.message;
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        
        setError(errorMessage);
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `Sorry, I couldn't process your request: ${errorMessage}`,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isError: true
        }]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    // Submit on Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <div >
      <div className="chat-header">
        <div className="chat-header-icon" style={{backgroundColor:"#ffffff"}}>
          <Bot size={24} />
        </div>
        <div className="flex-1">
          <h1 className="hero-title--gradient" style={{ fontSize: "2rem" }}>Vaulter, Your Vaulet Assistant</h1>
        </div>
        <div className="chat-controls">
          <button 
            className="reset-button" 
            onClick={resetConversation} 
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RefreshCw size={18} />
          </button>
          
        </div>
      </div>
      
      <div 
        className="chat-messages" 
        ref={chatContainerRef}
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message-container ${message.sender === 'bot' ? 'bot-message' : 'user-message'} ${message.isError ? 'error-message' : ''}`}
          >
            <div className="message-avatar">
              {message.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-timestamp">
                {formatTimestamp(message.timestamp)}
                {message.processingTime && <span className="processing-time"> (took {message.processingTime})</span>}
              </div>
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
        <button className="scroll-bottom-button" onClick={scrollToBottom} aria-label="Scroll to bottom">
          <ArrowDown size={16} />
        </button>
      )}
      
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about budgeting, vaults, or challenges..."
          className="chat-input"
          disabled={loading}
          aria-label="Chat message input"
        />
        <button 
          type="submit" 
          className="chat-send-button"
          disabled={loading || input.trim() === ''}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
      
      {userId && (
        <div className="user-info-indicator">
          Connected as User: {userId}
        </div>
      )}
    </div>
  );
};

export default Chat;