import { NextRequest, NextResponse } from 'next/server';

// Función para generar ID único alfanumérico de 8 caracteres
function generateIdUnico(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { cantidadTimbres, precioTotal, precioUnitario, email, nombre } = await request.json();
    
    // 1. Validar datos de entrada
    if (!cantidadTimbres || cantidadTimbres < 1 || !precioTotal || !precioUnitario || !email || !email.includes('@') || !nombre || nombre.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'Datos de entrada inválidos' }, { status: 400 });
    }
    const calculatedTotal = cantidadTimbres * precioUnitario;
    if (Math.abs(calculatedTotal - precioTotal) > 0.01) {
      return NextResponse.json({ success: false, error: 'El precio total no coincide con el cálculo' }, { status: 400 });
    }

    // 2. Crear la venta directamente
    const idUnico = generateIdUnico();
    
    // Crear venta usando la API existente
    const ventaResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/ventas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idUnico,
        cantidadTimbres,
        monto: precioTotal,
        estado: 'PAGADA'
      })
    });
    
    if (!ventaResponse.ok) {
      throw new Error('Error al crear la venta');
    }
    
    const ventaResult = await ventaResponse.json();
    const venta = ventaResult.venta;

    // 3. Responder con éxito
    return NextResponse.json({
      success: true,
      redirectUrl: `/tienda/exito?venta_id=${venta.id}&idUnico=${venta.idUnico}`,
    });

  } catch (error) {
    console.error('Error en POST /api/tienda/simular-pago:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 