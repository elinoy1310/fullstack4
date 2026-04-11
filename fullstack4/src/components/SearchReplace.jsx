import { useState } from "react";

function SearchReplace({ onFind, onReplace }) {
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");

  return (
    <div id="search-replace-container" >
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
      />

      <div>
        <button onClick={() => onFind(search)}>Find</button>

        <button
          onClick={() => onReplace(search, replace)}
        >
          Replace
        </button>
      </div>
    </div>
  );
}

export default SearchReplace;