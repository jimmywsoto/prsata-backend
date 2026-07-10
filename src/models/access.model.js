/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 07/04/2026
    LAST MODIFIED: 07/04/2026
    VERSIÓN: 1.0.0
*/

import { supabase } from '../utils/supabase.js';

// Funcionalidades para determinar acceso a sistema

export const getAllRequests = async () => {
  const { data, error } = await supabase
    .from('access_requests')
    .select('id, user_id, request_status, request_message, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createAccessRequest = async ({ user_id, request_message }) => {
  const { data, error } = await supabase
    .from("access_requests")
    .insert([{ user_id, request_message }])
    .select('id, user_id, request_status, request_message, created_at')
    .single();

  if (error) throw error;
  return data;
}

export const getRequestById = async (id) => {
  const { data, error } = await supabase
    .from("access_requests")
    .select(`
        id,
        user_id,
        request_status,
        request_message,
        reviewed_by,
        reviewed_at,
        created_at,
        updated_at
      `)
    .eq("id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

export const getRequestsByUserId = async (user_id) => {
  const { data, error } = await supabase
    .from("access_requests")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })

  if (error) throw error;
  return data;
}

export const deleteAccessRequest = async (id) => {

  const { data, error } = await supabase
    .from("access_requests")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};


/* =========================================================
   Aprobar solicitud
========================================================= */
export const approveAccessRequest = async ({
    request_id,
    reviewed_by,
}) => {

    /* =========================================
       Obtener solicitud
    ========================================= */
    const request = await getRequestById(request_id);

    if (!request) {
        throw new Error("Solicitud no encontrada.");
    }

    /* =========================================
       Actualizar solicitud
    ========================================= */
    const { data, error } = await supabase
        .from("access_requests")
        .update({
            request_status: "APPROVED",
            reviewed_by,
            reviewed_at: new Date().toISOString(),
        })
        .eq("id", request_id)
        .select()
        .single();

    if (error) throw error;

    /* =========================================
       Autorizar usuario
    ========================================= */
    const { error: userError } = await supabase
        .from("app_users")
        .update({
            is_active: true,
        })
        .eq("id", request.user_id);

    if (userError) throw userError;

    return data;
};

/* =========================================================
   Rechazar solicitud
========================================================= */
export const rejectAccessRequest = async ({
    request_id,
    reviewed_by,
}) => {

    const { data, error } = await supabase
        .from("access_requests")
        .update({
            request_status: "REJECTED",
            reviewed_by,
            reviewed_at: new Date().toISOString(),
        })
        .eq("id", request_id)
        .select()
        .single();

    if (error) throw error;

    return data;
};