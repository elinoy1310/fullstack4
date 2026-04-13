import { useState } from "react";
import TextInput from "./TextInput";
import Toolbar from "./Toolbar";
import VirtualKeyboard from "./VirtualKeyboard";
import DeleteControls from "./DeleteControls";
import SearchReplace from "./SearchReplace";

function Editor({ segments, setSegments, currentStyle, setCurrentStyle, setHistory, setHighlights }) {

    const [applyMode, setApplyMode] = useState("future");

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

        setTimeout(() => setHighlights([]), 2000);
        return matches;
    };

    //   if (!searchText) return;

    //   const newSegments = [];

    //   segments.forEach(seg => {
    //     let text = seg.text;

    //     if (!text.includes(searchText)) {
    //       newSegments.push(seg);
    //       return;
    //     }

    //     const parts = text.split(searchText);

    //     parts.forEach((part, i) => {
    //       if (part) {
    //         newSegments.push({ text: part, style: seg.style });
    //       }

    //       if (i < parts.length - 1) {
    //         newSegments.push({ text: replaceText, style: seg.style });
    //       }
    //     });
    //   });

    //   setSegments(newSegments);
    //   pushToHistory(newSegments);
    // };
    const handleReplace = (searchText, replaceText) => {
        if (!searchText) return;

        // 🔹 שלב 1: בניית טקסט מלא + מיפוי אינדקסים לסטיילים
        let fullText = "";
        const charMap = []; // לכל תו → שומר את הסטייל שלו

        segments.forEach(seg => {
            for (let i = 0; i < seg.text.length; i++) {
                fullText += seg.text[i];
                charMap.push(seg.style);
            }
        });

        // 🔹 שלב 2: חיפוש כל ההתאמות
        const matches = [];
        let startIndex = 0;

        while (true) {
            const index = fullText.indexOf(searchText, startIndex);
            if (index === -1) break;

            matches.push(index);
            startIndex = index + searchText.length;
        }

        if (matches.length === 0) return;

        // 🔹 שלב 3: בניית segments חדשים
        const newSegments = [];
        let currentIndex = 0;

        matches.forEach(matchIndex => {
            // טקסט לפני ההתאמה
            if (matchIndex > currentIndex) {
                const textPart = fullText.slice(currentIndex, matchIndex);

                for (let i = 0; i < textPart.length; i++) {
                    newSegments.push({
                        text: textPart[i],
                        style: charMap[currentIndex + i],
                    });
                }
            }

            // 🔥 הטקסט המוחלף - עם הסטייל של התו הראשון
            const styleOfMatch = charMap[matchIndex];

            newSegments.push({
                text: replaceText,
                style: styleOfMatch,
            });

            currentIndex = matchIndex + searchText.length;
        });

        // טקסט אחרי ההתאמות
        if (currentIndex < fullText.length) {
            const textPart = fullText.slice(currentIndex);

            for (let i = 0; i < textPart.length; i++) {
                newSegments.push({
                    text: textPart[i],
                    style: charMap[currentIndex + i],
                });
            }
        }

        // 🔹 שלב 4: איחוד תווים עם אותו סטייל (אופטימיזציה)
        const mergedSegments = [];
        newSegments.forEach(seg => {
            const last = mergedSegments[mergedSegments.length - 1];

            if (
                last &&
                JSON.stringify(last.style) === JSON.stringify(seg.style)
            ) {
                last.text += seg.text;
            } else {
                mergedSegments.push({ ...seg });
            }
        });

        setSegments(mergedSegments);
        pushToHistory(mergedSegments);
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
                <button id="undo" onClick={handleUndo}>
                    Undo
                </button>

            </div>
        </>
    )
}
export default Editor;