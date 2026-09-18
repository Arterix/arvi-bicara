$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

if (-not (Test-Path -LiteralPath (Join-Path $backend 'venv\Scripts\python.exe'))) {
  Write-Host 'Creating Python virtual environment...'
  python -m venv (Join-Path $backend 'venv')
}

Write-Host 'Installing backend dependencies...'
& (Join-Path $backend 'venv\Scripts\python.exe') -m pip install -r (Join-Path $backend 'requirements.txt')

if (-not (Test-Path -LiteralPath (Join-Path $backend '.env'))) {
  Copy-Item (Join-Path $backend '.env.example') (Join-Path $backend '.env')
  Write-Host 'Created backend/.env from backend/.env.example.'
}

if (-not (Test-Path -LiteralPath (Join-Path $frontend '.env.local'))) {
  Copy-Item (Join-Path $frontend '.env.example') (Join-Path $frontend '.env.local')
  Write-Host 'Created frontend/.env.local from frontend/.env.example.'
}

Write-Host 'Downloading local Kokoro model files...'
& (Join-Path $root 'scripts\download-models.ps1')

Write-Host 'Installing frontend dependencies...'
Push-Location $frontend
npm install
Pop-Location

Write-Host 'Setup complete. Run .\run.bat to start ARVI.'
