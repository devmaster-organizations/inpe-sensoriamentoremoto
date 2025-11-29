document.getElementById("noticias").addEventListener("click", () => {
  window.location.href = "/adminpage/noticias-manage.html";
});

document.getElementById("publicacoes").addEventListener("click", () => {
  window.location.href = "/adminpage/publicacoes-manage.html";
});

document.getElementById("oportunidades").addEventListener("click", () => {
  window.location.href = "/adminpage/oportunidades-manage.html";
});

document.getElementById("sair").addEventListener("click", () => {
  logout();
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  document.cookie = "token=; path=/; max-age=0";
  window.location.href = "/adminpage/login.html";
}
