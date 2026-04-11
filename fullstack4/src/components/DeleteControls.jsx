function DeleteControls({ onDeleteChar, onDeleteWord, onClear }) {
  return (
    <div id="delete-controls-inner">
      <h3>Quick Actions</h3>
      <div id="delete-buttons" >
          <button className="delete-btn" onClick={onDeleteChar}>Delete Char</button>
          <button className="delete-btn" onClick={onDeleteWord}>Delete Word</button>
          <button className="delete-btn" onClick={onClear}>Clear All</button>
      </div>
    </div>
  );
}

export default DeleteControls;