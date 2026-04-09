import { useState } from "react";

function SearchReplace({ onFind, onReplace }) {
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <h3>Search & Replace</h3>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        placeholder="Replace..."
        value={replace}
        onChange={(e) => setReplace(e.target.value)}
        style={{ marginLeft: "5px" }}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => onFind(search)}>Find</button>

        <button
          onClick={() => onReplace(search, replace)}
          style={{ marginLeft: "5px" }}
        >
          Replace
        </button>
      </div>
    </div>
  );
}

export default SearchReplace;