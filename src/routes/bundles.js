// Feature 006 route. AC-1 in intent/features/006-bundles.md
import { BUNDLES } from '../lib/bundles.js';
import { sendJson } from '../lib/http.js';

export default [
  {
    method: 'GET',
    path: '/api/bundles',
    handler: ({ res }) => sendJson(res, 200, { bundles: BUNDLES }),
  },
];
