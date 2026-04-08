import { useState } from "react";

function VirtualKeyboard({ onInsert }) {
  const [mode, setMode] = useState("emoji");

  const keyboards = {
    emoji: ["😀", "😂", "🔥", "😍", "😎"],
    math: ["+", "-", "=", "√", "π"],
    symbols: ["@", "#", "&", "%", "!"],
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "10px" }}>
      <h3>Virtual Keyboard</h3>

      {/* החלפת קטגוריה */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setMode("emoji")}>😀</button>
        <button onClick={() => setMode("math")}>Math</button>
        <button onClick={() => setMode("symbols")}>Symbols</button>
      </div>

      {/* מקלדת */}
      <div>
        {keyboards[mode].map((char, index) => (
          <button
            key={index}
            onClick={() => onInsert(char)}
            style={{ margin: "5px", padding: "10px" }}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VirtualKeyboard;