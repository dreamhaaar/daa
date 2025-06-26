const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load .env variables

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
