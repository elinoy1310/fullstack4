import { useState } from "react";
import Display from "./components/Display";
import TextInput from "./components/TextInput";
import Toolbar from "./components/Toolbar";

function App() {
  const [segments, setSegments] = useState([
    {
      text: "",
      style: { color: "black", fontSize: "16px", fontFamily: "Arial", fontWeight: "normal" },
    },
  ]);

  const [currentStyle, setCurrentStyle] = useState({
    color: "black",
    fontSize: "16px",
    fontFamily: "Arial",
    fontWeight: "normal",
  });

  const [applyMode, setApplyMode] = useState("all");

  const plainText = segments.map((s) => s.text).join("");

  // ✏️ כתיבה
  const handleTextChange = (newText) => {
    if (newText.length < plainText.length) {
      // מחיקה (פשוט בינתיים)
      setSegments([
        {
          text: newText,
          style: currentStyle,
        },
      ]);
      return;
    }

    const addedText = newText.slice(plainText.length);

    setSegments((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].text += addedText;
      return updated;
    });
  };

  // 🎨 שינוי סטייל
  const updateStyle = (newStyle) => {
    if (applyMode === "all") {
      setSegments((prev) =>
        prev.map((seg) => ({
          ...seg,
          style: { ...seg.style, ...newStyle },
        }))
      );
    } else {
      // future → יוצרים סגמנט חדש רק אם יש כבר טקסט
      setSegments((prev) => {
        const updated = [...prev];

        if (updated[updated.length - 1].text !== "") {
          updated.push({
            text: "",
            style: { ...currentStyle, ...newStyle },
          });
        }

        return updated;
      });
    }

    setCurrentStyle((prev) => ({
      ...prev,
      ...newStyle,
    }));
  };
  const changeApplyMode = (mode) => {
  if (mode === "all") {
    // להחיל מיידית על כל הטקסט
    setSegments((prev) =>
      prev.map((seg) => ({
        ...seg,
        style: { ...seg.style, ...currentStyle },
      }))
    );
  }

  setApplyMode(mode);
};

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Text Editor</h1>

      <Display segments={segments} />

      <TextInput text={plainText} onChange={handleTextChange} />

      <Toolbar
        currentStyle={currentStyle}
        updateStyle={updateStyle}
        applyMode={applyMode}
        setApplyMode={changeApplyMode}
      />
    </div>
  );
}

export default App;