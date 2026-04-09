import { useState } from "react";

function FileBar({
    files,
    onSave,
    onSaveAs,
    onLoad,
    onNew,
    currentFile,
}) {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredFiles = files.filter((f) =>
        f.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <button onClick={onNew}>New</button>

            <h3>File: {currentFile || "Untitled"}</h3>

            <button onClick={onSave}>Save</button>

            <button
                onClick={() => {
                    const name = prompt("Enter file name:");
                    if (name) onSaveAs(name);
                }}
                style={{ marginLeft: "5px" }}
            >
                Save As
            </button>

            <div style={{ marginTop: "10px", position: "relative" }}>
                <input
                    placeholder="Open file..."
                    value={search}
                    onFocus={() => setShowDropdown(true)}

                    onBlur={() => {
                        setTimeout(() => setShowDropdown(false), 150);
                    }}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            setShowDropdown(false);
                        }
                    }}
                />
                {showDropdown && (
                    <div
                        style={{
                            border: "1px solid black",
                            maxHeight: "100px",
                            overflowY: "auto",
                            background: "white",
                            position: "absolute",
                            width: "200px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 10,
                        }}
                    >
                        {filteredFiles.map((file, i) => (
                            <div
                                key={i}
                                style={{ padding: "5px", cursor: "pointer" }}
                                // onClick={() => {
                                //   onLoad(file);
                                //   setSearch("");
                                //   setShowDropdown(false);
                                // }}
                                onMouseDown={() => {
                                    onLoad(file);
                                    setSearch("");
                                    setShowDropdown(false);
                                }}
                            >
                                {file}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileBar;