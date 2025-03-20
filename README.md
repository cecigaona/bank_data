Proyecto de base de datos avanzada donde se hace un dashboard del analisis de los historiales crediticios

### To run the **database**
- Compose and run container inside ```db```: ```docker-compose up -d```

### To run the **backend** with docker <br>
- Build the image by running inside ```backend```: ```docker build -t backend_bda .```
- Run container: ```docker run -d -p 8000:8000 --name backend_bda_container backend_bda```

### To run the **frontend**
- You need node.js and Angular
- Execute in the app directory ```npm insall``` the first time its used
- Then everytime you want to start the server, run ```ng server```