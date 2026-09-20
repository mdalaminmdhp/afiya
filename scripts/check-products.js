const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const productsPath = path.join(root, 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const issues = [];

const ids = new Set();
const skus = new Set();
const names = new Set();
const slugs = new Set();
const imageRefs = new Set();

products.forEach((product, index) => {
  if (!product.id) issues.push(`Missing product id at index ${index}`);
  if (ids.has(product.id)) issues.push(`Duplicate ID: ${product.id}`);
  ids.add(product.id);

  if (!product.sku) issues.push(`Missing SKU at index ${index}`);
  if (skus.has(product.sku)) issues.push(`Duplicate SKU: ${product.sku}`);
  skus.add(product.sku);

  if (!product.name) issues.push(`Missing name at index ${index}`);
  if (names.has(product.name)) issues.push(`Duplicate name: ${product.name}`);
  names.add(product.name);

  if (!product.slug) issues.push(`Missing slug at index ${index}`);
  if (slugs.has(product.slug)) issues.push(`Duplicate slug: ${product.slug}`);
  slugs.add(product.slug);

  if (!product.category) issues.push(`Missing category at index ${index}`);
  if (!product.subcategory) issues.push(`Missing subcategory at index ${index}`);
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0 || !product.images[0]) {
    issues.push(`Missing image for ${product.name || `product ${index}`}`);
  }

  if (!product.price || Number(product.price) <= 0) issues.push(`Invalid price for ${product.name || `product ${index}`}`);
  if (!product.stock && product.stock !== 0) issues.push(`Invalid stock for ${product.name || `product ${index}`}`);

  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (!img || !img.trim()) {
        issues.push(`Empty image reference for ${product.name || `product ${index}`}`);
      } else {
        imageRefs.add(img.trim());
      }
    });
  }
});

const totalProducts = products.length;
const uniqueImageRefs = imageRefs.size;
const duplicateIds = totalProducts - ids.size;
const duplicateSkus = totalProducts - skus.size;
const duplicateNames = totalProducts - names.size;
const duplicateSlugs = totalProducts - slugs.size;

console.log(`Total products: ${totalProducts}`);
console.log(`Duplicate IDs: ${duplicateIds}`);
console.log(`Duplicate SKUs: ${duplicateSkus}`);
console.log(`Duplicate names: ${duplicateNames}`);
console.log(`Duplicate slugs: ${duplicateSlugs}`);
console.log(`Products without images: ${products.filter((p) => !p.images || !p.images.length || !p.images[0]).length}`);
console.log(`Unique image references: ${uniqueImageRefs}`);
console.log(`Invalid prices: ${products.filter((p) => !p.price || Number(p.price) <= 0).length}`);
console.log(`Invalid stock values: ${products.filter((p) => p.stock === undefined || p.stock === null || Number(p.stock) < 0).length}`);

if (totalProducts < 500) issues.push(`Catalog too small: ${totalProducts} products`);
if (duplicateIds > 0) issues.push('Duplicate IDs found');
if (duplicateSkus > 0) issues.push('Duplicate SKUs found');
if (duplicateNames > 0) issues.push('Duplicate names found');
if (duplicateSlugs > 0) issues.push('Duplicate slugs found');
if (products.some((p) => !p.images || !p.images.length || !p.images[0])) issues.push('Products missing primary image');
if (uniqueImageRefs < 500) issues.push(`Unique image references below 500: ${uniqueImageRefs}`);

if (issues.length) {
  console.error('\nValidation failed:');
  issues.forEach((issue) => console.error('-', issue));
  process.exit(1);
}

console.log('\nAll product checks passed.');
