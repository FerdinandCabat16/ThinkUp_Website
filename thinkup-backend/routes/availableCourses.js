
const express = require('express');
const Course = require('../models/Course');
const router = express.Router();


router.get('/', async (req, res) => {
  const { startDate, endDate, domain, language, query } = req.query;

  const filters = {
    availableSpots: { $gt: 0 }
  };

  if (startDate && endDate) {
    filters.startDate = { $gte: new Date(startDate) };
    filters.endDate = { $lte: new Date(endDate) };
  }

  if (domain) {
    filters.domain = domain;
  }

  if (query) {
    filters.title = { $regex: query, $options: 'i' };
  }

  try {
    let courses = await Course.find(filters).sort({ startDate: 1 });

    if (language) {
     
      courses = courses.sort((a, b) => {
        const aHasLang = a.languages.includes(language);
        const bHasLang = b.languages.includes(language);
        return (aHasLang === bHasLang) ? 0 : aHasLang ? -1 : 1;
      });
    }

    res.json(courses);
  } catch (err) {
    console.error('Eroare la filtrare cursuri:', err);
    res.status(500).json({ error: 'Eroare la filtrare cursuri' });
  }
});

module.exports = router;
