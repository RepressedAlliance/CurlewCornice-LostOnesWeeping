param(
    [Parameter(Mandatory)][string]$PromptFile,
    [Parameter(Mandatory)][string]$OutFile
)
# A review run as its own process (headless Claude Code), so it survives anything that happens to the conversation that
# started it. In-conversation background agents are cancelled together with the turn when the owner sends a message
# mid-turn ("[Request interrupted by user]"), silently; that is what lost the reviews in Kokoro and in Lost One.
# The reviewer may only read files; its report goes to $OutFile when it finishes, its log next to it.
$ErrorActionPreference = 'Continue'
$log = "$OutFile.log"
$tmp = "$OutFile.part"
Get-Content -Raw -LiteralPath $PromptFile -Encoding UTF8 | claude -p --allowedTools "Read,Glob,Grep" --output-format text > $tmp 2> $log
if ($LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $tmp) -and (Get-Item -LiteralPath $tmp).Length -gt 200) {
    Move-Item -LiteralPath $tmp -Destination $OutFile -Force
    Write-Output "REVIEW OK $OutFile"
} else {
    Write-Output "REVIEW FAILED (exit $LASTEXITCODE), see $log"
    exit 1
}
