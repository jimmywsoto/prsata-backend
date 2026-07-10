import express from 'express';

import {
  ensureAuth
} from '../middlewares/auth.middleware.js';

import {
  ensureAdmin
} from '../middlewares/admin.middleware.js';

import {
  refreshMosaicsCache
} from '../jobs/refreshMosaics.job.js';

import { supabase } from '../utils/supabase.js';

const router =
  express.Router();


// ======================================
// REFRESH PLANET CACHE
// ======================================

router.post(
  '/refresh-planet-cache',

  ensureAuth,

  ensureAdmin,

  async (req, res) => {

    try {

      console.log(
        `Refresh solicitado por ${req.user.username}`
      );

      await refreshMosaicsCache();

      res.json({

        success: true,

        message:
          'Cache Planet actualizada correctamente',

        updated_by:
          req.user.username,

        updated_at:
          new Date()
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        error:
          'Error actualizando cache Planet'
      });
    }
  }
);

router.get(
  '/planet-cache-status',

  ensureAuth,

  ensureAdmin,

  async (req, res) => {

    try {

      const {
        data,
        error
      } = await supabase
        .from('system_cache_status')
        .select('*')
        .eq(
          'key',
          'planet_mosaics'
        )
        .single();

      if (error) throw error;

      const {
        count
      } = await supabase
        .from('planet_mosaics')
        .select('*', {
          count: 'exact',
          head: true
        });

      const {
        data: latest
      } = await supabase
        .from('planet_mosaics')
        .select('*')
        .eq(
          'is_latest',
          true
        )
        .single();

      res.json({

        success: true,

        cache: data,

        total_mosaics:
          count || 0,

        latest:
          latest || null
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        error:
          'Error obteniendo estado cache'
      });
    }
  }
);

export default router;