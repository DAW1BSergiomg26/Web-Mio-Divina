// Componente de Navegación Centralizado
// Evita duplicación en 60+ páginas

const NAV_ITEMS = [
  { href: 'index.html', label: 'Inicio' },
  { href: 'quienes-somos.html', label: 'Quiénes Somos' },
  { href: 'introduccion.html', label: 'Introducción' },
  { href: 'santa-faustina.html', label: 'Santa Faustina' },
  { href: 'hora-de-la-misericordia.html', label: 'Hora de la Misericordia' },
  { href: 'coronilla.html', label: 'Coronilla' },
  { href: 'novena.html', label: 'Novena' },
  { href: 'via-crucis.html', label: 'Vía Crucis' },
  { href: 'oraciones.html', label: 'Oraciones' },
  { href: 'santo-rosario.html', label: 'El Santo Rosario' },
  { href: 'maria.html', label: 'María' },
  { href: 'obras-de-misericordia.html', label: 'Obras de Misericordia' },
  { href: 'consagracion.html', label: 'Consagración' },
  { href: 'lugares-de-culto.html', label: 'Lugares de Culto' },
  { href: 'musica-sacra.html', label: 'Música Sacra' },
  { href: 'noticias.html', label: 'Noticias' },
  { href: 'enlaces.html', label: 'Enlaces' }
];

const SPECIAL_ITEMS = [
  { href: 'virgen-caacupe.html', label: 'Virgen Caacupé', class: 'caacupe-btn' },
  { href: 'devociones-marianas.html', label: 'Devociones Marianas', class: 'devociones-btn' },
  { href: 'otras-devociones.html', label: 'Otras Devociones ✦', class: 'nav-otras-devociones' },
  { href: 'contacto.html', label: 'Contacto' }
];

function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  return filename;
}

function renderNav() {
  const navContainer = document.getElementById('mainNav');
  if (!navContainer) return;

  const currentPage = getCurrentPage();
  let html = '';

  // Menú principal
  NAV_ITEMS.forEach(item => {
    const activo = item.href === currentPage ? ' class="activo"' : '';
    html += `<a href="${item.href}"${activo}>${item.label}</a>`;
  });

  // Menú especial (botones)
  SPECIAL_ITEMS.forEach(item => {
    const activo = item.href === currentPage ? ' activo' : '';
    const classAttr = item.class ? ` class="${item.class}"` : '';
    html += `<a href="${item.href}"${classAttr}${activo}>${item.label}</a>`;
  });

  navContainer.innerHTML = html;
}

function renderNavOnLoad() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNav);
  } else {
    renderNav();
  }
}

// Auto-ejecutar si se cargacomo módulo o script
if (document.getElementById('mainNav')) {
  renderNavOnLoad();
}

// Export para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NAV_ITEMS, SPECIAL_ITEMS, renderNav, getCurrentPage };
}