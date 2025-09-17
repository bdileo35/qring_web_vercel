'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";

function getTimeDate() {
  const now = new Date();
  const hora = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const fecha = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  return { hora, fecha };
}

export default function Header() {
  const [time, setTime] = useState(getTimeDate());

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeDate()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      width: "100%",
      height: 64,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      boxSizing: "border-box",
      boxShadow: "0 2px 8px #0001",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 10,
      borderBottom: "1px solid #e0e0e0"
    }}>
      {/* Logo y nombre */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Image src="/logo_qring.png" alt="QRing logo" width={38} height={38} style={{ objectFit: "contain" }} />
        <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>
          <span style={{ color: "#1a4fa3" }}>QR</span><span style={{ color: "#111" }}>ing</span>
        </span>
      </div>
      {/* Clima primero, luego fecha/hora */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ textAlign: "right", lineHeight: 1.1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>{time.hora}</div>
          <div style={{ fontSize: 14, color: "#666" }}>{time.fecha}</div>
        </div>
      </div>
    </header>
  );
} 