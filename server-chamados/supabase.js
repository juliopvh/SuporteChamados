// supabase.js - Código LIMPO e SEGURO para o GitHub
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Lê as chaves das variáveis de ambiente (funciona local com .env e no Render com Environment Variables)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "SUPABASE_URL e SUPABASE_KEY não configurados. " +
    "Defina essas variáveis de ambiente (.env localmente ou no painel do Render)."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
