# Project Structure — transfersXPTO

This project follows a **Clean Architecture** pattern, separating concerns into distinct layers so that business logic is independent of frameworks, databases, and external services.

## Root

```
transfersXPTO/
├── package.json
├── STRUCTURE.md
└── src/
```

| File           | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| `package.json` | Node.js project manifest — defines project name, version, scripts, and dependencies. |

---

## `src/`

All application source code lives here, organized by architectural layer.

```
src/
├── adapters/
├── entities/
├── handlers/
├── repositories/
├── use-cases/
├── utils/
└── workers/
```

---

### `src/adapters/`

Interface adapters that translate data between the application's internal format and the outside world.

Examples: REST controllers, messaging publishers/consumers, third-party API integrations, database drivers.

---

### `src/entities/`

Core domain objects that represent the fundamental business concepts of the application. Entities encapsulate business rules and invariants and have no dependency on any external framework, database, or service.

Examples: `Transfer`, `Account`, `TransferStatus`.

---

### `src/handlers/`

Entry points for the application. Responsible for receiving incoming requests and delegating to the appropriate use case.

Examples: HTTP route handlers, AWS Lambda function handlers, queue event handlers.

---

### `src/repositories/`

Data access layer. Contains abstractions (interfaces/contracts) and concrete implementations for reading and writing data to external storage.

Examples: database repositories, cache repositories, file storage clients.

---

### `src/use-cases/`

Core application business logic. Each use case represents a single, well-defined operation the system can perform. This layer orchestrates entities and repositories but has no dependency on frameworks or databases.

Examples: `CreateTransfer`, `GetTransferById`, `CancelTransfer`.

---

### `src/utils/`

Shared utility and helper functions used across multiple layers.

Examples: date formatters, validators, error builders, logging helpers.

---

### `src/workers/`

Background workers and asynchronous job processors that run independently of the request/response cycle.

Examples: retry workers, scheduled jobs, event-driven processors.

---

## Architecture Overview

```
Handlers ──► Use Cases ──► Repositories
    │               │
    └──► Adapters ◄─┘       │
              │           Entities
         External Systems
         (DB, APIs, Queues)
```

- **Entities** are the innermost layer — pure domain objects with no external dependencies.
- **Use Cases** orchestrate **Entities** and interact with **Repositories** for data persistence.
- **Handlers** receive input and call **Use Cases**.
- **Adapters** connect the application to external systems.
- **Workers** run asynchronously, often triggered by queues or schedules.
- **Utils** are stateless helpers available to any layer.
