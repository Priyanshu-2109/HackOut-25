import express from "express";
import pool from "../config/postgis.js";

const router = express.Router();

// Whitelist of allowed asset tables
const ALLOWED_TABLES = [
  "plants",
  "storage_facilities",
  "pipelines",
  "hubs",
  "renewable_sources",
  "demand_centers",
  "regulatory_zones",
];

// Get assets within a polygon (GeoJSON)
router.post("/assets-in-polygon", async (req, res) => {
  try {
    const { polygon, assetType } = req.body;
    if (!polygon || !assetType)
      return res.status(400).json({ error: "polygon and assetType required" });
    if (!ALLOWED_TABLES.includes(assetType))
      return res.status(400).json({ error: "Invalid assetType" });
    const query = `SELECT * FROM ${assetType} WHERE ST_Within(geom, ST_GeomFromGeoJSON($1))`;
    const { rows } = await pool.query(query, [JSON.stringify(polygon)]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get N nearest assets to a point
router.get("/nearest-assets", async (req, res) => {
  try {
    const { lng, lat, assetType, limit } = req.query;
    if (!lng || !lat || !assetType)
      return res.status(400).json({ error: "lng, lat, assetType required" });
    if (!ALLOWED_TABLES.includes(assetType))
      return res.status(400).json({ error: "Invalid assetType" });
    const query = `SELECT *, ST_Distance(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as dist FROM ${assetType} ORDER BY dist ASC LIMIT $3`;
    const { rows } = await pool.query(query, [lng, lat, limit || 10]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
