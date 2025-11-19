// API para vagas

function getVagas() {
  // Padronizado para oportunidades (vagas == oportunidades)
  return fetch('/api/oportunidades')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Vagas obtidas via proxy:', data);
      return data;
    })
    .catch(error => {
      console.error('❌ Erro ao buscar vagas:', error);
      throw error;
    });
}

// Cria uma nova vaga com upload de imagem (FormData com campo 'imagem')
function postVaga(formData) {
  return fetch('/api/oportunidades', {
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
      console.log('✅ Vaga criada:', data);
      return data;
    })
    .catch(error => {
      console.error('❌ Erro ao criar vaga:', error);
      throw error;
    });
}

window.getVagas = getVagas;
window.postVaga = postVaga;
