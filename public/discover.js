// Feature 007: Beauty Discovery Experience. See intent/features/007-beauty-discovery.md
// Since Feature 008 the models are photographs and the look is shown as a palette beside them.
// SEC-2: complexion and look choices stay in this page. Nothing here logs, stores, or sends them
// (shade matching posts only depth and undertone to the existing, non-logging /api/shade-match).
import { shadeColor } from './shade-color.js';
import { PHOTO_MODELS } from './models.js';

export const MODELS = PHOTO_MODELS;

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
  { id: 'natural', label: 'Natural', color: null, word: 'natural' },
  { id: 'defined', label: 'Defined', color: '#8a6f7f', word: 'defined' },
  { id: 'dramatic', label: 'Dramatic', color: '#4a3350', word: 'dramatic' },
];

export const FINISHES = [
  { id: 'dewy', label: 'Dewy glow', word: 'dewy' },
  { id: 'soft', label: 'Soft natural', word: 'soft-focus' },
  { id: 'matte', label: 'Velvet matte', word: 'velvet matte' },
];

export const BLUSHES = [
  { id: 'none', label: 'None', color: null },
  { id: 'peach', label: 'Peach', color: '#f09a74' },
  { id: 'pink', label: 'Pink', color: '#e0627a' },
];

const find = (list, id) => list.find((x) => x.id === id);

// A look is named for its mood and colours, never for the person in the photograph.
export function lookName(s) {
  const mood = s.lip === 'red' || s.eyes === 'dramatic' ? 'Evening' : s.finish === 'dewy' ? 'Morning' : 'Everyday';
  const noun = { bare: 'Skin', rose: 'Rose', berry: 'Berry', red: 'Red' }[s.lip];
  const end = { matte: 'Velvet', dewy: 'Glow', soft: 'Edit' }[s.finish];
  return `${mood} ${noun} ${end}`;
}

export function lookSummary(s) {
  const lip = find(LIPS, s.lip), eye = find(EYES, s.eyes), fin = find(FINISHES, s.finish), bl = find(BLUSHES, s.blush);
  const parts = [`${fin.word} skin`, `${eye.word} eyes`, `${lip.word} lips`];
  if (bl.color) parts.push(`${bl.id} cheeks`);
  return parts.join(', ');
}

export const NO_MATCH = 'We could not match a foundation shade just now, so this look has no foundation. You can try again, or use the Shade Finder.';

export function reasoning(s, match) {
  const tone = find(UNDERTONES, s.undertone);
  const lines = [!match ? NO_MATCH : `You chose a ${tone.label.toLowerCase()} undertone and a ${s.depth <= 3 ? 'lighter' : s.depth <= 6 ? 'medium' : 'deeper'} depth, so ${match.name} is one of our closest foundation shades (${match.confidence} match). Try it as a preview; it is always worth testing in person.`];
  if (s.finish === 'dewy') lines.push('You like a dewy glow, so we added Hydra Glow Serum to prep skin.');
  if (s.eyes !== 'natural') lines.push(`A ${find(EYES, s.eyes).word} eye calls for Volume Lift Mascara.`);
  lines.push(`Velvet Matte Lipstick finishes the look; the ${find(LIPS, s.lip).label.toLowerCase()} colour in the palette is a preview.`);
  return lines.join(' ');
}

// The look as colour chips shown beside the photograph. `color: null` means nothing is applied.
export function palette(s, match) {
  const lip = find(LIPS, s.lip), eye = find(EYES, s.eyes), fin = find(FINISHES, s.finish), bl = find(BLUSHES, s.blush);
  const skin = shadeColor(match?.depth ?? s.depth, match?.undertone ?? s.undertone);
  return [
    { part: 'Foundation', value: match ? match.name : 'Finding your shade', color: skin, finish: fin.id },
    { part: 'Finish', value: fin.label, color: skin, finish: fin.id },
    { part: 'Eyes', value: eye.label, color: eye.color },
    { part: 'Lips', value: lip.label, color: lip.color },
    { part: 'Cheeks', value: bl.label, color: bl.color },
  ];
}

// What goes in the bag for a look. A foundation is listed only with its matched shade.
export function lookItems(s, match, products) {
  const out = [];
  const productFor = (category) => products.find((p) => p.category === category);
  const fdn = productFor('foundation');
  if (fdn && match) {
    out.push({
      label: match.name,
      role: 'Foundation, a close match for your selections',
      product: fdn,
      item: { productId: fdn.id, name: fdn.name, shadeCode: match.code, shadeName: match.name, depth: match.depth, undertone: match.undertone },
    });
  }
  const add = (category, role) => {
    const p = productFor(category);
    if (p) out.push({ label: p.name, role, product: p, item: { productId: p.id, name: p.name } });
  };
  if (s.finish === 'dewy') add('serum', 'Preps skin for a dewy glow');
  if (s.eyes !== 'natural') add('mascara', `For your ${find(EYES, s.eyes).word} eyes`);
  add('lipstick', 'Lipstick. The lip colour shown is a preview');
  return out;
}
