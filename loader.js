/**
 * CAPTCHA Loader - Auto-Detect and Initialize Containers
 * Automatically finds and initializes all captcha-container-* elements
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
        ],
        autoInit: true, // Automatically initialize found containers
        containerPattern: /^captcha-container-\d+$/, // Pattern to match containers
        defaultInstance: 'captcha-container-1' // Fallback if no containers found
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
        if (typeof window.initCaptcha === 'undefined') {
            console.warn('CAPTCHA: initCaptcha not available yet, retrying...');
            setTimeout(autoInitializeCAPTCHAs, 100);
            return;
        }

        // Find all CAPTCHA containers
        const allElements = document.querySelectorAll('[id]');
        const captchaContainers = [];
        
        // Find elements matching our pattern (captcha-container-1, captcha-container-2, etc.)
        allElements.forEach(element => {
            if (CONFIG.containerPattern.test(element.id)) {
                captchaContainers.push(element.id);
            }
        });

        // If no containers found, check for common names
        if (captchaContainers.length === 0) {
            const commonNames = ['captcha-container', 'captcha-wrapper', 'captcha-box'];
            commonNames.forEach(name => {
                if (document.getElementById(name)) {
                    captchaContainers.push(name);
                }
            });
        }

        // If still no containers, create a default one
        if (captchaContainers.length === 0 && CONFIG.defaultInstance) {
            const defaultContainer = document.createElement('div');
            defaultContainer.id = CONFIG.defaultInstance;
            document.body.appendChild(defaultContainer);
            captchaContainers.push(CONFIG.defaultInstance);
            console.log(`CAPTCHA: Created default container: ${CONFIG.defaultInstance}`);
        }

        // Initialize all found containers
        captchaContainers.forEach(containerId => {
            try {
                console.log(`CAPTCHA: Auto-initializing ${containerId}`);
                window.initCaptcha(containerId, {
                    onSuccess: function() {
                        console.log(`CAPTCHA: ${containerId} verified successfully`);
                    },
                    onError: function() {
                        console.log(`CAPTCHA: ${containerId} verification failed`);
                    }
                });
            } catch (error) {
                console.error(`CAPTCHA: Failed to initialize ${containerId}:`, error);
            }
        });

        console.log(`CAPTCHA: Auto-initialized ${captchaContainers.length} container(s)`);
        
        // Dispatch event when all CAPTCHAs are initialized
        document.dispatchEvent(new CustomEvent('captchaContainersInitialized', {
            detail: { containers: captchaContainers }
        }));
    }

    // Enhanced initialization that waits for DOM and CAPTCHA system
    function initializeWhenReady() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initializeWhenReady, 100);
            });
            return;
        }

        // Wait for CAPTCHA system to load
        if (typeof window.initCaptcha === 'undefined' || 
            typeof window.captchaVerification === 'undefined') {
            setTimeout(initializeWhenReady, 100);
            return;
        }

        // Auto-initialize containers
        if (CONFIG.autoInit) {
            autoInitializeCAPTCHAs();
        }
    }

    // Main loading function
    async function loadCAPTCHASystem() {
        try {
            console.log('🚀 Loading CAPTCHA system with auto-detection...');
            
            // Load CSS first
            await loadCSS(CONFIG.baseUrl + 'styles.css');
            console.log('✅ CSS loaded');
            
            // Load JS files
            for (const file of CONFIG.files) {
                if (file.endsWith('.js')) {
                    await loadJS(CONFIG.baseUrl + file);
                    console.log(`✅ ${file} loaded`);
                }
            }
            
            console.log('🎉 CAPTCHA system loaded successfully');
            console.log('🔍 Auto-detecting CAPTCHA containers...');
            
            // Start the auto-initialization process
            initializeWhenReady();
            
        } catch (error) {
            console.error('❌ CAPTCHA Loader: Failed to load files', error);
            
            // Show error message to user
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10000;
                max-width: 300px;
            `;
            errorDiv.innerHTML = `
                <strong>CAPTCHA Load Error</strong><br>
                Failed to load CAPTCHA system. Please refresh the page.
            `;
            document.body.appendChild(errorDiv);
        }
    }

    // Start loading immediately
    loadCAPTCHASystem();
})();
