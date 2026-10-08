// Feature 002 route. AC-1..AC-6 in intent/features/002-shade-finder.md
// BR-SM-5 / SEC-2: skin inputs are never logged or stored. Do not add logging here.
import { matchShades, validateInput } from '../lib/shadeMatch.js';
import { sendJson } from '../lib/http.js';

export default [
  {
    method: 'POST',
    path: '/api/shade-match',
    handler: ({ res, body }) => {
      const errors = validateInput(body);
      if (errors) return sendJson(res, 400, { error: 'Invalid input', fields: errors });
      sendJson(res, 200, matchShades({ depth: body.depth, undertone: body.undertone }));
    },
  },
];
