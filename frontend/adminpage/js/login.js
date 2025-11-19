/* eslint-env browser */

function setMessage(text, type = "") {
  const el = document.getElementById("error-message");
  el.className = type;
  el.textContent = text || "";
}

async function doLogin(mail, senha) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mail, senha }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `Falha no login (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return data;
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMessage("", "");
  const mail = document.getElementById("mail").value.trim();
  const senha = document.getElementById("senha").value;
  if (!mail || !senha) {
    setMessage("Informe e-mail e senha", "error");
    return;
  }
  try {
    const { token, usuario } = await doLogin(mail, senha);
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    // Também grava um cookie simples (não-HttpOnly) para permitir proteção server-side de páginas estáticas
    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=7200`;
    setMessage("Login realizado com sucesso. Redirecionando...", "success");
    setTimeout(() => {
      window.location.href = "/admin/manage";
    }, 600);
  } catch (err) {
    setMessage(err.message, "error");
  }
});
