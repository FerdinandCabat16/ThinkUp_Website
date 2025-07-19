// DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaBook, FaList, FaChartBar } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import './DashboardPage.css';

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [showFilters, setShowFilters] = useState(false);
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [calendarDates, setCalendarDates] = useState([]);
  const [statsData, setStatsData] = useState([]);

  const [filters, setFilters] = useState({
    domeniu: '', dataStart: '', dataEnd: '', nrSedinte: '', cost: '', locuri: '', limbi: ''
  });

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(coords);
          localStorage.setItem('userLocation', JSON.stringify(coords));
        },
        () => setError('Nu am putut detecta locația.')
      );
    } else {
      setError('Geolocația nu este suportată de browser.');
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchStats();

    const stored = localStorage.getItem('myCourses');
    if (stored) setMyCourses(JSON.parse(stored));
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courses');
      const data = await res.json();
      const available = data.filter(c => c.availableSpots > 0);
      setCourses(available);
      setFilteredCourses(available);
    } catch (err) {
      console.error('Eroare la încărcare cursuri:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/enrollments/statistics');
      const data = await res.json();
      setStatsData(data.chartData || []);
      setCalendarDates(data.enrolledDates || []);
    } catch (err) {
      console.error('Eroare statistici:', err);
    }
  };

  useEffect(() => {
    localStorage.setItem('myCourses', JSON.stringify(myCourses));
  }, [myCourses]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const filtered = courses.filter(course => {
      return (
        (!filters.domeniu || course.domain === filters.domeniu) &&
        (!filters.nrSedinte || course.sessions >= Number(filters.nrSedinte)) &&
        (!filters.locuri || course.availableSpots >= Number(filters.locuri)) &&
        (!filters.cost || course.cost <= Number(filters.cost)) &&
        (!filters.dataStart || new Date(course.startDate) >= new Date(filters.dataStart)) &&
        (!filters.dataEnd || new Date(course.endDate) <= new Date(filters.dataEnd)) &&
        (!filters.limbi || course.languages?.some(lang =>
          lang.toLowerCase().includes(filters.limbi.toLowerCase())
        ))
      );
    });
    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId, title, cost) => {
  try {
    const response = await fetch('http://localhost:5000/api/enrollments/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 🔥 esențial pentru sesiuni
      body: JSON.stringify({ courseId, cost })
    });

    const data = await response.json();

    if (response.ok) {
      alert('✅ Înscriere realizată cu succes!');
      // opțional: adaugă cursul la lista locală
      setMyCourses(prev => [...prev, { title, cost }]);
    } else {
      alert(data.message || 'Eroare la înscriere.');
    }
  } catch (error) {
    console.error('Eroare înscriere:', error);
    alert('Eroare server.');
  }
};



  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      const found = courses.find(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
      if (found) alert(`Navighează la curs: ${found.title}`);
      else alert('Niciun curs găsit.');
    }
  };

  const renderFilters = () => (
    <div>
      <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>Filtrează cursuri</button>
      {showFilters && (
        <div className="filter-dropdown">
          <label>Domeniu:
            <select name="domeniu" value={filters.domeniu} onChange={handleFilterChange}>
              <option value="">Toate</option>
              <option value="IT">IT</option>
              <option value="Inginerie">Inginerie</option>
              <option value="Matematică">Matematică</option>
            </select>
          </label>
          <label>Data început:
            <input type="date" name="dataStart" value={filters.dataStart} onChange={handleFilterChange} />
          </label>
          <label>Data final:
            <input type="date" name="dataEnd" value={filters.dataEnd} onChange={handleFilterChange} />
          </label>
          <label>Număr ședințe:
            <input type="number" name="nrSedinte" value={filters.nrSedinte} onChange={handleFilterChange} />
          </label>
          <label>Cost:
            <input type="number" name="cost" value={filters.cost} onChange={handleFilterChange} />
          </label>
          <label>Locuri disponibile:
            <input type="number" name="locuri" value={filters.locuri} onChange={handleFilterChange} />
          </label>
          <label>Limbi disponibile:
            <input type="text" name="limbi" value={filters.limbi} onChange={handleFilterChange} />
          </label>
          <button onClick={applyFilters}>Aplică filtre</button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'available':
        return (
          <div>
            {renderFilters()}
            <div className="courses-list">
              {filteredCourses.map(course => (
                <div key={course._id} className="course-card">
                  <img src="https://cdn-icons-png.flaticon.com/512/2721/2721290.png" alt={course.title} />
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>{course.description || 'Descriere indisponibilă'}</p>
                    <p><strong>Domeniu:</strong> {course.domain}</p>
                    <p><strong>Perioadă:</strong> {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}</p>
                    <p><strong>Ședințe:</strong> {course.sessions}</p>
                    <p><strong>Locuri:</strong> {course.availableSpots}</p>
                    <p><strong>Limbă:</strong> {course.languages?.join(', ')}</p>
                    <p><strong>Cost:</strong> {course.cost} RON</p>
                    <button
  className="enroll-btn"
  onClick={() => handleEnroll(course._id, course.title, course.cost)}
>
  Înscrie-te
</button>


                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'my':
        return (
          <div className="courses-list">
            {myCourses.length === 0 ? <p>Nu ești înscris la niciun curs.</p> : myCourses.map((course, index) => (
              <div key={index} className="course-card">
                <img src="https://cdn-icons-png.flaticon.com/512/2721/2721290.png" alt={course.title} />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>Cost: {course.cost} RON</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'stats':
        return (
          <div className="stats-section">
            <div className="calendar-container">
              <Calendar
                tileClassName={({ date }) =>
                  calendarDates.includes(date.toISOString().split('T')[0]) ? 'highlight' : null
                }
              />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="luna" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="studenti" fill="#4A3AFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="navbar">
        <Link to="/" className="logo-box">ThinkUp</Link>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Caută cursuri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKey}
          />
          <FaSearch className="search-icon" />
          {searchQuery && (
            <div className="search-suggestions">
              {courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                <div key={c._id} className="suggestion" onClick={() => {
                  alert(`Ai ales cursul: ${c.title}`);
                  setSearchQuery('');
                }}>{c.title}</div>
              ))}
            </div>
          )}
        </div>
        <nav className="nav-links">
          <div className="dropdown">
            <Link to="#" onClick={(e) => { e.preventDefault(); setShowCoursesDropdown(!showCoursesDropdown); }}>
              Cursuri <FaChevronDown className={`dropdown-icon ${showCoursesDropdown ? 'rotated' : ''}`} />
            </Link>
            {showCoursesDropdown && (
              <div className="dropdown-menu">
                {courses.map((c) => (
                  <Link key={c._id} to={`/courses/${c._id}`}>{c.title}</Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/contact">Contact</Link>
          <div className="dropdown">
            <Link to="#" onClick={(e) => { e.preventDefault(); setShowStudentDropdown(!showStudentDropdown); }}>
              Student <FaChevronDown className={`dropdown-icon ${showStudentDropdown ? 'rotated' : ''}`} />
            </Link>
            {showStudentDropdown && (
              <div className="dropdown-menu">
                <Link to="/login">Profesor</Link>
              </div>
            )}
          </div>
          <button className="nav-btn" onClick={() => navigate('/login')}>Deconectare</button>
        </nav>
      </header>

      <div className="dashboard-body">
        <div className="sidebar">
          <button className={activeTab === 'available' ? 'active' : ''} onClick={() => setActiveTab('available')}><FaBook /> Cursuri disponibile</button>
          <button className={activeTab === 'my' ? 'active' : ''} onClick={() => setActiveTab('my')}><FaList /> Cursurile tale</button>
          <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}><FaChartBar /> Statistici</button>
        </div>
        <div className="dashboard-content">
          <div className="content-wrapper">
            {renderContent()}
            {location && <div className="location-info">📍 Locația ta: Lat {location.latitude.toFixed(4)}, Lng {location.longitude.toFixed(4)}</div>}
            {error && <div className="location-error">{error}</div>}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} ThinkUp – Platformă educațională. Toate drepturile rezervate.</p>
        <div className="footer-links">
          <Link to="#">Termeni & Condiții</Link>
          <Link to="#">Politica de confidențialitate</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>

      {!showChat && <div className="chatbot-icon" onClick={() => setShowChat(true)}>🤖</div>}
      {showChat && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>ThinkUp Chat</span>
            <button onClick={() => setShowChat(false)}>–</button>
          </div>
          <div className="chatbot-messages">
            <div className="chatbot-message left">Salut! Cu ce te pot ajuta?</div>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Scrie un mesaj..." />
            <button>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
