# 📸 Image Structure Guide

## 📁 **Folder Organization**

```
public/images/
├── mens/                 # Men's clothing product images
├── womens/               # Women's clothing product images  
├── banners/              # Hero banners and promotional images
├── logos/                # Site logos and branding
├── categories/           # Category showcase images
├── placeholders/         # Fallback and placeholder images
└── README.md            # This guide
```

## 🖼️ **Image Requirements**

### **Product Images**
- **Format**: JPG or PNG
- **Size**: 800x800px (square aspect ratio)
- **Quality**: High resolution for zoom functionality
- **Naming**: descriptive-product-name-color.jpg

### **Banner Images**
- **Format**: JPG
- **Size**: 1920x800px (landscape)
- **Quality**: Web-optimized
- **Naming**: purpose-description.jpg

### **Logo Images**
- **Format**: PNG (with transparency)
- **Size**: 200x60px (flexible)
- **Naming**: logo-variant.png

## 📋 **Required Images for Current Products**

### **Men's Clothing** (place in `/mens/`)
1. `oxford-shirt-white.jpg` - Classic Oxford Shirt (White)
2. `oxford-shirt-blue.jpg` - Classic Oxford Shirt (Blue) 
3. `chinos-khaki.jpg` - Premium Chinos (Khaki)
4. `blazer-charcoal.jpg` - Modern Blazer (Charcoal)
5. `sneakers-white.jpg` - Casual Sneakers (White)
6. `sweater-grey.jpg` - Wool Sweater (Grey)

### **Women's Clothing** (place in `/womens/`)
1. `midi-dress-black.jpg` - Elegant Midi Dress (Black)
2. `silk-blouse-ivory.jpg` - Silk Blouse (Ivory)
3. `trousers-black.jpg` - High-Waist Trousers (Black)
4. `cardigan-camel.jpg` - Cashmere Cardigan (Camel)
5. `pumps-black.jpg` - Classic Pumps (Black)
6. `floral-dress-blue.jpg` - Floral Summer Dress (Blue)

### **Banner Images** (place in `/banners/`)
1. `hero-main.jpg` - Main homepage hero banner
2. `mens-collection.jpg` - Men's category banner
3. `womens-collection.jpg` - Women's category banner
4. `sale-banner.jpg` - Promotional sale banner

### **Logo Images** (place in `/logos/`)
1. `logo.png` - Main logo (dark version)
2. `logo-white.png` - White logo for dark backgrounds
3. `favicon.ico` - Browser favicon

### **Category Images** (place in `/categories/`)
1. `mens-showcase.jpg` - Men's category showcase
2. `womens-showcase.jpg` - Women's category showcase
3. `accessories-showcase.jpg` - Accessories showcase

## 🔗 **How Images Are Referenced**

Images are served from: `http://localhost:3000/images/[folder]/[filename]`

Examples:
- `http://localhost:3000/images/mens/oxford-shirt-white.jpg`
- `http://localhost:3000/images/womens/midi-dress-black.jpg`
- `http://localhost:3000/images/banners/hero-main.jpg`

## ✅ **After Adding Images**

1. **Restart the server** if needed
2. **Test image loading** by visiting the URLs directly
3. **Check product pages** to ensure images display correctly
4. **Verify responsive behavior** on different screen sizes

## 🚫 **Important Notes**

- Keep file sizes under 500KB for web performance
- Use descriptive, URL-friendly filenames (lowercase, hyphens)
- Always include alt text for accessibility
- Consider WebP format for better compression
- Add multiple product angles when possible

## 🔧 **Troubleshooting**

If images don't load:
1. Check file path spelling and case sensitivity
2. Ensure images are in the correct folder
3. Verify file permissions
4. Check browser console for 404 errors
5. Clear browser cache

---

**Ready to import your images!** 🎉
