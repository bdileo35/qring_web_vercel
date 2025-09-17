import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: '#fff',
      borderTop: '1px solid #e0e0e0',
      boxShadow: '0 -2px 8px #0001',
      padding: '16px 0',
      textAlign: 'center',
      fontSize: 14,
      color: '#666',
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 5
    }}>
      © {new Date().getFullYear()} QRing. Todos los derechos reservados.
    </footer>
  );
} 