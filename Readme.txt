LATO SERVER

Per avviare lato server vai nella cartella server, fai CMD  e scrivi node server.js si dovrebbe visualizzare la scritta "Server avviato sulla porta 5000"

LATO CLIENT
Per avviare lato client vai nella cartella client, fai CMD  e scrivi npm start e poi bisogna collegarsi su http://localhost:3000/

Login proprietario
per fare login proprietario username: admin password: barbiere123

git init
git add .
git commit -m "Primo upload barbiere app"
git branch -M main
git remote add origin https://github.com/Loredv58/barbiere-app.git
git push -u origin main


git config --global user.name "Lorenzo"
git config --global user.email "dellavolpelorenzo@gmail.com"


frontend è il server
server.js

backend è il client

ogni volta che si modifica qualcosa nella cartella barbiere-app per fare l'aggiornamento su githhub e poi automaticamente su Render fare i seguenti passaggi:

1) apri cmd da barbiere-app

2) esegui questo codice (Aggiorna il repository locale con Git):
git add .
git commit -m "Descrizione modifiche"

3) git push origin main (Invia le modifiche su GitHub)

e poi Render fa il deploy automatico non appena GitHub riceve il push

