"use client";
import { useState } from "react";
import { MdDashboard, MdLocationCity, MdPeople, MdAttachMoney, MdListAlt, MdSettings, MdMenu, MdChevronLeft } from "react-icons/md";

const SECTIONS = [
  { key: "dashboard", label: "Dashboard", icon: MdDashboard },
  { key: "edificios", label: "Edificios", icon: MdLocationCity },
  { key: "usuarios", label: "Usuarios", icon: MdPeople },
  { key: "ventas", label: "Ventas", icon: MdAttachMoney },
  { key: "logs", label: "Logs", icon: MdListAlt },
  { key: "config", label: "Configuración", icon: MdSettings },
];

export default function SuperPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [section, setSection] = useState("dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fa", display: "flex", flexDirection: "row", width: '100vw' }}>
      {/* SideBar flotante */}
      <div style={{
        width: sidebarOpen ? '25vw' : '7vw',
        minWidth: sidebarOpen ? 135 : 48,
        maxWidth: sidebarOpen ? 220 : 64,
        background: "#fff",
        borderRight: "1.5px solid #e0e3ea",
        boxShadow: "2px 0 12px #0001",
        display: "flex",
        flexDirection: "column",
        alignItems: sidebarOpen ? "flex-start" : "center",
        padding: "12px 0 6px 0",
        transition: "width 0.2s, min-width 0.2s, max-width 0.2s",
        zIndex: 100,
        position: "relative"
      }}>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            color: "#1a4fa3",
            fontSize: 28,
            margin: sidebarOpen ? "0 0 16px 16px" : "0 0 16px 0",
            cursor: "pointer",
            alignSelf: sidebarOpen ? "flex-start" : "center",
            transition: "margin 0.2s"
          }}
          title={sidebarOpen ? "Colapsar menú" : "Expandir menú"}
        >
          {sidebarOpen ? <MdChevronLeft /> : <MdMenu />}
        </button>
        {SECTIONS.map((item) => {
          const Icon = item.icon;
          const selected = section === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: sidebarOpen ? 160 : 48,
                background: selected ? "#eaf4ff" : "none",
                color: selected ? "#1a4fa3" : "#222",
                border: "none",
                borderRadius: 12,
                padding: sidebarOpen ? "10px 18px" : "10px 0",
                margin: "4px 0",
                fontWeight: selected ? 700 : 500,
                fontSize: 17,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              title={item.label}
            >
              <Icon size={28} style={{ minWidth: 28 }} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>
      {/* Card central */}
      <div style={{
        width: '75vw',
        minWidth: 320,
        maxWidth: '100vw',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh"
      }}>
        <div style={{
          width: "100%",
          maxWidth: '90%',
          minHeight: 420,
          background: "#fff",
          borderRadius: 32,
          boxShadow: "0 8px 32px #0002",
          padding: "32px 24px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18
        }}>
          {section === "dashboard" && <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Dashboard</h2>}
          {section === "edificios" && <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Edificios</h2>}
          {section === "usuarios" && <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Usuarios</h2>}
          {section === "ventas" && <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Ventas</h2>}
          {section === "logs" && <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Logs</h2>}
          {section === "config" && <h2 style={{ color: "#1a4fa3", fontWeight: 900, fontSize: 32 }}>Configuración</h2>}
          <div style={{ color: "#888", fontSize: 18, marginTop: 18, textAlign: "center" }}>
            {section === "dashboard" && "Bienvenido al panel de control Super. Aquí verás estadísticas y accesos rápidos."}
            {section === "edificios" && "Gestión de edificios: alta, baja, edición y visualización de edificios cargados."}
            {section === "usuarios" && "Gestión de usuarios: residentes, administradores y permisos."}
            {section === "ventas" && "Visualización de ventas, pagos y facturación."}
            {section === "logs" && "Historial de accesos, eventos y actividad del sistema."}
            {section === "config" && "Configuraciones avanzadas del sistema y preferencias de la cuenta Super."}
          </div>
        </div>
      </div>
    </div>
  );
} 