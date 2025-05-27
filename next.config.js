/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Si vas a usar imágenes externas (ej. de Supabase Storage) en el futuro con el componente <Image> de Next.js,
  // necesitarás configurar los dominios aquí. Por ejemplo:
  // images: {
  //   domains: ['TU_ID_DE_PROYECTO_SUPABASE.supabase.co'],
  // },
}

module.exports = nextConfig
