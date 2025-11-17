// ===========================
// Página: Vagas (GET + POST com upload de imagem)
// ===========================
// Renderiza as vagas vindas do backend, adiciona busca por palavra-chave no título,
// e fornece formulário de upload para criar novas vagas.

window.initVagas = async function initVagas() {
  const root = document.querySelector('.page-vagas');
  if (!root) return;

  const grid = root.querySelector('#page-btn');
  const searchInput = root.querySelector('#searchinput-vagas');
  const form = root.querySelector('#form-vaga');
  const msg = root.querySelector('.form-msg');

  if (!grid) return;

  // Limpa conteúdo estático e prepara o container
  grid.innerHTML = '';

  try {
    const vagas = await (window.getVagas ? window.getVagas() : fetch('/api/vagas').then(r => r.json()));

    // Helper para criar um card no formato atual do layout
    function criarCard(v) {
      const card = document.createElement('div');
      card.className = 'page-card';

      const header = document.createElement('div');
      header.className = 'page-card-header';

      const link = document.createElement('a');
      link.href = v.link || '#';
      link.target = '_blank';

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = v.titulo || 'Vaga';
      img.src = v.image || '/img/Imagem1.png'; // fallback simples

      link.appendChild(img);
      header.appendChild(link);

      const body = document.createElement('div');
      body.className = 'page-card-body';

      const h2 = document.createElement('h2');
      h2.textContent = v.titulo || 'Sem título';
      body.appendChild(h2);

      card.appendChild(header);
      card.appendChild(body);
      return card;
    }

    // Adiciona cards (ordenados já chegam do backend)
    vagas.forEach(v => grid.appendChild(criarCard(v)));

    // Busca por título (não quebra layout)
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        grid.querySelectorAll('.page-card').forEach(card => {
          const title = card.querySelector('h2')?.textContent?.toLowerCase() || '';
          card.style.display = title.includes(q) ? '' : 'none';
        });
      });
    }

    // Upload de nova vaga
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (msg) { msg.textContent = 'Enviando...'; msg.style.color = ''; }
        try {
          const fd = new FormData(form);
          // Checkbox exibir vira 'true'/'false'
          if (!fd.has('exibir')) fd.append('exibir', 'false');
          else fd.set('exibir', 'true');
          const resp = await (window.postVaga ? window.postVaga(fd) : fetch('/api/vagas', { method: 'POST', body: fd }).then(r=>r.json()));
          if (msg) { msg.textContent = 'Salvo com sucesso!'; msg.style.color = 'green'; }
          // Recarrega a lista
          const novas = await (window.getVagas ? window.getVagas() : fetch('/api/vagas').then(r => r.json()));
          grid.innerHTML = '';
          novas.forEach(v => grid.appendChild(criarCard(v)));
          // Limpa form
          form.reset();
        } catch (e) {
          if (msg) { msg.textContent = 'Erro ao enviar: ' + (e.message || e); msg.style.color = 'red'; }
        }
      });
    }
  } catch (err) {
    grid.innerHTML = `<p style="color:red">Falha ao carregar vagas: ${err.message}</p>`;
  }
};
