// publicacoes-search.js — robusto: aguarda injeção dinâmica, aplica animação e evita erros
(function () {
  'use strict';

  // tenta inicializar uma vez; retorna true se inicializou
  function initOnce() {
    // usa o id que você tem no HTML (nota: seu HTML tem "searchimput")
    const searchInput = document.getElementById('searchimput');
    const cards = Array.from(document.querySelectorAll('.card-publicacoes'));

    // só inicializa se tiver input e pelo menos 1 card
    if (!searchInput || !cards.length) return false;

    // evita reinicialização
    if (searchInput.dataset.searchInitialized === 'true') return true;
    searchInput.dataset.searchInitialized = 'true';

    // --- utilitários para mostrar/esconder com animação ---
    function hideCard(card) {
      // se já está com display none, retorna
      if (card.classList.contains('hidden') || card.style.display === 'none') {
        // se tem display:none mas sem .hidden, garante que classe exista (consistência)
        card.classList.add('hidden');
        card.setAttribute('aria-hidden', 'true');
        return;
      }

      // adiciona classe que inicia a transição
      card.classList.add('hidden');
      card.setAttribute('aria-hidden', 'true');

      // quando terminar a transição de opacity, remover do fluxo (display:none)
      const onTransitionEnd = (e) => {
        // somente reagir à propriedade opacity para evitar múltiplos triggers
        if (e.propertyName !== 'opacity') return;
        // só esconder se ainda estiver com a classe hidden
        if (card.classList.contains('hidden')) {
          card.style.display = 'none';
        }
        card.removeEventListener('transitionend', onTransitionEnd);
      };
      card.addEventListener('transitionend', onTransitionEnd);
    }

    function showCard(card) {
      // se já está visível, não faz nada
      if (!card.classList.contains('hidden') && card.style.display !== 'none') return;

      // coloca no fluxo para ocupar espaço (display flex conforme seu layout)
      card.style.display = 'flex';
      card.setAttribute('aria-hidden', 'false');

      // força recálculo e remove classe para disparar transição (com RAF para garantir)
      requestAnimationFrame(() => {
        // remover tanto .hidden quanto .hide para compatibilidade
        card.classList.remove('hidden');
        card.classList.remove('hide');
      });
    }

    // inicial: garante que todos os cards tenham display correto (especialmente se estavam em display:none)
    cards.forEach(card => {
      // se o card tiver inline style display:none por alguma razão, definimos como flex e marcamos hidden
      if (card.style.display === 'none') {
        card.dataset.initialHidden = 'true';
        card.classList.add('hidden');
      } else {
        // garante que esteja com display flex conforme seu estilo original
        card.style.display = card.style.display || 'flex';
        card.classList.remove('hidden');
      }
      // garante atributo aria-hidden coerente
      card.setAttribute('aria-hidden', card.classList.contains('hidden') ? 'true' : 'false');
    });

    // função principal de filtro
    function applyFilter(query) {
      const q = (query || '').toLowerCase().trim();

      cards.forEach(card => {
        // busca o título conforme sua estrutura .card-body h2
        const titleEl = card.querySelector('.card-body h2') || card.querySelector('h2');
        const title = (titleEl && titleEl.textContent || '').toLowerCase();

        if (q === '' || title.includes(q)) {
          showCard(card);
        } else {
          hideCard(card);
        }
      });
    }

    // evento de input
    searchInput.addEventListener('input', () => {
      try {
        applyFilter(searchInput.value || '');
      } catch (err) {
        // evita quebrar a página (silente)
        console.error('Erro no filtro de publicações:', err);
      }
    });

    // opcional: permite filtrar também quando usuário pressiona Enter no input (acessa mesmo comportamento)
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        applyFilter(searchInput.value || '');
      }
    });

    // comportamento: se houver um select de filtro (id filterSelect), escuta mudanças e pode alterar lógica
    const select = document.getElementById('filterSelect');
    if (select) {
      select.addEventListener('change', () => {
        // exemplo mínimo: se selecionar 'todos', limpa busca
        if (select.value === 'todos') {
          searchInput.value = '';
          applyFilter('');
        }
        // Se quiser lógica mais complexa (filtrar por autor/ano), posso adicionar
      });
    }

    // inicializa sem filtro (mostra tudo)
    applyFilter(searchInput.value || '');

    // expõe um método de destruição caso seja necessário
    searchInput._destroySearch = function () {
      delete searchInput.dataset.searchInitialized;
    };

    return true;
  } // initOnce

  // tenta inicializar imediatamente
  if (initOnce()) return;

  // se não inicializou (injetado dinamicamente), observa o DOM até aparecer
  const observer = new MutationObserver(() => {
    if (initOnce()) {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // fallback: tenta novamente após 1.5s
  setTimeout(() => { initOnce(); }, 1500);
})();
