const { faker } = require('@faker-js/faker');

describe('Formulário de Contato - Testes Completos', () => {
  const URL = 'http://localhost:3000';

  beforeEach(() => {
    cy.abrirApp();
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

    // DSL: navigator fluente com preenchimento e envio
    cy
      .navegador()
      .preencher({ nome, email, mensagem }, { delay: 60 })
      .enviar();

    // Aguarda a requisição interceptada
    cy.wait('@postForm');

    cy.deveVerSucesso?.('Formulário enviado com sucesso!');
    // fallback utilitário
    cy.verificarToastSucesso('Formulário enviado com sucesso!');
  });

  it('❌ Deve exibir erro ao tentar enviar com campos vazios', () => {
    cy.submeterFormulario();

    cy.verificarToastErro('Preencha todos os campos obrigatórios.');
  });

  it('❌ Deve exibir erro ao submeter e-mail inválido', () => {
    const nome = faker.person.firstName();
    const mensagem = faker.lorem.text();

    cy.enviarFormularioCom({ nome, email: 'email-invalido', mensagem }, { delay: 60 });

    cy.verificarToastErro('Por favor, insira um e-mail válido.');
  });

  it('🛑 Deve exibir erro se o backend estiver fora do ar', () => {
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const mensagem = faker.lorem.sentence();

    // Força erro de rede para simular backend indisponível
    cy.intercept('POST', '**/api/form', { forceNetworkError: true }).as('postForm');

    cy.enviarFormularioCom({ nome, email, mensagem }, { delay: 60 });

    cy.verificarToastErro('Erro na conexão com o servidor.');
  });

  it('🚨 Deve exibir erro quando o backend retornar 500', () => {
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
