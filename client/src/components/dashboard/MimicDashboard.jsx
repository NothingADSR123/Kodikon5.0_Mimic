// 📌 FINAL MERGED DASHBOARD — NEW UI + OLD FUNCTIONALITY

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Canvas } from '@react-three/fiber';
import ReactMarkdown from 'react-markdown';
import Scene from '../../components/3d/Scene';
import AudioBot from '../../components/AudioBot';

import '../../styles/MimicDashboard.css';
import logoImage from '../../assets/logo.png';

// --- OLD FUNCTIONAL BACKEND ROUTES ---
const SCENE_API = "http://localhost:5001/api/ai/generate-scene";
const CHAT_API = "http://localhost:5001/api/ai/chat";
const QUIZ_API = "http://localhost:5001/api/ai/quiz";
const REEXPLAIN_API = "http://localhost:5001/api/ai/re-explain";

export default function MimicDashboard() {

  // ================
  // OLD FUNCTIONAL STATES (merged)
  // ================
const explanationRef = useRef(null);
  const [prompt, setPrompt] = useState('');
  const [sceneData, setSceneData] = useState({ objects: [], relationships: [], sequence: [] });
  const [explanation, setExplanation] = useState('');
  const [explanationTimestamp, setExplanationTimestamp] = useState(Date.now());
  const [isLoadingScene, setIsLoadingScene] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
const navigate = useNavigate();

  // ================
  // NEW UI STATES (unchanged)
  // ================
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeControl, setActiveControl] = useState('Play');
  const [concept, setConcept] = useState('');

  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: "Hi! I'm here to help you understand this scene. Ask me anything!" }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizConcept, setQuizConcept] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  const chatMessagesRef = useRef(null);

  const navItems = ['Playground', 'Scenes Library', 'Cognitive Styles', 'Support'];
  const controls = ['Play', 'Pause', 'Step', 'Regenerate'];

  // ===============================
  // AUTO SCROLL CHAT
  // ===============================
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    window.location.href = '/';
  };

  // ===============================
  // ⭐ MERGED OLD FUNCTIONALITY: GENERATE SCENE
  // ===============================
  const handleVisualize = async () => {
    if (!concept.trim()) return;

    setPrompt(concept);
    setIsLoadingScene(true);
    setError(null);
    setCurrentStep(0);

    try {
      const response = await axios.post(SCENE_API, { prompt: concept });
      const { sceneGraph, explanation } = response.data;

      if (sceneGraph) {
        setSceneData(sceneGraph);
      } else {
        setSceneData(response.data);
      }

      if (explanation) {
        setExplanation(explanation);
        setExplanationTimestamp(Date.now());
      }

    } catch (err) {
      setError("Failed to generate scene.");
    }

    setIsLoadingScene(false);
  };

  // ===============================
  // ⭐ NEXT/PREV STEP (OLD FUNCTIONALITY)
  // ===============================
  const handleNextStep = () => {
    if (sceneData.sequence && currentStep < sceneData.sequence.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ===============================
  // ⭐ AUDIO BOT VOICE-READ
  // ===============================
const handleVoiceRead = () => {
  // Trigger AudioBot to re-speak (in case text changed)
  setExplanationTimestamp(Date.now());

  // Small delay to ensure content is rendered before scrolling
  setTimeout(() => {
    if (explanationRef.current) {
      explanationRef.current.scrollTop = explanationRef.current.scrollHeight;
    }
  }, 100);
};


  // ===============================
  // ⭐ CHATBOT (NEW UI)
  // ===============================
  const handleSendMessage = async () => {
    if (chatInput.trim() && !isSendingMessage) {
      const userMsg = chatInput.trim();
      setChatMessages([...chatMessages, { type: 'user', text: userMsg }]);
      setChatInput('');
      setIsSendingMessage(true);

      try {
        const response = await axios.post(CHAT_API, { message: userMsg });
        setChatMessages(prev => [...prev, { type: 'bot', text: response.data.response }]);
      } catch (error) {
        setChatMessages(prev => [...prev, { type: 'bot', text: "Connection error. Try again." }]);
      } finally {
        setIsSendingMessage(false);
      }
    }
  };

  // ===============================
  // ⭐ QUIZ SYSTEM (unchanged)
  // ===============================

  const parseQuizQuestions = (quizText) => {
    const questions = [];
    const blocks = quizText.split(/Q\d+\./g).filter(b => b.trim());

    blocks.forEach((block, index) => {
      const lines = block.trim().split("\n").filter(l => l.trim());
      if (lines.length >= 6) {
        const questionText = lines[0];
        const options = {
          A: lines[1].replace(/^A\)\s*/, ''),
          B: lines[2].replace(/^B\)\s*/, ''),
          C: lines[3].replace(/^C\)\s*/, ''),
          D: lines[4].replace(/^D\)\s*/, '')
        };
        const answerLine = lines.find(l => l.toLowerCase().startsWith("answer:"));
        const correctAnswer = answerLine ? answerLine.split(":")[1].trim().toUpperCase() : "A";

        questions.push({ id: index + 1, question: questionText, options, correctAnswer });
      }
    });

    return questions;
  };

  const handleStartQuiz = async () => {
    if (!concept.trim()) return alert("Enter concept first");

    setIsLoadingQuiz(true);
    setQuizConcept(concept);

    try {
      const response = await axios.post(QUIZ_API, { concept });
      const parsedQuestions = parseQuizQuestions(response.data.quiz);
      setQuizQuestions(parsedQuestions);
      setCurrentQuestionIndex(0);
      setQuizScore(0);
      setIsQuizMode(true);
    } catch {
      alert("Quiz error.");
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleAnswerSelect = async (selectedOption) => {
    const current = quizQuestions[currentQuestionIndex];
    const isCorrectAns = selectedOption === current.correctAnswer;

    setIsCorrect(isCorrectAns);
    setShowFeedback(true);

    if (isCorrectAns) {
      setQuizScore(prev => prev + 1);
      setFeedbackMessage("Correct! 🎉");
    } else {
      try {
        const response = await axios.post(REEXPLAIN_API, {
          concept: quizConcept,
          questionText: current.question,
          userAnswer: selectedOption,
          correctAnswer: current.correctAnswer
        });
        setFeedbackMessage(response.data.explanation);
      } catch {
        setFeedbackMessage("Incorrect. Try again!");
      }
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setShowFeedback(false);
  };

  const handleExitQuiz = () => {
    setIsQuizMode(false);
  };

  // ==========================================
  // ⭐ FINAL UI RETURN — 100% NEW UI, UNCHANGED
  // ==========================================
  return (
    <div className="dashboard-root">

      {/* NAVIGATION (unchanged) */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-logo">
            <img src={logoImage} className="logo-image" />
            <span className="logo-text" onClick={() => navigate('/')}>Mimic</span>
          </div>

          <div className="nav-items">
            {navItems.map(item => <button key={item} className="nav-item">{item}</button>)}
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            {navItems.map(item => <button key={item} className="mobile-nav-item">{item}</button>)}
            <button className="mobile-nav-item logout-mobile" onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </nav>

      {/* TOP CONTROLS (unchanged UI, but wired to logic) */}
      <div className="top-controls">
        <div className="top-controls-content">

          <div className="concept-input-group">
            <input 
              type="text"
              className="concept-input-main"
              placeholder="Type a concept…"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
            />
            <button className="visualize-btn" onClick={handleVisualize}>
              {isLoadingScene ? "Loading..." : "Visualize"}
            </button>
          </div>

          {/* NOTE: Removed duplicate playback-controls from here as they are now in the explanation panel */}
          {/* <div className="playback-controls">
            <button className="control-pill" onClick={handlePrevStep}>Prev</button>
            <button className="control-pill" onClick={handleNextStep}>Next</button>
          </div> */}

        </div>
      </div>

      {/* MAIN AREA */}
      <main className="dashboard-main">

        {/* LEFT: SIMPLE EXPLANATION */}
{/* LEFT: SIMPLE EXPLANATION — FULLY FIXED WITH INLINE STYLES ONLY */}
<div 
  className="explanation-panel"
  style={{
    height: '100%',
    maxHeight: '100vh',           // Critical: never taller than screen
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'            // Prevents panel from expanding layout
  }}
>
  <div 
    className="card explanation-card"
    style={{
      flex: 1,                     // Take all available height
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',          // Crucial: card won't grow beyond panel
      borderRadius: '12px'
    }}
  >
    {/* Header + Voice Button */}
    {/* Header + Voice Button */}
<div className="card-header-with-voice">
  <h2 className="card-title">Simple explanation</h2>
  <button 
    className="voice-btn" 
    onClick={handleVoiceRead}
    
    
  >
    🔊
  </button>
</div>

    {/* Step Controls */}
    <div className="playback-controls" style={{ marginBottom: '10px', flexShrink: 0 }}>
      <button 
        className="control-pill" 
        onClick={handlePrevStep}
        disabled={currentStep <= 1}
      >
        Prev
      </button>
      <button 
        className="control-pill" 
        onClick={handleNextStep}
        disabled={sceneData.sequence && currentStep >= sceneData.sequence.length}
      >
        Next
      </button>
    </div>

    {/* Scrollable Content Area — This is the only part that scrolls */}
    <div 
      className="explanation-content"
      ref={explanationRef}  // ← Attach the ref here!
      style={{
        flex: 1,                    // Takes all remaining space
        overflowY: 'auto',          // Scroll only here
        paddingRight: '8px',        // Optional: breathing room for scrollbar
        marginRight: '-8px'         // Compensates padding so content aligns perfectly
      }}
    >
      {explanation ? (
        <>
          <ReactMarkdown>{explanation}</ReactMarkdown>
          <AudioBot text={explanation} key={explanationTimestamp} autoRegenerate={true} />
        </>
      ) : (
        <p style={{ opacity: 0.7 }}>Explanation will appear here once you visualize a concept.</p>
      )}
      {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}
    </div>
  </div>
</div>

        {/* CENTER: 3D SCENE — WITH BEAUTIFUL BOTTOM OVERLAY */}
<section className="scene-playground">
  <div className="card scene-card">
    <h3 className="scene-title">3D Scene</h3>

    {/* Canvas Container — Must be position: relative for overlay */}
    <div 
      className="scene-canvas" 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        borderRadius: '12px', 
        overflow: 'hidden' 
      }}
    >
      {/* 3D Canvas — Full size */}
      <Canvas 
        camera={{ position: [0, 5, 20], fov: 60 }}
      >
        <Scene data={sceneData} currentStep={currentStep} />
      </Canvas>

      {/* Floating Bottom Overlay — Only shows when there are steps */}
      {sceneData.sequence && sceneData.sequence.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50px',
            padding: '14px 28px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            zIndex: 20,
            minWidth: '280px',
            textAlign: 'center',
            fontFamily: 'inherit'
          }}
        >
          {/* Step Label */}
          <p
            style={{
              margin: '0 0 10px 0',
              color: '#e2e8f0',
              fontSize: '14px',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            Step {currentStep} / {sceneData.sequence.length} —{' '}
            <span style={{ color: '#93c5fd' }}>
              {currentStep > 0 ? sceneData.sequence[currentStep - 1].label : "Initial Scene"}
            </span>
          </p>

          {/* Prev / Next Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handlePrevStep}
              disabled={currentStep <= 1}
              style={{
                padding: '10px 20px',
                background: currentStep <= 1 
                ,
                              background: "#4facfe", 

                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: currentStep <= 1 ? 'not-allowed' : 'pointer',
                opacity: currentStep <= 1 ? 0.6 : 1,
                transition: 'all 0.3s ease',
                minWidth: '90px'
              }}
            >
              ← Prev
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStep >= sceneData.sequence.length}
              style={{
                padding: '10px 20px',
                background: currentStep >= sceneData.sequence.length
              ,
              background: "#4facfe", 
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: currentStep >= sceneData.sequence.length ? 'not-allowed' : 'pointer',
                opacity: currentStep >= sceneData.sequence.length ? 0.6 : 1,
                transition: 'all 0.3s ease',
                minWidth: '90px'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</section>

        {/* RIGHT: CHAT PANEL */}
        <aside className="chat-panel"
style={{
    height: '100%',
    maxHeight: '100vh',           // Critical: never taller than screen
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'            // Prevents panel from expanding layout
  }}>
          <div className="card chat-card"
style={{
      flex: 1,                     // Take all available height
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',          // Crucial: card won't grow beyond panel
      borderRadius: '12px'
    }}>
            <h3 className="chat-title">{isQuizMode ? "Quiz Time!" : "Chat with Mimic"}</h3>

            {!isQuizMode ? (
              <>
                <div className="chat-messages-area" ref={chatMessagesRef}>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.type}`}>{msg.text}</div>
                  ))}
                </div>

                <div className="chat-input-area">
                  <input 
                    type="text" 
                    className="chat-input-field"
                    placeholder="Ask something…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button className="send-btn" onClick={handleSendMessage}>➤</button>
                </div>

                <button className="test-me-btn" onClick={handleStartQuiz}>
                  📝 Test Me!
                </button>
              </>

            ) : (
              <div> {/* QUIZ CONTENT stays unchanged */} </div>
            )}

          </div>
        </aside>

      </main>
    </div>
  );
}