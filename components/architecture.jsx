// Architecture: interactive infra diagram with hoverable nodes
const NODES = [
  // [id, label, sublabel, x, y, w, h, group]
  { id: 'user', label: 'Users', sub: 'web + mobile', x: 30, y: 200, w: 90, h: 56, group: 'edge' },
  { id: 'cdn', label: 'CloudFront', sub: 'global cdn', x: 170, y: 200, w: 110, h: 56, group: 'edge' },
  { id: 'waf', label: 'WAF', sub: 'rules · rate-limit', x: 170, y: 90, w: 110, h: 50, group: 'edge' },
  { id: 'alb', label: 'ALB', sub: 'tls · routing', x: 330, y: 200, w: 100, h: 56, group: 'edge' },

  { id: 'api', label: 'API Service', sub: 'Node · Fargate', x: 480, y: 100, w: 130, h: 64, group: 'compute' },
  { id: 'worker', label: 'Worker Pool', sub: 'Node.js · SQS', x: 480, y: 200, w: 130, h: 64, group: 'compute' },
  { id: 'ai', label: 'AI Service', sub: 'Python · gpu task', x: 480, y: 300, w: 130, h: 64, group: 'compute' },

  { id: 'pg', label: 'PostgreSQL', sub: 'rds · multi-az', x: 680, y: 80, w: 120, h: 60, group: 'data' },
  { id: 'redis', label: 'Redis', sub: 'elasticache', x: 680, y: 170, w: 120, h: 60, group: 'data' },
  { id: 'vec', label: 'Elasticsearch', sub: 'search · indexing', x: 680, y: 260, w: 120, h: 60, group: 'data' },
  { id: 's3', label: 'S3', sub: 'docs · artifacts', x: 680, y: 350, w: 120, h: 60, group: 'data' },

  { id: 'cw', label: 'CloudWatch', sub: 'logs · metrics', x: 870, y: 110, w: 130, h: 56, group: 'observ' },
  { id: 'sentry', label: 'Sentry', sub: 'errors · perf', x: 870, y: 200, w: 130, h: 56, group: 'observ' },
  { id: 'otel', label: 'OpenTelemetry', sub: 'traces', x: 870, y: 290, w: 130, h: 56, group: 'observ' },
];

const EDGES = [
  ['user', 'cdn'],
  ['cdn', 'waf', { curve: -40 }],
  ['cdn', 'alb'],
  ['alb', 'api'],
  ['alb', 'worker'],
  ['alb', 'ai'],
  ['api', 'pg'],
  ['api', 'redis'],
  ['worker', 'pg'],
  ['worker', 'redis'],
  ['worker', 's3'],
  ['ai', 'vec'],
  ['ai', 's3'],
  ['api', 'cw', { dim: true }],
  ['worker', 'sentry', { dim: true }],
  ['ai', 'otel', { dim: true }],
];

const GROUPS = {
  edge: { label: 'edge', dot: 'bg-emerald-400' },
  compute: { label: 'compute', dot: 'bg-iris-400' },
  data: { label: 'data', dot: 'bg-amber-400' },
  observ: { label: 'observability', dot: 'bg-cyan-400' },
};

function nodeCenter(n, side) {
  if (side === 'right') return { x: n.x + n.w, y: n.y + n.h / 2 };
  if (side === 'left') return { x: n.x, y: n.y + n.h / 2 };
  if (side === 'top') return { x: n.x + n.w / 2, y: n.y };
  if (side === 'bottom') return { x: n.x + n.w / 2, y: n.y + n.h };
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

function edgePath(a, b, opts = {}) {
  const ax = a.x + a.w;
  const ay = a.y + a.h / 2;
  const bx = b.x;
  const by = b.y + b.h / 2;
  // s-curve
  const mid = (ax + bx) / 2;
  return `M ${ax} ${ay} C ${mid} ${ay}, ${mid} ${by}, ${bx} ${by}`;
}

function Architecture() {
  const [hover, setHover] = useState(null);
  const isRelated = (id) => {
    if (!hover) return true;
    if (hover === id) return true;
    return EDGES.some(
      ([a, b]) => (a === hover && b === id) || (b === hover && a === id),
    );
  };

  return (
    <section id="architecture" className="relative section-pad">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <Reveal>
              <SectionLabel num="04" label="infrastructure" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text max-w-2xl">
                A reference architecture I&rsquo;d ship on day one
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 text-zinc-400 max-w-xl text-[15px] leading-relaxed">
                Boring on purpose. Managed primitives, clear failure domains, and an
                observability story before there&rsquo;s a single user. Hover any node to
                see what it talks to.
              </p>
            </Reveal>
          </div>
          <Reveal delay={220}>
            <div className="flex items-center gap-4 flex-wrap">
              {Object.entries(GROUPS).map(([k, g]) => (
                <div key={k} className="flex items-center gap-1.5 font-mono text-[10.5px] text-zinc-400 uppercase tracking-wider">
                  <span className={`h-2 w-2 rounded-full ${g.dot}`} />
                  {g.label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="glass-strong rounded-2xl p-4 md:p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 1030 460"
                className="w-full min-w-[860px]"
                style={{ height: 'auto' }}
              >
                <defs>
                  <linearGradient id="line-grad" x1="0" x2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
                  </linearGradient>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0,0 L6,4 L0,8" fill="none" stroke="#a5b4fc" strokeWidth="1.2" />
                  </marker>
                </defs>

                {/* Grid background */}
                <g opacity="0.4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 86} x2={i * 86} y1="0" y2="460" stroke="rgba(255,255,255,0.03)" />
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" x2="1030" y1={i * 80} y2={i * 80} stroke="rgba(255,255,255,0.03)" />
                  ))}
                </g>

                {/* Edges */}
                {EDGES.map(([fromId, toId, opts = {}], i) => {
                  const a = NODES.find((n) => n.id === fromId);
                  const b = NODES.find((n) => n.id === toId);
                  const active = hover === fromId || hover === toId;
                  const baseOpacity = hover ? (active ? 1 : 0.12) : opts.dim ? 0.45 : 0.7;
                  return (
                    <g key={i}>
                      <path
                        d={edgePath(a, b, opts)}
                        stroke={active ? '#c4b5fd' : opts.dim ? 'rgba(165,180,252,0.4)' : '#818cf8'}
                        strokeWidth={active ? 1.6 : 1.1}
                        fill="none"
                        opacity={baseOpacity}
                        strokeDasharray={opts.dim ? '4 4' : 'none'}
                        markerEnd="url(#arrow)"
                      />
                      {/* animated flow dot when not hovering, or related when hovering */}
                      {(!hover || active) && !opts.dim && (
                        <circle r="2.4" fill="#c4b5fd">
                          <animateMotion dur={`${2.4 + (i % 3) * 0.4}s`} repeatCount="indefinite" path={edgePath(a, b)} />
                          <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.15;0.85;1"
                            dur={`${2.4 + (i % 3) * 0.4}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {NODES.map((n) => {
                  const isHover = hover === n.id;
                  const dim = hover && !isRelated(n.id);
                  const group = GROUPS[n.group];
                  return (
                    <g
                      key={n.id}
                      onMouseEnter={() => setHover(n.id)}
                      onMouseLeave={() => setHover(null)}
                      style={{ cursor: 'pointer' }}
                      opacity={dim ? 0.35 : 1}
                    >
                      <rect
                        x={n.x}
                        y={n.y}
                        width={n.w}
                        height={n.h}
                        rx="10"
                        fill={isHover ? 'rgba(129,140,248,0.16)' : 'rgba(255,255,255,0.03)'}
                        stroke={isHover ? '#a5b4fc' : 'rgba(255,255,255,0.08)'}
                        strokeWidth="1"
                        style={{ transition: 'all 0.25s' }}
                      />
                      {/* corner indicator */}
                      <circle
                        cx={n.x + 10}
                        cy={n.y + 10}
                        r="2.6"
                        className={
                          n.group === 'edge'
                            ? 'fill-emerald-400'
                            : n.group === 'compute'
                            ? 'fill-iris-400'
                            : n.group === 'data'
                            ? 'fill-amber-400'
                            : 'fill-cyan-400'
                        }
                      />
                      <text
                        x={n.x + n.w / 2}
                        y={n.y + n.h / 2 - 4}
                        textAnchor="middle"
                        fontFamily="Inter, sans-serif"
                        fontSize="12.5"
                        fontWeight="600"
                        fill={isHover ? '#fff' : '#e4e4e7'}
                      >
                        {n.label}
                      </text>
                      <text
                        x={n.x + n.w / 2}
                        y={n.y + n.h / 2 + 12}
                        textAnchor="middle"
                        fontFamily="JetBrains Mono, monospace"
                        fontSize="9.5"
                        fill={isHover ? '#c4b5fd' : '#71717a'}
                      >
                        {n.sub}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Detail strip */}
            <div className="mt-4 pt-4 border-t border-white/[0.05] grid md:grid-cols-3 gap-4 font-mono text-[12px]">
              <div>
                <div className="text-zinc-500 text-[10.5px] uppercase tracking-wider mb-1">scaling story</div>
                <div className="text-zinc-300">
                  <span className="text-iris-300">Fargate</span> auto-scales on CPU + queue depth · Postgres
                  read replicas in two AZs · CloudFront eats the static load.
                </div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10.5px] uppercase tracking-wider mb-1">failure domains</div>
                <div className="text-zinc-300">
                  <span className="text-iris-300">Worker isolation</span> means AI hiccups don&rsquo;t take the
                  API down. Idempotency keys on every job make retries safe.
                </div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10.5px] uppercase tracking-wider mb-1">cost shape</div>
                <div className="text-zinc-300">
                  Pay-per-request on AI, spot for workers, reserved for db. <span className="text-iris-300">~$240/mo</span> at modest scale.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

window.Architecture = Architecture;
