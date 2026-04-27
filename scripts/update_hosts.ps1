$hostsPath = "C:\Windows\System32\drivers\etc\hosts"

Add-Content -Path $hostsPath -Value "127.0.0.1 fashion.localhost"

Write-Host "Successfully added fashion.localhost to hosts file."
Start-Sleep -Seconds 3
