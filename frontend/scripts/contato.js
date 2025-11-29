// Inicialização da página Contatos: captura submit e envia para /api/contatos
(function(){
  function initContato(){
    const form = document.querySelector('[data-page="contatos"] [data-contato-form]');
    if(!form) return;
    const feedback = form.querySelector('.form-feedback');

    function setFeedback(msg, ok){
      if(!feedback) return;
      feedback.textContent = msg;
      feedback.style.color = ok ? 'green' : 'red';
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setFeedback('Enviando...', true);
      const fd = new FormData(form);
      const payload = {
        nome: fd.get('nome')?.trim(),
        email: fd.get('email')?.trim(),
        assunto: fd.get('assunto')?.trim(),
        mensagem: fd.get('mensagem')?.trim()
      };

      // Validação simples
      if(!payload.nome || !payload.email || !payload.mensagem){
        setFeedback('Preencha os campos obrigatórios.', false);
        return;
      }

      try {
        const res = await fetch('/api/contatos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if(res.ok){
          if(res.status === 202){
            setFeedback('Mensagem registrada (modo log).', true);
          } else {
            setFeedback('Mensagem enviada com sucesso!', true);
          }
          form.reset();
        } else {
          setFeedback(data.error || 'Falha ao enviar.', false);
        }
      } catch(err){
        console.error('Erro envio contato', err);
        setFeedback('Erro de rede ao enviar.', false);
      }
    });
  }

  // Expondo para components.js chamar se quiser no slug contatos
  window.initContato = initContato;
})();
