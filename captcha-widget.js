
/**
 * CAPTCHA Widget - Lightweight CAPTCHA System
 * Version: 1.0.0
 * GitHub: https://github.com/yourusername/captcha-widget
 */

class CaptchaWidget {
    constructor(containerId, options = {}) {
        if (!containerId) {
            console.error('CAPTCHA: Container ID is required');
            return;
        }
        
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('CAPTCHA: Container not found:', containerId);
            return;
        }
        
        this.options = {
            theme: options.theme || 'light',
            difficulty: options.difficulty || 'medium',
            onSuccess: options.onSuccess || function() {},
            onError: options.onError || function() {},
            autoVerify: options.autoVerify !== false,
            customText: options.customText || null
        };
        
        this.captchaText = '';
        this.isVerified = false;
        this.init();
    }

    generateCaptchaText() {
        if (this.options.customText) {
            return this.options.customText;
        }
        
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let result = '';
        const length = this.options.difficulty === 'hard' ? 6 : 
                      this.options.difficulty === 'medium' ? 5 : 4;
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    drawCaptcha() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = this.options.theme === 'dark' ? '#2d3748' : '#f7fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text with distortion
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = this.options.theme === 'dark' ? '#e2e8f0' : '#2d3748';
        
        // Add distortion effects
        for (let i = 0; i < this.captchaText.length; i++) {
            ctx.save();
            ctx.translate(30 + i * 30, 50);
            ctx.rotate((Math.random() - 0.5) * 0.4);
            ctx.fillText(this.captchaText[i], 0, 0);
            ctx.restore();
        }

        // Add noise
        for (let i = 0; i < 50; i++) {
            ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        return canvas.toDataURL();
    }

    createWidget() {
        this.captchaText = this.generateCaptchaText();
        
        const widgetHTML = `
            <div class="captcha-widget ${this.options.theme}">
                <div class="captcha-header">
                    <h3>Verify you're human</h3>
                    <button type="button" class="captcha-refresh" title="Refresh CAPTCHA">↻</button>
                </div>
                <div class="captcha-image">
                    <img src="${this.drawCaptcha()}" alt="CAPTCHA code" class="captcha-img">
                </div>
                <div class="captcha-input-group">
                    <input type="text" class="captcha-input" placeholder="Enter the text above" maxlength="6" aria-label="CAPTCHA code">
                    <button type="button" class="captcha-verify">Verify</button>
                </div>
                <div class="captcha-status" aria-live="polite"></div>
            </div>
        `;

        this.container.innerHTML = widgetHTML;
        this.bindEvents();
    }

    bindEvents() {
        // Refresh button
        this.container.querySelector('.captcha-refresh').addEventListener('click', () => {
            this.refreshCaptcha();
        });

        // Verify button
        this.container.querySelector('.captcha-verify').addEventListener('click', () => {
            this.verifyCaptcha();
        });

        // Enter key support
        this.container.querySelector('.captcha-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyCaptcha();
            }
        });

        // Input validation
        this.container.querySelector('.captcha-input').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        });
    }

    refreshCaptcha() {
        this.captchaText = this.generateCaptchaText();
        this.container.querySelector('.captcha-img').src = this.drawCaptcha();
        this.container.querySelector('.captcha-input').value = '';
        this.container.querySelector('.captcha-status').textContent = '';
        this.container.querySelector('.captcha-input').focus();
    }

    verifyCaptcha() {
        const input = this.container.querySelector('.captcha-input').value.trim();
        const statusDiv = this.container.querySelector('.captcha-status');

        if (!input) {
            statusDiv.textContent = 'Please enter the CAPTCHA code';
            statusDiv.className = 'captcha-status error';
            return;
        }

        if (input.toLowerCase() === this.captchaText.toLowerCase()) {
            this.isVerified = true;
            statusDiv.textContent = '✓ Verification successful!';
            statusDiv.className = 'captcha-status success';
            
            if (this.options.autoVerify) {
                window.captchaVerification.markAsVerified();
            }
            
            this.options.onSuccess(this.captchaText);
        } else {
            statusDiv.textContent = '✗ Incorrect code, please try again';
            statusDiv.className = 'captcha-status error';
            this.options.onError();
            setTimeout(() => this.refreshCaptcha(), 1000);
        }
    }

    init() {
        this.createWidget();
        console.log('CAPTCHA Widget initialized successfully');
    }

    // Public method to check verification status
    getVerificationStatus() {
        return this.isVerified;
    }

    // Public method to reset CAPTCHA
    reset() {
        this.isVerified = false;
        this.refreshCaptcha();
    }
}

// Global initialization function
window.initCaptcha = function(containerId, options) {
    return new CaptchaWidget(containerId, options);
};
