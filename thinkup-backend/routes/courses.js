const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

function requireProfessor(req, res, next) {
  if (!req.session.user) return res.status(401).json({ message: 'Nu ești autentificat' });
  if (req.session.user.role !== 'profesor') return res.status(403).json({ message: 'Acces interzis – doar profesori' });
  next();
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la încărcarea cursurilor' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Cursul nu a fost găsit' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la încărcarea cursului' });
  }
});

router.post('/', requireProfessor, async (req, res) => {
  const {
    title, description, category, startDate, endDate,
    sessions, cost, availableSlots, languages
  } = req.body;

  try {
    const course = new Course({
      title,
      description,
      domain: category,
      startDate,
      endDate,
      sessions,
      cost,
      availableSpots: availableSlots,
      languages,
      createdBy: req.session.user.id
    });

    await course.save();
    res.status(201).json({ message: 'Curs adăugat cu succes', course });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la salvarea cursului' });
  }
});

router.put('/:id', requireProfessor, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Cursul nu a fost găsit' });
    if (course.createdBy.toString() !== req.session.user.id) {
      return res.status(403).json({ message: 'Nu ai permisiunea să editezi acest curs' });
    }

    Object.assign(course, {
      ...req.body,
      domain: req.body.category,
      availableSpots: req.body.availableSlots
    });

    await course.save();
    res.json({ message: 'Curs actualizat', course });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la actualizare' });
  }
});

router.delete('/:id', requireProfessor, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Cursul nu a fost găsit' });
    if (course.createdBy.toString() !== req.session.user.id) {
      return res.status(403).json({ message: 'Nu ai permisiunea să ștergi acest curs' });
    }

    await course.deleteOne();
    res.json({ message: 'Curs șters cu succes' });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la ștergere' });
  }
});

module.exports = router;
