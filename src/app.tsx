import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";
import { motion, Variants } from "framer-motion";

function App() {
  const book = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // 🎵 Music States
  const [showMusic, setShowMusic] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
  const spotifyAssetId = "37i9dQZF1DX4H6y8vBnqXf";

  // 📝 User Input States
  const [isSetup, setIsSetup] = useState(true);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [activeIndex, setActiveIndex] = useState(20); // any default tile

  // Handle Responsive resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFlip = useCallback((e: any) => {
    setPage(e.data);
  }, []);

  // ✅ Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
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
    flippingTime: 1000,
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
  
  // 1. Setup screen
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
    <div className="app-container" style={{ textAlign: 'center', backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      
      {/* --- 1. SPOTIFY WIDGET --- */}
      <div className="spotify-widget" style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => showMusic ? (setShowMusic(false), setPlayerKey(k => k + 1)) : setShowMusic(true)}
          style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '20px', border: 'none', background: '#1DB954', color: 'white', fontWeight: 'bold' }}
        >
          {showMusic ? "✖ Close Music" : "🎵 Play Music"}
        </button>
        
        {showMusic && (
          <div style={{ marginTop: '15px', maxWidth: '400px', margin: '15px auto' }}>
            <iframe
              key={playerKey}
              src={`https://open.spotify.com/embed/playlist/${spotifyAssetId}?utm_source=generator&theme=0`}
              width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style={{ borderRadius: '12px' }}
            ></iframe>
          </div>
        )}
      </div>

      {/* --- 2. ALBUM SECTION --- */}
      <div className="album-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '40px 0' }}>
        <HTMLPageFlip
          {...bookOptions as any}
          className="wedding-book"
          onFlip={onFlip}
          ref={book}
          style={{ boxShadow: '0 0 50px rgba(0,0,0,0.8)' }}
          useMouseEvents={true}
        >
          {/* --- 💍 PAGE 1: SILHOUETTE MOSAIC COVER --- */}
          <div className="page page-cover" data-density="hard" style={{ backgroundColor: '#000' }}>
            <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
              
           {/* Mosaic Background */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    width: "100%",
    height: "100%",
    position: "absolute",
  }}
>
  {Array.from({ length: 64 }).map((_, i) => {
    const isActive = i === activeIndex;

    return (
      <motion.div
        key={i}
        onClick={() => {
          if (isActive) {
            // ✅ ONLY active tile flips
            book.current?.pageFlip()?.flipNext();
          } else {
            // 👉 clicking others just changes focus
            setActiveIndex(i);
          }
        }}
        whileHover={{
          scale: isActive ? 1.15 : 1.05,
          filter: isActive
            ? "grayscale(0%) brightness(1.2)"
            : "grayscale(50%)",
        }}
        animate={{
          scale: isActive ? 1.2 : 1,
          filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
          zIndex: isActive ? 20 : 1,
        }}
        style={{
          backgroundImage: `url(${albumPhotos[i % albumPhotos.length]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: isActive
            ? "2px solid #D4AF37"
            : "0.5px solid rgba(255,255,255,0.1)",
          cursor: "pointer",
          position: "relative",
        }}
      />
    );
  })}
</div>
              {/* Silhouette Mask (Replace URL with your actual file) */}
              <div style={{ 
                position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                backgroundImage: `url('/silhouette-overlay.png')`, backgroundSize: 'cover'
              }} />

              {/* Names Overlay */}
              <motion.div 
                variants={containerVariants} initial="hidden" animate="visible"
                style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}
              >
                <motion.h1 variants={itemVariants} style={{ fontSize: isMobile ? '2.5rem' : '4rem', color: '#D4AF37', fontFamily: 'serif', margin: 0, textShadow: '2px 2px 10px #000' }}>
                  {groomName}
                </motion.h1>
                <motion.span variants={itemVariants} style={{ color: '#fff', fontSize: '1.5rem', fontStyle: 'italic' }}>&</motion.span>
                <motion.h1 variants={itemVariants} style={{ fontSize: isMobile ? '2.5rem' : '4rem', color: '#D4AF37', fontFamily: 'serif', margin: 0, textShadow: '2px 2px 10px #000' }}>
                  {brideName}
                </motion.h1>
                <motion.p variants={itemVariants} style={{ color: '#fff', letterSpacing: '3px', marginTop: '20px', opacity: 0.8 }}>
                  OUR FOREVER BEGINS
                </motion.p>
              </motion.div>
            </div>
          </div>

          {/* --- INTERNAL PAGES --- */}
          {albumPhotos.slice(1).map((url, index) => (
            <div className="page" key={index} data-density="soft">
              <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a' }}>
                <img src={url} alt={`Photo ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
{/* --- BACK COVER --- */}
<div className="page page-back" data-density="hard" style={{ backgroundColor: '#fff' }}>
  <div style={{ 
    position: 'relative', 
    height: '100%', 
    width: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    overflow: 'hidden',
    padding: '40px 20px'
  }}>
    


    {/* 3. Text Section */}
    <div style={{ 
      marginTop: 'auto', 
      textAlign: 'center', 
      zIndex: 6, 
      color: '#0b0808',
      fontFamily: 'serif'
    }}>
     
   
      
      <p style={{ 
        fontSize: '0.9rem', 
        letterSpacing: '3px', 
        marginTop: '300px',
        color: '#666'
      }}>
        TOGETHER FOREVER!
      </p>
      <h3 style={{ 
        fontStyle: 'italic', 
        color: '#D4AF37', 
        marginTop: '100px',
        fontSize: '1.5rem'
      }}>
        To be continued...
      </h3>
    </div>

  </div>
</div>
</HTMLPageFlip>

      {/* --- 3. CONTROLS --- */}
      <div className="controls" style={{ marginTop: '20px' }}>
        <button onClick={() => book.current?.pageFlip()?.flipPrev()} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>⬅</button>
        <span style={{ color: 'white', margin: '0 20px' }}>{page + 1} / {albumPhotos.length + 1}</span>
        <button onClick={() => book.current?.pageFlip()?.flipNext()} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>➡</button>
      </div>
    </div>
    </div>
  );
}

export default App;