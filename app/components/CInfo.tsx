import React from 'react';

const CInfo = ({ texto }: { texto: string }) => {
  return (
    <div style={{
      background: '#eef6ff',
      border: '1px solid #a8cfff',
      borderRadius: '12px',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '16px 0',
      width: '100%',
      maxWidth: '860px',
    }}>
      <span style={{ fontSize: '24px' }}>💡</span>
      <p style={{ margin: 0, color: '#003a75', fontSize: '14px', lineHeight: '1.5' }}>
        {texto}
      </p>
    </div>
  );
};

export default CInfo;
