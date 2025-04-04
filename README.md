Proyecto de base de datos avanzada donde se hace un dashboard del analisis de los historiales crediticios

### To run the **db** and the **backend**
- Run the following command on root the FIRST TIME: ```docker-compose up --build```
- Every other time, run: ```docker-compose up```
- Add the ```-d``` flag at the end if you want to run it in the background
- ! To take down: ```docker-compose down```

### To run the **frontend**
- You need node.js and Angular
- Execute in the app directory ```npm insall``` the first time its used
- Then everytime you want to start the server, run ```ng server```