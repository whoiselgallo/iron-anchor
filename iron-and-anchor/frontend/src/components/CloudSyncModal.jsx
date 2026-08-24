import React, { useState, useEffect } from 'react';
import { Cloud, X, FileImage, FileVideo, Unplug, Key } from 'lucide-react';

const CloudSyncModal = ({ isOpen, onClose }) => {
  const [googleSync, setGoogleSync] = useState(false);
  
  // Revisamos si venimos de regreso del flujo de Google OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sync') === 'google-success') {
      setGoogleSync(true);
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      // Solicita al backend la URL oficial de Google
      const response = await fetch(`${backendUrl}/api/media/google/auth`);
      const data = await response.json();
      
      // Redirige al usuario a la pantalla de permisos de Google
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error conectando con Google:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Contenedor del Modal con borde brillante como en la captura */}
      <div className="relative w-[90%] max-w-3xl bg-[#0F1115] border border-cyan-500 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] p-6">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <Cloud className="w-6 h-6" />
            Sincronizador de Almacenamiento en la Nube (OAuth API)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Inicia sesión para conectar tus cuentas en la nube y sincronizar tus archivos de video, audio e imágenes directamente a la Cueva:
        </p>

        {/* Grid de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Tarjeta Google Drive */}
          <div className="bg-[#161920] rounded-lg p-4 flex flex-col justify-between border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-sm flex items-center justify-center">
                  <span className="text-black font-bold text-xs">G</span>
                </div>
                <span className="text-yellow-500 font-bold">Google Drive</span>
              </div>
              {googleSync ? (
                <span className="text-xs font-semibold px-2 py-1 rounded bg-green-900/40 text-green-400 border border-green-800">
                  Sincronizado
                </span>
              ) : (
                <span className="text-xs font-semibold px-2 py-1 rounded bg-red-900/40 text-red-400 border border-red-800">
                  Desconectado
                </span>
              )}
            </div>

            {/* Archivos Sincronizados (Simulado/Mock si está conectado) */}
            {googleSync && (
              <div className="text-xs text-gray-400 mb-4 space-y-1">
                <div className="flex items-center gap-2"><FileImage className="w-3 h-3 text-cyan-400"/> Invitado_Guero_Ep18.png</div>
                <div className="flex items-center gap-2"><FileVideo className="w-3 h-3 text-purple-400"/> Grabacion_Calle_Ep18.mp4</div>
              </div>
            )}

            {googleSync ? (
              <button 
                onClick={() => setGoogleSync(false)}
                className="w-full mt-auto py-2 flex items-center justify-center gap-2 text-sm font-semibold rounded-md border border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 transition">
                <Unplug className="w-4 h-4" /> Desconectar Cuenta
              </button>
            ) : (
              <button 
                onClick={handleGoogleLogin}
                className="w-full mt-auto py-2 flex items-center justify-center gap-2 text-sm font-semibold rounded-md bg-cyan-900/20 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/40 transition">
                <Key className="w-4 h-4" /> Iniciar Sesión / Sincronizar
              </button>
            )}
          </div>

          {/* Tarjeta Dropbox */}
          <div className="bg-[#161920] rounded-lg p-4 flex flex-col justify-between border border-gray-800 opacity-60">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-xs">D</span>
                </div>
                <span className="text-blue-500 font-bold">Dropbox</span>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-red-900/40 text-red-400 border border-red-800">
                Desconectado
              </span>
            </div>
            <button className="w-full mt-auto py-2 flex items-center justify-center gap-2 text-sm font-semibold rounded-md bg-cyan-900/20 border border-cyan-800 text-cyan-400 cursor-not-allowed">
              <Key className="w-4 h-4" /> Próximamente
            </button>
          </div>

        </div>

        {/* Boton Inferior */}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-cyan-800 text-cyan-400 rounded-md hover:bg-cyan-900/30 transition text-sm font-semibold">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudSyncModal;
