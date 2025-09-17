"use client";
import { useState } from "react";
import QRCodeDisplay from "@/app/components/QRCodeDisplay";

// Definir tipos localmente
interface Timbre {
  id: string;
  piso: string | number;
  dpto: string;
  estadoAsignacion: string;
}

interface DireccionCompleta {
  id: string;
  idUnico: string;
  calle: string;
  numero: string;
  ciudad: string;
  nombre?: string;
  timbres: Timbre[];
}

// Componente de ayuda contextual
function CInfo({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#eaf4ff',
      borderRadius: 12,
      padding: 14,
      margin: '18px 0 0 0',
      boxShadow: '0 2px 8px #0001',
      textAlign: 'center',
      color: '#1a4fa3',
      fontWeight: 500,
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }}>
      <span role="img" aria-label="idea" style={{ fontSize: 22, marginRight: 8 }}>💡</span>
      {children}
    </div>
  );
}

export default function ConfiguradorEdificio({ direccionInicial }: { direccionInicial: DireccionCompleta }) {
  const [direccion] = useState(direccionInicial);
  const [tab, setTab] = useState<'Piso' | 'Dpto'>('Piso');
  const [pisoSel, setPisoSel] = useState<string | number | null>(null);
  const [dptoSel, setDptoSel] = useState<string | null>(null);

  const pisosConfig = Array.from(new Set(direccion.timbres.map((t: Timbre) => t.piso)));
  const dptosConfig = Array.from(new Set(direccion.timbres.map((t: Timbre) => t.dpto)));
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/acceso/${direccion.idUnico}` : '';

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 420, width: '100%', margin: "0 auto", background: "#fff", borderRadius: 24, boxShadow: "0 4px 24px #0002", padding: '48px 40px 32px 40px', marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <h1 style={{ color: "#1a4fa3", fontWeight: 800, fontSize: 28, marginBottom: 0, textAlign: 'center', marginTop: 0, letterSpacing: 0.5 }}>
          {direccion.nombre || `${direccion.calle} ${direccion.numero}`}
        </h1>
        <div style={{ color: '#222', fontWeight: 500, fontSize: 18, marginBottom: 8, textAlign: 'center', marginTop: 0 }}>{direccion.ciudad}</div>
        <div style={{ background: '#eaf4ff', borderRadius: 16, padding: 16, margin: '18px 0 20px 0', boxShadow: '0 2px 8px #0001' }}>
          <QRCodeDisplay value={qrUrl} />
        </div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 22, width: '100%', justifyContent: 'center' }}>
          <button onClick={() => setTab('Piso')} style={{ fontWeight: tab === 'Piso' ? 700 : 400, fontSize: 18, border: 'none', background: tab === 'Piso' ? '#1a4fa3' : '#eaf4ff', color: tab === 'Piso' ? '#fff' : '#1a4fa3', borderRadius: 24, padding: '12px 38px', boxShadow: tab === 'Piso' ? '0 2px 8px #0002' : 'none', transition: 'all 0.2s', outline: tab === 'Piso' ? '2px solid #1a4fa3' : 'none' }}>Piso {pisoSel !== null && <span style={{ fontSize: 22, fontWeight: 800, marginLeft: 8 }}>{pisoSel}</span>}</button>
          <button onClick={() => setTab('Dpto')} style={{ fontWeight: tab === 'Dpto' ? 700 : 400, fontSize: 18, border: 'none', background: tab === 'Dpto' ? '#1a4fa3' : '#eaf4ff', color: tab === 'Dpto' ? '#fff' : '#1a4fa3', borderRadius: 24, padding: '12px 38px', boxShadow: tab === 'Dpto' ? '0 2px 8px #0002' : 'none', transition: 'all 0.2s', outline: tab === 'Dpto' ? '2px solid #1a4fa3' : 'none' }}>Dpto {dptoSel && <span style={{ fontSize: 22, fontWeight: 800, marginLeft: 8 }}>{dptoSel}</span>}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32, width: '100%' }}>
          {tab === 'Piso' && pisosConfig.map((p, i) => (
            <button key={i} onClick={() => setPisoSel(p)} style={{ fontSize: 20, fontWeight: 700, border: 'none', borderRadius: 16, padding: '18px 0', background: '#fff', color: '#1a4fa3', boxShadow: '0 2px 8px #0002', cursor: 'pointer', transition: 'all 0.2s', width: '100%', margin: 0 }}>{p}</button>
          ))}
          {tab === 'Dpto' && dptosConfig.map((d, i) => (
            <button key={i} onClick={() => setDptoSel(d)} style={{ fontSize: 20, fontWeight: 700, border: 'none', borderRadius: 16, padding: '18px 0', background: '#fff', color: '#1a4fa3', boxShadow: '0 2px 8px #0002', cursor: 'pointer', transition: 'all 0.2s', width: '100%', margin: 0 }}>{d}</button>
          ))}
        </div>
        <button style={{ background: '#1a4fa3', color: '#fff', border: 'none', borderRadius: 16, padding: '18px 0', fontSize: 22, fontWeight: 700, width: '100%', boxShadow: '0 2px 8px #0002', marginTop: 8, opacity: pisoSel && dptoSel ? 1 : 0.5, cursor: pisoSel && dptoSel ? 'pointer' : 'not-allowed', transition: 'all 0.2s', minHeight: 56 }} disabled={!(pisoSel && dptoSel)}>
          Tocar Timbre {pisoSel || ''} {dptoSel || ''}
        </button>
      </div>
      <CInfo>
        <b>¿Sabías que?</b> QRing funciona aunque no estés en casa. Podés atender desde cualquier lugar y tu número está seguro, nadie lo ve.
      </CInfo>
    </div>
  );
} 