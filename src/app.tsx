import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";
// ✅ Fix: Import motion directly to resolve "initial/variants" prop errors
import { motion, Variants } from "framer-motion";

function App() {
  const book = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(20);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [showIntro, setShowIntro] = useState(true);
  const [showMusic, setShowMusic] = useState(false);
  const [isSetup, setIsSetup] = useState(true);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");

  const spotifyAssetId = "37i9dQZF1DX4H6y8vBnqXf";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFlip = useCallback((e: any) => {
    setPage(e.data);
  }, []);

  const albumPhotos = [
    "/cover.jpg",
    "/photos/1.jpg",
    "/photos/2.jpg",
    "/photos/3.jpg",
    "/photos/4.jpg",
    "/photos/5.jpg",
  ];

  // 🔥 Animation Variants with explicit Types
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const bookOptions: any = {
    width: 550,
    height: 733,
    size: "stretch",
    usePortrait: isMobile,
    showCover: true,
    flippingTime: 900,
    startPage: 0,
    drawShadow: true,
  };

  // 🟡 SETUP SCREEN
  if (isSetup) {
    return (
      <div style={centerScreen}>
        <div style={setupCard}>
          <h2 style={{ color: "#FFD700", marginBottom: "20px" }}>Personalize Your Album</h2>
          <input placeholder="Groom Name" value={groomName} onChange={(e) => setGroomName(e.target.value)} style={inputStyle} />
          <input placeholder="Bride Name" value={brideName} onChange={(e) => setBrideName(e.target.value)} style={inputStyle} />
          <button onClick={() => setIsSetup(false)} disabled={!brideName || !groomName} style={buttonStyle}>
            Enter Album
          </button>
        </div>
      </div>
    );
  }

  // 🟡 INTRO
  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, delay: 2 }}
        onAnimationComplete={() => setShowIntro(false)}
        style={centerScreen}
      >
        <h1 style={{ fontSize: "3rem", color: "#FFD700" }}>{groomName} & {brideName}</h1>
        <p style={{ opacity: 0.8 }}>A story written in moments...</p>
      </motion.div>
    );
  }

  return (
    <div style={{ background: "#0A192F", minHeight: "100vh", textAlign: "center", padding: "20px" }}>

      {/* 🎵 MUSIC */}
      <button onClick={() => setShowMusic(!showMusic)} style={{ ...buttonStyle, marginBottom: "20px", borderRadius: "20px" }}>
        {showMusic ? "Stop Music" : "Play Music"}
      </button>

      {showMusic && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "20px" }}>
          <iframe
            title="Spotify"
            src={`https://open.spotify.com/embed/playlist/${spotifyAssetId}?utm_source=generator&theme=0`}
            width="300"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ borderRadius: "12px" }}
          />
        </motion.div>
      )}

      {/* 📖 BOOK */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <HTMLPageFlip {...bookOptions} ref={book} onFlip={onFlip}>

          {/* 🔥 FRONT COVER */}
          <div className="page" data-density="hard" style={{ position: "relative", height: "100%", background: "#000", overflow: "hidden" }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", height: "100%" }}
            >
              {Array.from({ length: 64 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  animate={{
                    scale: i === activeIndex ? 1.15 : 1,
                    filter: i === activeIndex ? "grayscale(0%)" : "grayscale(100%)",
                  }}
                  style={{
                    backgroundImage: `url(${albumPhotos[i % albumPhotos.length]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </motion.div>
            <div style={overlayStyle} />
            <div style={centerAbsolute}>
              <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} style={titleStyle}>
                {groomName} & {brideName}
              </motion.h1>
            </div>
          </div>

          {/* PHOTO PAGES */}
          {albumPhotos.slice(1).map((url, i) => (
            <div key={i} className="page" style={{ background: "white" }}>
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}

          {/* 🔥 DYNAMIC END PAGE (Inside Left) */}
          <div className="page" style={{ background: "#0A192F", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                style={{ fontFamily: "serif", fontSize: "2.5rem", color: "#FFD700", fontStyle: "italic" }}
              >
                Forever Together
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                style={{ height: "1px", background: "#FFD700", margin: "20px auto" }} 
              />
              <p style={{ color: "white", letterSpacing: "2px" }}>{groomName} & {brideName}</p>
              <button onClick={() => book.current?.pageFlip()?.flip(0)} style={{ ...buttonStyle, marginTop: "20px", fontSize: "0.8rem" }}>
                REPLAY STORY
              </button>
            </div>
          </div>

          {/* 🔥 BACK COVER (The missing piece for closing) */}
          <div className="page" data-density="hard" style={{ background: "#000", height: "100%" }}>
            <div style={centerAbsolute}>
               <div style={{ width: "40px", height: "40px", border: "1px solid #FFD700", borderRadius: "50%", opacity: 0.3 }} />
               <p style={{ color: "white", fontSize: "0.7rem", marginTop: "10px", opacity: 0.2 }}>THE END</p>
            </div>
          </div>

        </HTMLPageFlip>
      </div>

      {/* CONTROLS */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => book.current?.pageFlip()?.flipPrev()} style={controlButtonStyle}>Prev</button>
        <button onClick={() => book.current?.pageFlip()?.flipNext()} style={controlButtonStyle}>Next</button>
      </div>
    </div>
  );
}

// 🎨 STYLES (Rectified with TS types)
const centerScreen: React.CSSProperties = {
  height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#0A192F", color: "white"
};

const setupCard: React.CSSProperties = {
  background: "#112240", padding: "40px", borderRadius: "20px", textAlign: "center"
};

const inputStyle: React.CSSProperties = {
  padding: "12px", margin: "10px", borderRadius: "8px", border: "1px solid #233554", background: "#0A192F", color: "white", display: "block", width: "250px"
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 25px", background: "#FFD700", color: "#0A192F", border: "none", fontWeight: "bold", cursor: "pointer"
};

const overlayStyle: React.CSSProperties = {
  position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1
};

const centerAbsolute: React.CSSProperties = {
  position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 2
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.5rem", color: "#FFD700", fontFamily: "serif"
};

const controlButtonStyle: React.CSSProperties = {
  padding: "10px 20px", borderRadius: "5px", border: "1px solid #64FFDA", background: "transparent", color: "#64FFDA", fontWeight: "bold", cursor: "pointer", margin: "0 10px",
};

export default App;