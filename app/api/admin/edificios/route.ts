import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🏢 Cargando edificios...');

    const edificios = await prisma.direccion.findMany({
      include: {
        estructura: { orderBy: { orden: 'desc' } },
        timbres: { orderBy: [{ piso: 'asc' }, { dpto: 'asc' }] }
      },
      orderBy: { createdAt: 'desc' }
    });

    const edificiosFormateados = edificios.map(edificio => ({
      id: edificio.id,
      idUnico: edificio.idUnico,
      nombre: edificio.nombre,
      calle: edificio.calle,
      numero: edificio.numero,
      createdAt: edificio.createdAt,
      stats: {
        totalTimbres: edificio.timbres.length,
        timbresActivos: edificio.timbres.filter(t => t.estado === 'activo').length,
        timbresConfigurados: edificio.timbres.filter(t => t.numero).length,
        totalDptos: edificio.estructura.reduce((total, piso) => total + JSON.parse(piso.dptos).length, 0),
        cantPisos: edificio.estructura.length
      },
      estructura: edificio.estructura.map(piso => ({
        id: piso.id,
        nombre: piso.nombre,
        dptos: JSON.parse(piso.dptos),
        orden: piso.orden
      })),
      timbres: edificio.timbres.map(timbre => ({
        id: timbre.id,
        nombre: timbre.nombre,
        piso: timbre.piso,
        dpto: timbre.dpto,
        numero: timbre.numero,
        metodo: timbre.metodo,
        estado: timbre.estado,
        esPropio: timbre.esPropio,
        estadoAsignacion: timbre.estadoAsignacion
      }))
    }));

    return NextResponse.json({
      success: true,
      edificios: edificiosFormateados
    });

  } catch (error) {
    console.error('❌ Error cargando edificios:', error);
    return NextResponse.json(
      { success: false, error: 'Error al cargar edificios' },
      { status: 500 }
    );
  }
} 