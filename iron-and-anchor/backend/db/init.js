require('dotenv').config();
const db = require('../config/db');

const createTables = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS reservas (
                id SERIAL PRIMARY KEY,
                fecha VARCHAR(50) NOT NULL,
                barbero VARCHAR(100) NOT NULL,
                servicio_id VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tablas inicializadas correctamente en Neon.tech");
        process.exit(0);
    } catch (err) {
        console.error("Error inicializando tablas:", err);
        process.exit(1);
    }
};

createTables();
