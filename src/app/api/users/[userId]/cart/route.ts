import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { getCart, GetCartResponse } from '@/lib/handlers'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<GetCartResponse> | NextResponse<{ error: string; message: string }>> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid userId' }, { status: 400 })
  }
  const res = await getCart(params.userId)
  if (!res) return NextResponse.json({ error: 'NOT_FOUND', message: 'User not found' }, { status: 404 })
  return NextResponse.json(res)
}
