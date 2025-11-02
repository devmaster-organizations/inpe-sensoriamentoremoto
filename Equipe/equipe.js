async function carregarEquipe() {
  const res = await fetch('equipe.json');
  const dados = await res.json();
  const container = document.getElementById('categorias-container');

  Object.keys(dados).forEach(categoria => {
    const secao = document.createElement('section');
    secao.classList.add('categoria');

    const titulo = document.createElement('h2');
    titulo.textContent = categoria;
    secao.appendChild(titulo);

    const cards = document.createElement('div');
    cards.classList.add('cards');

    dados[categoria]
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .forEach(membro => {
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
}

function abrirModal(membro) {
  const modal = document.getElementById('modal');
  document.getElementById('modal-img').src = membro.foto;
  document.getElementById('modal-nome').textContent = membro.nome;
  document.getElementById('modal-funcao').textContent = membro.funcao;
  document.getElementById('modal-descricao').textContent = membro.descricao;
  document.getElementById('modal-lattes').href = membro.lattes;
  modal.style.display = 'flex';
}

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});
window.addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) {
    document.getElementById('modal').style.display = 'none';
  }
});
carregarEquipe();
