const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');


router.post('/enroll', async (req, res) => {
  const { courseId, cost } = req.body;
  const userId = req.session?.user?.id;

  if (!userId) return res.status(401).json({ message: 'Nu ești autentificat.' });

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Cursul nu există.' });

    if (course.availableSpots <= 0) {
      return res.status(400).json({ message: 'Cursul nu are locuri disponibile.' });
    
    }
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ message: 'Ești deja înscris la acest curs.' });
    }

    await Enrollment.create({ userId, courseId, cost });
    course.availableSpots -= 1;
    await course.save();

    res.status(201).json({ message: 'Înrolare realizată cu succes.' });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Eroare server.', error: err.message });
  }
});



router.get('/statistics', async (req, res) => {
  try {
    const stats = await Enrollment.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          studenti: { $sum: 1 }
        }
      },
      {
        $project: {
          luna: '$_id',
          studenti: 1,
          _id: 0
        }
      },
      { $sort: { luna: 1 } }
    ]);

    const dates = await Enrollment.find().distinct('date');
    const enrolledDates = dates.map(date => new Date(date).toISOString().split('T')[0]);

    res.json({ chartData: stats, enrolledDates });
  } catch (err) {
    res.status(500).json({ message: 'Eroare statistici.', error: err.message });
  }
});



router.get('/my', async (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) return res.status(401).json({ message: 'Neautentificat' });

  try {
    const enrollments = await Enrollment.find({ userId }).populate('courseId');
    const formatted = enrollments.map(enr => ({
      title: enr.courseId.title,
      cost: enr.cost,
      domain: enr.courseId.domain,
      startDate: enr.courseId.startDate,
      endDate: enr.courseId.endDate,
      sessions: enr.courseId.sessions,
      languages: enr.courseId.languages,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Eroare server', error: err.message });
  }
});


module.exports = router;
