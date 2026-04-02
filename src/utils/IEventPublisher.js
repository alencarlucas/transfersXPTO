class IEventPublisher {
  async publish(event, payload) {
    throw new Error("Not implemented");
  }
}

module.exports = { IEventPublisher };
