import React, { useState } from "react";
import Header from "../components/header";

export default function Configuracion() {
  const [tipo, setTipo] = useState("ph");
  const [direccion, setDireccion] = useState({ calle: "", altura: "", cp: "" });
  const [piso, setPiso] = useState("");
  const [unidad, setUnidad] = useState("");
  const [unidades, setUnidades] = useState<{ piso: string; unidad: string }[]>([]);
  const [error, setError] = useState("");

  const validarYAgregarUnidad = () => {
    setError("");

    const pisoValido = tipo === "ph" || piso.toUpperCase() === "PB" || /^[0-9]+$/.test(piso);
    const unidadValida = /^[A-Z0-9]+$/.test(unidad);

    if (!pisoValido) return setError("⚠️ Piso debe ser numérico o 'PB'");
    if (!unidadValida) return setError("⚠️ Dpto/Interno debe ser en mayúsculas (ej: A, B1)");

    setUnidades([...unidades, { piso: tipo === "ph" ? "PB" : piso.toUpperCase(), unidad: unidad.toUpperCase() }]);
    setPiso("");
    setUnidad("");
  };

  const handleGenerarQR = () => {
    if (!direccion.calle || !direccion.altura) {
      alert("⚠️ Debes completar la dirección.");
      return;
    }

    alert(`QR generado para ${direccion.calle} ${direccion.altura}, ${direccion.cp || "s/código postal"}`);
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h2>Configuración de Timbres QRingPro</h2>

        <div style={styles.section}>
          <h3>1. Dirección principal</h3>
          <input
            type="text"
            placeholder="Calle"
            style={styles.input}
            value={direccion.calle}
            onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })}
          />
          <input
            type="text"
            placeholder="Altura"
            style={styles.input}
            value={direccion.altura}
            onChange={(e) => setDireccion({ ...direccion, altura: e.target.value })}
          />
          <input
            type="text"
            placeholder="Código Postal (opcional)"
            style={styles.input}
            value={direccion.cp}
            onChange={(e) => setDireccion({ ...direccion, cp: e.target.value })}
          />
        </div>

        <div style={styles.section}>
          <h3>2. Tipo de estructura</h3>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={styles.select}>
            <option value="ph">🏠 PH</option>
            <option value="edificio">🏢 Edificio</option>
            <option value="empresa">🏢 Empresa</option>
          </select>
        </div>

        <div style={styles.section}>
          <h3>3. Agregar Unidades</h3>
          {tipo !== "ph" && (
            <input
              type="text"
              placeholder="Piso (ej: 1 o PB)"
              value={piso}
              onChange={(e) => setPiso(e.target.value)}
              style={styles.input}
            />
          )}
          <input
            type="text"
            placeholder="Dpto / Interno (ej: A)"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            style={styles.input}
          />
          <button onClick={validarYAgregarUnidad} style={styles.button}>
            + Agregar unidad
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div style={styles.section}>
          <h3>Unidades configuradas:</h3>
          <ul>
            {unidades.map((u, i) => (
              <li key={i}>
                Piso: {u.piso} - Dpto: {u.unidad}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={handleGenerarQR} style={{ ...styles.button, backgroundColor: "#22c55e" }}>
          ✅ Generar QR único
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 32,
    maxWidth: 700,
    margin: "0 auto",
    fontFamily: "Arial",
  },
  section: {
    marginBottom: 24,
  },
  input: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    width: "calc(100% - 20px)",
    maxWidth: 300,
  },
  select: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    width: "100%",
    maxWidth: 300,
  },
  button: {
    padding: 10,
    backgroundColor: "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
};
