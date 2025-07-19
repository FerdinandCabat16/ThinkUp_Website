// components/Chatbot.js
import React, { useState } from 'react';
import './Chatbot.css'; // dacă ai un fișier de stil

function Chatbot() {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Bună! Cu ce te pot ajuta?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Eroare la răspuns.' }]);
    }

    setInput('');
  };

  return (
    <>
      {!show && (
        <div className="chatbot-icon" onClick={() => setShow(true)}>
          🤖
        </div>
      )}

      {show && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>ThinkUp Chat</span>
            <button onClick={() => setShow(false)}>–</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${msg.from === 'bot' ? 'left' : 'right'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Scrie mesajul aici..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
