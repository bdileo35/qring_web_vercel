import React from 'react';

export default function Body({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ paddingTop: 80, paddingBottom: 80, minHeight: '100vh', background: '#f4f6fa' }}>
      {children}
    </main>
  );
} 