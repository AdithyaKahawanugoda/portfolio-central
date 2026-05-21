// Live CI/CD pipeline visualization
const STAGES = [
  { id: 'commit', label: 'commit', icon: 'GitBranch', detail: 'push origin main · af3c91e' },
  { id: 'build', label: 'build', icon: 'Box', detail: 'docker build · 312 mb' },
  { id: 'test', label: 'test', icon: 'Check', detail: 'jest · 1,284 specs' },
  { id: 'scan', label: 'scan', icon: 'Shield', detail: 'trivy · 0 high cves' },
  { id: 'push', label: 'push', icon: 'Cloud', detail: 'ecr · sha:af3c91e' },
  { id: 'deploy', label: 'deploy', icon: 'Server', detail: 'ecs rolling · 2/2' },
  { id: 'smoke', label: 'smoke', icon: 'Activity', detail: 'k6 budget · ok' },
  { id: 'live', label: 'live', icon: 'Globe', detail: 'cdn cache warmed' },
];

const STAGE_MS = 1100; // each stage takes this long
const TOTAL = STAGES.length;

function usePipelineCursor() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), STAGE_MS);
    return () => clearInterval(t);
  }, []);
  // active stage index — cycles through stages + pause
  const cycleLen = TOTAL + 2;
  const idx = tick % cycleLen;
  return idx; // 0..TOTAL-1 = active, TOTAL..cycleLen-1 = all live
}

function Pipeline() {
  const cursor = usePipelineCursor();
  const allDone = cursor >= TOTAL;
  const currentStage = STAGES[Math.min(cursor, TOTAL - 1)];

  // simulate moving log
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [cursor]);

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
                Every commit, automated to production
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 text-zinc-400 max-w-xl text-[15px] leading-relaxed">
                A typical GitHub Actions pipeline I&rsquo;d build for a backend service.
                The pipe below isn&rsquo;t a screenshot; it&rsquo;s a live render of the
                stages running on a 12-second loop
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
                <div className="font-mono text-[13px] text-zinc-100">
                  {allDone ? 'deployment complete' : `stage · ${currentStage.label}`}
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
                  <span>elapsed · {String(Math.floor(cursor * 0.7))}m {String(Math.floor(cursor * 18) % 60).padStart(2, '0')}s</span>
                )}
              </div>
            </div>

            {/* Stages */}
            <div className="relative">
              {/* connector line */}
              <div className="absolute top-7 left-0 right-0 hidden md:block">
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                {/* progress fill */}
                <div
                  className="absolute top-0 left-0 h-px bg-gradient-to-r from-iris-500 via-iris-400 to-iris-500 transition-all duration-700"
                  style={{
                    width: `${((Math.min(cursor + 1, TOTAL)) / TOTAL) * 100}%`,
                    boxShadow: '0 0 12px rgba(165, 180, 252, 0.5)',
                  }}
                />
                {/* moving pulse */}
                {!allDone && (
                  <div
                    className="absolute -top-[3px] h-2 w-2 rounded-full bg-iris-300 transition-all duration-700"
                    style={{
                      left: `calc(${((cursor + 0.5) / TOTAL) * 100}% - 4px)`,
                      boxShadow: '0 0 12px 4px rgba(165, 180, 252, 0.6)',
                    }}
                  />
                )}
              </div>

              <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-2 relative">
                {STAGES.map((s, i) => {
                  const state =
                    allDone || i < cursor
                      ? 'done'
                      : i === cursor
                      ? 'active'
                      : 'pending';
                  const IconCmp = Icons[s.icon] || Icons.Box;
                  return (
                    <div key={s.id} className="flex flex-col items-center">
                      <div
                        className={`relative h-14 w-14 rounded-xl border flex items-center justify-center transition-all duration-500
                          ${
                            state === 'done'
                              ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300'
                              : state === 'active'
                              ? 'bg-iris-400/15 border-iris-400/50 text-iris-200 scale-110 shadow-[0_0_30px_rgba(129,140,248,0.5)]'
                              : 'bg-white/[0.02] border-white/[0.06] text-zinc-600'
                          }
                        `}
                      >
                        {state === 'done' ? (
                          <Icons.Check size={18} />
                        ) : (
                          <IconCmp size={17} />
                        )}
                        {state === 'active' && (
                          <span className="absolute inset-0 rounded-xl border border-iris-400/40 animate-ping" />
                        )}
                      </div>
                      <div
                        className={`mt-2.5 font-mono text-[10.5px] uppercase tracking-wider ${
                          state === 'pending' ? 'text-zinc-600' : 'text-zinc-300'
                        }`}
                      >
                        {s.label}
                      </div>
                      <div
                        className={`mt-0.5 font-mono text-[9.5px] text-center max-w-[120px] leading-tight ${
                          state === 'active'
                            ? 'text-iris-300'
                            : state === 'done'
                            ? 'text-zinc-500'
                            : 'text-zinc-700'
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
            <div className="mt-7 grid lg:grid-cols-12 gap-4">
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
  return (
    <div className="flex gap-2">
      <span className="text-zinc-600">{time}</span>
      <span className={done ? 'text-emerald-400' : 'text-iris-300'}>{done ? '✓' : '›'}</span>
      <span className="text-zinc-400">{stage.label}</span>
      <span className="text-zinc-500 truncate">— {stage.detail}</span>
    </div>
  );
}

window.Pipeline = Pipeline;
