document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#searchinput"); // seu HTML usa esse id
  const cards = document.querySelectorAll(".page-card");

  function hideCard(card) {
    if (card.classList.contains("hidden")) return;
    // adiciona a classe que inicia a transição
    card.classList.add("hidden");

    // quando terminar a transição de opacity, remover do fluxo (display:none)
    const onTransitionEnd = (e) => {
      if (e.propertyName === "opacity") {
        card.style.display = "none";
        card.removeEventListener("transitionend", onTransitionEnd);
      }
    };
    card.addEventListener("transitionend", onTransitionEnd);
  }

  function showCard(card) {
    // se já está visível, não faz nada
    if (!card.classList.contains("hidden") && card.style.display !== "none") return;

    // coloca no fluxo para ocupar espaço
    card.style.display = "flex";

    // garantir que o browser registre o display antes de remover a classe (dispara a transição)
    requestAnimationFrame(() => {
      card.classList.remove("hidden");
    });
  }

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {
      // selecione corretamente o h2 dentro do card-body para evitar pegar outro h2 (padrão seguro)
      const titleEl = card.querySelector(".page-card-body h2") || card.querySelector("h2");
      const title = (titleEl?.textContent || "").toLowerCase();

      if (q === "" || title.includes(q)) {
        showCard(card);
      } else {
        hideCard(card);
      }
    });
  });
});
