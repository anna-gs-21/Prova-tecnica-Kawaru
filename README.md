# Tecnologies

Per facilitar el desenvolupament, he optat per utilitzar llenguatges i tecnologies que ja havia utilitzat anteriorment:

* Frontend: React
* Framework: MUI
* Backend: Node.js
* Base de dades: MySQL

# Arquitectura i estructura

Abans de començar a picar codi, vaig fer un llistat de tasques a dur a terme amb tots els requisits demanats, tenint en compte el frontend, el backend i la base de dades. 

A l’hora de pensar en l’estructura de l’aplicació i els seus elements, vaig tenir en compte l’escalabilitat: 

* La base de dades està feta de forma en que poden haver-hi múltiples empreses, estats i prioritats.
* L’aplicació és modular: està formada per pàgines i components, on cada pàgina té la seva ruta i pot contenir els components que vulgui. D’aquesta forma, es facilita la creació de noves pàgines o funcionalitats.

Al ser una aplicació petita, tant el frontend, com el backend estan en un mateix repositori. L’ideal seria tenir-ho en projectes diferents perquè l'estructura de carpetes no sigui tan embolicada i per comoditat a l'hora de desenvolupar i desplegar.

# Desenvolupament

L’autenticació està feta amb JWT. He escollit aquest mètode per gestionar les sessions dels usuaris perquè és un dels més utilitzats. I el xifratge de la contrasenya amb bcrypt, els avantatges de bcrypt són les següents:
* Una vegada es fa el hashing, és impossible revertir-lo.
* Encara que hi hagi dues contrasenyes idèntiques, els hash seran totalment diferents.
El filtre d’estat es fa en el frontend perquè només és un i no és gaire complicat. En el cas que hi hagi molts filtres i es compliqui la seva gestió, faria una crida al backend per fer una sentència SQL.
La primera vegada que construeixes el docker del backend, s’executa un script SQL que crea la base de dades, les taules i insereix unes dades bàsiques. S’ha fet d’aquesta forma per unificar tot i que no s’hagi de fer res per poder començar a utilitzar l’aplicació.
Els tres tests automatitzats que he fet tenen a veure amb la seguretat i la separació entre empreses perquè és el punt més crític i sensible de l’aplicació.
L’eina d’intel·ligència artificial que he utilitzat per consultes i suport puntual ha sigut Gemini.
Desplegament

Per poder executar l’aplicació, es necessita tenir Docker Compose instal·lat i crear dos arxius una vegada baixat el repositori:

1 .env amb les credencials de la base de dades.
2 docker-compose.yaml amb les configuracions dels contenidors i credencials.

```
// .env
PORT=5000
DB_HOST=mysql_db
DB_USER=root
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```


```
// docker-compose.yaml
version: '3.8'


services:
  mysql_db:
    image: mysql:8.0
    container_name: mysql_server
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 
      MYSQL_DATABASE: 
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql


  backend_node:
    build: .
    container_name: backend_node_server
    restart: always
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - DB_HOST=mysql_db
      - DB_USER=root
      - DB_PASSWORD=
      - DB_NAME=
      - JWT_SECRET=
    command: node src/services/server.cjs
    depends_on:
      - mysql_db
volumes:
  mysql_data:
```

Quan estigui tot llest, s’han de seguir aquests comandaments per iniciar l’aplicació:
1 Desplegar la base de dades amb docker: docker compose up mysql_db --build.
2 Desplegar el backend amb docker en un altre terminal: docker compose up backend_node --build.
3 Instal·lar les dependències en un altre terminal: npm install.
4 Iniciar el frontend: npm start.
Es fa en tres comandaments per donar temps a que la base de dades es desplegui bé. El procés tarda una mica a fer-se i si desplegues el backend molt ràpid i la base de dades encara no està, falla.

# Hores dedicades i conclusió 

En total he dedicat unes 15 hores en el desenvolupament. He trigat més del que esperava perquè, encara que ja havia treballat anteriorment amb aplicacions similars, mai havia fet una completament des de zero, així que hi ha hagut aspectes que he investigat i après sobre la marxa.
En un futur i amb més temps, m’agradaria acabar de profunditzar el funcionament de jest per fer tests més polits i interessants, ja que aquest és un dels aspectes que he après mentre realitzava la prova. Per exemple, les sol·licituds que es creen per fer els tests, no s’eliminen automàticament.
També m’agradaria separar el frontend i el backend en dos projectes independents i desplegar el frontend amb el seu propi contenidor.
Per l’altra banda, he intentat afegir tots els elements possibles que ajudin a l’experiència de l’usuari. Però segur que s’hi poden posar més per millorar la qualitat de l’aplicació.
