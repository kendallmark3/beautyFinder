// Feature 005 route. AC-2..AC-4 in intent/features/005-cart.md
// SEC-4: the request body is a shopper's bag. It is never logged or stored here.
import { priceCart, validateCart } from '../lib/pricing.js';
import { sendJson } from '../lib/http.js';

export default [
  {
    method: 'POST',
    path: '/api/cart/price',
    handler: ({ res, body }) => {
      const fields = validateCart(body);
      if (fields) return sendJson(res, 400, { error: 'Invalid input', fields });
      sendJson(res, 200, priceCart(body.items));
    },
  },
];
