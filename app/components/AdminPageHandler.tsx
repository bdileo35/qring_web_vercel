import prisma from '@/lib/prisma';
import ConfiguradorEdificio from '@/app/components/ConfiguradorEdificio';
import WizardOnboarding from '@/app/components/WizardOnboarding';

type DireccionCompleta = any;

async function getData(idUnico: string): Promise<{ direccion: DireccionCompleta | null; ventaValida: boolean }> {
  if (!idUnico) return { direccion: null, ventaValida: false };

  const direccion = await prisma.direccion.findUnique({
    where: { idUnico },
    include: { timbres: true },
  });

  if (direccion) {
    return { direccion: direccion as any, ventaValida: true };
  }

  const venta = await prisma.venta.findFirst({
    where: { idUnico, estado: 'PAGADA' },
  });

  return { direccion: null, ventaValida: !!venta };
}

export default async function AdminPageHandler({ idUnico }: { idUnico: string }) {
  if (!idUnico) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Error: ID único no proporcionado.</div>;
  }

  const { direccion, ventaValida } = await getData(idUnico);

  if (direccion) {
    return <ConfiguradorEdificio direccionInicial={direccion} />;
  }

  if (ventaValida) {
    return <WizardOnboarding />;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px', background: '#f4f6fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 500, background: '#fff', padding: '40px', borderRadius: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
        <h1 style={{ color: "#e74c3c", fontWeight: 800, marginBottom: '16px' }}>Acceso no válido</h1>
        <p style={{ fontSize: 16, color: '#333', lineHeight: 1.6 }}>
          El enlace que utilizaste no es correcto o no corresponde a una compra finalizada.
          Por favor, verifica el enlace que recibiste en tu correo electrónico de confirmación.
        </p>
      </div>
    </div>
  );
} 