import React from "react";

export interface PisoConfig {
  nombre: string;
  dptos: string[];
}

interface GrillaEditableEstructuraProps {
  estructura: PisoConfig[];
  onChange: (estructura: PisoConfig[]) => void;
}

export default function GrillaEditableEstructura({ estructura, onChange }: GrillaEditableEstructuraProps) {
  // Editar nombre de dpto
  const editarDpto = (pisoIdx: number, dptoIdx: number, valor: string) => {
    const nueva = estructura.map((p, i) =>
      i === pisoIdx ? { ...p, dptos: p.dptos.map((d, j) => j === dptoIdx ? valor : d) } : p
    );
    onChange(nueva);
  };
  // Eliminar dpto
  const eliminarDpto = (pisoIdx: number, dptoIdx: number) => {
    const nueva = estructura.map((p, i) =>
      i === pisoIdx ? { ...p, dptos: p.dptos.filter((_, j) => j !== dptoIdx) } : p
    );
    onChange(nueva);
  };
  // Agregar dpto
  const agregarDpto = (pisoIdx: number) => {
    const nueva = estructura.map((p, i) =>
      i === pisoIdx ? { ...p, dptos: [...p.dptos, ""] } : p
    );
    onChange(nueva);
  };

  return (
    <div style={{ marginTop: 18 }}>
      {estructura.map((piso, i) => (
        <div key={i} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, color: '#1a4fa3', marginRight: 8, minWidth: 32 }}>{piso.nombre}:</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {piso.dptos.map((d, j) => (
              <div key={j} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input value={d} onChange={e => editarDpto(i, j, e.target.value)} style={{ width: 32, height: 32, border: '2px solid #bbb', background: '#fff', fontWeight: 700, fontSize: 20, color: '#1976d2', textAlign: 'center', borderRadius: 8, marginBottom: 2, boxShadow: '0 1px 4px #0001' }} />
                <button onClick={() => eliminarDpto(i, j)} style={{ background: 'none', border: 'none', color: '#c00', fontWeight: 700, cursor: 'pointer', fontSize: 18, lineHeight: 1 }} title="Eliminar">×</button>
              </div>
            ))}
            <button onClick={() => agregarDpto(i)} style={{ background: '#e3eaff', color: '#1976d2', border: '1.5px solid #1976d2', borderRadius: 8, fontWeight: 700, fontSize: 20, width: 32, height: 32, marginLeft: 6, cursor: 'pointer' }} title="Agregar dpto">+</button>
          </div>
        </div>
      ))}
    </div>
  );
} 