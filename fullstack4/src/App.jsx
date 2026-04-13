import { useState } from "react";
import FullDisplay from "./components/FullDisplay";
import FileMenu from "./components/FileMenu";
import Editor from "./components/Editor";
import Auth from "./components/Auth";

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

// שמירת המסמכים הפתוחים של משתמש ב-localStorage (ללא היסטוריה - לחסוך מקום)
function saveOpenDocs(username, docs, activeDocId, nextId) {
  const toSave = docs.map((doc) => ({ ...doc, history: [] }));
  localStorage.setItem(`openDocs_${username}`, JSON.stringify({ docs: toSave, activeDocId, nextId }));
}

// טעינת המסמכים הפתוחים של משתמש מה-localStorage
function loadOpenDocs(username) {
  const saved = localStorage.getItem(`openDocs_${username}`);
  if (!saved) return null;
  try {
    const { docs, activeDocId, nextId } = JSON.parse(saved);
    // משחזרים היסטוריה בסיסית לכל מסמך
    const restoredDocs = docs.map((doc) => ({ ...doc, history: [doc.segments] }));
    return { docs: restoredDocs, activeDocId, nextId };
  } catch {
    return null;
  }
}

function App() {
  const [docs, setDocs] = useState([createEmptyDoc(1)]);
  const [activeDocId, setActiveDocId] = useState(1);
  const [openFiles, setOpenFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("currentUser") || null;
  });

  // חישוב מצב התחלתי של המסמכים לפי המשתמש
  const getInitialDocsState = (username) => {
    if (username) {
      const saved = loadOpenDocs(username);
      if (saved) return saved; // יש מסמכים שמורים - מחזירים אותם
    }
    return { docs: [createEmptyDoc(1)], activeDocId: 1, nextId: 2 };
  };

  const initial = getInitialDocsState(localStorage.getItem("currentUser"));
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
  // כניסת משתמש - טוען את המסמכים שלו
  const handleLogin = (username) => {
    const saved = loadOpenDocs(username);
    if (saved) {
      setDocs(saved.docs);
      setActiveDocId(saved.activeDocId);
    } else {
      // משתמש ללא מסמכים שמורים - מתחיל עם מסמך ריק
      const fresh = createEmptyDoc(1);
      setDocs([fresh]);
      setActiveDocId(1);
    }
    setCurrentUser(username);
  };

  // יציאת משתמש - שומר מסמכים פתוחים ומאפס state
  const handleLogout = () => {
        const maxId = Math.max(...docs.map(d => d.id), 0);
    const newId = maxId + 1;
    saveOpenDocs(currentUser, docs, activeDocId, newId);
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    const fresh = createEmptyDoc(1);
    setDocs([fresh]);
    setActiveDocId(1);
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

  };

  const handleCloseDoc = (id) => {
    const doc = docs.find((d) => d.id === id);

    if (doc.history.length > 1) {
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
    setOpenFiles(prev => [...prev, name]);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div id="main-app">
      {/* שורת משתמש - שם + כפתור התנתקות */}
      <div id="user-bar">
        <span>👤 {currentUser}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>

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
        currentUser={currentUser}
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