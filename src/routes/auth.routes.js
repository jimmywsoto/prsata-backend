{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import express from 'express';
import { register, login, resetpass } from '../controllers/auth.controller.js';
import cors from 'cors';

const router = express.Router();

{/* -------------------------------------------------------- CORS */ }
const allowedOrigins = [
    'http://localhost:5173',
    'https://geoinspire-hub.vercel.app',
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS no permitido por el origen'), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

{/* -------------------------------------------------------- APPLY CORS ON AUTHENTICATED ROUTES */ }
router.post('/register', cors(corsOptions), register);
router.post('/login', cors(corsOptions), login);
router.put('/reset-password/:id', cors(corsOptions), resetpass);

export default router;