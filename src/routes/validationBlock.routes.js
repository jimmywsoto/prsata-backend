/*
|--------------------------------------------------------------------------
| validationBlock.routes.js
|--------------------------------------------------------------------------
| Rutas para la gestión de bloques de validación
|--------------------------------------------------------------------------
*/

import { Router } from "express";

import validationBlockController from "../controllers/validationBlock.controller.js";

// Middlewares
import { ensureAuth } from '../middlewares/auth.middleware.js';
//import authMiddleware from "../middlewares/authMiddleware.js";
// import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                  CONSULTAS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Obtener estadísticas
 * GET /api/validation-blocks/statistics
 */
router.get(
    "/statistics",
    ensureAuth,
    //authMiddleware,
    validationBlockController.getStatistics
);

/**
 * Obtener únicamente mis bloques
 * GET /api/validation-blocks/my
 */
router.get(
    "/my",
    ensureAuth,
    //authMiddleware,
    validationBlockController.getMyBlocks
);

/**
 * Obtener GeoJSON del usuario autenticado
 * GET /api/validation-blocks/my/geojson
 */
router.get(
    "/my/geojson",
    ensureAuth,
    //authMiddleware,
    validationBlockController.getMyGeoJSON
);

/**
 * Obtener GeoJSON de una campaña
 * GET /api/validation-blocks/geojson
 */
router.get(
    "/geojson",
    ensureAuth,
    //authMiddleware,
    validationBlockController.getGeoJSON
);

/**
 * Obtener todos los bloques
 * GET /api/validation-blocks
 */
router.get(
    "/",
    ensureAuth,
    //authMiddleware,
    validationBlockController.getAll
);

/**
 * Obtener bloque por ID
 * GET /api/validation-blocks/:id
 */
router.get(
    "/:id",
    ensureAuth,
    //authMiddleware,
    validationBlockController.getById
);


/* -------------------------------------------------------------------------- */
/*                                  IMPORTAR                                  */
/* -------------------------------------------------------------------------- */

/**
 * Importar GeoJSON
 * POST /api/validation-blocks/import
 */
router.post(
    "/import",
    ensureAuth,
    //authMiddleware,
    // roleMiddleware(["admin", "superadmin"]),
    validationBlockController.importGeoJSON
);


/* -------------------------------------------------------------------------- */
/*                                  ASIGNAR                                   */
/* -------------------------------------------------------------------------- */

/**
 * Asignar bloques a un usuario
 * PUT /api/validation-blocks/assign
 */
router.put(
    "/assign",
    ensureAuth,
    //authMiddleware,
    // roleMiddleware(["admin", "superadmin"]),
    validationBlockController.assignBlocks
);


/**
 * Liberar bloques
 * PUT /api/validation-blocks/unassign
 */
router.put(
    "/unassign",
    ensureAuth,
    //authMiddleware,
    // roleMiddleware(["admin", "superadmin"]),
    validationBlockController.unassignBlocks
);


/* -------------------------------------------------------------------------- */
/*                                ACTUALIZAR                                  */
/* -------------------------------------------------------------------------- */

/**
 * Iniciar validación
 */
router.put(
    "/:id/start",
    ensureAuth,
    //authMiddleware,
    validationBlockController.startValidation
);

/**
 * Finalizar validación
 */
router.put(
    "/:id/finish",
    ensureAuth,
    //authMiddleware,
    validationBlockController.finishValidation
);

/**
 * Cambiar estado
 */
router.put(
    "/:id/status",
    ensureAuth,
    //authMiddleware,
    validationBlockController.changeStatus
);

/**
 * Actualizar información del bloque
 */
router.put(
    "/:id",
    ensureAuth,
    //authMiddleware,
    validationBlockController.update
);


/* -------------------------------------------------------------------------- */
/*                                  ELIMINAR                                  */
/* -------------------------------------------------------------------------- */

router.delete(
    "/:id",
    ensureAuth,
    //authMiddleware,
    // roleMiddleware(["superadmin"]),
    validationBlockController.delete
);

export default router;