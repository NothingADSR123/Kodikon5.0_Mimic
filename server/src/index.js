const express = require('express');
const cors = require('cors');
require('dotenv').config();
const aiRoutes = require('./routes/aiRoutes');
const ttsRoutes = require('./routes/tts');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors()); // Allows our React client to talk to this server
app.use(express.json()); // Allows us to read JSON from requests

app.use('/api/ai', aiRoutes);
app.use('/api/tts', ttsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});