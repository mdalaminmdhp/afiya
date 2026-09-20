# AFIYA FASHION HOUSE

A premium fashion e-commerce storefront for AFIYA FASHION HOUSE.

## Run locally

```bash
npm start
```

Then open http://localhost:3000

## Project structure

- `index.html` - home page
- `shop.html` - product catalog and filtering
- `product.html` - single product details page
- `checkout.html` - cart and checkout
- `wishlist.html` - saved products
- `track-order.html` - order tracking mock flow
- `about.html` - company story
- `contact.html` - contact page
- `css/` - stylesheets
- `js/` - storefront logic
- `data/` - product and configuration files
- `admin/` - admin dashboard shell

## Add new products

Edit `data/products.json` and append a new object in the same structure used by the existing entries.

Required fields:

- `id`
- `name`
- `category`
- `subcategory`
- `price`
- `oldPrice`
- `discount`
- `rating`
- `reviews`
- `stock`
- `badge`
- `image`
- `description`
- `sizes`
- `colors`

## Update delivery charges

Edit `data/zones.json`.

```json
{
  "Dhaka City": 60,
  "Outside Dhaka": 120,
  "Remote Area": 150
}
```

## Configure social links

Update the values in `.env.example` or change the social link config in the JS if you are keeping everything client-side.

## Payment integration

This storefront includes a safe mock payment flow and clearly separated placeholders for bKash, Nagad, and SSLCommerz backend integration. Add real credentials to your server environment and secure backend endpoints before going live.

## Brand details

- Business Name: AFIYA FASHION HOUSE
- Phone: 01701585007
- WhatsApp: 01701585007
- WhatsApp URL: https://wa.me/8801701585007
"""