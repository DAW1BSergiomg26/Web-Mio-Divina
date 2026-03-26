// Menú: solo una pestaña "encendida" a la vez, controlado por clic
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-inner a');

  function marcarSoloEste(linkActivo) {
    navLinks.forEach(link => link.classList.remove('activo'));
    linkActivo.classList.add('activo');
  }

  // Estado inicial: marcamos la primera pestaña (Introducción)
  if (navLinks.length > 0) {
    marcarSoloEste(navLinks[0]);
  }

  // Cada clic en el menú enciende solo esa pestaña
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      marcarSoloEste(link);
    });
  });

  // Lógica botón "Volver arriba"
  const btnTop = document.getElementById('volver-arriba');

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
});
