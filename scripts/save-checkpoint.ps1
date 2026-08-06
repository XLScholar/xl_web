# Save current xl_web work as a git commit
# Usage: right-click → Run with PowerShell, or: .\scripts\save-checkpoint.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host "Working directory: $(Get-Location)" -ForegroundColor Cyan

if (-not (Test-Path .git)) {
  Write-Host "Initializing git repository..." -ForegroundColor Yellow
  git init
}

git add `
  app `
  components `
  data `
  lib `
  scripts `
  source `
  public `
  package.json `
  package-lock.json `
  README.md `
  CONSOLIDATION.md `
  SESSION_CHECKPOINT.md `
  .gitignore `
  next.config.mjs `
  postcss.config.mjs `
  tailwind.config.ts `
  tsconfig.json `
  .eslintrc.json `
  vercel.json 2>$null

# Avoid committing secrets if any
git reset HEAD -- .env .env.local .env*.local 2>$null

$status = git status --short
if (-not $status) {
  Write-Host "Nothing new to commit — working tree clean." -ForegroundColor Green
  git status
  exit 0
}

git commit -m @"
Save xl_web academic homepage checkpoint.

CV-synced content, timeline, chip/photo galleries, and manual-edit workspace.
"@

Write-Host "`nCheckpoint saved." -ForegroundColor Green
git log -1 --oneline
git status
