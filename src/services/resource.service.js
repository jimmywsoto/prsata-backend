{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { supabase } from '../utils/supabase.js';


// Obtener todos los recursos
export const findAll = async () => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Obtener recurso por element_id
export const findByElementId = async (element_id) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('element_id', element_id)
    .single();

  if (error) throw error;
  return data;
};

// Crear recurso
export const create = async ({ user_id, name, type, content, url, category }) => {
  const metadata = {
    created_by: user_id,
    last_modified_by: user_id,
    last_modified_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('resources')
    .insert([
      { user_id, name, type, content, url, category, metadata },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Actualizar recurso
export const update = async (element_id, user_id, { name, content, url, category }) => {
  const metadata = {
    last_modified_by: user_id,
    last_modified_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('resources')
    .update({
      name,
      content,
      url,
      category,
      metadata: supabase.rpc('jsonb_merge', { a: 'metadata', b: JSON.stringify(metadata) }) // si tu tabla soporta jsonb
    })
    .eq('element_id', element_id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Eliminar recurso
export const remove = async (element_id) => {
  // 1. Obtener el recurso antes de eliminarlo
  const { data: recurso, error: errorFind } = await supabase
    .from('resources')
    .select('*')
    .eq('element_id', element_id)
    .single();

  if (errorFind) throw errorFind;
  if (!recurso) throw new Error('Recurso no encontrado');

  // 2. Si es una imagen, eliminar del bucket
  if (recurso.type === 'image' && recurso.url) {
    try {
      const match = recurso.url.match(/\/object\/public\/([^/]+)\/(.+)$/);
      if (match) {
        const bucket = match[1];
        const filePath = match[2];

        const { error: errorRemove } = await supabase.storage
          .from(bucket)
          .remove([filePath]);

        if (errorRemove) {
          console.warn('⚠️ Error eliminando imagen del bucket:', errorRemove.message);
        } else {
          console.log('✅ Imagen eliminada correctamente del bucket');
        }
      }
    } catch (err) {
      console.warn('⚠️ No se pudo procesar la eliminación de imagen:', err.message);
    }
  }

  // 3. Eliminar de la tabla resources
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('element_id', element_id);

  if (error) throw error;
};