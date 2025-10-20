/**
 * CAPTCHA Verification System - Multiple Instance Support
 * Handles session management and content protection for multiple CAPTCHAs
 */

class CaptchaVerification {
    constructor() {
        this.verifiedInstances = new Set(); // Track which instances are verified
        this.verificationTokens = new Map(); // Store tokens per instance
        this.storageKey = 'captcha_widget_verified';
        this.tokenKey = 'captcha_widget_tokens';
        
        this.init();
    }

    init() {
        this.enableProtectedContent();
    }

    generateToken(instanceId) {
        return `captcha_${instanceId}_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    }

    markAsVerified(instanceId = '1') {
        this.verifiedInstances.add(instanceId);
        this.verificationTokens.set(instanceId, this.generateToken(instanceId));
        
        // Enable protected content for this instance
        this.enableProtectedContent(instanceId);
        
        console.log(`CAPTCHA: Instance ${instanceId} verified successfully`);
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('captchaVerified', {
            detail: { 
                instanceId: instanceId,
                token: this.verificationTokens.get(instanceId),
                timestamp: Date.now()
            }
        }));
    }

    enableProtectedContent(instanceId = null) {
        if (instanceId) {
            // Enable specific instance's protected content
            this.enableInstanceContent(instanceId);
        } else {
            // Enable all verified instances' content
            this.verifiedInstances.forEach(instance => {
                this.enableInstanceContent(instance);
            });
        }
    }

    enableInstanceContent(instanceId) {
        // Enable protected buttons for this instance
        document.querySelectorAll(`.protected-btn-${instanceId}`).forEach(btn => {
            btn.disabled = false;
            btn.classList.remove(`protected-btn-${instanceId}`);
            btn.classList.add(`captcha-verified-${instanceId}`);
        });

        // Show protected content for this instance
        document.querySelectorAll(`.protected-con-${instanceId}`).forEach(content => {
            content.style.display = 'block';
            content.classList.add(`captcha-verified-${instanceId}`);
        });

        // Show verified indicators for this instance
        document.querySelectorAll(`.captcha-verified-indicator-${instanceId}`).forEach(indicator => {
            indicator.style.display = 'inline';
        });
    }

    getVerificationStatus(instanceId = '1') {
        return this.verifiedInstances.has(instanceId);
    }

    getVerificationToken(instanceId = '1') {
        return this.verificationTokens.get(instanceId);
    }

    resetVerification(instanceId = null) {
        if (instanceId) {
            // Reset specific instance
            this.verifiedInstances.delete(instanceId);
            this.verificationTokens.delete(instanceId);
            this.disableInstanceContent(instanceId);
        } else {
            // Reset all instances
            this.verifiedInstances.clear();
            this.verificationTokens.clear();
            this.disableAllContent();
        }
        console.log(`CAPTCHA: Verification reset for instance ${instanceId || 'all'}`);
    }

    disableInstanceContent(instanceId) {
        document.querySelectorAll(`.captcha-verified-${instanceId}`).forEach(element => {
            element.classList.remove(`captcha-verified-${instanceId}`);
            
            if (element.classList.contains(`protected-btn-${instanceId}`)) {
                element.disabled = true;
            }
            
            if (element.classList.contains(`protected-con-${instanceId}`)) {
                element.style.display = 'none';
            }
            
            if (element.classList.contains(`captcha-verified-indicator-${instanceId}`)) {
                element.style.display = 'none';
            }
        });
    }

    disableAllContent() {
        // Disable all protected content
        document.querySelectorAll('[class*="protected-btn-"]').forEach(btn => {
            btn.disabled = true;
        });
        
        document.querySelectorAll('[class*="protected-con-"]').forEach(content => {
            content.style.display = 'none';
        });
        
        document.querySelectorAll('[class*="captcha-verified-indicator-"]').forEach(indicator => {
            indicator.style.display = 'none';
        });
    }

    // Get all verified instances
    getVerifiedInstances() {
        return Array.from(this.verifiedInstances);
    }

    // Check if any instance is verified
    isAnyVerified() {
        return this.verifiedInstances.size > 0;
    }

    // Remove specific instance
    removeInstance(instanceId) {
        this.verifiedInstances.delete(instanceId);
        this.verificationTokens.delete(instanceId);
        this.disableInstanceContent(instanceId);
    }
}

// Initialize global instance
window.captchaVerification = new CaptchaVerification();
