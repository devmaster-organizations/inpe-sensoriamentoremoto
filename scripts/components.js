// SPA ultra simples: carrega fragmentos HTML no #app conforme o hash da URL
// Convenção de arquivos: '#/slug' -> 'componentes/page/slug/slug.html'

// --- Configuração rápida ---
const DEFAULT_ROUTE = 'home';
const NOTFOUND_ROTER = 'notfound'
const PAGES_DIR = 'componentes/page';
const OUTLET_SELECTOR = '#app, [data-router-outlet]';

// Inclui trechos HTML onde houver o atributo include-html
async function includeHTML() {
  // Processa em "ondas" até não existirem mais includes (suporta includes aninhados)
  while (true) {
    const elements = document.querySelectorAll('[include-html]');
    if (elements.length === 0) break;
    for (const el of elements) {
      const file = el.getAttribute('include-html');
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error('Erro ao carregar ' + file);
        const html = await res.text();
        const fragment = document.createRange().createContextualFragment(html);
        el.parentNode.insertBefore(fragment, el);
        el.parentNode.removeChild(el);
      } catch (err) {
        el.innerHTML = `<span style="color:red">${err.message}</span>`;
        el.removeAttribute('include-html');
      }
    }
  }
}

// Lê o slug atual do hash (ex.: '#/sobre' -> 'sobre')
function getRouteSlug() {
  const h = (window.location.hash || '').trim();
  const slug = h.replace(/^#\/?/, '');
  return slug || DEFAULT_ROUTE;
}

// Monta o caminho do arquivo da página
function resolvePagePath(slug) {
  return `${PAGES_DIR}/${slug}/${slug}.html`;
}

// Destaca o link ativo no header (adiciona .is-active)
function updateActiveNav(slug) {
  const links = document.querySelectorAll('header .fullbtn a[href^="#/"]');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === `#/${slug}`) a.classList.add('is-active');
    else a.classList.remove('is-active');
  });
}

// Carrega o HTML da página atual dentro do outlet
async function renderPage() {
  const outlet = document.querySelector(OUTLET_SELECTOR);
  if (!outlet) return;
  const slug = getRouteSlug();
  let url = resolvePagePath(slug);
  try {
    let res = await fetch(url);
    if (!res.ok) {
      // Se a página não existe, tenta a rota padrão
      url = resolvePagePath(NOTFOUND_ROTER);
      res = await fetch(url);
    }
    outlet.innerHTML = await res.text();
    // Permite que páginas carregadas também usem includes
    await includeHTML();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    outlet.innerHTML = `<div style="color:red; padding:16px">${e.message}</div>`;
  }
  updateActiveNav(slug);
}

function init() {
  includeHTML().then(renderPage);
}

window.addEventListener('hashchange', renderPage);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}