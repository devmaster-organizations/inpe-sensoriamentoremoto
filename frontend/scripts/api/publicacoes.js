// API para publicações

function getPublicacoes() {
  return fetch('/api/publicacoes')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Publicações obtidas via proxy:', data);
      return data;
    })
    .catch(error => {
      console.error('❌ Erro ao buscar publicações:', error);
      throw error;
    });
}

// Cria uma nova publicação com upload de imagem (FormData com campo 'imagem')
function postPublicacao(formData) {
  return fetch('/api/publicacoes', {
    method: 'POST',
    body: formData,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Publicação criada:', data);
      return data;
    })
    .catch(error => {
      console.error('❌ Erro ao criar publicação:', error);
      throw error;
    });
}

window.getPublicacoes = getPublicacoes;
window.postPublicacao = postPublicacao;
