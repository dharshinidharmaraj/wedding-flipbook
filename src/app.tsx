import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";
import { motion, Variants } from "framer-motion";

/**
 * Note: If using TypeScript, you might need to declare the module 
 * or use 'any' if the library types aren't explicitly installed.
 */

function App() {
  const book = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // 🎵 Music States
  const [showMusic, setShowMusic] = useState(false);
const [playerKey, setPlayerKey] = useState(0);
  const spotifyAssetId = "37i9dQZF1DX4H6y8vBnqXf";

  // Handle Responsive resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFlip = useCallback((e: any) => {
    setPage(e.data);
  }, []);
  // 📝 User Input States
  const [isSetup, setIsSetup] = useState(true);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");

  // ✅ Rainbow Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.5, delayChildren: 0.3, duration: 0.8 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0, filter: "blur(10px)", color: "#333" },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      color: ["#ff0000be", "#150f0a", "#8a8a57", "#d7a332", "#313134", "#5c482d", "#8b00ff", "#ff0000"],
      transition: { 
        y: { type: "spring", stiffness: 100 },
        color: { duration: 5, repeat: Infinity, ease: "linear" } 
      } 
    },
  };

  // Book Configuration
  const bookOptions = {
    width: 550, 
    height: 733,
    size: "stretch" as const,
    minWidth: 315,
    maxWidth: 1000,
    minHeight: 400,
    maxHeight: 1200,
    showCover: true,
    usePortrait: false, // Set to false to prevent single-page switching
    flippingTime: 800,
    // Use 'as any' to force landscape and double display
    mode: "landscape" as any,
    display: "double" as any,
  };

  const albumPhotos = [
    "/cover.jpg",
    "/photos/1.jpg",
    "/photos/2.jpg",
    "/photos/3.jpg",
    "/photos/4.jpg",
    "/photos/5.jpg",
  ];
  
  //setup page for user input
  if (isSetup) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'serif' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#2a2a2a', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '90%', maxWidth: '400px' }}>
          <h2 style={{ color: '#D4AF37', marginBottom: '20px' }}>Personalize Your Album</h2>
          <input type="text" placeholder="Groom's Name" value={groomName} onChange={(e) => setGroomName(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }} />
          <input type="text" placeholder="Bride's Name" value={brideName} onChange={(e) => setBrideName(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }} />
          <button 
            disabled={!brideName || !groomName}
            onClick={() => setIsSetup(false)}
            style={{ width: '100%', padding: '15px', borderRadius: '30px', border: 'none', backgroundColor: '#D4AF37', color: '#1a1a1a', fontWeight: 'bold', cursor: 'pointer', opacity: (!brideName || !groomName) ? 0.5 : 1 }}
          >
            Start Flipping!
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ textAlign: 'center', backgroundColor: '#1a1a1a', minHeight: '100vh', padding: '20px' }}>
      
      {/* --- 1. SPOTIFY WIDGET --- */}
      <div className={`spotify-widget ${showMusic ? "active" : ""}`} style={{ marginBottom: '20px' }}>
        <button 
          className="music-toggle" 
          onClick={() => {
  if (showMusic) {
    setShowMusic(false);
    setPlayerKey(prev => prev + 1); // 🔥 force reset
  } else {
    setShowMusic(true);
  }
}}
          style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '20px', border: 'none', background: '#1DB954', color: 'white', fontWeight: 'bold' }}
        >
          {showMusic ? "✖ Close Music" : "🎵 Play Music"}
        </button>
        
        {showMusic && (
          <div className="player-container" style={{ marginTop: '15px', maxWidth: '400px', margin: '15px auto' }}>
            <iframe
              key={playerKey}
              src={`https://open.spotify.com/embed/playlist/${spotifyAssetId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: '12px' }}
            ></iframe>
          </div>
        )}
      </div>

      {/* --- 2. ALBUM SECTION --- */}
      <div className="album-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', overflowX: 'auto', padding: '20px 0' }}>
       <div style={{ width: '1100px', minWidth: '1100px' }}></div>
        <HTMLPageFlip
          {...bookOptions as any}
          className="wedding-book"
          onFlip={onFlip}
          ref={book}
          style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          useMouseEvents={true}
          clickEventForward={true}
          showPageCorners={true}
          mobileScrollSupport={true}
        >
        {/* --- 💍 PREMIUM ROYAL COVER PAGE --- */}
<div className="page page-cover" data-density="hard" style={{ backgroundColor: '#050505' }}>
  <div className="page-content" style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
    
    {/* Cinematic Background: Desaturated and dark to let the gold pop */}
    <img 
      src={albumPhotos[0]} 
      alt="Cover" 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover', 
        opacity: 0.18, 
        filter: 'grayscale(100%) contrast(120%)' 
      }} 
    />
    
    {/* Professional Vignette: Focuses light in the center where the names are */}
    <div style={{ 
      position: 'absolute', 
      inset: 0, 
      background: 'radial-gradient(circle, rgba(193, 185, 185, 0) 0%, rgba(240, 235, 235, 0.95) 90%)', 
      pointerEvents: 'none' 
    }} />

    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      style={{ 
        position: 'absolute', 
        top: 0, left: 0, width: '100%', height: '100%', 
        display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center', 
        zIndex: 10 
      }}
    >
      {/* Decorative Gold Header Line */}
      <motion.div 
        variants={itemVariants} 
        style={{ 
          width: '60px', height: '1px', 
          background: 'linear-gradient(90deg, transparent, #17150b, transparent)', 
          marginBottom: '40px' 
        }} 
      />

      {/* Groom Name: Metallic Champagne Gold */}
      <motion.h1 
  variants={itemVariants} 
  style={{ 
    fontSize: isMobile ? '2.8rem' : '4.5rem', 
    margin: 0, 
    fontFamily: "'Playfair Display', serif", 
    fontWeight: 400,
    color: '#F5F5F5', // 👈 clean ivory white
    letterSpacing: '2px',
    textShadow: '0 4px 12px rgba(207, 38, 46, 0.6)'
  }}
  animate={{ opacity: [0, 1], y: [30, 0] }}
  transition={{ duration: 1.2, ease: "easeOut" }}
>
  {groomName}
</motion.h1>
        
      {/* Elegant Ampersand: Champagne Ivory */}
      <motion.p 
        variants={itemVariants} 
        style={{ 
          fontSize: '2.2rem', 
          color: '#F4E4BA', 
          fontStyle: 'italic', 
          margin: '15px 0',
          fontFamily: "'Playfair Display', serif",
          opacity: 0.8
        }}
      >
        &
      </motion.p>
      
      {/* Bride Name: Metallic Champagne Gold */}
     <motion.h1 
  variants={itemVariants} 
  style={{ 
    fontSize: isMobile ? '2.8rem' : '4.5rem', 
    margin: 0, 
    fontFamily: "'Playfair Display', serif", 
    fontWeight: 400,
    color: '#151313',
    letterSpacing: '2px',
    textShadow: '0 4px 12px rgba(222, 26, 49, 0.6)'
  }}
  animate={{ opacity: [0, 1], y: [30, 0] }}
  transition={{ duration: 1.4, ease: "easeOut" }}
>
  {brideName}
</motion.h1>

      {/* Refined Tagline: Thin Gold Spaced Text */}
    <motion.p 
  style={{ 
    fontSize: '2rem', 
    color: '#cdc7b2', // 👈 gold ONLY here (accent)
    margin: '10px 0',
    opacity: 0.9,
    fontFamily: "'Playfair Display', serif",
  }}
  animate={{ opacity: [0, 1], scale: [0.8, 1] }}
  transition={{ duration: 1, delay: 0.5 }}
>
  
</motion.p>
        Our Forever Begins
      </motion.div>

      {/* Animated Subtle Gleam */}
      <motion.div 
        animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ marginTop: '30px', fontSize: '1.5rem', color: '#cc3030', filter: 'blur(0.5px)' }}
      >
        ✧
      </motion.div>
      
    
  </div>
</div>
          {/* Internal Photo Pages */}
          {albumPhotos.slice(1).map((url, index) => (
            <div className="page" key={index} data-density="soft" style={{ backgroundColor: '#aa1e1e' }}>
              <div className="page-content">
                <img src={url} alt={`Photo ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}

          {/* Back Cover */}
          <div className="page page-back" data-density="hard" style={{ backgroundColor: '#c61e1e' }}>
            <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div className="end-content">
                <h3>The End</h3>
                <p>To be continued...</p>
              </div>
            </div>
          </div>
        </HTMLPageFlip>
      </div>

      {/* --- 3. CONTROLS SECTION --- */}
      <div className="controls" style={{ marginTop: '30px' }}>
        <div className="nav-controls" style={{ marginBottom: '10px' }}>
          <button 
            style={{ fontSize: '24px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} 
            onClick={() => book.current?.pageFlip()?.flipPrev()}
          >
            ⬅
          </button>
          <span style={{ color: 'white', margin: '0 20px', fontSize: '18px' }}>
            {page + 1} / {albumPhotos.length + 1}
          </span>
          <button 
            style={{ fontSize: '24px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} 
            onClick={() => book.current?.pageFlip()?.flipNext()}
          >
            ➡
          </button>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max={albumPhotos.length + 1}
            value={page}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              book.current?.pageFlip()?.flip(val);
            }}
            style={{ width: '300px', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;