const Item = require("../models/item.model");
const DummyAiProvider = require("../utils/aiProvider");

async function suggest(req, res) {
  const itemId = req.item?._id || req.params.itemId;
  const item = await Item.findById(itemId);
  if (!item)
    return res
      .status(404)
      .json({ data: null, error: { message: "Item not found" } });
  const provider = new DummyAiProvider();
  const suggestion = await provider.suggestFromImage(Buffer.from(""));
  item.aiSuggestion = {
    provider: suggestion.provider,
    label: suggestion.label,
    confidence: suggestion.confidence,
    raw: suggestion.raw,
  };
  await item.save();
  res.json({ data: item.aiSuggestion, error: null });
}

module.exports = { suggest };
