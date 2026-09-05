import React, { useState } from "react";
import { X, ChevronRight, ChevronLeft, Check, Star } from "lucide-react";

const SERVICIOS = [
  { id: "signature", nombre: "Corte Signature", precio: 250, tiempo: "35 min", img: "/media/corte_cabello.jpeg" },
  { id: "ritual", nombre: "Ritual de Barba Clasico", precio: 200, tiempo: "30 min", img: "/media/ritual_barba.jpeg" },
  { id: "combo", nombre: "Combo Ejecutivo", precio: 400, tiempo: "55 min", img: "/media/combo_ejecutivo.jpeg" },
  { id: "tattoo", nombre: "Hair Tattoo", precio: 150, tiempo: "25 min", img: "/media/hair_tattoo.jpeg" },
  { id: "express", nombre: "Servicio Express", precio: 120, tiempo: "15 min", img: "/media/servicio_express.jpeg" },
];

const BARBEROS = [
  { id: "marcos", nombre: "Marcos Thorne", alias: '"Mano de Hierro"', rating: 4.9, img: "/media/luis.jpeg" },
  { id: "alex", nombre: 'Alejandro "Alex" Vega', alias: '"Ancla"', rating: 5.0, img: "/media/javier.jpeg" },
  { id: "diego", nombre: "Diego Navarro", alias: '"Line"', rating: 4.8, img: "/media/omar.jpeg" },
  { id: "mateo", nombre: "Mateo Rivas", alias: '"Express"', rating: 4.7, img: "/media/mateo.jpeg" },
  { id: "elena", nombre: "Elena Salcedo", alias: '"Experiencia"', rating: 4.9, img: "/media/nicole.jpeg" },
  { id: "lucas", nombre: "Lucas Castillo", alias: '"Precision"', rating: 4.8, img: "/media/alan.jpeg" },
];

const HORARIOS = ["10:00 AM","10:45 AM","11:30 AM","12:15 PM","01:00 PM","01:45 PM","03:00 PM","03:45 PM","04:30 PM","05:15 PM"];
const STEPS = ["Servicio","Barbero","Fecha & Hora","Confirmar"];

export default function BookingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [selServicio, setSelServicio] = useState(null);
  const [selBarbero, setSelBarbero] = useState(null);
  const [selFecha, setSelFecha] = useState("");
  const [selHora, setSelHora] = useState(null);
  const [nombre, setNombre] = useState("");
  const [done, setDone] = useState(false);

  const back = () => setStep(s => Math.max(s - 1, 0));
  const next = () => setStep(s => Math.min(s + 1, 3));
  const canNext = () => {
    if (step === 0) return !!selServicio;
    if (step === 1) return !!selBarbero;
    if (step === 2) return selFecha && selHora;
    return nombre.length > 2;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(20,10,5,0.88)",backdropFilter:"blur(10px)"}}>
      <div className="relative w-full max-w-lg bg-[#2A1A0F] border border-mostaza/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-marron border-b border-mostaza/30">
          <h2 className="text-mostaza font-serif text-xl uppercase tracking-widest">Reserva tu Silla</h2>
          <button onClick={onClose} className="text-perla/50 hover:text-mostaza transition"><X size={20}/></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 py-14 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-mostaza/20 flex items-center justify-center">
              <Check size={36} className="text-mostaza"/>
            </div>
            <h3 className="text-2xl font-serif text-perla">Cita Confirmada</h3>
            <p className="text-perla/70 text-sm">Lugar reservado con <span className="text-mostaza font-bold">{selBarbero?.nombre}</span> el <span className="text-mostaza font-bold">{selFecha}</span> a las <span className="text-mostaza font-bold">{selHora}</span>.</p>
            <button onClick={onClose} className="mt-4 px-8 py-3 bg-mostaza text-marron font-bold rounded-lg uppercase tracking-widest hover:bg-perla transition">Cerrar</button>
          </div>
        ) : (
          <>
            <div className="flex border-b border-mostaza/20">
              {STEPS.map((s,i) => (
                <div key={s} className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider transition ${i===step?"text-mostaza border-b-2 border-mostaza":i<step?"text-green-400":"text-perla/30"}`}>
                  {i < step && <Check size={10} className="inline mr-0.5"/>}{s}
                </div>
              ))}
            </div>

            <div className="p-6 min-h-72 max-h-[58vh] overflow-y-auto">
              {step === 0 && (
                <div className="grid gap-3">
                  {SERVICIOS.map(s => (
                    <button key={s.id} onClick={() => setSelServicio(s)} className={`flex gap-4 items-center px-4 py-3 rounded-xl border text-left transition shadow-glow-smoke ${selServicio?.id===s.id?"border-mostaza bg-mostaza/10":"border-perla/10 bg-marron/50 hover:border-mostaza/50"}`}>
                      <img src={s.img} alt={s.nombre} className="w-14 h-14 rounded-lg object-cover flex-shrink-0"/>
                      <div>
                        <p className={`font-bold ${selServicio?.id===s.id?"text-mostaza":"text-perla"}`}>{s.nombre}</p>
                        <p className="text-perla/50 text-sm">${s.precio} MXN &middot; {s.tiempo}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {BARBEROS.map(b => (
                    <button key={b.id} onClick={() => setSelBarbero(b)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition shadow-glow-smoke ${selBarbero?.id===b.id?"border-mostaza bg-mostaza/10":"border-perla/10 bg-marron/50 hover:border-mostaza/50"}`}>
                      <img src={b.img} alt={b.nombre} className="w-14 h-14 rounded-full object-cover border-2 border-mostaza"/>
                      <span className="text-perla font-bold text-xs text-center leading-tight">{b.nombre}</span>
                      <span className="text-mostaza text-xs">{b.alias}</span>
                      <div className="flex gap-0.5">{[...Array(5)].map((_,i)=><Star key={i} size={10} fill={i<Math.floor(b.rating)?"#E1AD01":"transparent"} stroke="#E1AD01"/>)}</div>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="text-mostaza text-xs font-bold uppercase tracking-widest mb-2 block">Fecha</label>
                    <input type="date" value={selFecha} onChange={e=>setSelFecha(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full bg-marron border border-perla/20 text-perla rounded-lg px-4 py-3 focus:border-mostaza outline-none"/>
                  </div>
                  <div>
                    <label className="text-mostaza text-xs font-bold uppercase tracking-widest mb-2 block">Horario Disponible</label>
                    <div className="grid grid-cols-3 gap-2">
                      {HORARIOS.map(h=>(
                        <button key={h} onClick={()=>setSelHora(h)} className={`py-2 rounded-lg text-sm font-bold transition ${selHora===h?"bg-mostaza text-marron":"bg-marron border border-perla/10 text-perla hover:border-mostaza"}`}>{h}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="bg-marron rounded-xl p-5 border border-mostaza/20 space-y-3">
                    <div className="flex justify-between"><span className="text-perla/60 text-sm">Servicio</span><span className="text-perla font-bold">{selServicio?.nombre}</span></div>
                    <div className="flex justify-between"><span className="text-perla/60 text-sm">Barbero</span><span className="text-perla font-bold">{selBarbero?.nombre}</span></div>
                    <div className="flex justify-between"><span className="text-perla/60 text-sm">Fecha</span><span className="text-perla font-bold">{selFecha}</span></div>
                    <div className="flex justify-between"><span className="text-perla/60 text-sm">Hora</span><span className="text-perla font-bold">{selHora}</span></div>
                    <div className="flex justify-between border-t border-mostaza/20 pt-3"><span className="text-mostaza font-bold">Total</span><span className="text-mostaza text-xl font-bold">${selServicio?.precio} MXN</span></div>
                  </div>
                  <input type="text" placeholder="Tu nombre completo" value={nombre} onChange={e=>setNombre(e.target.value)} className="w-full bg-marron border border-perla/20 text-perla rounded-lg px-4 py-3 placeholder:text-perla/30 focus:border-mostaza outline-none"/>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center px-6 py-4 bg-marron border-t border-mostaza/20">
              <button onClick={back} disabled={step===0} className="flex items-center gap-1 text-perla/50 hover:text-mostaza disabled:opacity-20 transition font-bold text-sm uppercase"><ChevronLeft size={16}/>Atras</button>
              {step < 3
                ? <button onClick={next} disabled={!canNext()} className="flex items-center gap-1 bg-mostaza text-marron font-bold px-6 py-2 rounded-lg uppercase tracking-widest disabled:opacity-40 hover:bg-perla transition">Siguiente<ChevronRight size={16}/></button>
                : <button onClick={()=>setDone(true)} disabled={!canNext()} className="flex items-center gap-1 bg-mostaza text-marron font-bold px-6 py-2 rounded-lg uppercase tracking-widest disabled:opacity-40 hover:bg-green-500 transition"><Check size={16}/>Confirmar</button>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}