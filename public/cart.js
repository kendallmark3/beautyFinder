// Feature 005: the shopper's bag. See intent/features/005-cart.md
// SEC-4: the bag lives in this browser's session storage only. Shade codes are never sent anywhere.
export const BAG_KEY = 'beauty-advisor.bag';
export const MAX_LINE_QUANTITY = 10;

export const lineKey = (line) => `${line.productId}:${line.shadeCode ?? ''}`;

const clamp = (q) => Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.trunc(q) || 1));

// item: { productId, name, shadeCode?, shadeName?, depth?, undertone? }
export function addItem(lines, item) {
  const key = lineKey(item);
  if (lines.some((l) => lineKey(l) === key)) {
    return lines.map((l) => (lineKey(l) === key ? { ...l, quantity: clamp(l.quantity + 1) } : l));
  }
  return [...lines, { ...item, quantity: 1 }];
}

export function setQuantity(lines, key, quantity) {
  return lines.map((l) => (lineKey(l) === key ? { ...l, quantity: clamp(quantity) } : l));
}

export function removeLine(lines, key) {
  return lines.filter((l) => lineKey(l) !== key);
}

export function countItems(lines) {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

// What the server is told: product ids and quantities. No shade.
export function pricingRequest(lines) {
  const quantities = new Map();
  for (const l of lines) quantities.set(l.productId, (quantities.get(l.productId) ?? 0) + l.quantity);
  return { items: [...quantities].map(([productId, quantity]) => ({ productId, quantity })) };
}

export function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function loadBag(storage = globalThis.sessionStorage) {
  try {
    const lines = JSON.parse(storage.getItem(BAG_KEY) ?? '[]');
    return Array.isArray(lines) ? lines.filter((l) => typeof l?.productId === 'string' && Number.isInteger(l.quantity)) : [];
  } catch {
    return [];
  }
}

export function saveBag(lines, storage = globalThis.sessionStorage) {
  try { storage.setItem(BAG_KEY, JSON.stringify(lines)); } catch { /* storage unavailable: the bag lasts for this page only */ }
}

export function updateBagCount(lines = loadBag()) {
  for (const el of document.querySelectorAll('[data-bag-count]')) {
    el.textContent = countItems(lines);
    el.parentElement.classList.remove('bump');
    void el.parentElement.offsetWidth;
    el.parentElement.classList.add('bump');
  }
}

export function addToBag(item, button) {
  const lines = addItem(loadBag(), item);
  saveBag(lines);
  updateBagCount(lines);
  if (button) {
    const label = button.dataset.label ?? (button.dataset.label = button.textContent);
    button.textContent = 'Added to bag';
    button.classList.add('added');
    clearTimeout(button._revert);
    button._revert = setTimeout(() => { button.textContent = label; button.classList.remove('added'); }, 1400);
  }
  return lines;
}
