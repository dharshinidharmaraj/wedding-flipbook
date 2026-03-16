type Props = {
  next: () => void
  prev: () => void
  goToPage: (page: number) => void
}

export default function Controls({ next, prev, goToPage }: Props) {
  return (
    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
      <button onClick={prev}>Previous</button>
      <button onClick={next}>Next</button>

      <input
        type="number"
        placeholder="Page"
        onChange={(e) => goToPage(Number(e.target.value))}
        style={{ width: "60px" }}
      />
    </div>
  )
}