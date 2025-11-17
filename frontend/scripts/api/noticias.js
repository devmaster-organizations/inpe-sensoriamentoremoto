

function getNoticias() {
  // Usa o proxy local (sem problemas de CORS)
  return fetch('/api/noticias')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Noticias obtidas via proxy:', data);
      return data;
    })
    .catch(error => {
      console.error('❌ Erro ao buscar notícias:', error);
      throw error;
    });
}

// Torna a função disponível globalmente
window.getNoticias = getNoticias;

// Cria uma nova notícia com upload de imagem (FormData com campo 'imagem')
function postNoticia(formData) {
  return fetch('/api/noticias', {
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
      console.log('✅ Notícia criada:', data);
      return data;
    })
    .catch(error => {
      console.error('❌ Erro ao criar notícia:', error);
      throw error;
    });
}

window.postNoticia = postNoticia;