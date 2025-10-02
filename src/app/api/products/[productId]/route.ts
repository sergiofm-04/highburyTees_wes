import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { getProduct, GetProductResponse } from '@/lib/handlers'

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
): Promise<NextResponse<GetProductResponse> | NextResponse<{ error: string; message: string }>> {
  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json(
      { error: 'WRONG_PARAMS', message: 'Invalid productId' },
      { status: 400 }
    )
  }
  const product = await getProduct(params.productId)
  if (!product) {
    return NextResponse.json(
      { error: 'NOT_FOUND', message: 'Product not found' },
      { status: 404 }
    )
  }
  return NextResponse.json(product)
}
