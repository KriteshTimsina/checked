'use client';
import { useEffect, useState } from 'react';

const sections = [
  { id: 'forest', color: '#3DC42A', label: 'Forest' },
  { id: 'sandy', color: '#B8864E', label: 'Sandy' },
  { id: 'tomato', color: '#FF6B6B', label: 'Tomato' },
  { id: 'lavender', color: '#C77DFF', label: 'Lavender' },
];

export default function NavDots() {
  const [active, setActive] = useState('forest');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.5 },
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {sections.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          title={s.label}
          className="group flex items-center justify-end gap-2"
        >
          <span
            className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap"
            style={{ color: s.color }}
          >
            {s.label}
          </span>
          <span
            className="nav-dot block rounded-full border-2 transition-all duration-300"
            style={{
              width: active === s.id ? '12px' : '8px',
              height: active === s.id ? '12px' : '8px',
              backgroundColor: active === s.id ? s.color : 'transparent',
              borderColor: s.color,
              opacity: active === s.id ? 1 : 0.5,
            }}
          />
        </a>
      ))}
    </nav>
  );
}
