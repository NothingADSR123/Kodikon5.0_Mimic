import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../styles/MimicDashboard.css';
import logoImage from '../../assets/logo.png';

const API_URL = 'http://localhost:5001/api/ai';

export default function MimicDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeControl, setActiveControl] = useState('Play');
  const [concept, setConcept] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m here to help you understand this scene. Ask me anything!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // Quiz state
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

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleLogout = () => {
    // Add logout logic here (clear session, redirect to home, etc.)
    console.log('Logging out...');
    window.location.href = '/';
  };

  const handleVisualize = () => {
    console.log('Visualizing concept:', concept);
    // Existing visualize function logic goes here
  };

  const handleVoiceRead = () => {
    console.log('Reading explanation aloud');
    // Existing voice read function logic goes here
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() && !isSendingMessage) {
      const userMsg = chatInput.trim();
      setChatMessages([...chatMessages, { type: 'user', text: userMsg }]);
      setChatInput('');
      setIsSendingMessage(true);
      
      try {
        const response = await axios.post(`${API_URL}/chat`, { message: userMsg });
        setChatMessages(prev => [...prev, { type: 'bot', text: response.data.response }]);
      } catch (error) {
        console.error('Chat error:', error);
        setChatMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Sorry, I had trouble connecting. Please try again.' 
        }]);
      } finally {
        setIsSendingMessage(false);
      }
    }
  };

  // Parse quiz text into question objects
  const parseQuizQuestions = (quizText) => {
    const questions = [];
    const questionBlocks = quizText.split(/Q\d+\./g).filter(block => block.trim());
    
    questionBlocks.forEach((block, index) => {
      const lines = block.trim().split('\n').filter(line => line.trim());
      if (lines.length >= 6) {
        const questionText = lines[0].trim();
        const options = {
          A: lines[1].replace(/^A\)\s*/, '').trim(),
          B: lines[2].replace(/^B\)\s*/, '').trim(),
          C: lines[3].replace(/^C\)\s*/, '').trim(),
          D: lines[4].replace(/^D\)\s*/, '').trim()
        };
        const answerLine = lines.find(line => line.toLowerCase().startsWith('answer:'));
        const correctAnswer = answerLine ? answerLine.split(':')[1].trim().toUpperCase() : 'A';
        
        questions.push({
          id: index + 1,
          question: questionText,
          options,
          correctAnswer
        });
      }
    });
    
    return questions;
  };

  const handleStartQuiz = async () => {
    if (!concept.trim()) {
      alert('Please enter a concept first!');
      return;
    }
    
    setIsLoadingQuiz(true);
    setQuizConcept(concept);
    
    try {
      const response = await axios.post(`${API_URL}/quiz`, { concept: concept.trim() });
      const parsedQuestions = parseQuizQuestions(response.data.quiz);
      
      if (parsedQuestions.length === 0) {
        alert('Could not generate quiz. Please try again.');
        return;
      }
      
      setQuizQuestions(parsedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setQuizScore(0);
      setIsQuizMode(true);
      setShowFeedback(false);
    } catch (error) {
      console.error('Quiz error:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleAnswerSelect = async (selectedOption) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correct = selectedOption === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setQuizScore(prev => prev + 1);
      setFeedbackMessage('Correct! Great job! 🎉');
    } else {
      // Request re-explanation for wrong answer
      try {
        const response = await axios.post(`${API_URL}/re-explain`, {
          concept: quizConcept,
          questionText: currentQuestion.question,
          userAnswer: selectedOption,
          correctAnswer: currentQuestion.correctAnswer
        });
        setFeedbackMessage(response.data.explanation);
      } catch (error) {
        console.error('Re-explanation error:', error);
        setFeedbackMessage(`That's not quite right. The correct answer is ${currentQuestion.correctAnswer}. ${currentQuestion.options[currentQuestion.correctAnswer]}`);
      }
    }
    
    setUserAnswers([...userAnswers, { questionId: currentQuestion.id, selected: selectedOption, correct }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
      setFeedbackMessage('');
    }
  };

  const handleFinishQuiz = () => {
    setShowFeedback(false);
    // Keep quiz mode on to show results
  };

  const handleExitQuiz = () => {
    setIsQuizMode(false);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizScore(0);
    setShowFeedback(false);
    setFeedbackMessage('');
  };

  return (
    <div className="dashboard-root">
      {/* Background Shapes */}
      <div className="dashboard-bg-shapes">
        {/* Soft circles */}
        <div className="shape-circle" style={{ top: '8%', left: '15%', width: '180px', height: '180px' }} />
        <div className="shape-circle" style={{ top: '60%', right: '12%', width: '140px', height: '140px' }} />
        <div className="shape-circle" style={{ bottom: '15%', left: '8%', width: '100px', height: '100px' }} />
        
        {/* Geometric lines */}
        <svg className="shape-line" style={{ top: '20%', left: '5%' }}>
          <path d="M 0 40 Q 60 10 120 40 T 240 40" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none"/>
        </svg>
        <svg className="shape-line" style={{ bottom: '25%', right: '8%' }}>
          <path d="M 0 30 L 80 30 L 80 80 L 150 80" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      {/* Top Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          {/* Logo */}
          <div className="nav-logo">
            <img src={logoImage} alt="Mimic" className="logo-image" />
            <span className="logo-text">Mimic</span>
          </div>

          {/* Desktop Nav Items */}
          <div className="nav-items">
            {navItems.map((item) => (
              <button key={item} className="nav-item">
                {item}
              </button>
            ))}
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => (
              <button key={item} className="mobile-nav-item">
                {item}
              </button>
            ))}
            <button className="mobile-nav-item logout-mobile" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        )}
      </nav>

      {/* Top Controls Bar */}
      <div className="top-controls">
        <div className="top-controls-content">
          {/* Left: Concept Input + Visualize Button */}
          <div className="concept-input-group">
            <input 
              type="text" 
              className="concept-input-main"
              placeholder="Type a concept (e.g., water cycle)"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVisualize()}
            />
            <button className="visualize-btn" onClick={handleVisualize}>
              Visualize
            </button>
          </div>

          {/* Right: Control Buttons */}
          <div className="playback-controls">
            {controls.map((control) => (
              <button
                key={control}
                className={`control-pill ${activeControl === control ? 'active' : ''}`}
                onClick={() => setActiveControl(control)}
              >
                {control}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Left Column - Simple Explanation */}
        <aside className="explanation-panel">
          <div className="card explanation-card">
            <div className="card-header-with-voice">
              <h2 className="card-title">Simple explanation</h2>
              <button className="voice-btn" onClick={handleVoiceRead} title="Read aloud">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>
            </div>
            <div className="explanation-content">
              <p>
                This is where we'll show a simple, easy-to-understand explanation of the concept you're exploring. 
                The language will be clear and friendly, breaking down complex ideas into digestible pieces.
              </p>
              <p>
                Each concept will be explained in a way that reduces cognitive load and helps you understand 
                step by step.
              </p>
            </div>
          </div>
        </aside>

        {/* Center Column - 3D Scene Playground */}
        <section className="scene-playground">
          <div className="card scene-card">
            <h3 className="scene-title">3D Scene</h3>
            <div className="scene-canvas">
              <div className="canvas-placeholder">
                <p>3D scene will render here</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column - Chat Panel */}
        <aside className="chat-panel">
          <div className="card chat-card">
            <h3 className="chat-title">{isQuizMode ? 'Quiz Time!' : 'Chat with Mimic'}</h3>
            
            {!isQuizMode ? (
              <>
                <div className="chat-messages-area" ref={chatMessagesRef}>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.type}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="chat-input-area">
                  <input 
                    type="text" 
                    className="chat-input-field"
                    placeholder="Ask something…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="send-btn" onClick={handleSendMessage}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>
                <button 
                  className="test-me-btn" 
                  onClick={handleStartQuiz}
                  disabled={isLoadingQuiz || !concept.trim()}
                >
                  {isLoadingQuiz ? 'Loading Quiz...' : '📝 Test Me!'}
                </button>
              </>
            ) : (
              <div className="quiz-container">
                {currentQuestionIndex < quizQuestions.length ? (
                  <>
                    <div className="quiz-progress">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </div>
                    
                    <div className="quiz-question">
                      <p className="question-text">
                        {quizQuestions[currentQuestionIndex].question}
                      </p>
                    </div>
                    
                    <div className="quiz-options">
                      {Object.entries(quizQuestions[currentQuestionIndex].options).map(([letter, text]) => (
                        <button
                          key={letter}
                          className="quiz-option-btn"
                          onClick={() => handleAnswerSelect(letter)}
                          disabled={showFeedback}
                        >
                          <span className="option-letter">{letter})</span>
                          <span className="option-text">{text}</span>
                        </button>
                      ))}
                    </div>
                    
                    {showFeedback && (
                      <div className={`feedback-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <p className="feedback-message">{feedbackMessage}</p>
                        {currentQuestionIndex < quizQuestions.length - 1 ? (
                          <button className="next-question-btn" onClick={handleNextQuestion}>
                            Next Question →
                          </button>
                        ) : (
                          <button className="finish-quiz-btn" onClick={handleFinishQuiz}>
                            See Results
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="quiz-results">
                    <h2 className="results-title">Quiz Complete! 🎉</h2>
                    <div className="score-display">
                      <span className="score-number">{quizScore}</span>
                      <span className="score-divider">/</span>
                      <span className="score-total">{quizQuestions.length}</span>
                    </div>
                    <p className="score-message">
                      {quizScore === quizQuestions.length 
                        ? 'Perfect score! You really understand this!' 
                        : quizScore >= quizQuestions.length / 2
                        ? 'Good job! You\'re getting it!'
                        : 'Keep practicing! You\'ll get there!'}
                    </p>
                    <button className="exit-quiz-btn" onClick={handleExitQuiz}>
                      Back to Chat
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
