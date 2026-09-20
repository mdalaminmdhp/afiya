const BRAND_INFO = {
  name: 'AFIYA FASHION HOUSE',
  phone: '01701585007',
  whatsapp: '01701585007',
  whatsappUrl: 'https://wa.me/8801701585007',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/8801701585007'
  }
};

const currency = (value) => `৳${Number(value || 0).toLocaleString('en-BD')}`;

function handleImageError(event) {
  const img = event.target;
  if (!img || img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';
  img.onerror = null;
}

function getCart() {
  return JSON.parse(localStorage.getItem('afiya_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('afiya_cart', JSON.stringify(cart));
}

function addToCart(product, qty = 1, selectedSize = '', selectedColor = '') {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id && item.size === selectedSize && item.color === selectedColor);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      size: selectedSize || (product.sizes && product.sizes[0]) || 'Free Size',
      color: selectedColor || (product.colors && product.colors[0]) || 'Default',
      image: product.image,
      quantity: qty
    });
  }
  saveCart(cart);
  renderCartCount();
  return cart;
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('afiya_wishlist') || '[]');
}

function saveWishlist(list) {
  localStorage.setItem('afiya_wishlist', JSON.stringify(list));
}

function renderCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('[data-cart-count]').forEach(node => node.textContent = count);
}

function renderWishlistCount() {
  const count = getWishlist().length;
  document.querySelectorAll('[data-wishlist-count]').forEach(node => node.textContent = count);
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const exists = wishlist.includes(productId);
  if (exists) {
    const next = wishlist.filter(item => item !== productId);
    saveWishlist(next);
  } else {
    wishlist.push(productId);
    saveWishlist(wishlist);
  }
  renderWishlistCount();
  const favButtons = document.querySelectorAll('[data-favorite-id]');
  favButtons.forEach(button => {
    const id = button.getAttribute('data-favorite-id');
    if (id === productId) {
      button.classList.toggle('active', !exists);
    }
  });
}

function initSharedLayout() {
  const header = document.querySelector('.header');
  if (header) {
    const setHeaderState = () => {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState);
  }

  const searchInput = document.querySelector('[data-search-input]');
  if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const term = searchInput.value.trim();
        if (term) {
          window.location.href = `shop.html?search=${encodeURIComponent(term)}`;
        }
      }
    });
  }

  const menuButton = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '100%';
      nav.style.left = '0';
      nav.style.background = '#fff';
      nav.style.width = '100%';
      nav.style.padding = '16px';
      nav.style.borderBottom = '1px solid #eee';
    });
  }

  document.querySelectorAll('[data-social]').forEach((link) => {
    const key = link.getAttribute('data-social');
    if (BRAND_INFO.social[key]) {
      link.href = BRAND_INFO.social[key];
    }
  });

  renderCartCount();
  renderWishlistCount();
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '';
}

function makeProductCardHtml(product) {
  const wishlist = getWishlist();
  const inWishlist = wishlist.includes(product.id);
  return `
    <article class="product-card">
      <div class="product-image-box">
        <div class="product-badges">
          <span class="badge ${String(product.badge || '').toLowerCase().replace(/\s+/g, '-') || 'new'}">${product.badge || 'New'}</span>
        </div>
        <button class="product-fav ${inWishlist ? 'active' : ''}" type="button" data-favorite-id="${product.id}" aria-label="Add to wishlist">
          <i class="fa-solid fa-heart"></i>
        </button>
        <a href="product.html?id=${product.id}" aria-label="Open ${product.name}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="handleImageError(event)" />
        </a>
      </div>
      <div class="product-body">
        <div class="product-category">${product.category}</div>
        <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="rating-row">
          <span class="stars">★★★★★</span>
          <span>${product.rating}</span>
          <span>(${product.reviews})</span>
        </div>
        <div class="price-row">
          <span class="current-price">${currency(product.price)}</span>
          <span class="old-price">${currency(product.oldPrice || product.price)}</span>
        </div>
        <div class="discount-tag">-${product.discount || 0}%</div>
        <div class="product-actions">
          <button class="btn btn-primary" type="button" data-add-cart="${product.id}">Add to Cart</button>
          <a class="btn btn-light action-icon" href="product.html?id=${product.id}"><i class="fa-solid fa-bag-shopping"></i></a>
        </div>
      </div>
    </article>
  `;
}

function renderTimestampLabel() {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function fetchProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Product data not found');
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSharedLayout();

  document.body.addEventListener('click', (event) => {
    const cartButton = event.target.closest('[data-add-cart]');
    if (cartButton) {
      const id = cartButton.getAttribute('data-add-cart');
      fetchProducts().then((list) => {
        const product = list.find(item => item.id === id);
        if (product) addToCart(product, 1);
      });
    }

    const favorite = event.target.closest('[data-favorite-id]');
    if (favorite) {
      toggleWishlist(favorite.getAttribute('data-favorite-id'));
    }
  });
});
