"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRingContainer from './components/QRingContainer';
import CInfo from './components/CInfo';


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

export default function PublicPage() {
  const router = useRouter();
  const [wizardData, setWizardData] = useState<any>(null);
  const [timbresActualizados, setTimbresActualizados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del wizard desde localStorage y timbres actualizados desde BD
  useEffect(() => {
    const cargarDatos = async () => {
      const datosGuardados = localStorage.getItem('wizardData');
      if (datosGuardados) {
        const data = JSON.parse(datosGuardados);
        setWizardData(data);
        
        // Cargar timbres actualizados desde la BD
        try {
          const response = await fetch(`/api/admin/estructura?idUnico=${data.idUnico}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.estructura) {
              // Extraer timbres de la estructura (están anidados por piso)
              const timbres = result.estructura.flatMap((piso: any) => 
                (piso.timbres || []).map((timbre: any) => ({
                  ...timbre,
                  piso: piso.nombre, // Asegurar que el piso esté correctamente asignado
                  estadoAsignacion: timbre.estadoAsignacion || 'libre' // Valor por defecto
                }))
              );
              console.log('Timbres cargados:', timbres); // Debug
              setTimbresActualizados(timbres);
            }
          }
        } catch (error) {
          console.error('Error cargando timbres actualizados:', error);
        }
      } else {
        // Si no hay datos, redirigir a la tienda
        router.push('/tienda');
      }
      setLoading(false);
    };
    
    cargarDatos();
  }, [router]);

  if (!wizardData || loading) {
    return (
      <div style={{ 
        height: "100vh", 
        background: "#f4f6fa", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        padding: '20px',
        overflow: 'hidden'
      }}>
        <div style={{ textAlign: 'center', color: '#1a4fa3', fontSize: 18 }}>
          Cargando configuración...
        </div>
      </div>
    );
  }



  return (
    <div style={{ 
      height: "100vh", 
      background: "#f4f6fa", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: '2px 0',
      paddingBottom: '20px', // Espacio mínimo para página pública
      overflow: 'hidden' // Evitar scroll
    }}>
      {/* Contenedor Principal usando el componente compartido */}
      <QRingContainer
        calle={wizardData.calle}
        numero={wizardData.numero}
        idUnico={wizardData.idUnico || 'test-id'}
        estructura={wizardData.estructura}
        timbres={timbresActualizados}
        showBottomButtons={true}
        onTiendaClick={() => router.push('/tienda')}
        onUsuariosClick={() => router.push('/admin/panel')}
      />



      {/* CInfo inferior */}
      <div style={{ maxWidth: 380, width: '100%', margin: '18px auto 0 auto' }}>
        <CInfo texto="¡Bienvenidos a QRing! Escaneá el QR y elegí Piso y Dpto que querés Timbrear y enviá un WS al residente!" />
      </div>

      {/* No NavBar para página pública */}
    </div>
  );
}
