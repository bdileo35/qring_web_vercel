import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

/**
 * API de Ventas - Gestión completa de ventas
 * 
 * ENDPOINTS:
 * - GET /api/admin/ventas - Obtener todas las ventas o una específica
 * - POST /api/admin/ventas - Crear nueva venta
 * 
 * FUNCIONALIDADES:
 * - Prevención de duplicados por IDU
 * - Creación automática de dirección si no existe
 * - Validación de datos requeridos
 * - Logging detallado para debugging
 */

/**
 * GET - Obtener ventas
 * 
 * PARÁMETROS:
 * - idUnico (opcional): Si se proporciona, busca una venta específica
 * 
 * RESPUESTA:
 * - Sin idUnico: Lista de todas las ventas ordenadas por fecha de creación
 * - Con idUnico: Venta específica con su dirección incluida
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idUnico = searchParams.get('idUnico');

    if (idUnico) {
      // 🔍 BUSCAR VENTA ESPECÍFICA
      console.log('🔍 Buscando venta específica con IDU:', idUnico);
      
      const venta = await prisma.venta.findFirst({
        where: { idUnico },
        include: {
          direccion: true // Incluir datos de la dirección
        }
      });

      if (!venta) {
        console.log('❌ Venta no encontrada para IDU:', idUnico);
        return NextResponse.json({ 
          success: false, 
          error: 'Venta no encontrada' 
        }, { status: 404 });
      }

      console.log('✅ Venta encontrada:', venta.idUnico);
      return NextResponse.json({ 
        success: true, 
        venta 
      });
    } else {
      // 📋 OBTENER TODAS LAS VENTAS
      console.log('📋 Obteniendo todas las ventas...');
      
      const ventas = await prisma.venta.findMany({
        include: {
          direccion: true // Incluir datos de la dirección
        },
        orderBy: {
          createdAt: 'desc' // Más recientes primero
        }
      });

      console.log(`✅ ${ventas.length} ventas encontradas`);
      return NextResponse.json({ 
        success: true, 
        ventas 
      });
    }
  } catch (error) {
    console.error('❌ Error al obtener ventas:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener ventas' 
    }, { status: 500 });
  }
}

/**
 * POST - Crear nueva venta
 * 
 * DATOS REQUERIDOS:
 * - idUnico: Identificador único de la venta (string)
 * - cantidadTimbres: Cantidad de timbres vendidos (number)
 * - monto: Monto total de la venta (number)
 * - estado: Estado de la venta (opcional, default: 'PAGADA')
 * 
 * VALIDACIONES:
 * - Verifica que no exista una venta con el mismo IDU
 * - Valida que todos los campos requeridos estén presentes
 * - Crea automáticamente una dirección si no existe
 * 
 * PREVENCIÓN DE DUPLICADOS:
 * - Si ya existe una venta con el IDU, retorna la existente
 * - No permite crear ventas duplicadas
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando creación de venta...');
    
    // 📦 PARSEAR DATOS DE ENTRADA
    const body = await request.json();
    console.log('📦 Datos recibidos:', body);
    
    const { idUnico, cantidadTimbres, monto, estado = 'PAGADA' } = body;

    // ✅ VALIDAR DATOS REQUERIDOS
    if (!idUnico || !cantidadTimbres || !monto) {
      console.error('❌ Datos faltantes:', { idUnico, cantidadTimbres, monto });
      return NextResponse.json({ 
        success: false, 
        error: 'Datos faltantes: idUnico, cantidadTimbres, monto son requeridos' 
      }, { status: 400 });
    }

    // 🔍 VERIFICAR SI YA EXISTE UNA VENTA CON ESTE IDU
    console.log('🔍 Verificando si ya existe venta con IDU:', idUnico);
    const ventaExistente = await prisma.venta.findFirst({
      where: { 
        direccion: {
          idUnico: idUnico
        }
      }
    });

    if (ventaExistente) {
      console.log('⚠️ Venta ya existe, retornando existente:', ventaExistente.id);
      return NextResponse.json({ 
        success: true, 
        venta: ventaExistente,
        message: 'Venta existente recuperada'
      });
    }

    console.log('✅ No existe venta previa, procediendo a crear...');

    // 🏗️ VERIFICAR/CREAR DIRECCIÓN
    console.log('🔍 Verificando dirección existente...');
    
    let direccion = await prisma.direccion.findUnique({
      where: { idUnico }
    });

    if (direccion) {
      console.log('✅ Dirección encontrada:', direccion.nombre);
    } else {
      console.log('🏗️ Creando nueva dirección automáticamente...');
      
      // Crear dirección automática si no existe
      direccion = await prisma.direccion.create({
        data: {
          idUnico,
          nombre: `Edificio ${idUnico}`,
          calle: '',
          numero: ''
        }
      });
      console.log('✅ Dirección creada automáticamente:', direccion.nombre);
    }

    // 💰 CREAR NUEVA VENTA
    console.log('💰 Creando nueva venta...');
    
    const venta = await prisma.venta.create({
      data: {
        idUnico,
        cantidadTimbres: parseInt(cantidadTimbres),
        monto: parseInt(monto),
        estado,
        direccionId: direccion.id // Vincular con la dirección
      },
      include: {
        direccion: true // Incluir datos de la dirección en la respuesta
      }
    });

    console.log('✅ Venta creada exitosamente:', {
      idUnico: venta.idUnico,
      cantidadTimbres: venta.cantidadTimbres,
      monto: venta.monto,
      estado: venta.estado
    });

    return NextResponse.json({ 
      success: true, 
      venta,
      direccion,
      message: 'Venta y dirección creadas exitosamente'
    });
  } catch (error) {
    console.error('❌ Error detallado al crear venta:', error);
    if (error instanceof Error) {
      console.error('❌ Stack trace:', error.stack);
      return NextResponse.json({ 
        success: false, 
        error: `Error al crear venta: ${error.message}` 
      }, { status: 500 });
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Error desconocido al crear venta' 
    }, { status: 500 });
  }
} 