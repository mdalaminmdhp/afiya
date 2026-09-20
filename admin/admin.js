fetch('../data/products.json')
  .then(response => response.json())
  .then(products => {
    const countNode = document.getElementById('admin-product-count');
    if (countNode) countNode.textContent = products.length;
  })
  .catch(() => {
    const countNode = document.getElementById('admin-product-count');
    if (countNode) countNode.textContent = '0';
  });
