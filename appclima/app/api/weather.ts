import axios from 'axios';

const API_KEY = '38ea12b6e3384b086e2029cdf2419586';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getClimaActual(ciudad: string, pais: string) {
  const query = `${ciudad},${pais}`;
  const url = `${BASE_URL}/weather?q=${query}&appid=${API_KEY}&units=metric&lang=es`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.main) {
      return response.data;
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (error: any) {
    console.error('Error al obtener clima actual:', error.message || error);
    throw error;
  }
}

export async function getPronostico(ciudad: string, pais: string) {
  const query = `${ciudad},${pais}`;
  const url = `${BASE_URL}/forecast?q=${query}&appid=${API_KEY}&units=metric&lang=es`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.list) {
      return response.data;
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (error: any) {
    console.error('Error al obtener pronóstico:', error.message || error);
    throw error;
  }
}
