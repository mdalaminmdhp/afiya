import json
import random
from pathlib import Path

base = Path(r'c:\Users\pc\Desktop\All Project\Afiya Fashion house')

def pick_image(idx, category, sub):
    urls = [
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    ]
    return urls[(idx * 7 + len(category) + len(sub)) % len(urls)]

women = {
    'Saree': ['Premium Women\'s Embroidered Saree', 'Royal Silk Wedding Saree', 'Classic Cotton Saree', 'Festival Organza Saree', 'Designer Tussar Saree', 'Elegant Georgette Saree'],
    'Three Piece': ['Elegant Three Piece Set', 'Printed Three Piece', 'Linen Three Piece', 'Luxury Festive Set', 'Classic Party Set', 'Modern Grace Set'],
    'Salwar Kameez': ['Floral Salwar Kameez', 'Festive Salwar Kameez', 'Traditional Salwar Kameez', 'Premium Cotton Kameez', 'Printed Heritage Set', 'Designer Festive Kameez'],
    'Kurti': ['Daily Wear Kurti', 'Cotton Anarkali Kurti', 'Minimal Kurti', 'Layered Kurti', 'Soft Linen Kurti', 'Statement Kurti'],
    'Abaya': ['Modest Abaya Design', 'Premium Abaya', 'Flowy Abaya', 'Minimal Black Abaya', 'Luxury Abaya', 'Contour Abaya'],
    'Hijab': ['Everyday Hijab', 'Cotton Hijab Set', 'Luxury Hijab', 'Soft Knit Hijab', 'Elegant Printed Hijab', 'Modern Hijab Collection'],
    'Tops': ['Fashion Top', 'Classic Printed Top', 'Soft Knit Top', 'Silk Blend Top', 'Glossy Party Top', 'Trendy Everyday Top'],
    'Dresses': ['Elegant Evening Dress', 'Casual Dress', 'Party Dress', 'Summer Printed Dress', 'Formal Occasion Dress', 'Flowy Dress'],
    'Handbags': ['Luxury Handbag', 'Crossbody Handbag', 'Classic Tote', 'Evening Clutch', 'Signature Tote', 'Minimal Saddle Bag'],
    'Shoes': ['Heeled Sandals', 'Formal Flats', 'Fashion Sandals', 'Leather Heels', 'Classic Pumps', 'Elegant Loafers'],
    'Jewelry': ['Gold Tone Jewelry Set', 'Statement Earrings', 'Necklace Set', 'Pearl Jewelry Set', 'Crystal Charm Set', 'Luxury Bracelet Set'],
    'Fashion Accessories': ['Silk Scarf', 'Premium Sunglasses', 'Statement Belt', 'Fashion Watch', 'Hair Accessory', 'Accessorized Gift Set']
}
men = {
    'Panjabi': ['Premium Panjabi', 'Cotton Panjabi', 'Festive Panjabi', 'Classic Panjabi', 'Luxury Linen Panjabi', 'Formal Panjabi'],
    'Shirt': ['Formal Shirt', 'Slim Fit Shirt', 'Printed Shirt', 'Cotton Business Shirt', 'Premium Oxford Shirt', 'Smart Casual Shirt'],
    'T-Shirt': ['Classic T-Shirt', 'Cotton Tee', 'Urban Graphic Tee', 'Premium Crew Tee', 'Modern Essential Tee', 'Monochrome Tee'],
    'Polo Shirt': ['Polo Classic', 'Premium Polo', 'Color Block Polo', 'Smart Stretch Polo', 'Luxury Cotton Polo', 'Signature Polo'],
    'Jeans': ['Straight Fit Jeans', 'Slim Jeans', 'Dark Wash Jeans', 'Stretch Denim', 'Smart Casual Denim', 'Premium Denim'],
    'Trousers': ['Formal Trousers', 'Casual Chinos', 'Stretch Trousers', 'Tailored Slim Trousers', 'Smart Office Trousers', 'Classic Dress Trousers'],
    'Formal Wear': ['Business Suit', 'Formal Blazer', 'Dress Set', 'Executive Ensemble', 'Minimal Formal Look', 'Tailored Formal Wear'],
    'Casual Wear': ['Casual Jacket', 'Lightweight Jacket', 'Weekend Set', 'Smart Layered Look', 'Everyday Casual Set', 'Minimal Weekend Wear'],
    'Shoes': ['Leather Shoes', 'Sneakers', 'Casual Loafers', 'Formal Brogues', 'Street Sneakers', 'Premium Derby Shoes'],
    'Sandals': ['Summer Sandals', 'Comfort Sandals', 'Pool Sandals', 'Luxury Leather Sandals', 'Minimal Everyday Sandals', 'Casual Flip Sandals'],
    'Wallet': ['Premium Wallet', 'Minimal Wallet', 'Leather Wallet', 'Elegant Card Holder', 'Classic Billfold', 'Contemporary Wallet'],
    'Belt': ['Formal Belt', 'Leather Belt', 'Styled Belt', 'Dress Belt', 'Executive Belt', 'Smart Casual Belt'],
    'Watch': ['Classic Watch', 'Smart Watch', 'Luxury Watch', 'Minimalist Wristwatch', 'Sport Watch', 'Designer Watch'],
    'Sunglasses': ['Polarized Sunglasses', 'Designer Shades', 'Sport Sunglasses', 'Classic Frame Sunglasses', 'Modern Sunglasses', 'Trend Sunglasses']
}
kids = {
    'Kids Dresses': ['Party Dress', 'Princess Dress', 'Summer Dress', 'Festive Kids Gown', 'Classic Cotton Dress', 'Soft Layered Dress'],
    'Boys Clothing': ['Boys Polo Set', 'Casual Boys Set', 'Classic Boys Shirt', 'Formal Boys Outfit', 'Smart Boys Casual Set', 'Everyday Boys Set'],
    'Girls Clothing': ['Girls Dress', 'Girls Kurti Set', 'Girls Designer Top', 'Printed Girls Set', 'Trendy Girls Outfit', 'Sweet Girls Dress'],
    'Kids T-Shirts': ['Kids Graphic Tee', 'Cartoon Tee', 'Colorful Tee', 'Soft Cotton Kids Tee', 'Signature Kids Graphic Tee', 'Playful Tee'],
    'Kids Pants': ['Cotton Pants', 'Stretch Pants', 'Casual Kids Pants', 'Classic Denim Pants', 'Sporty Kids Pants', 'Soft Everyday Pants'],
    'Party Dresses': ['Festive Kids Gown', 'Party Frock', 'Birthday Dress', 'Mini Celebration Dress', 'Twirl Party Dress', 'Sweet Party Gown'],
    'Baby Clothing': ['Baby Onesie', 'Soft Cotton Set', 'Cute Baby Outfit', 'Baby Romper', 'Gentle Cotton Set', 'Minimal Baby Wear'],
    'Kids Shoes': ['Kids Sneakers', 'Girls Flats', 'Boys Sandals', 'Soft Kids Slippers', 'Playful Kids Shoes', 'Rainbow Sneakers'],
    'Kids Accessories': ['Kids Hat', 'Hair Clip Set', 'School Backpack', 'Mini Clutch', 'Cute Kids Cap', 'Charm Accessory Set']
}
accessories = {
    'Bags': ['Fashion Tote', 'Weekend Duffel', 'Mini Purse', 'Signature Backpack', 'Travel Handbag', 'Daily Shopper'],
    'Shoes': ['Designer Flats', 'Trend Sneakers', 'Luxury Heels', 'Modern Mules', 'Weekend Runner', 'Elegant Court Shoe'],
    'Jewelry': ['Crystal Earrings', 'Gold Accent Ring', 'Bracelet Set', 'Pearl Drop Set', 'Luxury Charm Necklace', 'Minimalist Jewelry'],
    'Watches': ['Classic Wrist Watch', 'Minimal Watch', 'Women Watch', 'Leather Strap Watch', 'Smart Casual Watch', 'Designer Timepiece'],
    'Fashion Accessories': ['Silk Scarf', 'Hair Accessory', 'Touch Screen Gloves', 'Statement Necklace', 'Premium Sunglasses', 'Classic Wallet'],
    'Beauty & Personal Care': ['Glow Kit', 'Skincare Kit', 'Perfume Set', 'Beauty Bundle', 'Essential Grooming Kit', 'Luxury Care Set']
}

categories = {'Women': women, 'Men': men, 'Kids': kids, 'Accessories': accessories}
products = []
idx = 1

for category, submap in categories.items():
    for sub, names in submap.items():
        for name in names:
            price = 990 + ((idx * 113) % 4400)
            old = price + 280 + ((idx * 97) % 1200)
            discount = max(8, min(42, round((old - price) / old * 100)))
            rating = round(4.1 + ((idx % 8) * 0.09), 1)
            reviews = 24 + idx * 11
            stock = 10 + idx % 40
            badge_pool = ['New', 'Trending', 'Best Seller', 'Sale', 'Featured']
            badge = badge_pool[(idx + len(sub)) % len(badge_pool)]
            colors = ['Black', 'White', 'Red', 'Navy', 'Beige', 'Pink', 'Gold', 'Blue']
            selected_colors = sorted(set(random.sample(colors, random.randint(2, 4))))
            sizes = ['S', 'M', 'L', 'XL'] if category in ['Women', 'Men'] else ['4-5Y', '6-7Y', '8-9Y', '10-12Y']
            if sub in ['Saree', 'Three Piece', 'Salwar Kameez', 'Kurti', 'Abaya', 'Hijab', 'Dresses', 'Tops', 'Handbags', 'Jewelry', 'Fashion Accessories', 'Kids Dresses', 'Party Dresses', 'Baby Clothing']:
                sizes = ['Free Size'] if random.random() < 0.5 else ['S', 'M', 'L', 'XL']
            products.append({
                'id': f'AFH{idx:03d}',
                'name': name,
                'category': category,
                'subcategory': sub,
                'price': price,
                'oldPrice': old,
                'discount': discount,
                'rating': rating,
                'reviews': reviews,
                'stock': stock,
                'badge': badge,
                'image': pick_image(idx, category, sub),
                'description': f'{name} is crafted for modern fashion lovers who appreciate premium comfort and everyday elegance.',
                'sizes': sizes,
                'colors': selected_colors,
            })
            idx += 1

for i in range(1, 30):
    category = list(categories.keys())[i % len(categories)]
    sub = list(categories[category].keys())[i % len(categories[category])]
    name = f'{category} Signature Collection {i}'
    products.append({
        'id': f'AFH{idx:03d}',
        'name': name,
        'category': category,
        'subcategory': sub,
        'price': 1200 + (i * 130),
        'oldPrice': 1500 + (i * 160),
        'discount': 15 + (i % 14),
        'rating': round(4.3 + (i % 6) * 0.1, 1),
        'reviews': 50 + i * 7,
        'stock': 8 + i * 2,
        'badge': ['New', 'Trending', 'Best Seller', 'Sale'][i % 4],
        'image': pick_image(idx, category, sub),
        'description': f'{name} adds a polished accent to your wardrobe with comfortable detailing and a confident finish.',
        'sizes': ['S', 'M', 'L', 'XL'],
        'colors': ['Black', 'White', 'Gold', 'Pink']
    })
    idx += 1

assert len(products) >= 150

(base / 'data').mkdir(exist_ok=True)
(base / 'data' / 'products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')
(base / 'data' / 'categories.json').write_text(json.dumps({
    'Women': ['Saree', 'Three Piece', 'Salwar Kameez', 'Kurti', 'Abaya', 'Hijab', 'Tops', 'Dresses', 'Handbags', 'Shoes', 'Jewelry', 'Fashion Accessories'],
    'Men': ['Panjabi', 'Shirt', 'T-Shirt', 'Polo Shirt', 'Jeans', 'Trousers', 'Formal Wear', 'Casual Wear', 'Shoes', 'Sandals', 'Wallet', 'Belt', 'Watch', 'Sunglasses'],
    'Kids': ['Kids Dresses', 'Boys Clothing', 'Girls Clothing', 'Kids T-Shirts', 'Kids Pants', 'Party Dresses', 'Baby Clothing', 'Kids Shoes', 'Kids Accessories'],
    'Accessories': ['Bags', 'Shoes', 'Jewelry', 'Watches', 'Fashion Accessories', 'Beauty & Personal Care']
}, ensure_ascii=False, indent=2), encoding='utf-8')
(base / 'data' / 'coupons.json').write_text(json.dumps({
    'WELCOME10': {'type': 'percent', 'value': 10, 'description': '10% off new customer orders'},
    'SAVE200': {'type': 'fixed', 'value': 200, 'description': '৳200 off'},
    'FIRSTORDER': {'type': 'fixed', 'value': 300, 'description': '৳300 off first order'}
}, ensure_ascii=False, indent=2), encoding='utf-8')
(base / 'data' / 'zones.json').write_text(json.dumps({'Dhaka City': 60, 'Outside Dhaka': 120, 'Remote Area': 150}, ensure_ascii=False, indent=2), encoding='utf-8')
(base / 'data' / 'reviews.json').write_text(json.dumps([
    {'name': 'Nusrat Jahan', 'rating': 5, 'review': 'Excellent quality and quick delivery. The fabric feels premium and the design is exactly as advertised.', 'date': '2026-08-18', 'product': 'Premium Women\'s Embroidered Saree', 'verified': True},
    {'name': 'Sadia Islam', 'rating': 5, 'review': 'Loved the outfit for my event. The tailoring is elegant and the packaging felt luxurious.', 'date': '2026-08-06', 'product': 'Elegant Three Piece Set', 'verified': True},
    {'name': 'Tanzim Rahman', 'rating': 4, 'review': 'Great fit and smooth ordering process. The Panjabi looks premium and the fabric quality is quite good.', 'date': '2026-07-24', 'product': 'Premium Panjabi', 'verified': True},
    {'name': 'Mariam Ahmed', 'rating': 5, 'review': 'Fast service and beautiful collection. The fashion edit was impressive and the prices are fair.', 'date': '2026-08-10', 'product': 'Luxury Abaya', 'verified': True},
    {'name': 'Ayan Hossain', 'rating': 4, 'review': 'I ordered kids wear and it arrived on time. The cuts and colors are lovely and the fabric feels soft.', 'date': '2026-08-02', 'product': 'Kids Graphic Tee', 'verified': True},
    {'name': 'Farhana Ali', 'rating': 5, 'review': 'The shopping experience was smooth and the dress quality exceeded my expectations. Highly recommended.', 'date': '2026-07-16', 'product': 'Floral Salwar Kameez', 'verified': True},
    {'name': 'Rafiul Karim', 'rating': 5, 'review': 'Very easy to order and the product matched the website photos. I will definitely shop again.', 'date': '2026-08-21', 'product': 'Premium Oxford Shirt', 'verified': True},
    {'name': 'Shamima Akter', 'rating': 4, 'review': 'Beautiful packaging and nice customer support. The accessories look very classy.', 'date': '2026-08-14', 'product': 'Signature Backpack', 'verified': True}
], ensure_ascii=False, indent=2), encoding='utf-8')

print(f'Generated {len(products)} products')
