// Components - Header
// Este sistema permite centralizar header/footer/nav para no duplicar en 60+ páginas

const HEADER_TEMPLATE = `
<header>
  <a href="index.html" class="logo">
    <img src="img/logo_divina_misericordia.jpg" alt="Divina Misericordia" loading="lazy">
    <span>Jesús, En Vos Confío</span>
  </a>
  <nav id="mainNav">
    <!-- Navegación inyectada por el servidor desde index.js NAV_CONFIG -->
  </nav>
</header>
`;

function getHeaderComponent(paginaActual) {
  return HEADER_TEMPLATE.replace('<!-- Navegación inyectada por el servidor desde index.js NAV_CONFIG -->', 
    generarNavHTML(paginaActual));
}