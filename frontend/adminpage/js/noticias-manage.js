/*substitui o noticias-manage.js do arley pelo o meu */


// Base da API via proxy do frontend (evita problemas de porta)
const API_URL = "/api/noticias";

function getToken(){
  return localStorage.getItem('token');
}


// Função para buscar e exibir as notícias
async function carregarNoticias() {
  try {
    // Cache bust para evitar 304 Not Modified mantendo 'Salvando...' preso
    const resposta = await fetch(`${API_URL}?_=${Date.now()}`, { cache: 'no-store' });
    if (resposta.status === 304) {
      // Força nova tentativa sem cache
      const segunda = await fetch(`${API_URL}?force=1&_=${Date.now()}`, { cache: 'no-store' });
      if (!segunda.ok) throw new Error('Falha ao recarregar notícias (304)');
      return renderNoticias(await segunda.json());
    }
    const noticias = await resposta.json();
    renderNoticias(noticias);
  } catch (erro) {
    
    document.getElementById("lista-noticias").innerHTML =
      `<tr><td colspan="6">Erro ao carregar notícias.</td></tr>`;
  }
}

function renderNoticias(noticias){
  const tabela = document.getElementById("lista-noticias");
  tabela.innerHTML = "";
  noticias.forEach(noticia => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${noticia.idnoticia}</td>
      <td>${noticia.titulo}</td>
      <td><a href="${noticia.link}" target="_blank">Acessar</a></td>
      <td>${new Date(noticia.postagem).toLocaleDateString()}</td>
      <td>${noticia.exibir ? "Sim" : "Não"}</td>
      <td class="acoes">
        <button class="action-btn btn-edit" onclick="editarNoticia(${noticia.idnoticia})">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="action-btn btn-delete" onclick="excluirNoticia(${noticia.idnoticia})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>`;
    tabela.appendChild(linha);
  });
}

// 🔹 Adicionar ou atualizar notícia (POST ou PUT)
async function adicionarNoticia(event) {
  event.preventDefault(); // evita recarregar a página

  const titulo = document.getElementById("titulo").value.trim();
  const link = document.getElementById("link").value.trim();
  const postagem = document.getElementById("postagem").value;
  const mensagem = document.getElementById("mensagem");
  const exibir = document.getElementById("exibir").checked;

  if (!titulo || !link || !postagem) {
    mensagem.textContent = "Preencha todos os campos!";
    mensagem.style.color = "red";
    return;
  }

  // Descobre se estamos editando ou criando
  const idEditando = document
    .getElementById("form-noticia")
    .dataset.editandoId || null;

  const metodo = idEditando ? "PUT" : "POST";
  const url = idEditando ? `${API_URL}/${idEditando}` : API_URL;

  mensagem.textContent = "Salvando...";
  mensagem.style.color = "black";

  try {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if(token){ headers['Authorization'] = `Bearer ${token}`; }

    const resposta = await fetch(url, {
      method: metodo,
      headers,
      body: JSON.stringify({ titulo, link, postagem, exibir }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao salvar notícia.");
    }

    mensagem.textContent = idEditando
      ? "✅ Notícia atualizada com sucesso!"
      : "✅ Notícia adicionada com sucesso!";
    mensagem.style.color = "green";

    document.getElementById("form-noticia").reset();
    delete document.getElementById("form-noticia").dataset.editandoId; // limpa modo edição

    carregarNoticias(); // recarrega lista para remover estado "Salvando..."
  } catch (erro) {
    
    mensagem.textContent = "❌ Erro ao salvar notícia.";
    mensagem.style.color = "red";
  }
}

// 🔹 Eventos e inicialização
document.getElementById("form-noticia").addEventListener("submit", adicionarNoticia);

// ✅ Função para excluir uma notícia (DELETE)
async function excluirNoticia(id) {
  if (!confirm("Deseja realmente excluir esta notícia?")) return;

  try {
    const headers = {}; const token = getToken(); if(token){ headers['Authorization'] = `Bearer ${token}`; }
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    alert(data.message || "Notícia excluída com sucesso!");

    carregarNoticias(); // recarrega a lista
  } catch (error) {
    
    alert("Erro ao excluir notícia.");
  }
}

// Função para EDITAR uma notícia
async function editarNoticia(id) {
  try {
    // Busca a notícia específica na API
    const resposta = await fetch(`${API_URL}/${id}`);
    if (!resposta.ok) throw new Error("Erro ao buscar notícia para edição.");

    const noticia = await resposta.json();

    // Torna o formulário visível (caso esteja oculto)
    formSection.style.display = "block";
    botaoMostrarForm.textContent = "❌ Fechar formulário";

    // Preenche os campos do formulário com os dados da notícia
    document.getElementById("titulo").value = noticia.titulo;
    document.getElementById("link").value = noticia.link;
    document.getElementById("postagem").value = noticia.postagem.split("T")[0];
    document.getElementById("exibir").checked = noticia.exibir;

    // Guarda o ID da notícia em edição (vamos usar depois no update)
    document.getElementById("form-noticia").dataset.editandoId = noticia.idnoticia;

    // Exibe mensagem temporária
    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = "✏️ Editando notícia ID " + noticia.idnoticia;
    mensagem.style.color = "blue";
  } catch (erro) {
    
    alert("Erro ao carregar notícia para edição.");
  }
}


//Controle de exibição do formulário
const botaoMostrarForm = document.getElementById("btn-mostrar-form");
const formSection = document.getElementById("form-section");

botaoMostrarForm.addEventListener("click", () => {
  // Alterna entre mostrar e ocultar o formulário
  const visivel = formSection.style.display === "block";

  formSection.style.display = visivel ? "none" : "block";
  botaoMostrarForm.textContent = visivel
    ? "📰 Cadastrar nova notícia"
    : "❌ Fechar formulário";
});


carregarNoticias();