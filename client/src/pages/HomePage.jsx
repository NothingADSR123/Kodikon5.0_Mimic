import React, { useEffect, useRef, useState } from 'react';
import backgroundImage from '../assets/background.png';
import logoImage from '../assets/logo.png';

export default function LandingPage() {
  // Color palette with #A7C7E7 base
  const LIGHT_BLUE = '#A7C7E7';
  const MEDIUM_BLUE = '#7AA7C9';
  const BLUE_BUTTON = '#5E92B0';
  const DARK_TEXT = '#2C3E50';
  const LIGHT_TEXT = '#5A6C7D';

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const howRef = useRef(null);
  const contactRef = useRef(null);
  const loginRef = useRef(null);

  const [form, setForm] = useState({ id: '', password: '' });
  const [focus, setFocus] = useState(null);
  const [isWide, setIsWide] = useState(typeof window !== 'undefined' ? window.innerWidth >= 900 : true);

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 900);
    window.addEventListener('resize', onResize);
    onResize();
    document.documentElement.style.scrollBehavior = 'smooth';
    // Remove white bars
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    return () => {
      window.removeEventListener('resize', onResize);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const scrollTo = (ref) => { if (ref?.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); console.log('login', form); };

  const styles = {
    root: { 
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 
      color: DARK_TEXT, 
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: 0,
      width: '100%',
      minHeight: '100vh'
    },
    nav: { 
      position: 'sticky', 
      top: 0, 
      zIndex: 60, 
      background: `rgba(167, 199, 231, 0.85)`, 
      backdropFilter: 'blur(10px)', 
      borderBottom: 'none',
      padding: '12px 0',
      width: '100%'
    },
    navInner: { 
      width: '100%',
      margin: '0', 
      padding: isWide ? '0 60px' : '0 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxSizing: 'border-box' 
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    },
    logoImage: {
      width: isWide ? 40 : 32,
      height: isWide ? 40 : 32,
      objectFit: 'contain'
    },
    logo: { 
      fontFamily: '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSize: isWide ? 32 : 24, 
      fontWeight: 700, 
      color: DARK_TEXT,
      letterSpacing: '-0.5px' 
    },
    navLinks: { 
      display: 'flex', 
      gap: isWide ? 32 : 16, 
      alignItems: 'center',
      flexWrap: 'wrap' 
    },
    navBtn: { 
      background: 'transparent', 
      border: 'none', 
      cursor: 'pointer', 
      color: DARK_TEXT, 
      fontSize: isWide ? 17 : 15,
      fontWeight: 500,
      transition: 'opacity 0.2s',
      opacity: 0.9
    },
    signUp: { 
      padding: isWide ? '11px 26px' : '9px 20px', 
      borderRadius: 25, 
      background: '#fff', 
      color: DARK_TEXT, 
      border: 'none', 
      cursor: 'pointer',
      fontSize: isWide ? 17 : 15,
      fontWeight: 600,
      transition: 'all 0.2s',
      boxShadow: '0 3px 10px rgba(0,0,0,0.12)'
    },

    hero: { 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      background: `url(${backgroundImage}) center/cover no-repeat, linear-gradient(180deg, #B8D5E8 0%, #A7C7E7 50%, #9BC2E3 100%)`, 
      position: 'relative', 
      overflow: 'hidden',
      width: '100%',
      margin: 0,
      padding: 0
    },
    heroInner: { 
      width: '100%',
      margin: '0', 
      padding: isWide ? '100px 60px 60px' : '60px 20px 40px', 
      display: 'flex', 
      gap: isWide ? 80 : 40, 
      alignItems: 'center', 
      flexDirection: isWide ? 'row' : 'column',
      position: 'relative',
      zIndex: 80,
      boxSizing: 'border-box'
    },
    left: { 
      flex: 1, 
      minWidth: isWide ? 350 : 280 
    },
    title: { 
      fontSize: isWide ? 'clamp(96px, 11vw, 140px)' : 'clamp(64px, 16vw, 96px)', 
      margin: 0, 
      color: DARK_TEXT, 
      fontWeight: 900,
      letterSpacing: '0.02em',
      lineHeight: 1,
      fontFamily: '"Poppins", sans-serif',
      textTransform: 'none',
      animation: 'fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
    
    },
    subtitle: { 
      marginTop: 32, 
      color: DARK_TEXT, 
      fontSize: isWide ? 24 : 19,
      fontWeight: 400,
      lineHeight: 1.5,
      maxWidth: 580
    },

    rightWrap: { 
      width: isWide ? 460 : '100%', 
      display: 'flex', 
      justifyContent: isWide ? 'flex-end' : 'center',
      flexShrink: 0 
    },
    card: { 
      width: isWide ? 440 : '100%', 
      maxWidth: 440,
      background: 'rgba(255, 255, 255, 0.15)', 
      borderRadius: 28, 
      padding: isWide ? 40 : 32, 
      boxShadow: '0 25px 70px rgba(30, 58, 82, 0.18)',
      backdropFilter: 'blur(20px)',
      boxSizing: 'border-box',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    cardTitle: { 
      fontSize: isWide ? 26 : 22, 
      fontWeight: 600, 
      marginBottom: 28,
      color: DARK_TEXT,
      textAlign: 'left',
      lineHeight: 1.3
    },
    inputWrapper: {
      marginBottom: 22,
      width: '100%'
    },
    inputLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10,
      fontSize: 15,
      color: LIGHT_TEXT,
      fontWeight: 500
    },
    inputIcon: {
      fontSize: 19,
      opacity: 0.7
    },
    input: (n) => ({ 
      width: '100%', 
      padding: '15px 18px', 
      borderRadius: 14, 
      border: '1px solid rgba(74, 95, 115, 0.25)', 
      outline: 'none', 
      boxShadow: focus === n ? '0 0 0 3px rgba(94, 146, 176, 0.12)' : 'none',
      transition: 'all 0.2s',
      fontSize: 16,
      backgroundColor: '#fff',
      color: DARK_TEXT,
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    }),
    submit: { 
      width: '100%', 
      marginTop: 12, 
      padding: '16px 18px', 
      borderRadius: 14, 
      border: 'none', 
      background: BLUE_BUTTON, 
      color: '#fff', 
      fontWeight: 600, 
      cursor: 'pointer',
      fontSize: 17,
      transition: 'all 0.2s',
      boxShadow: '0 6px 16px rgba(94, 146, 176, 0.35)',
      boxSizing: 'border-box'
    },
    signupLink: {
      marginTop: 22,
      textAlign: 'center',
      fontSize: 15,
      color: LIGHT_TEXT
    },
    linkButton: {
      background: 'transparent',
      border: 'none',
      color: DARK_TEXT,
      cursor: 'pointer',
      textDecoration: 'underline',
      fontWeight: 600,
      fontSize: 15
    },

    // 3D shapes for background
    shapes: { 
      position: 'absolute', 
      inset: 0, 
      pointerEvents: 'none',
      overflow: 'hidden'
    },
    shape: (s) => ({ 
      position: 'absolute', 
      ...s 
    }),

    // Footer section
    footer: {
      background: `linear-gradient(180deg, #E8F4F8 0%, #D4E8F0 100%)`,
      padding: isWide ? '80px 60px 60px' : '60px 20px 50px',
      width: '100%',
      margin: 0,
      boxSizing: 'border-box'
    },
    aboutSection: {
      width: '100%',
      maxWidth: 1200,
      margin: '0 auto',
      boxSizing: 'border-box'
    },
    aboutTitle: {
      fontSize: isWide ? 42 : 32,
      fontWeight: 700,
      margin: '0 0 16px 0',
      color: DARK_TEXT,
      textAlign: 'center',
      fontFamily: '"Poppins", system-ui, sans-serif'
    },
    aboutSubtitle: {
      fontSize: isWide ? 18 : 16,
      color: LIGHT_TEXT,
      textAlign: 'center',
      margin: '0 auto 50px',
      maxWidth: 600,
      lineHeight: 1.6
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: isWide ? 'repeat(3, 1fr)' : '1fr',
      gap: isWide ? 32 : 24,
      marginBottom: 60
    },
    featureCard: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      borderRadius: 24,
      padding: isWide ? 40 : 32,
      boxShadow: '0 8px 32px rgba(167, 199, 231, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default',
      boxSizing: 'border-box'
    },
    featureCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 48px rgba(167, 199, 231, 0.35)'
    },
    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 16,
      background: `linear-gradient(135deg, ${LIGHT_BLUE} 0%, ${MEDIUM_BLUE} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      boxShadow: '0 4px 16px rgba(167, 199, 231, 0.3)'
    },
    featureTitle: {
      fontSize: isWide ? 22 : 20,
      fontWeight: 700,
      color: DARK_TEXT,
      marginBottom: 12,
      fontFamily: '"Poppins", system-ui, sans-serif'
    },
    featureText: {
      fontSize: 15,
      color: LIGHT_TEXT,
      lineHeight: 1.7,
      margin: 0
    },
    footerBottom: {
      width: '100%',
      maxWidth: 1200,
      margin: '0 auto',
      padding: isWide ? '32px 0 0' : '28px 0 0',
      borderTop: `1px solid ${LIGHT_BLUE}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 20,
      boxSizing: 'border-box'
    },
    copyright: {
      fontSize: 14,
      color: LIGHT_TEXT,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    footerLinks: {
      display: 'flex',
      gap: 24,
      fontSize: 14
    },
    footerLink: {
      background: 'transparent',
      border: 'none',
      color: LIGHT_TEXT,
      cursor: 'pointer',
      transition: 'color 0.2s',
      fontSize: 14,
      fontWeight: 500
    }
  };

  return (
    <div style={styles.root}>
      {/* Navigation */}
      <header style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logoContainer}>
            <img src={logoImage} alt="Mimic Logo" style={styles.logoImage} />
            <div style={styles.logo}>Mimic</div>
          </div>
          <nav style={styles.navLinks} aria-label="Primary navigation">
            <button style={styles.navBtn} onClick={() => scrollTo(homeRef)}>Home</button>
            <button style={styles.navBtn} onClick={() => scrollTo(aboutRef)}>About</button>
            <button style={styles.navBtn} onClick={() => scrollTo(howRef)}>How it works</button>
            <button style={styles.navBtn} onClick={() => scrollTo(contactRef)}>Contact</button>
            <button style={styles.signUp} onClick={() => scrollTo(loginRef)}>Sign Up</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main ref={homeRef} style={styles.hero} role="main">
        {/* 3D Background Shapes */}
        <div style={styles.shapes} aria-hidden="true">
          {/* Circuit board style lines - top left */}
          <svg style={{position: 'absolute', top: 0, left: 0, width: '300px', height: '200px', opacity: 0.4}}>
            <path d="M 30 20 L 120 20 L 120 80 L 200 80" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
            <path d="M 60 60 L 180 60" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none"/>
            <circle cx="30" cy="20" r="6" fill="rgba(255,255,255,0.8)"/>
            <circle cx="120" cy="20" r="6" fill="rgba(255,255,255,0.7)"/>
            <circle cx="120" cy="80" r="6" fill="rgba(255,255,255,0.7)"/>
            <circle cx="200" cy="80" r="5" fill="rgba(255,255,255,0.6)"/>
          </svg>

          {/* Circuit board style lines - top right */}
          <svg style={{position: 'absolute', top: '10%', right: 0, width: '400px', height: '250px', opacity: 0.4}}>
            <path d="M 350 30 L 250 30 L 250 100 L 150 100 L 150 180" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
            <path d="M 300 150 L 180 150" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none"/>
            <circle cx="350" cy="30" r="6" fill="rgba(255,255,255,0.8)"/>
            <circle cx="250" cy="30" r="6" fill="rgba(255,255,255,0.7)"/>
            <circle cx="250" cy="100" r="5" fill="rgba(255,255,255,0.6)"/>
            <circle cx="150" cy="180" r="6" fill="rgba(255,255,255,0.7)"/>
          </svg>

          {/* Circuit board style lines - bottom left */}
          <svg style={{position: 'absolute', bottom: '15%', left: 0, width: '250px', height: '200px', opacity: 0.4}}>
            <path d="M 30 150 L 30 80 L 120 80 L 120 30" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
            <circle cx="30" cy="150" r="6" fill="rgba(255,255,255,0.8)"/>
            <circle cx="30" cy="80" r="5" fill="rgba(255,255,255,0.6)"/>
            <circle cx="120" cy="80" r="6" fill="rgba(255,255,255,0.7)"/>
          </svg>

          {/* Circuit board style lines - bottom right */}
          <svg style={{position: 'absolute', bottom: 0, right: '10%', width: '350px', height: '180px', opacity: 0.4}}>
            <path d="M 300 150 L 200 150 L 200 80 L 100 80" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
            <circle cx="300" cy="150" r="6" fill="rgba(255,255,255,0.8)"/>
            <circle cx="200" cy="150" r="5" fill="rgba(255,255,255,0.6)"/>
            <circle cx="200" cy="80" r="6" fill="rgba(255,255,255,0.7)"/>
          </svg>

          {/* 3D Cube - bottom left */}
          <svg style={{position: 'absolute', bottom: '100px', left: '80px', width: '150px', height: '150px', opacity: 0.3}}>
            <defs>
              <linearGradient id="cubeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.4)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <path d="M 50 30 L 100 50 L 100 100 L 50 80 Z" fill="url(#cubeGrad1)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            <path d="M 50 30 L 100 50 L 50 70 L 0 50 Z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            <path d="M 50 80 L 0 60 L 0 50 L 50 70 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
          </svg>

          {/* Large circle - top right */}
          <div style={styles.shape({ 
            top: '15%', 
            right: '8%', 
            width: 220, 
            height: 220, 
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          })} />

          {/* Medium circle - bottom center */}
          <div style={styles.shape({ 
            bottom: '20%', 
            left: '50%', 
            transform: 'translateX(-50%)',
            width: 180, 
            height: 180, 
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '2px solid rgba(255, 255, 255, 0.18)'
          })} />

          {/* Small accent dots scattered */}
          <div style={styles.shape({ top: '18%', left: '12%', width: 10, height: 10, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.5)' })} />
          <div style={styles.shape({ top: '65%', left: '15%', width: 8, height: 8, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' })} />
          <div style={styles.shape({ top: '45%', right: '18%', width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.45)' })} />
          <div style={styles.shape({ bottom: '35%', right: '12%', width: 9, height: 9, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' })} />
          <div style={styles.shape({ top: '30%', left: '25%', width: 7, height: 7, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.35)' })} />
          <div style={styles.shape({ bottom: '50%', right: '30%', width: 8, height: 8, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' })} />
        </div>

        <div style={styles.heroInner}>
          {/* Left Content */}
          <section style={styles.left} aria-labelledby="hero-title">
            <h1 id="hero-title" style={styles.title}>Mimic</h1>
            <p style={styles.subtitle}>
              Visualize ideas in calming 3D scenes<br />
              built for neurodivergent thinkers.
            </p>
            <button 
              style={{ 
                marginTop: 28, 
                padding: '12px 28px', 
                borderRadius: 24, 
                border: 'none', 
                background: 'rgba(255, 255, 255, 0.9)', 
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 600,
                color: DARK_TEXT,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }} 
              onClick={() => scrollTo(aboutRef)}
            >
              Learn more
            </button>
          </section>

          {/* Right Login Card */}
          <aside style={styles.rightWrap} aria-labelledby="login-heading">
            <form ref={loginRef} onSubmit={handleSubmit} style={styles.card} aria-label="Login form">
              <h2 id="login-heading" style={styles.cardTitle}>Login to your space</h2>

              <div style={styles.inputWrapper}>
                <label htmlFor="id" style={styles.inputLabel}>
                  <span style={styles.inputIcon}>✉</span>
                  <span>Email or Username</span>
                </label>
                <input 
                  id="id" 
                  name="id" 
                  value={form.id} 
                  onChange={handleChange} 
                  onFocus={() => setFocus('id')} 
                  onBlur={() => setFocus(null)} 
                  style={styles.input('id')} 
                  required 
                  placeholder="Enter your email"
                />
              </div>

              <div style={styles.inputWrapper}>
                <label htmlFor="password" style={styles.inputLabel}>
                  <span style={styles.inputIcon}>🔒</span>
                  <span>Password</span>
                </label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  onFocus={() => setFocus('password')} 
                  onBlur={() => setFocus(null)} 
                  style={styles.input('password')} 
                  required 
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" style={styles.submit}>Login</button>

              <div style={styles.signupLink}>
                Don't have an account? <button type="button" style={styles.linkButton} onClick={() => scrollTo(aboutRef)}>Sign up</button>
              </div>
            </form>
          </aside>
        </div>
      </main>

      {/* About Section */}
      <footer ref={aboutRef} style={styles.footer}>
        <div style={styles.aboutSection}>
          <h2 style={styles.aboutTitle}>About Mimic</h2>
          <p style={styles.aboutSubtitle}>
Mimic is a visual AI copilot designed to help neurodivergent minds understand complex ideas with ease.
It transforms messy thoughts, long texts, and abstract concepts into calm, interactive 3D visuals that reduce cognitive load and enhance clarity.
With adaptive modes and guided explanations, Mimic makes thinking simpler, smoother, and more intuitive for every user.          </p>

          <div style={styles.featureGrid}>
            {/* Feature Card 1 */}
            <div 
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(167, 199, 231, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(167, 199, 231, 0.2)';
              }}
            >
              <div style={styles.iconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Visual Thinking Support</h3>
              <p style={styles.featureText}>
                Transform abstract concepts into spatial 3D representations that align with how your mind naturally organizes information.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div 
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(167, 199, 231, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(167, 199, 231, 0.2)';
              }}
            >
              <div style={styles.iconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m0-6h6m-6 0H6"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Cognitive Load Reduction</h3>
              <p style={styles.featureText}>
                Calming color palettes and intuitive interactions minimize sensory overload while maximizing focus and clarity.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div 
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(167, 199, 231, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(167, 199, 231, 0.2)';
              }}
            >
              <div style={styles.iconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Real-time 3D Scene Generation</h3>
              <p style={styles.featureText}>
                Watch your ideas come to life instantly as interactive 3D environments that you can explore and manipulate.
              </p>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <div style={styles.copyright}>
            <span>2025 Mimic</span>
          </div>
          <div style={styles.footerLinks}>
            <button style={styles.footerLink}>Terms</button>
            <button style={styles.footerLink}>Privacy</button>
            <button style={styles.footerLink}>Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
