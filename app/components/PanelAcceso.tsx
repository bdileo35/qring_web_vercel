import { useState } from "react";
import CardContainer from "@/app/components/CardContainer";
import QRCodeDisplay from "@/app/components/QRCodeDisplay";

interface PanelAccesoProps {
  direccion: string;
  qrValue: string;
  pisos?: number[];
  dptos?: string[];
  mostrarBotonesExtra?: boolean;
  onTocarTimbre?: (piso: number | null, dpto: string | null) => void;
  tabInicial?: 'Piso' | 'Dpto';
  azul?: string;
  controlWidth?: number;
  controlRadius?: number;
}

export default function PanelAcceso({
  direccion,
  qrValue,
  pisos = [1,2,3,4,5,6,7,8,9,10],
  dptos = ["A","B","C","D","E","F","G","H"],
  mostrarBotonesExtra = true,
  onTocarTimbre,
  tabInicial = 'Piso',
  azul = "#1a4fa3",
  controlWidth = 320,
  controlRadius = 24,
}: PanelAccesoProps) {
  const [tab, setTab] = useState<'Piso' | 'Dpto'>(tabInicial);
  const [pisoSel, setPisoSel] = useState<number | null>(null);
  const [dptoSel, setDptoSel] = useState<string | null>(null);

  return (
    <CardContainer>
      <div style={{ fontWeight: 800, fontSize: 22, color: azul, marginBottom: 4, textAlign: 'center', lineHeight: 1.1 }}>{direccion}</div>
      <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 8px #0001', padding: 8, margin: '4px 0 0 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: 'linear-gradient(#e3e6ec 0 0) padding-box, linear-gradient(135deg, #bfc5d2 60%, #fff 100%) border-box',
          border: '8px double #bfc5d2',
          borderRadius: 18,
          padding: 12,
          margin: '0 auto',
          boxShadow: '0 2px 8px #bfc5d288',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <QRCodeDisplay value={qrValue} />
        </div>
      </div>
      <div style={{
        width: controlWidth,
        background: '#f8faff',
        border: `1px solid ${azul}`,
        borderRadius: `${controlRadius}px`,
        boxShadow: '0 2px 12px #0001',
        padding: '0 0 0 0',
        margin: '0 auto 10px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 220,
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', margin: 0, width: '100%' }}>
          {['Piso', 'Dpto'].map(opt => (
            <button
              key={opt}
              onClick={() => setTab(opt as 'Piso' | 'Dpto')}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: opt === 'Piso' ? `${controlRadius}px 0 0 0` : `0 ${controlRadius}px 0 0`,
                padding: '10px 0',
                fontSize: 18,
                fontWeight: tab === opt ? 700 : 400,
                background: tab === opt ? azul : '#eaf4ff',
                color: tab === opt ? '#fff' : azul,
                boxShadow: tab === opt ? '0 2px 8px #0002' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: tab === opt ? `2px solid ${azul}` : 'none',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, margin: '10px auto 0 auto', width: '90%' }}>
          {tab === 'Piso' && pisos.map((p) => (
            <button key={p} onClick={() => setPisoSel(p)} style={{ background: pisoSel === p ? azul : '#f4f6fa', color: pisoSel === p ? '#fff' : azul, borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: '10px 0', textAlign: 'center', fontWeight: 800, fontSize: 18, border: pisoSel === p ? `2px solid ${azul}` : '2px solid #e0e0e0', outline: 'none', cursor: 'pointer', transition: 'all 0.2s', minWidth: 0 }}>{p}</button>
          ))}
          {tab === 'Dpto' && dptos.map((d) => (
            <button key={d} onClick={() => setDptoSel(d)} style={{ background: dptoSel === d ? azul : '#f4f6fa', color: dptoSel === d ? '#fff' : azul, borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: '10px 0', textAlign: 'center', fontWeight: 800, fontSize: 18, border: dptoSel === d ? `2px solid ${azul}` : '2px solid #e0e0e0', outline: 'none', cursor: 'pointer', transition: 'all 0.2s', minWidth: 0 }}>{d}</button>
          ))}
        </div>
        <button
          style={{
            marginTop: 12,
            width: '100%',
            background: pisoSel && dptoSel ? azul : '#e0e0e0',
            color: pisoSel && dptoSel ? '#fff' : '#888',
            border: 'none',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: controlRadius,
            borderBottomRightRadius: controlRadius,
            padding: '14px 0',
            fontSize: 24,
            fontWeight: 700,
            boxShadow: '0 2px 8px #0002',
            transition: 'all 0.2s',
            minHeight: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: pisoSel && dptoSel ? 'pointer' : 'not-allowed',
            opacity: pisoSel && dptoSel ? 1 : 0.7,
            marginBottom: 0,
          }}
          disabled={!(pisoSel && dptoSel)}
          onClick={() => onTocarTimbre && onTocarTimbre(pisoSel, dptoSel)}
        >
          Tocar Timbre
          {(pisoSel || dptoSel) && (
            <span style={{ fontSize: 26, fontWeight: 900, marginLeft: 14, letterSpacing: 2 }}>{pisoSel} <span style={{fontWeight:900}}>{dptoSel}</span></span>
          )}
        </button>
      </div>
      {mostrarBotonesExtra && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
          <button
            style={{
              background: azul,
              color: '#fff',
              border: 'none',
              borderRadius: 18,
              padding: '16px 32px',
              fontSize: 20,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #0002',
              transition: 'background 0.2s',
            }}
            onClick={() => window.location.href = '/tienda'}
          >
            Visita la Tienda
          </button>
          <button
            style={{
              background: '#eee',
              color: azul,
              border: 'none',
              borderRadius: 18,
              padding: '16px 32px',
              fontSize: 20,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #0001',
              transition: 'background 0.2s',
            }}
            onClick={() => window.location.href = '/login'}
          >
            Solo Registrados
          </button>
        </div>
      )}
    </CardContainer>
  );
} 