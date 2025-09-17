import React, { useState } from "react";
import { MdMessage, MdCall, MdVideocam } from "react-icons/md";
import { formatearNumeroWhatsApp } from '../utils/whatsappFormatter';

export interface PisoConfig {
  nombre: string;
  dptos: string[];
}

export interface TimbreConfig {
  id: string; // Se usará para todo
  piso: string;
  dpto: string;
  numero: string;
  metodo: "mensaje" | "llamada" | "video";
  estado: "activo" | "dnd";
  esPropio: boolean;
  estadoAsignacion: "libre" | "asignado" | "solicitado" | "configurado";
  nombre?: string;
}

interface ConfigTimbresProps {
  estructura: PisoConfig[];
  timbres: TimbreConfig[];
  onChange: (timbres: TimbreConfig[]) => void;
  maxDptos: number;
}

export default function ConfigTimbres({ estructura, timbres, onChange, maxDptos }: ConfigTimbresProps) {
  const [modal, setModal] = useState<{ piso: string; dpto: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  // Usamos un estado para el formulario del modal que se inicializa al abrirlo
  const [form, setForm] = useState<Partial<TimbreConfig>>({});

  // Función para obtener el icono según el método
  const getMethodIcon = (metodo: string) => {
    switch (metodo) {
      case 'mensaje':
        return '💬';
      case 'llamada':
        return '📞';
      case 'video':
        return '📹';
      default:
        return '💬';
    }
  };

  // Función para obtener el ícono del método como componente React (para la grilla)
  const getMethodIconComponent = (metodo: string) => {
    switch (metodo) {
      case 'mensaje':
        return <MdMessage size={16} />;
      case 'llamada':
        return <MdCall size={16} />;
      case 'video':
        return <MdVideocam size={16} />;
      default:
        return <MdMessage size={16} />;
    }
  };

  // Función para obtener el tooltip según el método
  const getMethodTooltip = (metodo: string) => {
    switch (metodo) {
      case 'mensaje':
        return 'Mensaje WhatsApp';
      case 'llamada':
        return 'Llamada';
      case 'video':
        return 'Videollamada';
      default:
        return 'Mensaje WhatsApp';
    }
  };

  const handleConfig = (piso: string, dpto: string) => {
    const id = `${piso}-${dpto}`;
    const existente = timbres.find(t => t.id === id);
    setForm(existente || { id, piso, dpto, numero: '', metodo: 'mensaje', estado: 'activo', esPropio: false, estadoAsignacion: 'libre' });
    setModal({ piso, dpto });
  };

  const handleGuardar = () => {
    if (!form.id) return;

    // Si es propio, configurar directamente (estado configurado)
    if (form.esPropio) {
      const actualizado: TimbreConfig = {
        id: form.id,
        piso: form.piso!,
        dpto: form.dpto!,
        numero: form.numero || '',
        metodo: form.metodo || 'mensaje',
        estado: form.estado || 'activo',
        esPropio: form.esPropio || false,
        estadoAsignacion: 'configurado'
      };

      const otros = timbres.filter(t => t.id !== form.id);
      onChange([...otros, actualizado]);
      setModal(null);
    } else {
      // Si es una solicitud pendiente, asignar (estado asignado)
      if (form.estadoAsignacion === 'solicitado') {
        const actualizado: TimbreConfig = {
          id: form.id,
          piso: form.piso!,
          dpto: form.dpto!,
          numero: form.numero || '',
          metodo: form.metodo || 'mensaje',
          estado: form.estado || 'activo',
          esPropio: form.esPropio || false,
          estadoAsignacion: 'asignado'
        };

        const otros = timbres.filter(t => t.id !== form.id);
        onChange([...otros, actualizado]);
        setModal(null);
        
        // Enviar WhatsApp real al residente
        if (form.numero) {
          handleWhatsAppContact(form.numero, form.metodo || 'mensaje', form.piso!, form.dpto!, 'asignacion');
        }
      } else if (form.estadoAsignacion === 'asignado') {
        // Si ya está asignado, configurar directamente
        const actualizado: TimbreConfig = {
          id: form.id,
          piso: form.piso!,
          dpto: form.dpto!,
          numero: form.numero || '',
          metodo: form.metodo || 'mensaje',
          estado: form.estado || 'activo',
          esPropio: form.esPropio || false,
          estadoAsignacion: 'configurado'
        };

        const otros = timbres.filter(t => t.id !== form.id);
        onChange([...otros, actualizado]);
        setModal(null);
        
        // Enviar WhatsApp real al residente
        if (form.numero) {
          handleWhatsAppContact(form.numero, form.metodo || 'mensaje', form.piso!, form.dpto!, 'configuracion');
        }
      } else {
        // Si no es propio ni solicitado ni asignado, mostrar modal de confirmación
      setShowConfirmModal(true);
      }
    }
  };

  const handleConfirmarAsignacion = () => {
    if (!form.id) return;

    const actualizado: TimbreConfig = {
      id: form.id,
      piso: form.piso!,
      dpto: form.dpto!,
      numero: form.numero || '',
      metodo: form.metodo || 'mensaje',
      estado: form.estado || 'activo',
      esPropio: form.esPropio || false,
      estadoAsignacion: 'asignado'
    };

    const otros = timbres.filter(t => t.id !== form.id);
    onChange([...otros, actualizado]);
    setModal(null);
    setShowConfirmModal(false);
  };

  const handleRechazarSolicitud = () => {
    if (!form.id) return;

    // Volver a estado libre
    const actualizado: TimbreConfig = {
      id: form.id,
      piso: form.piso!,
      dpto: form.dpto!,
      numero: '',
      metodo: 'mensaje',
      estado: 'activo',
      esPropio: false,
      estadoAsignacion: 'libre'
    };

    const otros = timbres.filter(t => t.id !== form.id);
    onChange([...otros, actualizado]);
    setModal(null);
    setShowRejectModal(false);
    
    // Enviar WhatsApp real al residente
    if (form.numero) {
      handleWhatsAppContact(form.numero, form.metodo || 'mensaje', form.piso!, form.dpto!, 'rechazo');
    }
  };

  // Función para manejar diferentes tipos de contacto WhatsApp
  const handleWhatsAppContact = (numero: string, metodo: string, piso: string, dpto: string, tipo: 'asignacion' | 'rechazo' | 'configuracion') => {
    if (!numero) return;

    let mensaje = '';
    let url = '';

    switch (tipo) {
      case 'asignacion':
        mensaje = `Hola, tu timbre ${piso}-${dpto} ha sido asignado. Por favor confirma la configuración respondiendo este mensaje.`;
        break;
      case 'rechazo':
        mensaje = `Hola, tu solicitud de timbre para ${piso}-${dpto} ha sido rechazada. Contacta al administrador para más información.`;
        break;
      case 'configuracion':
        mensaje = `Hola, tu timbre ${piso}-${dpto} ha sido configurado exitosamente. Ya puedes recibir visitas.`;
        break;
    }

    // Formatear el número correctamente para WhatsApp
    const numeroFormateado = formatearNumeroWhatsApp(numero);
    
    switch (metodo) {
      case 'mensaje':
        url = `https://wa.me/${numeroFormateado}?text=${encodeURIComponent(mensaje)}`;
        break;
      case 'llamada':
        url = `https://wa.me/${numeroFormateado}`;
        break;
      case 'video':
        url = `https://wa.me/${numeroFormateado}?text=${encodeURIComponent(mensaje + ' ¿Podemos hacer una videollamada?')}`;
        break;
    }

    window.open(url, '_blank');
  };

  return (
    <>
      {/* Filas de timbres */}
      {estructura.map((piso, index) => (
        <React.Fragment key={`${piso.nombre}-${index}`}>
          <div style={{ fontWeight: 700, color: '#1a4fa3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{piso.nombre}</div>
          {Array.from({ length: maxDptos }, (_, colIndex) => {
            const letraColumna = String.fromCharCode(65 + colIndex);
            const dptoExiste = piso.dptos.includes(letraColumna);
            if (!dptoExiste) {
              return <div key={colIndex} style={{height: 32}} />;
            }
            const id = `${piso.nombre}-${letraColumna}`;
            const conf = timbres.find(t => t.id === id);
            const isConfigured = conf?.estadoAsignacion === 'configurado';
            const isAsignado = conf?.estadoAsignacion === 'asignado';
            const isSolicitado = conf?.estadoAsignacion === 'solicitado';
            const colorEstado = conf?.estado === 'activo' ? 
              (isConfigured ? '#43a047' : 
               isAsignado ? '#1976d2' : 
               isSolicitado ? '#9c27b0' : '#1976d2') : '#bbb';
            return (
              <div key={colIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32 }}>
                <button 
                  onClick={() => handleConfig(piso.nombre, letraColumna)}
                  title={
                    isConfigured ? `${conf?.piso}-${conf?.dpto}: ${getMethodTooltip(conf?.metodo || 'mensaje')}` : 
                    isAsignado ? `${piso.nombre}-${letraColumna}: Asignado por admin - Pendiente confirmación` :
                    isSolicitado ? `${piso.nombre}-${letraColumna}: Solicitud pendiente` :
                    `${piso.nombre}-${letraColumna}: Disponible`
                  }
                  style={{ 
                    width: 38, 
                    height: 28, 
                    border: isAsignado ? '3px solid #1976d2' : isSolicitado ? '3px solid #9c27b0' : isConfigured ? '3px solid #43a047' : '3px solid #FF9800',
                    background: conf?.estado === 'activo' ? 
                      (isConfigured ? '#e8f5e9' : 
                       isAsignado ? '#e3f2fd' : 
                       isSolicitado ? '#f3e5f5' : '#fff') : '#fff3e0',
                    fontWeight: 700, 
                    fontSize: 14, 
                    color: '#1976d2', 
                    textAlign: 'center', 
                    borderRadius: 8, 
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px #0001',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isConfigured ? (
                    <div style={{ color: '#1976d2' }}>
                      {getMethodIconComponent(conf?.metodo || 'mensaje')}
                    </div>
                  ) : isAsignado ? (
                    <div style={{ color: '#f44336', fontSize: 18, fontWeight: 800 }}>
                      ❓
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      {letraColumna}
                      {isSolicitado && (
                        <div style={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 8,
                          height: 8,
                          background: '#9c27b0',
                          borderRadius: '50%',
                          border: '1px solid #fff'
                        }} />
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </React.Fragment>
      ))}

      {/* Modal de configuración */}
      {modal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440, boxShadow: '0 8px 32px #0003', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 12, right: 12, background: '#f0f0f0', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 20, fontWeight: 700, color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, transition: 'all 0.2s ease' }}>×</button>
            <h3 style={{ color: '#1976d2', fontWeight: 800, marginBottom: 24, fontSize: 22, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span role="img" aria-label="casita">🏠</span> {form.estadoAsignacion === 'solicitado' ? 'Asignar' : form.estadoAsignacion === 'asignado' ? 'Configurar' : 'Configurar'} Timbre
            </h3>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 120, fontWeight: 900, color: '#1976d2', background: '#f8faff', borderRadius: 16, padding: '16px 24px', border: '3px solid #e3f2fd', marginBottom: 16 }}>
                {modal.piso}-{modal.dpto}
              </div>
              </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label htmlFor="wsp-numero" style={{fontWeight: 600, color: '#333', display: 'block', marginBottom: 8, fontSize: 15}}>
                  📱 Número de WhatsApp
                </label>
                <input 
                  id="wsp-numero" 
                  value={form.numero} 
                  onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} 
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    borderRadius: 10, 
                    border: '1.5px solid #bfc5d2', 
                    background: '#fff', 
                    color: '#222', 
                    fontSize: 16, 
                    letterSpacing: '1.5px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }} 
                  placeholder="Ej: +5491122334455" 
                />
              </div>

              <div style={{display: 'flex', gap: 16, width: '100%'}}>
                <div style={{flex: 1}}>
                  <label htmlFor="metodo" style={{fontWeight: 600, color: '#333', display: 'block', marginBottom: 8, fontSize: 15}}>
                    {getMethodIconComponent(form.metodo || 'mensaje')} Método de Contacto
                  </label>
                  <select 
                    id="metodo" 
                    value={form.metodo} 
                    onChange={e => setForm(f => ({ ...f, metodo: e.target.value as any }))} 
                    style={{ 
                      width: '100%', 
                      padding: 12, 
                      borderRadius: 10, 
                      border: '1.5px solid #bfc5d2', 
                      background: '#fff', 
                      color: '#222', 
                      fontSize: 16,
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <option value="mensaje">💬 Mensaje WhatsApp</option>
                    <option value="llamada">📞 Llamada</option>
                    <option value="video">📹 Videollamada</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label htmlFor="estado" style={{fontWeight: 600, color: '#333', display: 'block', marginBottom: 8, fontSize: 15}}>
                    🔔 Estado del Timbre
                  </label>
                  <select 
                    id="estado" 
                    value={form.estado} 
                    onChange={e => setForm(f => ({ ...f, estado: e.target.value as any }))} 
                    style={{ 
                      width: '100%', 
                      padding: 12, 
                      borderRadius: 10, 
                      border: '1.5px solid #bfc5d2', 
                      background: '#fff', 
                      color: '#222', 
                      fontSize: 16,
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <option value="activo">✅ Activo</option>
                    <option value="dnd">🔕 No molestar</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
                {form.estadoAsignacion === 'solicitado' && (
                  <button 
                    onClick={() => setShowRejectModal(true)} 
                    style={{ 
                      background: '#f44336', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: 12, 
                      padding: '12px 24px', 
                      fontWeight: 700, 
                      fontSize: 16, 
                      cursor: 'pointer', 
                      boxShadow: '0 2px 8px #f4433640', 
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ❌ Rechazar
                  </button>
                )}
                <button 
                  onClick={async () => {
                    try {
                      // Configurar directamente sin modal de confirmación
                      const actualizado: TimbreConfig = {
                        id: form.id || '',
                        piso: form.piso || '',
                        dpto: form.dpto || '',
                        numero: form.numero || '',
                        metodo: form.metodo || 'mensaje',
                        estado: form.estado || 'activo',
                        esPropio: form.esPropio || false,
                        estadoAsignacion: 'configurado'
                      };

                      // Guardar en la base de datos
                      const idUnico = localStorage.getItem('ventaIdUnico');
                      console.log('🔍 IDU desde localStorage:', idUnico);
                      console.log('🔍 URL actual:', window.location.href);
                      
                      // Extraer IDU de la URL si no está en localStorage
                      const urlParams = new URLSearchParams(window.location.search);
                      const idUnicoFromUrl = urlParams.get('idUnico');
                      console.log('🔍 IDU desde URL:', idUnicoFromUrl);
                      
                      const idUnicoToUse = idUnico || idUnicoFromUrl;
                      console.log('🔍 IDU a usar:', idUnicoToUse);
                      
                      if (idUnicoToUse) {
                        console.log('📡 Enviando request a API...');
                        const response = await fetch(`/api/admin/timbres/${idUnicoToUse}`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            timbres: [...timbres.filter(t => t.id !== form.id), actualizado]
                          })
                        });

                        console.log('📡 Response status:', response.status);
                        
                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('❌ Error response:', errorText);
                          throw new Error('Error al guardar en la base de datos');
                        }
                        
                        const result = await response.json();
                        console.log('✅ API response:', result);
                      } else {
                        console.error('❌ No se encontró IDU');
                      }

                      // Actualizar estado local
                      const otros = timbres.filter(t => t.id !== form.id);
                      onChange([...otros, actualizado]);
                      setModal(null);
                    } catch (error) {
                      console.error('Error guardando timbre:', error);
                      alert('Error de conexión al guardar timbres. Intenta nuevamente.');
                    }
                  }} 
                  style={{ 
                    background: '#1976d2', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 12, 
                    padding: '14px 32px', 
                    fontWeight: 800, 
                    fontSize: 18, 
                    cursor: 'pointer', 
                    boxShadow: '0 4px 12px #1976d240', 
                    transition: 'all 0.2s ease',
                    minWidth: 200
                  }}
                >
                  {`${getMethodIcon(form.metodo || 'mensaje')} Configurar Timbre`}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de asignación */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            padding: 32, 
            width: 420, 
            boxShadow: '0 8px 32px #0003', 
            textAlign: 'center' 
          }}>
            <h3 style={{ color: '#1976d2', fontWeight: 800, marginBottom: 16, fontSize: 22 }}>
              Confirmar Asignación
            </h3>
            <div style={{ 
              background: '#f0f4fa', 
              borderRadius: 12, 
              padding: 16, 
              marginBottom: 20,
              border: '1px solid #e0e8f0'
            }}>
              <p style={{ color: '#333', fontSize: 16, marginBottom: 8, lineHeight: 1.5 }}>
                <strong>Timbre:</strong> {modal?.piso}-{modal?.dpto}
              </p>
              <p style={{ color: '#333', fontSize: 16, marginBottom: 8, lineHeight: 1.5 }}>
                <strong>Número:</strong> {form.numero}
              </p>
              <p style={{ color: '#333', fontSize: 16, marginBottom: 0, lineHeight: 1.5 }}>
                <strong>Método:</strong> {getMethodTooltip(form.metodo || 'mensaje')}
              </p>
            </div>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24, lineHeight: 1.4 }}>
              Esta asignación enviará un mensaje WhatsApp al residente para que confirme la configuración de su timbre.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                onClick={() => setShowConfirmModal(false)} 
                style={{ 
                  background: '#f0f0f0', 
                  color: '#333', 
                  border: 'none', 
                  borderRadius: 10, 
                  padding: '12px 24px', 
                  fontWeight: 700, 
                  fontSize: 16, 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmarAsignacion} 
                style={{ 
                  background: '#4caf50', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 10, 
                  padding: '12px 24px', 
                  fontWeight: 700, 
                  fontSize: 16, 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                  Asignar Timbre
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de rechazo */}
      {showRejectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            padding: 32, 
            width: 420, 
            boxShadow: '0 8px 32px #0003', 
            textAlign: 'center' 
          }}>
            <h3 style={{ color: '#f44336', fontWeight: 800, marginBottom: 16, fontSize: 22 }}>
              ❌ Rechazar Solicitud
            </h3>
            <div style={{ 
              background: '#ffebee', 
              borderRadius: 12, 
              padding: 16, 
              marginBottom: 20,
              border: '1px solid #ffcdd2'
            }}>
              <p style={{ color: '#333', fontSize: 16, marginBottom: 8, lineHeight: 1.5 }}>
                <strong>Timbre:</strong> {modal?.piso}-{modal?.dpto}
              </p>
              <p style={{ color: '#333', fontSize: 16, marginBottom: 8, lineHeight: 1.5 }}>
                <strong>Solicitante:</strong> {form.numero}
              </p>
            </div>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24, lineHeight: 1.4 }}>
              ¿Estás seguro de que quieres rechazar esta solicitud? Se enviará un mensaje WhatsApp al solicitante informando la decisión.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                onClick={() => setShowRejectModal(false)} 
                style={{ 
                  background: '#f0f0f0', 
                  color: '#333', 
                  border: 'none', 
                  borderRadius: 10, 
                  padding: '12px 24px', 
                  fontWeight: 700, 
                  fontSize: 16, 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleRechazarSolicitud} 
                style={{ 
                  background: '#f44336', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 10, 
                  padding: '12px 24px', 
                  fontWeight: 700, 
                  fontSize: 16, 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Rechazar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 