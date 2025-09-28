/**
 * CAPTCHA Loader - Auto-detection Version
 * Automatically finds and initializes CAPTCHA containers
 */

(function() {
    console.log('CAPTCHA Loader: Auto-detection mode initialized');
    
    // Configuration
    const CONFIG = {
        baseUrl: 'https://id786.github.io/captcha-widget/',
        files: [
            'captcha-verification.js',
            'captcha-widget.js',
            'styles.css'
        ]
    };

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

    // Auto-detect and initialize CAPTCHA containers
    function autoInitializeCAPTCHAs() {
        console.log('🔍 Searching for CAPTCHA containers...');
        
        // Find all elements with id starting with "captcha-container-"
        const containers = document.querySelectorAll('[id^="captcha-container-"]');
        
        console.log(`📦 Found ${containers.length} CAPTCHA container(s)`);
        
        containers.forEach(container => {
            const containerId = container.id;
            console.log(`🚀 Initializing CAPTCHA: ${containerId}`);
            
            if (window.initCaptcha) {
                window.initCaptcha(containerId);
            } else {
                console.error(`❌ initCaptcha function not available for ${containerId}`);
            }
        });
        
        // Also look for containers with class
        const classContainers = document.querySelectorAll('.captcha-container');
        classContainers.forEach(container => {
            if (!container.id) {
                // Auto-generate ID if none exists
                container.id = 'captcha-container-' + Math.random().toString(36).substr(2, 9);
            }
            console.log(`🚀 Initializing CAPTCHA by class: ${container.id}`);
            
            if (window.initCaptcha) {
                window.initCaptcha(container.id);
            }
        });
    }

    // Main loading function
    async function loadCAPTCHASystem() {
        try {
            console.log('🚀 Loading CAPTCHA system...');
            
            // Load CSS first
            await loadCSS(CONFIG.baseUrl + 'styles.css');
            
            // Load JS files
            for (const file of CONFIG.files) {
                if (file.endsWith('.js')) {
                    await loadJS(CONFIG.baseUrl + file);
                }
            }
            
            console.log('✅ CAPTCHA system loaded successfully');
            
            // Auto-initialize CAPTCHAs after loading
            autoInitializeCAPTCHAs();
            
        } catch (error) {
            console.error('❌ CAPTCHA Loader: Failed to load files', error);
        }
    }

    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCAPTCHASystem);
    } else {
        loadCAPTCHASystem();
    }
})();
