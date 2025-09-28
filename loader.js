/**
 * CAPTCHA Loader - Manual Loading Only
 * Users must call window.initCaptcha() manually
 */

(function() {
    console.log('CAPTCHA Loader: Manual mode initialized');
    console.log('Call window.initCaptcha(containerId, options) to create CAPTCHA instances');
    
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

    // Manual loading function
    async function loadCAPTCHASystem() {
        try {
            console.log('🚀 Loading CAPTCHA system manually...');
            
            // Load CSS first
            await loadCSS(CONFIG.baseUrl + 'styles.css');
            
            // Load JS files
            for (const file of CONFIG.files) {
                if (file.endsWith('.js')) {
                    await loadJS(CONFIG.baseUrl + file);
                }
            }
            
            console.log('✅ CAPTCHA system loaded successfully');
            console.log('💡 Use: window.initCaptcha("captcha-container-1") to create CAPTCHA');
            
        } catch (error) {
            console.error('❌ CAPTCHA Loader: Failed to load files', error);
        }
    }

    // Auto-load when this script is included
    loadCAPTCHASystem();
})();
