/*
|--------------------------------------------------------------------------
| validationBlock.controller.js
|--------------------------------------------------------------------------
| Controlador para la gestión de bloques de validación
|--------------------------------------------------------------------------
*/

import validationBlockService from "../services/validationBlock.service.js";

class ValidationBlockController {

    /**
     * GET /api/validation-blocks
     * Listar bloques con filtros
     */
    async getAll(req, res) {

        try {

            const filters = {
                campaignId: req.query.campaignId,
                bloque: req.query.bloque,
                assignedTo: req.query.assignedTo,
                status: req.query.status,
                provincia: req.query.provincia,
                parroquia: req.query.parroquia
            };

            const blocks = await validationBlockService.getAll(filters);

            return res.status(200).json({
                success: true,
                data: blocks
            });

        } catch (error) {

            console.error("Error obteniendo bloques:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * GET /api/validation-blocks/:id
     */
    async getById(req, res) {

        try {

            const { id } = req.params;

            const block = await validationBlockService.getById(id);

            if (!block) {
                return res.status(404).json({
                    success: false,
                    message: "Bloque no encontrado."
                });
            }

            return res.status(200).json({
                success: true,
                data: block
            });

        } catch (error) {

            console.error("Error obteniendo bloque:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * GET /api/validation-blocks/my
     * Obtiene únicamente los bloques asignados
     * al usuario autenticado.
     */
    async getMyBlocks(req, res) {

        try {

            const userId = req.user?.id;

            const campaignId = req.query.campaignId;

            const blocks = await validationBlockService.getMyBlocks(
                userId,
                campaignId
            );

            return res.status(200).json({
                success: true,
                data: blocks
            });

        } catch (error) {

            console.error("Error obteniendo bloques del usuario:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * POST /api/validation-blocks/import
     * Importación masiva desde GeoJSON
     */
    async importGeoJSON(req, res) {

        try {

            const result = await validationBlockService.importGeoJSON(
                req.body
            );

            return res.status(201).json({
                success: true,
                message: "GeoJSON importado correctamente.",
                data: result
            });

        } catch (error) {

            console.error("Error importando GeoJSON:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * PUT /api/validation-blocks/assign
     * Asignar bloques a un usuario
     */
    async assignBlocks(req, res) {

        try {

            const {
                campaignId,
                blocks,
                userId
            } = req.body;

            const result = await validationBlockService.assignBlocks({

                campaignId,
                blocks,
                userId

            });

            return res.status(200).json({
                success: true,
                message: "Bloques asignados correctamente.",
                data: result
            });

        } catch (error) {

            console.error("Error asignando bloques:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * PUT /api/validation-blocks/:id
     * Actualizar información del bloque
     */
    async update(req, res) {

        try {

            const { id } = req.params;

            const result = await validationBlockService.update(
                id,
                req.body,
                req.user?.id
            );

            return res.status(200).json({
                success: true,
                message: "Bloque actualizado correctamente.",
                data: result
            });

        } catch (error) {

            console.error("Error actualizando bloque:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * DELETE /api/validation-blocks/:id
     */
    async delete(req, res) {

        try {

            const { id } = req.params;

            const result = await validationBlockService.delete(id);

            return res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {

            console.error("Error eliminando bloque:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * GET /api/validation-blocks/statistics
     * Resumen de una campaña
     */
    async getStatistics(req, res) {

        try {

            const { campaignId } = req.query;

            const stats = await validationBlockService.getStatistics(
                campaignId
            );

            return res.status(200).json({
                success: true,
                data: stats
            });

        } catch (error) {

            console.error("Error obteniendo estadísticas:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * PUT /api/validation-blocks/:id/status
     * Cambiar únicamente el estado
     */
    async changeStatus(req, res) {

        try {

            const { id } = req.params;
            const { status } = req.body;

            const result =
                await validationBlockService.changeStatus(
                    id,
                    status
                );

            return res.status(200).json({
                success: true,
                message: "Estado actualizado correctamente.",
                data: result
            });

        } catch (error) {

            console.error("Error cambiando estado:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }


    /**
 * GET /api/validation-blocks/geojson
 * Obtener FeatureCollection
 */
    async getGeoJSON(req, res) {

        try {

            const filters = {
                campaignId: req.query.campaignId,
                bloque: req.query.bloque,
                assignedTo: req.query.assignedTo,
                status: req.query.status,
                provincia: req.query.provincia,
                parroquia: req.query.parroquia
            };

            const geojson = await validationBlockService.getGeoJSON(filters);

            return res.status(200).json({
                success: true,
                data: geojson
            });

        } catch (error) {

            console.error("Error obteniendo GeoJSON:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * GET /api/validation-blocks/my/geojson
     * Obtener únicamente los bloques asignados
     * al usuario autenticado en formato GeoJSON
     */
    async getMyGeoJSON(req, res) {

        try {

            const userId = req.user?.id;

            const campaignId = req.query.campaignId;

            const geojson = await validationBlockService.getMyGeoJSON(
                userId,
                campaignId
            );

            return res.status(200).json({
                success: true,
                data: geojson
            });

        } catch (error) {

            console.error("Error obteniendo GeoJSON del usuario:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * PUT /api/validation-blocks/unassign
     * Liberar bloques asignados
     */
    async unassignBlocks(req, res) {

        try {

            const {
                campaignId,
                blocks
            } = req.body;

            const result =
                await validationBlockService.unassignBlocks({

                    campaignId,
                    blocks

                });

            return res.status(200).json({
                success: true,
                message: "Bloques liberados correctamente.",
                data: result
            });

        } catch (error) {

            console.error("Error liberando bloques:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * PUT /api/validation-blocks/:id/start
     * Marcar un bloque como En Progreso
     */
    async startValidation(req, res) {

        try {

            const { id } = req.params;

            const userId = req.user?.id;

            const result =
                await validationBlockService.startValidation(
                    id,
                    userId
                );

            return res.status(200).json({
                success: true,
                message: "Validación iniciada correctamente.",
                data: result
            });

        } catch (error) {

            console.error("Error iniciando validación:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * PUT /api/validation-blocks/:id/finish
     * Finalizar validación
     */
    async finishValidation(req, res) {

        try {

            const { id } = req.params;

            const userId = req.user?.id;

            const result =
                await validationBlockService.finishValidation(
                    id,
                    userId
                );

            return res.status(200).json({
                success: true,
                message: "Validación finalizada correctamente.",
                data: result
            });

        } catch (error) {

            console.error("Error finalizando validación:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

}

export default new ValidationBlockController();