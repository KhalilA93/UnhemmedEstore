const mockProducts = [
  // Men's Clothing (6 products)
  {
    name: "Classic Cotton T-Shirt",
    description: "A comfortable and versatile cotton t-shirt perfect for everyday wear. Made from 100% premium cotton with a relaxed fit.",
    shortDescription: "Classic cotton tee with comfortable fit",
    price: 24.99,
    comparePrice: 34.99,
    category: "Men",
    subcategory: "Shirts",
    brand: "Urban Essentials",
    sku: "UE-CT-001",    images: [
      {
        url: "/images/mens/oxford-shirt-white.jpg",
        alt: "Classic Oxford Shirt - White",
        isPrimary: true
      },
      {
        url: "/images/mens/oxford-shirt-blue.jpg", 
        alt: "Classic Oxford Shirt - Blue",
        isPrimary: false
      }
    ],
    sizes: [
      { size: "S", quantity: 15 },
      { size: "M", quantity: 20 },
      { size: "L", quantity: 18 },
      { size: "XL", quantity: 12 }
    ],
    colors: [
      { name: "White", hex: "#FFFFFF", quantity: 25 },
      { name: "Black", hex: "#000000", quantity: 20 },
      { name: "Navy", hex: "#1E3A8A", quantity: 20 }
    ],
    inventory: {
      quantity: 65,
      lowStockThreshold: 10,
      trackQuantity: true
    },
    features: ["100% Cotton", "Machine Washable", "Comfortable Fit"],
    tags: ["casual", "basic", "everyday", "cotton"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.5,
      count: 128
    }
  },
  {
    name: "Slim Fit Jeans",
    description: "Premium denim jeans with a modern slim fit. Features stretch fabric for comfort and durability.",
    shortDescription: "Comfortable slim fit denim jeans",
    price: 79.99,
    comparePrice: 99.99,
    category: "Men",
    subcategory: "Pants",
    brand: "DenimCraft",
    sku: "DC-SJ-002",
    images: [
      {
        url: "/images/mens/chinos-khaki.jpg",
        alt: "Blue slim fit jeans",
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
    },
    features: ["Stretch Denim", "Slim Fit", "Five Pocket Design"],
    tags: ["jeans", "denim", "slim", "casual"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.2,
      count: 87
    }
  },
  {
    name: "Leather Jacket",
    description: "Genuine leather jacket with classic biker styling. Features multiple pockets and a comfortable lining.",
    shortDescription: "Genuine leather biker jacket",
    price: 199.99,
    comparePrice: 249.99,
    category: "Men",
    subcategory: "Jackets",
    brand: "LeatherLux",
    sku: "LL-LJ-003",
    images: [
      {
        url: "/images/mens/blazer-charcoal.jpg",
        alt: "Black leather jacket",
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
    },
    features: ["Genuine Leather", "Multiple Pockets", "Comfortable Lining"],
    tags: ["leather", "jacket", "biker", "premium"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.7,
      count: 43
    }
  },
  {
    name: "Casual Sneakers",
    description: "Comfortable casual sneakers perfect for everyday wear. Features cushioned sole and breathable materials.",
    shortDescription: "Comfortable casual sneakers",
    price: 89.99,
    comparePrice: 109.99,
    category: "Men",
    subcategory: "Shoes",
    brand: "ComfortStep",
    sku: "CS-CS-004",
    images: [
      {
        url: "/images/mens/sneakers-white.jpg",
        alt: "White casual sneakers",
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
      { name: "White", hex: "#FFFFFF", quantity: 20 },
      { name: "Black", hex: "#000000", quantity: 16 }
    ],
    inventory: {
      quantity: 36,
      lowStockThreshold: 8,
      trackQuantity: true
    },
    features: ["Cushioned Sole", "Breathable Materials", "Casual Style"],
    tags: ["sneakers", "casual", "comfortable", "shoes"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.3,
      count: 92
    }
  },
  {
    name: "Formal Dress Shirt",
    description: "Crisp cotton dress shirt perfect for business and formal occasions. Features French cuffs and spread collar.",
    shortDescription: "Premium cotton dress shirt",
    price: 64.99,
    comparePrice: 84.99,
    category: "Men",
    subcategory: "Shirts",
    brand: "Executive Style",
    sku: "ES-DS-005",
    images: [
      {
        url: "/images/mens/sweater-grey.jpg",
        alt: "White dress shirt",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "M", quantity: 12 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 }
    ],
    colors: [
      { name: "White", hex: "#FFFFFF", quantity: 25 },
      { name: "Light Blue", hex: "#ADD8E6", quantity: 12 }
    ],
    inventory: {
      quantity: 37,
      lowStockThreshold: 5,
      trackQuantity: true
    },
    features: ["100% Cotton", "French Cuffs", "Spread Collar"],
    tags: ["dress shirt", "formal", "business", "cotton"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.4,
      count: 67
    }
  },
  {
    name: "Classic Watch",
    description: "Elegant stainless steel watch with leather strap. Features water resistance and precise quartz movement.",
    shortDescription: "Stainless steel dress watch",
    price: 149.99,
    comparePrice: 199.99,
    category: "Men",
    subcategory: "Accessories",
    brand: "TimeClassic",
    sku: "TC-CW-006",
    images: [
      {
        url: "/images/mens/watch-silver.jpg",
        alt: "Silver classic watch",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "M", quantity: 20 }
    ],
    colors: [
      { name: "Silver", hex: "#C0C0C0", quantity: 15 },
      { name: "Gold", hex: "#FFD700", quantity: 8 }
    ],
    inventory: {
      quantity: 23,
      lowStockThreshold: 5,
      trackQuantity: true
    },
    features: ["Water Resistant", "Quartz Movement", "Leather Strap"],
    tags: ["watch", "accessory", "classic", "formal"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.6,
      count: 34
    }
  },

  // Women's Clothing (6 products)
  {
    name: "Floral Summer Dress",
    description: "Beautiful floral print dress perfect for summer occasions. Features flowing fabric and comfortable fit.",
    shortDescription: "Elegant floral print summer dress",
    price: 59.99,
    comparePrice: 79.99,
    category: "Women",
    subcategory: "Dresses",
    brand: "FloralFashion",
    sku: "FF-SD-007",
    images: [
      {
        url: "/images/womens/midi-dress-black.jpg",
        alt: "Floral summer dress",
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
      { name: "Blue Floral", hex: "#4169E1", quantity: 30 },
      { name: "Pink Floral", hex: "#FF69B4", quantity: 23 }
    ],
    inventory: {
      quantity: 53,
      lowStockThreshold: 10,
      trackQuantity: true
    },
    features: ["Floral Print", "Flowing Fabric", "Comfortable Fit"],
    tags: ["dress", "floral", "summer", "elegant"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.8,
      count: 156
    }
  },
  {
    name: "Silk Blouse",
    description: "Luxurious silk blouse with elegant draping. Perfect for professional and formal occasions.",
    shortDescription: "Premium silk blouse",
    price: 94.99,
    comparePrice: 124.99,
    category: "Women",
    subcategory: "Shirts",
    brand: "SilkElegance",
    sku: "SE-SB-008",
    images: [
      {
        url: "/images/womens/silk-blouse-ivory.jpg",
        alt: "Cream silk blouse",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 14 },
      { size: "L", quantity: 12 }
    ],
    colors: [
      { name: "Cream", hex: "#F5F5DC", quantity: 20 },
      { name: "Black", hex: "#000000", quantity: 16 }
    ],
    inventory: {
      quantity: 36,
      lowStockThreshold: 8,
      trackQuantity: true
    },
    features: ["100% Silk", "Elegant Draping", "Professional Style"],
    tags: ["blouse", "silk", "professional", "elegant"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.5,
      count: 78
    }
  },
  {
    name: "High-Waisted Jeans",
    description: "Trendy high-waisted jeans with a flattering fit. Made from stretch denim for comfort and style.",
    shortDescription: "Stylish high-waisted denim jeans",
    price: 72.99,
    comparePrice: 89.99,
    category: "Women",
    subcategory: "Pants",
    brand: "TrendyDenim",
    sku: "TD-HJ-009",
    images: [
      {
        url: "/images/womens/trousers-black.jpg",
        alt: "High-waisted blue jeans",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "28", quantity: 12 },
      { size: "30", quantity: 16 },
      { size: "32", quantity: 14 },
      { size: "34", quantity: 10 }
    ],
    colors: [
      { name: "Medium Blue", hex: "#4682B4", quantity: 32 },
      { name: "Black", hex: "#000000", quantity: 20 }
    ],
    inventory: {
      quantity: 52,
      lowStockThreshold: 10,
      trackQuantity: true
    },
    features: ["High-Waisted", "Stretch Denim", "Flattering Fit"],
    tags: ["jeans", "high-waisted", "trendy", "denim"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.6,
      count: 124
    }
  },
  {
    name: "Trench Coat",
    description: "Classic trench coat with belt and double-breasted design. Perfect for transitional weather.",
    shortDescription: "Classic double-breasted trench coat",
    price: 179.99,
    comparePrice: 219.99,
    category: "Women",
    subcategory: "Jackets",
    brand: "ClassicCoats",
    sku: "CC-TC-010",
    images: [
      {
        url: "/images/womens/cardigan-camel.jpg",
        alt: "Beige trench coat",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", quantity: 6 },
      { size: "M", quantity: 10 },
      { size: "L", quantity: 8 }
    ],
    colors: [
      { name: "Beige", hex: "#F5F5DC", quantity: 16 },
      { name: "Navy", hex: "#1E3A8A", quantity: 8 }
    ],
    inventory: {
      quantity: 24,
      lowStockThreshold: 5,
      trackQuantity: true
    },
    features: ["Double-Breasted", "Belt Included", "Water Resistant"],
    tags: ["trench coat", "classic", "outerwear", "professional"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.7,
      count: 89
    }
  },
  {
    name: "Ballet Flats",
    description: "Comfortable ballet flats with cushioned insole. Perfect for everyday wear and professional settings.",
    shortDescription: "Comfortable leather ballet flats",
    price: 68.99,
    comparePrice: 84.99,
    category: "Women",
    subcategory: "Shoes",
    brand: "ComfortFlats",
    sku: "CF-BF-011",
    images: [
      {
        url: "/images/womens/pumps-black.jpg",
        alt: "Black ballet flats",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "6", quantity: 8 },
      { size: "7", quantity: 12 },
      { size: "8", quantity: 14 },
      { size: "9", quantity: 10 }
    ],
    colors: [
      { name: "Black", hex: "#000000", quantity: 25 },
      { name: "Nude", hex: "#F5DEB3", quantity: 19 }
    ],
    inventory: {
      quantity: 44,
      lowStockThreshold: 8,
      trackQuantity: true
    },
    features: ["Cushioned Insole", "Genuine Leather", "Professional Style"],
    tags: ["ballet flats", "comfortable", "professional", "leather"],
    status: "active",
    featured: false,
    ratings: {
      average: 4.4,
      count: 167
    }
  },
  {
    name: "Designer Handbag",
    description: "Elegant leather handbag with multiple compartments. Features adjustable strap and premium hardware.",
    shortDescription: "Premium leather designer handbag",
    price: 129.99,
    comparePrice: 159.99,
    category: "Women",
    subcategory: "Accessories",
    brand: "LuxeBags",
    sku: "LB-DH-012",
    images: [
      {
        url: "/images/womens/floral-dress-blue.jpg",
        alt: "Black leather handbag",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "M", quantity: 25 }
    ],
    colors: [
      { name: "Black", hex: "#000000", quantity: 18 },
      { name: "Brown", hex: "#8B4513", quantity: 12 },
      { name: "Red", hex: "#DC143C", quantity: 8 }
    ],
    inventory: {
      quantity: 38,
      lowStockThreshold: 8,
      trackQuantity: true
    },
    features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap"],
    tags: ["handbag", "leather", "designer", "accessory"],
    status: "active",
    featured: true,
    ratings: {
      average: 4.9,
      count: 203
    }
  }
];

module.exports = mockProducts;
