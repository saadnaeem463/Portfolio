// A build block: hidden until the Swarm agents "build" it (see Swarm.js). Visible normally once the site is live.
export default function Reveal({ children, className = "", as: Tag = "div" }) {
  return <Tag data-build className={className}>{children}</Tag>;
}
