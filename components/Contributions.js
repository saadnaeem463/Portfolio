"use client";
import { useEffect, useState } from "react";
import { site } from "../data/site";

const COLORS = ["#1a1a1a", "#4a1219", "#7d1a26", "#b8212f", "#e32b3c"];

export default function Contributions() {
  const [state, setState] = useState({ status: "loading" });
  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${site.githubUser}?y=last`)
      .then((r) => r.json())
      .then((d) => {
        const days = d.contributions || [];
        const weeks = []; let wk = new Array(new Date(days[0]?.date).getDay() || 0).fill(null);
        days.forEach((day) => { wk.push(day); if (wk.length === 7) { weeks.push(wk); wk = []; } });
        if (wk.length) weeks.push(wk);
        setState({ status: "ok", weeks, total: days.reduce((n, x) => n + x.count, 0) });
      })
      .catch(() => setState({ status: "error" }));
  }, []);
  return (
    <div className="rounded-[4px] border border-line p-6">
      {state.status === "loading" && <p className="text-mute">Loading contributions…</p>}
      {state.status === "error" && <p className="text-mute">Couldn&apos;t load the graph right now. <a className="underline" href={site.github} target="_blank" rel="noopener noreferrer">See it on GitHub</a>.</p>}
      {state.status === "ok" && (
        <>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-[3px]">
              {state.weeks.map((w, i) => (
                <div key={i} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }).map((_, j) => {
                    const d = w[j];
                    return <i key={j} title={d ? `${d.count} on ${d.date}` : ""} className="block h-[11px] w-[11px] rounded-[2px]" style={{ background: d ? COLORS[d.level] : "transparent" }} />;
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm text-mute">{state.total} contributions in the last year</p>
        </>
      )}
    </div>
  );
}
