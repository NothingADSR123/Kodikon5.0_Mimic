import React, { useState } from 'react';
import TTSPlayer from '../components/TTSPlayer';

/**
 * Example page showing how to use the TTS feature
 * You can integrate this into your Mimic app wherever you need audio explanations
 */
function TTSExample() {
  const [customText, setCustomText] = useState(
    'Welcome to Mimic! This platform helps neurodivergent thinkers visualize complex ideas in calming 3D scenes.'
  );

  const exampleExplanations = [
    {
      title: 'What is Visual Thinking?',
      text: 'Visual thinking is a cognitive process where information is processed primarily through visual imagery rather than words. For neurodivergent individuals, this often means concepts become clearer when represented spatially in three dimensions rather than as linear text.'
    },
    {
      title: 'How Mimic Reduces Cognitive Load',
      text: 'Mimic uses calming color palettes, intuitive spatial layouts, and interactive 3D environments to reduce sensory overload. By organizing information visually, your brain can process complex ideas without the stress of parsing dense text.'
    },
    {
      title: 'Generating 3D Scenes',
      text: 'Our AI analyzes your input and instantly generates interactive three-dimensional representations. You can rotate, zoom, and explore these scenes at your own pace, making abstract concepts tangible and easier to understand.'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔊 Text-to-Speech Demo</h1>
        <p style={styles.subtitle}>
          Listen to explanations with natural-sounding AI voices
        </p>
      </div>

      {/* Example Explanations */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Explanations</h2>
        <div style={styles.grid}>
          {exampleExplanations.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardText}>{item.text}</p>
              <TTSPlayer 
                text={item.text}
                voiceOptions={{
                  voiceName: 'en-US-Neural2-C',
                  speakingRate: 1.0
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Text Input */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Try Your Own Text</h2>
        <div style={styles.customCard}>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            style={styles.textarea}
            placeholder="Enter any text to convert to speech..."
            rows={6}
          />
          <TTSPlayer 
            text={customText}
            voiceOptions={{
              voiceName: 'en-US-Neural2-C',
              speakingRate: 1.0
            }}
          />
        </div>
      </div>

      {/* Voice Options Demo */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Different Voice Styles</h2>
        <div style={styles.voiceGrid}>
          {[
            { name: 'Female (Warm)', voice: 'en-US-Neural2-C', rate: 1.0 },
            { name: 'Male (Professional)', voice: 'en-US-Neural2-A', rate: 1.0 },
            { name: 'Female (Fast)', voice: 'en-US-Neural2-F', rate: 1.3 },
            { name: 'Male (Deep)', voice: 'en-US-Neural2-D', rate: 0.9 },
          ].map((voiceOption, index) => (
            <div key={index} style={styles.voiceCard}>
              <h4 style={styles.voiceTitle}>{voiceOption.name}</h4>
              <TTSPlayer 
                text="Hello! This is a demonstration of different voice styles available in Mimic."
                voiceOptions={{
                  voiceName: voiceOption.voice,
                  speakingRate: voiceOption.rate
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '"Poppins", system-ui, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 700,
    color: '#2C3E50',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '18px',
    color: '#5A6C7D',
    margin: 0,
  },
  section: {
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 600,
    color: '#2C3E50',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'rgba(167, 199, 231, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(167, 199, 231, 0.3)',
    transition: 'transform 0.2s',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#2C3E50',
    marginBottom: '15px',
  },
  cardText: {
    fontSize: '15px',
    color: '#5A6C7D',
    lineHeight: 1.7,
    marginBottom: '20px',
  },
  customCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(167, 199, 231, 0.3)',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid rgba(167, 199, 231, 0.5)',
    fontSize: '16px',
    fontFamily: 'inherit',
    marginBottom: '20px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  voiceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  voiceCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(167, 199, 231, 0.3)',
  },
  voiceTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#2C3E50',
    marginBottom: '15px',
  },
};

export default TTSExample;
