import React, { useState } from 'react';
import axios from 'axios';
import { Scissors, Anchor, Calendar, User, CheckCircle2, Cloud, ShieldAlert, Facebook, Instagram, Phone, Mail } from 'lucide-react';
import CloudSyncModal from './components/CloudSyncModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [reserva, setReserva] = useState({ servicioId: 'signature', barbero: 'Cualquiera', fecha: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  const barberos = ['Cualquiera', 'Antonio G', 'Roberto R', 'Gonzalo H', 'Mariano', 'Maria A'];

  // Alternando con las fotos (foto1 a foto5 para los servicios)
  const servicios = [
    { id: 'signature', nombre: 'Corte de Cabello Signature', precio: '$250 MXN', tiempo: '35 min', desc: 'Definición de estilo adaptada a las facciones. Incluye lavado y peinado.', img: '/media/foto1.jpeg' },
    { id: 'ritual', nombre: 'Ritual de Barba Clásico', precio: '$200 MXN', tiempo: '30 min', desc: 'Perfilado detallado utilizando toallas calientes y navaja libre.', img: '/media/foto2.jpeg' },
    { id: 'combo', nombre: 'Combo Ejecutivo (Cabello + Barba)', precio: '$400 MXN', tiempo: '55 min', desc: 'El servicio integral definitivo para optimizar la agenda en una sola sesión.', img: '/media/foto5.jpeg' },
    { id: 'tattoo', nombre: 'Diseño de Líneas y Hair Tattoo', precio: '$150 / $280 MXN', tiempo: '25 min', desc: 'Creación de líneas nítidas o diseños geométricos personalizados.', img: '/media/foto4.jpeg' },
    { id: 'express', nombre: 'Servicio Express de Mantenimiento', precio: '$120 MXN', tiempo: '15 min', desc: 'Limpieza ágil de contornos, cuello y patillas para mantener tu apariencia fresca.', img: '/media/foto3.jpeg' },
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
    <div className="bg-rosapalo min-h-screen text-textdark font-sans">
      <CloudSyncModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* NAVBAR */}
      <nav className="border-b-4 border-terracota bg-marron py-4 px-8 flex justify-between items-center sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3 text-textlight font-serif text-2xl tracking-widest uppercase">
          <Anchor size={28} className="text-terracota" />
          <span>IRON & ANCHOR</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-textlight/80 hover:text-naranjaviejo font-bold transition text-sm">
            <Cloud size={18} /> Cloud Sync
          </button>
          <a href="#reservar" className="bg-naranjaviejo text-textlight px-6 py-2 rounded-sm font-bold uppercase tracking-widest hover:bg-opacity-80 transition shadow-lg">
            Agendar
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative bg-marron py-32 text-center border-b-8 border-terracota flex flex-col items-center overflow-hidden">
        
        {/* Video Background */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-75">
          <source src="/media/Barber_styling_client_hair_202608232038.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-marron/50 to-marron/80"></div>

        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl font-serif text-rosapalo mb-4 tracking-[0.1em] uppercase drop-shadow-2xl">
            Iron & Anchor
          </h1>
          <p className="text-2xl md:text-3xl text-terracota font-bold tracking-widest uppercase mb-10">
            Estilo • Precisión • Rapidez
          </p>
          <p className="text-lg max-w-3xl mx-auto text-textlight/90 mb-12 px-4 font-medium leading-relaxed drop-shadow-md">
            El Refugio del Hombre Moderno en Mexicali. Más que un corte de cabello, es un ritual. Relájate en una de nuestras 6 sillas maestras mientras nuestros expertos forjan tu estilo.
          </p>
          <a href="#reservar" className="inline-flex items-center gap-3 bg-naranjaviejo text-textlight font-bold py-5 px-12 rounded-sm text-xl hover:bg-opacity-80 transition uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(217,119,54,0.6)]">
            <Scissors size={24} />
            Agendar Cita
          </a>
        </div>
      </header>

      {/* SERVICIOS Y AGENDA */}
      <section id="reservar" className="py-24 bg-rosapalo px-4 relative overflow-hidden">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif text-marron mb-4 tracking-widest uppercase">Menú de Especialidades</h2>
          <div className="h-1 w-24 bg-terracota mx-auto mb-6"></div>
          <p className="text-marron/70 font-medium">Selecciona tu servicio y optimiza tu tiempo en la silla.</p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Menú de Servicios (GRID con Fotos) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {servicios.map((s, idx) => (
              <div 
                key={s.id}
                onClick={() => setReserva({...reserva, servicioId: s.id})}
                className={`flex flex-col md:flex-row overflow-hidden rounded-lg cursor-pointer transition-all shadow-md bg-white border-2 ${reserva.servicioId === s.id ? 'border-naranjaviejo scale-[1.02] shadow-xl' : 'border-transparent hover:border-terracota'}`}
              >
                {/* Alternando foto a la izquierda o derecha */}
                {idx % 2 === 0 ? (
                  <>
                    <div className="md:w-2/5 h-48 md:h-auto">
                      <img src={s.img} alt={s.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 md:w-3/5 flex flex-col justify-center">
                      <h3 className={`text-xl font-serif tracking-wide uppercase ${reserva.servicioId === s.id ? 'text-naranjaviejo' : 'text-marron'}`}>{s.nombre}</h3>
                      <div className="flex items-center gap-3 mt-2 mb-3 text-sm font-bold">
                        <span className="text-terracota">{s.precio}</span>
                        <span className="text-marron/50">| {s.tiempo}</span>
                      </div>
                      <p className="text-textdark/70 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6 md:w-3/5 flex flex-col justify-center">
                      <h3 className={`text-xl font-serif tracking-wide uppercase ${reserva.servicioId === s.id ? 'text-naranjaviejo' : 'text-marron'}`}>{s.nombre}</h3>
                      <div className="flex items-center gap-3 mt-2 mb-3 text-sm font-bold">
                        <span className="text-terracota">{s.precio}</span>
                        <span className="text-marron/50">| {s.tiempo}</span>
                      </div>
                      <p className="text-textdark/70 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="md:w-2/5 h-48 md:h-auto">
                      <img src={s.img} alt={s.nombre} className="w-full h-full object-cover" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Motor de Reservas y Filtro Anti-Tóxicos */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-marron p-8 rounded-lg border-t-8 border-terracota shadow-2xl relative text-textlight">
              <h3 className="text-2xl font-serif mb-6 text-rosapalo tracking-widest uppercase">Confirmar Operación</h3>
              
              <div className="space-y-5 relative z-10">
                <div>
                  <label className="flex items-center gap-2 mb-2 text-textlight/80 font-bold text-sm uppercase tracking-wide"><User size={16}/> Asignar Barbero</label>
                  <select 
                    value={reserva.barbero}
                    onChange={(e) => setReserva({...reserva, barbero: e.target.value})}
                    className="w-full p-4 bg-rosapalo border-2 border-terracota/50 text-marron outline-none focus:border-naranjaviejo transition appearance-none font-bold"
                  >
                    {barberos.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 text-textlight/80 font-bold text-sm uppercase tracking-wide"><Calendar size={16}/> Ventana de Tiempo</label>
                  <input 
                    type="datetime-local" 
                    value={reserva.fecha}
                    onChange={(e) => setReserva({...reserva, fecha: e.target.value})}
                    className="w-full p-4 bg-rosapalo border-2 border-terracota/50 text-marron outline-none focus:border-naranjaviejo transition font-bold" 
                  />
                </div>

                {/* Filtro de Audiencia */}
                <div className="mt-6 p-4 bg-rosapalo/10 border border-terracota/30 flex gap-3 rounded">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={terminosAceptados}
                    onChange={(e) => setTerminosAceptados(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-naranjaviejo cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-sm text-textlight/90 cursor-pointer leading-tight font-medium">
                    He leído y acepto obligatoriamente las políticas de puntualidad y cancelación estipuladas.
                  </label>
                </div>

                {message && (
                  <div className={`p-4 font-bold text-sm rounded ${message.includes('Error') || message.includes('Por favor') ? 'bg-red-900/80 text-red-100 border-l-4 border-red-500' : 'bg-green-900/80 text-green-100 border-l-4 border-green-500'}`}>
                    {message}
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    onClick={handleBooking} 
                    disabled={loading || !terminosAceptados}
                    className="w-full bg-naranjaviejo disabled:bg-gray-600 disabled:text-gray-300 hover:bg-opacity-90 text-textlight py-4 font-serif text-xl tracking-widest uppercase transition flex justify-center items-center gap-2 rounded shadow-lg"
                  >
                    <CheckCircle2 size={24} /> Asegurar Silla
                  </button>
                </div>
              </div>
            </div>

            {/* Módulo Legal / Políticas sobre la imagen agenda */}
            <div className="relative rounded-lg overflow-hidden border-2 border-terracota shadow-lg p-6">
              <div className="absolute inset-0 bg-[url('/media/agenda.jpeg')] bg-cover bg-center"></div>
              {/* Difuminación sutil */}
              <div className="absolute inset-0 bg-marron/60 backdrop-blur-[4px]"></div>
              
              <div className="relative z-10 text-textlight">
                <h4 className="flex items-center gap-2 text-naranjaviejo font-serif tracking-wider text-lg mb-4">
                  <ShieldAlert size={20} /> Políticas de Agenda
                </h4>
                <ul className="text-sm text-textlight/90 space-y-3 font-medium">
                  <li><strong className="text-terracota">Confirmación 3H:</strong> Es mandatorio confirmar asistencia con 3 horas de anticipación o se da de baja.</li>
                  <li><strong className="text-terracota">Tolerancia:</strong> Máximo 10 minutos de retraso. Al minuto 11 se cancela la sesión.</li>
                  <li><strong className="text-terracota">Reagendado:</strong> Hasta 4 horas antes de tu servicio.</li>
                  <li><strong className="text-terracota">Penalización:</strong> Dos faltas (no-shows) resultarán en bloqueo del ID.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-marron py-16 border-t-8 border-terracota overflow-hidden">
        {/* Footer Background Video */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-85">
          <source src="/media/barber4.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-marron/70 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 text-textlight font-serif text-3xl tracking-widest uppercase mb-4">
              <Anchor size={36} className="text-naranjaviejo" />
              <span>IRON & ANCHOR</span>
            </div>
            <p className="text-textlight/70 font-medium mb-6 text-center md:text-left max-w-sm">
              Estructura y Precisión. Elevando el estándar de la barbería clásica en Mexicali.
            </p>
            <p className="text-textlight/40 text-xs font-bold tracking-wide">
              © 2026 Iron & Anchor Barbershop Mexicali.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4 text-textlight">
            <h4 className="font-serif text-xl tracking-widest text-terracota uppercase mb-2">Contacto</h4>
            
            <a href="tel:+521234567890" className="flex items-center gap-2 hover:text-naranjaviejo transition font-bold">
              <Phone size={18} /> +52 123 456 7890
            </a>
            
            <a href="mailto:agenda@iron&anchore.com" className="flex items-center gap-2 hover:text-naranjaviejo transition font-bold">
              <Mail size={18} /> agenda@iron&anchore.com
            </a>

            <div className="flex gap-4 mt-4">
              <a href="#" className="bg-terracota p-3 rounded-full hover:bg-naranjaviejo transition shadow-lg">
                <Facebook size={20} className="text-white" />
              </a>
              <a href="#" className="bg-terracota p-3 rounded-full hover:bg-naranjaviejo transition shadow-lg">
                <Instagram size={20} className="text-white" />
              </a>
              <a href="#" className="bg-terracota p-3 rounded-full hover:bg-naranjaviejo transition shadow-lg">
                {/* SVG for TikTok since Lucide doesn't have it by default usually */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
              <a href="#" className="bg-terracota p-3 rounded-full hover:bg-naranjaviejo transition shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default App;
