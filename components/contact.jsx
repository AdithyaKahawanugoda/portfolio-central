function Contact() {
  const [copied, setCopied] = useState(false);
  const email = 'adithyakahawanugoda@gmail.com';
  const copy = () => {
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <section id="contact" className="relative section-pad pb-32">
      <div className="mx-auto max-w-5xl px-4">
        <Reveal>
          <div className="relative glass-strong rounded-3xl p-8 md:p-14 overflow-hidden">
            {/* Decorative grid */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.35] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 70%)',
              }}
            />
            {/* Decorative glow */}
            <div
              aria-hidden
              className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full"
              style={{
                background: 'radial-gradient(closest-side, rgba(99,102,241,0.45), transparent)',
                filter: 'blur(40px)',
              }}
            />

            <div className="relative grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <SectionLabel num="06" label="contact" />
                <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text">
                  Let&rsquo;s build something
                  <br />
                  <span className="iris-text">worth shipping.</span>
                </h2>
                <p className="mt-5 text-zinc-400 text-[15px] leading-relaxed max-w-xl">
                  I&rsquo;m completing my Master of IT (Software Architecture) at RMIT and
                  looking for a full-stack, backend, or cloud role where the team takes
                  engineering seriously. Drop a line; I reply within a day.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${email}`}
                    className="group inline-flex items-center gap-2 rounded-lg bg-iris-500 hover:bg-iris-400 text-white text-[13px] font-medium px-4 py-2.5 shadow-[0_10px_36px_-8px_rgba(99,102,241,0.65)] transition-colors"
                  >
                    <Icons.Mail size={14} />
                    Email me
                    <Icons.ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <button
                    onClick={copy}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-zinc-200 text-[13px] font-medium px-4 py-2.5 transition-colors"
                  >
                    {copied ? <Icons.Check size={13} className="text-emerald-400" /> : <Icons.Code size={13} />}
                    <span className="font-mono text-[12.5px]">{copied ? 'copied!' : email}</span>
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-2">
                  {[
                    { icon: 'Github', label: 'github', href: 'https://github.com/AdithyaKahawanugoda', target: '_blank' },
                    { icon: 'Linkedin', label: 'linkedin', href: 'https://www.linkedin.com/in/adithya-kahawanugoda-839116185', target: '_blank' },
                    { icon: 'ExternalLink', label: 'resume.pdf', href: 'https://raw.githubusercontent.com/AdithyaKahawanugoda/portfolio-central/main/AdithyaCV.pdf', target: '_blank' },
                  ].map((s) => {
                    const I = Icons[s.icon];
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target={s.target}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 text-[12px] px-2.5 py-1.5 transition-colors font-mono"
                      >
                        <I size={12} />
                        {s.label}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Right: status card */}
              <div className="lg:col-span-5">
                <div className="glass rounded-2xl p-5 font-mono text-[12px] leading-relaxed">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-zinc-500 text-[10.5px] uppercase tracking-wider">status.json</span>
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-iris-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                    </div>
                  </div>
                  <pre className="text-zinc-300 whitespace-pre-wrap leading-[1.7]">
<span className="text-zinc-500">{`{`}</span>{`\n`}
{`  `}<span className="text-iris-300">"name"</span>: <span className="text-emerald-300">"Adithya Kahawanugoda"</span>,{`\n`}
{`  `}<span className="text-iris-300">"role"</span>: <span className="text-emerald-300">"Full-Stack Software Engineer"</span>,{`\n`}
{`  `}<span className="text-iris-300">"based_in"</span>: <span className="text-emerald-300">"Melbourne, AU"</span>,{`\n`}
{`  `}<span className="text-iris-300">"exp"</span>: <span className="text-emerald-300">"4+ years professional"</span>,{`\n`}
{`  `}<span className="text-iris-300">"open_to"</span>: <span className="text-zinc-400">[</span>{`\n`}
{`    `}<span className="text-emerald-300">"full-stack"</span>, <span className="text-emerald-300">"backend"</span>,{`\n`}
{`    `}<span className="text-emerald-300">"cloud"</span>, <span className="text-emerald-300">"devops"</span>{`\n`}
{`  `}<span className="text-zinc-400">]</span>,{`\n`}
{`  `}<span className="text-iris-300">"timezone"</span>: <span className="text-emerald-300">"AEDT (UTC+11)"</span>,{`\n`}
{`  `}<span className="text-iris-300">"availability"</span>: <span className="text-amber-300">"immediate"</span>{`\n`}
<span className="text-zinc-500">{`}`}</span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Footer */}
      <footer className="mt-16 mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pt-8 border-t border-white/[0.06]">
          <div className="font-mono text-[11.5px] text-zinc-500">
            © 2026 · Adithya Kahawanugoda · Hand-built with care in Melbourne
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              all systems nominal
            </span>
            <span className="text-zinc-700">·</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>
    </section>
  );
}

window.Contact = Contact;
