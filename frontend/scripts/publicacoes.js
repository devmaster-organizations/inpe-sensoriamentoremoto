document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search input"); // Campo de busca
    const cards = document.querySelectorAll(".card"); // Todos os cards
  
    searchInput.addEventListener("input", () => {
      const searchValue = searchInput.value.toLowerCase().trim(); // Texto digitado
  
      cards.forEach(card => {
        const title = card.querySelector("h2").textContent.toLowerCase(); // Texto do título
        // Exibe o card se o texto do título contiver o termo pesquisado
        if (title.includes(searchValue)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
});


if (searchValue === "" || title.includes(searchValue)) {
      card.style.display = "flex";
} else {
    card.style.display = "none";
}
    
if (title.includes(searchValue)) {
    card.classList.remove("hide");
} else {
    card.classList.add("hide");
  }
      