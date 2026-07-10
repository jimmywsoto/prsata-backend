/*
|--------------------------------------------------------------------------
| validationCampaign.routes.js
|--------------------------------------------------------------------------
| Rutas para la gestión de campañas de validación
|--------------------------------------------------------------------------
*/

import { Router } from "express";

import validationCampaignController from "../controllers/validationCampaign.controller.js";

// Middlewares
//import authMiddleware from "../middlewares/authMiddleware.js";
// import roleMiddleware from "../middlewares/roleMiddleware.js";

import { ensureAuth } from '../middlewares/auth.middleware.js';

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                   CONSULTAS                                */
/* -------------------------------------------------------------------------- */

/**
 * Obtener todas las campañas
 * GET /api/validation-campaigns
 */
router.get(
    "/",
    ensureAuth,
    validationCampaignController.getAll
);

/**
 * Obtener campaña activa
 * GET /api/validation-campaigns/active
 *
 * Debe ir antes de "/:id"
 */
router.get(
    "/active",
    ensureAuth,
    validationCampaignController.getActiveCampaign
);

/**
 * Obtener campaña por ID
 * GET /api/validation-campaigns/:id
 */
router.get(
    "/:id",
    ensureAuth,
    validationCampaignController.getById
);


/* -------------------------------------------------------------------------- */
/*                                  CREACIÓN                                  */
/* -------------------------------------------------------------------------- */

/**
 * Crear campaña
 * POST /api/validation-campaigns
 */
router.post(
    "/",
    ensureAuth,
    // roleMiddleware(["admin", "superadmin"]),
    validationCampaignController.create
);


/* -------------------------------------------------------------------------- */
/*                                 ACTUALIZAR                                 */
/* -------------------------------------------------------------------------- */

/**
 * Actualizar campaña
 * PUT /api/validation-campaigns/:id
 */
router.put(
    "/:id",
    ensureAuth,
    // roleMiddleware(["admin", "superadmin"]),
    validationCampaignController.update
);

/**
 * Cambiar estado
 * PATCH /api/validation-campaigns/:id/status
 */
router.patch(
    "/:id/status",
    ensureAuth,
    // roleMiddleware(["admin", "superadmin"]),
    validationCampaignController.changeStatus
);

/**
 * Activar campaña
 * PATCH /api/validation-campaigns/:id/activate
 */
router.patch(
    "/:id/activate",
    ensureAuth,
    // roleMiddleware(["admin", "superadmin"]),
    validationCampaignController.activateCampaign
);


/* -------------------------------------------------------------------------- */
/*                                  ELIMINAR                                  */
/* -------------------------------------------------------------------------- */

/**
 * Eliminar campaña
 * DELETE /api/validation-campaigns/:id
 */
router.delete(
    "/:id",
    ensureAuth,
    // roleMiddleware(["superadmin"]),
    validationCampaignController.delete
);

export default router;