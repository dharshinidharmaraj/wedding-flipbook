import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";
import { motion, Variants, HTMLMotionProps } from "framer-motion";

// ✅ Inherit all motion and HTML attributes
const MotionDiv: React.FC<HTMLMotionProps<"div">> = (props) => {
  return <motion.div {...props}>{props.children}</motion.div>;
};

function App() {
  const book = useRef<any>(null);

  // States
  const [activeIndex, setActiveIndex] = useState(20);
  const [isMobile, setIsMobile] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isSetup, setIsSetup] = useState(true);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [useLocalAudio, setUseLocalAudio] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
 
  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFlip = useCallback((e: any) => {
    // page state logic
  }, []);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  // ============================
  // ✅ MOBILE OPTIMIZED BOOK OPTIONS
  // ============================
  const bookOptions = {
    width: isMobile ? 320 : 550,
    height: isMobile ? 480 : 733,
    size: "stretch" as const,
    minWidth: 300,
    maxWidth: 1000,
    minHeight: 400,
    maxHeight: 1350,
    showCover: true,
    usePortrait: isMobile,
    flippingTime: 800,
    autoSize: true,
    startPage: 0,
    drawShadow: true,
    mobileScrollSupport: false, // Prevents browser scroll interference
    clickEventForward: true,    // Ensures buttons/clicks still work
    useMouseEvents: true,       // Essential for grabbing on touch screens
    swipeDistance: 30,          // Sensitivity of the "grabbing" flip
  };

  if (isSetup) {
    return (
      <div style={centerScreen}>
        <div style={setupCard}>
          <h2 style={{ color: "#FFD700", marginBottom: "20px" }}>Personalize Your Album</h2>
          <input
            placeholder="Groom Name"
            value={groomName}
            onChange={(e) => setGroomName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Bride Name"
            value={brideName}
            onChange={(e) => setBrideName(e.target.value)}
            style={inputStyle}
          />
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => setIsSetup(false)}
              disabled={!brideName || !groomName}
              style={{ ...buttonStyle, opacity: (!brideName || !groomName) ? 0.5 : 1 }}
            >
              Enter Album
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <MotionDiv
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, delay: 2 }}
        onAnimationComplete={() => setShowIntro(false)}
        style={centerScreen}
      >
        <h1 style={titleStyle}>{groomName} & {brideName}</h1>
        <p style={{ color: "white", marginTop: "10px" }}>A story written in moments...</p>
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

  return (
    <div style={{ background: "#0A192F", minHeight: "100vh", textAlign: "center", overflowX: "hidden" }}>
      <div style={{ padding: "15px" }}>
        <button onClick={toggleAudio} style={{ ...buttonStyle, borderRadius: "25px" }}>
          {useLocalAudio ? (audioPlaying ? "Stop Music" : "Play Music") : showSpotify ? "Stop Spotify" : "Play Spotify"}
        </button>

        <button
          onClick={() => setUseLocalAudio(!useLocalAudio)}
          style={{ ...buttonStyle, marginLeft: "10px", borderRadius: "25px", background: "#64FFDA", color: "#0A192F" }}
        >
          {useLocalAudio ? "Switch to Spotify" : "Switch to Local"}
        </button>
      </div>

      {useLocalAudio && <audio ref={audioRef} src={localAudioSrc} loop />}
      {!useLocalAudio && showSpotify && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: "20px" }}>
          <iframe
            title="Spotify"
            src={`https://open.spotify.com/embed/playlist/${spotifyAssetId}`}
            width={isMobile ? "90%" : "350px"}
            height="80"
            frameBorder="0"
            style={{ borderRadius: "12px", margin: "0 auto" }}
            allow="encrypted-media"
          />
        </MotionDiv>
      )}

      {/* BOOK CONTAINER */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          padding: isMobile ? "10px" : "20px",
          touchAction: "none", // 👈 CRITICAL: Stops mobile browser from scrolling while grabbing pages
          userSelect: "none"
        }}
      >
        {/* @ts-ignore */}
        <HTMLPageFlip {...bookOptions} ref={book} onFlip={onFlip}>
          
          {/* COVER PAGE */}
          <div className="page" style={{ position: "relative", backgroundColor: "#112240", overflow: "hidden" }}>
            <MotionDiv
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gridTemplateRows: "repeat(8, 1fr)",
                gap: isMobile ? "2px" : "4px",
                padding: "8px",
                height: "100%",
              }}
            >
              {Array.from({ length: 64 }).map((_, i) => (
                <MotionDiv
                  key={i}
                  variants={itemVariants}
                  animate={{
                    scale: i === activeIndex ? 1.1 : 1,
                    filter: i === activeIndex ? "grayscale(0%)" : "grayscale(100%)",
                  }}
                  style={{
                    backgroundImage: `url(${albumPhotos[i % albumPhotos.length]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </MotionDiv>
            <div style={overlayStyle} />
            <div style={centerAbsolute}>
              <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                <h1 style={titleStyle}>{groomName} & {brideName}</h1>
              </MotionDiv>
            </div>
          </div>

          {/* PHOTO PAGES */}
          {albumPhotos.slice(1).map((url, i) => (
            <div key={i} className="page" style={{ backgroundColor: "#fff", overflow: "hidden" }}>
              <img 
                src={url} 
                alt={`Album page ${i}`} 
                style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} 
              />
            </div>
          ))}

          {/* END PAGE */}
          <div className="page" style={endPage}>
            <MotionDiv initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
              <h2 style={endTitle}>Forever Together</h2>
            </MotionDiv>
            <MotionDiv initial={{ width: 0 }} whileInView={{ width: "60px" }} style={divider} />
            <p style={{ color: "white" }}>{groomName} & {brideName}</p>
            <button 
              onClick={() => book.current?.pageFlip()?.flip(0)} 
              style={{ ...buttonStyle, marginTop: "20px", borderRadius: "5px" }}
            >
              Replay
            </button>
          </div>
        </HTMLPageFlip>
      </div>

      {/* NAV BUTTONS */}
      <div style={{ paddingBottom: "40px" }}>
        <button onClick={() => book.current?.pageFlip()?.flipPrev()} style={navBtn}>Prev</button>
        <button onClick={() => book.current?.pageFlip()?.flipNext()} style={navBtn}>Next</button>
      </div>
    </div>
  );
}

// ============================
// STYLES (Unchanged)
// ============================
const centerScreen: React.CSSProperties = { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#0A192F", color: "white" };
const setupCard: React.CSSProperties = { background: "#112240", padding: "40px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" };
const inputStyle: React.CSSProperties = { padding: "12px", margin: "10px", width: "240px", borderRadius: "5px", border: "1px solid #64FFDA", background: "#0A192F", color: "white" };
const buttonStyle: React.CSSProperties = { padding: "10px 25px", background: "#FFD700", color: "#0A192F", border: "none", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s ease" };
const overlayStyle: React.CSSProperties = { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", pointerEvents: "none" };
const centerAbsolute: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", pointerEvents: "none" };
const titleStyle: React.CSSProperties = { fontSize: "clamp(1.5rem, 6vw, 2.5rem)", color: "#FFD700", textAlign: "center", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" };
const endPage: React.CSSProperties = { background: "#0A192F", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" };
const endTitle: React.CSSProperties = { fontSize: "2rem", color: "#FFD700" };
const divider: React.CSSProperties = { height: "2px", background: "#FFD700", margin: "15px 0" };
const navBtn: React.CSSProperties = { padding: "10px 20px", margin: "0 10px", borderRadius: "20px", background: "#112240", color: "#64FFDA", border: "1px solid #64FFDA", cursor: "pointer" };

export default App;