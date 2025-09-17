import { NextRequest, NextResponse } from 'next/server';

// Importar MP de forma dinámica para evitar errores de tipos
let mercadopago: any;

try {
  mercadopago = require('mercadopago');
  // Configurar MP con credenciales de test
  mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN || 'TEST-xxxxxxxxxxxxxxxxxxxxx'
  });
} catch (error) {
  console.log('⚠️ MP no disponible, usando simulación');
}

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

    // Si MP no está disponible, usar simulación
    if (!mercadopago || !mercadopago.preferences) {
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
    }

    // Crear preferencia real de MP
    const preference = {
      items: [
        {
          title: `QRing - ${cantidadTimbres} timbres`,
          unit_price: precioPorTimbre,
          quantity: cantidadTimbres,
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tienda/exito?idUnico=${idUnico}&cantidad=${cantidadTimbres}&monto=${montoTotal}`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tienda/error`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tienda/pendiente`
      },
      auto_return: "approved",
      external_reference: idUnico,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tienda/webhook`
    };

    console.log('📋 PREFERENCIA CONFIGURADA:', preference);

    const response = await mercadopago.preferences.create(preference);
    
    console.log('✅ PREFERENCIA CREADA:', response.body.id);

    return NextResponse.json({
      preferenceId: response.body.id,
      initPoint: response.body.init_point,
      simulation: false,
      message: 'Preferencia MP creada exitosamente',
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