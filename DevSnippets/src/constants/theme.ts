export const Colors = {
  background: "#0A0A0A",
  surface: "#111111",
  surfaceRaised: "#1A1A1A",
  border: "#222222",
  borderFocus: "#FFD600",
  primary: "#FFD600",
  primaryDark: "#E6C200",
  primaryText: "#0A0A0A",
  accent: "#FFE44D",
  success: "#3ECF8E",
  warning: "#FFD600",
  danger: "#FF4D4D",
  textPrimary: "#F5F5F5",
  textSecondary: "#999999",
  textMuted: "#555555",
  codeBackground: "#0D0D0D",
  favoriteActive: "#FFD600",
  favoriteInactive: "#444444",
} as const;

export const LanguageColors: Record<string, string> = {
  javascript: "#FFD600",
  typescript: "#3178C6",
  python: "#3776AB",
  swift: "#FA7343",
  kotlin: "#7F52FF",
  rust: "#DEA584",
  go: "#00ADD8",
  java: "#ED8B00",
  c: "#A8B9CC",
  cpp: "#00599C",
  css: "#264DE4",
  html: "#E34F26",
  sql: "#4479A1",
  bash: "#4EAA25",
  json: "#777",
  yaml: "#CB171E",
  markdown: "#083FA1",
  other: "#888",
};

export const LanguageLabels: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  cpp: "C++",
  css: "CSS",
  html: "HTML",
  sql: "SQL",
  json: "JSON",
  other: "Other",
};

export const LANGUAGES = Object.keys(LanguageLabels) as Array<
  keyof typeof LanguageLabels
>;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

export const Typography = {
  fontMono: "monospace" as const,
  fontSans: "System" as const,
};
