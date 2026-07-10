/*
|--------------------------------------------------------------------------
| validationCampaign.controller.js
|--------------------------------------------------------------------------
| Controlador para la gestión de campañas de validación
|--------------------------------------------------------------------------
*/

import validationCampaignService from "../services/validationCampaign.service.js";

class ValidationCampaignController {

    /**
     * GET /api/validation-campaigns
     */
    async getAll(req, res) {
        try {

            const campaigns = await validationCampaignService.getAll();

            return res.status(200).json({
                success: true,
                data: campaigns
            });

        } catch (error) {

            console.error("Error obteniendo campañas:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

    /**
     * GET /api/validation-campaigns/:id
     */
    async getById(req, res) {

        try {

            const { id } = req.params;

            const campaign = await validationCampaignService.getById(id);

            if (!campaign) {
                return res.status(404).json({
                    success: false,
                    message: "Campaña no encontrada."
                });
            }

            return res.status(200).json({
                success: true,
                data: campaign
            });

        } catch (error) {

            console.error("Error obteniendo campaña:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * POST /api/validation-campaigns
     */
    async create(req, res) {

        try {

            // authMiddleware debe colocar el usuario autenticado aquí
            const userId = req.user?.id ?? null;

            const campaign = await validationCampaignService.create(
                req.body,
                userId
            );

            return res.status(201).json({
                success: true,
                message: "Campaña creada correctamente.",
                data: campaign
            });

        } catch (error) {

            console.error("Error creando campaña:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * PUT /api/validation-campaigns/:id
     */
    async update(req, res) {

        try {

            const { id } = req.params;

            const campaign = await validationCampaignService.update(
                id,
                req.body
            );

            return res.status(200).json({
                success: true,
                message: "Campaña actualizada correctamente.",
                data: campaign
            });

        } catch (error) {

            console.error("Error actualizando campaña:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * DELETE /api/validation-campaigns/:id
     */
    async delete(req, res) {

        try {

            const { id } = req.params;

            const result = await validationCampaignService.delete(id);

            return res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {

            console.error("Error eliminando campaña:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * PATCH /api/validation-campaigns/:id/status
     */
    async changeStatus(req, res) {

        try {

            const { id } = req.params;
            const { status } = req.body;

            const campaign = await validationCampaignService.changeStatus(
                id,
                status
            );

            return res.status(200).json({
                success: true,
                message: "Estado actualizado correctamente.",
                data: campaign
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
     * PATCH /api/validation-campaigns/:id/activate
     */
    async activateCampaign(req, res) {

        try {

            const { id } = req.params;

            const campaign =
                await validationCampaignService.activateCampaign(id);

            return res.status(200).json({
                success: true,
                message: "Campaña activada correctamente.",
                data: campaign
            });

        } catch (error) {

            console.error("Error activando campaña:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * GET /api/validation-campaigns/active
     */
    async getActiveCampaign(req, res) {

        try {

            const campaign =
                await validationCampaignService.getActiveCampaign();

            return res.status(200).json({
                success: true,
                data: campaign
            });

        } catch (error) {

            console.error("Error obteniendo campaña activa:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

}

export default new ValidationCampaignController();