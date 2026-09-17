{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 17/09/2026
    VERSIÓN: 1.1.0
*/}

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import accessRoutes from "./routes/access.routes.js";

// Planet Routes
import planetRoutes from "./routes/planet.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Testing generate PDF
import reportRoutes from "./routes/report.routes.js";

// Validacion de alertas
import validationCampaignRoutes from "./routes/validationCampaign.routes.js";

// Proxy WMS
import wmsRoutes from "./routes/wms.routes.js";

dotenv.config();
console.log('Welcome back, Mr. JWS ...');

const app = express();

{/* -------------------------------------------------------- CORS */ }
const allowedOrigins = [
    'http://localhost:5173',
    'https://prsata-hub.vercel.app',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (!allowedOrigins.includes(origin)) {
            const msg = 'El CORS policy no permite este origen.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

{/* -------------------------------------------------------- MIDDLEWARES */ }
//app.use(express.json()); //oig

app.use(express.json({
    limit: "50mb"
}));
app.use(morgan('dev'));

app.get("/", (req, res) => {

  res.json({
    status: "JWS Backend OK"
  });
});

app.get('/api/jws', (req, res) => {
    res.json({ message: 'Hello JWS, we are ready from JWS backend!' });
});

{/* -------------------------------------------------------- API ROUTES */ }
app.use('/api', routes);
app.use("/api/access-requests", accessRoutes);

app.use("/api/planet", planetRoutes); // Para mosaicos planet

app.use('/api/admin', adminRoutes); // Para rutas de administrador

app.use('/api/report', reportRoutes); // Para rutas de reportes

app.use("/api/validation-campaigns", validationCampaignRoutes); // Para validacion de alertas

app.use('/api/wms', wmsRoutes); // Para WMS Proxy

/*const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});*/

export default app;
