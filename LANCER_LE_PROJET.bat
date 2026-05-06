@echo off
chcp 65001 >nul
echo ========================================
echo   🍷 LANCEMENT INVENTAIRE BOISSONS
echo ========================================
echo.
echo Ce script va demarrer les 2 serveurs :
echo - Backend (API) sur http://localhost:3001
echo - Frontend sur http://localhost:5173
echo.
echo Appuyez sur une touche pour demarrer...
pause >nul

start "BACKEND - API" cmd /k "cd /d c:\Users\moniq\OneDrive\Bureau\Inventaire\InventairePro\backend && echo Demarrage du serveur backend... && node server.js"
timeout /t 2 >nul

start "FRONTEND - React" cmd /k "cd /d c:\Users\moniq\OneDrive\Bureau\Inventaire\InventairePro\frontend && echo Demarrage du serveur frontend... && npm run dev"

echo.
echo ========================================
echo   ✅ Serveurs demarres !
echo ========================================
echo.
echo Ouvrez votre navigateur :
echo http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer...
pause >nul
