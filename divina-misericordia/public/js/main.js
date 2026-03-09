// Men�: solo una pesta�a "encendida" a la vez, controlado por clic
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-inner a');
  const menuToggle = document.querySelector('.menu-toggle');
  const navOscura = document.querySelector('.nav-oscura');

  function marcarSoloEste(linkActivo) {
    navLinks.forEach(link => link.classList.remove('activo'));
    linkActivo.classList.add('activo');
  }

  // Estado inicial: marcamos la primera pesta�a (Introducci�n)
  if (navLinks.length > 0) {
    marcarSoloEste(navLinks[0]);
  }

  // Cada clic en el men� enciende solo esa pesta�a
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      marcarSoloEste(link);
      // Close mobile menu when link clicked
      if (window.innerWidth <= 768) {
        navOscura.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      }
    });
  });

  // Mobile menu toggle
  if (menuToggle && navOscura) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.setAttribute('aria-label', isExpanded ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
      navOscura.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          !navOscura.contains(e.target) && 
          !menuToggle.contains(e.target) &&
          navOscura.classList.contains('active')) {
        navOscura.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOscura.classList.contains('active')) {
        navOscura.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        menuToggle.focus();
      }
    });
  }

  // Búsqueda en la sidebar
  const searchForm = document.querySelector('.searchform');
  const searchInput = document.getElementById('s-sidebar');
  
  if (searchForm && searchInput) {
    const secciones = [
      { nombre: 'introduccion', texto: ['introducción', 'intro'] },
      { nombre: 'quienes-somos', texto: ['quiénes somos', 'quienes', 'somos'] },
      { nombre: 'hora-de-la-misericordia', texto: ['hora', 'misericordia', 'hora de la misericordia'] },
      { nombre: 'coronilla', texto: ['coronilla'] },
      { nombre: 'los-rayos', texto: ['rayos', 'los rayos', 'rayo'] },
      { nombre: 'galeria', texto: ['galería', 'galeria', 'fotos'] },
      { nombre: 'oraciones', texto: ['oraciones', 'oracion', 'orar'] },
      { nombre: 'noticias', texto: ['noticias', 'noticia', 'news'] },
      { nombre: 'contacto', texto: ['contacto', 'contactar'] }
    ];

    function buscarSeccion(termino) {
      const busqueda = termino.toLowerCase().trim();
      for (const seccion of secciones) {
        for (const palabra of seccion.texto) {
          if (busqueda.includes(palabra)) {
            return seccion.nombre + '.html';
          }
        }
      }
      return null;
    }

    function mostrarMensajeError(mensaje) {
      let msgElement = searchForm.querySelector('.mensaje-busqueda');
      if (!msgElement) {
        msgElement = document.createElement('p');
        msgElement.className = 'mensaje-busqueda';
        msgElement.style.cssText = 'color: #ff6b7a; font-size: 0.85rem; margin-top: 0.5rem;';
        searchForm.appendChild(msgElement);
      }
      msgElement.textContent = mensaje;
    }

    function limpiarMensajeError() {
      const msgElement = searchForm.querySelector('.mensaje-busqueda');
      if (msgElement) {
        msgElement.remove();
      }
    }

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const termino = searchInput.value;
      
      if (!termino.trim()) {
        return;
      }

      const resultado = buscarSeccion(termino);
      
      if (resultado) {
        limpiarMensajeError();
        window.location.href = resultado;
      } else {
        mostrarMensajeError('No se encontró ninguna sección con ese nombre.');
      }
    });

    searchInput.addEventListener('input', () => {
      limpiarMensajeError();
    });
  }

  // L�gica bot�n "Volver arriba"
  const btnTop = document.getElementById('volver-arriba');

  if (btnTop) {
    function actualizarBotonTop() {
      if (window.scrollY > 200) {
        btnTop.classList.add('visible');
      } else {
        btnTop.classList.remove('visible');
      }
    }

    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', actualizarBotonTop);
    actualizarBotonTop();
  }
});
