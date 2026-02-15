
const form = document.getElementById('jobForm');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Validação simples
  const nome = form.primeiro_nome.value.trim();
  const email = form.email.value.trim();

  if (!nome || !email) {
    alert('Por favor, preencha os campos obrigatórios.');
    return;
  }

  // Simula envio
  successMsg.style.display = 'block';
  form.reset();

  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 5000);
});
