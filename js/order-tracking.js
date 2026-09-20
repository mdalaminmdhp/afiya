document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('track-submit');
  const result = document.getElementById('track-result');
  if (!button) return;
  button.addEventListener('click', () => {
    const orderId = document.getElementById('track-order-id').value.trim();
    const phone = document.getElementById('track-phone').value.trim();
    if (!orderId || !phone) {
      result.textContent = 'Please enter both your order ID and phone number.';
      result.className = 'notice error';
      result.style.display = 'block';
      return;
    }
    result.textContent = `Order ${orderId} is currently in processing. This demo is prepared for backend order tracking integration.`;
    result.className = 'notice success';
    result.style.display = 'block';
  });
});
