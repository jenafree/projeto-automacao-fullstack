@echo off
echo Ativando ambiente virtual...
python -m venv .venv
call .venv\Scripts\activate

echo Instalando dependências...
pip install fastapi uvicorn

echo Iniciando servidor FastAPI...
uvicorn main:app --reload --port 8000
