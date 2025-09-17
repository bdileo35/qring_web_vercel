import { PrismaClient } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; email: string }[]>([]);

  useEffect(() => {
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data));
  }, []);

  return (
    <div style={{ padding: 20, background: '#111', color: '#fff' }}>
      <h1>Usuarios en Prisma (SQLite)</h1>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.nombre} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
}