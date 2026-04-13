import Display from "./Display";

function FullDisplay({ docs, setActiveDocId, handleCloseDoc, activeDocId }) {
    return (
        <>
            <h1>Display</h1>
            <div id="full-display-container">

                {/* 🔼 Top row - minimized documents */}
                <div className="docs-row-top">
                    {docs
                        .filter(doc => doc.id !== activeDocId)
                        .map(doc => (
                            <div
                                key={doc.id}
                                className="doc doc-minimized"
                                onClick={() => setActiveDocId(doc.id)}
                            >
                                <strong>{doc.name}</strong>
                            </div>
                        ))}
                </div>

                {/* 🔽 Active document */}
                <div className="doc doc-active">
                    {docs
                        .filter(doc => doc.id === activeDocId)
                        .map(doc => (
                            <div className="active-doc-card" key={doc.id}>

                                <div className="doc-header">
                                    <strong>{doc.name}</strong>
                                    <button className="close-btn"
                                        onClick={() => handleCloseDoc(doc.id)}
                                    >
                                        ✕
                                    </button>
                                </div>


                                {/* Document text display */}
                                <Display segments={doc.segments} highlights={doc.highlights} />
                            </div>
                        ))}
                </div>
            </div>

        </>

    );

}

export default FullDisplay;