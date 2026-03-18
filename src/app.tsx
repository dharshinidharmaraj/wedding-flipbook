import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";

function App() {
  const book = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // 🎵 Music States
  const [showMusic, setShowMusic] = useState(false);
  const spotifyAssetId = "37i9dQZF1DX4H6y8vBnqXf"; // Your Playlist ID

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFlip = useCallback((e: any) => {
    setPage(e.data);
  }, []);

  return (
    <div className="app-container">
      
      {/* --- 1. SPOTIFY WIDGET ADDED HERE --- */}
      <div className={`spotify-widget ${showMusic ? "active" : ""}`}>
        <button className="music-toggle" onClick={() => setShowMusic(!showMusic)}>
          {showMusic ? "✖ Close Music" : "🎵 Play Music"}
        </button>
        
        {showMusic && (
          <div className="player-container">
            <iframe
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
      <div className="album-wrapper">
        {/* @ts-ignore */}
        <HTMLPageFlip
          width={isMobile ? 350 : 550}
          height={isMobile ? 500 : 733}
          size="stretch"
          minWidth={280}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1200}
          showCover={true}
          usePortrait={isMobile}
          flippingTime={800}
          className="wedding-book"
          onFlip={onFlip}
          ref={book}
        >
          <div className="page page-cover" data-density="hard">
            <div className="page-content">
              <img src={albumPhotos[0]} alt="Cover" className="full-page-img" />
              <div className="cover-text-overlay">
                <h2>Our Wedding</h2>
                <p>The Beginning</p>
              </div>
            </div>
          </div>

          {albumPhotos.slice(1).map((url, index) => (
            <div className="page" key={index}>
              <div className="page-content">
                <img src={url} alt={`Photo ${index}`} className="full-page-img" />
                <div className="image-overlay-caption">Sweet Moments</div>
              </div>
            </div>
          ))}

          <div className="page page-back" data-density="hard">
            <div className="page-content">
              <div className="end-content">
                <h3>The End</h3>
                <p>To be continued...</p>
              </div>
            </div>
          </div>
        </HTMLPageFlip>
      </div>

      {/* --- 3. CONTROLS SECTION --- */}
      <div className="controls">
        <div className="nav-controls">
          <button onClick={() => book.current?.pageFlip()?.flipPrev()}>⬅</button>
          <span style={{ color: 'white' }}>{page + 1} / {albumPhotos.length + 1}</span>
          <button onClick={() => book.current?.pageFlip()?.flipNext()}>➡</button>
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
            className="page-slider"
          />
        </div>
      </div>
    </div>
  );
}

export default App;