import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { BiSolidSend } from 'react-icons/bi';
import { MdChat } from 'react-icons/md';
import { fetchDataFromApi, postData } from '../../utils/api';
import './chatbox.css';

const STORAGE_KEY = 'chatbox_session_id';

const createMessage = (payload) => ({
  id: payload.id || `${Date.now()}-${Math.random()}`,
  text: payload.text,
  sender: payload.sender,
  timestamp: payload.timestamp instanceof Date ? payload.timestamp : new Date(payload.timestamp || Date.now()),
  products: Array.isArray(payload.products) ? payload.products : [],
});

const initialBotMessage = createMessage({
  id: 'initial-bot-message',
  text: 'Xin chào! Mình có thể giúp bạn tìm sản phẩm phù hợp, so sánh lựa chọn và trả lời nhanh các câu hỏi mua sắm.',
  sender: 'bot',
  timestamp: new Date(),
});

const mapHistoryToMessages = (history = []) =>
  history
    .filter((item) => item?.role === 'user' || item?.role === 'assistant')
    .map((item, index) =>
      createMessage({
        id: `${item.role}-${index}-${item.createdAt || Date.now()}`,
        text: item.content,
        sender: item.role === 'assistant' ? 'bot' : 'user',
        timestamp: item.createdAt || Date.now(),
      }),
    );

const formatPrice = (price) => Number(price || 0).toLocaleString('vi-VN');

const ChatBox = () => {
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialBotMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const suggestions = useMemo(
    () => [
      { icon: '🔥', text: 'Sản phẩm nào đang bán chạy nhất?' },
      { icon: '💰', text: 'Tìm sản phẩm trong tầm giá 500k đến 1 triệu' },
      { icon: '🎁', text: 'Gợi ý quà tặng cho bạn gái' },
      { icon: '📏', text: 'Tư vấn size hoặc thông số sản phẩm' },
      { icon: '🚚', text: 'Chính sách giao hàng và đổi trả thế nào?' },
    ],
    [],
  );

  useEffect(() => {
    let nextSessionId = localStorage.getItem(STORAGE_KEY);

    if (!nextSessionId) {
      nextSessionId = `chat-${Date.now()}`;
      localStorage.setItem(STORAGE_KEY, nextSessionId);
    }

    setSessionId(nextSessionId);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let isMounted = true;

    const loadHistory = async () => {
      const response = await fetchDataFromApi(`/api/chat/${sessionId}`);

      if (!isMounted || response?.success !== true || !response?.data?.messages?.length) {
        return;
      }

      const historyMessages = mapHistoryToMessages(response.data.messages);

      if (historyMessages.length) {
        setMessages(historyMessages);
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const showSuggestions = messages.length <= 1 && !isLoading;

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading || !sessionId) {
      return;
    }

    const userMessage = createMessage({ text: trimmedMessage, sender: 'user' });
    const currentInput = trimmedMessage;

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const response = await postData('/api/chat/send', {
      sessionId,
      message: currentInput,
      history: messages
        .filter((item) => item.sender === 'user' || item.sender === 'bot')
        .map((item) => ({
          role: item.sender === 'bot' ? 'assistant' : 'user',
          content: item.text,
        })),
    });

    if (response?.success && response?.data?.reply) {
      setMessages((prev) => [
        ...prev,
        createMessage({
          text: response.data.reply,
          sender: 'bot',
          products: response?.data?.productSuggestions || [],
        }),
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        createMessage({
          text: response?.message || 'Hệ thống AI đang bận. Bạn thử lại sau ít phút nhé.',
          sender: 'bot',
        }),
      ]);
    }

    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestionText) => {
    setInputValue(suggestionText);
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="chatbox-container">
      <div className={`chatbox-window ${isOpen ? 'chatbox-open' : 'chatbox-closed'}`}>
        <div className="chatbox-header">
          <div className="chatbox-header-content">
            <h3 className="chatbox-title">Trợ lý mua sắm AI</h3>
            <p className="chatbox-subtitle">Tư vấn nhanh về sản phẩm và đơn hàng</p>
          </div>
          <button className="chatbox-close-btn" onClick={toggleChat} type="button">
            <IoClose size={20} />
          </button>
        </div>

        <div className="chatbox-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message message-${message.sender}`}>
              <div className="message-content">
                <p className="message-text">{message.text}</p>

                {message.sender === 'bot' && message.products?.length > 0 && (
                  <div className="chatbox-products">
                    {message.products.map((product) => (
                      <Link key={product._id} to={`/product/${product._id}`} className="chatbox-product-card">
                        <div className="chatbox-product-image-wrap">
                          <img
                            src={product.image || '/bannerBox1.jpg'}
                            alt={product.name}
                            className="chatbox-product-image"
                          />
                        </div>
                        <div className="chatbox-product-info">
                          <p className="chatbox-product-name">{product.name}</p>
                          <div className="chatbox-product-meta">
                            {product.brand && <span>{product.brand}</span>}
                            {product.catName && <span>{product.catName}</span>}
                          </div>
                          <div className="chatbox-product-price-row">
                            <strong>{formatPrice(product.price)}đ</strong>
                            {Number(product.oldPrice) > 0 && (
                              <span>{formatPrice(product.oldPrice)}đ</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

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

          {showSuggestions && (
            <div className="suggestions-container">
              <p className="suggestions-text">Gợi ý để bắt đầu:</p>
              <div className="suggestions-grid">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.text}
                    className="suggestion-btn"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    type="button"
                  >
                    <span className="suggestion-icon">{suggestion.icon}</span>
                    <span className="suggestion-text">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chatbox-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chatbox-input"
            placeholder="Nhập tin nhắn của bạn..."
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

      <button
        className={`chatbox-toggle-btn ${isOpen ? 'chatbox-btn-open' : ''}`}
        onClick={toggleChat}
        title={isOpen ? 'Đóng chat' : 'Mở chat'}
        type="button"
      >
        {isOpen ? <IoClose size={24} /> : <MdChat size={24} />}
      </button>
    </div>
  );
};

export default ChatBox;
