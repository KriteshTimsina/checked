import { ScrollText, ArrowRight, Tag, AlertCircle } from 'lucide-react';

type Release = {
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  prerelease: boolean;
};

async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch('https://api.github.com/repos/KriteshTimsina/checked/releases', {
      next: { revalidate: 3600 }, // revalidate every hour
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function parseHighlights(body: string): string[] {
  if (!body) return [];
  return body
    .split('\n')
    .map(l => l.replace(/^[-*•]\s*/, '').trim())
    .filter(l => l.length > 0 && !l.startsWith('#'));
}

export default async function WhatsNew() {
  const releases = await getReleases();

  return (
    <section className="py-12 w-full max-w-2xl mx-auto">
      <div className="mb-10 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
          <ScrollText className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">What&apos;s New</h2>
      </div>

      {releases.length === 0 ? (
        /* Fallback to hardcoded if API fails */
        <FallbackReleases />
      ) : (
        <div className="space-y-6">
          {releases.map((release, i) => (
            <div
              key={release.tag_name}
              className="group relative rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Left accent bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${i === 0 ? 'bg-[#3DC42A]' : 'bg-gray-200'}`}
              />

              <div className="p-6 pl-7">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-[#E4F3D8] text-[#2A8A1E] px-3 py-1 rounded-full text-sm font-bold">
                      <Tag className="h-3.5 w-3.5" />
                      {release.tag_name}
                    </div>
                    {release.prerelease && (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                        pre-release
                      </span>
                    )}
                    {i === 0 && (
                      <span className="bg-[#3DC42A] text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                        Latest
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap shrink-0">
                    {formatDate(release.published_at)}
                  </span>
                </div>

                {release.name && release.name !== release.tag_name && (
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{release.name}</h3>
                )}

                <ul className="space-y-2">
                  {parseHighlights(release.body)
                    .slice(0, 6)
                    .map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#3DC42A]" />
                        <span className="text-gray-700 text-sm leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  {parseHighlights(release.body).length === 0 && (
                    <li className="text-gray-400 text-sm italic">No release notes provided.</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Shown if GitHub API fails
function FallbackReleases() {
  const updates = [
    {
      version: 'v0.1.2-beta',
      date: 'March 2026',
      highlights: ['Complete UI redesign with notes and checklist support', 'Theme Customization'],
      latest: true,
    },
    {
      version: 'v0.1.1-beta',
      date: 'February 2024',
      highlights: ['Complete App preferences', 'Offline support'],
      latest: false,
    },
    {
      version: 'v0.1.0-beta',
      date: 'April 2024',
      highlights: ['Ability to update checklist'],
      latest: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
        <AlertCircle className="h-4 w-4" />
        <span>Showing cached release notes</span>
      </div>
      {updates.map((u, i) => (
        <div key={u.version} className="relative rounded-2xl bg-white/95 shadow-xl overflow-hidden">
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 ${i === 0 ? 'bg-[#3DC42A]' : 'bg-gray-200'}`}
          />
          <div className="p-6 pl-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#E4F3D8] text-[#2A8A1E] px-3 py-1 rounded-full text-sm font-bold">
                  <Tag className="h-3.5 w-3.5" />
                  {u.version}
                </div>
                {u.latest && (
                  <span className="bg-[#3DC42A] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Latest
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-400">{u.date}</span>
            </div>
            <ul className="space-y-2">
              {u.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#3DC42A]" />
                  <span className="text-gray-700 text-sm">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
