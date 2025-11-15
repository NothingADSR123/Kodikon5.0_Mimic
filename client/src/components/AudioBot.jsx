import React, { useState, useRef, useEffect } from 'react';
import '../styles/AudioBot.css';

/**
 * AudioBot Component - Text-to-Speech Explanation Reader
 * 
 * Props:
 * - text: string (required) - The explanation text to read aloud
 * - autoPlay: boolean - Whether to auto-play when text changes
 */
const AudioBot = ({ text, autoPlay = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const prevTextRef = useRef(text);

  /**
   * Generate and play audio from text
   */
  const handlePlayAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call backend TTS API
      const response = await fetch('http://localhost:5001/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          options: {
            voiceName: 'en-US-Wavenet-F', // Soothing female voice
            speakingRate: 0.95, // Slightly slower
            pitch: 2.0 // Soft tone
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      // Convert response to blob
      const audioBlob = await response.blob();
      
      // Create URL for audio
      const url = URL.createObjectURL(audioBlob);
      
      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl(url);
      
      // Set audio source and play
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('AudioBot Error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Auto-regenerate when text changes
  useEffect(() => {
    // Force cleanup whenever text prop changes
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setError(null);
    
    // Update the previous text reference
    prevTextRef.current = text;
    
    // Auto-generate new audio if autoPlay is enabled
    if (autoPlay && text) {
      handlePlayAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  /**
   * Toggle play/pause
   */
  const handleTogglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  /**
   * Stop and reset audio
   */
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  /**
   * Handle audio ended
   */
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="audio-bot">
      <div className="audio-bot-controls">
        {/* Generate/Play Button */}
        {!audioUrl ? (
          <button
            className="audio-bot-btn audio-bot-btn-primary"
            onClick={handlePlayAudio}
            disabled={isLoading || !text}
            title="Listen to explanation"
          >
            {isLoading ? (
              <>
                <span className="audio-bot-spinner"></span>
                Generating...
              </>
            ) : (
              <>
                <span className="audio-bot-icon">🎧</span>
                Listen
              </>
            )}
          </button>
        ) : (
          <>
            {/* Play/Pause Button */}
            <button
              className="audio-bot-btn audio-bot-btn-success"
              onClick={handleTogglePlay}
              disabled={isLoading}
              title={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              <span className="audio-bot-icon">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            {/* Stop Button */}
            <button
              className="audio-bot-btn audio-bot-btn-danger"
              onClick={handleStop}
              disabled={isLoading}
              title="Stop audio"
            >
              <span className="audio-bot-icon">⏹️</span>
              Stop
            </button>

            {/* Regenerate Button */}
            <button
              className="audio-bot-btn audio-bot-btn-secondary"
              onClick={handlePlayAudio}
              disabled={isLoading}
              title="Regenerate audio"
            >
              <span className="audio-bot-icon">🔄</span>
              Regenerate
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="audio-bot-error">
          <span className="audio-bot-error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default AudioBot;
