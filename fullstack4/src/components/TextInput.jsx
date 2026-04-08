function TextInput({ text, onChange }) {
  return (
    <div style={{ marginBottom: "20px"}}>
      <textarea
        value={text}
        onChange={(e) =>{ onChange(e.target.value)}}
        
        placeholder="Type here..."
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          fontSize: "16px",
          fontFamily: "Arial",
        }}
      />
    </div>
  );
}

export default TextInput;