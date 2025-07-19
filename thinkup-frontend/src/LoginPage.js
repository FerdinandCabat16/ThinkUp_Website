import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Redirecționare în funcție de rol
        if (data.role === 'profesor') {
          navigate('/professor-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(data.message || 'Autentificare eșuată.');
      }
    } catch (err) {
      console.error('Eroare autentificare:', err);
      alert('Eroare server. Încearcă din nou.');
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <Link to="/" className="logo-box">ThinkUp</Link>
      </header>

      <main className="login-main">
        <h1>Bine ai venit pe ThinkUp!</h1>

        <div className="login-tabs">
          <Link to="/login" className="tab-btn active">Autentificare</Link>
          <Link to="/register" className="tab-btn">Înregistrare</Link>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label>
            User name
            <input
              type="text"
              placeholder="Enter your User name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="password-field">
            Password
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="submit-btn">Autentificare</button>
        </form>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} ThinkUp – Platformă educațională. Toate drepturile rezervate.</p>
        <div className="footer-links">
          <a href="#termeni">Termeni & Condiții</a>
          <a href="#politica">Politica de confidențialitate</a>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
