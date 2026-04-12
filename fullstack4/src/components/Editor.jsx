import { useState } from "react";
import Display from "./Display";
import TextInput from "./TextInput";
import Toolbar from "./Toolbar";
import VirtualKeyboard from "./VirtualKeyboard";
import DeleteControls from "./DeleteControls";
import SearchReplace from "./SearchReplace";

function Editor({ segments, setSegments, currentStyle, setCurrentStyle, setHistory, setHighlights }) {

    const [applyMode, setApplyMode] = useState("all");

    const plainText = segments.map((s) => s.text).join("");

    const handleTextChange = (newText) => {
        if (newText.length < plainText.length) {
            for (let i = 0; i < plainText.length - newText.length; i++) {
                deleteChar();
            }
            return;
        }

        const addedText = newText.slice(plainText.length);

        setSegments((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
                text: updated[updated.length - 1].text + addedText,
                style: currentStyle,
            };
            pushToHistory(updated);
            return updated;
        });
    };

    const updateStyle = (newStyle) => {
        if (applyMode === "all") {
            setSegments((prev) => {
                const updated = prev.map((seg) => ({
                    ...seg,
                    style: { ...seg.style, ...newStyle },
                }))
                pushToHistory(updated);
                return updated;
            });
        } else {
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
            setSegments((prev) => {
                const updated = prev.map((seg) => ({
                    ...seg,
                    style: { ...seg.style, ...currentStyle },
                }))
                pushToHistory(updated);
                return updated;
            });
        }

        setApplyMode(mode);
    };

    // הוספת תו מהמקשים הווירטואליים
    const insertChar = (char) => {
        setSegments((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text += char;
            pushToHistory(updated);
            return updated;
        });
    };

    // ---delete---
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
            const fullText = plainText;

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

    // search & replace
    const handleFind = (searchText) => {
        if (!searchText) return;

        const fullText = plainText;
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

    const pushToHistory = (segmentsToSave) => {
        const MAX_HISTORY = 50;
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
        <>     
            <div id="editor-container">
            <h1>Editor</h1>
            <TextInput text={plainText} onChange={handleTextChange} />
            <Toolbar
                currentStyle={currentStyle}
                updateStyle={updateStyle}
                applyMode={applyMode}
                setApplyMode={changeApplyMode}
            />
            <div id="controls-container">
                <div id="btns-container">
                    <VirtualKeyboard onInsert={insertChar} />
                
                <div id="delete-controls">
                    <DeleteControls
                        onDeleteChar={deleteChar}
                        onDeleteWord={deleteWord}
                        onClear={clearAll}
                    />
                </div>
                </div>
           
            <SearchReplace onFind={handleFind} onReplace={handleReplace} />
             </div>
            <button id="undo"onClick={handleUndo}>
                Undo
            </button>
            
        </div>
        </>
    )
}
export default Editor;