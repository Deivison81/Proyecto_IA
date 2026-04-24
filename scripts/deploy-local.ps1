param(
  [string]$BackendPort = '3001',
  [int]$HealthRetries = 30,
  [int]$RetryDelaySeconds = 2
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $repoRoot 'proyectoIAbkacend'

if (-not (Test-Path $backendDir)) {
  throw "No se encontro el backend en: $backendDir"
}

$healthUrl = "http://localhost:$BackendPort/api/v1/health"
$swaggerUrl = "http://localhost:$BackendPort/api/docs"

Write-Host "[1/4] Levantando backend con Docker en puerto $BackendPort..." -ForegroundColor Cyan
Push-Location $backendDir
$env:BACKEND_PORT = $BackendPort
docker compose down
try {
  docker compose up -d --build
} catch {
  Write-Warning "docker compose up devolvio error transitorio. Reintentando levantar servicios..."
  docker compose up -d
}
docker compose ps
Pop-Location

Write-Host "[2/4] Esperando endpoint de health..." -ForegroundColor Cyan
$healthOk = $false
for ($i = 1; $i -le $HealthRetries; $i++) {
  try {
    $healthResponse = Invoke-WebRequest -UseBasicParsing -Uri $healthUrl -TimeoutSec 5
    if ($healthResponse.StatusCode -eq 200) {
      $healthOk = $true
      break
    }
  } catch {
    Start-Sleep -Seconds $RetryDelaySeconds
  }
}

if (-not $healthOk) {
  throw "Health no disponible en $healthUrl luego de $HealthRetries intentos."
}

Write-Host "[3/4] Validando Swagger..." -ForegroundColor Cyan
$swaggerResponse = Invoke-WebRequest -UseBasicParsing -Uri $swaggerUrl -TimeoutSec 5
if ($swaggerResponse.StatusCode -ne 200) {
  throw "Swagger no respondio correctamente en $swaggerUrl."
}

Write-Host "[4/4] Compilando frontend..." -ForegroundColor Cyan
Push-Location $repoRoot
npm run build
Pop-Location

Write-Host "Despliegue local validado correctamente." -ForegroundColor Green
Write-Host "Health: $healthUrl" -ForegroundColor Green
Write-Host "Swagger: $swaggerUrl" -ForegroundColor Green