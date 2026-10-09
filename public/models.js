// Feature 008: Real Photography. See intent/features/008-real-photography.md
// The photo models. `depth` is where each sits on the 1 to 10 scale, judged by eye from the photo.
// Credits and licence: public/credits.html. The people pictured are not named and endorse nothing.
export const PHOTO_MODELS = [
  { id: 'lighter', label: 'Lighter', depth: 2, src: '/photos/model-lighter.jpg', alt: 'Portrait of a woman with lighter skin', focus: '50% 40%' },
  { id: 'light-medium', label: 'Light to medium', depth: 4, src: '/photos/model-light-medium.jpg', alt: 'Portrait of a woman with light to medium skin', focus: '50% 30%' },
  { id: 'medium-deep', label: 'Medium to deep', depth: 6.5, src: '/photos/model-medium-deep.jpg', alt: 'Portrait of a woman with medium to deep skin', focus: '50% 35%' },
  { id: 'deeper', label: 'Deeper', depth: 9, src: '/photos/model-deeper.jpg', alt: 'Portrait of a woman with deeper skin', focus: '50% 25%' },
];

// The model whose skin depth is closest. On a tie, the lighter model.
export function nearestModel(depth, models = PHOTO_MODELS) {
  return models.reduce((best, m) => (Math.abs(m.depth - depth) < Math.abs(best.depth - depth) ? m : best));
}
