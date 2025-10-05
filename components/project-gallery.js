/**
 * Project Gallery Component
 * Image gallery with lightbox functionality for project images
 */

class ProjectGallery {
  constructor(container, images, options = {}) {
    this.container = container;
    this.images = images || [];
    this.currentIndex = 0;
    this.options = {
      showThumbnails: true,
      showCaptions: true,
      enableKeyboard: true,
      enableSwipe: true,
      transitionDuration: 300,
      thumbnailSize: 'medium', // small, medium, large
      ...options
    };
    this.lightbox = null;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const galleryHTML = this.createGalleryHTML();
    this.container.innerHTML = galleryHTML;
  }

  createGalleryHTML() {
    if (!this.images || this.images.length === 0) {
      return `
        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p>No images available for this project.</p>
        </div>
      `;
    }

    const mainImageHTML = this.createMainImageHTML();
    const thumbnailsHTML = this.options.showThumbnails ? this.createThumbnailsHTML() : '';

    return `
      <div class="project-gallery">
        <div class="gallery-main">
          ${mainImageHTML}
        </div>
        ${thumbnailsHTML}
      </div>
    `;
  }

  createMainImageHTML() {
    const mainImage = this.images[0];
    const caption = this.options.showCaptions && mainImage.caption 
      ? `<p class="text-sm text-gray-600 dark:text-gray-400 mt-2">${mainImage.caption}</p>`
      : '';

    return `
      <div class="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <img 
          src="${mainImage.src}" 
          alt="${mainImage.alt || 'Project image'}" 
          class="gallery-main-image w-full h-auto cursor-pointer transition-transform duration-300 hover:scale-105"
          data-index="0"
        >
        <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 cursor-pointer flex items-center justify-center">
          <div class="bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 rounded-full p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
            </svg>
          </div>
        </div>
        ${this.images.length > 1 ? `
          <div class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            1 / ${this.images.length}
          </div>
        ` : ''}
      </div>
      ${caption}
    `;
  }

  createThumbnailsHTML() {
    if (this.images.length <= 1) return '';

    const thumbnailSizeClass = this.getThumbnailSizeClass();
    
    const thumbnails = this.images.map((image, index) => `
      <div class="gallery-thumbnail ${thumbnailSizeClass} ${index === 0 ? 'active' : ''}" data-index="${index}">
        <img 
          src="${image.src}" 
          alt="${image.alt || `Thumbnail ${index + 1}`}" 
          class="w-full h-full object-cover rounded cursor-pointer transition-all duration-300 hover:opacity-80"
        >
      </div>
    `).join('');

    return `
      <div class="gallery-thumbnails mt-4 flex gap-2 overflow-x-auto pb-2">
        ${thumbnails}
      </div>
    `;
  }

  getThumbnailSizeClass() {
    switch (this.options.thumbnailSize) {
      case 'small':
        return 'w-16 h-16';
      case 'large':
        return 'w-32 h-32';
      default: // medium
        return 'w-24 h-24';
    }
  }

  attachEventListeners() {
    // Main image click to open lightbox
    const mainImage = this.container.querySelector('.gallery-main-image');
    if (mainImage) {
      mainImage.addEventListener('click', () => this.openLightbox(0));
    }

    // Thumbnail clicks
    const thumbnails = this.container.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.setActiveImage(index);
        this.openLightbox(index);
      });
    });

    // Keyboard navigation
    if (this.options.enableKeyboard) {
      document.addEventListener('keydown', (e) => {
        if (this.lightbox) {
          this.handleKeyboardNavigation(e);
        }
      });
    }
  }

  setActiveImage(index) {
    if (index < 0 || index >= this.images.length) return;
    
    this.currentIndex = index;
    const mainImage = this.container.querySelector('.gallery-main-image');
    const image = this.images[index];
    
    if (mainImage) {
      mainImage.src = image.src;
      mainImage.alt = image.alt || 'Project image';
      mainImage.dataset.index = index;
    }

    // Update caption
    if (this.options.showCaptions) {
      const captionElement = this.container.querySelector('.text-sm.text-gray-600');
      if (captionElement && image.caption) {
        captionElement.textContent = image.caption;
      }
    }

    // Update counter
    const counter = this.container.querySelector('.absolute.bottom-4.left-4');
    if (counter) {
      counter.textContent = `${index + 1} / ${this.images.length}`;
    }

    // Update active thumbnail
    const thumbnails = this.container.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.createLightbox();
    this.showLightboxImage(index);
    this.attachLightboxListeners();
  }

  createLightbox() {
    // Create lightbox container
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center';
    this.lightbox.innerHTML = `
      <div class="relative max-w-7xl max-h-full p-4">
        <button class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <button class="lightbox-prev absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <button class="lightbox-next absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        <div class="lightbox-image-container">
          <img src="" alt="" class="lightbox-image max-w-full max-h-full object-contain">
          <div class="lightbox-caption text-white text-center mt-4"></div>
          <div class="lightbox-counter text-white text-sm text-center mt-2"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.lightbox);
  }

  showLightboxImage(index) {
    const image = this.images[index];
    const lightboxImage = this.lightbox.querySelector('.lightbox-image');
    const caption = this.lightbox.querySelector('.lightbox-caption');
    const counter = this.lightbox.querySelector('.lightbox-counter');
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');
    
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt || 'Project image';
    
    if (this.options.showCaptions && image.caption) {
      caption.textContent = image.caption;
      caption.style.display = 'block';
    } else {
      caption.style.display = 'none';
    }
    
    counter.textContent = `${index + 1} / ${this.images.length}`;
    
    // Show/hide navigation buttons
    prevBtn.style.display = index > 0 ? 'block' : 'none';
    nextBtn.style.display = index < this.images.length - 1 ? 'block' : 'none';
  }

  attachLightboxListeners() {
    // Close button
    const closeBtn = this.lightbox.querySelector('button:first-child');
    closeBtn.addEventListener('click', () => this.closeLightbox());
    
    // Navigation buttons
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');
    
    prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
    nextBtn.addEventListener('click', () => this.navigateLightbox(1));
    
    // Background click to close
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });
    
    // Swipe gestures
    if (this.options.enableSwipe) {
      this.attachSwipeGestures();
    }
  }

  attachSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    this.lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipeGesture(touchStartX, touchEndX);
    });
  }

  handleSwipeGesture(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        this.navigateLightbox(1);
      } else {
        // Swipe right - previous image
        this.navigateLightbox(-1);
      }
    }
  }

  navigateLightbox(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.images.length) {
      this.currentIndex = newIndex;
      this.showLightboxImage(newIndex);
    }
  }

  handleKeyboardNavigation(e) {
    switch (e.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.navigateLightbox(-1);
        break;
      case 'ArrowRight':
        this.navigateLightbox(1);
        break;
    }
  }

  closeLightbox() {
    if (this.lightbox) {
      document.body.removeChild(this.lightbox);
      this.lightbox = null;
    }
  }

  // Method to update images
  updateImages(newImages) {
    this.images = newImages;
    this.currentIndex = 0;
    this.render();
    this.attachEventListeners();
  }

  // Method to update options
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.render();
    this.attachEventListeners();
  }

  // Cleanup method
  destroy() {
    this.closeLightbox();
    this.container.innerHTML = '';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectGallery;
}