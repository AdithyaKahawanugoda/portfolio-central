// Command palette (⌘K) for navigation
const PALETTE_ITEMS = [
  { id: 'hero', label: 'Home', sub: 'top of page', section: 'go to', icon: 'ArrowUpRight' },
  { id: 'about', label: 'About', sub: 'timeline & journey', section: 'go to', icon: 'Map' },
  { id: 'projects', label: 'Selected work', sub: '2 projects', section: 'go to', icon: 'Layers' },
  { id: 'pipeline', label: 'Delivery pipeline', sub: 'live ci/cd render', section: 'go to', icon: 'GitBranch' },
  { id: 'architecture', label: 'Infrastructure', sub: 'interactive diagram', section: 'go to', icon: 'Cloud' },
  { id: 'skills', label: 'Stack', sub: 'technologies', section: 'go to', icon: 'Cpu' },
  { id: 'contact', label: 'Contact', sub: 'email, github, linkedin', section: 'go to', icon: 'Mail' },
  { id: 'mail', label: 'Send email', sub: 'adithyakahawanugoda@gmail.com', section: 'actions', icon: 'Mail', external: 'mailto:adithyakahawanugoda@gmail.com' },
  { id: 'github', label: 'Open GitHub', sub: 'see all repos', section: 'actions', icon: 'Github', external: 'https://github.com/AdithyaKahawanugoda' },
  { id: 'linkedin', label: 'Open LinkedIn', sub: 'connect with me', section: 'actions', icon: 'Linkedin', external: 'https://www.linkedin.com/in/adithya-kahawanugoda-839116185' },
];

function Palette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PALETTE_ITEMS;
    return PALETTE_ITEMS.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.sub.toLowerCase().includes(q) ||
        i.section.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    setCursor(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor((c) => (c + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor((c) => (c - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filtered[cursor];
        if (item) handle(item);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, cursor, filtered]);

  if (!open) return null;

  const handle = (item) => {
    if (item.external) {
      window.location.href = item.external;
    } else {
      const el = document.getElementById(item.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onClose();
  };

  const grouped = filtered.reduce((acc, item, i) => {
    (acc[item.section] = acc[item.section] || []).push({ ...item, _idx: i });
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-xl glass-strong rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <Icons.Search size={15} className="text-zinc-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to section, or run an action…"
            className="flex-1 bg-transparent outline-none text-[14px] text-zinc-100 placeholder-zinc-600"
          />
          <kbd className="font-mono text-[10px] text-zinc-500 border border-white/[0.08] rounded px-1.5 py-[2px]">ESC</kbd>
        </div>
        <div className="max-h-[420px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-zinc-500 text-[13px]">No matches.</div>
          )}
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="pb-1.5">
              <div className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600">{section}</div>
              {items.map((item) => {
                const I = Icons[item.icon] || Icons.ArrowRight;
                const isActive = item._idx === cursor;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setCursor(item._idx)}
                    onClick={() => handle(item)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                      isActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${isActive ? 'bg-iris-500/20 text-iris-300' : 'bg-white/[0.04] text-zinc-400'}`}>
                      <I size={13} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] ${isActive ? 'text-white' : 'text-zinc-200'}`}>{item.label}</div>
                      <div className="text-[11.5px] text-zinc-500 truncate">{item.sub}</div>
                    </div>
                    {isActive && (
                      <Icons.ArrowRight size={13} className="text-iris-300 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-white/[0.06] text-[10.5px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <kbd className="border border-white/[0.08] rounded px-1 py-[1px]">↑↓</kbd>
              navigate
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="border border-white/[0.08] rounded px-1 py-[1px]">↵</kbd>
              select
            </span>
          </div>
          <span>portfolio · v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

window.Palette = Palette;
