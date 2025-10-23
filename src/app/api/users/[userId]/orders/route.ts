import { NextRequest, NextResponse } from 'next/server'
import { getOrders, createOrder } from '@/lib/handlers'
import Users from '@/models/User'
import { Types } from 'mongoose'
import { getSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
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
    return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid user id' }, { status: 400 })
  }
  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHORIZED', message: 'Unauthorized access.' },
      { status: 403 }
    )
  }
  // 404 if user not found
  const userExists = await Users.exists({ _id: new Types.ObjectId(params.userId) })
  if (!userExists) return NextResponse.json({ error: 'NOT_FOUND', message: 'User not found' }, { status: 404 })

  const res = await getOrders(params.userId)
  if (res === 'INVALID_ID') return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid user id' }, { status: 400 })
  return NextResponse.json(res)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    )
  }
  const body = await request.json().catch(() => ({}))

  // Basic body presence validation
  if (!body.address || !body.cardHolder || !body.cardNumber) {
    return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Missing address/cardHolder/cardNumber' }, { status: 400 })
  }
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid user id' }, { status: 400 })
  }
  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHORIZED', message: 'Unauthorized access.' },
      { status: 403 }
    )
  }
  const res = await createOrder(params.userId, {
    address: body.address,
    cardHolder: body.cardHolder,
    cardNumber: body.cardNumber,
  })

  if (res === 'INVALID_ID') return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid user id' }, { status: 400 })
  if (res === 'NOT_FOUND_USER') return NextResponse.json({ error: 'NOT_FOUND', message: 'User not found' }, { status: 404 })
  if (res === 'EMPTY_CART') return NextResponse.json({ error: 'EMPTY_CART', message: 'Cart is empty' }, { status: 400 })
  const headers = new Headers()
  headers.append('Location', `/api/users/${params.userId}/orders/${res._id}`)
  return NextResponse.json(res, { status: 201, headers })
}
