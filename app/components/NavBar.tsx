"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MdOutlineHome, MdOutlineMail, MdOutlineHelpOutline, MdOutlineShoppingCart, MdOutlineSettings, MdOutlineDashboard, MdOutlineLogout } from "react-icons/md";
import Link from "next/link";

const azul = "#4a90e2";
const gris = "#999";
const blanco = "#fff";
const navItems = [
  { label: "Inicio", path: "/inicio", icon: MdOutlineHome },
  { label: "Tienda", path: "/tienda", icon: MdOutlineShoppingCart },
  { label: "Ayuda", path: "/admin/ayuda", icon: MdOutlineHelpOutline },
];

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState(0);
  const [userRole, setUserRole] = useState<string>("User");
  const [username, setUsername] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  // Cargar datos de sesión desde localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole");
    const user = localStorage.getItem("username");
    
    if (isLoggedIn === "true" && role) {
      setUserRole(role);
      setUsername(user || "");
    } else {
      // TEMPORAL: Comentado para pruebas
      // router.push("/login");
      setUserRole("Admin"); // Temporal: asignar rol admin
      setUsername("admin"); // Temporal: asignar usuario
    }
  }, [router]);

  // Simulación de roles (luego reemplazar por lógica real de auth)
  const isSuper = userRole === "SuperAdmin";
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

  // Función para abrir configuración según el rol
  const handleConfigClick = () => {
    setShowMenu(false);
    
    if (isAdmin) {
      // Admin: Abrir wizard desde paso 2 (Estructura ya cargada)
      const idUnico = localStorage.getItem('ventaIdUnico');
      if (idUnico) {
        // Cargar datos existentes del edificio
        fetch(`/api/publico/${idUnico}`)
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              // Guardar datos en localStorage
              localStorage.setItem('wizardData', JSON.stringify({
                paso: 2, // Ir directamente al paso de Timbres
                direccion: data.direccion,
                estructura: data.estructura,
                timbres: data.timbres || []
              }));
              // Redirigir al wizard
              router.push(`/admin/wizard-estructura?idUnico=${idUnico}`);
            } else {
              // Si no hay datos, crear estructura básica
              localStorage.setItem('wizardData', JSON.stringify({
                paso: 2,
                direccion: { calle: '', numero: '' },
                estructura: [],
                timbres: []
              }));
              router.push(`/admin/wizard-estructura?idUnico=${idUnico}`);
            }
          })
          .catch(error => {
            console.error('Error cargando datos:', error);
            // En caso de error, ir al wizard con datos básicos
            router.push(`/admin/wizard-estructura?idUnico=${idUnico}`);
          });
      } else {
        // Si no hay IDU, ir al wizard sin datos
        router.push('/admin/wizard-estructura');
      }
    } else {
      // User: Abrir modal de su timbre
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('abrir-modal-timbre-usuario'));
      }
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setShowMenu(false);
    router.push("/login");
  };

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      background: blanco,
      borderTop: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      height: 60,
      zIndex: 100,
      boxShadow: "0 -2px 8px #0001"
    }}>
      {navItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => { setSelected(i); setShowMenu(false); router.push(item.path); }}
            style={{
              background: "none",
              border: "none",
              height: "100%",
              padding: "0 8px",
              color: selected === i ? azul : gris,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: selected === i ? 700 : 600,
              fontSize: 12,
              transition: "color 0.2s",
              flex: 1,
            }}
          >
            <Icon size={28} style={{ marginBottom: 2 }} />
            <span>{item.label}</span>
          </button>
        );
      })}
      {/* Menú hamburguesa mejorado */}
      <button
        onClick={() => setShowMenu((v) => !v)}
        style={{
          background: "none",
          border: "none",
          height: "100%",
          padding: "0 8px",
          color: gris,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: 12,
          flex: 1,
        }}
      >
        <span style={{ height: 28, marginBottom: 2, fontSize: 28, lineHeight: 1 }}>☰</span>
        <span>Menú</span>
      </button>
      {showMenu && (
        <div style={{ 
          position: 'absolute', 
          bottom: '100%', 
          right: 0, 
          background: 'white', 
          borderRadius: 12, 
          boxShadow: '0 -4px 12px rgba(0,0,0,0.1)', 
          zIndex: 100, 
          width: 280, 
          padding: 16, 
          marginBottom: '8px', 
          minHeight: 120 
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Información del usuario */}
            <li style={{ 
              padding: '8px 12px', 
              background: '#f8f9fa', 
              borderRadius: 8, 
              marginBottom: 8,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
                👤 {username}
              </div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                {userRole === 'SuperAdmin' ? '👑 Super Admin' : 
                 userRole === 'Admin' ? '👨‍💼 Admin' : '👤 Usuario'}
              </div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                🏢 ID: {localStorage.getItem('ventaIdUnico') || 'N/A'}
              </div>
            </li>

            {/* Panel - Solo SuperAdmin */}
            {isSuper && (
              <li>
                <button
                  onClick={() => { setShowMenu(false); router.push('/admin/panel'); }}
                  style={{ 
                    background: '#1976d2', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '12px 20px', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    width: '100%', 
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <MdOutlineDashboard size={20} />
                  📊 Panel Administrativo
                </button>
              </li>
            )}
            
            {/* Configuración - Admin y SuperAdmin */}
            {isAdmin && (
              <li>
                <button
                  onClick={handleConfigClick}
                  style={{ 
                    background: '#1a4fa3', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '12px 20px', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    width: '100%', 
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <MdOutlineSettings size={20} />
                  🛠️ Configurar Edificio
                </button>
              </li>
            )}
            
            {/* Configuración - Usuario normal */}
            {!isAdmin && (
              <li>
                <button
                  onClick={handleConfigClick}
                  style={{ 
                    background: '#388e3c', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '12px 20px', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    width: '100%', 
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <MdOutlineSettings size={20} />
                  🔧 Mi Timbre
                </button>
              </li>
            )}

            {/* Separador */}
            <li style={{ borderTop: '1px solid #eee', margin: '8px 0' }}></li>
            
            {/* Cerrar sesión */}
            <li>
              <button
                onClick={handleLogout}
                style={{ 
                  background: '#e74c3c', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '12px 20px', 
                  fontWeight: 700, 
                  cursor: 'pointer', 
                  width: '100%', 
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <MdOutlineLogout size={20} />
                🚪 Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}