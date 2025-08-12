import { faker } from '@faker-js/faker';

describe('Smoke - Contato', () => {
  beforeEach(() => {
    cy.abrirApp();
  });

  it('valida campos obrigatórios rapidamente', () => {
    cy.submeterFormulario();
    cy.verificarToastErro('Preencha todos os campos obrigatórios.');
  });

  it('envia com sucesso (mockado) rapidamente', () => {
    const nome = faker.person.firstName();
    const email = faker.internet.email();
    const mensagem = 'teste';

    cy.intercept('POST', '**/api/form', {
      statusCode: 200,
      body: { mensagem: 'Formulário enviado com sucesso!' }
    }).as('postForm');

    cy.enviarFormularioCom({ nome, email, mensagem });
    cy.wait('@postForm');
    cy.verificarToastSucesso('Formulário enviado com sucesso!');
  });
});


