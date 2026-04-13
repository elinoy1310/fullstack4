import { useState } from "react";
import FileBar from "./FileBar";

// מנהל קבצים - שמירה וטעינה של קבצים השייכים למשתמש הנוכחי בלבד
// מפתח שמירה בלוקאלסטורג': file_<username>_<fileName>
function FileMenu({ segments, setSegments, currentStyle, defaultStyle, setCurrentStyle, setHistory, onNewDoc, activeDocName, currentUser }) {

    // טוען את רשימת הקבצים של המשתמש בעת יצירת הקומפוננטה
    // כיוון ש-App מעביר key={currentUser}, הקומפוננטה נוצרת מחדש בכל החלפת משתמש
    // ולכן ה-initializer רץ מחדש ומביא את הקבצים הנכונים
    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem(`files_${currentUser}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [currentFile, setCurrentFile] = useState(""); // שם הקובץ הפתוח כעת

    // שמירה לקובץ פתוח קיים
    const handleSave = () => {
        if (!currentFile) {
            alert("No file selected. Use Save As.");
            return;
        }
        // שומר תחת מפתח ייחודי למשתמש
        localStorage.setItem(`file_${currentUser}_${currentFile}`, JSON.stringify(segments));
    };

    // שמירה בשם חדש - מוסיף לרשימת הקבצים של המשתמש
    const handleSaveAs = (fileName) => {
        if (!fileName) return;
        localStorage.setItem(`file_${currentUser}_${fileName}`, JSON.stringify(segments));
        setCurrentFile(fileName);

        // מוסיף לרשימה רק אם לא קיים כבר
        setFiles((prev) => {
            if (prev.includes(fileName)) return prev;
            const updated = [...prev, fileName];
            localStorage.setItem(`files_${currentUser}`, JSON.stringify(updated));
            return updated;
        });
    };

    // טעינת קובץ - מביא רק קבצים של המשתמש הנוכחי
    const handleLoad = (fileName) => {
        if (!fileName) return;
        const data = localStorage.getItem(`file_${currentUser}_${fileName}`);
        if (!data) return;
        const parsed = JSON.parse(data);
        setSegments(parsed);
        setHistory([parsed]); // מאפס היסטוריה לקובץ שנטען
        setCurrentFile(fileName);
    };

    return (
        <>
            <FileBar
                files={files}
                onSave={handleSave}
                onSaveAs={handleSaveAs}
                onLoad={handleLoad}
                onNew={onNewDoc}
            />
            {/* מציג שם קובץ פתוח */}
            {currentFile && <h2 id="file-name">📄 {currentFile} — {activeDocName}</h2>}
        </>
    );
}

export default FileMenu;
