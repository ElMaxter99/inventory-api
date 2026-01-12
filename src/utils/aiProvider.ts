export interface AiSuggestion {
  provider: string;
  label: string;
  confidence: number;
  raw?: any;
}

export class DummyAiProvider {
  async suggestFromImage(imageBuffer: Buffer): Promise<AiSuggestion> {
    const text = "Proposed: Generic item";
    return {
      provider: "dummy",
      label: "Generic item",
      confidence: 0.5,
      raw: { text },
    };
  }
}

export default DummyAiProvider;
