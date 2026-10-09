// Feature 015: Curated Recommendations. The list, prices and reasons come from the server.
import { addToBag, formatMoney, updateBagCount } from './cart.js';

const filters = document.querySelectorAll('#recommendation-filters button');
const grid = document.getElementById('recommendations-grid');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

async function loadRecommendations(category = 'all') {
  const query = category === 'all' ? '' : `?category=${encodeURIComponent(category)}`;
  const { recommendations } = await (await fetch(`/api/recommendations${query}`)).json();

  filters.forEach((button) => {
    const on = button.dataset.category === category;
    button.classList.toggle('active', on);
    button.setAttribute('aria-pressed', String(on));
  });

  grid.replaceChildren(...recommendations.map((item, i) => {
    const card = el('article', 'card pick');
    card.append(el('div', 'cat', `${i + 1} · ${item.category}`), el('h3', '', item.name), el('p', 'why', item.reason), el('p', '', item.description));
    const buy = el('div', 'buy');
    buy.appendChild(el('span', 'price', formatMoney(item.priceCents)));
    if (item.needsShade) {
      // A foundation goes in the bag with its shade, so it is chosen in the Shade Finder.
      const link = el('a', 'quiet-link', 'Find my shade');
      link.href = '/shade-finder.html';
      buy.appendChild(link);
    } else {
      const add = el('button', 'add', 'Add to bag');
      add.type = 'button';
      add.addEventListener('click', () => addToBag({ productId: item.id, name: item.name }, add));
      buy.appendChild(add);
    }
    card.appendChild(buy);
    return card;
  }));
}

filters.forEach((button) => {
  button.addEventListener('click', () => loadRecommendations(button.dataset.category));
});

updateBagCount();
loadRecommendations();
