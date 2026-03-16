import React, { useRef, useState } from "react";
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
          {/* @ts-ignore */}
          <HTMLPageFlip
            width={500}
            height={600}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            showCover={true}
            usePortrait={false}
            startPage={0}
            flippingTime={800} // Slightly faster for smoother visuals
            
            /* THE REFLECTION KILLERS */
            drawShadow={false}
            maxShadowOpacity={0}
            showPageCorners={false} // Prevents the 'dog-ear' shadow reflection
            mobileScrollSupport={true}
            clickEventForward={true}
            
            ref={book}
            className="wedding-book"
            onFlip={handlePageFlip}
          >
            {/* Cover Page */}
            <div className="page page-cover">
              <img
                src={albumPhotos[0]}
                alt="Cover"
                className="full-page-img"
              />
              <div className="cover-text-overlay">
                <h2>Our Wedding</h2>
                <p>The Beginning</p>
              </div>
            </div>

            {/* Photo Pages */}
            {albumPhotos.slice(1).map((url, index) => (
              <div className="page" key={index}>
                <img
                  src={url}
                  alt={`Wedding ${index}`}
                  className="full-page-img"
                />
                <div className="image-overlay-caption">
                  Sweet Moments
                </div>
              </div>
            ))}

            {/* Final Page */}
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
              Previous
            </button>
            <button onClick={() => book.current?.pageFlip()?.flipNext()}>
              Next
            </button>
          </div>

          <div className="slider-container">
            <input
              type="range"
              min="0"
              max={albumPhotos.length}
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