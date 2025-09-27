/**
 * CAPTCHA Auto Loader - One-line inclusion
 * Just add: <script src="auto-loader.js"></script>
 */

(function() {
    // Create container if it doesn't exist
    if (!document.getElementById('captcha-container')) {
        const container = document.createElement('div');
        container.id = 'captcha-container';
        container.style.margin = '20px 0';
        document.body.appendChild(container);
    }

    // Load the main loader
    const loaderScript = document.createElement('script');
    loaderScript.src = 'https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/loader.js';
    document.head.appendChild(loaderScript);
})();
