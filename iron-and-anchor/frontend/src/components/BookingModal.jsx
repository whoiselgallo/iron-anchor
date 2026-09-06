import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check, Star, Clock, ShieldCheck, Sparkles, AlertCircle, Phone, Calendar as CalendarIcon, MessageSquare, Gift, CreditCard, Scissors } from "lucide-react";

export const SERVICIOS = [
  { id: "signature", nombre: "Corte de Cabello Signature", precio: 250, tiempo: "35 min", desc: "Definición adaptada a facciones. Lavado y peinado.", img: "/media/corte_cabello.jpeg" },
  { id: "ritual", nombre: "Ritual de Barba Clásico", precio: 200, tiempo: "30 min", desc: "Perfilado detallado, toallas calientes y navaja libre.", img: "/media/ritual_barba.jpeg" },
  { id: "combo", nombre: "Combo Ejecutivo (Cabello + Barba)", precio: 400, tiempo: "55 min", desc: "El servicio integral definitivo en una sola sesión.", img: "/media/combo_ejecutivo.jpeg" },
  { id: "tattoo", nombre: "Diseño de Líneas y Hair Tattoo", precio: 150, tiempo: "25 min", desc: "Creación de líneas nítidas y diseños geométricos.", img: "/media/hair_tattoo.jpeg" },
  { id: "express", nombre: "Servicio Express de Mantenimiento", precio: 120, tiempo: "15 min", desc: "Limpieza ágil de contornos, patillas y cuello.", img: "/media/servicio_express.jpeg" },
];

export const BARBEROS = [
  { id: "marcos", nombre: "Marcos Thorne", alias: '"Mano de Hierro"', puesto: "Master Barber & Co-Founder", rating: 4.9, img: "/media/luis.jpeg", telefono: "+526861234501" },
  { id: "alex", nombre: 'Alejandro "Alex" Vega', alias: '"Ancla"', puesto: "Traditional Shaving Master", rating: 5.0, img: "/media/javier.jpeg", telefono: "+526861234502" },
  { id: "david", nombre: "David Castillo", alias: '"Line"', puesto: "Freestyle Hair Artist", rating: 4.8, img: "/media/omar.jpeg", telefono: "+526861234503" },
  { id: "mateo", nombre: "Mateo Rivas", alias: '"Express"', puesto: "Senior Stylist", rating: 4.7, img: "/media/mateo.jpeg", telefono: "+526861234504" },
  { id: "elena", nombre: "Elena Salcedo", alias: '"Experiencia"', puesto: "Lead Colorist & Grooming", rating: 4.9, img: "/media/nicole.jpeg", telefono: "+526861234505" },
  { id: "lucas", nombre: "Lucas Mendoza", alias: '"Precisión"', puesto: "Junior Barber & Experience", rating: 4.8, img: "/media/alan.jpeg", telefono: "+526861234506" },
];

// Horario estricto: 9:00 AM a 4:00 PM, citas cada hora con 15 min de limpieza entre citas
export const SLOTS_DISPONIBLES = [
  { hora: "09:00 AM", finServicio: "09:45 AM", bufferLimpieza: "09:45 - 10:00 AM" },
  { hora: "10:00 AM", finServicio: "10:45 AM", bufferLimpieza: "10:45 - 11:00 AM" },
  { hora: "11:00 AM", finServicio: "11:45 AM", bufferLimpieza: "11:45 - 12:00 PM" },
  { hora: "12:00 PM", finServicio: "12:45 PM", bufferLimpieza: "12:45 - 01:00 PM" },
  { hora: "01:00 PM", finServicio: "01:45 PM", bufferLimpieza: "01:45 - 02:00 PM" },
  { hora: "02:00 PM", finServicio: "02:45 PM", bufferLimpieza: "02:45 - 03:00 PM" },
  { hora: "03:00 PM", finServicio: "03:45 PM", bufferLimpieza: "03:45 - 04:00 PM" },
];

const STEPS = ["Servicio", "Barbero", "Fecha & Horario", "Confirmar y Pagar"];

export default function BookingModal({
  isOpen,
  onClose,
  initialStep = 0,
  initialModoSinCosto = false,
  initialServiceId = null,
  initialBarberoId = null,
  initialFecha = null,
  initialHora = null,
  onBookingSuccess
}) {
  const [step, setStep] = useState(0);
  const [modoSinCosto, setModoSinCosto] = useState(false);
  const [selServicio, setSelServicio] = useState(null);
  const [selBarbero, setSelBarbero] = useState(null);
  const [selFecha, setSelFecha] = useState("");
  const [selHora, setSelHora] = useState(null);
  const [nombre, setNombre] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [done, setDone] = useState(false);
  const [smsEnviado, setSmsEnviado] = useState(null);
  const [descuentoVip, setDescuentoVip] = useState(false);
  const [visitasCliente, setVisitasCliente] = useState(1);
  const [checkInHecho, setCheckInHecho] = useState(false);

  // Inicialización de parámetros al abrir modal
  useEffect(() => {
    if (!isOpen) return;

    // Ajustar step inicial y modo
    setStep(typeof initialStep === 'number' ? initialStep : 0);
    setModoSinCosto(Boolean(initialModoSinCosto));
    setDone(false);
    setSmsEnviado(null);
    setCheckInHecho(false);

    // Fecha predeterminada de hoy
    const hoyStr = new Date().toISOString().split("T")[0];
    setSelFecha(initialFecha || hoyStr);

    if (initialServiceId) {
      const s = SERVICIOS.find((x) => x.id === initialServiceId);
      if (s) setSelServicio(s);
    } else if (!selServicio) {
      setSelServicio(SERVICIOS[0]);
    }

    if (initialBarberoId) {
      const b = BARBEROS.find((x) => x.id === initialBarberoId || x.nombre.toLowerCase().includes(initialBarberoId.toLowerCase()));
      if (b) setSelBarbero(b);
    } else if (!selBarbero) {
      setSelBarbero(BARBEROS[0]);
    }

    if (initialHora) {
      setSelHora(initialHora);
    } else if (!selHora) {
      setSelHora(SLOTS_DISPONIBLES[0].hora);
    }

    // Revisar si cliente tiene descuento VIP registrado
    const rawVip = localStorage.getItem("iron_vip_user");
    if (rawVip) {
      try {
        const vip = JSON.parse(rawVip);
        if (vip.descuentoActivo) {
          setDescuentoVip(true);
        }
        if (vip.visitas) {
          setVisitasCliente(vip.visitas);
        }
        if (vip.nombre && !nombre) setNombre(vip.nombre);
        if (vip.telefono && !telefonoCliente) setTelefonoCliente(vip.telefono);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, initialStep, initialModoSinCosto, initialServiceId, initialBarberoId, initialFecha, initialHora]);

  if (!isOpen) return null;

  const back = () => setStep((s) => Math.max(s - 1, 0));
  const next = () => setStep((s) => Math.min(s + 1, 3));

  const canNext = () => {
    if (step === 0) return Boolean(selServicio);
    if (step === 1) return Boolean(selBarbero);
    if (step === 2) return Boolean(selFecha && selHora);
    return nombre.trim().length >= 3 && telefonoCliente.trim().length >= 8;
  };

  const handleConfirmarCita = () => {
    // Cálculo de precio con descuento si aplica
    const precioBase = selServicio?.precio || 250;
    const precioCobrado = modoSinCosto ? 0 : (descuentoVip ? Math.round(precioBase * 0.8) : precioBase);

    // Número de teléfono configurado para alertas del barbero
    const alertasStorage = localStorage.getItem("iron_barber_alert_" + (selBarbero?.id || ""));
    const telBarberoAlert = alertasStorage || selBarbero?.telefono || "+52 686 123 4500";

    const nuevaCita = {
      id: Date.now(),
      cliente: nombre,
      telefonoCliente,
      servicio: selServicio?.nombre,
      precio: precioCobrado,
      modalidad: modoSinCosto ? "Cita Sin Costo (Pago en Sucursal)" : "Pago de Silla Anticipado (Stripe)",
      barbero: selBarbero?.nombre,
      barberoId: selBarbero?.id,
      fecha: selFecha,
      hora: selHora,
      estado: "Completado",
      createdAt: new Date().toISOString(),
    };

    // Guardar en agenda global de citas sincronizada
    try {
      const citasActuales = JSON.parse(localStorage.getItem("iron_citas_agendadas") || "[]");
      citasActuales.push(nuevaCita);
      localStorage.setItem("iron_citas_agendadas", JSON.stringify(citasActuales));
    } catch (e) {
      console.error(e);
    }

    // Disparar mensaje SMS al barbero
    const detalleCobro = modoSinCosto 
      ? "Agendada SIN COSTO (pago en sucursal al finalizar)" 
      : "Pago de Silla procesado ($" + precioCobrado + " MXN)";
    const textoSms = "Iron & Anchor: Cita confirmada con " + nombre + " para " + selServicio?.nombre + " el " + selFecha + " a las " + selHora + ". Modalidad: " + detalleCobro + ".";
    
    setSmsEnviado({
      destinatario: (selBarbero?.nombre || "Barbero") + " (" + telBarberoAlert + ")",
      mensaje: textoSms,
    });

    setDone(true);
    if (onBookingSuccess) onBookingSuccess(nuevaCita);
  };

  const handleCheckIn = () => {
    const nuevoTotal = visitasCliente + 1;
    setVisitasCliente(nuevoTotal);
    setCheckInHecho(true);

    const rawVip = localStorage.getItem("iron_vip_user");
    if (rawVip) {
      try {
        const vip = JSON.parse(rawVip);
        vip.visitas = nuevoTotal;
        localStorage.setItem("iron_vip_user", JSON.stringify(vip));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const precioOriginal = selServicio?.precio || 250;
  const precioConDescuento = descuentoVip ? Math.round(precioOriginal * 0.8) : precioOriginal;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      style={{ background: "rgba(20, 10, 5, 0.88)", backdropFilter: "blur(14px)" }}
    >
      <div className="relative w-full max-w-xl bg-[#2A1A0F]/95 border-2 border-mostaza/50 rounded-2xl shadow-glow-smoke overflow-hidden text-perla flex flex-col max-h-[92vh]">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 bg-marron border-b border-mostaza/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-mostaza animate-pulse"></span>
            <div>
              <h2 className="text-xl font-serif text-perla uppercase tracking-widest leading-none">
                {modoSinCosto ? "Agendar Cita (Sin Costo)" : "Pagar y Reservar Silla"}
              </h2>
              <p className="text-mostaza font-bold text-xs uppercase tracking-wider mt-1">Horario Laboral 9:00 AM - 4:00 PM</p>
            </div>
          </div>
          <button onClick={onClose} className="text-perla/50 hover:text-mostaza transition p-1.5 rounded-lg hover:bg-marron/50">
            <X size={22} />
          </button>
        </div>

        {/* Notificación SMS / Alerta de texto enviada al Barbero */}
        {smsEnviado && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-5 py-3 text-xs text-emerald-200 flex items-start gap-2.5">
            <MessageSquare size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-300">📲 Alerta SMS enviada al celular del barbero:</p>
              <p className="opacity-90 font-mono mt-0.5">Destino: {smsEnviado.destinatario}</p>
              <p className="italic text-emerald-100 mt-1">"{smsEnviado.mensaje}"</p>
            </div>
          </div>
        )}

        {done ? (
          <div className="p-6 md:p-8 flex flex-col items-center gap-4 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-mostaza/20 border-2 border-mostaza flex items-center justify-center text-mostaza shadow-glow-smoke">
              <Check size={36} />
            </div>
            <h3 className="text-2xl md:text-3xl font-serif text-perla uppercase tracking-wide">
              {modoSinCosto ? "¡Cita Agendada con Éxito!" : "¡Cita & Silla Aseguradas!"}
            </h3>
            
            <div className="bg-marron/80 p-5 rounded-xl border border-mostaza/30 w-full text-left space-y-2 text-sm">
              <div className="flex justify-between border-b border-mostaza/20 pb-2">
                <span className="text-perla/70">Cliente:</span>
                <span className="font-bold text-perla">{nombre}</span>
              </div>
              <div className="flex justify-between border-b border-mostaza/20 pb-2">
                <span className="text-perla/70">Servicio:</span>
                <span className="font-bold text-mostaza">{selServicio?.nombre}</span>
              </div>
              <div className="flex justify-between border-b border-mostaza/20 pb-2">
                <span className="text-perla/70">Maestro Barbero:</span>
                <span className="font-bold text-perla">{selBarbero?.nombre}</span>
              </div>
              <div className="flex justify-between border-b border-mostaza/20 pb-2">
                <span className="text-perla/70">Fecha & Hora:</span>
                <span className="font-bold text-mostaza">{selFecha} a las {selHora}</span>
              </div>
              <div className="flex justify-between border-b border-mostaza/20 pb-2">
                <span className="text-perla/70">Duración:</span>
                <span className="text-xs text-perla/90 font-medium">45 min atención + 15 min sanitización</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-perla/70">Modalidad de Pago:</span>
                {modoSinCosto ? (
                  <span className="font-bold text-base text-emerald-400">Sin Costo Anticipado ($0) • Pagar en Barbería</span>
                ) : (
                  <span className="font-bold text-xl text-mostaza">${precioConDescuento} MXN {descuentoVip && <span className="text-xs text-emerald-400 font-normal">(-20% VIP)</span>}</span>
                )}
              </div>
            </div>

            {/* Check-in de Fidelidad (La 7ma es gratis) */}
            <div className="w-full bg-[#1A0E07] p-4 rounded-xl border border-mostaza/40 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-mostaza uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors size={14} /> Pasaporte de Fidelidad Iron & Anchor
                </span>
                <span className="text-xs font-mono text-perla/80">{visitasCliente} de 7 visitas</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center my-3">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div
                    key={num}
                    className={"py-2 rounded-lg border text-xs font-bold flex flex-col items-center justify-center " + (
                      num <= visitasCliente
                        ? "bg-mostaza text-marron border-mostaza shadow-[0_0_8px_rgba(225,173,1,0.4)]"
                        : num === 7
                        ? "bg-marron border-dashed border-mostaza text-mostaza"
                        : "bg-marron/40 border-perla/20 text-perla/30"
                    )}
                  >
                    <span>#{num}</span>
                    {num === 7 ? <Gift size={12} className={num <= visitasCliente ? "text-marron" : "text-mostaza"} /> : <Check size={10} />}
                  </div>
                ))}
              </div>

              {!checkInHecho ? (
                <button
                  onClick={handleCheckIn}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg uppercase tracking-wider transition flex justify-center items-center gap-2 shadow"
                >
                  <Sparkles size={14} /> Hacer Check-In de esta visita (+1 visita)
                </button>
              ) : (
                <p className="text-center text-xs text-emerald-400 font-bold py-1">
                  ✓ ¡Check-in confirmado! Visita acumulada con éxito.
                </p>
              )}
              {visitasCliente >= 7 && (
                <div className="mt-2 p-2 bg-mostaza/20 border border-mostaza text-center rounded text-xs font-bold text-mostaza">
                  🎉 ¡Felicidades! Has alcanzado 7 visitas. ¡Tu próximo corte será 100% GRATIS!
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-mostaza text-marron font-serif text-base uppercase tracking-widest font-bold py-3.5 rounded-xl hover:bg-perla transition shadow-glow-smoke mt-1"
            >
              Listo / Volver a la Barbería
            </button>
          </div>
        ) : (
          <>
            {/* Barra de progreso de pasos */}
            <div className="flex border-b border-mostaza/20 flex-shrink-0">
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  onClick={() => i <= 3 && setStep(i)}
                  className={"flex-1 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider transition " + (
                    i === step
                      ? "text-mostaza border-b-2 border-mostaza bg-mostaza/10"
                      : i < step
                      ? "text-emerald-400 hover:bg-marron/30"
                      : "text-perla/50 hover:text-perla"
                  )}
                >
                  {i < step && <Check size={10} className="inline mr-1" />}
                  {s}
                </button>
              ))}
            </div>

            {/* Selector de Modo Rápido (Sin Costo vs Pago de Silla) */}
            <div className="px-6 pt-3 pb-1 flex gap-2 bg-[#20130B]/90 border-b border-mostaza/20">
              <button
                type="button"
                onClick={() => setModoSinCosto(false)}
                className={"flex-1 py-1.5 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 " + (
                  !modoSinCosto
                    ? "bg-mostaza text-marron shadow-[0_0_10px_rgba(225,173,1,0.4)]"
                    : "bg-transparent text-perla/60 hover:text-perla border border-perla/20"
                )}
              >
                <CreditCard size={13} /> Pagar Silla (Anticipo)
              </button>
              <button
                type="button"
                onClick={() => setModoSinCosto(true)}
                className={"flex-1 py-1.5 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 " + (
                  modoSinCosto
                    ? "bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    : "bg-transparent text-perla/60 hover:text-perla border border-perla/20"
                )}
              >
                <CalendarIcon size={13} /> Agendar Cita (Sin Costo)
              </button>
            </div>

            {/* Contenedor con Scroll */}
            <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-4">
              {/* PASO 0: SERVICIO */}
              {step === 0 && (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest font-bold text-mostaza mb-2">Selecciona tu Paquete o Especialidad:</p>
                  {SERVICIOS.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelServicio(s)}
                      className={"flex gap-4 items-center p-3.5 rounded-xl border-2 cursor-pointer transition-all " + (
                        selServicio?.id === s.id
                          ? "border-mostaza bg-mostaza/15 shadow-glow-smoke scale-[1.01]"
                          : "border-perla/10 bg-marron/60 hover:border-mostaza/40"
                      )}
                    >
                      <img src={s.img} alt={s.nombre} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-mostaza/30" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className={"font-serif text-base uppercase tracking-wider " + (selServicio?.id === s.id ? "text-mostaza" : "text-perla")}>
                            {s.nombre}
                          </h4>
                          <span className="font-bold text-mostaza font-mono">${s.precio} MXN</span>
                        </div>
                        <p className="text-xs text-perla/70 mt-1 line-clamp-2">{s.desc}</p>
                        <span className="text-[11px] text-perla/50 font-bold mt-1 inline-block">Duración: {s.tiempo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PASO 1: BARBERO */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest font-bold text-mostaza mb-2">Elige a tu Maestro Barbero:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BARBEROS.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelBarbero(b)}
                        className={"p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3.5 " + (
                          selBarbero?.id === b.id
                            ? "border-mostaza bg-mostaza/15 shadow-glow-smoke scale-[1.01]"
                            : "border-perla/10 bg-marron/60 hover:border-mostaza/40"
                        )}
                      >
                        <img src={b.img} alt={b.nombre} className="w-14 h-14 rounded-full object-cover border-2 border-mostaza flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-sm text-perla leading-tight truncate">{b.nombre}</h5>
                          <p className="text-xs text-mostaza font-bold mt-0.5">{b.alias}</p>
                          <p className="text-[11px] text-perla/60 truncate">{b.puesto}</p>
                          <div className="flex items-center gap-1 mt-1 text-mostaza">
                            <Star size={11} fill="currentColor" />
                            <span className="text-[11px] font-bold text-perla">{b.rating} / 5.0</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PASO 2: FECHA Y SLOTS DISPONIBLES (9 AM a 4 PM con 15 min de limpieza) */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs uppercase tracking-widest font-bold text-mostaza flex items-center gap-1.5 mb-2">
                      <CalendarIcon size={14} /> Selecciona la Fecha:
                    </label>
                    <input
                      type="date"
                      value={selFecha}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSelFecha(e.target.value)}
                      className="w-full bg-[#1E120A] border-2 border-mostaza/40 text-perla rounded-xl p-3 font-bold text-sm focus:border-mostaza outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-mostaza flex items-center gap-1.5">
                        <Clock size={14} /> Horarios Disponibles ({selBarbero?.nombre}):
                      </label>
                      <span className="text-[11px] text-perla/60">Jornada 9:00 AM - 4:00 PM</span>
                    </div>

                    <p className="text-[11px] text-perla/70 mb-3 italic">
                      * Citas cada hora. Se reservan 45 min de atención + 15 min de desinfección y preparación de silla.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {SLOTS_DISPONIBLES.map((slot) => {
                        const isSelected = selHora === slot.hora;
                        return (
                          <button
                            key={slot.hora}
                            type="button"
                            onClick={() => setSelHora(slot.hora)}
                            className={"p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center " + (
                              isSelected
                                ? "bg-mostaza text-marron border-mostaza font-bold shadow-[0_0_12px_rgba(225,173,1,0.5)] scale-105"
                                : "bg-marron/70 border-perla/15 text-perla hover:border-mostaza/60 hover:bg-marron"
                            )}
                          >
                            <span className="text-sm font-bold font-mono">{slot.hora}</span>
                            <span className={"text-[10px] mt-1 " + (isSelected ? "text-marron font-semibold" : "text-perla/60")}>
                              Disponible
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3: CONFIRMACIÓN, DATOS Y PAGO / AGENDADO DIRECTO */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Tarjeta de Barbero y Cita Seleccionada */}
                  <div className="bg-[#1E120A] p-4 rounded-xl border border-mostaza/40 space-y-3">
                    <div className="flex items-center gap-3.5 pb-3 border-b border-mostaza/20">
                      <img
                        src={selBarbero?.img || "/media/luis.jpeg"}
                        alt={selBarbero?.nombre}
                        className="w-14 h-14 rounded-full object-cover border-2 border-mostaza flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-mostaza tracking-widest block">Maestro Barbero Asignado</span>
                        <h4 className="font-bold text-base text-perla truncate">{selBarbero?.nombre}</h4>
                        <p className="text-xs text-mostaza font-medium">{selBarbero?.puesto} • {selBarbero?.alias}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Selector o cambio de servicio en pantalla de cobro */}
                      <div className="flex justify-between items-center">
                        <span className="text-perla/60">Servicio Seleccionado:</span>
                        <select
                          value={selServicio?.id || SERVICIOS[0].id}
                          onChange={(e) => {
                            const found = SERVICIOS.find((s) => s.id === e.target.value);
                            if (found) setSelServicio(found);
                          }}
                          className="bg-[#2A1A0F] border border-mostaza/40 text-mostaza font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-mostaza"
                        >
                          {SERVICIOS.map((s) => (
                            <option key={s.id} value={s.id} className="bg-[#2A1A0F] text-perla">
                              {s.nombre} - ${s.precio} MXN
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-perla/60">Fecha & Hora:</span>
                        <span className="font-bold text-perla">{selFecha} a las {selHora}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-perla/60">Horario de Silla:</span>
                        <span className="text-perla/80">{selHora} a {SLOTS_DISPONIBLES.find(s=>s.hora===selHora)?.finServicio || "45 min"} (15 min limpieza posterior)</span>
                      </div>

                      {/* Modalidad y Desglose */}
                      <div className="flex justify-between border-t border-mostaza/20 pt-2.5 items-center">
                        <div>
                          <span className="text-xs font-bold text-mostaza block">
                            {modoSinCosto ? "Modalidad de Reserva:" : "Total a Pagar (Stripe):"}
                          </span>
                          <span className="text-[10px] text-perla/60">
                            {modoSinCosto ? "Cita libre de cargo anticipado" : "Garantiza el 100% de tu turno"}
                          </span>
                        </div>
                        <div className="text-right">
                          {modoSinCosto ? (
                            <div>
                              <span className="text-emerald-400 font-mono text-lg font-bold block">$0 MXN</span>
                              <span className="text-[10px] text-perla/70">Pagas en el local: ${precioOriginal} MXN</span>
                            </div>
                          ) : (
                            <span className="text-mostaza font-mono text-xl font-bold">
                              ${precioConDescuento} MXN
                              {descuentoVip && <span className="text-xs text-emerald-400 font-normal ml-2 block">(-20% VIP)</span>}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banner 20% OFF si no está activo y modo con cobro */}
                  {!modoSinCosto && !descuentoVip && (
                    <div className="bg-mostaza/10 border border-mostaza/30 p-3 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-mostaza">¿Tienes membresía o código VIP?</span>
                        <p className="text-perla/70 text-[11px]">Los miembros del Club VIP reciben 20% OFF en todos los cortes.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDescuentoVip(true)}
                        className="text-xs font-bold bg-mostaza text-marron px-3 py-1.5 rounded uppercase hover:bg-perla transition"
                      >
                        Aplicar IRON20-VIP
                      </button>
                    </div>
                  )}

                  {/* Formulario Cliente */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-perla/70 block mb-1">Nombre Completo:</label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ingresa tu nombre y apellido"
                        className="w-full bg-[#1E120A] border border-perla/20 text-perla rounded-lg p-3 text-sm focus:border-mostaza outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-perla/70 block mb-1">Teléfono Móvil (Para confirmación y SMS):</label>
                      <input
                        type="tel"
                        value={telefonoCliente}
                        onChange={(e) => setTelefonoCliente(e.target.value)}
                        placeholder="+52 686 000 0000"
                        className="w-full bg-[#1E120A] border border-perla/20 text-perla rounded-lg p-3 text-sm focus:border-mostaza outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-marron/60 rounded-lg border border-perla/10 text-[11px] text-perla/70 flex items-start gap-2">
                    <ShieldCheck size={16} className="text-mostaza flex-shrink-0 mt-0.5" />
                    <span>
                      {modoSinCosto 
                        ? "Tu cita se registrará en la agenda oficial del barbero y se le enviará un SMS automático de notificación. Podrás pagar al terminar en la barbería."
                        : "Tu pago apartará tu horario de forma definitiva en la agenda central del barbero. Al confirmar se enviará una notificación SMS directa a su celular."}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Navegación Footer */}
            <div className="flex justify-between items-center px-6 py-4 bg-marron border-t border-mostaza/20 flex-shrink-0">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="flex items-center gap-1 text-perla/60 hover:text-mostaza disabled:opacity-20 transition font-bold text-xs uppercase"
              >
                <ChevronLeft size={16} /> Atrás
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canNext()}
                  className="flex items-center gap-1 bg-mostaza text-marron font-bold px-6 py-2.5 rounded-xl uppercase tracking-widest text-xs disabled:opacity-40 hover:bg-perla transition shadow-glow-smoke"
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              ) : modoSinCosto ? (
                <button
                  type="button"
                  onClick={handleConfirmarCita}
                  disabled={!canNext()}
                  className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-7 py-3 rounded-xl uppercase tracking-widest text-xs disabled:opacity-40 hover:bg-emerald-500 transition shadow-glow-smoke"
                >
                  <CalendarIcon size={16} /> Agendar Cita (Sin Costo)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmarCita}
                  disabled={!canNext()}
                  className="flex items-center gap-2 bg-mostaza text-marron font-bold px-7 py-3 rounded-xl uppercase tracking-widest text-xs disabled:opacity-40 hover:bg-emerald-500 hover:text-white transition shadow-glow-smoke"
                >
                  <CreditCard size={16} /> Pagar Silla (${precioConDescuento} MXN)
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
