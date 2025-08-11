const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const Toast = {
  show(message, type = 'sucesso') {
    const container = $('#toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },
  sucesso(msg) { this.show(msg, 'sucesso'); },
  erro(msg) { this.show(msg, 'erro'); }
};

const FormDSL = {
  get form() { return $('#formulario'); },
  get nome() { return this.form?.nome; },
  get email() { return this.form?.email; },
  get mensagem() { return this.form?.mensagem; },
  get submitBtn() { return this.form?.querySelector('button[type="submit"]'); },
  values() {
    return {
      nome: this.nome?.value?.trim() || '',
      email: this.email?.value?.trim() || '',
      mensagem: this.mensagem?.value?.trim() || ''
    };
  },
  setValues({ nome, email, mensagem }) {
    if (nome != null) this.nome.value = nome;
    if (email != null) this.email.value = email;
    if (mensagem != null) this.mensagem.value = mensagem;
    return this;
  },
  disableSubmit(disabled) {
    if (this.submitBtn) this.submitBtn.disabled = disabled;
    return this;
  },
  reset() {
    this.form?.reset();
    return this;
  }
};

const Validacao = {
  emailValido(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  camposObrigatorios({ nome, email, mensagem }) {
    return Boolean(nome && email && mensagem);
  }
};

const Api = {
  baseUrl() { return window.__CONFIG__?.API_URL || 'http://localhost:8000'; },
  async enviarFormulario(dados) {
    const resposta = await fetch(`${this.baseUrl()}/api/form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    let resultado = null;
    try { resultado = await resposta.json(); } catch (_) { /* noop */ }
    return { resposta, resultado };
  }
};

window.$ = $;
window.$$ = $$;
window.Toast = Toast;
window.FormDSL = FormDSL;
window.Validacao = Validacao;
window.Api = Api;


