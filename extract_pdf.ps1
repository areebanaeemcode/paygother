$htmlPath = 'C:\Users\muham\Downloads\FYP (1)\Pay_Together_FYP_Documentation.html'
$outPath  = 'C:\Users\muham\Downloads\Pay_Together_FYP_Documentation.pdf'

Write-Host "Reading HTML file..."
$html = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)

Write-Host "Searching for PDF_B64 variable..."
$startTag = 'var PDF_B64="'
$startIdx = $html.IndexOf($startTag)

if ($startIdx -lt 0) {
    Write-Host "ERROR: Could not find PDF_B64 in the HTML file."
    exit 1
}

$startIdx += $startTag.Length
$endIdx = $html.IndexOf('"', $startIdx)

if ($endIdx -lt 0) {
    Write-Host "ERROR: Could not find end of PDF_B64 string."
    exit 1
}

$b64 = $html.Substring($startIdx, $endIdx - $startIdx)
Write-Host ("Found base64 data, length: " + $b64.Length + " chars")

Write-Host "Decoding and saving PDF..."
$bytes = [System.Convert]::FromBase64String($b64)
[System.IO.File]::WriteAllBytes($outPath, $bytes)

Write-Host ("SUCCESS! PDF saved to: " + $outPath)
Write-Host ("File size: " + $bytes.Length + " bytes (" + [math]::Round($bytes.Length/1MB, 2) + " MB)")
