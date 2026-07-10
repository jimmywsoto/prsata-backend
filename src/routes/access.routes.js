import { Router } from "express";

import {
    getAllRequestsController,
    getRequestsByUserIdController,
    getRequestByIdController,
    createAccessRequestController,
    deleteAccessRequestController,
} from "../controllers/access.controller.js";

import {
    approveAccessRequestController,
    rejectAccessRequestController,
} from "../controllers/access.controller.js";

const router = Router();

/* =========================================================
   GET
========================================================= */

// Obtener todas las solicitudes
router.get("/", getAllRequestsController);

// Obtener solicitudes por usuario
router.get("/user/:user_id", getRequestsByUserIdController);

// Obtener solicitud específica
router.get("/:id", getRequestByIdController);

/* =========================================================
   POST
========================================================= */

// Crear solicitud
router.post("/", createAccessRequestController);

/* =========================================================
   DELETE
========================================================= */

// Eliminar solicitud
router.delete("/:id", deleteAccessRequestController);

/* =========================================================
   PATCH
========================================================= */

// Aprobar solicitud
router.patch(
    "/:id/approve",
    approveAccessRequestController
);

// Rechazar solicitud
router.patch(
    "/:id/reject",
    rejectAccessRequestController
);

export default router;