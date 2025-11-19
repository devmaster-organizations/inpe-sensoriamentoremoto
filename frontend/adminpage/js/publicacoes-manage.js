// Base da API via proxy do frontend
const API_URL = "/api/publicacoes";

function getToken(){
  return localStorage.getItem('token');
}

// Função para buscar e exibir as publicações
async function carregarPublicacoes() {
  try {
    const resposta = await fetch(`${API_URL}?_=${Date.now()}`, { cache: 'no-store' });
    if (resposta.status === 304) {
      const r2 = await fetch(`${API_URL}?force=1&_=${Date.now()}`, { cache: 'no-store' });
      if (!r2.ok) throw new Error('Falha ao recarregar publicações (304)');
      return renderPublicacoes(await r2.json());
    }
    const publicacoes = await resposta.json();

    renderPublicacoes(publicacoes);
  } catch (erro) {
    
    document.getElementById("lista-publicacoes").innerHTML =
      `<tr><td colspan="6">Erro ao carregar publicações.</td></tr>`;
  }
}

function renderPublicacoes(publicacoes){
  const tabela = document.getElementById("lista-publicacoes");
  tabela.innerHTML = "";
  publicacoes.forEach(publicacao => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${publicacao.idpublicacao}</td>
      <td>${publicacao.texto}</td>
      <td>${publicacao.ano}</td>
      <td><a href="${publicacao.link}" target="_blank">Acessar</a></td>
      <td>${publicacao.doi}</td>
      <td><a href="${publicacao.filePath}" target="_blank">Acessar</a></td>
      <td class="acoes">
        <button class="action-btn btn-edit" onclick="editarPublicacao(${publicacao.idpublicacao})">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="action-btn btn-delete" onclick="excluirPublicacao(${publicacao.idpublicacao})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>`;
    tabela.appendChild(linha);
  });
}

// 🔹 Adicionar ou atualizar notícia (POST ou PUT)
async function adicionarPublicacao(event) {
  event.preventDefault(); // evita recarregar a página

  const mensagem = document.getElementById("mensagem");
  const texto = document.getElementById("texto").value.trim();
  const ano = document.getElementById("ano").value.trim();
  const link = document.getElementById("link").value.trim();
  const doi = document.getElementById("doi").value.trim();
  const filePath = document.getElementById("filePath").value;

  if (!texto || !ano || !link || !doi || !filePath) {
    mensagem.textContent = "Preencha todos os campos!";
    mensagem.style.color = "red";
    return;
  }

  // Descobre se estamos editando ou criando
  const idEditando = document
    .getElementById("form-publicacao")
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
      body: JSON.stringify({ texto, ano, link, doi, filePath }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao salvar publicação.");
    }

    mensagem.textContent = idEditando
      ? "✅ Publicação atualizada com sucesso!"
      : "✅ Publicação adicionada com sucesso!";
    mensagem.style.color = "green";

    document.getElementById("form-publicacao").reset();
    delete document.getElementById("form-publicacao").dataset.editandoId; // limpa modo edição

    carregarPublicacoes(); // recarrega lista
  } catch (erro) {
    
    mensagem.textContent = "❌ Erro ao salvar publicação.";
    mensagem.style.color = "red";
  }
}

// põe um Evento no botão cadastrar publicação
document.getElementById("form-publicacao").addEventListener("submit", adicionarPublicacao);

// ✅ Função para excluir uma publicação (DELETE)
async function excluirPublicacao(id) {
  if (!confirm("Deseja realmente excluir esta publicação?")) return;

  try {
    const headers = {}; const token = getToken(); if(token){ headers['Authorization'] = `Bearer ${token}`; }
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    alert(data.message || "Publicação excluída com sucesso!");

    carregarPublicacoes(); // recarrega a lista
  } catch (error) {
    
    alert("Erro ao excluir publicação.");
  }
}

// Função para EDITAR uma publicação
async function editarPublicacao(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    if (!resposta.ok) throw new Error("Erro ao buscar publicação para edição.");
    const publicacao = await resposta.json();

    formSection.style.display = "block";
    botaoMostrarForm.textContent = "❌ Fechar formulário";

    document.getElementById("texto").value = publicacao.texto || "";
    document.getElementById("ano").value = publicacao.ano || "";
    document.getElementById("link").value = publicacao.link || "";
    document.getElementById("doi").value = publicacao.doi || "";
    document.getElementById("filePath").value = publicacao.filePath || "";

    document.getElementById("form-publicacao").dataset.editandoId = publicacao.idpublicacao;

    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = "✏️ Editando publicação ID " + publicacao.idpublicacao;
    mensagem.style.color = "blue";
  } catch (erro) {
    alert("Erro ao carregar publicação para edição.");
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
    ? "📰 Cadastrar nova publicação"
    : "❌ Fechar formulário";
});

carregarPublicacoes();