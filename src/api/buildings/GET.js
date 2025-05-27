import Building from '../../models/Building.js';

export default async (req, res) => {
  try {
    const buildings = await Building.findAll();
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 