/**
 * CAPTCHA Verification System
 * Handles session management and content protection
 */

class CaptchaVerification {
    constructor() {
        this.verified = false;
        this.verificationToken = null;
        this.storageKey = 'captcha_widget_verified';
        this.tokenKey = 'captcha_widget_token';
        
        this.init();
    }

    init() {
        this.checkVerification();
    }

    generateToken() {
        return 'captcha_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    markAsVerified() {
        this.verified = true;
        this.verificationToken = this.generateToken();
        
        // Store in session storage
        sessionStorage.setItem(this.storageKey, 'true');
        sessionStorage.setItem(this.tokenKey, this.verificationToken);
        
        this.enableProtectedContent();
        console.log('CAPTCHA: User verified successfully');
    }

    enableProtectedContent() {
        // Enable protected buttons
        document.querySelectorAll('.protected-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('protected-btn');
            btn.classList.add('captcha-verified');
        });

        // Show protected content
        document.querySelectorAll('.protected-content').forEach(content => {
            content.style.display = 'block';
            content.classList.add('captcha-verified');
        });

        // Show verified indicators
        document.querySelectorAll('.captcha-verified-indicator').forEach(indicator => {
            indicator.style.display = 'inline';
        });

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('captchaVerified', {
            detail: { 
                token: this.verificationToken,
                timestamp: Date.now()
            }
        }));
    }

    checkVerification() {
        const verified = sessionStorage.getItem(this.storageKey);
        const token = sessionStorage.getItem(this.tokenKey);
        
        if (verified === 'true' && token) {
            this.verified = true;
            this.verificationToken = token;
            this.enableProtectedContent();
            return true;
        }
        return false;
    }

    resetVerification() {
        this.verified = false;
        this.verificationToken = null;
        sessionStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.tokenKey);
        
        // Reset protected content
        document.querySelectorAll('.captcha-verified').forEach(element => {
            element.classList.remove('captcha-verified');
        });
        
        console.log('CAPTCHA: Verification reset');
    }

    getVerificationStatus() {
        return this.verified;
    }

    getVerificationToken() {
        return this.verificationToken;
    }
}

// Initialize global instance
window.captchaVerification = new CaptchaVerification();
