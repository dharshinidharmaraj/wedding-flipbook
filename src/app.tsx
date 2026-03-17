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

  const [page, setPage] = useState(0);
  const [bookSize, setBookSize] = useState({ width: 500, height: 600 });

  // 📱 Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 600) {
        // Mobile (landscape feel)
        setBookSize({
          width: screenWidth * 0.95,
          height: screenWidth * 0.6,
        });
      } else {
        // Desktop
        setBookSize({
          width: 800,
          height: 800,
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
        <div className="book-3d">
          </div>
         

          {/* @ts-ignore */}

         <HTMLPageFlip
  width={bookSize.width}
  height={bookSize.height}
  size="fixed"

  showCover={true}
  startPage={0}

  flippingTime={500}

  drawShadow={false}
  maxShadowOpacity={0}
  showPageCorners={false}

  usePortrait={false} // 🔥 THIS ENABLES TWO PAGES

  mobileScrollSupport={true}
  clickEventForward={true}

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
                <div className="image-overlay-caption">
                  Sweet Moments
                </div>
              </div>
            ))}

            {/* End */}
            <div className="page page-blank">
              <div className="page-content">
                <h3>Happy Ending</h3>
              </div>
            </div>
          </HTMLPageFlip>
        </div>

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
    
  );
}

export default App;