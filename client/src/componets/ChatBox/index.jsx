import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BiSolidSend } from 'react-icons/bi';
import { MdChat } from 'react-icons/md';
import './chatbox.css';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! 👋 Tôi có thể giúp bạn tìm những sản phẩm tuyệt vời. Bạn cần tìm gì?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = [
    { icon: '🔥', text: 'Sản phẩm nào hot nhất?' },
    { icon: '💰', text: 'Tìm sản phẩm theo giá' },
    { icon: '⚖️', text: 'Sản phẩm theo cân nặng' },
    { icon: '📏', text: 'Tìm theo kích thước' },
    { icon: '❤️', text: 'Đề xuất theo sở thích' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: `Cảm ơn bạn! Tôi hiểu bạn đang tìm: "${inputValue}". Hãy ghé qua danh mục sản phẩm của chúng tôi để tìm thêm chi tiết. 🛍️`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestionText) => {
    setInputValue(suggestionText);
    setShowSuggestions(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbox-container">
      {/* Chat Window */}
      <div className={`chatbox-window ${isOpen ? 'chatbox-open' : 'chatbox-closed'}`}>
        <div className="chatbox-header">
          <div className="chatbox-header-content">
            <h3 className="chatbox-title">AI Assistant</h3>
            <p className="chatbox-subtitle">Luôn sẵn sàng hỗ trợ</p>
          </div>
          <button className="chatbox-close-btn" onClick={toggleChat}>
            <IoClose size={20} />
          </button>
        </div>

        <div className="chatbox-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message message-${message.sender}`}>
              <div className="message-content">
                <p className="message-text">{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message message-bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          {showSuggestions && messages.length === 1 && (
            <div className="suggestions-container">
              <p className="suggestions-text">Hãy chọn một chủ đề:</p>
              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    <span className="suggestion-icon">{suggestion.icon}</span>
                    <span className="suggestion-text">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form className="chatbox-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chatbox-input"
            placeholder="Nhập tin nhắn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="chatbox-send-btn"
            disabled={!inputValue.trim() || isLoading}
          >
            <BiSolidSend size={18} />
          </button>
        </form>
      </div>

      {/* Floating Button */}
      <button
        className={`chatbox-toggle-btn ${isOpen ? 'chatbox-btn-open' : ''}`}
        onClick={toggleChat}
        title={isOpen ? 'Đóng chat' : 'Mở chat'}
      >
        {isOpen ? <IoClose size={24} /> : <MdChat size={24} />}
      </button>
    </div>
  );
};

export default ChatBox;
