// Feature 007: Beauty Discovery Experience. See intent/features/007-beauty-discovery.md
// SEC-2: complexion and look choices stay in this page. Nothing here logs, stores, or sends them
// (shade matching posts only depth and undertone to the existing, non-logging /api/shade-match).
import { shadeColor } from './shade-color.js';

export const MODELS = [
  { id: 'amara', name: 'Amara', blurb: 'Deep skin, natural curls', depth: 8, hair: '#1d1412', style: 'curls' },
  { id: 'sofia', name: 'Sofia', blurb: 'Medium skin, hair in a bun', depth: 5, hair: '#2b1a14', style: 'bun' },
  { id: 'elise', name: 'Elise', blurb: 'Light skin, long straight hair', depth: 2, hair: '#6b3f2a', style: 'long' },
  { id: 'mei', name: 'Mei', blurb: 'Light-medium skin, sleek bob', depth: 3.5, hair: '#15110f', style: 'bob' },
];

export const UNDERTONES = [
  { id: 'warm', label: 'Golden', hint: 'Gold jewelry flatters me; I tan easily.' },
  { id: 'cool', label: 'Rosy', hint: 'Silver jewelry flatters me; I flush pink.' },
  { id: 'neutral', label: 'In between', hint: 'Both metals work, or I am not sure.' },
];

export const LIPS = [
  { id: 'bare', label: 'Bare', color: '#c98f84', word: 'soft' },
  { id: 'rose', label: 'Rose', color: '#b8434e', word: 'rosy' },
  { id: 'berry', label: 'Berry', color: '#7a2447', word: 'berry' },
  { id: 'red', label: 'Classic red', color: '#b0171f', word: 'bold red' },
];

export const EYES = [
  { id: 'natural', label: 'Natural', lash: 1.8, lid: 0, word: 'natural' },
  { id: 'defined', label: 'Defined', lash: 3, lid: 0.18, word: 'defined' },
  { id: 'dramatic', label: 'Dramatic', lash: 4.6, lid: 0.4, word: 'dramatic' },
];

export const FINISHES = [
  { id: 'dewy', label: 'Dewy glow', shine: 0.55, word: 'dewy' },
  { id: 'soft', label: 'Soft natural', shine: 0.22, word: 'soft-focus' },
  { id: 'matte', label: 'Velvet matte', shine: 0, word: 'velvet matte' },
];

export const BLUSHES = [
  { id: 'none', label: 'None', color: '#e08a80', opacity: 0 },
  { id: 'peach', label: 'Peach', color: '#f09a74', opacity: 0.45 },
  { id: 'pink', label: 'Pink', color: '#e0627a', opacity: 0.5 },
];

const find = (list, id) => list.find((x) => x.id === id);

export function lookName(s) {
  const mood = s.lip === 'red' || s.eyes === 'dramatic' ? 'Evening' : s.finish === 'dewy' ? 'Morning' : 'Everyday';
  const noun = { bare: 'Skin', rose: 'Rose', berry: 'Berry', red: 'Red' }[s.lip];
  const end = { matte: 'Velvet', dewy: 'Glow', soft: 'Edit' }[s.finish];
  return `${s.model.name}'s ${mood} ${noun} ${end}`;
}

export function lookSummary(s) {
  const lip = find(LIPS, s.lip), eye = find(EYES, s.eyes), fin = find(FINISHES, s.finish), bl = find(BLUSHES, s.blush);
  const parts = [`${fin.word} skin`, `${eye.word} eyes`, `${lip.word} lips`];
  if (bl.opacity) parts.push(`${bl.id} cheeks`);
  return parts.join(', ');
}

export function reasoning(s, match) {
  if (!match) return '';
  const tone = find(UNDERTONES, s.undertone);
  const lines = [`You chose ${s.model.name}'s ${tone.label.toLowerCase()} undertone and a ${s.depth <= 3 ? 'lighter' : s.depth <= 6 ? 'medium' : 'deeper'} depth, so ${match.name} is one of our closest foundation shades (${match.confidence} match). Try it as a preview; it is always worth testing in person.`];
  if (s.finish === 'dewy') lines.push('You like a dewy glow, so we added Hydra Glow Serum to prep skin.');
  if (s.eyes !== 'natural') lines.push(`A ${find(EYES, s.eyes).word} eye calls for Volume Lift Mascara.`);
  lines.push(`${find(LIPS, s.lip).label} lips finish the look with Velvet Matte Lipstick.`);
  return lines.join(' ');
}

export function modelSvg(m) {
  const hairBack = {
    curls: `<circle cy="-34" r="98" fill="var(--hair)"/><circle cx="-78" cy="-70" r="34" fill="var(--hair)"/><circle cx="78" cy="-70" r="34" fill="var(--hair)"/><circle cx="-92" cy="-8" r="30" fill="var(--hair)"/><circle cx="92" cy="-8" r="30" fill="var(--hair)"/><circle cy="-118" r="36" fill="var(--hair)"/>`,
    bun: `<circle cy="-100" r="32" fill="var(--hair)"/>`,
    long: `<path d="M-72,-10 C-82,-104 82,-104 72,-10 L84,170 Q0,190 -84,170 Z" fill="var(--hair)"/>`,
    bob: `<path d="M-74,-6 C-86,-108 86,-108 74,-6 L70,60 Q0,76 -70,60 Z" fill="var(--hair)"/>`,
  }[m.style];
  const hairFront = {
    curls: `<path d="M-57,-10 C-60,-80 60,-80 57,-10 C40,-46 -40,-46 -57,-10 Z" fill="var(--hair)"/>`,
    bun: `<path d="M-58,-6 C-64,-86 64,-86 58,-6 C44,-50 -44,-50 -58,-6 Z" fill="var(--hair)"/>`,
    long: `<path d="M-58,-8 C-62,-84 62,-84 58,-8 C40,-52 -6,-62 -58,-8 Z" fill="var(--hair)"/>`,
    bob: `<path d="M-58,-8 C-64,-86 64,-86 58,-8 C30,-40 -20,-54 -58,-8 Z" fill="var(--hair)"/>`,
  }[m.style];
  const earrings = m.style === 'bun' ? '<circle cx="-58" cy="26" r="5" fill="#c9a36a"/><circle cx="58" cy="26" r="5" fill="#c9a36a"/>' : '';
  return `<svg viewBox="0 0 400 460" role="img" aria-label="${m.name}: ${m.blurb}" class="model-svg">
  <defs><radialGradient id="sheen" cx="40%" cy="30%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  <g transform="translate(200,230) scale(1.55)">
    ${hairBack}
    <path d="M-125,330 C-125,160 -60,116 -22,110 L22,110 C60,116 125,160 125,330 Z" fill="#1c1c1c"/>
    <path d="M-22,60 L22,60 L24,112 Q0,150 -24,112 Z" class="skin" style="fill:var(--skin-shadow)"/>
    <ellipse rx="56" ry="70" class="skin" style="fill:var(--skin)"/>
    <ellipse rx="56" ry="70" fill="url(#sheen)" class="sheen" style="opacity:var(--shine)"/>
    ${hairFront}
    <ellipse cx="-30" cy="-4" rx="13" ry="7" class="lid" style="fill:var(--lid);opacity:var(--lid-o)"/>
    <ellipse cx="30" cy="-4" rx="13" ry="7" class="lid" style="fill:var(--lid);opacity:var(--lid-o)"/>
    <ellipse cx="-38" cy="24" rx="15" ry="10" class="blush" style="fill:var(--blush);opacity:var(--blush-o)"/>
    <ellipse cx="38" cy="24" rx="15" ry="10" class="blush" style="fill:var(--blush);opacity:var(--blush-o)"/>
    <path d="M-30,0 q10,9 20,0 M10,0 q10,9 20,0" fill="none" stroke="#2a1a14" stroke-width="var(--lash)" stroke-linecap="round" class="lash"/>
    <path d="M-13,37 q6.5,-6 13,-1 q6.5,-5 13,1 q-13,13 -26,0 Z" class="lip" style="fill:var(--lip)"/>
    ${earrings}
  </g></svg>`;
}

export function applyLook(el, s, skin) {
  const lip = find(LIPS, s.lip), eye = find(EYES, s.eyes), fin = find(FINISHES, s.finish), bl = find(BLUSHES, s.blush);
  const set = (k, v) => el.style.setProperty(k, v);
  set('--hair', s.model.hair);
  set('--skin', skin.skin); set('--skin-shadow', skin.shadow);
  set('--lip', lip.color); set('--lash', eye.lash); set('--lid', '#6b4a7a'); set('--lid-o', eye.lid);
  set('--shine', fin.shine); set('--blush', bl.color); set('--blush-o', bl.opacity);
}

export function skinFor(depth, undertone) {
  return { skin: shadeColor(depth, undertone), shadow: shadeColor(depth + 0.8, undertone) };
}
