const { faker } = require('@faker-js/faker');

describe('Formulário de Contato - Testes Completos', () => {
  const URL = 'http://localhost:3000';

  beforeEach(() => {
    // Acessa a aplicação antes de cada teste
    cy.visit(URL);
  });

  it('✅ Deve enviar o formulário com dados válidos (mockado)', () => {
    // Gera dados aleatórios com Faker
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const mensagem = faker.lorem.sentence();

    // Intercepta a requisição e simula resposta bem-sucedida
    cy.intercept('POST', '**/api/form', {
      statusCode: 200,
      body: { mensagem: 'Formulário enviado com sucesso!' }
    }).as('postForm');

    // Preenche o formulário com delay para visualização clara
    cy.get('[data-cy="input-nome"]').type(nome, { delay: 80 });
    cy.get('[data-cy="input-email"]').type(email, { delay: 80 });
    cy.get('[data-cy="input-mensagem"]').type(mensagem, { delay: 50 });

    // Submete o formulário
    cy.get('[data-cy="btn-enviar"]').click();

    // Aguarda a requisição interceptada
    cy.wait('@postForm');

    // Valida a exibição do toast de sucesso
    cy.get('#toast-container .toast.sucesso')
      .should('contain.text', 'Formulário enviado com sucesso!')
      .and('be.visible');
  });

  it('❌ Deve exibir erro ao tentar enviar com campos vazios', () => {
    // Clica no botão sem preencher os campos
    cy.get('[data-cy=btn-enviar]').click();

    // Valida o toast de erro referente aos campos obrigatórios
    cy.get('#toast-container .toast.erro')
      .should('contain.text', 'Preencha todos os campos obrigatórios.')
      .and('be.visible');
  });

  it('❌ Deve exibir erro ao submeter e-mail inválido', () => {
    const nome = faker.person.firstName();
    const mensagem = faker.lorem.text();

    // Preenche os campos com delay, mas insere e-mail inválido
    cy.get('[data-cy="input-nome"]').type(nome, { delay: 80 });
    cy.get('[data-cy="input-email"]').type('email-invalido', { delay: 80 });
    cy.get('[data-cy="input-mensagem"]').type(mensagem, { delay: 50 });

    // Envia o formulário
    cy.get('[data-cy="btn-enviar"]').click();

    // Valida o toast de erro sobre e-mail inválido
    cy.get('#toast-container .toast.erro')
      .should('contain.text', 'Por favor, insira um e-mail válido.')
      .and('be.visible');
  });

  it('🛑 Deve exibir erro se o backend estiver fora do ar', () => {
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const mensagem = faker.lorem.sentence();

    // Força erro de rede para simular backend indisponível
    cy.intercept('POST', '**/api/form', { forceNetworkError: true }).as('postForm');

    // Preenche os campos com dados válidos
    cy.get('[data-cy="input-nome"]').type(nome, { delay: 80 });
    cy.get('[data-cy="input-email"]').type(email, { delay: 80 });
    cy.get('[data-cy="input-mensagem"]').type(mensagem, { delay: 50 });

    // Envia o formulário
    cy.get('[data-cy="btn-enviar"]').click();

    // Valida o toast de erro de conexão
    cy.get('#toast-container .toast.erro')
      .should('contain.text', 'Erro na conexão com o servidor.')
      .and('be.visible');
  });

  it('🚨 Deve exibir erro quando o backend retornar 500', () => {
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const mensagem = faker.lorem.sentence();

    cy.intercept('POST', '**/api/form', {
      statusCode: 500,
      body: { mensagem: 'Falha interna' }
    }).as('postForm500');

    cy.get('[data-cy="input-nome"]').type(nome);
    cy.get('[data-cy="input-email"]').type(email);
    cy.get('[data-cy="input-mensagem"]').type(mensagem);

    cy.get('[data-cy="btn-enviar"]').click();
    cy.wait('@postForm500');

    cy.get('#toast-container .toast.erro')
      .should('contain.text', 'Erro ao enviar:')
      .and('be.visible');
  });
});
