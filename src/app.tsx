import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";
import MusicPlayer from "./components/musicplayer";
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

  // 📱 Responsive
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

  const bookOptions: any = {
    width: isMobile ? 320 : 550,
    height: isMobile ? 480 : 733,
    size: "stretch",
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
      
      {/* 🎵 MUSIC CONTROL */}
      <button
        onClick={() => setShowMusic(!showMusic)}
        style={{ ...buttonStyle, marginTop: "15px", borderRadius: "25px" }}
      >
        {showMusic ? "Hide Music" : "Play Music"}
      </button>

      {/* ✅ USE YOUR COMPONENT */}
      {showMusic && <MusicPlayer />}

      {/* 📖 BOOK */}
      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
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
          filter: i === activeIndex
            ? "grayscale(0%)"
            : "grayscale(100%)", // greyed out initially
        }}
        style={{
          backgroundImage: `url(${albumPhotos[i % albumPhotos.length]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: "pointer",
        }}
        onClick={() => setActiveIndex(i)}
      />
    ))}
  </motion.div>

  <div style={overlayStyle} />

  {/* ✨ Title (animate AFTER grid) */}
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      delay: 64 * 0.04 + 0.2, // wait for all tiles to animate first
      duration: 0.8,
    }}
    style={centerAbsolute}
  >
    <h1 style={titleStyle}>
      {groomName} & {brideName}
    </h1>
  </motion.div>
</div>
          {/* 📸 PHOTOS */}
          {albumPhotos.slice(1).map((url, i) => (
            <div key={i}>
              <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}

          {/* 🌙 END */}
          <div className="page" data-density="hard" style={endPage}>
            <h2 style={endTitle}>Forever Together</h2>
            <div style={divider} />
            <p>{groomName} & {brideName}</p>
          </div>

        </HTMLPageFlip>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const centerScreen: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0A192F",
  color: "white",
};

const setupCard = { background: "#112240", padding: "30px", borderRadius: "15px" };
const inputStyle = { padding: "10px", margin: "10px" };
const buttonStyle = { padding: "10px 20px", background: "#FFD700", border: "none" };

const overlayStyle = {
  position: "absolute" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
};

const centerAbsolute = {
  position: "absolute" as const,
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const titleStyle = { fontSize: "2rem", color: "#FFD700" };
const endPage = { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" };
const endTitle = { color: "#FFD700" };
const divider = { height: "2px", background: "#FFD700", width: "60px" };

export default App;