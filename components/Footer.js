import { site } from "../data/site";
export default function Footer() {
  return (
    <footer className="rule overflow-hidden pt-10">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 pb-6 text-xs font-bold uppercase tracking-[.18em] text-mute">
        <span data-build>© {new Date().getFullYear()} {site.name}</span>
        <span data-build className="max-sm:hidden">Built with Next.js · Tailwind · Framer Motion</span>
        <a data-build href="#top" className="hover:text-paper">Back to top ↑</a>
      </div>
      <p data-build className="display select-none whitespace-nowrap text-center text-[clamp(3rem,15.5vw,18rem)] leading-[.8] text-paper/[.04]" aria-hidden="true">Saad Naeem</p>
    </footer>
  );
}
