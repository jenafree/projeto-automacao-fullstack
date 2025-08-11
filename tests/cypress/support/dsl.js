export const sel = {
  inputNome: '[data-cy="input-nome"]',
  inputEmail: '[data-cy="input-email"]',
  inputMensagem: '[data-cy="input-mensagem"]',
  btnEnviar: '[data-cy="btn-enviar"]',
  toastSucesso: '#toast-container .toast.sucesso',
  toastErro: '#toast-container .toast.erro',
};

class FormNavigator {
  abrir() {
    cy.visit('/');
    return this;
  }

  preencherNome(nome) {
    cy.get(sel.inputNome).clear().type(nome);
    return this;
  }

  preencherEmail(email) {
    cy.get(sel.inputEmail).clear().type(email);
    return this;
  }

  preencherMensagem(mensagem) {
    cy.get(sel.inputMensagem).clear().type(mensagem);
    return this;
  }

  preencher({ nome, email, mensagem }, typeOptions = {}) {
    if (nome) cy.get(sel.inputNome).clear().type(nome, typeOptions);
    if (email) cy.get(sel.inputEmail).clear().type(email, typeOptions);
    if (mensagem) cy.get(sel.inputMensagem).clear().type(mensagem, typeOptions);
    return this;
  }

  enviar() {
    cy.get(sel.btnEnviar).click();
    return this;
  }

  deveVerSucesso(textoParcial = '') {
    const chain = cy.get(sel.toastSucesso).should('be.visible');
    if (textoParcial) chain.and('contain.text', textoParcial);
    return this;
  }

  deveVerErro(textoParcial = '') {
    const chain = cy.get(sel.toastErro).should('be.visible');
    if (textoParcial) chain.and('contain.text', textoParcial);
    return this;
  }
}

Cypress.Commands.add('navegador', () => new FormNavigator());
Cypress.Commands.add('abrirApp', () => cy.visit('/'));

Cypress.Commands.add('preencherNome', (nome, options = {}) => {
  cy.get(sel.inputNome).clear().type(nome, options);
});

Cypress.Commands.add('preencherEmail', (email, options = {}) => {
  cy.get(sel.inputEmail).clear().type(email, options);
});

Cypress.Commands.add('preencherMensagem', (mensagem, options = {}) => {
  cy.get(sel.inputMensagem).clear().type(mensagem, options);
});

Cypress.Commands.add('submeterFormulario', () => {
  cy.get(sel.btnEnviar).click();
});

Cypress.Commands.add('preencherFormulario', (dados, options = {}) => {
  const { nome, email, mensagem } = dados || {};
  if (nome) cy.get(sel.inputNome).clear().type(nome, options);
  if (email) cy.get(sel.inputEmail).clear().type(email, options);
  if (mensagem) cy.get(sel.inputMensagem).clear().type(mensagem, options);
});

Cypress.Commands.add('enviarFormularioCom', (dados, options = {}) => {
  cy.preencherFormulario(dados, options);
  cy.submeterFormulario();
});

Cypress.Commands.add('verificarToastSucesso', (textoParcial) => {
  cy.get(sel.toastSucesso).should('be.visible');
  if (textoParcial) cy.get(sel.toastSucesso).should('contain.text', textoParcial);
});

Cypress.Commands.add('verificarToastErro', (textoParcial) => {
  cy.get(sel.toastErro).should('be.visible');
  if (textoParcial) cy.get(sel.toastErro).should('contain.text', textoParcial);
});


