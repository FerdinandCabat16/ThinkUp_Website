import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import './ContactPage.css';

function ContactPage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="contact-page">
      <header className="navbar">
        <Link to="/" className="logo-box">ThinkUp</Link>

        <div className="search-container">
          <input type="text" placeholder="Caută cursuri..." className="search-bar" />
          <FaSearch className="search-icon" />
        </div>

        <nav className="nav-links">
          <div className="dropdown">
            <Link to="#" onClick={(e) => { e.preventDefault(); toggleDropdown(); }}>
              Cursuri <FaChevronDown className={`dropdown-icon ${showDropdown ? 'rotated' : ''}`} />
            </Link>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="#">Curs 1</Link>
                <Link to="#">Curs 2</Link>
                <Link to="#">Curs 3</Link>
              </div>
            )}
          </div>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="nav-btn">Autentificare</Link>
          <Link to="/register" className="nav-btn">Înregistrare</Link>
        </nav>
      </header>

      <main className="contact-main">
        <h1>Contact Us</h1>

        <div className="contact-content">
          <form className="contact-form">
            <label>
              Full Name
              <input type="text" placeholder="Enter your name" />
            </label>

            <label>
              E-mail
              <input type="email" placeholder="Enter your email" />
            </label>

            <label>
              Message
              <textarea placeholder="Your message"></textarea>
            </label>

            <button type="submit" className="contact-btn">Contact Us</button>
          </form>

          <div className="contact-info">
            <p><b>Contact</b><br />contact@thinkup.com</p>
            <p><b>Telefon</b><br />+40751704501</p>
            <p><b>Based in</b><br />Romania, Cluj-Napoca</p>
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
            </div>
          </div>
        </div>

        {showChat && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <span>ThinkUp Chat</span>
              <button onClick={() => setShowChat(false)}>–</button>
            </div>
            <div className="chatbot-messages">
              <div className="chatbot-message left">Buna, numele meu este ThinkUp Chat!<br />Cu ce te pot ajuta?</div>
              <div className="chatbot-message right">Îmi poți spune unde este găsesc cursurile?</div>
            </div>
            <div className="chatbot-input">
              <input type="text" placeholder="Type your message here..." />
              <button>➤</button>
            </div>
          </div>
        )}

        
        {!showChat && (
          <div className="chatbot-icon" onClick={() => setShowChat(true)}>
            🤖
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} ThinkUp – Platformă educațională. Toate drepturile rezervate.</p>
        <div className="footer-links">
          <Link to="#">Termeni & Condiții</Link>
          <Link to="#">Politica de confidențialitate</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

export default ContactPage;
