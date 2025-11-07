import { useEffect, useState } from "react";
import {
  listPostings,
  listScores,
  scorePosting,
  type Posting,
  type Score,
} from "./lib/api";
import { PostingDetail } from "./components/PostingDetail";

type Tab = "pipeline" | "postings";

export function App() {
  const [tab, setTab] = useState<Tab>("pipeline");
  const [postings, setPostings] = useState<Posting[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  async function refresh() {
    try {
      const [nextPostings, nextScores] = await Promise.all([listPostings(), listScores()]);
      setPostings(nextPostings);
      setScores(nextScores);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const scoreByPosting = new Map(scores.map((score) => [score.posting_id, score]));
  const newPostings = postings.filter((posting) => !scoreByPosting.has(posting.id));
  const scored = postings.filter((posting) => scoreByPosting.has(posting.id));

  async function onScore(postingId: number) {
    await scorePosting(postingId);
    await refresh();
  }

  return (
    <main>
      <h1>Jobcopilot</h1>
      <nav>
        <button onClick={() => setTab("pipeline")}>Pipeline</button>
        <button onClick={() => setTab("postings")}>Postings</button>
      </nav>
      {error && <p role="alert">{error}</p>}

      {tab === "pipeline" && (
        <div style={{ display: "flex", gap: 16 }}>
          <section style={{ minWidth: 260 }}>
            <h2>New ({newPostings.length})</h2>
            <ul>
              {newPostings.map((posting) => (
                <li key={posting.id}>
                  <strong>{posting.title}</strong> @ {posting.company}
                  <button onClick={() => onScore(posting.id)}>Score</button>
                  <button onClick={() => setSelected(posting.id)}>Detail</button>
                </li>
              ))}
            </ul>
          </section>
          <section style={{ minWidth: 260 }}>
            <h2>Scored ({scored.length})</h2>
            <ul>
              {scored.map((posting) => {
                const score = scoreByPosting.get(posting.id) as Score;
                return (
                  <li key={posting.id}>
                    <span style={{ fontWeight: "bold" }}>[{Math.round(score.score)}]</span>{" "}
                    {posting.title} @ {posting.company}
                    <button onClick={() => setSelected(posting.id)}>Detail</button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}

      {tab === "postings" && (
        <ul>
          {postings.map((posting) => (
            <li key={posting.id}>
              <a href={posting.url} target="_blank" rel="noreferrer">
                {posting.title}
              </a>{" "}
              @ {posting.company} · {posting.source}
            </li>
          ))}
        </ul>
      )}

      {selected !== null && (
        <PostingDetail postingId={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
