// Feature 006: Bundles. See intent/features/006-bundles.md
// Rules: context/business-rules.md (BR-BN-1..BR-BN-5). SEC-4: a bag is never logged or stored.

// BR-BN-1. Order matters: sets are formed in this order (BR-BN-2).
export const BUNDLES = [
  { id: 'complete-look', name: 'Complete Look', categories: ['foundation', 'mascara', 'lipstick'], percentOff: 15 },
  { id: 'glow-duo', name: 'Glow Duo', categories: ['foundation', 'serum'], percentOff: 10 },
];

// BR-BN-3: nearest cent, half up.
export function savingFor(sumCents, percentOff) {
  return Math.floor((sumCents * percentOff + 50) / 100);
}

// lines: [{ productId, name, category, unitPriceCents, quantity }]
export function applyBundles(lines, bundles = BUNDLES) {
  const pool = new Map();
  for (const { productId, name, category, unitPriceCents, quantity } of lines) {
    if (!pool.has(category)) pool.set(category, []);
    for (let i = 0; i < quantity; i++) pool.get(category).push({ productId, name, unitPriceCents });
  }
  // BR-BN-2: the highest priced unit in a category is used first.
  for (const units of pool.values()) {
    units.sort((a, b) => b.unitPriceCents - a.unitPriceCents || a.productId.localeCompare(b.productId));
  }
  const left = (category) => pool.get(category)?.length ?? 0;

  const applied = [];
  for (const b of bundles) {
    while (b.categories.every((c) => left(c) > 0)) {
      const items = b.categories.map((c) => pool.get(c).shift());
      const sum = items.reduce((s, u) => s + u.unitPriceCents, 0);
      applied.push({ id: b.id, name: b.name, percentOff: b.percentOff, items, savingCents: savingFor(sum, b.percentOff) });
    }
  }

  // BR-BN-5: one product away, counting only units no bundle has used.
  const suggestions = bundles.flatMap((b) => {
    const missing = b.categories.filter((c) => left(c) === 0);
    return missing.length === 1 ? [{ bundleId: b.id, name: b.name, percentOff: b.percentOff, missingCategory: missing[0] }] : [];
  });

  return { bundles: applied, savingsCents: applied.reduce((s, b) => s + b.savingCents, 0), suggestions };
}
