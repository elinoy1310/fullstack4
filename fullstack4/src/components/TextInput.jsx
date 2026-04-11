function TextInput({ text, onChange }) {
  return (
    <div id="text-input-container">
      <textarea
        value={text}
        onChange={(e) =>{ onChange(e.target.value)}}
        placeholder="Type here..."
      />
    </div>
  );
}

export default TextInput;