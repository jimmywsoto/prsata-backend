/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 07/04/2026
    LAST MODIFIED: 07/04/2026
    VERSIÓN: 1.0.0
*/

import { supabase } from '../utils/supabase.js';

// Obtener todos los clientes
export const getAllClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      company,
      legal_rep,
      contact_number,
      is_active,
      created_at,
      updated_at,
      created_by
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Obtener cliente por ID
export const getClientById = async (id) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Obtener clientes por usuario
export const getClientsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Crear cliente
export const createClient = async ({
  company,
  legal_rep,
  contact_number,
  created_by
}) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([{
      company,
      legal_rep,
      contact_number,
      created_by
    }])
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

// Actualizar cliente
export const updateClient = async (id, updateData) => {
  const { data, error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

// Eliminar cliente
export const deleteClient = async (id) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};