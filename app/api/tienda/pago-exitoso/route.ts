import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ventaId = searchParams.get('venta_id');
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');

    if (!ventaId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/tienda?error=venta_no_encontrada`);
    }

    // Buscar la venta
    const venta = await prisma.venta.findUnique({
      where: { id: ventaId }
    });

    if (!venta) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/tienda?error=venta_no_encontrada`);
    }

    // Actualizar el estado de la venta
    await prisma.venta.update({
      where: { id: ventaId },
      data: {
        estado: 'PAGADA'
      }
    });

    // Redirigir al admin con el ID único
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/${venta.idUnico}?pago=exitoso`);

  } catch (error) {
    console.error('Error procesando pago exitoso:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/tienda?error=error_procesando_pago`);
  }
} 