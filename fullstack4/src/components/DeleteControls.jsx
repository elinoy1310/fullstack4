function DeleteControls({ onDeleteChar, onDeleteWord, onClear }) {
  return (
    <div id="delete-controls" >
      <h3>Delete</h3>

      <button onClick={onDeleteChar}>Delete Char</button>
      <button className="delete-btn" onClick={onDeleteWord}>
        Delete Word
      </button>
      <button className="delete-btn" onClick={onClear}>
        Clear All
      </button>
    </div>
  );
}

export default DeleteControls;