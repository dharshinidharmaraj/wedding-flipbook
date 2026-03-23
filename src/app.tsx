import React, { useRef, useState, useEffect } from "react";
import HTMLPageFlip from "react-pageflip";
import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const MotionDiv: React.FC<HTMLMotionProps<"div">> = (props) => {
  return <motion.div {...props}>{props.children}</motion.div>;
};

function App() {
  const book = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [showIntro, setShowIntro] = useState(true);
  const [isSetup, setIsSetup] = useState(true);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // New State: Choice between 'local' and 'spotify'
  const [musicSource, setMusicSource] = useState<"local" | "spotify">("local");

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const albumPhotos = [
    "/cover.jpg",
    "/photos/1.jpg",
    "/photos/2.jpg",
    "/photos/3.jpg",
    "/photos/4.jpg",
    "/photos/5.jpg"
  ];

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleLocalAudio = () => {
    if (!audioPlaying) {
      audioRef.current?.play().catch(() => { });
      setAudioPlaying(true);
    } else {
      audioRef.current?.pause();
      setAudioPlaying(false);
    }
  };

  const getPageSizes = () => {
    const PAGE_ASPECT = 0.7;
    const spreadAspect = PAGE_ASPECT * 2;
    const screenAspect = dimensions.width / dimensions.height;
    return screenAspect > spreadAspect
      ? { height: dimensions.height, width: Math.floor(dimensions.height * PAGE_ASPECT) }
      : { width: Math.floor(dimensions.width / 2), height: Math.floor((dimensions.width / 2) / PAGE_ASPECT) };
  };
  const pageSizes = getPageSizes();

  if (isSetup) {
    return (
      <div style={centerScreen}>
        <div style={setupCard}>
          <h2 style={{ color: "#FFD700" }}>Personalize Your Album</h2>
          <input placeholder="Groom Name" value={groomName} onChange={(e) => setGroomName(e.target.value)} style={inputStyle} />
          <input placeholder="Bride Name" value={brideName} onChange={(e) => setBrideName(e.target.value)} style={inputStyle} />
          <button onClick={() => setIsSetup(false)} disabled={!groomName || !brideName} style={buttonStyle}>Enter Album</button>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <MotionDiv initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1, delay: 2 }} onAnimationComplete={() => setShowIntro(false)} style={centerScreen}>
        <h1 style={titleStyle}>{groomName} & {brideName}</h1>
      </MotionDiv>
    );
  }

  return (
    <div style={mainWrapper}>
      {/* UI OVERLAY */}
      <div style={uiOverlayStyle}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }} style={pillButton}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>

          {/* Music Source Selector */}
          <select
            value={musicSource}
            onChange={(e) => {
              setMusicSource(e.target.value as "local" | "spotify");
              audioRef.current?.pause();
              setAudioPlaying(false);
            }}
            style={selectStyle}
          >
            <option value="local">Local Music</option>
            <option value="spotify">Spotify Music</option>
          </select>
        </div>

        {/* Conditional Music Controls */}
        {musicSource === "local" ? (
          <button onClick={toggleLocalAudio} style={pillButton}>
            {audioPlaying ? "Stop Local Music" : "Play Local Music"}
          </button>
        ) : (
          <div style={spotifyWrapper}>
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/track/5In98wH68wA20L19L6K2xW"
              width="100%" height="80" frameBorder="0" allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>
          </div>
        )}
      </div>

      <audio ref={audioRef} src="/music/song.mp3" loop />

      {/* Navigation */}
      <button onClick={() => book.current?.pageFlip()?.flipPrev()} style={navBtnLeft}>❮</button>
      <button onClick={() => book.current?.pageFlip()?.flipNext()} style={navBtnRight}>❯</button>

      {/* FLIPBOOK */}
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
        {/* @ts-ignore */}
        <HTMLPageFlip width={pageSizes.width} height={pageSizes.height} size="fixed" usePortrait={false} showCover={true} flippingTime={800} ref={book} style={{ margin: "0 auto" }}>
          <div style={fullPage}>
            <div style={gridStyle}>
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} style={{ backgroundImage: `url(${albumPhotos[i % albumPhotos.length]})`, backgroundSize: "cover" }} />
              ))}
            </div>
            <div style={titleOverlay}><h1 style={titleStyle}>{groomName} & {brideName}</h1></div>
          </div>
          {albumPhotos.slice(1).map((url, i) => (
            <div key={i} style={fullPage}><ZoomableImage url={url} /></div>
          ))}
          <div style={endPageStyle}>
            <h2 style={{ color: "#000" }}>Forever</h2>
            <button onClick={() => book.current?.pageFlip()?.flip(0)} style={buttonStyle}>Replay</button>
          </div>
        </HTMLPageFlip>
      </div>
    </div>
  );
}

// ===== STYLES =====
const mainWrapper: React.CSSProperties = { width: "100vw", height: "100vh", background: "#ffffff", overflow: "hidden" };
const fullPage: React.CSSProperties = { width: "100%", height: "100%", background: "#fff", position: "relative" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(8, 1fr)", height: "100%", width: "100%" };
const uiOverlayStyle: React.CSSProperties = { position: "absolute", top: 20, left: 20, zIndex: 100, display: "flex", flexDirection: "column", gap: 10 };
const spotifyWrapper: React.CSSProperties = { width: "300px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" };
const selectStyle: React.CSSProperties = { padding: "8px", borderRadius: "20px", border: "1px solid #FFD700", background: "#fff", cursor: "pointer" };
const navBtn = { position: "absolute" as const, top: "50%", transform: "translateY(-50%)", zIndex: 100, background: "rgba(0, 0, 0, 0.1)", border: "none", color: "#333", padding: "15px", cursor: "pointer", borderRadius: "50%" };
const navBtnLeft = { ...navBtn, left: 10 };
const navBtnRight = { ...navBtn, right: 10 };
const centerScreen: React.CSSProperties = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", background: "#0A192F", color: "white" };
const setupCard: React.CSSProperties = { background: "#112240", padding: 30, borderRadius: 10 };
const inputStyle: React.CSSProperties = { padding: 10, margin: "10px 0", display: "block", width: "100%", boxSizing: "border-box" };
const buttonStyle: React.CSSProperties = { padding: 10, background: "#FFD700", border: "none", cursor: "pointer", fontWeight: "bold" };
const pillButton = { ...buttonStyle, borderRadius: 20, width: "fit-content" };
const titleStyle: React.CSSProperties = { color: "#FFD700", fontSize: "clamp(2rem, 8vw, 4rem)", textAlign: "center" };
const titleOverlay: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" };
const endPageStyle: React.CSSProperties = { ...fullPage, background: "#fff", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" };

const ZoomableImage = ({ url }: { url: string }) => {
  const [scale, setScale] = useState(1);
  return (
    <TransformWrapper minScale={1} maxScale={4} panning={{ disabled: scale <= 1 }} onTransformed={(ref, state) => setScale(state.scale)}>
      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </TransformComponent>
    </TransformWrapper>
  );
};

export default App;