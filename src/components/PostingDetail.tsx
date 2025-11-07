import { useEffect, useState } from "react";
import { listLetters, listTraces, type Letter, type Trace } from "../lib/api";

export function PostingDetail({ postingId, onClose }: { postingId: number; onClose: () => void }) {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([listTraces(postingId), listLetters(postingId)])
      .then(([nextTraces, nextLetters]) => {
        setTraces(nextTraces);
        setLetters(nextLetters);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load detail"));
  }, [postingId]);

  return (
    <section style={{ borderTop: "1px solid #444", marginTop: 24, paddingTop: 16 }}>
      <button onClick={onClose}>Close</button>
      <h3>Posting #{postingId}</h3>
      {error && <p role="alert">{error}</p>}

      <h4>Agent trace</h4>
      <ol>
        {traces.map((trace, index) => (
          <li key={index}>
            <code>{trace.step}</code>
            {trace.detail && <p>{trace.detail}</p>}
          </li>
        ))}
        {traces.length === 0 && <p>No traces yet — run the scorer.</p>}
      </ol>

      <h4>Letters</h4>
      {letters.map((letter) => (
        <article key={letter.id}>
          <pre style={{ whiteSpace: "pre-wrap" }}>{letter.content}</pre>
        </article>
      ))}
      {letters.length === 0 && <p>No letters drafted yet.</p>}
    </section>
  );
}
