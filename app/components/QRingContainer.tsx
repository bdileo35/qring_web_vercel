"use client";
import { useState, useEffect } from "react";
import QRCodeDisplay from './QRCodeDisplay';
import { MdLocationCity, MdPerson } from "react-icons/md";
import { formatearNumeroWhatsApp } from '../utils/whatsappFormatter';

interface PisoConfig {
  nombre: string;
  dptos: string[];
}

interface TimbreConfig {
  id: string;
  piso: string;
  dpto: string;
  numero: string;
  metodo: string;
  estado: string;
  esPropio: boolean;
  estadoAsignacion: string;
}

interface QRingContainerProps {
  calle: string;
  numero: string;
  idUnico: string;
  estructura: PisoConfig[];
  timbres?: TimbreConfig[];
  onTimbreTocado?: (piso: string | number, dpto: string) => void;
  showBottomButtons?: boolean;
  onTiendaClick?: () => void;
  onUsuariosClick?: () => void;
}

export default function QRingContainer({
  calle,
  numero,
  idUnico,
  estructura,
  timbres = [],
  onTimbreTocado,
  showBottomButtons = false,
  onTiendaClick,
  onUsuariosClick
}: QRingContainerProps) {
  const [tab, setTab] = useState<'Piso' | 'Dpto'>('Piso');
  const [pisoSel, setPisoSel] = useState<string | number | null>(null);
  const [dptoSel, setDptoSel] = useState<string | null>(null);
  const [showRing, setShowRing] = useState(false);
  const [showModalIDU, setShowModalIDU] = useState(false);
  const [inputIDU, setInputIDU] = useState('');

  // Derivar listas de pisos y dptos de la estructura
  const pisosConfig = estructura?.map((piso: PisoConfig) => piso.nombre) || [];
  const dptosDelPisoSel = pisoSel ? 
    estructura?.find((p: PisoConfig) => p.nombre === pisoSel)?.dptos || [] : [];

  // Función para verificar si un timbre está configurado
  const isTimbreConfigurado = (piso: string, dpto: string) => {
    const timbre = timbres.find(t => t.piso === piso && t.dpto === dpto);
    return timbre && (timbre.estadoAsignacion === 'configurado' || timbre.estadoAsignacion === 'asignado');
  };



  // Función para obtener el estilo de un botón según su estado
  const getButtonStyle = (isSelected: boolean, isConfigurado: boolean) => {
    const baseStyle = {
      fontSize: 18,
      fontWeight: 700,
      border: '2px solid',
      borderRadius: 12,
      padding: '8px 0',
      cursor: 'pointer',
      transition: 'all 0.2s'
    };

    if (isSelected) {
      return {
        ...baseStyle,
        background: '#1a4fa3',
        color: '#fff',
        borderColor: '#1a4fa3',
        boxShadow: '0 2px 8px #0002'
      };
    }

    if (isConfigurado) {
      return {
        ...baseStyle,
        background: '#eaf4ff',
        color: '#1a4fa3',
        borderColor: '#1a4fa3',
        boxShadow: '0 1px 4px rgba(26, 79, 163, 0.2)'
      };
    }

    return {
      ...baseStyle,
      background: '#f8f9fa',
      color: '#999',
      borderColor: '#e0e0e0',
      boxShadow: 'none'
    };
  };

  const handlePisoSelect = (piso: string | number) => {
    setPisoSel(piso);
    setDptoSel(null);
    setTab('Dpto');
  };

  const handleDptoSelect = (dpto: string) => {
    setDptoSel(dpto);
  };

  const handleTocarTimbre = () => {
    if (!pisoSel || !dptoSel) return;
    
    // Verificar si el timbre está configurado
    if (!isTimbreConfigurado(pisoSel.toString(), dptoSel)) {
      alert('Este timbre no está configurado. Contacta al administrador del edificio.');
      return;
    }
    
    // Buscar el timbre configurado
    const timbreConfigurado = timbres.find(t => t.piso === pisoSel.toString() && t.dpto === dptoSel);
    
    if (!timbreConfigurado || !timbreConfigurado.numero) {
      alert('Error: No se encontró el número configurado para este timbre.');
      return;
    }
    
    setShowRing(true);
    setTimeout(() => {
      if (onTimbreTocado) {
        onTimbreTocado(pisoSel, dptoSel);
      } else {
        // Comportamiento por defecto: abrir WhatsApp o llamada según método
        const mensaje = encodeURIComponent(`Hola, estoy en la puerta de ${calle} ${numero}, timbre ${pisoSel}${dptoSel}.`);
        
        if (timbreConfigurado.metodo === 'mensaje' || timbreConfigurado.metodo === 'video') {
          // Abrir WhatsApp directamente con número formateado
          const numeroFormateado = formatearNumeroWhatsApp(timbreConfigurado.numero);
          window.open(`whatsapp://send?phone=${numeroFormateado}&text=${mensaje}`, '_blank');
        } else if (timbreConfigurado.metodo === 'llamada') {
          // Abrir llamada directamente con número formateado
          const numeroFormateado = formatearNumeroWhatsApp(timbreConfigurado.numero);
          window.open(`tel:${numeroFormateado}`, '_blank');
        }
      }
      setShowRing(false);
    }, 2500);
  };

  const handleUsuariosClick = () => {
    setShowModalIDU(true);
  };

  const handleIrAlPanel = () => {
    if (inputIDU.trim()) {
      window.open(`/admin/wizard-estructura?idUnico=${inputIDU.trim()}`, '_blank');
      setShowModalIDU(false);
      setInputIDU('');
    }
  };

  const isButtonDisabled = !pisoSel || !dptoSel;

  return (
    <>
      {/* Modal Ring...Ring... */}
      {showRing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(30,40,60,0.18)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px #0003',
            padding: '48px 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 320,
            animation: 'pop 0.3s',
          }}>
            <span style={{ fontSize: 54, color: '#1a4fa3', animation: 'shake 0.7s infinite' }}>🔔</span>
            <div style={{ fontWeight: 900, fontSize: 28, color: '#1a4fa3', margin: '18px 0 8px 0', letterSpacing: 1 }}>Ring... Ring...</div>
            <div style={{ color: '#222', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
              Tocando timbre en<br /><b>{calle} {numero}, {pisoSel}{dptoSel}</b>
            </div>
            <div style={{ color: '#888', fontSize: 15, marginTop: 8 }}>Conectando con WhatsApp...</div>
          </div>
          <style>{`
            @keyframes shake {
              0% { transform: rotate(-10deg); }
              20% { transform: rotate(10deg); }
              40% { transform: rotate(-8deg); }
              60% { transform: rotate(8deg); }
              80% { transform: rotate(-4deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes pop {
              0% { transform: scale(0.7); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* Contenedor Principal */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'white', padding: '12px 9px', borderRadius: 24, boxShadow: '0 4px 24px #0002', width: '100%', maxWidth: 380 }}>
        {/* Dirección destacada */}
        <h1 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32, margin: '8px 0 16px 0', textAlign: 'center', width: '100%' }}>
          {calle} {numero}
        </h1>
        
        {/* QR Display */}
        <div style={{ padding: 6, border: '2px solid #e0e3ea', borderRadius: 16, marginBottom: 8 }}>
          <QRCodeDisplay value={`http://localhost:3000/`} />
        </div>

        {/* Contenedor de Selección (Piso/Dpto) */}
        <div style={{
          borderRadius: 18,
          width: '100%',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '2px solid #e0e3ea',
          overflow: 'hidden',
          paddingBottom: 0
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <button onClick={() => setTab('Piso')} style={{ flex: 1, fontWeight: 700, fontSize: 18, border: 'none', background: tab === 'Piso' ? '#1a4fa3' : '#f0f4f8', color: tab === 'Piso' ? '#fff' : '#1a4fa3', padding: '6px 0', transition: 'all 0.3s' }}>Piso</button>
            <button disabled={!pisoSel} onClick={() => setTab('Dpto')} style={{ flex: 1, fontWeight: 700, fontSize: 18, border: 'none', background: tab === 'Dpto' ? '#1a4fa3' : '#f0f4f8', color: tab === 'Dpto' ? '#fff' : '#1a4fa3', padding: '6px 0', transition: 'all 0.3s', cursor: !pisoSel ? 'not-allowed' : 'pointer' }}>Dpto</button>
          </div>

          {/* Grilla */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: 8, width: '100%', minHeight: 120 }}>
            {tab === 'Piso' && pisosConfig.map((p: any, i: number) => {
              const isConfigurado = estructura.some(piso => 
                piso.nombre === p && piso.dptos.some(dpto => 
                  isTimbreConfigurado(piso.nombre, dpto)
                )
              );
              return (
                <button 
                  key={i} 
                  onClick={() => handlePisoSelect(p)} 
                  style={getButtonStyle(pisoSel === p, isConfigurado)}
                >
                  {p}
                </button>
              );
            })}
            {tab === 'Dpto' && dptosDelPisoSel.map((d: any, i: number) => {
              const isConfigurado = pisoSel ? isTimbreConfigurado(pisoSel.toString(), d) : false;
              const isSelected = Boolean(dptoSel && dptoSel === d);
              return (
                <button 
                  key={i} 
                  onClick={() => handleDptoSelect(d)} 
                  style={getButtonStyle(isSelected, Boolean(isConfigurado))}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Botón Tocar Timbre */}
          <button
            style={{
              background: isButtonDisabled ? '#e0e3ea' : '#1a4fa3',
              color: isButtonDisabled ? '#a0a0a0' : '#fff',
              border: 'none',
              width: '100%',
              padding: '8px 0',
              fontSize: 20,
              fontWeight: 700,
              cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            disabled={isButtonDisabled}
            onClick={handleTocarTimbre}
          >
            Tocar Timbre {pisoSel && `${pisoSel}`}{dptoSel && ` ${dptoSel}`}
          </button>
        </div>
      </div>

      {/* Botones inferiores (solo si showBottomButtons es true) */}
      {showBottomButtons && (
        <div style={{ display: 'flex', gap: 12, marginTop: 24, width: '100%', maxWidth: 380, justifyContent: 'center' }}>
          <button
            style={{ flex: 1, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 8px', fontSize: 16, fontWeight: 700, boxShadow: '0 2px 8px #0002', lineHeight: '1.2', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            onClick={onTiendaClick}
          >
            <MdLocationCity style={{ fontSize: 24, marginBottom: 2 }} />
            Visita la<br/>Tienda
          </button>
          <button
            style={{ flex: 1, background: '#e0e3ea', color: '#1a4fa3', border: '1px solid #bfc5d2', borderRadius: 12, padding: '12px 8px', fontSize: 16, fontWeight: 700, lineHeight: '1.2', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            onClick={handleUsuariosClick}
          >
            <MdPerson style={{ fontSize: 24, marginBottom: 2 }} />
            Usuarios/<br/>Residentes
          </button>
        </div>
      )}

      {/* Modal para ingresar IDU */}
      {showModalIDU && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(30,40,60,0.18)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px #0003',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 320,
            maxWidth: 400,
            animation: 'pop 0.3s',
          }}>
            <span style={{ fontSize: 48, color: '#1a4fa3', marginBottom: 16 }}>🔐</span>
            <h3 style={{ color: '#1a4fa3', fontWeight: 800, fontSize: 20, marginBottom: 8, textAlign: 'center' }}>
              Acceso Administrativo
            </h3>
            <p style={{ color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 1.4 }}>
              Ingresa el IDU del edificio para acceder al panel de administración
            </p>
            
            <input
              type="text"
              placeholder="Ej: C1C0VELR"
              value={inputIDU}
              onChange={(e) => setInputIDU(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e3ea',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                textAlign: 'center',
                letterSpacing: 1,
                marginBottom: 20,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleIrAlPanel()}
            />
            
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button
                onClick={() => {
                  setShowModalIDU(false);
                  setInputIDU('');
                }}
                style={{
                  flex: 1,
                  background: '#f0f0f0',
                  color: '#666',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleIrAlPanel}
                disabled={!inputIDU.trim()}
                style={{
                  flex: 1,
                  background: !inputIDU.trim() ? '#ccc' : '#1a4fa3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: !inputIDU.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Ir al Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 