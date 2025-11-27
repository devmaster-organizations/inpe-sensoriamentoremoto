// ===========================
// Página: Notícias (somente GET)
// ===========================
// Renderiza as notícias vindas do backend sem quebrar o layout atual.
// Usa o proxy /api/noticias definido no servidor do frontend (server.js).
window.initNoticias = async function initNoticias() {
    const root = document.querySelector('.page-noticias');
    if (!root) return;

    const grid = root.querySelector('#page-btn');
    const searchInput = root.querySelector('#searchinput');
    const form = root.querySelector('#form-noticia');
    const msg = root.querySelector('.form-msg');

    if (!grid) return;

    // Limpa conteúdo estático e prepara o container
    grid.innerHTML = '';

    try {
        const noticias = await (window.getNoticias ? window.getNoticias() : fetch('/api/noticias').then(r => r.json()));

        // Helper para criar um card no formato atual do layout
        function criarCard(n) {
            const card = document.createElement('div');
            card.className = 'page-card';

            // Mantém o header para preservar o layout
            const header = document.createElement('div');
            header.className = 'page-card-header';
            // Usa imagem da notícia se existir, senão fallback para logo INPE
            const img = document.createElement('img');
            img.src = n.image || 'img/inpe-logo.png';
            img.alt = n.titulo || 'INPE';
            img.loading = 'lazy';
            header.appendChild(img);
            card.appendChild(header);

            const body = document.createElement('div');
            body.className = 'page-card-body';

            const h2 = document.createElement('h2');
            h2.textContent = n.titulo || 'Sem título';
            body.appendChild(h2);

            // Link "Acessar" (sem imagem)
            if (n.link) {
                const a = document.createElement('a');
                a.href = n.link;
                a.target = '_blank';
                a.textContent = 'Acessar';
                body.appendChild(a);
            }

            card.appendChild(body);
            return card;
        }

        // Adiciona cards (ordenados já chegam do backend)
    noticias.forEach(n => grid.appendChild(criarCard(n)));

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
        // Upload de nova notícia (opcional)
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (msg) { msg.textContent = 'Enviando...'; msg.style.color = ''; }
                try {
                    const fd = new FormData(form);
                    // Checkbox exibir vira 'true'/'false'
                    if (!fd.has('exibir')) fd.append('exibir', 'false');
                    else fd.set('exibir', 'true');
                    const resp = await (window.postNoticia ? window.postNoticia(fd) : fetch('/api/noticias', { method: 'POST', body: fd }).then(r=>r.json()));
                    if (msg) { msg.textContent = 'Salvo com sucesso!'; msg.style.color = 'green'; }
                    // Recarrega a lista
                    const novas = await (window.getNoticias ? window.getNoticias() : fetch('/api/noticias').then(r => r.json()));
                    grid.innerHTML = '';
                    novas.forEach(n => grid.appendChild(criarCard(n)));
                    // Limpa form
                    form.reset();
                } catch (e) {
                    if (msg) { msg.textContent = 'Erro ao enviar: ' + (e.message || e); msg.style.color = 'red'; }
                }
            });
        }
    } catch (err) {
        grid.innerHTML = `<p style="color:red">Falha ao carregar notícias: ${err.message}</p>`;
    }
};



