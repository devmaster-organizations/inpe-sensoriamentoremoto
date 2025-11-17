//===========================
//Módulo de Modal informativo
//===========================

// Objeto com textos que serão exibidos no modal
const textosInfo = {
    monitoramento:`<h3>Monitoramento e Mapeamento Agrícola</h3>
    <p>O AgriRS realiza o monitoramento e o mapeamento das principais culturas agrícolas cultivadas no 
    Brasil utilizando dados de sensoriamento remoto. As classificações são feitas utilizando imagens de 
    satélite pré-processadas e algoritmos de classificação que visam  identificar áreas cultivadas com 
    diferentes culturas. Essa abordagem permite acompanhar a dinâmica espacial das lavouras ao longo das 
    safras, contribuindo para o planejamento agrícola e para políticas públicas voltadas ao setor.</p></>`,

    produtividade:
    `<h3>Estimativas de Produtividade</h3>
    <p>Com base em séries temporais de imagens de satélite e dados meteorológicos, o AgriRS desenvolve 
    metodologias para estimar a produtividade das culturas e avaliar perdas causadas por eventos 
    extremos, como estiagens e geadas. Essas análises permitem identificar áreas com risco de quebra de 
    safra e fornecer informações estratégicas para órgãos de planejamento, assistência técnica e seguro 
    agrícola.</p></>`,

    fenologia:`<h3>Fenologia de Culturas Agrícolas</h3>
    <p>No AgriRS, o acompanhamento da fenologia das culturas é realizado por meio de séries temporais 
    de índices espectrais derivados de imagens de satélite. Essa abordagem possibilita identificar 
    etapas importantes do ciclo das culturas, como datas de plantio, enchimento de grãos, 
    florescimento e colheita. </p></>`,

    impactos:`<h3>Análise de Impactos Ambientais</h3>
    <p>O AgriRS aplica técnicas de sensoriamento remoto para detectar alterações no uso da terra, como 
    desmatamentos, expansão agrícola sobre áreas naturais e degradação da vegetação nativa. 
    Essas análises podem servir como subsídio para ações de fiscalização ambiental e gestão mais 
    sustentável dos recursos naturais. Isso contribui para a preservação dos biomas e para o 
    desenvolvimento de práticas agrícolas mais sustentáveis.</p></>`,

    quebras:`<h3>Análise de Quebras de Safras</h3>
    <p>Incluir texto (Não disponibilizado pelo INPE)...</p></>`,

    desmatamento:`<h3>Detecção de Desmatamento</h3>
    <p>Incluir texto (Não disponibilizado pelo INPE)...</p></>`,

    //+ Adicione os demais textos aqui
};

// Função para inicializar o modal (chamada após o DOM carregar)
function initModal() {
    // Procura o container da página atual renderizada pelo router
    const outlet = document.querySelector('#app, [data-router-outlet]');
    const page = outlet?.querySelector('.page-scope.page-area-pesquisa') || outlet?.querySelector('.page-scope');
    if (!page) return;

    // Evita registrar listeners duplicados em re-renders
    if (page.dataset.modalBound === '1') return;

    const modal = page.querySelector('#modalInfo');
    const modalTexto = page.querySelector('#modal-texto');
    const modalClose = page.querySelector('.modal-close');

    // Se não existir modal na página atual, não faz nada
    if (!modal || !modalTexto || !modalClose) {
        return;
    }

    // Adiciona evento de clique a todos os botões "Saiba mais" dentro da página
    page.querySelectorAll('.ver-mais').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const chave = link.getAttribute('data-info');
            modalTexto.innerHTML = textosInfo[chave] || '<p>Conteúdo não encontrado.</p>';
            modal.style.display = 'block';
        });
    });

    // Fechar modal ao clicar no X
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar ao clicar fora da caixa
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    page.dataset.modalBound = '1';
}

// Expor funções globalmente para serem chamadas pelo components.js
window.initModal = initModal;
// Não sobrescreve o comportamento do footer se já existir (definido em footer-anim.js)
if (!window.initFooterBehavior) {
  window.initFooterBehavior = function(){};
}


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

            const header = document.createElement('div');
            header.className = 'page-card-header';

            const link = document.createElement('a');
            link.href = n.link || '#';
            link.target = '_blank';

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.alt = n.titulo || 'Notícia';
            img.src = n.image || '/img/Imagem1.png'; // fallback simples

            link.appendChild(img);
            header.appendChild(link);

            const body = document.createElement('div');
            body.className = 'page-card-body';

            const h2 = document.createElement('h2');
            h2.textContent = n.titulo || 'Sem título';
            body.appendChild(h2);

            card.appendChild(header);
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



