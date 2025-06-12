// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart function
function addToCart(productId, productName, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCart();
    showAddToCartNotification(productName);
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartIcon = document.querySelector('.fa-shopping-cart').parentElement;
    
    // Remove existing count badge
    const existingBadge = cartIcon.querySelector('.badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // Add new count badge if items exist
    if (cartCount > 0) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-danger rounded-pill ms-1';
        badge.textContent = cartCount;
        cartIcon.appendChild(badge);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show add to cart notification
function showAddToCartNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>${productName}</strong> added to cart!
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Newsletter subscription
function subscribeNewsletter(email) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.btn:contains("Add to Cart")').forEach(button => {
        if (button.textContent.includes('Add to Cart')) {
            button.addEventListener('click', function() {
                const card = this.closest('.product-card');
                const productName = card.querySelector('.card-title').textContent;
                const price = parseFloat(card.querySelector('.text-primary').textContent.replace('$', ''));
                const image = card.querySelector('.card-img-top').src;
                const productId = Date.now() + Math.random(); // Simple ID generation
                
                addToCart(productId, productName, price, image);
            });
        }
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-section form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Subscribing...';
            
            try {
                await subscribeNewsletter(emailInput.value);
                
                // Show success message
                submitButton.innerHTML = '<i class="fas fa-check me-1"></i>Subscribed!';
                submitButton.className = 'btn btn-success';
                emailInput.value = '';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    submitButton.className = 'btn btn-light';
                }, 3000);
                
            } catch (error) {
                // Show error message
                submitButton.innerHTML = '<i class="fas fa-times me-1"></i>Error';
                submitButton.className = 'btn btn-danger';
                
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    submitButton.className = 'btn btn-light';
                }, 3000);
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to buttons on click
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled && !this.querySelector('.fa-spinner')) {
                const originalHTML = this.innerHTML;
                this.style.minWidth = this.offsetWidth + 'px';
                
                // Add spinner for a brief moment
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.minWidth = '';
                }, 300);
            }
        });
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
