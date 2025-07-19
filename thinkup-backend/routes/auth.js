const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Username deja folosit' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed, role });
    await newUser.save();

    res.status(201).json({ message: 'Utilizator creat cu succes' });
  } catch (err) {
    res.status(500).json({ error: 'Eroare server' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Utilizator inexistent' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Parolă incorectă' });

    req.session.user = { id: user._id, role: user.role };
    res.json({ message: 'Logare cu succes', role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Eroare server' });
  }
});


router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Delogat' });
});

module.exports = router;
