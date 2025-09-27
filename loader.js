/**
 * CAPTCHA Loader - Fixed Version
 */
(function() {
    console.log('CAPTCHA Loader: Initializing...');
    
    // FIXED: Use raw GitHub URLs
    const CONFIG = {
        baseUrl: 'https://raw.githubusercontent.com/id786/captcha-widget/main/',
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
            link.onload = resolve;
            link.onerror = () => {
                console.error('Failed to load CSS:', href);
                reject();
            };
            document.head.appendChild(link);
        });
    }

    function loadJS(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => {
                console.error('Failed to load JS:', src);
                reject();
            };
            document.head.appendChild(script);
        });
    }

    async function loadCaptcha() {
        try {
            console.log('Loading CAPTCHA files from:', CONFIG.baseUrl);
            
            // Load CSS
            await loadCSS(CONFIG.baseUrl + 'styles.css');
            console.log('CSS loaded successfully');
            
            // Load JS files
            for (const file of CONFIG.files) {
                if (file.endsWith('.js')) {
                    await loadJS(CONFIG.baseUrl + file);
                    console.log('JS loaded:', file);
                }
            }
            
            console.log('CAPTCHA Loader: All files loaded successfully');
            initializeCaptcha();
            
        } catch (error) {
            console.error('CAPTCHA Loader: Failed to load files', error);
            showErrorFallback();
        }
    }

    function initializeCaptcha() {
        const containers = document.querySelectorAll('[data-captcha]');
        
        if (containers.length === 0) {
            // Auto-create container if none exists
            const container = document.createElement('div');
            container.id = 'captcha-container';
            container.setAttribute('data-captcha', 'true');
            document.body.appendChild(container);
            containers = [container];
        }
        
        containers.forEach(container => {
            if (window.initCaptcha) {
                const options = {
                    theme: container.dataset.theme || 'light',
                    difficulty: container.dataset.difficulty || 'medium'
                };
                window.initCaptcha(container.id, options);
            }
        });
    }

    function showErrorFallback() {
        console.log('Showing fallback CAPTCHA');
        const containers = document.querySelectorAll('[data-captcha]');
        containers.forEach(container => {
            container.innerHTML = `
                <div style="border: 1px solid #ccc; padding: 20px; text-align: center;">
                    <p>CAPTCHA verification required</p>
                    <p><small>Loading issue detected. Please refresh the page.</small></p>
                    <button onclick="location.reload()">Retry CAPTCHA</button>
                </div>
            `;
        });
    }

    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCaptcha);
    } else {
        loadCaptcha();
    }
})();
