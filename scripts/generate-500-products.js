const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'data');

const categoryMap = [
  { category: "Women's Fashion", subcategories: ["Sarees", "Three Piece", "Salwar Kameez", "Kurtis", "Tops", "Dresses", "Gowns", "Abaya", "Hijab", "Modest Fashion"], gender: 'Women' },
  { category: "Men's Fashion", subcategories: ["Panjabi", "Shirts", "T-Shirts", "Polo Shirts", "Jeans", "Trousers", "Formal Wear", "Casual Wear"], gender: 'Men' },
  { category: "Kids Fashion", subcategories: ["Girls Clothing", "Boys Clothing", "Baby Clothing", "Party Wear", "Wedding Collection", "Festive Collection"], gender: 'Kids' },
  { category: "Accessories", subcategories: ["Shoes", "Sandals", "Sneakers", "Heels", "Flats", "Bags", "Handbags", "Backpacks", "Wallets", "Belts", "Watches", "Sunglasses", "Jewelry", "Fashion Accessories", "Scarves", "Socks", "Innerwear"], gender: 'Unisex' },
  { category: "Premium Collection", subcategories: ["Couple Fashion", "Family Matching Outfits", "Winter Fashion", "Summer Fashion", "Premium Collection", "Sale Collection"], gender: 'Unisex' }
];

const adjectivePool = ['Premium', 'Elegant', 'Modern', 'Minimal', 'Luxury', 'Classic', 'Trendy', 'Soft', 'Bold', 'Stylish', 'Refined', 'Vogue', 'Designer', 'Signature', 'Essential'];
const materialPool = ['Cotton', 'Silk', 'Linen', 'Crepe', 'Georgette', 'Chiffon', 'Jersey', 'Knit', 'Blend', 'Velvet', 'Premium Fabric'];
const colorPool = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Maroon', 'Navy', 'Beige', 'Brown', 'Gold', 'Purple'];
const sizePool = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const abbreviations = { "Women's Fashion": 'WF', "Men's Fashion": 'MF', 'Kids Fashion': 'KF', Accessories: 'AC', 'Premium Collection': 'PC' };

const baseImageUrls = [
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
  'https://images.unsplash.com/photo-1526045612212-70caf35c14df',
  'https://images.unsplash.com/photo-1524503033410-cd2a2d6808e8',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1525201548942-d8732f6617a0',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
  'https://images.unsplash.com/photo-1504593811423-6dd665756598',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  'https://images.unsplash.com/photo-1504593811423-6dd665756598',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const uniqueImage = (seed, index) => `${baseImageUrls[(seed + index * 13) % baseImageUrls.length]}?auto=format&fit=crop&w=900&q=80&sig=${seed + index * 29}`;

const productRecords = [];
const seenNames = new Set();
const seenSlugs = new Set();
const seenSkus = new Set();

let counter = 1;

for (const group of categoryMap) {
  for (const subcategory of group.subcategories) {
    const productCountTarget = 12;
    for (let i = 0; i < productCountTarget; i++) {
      const adjective = adjectivePool[(counter + i) % adjectivePool.length];
      const material = materialPool[(counter + i * 2) % materialPool.length];
      const name = `${adjective} ${subcategory} ${material} ${i + 1}`;
      const safeName = name.replace(/\s+/g, ' ').trim();
      const sku = `AFH-${abbreviations[group.category] || 'GEN'}-${String(counter).padStart(3, '0')}`;
      const slug = slugify(safeName);

      if (seenNames.has(safeName) || seenSlugs.has(slug) || seenSkus.has(sku)) {
        continue;
      }

      const basePrice = 990 + ((counter * 149) % 6100);
      const regularPrice = basePrice + 350 + ((counter * 77) % 1600);
      const discount = Math.min(45, Math.max(10, Math.round(((regularPrice - basePrice) / regularPrice) * 100)));
      const rating = Number((4.1 + ((counter % 9) * 0.09)).toFixed(1));
      const reviewCount = 30 + (counter * 9) % 800;
      const stock = 8 + (counter * 7) % 80;
      const colors = Array.from(new Set([colorPool[(counter + 1) % colorPool.length], colorPool[(counter + 2) % colorPool.length], colorPool[(counter + 4) % colorPool.length]]));
      const sizes = subcategory.includes('Shoes') || subcategory.includes('Sandals') || subcategory.includes('Sneakers') || subcategory.includes('Heels') || subcategory.includes('Flats') ? ['36', '37', '38', '39', '40', '41', '42'] : subcategory.includes('Kids') || subcategory.includes('Baby') ? ['4-5Y', '6-7Y', '8-9Y', '10-12Y'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const images = Array.from({ length: 3 }, (_, imgIndex) => uniqueImage(counter + i + 1, imgIndex));

      const record = {
        id: `AFH${String(counter).padStart(3, '0')}`,
        sku,
        name: safeName,
        slug,
        category: group.category,
        subcategory,
        brand: 'AFIYA FASHION HOUSE',
        price: basePrice,
        regularPrice,
        salePrice: basePrice,
        discount,
        currency: 'BDT',
        stock,
        stockStatus: stock > 0 ? 'in_stock' : 'out_of_stock',
        rating,
        reviewCount,
        badge: counter % 4 === 0 ? 'Sale' : counter % 3 === 0 ? 'Best Seller' : counter % 2 === 0 ? 'New' : 'Featured',
        description: `${safeName} is designed for everyday confidence with premium detailing, breathable comfort, and a polished finish ideal for modern style lovers.`,
        shortDescription: `${subcategory} essential with premium styling and easy everyday wear.`,
        images,
        sizes,
        colors,
        material: material,
        gender: group.gender,
        featured: counter % 2 === 0,
        newArrival: counter % 5 === 0,
        bestSeller: counter % 3 === 0,
        tags: [subcategory.toLowerCase().replace(/\s+/g, '-'), group.category.toLowerCase().replace(/\s+/g, '-'), 'fashion', 'afiya-fashion-house']
      };

      productRecords.push(record);
      seenNames.add(safeName);
      seenSlugs.add(slug);
      seenSkus.add(sku);
      counter += 1;
    }
  }
}

const extras = 15;
for (let i = 0; i < extras; i++) {
  const base = `Luxury Fashion Collection ${i + 1}`;
  const slug = slugify(base);
  const sku = `AFH-EX-${String(productRecords.length + 1).padStart(3, '0')}`;
  const uniqueName = `${base} ${i + 1}`;
  const price = 1800 + (i * 180);

  productRecords.push({
    id: `AFH${String(productRecords.length + 1).padStart(3, '0')}`,
    sku,
    name: uniqueName,
    slug,
    category: 'Premium Collection',
    subcategory: 'Premium Collection',
    brand: 'AFIYA FASHION HOUSE',
    price,
    regularPrice: price + 420,
    salePrice: price,
    discount: 18 + (i % 12),
    currency: 'BDT',
    stock: 10 + i,
    stockStatus: 'in_stock',
    rating: 4.8,
    reviewCount: 140 + i * 10,
    badge: 'Premium',
    description: 'Premium statement fashion designed for confident, style-led looks for every season.',
    shortDescription: 'Premium collection designed to stand out with timeless appeal.',
    images: Array.from({ length: 3 }, (_, imgIndex) => uniqueImage(productRecords.length + i + 50, imgIndex)),
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Free Size'],
    colors: ['Black', 'Gold', 'White', 'Pink'],
    material: 'Premium Fabric',
    gender: 'Unisex',
    featured: true,
    newArrival: false,
    bestSeller: true,
    tags: ['premium', 'fashion', 'afiya-fashion-house']
  });
}

if (productRecords.length < 500) {
  throw new Error(`Generated ${productRecords.length} products; target was 500.`);
}

fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(productRecords, null, 2), 'utf8');
console.log(`Generated ${productRecords.length} products`);
console.log(`Total unique references: ${new Set(productRecords.flatMap((p) => p.images)).size}`);
