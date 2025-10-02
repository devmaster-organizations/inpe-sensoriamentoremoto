function includeHTML() {
  const elements = document.querySelectorAll('[include-html]');
  if (elements.length === 0) return;
  elements.forEach(el => {
    const file = el.getAttribute('include-html');
    fetch(file)
      .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar ' + file);
        return response.text();
      })
      .then(data => {
        const fragment = document.createRange().createContextualFragment(data);
        el.parentNode.insertBefore(fragment, el);
        el.parentNode.removeChild(el);
        includeHTML();
      })
      .catch(err => {
        el.innerHTML = '<span style="color:red">' + err.message + '</span>';
      });
  });
}


function currentSlug() {
  const h = window.location.hash.replace(/^#\/?/, '');
  return h || 'home';
}

function fileFor(slug) {
  return `componentes/page/${slug}/${slug}.html`;
}

function updateActiveNav(slug) {
  const links = document.querySelectorAll('header .fullbtn a[href^="#/"]');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === `#/${slug}`) a.classList.add('is-active');
    else a.classList.remove('is-active');
  });
}

async function render() {
  const outlet = document.querySelector('#app, [data-router-outlet]');
  if (!outlet) return;
  const slug = currentSlug();
  let url = fileFor(slug);
  try {
    let res = await fetch(url);
    if (!res.ok) {

      url = fileFor('home');
      res = await fetch(url);
    }
    const html = await res.text();
    outlet.innerHTML = html;
    includeHTML(); // processa includes dentro da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    outlet.innerHTML = `<div style="color:red; padding:16px">${e.message}</div>`;
  }
  updateActiveNav(slug);
}

function boot() {
  includeHTML();
  render();
}

window.addEventListener('hashchange', render);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}