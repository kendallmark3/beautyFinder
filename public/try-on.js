// Feature 004: Shade Try-On. See intent/features/004-shade-try-on.md
// SEC-2: a picked shade stays in the page. Nothing in this file logs, stores, or sends it.
import { shadeColor } from './shade-color.js';

export const STEP_MS = 2200;

export function foundationShades(products) {
  return products
    .filter((p) => p.category === 'foundation')
    .flatMap((p) => (p.shades || []).map((s) => ({ ...s, productId: p.id, productName: p.name })))
    .sort((a, b) => a.depth - b.depth || a.code.localeCompare(b.code));
}

// The neck is drawn slightly deeper than the face so the two shapes read apart.
export function skinColors(shade) {
  return {
    skin: shadeColor(shade.depth, shade.undertone),
    shadow: shadeColor(shade.depth + 0.8, shade.undertone),
  };
}

export function previewText(shade) {
  return `Previewing ${shade.name} · ${shade.undertone} undertone`;
}

export function swatchButtons(shades) {
  return shades.map((s, index) => ({ index, label: `Preview ${s.name}`, color: shadeColor(s.depth, s.undertone) }));
}

export function nextIndex(index, count) {
  return (index + 1) % count;
}

// Steps through the shades until the shopper picks one. `show(shade, index, colors)` paints.
export function createTryOn({ shades, show, reducedMotion = false, timers = globalThis }) {
  let index = -1;
  let timer = null;
  let picked = false;
  const display = (i) => { index = i; show(shades[i], i, skinColors(shades[i])); };
  const stop = () => {
    if (timer !== null) timers.clearInterval(timer);
    timer = null;
  };
  return {
    start() {
      if (reducedMotion || picked || timer !== null || !shades.length) return;
      display(0);
      timer = timers.setInterval(() => display(nextIndex(index, shades.length)), STEP_MS);
    },
    pick(i) {
      picked = true;
      stop();
      display(i);
    },
    stop,
    get index() { return index; },
    get cycling() { return timer !== null; },
  };
}

export function mountTryOn({ row, label, art, shades, reducedMotion, onShow }) {
  const buttons = swatchButtons(shades).map((d) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.style.background = d.color;
    b.title = shades[d.index].name;
    b.setAttribute('aria-label', d.label);
    b.setAttribute('aria-pressed', 'false');
    row.appendChild(b);
    return b;
  });
  const tryOn = createTryOn({
    shades,
    reducedMotion,
    show: (shade, i, colors) => {
      art.style.setProperty('--skin', colors.skin);
      art.style.setProperty('--skin-shadow', colors.shadow);
      label.textContent = previewText(shade);
      buttons.forEach((b, j) => {
        b.classList.toggle('active', j === i);
        b.setAttribute('aria-pressed', String(j === i));
      });
      onShow?.(shade);
    },
  });
  buttons.forEach((b, i) => b.addEventListener('click', () => {
    // Announce picks to screen readers, but not every step of the auto-cycle.
    label.setAttribute('aria-live', 'polite');
    tryOn.pick(i);
  }));
  tryOn.start();
  return tryOn;
}
