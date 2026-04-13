import { useState } from "react";
import FileBar from "./FileBar";

// File manager - saving, loading, opening new documents
function FileMenu({ segments, setHistory, onNewDoc, openFiles, onRename, currentFile, setCurrentFile, currentUser }) {

    // Load the user's file list when the component is created
    // Since App passes key={currentUser}, the component is recreated on every user change
    // Therefore the initializer runs again and fetches the correct files
    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem(`files_${currentUser}`);
        return saved ? JSON.parse(saved) : [];
    });

    // Save to existing file
    const handleSave = () => {
        if (!currentFile || currentFile.startsWith("untitled")) {
            alert("Use Save As for new file");
            return;
        }
        localStorage.setItem(`file_${currentUser}_${currentFile}`, JSON.stringify(segments));
        alert("File saved successfully");
        set
    };

    // Save as new file
    const handleSaveAs = (fileName) => {
        if (!fileName) return;
        localStorage.setItem(`file_${currentUser}_${fileName}`, JSON.stringify(segments));
        setCurrentFile(fileName);

        // Add to file list if it doesn't already exist
        setFiles((prev) => {
            if (prev.includes(fileName)) return prev;
            const updated = [...prev, fileName];
            localStorage.setItem(`files_${currentUser}`, JSON.stringify(updated));
            return updated;
        });
        setHistory([])
        alert("File saved successfully");
        // Update document name
        onRename(fileName);
    };

    // Load existing file
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
        // If already open → do not open again
        if (window.openFiles?.includes(fileName)) {
            alert("File already open");
            return;
        }

        // Create new document
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