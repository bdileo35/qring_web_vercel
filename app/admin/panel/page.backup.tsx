"use client";
import { useState, useEffect } from "react";
import { MdDashboard, MdLocationCity, MdPeople, MdAttachMoney, MdListAlt, MdSettings, MdMenu, MdChevronLeft, MdLocationOn, MdApartment, MdMeetingRoom, MdNotificationsActive, MdNotificationsOff } from "react-icons/md";
import NavBar from "@/app/components/NavBar";
import CInfo from "@/app/components/CInfo";
import AuthGuard from "@/app/components/AuthGuard";

const SECTIONS = [
  { key: "dashboard", label: "Dashboard", icon: MdDashboard },
  { key: "edificios", label: "Edificios", icon: MdLocationCity },
  { key: "usuarios", label: "Usuarios", icon: MdPeople },
  { key: "ventas", label: "Ventas", icon: MdAttachMoney },
  { key: "logs", label: "Logs", icon: MdListAlt },
  { key: "config", label: "Configuración", icon: MdSettings },
];

interface Edificio {
  id: string;
  idUnico: string;
  nombre: string;
  calle: string;
  numero: string;
  ciudad?: string;
  createdAt: string;
  stats: {
    totalTimbres: number;
    timbresActivos: number;
    timbresConfigurados: number;
    totalDptos: number;
    cantPisos: number;
  };
}

function SuperPanelContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [section, setSection] = useState("dashboard");
  const [precioPorTimbre, setPrecioPorTimbre] = useState('');
  const [editandoPrecio, setEditandoPrecio] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [loadingEdificios, setLoadingEdificios] = useState(false);
  const [ventas, setVentas] = useState<any[]>([]);
  const [loadingVentas, setLoadingVentas] = useState(false);

  useEffect(() => {
    if (section === 'config') cargarPrecio();
    if (section === 'edificios') cargarEdificios();
    if (section === 'ventas') cargarVentas();
  }, [section]);

  const cargarPrecio = async () => {
    try {
      const res = await fetch('/api/admin/configuracion');
      const data = await res.json();
      if (data.success && data.configuracion.precioPorTimbre) {
        setPrecioPorTimbre(data.configuracion.precioPorTimbre);
      }
    } catch {}
  };

  const cargarEdificios = async () => {
    setLoadingEdificios(true);
    try {
      const res = await fetch('/api/admin/edificios');
      const data = await res.json();
      if (data.success) {
        setEdificios(data.edificios);
      } else {
        console.error('Error cargando edificios:', data.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setLoadingEdificios(false);
    }
  };

  const cargarVentas = async () => {
    setLoadingVentas(true);
    try {
      const res = await fetch('/api/admin/ventas');
      const data = await res.json();
      if (data.success) {
        setVentas(data.data);
      } else {
        console.error('Error cargando ventas:', data.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setLoadingVentas(false);
    }
  };

  const guardarPrecio = async () => {
    setGuardando(true);
    try {
      const res = await fetch('/api/admin/configuracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave: 'precioPorTimbre', valor: precioPorTimbre })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje('Precio guardado correctamente');
        setEditandoPrecio(false);
      } else {
        setMensaje('Error al guardar');
      }
    } catch {
      setMensaje('Error de red');
    } finally {
      setGuardando(false);
      setTimeout(() => setMensaje(''), 2500);
    }
  };

  // Calcular estadísticas totales
  const statsTotales = edificios.reduce((acc, edificio) => ({
    totalEdificios: acc.totalEdificios + 1,
    totalDptos: acc.totalDptos + edificio.stats.totalDptos,
    totalTimbres: acc.totalTimbres + edificio.stats.totalTimbres,
    timbresActivos: acc.timbresActivos + edificio.stats.timbresActivos
  }), {
    totalEdificios: 0,
    totalDptos: 0,
    totalTimbres: 0,
    timbresActivos: 0
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 520,
        minHeight: 546,
        background: "#fff",
        borderRadius: 22,
        boxShadow: "0 4px 24px #0002",
        padding: 0,
        margin: '0 auto',
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-start",
        border: '1.5px solid #e0e3ea',
      }}>
        {/* Menú lateral dentro del CardContainer */}
        <div style={{
          width: 60,
          background: "#f8faff",
          borderRight: "1.5px solid #e0e3ea",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: 22,
          borderBottomLeftRadius: 22,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          gap: 16,
        }}>
          {SECTIONS.map((item) => {
            const Icon = item.icon;
            const selected = section === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  background: selected ? "#eaf4ff" : "none",
                  color: selected ? "#1a4fa3" : "#222",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: selected ? 700 : 500,
                  fontSize: 17,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                title={item.label}
              >
                <Icon size={28} style={{ minWidth: 28 }} />
              </button>
            );
          })}
        </div>
        {/* Contenido principal a la derecha */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderTopRightRadius: 22,
          borderBottomRightRadius: 22,
          minHeight: 420,
          overflow: 'hidden'
          }}>
            {section === "dashboard" && (
              <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          gap: 18,
                height: '100%'
              }}>
                <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Dashboard</h2>
              </div>
            )}
            
            {section === "edificios" && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                height: '100%',
                background: '#fff'
              }}>
                {/* Header fijo */}
                <div style={{
                  background: '#f8faff',
                  borderBottom: '1.5px solid #e0e3ea',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10
                }}>
                  <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 24, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MdApartment size={24} style={{ color: '#1a4fa3' }} /> Edificios
            </h2>
                </div>

                {/* Cuerpo central con scroll */}
                <div style={{
                  flex: 1,
                  padding: '16px 24px',
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
                  {loadingEdificios ? (
                    <div style={{ color: '#1a4fa3', fontSize: 16, marginTop: 20 }}>Cargando edificios...</div>
                  ) : (
                    <div style={{
                      width: '100%',
                      background: '#fff',
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px #0001',
                      border: '1px solid #e0e3ea'
                    }}>
                      {/* Header de la tabla */}
                      <div style={{
                        background: '#1a4fa3',
                        color: '#fff',
                        padding: '12px 16px',
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                        gap: '8px',
                        fontWeight: 700,
                        fontSize: 14,
                        alignItems: 'center',
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} title="Dirección">
                          <MdLocationOn size={18} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} title="ID Único">
                          <MdSettings size={18} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} title="Pisos">
                          <MdApartment size={18} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} title="Dptos">
                          <MdMeetingRoom size={18} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} title="Activos">
                          <MdNotificationsActive size={18} />
                        </div>
                      </div>

                      {/* Cuerpo de la tabla */}
                      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                        {edificios.length > 0 ? (
                          edificios.map((edif, i) => (
                            <div key={edif.id} style={{
                              display: 'grid',
                              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                              gap: '8px',
                              padding: '12px 16px',
                              borderBottom: '1px solid #e0e3ea',
                              background: i % 2 === 0 ? '#f8faff' : '#fff',
                              alignItems: 'center',
                              fontSize: 14
                            }}>
                              <div style={{ color: '#222', fontWeight: 500 }}>{edif.nombre}</div>
                              <div style={{ textAlign: 'center' }}>
                                <a 
                                  href={`/admin/${edif.idUnico}`}
                                  style={{ 
                                    color: '#1976d2', 
                                    fontWeight: 600, 
                                    textDecoration: 'none',
                                    fontSize: 12,
                                    padding: '4px 8px',
                                    background: '#e3f2fd',
                                    borderRadius: 6,
                                    border: '1px solid #90caf9',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#bbdefb';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#e3f2fd';
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                  {edif.idUnico}
                                </a>
                              </div>
                              <div style={{ textAlign: 'center', color: '#1a4fa3', fontWeight: 700 }}>{edif.stats.cantPisos}</div>
                              <div style={{ textAlign: 'center', color: '#1a4fa3', fontWeight: 700 }}>{edif.stats.totalDptos}</div>
                              <div style={{ textAlign: 'center', color: '#388e3c', fontWeight: 700 }}>{edif.stats.timbresActivos}</div>
                            </div>
                          ))
                        ) : (
                          <div style={{
                            padding: '32px 16px',
                            textAlign: 'center',
                            color: '#666',
                            fontSize: 14
                          }}>
                            No hay edificios registrados
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer fijo */}
                <div style={{
                  background: '#e3f2fd',
                  borderTop: '1.5px solid #e0e3ea',
                  padding: '12px 24px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  color: '#1976d2',
                  fontWeight: 700,
                  fontSize: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MdApartment size={18} />
                    <span>{statsTotales.totalEdificios} Edificios</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MdMeetingRoom size={18} />
                    <span>{statsTotales.totalDptos} Dptos</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MdNotificationsActive size={18} />
                    <span>{statsTotales.timbresActivos} Activos</span>
                  </div>
                </div>
              </div>
            )}
            {section === "usuarios" && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
                gap: 18,
                height: '100%'
              }}>
                <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Usuarios</h2>
              </div>
            )}
            
            {section === "ventas" && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                height: '100%',
                background: '#fff'
              }}>
                {/* Header fijo */}
                <div style={{
                  background: '#f8faff',
                  borderBottom: '1.5px solid #e0e3ea',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10
                }}>
                  <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 24, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MdAttachMoney size={24} style={{ color: '#1a4fa3' }} /> Ventas
                  </h2>
                </div>

                {/* Cuerpo central con scroll */}
                <div style={{
                  flex: 1,
                  padding: '16px 24px',
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
                  {loadingVentas ? (
                    <div style={{ color: '#1a4fa3', fontSize: 16, marginTop: 20 }}>Cargando ventas...</div>
                  ) : (
                    <div style={{
                      width: '100%',
                      background: '#fff',
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px #0001',
                      border: '1px solid #e0e3ea'
                    }}>
                      {/* Header de la tabla */}
                      <div style={{
                        background: '#1a4fa3',
                        color: '#fff',
                        padding: '12px 16px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                        gap: '8px',
                        fontWeight: 700,
                        fontSize: 14,
                        alignItems: 'center',
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} title="ID Único">
                          <MdSettings size={18} />
                          ID Único
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} title="Timbres">
                          <MdNotificationsActive size={18} />
                          Timbres
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} title="Monto">
                          <MdAttachMoney size={18} />
                          Monto
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} title="Estado">
                          <MdListAlt size={18} />
                          Estado
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} title="Fecha">
                          <MdDashboard size={18} />
                          Fecha
                        </div>
                      </div>

                      {/* Cuerpo de la tabla */}
                      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                        {ventas.length > 0 ? (
                          ventas.map((venta, i) => (
                            <div key={venta.id} style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                              gap: '8px',
                              padding: '12px 16px',
                              borderBottom: '1px solid #e0e3ea',
                              background: i % 2 === 0 ? '#f8faff' : '#fff',
                              alignItems: 'center',
                              fontSize: 14
                            }}>
                              <div style={{ textAlign: 'center' }}>
                                <a 
                                  href={`/admin/${venta.idUnico}`}
                                  style={{ 
                                    color: '#1976d2', 
                                    fontWeight: 600, 
                                    textDecoration: 'none',
                                    fontSize: 12,
                                    padding: '4px 8px',
                                    background: '#e3f2fd',
                                    borderRadius: 6,
                                    border: '1px solid #90caf9',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#bbdefb';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#e3f2fd';
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                  {venta.idUnico}
                                </a>
                              </div>
                              <div style={{ textAlign: 'center', color: '#1a4fa3', fontWeight: 700 }}>{venta.cantidadTimbres}</div>
                              <div style={{ textAlign: 'center', color: '#388e3c', fontWeight: 700 }}>${venta.monto.toLocaleString()}</div>
                              <div style={{ textAlign: 'center' }}>
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  background: venta.estado === 'PAGADA' ? '#e8f5e9' : '#fff3e0',
                                  color: venta.estado === 'PAGADA' ? '#2e7d32' : '#f57c00',
                                  border: `1px solid ${venta.estado === 'PAGADA' ? '#4caf50' : '#ff9800'}`
                                }}>
                                  {venta.estado}
                                </span>
                              </div>
                              <div style={{ textAlign: 'center', color: '#666', fontSize: 12 }}>
                                {new Date(venta.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{
                            padding: '32px 16px',
                            textAlign: 'center',
                            color: '#666',
                            fontSize: 14
                          }}>
                            No hay ventas registradas
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer fijo */}
                <div style={{
                  background: '#e3f2fd',
                  borderTop: '1.5px solid #e0e3ea',
                  padding: '12px 24px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  color: '#1976d2',
                  fontWeight: 700,
                  fontSize: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MdAttachMoney size={18} />
                    <span>{ventas.length} Ventas</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MdNotificationsActive size={18} />
                    <span>{ventas.reduce((acc, v) => acc + v.cantidadTimbres, 0)} Timbres</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MdDashboard size={18} />
                    <span>${ventas.reduce((acc, v) => acc + v.monto, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            {section === "logs" && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
                gap: 18,
                height: '100%'
              }}>
                <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Logs</h2>
            </div>
            )}
            
            {section === "config" && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
                gap: 18,
                height: '100%'
              }}>
            <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Configuración</h2>
            <div style={{ margin: '32px 0', width: '100%', maxWidth: 340, background: '#f8faff', border: '1.5px solid #e0e3ea', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ fontWeight: 700, color: '#1a4fa3', fontSize: 18, marginBottom: 8 }}>Precio por timbre</div>
              {editandoPrecio ? (
                <>
                  <input type="number" value={precioPorTimbre} onChange={e => setPrecioPorTimbre(e.target.value)} style={{ fontSize: 20, padding: 8, borderRadius: 8, border: '1.5px solid #1a4fa3', width: 120, textAlign: 'center' }} />
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={guardarPrecio} disabled={guardando} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{guardando ? 'Guardando...' : 'Guardar'}</button>
                    <button onClick={() => { setEditandoPrecio(false); cargarPrecio(); }} style={{ background: '#bbb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#1976d2', marginBottom: 8 }}>${precioPorTimbre}</div>
                  <button onClick={() => setEditandoPrecio(true)} style={{ background: '#1a4fa3', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Editar</button>
                </>
              )}
              {mensaje && <div style={{ color: mensaje.includes('guardado') ? '#388e3c' : '#d32f2f', fontWeight: 700 }}>{mensaje}</div>}
            </div>
              </div>
            )}
            
            {/* Footer con descripción */}
            <div style={{
              background: '#f8faff',
              borderTop: '1.5px solid #e0e3ea',
              padding: '12px 24px',
              color: "#888",
              fontSize: 14,
              textAlign: "center"
            }}>
              {section === "dashboard" && "Bienvenido al panel de control Super. Aquí verás estadísticas y accesos rápidos."}
              {section === "edificios" && "Gestión de edificios: alta, baja, edición y visualización de edificios cargados."}
              {section === "usuarios" && "Gestión de usuarios: residentes, administradores y permisos."}
              {section === "ventas" && "Reportes de ventas y análisis de ingresos del sistema."}
              {section === "logs" && "Registro de actividades y eventos del sistema."}
              {section === "config" && "Configuración global del sistema y parámetros."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuperPanel() {
  return (
    <AuthGuard requiredRole="SuperAdmin">
      <SuperPanelContent />
    </AuthGuard>
  );
} 