// Instructor fallback: copy the reference Feature 002 build into the app.
// Usage: npm run lab:reference
import { cp } from 'node:fs/promises';
const ref = new URL('../reference/feature-002-shade-finder/', import.meta.url);
const root = new URL('../', import.meta.url);
for (const dir of ['src', 'public', 'tests']) {
  await cp(new URL(dir, ref), new URL(dir, root), { recursive: true });
}
console.log('Reference Feature 002 applied. Run: npm test && npm start');
