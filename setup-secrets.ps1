# Mira — secrets setup script.
# Run this once after you have your Gemini key + Neon DATABASE_URL.
# Prompts for each, then handles every remaining step automatically.
#
# Usage in PowerShell:
#   cd C:\Users\najaf\mira
#   .\setup-secrets.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Write-Step($n, $title) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "  $n  $title" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
}

function Add-EnvToVercel($name, $value) {
    if ([string]::IsNullOrWhiteSpace($value)) { return }
    foreach ($target in @("production", "preview")) {
        # Remove existing (silently ignore failure if it doesn't exist)
        vercel env rm $name $target --yes 2>$null | Out-Null
        # Add new
        $value | vercel env add $name $target | Out-Null
        Write-Host "    + $name → $target" -ForegroundColor Green
    }
}

function Update-EnvLocal($pairs) {
    $path = Join-Path $PSScriptRoot ".env.local"
    if (-not (Test-Path $path)) {
        Copy-Item (Join-Path $PSScriptRoot ".env.example") $path
    }
    $content = Get-Content $path -Raw
    foreach ($pair in $pairs.GetEnumerator()) {
        if ([string]::IsNullOrWhiteSpace($pair.Value)) { continue }
        $line = "$($pair.Key)=$($pair.Value)"
        if ($content -match "(?m)^\s*$([regex]::Escape($pair.Key))=") {
            $content = [regex]::Replace($content, "(?m)^\s*$([regex]::Escape($pair.Key))=.*$", $line)
        } else {
            $content = $content.TrimEnd() + "`n$line`n"
        }
    }
    Set-Content -Path $path -Value $content -NoNewline
    Write-Host "    .env.local updated" -ForegroundColor Green
}

# ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  Mira  ·  secrets setup" -ForegroundColor Yellow
Write-Host "  ====================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  This script will:" -ForegroundColor Gray
Write-Host "    1. Ask for your Google AI key" -ForegroundColor Gray
Write-Host "    2. Ask for your Neon DATABASE_URL" -ForegroundColor Gray
Write-Host "    3. Write them to .env.local" -ForegroundColor Gray
Write-Host "    4. Push them to Vercel" -ForegroundColor Gray
Write-Host "    5. Push DB schema to Neon" -ForegroundColor Gray
Write-Host "    6. Redeploy to production" -ForegroundColor Gray
Write-Host ""
Write-Host "  Press Enter to skip any value (you can run the script again later)." -ForegroundColor DarkGray

# ─────────────────────────────────────────────────────────────
Write-Step "[1/6]" "Google AI API key"
Write-Host ""
Write-Host "  Get one for free at: " -NoNewline -ForegroundColor Gray
Write-Host "https://aistudio.google.com/apikey" -ForegroundColor Cyan
Write-Host "  Sign in with Google → Create API key. Looks like: AIza..." -ForegroundColor DarkGray
Write-Host ""
$gemini = Read-Host "  Paste GOOGLE_AI_API_KEY (or Enter to skip)"
$gemini = $gemini.Trim()

# ─────────────────────────────────────────────────────────────
Write-Step "[2/6]" "Neon Postgres URL"
Write-Host ""
Write-Host "  Get one for free at: " -NoNewline -ForegroundColor Gray
Write-Host "https://console.neon.tech" -ForegroundColor Cyan
Write-Host "  Create project 'mira' → choose Mumbai/N.Virginia region." -ForegroundColor DarkGray
Write-Host "  IMPORTANT: copy the POOLED connection string." -ForegroundColor DarkGray
Write-Host "  Looks like: postgresql://...-pooler.../neondb?sslmode=require" -ForegroundColor DarkGray
Write-Host ""
$neon = Read-Host "  Paste DATABASE_URL (or Enter to skip)"
$neon = $neon.Trim()

if ([string]::IsNullOrWhiteSpace($gemini) -and [string]::IsNullOrWhiteSpace($neon)) {
    Write-Host ""
    Write-Host "  Nothing entered. Run this script again when you have keys." -ForegroundColor Yellow
    exit 0
}

# ─────────────────────────────────────────────────────────────
Write-Step "[3/6]" "Updating .env.local"
Update-EnvLocal @{
    "GOOGLE_AI_API_KEY"   = $gemini
    "DATABASE_URL"        = $neon
    "NEXT_PUBLIC_SITE_URL" = "https://mira-rose.vercel.app"
}

# ─────────────────────────────────────────────────────────────
Write-Step "[4/6]" "Pushing to Vercel"
if ($gemini) { Add-EnvToVercel "GOOGLE_AI_API_KEY" $gemini }
if ($neon)   { Add-EnvToVercel "DATABASE_URL" $neon }

# ─────────────────────────────────────────────────────────────
if ($neon) {
    Write-Step "[5/6]" "Pushing DB schema to Neon"
    npm run db:push
} else {
    Write-Step "[5/6]" "Skipping DB push (no DATABASE_URL)"
}

# ─────────────────────────────────────────────────────────────
Write-Step "[6/6]" "Redeploying to production"
vercel deploy --prod --yes

# ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "  Done." -ForegroundColor Green
Write-Host "  Live: https://mira-rose.vercel.app" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
