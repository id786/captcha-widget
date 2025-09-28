/**
 * CAPTCHA Loader - Fixed Version (No setTimeout needed!)
 * Loads synchronously and waits for readiness
 */

(function() {
    console.log('CAPTCHA Loader: Starting synchronous load...');
    
    // Configuration
    const CONFIG = {
        baseUrl: 'https://id786.github.io/captcha-widget/',
        files: [
            'captcha-verification.js',
            'captcha-widget.js',
            'styles.css'
        ]
    };

    // Synchronous CSS load
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

    // Synchronous JS load
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

    // Wait for CAPTCHA system to be ready
    function waitForCAPTCHAReady() {
        return new Promise((resolve) => {
            const checkReady = () => {
                if (typeof window.initCaptcha !== 'undefined' && 
                    typeof window.captchaVerification !== 'undefined') {
                    resolve();
                } else {
                    setTimeout(checkReady, 10); // Check every 10ms
                }
            };
            checkReady();
        });
    }

    // Auto-initialize CAPTCHA containers when system is ready
    function autoInitializeCAPTCHAs() {
        const containers = document.querySelectorAll('[id^="captcha-container-"]');
        containers.forEach(container => {
            const containerId = container.id;
            if (window.initCaptcha) {
                console.log(`Auto-initializing CAPTCHA: ${containerId}`);
                window.initCaptcha(containerId);
            }
        });
    }

    // Main loading function
    async function loadCAPTCHASystem() {
        try {
            // Load CSS first
            await loadCSS(CONFIG.baseUrl + 'styles.css');
            console.log('✅ CSS loaded');
            
            // Load JS files in order
            for (const file of CONFIG.files) {
                if (file.endsWith('.js')) {
                    await loadJS(CONFIG.baseUrl + file);
                    console.log(`✅ ${file} loaded`);
                }
            }
            
            // Wait for CAPTCHA system to be fully ready
            await waitForCAPTCHAReady();
            console.log('🎉 CAPTCHA system fully ready!');
            
            // Auto-initialize any CAPTCHA containers found
            autoInitializeCAPTCHAs();
            
        } catch (error) {
            console.error('❌ CAPTCHA Loader: Failed to load files', error);
        }
    }

    // Start loading immediately and block until ready
    loadCAPTCHASystem();
})();
