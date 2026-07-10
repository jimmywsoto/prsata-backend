/*
|--------------------------------------------------------------------------
| validationCampaign.service.js
|--------------------------------------------------------------------------
| Servicio para la gestión de campañas de validación
| Base de datos: Supabase
|--------------------------------------------------------------------------
*/

import { supabase } from "../utils/supabase.js";

class ValidationCampaignService {

    /**
     * Obtener todas las campañas
     */
    async getAll() {

        const { data, error } = await supabase
            .from("validation_campaigns")
            .select(`
                *,
                validation_blocks(count)
            `)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);

        return data.map(campaign => ({
            ...campaign,
            total_blocks: campaign.validation_blocks?.[0]?.count ?? 0,
            validation_blocks: undefined
        }));
    }

    /**
     * Obtener campaña por ID
     */
    async getById(id) {

        const { data, error } = await supabase
            .from("validation_campaigns")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    /**
     * Crear campaña
     */
    async create(payload, userId) {

        const {
            name,
            period,
            description,
            planet_mosaic,
            geojson_version,
            status = "draft"
        } = payload;

        // Validaciones
        if (!name)
            throw new Error("El nombre de la campaña es obligatorio.");

        if (!period)
            throw new Error("El período es obligatorio.");

        // Evitar campañas duplicadas
        const { data: exists } = await supabase
            .from("validation_campaigns")
            .select("id")
            .eq("period", period)
            .maybeSingle();

        if (exists)
            throw new Error(`Ya existe una campaña para el período ${period}.`);

        const { data, error } = await supabase
            .from("validation_campaigns")
            .insert({
                name,
                period,
                description,
                planet_mosaic,
                geojson_version,
                status,
                created_by: userId
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    /**
     * Actualizar campaña
     */
    async update(id, payload) {

        const {
            name,
            period,
            description,
            planet_mosaic,
            geojson_version,
            status
        } = payload;

        const { data, error } = await supabase
            .from("validation_campaigns")
            .update({
                name,
                period,
                description,
                planet_mosaic,
                geojson_version,
                status,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    /**
     * Eliminar campaña
     */
    async delete(id) {

        // Verificar si existen bloques asociados
        const { count, error: countError } = await supabase
            .from("validation_blocks")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("campaign_id", id);

        if (countError)
            throw new Error(countError.message);

        if (count > 0) {
            throw new Error(
                `No se puede eliminar la campaña porque contiene ${count} bloques de validación.`
            );
        }

        const { error } = await supabase
            .from("validation_campaigns")
            .delete()
            .eq("id", id);

        if (error) throw new Error(error.message);

        return {
            success: true,
            message: "Campaña eliminada correctamente."
        };
    }

    /**
     * Cambiar estado de campaña
     */
    async changeStatus(id, status) {

        const validStatus = [
            "draft",
            "active",
            "closed"
        ];

        if (!validStatus.includes(status))
            throw new Error("Estado de campaña inválido.");

        const { data, error } = await supabase
            .from("validation_campaigns")
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    /**
     * Obtener campaña activa
     */
    async getActiveCampaign() {

        const { data, error } = await supabase
            .from("validation_campaigns")
            .select("*")
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw new Error(error.message);

        return data;
    }

    /**
     * Activar campaña
     * Solo puede existir una campaña activa
     */
    async activateCampaign(id) {

        // Desactivar todas
        const { error: deactivateError } = await supabase
            .from("validation_campaigns")
            .update({
                status: "closed",
                updated_at: new Date().toISOString()
            })
            .eq("status", "active");

        if (deactivateError)
            throw new Error(deactivateError.message);

        // Activar la solicitada
        const { data, error } = await supabase
            .from("validation_campaigns")
            .update({
                status: "active",
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

}

export default new ValidationCampaignService();