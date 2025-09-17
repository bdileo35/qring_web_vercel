import React from 'react';

const Login: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src="/images/logo.png" alt="QRing Logo" style={styles.logo} />
      </header>
      <div style={styles.content}>
        <p style={styles.welcomeText}>
          Bienvenido a QRing_Pro tu timbre inteligente. <br />
          Inicia sesión para hacer la configuración inicial y acceder al Dashboard para su administración. <br />
          <strong>*Utiliza el Mail que usaste en la compra*</strong>
        </p>
        <form style={styles.form}>
          <label style={styles.label}>Email</label>
          <input type="email" placeholder="Ej. alguien@email.com" style={styles.input} />
          <label style={styles.label}>Password</label>
          <input type="password" placeholder="********" style={styles.input} />
          <div style={styles.socialLogin}>
            <button style={styles.socialButton}>
              <img src="/images/facebook-icon.png" alt="Facebook" style={styles.icon} />
            </button>
            <button style={styles.socialButton}>
              <img src="/images/google-icon.png" alt="Google" style={styles.icon} />
            </button>
          </div>
          <div style={styles.buttons}>
            <button type="button" style={styles.cancelButton}>Cancelar</button>
            <button type="submit" style={styles.acceptButton}>Aceptar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #CCCCCC',
  },
  logo: {
    width: '100px',
  },
  content: {
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center' as const,
  },
  welcomeText: {
    fontSize: '14px',
    marginBottom: '20px',
    color: '#333333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  label: {
    fontSize: '14px',
    color: '#333333',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #CCCCCC',
    borderRadius: '5px',
  },
  socialLogin: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '20px 0',
  },
  socialButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  icon: {
    width: '40px',
    height: '40px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  cancelButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#FFFFFF',
    color: '#007BFF',
    border: '1px solid #007BFF',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  acceptButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Login;