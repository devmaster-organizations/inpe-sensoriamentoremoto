// ===========================
// Página: Vagas/Oportunidades
// ===========================
// Carrega e exibe as oportunidades/vagas com imagens, descrição e busca

window.initVagas = async function initVagas() {
  const grid = document.querySelector('#page-btn');
  const searchInput = document.querySelector('#searchinput-vagas');

  if (!grid) return;

  // Limpa conteúdo
  grid.innerHTML = '<p style="text-align:center; width:100%; padding:20px;">Carregando...</p>';

  try {
    const response = await fetch('/api/oportunidades');
    if (!response.ok) {
      throw new Error('Erro ao carregar oportunidades');
    }
    const vagas = await response.json();
    
    grid.innerHTML = '';
    
    if (vagas.length === 0) {
      grid.innerHTML = '<p style="text-align:center; width:100%; padding:40px;">Nenhuma vaga disponível no momento.</p>';
      return;
    }
    
    // Helper para criar um card
    function criarCard(v) {
      const card = document.createElement('div');
      card.className = 'page-card';
      card.dataset.titulo = (v.titulo || '').toLowerCase();
      card.dataset.descricao = (v.descricao || '').toLowerCase();
      
      // Imagem padrão se não houver
      const imagemUrl = v.image || 'img/inpe-logo.png';
      
      // Formata data de validade
      const dataValidade = new Date(v.validade);
      const dataFormatada = dataValidade.toLocaleDateString('pt-BR');
      
      card.innerHTML = `
        <div class="page-card-header">
          <img src="${imagemUrl}" alt="${v.titulo || 'Vaga'}" loading="lazy">
        </div>
        <div class="page-card-body">
          <h2>${v.titulo || 'Sem título'}</h2>
          <p class="descricao">${v.descricao || 'Sem descrição'}</p>
          <p class="page-card-date">Validade: ${dataFormatada}</p>
        </div>
      `;
      
      // Adiciona evento de clique para expandir/recolher
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Fecha todos os outros cards expandidos
        document.querySelectorAll('.page-card.expandido').forEach(c => {
          if (c !== card) c.classList.remove('expandido');
        });
        
        // Toggle no card atual
        card.classList.toggle('expandido');
      });
      
      return card;
    }

    // Adiciona cards
    vagas.forEach(v => grid.appendChild(criarCard(v)));
    
    // Fecha cards expandidos ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.page-card')) {
        document.querySelectorAll('.page-card.expandido').forEach(card => {
          card.classList.remove('expandido');
        });
      }
    });
    
    // Configura busca
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.page-card');
        
        cards.forEach(card => {
          const titulo = card.dataset.titulo || '';
          const descricao = card.dataset.descricao || '';
          const match = titulo.includes(termo) || descricao.includes(termo);
          
          if (match) {
            card.classList.remove('hidden');
            setTimeout(() => card.style.display = '', 10);
          } else {
            card.classList.add('hidden');
            setTimeout(() => card.style.display = 'none', 300);
          }
        });
      });
    }
  } catch (err) {
    grid.innerHTML = `<p style="color:red; text-align:center; width:100%; padding:40px;">Erro ao carregar vagas: ${err.message}</p>`;
  }
};

