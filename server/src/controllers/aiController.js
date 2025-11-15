const aiService = require('../services/aiService');

const generateScene = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // We will add retry logic around this call later
    const result = await aiService.generateSceneJson(prompt);
    res.json(result);
  } catch (error) {
    console.error('Error in AI Controller:', error);
    res.status(500).json({ error: 'Failed to generate scene from AI.' });
  }
};

const chatWithMimic = async (req, res) => {
  const { message } = req.body;
  console.log('Chat request received:', message);
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    console.log('Calling generateChatResponse...');
    const response = await aiService.generateChatResponse(message);
    console.log('Chat response generated successfully');
    res.json({ response });
  } catch (error) {
    console.error('Error in Chat Controller:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to get chat response.', details: error.message });
  }
};

const generateQuiz = async (req, res) => {
  const { concept } = req.body;
  console.log('Quiz request received for concept:', concept);
  
  if (!concept) {
    return res.status(400).json({ error: 'Concept is required' });
  }

  try {
    console.log('Calling generateQuiz...');
    const quizText = await aiService.generateQuiz(concept);
    console.log('Quiz generated successfully');
    res.json({ quiz: quizText });
  } catch (error) {
    console.error('Error in Quiz Controller:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to generate quiz.', details: error.message });
  }
};

const generateReExplanation = async (req, res) => {
  const { concept, questionText, userAnswer, correctAnswer } = req.body;
  console.log('Re-explanation request received');
  
  if (!concept || !questionText || !userAnswer || !correctAnswer) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log('Calling generateReExplanation...');
    const explanation = await aiService.generateReExplanation(concept, questionText, userAnswer, correctAnswer);
    console.log('Re-explanation generated successfully');
    res.json({ explanation });
  } catch (error) {
    console.error('Error in Re-explanation Controller:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to generate re-explanation.', details: error.message });
  }
};

module.exports = { generateScene, chatWithMimic, generateQuiz, generateReExplanation };