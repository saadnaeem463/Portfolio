import { site, stack, education } from "../data/site";
import Reveal from "./Reveal";

export default function About() {
  return (
    <>
      <section id="about" className="sec rule">
        <div className="wrap grid gap-12 md:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <p className="kicker mb-3">02 — About</p>
            <h2 className="display text-[clamp(3rem,8vw,7rem)]">Full-stack<br />+ <span className="text-red">ML</span></h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-8">
            <p className="text-lg leading-relaxed text-paper/85">{site.bio}</p>
            {education.map((e) => (
              <div key={e.title} className="rule pt-6">
                <p className="kicker">{e.period}</p>
                <h3 className="display mt-2 text-4xl">{e.title}</h3>
                <p className="mt-1 text-paper/80">{e.sub}</p>
                <p className="mt-1 text-sm">{e.note}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="tech" className="sec rule">
        <div className="wrap">
          <Reveal className="mb-12">
            <p className="kicker mb-3">03 — Toolbox</p>
            <h2 className="display text-[clamp(3rem,8vw,7rem)]">Tech <span className="outline-text">stack</span></h2>
          </Reveal>
          <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-4 md:grid-cols-6">
            {stack.map(([n, i]) => (
              <li key={n} className="group flex flex-col items-center gap-3 bg-ink p-5 transition-colors hover:bg-[#141414]">
                <img src={i} alt="" width="44" height="44" loading="lazy" className="h-11 w-11 grayscale transition duration-300 group-hover:grayscale-0" />
                <span className="text-center text-[11px] font-bold uppercase tracking-[.14em] text-mute group-hover:text-paper">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
