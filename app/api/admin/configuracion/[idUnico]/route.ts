import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idUnico: string }> }
) {
  try {
    const { idUnico } = await params;
    
    if (!idUnico) {
      return NextResponse.json(
        { success: false, error: 'ID único requerido' },
        { status: 400 }
      );
    }

    console.log('🔍 Recuperando configuración para IDU:', idUnico);

    // Buscar dirección con timbres
    const direccion = await prisma.direccion.findUnique({
      where: { idUnico },
      include: {
        estructura: { orderBy: { orden: 'desc' } },
        timbres: { orderBy: [{ piso: 'asc' }, { dpto: 'asc' }] }
      }
    });

    if (!direccion) {
      return NextResponse.json(
        { success: false, error: 'Dirección no encontrada' },
        { status: 404 }
      );
    }

    // Formatear respuesta
    const configuracion = {
      idUnico: direccion.idUnico,
      direccion: {
        nombre: direccion.nombre,
        calle: direccion.calle,
        numero: direccion.numero,
      },
      estructura: direccion.estructura.map(piso => ({
        nombre: piso.nombre,
        dptos: JSON.parse(piso.dptos),
        orden: piso.orden
      })),
      timbres: direccion.timbres.map(timbre => ({
        id: timbre.id,
        nombre: timbre.nombre,
        piso: timbre.piso,
        dpto: timbre.dpto,
        numero: timbre.numero,
        metodo: timbre.metodo,
        estado: timbre.estado,
        esPropio: timbre.esPropio,
        estadoAsignacion: timbre.estadoAsignacion
      })),
      resumen: {
        totalPisos: direccion.estructura.length,
        totalTimbres: direccion.timbres.length,
        timbresConNumero: direccion.timbres.filter(t => t.numero).length,
        timbresSinNumero: direccion.timbres.filter(t => !t.numero).length
      }
    };

    return NextResponse.json({
      success: true,
      configuracion
    });

  } catch (error) {
    console.error('❌ Error recuperando configuración:', error);
    return NextResponse.json(
      { success: false, error: 'Error al recuperar configuración' },
      { status: 500 }
    );
  }
}
