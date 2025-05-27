import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Building = sequelize.define('Building', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bina_adi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  calısma_salonlari: {
    type: DataTypes.STRING,
    allowNull: false
  },
  calısma_salonlari_kapasiteler: {
    type: DataTypes.STRING,
    allowNull: false
  },
  calısma_salonlari_bölüm_özel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  calısma_salonlari_pc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  asansor_sayisi: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rampa_sayisi: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  erisilebilirlik_derecesi: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  geri_dönüsüm_kutuları: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  kantin_menu: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otomat_sayisi: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  polygon_koordinatları: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'buildings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Building; 