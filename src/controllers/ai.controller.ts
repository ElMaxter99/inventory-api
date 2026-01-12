import { Request, Response } from "express";
import Item from "../models/item.model";
import DummyAiProvider from "../utils/aiProvider";

export async function suggest(req: Request, res: Response) {
  const itemId = (req as any).item?._id || req.params.itemId;
  const item = await Item.findById(itemId);
  if (!item)
    return res
      .status(404)
      .json({ data: null, error: { message: "Item not found" } });
  const provider = new DummyAiProvider();
  // in real: fetch image buffer from storage
  const suggestion = await provider.suggestFromImage(Buffer.from(""));
  item.aiSuggestion = {
    provider: suggestion.provider,
    label: suggestion.label,
    confidence: suggestion.confidence,
    raw: suggestion.raw,
  } as any;
  await item.save();
  res.json({ data: item.aiSuggestion, error: null });
}
