# Pratilipi Coding Assignment Backend Intern Role

## Environment variables

`.env` file must be created in the root folder

### Running via NPM

```bash
PORT_1=3000 # PORT to run content service on
PORT_2=3001 # PORT to run user interaction service on
PORT_3=3002 # PORT to run user service on
DB_1=mongodb://127.0.0.1:27017/ContentService
DB_2=mongodb://127.0.0.1:27017/userInteractionService
DB_3=mongodb://127.0.0.1:27017/userService
TOTP_KEY=EFSYLHHHABKPIDKIYWCTLYXROROFVERXDJCM # api key generated using nanoid for accessing user interaction service internal api
HOST=localhost
```

### Running via Docker

Everything remains same as above. Only change is to replace `127.0.0.1` to `mongo` for the DB URIs like this:
```
DB_1=mongodb://mongo:27017/ContentService
DB_2=mongodb://mongo:27017/userInteractionService
DB_3=mongodb://mongo:27017/userService
```

## Installation

### via NPM

```bash
git clone https://github.com/Aditya-ds-1806/pratilipi-assignment.git
cd pratilipi-assignment
npm i
npm start
```

### via Docker

```bash
git clone https://github.com/Aditya-ds-1806/pratilipi-assignment.git
cd pratilipi-assignment
docker-compose build
docker-compose up
```
