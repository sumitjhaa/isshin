export type Phase = "work" | "shortBreak" | "longBreak";

export const PHASES: Phase[] = ["work", "shortBreak", "longBreak"];
export const LABELS: Record<Phase, string> = {
    work: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
};

export interface Theme {
    name: string;
    bg: string;
    text: string;
    primary: string;
    secondary: string;
    neutral: string;
    surface: string;
    border: string;
    accent: string;
}

export type TabId = "timer" | "theme" | "wallpaper";

export type WallpaperResult = {
    id: string;
    thumb: string;
    full: string;
};

export type FontCategory = "timer" | "ui" | "mono";

export interface FontOption {
    name: string;
    value: string;
    google: string | null;
}

export type ToastType = "info" | "success" | "error" | "warning" | "tip";
