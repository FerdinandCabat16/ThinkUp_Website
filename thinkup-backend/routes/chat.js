const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', 
        messages: [
             {
    role: 'system',
    content: 'Ești ThinkUp Chat, un asistent AI care răspunde politicos la întrebări legate de cursuri online, autentificare, înscrieri și funcționalitatea platformei educaționale ThinkUp. Răspunde clar și prietenos, în limba română.'
            },
        {
    role: 'user',
    content: message
        }
]

      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('Eroare OpenRouter:', err.response?.data || err.message);
    res.status(500).json({ reply: 'Eroare AI. Încearcă mai târziu.' });
  }
});

module.exports = router;
