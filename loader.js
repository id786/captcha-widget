/**
 * CAPTCHA Loader - Lightweight script loader
 * Add this to your HTML for quick setup
 */

(function() {
    console.log('CAPTCHA Loader: Initializing...');
    
    // Configuration
    const CONFIG = {
        baseUrl: 'https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/',
        // Alternative: baseUrl: 'https://yourusername.github.io/captcha-widget/',
        files: [
            'captcha-verification.js',
            'captcha-widget.js',
            'styles.css'
        ],
        version: '1.0.0'
    };

    // Load CSS
    function loadCSS(href) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve();
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // Load JavaScript
    function loadJS(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Auto-initialize CAPTCHA
    function initializeCaptcha() {
        const containers = document.querySelectorAll('[data-captcha]');
        
        containers.forEach(container => {
            const containerId = container.id || 'captcha-container-' + Math.random().toString(36).substr(2, 9);
            if (!container.id) container.id = containerId;
            
            const options = {
                theme: container.dataset.theme || 'light',
                difficulty: container.dataset.difficulty || 'medium',
                autoVerify: container.dataset.autoVerify !== 'false'
            };
            
            if (window.initCaptcha) {
                window.initCaptcha(containerId, options);
            } else {
                // Retry after a short delay
                setTimeout(() => initializeCaptcha(), 100);
            }
        });
    }

    // Main loading function
    async function loadCaptcha() {
        try {
            // Load CSS first
            await loadCSS(CONFIG.baseUrl + 'styles.css');
            
            // Load JS files
            for (const file of CONFIG.files) {
                if (file.endsWith('.js')) {
                    await loadJS(CONFIG.baseUrl + file);
                }
            }
            
            console.log('CAPTCHA Loader: All files loaded successfully');
            
            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeCaptcha);
            } else {
                initializeCaptcha();
            }
            
        } catch (error) {
            console.error('CAPTCHA Loader: Failed to load files', error);
        }
    }

    // Start loading
    loadCaptcha();
})();
