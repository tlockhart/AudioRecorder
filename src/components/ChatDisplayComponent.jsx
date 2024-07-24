import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css'; // Adjust path as per your project structure

const ChatDisplayComponent = ({ chatHistory, transcribedText, chatResponseText, chatEndRef }) => {

  // Effect to scroll chat to bottom whenever chatHistory changes
  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatEndRef]);

  return (
    <div className="chat-container">
      {chatHistory.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          {message.role === 'user' ? <strong>You said:</strong> : <strong>Assistant said:</strong>} {message.content}
        </div>
      ))}
      <div ref={chatEndRef} /> {/* This empty div ensures auto-scrolling to the bottom */}
    </div>
  );
};

ChatDisplayComponent.propTypes = {
  chatHistory: PropTypes.array.isRequired,
  transcribedText: PropTypes.string.isRequired,
  chatResponseText: PropTypes.string.isRequired,
  chatEndRef: PropTypes.object.isRequired,
};

export default ChatDisplayComponent;
