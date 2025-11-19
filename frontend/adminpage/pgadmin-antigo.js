// Função para validar o formulário
function validarFormulario(event) {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var errorMessage = document.getElementById('error-message');

    // Limpa mensagens de erro anteriores
    errorMessage.textContent = '';

    // Verifica se os campos estão vazios
    if (username === '' || password === '') {
        errorMessage.textContent = 'Por favor, preencha todos os campos.';
        return false; // Impede o envio do formulário
    }

    // Se tudo estiver correto, redireciona
    window.location.href = 'btns.html'; // Redireciona para a página de botões

    // Impede o envio do formulário
    event.preventDefault();
}

