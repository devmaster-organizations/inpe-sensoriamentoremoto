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
    // Verifica se os elementos existem antes de tentar usá-los
    const modal = document.getElementById('modalInfo');
    const modalTexto = document.getElementById('modal-texto');
    const modalClose = document.querySelector('.modal-close');
    
    // Se não existir modal na página atual, não faz nada
    if (!modal || !modalTexto || !modalClose) {
        return;
    }
    
    // Adiciona evento de clique a todos os botões "Saiba mais"
    document.querySelectorAll('.ver-mais').forEach(link => {
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
}

// Função para gerenciar o footer inteligente
function initFooterBehavior() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // Detecta scroll para mostrar/esconder footer
    let ticking = false;
    
    function updateFooter() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
        
        // Mostra footer completo quando chegar a 90% da página
        if (scrollPercentage >= 0.9) {
            footer.classList.add('show-full');
        } else {
            footer.classList.remove('show-full');
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateFooter);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', requestTick);
    
    // Verifica posição inicial
    updateFooter();
}

// Expor funções globalmente para serem chamadas pelo components.js
window.initModal = initModal;
window.initFooterBehavior = initFooterBehavior;



