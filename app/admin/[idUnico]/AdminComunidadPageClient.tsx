'use client';

import WizardOnboarding from '../../components/WizardOnboarding';

interface AdminComunidadPageClientProps {
  idUnico: string;
}

export default function AdminComunidadPageClient({ idUnico }: AdminComunidadPageClientProps) {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ 
        marginBottom: '20px', 
        color: '#1a4fa3',
        fontSize: '28px',
        fontWeight: '900',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Edificio: {idUnico}
      </h1>
      
      <WizardOnboarding />
    </div>
  );
} 