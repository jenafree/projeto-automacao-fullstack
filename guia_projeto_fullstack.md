
# 🧪 Projeto de Automação Fullstack - Guia de Execução

Este guia explica como colocar o projeto completo em funcionamento localmente: **Backend (FastAPI), Frontend (HTML/JS/CSS) e Cypress (E2E)**.

---

## 📁 Estrutura do Projeto

```
projeto-automacao-fullstack
├── backend/         # FastAPI
├── frontend/        # HTML/CSS/JS puro
├── tests/cypress/   # Testes E2E com Cypress
```

---

## 🔧 Requisitos

- Python 3.11+
- Node.js 16+
- npm
- VSCode (opcional, mas recomendado)
- Google Chrome (para execução Cypress)

---

## ✅ 1. Rodando o BACKEND (FastAPI)

### Diretório: `backend`

```bash
# Acesse o diretório raiz do projeto
cd D:\Projetos\projeto-automacao-fullstack

# Acesse o backend
cd backend

# Ative o ambiente virtual
.\.venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor FastAPI
uvicorn main:app --reload
```

📍 Acesse: [http://localhost:8000](http://localhost:8000)  
📍 Documentação Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ✅ 2. Rodando o FRONTEND

### Diretório: `frontend`

```bash
# Volte para a raiz do projeto
cd D:\Projetos\projeto-automacao-fullstack

# Rode o frontend
npx serve frontend
```

> O terminal mostrará o endereço (ex: `http://localhost:3000` ou similar).

---

## ✅ 3. Rodando os TESTES CYPRESS

### Diretório: `tests/cypress`

```bash
# Acesse o diretório de testes
cd D:\Projetos\projeto-automacao-fullstack\tests\cypress

# Instale as dependências
npm install

# Abra a interface gráfica do Cypress
npx cypress open
```

---

## 🧪 Testes Esperados

| Cenário                         | Resultado esperado                        |
|--------------------------------|--------------------------------------------|
| Submissão com campos vazios    | Toast de erro "Por favor, preencha todos os campos" |
| E-mail inválido                | Toast de erro "Por favor, insira um e-mail válido." |
| Envio de formulário válido     | Toast de sucesso "✅ Formulário enviado com sucesso!" |

---

## 💬 Comunicação entre Front e Back

- O frontend usa `fetch()` para enviar os dados para a rota:
  ```
  POST http://localhost:8000/api/form
  ```
- O backend (FastAPI) recebe, processa e responde.
- O frontend exibe um **toast** com base na resposta.

---

## ✅ Pronto! Agora é só testar, codar e evoluir 🚀
