/**
 * Your Custom CAPTCHA - Adapted for multiple instances
 */
class CustomCaptcha {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.instanceId = containerId.replace('captcha-container-', '') || '1';
        this.isVerified = false;
        
        if (!this.container) {
            console.error('CAPTCHA container not found:', containerId);
            return;
        }
        
        this.init();
    }

    init() {
        this.createCaptcha();
        this.bindEvents();
    }

    createCaptcha() {
        // Your exact HTML structure with dynamic instance ID
        this.container.innerHTML = `
            <style>
                .fkrc-container-${this.instanceId} {
                    font-family: 'Source Sans Pro', sans-serif;
                }
                .fkrc-m-p { margin: 0; padding: 0; }
                .fkrc-block { display:block; }
                .fkrc-line-normal { line-height: normal; }
                
                .fkrc-checkbox-window-${this.instanceId} {
                    height: 74px;
                    width: 300px;
                    background-color: #f9f9f9;
                    border-radius: 3px;
                    border: 1.5px solid #d3d3d3;
                }

                .fkrc-checkbox-container-${this.instanceId} {
                    width: 28px;
                    height: 28px;
                    position: relative;
                }

                .fkrc-checkbox-${this.instanceId} {
                    position: relative;
                    background-color: #fff;
                    border-radius: 2px;
                    height: 100%;
                    width: 100%;
                    border: 2px solid #c1c1c1;
                    margin: 21px 0 0 12px;
                    outline: none;
                    font-family: Arial, Helvetica, sans-serif;
                    transition: width 500ms, height 500ms, border-radius 500ms, margin-top 500ms, margin-left 500ms, opacity 700ms;
                    cursor: pointer;
                }

                .fkrc-checkbox-${this.instanceId}:hover {
                    border: 2px solid #b2b2b2;
                }

                .fkrc-im-not-a-robot-${this.instanceId} {
                    position: relative;
                    left: 52px;
                    bottom: 2px;
                    font-size: 15px;
                    color: #282727;
                }

                .fkrc-captcha-logo-${this.instanceId} {
                    position: relative;
                    left: 246px;
                    bottom: 40px;
                    width: 33px;
                    height: 33px;
                    vertical-align: baseline;
                }

                .fkrc-checkbox-desc-${this.instanceId} {
                    color: #555555;
                    position: relative;
                    font-size: 10px;
                    text-align: center;
                    bottom: 41px;
                    left: 112px;
                }

                .fkrc-spinner-${this.instanceId} {
                    visibility: hidden;
                    position: relative;
                    height: 35px;
                    width: 35px;
                    bottom: 90px;
                    left: 9px;
                    opacity: 0;
                    transition: opacity 400ms;
                }

                .fkrc-verifywin-window-${this.instanceId} {
                    opacity: 0;
                    position: absolute;
                    visibility: hidden;
                    margin: auto;
                    width: 310px;
                    background-color: #fff;
                    border: 1px solid #cecece;
                    box-shadow: 5px 6px 7px -3px rgba(0,0,0,0.12);
                    transition: opacity 400ms;
                    z-index: 1000;
                }

                .fkrc-verifywin-window-arrow-${this.instanceId} {
                    position: absolute;
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity 200ms;
                    width: 20px;
                    height: 10px;
                    top: -10px;
                    left: 50%;
                    margin-left: -5px;
                    margin-top: 5px;
                    z-index: 10;
                    transform: rotate(-90deg);
                }

                .fkrc-verifywin-container-${this.instanceId} { padding: 8px; }
                .fkrc-verifywin-header-${this.instanceId} {
                    background-color: #5a89e1;
                    padding: 16px 16px 24px 16px;
                    color: #fff;
                    display: flex;
                }
                .fkrc-verifywin-header-text-small-${this.instanceId} { font-size: 14px; line-height: normal; }
                .fkrc-verifywin-header-text-medium-${this.instanceId} { font-size: 16px; }
                .fkrc-verifywin-header-text-big-${this.instanceId} { font-size: 24px; font-weight: 700; }
                .fkrc-verifywin-main-${this.instanceId} { padding: 5px; }
                .fkrc-verifywin-footer-${this.instanceId} {
                    border-top: 1px solid #cecece;
                    padding: 10px 7px 10px 7px;
                    color: #737373;
                    display: grid;
                    grid-template-columns: auto 102px;
                    font-size: 13px;
                }
                .fkrc-verifywin-footer-left-${this.instanceId} { padding: 5px; }
                .fkrc-verifywin-verify-button-${this.instanceId} {
                    text-transform: uppercase;
                    background-color: #5a89e2;
                    color: #fff;
                    text-align: center;
                    width: 100%;
                    padding: 12px 0 12px 0;
                    text-decoration: none;
                    font-weight: 600;
                    height: min-content;
                    border-radius: 3px;
                    font-size: 14px;
                    border: none;
                    outline: none;
                    cursor: pointer;
                }

                .img-box-${this.instanceId} { height: 70px; width: 70px; align-items: center; }
                .image-grid-${this.instanceId} {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    padding: 10px;
                }

                .captcha-image-${this.instanceId} {
                    width: 100%;
                    aspect-ratio: 1/1;
                    object-fit: cover;
                    cursor: pointer;
                    transition: transform 0.2s;
                    border: 2px solid transparent;
                    box-sizing: border-box;
                    display: block;
                }

                .captcha-image-${this.instanceId}.selected {
                    transform: scale(0.95);
                    border: 2px solid #4285f4;
                    box-shadow: 0 0 5px rgba(66, 133, 244, 0.5);
                    transition: all 0.2s ease;
                }

                .fkrc-success-tick-${this.instanceId} {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 30px;
                    height: 30px;
                    z-index: 2;
                    display: none;
                    padding-left: 30px;
                    padding-top: 40px;
                    opacity: 0;
                    transition: opacity 500ms;
                }
            </style>

            <div class="fkrc-container-${this.instanceId} fkrc-m-p">
                <div id="fkrc-checkbox-window-${this.instanceId}" class="fkrc-checkbox-window-${this.instanceId} fkrc-m-p fkrc-block">
                    <div class="fkrc-checkbox-container-${this.instanceId} fkrc-m-p">
                        <button type="button" id="fkrc-checkbox-${this.instanceId}" class="fkrc-checkbox-${this.instanceId} fkrc-m-p fkrc-line-normal"></button>
                        <img src="https://i.postimg.cc/h4m1xbQQ/Picsart-25-07-26-12-56-32-191.png" 
                             class="fkrc-success-tick-${this.instanceId}" 
                             alt="success" 
                             id="fkrc-success-tick-${this.instanceId}">
                    </div>
                    <p class="fkrc-im-not-a-robot-${this.instanceId} fkrc-m-p fkrc-line-normal">I'm not a robot</p>
                    <svg class="fkrc-captcha-logo-${this.instanceId} fkrc-line-normal" viewbox="30 15 90 90" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="m117 62.063c-2e-3 -0.60232-0.0159-1.2014-0.0429-1.7976v-33.991l-9.3971 9.3971c-7.691-9.4141-19.391-15.427-32.496-15.427-13.638 0-25.754 6.5097-33.413 16.591l15.403 15.565c1.5095-2.7917 3.6539-5.1895 6.2395-7.0005 2.6891-2.0985 6.4993-3.8143 11.77-3.8143 0.63674 0 1.1282 0.0744 1.4893 0.21458 6.5304 0.51543 12.191 4.1194 15.524 9.3503l-10.903 10.903c13.81-0.0542 29.411-0.086 35.825 7e-3" style="fill:#1c3aa9"/>
                        <path d="m74.819 20.246c-0.60232 2e-3 -1.2014 0.0159-1.7976 0.0429h-33.991l9.3971 9.3971c-9.4141 7.691-15.427 19.391-15.427 32.496 0 13.638 6.5098 25.754 16.591 33.413l15.565-15.403c-2.7917-1.5095-5.1895-3.6539-7.0005-6.2395-2.0984-2.6891-3.8143-6.4993-3.8143-11.77 0-0.63674 0.0744-1.1282 0.21458-1.4893 0.51543-6.5304 4.1194-12.191 9.3503-15.524l10.903 10.903c-0.0542-13.81-0.0861-29.411 7e-3 -35.825" style="fill:#4285f4"/>
                        <path d="m33.002 62.181c2e-3 0.60232 0.0159 1.2014 0.0429 1.7976v33.991l9.3971-9.3971c7.691 9.4141 19.391 15.427 32.496 15.427 13.638 0 25.754-6.5097 33.413-16.591l-15.403-15.565c-1.5095 2.7917-3.6539 5.1895-6.2395 7.0005-2.6891 2.0985-6.4993 3.8143-11.77 3.8143-0.63674 0-1.1282-0.0744-1.4893-0.21458-6.5304-0.51543-12.191-4.1194-15.524-9.3503l10.903-10.903c-13.81 0.0542-29.411 0.086-35.825-7e-3" style="fill:#ababab"/>
                    </svg>
                    <p class="fkrc-checkbox-desc-${this.instanceId} fkrc-m-p fkrc-line-normal capca">reCAPTCHA</p>
                    <p class="fkrc-checkbox-desc-${this.instanceId} fkrc-m-p fkrc-line-normal"><small>Privacy - Terms</small></p>
                    <img src="https://raw.githubusercontent.com/75a/fake-captcha/refs/heads/main/images/captcha_spinner.gif" 
                         class="fkrc-spinner-${this.instanceId} fkrc-m-p fkrc-line-normal" 
                         alt="" 
                         id="fkrc-spinner-${this.instanceId}">
                </div>

                <div id="fkrc-verifywin-window-${this.instanceId}" class="fkrc-verifywin-window-${this.instanceId}">
                    <div class="fkrc-verifywin-container-${this.instanceId}">
                        <header class="fkrc-verifywin-header-${this.instanceId}">
                            <div>
                                <span class="fkrc-verifywin-header-text-medium-${this.instanceId} fkrc-m-p fkrc-block">Select all the images</span>
                                <span class="fkrc-verifywin-header-text-big-${this.instanceId} fkrc-m-p fkrc-block">Which can be fit into</span>
                                <span class="fkrc-verifywin-header-text-medium-${this.instanceId} fkrc-m-p fkrc-block">The box.</span>
                            </div>
                            <div><img src="https://i.postimg.cc/hP8RndLD/download.jpg" alt="" class="img-box-${this.instanceId}"></div>
                        </header>
                        <main class="fkrc-verifywin-main-${this.instanceId}">
                            <div class="image-grid-${this.instanceId}" style="position:relative;">
                                <img src="https://i.postimg.cc/tJ08Qq7n/download-1.jpg" alt="Bird" class="captcha-image-${this.instanceId}">
                                <img src="https://i.postimg.cc/7LFKbB4p/download-2.jpg" alt="Plane" class="captcha-image-${this.instanceId}">
                                <img src="https://i.postimg.cc/hvgM1ffs/download-3.jpg" alt="Bottle" class="captcha-image-${this.instanceId}">
                                <img src="https://i.postimg.cc/kgkQyBHS/download-4.jpg" alt="Clock" class="captcha-image-${this.instanceId}">
                                <img src="https://i.postimg.cc/2yhyrSws/download-5.jpg" alt="Palm fruit" class="captcha-image-${this.instanceId}">
                                <img src="https://i.postimg.cc/90tFCdgn/download.jpg" alt="Sea" class="captcha-image-${this.instanceId}">
                                <img src="https://i.postimg.cc/9XZQ4zdS/images-1.jpg" alt="Coconut tree" class="captcha-image-${this.instanceId}">
                                <img src="https://i.postimg.cc/qvbJfKrt/download-6.jpg" alt="Monkey" class="captcha-image-${this.instanceId}">
                                <img src="https://i.postimg.cc/dQ2Jspvc/download-7.jpg" alt="Mars" class="captcha-image-${this.instanceId}">
                            </div>
                        </main>
                    </div>
                    <footer class="fkrc-verifywin-container-${this.instanceId} fkrc-verifywin-footer-${this.instanceId}">
                        <div class="fkrc-verifywin-footer-left-${this.instanceId}">Press the verify button to proceed.</div>
                        <button type="button" class="fkrc-verifywin-verify-button-${this.instanceId} fkrc-block" id="fkrc-verifywin-verify-button-${this.instanceId}">Verify</button>
                    </footer>
                </div>

                <svg id="fkrc-verifywin-window-arrow-${this.instanceId}" class="fkrc-verifywin-window-arrow-${this.instanceId}" 
                     xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="0 0 20 10">
                    <path d="M0 10 L10 0 L20 10" fill="#fff" stroke="#cecece" stroke-width="1"/>
                </svg>
            </div>
        `;
    }

    bindEvents() {
        // Wait for DOM to be ready
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }

    setupEventListeners() {
        const instanceId = this.instanceId;
        
        // Get elements for this instance
        const checkboxBtn = document.getElementById(`fkrc-checkbox-${instanceId}`);
        const verifyBtn = document.getElementById(`fkrc-verifywin-verify-button-${instanceId}`);
        const verifyWindow = document.getElementById(`fkrc-verifywin-window-${instanceId}`);
        const successTick = document.getElementById(`fkrc-success-tick-${instanceId}`);

        if (!checkboxBtn || !verifyBtn) return;

        // Your existing event logic adapted for this instance
        document.addEventListener("click", (event) => {
            if (this.isVerifyWindowVisible(instanceId)) {
                if (!verifyWindow.contains(event.target) && 
                    event.target !== checkboxBtn && 
                    !checkboxBtn.contains(event.target)) {
                    this.closeVerifyWindow(instanceId);
                }
            }
        });

        verifyBtn.addEventListener("click", (event) => {
            event.preventDefault();
            verifyBtn.disabled = true;
            this.verifyCaptcha(instanceId);
        });

        checkboxBtn.addEventListener("click", (event) => {
            event.preventDefault();
            checkboxBtn.disabled = true;
            this.runClickedCheckboxEffects(instanceId);
        });

        // Image click handlers
        const images = document.querySelectorAll(`.captcha-image-${instanceId}`);
        images.forEach(img => {
            img.addEventListener('click', () => {
                img.classList.toggle('selected');
                if (img.classList.contains('selected')) {
                    img.style.transform = 'scale(0.85)';
                    img.style.border = '2px solid #4285f4';
                } else {
                    img.style.transform = '';
                    img.style.border = '';
                }
            });
        });
    }

    // Your existing functions adapted for multiple instances
    verifyCaptcha(instanceId) {
        const selectedImages = document.querySelectorAll(`.captcha-image-${instanceId}.selected`);
        const requiredImages = ['Bottle', 'Palm fruit', 'Clock', 'Bird'];
        let correctSelections = 0;
        let wrongSelections = false;

        selectedImages.forEach(img => {
            if (requiredImages.includes(img.alt)) {
                correctSelections++;
            } else {
                wrongSelections = true;
            }
        });

        if (correctSelections === 4 && !wrongSelections) {
            // Success
            const checkboxBtn = document.getElementById(`fkrc-checkbox-${instanceId}`);
            const spinner = document.getElementById(`fkrc-spinner-${instanceId}`);
            const successTick = document.getElementById(`fkrc-success-tick-${instanceId}`);
            const verifyWindow = document.getElementById(`fkrc-verifywin-window-${instanceId}`);

            checkboxBtn.style.display = 'none';
            spinner.style.display = 'none';
            successTick.style.display = 'block';
            successTick.style.opacity = '1';
            
            verifyWindow.style.display = "none";
            verifyWindow.style.visibility = "hidden";
            verifyWindow.style.opacity = "0";
            
            this.resetImageSelections(instanceId);
            this.isVerified = true;
            
            // IMPORTANT: Notify the verification system
            if (window.captchaVerification) {
                window.captchaVerification.markAsVerified(instanceId);
            }
            
            setTimeout(() => { 
                if (this.options.onSuccess) this.options.onSuccess();
            }, 50);
        } else {
            // Failure
            this.resetImageSelections(instanceId);
            alert("Error: Please select ONLY the bottle, palm fruit, clock and bird.");
            this.closeVerifyWindow(instanceId);
        }
    }

    resetImageSelections(instanceId) {
        document.querySelectorAll(`.captcha-image-${instanceId}`).forEach(img => {
            img.classList.remove('selected');
            img.style.transform = '';
            img.style.border = '';
            img.style.boxShadow = '';
        });
    }

    runClickedCheckboxEffects(instanceId) {
        this.hideCaptchaCheckbox(instanceId);
        setTimeout(() => { this.showCaptchaLoading(instanceId); }, 500);
        setTimeout(() => { this.showVerifyWindow(instanceId); }, 900);
    }

    hideCaptchaCheckbox(instanceId) {
        const checkboxBtn = document.getElementById(`fkrc-checkbox-${instanceId}`);
        if (checkboxBtn) {
            checkboxBtn.style.width = "4px";
            checkboxBtn.style.height = "4px";
            checkboxBtn.style.borderRadius = "50%";
            checkboxBtn.style.marginLeft = "25px";
            checkboxBtn.style.marginTop = "33px";
            checkboxBtn.style.opacity = "0";
        }
    }

    showCaptchaLoading(instanceId) {
        const spinner = document.getElementById(`fkrc-spinner-${instanceId}`);
        if (spinner) {
            spinner.style.visibility = "visible";
            spinner.style.opacity = "1";
        }
    }

    showVerifyWindow(instanceId) {
        const verifyWindow = document.getElementById(`fkrc-verifywin-window-${instanceId}`);
        const checkboxWindow = document.getElementById(`fkrc-checkbox-window-${instanceId}`);
        const arrow = document.getElementById(`fkrc-verifywin-window-arrow-${instanceId}`);

        if (!verifyWindow || !checkboxWindow) return;

        verifyWindow.style.display = "block";
        verifyWindow.style.visibility = "visible";
        verifyWindow.style.opacity = "1";
        verifyWindow.style.top = (checkboxWindow.offsetTop - 80) + "px";
        verifyWindow.style.left = (checkboxWindow.offsetLeft + 54) + "px";

        this.randomizeImages(instanceId);

        if (verifyWindow.offsetTop < 5) {
            verifyWindow.style.top = "5px";
        }

        if (verifyWindow.offsetLeft + verifyWindow.offsetWidth > window.innerWidth - 10) {
            verifyWindow.style.left = (checkboxWindow.offsetLeft - 8) + "px";
        } else {
            arrow.style.top = (checkboxWindow.offsetTop + 24) + "px";
            arrow.style.left = (checkboxWindow.offsetLeft + 45) + "px";
            arrow.style.visibility = "visible";
            arrow.style.opacity = "1";
        }
    }

    closeVerifyWindow(instanceId) {
        const successTick = document.getElementById(`fkrc-success-tick-${instanceId}`);
        if (successTick.style.display !== 'block') {
            const verifyWindow = document.getElementById(`fkrc-verifywin-window-${instanceId}`);
            const arrow = document.getElementById(`fkrc-verifywin-window-arrow-${instanceId}`);
            const checkboxBtn = document.getElementById(`fkrc-checkbox-${instanceId}`);
            const spinner = document.getElementById(`fkrc-spinner-${instanceId}`);
            const verifyBtn = document.getElementById(`fkrc-verifywin-verify-button-${instanceId}`);

            if (verifyWindow) {
                verifyWindow.style.display = "none";
                verifyWindow.style.visibility = "hidden";
                verifyWindow.style.opacity = "0";
            }
            
            if (arrow) {
                arrow.style.visibility = "hidden";
                arrow.style.opacity = "0";
            }
            
            if (spinner) {
                spinner.style.visibility = "hidden";
                spinner.style.opacity = "0";
            }
            
            this.showCaptchaCheckbox(instanceId);
            
            if (checkboxBtn) checkboxBtn.disabled = false;
            if (verifyBtn) verifyBtn.disabled = false;

            this.resetImageSelections(instanceId);
        }
    }

    showCaptchaCheckbox(instanceId) {
        const checkboxBtn = document.getElementById(`fkrc-checkbox-${instanceId}`);
        if (checkboxBtn) {
            checkboxBtn.style.width = "28px";
            checkboxBtn.style.height = "28px";
            checkboxBtn.style.borderRadius = "2px";
            checkboxBtn.style.margin = "21px 0 0 12px";
            checkboxBtn.style.opacity = "1";
            checkboxBtn.style.display = "block";
        }
    }

    isVerifyWindowVisible(instanceId) {
        const verifyWindow = document.getElementById(`fkrc-verifywin-window-${instanceId}`);
        return verifyWindow && verifyWindow.style.display !== "none" && verifyWindow.style.display !== "";
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    randomizeImages(instanceId) {
        const imageGrid = document.querySelector(`.image-grid-${instanceId}`);
        if (!imageGrid) return;
        
        const images = Array.from(imageGrid.children);
        this.shuffleArray(images);
        imageGrid.innerHTML = '';
        images.forEach(img => imageGrid.appendChild(img));
        
        // Re-bind image click events
        const newImages = document.querySelectorAll(`.captcha-image-${instanceId}`);
        newImages.forEach(img => {
            img.addEventListener('click', () => {
                img.classList.toggle('selected');
                if (img.classList.contains('selected')) {
                    img.style.transform = 'scale(0.85)';
                    img.style.border = '2px solid #4285f4';
                } else {
                    img.style.transform = '';
                    img.style.border = '';
                }
            });
        });
    }

    // Public methods
    getVerificationStatus() {
        return this.isVerified;
    }

    reset() {
        this.isVerified = false;
        this.closeVerifyWindow(this.instanceId);
        this.showCaptchaCheckbox(this.instanceId);
        
        const successTick = document.getElementById(`fkrc-success-tick-${this.instanceId}`);
        const spinner = document.getElementById(`fkrc-spinner-${this.instanceId}`);
        const checkboxBtn = document.getElementById(`fkrc-checkbox-${this.instanceId}`);
        
        if (successTick) {
            successTick.style.display = 'none';
            successTick.style.opacity = '0';
        }
        if (spinner) spinner.style.display = '';
        if (checkboxBtn) {
            checkboxBtn.style.display = 'block';
            checkboxBtn.disabled = false;
        }
    }
}

// Global initialization function
window.initCaptcha = function(containerId, options) {
    return new CustomCaptcha(containerId, options);
};
