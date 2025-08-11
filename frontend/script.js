// Espera o carregamento completo do conteúdo HTML da página antes de executar o código JS
document.addEventListener('DOMContentLoaded', () => {

  // Pega o formulário com id "formulario" do HTML
  const form = document.getElementById('formulario');

  // Função para exibir mensagens tipo toast (pop-up temporário no canto da tela)
  // Recebe a mensagem (texto) e o tipo (sucesso ou erro)
  const showMensagem = (mensagem, tipo = 'sucesso') => {
    // Seleciona o container onde os toasts serão exibidos
    const container = document.getElementById('toast-container');

    // Cria um novo elemento <div> para o toast
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`; // Aplica a classe toast e a classe do tipo (sucesso/erro)
    toast.textContent = mensagem; // Define o texto do toast

    // Adiciona o toast no container (vai aparecer na tela)
    container.appendChild(toast);

    // Remove o toast da tela após 4 segundos
    setTimeout(() => toast.remove(), 4000);
  };

  // Adiciona um ouvinte de evento de "submit" no formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página

    // Lê os valores dos campos e remove espaços em branco com trim()
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    // Verifica se algum campo está vazio
    if (!nome || !email || !mensagem) {
      // Exibe um toast de erro se tiver campo vazio
      showMensagem('❌ Preencha todos os campos obrigatórios.', 'erro');
      return; // Interrompe o envio
    }

    // Expressão regular para validar o formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // Exibe toast se o e-mail não passar na validação
      showMensagem('❌ Por favor, insira um e-mail válido.', 'erro');
      return; // Interrompe o envio
    }

    // Objeto com os dados que serão enviados para o backend
    const dados = { nome, email, mensagem };

    // Desabilita botão durante envio
    const submitButton = form.querySelector('button[type="submit"]');
    const previousDisabled = submitButton.disabled;
    submitButton.disabled = true;

    try {
      const apiBaseUrl = window.__CONFIG__?.API_URL || 'http://localhost:8000';
      // Envia os dados para a API backend (FastAPI) usando método POST
      const resposta = await fetch(`${apiBaseUrl}/api/form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Informa que está enviando JSON
        body: JSON.stringify(dados), // Converte o objeto para string JSON
      });

      // Aguarda a resposta do servidor em formato JSON
      const resultado = await resposta.json();

      // Verifica se o envio foi bem-sucedido (código 200 OK)
      if (resposta.ok) {
        // Exibe toast de sucesso e limpa o formulário
        showMensagem('✅ Formulário enviado com sucesso!', 'sucesso');
        form.reset(); // Limpa todos os campos
      } else {
        // Se o servidor retornou erro, exibe a mensagem de erro vinda do backend
        const msg = resultado?.mensagem || 'Erro desconhecido.';
        showMensagem('❌ Erro ao enviar: ' + msg, 'erro');
      }

    } catch (erro) {
      // Se houver erro de conexão com o backend (ex: servidor offline), exibe toast de erro
      console.error(erro); // Mostra o erro no console para debug
      showMensagem('❌ Erro na conexão com o servidor.', 'erro');
    } finally {
      submitButton.disabled = previousDisabled;
    }
  });
});
