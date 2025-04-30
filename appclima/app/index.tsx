// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Al acceder a "/", saltamos directamente a la pestaña climaActual
  return <Redirect href="/climaActual" />;
}
