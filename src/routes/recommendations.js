// Feature 015: Curated Recommendations
import { getRecommendations } from '../lib/recommendations.js';
import { sendJson } from '../lib/http.js';

export default [
  {
    method: 'GET',
    path: '/api/recommendations',
    handler: ({ res, query }) => {
      const category = query.get('category');
      const recommendations = getRecommendations(category);
      sendJson(res, 200, { count: recommendations.length, recommendations });
    },
  },
];
