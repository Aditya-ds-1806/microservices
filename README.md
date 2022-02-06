# Microservices Project

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
git clone https://github.com/Aditya-ds-1806/microservices.git
cd microservices
npm i
npm start
```

### via Docker

```bash
git clone https://github.com/Aditya-ds-1806/microservices.git
cd microservices
docker-compose build
docker-compose up
```

## HLD

- `DBConnection` class - handle DB connection
- `UserSchema`, `ContentSchema`, `UserInteractionSchema` - define schemas for DB
- `UserInteractionService`, `ContentService` and `UserService` - 3 workers to handle service registration
- `ContentRoutes`, `UserRoutes`, `UserInteractionRoutes` - define endpoints for microservices
- `ContentControllers`, `UserControllers`, `UserInteractionControllers` - handle business logic and return responses; if error forward to error handler
- `ContentMiddleware`, `UserMiddleware`, `UserInteractionMiddleware` to manipulate and validate requests; don't return responses, forward errors to error handler
- `APiError` - Error handler; extends native Error; Single point of entry for sending 4xx and 5xx errors

## LLD

### Content Service

- Middlewares
  - check if userId is valid and user exists by contacting user service
  - check if contentId is valid and content exists
  - error handler

- Controllers
  - a controller each for CRUD on contents
  - sort contents by top and new
  - contact user interaction service's internal API that is secured via TOTP, to fetch likes and reads, and sort contents by `top` defined as `(reads + likes)`
  - `TOTP_KEY` used for generating `TOTP`s is agreed upon before hand by the 2 services and `TOTP` sent in headers
  - controller for inserting documents to DB from csv file
  - internal method to sort by new, result is reused for sorting by `top`

### User Service

- Middlewares
  - check if userId is valid and user exists
  - check if contentId is valid and content exists by contacting content service
  - error handler

- Controllers
  - a controller each for CRUD on User

### User Interaction Service

- Middlewares
  - check if userId is valid and user exists by contacting user service
  - check if contentId is valid and content exists by contacting content service
  - validate recieved `TOTP` for `content/stats` endpoint, send `401` if the `TOTP`s don't match
  - error handler

- Controllers
  - read and update likes count
  - read and update reads count
  - internal API for returning likes and reads count on content to assist in sorting by `top`

## Developer Empathy

- Used conventional commits, husky and commitlint to write meaningful and organized commit messages
- Used eslint to enforce code style and check for errors
