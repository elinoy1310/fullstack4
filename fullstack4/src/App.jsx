import { useState } from "react";
import Display from "./components/Display";
import TextInput from "./components/TextInput";

function App() {
  const [segments, setSegments] = useState([
    {
      text: "",
      style: { color: "black", fontSize: "16px", fontFamily: "Arial" },
    },
  ]);

  const plainText = segments.map((s) => s.text).join("");

  const handleTextChange = (newText) => {
    setSegments([
      {
        text: newText,
        style: segments[0].style,
      },
    ]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Text Editor</h1>

      <Display segments={segments} />
      
      <TextInput text={plainText} onChange={handleTextChange} />
    </div>
  );
}

export default App;