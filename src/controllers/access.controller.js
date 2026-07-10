{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { 
    createAccessRequest,
    getAllRequests,
    getRequestById,
    getRequestsByUserId,
    deleteAccessRequest
 } from "../models/access.model.js";

import {
    approveAccessRequest,
    rejectAccessRequest,
} from "../models/access.model.js";

export const createRequestDep = async (req, res) => {
    try {
        const { user_id, message } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'Campos obligatorios faltantes' });
        }

        const review_access = await createAccessRequest({ user_id, request_message: message });


        res.status(201).json({ review_access });
    } catch (error) {
        console.error('Error al consultar acceso:', error);
        res.status(500).json({ error: 'No se pudo consultar acceso a sistema' });
    }
}

/* =========================================================
   Obtener todas las solicitudes
========================================================= */
export const getAllRequestsController = async (req, res) => {

    try {
        const requests = await getAllRequests();

        return res.status(200).json({
            success: true,
            data: requests,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================================================
   Obtener solicitudes por usuario
========================================================= */
export const getRequestsByUserIdController = async (req, res) => {

    try {

        const { user_id } = req.params;

        const requests = await getRequestsByUserId(user_id);

        return res.status(200).json({
            success: true,
            data: requests,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================================================
   Obtener solicitud por ID
========================================================= */
export const getRequestByIdController = async (req, res) => {

    try {

        const { id } = req.params;

        const request = await getRequestById(id);

        return res.status(200).json({
            success: true,
            data: request,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================================================
   Crear solicitud
========================================================= */
export const createAccessRequestController = async (req, res) => {

    try {

        const {
            user_id,
            request_message,
        } = req.body;

        /* =========================================
           Validar solicitud pendiente existente
        ========================================= */
        const existingRequests = await getRequestsByUserId(user_id);

        const hasPendingRequest = existingRequests.some(
            request => request.request_status === "PENDING"
        );

        if (hasPendingRequest) {

            return res.status(400).json({
                success: false,
                message: "Ya existe una solicitud pendiente.",
            });
        }

        const request = await createAccessRequest({
            user_id,
            request_message,
        });

        return res.status(201).json({
            success: true,
            data: request,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================================================
   Eliminar solicitud
========================================================= */
export const deleteAccessRequestController = async (req, res) => {

    try {

        const { id } = req.params;

        const deletedRequest = await deleteAccessRequest(id);

        return res.status(200).json({
            success: true,
            message: "Solicitud eliminada correctamente.",
            data: deletedRequest,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================================================
   Aprobar solicitud
========================================================= */
export const approveAccessRequestController = async (req, res) => {

    try {

        const { id } = req.params;

        const { reviewed_by } = req.body;

        const approvedRequest = await approveAccessRequest({
            request_id: id,
            reviewed_by,
        });

        return res.status(200).json({
            success: true,
            message: "Solicitud aprobada correctamente.",
            data: approvedRequest,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================================================
   Rechazar solicitud
========================================================= */
export const rejectAccessRequestController = async (req, res) => {

    try {

        const { id } = req.params;

        const { reviewed_by } = req.body;

        const rejectedRequest = await rejectAccessRequest({
            request_id: id,
            reviewed_by,
        });

        return res.status(200).json({
            success: true,
            message: "Solicitud rechazada correctamente.",
            data: rejectedRequest,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};