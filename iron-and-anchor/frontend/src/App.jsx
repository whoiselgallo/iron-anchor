import React, { useState } from 'react';
import axios from 'axios';
import { Scissors, Anchor, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [lead, setLead] = useState({ nombre: '', email: '' });
  const [reserva, setReserva] = useState({ servicioId: 'corte', barbero: 'Cualquiera', fecha: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const barberos = ['Cualquiera', 'Antonio G', 'Roberto R', 'Gonzalo H', 'Mariano', 'Maria A'];

  const handleBooking = async (pasarela) => {
    if (!reserva.fecha) {
      setMessage('Por favor, selecciona una fecha.');
      return;
    }
    setLoading(true);
    setMessage('');
    
    try {
      let endpoint = pasarela === 'Stripe' ? '/api/pay/stripe' : '/api/pay/mercadopago';
      
      const response = await axios.post(`${API_URL}${endpoint}`, reserva);
      
      if (pasarela === 'Stripe') {
        setMessage(`Simulando pago con Stripe. ClientSecret: ${response.data.clientSecret}`);
      } else {
        window.location.href = response.data.init_point;
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error al procesar la reserva. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-iron min-h-screen text-ivory font-sans">
      
      {/* NAVBAR */}
      <nav className="border-b border-copper/30 bg-anchor py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 text-copper font-serif font-bold text-2xl">
          <Anchor size={28} />
          <span>IRON & ANCHOR</span>
        </div>
        <a href="#reservar" className="bg-copper text-iron px-6 py-2 rounded font-bold uppercase tracking-wide hover:bg-copper/80 transition">
          Agendar
        </a>
      </nav>

      {/* HERO SECTION */}
      <header className="relative bg-anchor py-24 text-center border-b-4 border-copper flex flex-col items-center">
        <h1 className="text-6xl md:text-7xl font-serif text-copper mb-6 tracking-wider uppercase">El Refugio del<br/>Hombre Moderno</h1>
        <p className="text-xl max-w-2xl mx-auto text-ivory/80 mb-10 px-4">
          Más que un corte de cabello, es un ritual. Relájate en una de nuestras 6 sillas maestras mientras nuestros expertos forjan tu estilo.
        </p>
        <a href="#reservar" className="bg-copper text-iron font-bold py-4 px-10 rounded text-lg hover:bg-copper/80 transition uppercase tracking-widest shadow-lg shadow-copper/20 flex items-center gap-3">
          <Scissors size={20} />
          Reserva tu Silla
        </a>
      </header>

      {/* LEAD MAGNET / CLUB */}
      <section className="py-16 bg-iron text-center px-4">
        <div className="border border-copper/40 bg-anchor p-10 max-w-2xl mx-auto rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-copper"></div>
          <h2 className="text-3xl font-serif text-copper mb-3">Únete a la Hermandad</h2>
          <p className="mb-6 text-ivory/80">Regístrate y recibe un <strong>20% de descuento</strong> en tu primera visita.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="text" 
              placeholder="Tu Nombre" 
              className="p-3 bg-iron text-ivory border border-copper/50 rounded focus:border-copper outline-none w-full sm:w-64 focus:ring-1 focus:ring-copper transition" 
            />
            <input 
              type="email" 
              placeholder="Tu Correo" 
              className="p-3 bg-iron text-ivory border border-copper/50 rounded focus:border-copper outline-none w-full sm:w-64 focus:ring-1 focus:ring-copper transition" 
            />
            <button className="bg-ivory text-iron font-bold py-3 px-6 rounded hover:bg-ivory/90 transition w-full sm:w-auto">
              Reclamar
            </button>
          </div>
        </div>
      </section>

      {/* SERVICIOS Y AGENDA */}
      <section id="reservar" className="py-20 bg-anchor px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-copper mb-4">Nuestros Servicios</h2>
          <p className="text-ivory/70">Selecciona el servicio y el maestro barbero de tu preferencia.</p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          
          {/* Menú de Servicios */}
          <div className="space-y-6">
            <div 
              onClick={() => setReserva({...reserva, servicioId: 'corte'})}
              className={`p-6 border-l-4 cursor-pointer transition-all ${reserva.servicioId === 'corte' ? 'border-copper bg-copper/10' : 'border-copper/20 bg-iron hover:border-copper/50'}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-serif">Corte Clásico</h3>
                <span className="text-copper font-bold text-xl">$25.00</span>
              </div>
              <p className="text-ivory/60 mt-2 text-sm">Asesoría de imagen, corte preciso, lavado y peinado final con productos premium.</p>
            </div>

            <div 
              onClick={() => setReserva({...reserva, servicioId: 'rasurado'})}
              className={`p-6 border-l-4 cursor-pointer transition-all ${reserva.servicioId === 'rasurado' ? 'border-copper bg-copper/10' : 'border-copper/20 bg-iron hover:border-copper/50'}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-serif">Rasurado Tradicional</h3>
                <span className="text-copper font-bold text-xl">$20.00</span>
              </div>
              <p className="text-ivory/60 mt-2 text-sm">Ritual de toallas calientes, espuma templada, navaja libre y aftershave refrescante.</p>
            </div>

            <div 
              onClick={() => setReserva({...reserva, servicioId: 'combo'})}
              className={`p-6 border-l-4 cursor-pointer transition-all ${reserva.servicioId === 'combo' ? 'border-copper bg-copper/10' : 'border-copper/20 bg-iron hover:border-copper/50'}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-serif text-copper">Promo Iron & Anchor</h3>
                <span className="text-copper font-bold text-xl">$40.00</span>
              </div>
              <p className="text-ivory/60 mt-2 text-sm">La experiencia completa. Corte y rasurado al más alto nivel.</p>
            </div>
          </div>

          {/* Motor de Reservas */}
          <div className="bg-iron p-8 md:p-10 rounded-2xl border border-copper/20 shadow-2xl">
            <h3 className="text-3xl font-serif mb-8 text-copper border-b border-copper/20 pb-4">Agendar Cita</h3>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 mb-2 text-ivory/80"><User size={18}/> Barbero</label>
                <select 
                  value={reserva.barbero}
                  onChange={(e) => setReserva({...reserva, barbero: e.target.value})}
                  className="w-full p-4 bg-anchor border border-copper/30 rounded text-ivory outline-none focus:border-copper transition appearance-none"
                >
                  {barberos.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 text-ivory/80"><Calendar size={18}/> Fecha y Hora</label>
                {/* En un sistema real, aquí habría un datepicker y timepicker más avanzado */}
                <input 
                  type="date" 
                  value={reserva.fecha}
                  onChange={(e) => setReserva({...reserva, fecha: e.target.value})}
                  className="w-full p-4 bg-anchor border border-copper/30 rounded text-ivory outline-none focus:border-copper transition" 
                />
              </div>

              {message && (
                <div className={`p-4 rounded ${message.includes('Error') || message.includes('Por favor') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                  {message}
                </div>
              )}

              <div className="pt-4 grid sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleBooking('Stripe')} 
                  disabled={loading}
                  className="w-full bg-[#635BFF] hover:bg-[#5249e5] text-white py-4 rounded font-bold transition flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 size={20} /> Pagar con Stripe
                </button>
                <button 
                  onClick={() => handleBooking('MercadoPago')} 
                  disabled={loading}
                  className="w-full bg-[#009EE3] hover:bg-[#0089c4] text-white py-4 rounded font-bold transition flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 size={20} /> Mercado Pago
                </button>
              </div>
              <p className="text-center text-xs text-ivory/40 mt-4">Tus pagos están encriptados y seguros.</p>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-iron py-10 text-center border-t border-copper/20">
        <div className="flex justify-center items-center gap-2 text-copper font-serif font-bold text-xl mb-4">
          <Anchor size={24} />
          <span>IRON & ANCHOR</span>
        </div>
        <p className="text-ivory/50 text-sm">© 2026 Iron & Anchor Barbershop. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
