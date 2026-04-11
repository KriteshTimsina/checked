import {
  Github,
  Smartphone,
  ArrowDown,
  CheckCircle2,
  StickyNote,
  Palette,
  Zap,
  Shield,
  ArrowRight,
  Tag,
  Heart,
} from "lucide-react";
import Link from "next/link";

// ─── Releases fetcher ────────────────────────────────────────────────────────

type Release = {
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  prerelease: boolean;
};

async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/KriteshTimsina/checked/releases",
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      },
    );
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch {
    return [];
  }
}

function parseHighlights(body: string): string[] {
  if (!body) return [];
  return body
    .split("\n")
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function Home() {
  const releases = await getReleases();

  console.log(JSON.stringify(releases, null, ""), "FU");
  return (
    <main>
      {/* ── SECTION 1: FOREST — Hero ──────────────────────────────────────── */}
      <section
        id='forest'
        className='theme-section relative min-h-screen grain overflow-hidden flex flex-col'
        style={{ backgroundColor: "#E4F3D8" }}
      >
        {/* Blobs */}
        <div className='pointer-events-none absolute inset-0 overflow-hidden'>
          <div
            className='animate-blob absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-40'
            style={{ backgroundColor: "#3DC42A" }}
          />
          <div
            className='animate-blob-delay absolute top-1/2 -right-20 w-72 h-72 rounded-full opacity-30'
            style={{ backgroundColor: "#2A8A1E" }}
          />
          <div
            className='absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-20'
            style={{ backgroundColor: "#3DC42A" }}
          />
        </div>

        {/* Header */}
        <header className='relative z-10 flex items-center justify-between px-8 py-6'>
          <div className='flex items-center gap-2'>
            <div
              className='w-8 h-8 rounded-xl flex items-center justify-center text-lg'
              style={{ backgroundColor: "#3DC42A" }}
            >
              ✅
            </div>
            <span
              className='font-display font-bold text-xl'
              style={{ color: "#1a3d12" }}
            >
              Checked.
            </span>
          </div>
          <a
            href='https://github.com/kriteshtimsina/checked'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-lg'
            style={{ backgroundColor: "#3DC42A", color: "white" }}
          >
            <Github size={16} />
            Star on GitHub
          </a>
        </header>

        {/* Hero content */}
        <div className='relative z-10 flex flex-1 flex-col items-center justify-center text-center px-6 pb-20'>
          <div
            className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fadeUp'
            style={{
              backgroundColor: "#3DC42A20",
              color: "#2A8A1E",
              border: "1px solid #3DC42A40",
            }}
          >
            <span className='w-2 h-2 rounded-full bg-current animate-pulse' />
            Open source · Free forever
          </div>

          <h1
            className='font-display text-6xl md:text-8xl font-black leading-none tracking-tight mb-6 animate-fadeUp delay-100'
            style={{ color: "#1a3d12" }}
          >
            Todos &amp; Notes.
            <br />
            <em className='font-light' style={{ color: "#3DC42A" }}>
              Never miss
            </em>
            <br />a thing.
          </h1>

          <p
            className='text-lg md:text-xl max-w-lg mb-10 animate-fadeUp delay-200 leading-relaxed'
            style={{ color: "#2A8A1E99" }}
          >
            A beautifully simple app for checklists and notes — with four
            gorgeous themes that adapt to your mood.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 animate-fadeUp delay-300'>
            <a
              href='https://github.com/KriteshTimsina/checked/releases/download/v0.0.2-alpha/Checked-v0.1.1-alpha.apk'
              download
              className='group flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white transition-all hover:scale-105 hover:shadow-xl'
              style={{ backgroundColor: "#3DC42A" }}
            >
              <Smartphone
                size={20}
                className='group-hover:-translate-y-0.5 transition-transform'
              />
              Download for Android
            </a>
            <a
              href='https://github.com/kriteshtimsina/checked'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all hover:scale-105'
              style={{
                backgroundColor: "#3DC42A18",
                color: "#2A8A1E",
                border: "1.5px solid #3DC42A40",
              }}
            >
              <Github size={20} />
              View Source
            </a>
          </div>

          {/* Feature pills */}
          <div className='flex flex-wrap justify-center gap-3 mt-12 animate-fadeUp delay-500'>
            {[
              { icon: CheckCircle2, label: "Smart Checklists" },
              { icon: StickyNote, label: "Rich Notes" },
              { icon: Palette, label: "4 Themes" },
              { icon: Zap, label: "Offline First" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium'
                style={{
                  backgroundColor: "white",
                  color: "#2A8A1E",
                  boxShadow: "0 2px 12px #3DC42A20",
                }}
              >
                <Icon size={14} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float'
          style={{ color: "#3DC42A" }}
        >
          <span className='text-xs font-medium tracking-widest uppercase opacity-60'>
            Scroll
          </span>
          <ArrowDown size={16} className='opacity-60' />
        </div>
      </section>

      {/* ── SECTION 2: SANDY — Features ──────────────────────────────────── */}
      <section
        id='sandy'
        className='theme-section relative min-h-screen grain overflow-hidden flex flex-col justify-center'
        style={{ backgroundColor: "#FDF8F2" }}
      >
        <div className='pointer-events-none absolute inset-0'>
          <div
            className='absolute top-20 right-0 w-80 h-80 rounded-full opacity-20'
            style={{ backgroundColor: "#B8864E", filter: "blur(60px)" }}
          />
          <div
            className='absolute bottom-20 left-0 w-60 h-60 rounded-full opacity-15'
            style={{ backgroundColor: "#7A5230", filter: "blur(80px)" }}
          />
        </div>

        <div className='relative z-10 max-w-6xl mx-auto px-8 py-20 w-full'>
          <div className='mb-16'>
            <span className='text-4xl mb-4 block'>🌾</span>
            <h2
              className='font-display text-5xl md:text-7xl font-black leading-tight mb-4'
              style={{ color: "#3d2010" }}
            >
              Everything you
              <br />
              <em className='font-light' style={{ color: "#B8864E" }}>
                need, nothing
              </em>
              <br />
              you don&apos;t.
            </h2>
            <p
              className='text-lg max-w-md leading-relaxed'
              style={{ color: "#7A523099" }}
            >
              Checked strips away complexity. Just your tasks, your notes, your
              way.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            {[
              {
                emoji: "✅",
                title: "Checklists",
                desc: "Create, organize, and complete tasks with satisfying haptic feedback on every check.",
                bg: "#F0E4D0",
              },
              {
                emoji: "📝",
                title: "Rich Notes",
                desc: "Capture thoughts, ideas, and anything in between. Notes that stay out of your way.",
                bg: "#F0E4D0",
              },
              {
                emoji: "🎨",
                title: "4 Themes",
                desc: "Forest, Sandy, Tomato, Lavender. Pick the one that matches your mood today.",
                bg: "#F0E4D0",
              },
              {
                emoji: "📴",
                title: "Works Offline",
                desc: "All data lives on your device. No account. No cloud. No tracking.",
                bg: "#F0E4D0",
              },
              {
                emoji: "⚡",
                title: "Instant Sync",
                desc: "Lightning fast SQLite storage. Your lists open before you even blink.",
                bg: "#F0E4D0",
              },
              {
                emoji: "🔓",
                title: "Open Source",
                desc: "Every line of code is public. Fork it, extend it, make it yours.",
                bg: "#F0E4D0",
              },
            ].map((f) => (
              <div
                key={f.title}
                className='rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300'
                style={{ backgroundColor: f.bg, border: "1px solid #B8864E18" }}
              >
                <div className='text-3xl mb-3'>{f.emoji}</div>
                <h3
                  className='font-display font-bold text-xl mb-2'
                  style={{ color: "#3d2010" }}
                >
                  {f.title}
                </h3>
                <p
                  className='text-sm leading-relaxed'
                  style={{ color: "#7A5230" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: TOMATO — What's New ───────────────────────────────── */}
      <section
        id='tomato'
        className='theme-section relative min-h-screen grain overflow-hidden flex flex-col justify-center'
        style={{ backgroundColor: "#FFF5F5" }}
      >
        <div className='pointer-events-none absolute inset-0'>
          <div
            className='absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-25'
            style={{ backgroundColor: "#FF6B6B", filter: "blur(80px)" }}
          />
          <div
            className='absolute bottom-0 left-1/4 w-72 h-72 rounded-full opacity-20'
            style={{ backgroundColor: "#FFE66D", filter: "blur(60px)" }}
          />
        </div>

        <div className='relative z-10 max-w-3xl mx-auto px-8 py-20 w-full'>
          <div className='mb-12 flex items-center gap-3'>
            <span className='text-4xl'>🍅</span>
            <div>
              <h2
                className='font-display text-5xl font-black'
                style={{ color: "#4d0f0f" }}
              >
                What&apos;s New
              </h2>
              <p
                className='text-sm font-medium mt-1'
                style={{ color: "#FF6B6B" }}
              >
                Live from GitHub Releases
              </p>
            </div>
          </div>

          {releases.length === 0 ? (
            <FallbackReleases />
          ) : (
            <div className='space-y-5'>
              {releases.map((release, i) => (
                <div
                  key={release.tag_name}
                  className='rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-300'
                  style={{
                    backgroundColor: "white",
                    border: `1.5px solid ${i === 0 ? "#FF6B6B" : "#FFE0E0"}`,
                    boxShadow: i === 0 ? "0 4px 24px #FF6B6B20" : "none",
                  }}
                >
                  <div
                    className='flex items-center gap-3 px-5 py-3'
                    style={{ backgroundColor: i === 0 ? "#FF6B6B" : "#FFE0E0" }}
                  >
                    <Tag size={14} color={i === 0 ? "white" : "#FF6B6B"} />
                    <span
                      className='font-bold text-sm'
                      style={{ color: i === 0 ? "white" : "#FF6B6B" }}
                    >
                      {release.tag_name}
                    </span>
                    {i === 0 && (
                      <span className='ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold'>
                        Latest
                      </span>
                    )}
                    <span
                      className='ml-auto text-xs opacity-70'
                      style={{ color: i === 0 ? "white" : "#FF6B6B" }}
                    >
                      {formatDate(release.published_at)}
                    </span>
                  </div>
                  <ul className='px-5 py-4 space-y-2'>
                    {parseHighlights(release.body)
                      .slice(0, 5)
                      .map((h, idx) => (
                        <li
                          key={idx}
                          className='flex items-start gap-2.5 text-sm'
                        >
                          <ArrowRight
                            size={14}
                            className='mt-0.5 shrink-0'
                            style={{ color: "#FF6B6B" }}
                          />
                          <span style={{ color: "#4d0f0f" }}>{h}</span>
                        </li>
                      ))}
                    {parseHighlights(release.body).length === 0 && (
                      <li
                        className='text-sm italic'
                        style={{ color: "#FF6B6B80" }}
                      >
                        No release notes.
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 4: LAVENDER — Download + Footer ───────────────────────── */}
      <section
        id='lavender'
        className='theme-section relative min-h-screen grain overflow-hidden flex flex-col'
        style={{ backgroundColor: "#FAF5FF" }}
      >
        <div className='pointer-events-none absolute inset-0'>
          <div
            className='absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-30'
            style={{ backgroundColor: "#C77DFF", filter: "blur(100px)" }}
          />
          <div
            className='absolute bottom-1/4 -left-20 w-80 h-80 rounded-full opacity-20'
            style={{ backgroundColor: "#FF9F1C", filter: "blur(80px)" }}
          />
        </div>

        <div className='relative z-10 flex flex-1 flex-col items-center justify-center text-center px-6 py-20'>
          <span className='text-6xl mb-6 animate-float block'>🪻</span>

          <h2
            className='font-display text-5xl md:text-7xl font-black leading-tight mb-6'
            style={{ color: "#2d0a4d" }}
          >
            Ready to get
            <br />
            <em className='font-light' style={{ color: "#C77DFF" }}>
              organised?
            </em>
          </h2>

          <p
            className='text-lg max-w-md mb-12 leading-relaxed'
            style={{ color: "#9333ea60" }}
          >
            Download Checked today and never let another task, idea, or thought
            slip away.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 mb-20'>
            <a
              href='https://github.com/KriteshTimsina/checked/releases/download/v0.0.2-alpha/Checked-v0.1.1-alpha.apk'
              download
              className='group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl'
              style={{
                backgroundColor: "#C77DFF",
                boxShadow: "0 8px 32px #C77DFF40",
              }}
            >
              <Smartphone
                size={20}
                className='group-hover:-translate-y-0.5 transition-transform'
              />
              Download APK
            </a>
            <a
              href='https://github.com/kriteshtimsina/checked'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all hover:scale-105'
              style={{
                backgroundColor: "#EDD9FF",
                color: "#C77DFF",
                border: "1.5px solid #C77DFF40",
              }}
            >
              <Github size={20} />
              Star on GitHub
            </a>
          </div>

          {/* Themes showcase */}
          <div className='flex gap-4 mb-20'>
            {[
              { color: "#3DC42A", bg: "#E4F3D8", emoji: "🌿", name: "Forest" },
              { color: "#B8864E", bg: "#FDF8F2", emoji: "🌾", name: "Sandy" },
              { color: "#FF6B6B", bg: "#FFF5F5", emoji: "🍅", name: "Tomato" },
              {
                color: "#C77DFF",
                bg: "#FAF5FF",
                emoji: "🪻",
                name: "Lavender",
              },
            ].map((t) => (
              <div
                key={t.name}
                className='flex flex-col items-center gap-2 p-4 rounded-2xl hover:scale-110 transition-transform duration-300 cursor-default'
                style={{
                  backgroundColor: t.bg,
                  border: `2px solid ${t.color}30`,
                }}
              >
                <div
                  className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl'
                  style={{ backgroundColor: t.color + "20" }}
                >
                  {t.emoji}
                </div>
                <span className='text-xs font-bold' style={{ color: t.color }}>
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer
          className='relative z-10 border-t py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-3'
          style={{ borderColor: "#C77DFF20" }}
        >
          <div
            className='flex items-center gap-1.5 text-sm'
            style={{ color: "#9333ea80" }}
          >
            <span>Created with</span>
            <Heart
              size={14}
              className='fill-current'
              style={{ color: "#FF6B6B" }}
            />
            <span>by</span>
            <a
              href='https://kriteshtimsina.com.np'
              target='_blank'
              rel='noopener noreferrer'
              className='font-semibold hover:underline'
              style={{ color: "#C77DFF" }}
            >
              Kritesh Timsina
            </a>
          </div>
          <div
            className='flex items-center gap-6 text-sm'
            style={{ color: "#9333ea60" }}
          >
            <Link
              href='/privacy'
              className='hover:underline flex items-center gap-1.5 transition-opacity hover:opacity-100 opacity-70'
            >
              <Shield size={14} />
              Privacy Policy
            </Link>
            <a
              href='https://github.com/kriteshtimsina/checked'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline flex items-center gap-1.5 transition-opacity hover:opacity-100 opacity-70'
            >
              <Github size={14} />
              GitHub
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}

// Fallback if API fails
function FallbackReleases() {
  const updates = [
    {
      version: "v0.1.2-beta",
      date: "March 2026",
      highlights: [
        "Complete UI redesign",
        "Theme Customization",
        "Notes support",
      ],
      latest: true,
    },
    {
      version: "v0.1.1-beta",
      date: "February 2024",
      highlights: ["App preferences", "Offline support"],
      latest: false,
    },
    {
      version: "v0.1.0-beta",
      date: "April 2024",
      highlights: ["Ability to update checklist"],
      latest: false,
    },
  ];
  return (
    <div className='space-y-5'>
      {updates.map((u, i) => (
        <div
          key={u.version}
          className='rounded-2xl overflow-hidden'
          style={{
            backgroundColor: "white",
            border: `1.5px solid ${i === 0 ? "#FF6B6B" : "#FFE0E0"}`,
          }}
        >
          <div
            className='flex items-center gap-3 px-5 py-3'
            style={{ backgroundColor: i === 0 ? "#FF6B6B" : "#FFE0E0" }}
          >
            <Tag size={14} color={i === 0 ? "white" : "#FF6B6B"} />
            <span
              className='font-bold text-sm'
              style={{ color: i === 0 ? "white" : "#FF6B6B" }}
            >
              {u.version}
            </span>
            {u.latest && (
              <span className='ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold'>
                Latest
              </span>
            )}
            <span
              className='ml-auto text-xs opacity-70'
              style={{ color: i === 0 ? "white" : "#FF6B6B" }}
            >
              {u.date}
            </span>
          </div>
          <ul className='px-5 py-4 space-y-2'>
            {u.highlights.map((h, idx) => (
              <li key={idx} className='flex items-start gap-2.5 text-sm'>
                <ArrowRight
                  size={14}
                  className='mt-0.5 shrink-0'
                  style={{ color: "#FF6B6B" }}
                />
                <span style={{ color: "#4d0f0f" }}>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
