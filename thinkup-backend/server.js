require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const availableCoursesRoutes = require('./routes/availableCourses');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = 5000;


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(express.json());

app.use(session({
  secret: 'thinkup-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',         
    secure: false            
  }
}));


mongoose.connect('mongodb://127.0.0.1:27017/thinkupDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectat cu succes!');
}).catch(err => {
  console.error('Eroare conectare MongoDB:', err);
});


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/available-courses', availableCoursesRoutes);
app.use('/api/chat', chatRoutes);


app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
