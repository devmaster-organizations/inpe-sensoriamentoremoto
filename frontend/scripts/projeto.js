// Inicialização da página Projetos: navegação para subpáginas de projetos
(function(){
  function initProjeto(){
    const page = document.querySelector('[data-page="projeto"]');
    if(!page) return;

    const cards = page.querySelectorAll('.project-card[data-projeto]');
    
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const pagina = card.getAttribute('data-projeto');
        if(pagina){
          // Navega para a subpágina do projeto via hash SPA
          // Assumindo que as páginas estarão em componentes/page/projeto/{pagina}.html
          // e serão carregadas pelo router como #/projeto/{pagina}
          window.location.hash = `#/projeto-${pagina}`;
        }
      });
    });
  }

  window.initProjeto = initProjeto;
})();
