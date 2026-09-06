import React, { useState } from "react";
import { X, Award, CheckCircle, Sparkles, Gift, ShieldCheck, Scissors } from "lucide-react";

export default function SubscriptionModal({ isOpen, onClose, onSubscribed }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [barberoFav, setBarberoFav] = useState("Marcos Thorne");
  const [guardado, setGuardado] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !email || !telefono) {
      alert("Por favor completa todos los campos para recibir tu código del 20% OFF.");
      return;
    }

    const vipUser = {
      nombre,
      email,
      telefono,
      barberoFav,
      descuentoActivo: true,
      codigoDescuento: "IRON20-VIP",
      visitas: 1, // Primera visita registrada
      fechaRegistro: new Date().toISOString(),
    };

    localStorage.setItem("iron_vip_user", JSON.stringify(vipUser));
    setGuardado(true);
    if (onSubscribed) onSubscribed(vipUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(20, 10, 5, 0.88)", backdropFilter: "blur(12px)" }}>
      <div className="relative w-full max-w-lg bg-[#2A1A0F] border-2 border-mostaza/50 rounded-2xl shadow-glow-smoke overflow-hidden text-perla">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-5 bg-marron border-b border-mostaza/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-mostaza/20 rounded-full text-mostaza border border-mostaza/40">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-perla uppercase tracking-widest leading-none">Club VIP Iron & Anchor</h3>
              <p className="text-mostaza font-bold text-xs uppercase tracking-wider mt-1">Beneficios Exclusivos & Fidelidad</p>
            </div>
          </div>
          <button onClick={onClose} className="text-perla/50 hover:text-mostaza transition p-1">
            <X size={22} />
          </button>
        </div>

        {guardado ? (
          <div className="p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-mostaza/20 border-2 border-mostaza flex items-center justify-center text-mostaza">
              <CheckCircle size={36} />
            </div>
            <h4 className="text-2xl font-serif text-perla tracking-wide">¡Bienvenido al Club VIP!</h4>
            <div className="bg-marron/80 p-4 rounded-xl border border-mostaza/40 w-full">
              <p className="text-xs uppercase tracking-widest text-mostaza font-bold mb-1">Tu cupón exclusivo del 20% OFF:</p>
              <div className="text-2xl font-mono font-bold text-perla bg-[#1E120A] py-2 px-4 rounded border border-mostaza tracking-widest select-all">
                IRON20-VIP
              </div>
              <p className="text-xs text-perla/70 mt-2">Aplicado automáticamente en tu siguiente reserva y cobro.</p>
            </div>

            {/* Tarjeta de fidelidad digital (7 visitas) */}
            <div className="w-full bg-[#1E120A] p-4 rounded-xl border border-perla/10 text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-mostaza uppercase tracking-wider flex items-center gap-1">
                  <Scissors size={14} /> Pasaporte de Fidelidad
                </span>
                <span className="text-xs text-perla/70 font-mono">1 de 7 visitas</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div
                    key={num}
                    className={`py-2 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 ${
                      num === 1
                        ? "bg-mostaza text-marron border-mostaza shadow-[0_0_8px_rgba(225,173,1,0.5)]"
                        : num === 7
                        ? "bg-marron border-dashed border-mostaza text-mostaza"
                        : "bg-marron/50 border-perla/20 text-perla/40"
                    }`}
                  >
                    <span>#{num}</span>
                    {num === 7 ? <Gift size={12} className="text-mostaza" /> : <Sparkles size={10} />}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-perla/60 mt-3 text-center italic">
                * Tu 7ma visita es 100% GRATIS. Haz check-in en cada confirmación de pago para acumular.
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-2 w-full bg-mostaza text-marron font-serif text-base uppercase tracking-widest font-bold py-3 rounded-xl hover:bg-perla transition shadow-glow-smoke"
            >
              Comenzar a Reservar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Banner de promoción */}
            <div className="bg-gradient-to-r from-mostaza/20 via-marron to-mostaza/10 p-4 rounded-xl border border-mostaza/40 flex items-start gap-3">
              <Gift className="text-mostaza flex-shrink-0 mt-0.5" size={22} />
              <div>
                <p className="text-sm font-bold text-mostaza uppercase tracking-wider">20% de Descuento Inmediato</p>
                <p className="text-xs text-perla/80 leading-relaxed mt-0.5">
                  Regístrate a nuestro canal exclusivo de marketing y promociones. Recibirás descuentos por temporada y <strong>tu 7ma visita es totalmente gratis</strong>.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-perla/70 block mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Carlos Mendoza"
                className="w-full bg-[#1E120A] border border-perla/20 rounded-lg p-3 text-perla placeholder:text-perla/30 focus:border-mostaza outline-none text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-perla/70 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-[#1E120A] border border-perla/20 rounded-lg p-3 text-perla placeholder:text-perla/30 focus:border-mostaza outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-perla/70 block mb-1">Celular (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+52 686 123 4567"
                  className="w-full bg-[#1E120A] border border-perla/20 rounded-lg p-3 text-perla placeholder:text-perla/30 focus:border-mostaza outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-perla/70 block mb-1">Maestro Barbero Preferido</label>
              <select
                value={barberoFav}
                onChange={(e) => setBarberoFav(e.target.value)}
                className="w-full bg-[#1E120A] border border-perla/20 rounded-lg p-3 text-perla focus:border-mostaza outline-none text-sm font-medium"
              >
                <option value="Marcos Thorne">Marcos Thorne ("Mano de Hierro")</option>
                <option value='Alejandro "Alex" Vega'>Alejandro "Alex" Vega ("Ancla")</option>
                <option value="David Castillo">David Castillo ("Line")</option>
                <option value="Mateo Rivas">Mateo Rivas ("Express")</option>
                <option value="Elena Salcedo">Elena Salcedo ("Experiencia")</option>
                <option value="Lucas Mendoza">Lucas Mendoza ("Precisión")</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-perla/60">
              <ShieldCheck size={16} className="text-mostaza flex-shrink-0" />
              <span>Tus datos son 100% privados. No enviamos spam, solo promociones y confirmación de citas.</span>
            </div>

            <button
              type="submit"
              className="w-full bg-mostaza text-marron font-serif text-lg uppercase tracking-widest font-bold py-3.5 rounded-xl hover:bg-perla transition shadow-glow-smoke mt-2"
            >
              Suscribirme & Obtener 20% OFF
            </button>
          </form>
        )}
      </div>
    </div>
  );
}