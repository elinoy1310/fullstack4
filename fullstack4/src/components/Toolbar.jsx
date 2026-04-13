function Toolbar({ currentStyle, updateStyle, applyMode, setApplyMode }) {
  return (
    <div id="toolbar-container"    >
      <h3>Editing Tools</h3>

      <label>
        Color:
        <input
          type="color"
          value={currentStyle.color}
          onChange={(e) => updateStyle({ color: e.target.value })}
        />
      </label>

      <label className="tool-lbl" >
        Size:
        <input
          type="number"
          value={parseInt(currentStyle.fontSize)}
          onChange={(e) =>
            updateStyle({ fontSize: e.target.value + "px" })
          }
        />
      </label>

      <label className="tool-lbl">
        Font:
        <select
          value={currentStyle.fontFamily}
          onChange={(e) =>
            updateStyle({ fontFamily: e.target.value })
          }
        >
          <option>Arial</option>
          <option>Courier New</option>
          <option>Times New Roman</option>
          <option value="Impact">Impact</option>
          <option value="Georgia">Georgia</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Brush Script MT">Brush Script MT</option>
        </select>
      </label>

      <button className={currentStyle.fontWeight === "bold" ? "bold-clicked" : ""}
        onClick={() =>
          updateStyle({
            fontWeight:
              currentStyle.fontWeight === "bold" ? "normal" : "bold",
          })
        }
      >
        Bold
      </button>

      <div className="mode-toggle-container">
        <div className={`toggle-slider ${applyMode}`}></div>

        <button
          id="apply-all-btn"
          type="button"
          className={`toggle-btn ${applyMode === "all" ? "active" : ""}`}
          onClick={() => setApplyMode("all")}
        >
          Apply to All
        </button>

        <button
          type="button"
          className={`toggle-btn ${applyMode === "future" ? "active" : ""}`}
          onClick={() => setApplyMode("future")}
        >
          From Now On
        </button>
      </div>
    </div>
  );
}

export default Toolbar;