{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 17/09/2026
    LAST MODIFIED: 17/09/2026
    VERSIÓN: 1.0.0
*/}

import { fetchWms } from "../services/wmsProxy.service.js";

/**
 * ============================================================
 * PROXY WMS
 * ============================================================
 *
 * GET /api/wms/proxy
 *
 * Ejemplo:
 *
 * /api/wms/proxy
 *   ?target=http://ide.ambiente.gob.ec:8080/geoserver/mae_ide/wms
 *   &SERVICE=WMS
 *   &REQUEST=GetMap
 *   &LAYERS=v_fa210_snap_a
 *   ...
 *
 */


export const proxyWms = async (
    req,
    res
) => {

    const {
        target,
        ...wmsParams
    } = req.query;


    /*
     * ========================================================
     * VALIDAR TARGET
     * ========================================================
     */

    if (!target) {

        return res.status(400).json({
            success: false,
            message:
                "El parámetro 'target' es obligatorio."
        });
    }


    /*
     * ========================================================
     * NORMALIZAR PARÁMETROS
     * ========================================================
     *
     * Express puede entregar algunos valores
     * como arrays si el parámetro aparece varias veces.
     *
     * Para WMS normalmente necesitamos el primer valor.
     */

    const normalizedParams =
        Object.fromEntries(
            Object.entries(wmsParams)
                .map(
                    ([key, value]) => [
                        key,
                        Array.isArray(value)
                            ? value[0]
                            : value
                    ]
                )
        );


    /*
     * ========================================================
     * CONSULTAR WMS
     * ========================================================
     */

    try {

        const result =
            await fetchWms(
                target,
                normalizedParams,
                {
                    accept:
                        req.headers.accept ||
                        "*/*"
                }
            );


        /*
         * ====================================================
         * RESPUESTA
         * ====================================================
         */

        res.status(
            result.status
        );


        res.setHeader(
            "Content-Type",
            result.contentType
        );


        /*
         * Evitar que el navegador
         * trate la respuesta como descarga.
         */

        res.setHeader(
            "Content-Disposition",
            "inline"
        );


        /*
         * Cache.
         *
         * Para tiles puede ser útil.
         */

        if (
            result.cacheControl
        ) {

            res.setHeader(
                "Cache-Control",
                result.cacheControl
            );

        } else {

            /*
             * Cache moderado para recursos WMS.
             *
             * Si posteriormente queremos
             * cache más agresivo podemos
             * configurarlo específicamente.
             */

            res.setHeader(
                "Cache-Control",
                "public, max-age=300"
            );
        }


        return res.send(
            result.buffer
        );

    } catch (error) {

        console.error(
            "[WMS PROXY ERROR]",
            error
        );


        /*
         * Error de autorización
         */

        if (
            error.status === 403
        ) {

            return res.status(403).json({
                success: false,
                message:
                    error.message
            });
        }


        /*
         * Error del servidor WMS
         */

        return res.status(502).json({
            success: false,
            message:
                "No fue posible consultar el servidor WMS.",

            error:
                process.env.NODE_ENV ===
                "development"
                    ? error.message
                    : undefined
        });
    }
};
