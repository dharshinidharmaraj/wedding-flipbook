import React, { useRef, useState, useEffect } from "react";
import HTMLPageFlip from "react-pageflip";
import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const MotionDiv: React.FC<HTMLMotionProps<"div">> = (props) => {
  return <motion.div {...props}>{props.children}</motion.div>;
};

function App() {
  const book = useRef<any>(null);

  const [showIntro, setShowIntro] = useState(true);
  const [isSetup, setIsSetup] = useState(true);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const albumPhotos = [
    "/cover.jpg",
    "/photos/1.jpg",
    "/photos/2.jpg",
    "/photos/3.jpg",
    "/photos/4.jpg",
    "/photos/5.jpg"
  ];

  // Resize listener
  useEffect(() => {
    const handleResize = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const isLandscape = dimensions.width > dimensions.height;
  const isMobile = dimensions.width < 768;

  const toggleAudio = () => {
    if (!audioPlaying) {
      audioRef.current?.play().catch(() => { });
      setAudioPlaying(true);
    } else {
      audioRef.current?.pause();
      setAudioPlaying(false);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const getPageSizes = () => {
    const PAGE_ASPECT = 0.7;
    const spreadAspect = PAGE_ASPECT * 2;
    const screenAspect = dimensions.width / dimensions.height;
    if (screenAspect > spreadAspect) {
      return { height: dimensions.height, width: Math.floor(dimensions.height * PAGE_ASPECT) };
    } else {
      return { width: Math.floor(dimensions.width / 2), height: Math.floor((dimensions.width / 2) / PAGE_ASPECT) };
    }
  };
  const pageSizes = getPageSizes();

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  };

  // Setup screen
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
            disabled={!groomName || !brideName}
            style={buttonStyle}
          >
            Enter Album
          </button>
        </div>
      </div>
    );
  }

  // Intro
  if (showIntro) {
    return (
      <MotionDiv
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, delay: 2 }}
        onAnimationComplete={() => setShowIntro(false)}
        style={centerScreen}
      >
        <h1 style={titleStyle}>
          {groomName} & {brideName}
        </h1>
      </MotionDiv>
    );
  }

  return (
    <div style={mainWrapper}>
      {/* UI */}
      <div style={uiOverlayStyle}>
        <button onClick={toggleAudio} style={pillButton}>
          {audioPlaying ? "Stop Music" : "Play Music"}
        </button>

        <button onClick={toggleFullScreen} style={pillButton}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {/* Navigation */}
      <button
        onClick={() => book.current?.pageFlip()?.flipPrev()}
        style={navBtnLeft}
      >
        ❮
      </button>
      <button
        onClick={() => book.current?.pageFlip()?.flipNext()}
        style={navBtnRight}
      >
        ❯
      </button>

      <audio ref={audioRef} src="/music/song.mp3" loop />

      {/* FLIPBOOK */}
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
        {/* @ts-ignore */}
        <HTMLPageFlip
          width={pageSizes.width}
          height={pageSizes.height}
          size="fixed"
          usePortrait={false}
          showCover={true}
          flippingTime={800}
          ref={book}
          style={{ margin: "0 auto" }}
        >
          {/* COVER */}
          <div style={fullPage}>
            <MotionDiv
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={gridStyle}
            >
              {Array.from({ length: 64 }).map((_, i) => (
                <MotionDiv
                  key={i}
                  variants={itemVariants}
                  style={{
                    backgroundImage: `url(${albumPhotos[i % albumPhotos.length]
                      })`,
                    backgroundSize: "cover"
                  }}
                />
              ))}
            </MotionDiv>

            <div style={titleOverlay}>
              <h1 style={titleStyle}>
                {groomName} & {brideName}
              </h1>
            </div>
          </div>

          {/* IMAGE PAGES (ZOOM ONLY HERE) */}
          {albumPhotos.slice(1).map((url, i) => (
            <div key={i} style={fullPage}>
              <ZoomableImage url={url} />
            </div>
          ))}

          {/* END */}
          <div style={endPageStyle}>
            <h2 style={{ color: "#FFD700" }}>Forever</h2>
            <button
              onClick={() => book.current?.pageFlip()?.flip(0)}
              style={buttonStyle}
            >
              Replay
            </button>
          </div>
        </HTMLPageFlip>
      </div>
    </div>
  );
}

// ===== STYLES =====
const mainWrapper: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  background: "#000",
  overflow: "hidden"
};

const fullPage: React.CSSProperties = {
  width: "100%",
  height: "100%",
  background: "#fff",
  position: "relative"
};

const fullImage: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain"
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gridTemplateRows: "repeat(8, 1fr)",
  height: "100%",
  width: "100%"
};

const uiOverlayStyle: React.CSSProperties = {
  position: "absolute",
  top: 20,
  left: 20,
  zIndex: 100,
  display: "flex",
  gap: 10
};

const navBtn = {
  position: "absolute" as const,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 100,
  background: "rgba(240, 239, 239, 0.1)",
  border: "none",
  color: "white",
  padding: "15px",
  cursor: "pointer"
};

const navBtnLeft = { ...navBtn, left: 10 };
const navBtnRight = { ...navBtn, right: 10 };

const centerScreen: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  background: "#0A192F",
  color: "white"
};

const setupCard: React.CSSProperties = {
  background: "#112240",
  padding: 30,
  borderRadius: 10
};

const inputStyle: React.CSSProperties = {
  padding: 10,
  margin: 10,
  display: "block"
};

const buttonStyle: React.CSSProperties = {
  padding: 10,
  background: "#FFD700",
  border: "none",
  cursor: "pointer"
};

const pillButton = { ...buttonStyle, borderRadius: 20 };

const titleStyle: React.CSSProperties = {
  color: "#FFD700",
  fontSize: "clamp(2rem, 8vw, 4rem)"
};

const titleOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const endPageStyle: React.CSSProperties = {
  ...fullPage,
  background: "#0A192F",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
};

const ZoomableImage = ({ url }: { url: string }) => {
  const [scale, setScale] = useState(1);
  return (
    <TransformWrapper
      minScale={1}
      maxScale={4}
      panning={{ disabled: scale <= 1 }}
      onTransformed={(ref, state) => setScale(state.scale)}
    >
      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
        <img src={url} alt="" style={fullImage} />
      </TransformComponent>
    </TransformWrapper>
  );
};

export default App;