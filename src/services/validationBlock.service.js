/*
|--------------------------------------------------------------------------
| validationBlock.service.js (Parte 1)
|--------------------------------------------------------------------------
| Gestión de bloques de validación
|--------------------------------------------------------------------------
*/

import supabase from "../config/supabase.js";

class ValidationBlockService {

    /* --------------------------------------------------------------------------
     * Obtener bloques con filtros
     * ------------------------------------------------------------------------*/
    async getAll(filters = {}) {

        let query = supabase
            .from("validation_blocks")
            .select(`
                *,
                validation_campaigns(
                    id,
                    name,
                    period,
                    status
                )
            `);

        /* ---------------------- Filtros ---------------------- */

        if (filters.campaignId) {
            query = query.eq(
                "campaign_id",
                filters.campaignId
            );
        }

        if (filters.bloque) {
            query = query.eq(
                "bloque",
                filters.bloque
            );
        }

        if (filters.assignedTo) {
            query = query.eq(
                "assigned_to",
                filters.assignedTo
            );
        }

        if (filters.status) {
            query = query.eq(
                "validation_status",
                filters.status
            );
        }

        if (filters.provincia) {
            query = query.ilike(
                "provincia",
                `%${filters.provincia}%`
            );
        }

        if (filters.parroquia) {
            query = query.ilike(
                "parroquia",
                `%${filters.parroquia}%`
            );
        }

        query = query
            .order("bloque", {
                ascending: true
            })
            .order("cod", {
                ascending: true
            });

        const { data, error } = await query;

        if (error)
            throw new Error(error.message);

        return data;
    }

    /* --------------------------------------------------------------------------
     * Obtener bloque por ID
     * ------------------------------------------------------------------------*/
    async getById(id) {

        const { data, error } = await supabase
            .from("validation_blocks")
            .select(`
                *,
                validation_campaigns(
                    id,
                    name,
                    period,
                    status
                )
            `)
            .eq("id", id)
            .single();

        if (error)
            throw new Error(error.message);

        return data;
    }

    /* --------------------------------------------------------------------------
     * Obtener bloques asignados al usuario autenticado
     * ------------------------------------------------------------------------*/
    async getMyBlocks(userId, campaignId = null) {

        if (!userId)
            throw new Error("Usuario no autenticado.");

        let query = supabase
            .from("validation_blocks")
            .select(`
                id,
                campaign_id,
                cod,
                provincia,
                parroquia,
                nombre,
                delimitacion,
                validacion,
                bloque,
                geometry,
                validation_status,
                assigned_at,
                validated_at,
                comments
            `)
            .eq("assigned_to", userId);

        if (campaignId) {
            query = query.eq(
                "campaign_id",
                campaignId
            );
        }

        query = query
            .order("bloque")
            .order("cod");

        const { data, error } = await query;

        if (error)
            throw new Error(error.message);

        return data;
    }

    /* --------------------------------------------------------------------------
     * Obtener bloques de un bloque específico
     * (útil para el administrador)
     * ------------------------------------------------------------------------*/
    async getBlockGroup(campaignId, bloque) {

        const { data, error } = await supabase
            .from("validation_blocks")
            .select(`
                id,
                cod,
                bloque,
                provincia,
                parroquia,
                nombre,
                validacion,
                validation_status,
                assigned_to,
                geometry
            `)
            .eq("campaign_id", campaignId)
            .eq("bloque", bloque)
            .order("cod");

        if (error)
            throw new Error(error.message);

        return data;
    }

    /* --------------------------------------------------------------------------
 * Asignar uno o varios bloques a un usuario
 * ------------------------------------------------------------------------*/
    async assignBlocks({
        campaignId,
        blocks,
        userId
    }) {

        if (!campaignId)
            throw new Error("La campaña es obligatoria.");

        if (!userId)
            throw new Error("Debe especificar el usuario.");

        if (!Array.isArray(blocks) || blocks.length === 0)
            throw new Error("Debe seleccionar al menos un bloque.");

        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from("validation_blocks")
            .update({
                assigned_to: userId,
                assigned_at: now,
                validation_status: "assigned",
                updated_at: now
            })
            .eq("campaign_id", campaignId)
            .in("bloque", blocks)
            .select();

        if (error)
            throw new Error(error.message);

        return {
            assigned: data.length,
            blocks,
            userId,
            records: data
        };

    }

    /* --------------------------------------------------------------------------
     * Liberar bloques asignados
     * ------------------------------------------------------------------------*/
    async unassignBlocks({
        campaignId,
        blocks
    }) {

        if (!campaignId)
            throw new Error("La campaña es obligatoria.");

        if (!Array.isArray(blocks) || blocks.length === 0)
            throw new Error("Debe seleccionar al menos un bloque.");

        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from("validation_blocks")
            .update({
                assigned_to: null,
                assigned_at: null,
                validation_status: "pending",
                updated_at: now
            })
            .eq("campaign_id", campaignId)
            .in("bloque", blocks)
            .select();

        if (error)
            throw new Error(error.message);

        return {
            released: data.length,
            blocks,
            records: data
        };

    }

    /* --------------------------------------------------------------------------
     * Actualizar información de validación
     * (utilizado por el técnico)
     * ------------------------------------------------------------------------*/
    async update(
        id,
        payload,
        userId
    ) {

        const {
            validacion,
            comments,
            validation_status
        } = payload;

        const now = new Date().toISOString();

        const updateData = {

            updated_at: now,

            validated_by: userId,

            validated_at: now

        };

        if (validacion !== undefined)
            updateData.validacion = validacion;

        if (comments !== undefined)
            updateData.comments = comments;

        if (validation_status)
            updateData.validation_status = validation_status;

        const { data, error } = await supabase
            .from("validation_blocks")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error)
            throw new Error(error.message);

        return data;

    }

    /* --------------------------------------------------------------------------
     * Cambiar únicamente el estado
     * ------------------------------------------------------------------------*/
    async changeStatus(
        id,
        status
    ) {

        const validStatus = [
            "pending",
            "assigned",
            "in_progress",
            "completed"
        ];

        if (!validStatus.includes(status))
            throw new Error("Estado inválido.");

        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from("validation_blocks")
            .update({

                validation_status: status,

                updated_at: now

            })
            .eq("id", id)
            .select()
            .single();

        if (error)
            throw new Error(error.message);

        return data;

    }

    /* --------------------------------------------------------------------------
     * Marcar un bloque como iniciado
     * ------------------------------------------------------------------------*/
    async startValidation(
        id,
        userId
    ) {

        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from("validation_blocks")
            .update({

                validation_status: "in_progress",

                validated_by: userId,

                updated_at: now

            })
            .eq("id", id)
            .select()
            .single();

        if (error)
            throw new Error(error.message);

        return data;

    }

    /* --------------------------------------------------------------------------
     * Finalizar validación
     * ------------------------------------------------------------------------*/
    async finishValidation(
        id,
        userId
    ) {

        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from("validation_blocks")
            .update({

                validation_status: "completed",

                validated_by: userId,

                validated_at: now,

                updated_at: now

            })
            .eq("id", id)
            .select()
            .single();

        if (error)
            throw new Error(error.message);

        return data;

    }

    /* --------------------------------------------------------------------------
     * Eliminar un bloque
     * (normalmente sólo para administración)
     * ------------------------------------------------------------------------*/
    async delete(id) {

        const { error } = await supabase
            .from("validation_blocks")
            .delete()
            .eq("id", id);

        if (error)
            throw new Error(error.message);

        return {
            success: true,
            message: "Bloque eliminado correctamente."
        };

    }

    /* --------------------------------------------------------------------------
     * Obtener estadísticas de una campaña
     * ------------------------------------------------------------------------*/
    async getStatistics(campaignId) {

        if (!campaignId)
            throw new Error("Debe especificar una campaña.");

        const { data, error } = await supabase
            .from("validation_blocks")
            .select(`
            validation_status,
            assigned_to
        `)
            .eq("campaign_id", campaignId);

        if (error)
            throw new Error(error.message);

        const stats = {

            total: data.length,

            pending: 0,

            assigned: 0,

            in_progress: 0,

            completed: 0,

            assignedUsers: 0

        };

        const users = new Set();

        data.forEach(block => {

            switch (block.validation_status) {

                case "pending":
                    stats.pending++;
                    break;

                case "assigned":
                    stats.assigned++;
                    break;

                case "in_progress":
                    stats.in_progress++;
                    break;

                case "completed":
                    stats.completed++;
                    break;

            }

            if (block.assigned_to)
                users.add(block.assigned_to);

        });

        stats.assignedUsers = users.size;

        stats.progress =
            stats.total === 0
                ? 0
                : Number(
                    (
                        stats.completed /
                        stats.total *
                        100
                    ).toFixed(2)
                );

        return stats;

    }

    /* --------------------------------------------------------------------------
     * Obtener listado de bloques existentes en una campaña
     * ------------------------------------------------------------------------*/
    async getAvailableBlocks(campaignId) {

        const { data, error } = await supabase
            .from("validation_blocks")
            .select("bloque")
            .eq("campaign_id", campaignId);

        if (error)
            throw new Error(error.message);

        return [...new Set(
            data.map(item => item.bloque)
        )].sort((a, b) => a - b);

    }

    /* --------------------------------------------------------------------------
     * Obtener usuarios asignados
     * ------------------------------------------------------------------------*/
    async getAssignedUsers(campaignId) {

        const { data, error } = await supabase
            .from("validation_blocks")
            .select(`
            assigned_to
        `)
            .eq("campaign_id", campaignId)
            .not("assigned_to", "is", null);

        if (error)
            throw new Error(error.message);

        return [...new Set(
            data.map(item => item.assigned_to)
        )];

    }

    /* --------------------------------------------------------------------------
     * Construir FeatureCollection para Leaflet
     * ------------------------------------------------------------------------*/
    async getGeoJSON(filters = {}) {

        const blocks = await this.getAll(filters);

        return {

            type: "FeatureCollection",

            features: blocks.map(block => ({

                type: "Feature",

                geometry: block.geometry,

                properties: {

                    id: block.id,

                    cod: block.cod,

                    provincia: block.provincia,

                    parroquia: block.parroquia,

                    nombre: block.nombre,

                    delimitacion: block.delimitacion,

                    validacion: block.validacion,

                    bloque: block.bloque,

                    validation_status: block.validation_status,

                    assigned_to: block.assigned_to,

                    assigned_at: block.assigned_at,

                    validated_at: block.validated_at,

                    comments: block.comments

                }

            }))

        };

    }

    /* --------------------------------------------------------------------------
     * Obtener únicamente el GeoJSON del usuario autenticado
     * ------------------------------------------------------------------------*/
    async getMyGeoJSON(
        userId,
        campaignId
    ) {

        const blocks = await this.getMyBlocks(
            userId,
            campaignId
        );

        return {

            type: "FeatureCollection",

            features: blocks.map(block => ({

                type: "Feature",

                geometry: block.geometry,

                properties: {

                    id: block.id,

                    cod: block.cod,

                    provincia: block.provincia,

                    parroquia: block.parroquia,

                    nombre: block.nombre,

                    delimitacion: block.delimitacion,

                    validacion: block.validacion,

                    bloque: block.bloque,

                    validation_status: block.validation_status,

                    comments: block.comments

                }

            }))

        };

    }



}

export default new ValidationBlockService();