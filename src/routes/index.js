{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import express from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import protectedRoutes from './protected.routes.js';
import accessRoutes from './access.routes.js'

const router = express.Router();

{/* -------------------------------------------------------- ROUTES */ }
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/protected', protectedRoutes);
router.use('/access', accessRoutes);

export default router;