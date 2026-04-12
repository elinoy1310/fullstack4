function Display({ segments, highlights, fileName }) {
  let currentIndex = 0;

  return (
    <div >

      {fileName && <h2 id="file-name">File Name: {fileName}</h2>}
      
    <div id="display-container">
      {segments.map((seg, i) => {
        const segStart = currentIndex;
        const segEnd = currentIndex + seg.text.length;

        const children = [];
        let lastIndex = 0;

        highlights.forEach((h) => {
          const start = Math.max(h.start - segStart, 0);
          const end = Math.min(h.end - segStart, seg.text.length);

          if (start < seg.text.length && end > 0) {
            // טקסט לפני ההדגשה
            if (start > lastIndex) {
              children.push(seg.text.slice(lastIndex, start));
            }
            // טקסט מודגש
            children.push(
              <span className="highlight" key={`${i}-${start}`} >
                {seg.text.slice(start, end)}
              </span>
            );
            lastIndex = end;
          }
        });

        // טקסט אחרון שלא מודגש
        if (lastIndex < seg.text.length) {
          children.push(seg.text.slice(lastIndex));
        }

        currentIndex = segEnd;

        return (
          <span key={i} style={seg.style}>
            {children.length > 0 ? children : seg.text}
          </span>
        );
      })}
    </div>
    </div>
  );
}

export default Display;