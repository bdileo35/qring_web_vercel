"use client";
import { useEffect, useState } from "react";
import QRCodeDisplay from "@/app/components/QRCodeDisplay";
import CardContainer from "@/app/components/CardContainer";
import Header from '@/app/components/Header';
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import PanelAcceso from "@/app/components/PanelAcceso";
import WizardOnboarding from "@/app/components/WizardOnboarding";
import AuthGuard from "@/app/components/AuthGuard";

// Estructura de pisos y dptos (ejemplo)
const pisos = ["PB", 1, 2, 3, 4, 5];
const dptosPorPiso: Record<string, string[]> = {
  "PB": ["A"],
  "1": ["A","B","C","D","E","F","G","H"],
  "2": ["A","B","C","D","E","F","G","H"],
  "3": ["A","B","C","D","E","F","G","H"],
  "4": ["A","B","C","D","E","F","G","H"],
  "5": ["A","B","C","D","E","F"]
};
// Timbres configurados (ejemplo)
const timbresActivos = [
  { piso: "PB", dpto: "A" },
  { piso: "1", dpto: "A" },
  { piso: "1", dpto: "B" },
  { piso: "2", dpto: "C" },
  { piso: "3", dpto: "H" },
  { piso: "5", dpto: "F" }
];

function AdminRootPageContent() {
  const [tab, setTab] = useState<'Piso' | 'Dpto'>('Piso');
  const [pisoSel, setPisoSel] = useState<string | null>(null);
  const [dptoSel, setDptoSel] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const router = useRouter();

  // Listener para el evento de abrir wizard
  useEffect(() => {
    const handleAbrirWizard = () => {
      setShowConfigModal(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('abrir-wizard-config', handleAbrirWizard);
      
      return () => {
        window.removeEventListener('abrir-wizard-config', handleAbrirWizard);
      };
    }
  }, []);

  // Función para saber si un timbre está activo
  const isTimbreActivo = (piso: string, dpto: string) =>
    timbresActivos.some(t => t.piso === piso && t.dpto === dpto);

  return (
    <>
      <Header />
      {/* Modal de configuración del Wizard */}
      {showConfigModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.25)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowConfigModal(false)}
        >
          <div style={{ position: 'relative', zIndex: 3100 }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowConfigModal(false)}
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                background: '#fff',
                border: '2px solid #ccc',
                borderRadius: '50%',
                width: 38,
                height: 38,
                fontSize: 22,
                fontWeight: 700,
                color: '#1a4fa3',
                cursor: 'pointer',
                zIndex: 3200,
                boxShadow: '0 2px 8px #0003'
              }}
            >×</button>
            <WizardOnboarding />
          </div>
        </div>
      )}
      <main style={{ 
        minHeight: "100vh", 
        background: "#f4f6fa", 
        paddingTop: 40, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        paddingBottom: '80px' // Espacio para NavBar
      }}>

        {/* Botón temporal para abrir el wizard */}
        <button 
            onClick={() => {
                // Forzamos el inicio en el paso 1
                const datosGuardados = localStorage.getItem('wizardData');
                if (datosGuardados) {
                    const data = JSON.parse(datosGuardados);
                    data.paso = 1;
                    localStorage.setItem('wizardData', JSON.stringify(data));
                }
                setShowConfigModal(true)
            }}
            style={{
                background: '#1976d2',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                margin: '20px'
            }}
        >
            Abrir Wizard de Configuración
        </button>

        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto', marginTop: 4 }}>
          <PanelAcceso
            direccion="Av. Siempre Viva 1234"
            qrValue="http://localhost:3000/admin"
            mostrarBotonesExtra={false}
          />
        </div>
      </main>
      <NavBar />
    </>
  );
}

export default function AdminRootPage() {
  return (
    <AuthGuard requiredRole="Admin">
      <AdminRootPageContent />
    </AuthGuard>
  );
}