import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src="/images/logo.png" alt="QRing Logo" style={styles.logo} />
        <button style={styles.menuButton}>☰</button>
      </header>
      <main style={styles.main}>
        <div style={styles.card}>Timbres Activos: 5</div>
        <div style={styles.card}>Usuarios Registrados: 12</div>
        <div style={styles.card}>Accesos Recientes: 3</div>
      </main>
      <footer style={styles.footer}>
        <button style={styles.footerButton}>🏠</button>
        <button style={styles.footerButton}>🔍</button>
        <button style={styles.addButton}>+</button>
        <button style={styles.footerButton}>💬</button>
        <button style={styles.footerButton}>👤</button>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    backgroundColor: '#F9F9F9',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #CCCCCC',
  },
  logo: {
    width: '100px',
  },
  menuButton: {
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '20px',
    display: 'grid',
    gap: '10px',
  },
  card: {
    padding: '20px',
    color: '#333333', // Cambiado a gris oscuro
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #CCCCCC',
  },
  footerButton: {
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  addButton: {
    fontSize: '24px',
    background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
};

export default Dashboard;