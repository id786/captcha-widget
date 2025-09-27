/**
 * CAPTCHA Loader - FIXED Version
 * Uses GitHub Pages URL instead of raw.githubusercontent.com
 */
(function() {
    console.log('CAPTCHA Loader: Initializing...');
    
    // FIXED: Use GitHub Pages URL
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
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => {
                console.log('✅ CSS loaded:', href);
                resolve();
            };
            link.onerror = (error) => {
                console.error('❌ Failed to load CSS:', href, error);
                reject(error);
            };
            document.head.appendChild(link);
        });
    }

    function loadJS(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log('✅ JS loaded:', src);
                resolve();
            };
            script.onerror = (error) => {
                console.error('❌ Failed to load JS:', src, error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }

    function initializeCaptcha() {
        console.log('Initializing CAPTCHA widgets...');
        
        let containers = document.querySelectorAll('[data-captcha]');
        
        if (containers.length === 0) {
            const container = document.createElement('div');
            container.id = 'captcha-container';
            container.setAttribute('data-captcha', 'true');
            document.body.appendChild(container);
            containers = [container];
        }
        
        containers.forEach((container, index) => {
            if (!container.id) {
                container.id = 'captcha-container-' + index;
            }
            
            if (window.initCaptcha) {
                const options = {
                    theme: container.dataset.theme || 'light',
                    difficulty: container.dataset.difficulty || 'medium'
                };
                window.initCaptcha(container.id, options);
            }
        });
    }

    async function loadCaptcha() {
        try {
            console.log('🚀 Loading CAPTCHA files from:', CONFIG.baseUrl);
            
            // Load CSS first
            await loadCSS(CONFIG.baseUrl + 'styles.css');
            
            // Load JS files
            for (const file of CONFIG.files) {
                if (file.endsWith('.js')) {
                    await loadJS(CONFIG.baseUrl + file);
                }
            }
            
            console.log('🎉 CAPTCHA Loader: All files loaded successfully');
            initializeCaptcha();
            
        } catch (error) {
            console.error('💥 CAPTCHA Loader: Failed to load files', error);
            showErrorFallback();
        }
    }

    function showErrorFallback() {
        console.log('Showing fallback CAPTCHA');
        const containers = document.querySelectorAll('[data-captcha]');
        if (containers.length === 0) {
            const container = document.createElement('div');
            container.id = 'captcha-container';
            document.body.appendChild(container);
            containers = [container];
        }
        
        containers.forEach(container => {
            container.innerHTML = `
                <div style="border: 2px solid #ff6b6b; padding: 20px; border-radius: 10px; text-align: center;">
                    <h3>CAPTCHA Verification</h3>
                    <p>Please refresh the page to load CAPTCHA.</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        });
    }

    // Start loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCaptcha);
    } else {
        loadCaptcha();
    }
})();
