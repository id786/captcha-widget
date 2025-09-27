🔒 CAPTCHA Widget

A lightweight, self-hosted CAPTCHA system for web projects. No external APIs required! Easily protect your content with a simple one-line inclusion.

✨ Features

· 🚀 Easy integration - Add with one line of code
· 🔒 Privacy-focused - No external dependencies
· 🎨 Customizable - Themes and difficulty levels
· 📱 Responsive - Works on all devices
· ⚡ Lightweight - Only 5KB minified
· 🎯 Auto-protection - Automatically locks/unlocks content
· 💾 Session persistence - Remembers verification across page reloads
· ♿ Accessible - Screen reader and keyboard friendly

🚀 Quick Start

Method 1: One-line inclusion (Easiest)

```html
<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/auto-loader.js"></script>
```

Method 2: Standard inclusion (Recommended)

```html
<div id="captcha-container"></div>
<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/loader.js"></script>
```

Method 3: Manual initialization (Advanced)

```html
<div id="my-captcha"></div>
<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/captcha-verification.js"></script>
<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/captcha-widget.js"></script>
<script>
    window.initCaptcha('my-captcha', {
        theme: 'dark',
        difficulty: 'medium'
    });
</script>
```

🎨 Customization

Theme Options

```html
<div id="captcha-container" data-theme="dark"></div>
<!-- or -->
<script>
window.initCaptcha('captcha-container', {
    theme: 'light' // 'light' or 'dark'
});
</script>
```

Difficulty Levels

```html
<div id="captcha-container" data-difficulty="hard"></div>
<!-- or -->
<script>
window.initCaptcha('captcha-container', {
    difficulty: 'easy' // 'easy' (4 chars), 'medium' (5 chars), 'hard' (6 chars)
});
</script>
```

Custom Text

```html
<script>
window.initCaptcha('captcha-container', {
    customText: 'ABCD12' // Fixed CAPTCHA text
});
</script>
```

🔒 Protecting Content

Protect Buttons

```html
<button class="protected-btn" onclick="sensitiveAction()">
    Sensitive Action
</button>

<a href="#secure" class="protected-btn">Secure Link</a>
```

Protect Content Sections

```html
<div class="protected-content">
    <h3>Premium Content</h3>
    <p>This is only visible after CAPTCHA verification.</p>
</div>
```

Show Verification Badges

```html
<span class="captcha-verified-indicator">✅ Verified</span>
```

⚙️ Advanced Configuration

Complete Options Example

```html
<script>
window.initCaptcha('captcha-container', {
    // Appearance
    theme: 'dark',           // 'light' or 'dark'
    difficulty: 'hard',      // 'easy', 'medium', 'hard'
    
    // Behavior
    autoVerify: true,        // Auto-enable protected content
    customText: null,        // Fixed CAPTCHA text
    
    // Callbacks
    onSuccess: function(captchaText) {
        console.log('Success! Text was:', captchaText);
        // Custom success logic
    },
    
    onError: function() {
        console.log('Verification failed');
        // Custom error handling
    }
});
</script>
```

📡 Event System

Listen for Verification

```javascript
document.addEventListener('captchaVerified', function(event) {
    console.log('User verified!', event.detail);
    // event.detail contains: { token: 'string', timestamp: number }
});
```

Custom Callbacks

```javascript
window.initCaptcha('captcha-container', {
    onSuccess: function(captchaText) {
        // Custom actions after verification
        enablePremiumFeatures();
    },
    onError: function() {
        // Handle failed attempts
        showWarningMessage();
    }
});
```

🔧 API Reference

Verification Methods

```javascript
// Check if user is verified
if (window.captchaVerification.getVerificationStatus()) {
    proceedWithAction();
}

// Get verification token
const token = window.captchaVerification.getVerificationToken();

// Reset verification (logout)
window.captchaVerification.resetVerification();

// Manual verification (when autoVerify: false)
window.captchaVerification.markAsVerified();
```

CAPTCHA Instance Methods

```javascript
const captcha = window.initCaptcha('container-id');

// Refresh CAPTCHA
captcha.refresh();

// Check verification status
captcha.getVerificationStatus();

// Reset CAPTCHA
captcha.reset();
```

🎯 Real-World Examples

Login Form Protection

```html
<form id="loginForm">
    <input type="email" placeholder="Email" required>
    <input type="password" placeholder="Password" required>
    
    <div id="captcha-container"></div>
    
    <button type="submit" class="protected-btn">Login</button>
</form>

<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/loader.js"></script>
<script>
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (window.captchaVerification.getVerificationStatus()) {
            performLogin();
        } else {
            alert('Please complete CAPTCHA verification');
        }
    });
</script>
```

Download Protection

```html
<div id="captcha-container"></div>

<a href="secure-file.pdf" class="protected-btn" download>
    Download Secure File
</a>

<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/loader.js"></script>
<script>
    document.querySelector('a.protected-btn').addEventListener('click', function(e) {
        if (!window.captchaVerification.getVerificationStatus()) {
            e.preventDefault();
            alert('Please complete CAPTCHA verification first.');
        }
    });
</script>
```

Multi-CAPTCHA Page

```html
<!-- Section 1 -->
<div id="captcha-login" data-theme="light"></div>
<button class="protected-btn" data-section="login">Login</button>

<!-- Section 2 -->
<div id="captcha-download" data-theme="dark" data-difficulty="hard"></div>
<button class="protected-btn" data-section="download">Download</button>

<script>
    // Initialize multiple CAPTCHAs
    window.initCaptcha('captcha-login');
    window.initCaptcha('captcha-download');
</script>
```

🌐 CDN URLs

Primary CDN (Recommended)

```html
https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/
```

GitHub Pages (Alternative)

```html
https://id786.github.io/captcha-widget/
```

Individual Files

```html
<!-- Loader -->
<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/loader.js"></script>

<!-- Auto-loader -->
<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/auto-loader.js"></script>

<!-- Core files -->
<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/captcha-widget.js"></script>
<script src="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/captcha-verification.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/id786/captcha-widget@latest/styles.css">
```
