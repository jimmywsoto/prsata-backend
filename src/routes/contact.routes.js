{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { Router } from "express";
import { sendContactMail } from "../controllers/contact.controller.js";
import { validateContact } from "../middlewares/validateContact.js";

const router = Router();

router.post("/", validateContact, sendContactMail);

export default router;
