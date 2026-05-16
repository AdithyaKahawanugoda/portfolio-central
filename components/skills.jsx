// Skills matrix — categorized
const SKILLS = [
  {
    group: 'Frontend',
    icon: 'Layers',
    blurb: 'Component to production.',
    items: [
      { name: 'React', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'TypeScript', level: 92 },
      { name: 'Redux', level: 82 },
      { name: 'Flutter', level: 72 },
      { name: 'Swift', level: 58 },
    ],
  },
  {
    group: 'Backend',
    icon: 'Server',
    blurb: 'APIs built to last.',
    items: [
      { name: 'Node.js', level: 92 },
      { name: 'NestJS', level: 88 },
      { name: 'GraphQL', level: 88 },
      { name: 'REST APIs', level: 95 },
      { name: 'Express', level: 82 },
      { name: 'Python', level: 80 },
    ],
  },
  {
    group: 'Databases',
    icon: 'Database',
    blurb: 'Structured and schemaless.',
    items: [
      { name: 'MySQL', level: 90 },
      { name: 'MongoDB', level: 88 },
      { name: 'Elasticsearch', level: 82 },
      { name: 'PostgreSQL', level: 74 },
      { name: 'Redis', level: 70 },
      { name: 'SQL Tuning', level: 80 },
    ],
  },
  {
    group: 'Cloud',
    icon: 'Cloud',
    blurb: 'AWS-first, multi-cloud aware.',
    items: [
      { name: 'AWS', level: 75 },
      { name: 'Terraform', level: 75 },
      { name: 'GCP', level: 30 },
      { name: 'Azure', level: 30 },
      { name: 'AWS S3 / IAM', level: 88 },
      { name: 'AWS ECS / EC2', level: 84 },
    ],
  },
  {
    group: 'DevOps',
    icon: 'GitBranch',
    blurb: 'Pipelines that catch their own mistakes.',
    items: [
      { name: 'Docker', level: 88 },
      { name: 'Kubernetes', level: 45 },
      { name: 'GitHub Actions', level: 85 },
      { name: 'Bitbucket Pipelines', level: 80 },
      { name: 'Linux', level: 84 },
      { name: 'Bash', level: 78 },
    ],
  },
  {
    group: 'Languages',
    icon: 'Cpu',
    blurb: 'Typed, scripted, compiled.',
    items: [
      { name: 'JavaScript', level: 95 },
      { name: 'TypeScript', level: 92 },
      { name: 'Python', level: 65 },
      { name: 'Java', level: 45 },
      { name: 'Dart', level: 60 },
      { name: 'C / C++', level: 40 },
    ],
  },
];

function SkillCard({ group, index }) {
  const IconCmp = Icons[group.icon] || Icons.Box;
  const [hover, setHover] = useState(null);
  return (
    <Reveal delay={index * 70}>
      <div
        className="glass rounded-2xl p-5 h-full hover:border-white/[0.14] transition-colors group/card relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-iris-500/0 group-hover/card:bg-iris-500/[0.06] transition-colors blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-iris-500/15 text-iris-300 border border-iris-500/25">
            <IconCmp size={15} />
          </span>
          <div>
            <h3 className="text-zinc-100 font-medium text-[15px]">{group.group}</h3>
            <div className="font-mono text-[10.5px] text-zinc-500">{group.blurb}</div>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {group.items.map((it) => (
            <div
              key={it.name}
              className="group/row"
              onMouseEnter={() => setHover(it.name)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-[12.5px] ${hover === it.name ? 'text-zinc-100' : 'text-zinc-400'} transition-colors`}>
                  {it.name}
                </span>
                <span className="font-mono text-[10px] text-zinc-500">{it.level}</span>
              </div>
              <div className="h-[3px] rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-iris-500 to-iris-300 transition-all duration-700"
                  style={{ width: `${it.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function Skills() {
  return (
    <section id="skills" className="relative section-pad">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <Reveal>
              <SectionLabel num="05" label="stack" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text max-w-2xl">
                What I reach for, by category
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 text-zinc-400 max-w-xl text-[15px] leading-relaxed">
                The bars aren&rsquo;t a confidence ranking; they&rsquo;re a rough measure
                of how often a thing shows up in my recent work. I&rsquo;d rather know one
                tool deeply than five superficially
              </p>
            </Reveal>
          </div>
          <Reveal delay={220}>
            <div className="font-mono text-[11px] text-zinc-500">
              <span className="text-iris-300">{SKILLS.reduce((a, g) => a + g.items.length, 0)}</span> technologies · <span className="text-iris-300">{SKILLS.length}</span> categories
            </div>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map((g, i) => (
            <SkillCard key={g.group} group={g} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

window.Skills = Skills;
