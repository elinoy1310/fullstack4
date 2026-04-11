import { useState } from "react";

function VirtualKeyboard({ onInsert }) {
  const [mode, setMode] = useState("emoji");

  const keyboards = {
    emoji: ["😀", "😂", "🔥", "😍", "😎"],
    math: ["+", "-", "=", "√", "π"],
    symbols: ["@", "#", "&", "%", "!"],
  };

  return (
    <div id="keyboard-container" >
      <h3>Virtual Keyboard</h3>

      {/* החלפת קטגוריה */}
      <div >
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
            className="key"

          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VirtualKeyboard;