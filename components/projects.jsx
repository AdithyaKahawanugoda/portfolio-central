// Projects: showcase cards + expandable detail panels for the 2 projects
const PROJECTS = [
  {
    id: 'resume-analyzer',
    name: 'AI Resume & Portfolio Analyzer',
    tagline: 'LLM-driven feedback for engineers, with structured rubrics.',
    blurb:
      'Upload a resume and portfolio URL and get back a section-by-section critique scored against role-specific rubrics, plus rewritten bullet points. Built around a deterministic eval harness so prompt changes never silently regress.',
    role: 'Solo · Full-stack & infra',
    period: '2025 · 4 mo',
    status: 'beta',
    accent: 'iris',
    icon: 'Brain',
    metrics: [
      { k: 'avg eval latency', v: '4.2s' },
      { k: 'rubric coverage', v: '94%' },
      { k: 'deterministic tests', v: '128' },
    ],
    stack: [
      { g: 'frontend', items: ['Next.js 14', 'TypeScript', 'Tailwind', 'shadcn/ui'] },
      { g: 'backend', items: ['NestJS', 'MySQL', 'MongoDB'] },
      { g: 'ai', items: ['OpenAI', 'Anthropic'] },
      { g: 'infra', items: ['Docker', 'GH Actions', 'AWS ECS', 'CloudFront'] },
    ],
    highlights: [
      'Structured-output JSON schemas with retry-on-validate, so the UI never has to parse free text.',
      'Background worker pool isolates LLM calls; the UI stays sub-200ms while reviews stream in.',
      'Eval harness scores every prompt change against a frozen test set before it merges.',
    ],
    flow: ['Upload', 'Parse', 'Embed', 'Score', 'Rewrite', 'Render'],
    links: [
      { label: 'github', icon: 'Github', href: '#' },
      { label: 'live demo', icon: 'ExternalLink', href: '#' },
    ],
  },
  {
    id: 'api-perf',
    name: 'API Performance Testing Platform',
    tagline: 'Self-hosted load testing with real-time pressure graphs.',
    blurb:
      'A k6-based platform that lets backend teams script realistic traffic shapes, watch p50/p95/p99 react live, and replay regressions against any environment. Pipelines fail the build if latency budgets break.',
    role: 'Solo · Backend & DX',
    period: '2024 · ongoing',
    status: 'production',
    accent: 'cyan',
    icon: 'Gauge',
    metrics: [
      { k: 'sustained RPS', v: '24k' },
      { k: 'agents / region', v: '8' },
      { k: 'p99 budget gate', v: '<150ms' },
    ],
    stack: [
      { g: 'frontend', items: ['React', 'Vite', 'TanStack Query', 'Recharts'] },
      { g: 'backend', items: ['Go', 'Node.js', 'gRPC', 'NATS'] },
      { g: 'data', items: ['TimescaleDB', 'ClickHouse', 'S3'] },
      { g: 'infra', items: ['k6', 'Docker', 'Terraform', 'AWS Fargate'] },
    ],
    highlights: [
      'Distributed agents stream metrics over NATS; ingest sustains 200k samples/sec without backpressure.',
      'Time-series storage split: ClickHouse for hot p99 rollups, S3 + Parquet for cold replays.',
      'Latency-budget gate sits in GitHub Actions: PRs that regress p99 simply can\u2019t merge.',
    ],
    flow: ['Script', 'Spin agents', 'Stream', 'Aggregate', 'Score', 'Gate'],
    links: [
      { label: 'github', icon: 'Github', href: '#' },
      { label: 'case study', icon: 'ExternalLink', href: '#' },
    ],
  },
];

function ProjectThumb({ p, expanded }) {
  // Visual: a placeholder UI sketch unique-ish to each project
  if (p.id === 'resume-analyzer') {
    return (
      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-iris-500/[0.06] to-transparent">
        {/* Faux UI */}
        <div className="absolute inset-0 p-4 flex gap-3">
          <div className="w-1/3 glass rounded-md p-2.5 flex flex-col gap-1.5">
            <div className="h-1.5 w-12 rounded-full bg-zinc-700/80" />
            <div className="mt-1 space-y-1">
              {[68, 82, 54, 76, 60].map((w, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-iris-400/80" />
                  <span className="h-1 rounded-full bg-zinc-700/70" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 glass rounded-md p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="h-1.5 w-16 rounded-full bg-zinc-700" />
              <div className="font-mono text-[8px] text-iris-300">8.4 / 10</div>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-1">
              {[
                { l: 'impact', v: 72, c: 'bg-iris-400' },
                { l: 'clarity', v: 88, c: 'bg-emerald-400' },
                { l: 'scope', v: 56, c: 'bg-amber-400' },
              ].map((m) => (
                <div key={m.l} className="rounded-sm bg-black/30 p-1">
                  <div className="font-mono text-[7px] text-zinc-500 uppercase">{m.l}</div>
                  <div className="h-0.5 mt-0.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className={`h-full ${m.c}`} style={{ width: `${m.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-0.5 mt-1">
              {[90, 70, 50, 80, 65, 75].map((w, i) => (
                <div key={i} className="h-1 rounded-full bg-zinc-800" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  // API perf chart
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-iris-500/[0.06] to-transparent">
      <div className="absolute inset-0 p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between glass rounded-md px-2.5 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[9px] text-zinc-300">load · 24,118 rps</span>
          </div>
          <div className="font-mono text-[9px] text-zinc-500">p99 113ms</div>
        </div>
        <div className="flex-1 glass rounded-md p-2 relative overflow-hidden">
          <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pg1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* grid */}
            {[15, 35, 55, 75].map((y) => (
              <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="rgba(255,255,255,0.04)" />
            ))}
            <path
              d="M0,60 L12,55 L24,58 L36,40 L48,45 L60,30 L72,38 L84,22 L96,28 L108,18 L120,32 L132,20 L144,26 L156,12 L168,22 L180,16 L200,24"
              stroke="#a5b4fc"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d="M0,60 L12,55 L24,58 L36,40 L48,45 L60,30 L72,38 L84,22 L96,28 L108,18 L120,32 L132,20 L144,26 L156,12 L168,22 L180,16 L200,24 L200,80 L0,80 Z"
              fill="url(#pg1)"
            />
            <path
              d="M0,68 L24,66 L48,60 L72,58 L96,55 L120,52 L144,48 L168,46 L200,42"
              stroke="#10b981"
              strokeWidth="1"
              strokeDasharray="2 2"
              fill="none"
            />
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { l: 'p50', v: '38ms', c: 'text-emerald-300' },
            { l: 'p95', v: '92ms', c: 'text-iris-300' },
            { l: 'p99', v: '113ms', c: 'text-amber-300' },
          ].map((s) => (
            <div key={s.l} className="glass rounded-md px-2 py-1">
              <div className="font-mono text-[8px] text-zinc-500 uppercase">{s.l}</div>
              <div className={`font-mono text-[10px] ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p, expanded, onToggle, index }) {
  const ref = useMouseGlow();
  const IconCmp = Icons[p.icon] || Icons.Box;
  return (
    <Reveal delay={index * 100}>
      <div
        ref={ref}
        className="card-sheen glass rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-colors"
      >
        <div className="grid md:grid-cols-2">
          {/* Visual */}
          <div className="relative h-56 md:h-auto md:min-h-[260px] border-b md:border-b-0 md:border-r border-white/[0.06]">
            <ProjectThumb p={p} expanded={expanded} />
          </div>

          {/* Body */}
          <div className="p-5 md:p-6 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-iris-500/15 text-iris-300 border border-iris-500/25">
                  <IconCmp size={16} />
                </span>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                    <span>{p.period}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                    <StatusPill status={p.status} />
                  </div>
                  <h3 className="mt-1 text-[19px] md:text-xl font-semibold text-zinc-50 tracking-tight">
                    {p.name}
                  </h3>
                  <div className="font-mono text-[11.5px] text-zinc-500 mt-0.5">{p.role}</div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-[13.5px] text-zinc-400 leading-relaxed">{p.tagline}</p>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {p.metrics.map((m) => (
                <div key={m.k} className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-2">
                  <div className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-500">{m.k}</div>
                  <div className="mt-0.5 font-mono text-[13.5px] text-zinc-100">{m.v}</div>
                </div>
              ))}
            </div>

            {/* Quick stack peek */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.stack.flatMap((g) => g.items).slice(0, 6).map((t) => (
                <span key={t} className="skill-pill font-mono text-[10.5px] text-zinc-300 border border-white/[0.07] bg-white/[0.02] rounded-md px-2 py-[3px]">
                  {t}
                </span>
              ))}
              <span className="font-mono text-[10.5px] text-zinc-500 px-1 py-[3px]">+{p.stack.flatMap((g) => g.items).length - 6} more</span>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {p.links.map((l) => {
                  const I = Icons[l.icon];
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 text-[12px] px-2.5 py-1.5 transition-colors"
                    >
                      <I size={12} />
                      <span className="font-mono">{l.label}</span>
                    </a>
                  );
                })}
              </div>
              <button
                onClick={onToggle}
                className="inline-flex items-center gap-1.5 text-[12px] text-iris-300 hover:text-iris-200 font-medium"
              >
                {expanded ? 'Collapse' : 'Read the architecture'}
                <Icons.ArrowRight
                  size={12}
                  className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded panel */}
        <div
          className={`grid transition-all duration-500 ease-out ${
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-white/[0.06] p-5 md:p-6 bg-black/20 grid lg:grid-cols-12 gap-6">
              {/* Architecture flow */}
              <div className="lg:col-span-7">
                <SubHead label="architecture flow" />
                <div className="mt-3 glass rounded-xl p-4">
                  <div className="flex items-center flex-wrap gap-2">
                    {p.flow.map((step, i) => (
                      <React.Fragment key={step}>
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-200">
                          <span className="text-iris-400">{String(i + 1).padStart(2, '0')}</span>
                          {step}
                        </div>
                        {i < p.flow.length - 1 && (
                          <Icons.ArrowRight size={12} className="text-zinc-600" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <SubHead label="engineering highlights" className="mt-5" />
                <ul className="mt-3 space-y-2">
                  {p.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-[13px] text-zinc-300">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-iris-400 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack panel */}
              <div className="lg:col-span-5">
                <SubHead label="stack" />
                <div className="mt-3 space-y-3">
                  {p.stack.map((g) => (
                    <div key={g.g}>
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 mb-1.5">
                        {g.g}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {g.items.map((t) => (
                          <span
                            key={t}
                            className="skill-pill font-mono text-[10.5px] text-zinc-300 border border-white/[0.07] bg-white/[0.02] rounded-md px-2 py-[3px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function StatusPill({ status }) {
  const map = {
    beta: { c: 'text-amber-300 bg-amber-400/10 border-amber-400/30', d: 'bg-amber-400' },
    production: { c: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30', d: 'bg-emerald-400' },
    archived: { c: 'text-zinc-400 bg-white/[0.04] border-white/[0.08]', d: 'bg-zinc-500' },
  };
  const s = map[status] || map.archived;
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] rounded-full border px-1.5 py-[1px] ${s.c}`}>
      <span className={`h-1 w-1 rounded-full ${s.d}`} />
      {status}
    </span>
  );
}

function SubHead({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500 ${className}`}>
      <span className="h-px w-4 bg-iris-400/60" />
      {label}
    </div>
  );
}

function Projects() {
  const [openId, setOpenId] = useState('resume-analyzer');
  return (
    <section id="projects" className="relative section-pad">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <Reveal>
              <SectionLabel num="02" label="selected work" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text max-w-2xl">
                Projects I built end-to-end
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 text-zinc-400 max-w-xl text-[15px] leading-relaxed">
                Two builds that explore opposite ends of the stack: one AI-heavy and
                opinionated; the other is a measurement platform that holds other
                services accountable
              </p>
            </Reveal>
          </div>
          <Reveal delay={220}>
            <div className="font-mono text-[11px] text-zinc-500">
              <span className="text-iris-300">{PROJECTS.length}</span> projects · click a card to expand
            </div>
          </Reveal>
        </div>

        <div className="mt-10 space-y-5">
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.id}
              p={p}
              index={i}
              expanded={openId === p.id}
              onToggle={() => setOpenId(openId === p.id ? null : p.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

window.Projects = Projects;
window.StatusPill = StatusPill;
window.SubHead = SubHead;
