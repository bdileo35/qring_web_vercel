import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idUnico: string }> }
) {
  try {
    const resolvedParams = await params;
    
    if (!resolvedParams.idUnico) {
      return NextResponse.json(
        { success: false, error: 'ID único requerido' },
        { status: 400 }
      );
    }

    // Buscar la dirección por ID único con todos sus datos relacionados
    const direccion = await prisma.direccion.findUnique({
      where: { idUnico: resolvedParams.idUnico },
      include: {
        timbres: {
          orderBy: [
            { piso: 'desc' },
            { dpto: 'asc' }
          ]
        },
        estructura: {
          orderBy: { orden: 'desc' }
        }
      }
    });

    if (!direccion) {
      return NextResponse.json(
        { success: false, error: 'Dirección no encontrada' },
        { status: 404 }
      );
    }

    // Convertir la estructura de la base de datos al formato esperado por el frontend
    const estructura = direccion.estructura.map(piso => ({
      nombre: piso.nombre,
      dptos: JSON.parse(piso.dptos) // Convertir de JSON string a array
    }));

    // Preparar los datos en el formato esperado
    const datosPublicos = {
      idUnico: direccion.idUnico,
      calle: direccion.calle,
      numero: direccion.numero,
      nombre: direccion.nombre,
      estructura: estructura,
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
      }))
    };

    return NextResponse.json({
      success: true,
      data: datosPublicos
    });

  } catch (error) {
    console.error('Error obteniendo datos públicos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener los datos' },
      { status: 500 }
    );
  }
}
