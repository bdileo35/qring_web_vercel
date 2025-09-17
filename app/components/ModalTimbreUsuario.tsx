"use client";

import { useState, useEffect } from "react";
import { MdClose, MdMessage, MdCall, MdVideocam, MdWhatsapp } from "react-icons/md";

interface TimbreUsuario {
  id: string;
  piso: string;
  dpto: string;
  numero: string;
  metodo: 'mensaje' | 'llamada' | 'video';
  estado: 'activo' | 'inactivo';
}

interface ModalTimbreUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalTimbreUsuario({ isOpen, onClose }: ModalTimbreUsuarioProps) {
  const [timbreUsuario, setTimbreUsuario] = useState<TimbreUsuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    numero: '',
    metodo: 'mensaje' as 'mensaje' | 'llamada' | 'video'
  });

  // Cargar datos del timbre del usuario desde localStorage
  useEffect(() => {
    if (isOpen) {
      const datosGuardados = localStorage.getItem('wizardData');
      if (datosGuardados) {
        const data = JSON.parse(datosGuardados);
        // Buscar el timbre del usuario (asumiendo que es el primero configurado)
        const timbres = data.timbres || [];
        const miTimbre = timbres.find((t: any) => 
          t.estadoAsignacion === 'configurado' || t.estadoAsignacion === 'asignado'
        );
        
        if (miTimbre) {
          setTimbreUsuario(miTimbre);
          setForm({
            numero: miTimbre.numero || '',
            metodo: miTimbre.metodo || 'mensaje'
          });
        }
      }
    }
  }, [isOpen]);

  const handleGuardar = () => {
    if (!timbreUsuario) return;

    // Actualizar datos en localStorage
    const datosGuardados = localStorage.getItem('wizardData');
    if (datosGuardados) {
      const data = JSON.parse(datosGuardados);
      const timbresActualizados = data.timbres.map((t: any) => 
        t.id === timbreUsuario.id 
          ? { ...t, numero: form.numero, metodo: form.metodo }
          : t
      );
      
      data.timbres = timbresActualizados;
      localStorage.setItem('wizardData', JSON.stringify(data));
      
      setTimbreUsuario({
        ...timbreUsuario,
        numero: form.numero,
        metodo: form.metodo
      });
    }
    
    setEditando(false);
  };

  const handleTestTimbre = () => {
    if (!timbreUsuario?.numero) {
      alert('Primero debes configurar tu número de teléfono');
      return;
    }

    const mensaje = encodeURIComponent(`🔔 ¡Timbre de prueba! Alguien está tocando tu timbre ${timbreUsuario.piso}-${timbreUsuario.dpto}`);
    
    switch (form.metodo) {
      case 'mensaje':
        window.open(`https://wa.me/${form.numero}?text=${mensaje}`, '_blank');
        break;
      case 'llamada':
        window.open(`https://wa.me/${form.numero}`, '_blank');
        break;
      case 'video':
        window.open(`https://wa.me/${form.numero}?text=${encodeURIComponent(mensaje + ' ¿Podemos hacer una videollamada?')}`, '_blank');
        break;
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
      background: 'rgba(0,0,0,0.5)',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 24,
        maxWidth: 400,
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: '#666',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <MdClose />
        </button>

        {/* Título */}
        <h2 style={{
          margin: '0 0 20px 0',
          color: '#1a4fa3',
          fontSize: 24,
          fontWeight: 700,
          textAlign: 'center'
        }}>
          🔧 Mi Timbre
        </h2>

        {timbreUsuario ? (
          <>
            {/* Información del timbre */}
            <div style={{
              background: '#f8f9fa',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#1a4fa3',
                marginBottom: 8
              }}>
                {timbreUsuario.piso}-{timbreUsuario.dpto}
              </div>
              <div style={{
                fontSize: 14,
                color: '#666',
                marginBottom: 8
              }}>
                Estado: <span style={{
                  color: timbreUsuario.estado === 'activo' ? '#388e3c' : '#e74c3c',
                  fontWeight: 600
                }}>
                  {timbreUsuario.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}
                </span>
              </div>
            </div>

            {/* Configuración */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: 18,
                fontWeight: 600,
                color: '#333'
              }}>
                Configuración
              </h3>

              {/* Número de teléfono */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#555'
                }}>
                  Número de WhatsApp
                </label>
                {editando ? (
                  <input
                    type="tel"
                    value={form.numero}
                    onChange={(e) => setForm({ ...form, numero: e.target.value })}
                    placeholder="+5491122334455"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: 8,
                      fontSize: 16,
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <div style={{
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: 8,
                    fontSize: 16,
                    color: form.numero ? '#333' : '#999'
                  }}>
                    {form.numero || 'No configurado'}
                  </div>
                )}
              </div>

              {/* Método de contacto */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#555'
                }}>
                  Método de contacto
                </label>
                {editando ? (
                  <select
                    value={form.metodo}
                    onChange={(e) => setForm({ ...form, metodo: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: 8,
                      fontSize: 16,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="mensaje">Mensaje WhatsApp</option>
                    <option value="llamada">Llamada</option>
                    <option value="video">Videollamada</option>
                  </select>
                ) : (
                  <div style={{
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: 8,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    {form.metodo === 'mensaje' && <MdMessage size={20} color="#25d366" />}
                    {form.metodo === 'llamada' && <MdCall size={20} color="#25d366" />}
                    {form.metodo === 'video' && <MdVideocam size={20} color="#25d366" />}
                    {form.metodo === 'mensaje' ? 'Mensaje WhatsApp' : 
                     form.metodo === 'llamada' ? 'Llamada' : 'Videollamada'}
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{
              display: 'flex',
              gap: 12,
              flexDirection: 'column'
            }}>
              {editando ? (
                <>
                  <button
                    onClick={handleGuardar}
                    style={{
                      background: '#388e3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    <MdWhatsapp size={20} />
                    Guardar Configuración
                  </button>
                  <button
                    onClick={() => setEditando(false)}
                    style={{
                      background: '#f0f0f0',
                      color: '#666',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditando(true)}
                    style={{
                      background: '#1a4fa3',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    <MdMessage size={20} />
                    Editar Configuración
                  </button>
                  <button
                    onClick={handleTestTimbre}
                    style={{
                      background: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '14px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    🔔 Probar Timbre
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏢</div>
            <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>
              Timbre no configurado
            </h3>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              Tu timbre aún no ha sido configurado por el administrador.
              Contacta al administrador del edificio para configurar tu timbre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 