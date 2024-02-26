## 🌟 Introduction

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Clone the repository: `git clone https://github.com/YoussufRadi/jat-task.git`
- Navigate: `cd jat-task`
- Install dependencies: `npm ci`

### Step 2: ⚙️ Environment Configuration

- You need to have `node`, `typescript`, `Docker` and `jq` installed to run this project

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: `npm run start` or `npm run docker:start`


### Step 4: Simulation

- The project runs with two players on ports 8080 and 8081
- You can use the swagger UI to test api manually through http://localhost:8080/ and http://localhost:8081/
- you can also run the script `./scripts/simulate.sh` to run a bash simulation that will play a game between both players

## 📁 Project Structure
```
.
├── api-docs
│   ├── openAPIDocumentGenerator.ts
│   ├── openAPIResponseBuilders.ts
│   └── openAPIRouter.ts
├── common
│   ├── middleware
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── requestLogger.ts
│   ├── models
│   │   └── serviceResponse.ts
│   └── utils
│       ├── commonValidation.ts
│       ├── envConfig.ts
│       └── httpHandlers.ts
├── index.ts
├── modules
│   ├── healthCheck
│   │   └── healthCheckRouter.ts
│   └── game
│       ├── gameModel.ts
│       ├── gameMiddleware.ts
│       ├── gameRepository.ts
│       ├── gameRouter.ts
│       └── gameService.ts
└── server.ts

```

### Notes and thoughts

During the project, I relied on informed assumptions to guide my decisions. Utilizing an Express template, I initiated the project to expedite the implementation of service responses and handlers, integrating my project concept with an existing boilerplate.

To commence a game, both players must register the gameUuid via the /start API endpoint, enabling subsequent game play. This approach accommodates the possibility of multiple players engaging concurrently, ensuring fair play without risk of cheating.

For efficient management of game instances, I employed an in-memory object, deeming a database setup excessive for this scale of project. Basic validations and tests were implemented to maintain integrity.

To observe functionality, execute the ./simulate.sh script and utilize the Swagger UI to designate one player as busy, observing the script's behavior as it continuously calls the designated player until a response is received.