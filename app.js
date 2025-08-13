// Memory Cassette App - Clean Version
class MemoryCassette {
    constructor() {
        this.thoughtInput = document.getElementById('thoughtInput');
        this.resultDisplay = document.getElementById('resultDisplay');
        this.startFreshBtn = document.getElementById('startFreshBtn');
        this.trackName = document.getElementById('trackName');
        this.leftReel = document.getElementById('leftReel');
        this.rightReel = document.getElementById('rightReel');
        this.dumpBtn = document.getElementById('dumpBtn');

        this.isPlaying = false;
        this.archiveMode = false;
        // Mood functionality removed

        // Initialize archive system
        this.archive = new MemoryArchive();

        this.init();
    }

    init() {
        console.log('MemoryCassette init() called');
        console.log('Elements found:');
        console.log('- thoughtInput:', this.thoughtInput);
        console.log('- dumpBtn:', this.dumpBtn);
        console.log('- trackName:', this.trackName);

        this.bindEvents();
        this.bindNavigation();
        this.updateArchiveCount();
        this.initializeThemeOnLoad();
        this.checkFirstVisit();
    }

    checkFirstVisit() {
        const hasVisited = localStorage.getItem('memory-cassette-visited');
        if (!hasVisited) {
            setTimeout(() => {
                this.showOnboarding();
            }, 1000);
        }
    }

    showOnboarding() {
        const onboardingHTML = `
            <div class="onboarding-overlay" id="onboardingOverlay">
                <div class="onboarding-content">
                    <div class="onboarding-header">
                        <h2>Welcome to Memory Cassette</h2>
                        <p>Your personal emotional processing system</p>
                    </div>
                    
                    <div class="onboarding-steps">
                        <div class="onboarding-step active" data-step="1">
                            <div class="step-icon">📝</div>
                            <h3>Write Your Thoughts</h3>
                            <p>Type anything that's on your mind - worries, frustrations, or difficult emotions. This is your safe space.</p>
                        </div>
                        
                        <div class="onboarding-step" data-step="2">
                            <div class="step-icon">🎭</div>
                            <h3>Choose Your Mood</h3>
                            <p>Select how you're feeling to help organize your emotional journey over time.</p>
                        </div>
                        
                        <div class="onboarding-step" data-step="3">
                            <div class="step-icon">�</ddiv>
                            <h3>Archive or Release</h3>
                            <p>Toggle the archive button to save memories for reflection, or leave it off for temporary processing.</p>
                        </div>
                        
                        <div class="onboarding-step" data-step="4">
                            <div class="step-icon">✨</div>
                            <h3>Simple & Clean</h3>
                            <p>Your thoughts are processed simply and cleanly. Focus on what matters - your emotional well-being.</p>
                        </div>
                    </div>
                    
                    <div class="onboarding-navigation">
                        <button class="onboarding-btn prev" id="onboardingPrev" disabled>Previous</button>
                        <div class="step-indicators">
                            <span class="step-dot active" data-step="1"></span>
                            <span class="step-dot" data-step="2"></span>
                            <span class="step-dot" data-step="3"></span>
                            <span class="step-dot" data-step="4"></span>
                        </div>
                        <button class="onboarding-btn next" id="onboardingNext">Next</button>
                    </div>
                    
                    <div class="onboarding-footer">
                        <button class="onboarding-skip" id="onboardingSkip">Skip Tour</button>
                        <div class="privacy-note">
                            🔒 Your thoughts stay private - nothing is sent to servers
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', onboardingHTML);
        this.bindOnboardingEvents();
    }

    bindOnboardingEvents() {
        const overlay = document.getElementById('onboardingOverlay');
        const prevBtn = document.getElementById('onboardingPrev');
        const nextBtn = document.getElementById('onboardingNext');
        const skipBtn = document.getElementById('onboardingSkip');

        let currentStep = 1;
        const totalSteps = 4;

        const updateStep = (step) => {
            // Update step visibility
            document.querySelectorAll('.onboarding-step').forEach(stepEl => {
                stepEl.classList.remove('active');
                if (parseInt(stepEl.dataset.step) === step) {
                    stepEl.classList.add('active');
                }
            });

            // Update step indicators
            document.querySelectorAll('.step-dot').forEach(dot => {
                dot.classList.remove('active');
                if (parseInt(dot.dataset.step) === step) {
                    dot.classList.add('active');
                }
            });

            // Update button states
            prevBtn.disabled = step === 1;
            nextBtn.textContent = step === totalSteps ? 'Get Started' : 'Next';
        };

        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStep(currentStep);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStep(currentStep);
            } else {
                this.completeOnboarding();
            }
        });

        skipBtn.addEventListener('click', () => {
            this.completeOnboarding();
        });
    }

    completeOnboarding() {
        const overlay = document.getElementById('onboardingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }

        // Mark as visited
        localStorage.setItem('memory-cassette-visited', 'true');

        // Show welcome message
        this.trackName.textContent = 'Welcome! Ready to begin';
        setTimeout(() => {
            this.trackName.textContent = 'Ready';
        }, 3000);
    }

    initializeThemeOnLoad() {
        // Remove any dark mode classes that might interfere with themes
        document.body.classList.remove('dark-mode');

        // Initialize theme manager and apply saved theme
        this.themeManager = new ThemeManager();
        const savedTheme = this.themeManager.getCurrentTheme();

        // Apply theme with smooth transition
        setTimeout(() => {
            this.themeManager.applyTheme(savedTheme, false);
            this.addThemeParticles();
        }, 500);
    }

    addThemeParticles() {
        // Add subtle particle effects based on current theme
        const particleContainer = document.createElement('div');
        particleContainer.className = 'theme-particles';
        particleContainer.innerHTML = `
            <div class="particle-effect particle-1"></div>
            <div class="particle-effect particle-2"></div>
            <div class="particle-effect particle-3"></div>
        `;

        document.body.appendChild(particleContainer);

        // Position particles randomly
        const particles = particleContainer.querySelectorAll('.particle-effect');
        particles.forEach((particle, index) => {
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${index * 2}s`;
        });
    }

    bindEvents() {
        console.log('bindEvents() called');

        // Dump button click
        if (this.dumpBtn) {
            console.log('Adding dump button event listener');
            this.dumpBtn.addEventListener('click', () => {
                console.log('Dump button clicked!');
                this.handleDump();
            });
        } else {
            console.log('Dump button not found!');
        }

        // Archive toggle
        const archiveToggle = document.getElementById('archiveToggle');
        if (archiveToggle) {
            archiveToggle.addEventListener('click', () => {
                this.toggleArchiveMode();
            });
        }

        // Input focus effects
        if (this.thoughtInput) {
            this.thoughtInput.addEventListener('focus', () => {
                this.trackName.textContent = 'RECORDING...';
                this.startReelAnimation();
                // Mood selector removed
            });

            this.thoughtInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!document.activeElement.closest('.mood-selector')) {
                        this.trackName.textContent = 'Ready';
                        this.stopReelAnimation();
                    }
                }, 100);
            });
        }

        // Eject button
        if (this.startFreshBtn) {
            this.startFreshBtn.addEventListener('click', () => {
                this.ejectTape();
            });
        }

        // Mood selector removed

        // Therapeutic technique buttons removed
    }

    bindNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');

        console.log('Navigation binding - found nav items:', navItems.length);
        console.log('Navigation binding - found content sections:', contentSections.length);

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.dataset.section;
                console.log('Navigation clicked:', targetSection);

                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Show target section
                contentSections.forEach(section => section.classList.remove('active'));
                const targetElement = document.getElementById(targetSection + 'Section');
                if (targetElement) {
                    targetElement.classList.add('active');
                    console.log('Activated section:', targetSection + 'Section');
                } else {
                    console.log('Target element not found:', targetSection + 'Section');
                }

                // Load section-specific content
                console.log('Loading section content for:', targetSection);
                this.loadSectionContent(targetSection);
            });
        });
    }

    loadSectionContent(section) {
        switch (section) {
            case 'archive':
                this.loadArchiveContent();
                break;
            case 'moods':
                this.loadMoodsContent();
                break;
            case 'themes':
                this.loadThemesContent();
                break;
            case 'home':
            default:
                // Home section is always loaded
                break;
        }
    }

    loadThemesContent() {
        // Initialize theme system
        this.initializeThemeSystem();

        // Bind theme events
        this.bindThemeEvents();

        // Load current theme settings
        this.loadCurrentTheme();
    }

    initializeThemeSystem() {
        // Initialize theme manager
        this.themeManager = new ThemeManager();

        // Set up theme state
        this.currentTheme = this.themeManager.getCurrentTheme();
        this.previewMode = false;

        console.log('Theme system initialized. Current theme:', this.currentTheme);
    }

    bindThemeEvents() {
        // Theme row selection (compact table format)
        const themeRows = document.querySelectorAll('.theme-row');
        const themeRadios = document.querySelectorAll('input[name="theme-selection"]');

        themeRows.forEach(row => {
            row.addEventListener('click', (e) => {
                // Don't trigger if clicking on radio button directly
                if (e.target.type !== 'radio') {
                    const theme = row.dataset.theme;
                    const radio = row.querySelector('input[type="radio"]');
                    if (radio) {
                        radio.checked = true;
                        this.selectTheme(theme, row);
                    }
                }
            });
        });

        themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const theme = e.target.value;
                    const row = e.target.closest('.theme-row');
                    this.selectTheme(theme, row);
                }
            });
        });

        // No action buttons needed - themes apply instantly

        // No theme settings needed - themes apply instantly
    }

    // Theme settings removed - themes apply instantly

    selectTheme(themeName, rowElement) {
        // Update UI selection for theme rows
        document.querySelectorAll('.theme-row').forEach(row => {
            row.classList.remove('active');
        });
        rowElement.classList.add('active');

        // Update radio button
        const radio = rowElement.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }

        // Store selected theme
        this.selectedTheme = themeName;
        this.currentTheme = themeName;

        // Apply theme immediately
        this.themeManager.applyTheme(themeName, false);
        this.themeManager.saveTheme(themeName);

        // Animate selection
        if (typeof gsap !== 'undefined') {
            gsap.to(rowElement, {
                duration: 0.2,
                scale: 1.01,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        }

        // Show theme selection feedback
        this.showThemeSelectionFeedback(themeName);

        console.log('Theme applied:', themeName);
    }

    showThemeSelectionFeedback(themeName) {
        const themeNames = {
            'vintage': 'Vintage Newsletter',
            'warm-paper': 'Warm Paper',
            'dusty-teal': 'Dusty Teal',
            'typewriter': 'Typewriter',
            'classic-sepia': 'Classic Sepia'
        };

        const feedback = document.createElement('div');
        feedback.className = 'theme-selection-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-icon">🎨</span>
                <span class="feedback-text">${themeNames[themeName]} selected</span>
            </div>
        `;

        const themesContent = document.querySelector('.themes-content');
        if (themesContent) {
            themesContent.appendChild(feedback);

            // Animate in and out
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(feedback,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        onComplete: () => {
                            setTimeout(() => {
                                gsap.to(feedback, {
                                    opacity: 0,
                                    y: -20,
                                    duration: 0.3,
                                    onComplete: () => feedback.remove()
                                });
                            }, 2000);
                        }
                    }
                );
            } else {
                setTimeout(() => feedback.remove(), 3000);
            }
        }
    }

    // Theme methods removed - themes now apply instantly on selection

    loadCurrentTheme() {
        const currentTheme = this.themeManager.getCurrentTheme();
        const settings = this.themeManager.getSettings();

        // Update theme row selection and radio buttons
        document.querySelectorAll('.theme-row').forEach(row => {
            row.classList.remove('active');
            const radio = row.querySelector('input[type="radio"]');
            if (row.dataset.theme === currentTheme) {
                row.classList.add('active');
                if (radio) radio.checked = true;
            } else {
                if (radio) radio.checked = false;
            }
        });

        // Settings UI removed - themes apply instantly
    }

    getThemeDisplayName(themeName) {
        const themeNames = {
            'vintage': 'Vintage Newsletter',
            'warm-paper': 'Warm Paper',
            'dusty-teal': 'Dusty Teal',
            'typewriter': 'Typewriter',
            'classic-sepia': 'Classic Sepia'
        };
        return themeNames[themeName] || themeName;
    }

    showThemeMessage(message) {
        // Create temporary message
        const messageEl = document.createElement('div');
        messageEl.className = 'theme-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--cassette-border);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-family: 'Times New Roman', serif;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(messageEl);

        // Animate in and out
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(messageEl,
                { opacity: 0, x: 100 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to(messageEl, {
                                opacity: 0,
                                x: 100,
                                duration: 0.3,
                                onComplete: () => messageEl.remove()
                            });
                        }, 3000);
                    }
                }
            );
        } else {
            setTimeout(() => messageEl.remove(), 4000);
        }
    }



    handleDump() {
        console.log('handleDump called!');
        const thoughtText = this.thoughtInput.value.trim();
        console.log('Thought text:', thoughtText);

        if (!thoughtText) {
            console.log('No text entered, showing message');
            this.showMessage('Please write something first...');
            return;
        }

        // Button animation
        if (typeof gsap !== 'undefined') {
            gsap.to(this.dumpBtn, {
                duration: 0.1,
                scale: 0.95,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        }

        // Start reel animation
        this.startReelAnimation();
        this.trackName.textContent = 'PROCESSING...';

        // Process the memory
        setTimeout(() => {
            this.processMemory(thoughtText);
        }, 1000);
    }

    processMemory(content) {
        let saved = false;
        let memory = null;

        // Check for crisis indicators
        if (this.detectCrisisLanguage(content)) {
            this.showCrisisSupport();
            return;
        }

        if (this.archiveMode) {
            // Create and save memory to archive with mood
            console.log('Archive mode is ON, saving memory');
            const selectedMood = this.selectedMemoryMood || null;
            memory = this.archive.createMemory(content, 'dump', selectedMood);
            console.log('Created memory:', memory);
            saved = this.archive.saveMemory(memory);
            console.log('Save result:', saved);

            // Also record mood in constellation if selected
            if (selectedMood && this.selectedMemoryMoodValue) {
                this.recordMoodFromMemory(selectedMood, this.selectedMemoryMoodValue);
            }
        } else {
            console.log('Archive mode is OFF, not saving');
        }

        // Show result
        this.showDumpResult(content, saved, memory);

        // Update archive count if saved
        if (saved) {
            this.updateArchiveCount();
        }

        // Mood functionality removed
    }

    detectCrisisLanguage(content) {
        const crisisKeywords = [
            'suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself',
            'self harm', 'cutting', 'overdose', 'jump off', 'hang myself',
            'no point living', 'better off dead', 'can\'t go on'
        ];

        const lowerContent = content.toLowerCase();
        return crisisKeywords.some(keyword => lowerContent.includes(keyword));
    }

    showCrisisSupport() {
        this.resultDisplay.innerHTML = `
            <div class="result-content crisis-support">
                <h3 class="result-title">🤗 You're Not Alone</h3>
                <p class="crisis-message">
                    It sounds like you're going through a really difficult time. 
                    Your feelings are valid, and there are people who want to help.
                </p>
                <div class="crisis-resources">
                    <h4>Immediate Support:</h4>
                    <div class="resource-item">
                        <strong>Crisis Text Line:</strong> Text HOME to 741741
                    </div>
                    <div class="resource-item">
                        <strong>National Suicide Prevention Lifeline:</strong> 988
                    </div>
                    <div class="resource-item">
                        <strong>International:</strong> befrienders.org
                    </div>
                </div>
                <div class="crisis-affirmation">
                    You matter. Your life has value. This pain is temporary, but you are not alone.
                </div>
                <div class="crisis-actions">
                    <button class="crisis-btn" onclick="window.open('https://suicidepreventionlifeline.org', '_blank')">
                        Get Help Now
                    </button>
                    <button class="crisis-btn secondary" onclick="this.closest('.result-display').classList.remove('active')">
                        Continue Safely
                    </button>
                </div>
            </div>
        `;

        this.resultDisplay.className = 'result-display active crisis-mode';

        // Stop reel animation and update status
        this.stopReelAnimation();
        this.trackName.textContent = 'Support Available';
    }

    showDumpResult(content, saved, memory) {
        const resultTitle = saved ? 'MEMORY ARCHIVED' : 'MEMORY PROCESSED';
        const resultMessage = saved
            ? 'Your thoughts have been safely stored in the archive. You can revisit them anytime.'
            : 'Your thoughts have been processed and released. The memory is cleared.';

        this.resultDisplay.innerHTML = `
            <div class="result-overlay">
                <div class="result-modal">
                    <div class="result-header">
                        <h3 class="result-title">${resultTitle}</h3>
                        <button class="result-close" onclick="this.closest('.result-display').classList.remove('active')">×</button>
                    </div>
                    <div class="result-body">
                        <p class="result-message">${resultMessage}</p>
                        <div class="user-thought">"${content}"</div>
                        ${saved ? `<div class="archive-info">
                            <span class="archive-date">${memory.dateCreated}</span>
                            <span class="archive-id">ID: ${memory.id.slice(-6)}</span>
                        </div>` : ''}
                        <div class="result-affirmation">Your thoughts matter. You are heard.</div>
                    </div>
                    <div class="result-actions">
                        <button class="result-btn" onclick="this.closest('.result-display').classList.remove('active')">
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Show result display as modal
        this.resultDisplay.className = 'result-display active modal-style';

        // Animate result appearance
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.result-modal',
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        }

        // Clear input
        this.clearInput();

        // Stop reel animation
        setTimeout(() => {
            this.stopReelAnimation();
            this.trackName.textContent = 'Ready';
        }, 2000);

        // Auto-close after 8 seconds
        setTimeout(() => {
            if (this.resultDisplay.classList.contains('active')) {
                this.resultDisplay.classList.remove('active');
            }
        }, 8000);
    }

    clearInput() {
        if (typeof gsap !== 'undefined') {
            gsap.to(this.thoughtInput, {
                duration: 0.5,
                opacity: 0.3,
                onComplete: () => {
                    this.thoughtInput.value = '';
                    this.thoughtInput.placeholder = 'Memory processed...';
                    gsap.to(this.thoughtInput, {
                        duration: 0.5,
                        opacity: 1,
                        onComplete: () => {
                            setTimeout(() => {
                                this.thoughtInput.placeholder = 'Type your thoughts here...';
                            }, 2000);
                        }
                    });
                }
            });
        } else {
            this.thoughtInput.value = '';
        }
    }

    toggleArchiveMode() {
        this.archiveMode = !this.archiveMode;
        const toggle = document.getElementById('archiveToggle');
        const icon = toggle.querySelector('.toggle-icon');
        const quickMoodSelector = document.getElementById('quickMoodSelector');

        if (this.archiveMode) {
            toggle.classList.add('active');
            icon.textContent = '💾';
            this.showMessage('Archive mode ON - memories will be saved');

            // Show mood selector
            if (quickMoodSelector) {
                quickMoodSelector.style.display = 'block';
                this.bindQuickMoodSelector();
            }
        } else {
            toggle.classList.remove('active');
            icon.textContent = '🗑️';
            this.showMessage('Temporary mode - memories will be cleared');

            // Hide mood selector
            if (quickMoodSelector) {
                quickMoodSelector.style.display = 'none';
            }
        }

        // Button animation
        if (typeof gsap !== 'undefined') {
            gsap.to(toggle, {
                duration: 0.2,
                scale: 1.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        }
    }

    bindQuickMoodSelector() {
        const quickMoodBtns = document.querySelectorAll('.quick-mood-btn');

        quickMoodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mood = btn.dataset.mood;
                const value = parseInt(btn.dataset.value);

                // Update selection
                quickMoodBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                // Store selected mood for memory saving
                this.selectedMemoryMood = mood;
                this.selectedMemoryMoodValue = value;

                // Animation
                if (typeof gsap !== 'undefined') {
                    gsap.to(btn, {
                        duration: 0.2,
                        scale: 1.2,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    });
                }
            });
        });
    }

    showMessage(message) {
        // Update track name temporarily
        const originalTrack = this.trackName.textContent;
        this.trackName.textContent = message.toUpperCase();

        setTimeout(() => {
            this.trackName.textContent = originalTrack;
        }, 3000);
    }

    startReelAnimation() {
        this.isPlaying = true;
        if (typeof gsap !== 'undefined') {
            const settings = window.themeAnimationSettings || { duration: 2, ease: 'none' };

            gsap.to([this.leftReel, this.rightReel], {
                rotation: 360,
                duration: settings.duration,
                ease: settings.ease === 'none' ? 'none' : 'power1.inOut',
                repeat: -1
            });
        }
    }

    stopReelAnimation() {
        this.isPlaying = false;
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf([this.leftReel, this.rightReel]);
        }
    }

    ejectTape() {
        // Reset track name
        this.trackName.textContent = 'EJECTING TAPE...';

        // Stop any reel animations
        this.stopReelAnimation();

        // Animate tape ejection
        if (typeof gsap !== 'undefined') {
            gsap.to(this.resultDisplay, {
                duration: 0.6,
                y: -30,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => {
                    this.resultDisplay.innerHTML = '';
                    this.resultDisplay.className = 'result-display';
                    gsap.set(this.resultDisplay, { y: 0 });
                }
            });
        } else {
            this.resultDisplay.innerHTML = '';
            this.resultDisplay.className = 'result-display';
        }

        // Clear input
        this.thoughtInput.value = '';
        this.thoughtInput.placeholder = 'Tape ejected. Insert new cassette...';

        setTimeout(() => {
            this.thoughtInput.placeholder = 'Type your thoughts here...';
            this.trackName.textContent = 'Ready';
        }, 2000);
    }

    // All mood functions removed for cleaner interface

    getMoodEmoji(mood) {
        const moodEmojis = {
            'sunny': '🌞',
            'stormy': '🌧️',
            'fiery': '🔥',
            'peaceful': '😌',
            'strong': '💪',
            'growing': '🌱',
            'happy': '😊',
            'sad': '😢',
            'angry': '',
            'calm': '😌',
            'excited': '🤩',
            'thoughtful': '🤔',
            'grateful': '🙏',
            'anxious': '😰',
            'hopeful': '🌅',
            'neutral': '😐'
        };
        return moodEmojis[mood] || '📝';
    }

    // ===== MOOD CONSTELLATION SYSTEM =====

    loadMoodsContent() {
        // Reduced logging for better performance
        this.initializeConstellation();
        this.bindMoodSelector();
        this.drawConstellation();
    }

    initializeConstellation() {
        this.canvas = document.getElementById('constellationCanvas');

        // Optimize canvas context
        this.ctx = this.canvas.getContext('2d', {
            alpha: false, // Disable transparency for better performance
            desynchronized: true // Allow async rendering
        });

        this.moodHistory = this.getMoodHistory();
        this.selectedMood = null;

        // Set canvas size with device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);

        // Set CSS size
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    bindMoodSelector() {
        // Cache DOM elements
        if (!this.moodStarsCache) {
            this.moodStarsCache = document.querySelectorAll('.mood-star');
        }

        this.moodStarsCache.forEach(star => {
            star.addEventListener('click', () => {
                const mood = star.dataset.mood;
                const value = parseInt(star.dataset.value);

                // Update selection (use cached elements)
                this.moodStarsCache.forEach(s => s.classList.remove('selected'));
                star.classList.add('selected');

                // Record mood
                this.recordMood(mood, value);

                // Update display
                this.updateCurrentMoodDisplay(mood);

                // Debounced constellation update
                this.drawConstellation();



                // Animation
                this.animateMoodSelection(star);
            });
        });
    }



    recordMood(mood, value) {
        const moodEntry = {
            mood: mood,
            value: value,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        this.moodHistory.unshift(moodEntry);

        // Keep only last 50 entries
        if (this.moodHistory.length > 50) {
            this.moodHistory = this.moodHistory.slice(0, 50);
        }

        // Save to localStorage
        localStorage.setItem('mood-constellation-history', JSON.stringify(this.moodHistory));

        console.log('Mood recorded:', moodEntry);
    }

    getMoodHistory() {
        try {
            const stored = localStorage.getItem('mood-constellation-history');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading mood history:', error);
            return [];
        }
    }

    updateCurrentMoodDisplay(mood) {
        const display = document.getElementById('currentMoodDisplay');
        const emoji = this.getMoodEmoji(mood);
        const moodName = mood.charAt(0).toUpperCase() + mood.slice(1);

        display.innerHTML = `
            <span class="current-emoji">${emoji}</span>
            <span class="current-text">Current mood: ${moodName}</span>
        `;
    }

    drawConstellation() {
        if (!this.ctx) return;

        // Debounce constellation drawing to prevent excessive redraws
        if (this.drawTimeout) {
            clearTimeout(this.drawTimeout);
        }

        this.drawTimeout = setTimeout(() => {
            this.performConstellationDraw();
        }, 16); // ~60fps limit
    }

    performConstellationDraw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw starfield background (cached)
        this.drawStarfield();

        // Draw mood constellation
        this.drawMoodStars();

        // Draw connections
        this.drawConnections();

        // Draw mood graph (simplified)
        this.drawSimpleMoodGraph();
    }

    drawStarfield() {
        // Create fewer, cached background stars for better performance
        if (!this.starfieldCache) {
            this.starfieldCache = [];
            for (let i = 0; i < 30; i++) { // Reduced from 100 to 30
                this.starfieldCache.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    opacity: Math.random() * 0.3 + 0.2
                });
            }
        }

        // Draw cached stars
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.starfieldCache.forEach(star => {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillRect(star.x, star.y, 1, 1); // Use fillRect instead of arc for better performance
        });
        this.ctx.globalAlpha = 1;
    }

    drawMoodStars() {
        if (this.moodHistory.length === 0) return;

        const recentMoods = this.moodHistory.slice(0, 15); // Reduced from 20 to 15 for better performance

        // Set font once outside the loop
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';

        recentMoods.forEach((moodEntry, index) => {
            const x = 50 + (index * (this.canvas.width - 100) / Math.max(recentMoods.length - 1, 1));
            const y = this.canvas.height - 50 - ((moodEntry.value - 1) * (this.canvas.height - 100) / 8);

            // Simplified glow - use simple circle instead of gradient for better performance
            this.ctx.fillStyle = this.getMoodColor(moodEntry.mood, 0.3);
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw star (simplified)
            this.drawSimpleStar(x, y, 6, this.getMoodColor(moodEntry.mood, 1));

            // Draw mood emoji
            const emoji = this.getMoodEmoji(moodEntry.mood);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(emoji, x, y + 4);
        });
    }

    drawStar(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();

        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const outerX = x + Math.cos(angle) * size;
            const outerY = y + Math.sin(angle) * size;

            const innerAngle = angle + Math.PI / 5;
            const innerX = x + Math.cos(innerAngle) * (size * 0.4);
            const innerY = y + Math.sin(innerAngle) * (size * 0.4);

            if (i === 0) {
                this.ctx.moveTo(outerX, outerY);
            } else {
                this.ctx.lineTo(outerX, outerY);
            }
            this.ctx.lineTo(innerX, innerY);
        }

        this.ctx.closePath();
        this.ctx.fill();
    }

    drawSimpleStar(x, y, size, color) {
        // Simplified star using a diamond shape for better performance
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x + size * 0.7, y);
        this.ctx.lineTo(x, y + size);
        this.ctx.lineTo(x - size * 0.7, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawConnections() {
        if (this.moodHistory.length < 2) return;

        const recentMoods = this.moodHistory.slice(0, 15); // Reduced from 20 to 15

        // Set stroke style once outside the loop
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Reduced opacity for better performance
        this.ctx.lineWidth = 1; // Reduced line width
        this.ctx.beginPath(); // Start a single path for all lines

        for (let i = 0; i < recentMoods.length - 1; i++) {
            const current = recentMoods[i];
            const next = recentMoods[i + 1];

            const x1 = 50 + (i * (this.canvas.width - 100) / Math.max(recentMoods.length - 1, 1));
            const y1 = this.canvas.height - 50 - ((current.value - 1) * (this.canvas.height - 100) / 8);

            const x2 = 50 + ((i + 1) * (this.canvas.width - 100) / Math.max(recentMoods.length - 1, 1));
            const y2 = this.canvas.height - 50 - ((next.value - 1) * (this.canvas.height - 100) / 8);

            // Add line to the path
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
        }

        this.ctx.stroke(); // Draw all lines at once
    }

    drawMoodGraph() {
        if (this.moodHistory.length === 0) return;

        // Draw mood value labels
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';

        for (let i = 1; i <= 9; i++) {
            const y = this.canvas.height - 50 - ((i - 1) * (this.canvas.height - 100) / 8);
            this.ctx.fillText(i.toString(), 40, y + 4);
        }

        // Draw grid lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 1; i <= 9; i++) {
            const y = this.canvas.height - 50 - ((i - 1) * (this.canvas.height - 100) / 8);
            this.ctx.beginPath();
            this.ctx.moveTo(50, y);
            this.ctx.lineTo(this.canvas.width - 50, y);
            this.ctx.stroke();
        }
    }

    drawSimpleMoodGraph() {
        if (this.moodHistory.length === 0) return;

        // Simplified version - only draw every other grid line and label
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'right';

        // Draw fewer grid lines for better performance
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        for (let i = 1; i <= 9; i += 2) { // Every other line
            const y = this.canvas.height - 50 - ((i - 1) * (this.canvas.height - 100) / 8);
            this.ctx.fillText(i.toString(), 40, y + 3);

            // Add to path instead of individual strokes
            this.ctx.moveTo(50, y);
            this.ctx.lineTo(this.canvas.width - 50, y);
        }

        this.ctx.stroke(); // Draw all grid lines at once
    }

    getMoodColor(mood, alpha = 1) {
        const colors = {
            'happy': `rgba(255, 215, 0, ${alpha})`,
            'excited': `rgba(255, 69, 0, ${alpha})`,
            'peaceful': `rgba(135, 206, 235, ${alpha})`,
            'grateful': `rgba(255, 182, 193, ${alpha})`,
            'neutral': `rgba(169, 169, 169, ${alpha})`,
            'thoughtful': `rgba(147, 112, 219, ${alpha})`,
            'anxious': `rgba(255, 165, 0, ${alpha})`,
            'sad': `rgba(70, 130, 180, ${alpha})`,
            'angry': `rgba(220, 20, 60, ${alpha})`
        };
        return colors[mood] || `rgba(255, 255, 255, ${alpha})`;
    }



    animateMoodSelection(starElement) {
        // Simplified animation for better performance
        if (typeof gsap !== 'undefined') {
            gsap.to(starElement, {
                duration: 0.15, // Reduced duration
                scale: 1.1, // Reduced scale
                yoyo: true,
                repeat: 1,
                ease: 'power1.inOut' // Simpler easing
            });
        } else {
            // CSS fallback animation
            starElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                starElement.style.transform = 'scale(1)';
            }, 150);
        }
    }

    recordMoodFromMemory(mood, value) {
        // Initialize mood history if not already done
        if (!this.moodHistory) {
            this.moodHistory = this.getMoodHistory();
        }

        const moodEntry = {
            mood: mood,
            value: value,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            source: 'memory'
        };

        this.moodHistory.unshift(moodEntry);

        // Keep only last 50 entries
        if (this.moodHistory.length > 50) {
            this.moodHistory = this.moodHistory.slice(0, 50);
        }

        // Save to localStorage
        localStorage.setItem('mood-constellation-history', JSON.stringify(this.moodHistory));

        console.log('Mood recorded from memory:', moodEntry);
    }

    bindArchiveControls() {
        // Play buttons
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const memoryId = e.target.closest('.cassette-btn').dataset.memoryId;
                this.playMemory(memoryId);
            });
        });

        // Pause buttons
        document.querySelectorAll('.pause-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const memoryId = e.target.closest('.cassette-btn').dataset.memoryId;
                this.pauseMemory(memoryId);
            });
        });

        // Stop buttons
        document.querySelectorAll('.stop-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const memoryId = e.target.closest('.cassette-btn').dataset.memoryId;
                this.stopMemory(memoryId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const memoryId = e.target.closest('.cassette-btn').dataset.memoryId;
                if (confirm('Delete this memory?')) {
                    this.archive.deleteMemory(memoryId);
                    this.displayArchiveMemories();
                    this.updateArchiveCount();
                }
            });
        });
    }

    playMemory(memoryId) {
        const memory = this.archive.getMemory(memoryId);
        if (!memory) return;

        const playbackDisplay = document.getElementById(`playback-${memoryId}`);
        const typewriterText = document.getElementById(`typewriter-${memoryId}`);
        const playBtn = document.querySelector(`[data-memory-id="${memoryId}"].play-btn`);
        const pauseBtn = document.querySelector(`[data-memory-id="${memoryId}"].pause-btn`);

        if (playbackDisplay && typewriterText) {
            playbackDisplay.style.display = 'block';
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-flex';

            // Start typewriter effect
            this.startTypewriter(memory.content, typewriterText, memoryId);
        }
    }

    pauseMemory(memoryId) {
        const playBtn = document.querySelector(`[data-memory-id="${memoryId}"].play-btn`);
        const pauseBtn = document.querySelector(`[data-memory-id="${memoryId}"].pause-btn`);

        if (this.typewriterIntervals && this.typewriterIntervals[memoryId]) {
            clearInterval(this.typewriterIntervals[memoryId]);
            delete this.typewriterIntervals[memoryId];
        }

        playBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
    }

    stopMemory(memoryId) {
        const playbackDisplay = document.getElementById(`playback-${memoryId}`);
        const typewriterText = document.getElementById(`typewriter-${memoryId}`);
        const playBtn = document.querySelector(`[data-memory-id="${memoryId}"].play-btn`);
        const pauseBtn = document.querySelector(`[data-memory-id="${memoryId}"].pause-btn`);

        if (this.typewriterIntervals && this.typewriterIntervals[memoryId]) {
            clearInterval(this.typewriterIntervals[memoryId]);
            delete this.typewriterIntervals[memoryId];
        }

        if (playbackDisplay && typewriterText) {
            playbackDisplay.style.display = 'none';
            typewriterText.textContent = '';
        }

        playBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
    }

    startTypewriter(text, element, memoryId) {
        if (!this.typewriterIntervals) {
            this.typewriterIntervals = {};
        }

        let index = 0;
        element.textContent = '';

        this.typewriterIntervals[memoryId] = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(this.typewriterIntervals[memoryId]);
                delete this.typewriterIntervals[memoryId];
            }
        }, 50);
    }

    loadArchiveContent() {
        console.log('loadArchiveContent called');

        // Test: Create a sample memory if none exist (for debugging)
        const memories = this.archive.getAllMemories();
        if (memories.length === 0) {
            console.log('No memories found, creating test memory for debugging');
            const testMemory = this.archive.createMemory('This is a test memory to verify the archive display is working correctly.', 'dump', 'happy');
            this.archive.saveMemory(testMemory);
            console.log('Test memory created:', testMemory);
        }

        // Simple archive display
        this.displayArchiveMemories();
        this.updateArchiveCount();
    }

    displayArchiveMemories() {
        const archiveGrid = document.getElementById('archiveGrid');
        const archiveEmpty = document.getElementById('archiveEmpty');

        console.log('displayArchiveMemories called');
        console.log('archiveGrid:', archiveGrid);
        console.log('archiveEmpty:', archiveEmpty);

        if (!archiveGrid || !archiveEmpty) {
            console.log('Missing archive elements');
            return;
        }

        const memories = this.archive.getAllMemories();
        console.log('Retrieved memories:', memories);
        console.log('Memory count:', memories.length);

        if (memories.length === 0) {
            console.log('No memories found, showing empty state');
            archiveGrid.innerHTML = '';
            archiveEmpty.classList.add('visible');
            return;
        }

        console.log('Displaying', memories.length, 'memories');

        archiveEmpty.classList.remove('visible');

        // Display memories as enhanced cassette cards
        archiveGrid.innerHTML = memories.map(memory => {
            const date = new Date(memory.timestamp).toLocaleDateString();
            const moodEmoji = this.getMoodEmoji(memory.mood);

            return `
                <div class="memory-cassette-card">
                    <div class="cassette-header">
                        <span class="cassette-date">${date}</span>
                        <span class="cassette-mood">${moodEmoji}</span>
                    </div>
                    <div class="cassette-label">
                        <div class="label-preview">${memory.preview}</div>
                    </div>
                    <div class="cassette-controls">
                        <button class="cassette-btn play-btn" data-memory-id="${memory.id}" title="Play Memory">
                            <span class="btn-icon">▶</span>
                        </button>
                        <button class="cassette-btn pause-btn" data-memory-id="${memory.id}" title="Pause" style="display: none;">
                            <span class="btn-icon">⏸</span>
                        </button>
                        <button class="cassette-btn stop-btn" data-memory-id="${memory.id}" title="Stop">
                            <span class="btn-icon">⏹</span>
                        </button>
                        <button class="cassette-btn delete-btn" data-memory-id="${memory.id}" title="Delete Memory">
                            <span class="btn-icon">🗑️</span>
                        </button>
                    </div>
                    <div class="playback-display" id="playback-${memory.id}" style="display: none;">
                        <div class="typewriter-text" id="typewriter-${memory.id}"></div>
                        <div class="typewriter-cursor">|</div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind control buttons
        this.bindArchiveControls();
    }



    openMemoryPlayback(memory) {
        console.log('openMemoryPlayback called with:', memory);

        // Create playback interface
        const playbackInterface = this.createPlaybackInterface(memory);
        document.body.appendChild(playbackInterface);

        // Animate interface in
        if (typeof gsap !== 'undefined') {
            gsap.from(playbackInterface, {
                duration: 0.5,
                opacity: 0,
                scale: 0.95,
                ease: 'power2.out'
            });
        }

        // Start typewriter effect after a brief delay
        setTimeout(() => {
            console.log('About to start typewriter effect');
            this.startTypewriterEffect(memory);
        }, 800);
    }

    createPlaybackInterface(memory) {
        const moodEmoji = this.getMoodEmoji(memory.mood);
        const playbackDiv = document.createElement('div');
        playbackDiv.className = 'memory-playback-overlay';
        playbackDiv.innerHTML = `
            <div class="playback-container">
                <!-- Playback Header -->
                <div class="playback-header">
                    <h2 class="playback-title">📼 Memory Playback</h2>
                    <button class="playback-close" id="playbackClose">×</button>
                </div>

                <!-- Vintage Cassette Player -->
                <div class="vintage-player">
                    <div class="player-body">
                        <!-- Cassette Display -->
                        <div class="player-display">
                            <div class="display-info">
                                <div class="memory-date">${new Date(memory.timestamp).toLocaleDateString()}</div>
                                <div class="memory-mood">${moodEmoji}</div>
                                <div class="memory-id">ID: ${memory.id.slice(-6).toUpperCase()}</div>
                            </div>
                        </div>

                        <!-- Player Reels -->
                        <div class="player-reels">
                            <div class="player-reel left" id="playbackLeftReel">
                                <div class="reel-center"></div>
                                <div class="reel-spokes" id="leftSpokes"></div>
                            </div>
                            <div class="player-reel right" id="playbackRightReel">
                                <div class="reel-center"></div>
                                <div class="reel-spokes" id="rightSpokes"></div>
                            </div>
                        </div>

                        <!-- Typewriter Display -->
                        <div class="typewriter-screen">
                            <div class="typewriter-text" id="typewriterText"></div>
                            <div class="typewriter-cursor" id="typewriterCursor">|</div>
                        </div>

                        <!-- Player Controls -->
                        <div class="player-controls">
                            <button class="control-btn" id="playBtn" title="Play">
                                <span class="btn-symbol">▶</span>
                            </button>
                            <button class="control-btn" id="pauseBtn" title="Pause" style="display: none;">
                                <span class="btn-symbol">⏸</span>
                            </button>
                            <button class="control-btn" id="stopBtn" title="Stop">
                                <span class="btn-symbol">⏹</span>
                            </button>
                            <button class="control-btn" id="rewindBtn" title="Rewind">
                                <span class="btn-symbol">⏪</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind playback controls
        this.bindPlaybackControls(playbackDiv, memory);

        return playbackDiv;
    }

    bindPlaybackControls(playbackDiv, memory) {
        const closeBtn = playbackDiv.querySelector('#playbackClose');
        const playBtn = playbackDiv.querySelector('#playBtn');
        const pauseBtn = playbackDiv.querySelector('#pauseBtn');
        const stopBtn = playbackDiv.querySelector('#stopBtn');
        const rewindBtn = playbackDiv.querySelector('#rewindBtn');

        // Close playback
        closeBtn.addEventListener('click', () => {
            this.closeMemoryPlayback(playbackDiv);
        });

        // Play/Pause controls
        playBtn.addEventListener('click', () => {
            this.resumeTypewriter();
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-flex';
        });

        pauseBtn.addEventListener('click', () => {
            this.pauseTypewriter();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline-flex';
        });

        // Stop control
        stopBtn.addEventListener('click', () => {
            this.stopTypewriter();
            this.resetTypewriterDisplay();
            playBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
        });

        // Rewind control
        rewindBtn.addEventListener('click', () => {
            this.stopTypewriter();
            this.resetTypewriterDisplay();
            setTimeout(() => {
                this.startTypewriterEffect(memory);
            }, 300);
        });

        // Close on background click
        playbackDiv.addEventListener('click', (e) => {
            if (e.target === playbackDiv) {
                this.closeMemoryPlayback(playbackDiv);
            }
        });
    }

    startTypewriterEffect(memory) {
        const textElement = document.getElementById('typewriterText');
        const cursorElement = document.getElementById('typewriterCursor');
        const leftSpokes = document.getElementById('leftSpokes');
        const rightSpokes = document.getElementById('rightSpokes');

        if (!textElement) {
            console.error('Typewriter text element not found');
            return;
        }

        if (!memory || !memory.content) {
            console.error('Memory or memory content is missing:', memory);
            return;
        }

        const text = memory.content;
        console.log('Starting typewriter with text:', text.substring(0, 50) + '...');

        let currentIndex = 0;
        this.typewriterSpeed = 50; // milliseconds per character
        this.isTypewriterPlaying = true;
        this.typewriterPaused = false;

        // Clear any existing text
        textElement.textContent = '';

        // Start reel animations
        if (typeof gsap !== 'undefined') {
            gsap.to([leftSpokes, rightSpokes], {
                rotation: 360,
                duration: 3,
                ease: 'none',
                repeat: -1
            });
        }

        // Show cursor blinking
        if (cursorElement) {
            cursorElement.style.display = 'inline-block';
        }

        // Typewriter function
        const typeNextCharacter = () => {
            if (!this.isTypewriterPlaying || this.typewriterPaused) return;

            if (currentIndex < text.length) {
                textElement.textContent = text.substring(0, currentIndex + 1);
                currentIndex++;

                // Scroll to bottom if needed
                textElement.scrollTop = textElement.scrollHeight;

                // Continue typing
                this.typewriterTimeout = setTimeout(typeNextCharacter, this.typewriterSpeed);
            } else {
                // Finished typing
                this.isTypewriterPlaying = false;
                if (cursorElement) {
                    cursorElement.style.display = 'none';
                }

                // Stop reel animations
                if (typeof gsap !== 'undefined') {
                    gsap.killTweensOf([leftSpokes, rightSpokes]);
                }

                // Show play button
                const playBtn = document.getElementById('playBtn');
                const pauseBtn = document.getElementById('pauseBtn');
                if (playBtn && pauseBtn) {
                    playBtn.style.display = 'inline-flex';
                    pauseBtn.style.display = 'none';
                }
            }
        };

        // Start typing
        typeNextCharacter();
    }

    pauseTypewriter() {
        this.typewriterPaused = true;
        const leftSpokes = document.getElementById('leftSpokes');
        const rightSpokes = document.getElementById('rightSpokes');

        // Pause reel animations
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
    }

    resumeTypewriter() {
        this.typewriterPaused = false;
        const leftSpokes = document.getElementById('leftSpokes');
        const rightSpokes = document.getElementById('rightSpokes');

        // Resume reel animations
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.resume();
        }

        // Continue typing if not finished
        if (this.isTypewriterPlaying) {
            const textElement = document.getElementById('typewriterText');
            const memory = this.currentPlayingMemory;
            if (textElement && memory) {
                const currentLength = textElement.textContent.length;
                const totalLength = memory.content.length;

                if (currentLength < totalLength) {
                    this.continueTypewriter(memory, currentLength);
                }
            }
        }
    }

    continueTypewriter(memory, startIndex) {
        const textElement = document.getElementById('typewriterText');
        if (!textElement) return;

        const text = memory.content;
        let currentIndex = startIndex;

        const typeNextCharacter = () => {
            if (!this.isTypewriterPlaying || this.typewriterPaused) return;

            if (currentIndex < text.length) {
                textElement.textContent = text.substring(0, currentIndex + 1);
                currentIndex++;
                textElement.scrollTop = textElement.scrollHeight;
                this.typewriterTimeout = setTimeout(typeNextCharacter, this.typewriterSpeed);
            } else {
                this.isTypewriterPlaying = false;
                const cursorElement = document.getElementById('typewriterCursor');
                if (cursorElement) {
                    cursorElement.style.display = 'none';
                }
            }
        };

        typeNextCharacter();
    }

    stopTypewriter() {
        this.isTypewriterPlaying = false;
        this.typewriterPaused = false;

        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
        }

        // Stop reel animations
        const leftSpokes = document.getElementById('leftSpokes');
        const rightSpokes = document.getElementById('rightSpokes');
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf([leftSpokes, rightSpokes]);
        }
    }

    resetTypewriterDisplay() {
        const textElement = document.getElementById('typewriterText');
        const cursorElement = document.getElementById('typewriterCursor');

        if (textElement) {
            textElement.textContent = '';
        }

        if (cursorElement) {
            cursorElement.style.display = 'inline-block';
        }
    }

    closeMemoryPlayback(playbackDiv) {
        this.stopTypewriter();

        if (typeof gsap !== 'undefined') {
            gsap.to(playbackDiv, {
                duration: 0.3,
                opacity: 0,
                scale: 0.95,
                ease: 'power2.in',
                onComplete: () => {
                    if (playbackDiv.parentNode) {
                        playbackDiv.parentNode.removeChild(playbackDiv);
                    }
                }
            });
        } else {
            if (playbackDiv.parentNode) {
                playbackDiv.parentNode.removeChild(playbackDiv);
            }
        }
    }

    loadInsightsContent() {
        const memories = this.archive.getAllMemories();
        this.updateSimpleStats(memories);
    }

    updateSimpleStats(memories) {
        const totalElement = document.getElementById('totalMemoriesCount');
        if (totalElement) {
            totalElement.textContent = memories.length;
        }
    }

    generateMoodPatternChart(memories) {
        const moodChart = document.getElementById('dashboardMoodChart');
        if (!moodChart) return;

        const moodCounts = {};
        const moodNames = {
            sunny: 'Sunny',
            stormy: 'Stormy',
            fiery: 'Fiery',
            peaceful: 'Peaceful',
            strong: 'Strong',
            growing: 'Growing'
        };

        const moodColors = {
            sunny: '#FFD700',
            stormy: '#4682B4',
            fiery: '#FF6347',
            peaceful: '#98FB98',
            strong: '#DDA0DD',
            growing: '#90EE90'
        };

        // Count moods
        memories.forEach(memory => {
            if (memory.mood) {
                moodCounts[memory.mood] = (moodCounts[memory.mood] || 0) + 1;
            }
        });

        const totalWithMood = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);

        if (totalWithMood === 0) {
            moodChart.innerHTML = `
                <div class="no-data">
                    <div class="no-data-icon">📊</div>
                    <h4>No mood data yet</h4>
                    <p>Start tagging your memories with moods to see patterns</p>
                </div>
            `;
            return;
        }

        // Create mood visualization
        const moodOrder = ['sunny', 'growing', 'strong', 'peaceful', 'fiery', 'stormy'];
        moodChart.innerHTML = `
            <div class="mood-chart-container">
                <div class="mood-bars">
                    ${moodOrder.map(mood => {
            const count = moodCounts[mood] || 0;
            const percentage = (count / totalWithMood) * 100;

            return `
                            <div class="mood-bar-item" data-mood="${mood}">
                                <div class="mood-bar-header">
                                    <span class="mood-emoji">${this.getMoodEmoji(mood)}</span>
                                    <span class="mood-label">${moodNames[mood]}</span>
                                    <span class="mood-count">${count}</span>
                                </div>
                                <div class="mood-bar-track">
                                    <div class="mood-bar-fill" 
                                         style="width: ${percentage}%; background-color: ${moodColors[mood]}">
                                        <span class="mood-percentage">${Math.round(percentage)}%</span>
                                    </div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
                <div class="mood-insights">
                    <div class="dominant-mood">
                        <strong>Most Common:</strong> ${this.getDominantMood(moodCounts)}
                    </div>
                    <div class="mood-diversity">
                        <strong>Emotional Range:</strong> ${Object.keys(moodCounts).length} different moods
                    </div>
                </div>
            </div>
        `;

        // Animate bars
        if (typeof gsap !== 'undefined') {
            gsap.from('.mood-bar-fill', {
                duration: 1,
                width: 0,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.3
            });
        }
    }

    getDominantMood(moodCounts) {
        const moodNames = {
            sunny: '🌞 Sunny',
            stormy: '🌧️ Stormy',
            fiery: '🔥 Fiery',
            peaceful: '😌 Peaceful',
            strong: '💪 Strong',
            growing: '🌱 Growing'
        };

        const dominantMood = Object.entries(moodCounts)
            .sort(([, a], [, b]) => b - a)[0];

        return dominantMood ? moodNames[dominantMood[0]] : 'None yet';
    }

    generateEmotionalTimeline(memories) {
        const timeline = document.getElementById('dashboardTimeline');
        if (!timeline) return;

        const recentMemories = memories
            .filter(memory => memory.mood) // Only memories with moods
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 15); // Last 15 memories with moods

        if (recentMemories.length === 0) {
            timeline.innerHTML = `
                <div class="no-data">
                    <div class="no-data-icon">📈</div>
                    <h4>No emotional timeline yet</h4>
                    <p>Add moods to your memories to see your emotional journey</p>
                </div>
            `;
            return;
        }

        timeline.innerHTML = `
            <div class="timeline-container">
                <div class="timeline-header">
                    <h4>Your Recent Emotional Journey</h4>
                    <p>Last ${recentMemories.length} memories with moods</p>
                </div>
                <div class="timeline-track">
                    ${recentMemories.map((memory, index) => {
            const date = new Date(memory.timestamp);
            const isRecent = Date.now() - date.getTime() < 24 * 60 * 60 * 1000;

            return `
                            <div class="timeline-point ${isRecent ? 'recent' : ''}" 
                                 data-memory-id="${memory.id}"
                                 title="${memory.preview}">
                                <div class="timeline-mood">${this.getMoodEmoji(memory.mood)}</div>
                                <div class="timeline-date">${date.toLocaleDateString()}</div>
                                <div class="timeline-connector ${index === recentMemories.length - 1 ? 'last' : ''}"></div>
                            </div>
                        `;
        }).join('')}
                </div>
                <div class="timeline-insights">
                    ${this.generateTimelineInsights(recentMemories)}
                </div>
            </div>
        `;

        // Animate timeline points
        if (typeof gsap !== 'undefined') {
            gsap.from('.timeline-point', {
                duration: 0.5,
                scale: 0,
                stagger: 0.1,
                ease: 'back.out(1.7)',
                delay: 0.5
            });
        }
    }

    generateTimelineInsights(memories) {
        if (memories.length < 3) return '<p>Add more memories to see emotional patterns</p>';

        const recentMoods = memories.slice(0, 5).map(m => m.mood);
        const moodCounts = {};
        recentMoods.forEach(mood => {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });

        const dominantRecent = Object.entries(moodCounts)
            .sort(([, a], [, b]) => b - a)[0][0];

        const insights = [];

        if (dominantRecent === 'sunny' || dominantRecent === 'peaceful') {
            insights.push('🌟 You\'ve been in a positive emotional space recently');
        } else if (dominantRecent === 'growing' || dominantRecent === 'strong') {
            insights.push('💪 You\'re showing resilience and growth');
        } else if (dominantRecent === 'stormy' || dominantRecent === 'fiery') {
            insights.push('🌈 You\'re processing intense emotions - that\'s healthy');
        }

        const moodVariety = new Set(recentMoods).size;
        if (moodVariety >= 4) {
            insights.push('🎭 You experience a rich range of emotions');
        } else if (moodVariety <= 2) {
            insights.push('🎯 Your emotions have been consistent lately');
        }

        return insights.map(insight => `<p>${insight}</p>`).join('');
    }

    generateThisDayMemories(memories) {
        const thisDayContainer = document.getElementById('thisDayMemories');
        if (!thisDayContainer) return;

        const today = new Date();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();

        // Find memories from this day in previous years
        const thisDayMemories = memories.filter(memory => {
            const memoryDate = new Date(memory.timestamp);
            return memoryDate.getMonth() === todayMonth &&
                memoryDate.getDate() === todayDate &&
                memoryDate.getFullYear() !== today.getFullYear();
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (thisDayMemories.length === 0) {
            thisDayContainer.innerHTML = `
                <div class="no-data">
                    <div class="no-data-icon">📅</div>
                    <h4>No memories from this day</h4>
                    <p>Come back next year to see what you were thinking on ${today.toLocaleDateString()}!</p>
                </div>
            `;
            return;
        }

        thisDayContainer.innerHTML = `
            <div class="this-day-container">
                <div class="this-day-header">
                    <h4>On This Day: ${today.toLocaleDateString()}</h4>
                    <p>Memories from previous years</p>
                </div>
                <div class="this-day-memories">
                    ${thisDayMemories.map(memory => {
            const memoryDate = new Date(memory.timestamp);
            const yearsAgo = today.getFullYear() - memoryDate.getFullYear();

            return `
                            <div class="this-day-memory" data-memory-id="${memory.id}">
                                <div class="memory-header">
                                    <span class="memory-year">${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago</span>
                                    <span class="memory-mood">${this.getMoodEmoji(memory.mood)}</span>
                                </div>
                                <div class="memory-preview">${memory.preview}</div>
                                <button class="memory-play-btn" data-memory-id="${memory.id}">
                                    <span class="play-icon">▶</span>
                                    <span class="play-text">Revisit</span>
                                </button>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;

        // Bind play buttons
        thisDayContainer.querySelectorAll('.memory-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const memoryId = e.target.closest('.memory-play-btn').dataset.memoryId;
                this.playMemory(memoryId);
            });
        });
    }

    generateTherapeuticInsights(memories) {
        const insightsContainer = document.getElementById('therapeuticInsights');
        if (!insightsContainer) return;

        if (memories.length === 0) {
            insightsContainer.innerHTML = `
                <div class="no-data">
                    <div class="no-data-icon">💡</div>
                    <h4>No insights yet</h4>
                    <p>Start saving memories to receive personalized therapeutic insights</p>
                </div>
            `;
            return;
        }

        const insights = this.calculateTherapeuticInsights(memories);

        insightsContainer.innerHTML = `
            <div class="therapeutic-container">
                <div class="insights-header">
                    <h4>Your Therapeutic Journey</h4>
                    <p>Personalized insights based on your memories</p>
                </div>
                
                <div class="insight-cards">
                    <div class="insight-card growth">
                        <div class="insight-icon">🌱</div>
                        <div class="insight-content">
                            <h5>Growth Indicator</h5>
                            <p>${insights.growth}</p>
                        </div>
                    </div>
                    
                    <div class="insight-card patterns">
                        <div class="insight-icon">🔄</div>
                        <div class="insight-content">
                            <h5>Emotional Patterns</h5>
                            <p>${insights.patterns}</p>
                        </div>
                    </div>
                    
                    <div class="insight-card strength">
                        <div class="insight-icon">💪</div>
                        <div class="insight-content">
                            <h5>Inner Strength</h5>
                            <p>${insights.strength}</p>
                        </div>
                    </div>
                    
                    <div class="insight-card encouragement">
                        <div class="insight-icon">✨</div>
                        <div class="insight-content">
                            <h5>Encouragement</h5>
                            <p>${insights.encouragement}</p>
                        </div>
                    </div>
                </div>
                
                <div class="therapeutic-affirmation">
                    <p>"${insights.affirmation}"</p>
                </div>
            </div>
        `;
    }

    calculateTherapeuticInsights(memories) {
        const totalMemories = memories.length;
        const moodCounts = {};
        const recentMemories = memories.slice(0, 10);

        memories.forEach(memory => {
            if (memory.mood) {
                moodCounts[memory.mood] = (moodCounts[memory.mood] || 0) + 1;
            }
        });

        const dominantMood = Object.entries(moodCounts)
            .sort(([, a], [, b]) => b - a)[0];

        const insights = {
            growth: this.getGrowthInsight(totalMemories, moodCounts),
            patterns: this.getPatternInsight(moodCounts),
            strength: this.getStrengthInsight(moodCounts, recentMemories),
            encouragement: this.getEncouragementInsight(dominantMood),
            affirmation: this.getPersonalAffirmation(dominantMood, totalMemories)
        };

        return insights;
    }

    getGrowthInsight(totalMemories, moodCounts) {
        const growingCount = moodCounts.growing || 0;
        const strongCount = moodCounts.strong || 0;
        const positiveCount = growingCount + strongCount + (moodCounts.sunny || 0) + (moodCounts.peaceful || 0);

        if (totalMemories < 5) {
            return "You're just beginning your emotional awareness journey. Every memory you save is a step toward greater self-understanding.";
        } else if (positiveCount > totalMemories * 0.6) {
            return "You show remarkable emotional resilience. Your ability to find growth and strength in experiences is inspiring.";
        } else {
            return "You're courageously facing all aspects of your emotional experience. This honest self-reflection is the foundation of growth.";
        }
    }

    getPatternInsight(moodCounts) {
        const moodVariety = Object.keys(moodCounts).length;

        if (moodVariety >= 5) {
            return "You experience a rich emotional spectrum. This emotional intelligence allows you to respond authentically to life's complexities.";
        } else if (moodVariety >= 3) {
            return "You're developing emotional awareness across multiple states. This balanced approach to feelings shows healthy emotional processing.";
        } else {
            return "You're focusing deeply on specific emotional experiences. This concentrated awareness can lead to profound insights.";
        }
    }

    getStrengthInsight(moodCounts, recentMemories) {
        const strongCount = moodCounts.strong || 0;
        const recentStrong = recentMemories.filter(m => m.mood === 'strong').length;

        if (strongCount > 0 || recentStrong > 0) {
            return "You consistently recognize your inner strength. This self-awareness is a powerful tool for navigating life's challenges.";
        } else {
            return "Strength comes in many forms. Your willingness to process emotions and seek understanding is itself a form of courage.";
        }
    }

    getEncouragementInsight(dominantMood) {
        if (!dominantMood) {
            return "Every emotion you experience is valid and valuable. You're building a foundation of self-awareness that will serve you well.";
        }

        const encouragements = {
            sunny: "Your positive outlook is a gift to yourself and others. Continue nurturing this bright perspective while honoring all your emotions.",
            stormy: "You're not afraid to face difficult emotions. This courage to sit with discomfort is a sign of emotional maturity and strength.",
            fiery: "Your passionate nature is a powerful force. Learning to channel this intensity constructively is part of your unique journey.",
            peaceful: "You've cultivated a sense of inner calm. This peaceful center is a resource you can draw upon during challenging times.",
            strong: "You consistently recognize your resilience. This self-awareness of your strength is itself a form of empowerment.",
            growing: "Your focus on growth and development is admirable. Every experience becomes a learning opportunity in your hands."
        };

        return encouragements[dominantMood[0]] || "You're on a unique emotional journey, and every step forward is meaningful.";
    }

    getPersonalAffirmation(dominantMood, totalMemories) {
        const affirmations = [
            "I honor all my emotions as valid parts of my human experience.",
            "I am growing stronger and wiser through every feeling I process.",
            "My emotional awareness is a gift that guides me toward authenticity.",
            "I trust my ability to navigate life's emotional complexities with grace.",
            "Every memory I create is a step toward deeper self-understanding.",
            "I am worthy of compassion, especially from myself.",
            "My feelings are messengers that help me understand my needs and values.",
            "I celebrate my courage to feel deeply and live authentically."
        ];

        // Select affirmation based on dominant mood and memory count
        let index = 0;
        if (dominantMood) {
            const moodIndices = { sunny: 0, growing: 1, strong: 2, peaceful: 3, fiery: 4, stormy: 5 };
            index = moodIndices[dominantMood[0]] || 0;
        }

        return affirmations[index + (totalMemories % 2)];
    }

    generateDashboardStats(memories) {
        const totalElement = document.getElementById('dashboardTotalMemories');
        const weekElement = document.getElementById('dashboardWeekCount');

        if (totalElement) {
            totalElement.textContent = memories.length;
        }

        if (weekElement) {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const thisWeekCount = memories.filter(memory =>
                new Date(memory.timestamp) >= weekAgo
            ).length;

            weekElement.textContent = thisWeekCount;
        }
    }

    // Therapeutic techniques removed for cleaner interface
    // Complex insight functions removed for cleaner interface
    // Complex filtering functions removed for cleaner interface

    updateArchiveCount() {
        const archiveCount = document.getElementById('archiveCount');
        if (archiveCount && this.archive) {
            const count = this.archive.getAllMemories().length;
            archiveCount.textContent = `${count} memories`;
        }
    }
}

// Memory Archive Manager - Local Storage System
class MemoryArchive {
    constructor() {
        this.storageKey = 'memory-cassette-archive';
    }

    createMemory(content, type = 'dump', mood = null) {
        const now = new Date();
        const memory = {
            id: this.generateId(),
            content: content,
            preview: content.length > 100 ? content.substring(0, 100) + '...' : content,
            type: type,
            mood: mood,
            timestamp: now.toISOString(),
            dateCreated: now.toLocaleDateString() + ' ' + now.toLocaleTimeString()
        };
        return memory;
    }

    saveMemory(memory) {
        try {
            const memories = this.getAllMemories();
            memories.unshift(memory); // Add to beginning
            localStorage.setItem(this.storageKey, JSON.stringify(memories));
            console.log('Memory saved:', memory.id);
            return true;
        } catch (error) {
            console.error('Error saving memory:', error);
            return false;
        }
    }

    getAllMemories() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading memories:', error);
            return [];
        }
    }

    getMemory(id) {
        const memories = this.getAllMemories();
        return memories.find(memory => memory.id === id);
    }

    deleteMemory(id) {
        try {
            const memories = this.getAllMemories();
            const filtered = memories.filter(memory => memory.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            console.log('Memory deleted:', id);
            return true;
        } catch (error) {
            console.error('Error deleting memory:', error);
            return false;
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Theme Manager Class
class ThemeManager {
    constructor() {
        this.storageKey = 'memory-cassette-theme';
        this.settingsKey = 'memory-cassette-theme-settings';
        this.themes = this.defineThemes();
        this.defaultSettings = {
            animations: true,
            fontSize: 'medium',
            highContrast: false
        };
    }

    defineThemes() {
        return {
            vintage: {
                name: 'Vintage Newsletter',
                colors: {
                    '--bg-vintage': '#e8dcc0',
                    '--bg-cream': '#f4f0e8',
                    '--nav-dark': '#2c2c2c',
                    '--text-dark': '#2c2c2c',
                    '--text-medium': '#5a5a5a',
                    '--text-light': '#8b7355',
                    '--border-dark': '#2c2c2c',
                    '--border-light': '#d4c4a8',
                    '--cassette-beige': '#d4c4a8',
                    '--cassette-border': '#8b7355',
                    '--reel-dark': '#6b5b47',
                    '--display-bg': '#f5f5dc',
                    '--sticky-yellow': '#fff3a0'
                }
            },
            'warm-paper': {
                name: 'Warm Paper',
                colors: {
                    '--bg-vintage': '#faf6f0',
                    '--bg-cream': '#f8f4ee',
                    '--nav-dark': '#8b4513',
                    '--text-dark': '#654321',
                    '--text-medium': '#8b4513',
                    '--text-light': '#d4a574',
                    '--border-dark': '#8b4513',
                    '--border-light': '#f4e6d7',
                    '--cassette-beige': '#f4e6d7',
                    '--cassette-border': '#d4a574',
                    '--reel-dark': '#a0522d',
                    '--display-bg': '#fff8dc',
                    '--sticky-yellow': '#fffacd'
                }
            },
            'dusty-teal': {
                name: 'Dusty Teal',
                colors: {
                    '--bg-vintage': '#e8f4f8',
                    '--bg-cream': '#f0f8ff',
                    '--nav-dark': '#2f4f4f',
                    '--text-dark': '#2f4f4f',
                    '--text-medium': '#5f9ea0',
                    '--text-light': '#708090',
                    '--border-dark': '#2f4f4f',
                    '--border-light': '#b8d4da',
                    '--cassette-beige': '#b8d4da',
                    '--cassette-border': '#5f9ea0',
                    '--reel-dark': '#4682b4',
                    '--display-bg': '#f0ffff',
                    '--sticky-yellow': '#e0ffff'
                }
            },
            'typewriter': {
                name: 'Typewriter',
                colors: {
                    '--bg-vintage': '#ffffff',
                    '--bg-cream': '#f8f8f8',
                    '--nav-dark': '#000000',
                    '--text-dark': '#000000',
                    '--text-medium': '#333333',
                    '--text-light': '#666666',
                    '--border-dark': '#000000',
                    '--border-light': '#cccccc',
                    '--cassette-beige': '#f5f5f5',
                    '--cassette-border': '#333333',
                    '--reel-dark': '#666666',
                    '--display-bg': '#ffffff',
                    '--sticky-yellow': '#ffff99'
                }
            },
            'classic-sepia': {
                name: 'Classic Sepia',
                colors: {
                    '--bg-vintage': '#f4f1e8',
                    '--bg-cream': '#f6f3ea',
                    '--nav-dark': '#654321',
                    '--text-dark': '#654321',
                    '--text-medium': '#8b7355',
                    '--text-light': '#a0522d',
                    '--border-dark': '#654321',
                    '--border-light': '#deb887',
                    '--cassette-beige': '#deb887',
                    '--cassette-border': '#a0522d',
                    '--reel-dark': '#8b4513',
                    '--display-bg': '#fdf5e6',
                    '--sticky-yellow': '#f5deb3'
                }
            }
        };
    }

    getCurrentTheme() {
        try {
            return localStorage.getItem(this.storageKey) || 'vintage';
        } catch (error) {
            console.error('Error loading theme:', error);
            return 'vintage';
        }
    }

    getSettings() {
        try {
            const stored = localStorage.getItem(this.settingsKey);
            return stored ? { ...this.defaultSettings, ...JSON.parse(stored) } : this.defaultSettings;
        } catch (error) {
            console.error('Error loading theme settings:', error);
            return this.defaultSettings;
        }
    }

    applyTheme(themeName, isPreview = false) {
        const theme = this.themes[themeName];
        if (!theme) {
            console.error('Theme not found:', themeName);
            return;
        }

        const root = document.documentElement;

        // Apply theme colors
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Apply theme-specific classes
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        // Apply theme-specific animations
        this.applyThemeAnimations(themeName);

        // Apply settings
        const settings = this.getSettings();
        this.applySettings(settings);

        if (!isPreview) {
            console.log(`Theme applied: ${theme.name}`);
        }
    }

    applyThemeAnimations(themeName) {
        // Remove existing theme animation classes
        document.body.classList.remove(
            'anim-vintage', 'anim-warm-paper', 'anim-dusty-teal',
            'anim-typewriter', 'anim-classic-sepia'
        );

        // Add theme-specific animation class
        document.body.classList.add(`anim-${themeName}`);

        // Apply theme-specific particle effects and transitions
        this.updateThemeParticles(themeName);

        // Update GSAP animation defaults for theme
        this.updateGSAPDefaults(themeName);
    }

    updateThemeParticles(themeName) {
        // Define theme-specific particle colors and effects
        const themeParticles = {
            vintage: {
                primaryColor: '#8b7355',
                secondaryColor: '#d4c4a8',
                particleType: 'paper',
                animationStyle: 'gentle'
            },
            'warm-paper': {
                primaryColor: '#d4a574',
                secondaryColor: '#f4e6d7',
                particleType: 'sepia',
                animationStyle: 'warm'
            },
            'dusty-teal': {
                primaryColor: '#5f9ea0',
                secondaryColor: '#b8d4da',
                particleType: 'water',
                animationStyle: 'flowing'
            },
            'typewriter': {
                primaryColor: '#333333',
                secondaryColor: '#f5f5f5',
                particleType: 'mechanical',
                animationStyle: 'sharp'
            },
            'classic-sepia': {
                primaryColor: '#a0522d',
                secondaryColor: '#deb887',
                particleType: 'vintage',
                animationStyle: 'aged'
            }
        };

        const particles = themeParticles[themeName];
        if (particles) {
            // Update CSS custom properties for particles
            const root = document.documentElement;
            root.style.setProperty('--particle-primary', particles.primaryColor);
            root.style.setProperty('--particle-secondary', particles.secondaryColor);
            root.style.setProperty('--particle-type', particles.particleType);
            root.style.setProperty('--animation-style', particles.animationStyle);
        }
    }

    updateGSAPDefaults(themeName) {
        if (typeof gsap === 'undefined') return;

        // Define theme-specific animation settings
        const themeAnimations = {
            vintage: {
                ease: 'power2.out',
                duration: 0.8,
                stagger: 0.1
            },
            'warm-paper': {
                ease: 'power1.inOut',
                duration: 1.0,
                stagger: 0.15
            },
            'dusty-teal': {
                ease: 'sine.inOut',
                duration: 1.2,
                stagger: 0.08
            },
            'typewriter': {
                ease: 'none',
                duration: 0.3,
                stagger: 0.05
            },
            'classic-sepia': {
                ease: 'power3.out',
                duration: 1.5,
                stagger: 0.2
            }
        };

        const animSettings = themeAnimations[themeName];
        if (animSettings) {
            // Store theme animation settings globally
            window.themeAnimationSettings = animSettings;
        }
    }

    applySettings(settings) {
        const root = document.documentElement;

        // Dark mode removed - themes handle color variations

        // Animations
        if (!settings.animations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }

        // Font size
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${settings.fontSize}`);

        // High contrast
        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    saveTheme(themeName) {
        try {
            localStorage.setItem(this.storageKey, themeName);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving theme settings:', error);
        }
    }

    // Dark mode removed - themes handle color variations

    setAnimations(enabled) {
        const settings = this.getSettings();
        settings.animations = enabled;
        this.saveSettings(settings);
        this.applySettings(settings);
    }

    setFontSize(size) {
        const settings = this.getSettings();
        settings.fontSize = size;
        this.saveSettings(settings);
        this.applySettings(settings);
    }

    setHighContrast(enabled) {
        const settings = this.getSettings();
        settings.highContrast = enabled;
        this.saveSettings(settings);
        this.applySettings(settings);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing MemoryCassette...');
    try {
        new MemoryCassette();
        console.log('MemoryCassette initialized successfully');
    } catch (error) {
        console.error('Error initializing MemoryCassette:', error);
    }
});
