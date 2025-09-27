# 🔒 CAPTCHA Widget

A lightweight, self-hosted CAPTCHA system for web projects. No external APIs required!

## Features

- 🚀 **Easy integration** - Add with one line of code
- 🔒 **Privacy-focused** - No external dependencies
- 🎨 **Customizable** - Themes and difficulty levels
- 📱 **Responsive** - Works on all devices
- ⚡ **Lightweight** - Only 5KB minified

## Quick Start

### Method 1: One-line inclusion (Easiest)
```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/captcha-widget@latest/auto-loader.js"></script>
```

Method 2: Standard inclusion (Recommended)

```html
<div id="captcha-container"></div>
<script src="https://cdn.jsdelivr.net/gh/yourusername/captcha-widget@latest/loader.js"></script>
```

Advanced Usage

Manual Initialization

```html
<div id="my-captcha"></div>
<script>
window.initCaptcha('my-captcha', {
    theme: 'dark',           // 'light' or 'dark'
    difficulty: 'medium',    // 'easy', 'medium', 'hard'
    autoVerify: true,        // Auto-enable protected content
    onSuccess: function() {
        console.log('CAPTCHA verified!');
    }
});
</script>
```

Protecting Content

Add CSS classes to protect elements:

```html
<button class="protected-btn">Protected Button</button>
<div class="protected-content">Hidden until verified</div>
```
