import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, Calendar as CalendarIcon, TrendingUp, Anchor, Activity, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'es': es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Datos Simulados del Dashboard
const metricasMensuales = [
  { name: 'Lun', ingresos: 4500, clientes: 18 },
  { name: 'Mar', ingresos: 3200, clientes: 12 },
  { name: 'Mié', ingresos: 5800, clientes: 22 },
  { name: 'Jue', ingresos: 6200, clientes: 25 },
  { name: 'Vie', ingresos: 8900, clientes: 35 },
  { name: 'Sáb', ingresos: 11200, clientes: 42 },
  { name: 'Dom', ingresos: 7500, clientes: 28 },
];

const metricasBarberos = [
  { nombre: 'Luis Mendoza', ingresos: 12500, citas: 45, silla: 'Silla 1' },
  { nombre: 'Javier Espinoza', ingresos: 14200, citas: 50, silla: 'Silla 2' },
  { nombre: 'Omar Ortiz', ingresos: 9800, citas: 38, silla: 'Silla 3' },
  { nombre: 'Mateo Ríos', ingresos: 11000, citas: 60, silla: 'Silla 4' },
  { nombre: 'Nicole Ponce', ingresos: 13500, citas: 48, silla: 'Silla 5' },
  { nombre: 'Alan Castro', ingresos: 10500, citas: 40, silla: 'Silla 6' },
];

const agendaHoy = [
  { hora: '10:00 AM', cliente: 'Roberto Gómez', barbero: 'Luis Mendoza', servicio: 'Combo Ejecutivo', estado: 'Completado' },
  { hora: '11:30 AM', cliente: 'Carlos Trejo', barbero: 'Javier Espinoza', servicio: 'Ritual Clásico', estado: 'En proceso' },
  { hora: '01:00 PM', cliente: 'David Ruiz', barbero: 'Mateo Ríos', servicio: 'Express', estado: 'Agendado' },
  { hora: '03:45 PM', cliente: 'Ernesto Paz', barbero: 'Nicole Ponce', servicio: 'Corte Signature', estado: 'Agendado' },
];

const barberColors = {
  'Luis Mendoza': '#3b82f6', // azul
  'Javier Espinoza': '#10b981', // verde
  'Omar Ortiz': '#f59e0b', // naranja
  'Mateo Ríos': '#ef4444', // rojo
  'Nicole Ponce': '#8b5cf6', // morado
  'Alan Castro': '#ec4899', // rosa
};

const getBaseDate = () => {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
}

const eventosAgenda = [
  {
    title: 'Luis Mendoza (Disponible)',
    start: new Date(getBaseDate().getTime() + 10 * 60 * 60 * 1000),
    end: new Date(getBaseDate().getTime() + 14 * 60 * 60 * 1000),
    barbero: 'Luis Mendoza',
    isAvailable: true
  },
  {
    title: 'Roberto Gómez - Corte',
    start: new Date(getBaseDate().getTime() + 10 * 60 * 60 * 1000),
    end: new Date(getBaseDate().getTime() + 11 * 60 * 60 * 1000),
    barbero: 'Luis Mendoza',
    isAvailable: false
  },
  {
    title: 'Javier Espinoza (Disponible)',
    start: new Date(getBaseDate().getTime() + 11 * 60 * 60 * 1000),
    end: new Date(getBaseDate().getTime() + 18 * 60 * 60 * 1000),
    barbero: 'Javier Espinoza',
    isAvailable: true
  },
  {
    title: 'Nicole Ponce (Disponible)',
    start: new Date(getBaseDate().getTime() + 13 * 60 * 60 * 1000),
    end: new Date(getBaseDate().getTime() + 19 * 60 * 60 * 1000),
    barbero: 'Nicole Ponce',
    isAvailable: true
  },
  {
    title: 'Ernesto Paz - Signature',
    start: new Date(getBaseDate().getTime() + 15 * 60 * 60 * 1000 + 45 * 60 * 1000),
    end: new Date(getBaseDate().getTime() + 16 * 60 * 60 * 1000 + 20 * 60 * 1000),
    barbero: 'Nicole Ponce',
    isAvailable: false
  },
];

const eventStyleGetter = (event, start, end, isSelected) => {
  const backgroundColor = barberColors[event.barbero] || '#E1AD01';
  const style = {
    backgroundColor,
    borderRadius: '4px',
    opacity: event.isAvailable ? 0.6 : 1,
    color: 'white',
    border: '0px',
    display: 'block',
    borderLeft: event.isAvailable ? '4px solid white' : 'none'
  };
  return { style };
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-[#3A2214] text-perla p-6 font-sans">
      {/* HEADER DASHBOARD */}
      <header className="flex justify-between items-center mb-8 bg-marron p-6 rounded-xl border border-mostaza/50 shadow-glow-smoke">
        <div className="flex items-center gap-4">
          <Anchor size={40} className="text-mostaza" />
          <div>
            <h1 className="text-3xl font-serif text-perla uppercase tracking-widest">Iron & Anchor</h1>
            <p className="text-mostaza font-bold text-sm tracking-widest">Panel de Control & Stripe Metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-perla/70">Admin User</p>
            <p className="text-xs text-mostaza">Conectado a Stripe Connect</p>
          </div>
          <Link to="/" className="px-4 py-2 bg-perla text-marron font-bold rounded hover:bg-mostaza transition">Ver Sitio</Link>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-marron p-6 rounded-xl border-l-4 border-mostaza shadow-glow-smoke flex items-center justify-between">
          <div>
            <p className="text-perla/70 text-sm font-bold uppercase tracking-wider mb-1">Ingresos de Hoy</p>
            <h3 className="text-3xl font-serif text-perla">$15,400 MXN</h3>
          </div>
          <div className="bg-mostaza/20 p-3 rounded-full"><DollarSign size={28} className="text-mostaza" /></div>
        </div>
        
        <div className="bg-marron p-6 rounded-xl border-l-4 border-mostaza shadow-glow-smoke flex items-center justify-between">
          <div>
            <p className="text-perla/70 text-sm font-bold uppercase tracking-wider mb-1">Citas Activas</p>
            <h3 className="text-3xl font-serif text-perla">24</h3>
          </div>
          <div className="bg-mostaza/20 p-3 rounded-full"><CalendarIcon size={28} className="text-mostaza" /></div>
        </div>

        <div className="bg-marron p-6 rounded-xl border-l-4 border-mostaza shadow-glow-smoke flex items-center justify-between">
          <div>
            <p className="text-perla/70 text-sm font-bold uppercase tracking-wider mb-1">Tasa de Ocupación</p>
            <h3 className="text-3xl font-serif text-perla">85%</h3>
          </div>
          <div className="bg-mostaza/20 p-3 rounded-full"><Activity size={28} className="text-mostaza" /></div>
        </div>

        <div className="bg-marron p-6 rounded-xl border-l-4 border-mostaza shadow-glow-smoke flex items-center justify-between">
          <div>
            <p className="text-perla/70 text-sm font-bold uppercase tracking-wider mb-1">Nuevos Clientes</p>
            <h3 className="text-3xl font-serif text-perla">+12</h3>
          </div>
          <div className="bg-mostaza/20 p-3 rounded-full"><Users size={28} className="text-mostaza" /></div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* GRÁFICAS */}
        <div className="xl:col-span-2 space-y-8">
          {/* Ingresos Semanales */}
          <div className="bg-marron p-6 rounded-xl border border-marron shadow-glow-smoke">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-mostaza tracking-widest uppercase">Flujo de Ingresos (Semanal)</h3>
              <TrendingUp size={20} className="text-perla/50" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="99%" height="100%">
                <LineChart data={metricasMensuales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#5c3a21" />
                  <XAxis dataKey="name" stroke="#F8F6F0" />
                  <YAxis stroke="#F8F6F0" />
                  <Tooltip contentStyle={{ backgroundColor: '#4A2E1B', borderColor: '#E1AD01', color: '#F8F6F0' }} />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#E1AD01" strokeWidth={3} activeDot={{ r: 8 }} name="Ingresos (MXN)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rendimiento por Silla */}
          <div className="bg-marron p-6 rounded-xl border border-marron shadow-glow-smoke">
            <h3 className="text-xl font-serif text-mostaza tracking-widest uppercase mb-6">Métricas por Silla (Stripe Connect)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={metricasBarberos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#5c3a21" />
                  <XAxis dataKey="nombre" stroke="#F8F6F0" fontSize={12} />
                  <YAxis stroke="#F8F6F0" />
                  <Tooltip contentStyle={{ backgroundColor: '#4A2E1B', borderColor: '#E1AD01' }} cursor={{fill: 'rgba(225, 173, 1, 0.1)'}} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#E1AD01" name="Volumen Procesado (MXN)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="citas" fill="#F8F6F0" name="Citas Atendidas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AGENDA CENTRALIZADA SIDEBAR */}
        <div className="xl:col-span-1">
          <div className="bg-marron p-6 rounded-xl border border-mostaza/30 shadow-glow-smoke h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-mostaza tracking-widest uppercase">Agenda Central</h3>
              <Clock size={20} className="text-perla/50" />
            </div>

            <div className="space-y-4">
              {agendaHoy.map((cita, idx) => (
                <div key={idx} className="bg-[#2A1A0F] p-4 rounded-lg border-l-4 border-mostaza flex flex-col gap-2 relative group hover:bg-[#3A2214] transition">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-perla text-lg">{cita.cliente}</span>
                    <span className="text-mostaza font-bold text-sm bg-mostaza/10 px-2 py-1 rounded">{cita.hora}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-perla/70 flex items-center gap-1"><User size={14}/> {cita.barbero}</span>
                    <span className="text-perla/50 italic">{cita.servicio}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-marron/50 flex justify-between items-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider
                      ${cita.estado === 'Completado' ? 'bg-green-900/50 text-green-400' : 
                        cita.estado === 'En proceso' ? 'bg-mostaza/20 text-mostaza' : 
                        'bg-blue-900/50 text-blue-400'}`}>
                      {cita.estado}
                    </span>
                    <button className="text-xs text-mostaza underline opacity-0 group-hover:opacity-100 transition">Gestionar Pago</button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border-2 border-mostaza text-mostaza font-bold rounded uppercase tracking-widest hover:bg-mostaza hover:text-marron transition">
              Ver Toda la Agenda
            </button>
          </div>
        </div>
      </div>

      {/* CALENDARIO DE DISPONIBILIDAD */}
      <div className="mt-8 bg-marron p-6 rounded-xl border border-mostaza/30 shadow-glow-smoke">
        <h3 className="text-xl font-serif text-mostaza tracking-widest uppercase mb-6 flex items-center gap-2">
          <CalendarIcon size={20} className="text-perla/50" />
          Calendario de Disponibilidad
        </h3>
        
        {/* Leyenda de Colores */}
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(barberColors).map(([name, color]) => (
            <div key={name} className="flex items-center gap-2 text-sm text-perla/70">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></span>
              {name}
            </div>
          ))}
        </div>

        <div className="h-[600px] bg-white text-black p-4 rounded-lg overflow-x-auto">
          <Calendar
            localizer={localizer}
            events={eventosAgenda}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            messages={{
              next: "Sig",
              previous: "Ant",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día"
            }}
            defaultView="week"
            views={['month', 'week', 'day']}
            style={{ minWidth: '800px' }}
          />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
