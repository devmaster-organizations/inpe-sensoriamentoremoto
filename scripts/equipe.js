// Inicializador para a página Equipe, chamado pelo router quando a rota '#/equipe' é ativada
(function () {
  window.initEquipe = async function initEquipe() {
    const root = document.querySelector('.page-equipe');
    if (!root) return;

    // Evita dupla inicialização ao navegar para a mesma rota
    if (root.dataset.initialized === 'true') return;
    root.dataset.initialized = 'true';

    const container = root.querySelector('#categorias-container');
    if (!container) return;
    container.innerHTML = '';

    try {
      const res = await fetch('data/equipe.json');
      if (!res.ok) throw new Error('Falha ao carregar equipe.json');
      const dados = await res.json();

      Object.keys(dados).forEach((categoria) => {
        const secao = document.createElement('section');
        secao.classList.add('categoria');

        const titulo = document.createElement('h2');
        titulo.textContent = categoria;
        secao.appendChild(titulo);

        const cards = document.createElement('div');
        cards.classList.add('cards');

        dados[categoria]
          .sort((a, b) => a.nome.localeCompare(b.nome))
          .forEach((membro) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
              <img src="${membro.foto}" alt="${membro.nome}">
              <h3>${membro.nome}</h3>
              <p>${membro.funcao}</p>
            `;
            card.addEventListener('click', () => abrirModal(membro));
            cards.appendChild(card);
          });

        secao.appendChild(cards);
        container.appendChild(secao);
      });

      // Modal
      const modal = root.querySelector('#modal');
      const closeBtn = root.querySelector('.close');

      function abrirModal(membro) {
        if (!modal) return;
        root.querySelector('#modal-img').src = membro.foto;
        root.querySelector('#modal-nome').textContent = membro.nome;
        root.querySelector('#modal-funcao').textContent = membro.funcao;
        root.querySelector('#modal-descricao').textContent = membro.descricao;
        root.querySelector('#modal-lattes').href = membro.lattes;
        modal.style.display = 'flex';
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.style.display = 'none';
        });
      }

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.style.display = 'none';
        });
      }
    } catch (err) {
      container.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  };
})();