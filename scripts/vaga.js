const searchInput = document.getElementById("searchinput-vaga");
    const filterSelect = document.getElementById("filter-vaga");
    const vagas = document.querySelectorAll(".card-vagas");

    function filtrarVagas() {
      const texto = searchInput.value.toLowerCase();
      const filtro = filterSelect.value;

      vagas.forEach(vaga => {
        const titulo = vaga.querySelector("h3").innerText.toLowerCase();
        const descricao = vaga.querySelector(".vaga-desc").innerText.toLowerCase();
        const tipo = vaga.dataset.tipo;

        const matchTexto = titulo.includes(texto) || descricao.includes(texto);
        const matchFiltro = filtro === "todas" || filtro === tipo;

        vaga.style.display = matchTexto && matchFiltro ? "block" : "none";
      });
    }

    searchInput.addEventListener("input", filtrarVagas);
    filterSelect.addEventListener("change", filtrarVagas);

    // Redirecionar para página de candidatura
    const botoesCandidatar = document.querySelectorAll(".btn-candidatar");
    botoesCandidatar.forEach(botao => {
      botao.addEventListener("click", () => {
        const vaga = botao.dataset.vaga;
        window.location.href = `candidatura.html?vaga=${encodeURIComponent(vaga)}`;
      });
    });