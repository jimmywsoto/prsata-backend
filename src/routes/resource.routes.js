{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { Router } from 'express';
import * as resourceController from '../controllers/resource.controller.js';
import { ensureAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Protección: requiere token válido y usuario autenticado
router.use(ensureAuth);

router.get('/', ensureAuth, resourceController.getAllResources);
router.get('/:element_id', ensureAuth, resourceController.getResourceByElementId);
router.post('/', ensureAuth, resourceController.createResource);

router.put('/:element_id', ensureAuth, resourceController.updateResource);
router.delete('/:element_id', ensureAuth, resourceController.deleteResource);

export default router;



