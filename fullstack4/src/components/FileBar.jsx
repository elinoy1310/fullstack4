import { useState } from "react";

function FileBar({ files, onSave, onSaveAs, onLoad, onNew, currentFile }) {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredFiles = files.filter((f) =>
        f.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div id="file-bar-container">
            <button onClick={onNew}>New</button>
            <button onClick={onSave}>Save</button>
            <button
                onClick={() => {
                    const name = prompt("Enter file name:");
                    if (name) onSaveAs(name);
                }}
                >
                Save As
            </button>
            {currentFile && <h3>File: {currentFile}</h3>}

            <div id="file-search-container">
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
                    <div className="file-dropdown">
                        {filteredFiles.map((file, i) => (
                            <div
                                className="file-dropdown-item"
                                key={i}
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