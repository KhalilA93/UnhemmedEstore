// Product preloader for faster page navigation
class ProductPreloader {
    constructor() {
        this.cache = new Map();
        this.prefetchedRoutes = new Set();
        this.init();
    }

    init() {
        // Preload critical product data
        this.preloadFeaturedProducts();
        
        // Setup intersection observer for product links
        this.setupLinkPreloading();
        
        // Setup mouseover preloading
        this.setupHoverPreloading();
    }

    async preloadFeaturedProducts() {
        try {
            const response = await fetch('/api/products?featured=true&limit=6');
            const data = await response.json();
            
            if (data.success) {
                this.cache.set('featured', data.data.products);
                console.log('🚀 Featured products preloaded');
            }
        } catch (error) {
            console.log('Failed to preload featured products:', error);
        }
    }

    setupLinkPreloading() {
        // Preload product pages when links come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    const href = link.getAttribute('href');
                    
                    if (href && href.startsWith('/product/') && !this.prefetchedRoutes.has(href)) {
                        this.prefetchRoute(href);
                        this.prefetchedRoutes.add(href);
                    }
                }
            });
        }, { rootMargin: '100px' });

        // Observe all product links
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('a[href^="/product/"]').forEach(link => {
                observer.observe(link);
            });
        });
    }

    setupHoverPreloading() {
        // Preload on hover for immediate navigation
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a[href^="/product/"]');
            if (link) {
                const href = link.getAttribute('href');
                if (href && !this.prefetchedRoutes.has(href)) {
                    this.prefetchRoute(href);
                    this.prefetchedRoutes.add(href);
                }
            }
        });
    }

    async prefetchRoute(href) {
        try {
            // Create a hidden link and trigger prefetch
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
            
            // Also prefetch the API data if it's a product page
            const productId = href.split('/product/')[1];
            if (productId && !this.cache.has(productId)) {
                const response = await fetch(`/api/products/${productId}`);
                const data = await response.json();
                if (data.success) {
                    this.cache.set(productId, data.data);
                }
            }
        } catch (error) {
            console.log('Prefetch failed for:', href, error);
        }
    }

    // Get cached product data
    getProduct(id) {
        return this.cache.get(id);
    }

    // Get cached featured products
    getFeaturedProducts() {
        return this.cache.get('featured') || [];
    }
}

// Initialize preloader
window.productPreloader = new ProductPreloader();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductPreloader;
}
