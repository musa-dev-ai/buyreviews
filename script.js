document.addEventListener('DOMContentLoaded', function() {
    // --- Mobile Menu Logic ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    function toggleMobileMenu() {
        mobileMenuSidebar.classList.toggle('open');
        mobileMenuOverlay.classList.toggle('open');
        document.body.classList.toggle('overflow-hidden');
    }

    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    mobileMenuClose.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

    mobileMenuSidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            if (link.getAttribute('href').startsWith('#')) {
                toggleMobileMenu();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    event.preventDefault();
                    const headerOffset = document.getElementById('main-header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            } else {
                toggleMobileMenu();
            }
        });
    });

    // --- Cart Functionality ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartButton = document.getElementById('cart-button');
    const cartButtonMobile = document.getElementById('cart-button-mobile');
    const cartCountSpan = document.getElementById('cart-count');
    const cartCountSpanMobile = document.getElementById('cart-count-mobile');
    const cartModal = document.getElementById('cart-modal');
    const cartModalClose = document.getElementById('cart-modal-close');
    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');
    const clearCartButton = document.getElementById('clear-cart-button');
    const whatsappNumber = '2348140441506';

    const cartNotification = document.getElementById('cart-notification');
    let notificationTimeout;

    function showNotification() {
        cartNotification.classList.add('show');
        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(() => {
            cartNotification.classList.remove('show');
        }, 3000);
    }

    function updateCartIcon() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        cartCountSpanMobile.textContent = totalItems;
        cartCountSpan.style.display = totalItems > 0 ? 'flex' : 'none';
        cartCountSpanMobile.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutButton.disabled = true;
            checkoutButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('opacity-50', 'cursor-not-allowed');

            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item', 'font-medium');
                itemElement.innerHTML = `
                    <div class="flex-1">
                        <span class="text-gray-900">${item.reviews} ${item.reviews.includes('month') || item.reviews.includes('custom') ? '' : 'Reviews'} (${item.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())})</span>
                        <span class="block text-sm text-gray-600">$${item.price.toFixed(2)} each</span>
                    </div>
                    <div class="flex items-center space-x-2 quantity-controls text-gray-700">
                        <button data-index="${index}" data-action="decrease" class="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300">-</button>
                        <span>${item.quantity}</span>
                        <button data-index="${index}" data-action="increase" class="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300">+</button>
                        <button data-index="${index}" data-action="remove" class="remove-item-btn text-red-500 hover:text-red-700 ml-2"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        updateCartTotal();
        updateCartIcon();
        saveCart();
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    }

    function addToCart(packageType, reviews, price) {
        const existingItemIndex = cart.findIndex(item => item.type === packageType && item.reviews === reviews);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ type: packageType, reviews, price, quantity: 1 });
        }
        renderCart();
        showNotification();
    }

    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            const index = parseInt(target.dataset.index);
            const action = target.dataset.action;

            if (action === 'increase') {
                cart[index].quantity += 1;
            } else if (action === 'decrease') {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
            } else if (action === 'remove') {
                cart.splice(index, 1);
            }
            renderCart();
        }
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const packageType = button.dataset.packageType;
            const reviews = button.dataset.reviews;
            const price = parseFloat(button.dataset.price);
            addToCart(packageType, reviews, price);
        });
    });

    function openModal(modal, overlay) {
        modal.classList.add('open');
        overlay.classList.add('open');
        document.body.classList.add('overflow-hidden');
    }

    function closeModal(modal, overlay) {
        modal.classList.remove('open');
        overlay.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
    }

    cartButton.addEventListener('click', () => openModal(cartModal, cartModalOverlay));
    cartButtonMobile.addEventListener('click', () => openModal(cartModal, cartModalOverlay));
    cartModalClose.addEventListener('click', () => closeModal(cartModal, cartModalOverlay));
    cartModalOverlay.addEventListener('click', () => closeModal(cartModal, cartModalOverlay));

    clearCartButton.addEventListener('click', () => {
        cart = [];
        saveCart();
        renderCart();
        console.log('Cart has been cleared.');
    });

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            console.log('Your cart is empty. Please add items before ordering.');
            return;
        }

        let orderMessage = "🌟 Hello BuyReviewz Team! 🌟%0A%0A"; // %0A is newline for WhatsApp
        orderMessage += "I'd like to place an order for Google Reviews:%0A%0A";
        let totalCost = 0;

        cart.forEach((item, index) => {
            const itemName = `${item.quantity} x ${item.reviews} ${item.reviews.includes('month') || item.reviews.includes('custom') ? '' : 'Reviews'} (${item.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())})`;
            orderMessage += `👉 ${index + 1}. ${itemName} - Price: $${(item.price * item.quantity).toFixed(2)}%0A`;
            totalCost += (item.price * item.quantity);
        });

        orderMessage += `%0A🛒 Total Order Value: $${totalCost.toFixed(2)} 💰`;
        orderMessage += "%0A%0ACould you please guide me on how to provide my Google Business Profile (GBP) link and proceed with the payment? I'm excited to boost my online presence! ✨";
        orderMessage += "%0A%0AThank you!";

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${orderMessage}`; // Message is already URL-encoded with %0A
        window.open(whatsappUrl, '_blank');

        cart = [];
        saveCart();
        renderCart();
        closeModal(cartModal, cartModalOverlay);
    });

    // --- Privacy Policy Modal Logic ---
    const privacyPolicyLinkFooter = document.getElementById('privacy-policy-link-footer');
    const mobilePrivacyPolicyLink = document.getElementById('mobile-privacy-policy-link'); // Added for mobile menu
    const privacyPolicyModal = document.getElementById('privacy-policy-modal');
    const privacyPolicyClose = document.getElementById('privacy-policy-close');
    const privacyPolicyOverlay = document.getElementById('privacy-policy-modal-overlay');
    const privacyAgreeButton = document.getElementById('privacy-agree-button');

    privacyPolicyLinkFooter.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior if it's an anchor
        openModal(privacyPolicyModal, privacyPolicyOverlay);
    });
    if (mobilePrivacyPolicyLink) { // Check if element exists for mobile link
        mobilePrivacyPolicyLink.addEventListener('click', (event) => {
            // This link is already handled by mobile menu's smooth scroll logic,
            // but we also want it to open the modal.
            // The smooth scroll logic will automatically close the mobile menu.
            openModal(privacyPolicyModal, privacyPolicyOverlay);
        });
    }

    privacyPolicyClose.addEventListener('click', () => closeModal(privacyPolicyModal, privacyPolicyOverlay));
    privacyPolicyOverlay.addEventListener('click', () => closeModal(privacyPolicyModal, privacyPolicyOverlay));
    privacyAgreeButton.addEventListener('click', () => {
        // In a real application, you might save a cookie/localStorage flag here
        // indicating the user has agreed to the privacy policy.
        console.log("User agreed to Privacy Policy!");
        closeModal(privacyPolicyModal, privacyPolicyOverlay);
    });


    // --- Newsletter Form Submission ---
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');

    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;

        console.log(`Newsletter subscription attempt for: ${email}`);
        newsletterMessage.textContent = 'Thank you for subscribing!';
        newsletterMessage.classList.remove('hidden');
        newsletterMessage.classList.add('text-green-600');
        emailInput.value = '';
        setTimeout(() => {
            newsletterMessage.classList.add('hidden');
        }, 5000);
    });

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = this.querySelector('#name').value;
        const email = this.querySelector('#email').value;
        const message = this.querySelector('#message').value;

        console.log('Contact Form Submission:', { name, email, message });

        contactMessage.textContent = 'Your message has been sent successfully! We will get back to you soon.';
        contactMessage.classList.remove('hidden');
        contactMessage.classList.add('text-green-600');
        this.reset();
        setTimeout(() => {
            contactMessage.classList.add('hidden');
        }, 7000);
    });

    // --- General Page Load Operations ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
    renderCart(); // Initial render of the cart on page load

    // Global smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.getElementById('main-header').offsetHeight;
                // Use window.scrollY instead of pageYOffset as it's more modern
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

