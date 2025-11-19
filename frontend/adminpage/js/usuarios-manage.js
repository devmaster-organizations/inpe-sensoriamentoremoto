/* eslint-env browser */

const flashEl = document.getElementById("flash");
const tbody = document.getElementById("users-body");
const reloadBtn = document.getElementById("btn-reload");
const createForm = document.getElementById("form-create");
const updateForm = document.getElementById("form-update");
const logoutBtn = document.getElementById("btn-logout");
const modalEl = document.getElementById("confirm-modal");
const modalText = document.getElementById("confirm-text");
const modalCancel = document.getElementById("confirm-cancel");
const modalAccept = document.getElementById("confirm-accept");

let pendingDelete = null;

function setFlash(message, type = "") {
  flashEl.className = "msg";
  if (message) {
    flashEl.textContent = message;
    flashEl.classList.add(type || "success");
  } else {
    flashEl.textContent = "";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  document.cookie = "token=; path=/; max-age=0";
  window.location.href = "/login.html";
}

function getToken() {
  return localStorage.getItem("token");
}

async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const opts = {
    credentials: "include",
    ...options,
    headers,
  };
  const res = await fetch(path, opts);
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    if (res.status === 401) {
      setFlash("Sessão expirada. Faça login novamente.", "error");
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 1200);
    }
    const msg =
      (data && (data.error || data.message)) ||
      `Erro ao comunicar com o servidor (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return data;
}

function renderUsuarios(lista) {
  tbody.innerHTML = "";
  if (!lista || lista.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      '<td class="empty" colspan="3">Nenhum usuário cadastrado.</td>';
    tbody.appendChild(row);
    return;
  }

  lista.forEach((usuario) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${usuario.idusuario}</td>
      <td>${usuario.mail}</td>
      <td>
        <div class="actions">
          <button type="button" data-id="${usuario.idusuario}" data-mail="${usuario.mail}">Excluir</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function carregarUsuarios() {
  try {
    const usuarios = await apiFetch("/api/usuarios");
    renderUsuarios(usuarios);
  } catch (err) {
    setFlash(err.message, "error");
  }
}

function abrirModalConfirmacao(usuario) {
  pendingDelete = usuario;
  modalText.textContent = `Confirmar a exclusão do usuário "${usuario.mail}"? Esta ação não pode ser desfeita.`;
  modalEl.classList.add("open");
}

function fecharModal() {
  pendingDelete = null;
  modalEl.classList.remove("open");
}

async function excluirUsuario(id) {
  await apiFetch(`/api/usuarios/${id}`, { method: "DELETE" });
  await carregarUsuarios();
  setFlash("Usuário excluído com sucesso.", "success");
}

function preencherEmailAtual() {
  try {
    const stored = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (stored?.mail) {
      document.getElementById("update-mail").value = stored.mail;
    }
  } catch {
    // Ignora erro de parsing
  }
}

function init() {
  preencherEmailAtual();
  carregarUsuarios();

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
    });
  }

  reloadBtn.addEventListener("click", () => {
    setFlash("", "");
    carregarUsuarios();
  });

  tbody.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn || !btn.dataset.id) return;
    abrirModalConfirmacao({
      idusuario: Number(btn.dataset.id),
      mail: btn.dataset.mail,
    });
  });

  modalCancel.addEventListener("click", fecharModal);
  modalEl.addEventListener("click", (event) => {
    if (event.target === modalEl) {
      fecharModal();
    }
  });

  modalAccept.addEventListener("click", async () => {
    if (!pendingDelete) return;
    const { idusuario } = pendingDelete;
    fecharModal();
    try {
      await excluirUsuario(idusuario);
    } catch (err) {
      setFlash(err.message, "error");
    }
  });

  createForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const mail = document.getElementById("create-mail").value.trim();
    const senha = document.getElementById("create-senha").value;
    if (!mail || !senha) {
      setFlash("Informe e-mail e senha para cadastrar.", "error");
      return;
    }
    try {
      await apiFetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail, senha }),
      });
      setFlash("Usuário cadastrado com sucesso.", "success");
      createForm.reset();
      await carregarUsuarios();
    } catch (err) {
      setFlash(err.message, "error");
    }
  });

  updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const mail = document.getElementById("update-mail").value.trim();
    const senha = document.getElementById("update-senha").value;
    if (!mail && !senha) {
      setFlash("Informe ao menos um campo para atualizar.", "error");
      return;
    }
    const payload = {};
    if (mail) payload.mail = mail;
    if (senha) payload.senha = senha;

    try {
      await apiFetch("/api/usuarios/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setFlash("Dados atualizados com sucesso.", "success");
      document.getElementById("update-senha").value = "";
      if (payload.mail) {
        const stored = JSON.parse(localStorage.getItem("usuario") || "{}");
        const novoUsuario = { ...stored, mail: payload.mail };
        localStorage.setItem("usuario", JSON.stringify(novoUsuario));
      }
    } catch (err) {
      setFlash(err.message, "error");
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
