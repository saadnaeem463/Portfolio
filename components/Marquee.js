import { stack } from "../data/site";
export default function Marquee() {
  const names = stack.map(([n]) => n);
  return (
    <div data-build className="marquee rule border-b border-line py-5" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {names.map((n) => <span key={n + k} className="display flex items-center text-3xl text-paper/80 sm:text-4xl">{n}<i className="mx-6 text-red not-italic">✦</i></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
