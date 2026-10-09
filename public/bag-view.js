// Feature 014: Bag Experience. See intent/features/014-bag-experience.md
// Display helpers only. Every amount comes from the server's pricing answer (BR-CART-2);
// nothing here prices a bag or works out a bundle.

// What a real checkout would go through. Only the first step exists in this demo.
export const JOURNEY = [
  { id: 'bag', label: 'Bag', inDemo: true },
  { id: 'delivery', label: 'Delivery', inDemo: false },
  { id: 'payment', label: 'Payment', inDemo: false },
  { id: 'confirmation', label: 'Confirmation', inDemo: false },
];

export function itemCountLabel(count) {
  return `${count} ${count === 1 ? 'item' : 'items'}`;
}

// The letter on the tile of a product that has no shade to show.
export function categoryLetter(category) {
  return (category ?? '').charAt(0).toUpperCase() || '·';
}

// lines: the shopper's bag (public/cart.js). priced: the answer from POST /api/cart/price.
export function receiptRows(lines, priced) {
  const unit = new Map(priced.lines.map((l) => [l.productId, l.unitPriceCents]));
  return [
    ...lines.map((l) => ({
      kind: 'line',
      label: `${l.quantity} × ${l.shadeName ?? l.name}`,
      detail: l.shadeName ? l.name : '',
      amountCents: unit.get(l.productId) * l.quantity,
    })),
    { kind: 'subtotal', label: 'Subtotal', detail: '', amountCents: priced.subtotalCents },
    ...priced.bundles.map((b) => ({ kind: 'saving', label: `${b.name} · ${b.percentOff}% off the set`, detail: '', amountCents: -b.savingCents })),
    { kind: 'total', label: 'Total', detail: '', amountCents: priced.totalCents },
  ];
}
