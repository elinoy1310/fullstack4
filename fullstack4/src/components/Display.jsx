function Display({ segments, highlights }) {
  let currentIndex = 0;
  
  return (

    <div id="display-container">
      { 
      segments.map((seg, i) => {
        const segStart = currentIndex;
        const segEnd = currentIndex + seg.text.length;

        const children = [];
        let lastIndex = 0;

        highlights.forEach((h) => {
          const start = Math.max(h.start - segStart, 0);
          const end = Math.min(h.end - segStart, seg.text.length);

          if (start < seg.text.length && end > 0) {
            // text before highlight
            if (start > lastIndex) {
              children.push(seg.text.slice(lastIndex, start));
            }
            // highlighted text
            children.push(
              <span className="highlight" key={`${i}-${start}`} >
                {seg.text.slice(start, end)}
              </span>
            );
            lastIndex = end;
          }
        });

        // remaining non-highlighted text
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
    
  );
}

export default Display;