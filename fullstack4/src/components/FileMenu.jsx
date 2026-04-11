import { useState } from "react";
import FileBar from "./FileBar";

function FileMenu({ segments,setSegments, currentStyle, defaultStyle, setCurrentStyle, setHistory }) {

    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem("files");
        return saved ? JSON.parse(saved) : [];
    });
    const [currentFile, setCurrentFile] = useState("");

    let isSaved= false

    // file management
    const handleSave = () => {
        if (!currentFile) {
            alert("No file selected. Use Save As.");
            return;
        }

        localStorage.setItem(
            `file_${currentFile}`,
            JSON.stringify(segments)
        );
        isSaved = true;
    };

    const handleSaveAs = (fileName) => {
        if (!fileName) return;

        localStorage.setItem(
            `file_${fileName}`,
            JSON.stringify(segments)
        );

        setCurrentFile(fileName);

        setFiles((prev) => {
            if (prev.includes(fileName)) return prev;

            const updated = [...prev, fileName];
            localStorage.setItem("files", JSON.stringify(updated));
            return updated;
        });

        isSaved = true;
    };

    const handleLoad = (fileName) => {
        if (!fileName) return;

        const data = localStorage.getItem(`file_${fileName}`);
        if (!data) return;

        const parsed = JSON.parse(data);

        setSegments(parsed);
        setHistory([parsed]);
        setCurrentFile(fileName); // 🔥 חשוב
        isSaved = true;
    };

    const handleNew = () => {
        const plainText = segments.map((s) => s.text).join("");
        if (plainText.length > 0 && !isSaved) {
            const confirmNew = window.confirm("Start new file without saving?");
            if (!confirmNew) return;
        }

        setCurrentStyle(defaultStyle);
        const newDoc = [
            {
                text: "",
                style: currentStyle
            },
        ];

        setSegments(newDoc);
        setHistory([newDoc]);
        setCurrentFile("");
        isSaved = false;
    };

    return (<>
    <FileBar
        files={files}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onLoad={handleLoad}
        onNew={handleNew}
        />
        {currentFile && <h2 id="file-name">File Name: {currentFile}</h2>}

        </> 
        )

}
export default FileMenu;