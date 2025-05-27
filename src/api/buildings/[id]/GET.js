import Building from '../../../models/Building.js';

export default async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Bina bulunamadı' });
    }
    res.json(building);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 