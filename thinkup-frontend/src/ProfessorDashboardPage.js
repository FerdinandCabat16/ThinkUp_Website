import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  FaChevronDown, FaBook, FaEdit, FaChartBar, FaTrash, FaSearch
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './ProfessorDashboardPage.css';

function ProfessorDashboardPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [courses, setCourses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [language, setLanguage] = useState('ro');
  const [statsData, setStatsData] = useState([]);
  const [calendarDates, setCalendarDates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [availableDomains, setAvailableDomains] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    domeniu: '',
    dataStart: '',
    dataEnd: '',
    nrSedinte: '',
    cost: '',
    locuri: '',
    limbi: ''
  });

  const [newCourse, setNewCourse] = useState({
    title: '', startDate: '', endDate: '', language: '',
    sessions: '', cost: '', availableSlots: '', category: '', description: ''
  });

  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courses');
      const data = await res.json();
      setCourses(data);
      setAvailableDomains([...new Set(data.map(c => c.category || ''))]);
    } catch (err) {
      console.error('Eroare la încărcare cursuri:', err);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/enrollments/statistics');
      const data = await res.json();
      setStatsData(data.chartData || []);
      setCalendarDates(data.enrolledDates || []);
    } catch (err) {
      console.error('Eroare la statistici:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = courses.filter(course => {
      return (
        (!filters.domeniu || course.category === filters.domeniu) &&
        (!filters.nrSedinte || course.sessions >= Number(filters.nrSedinte)) &&
        (!filters.locuri || course.availableSlots >= Number(filters.locuri)) &&
        (!filters.cost || course.cost <= Number(filters.cost)) &&
        (!filters.dataStart || new Date(course.startDate) >= new Date(filters.dataStart)) &&
        (!filters.dataEnd || new Date(course.endDate) <= new Date(filters.dataEnd)) &&
        (!filters.limbi || course.language?.toLowerCase().includes(filters.limbi.toLowerCase()))
      );
    });
    setCourses(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode
      ? `http://localhost:5000/api/courses/${editId}`
      : 'http://localhost:5000/api/courses';

    const courseData = {
      title: newCourse.title,
      description: newCourse.description,
      startDate: newCourse.startDate,
      endDate: newCourse.endDate,
      language: newCourse.language || '',
      category: newCourse.category || '',
      sessions: Number(newCourse.sessions),
      cost: Number(newCourse.cost),
      availableSlots: Number(newCourse.availableSlots)
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(courseData)
      });

      if (res.ok) {
        await fetchCourses();
        setActiveTab('available');
        setNewCourse({
          title: '', startDate: '', endDate: '', language: '',
          sessions: '', cost: '', availableSlots: '', category: '', description: ''
        });
        setEditMode(false);
        setEditId(null);
      } else {
        console.error('Eroare de la server:', await res.text());
      }
    } catch (err) {
      console.error('Eroare la salvare curs:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error('Eroare la ștergere curs:', err);
    }
  };

  const handleEdit = (course) => {
    setNewCourse({
      title: course.title || '',
      description: course.description || '',
      startDate: course.startDate?.split('T')[0] || '',
      endDate: course.endDate?.split('T')[0] || '',
      language: course.language || '',
      category: course.category || '',
      sessions: course.sessions || '',
      cost: course.cost || '',
      availableSlots: course.availableSlots || ''
    });
    setEditId(course._id);
    setEditMode(true);
    setActiveTab('editor');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      localStorage.setItem('searchQuery', searchQuery);
      navigate('/dashboard');
    }
  };

  const handleLogoutToStudent = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="navbar">
        <Link to="/" className="logo-box">ThinkUp</Link>

        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Caută cursuri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </div>

        <nav className="nav-links">
          <div className="dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span>Cursuri <FaChevronDown /></span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {courses.slice(0, 5).map(course => (
                  <Link key={course._id} to={`/courses/${course._id}`}>{course.title}</Link>
                ))}
              </div>
            )}
          </div>

          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="ro">Română</option>
            <option value="en">English</option>
          </select>

          <Link to="/contact">Contact</Link>

          <div className="dropdown" onClick={() => setRoleDropdown(!roleDropdown)}>
            <span>Profesor <FaChevronDown /></span>
            {roleDropdown && (
              <div className="dropdown-menu">
                <button className="nav-btn" onClick={handleLogoutToStudent}>Student</button>
              </div>
            )}
          </div>

          <button className="nav-btn" onClick={() => navigate('/login')}>Deconectare</button>
        </nav>
      </header>

      <div className="dashboard-body">
        <div className="sidebar">
          <button className={activeTab === 'available' ? 'active' : ''} onClick={() => setActiveTab('available')}>
            <FaBook /> Cursuri disponibile
          </button>
          <button className={activeTab === 'editor' ? 'active' : ''} onClick={() => setActiveTab('editor')}>
            <FaEdit /> Editor cursuri
          </button>
          <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
            <FaChartBar /> Statistici
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'available' && (
            <>
              <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>Filtrează cursuri</button>

              {showFilters && (
                <div className="filter-dropdown">
                  <label>Domeniu:
                    <select name="domeniu" value={filters.domeniu} onChange={handleFilterChange}>
                      <option value="">Toate</option>
                      {availableDomains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
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
                  <button className="filter-btn" onClick={applyFilters}>Aplică filtre</button>
                </div>
              )}

              <div className="courses-list">
                {courses.map(course => (
                  <div key={course._id} className="course-card">
                    <div className="course-info">
                      <h3>{course.title}</h3>
                      <p><strong>Descriere:</strong> {course.description || '-'}</p>
                      <p><strong>Domeniu:</strong> {course.category || '-'}</p>
                      <p><strong>Limbă:</strong> {course.language || '-'}</p>
                      <p><strong>Dată început:</strong> {course.startDate ? new Date(course.startDate).toLocaleDateString() : '-'}</p>
                      <p><strong>Dată final:</strong> {course.endDate ? new Date(course.endDate).toLocaleDateString() : '-'}</p>
                      <p><strong>Ședințe:</strong> {course.sessions ?? '-'}</p>
                      <p><strong>Cost:</strong> {course.cost ? `${course.cost} RON` : '-'}</p>
                      <p><strong>Locuri disponibile:</strong> {course.availableSlots ?? '-'}</p>
                    </div>
                    <div className="course-actions">
                      <button className="edit-btn" onClick={() => handleEdit(course)}>Editează</button>
                      <button className="delete-btn" onClick={() => handleDelete(course._id)}><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'editor' && (
            <div className="editor-form">
              <h2>{editMode ? 'Editează curs' : 'Adaugă curs'}</h2>
              <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Titlu" value={newCourse.title} onChange={handleChange} required />
                <input name="description" placeholder="Descriere" value={newCourse.description} onChange={handleChange} required />
                <div className="row">
                  <input name="startDate" type="date" value={newCourse.startDate} onChange={handleChange} required />
                  <input name="endDate" type="date" value={newCourse.endDate} onChange={handleChange} required />
                </div>
                <input name="language" placeholder="Limbă" value={newCourse.language} onChange={handleChange} />
                <input name="category" placeholder="Domeniu" value={newCourse.category} onChange={handleChange} />
                <div className="row">
                  <input name="sessions" type="number" placeholder="Ședințe" value={newCourse.sessions} onChange={handleChange} />
                  <input name="cost" type="number" placeholder="Cost" value={newCourse.cost} onChange={handleChange} />
                </div>
                <input name="availableSlots" type="number" placeholder="Locuri" value={newCourse.availableSlots} onChange={handleChange} />
                <button type="submit" className="save-btn">Salvează</button>
              </form>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-section">
              <h3>Zile cu înrolări</h3>
              <Calendar
                tileClassName={({ date }) =>
                  calendarDates.includes(date.toISOString().split('T')[0]) ? 'highlight' : null
                }
              />
              <h3>Studenți înrolați pe lună</h3>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessorDashboardPage;
