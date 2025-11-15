const gtts = require('gtts');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

/**
 * Text-to-Speech Service using gTTS (Google Text-to-Speech)
 * 
 * ✅ COMPLETELY FREE - No API key, no billing required!
 * 
 * Features:
 * - Female voice (Google's default TTS voice)
 * - Slow speaking rate for calming effect
 * - Multiple language support
 * - No setup needed - just npm install gtts
 */

class TTSService {
  constructor() {
    // No initialization needed for gTTS!
    this.tempDir = path.join(__dirname, '../../temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Strip Markdown formatting from text
   * @param {string} text - Text with Markdown formatting
   * @returns {string} - Clean text without Markdown syntax
   */
  stripMarkdown(text) {
    let cleanText = text;

    // Remove code blocks (```code```)
    cleanText = cleanText.replace(/```[\s\S]*?```/g, '');
    
    // Remove inline code (`code`)
    cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
    
    // Remove bold (**text** or __text__)
    cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
    cleanText = cleanText.replace(/__([^_]+)__/g, '$1');
    
    // Remove italic (*text* or _text_) - more precise regex
    cleanText = cleanText.replace(/\*([^*\n]+)\*/g, '$1');
    cleanText = cleanText.replace(/_([^_\n]+)_/g, '$1');
    
    // Remove any remaining standalone asterisks or underscores
    cleanText = cleanText.replace(/[*_]/g, '');
    
    // Remove headers (# ## ###)
    cleanText = cleanText.replace(/^#{1,6}\s+/gm, '');
    
    // Remove links [text](url) -> text
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    
    // Remove images ![alt](url)
    cleanText = cleanText.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
    
    // Remove horizontal rules (---, ***)
    cleanText = cleanText.replace(/^(\*{3,}|-{3,}|_{3,})$/gm, '');
    
    // Remove blockquotes (>)
    cleanText = cleanText.replace(/^>\s+/gm, '');
    
    // Remove list markers (*, -, +, 1.)
    cleanText = cleanText.replace(/^[\*\-\+]\s+/gm, '');
    cleanText = cleanText.replace(/^\d+\.\s+/gm, '');
    
    // Remove strikethrough (~~text~~)
    cleanText = cleanText.replace(/~~(.*?)~~/g, '$1');
    
    // Remove HTML tags
    cleanText = cleanText.replace(/<[^>]*>/g, '');
    
    // Clean up multiple spaces and newlines
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n');
    cleanText = cleanText.replace(/\s{2,}/g, ' ');
    
    // Trim whitespace
    cleanText = cleanText.trim();
    
    return cleanText;
  }

  /**
   * Convert text to speech with soothing female voice
   * @param {string} text - The text to convert to speech
   * @param {Object} options - Optional voice customization
   * @returns {Promise<Buffer>} - Audio buffer in MP3 format
   */
  async synthesizeSpeech(text, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Validate input
        if (!text || typeof text !== 'string') {
          throw new Error('Text must be a non-empty string');
        }

        if (text.length > 5000) {
          throw new Error('Text exceeds maximum length of 5000 characters');
        }

        // Strip Markdown formatting before converting to speech
        const cleanText = this.stripMarkdown(text);
        
        if (!cleanText || cleanText.trim().length === 0) {
          throw new Error('Text contains no readable content after removing formatting');
        }

        console.log('📝 Original length:', text.length, '| Clean length:', cleanText.length);

        // Create gTTS instance with slower speech for extra calming effect
        const speech = new gtts(cleanText, 'en', 0.85); // 0.85 = slower, more relaxed pace
        
        // Generate unique filename
        const filename = `tts-${Date.now()}.mp3`;
        const filepath = path.join(this.tempDir, filename);

        // Save to file
        speech.save(filepath, (err) => {
          if (err) {
            console.error('gTTS Error:', err);
            reject(new Error(`Failed to generate audio: ${err.message}`));
            return;
          }

          // Read file as buffer
          fs.readFile(filepath, (readErr, buffer) => {
            // Clean up temp file
            fs.unlink(filepath, (unlinkErr) => {
              if (unlinkErr) console.warn('Failed to delete temp file:', unlinkErr);
            });

            if (readErr) {
              reject(new Error(`Failed to read audio file: ${readErr.message}`));
              return;
            }

            resolve(buffer);
          });
        });
      } catch (error) {
        console.error('TTS Service Error:', error);
        reject(new Error(`Failed to synthesize speech: ${error.message}`));
      }
    });
  }

  /**
   * Get available voices info
   * @returns {Promise<Array>} - List of available voices
   */
  async getAvailableVoices() {
    // gTTS uses Google's default TTS voice (female)
    return [
      {
        name: 'Google TTS Female (en-US)',
        gender: 'FEMALE',
        languageCode: 'en',
        description: 'Free Google Text-to-Speech with natural female voice',
      },
    ];
  }

  /**
   * Check if service is ready
   * @returns {Promise<boolean>} - True if service is operational
   */
  async validateService() {
    try {
      // Test with a simple phrase
      const testBuffer = await this.synthesizeSpeech('Test');
      return testBuffer && testBuffer.length > 0;
    } catch (error) {
      console.error('gTTS validation failed:', error);
      return false;
    }
  }
}

module.exports = new TTSService();
