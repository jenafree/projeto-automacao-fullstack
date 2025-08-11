import logging
from typing import Any, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field


class FormularioPayload(BaseModel):
    nome: str = Field(min_length=1)
    email: EmailStr
    mensagem: str = Field(min_length=1)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)
logger = logging.getLogger("backend")

app = FastAPI()

# CORS restrito ao frontend local em desenvolvimento; ajuste em produção
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def healthcheck() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/api/form")
async def receber_formulario(payload: FormularioPayload) -> Dict[str, Any]:
    logger.info("Dados recebidos do formulário: %s", payload.model_dump())
    return {
        "status": "ok",
        "mensagem": "Formulário recebido com sucesso!",
        "dados": payload.model_dump(),
    }
