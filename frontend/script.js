// Espera o carregamento completo do conteúdo HTML da página antes de executar o código JS
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  const mensagemEl = document.getElementById('mensagem');
  const countEl = document.getElementById('count-mensagem');
  const bgEl = document.getElementById('bg');
  const bgUrl = window.__CONFIG__?.BG_URL;
  if (bgEl && bgUrl) {
    bgEl.style.setProperty('--bg-image', `url('${bgUrl}')`);
  }
  mensagemEl.addEventListener('input', () => {
    countEl.textContent = `${mensagemEl.value.length}/500`;
  });

  const DRAFT_KEY = 'form-draft-v1';
  const saveDraft = () => localStorage.setItem(DRAFT_KEY, JSON.stringify(FormDSL.values()));
  const loadDraft = () => {
    const d = localStorage.getItem(DRAFT_KEY);
    if (d) FormDSL.setValues(JSON.parse(d));
  };
  const debounce = (fn, ms=300) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  document.addEventListener('DOMContentLoaded', loadDraft);
  form.addEventListener('input', debounce(saveDraft, 300));

  const progressEl = document.getElementById('progress-bar');
  const updateProgress = () => {
    const { nome, email, mensagem } = FormDSL.values();
    const fields = [nome, email, mensagem];
    const filled = fields.filter(v => v && v.length > 0).length;
    const pct = Math.round((filled / fields.length) * 100);
    progressEl.style.width = `${pct}%`;
  };
  form.addEventListener('input', updateProgress);
  updateProgress();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { nome, email, mensagem } = FormDSL.values();

    const setFieldError = (input, message) => {
      const errorEl = document.getElementById(`erro-${input.name}`);
      const hasError = Boolean(message);
      input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
      if (errorEl) errorEl.textContent = message || '';
    };

    const validateField = (input) => {
      if (input.name === 'email' && !Validacao.emailValido(input.value.trim())) {
        return setFieldError(input, 'Por favor, insira um e-mail válido.');
      }
      if (!input.value.trim()) {
        return setFieldError(input, 'Campo obrigatório.');
      }
      setFieldError(input, '');
    };

    if (!Validacao.camposObrigatorios({ nome, email, mensagem })) {
      [form.nome, form.email, form.mensagem].forEach(validateField);
      Toast.erro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!Validacao.emailValido(email)) {
      validateField(form.email);
      Toast.erro('Por favor, insira um e-mail válido.');
      return;
    }

    const dados = { nome, email, mensagem };

    const submitButton = FormDSL.submitBtn;
    const previousDisabled = submitButton.disabled;
    FormDSL.disableSubmit(true);

    try {
      const { resposta, resultado } = await Api.enviarFormulario(dados);
      if (resposta.ok) {
        Toast.sucesso('Formulário enviado com sucesso!');
        FormDSL.reset();
      } else {
        const msg = resultado?.mensagem || 'Erro desconhecido.';
        Toast.erro('Erro ao enviar: ' + msg);
      }
    } catch (erro) {
      console.error(erro);
      Toast.erro('Erro na conexão com o servidor.');
    } finally {
      FormDSL.disableSubmit(previousDisabled);
    }
  });
});
