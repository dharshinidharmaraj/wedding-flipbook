import { useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [spotifyLink, setSpotifyLink] = useState("");

  const getEmbedUrl = (url: string) => {
    if (!url.includes("spotify")) return "";
    return url.replace("open.spotify.com/", "open.spotify.com/embed/");
  };

  const handleSpotifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSpotifyLink(value);

    //  Stop default music when Spotify is used
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "15px" }}>
      
      {/*  Default Background Music */}
      {!spotifyLink && (
        <audio ref={audioRef} autoPlay loop controls>
          <source src="/music/song.mp3" type="audio/mpeg" />
        </audio>
      )}

      {/* 🎧 Spotify Input */}
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Paste Spotify song link"
          onChange={handleSpotifyChange}
          style={{ padding: "6px", width: "80%" }}
        />
      </div>

      {/* 🎧 Spotify Player */}
      {spotifyLink && (
        <iframe
          src={getEmbedUrl(spotifyLink)}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          style={{ marginTop: "10px" }}
        ></iframe>
      )}
    </div>
    
  );
}