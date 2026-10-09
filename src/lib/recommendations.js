// Feature 015: Curated Recommendations. See intent/features/015-curated-recommendations.md
// Rules: context/business-rules.md (BR-REC-1..BR-REC-3). Nothing about the shopper is used.
import { listProducts } from './catalog.js';

// BR-REC-1: a simple routine, in the order it is applied.
export const ROUTINE = ['serum', 'foundation', 'lipstick', 'mascara'];
export const MAX_PICKS = 3;

// BR-REC-3: what the product is for in the routine. No claim about popularity or fit.
const REASON_BY_CATEGORY = {
  serum: 'Skin prep, before foundation.',
  foundation: 'The base. Find your shade first.',
  lipstick: 'Colour to finish the look.',
  mascara: 'Definition for the eyes.',
};

export function getRecommendations(category) {
  const wanted = category && category.toLowerCase() !== 'all' ? category.toLowerCase() : null;
  // BR-REC-1: by default, the first product of each routine category. BR-REC-2: or one category's products.
  const source = wanted
    ? listProducts(wanted)
    : ROUTINE.flatMap((name) => listProducts(name).slice(0, 1));
  return source.slice(0, MAX_PICKS).map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    priceCents: product.priceCents,
    // A product with shades is bought through the Shade Finder, never added bare (Feature 005).
    needsShade: Array.isArray(product.shades) && product.shades.length > 0,
    reason: REASON_BY_CATEGORY[product.category] ?? '',
  }));
}
