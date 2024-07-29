import React, { useEffect, useRef, useState } from 'react';

/**
 * ChatHistoryText component
 * @param {Array} chatHistory - Array of chat messages
 * @param {Function} onSendMessage - Function to handle sending a new message
 */
const ChatHistoryText = ({ chatHistory, sendMessage }) => {
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    console.log("EVENT:", e)
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
}
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="chat-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
        <form className="chat-input" onSubmit={handleSendMessage}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleSendMessage}
        />
        {/* <button type="submit">Send</button> */}
      </form>
      </div>
      
    </div>
  );
};

export default ChatHistoryText;
