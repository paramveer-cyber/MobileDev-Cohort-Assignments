export const BauhausColors = {
  red: "#E63329",
  blue: "#1B4FD8",
  yellow: "#F5C800",
  black: "#0D0D0D",
  white: "#F5F0E8",
  offWhite: "#EDE8DF",
  darkGray: "#1A1A1A",
  midGray: "#4A4A4A",
  lightGray: "#C8C4BC",
} as const;

export type AppTheme = {
  background: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textSecondary: string;
  textInverse: string;
  border: string;
  accent: string;
  accentSecondary: string;
  accentTertiary: string;
  danger: string;
  success: string;
  warning: string;
  scoreGood: string;
  scoreMid: string;
  scoreBad: string;
};

export const lightTheme: AppTheme = {
  background: BauhausColors.white,
  surface: BauhausColors.offWhite,
  surfaceRaised: "#FFFFFF",
  text: BauhausColors.black,
  textSecondary: BauhausColors.midGray,
  textInverse: BauhausColors.white,
  border: BauhausColors.lightGray,
  accent: BauhausColors.blue,
  accentSecondary: BauhausColors.red,
  accentTertiary: BauhausColors.yellow,
  danger: BauhausColors.red,
  success: "#1A7A3C",
  warning: "#C47800",
  scoreGood: "#1A7A3C",
  scoreMid: "#C47800",
  scoreBad: BauhausColors.red,
};

export const darkTheme: AppTheme = {
  background: BauhausColors.darkGray,
  surface: "#252525",
  surfaceRaised: "#2E2E2E",
  text: BauhausColors.white,
  textSecondary: "#A8A4A0",
  textInverse: BauhausColors.black,
  border: "#3A3A3A",
  accent: "#4D7EFF",
  accentSecondary: "#FF5A52",
  accentTertiary: BauhausColors.yellow,
  danger: "#FF5A52",
  success: "#2DB562",
  warning: "#F0A020",
  scoreGood: "#2DB562",
  scoreMid: "#F0A020",
  scoreBad: "#FF5A52",
};

export function getScoreColor(score: number, theme: AppTheme): string {
  if (score >= 80) return theme.scoreGood;
  if (score >= 60) return theme.scoreMid;
  return theme.scoreBad;
}

export function getScoreRating(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Fair";
  if (score >= 60) return "Poor";
  return "Dangerous";
}
