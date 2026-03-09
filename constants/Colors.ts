import { APP_THEMES } from './themes';

export type ColorSchemeType = 'light' | 'dark';

/**
 * Semantic base palette.
 * Every color has a clear purpose — no duplicates, no dead keys.
 *
 * Naming convention:
 *  surface      → screen / page background
 *  card         → elevated content (cards, sheets, inputs)
 *  border       → dividers, outlines
 *  text         → primary readable text
 *  textMuted    → placeholders, captions, secondary labels
 *  icon         → inactive icon tint
 */
const base = {
  light: {
    surface: '#FFFFFF',
    card: '#F4F4F5', // slightly off-white, distinct from surface
    border: '#E4E4E7',
    text: '#18181B', // near-black, softer than pure #000
    textMuted: '#71717A', // zinc-500 — readable but clearly secondary
    icon: '#A1A1AA', // zinc-400 — subtle inactive icons
  },
  dark: {
    surface: '#0F0F11', // deep but not pure black — easier on eyes
    card: '#1C1C1F', // slightly lifted from surface
    border: '#27272A', // zinc-800
    text: '#FAFAFA', // near-white
    textMuted: '#A1A1AA', // zinc-400
    icon: '#52525B', // zinc-600 — visible but receded
  },
};

/**
 * getColors — single source of truth for every color in the app.
 *
 * @param themeId    - from preferences store (0 = Sandy, 1 = Tomato, 2 = Lavender)
 * @param colorScheme - 'light' | 'dark' from preferences store
 *
 * Usage: always via useTheme() hook — never call at module level.
 */
export const getColors = (themeId: number, colorScheme: ColorSchemeType) => {
  const theme = APP_THEMES.find(t => t.id === themeId) ?? APP_THEMES[0];
  const scheme = base[colorScheme];

  return {
    // ── Theme accent (changes per theme selection) ──────────────────────────
    primary: theme.primary, // main CTA, active icons, selected states
    primarySoft: theme.cardBg, // tinted background behind primary elements
    accent: theme.accent, // secondary highlight, badges, tags

    // ── Surfaces (changes per dark/light) ───────────────────────────────────
    surface: scheme.surface, // screen background
    card: scheme.card, // cards, bottom sheets, inputs
    border: scheme.border, // dividers, input outlines

    // ── Typography (changes per dark/light) ─────────────────────────────────
    text: scheme.text, // headings, body
    textMuted: scheme.textMuted, // placeholders, subtitles, captions

    // ── Icons (changes per dark/light) ──────────────────────────────────────
    icon: scheme.icon, // inactive tab icons, chevrons

    // ── Convenience aliases ─────────────────────────────────────────────────
    background: scheme.surface, // alias — matches React Navigation naming
    tabIconSelected: theme.primary,
    tabIconDefault: scheme.icon,

    // ── Meta ────────────────────────────────────────────────────────────────
    colorScheme,
    isDark: colorScheme === 'dark',
    theme,
  };
};

export type AppColors = ReturnType<typeof getColors>;

// ─── Legacy shim ─────────────────────────────────────────────────────────────
// Keep this so existing files using `Colors.primary` / `Colors.dark.shade`
// don't break while you migrate. Delete once all usages are on useTheme().
export const Colors = {
  primary: APP_THEMES[0].primary,
  light: {
    text: base.light.text,
    background: base.light.surface,
    icon: base.light.icon,
    shade: base.light.card,
    tabIconDefault: base.light.icon,
    tabIconSelected: APP_THEMES[0].primary,
    tint: APP_THEMES[0].primary,
  },
  dark: {
    text: base.dark.text,
    background: base.dark.surface,
    icon: base.dark.icon,
    shade: base.dark.card,
    tabIconDefault: base.dark.icon,
    tabIconSelected: '#fff',
    tint: '#fff',
  },
};
