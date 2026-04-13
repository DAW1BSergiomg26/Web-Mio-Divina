/**
 * Motor de Búsqueda Sagrada v1.0
 * Asociación Apóstoles de la Divina Misericordia
 */

const PRAYERS_INDEX = [
    { title: "Coronilla a la Divina Misericordia", path: "liturgia/coronilla.html", tags: ["jesus", "misericordia", "3pm"] },
    { title: "Vía Crucis", path: "liturgia/via-crucis.html", tags: ["pasion", "cuaresma", "jesus"] },
    { title: "Santo Rosario", path: "devociones/rosario/santo-rosario.html", tags: ["maria", "virgen", "misterios"] },
    { title: "Oración de San Benito", path: "devociones/santos/san-benito.html", tags: ["proteccion", "santo", "exorcismo"] },
    { title: "Oración a San José", path: "devociones/santos/san-jose.html", tags: ["familia", "santo", "trabajo"] },
    { title: "Novena a la Divina Misericordia", path: "novena.html", tags: ["fiesta", "9 dias", "jesus"] },
    { title: "Oración del Estudiante", path: "oraciones/oracion-del-estudiante.html", tags: ["estudios", "examenes", "sabiduria"] },
    { title: "Oración de San Miguel Arcángel", path: "oraciones/oracion-san-miguel.html", tags: ["combate", "proteccion", "angeles"] }
];

function initSearch() {
    const input = document.getElementById('prayer-search-input');
    const resultsContainer = document.getElementById('search-results');

    if (!input || !resultsContainer) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = PRAYERS_INDEX.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.tags.some(t => t.includes(query))
        );

        displayResults(filtered);
    });

    // Mostrar todos al inicio
    displayResults(PRAYERS_INDEX);
}

function displayResults(prayers) {
    const container = document.getElementById('search-results');
    container.innerHTML = prayers.map(p => `
        <a href="../${p.path}" class="prayer-card">
            <h3>${p.title}</h3>
            <p style="font-size: 0.8rem; opacity: 0.6;">Etiquetas: ${p.tags.join(', ')}</p>
        </a>
    `).join('');
}

document.addEventListener('DOMContentLoaded', initSearch);
