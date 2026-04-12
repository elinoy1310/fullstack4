import { useState } from "react";

import FileMenu from "./components/FileMenu";
import Display from "./components/Display";
import Editor from "./components/Editor";

function App() {
  const defaultStyle = {
    color: "#000000",
    fontSize: "16px",
    fontFamily: "Arial",
    fontWeight: "normal",
  }

  const [segments, setSegments] = useState([
    {
      text: "",
      style: defaultStyle
    },
  ]);

  const [currentStyle, setCurrentStyle] = useState(defaultStyle);

  const [history, setHistory] = useState([
    [
      {
        text: "",
        style: {
          color: "#000000",
          fontSize: "16px",
          fontFamily: "Arial",
          fontWeight: "normal"
        },
      },
    ],
  ]);

  const [highlights, setHighlights] = useState([]);
  const [currentFile, setCurrentFile] = useState("");

  return (
    <div id="main-app">
      <FileMenu segments={segments}
                setSegments={setSegments}
                currentStyle={currentStyle}
                defaultStyle={defaultStyle}
                setCurrentStyle={setCurrentStyle}
                setHistory={setHistory} 
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                />
      <h1>Display</h1>
      <Display segments={segments} highlights={highlights} fileName={currentFile} />
      <Editor segments={segments}
              setSegments={setSegments}
              currentStyle={currentStyle}
              setCurrentStyle={setCurrentStyle}
              setHistory={setHistory}
              setHighlights={setHighlights} />
    </div>
  );
}

export default App;