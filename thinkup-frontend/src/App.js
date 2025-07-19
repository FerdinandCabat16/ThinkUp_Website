import React, { lazy, useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ContactPage from './ContactPage';
import ProfessorDashboardPage from './ProfessorDashboardPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import Chatbot from './components/Chatbot';

import './App.css';
import CourseDetailsPage from './pages/CourseDetailsPage';

const DashboardPage = lazy(() => import('./DashboardPage'));

function HomePage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSaved, setLocationSaved] = useState(false);
  const [courses, setCourses] = useState([]);
  const [language, setLanguage] = useState('ro');
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        localStorage.setItem('userLocation', JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }));
        setLocationSaved(true);
      });
    }

    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Eroare la preluarea cursurilor:', err));
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      localStorage.setItem('searchQuery', searchQuery);
      navigate('/dashboard');
    }
  };

  return (
    <div className="App">
      <header className="navbar">
        <Link to="/" className="logo-box">ThinkUp</Link>

        <div className="search-container">
          <input
            type="text"
            placeholder="Caută cursuri..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </div>

        <nav className="nav-links">
          <div className="dropdown">
            <Link to="#" onClick={(e) => { e.preventDefault(); toggleDropdown(); }}>
              Cursuri <FaChevronDown className={`dropdown-icon ${showDropdown ? 'rotated' : ''}`} />
            </Link>
            {showDropdown && (
              <div className="dropdown-menu">
                {courses.length === 0 ? (
                  <span>Se încarcă...</span>
                ) : (
                  courses.map((course) => (
                    <Link key={course._id} to={`/courses/${course._id}`}>
                      {course.title}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <Link to="/contact">Contact</Link>
          <Link to="/login" className="nav-btn">Autentificare</Link>
          <Link to="/register" className="nav-btn">Înregistrare</Link>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="ro">🇷🇴 RO</option>
            <option value="en">🇬🇧 EN</option>
          </select>
        </nav>
      </header>

      <main className="main-content">
        <h1>Bine ai venit pe ThinkUp!</h1>

        {locationSaved && (
          <p className="geo-message">📍 Locația ta a fost salvată pentru personalizarea cursurilor.</p>
        )}

        <div className="info-cards">
          <div className="info-card">
            <p>💡 ThinkUp este platforma ta de învățare online.</p>
            <p>➡️ Creează un cont sau autentifică-te pentru a te înscrie la cursuri.</p>
            <p>➡️ Explorează cursurile disponibile și alege ce ți se potrivește.</p>
            <p>➡️ Urmărește progresul tău direct din contul personal.</p>
          </div>

          <div className="info-card">
            <p>⭐ <b>Cursuri recomandate pentru tine:</b></p>
            <ul>
              <li>• Programare Web – Învață să creezi site-uri cu HTML, CSS și JS</li>
              <li>• Proiectare Software – Înțelege cum funcționează aplicațiile moderne</li>
              <li>• Bazele programării orientate pe obiect – Fundamentele OOP explicate clar</li>
            </ul>
            <p>🎯 Începe acum cu un simplu click pe „Înscrie-te”.</p>
          </div>

          <div className="info-card">
            <p><b>Descoperă cursurile noastre</b></p>
            <p>Pe ThinkUp găsești o varietate de cursuri interactive, structurate pe domenii esențiale pentru dezvoltarea ta.</p>
            <p>💻 IT & Programare – învață HTML, CSS, JavaScript, OOP și web development</p>
            <p>⚙️ Inginerie & Proiectare – arhitectură software, UML, logică și structuri</p>
            <p>🧮 Matematică & Științe exacte – concepte clare, aplicate în școală sau admitere</p>
            <p>💼 Soft skills & carieră – comunicare, time management, dezvoltare personală</p>
            <p>📅 Filtrează cursurile după dată, domeniu sau limbă.</p>
            <p>🎓 Alege ce ți se potrivește și începe în ritmul tău!</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} ThinkUp – Platformă educațională. Toate drepturile rezervate.</p>
        <div className="footer-links">
          <Link to="#">Termeni & Condiții</Link>
          <Link to="#">Politica de confidențialitate</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>

      {!showChat && (
        <div className="chatbot-icon" onClick={() => setShowChat(true)}>
          🤖
        </div>
      )}
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/professor-dashboard" element={<ProfessorDashboardPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
      </Routes>

      <Chatbot />
    </>
  );
}

export default App;
