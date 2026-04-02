class ITransactionRepository {
  async findByExternalId(externalId) {
    throw new Error("Not implemented");
  }
  async updateStatus(externalId, status) {
    throw new Error("Not implemented");
  }
}

module.exports = { ITransactionRepository };
