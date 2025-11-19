// carousel.js — robusto + reativação para SPA / pageshow / popstate
(function () {
  'use strict';

  // tentativa única de init; retorna true se inicializou
  function initCarouselOnce() {
    const carousel = document.getElementById('newsCarousel');
    if (!carousel) return false;
    if (carousel.dataset.carouselInitialized === 'true') return true;

    // referências dinâmicas
    const getSlides = () => Array.from(carousel.querySelectorAll('.slide'));
    const getDots = () => Array.from(carousel.querySelectorAll('.dot'));
    const btnPrev = carousel.querySelector('[data-action="prev"]');
    const btnNext = carousel.querySelector('[data-action="next"]');
    const status = document.getElementById('carouselStatus');

    if (!btnPrev || !btnNext || !status) return false;

    carousel.dataset.carouselInitialized = 'true';

    runCarousel({ carousel, getSlides, getDots, btnPrev, btnNext, status });
    return true;
  }

  // monta o carrossel (idempotente por carousel.dataset.carouselInitialized)
  function runCarousel({ carousel, getSlides, getDots, btnPrev, btnNext, status }) {
    let slides = getSlides();
    let dots = getDots();
    let total = slides.length;
    let current = 0;
    const AUTO_DELAY = 5000;
    let timer = null;
    let userInteracted = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function refreshElements() {
      slides = getSlides();
      dots = getDots();
      total = slides.length;
    }

    function hideAll() {
      refreshElements();
      slides.forEach(s => s.classList.remove('is-active'));
      slides.forEach(s => s.setAttribute('aria-hidden', 'true'));
      dots.forEach(d => d.setAttribute('aria-selected', 'false'));
    }

    hideAll();

    function setActive(index) {
      refreshElements();
      if (total === 0) return;
      const idx = ((index % total) + total) % total;
      slides.forEach((s, i) => {
        const active = i === idx;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.forEach((d, i) => {
        if (i < dots.length) d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
      current = idx;
      status.textContent = `Notícia ${idx + 1} de ${total}`;
    }

    function next() { if (total) setActive(current + 1); }
    function prev() { if (total) setActive(current - 1); }

    function startAuto() {
      if (reduceMotion) return;
      stopAuto();
      timer = setInterval(() => { if (!userInteracted) next(); }, AUTO_DELAY);
    }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

    // interação do usuário (pausa autoplay)
    carousel.addEventListener('mouseenter', () => { userInteracted = true; });
    carousel.addEventListener('mouseleave', () => { userInteracted = false; });
    carousel.addEventListener('focusin', () => { userInteracted = true; });
    carousel.addEventListener('focusout', () => { userInteracted = false; });
    carousel.addEventListener('touchstart', () => { userInteracted = true; }, { passive: true });
    carousel.addEventListener('touchend', () => { userInteracted = false; });

    // botões
    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);

    // dots
    function attachDotListeners() {
      dots.forEach(d => { if (d._dotHandler) d.removeEventListener('click', d._dotHandler); });
      dots.forEach((dot, i) => {
        const handler = () => setActive(i);
        dot.addEventListener('click', handler);
        dot._dotHandler = handler;
        dot.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
            const j = (i - 1 + dots.length) % dots.length;
            dots[j] && dots[j].focus();
          }
          if (e.key === 'ArrowRight') {
            const j = (i + 1) % dots.length;
            dots[j] && dots[j].focus();
          }
        });
      });
    }
    attachDotListeners();

    // keyboard global
    const onDocKey = (e) => {
      if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onDocKey);

    // swipe
    (function addSwipe() {
      let startX = 0, deltaX = 0, THRESHOLD = 40;
      const vp = carousel;
      vp.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) { startX = e.touches[0].clientX; deltaX = 0; }
        userInteracted = true;
      }, { passive: true });
      vp.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) deltaX = e.touches[0].clientX - startX;
      }, { passive: true });
      vp.addEventListener('touchend', () => {
        if (Math.abs(deltaX) > THRESHOLD) { if (deltaX < 0) next(); else prev(); }
        setTimeout(() => { userInteracted = false; }, 600);
      }, { passive: true });
    })();

    // inicializa
    setActive(0);
    startAuto();

    // visibilitychange
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAuto(); else startAuto(); });

    // IntersectionObserver: quando o carrossel voltar a ficar visível, garante estado ativo e reinicia autoplay
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          refreshElements();
          const hasActive = slides.some(s => s.classList.contains('is-active'));
          if (!hasActive && total > 0) setActive(0);
          startAuto();
        } else { stopAuto(); }
      });
    }, { root: null, threshold: 0.01 });
    io.observe(carousel);

    // MutationObserver: detecta alterações internas e reaplica handlers/estado
    let mutTimer = null;
    const mo = new MutationObserver(() => {
      if (mutTimer) clearTimeout(mutTimer);
      mutTimer = setTimeout(() => {
        refreshElements();
        attachDotListeners();
        const hasActive = slides.some(s => s.classList.contains('is-active'));
        if (!hasActive && total > 0) {
          if (current >= total) current = 0;
          setActive(current || 0);
        } else {
          status.textContent = `Notícia ${current + 1} de ${total}`;
        }
      }, 80);
    });
    mo.observe(carousel, { childList: true, subtree: true });

    // expõe API para reativação manual
    carousel._carouselAPI = {
      setActive, next, prev, startAuto, stopAuto, refreshElements,
      ensureActive: function () {
        refreshElements();
        const hasActive = slides.some(s => s.classList.contains('is-active'));
        if (!hasActive && total > 0) setActive(0);
      },
      destroy: () => {
        stopAuto();
        io.disconnect();
        mo.disconnect();
        document.removeEventListener('keydown', onDocKey);
        dots.forEach(d => { if (d._dotHandler) d.removeEventListener('click', d._dotHandler); delete d._dotHandler; });
        delete carousel.dataset.carouselInitialized;
        delete carousel._carouselAPI;
      }
    };
  } // runCarousel

  // inicializa agora mesmo se possível
  if (initCarouselOnce()) {
    // nothing
  } else {
    // observa DOM até o elemento aparecer
    const obs = new MutationObserver(() => {
      if (initCarouselOnce()) obs.disconnect();
    });
    obs.observe(document.body, { childList: true, subtree: true });
    // fallback
    setTimeout(() => { initCarouselOnce(); }, 1500);
  }

  // ---- REATIVAÇÃO GLOBAL (para SPA / back-forward / pageshow) ----
  // função segura que tenta reativar qualquer carousel existente
  function reactivateCarousel() {
    const c = document.getElementById('newsCarousel');
    if (!c) return;
    // se API disponível, garante um slide ativo e reinicia autoplay
    if (c._carouselAPI && typeof c._carouselAPI.ensureActive === 'function') {
      c._carouselAPI.ensureActive();
      if (typeof c._carouselAPI.startAuto === 'function') c._carouselAPI.startAuto();
      return;
    }
    // se não tiver API (não inicializado), tenta inicializar
    initCarouselOnce();
  }

  // gatilhos comuns de SPA / navegação
  window.addEventListener('popstate', reactivateCarousel);
  window.addEventListener('hashchange', reactivateCarousel);
  window.addEventListener('focus', reactivateCarousel);
  window.addEventListener('pageshow', (ev) => { reactivateCarousel(); });

})();