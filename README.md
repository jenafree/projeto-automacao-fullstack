# 🚀 Projeto de Automação Fullstack com Cypress, Robot, Segurança e IA

Este projeto é uma aplicação fullstack simples criada para treinar testes automatizados com **Cypress** e **Robot Framework**, explorando também conceitos de **segurança de aplicações** e abrindo espaço para **inteligência artificial aplicada a testes**.

## 📌 Objetivo

Criar um ambiente completo com frontend, backend e testes automatizados, que pode evoluir para aplicações mais avançadas com foco em:

- Testes E2E (End-to-End)
- Testes de API
- Simulações de ataques e segurança
- Geração de dados com IA
- Interpretação de logs com IA

## 🛠️ Tecnologias Utilizadas

| Camada        | Ferramenta/Stack       |
|---------------|------------------------|
| **Frontend**  | HTML, CSS, JS (vanilla)|
| **Backend**   | Python (FastAPI)       |
| **Testes UI** | Cypress (JavaScript)   |
| **Testes API**| Robot Framework (Python) |
| **Orquestração** | Docker + Compose     |
| **CI/CD**     | GitHub Actions         |
| **Futuro**    | Kubernetes, LLMs, OWASP ZAP |

## 📁 Estrutura do Projeto

    projeto-automacao-fullstack/
    ├── frontend/              # Página HTML com formulário
    ├── backend/               # FastAPI com rota POST
    ├── tests/
    │   ├── cypress/           # Testes E2E (Cypress)
    │   └── robot/             # Testes de API (Robot)
    ├── docker/                # Dockerfiles por módulo
    ├── k8s/                   # Kubernetes (futuramente)
    ├── .github/workflows/     # CI/CD GitHub Actions
    ├── docker-compose.yml     # Ambiente completo local
    └── README.md              # Este arquivo

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js (v20+)
- Python 3.10+
- Docker
- Git

### Clonando o repositório

```bash
git clone https://github.com/seu-usuario/projeto-automacao-fullstack.git
cd projeto-automacao-fullstack
```

### Rodando com Docker

```bash
docker-compose up --build
```

## 🧪 Como Executar os Testes

### Cypress (Frontend)

```bash
cd tests/cypress
npx cypress open   # modo visual
npx cypress run    # modo headless
```

### Robot Framework (API)

```bash
cd tests/robot
robot test_form.robot
```

## 🛡️ Segurança (Fases Futuras)

- Injeção de payloads maliciosos
- Testes de autenticação
- Validação de vulnerabilidades com OWASP ZAP
- Simulações de XSS e SQLi

## 🤖 IA e Machine Learning (Fases Futuras)

- Geração de inputs com IA (Faker + LLMs)
- Análise de logs de teste automatizada
- Geração de testes com base no comportamento do usuário
- Chatbot interno para validação de UX

## 📅 Roadmap

### MVP
- [x] Frontend simples com formulário
- [x] Backend FastAPI com rota POST
- [ ] Teste Cypress do fluxo completo
- [ ] Teste Robot da API
- [ ] Docker Compose unificado

### Evoluções
- [ ] Testes de segurança
- [ ] CI/CD com GitHub Actions
- [ ] Execução em Kubernetes
- [ ] IA para análise e geração de testes

## 🧑‍💻 Autor

**Neftali**

Este projeto faz parte de um estudo pessoal sobre testes, automação e IA aplicada ao desenvolvimento de software.

## 🪪 Licença

MIT License – sinta-se livre para usar, estudar e contribuir!
