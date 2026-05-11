// Hero: animated terminal with typewriter
const TERM_SCRIPT = [
  { type: 'prompt', cmd: 'whoami' },
  { type: 'out', text: 'adithya kahawanugoda — software engineer', accent: true },
  { type: 'out', text: 'MSc IT · Software Architecture · RMIT (Melbourne)' },
  { type: 'out', text: 'BSc (Hons) Software Engineering · SLIIT (Sri Lanka)' },
  { type: 'spacer' },
  { type: 'prompt', cmd: 'cat focus.yaml' },
  { type: 'out', text: 'backend     : node · nestjs · graphql · rest' },
  { type: 'out', text: 'infra       : aws · docker · kubernetes · terraform' },
  { type: 'out', text: 'frontend    : react · next.js · typescript' },
  { type: 'out', text: 'data        : mysql · mongodb · elasticsearch' },
  { type: 'spacer' },
  { type: 'prompt', cmd: './availability --check' },
  { type: 'out', text: '✓ open to full-time roles', accent: true },
  { type: 'out', text: '✓ Melbourne · remote (APAC/global)' },
  { type: 'cursor' },
];

function useTypewriter(script, { speed = 22, pauseBetween = 280 } = {}) {
  const [lines, setLines] = useState([]); // [{type, text, accent, done}]
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeouts = [];
    const schedule = (fn, ms) => {
      const t = setTimeout(fn, ms);
      timeouts.push(t);
    };

    const run = async () => {
      for (let i = 0; i < script.length; i++) {
        if (cancelled) return;
        const item = script[i];
        if (item.type === 'spacer') {
          setLines((prev) => [...prev, { ...item, done: true }]);
          await new Promise((r) => schedule(r, 80));
          continue;
        }
        if (item.type === 'cursor') {
          setLines((prev) => [...prev, { ...item, done: true }]);
          setDone(true);
          continue;
        }
        const text = item.cmd ?? item.text ?? '';
        setLines((prev) => [...prev, { ...item, text: '', done: false }]);
        for (let c = 1; c <= text.length; c++) {
          if (cancelled) return;
          await new Promise((r) => schedule(r, speed));
          setLines((prev) => {
            const next = prev.slice();
            next[next.length - 1] = { ...next[next.length - 1], text: text.slice(0, c) };
            return next;
          });
        }
        setLines((prev) => {
          const next = prev.slice();
          next[next.length - 1] = { ...next[next.length - 1], done: true };
          return next;
        });
        await new Promise((r) => schedule(r, pauseBetween));
      }
    };
    run();
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return { lines, done };
}

function TerminalWindow() {
  const { lines, done } = useTypewriter(TERM_SCRIPT);
  return (
    <div className="glass-strong term-glow rounded-2xl overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.06] bg-black/30">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="font-mono text-[10.5px] text-zinc-500 tracking-wider">
          adithya@portfolio: <span className="text-zinc-400">~</span> — zsh
        </div>
        <div className="font-mono text-[10.5px] text-zinc-500">
          {done ? 'idle' : 'running…'}
        </div>
      </div>
      {/* Body */}
      <div className="px-4 py-4 md:px-5 md:py-5 font-mono text-[12.5px] md:text-[13px] leading-relaxed min-h-[360px]">
        {lines.map((l, i) => {
          if (l.type === 'spacer') return <div key={i} className="h-3" />;
          if (l.type === 'prompt') {
            return (
              <div key={i} className="flex gap-2 text-zinc-300">
                <span className="text-iris-400">❯</span>
                <span className="text-zinc-200">{l.text || l.cmd}</span>
                {!l.done && <span className="cursor-blink" />}
              </div>
            );
          }
          if (l.type === 'out') {
            return (
              <div key={i} className={`pl-4 ${l.accent ? 'text-iris-300' : 'text-zinc-400'}`}>
                {l.text}
                {!l.done && <span className="cursor-blink" />}
              </div>
            );
          }
          if (l.type === 'cursor') {
            return (
              <div key={i} className="flex gap-2 text-zinc-300 mt-1">
                <span className="text-iris-400">❯</span>
                <span className="cursor-blink" />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

// Live-stat side panel
function VitalsPanel() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (d) =>
    d.toLocaleTimeString('en-AU', { timeZone: 'Australia/Melbourne', hour12: false });

  const rows = [
    { k: 'location', v: 'Melbourne, AU', dot: true },
    { k: 'local_time', v: fmt(time), mono: true },
    { k: 'status', v: 'open to roles', accent: true },
    { k: 'years_exp', v: '4+ years' },
    { k: 'last_commit', v: '2 hours ago' },
  ];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 uppercase tracking-[0.18em]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          live signals
        </div>
        <div className="font-mono text-[10px] text-zinc-500">v1.0.0</div>
      </div>
      <dl className="space-y-2">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between text-[12.5px]">
            <dt className="font-mono text-zinc-500">{r.k}</dt>
            <dd
              className={`flex items-center gap-1.5 ${
                r.accent ? 'text-iris-300' : r.mono ? 'font-mono text-zinc-200' : 'text-zinc-200'
              }`}
            >
              {r.dot && <span className="h-1 w-1 rounded-full bg-iris-400" />}
              {r.v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}


function Hero() {
  return (
    <section id="hero" className="relative pt-32 md:pt-36 pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl px-4 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-6 relative">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-zinc-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                available · graduating 2025
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[44px] sm:text-6xl lg:text-[70px] leading-[0.98] font-semibold tracking-[-0.02em]">
                <span className="gradient-text">Build resilient,</span>
                <br />
                <span className="gradient-text">cloud-native </span>
                <span className="iris-text">systems</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 text-zinc-400 text-[15.5px] leading-relaxed max-w-xl">
                I&rsquo;m <span className="text-zinc-200">Adithya</span>, a Melbourne-based
                full-stack software engineer with 4+ years of professional experience. I design
                GraphQL and REST APIs built for scale, ship end-to-end HRIS and platform
                features, and manage cloud infrastructure that recovers automatically
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 rounded-lg bg-iris-500 hover:bg-iris-400 text-white text-[13px] font-medium px-4 py-2.5 shadow-[0_10px_36px_-8px_rgba(99,102,241,0.65)] transition-colors"
                >
                  See selected work
                  <Icons.ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#pipeline"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-zinc-200 text-[13px] font-medium px-4 py-2.5 transition-colors"
                >
                  <Icons.Play size={12} />
                  Watch a deploy
                </a>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { k: 'shipped', v: '24+', s: 'services' },
                  { k: 'p99 latency', v: '<120ms', s: 'in prod' },
                  { k: 'uptime', v: '99.95%', s: 'rolling 90d' },
                ].map((stat) => (
                  <div key={stat.k} className="glass rounded-xl p-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{stat.k}</div>
                    <div className="mt-1 text-xl font-semibold text-white">{stat.v}</div>
                    <div className="font-mono text-[10.5px] text-zinc-500">{stat.s}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: terminal + vitals */}
          <div className="lg:col-span-6 relative">
            <Reveal delay={120}>
              <TerminalWindow />
            </Reveal>
            <Reveal delay={260} className="mt-4">
              <VitalsPanel />
            </Reveal>
          </div>
        </div>

        {/* Tech belt */}
        <div className="mt-20 marquee">
          <div className="marquee-track gap-10 text-zinc-500/90 font-mono text-[12px] tracking-wider uppercase">
            {Array(2)
              .fill(0)
              .flatMap((_, i) =>
                [
                  'TypeScript',
                  'JavaScript',
                  'Node.js',
                  'NestJS',
                  'GraphQL',
                  'REST',
                  'React',
                  'Next.js',
                  'MySQL',
                  'MongoDB',
                  'Elasticsearch',
                  'Docker',
                  'Kubernetes',
                  'GitHub Actions',
                  'Bitbucket Pipelines',
                  'AWS',
                  'Terraform',
                ].map((t) => (
                  <span key={`${t}-${i}`} className="inline-flex items-center gap-3 pr-10 whitespace-nowrap">
                    <span className="h-1 w-1 rounded-full bg-iris-400/60" />
                    {t}
                  </span>
                )),
              )}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
