{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import express from 'express';
import { ensureAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/profile', ensureAuth, (req, res) => {
    res.json({
        message: 'Acceso autorizado',
        user: req.user
    });
});

router.get('/me', ensureAuth, async (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role,
            is_active: req.user.is_active,
        }
    });
});

export default router;