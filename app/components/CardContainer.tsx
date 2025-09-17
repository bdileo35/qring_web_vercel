import React from 'react';

// CardContainer: Contenedor central reutilizable para todas las páginas principales.
// El alto está pensado para dejar espacio para hasta 3 líneas de botones, pero se acomoda bien si hay 2 líneas.
export default function CardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: 320, // Altura más compacta para el paso final
        maxWidth: '860px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '22px',
        boxShadow: '0 4px 24px #0002',
        padding: '20px 18px', // Padding vertical reducido
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        boxSizing: 'border-box',
        border: '1px solid #d0d7de',
      }}
    >
      {children}
    </div>
  );
} 