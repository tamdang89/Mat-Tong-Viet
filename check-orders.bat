@echo off
setlocal enabledelayedexpansion

set "URL=https://lnhrzszaxwihjccskjkx.supabase.co/rest/v1/orders?limit=1"
set "KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuaHJ6c3pheHdpaGpjY3Nramt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1OTk3MTIsImV4cCI6MjEwMjE3NTcxMn0.Sib4r4E7k8eeTSQPdL-Do8B2ayn68t5_jV1wtiFTxCs"

echo Testing Orders Table...
echo.

curl -s -X GET "!URL!" ^
  -H "apikey: !KEY!" ^
  -H "Authorization: Bearer !KEY!" ^
  -H "Content-Type: application/json" | find /v ""

echo.
echo.
echo If orders table is empty, it will show []. If it exists, you'll see an empty array or data.
echo If you see an error message, the table structure might need adjustment.
