

// Carrega o arquivo JSON de forma assíncrona

async function carregartextos() {
    try {
        const resposta = await fetch('./noticias.json');
        const textosInfo = await resposta.json();
        console.log(textosInfo);
        inicializarModal(textosInfo);
    } catch (erro) {
        console.error('Erro ao carregar JSON', erro);
    }
}




function inicializarModal(textosInfo) {
    const modal = document.getElementById('modalInfo');
    const modalTexto = document.getElementById('modal-texto');
    const modalClose = document.querySelector('.modal-close');

    // Adiciona evento de clique a todos os botões "Saiba mais"
    document.querySelectorAll('.ver-mais').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const chave = link.getAttribute('data-info');
            const conteudo = textosInfo[chave]

            if (conteudo) {
                modalTexto.innerHTML = `
        <h3>${conteudo.titulo}</h3>
        <p>${conteudo.texto}</p>
        `;
            } else {
                modalTexto.innerHTML = '<p>Conteúdo não encontrado.</p>';
            }

            modal.style.display = 'block';
        });
    });

    //Fechar modal ao clicar no X
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    //Fechar ao clicar fora da caixa
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

}