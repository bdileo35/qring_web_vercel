import { NextRequest, NextResponse } from 'next/server';

// Simulación de MP (sin dependencia real)
console.log('⚠️ MP no disponible, usando simulación');

export async function POST(request: NextRequest) {
  try {
    const { cantidadTimbres, idUnico } = await request.json();

    // Validar datos
    if (!cantidadTimbres || !idUnico) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Calcular precio ($10 por timbre)
    const precioPorTimbre = 10;
    const montoTotal = cantidadTimbres * precioPorTimbre;

    console.log('🔍 CREANDO PREFERENCIA MP:', {
      idUnico,
      cantidadTimbres,
      montoTotal,
      timestamp: new Date().toISOString()
    });

    // Usar simulación MP (sin dependencia real)
    console.log('🔄 USANDO SIMULACIÓN MP');
    const preferenceId = `pref_${Date.now()}`;
    const initPoint = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;

    return NextResponse.json({
      preferenceId,
      initPoint,
      simulation: true,
      message: 'Simulación MP - Configura credenciales para producción',
      idUnico,
      montoTotal,
      cantidadTimbres
    });


  } catch (error) {
    console.error('❌ ERROR CREANDO PREFERENCIA MP:', error);
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
} 