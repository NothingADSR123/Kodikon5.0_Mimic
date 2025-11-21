const express = require('express');
const cors = require('cors');
require('dotenv').config();
const aiRoutes = require('../server/src/routes/aiRoutes');
const ttsRoutes = require('../server/src/routes/tts');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/tts', ttsRoutes);

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'Server is running' });
});

module.exports = app;
