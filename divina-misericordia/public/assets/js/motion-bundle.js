/**
 * Motion Design Bundle - Paquete de Animaciones
 * Combina todos los módulos de motion design para inclusión fácil
 * 
 * Uso: <script src="js/motion-bundle.js"></script>
 */

// Cargar módulos de animación si no están cargados
(function() {
  'use strict';

  const modules = [
    'splash.js',
    'transitions.js', 
    'scroll-reveal.js',
    'parallax.js',
    'reading-progress.js',
    'particles.js'
  ];

  // Verificar si los módulos ya están cargados
  if (typeof ScrollReveal === 'undefined') {
    console.log('[MotionBundle] Cargando módulos de animación...');
    
    // Los módulos se cargan desde el HTML directamente
    // Esta función asegura el orden de inicialización
    document.addEventListener('DOMContentLoaded', function() {
      // Inicializar en orden
      if (window.SplashScreen) SplashScreen.init();
      if (window.PageTransitions) PageTransitions.init();
      if (window.ScrollReveal) ScrollReveal.init();
      if (window.ParallaxSpiritual) ParallaxSpiritual.init();
      if (window.ReadingProgress) ReadingProgress.init();
      if (window.SacredParticles) SacredParticles.init();
      
      console.log('[MotionBundle] Todos los módulos inicializados');
    });
  }
})();

// Función helper para aplicar clases reveal a elementos
window.applyReveal = function(selector, type) {
  document.querySelectorAll(selector).forEach(function(el) {
    el.classList.add('reveal-' + type);
  });
};