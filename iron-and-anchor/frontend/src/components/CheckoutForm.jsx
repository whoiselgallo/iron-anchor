import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // Para redireccionar en el futuro
      },
      redirect: 'if_required',
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#3A2214] p-8 rounded-xl border border-mostaza text-center shadow-glow-smoke">
        <h3 className="text-2xl font-serif text-mostaza uppercase tracking-widest mb-4">¡Pago Exitoso!</h3>
        <p className="text-perla mb-6">Tu reserva ha sido confirmada y el pago se ha procesado con Stripe.</p>
        <button onClick={onCancel} className="bg-perla text-marron font-bold py-3 px-8 rounded-full uppercase tracking-wider hover:bg-mostaza hover:text-marron transition-all">
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-mostaza shadow-glow-smoke text-black w-full max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-6 text-center text-marron">Finalizar Reserva Segura</h3>
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
      
      <div className="flex gap-4 mt-8">
        <button type="button" onClick={onCancel} disabled={loading} className="w-1/3 py-3 font-bold rounded-lg border-2 border-marron text-marron hover:bg-gray-100 transition-all">
          Cancelar
        </button>
        <button disabled={!stripe || loading} className="w-2/3 py-3 font-bold rounded-lg bg-marron text-perla hover:bg-mostaza hover:text-marron transition-all">
          {loading ? 'Procesando...' : 'Pagar Ahora'}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
