@echo off
set FLASK_APP=%~dp0app.py
flask run
pause