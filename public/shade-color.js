// Approximate swatch colour from depth (1 light .. 10 deep) and undertone. Display only.
export function shadeColor(depth, undertone) {
  const t = (depth - 1) / 9;
  const l = 88 - t * 66;
  const hue = { cool: 18, neutral: 26, warm: 32 }[undertone] ?? 26;
  const sat = { cool: 38, neutral: 42, warm: 52 }[undertone] ?? 42;
  return `hsl(${hue} ${sat}% ${l}%)`;
}
