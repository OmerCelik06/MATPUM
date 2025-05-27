export interface Building {
  id: number;
  bina_adi: string;
  calısma_salonlari: string;
  calısma_salonlari_kapasiteler: string;
  calısma_salonlari_bölüm_özel: string;
  calısma_salonlari_pc: string;
  asansor_sayisi: number;
  rampa_sayisi: number;
  erisilebilirlik_derecesi: number;
  geri_dönüsüm_kutuları: number;
  kantin_menu: string;
  otomat_sayisi: number;
  polygon_koordinatları: string;
  created_at: string;
  updated_at: string;
}

const API_URL = '/api';

export const getAllBuildings = async (): Promise<Building[]> => {
  try {
    const response = await fetch(`${API_URL}/buildings`);
    if (!response.ok) {
      throw new Error('Binalar getirilemedi');
    }
    return await response.json();
  } catch (error) {
    console.error('Binalar getirilirken hata oluştu:', error);
    throw error;
  }
};

export const getBuildingById = async (id: number): Promise<Building> => {
  try {
    const response = await fetch(`${API_URL}/buildings/${id}`);
    if (!response.ok) {
      throw new Error('Bina getirilemedi');
    }
    return await response.json();
  } catch (error) {
    console.error('Bina getirilirken hata oluştu:', error);
    throw error;
  }
}; 