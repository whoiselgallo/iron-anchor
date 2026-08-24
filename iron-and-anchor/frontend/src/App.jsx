import React, { useState } from 'react';
import axios from 'axios';
import { Scissors, Anchor, Calendar, User, CheckCircle2, Cloud, ShieldAlert } from 'lucide-react';
import CloudSyncModal from './components/CloudSyncModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [reserva, setReserva] = useState({ servicioId: 'signature', barbero: 'Cualquiera', fecha: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  const barberos = ['Cualquiera', 'Antonio G', 'Roberto R', 'Gonzalo H', 'Mariano', 'Maria A'];

  const servicios = [
    { id: 'signature', nombre: 'Corte de Cabello Signature', precio: '$250 MXN', tiempo: '35 minutos', desc: 'Definición de estilo adaptada a las facciones. Incluye asesoramiento de imagen, lavado premium y peinado.' },
    { id: 'ritual', nombre: 'Ritual de Barba Clásico', precio: '$200 MXN', tiempo: '30 minutos', desc: 'Perfilado detallado utilizando toallas calientes, aceites hidratantes y navaja libre. Escultura de líneas con exactitud tradicional.' },
    { id: 'combo', nombre: 'Combo Ejecutivo (Cabello + Barba)', precio: '$400 MXN', tiempo: '55 minutos', desc: 'El servicio integral definitivo para optimizar la agenda en una sola sesión eficiente.' },
    { id: 'tattoo', nombre: 'Diseño de Líneas y Hair Tattoo', precio: '$150 / $280 MXN', tiempo: '25 minutos', desc: 'Creación de líneas nítidas, grecas o diseños geométricos personalizados ejecutados con pulcritud matemática.' },
    { id: 'express', nombre: 'Servicio Express de Mantenimiento', precio: '$120 MXN', tiempo: '15 minutos', desc: 'Limpieza ágil de contornos, cuello y patillas para mantener una apariencia fresca entre cortes principales.' },
  ];

  const handleBooking = async () => {
    if (!reserva.fecha) {
      setMessage('Por favor, selecciona una fecha y hora.');
      return;
    }
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/api/pay/stripe`, reserva);
      setMessage(`Redirigiendo a pasarela Stripe segura... (Simulado. ClientSecret: ${response.data.clientSecret})`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error al procesar la reserva. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-iron min-h-screen text-ivory font-sans">
      <CloudSyncModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* NAVBAR */}
      <nav className="border-b-2 border-copper bg-anchor py-4 px-8 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3 text-ivory font-serif text-2xl tracking-widest uppercase">
          <Anchor size={28} className="text-copper" />
          <span>IRON & ANCHOR</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-ivory/60 hover:text-yellowcta font-bold transition text-sm">
            <Cloud size={18} /> Cloud Sync
          </button>
          <a href="#reservar" className="bg-yellowcta text-anchor px-6 py-2 rounded-sm font-bold uppercase tracking-widest hover:bg-yellow-500 transition shadow-lg shadow-yellowcta/20">
            Agendar
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative bg-anchor py-32 text-center border-b-4 border-copper flex flex-col items-center overflow-hidden">
        {/* Placeholder para Video Loop de IA */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-anchor/80 to-anchor"></div>

        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl font-serif text-ivory mb-4 tracking-[0.1em] uppercase drop-shadow-2xl">
            Iron & Anchor
          </h1>
          <p className="text-2xl md:text-3xl text-copper font-bold tracking-widest uppercase mb-10">
            Estilo • Precisión • Rapidez
          </p>
          <p className="text-lg max-w-3xl mx-auto text-ivory/80 mb-12 px-4 font-medium leading-relaxed">
            El Refugio del Hombre Moderno en Mexicali. Más que un corte de cabello, es un ritual. Relájate en una de nuestras 6 sillas maestras mientras nuestros expertos forjan tu estilo.
          </p>
          <a href="#reservar" className="inline-flex items-center gap-3 bg-yellowcta text-anchor font-bold py-5 px-12 rounded-sm text-xl hover:bg-yellow-500 transition uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,193,7,0.3)]">
            <Scissors size={24} />
            Agendar Cita
          </a>
        </div>
      </header>

      {/* SERVICIOS Y AGENDA */}
      <section id="reservar" className="py-24 bg-iron px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-ivory mb-4 tracking-widest uppercase">Menú de Especialidades</h2>
          <div className="h-1 w-24 bg-copper mx-auto mb-6"></div>
          <p className="text-ivory/70 font-medium">Selecciona tu servicio y optimiza tu tiempo en la silla.</p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
          
          {/* Menú de Servicios (GRID) */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 h-fit">
            {servicios.map((s) => (
              <div 
                key={s.id}
                onClick={() => setReserva({...reserva, servicioId: s.id})}
                className={`p-6 border-l-4 cursor-pointer transition-all ${reserva.servicioId === s.id ? 'border-yellowcta bg-anchor shadow-lg' : 'border-copper/30 bg-anchor/50 hover:border-copper hover:bg-anchor/80'}`}
              >
                <div className="flex flex-col mb-3">
                  <h3 className={`text-xl font-serif tracking-wide uppercase ${reserva.servicioId === s.id ? 'text-yellowcta' : 'text-ivory'}`}>{s.nombre}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="bg-copper/20 text-copper px-2 py-1 rounded font-bold">{s.precio}</span>
                    <span className="text-ivory/50 font-medium">{s.tiempo}</span>
                  </div>
                </div>
                <p className="text-ivory/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Motor de Reservas y Filtro Anti-Tóxicos */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-anchor p-8 border-t-4 border-copper shadow-2xl">
              <h3 className="text-2xl font-serif mb-6 text-ivory tracking-widest uppercase">Confirmar Operación</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 mb-2 text-ivory/80 font-bold text-sm uppercase tracking-wide"><User size={16}/> Asignar Barbero</label>
                  <select 
                    value={reserva.barbero}
                    onChange={(e) => setReserva({...reserva, barbero: e.target.value})}
                    className="w-full p-4 bg-iron border-2 border-copper/30 text-ivory outline-none focus:border-yellowcta transition appearance-none font-medium"
                  >
                    {barberos.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 text-ivory/80 font-bold text-sm uppercase tracking-wide"><Calendar size={16}/> Ventana de Tiempo</label>
                  <input 
                    type="datetime-local" 
                    value={reserva.fecha}
                    onChange={(e) => setReserva({...reserva, fecha: e.target.value})}
                    className="w-full p-4 bg-iron border-2 border-copper/30 text-ivory outline-none focus:border-yellowcta transition font-medium" 
                  />
                </div>

                {/* Filtro de Audiencia (Checkbox) */}
                <div className="mt-6 p-4 bg-iron/50 border border-copper/20 flex gap-3">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={terminosAceptados}
                    onChange={(e) => setTerminosAceptados(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-yellowcta cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-sm text-ivory/70 cursor-pointer leading-tight">
                    He leído y acepto obligatoriamente las políticas de puntualidad y cancelación estipuladas.
                  </label>
                </div>

                {message && (
                  <div className={`p-4 font-medium text-sm ${message.includes('Error') || message.includes('Por favor') ? 'bg-red-900/50 text-red-200 border-l-4 border-red-500' : 'bg-green-900/50 text-green-200 border-l-4 border-green-500'}`}>
                    {message}
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    onClick={handleBooking} 
                    disabled={loading || !terminosAceptados}
                    className="w-full bg-yellowcta disabled:bg-gray-600 disabled:text-gray-400 hover:bg-yellow-500 text-anchor py-4 font-serif text-xl tracking-widest uppercase transition flex justify-center items-center gap-2"
                  >
                    <CheckCircle2 size={24} /> Asegurar Silla
                  </button>
                </div>
              </div>
            </div>

            {/* Módulo Legal / Políticas */}
            <div className="bg-iron p-6 border border-copper/20">
              <h4 className="flex items-center gap-2 text-copper font-bold uppercase tracking-wider text-sm mb-4">
                <ShieldAlert size={18} /> Políticas de Agenda Estricta
              </h4>
              <ul className="text-xs text-ivory/60 space-y-3 font-medium">
                <li><strong className="text-ivory/90">Confirmación 3H:</strong> Recibirás un mensaje automatizado. Es mandatorio confirmar asistencia con 3 horas de anticipación. Sin respuesta, la cita se da de baja.</li>
                <li><strong className="text-ivory/90">Tolerancia Máxima:</strong> 10 minutos de retraso. Al minuto 11, la sesión se cancela automáticamente.</li>
                <li><strong className="text-ivory/90">Reagendado:</strong> Ventana abierta hasta 4 horas antes de tu servicio.</li>
                <li><strong className="text-ivory/90">Penalización:</strong> Dos faltas (no-shows) resultarán en el bloqueo permanente de tu ID en este sistema.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-anchor py-12 text-center border-t-4 border-copper">
        <div className="flex justify-center items-center gap-3 text-ivory font-serif text-2xl tracking-widest uppercase mb-4">
          <Anchor size={28} className="text-copper" />
          <span>IRON & ANCHOR</span>
        </div>
        <p className="text-ivory/40 text-sm font-medium tracking-wide">© 2026 Iron & Anchor Barbershop Mexicali. Estructura y Precisión.</p>
      </footer>
    </div>
  );
}

export default App;
