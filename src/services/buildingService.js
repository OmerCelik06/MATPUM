const API_URL = '/api';

export const getAllBuildings = async () => {
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

export const getBuildingById = async (id) => {
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