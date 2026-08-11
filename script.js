// ⚠️ CONFIGURACIÓN — reemplazá con tus datos reales antes de publicar
const WHATSAPP_NUMBER = "50688331566"; // formato: código de país + número, sin espacios ni +

// Contador de vistas (servicio gratuito, sin registro).
// El prefijo hace que tus contadores no choquen con los de otras personas.
const COUNTER_API = "https://countapi.mileshilliard.com/api/v1";
const COUNTER_PREFIX = "duende_nina_";

let allGames = [];
const viewCache = {}; // slug -> número de vistas ya conocido

function slugify(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // quita tildes
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60);
}

async function loadGames() {
  const res = await fetch('games.json');
  allGames = await res.json();
  render();
  cargarVistas();
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

// --- Contador de vistas -----------------------------------------------

function pintarVistas(slug, valor) {
  viewCache[slug] = valor;
  document.querySelectorAll(`.views[data-slug="${slug}"]`).forEach(el => {
    el.textContent = `👁 ${valor}`;
    el.classList.add('visible');
  });
}

// Carga escalonada: de a pocos a la vez, para no saturar el servicio.
async function cargarVistas() {
  const slugs = [...new Set(allGames.map(g => slugify(g.nombre)))];
  const LOTE = 4;
  for (let i = 0; i < slugs.length; i += LOTE) {
    await Promise.all(slugs.slice(i, i + LOTE).map(async slug => {
      if (viewCache[slug] !== undefined) return;
      try {
        const r = await fetch(`${COUNTER_API}/get/${COUNTER_PREFIX}${slug}`);
        if (!r.ok) return;
        const d = await r.json();
        if (typeof d.value === 'number') pintarVistas(slug, d.value);
      } catch (e) {
        // sin conexión o servicio caído: la tarjeta simplemente no muestra número
      }
    }));
    await new Promise(r => setTimeout(r, 250));
  }
}

async function registrarVista(slug) {
  // Sube el número de una vez en pantalla, aunque el servidor tarde
  pintarVistas(slug, (viewCache[slug] || 0) + 1);
  try {
    const r = await fetch(`${COUNTER_API}/hit/${COUNTER_PREFIX}${slug}`);
    if (!r.ok) return;
    const d = await r.json();
    if (typeof d.value === 'number') pintarVistas(slug, d.value);
  } catch (e) {
    // si falla, queda el número optimista hasta la próxima recarga
  }
}

// --- Render -----------------------------------------------------------

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

  catalog.innerHTML = games.map(g => {
    const slug = slugify(g.nombre);
    const vistas = viewCache[slug];
    return `
    <article class="card" data-slug="${slug}">
      <div class="card-photo">
        ${g.estado ? `<span class="badge ${g.estado}">${g.estado}</span>` : ''}
        <span class="views${vistas !== undefined ? ' visible' : ''}" data-slug="${slug}">${vistas !== undefined ? '👁 ' + vistas : ''}</span>
        <img src="${g.foto}" alt="${g.nombre}" loading="lazy"
             onerror="this.onerror=null;this.src='placeholder.svg';">
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
  `;}).join('');
}

// Un clic en la tarjeta cuenta como vista (excepto si es sobre "Consultar")
document.getElementById('catalog').addEventListener('click', e => {
  if (e.target.closest('.buy-btn')) return;
  const card = e.target.closest('.card');
  if (!card) return;
  const slug = card.dataset.slug;
  if (card.dataset.contada === '1') return;  // una vez por sesión y por tarjeta
  card.dataset.contada = '1';
  registrarVista(slug);
});

document.getElementById('search').addEventListener('input', render);
document.getElementById('filter-estado').addEventListener('change', render);
document.getElementById('sort').addEventListener('change', render);

loadGames();
