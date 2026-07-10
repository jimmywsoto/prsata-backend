{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import express from 'express';
import * as ClientController from '../controllers/client.controller.js';
//import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas protegidas
//router.use(verifyToken);

// GET
router.get('/', ClientController.getClients);
router.get('/me', ClientController.getMyClients);
router.get('/:id', ClientController.getClient);

// POST
router.post('/', ClientController.createClient);

// PUT
router.put('/:id', ClientController.updateClient);

// DELETE
router.delete('/:id', ClientController.deleteClient);

export default router;