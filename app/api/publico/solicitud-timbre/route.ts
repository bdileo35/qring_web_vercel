import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { idUnico, nombre, telefono, departamento } = await request.json();
    
    // Validar datos
    if (!idUnico || !nombre || !telefono || !departamento) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Buscar la dirección
    const direccion = await prisma.direccion.findUnique({
      where: { idUnico }
    });

    if (!direccion) {
      return NextResponse.json(
        { success: false, error: 'Dirección no encontrada' },
        { status: 404 }
      );
    }

    // Extraer piso y dpto del departamento
    const [piso, dpto] = departamento.split('-');
    
    if (!piso || !dpto) {
      return NextResponse.json(
        { success: false, error: 'Formato de departamento inválido' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un timbre para ese piso/dpto
    const timbreExistente = await prisma.timbre.findFirst({
      where: {
        direccionId: direccion.id,
        piso,
        dpto
      }
    });

    if (timbreExistente) {
      // Si ya existe, actualizar el estado a 'solicitado'
      await prisma.timbre.update({
        where: { id: timbreExistente.id },
        data: {
          nombre: nombre,
          numero: telefono,
          estadoAsignacion: 'solicitado',
          esPropio: false
        }
      });
    } else {
      // Si no existe, crear uno nuevo
      await prisma.timbre.create({
        data: {
          direccionId: direccion.id,
          piso,
          dpto,
          nombre: nombre,
          numero: telefono,
          metodo: 'mensaje',
          estado: 'activo',
          estadoAsignacion: 'solicitado',
          esPropio: false
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada correctamente'
    });

  } catch (error) {
    console.error('Error procesando solicitud de timbre:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 