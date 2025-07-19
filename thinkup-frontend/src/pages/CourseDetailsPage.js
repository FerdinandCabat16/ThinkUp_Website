import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CourseDetailsPage.css';

function CourseDetailsPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error('Eroare încărcare curs:', err));
  }, [courseId]);

  if (!course) return <p>Se încarcă cursul...</p>;

  return (
    <div className="course-details">
      <h1>{course.title}</h1>
      <p><strong>Domeniu:</strong> {course.category}</p>
      <p><strong>Descriere:</strong> {course.description}</p>
      <p><strong>Limbă:</strong> {course.language}</p>
      <p><strong>Perioadă:</strong> {course.startDate} - {course.endDate}</p>
      <p><strong>Număr ședințe:</strong> {course.sessions}</p>
      <p><strong>Locuri disponibile:</strong> {course.availableSlots}</p>
      <p><strong>Cost:</strong> {course.cost} RON</p>

      <button className="enroll-btn">Înscrie-te la acest curs</button>
    </div>
  );
}

export default CourseDetailsPage;
