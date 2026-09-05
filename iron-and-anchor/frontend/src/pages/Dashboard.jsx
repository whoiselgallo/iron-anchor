import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Users, Calendar as CalendarIcon, TrendingUp, Anchor, Activity, Clock, User, CheckCircle, XCircle, RefreshCw, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, subDays } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "es": es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// ─── CONSTANTES ────────────────────────────────────────────────────────────────
const BARBEROS = ["Marcos Thorne", 'Alejandro "Alex" Vega', "Diego Navarro", "Mateo Rivas", "Elena Salcedo", "Lucas Castillo"];
const SERVICIOS_TIPOS = ["Todos","Corte","Barba","Combo","Hair Tattoo","Express"];
const ESTADOS = ["Completado","No Asistio","Reagendado","Agendado"];
const CLIENTES = ["Roberto Gomez","Carlos Trejo","David Ruiz","Ernesto Paz","Marco Silva","Ivan Torres","Luis Perez","Jorge Mendez","Andres Castro","Felipe Rios","Saul Vega","Ramon Diaz","Victor Luna","Eduardo Reyes","Pablo Moreno","Gabriel Ortiz","Oscar Herrera","Daniel Soto","Ricardo Nunez","Sergio Flores"];
const SSERVICIOS = ["Corte","Barba","Combo","Hair Tattoo","Express"];
const PRECIOS = { "Corte": 250, "Barba": 200, "Combo": 400, "Hair Tattoo": 150, "Express": 120 };

const barberColors = {
  "Marcos Thorne": "#3b82f6",
  'Alejandro "Alex" Vega': "#10b981",
  "Diego Navarro": "#f59e0b",
  "Mateo Rivas": "#ef4444",
  "Elena Salcedo": "#8b5cf6",
  "Lucas Castillo": "#ec4899",
};

const estadoColors = { "Completado": "#10b981", "No Asistio": "#ef4444", "Reagendado": "#f59e0b", "Agendado": "#3b82f6" };

// ─── GENERADOR DE SIMULACION ───────────────────────────────────────────────────
function generarCitas() {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const inicio = subDays(hoy, 30);
  const fin = addDays(hoy, 30);
  const citas = [];
  let id = 1;
  for (let d = new Date(inicio); d <= fin; d = addDays(d, 1)) {
    const diaSemana = d.getDay();
    if (diaSemana === 0) continue; // sin domingos
    const citasPorDia = diaSemana === 6 ? 8 : 5;
    for (let c = 0; c < citasPorDia; c++) {
      const barbero = BARBEROS[Math.floor(Math.random() * BARBEROS.length)];
      const servicio = SSERVICIOS[Math.floor(Math.random() * SSERVICIOS.length)];
      const hora = 10 + Math.floor(c * 1.2);
      const minutos = c % 2 === 0 ? 0 : 30;
      const start = new Date(d); start.setHours(hora, minutos, 0, 0);
      const end = new Date(start); end.setMinutes(end.getMinutes() + (servicio === "Combo" ? 55 : servicio === "Barba" ? 30 : servicio === "Express" ? 15 : 35));
      let estado;
      const esPasada = d < hoy;
      const esFutura = d > hoy;
      if (esFutura) { estado = "Agendado"; }
      else if (esPasada) {
        const r = Math.random();
        estado = r < 0.72 ? "Completado" : r < 0.88 ? "No Asistio" : "Reagendado";
      } else { estado = c < 2 ? "Completado" : c < 3 ? "Agendado" : "Agendado"; }
      citas.push({
        id: id++, title: CLIENTES[id % CLIENTES.length] + " - " + servicio,
        cliente: CLIENTES[id % CLIENTES.length], barbero, servicio, estado,
        start, end, precio: PRECIOS[servicio]
      });
    }
  }
  return citas;
}

const TODAS_CITAS = generarCitas();

// ─── METRICAS SEMANALES ────────────────────────────────────────────────────────
const metricasSemana = ["Lun","Mar","Mie","Jue","Vie","Sab"].map((name,i) => ({
  name, ingresos: [4500,3200,5800,6200,8900,11200][i], clientes: [18,12,22,25,35,42][i]
}));

// ─── EVENTO STYLE ──────────────────────────────────────────────────────────────
const eventStyleGetter = (event) => ({
  style: {
    backgroundColor: estadoColors[event.estado] || barberColors[event.barbero] || "#E1AD01",
    borderRadius: "4px", color: "white", border: "0px", display: "block",
    opacity: event.estado === "No Asistio" ? 0.5 : 1,
    textDecoration: event.estado === "No Asistio" ? "line-through" : "none"
  }
});

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
const Dashboard = () => {
  const [filBarbero, setFilBarbero] = useState("Todos");
  const [filServicio, setFilServicio] = useState("Todos");
  const [filEstado, setFilEstado] = useState("Todos");

  const citasFiltradas = useMemo(() => TODAS_CITAS.filter(c => {
    if (filBarbero !== "Todos" && c.barbero !== filBarbero) return false;
    if (filServicio !== "Todos" && c.servicio !== filServicio) return false;
    if (filEstado !== "Todos" && c.estado !== filEstado) return false;
    return true;
  }), [filBarbero, filServicio, filEstado]);

  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const citasPasadas = citasFiltradas.filter(c => c.start < hoy);
  const completadas = citasPasadas.filter(c => c.estado === "Completado").length;
  const noAsistio = citasPasadas.filter(c => c.estado === "No Asistio").length;
  const reagendadas = citasPasadas.filter(c => c.estado === "Reagendado").length;
  const futuras = citasFiltradas.filter(c => c.estado === "Agendado").length;
  const ingresoTotal = citasPasadas.filter(c => c.estado === "Completado").reduce((sum,c) => sum + c.precio, 0);
  const tasaAsistencia = citasPasadas.length > 0 ? Math.round((completadas / citasPasadas.length) * 100) : 0;

  const porBarberoDatos = BARBEROS.map(b => {
    const bCitas = citasFiltradas.filter(c => c.barbero === b && c.start < hoy);
    return {
      nombre: b.split(" ")[0],
      ingresos: bCitas.filter(c => c.estado === "Completado").reduce((s,c) => s+c.precio, 0),
      completadas: bCitas.filter(c => c.estado === "Completado").length,
      noAsistio: bCitas.filter(c => c.estado === "No Asistio").length,
      reagendadas: bCitas.filter(c => c.estado === "Reagendado").length,
    };
  });

  const pieData = [
    { name: "Completadas", value: completadas, color: "#10b981" },
    { name: "No Asistio", value: noAsistio, color: "#ef4444" },
    { name: "Reagendadas", value: reagendadas, color: "#f59e0b" },
    { name: "Agendadas", value: futuras, color: "#3b82f6" },
  ];

  const agendaHoy = TODAS_CITAS.filter(c => {
    const d = new Date(c.start); d.setHours(0,0,0,0);
    return d.getTime() === hoy.getTime();
  }).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#3A2214] text-perla p-4 md:p-6 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 bg-marron p-6 rounded-xl border border-mostaza/50 shadow-glow-smoke">
        <div className="flex items-center gap-4">
          <Anchor size={40} className="text-mostaza"/>
          <div>
            <h1 className="text-3xl font-serif text-perla uppercase tracking-widest">Iron & Anchor</h1>
            <p className="text-mostaza font-bold text-sm tracking-widest">Panel de Control & Metricas</p>
          </div>
        </div>
        <Link to="/" className="px-4 py-2 bg-perla text-marron font-bold rounded hover:bg-mostaza transition">Ver Sitio</Link>
      </header>

      {/* FILTROS */}
      <div className="bg-marron rounded-xl border border-mostaza/30 shadow-glow-smoke p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-mostaza"/>
          <h3 className="text-mostaza font-bold uppercase tracking-widest text-sm">Filtrar Datos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-perla/60 text-xs uppercase tracking-wider mb-1 block">Barbero</label>
            <select value={filBarbero} onChange={e=>setFilBarbero(e.target.value)} className="w-full bg-[#2A1A0F] border border-perla/20 text-perla rounded-lg px-3 py-2 focus:border-mostaza outline-none">
              <option>Todos</option>
              {BARBEROS.map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-perla/60 text-xs uppercase tracking-wider mb-1 block">Servicio</label>
            <select value={filServicio} onChange={e=>setFilServicio(e.target.value)} className="w-full bg-[#2A1A0F] border border-perla/20 text-perla rounded-lg px-3 py-2 focus:border-mostaza outline-none">
              {SERVICIOS_TIPOS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-perla/60 text-xs uppercase tracking-wider mb-1 block">Estado</label>
            <select value={filEstado} onChange={e=>setFilEstado(e.target.value)} className="w-full bg-[#2A1A0F] border border-perla/20 text-perla rounded-lg px-3 py-2 focus:border-mostaza outline-none">
              <option>Todos</option>
              {ESTADOS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label:"Ingresos (mes)", value:`$${ingresoTotal.toLocaleString()} MXN`, icon:<DollarSign size={24} className="text-mostaza"/>, color:"border-mostaza" },
          { label:"Citas Completadas", value:completadas, icon:<CheckCircle size={24} className="text-green-400"/>, color:"border-green-500" },
          { label:"No Asistieron", value:noAsistio, icon:<XCircle size={24} className="text-red-400"/>, color:"border-red-500" },
          { label:"Reagendadas", value:reagendadas, icon:<RefreshCw size={24} className="text-yellow-400"/>, color:"border-yellow-500" },
          { label:"Agendadas (futuras)", value:futuras, icon:<CalendarIcon size={24} className="text-blue-400"/>, color:"border-blue-500" },
          { label:"Tasa Asistencia", value:`${tasaAsistencia}%`, icon:<Activity size={24} className="text-mostaza"/>, color:"border-mostaza" },
        ].map((k,i) => (
          <div key={i} className={`bg-marron p-4 rounded-xl border-l-4 ${k.color} shadow-glow-smoke flex flex-col gap-2`}>
            {k.icon}
            <p className="text-perla/70 text-xs font-bold uppercase tracking-wider">{k.label}</p>
            <h3 className="text-xl font-serif text-perla">{k.value}</h3>
          </div>
        ))}
      </div>

      {/* GRAFICAS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Ingresos semanales */}
          <div className="bg-marron p-6 rounded-xl border border-marron shadow-glow-smoke">
            <h3 className="text-xl font-serif text-mostaza tracking-widest uppercase mb-6 flex items-center gap-2"><TrendingUp size={18}/>Flujo de Ingresos (Semanal)</h3>
            <div className="h-64">
              <ResponsiveContainer width="99%" height="100%">
                <LineChart data={metricasSemana}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#5c3a21"/>
                  <XAxis dataKey="name" stroke="#F8F6F0"/>
                  <YAxis stroke="#F8F6F0"/>
                  <Tooltip contentStyle={{backgroundColor:"#4A2E1B",borderColor:"#E1AD01",color:"#F8F6F0"}}/>
                  <Legend/>
                  <Line type="monotone" dataKey="ingresos" stroke="#E1AD01" strokeWidth={3} activeDot={{r:8}} name="Ingresos (MXN)"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rendimiento por barbero */}
          <div className="bg-marron p-6 rounded-xl border border-marron shadow-glow-smoke">
            <h3 className="text-xl font-serif text-mostaza tracking-widest uppercase mb-6">Rendimiento por Silla</h3>
            <div className="h-72">
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={porBarberoDatos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#5c3a21"/>
                  <XAxis dataKey="nombre" stroke="#F8F6F0" fontSize={11}/>
                  <YAxis stroke="#F8F6F0"/>
                  <Tooltip contentStyle={{backgroundColor:"#4A2E1B",borderColor:"#E1AD01"}} cursor={{fill:"rgba(225,173,1,0.1)"}}/>
                  <Legend/>
                  <Bar dataKey="completadas" fill="#10b981" name="Completadas" radius={[4,4,0,0]}/>
                  <Bar dataKey="noAsistio" fill="#ef4444" name="No Asistio" radius={[4,4,0,0]}/>
                  <Bar dataKey="reagendadas" fill="#f59e0b" name="Reagendadas" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PIE + AGENDA HOY */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-marron p-6 rounded-xl border border-mostaza/30 shadow-glow-smoke">
            <h3 className="text-mostaza font-serif uppercase tracking-widest text-lg mb-4">Distribucion</h3>
            <div className="h-48">
              <ResponsiveContainer width="99%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {pieData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor:"#4A2E1B",borderColor:"#E1AD01",color:"#F8F6F0"}}/>
                  <Legend iconType="circle" iconSize={10}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-marron p-6 rounded-xl border border-mostaza/30 shadow-glow-smoke">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-mostaza font-serif uppercase tracking-widest text-lg">Agenda Hoy</h3>
              <Clock size={18} className="text-perla/40"/>
            </div>
            <div className="space-y-3">
              {agendaHoy.length === 0 && <p className="text-perla/40 text-sm">No hay citas hoy</p>}
              {agendaHoy.map((c,i) => (
                <div key={i} className="bg-[#2A1A0F] p-3 rounded-lg border-l-4 border-mostaza">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-perla text-sm">{c.cliente}</span>
                    <span className="text-mostaza text-xs">{format(c.start,"hh:mm aa")}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-perla/60 text-xs">{c.barbero.split(" ")[0]}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${c.estado==="Completado"?"bg-green-900/50 text-green-400":c.estado==="No Asistio"?"bg-red-900/50 text-red-400":"bg-mostaza/20 text-mostaza"}`}>{c.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CALENDARIO EXTENDIDO */}
      <div className="bg-marron p-6 rounded-xl border border-mostaza/30 shadow-glow-smoke">
        <h3 className="text-xl font-serif text-mostaza tracking-widest uppercase mb-5 flex items-center gap-2">
          <CalendarIcon size={20} className="text-perla/50"/>
          Calendario de Citas (30 dias atras / 30 dias adelante)
        </h3>
        <div className="flex flex-wrap gap-4 mb-5">
          {Object.entries(estadoColors).map(([e,c])=>(
            <div key={e} className="flex items-center gap-2 text-xs text-perla/70">
              <span className="w-3 h-3 rounded-full" style={{backgroundColor:c}}></span>{e}
            </div>
          ))}
        </div>
        <div className="h-[600px] bg-white text-black p-3 rounded-lg overflow-x-auto">
          <Calendar
            localizer={localizer}
            events={citasFiltradas}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            defaultView="month"
            views={["month","week","day"]}
            messages={{next:"Sig",previous:"Ant",today:"Hoy",month:"Mes",week:"Semana",day:"Dia"}}
            style={{minWidth:"700px"}}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;