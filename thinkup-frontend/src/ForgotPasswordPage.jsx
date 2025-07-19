import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      alert('⚠️ Introdu o adresă de email validă!');
      return;
    }

    // Simulăm trimiterea email-ului de resetare
    setSuccess('✅ Un email de resetare a fost trimis (simulat). Verifică inbox-ul!');
  };

  return (
    <div className="forgot-page">
      <header className="forgot-header">
        <Link to="/" className="logo-box">ThinkUp</Link>
      </header>

      <main className="forgot-main">
        <h1>Resetare parolă</h1>
        <p>Introdu adresa de email pentru a primi un link de resetare a parolei.</p>

        {success && <p className="success-msg">{success}</p>}

        <form className="forgot-form" onSubmit={handleSubmit}>
          <label>
            Email Address
            <input
              type="email"
              placeholder="Enter your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="submit-btn">Trimite</button>
        </form>

        <p className="back-link">
          <Link to="/login">← Înapoi la autentificare</Link>
        </p>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} ThinkUp – Platformă educațională.</p>
      </footer>
    </div>
  );
}

export default ForgotPasswordPage;
