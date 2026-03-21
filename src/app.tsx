import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";
import { motion } from "framer-motion";


const MotionDiv: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return <motion.div {...props}>{props.children}</motion.div>;
};

function App() {
  const book = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [isSetup, setIsSetup] = useState(true);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [useLocalAudio, setUseLocalAudio] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const spotifyAssetId = "37i9dQZF1DX4H6y8vBnqXf";
  const localAudioSrc = "/music/song.mp3";

  const albumPhotos = [
    "/cover.jpg",
    "/photos/1.jpg",
    "/photos/2.jpg",
    "/photos/3.jpg",
    "/photos/4.jpg",
    "/photos/5.jpg",
  ];

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isSetup) {
    return (
      <div style={centerScreen}>
        <div style={setupCard}>
          <h2 style={{ color: "#FFD700", marginBottom: "20px" }}>Personalize Your Album</h2>
          <input placeholder="Groom Name" value={groomName} onChange={(e) => setGroomName(e.target.value)} style={inputStyle} />
          <input placeholder="Bride Name" value={brideName} onChange={(e) => setBrideName(e.target.value)} style={inputStyle} />
          <button
            onClick={() => setIsSetup(false)}
            disabled={!brideName || !groomName}
            style={{ ...buttonStyle, marginTop: "20px", opacity: (!brideName || !groomName) ? 0.5 : 1 }}
          >
            Enter Album
          </button>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <MotionDiv
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, delay: 2 }}
        onAnimationComplete={() => setShowIntro(false)}
        style={centerScreen}
      >
        <h1 style={titleStyle}>{groomName} & {brideName}</h1>
      </MotionDiv>
    );
  }

  const toggleAudio = () => {
    if (useLocalAudio) {
      if (!audioPlaying) {
        audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
        setAudioPlaying(true);
      } else {
        audioRef.current?.pause();
        setAudioPlaying(false);
      }
    } else {
      setShowSpotify(!showSpotify);
    }
  };

  const zoomAnimation = zoomEnabled
    ? { scale: [1, 1.1, 1], transition: { duration: 8, repeat: Infinity, repeatType: "loop", ease: "easeInOut" } }
    : { scale: 1 };

  return (
    <div style={{ background: "#000", width: "100vw", height: "100vh", position: "fixed", overflow: "hidden" }}>
      
      {/* UI Buttons */}
      <div style={uiOverlayStyle}>
        <button onClick={toggleAudio} style={pillButton}>
          {useLocalAudio ? (audioPlaying ? "Stop Music" : "Play Music") : "Spotify"}
        </button>
        <button onClick={() => setUseLocalAudio(!useLocalAudio)} style={{ ...pillButton, background: "#64FFDA" }}>
          Switch Source
        </button>
        <button onClick={() => setZoomEnabled(!zoomEnabled)} style={{ ...pillButton, background: zoomEnabled ? "#FFD700" : "#64FFDA" }}>
          {zoomEnabled ? "Stop Zoom" : "Zoom Photos"}
        </button>
      </div>

      <button onClick={() => book.current?.pageFlip()?.flipPrev()} style={navBtnLeft}>❮</button>
      <button onClick={() => book.current?.pageFlip()?.flipNext()} style={navBtnRight}>❯</button>

      {useLocalAudio && <audio ref={audioRef} src={localAudioSrc} loop />}

      {/* Fullscreen Flipbook */}
      <div style={fullscreenWrapper}>
        <HTMLPageFlip
          width={dimensions.width}
          height={dimensions.height}
          size="stretch"
          minWidth={dimensions.width}
          maxWidth={dimensions.width}
          minHeight={dimensions.height}
          maxHeight={dimensions.height}
          showCover={true}
          useMouseEvents={true}
          flippingTime={1000}
          ref={book}
        >
          {/* COVER GRID */}
          <div className="page" style={fullPage}>
            <MotionDiv variants={containerVariants} initial="hidden" animate="visible" style={gridStyle}>
              {Array.from({ length: 64 }).map((_, i) => (
                <MotionDiv
                  key={i}
                  variants={itemVariants}
                  animate={zoomAnimation}
                  style={{ backgroundImage: `url(${albumPhotos[i % albumPhotos.length]})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </MotionDiv>
            <div style={titleOverlay}>
              <h1 style={titleStyle}>{groomName} & {brideName}</h1>
            </div>
          </div>

          {/* PHOTO PAGES */}
          {albumPhotos.slice(1).map((url, i) => (
            <div key={i} className="page" style={fullPage}>
              <motion.img src={url} alt="" style={fullImage} animate={zoomAnimation} />
            </div>
          ))}

          {/* FINAL PAGE */}
          <div className="page" style={endPageStyle}>
            <h2 style={{ color: "#FFD700", fontSize: "3rem" }}>Forever</h2>
            <button onClick={() => book.current?.pageFlip()?.flip(0)} style={buttonStyle}>Replay</button>
          </div>
        </HTMLPageFlip>
      </div>
    </div>
  );
}

// ============================
// STYLES
// ============================
const fullscreenWrapper: React.CSSProperties = { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 };
const fullPage: React.CSSProperties = { width: "100%", height: "100%", overflow: "hidden", position: "relative", backgroundColor: "#0A192F" };
const fullImage: React.CSSProperties = { width: "100%", height: "100%", objectFit: "contain", display: "block" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(8, 1fr)", height: "100%", width: "100%" };
const uiOverlayStyle: React.CSSProperties = { position: "absolute", top: "30px", left: "30px", zIndex: 100, display: "flex", gap: "10px" };
const titleOverlay: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.3)", pointerEvents: "none" };
const navBtn: React.CSSProperties = { position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 100, background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "20px", cursor: "pointer", fontSize: "2rem", borderRadius: "50%" };
const navBtnLeft: React.CSSProperties = { ...navBtn, left: "20px" };
const navBtnRight: React.CSSProperties = { ...navBtn, right: "20px" };
const centerScreen: React.CSSProperties = { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#0A192F", color: "white" };
const setupCard: React.CSSProperties = { background: "#112240", padding: "40px", borderRadius: "15px", textAlign: "center" };
const inputStyle: React.CSSProperties = { padding: "12px", margin: "10px", width: "240px", borderRadius: "5px", border: "1px solid #64FFDA", background: "#0A192F", color: "white", display: "block" };
const buttonStyle: React.CSSProperties = { padding: "10px 25px", background: "#FFD700", color: "#0A192F", border: "none", fontWeight: "bold", cursor: "pointer" };
const pillButton: React.CSSProperties = { ...buttonStyle, borderRadius: "25px" };
const titleStyle: React.CSSProperties = { fontSize: "clamp(2rem, 10vw, 5rem)", color: "#FFD700", textShadow: "4px 4px 8px rgba(0,0,0,0.8)" };
const endPageStyle: React.CSSProperties = { ...fullPage, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" };

export default App;