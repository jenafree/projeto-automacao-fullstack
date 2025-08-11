import { faker } from '@faker-js/faker';

// Comando para gerar dados de formulário fake
Cypress.Commands.add('gerarDadosFormulario', () => {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    mensagem: faker.lorem.sentence(),
  };
});
