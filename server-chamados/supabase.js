// supabase.js - Código LIMPO e SEGURO para o GitHub
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Lê as chaves do arquivo .env de forma segura
const supabaseUrl = "coloque a url aqui";
const supabaseKey = "coloque a key aqui";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
