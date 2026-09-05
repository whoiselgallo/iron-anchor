import React, { useState } from 'react';
import axios from 'axios';
import { Scissors, Anchor, Calendar as CalendarIcon, User, CheckCircle2, Cloud, ShieldAlert, Phone, Mail, CreditCard, Bell, Star, Download } from 'lucide-react';
import CloudSyncModal from '../components/CloudSyncModal';
import CheckoutForm from '../components/CheckoutForm';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const stripePromise = loadStripe('pk_test_tu_llave_publica_de_stripe');

function Landing() {
  const [reserva, setReserva] = useState({ servicioId: 'signature', barbero: 'Cualquiera', fecha: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  // Fechas individuales para la agenda de cada barbero
  const [fechasBarberos, setFechasBarberos] = useState({});

  const barberos = ['Cualquiera', 'Luis Mendoza', 'Javier Espinoza', 'Omar Ortiz', 'Mateo Ríos', 'Nicole Ponce', 'Alan Castro'];

  const servicios = [
    { id: 'signature', nombre: 'Corte de Cabello Signature', precio: '$250 MXN', tiempo: '35 min', desc: 'Definición de estilo adaptada a las facciones. Incluye lavado y peinado.', img: '/media/corte_cabello.jpeg' },
    { id: 'ritual', nombre: 'Ritual de Barba Clásico', precio: '$200 MXN', tiempo: '30 min', desc: 'Perfilado detallado utilizando toallas calientes y navaja libre.', img: '/media/ritual_barba.jpeg' },
    { id: 'combo', nombre: 'Combo Ejecutivo (Cabello + Barba)', precio: '$400 MXN', tiempo: '55 min', desc: 'El servicio integral definitivo para optimizar la agenda en una sola sesión.', img: '/media/combo_ejecutivo.jpeg' },
    { id: 'tattoo', nombre: 'Diseño de Líneas y Hair Tattoo', precio: '$150 / $280 MXN', tiempo: '25 min', desc: 'Creación de líneas nítidas o diseños geométricos personalizados.', img: '/media/hair_tattoo.jpeg' },
    { id: 'express', nombre: 'Servicio Express de Mantenimiento', precio: '$120 MXN', tiempo: '15 min', desc: 'Limpieza ágil de contornos, cuello y patillas para mantener tu apariencia fresca.', img: '/media/servicio_express.jpeg' },
  ];

  const maestros = [
    {
      id: 'luis', selectName: 'Luis Mendoza', nombre: 'Luis "Mano de Hierro"',
      experiencia: '8 años de exp.', especialidad: 'Desvanecidos complejos y texturizados',
      resena: 'Reconocido por su pulcritud matemática. Ejecuta degradados perfectos en tiempo récord, asegurando un estilo nítido por semanas.', img: '/media/luis.jpeg',
      rating: 4.9, vcard: 'https://rosevcard.com/vcf/luis-mendoza.vcf'
    },
    {
      id: 'javier', selectName: 'Javier Espinoza', nombre: 'Javier "Ancla"',
      experiencia: '10 años de exp.', especialidad: 'Ritual Clásico y afeitado tradicional',
      resena: 'Maestro de la vieja escuela. Convierte el cuidado de la barba en una experiencia premium. Precisión aclamada por los empresarios.', img: '/media/javier.jpeg',
      rating: 5.0, vcard: 'https://rosevcard.com/vcf/javier-espinoza.vcf'
    },
    {
      id: 'omar', selectName: 'Omar Ortiz', nombre: 'Omar "Line"',
      experiencia: '6 años de exp.', especialidad: 'Diseños urbanos y Hair Tattoo',
      resena: 'Destreza artística excepcional para trazar líneas ultra nítidas. Cada corte es una obra de arte simétrica.', img: '/media/omar.jpeg',
      rating: 4.8, vcard: 'https://rosevcard.com/vcf/omar-ortiz.vcf'
    },
    {
      id: 'mateo', selectName: 'Mateo Ríos', nombre: 'Mateo "Express"',
      experiencia: '5 años de exp.', especialidad: 'Limpieza de contornos y ejecutivos',
      resena: 'Preferido por clientes con agendas saturadas por su agilidad. Limpieza de pulcritud absoluta en 15 minutos.', img: '/media/mateo.jpeg',
      rating: 4.9, vcard: 'https://rosevcard.com/vcf/mateo-rios.vcf'
    },
    {
      id: 'nicole', selectName: 'Nicole Ponce', nombre: 'Nicole "Experiencia"',
      experiencia: '11 años de exp.', especialidad: 'Cortes clásicos y asesoría de imagen',
      resena: 'Destaca por su detallado diagnóstico de visagismo, adaptando las tendencias a tus facciones con técnica impecable.', img: '/media/nicole.jpeg',
      rating: 5.0, vcard: 'https://rosevcard.com/vcf/nicole-ponce.vcf'
    },
    {
      id: 'alan', selectName: 'Alan Castro', nombre: 'Alan "Precision"',
      experiencia: '7 años de exp.', especialidad: 'Combo Ejecutivo (Cabello + Barba)',
      resena: 'Experto en servicio integral. Coordina de forma fluida el lavado, corte y perfilado en 55 minutos.', img: '/media/alan.jpeg',
      rating: 4.9, vcard: 'https://rosevcard.com/vcf/alan-castro.vcf'
    }
  ];

  const handleBooking = async () => {
    if (!reserva.fecha) {
      setMessage('Por favor, selecciona una fecha y hora.'); return;
    }
    setLoading(true); setMessage('');
    try {
      const response = await axios.post(`${API_URL}/api/pay/stripe`, reserva);
      setClientSecret(response.data.clientSecret);
      setMessage('✅ Reserva procesada. Finaliza tu pago a continuación.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error al procesar la reserva. Intenta de nuevo.');
    } finally { setLoading(false); }
  };

  const solicitarNotificacion = (barbero) => {
    alert(`Notificaciones Push activadas para turnos de ${barbero}. (Requiere integración Service Worker en Backend)`);
  };

  return (
    <div className="bg-marron min-h-screen text-perla font-sans scroll-smooth">
      <CloudSyncModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* NAVBAR */}
      <nav className="border-b-4 border-mostaza bg-marron py-4 px-8 flex justify-between items-center sticky top-0 z-40 shadow-2xl">
        <div className="flex items-center gap-3 text-perla font-serif text-2xl tracking-widest uppercase">
          <Anchor size={28} className="text-mostaza" />
          <span>IRON & ANCHOR</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-mostaza hover:text-perla font-bold tracking-widest uppercase transition text-sm">Dashboard</Link>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-perla/80 hover:text-mostaza font-bold transition text-sm">
            <Cloud size={18} /> Cloud Sync
          </button>
          <a href="#reservar" className="bg-perla text-marron px-6 py-2 rounded-sm font-bold uppercase tracking-widest hover:bg-mostaza hover:text-marron transition shadow-[0_0_15px_rgba(248,246,240,0.5)]">
            Agendar
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative bg-marron py-32 text-center border-b-8 border-mostaza flex flex-col items-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
          <source src="/media/barber3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-marron/60 to-marron/95"></div>

        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl font-serif text-perla mb-4 tracking-[0.1em] uppercase drop-shadow-2xl">
            Iron & Anchor
          </h1>
          <p className="text-2xl md:text-3xl text-mostaza font-bold tracking-widest uppercase mb-10">
            Estilo • Precisión • Rapidez
          </p>
          <p className="text-lg max-w-3xl mx-auto text-perla/90 mb-12 px-4 font-medium leading-relaxed drop-shadow-md">
            El Refugio del Hombre Moderno en Mexicali. Más que un corte de cabello, es un ritual. Relájate en una de nuestras sillas maestras mientras nuestros expertos forjan tu estilo.
          </p>
          <a href="#reservar" className="inline-flex items-center gap-3 bg-perla text-marron font-bold py-5 px-12 rounded-sm text-xl hover:bg-mostaza transition uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(248,246,240,0.4)]">
            <Scissors size={24} /> Agendar Cita
          </a>
        </div>
      </header>

      {/* SECCIÓN EQUIPO: TARJETAS MAGNÉTICAS */}
      <section id="equipo" className="py-24 bg-marron px-4 relative overflow-hidden border-b-8 border-mostaza">
        <div className="absolute inset-0 opacity-5 bg-[url('/media/foto0.jpeg')] bg-cover bg-center mix-blend-overlay"></div>

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif text-perla mb-4 tracking-widest uppercase">Conoce a Nuestro Equipo</h2>
          <div className="h-1 w-24 bg-mostaza mx-auto mb-6"></div>
          <p className="text-perla/70 font-medium max-w-2xl mx-auto">Selecciona tu barbero, visualiza su disponibilidad y concreta el pago de tu silla.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
          {maestros.map((m) => (
            <div key={m.id} className="group relative">
              {/* Contenedor Magnético */}
              <div className="bg-[#3A2214] p-6 rounded-xl shadow-glow-smoke flex flex-col border border-marron group-hover:border-mostaza transform transition-all duration-500 hover:-translate-y-3 hover:shadow-glow-smoke h-full">
                
                <h3 className="text-2xl font-serif text-mostaza tracking-widest uppercase mb-4 text-center leading-tight">{m.nombre}</h3>
                
                <div className="relative mb-6 mx-auto w-40 h-40 rounded-full">
                  <div className="absolute inset-0 bg-mostaza rounded-full blur-xl opacity-0 group-hover:opacity-60 transition duration-500 transform scale-110"></div>
                  <img src={m.img} alt={m.nombre} className="relative w-full h-full object-cover rounded-full border-4 border-mostaza shadow-xl z-10 bg-marron" />
                </div>

                {/* BARRA DE RESEÑA */}
                <div className="flex justify-center items-center gap-1 mb-4 text-mostaza">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(m.rating) ? "currentColor" : "transparent"} strokeWidth={2} />
                  ))}
                  <span className="text-perla font-bold ml-2 text-sm">{m.rating.toFixed(1)}/5.0</span>
                </div>
                
                <div className="flex-1 text-center flex flex-col">
                  <p className="text-perla font-bold text-sm mb-1 uppercase tracking-wider">{m.experiencia}</p>
                  <p className="text-mostaza font-bold text-sm mb-4 px-2 leading-tight border-b border-mostaza/30 pb-4">{m.especialidad}</p>
                  <p className="text-perla/80 text-sm mb-6 leading-relaxed italic">"{m.resena}"</p>
                </div>

                {/* Agenda y Pagos Integrados */}
                <div className="bg-marron rounded-lg p-4 mt-auto border border-marron">
                  <h4 className="text-sm font-bold text-mostaza uppercase mb-3 flex justify-center items-center gap-2"><CalendarIcon size={16}/> Disponibilidad</h4>
                  
                  <input 
                    type="datetime-local" 
                    className="w-full p-3 bg-[#2A1A0F] border border-mostaza/30 text-perla rounded mb-3 text-sm focus:border-mostaza outline-none"
                    onChange={(e) => setFechasBarberos({...fechasBarberos, [m.id]: e.target.value})}
                  />

                  <div className="flex flex-col gap-2">
                    <button onClick={() => solicitarNotificacion(m.selectName)} className="w-full border border-perla/30 text-perla/80 hover:bg-perla/10 font-bold py-2 rounded text-xs uppercase transition flex justify-center items-center gap-2">
                      <Bell size={14} /> Alertas Push
                    </button>
                    <button onClick={() => alert(`Conectando pasarela dividida para pago a silla de ${m.selectName}...`)} className="w-full bg-perla text-marron hover:bg-mostaza hover:text-marron font-bold py-3 rounded text-sm uppercase tracking-wider transition shadow-[0_0_10px_rgba(248,246,240,0.3)] flex justify-center items-center gap-2 mt-2">
                      <CreditCard size={16} /> Pagar Silla
                    </button>
                    <a href={m.vcard} target="_blank" rel="noopener noreferrer" className="w-full mt-2 bg-transparent border-2 border-mostaza text-mostaza hover:bg-mostaza hover:text-marron font-bold py-2 rounded text-xs uppercase tracking-wider transition flex justify-center items-center gap-2">
                      <Download size={14} /> ROSE vCard
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MENÚ GENERAL */}
      <section id="reservar" className="py-24 bg-[#3A2214] px-4 relative overflow-hidden">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif text-perla mb-4 tracking-widest uppercase">Menú de Especialidades</h2>
          <div className="h-1 w-24 bg-mostaza mx-auto mb-6"></div>
          <p className="text-perla/70 font-medium">Selecciona tu servicio y optimiza tu tiempo en la silla.</p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-6">
            {servicios.map((s, idx) => (
              <div key={s.id} onClick={() => setReserva({...reserva, servicioId: s.id})} className={`flex flex-col md:flex-row overflow-hidden rounded-lg cursor-pointer transition-all shadow-glow-smoke bg-marron border-2 ${reserva.servicioId === s.id ? 'border-mostaza scale-[1.02]' : 'border-transparent hover:border-mostaza/50'}`}>
                {idx % 2 === 0 ? (
                  <><div className="md:w-2/5 h-48 md:h-auto"><img src={s.img} alt={s.nombre} className="w-full h-full object-cover" /></div>
                    <div className="p-6 md:w-3/5 flex flex-col justify-center">
                      <h3 className={`text-xl font-serif tracking-wide uppercase ${reserva.servicioId === s.id ? 'text-mostaza' : 'text-perla'}`}>{s.nombre}</h3>
                      <div className="flex items-center gap-3 mt-2 mb-3 text-sm font-bold"><span className="text-perla">{s.precio}</span><span className="text-mostaza">| {s.tiempo}</span></div>
                      <p className="text-perla/70 text-sm leading-relaxed">{s.desc}</p>
                    </div></>
                ) : (
                  <><div className="p-6 md:w-3/5 flex flex-col justify-center">
                      <h3 className={`text-xl font-serif tracking-wide uppercase ${reserva.servicioId === s.id ? 'text-mostaza' : 'text-perla'}`}>{s.nombre}</h3>
                      <div className="flex items-center gap-3 mt-2 mb-3 text-sm font-bold"><span className="text-perla">{s.precio}</span><span className="text-mostaza">| {s.tiempo}</span></div>
                      <p className="text-perla/70 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="md:w-2/5 h-48 md:h-auto"><img src={s.img} alt={s.nombre} className="w-full h-full object-cover" /></div></>
                )}
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-marron p-8 rounded-lg border-t-8 border-mostaza shadow-glow-smoke relative text-perla">
              <h3 className="text-2xl font-serif mb-6 text-mostaza tracking-widest uppercase">Reserva General</h3>
              <div className="space-y-5 relative z-10">
                <div>
                  <label className="flex items-center gap-2 mb-2 text-perla/80 font-bold text-sm uppercase tracking-wide"><User size={16}/> Asignar Barbero</label>
                  <select value={reserva.barbero} onChange={(e) => setReserva({...reserva, barbero: e.target.value})} className="w-full p-4 bg-[#2A1A0F] border-2 border-mostaza/50 text-perla outline-none focus:border-mostaza transition appearance-none font-bold">
                    {barberos.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 mb-2 text-perla/80 font-bold text-sm uppercase tracking-wide"><CalendarIcon size={16}/> Ventana de Tiempo</label>
                  <input type="datetime-local" value={reserva.fecha} onChange={(e) => setReserva({...reserva, fecha: e.target.value})} className="w-full p-4 bg-[#2A1A0F] border-2 border-mostaza/50 text-perla outline-none focus:border-mostaza transition font-bold" />
                </div>
                <div className="mt-6 p-4 bg-[#2A1A0F] border border-mostaza/30 flex gap-3 rounded">
                  <input type="checkbox" id="terms" checked={terminosAceptados} onChange={(e) => setTerminosAceptados(e.target.checked)} className="mt-1 w-5 h-5 accent-mostaza cursor-pointer flex-shrink-0" />
                  <label htmlFor="terms" className="text-sm text-perla/90 cursor-pointer leading-tight font-medium">He leído y acepto obligatoriamente las políticas de puntualidad y cancelación estipuladas.</label>
                </div>
                {message && (<div className={`p-4 font-bold text-sm rounded ${message.includes('Error') || message.includes('Por favor') ? 'bg-red-900/80 text-red-100 border-l-4 border-red-500' : 'bg-green-900/80 text-green-100 border-l-4 border-green-500'}`}>{message}</div>)}
                <div className="pt-2">
                  {clientSecret ? (
                    <div className="mt-4">
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#E1AD01', colorBackground: '#3A2214', colorText: '#F8F6F0' } } }}>
                        <CheckoutForm clientSecret={clientSecret} onCancel={() => setClientSecret('')} />
                      </Elements>
                    </div>
                  ) : (
                    <button onClick={handleBooking} disabled={loading || !terminosAceptados} className="w-full bg-perla disabled:bg-gray-600 disabled:text-gray-400 text-marron hover:bg-mostaza py-4 font-serif text-xl tracking-widest uppercase transition flex justify-center items-center gap-2 rounded shadow-[0_0_15px_rgba(248,246,240,0.3)]">
                      <CheckCircle2 size={24} /> {loading ? 'Cargando Pasarela...' : 'Asegurar Silla'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden border-2 border-mostaza shadow-glow-smoke p-6 min-h-[300px] flex items-center">
              <div className="absolute inset-0 bg-[url('/media/agenda.jpeg')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-marron/70 backdrop-blur-[6px]"></div>
              <div className="relative z-10 text-perla w-full">
                <h4 className="flex items-center gap-2 text-mostaza font-serif tracking-wider text-lg mb-4"><ShieldAlert size={20} /> Políticas de Agenda</h4>
                <ul className="text-sm text-perla/90 space-y-3 font-medium">
                  <li><strong className="text-mostaza">Confirmación 3H:</strong> Mandatorio confirmar 3 horas antes.</li>
                  <li><strong className="text-mostaza">Tolerancia:</strong> Máximo 10 minutos de retraso.</li>
                  <li><strong className="text-mostaza">Reagendado:</strong> Hasta 4 horas antes.</li>
                  <li><strong className="text-mostaza">Penalización:</strong> Dos faltas resultarán en bloqueo del ID.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-marron py-16 border-t-8 border-mostaza overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-85">
          <source src="/media/barber4.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-marron/80 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 text-perla font-serif text-3xl tracking-widest uppercase mb-4">
              <Anchor size={36} className="text-mostaza" />
              <span>IRON & ANCHOR</span>
            </div>
            <p className="text-perla/70 font-medium mb-6 text-center md:text-left max-w-sm">
              Estructura y Precisión. Elevando el estándar de la barbería clásica en Mexicali.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4 text-perla">
            <h4 className="font-serif text-xl tracking-widest text-mostaza uppercase mb-2">Contacto</h4>
            <a href="tel:+521234567890" className="flex items-center gap-2 hover:text-mostaza transition font-bold"><Phone size={18} /> +52 123 456 7890</a>
            <a href="mailto:agenda@iron&anchore.com" className="flex items-center gap-2 hover:text-mostaza transition font-bold"><Mail size={18} /> agenda@iron&anchore.com</a>
            <div className="flex gap-4 mt-4">
              <a href="#" className="bg-mostaza p-3 rounded-full hover:bg-perla transition group shadow-lg text-marron hover:text-mostaza">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="bg-mostaza p-3 rounded-full hover:bg-perla transition group shadow-lg text-marron hover:text-mostaza">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
