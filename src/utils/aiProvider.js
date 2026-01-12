class DummyAiProvider {
  async suggestFromImage(imageBuffer) {
    const text = "Proposed: Generic item";
    return {
      provider: "dummy",
      label: "Generic item",
      confidence: 0.5,
      raw: { text },
    };
  }
}

module.exports = DummyAiProvider;
