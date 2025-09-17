'use client';
import React from 'react';
import { IconType } from 'react-icons';

interface PanelLayoutProps {
  // Configuración del header
  title: string;
  headerIcon?: React.ReactNode;
  
  // Configuración del sidebar
  sections: Array<{
    key: string;
    label: string;
    icon: IconType;
  }>;
  currentSection: string;
  onSectionChange: (section: string) => void;
  
  // Contenido central
  children: React.ReactNode;
  
  // Footer dinámico
  footerContent?: React.ReactNode;
  footerDescription?: string;
  
  // Configuración adicional
  showSidebar?: boolean;
  sidebarWidth?: number;
  containerWidth?: number;
}

export default function PanelLayout({
  title,
  headerIcon,
  sections,
  currentSection,
  onSectionChange,
  children,
  footerContent,
  footerDescription,
  showSidebar = true,
  sidebarWidth = 60,
  containerWidth = 1400
}: PanelLayoutProps) {
  const renderContent = () => {
    return children;
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Sidebar */}
      {showSidebar && (
        <div style={{
          width: sidebarWidth || '60px',
          backgroundColor: '#fff',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '20px',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
        }}>
          {sections.map((section, index) => (
            <button
              key={section.key}
              onClick={() => onSectionChange(section.key)}
              style={{
                width: '40px',
                height: '40px',
                marginBottom: '10px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: currentSection === section.key ? '#1a4fa3' : 'transparent',
                color: currentSection === section.key ? '#fff' : '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentSection !== section.key) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                if (currentSection !== section.key) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <section.icon size={18} />
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {headerIcon && (
              <span style={{ fontSize: '24px' }}>{headerIcon}</span>
            )}
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1a4fa3'
            }}>
              {title}
            </h1>
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: '500'
          }}>
            {new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} - {new Date().toLocaleDateString('es-ES')}
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          padding: '10px',
          overflow: 'auto',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            maxWidth: containerWidth || '100%',
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: 'calc(100vh - 200px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}>
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        {footerContent && (
          <div style={{
            backgroundColor: '#fff',
            borderTop: '1px solid #e0e0e0',
            padding: '15px 20px',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
          }}>
            {footerContent}
            {footerDescription && (
              <div style={{ marginTop: '5px', fontSize: '12px', color: '#999' }}>
                {footerDescription}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 