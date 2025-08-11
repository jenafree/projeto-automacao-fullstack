import { faker } from '@faker-js/faker';

describe('Formulário de Contato', () => {

  beforeEach(() => {
    cy.abrirApp();
  });

  it('deve enviar o formulário com dados válidos (mockado)', () => {
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const mensagem = faker.lorem.sentence();

    cy.intercept('POST', '**/api/form', {
      statusCode: 200,
      body: { mensagem: 'Formulário enviado com sucesso!' }
    }).as('postForm');

    cy.navegador().then((nav) => {
      nav.preencher({ nome, email, mensagem }, { delay: 60 }).enviar();
    });

    cy.wait('@postForm');

    cy.verificarToastSucesso('Formulário enviado com sucesso!');
  });

  it('deve exibir erro ao tentar enviar com campos vazios', () => {
    cy.submeterFormulario();

    cy.verificarToastErro('Preencha todos os campos obrigatórios.');
  });

  it('deve exibir erro ao submeter e-mail inválido', () => {
    const nome = faker.person.firstName();
    const mensagem = faker.lorem.text();

    cy.enviarFormularioCom({ nome, email: 'email-invalido', mensagem }, { delay: 60 });

    cy.verificarToastErro('Por favor, insira um e-mail válido.');
  });

  it('deve exibir erro se o backend estiver fora do ar', () => {
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const mensagem = faker.lorem.sentence();

    cy.intercept('POST', '**/api/form', { forceNetworkError: true }).as('postForm');

    cy.enviarFormularioCom({ nome, email, mensagem }, { delay: 60 });

    cy.verificarToastErro('Erro na conexão com o servidor.');
  });

  it('deve exibir erro quando o backend retornar 500', () => {
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const mensagem = faker.lorem.sentence();

    cy.intercept('POST', '**/api/form', {
      statusCode: 500,
      body: { mensagem: 'Falha interna' }
    }).as('postForm500');

    cy.enviarFormularioCom({ nome, email, mensagem });
    cy.wait('@postForm500');

    cy.verificarToastErro('Erro ao enviar:');
  });
});
