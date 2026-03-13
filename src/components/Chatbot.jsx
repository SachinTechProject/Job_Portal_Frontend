import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "What services do you offer?",
    "How can I apply for a job?",
    "Tell me about companies",
    "Need help with my account"
  ]);
  
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Send message to backend API
  const sendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || message;
    
    if (!messageToSend.trim()) return;

    // Add user message to chat
    setChat((prev) => [...prev, { 
      sender: "user", 
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setMessage(""); // clear input
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chats/chat", {
        message: messageToSend
      });

      console.log("Chat response:", res);

      // Add AI reply to chat with slight delay for natural feel
      setTimeout(() => {
        setChat((prev) => [...prev, { 
          sender: "bot", 
          text: res.data.reply || "I'm here to help!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      }, 500);
      
    } catch (error) {
      console.error("Chat error:", error);
      
      let errorMessage = "AI server error. Try again later.";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      }
      
      setChat((prev) => [...prev, { 
        sender: "bot", 
        text: errorMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }
  };

  // Handle suggested question click
  const handleSuggestedClick = (question) => {
    sendMessage(question);
  };

  // Clear chat history
  const clearChat = () => {
    if (window.confirm("Clear all chat messages?")) {
      setChat([]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Help Desk</h2>
                <p className="text-sm text-blue-200">Always here to help you 24/7</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Clear chat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="h-96 overflow-y-auto p-5 bg-gray-50" style={{ scrollBehavior: 'smooth' }}>
          {chat.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to AI Help Desk!</h3>
              <p className="text-gray-500 mb-4">Ask me anything about our services, jobs, or companies.</p>
              
              {/* Suggested Questions */}
              <div className="mt-4 space-y-2 w-full max-w-xs">
                <p className="text-sm text-gray-500">Try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedClick(question)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.sender === "bot" && (
                        <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                      )}
                      <span className={`text-xs ${msg.sender === "user" ? "text-blue-200" : "text-gray-400"}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-200">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                disabled={isTyping}
              />
              {message && (
                <button
                  onClick={() => setMessage("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!message.trim() || isTyping}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                !message.trim() || isTyping
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              <span>Send</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-3 flex gap-2 text-xs text-gray-500">
            <span>Quick:</span>
            <button 
              onClick={() => sendMessage("Help")}
              className="hover:text-blue-600 hover:underline"
            >
              Help
            </button>
            <span>•</span>
            <button 
              onClick={() => sendMessage("Contact support")}
              className="hover:text-blue-600 hover:underline"
            >
              Contact
            </button>
            <span>•</span>
            <button 
              onClick={() => sendMessage("FAQ")}
              className="hover:text-blue-600 hover:underline"
            >
              FAQ
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-5 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
          <span>Powered by AI</span>
          <span>{chat.length} messages</span>
        </div>
      </div>
    </div>
  );
}