/**
 * Sidebar Loader - Dynamically load sidebar into any page
 */

async function loadSidebar() {
    try {
        const response = await fetch('/components/sidebar.html');
        if (!response.ok) throw new Error('Failed to load sidebar');
        
        const sidebarHTML = await response.text();
        
        // Insert at beginning of body
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
        
        // Add wrapper class to body
        document.body.classList.add('with-sidebar');
        
        // Wrap main content if not already wrapped
        if (!document.querySelector('.main-content-wrapper')) {
            const mainContent = document.body.innerHTML.replace(sidebarHTML, '');
            document.body.innerHTML = sidebarHTML + `<div class="main-content-wrapper" id="mainContent">${mainContent}</div>`;
        }
        
        // Load sidebar JS
        const script = document.createElement('script');
        script.src = '/components/sidebar.js';
        document.body.appendChild(script);
        
    } catch (error) {
        console.error('Error loading sidebar:', error);
    }
}

// Auto-load on pages with data-sidebar attribute
if (document.documentElement.hasAttribute('data-sidebar')) {
    loadSidebar();
}
