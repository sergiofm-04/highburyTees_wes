import { NextRequest, NextResponse } from 'next/server'
import { upsertCartItem, deleteCartItem } from '@/lib/handlers'
import { Types } from 'mongoose'
import { getSession } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    )
  }
  if (!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid ids' }, { status: 400 })
  }
  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHORIZED', message: 'Unauthorized access.' },
      { status: 403 }
    )
  }
  const body = await request.json().catch(() => ({}))
  const qty = Number(body?.qty)

  const result = await upsertCartItem(params.userId, params.productId, qty)
  switch (result) {
    case 'INVALID_QTY':
      return NextResponse.json({ error: 'WRONG_PARAMS', message: 'qty must be >= 1' }, { status: 400 })
    case 'INVALID_IDS':
      return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid ids' }, { status: 400 })
    case 'NOT_FOUND_USER':
      return NextResponse.json({ error: 'NOT_FOUND', message: 'User not found' }, { status: 404 })
    case 'NOT_FOUND_PRODUCT':
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Product not found' }, { status: 404 })
    default:
      // success: 201 if created, 200 if updated
      return NextResponse.json(result, { status: result.created ? 201 : 200 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    )
  }
  if (!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid ids' }, { status: 400 })
  }
  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHORIZED', message: 'Unauthorized access.' },
      { status: 403 }
    )
  }
  const result = await deleteCartItem(params.userId, params.productId)
  switch (result) {
    case 'INVALID_IDS':
      return NextResponse.json({ error: 'WRONG_PARAMS', message: 'Invalid ids' }, { status: 400 })
    case 'NOT_FOUND_PRODUCT':
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Product not found' }, { status: 404 })
    case 'NOT_FOUND_USER':
      return NextResponse.json({ error: 'NOT_FOUND', message: 'User not found' }, { status: 404 })
    default:
      return NextResponse.json(result, { status: 200 })
  }
}
