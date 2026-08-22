const Stripe = require('stripe');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const db = require('../config/db');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const clientMP = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

const SERVICIOS = {
    corte: { nombre: "Corte Clásico", precio: 25.00 },
    rasurado: { nombre: "Rasurado Tradicional", precio: 20.00 },
    combo: { nombre: "Promo: Iron & Anchor (Corte + Rasurado)", precio: 40.00 }
};

const MAX_SILLAS = 6;

const createStripePayment = async (req, res) => {
    try {
        const { servicioId, fecha, barbero } = req.body;
        const servicio = SERVICIOS[servicioId];

        if (!servicio) return res.status(400).json({ error: "Servicio no válido" });

        // VALIDACIÓN DE SILLAS (Neon.tech)
        const { rows } = await db.query('SELECT COUNT(*) FROM reservas WHERE fecha = $1', [fecha]);
        const reservasEnEsaHora = parseInt(rows[0].count, 10);
        
        if (reservasEnEsaHora >= MAX_SILLAS) {
            return res.status(400).json({ error: "No hay sillas disponibles en ese horario." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: servicio.precio * 100, // Stripe usa centavos
            currency: 'usd',
            metadata: { servicio: servicio.nombre, barbero, fecha }
        });

        // Registrar la reserva (Neon.tech)
        await db.query(
            'INSERT INTO reservas (fecha, barbero, servicio_id) VALUES ($1, $2, $3)', 
            [fecha, barbero, servicioId]
        );

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createMercadoPagoPayment = async (req, res) => {
    try {
        const { servicioId, fecha, barbero } = req.body;
        const servicio = SERVICIOS[servicioId];

        if (!servicio) return res.status(400).json({ error: "Servicio no válido" });

        // VALIDACIÓN DE SILLAS (Neon.tech)
        const { rows } = await db.query('SELECT COUNT(*) FROM reservas WHERE fecha = $1', [fecha]);
        const reservasEnEsaHora = parseInt(rows[0].count, 10);

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
        
        // Registrar la reserva (Neon.tech)
        await db.query(
            'INSERT INTO reservas (fecha, barbero, servicio_id) VALUES ($1, $2, $3)', 
            [fecha, barbero, servicioId]
        );

        res.json({ init_point: result.init_point });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createStripePayment,
    createMercadoPagoPayment
};
