document.getElementById("noticias").addEventListener("click", () => {
  window.location.href = "/admin/noticias"; // Redireciona para a página de notícias
});

document.getElementById("publicacoes").addEventListener("click", () => {
  window.location.href = "/admin/publicacoes"; // Redireciona para a página de publicações
});

document.getElementById("oportunidades").addEventListener("click", () => {
  window.location.href = "/admin/oportunidades"; // Redireciona para a página de oportunidades
});

document.getElementById("sair").addEventListener("click", () => {
  logout();
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  document.cookie = "token=; path=/; max-age=0";
  window.location.href = "/login";
}
