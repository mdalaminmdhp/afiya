async function loadReviews() {
  const container = document.getElementById('review-container');
  if (!container) return;
  try {
    const response = await fetch('data/reviews.json');
    const reviews = await response.json();
    container.innerHTML = reviews.map((review) => `
      <article class="review-card">
        <div class="review-header">
          <div>
            <div class="review-author">${review.name}</div>
            <div class="review-meta">${review.date} • ${review.product}</div>
          </div>
          <span class="badge best">Verified Purchase</span>
        </div>
        <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
        <p class="review-content">${review.review}</p>
      </article>
    `).join('');
  } catch (error) {
    console.error('Review load failed', error);
    container.innerHTML = '<div class="empty-state">Reviews are coming soon.</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadReviews);
