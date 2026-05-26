// Live CI/CD pipeline visualization — color-coded stages with green check badge.

const STAGES = [
  { id: 'commit', label: 'commit', icon: 'GitBranch', detail: 'push origin main · af3c91e', theme: 'iris' },
  { id: 'build',  label: 'build',  icon: 'Box',       detail: 'docker build · 312 mb',     theme: 'amber' },
  { id: 'test',   label: 'test',   icon: 'Check',     detail: 'jest · 1,284 specs',        theme: 'emerald' },
  { id: 'scan',   label: 'scan',   icon: 'Shield',    detail: 'trivy · 0 high cves',       theme: 'rose' },
  { id: 'push',   label: 'push',   icon: 'Cloud',     detail: 'ecr · sha:af3c91e',         theme: 'iris' },
  { id: 'deploy', label: 'deploy', icon: 'Server',    detail: 'ecs rolling · 2/2',         theme: 'cyan' },
  { id: 'smoke',  label: 'smoke',  icon: 'Activity',  detail: 'k6 budget · ok',            theme: 'amber' },
  { id: 'live',   label: 'live',   icon: 'Globe',     detail: 'cdn cache warmed',          theme: 'emerald' },
];

const THEMES = {
  iris: {
    text: 'text-iris-300',
    bgActive: 'bg-iris-400/15',
    borderActive: 'border-iris-400/55',
    bgDone: 'bg-iris-500/[0.08]',
    borderDone: 'border-iris-500/25',
    glow: 'rgba(129,140,248,0.55)',
  },
  emerald: {
    text: 'text-emerald-300',
    bgActive: 'bg-emerald-400/15',
    borderActive: 'border-emerald-400/55',
    bgDone: 'bg-emerald-500/[0.08]',
    borderDone: 'border-emerald-500/25',
    glow: 'rgba(52,211,153,0.55)',
  },
  amber: {
    text: 'text-amber-300',
    bgActive: 'bg-amber-400/15',
    borderActive: 'border-amber-400/55',
    bgDone: 'bg-amber-500/[0.08]',
    borderDone: 'border-amber-500/25',
    glow: 'rgba(251,191,36,0.5)',
  },
  rose: {
    text: 'text-rose-300',
    bgActive: 'bg-rose-400/15',
    borderActive: 'border-rose-400/55',
    bgDone: 'bg-rose-500/[0.08]',
    borderDone: 'border-rose-500/25',
    glow: 'rgba(251,113,133,0.55)',
  },
  cyan: {
    text: 'text-cyan-300',
    bgActive: 'bg-cyan-400/15',
    borderActive: 'border-cyan-400/55',
    bgDone: 'bg-cyan-500/[0.08]',
    borderDone: 'border-cyan-500/25',
    glow: 'rgba(34,211,238,0.55)',
  },
};

const STAGE_MS = 1100;
const LINE_MS = 700; // time the progress line takes to travel one tile gap
const PULSE_DELAY = 60; // tiny pause between line arriving and tile lighting up
const TOTAL = STAGES.length;

function usePipelineCursor() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), STAGE_MS);
    return () => clearInterval(t);
  }, []);
  const cycleLen = TOTAL + 2;
  return tick % cycleLen;
}

function StageTile({ stage, state, theme }) {
  const IconCmp = Icons[stage.icon] || Icons.Box;
  const tone =
    state === 'pending'
      ? 'bg-white/[0.02] border-white/[0.06] text-zinc-600'
      : state === 'active'
      ? `${theme.bgActive} ${theme.borderActive} ${theme.text}`
      : `${theme.bgDone} ${theme.borderDone} ${theme.text}`;

  return (
    <div
      className={`relative h-14 w-14 ${state === 'active' ? 'scale-[1.06]' : 'scale-100'}`}
      style={{
        zIndex: 2,
        transition: 'transform 600ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      {/* Opaque occluder — hides the rail running behind the tile */}
      <div className="absolute inset-0 rounded-xl" style={{ background: '#0d0d14' }} />

      <div
        className={`relative h-full w-full rounded-xl border flex items-center justify-center ${tone}`}
        style={{
          transition:
            'background-color 600ms cubic-bezier(0.32, 0.72, 0, 1), border-color 600ms cubic-bezier(0.32, 0.72, 0, 1), color 600ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 600ms cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: state === 'active' ? `0 0 30px ${theme.glow}` : 'none',
        }}
      >
        <IconCmp size={17} />

        {state === 'active' && (
          <span
            className="absolute inset-0 rounded-xl border tile-ping"
            style={{ borderColor: theme.glow }}
          />
        )}

        {state === 'done' && (
          <span className="check-pop absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-400/95 text-ink-950 flex items-center justify-center shadow-[0_0_0_2px_rgba(7,7,11,1)]">
            <Icons.Check size={9} strokeWidth={3} />
          </span>
        )}
      </div>
    </div>
  );
}

function Pipeline() {
  const cursor = usePipelineCursor();
  const allDone = cursor >= TOTAL;
  const currentStage = STAGES[Math.min(cursor, TOTAL - 1)];

  // Tile pulse waits for the progress line to actually reach it.
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    setLanded(false);
    const t = setTimeout(() => setLanded(true), LINE_MS + PULSE_DELAY);
    return () => clearTimeout(t);
  }, [cursor]);

  // Detect cycle wrap so the smooth elapsed timer can reset cleanly.
  const lastCursorRef = useRef(cursor);
  const cycleStartRef = useRef(0);
  if (typeof performance !== 'undefined' && cycleStartRef.current === 0) {
    cycleStartRef.current = performance.now();
  }

  // Smooth elapsed counter — 60fps, scaled so it lands at ~5m 42s when the run finishes.
  const [elapsedSecs, setElapsedSecs] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      const elapsedMs = performance.now() - cycleStartRef.current;
      const realCycleMs = TOTAL * STAGE_MS; // active phase length (~8.8s)
      const display = Math.min((elapsedMs / realCycleMs) * 342, 342);
      setElapsedSecs(display);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Manage the rail width imperatively so a cycle wrap can snap-reset cleanly
  // (otherwise the line would visually “retreat” from 100% back to the start).
  const railRef = useRef(null);
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const wrapped = lastCursorRef.current > cursor;
    if (wrapped) {
      // reset rail and the elapsed timer in lockstep
      cycleStartRef.current = performance.now();
      el.style.transition = 'none';
      el.style.width = '0%';
      // force reflow so the snap is committed before transition resumes
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth;
    }
    el.style.transition = `width ${LINE_MS}ms cubic-bezier(0.45, 0, 0.25, 1)`;
    const w = (Math.min(cursor + 0.5, TOTAL) / TOTAL) * 100;
    el.style.width = `${w}%`;
    lastCursorRef.current = cursor;
  }, [cursor]);

  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [cursor]);

  const elapsedMins = Math.floor(elapsedSecs / 60);
  const elapsedRem = Math.floor(elapsedSecs % 60);
  const labelText = allDone ? 'deployment complete' : `stage · ${currentStage.label}`;

  return (
    <section id="pipeline" className="relative section-pad">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <Reveal>
              <SectionLabel num="03" label="delivery" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text max-w-2xl">
                Every commit, automated to production.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 text-zinc-400 max-w-xl text-[15px] leading-relaxed">
                A typical GitHub Actions pipeline I&rsquo;d build for a backend service.
                The pipe below isn&rsquo;t a screenshot — it&rsquo;s a live render of the
                stages running on a 12-second loop.
              </p>
            </Reveal>
          </div>

          <Reveal delay={220}>
            <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-iris-400 opacity-50 animate-ping" />
                <span className="relative block h-2 w-2 rounded-full bg-iris-400" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">currently</div>
                <div className="font-mono text-[13px] text-zinc-100 relative h-[18px] min-w-[170px]">
                  <span key={labelText} className="label-in absolute inset-0 whitespace-nowrap">
                    {labelText}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Pipeline canvas */}
        <Reveal>
          <div className="glass-strong rounded-2xl p-5 md:p-7">
            {/* terminal header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 font-mono text-[11.5px] text-zinc-400">
                <Icons.GitBranch size={13} className="text-iris-400" />
                <span className="text-zinc-200">main</span>
                <span className="text-zinc-600">·</span>
                <span>af3c91e</span>
                <span className="text-zinc-600">·</span>
                <span>adithya</span>
                <span className="hidden md:inline text-zinc-600">·</span>
                <span className="hidden md:inline">"feat: idempotent settlement worker"</span>
              </div>
              <div className="font-mono text-[11px] text-zinc-500">
                {allDone ? (
                  <span className="text-emerald-300">✓ passed in 5m 42s</span>
                ) : (
                  <span className="tabular-nums">elapsed · {elapsedMins}m {String(elapsedRem).padStart(2, '0')}s</span>
                )}
              </div>
            </div>

            {/* Stages */}
            <div className="relative">
              {/* Continuous rail background */}
              <div
                className="absolute top-7 left-0 right-0 h-px hidden md:block bg-gradient-to-r from-transparent via-white/[0.1] to-transparent"
                style={{ zIndex: 1 }}
              />

              {/* Rail progress fill — width controlled imperatively for clean cycle wrap */}
              <div
                ref={railRef}
                className="absolute top-7 left-0 h-px hidden md:block"
                style={{
                  width: '0%',
                  background:
                    'linear-gradient(90deg, rgba(129,140,248,0.85), #a5b4fc, rgba(129,140,248,0.85))',
                  boxShadow: '0 0 10px rgba(165, 180, 252, 0.5)',
                  zIndex: 1,
                }}
              >
                {/* Soft glowing tip at the leading edge — only visible during travel */}
                <span
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    right: '-3px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(196,181,253,0.95) 0%, rgba(196,181,253,0) 70%)',
                    boxShadow: '0 0 14px 5px rgba(165,180,252,0.55)',
                    opacity: landed || allDone ? 0 : 1,
                    transition: 'opacity 360ms ease-out',
                  }}
                />
              </div>

              <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-2 relative">
                {STAGES.map((s, i) => {
                  const theme = THEMES[s.theme];
                  const state =
                    allDone || i < cursor
                      ? 'done'
                      : i === cursor && landed
                      ? 'active'
                      : 'pending';
                  return (
                    <div key={s.id} className="flex flex-col items-center">
                      <StageTile stage={s} state={state} theme={theme} />
                      <div
                        className={`mt-2.5 font-mono text-[10.5px] uppercase tracking-wider ${
                          state === 'pending'
                            ? 'text-zinc-600'
                            : state === 'active'
                            ? theme.text
                            : 'text-zinc-300'
                        }`}
                      >
                        {s.label}
                      </div>
                      <div
                        className={`mt-0.5 font-mono text-[9.5px] text-center max-w-[120px] leading-tight ${
                          state === 'pending' ? 'text-zinc-700' : 'text-zinc-500'
                        }`}
                      >
                        {s.detail}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* split: yaml + logs */}
            <div className="mt-8 grid lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 rounded-xl bg-black/40 border border-white/[0.05] p-4 font-mono text-[11.5px] leading-relaxed text-zinc-300 overflow-x-auto">
                <div className="text-zinc-500 mb-2"># .github/workflows/deploy.yml</div>
                <pre className="text-zinc-300">
{`name: deploy
on: { push: { branches: [main] } }
jobs:
  ship:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker buildx build --push -t $ECR:$SHA .
      - run: npm test -- --ci
      - run: trivy image $ECR:$SHA --severity HIGH,CRITICAL
      - run: aws ecs update-service --force-new-deployment
      - run: k6 run smoke/budget.js --vus 200 --duration 60s`}
                </pre>
              </div>

              <div className="lg:col-span-5 rounded-xl bg-black/40 border border-white/[0.05] p-4 font-mono text-[11px] leading-relaxed">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-zinc-500"># live log</div>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    streaming
                  </div>
                </div>
                <div ref={logRef} className="space-y-0.5 h-[154px] overflow-hidden">
                  {STAGES.slice(0, Math.min(cursor + 1, TOTAL)).map((s, i) => (
                    <PipelineLogLine key={s.id} stage={s} index={i} done={allDone || i < cursor} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* metrics row */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { k: 'avg pipeline', v: '5m 42s', s: 'commit → live' },
            { k: 'deploys / week', v: '38', s: 'across 12 services' },
            { k: 'rollback time', v: '54s', s: 'p99 (last 30d)' },
            { k: 'lead time', v: '2h 18m', s: 'PR open → prod' },
          ].map((m, i) => (
            <Reveal key={m.k} delay={i * 80}>
              <div className="glass rounded-xl p-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{m.k}</div>
                <div className="mt-1 text-xl font-semibold text-white">{m.v}</div>
                <div className="font-mono text-[10.5px] text-zinc-500">{m.s}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PipelineLogLine({ stage, index, done }) {
  const time = `[${String(index).padStart(2, '0')}:${String((index * 47) % 60).padStart(2, '0')}]`;
  const theme = THEMES[stage.theme];
  return (
    <div className="flex gap-2">
      <span className="text-zinc-600">{time}</span>
      <span className={done ? 'text-emerald-400' : theme.text}>{done ? '✓' : '›'}</span>
      <span className={theme.text}>{stage.label}</span>
      <span className="text-zinc-500 truncate">— {stage.detail}</span>
    </div>
  );
}

window.Pipeline = Pipeline;
