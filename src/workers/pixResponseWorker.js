const {
  processPixResponseUseCase,
} = require("../use-cases/processPixResponseUseCase");

async function pixResponseWorker({
  queueConsumer,
  transactionRepository,
  eventPublisher,
}) {
  await queueConsumer.subscribe(
    "pix.webhook.response",
    async (message, ack, nack) => {
      try {
        await processPixResponseUseCase(message, {
          transactionRepository,
          eventPublisher,
        });
        ack();
      } catch (err) {
        console.error("[pixResponseWorker] failed to process message", err);
        nack();
      }
    },
  );
}

module.exports = { pixResponseWorker };
