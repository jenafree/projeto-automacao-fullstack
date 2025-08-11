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
  - [🧪 Testes](#-testes)
    - [Cypress (E2E)](#cypress-e2e)
    - [k6 (performance)](#k6-performance)
  - [🔒 Segurança](#-segurança)
  - [🤖 CI (GitHub Actions)](#-ci-github-actions)
  - [🧭 Convenções](#-convenções)
  - [📌 Requisitos](#-requisitos)
  - [📄 Licença](#-licença)

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

<a id="testes"></a>
## 🧪 Testes

### Cypress (E2E)
```bash
npm run test:e2e      # UI
npm run test:e2e:ci   # headless
```
Cobertura de cenários: sucesso, campos vazios, e-mail inválido, erro 500 e erro de rede.

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
