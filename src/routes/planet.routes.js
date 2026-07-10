import express from 'express'
//const NodeCache = require("node-cache"); // instalar node-cache
import NodeCache from 'node-cache';

import { planetApi } from '../services/planet.service.js';
import getLatestMosaic from '../utils/mosaic.utils.js';
import getAllMosaics from '../services/mosaics.service.js';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

const cache = new NodeCache({
  stdTTL: 3600
});


// ======================================
// LISTAR MOSAICOS
// ======================================

router.get("/mosaics", async (req, res) => {

  try {

    const cached = cache.get("mosaics");

    if (cached) {
      return res.json(cached);
    }

    const response = await planetApi.get(
      "/basemaps/v1/mosaics"
    );

    cache.set("mosaics", response.data);

    res.json(response.data);

  } catch (error) {

    console.error(error.response?.data || error);

    res.status(500).json({
      error: "Error obteniendo mosaicos"
    });
  }
});


// ======================================
// OBTENER MOSAICO MÁS RECIENTE
// ======================================

router.get("/latest-mosaic-deprecated", async (req, res) => {

  try {

    const {
      name,
      productType
    } = req.query;

    const response =
      await planetApi.get(
        "/basemaps/v1/mosaics"
      );

    const mosaics =
      response.data.mosaics || [];

    const latest =
      getLatestMosaic(
        mosaics,
        {
          nameIncludes: name || null,
          productType:
            productType || null
        }
      );

    if (!latest) {

      return res.status(404).json({
        error:
          "No se encontró mosaico"
      });
    }

    const result = {

      id: latest.id,

      name: latest.name,

      first_acquired:
        latest.first_acquired,

      last_acquired:
        latest.last_acquired,

      interval:
        latest.interval,

      product_type:
        latest.product_type,

      tileUrl:
        `/api/planet/mosaic/${latest.name}/tiles/{z}/{x}/{y}`
    };

    res.json(result);

  } catch (error) {

    console.error(
      error.response?.data || error
    );

    res.status(500).json({
      error:
        "Error obteniendo mosaico reciente"
    });
  }
});


// Implementando paginación con filesystem
router.get(
  "/latest-mosaic-filesistem",
  async (req, res) => {

    try {

      const {
        name,
        productType
      } = req.query;

      const cacheKey =
        `latest-${name}-${productType}`;

      const cached =
        cache.get(cacheKey);

      if (cached) {

        return res.json(cached);
      }

      // =========================
      // OBTENER TODOS
      // =========================

      const mosaics =
        await getAllMosaics();

      console.log(
        `Mosaicos encontrados: ${mosaics.length}`
      );

      // =========================
      // FILTRAR
      // =========================

      let filtered =
        [...mosaics];

      if (name) {

        filtered =
          filtered.filter(m =>
            m.name?.includes(name)
          );
      }

      if (productType) {

        filtered =
          filtered.filter(m =>
            m.product_type ===
            productType
          );
      }

      // =========================
      // ORDENAR
      // =========================

      filtered.sort((a, b) => {

        return (
          new Date(
            b.first_acquired
          ) -
          new Date(
            a.first_acquired
          )
        );
      });

      const latest =
        filtered[0];

      if (!latest) {

        return res.status(404)
          .json({
            error:
              "No se encontró mosaico"
          });
      }

      // =========================
      // RESPUESTA
      // =========================

      const result = {

        id: latest.id,

        name: latest.name,

        first_acquired:
          latest.first_acquired,

        last_acquired:
          latest.last_acquired,

        interval:
          latest.interval,

        product_type:
          latest.product_type,

        tileUrl:
          `/api/planet/mosaic/${latest.name}/tiles/{z}/{x}/{y}`
      };

      // =========================
      // CACHE
      // =========================

      cache.set(
        cacheKey,
        result,
        3600
      );

      res.json(result);

    } catch (error) {

      console.error(
        error.response?.data || error
      );

      res.status(500).json({
        error:
          "Error obteniendo mosaico reciente"
      });
    }
  }
);

router.get(
  '/latest-mosaic',
  async (req, res) => {

    try {

      const {
        data,
        error
      } = await supabase
        .from('planet_mosaics')
        .select('*')
        .eq('is_latest', true)
        .single();

      if (error) throw error;

      res.json(data);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          'Error obteniendo latest'
      });
    }
  }
);

router.get(
  '/monthly',
  async (req, res) => {

    try {

      const {
        data,
        error
      } = await supabase
        .from('planet_mosaics')
        .select('*')
        .order(
          'first_acquired',
          {
            ascending: false
          }
        );

      if (error) throw error;

      res.json(data);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          'Error monthly'
      });
    }
  }
);

// ======================================
// TILE REDIRECT
// ======================================

router.get(
  "/mosaic/:name/tiles/:z/:x/:y",
  async (req, res) => {

    try {

      const {
        name,
        z,
        x,
        y
      } = req.params;

      const url =
        `https://tiles.planet.com/basemaps/v1/planet-tiles/${name}/gmap/${z}/${x}/${y}.png?api_key=${process.env.PLANET_API_KEY}`;

      res.redirect(url);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          "Error obteniendo tile"
      });
    }
  }
);


// ======================================
// SCENE SEARCH
// ======================================

router.post("/scenes/search", async (req, res) => {

  try {

    const body = req.body;

    const response = await planetApi.post(
      "/data/v1/quick-search",
      body
    );

    res.json(response.data);

  } catch (error) {

    console.error(error.response?.data || error);

    res.status(500).json({
      error: "Error buscando escenas"
    });
  }
});

export default router;