{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { createClient } from '@supabase/supabase-js';

{/* -------------------------------------------------------- ENV */ }
const supabaseUrl = process.env.SUPABASE_URL || 'https://smijrbnapxofovazdbdn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtaWpyYm5hcHhvZm92YXpkYmRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI1MzU4MiwiZXhwIjoyMDgzODI5NTgyfQ.DVUqMNLDvNYfxr2kf02YaEkOYS9e_G1n1CBJc-fRWro';

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan variables de entorno: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey);