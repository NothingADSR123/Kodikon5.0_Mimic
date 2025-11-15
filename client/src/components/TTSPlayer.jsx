import React, { useState, useRef, useEffect } from 'react';

/**
 * TTSPlayer Component
 * A reusable text-to-speech player with audio controls
 * 
 * Props:
 * - text: string (required) - The text to convert to speech
 * - autoPlay: boolean - Whether to automatically generate and play audio
 * - voiceOptions: object - Voice customization options
 */
const TTSPlayer = ({ text, autoPlay = false, voiceOptions = {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  // Default voice options
  const defaultOptions = {
    languageCode: 'en-US',
    voiceName: 'en-US-Neural2-C', // Natural female voice
    gender: 'FEMALE',
    speakingRate: 1.0,
    pitch: 0.0,
    ...voiceOptions
  };

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && text) {
      handleGenerateAudio();
    }
  }, [autoPlay, text]);

  /**
   * Generate audio from text using the backend TTS API
   */
  const handleGenerateAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the backend TTS API
      const response = await fetch('http://localhost:5001/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          options: defaultOptions
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      // Convert response to blob
      const audioBlob = await response.blob();
      
      // Create URL for audio blob
      const url = URL.createObjectURL(audioBlob);
      
      // Clean up previous audio URL if exists
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
      console.error('TTS Error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

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
   * Stop audio and reset
   */
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  /**
   * Handle audio ended event
   */
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Styles
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
    },
    button: {
      padding: '10px 16px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    generateButton: {
      background: '#5E92B0',
      color: 'white',
    },
    playButton: {
      background: '#4CAF50',
      color: 'white',
    },
    stopButton: {
      background: '#f44336',
      color: 'white',
    },
    disabledButton: {
      background: '#ccc',
      cursor: 'not-allowed',
      opacity: 0.6,
    },
    errorText: {
      color: '#f44336',
      fontSize: '12px',
      marginTop: '4px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Generate/Regenerate Button */}
      <button
        onClick={handleGenerateAudio}
        disabled={isLoading || !text}
        style={{
          ...styles.button,
          ...styles.generateButton,
          ...(isLoading || !text ? styles.disabledButton : {}),
        }}
      >
        {isLoading ? '⏳ Generating...' : audioUrl ? '🔄 Regenerate' : '🎵 Generate Audio'}
      </button>

      {/* Play/Pause Button */}
      {audioUrl && (
        <button
          onClick={handleTogglePlay}
          disabled={isLoading}
          style={{
            ...styles.button,
            ...styles.playButton,
          }}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
      )}

      {/* Stop Button */}
      {audioUrl && (
        <button
          onClick={handleStop}
          disabled={isLoading}
          style={{
            ...styles.button,
            ...styles.stopButton,
          }}
        >
          ⏹️ Stop
        </button>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        style={{ display: 'none' }}
      />

      {/* Error Message */}
      {error && (
        <div style={styles.errorText}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default TTSPlayer;
