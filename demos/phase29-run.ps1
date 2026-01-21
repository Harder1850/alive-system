$ErrorActionPreference = "Stop"

Set-Location (Split-Path $PSScriptRoot -Parent)

$env:ALIVE_DATA_DIR = Join-Path $PWD ".alive-data"

# Fresh start for the demo
Remove-Item -Recurse -Force $env:ALIVE_DATA_DIR -ErrorAction SilentlyContinue

Write-Host "[phase29] ALIVE_DATA_DIR=$env:ALIVE_DATA_DIR"

# Run 1: legal sensor
$env:ALIVE_LEGAL_QUERY_JSON = '{"type":"legal.query","jurisdiction":"us","sources":["https://www.supremecourt.gov/opinions/23pdf/22-915_8o6b.pdf"],"requested_documents":["case_opinion"]}'
Remove-Item Env:ALIVE_ENVIRONMENT_URL -ErrorAction SilentlyContinue

Write-Host "[phase29] Run 1 (legal)"
node run-once.js

# Run 2: environment sensor
$env:ALIVE_ENVIRONMENT_URL = "https://api.weather.gov/gridpoints/SEW/131,68/forecast"
Remove-Item Env:ALIVE_LEGAL_QUERY_JSON -ErrorAction SilentlyContinue

Write-Host "[phase29] Run 2 (environment)"
node run-once.js

Write-Host "[phase29] events.jsonl"
Get-Content (Join-Path $env:ALIVE_DATA_DIR "events.jsonl")

