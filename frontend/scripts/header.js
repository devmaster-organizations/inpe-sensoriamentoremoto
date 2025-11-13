// hamburger.js — robusto, fecha ao clicar em link e permite scroll interno no menu mobile
(function () {
  'use strict';

  // Retorna true se inicializou com sucesso
  function initHamburgerOnce() {
    const header = document.querySelector('header');
    const btn = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('mainNav');

    if (!header || !btn || !nav) return false;
    if (header.dataset.hamburgerInitialized === 'true') return true;
    header.dataset.hamburgerInitialized = 'true';

    // guarda overflow anterior do body para restaurar depois
    let previousBodyOverflow = '';
    // guarda se fixamos styles inline no nav (para restaurar)
    let hadInlineNavStyles = false;

    // abre o menu
    function openMenu() {
      header.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Fechar menu');
      nav.setAttribute('aria-hidden', 'false');

      // bloquear scroll do body, para permitir rolagem apenas dentro do menu
      previousBodyOverflow = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';

      // calcular max-height para nav para caber na viewport (deixar pequeno espaço)
      const headerH = header.offsetHeight || 56;
      const padding = 12; // espaço extra para segurança
      const maxH = Math.max(120, window.innerHeight - headerH - padding);
      nav.style.maxHeight = `${maxH}px`;
      nav.style.overflowY = 'auto';
      nav.style.webkitOverflowScrolling = 'touch';
      hadInlineNavStyles = true;

      // mover foco para o primeiro link
      const firstLink = nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
      if (firstLink) firstLink.focus();
    }

    // fecha o menu
    function closeMenu() {
      header.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menu');
      nav.setAttribute('aria-hidden', 'true');

      // restaurar overflow do body
      document.body.style.overflow = previousBodyOverflow || '';

      // limpar estilos inline aplicados
      if (hadInlineNavStyles) {
        nav.style.maxHeight = '';
        nav.style.overflowY = '';
        nav.style.webkitOverflowScrolling = '';
        hadInlineNavStyles = false;
      }

      // devolve foco ao botão
      try { btn.focus(); } catch (e) { /* ignore */ }
    }

    // toggle
    function toggleMenu() {
      if (btn.getAttribute('aria-expanded') === 'true') closeMenu();
      else openMenu();
    }

    // fecha ao clicar em um link dentro do nav (boa prática)
    function onNavClick(e) {
      const link = e.target.closest('a');
      if (!link) return;
      // se o link tiver href e for navegável, fechamos o menu para não bloquear navegação
      // (mesmo links externos / target=_blank fecham — ok)
      if (link.getAttribute('href') !== null) {
        // um pequeno timeout para garantir que o click processe (opcional)
        setTimeout(closeMenu, 20);
      }
    }

    // atualiza maxHeight quando a viewport mudar (rotate/resize)
    function updateNavMaxHeight() {
      if (!header.classList.contains('is-open')) return;
      const headerH = header.offsetHeight || 56;
      const padding = 12;
      const maxH = Math.max(120, window.innerHeight - headerH - padding);
      nav.style.maxHeight = `${maxH}px`;
    }

    // Handlers
    function onBtnClick(e) { e.stopPropagation(); toggleMenu(); }
    function onDocKeydown(e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') closeMenu(); }
    function onDocClick(e) { if (btn.getAttribute('aria-expanded') !== 'true') return; if (!header.contains(e.target)) closeMenu(); }
    function onFocusIn(e) { if (btn.getAttribute('aria-expanded') !== 'true') return; if (!header.contains(e.target)) closeMenu(); }
    function onResize() {
      // se passar do ponto mobile para desktop, garantimos fechar
      if (window.innerWidth > 768 && header.classList.contains('is-open')) {
        closeMenu();
      } else {
        // apenas atualiza o maxHeight se estiver aberto
        updateNavMaxHeight();
      }
    }

    // Ligar listeners
    btn.addEventListener('click', onBtnClick, { passive: false });
    document.addEventListener('keydown', onDocKeydown);
    document.addEventListener('click', onDocClick);
    document.addEventListener('focusin', onFocusIn);
    window.addEventListener('resize', onResize);
    // fecha quando clicar em qualquer link do nav
    nav.addEventListener('click', onNavClick, { passive: true });

    // Expor um destroy para caso queiram desmontar
    header._destroyHamburger = function () {
      try {
        btn.removeEventListener('click', onBtnClick);
        document.removeEventListener('keydown', onDocKeydown);
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('focusin', onFocusIn);
        window.removeEventListener('resize', onResize);
        nav.removeEventListener('click', onNavClick);
      } catch (e) {}
      delete header.dataset.hamburgerInitialized;
      delete header._destroyHamburger;
    };

    return true;
  } // initHamburgerOnce

  // tenta inicializar imediatamente
  if (initHamburgerOnce()) return;

  // observa o DOM até o header/nav aparecerem
  const observer = new MutationObserver(() => {
    if (initHamburgerOnce()) {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // fallback: tenta novamente após 1500ms
  setTimeout(() => { initHamburgerOnce(); }, 1500);
})();
