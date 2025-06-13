#!/bin/bash

# Image Placeholder Generator
# Creates placeholder images for development

echo "🎨 Creating placeholder images for development..."

# Create a simple SVG placeholder that can be used
cat > public/images/placeholder.svg << 'EOF'
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <rect x="200" y="300" width="400" height="200" fill="#d1d5db" rx="10"/>
  <text x="400" y="390" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle">Product Image</text>
  <text x="400" y="420" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle">800x800</text>
</svg>
EOF

echo "✅ Created placeholder.svg"

# Create a simple text file with image sources suggestions
cat > public/images/IMAGE_SOURCES.md << 'EOF'
# 📸 Suggested Image Sources

## **Free Stock Photos**
- **Unsplash** (unsplash.com) - High quality, free commercial use
- **Pexels** (pexels.com) - Free stock photos
- **Pixabay** (pixabay.com) - Free images and vectors

## **Search Terms for Clothing**

### Men's Clothing:
- "white oxford shirt flat lay"
- "navy business shirt"
- "khaki chinos pants"
- "charcoal gray blazer"
- "white leather sneakers"
- "grey wool sweater"

### Women's Clothing:
- "black midi dress fashion"
- "ivory silk blouse"
- "black high waist trousers"
- "camel cashmere cardigan"
- "black leather pumps"
- "blue floral summer dress"

## **Tips for Good Product Photos**
1. Use flat lay or model photography
2. Consistent lighting and background
3. Multiple angles when possible
4. High resolution (at least 800x800px)
5. Professional styling
6. Clean, minimal backgrounds

## **AI Image Generation**
- **Midjourney** - High quality AI fashion photography
- **DALL-E** - OpenAI's image generator
- **Stable Diffusion** - Open source AI image generation

### Example AI Prompts:
- "professional product photography of white oxford shirt, flat lay, clean background"
- "elegant black midi dress on model, studio lighting, fashion photography"
- "khaki chinos pants product shot, minimal background"
EOF

echo "✅ Created IMAGE_SOURCES.md with tips"
echo "🎉 Image structure setup complete!"
echo ""
echo "📁 Folder structure created:"
echo "   public/images/mens/ "
echo "   public/images/womens/"
echo "   public/images/banners/"
echo "   public/images/logos/"
echo "   public/images/categories/"
echo "   public/images/placeholders/"
echo ""
echo "📋 Next steps:"
echo "   1. Add your images to the appropriate folders"
echo "   2. Check IMPORT_CHECKLIST.md for required images"
echo "   3. See IMAGE_SOURCES.md for image sourcing tips"
echo "   4. Restart the dev server after adding images"
