import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener configuración actual
export async function GET() {
  try {
    // Por ahora, retornar configuración hardcodeada hasta que Prisma funcione
    const precioPorTimbre = 9800; // Precio que veo en la base de datos
    
    return NextResponse.json({
      success: true,
      configuracion: {
        precioPorTimbre: precioPorTimbre,
        precioFormateado: `$${precioPorTimbre.toLocaleString()}`,
        moneda: 'ARS',
        descripcion: 'QRing - Sistema de timbres inteligentes',
        version: '1.0.0'
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// POST: Actualizar configuración
export async function POST(request: NextRequest) {
  try {
    const { precioPorTimbre, moneda, descripcion } = await request.json();
    
    // Validar precio
    if (precioPorTimbre && (precioPorTimbre < 0 || precioPorTimbre > 1000000)) {
      return NextResponse.json(
        { success: false, error: 'Precio inválido' },
        { status: 400 }
      );
    }
    
    // Actualizar o crear configuración usando upsert
    const configuraciones = [];
    
    if (precioPorTimbre !== undefined) {
      configuraciones.push(
        prisma.configuracion.upsert({
          where: { clave: 'precioPorTimbre' },
          update: { valor: precioPorTimbre.toString() },
          create: {
            clave: 'precioPorTimbre',
            valor: precioPorTimbre.toString(),
            descripcion: 'Precio por timbre en centavos'
          }
        })
      );
    }
    
    if (moneda !== undefined) {
      configuraciones.push(
        prisma.configuracion.upsert({
          where: { clave: 'moneda' },
          update: { valor: moneda },
          create: {
            clave: 'moneda',
            valor: moneda,
            descripcion: 'Moneda del sistema'
          }
        })
      );
    }
    
    if (descripcion !== undefined) {
      configuraciones.push(
        prisma.configuracion.upsert({
          where: { clave: 'descripcion' },
          update: { valor: descripcion },
          create: {
            clave: 'descripcion',
            valor: descripcion,
            descripcion: 'Descripción del sistema'
          }
        })
      );
    }
    
    await Promise.all(configuraciones);
    
    // Obtener configuración actualizada
    const configActualizada = await prisma.configuracion.findMany();
    const configObj: any = {};
    configActualizada.forEach((item: any) => {
      configObj[item.clave] = item.valor;
    });
    
    const precioFinal = parseInt(configObj.precioPorTimbre) || 8900;
    
    return NextResponse.json({
      success: true,
      configuracion: {
        precioPorTimbre: precioFinal,
        precioFormateado: `$${(precioFinal / 100).toFixed(2)}`,
        moneda: configObj.moneda || 'ARS',
        descripcion: configObj.descripcion || 'QRing - Sistema de timbres inteligentes',
        version: configObj.version || '1.0.0'
      },
      message: 'Configuración actualizada exitosamente'
    });
    
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
} 