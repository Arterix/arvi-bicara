$ErrorActionPreference = 'Stop'

$modelsDir = Join-Path $PSScriptRoot '..\backend\models'
New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null

$files = @(
  @{
    Name = 'kokoro-v1.0.int8.onnx'
    Url = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.int8.onnx'
  },
  @{
    Name = 'voices-v1.0.bin'
    Url = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin'
  }
)

foreach ($file in $files) {
  $destination = Join-Path $modelsDir $file.Name
  if (Test-Path -LiteralPath $destination) {
    Write-Host "Already exists: $($file.Name)"
    continue
  }

  Write-Host "Downloading $($file.Name)..."
  Invoke-WebRequest -Uri $file.Url -OutFile $destination
}

Write-Host 'Kokoro model files are ready.'
Write-Host 'The faster-whisper tiny.en model downloads automatically on first transcription.'
