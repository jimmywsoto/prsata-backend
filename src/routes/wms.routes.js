{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 17/09/2026
    LAST MODIFIED: 17/09/2026
    VERSIÓN: 1.0.0
*/}

import express from "express";

import { proxyWms } from "../controllers/wms.controller.js";

const router = express.Router();

/*
 * ============================================================
 * WMS PROXY
 * ============================================================
 */

router.get(
    "/proxy",
    proxyWms
);


export default router;
