function canonicalCategoryName(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'Other';

  const normalized = raw
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (/(women|ladies|female)/.test(normalized)) return 'Women';
  if (/(men|male|gentlemen)/.test(normalized)) return 'Men';
  if (/(kids|children|girls?|boys?|baby)/.test(normalized)) return 'Kids';
  if (/(accessories?|bags?|shoes?|jewelry|watch|wallet|belt|sunglasses?|sandals?|heels?|flats?|handbags?|backpacks?|scarves?|socks?|innerwear)/.test(normalized)) return 'Accessories';
  if (/(premium|luxury|featured|sale)/.test(normalized)) return 'Premium Collection';

  return raw;
}

function categoryMatchesFilter(productCategory, filterValue) {
  if (!filterValue || filterValue === 'All') return true;
  return canonicalCategoryName(productCategory) === canonicalCategoryName(filterValue);
}

async function loadCatalogPage() {
  const page = document.body.dataset.page || 'home';
  const products = await fetchProducts();
  if (!products.length) return;

  if (page === 'home') {
    const newArrivals = products.slice(0, 8);
    const trending = products.filter(item => item.badge === 'Trending').slice(0, 10);
    renderProductGrid(newArrivals, '#new-arrivals-grid');
    renderTrendingSlider(trending.length ? trending : products.slice(0, 10));
    renderCollectionSection('Women', '#women-collection-grid', 4);
    renderCollectionSection('Men', '#men-collection-grid', 4);
    renderCollectionSection('Kids', '#kids-collection-grid', 4);
  }

  if (page === 'shop') {
    initShopPage(products);
  }

  if (page === 'product') {
    const productId = getQueryParam('id');
    const product = products.find(item => item.id === productId) || products[0];
    if (product) renderProductDetail(product, products);
  }
}

function renderProductGrid(items, selector) {
  const container = document.querySelector(selector);
  if (!container) return;
  container.innerHTML = items.map(product => makeProductCardHtml(product)).join('');
}

function renderTrendingSlider(products) {
  const container = document.querySelector('#trending-slider');
  if (!container) return;
  const current = products.slice(0, 12);
  container.innerHTML = current.map(product => `
    <div class="trending-item">
      ${makeProductCardHtml(product)}
    </div>
  `).join('');

  const prev = document.querySelector('[data-slide="prev"]');
  const next = document.querySelector('[data-slide="next"]');
  if (prev && next) {
    const track = document.querySelector('#trending-slider');
    const move = (dir) => {
      const itemWidth = track.firstElementChild?.getBoundingClientRect().width || 260;
      track.scrollBy({ left: dir * (itemWidth + 20), behavior: 'smooth' });
    };
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('mouseenter', () => {
      track.dataset.paused = 'true';
    });
    track.addEventListener('mouseleave', () => {
      delete track.dataset.paused;
    });
    setInterval(() => {
      if (track.dataset.paused === 'true') return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 20) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: 260, behavior: 'smooth' });
      }
    }, 2800);
  }
}

function renderCollectionSection(category, selector, limit = 4) {
  const container = document.querySelector(selector);
  if (!container) return;
  const items = fetchProductsSync().filter(item => categoryMatchesFilter(item.category, category)).slice(0, limit);
  container.innerHTML = items.map(product => `
    <article class="collection-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="handleImageError(event)" />
      <div class="collection-overlay">
        <h3>${product.subcategory}</h3>
      </div>
    </article>
  `).join('');
}

function fetchProductsSync() {
  const data = window.__AFH_PRODUCTS__ || [];
  return data;
}

async function initShopPage(products) {
  const searchParam = getQueryParam('search');
  const categoryParam = getQueryParam('category');
  const initialItems = products.filter((product) => {
    if (categoryParam) return categoryMatchesFilter(product.category, categoryParam);
    if (searchParam) {
      const haystack = `${product.name} ${product.category} ${product.subcategory}`.toLowerCase();
      return haystack.includes(searchParam.toLowerCase());
    }
    return true;
  });

  const categorySelect = document.querySelector('#categoryFilter');
  const priceSelect = document.querySelector('#priceFilter');
  const ratingSelect = document.querySelector('#ratingFilter');
  const sortSelect = document.querySelector('#sortFilter');
  const searchInput = document.querySelector('#shopSearch');

  if (categorySelect) {
    categorySelect.value = categoryParam || 'All';
  }
  if (searchInput && searchParam) {
    searchInput.value = searchParam;
  }

  let activeProducts = [...initialItems];
  const productsGrid = document.querySelector('#shop-products-grid');
  const loadMoreButton = document.querySelector('#load-more-products');
  let visibleCount = 24;

  function applyFilters() {
    let filtered = [...products];
    const selectedCategory = categorySelect ? categorySelect.value : 'All';
    const selectedPrice = priceSelect ? priceSelect.value : 'all';
    const selectedRating = ratingSelect ? ratingSelect.value : 'all';
    const selectedSort = sortSelect ? sortSelect.value : 'newest';
    const term = searchInput ? searchInput.value.trim().toLowerCase() : '';

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => categoryMatchesFilter(product.category, selectedCategory));
    }
    if (term) {
      filtered = filtered.filter(product => {
        const haystack = `${product.name} ${product.category} ${product.subcategory}`.toLowerCase();
        return haystack.includes(term) || canonicalCategoryName(product.category).toLowerCase().includes(term);
      });
    }
    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }
    if (selectedRating !== 'all') {
      filtered = filtered.filter(product => product.rating >= Number(selectedRating));
    }

    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'popular': return b.reviews - a.reviews;
        default: return b.price - a.price;
      }
    });

    activeProducts = filtered;
    visibleCount = 24;
    renderVisibleProducts();
  }

  function renderVisibleProducts() {
    if (!productsGrid) return;
    const slice = activeProducts.slice(0, visibleCount);
    productsGrid.innerHTML = slice.map(product => makeProductCardHtml(product)).join('');
    if (loadMoreButton) {
      loadMoreButton.style.display = visibleCount >= activeProducts.length ? 'none' : 'inline-flex';
    }
    document.querySelector('#shop-results-count').textContent = `${activeProducts.length} products`;
  }

  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
      visibleCount += 12;
      renderVisibleProducts();
    });
  }

  [categorySelect, priceSelect, ratingSelect, sortSelect].forEach((node) => {
    if (node) node.addEventListener('change', applyFilters);
  });
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  renderVisibleProducts();
}

async function renderProductDetail(product, products) {
  const root = document.querySelector('#product-detail-root');
  if (!root) return;

  const images = [product.image, ...Array.from({ length: 3 }, (_, index) => product.image + `?sig=${index + 1}`)];
  root.innerHTML = `
    <div class="product-layout">
      <div class="detail-gallery">
        <div class="main-image">
          <img id="main-product-image" src="${product.image}" alt="${product.name}" onerror="handleImageError(event)" />
        </div>
        <div class="thumb-row">
          ${images.slice(0, 4).map((src, index) => `
            <button class="thumb ${index === 0 ? 'active' : ''}" type="button" data-thumb="${src}">
              <img src="${src}" alt="${product.name} view ${index + 1}" loading="lazy" onerror="handleImageError(event)" />
            </button>
          `).join('')}
        </div>
      </div>
      <div class="detail-info">
        <div class="badge ${String(product.badge || 'New').toLowerCase().replace(/\s+/g, '-')}" style="margin-bottom: 12px;">${product.badge || 'New'}</div>
        <h1>${product.name}</h1>
        <div class="detail-meta">
          <span>Category: ${product.category}</span>
          <span>Subcategory: ${product.subcategory}</span>
        </div>
        <div class="detail-meta">
          <span class="stars">★★★★★</span>
          <span>${product.rating} (${product.reviews} reviews)</span>
        </div>
        <div class="price-block">
          <span class="detail-price">${currency(product.price)}</span>
          <span class="old-price-strong">${currency(product.oldPrice || product.price)}</span>
          <span class="discount-tag">Save ${product.discount || 0}%</span>
        </div>
        <div class="stock">In stock: ${product.stock} items available</div>
        <p>${product.description}</p>

        <div class="variant-row">
          <h4>Size</h4>
          <div class="chip-list" data-size-options>
            ${(product.sizes || ['Free Size']).map((size, index) => `
              <button class="chip ${index === 0 ? 'active' : ''}" type="button" data-size="${size}">${size}</button>
            `).join('')}
          </div>
        </div>

        <div class="variant-row">
          <h4>Color</h4>
          <div class="chip-list" data-color-options>
            ${(product.colors || ['Default']).map((color, index) => `
              <button class="chip ${index === 0 ? 'active' : ''}" type="button" data-color="${color}">${color}</button>
            `).join('')}
          </div>
        </div>

        <div class="qty-row">
          <span>Quantity</span>
          <div class="qty-control">
            <button type="button" data-qty-action="decrease">−</button>
            <span id="detail-qty">1</span>
            <button type="button" data-qty-action="increase">＋</button>
          </div>
        </div>

        <div class="detail-actions">
          <button class="btn btn-primary" type="button" id="detail-buy-now">Buy Now</button>
          <button class="btn btn-secondary" type="button" id="detail-add-cart">Add to Cart</button>
          <button class="btn btn-outline" type="button" id="detail-wishlist">Wishlist</button>
          <a class="btn btn-light" href="${BRAND_INFO.whatsappUrl}?text=${encodeURIComponent('Hello AFIYA FASHION HOUSE, I want to order ' + product.name + ' (ID: ' + product.id + ')')}">WhatsApp Order</a>
        </div>
      </div>
    </div>
  `;

  const mainImage = document.getElementById('main-product-image');
  document.querySelectorAll('[data-thumb]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const src = thumb.getAttribute('data-thumb');
      mainImage.src = src;
      document.querySelectorAll('.thumb').forEach(item => item.classList.toggle('active', item === thumb));
    });
  });

  let selectedSize = (product.sizes && product.sizes[0]) || 'Free Size';
  let selectedColor = (product.colors && product.colors[0]) || 'Default';
  let quantity = 1;

  document.querySelectorAll('[data-size]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedSize = button.getAttribute('data-size');
      document.querySelectorAll('[data-size]').forEach(item => item.classList.toggle('active', item === button));
    });
  });

  document.querySelectorAll('[data-color]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedColor = button.getAttribute('data-color');
      document.querySelectorAll('[data-color]').forEach(item => item.classList.toggle('active', item === button));
    });
  });

  document.querySelector('[data-qty-action="increase"]').addEventListener('click', () => {
    quantity += 1;
    document.getElementById('detail-qty').textContent = quantity;
  });
  document.querySelector('[data-qty-action="decrease"]').addEventListener('click', () => {
    quantity = Math.max(1, quantity - 1);
    document.getElementById('detail-qty').textContent = quantity;
  });

  document.getElementById('detail-add-cart').addEventListener('click', () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    alert('Product added to cart successfully!');
  });

  document.getElementById('detail-buy-now').addEventListener('click', () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    window.location.href = 'checkout.html';
  });

  document.getElementById('detail-wishlist').addEventListener('click', () => {
    toggleWishlist(product.id);
    alert('Wishlist updated.');
  });
}

window.__AFH_PRODUCTS__ = window.__AFH_PRODUCTS__ || [];

async function hydrateGlobalProducts() {
  if (!window.__AFH_PRODUCTS__.length) {
    const list = await fetchProducts();
    window.__AFH_PRODUCTS__ = list;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await hydrateGlobalProducts();
  loadCatalogPage();
});
