function Nav({ onOpenPalette }) {
  const ids = ['hero', 'about', 'projects', 'pipeline', 'architecture', 'skills', 'contact'];
  const labels = {
    hero: 'Home',
    about: 'About',
    projects: 'Work',
    pipeline: 'Delivery',
    architecture: 'Infra',
    skills: 'Stack',
    contact: 'Contact',
  };
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'pt-3' : 'pt-5'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-3 py-2 transition-all duration-300 ${
            scrolled ? 'glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]' : 'glass'
          }`}
        >
          {/* Brand */}
          <a href="#hero" className="flex items-center gap-2.5 pl-2 group">
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-iris-500 to-iris-700 text-white font-mono text-[13px] font-bold">
              AK
              <span className="absolute inset-0 rounded-md ring-1 ring-white/20" />
            </span>
            <span className="hidden sm:block font-mono text-[13px] tracking-tight">
              <span className="text-zinc-400">~/</span>
              <span className="text-zinc-100">adithya</span>
              <span className="text-iris-400">.dev</span>
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {ids.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={`relative px-3 py-1.5 text-[13px] rounded-lg transition-colors ${
                  active === id
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {active === id && (
                  <span className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]" />
                )}
                <span className="relative">{labels[id]}</span>
              </a>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPalette}
              className="hidden sm:flex items-center gap-2 text-[12px] text-zinc-400 hover:text-zinc-200 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] px-2.5 py-1.5 transition-colors"
            >
              <Icons.Search size={13} />
              <span className="font-mono text-[11px]">jump to…</span>
              <kbd className="font-mono text-[10px] text-zinc-500 border border-white/[0.08] rounded px-1 py-[1px]">
                ⌘K
              </kbd>
            </button>
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-1.5 rounded-lg bg-iris-500 hover:bg-iris-400 text-white text-[12px] font-medium px-3 py-1.5 transition-colors shadow-[0_8px_24px_-6px_rgba(99,102,241,0.6)]"
            >
              Get in touch
              <Icons.ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

window.Nav = Nav;
