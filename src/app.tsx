import React, { useRef, useState, useEffect } from "react";
import HTMLPageFlip from "react-pageflip";

function App() {
  const book = useRef<any>(null);

  const albumPhotos = [
    "/cover.jpg",
    "/photos/1.jpg",
    "/photos/2.jpg",
    "/photos/3.jpg",
    "/photos/4.jpg",
    "/photos/5.jpg",
  ];

  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageNum = Number(e.target.value);
    setPage(pageNum);
    book.current?.pageFlip()?.flip(pageNum);
  };

  const handlePageFlip = (e: any) => setPage(e.data);

  return (
    <div className="app-container">
      <div className="album-wrapper">
        {/* @ts-ignore */}
        <HTMLPageFlip
          size="stretch"          // Important for full screen
          width={isMobile ? window.innerWidth : 1200}  // control max width
          height={isMobile ? window.innerHeight : 600} // control height
          minWidth={300}
          maxWidth={1200}
          minHeight={400}
          maxHeight={800}
          showCover={true}
          usePortrait={isMobile}  // 1-page mobile, 2-page desktop
          mobileScrollSupport={true}
          clickEventForward={true}
          ref={book}
          className="wedding-book"
          onFlip={handlePageFlip}
        >
          {/* Cover */}
          <div className="page page-cover">
            <img src={albumPhotos[0]} alt="Cover" className="full-page-img" />
          </div>

          {/* Photos */}
          {albumPhotos.slice(1).map((url, index) => (
            <div className="page" key={index}>
              <img src={url} alt={`Wedding ${index}`} className="full-page-img" />
            </div>
          ))}
        </HTMLPageFlip>

        {/* Controls */}
        <div className="controls">
          <div className="nav-controls">
            <button onClick={() => book.current?.pageFlip()?.flipPrev()}>⬅</button>
            <button onClick={() => book.current?.pageFlip()?.flipNext()}>➡</button>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min={0}
              max={albumPhotos.length - 1}
              value={page}
              onChange={handleSlider}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;