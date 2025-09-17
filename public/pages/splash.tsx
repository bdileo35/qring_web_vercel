import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Splash: React.FC = () => {
  const router = useRouter();
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    const checkSyncData = async () => {
      // Simula la verificación de datos en Sync
      const isDataLoaded = false; // Cambia esto según tu lógica real

      if (isDataLoaded) {
        router.push('/inicio'); // Redirige a Inicio si los datos están cargados
      } else {
        setShowConfigModal(true); // Muestra el modal de configuración
      }
    };

    // Simula un tiempo de carga (como si estuviera verificando datos)
    setTimeout(checkSyncData, 2000);
  }, [router]);

  const handleSaveData = () => {
    // Lógica para guardar los datos
    console.log('Datos guardados');
    router.push('/inicio'); // Redirige a Inicio después de guardar los datos
  };

  return (
    <div style={styles.container}>
      <img src="/images/logo.png" alt="QRing Logo" style={styles.logo} />
      <p style={styles.text}>Cargando datos...</p>

      {showConfigModal && (
        <div style={styles.modal}>
          <p style={styles.modalText}>Debe cargar los datos</p>
          <button style={styles.saveButton} onClick={handleSaveData}>
            Guardar
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: '150px',
    height: '150px',
    marginBottom: '20px',
  },
  text: {
    fontSize: '18px',
    color: '#333333',
  },
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    textAlign: 'center' as const,
  },
  modalText: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#333333', // Cambiado a gris oscuro
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Splash;