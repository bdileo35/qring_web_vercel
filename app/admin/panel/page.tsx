"use client";
import { useState, useEffect } from "react";
import { MdDashboard, MdLocationCity, MdPeople, MdAttachMoney, MdListAlt, MdSettings, MdLocationOn, MdApartment, MdMeetingRoom, MdNotificationsActive } from "react-icons/md";
import AuthGuard from "@/app/components/AuthGuard";
import PanelLayout from "@/app/components/PanelLayout";
import DataGrid from "@/app/components/DataGrid";

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
  const [section, setSection] = useState("dashboard");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [precioPorTimbre, setPrecioPorTimbre] = useState('');
  const [editandoPrecio, setEditandoPrecio] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [loadingEdificios, setLoadingEdificios] = useState(false);
  const [ventas, setVentas] = useState<any[]>([]);
  const [loadingVentas, setLoadingVentas] = useState(false);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

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

  // Configuración de columnas para edificios
  const edificiosColumns = [
    { key: 'nombre', label: '', width: '2fr', align: 'left' as const, icon: <MdLocationOn size={20} /> },
    { key: 'idUnico', label: '', width: '1fr', align: 'center' as const, icon: <MdSettings size={20} /> },
    { key: 'cantPisos', label: '', width: '1fr', align: 'center' as const, icon: <MdApartment size={20} /> },
    { key: 'totalDptos', label: '', width: '1fr', align: 'center' as const, icon: <MdMeetingRoom size={20} /> },
    { key: 'timbresActivos', label: '', width: '1fr', align: 'center' as const, icon: <MdNotificationsActive size={20} /> }
  ];

  // Configuración de columnas para ventas
  const ventasColumns = [
    { key: 'idUnico', label: '', width: '1fr', align: 'center' as const, icon: <MdSettings size={20} /> },
    { key: 'cantidadTimbres', label: '', width: '1fr', align: 'center' as const, icon: <MdNotificationsActive size={20} /> },
    { key: 'monto', label: '', width: '1fr', align: 'center' as const, icon: <MdAttachMoney size={20} /> },
    { key: 'estado', label: '', width: '1fr', align: 'center' as const, icon: <MdListAlt size={20} /> },
    { key: 'createdAt', label: '', width: '1fr', align: 'center' as const, icon: <MdDashboard size={20} /> }
  ];

  // Renderizar contenido según la sección
  const renderContent = () => {
    switch (section) {
      case 'dashboard':
  return (
          <div style={{ height: '100%', padding: '10px' }}>
      <div style={{
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              overflow: 'hidden',
              backgroundColor: '#fff',
              height: '100%'
            }}>
              {/* Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '50px 1fr 100px 100px 100px 120px',
                backgroundColor: '#1a4fa3',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                <div style={{ padding: '12px', textAlign: 'center' }}>+</div>
                <div style={{ padding: '12px' }}>ID Venta</div>
                <div style={{ padding: '12px', textAlign: 'center' }}>Timbres</div>
                <div style={{ padding: '12px', textAlign: 'center' }}>Monto</div>
                <div style={{ padding: '12px', textAlign: 'center' }}>Estado</div>
                <div style={{ padding: '12px', textAlign: 'center' }}>Fecha</div>
              </div>

              {/* Rows */}
              {[
                {
                  id: 'V001',
                  idUnico: 'EDIF_001',
                  cantidadTimbres: 15,
                  monto: 150,
                  estado: 'PAGADA',
                  fecha: '2024-01-15',
                  edificio: {
                    direccion: 'Av. Siempre Viva 123',
                    admin: 'Juan Pérez',
                    timbresConfigurados: 10,
                    timbresAsignados: 5,
                    timbres: [
                      { id: 1, piso: '1', dpto: 'A', configurado: true },
                      { id: 2, piso: '1', dpto: 'B', configurado: false },
                      { id: 3, piso: '2', dpto: 'A', configurado: true }
                    ]
                  }
                },
                {
                  id: 'V002',
                  idUnico: 'EDIF_002',
                  cantidadTimbres: 20,
                  monto: 200,
                  estado: 'PENDIENTE',
                  fecha: '2024-02-20',
                  edificio: {
                    direccion: 'Calle Principal 456',
                    admin: 'María García',
                    timbresConfigurados: 18,
                    timbresAsignados: 12,
                    timbres: [
                      { id: 1, piso: '1', dpto: 'A', configurado: true },
                      { id: 2, piso: '1', dpto: 'B', configurado: true }
                    ]
                  }
                }
              ].map((venta) => (
                <div key={venta.id}>
                  {/* Main Row */}
              <div style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 100px 100px 100px 120px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    backgroundColor: expandedRows.has(venta.id) ? '#f0f8ff' : '#fff'
                  }}
                  onClick={() => toggleRow(venta.id)}>
                    <div style={{ padding: '12px', textAlign: 'center', fontSize: '18px', color: '#1a4fa3' }}>
                      {expandedRows.has(venta.id) ? '−' : '+'}
                    </div>
                    <div style={{ padding: '12px', fontWeight: 'bold', color: '#333' }}>{venta.idUnico}</div>
                    <div style={{ padding: '12px', textAlign: 'center', color: '#1a4fa3', fontWeight: 700 }}>{venta.cantidadTimbres}</div>
                    <div style={{ padding: '12px', textAlign: 'center', color: '#388e3c', fontWeight: 700 }}>${venta.monto}</div>
                <div style={{
                      padding: '12px', 
                      textAlign: 'center',
                      color: '#fff',
                      background: venta.estado === 'PAGADA' ? '#28a745' : '#ffc107',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      margin: '0 8px'
                    }}>
                      {venta.estado === 'PAGADA' ? 'Pag.' : 'Pend.'}
                    </div>
                    <div style={{ padding: '12px', textAlign: 'center', color: '#666', fontSize: '12px' }}>{venta.fecha}</div>
                </div>

                  {/* Expanded Details */}
                  {expandedRows.has(venta.id) && venta.edificio && (
                <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: '16px',
                      borderBottom: '1px solid #eee'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333' }}>
                          <strong>Dirección:</strong> <span>{venta.edificio.direccion}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333' }}>
                          <strong>Admin:</strong> <span>{venta.edificio.admin}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333' }}>
                          <strong>Configurados:</strong> <span>{venta.edificio.timbresConfigurados}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333' }}>
                          <strong>Asignados:</strong> <span>{venta.edificio.timbresAsignados}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333' }}>
                          <strong>Timbres:</strong> 
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span>Tot: {venta.edificio.timbres.length}</span>
                            <span>Config: {venta.edificio.timbresConfigurados}</span>
                            <span>Libres: {venta.edificio.timbres.length - venta.edificio.timbresConfigurados}</span>
              <button
                style={{
                                background: '#1a4fa3',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                // Aquí iría la funcionalidad para mostrar el grid de timbres
                                alert('Mostrar grid de timbres como en la imagen');
                              }}
                            >
                              +
              </button>
                          </div>
                        </div>
                      </div>

                      {/* Timbres Grid */}
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                          {venta.edificio.timbres.map((timbre) => (
                            <div key={timbre.id} style={{
                              padding: '8px',
                              border: `2px solid ${timbre.configurado ? '#28a745' : '#ddd'}`,
                              borderRadius: '6px',
                              backgroundColor: timbre.configurado ? '#f8fff8' : '#f9f9f9',
                              textAlign: 'center',
                              fontSize: '12px',
                              color: timbre.configurado ? '#28a745' : '#666',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              // Aquí iría la funcionalidad para tocar timbre
                              alert(`Tocar timbre ${timbre.piso}${timbre.dpto}`);
                            }}>
                              {timbre.piso}{timbre.dpto}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'edificios':
        return (
          <div style={{ height: '100%' }}>
            <DataGrid
              columns={edificiosColumns}
              data={edificios.map(edif => ({
                ...edif,
                cantPisos: edif.stats.cantPisos,
                totalDptos: edif.stats.totalDptos,
                timbresActivos: edif.stats.timbresActivos
              }))}
              loading={loadingEdificios}
              loadingText="Cargando edificios..."
              emptyText="No hay edificios registrados"
              renderCell={(column, row) => {
                if (column.key === 'idUnico') {
                  return (
                    <a 
                      href={`/admin/${row.idUnico}`}
                      style={{ 
                        color: '#0d2b5e', 
                        fontWeight: 800, 
                        textDecoration: 'none',
                        fontSize: 14,
                        padding: '6px 12px',
                        background: '#e8f4fd',
                        borderRadius: 8,
                        border: '2px solid #1976d2',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(25,118,210,0.2)',
                        display: 'inline-block',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#bbdefb';
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(25,118,210,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#e8f4fd';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(25,118,210,0.2)';
                      }}
                    >
                      {row.idUnico}
                    </a>
                  );
                }
                if (column.key === 'cantPisos' || column.key === 'totalDptos') {
                  return <span style={{ color: '#1a4fa3', fontWeight: 700 }}>{row[column.key]}</span>;
                }
                if (column.key === 'timbresActivos') {
                  return <span style={{ color: '#388e3c', fontWeight: 700 }}>{row[column.key]}</span>;
                }
                return <span style={{ color: '#333', fontWeight: 500 }}>{row[column.key]}</span>;
              }}
            />
          </div>
        );

      case 'usuarios':
        return (
          <div style={{ height: '100%' }}>
            <DataGrid
              columns={[
                { key: 'nombre', label: '', width: '2fr', align: 'left' as const, icon: <MdPeople size={20} /> },
                { key: 'email', label: '', width: '2fr', align: 'left' as const, icon: <MdSettings size={20} /> },
                { key: 'rol', label: '', width: '1fr', align: 'center' as const, icon: <MdApartment size={20} /> },
                { key: 'estado', label: '', width: '1fr', align: 'center' as const, icon: <MdNotificationsActive size={20} /> }
              ]}
              data={[
                { nombre: 'Juan Pérez', email: 'juan@qring.com', rol: 'Admin', estado: 'Activo' },
                { nombre: 'María García', email: 'maria@qring.com', rol: 'User', estado: 'Activo' },
                { nombre: 'Carlos López', email: 'carlos@qring.com', rol: 'SuperAdmin', estado: 'Activo' },
                { nombre: 'Ana Martínez', email: 'ana@qring.com', rol: 'User', estado: 'Inactivo' },
                { nombre: 'Luis Rodríguez', email: 'luis@qring.com', rol: 'Admin', estado: 'Activo' }
              ]}
              loading={false}
              loadingText="Cargando usuarios..."
              emptyText="No hay usuarios registrados"
              renderCell={(column, row) => {
                if (column.key === 'rol') {
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: row.rol === 'SuperAdmin' ? '#e8f5e9' : row.rol === 'Admin' ? '#e3f2fd' : '#fff3e0',
                      color: row.rol === 'SuperAdmin' ? '#2e7d32' : row.rol === 'Admin' ? '#1976d2' : '#f57c00',
                      border: `1px solid ${row.rol === 'SuperAdmin' ? '#4caf50' : row.rol === 'Admin' ? '#2196f3' : '#ff9800'}`
                    }}>
                      {row.rol}
                    </span>
                  );
                }
                if (column.key === 'estado') {
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: row.estado === 'Activo' ? '#e8f5e9' : '#ffebee',
                      color: row.estado === 'Activo' ? '#2e7d32' : '#c62828',
                      border: `1px solid ${row.estado === 'Activo' ? '#4caf50' : '#f44336'}`
                    }}>
                      {row.estado}
                    </span>
                  );
                }
                return row[column.key];
              }}
            />
                        </div>
        );

      case 'ventas':
        return (
          <div style={{ height: '100%' }}>
            <DataGrid
              columns={[
                { key: 'idUnico', label: '', width: '1fr', align: 'center' as const, icon: <MdSettings size={20} /> },
                { key: 'cliente', label: '', width: '2fr', align: 'left' as const, icon: <MdPeople size={20} /> },
                { key: 'cantidadTimbres', label: '', width: '1fr', align: 'center' as const, icon: <MdNotificationsActive size={20} /> },
                { key: 'monto', label: '', width: '1fr', align: 'center' as const, icon: <MdAttachMoney size={20} /> },
                { key: 'estado', label: '', width: '1fr', align: 'center' as const, icon: <MdListAlt size={20} /> },
                { key: 'createdAt', label: '', width: '1fr', align: 'center' as const, icon: <MdDashboard size={20} /> }
              ]}
              data={[
                { idUnico: 'WFZB9N0D', cliente: 'Juan Pérez', cantidadTimbres: 2, monto: 15000, estado: 'PAGADA', createdAt: '2025-07-20' },
                { idUnico: 'QGY93QB7', cliente: 'María García', cantidadTimbres: 1, monto: 7500, estado: 'PAGADA', createdAt: '2025-07-19' },
                { idUnico: '3FAM69M4', cliente: 'Carlos López', cantidadTimbres: 3, monto: 22500, estado: 'PENDIENTE', createdAt: '2025-07-18' },
                { idUnico: '3URPP8NQ', cliente: 'Ana Martínez', cantidadTimbres: 1, monto: 7500, estado: 'PAGADA', createdAt: '2025-07-17' },
                { idUnico: '3TD8F8MH', cliente: 'Luis Rodríguez', cantidadTimbres: 2, monto: 15000, estado: 'PAGADA', createdAt: '2025-07-16' },
                { idUnico: 'DW86LAYQ', cliente: 'Sofía Torres', cantidadTimbres: 1, monto: 7500, estado: 'PENDIENTE', createdAt: '2025-07-15' }
              ]}
              loading={false}
              loadingText="Cargando ventas..."
              emptyText="No hay ventas registradas"
              renderCell={(column, row) => {
                if (column.key === 'idUnico') {
                  return (
                                <a 
                      href={`/admin/${row.idUnico}`}
                                  style={{ 
                                    color: '#0d2b5e', 
                                    fontWeight: 800, 
                                    textDecoration: 'none',
                                    fontSize: 14,
                                    padding: '6px 12px',
                                    background: '#e8f4fd',
                                    borderRadius: 8,
                                    border: '2px solid #1976d2',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 2px 4px rgba(25,118,210,0.2)',
                                    display: 'inline-block',
                                    minWidth: '80px',
                                    textAlign: 'center'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#bbdefb';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(25,118,210,0.3)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#e8f4fd';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(25,118,210,0.2)';
                                  }}
                                >
                      {row.idUnico}
                                </a>
                  );
                }
                if (column.key === 'cantidadTimbres') {
                  return <span style={{ color: '#1a4fa3', fontWeight: 700 }}>{row.cantidadTimbres}</span>;
                }
                if (column.key === 'monto') {
                  return <span style={{ color: '#388e3c', fontWeight: 700 }}>${row.monto.toLocaleString()}</span>;
                }
                if (column.key === 'estado') {
                  return (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: row.estado === 'PAGADA' ? '#e8f5e9' : '#fff3e0',
                      color: row.estado === 'PAGADA' ? '#2e7d32' : '#f57c00',
                      border: `1px solid ${row.estado === 'PAGADA' ? '#4caf50' : '#ff9800'}`
                    }}>
                      {row.estado}
                    </span>
                  );
                }
                if (column.key === 'createdAt') {
                  const fecha = new Date(row.createdAt);
                  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });
                  const horaFormateada = fecha.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  });
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#333', fontSize: 12, fontWeight: 600 }}>{fechaFormateada}</div>
                      <div style={{ color: '#666', fontSize: 10 }}>{horaFormateada}</div>
                    </div>
                  );
                }
                return row[column.key];
              }}
            />
                </div>
        );

      case 'logs':
        return (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
          height: '100%',
            gap: 18
              }}>
                <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Logs</h2>
            </div>
        );
            
      case 'config':
        return (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            height: '100%',
            gap: 18
              }}>
            <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Configuración</h2>
            <div style={{ 
              margin: '32px 0', 
              width: '100%', 
              maxWidth: 340, 
              background: '#f8faff', 
              border: '1.5px solid #e0e3ea', 
              borderRadius: 16, 
              padding: 24, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 16 
            }}>
              <div style={{ fontWeight: 700, color: '#1a4fa3', fontSize: 18, marginBottom: 8 }}>Precio por timbre</div>
              {editandoPrecio ? (
                <>
                  <input 
                    type="number" 
                    value={precioPorTimbre} 
                    onChange={e => setPrecioPorTimbre(e.target.value)} 
                    style={{ 
                      fontSize: 20, 
                      padding: 8, 
                      borderRadius: 8, 
                      border: '1.5px solid #1a4fa3', 
                      width: 120, 
                      textAlign: 'center' 
                    }} 
                  />
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                      onClick={guardarPrecio} 
                      disabled={guardando} 
                      style={{ 
                        background: '#1976d2', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 8, 
                        padding: '8px 18px', 
                        fontWeight: 700, 
                        fontSize: 16, 
                        cursor: 'pointer' 
                      }}
                    >
                      {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button 
                      onClick={() => { setEditandoPrecio(false); cargarPrecio(); }} 
                      style={{ 
                        background: '#bbb', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 8, 
                        padding: '8px 18px', 
                        fontWeight: 700, 
                        fontSize: 16, 
                        cursor: 'pointer' 
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#1976d2', marginBottom: 8 }}>${precioPorTimbre}</div>
                  <button 
                    onClick={() => setEditandoPrecio(true)} 
                    style={{ 
                      background: '#1a4fa3', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: 8, 
                      padding: '8px 18px', 
                      fontWeight: 700, 
                      fontSize: 16, 
                      cursor: 'pointer' 
                    }}
                  >
                    Editar
                  </button>
                </>
              )}
              {mensaje && <div style={{ color: mensaje.includes('guardado') ? '#388e3c' : '#d32f2f', fontWeight: 700 }}>{mensaje}</div>}
            </div>
              </div>
        );

      default:
        return null;
    }
  };

  // Renderizar footer según la sección
  const renderFooter = () => {
    switch (section) {
            case 'edificios':
        return (
            <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '8px',
            alignItems: 'center',
            color: '#1a4fa3',
            fontWeight: 700,
            fontSize: 12,
            padding: '0 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start' }}>
              <MdLocationOn size={16} />
              <span>{edificios.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdSettings size={16} />
              <span>{edificios.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdApartment size={16} />
              <span>{edificios.reduce((acc, e) => acc + (e.stats.cantPisos || 0), 0)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdMeetingRoom size={16} />
              <span>{statsTotales.totalDptos}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdNotificationsActive size={16} />
              <span>{statsTotales.timbresActivos}</span>
            </div>
          </div>
        );

      case 'ventas':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
            gap: '8px',
            alignItems: 'center',
            color: '#1a4fa3',
            fontWeight: 700,
            fontSize: 12,
            padding: '0 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdSettings size={16} />
              <span>6</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start' }}>
              <MdPeople size={16} />
              <span>6</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdNotificationsActive size={16} />
              <span>10</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdAttachMoney size={16} />
              <span>75000</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdListAlt size={16} />
              <span>4</span>
        </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdDashboard size={16} />
              <span>6</span>
      </div>
    </div>
        );

      case 'usuarios':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr',
            gap: '8px',
            alignItems: 'center',
            color: '#1a4fa3',
            fontWeight: 700,
            fontSize: 12,
            padding: '0 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start' }}>
              <MdPeople size={16} />
              <span>5</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start' }}>
              <MdSettings size={16} />
              <span>5</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdApartment size={16} />
              <span>3</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MdNotificationsActive size={16} />
              <span>4</span>
            </div>
          </div>
        );

      default:
        return (
          <span>
            {section === "dashboard" && "Bienvenido al panel de control Super. Aquí verás estadísticas y accesos rápidos."}
            {section === "logs" && "Registro de actividades y eventos del sistema."}
            {section === "config" && "Configuración global del sistema y parámetros."}
          </span>
        );
    }
  };

  return (
    <PanelLayout
      title={section === 'dashboard' ? 'Dashboard' : 
            section === 'edificios' ? 'Edificios' :
            section === 'usuarios' ? 'Usuarios' :
            section === 'ventas' ? 'Ventas' :
            section === 'logs' ? 'Logs' :
            section === 'config' ? 'Configuración' : 'Panel'}
      headerIcon={section === 'edificios' ? <MdApartment size={24} style={{ color: '#fff' }} /> :
                 section === 'usuarios' ? <MdPeople size={24} style={{ color: '#fff' }} /> :
                 section === 'ventas' ? <MdAttachMoney size={24} style={{ color: '#fff' }} /> : undefined}
      sections={SECTIONS}
      currentSection={section}
      onSectionChange={setSection}
      footerContent={renderFooter()}
      containerWidth={1400}
    >
      {renderContent()}
    </PanelLayout>
  );
}

export default function SuperPanel() {
  return (
    <AuthGuard requiredRole="SuperAdmin">
      <SuperPanelContent />
    </AuthGuard>
  );
} 