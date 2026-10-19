$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$voiceDir = Join-Path $PSScriptRoot 'voice'
New-Item -ItemType Directory -Path $voiceDir -Force | Out-Null
$lines = @(
  @{ Name = 'intro'; Text = 'Meet Rachel.' },
  @{ Name = 'hermes'; Text = 'Fresh and green.' },
  @{ Name = 'jo_malone'; Text = 'Coastal calm.' },
  @{ Name = 'armani'; Text = 'Tea and calm.' },
  @{ Name = 'versace'; Text = 'A brighter mood.' },
  @{ Name = 'outro'; Text = 'Find your signature.' }
)
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $speaker.SelectVoice('Microsoft Zira Desktop')
  $speaker.Rate = 2
  foreach ($line in $lines) {
    $speaker.SetOutputToWaveFile((Join-Path $voiceDir ($line.Name + '.wav')))
    $speaker.Speak($line.Text)
    $speaker.SetOutputToNull()
  }
} finally {
  $speaker.Dispose()
}
