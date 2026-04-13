/**
 * Galería de Arte Sacro Interactiva
 * Museo virtual dentro de la web
 */
(function() {
  'use strict';

  const SacredGallery = {
    galleryContainer: null,
    images: [],
    currentImage: null,
    
    init(containerSelector, images = []) {
      this.galleryContainer = document.querySelector(containerSelector);
      if (!this.galleryContainer) return;
      
      this.images = images;
      this.createStyles();
      this.render();
    },

    createStyles() {
      if (document.getElementById('sacred-gallery-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'sacred-gallery-styles';
      style.textContent = `
        .sacred-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 60px;
          padding: 40px;
          background: #050d1a;
        }
        .sacred-gallery-item {
          position: relative;
          cursor: pointer;
          transition: all 0.4s ease;
          opacity: 0.9;
        }
        .sacred-gallery-item:hover {
          opacity: 1;
          transform: translateY(-5px);
        }
        .sacred-gallery-item::before {
          content: '';
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle at center, rgba(212,175,55,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .sacred-gallery-item:hover::before {
          opacity: 1;
        }
        .sacred-gallery-item img {
          width: 100%;
          height: auto;
          border: 2px solid rgba(212,175,55,0.3);
          border-radius: 4px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .sacred-gallery-item .caption {
          margin-top: 15px;
          font-family: 'Cinzel', serif;
          font-size: 0.9rem;
          color: rgba(250,247,240,0.8);
          text-align: center;
        }
        .gallery-lightbox {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 99999;
          display: none;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .gallery-lightbox.active {
          display: flex;
          opacity: 1;
        }
        .gallery-lightbox-content {
          display: flex;
          max-width: 90vw;
          max-height: 90vh;
          gap: 40px;
        }
        .gallery-lightbox-image {
          max-width: 60vw;
          max-height: 80vh;
          object-fit: contain;
        }
        .gallery-lightbox-info {
          max-width: 300px;
          color: #faf7f0;
          padding: 20px;
        }
        .gallery-lightbox-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: 1.5rem;
          color: #d4af37;
          margin-bottom: 10px;
        }
        .gallery-lightbox-date {
          font-size: 0.85rem;
          color: rgba(250,247,240,0.6);
          margin-bottom: 20px;
        }
        .gallery-lightbox-text {
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(250,247,240,0.8);
          margin-bottom: 20px;
        }
        .gallery-lightbox-verse {
          font-style: italic;
          color: #d4af37;
          padding: 15px;
          background: rgba(212,175,55,0.1);
          border-left: 3px solid #d4af37;
        }
        .gallery-lupa {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 3px solid #d4af37;
          border-radius: 50%;
          pointer-events: none;
          display: none;
          background-repeat: no-repeat;
          box-shadow: 0 0 20px rgba(212,175,55,0.5);
        }
        .gallery-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: rgba(212,175,55,0.2);
          border: 1px solid rgba(212,175,55,0.5);
          border-radius: 50%;
          color: #d4af37;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
        }
        @media (max-width: 800px) {
          .gallery-lightbox-content {
            flex-direction: column;
          }
          .gallery-lightbox-info {
            max-width: 90vw;
          }
        }
      `;
      document.head.appendChild(style);
    },

    render() {
      this.galleryContainer.innerHTML = this.images.map((img, i) => `
        <div class="sacred-gallery-item" data-index="${i}">
          <img src="${img.src}" alt="${img.alt}" loading="lazy">
          <div class="caption">${img.title}</div>
        </div>
      `).join('');
      
      this.galleryContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.sacred-gallery-item');
        if (item) {
          const index = item.dataset.index;
          this.openLightbox(this.images[index]);
        }
      });
      
      this.createLightbox();
    },

    createLightbox() {
      const lightbox = document.createElement('div');
      lightbox.className = 'gallery-lightbox';
      lightbox.innerHTML = `
        <button class="gallery-close-btn">✕</button>
        <div class="gallery-lightbox-content">
          <img class="gallery-lightbox-image" src="" alt="">
          <div class="gallery-lightbox-info">
            <h2 class="gallery-lightbox-title"></h2>
            <p class="gallery-lightbox-date"></p>
            <p class="gallery-lightbox-text"></p>
            <div class="gallery-lightbox-verse"></div>
          </div>
        </div>
      `;
      document.body.appendChild(lightbox);
      
      lightbox.querySelector('.gallery-close-btn').addEventListener('click', () => this.closeLightbox());
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) this.closeLightbox();
      });
      
      this.lightbox = lightbox;
    },

    openLightbox(imgData) {
      const lightbox = this.lightbox;
      lightbox.querySelector('.gallery-lightbox-image').src = imgData.src;
      lightbox.querySelector('.gallery-lightbox-image').alt = imgData.alt;
      lightbox.querySelector('.gallery-lightbox-title').textContent = imgData.title;
      lightbox.querySelector('.gallery-lightbox-date').textContent = imgData.date || '';
      lightbox.querySelector('.gallery-lightbox-text').textContent = imgData.description || '';
      lightbox.querySelector('.gallery-lightbox-verse').textContent = imgData.verse || '';
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
      this.lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.SacredGallery = SacredGallery;
  console.log('🖼️ Sacred Gallery module loaded');
})();