const express = require('express');
const router = express.Router();
const ttsService = require('../services/ttsService');

/**
 * POST /api/tts
 * Convert text to speech using FREE gTTS (Google Text-to-Speech)
 * 
 * ✅ NO API KEY NEEDED - Completely free!
 * 
 * Request body:
 * {
 *   "text": "The explanation to read aloud"
 * }
 * 
 * Response: audio/mpeg file (MP3) with female voice
 */
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    // Validate request body
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required in request body',
      });
    }

    console.log('🎙️ gTTS Request:', { textLength: text.length });

    // Synthesize speech with gTTS (free!)
    const audioBuffer = await ttsService.synthesizeSpeech(text);

    // Set response headers for audio streaming
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'Accept-Ranges': 'bytes',
    });

    // Send audio buffer
    res.send(audioBuffer);
    
    console.log('✅ gTTS Success:', { audioSize: audioBuffer.length });
  } catch (error) {
    console.error('❌ TTS Route Error:', error);
    
    // Determine appropriate status code
    const statusCode = error.message.includes('maximum length') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to generate audio',
    });
  }
});

/**
 * GET /api/tts/voices
 * Get available voices (gTTS uses Google's free female voice)
 */
router.get('/voices', async (req, res) => {
  try {
    const voices = await ttsService.getAvailableVoices();
    
    res.json({
      success: true,
      voices: voices,
      note: 'Using free gTTS - no API key required!',
    });
  } catch (error) {
    console.error('Voices Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available voices',
    });
  }
});

/**
 * GET /api/tts/health
 * Check if gTTS service is operational
 */
router.get('/health', async (req, res) => {
  try {
    const isValid = await ttsService.validateService();
    
    if (isValid) {
      res.json({
        success: true,
        message: '🎙️ gTTS service is operational - FREE female voice',
        status: 'healthy',
        provider: 'gTTS (Google Text-to-Speech)',
        apiKey: 'Not required - completely free! 🎉'
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'gTTS service validation failed',
        status: 'unhealthy',
      });
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'gTTS service is unavailable',
      status: 'unhealthy',
      error: error.message,
    });
  }
});

module.exports = router;
