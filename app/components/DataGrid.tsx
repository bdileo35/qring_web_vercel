'use client';
import React from 'react';

interface DataGridProps {
  // Configuración de la grilla
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    icon?: React.ReactNode;
  }>;
  
  // Datos
  data: any[];
  
  // Estados
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  
  // Configuración visual
  maxHeight?: string;
  showHeader?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  
  // Acciones
  onRowClick?: (row: any, index: number) => void;
  renderCell?: (column: any, row: any, index: number) => React.ReactNode;
}

export default function DataGrid({
  columns,
  data,
  loading = false,
  loadingText = "Cargando datos...",
  emptyText = "No hay datos disponibles",
  maxHeight = "100%",
  showHeader = true,
  striped = true,
  hoverable = true,
  onRowClick,
  renderCell
}: DataGridProps) {
  
  const gridTemplateColumns = columns.map(col => col.width || '1fr').join(' ');
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#1a4fa3',
        fontSize: 16
      }}>
        {loadingText}
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#fff',
      borderRadius: 0,
      overflow: 'hidden',
      boxShadow: 'none',
      border: 'none',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header de la tabla */}
      {showHeader && (
        <div style={{
          background: '#1a4fa3',
          color: '#fff',
          padding: '8px 16px',
          display: 'grid',
          gridTemplateColumns: gridTemplateColumns,
          gap: '8px',
          fontWeight: 700,
          fontSize: 12,
          alignItems: 'center',
          flexShrink: 0
        }}>
          {columns.map((column, index) => (
            <div 
              key={column.key}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: column.align === 'center' ? 'center' : 
                           column.align === 'right' ? 'flex-end' : 'flex-start',
                gap: 6 
              }}
              title={column.label}
            >
              {column.icon && column.icon}
              {column.label}
            </div>
          ))}
        </div>
      )}

      {/* Cuerpo de la tabla */}
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        maxHeight: maxHeight
      }}>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <div 
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
              style={{
                display: 'grid',
                gridTemplateColumns: gridTemplateColumns,
                gap: '8px',
                padding: '8px 16px',
                borderBottom: '1px solid #e0e3ea',
                background: striped && rowIndex % 2 === 0 ? '#f8faff' : '#fff',
                alignItems: 'center',
                fontSize: 13,
                cursor: onRowClick ? 'pointer' : 'default',
                transition: hoverable ? 'all 0.2s' : 'none',
                ...(hoverable && onRowClick && {
                  ':hover': {
                    background: '#e3f2fd'
                  }
                })
              }}
              onMouseEnter={hoverable && onRowClick ? (e) => {
                e.currentTarget.style.background = '#e3f2fd';
              } : undefined}
              onMouseLeave={hoverable && onRowClick ? (e) => {
                e.currentTarget.style.background = striped && rowIndex % 2 === 0 ? '#f8faff' : '#fff';
              } : undefined}
            >
              {columns.map((column, colIndex) => (
                <div 
                  key={column.key}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: column.align === 'center' ? 'center' : 
                               column.align === 'right' ? 'flex-end' : 'flex-start',
                    color: '#333',
                    fontWeight: 500
                  }}
                >
                  {renderCell ? renderCell(column, row, rowIndex) : row[column.key]}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{
            padding: '32px 16px',
            textAlign: 'center',
            color: '#666',
            fontSize: 14,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
} 