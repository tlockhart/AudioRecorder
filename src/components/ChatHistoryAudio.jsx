import React, { useEffect, useRef } from 'react';

/**
 * ChatHistoryAudio component
 * @param {Array} chatHistory - Array of chat messages
 */
const ChatHistoryAudio = ({ chatHistory }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="chat-history-audio">
      {chatHistory.map((message, index) => (
        <div key={index} className={`chat-message ${message.role}`}>
          <div className="chat-bubble">
            {message.content}
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatHistoryAudio;
