param(
  [Parameter(Mandatory = $true)][string]$PdfPath,
  [Parameter(Mandatory = $true)][string]$OutputDirectory,
  [ValidateRange(72, 300)][int]$Dpi = 190
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() |
  Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethodDefinition -and $_.GetParameters().Count -eq 1 } |
  Select-Object -First 1
$asActionTask = [System.WindowsRuntimeSystemExtensions].GetMethods() |
  Where-Object { $_.Name -eq 'AsTask' -and -not $_.IsGenericMethodDefinition -and $_.GetParameters().Count -eq 1 } |
  Select-Object -First 1

function Get-WinRtResult($operation, [type]$resultType) {
  $task = $asTask.MakeGenericMethod($resultType).Invoke($null, @($operation))
  $task.GetAwaiter().GetResult()
}

$storageType = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$pdfType = [Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime]
$renderOptionsType = [Windows.Data.Pdf.PdfPageRenderOptions, Windows.Data.Pdf, ContentType = WindowsRuntime]
$streamType = [Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime]
$file = Get-WinRtResult ($storageType::GetFileFromPathAsync((Resolve-Path -LiteralPath $PdfPath).Path)) $storageType
$pdf = Get-WinRtResult ($pdfType::LoadFromFileAsync($file)) $pdfType
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

for ($index = 0; $index -lt $pdf.PageCount; $index++) {
  $page = $pdf.GetPage($index)
  $stream = [Activator]::CreateInstance($streamType)
  $options = [Activator]::CreateInstance($renderOptionsType)
  $options.DestinationWidth = [uint32][math]::Round($page.Size.Width * $Dpi / 96)
  $options.DestinationHeight = [uint32][math]::Round($page.Size.Height * $Dpi / 96)
  try {
    $render = $asActionTask.Invoke($null, @($page.RenderToStreamAsync($stream, $options)))
    $null = $render.GetAwaiter().GetResult()
    $inputStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream.GetInputStreamAt(0))
    try {
      $target = Join-Path $OutputDirectory ('page-{0:d2}.png' -f ($index + 1))
      $output = [System.IO.File]::Create($target)
      try { $inputStream.CopyTo($output) } finally { $output.Dispose() }
      Write-Output $target
    } finally { $inputStream.Dispose() }
  } finally {
    $stream.Dispose()
    $page.Dispose()
  }
}
