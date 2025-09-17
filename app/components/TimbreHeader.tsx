import { MdNotificationsActive, MdCheckCircle, MdRadioButtonUnchecked, MdSchedule } from "react-icons/md";

interface TimbreHeaderProps {
  total: number;
  configurados: number;
  asignados: number;
}

export default function TimbreHeader({ total, configurados, asignados }: TimbreHeaderProps) {
  // Calcular disponibles como Total - (Configurados + Asignados)
  const disponibles = total - (configurados + asignados);
  
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: '100%',
      background: "#f8faff",
      borderRadius: 12,
      border: "1px solid #e0e0e0",
      padding: "8px 0 6px 0"
    }}>
      {/* Headers */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: '100%',
        gap: 4
      }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <MdNotificationsActive size={28} color="#1a4fa3" />
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1a4fa3", marginTop: 2 }}>{total}</div>
          <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginTop: 1 }}>Total</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <MdCheckCircle size={28} color="#4CAF50" />
          <div style={{ fontWeight: 700, fontSize: 16, color: "#4CAF50", marginTop: 2 }}>{configurados}</div>
          <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginTop: 1 }}>Config</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <MdSchedule size={28} color="#1976d2" />
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1976d2", marginTop: 2 }}>{asignados}</div>
          <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginTop: 1 }}>Asig</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <MdRadioButtonUnchecked size={28} color="#FF9800" />
          <div style={{ fontWeight: 700, fontSize: 16, color: "#FF9800", marginTop: 2 }}>{disponibles}</div>
          <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginTop: 1 }}>Dispon</div>
        </div>
      </div>
    </div>
  );
} 