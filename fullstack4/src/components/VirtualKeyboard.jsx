import { useState } from "react";

function VirtualKeyboard({ onInsert }) {
  const [mode, setMode] = useState("emoji");

  const keyboards = {
    emoji: ["😀", "😂", "🔥", "😍", "😎","❤️", "👍", "👏", "🎉", "🚀", "⭐", "🌟", "💯", "🎊", "🎈"],
    math: ["+", "-", "=", "√", "π", "*", "/", "%", "^", "∞", "≈", "≠", "<", ">", "≤", "≥", "∑", "∫", "∂", "∆"],
    symbols: ["@", "#", "&", "%", "!"],
    hebrew: ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת"].reverse(),
    englishCapslocks: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    english: [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ]
  };

  return (
    <div id="keyboard-container" >
      <h3>Virtual Keyboard</h3>
      <p id="category-label">Categories</p>

      <div id="category-buttons" >
      
        <button onClick={() => setMode("emoji")}>😀</button>
        <button onClick={() => setMode("math")}>Math</button>
        <button onClick={() => setMode("symbols")}>Symbols</button>
        <button onClick={() => setMode("englishCapslocks")}>ENG</button>
        <button onClick={() => setMode("english")}>eng</button>
        <button onClick={() => setMode("hebrew")}>עברית</button>
      </div>

      <div id="keys-container">
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