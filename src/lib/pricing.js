// Feature 005: Bag pricing. See intent/features/005-cart.md
// Rules: context/business-rules.md (BR-CART-1..BR-CART-4). SEC-4: a bag is never logged or stored.
import { listProducts } from './catalog.js';
import { applyBundles } from './bundles.js';

export const MAX_QUANTITY = 999;
export const MAX_PRODUCTS = 20;

export function validateCart(body, products = listProducts()) {
  const items = body?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return { items: 'Items must be a list with at least one product.' };
  }
  if (items.length > MAX_PRODUCTS) {
    return { items: `Items may list at most ${MAX_PRODUCTS} products.` };
  }
  const known = new Set(products.map((p) => p.id));
  const seen = new Set();
  const fields = {};
  items.forEach((item, i) => {
    const id = item?.productId;
    if (typeof id !== 'string' || !known.has(id)) {
      fields[`items[${i}].productId`] = 'Unknown product.';
    } else if (seen.has(id)) {
      fields[`items[${i}].productId`] = 'Each product may be listed once. Use quantity for more.';
    } else {
      seen.add(id);
    }
    const q = item?.quantity;
    if (!Number.isInteger(q) || q < 1 || q > MAX_QUANTITY) {
      fields[`items[${i}].quantity`] = `Quantity must be a whole number from 1 to ${MAX_QUANTITY}.`;
    }
  });
  return Object.keys(fields).length ? fields : null;
}

// BR-CART-2: only productId and quantity are read from the request.
export function priceCart(items, products = listProducts()) {
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = items.map(({ productId, quantity }) => {
    const p = byId.get(productId);
    return {
      productId,
      name: p.name,
      category: p.category,
      unitPriceCents: p.priceCents,
      quantity,
      lineTotalCents: p.priceCents * quantity,
    };
  });
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  // Feature 006 (BR-BN-4): total = subtotal − bundle savings.
  const { bundles, savingsCents, suggestions } = applyBundles(lines);
  return { lines, subtotalCents, bundles, savingsCents, totalCents: subtotalCents - savingsCents, suggestions };
}
