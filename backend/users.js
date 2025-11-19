// backend/users.js
import express from 'express';
import bcrypt from 'bcryptjs';
import db from './db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ error: 'User already exists or invalid input' });
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  });
});

export default router;
