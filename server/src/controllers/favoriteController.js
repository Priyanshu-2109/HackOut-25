import Favorite from "../models/favoriteModel.js";

export const addFavorite = async (req, res) => {
  try {
    const { assetType, assetId } = req.body;
    const exists = await Favorite.findOne({
      user: req.user._id,
      assetType,
      assetId,
    });
    if (exists) return res.status(400).json({ error: "Already favorited" });
    const favorite = await Favorite.create({
      user: req.user._id,
      assetType,
      assetId,
    });
    res.status(201).json(favorite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { assetType, assetId } = req.body;
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      assetType,
      assetId,
    });
    if (!favorite) return res.status(404).json({ error: "Favorite not found" });
    res.json({ message: "Favorite removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
