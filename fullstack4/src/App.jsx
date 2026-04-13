import { useState } from "react";
import FullDisplay from "./components/FullDisplay";
import FileMenu from "./components/FileMenu";
import Editor from "./components/Editor";

const defaultStyle = {
  color: "#000000",
  fontSize: "16px",
  fontFamily: "Arial",
  fontWeight: "normal",
}

function createEmptyDoc(id) {
  return {
    id,
    name: `untitled ${id}`,
    segments: [{ text: "", style: defaultStyle }],
    history: [[{ text: "", style: defaultStyle }]],
    currentStyle: { ...defaultStyle },
    highlights: []
  };
}

function App() {
  const [docs, setDocs] = useState([createEmptyDoc(1)]);
  const [activeDocId, setActiveDocId] = useState(1);
  // const [nextId, setNextId] = useState(2);
  const [openFiles, setOpenFiles] = useState([]);
  // const [segments, setSegments] = useState([
  //   {
  //     text: "",
  //     style: defaultStyle
  //   },
  // ]);
  // const [currentStyle, setCurrentStyle] = useState(defaultStyle);
  // const [history, setHistory] = useState([
  //   [
  //     {
  //       text: "",
  //       style: {
  //         color: "#000000",
  //         fontSize: "16px",
  //         fontFamily: "Arial",
  //         fontWeight: "normal"
  //       },
  //     },
  //   ],
  // ]);

  const [highlights, setHighlights] = useState([]);
  const [currentFile, setCurrentFile] = useState("");

  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  const updateDocField = (id, field, valueOrFn) => {
    setDocs((prev) =>
      prev.map((doc) => {
        if (doc.id !== id) return doc;
        const newValue =
          typeof valueOrFn === "function" ? valueOrFn(doc[field]) : valueOrFn;
        return { ...doc, [field]: newValue };
      })
    );
  };

  const handleNewDoc = (loadedSegments = null, fileName = null) => {

    const maxId = Math.max(...docs.map(d => d.id), 0);
const newId = maxId + 1;

const newDoc = createEmptyDoc(newId);


    if (loadedSegments && Array.isArray(loadedSegments)) {
      newDoc.segments = loadedSegments;
      newDoc.history = [loadedSegments];
       // 🔥 קח את התו האחרון
  const lastSeg = loadedSegments[loadedSegments.length - 1];

  if (lastSeg && lastSeg.text.length > 0) {
    newDoc.currentStyle = lastSeg.style;
  } else {
    newDoc.currentStyle = defaultStyle;
  }
    }

    if (fileName) {
      newDoc.name = fileName;
      setOpenFiles(prev => [...prev, fileName]);
    }

    setDocs(prev => [...prev, newDoc]);
    setActiveDocId(newId);
    // setNextId(n => n + 1);
    
    //     const newDoc = createEmptyDoc(nextId);
    // setDocs((prev) => [...prev, newDoc]);
    // setActiveDocId(nextId);
    // setNextId((n) => n + 1);

  };

  const handleCloseDoc = (id) => {
    const doc = docs.find((d) => d.id === id);

    if (doc.history.length > 1 ) {
      const wantSave = window.confirm(`Save "${doc.name}" before closing?`);
      if (wantSave) {
        const fileName = doc.name.startsWith("untitled") ? prompt("File name:") : doc.name;
        if (fileName) {
          localStorage.setItem(`file_${fileName}`, JSON.stringify(doc.segments));
          const files = JSON.parse(localStorage.getItem("files") || "[]");
          if (!files.includes(fileName)) {
            localStorage.setItem("files", JSON.stringify([...files, fileName]));
          }
        }
      }
    }

    const remaining = docs.filter((d) => d.id !== id);

    if (remaining.length === 0) {
      // אם נסגר המסמך האחרון - פותחים מסמך ריק חדש
      const maxId = Math.max(...docs.map(d => d.id), 0);
const newId = maxId + 1;
      const fresh = createEmptyDoc(newId);
      setDocs([fresh]);
      setActiveDocId(fresh.id);
      // setNextId((n) => n + 1);
    } else {
      setDocs(remaining);
      // אם נסגר המסמך הפעיל - עוברים לאחרון ברשימה
      if (activeDocId === id) {
        setActiveDocId(remaining[remaining.length - 1].id);
      }
    }

    if (doc.name) {
  setOpenFiles(prev => prev.filter(f => f !== doc.name));
}
  };
  const handleRename = (name) => {
  updateDocField(activeDoc.id, "name", name);
};

  return (
    <div id="main-app">

      {/* FileMenu אחד בלבד - ללא key שמשתנה! */}
      <FileMenu
        segments={activeDoc.segments}
        setSegments={(v) => updateDocField(activeDoc.id, "segments", v)}
        currentStyle={activeDoc.currentStyle}
        defaultStyle={defaultStyle}
        setCurrentStyle={(v) => updateDocField(activeDoc.id, "currentStyle", v)}
        setHistory={(v) => updateDocField(activeDoc.id, "history", v)}
        onNewDoc={handleNewDoc}
        activeDocName={activeDoc.name}
        openFiles={openFiles}
        onRename={handleRename}
        currentFile={activeDoc.name}
  setCurrentFile={(v) => updateDocField(activeDoc.id, "name", v)}
      />

      <FullDisplay docs={docs} setActiveDocId={setActiveDocId} handleCloseDoc={handleCloseDoc} activeDocId={activeDocId} />

      {/* עורך אחד בתחתית - תמיד עובד על המסמך הפעיל */}
      <Editor
        key={activeDoc.id}
        segments={activeDoc.segments}
        setSegments={(v) => updateDocField(activeDoc.id, "segments", v)}
        currentStyle={activeDoc.currentStyle}
        setCurrentStyle={(v) => updateDocField(activeDoc.id, "currentStyle", v)}
        setHistory={(v) => updateDocField(activeDoc.id, "history", v)}
        setHighlights={(v) => updateDocField(activeDoc.id, "highlights", v)}

      />
    </div>
  );
}

export default App;