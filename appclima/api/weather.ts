// src/api.ts
const API_KEY = '38ea12b6e3384b086e2029cdf2419586';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function handleFetch(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getClimaActual(ciudad: string, pais: string) {
  const query = `${ciudad},${pais}`;
  const url = `${BASE_URL}/weather?q=${query}&appid=${API_KEY}&units=metric&lang=es`;
  try {
    const data = await handleFetch(url);
    if (data.main) return data;
    throw new Error('Respuesta inválida del servidor');
  } catch (error: any) {
    console.error('Error al obtener clima actual:', error.message || error);
    throw error;
  }
}

export async function getPronostico(ciudad: string, pais: string) {
  const query = `${ciudad},${pais}`;
  const url = `${BASE_URL}/forecast?q=${query}&appid=${API_KEY}&units=metric&lang=es`;
  try {
    const data = await handleFetch(url);
    if (data.list) return data;
    throw new Error('Respuesta inválida del servidor');
  } catch (error: any) {
    console.error('Error al obtener pronóstico:', error.message || error);
    throw error;
  }
}
