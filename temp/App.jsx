import { useState } from "react";
import FileMenu from "./components/FileMenu";
import Editor from "./components/Editor";
import Display from "./components/Display";
import Auth from "./components/Auth";

// סגנון ברירת מחדל לטקסט
const defaultStyle = {
  color: "#000000",
  fontSize: "16px",
  fontFamily: "Arial",
  fontWeight: "normal",
};

// יצירת מסמך ריק חדש לפי id
function createEmptyDoc(id) {
  return {
    id,
    name: `טקסט ${id}`,
    segments: [{ text: "", style: defaultStyle }],
    history: [[{ text: "", style: defaultStyle }]],
    currentStyle: { ...defaultStyle },
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
  // מצב המשתמש המחובר - נטען מה-localStorage בעליית האפליקציה
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
  const [docs, setDocs] = useState(initial.docs);
  const [activeDocId, setActiveDocId] = useState(initial.activeDocId);
  const [nextId, setNextId] = useState(initial.nextId);

  // כניסת משתמש - טוען את המסמכים שלו
  const handleLogin = (username) => {
    const saved = loadOpenDocs(username);
    if (saved) {
      setDocs(saved.docs);
      setActiveDocId(saved.activeDocId);
      setNextId(saved.nextId);
    } else {
      // משתמש ללא מסמכים שמורים - מתחיל עם מסמך ריק
      const fresh = createEmptyDoc(1);
      setDocs([fresh]);
      setActiveDocId(1);
      setNextId(2);
    }
    setCurrentUser(username);
  };

  // יציאת משתמש - שומר מסמכים פתוחים ומאפס state
  const handleLogout = () => {
    saveOpenDocs(currentUser, docs, activeDocId, nextId);
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    const fresh = createEmptyDoc(1);
    setDocs([fresh]);
    setActiveDocId(1);
    setNextId(2);
  };

  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  // עדכון שדה במסמך + שמירה אוטומטית ב-localStorage
  const updateDocField = (id, field, valueOrFn) => {
    setDocs((prev) => {
      const updated = prev.map((doc) => {
        if (doc.id !== id) return doc;
        const newValue =
          typeof valueOrFn === "function" ? valueOrFn(doc[field]) : valueOrFn;
        return { ...doc, [field]: newValue };
      });
      saveOpenDocs(currentUser, updated, activeDocId, nextId);
      return updated;
    });
  };

  // פתיחת מסמך חדש ריק
  const handleNewDoc = () => {
    const newDoc = createEmptyDoc(nextId);
    setDocs((prev) => {
      const updated = [...prev, newDoc];
      saveOpenDocs(currentUser, updated, nextId, nextId + 1);
      return updated;
    });
    setActiveDocId(nextId);
    setNextId((n) => n + 1);
  };

  // סגירת מסמך עם הצעת שמירה
  const handleCloseDoc = (id) => {
    const doc = docs.find((d) => d.id === id);
    const text = doc.segments.map((s) => s.text).join("");

    if (text.length > 0) {
      const wantSave = window.confirm(`לשמור את "${doc.name}" לפני סגירה?`);
      if (wantSave) {
        const fileName = prompt("שם קובץ:");
        if (fileName) {
          // שמירה תחת מפתח ייחודי למשתמש
          localStorage.setItem(`file_${currentUser}_${fileName}`, JSON.stringify(doc.segments));
          const filesKey = `files_${currentUser}`;
          const files = JSON.parse(localStorage.getItem(filesKey) || "[]");
          if (!files.includes(fileName)) {
            localStorage.setItem(filesKey, JSON.stringify([...files, fileName]));
          }
        }
      }
    }

    const remaining = docs.filter((d) => d.id !== id);
    let newDocs, newActiveId, newNextId;

    if (remaining.length === 0) {
      // אם סגרנו את המסמך האחרון - פותחים מסמך ריק
      const fresh = createEmptyDoc(nextId);
      newDocs = [fresh];
      newActiveId = fresh.id;
      newNextId = nextId + 1;
    } else {
      newDocs = remaining;
      newActiveId = activeDocId === id ? remaining[remaining.length - 1].id : activeDocId;
      newNextId = nextId;
    }

    setDocs(newDocs);
    setActiveDocId(newActiveId);
    setNextId(newNextId);
    saveOpenDocs(currentUser, newDocs, newActiveId, newNextId);
  };

  // אם אין משתמש מחובר - מציגים מסך התחברות
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

      {/* תפריט קבצים - key={currentUser} גורם לקומפוננטה להיווצר מחדש בכל החלפת משתמש */}
      <FileMenu key={currentUser}
        segments={activeDoc.segments}
        setSegments={(v) => updateDocField(activeDoc.id, "segments", v)}
        currentStyle={activeDoc.currentStyle}
        defaultStyle={defaultStyle}
        setCurrentStyle={(v) => updateDocField(activeDoc.id, "currentStyle", v)}
        setHistory={(v) => updateDocField(activeDoc.id, "history", v)}
        onNewDoc={handleNewDoc}
        activeDocName={activeDoc.name}
        currentUser={currentUser}
      />

      {/* אזור תצוגה מרובה - כל המסמכים הפתוחים זה לצד זה */}
      <div style={{ display: "flex", gap: "10px", padding: "10px", flexWrap: "wrap" }}>
        {docs.map((doc) => (
          <div
            key={doc.id}
            style={{
              flex: 1,
              minWidth: "200px",
              border: doc.id === activeDocId ? "2px solid blue" : "1px solid gray",
              borderRadius: "8px",
              padding: "10px",
              cursor: "pointer",
              background: doc.id === activeDocId ? "#f0f4ff" : "white",
            }}
            onClick={() => setActiveDocId(doc.id)} // לחיצה = הפיכת המסמך לפעיל
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <strong>{doc.name}</strong>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // לא להפעיל onClick של הכרטיסייה
                  handleCloseDoc(doc.id);
                }}
                style={{ background: "salmon", color: "white", padding: "2px 8px", fontSize: "0.8rem" }}
              >
                ✕
              </button>
            </div>
            <Display segments={doc.segments} highlights={[]} />
          </div>
        ))}
        <button onClick={handleNewDoc} style={{ alignSelf: "flex-start", padding: "10px" }}>
          + מסמך חדש
        </button>
      </div>

      {/* עורך אחד בתחתית - תמיד עובד על המסמך הפעיל */}
      <Editor
        key={activeDoc.id}
        segments={activeDoc.segments}
        setSegments={(v) => updateDocField(activeDoc.id, "segments", v)}
        currentStyle={activeDoc.currentStyle}
        setCurrentStyle={(v) => updateDocField(activeDoc.id, "currentStyle", v)}
        setHistory={(v) => updateDocField(activeDoc.id, "history", v)}
      />
    </div>
  );
}

export default App;
