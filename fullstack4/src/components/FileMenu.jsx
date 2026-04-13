import { useState } from "react";
import FileBar from "./FileBar";

// מנהל קבצים - שמירה, טעינה, פתיחת מסמך חדש
function FileMenu({ segments, setSegments, currentStyle, defaultStyle, setCurrentStyle, setHistory, onNewDoc, activeDocName, openFiles, onRename, currentFile, setCurrentFile, }) {

    // רשימת הקבצים השמורים מה-localStorage
    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem("files");
        return saved ? JSON.parse(saved) : [];
    });

    // שמירה לקובץ קיים
    const handleSave = () => {
        if (!currentFile || currentFile.startsWith("untitled")) {
            alert("Use Save As for new file");
            return;
        }
        localStorage.setItem(`file_${currentFile}`, JSON.stringify(segments));
        alert("File saved successfully");
    };

    // שמירה בשם חדש
    const handleSaveAs = (fileName) => {
        if (!fileName) return;
        localStorage.setItem(`file_${fileName}`, JSON.stringify(segments));
        setCurrentFile(fileName);

        // מוסיף לרשימת הקבצים אם עדיין לא קיים
        setFiles((prev) => {
            if (prev.includes(fileName)) return prev;
            const updated = [...prev, fileName];
            localStorage.setItem("files", JSON.stringify(updated));
            return updated;
        });
setHistory([])
        alert("File saved successfully");
// עדכן שם מסמך
onRename(fileName);
    };

    // טעינת קובץ קיים
    const handleLoad = (fileName) => {

        if (!fileName) return;
        if (openFiles.includes(fileName)) {
            alert("File already open");
            return;
        }
        const data = localStorage.getItem(`file_${fileName}`);
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
                onNew={onNewDoc} // מועבר ישירות מ-App
            />
         
        </>
    );
}

export default FileMenu;