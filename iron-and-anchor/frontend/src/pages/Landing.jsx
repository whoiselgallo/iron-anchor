import React, { useState, useEffect } from 'react';
import BookingModal, { SERVICIOS, BARBEROS, SLOTS_DISPONIBLES } from '../components/BookingModal';
import SubscriptionModal from '../components/SubscriptionModal';
import CloudSyncModal from '../components/CloudSyncModal';
import CheckoutForm from '../components/CheckoutForm';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import {
  Scissors,
  Camera,
  Anchor,
  Calendar as CalendarIcon,
  User,
  CheckCircle2,
  Cloud,
  ShieldAlert,
  Phone,
  Mail,
  CreditCard,
  Bell,
  Star,
  Download,
  Award,
  Sparkles,
  Gift,
  Clock,
  Check
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const stripePromise = loadStripe('pk_test_tu_llave_publica_de_stripe');

function Landing() {
  const hoyStr = new Date().toISOString().split('T')[0];

  // Modales
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  // Configuración para el modal de agendado
  const [bookingConfig, setBookingConfig] = useState({
    step: 0,
    modoSinCosto: false,
    serviceId: 'signature',
    barberoId: 'marcos',
    fecha: hoyStr,
    hora: '10:00 AM'
  });

  // Agendas seleccionadas por cada barbero en sus tarjetas
  const [fechasBarberos, setFechasBarberos] = useState({});
  const [horasBarberos, setHorasBarberos] = useState({});

  // Alertas push/SMS por barbero { [barberId]: phoneString | null }
  const [alertasBarberos, setAlertasBarberos] = useState({});

  // Usuario VIP
  const [vipUser, setVipUser] = useState(null);

  // Formulario de reserva lateral (fallback)
  const [reserva, setReserva] = useState({ servicioId: 'signature', barbero: 'Marcos Thorne', fecha: '' });
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  // Cargar preferencias y alertas guardadas
  useEffect(() => {
    // Alertas de barberos en localStorage
    const savedAlerts = {};
    BARBEROS.forEach((b) => {
      const num = localStorage.getItem(`iron_barber_alert_${b.id}`);
      if (num) savedAlerts[b.id] = num;
    });
    setAlertasBarberos(savedAlerts);

    // Usuario VIP
    const rawVip = localStorage.getItem('iron_vip_user');
    if (rawVip) {
      try {
        setVipUser(JSON.parse(rawVip));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Activar / Desactivar alerta SMS del barbero
  const handleToggleAlerta = (barbero) => {
    const actual = alertasBarberos[barbero.id];
    if (actual) {
      if (window.confirm(`¿Deseas desactivar las alertas automáticas SMS para ${barbero.nombre}?`)) {
        localStorage.removeItem(`iron_barber_alert_${barbero.id}`);
        setAlertasBarberos((prev) => {
          const copia = { ...prev };
          delete copia[barbero.id];
          return copia;
        });
      }
    } else {
      const num = window.prompt(
        `Ingresa el número celular de ${barbero.nombre} para enviarle alertas SMS cuando un cliente confirme cita, pague o reagende:`,
        barbero.telefono || '+52 686 '
      );
      if (num && num.trim().length >= 8) {
        localStorage.setItem(`iron_barber_alert_${barbero.id}`, num.trim());
        setAlertasBarberos((prev) => ({ ...prev, [barbero.id]: num.trim() }));
        alert(`✅ Alertas SMS activadas para ${barbero.nombre}. Se le enviará mensaje a ${num.trim()} en cada confirmación.`);
      }
    }
  };

  // Abrir modal con servicio específico (desde menú de especialidades)
  const handleAbrirServicio = (servicioId) => {
    setBookingConfig((prev) => ({
      ...prev,
      step: 0,
      modoSinCosto: false,
      serviceId
    }));
    setShowBookingModal(true);
  };

  // Abrir modal desde tarjeta de barbero - Modo Agendar Cita (Sin Costo)
  const handleAbrirBarberoSinCosto = (barberoId) => {
    const fecha = fechasBarberos[barberoId] || hoyStr;
    const hora = horasBarberos[barberoId] || '10:00 AM';
    setBookingConfig((prev) => ({
      ...prev,
      step: 3,
      modoSinCosto: true,
      barberoId,
      fecha,
      hora
    }));
    setShowBookingModal(true);
  };

  // Abrir modal desde tarjeta de barbero - Modo Pagar Silla (Anticipo / Checkout directo)
  const handleAbrirBarberoPagoDirecto = (barberoId) => {
    const fecha = fechasBarberos[barberoId] || hoyStr;
    const hora = horasBarberos[barberoId] || '10:00 AM';
    setBookingConfig((prev) => ({
      ...prev,
      step: 3,
      modoSinCosto: false,
      barberoId,
      fecha,
      hora
    }));
    setShowBookingModal(true);
  };

  // Fallback genérico
  const handleAbrirBarbero = handleAbrirBarberoPagoDirecto;

  const handleBookingGeneral = async () => {
    if (!reserva.fecha) {
      setMessage('Por favor, selecciona una fecha y hora.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_URL}/api/pay/stripe`, reserva);
      setClientSecret(response.data.clientSecret);
      setMessage('✅ Reserva procesada. Finaliza tu pago a continuación.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error al procesar la reserva. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const maestros = [
    {
      id: 'marcos',
      selectName: 'Marcos Thorne',
      nombre: 'Marcos "Mano de Hierro"',
      experiencia: '8 años de exp.',
      especialidad: 'Desvanecidos complejos y texturizados',
      resena: 'Reconocido por su pulcritud matemática. Ejecuta degradados perfectos en tiempo récord, asegurando un estilo nítido por semanas.',
      img: '/media/luis.jpeg',
      rating: 4.9,
      vcard: 'https://vc.tsolutionsipidd.com/p/marcos-thorne-iron-anchor',
      googleReview: 'https://maps.app.goo.gl/MDd4DLhyLm2aRjh76'
    },
    {
      id: 'alex',
      selectName: 'Alejandro "Alex" Vega',
      nombre: 'Alex "Ancla"',
      experiencia: '12 años de exp.',
      especialidad: 'Ritual Clásico y afeitado tradicional',
      resena: 'Maestro de la vieja escuela. Convierte el cuidado de la barba en una experiencia premium. Precisión aclamada por los empresarios.',
      img: '/media/javier.jpeg',
      rating: 5.0,
      vcard: 'https://vc.tsolutionsipidd.com/p/alex-vega-iron-anchor',
      googleReview: 'https://maps.app.goo.gl/MDd4DLhyLm2aRjh76'
    },
    {
      id: 'david',
      selectName: 'David Castillo',
      nombre: 'David "Line"',
      experiencia: '5 años de exp.',
      especialidad: 'Diseños urbanos y Hair Tattoo',
      resena: 'Destreza artística excepcional para trazar líneas ultra nítidas. Cada corte es una obra de arte simétrica.',
      img: '/media/omar.jpeg',
      rating: 4.8,
      vcard: 'https://vc.tsolutionsipidd.com/p/david-castillo-iron-anchor',
      googleReview: 'https://maps.app.goo.gl/MDd4DLhyLm2aRjh76'
    },
    {
      id: 'mateo',
      selectName: 'Mateo Rivas',
      nombre: 'Mateo "Express"',
      experiencia: '7 años de exp.',
      especialidad: 'Limpieza de contornos y ejecutivos',
      resena: 'Preferido por clientes con agendas saturadas por su agilidad. Limpieza de pulcritud absoluta en 15 minutos.',
      img: '/media/mateo.jpeg',
      rating: 4.7,
      vcard: 'https://vc.tsolutionsipidd.com/p/mateo-rivas-iron-anchor',
      googleReview: 'https://maps.app.goo.gl/MDd4DLhyLm2aRjh76'
    },
    {
      id: 'elena',
      selectName: 'Elena Salcedo',
      nombre: 'Elena "Experiencia"',
      experiencia: '10 años de exp.',
      especialidad: 'Cortes clásicos y asesoría de imagen',
      resena: 'Destaca por su detallado diagnóstico de visagismo, adaptando las tendencias a tus facciones con técnica impecable.',
      img: '/media/nicole.jpeg',
      rating: 4.9,
      vcard: 'https://vc.tsolutionsipidd.com/p/elena-salcedo-iron-anchor',
      googleReview: 'https://maps.app.goo.gl/MDd4DLhyLm2aRjh76'
    },
    {
      id: 'lucas',
      selectName: 'Lucas Mendoza',
      nombre: 'Lucas "Precisión"',
      experiencia: '6 años de exp.',
      especialidad: 'Combo Ejecutivo (Cabello + Barba)',
      resena: 'Experto en servicio integral. Coordina de forma fluida el lavado, corte y perfilado en 55 minutos.',
      img: '/media/alan.jpeg',
      rating: 4.8,
      vcard: 'https://vc.tsolutionsipidd.com/p/lucas-mendoza-iron-anchor',
      googleReview: 'https://maps.app.goo.gl/MDd4DLhyLm2aRjh76'
    }
  ];

  return (
    <div className="bg-marron min-h-screen text-perla font-sans scroll-smooth">
      {/* MODAL TRASLÚCIDO DE RESERVA Y PAGO */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        initialStep={bookingConfig.step}
        initialModoSinCosto={bookingConfig.modoSinCosto}
        initialServiceId={bookingConfig.serviceId}
        initialBarberoId={bookingConfig.barberoId}
        initialFecha={bookingConfig.fecha}
        initialHora={bookingConfig.hora}
        onBookingSuccess={() => {
          const raw = localStorage.getItem('iron_vip_user');
          if (raw) setVipUser(JSON.parse(raw));
        }}
      />

      {/* MODAL DE SUSCRIPCIÓN CLUB VIP */}
      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onSubscribed={(user) => {
          setVipUser(user);
        }}
      />

      {/* MODAL CLOUD SYNC */}
      <CloudSyncModal isOpen={isCloudSyncOpen} onClose={() => setIsCloudSyncOpen(false)} />

      {/* NAVBAR */}
      <nav className="border-b-4 border-mostaza bg-marron py-4 px-4 md:px-8 flex justify-between items-center sticky top-0 z-40 shadow-2xl">
        <div className="flex items-center gap-3 text-perla font-serif text-xl md:text-2xl tracking-widest uppercase group cursor-pointer">
          <img
            src="/media/logo.png"
            alt="Iron & Anchor Logo"
            className="w-10 h-10 md:w-11 md:h-11 object-contain drop-shadow-[0_0_12px_rgba(225,173,1,0.6)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          />
          <span className="tracking-[0.15em] font-extrabold">IRON & ANCHOR</span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => setShowSubModal(true)}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-mostaza/20 to-mostaza/40 border border-mostaza text-mostaza hover:bg-mostaza hover:text-marron px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-[0_0_10px_rgba(225,173,1,0.3)]"
          >
            <Sparkles size={14} /> Club VIP (-20%)
          </button>
          <Link to="/dashboard" className="text-mostaza hover:text-perla font-bold tracking-widest uppercase transition text-xs md:text-sm">
            Dashboard
          </Link>
          <button onClick={() => setIsCloudSyncOpen(true)} className="flex items-center gap-1.5 text-perla/80 hover:text-mostaza font-bold transition text-xs md:text-sm">
            <Cloud size={16} /> <span className="hidden md:inline">Cloud Sync</span>
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-perla text-marron px-4 md:px-6 py-2 rounded-sm font-bold uppercase tracking-widest hover:bg-mostaza hover:text-marron transition text-xs md:text-sm shadow-[0_0_15px_rgba(248,246,240,0.5)]"
          >
            Agendar
          </button>
        </div>
      </nav>

      {/* BANNER VIP STICKY (SI ESTÁ SUSCRITO) */}
      {vipUser && (
        <div className="bg-gradient-to-r from-amber-950 via-marron to-amber-950 border-b border-mostaza/40 py-2 px-4 text-center text-xs text-mostaza flex items-center justify-center gap-2">
          <Award size={16} className="text-mostaza" />
          <span>
            ¡Bienvenido miembro VIP <strong>{vipUser.nombre}</strong>! Tienes <strong>20% OFF</strong> en tu reserva | Pasaporte: <strong>{vipUser.visitas || 1} de 7 visitas</strong> (7ma gratis)
          </span>
        </div>
      )}

      {/* HERO SECTION */}
      <header className="relative bg-marron py-28 md:py-36 text-center border-b-8 border-mostaza flex flex-col items-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
          <source src="/media/barber3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-marron/60 to-marron/95"></div>

        <div className="relative z-10 w-[75vw] max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="flex flex-col items-center mb-5">
            <img
              src="/media/logo.png"
              alt="Iron & Anchor Emblema"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain drop-shadow-[0_0_25px_rgba(225,173,1,0.6)] hover:scale-105 transition-transform duration-500"
            />
          </div>
          <span className="inline-flex items-center gap-2 bg-mostaza/20 border border-mostaza/50 text-mostaza px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Clock size={14} /> Horario Oficial: 9:00 AM a 4:00 PM • Citas Cada Hora
          </span>
          <h1 className="w-full font-serif text-perla mb-6 uppercase drop-shadow-2xl font-black leading-[0.85] tracking-normal text-[clamp(2.8rem,11.5vw,8.5rem)]">
            <span className="block">IRON &amp;</span>
            <span className="block">ANCHOR</span>
          </h1>
          <p className="w-full text-sm sm:text-lg md:text-2xl lg:text-3xl text-mostaza font-bold uppercase mb-8 tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.5em] leading-relaxed">
            ESTILO • PRECISIÓN • RAPIDEZ
          </p>
          <p className="w-full text-sm sm:text-base md:text-xl text-perla/90 mb-10 font-medium leading-relaxed drop-shadow-md text-center">
            El Refugio del Hombre Moderno en Mexicali. Citas estrictamente organizadas cada hora con 15 minutos dedicados a la sanitización y preparación de la silla.
          </p>
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-perla text-marron font-bold py-4 px-8 md:px-12 rounded text-base md:text-lg hover:bg-mostaza transition uppercase tracking-[0.15em] shadow-[0_0_30px_rgba(248,246,240,0.4)]"
            >
              <Scissors size={20} /> Agendar Cita
            </button>
            <button
              onClick={() => setShowSubModal(true)}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-transparent border-2 border-mostaza text-mostaza hover:bg-mostaza hover:text-marron font-bold py-4 px-6 md:px-8 rounded text-base md:text-lg transition uppercase tracking-[0.15em]"
            >
              <Gift size={20} /> Club VIP (20% OFF)
            </button>
          </div>
        </div>
      </header>

      {/* SECCIÓN NUESTRO EQUIPO */}
      <section id="equipo" className="py-24 bg-[#2A1A0F] px-4 relative overflow-hidden border-b-8 border-mostaza">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif text-perla mb-4 tracking-widest uppercase">Nuestros Maestros</h2>
          <div className="h-1 w-24 bg-mostaza mx-auto mb-6"></div>
          <p className="text-perla/70 font-medium max-w-xl mx-auto">
            Disponibilidad en tiempo real dentro del horario laboral de 9:00 AM a 4:00 PM. Cada cita incluye 15 minutos de desinfección previa.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {maestros.map((m) => {
            const fechaActual = fechasBarberos[m.id] || hoyStr;
            const horaActual = horasBarberos[m.id] || '10:00 AM';
            const alertaActiva = alertasBarberos[m.id];

            return (
              <div key={m.id} className="group relative">
                <div className="bg-[#3A2214] p-6 rounded-2xl shadow-glow-smoke flex flex-col border border-marron group-hover:border-mostaza/80 transform transition-all duration-300 hover:-translate-y-2 h-full">
                  
                  <h3 className="text-2xl font-serif text-mostaza tracking-widest uppercase mb-4 text-center leading-tight">
                    {m.nombre}
                  </h3>

                  <div className="relative mb-5 mx-auto w-36 h-36 rounded-full">
                    <div className="absolute inset-0 bg-mostaza rounded-full blur-lg opacity-0 group-hover:opacity-50 transition duration-500"></div>
                    <img
                      src={m.img}
                      alt={m.nombre}
                      loading="lazy"
                      className="relative w-full h-full object-cover rounded-full border-4 border-mostaza shadow-xl z-10 bg-marron"
                    />
                  </div>

                  {/* BARRA DE RESEÑAS */}
                  <div className="flex flex-col items-center mb-4">
                    <div className="flex justify-center items-center gap-1 text-mostaza mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill={i < Math.floor(m.rating) ? 'currentColor' : 'transparent'} strokeWidth={2} />
                      ))}
                      <span className="text-perla font-bold ml-1.5 text-xs">{m.rating.toFixed(1)} / 5.0</span>
                    </div>
                    <a
                      href={m.googleReview || 'https://maps.app.goo.gl/MDd4DLhyLm2aRjh76'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase font-bold tracking-wider text-mostaza hover:text-marron hover:bg-mostaza border border-mostaza px-3 py-1 rounded-full transition"
                    >
                      Calificar en Google
                    </a>
                  </div>

                  <div className="text-center flex flex-col mb-4">
                    <p className="text-perla font-bold text-xs mb-1 uppercase tracking-wider">{m.experiencia}</p>
                    <p className="text-mostaza font-bold text-xs mb-3 px-2 leading-tight border-b border-mostaza/20 pb-3">{m.especialidad}</p>
                    <p className="text-perla/80 text-xs leading-relaxed italic line-clamp-2">"{m.resena}"</p>
                  </div>

                  {/* AGENDA PERSONAL DEL BARBERO: 9 AM a 4 PM con 15 min de limpieza */}
                  <div className="bg-marron rounded-xl p-4 mt-auto border border-mostaza/30 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-mostaza uppercase flex items-center gap-1.5">
                        <CalendarIcon size={14} /> Horarios Disponibles
                      </h4>
                      <span className="text-[10px] text-perla/60">9:00 AM - 4:00 PM</span>
                    </div>

                    {/* Selector de fecha limpio */}
                    <div>
                      <label className="text-[10px] font-bold text-perla/60 uppercase block mb-1">Día de atención:</label>
                      <input
                        type="date"
                        value={fechaActual}
                        min={hoyStr}
                        onChange={(e) => setFechasBarberos({ ...fechasBarberos, [m.id]: e.target.value })}
                        className="w-full p-2 bg-[#2A1A0F] border border-mostaza/30 text-perla rounded text-xs font-bold focus:border-mostaza outline-none"
                      />
                    </div>

                    {/* Horas disponibles directamente en botones (no carrusel de ruedas) */}
                    <div>
                      <label className="text-[10px] font-bold text-perla/60 uppercase block mb-1.5">
                        Selecciona tu hora (45 min + 15 min limpieza):
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {SLOTS_DISPONIBLES.map((slot) => {
                          const isSel = horaActual === slot.hora;
                          return (
                            <button
                              key={slot.hora}
                              type="button"
                              onClick={() => setHorasBarberos({ ...horasBarberos, [m.id]: slot.hora })}
                              className={`py-1.5 px-1 rounded text-[11px] font-mono font-bold transition text-center ${
                                isSel
                                  ? 'bg-mostaza text-marron border border-mostaza shadow-[0_0_8px_rgba(225,173,1,0.5)]'
                                  : 'bg-[#2A1A0F] border border-perla/15 text-perla hover:border-mostaza/60'
                              }`}
                            >
                              {slot.hora.replace(' ', '')}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Botones de acción: Alerta Push/SMS, Pagar Silla, vCard */}
                    <div className="space-y-2 pt-1">
                      {/* Botón Alertas Push/SMS para el Barbero */}
                      <button
                        type="button"
                        onClick={() => handleToggleAlerta(m)}
                        className={`w-full py-2 px-3 rounded text-xs font-bold uppercase tracking-wider transition flex justify-center items-center gap-1.5 border ${
                          alertaActiva
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 hover:bg-emerald-900'
                            : 'border-perla/30 text-perla/80 hover:border-mostaza hover:text-mostaza'
                        }`}
                      >
                        <Bell size={13} className={alertaActiva ? 'text-emerald-400' : ''} />
                        {alertaActiva ? `Alertas SMS Activas (${alertaActiva})` : 'Activar Alertas SMS'}
                      </button>

                      {/* Botón 1: Agendar Cita (Sin Costo) */}
                      <button
                        type="button"
                        onClick={() => handleAbrirBarberoSinCosto(m.id)}
                        className="w-full bg-transparent border border-emerald-500/80 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold py-2 rounded text-xs uppercase tracking-wider transition flex justify-center items-center gap-2 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                      >
                        <CalendarIcon size={14} /> Agendar Cita (Sin Costo)
                      </button>

                      {/* Botón 2: Pagar Silla (Dirige directo a pantalla de cobro con información precargada) */}
                      <button
                        type="button"
                        onClick={() => handleAbrirBarberoPagoDirecto(m.id)}
                        className="w-full bg-mostaza text-marron hover:bg-perla font-bold py-2.5 rounded text-xs uppercase tracking-wider transition shadow-glow-smoke flex justify-center items-center gap-2"
                      >
                        <CreditCard size={15} /> Pagar Silla ({horaActual})
                      </button>

                      {/* Botón Información de contacto (vCard) */}
                      <a
                        href={m.vcard}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-transparent border-2 border-mostaza text-mostaza hover:bg-mostaza hover:text-marron font-bold py-2 rounded text-xs uppercase tracking-wider transition flex justify-center items-center gap-2"
                      >
                        <Download size={13} /> Información de contacto
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MENÚ DE ESPECIALIDADES Y RESERVA TRASLÚCIDA */}
      <section id="reservar" className="py-24 bg-[#3A2214] px-4 relative overflow-hidden">
        <div className="text-center mb-16 relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-mostaza bg-mostaza/10 px-4 py-1.5 rounded-full border border-mostaza/30 mb-3 inline-block">
            Haz clic en cualquier servicio para agendar en modal
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-perla mb-4 tracking-widest uppercase">Menú de Especialidades</h2>
          <div className="h-1 w-24 bg-mostaza mx-auto mb-6"></div>
          <p className="text-perla/70 font-medium">Selecciona tu paquete para abrir el proceso de agendado y pago traslúcido.</p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-6">
            {SERVICIOS.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => handleAbrirServicio(s.id)}
                className="flex flex-col md:flex-row overflow-hidden rounded-xl cursor-pointer transition-all shadow-glow-smoke bg-marron border-2 border-mostaza/30 hover:border-mostaza hover:scale-[1.02] group"
              >
                {idx % 2 === 0 ? (
                  <>
                    <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                      <img src={s.img} alt={s.nombre} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-6 md:w-3/5 flex flex-col justify-center">
                      <h3 className="text-xl font-serif tracking-wide uppercase text-perla group-hover:text-mostaza transition">{s.nombre}</h3>
                      <div className="flex items-center gap-3 mt-2 mb-3 text-sm font-bold">
                        <span className="text-perla font-mono">${s.precio} MXN</span>
                        <span className="text-mostaza">| {s.tiempo}</span>
                      </div>
                      <p className="text-perla/70 text-xs leading-relaxed mb-4">{s.desc}</p>
                      <button className="self-start text-xs font-bold text-mostaza flex items-center gap-1 group-hover:underline uppercase tracking-wider">
                        Agendar y Pagar este Servicio &rarr;
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6 md:w-3/5 flex flex-col justify-center order-2 md:order-1">
                      <h3 className="text-xl font-serif tracking-wide uppercase text-perla group-hover:text-mostaza transition">{s.nombre}</h3>
                      <div className="flex items-center gap-3 mt-2 mb-3 text-sm font-bold">
                        <span className="text-perla font-mono">${s.precio} MXN</span>
                        <span className="text-mostaza">| {s.tiempo}</span>
                      </div>
                      <p className="text-perla/70 text-xs leading-relaxed mb-4">{s.desc}</p>
                      <button className="self-start text-xs font-bold text-mostaza flex items-center gap-1 group-hover:underline uppercase tracking-wider">
                        Agendar y Pagar este Servicio &rarr;
                      </button>
                    </div>
                    <div className="md:w-2/5 h-48 md:h-auto overflow-hidden order-1 md:order-2">
                      <img src={s.img} alt={s.nombre} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Banner del Club de Suscripción */}
            <div className="bg-gradient-to-b from-[#2A1A0F] to-marron p-6 rounded-xl border-2 border-mostaza shadow-glow-smoke text-perla space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-mostaza/20 border border-mostaza rounded-xl text-mostaza">
                  <Award size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-serif uppercase tracking-widest text-perla">Club VIP Iron & Anchor</h4>
                  <p className="text-xs text-mostaza font-bold">20% Descuento & 7ma Visita Gratis</p>
                </div>
              </div>
              <p className="text-xs text-perla/80 leading-relaxed">
                Únete a nuestro programa de fidelidad. Haz check-in en cada confirmación de pago y acumula visitas automáticamente.
              </p>
              <button
                onClick={() => setShowSubModal(true)}
                className="w-full bg-mostaza text-marron font-serif text-sm uppercase tracking-widest font-bold py-3 rounded-lg hover:bg-perla transition shadow"
              >
                {vipUser ? 'Ver Mi Pasaporte VIP' : 'Suscribirme y Recibir 20% OFF'}
              </button>
            </div>

            {/* ÁREA DE DISEÑO CON ASPECTO DE CELULAR & CÁMARA */}
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md bg-[#120B07] p-4 sm:p-5 rounded-[44px] border-[5px] border-mostaza/60 shadow-[0_0_35px_rgba(225,173,1,0.35)] text-perla space-y-4">
              {/* Notch y Cámara del Celular con Logotipo */}
              <div className="flex justify-center items-center gap-3 pb-2 pt-1 border-b border-mostaza/20">
                <div className="flex items-center gap-2 bg-[#2A1A0F] px-4 py-1.5 rounded-full border border-mostaza/40 shadow-inner">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                  {/* Lente de la cámara con el nuevo logotipo integrado */}
                  <div className="relative flex items-center justify-center">
                    <img
                      src="/media/logo.png"
                      alt="Cámara Iron and Anchor"
                      className="w-7 h-7 object-contain rounded-full p-0.5 border border-mostaza bg-black/90 shadow-[0_0_8px_rgba(225,173,1,0.8)]"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-red-600 rounded-full border border-white"></div>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-mostaza font-bold flex items-center gap-1">
                    <Camera size={13} className="text-mostaza" /> Cam Visagismo AR
                  </span>
                </div>
              </div>

              {/* Pantalla del Celular */}
              <div className="bg-marron/95 p-5 rounded-[28px] border border-mostaza/30 space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-mostaza/20">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/media/logo.png"
                      alt="App Icon"
                      className="w-9 h-9 object-contain rounded-xl p-1 bg-black/80 border border-mostaza/50 shadow-md"
                    />
                    <div>
                      <h3 className="text-sm font-serif text-mostaza tracking-widest uppercase font-bold leading-none">Iron & Anchor Mobile</h3>
                      <span className="text-[10px] text-perla/60 font-mono">App Oficial de Reservas</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold uppercase tracking-wider">
                    En Vivo
                  </span>
                </div>

                <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 mb-1.5 text-perla/80 font-bold text-xs uppercase tracking-wide">
                    <User size={14} /> Barbero Asignado
                  </label>
                  <select
                    value={reserva.barbero}
                    onChange={(e) => setReserva({ ...reserva, barbero: e.target.value })}
                    className="w-full p-3 bg-[#2A1A0F] border border-mostaza/40 text-perla text-xs rounded outline-none focus:border-mostaza font-bold"
                  >
                    {BARBEROS.map((b) => (
                      <option key={b.id} value={b.nombre}>
                        {b.nombre} ({b.alias})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 mb-1.5 text-perla/80 font-bold text-xs uppercase tracking-wide">
                    <CalendarIcon size={14} /> Horario (9:00 AM - 4:00 PM)
                  </label>
                  <input
                    type="date"
                    value={reserva.fecha}
                    min={hoyStr}
                    onChange={(e) => setReserva({ ...reserva, fecha: e.target.value })}
                    className="w-full p-3 bg-[#2A1A0F] border border-mostaza/40 text-perla text-xs rounded outline-none focus:border-mostaza font-bold mb-2"
                  />
                  <div className="grid grid-cols-4 gap-1">
                    {SLOTS_DISPONIBLES.map((slot) => (
                      <button
                        key={slot.hora}
                        type="button"
                        onClick={() => setReserva({ ...reserva, hora: slot.hora })}
                        className={`py-1 rounded text-[10px] font-mono font-bold ${
                          reserva.hora === slot.hora ? 'bg-mostaza text-marron' : 'bg-[#2A1A0F] text-perla/80 hover:text-mostaza border border-perla/10'
                        }`}
                      >
                        {slot.hora.replace(' ', '')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#2A1A0F] border border-mostaza/20 flex gap-2.5 rounded">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={terminosAceptados}
                    onChange={(e) => setTerminosAceptados(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-mostaza cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-[11px] text-perla/80 cursor-pointer leading-tight">
                    Acepto políticas de puntualidad (máx. 10 min tolerancia) y 15 min de limpieza obligatoria.
                  </label>
                </div>

                {message && (
                  <div className={`p-3 font-bold text-xs rounded ${message.includes('Error') || message.includes('Por favor') ? 'bg-red-900/80 text-red-100' : 'bg-green-900/80 text-green-100'}`}>
                    {message}
                  </div>
                )}

                <div>
                  {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#E1AD01', colorBackground: '#3A2214', colorText: '#F8F6F0' } } }}>
                      <CheckoutForm clientSecret={clientSecret} onCancel={() => setClientSecret('')} />
                    </Elements>
                  ) : (
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full bg-mostaza text-marron hover:bg-perla py-3.5 font-serif text-base tracking-widest uppercase transition flex justify-center items-center gap-2 rounded-xl font-bold shadow-glow-smoke"
                    >
                      <CheckCircle2 size={18} /> Abrir Modal de Reserva y Pago
                    </button>
                  )}
                </div>
              </div>
              </div>

              {/* Barra inferior del Celular (Home Bar) */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-32 h-1.5 bg-mostaza/50 rounded-full"></div>
              </div>
            </div>

            {/* Políticas */}
            <div className="relative rounded-xl overflow-hidden border border-mostaza/40 shadow-glow-smoke p-5 flex items-center">
              <div className="absolute inset-0 bg-[url('/media/agenda.jpeg')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-marron/80 backdrop-blur-[4px]"></div>
              <div className="relative z-10 text-perla w-full">
                <h4 className="flex items-center gap-2 text-mostaza font-serif tracking-wider text-base mb-3">
                  <ShieldAlert size={18} /> Protocolo de Jornada (9 AM - 4 PM)
                </h4>
                <ul className="text-xs text-perla/90 space-y-2 font-medium">
                  <li><strong className="text-mostaza">Bloque de 1 Hora:</strong> 45 min servicio + 15 min sanitización.</li>
                  <li><strong className="text-mostaza">Alertas Push / SMS:</strong> El barbero recibe confirmación en su celular.</li>
                  <li><strong className="text-mostaza">Check-in Digital:</strong> Acumula visitas automáticamente (7ma gratis).</li>
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
            <div className="flex items-center gap-4 text-perla font-serif text-3xl tracking-widest uppercase mb-4">
              <img
                src="/media/logo.png"
                alt="Iron & Anchor Emblema"
                className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(225,173,1,0.6)]"
              />
              <span>IRON & ANCHOR</span>
            </div>
            <p className="text-perla/70 font-medium mb-6 text-center md:text-left max-w-sm">
              Estructura y Precisión. Elevando el estándar de la barbería clásica en Mexicali.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4 text-perla">
            <h4 className="font-serif text-xl tracking-widest text-mostaza uppercase mb-2">Contacto</h4>
            <a href="tel:+521234567890" className="flex items-center gap-2 hover:text-mostaza transition font-bold">
              <Phone size={18} /> +52 123 456 7890
            </a>
            <a href="mailto:agenda@iron&anchore.com" className="flex items-center gap-2 hover:text-mostaza transition font-bold">
              <Mail size={18} /> agenda@iron&anchore.com
            </a>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setShowSubModal(true)}
                className="bg-mostaza text-marron font-bold text-xs uppercase px-4 py-2 rounded tracking-wider hover:bg-perla transition"
              >
                Suscribirse al Club VIP
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
