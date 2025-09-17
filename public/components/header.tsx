import React, { useEffect, useState } from "react";

export default function Header() {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      setHora(`${hh}:${mm}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.logoArea}>
        <img src="/logo.png" alt="QRingPro" style={styles.logo} />
        <h1 style={styles.title}>QRingPro WebAdmin</h1>
      </div>
      <div style={styles.time}>{hora}</div>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0ea5e9",
    padding: "12px 24px",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "0 0 12px 12px",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: 40,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    margin: 0,
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
  },
};
