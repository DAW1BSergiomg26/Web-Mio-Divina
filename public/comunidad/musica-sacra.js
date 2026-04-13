(function() {
  const container = document.getElementById('tracks-container');
  const nav = document.getElementById('filter-nav');
  const searchInput = document.getElementById('search-input');
  let currentCategory = 'Todas';
  let searchQuery = '';

  function init() {
    renderCategories();
    renderTracks();
    
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderTracks();
    });
  }

  function renderCategories() {
    const cats = ['Todas', ...AudioCatalog.getCategories().map(c => c.category)];
    nav.innerHTML = cats.map(cat => `
      <button class="filter-btn ${cat === currentCategory ? 'active' : ''}" data-cat="${cat}">
        ${cat.replace(/[\u{1F600}-\u{1F64F}]/u, '')}
      </button>
    `).join('');

    nav.addEventListener('click', e => {
      if (!e.target.matches('.filter-btn')) return;
      currentCategory = e.target.dataset.cat;
      renderCategories();
      renderTracks();
    });
  }

  function renderTracks() {
    const all = AudioCatalog.getCategories();
    let filtered = currentCategory === 'Todas' 
      ? all.flatMap(c => c.tracks)
      : all.find(c => c.category === currentCategory)?.tracks || [];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchQuery) || 
        t.artist.toLowerCase().includes(searchQuery)
      );
    }

    // Sort alphabetically
    filtered.sort((a, b) => a.title.localeCompare(b.title));

    container.innerHTML = filtered.map(track => `
      <div class="track-card" onclick="playTrack('${track.src}')">
        <h3>${track.title}</h3>
        <p>${track.artist}</p>
        ${track.duration ? `<small>Duración: ${track.duration}</small>` : ''}
      </div>
    `).join('');
  }

  window.playTrack = (src) => {
    EventBus.publish('play-audio', { src });
  };

  init();
})();
