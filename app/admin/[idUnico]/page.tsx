import { Suspense } from 'react';
import AdminComunidadPageClient from './AdminComunidadPageClient';

export default async function AdminComunidadPage({ 
  params 
}: { 
  params: Promise<{ idUnico: string }> 
}) {
  const resolvedParams = await params;
  const idUnico = resolvedParams.idUnico;

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AdminComunidadPageClient idUnico={idUnico} />
    </Suspense>
  );
}
