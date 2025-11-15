const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate-scene', aiController.generateScene);
router.post('/chat', aiController.chatWithMimic);
router.post('/quiz', aiController.generateQuiz);
router.post('/re-explain', aiController.generateReExplanation);

module.exports = router;