{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { createClient } from '@supabase/supabase-js';

// Tomar las variables de entorno con fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan las variables de entorno de Supabase");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Función para subir imagen a Supabase
export const subirImagenASupabase = async (file) => {
  const nombreUnico = `${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from('gacimages')
    .upload(nombreUnico, file);

  if (error) throw error;

  const { data: publicData } = supabase.storage
    .from('gacimages')
    .getPublicUrl(nombreUnico);

  return publicData.publicUrl;
};
