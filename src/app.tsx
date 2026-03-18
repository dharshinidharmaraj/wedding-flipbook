import React, { useRef, useState, useEffect, useCallback } from "react";
import HTMLPageFlip from "react-pageflip";

function App() {
  const book = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const albumPhotos = [
    "/cover.jpg",
    "/photos/1.jpg",
    "/photos/2.jpg",
    "/photos/3.jpg",
    "/photos/4.jpg",
    "/photos/5.jpg",
  ];

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFlip = useCallback((e: any) => {
    setPage(e.data);
  }, []);

  return (
    <div className="app-container">
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
          {/* Cover */}
          <div className="page page-cover" data-density="hard">
            <div className="page-content">
              <img src={albumPhotos[0]} alt="Cover" className="full-page-img" />
              <div className="cover-text">
                <h2>Our Wedding</h2>
                <p>The Beginning</p>
              </div>
            </div>
          </div>

          {/* Photo Pages */}
          {albumPhotos.slice(1).map((url, index) => (
            <div className="page" key={index}>
              <div className="page-content">
                <img src={url} alt={`Photo ${index}`} className="full-page-img" />
                <div className="caption">Sweet Moments</div>
              </div>
            </div>
          ))}

          {/* Last Page */}
          <div className="page page-back" data-density="hard">
            <div className="page-content">
              <h3>The End</h3>
            </div>
          </div>
        </HTMLPageFlip>
      </div>

      <div className="controls-container">
        <div className="nav-buttons">
          <button onClick={() => book.current?.pageFlip()?.flipPrev()}>Prev</button>
          <span>Page {page + 1}</span>
          <button onClick={() => book.current?.pageFlip()?.flipNext()}>Next</button>
        </div>
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
  );
}

export default App;