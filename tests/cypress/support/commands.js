import { faker } from '@faker-js/faker';
import './dsl';

Cypress.Commands.add('gerarDadosFormulario', (override = {}) => {
  const dados = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    mensagem: faker.lorem.sentence(),
  };
  return { ...dados, ...override };
});
