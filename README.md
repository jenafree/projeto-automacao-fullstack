# 🚀 Projeto de Automação Fullstack — Cypress, k6, Segurança e FastAPI

Monorepo com frontend simples (HTML/CSS/JS), backend em FastAPI (Python), testes E2E com Cypress, testes de performance com k6 (TypeScript) e checks de segurança integrados em CI.

## Sumário
- [🚀 Projeto de Automação Fullstack — Cypress, k6, Segurança e FastAPI](#-projeto-de-automação-fullstack--cypress-k6-segurança-e-fastapi)
  - [Sumário](#sumário)
  - [📁 Estrutura](#-estrutura)
  - [🛠️ Tecnologias](#️-tecnologias)
  - [▶️ Como rodar (rápido)](#️-como-rodar-rápido)
    - [Docker (recomendado)](#docker-recomendado)
    - [Local (Windows PowerShell)](#local-windows-powershell)
  - [🔌 Endpoints principais](#-endpoints-principais)
  - [⚙️ Config do Frontend](#️-config-do-frontend)
    - [DSL e UI do Frontend](#dsl-e-ui-do-frontend)
    - [Tokens de design](#tokens-de-design)
    - [Microinterações e A11y](#microinterações-e-a11y)
    - [Background animado (Ken Burns)](#background-animado-ken-burns)
  - [🧪 Testes](#-testes)
    - [Cypress (E2E)](#cypress-e2e)
      - [DSL nos testes (Cypress)](#dsl-nos-testes-cypress)
    - [k6 (performance)](#k6-performance)
  - [🔒 Segurança](#-segurança)
  - [🤖 CI (GitHub Actions)](#-ci-github-actions)
  - [🧭 Convenções](#-convenções)
  - [📌 Requisitos](#-requisitos)
  - [📄 Licença](#-licença)
  - [Scripts úteis adicionais](#scripts-úteis-adicionais)
  - [Protótipos (preview)](#protótipos-preview)
  - [Por que DSL neste projeto (e não POM)?](#por-que-dsl-neste-projeto-e-não-pom)
  - [Objetivo de carreira (QA/Engenheiro de Testes)](#objetivo-de-carreira-qaengenheiro-de-testes)
  - [Como contribuir / feedback](#como-contribuir--feedback)

<a id="estrutura"></a>
## 📁 Estrutura

```
projeto-automacao-fullstack/
├── backend/                 # FastAPI (validação com Pydantic, /health)
├── frontend/                # Formulário + toasts; URL da API via window.__CONFIG__
├── tests/
│   ├── cypress/             # E2E (seletores data-cy)
│   ├── performance/k6/      # k6 + TypeScript (esbuild)
│   └── security/semgrep/    # Regras SAST (JS/TS)
├── docker/                  # Dockerfiles (frontend, cypress, robot)
├── k8s/                     # Manifests base (rascunhos)
├── .github/workflows/       # CI (lint, e2e, dast, k6)
├── docker-compose.yml       # Ambiente dev local
└── README.md                # Este arquivo
```

Observação: `tests/robot/` está como opcional/futuro.

<a id="tecnologias"></a>
## 🛠️ Tecnologias

- Frontend: HTML, CSS, JavaScript (vanilla)
- Backend: Python 3.11, FastAPI, Uvicorn, Pydantic v2
- E2E: Cypress 14 (com `data-cy`)
- Performance: k6 (TS → JS com esbuild)
- Segurança: Semgrep (SAST), OWASP ZAP (DAST), pip-audit/npm audit, gitleaks, Trivy
- CI: GitHub Actions

<a id="como-rodar"></a>
## ▶️ Como rodar (rápido)

### Docker (recomendado)
```bash
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Local (Windows PowerShell)
Backend:
```powershell
cd backend
python -m venv .venv
 .\.venv\Scripts\Activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Frontend (outro terminal):
```powershell
npm install
npx serve ./frontend --listen 3000
```
Ou usando scripts:
```powershell
npm run backend:setup   # cria venv e instala deps
npm run start           # sobe frontend + backend
```

<a id="endpoints"></a>
## 🔌 Endpoints principais

- GET `/health` → { status: "ok" }
- POST `/api/form` → valida `nome`, `email`, `mensagem` (Pydantic) e ecoa dados

<a id="config-frontend"></a>
## ⚙️ Config do Frontend

- URL da API configurada via `window.__CONFIG__.API_URL` em `frontend/index.html`
- Seletores estáveis para testes: atributos `data-cy` em inputs e botão

### DSL e UI do Frontend

- `frontend/dsl.js` expõe utilitários:
  - `window.$` e `window.$$`
  - `Toast` (sucesso/erro)
  - `FormDSL` (get/set de campos, disable/enable submit)
  - `Validacao` (email/obrigatórios)
  - `Api` (POST `/api/form`)

Exemplo:
```js
FormDSL.setValues({ nome: 'Fulano', email: 'a@b.com', mensagem: 'Oi' });
Toast.sucesso('Pré-preenchido');
```

### Tokens de design

- `frontend/tokens.css` define variáveis CSS (cores, espaços, raios, sombra, fonte)
- `frontend/style.css` consome os tokens

Exemplo:
```css
button { background: var(--color-primary); border-radius: var(--radius-sm) }
.toast.erro { background: var(--color-error) }
```

### Microinterações e A11y

- Labels, mensagens de erro por campo (`aria-live`), foco visível
- Barra de progresso de preenchimento
- Botão com spinner de loading
- Contador de caracteres e rascunho com `localStorage`

### Background animado (Ken Burns)

- Configurável via `window.__CONFIG__.BG_URL` (em `frontend/index.html`)
- Alternativa: definir `BG_URL_OVERRIDE` antes do bloco

Exemplos:
```html
<script>
  window.__CONFIG__ = {
    API_URL: 'http://localhost:8000',
    BG_URL: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format'
  };
<\/script>
```
```html
<script>window.BG_URL_OVERRIDE = 'https://exemplo.com/bg.jpg'<\/script>
```

<a id="testes"></a>
## 🧪 Testes

### Cypress (E2E)
```bash
npm run test:e2e      # UI
npm run test:e2e:ci   # headless
```
Cobertura de cenários: sucesso, campos vazios, e-mail inválido, erro 500 e erro de rede.

#### DSL nos testes (Cypress)

```js
cy.navegador().then(nav => {
  nav.preencher({ nome, email, mensagem }).enviar();
});
cy.enviarFormularioCom({ nome, email, mensagem });
cy.verificarToastSucesso('Formulário enviado com sucesso!');
```

### k6 (performance)
```bash
cd tests/performance/k6
npm install
npm run build
k6 run dist/smoke.test.js  # API_BASE_URL=http://localhost:8000 (default)
```

<a id="seguranca"></a>
## 🔒 Segurança

- SAST: Semgrep (config em `tests/security/semgrep/semgrep.yaml`)
- DAST: OWASP ZAP baseline (CI) contra `http://localhost:3000`
- Dependências: `pip-audit` (Python) e `npm audit` (JS)
- Segredos: `gitleaks`
- Containers: `trivy` (FS)

Scripts úteis (best-effort, principalmente em CI):
```bash
npm run lint:security:deps:py
npm run lint:security:deps:js
npm run lint:secrets
npm run lint:containers
```

<a id="ci"></a>
## 🤖 CI (GitHub Actions)

Pipeline em `.github/workflows/ci.yml` executa:
- Lint/segurança de dependências e segredos
- SAST (Semgrep)
- Sobe frontend/backend como serviços, roda Cypress headless
- ZAP baseline (best-effort)
- k6 smoke contra `/health`

<a id="convencoes"></a>
## 🧭 Convenções

- Use `data-cy` em elementos do DOM testados pelo Cypress
- Não hardcode URLs; use `window.__CONFIG__.API_URL`

<a id="requisitos"></a>
## 📌 Requisitos

- Node.js 20+
- Python 3.11+
- Docker (opcional)

<a id="licenca"></a>
## 📄 Licença

MIT — sinta-se à vontade para usar e contribuir.

---

## Scripts úteis adicionais

- Push automatizado (PowerShell): `scripts/git-push.ps1`
  ```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\git-push.ps1 -Message "sua mensagem" -Branch main
  ```

## Protótipos (preview)

- `Docs/preview/prototipo-contato.html`: microinterações e layout independente para validar UI/UX.

---

## Shift Left na prática (dev + testes integrados)

- Objetivo: rodar back/frontend e executar um smoke E2E automaticamente em dev, validando o fluxo crítico logo no início.
- Script: `npm run dev:shift-left`
- O que faz: sobe backend e frontend em paralelo, espera `http://localhost:3000` ficar pronto e executa `tests/cypress/e2e/smoke.cy.js` headless.

```bash
npm run backend:setup   # primeira vez
npm run dev:shift-left
```

Benefícios esperados:
- Feedback rápido (quebra visível cedo, fácil de reproduzir)
- Repositório simples e limpo, com testes convivendo com o desenvolvimento
- Incentiva adotar DSL/app actions e seletores estáveis (`data-cy`)

---

## Por que DSL neste projeto (e não POM)?

Este repositório adota uma DSL (Domain-Specific Language) de testes e de UI por três razões principais:

- Legibilidade e fluidez: expressa intenções (o que) em vez de detalhes de implementação (como). Isso reduz ruído e torna os testes autoexplicativos.
- Encapsulamento de seletores e ações: seletores vivem na DSL; mudanças na UI tendem a impactar menos specs.
- Composição: comandos simples, compostos e “navigators” encadeáveis permitem montar cenários complexos de forma declarativa.

Quando ainda usar POM (Page Object Model):
- Times com forte hábito de POM; componentes com contratos claros e reutilização entre múltiplos projetos.
- Contextos onde é útil representar páginas/fluxos como objetos estáveis.

Trade-offs da DSL:
- Pode acoplar testes ao vocabulário da aplicação; exige disciplina para não virar “helpers” genéricos demais.
- Abstrações ruins podem esconder detalhes importantes de sincronização/estado se a DSL não for bem projetada.

Como este projeto aplica DSL:
- Frontend: `frontend/dsl.js` fornece `Toast`, `FormDSL`, `Validacao` e `Api`.
- Testes E2E: `tests/cypress/support/dsl.js` provê comandos simples/compostos e um navigator fluente, evitando POM.

Referências úteis
- Martin Fowler — Domain-Specific Languages: [martinfowler.com/bliki/DomainSpecificLanguage.html](https://martinfowler.com/bliki/DomainSpecificLanguage.html)
- Martin Fowler — Page Object: [martinfowler.com/bliki/PageObject.html](https://martinfowler.com/bliki/PageObject.html)
- Cypress — Custom Commands: [docs.cypress.io/api/cypress-api/custom-commands](https://docs.cypress.io/api/cypress-api/custom-commands)
- Cypress — Best Practices: [docs.cypress.io/guides/references/best-practices](https://docs.cypress.io/guides/references/best-practices)
- Cucumber/Gherkin (DSL de especificação): [cucumber.io/docs/gherkin](https://cucumber.io/docs/gherkin/)
- Capybara (DSL para Aceitação Web, Ruby): [github.com/teamcapybara/capybara](https://github.com/teamcapybara/capybara)
- Selenide (Java, fluent API próximo a DSL): [selenide.org](https://selenide.org/)

Ecossistemas que usam ou inspiram DSLs
- BDD com Cucumber/Gherkin é amplamente utilizado em diversas organizações.
- Times com Ruby on Rails frequentemente usam Capybara como DSL de aceitação.
- Em Java, Selenide/Selenium com padrões fluentes aproximam-se de DSLs de interação.
- Em Cypress/Playwright, é comum criar comandos utilitários ou “app actions” que funcionam como mini-DSLs.

Motivação e autoria
- Este projeto foi estruturado para demonstrar evolução e autonomia técnica de QA: desenhar UI/UX mínima, criar backend simples, e principalmente construir uma base de testes sólida com DSL própria, inspirada em POM e boas práticas de automação.
- Mantido por: [LinkedIn](https://www.linkedin.com/in/nof-5442209a/)
- Aberto a feedbacks e colaborações via Issues/PRs.

---

## Objetivo de carreira (QA/Engenheiro de Testes)

Este repositório é meu laboratório público para demonstrar habilidades como QA/Engenheiro de Testes, indo além do “consumo de frameworks”: 
- Construo e explico minha própria DSL de testes (inspirada em POM, mas com foco em fluidez e clareza).
- Desenho e itero no frontend (UI/UX mínima, acessível, tokens de design) e no backend (FastAPI simples) para habilitar testes end-to-end reais.
- Integro qualidade de forma transversal: E2E, performance (k6), segurança (SAST/DAST), CI.
- Mantenho tudo em evolução contínua e organizada para leitura por recrutadores e pares técnicos.

Se quiser trocar ideias, sugerir melhorias ou entender decisões técnicas, entre em contato: [LinkedIn](https://www.linkedin.com/in/nof-5442209a/).

---

## Como contribuir / feedback

Contribuições são bem-vindas. Sugestões de melhorias de DSL, novos cenários de teste, refatorações e documentação ajudam a elevar a qualidade.

1) Abra uma Issue descrevendo:
- Qual é o problema/necessidade
- O que você propõe (ex.: novo comando DSL, melhoria de acessibilidade, cenário de teste)
- Critérios de aceite

2) Faça um PR contendo:
- Descrição objetiva do que mudou e o “porquê”
- Evidências (ex.: saída do Cypress, prints)
- Checklist de execução local

3) Convenções sugeridas:
- Mensagens de commit: convencional (ex.: `feat:`, `fix:`, `test:`, `chore:`)
- Branches: `feat/…`, `fix/…`, `docs/…`, `test/…`
- Estilo: seguir padrões do repositório e manter nomes claros

4) Como testar localmente (resumo):
```powershell
npm install
# backend
cd backend; python -m venv .venv; .\.venv\Scripts\Activate; pip install -r requirements.txt; uvicorn main:app --reload --port 8000
# frontend (outro terminal)
npx serve ./frontend --listen 3000
# e2e
npm run test:e2e:ci
```

Se preferir Docker: `docker compose up --build`.
