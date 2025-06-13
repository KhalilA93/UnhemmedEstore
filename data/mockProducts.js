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
    name: "Women's Casual Sweater",
    description: "A soft-knit sweater with a relaxed fit and modern cut. Perfect for layering in cooler weather or wearing solo on breezy days.",
    shortDescription: "Soft-knit sweater with relaxed fit",
    price: 68.00,
    comparePrice: 88.00,    category: "Women",
    subcategory: "Shirts",
    brand: "SummerElegance",
    sku: "SE-WSD-007",    images: [
      {
        url: "/images/womens/calm-serious-woman-light-brown-stylish-cashmere-suit-cap-looks-into-camera-brunette-longhaired-girl-eyeglasses-poses-isolated-beige-background.jpg",
        alt: "Women's casual sweater",
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
    },    features: ["Soft Knit Fabric", "Relaxed Fit", "Modern Cut", "Layering Versatile"],
    tags: ["sweater", "casual", "soft", "relaxed", "layering"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.8,
      count: 167
    }
  },  {
    name: "Women's Sweater & Hat Set",
    description: "Cozy meets chic in this cold-weather duo, featuring a coordinated knit sweater and winter hat made for both warmth and style.",
    shortDescription: "Coordinated knit sweater and winter hat set",
    price: 95.00,
    comparePrice: 115.00,    category: "Women",
    subcategory: "Sets",
    brand: "KnitClassics",
    sku: "KC-BTS-008",    images: [
      {
        url: "/images/womens/glamour-stylish-beautiful-young-woman-model-with-red-lips-blue-sweater-hipster-cloth-beanie.jpg",
        alt: "Women's sweater and hat set",
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
    },    features: ["Coordinated Set", "Knit Construction", "Winter Ready", "Warmth & Style"],
    tags: ["sweater", "hat", "set", "coordinated", "winter"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.6,
      count: 145
    }
  },  {
    name: "Women's Eyeglasses",
    description: "Stylish, lightweight frames built for comfort and daily wear. A timeless look to match both casual and formal outfits.",
    shortDescription: "Stylish lightweight frames for daily wear",
    price: 120.00,
    comparePrice: 140.00,    category: "Women",
    subcategory: "Accessories",
    brand: "VintageDenim",
    sku: "VD-HWJ-009",    images: [
      {
        url: "/images/womens/portrait-young-stylish-girl-model-casual-summer-clothes-brown-hat-with-natural-makeup-glasses-isolated.jpg",
        alt: "Women's eyeglasses",
        isPrimary: true
      }
    ],sizes: [
      { size: "One Size", quantity: 52 }
    ],
    colors: [
      { name: "Classic Blue", hex: "#4682B4", quantity: 32 },
      { name: "Dark Blue", hex: "#1E40AF", quantity: 20 }
    ],
    inventory: {
      quantity: 52,
      lowStockThreshold: 10,
      trackQuantity: true
    },    features: ["Lightweight Frames", "Daily Comfort", "Timeless Design", "Versatile Style"],
    tags: ["eyeglasses", "frames", "lightweight", "timeless", "comfort"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.7,
      count: 189
    }
  },  {
    name: "Women's Wide-Brim Sunhat",
    description: "A breathable, structured sunhat with a wide brim for full sun coverage. A fashionable way to stay cool and shaded.",
    shortDescription: "Breathable wide-brim sunhat for sun protection",
    price: 52.00,
    comparePrice: 72.00,    category: "Women",
    subcategory: "Accessories",
    brand: "ProfessionalStyle",
    sku: "PS-BTB-010",    images: [
      {
        url: "/images/womens/StockSnap_JA2NGUEHYA.jpg",
        alt: "Women's wide-brim sunhat",
        isPrimary: true
      }
    ],sizes: [
      { size: "One Size", quantity: 40 }
    ],
    colors: [
      { name: "Beige", hex: "#F5F5DC", quantity: 25 },
      { name: "Camel", hex: "#C19A6B", quantity: 15 }
    ],
    inventory: {
      quantity: 40,
      lowStockThreshold: 6,
      trackQuantity: true
    },    features: ["Wide Brim", "Sun Protection", "Breathable Material", "Structured Design"],
    tags: ["sunhat", "wide-brim", "sun protection", "breathable", "fashionable"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.8,
      count: 98
    }
  },  {
    name: "Women's Fashion Hat",
    description: "This structured fashion hat adds a bold finish to any outfit. Made with durable material and a timeless silhouette.",
    shortDescription: "Structured fashion hat with timeless silhouette",
    price: 65.00,
    comparePrice: 85.00,    category: "Women",
    subcategory: "Accessories",
    brand: "CozyKnits",
    sku: "CK-BKS-011",    images: [
      {
        url: "/images/womens/StockSnap_ODNPHGUMP7.jpg",
        alt: "Women's fashion hat",
        isPrimary: true
      }
    ],sizes: [
      { size: "One Size", quantity: 50 }
    ],
    colors: [
      { name: "Sky Blue", hex: "#87CEEB", quantity: 30 },
      { name: "Navy Blue", hex: "#1E3A8A", quantity: 20 }
    ],
    inventory: {
      quantity: 50,
      lowStockThreshold: 8,
      trackQuantity: true
    },    features: ["Structured Design", "Durable Material", "Timeless Silhouette", "Bold Finishing"],
    tags: ["fashion hat", "structured", "bold", "timeless", "durable"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.5,
      count: 134
    }
  },  {
    name: "Women's Jean Shorts",
    description: "Classic-cut denim shorts with just the right amount of stretch for all-day comfort and effortless casual style.",
    shortDescription: "Classic-cut denim shorts with stretch",
    price: 58.00,
    comparePrice: 78.00,    category: "Women",
    subcategory: "Pants",
    brand: "SummerStyle",
    sku: "SS-CSO-012",    images: [
      {
        url: "/images/womens/StockSnap_ZBTVTYXJPM.jpg",
        alt: "Women's jean shorts",
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
    },    features: ["Classic Cut", "Stretch Fabric", "All-Day Comfort", "Casual Style"],
    tags: ["jean shorts", "denim", "classic", "stretch", "casual"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.7,
      count: 156
    }
  }
];

module.exports = mockProducts;
