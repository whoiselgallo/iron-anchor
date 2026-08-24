require('dotenv').config();
const express = require('express');
const cors = require('cors');

const paymentRoutes = require('./routes/paymentRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Rutas modulares
app.use('/api/pay', paymentRoutes);
app.use('/api/media', mediaRoutes);

// Health check para Render
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Iron & Anchor Backend corriendo en el puerto ${PORT}`));
