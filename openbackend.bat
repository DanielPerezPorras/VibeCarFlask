@ECHO OFF

cd backend 
call env/scripts/activate
call python main.py runserver -h localhost -p 8080