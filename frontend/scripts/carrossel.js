// carousel.js — versão robusta (inicializa quando #newsCarousel aparece)
(function () {
  'use strict';

  // Tenta inicializar o carrossel uma vez; retorna true se inicializou
  function initCarouselOnce() {
    const carousel = document.getElementById('newsCarousel');
    if (!carousel) return false;

    // evita reinicializar o mesmo elemento
    if (carousel.dataset.carouselInitialized === 'true') return true;

    // pega elementos internos
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const dots = Array.from(carousel.querySelectorAll('.dot'));
    const btnPrev = carousel.querySelector('[data-action="prev"]');
    const btnNext = carousel.querySelector('[data-action="next"]');
    const status = document.getElementById('carouselStatus');

    // valida requisitos mínimos
    if (!slides.length || !dots.length || !btnPrev || !btnNext || !status) {
      return false;
    }

    // marca como inicializado
    carousel.dataset.carouselInitialized = 'true';

    // executa a lógica principal do carrossel
    runCarousel({ carousel, slides, dots, btnPrev, btnNext, status });
    return true;
  }

  // Função que monta o comportamento do carrossel
  function runCarousel({ carousel, slides, dots, btnPrev, btnNext, status }) {
    const total = slides.length;
    let current = 0;
    const AUTO_DELAY = 5000;
    let timer = null;
    let userInteracted = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // garante que todos os slides comecem escondidos
    slides.forEach(s => s.classList.remove('is-active'));

    function setActive(index) {
      // normaliza índice
      const idx = ((index % total) + total) % total;
      slides.forEach((s, i) => {
        const active = i === idx;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      // atualiza dots com proteção (caso dots < slides)
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === idx ? 'true' : 'false'));
      current = idx;
      status.textContent = `Notícia ${idx + 1} de ${total}`;
    }

    function next() { setActive(current + 1); }
    function prev() { setActive(current - 1); }

    function startAuto() {
      if (reduceMotion) return;
      stopAuto();
      timer = setInterval(() => {
        if (!userInteracted) next();
      }, AUTO_DELAY);
    }
    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    // pausa automática quando o usuário interage
    carousel.addEventListener('mouseenter', () => { userInteracted = true; });
    carousel.addEventListener('mouseleave', () => { userInteracted = false; });
    carousel.addEventListener('focusin', () => { userInteracted = true; });
    carousel.addEventListener('focusout', () => { userInteracted = false; });
    carousel.addEventListener('touchstart', () => { userInteracted = true; }, { passive: true });
    carousel.addEventListener('touchend', () => { userInteracted = false; });

    // botões
    btnNext.addEventListener('click', () => { next(); });
    btnPrev.addEventListener('click', () => { prev(); });

    // dots: clique e navegação por setas dentro dos dots
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { setActive(i); });
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          const j = (i - 1 + dots.length) % dots.length;
          dots[j].focus();
        }
        if (e.key === 'ArrowRight') {
          const j = (i + 1) % dots.length;
          dots[j].focus();
        }
      });
    });

    // keyboard global (← →)
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    // swipe touch simples (melhora mobile). Threshold evita toques leves.
    (function addSwipe() {
      let startX = 0;
      let deltaX = 0;
      const THRESHOLD = 40; // px mínimo para considerar swipe
      const vp = carousel; // usamos o container do carrossel

      vp.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          startX = e.touches[0].clientX;
          deltaX = 0;
        }
        userInteracted = true;
      }, { passive: true });

      vp.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          deltaX = e.touches[0].clientX - startX;
        }
      }, { passive: true });

      vp.addEventListener('touchend', () => {
        if (Math.abs(deltaX) > THRESHOLD) {
          if (deltaX < 0) next(); else prev();
        }
        // retoma autoplay após um pequeno atraso
        setTimeout(() => { userInteracted = false; }, 600);
      }, { passive: true });
    })();

    // inicia
    setActive(0);
    startAuto();

    // pausa quando aba oculta
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAuto(); else startAuto();
    });

    // Cleanup opcional se for necessário desmontar:
    // (não usado automaticamente aqui, mas deixado para referência)
    carousel._carouselDestroy = () => {
      stopAuto();
      // remover listeners seria feito aqui se necessário
    };
  }

  // Primeiro tenta inicializar logo (caso o elemento já esteja no DOM)
  if (initCarouselOnce()) return;

  // Se não inicializou, observa o DOM até aparecer o elemento
  const obs = new MutationObserver(() => {
    if (initCarouselOnce()) {
      obs.disconnect();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });

  // Segurança extra: tenta novamente após um timeout (caso algo falhe)
  setTimeout(() => { initCarouselOnce(); }, 1500);
})();