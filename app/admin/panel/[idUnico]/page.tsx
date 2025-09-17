import { Suspense } from 'react';
import PanelAdminClient from './PanelAdminClient';

export default async function PanelAdminPage({ 
  params 
}: { 
  params: Promise<{ idUnico: string }> 
}) {
  const resolvedParams = await params;
  const idUnico = resolvedParams.idUnico;

  return (
    <Suspense fallback={<div>Cargando panel...</div>}>
      <PanelAdminClient idUnico={idUnico} />
    </Suspense>
  );
}
