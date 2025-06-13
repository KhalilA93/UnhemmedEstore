const mockProducts = [  // Men's Clothing (6 products)
  {
    name: "Men's Button-Up Shirt",
    description: "A versatile long-sleeve shirt made with premium fabric and tailored for a sharp, structured fit. Perfect for workdays or weekend plans.",
    shortDescription: "Versatile long-sleeve shirt with structured fit",
    price: 85.00,
    comparePrice: 105.00,
    category: "Men",
    subcategory: "Shirts",
    brand: "Executive Style",
    sku: "ES-WDS-001",
    images: [
      {
        url: "/images/mens/StockSnap_AIOTY3A4AE.jpg",
        alt: "Classic white dress shirt with French cuffs",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", quantity: 15 },
      { size: "M", quantity: 20 },
      { size: "L", quantity: 18 },
      { size: "XL", quantity: 12 }
    ],
    colors: [
      { name: "White", hex: "#FFFFFF", quantity: 45 },
      { name: "Light Blue", hex: "#E6F3FF", quantity: 20 }
    ],
    inventory: {
      quantity: 65,
      lowStockThreshold: 10,
      trackQuantity: true
    },    features: ["Premium Fabric", "Structured Fit", "Long Sleeve", "Versatile Style"],
    tags: ["shirt", "button-up", "versatile", "premium", "structured"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.7,
      count: 156
    }
  },  {
    name: "Men's Casual Pants",
    description: "Designed with comfort and style in mind, these casual pants feature a relaxed fit with modern detailing. Ideal for everyday wear.",
    shortDescription: "Comfortable casual pants with relaxed fit",
    price: 72.00,
    comparePrice: 92.00,    category: "Men",
    subcategory: "Pants",
    brand: "CasualComfort",
    sku: "CC-BUS-002",
    images: [
      {
        url: "/images/mens/StockSnap_FHQXYGYJJJ.jpg",
        alt: "Men's casual pants",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", quantity: 12 },
      { size: "M", quantity: 18 },
      { size: "L", quantity: 16 },
      { size: "XL", quantity: 14 }
    ],
    colors: [
      { name: "Sky Blue", hex: "#87CEEB", quantity: 35 },
      { name: "Navy", hex: "#1E3A8A", quantity: 25 }
    ],
    inventory: {
      quantity: 60,
      lowStockThreshold: 8,
      trackQuantity: true
    },    features: ["Relaxed Fit", "Modern Detailing", "Comfortable Fabric", "Everyday Wear"],
    tags: ["pants", "casual", "comfortable", "relaxed", "everyday"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.4,
      count: 89
    }
  },  {
    name: "Men's Activewear Set",
    description: "This breathable and flexible activewear set supports movement without sacrificing comfort—great for workouts or lounging.",
    shortDescription: "Breathable activewear set for workouts",
    price: 60.00,
    comparePrice: 80.00,    category: "Men",
    subcategory: "Sets",
    brand: "DenimCraft",
    sku: "DC-DDJ-003",
    images: [
      {
        url: "/images/mens/StockSnap_GPPKPJ32EE.jpg",
        alt: "Men's activewear set",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "30", quantity: 8 },
      { size: "32", quantity: 15 },
      { size: "34", quantity: 12 },
      { size: "36", quantity: 10 }
    ],
    colors: [
      { name: "Dark Blue", hex: "#1E40AF", quantity: 30 },
      { name: "Black", hex: "#000000", quantity: 15 }
    ],
    inventory: {
      quantity: 45,
      lowStockThreshold: 5,
      trackQuantity: true
    },    features: ["Breathable Fabric", "Flexible Material", "Movement Support", "Comfort Fit"],
    tags: ["activewear", "set", "breathable", "flexible", "workout"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.6,
      count: 134
    }
  },  {
    name: "Men's Polo Shirt",
    description: "A classic short-sleeve polo shirt with a clean design, soft material, and a tailored silhouette. Easy to dress up or down.",
    shortDescription: "Classic polo shirt with tailored silhouette",
    price: 48.00,
    comparePrice: 68.00,    category: "Men",
    subcategory: "Shirts",
    brand: "LeatherLux",
    sku: "LL-BLJ-004",
    images: [
      {
        url: "/images/mens/StockSnap_PBZVOATJFO.jpg",
        alt: "Men's polo shirt",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "M", quantity: 5 },
      { size: "L", quantity: 8 },
      { size: "XL", quantity: 6 }
    ],
    colors: [
      { name: "Black", hex: "#000000", quantity: 15 },
      { name: "Brown", hex: "#8B4513", quantity: 4 }
    ],
    inventory: {
      quantity: 19,
      lowStockThreshold: 3,
      trackQuantity: true
    },    features: ["Clean Design", "Soft Material", "Tailored Silhouette", "Versatile Styling"],
    tags: ["polo", "shirt", "classic", "soft", "tailored"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.8,
      count: 67
    }
  },  {
    name: "Men's Active Top",
    description: "Lightweight and moisture-wicking, this active top keeps you cool and comfortable during any activity.",
    shortDescription: "Lightweight moisture-wicking active top",
    price: 42.00,
    comparePrice: 62.00,    category: "Men",
    subcategory: "Shirts",
    brand: "UrbanStep",
    sku: "US-WLS-005",
    images: [
      {
        url: "/images/mens/StockSnap_XLGET53CAN.jpg",
        alt: "Men's active top",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "8", quantity: 6 },
      { size: "9", quantity: 10 },
      { size: "10", quantity: 12 },
      { size: "11", quantity: 8 }
    ],
    colors: [
      { name: "White", hex: "#FFFFFF", quantity: 25 },
      { name: "Off-White", hex: "#F8F8FF", quantity: 11 }
    ],
    inventory: {
      quantity: 36,
      lowStockThreshold: 8,
      trackQuantity: true
    },    features: ["Lightweight Fabric", "Moisture-Wicking", "Comfortable Fit", "Activity Ready"],
    tags: ["active", "top", "lightweight", "moisture-wicking", "activity"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.5,
      count: 123
    }
  },  {
    name: "Men's Sunglasses",
    description: "Modern and durable sunglasses with full UV protection and a sleek design that complements any face shape.",
    shortDescription: "Modern sunglasses with UV protection",
    price: 110.00,
    comparePrice: 130.00,
    category: "Men",
    subcategory: "Accessories",
    brand: "Executive Style",
    sku: "ES-NBB-006",    images: [
      {
        url: "/images/mens/StockSnap_YLD3KP3CMU.jpg",
        alt: "Men's sunglasses",
        isPrimary: true
      }
    ],    sizes: [
      { size: "One Size", quantity: 37 }
    ],
    colors: [
      { name: "Black", hex: "#000000", quantity: 25 },
      { name: "Dark Brown", hex: "#654321", quantity: 12 }
    ],
    inventory: {
      quantity: 37,
      lowStockThreshold: 5,
      trackQuantity: true
    },    features: ["UV Protection", "Durable Construction", "Sleek Design", "Universal Fit"],
    tags: ["sunglasses", "UV protection", "modern", "durable", "sleek"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.7,
      count: 89
    }
  },

  // Women's Clothing (6 products)
  {
    name: "White Summer Dress",
    description: "Elegant white summer dress with delicate details and flowing silhouette. Perfect for garden parties, brunches, and summer events. Features comfortable fabric and flattering cut.",
    shortDescription: "Elegant white summer dress",
    price: 79.99,
    comparePrice: 99.99,
    category: "Women",
    subcategory: "Dresses",
    brand: "SummerElegance",
    sku: "SE-WSD-007",
    images: [
      {
        url: "/images/womens/StockSnap_JA2NGUEHYA.jpg",
        alt: "White summer dress",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", quantity: 8 },
      { size: "S", quantity: 15 },
      { size: "M", quantity: 18 },
      { size: "L", quantity: 12 }
    ],
    colors: [
      { name: "White", hex: "#FFFFFF", quantity: 35 },
      { name: "Cream", hex: "#F5F5DC", quantity: 18 }
    ],
    inventory: {
      quantity: 53,
      lowStockThreshold: 10,
      trackQuantity: true
    },
    features: ["Flowing Silhouette", "Delicate Details", "Summer Weight Fabric", "Flattering Cut"],
    tags: ["dress", "white", "summer", "elegant", "flowing"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.8,
      count: 167
    }
  },
  {
    name: "Black Turtleneck Sweater",
    description: "Classic black turtleneck sweater with ribbed texture and comfortable fit. Perfect for layering or wearing alone. Made from soft, high-quality knit fabric.",
    shortDescription: "Classic black ribbed turtleneck",
    price: 69.99,
    comparePrice: 89.99,
    category: "Women",
    subcategory: "Shirts",
    brand: "KnitClassics",
    sku: "KC-BTS-008",
    images: [
      {
        url: "/images/womens/StockSnap_ODNPHGUMP7.jpg",
        alt: "Black turtleneck sweater",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", quantity: 14 },
      { size: "M", quantity: 18 },
      { size: "L", quantity: 16 },
      { size: "XL", quantity: 8 }
    ],
    colors: [
      { name: "Black", hex: "#000000", quantity: 30 },
      { name: "Gray", hex: "#808080", quantity: 16 },
      { name: "Cream", hex: "#F5F5DC", quantity: 10 }
    ],
    inventory: {
      quantity: 56,
      lowStockThreshold: 8,
      trackQuantity: true
    },
    features: ["Ribbed Texture", "Turtleneck Design", "Soft Knit Fabric", "Versatile Styling"],
    tags: ["turtleneck", "black", "sweater", "ribbed", "classic"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.6,
      count: 145
    }
  },
  {
    name: "High-Waisted Blue Jeans",
    description: "Vintage-inspired high-waisted jeans in classic blue denim. Features a flattering fit that accentuates the waist and elongates the legs. Perfect for casual and dressed-up looks.",
    shortDescription: "High-waisted vintage-style blue jeans",
    price: 84.99,
    comparePrice: 109.99,
    category: "Women",
    subcategory: "Pants",
    brand: "VintageDenim",
    sku: "VD-HWJ-009",
    images: [
      {
        url: "/images/womens/StockSnap_ZBTVTYXJPM.jpg",
        alt: "High-waisted blue jeans",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "26", quantity: 10 },
      { size: "28", quantity: 16 },
      { size: "30", quantity: 14 },
      { size: "32", quantity: 12 }
    ],
    colors: [
      { name: "Classic Blue", hex: "#4682B4", quantity: 32 },
      { name: "Dark Blue", hex: "#1E40AF", quantity: 20 }
    ],
    inventory: {
      quantity: 52,
      lowStockThreshold: 10,
      trackQuantity: true
    },
    features: ["High-Waisted", "Vintage-Inspired", "Flattering Fit", "Classic Denim"],
    tags: ["jeans", "high-waisted", "vintage", "blue", "denim"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.7,
      count: 189
    }
  },
  {
    name: "Beige Tailored Blazer",
    description: "Sophisticated beige blazer with clean lines and structured silhouette. Perfect for professional settings and business meetings. Features premium fabric and expert tailoring.",
    shortDescription: "Professional beige tailored blazer",
    price: 149.99,
    comparePrice: 199.99,
    category: "Women",
    subcategory: "Jackets",
    brand: "ProfessionalStyle",
    sku: "PS-BTB-010",
    images: [
      {
        url: "/images/womens/calm-serious-woman-light-brown-stylish-cashmere-suit-cap-looks-into-camera-brunette-longhaired-girl-eyeglasses-poses-isolated-beige-background.jpg",
        alt: "Beige tailored blazer",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", quantity: 6 },
      { size: "S", quantity: 12 },
      { size: "M", quantity: 14 },
      { size: "L", quantity: 8 }
    ],
    colors: [
      { name: "Beige", hex: "#F5F5DC", quantity: 25 },
      { name: "Camel", hex: "#C19A6B", quantity: 15 }
    ],
    inventory: {
      quantity: 40,
      lowStockThreshold: 6,
      trackQuantity: true
    },
    features: ["Structured Silhouette", "Clean Lines", "Premium Fabric", "Professional Cut"],
    tags: ["blazer", "beige", "professional", "tailored", "business"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.8,
      count: 98
    }
  },
  {
    name: "Blue Knit Sweater",
    description: "Cozy blue knit sweater with relaxed fit and soft texture. Perfect for casual days and layering. Features comfortable fabric that's both warm and breathable.",
    shortDescription: "Cozy blue knit sweater",
    price: 59.99,
    comparePrice: 79.99,
    category: "Women",
    subcategory: "Shirts",
    brand: "CozyKnits",
    sku: "CK-BKS-011",
    images: [
      {
        url: "/images/womens/glamour-stylish-beautiful-young-woman-model-with-red-lips-blue-sweater-hipster-cloth-beanie.jpg",
        alt: "Blue knit sweater",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", quantity: 8 },
      { size: "S", quantity: 14 },
      { size: "M", quantity: 16 },
      { size: "L", quantity: 12 }
    ],
    colors: [
      { name: "Sky Blue", hex: "#87CEEB", quantity: 30 },
      { name: "Navy Blue", hex: "#1E3A8A", quantity: 20 }
    ],
    inventory: {
      quantity: 50,
      lowStockThreshold: 8,
      trackQuantity: true
    },
    features: ["Soft Knit Texture", "Relaxed Fit", "Comfortable Fabric", "Versatile Styling"],
    tags: ["sweater", "blue", "knit", "cozy", "casual"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.5,
      count: 134
    }
  },
  {
    name: "Casual Summer Outfit Set",
    description: "Complete casual summer outfit featuring comfortable top and coordinating accessories. Perfect for weekend outings, festivals, and relaxed social gatherings.",
    shortDescription: "Complete casual summer outfit",
    price: 94.99,
    comparePrice: 124.99,
    category: "Women",
    subcategory: "Sets",
    brand: "SummerStyle",
    sku: "SS-CSO-012",
    images: [
      {
        url: "/images/womens/portrait-young-stylish-girl-model-casual-summer-clothes-brown-hat-with-natural-makeup-glasses-isolated.jpg",
        alt: "Casual summer outfit with hat",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", quantity: 8 },
      { size: "S", quantity: 12 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 10 }
    ],
    colors: [
      { name: "Natural Tones", hex: "#DEB887", quantity: 25 },
      { name: "Earth Tones", hex: "#8FBC8F", quantity: 20 }
    ],
    inventory: {
      quantity: 45,
      lowStockThreshold: 8,
      trackQuantity: true
    },
    features: ["Complete Outfit", "Summer Weight", "Coordinated Pieces", "Comfortable Fit"],
    tags: ["outfit set", "summer", "casual", "coordinated", "festival"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.7,
      count: 156
    }
  }
];

module.exports = mockProducts;
