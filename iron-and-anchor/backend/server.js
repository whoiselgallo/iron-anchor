require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const clientMP = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

// Datos en memoria (Para conectar a DB después)
const barberos = ['Antonio G', 'Roberto R', 'Gonzalo H', 'Mariano', 'Maria A'];
const MAX_SILLAS = 6;
const reservas = []; // Aquí guardaremos las reservas para validar las sillas

// Precios
const SERVICIOS = {
    corte: { nombre: "Corte Clásico", precio: 25.00 },
    rasurado: { nombre: "Rasurado Tradicional", precio: 20.00 },
    combo: { nombre: "Promo: Iron & Anchor (Corte + Rasurado)", precio: 40.00 }
};

// 1. Endpoint para crear intención de pago con Stripe
app.post('/api/pay/stripe', async (req, res) => {
    try {
        const { servicioId, fecha, barbero } = req.body;
        const servicio = SERVICIOS[servicioId];

        if (!servicio) return res.status(400).json({ error: "Servicio no válido" });

        // VALIDACIÓN DE SILLAS (Lógica Core)
        const reservasEnEsaHora = reservas.filter(r => r.fecha === fecha).length;
        if (reservasEnEsaHora >= MAX_SILLAS) {
            return res.status(400).json({ error: "No hay sillas disponibles en ese horario." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: servicio.precio * 100, // Stripe usa centavos
            currency: 'usd',
            metadata: { servicio: servicio.nombre, barbero, fecha }
        });

        // Registrar la reserva en memoria (En un caso real esto se hace al confirmar el pago)
        reservas.push({ fecha, barbero, servicioId, id: Date.now() });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Endpoint para crear pago con Mercado Pago (Latam)
app.post('/api/pay/mercadopago', async (req, res) => {
    try {
        const { servicioId, fecha, barbero } = req.body;
        const servicio = SERVICIOS[servicioId];

        if (!servicio) return res.status(400).json({ error: "Servicio no válido" });

        // VALIDACIÓN DE SILLAS
        const reservasEnEsaHora = reservas.filter(r => r.fecha === fecha).length;
        if (reservasEnEsaHora >= MAX_SILLAS) {
            return res.status(400).json({ error: "No hay sillas disponibles en ese horario." });
        }

        const preference = new Preference(clientMP);
        const result = await preference.create({
            body: {
                items: [{
                    title: servicio.nombre,
                    quantity: 1,
                    unit_price: servicio.precio,
                    currency_id: 'MXN' // O ARS, COP, etc.
                }],
                back_urls: { success: `${process.env.FRONTEND_URL}/success` }
            }
        });
        
        // Registrar la reserva temporal
        reservas.push({ fecha, barbero, servicioId, id: Date.now() });

        res.json({ init_point: result.init_point });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Iron & Anchor Backend corriendo en el puerto ${PORT}`));
