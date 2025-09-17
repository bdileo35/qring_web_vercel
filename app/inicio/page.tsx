"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRingContainer from '../components/QRingContainer';
import NavBar from '../components/NavBar';
import CInfo from '../components/CInfo';
import { MdApartment, MdNotificationsActive, MdPerson } from "react-icons/md";

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

export default function InicioPage() {
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
        minHeight: "100vh", 
        background: "#f4f6fa", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', color: '#1a4fa3', fontSize: 18 }}>
          Cargando configuración...
        </div>
      </div>
    );
  }

  // Calcular estadísticas usando timbres actualizados de la BD
  const totalTimbres = wizardData.estructura?.reduce((acc: number, piso: PisoConfig) => acc + piso.dptos.length, 0) || 0;
  const timbresConfigurados = timbresActualizados.filter((t: any) => t.estadoAsignacion === 'configurado').length || 0;
  const timbresAsignados = timbresActualizados.filter((t: any) => t.estadoAsignacion === 'asignado').length || 0;

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f4f6fa", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: '10px 0',
      paddingBottom: '20px' // Espacio mínimo para página pública
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

      {/* Estadísticas de configuración */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        marginTop: 24, 
        width: '100%', 
        maxWidth: 380, 
        justifyContent: 'center',
        background: '#fff',
        borderRadius: 16,
        padding: '16px',
        boxShadow: '0 2px 8px #0001'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a4fa3', fontWeight: 700 }}>
          <MdApartment size={20} />
          <span>{totalTimbres} timbres</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#388e3c', fontWeight: 700 }}>
          <MdNotificationsActive size={20} />
          <span>{timbresConfigurados} configurados</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1976d2', fontWeight: 700 }}>
          <MdPerson size={20} />
          <span>{timbresAsignados} asignados</span>
        </div>
      </div>

      {/* CInfo inferior */}
      <div style={{ maxWidth: 380, width: '100%', margin: '18px auto 0 auto' }}>
        <CInfo texto="¡Bienvenido! Escaneá el código QR para tocar timbres. Los residentes pueden acceder a su panel privado desde el botón de Usuarios." />
      </div>

      {/* No NavBar para página pública */}
    </div>
  );
} 