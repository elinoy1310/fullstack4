import { useState } from "react";
import FileBar from "./FileBar";

// מנהל קבצים - שמירה, טעינה, פתיחת מסמך חדש
function FileMenu({ segments, setHistory, onNewDoc, openFiles, onRename, currentFile, setCurrentFile, currentUser }) {

    // טוען את רשימת הקבצים של המשתמש בעת יצירת הקומפוננטה
    // כיוון ש-App מעביר key={currentUser}, הקומפוננטה נוצרת מחדש בכל החלפת משתמש
    // ולכן ה-initializer רץ מחדש ומביא את הקבצים הנכונים
    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem(`files_${currentUser}`);
        return saved ? JSON.parse(saved) : [];
    });

    // שמירה לקובץ קיים
    const handleSave = () => {
        if (!currentFile || currentFile.startsWith("untitled")) {
            alert("Use Save As for new file");
            return;
        }
        localStorage.setItem(`file_${currentUser}_${currentFile}`, JSON.stringify(segments));
        alert("File saved successfully");
        set
    };

    // שמירה בשם חדש
    const handleSaveAs = (fileName) => {
        if (!fileName) return;
        localStorage.setItem(`file_${currentUser}_${fileName}`, JSON.stringify(segments));
        setCurrentFile(fileName);

        // מוסיף לרשימת הקבצים אם עדיין לא קיים
        setFiles((prev) => {
            if (prev.includes(fileName)) return prev;
            const updated = [...prev, fileName];
            localStorage.setItem(`files_${currentUser}`, JSON.stringify(updated));
            return updated;
        });
        setHistory([])
        alert("File saved successfully");
        // עדכן שם מסמך
        onRename(fileName);
    };

    // טעינת קובץ קיים
    const handleLoad = (fileName) => {
        console.log("Loading file:", fileName);
        console.log("Current open files:", openFiles);

        if (!fileName) return;
        if (openFiles.includes(fileName)) {
            alert("File already open");
            return;
        }
        const data = localStorage.getItem(`file_${currentUser}_${fileName}`);
        if (!data) return;
        const parsed = JSON.parse(data);
        // אם כבר פתוח → לא לפתוח שוב
        if (window.openFiles?.includes(fileName)) {
            alert("File already open");
            return;
        }

        // יצירת מסמך חדש
        onNewDoc(parsed, fileName);
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

        </>
    );
}

export default FileMenu;