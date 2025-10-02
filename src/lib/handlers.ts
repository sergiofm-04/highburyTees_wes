import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import Orders, { Order } from '@/models/Order';
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';

export type ProductDTO = Pick<Product, 'name' | 'price' | 'img' | 'description'> & {
  _id: string;
};

export interface GetProductsResponse {
  products: ProductDTO[];
}

export async function getProducts(): Promise<GetProductsResponse> {
  await connect()

  // Solo inclusión; _id viene incluido por defecto
  const productsProjection = { name: 1, price: 1, img: 1, description: 1 }
  const raw = await Products.find({}, productsProjection).lean<
    (Product & { _id: Types.ObjectId })[]
  >()

  const products: ProductDTO[] = raw.map(p => ({
    _id: p._id.toString(),
    name: p.name,
    price: p.price,
    img: p.img,
    description: p.description,
  }))

  return { products }
}

// =============== Product detail ===============
export type GetProductResponse = ProductDTO | null

export async function getProduct(productId: string): Promise<GetProductResponse> {
  await connect()
  if (!Types.ObjectId.isValid(productId)) return null

  const doc = await Products.findById(productId, {
    name: 1,
    price: 1,
    img: 1,
    description: 1,
  }).lean<(Product & { _id: Types.ObjectId }) | null>()
  if (!doc) return null
  return {
    _id: doc._id.toString(),
    name: doc.name,
    price: doc.price,
    img: doc.img,
    description: doc.description,
  }
}

export interface ErrorResponse {
  error: string
  message: string
}

export interface CreateUserResponse {
  _id: Types.ObjectId
}

export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();

  const prevUser = await Users.find({ email: user.email });

  if (prevUser.length !== 0) {
    return null;
  }

  const doc: User = {
    ...user,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  const newUser = await Users.create(doc);

  return {
    _id: newUser._id,
  };
}

export interface GetUserResponse
  extends Pick<User, 'email' | 'name' | 'surname' | 'address' | 'birthdate'> {
  _id: Types.ObjectId
}

export async function getUser(
  userId: Types.ObjectId | string
): Promise<GetUserResponse | null> {
  await connect()

  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  }
  const user = await Users.findById(userId, userProjection)

  return user
}

// =============== Cart ===============
export interface CartItemDTO {
  product: ProductDTO;
  qty: number;
}
export interface GetCartResponse {
  items: CartItemDTO[];
}

export async function getCart(userId: string): Promise<GetCartResponse | null> {
  await connect()
  if (!Types.ObjectId.isValid(userId)) return null

  const productProjection = { name: 1, price: 1, img: 1, description: 1 }
  const user = await Users.findById(userId, { cartItems: 1 })
    .populate('cartItems.product', productProjection)
    .lean<{ cartItems: { product: Product & { _id: Types.ObjectId }; qty: number }[] } | null>()

  if (!user) return null

  const items: CartItemDTO[] = user.cartItems.map((ci) => ({
    qty: ci.qty,
    product: {
      _id: ci.product._id.toString(),
      name: ci.product.name,
      price: ci.product.price,
      img: ci.product.img,
      description: ci.product.description,
    },
  }))

  return { items }
}

export type UpsertCartItemResponse = GetCartResponse & { created: boolean }

export async function upsertCartItem(
  userId: string,
  productId: string,
  qty: number
): Promise<UpsertCartItemResponse | 'INVALID_IDS' | 'INVALID_QTY' | 'NOT_FOUND_USER' | 'NOT_FOUND_PRODUCT'> {
  await connect()
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) return 'INVALID_IDS'
  if (!Number.isFinite(qty) || qty < 1) return 'INVALID_QTY'

  const [user, product] = await Promise.all([
    Users.findById(userId),
    Products.findById(productId),
  ])
  if (!user) return 'NOT_FOUND_USER'
  if (!product) return 'NOT_FOUND_PRODUCT'

  const idx = user.cartItems.findIndex((ci) => ci.product.toString() === productId)
  const created = idx < 0
  if (created) user.cartItems.push({ product: new Types.ObjectId(productId), qty })
  else user.cartItems[idx].qty = qty
  await user.save()

  // Return current cart
  const populated = await Users.findById(userId, { cartItems: 1 })
    .populate('cartItems.product', { name: 1, price: 1, img: 1, description: 1 })
    .lean<{ cartItems: { product: Product & { _id: Types.ObjectId }; qty: number }[] }>()

  const items: CartItemDTO[] = populated!.cartItems.map((ci) => ({
    qty: ci.qty,
    product: {
      _id: ci.product._id.toString(),
      name: ci.product.name,
      price: ci.product.price,
      img: ci.product.img,
      description: ci.product.description,
    },
  }))
  return { items, created }
}

export type DeleteCartItemResult =
  | { items: CartItemDTO[] }
  | 'INVALID_IDS'
  | 'NOT_FOUND_USER'
  | 'NOT_FOUND_PRODUCT'

export async function deleteCartItem(
  userId: string,
  productId: string
): Promise<DeleteCartItemResult> {
  await connect()
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) return 'INVALID_IDS'

  const productExists = await Products.exists({ _id: new Types.ObjectId(productId) })
  if (!productExists) return 'NOT_FOUND_PRODUCT'

  const user = await Users.findById(userId)
  if (!user) return 'NOT_FOUND_USER'
  // remove any matching item (if none, it's a no-op)
  user.cartItems = user.cartItems.filter(
    (ci) => ci.product.toString() !== productId
  )
  await user.save()

  // Return updated cart populated as DTO
  const populated = await Users.findById(userId, { cartItems: 1 })
    .populate('cartItems.product', { name: 1, price: 1, img: 1, description: 1 })
    .lean<{ cartItems: { product: Product & { _id: Types.ObjectId }; qty: number }[] }>()

  const items: CartItemDTO[] = populated!.cartItems.map((ci) => ({
    qty: ci.qty,
    product: {
      _id: ci.product._id.toString(),
      name: ci.product.name,
      price: ci.product.price,
      img: ci.product.img,
      description: ci.product.description,
    },
  }))
  return { items }
}

// =============== Orders ===============
// Summary/list view: product by id
export interface OrderItemRefDTO { product: string; qty: number; price: number }
export interface OrderDTO {
  _id: string
  user: string
  date: string
  address: string
  cardHolder: string
  cardNumber: string
  items: OrderItemRefDTO[]
}

export interface GetOrdersResponse { orders: OrderDTO[] }

export async function getOrders(userId: string): Promise<GetOrdersResponse | 'INVALID_ID'> {
  await connect()
  if (!Types.ObjectId.isValid(userId)) return 'INVALID_ID'
  const docs = await Orders.find(
    { user: new Types.ObjectId(userId) },
    { user: 1, date: 1, address: 1, cardHolder: 1, cardNumber: 1, items: 1 }
  )
    .sort({ date: -1 })
    .lean<(Order & { _id: Types.ObjectId; user: Types.ObjectId })[]>()

  const orders: OrderDTO[] = docs.map((o) => ({
    _id: o._id.toString(),
    user: o.user.toString(),
    date: new Date(o.date).toISOString(),
    address: o.address,
    cardHolder: o.cardHolder,
    cardNumber: o.cardNumber,
    items: o.items.map((it) => ({ product: (it.product as Types.ObjectId).toString(), qty: it.qty, price: it.price })),
  }))
  return { orders }
}

export interface CreateOrderInput {
  address: string
  cardHolder: string
  cardNumber: string
}
export interface CreateOrderResponse { _id: string }
export type CreateOrderResult = CreateOrderResponse | 'INVALID_ID' | 'EMPTY_CART' | 'NOT_FOUND_USER'

export async function createOrder(
  userId: string,
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  await connect()
  if (!Types.ObjectId.isValid(userId)) return 'INVALID_ID'

  const user = await Users.findById(userId).populate('cartItems.product', { price: 1 }).exec()
  if (!user) return 'NOT_FOUND_USER'
  if (user.cartItems.length === 0) return 'EMPTY_CART'

  // Build order items with current product price
  const items = user.cartItems.map((ci) => {
    const productDoc = ci.product as unknown as Product & { _id: Types.ObjectId; price: number }
    return {
      product: productDoc._id,
      qty: ci.qty,
      price: productDoc.price,
    }
  })

  const orderDoc: Omit<Order, '_id'> = {
    user: new Types.ObjectId(userId),
    date: new Date(),
    address: input.address,
    cardHolder: input.cardHolder,
    cardNumber: input.cardNumber,
    items,
  }

  const order = await Orders.create(orderDoc)

  // Update user: clear cart and append order id if the array exists
  user.cartItems = []
  try {
    // some schemas keep an orders array optionally in the model
    type MaybeOrders = { orders?: Types.ObjectId[] }
    const u = user as unknown as MaybeOrders
    if (Array.isArray(u.orders)) u.orders.push(order._id)
  } catch {}
  await user.save()

  return { _id: order._id.toString() }
}

// Detail view: product fully populated
export interface OrderItemProductDTO { product: ProductDTO; qty: number; price: number }
export interface OrderWithProductsDTO {
  _id: string
  user: string
  date: string
  address: string
  cardHolder: string
  cardNumber: string
  items: OrderItemProductDTO[]
}

export type GetOrderResult = OrderWithProductsDTO | 'INVALID_IDS' | 'NOT_FOUND'
export async function getOrder(
  userId: string,
  orderId: string
): Promise<GetOrderResult> {
  await connect()
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(orderId)) return 'INVALID_IDS'

  const productProjection = { name: 1, price: 1, img: 1, description: 1 }
  const o = await Orders.findOne(
    { _id: new Types.ObjectId(orderId), user: new Types.ObjectId(userId) },
    { user: 1, date: 1, address: 1, cardHolder: 1, cardNumber: 1, items: 1 }
  )
    .populate('items.product', productProjection)
    .lean<
      (Omit<Order, 'items' | 'user'> & {
        _id: Types.ObjectId
        user: Types.ObjectId
        items: { product: Product & { _id: Types.ObjectId }; qty: number; price: number }[]
      }) | null
    >()
  if (!o) return 'NOT_FOUND'

  return {
    _id: o._id.toString(),
    user: o.user.toString(),
    date: new Date(o.date).toISOString(),
    address: o.address,
    cardHolder: o.cardHolder,
    cardNumber: o.cardNumber,
    items: o.items.map((it) => ({
      product: {
        _id: it.product._id.toString(),
        name: it.product.name,
        price: it.product.price,
        img: it.product.img,
        description: it.product.description,
      },
      qty: it.qty,
      price: it.price,
    })),
  }
}
