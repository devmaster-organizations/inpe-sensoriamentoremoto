// ===========================
// Página: Publicações (GET + POST com upload de imagem)
// ===========================
// Renderiza as publicações vindas do backend, adiciona busca por palavra-chave no texto/citação,
// e fornece formulário de upload para criar novas publicações.

window.initPublicacoes = async function initPublicacoes() {
  const root = document.querySelector('.page-publicacoes');
  if (!root) return;

  const grid = root.querySelector('#botoes');
  const searchInput = root.querySelector('#searchimput');
  const form = root.querySelector('#form-publicacao');
  const msg = root.querySelector('.form-msg');

  if (!grid) return;

  // Limpa conteúdo estático e prepara o container
  grid.innerHTML = '';

  try {
    const publicacoes = await (window.getPublicacoes ? window.getPublicacoes() : fetch('/api/publicacoes').then(r => r.json()));

    // Helper para criar um card no formato atual do layout
    function criarCard(p) {
      const card = document.createElement('div');
      card.className = 'card-publicacoes';

      const header = document.createElement('div');
      header.className = 'card-header';

      const link = document.createElement('a');
      link.href = p.link || p.doi ? `https://doi.org/${p.doi}` : '#';
      link.target = '_blank';

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = p.texto ? p.texto.substring(0, 50) : 'Publicação';
      img.src = p.image || '/img/Imagem1.png'; // fallback

      link.appendChild(img);
      header.appendChild(link);

      const body = document.createElement('div');
      body.className = 'card-body';

      const h2 = document.createElement('h2');
      // Extrai primeira linha/sentença como título
      const firstLine = (p.texto || 'Sem texto').split('\n')[0].split('.')[0];
      h2.textContent = firstLine || 'Publicação';
      body.appendChild(h2);

      const citation = document.createElement('p');
      citation.innerHTML = `<strong>Citação:</strong> ${p.texto || 'Sem citação disponível'}`;
      body.appendChild(citation);

      card.appendChild(header);
      card.appendChild(body);
      return card;
    }

    // Adiciona cards (ordenados por ano DESC já vêm do backend)
    publicacoes.forEach(p => grid.appendChild(criarCard(p)));

    // Busca por palavra-chave no texto/citação
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        grid.querySelectorAll('.card-publicacoes').forEach(card => {
          const textContent = card.querySelector('.card-body')?.textContent?.toLowerCase() || '';
          card.style.display = textContent.includes(q) ? '' : 'none';
        });
      });
    }

    // Upload de nova publicação
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (msg) { msg.textContent = 'Enviando...'; msg.style.color = ''; }
        try {
          const fd = new FormData(form);
          const resp = await (window.postPublicacao ? window.postPublicacao(fd) : fetch('/api/publicacoes', { method: 'POST', body: fd }).then(r => r.json()));
          if (msg) { msg.textContent = 'Salvo com sucesso!'; msg.style.color = 'green'; }
          // Recarrega a lista
          const novas = await (window.getPublicacoes ? window.getPublicacoes() : fetch('/api/publicacoes').then(r => r.json()));
          grid.innerHTML = '';
          novas.forEach(p => grid.appendChild(criarCard(p)));
          // Limpa form
          form.reset();
        } catch (e) {
          if (msg) { msg.textContent = 'Erro ao enviar: ' + (e.message || e); msg.style.color = 'red'; }
        }
      });
    }
  } catch (err) {
    grid.innerHTML = `<p style="color:red">Falha ao carregar publicações: ${err.message}</p>`;
  }
};
