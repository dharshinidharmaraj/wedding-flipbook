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
    "/photos/1.jpg",
  ];

  // ✅ ALL hooks must be here (inside component)
  const [page, setPage] = useState(0);
  const [bookSize, setBookSize] = useState({ width: 500, height: 600 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 📱 Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;

      setIsMobile(screenWidth < 768);

      if (screenWidth < 600) {
        setBookSize({
          width: screenWidth * 0.95,
          height: screenWidth * 0.6,
        });
      } else {
        setBookSize({
          width: 800,
          height: 500,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageNum = Number(e.target.value);
    setPage(pageNum);
    book.current?.pageFlip()?.flip(pageNum);
  };

  const handlePageFlip = (e: any) => {
    setPage(e.data);
  };

  return (
    <div className="app-container">
      <div className="album-wrapper">
        <div className="book-3d"></div>

        {/* @ts-ignore */}
        <HTMLPageFlip
  width={300}
  height={400}

  size="stretch"   // ✅ THIS is key

  minWidth={300}
  maxWidth={1200}
  minHeight={400}
  maxHeight={800}

  showCover={true}
  usePortrait={isMobile}

  ref={book}
  className="wedding-book"
  onFlip={handlePageFlip}
>
          {/* Cover */}
          <div className="page page-cover">
            <img src={albumPhotos[0]} alt="Cover" className="full-page-img" />
            <div className="cover-text-overlay">
              <h2>Our Wedding</h2>
              <p>The Beginning</p>
            </div>
          </div>

          {/* Photos */}
          {albumPhotos.slice(1).map((url, index) => (
            <div className="page" key={index}>
              <img src={url} alt={`Wedding ${index}`} className="full-page-img" />
              <div className="image-overlay-caption">Sweet Moments</div>
            </div>
          ))}

          {/* End */}
          <div className="page page-blank">
            <div className="page-content">
              <h3>Happy Ending</h3>
            </div>
          </div>
        </HTMLPageFlip>

        {/* Controls */}
        <div className="controls">
          <div className="nav-controls">
            <button onClick={() => book.current?.pageFlip()?.flipPrev()}>
              ⬅
            </button>
            <button onClick={() => book.current?.pageFlip()?.flipNext()}>
              ➡
            </button>
          </div>

          <div className="slider-container">
            <input
              type="range"
              min="0"
              max={albumPhotos.length + 1}
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