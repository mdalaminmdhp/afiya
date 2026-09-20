function getCartItems() {
  return JSON.parse(localStorage.getItem('afiya_cart') || '[]');
}

function setCartItems(items) {
  localStorage.setItem('afiya_cart', JSON.stringify(items));
}

function getCartSummary() {
  const items = getCartItems();
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const delivery = subtotal > 1500 ? 0 : 60;
  const discount = 0;
  const grandTotal = subtotal + delivery - discount;
  return { subtotal, delivery, discount, grandTotal, items };
}

function updateCartUI() {
  const summary = getCartSummary();
  const subtotalNode = document.getElementById('checkout-subtotal');
  if (subtotalNode) subtotalNode.textContent = currency(summary.subtotal);
  const deliveryNode = document.getElementById('checkout-delivery');
  if (deliveryNode) deliveryNode.textContent = currency(summary.delivery);
  const discountNode = document.getElementById('checkout-discount');
  if (discountNode) discountNode.textContent = `-${currency(summary.discount)}`;
  const totalNode = document.getElementById('checkout-total');
  if (totalNode) totalNode.textContent = currency(summary.grandTotal);

  const itemContainer = document.getElementById('checkout-cart-items');
  if (itemContainer) {
    if (!summary.items.length) {
      itemContainer.innerHTML = '<div class="empty-state">Your cart is empty. Add a few items to continue.</div>';
      return;
    }

    itemContainer.innerHTML = summary.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" onerror="handleImageError(event)" />
        <div>
          <h4>${item.name}</h4>
          <p>${item.size} / ${item.color}</p>
          <div class="cart-controls">
            <div class="qty-stepper">
              <button type="button" data-cart-qty="decrease" data-item-id="${item.id}-${item.size}-${item.color}">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-cart-qty="increase" data-item-id="${item.id}-${item.size}-${item.color}">+</button>
            </div>
            <button class="btn btn-light" type="button" data-cart-remove="${item.id}-${item.size}-${item.color}">Remove</button>
          </div>
        </div>
        <div class="cart-price"><strong>${currency(item.price * item.quantity)}</strong></div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  document.body.addEventListener('click', (event) => {
    const target = event.target.closest('[data-cart-qty]');
    if (target) {
      const key = target.getAttribute('data-item-id');
      const items = getCartItems();
      const index = items.findIndex(item => `${item.id}-${item.size}-${item.color}` === key);
      if (index === -1) return;
      const item = items[index];
      if (target.getAttribute('data-cart-qty') === 'increase') item.quantity += 1;
      else item.quantity = Math.max(1, item.quantity - 1);
      setCartItems(items);
      updateCartUI();
      renderCartCount();
    }

    const removeButton = event.target.closest('[data-cart-remove]');
    if (removeButton) {
      const key = removeButton.getAttribute('data-cart-remove');
      const items = getCartItems().filter(item => `${item.id}-${item.size}-${item.color}` !== key);
      setCartItems(items);
      updateCartUI();
      renderCartCount();
    }
  });
});
