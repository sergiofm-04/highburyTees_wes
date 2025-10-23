import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { getCart, GetCartResponse } from '@/lib/handlers'
import { getSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<GetCartResponse> | NextResponse<{ error: string; message: string }>> {
  const session = await getSession()

  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    )
  }
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid userId' }, { status: 400 })
  }
  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHORIZED', message: 'Unauthorized access.' },
      { status: 403 }
    )
  }
  const res = await getCart(params.userId)
  if (!res) return NextResponse.json({ error: 'NOT_FOUND', message: 'User not found' }, { status: 404 })
  return NextResponse.json(res)
}
