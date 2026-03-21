import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";
import { motion, Variants } from "framer-motion";

function App() {
  const book = useRef<any>(null);

  const [activeIndex, setActiveIndex] = useState(20);
  const [page, setPage] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [bookSize, setBookSize] = useState({ width: 550, height: 733 });

  const [showIntro, setShowIntro] = useState(true);
  const [showMusic, setShowMusic] = useState(false);
  const [isSetup, setIsSetup] = useState(true);

  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");

  const spotifyAssetId = "37i9dQZF1DX4H6y8vBnqXf";

  // ✅ RESPONSIVE SIZE HANDLER
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;

      if (width < 768) {
        const mobileWidth = width - 30;
        const mobileHeight = mobileWidth * 1.33;

        setBookSize({
          width: mobileWidth,
          height: mobileHeight,
        });

        setIsMobile(true);
      } else {
        setBookSize({
          width: 550,
          height: 733,
        });

        setIsMobile(false);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
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
    visible: {
      transition: { staggerChildren: 0.04 },
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
    width: bookSize.width,
    height: bookSize.height,
    size: "stretch",
    usePortrait: isMobile,
    showCover: true,
    flippingTime: 900,
    drawShadow: true,
  };

  // 🟡 SETUP SCREEN
  if (isSetup) {
    return (
      <div style={centerScreen}>
        <div style={setupCard}>
          <h2 style={{ color: "#FFD700", marginBottom: "20px" }}>
            Personalize Your Album
          </h2>
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
        <h1 style={{ fontSize: "3rem", color: "#FFD700" }}>
          {groomName} & {brideName}
        </h1>
        <p style={{ opacity: 0.8 }}>A story written in moments...</p>
      </motion.div>
    );
  }

  return (
    <div
      style={{
        background: "#0A192F",
        minHeight: "100vh",
        textAlign: "center",
        padding: "15px",
      }}
    >
      {/* 🎵 MUSIC */}
      <button
        onClick={() => setShowMusic(!showMusic)}
        style={{ ...buttonStyle, marginBottom: "20px", borderRadius: "20px" }}
      >
        {showMusic ? "Stop Music" : "Play Music"}
      </button>

      {showMusic && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "20px" }}
        >
          <iframe
            title="Spotify"
            src={`https://open.spotify.com/embed/playlist/${spotifyAssetId}?theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            style={{ borderRadius: "12px" }}
          />
        </motion.div>
      )}

      {/* 📖 BOOK CONTAINER */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <HTMLPageFlip {...bookOptions} ref={book} onFlip={onFlip}>
          {/* 🔥 FRONT COVER */}
          <div
            className="page"
            data-density="hard"
            style={{
              position: "relative",
              height: "100%",
              background: "#000",
              overflow: "hidden",
            }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                height: "100%",
              }}
            >
              {Array.from({ length: 64 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  animate={{
                    scale: i === activeIndex ? 1.15 : 1,
                    filter:
                      i === activeIndex
                        ? "grayscale(0%)"
                        : "grayscale(100%)",
                  }}
                  style={{
                    backgroundImage: `url(${
                      albumPhotos[i % albumPhotos.length]
                    })`,
                    backgroundSize: "cover",
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

          {/* 📸 PHOTO PAGES */}
          {albumPhotos.slice(1).map((url, i) => (
            <div key={i} className="page" style={{ background: "white" }}>
              <img
                src={url}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}

          {/* 🔥 END PAGE */}
          <div
            className="page"
            style={{
              background: "#0A192F",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: "#FFD700" }}>Forever Together</h2>
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
          </div>

          {/* 🔥 BACK COVER */}
          <div
            className="page"
            data-density="hard"
            style={{ background: "#000" }}
          />
        </HTMLPageFlip>
      </div>

      {/* CONTROLS */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => book.current?.pageFlip()?.flipPrev()}
          style={controlButtonStyle}
        >
          Prev
        </button>
        <button
          onClick={() => book.current?.pageFlip()?.flipNext()}
          style={controlButtonStyle}
        >
          Next
        </button>
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
  padding: "40px",
  borderRadius: "20px",
};

const inputStyle: React.CSSProperties = {
  padding: "12px",
  margin: "10px",
  borderRadius: "8px",
  background: "#0A192F",
  color: "white",
  border: "1px solid #233554",
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
  fontSize: "2rem",
  color: "#FFD700",
};

const controlButtonStyle: React.CSSProperties = {
  margin: "10px",
  padding: "10px 15px",
};

export default App;