const { Pool } = require('pg');
const pool = new Pool({connectionString: process.env.DATABASE_URL});
pool.query("SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'").then(r => { console.log(JSON.stringify(r.rows, null, 2)); process.exit(0); }).catch(e => { console.error("ERROR:", e.message); process.exit(1); })

