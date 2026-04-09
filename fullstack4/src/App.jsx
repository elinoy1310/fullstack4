import { useState } from "react";
import Display from "./components/Display";
import TextInput from "./components/TextInput";
import Toolbar from "./components/Toolbar";
import VirtualKeyboard from "./components/VirtualKeyboard";
import DeleteControls from "./components/DeleteControls";
import SearchReplace from "./components/SearchReplace";

function App() {
  const [segments, setSegments] = useState([
    {
      text: "",
      style: { color: "#000000", fontSize: "16px", fontFamily: "Arial", fontWeight: "normal" },
    },
  ]);

  const [currentStyle, setCurrentStyle] = useState({
    color: "#000000",
    fontSize: "16px",
    fontFamily: "Arial",
    fontWeight: "normal",
  });

  const [applyMode, setApplyMode] = useState("all");
const [highlights, setHighlights] = useState([]); // מערך של {start, end}
  // { start: number, end: number }
  const [history, setHistory] = useState([
  [
    {
      text: "",
      style: { color: "#000000", fontSize: "16px", fontFamily: "Arial", fontWeight: "normal" },
    },
  ],
]);

  const plainText = segments.map((s) => s.text).join("");

  // ✏️ כתיבה
  const handleTextChange = (newText) => {
    if (newText.length < plainText.length) {
  const updated = [
    { text: newText, style: currentStyle },
  ];
  setSegments(updated);
  pushToHistory(updated); // ✅ דוחפים snapshot חדש
  return;
}

    const addedText = newText.slice(plainText.length);

setSegments((prev) => {
  const updated = [...prev];
  updated[updated.length - 1] = {
    text: updated[updated.length - 1].text + addedText,
    style: { ...updated[updated.length - 1].style },
  };
  pushToHistory(updated); // ✅ כאן דוחפים snapshot חדש
  return updated;
});
  };

  // 🎨 שינוי סטייל
  const updateStyle = (newStyle) => {
    if (applyMode === "all") {
      setSegments((prev) =>{
        const updated = prev.map((seg) => ({
          ...seg,
          style: { ...seg.style, ...newStyle },
        }))
        pushToHistory(updated);
        return updated;
     } );
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
pushToHistory(updated);
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
      setSegments((prev) =>{
       const updated= prev.map((seg) => ({
          ...seg,
          style: { ...seg.style, ...currentStyle },
        }))
        pushToHistory(updated);
        return updated;
     } );
    }

    setApplyMode(mode);
  };

  // הכנסת תו מהמקלדת
  const insertChar = (char) => {
    setSegments((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].text += char;
      pushToHistory(updated);
      return updated;
    });
  };

  // מחיקת תו
  const deleteChar = () => {
    setSegments((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last.text.length > 0) {
        last.text = last.text.slice(0, -1);
      }
      if (last.text.length === 0 && updated.length > 1) {
        updated.pop();
      }
      pushToHistory(updated);
      return updated;
    });
  };

  // מחיקת מילה
  const deleteWord = () => {
    setSegments((prev) => {
      // כל הטקסט
      const fullText = prev.map((s) => s.text).join("");

      // מוחקים מילה אחרונה
      const newText = fullText.replace(/\s*\S+$/, "");

      // אם ריק
      if (!newText) {
        return [
          {
            text: "",
            style: currentStyle,
          },
        ];
      }

      // 🔥 בונים מחדש סגמנטים לפי אורך
      let remaining = newText;
      const newSegments = [];

      for (let seg of prev) {
        if (remaining.length === 0) break;

        const take = remaining.slice(0, seg.text.length);

        newSegments.push({
          text: take,
          style: seg.style,
        });

        remaining = remaining.slice(take.length);
      }

  pushToHistory(newSegments); // ✅ דוחפים snapshot החדש

      return newSegments;
    });

  };

  // מחיקת הכל
  const clearAll = () => {
    const updated = [
  { text: "", style: currentStyle }
];
setSegments(updated);
pushToHistory(updated); // ✅ snapshot חדש
  };
const handleFind = (searchText) => {
  if (!searchText) return;

  const fullText = segments.map((s) => s.text).join("");
  const matches = [];
  let startIndex = 0;

  while (true) {
    const index = fullText.indexOf(searchText, startIndex);
    if (index === -1) break;

    matches.push({ start: index, end: index + searchText.length });
    startIndex = index + searchText.length;
  }

  setHighlights(matches);

  // הסרת highlight אחרי 2 שניות
  setTimeout(() => setHighlights([]), 2000);
};

  // const handleReplace = (searchText, replaceText) => {
  //   if (!searchText) return;

  //   const fullText = segments.map((s) => s.text).join("");
  //   const newText = fullText.replace(searchText, replaceText);

  //   // בנייה מחדש (כמו שעשינו קודם)
  //   setSegments([
  //     {
  //       text: newText,
  //       style: currentStyle,
  //     },
  //   ]);
  // };

  const handleReplace = (searchText, replaceText) => {
  if (!searchText) return;

  const fullText = segments.map((s) => s.text).join("");
  const newText = fullText.split(searchText).join(replaceText);

const newSegments = [
  { text: newText, style: currentStyle }
];
setSegments(newSegments);
pushToHistory(newSegments); // ✅ snapshot חדש
setHighlights([]);
};
const MAX_HISTORY = 50;

const pushToHistory = (segmentsToSave) => {
  const cloned = segmentsToSave.map((s) => ({
    text: s.text,
    style: { ...s.style },
  }));

  setHistory((prev) => {
    const newHistory = [...prev, cloned];
    // אם ההיסטוריה ארוכה מדי, חותכים מההתחלה
    if (newHistory.length > MAX_HISTORY) {
      return newHistory.slice(newHistory.length - MAX_HISTORY);
    }
    return newHistory;
  });
};
const handleUndo = () => {
  setHistory((prev) => {
    if (prev.length <= 1) return prev; // אין מה לבטל

    const last = prev[prev.length - 2]; // המצב הקודם

    setSegments(last.map((s) => ({
      text: s.text,
      style: { ...s.style },
    })));

    return prev.slice(0, -1);
  });
};
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Text Editor</h1>

      <Display segments={segments} highlights={highlights} />

      <TextInput text={plainText} onChange={handleTextChange} />

      <Toolbar
        currentStyle={currentStyle}
        updateStyle={updateStyle}
        applyMode={applyMode}
        setApplyMode={changeApplyMode}
      />
      <div style={{ marginTop: "20px" }}>
        <VirtualKeyboard onInsert={insertChar} />

        <DeleteControls
          onDeleteChar={deleteChar}
          onDeleteWord={deleteWord}
          onClear={clearAll}
        />
      </div>
      <SearchReplace onFind={handleFind} onReplace={handleReplace} />
      <button onClick={handleUndo} style={{ marginLeft: "10px" }}>
  Undo
</button>
    </div>
    

  );
}

export default App;