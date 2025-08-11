Param(
    [string]$Message = "chore: atualiza projeto",
    [string]$Branch = "main"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[git-push] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[git-push] $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "[git-push] $msg" -ForegroundColor Red }

try {
    # Ir para a raiz do repo (diretório pai do script)
    $repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
    Set-Location $repoRoot

    # Verifica git instalado
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Err "git não encontrado no PATH. Instale o Git."
        exit 1
    }

    # Inicializa repositório se necessário
    if (-not (Test-Path .git)) {
        Write-Info "Inicializando repositório git"
        git init | Out-Null
    }

    # Garante branch principal
    $currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
    if ($currentBranch -ne $Branch) {
        Write-Info "Definindo branch '$Branch' (atual: '$currentBranch')"
        git branch -M $Branch
    }

    # Adiciona mudanças
    Write-Info "Adicionando mudanças"
    git add -A

    # Verifica se há mudanças para commit
    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-Warn "Sem mudanças para commitar"
    } else {
        Write-Info "Commitando: $Message"
        git commit -m $Message | Out-Null
    }

    # Remote origin (mantém se já existir)
    $originUrl = $null
    try { $originUrl = (git remote get-url origin).Trim() } catch { }
    if (-not $originUrl) {
        Write-Warn "Remote 'origin' não configurado. Configure com: git remote add origin <URL>"
    }

    # Push com upstream
    Write-Info "Fazendo push para '$Branch'"
    git push -u origin $Branch

    Write-Info "Concluído"
} catch {
    Write-Err $_
    exit 1
}


