"use client";

import Header from '@/app/components/Header';
import CardContainer from '@/app/components/CardContainer';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ExitoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [venta, setVenta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idUnico = searchParams.get('idUnico');
    if (idUnico) {
      // Obtener datos de la venta desde la URL
      const ventaData = {
        idUnico: idUnico,
        cantidadTimbres: parseInt(searchParams.get('cantidad') || '5'),
        precioTotal: parseInt(searchParams.get('monto') || '5000')
      };
      setVenta(ventaData);
      
      // 🔧 CRÍTICO: Guardar el IDU en localStorage para que el wizard lo use
      localStorage.setItem('ventaIdUnico', idUnico);
      console.log('✅ IDU guardado en localStorage:', idUnico);
      
      // 🔧 CRÍTICO: Guardar la venta en la base de datos automáticamente
      console.log('🚀 Iniciando guardado automático...');
      guardarVentaEnBaseDeDatos(ventaData);
      
      setLoading(false);
    }
  }, [searchParams]);

  const guardarVentaEnBaseDeDatos = async (ventaData: any) => {
    try {
      console.log('🔄 Guardando venta en base de datos:', ventaData);
      
      const response = await fetch('/api/admin/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUnico: ventaData.idUnico,
          cantidadTimbres: ventaData.cantidadTimbres,
          monto: ventaData.precioTotal
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Venta guardada exitosamente en BD:', result);
      } else {
        console.error('❌ Error guardando venta en BD:', result.error);
      }
    } catch (error) {
      console.error('❌ Error de conexión guardando venta:', error);
    }
  };

  const handleConfigurar = () => {
    if (!venta) return;
    
    // Simplemente ir al wizard
    router.push(`/admin/wizard-estructura?idUnico=${venta.idUnico}`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <div style={{ fontSize: 24, color: '#1a4fa3' }}>Procesando pago...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: 60, paddingBottom: 60, minHeight: '100vh', background: '#f4f6fa' }}>
        <CardContainer>
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ color: '#4CAF50', fontWeight: 800, fontSize: 24, marginBottom: 12 }}>
              ¡Pago Exitoso!
            </h1>
            <p style={{ color: '#333', fontSize: 16, marginBottom: 24, lineHeight: 1.4 }}>
              Tu compra de QRing ha sido procesada correctamente.
            </p>
            
            {venta && (
              <div style={{ background: '#f9f9f9', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <h2 style={{ color: '#1a4fa3', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
                  Detalles de tu compra
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#333', fontWeight: 600 }}>ID Único:</span>
                    <span style={{ color: '#1a4fa3', fontWeight: 700 }}>{venta.idUnico}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#333', fontWeight: 600 }}>Timbres:</span>
                    <span style={{ color: '#1a4fa3', fontWeight: 700 }}>{venta.cantidadTimbres}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#333', fontWeight: 600 }}>Total:</span>
                    <span style={{ color: '#1a4fa3', fontWeight: 700 }}>${venta.precioTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                onClick={handleConfigurar}
                style={{ 
                  maxWidth: 300,
                  background: '#1a4fa3', 
                  color: '#fff', 
                  border: 'none',
                  padding: '14px 32px', 
                  borderRadius: 10, 
                  fontWeight: 700, 
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #0001'
                }}
              >
                ⚙️ Configurar Edificio
              </button>
            </div>
            

          </div>
        </CardContainer>
      </main>
    </>
  );
}

export default function ExitoPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ExitoContent />
    </Suspense>
  );
} 