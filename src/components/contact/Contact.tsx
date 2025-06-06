import React, { useState } from 'react';
import './Contact.css';
import Navigation from '../navigation/Navigation';
import PageHeader from '../page-header/PageHeader';

const Contact: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'eltyagi', text: 'hi there!', timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(true);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { sender: 'you', text: message, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMessage]);
    setMessage('');
    setShowMessageInput(false);
    setIsTyping(true);

    try {
      // Create mailto link (client-side email sending)
      const subject = 'Message from your website contact form';
      const body = `Hi Lakshya,\n\nYou received a new message from your website:\n\n"${message}"\n\nBest regards,\nWebsite Contact Form`;
      const mailtoLink = `mailto:lakshya_tyagi@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;

      // Simulate processing delay
      setTimeout(() => {
        const responseMessage = { 
          sender: 'eltyagi', 
          text: 'Thanks for reaching out! I\'ll get back to you soon!', 
          timestamp: Date.now() 
        };
        setChatMessages(prev => [...prev, responseMessage]);
        setIsTyping(false);
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setShowMessageInput(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="contact">
      <div className="pg-title-container">
        <PageHeader/>
      </div>

      <div className='contact-chat-container'>
        <div className='chat-messages'>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender === 'eltyagi' ? 'eltyagi-message' : 'user-message'}`}>
              <div className='message-sender'>{msg.sender}</div>
              <div className='message-content'>{msg.text}</div>
            </div>
          ))}
          
          {isTyping && (
            <div className='chat-message eltyagi-message typing'>
              <div className='message-sender'>eltyagi</div>
              <div className='message-content'>
                <div className='typing-indicator'>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {showMessageInput && (
          <div className='message-input-container'>
            <div className='message-input-label'>you</div>
            <textarea
              className='message-input'
              aria-label='Your message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='type your message here...'
              autoFocus
            />
            <button 
              className='send-button'
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              Send
            </button>
          </div>
        )}
      </div>

      <div className='nav'>
        <div className='nav-bg'></div>
        <Navigation/>
      </div>
    </div>
  );
};

export default Contact;