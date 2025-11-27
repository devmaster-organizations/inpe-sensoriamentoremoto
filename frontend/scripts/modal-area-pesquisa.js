//===========================
//Módulo de Modal - Área de Pesquisa
//===========================

// Variável para armazenar os dados carregados do JSON
let textosInfo = {};

// Carrega os dados do JSON
async function carregarDadosAreaPesquisa() {
    try {
        const response = await fetch('data/area-pesquisa.json');
        const data = await response.json();
        textosInfo = data.areas;
    } catch (error) {
        console.error('Erro ao carregar dados de área de pesquisa:', error);
        textosInfo = {};
    }
}

// Função para inicializar o modal (chamada após o DOM carregar)
async function initModal() {
    // Carrega os dados antes de inicializar o modal
    await carregarDadosAreaPesquisa();

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

    // Adiciona evento de clique aos cards inteiros
    page.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
            const link = card.querySelector('.ver-mais');
            if (!link) return;
            const chave = link.getAttribute('data-info');
            const area = textosInfo[chave];
            
            if (area) {
                modalTexto.innerHTML = `
                    <div class="modal-image"><img src="${area.imagem}" alt="${area.titulo}"></div>
                    <div class="modal-text">
                        <h3>${area.titulo}</h3>
                        <p>${area.descricao}</p>
                    </div>
                `;
            } else {
                modalTexto.innerHTML = '<p>Conteúdo não encontrado.</p>';
            }
            
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

// Expor função globalmente para ser chamada pelo components.js
window.initModal = initModal;
