{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 17/09/2026
    LAST MODIFIED: 17/09/2026
    VERSIÓN: 1.0.0
*/}

/**
 * ============================================================
 * WMS PROXY SERVICE
 * ============================================================
 *
 * Servicio encargado de construir y ejecutar las solicitudes
 * contra los servidores WMS autorizados.
 *
 * Soporta:
 *
 * - GetMap
 * - GetFeatureInfo
 * - GetCapabilities
 * - cualquier otra operación WMS GET
 *
 * El navegador nunca consulta directamente el servidor WMS.
 */

/**
 * ============================================================
 * OBTENER SERVIDORES WMS AUTORIZADOS
 * ============================================================
 */

const getAllowedWmsUrls = () => {

    const value =
        process.env.WMS_ALLOWED_URLS || "";

    return value
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
        .map(normalizeBaseUrl);
};

/**
 * ============================================================
 * NORMALIZAR URL BASE
 * ============================================================
 */

const normalizeBaseUrl = (url) => {

    return String(url)
        .trim()
        .replace(/\/+$/, "");
};

/**
 * ============================================================
 * VALIDAR URL WMS
 * ============================================================
 */

const isAllowedWmsUrl = (targetUrl) => {

    let parsedTarget;

    try {

        parsedTarget = new URL(targetUrl);

    } catch {

        return false;
    }

    // Solo HTTP / HTTPS

    if (
        parsedTarget.protocol !== "http:" &&
        parsedTarget.protocol !== "https:"
    ) {
        return false;
    }

    const normalizedTarget =
        normalizeBaseUrl(
            `${parsedTarget.origin}${parsedTarget.pathname}`
        );

    const allowedUrls =
        getAllowedWmsUrls();

    return allowedUrls.some(
        (allowedUrl) =>
            normalizeBaseUrl(allowedUrl) ===
            normalizedTarget
    );
};

/**
 * ============================================================
 * CONSTRUIR URL WMS
 * ============================================================
 *
 * target:
 *
 * http://ide.ambiente.gob.ec:8080/
 * geoserver/mae_ide/wms
 *
 * params:
 *
 * SERVICE=WMS
 * REQUEST=GetMap
 * LAYERS=...
 * BBOX=...
 *
 */

export const buildWmsUrl = (
    target,
    params
) => {

    if (!isAllowedWmsUrl(target)) {

        const error =
            new Error(
                "El servidor WMS solicitado no está autorizado."
            );

        error.status = 403;

        throw error;
    }

    const targetUrl =
        new URL(target);

    /*
     * Copiar los parámetros WMS
     */

    Object.entries(params).forEach(
        ([key, value]) => {

            if (
                value === undefined ||
                value === null
            ) {
                return;
            }

            targetUrl.searchParams.set(
                key,
                String(value)
            );
        }
    );

    return targetUrl.toString();
};

/**
 * ============================================================
 * EJECUTAR SOLICITUD WMS
 * ============================================================
 */

export const fetchWms = async (
    target,
    params,
    {
        signal,
        accept = "*/*"
    } = {}
) => {

    const url =
        buildWmsUrl(
            target,
            params
        );

    /*console.log(
        "[WMS PROXY →]",
        url
    );*/

    const response =
        await fetch(
            url,
            {
                method: "GET",

                signal,

                headers: {
                    Accept: accept,

                    /*
                     * Algunos GeoServer / proxies
                     * pueden comportarse mejor con
                     * un User-Agent explícito.
                     */
                    "User-Agent":
                        "PR-SATA-WMS-Proxy/1.0"
                }
            }
        );

    const contentType =
        response.headers.get(
            "content-type"
        ) ||
        "application/octet-stream";

    const cacheControl =
        response.headers.get(
            "cache-control"
        );

    const buffer =
        Buffer.from(
            await response.arrayBuffer()
        );

    return {
        status: response.status,
        contentType,
        cacheControl,
        buffer
    };
};
