import { NextRequest, NextResponse } from 'next/server'
import { getOrder } from '@/lib/handlers'
import Users from '@/models/User'
import { Types } from 'mongoose'
import connect from '@/lib/mongoose'
import { getSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; orderId: string } }
) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    )
  }
  // 400 if invalid user id (avoid constructing ObjectId with invalid string)
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid ids' }, { status: 400 })
  }
  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHORIZED', message: 'Unauthorized access.' },
      { status: 403 }
    )
  }
  await connect()
  // 404 if user not found
  const userExists = await Users.exists({ _id: new Types.ObjectId(params.userId) })
  if (!userExists) return NextResponse.json({ error: 'NOT_FOUND', message: 'User not found' }, { status: 404 })

  const res = await getOrder(params.userId, params.orderId)
  if (res === 'INVALID_IDS') return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid ids' }, { status: 400 })
  if (res === 'NOT_FOUND') return NextResponse.json({ error: 'NOT_FOUND', message: 'Order not found' }, { status: 404 })
  return NextResponse.json(res)
}
