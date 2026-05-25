function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative z-10">
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Pipeline />
        <Architecture />
        <Skills />
        <Contact />
      </main>
      <Palette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
