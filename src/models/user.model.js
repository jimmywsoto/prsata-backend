{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { supabase } from '../utils/supabase.js';

// Obtener todos los usuarios
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('app_users')
    .select('id, username, email, role, is_active, created_at, last_login_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Obtener usuario por ID
export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('app_users')
    .select('id, username, email, role, is_active, email_verified, last_login_at, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Crear usuario
export const createUser = async ({ username, email, password_hash, role, is_active }) => {
  const { data, error } = await supabase
    .from('app_users')
    .insert([{ username, email, password_hash, role, is_active }])
    .select('id, username, email, role')
    .single();

  if (error) throw error;
  return data;
};

// Buscar usuario por email
export const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data;
};

// Actualizar usuario (sin modificar contraseña)
export const updateUser = async (id, { username, email, role, is_active }) => {
  const { data, error } = await supabase
    .from('app_users')
    .update({ username, email, role, is_active })
    .eq('id', id)
    .select('id, username, email, role, created_at')
    .single();

  if (error) throw error;
  return data;
};

// Restablecer contraseña
export const updatePassword = async (id, { password_hash }) => {
  const { data, error } = await supabase
    .from('app_users')
    .update({ password_hash })
    .eq('id', id)
    .select('id, username, email, role, created_at')
    .single();

  if (error) throw error;
  return data;
};

// Actualizar last_login_at
export const updateLastLogin = async (id) => {
  const { error } = await supabase
    .from('app_users')
    .update({ last_login_at: new Date() })
    .eq('id', id)

  if (error) throw error;
};

// Eliminar usuario
export const deleteUser = async (id) => {
  const { error } = await supabase
    .from('app_users')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};
