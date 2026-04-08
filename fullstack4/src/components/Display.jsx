function Display({ segments }) {
  return (
    <div
      style={{
        border: "2px solid black",
        minHeight: "120px",
        padding: "10px",
        marginBottom: "20px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {segments.map((seg, index) => (
        <span key={index} style={seg.style}>
          {seg.text}
        </span>
      ))}
    </div>
  );
}

export default Display;