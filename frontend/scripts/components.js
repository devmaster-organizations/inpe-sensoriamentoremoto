// SPA ultra simples: carrega fragmentos HTML no #app conforme o hash da URL
// Convenção de arquivos: '#/slug' -> 'componentes/page/slug/slug.html'

// --- Configuração rápida ---
const DEFAULT_ROUTE = 'home';
const NOTFOUND_ROTER = 'notfound'
const PAGES_DIR = 'componentes/page';
const OUTLET_SELECTOR = '#app, [data-router-outlet]';
const PAGE_STYLE_ID = 'page-style';

// carrega CSS da página atual dinamicamente e remove o anterior
function setPageStyle(slug) {
  const href = `${PAGES_DIR}/${slug}/${slug}.css?v=${Date.now()}`; // cache-bust to avoid stale CSS
  // remove style anterior, se houver
  const prev = document.getElementById(PAGE_STYLE_ID);
  if (prev) prev.remove();
  // cria novo link
  const link = document.createElement('link');
  link.id = PAGE_STYLE_ID;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

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
  const html = await res.text();
    // adiciona classe/atributo para facilitar escopo de CSS
    outlet.setAttribute('data-page', slug);
    // limpa classes page-* anteriores do outlet para evitar conflitos (legado)
    Array.from(outlet.classList)
      .filter(c => c.startsWith('page-') || c === 'page-scope')
      .forEach(c => outlet.classList.remove(c));
    // aplica o escopo apenas no wrapper interno
  outlet.innerHTML = `<div class="page-scope page-${slug}">${html}</div>`;
  // carrega css da página
  setPageStyle(slug);
    // Permite que páginas carregadas também usem includes
    await includeHTML();
    
    // Inicializa modal se a função existir (do noticias.js)
    if (typeof window.initModal === 'function') {
      window.initModal();
    }
    
    // Inicializa comportamento do footer
    if (typeof window.initFooterBehavior === 'function') {
      window.initFooterBehavior();
    }
    // Inicializa página Equipe quando ativa
    if (typeof window.initEquipe === 'function' && slug === 'equipe') {
      window.initEquipe();
    }
    // Inicializa página Notícias quando ativa (somente GET a partir do backend)
    if (slug === 'noticias') {
      if (typeof window.initNoticias === 'function') {
        window.initNoticias();
      } else {
        setTimeout(() => {
          if (typeof window.initNoticias === 'function') window.initNoticias();
        }, 0);
      }
    }
    // Inicializa página Publicações quando ativa (GET + POST com upload)
    if (slug === 'publicacoes') {
      if (typeof window.initPublicacoes === 'function') {
        window.initPublicacoes();
      } else {
        setTimeout(() => {
          if (typeof window.initPublicacoes === 'function') window.initPublicacoes();
        }, 0);
      }
    }
    // Inicializa página Vagas quando ativa (GET + POST com upload)
    if (slug === 'vagas') {
      if (typeof window.initVagas === 'function') {
        window.initVagas();
      } else {
        setTimeout(() => {
          if (typeof window.initVagas === 'function') window.initVagas();
        }, 0);
      }
    }
    
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