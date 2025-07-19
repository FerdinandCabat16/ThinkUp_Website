import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './RegisterPage.css';

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!occupation || occupation === 'Choose your status') {
      setErrorMsg('⚠️ Selectează ocupația!');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('⚠️ Introdu o adresă de email validă!');
      return;
    }
    if (!username) {
      setErrorMsg('⚠️ Introdu un nume de utilizator!');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('⚠️ Parola trebuie să aibă minim 6 caractere!');
      return;
    }

    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role: occupation.toLowerCase() // student / profesor
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Înregistrare reușită! Vei fi redirecționat către autentificare.');
        navigate('/login');
      } else {
        setErrorMsg(data.message || 'Eroare la înregistrare.');
      }
    } catch (err) {
      console.error('Eroare la înregistrare:', err);
      setErrorMsg('⚠️ Eroare de server.');
    }
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <Link to="/" className="logo-box">ThinkUp</Link>
      </header>

      <main className="register-main">
        <h1>Bine ai venit pe ThinkUp!</h1>

        <div className="register-tabs">
          <Link to="/login" className="tab-btn">Autentificare</Link>
          <Link to="/register" className="tab-btn active">Înregistrare</Link>
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            Ocupație
            <select value={occupation} onChange={(e) => setOccupation(e.target.value)}>
              <option>Choose your status</option>
              <option>Student</option>
              <option>Profesor</option>
            </select>
          </label>

          <label>
            Email Address
            <input
              type="email"
              placeholder="Enter your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            User name
            <input
              type="text"
              placeholder="Enter your User name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          <button type="submit" className="submit-btn">Înregistrare</button>
        </form>
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

export default RegisterPage;
