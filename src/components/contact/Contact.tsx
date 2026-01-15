import React, { useState } from 'react';
import './Contact.css';
import Navigation from '../navigation/Navigation';
import PageHeader from '../page-header/PageHeader';

type ConversationStep = 'message' | 'name' | 'email' | 'confirm';

const Contact: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'eltyagi', text: 'hi there!', timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<ConversationStep>('message');
  const [userMessage, setUserMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const addBotMessage = (text: string, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'eltyagi', text, timestamp: Date.now() }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = { sender: 'you', text: inputValue, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');

    if (step === 'message') {
      setUserMessage(currentInput);
      addBotMessage("Nice to meet you! What's your name?");
      setStep('name');
    } else if (step === 'name') {
      setUserName(currentInput);
      addBotMessage(`Great, ${currentInput}! What's your email so I can get back to you?`);
      setStep('email');
    } else if (step === 'email') {
      setUserEmail(currentInput);
      addBotMessage("Perfect! Click 'Send Email' to open your email client with the message ready to go.");
      setStep('confirm');
    }
  };

  const handleSendEmail = () => {
    const subject = 'Message from your website';
    const body = `Hi Lakshya,

${userMessage}

— ${userName} (${userEmail})`;
    const mailtoLink = `mailto:lakshya_tyagi@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    addBotMessage("Thanks for reaching out! I'll get back to you soon!", 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (step === 'confirm') {
        handleSendEmail();
      } else {
        handleSendMessage();
      }
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case 'message': return 'type your message here...';
      case 'name': return 'enter your name...';
      case 'email': return 'enter your email...';
      default: return '';
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

        {step !== 'confirm' ? (
          <div className='message-input-container'>
            <div className='message-input-label'>you</div>
            <textarea
              className='message-input'
              aria-label='Your message'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              autoFocus
            />
            <button 
              className='send-button'
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              Send
            </button>
          </div>
        ) : (
          <div className='message-input-container'>
            <button 
              className='send-button send-email-button'
              onClick={handleSendEmail}
            >
              Send Email
            </button>
          </div>
        )}
      </div>

      <div className='nav'>
        <Navigation/>
      </div>
    </div>
  );
};

export default Contact;