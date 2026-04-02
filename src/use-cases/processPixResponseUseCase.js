const { Transaction } = require("../entities/Transaction");

const PIX_STATUS = { SUCCESS: "SUCCESS", ERROR: "ERROR" };
const TX_STATUS = { COMPLETED: "COMPLETED", FAILED: "FAILED" };

async function processPixResponseUseCase(
  payload,
  { transactionRepository, eventPublisher },
) {
  const { externalId, pixStatus } = payload;

  const data = await transactionRepository.findByExternalId(externalId);
  if (!data) throw new Error(`Transaction not found: ${externalId}`);

  const transaction = new Transaction(data);

  if (pixStatus === PIX_STATUS.SUCCESS) {
    transaction.status = TX_STATUS.COMPLETED;
  } else if (pixStatus === PIX_STATUS.ERROR) {
    transaction.status = TX_STATUS.FAILED;
  } else {
    await eventPublisher.publish("pix.unexpected.status", {
      externalId,
      pixStatus,
    });
    return;
  }

  await transactionRepository.updateStatus(transaction.id, transaction.status);

  // downstream notification (contracts, events, etc.) will be handled in a separate use case
}

module.exports = { processPixResponseUseCase, PIX_STATUS, TX_STATUS };
