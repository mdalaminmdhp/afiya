function getWishlistItems() {
  return JSON.parse(localStorage.getItem('afiya_wishlist') || '[]');
}

function renderWishlist() {
  const container = document.getElementById('wishlist-items');
  if (!container) return;

  const ids = getWishlistItems();
  fetchProducts().then((products) => {
    const items = products.filter(product => ids.includes(product.id));
    if (!items.length) {
      container.innerHTML = '<div class="empty-state">Your wishlist is empty. Save a few items to revisit later.</div>';
      return;
    }
    container.innerHTML = items.map(product => `
      <article class="product-card">
        <div class="product-image-box">
          <button class="product-fav active" type="button" data-favorite-id="${product.id}"><i class="fa-solid fa-heart"></i></button>
          <a href="product.html?id=${product.id}"><img src="${product.image}" alt="${product.name}" loading="lazy" onerror="handleImageError(event)" /></a>
        </div>
        <div class="product-body">
          <div class="product-category">${product.category}</div>
          <div class="product-name">${product.name}</div>
          <div class="price-row">
            <span class="current-price">${currency(product.price)}</span>
            <span class="old-price">${currency(product.oldPrice || product.price)}</span>
          </div>
          <div class="product-actions">
            <button class="btn btn-primary" type="button" data-add-cart="${product.id}">Add to Cart</button>
            <button class="btn btn-light" type="button" data-favorite-id="${product.id}">Remove</button>
          </div>
        </div>
      </article>
    `).join('');
  });
}

document.addEventListener('DOMContentLoaded', renderWishlist);
