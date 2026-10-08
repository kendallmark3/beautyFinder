// Feature 001 route. AC-1..AC-4 in intent/features/001-product-catalog.md
import { listProducts } from '../lib/catalog.js';
import { sendJson } from '../lib/http.js';

export default [
  {
    method: 'GET',
    path: '/api/products',
    handler: ({ res, query }) => {
      const products = listProducts(query.get('category'));
      sendJson(res, 200, { count: products.length, products });
    },
  },
];
