param(
    [Parameter(Mandatory)][string]$JobsFile,
    [int]$Throttle = 4
)
# Run a JSON list of {prompt, out, ref[]} jobs through gen.ps1 in parallel.
$ErrorActionPreference = 'Stop'
$gen = Join-Path $PSScriptRoot 'gen.ps1'
$jobs = Get-Content -Raw -LiteralPath $JobsFile -Encoding UTF8 | ConvertFrom-Json
$jobs | ForEach-Object -Parallel {
    $j = $_
    $refs = @()
    if ($j.ref) { $refs = [string[]]$j.ref }
    & $using:gen -PromptFile $j.prompt -OutPath $j.out -Ref $refs
} -ThrottleLimit $Throttle
# check every job's output: a batch that ends with missing images says so and fails (it used to end silently)
$missing = @($jobs | Where-Object { -not (Test-Path -LiteralPath $_.out) -or (Get-Item -LiteralPath $_.out).Length -eq 0 })
foreach ($m in $missing) { Write-Output "FAIL missing $($m.out)" }
if ($missing.Count -gt 0) { Write-Output "BATCH INCOMPLETE: $($missing.Count) of $($jobs.Count) missing"; exit 1 }
Write-Output "BATCH OK: $($jobs.Count) images" 
