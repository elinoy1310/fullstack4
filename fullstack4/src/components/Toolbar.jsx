function Toolbar({ currentStyle, updateStyle, applyMode, setApplyMode }) {
  return (
    <div id="toolbar-container"    >
      <h3>Editing Tools</h3>

      {/* צבע */}
      <label>
        Color:
        <input
          type="color"
          value={currentStyle.color}
          onChange={(e) => updateStyle({ color: e.target.value })}
        />
      </label>

      {/* גודל */}
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

      {/* פונט */}
      <label  className="tool-lbl">
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
        </select>
      </label>

      <button
        onClick={() =>
          updateStyle({
            fontWeight:
              currentStyle.fontWeight === "bold" ? "normal" : "bold",
          })
        }
      >
        Bold
      </button>
      

      {/* מצב */}
      <div >
        <button onClick={() => setApplyMode("all")}>
          Apply to All
        </button>

        <button onClick={() => setApplyMode("future")}>
          From Now On
        </button>
      </div>
    </div>
  );
}

export default Toolbar;