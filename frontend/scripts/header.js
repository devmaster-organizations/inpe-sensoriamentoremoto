document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const btn = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('mainNav');

  // Se algum desses não existir na página atual, sai sem tentar adicionar listeners
  if (!header || !btn || !nav) return;

  // abrir/fechar
  function openMenu() {
    header.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
    // opcional: prevenir scroll de fundo:
    // document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    header.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    // document.body.style.overflow = '';
    btn.focus();
  }

  function toggleMenu() {
    if (btn.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  }

  // clique no botão
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // clique fora fecha (quando menu aberto)
  document.addEventListener('click', (e) => {
    if (btn.getAttribute('aria-expanded') !== 'true') return;
    if (!header.contains(e.target)) closeMenu();
  });

  // foco fora fecha (ajuda navegação por teclado)
  document.addEventListener('focusin', (e) => {
    if (btn.getAttribute('aria-expanded') !== 'true') return;
    if (!header.contains(e.target)) closeMenu();
  });

  // opcional: enquanto redimensiona para desktop, assegure que o menu feche
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && header.classList.contains('is-open')) {
      closeMenu();
    }
  });
});
