// Feature 001: Product Catalog. See intent/features/001-product-catalog.md
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../data/products.json', import.meta.url), 'utf8'));

export const CATEGORIES = ['foundation', 'serum', 'mascara', 'lipstick'];

export function listProducts(category) {
  if (!category) return data.products;
  return data.products.filter((p) => p.category === category.toLowerCase());
}

export function getFoundationShades() {
  return data.products
    .filter((p) => p.category === 'foundation')
    .flatMap((p) => p.shades.map((s) => ({ ...s, productId: p.id, productName: p.name })));
}
