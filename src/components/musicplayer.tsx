import { useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [spotifyLink, setSpotifyLink] = useState("");
  const [showSpotify, setShowSpotify] = useState(false);

  // Convert Spotify URL to embed
  const getEmbedUrl = (url: string) => {
    if (!url.includes("spotify")) return "";
    return url.replace("open.spotify.com/", "open.spotify.com/embed/");
  };

  // Toggle local audio
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false; // unlock autoplay

    if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log(err));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div style={{ marginTop: "15px", textAlign: "center" }}>
      {/* --- LOCAL AUDIO --- */}
      <audio ref={audioRef} loop muted preload="auto">
        <source src="/music/song.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={toggleMusic}
        style={{
          padding: "10px 20px",
          borderRadius: "20px",
          border: "none",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        {isPlaying ? "🔇 Stop Local Music" : "🎵 Play Local Music"}
      </button>

      <br />

      {/* --- SPOTIFY --- */}
      <button
        onClick={() => setShowSpotify(!showSpotify)}
        style={{
          padding: "10px 20px",
          borderRadius: "20px",
          border: "none",
          background: "#1DB954",
          color: "#fff",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        {showSpotify ? "Hide Spotify Player" : "Show Spotify Player"}
      </button>

      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Paste Spotify playlist or song link"
          value={spotifyLink}
          onChange={(e) => setSpotifyLink(e.target.value)}
          style={{
            padding: "8px",
            width: "80%",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
      </div>

      {showSpotify && spotifyLink && getEmbedUrl(spotifyLink) && (
        <iframe
          src={getEmbedUrl(spotifyLink)}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          style={{ borderRadius: "12px", marginTop: "10px" }}
        />
      )}
    </div>
  );
}