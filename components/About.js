import { site, stack, education } from "../data/site";
import Reveal from "./Reveal";

export default function About() {
  return (
    <>
      <section id="about" className="sec rule">
        <div className="wrap grid gap-12 md:grid-cols-[1fr_1.3fr]">
          <div>
            <p data-build className="kicker mb-3 w-fit">02 — About</p>
            <h2 data-build className="display w-fit text-[clamp(3rem,8vw,7rem)]">Full-stack<br />+ <span className="text-red">ML</span></h2>
          </div>
          <div className="space-y-8">
            <p data-build className="text-lg leading-relaxed text-paper/85">{site.bio}</p>
            {education.map((e) => (
              <div data-build key={e.title} className="rule pt-6">
                <p className="kicker">{e.period}</p>
                <h3 className="display mt-2 text-4xl">{e.title}</h3>
                <p className="mt-1 text-paper/80">{e.sub}</p>
                <p className="mt-1 text-sm">{e.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tech" className="sec rule">
        <div className="wrap">
          <div className="mb-12">
            <p data-build className="kicker mb-3 w-fit">03 — Toolbox</p>
            <h2 data-build className="display w-fit text-[clamp(3rem,8vw,7rem)]">Tech <span className="outline-text">stack</span></h2>
          </div>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6">
            {stack.map(([n, i]) => (
              <li data-build key={n} className="group flex flex-col items-center gap-3 rounded-[4px] border border-line bg-ink p-5 transition-colors hover:bg-[#141414]">
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
