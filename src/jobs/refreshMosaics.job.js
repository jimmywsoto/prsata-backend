import { supabase } from '../utils/supabase.js';

import getAllMosaics from '../services/mosaics.service.js';

function extractMonth(name) {

    const match =
        name.match(/\d{4}[-_]\d{2}/);

    if (!match) return null;

    return match[0]
        .replace('_', '-');
}


export async function refreshMosaicsCache() {

    try {

        console.log(
            'Actualizando mosaicos Planet...'
        );

        const mosaics =
            await getAllMosaics();

        console.log(
            `Mosaicos obtenidos: ${mosaics.length}`
        );

        // =========================
        // RESET latest
        // =========================

        await supabase
            .from('planet_mosaics')
            .update({
                is_latest: false
            })
            .neq('id', null);


        // =========================
        // FILTRAR + ORDENAR
        // =========================

        const monthly =
            mosaics
                .filter(m => {

                    return (
                        m.name &&
                        (
                            m.name.includes(
                                'planet_medres_visual'
                            ) ||
                            m.name.includes(
                                'global_monthly'
                            )
                        )
                    );
                })
                .sort((a, b) => {

                    return (
                        new Date(
                            b.first_acquired
                        ) -
                        new Date(
                            a.first_acquired
                        )
                    );
                });


        // =========================
        // UPSERT
        // =========================

        /*for (let i = 0; i < monthly.length; i++) {
    
          const m = monthly[i];
    
          const isLatest = i === 0;
    
          const payload = {
    
            id: m.id,
    
            name: m.name,
    
            month:
              extractMonth(m.name),
    
            first_acquired:
              m.first_acquired,
    
            last_acquired:
              m.last_acquired,
    
            interval:
              m.interval,
    
            product_type:
              m.product_type,
    
            tile_url:
              `/api/planet/mosaic/${m.name}/tiles/{z}/{x}/{y}`,
    
            is_latest:
              isLatest,
    
            updated_at:
              new Date()
          };
    
          const {
            error
          } = await supabase
            .from('planet_mosaics')
            .upsert(payload);
    
          if (error) {
    
            console.error(
              'Error upsert:',
              error
            );
          }
        }*/

        await supabase
            .from('planet_mosaics')
            .update({
                is_latest: false
            })
            .eq('is_latest', true);


        const payload =
            monthly.map((m, index) => ({

                id: m.id,

                name: m.name,

                month:
                    extractMonth(m.name),

                first_acquired:
                    m.first_acquired,

                last_acquired:
                    m.last_acquired,

                interval:
                    m.interval,

                product_type:
                    m.product_type,

                tile_url:
                    `/api/planet/mosaic/${m.name}/tiles/{z}/{x}/{y}`,

                is_latest:
                    index === 0,

                updated_at:
                    new Date()
            }));


        const {
            error
        } = await supabase
            .from('planet_mosaics')
            .upsert(payload);

        if (error) {

            console.error(error);

            throw error;
        }
        //AQui termina


        console.log(
            'Cache Supabase actualizado'
        );


        // Actualizamos metadata
        await supabase
            .from('system_cache_status')
            .upsert({

                key: 'planet_mosaics',

                last_updated:
                    new Date(),

                status: 'success',

                total_records:
                    payload.length
            });

    } catch (error) {

        console.error(error);
    }
}