import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";
import { motion, Variants } from "framer-motion";

function App() {
  const book = useRef<any>(null);

  const [activeIndex, setActiveIndex] = useState(20);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [showIntro, setShowIntro] = useState(true);
  const [showMusic, setShowMusic] = useState(false);
  const [isSetup, setIsSetup] = useState(true);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");

  const spotifyAssetId = "37i9dQZF1DX4H6y8vBnqXf";

  // ✅ Responsive fix
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
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

  // 🔥 Animations
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // ✅ Book size FIXED
  const bookOptions: any = {
    width: isMobile ? 320 : 550,
    height: isMobile ? 480 : 733,
    size: "stretch",
    minWidth: 300,
    maxWidth: 1000,
    minHeight: 400,
    maxHeight: 1350,
    showCover: true,
    usePortrait: isMobile,
    flippingTime: 800,
    autoSize: true,
  };

  // 🟡 SETUP
  if (isSetup) {
    return (
      <div style={centerScreen}>
        <div style={setupCard}>
          <h2 style={{ color: "#FFD700" }}>Personalize Your Album</h2>
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
          <button
            onClick={() => setIsSetup(false)}
            disabled={!brideName || !groomName}
            style={buttonStyle}
          >
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
        <h1 style={titleStyle}>
          {groomName} & {brideName}
        </h1>
        <p>A story written in moments...</p>
      </motion.div>
    );
  }

  return (
    <div style={{ background: "#0A192F", minHeight: "100vh", textAlign: "center" }}>
      
      {/* 🎵 MUSIC */}
      <button
        onClick={() => setShowMusic(!showMusic)}
        style={{ ...buttonStyle, marginTop: "15px", borderRadius: "25px" }}
      >
        {showMusic ? "Stop Music" : "Play Music"}
      </button>

      {showMusic && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <iframe
            title="Spotify"
            src={`https://open.spotify.com/embed/playlist/${spotifyAssetId}?theme=0`}
            width={isMobile ? "90%" : "350px"}
            height="80"
            style={{ borderRadius: "12px", marginTop: "10px" }}
          />
        </motion.div>
      )}

      {/* 📖 BOOK */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: isMobile ? "10px" : "20px",
        }}
      >
        <HTMLPageFlip {...bookOptions} ref={book} onFlip={onFlip}>

          {/* 🔥 COVER */}
          <div className="page" data-density="hard" style={{ position: "relative" }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8,1fr)",
                gridTemplateRows: "repeat(8,1fr)",
                gap: isMobile ? "2px" : "4px",
                padding: "8px",
                height: "100%",
              }}
            >
              {Array.from({ length: 64 }).map((_, i) => (
                <motion.div
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
            </motion.div>

            <div style={overlayStyle} />

            <div style={centerAbsolute}>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                style={titleStyle}
              >
                {groomName} & {brideName}
              </motion.h1>
            </div>
          </div>

          {/* 📸 PHOTOS */}
          {albumPhotos.slice(1).map((url, i) => (
            <div key={i}>
              <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}

          {/* 🌙 END PAGE */}
          <div className="page" data-density="hard" style={endPage}>
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={endTitle}>
              Forever Together
            </motion.h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "60px" }}
              style={divider}
            />

            <p style={{ color: "white" }}>
              {groomName} & {brideName}
            </p>

            <button
              onClick={() => book.current?.pageFlip()?.flip(0)}
              style={{ ...buttonStyle, marginTop: "20px" }}
            >
              Replay
            </button>
          </div>

        </HTMLPageFlip>
      </div>

      {/* 🔘 CONTROLS */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => book.current?.pageFlip()?.flipPrev()} style={navBtn}>Prev</button>
        <button onClick={() => book.current?.pageFlip()?.flipNext()} style={navBtn}>Next</button>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const centerScreen: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#0A192F",
  color: "white",
};

const setupCard: React.CSSProperties = {
  background: "#112240",
  padding: "30px",
  borderRadius: "15px",
};

const inputStyle: React.CSSProperties = {
  padding: "10px",
  margin: "10px",
  width: "200px",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  background: "#FFD700",
  border: "none",
  cursor: "pointer",
};

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
};

const centerAbsolute: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(1.5rem,4vw,2.5rem)",
  color: "#FFD700",
  textAlign: "center",
};

const endPage: React.CSSProperties = {
  background: "#0A192F",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const endTitle: React.CSSProperties = {
  fontSize: "2rem",
  color: "#FFD700",
};

const divider: React.CSSProperties = {
  height: "2px",
  background: "#FFD700",
  margin: "10px 0",
};

const navBtn: React.CSSProperties = {
  padding: "10px 15px",
  margin: "5px",
  borderRadius: "20px",
  background: "#112240",
  color: "#64FFDA",
  border: "none",
};

export default App;