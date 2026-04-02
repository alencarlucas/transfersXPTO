# transfersXPTO

> **Note:** This is a **mocked implementation**. Concrete adapters (database, queue, event publisher) are not implemented — only the business logic layer is in place, with injected interfaces as placeholders.

Service responsible for processing PIX transfers. It receives transfer requests from clients, communicates with the PIX API, and handles webhook responses to update transaction statuses.

## How it works

1. **Client** sends a transfer request to the transfers API.
2. The API validates uniqueness, reads the QR code via `GET /inspect`, locks the limit, saves the transaction to the database, and enqueues the transfer request.
3. The **PIX API** processes the transfer and fires a **webhook** back.
4. A **listener** receives the webhook and publishes a message to the queue.
5. The **`pixResponseWorker`** consumes the message and calls `processPixResponseUseCase`.
6. The use case updates the transaction status (`COMPLETED` or `FAILED`). Unexpected statuses trigger an internal alert event.
7. Downstream processing (contracts, notifications) is handled by a separate use case.

## Transaction statuses

| PIX status    | Transaction status                      |
| ------------- | --------------------------------------- |
| `SUCCESS`     | `COMPLETED`                             |
| `ERROR`       | `FAILED`                                |
| anything else | publishes `pix.unexpected.status` event |

## Project structure

See [STRUCTURE.md](STRUCTURE.md) for a full breakdown of the folder layout and architectural decisions.

## Key design decisions

- **No concrete adapters in business logic** — database, queue, and event publisher are injected as dependencies. Concrete implementations live in `src/adapters/`.
- **Worker is the composition root** — `pixResponseWorker` wires together the use case and its dependencies at startup.
- **Entity owns domain data** — `Transaction` holds the fields: `id (externalID)`, `userID`, `bankInfo`, `amount`, `status`, `contractID`.
