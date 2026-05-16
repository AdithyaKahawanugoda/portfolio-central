// About: animated timeline of journey
const TIMELINE = [
  {
    year: '2019',
    title: 'BSc Software Engineering',
    org: 'SLIIT · Colombo, Sri Lanka',
    body:
      "Began a Bachelor of IT (Hons) in Software Engineering at SLIIT. Wrote my first REST API in PHP that very semester and quickly learned the difference between a working demo and a stable system.",
    tags: ['Java', 'PHP', 'MySQL'],
    icon: 'Sparkles',
  },
  {
    year: '2021',
    title: 'Software Engineer Intern',
    org: 'Rootcode · Jun 2021 – Mar 2022',
    body:
      "Gained broad full-stack exposure, building frontend applications in React, Redux, and Next.js, and backend services in Node.js and NestJS. Managed MySQL databases with TypeScript ORMs and integrated third-party services including Stripe, Twilio, Firebase, and AWS S3.",
    tags: ['React', 'Next.js', 'NestJS', 'Node.js', 'MySQL', 'Stripe'],
    icon: 'Code',
  },
  {
    year: '2022',
    title: 'Cloud Infrastructure Intern',
    org: 'Surge Global · Sep 2022 – Mar 2023',
    body:
      "Focused on cloud infrastructure, provisioning resources across AWS, Azure, and GCP using Terraform, supporting database migrations, and contributing to DevOps workflows and deployment pipelines.",
    tags: ['AWS', 'Azure', 'GCP', 'Terraform', 'DevOps', 'CI/CD'],
    icon: 'Cloud',
  },
  {
    year: '2023',
    title: 'Honours Thesis · IEEE Xplore',
    org: 'SLIIT · ICAC 2023',
    body:
      "Graduated with a Bachelor of IT Honours (Second Class Upper). My thesis on low-resource machine learning models for child cognitive ability assessments was presented at ICAC 2023 and published on IEEE Xplore.",
    tags: ['Machine Learning', 'Python', 'Research', 'IEEE'],
    icon: 'Brain',
    link: { label: 'View on IEEE Xplore', href: 'https://ieeexplore.ieee.org/document/10025049' },
  },
  {
    year: '2023',
    title: 'Software Engineer',
    org: 'Rooster Technology · Mar 2023 – Apr 2026',
    body:
      "Worked on a production-grade HRIS and ATS platform from system design to deployment. Built scalable GraphQL and REST APIs within a microservice architecture on AWS, and delivered full-stack features using React, Next.js, Node.js, NestJS, MySQL, MongoDB, and Elasticsearch.",
    tags: ['GraphQL', 'NestJS', 'React', 'AWS', 'MySQL', 'MongoDB', 'Elasticsearch'],
    icon: 'Server',
  },
  {
    year: '2024',
    title: 'Postgrad · Melbourne',
    org: 'MSc IT · Software Architecture · RMIT',
    body:
      "Relocated to Melbourne for a Master of Information Technology specialising in Software Architecture at RMIT (2024–2025). Coursework spans distributed systems, cloud engineering, and applied AI.",
    tags: ['Software Architecture', 'Distributed Systems', 'Cloud', 'AI'],
    icon: 'Database',
  },
  {
    year: '2026',
    title: 'Now',
    org: 'Open to full-time roles',
    body:
      "Completed the master's at RMIT and pursuing the AWS Certified Solutions Architect (SAA-C03). Passionate about cloud infrastructure, DevOps automation, and AI advancements. Looking for a team that takes engineering rigor and developer experience seriously.",
    tags: ['Hiring me?', 'Full-Stack', 'Cloud', 'DevOps'],
    icon: 'Zap',
    active: true,
  },
];

function TimelineItem({ item, index }) {
  const IconCmp = Icons[item.icon] || Icons.Sparkles;
  const isLeft = index % 2 === 0;
  return (
    <Reveal
      delay={index * 80}
      className="relative md:grid md:grid-cols-2 md:gap-12 mb-8 md:mb-2"
    >
      {/* Marker */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-7 z-10">
        <span className={`relative h-3 w-3 rounded-full ${item.active ? 'bg-iris-400 node-pulse' : 'bg-zinc-700 border border-white/10'}`} />
      </div>

      {/* Card */}
      <div className={`${isLeft ? 'md:pr-10 md:text-right' : 'md:col-start-2 md:pl-10'}`}>
        <div className="glass rounded-2xl p-5 hover:border-white/[0.14] transition-colors">
          <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
            <span className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${item.active ? 'bg-iris-500/15 text-iris-300 border border-iris-500/30' : 'bg-white/[0.04] text-zinc-400 border border-white/[0.08]'}`}>
              <IconCmp size={15} />
            </span>
            <div className={`${isLeft ? 'md:text-right' : ''}`}>
              <div className="font-mono text-[11px] tracking-wider text-iris-300 uppercase">{item.year}</div>
              <div className="text-zinc-100 font-medium text-[15px]">{item.title}</div>
            </div>
          </div>
          <div className={`text-[12px] font-mono text-zinc-500 mb-2`}>{item.org}</div>
          <p className="text-[13.5px] text-zinc-400 leading-relaxed">{item.body}</p>
          {item.link && (
            <a
              href={item.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-iris-300 hover:text-iris-200 transition-colors ${isLeft ? 'md:float-right' : ''}`}
            >
              {item.link.label}
              <Icons.ExternalLink size={10} />
            </a>
          )}
          <div className={`mt-3 flex flex-wrap gap-1.5 ${isLeft ? 'md:justify-end' : ''}`}>
            {item.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[10.5px] text-zinc-400 border border-white/[0.07] bg-white/[0.02] rounded-md px-1.5 py-[2px]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function About() {
  return (
    <section id="about" className="relative section-pad">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionLabel num="01" label="about" />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text max-w-2xl">
            From internships to HRIS platforms in the cloud
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-4 text-zinc-400 max-w-2xl text-[15px] leading-relaxed">
            4+ years of professional engineering, spanning cloud internships, full-stack
            product work, ML research published on IEEE Xplore, and a master&rsquo;s in
            Melbourne. Here&rsquo;s how it unfolded
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* Center spine */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/0 via-white/[0.08] to-white/0" />
          <div className="space-y-4 md:space-y-6">
            {TIMELINE.map((item, i) => (
              <TimelineItem key={item.year + item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ num, label }) {
  return (
    <div className="inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
      <span className="text-iris-400">{num}</span>
      <span className="h-px w-8 bg-white/[0.12]" />
      <span>{label}</span>
    </div>
  );
}

window.About = About;
window.SectionLabel = SectionLabel;
