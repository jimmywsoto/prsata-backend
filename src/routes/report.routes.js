{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { Router } from 'express';

import { createReport } from '../controllers/report.controller.js';
import { ensureAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Protección: requiere token válido y usuario autenticado
//router.use(ensureAuth);

router.post('/', createReport);

export default router;