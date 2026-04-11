import { useState } from "react";

import FileMenu from "./components/FileMenu";
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

  return (
    <div id="main-app">
      <FileMenu segments={segments}
                setSegments={setSegments}
                currentStyle={currentStyle}
                defaultStyle={defaultStyle}
                setCurrentStyle={setCurrentStyle}
                setHistory={setHistory} 
                />

      <Editor segments={segments}
              setSegments={setSegments}
              currentStyle={currentStyle}
              setCurrentStyle={setCurrentStyle}
              setHistory={setHistory} />
    </div>
  );
}

export default App;