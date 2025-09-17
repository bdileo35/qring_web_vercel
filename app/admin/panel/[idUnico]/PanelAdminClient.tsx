'use client';

import { useState, useEffect } from 'react';
import NavBar from '../../../components/NavBar';

interface Timbre {
  id: string;
  nombre: string;
  piso: string;
  dpto: string;
  numero: string | null;
  metodo: string;
  estado: string;
  estadoAsignacion: string;
}

interface Estructura {
  id: string;
  nombre: string;
  dptos: string;
  orden: number;
  timbres: Timbre[];
}

interface PanelAdminClientProps {
  idUnico: string;
}

export default function PanelAdminClient({ idUnico }: PanelAdminClientProps) {
  const [estructura, setEstructura] = useState<Estructura[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTimbre, setSelectedTimbre] = useState<Timbre | null>(null);

  useEffect(() => {
    cargarEstructura();
  }, [idUnico]);

  const cargarEstructura = async () => {
    try {
      const response = await fetch(`/api/admin/estructura?idUnico=${idUnico}`);
      const data = await response.json();
      
      if (data.success) {
        setEstructura(data.estructura || []);
      }
    } catch (error) {
      console.error('Error cargando estructura:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimbreClick = (timbre: Timbre) => {
    setSelectedTimbre(timbre);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTimbre(null);
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando panel...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <NavBar />
      
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          marginBottom: '30px', 
          color: '#1a4fa3',
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Panel de Administración - {idUnico}
        </h1>

        <div style={{ display: 'grid', gap: '20px' }}>
          {estructura.map((piso) => (
            <div key={piso.id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                color: '#333',
                fontSize: '24px',
                marginBottom: '15px',
                borderBottom: '2px solid #1a4fa3',
                paddingBottom: '10px'
              }}>
                Piso {piso.nombre} - {piso.dptos} departamentos
              </h2>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center'
              }}>
                <span style={{
                  color: '#1a4fa3',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginRight: '10px'
                }}>
                  {piso.nombre}
                </span>
                {piso.timbres?.map((timbre) => (
                  <button
                    key={timbre.id}
                    onClick={() => handleTimbreClick(timbre)}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '25px',
                      border: '2px solid #ff8c00',
                      backgroundColor: timbre.numero ? '#4caf50' : '#fff',
                      color: timbre.numero ? '#fff' : '#1a4fa3',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: timbre.numero ? '0 2px 8px rgba(76, 175, 80, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = timbre.numero ? '0 2px 8px rgba(76, 175, 80, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                    title={`${timbre.nombre}${timbre.numero ? ` - 📞 ${timbre.numero}` : ' - Sin configurar'}`}
                  >
                    {timbre.dpto}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Ring Ring */}
      {showModal && selectedTimbre && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={closeModal}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '15px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px',
              animation: 'ring 1s infinite'
            }}>
              🔔
            </div>
            <h2 style={{ fontSize: '28px', marginBottom: '15px', color: '#1a4fa3' }}>
              Ring... Ring...
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '20px', color: '#666' }}>
              Timbre: <strong>{selectedTimbre.nombre}</strong>
            </p>
            {selectedTimbre.numero && (
              <p style={{ fontSize: '16px', color: '#28a745' }}>
                📞 {selectedTimbre.numero}
              </p>
            )}
            <button
              onClick={closeModal}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#1a4fa3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes ring {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
