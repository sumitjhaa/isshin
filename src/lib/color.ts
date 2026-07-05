export function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
}

function luminance(hex: string) {
    const { r, g, b } = hexToRgb(hex);
    const [R, G, B] = [r, g, b].map((c) => {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function deriveSurface(bg: string): string {
    const lum = luminance(bg);
    const { r, g, b } = hexToRgb(bg);
    const shift = lum < 0.4 ? 14 : -10;
    const clamp = (v: number) => Math.max(0, Math.min(255, v));
    const [R, G, B] = [r, g, b].map((v) => clamp(v + shift));
    return `#${R.toString(16).padStart(2, "0")}${G.toString(16).padStart(2, "0")}${B.toString(16).padStart(2, "0")}`;
}

export function deriveBorder(bg: string, text: string): string {
    const lum = luminance(bg);
    const t = lum < 0.4 ? 0.55 : 0.3;
    const bh = bg.replace("#", "");
    const th = text.replace("#", "");
    const clamp = (v: number) => Math.round(Math.max(0, Math.min(255, v)));
    const r = clamp(parseInt(bh.slice(0, 2), 16) * (1 - t) + parseInt(th.slice(0, 2), 16) * t);
    const g = clamp(parseInt(bh.slice(2, 4), 16) * (1 - t) + parseInt(th.slice(2, 4), 16) * t);
    const b = clamp(parseInt(bh.slice(4, 6), 16) * (1 - t) + parseInt(th.slice(4, 6), 16) * t);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
