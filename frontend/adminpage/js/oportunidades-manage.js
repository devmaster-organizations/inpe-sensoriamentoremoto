/*substitui o oprtunidades-manage.js do arley pelo o meu */

// Base via proxy
const API_URL = "/api/oportunidades";

function getToken(){ return localStorage.getItem('token'); }

// Função para buscar e exibir as oportunidades
async function carregarOportunidades() {
  try {
    const resposta = await fetch(API_URL);
    const oportunidades = await resposta.json();

    const tabela = document.getElementById("lista-oportunidades");
                                            
    tabela.innerHTML = ""; // limpa antes de inserir

    oportunidades.forEach(oportunidade => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td>${oportunidade.idoportunidade}</td>
        <td>${oportunidade.titulo}</td>
        <td>${oportunidade.descricao}</td>
        <td>${new Date(oportunidade.validade).toLocaleDateString()}</td>
        <td>${oportunidade.exibir ? "Sim" : "Não"}</td>
        <td class="acoes">
          <button class="action-btn btn-edit" onclick="editarOportunidade(${oportunidade.idoportunidade})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button class="action-btn btn-delete" onclick="excluirOportunidade(${oportunidade.idoportunidade})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
            `;

      tabela.appendChild(linha);
    });
  } catch (erro) {
    
    document.getElementById("lista-oportunidades").innerHTML =
      `<tr><td colspan="6">Erro ao carregar notícias.</td></tr>`;
  }
}


// 🔹 Adicionar ou atualizar notícia (POST ou PUT)
async function adicionarOportunidade(event) {
  event.preventDefault(); // evita recarregar a página
  
  //label de mensagem na pagina html
  const mensagem = document.getElementById("mensagem");

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const validade = document.getElementById("validade").value;
  const exibir = document.getElementById("exibir").checked;
  

  if (!titulo || !descricao || !validade) {
    mensagem.textContent = "Preencha todos os campos!";
    mensagem.style.color = "red";
    return;
  }

  // jocelio ver explicação depois:Descobre se estamos editando ou adicionando
  const idEditando = document.getElementById("form-oportunidade").dataset.editandoId || null;

  const metodo = idEditando ? "PUT" : "POST";
  const url = idEditando ? `${API_URL}/${idEditando}` : API_URL;

  mensagem.textContent = "Salvando...";
  mensagem.style.color = "black";

  try {
    const headers = { "Content-Type": "application/json" };
    const token = getToken(); if(token){ headers['Authorization'] = `Bearer ${token}`; }
    const resposta = await fetch(url, {
      method: metodo,
      headers,
      body: JSON.stringify({ titulo, descricao, validade, exibir }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao salvar Oportunidade/Vaga.");
    }

    mensagem.textContent = idEditando
      ? "✅ Oportunidade/Vaga atualizada com sucesso!"
      : "✅ Oportunidade/Vaga adicionada com sucesso!";
    mensagem.style.color = "green";

    document.getElementById("form-oportunidade").reset();
    delete document.getElementById("form-oportunidade").dataset.editandoId; // limpa modo edição

    carregarOportunidades(); // recarrega lista
  } catch (erro) {
    
    mensagem.textContent = "❌ Erro ao salvar Oportunidade/Vaga.";
    mensagem.style.color = "red";
  }
}

// Eventos e inicialização
document.getElementById("form-oportunidade").addEventListener("submit", adicionarOportunidade);

// ✅ Função para excluir uma notícia (DELETE)
async function excluirOportunidade(id) {
  if (!confirm("Deseja realmente excluir esta Oportunidade/Vaga?")) return;

  try {
    const headers = {}; const token = getToken(); if(token){ headers['Authorization'] = `Bearer ${token}`; }
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    alert(data.message || "Oportunidade/Vaga excluída com sucesso!");

    carregarOportunidades(); // recarrega a lista
  } catch (error) {
    
    alert("Erro ao excluir notícia.");
  }
}

// Função para EDITAR na tela htm de oportunidades
async function editarOportunidade(id) {
  try {
    // Busca a Oportunidade específica na API
    const resposta = await fetch(`${API_URL}/${id}`);
    if (!resposta.ok) throw new Error("Erro ao buscar Oportunidade para edição.");

    const oportunidade = await resposta.json();

    // Torna o formulário visível (caso esteja oculto)
    formSection.style.display = "block";
    botaoMostrarForm.textContent = "❌ Fechar formulário";

    // Preenche os campos do formulário com os dados da notícia
    document.getElementById("titulo").value = oportunidade.titulo;
    document.getElementById("descricao").value = oportunidade.descricao;
    // jocelio ver explicação 
    document.getElementById("validade").value = oportunidade.validade.split("T")[0];
    document.getElementById("exibir").checked = oportunidade.exibir;

    // Guarda o ID da notícia em edição (vamos usar depois no update)
    document.getElementById("form-oportunidade").dataset.editandoId = oportunidade.idoportunidade;

    // Exibe mensagem temporária
    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = "✏️ Editando uma Oportunidade/Vaga ID " + oportunidade.idoportunidade;
    mensagem.style.color = "blue";
  } catch (erro) {
    
    alert("Erro ao carregar Oportunidade para edição.");
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
    ? "📰 Cadastrar nova oportunidade"
    : "❌ Fechar formulário";
});

carregarOportunidades();