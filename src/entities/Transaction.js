const STATUS = {
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

const TRANSITIONS = {
  pending: STATUS.PROCESSING,
  approved: STATUS.COMPLETED,
  rejected: STATUS.FAILED,
};

class Transaction {
  constructor({ id, userID, bankInfo, amount, status, contractID }) {
    this.id = id;
    this.userID = userID;
    this.bankInfo = bankInfo;
    this.amount = amount;
    this.status = status;
    this.contractID = contractID;
  }

  applyPixResponse(pixStatus) {
    const next = TRANSITIONS[pixStatus];
    if (!next) throw new Error(`Unknown pix status: ${pixStatus}`);
    if (this.status === STATUS.COMPLETED || this.status === STATUS.FAILED)
      throw new Error(`Cannot transition from ${this.status}`);
    this.status = next;
  }
}

module.exports = { Transaction, STATUS };
