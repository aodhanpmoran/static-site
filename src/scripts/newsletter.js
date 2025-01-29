// Newsletter modal management
function handleNewsletterModal() {
    // Check if user has already subscribed
    if (localStorage.getItem('newsletterSubscribed') === 'true') {
        return; // Don't show modal if already subscribed
    }

    // Check last shown timestamp
    const lastShown = localStorage.getItem('newsletterLastShown');
    const now = new Date().getTime();
    
    // If last shown exists and it's been less than 60 minutes
    if (lastShown && (now - parseInt(lastShown)) < 60 * 60 * 1000) {
        return;
    }

    // Update last shown timestamp
    localStorage.setItem('newsletterLastShown', now.toString());
}

// Listen for successful form submission
document.addEventListener('submit', function(event) {
    if (event.target.classList.contains('formkit-form')) {
        localStorage.setItem('newsletterSubscribed', 'true');
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', handleNewsletterModal); 