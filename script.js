// ⚠️ CONFIGURACIÓN — reemplazá con tus datos reales antes de publicar
const WHATSAPP_NUMBER = "50600000000"; // formato: código de país + número, sin espacios ni +

let allGames = [];

async function loadGames() {
  const res = await fetch('games.json');
  allGames = await res.json();
  render();
}

function formatPrice(n) {
  if (n === null || n === undefined || n === '') return 'Precio a consultar';
  return '₡' + n.toLocaleString('es-CR');
}

function whatsappLink(game) {
  const precioTxt = (game.precio === null || game.precio === undefined || game.precio === '')
    ? ''
    : ` (${formatPrice(game.precio)})`;
  const msg = `Hola! Me interesa el juego "${game.nombre}"${precioTxt} que vi en El Duende y la Niña.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function render() {
  const catalog = document.getElementById('catalog');
  const query = document.getElementById('search').value.trim().toLowerCase();
  const estado = document.getElementById('filter-estado').value;
  const sort = document.getElementById('sort').value;

  let games = allGames.filter(g => {
    const matchesQuery = g.nombre.toLowerCase().includes(query);
    const matchesEstado = !estado || g.estado === estado || !g.estado;
    return matchesQuery && matchesEstado;
  });

  games = games.sort((a, b) => {
    if (sort === 'precio-asc') return a.precio - b.precio;
    if (sort === 'precio-desc') return b.precio - a.precio;
    return a.nombre.localeCompare(b.nombre, 'es');
  });

  if (games.length === 0) {
    catalog.innerHTML = `<p class="empty-state">No encontré ningún juego con esa búsqueda.</p>`;
    return;
  }

  catalog.innerHTML = games.map(g => `
    <article class="card">
      <div class="card-photo">
        ${g.estado ? `<span class="badge ${g.estado}">${g.estado}</span>` : ''}
        <img src="${g.foto}" alt="${g.nombre}" loading="lazy"
             onerror="this.onerror=null;this.src='assets/placeholder.svg';">
      </div>
      <div class="card-body">
        <h3>${g.nombre}</h3>
        <p class="meta">${g.jugadores ? g.jugadores + ' jugadores' : ''}${g.jugadores && g.edad ? ' · ' : ''}${g.edad || ''}</p>
        <p class="desc">${g.descripcion || ''}</p>
        <div class="card-footer">
          <span class="price">${formatPrice(g.precio)}</span>
          <a class="buy-btn" href="${whatsappLink(g)}" target="_blank" rel="noopener">Consultar</a>
        </div>
      </div>
    </article>
  `).join('');
}

document.getElementById('search').addEventListener('input', render);
document.getElementById('filter-estado').addEventListener('change', render);
document.getElementById('sort').addEventListener('change', render);

loadGames();
