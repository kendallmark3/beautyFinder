// Feature 002 route. AC-1..AC-6 in intent/features/002-shade-finder.md
// SEC-2: the request body is skin data. It is never logged or stored here.
import { matchShades, validateInput } from '../lib/shadeMatch.js';
import { sendJson } from '../lib/http.js';

export default [
  {
    method: 'POST',
    path: '/api/shade-match',
    handler: ({ res, body }) => {
      const fields = validateInput(body);
      if (fields) return sendJson(res, 400, { error: 'Invalid input', fields });
      sendJson(res, 200, matchShades({ depth: body.depth, undertone: body.undertone }));
    },
  },
];
