// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    setupSmoothScrolling();
    setupContactForm();
    setupScrollEffects();
    setupButterflyAnimation();
    loadDisplayedMessages();
    setupLoadMoreButton();
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
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
}

// Contact form submission handler
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }
}

function handleFormSubmission(form) {
    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    showLoadingState(true);
    
    // Choose your preferred method:
    // Method 1: Formspree (recommended for beginners)
    submitToFormspree(formData, form);
    
    // Method 2: Netlify Forms (uncomment if using Netlify)
    // submitToNetlify(formData, form);
    
    // Method 3: EmailJS (uncomment if using EmailJS)
    // submitToEmailJS(name, email, message, form);
    
    // Method 4: Custom backend API (uncomment if you have your own server)
    // submitToCustomAPI(formData, form);
}

// Method 1: Formspree - Easy setup, no backend needed
function submitToFormspree(formData, form) {
    // Replace 'your-form-id' with your actual Formspree form ID
    fetch('https://formspree.io/f/xvgbrgbd', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        showLoadingState(false);
        if (response.ok) {
            // Save message locally for display
            const name = formData.get('name');
            const message = formData.get('message');
            saveMessageLocally(name, message);
            
            showNotification('Thank you for your message! We\'ll get back to you soon. 💕', 'success');
            form.reset();
            
            // Refresh displayed messages
            loadDisplayedMessages();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        showLoadingState(false);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        console.error('Error:', error);
    });
}

// Method 2: Netlify Forms - If hosting on Netlify
function submitToNetlify(formData, form) {
    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(() => {
        showLoadingState(false);
        showNotification('Thank you for your message! We\'ll get back to you soon. 💕', 'success');
        form.reset();
    })
    .catch(error => {
        showLoadingState(false);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        console.error('Error:', error);
    });
}

// Method 3: EmailJS - Send emails directly from frontend
function submitToEmailJS(name, email, message, form) {
    // You need to include EmailJS library and initialize it
    // Add this to your HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    
    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: 'Hendry & Sari'
    };
    
    emailjs.send('your-service-id', 'your-template-id', templateParams)
        .then(() => {
            showLoadingState(false);
            showNotification('Thank you for your message! We\'ll get back to you soon. 💕', 'success');
            form.reset();
        })
        .catch(error => {
            showLoadingState(false);
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            console.error('EmailJS error:', error);
        });
}

// Method 4: Custom API - If you have your own backend
function submitToCustomAPI(formData, form) {
    fetch('/api/contact', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        showLoadingState(false);
        if (data.success) {
            showNotification('Thank you for your message! We\'ll get back to you soon. 💕', 'success');
            form.reset();
        } else {
            throw new Error(data.message || 'Unknown error');
        }
    })
    .catch(error => {
        showLoadingState(false);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        console.error('API error:', error);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#b8daff'};
        border-radius: 10px;
        padding: 1rem;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function showLoadingState(isLoading) {
    const submitButton = document.querySelector('.contact-form .cta-button');
    if (submitButton) {
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending... 🦋';
            submitButton.style.opacity = '0.7';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
            submitButton.style.opacity = '1';
        }
    }
}

// Header scroll effects
function setupScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Change header background opacity based on scroll
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Add subtle hide/show effect for mobile
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero && scrollTop < hero.offsetHeight) {
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
        }
    });
}

// Enhanced butterfly animation system
function setupButterflyAnimation() {
    const butterflies = ['🦋', '🦋', '🦋'];
    let butterflyCount = 0;
    
    // Create periodic butterflies
    setInterval(() => {
        if (butterflyCount < 6) {
            createButterfly();
        }
    }, Math.random() * 5000 + 3000); // Random interval between 3-8 seconds
    
    // Create initial butterflies with delay
    setTimeout(() => createButterfly(), 2000);
    setTimeout(() => createButterfly(), 4000);
    setTimeout(() => createButterfly(), 6000);
}

function createButterfly() {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly dynamic';
    butterfly.textContent = '🦋';
    
    // Random properties
    const size = Math.random() * 10 + 15; // 15-25px
    const hue = Math.random() * 60 + 280; // Purple to pink range
    const saturation = Math.random() * 30 + 50; // 50-80%
    const lightness = Math.random() * 20 + 60; // 60-80%
    const duration = Math.random() * 5 + 12; // 12-17 seconds
    const startDelay = Math.random() * 3; // 0-3 seconds delay
    
    butterfly.style.cssText = `
        position: fixed;
        font-size: ${size}px;
        color: hsla(${hue}, ${saturation}%, ${lightness}%, 0.7);
        pointer-events: none;
        z-index: 1;
        animation: float ${duration}s infinite linear;
        animation-delay: ${startDelay}s;
        left: -50px;
        top: ${Math.random() * window.innerHeight}px;
    `;
    
    document.body.appendChild(butterfly);
    
    // Remove butterfly after animation completes
    setTimeout(() => {
        if (butterfly.parentNode) {
            butterfly.parentNode.removeChild(butterfly);
        }
    }, (duration + startDelay) * 1000);
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    document.querySelectorAll('.person-card, .portfolio-item').forEach(el => {
        observer.observe(el);
    });
}

// Image lazy loading
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Message Display System
let displayedMessagesCount = 0;
const messagesPerPage = 6;

function saveMessageLocally(name, message) {
    const messages = getStoredMessages();
    const newMessage = {
        id: Date.now(),
        name: name,
        message: message,
        date: new Date().toISOString(),
        approved: true // You can add moderation later
    };
    
    messages.unshift(newMessage); // Add to beginning
    
    // Keep only last 50 messages to prevent storage bloat
    if (messages.length > 50) {
        messages.splice(50);
    }
    
    // Store in memory (you can change this to localStorage if needed)
    window.portfolioMessages = messages;
}

function getStoredMessages() {
    // Using in-memory storage (resets on page reload)
    // You can change this to localStorage for persistence
    if (!window.portfolioMessages) {
        window.portfolioMessages = [
            // Add some sample messages for demonstration
            {
                id: 1,
                name: "Sarah Johnson",
                message: "Your portfolio is absolutely stunning! The butterfly theme is so elegant and romantic. Can't wait to see more of your work together!",
                date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                approved: true
            },
            {
                id: 2,
                name: "Mike Chen",
                message: "Amazing collaboration between you two! The design is clean, professional, and the interactive elements are delightful.",
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                approved: true
            },
            {
                id: 3,
                name: "Emily Rodriguez",
                message: "Love the romantic yet professional aesthetic. You've created something truly special that showcases both of your talents beautifully.",
                date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                approved: true
            }
        ];
    }
    return window.portfolioMessages;
}

function loadDisplayedMessages() {
    const messagesGrid = document.getElementById('messagesGrid');
    const loadMoreContainer = document.querySelector('.load-more-container');
    const messages = getStoredMessages().filter(msg => msg.approved);
    
    // Clear existing messages
    messagesGrid.innerHTML = '';
    displayedMessagesCount = 0;
    
    if (messages.length === 0) {
        // Show placeholder
        messagesGrid.innerHTML = `
            <div class="message-card placeholder">
                <div class="message-content">
                    <p>"No messages yet. Be the first to send us a message!"</p>
                </div>
                <div class="message-author">
                    <span class="author-name">- Waiting for you 💕</span>
                </div>
            </div>
        `;
        loadMoreContainer.style.display = 'none';
        return;
    }
    
    // Load first batch
    loadMoreMessages();
}

function loadMoreMessages() {
    const messagesGrid = document.getElementById('messagesGrid');
    const loadMoreContainer = document.querySelector('.load-more-container');
    const messages = getStoredMessages().filter(msg => msg.approved);
    
    const messagesToShow = messages.slice(displayedMessagesCount, displayedMessagesCount + messagesPerPage);
    
    messagesToShow.forEach((message, index) => {
        setTimeout(() => {
            const messageCard = createMessageCard(message);
            messagesGrid.appendChild(messageCard);
        }, index * 100); // Stagger the animation
    });
    
    displayedMessagesCount += messagesToShow.length;
    
    // Show/hide load more button
    if (displayedMessagesCount >= messages.length) {
        loadMoreContainer.style.display = 'none';
    } else {
        loadMoreContainer.style.display = 'block';
    }
}

function createMessageCard(message) {
    const messageCard = document.createElement('div');
    messageCard.className = 'message-card message-animation';
    
    const messageDate = new Date(message.date);
    const formattedDate = messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    messageCard.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(message.message)}</p>
        </div>
        <div class="message-author">
            <span class="author-name">- ${escapeHtml(message.name)}</span>
            <span class="message-date">${formattedDate}</span>
        </div>
    `;
    
    return messageCard;
}

function setupLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreMessages');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreMessages);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Enhanced scroll animations to include message cards
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    document.querySelectorAll('.person-card, .portfolio-item, .message-card:not(.placeholder)').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any size-dependent animations
    setupScrollEffects();
}, 250));

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .person-card, .portfolio-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .person-card.animate-in, .portfolio-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    header {
        transition: transform 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease;
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

document.head.appendChild(style);

// Initialize scroll animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupScrollAnimations);
} else {
    setupScrollAnimations();
}
