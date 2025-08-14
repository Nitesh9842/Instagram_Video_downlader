// Instagram Reel Downloader App Logic

class ReelDownloader {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.reelInput = document.getElementById('reelUrl');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.btnText = this.downloadBtn.querySelector('.btn-text');
        this.btnLoader = this.downloadBtn.querySelector('.btn-loader');
        this.errorMessage = document.getElementById('errorMessage');
        this.downloadModal = document.getElementById('downloadModal');
        this.modalClose = document.getElementById('modalClose');
        this.qualityOptions = [];
    }

    bindEvents() {
        this.downloadBtn.addEventListener('click', () => this.handleDownload());
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.downloadModal.addEventListener('click', (e) => {
            if (e.target === this.downloadModal || e.target.classList.contains('modal-backdrop')) {
                this.closeModal();
            }
        });

        // Handle Enter key in input field
        this.reelInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleDownload();
            }
        });

        // Clear error message when user starts typing
        this.reelInput.addEventListener('input', () => {
            this.hideError();
        });

        // Handle quality option clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quality-option') || e.target.closest('.quality-option')) {
                const option = e.target.classList.contains('quality-option') ? e.target : e.target.closest('.quality-option');
                this.handleQualitySelection(option);
            }
        });

        // Handle ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.downloadModal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    async handleDownload() {
        const url = this.reelInput.value.trim();
        
        if (!url) {
            this.showError('Please enter an Instagram reel URL');
            return;
        }

        if (!this.isValidInstagramUrl(url)) {
            this.showError('Please enter a valid Instagram reel URL');
            return;
        }

        this.showLoading();
        this.hideError();

        try {
            const response = await fetch('/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to download reel');
            }

            // Trigger file download
            window.location.href = `/get-video/${data.filename}`;
            
            this.showSuccessMessage('Download completed!');
            this.clearInput();
            
        } catch (error) {
            this.showError(error.message);
        } finally {
        this.hideLoading();
        }
    }

    isValidInstagramUrl(url) {
        // Instagram URL patterns
        const patterns = [
            /^https?:\/\/(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?/,
            /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/,
            /^https?:\/\/instagram\.com\/reel\/[A-Za-z0-9_-]+\/?/,
            /^https?:\/\/instagram\.com\/p\/[A-Za-z0-9_-]+\/?/
        ];

        return patterns.some(pattern => pattern.test(url));
    }

    simulateProcessing() {
        return new Promise((resolve) => {
            // Simulate processing time
            setTimeout(resolve, 1500 + Math.random() * 1000);
        });
    }

    showLoading() {
        this.downloadBtn.disabled = true;
        this.btnText.classList.add('hidden');
        this.btnLoader.classList.remove('hidden');
    }

    hideLoading() {
        this.downloadBtn.disabled = false;
        this.btnText.classList.remove('hidden');
        this.btnLoader.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.reelInput.focus();
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    showDownloadModal() {
        // Generate mock video data
        const mockData = this.generateMockVideoData();
        this.updateModalContent(mockData);
        this.downloadModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.downloadModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    generateMockVideoData() {
        const titles = [
            'Amazing Dance Moves 🔥',
            'Cooking Tutorial - Quick Recipe',
            'Travel Vlog - Beautiful Sunset',
            'Funny Pet Moments',
            'Workout Routine Tips',
            'Art Time-lapse Creation',
            'Music Performance',
            'Life Hack You Need to Know'
        ];

        const durations = ['8s', '12s', '15s', '18s', '25s', '30s'];
        const views = ['45K', '127K', '523K', '1.2M', '2.8M', '5.1M'];

        return {
            title: titles[Math.floor(Math.random() * titles.length)],
            duration: durations[Math.floor(Math.random() * durations.length)],
            views: views[Math.floor(Math.random() * views.length)]
        };
    }

    updateModalContent(data) {
        const videoTitle = this.downloadModal.querySelector('.video-title');
        const videoMeta = this.downloadModal.querySelector('.video-meta');

        if (videoTitle) {
            videoTitle.textContent = data.title;
        }
        if (videoMeta) {
            videoMeta.textContent = `Duration: ${data.duration} | Views: ${data.views}`;
        }
    }

    handleQualitySelection(option) {
        const quality = option.dataset.quality;
        
        // Visual feedback
        document.querySelectorAll('.quality-option').forEach(opt => {
            opt.style.background = '';
            opt.style.borderColor = '';
        });
        
        option.style.background = 'var(--color-bg-1)';
        option.style.borderColor = 'var(--color-primary)';

        // Simulate download with delay
        setTimeout(() => {
            this.simulateDownload(quality);
        }, 500);
    }

    simulateDownload(quality) {
        // Create a mock blob URL for demonstration
        const mockVideoContent = 'This is a demonstration. No actual video is downloaded.';
        const blob = new Blob([mockVideoContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Create temporary download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `instagram_reel_${quality}_demo.txt`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);

        // Show success message
        this.showSuccessMessage(quality);
        
        // Close modal after short delay
        setTimeout(() => {
            this.closeModal();
        }, 2000);
    }

    showSuccessMessage(quality) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span class="notification-text"> video downloading started (${quality})!</span>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation styles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .notification-icon {
                    font-size: 18px;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Helper method to clear input
    clearInput() {
        this.reelInput.value = '';
        this.hideError();
    }
}

// Additional utility functions
function addDemoExampleUrl() {
    const input = document.getElementById('reelUrl');
    const exampleUrls = [
        'https://www.instagram.com/reel/CXampleReel123/',
        'https://instagram.com/p/CXamplePost456/'
    ];
    
    const randomUrl = exampleUrls[Math.floor(Math.random() * exampleUrls.length)];
    input.value = randomUrl;
    input.dispatchEvent(new Event('input')); // Trigger input event to clear any errors
}

// Add some interactivity to feature cards
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Add scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and instruction steps
    const animatedElements = document.querySelectorAll('.feature-card, .instruction-step');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Add example URL functionality
function addExampleUrlFeature() {
    const input = document.getElementById('reelUrl');
    const placeholder = input.getAttribute('placeholder');
    
    // Add click handler to placeholder to auto-fill example
    input.addEventListener('focus', () => {
        if (!input.value) {
            setTimeout(() => {
                if (!input.value) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'example-tooltip';
                    tooltip.textContent = 'Click here to try with an example URL';
                    tooltip.style.cssText = `
                        position: absolute;
                        top: 100%;
                        left: 0;
                        background: var(--color-text);
                        color: var(--color-surface);
                        padding: 8px 12px;
                        border-radius: 4px;
                        font-size: 12px;
                        margin-top: 4px;
                        cursor: pointer;
                        z-index: 100;
                        animation: fadeIn 0.3s ease;
                    `;

                    const inputGroup = input.closest('.input-group');
                    inputGroup.style.position = 'relative';
                    inputGroup.appendChild(tooltip);

                    tooltip.addEventListener('click', () => {
                        addDemoExampleUrl();
                        inputGroup.removeChild(tooltip);
                    });

                    // Remove tooltip after 5 seconds or when input gets value
                    setTimeout(() => {
                        if (tooltip.parentNode && !input.value) {
                            inputGroup.removeChild(tooltip);
                        }
                    }, 5000);

                    const checkInput = () => {
                        if (input.value && tooltip.parentNode) {
                            inputGroup.removeChild(tooltip);
                        } else if (!input.value) {
                            setTimeout(checkInput, 100);
                        }
                    };
                    checkInput();
                }
            }, 1000);
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    const app = new ReelDownloader();
    
    // Initialize additional features
    initializeFeatureCards();
    initializeScrollAnimations();
    addExampleUrlFeature();
    
    // Add some console logs for demonstration
    console.log('🎬 Instagram Reel Downloader Demo Loaded');
    console.log('⚠️  This is a demonstration application only');
    console.log('📝 No actual downloads are performed');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus input
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('reelUrl').focus();
        }
    });
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ReelDownloader };
}