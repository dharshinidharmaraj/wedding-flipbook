export default function MusicPlayer() {
  return (
    <audio autoPlay loop controls style={{ marginTop: "20px" }}>
      <source src="/music/song.mp3" type="audio/mpeg" />
    </audio>
  )
}