import React, { useState, useRef, useEffect } from "react";
import { MdClose, MdLocationOn, MdPerson, MdPhone } from "react-icons/md";

interface SolicitudTimbreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; telefono: string; departamento: string }) => void;
  estructura: Array<{ nombre: string; dptos: string[] }>;
  timbres?: Array<{ id: string; piso: string; dpto: string; estadoAsignacion: string }>;
}

export default function SolicitudTimbreModal({ isOpen, onClose, onSubmit, estructura, timbres = [] }: SolicitudTimbreModalProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [piso, setPiso] = useState("");
  const [dpto, setDpto] = useState("");

  const pisoInputRef = useRef<HTMLInputElement>(null);
  const dptoInputRef = useRef<HTMLInputElement>(null);

  // Obtener solo los pisos con dptos libres
  const pisosDisponibles = estructura
    .map(p => ({
      nombre: p.nombre,
      dptosLibres: p.dptos.filter(d => {
        const id = `${p.nombre}-${d}`;
        const t = timbres.find(t => t.id === id);
        return !t || t.estadoAsignacion === 'libre';
      })
    }))
    .filter(p => p.dptosLibres.length > 0);

  // Dptos libres del piso seleccionado
  const dptosDisponibles = piso
    ? pisosDisponibles.find(p => p.nombre === piso)?.dptosLibres || []
    : [];

  // Foco automático
  useEffect(() => {
    if (isOpen && pisoInputRef.current) {
      pisoInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (piso && dptoInputRef.current) {
      dptoInputRef.current.focus();
    }
  }, [piso]);

  const handleSubmit = () => {
    if (nombre.trim() && telefono.trim() && piso && dpto) {
      onSubmit({ nombre: nombre.trim(), telefono: telefono.trim(), departamento: `${piso}-${dpto}` });
      setNombre("");
      setTelefono("");
      setPiso("");
      setDpto("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(30,40,60,0.25)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12
    }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        boxShadow: '0 8px 32px #0003', 
        padding: 24, 
        minWidth: 320, 
        maxWidth: 420, 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'stretch',
        justifyContent: 'center',
        margin: 'auto'
      }}>
        {/* Botón cerrar */}
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            background: '#f0f0f0', 
            border: 'none', 
            borderRadius: '50%', 
            width: 32, 
            height: 32, 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#555', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            lineHeight: 1, 
            transition: 'all 0.2s ease' 
          }}
        >
          <MdClose />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <h3 style={{ color: '#1a4fa3', fontWeight: 800, fontSize: 24, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span role="img" aria-label="casita">🏠</span> Solicitar Timbre {piso && dpto ? `${piso}-${dpto}` : ''}
          </h3>
          <div style={{ background: '#e3f2fd', color: '#1976d2', borderRadius: 8, padding: '8px 14px', fontWeight: 600, fontSize: 15, margin: '0 auto 8px auto', maxWidth: 320, border: '1.5px solid #90caf9' }}>
            Completa tus datos para solicitar tu timbre
          </div>
        </div>
        {/* Campo editable Nombre del Timbre */}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="nombre-timbre" style={{ fontWeight: 600, color: '#1976d2', display: 'block', marginBottom: 6, fontSize: 15 }}>
            🏷️ Nombre del Timbre (opcional)
          </label>
          <input
            id="nombre-timbre"
            value={nombre || (piso && dpto ? `${piso}-${dpto}` : '')}
            onChange={e => setNombre(e.target.value)}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: '1.5px solid #90caf9',
              background: '#f8faff',
              color: '#1976d2',
              fontSize: 16,
              outline: 'none',
              transition: 'all 0.2s ease',
              fontWeight: 600
            }}
            placeholder={`Ej: Portería, Depto Juan, SUM...`}
          />
        </div>
        {/* Inputs principales */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
          <div>
            <label style={{ fontWeight: 600, color: '#333', display: 'block', marginBottom: 6, fontSize: 15 }}>
              <MdPhone style={{ marginRight: 8 }} />
              Número de WhatsApp
            </label>
            <input 
              value={telefono} 
              onChange={e => setTelefono(e.target.value)} 
              style={{ 
                width: '100%', 
                padding: 10, 
                borderRadius: 8, 
                border: '1.5px solid #bfc5d2', 
                background: '#fff', 
                color: '#222', 
                fontSize: 16,
                outline: 'none',
                transition: 'all 0.2s ease'
              }} 
              placeholder="Ej: +5491122334455" 
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, color: '#333', display: 'block', marginBottom: 6, fontSize: 15 }}>
                Piso
              </label>
              <input
                ref={pisoInputRef}
                list="pisos-list"
                value={piso}
                onChange={e => { setPiso(e.target.value.toUpperCase()); setDpto(''); }}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 8,
                  border: '1.5px solid #bfc5d2',
                  background: '#fff',
                  color: '#222',
                  fontSize: 16,
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase'
                }}
                placeholder="EJ: 4"
                autoComplete="off"
              />
              <datalist id="pisos-list">
                {pisosDisponibles.map(p => (
                  <option key={p.nombre} value={p.nombre} />
                ))}
              </datalist>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, color: '#333', display: 'block', marginBottom: 6, fontSize: 15 }}>
                Dpto
              </label>
              <input
                ref={dptoInputRef}
                list="dptos-list"
                value={dpto}
                onChange={e => setDpto(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 8,
                  border: '1.5px solid #bfc5d2',
                  background: '#fff',
                  color: '#222',
                  fontSize: 16,
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase'
                }}
                placeholder="EJ: A"
                autoComplete="off"
                disabled={!piso}
              />
              <datalist id="dptos-list">
                {dptosDisponibles.map(d => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>
          </div>
        </div>
        {/* Botón Solicitar */}
        <button 
          onClick={handleSubmit} 
          disabled={!(nombre.trim() && telefono.trim() && piso && dpto && dptosDisponibles.includes(dpto))}
          style={{ 
            background: nombre.trim() && telefono.trim() && piso && dpto && dptosDisponibles.includes(dpto) ? '#1a4fa3' : '#ccc', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 12, 
            padding: '14px 32px', 
            fontWeight: 700, 
            fontSize: 16, 
            cursor: nombre.trim() && telefono.trim() && piso && dpto && dptosDisponibles.includes(dpto) ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            alignSelf: 'center',
            marginBottom: 10
          }}
        >
          Solicitar Timbre
        </button>
        {/* CInfo tipo tip */}
        <div style={{
          background: '#e3f2fd',
          color: '#1976d2',
          borderRadius: 8,
          padding: '10px 14px',
          fontWeight: 500,
          fontSize: 15,
          margin: '0 auto 0 auto',
          maxWidth: 360,
          border: '1.5px solid #90caf9',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{fontSize: 18}}>💡</span>
          <span>El administrador revisará tu solicitud y te contactará por WhatsApp para confirmar la configuración de tu timbre.</span>
        </div>
      </div>
    </div>
  );
} 