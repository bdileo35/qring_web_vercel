import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Direccion {
  calle: string;
  numero: string;
}

interface PisoConfig {
  nombre: string;
  dptos: string[];
}

// Función para generar ID único alfanumérico de 8 caracteres
function generateIdUnico(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idUnico = searchParams.get('idUnico');

    if (!idUnico) {
      return NextResponse.json(
        { success: false, error: 'idUnico es requerido' },
        { status: 400 }
      );
    }

    // Buscar la dirección y su estructura
    const direccion = await prisma.direccion.findUnique({
      where: { idUnico },
      include: {
        estructura: {
          orderBy: { orden: 'desc' }
        },
        timbres: true
      }
    });

    if (!direccion) {
      return NextResponse.json(
        { success: false, error: 'Dirección no encontrada' },
        { status: 404 }
      );
    }

    // Organizar timbres por piso
    const estructuraConTimbres = direccion.estructura.map(piso => ({
      ...piso,
      timbres: direccion.timbres.filter(timbre => timbre.piso === piso.nombre)
    }));

    return NextResponse.json({
      success: true,
      estructura: estructuraConTimbres,
      direccion: {
        idUnico: direccion.idUnico,
        nombre: direccion.nombre,
        calle: direccion.calle,
        numero: direccion.numero
      }
    });

  } catch (error) {
    console.error('Error obteniendo estructura:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener la estructura' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando POST /api/admin/estructura');
    const { idUnico, direccion, estructura } = await request.json() as { idUnico?: string; direccion: Direccion; estructura: PisoConfig[] };
    console.log('📦 Datos recibidos:', { idUnico, direccion, estructura });
    
    // Validar datos requeridos
    if (!direccion?.calle || !direccion?.numero) {
      return NextResponse.json(
        { success: false, error: 'La dirección debe incluir calle y número' },
        { status: 400 }
      );
    }

    if (!estructura || !Array.isArray(estructura) || estructura.length === 0) {
      return NextResponse.json(
        { success: false, error: 'La estructura debe ser un array no vacío' },
        { status: 400 }
      );
    }

    // 🔧 CRÍTICO: Usar el idUnico existente o generar uno nuevo
    let idUnicoFinal = idUnico;
    let existingDireccion: any = null;
    
    if (idUnicoFinal) {
      console.log('🔍 Usando idUnico existente:', idUnicoFinal);
      // Verificar si la dirección ya existe
      existingDireccion = await prisma.direccion.findUnique({
        where: { idUnico: idUnicoFinal }
      });
      
      if (existingDireccion) {
        console.log('✅ Dirección encontrada, actualizando estructura...');
        
        // Primero eliminar estructura y timbres existentes
        await prisma.estructura.deleteMany({
          where: { direccionId: existingDireccion.id }
        });
        await prisma.timbre.deleteMany({
          where: { direccionId: existingDireccion.id }
        });
        
        // Actualizar la dirección existente
        const direccionActualizada = await prisma.direccion.update({
          where: { idUnico: idUnicoFinal },
          data: {
            nombre: `${direccion.calle} ${direccion.numero}`,
            calle: direccion.calle,
            numero: direccion.numero,
          },
          include: {
            timbres: true,
            estructura: {
              orderBy: { orden: 'desc' }
            }
          }
        });
        
        // Crear nueva estructura
        const estructuraGuardada = await Promise.all(
          estructura.map(async (piso, index) => {
            return await prisma.estructura.create({
              data: {
                direccionId: existingDireccion.id,
                nombre: piso.nombre,
                dptos: JSON.stringify(piso.dptos.filter(d => d.trim())),
                orden: estructura.length - index
              }
            });
          })
        );
        
        // Crear nuevos timbres
        const timbresGuardados = await Promise.all(
          estructura.flatMap(piso => 
            piso.dptos
              .filter(dpto => dpto.trim())
              .map(dpto => ({
                nombre: `${piso.nombre}${dpto}`,
                piso: piso.nombre,
                dpto: dpto,
                numero: null,
                metodo: 'mensaje',
                estado: 'activo',
                esPropio: false,
                estadoAsignacion: 'libre',
                direccionId: existingDireccion.id
              }))
          ).map(timbreData => prisma.timbre.create({ data: timbreData }))
        );
        
        return NextResponse.json({
          success: true,
          direccion: direccionActualizada,
          estructura: estructuraGuardada,
          timbres: timbresGuardados
        });
      }
    }
    
    // Si no hay idUnico o no existe la dirección, generar uno nuevo
    if (!idUnicoFinal) {
      do {
        idUnicoFinal = generateIdUnico();
        existingDireccion = await prisma.direccion.findUnique({
          where: { idUnico: idUnicoFinal }
        });
      } while (existingDireccion);
      console.log('🆕 Generando nuevo idUnico:', idUnicoFinal);
    }

    // Crear la dirección con todos los campos
    const direccionCreada = await prisma.direccion.create({
      data: {
        idUnico: idUnicoFinal,
        nombre: `${direccion.calle} ${direccion.numero}`,
        calle: direccion.calle,
        numero: direccion.numero,
      }
    });

    // Crear nueva estructura
    const estructuraGuardada = await Promise.all(
      estructura.map(async (piso, index) => {
        return await prisma.estructura.create({
          data: {
            direccionId: direccionCreada.id,
            nombre: piso.nombre,
            dptos: JSON.stringify(piso.dptos.filter(d => d.trim())),
            orden: estructura.length - index
          }
        });
      })
    );
    
    // Crear nuevos timbres
    const timbresGuardados = await Promise.all(
      estructura.flatMap(piso => 
        piso.dptos
          .filter(dpto => dpto.trim())
          .map(dpto => ({
            nombre: `${piso.nombre}${dpto}`,
            piso: piso.nombre,
            dpto: dpto,
            numero: null,
            metodo: 'mensaje',
            estado: 'activo',
            esPropio: false,
            estadoAsignacion: 'libre',
            direccionId: direccionCreada.id
          }))
      ).map(timbreData => prisma.timbre.create({ data: timbreData }))
    );

    return NextResponse.json({
      success: true,
      direccion: direccionCreada,
      estructura: estructuraGuardada,
      timbres: timbresGuardados
    });

  } catch (error) {
    console.error('Error guardando estructura:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar la estructura' },
      { status: 500 }
    );
  }
}
