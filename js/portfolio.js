/**
 * Portfolio page (portfolio.html) — renders cards from js/work-data.js
 */

(function () {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const grid = document.getElementById('portfolio-grid');
  if (!grid || typeof WORK_PROJECTS === 'undefined') return;

  grid.innerHTML = WORK_PROJECTS.map((project) => {
    const color = project.imageColor || 'mist';
    const mediaClass = `portfolio-card__media--${color}`;
    const mediaContent = project.image
      ? `<img src="${project.image}" alt="" loading="lazy">`
      : '';

    return `
      <article class="portfolio-card">
        <div class="portfolio-card__media ${mediaClass}">
          ${mediaContent}
        </div>
        <div class="portfolio-card__body">
          <p class="portfolio-card__cat">${project.category}</p>
          <h2 class="portfolio-card__title">${project.title}</h2>
          <p class="portfolio-card__status">${project.status}</p>
          <p class="portfolio-card__text">${project.description}</p>
        </div>
      </article>
    `;
  }).join('');
})();
