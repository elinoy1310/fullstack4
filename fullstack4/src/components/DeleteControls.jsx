function DeleteControls({ onDeleteChar, onDeleteWord, onClear }) {
  return (
    <div style={{ marginTop: "10px", textAlign: "center" }}>
      <h3>Delete</h3>

      <button onClick={onDeleteChar}>Delete Char</button>
      <button onClick={onDeleteWord} style={{ marginLeft: "5px" }}>
        Delete Word
      </button>
      <button onClick={onClear} style={{ marginLeft: "5px" }}>
        Clear All
      </button>
    </div>
  );
}

export default DeleteControls;