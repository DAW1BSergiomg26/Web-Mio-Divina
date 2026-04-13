// Biblia Interactiva - Funcionalidad
(function() {
  let testamentoActual = 'nt';
  let libroActual = null;
  let capituloActual = 1;
  
  // Inicializar
  function init() {
    crearEventListeners();
    cargarLibros('nt');
  }
  
  // Crear event listeners
  function crearEventListeners() {
    const testamentoSelect = document.getElementById('biblia-testamento');
    const libroSelect = document.getElementById('biblia-libro');
    const capituloSelect = document.getElementById('biblia-capitulo');
    const versiculoSelect = document.getElementById('biblia-versiculo');
    const buscarInput = document.getElementById('biblia-buscar');
    const buscarBtn = document.getElementById('biblia-buscar-btn');
    
    if (testamentoSelect) {
      testamentoSelect.addEventListener('change', function() {
        testamentoActual = this.value;
        cargarLibros(testamentoActual);
      });
    }
    
    if (libroSelect) {
      libroSelect.addEventListener('change', function() {
        libroActual = this.value;
        cargarCapitulos();
      });
    }
    
    if (capituloSelect) {
      capituloSelect.addEventListener('change', function() {
        capituloActual = parseInt(this.value);
        cargarVersiculos();
      });
    }
    
    if (versiculoSelect) {
      versiculoSelect.addEventListener('change', function() {
        mostrarVersiculo();
      });
    }
    
    if (buscarBtn && buscarInput) {
      buscarBtn.addEventListener('click', buscarTexto);
      buscarInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') buscarTexto();
      });
    }
  }
  
  // Cargar libros según testamento
  function cargarLibros(testamento) {
    const libroSelect = document.getElementById('biblia-libro');
    const capituloSelect = document.getElementById('biblia-capitulo');
    const versiculoSelect = document.getElementById('biblia-versiculo');
    const contenido = document.getElementById('biblia-contenido');
    
    if (!libroSelect) return;
    
    // Limpiar selects
    libroSelect.innerHTML = '<option value="">Seleccionar libro</option>';
    capituloSelect.innerHTML = '<option value="">Capítulo</option>';
    versiculoSelect.innerHTML = '<option value="">Versículo</option>';
    
    if (contenido) {
      contenido.innerHTML = '<p class="biblia-placeholder">Selecciona un libro para comenzar</p>';
    }
    
    // Cargar libros
    const libros = bibliaData[testamento].libros;
    libros.forEach((libro, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = libro.nombre;
      libroSelect.appendChild(option);
    });
    
    // Actualizar label
    const testamentoLabel = document.getElementById('testamento-label');
    if (testamentoLabel) {
      testamentoLabel.textContent = bibliaData[testamento].nombre;
    }
  }
  
  // Cargar capítulos según libro
  function cargarCapitulos() {
    const capituloSelect = document.getElementById('biblia-capitulo');
    const versiculoSelect = document.getElementById('biblia-versiculo');
    const contenido = document.getElementById('biblia-contenido');
    
    if (!capituloSelect || libroActual === null) return;
    
    capituloSelect.innerHTML = '<option value="">Capítulo</option>';
    versiculoSelect.innerHTML = '<option value="">Versículo</option>';
    
    const libros = bibliaData[testamentoActual].libros;
    const libro = libros[libroActual];
    
    for (let i = 1; i <= libro.capitulos; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = 'Capítulo ' + i;
      capituloSelect.appendChild(option);
    }
    
    capituloActual = 1;
    cargarVersiculos();
  }
  
  // Cargar versículos
  function cargarVersiculos() {
    const versiculoSelect = document.getElementById('biblia-versiculo');
    const contenido = document.getElementById('biblia-contenido');
    
    if (!versiculoSelect || libroActual === null) return;
    
    versiculoSelect.innerHTML = '<option value="">Versículo</option>';
    
    // Generar versículos (número fijo para simplificar)
    const maxVersiculos = 50;
    
    for (let i = 1; i <= maxVersiculos; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = 'Versículo ' + i;
      versiculoSelect.appendChild(option);
    }
    
    // Mostrar mensaje
    if (contenido) {
      const libros = bibliaData[testamentoActual].libros;
      const libro = libros[libroActual];
      contenido.innerHTML = '<p class="biblia-placeholder">Libro: ' + libro.nombre + ' - Capítulo ' + capituloActual + '<br>Selecciona un versículo para ver el texto</p>';
    }
  }
  
  // Mostrar versículo (placeholder - en producción vendría de API)
  function mostrarVersiculo() {
    const versiculo = document.getElementById('biblia-versiculo').value;
    const contenido = document.getElementById('biblia-contenido');
    
    if (!contenido || !versiculo) return;
    
    const libros = bibliaData[testamentoActual].libros;
    const libro = libros[libroActual];
    
    // Texto de ejemplo (en producción vendría de una API o base de datos)
    const textoEjemplo = getTextoBiblia(libro.abreviado, capituloActual, versiculo);
    
    contenido.innerHTML = `
      <div class="biblia-versiculo-display">
        <div class="biblia-referencia">${libro.nombre} ${capituloActual}:${versiculo}</div>
        <div class="biblia-texto">${textoEjemplo}</div>
      </div>
    `;
  }
  
  // Obtener texto desde bibliaData
  function getTextoBiblia(libroAbrev, capitulo, versiculo) {
    // Buscar en todos los testamentos
    for (const [key, data] of Object.entries(bibliaData)) {
      const libroEncontrado = data.libros.find(l => 
        l.abreviado.toLowerCase() === libroAbrev.toLowerCase() ||
        l.nombre.toLowerCase().includes(libroAbrev.toLowerCase())
      );
      
      if (libroEncontrado && libroEncontrado.contenido && libroEncontrado.contenido[capitulo]) {
        const versiculoData = libroEncontrado.contenido[capitulo].find(v => v.v === parseInt(versiculo));
        if (versiculoData) {
          return versiculoData.t;
        }
      }
    }
    
    return `[${libroAbrev} ${capitulo}:${versiculo}]<br><em>Texto de ejemplo. Para leer la Biblia Católica completa, visita:</em><br><a href="https://www.biblegateway.com/versions/" target="_blank">📖 BibleGateway</a><br><a href="https://www.catholic.org/bible/" target="_blank">📖 Catholic.org Bible</a><br><a href="https://www.ewtnnews.com/our-faith/daily-readings" target="_blank">📖 EWTN Lecturas</a>`;
  }
  
  // Buscar texto
  function buscarTexto() {
    const buscarInput = document.getElementById('biblia-buscar');
    const contenido = document.getElementById('biblia-contenido');
    const termino = buscarInput.value.trim().toLowerCase();
    
    if (!contenido || !termino) return;
    
    // Resultados de búsqueda simulados
    const resultados = [
      { libro: 'Juan', capitulo: 3, versiculo: 16, texto: 'Porque tanto amó Dios al mundo, que dio a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna.' },
      { libro: 'Romanos', capitulo: 8, versiculo: 28, texto: 'Y sabemos que todas las cosas cooperan para el bien de los que aman a Dios, que son llamados según su propósito.' },
      { libro: '1 Corintios', capitulo: 13, versiculo: 4, texto: 'El amor es sufrido, es benigno; el amor no tiene envidia; el amor no se jacta, no se envanece.' },
      { libro: 'Efesios', capitulo: 4, versiculo: 32, texto: 'Antes sed benignos unos con otros, misericordiosos, perdónanse mutuamente, así como Dios os perdonó en Cristo.' },
      { libro: 'Mateo', capitulo: 5, versiculo: 9, texto: 'Bienaventurados los pacificadores, porque ellos serán llamados hijos de Dios.' }
    ];
    
    const filtered = resultados.filter(r => r.texto.toLowerCase().includes(termino));
    
    if (filtered.length > 0) {
      let html = '<div class="biblia-resultados"><h4>Resultados de búsqueda para "' + termino + '":</h4>';
      filtered.forEach(r => {
        html += '<div class="biblia-resultado-item" onclick="selectBiblia(\'' + r.libro + '\', ' + r.capitulo + ', ' + r.versiculo + ')">';
        html += '<strong>' + r.libro + ' ' + r.capitulo + ':' + r.versiculo + '</strong>';
        html += '<p>' + r.texto + '</p>';
        html += '</div>';
      });
      html += '</div>';
      contenido.innerHTML = html;
    } else {
      contenido.innerHTML = '<p class="biblia-placeholder">No se encontraron resultados para "' + termino + '".<br>Prueba con: amor, fe, esperanza, Dios, Jesús</p>';
    }
  }
  
  // Función global para seleccionar desde resultados
  window.selectBiblia = function(libro, capitulo, versiculo) {
    // Buscar el libro en los datos
    let testamento = null;
    let libroIndex = null;
    
    for (const [key, data] of Object.entries(bibliaData)) {
      const idx = data.libros.findIndex(l => l.nombre.toLowerCase().includes(libro.toLowerCase()) || l.abreviado.toLowerCase().includes(libro.toLowerCase()));
      if (idx !== -1) {
        testamento = key;
        libroIndex = idx;
        break;
      }
    }
    
    if (testamento && libroIndex !== null) {
      document.getElementById('biblia-testamento').value = testamento;
      testamentoActual = testamento;
      cargarLibros(testamento);
      
      setTimeout(() => {
        document.getElementById('biblia-libro').value = libroIndex;
        libroActual = libroIndex;
        cargarCapitulos();
        
        setTimeout(() => {
          document.getElementById('biblia-capitulo').value = capitulo;
          capituloActual = capitulo;
          cargarVersiculos();
          
          setTimeout(() => {
            document.getElementById('biblia-versiculo').value = versiculo;
            mostrarVersiculo();
          }, 100);
        }, 100);
      }, 100);
    }
  };
  
  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
